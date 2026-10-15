# Harness de referência (IRPF 2026)

Ferramenta de desenvolvimento que usa o programa oficial da declaração (PGD IRPF 2026), baixado
pelo próprio desenvolvedor, como **biblioteca** para:

- montar declarações sintéticas a partir de casos JSON (`casos/*.json`), executar o cálculo oficial
  e gravar o resultado esperado em `packages/core/test/golden/2026/<id>.json`;
- gravar a cópia de segurança (`.DBK`) e o arquivo de entrega (`.DEC`) de cada caso pelo próprio
  mecanismo de persistência do programa, em `packages/core/test/fixtures/dbk/2026/<id>.DBK|.DEC`;
- restaurar um `.DBK`/`.DEC` produzido por terceiros (por exemplo, pelo codec do MCP Imposto de Renda) e listar
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
- Só para os casos com `ganhosCapital`: o GCAP 2025 avulso em
  `vendor/rfb/gcap/GCAP2025v1.6.zip` (ou `GCAP_DIR` com `GCAP.jar` e `lib/`). É o GCAP 2025, e não
  o 2026, que exporta para o IRPF 2026: o GCAP 2026 abre "Exportar para o IRPF2027" e o IRPF 2026
  só aceita arquivos `<CPF>-DDMM-DDMM-GCAP-2025.DEC`.
- Só para os casos com `livroCaixaRural`: o programa da Atividade Rural 2025 em
  `vendor/rfb/atividade-rural/AR2025v1.0.zip` (ou `AR_DIR`), pelo mesmo motivo: o de 2026 exporta
  para o IRPF 2027.

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
| `MCP_IMPOSTO_DE_RENDA_REFERENCIA_CACHE` | `$TMPDIR/mcp-imposto-de-renda-referencia` | programa extraído, classes compiladas e execuções temporárias |
| `GOLDEN_DIR` | `packages/core/test/golden/2026` | destino dos casos com `esperado` |
| `FIXTURES_DIR` | `packages/core/test/fixtures/dbk/2026` | destino dos `.DBK`/`.DEC` |
| `JAVA`, `JAVAC` | `java`, `javac` | binários do JDK |
| `TEMPO_MAXIMO` | `300` | limite em segundos de cada JVM |
| `GCAP_DIR` | (vazio) | pasta já extraída do GCAP 2025; se vazia, o zip é extraído no cache |
| `GCAP_ZIP` | `vendor/rfb/gcap/GCAP2025v1.6.zip` | zip do GCAP 2025 |
| `GCAP_FIXTURES_DIR` | `packages/core/test/fixtures/gcap/2026` | destino dos arquivos exportados pelo GCAP |
| `AR_DIR` | (vazio) | pasta já extraída do programa da Atividade Rural 2025; se vazia, o zip é extraído no cache |
| `AR_ZIP` | `vendor/rfb/atividade-rural/AR2025v1.0.zip` | zip do programa da Atividade Rural 2025 |
| `AR_FIXTURES_DIR` | `packages/core/test/fixtures/atividade-rural/2026` | destino dos arquivos exportados pelo Livro Caixa |

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
| `rendimentosIsentos[]` | Rendimentos Isentos, quadros dos códigos 01, 02, 04, 09, 10, 11, 12, 13, 14, 19, 20, 21 e 26 |
| `tributacaoExclusiva[]` | Rendimentos de Tributação Exclusiva, quadros dos códigos 06, 10, 11, 12 e 13 (apostas; o programa grava 14) |
| `atividadeRural` | Atividade Rural no Brasil: um imóvel fictício, `meses[]` com `mes`, `receita` e `despesa`, e `opcao` (`resultado` ou `limite20`) |
| `pgd[]` | operações genéricas sobre a API pública do programa (ver abaixo), antes do cálculo |
| `pgdFinal[]` | idem, depois do cálculo final e antes de gravar (o programa limpa a conta de restituição a cada recálculo) |
| `impostoPago` | Imposto Pago/Retido: complementar, pago no exterior e IRRF da Lei 11.033 |
| `doacoesDiretas` | Doações Diretamente na Declaração, fundo estadual (UF DF) da criança e do adolescente e da pessoa idosa |

