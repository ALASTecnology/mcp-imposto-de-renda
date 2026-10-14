# Exemplo 3: aposentado com mais de 65 anos

**José Fictício Exemplo**, 71 anos, aposentado em Belo Horizonte. Recebe do INSS e de um fundo de
pensão, tem poupança e uma casa quitada, e paga plano de saúde e fisioterapia.

O ponto do exemplo é um erro comum: **as duas fontes informaram a parcela isenta de 65 anos
inteira** (R$ 1.903,98 por mês mais o 13º), mas o limite vale por pessoa, somando todas as fontes.
O programa oficial pergunta se o excedente deve voltar a ser tributável; aqui quem faz isso é
`transferir_excedente_isencao_65`.

| Item | INSS | Fundo de pensão |
| --- | --- | --- |
| Rendimentos tributáveis no informe | R$ 39.552,24 | R$ 25.152,24 |
| Parcela isenta informada (código 10) | R$ 22.847,76 + 13º R$ 1.903,98 | R$ 22.847,76 + 13º R$ 1.903,98 |
| Imposto retido na fonte | R$ 1.032,48 | R$ 1.890,00 |

## O que o exemplo mostra

1. `transferir_excedente_isencao_65` primeiro com `simular: true`, que só mostra a conta (limite de
   R$ 24.751,74 contra R$ 49.503,48 informados), e depois de verdade, movendo o excedente para os
   rendimentos tributáveis da segunda fonte.
2. `listar_rendimentos_pj` confirma a correção: o fundo de pensão passa a R$ 48.000,00 tributáveis.
3. `definir_opcao_tributacao` escolhe o simplificado, que aqui é o mais vantajoso.
4. `definir_informacoes_bancarias` divide o saldo em 3 quotas e `gerar_darf` devolve código de
   receita, vencimentos e juros de cada quota.

## Resultado

| Modelo | Imposto devido | Saldo |
| --- | --- | --- |
| Completo (deduções legais) | R$ 9.142,08 | pagar R$ 6.219,60 |
| **Simplificado (desconto de 20%)** | **R$ 8.615,64** | **pagar R$ 5.693,16** |

Rendimentos tributáveis de R$ 87.552,24 depois da transferência. As despesas médicas
(R$ 14.840,00) ficam abaixo do teto do desconto simplificado (R$ 16.754,34). O saldo a pagar
existe porque cada fonte reteve imposto como se fosse a única isenção do aposentado.

## Arquivos

- [`roteiro.ts`](roteiro.ts): pedidos e chamadas.
- [`conversa.md`](conversa.md): a conversa completa, com as respostas reais do servidor.
- [`calculo.md`](calculo.md): comparação de modelos, memória de cálculo, Darf e relatório.
- [`10347170226-IRPF-A-2026-2025-ORIGI.DBK`](10347170226-IRPF-A-2026-2025-ORIGI.DBK): a declaração,
  pronta para restaurar no programa oficial.

Todos os dados são fictícios. Veja o [índice dos exemplos](../README.md).
