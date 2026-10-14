# Conversa: assalariado simples

> Arquivo gerado por `pnpm exemplos` a partir de `roteiro.ts`, com as respostas reais do
> servidor. Não edite à mão. Todos os nomes, CPFs, CNPJs e valores são fictícios.

## 1. Pedido

**Você:** Quero começar minha declaração de 2026 do zero. Sou Ana Fictícia Exemplo, CPF 10121874206, nascida em 14/07/1990, analista de sistemas numa empresa privada, moro em São Paulo (Rua das Palmeiras Fictícias, 100, Centro, CEP 01001-000).

**Assistente chama `criar_declaracao`:**

```json
{
  "identificacao": {
    "cpf": "10121874206",
    "nome": "ANA FICTICIA EXEMPLO",
    "dataNascimento": "1990-07-14",
    "tipoDeclaracao": {
      "tipo": "ajusteAnual"
    },
    "racaCor": "4",
    "conjuge": {
      "possui": false
    },
    "endereco": {
      "local": "brasil",
      "tipoLogradouro": "RUA",
      "logradouro": "DAS PALMEIRAS FICTICIAS",
      "numero": "100",
      "bairro": "CENTRO",
      "uf": "SP",
      "municipio": "7107",
      "cep": "01001000"
    },
    "ocupacao": {
      "natureza": "01",
      "ocupacaoPrincipal": "212"
    }
  }
}
```

**Resposta:**

```text
Declaração criada para o CPF 10121874206. Gravado 10121874206-IRPF-A-2026-2025-ORIGI.DBK (5 registros).
Arquivo novo (sem backup).
Controles: conferem.
Sem erros impeditivos; 1 aviso(s).
```

## 2. Pedido

**Você:** Este é o meu informe de rendimentos da empresa: rendimentos tributáveis R$ 96.000,00, previdência oficial R$ 9.840,00, imposto retido R$ 11.400,00, 13º salário R$ 8.000,00 com IRRF de R$ 652,30.

