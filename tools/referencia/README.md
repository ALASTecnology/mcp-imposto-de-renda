# Harness de referência (IRPF 2026)

Ferramenta de desenvolvimento que usa o programa oficial da declaração (PGD IRPF 2026), baixado
pelo próprio desenvolvedor, como **biblioteca** para:

- montar declarações sintéticas a partir de casos JSON (`casos/*.json`), executar o cálculo oficial
  e gravar o resultado esperado em `packages/core/test/golden/2026/<id>.json`;
- gravar a cópia de segurança (`.DBK`) e o arquivo de entrega (`.DEC`) de cada caso pelo próprio
  mecanismo de persistência do programa, em `packages/core/test/fixtures/dbk/2026/<id>.DBK|.DEC`;
- restaurar um `.DBK`/`.DEC` produzido por terceiros (por exemplo, pelo codec do AutoIR) e listar
  integridade, resultado do cálculo e pendências apontadas pelo programa.

## Regras (ADR 0002)

- O JAR oficial **não** é distribuído nem versionado (`vendor/rfb/` é ignorado) e **nunca** roda em
  produção. Este harness roda apenas localmente.
- Nenhuma classe, trecho ou recurso do programa oficial entra no repositório. O código em `src/` é
  próprio e só chama a API pública das classes do JAR. A API foi descoberta com `jar tf`,
  `javap -p` (apenas assinaturas) e reflexão em tempo de execução; nenhum bytecode foi
  descompilado.
- Os casos usam somente dados sintéticos: CPFs, CNPJs e NIT gerados de forma determinística com
  dígitos verificadores válidos (`src/Documentos.java`), nomes fictícios e endereço fixo fictício.
  Os `.DBK`/`.DEC` gerados são dados sintéticos produzidos pelo programa, sem código da Receita.

## Requisitos

- Java 17 ou superior com `javac` (testado com OpenJDK 27); `unzip` e `timeout` no `PATH`.
- O zip do programa em `vendor/rfb/irpf/IRPF2026-1.5.zip`, ou uma pasta já extraída com
  `irpf.jar`, `lib/` e `lib-modulos/`.

## Uso

```sh
tools/referencia/gerar.sh gerar                      # todos os casos de casos/*.json
tools/referencia/gerar.sh gerar tools/referencia/casos/pj-simples-01.json
tools/referencia/gerar.sh verificar caminho/arquivo.DBK
tools/referencia/gerar.sh cpf 42                     # CPF sintético determinístico da semente 42
tools/referencia/gerar.sh cnpj 42
tools/referencia/gerar.sh limpar                     # apaga o cache (programa extraído e classes)
```

Variáveis de ambiente:

| Variável | Padrão | Uso |
|---|---|---|
| `IRPF_DIR` | (vazio) | pasta já extraída do programa; se vazia, o zip é extraído no cache |
| `IRPF_ZIP` | `vendor/rfb/irpf/IRPF2026-1.5.zip` | zip do programa oficial |
| `AUTOIR_REFERENCIA_CACHE` | `$TMPDIR/autoir-referencia` | programa extraído, classes compiladas e execuções temporárias |
| `GOLDEN_DIR` | `packages/core/test/golden/2026` | destino dos casos com `esperado` |
| `FIXTURES_DIR` | `packages/core/test/fixtures/dbk/2026` | destino dos `.DBK`/`.DEC` |
| `JAVA`, `JAVAC` | `java`, `javac` | binários do JDK |
| `TEMPO_MAXIMO` | `300` | limite em segundos de cada JVM |

Cada caso roda numa JVM própria, headless (`-Djava.awt.headless=true`), com `user.home`,
`user.dir` e `java.io.tmpdir` apontando para uma pasta temporária dentro do cache, apagada ao fim.
O programa grava ali `Documents/ProgramasRFB/IRPF2026/aplicacao/dados/<CPF>/`, nunca no repositório
nem na pasta pessoal real. A JVM termina com `Runtime.halt` (o programa cria threads não daemon) e
roda sob `timeout`, então nenhuma JVM fica órfã.

