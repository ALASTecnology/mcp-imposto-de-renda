# Formato do arquivo da declaração (DEC e DBK)

Este documento descreve o arquivo gravado pelo programa da declaração do IRPF (PGD) e como o
codec do AutoIR (`packages/core/src/dbk`) o lê e grava. Vale para o exercício 2026; os demais
exercícios seguem a mesma estrutura com leiautes próprios.

- **DEC**: arquivo da declaração gravado para entrega. O programa já o grava com os registros
  `HR`, `DR` e `R9` ao final (o "recibo"); depois da transmissão pode trazer também o
  complemento do recibo.
- **DBK**: cópia de segurança. Mesmos registros da DEC até o `T9`, sem `HR`, `DR` e `R9`.

Comparando os 37 pares DBK/DEC gravados pelo programa (`packages/core/test/fixtures/dbk/2026`),
as únicas diferenças são: o `NR_CONTROLE` do header (o tipo de arquivo entra no cálculo, ver
abaixo) e os registros `HR`, `DR` e `R9`, presentes só na DEC. Header, fichas e `T9` são
idênticos byte a byte.

## Estrutura geral

- Texto em ISO-8859-1 (latin-1): cada caractere ocupa um byte.
- Uma linha por registro, terminada por CRLF (`0D 0A`), inclusive a última.
- Campos em posições fixas. O tamanho de cada linha é fixo por tipo de registro.
- O tipo do registro está nos 2 primeiros caracteres da linha (`tamtipo="2"` no leiaute):
  `IR` no header (o campo `SISTEMA` grava `IRPF` seguido de 4 espaços), `16` a `99` nas
  fichas, `T9` no fechamento e `HR`, `DR`, `R9` no recibo.
- O exercício fica nas posições 9 a 12 do header; o codec usa esse valor para escolher o
  leiaute quando nenhum é informado.

Ordem dos registros (leiautes oficiais publicados):

```
IR                        header, uma ocorrência
16, 17, 18 ... 99         fichas, conforme o caso, em ordem crescente de tipo
T9                        fechamento com totais de controle, uma ocorrência
HR, DR, R9                recibo de entrega (somente na DEC)
```

### Formatos de campo

| Formato | Conteúdo no arquivo | Valor no codec |
| --- | --- | --- |
| `C` caractere | alinhado à esquerda, completado com espaços | `string` sem os espaços finais |
| `A` alfabético | idem `C` | `string` |
| `I` indicador | idem `C` (por exemplo `S`/`N`) | `string` |
| `N` numérico | alinhado à direita, completado com zeros; valor monetário negativo leva `-` na primeira posição (`-000000300000`) | `bigint` |
| `N` de data | 8 dígitos `DDMMAAAA` (4 campos usam `AAAAMMDD`) | `string` de 8 dígitos |
| qualquer, em branco | só espaços | `null` |

Valores monetários são numéricos com 2 casas decimais implícitas: `0000000123456` é
R$ 1.234,56 e vira `123456n`, ou seja, centavos (`Centavos`). Nada passa por ponto flutuante.
`centavosDoCampo` devolve o valor já tipado como `Centavos`. Há também campos com 1, 4 e 6
casas (cotações, percentuais e quantidades); o número de casas fica em `decimais` no leiaute.

O codec rejeita, com erro tipado e número da linha: linha com tamanho diferente do tipo,
tipo desconhecido, terminador que não seja CRLF, número com caractere não numérico, sinal
fora da primeira posição ou sinal em campo sem casas decimais, data impossível, caractere fora
do ISO-8859-1, quebra de linha dentro de campo, valor negativo em campo sem casas decimais,
valor ou texto maior que o campo e registro com campo ausente ou desconhecido.

Valores negativos: o programa grava, por exemplo, a base de cálculo mensal do carnê-leão
negativa (registro 22, `VR_BASECALCULO`, quando o livro-caixa supera a receita do mês) como
`-000000300000`, ou seja, o sinal ocupa a primeira posição e os dígitos restantes vêm com zeros
à esquerda. Observado no fixture `livro-caixa-excesso-01`. O codec aceita e grava esse formato
em campos `N` com casas decimais.

## Tipos de registro do exercício 2026

O leiaute gerado tem 96 tipos e 1855 campos. A coluna **Fonte** indica de onde vieram os
campos: **M** para `mapeamentoTxt.xml`, **L** para `LayoutDadosDIRPF2026.xml` (ver
"Como regenerar").

