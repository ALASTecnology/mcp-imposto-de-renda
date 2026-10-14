# Continue

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo, só no modo agente | Extensão gratuita (VS Code e JetBrains) e CLI; você paga o provedor de modelo ou usa um local. |

## Onde fica a configuração

| Opção | Arquivo |
| --- | --- |
| Bloco por servidor no projeto | `.continue/mcpServers/mcp-imposto-de-renda.yaml` |
| Configuração global | `~/.continue/config.yaml`, seção `mcpServers` |
| JSON de outro cliente | Um `.json` no formato do Claude Desktop copiado para `.continue/mcpServers/` também é lido |

## Configuração

Arquivo `.continue/mcpServers/mcp-imposto-de-renda.yaml` (os campos `name`, `version` e `schema` são
obrigatórios em blocos avulsos):

```yaml
name: MCP Imposto de Renda
version: 0.0.1
schema: v1
mcpServers:
  - name: mcp-imposto-de-renda
    type: stdio
    command: npx
    args:
      - "-y"
      - "mcp-imposto-de-renda"
      - "--dir"
      - "/Users/voce/Documentos/IR-2026"
```

A partir do código:

```yaml
name: MCP Imposto de Renda
version: 0.0.1
schema: v1
mcpServers:
  - name: mcp-imposto-de-renda
    type: stdio
    command: node
    args:
      - "/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js"
      - "--dir"
      - "/Users/voce/Documentos/IR-2026"
```

No `~/.continue/config.yaml`, cole só a lista `mcpServers` (sem `name`, `version` e `schema` do bloco).

Atenção: um bloco dentro de `.continue/` do projeto pode acabar versionado. Se o projeto for
compartilhado, use a configuração global.

## Passo a passo e verificação

1. Crie o arquivo e salve; o Continue recarrega a configuração.
2. Mude o chat para o modo **Agent**. Ferramentas MCP só funcionam nesse modo.
3. Peça para listar a pasta autorizada e aprove a chamada de `listar_arquivos`.

## Modo somente leitura

Acrescente `- "--somente-leitura"` ao fim de `args`.

## Limitações

- Só o modo agente usa MCP.
- Com modelos locais de contexto pequeno, 154 descrições de ferramentas pesam; use `--somente-leitura`.
- O que as ferramentas devolvem vai para o provedor de modelo configurado (nada sai da máquina se o
  modelo for local).

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| Ferramentas não aparecem | Confira se está no modo **Agent** e se o YAML tem `name`, `version` e `schema`. |
| Erro de YAML | Use aspas nos argumentos que começam com `-`. |
| Windows: `npx` não inicia | `command: cmd` e `args: ["/c", "npx", "-y", "mcp-imposto-de-renda", "--dir", "C:/Users/voce/Documentos/IR-2026"]`. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir destes informes. Mostre o
> plano antes de gravar e peça confirmação em cada ferramenta que altera o DBK.

## Fontes

- https://docs.continue.dev/customize/deep-dives/mcp (consultado em 14/10/2026)