Cada operação de `pgd`/`pgdFinal` usa caminhos de getters públicos sem argumentos a partir da
declaração, com valores no formato do programa (`"1234,56"`, datas `DDMMAAAA`):

```json
{"definir": {"getResumo.getCalculoImposto.getBanco": "001"}}
{"incluir": "getAtividadeRural.getBrasil.getIdentificacaoImovel", "campos": {"getNome": "SITIO"}}
{"chamar": "getGCAP.recalcularConsolidacoes"}
```

O motor ignora essas operações: elas só servem a fichas que não mudam o ajuste (conta, contato,
renda variável). Ganho de capital usa o bloco `ganhosCapital` (seção seguinte): dentro do IRPF a
apuração do GCAP só roda pela interface gráfica, e o arquivo sairia com os valores zerados.

### Ganho de capital (`ganhosCapital`)

Cada item é uma alienação, calculada pelo **GCAP 2025 avulso** e importada na declaração como faz
o contribuinte ("Exportar para o IRPF2026" no GCAP e importação no IRPF):

```json
"ganhosCapital": [{"tipo": "imovel|movel|participacao", "descricao": "...", "natureza": "1",
  "dataAquisicao": "DDMMAAAA", "dataAlienacao": "DDMMAAAA", "valorAlienacao": "...",
  "custoCorretagem": "...", "custoAquisicao": "...", "impostoPago": "...",
  "unicoImovel": false, "residencial": false, "conjuntoMesAcimaLimite": false,
  "cnpj": "...", "quantidade": "...", "adquirente": {"cpf": "...", "nome": "..."},
  "campos": [["getCaminho.doGetter", "valor no formato do programa"]]}]
```

`cnpj` e `quantidade` (quotas) valem só para participação; `campos` aplica operações extras na
alienação, depois das demais.

Bem móvel adquirido no exterior: `"exterior": true` e os valores em dólar (centavos de dólar),
com as cotações no formato do programa (4 casas):

```json
{"tipo": "movel", "exterior": true, "origem": "nacional|estrangeira|ambas", "moeda": "USA",
  "dataAquisicao": "DDMMAAAA", "dataAlienacao": "DDMMAAAA", "valorAlienacaoDolar": "...",
  "custoCorretagemDolar": "...", "cotacaoAlienacao": "5,5000", "cotacaoAquisicao": "2,9000",
  "custoAquisicaoNacionalDolar": "...", "custoAquisicaoDolar": "...", "adquirente": {...}}
```

`origem` diz com que rendimentos o bem foi comprado (códigos 1, 2 e 3 do GCAP); a parte nacional
do custo (`custoAquisicaoNacionalDolar`, convertida por `cotacaoAquisicao`) vale para `nacional`
e `ambas`, a estrangeira (`custoAquisicaoDolar`) para `estrangeira` e `ambas`.

Moeda estrangeira em espécie: `"tipo": "moeda"`, com o estoque (centésimos da moeda) e o saldo
em reais de 1º de janeiro e as operações do ano em ordem; a venda traz a cotação do dólar
(até 7 casas, como no programa) e o adquirente:

```json
{"tipo": "moeda", "moeda": "USA", "estoqueInicial": "100000", "saldoInicial": "500000",
  "operacoes": [{"tipo": "compra", "data": "DDMMAAAA", "quantidade": "...", "valor": "..."},
    {"tipo": "venda", "data": "DDMMAAAA", "quantidade": "...", "valor": "...",
     "cotacaoDolar": "5,8000", "adquirente": {"cpf": "...", "nome": "..."}}]}
``` O fluxo, em `gcap/Gcap.java` e `src/ImportacaoGcap.java`:

