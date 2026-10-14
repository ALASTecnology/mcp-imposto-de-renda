# Windsurf (Devin Desktop)

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo, com atenção ao limite de 100 ferramentas do Cascade | Qualquer plano. Em contas Enterprise, o MCP precisa ser ligado nas configurações; em Teams e Enterprise, o administrador pode exigir allowlist. |

A documentação atual do editor da Cognition se refere a ele como **Devin Desktop**, com dois agentes:
o **Devin Local** (padrão em abas novas) e o **Cascade** (legado). Os dois leem os servidores MCP do
mesmo arquivo `mcp_config.json`.

## Requisitos

- Windsurf/Devin Desktop atualizado.
- Node.js 22 ou superior.
- Pasta da declaração criada ([instalação](../instalacao.md)).

## Onde fica a configuração

| Sistema | Arquivo |
| --- | --- |
| macOS e Linux | `~/.config/devin/mcp_config.json` (ou `$XDG_CONFIG_HOME/devin/mcp_config.json`) |
| Windows | `%APPDATA%\devin\mcp_config.json` |
| Projeto (Devin Local) | `.devin/mcp_config.local.json` (fora do git) ou `.devin/mcp_config.json` (versionado) |

Versões antigas do Windsurf usavam `~/.codeium/windsurf/mcp_config.json`. Se a sua instalação ainda
lê esse arquivo, o formato é o mesmo.

## Configuração

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026", "--somente-leitura"]
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
        "/Users/voce/Documentos/IR-2026",
        "--somente-leitura"
      ]
    }
  }
}
```

Com o Devin CLI instalado, o mesmo resultado em escopo de usuário:

```sh
devin mcp add -s user mcp-imposto-de-renda -- npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026 --somente-leitura
```

## Passo a passo pela interface (Cascade)

1. No painel do Cascade, abra o menu **...** (Actions) no canto superior direito.
2. Na seção **MCPs**, clique no ícone **Open MCP config file**.
3. Cole a configuração em `mcpServers`, salve e volte ao menu: o servidor aparece com a contagem de
   ferramentas habilitadas.

No Devin Local, a lista de servidores carregados aparece na área de personalizações da sessão.

## O limite de 100 ferramentas do Cascade

O Cascade usa no máximo **100 ferramentas ao mesmo tempo**, somando todos os servidores. O servidor
completo tem 154; com `--somente-leitura`, 59. Por isso os exemplos já vêm em modo somente leitura.
Para gravar:

- crie uma segunda entrada sem `--somente-leitura` e ligue só quando for preencher, desligando a outra
  no interruptor; ou
- esconda ferramentas com `"disabledTools": ["nome_da_ferramenta", ...]` até ficar abaixo do limite.

## Como verificar

- No menu **...** do Cascade, seção **MCPs**, o servidor aparece ligado e com ferramentas.
- Com o Devin CLI: `devin mcp list` e `devin mcp get mcp-imposto-de-renda`.

## Limitações

- O Cascade não tem instalação de um clique para servidores fora do marketplace; a configuração é pelo
  JSON.
- O que as ferramentas devolvem vai para o provedor do modelo escolhido.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| Servidor não aparece | Confira se editou o arquivo do caminho atual (`~/.config/devin/...`) e não o antigo (`~/.codeium/windsurf/...`). |
| Ferramentas cortadas | Limite de 100 ferramentas; use `--somente-leitura` ou `disabledTools`. |
| Windows: `npx` não inicia | `"command": "cmd"` e `"args": ["/c", "npx", "-y", "mcp-imposto-de-renda", "--dir", "C:/Users/voce/Documentos/IR-2026"]`. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir dos informes que vou colar.
> Liste a pasta autorizada, abra o DBK e me mostre o que vai incluir em cada ficha.

> Com o MCP Imposto de Renda, revise o DBK e aponte o que pode levar à malha fina.

## Fontes

- https://docs.windsurf.com/windsurf/cascade/mcp (consultado em 14/10/2026)
- https://docs.windsurf.com/windsurf/devin-local (consultado em 14/10/2026)
- https://cli.devin.ai/docs/extensibility/mcp/configuration (consultado em 14/10/2026)