## Formato do caso

Valores monetários são texto com **centavos inteiros** (`"123456"` = R$ 1.234,56). Datas no formato
`DDMMAAAA`. CPF e CNPJ só com dígitos. Campos ausentes valem zero/vazio. O mesmo formato é usado
pelo motor TypeScript; não renomeie campos.

```json
{
  "id": "pj-simples-01",
  "descricao": "...",
  "entrada": {
    "titular": {"cpf": "...", "nome": "...", "nascimento": "DDMMAAAA"},
    "dependentes": [{"cpf": "...", "nome": "...", "nascimento": "DDMMAAAA", "codigo": "21"}],
    "rendimentosPJ": [{"cnpj": "...", "nome": "...", "rendimento": "...", "previdenciaOficial": "...",
      "irrf": "...", "decimoTerceiro": "...", "irrfDecimoTerceiro": "...", "beneficiario": "T|D", "cpfDependente": "?"}],
    "rendimentosPF": {"meses": [{"mes": 1, "pessoaFisica": "...", "exterior": "...", "previdenciaOficial": "...",
      "dependentes": "...", "pensao": "...", "livroCaixa": "...", "carneLeao": "..."}]},
    "pagamentos": [{"codigo": "10|21|26|36|...", "cpfCnpj": "...", "valor": "...", "parcelaNaoDedutivel": "...",
      "beneficiario": "T|D|A", "cpfDependente": "?"}],
    "rendimentosIsentos": [{"codigo": "...", "valor": "..."}],
    "tributacaoExclusiva": [{"codigo": "...", "valor": "..."}],
    "impostoPago": {"complementar": "...", "exterior": "...", "irrfLei11033": "..."},
    "doacoesDiretas": {"eca": "...", "idoso": "..."}
  },
  "esperado": {
    "rendimentosTributaveis": "...", "deducoesCompleto": "...", "baseCalculoCompleto": "...",
    "impostoDevidoCompleto": "...", "descontoSimplificado": "...", "baseCalculoSimplificado": "...",
    "impostoDevidoSimplificado": "...", "impostoRetidoTotal": "...", "saldoPagarCompleto": "...",
    "restituirCompleto": "...", "saldoPagarSimplificado": "...", "restituirSimplificado": "...",
    "modeloMaisVantajoso": "completo|simplificado", "aliquotaEfetiva": "..."
  }
}
```

Os arquivos de `casos/` trazem só `entrada`; o harness grava em `golden/2026/` o caso completo, com
`esperado` preenchido pelo programa oficial.

### Como cada campo de entrada é aplicado no programa

| Campo | Ficha do PGD |
|---|---|
| `titular.cpf`, `titular.nome` | identificador da declaração (ajuste anual, original) |
| `titular.nascimento` | Identificação do Contribuinte, data de nascimento |
| `dependentes[]` | Dependentes (`codigo` = código de dependência da tabela do PGD, por exemplo 11 cônjuge, 21 filho até 21 anos, 22 filho universitário até 24 anos) |
| `rendimentosPJ[]` com `beneficiario` `T` | Rendimentos Tributáveis Recebidos de PJ, titular |
| `rendimentosPJ[]` com `beneficiario` `D` | idem, dependentes (`cpfDependente` obrigatório) |
| `decimoTerceiro` | vai automaticamente para Tributação Exclusiva, código 01 |
| `rendimentosPF.meses[]` | Rendimentos Tributáveis Recebidos de PF e do Exterior, titular, mês a mês |
| `carneLeao` (no mês) | coluna "Imposto pago" (DARF do carnê-leão) |
| `previdenciaOficial` (no mês) | coluna "Previdência oficial"; o harness preenche um NIT sintético, exigido pelo PGD |
| `pagamentos[]` | Pagamentos Efetuados; `beneficiario` `T` titular, `D` dependente, `A` alimentando |
| `beneficiario` `A` | o harness cadastra o alimentando (`cpfDependente`) com decisão judicial fictícia e residência no Brasil |
| `rendimentosIsentos[]` | Rendimentos Isentos, quadros dos códigos 01, 02, 04, 09, 10, 11, 12, 13, 14 e 26 |
| `tributacaoExclusiva[]` | Rendimentos de Tributação Exclusiva, quadros dos códigos 06, 10, 11 e 12 |
| `impostoPago` | Imposto Pago/Retido: complementar, pago no exterior e IRRF da Lei 11.033 |
| `doacoesDiretas` | Doações Diretamente na Declaração, fundo estadual (UF DF) da criança e do adolescente e da pessoa idosa |

