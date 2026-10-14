# Exemplo 1: assalariado simples

**Ana Fictícia Exemplo**, 35 anos, analista de sistemas numa empresa privada de São Paulo. Um único
empregador, conta corrente, poupança e um CDB. Nenhum dependente e nenhuma despesa dedutível além
da previdência oficial descontada em folha.

| Item | Valor |
| --- | --- |
| Rendimentos tributáveis (empregador) | R$ 96.000,00 |
| Previdência oficial | R$ 9.840,00 |
| Imposto retido na fonte | R$ 11.400,00 |
| 13º salário (tributação exclusiva) | R$ 8.000,00, IRRF R$ 652,30 |
| Rendimento da poupança (isento, código 12) | R$ 318,77 |
| Rendimento do CDB (exclusivo, código 06) | R$ 1.146,20 |
| Bens | conta corrente e poupança |

## O que o exemplo mostra

1. `criar_declaracao` grava um `.DBK` novo com o nome padrão do programa a partir da identificação.
2. Cada lançamento (`adicionar_rendimento_pj`, `adicionar_rendimento_isento`,
   `adicionar_rendimento_exclusivo`, `adicionar_bem`) valida a declaração e devolve as pendências.
3. `definir_opcao_tributacao` grava o modelo e compara os dois; `explicar_calculo` mostra a conta
   linha a linha, com a lei aplicada em cada passo.
4. `definir_informacoes_bancarias` registra a restituição por Pix na chave CPF.
5. `verificar_integridade_arquivo`, `gerar_relatorio_declaracao` e `instruir_transmissao` fecham a
   conferência e explicam como entregar pelo programa oficial.

## Resultado

| Modelo | Imposto devido | Saldo |
| --- | --- | --- |
| Completo (deduções legais) | R$ 12.840,22 | pagar R$ 1.440,22 |
| **Simplificado (desconto de 20%)** | **R$ 10.938,77** | **restituir R$ 461,23** |

O desconto simplificado bate no teto de R$ 16.754,34 e supera a única dedução disponível, a
previdência oficial de R$ 9.840,00. A base fica em R$ 79.245,66 e o imposto retido cobre o devido
com sobra.

## Arquivos

- [`roteiro.ts`](roteiro.ts): pedidos e chamadas.
- [`conversa.md`](conversa.md): a conversa completa, com as respostas reais do servidor.
- [`calculo.md`](calculo.md): comparação de modelos, memória de cálculo e relatório.
- [`10121874206-IRPF-A-2026-2025-ORIGI.DBK`](10121874206-IRPF-A-2026-2025-ORIGI.DBK): a declaração,
  pronta para restaurar no programa oficial.

Todos os dados são fictícios. Veja o [índice dos exemplos](../README.md).