| Código | Nome | Finalidade | Tamanho | Fonte |
| --- | --- | --- | ---: | :---: |
| IR | Header | Identificação da declaração, exercício, versão e `NR_HASH` | 1244 | M |
| 16 | Identificação do declarante | Nome, endereço, ocupação e conta | 930 | M |
| 17 | Demais rendimentos e imposto pago (simplificada) | Campos fora da tela Resumo | 361 | M |
| 18 | Totais da declaração simplificada | Campos da ficha Resumo | 744 | M |
| 19 | Declaração completa | Campos fora da tela Resumo | 346 | M |
| 20 | Totais da declaração completa | Campos da ficha Resumo | 926 | M |
| 21 | Rendimentos de PJ do titular | Uma linha por fonte pagadora | 170 | M |
| 22 | Rendimentos de PF e do exterior | Uma linha por mês, titular ou dependente (carnê-leão) | 167 | M |
| 23 | Rendimentos isentos e não tributáveis | Código do rendimento e valor | 40 | M |
| 24 | Rendimentos de tributação exclusiva | Código do rendimento e valor | 40 | M |
| 25 | Dependentes | Um dependente por linha | 224 | M |
| 26 | Pagamentos efetuados | Um pagamento por linha | 671 | M |
| 27 | Bens e direitos | Um bem por linha | 1251 | M |
| 28 | Dívidas e ônus reais | Uma dívida por linha | 576 | M |
| 29 | Cônjuge (desativado desde 2016) | Mantido no leiaute de dados | 113 | L |
| 30 | Inventariante | Declaração de espólio | 164 | M |
| 31 | Pensão (rendimentos isentos) | Detalhe da ficha | 179 | M |
| 32 | Rendimentos de PJ dos dependentes | Uma linha por fonte pagadora | 181 | M |
| 33 | Lucros e dividendos | Detalhe da ficha | 127 | M |
| 34 | Doações a partidos e campanhas | Uma doação por linha | 110 | M |
| 35 | Alimentandos | Um alimentando por linha | 331 | M |
| 36 | Proprietários ou usufrutuários do bem | Complemento de bens | 46 | M |
| 37 | Incorporação de reservas e bonificações | Detalhe de isentos | 103 | M |
| 38 | Final de espólio | Declaração final de espólio | 468 | M |
| 39 | Saída definitiva do país | Declaração de saída | 193 | M |
| 40 | Renda variável, mensal | Operações comuns e day trade | 641 | M |
| 41 | Renda variável, totais anuais | Totais | 153 | M |
| 42 | Fundos imobiliários, mensal | Operações com FII | 170 | M |
| 43 | Renda variável FII, totais anuais | Totais | 114 | M |
| 45 | Rendimentos recebidos acumuladamente, titular | RRA | 216 | M |
| 46 | Pensão em RRA, titular | Detalhe de RRA | 48 | M |
| 47 | Rendimentos recebidos acumuladamente, dependentes | RRA | 227 | M |
| 48 | Pensão em RRA, dependentes | Detalhe de RRA | 48 | M |
| 49 | Lançamentos de PF e exterior (carnê-leão) | Lançamentos mensais | 71 | M |
| 50 a 57 | Atividade rural | Identificação, receitas e despesas, apuração, rebanho, bens, dívidas, exterior, proprietários | 52 a 575 | M |
| 58 | Herdeiros | Espólio | 102 | M |
| 59 | Percentual do bem | Espólio | 38 | M |
| 60 a 76 | Ganhos de capital (GCAP) | Bens, apurações, parcelas, adquirentes, moeda estrangeira | 116 a 926 | M |
| 77, 78 | Ganhos de capital (totais) | Mantidos no leiaute de dados | 101 a 102 | L |
| 80, 81 | Rendimentos de PJ com exigibilidade suspensa | Titular e dependentes | 123 a 134 | M |
| 82 a 89 | Detalhes de rendimentos isentos | Transferências, residência médica, meação, ações, ouro, aposentadoria, microempresa | 52 a 191 | M |
| 90 a 92 | Doações | Efetuadas, ECA e Estatuto do Idoso | 93 a 126 | M |
| 93 a 99 | Detalhes de isentos e exclusivos | Indenizações, IRRF de anos anteriores, JCP, PLR, outros, poupança, aplicações | 127 a 188 | M |
| T9 | Fechamento | Totais de registros e controle | 449 | M |
| HR | Header do recibo | Recibo de entrega | 26 | M |
| DR | Recibo de entrega | Dados do recibo | 516 | M |
| R9 | Fechamento do recibo | Hash do recibo | 36 | M |
| FR | Dados de entrega | Não aparece nos arquivos DEC e DBK observados | 256 | L |
| HC, RC, NC, VC, MC, TC | Complemento do recibo | Arquivo de complemento do recibo | 26 a 262 | L |
| SR | Header de salvar e recuperar online | Origem da declaração | 39 | M |
| IP | Imposto pago | Imposto complementar | 36 | M |

