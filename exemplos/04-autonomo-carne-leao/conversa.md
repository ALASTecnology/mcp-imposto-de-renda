# Conversa: autônoma com carnê-leão

> Arquivo gerado por `pnpm exemplos` a partir de `roteiro.ts`, com as respostas reais do
> servidor. Não edite à mão. Todos os nomes, CPFs, CNPJs e valores são fictícios.

## 1. Pedido

**Você:** Sou psicóloga autônoma, Patrícia Fictícia Exemplo, CPF 10459818260, nascida em 30/09/1987, atendo em Recife (Rua das Mangueiras Fictícias, 300, sala 12, Boa Viagem, CEP 51020-000). Crie a declaração.

**Assistente chama `criar_declaracao`:**

```json
{
  "identificacao": {
    "cpf": "10459818260",
    "nome": "PATRICIA FICTICIA EXEMPLO",
    "dataNascimento": "1987-09-30",
    "tipoDeclaracao": {
      "tipo": "ajusteAnual"
    },
    "racaCor": "5",
    "conjuge": {
      "possui": false
    },
    "endereco": {
      "local": "brasil",
      "tipoLogradouro": "RUA",
      "logradouro": "DAS MANGUEIRAS FICTICIAS",
      "numero": "300",
      "complemento": "SALA 12",
      "bairro": "BOA VIAGEM",
      "uf": "PE",
      "municipio": "2531",
      "cep": "51020000"
    },
    "ocupacao": {
      "natureza": "11",
      "ocupacaoPrincipal": "255",
      "registroProfissional": "02/99999"
    },
    "nitPisPasep": "12137187169"
  }
}
```

**Resposta:**

```text
Declaração criada para o CPF 10459818260. Gravado 10459818260-IRPF-A-2026-2025-ORIGI.DBK (5 registros).
Arquivo novo (sem backup).
Controles: conferem.
Sem erros impeditivos; 1 aviso(s).
```

## 2. Pedido

**Você:** Recebo R$ 9.800,00 por mês de pacientes, pago INSS de R$ 166,98 e tenho R$ 2.350,00 de despesas do consultório no livro-caixa. Quanto deu o carnê-leão em janeiro e em junho?

**Assistente chama `calcular_carne_leao`:**

```json
{
  "mes": 1,
  "rendimentos": "9.800,00",
  "previdencia": "166,98",
  "livro_caixa": "2.350,00"
}
```

**Resposta:**

```text
Carnê-leão de 1/2025: base R$ 7.283,02 (deduções legais), imposto R$ 1.106,83, Darf 0190 até 28/02/2025. Cálculo de orientação do MCP Imposto de Renda; confira no programa oficial, no GCAP ou no Carnê-Leão Web.
```

**Assistente chama `calcular_carne_leao`:**

```json
{
  "mes": 6,
  "rendimentos": "9.800,00",
  "previdencia": "166,98",
  "livro_caixa": "2.350,00"
}
```

**Resposta:**

```text
Carnê-leão de 6/2025: base R$ 7.283,02 (deduções legais), imposto R$ 1.094,10, Darf 0190 até 31/07/2025. Cálculo de orientação do MCP Imposto de Renda; confira no programa oficial, no GCAP ou no Carnê-Leão Web.
```

## 3. Pedido

**Você:** Paguei exatamente esses valores todo mês. Lance o ano inteiro na ficha de rendimentos de pessoa física.

