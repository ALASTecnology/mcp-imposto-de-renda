# OpenAI Codex (CLI, extensão de IDE e app ChatGPT)

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo | Conta ChatGPT com acesso ao Codex (planos pagos) ou chave da API da OpenAI. |

O Codex guarda os servidores MCP no `config.toml`. Essa configuração é **compartilhada** entre o
Codex CLI, a extensão de IDE e o Codex dentro do aplicativo ChatGPT para desktop: configurou uma vez,
vale nos três ([chatgpt.md](chatgpt.md)).

## Requisitos

- Codex CLI instalado (`codex --version`) e autenticado, ou o aplicativo ChatGPT para desktop.
- Node.js 22 ou superior.
- Pasta da declaração criada ([instalação](../instalacao.md)).

## Onde fica a configuração

| Escopo | macOS e Linux | Windows |
| --- | --- | --- |
| Usuário | `~/.codex/config.toml` | `%USERPROFILE%\.codex\config.toml` |
| Projeto (só em projeto confiável) | `.codex/config.toml` | `.codex\config.toml` |

Se a variável `CODEX_HOME` estiver definida, o arquivo fica em `$CODEX_HOME/config.toml`.

## Configuração pela linha de comando

```sh
# pacote publicado no npm
codex mcp add mcp-imposto-de-renda -- npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026

# a partir do código
codex mcp add mcp-imposto-de-renda -- node /Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js --dir /Users/voce/Documentos/IR-2026
```

## Configuração por arquivo (config.toml)

```toml
[mcp_servers.mcp-imposto-de-renda]
command = "npx"
args = ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026"]
startup_timeout_sec = 30
default_tools_approval_mode = "writes"
```

A partir do código:

```toml
[mcp_servers.mcp-imposto-de-renda]
command = "node"
args = [
  "/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js",
  "--dir",
  "/Users/voce/Documentos/IR-2026",
]
startup_timeout_sec = 30
default_tools_approval_mode = "writes"
```

No Windows, use barras normais em strings TOML comuns (`"C:/Users/voce/Documentos/IR-2026"`) ou
strings literais com aspas simples (`'C:\Users\voce\Documentos\IR-2026'`).

- `startup_timeout_sec = 30`: o padrão é 10 segundos, curto para o primeiro `npx`, que baixa o pacote.
- `default_tools_approval_mode = "writes"`: o Codex pede confirmação para toda ferramenta que não é
  marcada como somente leitura. É o comportamento recomendado para este servidor.

## Como verificar

```sh
codex mcp list
```

Na interface do terminal (`codex`), `/mcp` mostra os servidores ativos e as ferramentas.

## Modo somente leitura

```toml
args = ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026", "--somente-leitura"]
```

O Codex também aceita filtros por ferramenta (`enabled_tools` e `disabled_tools`), mas
`--somente-leitura` é mais seguro porque as ferramentas de gravação nem chegam a existir.

## Limitações

- O Codex é voltado a programação; para conversa guiada sobre a declaração, os prompts abaixo ajudam
  a manter o foco.
- `tool_timeout_sec` tem padrão de 60 segundos. Ferramentas que leem `.DBK` grandes cabem nesse
  tempo, mas aumente se aparecer erro de tempo esgotado.
- O que as ferramentas devolvem vai para a OpenAI, como o resto da conversa.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| Servidor não inicia dentro do tempo | Aumente `startup_timeout_sec` ou instale o pacote antes (`npx -y mcp-imposto-de-renda --versao`). |
| `.codex/config.toml` do projeto ignorado | Projetos só leem a configuração local quando marcados como confiáveis. Use o arquivo do usuário. |
| Erro de TOML | Caminhos do Windows com `\` precisam de aspas simples ou de `\\`. |

## Prompts para começar

> Use o MCP Imposto de Renda (servidor mcp-imposto-de-renda) para criar minha declaração 2026 a
> partir dos informes que vou colar. Não edite arquivos do repositório; trabalhe só com as
> ferramentas do servidor e peça confirmação antes de cada gravação.

> Com o MCP Imposto de Renda, abra o DBK da pasta autorizada, rode a validação e me dê um resumo das
> pendências.

## Fontes

- https://developers.openai.com/codex/mcp (consultado em 14/10/2026)
- https://developers.openai.com/codex/config-reference (consultado em 14/10/2026)