Itens de isentos e exclusivos aceitam, opcionalmente, `beneficiario` (`T|D`), `cpfDependente`,
`cnpj` e `nome` da fonte; sem eles o harness usa titular e uma fonte fictícia. Códigos fora das
listas acima falham com mensagem explícita.

Campos que o formato não traz e o harness completa com valores fixos fictícios: endereço (DF),
natureza da ocupação 12, ocupação principal 212, indicativos "declaração original", "sem alteração
cadastral", "sem cônjuge" e "não assumiu residência em 2025", nomes de beneficiários de pagamentos e
nomes de fontes de isentos e exclusivos.

### Significado de cada campo de `esperado`

Todos em centavos inteiros como texto.

| Campo | Valor no programa |
|---|---|
| `rendimentosTributaveis` | total de rendimentos tributáveis do resumo (PJ, PF e exterior, titular e dependentes) |
| `deducoesCompleto` | total de deduções do modelo completo |
| `baseCalculoCompleto` | base de cálculo do completo |
| `impostoDevidoCompleto` | imposto devido do completo, já descontada a dedução de incentivo (doações) |
| `descontoSimplificado` | desconto simplificado (20%, limitado ao teto do exercício) |
| `baseCalculoSimplificado` | base de cálculo do simplificado |
| `impostoDevidoSimplificado` | imposto devido do simplificado |
| `impostoRetidoTotal` | total de imposto pago do completo: IRRF de titular e dependentes, carnê-leão, imposto complementar, imposto pago no exterior e IRRF da Lei 11.033 |
| `saldoPagarCompleto`, `restituirCompleto` | saldo a pagar e imposto a restituir do completo |
| `saldoPagarSimplificado`, `restituirSimplificado` | idem, simplificado |
| `modeloMaisVantajoso` | `simplificado` quando o programa indica que o simplificado é melhor, senão `completo` |
| `aliquotaEfetiva` | alíquota efetiva do modelo mais vantajoso, em centésimos de ponto percentual (`"457"` = 4,57%) |

O `.DBK`/`.DEC` é gravado com o modelo mais vantajoso selecionado, como faria o contribuinte.

## Casos gerados

31 casos em `casos/`, todos com golden e fixtures: isento, cada faixa da tabela anual (isenção,
7,5%, 15%, 22,5%, 27,5%), desconto simplificado abaixo, exatamente no teto e acima, dependentes,
instrução abaixo e acima do limite (titular e dependente), despesas médicas (profissional, plano com
parcela não dedutível, hospital para dependente), PGBL acima e abaixo de 12%, pensão alimentícia
judicial, maior de 65 anos com e sem parcela isenta, carnê-leão, carnê-leão com livro-caixa e
previdência, rendimentos do exterior com imposto pago no exterior, IRRF maior que o devido
(restituição), saldo a pagar, doações ECA e pessoa idosa, 13º salário e tributação exclusiva
(aplicações, JCP, PLR) com isentos (poupança, lucros), imposto complementar, dependente com
rendimento próprio, completo mais vantajoso, várias fontes pagadoras e previdência oficial alta.

Limitações observadas:

- `irrfLei11033`: o programa aceita o valor no cálculo, mas aponta "valor indevido" quando não há
  operações de renda variável, que o formato do caso não cobre. Nenhum caso usa esse campo.
- Doações diretamente na declaração ficam limitadas pelo programa ao valor disponível (3% do
  imposto devido para cada fundo); o caso usa valores dentro do limite.

## Verificação de arquivos de terceiros