A lista completa, campo a campo (nome, posição inicial, tamanho, formato, decimais e
descrição), está em `packages/core/src/dbk/leiautes/2026.ts`.

## Controles de integridade

Quatro mecanismos protegem o arquivo. Os leiautes oficiais publicados (2016 a 2023) apenas
nomeiam os campos e dizem que o `NR_HASH` é "calculado sobre todos os registros da
declaração, exceto o header e os registros do recibo"; nenhum descreve o algoritmo. O que
segue foi obtido testando hipóteses contra arquivos DBK e DEC de 2026 gravados pelo programa
oficial com dados sintéticos (`packages/core/test/fixtures/dbk/2026`).

| Controle | Algoritmo | Situação |
| --- | --- | --- |
| `NR_CONTROLE` de cada registro (exceto header) | CRC-32 da linha sem os 10 últimos caracteres | confirmado |
| Contagens `QT_R<tipo>` do `T9` | quantidade de registros de cada tipo | confirmado |
| `QT_TOTAL` do `T9` | registros da declaração antes do `T9`, header incluído | confirmado |
| `NR_HASH` do header | CRC-32 das linhas seguintes ao header, `T9` incluído | confirmado |
| `NR_CONTROLE` do header | CRC-32 de `<8 primeiros dígitos do CPF>.<DBK ou DEC>` seguido da linha do header sem o controle | confirmado |
| `NR_HASH` do `R9` | CRC-32 das linhas entre o header e o `R9` (fichas, `T9`, `HR` e `DR`) | confirmado |

### Número de controle de registro

`NR_CONTROLE` são os 10 últimos caracteres de cada linha. O valor é o CRC-32 padrão (o mesmo
do zlib e do PKZIP: polinômio refletido `0xEDB88320`, valor inicial e XOR final
`0xFFFFFFFF`) calculado sobre os bytes latin-1 dos demais caracteres da linha, escrito em
decimal com zeros à esquerda até 10 dígitos. Exemplo: o CRC-32 de `123456789` é
`3421780262`. Vale para as fichas, para o `T9` e para os registros do recibo.

### Fechamento T9

Para cada campo `QT_R<tipo>`, a quantidade de registros daquele tipo. `QT_TOTAL` é a
quantidade de registros da declaração antes do `T9` (o header conta; o próprio `T9` e o
recibo não). Os campos `Filler` ficam como estão. Depois das contagens, o `NR_CONTROLE` do
`T9` é recalculado como o de qualquer registro.

### Hash do header

`NR_HASH` (posições 102 a 111 do header) é o CRC-32 da concatenação, sem terminadores de
linha, das linhas completas (com os respectivos `NR_CONTROLE`) que vêm depois do header até o
`T9`, inclusive. Os registros do recibo não entram. Por isso a ordem de cálculo é: contagens
do `T9`, `NR_CONTROLE` de cada registro, `NR_HASH` do header.

### Número de controle do header

O `NR_CONTROLE` do header (últimos 10 caracteres da linha `IR`) é o CRC-32 do texto
`<8 primeiros dígitos do CPF>.<EXTENSÃO>` seguido da linha do header sem esses 10 caracteres,
com a extensão em maiúsculas: `DBK` na cópia de segurança e `DEC` no arquivo de entrega. Por
exemplo, para o CPF `10011265566` o prefixo é `10011265.DBK` ou `10011265.DEC`; por isso um DBK
e uma DEC com a mesma linha de header têm controles diferentes. O valor não depende de caminho,
do nome real do arquivo, de data ou de hora. A fórmula foi observada no harness de referência
(`tools/referencia`, que chama o método público do programa e compara) e confere nos 74
arquivos de `packages/core/test/fixtures/dbk/2026` (37 DBK e 37 DEC).

`recalcularControles(registros, { tipoArquivo })` grava esse valor por padrão
(`controleHeader: "programa"`). Sem `tipoArquivo`, o tipo é inferido: `DEC` se houver registros
do recibo, senão `DBK` (`inferirTipoArquivo`); ao ler de disco, `tipoArquivoPorNome(nome)` usa
a extensão. `controleHeader: "preservar"` mantém o valor atual e `controleHeader: "crc"` grava o
CRC-32 só da linha (não reproduz o programa). `verificarControles(registros, { tipoArquivo })`
acusa divergência no `NR_CONTROLE` do header e informa `controleHeaderConfere` e o
`tipoArquivo` usado. Sem o campo `NR_CPF` no header (leiautes de teste), o controle do header
não é calculado nem conferido.