**Assistente chama `adicionar_rendimento_pj`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK",
  "item": {
    "beneficiario": {
      "tipo": "titular"
    },
    "fonte": {
      "ni": "22658482000104",
      "nome": "EMPRESA FICTICIA DE SOFTWARE LTDA"
    },
    "rendimentos": "96.000,00",
    "contribuicaoPrevidenciaria": "9.840,00",
    "impostoRetido": "11.400,00",
    "decimoTerceiro": "8.000,00",
    "impostoRetidoDecimoTerceiro": "652,30"
  }
}
```

**Resposta:**

```text
Rendimentos Tributáveis Recebidos de Pessoa Jurídica: item 1 incluído. Gravado 10121874206-IRPF-A-2026-2025-ORIGI.DBK (6 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10121874206-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z.bak.
Controles: conferem.
Sem erros impeditivos; 0 aviso(s).
```

## 3. Pedido

**Você:** No informe do banco aparecem R$ 318,77 de rendimento da poupança e R$ 1.146,20 de rendimento de um CDB. Tenho conta corrente com R$ 2.180,00 em 31/12/2024 e R$ 3.405,50 em 31/12/2025, e a poupança passou de R$ 5.000,00 para R$ 8.318,77.

**Assistente chama `adicionar_rendimento_isento`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK",
  "item": {
    "codigo": "12",
    "beneficiario": {
      "tipo": "titular"
    },
    "fonte": {
      "ni": "38144345000191",
      "nome": "BANCO FICTICIO S.A."
    },
    "valor": "318,77"
  }
}
```

**Resposta:**

```text
Rendimentos Isentos e Não Tributáveis: item 1 incluído. Gravado 10121874206-IRPF-A-2026-2025-ORIGI.DBK (8 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10121874206-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-1.bak.
Controles: conferem.
Sem erros impeditivos; 2 aviso(s).
```

**Assistente chama `adicionar_rendimento_exclusivo`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK",
  "item": {
    "codigo": "06",
    "beneficiario": {
      "tipo": "titular"
    },
    "fonte": {
      "ni": "38144345000191",
      "nome": "BANCO FICTICIO S.A."
    },
    "valor": "1.146,20"
  }
}
```

**Resposta:**

```text
Rendimentos Sujeitos à Tributação Exclusiva/Definitiva: item 1 incluído. Gravado 10121874206-IRPF-A-2026-2025-ORIGI.DBK (10 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10121874206-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-2.bak.
Controles: conferem.
Sem erros impeditivos; 3 aviso(s).
```

**Assistente chama `adicionar_bem`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK",
  "item": {
    "grupo": "06",
    "codigo": "01",
    "discriminacao": "CONTA CORRENTE NO BANCO FICTICIO S.A.",
    "situacaoAnterior": "2.180,00",
    "situacaoAtual": "3.405,50",
    "ni": "38144345000191",
    "conta": {
      "banco": "001",
      "agencia": "1234",
      "conta": "56789",
      "dv": "2"
    }
  }
}
```

**Resposta:**

```text
Bens e Direitos: item 1 incluído. Gravado 10121874206-IRPF-A-2026-2025-ORIGI.DBK (11 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10121874206-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-3.bak.
Controles: conferem.
Sem erros impeditivos; 3 aviso(s).
```

**Assistente chama `adicionar_bem`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK",
  "item": {
    "grupo": "04",
    "codigo": "01",
    "discriminacao": "CADERNETA DE POUPANCA NO BANCO FICTICIO S.A.",
    "situacaoAnterior": "5.000,00",
    "situacaoAtual": "8.318,77",
    "ni": "38144345000191",
    "conta": {
      "banco": "001",
      "agencia": "1234",
      "conta": "98765",
      "dv": "4"
    }
  }
}
```

**Resposta:**

```text
Bens e Direitos: item 2 incluído. Gravado 10121874206-IRPF-A-2026-2025-ORIGI.DBK (12 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10121874206-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-4.bak.
Controles: conferem.
Sem erros impeditivos; 1 aviso(s).
```

## 4. Pedido

**Você:** Tem alguma pendência na declaração?

**Assistente chama `validar_declaracao`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK"
}
```

**Resposta:**

```text
Sem erros impeditivos; 1 aviso(s).
- [aviso] Resumo da Declaração (resumo.conta): Informe uma conta ou a chave Pix (CPF) para receber a restituição. (RES-RESTITUICAO)
```

## 5. Pedido

**Você:** Qual modelo é melhor para mim? Me mostre a conta.

**Assistente chama `definir_opcao_tributacao`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK",
  "opcao": "simplificada"
}
```

**Resposta:**

```text
Opção: desconto simplificado; mais vantajoso pelo cálculo do MCP Imposto de Renda: simplificado. Gravado 10121874206-IRPF-A-2026-2025-ORIGI.DBK (12 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10121874206-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-5.bak.
Controles: conferem.
Sem erros impeditivos; 1 aviso(s).
```

**Assistente chama `explicar_calculo`:**

```json
{
  "titular": {
    "cpf": "10121874206",
    "nome": "ANA FICTICIA EXEMPLO",
    "nascimento": "1990-07-14"
  },
  "rendimentosPJ": [
    {
      "cnpj": "22658482000104",
      "nome": "EMPRESA FICTICIA DE SOFTWARE LTDA",
      "rendimento": "96.000,00",
      "previdenciaOficial": "9.840,00",
      "irrf": "11.400,00",
      "decimoTerceiro": "8.000,00",
      "irrfDecimoTerceiro": "652,30"
    }
  ],
  "rendimentosIsentos": [
    {
      "codigo": "12",
      "valor": "318,77"
    }
  ],
  "tributacaoExclusiva": [
    {
      "codigo": "06",
      "valor": "1.146,20"
    }
  ]
}
```

**Resposta:**

```text
Modelo completo:
1. Rendimentos tributáveis: PJ R$ 96.000,00 + PF R$ 0,00 + exterior R$ 0,00 = R$ 96.000,00 [Resumo, Rendimentos Tributáveis: soma das fichas de PJ (titular e dependentes) e de PF/Exterior. O 13º salário fica fora (tributação exclusiva).]
2. Previdência oficial: fichas PJ R$ 9.840,00 + PF R$ 0,00 = R$ 9.840,00 [Lei 9.250/1995, art. 8º, II, d; sem limite.]
3. Previdência complementar e Fapi (códigos 36 e 37): informado R$ 0,00, limite de 12% de R$ 96.000,00 = R$ 11.520,00; dedução R$ 0,00 [Lei 9.250/1995, art. 8º, II, e, e Lei 9.532/1997, art. 11: limitada a 12% do total dos rendimentos tributáveis.]
4. Dependentes: 0 x R$ 2.275,08 = R$ 0,00 [Lei 9.250/1995, art. 8º, II, c: R$ 2.275,08 por dependente no ano.]
5. Instrução (códigos 01 e 02), limite de R$ 3.561,50 por pessoa: R$ 0,00 [Lei 9.250/1995, art. 8º, II, b: limite individual por titular, dependente ou alimentando; o excesso de um não aproveita a outro.]
6. Despesas médicas (códigos 09 a 22 e 26), valor pago menos parcela não dedutível/reembolso: R$ 0,00 [Lei 9.250/1995, art. 8º, II, a: sem limite.]
7. Pensão alimentícia judicial ou por escritura pública (códigos 30, 31, 33 e 34): R$ 0,00 [Lei 9.250/1995, art. 8º, II, f: sem limite. A coluna Pensão da ficha PF é só informativa.]
8. Livro-caixa (ficha PF/Exterior): R$ 0,00 [Lei 8.134/1990, art. 6º: despesas escrituradas; o limite mensal à receita é validado no preenchimento e não é refeito aqui.]
9. Total de deduções: R$ 9.840,00 [Resumo, Deduções: soma das linhas acima.]
10. Base de cálculo: R$ 96.000,00 - R$ 9.840,00 = R$ 86.160,00 [Base = rendimentos tributáveis menos deduções, nunca negativa.]
11. Imposto pela tabela anual (alíquota de 27,50% menos parcela a deduzir de R$ 10.853,78): R$ 12.840,22 [Tabela progressiva anual do exercício 2026 (https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2025). A fração de centavo de base x alíquota é descartada (truncamento), como no programa oficial.]
12. Dedução de incentivo: nenhuma doação informada [Sem doações.]
13. Imposto devido: R$ 12.840,22 - incentivos R$ 0,00 = R$ 12.840,22 [Resumo, Cálculo do Imposto: imposto devido menos dedução de incentivo.]
14. Imposto retido na fonte (fichas PJ, sem o IRRF do 13º): R$ 11.400,00 [Antecipação compensável no ajuste; o IRRF do 13º é definitivo.]
15. Carnê-leão pago (Darf 0190): R$ 0,00 [Antecipação compensável no ajuste.]
16. Imposto complementar (Darf 0246): R$ 0,00 [Recolhimento facultativo compensável no ajuste.]
17. Imposto pago no exterior: informado R$ 0,00, limite R$ 0,00 (imposto com os rendimentos do exterior menos o imposto sem eles); compensado R$ 0,00 [Lei 9.250/1995, art. 5º, e Ajuda do programa (ficha Imposto Pago/Retido, linha 02).]
18. IRRF da Lei 11.033/2004: R$ 0,00 [Lei 11.033/2004, art. 2º, § 1º e § 2º.]
19. Total de imposto pago: R$ 11.400,00 [Soma das linhas de imposto pago.]
20. Saldo de imposto a pagar: R$ 12.840,22 - R$ 11.400,00, se positivo = R$ 1.440,22 [Lei 9.250/1995, art. 13.]
21. Imposto a restituir: R$ 11.400,00 - R$ 12.840,22, se positivo = R$ 0,00 [Lei 9.250/1995, art. 13.]
22. Alíquota efetiva: R$ 12.840,22 / R$ 96.000,00 = 13,37% (valor em centésimos de ponto percentual) [Resumo: imposto devido dividido pelos rendimentos tributáveis, truncado em 2 casas.]

Modelo simplificado:
1. Rendimentos tributáveis: R$ 96.000,00 [Mesma soma do modelo completo.]
2. Desconto simplificado: 20% de R$ 96.000,00 = R$ 19.200,00, limitado a R$ 16.754,34; desconto R$ 16.754,34 [Lei 9.250/1995, art. 10, com o teto do exercício 2026: substitui todas as deduções legais.]
3. Base de cálculo: R$ 96.000,00 - R$ 16.754,34 = R$ 79.245,66 [Base = rendimentos tributáveis menos o desconto simplificado.]
4. Imposto pela tabela anual (alíquota de 27,50% menos parcela a deduzir de R$ 10.853,78): R$ 10.938,77 [Tabela progressiva anual do exercício 2026; no simplificado não há dedução de incentivo.]
5. Imposto devido: R$ 10.938,77 [No simplificado o imposto devido é o da tabela.]
6. Imposto retido na fonte (fichas PJ, sem o IRRF do 13º): R$ 11.400,00 [Antecipação compensável no ajuste; o IRRF do 13º é definitivo.]
7. Carnê-leão pago (Darf 0190): R$ 0,00 [Antecipação compensável no ajuste.]
8. Imposto complementar (Darf 0246): R$ 0,00 [Recolhimento facultativo compensável no ajuste.]
9. Imposto pago no exterior: informado R$ 0,00, limite R$ 0,00 (imposto com os rendimentos do exterior menos o imposto sem eles); compensado R$ 0,00 [Lei 9.250/1995, art. 5º, e Ajuda do programa (ficha Imposto Pago/Retido, linha 02).]
10. IRRF da Lei 11.033/2004: R$ 0,00 [Lei 11.033/2004, art. 2º, § 1º e § 2º.]
11. Total de imposto pago: R$ 11.400,00 [Soma das linhas de imposto pago.]
12. Saldo de imposto a pagar: R$ 10.938,77 - R$ 11.400,00, se positivo = R$ 0,00 [Lei 9.250/1995, art. 13.]
13. Imposto a restituir: R$ 11.400,00 - R$ 10.938,77, se positivo = R$ 461,23 [Lei 9.250/1995, art. 13.]
14. Alíquota efetiva: 11,39% (valor em centésimos de ponto percentual) [Resumo: imposto devido dividido pelos rendimentos tributáveis, truncado em 2 casas.]

Modelo comparacao:
1. Modelo completo: imposto devido R$ 12.840,22, pagar R$ 1.440,22 [Deduções legais.]
2. Modelo simplificado: imposto devido R$ 10.938,77, restituir R$ 461,23 [Desconto simplificado.]
3. Mais vantajoso: simplificado, com diferença de R$ 1.901,45 [Opção pela tributação: o contribuinte escolhe; o motor indica a de menor imposto.]

Simulação do MCP Imposto de Renda; confira no programa oficial da Receita Federal antes de transmitir.
```

## 6. Pedido

**Você:** Quero receber a restituição por Pix na chave do meu CPF.

**Assistente chama `definir_informacoes_bancarias`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK",
  "pix": true
}
```

**Resposta:**

```text
Informações bancárias e de pagamento atualizadas. Gravado 10121874206-IRPF-A-2026-2025-ORIGI.DBK (12 registros).
Cópia do conteúdo anterior: .mcp-imposto-de-renda-backups/10121874206-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z-6.bak.
Controles: conferem.
Sem erros impeditivos; 0 aviso(s).
```

## 7. Pedido

**Você:** Confira o arquivo e me diga como entregar.

**Assistente chama `verificar_integridade_arquivo`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK"
}
```

**Resposta:**

```text
10121874206-IRPF-A-2026-2025-ORIGI.DBK: controles conferem (12 registros, CRC de cada linha, T9 e hash do header).
```

**Assistente chama `gerar_relatorio_declaracao`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK"
}
```

