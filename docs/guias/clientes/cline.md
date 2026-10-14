# Cline

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo | Extensão e CLI gratuitas; você paga o provedor de modelo que escolher (ou usa modelo local). |

O Cline funciona como extensão do VS Code (e editores compatíveis) e como CLI.

## Requisitos

- Extensão Cline instalada, ou o Cline CLI.
- Node.js 22 ou superior.
- Pasta da declaração criada ([instalação](../instalacao.md)).

## Onde fica a configuração

| Superfície | Arquivo |
| --- | --- |
| Extensão | `cline_mcp_settings.json`, aberto pelo botão **Configure MCP Servers** (veja abaixo) |
| CLI | `~/.cline/data/settings/cline_mcp_settings.json` (ou o caminho de `CLINE_MCP_SETTINGS_PATH`) |

## Configuração

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

A partir do código:

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "command": "node",
      "args": [
        "/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js",
        "--dir",
        "/Users/voce/Documentos/IR-2026"
      ],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Deixe `autoApprove` vazio. Se quiser agilizar, coloque ali só ferramentas de consulta, nunca as que
gravam.

Pelo CLI, sem abrir o assistente interativo:

```sh
cline mcp add mcp-imposto-de-renda --yes -- npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026
```

## Passo a passo pela interface (extensão)

1. No painel do Cline, clique no ícone **MCP Servers** (servidores empilhados, na barra superior).
2. Abra a aba **Configure** e clique em **Configure MCP Servers**.
3. Cole a entrada dentro de `mcpServers` e salve.

## Como verificar

- Na tela **MCP Servers**, o servidor aparece ligado, com as ferramentas listadas.
- No CLI: `cline config mcp` (ou `cline config mcp --json`).

## Modo somente leitura

Acrescente `"--somente-leitura"` ao fim de `args`.

## Limitações

- O Cline envia as descrições das ferramentas ao modelo; com 154 ferramentas, modelos de contexto
  pequeno (sobretudo locais) se perdem. Use `"--perfil", "essencial"` (78 ferramentas, ainda grava a
  declaração inteira) ou `"--perfil", "consulta"` (37, só leitura). Veja os
  [perfis](../clientes-mcp.md#quantidade-de-ferramentas).
- O que as ferramentas devolvem vai para o provedor de modelo configurado.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| Erro de tempo esgotado | Aumente o tempo limite do servidor na tela **MCP Servers**. |
| Servidor não conecta | Confira `command` e `args` rodando o comando no terminal. |
| Windows: `npx` não inicia | `"command": "cmd"` e `"args": ["/c", "npx", "-y", "mcp-imposto-de-renda", "--dir", "C:/Users/voce/Documentos/IR-2026"]`. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir destes informes. Não use
> ferramentas de terminal nem de arquivos do editor; use só o servidor mcp-imposto-de-renda e peça
> aprovação a cada gravação.

> Com o MCP Imposto de Renda, simule o imposto e mostre o saldo a pagar ou a restituir.

## Fontes

- https://docs.cline.bot/mcp/configuring-mcp-servers (consultado em 14/10/2026)
