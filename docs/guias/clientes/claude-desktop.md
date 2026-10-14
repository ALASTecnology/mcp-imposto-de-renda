# Claude Desktop

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo | Qualquer conta Claude com o aplicativo de desktop. Em planos Team e Enterprise, o administrador pode restringir servidores locais. |

O aplicativo Claude Desktop (macOS, Windows e Linux) inicia servidores MCP locais definidos no
arquivo `claude_desktop_config.json`. O claude.ai no navegador e os apps de celular **não** iniciam
servidores locais; eles só usam conectores remotos.

## Requisitos

- Claude Desktop atualizado (menu **Claude > Check for Updates...**).
- Node.js 22 ou superior (`node --version`).
- Uma pasta só para a declaração, por exemplo `~/Documentos/IR-2026` ([instalação](../instalacao.md)).
- Pacote publicado no npm **ou** o build local em `apps/cli/dist/index.js`.

## Onde fica a configuração

| Sistema | Arquivo |
| --- | --- |
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |

O jeito mais seguro de abrir o arquivo certo é pela interface: **Settings > Developer > Edit Config**.
O aplicativo cria o arquivo se ele ainda não existir.

## Configuração

Com o pacote publicado no npm:

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

A partir do código (use o caminho absoluto do seu clone):

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
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

No Windows, use barras normais ou duplas no JSON:

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "command": "node",
      "args": [
        "C:/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js",
        "--dir",
        "C:/Users/voce/Documentos/IR-2026"
      ]
    }
  }
}
```

Se já houver outros servidores no arquivo, acrescente só a entrada `"mcp-imposto-de-renda"` dentro
do `mcpServers` existente.

## Passo a passo pela interface

1. Abra o Claude Desktop e vá em **Settings > Developer**.
2. Clique em **Edit Config**; o sistema abre a pasta com o `claude_desktop_config.json`.
3. Cole a configuração acima, troque os caminhos e salve.
4. Feche o aplicativo **por completo** (no macOS, Cmd+Q; no Windows, saia também pelo ícone da
   bandeja) e abra de novo. A configuração só é lida na abertura.

## Como verificar

- Na caixa de mensagem, abra o menu de ferramentas e confira se `mcp-imposto-de-renda` aparece com
  as ferramentas listadas.
- Peça: "Use o MCP Imposto de Renda e liste os arquivos da pasta autorizada". O Claude deve pedir
  permissão para chamar `listar_arquivos`.
- Os prompts `preparar_declaracao` e `revisar_malha_fina` aparecem no menu **+** da caixa de
  mensagem, na entrada do servidor. Se a sua versão não os mostrar, peça o roteiro em texto (veja os
  prompts no fim desta página).

## Modo somente leitura

Acrescente `"--somente-leitura"` ao fim de `args`:

```json
"args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026", "--somente-leitura"]
```

As 95 ferramentas que gravam somem; ficam as 59 de consulta, simulação e validação.

## Limitações

- O Claude Desktop pede aprovação a cada ferramenta por padrão. Mantenha assim para as que gravam
  (`destructiveHint: true`) e não use "permitir sempre" nelas.
- Tudo o que as ferramentas devolvem vai para a Anthropic, como o resto da conversa.
- O projeto não distribui pacote de extensão (`.mcpb`); a instalação é pelo JSON.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| O servidor não aparece | Valide o JSON (vírgulas e aspas), use caminhos absolutos e reinicie o aplicativo por completo. |
| `spawn npx ENOENT` ou `node` não encontrado | O app não herda o `PATH` do terminal. Use o caminho absoluto (`which node` no macOS e Linux, `where node` no Windows) em `command`. |
| Windows: `npx` não inicia | Use `"command": "cmd"` e `"args": ["/c", "npx", "-y", "mcp-imposto-de-renda", "--dir", "C:/Users/voce/Documentos/IR-2026"]`. |
| Falha sem mensagem clara | Leia os logs: `~/Library/Logs/Claude/mcp-server-mcp-imposto-de-renda.log` (macOS) ou `%APPDATA%\Claude\logs\` (Windows). No macOS, `tail -n 20 -f ~/Library/Logs/Claude/mcp*.log`. |
| `--dir: sem permissão de gravação` | A pasta precisa permitir escrita, ou use `--somente-leitura`. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir dos informes de rendimentos
> que anexei nesta conversa. Liste os arquivos da pasta primeiro, abra o DBK que eu gravei no
> programa oficial e me mostre o que vai preencher antes de gravar qualquer coisa.

> Com o MCP Imposto de Renda, simule o imposto da minha declaração nos modelos completo e
> simplificado e diga qual é mais vantajoso, explicando a diferença.

> Use o prompt revisar_malha_fina do MCP Imposto de Renda no meu DBK e liste as pendências por
> ordem de risco.

## Fontes

- https://modelcontextprotocol.io/docs/develop/connect-local-servers (consultado em 14/10/2026)
- https://support.claude.com/en/articles/10949351-getting-started-with-local-mcp-servers-on-claude-desktop (consultado em 14/10/2026)

O caminho de Linux não consta da página oficial consultada; ele foi conferido em relatos de
instalação. Na dúvida, abra o arquivo por **Settings > Developer > Edit Config**.
