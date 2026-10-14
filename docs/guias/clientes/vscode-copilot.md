# GitHub Copilot no VS Code (modo agente)

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo, com o perfil `essencial` por causa do limite de 128 ferramentas | Qualquer plano do GitHub Copilot. Em Copilot Business e Enterprise, a organização controla o acesso a servidores MCP pelas políticas do Copilot. |

O VS Code inicia servidores MCP locais e entrega as ferramentas ao chat do Copilot no modo agente.

## Requisitos

- VS Code atualizado, com o GitHub Copilot ativo e o chat no modo **Agent**.
- Node.js 22 ou superior.
- Pasta da declaração criada ([instalação](../instalacao.md)).

## Onde fica a configuração

| Local | Arquivo | Chave raiz |
| --- | --- | --- |
| Perfil do usuário (recomendado) | `mcp.json` do perfil; abra com **MCP: Open User Configuration** | `servers` |
| Espaço de trabalho | `.vscode/mcp.json` | `servers` |
| Raiz do espaço de trabalho (formato portátil) | `.mcp.json` | `mcpServers` |

O `mcp.json` do perfil fica na pasta de usuário do VS Code: `~/Library/Application Support/Code/User/`
(macOS), `%APPDATA%\Code\User\` (Windows) e `~/.config/Code/User/` (Linux). Prefira abrir pelo
comando, que acerta o perfil ativo.

## Configuração

Pacote publicado no npm:

```json
{
  "servers": {
    "mcp-imposto-de-renda": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026", "--perfil", "essencial"]
    }
  }
}
```

A partir do código:

```json
{
  "servers": {
    "mcp-imposto-de-renda": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js",
        "--dir",
        "/Users/voce/Documentos/IR-2026",
        "--perfil",
        "essencial"
      ]
    }
  }
}
```

Os exemplos já trazem `--perfil essencial` por causa do limite de ferramentas explicado abaixo. Esse
perfil preenche e grava a declaração inteira com 84 ferramentas.

Pela linha de comando, o mesmo servidor entra no perfil com:

```sh
code --add-mcp '{"name":"mcp-imposto-de-renda","command":"npx","args":["-y","mcp-imposto-de-renda","--dir","/Users/voce/Documentos/IR-2026","--perfil","essencial"]}'
```

## Passo a passo pela interface

1. Abra a paleta de comandos (Cmd+Shift+P ou Ctrl+Shift+P) e rode **MCP: Open User Configuration**.
2. Cole a configuração, ajuste os caminhos e salve. O editor mostra ações (**Start**, **Stop**,
   **Restart**) acima da entrada do servidor.
3. Clique em **Start** e confirme que confia no servidor.
4. No chat, escolha o modo **Agent** e clique em **Configure Tools** para ver as ferramentas do
   `mcp-imposto-de-renda`.

## Como verificar

- **MCP: List Servers** mostra o estado; escolha o servidor e **Show Output** para ver o log.
- Os prompts do servidor aparecem no chat como `/mcp-imposto-de-renda.preparar_declaracao` e
  `/mcp-imposto-de-renda.revisar_malha_fina`.
- O recurso `aviso-legal` pode ser anexado em **Add Context > MCP Resources**.

## O limite de 128 ferramentas

O chat do VS Code aceita no máximo **128 ferramentas ativas por pedido** e devolve o erro
"Cannot have more than 128 tools per request" acima disso. O MCP Imposto de Renda completo registra
160 ferramentas. Por isso os exemplos usam `--perfil essencial`:

| Perfil | Ferramentas | Para quê |
| --- | --- | --- |
| `completo` (padrão) | 160 | Tudo. Passa do limite do VS Code. |
| `essencial` | 84 | Cria, preenche qualquer ficha, valida, calcula e grava. Tira só os atalhos repetidos por ficha (`editar_bem`, `listar_dependentes` e afins, cobertos por `editar_lancamento`, `remover_lancamento` e `listar_lancamentos`) e as calculadoras avulsas. |
| `consulta` | 40 | Só leitura e cálculo, nada grava. |

O limite vale para a soma de todas as ferramentas ativas no pedido, incluindo as embutidas do
Copilot e as de outros servidores. Se ainda passar de 128:

1. em **Configure Tools**, desmarque as ferramentas que não vai usar;
2. tire grupos inteiros com `--sem-grupos`, por exemplo `"--sem-grupos", "orientacao,arquivos"`
   (a lista de grupos aparece em `mcp-imposto-de-renda --ajuda`); ou
3. ative a configuração `github.copilot.chat.virtualTools.threshold`, que agrupa ferramentas
   automaticamente quando a lista é grande.

Precisa de uma calculadora avulsa (carnê-leão, ganho de capital, preço médio)? Use `--perfil
completo` em outro servidor, deixe-o parado e inicie só quando for usar.

## Modo somente leitura e sandbox

No macOS e no Linux, o VS Code pode isolar servidores stdio com `"sandboxEnabled": true`, liberando
escrita só na pasta da declaração:

```json
{
  "servers": {
    "mcp-imposto-de-renda": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js", "--dir", "/Users/voce/Documentos/IR-2026", "--perfil", "consulta"],
      "sandboxEnabled": true,
      "sandbox": {
        "filesystem": { "allowWrite": ["/Users/voce/Documentos/IR-2026"] }
      }
    }
  }
}
```

Atenção: com sandbox ativo, o VS Code **aprova automaticamente** as chamadas desse servidor. Use
sandbox só com `--perfil consulta` (ou `--somente-leitura`), que não grava nada; para gravar, deixe o
servidor fora da sandbox e confirme cada chamada. A sandbox não existe no Windows.

## Limitações

- Servidores do espaço de trabalho herdam a confiança do workspace. Não abra repositórios de terceiros
  com um `.vscode/mcp.json` que você não leu.
- O que as ferramentas devolvem vai para o provedor do modelo escolhido no Copilot.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| "Cannot have more than 128 tools per request" | Use `--perfil essencial` e veja a seção sobre o limite de 128 ferramentas. |
| Servidor em erro | **MCP: List Servers > Show Output** e rode o mesmo comando no terminal. |
| Windows: `npx` não inicia | `"command": "cmd"` e `"args": ["/c", "npx", "-y", "mcp-imposto-de-renda", "--dir", "C:/Users/voce/Documentos/IR-2026", "--perfil", "essencial"]`. |
| Ferramentas não aparecem no chat | Confira se o chat está no modo **Agent**; os modos Ask e Edit não chamam ferramentas MCP. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir dos
> informes que vou colar. Liste a pasta, abra o DBK e mostre um plano de preenchimento antes de gravar.

> /mcp-imposto-de-renda.preparar_declaracao

## Fontes

- https://code.visualstudio.com/docs/copilot/customization/mcp-servers (consultado em 14/10/2026)
- https://code.visualstudio.com/docs/copilot/reference/mcp-configuration (consultado em 14/10/2026)
- https://code.visualstudio.com/docs/copilot/agents/agent-tools (limite de 128 ferramentas, consultado em 14/10/2026)
