# Exemplo 2: família com dependentes, saúde e educação

**Carlos Fictício Exemplo**, 43 anos, servidor público estadual em Curitiba. Declara a companheira
(código 11), a filha de 11 anos (código 21) e o filho universitário de 22 anos (código 22). Paga
plano de saúde da família, pediatra, dentista, escola e faculdade, e tem um apartamento financiado
e um carro.

| Item | Valor |
| --- | --- |
| Rendimentos tributáveis (Estado) | R$ 168.000,00 |
| Previdência oficial | R$ 23.520,00 |
| Imposto retido na fonte | R$ 26.874,18 |
| Plano de saúde (4 beneficiários) | R$ 24.000,00 |
| Pediatra e dentista | R$ 4.150,00 |
| Escola e faculdade | R$ 42.000,00 |
| Bens | apartamento, automóvel e conta corrente |
| Dívida | financiamento imobiliário, de R$ 236.400,00 para R$ 219.180,00 |

## O que o exemplo mostra

1. `buscar_codigo` e `listar_tabela` acham os códigos certos de dependente e de pagamento antes de
   lançar.
2. `adicionar_dependente` inclui as três pessoas; `adicionar_pagamento` liga cada despesa ao
   dependente certo com `realizadoCom`.
3. `adicionar_bem` com dados do imóvel (endereço, área, matrícula) e `adicionar_divida` com o saldo
   do financiamento e o valor pago no ano.
4. `explicar_calculo` mostra o limite de instrução de R$ 3.561,50 aplicado **por pessoa**: a escola
   de R$ 18.000,00 e a faculdade de R$ 24.000,00 viram R$ 3.561,50 cada, e o excesso de um não
   aproveita ao outro. Despesas médicas entram sem limite.

## Resultado

| Modelo | Imposto devido | Saldo |
| --- | --- | --- |
| **Completo (deduções legais)** | **R$ 17.301,20** | **restituir R$ 9.572,98** |
| Simplificado (desconto de 20%) | R$ 30.738,77 | pagar R$ 3.864,59 |

As deduções somam R$ 65.618,24 (previdência oficial, 3 dependentes, instrução e saúde), quase
quatro vezes o teto do desconto simplificado. A restituição sai por Pix na chave CPF.

## Arquivos

- [`roteiro.ts`](roteiro.ts): pedidos e chamadas.
- [`conversa.md`](conversa.md): a conversa completa, com as respostas reais do servidor.
- [`calculo.md`](calculo.md): comparação de modelos, memória de cálculo e relatório.
- [`10234522275-IRPF-A-2026-2025-ORIGI.DBK`](10234522275-IRPF-A-2026-2025-ORIGI.DBK): a declaração,
  pronta para restaurar no programa oficial.

Todos os dados são fictícios. Veja o [índice dos exemplos](../README.md).
