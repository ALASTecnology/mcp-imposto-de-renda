# Claude Code

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo | Qualquer forma de acesso ao Claude Code (assinatura Claude Pro, Max, Team, Enterprise ou chave de API). |

O Claude Code (CLI, extensões de IDE e aplicativo de desktop) registra servidores com
`claude mcp add` ou lê um `.mcp.json` na raiz do projeto.

## Requisitos

- Claude Code instalado e autenticado (`claude --version`).
- Node.js 22 ou superior.
- Pasta da declaração criada ([instalação](../instalacao.md)).

## Onde fica a configuração

| Escopo | Onde fica | Quando usar |
| --- | --- | --- |
| `local` (padrão) | `~/.claude.json`, na entrada do projeto atual | Só você, só neste projeto. **Recomendado.** |
| `user` | `~/.claude.json`, global | Só você, em todos os projetos. |
| `project` | `.mcp.json` na raiz do projeto | Compartilhado pelo repositório. Evite: o arquivo leva o caminho da sua pasta. |

`~` é a pasta pessoal: `/Users/voce` no macOS, `/home/voce` no Linux e `C:\Users\voce` no Windows.

## Configuração pela linha de comando

Com o pacote publicado no npm:

```sh
claude mcp add mcp-imposto-de-renda -- npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026
```

A partir do código:

```sh
claude mcp add mcp-imposto-de-renda -- node /Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js --dir /Users/voce/Documentos/IR-2026
```

O `--` separa as opções do Claude Code (`--scope`, `--env`) dos argumentos do servidor. Para usar em
todos os projetos, acrescente `--scope user` antes do nome:

```sh
claude mcp add --scope user mcp-imposto-de-renda -- npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026
```

No Windows nativo (fora do WSL), se o `npx` não iniciar, chame-o pelo `cmd` (o `npx` do Windows
é um script `.cmd`):

```powershell
claude mcp add mcp-imposto-de-renda -- cmd /c npx -y mcp-imposto-de-renda --dir C:/Users/voce/Documentos/IR-2026
```

## Configuração por arquivo (.mcp.json)

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

O Claude Code pede aprovação para servidores de `.mcp.json` na primeira vez. Não versione esse
arquivo em repositório público.

Também é possível passar o JSON direto:

```sh
claude mcp add-json mcp-imposto-de-renda '{"command":"npx","args":["-y","mcp-imposto-de-renda","--dir","/Users/voce/Documentos/IR-2026"]}'
```

## Como verificar

```sh
claude mcp list                       # deve mostrar "✔ Connected" ao lado de mcp-imposto-de-renda
claude mcp get mcp-imposto-de-renda   # detalhes e, em caso de falha, a linha "Issue:"
```

Dentro de uma sessão, `/mcp` mostra o estado e a quantidade de ferramentas. Os prompts do servidor
viram comandos:

```text
/mcp__mcp-imposto-de-renda__preparar_declaracao
/mcp__mcp-imposto-de-renda__revisar_malha_fina
```

## Modo somente leitura

Inclua `--somente-leitura` depois do `--`:

```sh
claude mcp add mcp-imposto-de-renda-consulta -- npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026 --somente-leitura
```

Ter dois servidores (um de consulta e outro completo) e desligar o completo em `/mcp` quando não
estiver gravando é uma boa prática.

## Limitações

- O Claude Code avisa quando a saída de uma ferramenta passa de 10.000 tokens e corta em 25.000 por
  padrão. Declarações grandes cabem, mas `MAX_MCP_OUTPUT_TOKENS=50000 claude` aumenta o limite.
- Com 162 ferramentas, o Claude Code usa a busca de ferramentas (ativa por padrão) para não carregar
  todas no contexto de uma vez.
- Não use o modo de permissões que aprova tudo automaticamente enquanto o servidor completo estiver
  ligado: as ferramentas de gravação devem ser confirmadas uma a uma.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| `✘ Failed to connect` | Rode o comando depois do `--` sozinho no terminal; a mensagem em stderr (por exemplo `--dir é obrigatório`) indica o erro. |
| O servidor demora para subir na primeira vez (download do `npx`) | Aumente o tempo de partida: `MCP_TIMEOUT=30000 claude`. |
| `⏸ Pending approval` | Servidor de `.mcp.json` ainda não aprovado. Abra `claude` no projeto e aprove. |
| O servidor some em outros projetos | Ele está no escopo `local`. Adicione de novo com `--scope user`. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir destes informes (vou colar os
> valores a seguir). Liste a pasta, abra o DBK gravado pelo programa oficial e proponha as inclusões
> antes de gravar.

> /mcp__mcp-imposto-de-renda__preparar_declaracao

> Com o MCP Imposto de Renda, valide o DBK da pasta e explique cada erro e aviso em linguagem simples.

## Fontes

- https://code.claude.com/docs/en/mcp (consultado em 14/10/2026)