1. uma JVM com o GCAP (locale `pt_BR`, exigido para quantidades) cria o demonstrativo do titular
   (01/01 a 31/12/2025, residente) e preenche cada alienação **na ordem da interface**: os
   cálculos ficam nos observadores das entidades de negócio e disparam a cada campo; por exemplo,
   "houve reforma" precisa vir antes do custo, e "possui outro imóvel" antes de "outra alienação
   em 5 anos", senão o programa descarta o valor;
2. confere que `VerificarPendenciasAction.obterPendencias` não aponta erros e grava o arquivo de
   exportação com `GravadorCopiaSeguranca.exportarParaIRPF`, o mesmo método que a ação
   "Exportar para o IRPF2026" chama (observado com JDI); o resultado sai em `gcap.json`;
3. a JVM do IRPF descompacta o `.DEC` exportado (zip com o XML do demonstrativo e um
   `config.properties`), lê o XML com `RepositorioXMLDadosGCAP.importaDados`, inclui o
   demonstrativo na ficha GCAP e grava o golden com o bloco `esperadoGcap` e os DBK/DEC. A
   consulta online da versão do GCAP, que o importador do programa faz antes, é pulada: sem rede
   ela falha com "Não foi possível verificar a versão do demonstrativo de Ganhos de Capital.".

O arquivo exportado e o XML de dentro dele vão para `packages/core/test/fixtures/gcap/2026/<id>.DEC`
e `<id>.xml`: com o DBK/DEC gravado depois da importação, formam o par para conferir a importação
do GCAP pelo MCP Imposto de Renda. O `config.properties` traz data, hora, versão da JVM e do
sistema operacional, e o XML a data do último acesso; dois `gerar` seguidos não dão bytes iguais
nesses arquivos (os DBK/DEC continuam determinísticos).

### Livro Caixa da Atividade Rural (`livroCaixaRural`)

Os lançamentos do Livro Caixa são escriturados no **programa da Atividade Rural 2025 avulso**
(`vendor/rfb/atividade-rural/AR2025v1.0.zip`, ou `AR_DIR` com `PgdAtividadeRural.jar` e `lib/`) e o
arquivo exportado é importado na declaração, como faz o contribuinte:

```json
"livroCaixaRural": {"pais": "105", "lancamentos": [{"data": "DDMMAAAA", "conta": "1.01.010",
  "historico": "...", "valor": "..."}]}
```

`conta` é o código do plano de contas básico do programa (grupo 1 receitas, 2 despesas de custeio
e investimento, 3 despesas não dedutíveis, 4 receita de produtos entregues no ano por
adiantamentos de anos anteriores, 5 adiantamentos recebidos para entrega futura); `pais` diferente
de 105 escritura a atividade no exterior, em moeda local. O fluxo, em `ar/Ar.java` e
`src/ImportacaoAr.java`:

1. uma JVM com o programa da Atividade Rural cria a declaração do livro caixa do titular e
   escritura cada lançamento no mês da data; o programa soma os lançamentos no mês e no
   demonstrativo pelos observadores das entidades. Fora da interface gráfica, essa soma consulta a
   janela principal para habilitar menus: o harness registra uma janela alocada sem construtor,
   que nunca é exibida e cujo único método chamado não faz nada;
2. grava o arquivo com `ExportarIRPF.gravaDeclaracao(pasta, id)`, o método da ação "Exportar para
   o IRPF" (`<CPF>-ARURAL-2025-2025-EXPORTA-IRPF2026.DEC`), e o demonstrativo mensal em `ar.json`;
3. a JVM do IRPF importa o arquivo com `RepositorioTxtDadosAtividadeRural.importaDados`, o mesmo
   repositório da ação "Importar Atividade Rural" (confere versão e CRC), e grava o golden com o
   bloco `esperadoLivroCaixaRural` e os DBK/DEC.

