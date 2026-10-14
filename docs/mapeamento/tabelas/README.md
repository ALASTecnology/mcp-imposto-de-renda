# Tabelas de códigos do IRPF 2026

Dados extraídos dos arquivos de recurso (XML) que acompanham o programa oficial
IRPF 2026, versão 1.5 (`vendor/rfb/irpf/IRPF2026-1.5.zip`). São tabelas públicas,
divulgadas pela Receita Federal no próprio programa e em atos normativos. Nenhum
código executável foi lido ou copiado: apenas os XMLs de tabela. A exceção é
`dolar-2025.json`, que não tem XML no programa e foi transcrita da Ajuda (pág. 356).

## Formato

Cada arquivo é um array JSON de objetos com, no mínimo:

```json
{ "codigo": "01", "descricao": "Texto oficial" }
```

Campos opcionais, conforme a tabela: `grupo`, `grupoDescricao`, `descricaoResumida`
(rótulo curto que o programa usa em listas), `descricaoCompleta`, `uf`, `municipio`,
`esfera`, `observacao` e campos específicos documentados abaixo. Códigos e
descrições foram mantidos exatamente como no XML, inclusive caixa alta, ausência de
acento em nomes de municípios e espaços internos. Os metadados de cada XML (atributos
`CRC` e `VIGENCIA` do último `ITEM`) estão na coluna "Vigência" abaixo.

Caminhos de origem: `lib/resources/` é o diretório `IRPF2026/lib/resources/` do zip;
`irpf.jar!/` é a raiz do arquivo `IRPF2026/irpf.jar`.

## Arquivos