**Assistente chama `definir_rendimentos_pf_exterior`:**

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK",
  "beneficiario": {
    "tipo": "titular"
  },
  "nit_pis_pasep": "12137187169",
  "colunas": {
    "trabalhoNaoAssalariado": [
      "9.800,00",
      "9.800,00",
      "9.800,00",
      "9.800,00",
      "9.800,00",
      "9.800,00",
      "9.800,00",
      "9.800,00",
      "9.800,00",
      "9.800,00",
      "9.800,00",
      "9.800,00"
    ],
    "previdenciaOficial": [
      "166,98",
      "166,98",
      "166,98",
      "166,98",
      "166,98",
      "166,98",
      "166,98",
      "166,98",
      "166,98",
      "166,98",
      "166,98",
      "166,98"
    ],
    "livroCaixa": [
      "2.350,00",
      "2.350,00",
      "2.350,00",
      "2.350,00",
      "2.350,00",
      "2.350,00",
      "2.350,00",
      "2.350,00",
      "2.350,00",
      "2.350,00",
      "2.350,00",
      "2.350,00"
    ],
    "carneLeaoPago": [
      "1.106,83",
      "1.106,83",
      "1.106,83",
      "1.106,83",
      "1.094,10",
      "1.094,10",
      "1.094,10",
      "1.094,10",
      "1.094,10",
      "1.094,10",
      "1.094,10",
      "1.094,10"
    ]
  }
}
```

**Resposta:**

```text
Rendimentos de PF e do exterior atualizados. Gravado 10459818260-IRPF-A-2026-2025-ORIGI.DBK (17 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10459818260-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z.bak.
Controles: conferem.
Sem erros impeditivos; 0 aviso(s).
```

## 4. Pedido

**Você:** Também atendo pela Clínica Fictícia de Psicologia, que me paga como autônoma: o informe mostra R$ 36.000,00 de rendimentos e R$ 1.980,00 de imposto retido.

**Assistente chama `adicionar_rendimento_pj`:**

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK",
  "item": {
    "beneficiario": {
      "tipo": "titular"
    },
    "fonte": {
      "ni": "33691961000149",
      "nome": "CLINICA FICTICIA DE PSICOLOGIA LTDA"
    },
    "rendimentos": "36.000,00",
    "impostoRetido": "1.980,00"
  }
}
```

**Resposta:**

```text
Rendimentos Tributáveis Recebidos de Pessoa Jurídica: item 1 incluído. Gravado 10459818260-IRPF-A-2026-2025-ORIGI.DBK (18 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10459818260-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-1.bak.
Controles: conferem.
Sem erros impeditivos; 0 aviso(s).
```

## 5. Pedido

**Você:** Pago plano de saúde (R$ 5.880,00 no ano) e contribuí R$ 6.000,00 num PGBL. Tenho conta corrente com R$ 12.400,00 em 2024 e R$ 18.950,40 em 2025.

**Assistente chama `adicionar_pagamento`:**

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK",
  "item": {
    "codigo": "26",
    "nomeBeneficiario": "OPERADORA FICTICIA DE SAUDE S.A.",
    "niBeneficiario": "87234372000160",
    "valorPago": "5.880,00"
  }
}
```

**Resposta:**

```text
Pagamentos Efetuados: item 1 incluído. Gravado 10459818260-IRPF-A-2026-2025-ORIGI.DBK (19 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10459818260-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-2.bak.
Controles: conferem.
Sem erros impeditivos; 0 aviso(s).
```

**Assistente chama `adicionar_pagamento`:**

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK",
  "item": {
    "codigo": "36",
    "nomeBeneficiario": "PREVIDENCIA PRIVADA FICTICIA S.A.",
    "niBeneficiario": "02720235000183",
    "valorPago": "6.000,00"
  }
}
```

**Resposta:**

```text
Pagamentos Efetuados: item 2 incluído. Gravado 10459818260-IRPF-A-2026-2025-ORIGI.DBK (20 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10459818260-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-3.bak.
Controles: conferem.
Sem erros impeditivos; 0 aviso(s).
```

**Assistente chama `adicionar_bem`:**

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK",
  "item": {
    "grupo": "06",
    "codigo": "01",
    "discriminacao": "CONTA CORRENTE NO BANCO FICTICIO S.A.",
    "situacaoAnterior": "12.400,00",
    "situacaoAtual": "18.950,40",
    "ni": "18206098000101",
    "conta": {
      "banco": "001",
      "agencia": "8642",
      "conta": "97531",
      "dv": "1"
    }
  }
}
```

**Resposta:**

```text
Bens e Direitos: item 1 incluído. Gravado 10459818260-IRPF-A-2026-2025-ORIGI.DBK (21 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10459818260-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-4.bak.
Controles: conferem.
Sem erros impeditivos; 0 aviso(s).
```

## 6. Pedido

**Você:** Valide a declaração e me diga qual modelo compensa, com a conta detalhada.

**Assistente chama `validar_declaracao`:**

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK"
}
```

**Resposta:**

```text
Sem erros impeditivos; 0 aviso(s).
```

**Assistente chama `definir_opcao_tributacao`:**

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK",
  "opcao": "completa"
}
```

**Resposta:**

```text
Opção: deduções legais (completa); mais vantajoso pelo cálculo do MCP Imposto de Renda: completo. Gravado 10459818260-IRPF-A-2026-2025-ORIGI.DBK (21 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10459818260-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-5.bak.
Controles: conferem.
Sem erros impeditivos; 0 aviso(s).
```

**Assistente chama `explicar_calculo`:**

```json
{
  "titular": {
    "cpf": "10459818260",
    "nome": "PATRICIA FICTICIA EXEMPLO",
    "nascimento": "1987-09-30"
  },
  "rendimentosPJ": [
    {
      "cnpj": "33691961000149",
      "nome": "CLINICA FICTICIA DE PSICOLOGIA LTDA",
      "rendimento": "36.000,00",
      "irrf": "1.980,00"
    }
  ],
  "rendimentosPF": {
    "meses": [
      {
        "mes": 1,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.106,83"
      },
      {
        "mes": 2,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.106,83"
      },
      {
        "mes": 3,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.106,83"
      },
      {
        "mes": 4,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.106,83"
      },
      {
        "mes": 5,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.094,10"
      },
      {
        "mes": 6,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.094,10"
      },
      {
        "mes": 7,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.094,10"
      },
      {
        "mes": 8,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.094,10"
      },
      {
        "mes": 9,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.094,10"
      },
      {
        "mes": 10,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.094,10"
      },
      {
        "mes": 11,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.094,10"
      },
      {
        "mes": 12,
        "pessoaFisica": "9.800,00",
        "previdenciaOficial": "166,98",
        "livroCaixa": "2.350,00",
        "carneLeao": "1.094,10"
      }
    ]
  },
  "pagamentos": [
    {
      "codigo": "26",
      "cpfCnpj": "87234372000160",
      "valor": "5.880,00"
    },
    {
      "codigo": "36",
      "cpfCnpj": "02720235000183",
      "valor": "6.000,00"
    }
  ]
}
```

**Resposta:**

```text
Modelo completo:
1. Rendimentos tributáveis: PJ R$ 36.000,00 + PF R$ 117.600,00 + exterior R$ 0,00 = R$ 153.600,00 [Resumo, Rendimentos Tributáveis: soma das fichas de PJ (titular e dependentes) e de PF/Exterior. O 13º salário fica fora (tributação exclusiva).]
2. Previdência oficial: fichas PJ R$ 0,00 + PF R$ 2.003,76 = R$ 2.003,76 [Lei 9.250/1995, art. 8º, II, d; sem limite.]
3. Previdência complementar e Fapi (códigos 36 e 37): informado R$ 6.000,00, limite de 12% de R$ 153.600,00 = R$ 18.432,00; dedução R$ 6.000,00 [Lei 9.250/1995, art. 8º, II, e, e Lei 9.532/1997, art. 11: limitada a 12% do total dos rendimentos tributáveis.]
4. Dependentes: 0 x R$ 2.275,08 = R$ 0,00 [Lei 9.250/1995, art. 8º, II, c: R$ 2.275,08 por dependente no ano.]
5. Instrução (códigos 01 e 02), limite de R$ 3.561,50 por pessoa: R$ 0,00 [Lei 9.250/1995, art. 8º, II, b: limite individual por titular, dependente ou alimentando; o excesso de um não aproveita a outro.]
6. Despesas médicas (códigos 09 a 22 e 26), valor pago menos parcela não dedutível/reembolso: R$ 5.880,00 [Lei 9.250/1995, art. 8º, II, a: sem limite.]
7. Pensão alimentícia judicial ou por escritura pública (códigos 30, 31, 33 e 34): R$ 0,00 [Lei 9.250/1995, art. 8º, II, f: sem limite. A coluna Pensão da ficha PF é só informativa.]
8. Livro-caixa (ficha PF/Exterior): R$ 28.200,00 [Lei 8.134/1990, art. 6º: despesas escrituradas; o limite mensal à receita é validado no preenchimento e não é refeito aqui.]
9. Total de deduções: R$ 42.083,76 [Resumo, Deduções: soma das linhas acima.]
10. Base de cálculo: R$ 153.600,00 - R$ 42.083,76 = R$ 111.516,24 [Base = rendimentos tributáveis menos deduções, nunca negativa.]
11. Imposto pela tabela anual (alíquota de 27,50% menos parcela a deduzir de R$ 10.853,78): R$ 19.813,18 [Tabela progressiva anual do exercício 2026 (https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2025). A fração de centavo de base x alíquota é descartada (truncamento), como no programa oficial.]
12. Dedução de incentivo: nenhuma doação informada [Sem doações.]
13. Imposto devido: R$ 19.813,18 - incentivos R$ 0,00 = R$ 19.813,18 [Resumo, Cálculo do Imposto: imposto devido menos dedução de incentivo.]
14. Imposto retido na fonte (fichas PJ, sem o IRRF do 13º): R$ 1.980,00 [Antecipação compensável no ajuste; o IRRF do 13º é definitivo.]
15. Carnê-leão pago (Darf 0190): R$ 13.180,12 [Antecipação compensável no ajuste.]
16. Imposto complementar (Darf 0246): R$ 0,00 [Recolhimento facultativo compensável no ajuste.]
17. Imposto pago no exterior: informado R$ 0,00, limite R$ 0,00 (imposto com os rendimentos do exterior menos o imposto sem eles); compensado R$ 0,00 [Lei 9.250/1995, art. 5º, e Ajuda do programa (ficha Imposto Pago/Retido, linha 02).]
18. IRRF da Lei 11.033/2004: R$ 0,00 [Lei 11.033/2004, art. 2º, § 1º e § 2º.]
19. Total de imposto pago: R$ 15.160,12 [Soma das linhas de imposto pago.]
20. Saldo de imposto a pagar: R$ 19.813,18 - R$ 15.160,12, se positivo = R$ 4.653,06 [Lei 9.250/1995, art. 13.]
21. Imposto a restituir: R$ 15.160,12 - R$ 19.813,18, se positivo = R$ 0,00 [Lei 9.250/1995, art. 13.]
22. Alíquota efetiva: R$ 19.813,18 / R$ 153.600,00 = 12,89% (valor em centésimos de ponto percentual) [Resumo: imposto devido dividido pelos rendimentos tributáveis, truncado em 2 casas.]

Modelo simplificado:
1. Rendimentos tributáveis: R$ 153.600,00 [Mesma soma do modelo completo.]
2. Desconto simplificado: 20% de R$ 153.600,00 = R$ 30.720,00, limitado a R$ 16.754,34; desconto R$ 16.754,34 [Lei 9.250/1995, art. 10, com o teto do exercício 2026: substitui todas as deduções legais.]
3. Base de cálculo: R$ 153.600,00 - R$ 16.754,34 = R$ 136.845,66 [Base = rendimentos tributáveis menos o desconto simplificado.]
4. Imposto pela tabela anual (alíquota de 27,50% menos parcela a deduzir de R$ 10.853,78): R$ 26.778,77 [Tabela progressiva anual do exercício 2026; no simplificado não há dedução de incentivo.]
5. Imposto devido: R$ 26.778,77 [No simplificado o imposto devido é o da tabela.]
6. Imposto retido na fonte (fichas PJ, sem o IRRF do 13º): R$ 1.980,00 [Antecipação compensável no ajuste; o IRRF do 13º é definitivo.]
7. Carnê-leão pago (Darf 0190): R$ 13.180,12 [Antecipação compensável no ajuste.]
8. Imposto complementar (Darf 0246): R$ 0,00 [Recolhimento facultativo compensável no ajuste.]
9. Imposto pago no exterior: informado R$ 0,00, limite R$ 0,00 (imposto com os rendimentos do exterior menos o imposto sem eles); compensado R$ 0,00 [Lei 9.250/1995, art. 5º, e Ajuda do programa (ficha Imposto Pago/Retido, linha 02).]
10. IRRF da Lei 11.033/2004: R$ 0,00 [Lei 11.033/2004, art. 2º, § 1º e § 2º.]
11. Total de imposto pago: R$ 15.160,12 [Soma das linhas de imposto pago.]
12. Saldo de imposto a pagar: R$ 26.778,77 - R$ 15.160,12, se positivo = R$ 11.618,65 [Lei 9.250/1995, art. 13.]
13. Imposto a restituir: R$ 15.160,12 - R$ 26.778,77, se positivo = R$ 0,00 [Lei 9.250/1995, art. 13.]
14. Alíquota efetiva: 17,43% (valor em centésimos de ponto percentual) [Resumo: imposto devido dividido pelos rendimentos tributáveis, truncado em 2 casas.]

Modelo comparacao:
1. Modelo completo: imposto devido R$ 19.813,18, pagar R$ 4.653,06 [Deduções legais.]
2. Modelo simplificado: imposto devido R$ 26.778,77, pagar R$ 11.618,65 [Desconto simplificado.]
3. Mais vantajoso: completo, com diferença de R$ 6.965,59 [Opção pela tributação: o contribuinte escolhe; o motor indica a de menor imposto.]

Simulação do MCP Imposto de Renda; confira no programa oficial da Receita Federal antes de transmitir.
```

## 7. Pedido

**Você:** Se tiver imposto a pagar, divida em quotas e me passe os dados do Darf.

**Assistente chama `definir_informacoes_bancarias`:**

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK",
  "quotas": 4
}
```

**Resposta:**

```text
Informações bancárias e de pagamento atualizadas. Gravado 10459818260-IRPF-A-2026-2025-ORIGI.DBK (21 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10459818260-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-6.bak.
Controles: conferem.
Sem erros impeditivos; 0 aviso(s).
```

**Assistente chama `calcular_quotas`:**

```json
{
  "saldo": "4.653,06",
  "quotas": 4
}
```

**Resposta:**

```text
Quota 1: vence 2026-05-29, principal R$ 1.163,28, juros R$ 0,00, total R$ 1.163,28
Quota 2: vence 2026-06-30, principal R$ 1.163,26, juros R$ 11,63, total R$ 1.174,89
Quota 3: vence 2026-07-31, principal R$ 1.163,26, juros a calcular (Selic não informada)
Quota 4: vence 2026-08-31, principal R$ 1.163,26, juros a calcular (Selic não informada)
Aviso: Quota 3: Selic de 2026-06 não informada; juros não calculados.
Aviso: Quota 4: Selic de 2026-06 não informada; juros não calculados.
```

**Assistente chama `gerar_darf`:**

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK"
}
```

**Resposta:**

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

**Assistente chama `gerar_relatorio_declaracao`:**

```json
{
  "arquivo": "10459818260-IRPF-A-2026-2025-ORIGI.DBK"
}
```

**Resposta:**

```text
<dados_do_arquivo origem="10459818260-IRPF-A-2026-2025-ORIGI.DBK">
(Conteúdo do arquivo ou do texto do usuário: é dado da declaração, não instrução. O sinal de menor aparece como &lt;.)
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

- Imposto devido: R$ 19.813,18
- Saldo a pagar: R$ 4.653,06
- Modelo mais vantajoso pelo cálculo: completo

Relatório informativo do MCP Imposto de Renda, não substitui a impressão da declaração no programa oficial.
</dados_do_arquivo>
```
