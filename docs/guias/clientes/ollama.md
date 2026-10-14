# Ollama

| Transporte | Suporte | Plano |
| --- | --- | --- |
| Não se aplica: o Ollama não é cliente MCP | Completo **via cliente MCP** (ollmcp, goose, Continue, Cline) | Gratuito para modelos locais. |

O Ollama executa modelos; ele não inicia servidores MCP. Para usar o MCP Imposto de Renda com um
modelo do Ollama, junte o Ollama a um cliente MCP que fale stdio. Com modelo local, a declaração não
sai da sua máquina.

## Opção 1: ollmcp (terminal)

O [MCP Client for Ollama](https://github.com/jonigl/mcp-client-for-ollama) (`ollmcp`) é um cliente de
terminal feito para o Ollama, com aprovação de cada chamada de ferramenta (*Human-in-the-Loop*).

```sh
uv tool install --upgrade ollmcp   # ou: pip install --upgrade ollmcp

# pacote publicado no npm
ollmcp mcp add mcp-imposto-de-renda -- npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026 --perfil consulta
# a partir do código
ollmcp mcp add mcp-imposto-de-renda -- node /Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js --dir /Users/voce/Documentos/IR-2026 --perfil consulta

ollmcp   # inicia o cliente; /help mostra os comandos
```

Onde fica a configuração do ollmcp:

| Escopo | Arquivo |
| --- | --- |
| Usuário | `~/.config/ollmcp/mcp.json` |
| Projeto (`local`) | `~/.config/ollmcp/mcp.local.json`, indexado pelo caminho do projeto |

Se você já configurou o Claude Desktop, `ollmcp --claude-desktop` reaproveita os servidores de lá.
Os logs de cada servidor ficam em `~/.config/ollmcp/logs/`.

## Opção 2: outro cliente com o Ollama como provedor

- [goose](goose.md): escolha o Ollama em **Configure LLM Provider**.
- [Continue](continue.md) e [Cline](cline.md): configure o Ollama como provedor de modelo.
- O aplicativo do Ollama também conecta modelos ao [Claude Desktop](claude-desktop.md) e ao Codex no
  [app ChatGPT](chatgpt.md); nesse caso a configuração do MCP é a do cliente.

## Requisitos e escolha do modelo

- Ollama rodando (`ollama serve` ou o aplicativo).
- Um modelo com suporte a chamada de ferramentas (*tool calling*) e contexto grande. Ajuste o
  tamanho do contexto do modelo: o padrão costuma ser pequeno para a lista de ferramentas.

## Modo somente leitura

Os exemplos já usam `--perfil consulta`, que só lê e calcula e reduz a lista de 154 para 37
ferramentas, o que cabe melhor no contexto de modelos locais. Para gravar, troque por `--perfil
essencial` (78 ferramentas, preenche e grava a declaração inteira) e aprove cada chamada. Os perfis
estão em [clientes-mcp.md](../clientes-mcp.md#quantidade-de-ferramentas).

## Limitações

- Modelos locais pequenos erram mais argumentos. Simule sempre antes de gravar e confira o valor de
  cada ficha.
- O ollmcp é um projeto da comunidade, não do Ollama.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| O modelo responde sem chamar ferramentas | Escolha um modelo com suporte a ferramentas. |
| Respostas cortadas ou confusas | Aumente o contexto do modelo e use `--perfil consulta` (ou `--perfil essencial` para gravar). |
| Servidor não inicia | Veja `~/.config/ollmcp/logs/` e rode o comando no terminal. |

## Prompts para começar

> Use o MCP Imposto de Renda. Liste os arquivos da pasta e abra o DBK de 2026.

> Simule o imposto da declaração com o MCP Imposto de Renda e diga qual modelo é melhor.

## Fontes

- https://docs.ollama.com/integrations (consultado em 14/10/2026)
- https://github.com/jonigl/mcp-client-for-ollama (README consultado em 14/10/2026)
