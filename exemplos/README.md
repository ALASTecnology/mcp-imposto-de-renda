# Declarações de exemplo

Quatro declarações completas do exercício 2026 (ano-calendário 2025), feitas do começo ao fim
com o próprio servidor. Cada pasta traz o roteiro de pedidos, a conversa com as respostas reais das
ferramentas, a saída do cálculo e o `.DBK` gravado, pronto para restaurar no programa oficial.

> [!IMPORTANT]
> **Todos os dados são fictícios.** Os nomes trazem "Fictício" ou "Fictícia" de propósito, os
> endereços não existem e os CPFs, CNPJs e NITs saem de um gerador determinístico
> ([`documentos.ts`](documentos.ts)) que só garante dígitos verificadores válidos. Os valores foram
> escolhidos para ilustrar regras do cálculo, não para representar casos reais.

| Exemplo | Perfil | Ferramentas em destaque | Resultado |
| --- | --- | --- | --- |
| [01-assalariado-simples](01-assalariado-simples/README.md) | Empregada com um único empregador, poupança e CDB | `criar_declaracao`, `adicionar_rendimento_pj`, `definir_opcao_tributacao`, `explicar_calculo` | Simplificado, restituir R$ 461,23 |
| [02-familia-dependentes](02-familia-dependentes/README.md) | Servidor público com companheira e dois filhos, saúde, escola, faculdade e financiamento | `buscar_codigo`, `listar_tabela`, `adicionar_dependente`, `adicionar_pagamento`, `adicionar_divida` | Completo, restituir R$ 9.572,98 |
| [03-aposentado-65-anos](03-aposentado-65-anos/README.md) | Aposentado com 71 anos e duas fontes que informaram a parcela isenta inteira | `transferir_excedente_isencao_65`, `gerar_darf` | Simplificado, pagar R$ 5.693,16 em 3 quotas |
| [04-autonomo-carne-leao](04-autonomo-carne-leao/README.md) | Psicóloga autônoma com carnê-leão, livro-caixa, PGBL e uma clínica que retém imposto | `calcular_carne_leao`, `definir_rendimentos_pf_exterior`, `calcular_quotas` | Completo, pagar R$ 4.653,06 em 4 quotas |

## O que há em cada pasta

| Arquivo | Conteúdo | Origem |
| --- | --- | --- |
| `README.md` | Quem é a pessoa, o que o exemplo mostra e como conferir | escrito à mão |
| `roteiro.ts` | Pedidos em linguagem natural e as chamadas de ferramenta que atendem cada um | escrito à mão |
| `conversa.md` | A conversa inteira: cada pedido, os argumentos enviados e a resposta do servidor | gerado |
| `calculo.md` | Só as respostas de cálculo: comparação de modelos, memória de cálculo, quotas e relatório | gerado |
| `<CPF>-IRPF-A-2026-2025-ORIGI.DBK` | Cópia de segurança da declaração, no formato do programa oficial | gerado |

## Como usar

**Restaurar no programa oficial.** Copie o `.DBK` para uma pasta qualquer e, no programa do IRPF
2026, use **Ferramentas > Cópia de Segurança > Restaurar**. A declaração aparece com todas as fichas
preenchidas, e o programa refaz o cálculo por conta própria.

**Reproduzir com o seu cliente MCP.** Aponte `--dir` para uma pasta vazia e repita os pedidos do
`roteiro.ts` na conversa. O assistente pode escolher outras ferramentas ou outra ordem; o resultado
deve ser o mesmo.

**Regenerar.** Os arquivos gerados são conferidos pela suíte de testes
([`exemplos.test.ts`](exemplos.test.ts)): `pnpm test` refaz cada roteiro numa pasta temporária,
com relógio fixo, e falha se algum byte mudar. Depois de alterar um roteiro ou o servidor, rode:

```sh
pnpm exemplos   # regrava conversa.md, calculo.md e o .DBK de cada exemplo
git diff exemplos/
```

Um diff inesperado num `.DBK` ou num `calculo.md` costuma indicar mudança de comportamento do
codec ou do motor de cálculo, e merece investigação antes do commit.

## Como funciona o gerador

[`executar.ts`](executar.ts) cria o servidor com `createServer`, liga um cliente MCP pelo transporte
em memória do SDK e chama as ferramentas do roteiro na ordem, exatamente como faria um cliente MCP
real. A pasta autorizada é temporária e é apagada ao final; o relógio do servidor é fixado em
10/04/2026 às 12h (UTC), o que torna as cópias de segurança e as datas dos arquivos previsíveis.
Qualquer resposta com `isError` interrompe a geração.
