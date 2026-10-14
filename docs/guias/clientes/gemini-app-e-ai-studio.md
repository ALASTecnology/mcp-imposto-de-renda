# App Gemini, Google AI Studio e Gemini Enterprise

| Produto | Transporte | Suporte | Plano |
| --- | --- | --- | --- |
| App Gemini (web e celular) | Não aceita servidor local | Não suportado | Qualquer |
| Google AI Studio (interface web) | Não aceita servidor local | Não suportado | Qualquer |
| Gemini Enterprise | Só Streamable HTTP em URL HTTPS com certificado de CA pública | Não suportado neste projeto | Edições pagas do Gemini Enterprise |

Os três rodam nos servidores do Google. Nenhum deles consegue iniciar um processo na sua máquina,
então o MCP Imposto de Renda (que só fala stdio) não pode ser ligado a eles sem publicar o servidor
na internet. Este projeto não recomenda nem documenta esse caminho
([ADR 0001](../../adr/0001-mcp-local-sem-servidor.md)).

## O que diz a documentação oficial

- **Gemini Enterprise**: o conector de servidor MCP personalizado aceita apenas o transporte
  Streamable HTTP (SSE não é aceito) e exige certificado TLS assinado por autoridade pública, mesmo
  para servidores privados. Um servidor stdio na sua máquina não atende a nenhum dos requisitos.
- **App Gemini e Google AI Studio**: na data da consulta não encontramos documentação oficial do
  Google que permita adicionar um servidor MCP local na interface. Relatos de terceiros citam
  "apps personalizados" por URL remota no app Gemini, o que, de novo, exigiria expor o servidor.

## Alternativas que funcionam

Para usar modelos Gemini com o MCP Imposto de Renda mantendo tudo local:

- [Gemini CLI ou Antigravity CLI](gemini-cli.md), que iniciam o servidor por stdio;
- editores que permitem escolher modelos Gemini e falam stdio, como [VS Code com Copilot](vscode-copilot.md),
  [Cursor](cursor.md), [Cline](cline.md), [Continue](continue.md) ou [Goose](goose.md).

## Fontes

- https://docs.cloud.google.com/gemini/enterprise/docs/connectors/custom-mcp-server/set-up-custom-mcp-server (consultado em 14/10/2026)
- https://ai.google.dev/gemini-api/docs/function-calling (consultado em 14/10/2026; sem menção a servidor MCP local na interface do AI Studio)