É o programa de 2025, e não o de 2026, que exporta para o IRPF 2026: o AR 2026 grava
`...-ARURAL-2026-2026-EXPORTA-IRPF2027.DEC` (header com exercício 2027 e ano-base 2026) e o IRPF
2026 o recusa ("Este arquivo de exportação do Atividade Rural 2025 foi gerado numa versão
desatualizada do aplicativo"). O arquivo exportado vai para
`packages/core/test/fixtures/atividade-rural/2026/<id>.DEC`; com o DBK/DEC gravado depois da
importação, forma o par para conferir `importar_livro_caixa_rural`. Diferente do GCAP, o arquivo
não traz data nem versão da JVM: dois `gerar` seguidos dão bytes iguais.

Bloco `esperadoLivroCaixaRural`: `arquivo` (nome gravado pelo programa) e `meses[]` com
`receitas`, `despesas`, `despesasNaoDedutiveis`, `produtoEntregueAdiantamento` e
`adiantamentoRecebido` de cada mês, em centavos, como o demonstrativo do programa.

Bloco `esperadoGcap` (valores em centavos; percentuais como o programa mostra, 6 casas):

| Campo | Valor no GCAP |
|---|---|
| `alienacoes[].valorLiquido`, `custoAquisicao`, `ganhoBruto` | apuração: valor líquido, custo e ganho (resultado 1) |
| `alienacoes[].reducoes.*` | Lei 7.713/1988, FR1, FR2, aplicação em outro imóvel, único imóvel e pequeno valor (só imóveis detalham) |
| `alienacoes[].percentuaisReducao.*` | percentuais da Lei 7.713/1988, FR1 e FR2 |
| `alienacoes[].ganhoTributavel`, `impostoDevido`, `aliquotaMedia` | cálculo do imposto |
| `alienacoes[].rendimentoIsento`, `rendimentoTributavel` | consolidação: isento e valor transportado para tributação exclusiva |
| `consolidacao.*` | consolidação do demonstrativo (isentos, tributáveis, imposto devido e pago) |
| `consolidacaoExterior.*` | idem, dos bens adquiridos no exterior |
| `alienacoes[].exterior.*` | bem no exterior: líquido em dólar, custo e ganho da parte nacional em reais, ganho da parte estrangeira em dólar e em reais, ganho total e percentual do custo pago com moeda estrangeira |
| `alienacoes[].operacoes[]` (moeda) | estoque, saldo, custo médio, custo da venda e ganho depois de cada operação |
| `moedaEspecie.*` | totalização das moedas em espécie: alienações em dólar (soma dos acumulados de cada mês, como o programa grava), ganho, ganho tributável, imposto devido e pago |

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

65 casos em `casos/`, todos com golden e fixtures (65 `.DBK` e 65 `.DEC`, 130 arquivos). O motor
do MCP Imposto de Renda reproduz os 65 ao centavo (`packages/core/test/calc/golden.test.ts`) e a conversão de
cada DBK em DEC reproduz a DEC do programa byte a byte.

Os 31 casos iniciais cobrem: isento, cada faixa da tabela anual (isenção, 7,5%, 15%, 22,5%,
27,5%), desconto simplificado abaixo, exatamente no teto e acima, dependentes, instrução abaixo e
acima do limite (titular e dependente), despesas médicas (profissional, plano com parcela não
dedutível, hospital para dependente), PGBL acima e abaixo de 12%, pensão alimentícia judicial,
maior de 65 anos com e sem parcela isenta, carnê-leão, carnê-leão com livro-caixa e previdência,
rendimentos do exterior com imposto pago no exterior, IRRF maior que o devido (restituição), saldo a
pagar, doações ECA e pessoa idosa, 13º salário e tributação exclusiva (aplicações, JCP, PLR) com
isentos (poupança, lucros), imposto complementar, dependente com rendimento próprio, completo mais
vantajoso, várias fontes pagadoras e previdência oficial alta.

Os 6 casos seguintes foram criados para investigar regras de arredondamento e limites; o que cada
um confirmou está em `docs/regras/irpf-2026.md`:

| Caso | O que isola |
|---|---|
| `arredondamento-percentuais-01` | 20% do desconto simplificado e 12% do limite do PGBL com fração de centavo acima de meio: o programa trunca |
| `doacoes-acima-limite-01` | doações diretas ao ECA e à pessoa idosa acima de 3% do imposto devido, com 3% gerando fração de centavo: limite aplicado e truncado |
| `empate-modelos-01` | deduções do completo iguais ao desconto simplificado: em empate, o programa indica o completo |
| `exterior-limite-01` | imposto pago no exterior maior que a diferença de imposto atribuível aos rendimentos do exterior: limite de compensação em cada modelo |
| `faixa-limite-075-01` | base exatamente no teto da faixa de 7,5% (R$ 33.919,80), com meio centavo exato: o imposto da tabela é truncado |
| `livro-caixa-excesso-01` | livro-caixa maior que a receita do trabalho não assalariado: o Resumo não limita a dedução e o excesso não passa ao mês seguinte |

Os 11 casos seguintes conferem o leiaute de campos que os anteriores não preenchiam:

| Caso | O que confere |
|---|---|
| `conta-restituicao-01` | conta corrente de restituição, e-mail, telefone, celular e complemento |
| `pix-restituicao-01` | Pix pela chave CPF (`IN_TIPO_CONTA` 4) |
| `caixa-poupanca-01` | poupança da Caixa com operação 013 (prefixo do número da conta) |
| `debito-automatico-01` | 3 quotas com débito automático (conta com 11 dígitos, `IN_RESULTADO_IMPOSTO` 3) |
| `conta-sem-debito-pagar-01` | conta sem débito automático com saldo a pagar: some na DEC |
| `imposto-pago-carne-completo-01` | `IN_IMPOSTO_PAGO` 2 (carnê-leão na completa) |
| `imposto-pago-complementar-completo-01` | `IN_IMPOSTO_PAGO` 4 (complementar na completa) |
| `imposto-pago-complementar-simplificado-01` | `IN_IMPOSTO_PAGO` 6 (complementar na simplificada) |
| `atividade-rural-resultado-01` | resultado rural positivo tributado pelo resultado |
| `renda-variavel-comum-01` | lucro em operação comum de ações, com imposto pago |
| `isentos-detalhados-01` | registros 83, 85, 86 e 89 (isentos 11, 19, 20, 21, 26; exclusivos outros e apostas) |

Os 13 casos de ganho de capital, gerados com o GCAP 2025 e importados no IRPF (o simulador
`calcular_ganho_capital` os reproduz ao centavo em `packages/mcp/test/calculadoras-gcap-golden.test.ts`):

| Caso | O que confere |
|---|---|
| `gcap-imovel-reducao-01` | imóvel de 1985: Lei 7.713/1988 (20%), FR1 e FR2 em cascata, imposto pago em Darf (`VR_GCIMPOSTOPAGO`) |
| `gcap-imovel-unico-01` | único imóvel até R$ 440.000,00: FR2 e isenção do restante (registro 87, código 06) |
| `gcap-imovel-faixas-01` | ganho acima de R$ 5.000.000,00: faixas de 15% e 17,5% (registro 75) |
| `gcap-movel-01` | bem móvel tributado a 15% |
| `gcap-movel-pequeno-valor-01` | bem móvel até R$ 35.000,00 no mês: isento (registro 87, código 05) |
| `gcap-participacao-01` | quotas fora de bolsa tributadas a 15% (registro 73) |
| `gcap-participacao-pequeno-valor-01` | quotas de R$ 30.000,00: isentas, o limite é R$ 35.000,00 |
| `gcap-exterior-estrangeira-01` | bem móvel no exterior comprado com moeda estrangeira: ganho em dólar pela cotação da alienação (registros 64 e 69 tipo 3, exclusivo 03) |
| `gcap-exterior-nacional-01` | bem móvel no exterior comprado com reais: custo pela cotação da aquisição (69 tipo 2) |
| `gcap-exterior-ambas-01` | bem móvel no exterior comprado com as duas origens: rateio pelo custo em dólar (69 tipos 4 e 5) |
| `gcap-exterior-pequeno-valor-01` | bem no exterior de R$ 27.500,00: isento, transportado para o isento 05 |
| `gcap-especie-01` | venda de US$ 6.000,00 em espécie: custo médio ponderado, 15% (registros 74 e 76, exclusivo 04, `VR_VCMOEDAEST` do recibo) |
| `gcap-especie-isento-01` | venda de US$ 2.586,20 em espécie: isenta no GCAP, mas o IRPF transporta o ganho para o exclusivo 04 |

Os 4 casos do Livro Caixa da Atividade Rural, escriturados no programa da Atividade Rural 2025 e
importados no IRPF (`importar_livro_caixa_rural` os reproduz byte a byte em
`packages/core/test/conversao/livro-caixa-rural.test.ts`):

| Caso | O que confere |
|---|---|
| `ar-livro-caixa-01` | receitas e despesas de custeio e investimento em quatro meses; a despesa não dedutível não entra (registro 51) |
| `ar-livro-caixa-adiantamentos-01` | produtos entregues por adiantamentos anteriores e adiantamentos recebidos: somados na Apuração (`VR_ADIANT`, `VR_RECVENDAFUTURA` do 52), fora dos meses |
| `ar-livro-caixa-substitui-01` | meses já digitados são substituídos; com o limite de 20%, o resultado não tributável vai para o isento 15 e fica fora do registro 17 |
| `ar-livro-caixa-exterior-01` | atividade nos Estados Unidos: receita e despesa do ano em moeda original na aba Exterior (registro 56), sem apuração enquanto o resultado em dólar não é informado |

Limitações observadas:

- `irrfLei11033`: o programa aceita o valor no cálculo, mas aponta "valor indevido" quando não há
  operações de renda variável, que o formato do caso não cobre. Nenhum caso usa esse campo.
- Doações diretamente na declaração ficam limitadas pelo programa ao valor disponível (3% do
  imposto devido para cada fundo, com a fração de centavo truncada). `doacoes-eca-idoso-01` usa
  valores dentro do limite e `doacoes-acima-limite-01`, acima dele.

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
pendência (o usuário confirma de novo no PGD). É o caso de `pensao-alimenticia-01`, o único dos
37 casos com alimentando.

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
  produzem arquivos idênticos byte a byte). A fórmula confere em todos os 74 fixtures.
- **Tolerância do programa**: a restauração pelo importador do programa **não** confere o
  NR_CONTROLE do header nem o CRC por linha nem os hashes: um `.DBK` com controle `0000000001` ou com
  o CRC de um registro zerado é restaurado normalmente, e `crcPrograma` continua `ok`. Só
  `hashPrograma` (validação dos registros de hash do `.DEC`) detecta conteúdo alterado. O codec do
  MCP Imposto de Renda deve, mesmo assim, gravar os valores corretos.
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
| `src/ImportacaoGcap.java` | importa no IRPF o arquivo exportado pelo GCAP e copia o par para as fixtures |
| `gcap/Gcap.java` | JVM do GCAP 2025: preenche as alienações, confere pendências e exporta para o IRPF |
| `ar/Ar.java` | JVM da Atividade Rural 2025: escritura o Livro Caixa e exporta para o IRPF |
| `src/ImportacaoAr.java` | importa no IRPF o arquivo exportado pelo Livro Caixa e copia o arquivo para as fixtures |
| `casos/*.json` | entradas dos casos de referência |
