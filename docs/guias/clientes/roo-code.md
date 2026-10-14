# Roo Code

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo, mas o projeto foi **descontinuado** | Extensão gratuita; você paga o provedor de modelo. |

> [!WARNING]
> O repositório do Roo Code foi arquivado em 15/05/2026 e não recebe mais correções. A extensão
> instalada continua funcionando, mas prefira o [Cline](cline.md), do qual o Roo Code derivou e
> que usa configuração quase idêntica.

## Onde fica a configuração

| Escopo | Arquivo |
| --- | --- |
| Global | `mcp_settings.json`, aberto pelo botão **Edit Global MCP** |
| Projeto | `.roo/mcp.json` na raiz do projeto (tem prioridade sobre o global) |

## Configuração

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026"],
      "alwaysAllow": [],
      "disabled": false,
      "timeout": 120
    }
  }
}
```

A partir do código, troque `command` por `"node"` e o primeiro argumento pelo caminho de
`apps/cli/dist/index.js`, sem o `-y`. No Windows, o próprio Roo Code recomenda chamar o `npx` via
`"command": "cmd"` com `"args": ["/c", "npx", ...]`.

Campos úteis: `alwaysAllow` (deixe vazio), `disabledTools` (esconde ferramentas) e `timeout` em
segundos (1 a 3600; padrão 60).

## Passo a passo pela interface

1. Clique no ícone de MCP na barra superior do painel do Roo Code.
2. Marque **Enable MCP Servers**.
3. No fim da tela, clique em **Edit Global MCP**, cole a configuração e salve.

## Como verificar e modo somente leitura

O servidor aparece na tela de MCP com as ferramentas. Para consultar sem gravar, acrescente
`"--somente-leitura"` ao fim de `args`.

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir destes informes, pedindo
> aprovação antes de cada gravação.

## Fontes

- https://docs.roocode.com/features/mcp/using-mcp-in-roo (consultado em 14/10/2026)
- https://github.com/RooCodeInc/Roo-Code (repositório arquivado, consultado em 14/10/2026)