### Hash do recibo (R9)

O `NR_HASH` do `R9` (posições 17 a 26) é o CRC-32 da concatenação, sem terminadores, das linhas
completas entre o header e o `R9`: fichas, `T9`, `HR` e `DR`, cada uma com o seu `NR_CONTROLE`.
Confere nas 37 DEC dos fixtures. A ordem de cálculo, portanto, é: contagens do `T9`,
`NR_CONTROLE` de cada registro (inclusive `HR` e `DR`), `NR_HASH` do `R9`, `NR_CONTROLE` do `R9`,
`NR_HASH` do header e, por último, `NR_CONTROLE` do header. `recalcularControles` segue essa
ordem e `verificarControles` confere o `NR_HASH` do `R9`. O complemento do recibo (`HC`, `RC`,
`NC`, `VC`, `MC`, `TC`), emitido pela Receita Federal na transmissão, não tem hash recalculado.

### Conversão entre DBK e DEC

`converterTipoArquivo(registros, "DBK")` retira `HR`, `DR`, `R9` (e qualquer complemento do
recibo) e recalcula os controles como DBK; aplicada às 37 DEC dos fixtures, produz o DBK do
programa byte a byte. `converterTipoArquivo(registros, "DEC")` só funciona quando os registros
já trazem o recibo (recalcula os controles como DEC). A conversão de DBK em DEC não é feita
porque não basta trocar o header: a DEC exige os registros `HR` (CPF e controle), `DR` e `R9`.
O `DR` repete dados que estão em outras fichas, observados nos fixtures: `NR_CPF`,
`IN_COMPLETA`, `NM_NOME` e `SG_UF` do header ou da ficha 16; endereço (`TIP_LOGRA`, `NM_LOGRA`,
`NR_NUMERO`, `NM_BAIRRO`, `NR_CEP`, `CD_MUNICIP`, `NM_MUNICIP`) da ficha 16; `VR_TOTTRIB`
(`VR_TOTAL_RENDTRIB_PFPJ_TITDEP` do header), `VR_IMPDEV` (`VR_IMPDEVIDO`), `VR_IMPPAGAR` e
`VR_QUOTA` (`VR_SOMA_IMPOSTO_PAGAR`), `NR_QUOTAS` (ficha 16). `VR_IMPREST`, banco, agência, conta,
e-mail e telefone não tiveram a origem determinada com os fixtures atuais (todos sem conta
bancária, e-mail ou telefone). Montar o `DR` fica como pendência; com ele, o `R9` sai da regra
acima.

### Diagnóstico

`verificarControles(registros)` confere tudo o que está confirmado e devolve as divergências
com linha, tipo, campo, valor esperado e valor gravado. Também lista quais variantes do
`NR_HASH` (`VARIANTES_HASH`: linhas, linhas com CRLF, linhas sem o controle ou só os
controles, com e sem o `T9`) e quais interpretações de `QT_TOTAL` reproduzem o arquivo. Os
testes com arquivos reais exigem `linhas+T9` e `declaracao-sem-T9`; se um exercício futuro
mudar o algoritmo, o diagnóstico mostra qual variante passou a valer.

## API

```ts
import {
  lerArquivo,
  gravarArquivo,
  criarRegistro,
  recalcularControles,
  verificarControles,
  centavosDoCampo,
  LEIAUTE_2026,
} from "@autoir/core/dbk"; // hoje: packages/core/src/dbk/index.ts

const arquivo = lerArquivo(bytes); // { exercicio, registros, terminadorFinal }
const novos = recalcularControles(arquivo.registros);
const saida = gravarArquivo(novos, { terminadorFinal: arquivo.terminadorFinal });
```

- `lerArquivo(bytes, { leiaute? })` e `gravarArquivo(registros, { leiaute?, terminadorFinal? })`
  fazem ida e volta byte a byte.
- `criarRegistro(leiaute, tipo, campos?)` monta um registro com identificador preenchido,
  textos vazios, números zerados e datas em branco.
- `decodificarRegistro` e `codificarRegistro` trabalham com uma linha isolada.
- `recalcularControles(registros, { tipoArquivo?, controleHeader? })` e
  `verificarControles(registros, { tipoArquivo? })`, com `TipoArquivo = "DBK" | "DEC"`.