**Resposta:**

```text
# Declaração IRPF 2026 (ano-calendário 2025)

Contribuinte: ANA FICTICIA EXEMPLO, CPF 10121874206. Tipo: ajusteAnual.
Opção de tributação: desconto simplificado.

## Fichas

- Identificação do Contribuinte: preenchida
- Rendimentos Tributáveis Recebidos de Pessoa Jurídica: 1 item(ns)
- Rendimentos Isentos e Não Tributáveis: 1 item(ns)
- Rendimentos Sujeitos à Tributação Exclusiva/Definitiva: 1 item(ns)
- Imposto Pago/Retido: preenchida
- Doações Diretamente na Declaração: preenchida
- Bens e Direitos: 2 item(ns)

## Totais

- Rendimentos tributáveis de PJ: R$ 96.000,00
- Imposto retido na fonte (PJ): R$ 11.400,00
- Pagamentos efetuados: R$ 0,00
- Bens em 31/12/2025: R$ 11.724,27
- Dívidas em 31/12/2025: R$ 0,00

## Resultado (simulação do MCP Imposto de Renda)

- Imposto devido: R$ 10.938,77
- Imposto a restituir: R$ 461,23
- Modelo mais vantajoso pelo cálculo: simplificado

Relatório informativo do MCP Imposto de Renda, não substitui a impressão da declaração no programa oficial.
```

**Assistente chama `instruir_transmissao`:**

```json
{
  "arquivo": "10121874206-IRPF-A-2026-2025-ORIGI.DBK"
}
```

**Resposta:**

```text
Passo a passo:
1. Instale ou atualize o programa oficial IRPF 2026 pelo site da Receita Federal (gov.br/receitafederal).
2. Copie 10121874206-IRPF-A-2026-2025-ORIGI.DBK para o computador em que o programa está instalado.
3. No programa, use Ferramentas > Restaurar Cópia de Segurança e escolha o arquivo .DBK (a declaração aparece na lista de declarações em preenchimento).
4. Abra a declaração e clique em Verificar Pendências; corrija tudo o que estiver marcado como erro.
5. Confira as fichas preenchidas e o Resumo (opção de tributação, imposto a pagar ou a restituir, quotas e conta bancária).
6. Clique em Entregar Declaração. Sem certificado digital, informe o número do recibo da declaração do ano anterior quando pedido; com certificado ou procuração, siga o assistente.
7. Depois da transmissão, salve e imprima o recibo de entrega (menu Imprimir > Recibo) e guarde o arquivo .DEC gerado.
8. Se houver imposto a pagar, emita o Darf no programa (menu Imprimir > Darf) ou no Sicalc.
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
