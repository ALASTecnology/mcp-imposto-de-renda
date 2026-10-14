# Cursor

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo | Qualquer plano. Em planos de equipe, o administrador pode limitar servidores e ferramentas pela MCP Allowlist. |

## Requisitos

- Cursor atualizado.
- Node.js 22 ou superior.
- Pasta da declaração criada ([instalação](../instalacao.md)).

## Onde fica a configuração

| Escopo | Arquivo |
| --- | --- |
| Global | `~/.cursor/mcp.json` (Windows: `%USERPROFILE%\.cursor\mcp.json`) |
| Projeto | `.cursor/mcp.json` na raiz do projeto |

Prefira o global: o arquivo de projeto costuma ir para o repositório e levaria o caminho da sua pasta.

## Configuração

Pacote publicado no npm:

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

A partir do código:

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js",
        "--dir",
        "/Users/voce/Documentos/IR-2026"
      ]
    }
  }
}
```

## Passo a passo pela interface

1. Abra a página **Customize** (configurações do Cursor) e vá à área de MCP.
2. Escolha adicionar um servidor personalizado; o Cursor abre o `mcp.json` global.
3. Cole a configuração, salve e volte à lista: o servidor deve aparecer ligado, com as ferramentas.

## Como verificar

- Na lista de servidores, o `mcp-imposto-de-renda` aparece com o interruptor ligado e a contagem de
  ferramentas em **Available Tools**.
- Peça ao agente para listar os arquivos da pasta autorizada. O Cursor pede aprovação antes de cada
  ferramenta MCP; clique na seta ao lado do nome para ver os argumentos.

## Modo somente leitura

Acrescente `"--somente-leitura"` ao fim de `args`. Também é possível desligar o servidor no
interruptor sem apagar a configuração.

## Limitações

- Não ative a execução automática de ferramentas para este servidor; aprove cada gravação.
- O Cursor resolve variáveis como `${userHome}` nos campos `command` e `args`, o que ajuda a não
  escrever o seu nome de usuário: `"${userHome}/Documentos/IR-2026"`.
- O que as ferramentas devolvem vai para o provedor do modelo escolhido no Cursor.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| Servidor com erro | Abra o painel **Output** (Cmd+Shift+U ou Ctrl+Shift+U) e escolha **MCP Logs**. |
| `npx` não encontrado | Use o caminho absoluto do `node` ou do `npx` em `command`. |
| Windows: `npx` não inicia | `"command": "cmd"` e `"args": ["/c", "npx", "-y", "mcp-imposto-de-renda", "--dir", "C:/Users/voce/Documentos/IR-2026"]`. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir destes informes. Não altere
> arquivos do projeto aberto no editor; use só as ferramentas do servidor e peça aprovação antes de
> gravar.

> Com o MCP Imposto de Renda, compare os modelos completo e simplificado para o DBK da pasta.

## Fontes

- https://cursor.com/docs/context/mcp (consultado em 14/10/2026)