| Arquivo | Origem | Registros | Vigência | Referência normativa | Observações |
|---|---|---:|---|---|---|
| `bens-direitos.json` | `lib/resources/tipoBens.xml` | 63 | 2026-03-05 | Códigos definidos pela RFB para a ficha Bens e Direitos (leiaute do PGD 2026) | Chave única é `grupo` + `codigo` (ambos com 2 dígitos). 9 grupos: 01 Imóveis, 02 Móveis, 03 Participações Societárias, 04 Aplicações e Investimentos, 05 Créditos, 06 Depósito à Vista e Numerário, 07 Fundos, 08 Criptoativos, 99 Outros. Fundos seguem a Lei 14.754/2023. |
| `rendimentos-isentos.json` | `lib/resources/tipoRendIsento.xml` | 24 | 2020-09-17 | Lei 7.713/1988, art. 6º, e demais hipóteses de isenção | `descricao` é o rótulo curto; `descricaoCompleta` é o texto da ficha. Quatro descrições trazem o caractere U+2013 do original, preservado por fidelidade. A vigência antiga indica que a ficha de 2026 pode ter linhas adicionais definidas fora deste XML (ver `tipos-rendimentos.json` e o mapeamento das fichas). |
| `rendimentos-tributacao-exclusiva.json` | `lib/resources/tipoRendTributExclusiva.xml` | 4 | 2020-09-17 | Tributação exclusiva/definitiva na fonte | Mesma ressalva da tabela de isentos: a ficha de 2026 tem mais linhas fixas que este XML. |
| `tipos-rendimentos.json` | `lib/resources/tipoRendimentos.xml` | 59 | 2026-03-12 | Leiaute do PGD 2026 | Lista de tipos de rendimento com códigos de 5 dígitos (tributáveis PJ e PF/exterior por titular e dependente, e linhas de isentos e exclusivos com redação de 2026). Útil para casar linhas de fichas e de informes. |
| `pagamentos.json` | `lib/resources/tipoPagamentos.xml` | 42 | 2026-03-06 | Lei 9.250/1995, art. 8º (deduções), e leis de incentivo | Códigos da ficha Pagamentos Efetuados (instrução, saúde, pensão, previdência, doações, advogados, aluguéis etc.). |
| `dividas-onus.json` | `lib/resources/tipoDividas.xml` | 6 | 2022-12-27 | Leiaute do PGD | Códigos 11 a 16 da ficha Dívidas e Ônus Reais. |
| `paises.json` | `lib/resources/paises.xml` | 248 | 2026-03-06 | Tabela de países usada pela RFB | Código de 3 dígitos. |
| `paises-gcap.json` | `irpf.jar!/paises_gcap.xml` | 249 | sem data | IN RFB 1.037/2010 (países com tributação favorecida e regimes fiscais privilegiados) | Tabela usada pelo módulo GCAP. `tributacaoFavorecida` corresponde à coluna 3 do XML igual a `1` (56 países); a interpretação da coluna é inferida pelos países listados. `observacao` traz o regime restrito a uma região (coluna 4). |
| `naturezas-ocupacao.json` | `lib/resources/naturezasOcupacao.xml` | 23 | 2026-03-05 | Ficha Identificação do Contribuinte | Código de 2 dígitos. |
| `ocupacoes-principais.json` | `lib/resources/ocupacoesPrincipal.xml` | 136 | 2026-03-05 | Ficha Identificação do Contribuinte | Código de 3 dígitos. |
| `municipios.json` | `lib/resources/<UF>.xml` (27 arquivos) | 5571 | 2025-08-22, 2025-08-23, 2025-12-06 | Tabela de municípios da RFB (códigos próprios, não são os códigos do IBGE) | Campo `uf` adicionado a partir do nome do arquivo. Os 5571 códigos são únicos no país. |
| `municipios-calamidade.json` | `lib/resources/municipiosCalamidade.xml` | 399 | 2024-06-01 | Municípios do RS em estado de calamidade pública reconhecido em 2024 | Todos os códigos pertencem ao RS (`uf` cruzado com `municipios.json`). O programa usa a tabela para regras e prazos específicos desses contribuintes. |
| `bancos.json` | `lib/resources/bancos.xml` | 27 | 2026-03-18 | Códigos de compensação (COMPE) do Banco Central | Bancos aceitos para restituição e débito automático. `indicadores` guarda as colunas 3 a 5 do XML (`S`/`N`) sem interpretação; 10 bancos têm `COL4 = N`, o que sugere ausência de convênio de débito automático (não confirmado). |
| `bancos-bens.json` | `lib/resources/bancos_bens.xml` | 651 | 2026-03-18 | Códigos COMPE do Banco Central | Instituições para os campos de banco em Bens e Direitos (contas e aplicações). `indicadores` guarda as colunas 3 e 4 sem interpretação. |
| `bancos-calculo-dv.json` | `irpf.jar!/bancos_calculo_dv.xml` | 16 | 2019-08-27 | Regras de dígito verificador dos bancos | `parametrosDV` guarda as colunas 3 e 4 do XML sem interpretação (aparentam ser parâmetros de tamanho/módulo do cálculo de DV de agência e conta). |
| `tipos-conta.json` | `lib/resources/tipoConta.xml` | 4 | 2022-01-03 | Ficha de restituição/débito | 1 corrente, 2 poupança, 3 pagamento, 4 Pix. Idêntica a `irpf.jar!/tipoConta.xml`. |
| `dependentes.json` | `lib/resources/dependencias.xml` | 10 | 2026-03-05 | Lei 9.250/1995, art. 35 | Códigos 11 a 51 da relação de dependência. O texto do código 31 traz o limite de rendimentos do ano-calendário 2025. |
| `fundos-eca.json` | `lib/resources/eca.xml` | 4618 | 2026-03-28 | Lei 8.069/1990 (ECA), art. 260 | `codigo` é o CNPJ do fundo. `esfera` distingue fundos estaduais/distrital (27, sem município) de municipais. Usada na doação ao ECA diretamente na declaração. |
| `fundos-idoso.json` | `lib/resources/eidoso.xml` | 2458 | 2026-03-27 | Lei 12.213/2010 (Fundo Nacional do Idoso e fundos estaduais/municipais) | Mesmo formato de `fundos-eca.json` (25 fundos estaduais/distrital). |
| `aliquotas-parametros.json` | `lib/resources/aliquotas.xml` | 216 | 2026-03-04 | Lei 11.482/2007 com alterações (tabela progressiva), Lei 9.250/1995 (deduções), Lei 14.663/2023 (desconto simplificado) | Parâmetros de cálculo do ano-calendário 2025. `codigo` é a chave original; `valorBruto` é o texto do XML; `valor` é a conversão, com casas decimais implícitas inferidas pelo tamanho do campo (13 dígitos: 2 casas; 15 dígitos: 4 casas; 17 dígitos: 6 casas; percentuais de 5 dígitos: 2 casas). `grupo` = `anual` ou `mensal` (com `mes` de 1 a 13 para chaves terminadas em `mesN`, usadas no cálculo mensal, como Carnê-Leão e RRA). Ver resumo abaixo. |
| `datas-prazos.json` | `lib/resources/datasIrpf.xml` | 11 | 2026-03-12 | IN RFB do prazo de entrega da DIRPF 2026 | Início e fim da recepção, data limite do débito automático, quantidade e vencimentos das quotas (formato `AAAAMMDD`, vencimentos separados por `;`). |
| `moedas.json` | `irpf.jar!/moedas.xml` | 47 | sem data | Módulo de moeda estrangeira / GCAP | `codigo` é um identificador textual do programa (ex.: `SUECIA`), não ISO 4217. |
| `altcoins.json` | `irpf.jar!/altcoins.xml` | 16 | 2024-01-12 | IN RFB 1.888/2019 (criptoativos) | Siglas citadas no código 08.02 de Bens e Direitos. |
| `stablecoins.json` | `irpf.jar!/stablecoins.xml` | 11 | 2024-01-12 | IN RFB 1.888/2019 | Siglas citadas no código 08.03 de Bens e Direitos. |
| `atividade-rural-tipos.json` | `irpf.jar!/tipoAtividadesRural.xml` | 9 | sem data | Lei 8.023/1990 | Tipos de exploração da ficha Atividade Rural. |
| `atividade-rural-bens.json` | `irpf.jar!/tipoBensAR.xml` | 11 | sem data | Lei 8.023/1990 | Códigos de bens da atividade rural. |
| `atividade-rural-condicoes-exploracao.json` | `irpf.jar!/condicoesExploracao.xml` | 6 | sem data | Lei 8.023/1990 | Condição de exploração do imóvel rural. |
| `raca-cor.json` | `irpf.jar!/racaCor.xml` | 6 | 2025-12-10 | Ficha Identificação | Código 0 tem descrição em branco no original (opção não informada). |
| `tipos-logradouro.json` | `irpf.jar!/tipoLogradouro.xml` | 50 | sem data | Ficha Identificação (endereço) | `codigo` textual (ex.: `ALAMEDA`). |
| `ufs.json` | `irpf.jar!/ufs.xml` | 27 | sem data | | Sigla e nome. `irpf.jar!/ufssigla.xml` repete a tabela com rótulo "UF - Nome" e não foi exportado. |
| `dolar-2025.json` | Ajuda do programa (AjudaIRPF.pdf), pág. 356, tabela "Conversão para Reais do Dólar dos Estados Unidos da América em 2025" | 13 | 2025 | Lei 9.250/1995, art. 6º, e IN SRF 208/2002 (conversão de rendimentos e deduções em moeda estrangeira) | Não há XML desta tabela no programa: os valores foram transcritos da Ajuda. `compra` e `venda` com 4 casas; códigos `01` a `12` são o mês do recebimento ou pagamento (já com a cotação do último dia útil da 1ª quinzena do mês anterior); `AR` é a compra de 31/12/2025 usada na Atividade Rural no exterior, sem venda. |
| `representacoes-diplomaticas.json` | `irpf.jar!/representacoes.xml` | 198 | 2020-01-17 | Ficha Identificação (residente no exterior) | Campos extras `pais` e `tipoRepresentacao` (embaixada, consulado etc.). |

