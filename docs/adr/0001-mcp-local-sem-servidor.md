# ADR 0001: MCP local via stdio, sem servidor remoto

- Status: aceito
- Data: 2026-10-14

## Contexto

A declaração de IRPF reúne dados pessoais e financeiros sensíveis: CPF, rendimentos, patrimônio,
dependentes, despesas médicas. Queremos que um assistente de LLM ajude a preenchê-la, mas sem
criar mais um lugar onde esses dados fiquem armazenados ou trafeguem.

## Decisão

O MCP Imposto de Renda é um servidor MCP que roda exclusivamente na máquina do usuário, com transporte stdio.

- Não existe backend, conta, telemetria nem chamada de rede feita pelo MCP Imposto de Renda.
- O processo é iniciado pelo cliente MCP do usuário e termina junto com ele.
- O acesso a disco fica restrito à pasta autorizada passada em `--dir`.
- O transporte HTTP do MCP não será oferecido enquanto esta decisão valer.

## Consequências

- Não há custo de infraestrutura nem dado de terceiros sob nossa guarda.
- Os dados que as tools devolvem chegam ao provedor de LLM escolhido pelo usuário no cliente MCP.
  Isso está fora do nosso controle e precisa estar explícito no README.
- Atualizações dependem de o usuário instalar uma nova versão; não há correção centralizada.
- Testes de integração usam o transporte em memória do SDK e um teste de fumaça via stdio.
