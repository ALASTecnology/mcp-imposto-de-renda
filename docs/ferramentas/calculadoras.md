<!-- Arquivo gerado por `pnpm docs:catalogo` (tools/docs/referencia.mjs). Não edite à mão. -->

<a id="topo"></a>

# Grupo `calculadoras`

Calculadoras auxiliares offline: renda variável, preço médio, carnê-leão, RRA, ganho de capital e acréscimos. Calculadoras auxiliares que funcionam sem declaração aberta.

**10 ferramentas**, 0 delas gravam na pasta autorizada. O grupo funciona mesmo sem `--dir`.

| Ferramenta | Título | Grava? |
| --- | --- | --- |
| [`calcular_carne_leao`](#calcular_carne_leao) | Calcular o carnê-leão do mês | não |
| [`calcular_rra`](#calcular_rra) | Simular rendimentos recebidos acumuladamente | não |
| [`calcular_preco_medio`](#calcular_preco_medio) | Calcular preço médio e ganho por venda | não |
| [`apurar_renda_variavel`](#apurar_renda_variavel) | Apurar a renda variável mês a mês | não |
| [`calcular_ganho_capital`](#calcular_ganho_capital) | Simular ganho de capital | não |
| [`atualizar_custo_bem`](#atualizar_custo_bem) | Atualizar o custo de um bem | não |
| [`calcular_acrescimos_moratorios`](#calcular_acrescimos_moratorios) | Calcular multa e juros de mora | não |
| [`calcular_condicao_residencia`](#calcular_condicao_residencia) | Determinar a condição de residente | não |
| [`verificar_obrigatoriedade`](#verificar_obrigatoriedade) | Verificar a obrigatoriedade de declarar | não |
| [`converter_moeda`](#converter_moeda) | Converter valor em moeda estrangeira | não |

## `calcular_carne_leao`

**Calcular o carnê-leão do mês**. Não grava nada.

Calcula o carnê-leão (Darf 0190) de um mês de 2025 pela tabela progressiva mensal vigente no mês (janeiro a abril pela Lei 14.848/2024; maio a dezembro pela Lei 15.191/2025), com as deduções de previdência oficial, dependentes (R$ 189,59 cada), pensão e livro-caixa, ou o desconto simplificado mensal quando mais vantajoso.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `mes` | inteiro (1 a 12) | **sim** |   |
| `rendimentos` | valor monetário | **sim** | Rendimentos do mês recebidos de PF ou do exterior. |
| `previdencia` | valor monetário | não | Previdência oficial paga no mês. |
| `dependentes` | inteiro (0 a 99) | não | (padrão: `0`) |
| `pensao` | valor monetário | não | Pensão alimentícia judicial paga no mês. |
| `livro_caixa` | valor monetário | não | Despesas escrituradas no livro-caixa. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `base` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `imposto` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `deducoesLegais` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `descontoSimplificado` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `usaSimplificado` | booleano |   |
| `codigoDarf` | texto |   |
| `vencimento` | texto |   |
| `avisos` | lista de texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "mes": 6,
  "rendimentos": "9.800,00",
  "previdencia": "166,98",
  "livro_caixa": "2.350,00"
}
```

Resposta em texto:

```text
Carnê-leão de 6/2025: base R$ 7.283,02 (deduções legais), imposto R$ 1.094,10, Darf 0190 até 31/07/2025. Cálculo de orientação do MCP Imposto de Renda; confira no programa oficial, no GCAP ou no Carnê-Leão Web.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "deducoesLegais": 251698,
  "descontoSimplificado": 60720,
  "usaSimplificado": false,
  "base": 728302,
  "imposto": 109410,
  "codigoDarf": "0190",
  "vencimento": "2025-07-31",
  "avisos": [
    "Vencimentos calculados como último dia útil considerando só sábados e domingos; se cair em feriado nacional, o prazo é o dia útil anterior.",
    "Cálculo de orientação do MCP Imposto de Renda; confira no programa oficial, no GCAP ou no Carnê-Leão Web."
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 1 linha da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `D-CL-PROGRAMA` Programa Carnê-Leão (e-CAC) (P2, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `calcular_rra`

**Simular rendimentos recebidos acumuladamente**. Não grava nada.

Calcula o imposto do RRA pela tabela progressiva acumulada (tabela mensal do mês do recebimento vezes o número de meses, art. 12-A da Lei 7.713/1988) e, com os demais rendimentos tributáveis do ano, compara com a opção pelo ajuste anual (tabela anual).

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `rendimentos` | valor monetário | **sim** | Rendimentos tributáveis do RRA (sem juros de mora). |
| `numero_meses` | número | **sim** | Meses a que se referem, com uma casa decimal; mínimo 0,1 (IN RFB 1.500/2014, art. 45). |
| `mes_recebimento` | inteiro (1 a 12) | **sim** |   |
| `previdencia` | valor monetário | não | Contribuição previdenciária oficial descontada. |
| `pensao` | valor monetário | não | Pensão alimentícia descontada. |
| `irrf` | valor monetário | não | Imposto retido na fonte. |
| `outros_rendimentos_base` | valor monetário | não | Base de cálculo anual dos demais rendimentos, para comparar com o ajuste. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `base` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `impostoExclusivo` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `saldoExclusivo` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `impostoAjusteAnual` | texto ou inteiro ou nulo |   |
| `maisVantajosa` | `"exclusivaNaFonte"` \| `"ajusteAnual"` ou nulo |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "rendimentos": "30.000,00",
  "numero_meses": 14,
  "mes_recebimento": 8,
  "irrf": "2.100,00"
}
```

Resposta em texto:

```text
RRA: base R$ 30.000,00, imposto pela tabela acumulada R$ 0,00. Cálculo de orientação do MCP Imposto de Renda; confira no programa oficial, no GCAP ou no Carnê-Leão Web.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "base": 3000000,
  "impostoExclusivo": 0,
  "saldoExclusivo": -210000,
  "impostoAjusteAnual": null,
  "maisVantajosa": null
}
```

</details>

### Funções do programa oficial

Aparece em 4 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `S-REGRA-RRA` Rendimentos recebidos acumuladamente (regra geral) (P1, parcial)
- `F-RRA` Rendimentos Recebidos Acumuladamente (ficha) (P1, parcial)
- `F-RRA-TIT` Rendimentos Tributáveis de PJ Recebidos Acumuladamente pelo Titular (P1, parcial)
- `F-RRA-DEP` Rendimentos Tributáveis de PJ Recebidos Acumuladamente pelos Dependentes (P1, parcial)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `calcular_preco_medio`

**Calcular preço médio e ganho por venda**. Não grava nada.

Calcula o custo médio ponderado por ativo e o resultado de cada venda a partir das notas de corretagem (compras e vendas com custos), separando day-trade (compra e venda do mesmo ativo no mesmo dia), para preencher a Renda Variável.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `operacoes` | lista de objeto | **sim** | (até 5000 itens) |
| `operacoes[].data` | texto | **sim** | (formato `^\d{4}-\d{2}-\d{2}$`) |
| `operacoes[].ativo` | texto | **sim** | (até 20 caracteres) |
| `operacoes[].tipo` | `"compra"` \| `"venda"` | **sim** |   |
| `operacoes[].quantidade` | inteiro | **sim** |   |
| `operacoes[].valor` | valor monetário | **sim** | Valor total da operação, sem custos. |
| `operacoes[].custos` | valor monetário | não | Corretagem, emolumentos e taxas. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `vendas` | lista de objeto |   |
| `posicoes` | lista de objeto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "operacoes": [
    {
      "data": "2025-02-03",
      "ativo": "FICT3",
      "tipo": "compra",
      "quantidade": 100,
      "valor": "2.500,00",
      "custos": "5,00"
    },
    {
      "data": "2025-03-10",
      "ativo": "FICT3",
      "tipo": "compra",
      "quantidade": 100,
      "valor": "2.700,00",
      "custos": "5,00"
    },
    {
      "data": "2025-06-02",
      "ativo": "FICT3",
      "tipo": "venda",
      "quantidade": 150,
      "valor": "4.200,00",
      "custos": "5,00"
    }
  ]
}
```

Resposta em texto:

```text
- 02/06/2025 FICT3: 150 un., resultado R$ 287,50
Posição FICT3: 50 un., custo R$ 1.302,50
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "vendas": [
    {
      "data": "2025-06-02",
      "ativo": "FICT3",
      "quantidade": 150,
      "valorLiquido": 419500,
      "custoMedio": 2605,
      "resultado": 28750,
      "dayTrade": false
    }
  ],
  "posicoes": [
    {
      "ativo": "FICT3",
      "quantidade": 50,
      "custoTotal": 130250,
      "custoMedio": 2605
    }
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 2 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `D-RV-PROC` Procedimentos para Apuração dos Ganhos Líquidos ou Perdas (P2, implementada)
- `D-FII-PROC` Procedimentos para Apuração (FII/Fiagro) (P2, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `apurar_renda_variavel`

**Apurar a renda variável mês a mês**. Não grava nada.

Apura o imposto mensal sobre ganhos líquidos: operações comuns 15%, day-trade 20%, FII e Fiagro 20%, com compensação de prejuízos separada por tipo, compensação de IR na fonte (day-trade e Lei 11.033/2004), isenção de ganhos com ações à vista quando as vendas do mês não passam de R$ 20.000,00 e Darf 6015 com vencimento no último dia útil do mês seguinte. Imposto abaixo de R$ 10,00 não é recolhido no mês: soma-se ao dos meses seguintes até chegar a R$ 10,00 (Lei 9.430/1996, art. 68, § 1º).

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `meses` | lista de objeto | **sim** | (até 12 itens) |
| `meses[].mes` | inteiro (1 a 12) | **sim** |   |
| `meses[].comuns` | valor monetário | não | Resultado líquido das operações comuns (negativo para perda). |
| `meses[].day_trade` | valor monetário | não | Resultado líquido de day-trade. |
| `meses[].fii` | valor monetário | não | Resultado líquido com FII ou Fiagro. |
| `meses[].vendas_acoes` | valor monetário | não | Total de vendas de ações à vista no mês. |
| `meses[].ganho_acoes_vista` | valor monetário | não | Parte de 'comuns' que é ganho com ações à vista. |
| `meses[].irrf_day_trade` | valor monetário | não | IR na fonte de day-trade. |
| `meses[].irrf_lei_11033` | valor monetário | não | IR na fonte da Lei 11.033/2004. |
| `prejuizo_anterior_comuns` | valor monetário | não | Prejuízo de anos anteriores, comuns. |
| `prejuizo_anterior_day_trade` | valor monetário | não | Prejuízo de anos anteriores, day-trade. |
| `prejuizo_anterior_fii` | valor monetário | não | Prejuízo de anos anteriores, FII. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `meses` | lista de objeto |   |
| `avisos` | lista de texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "meses": [
    {
      "mes": 3,
      "comuns": "-800,00",
      "vendas_acoes": "15.000,00"
    },
    {
      "mes": 6,
      "comuns": "2.300,00",
      "vendas_acoes": "32.000,00"
    }
  ]
}
```

Resposta em texto:

```text
- 3/2025: imposto R$ 0,00, a pagar R$ 0,00
- 6/2025: imposto R$ 225,00, a pagar R$ 225,00 até 31/07/2025 (Darf 6015)
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "meses": [
    {
      "mes": 3,
      "isentoAcoes": 0,
      "baseComuns": 0,
      "baseDayTrade": 0,
      "baseFii": 0,
      "impostoDevido": 0,
      "irrfCompensado": 0,
      "impostoMesesAnteriores": 0,
      "impostoPagar": 0,
      "recolher": false,
      "impostoPendente": 0,
      "prejuizoComunsSeguinte": 80000,
      "prejuizoDayTradeSeguinte": 0,
      "prejuizoFiiSeguinte": 0,
      "vencimento": "2025-04-30"
    },
    {
      "mes": 6,
      "isentoAcoes": 0,
      "baseComuns": 150000,
      "baseDayTrade": 0,
      "baseFii": 0,
      "impostoDevido": 22500,
      "irrfCompensado": 0,
      "impostoMesesAnteriores": 0,
      "impostoPagar": 22500,
      "recolher": true,
      "impostoPendente": 0,
      "prejuizoComunsSeguinte": 0,
      "prejuizoDayTradeSeguinte": 0,
      "prejuizoFiiSeguinte": 0,
      "vencimento": "2025-07-31"
    }
  ],
  "avisos": [
    "Vencimentos calculados como último dia útil considerando só sábados e domingos; se cair em feriado nacional, o prazo é o dia útil anterior.",
    "Cálculo de orientação do MCP Imposto de Renda; confira no programa oficial, no GCAP ou no Carnê-Leão Web."
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 2 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `D-RV-PROC` Procedimentos para Apuração dos Ganhos Líquidos ou Perdas (P2, implementada)
- `D-FII-PROC` Procedimentos para Apuração (FII/Fiagro) (P2, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `calcular_ganho_capital`

**Simular ganho de capital**. Não grava nada.

Simulador de orientação para alienação de imóvel, móvel ou participação: ganho = valor de alienação menos corretagem e custo; reduções da Lei 7.713/1988 (aquisição até 1988) e fatores FR1/FR2 da Lei 11.196/2005 para imóveis; isenções do único imóvel até R$ 440.000,00, da reaplicação em outro imóvel residencial e de pequeno valor; alíquotas de 15%, 17,5%, 20% e 22,5% por faixa. O demonstrativo oficial é o GCAP.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `tipo` | `"imovel"` \| `"movel"` \| `"participacao"` | **sim** |   |
| `valor_alienacao` | valor monetário | **sim** | Valor de alienação. |
| `custo_corretagem` | valor monetário | não | Corretagem paga pelo vendedor. |
| `custo_aquisicao` | valor monetário | **sim** | Custo de aquisição (com reformas). |
| `data_aquisicao` | texto | **sim** | (formato `^\d{4}-\d{2}-\d{2}$`) |
| `data_alienacao` | texto | **sim** | (formato `^\d{4}-\d{2}-\d{2}$`) |
| `unico_imovel` | booleano | não |   |
| `valor_aplicado_outro_imovel` | valor monetário | não | Valor aplicado em outro imóvel residencial em 180 dias. |
| `total_alienado_no_mes` | valor monetário | não | Total de alienações de bens da mesma natureza no mês. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ganhoBruto` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `reducoes` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `ganhoTributavel` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `isento` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `imposto` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `codigoDarf` | texto |   |
| `vencimento` | texto |   |
| `avisos` | lista de texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "tipo": "imovel",
  "valor_alienacao": "650.000,00",
  "custo_corretagem": "19.500,00",
  "custo_aquisicao": "380.000,00",
  "data_aquisicao": "2012-05-10",
  "data_alienacao": "2025-09-22"
}
```

Resposta em texto:

```text
Ganho bruto R$ 250.500,00, reduções R$ 107.272,17, tributável R$ 143.227,83, imposto R$ 21.484,17 (Darf 4600 até 31/10/2025).  Cálculo de orientação do MCP Imposto de Renda; confira no programa oficial, no GCAP ou no Carnê-Leão Web.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "ganhoBruto": 25050000,
  "reducoes": 10727217,
  "ganhoTributavel": 14322783,
  "isento": 10727217,
  "imposto": 2148417,
  "avisos": [
    "Vencimentos calculados como último dia útil considerando só sábados e domingos; se cair em feriado nacional, o prazo é o dia útil anterior.",
    "Cálculo de orientação do MCP Imposto de Renda; confira no programa oficial, no GCAP ou no Carnê-Leão Web."
  ],
  "codigoDarf": "4600",
  "vencimento": "2025-10-31"
}
```

</details>

### Funções do programa oficial

Aparece em 5 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-DEMO-ACOES` Novo, Abrir, Fechar, Excluir e Retificar Demonstrativo (inferido) (P2, parcial)
- `D-GCAP-IMOVEIS` Ganhos de Capital - Bens Imóveis (P1, parcial)
- `D-GCAP-MOVEIS` Ganhos de Capital - Direitos/Bens Móveis (P1, parcial)
- `D-GCAP-PARTICIP` Ganhos de Capital - Participações Societárias (P1, parcial)
- `D-GCAP-MOEDA` Ganhos de Capital - Moedas em Espécie (P1, parcial)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `atualizar_custo_bem`

**Atualizar o custo de um bem**. Não grava nada.

Orientação e cálculo da atualização do custo de bem ou direito com os valores informados pelo usuário: 'ufir' (bens adquiridos até 31/12/1995, quantidade de UFIR vezes R$ 0,8287, Lei 9.249/1995, art. 17), 'fator' (valor vezes um coeficiente informado) ou 'lei14973' (atualização de imóvel a valor de mercado com imposto de 4% sobre a diferença, Lei 14.973/2024). Não grava: para registrar, altere o bem na ficha Bens e Direitos ou marque o caso especial do bem.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `metodo` | `"ufir"` \| `"fator"` \| `"lei14973"` | **sim** |   |
| `valor_original` | valor monetário | não | Custo de aquisição (métodos fator e lei14973). |
| `quantidade_ufir` | texto | não | Quantidade de UFIR do custo (método ufir), com vírgula ("12345,6789"). (até 24 caracteres) |
| `fator` | texto | não | Coeficiente de atualização informado pelo usuário (método fator), "1,234567". (até 24 caracteres) |
| `valor_mercado` | valor monetário | não | Valor de mercado do imóvel (método lei14973). |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `metodo` | texto |   |
| `valorOriginal` | texto ou inteiro ou nulo |   |
| `valorAtualizado` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `diferenca` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `imposto` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `baseLegal` | texto |   |
| `orientacao` | lista de texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "metodo": "ufir",
  "quantidade_ufir": "12345,6789"
}
```

Resposta em texto:

```text
Valor atualizado: R$ 10.230,86.
Base: Lei 9.249/1995, art. 17: custo em UFIR convertido por R$ 0,8287 (UFIR de 1º/1/1996); após 1995 não há atualização.
Informe o valor atualizado na situação de cada ano do bem; a discriminação deve citar o custo em UFIR.
Cálculo de orientação do MCP Imposto de Renda; confira no programa oficial, no GCAP ou no Carnê-Leão Web.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "metodo": "ufir",
  "valorOriginal": null,
  "valorAtualizado": 1023086,
  "diferenca": 0,
  "imposto": 0,
  "baseLegal": "Lei 9.249/1995, art. 17: custo em UFIR convertido por R$ 0,8287 (UFIR de 1º/1/1996); após 1995 não há atualização.",
  "orientacao": [
    "Informe o valor atualizado na situação de cada ano do bem; a discriminação deve citar o custo em UFIR."
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 2 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `F-BENS-DATAAQ` Informações dos bens conforme a data de aquisição (P1, implementada)
- `S-TAB-ATUALIZACAO` Tabela de Atualização do Custo de Bens e Direitos (P2, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `calcular_acrescimos_moratorios`

**Calcular multa e juros de mora**. Não grava nada.

Calcula a multa de mora (0,33% por dia de atraso, limitada a 20%) e os juros (Selic acumulada informada mais 1% no mês do pagamento) de qualquer débito federal vencido.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `principal` | valor monetário | **sim** | Valor principal do débito. |
| `vencimento` | texto | **sim** | (formato `^\d{4}-\d{2}-\d{2}$`) |
| `data_pagamento` | texto | **sim** | (formato `^\d{4}-\d{2}-\d{2}$`) |
| `selic_acumulada` | texto | não | Selic acumulada do mês seguinte ao vencimento até o mês anterior ao pagamento ("12,34"). (até 8 caracteres) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `diasAtraso` | número |   |
| `percentualMulta` | texto | Centésimos de ponto percentual. |
| `multa` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `juros` | texto ou inteiro ou nulo |   |
| `total` | texto ou inteiro ou nulo |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "principal": "1.500,00",
  "vencimento": "2026-05-29",
  "data_pagamento": "2026-07-10",
  "selic_acumulada": "1,05"
}
```

Resposta em texto:

```text
42 dia(s) de atraso: multa R$ 207,90, juros R$ 30,75, total R$ 1.738,65.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "diasAtraso": 42,
  "percentualMulta": "1386",
  "multa": 20790,
  "juros": 3075,
  "total": 173865
}
```

</details>

### Funções do programa oficial

Aparece em 2 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `F-SAIDA-PAGTO` Pagamento, restituição e disposições finais da Saída Definitiva (P1, implementada)
- `S-PAG-APOS-PRAZO` Pagamento após o prazo (P1, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `calcular_condicao_residencia`

**Determinar a condição de residente**. Não grava nada.

Determina a data em que a pessoa passa a residente ou não residente no Brasil (IN SRF 208/2002): saída definitiva (não residente na data da saída), ausência temporária (não residente no dia seguinte ao que completar 12 meses fora), retorno de brasileiro ou visto permanente (residente na chegada) e visto temporário (residente ao completar 184 dias no país em 12 meses).

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `evento` | `"saida_definitiva"` \| `"ausencia_temporaria"` \| `"retorno"` \| `"visto_permanente"` \| `"visto_temporario"` | **sim** |   |
| `data` | texto | **sim** | Data da saída ou da chegada. (formato `^\d{4}-\d{2}-\d{2}$`) |
| `dias_no_pais` | inteiro (0 a 366) | não | Visto temporário: dias já passados no país nos 12 meses anteriores à chegada. |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `condicao` | `"residente"` \| `"naoResidente"` |   |
| `desde` | texto |   |
| `fundamento` | texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "evento": "ausencia_temporaria",
  "data": "2024-08-01"
}
```

Resposta em texto:

```text
Não residente desde 02/08/2025. Ausência temporária: não residente a partir do dia seguinte àquele em que completar 12 meses consecutivos fora do país.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "condicao": "naoResidente",
  "desde": "2025-08-02",
  "fundamento": "Ausência temporária: não residente a partir do dia seguinte àquele em que completar 12 meses consecutivos fora do país."
}
```

</details>

### Funções do programa oficial

Aparece em 3 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `S-REGRA-AUSENTE-OUTROS` Contribuinte ausente no exterior exceto a serviço do Brasil (P1, implementada)
- `S-REGRA-RESIDENTE` Contribuinte que adquiriu ou readquiriu a condição de residente (P1, implementada)
- `S-REGRA-NAO-RESIDENTE` Caracterização da condição de residente e de não residente (P1, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `verificar_obrigatoriedade`

**Verificar a obrigatoriedade de declarar**. Não grava nada.

Avalia os critérios de obrigatoriedade da declaração de 2026 (rendimentos tributáveis acima de R$ 35.584,00; isentos e exclusivos acima de R$ 200.000,00; ganho de capital; bolsa acima de R$ 40.000,00; atividade rural; bens acima de R$ 800.000,00; residência; reaplicação de imóvel; exterior e trust) a partir das respostas do usuário.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `rendimentos_tributaveis` | valor monetário | não | Rendimentos tributáveis de 2025. |
| `isentos_exclusivos` | valor monetário | não | Rendimentos isentos, não tributáveis e exclusivos de 2025. |
| `ganho_capital_tributavel` | booleano | não |   |
| `alienacoes_bolsa` | valor monetário | não | Total de alienações em bolsa em 2025. |
| `ganho_liquido_tributavel_bolsa` | booleano | não |   |
| `receita_bruta_rural` | valor monetário | não | Receita bruta da atividade rural em 2025. |
| `compensar_prejuizo_rural` | booleano | não |   |
| `bens` | valor monetário | não | Total de bens e direitos em 31/12/2025. |
| `passou_a_residente` | booleano | não |   |
| `isencao_reaplicacao_imovel` | booleano | não |   |
| `aplicacoes_exterior` | booleano | não |   |
| `trust` | booleano | não |   |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `obrigado` | booleano |   |
| `criterios` | lista de objeto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "rendimentos_tributaveis": "42.000,00",
  "bens": "150.000,00"
}
```

Resposta em texto:

```text
Obrigado a declarar.
- Rendimentos tributáveis acima de R$ 35.584,00
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "obrigado": true,
  "criterios": [
    {
      "criterio": "Rendimentos tributáveis acima de R$ 35.584,00",
      "atende": true
    },
    {
      "criterio": "Rendimentos isentos, não tributáveis ou exclusivos acima de R$ 200.000,00",
      "atende": false
    },
    "(+8 itens omitidos)"
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 3 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-IMPR-CRITERIOS-OBRIG` Impressão de critérios de obrigatoriedade (inferido) (P2, implementada)
- `S-REGRA-OBRIG` Obrigatoriedade de apresentação da Declaração de Ajuste Anual 2026 (P1, implementada)
- `D-AR-OBRIG` Obrigatoriedade de Preenchimento do Demonstrativo (P1, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `converter_moeda`

**Converter valor em moeda estrangeira**. Não grava nada.

Converte um valor em moeda estrangeira para reais pela cotação informada pelo usuário (o MCP Imposto de Renda não baixa cotações) e explica qual cotação a regra exige para cada finalidade: rendimento ou imposto pago no exterior, dedução, bem ou aplicação financeira (Lei 14.754/2023).

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `valor` | texto | **sim** | Valor na moeda estrangeira: "1.234,56" (vírgula decimal) ou "1234.56" (ponto decimal, sem separador de milhar). "1.234" é recusado por ser ambíguo. (até 32 caracteres) |
| `cotacao` | texto | **sim** | Cotação em reais por unidade ("5,1234"). (até 16 caracteres) |
| `finalidade` | `"rendimento"` \| `"imposto_exterior"` \| `"deducao"` \| `"bem"` \| `"aplicacao"` | **sim** |   |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `reais` | texto ou inteiro | Centavos (número inteiro; texto de dígitos se passar de 2^53). |
| `regra` | texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "valor": "1.200,00",
  "cotacao": "5,4321",
  "finalidade": "rendimento"
}
```

Resposta em texto:

```text
1.200,00 x 5,4321 = R$ 6.518,52. Rendimentos do exterior: converta para dólar pelo valor fixado pela autoridade do país e depois para reais pela cotação de compra do dólar do Banco Central do último dia útil da 1ª quinzena do mês anterior ao do recebimento.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "reais": 651852,
  "regra": "Rendimentos do exterior: converta para dólar pelo valor fixado pela autoridade do país e depois para reais pela cotação de compra do dólar do Banco Central do último dia útil da 1ª quinzena do mês anterior ao do recebimento."
}
```

</details>

### Funções do programa oficial

Aparece em 19 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `S-REGRA-AUSENTE-SERVICO` Contribuinte ausente no exterior a serviço do Brasil (P2, parcial)
- `S-REGRA-CONVERSAO` Conversão em reais de rendimentos ou pagamentos em moeda estrangeira (P1, parcial)
- `F-RTPF-EXT` Coluna Exterior (P1, parcial)
- `F-ISENTO-08` Ganho de capital na alienação de moeda estrangeira em espécie com total anual até US$ 5,000.00 (P2, parcial)
- `F-IMPPAGO-02` Linha 02: Imposto pago no exterior pelo titular e pelos dependentes (P1, parcial)
- `F-PAG-02` Código 02, Despesas com instrução no exterior (P1, parcial)
- `F-PAG-15` Código 15, Médicos no exterior (P1, parcial)
- `F-PAG-16` Código 16, Dentistas no exterior (P1, parcial)
- e mais 11 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)