`gerar.sh verificar <arquivo>` restaura o arquivo com o importador do programa e imprime JSON com:

- `restaurado` e, em caso de falha, `erro` (mensagem do programa, por exemplo
  `Tamanho da linha diferente ( Registro ) 21.` ou `Registro Header não encontrado.`);
- `integridade`:
  - `crcPrograma`: validação de CRC do programa;
  - `hashPrograma`: validação dos hashes de entrega (só `.DEC`, que tem os registros `HR`, `DR`, `R9`);
  - `controleHeader`: NR_CONTROLE do header conferido pela fórmula abaixo, com o valor calculado
    também pelo próprio método do programa (`calculadoPrograma`);
  - `crcPorLinha`: conferência do CRC de cada registro, com as divergências por linha;
- `modeloGravado`, `resultado` (mesmo formato de `esperado`, recalculado pelo programa);
- `pendencias` (ficha, campo, mensagem, `tipo` erro/aviso/atencao pela severidade do programa) e
  `totalErros`.

As pendências vêm das próprias fichas: fora da interface gráfica, `DeclaracaoIRPF.verificarPendencias`
não agrega as fichas, então o harness consulta cada ficha da declaração por reflexão.

Pendência inerente: a confirmação de que os alimentandos atendem aos requisitos não faz parte do
leiaute do registro 35, por isso qualquer `.DBK` restaurado com alimentandos volta com essa
pendência (o usuário confirma de novo no PGD). É o caso de `pensao-alimenticia-01`; os demais 30
fixtures restauram sem pendências.

## Controles de integridade do arquivo (observados)

- **CRC por registro**: cada linha, exceto o header `IR`, termina com 10 dígitos que são o CRC32
  (decimal, com zeros à esquerda) dos bytes anteriores da mesma linha.
- **NR_CONTROLE do header `IR`** (últimos 10 dígitos da linha): o programa o calcula na gravação em
  `DocumentoAjusteTXT.atualizaHeader`, chamando `RegistroTxt.calculaCRCHeader(prefixo)`, que devolve
  `CRC32(prefixo + linha do header sem os 10 dígitos finais)`. O argumento foi observado em tempo de
  execução (breakpoint via JDI, sem descompilação): o prefixo é
  `<8 primeiros dígitos do CPF>.<extensão em maiúsculas>`, por exemplo `10011265.DBK` e
  `10011265.DEC`. Por isso um `.DBK` e um `.DEC` com a mesma linha de header têm controles
  diferentes. Não depende de caminho, nome real do arquivo, data ou hora (dois `gerar` seguidos
  produzem arquivos idênticos byte a byte). A fórmula confere em todos os 62 fixtures.
- **Tolerância do programa**: a restauração pelo importador do programa **não** confere o
  NR_CONTROLE do header nem o CRC por linha nem os hashes: um `.DBK` com controle `0000000001` ou com
  o CRC de um registro zerado é restaurado normalmente, e `crcPrograma` continua `ok`. Só
  `hashPrograma` (validação dos registros de hash do `.DEC`) detecta conteúdo alterado. O codec do
  AutoIR deve, mesmo assim, gravar os valores corretos.
- O header contém o nome e a versão do sistema operacional e da JVM em que o arquivo foi gerado
  (por exemplo `MAC OS X 27.0 27`), lidos das propriedades do sistema.

## Estrutura

| Arquivo | Papel |
|---|---|
| `gerar.sh` | prepara o programa, compila `src/` no cache e executa cada caso numa JVM isolada |
| `src/Referencia.java` | ponto de entrada: `gerar`, `verificar`, `cpf`, `cnpj` |
| `src/Preenchedor.java` | aplica o bloco `entrada` nas fichas do programa |
| `src/Resultado.java` | extrai o bloco `esperado` dos modelos completo e simplificado |
| `src/Integridade.java` | CRC, hashes e NR_CONTROLE |
| `src/Documentos.java` | CPF, CNPJ e NIT sintéticos determinísticos |
| `src/Json.java` | leitor e escritor JSON mínimo, sem dependências |
| `casos/*.json` | entradas dos casos de referência |
