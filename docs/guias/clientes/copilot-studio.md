# Microsoft Copilot Studio

| Transporte | Suporte | Plano |
| --- | --- | --- |
| Só Streamable HTTP, a partir da nuvem da Microsoft | Não suportado neste projeto | Licença do Copilot Studio (organizacional). |

O Copilot Studio cria agentes que rodam na nuvem da Microsoft. Ele aceita servidores MCP apenas pelo
transporte Streamable HTTP (SSE deixou de ser aceito em agosto de 2025), cadastrados por URL no
assistente de integração ou como conector personalizado. O agente precisa alcançar essa URL a partir
da nuvem.

## Por que não documentamos a conexão

O MCP Imposto de Renda roda só por stdio na sua máquina e lê a pasta da sua declaração. Para o
Copilot Studio alcançá-lo, seria preciso publicar uma ponte HTTP na internet ou numa rede corporativa,
expondo CPF, rendimentos e patrimônio a qualquer um que alcance o endereço. Isso contraria o modelo de
segurança do projeto ([ADR 0001](../../adr/0001-mcp-local-sem-servidor.md) e
[seguranca.md](../../seguranca.md)), e este guia não ensina esse caminho.

## Alternativas da Microsoft que funcionam

- [GitHub Copilot no VS Code](vscode-copilot.md), em modo agente, inicia o servidor por stdio na sua
  máquina.

## Fontes

- https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp (consultado em 14/10/2026)
- https://learn.microsoft.com/en-us/microsoft-copilot-studio/mcp-add-existing-server-to-agent (consultado em 14/10/2026)
