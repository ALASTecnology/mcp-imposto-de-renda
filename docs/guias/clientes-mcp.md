# Configuração nos clientes MCP

Todo cliente MCP inicia o AutoIR da mesma forma: um comando, uma lista de argumentos e, no
argumento `--dir`, a pasta da declaração. Só muda o arquivo de configuração e o nome da chave.

Nos exemplos abaixo, troque `/Users/voce/Documentos/IR-2026` pela sua pasta. No Windows, use
barras duplas no JSON (`"C:\\Users\\voce\\Documentos\\IR-2026"`) ou barras normais
(`"C:/Users/voce/Documentos/IR-2026"`).

## Comando: npm ou código-fonte

| Instalação | `command` | `args` |
| --- | --- | --- |
| npm (depois da publicação) | `npx` | `["-y", "autoir-mcp", "--dir", "<pasta>"]` |
| código-fonte | `node` | `["/caminho/para/AutoIR/apps/cli/dist/index.js", "--dir", "<pasta>"]` |

Para usar só consulta e simulação, acrescente `"--somente-leitura"` ao fim de `args`.

Depois de editar a configuração, reinicie o cliente (ou recarregue os servidores MCP) e confira se
as ferramentas do AutoIR aparecem na lista.

## Claude Desktop

Arquivo `claude_desktop_config.json`:

- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "autoir": {
      "command": "npx",
      "args": ["-y", "autoir-mcp", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

A partir do código:

```json
{
  "mcpServers": {
    "autoir": {
      "command": "node",
      "args": [
        "/Users/voce/src/AutoIR/apps/cli/dist/index.js",
        "--dir",
        "/Users/voce/Documentos/IR-2026"
      ]
    }
  }
}
```

## Claude Code

Pela linha de comando (escopo do usuário ou do projeto):

```sh
claude mcp add autoir -- npx -y autoir-mcp --dir /Users/voce/Documentos/IR-2026
# ou, a partir do código
claude mcp add autoir -- node /Users/voce/src/AutoIR/apps/cli/dist/index.js --dir /Users/voce/Documentos/IR-2026
```

Ou num arquivo `.mcp.json` na raiz do projeto:

```json
{
  "mcpServers": {
    "autoir": {
      "command": "npx",
      "args": ["-y", "autoir-mcp", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

O `.mcp.json` com o caminho da sua pasta é pessoal; não o versione em repositório público.

## Cursor

Arquivo `~/.cursor/mcp.json` (global) ou `.cursor/mcp.json` (por projeto):

```json
{
  "mcpServers": {
    "autoir": {
      "command": "npx",
      "args": ["-y", "autoir-mcp", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

## VS Code

Arquivo `.vscode/mcp.json` no espaço de trabalho (ou o comando **MCP: Add Server**). A chave é
`servers` e cada servidor declara `type`:

```json
{
  "servers": {
    "autoir": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "autoir-mcp", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

## Windsurf

Arquivo `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "autoir": {
      "command": "npx",
      "args": ["-y", "autoir-mcp", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

## Outros clientes

Qualquer cliente compatível com MCP via stdio funciona. Procure na documentação dele onde ficam os
servidores locais e preencha:

- comando: `npx` (ou `node`);
- argumentos: `-y autoir-mcp --dir <pasta>` (ou o caminho do `dist/index.js` e `--dir <pasta>`);
- transporte: stdio. O AutoIR não oferece HTTP
  ([ADR 0001](../adr/0001-mcp-local-sem-servidor.md)).

## Boas práticas

- **Confirmação antes de gravar.** Deixe o cliente pedir aprovação para ferramentas com
  `destructiveHint: true` (as de inclusão, alteração, remoção e gravação do `.DBK`). Não aprove
  gravações em lote sem ler.
- **Um servidor por pasta.** Para separar declarações de pessoas diferentes, configure dois
  servidores com nomes distintos (`autoir-ana`, `autoir-bruno`), cada um com a sua pasta.
- **Privacidade.** O provedor de LLM configurado no cliente recebe tudo o que as ferramentas
  devolvem. Escolha o provedor e o plano conforme a política de dados que você aceita.

Problemas comuns (comando `npx` não encontrado no Windows, caminho com espaços, servidor que não
aparece) estão em [solucao-de-problemas.md](solucao-de-problemas.md).