## Resumo da tabela progressiva anual (ano-calendário 2025)

Valores de `aliquotas-parametros.json`, grupo `anual`:

| Faixa | Base de cálculo até (R$) | Alíquota | Parcela a deduzir (R$) |
|---|---:|---:|---:|
| Isenta | 28.467,20 | 0% | 0,00 |
| 1 | 33.919,80 | 7,5% | 2.135,04 |
| 2 | 45.012,60 | 15% | 4.679,03 |
| 3 | 55.976,16 | 22,5% | 8.054,97 |
| 4 | acima | 27,5% | 10.853,78 |

As chaves `valorAjusteLimiteAnualFaixaN` marcam o limite superior da faixa anterior
à alíquota N (faixa 1 começa após 28.467,20). Outros parâmetros relevantes: dedução
por dependente 2.275,08; limite de instrução 3.561,50; limite do desconto simplificado
16.754,34 (20%); limite de obrigatoriedade por rendimentos tributáveis 35.584,00
(`limiteIsencao`); bens e direitos 800.000,00; receita bruta rural 177.920,00;
rendimentos isentos e exclusivos 200.000,00; quota mínima 50,00 e no máximo 8
quotas; imposto mínimo a pagar 10,00; multa de ofício suplementar 75%.

A tabela mensal (grupo `mensal`) muda a partir do mês 5 (maio de 2025), quando o
limite da faixa isenta passou de 2.259,20 para 2.428,80.

## Tabelas presentes no programa e não exportadas

- `lib/resources/links.xml` (122 links para a legislação citada na ajuda) e
  `lib/resources/mensagens.xml` (30 mensagens de serviço): não são tabelas de códigos.
- `irpf.jar!/LayoutDadosDIRPF2026.xml`, `mapeamentoTxt.xml`, `mapeamentoXml.xml` e
  `mapeamentoXmlGCAP.xml`: leiautes de arquivo, tratados no mapeamento das fichas.
- `irpf.jar!/ufssigla.xml`: duplicata de `ufs.xml`.

## Como regenerar

Scripts auxiliares mantidos fora do repositório, porque leem o programa oficial extraído localmente:
`gerar_tabelas.py <lib/resources> <raiz do irpf.jar extraída> <saída>` e
`validar.py <saída>`, que confere parse, campos obrigatórios, caracteres invisíveis e
códigos duplicados.
