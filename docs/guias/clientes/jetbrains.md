# JetBrains AI Assistant e Junie

| Cliente | Transporte | Suporte | Plano |
| --- | --- | --- | --- |
| AI Assistant (IntelliJ IDEA, PyCharm, WebStorm e demais IDEs) | stdio local | Completo | Acesso ao JetBrains AI (confira os planos na JetBrains). Em empresas com IDE Services ou JetBrains Central, o administrador pode bloquear servidores próprios. |
| Junie (no IDE e Junie CLI) | stdio local | Completo | Acesso ao Junie (confira os planos na JetBrains). |

## AI Assistant

### Onde fica a configuração

A configuração é feita pela interface, não por arquivo: **Settings | Tools | AI Assistant | Model
Context Protocol (MCP)**. No chat, digitar `/` e escolher **Add Command** abre a mesma tela. Cada
servidor pode ser global ou só do projeto (**Server level**).

### Passo a passo

1. Abra **Settings | Tools | AI Assistant | Model Context Protocol (MCP)**.
2. Clique em **Add**. Se você já configurou o Claude Desktop, **Import from Claude** traz o servidor
   pronto.
3. No diálogo **New MCP Server**, escolha a configuração em JSON e cole:

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
         ]
       }
     }
   }
   ```

4. Em **Server level**, escolha **Global** (o caminho da pasta é pessoal).
5. Clique em **OK** e depois em **Apply**. O servidor inicia e a coluna **Status** mostra a conexão.

### Como verificar

A coluna **Status** deve indicar conexão ativa. As ferramentas também podem ser chamadas no chat
digitando `/`.

## Junie

### Onde fica a configuração

| Escopo | Arquivo |
| --- | --- |
| Usuário | `~/.junie/mcp/mcp.json` (Windows: `%USERPROFILE%\.junie\mcp\mcp.json`) |
| Projeto | `.junie/mcp/mcp.json` na raiz do projeto |

O Junie CLI e o Junie dentro dos IDEs usam o mesmo formato. Prefira o escopo de usuário.

### Configuração

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

A partir do código, troque `command` por `"node"` e use o caminho de `apps/cli/dist/index.js` como
primeiro argumento, sem o `-y`.

### Como verificar

No Junie CLI, `/mcp` lista os servidores com escopo e estado (`Active`, `Failed`, `Disabled`...).
Configurações escritas à mão entram habilitadas.

## Modo somente leitura

Nos dois clientes, acrescente `"--somente-leitura"` ao fim de `args`.

## Limitações

- O que as ferramentas devolvem vai para o provedor do modelo configurado no JetBrains AI.
- Não versione `.junie/mcp/mcp.json` com o caminho da sua pasta.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| Status de erro no AI Assistant | Use **Working directory** só se usar caminhos relativos; prefira caminhos absolutos e confira o comando no terminal. |
| `npx` não encontrado | O IDE pode não herdar o `PATH` do terminal; use o caminho absoluto do `node`. |
| Junie mostra `Failed` | Selecione o servidor em `/mcp` para ver o erro; rode o comando no terminal. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir dos informes que vou colar.
> Não mexa nos arquivos do projeto; use só as ferramentas do servidor e peça confirmação antes de gravar.

> Com o MCP Imposto de Renda, valide o DBK da pasta e explique cada pendência.

## Fontes

- https://www.jetbrains.com/help/ai-assistant/mcp.html (AI Assistant 2026.2, consultado em 14/10/2026)
- https://junie.jetbrains.com/docs/junie-cli-mcp-configuration.html (consultado em 14/10/2026)