- `calcularControleHeader(linhaSemControle, cpf, tipoArquivo)`, `calcularHashRecibo`,
  `inferirTipoArquivo`, `tipoArquivoPorNome` e `converterTipoArquivo(registros, destino)`.
- Erros: `ArquivoDeclaracaoError` e subclasses (`TipoRegistroDesconhecidoError`,
  `TamanhoLinhaInvalidoError`, `TerminadorLinhaInvalidoError`, `CampoInvalidoError`,
  `CaractereInvalidoError`, `ValorNegativoError`, `ValorExcedeTamanhoError`,
  `CampoDesconhecidoError`, `ExercicioNaoSuportadoError`), todas com `linha`, `tipo` e
  `campo` quando aplicável.

## Como regenerar o leiaute

O leiaute de cada exercício é gerado a partir de dois recursos de **dados** distribuídos com o
programa do exercício: `LayoutDadosDIRPF<exercício>.xml` (tipos, campos, formatos e
descrições) e `mapeamentoTxt.xml` (a descrição usada pelo gravador de texto, seção
`ARQ_IRPF`). Nenhum código do programa é usado ou copiado. Os dois arquivos ficam fora do
repositório.

```sh
node --experimental-strip-types tools/leiaute/gerar.ts \
  --leiaute <pasta>/LayoutDadosDIRPF2026.xml \
  --mapeamento <pasta>/mapeamentoTxt.xml
```

Também é possível usar as variáveis `IRPF_LEIAUTE_XML` e `IRPF_MAPEAMENTO_XML`; sem
`--mapeamento`, o gerador procura `mapeamentoTxt.xml` na mesma pasta do leiaute. A saída vai
para `packages/core/src/dbk/leiautes/<exercício>.ts`, com o SHA-256 das fontes no cabeçalho.
O gerador é determinístico; com `IRPF_LEIAUTE_XML` definido, o teste
`packages/core/test/dbk/gerador.test.ts` confere que o arquivo versionado é exatamente a saída
do gerador.

Regras do gerador:

- Quando o tipo existe no mapeamento, os campos vêm dele. É o mapeamento que confere com os
  arquivos reais: no `LayoutDadosDIRPF2026.xml` os tipos 16, 26, 27, 39, 54, 56, 91, 92, `T9` e
  `DR` têm tamanhos diferentes dos gravados (o 16, por exemplo, tem 1250 posições no leiaute
  de dados e 930 no arquivo). Tipos que só existem no leiaute de dados (29, 77, 78, `FR` e o
  complemento do recibo) vêm dele.
- Formato: o do mapeamento; se faltar, o do leiaute de dados; se faltar, `C`. O identificador
  de tipo alfanumérico (por exemplo `FR`) é sempre `C`.
- Decimais: os do mapeamento; sem essa informação, campos `N` de 13 posições com nome de valor
  (`VR_`, `VL_`, `GC_`) recebem 2 casas.
- Campos `N` de 8 posições com nome `DT_`/`DATA_` ou descrição com `DDMMAAAA`/`AAAAMMDD` são
  datas.
- Nomes repetidos no mesmo tipo recebem chave única (`FILLER`, `FILLER_2`...).
- O XML oficial tem tipo sem `</tipo>` e registro sem `</Registro>`; o gerador encerra cada um
  no início do seguinte.

Para um exercício novo: gere o leiaute, registre-o em `packages/core/src/dbk/leiautes/index.ts`
e grave casos de referência em `packages/core/test/fixtures/dbk/<exercício>/`.

## Casos de referência

`packages/core/test/dbk/fixtures.test.ts` lê cada `*.DBK` e `*.DEC` de
`packages/core/test/fixtures/dbk/2026/`, regrava e compara byte a byte, e confere todos os
controles confirmados. Sem a pasta, o teste é pulado com aviso. Os arquivos devem ser gerados
no programa oficial com dados sintéticos.

## Referências

- Receita Federal, leiautes do arquivo da DIRPF, exercícios 2016 a 2023:
  <https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/dirpf>
  (por exemplo `leiaute-dirpf-2023.pdf`). Descrevem registros, campos, posições, decimais e a
  ordem dos registros, mas não o algoritmo dos controles.
- `LayoutDadosDIRPF2026.xml` e `mapeamentoTxt.xml`, recursos de dados do programa do exercício
  2026 (não versionados).
- CRC-32: ISO/IEC 3309 e ITU-T V.42; é o mesmo `crc32` do zlib (RFC 1952).
