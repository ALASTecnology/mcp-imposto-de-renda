<!-- Arquivo gerado por `pnpm docs:catalogo` (tools/docs/referencia.mjs). Não edite à mão. -->

<a id="topo"></a>

# Grupo `saidas`

Etapa final: dados do Darf e passo a passo para transmitir pelo programa oficial. Etapa final: Darf, relatório, comunicação de saída e passo a passo da transmissão.

**4 ferramentas**, 0 delas gravam na pasta autorizada. O grupo funciona mesmo sem `--dir`.

| Ferramenta | Título | Grava? |
| --- | --- | --- |
| [`gerar_darf`](#gerar_darf) | Dados do Darf | não |
| [`instruir_transmissao`](#instruir_transmissao) | Passo a passo para transmitir | não |
| [`gerar_relatorio_declaracao`](#gerar_relatorio_declaracao) | Relatório da declaração | não |
| [`gerar_comunicacao_saida`](#gerar_comunicacao_saida) | Comunicação de saída definitiva | não |

## `gerar_darf`

**Dados do Darf**. Não grava nada.

Calcula os dados do Darf (código de receita, período de apuração, vencimentos e valores de cada quota, juros Selic das quotas e, se informada a data de pagamento após o vencimento, multa de 0,33% ao dia até 20% e juros de mora). Tipos: imposto da declaração (0211, padrão), doações diretas ao ECA (3351) e à pessoa idosa (9090), carnê-leão (0190), renda variável (6015) e ganho de capital (4600). Não emite o Darf oficial: instrui a emissão no programa ou no Sicalc.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `tipo` | `"imposto"` \| `"eca"` \| `"idoso"` \| `"carne_leao"` \| `"renda_variavel"` \| `"ganho_capital"` | não | (padrão: `"imposto"`) |
| `arquivo` | texto | não | DBK/DEC da pasta (opcional). Nome relativo à pasta autorizada (ex.: "12345678909-IRPF-A-2026-2025-ORIGI.DBK"); use listar_arquivos. (até 255 caracteres) |
| `declaracao` | objeto livre | não | Declaração no modelo do MCP Imposto de Renda (mesma forma devolvida por converter_dbk_para_modelo): valores monetários em centavos (número inteiro), datas AAAA-MM-DD, CPF/CNPJ só dígitos. |
| `saldo` | valor monetário | não | Valor a pagar, se não vier da declaração. |
| `quotas` | inteiro (1 a 8) | não |   |
| `mes_apuracao` | inteiro (1 a 12) | não | Mês de 2025 (carnê-leão, renda variável, ganho de capital). |
| `selic_mensal` | objeto livre | não | Selic mensal por mês "AAAA-MM" para os juros das quotas a partir da 3ª. |
| `data_pagamento` | texto | não | Data prevista de pagamento (AAAA-MM-DD), para multa e juros de mora. |
| `selic_acumulada_mora` | texto ou número | não | Selic acumulada do mês seguinte ao vencimento até o mês anterior ao pagamento. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `codigoReceita` | texto |   |
| `descricaoReceita` | texto |   |
| `periodoApuracao` | texto |   |
| `cpf` | texto ou nulo |   |
| `valorTotal` | texto |   |
| `parcelas` | lista de objeto |   |
| `instrucoes` | lista de texto |   |
| `avisos` | lista de texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK"
}
```

Resposta em texto:

```text
Darf 0211 (IRPF, quota ou quota única do imposto apurado na declaração), período de apuração 31/12/2025, total R$ 4.653,06.
- Quota 1: vence 29/05/2026, principal R$ 1.163,28, total R$ 1.163,28
- Quota 2: vence 30/06/2026, principal R$ 1.163,26, juros R$ 11,63, total R$ 1.174,89
- Quota 3: vence 31/07/2026, principal R$ 1.163,26
- Quota 4: vence 31/08/2026, principal R$ 1.163,26
O MCP Imposto de Renda não emite Darf: os dados abaixo servem para conferência.
Para o Darf oficial com código de barras: no programa da declaração, menu Imprimir > Darf, depois de abrir ou restaurar o DBK; ou no Sicalc (Sicalc Web da Receita Federal), informando código de receita, período de apuração e valor.
Pague até o vencimento de cada quota; a partir da 2ª quota incidem juros Selic acumulada a partir de junho de 2026 mais 1% no mês do pagamento.
Aviso: Quota 3: Selic de 2026-06 não informada; juros não calculados.
Aviso: Quota 4: Selic de 2026-06 não informada; juros não calculados.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "codigoReceita": "0211",
  "descricaoReceita": "IRPF, quota ou quota única do imposto apurado na declaração",
  "periodoApuracao": "31/12/2025",
  "cpf": "10459818260",
  "valorTotal": "465306",
  "parcelas": [
    {
      "numero": 1,
      "vencimento": "2026-05-29",
      "principal": "116328",
      "juros": "0",
      "multaMora": "0",
      "jurosMora": "0",
      "total": "116328"
    },
    {
      "numero": 2,
      "vencimento": "2026-06-30",
      "principal": "116326",
      "juros": "1163",
      "multaMora": "0",
      "jurosMora": "0",
      "total": "117489"
    },
    "(+2 itens omitidos)"
  ],
  "instrucoes": [
    "O MCP Imposto de Renda não emite Darf: os dados abaixo servem para conferência.",
    "Para o Darf oficial com código de barras: no programa da declaração, menu Imprimir > Darf, depois de abrir ou restaurar o DBK; ou no Sicalc (Sicalc Web da Receita Federal), informando código de receita, período de apuração e valor.",
    "(+1 itens omitidos)"
  ],
  "avisos": [
    "Quota 3: Selic de 2026-06 não informada; juros não calculados.",
    "Quota 4: Selic de 2026-06 não informada; juros não calculados."
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 15 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-IMPR-DARF` Imprimir Darf do IRPF (P0, implementada)
- `M-IMPR-DARF-MAED` Imprimir Darf de Multa por Atraso na Entrega (P1, implementada)
- `M-IMPR-DARF-ECA` Imprimir Darf, Doações Diretamente na Declaração, ECA (P1, implementada)
- `M-IMPR-DARF-IDOSO` Imprimir Darf, Doações Diretamente na Declaração, Pessoa Idosa (P1, implementada)
- `M-IMPR-SALVAR-PDF` Visualizar e salvar em PDF (P2, parcial)
- `F-DDD` Doações Diretamente na Declaração (ficha) (P1, implementada)
- `F-DDD-ECA` Aba "Criança e Adolescente" (P1, implementada)
- `F-DDD-IDOSO` Aba "Pessoa Idosa" (P1, implementada)
- e mais 7 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `instruir_transmissao`

**Passo a passo para transmitir**. Não grava nada.

Gera o passo a passo e o checklist para concluir no programa oficial da declaração 2026: restaurar o DBK gravado pelo MCP Imposto de Renda, verificar pendências, conferir o Resumo, transmitir com ou sem certificado digital, guardar o recibo e pagar o Darf. Com 'arquivo' ou 'declaracao', inclui as pendências do MCP Imposto de Renda e o saldo.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `arquivo` | texto | não | DBK/DEC da pasta (opcional). Nome relativo à pasta autorizada (ex.: "12345678909-IRPF-A-2026-2025-ORIGI.DBK"); use listar_arquivos. (até 255 caracteres) |
| `declaracao` | objeto livre | não | Declaração no modelo do MCP Imposto de Renda (mesma forma devolvida por converter_dbk_para_modelo): valores monetários em centavos (número inteiro), datas AAAA-MM-DD, CPF/CNPJ só dígitos. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `passos` | lista de texto |   |
| `checklist` | lista de texto |   |
| `totalErros` | número ou nulo |   |
| `totalAvisos` | número ou nulo |   |
| `saldoPagar` | texto ou nulo |   |
| `restituir` | texto ou nulo |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK"
}
```

Resposta em texto:

```text
Passo a passo:
1. Instale ou atualize o programa oficial IRPF 2026 pelo site da Receita Federal (gov.br/receitafederal).
2. Copie 10459818260-IRPF-A-2026-2025-ORIGI.DBK para o computador em que o programa está instalado.
3. No programa, use Ferramentas > Restaurar Cópia de Segurança e escolha o arquivo .DBK (a declaração aparece na lista de declarações em preenchimento).
4. Abra a declaração e clique em Verificar Pendências; corrija tudo o que estiver marcado como erro.
5. Confira as fichas preenchidas e o Resumo (opção de tributação, imposto a pagar ou a restituir, quotas e conta bancária).
6. Clique em Entregar Declaração. Sem certificado digital, informe o número do recibo da declaração do ano anterior quando pedido; com certificado ou procuração, siga o assistente.
7. Depois da transmissão, salve e imprima o recibo de entrega (menu Imprimir > Recibo) e guarde o arquivo .DEC gerado.
8. Há saldo a pagar de R$ 4.653,06 pela simulação do MCP Imposto de Renda: emita o Darf no programa (menu Imprimir > Darf) ou opte pelo débito automático antes de transmitir.
9. O prazo de entrega é 29/05/2026; a entrega depois do prazo gera multa por atraso (calcular_multa_atraso).
Checklist:
- Informes de rendimentos de todas as fontes pagadoras (titular e dependentes) conferidos.
- Despesas dedutíveis com CPF/CNPJ do prestador e comprovantes guardados por 5 anos.
- Bens e direitos com situação em 31/12/2024 igual à da declaração anterior.
- Conta bancária para restituição ou débito automático em nome do titular.
- Dependentes com CPF e sem declaração própria.
- Pendências do programa oficial verificadas antes de entregar.
Pendências do MCP Imposto de Renda: 0 erro(s) e 0 aviso(s); use validar_declaracao para ver cada uma.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "passos": [
    "Instale ou atualize o programa oficial IRPF 2026 pelo site da Receita Federal (gov.br/receitafederal).",
    "Copie 10459818260-IRPF-A-2026-2025-ORIGI.DBK para o computador em que o programa está instalado.",
    "(+7 itens omitidos)"
  ],
  "checklist": [
    "Informes de rendimentos de todas as fontes pagadoras (titular e dependentes) conferidos.",
    "Despesas dedutíveis com CPF/CNPJ do prestador e comprovantes guardados por 5 anos.",
    "(+4 itens omitidos)"
  ],
  "totalErros": 0,
  "totalAvisos": 0,
  "saldoPagar": "465306",
  "restituir": "0"
}
```

</details>

### Funções do programa oficial

Aparece em 6 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-DECL-ENTREGAR` Declaração > Entregar Declaração (P0, implementada)
- `M-IMPR-RECIBO` Imprimir Recibo de Entrega (P1, implementada)
- `S-REGRA-PRAZO` Prazo e local de apresentação (P0, implementada)
- `S-REGRA-APOS-PRAZO` Locais de apresentação após o prazo (P2, implementada)
- `S-REQUISITOS` Requisitos e instalação do programa oficial (P2, implementada)
- `S-TRANSMISSAO` Transmissão (Receitanet incorporado) (P0, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `gerar_relatorio_declaracao`

**Relatório da declaração**. Não grava nada.

Monta um relatório em Markdown da declaração (identificação, fichas preenchidas, totais e resultado simulado) para conferência. Só devolve o texto; nada é gravado.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `arquivo` | texto | não | DBK/DEC/JSON da pasta. Nome relativo à pasta autorizada (ex.: "12345678909-IRPF-A-2026-2025-ORIGI.DBK"); use listar_arquivos. (até 255 caracteres) |
| `declaracao` | objeto livre | não | Declaração no modelo do MCP Imposto de Renda (mesma forma devolvida por converter_dbk_para_modelo): valores monetários em centavos (número inteiro), datas AAAA-MM-DD, CPF/CNPJ só dígitos. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `relatorio` | texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK"
}
```

Resposta em texto:

```text
# Declaração IRPF 2026 (ano-calendário 2025)

Contribuinte: PATRICIA FICTICIA EXEMPLO, CPF 10459818260. Tipo: ajusteAnual.
Opção de tributação: deduções legais.

## Fichas

- Identificação do Contribuinte: preenchida
- Rendimentos Tributáveis Recebidos de Pessoa Jurídica: 1 item(ns)
- Rendimentos Tributáveis Recebidos de Pessoa Física e do Exterior: 1 item(ns)
- Imposto Pago/Retido: preenchida
- Pagamentos Efetuados: 2 item(ns)
- Doações Diretamente na Declaração: preenchida
- Bens e Direitos: 1 item(ns)

## Totais

- Rendimentos tributáveis de PJ: R$ 36.000,00
- Imposto retido na fonte (PJ): R$ 1.980,00
- Pagamentos efetuados: R$ 11.880,00
- Bens em 31/12/2025: R$ 18.950,40
- Dívidas em 31/12/2025: R$ 0,00

## Resultado (simulação do MCP Imposto de Renda)
(... mais 6 linhas)
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "relatorio": "# Declaração IRPF 2026 (ano-calendário 2025)\n\nContribuinte: PATRICIA FICTICIA EXEMPLO, CPF 10459818260. Tipo: ajusteAnual.\nOpção de tributação: deduções legais.\n\n## Fichas\n\n- Identificação do Contribuinte: preenchida\n- Rendimentos Tributáve (...)"
}
```

</details>

### Funções do programa oficial

Aparece em 3 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-IMPR-DECLARACAO` Imprimir Declaração (P1, parcial)
- `M-IMPR-REND-PF` Imprimir Rendimentos Recebidos de PF (P2, parcial)
- `M-IMPR-SALVAR-PDF` Visualizar e salvar em PDF (P2, parcial)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `gerar_comunicacao_saida`

**Comunicação de saída definitiva**. Não grava nada.

Gera o texto da comunicação de saída definitiva do país, uma por fonte pagadora de rendimentos de PJ, a partir da ficha Saída Definitiva. Só devolve o texto para o usuário imprimir e assinar.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `arquivo` | texto | não | DBK/DEC/JSON da pasta. Nome relativo à pasta autorizada (ex.: "12345678909-IRPF-A-2026-2025-ORIGI.DBK"); use listar_arquivos. (até 255 caracteres) |
| `declaracao` | objeto livre | não | Declaração no modelo do MCP Imposto de Renda (mesma forma devolvida por converter_dbk_para_modelo): valores monetários em centavos (número inteiro), datas AAAA-MM-DD, CPF/CNPJ só dígitos. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `comunicacoes` | lista de objeto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "arquivo": "10234522275-IRPF-A-2026-2025-ORIGI.DBK"
}
```

Resposta em texto:

```text
À SECRETARIA FICTICIA DE ADMINISTRACAO (CPF/CNPJ 77517112000149)

Assunto: comunicação de saída definitiva do país

Eu, CARLOS FICTICIO EXEMPLO, CPF 10234522275, comunico que passei à condição de não residente no Brasil em 30/09/2025, com destino ao país de código 245.
A partir dessa data, os rendimentos que me forem pagos devem sofrer a tributação aplicável a não residentes, na forma da legislação.

Local e data: ____________________

Assinatura: ____________________
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "comunicacoes": [
    {
      "fonte": "SECRETARIA FICTICIA DE ADMINISTRACAO",
      "cnpj": "77517112000149",
      "texto": "À SECRETARIA FICTICIA DE ADMINISTRACAO (CPF/CNPJ 77517112000149)\n\nAssunto: comunicação de saída definitiva do país\n\nEu, CARLOS FICTICIO EXEMPLO, CPF 10234522275, comunico que passei à condição de não residente no Brasil em 30/09/2025, com d (...)"
    }
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 1 linha da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-IMPR-COMUNICACAO-SAIDA` Imprimir Comunicação à Fonte Pagadora de Saída do País (P1, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)
