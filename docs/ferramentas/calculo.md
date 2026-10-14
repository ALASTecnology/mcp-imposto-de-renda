<!-- Arquivo gerado por `pnpm docs:catalogo` (tools/docs/referencia.mjs). Não edite à mão. -->

<a id="topo"></a>

# Grupo `calculo`

Simulação do imposto, comparação de modelos, quotas, multa e parâmetros. Calcula o imposto do exercício a partir de dados informados na conversa, sem ler arquivo.

**6 ferramentas**, 0 delas gravam na pasta autorizada. O grupo funciona mesmo sem `--dir`.

| Ferramenta | Título | Grava? |
| --- | --- | --- |
| [`simular_imposto`](#simular_imposto) | Simular imposto do exercício | não |
| [`comparar_modelos`](#comparar_modelos) | Comparar modelo completo e simplificado | não |
| [`explicar_calculo`](#explicar_calculo) | Explicar o cálculo passo a passo | não |
| [`calcular_quotas`](#calcular_quotas) | Calcular quotas do imposto a pagar | não |
| [`calcular_multa_atraso`](#calcular_multa_atraso) | Calcular multa por atraso na entrega | não |
| [`consultar_parametros`](#consultar_parametros) | Consultar parâmetros do exercício | não |

## `simular_imposto`

**Simular imposto do exercício**. Não grava nada.

Calcula o imposto da declaração (exercício 2026, ano-calendário 2025) nos modelos completo e simplificado e indica o mais vantajoso, com saldo a pagar ou a restituir. Informe titular, rendimentos, pagamentos e demais dados.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `exercicio` | inteiro | não | Exercício (ano de entrega). Hoje só 2026 (ano-calendário 2025) é suportado. (padrão: `2026`) |
| `titular` | objeto | **sim** | Titular da declaração. |
| `titular.cpf` | texto | **sim** | CPF do titular. Com ou sem pontuação. (até 20 caracteres) |
| `titular.nome` | texto | **sim** | Nome do titular. (até 60 caracteres) |
| `titular.nascimento` | texto | não | Data de nascimento do titular (DDMMAAAA ou AAAA-MM-DD); usada nos avisos de 65 anos. (formato `^(\d{8}\|\d{4}-\d{2}-\d{2})$`) |
| `dependentes` | lista de objeto | não | Dependentes da ficha Dependentes. Cada um deduz R$ 2.275,08 no modelo completo. (até 100 itens) |
| `dependentes[].cpf` | texto | não | CPF do dependente. Com ou sem pontuação. (até 20 caracteres) |
| `dependentes[].nome` | texto | não | (até 60 caracteres) |
| `dependentes[].nascimento` | texto | não | Data de nascimento: DDMMAAAA (ex.: 15031985) ou AAAA-MM-DD. (formato `^(\d{8}\|\d{4}-\d{2}-\d{2})$`) |
| `dependentes[].codigo` | texto | não | Código da relação de dependência (tabela dependentes: 11, 21 a 26, 31, 41, 51). Use buscar_codigo. (formato `^\d{1,2}$`) |
| `rendimentosPJ` | lista de objeto | não | Rendimentos tributáveis recebidos de pessoa jurídica, um item por fonte pagadora. (até 500 itens) |
| `rendimentosPJ[].cnpj` | texto | não | CNPJ (ou CPF) da fonte pagadora. Com ou sem pontuação. (até 20 caracteres) |
| `rendimentosPJ[].nome` | texto | não | Nome da fonte pagadora. (até 60 caracteres) |
| `rendimentosPJ[].rendimento` | valor monetário | não | Rendimentos tributáveis do informe (linha 1 do quadro 3). |
| `rendimentosPJ[].previdenciaOficial` | valor monetário | não | Contribuição previdenciária oficial (INSS). |
| `rendimentosPJ[].irrf` | valor monetário | não | Imposto de renda retido na fonte. |
| `rendimentosPJ[].decimoTerceiro` | valor monetário | não | 13º salário (tributação exclusiva, só informativo). |
| `rendimentosPJ[].irrfDecimoTerceiro` | valor monetário | não | IRRF sobre o 13º salário. |
| `rendimentosPJ[].beneficiario` | `"T"` \\| `"D"` | não | T = titular (padrão), D = dependente. |
| `rendimentosPJ[].cpfDependente` | texto | não | CPF do dependente quando beneficiario = D. Com ou sem pontuação. (até 20 caracteres) |
| `rendimentosPF` | objeto | não | Rendimentos de pessoa física e do exterior (carnê-leão), por mês. |
| `rendimentosPF.meses` | lista de objeto | não | (até 12 itens) |
| `rendimentosPF.meses[].mes` | inteiro (1 a 12) | não | Mês (1 a 12). |
| `rendimentosPF.meses[].pessoaFisica` | valor monetário | não | Trabalho não assalariado, aluguéis e outros de PF. |
| `rendimentosPF.meses[].exterior` | valor monetário | não | Rendimentos do exterior. |
| `rendimentosPF.meses[].previdenciaOficial` | valor monetário | não | Previdência oficial paga no mês (carnê-leão). |
| `rendimentosPF.meses[].livroCaixa` | valor monetário | não | Despesas de livro-caixa do mês. |
| `rendimentosPF.meses[].carneLeao` | valor monetário | não | Carnê-leão pago (Darf 0190). |
| `pagamentos` | lista de objeto | não | Pagamentos efetuados (despesas dedutíveis no modelo completo). (até 1000 itens) |
| `pagamentos[].codigo` | texto | não | Código da ficha Pagamentos Efetuados: 01/02 instrução, 09 a 22 e 26 saúde, 30/31/33/34 pensão, 36/37 previdência complementar. Use listar_tabela pagamentos. (formato `^\d{1,2}$`) |
| `pagamentos[].cpfCnpj` | texto | não | CPF/CNPJ de quem recebeu o pagamento. Com ou sem pontuação. (até 20 caracteres) |
| `pagamentos[].valor` | valor monetário | não | Valor pago. |
| `pagamentos[].parcelaNaoDedutivel` | valor monetário | não | Parcela não dedutível ou valor reembolsado. |
| `pagamentos[].beneficiario` | `"T"` \\| `"D"` \\| `"A"` | não | Para quem foi a despesa: T titular, D dependente, A alimentando. |
| `pagamentos[].cpfDependente` | texto | não | CPF do dependente ou alimentando. Com ou sem pontuação. (até 20 caracteres) |
| `rendimentosIsentos` | lista de objeto | não | (até 500 itens) |
| `rendimentosIsentos[].codigo` | texto | não | Código do rendimento isento (10 = parcela isenta 65+). (formato `^\d{1,2}$`) |
| `rendimentosIsentos[].valor` | valor monetário | não | Valor. |
| `tributacaoExclusiva` | lista de objeto | não | (até 500 itens) |
| `tributacaoExclusiva[].codigo` | texto | não | Código do rendimento exclusivo. (formato `^\d{1,2}$`) |
| `tributacaoExclusiva[].valor` | valor monetário | não | Valor. |
| `impostoPago` | objeto | não |   |
| `impostoPago.complementar` | valor monetário | não | Imposto complementar pago. |
| `impostoPago.exterior` | valor monetário | não | Imposto pago no exterior. |
| `impostoPago.irrfLei11033` | valor monetário | não | IRRF da Lei 11.033/2004. |
| `doacoesDiretas` | objeto | não |   |
| `doacoesDiretas.eca` | valor monetário | não | Doação direta na declaração ao Fundo da Criança e do Adolescente. |
| `doacoesDiretas.idoso` | valor monetário | não | Doação direta na declaração ao Fundo da Pessoa Idosa. |
| `doacoesEfetuadas` | lista de objeto | não | (até 500 itens) |
| `doacoesEfetuadas[].codigo` | texto | não | Código da doação (40 a 47). (formato `^\d{1,2}$`) |
| `doacoesEfetuadas[].valor` | valor monetário | não | Valor doado. |
| `doacoesEfetuadas[].parcelaNaoDedutivel` | valor monetário | não | Parcela não dedutível. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `exercicio` | número |   |
| `rendimentosTributaveis` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `deducoesCompleto` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `baseCalculoCompleto` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `impostoDevidoCompleto` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `descontoSimplificado` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `baseCalculoSimplificado` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `impostoDevidoSimplificado` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `impostoRetidoTotal` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `saldoPagarCompleto` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `restituirCompleto` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `saldoPagarSimplificado` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `restituirSimplificado` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `modeloMaisVantajoso` | `"completo"` \\| `"simplificado"` |   |
| `aliquotaEfetiva` | texto | Centésimos de ponto percentual (617 = 6,17%). |
| `avisos` | lista de texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "titular": {
    "cpf": "11006743812",
    "nome": "MARIA FICTICIA EXEMPLO",
    "nascimento": "1985-03-15"
  },
  "dependentes": [
    {
      "cpf": "11018008608",
      "nome": "PEDRO FICTICIO EXEMPLO",
      "nascimento": "2015-08-20",
      "codigo": "21"
    }
  ],
  "rendimentosPJ": [
    {
      "cnpj": "62762582000109",
      "nome": "EMPRESA FICTICIA LTDA",
      "rendimento": "85.000,00",
      "previdenciaOficial": "9.350,00",
      "irrf": "7.420,00",
      "decimoTerceiro": "7.000,00",
      "irrfDecimoTerceiro": "480,00"
    }
  ],
  "pagamentos": [
    {
      "codigo": "10",
      "cpfCnpj": "78248445000182",
      "valor": "3.200,00"
    },
    {
      "codigo": "01",
      "cpfCnpj": "93734308000141",
      "valor": "6.000,00",
      "beneficiario": "D",
      "cpfDependente": "11018008608"
    }
  ]
}
```

Resposta em texto:

```text
Exercício 2026: rendimentos tributáveis de R$ 85.000,00.
Completo: imposto devido R$ 7.464,91 (deduções R$ 18.386,58).
Simplificado: imposto devido R$ 7.913,77 (desconto R$ 16.754,34).
Imposto já pago ou retido: R$ 7.420,00.
Mais vantajoso: completo, com saldo a pagar de R$ 44,91; alíquota efetiva 8,78%.
Aviso: Rendimentos tributáveis acima de R$ 35.584,00: declaração obrigatória (IN RFB 2.312/2026).
Simulação do MCP Imposto de Renda; confira no programa oficial da Receita Federal antes de transmitir.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "exercicio": 2026,
  "rendimentosTributaveis": "8500000",
  "deducoesCompleto": "1838658",
  "baseCalculoCompleto": "6661342",
  "impostoDevidoCompleto": "746491",
  "descontoSimplificado": "1675434",
  "baseCalculoSimplificado": "6824566",
  "impostoDevidoSimplificado": "791377",
  "impostoRetidoTotal": "742000",
  "saldoPagarCompleto": "4491",
  "restituirCompleto": "0",
  "saldoPagarSimplificado": "49377",
  "restituirSimplificado": "0",
  "modeloMaisVantajoso": "completo",
  "aliquotaEfetiva": "878",
  "avisos": [
    "Rendimentos tributáveis acima de R$ 35.584,00: declaração obrigatória (IN RFB 2.312/2026)."
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 59 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-RODAPE-COMPARATIVO` Painel de imposto e comparativo no rodapé (P0, implementada)
- `M-AJUDA-CONTEXTUAL` Ajuda de campo (F1) e textos em azul (P1, implementada)
- `S-REGRA-AR-RESULTADO` Resultado tributável da atividade rural (P1, implementada)
- `S-REGRA-REGIME` Regime de tributação (deduções legais ou desconto simplificado) (P0, implementada)
- `F-ISENTO-15` Parcela não tributável correspondente à atividade rural (P1, implementada)
- `F-ISENTO-22` Recuperação de prejuízos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro) (P1, implementada)
- `F-ISENTO-27` Juros referentes aos Rendimentos Recebidos Acumuladamente (P1, implementada)
- `F-EXCL-01` 13º salário (P0, implementada)
- e mais 51 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `comparar_modelos`

**Comparar modelo completo e simplificado**. Não grava nada.

Compara as deduções legais (modelo completo) com o desconto simplificado de 20% (limitado a R$ 16.754,34) e mostra a diferença de resultado. Mesma entrada de simular_imposto.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `exercicio` | inteiro | não | Exercício (ano de entrega). Hoje só 2026 (ano-calendário 2025) é suportado. (padrão: `2026`) |
| `titular` | objeto | **sim** | Titular da declaração. |
| `titular.cpf` | texto | **sim** | CPF do titular. Com ou sem pontuação. (até 20 caracteres) |
| `titular.nome` | texto | **sim** | Nome do titular. (até 60 caracteres) |
| `titular.nascimento` | texto | não | Data de nascimento do titular (DDMMAAAA ou AAAA-MM-DD); usada nos avisos de 65 anos. (formato `^(\d{8}\|\d{4}-\d{2}-\d{2})$`) |
| `dependentes` | lista de objeto | não | Dependentes da ficha Dependentes. Cada um deduz R$ 2.275,08 no modelo completo. (até 100 itens) |
| `dependentes[].cpf` | texto | não | CPF do dependente. Com ou sem pontuação. (até 20 caracteres) |
| `dependentes[].nome` | texto | não | (até 60 caracteres) |
| `dependentes[].nascimento` | texto | não | Data de nascimento: DDMMAAAA (ex.: 15031985) ou AAAA-MM-DD. (formato `^(\d{8}\|\d{4}-\d{2}-\d{2})$`) |
| `dependentes[].codigo` | texto | não | Código da relação de dependência (tabela dependentes: 11, 21 a 26, 31, 41, 51). Use buscar_codigo. (formato `^\d{1,2}$`) |
| `rendimentosPJ` | lista de objeto | não | Rendimentos tributáveis recebidos de pessoa jurídica, um item por fonte pagadora. (até 500 itens) |
| `rendimentosPJ[].cnpj` | texto | não | CNPJ (ou CPF) da fonte pagadora. Com ou sem pontuação. (até 20 caracteres) |
| `rendimentosPJ[].nome` | texto | não | Nome da fonte pagadora. (até 60 caracteres) |
| `rendimentosPJ[].rendimento` | valor monetário | não | Rendimentos tributáveis do informe (linha 1 do quadro 3). |
| `rendimentosPJ[].previdenciaOficial` | valor monetário | não | Contribuição previdenciária oficial (INSS). |
| `rendimentosPJ[].irrf` | valor monetário | não | Imposto de renda retido na fonte. |
| `rendimentosPJ[].decimoTerceiro` | valor monetário | não | 13º salário (tributação exclusiva, só informativo). |
| `rendimentosPJ[].irrfDecimoTerceiro` | valor monetário | não | IRRF sobre o 13º salário. |
| `rendimentosPJ[].beneficiario` | `"T"` \\| `"D"` | não | T = titular (padrão), D = dependente. |
| `rendimentosPJ[].cpfDependente` | texto | não | CPF do dependente quando beneficiario = D. Com ou sem pontuação. (até 20 caracteres) |
| `rendimentosPF` | objeto | não | Rendimentos de pessoa física e do exterior (carnê-leão), por mês. |
| `rendimentosPF.meses` | lista de objeto | não | (até 12 itens) |
| `rendimentosPF.meses[].mes` | inteiro (1 a 12) | não | Mês (1 a 12). |
| `rendimentosPF.meses[].pessoaFisica` | valor monetário | não | Trabalho não assalariado, aluguéis e outros de PF. |
| `rendimentosPF.meses[].exterior` | valor monetário | não | Rendimentos do exterior. |
| `rendimentosPF.meses[].previdenciaOficial` | valor monetário | não | Previdência oficial paga no mês (carnê-leão). |
| `rendimentosPF.meses[].livroCaixa` | valor monetário | não | Despesas de livro-caixa do mês. |
| `rendimentosPF.meses[].carneLeao` | valor monetário | não | Carnê-leão pago (Darf 0190). |
| `pagamentos` | lista de objeto | não | Pagamentos efetuados (despesas dedutíveis no modelo completo). (até 1000 itens) |
| `pagamentos[].codigo` | texto | não | Código da ficha Pagamentos Efetuados: 01/02 instrução, 09 a 22 e 26 saúde, 30/31/33/34 pensão, 36/37 previdência complementar. Use listar_tabela pagamentos. (formato `^\d{1,2}$`) |
| `pagamentos[].cpfCnpj` | texto | não | CPF/CNPJ de quem recebeu o pagamento. Com ou sem pontuação. (até 20 caracteres) |
| `pagamentos[].valor` | valor monetário | não | Valor pago. |
| `pagamentos[].parcelaNaoDedutivel` | valor monetário | não | Parcela não dedutível ou valor reembolsado. |
| `pagamentos[].beneficiario` | `"T"` \\| `"D"` \\| `"A"` | não | Para quem foi a despesa: T titular, D dependente, A alimentando. |
| `pagamentos[].cpfDependente` | texto | não | CPF do dependente ou alimentando. Com ou sem pontuação. (até 20 caracteres) |
| `rendimentosIsentos` | lista de objeto | não | (até 500 itens) |
| `rendimentosIsentos[].codigo` | texto | não | Código do rendimento isento (10 = parcela isenta 65+). (formato `^\d{1,2}$`) |
| `rendimentosIsentos[].valor` | valor monetário | não | Valor. |
| `tributacaoExclusiva` | lista de objeto | não | (até 500 itens) |
| `tributacaoExclusiva[].codigo` | texto | não | Código do rendimento exclusivo. (formato `^\d{1,2}$`) |
| `tributacaoExclusiva[].valor` | valor monetário | não | Valor. |
| `impostoPago` | objeto | não |   |
| `impostoPago.complementar` | valor monetário | não | Imposto complementar pago. |
| `impostoPago.exterior` | valor monetário | não | Imposto pago no exterior. |
| `impostoPago.irrfLei11033` | valor monetário | não | IRRF da Lei 11.033/2004. |
| `doacoesDiretas` | objeto | não |   |
| `doacoesDiretas.eca` | valor monetário | não | Doação direta na declaração ao Fundo da Criança e do Adolescente. |
| `doacoesDiretas.idoso` | valor monetário | não | Doação direta na declaração ao Fundo da Pessoa Idosa. |
| `doacoesEfetuadas` | lista de objeto | não | (até 500 itens) |
| `doacoesEfetuadas[].codigo` | texto | não | Código da doação (40 a 47). (formato `^\d{1,2}$`) |
| `doacoesEfetuadas[].valor` | valor monetário | não | Valor doado. |
| `doacoesEfetuadas[].parcelaNaoDedutivel` | valor monetário | não | Parcela não dedutível. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `modeloMaisVantajoso` | `"completo"` \\| `"simplificado"` |   |
| `diferenca` | texto | Diferença de resultado final entre os modelos. |
| `completo` | objeto |   |
| `simplificado` | objeto |   |
| `memoria` | lista de objeto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "titular": {
    "cpf": "11006743812",
    "nome": "MARIA FICTICIA EXEMPLO",
    "nascimento": "1985-03-15"
  },
  "dependentes": [
    {
      "cpf": "11018008608",
      "nome": "PEDRO FICTICIO EXEMPLO",
      "nascimento": "2015-08-20",
      "codigo": "21"
    }
  ],
  "rendimentosPJ": [
    {
      "cnpj": "62762582000109",
      "nome": "EMPRESA FICTICIA LTDA",
      "rendimento": "85.000,00",
      "previdenciaOficial": "9.350,00",
      "irrf": "7.420,00",
      "decimoTerceiro": "7.000,00",
      "irrfDecimoTerceiro": "480,00"
    }
  ],
  "pagamentos": [
    {
      "codigo": "10",
      "cpfCnpj": "78248445000182",
      "valor": "3.200,00"
    },
    {
      "codigo": "01",
      "cpfCnpj": "93734308000141",
      "valor": "6.000,00",
      "beneficiario": "D",
      "cpfDependente": "11018008608"
    }
  ]
}
```

Resposta em texto:

```text
1. Modelo completo: imposto devido R$ 7.464,91, pagar R$ 44,91 [Deduções legais.]
2. Modelo simplificado: imposto devido R$ 7.913,77, pagar R$ 493,77 [Desconto simplificado.]
3. Mais vantajoso: completo, com diferença de R$ 448,86 [Opção pela tributação: o contribuinte escolhe; o motor indica a de menor imposto.]
Deduções do completo: R$ 18.386,58; desconto simplificado: R$ 16.754,34.
Simulação do MCP Imposto de Renda; confira no programa oficial da Receita Federal antes de transmitir.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "modeloMaisVantajoso": "completo",
  "diferenca": "44886",
  "completo": {
    "rendimentosTributaveis": "8500000",
    "baseCalculo": "6661342",
    "impostoDevido": "746491",
    "impostoPago": "742000",
    "saldoPagar": "4491",
    "restituir": "0",
    "aliquotaEfetiva": "878",
    "totalDeducoes": "1838658",
    "deducoes": {
      "previdenciaOficial": "935000",
      "previdenciaComplementar": "0",
      "dependentes": "227508",
      "instrucao": "356150",
      "medicas": "320000",
      "pensaoAlimenticia": "0",
      "livroCaixa": "0"
    }
  },
  "simplificado": {
    "rendimentosTributaveis": "8500000",
    "baseCalculo": "6824566",
    "impostoDevido": "791377",
    "impostoPago": "742000",
    "saldoPagar": "49377",
    "restituir": "0",
    "aliquotaEfetiva": "931",
    "desconto": "1675434"
  },
  "memoria": [
    {
      "codigo": "comparacao.completo",
      "descricao": "Modelo completo: imposto devido R$ 7.464,91, pagar R$ 44,91",
      "valor": "746491",
      "regra": "Deduções legais."
    },
    {
      "codigo": "comparacao.simplificado",
      "descricao": "Modelo simplificado: imposto devido R$ 7.913,77, pagar R$ 493,77",
      "valor": "791377",
      "regra": "Desconto simplificado."
    },
    "(+1 itens omitidos)"
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 59 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-RODAPE-COMPARATIVO` Painel de imposto e comparativo no rodapé (P0, implementada)
- `M-AJUDA-CONTEXTUAL` Ajuda de campo (F1) e textos em azul (P1, implementada)
- `S-REGRA-AR-RESULTADO` Resultado tributável da atividade rural (P1, implementada)
- `S-REGRA-REGIME` Regime de tributação (deduções legais ou desconto simplificado) (P0, implementada)
- `F-ISENTO-15` Parcela não tributável correspondente à atividade rural (P1, implementada)
- `F-ISENTO-22` Recuperação de prejuízos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro) (P1, implementada)
- `F-ISENTO-27` Juros referentes aos Rendimentos Recebidos Acumuladamente (P1, implementada)
- `F-EXCL-01` 13º salário (P0, implementada)
- e mais 51 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `explicar_calculo`

**Explicar o cálculo passo a passo**. Não grava nada.

Devolve a memória de cálculo linha a linha, em pt-BR, com a conta feita e a regra legal aplicada em cada passo (rendimentos, deduções, base, tabela progressiva, incentivos, imposto pago, saldo). Mesma entrada de simular_imposto.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `exercicio` | inteiro | não | Exercício (ano de entrega). Hoje só 2026 (ano-calendário 2025) é suportado. (padrão: `2026`) |
| `titular` | objeto | **sim** | Titular da declaração. |
| `titular.cpf` | texto | **sim** | CPF do titular. Com ou sem pontuação. (até 20 caracteres) |
| `titular.nome` | texto | **sim** | Nome do titular. (até 60 caracteres) |
| `titular.nascimento` | texto | não | Data de nascimento do titular (DDMMAAAA ou AAAA-MM-DD); usada nos avisos de 65 anos. (formato `^(\d{8}\|\d{4}-\d{2}-\d{2})$`) |
| `dependentes` | lista de objeto | não | Dependentes da ficha Dependentes. Cada um deduz R$ 2.275,08 no modelo completo. (até 100 itens) |
| `dependentes[].cpf` | texto | não | CPF do dependente. Com ou sem pontuação. (até 20 caracteres) |
| `dependentes[].nome` | texto | não | (até 60 caracteres) |
| `dependentes[].nascimento` | texto | não | Data de nascimento: DDMMAAAA (ex.: 15031985) ou AAAA-MM-DD. (formato `^(\d{8}\|\d{4}-\d{2}-\d{2})$`) |
| `dependentes[].codigo` | texto | não | Código da relação de dependência (tabela dependentes: 11, 21 a 26, 31, 41, 51). Use buscar_codigo. (formato `^\d{1,2}$`) |
| `rendimentosPJ` | lista de objeto | não | Rendimentos tributáveis recebidos de pessoa jurídica, um item por fonte pagadora. (até 500 itens) |
| `rendimentosPJ[].cnpj` | texto | não | CNPJ (ou CPF) da fonte pagadora. Com ou sem pontuação. (até 20 caracteres) |
| `rendimentosPJ[].nome` | texto | não | Nome da fonte pagadora. (até 60 caracteres) |
| `rendimentosPJ[].rendimento` | valor monetário | não | Rendimentos tributáveis do informe (linha 1 do quadro 3). |
| `rendimentosPJ[].previdenciaOficial` | valor monetário | não | Contribuição previdenciária oficial (INSS). |
| `rendimentosPJ[].irrf` | valor monetário | não | Imposto de renda retido na fonte. |
| `rendimentosPJ[].decimoTerceiro` | valor monetário | não | 13º salário (tributação exclusiva, só informativo). |
| `rendimentosPJ[].irrfDecimoTerceiro` | valor monetário | não | IRRF sobre o 13º salário. |
| `rendimentosPJ[].beneficiario` | `"T"` \\| `"D"` | não | T = titular (padrão), D = dependente. |
| `rendimentosPJ[].cpfDependente` | texto | não | CPF do dependente quando beneficiario = D. Com ou sem pontuação. (até 20 caracteres) |
| `rendimentosPF` | objeto | não | Rendimentos de pessoa física e do exterior (carnê-leão), por mês. |
| `rendimentosPF.meses` | lista de objeto | não | (até 12 itens) |
| `rendimentosPF.meses[].mes` | inteiro (1 a 12) | não | Mês (1 a 12). |
| `rendimentosPF.meses[].pessoaFisica` | valor monetário | não | Trabalho não assalariado, aluguéis e outros de PF. |
| `rendimentosPF.meses[].exterior` | valor monetário | não | Rendimentos do exterior. |
| `rendimentosPF.meses[].previdenciaOficial` | valor monetário | não | Previdência oficial paga no mês (carnê-leão). |
| `rendimentosPF.meses[].livroCaixa` | valor monetário | não | Despesas de livro-caixa do mês. |
| `rendimentosPF.meses[].carneLeao` | valor monetário | não | Carnê-leão pago (Darf 0190). |
| `pagamentos` | lista de objeto | não | Pagamentos efetuados (despesas dedutíveis no modelo completo). (até 1000 itens) |
| `pagamentos[].codigo` | texto | não | Código da ficha Pagamentos Efetuados: 01/02 instrução, 09 a 22 e 26 saúde, 30/31/33/34 pensão, 36/37 previdência complementar. Use listar_tabela pagamentos. (formato `^\d{1,2}$`) |
| `pagamentos[].cpfCnpj` | texto | não | CPF/CNPJ de quem recebeu o pagamento. Com ou sem pontuação. (até 20 caracteres) |
| `pagamentos[].valor` | valor monetário | não | Valor pago. |
| `pagamentos[].parcelaNaoDedutivel` | valor monetário | não | Parcela não dedutível ou valor reembolsado. |
| `pagamentos[].beneficiario` | `"T"` \\| `"D"` \\| `"A"` | não | Para quem foi a despesa: T titular, D dependente, A alimentando. |
| `pagamentos[].cpfDependente` | texto | não | CPF do dependente ou alimentando. Com ou sem pontuação. (até 20 caracteres) |
| `rendimentosIsentos` | lista de objeto | não | (até 500 itens) |
| `rendimentosIsentos[].codigo` | texto | não | Código do rendimento isento (10 = parcela isenta 65+). (formato `^\d{1,2}$`) |
| `rendimentosIsentos[].valor` | valor monetário | não | Valor. |
| `tributacaoExclusiva` | lista de objeto | não | (até 500 itens) |
| `tributacaoExclusiva[].codigo` | texto | não | Código do rendimento exclusivo. (formato `^\d{1,2}$`) |
| `tributacaoExclusiva[].valor` | valor monetário | não | Valor. |
| `impostoPago` | objeto | não |   |
| `impostoPago.complementar` | valor monetário | não | Imposto complementar pago. |
| `impostoPago.exterior` | valor monetário | não | Imposto pago no exterior. |
| `impostoPago.irrfLei11033` | valor monetário | não | IRRF da Lei 11.033/2004. |
| `doacoesDiretas` | objeto | não |   |
| `doacoesDiretas.eca` | valor monetário | não | Doação direta na declaração ao Fundo da Criança e do Adolescente. |
| `doacoesDiretas.idoso` | valor monetário | não | Doação direta na declaração ao Fundo da Pessoa Idosa. |
| `doacoesEfetuadas` | lista de objeto | não | (até 500 itens) |
| `doacoesEfetuadas[].codigo` | texto | não | Código da doação (40 a 47). (formato `^\d{1,2}$`) |
| `doacoesEfetuadas[].valor` | valor monetário | não | Valor doado. |
| `doacoesEfetuadas[].parcelaNaoDedutivel` | valor monetário | não | Parcela não dedutível. |
| `modelo` | `"completo"` \\| `"simplificado"` \\| `"ambos"` | não | Qual modelo explicar; 'ambos' inclui também a comparação. (padrão: `"ambos"`) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `modeloMaisVantajoso` | `"completo"` \\| `"simplificado"` |   |
| `linhas` | lista de objeto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "titular": {
    "cpf": "11006743812",
    "nome": "MARIA FICTICIA EXEMPLO",
    "nascimento": "1985-03-15"
  },
  "dependentes": [
    {
      "cpf": "11018008608",
      "nome": "PEDRO FICTICIO EXEMPLO",
      "nascimento": "2015-08-20",
      "codigo": "21"
    }
  ],
  "rendimentosPJ": [
    {
      "cnpj": "62762582000109",
      "nome": "EMPRESA FICTICIA LTDA",
      "rendimento": "85.000,00",
      "previdenciaOficial": "9.350,00",
      "irrf": "7.420,00",
      "decimoTerceiro": "7.000,00",
      "irrfDecimoTerceiro": "480,00"
    }
  ],
  "pagamentos": [
    {
      "codigo": "10",
      "cpfCnpj": "78248445000182",
      "valor": "3.200,00"
    },
    {
      "codigo": "01",
      "cpfCnpj": "93734308000141",
      "valor": "6.000,00",
      "beneficiario": "D",
      "cpfDependente": "11018008608"
    }
  ],
  "modelo": "simplificado"
}
```

Resposta em texto:

```text
Modelo simplificado:
1. Rendimentos tributáveis: R$ 85.000,00 [Mesma soma do modelo completo.]
2. Desconto simplificado: 20% de R$ 85.000,00 = R$ 17.000,00, limitado a R$ 16.754,34; desconto R$ 16.754,34 [Lei 9.250/1995, art. 10, com o teto do exercício 2026: substitui todas as deduções legais.]
3. Base de cálculo: R$ 85.000,00 - R$ 16.754,34 = R$ 68.245,66 [Base = rendimentos tributáveis menos o desconto simplificado.]
4. Imposto pela tabela anual (alíquota de 27,50% menos parcela a deduzir de R$ 10.853,78): R$ 7.913,77 [Tabela progressiva anual do exercício 2026; no simplificado não há dedução de incentivo.]
5. Imposto devido: R$ 7.913,77 [No simplificado o imposto devido é o da tabela.]
6. Imposto retido na fonte (fichas PJ, sem o IRRF do 13º): R$ 7.420,00 [Antecipação compensável no ajuste; o IRRF do 13º é definitivo.]
7. Carnê-leão pago (Darf 0190): R$ 0,00 [Antecipação compensável no ajuste.]
8. Imposto complementar (Darf 0246): R$ 0,00 [Recolhimento facultativo compensável no ajuste.]
9. Imposto pago no exterior: informado R$ 0,00, limite R$ 0,00 (imposto com os rendimentos do exterior menos o imposto sem eles); compensado R$ 0,00 [Lei 9.250/1995, art. 5º, e Ajuda do programa (ficha Imposto Pago/Retido, linha 02).]
10. IRRF da Lei 11.033/2004: R$ 0,00 [Lei 11.033/2004, art. 2º, § 1º e § 2º.]
11. Total de imposto pago: R$ 7.420,00 [Soma das linhas de imposto pago.]
12. Saldo de imposto a pagar: R$ 7.913,77 - R$ 7.420,00, se positivo = R$ 493,77 [Lei 9.250/1995, art. 13.]
13. Imposto a restituir: R$ 7.420,00 - R$ 7.913,77, se positivo = R$ 0,00 [Lei 9.250/1995, art. 13.]
14. Alíquota efetiva: 9,31% (valor em centésimos de ponto percentual) [Resumo: imposto devido dividido pelos rendimentos tributáveis, truncado em 2 casas.]

Simulação do MCP Imposto de Renda; confira no programa oficial da Receita Federal antes de transmitir.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "modeloMaisVantajoso": "completo",
  "linhas": [
    {
      "modelo": "simplificado",
      "codigo": "rendimentos.tributaveis",
      "descricao": "Rendimentos tributáveis: R$ 85.000,00",
      "valor": "8500000",
      "regra": "Mesma soma do modelo completo."
    },
    {
      "modelo": "simplificado",
      "codigo": "desconto.simplificado",
      "descricao": "Desconto simplificado: 20% de R$ 85.000,00 = R$ 17.000,00, limitado a R$ 16.754,34; desconto R$ 16.754,34",
      "valor": "1675434",
      "regra": "Lei 9.250/1995, art. 10, com o teto do exercício 2026: substitui todas as deduções legais."
    },
    "(+12 itens omitidos)"
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 59 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-RODAPE-COMPARATIVO` Painel de imposto e comparativo no rodapé (P0, implementada)
- `M-AJUDA-CONTEXTUAL` Ajuda de campo (F1) e textos em azul (P1, implementada)
- `S-REGRA-AR-RESULTADO` Resultado tributável da atividade rural (P1, implementada)
- `S-REGRA-REGIME` Regime de tributação (deduções legais ou desconto simplificado) (P0, implementada)
- `F-ISENTO-15` Parcela não tributável correspondente à atividade rural (P1, implementada)
- `F-ISENTO-22` Recuperação de prejuízos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro) (P1, implementada)
- `F-ISENTO-27` Juros referentes aos Rendimentos Recebidos Acumuladamente (P1, implementada)
- `F-EXCL-01` 13º salário (P0, implementada)
- e mais 51 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `calcular_quotas`

**Calcular quotas do imposto a pagar**. Não grava nada.

Divide o saldo de imposto a pagar em até 8 quotas (mínimo R$ 50,00 cada; abaixo de R$ 100,00 só quota única), com vencimentos e juros Selic a partir da 2ª quota.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `exercicio` | inteiro | não | Exercício (ano de entrega). Hoje só 2026 (ano-calendário 2025) é suportado. (padrão: `2026`) |
| `saldo` | valor monetário | **sim** | Saldo de imposto a pagar. |
| `quotas` | inteiro (1 a 8) | **sim** | Número de quotas (1 a 8). |
| `data_vencimento` | texto | não | Vencimento da 1ª quota (AAAA-MM-DD). Padrão: prazo do exercício (2026-05-29). |
| `selic_mensal` | objeto livre | não | Selic mensal por mês "AAAA-MM", em percentual com vírgula ("1,10" = 1,10%). Necessária a partir da 3ª quota. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `saldo` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `numeroQuotas` | número |   |
| `quotas` | lista de objeto |   |
| `avisos` | lista de texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "saldo": "3.000,00",
  "quotas": 3
}
```

Resposta em texto:

```text
Quota 1: vence 2026-05-29, principal R$ 1.000,00, juros R$ 0,00, total R$ 1.000,00
Quota 2: vence 2026-06-30, principal R$ 1.000,00, juros R$ 10,00, total R$ 1.010,00
Quota 3: vence 2026-07-31, principal R$ 1.000,00, juros a calcular (Selic não informada)
Aviso: Quota 3: Selic de 2026-06 não informada; juros não calculados.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "saldo": "300000",
  "numeroQuotas": 3,
  "quotas": [
    {
      "numero": 1,
      "vencimento": "2026-05-29",
      "principal": "100000",
      "percentualJuros": "0",
      "juros": "0",
      "total": "100000"
    },
    {
      "numero": 2,
      "vencimento": "2026-06-30",
      "principal": "100000",
      "percentualJuros": "100",
      "juros": "1000",
      "total": "101000"
    },
    "(+1 itens omitidos)"
  ],
  "avisos": [
    "Quota 3: Selic de 2026-06 não informada; juros não calculados."
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 8 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-IMPR-DARF` Imprimir Darf do IRPF (P0, implementada)
- `F-SAIDA-PAGTO` Pagamento, restituição e disposições finais da Saída Definitiva (P1, implementada)
- `F-DFE-PAGTO` Pagamento do Imposto (Final de Espólio) (P1, implementada)
- `F-RESUMO-QUOTAS` Resumo, Imposto a pagar: formas de pagamento, quotas e débito automático (P0, implementada)
- `S-PAG-DEBITO` Débito automático das quotas (P0, implementada)
- `S-PAG-PARCEL` Parcelamento do imposto (P0, implementada)
- `S-PAG-QUOTAS-PRAZO` Valor das quotas pagas dentro do prazo (P0, implementada)
- `S-PAG-VENC` Vencimento das quotas (P0, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `calcular_multa_atraso`

**Calcular multa por atraso na entrega**. Não grava nada.

Multa por atraso (MAED): 1% ao mês-calendário ou fração sobre o imposto devido, mínimo R$ 165,74 e máximo 20%. Sem data de entrega, usa a data de hoje.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `exercicio` | inteiro | não | Exercício (ano de entrega). Hoje só 2026 (ano-calendário 2025) é suportado. (padrão: `2026`) |
| `imposto_devido` | valor monetário | **sim** | Imposto devido da declaração. |
| `data_entrega` | texto | não | Data da entrega (AAAA-MM-DD). Padrão: hoje. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `multa` | texto | Inteiro de centavos em texto (123456 = R$ 1.234,56). |
| `meses` | número |   |
| `dataEntrega` | texto |   |
| `explicacao` | texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "imposto_devido": "2.500,00",
  "data_entrega": "2026-07-15"
}
```

Resposta em texto:

```text
3 mês(es) de atraso x 1% de R$ 2.500,00 = R$ 75,00, limitado a 20% (R$ 500,00) e no mínimo R$ 165,74: R$ 165,74.
Multa: R$ 165,74 (entrega em 2026-07-15).
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "multa": "16574",
  "meses": 3,
  "dataEntrega": "2026-07-15",
  "explicacao": "3 mês(es) de atraso x 1% de R$ 2.500,00 = R$ 75,00, limitado a 20% (R$ 500,00) e no mínimo R$ 165,74: R$ 165,74."
}
```

</details>

### Funções do programa oficial

Aparece em 5 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-IMPR-DARF-MAED` Imprimir Darf de Multa por Atraso na Entrega (P1, implementada)
- `S-REGRA-MULTA-ATRASO` Multa por atraso na entrega (MAED) (P1, implementada)
- `F-SAIDA-MULTA` Multa por atraso na entrega da Saída Definitiva (P1, implementada)
- `F-DFE-PRAZO` Observações finais: prazo, multa, pagamento, restituição (P1, implementada)
- `S-NOTIFICACAO-MAED` Notificação de lançamento da multa por atraso emitida pelo PGD (P2, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `consultar_parametros`

**Consultar parâmetros do exercício**. Não grava nada.

Tabela progressiva anual, limites de dedução, desconto simplificado, prazos e quotas do exercício, com as fontes oficiais. Valores em centavos.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `exercicio` | inteiro | não | Exercício (ano de entrega). Hoje só 2026 (ano-calendário 2025) é suportado. (padrão: `2026`) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `exercicio` | número |   |
| `anoCalendario` | número |   |
| `tabelaProgressiva` | lista de objeto |   |
| `parametros` | objeto livre |   |
| `fontes` | objeto livre |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{}
```

Resposta em texto:

```text
Exercício 2026 (ano-calendário 2025). Tabela progressiva anual:
- até R$ 28.467,20: 0,00%, parcela a deduzir R$ 0,00
- até R$ 33.919,80: 7,50%, parcela a deduzir R$ 2.135,04
- até R$ 45.012,60: 15,00%, parcela a deduzir R$ 4.679,03
- até R$ 55.976,16: 22,50%, parcela a deduzir R$ 8.054,97
- acima da faixa anterior: 27,50%, parcela a deduzir R$ 10.853,78
Dedução por dependente: R$ 2.275,08; instrução: até R$ 3.561,50 por pessoa.
Desconto simplificado: 20% limitado a R$ 16.754,34.
Prazo de entrega: 2026-05-29; até 8 quotas.
Fontes: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2025 ; https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/dirpf/p-r-irpf-2026-v1-00-2026-04-23.pdf ; https://www.planalto.gov.br/ccivil_03/leis/l9250.htm ; https://www.planalto.gov.br/ccivil_03/_Ato2023-2026/2025/Lei/L15191.htm
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "exercicio": 2026,
  "anoCalendario": 2025,
  "tabelaProgressiva": [
    {
      "ate": "2846720",
      "aliquota": "0,00%",
      "parcelaDeduzir": "0"
    },
    {
      "ate": "3391980",
      "aliquota": "7,50%",
      "parcelaDeduzir": "213504"
    },
    "(+3 itens omitidos)"
  ],
  "parametros": {
    "exercicio": 2026,
    "anoCalendario": 2025,
    "deducaoDependente": 227508,
    "limiteInstrucao": 356150,
    "descontoSimplificadoPercentual": 20,
    "descontoSimplificadoTeto": 1675434,
    "previdenciaComplementarPercentual": 12,
    "parcelaIsenta65Mensal": 190398,
    "parcelaIsenta65Anual": 2284776,
    "incentivoDiretoEcaPercentual": 3,
    "incentivoDiretoIdosoPercentual": 3,
    "incentivoGlobalPercentual": 6,
    "incentivoGlobalComDesportoPercentual": 7,
    "incentivoPronasPercentual": 1,
    "incentivoPrononPercentual": 1,
    "prazoEntrega": "2026-05-29",
    "vencimentosQuotas": [
      "2026-05-29",
      "2026-06-30",
      "(+6 itens omitidos)"
    ],
    "quotasMaximo": 8,
    "quotaMinima": 5000,
    "quotaUnicaAbaixoDe": 10000,
    "saldoMinimoRecolhimento": 1000,
    "multaAtrasoMinima": 16574,
    "multaAtrasoPercentualMes": 1,
    "multaAtrasoPercentualMaximo": 20,
    "obrigatoriedadeRendimentosTributaveis": 3558400
  },
  "fontes": {
    "tabelas2025": "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2025",
    "perguntasRespostas": "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/dirpf/p-r-irpf-2026-v1-00-2026-04-23.pdf",
    "lei9250": "https://www.planalto.gov.br/ccivil_03/leis/l9250.htm",
    "lei15191": "https://www.planalto.gov.br/ccivil_03/_Ato2023-2026/2025/Lei/L15191.htm"
  }
}
```

</details>

### Funções do programa oficial

Aparece em 22 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-FERR-INFO-CALCULO` Constantes de cálculo (inferido, tela de testes) (P2, implementada)
- `F-IDENT-END-BR` Endereço - Brasil (P0, parcial)
- `F-IDENT-END-EXT` Endereço - Exterior (P0, parcial)
- `F-IDENT-OCUP` Ocupação Principal (P0, implementada)
- `F-BENS-G01` Grupo 01, Bens imóveis (P0, implementada)
- `F-BENS-G02` Grupo 02, Bens móveis (P0, implementada)
- `F-BENS-G03` Grupo 03, Participações societárias (P0, implementada)
- `F-BENS-G04` Grupo 04, Aplicações e investimentos (P0, implementada)
- e mais 14 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)
