# Exemplo 4: autônoma com carnê-leão

**Patrícia Fictícia Exemplo**, 38 anos, psicóloga em Recife. Atende pacientes pessoas físicas,
recolhe carnê-leão todo mês e deduz as despesas do consultório pelo livro-caixa. Também atende por
uma clínica (pessoa jurídica) que retém imposto, contribui para um PGBL e paga plano de saúde.

| Item | Valor |
| --- | --- |
| Receita de pessoas físicas | R$ 9.800,00 por mês (R$ 117.600,00 no ano) |
| Livro-caixa | R$ 2.350,00 por mês (R$ 28.200,00 no ano) |
| Previdência oficial (contribuinte individual) | R$ 166,98 por mês |
| Carnê-leão pago | R$ 1.106,83 de janeiro a abril, R$ 1.094,10 de maio a dezembro |
| Clínica (pessoa jurídica) | R$ 36.000,00, IRRF R$ 1.980,00 |
| PGBL (código 36) | R$ 6.000,00 |
| Plano de saúde | R$ 5.880,00 |

## O que o exemplo mostra

1. `calcular_carne_leao` calcula o imposto do mês pela tabela mensal vigente: a de janeiro a abril
   (Lei 14.848/2024) e a de maio a dezembro (Lei 15.191/2025) dão valores diferentes para a mesma
   receita.
2. `definir_rendimentos_pf_exterior` lança o ano inteiro de uma vez, com `colunas` de 12 valores
   para receita, previdência, livro-caixa e carnê-leão pago, e o NIT de quem recolheu o INSS.
3. `explicar_calculo` mostra o livro-caixa e o PGBL (dentro do limite de 12%) reduzindo a base.
4. `calcular_quotas` e `gerar_darf` dividem o saldo em 4 quotas, com juros Selic a partir da 2ª.

## Resultado

| Modelo | Imposto devido | Saldo |
| --- | --- | --- |
| **Completo (deduções legais)** | **R$ 19.813,18** | **pagar R$ 4.653,06** |
| Simplificado (desconto de 20%) | R$ 26.778,77 | pagar R$ 11.618,65 |

As deduções somam R$ 42.083,76, com o livro-caixa respondendo por R$ 28.200,00. O carnê-leão pago
(R$ 13.180,12) e o IRRF da clínica (R$ 1.980,00) são antecipações; o saldo a pagar vem dos
rendimentos da clínica, retidos na fonte por uma alíquota menor que a do ajuste anual.

## Arquivos

- [`roteiro.ts`](roteiro.ts): pedidos e chamadas.
- [`conversa.md`](conversa.md): a conversa completa, com as respostas reais do servidor.
- [`calculo.md`](calculo.md): carnê-leão, comparação de modelos, memória de cálculo, quotas, Darf e
  relatório.
- [`10459818260-IRPF-A-2026-2025-ORIGI.DBK`](10459818260-IRPF-A-2026-2025-ORIGI.DBK): a declaração,
  pronta para restaurar no programa oficial.

Todos os dados são fictícios. Veja o [índice dos exemplos](../README.md).
