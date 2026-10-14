# Gemini CLI e Antigravity CLI

| Cliente | Transporte | Suporte | Plano |
| --- | --- | --- | --- |
| Gemini CLI | stdio local | Completo | Desde 18/06/2026, só com chave paga da Gemini API, Vertex AI ou licença Gemini Code Assist Standard/Enterprise. |
| Antigravity CLI | stdio local | Completo | Conta Google com acesso ao Antigravity (veja a página de planos do Antigravity). |

Em maio de 2026 o Google anunciou a troca do Gemini CLI pelo **Antigravity CLI**. Desde 18/06/2026
o Gemini CLI deixou de atender contas gratuitas e assinantes Google AI Pro e Ultra; empresas e quem
usa chave paga da API continuam com acesso. Se você usava o Gemini CLI com conta pessoal, siga a
seção do Antigravity CLI.

## Gemini CLI

### Onde fica a configuração

| Escopo | Arquivo |
| --- | --- |
| Usuário | `~/.gemini/settings.json` (Windows: `%USERPROFILE%\.gemini\settings.json`) |
| Projeto | `.gemini/settings.json` na raiz do projeto |

### Configuração pela linha de comando

```sh
# pacote publicado no npm (escopo do usuário)
gemini mcp add -s user mcp-imposto-de-renda npx -- -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026

# a partir do código
gemini mcp add -s user mcp-imposto-de-renda node -- /Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js --dir /Users/voce/Documentos/IR-2026
```

O `--` impede que o Gemini CLI interprete `-y` e `--dir` como opções dele. O escopo padrão de
`gemini mcp add` é `project`; use `-s user` para não gravar o caminho da sua pasta no projeto.

### Configuração por arquivo

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026"],
      "timeout": 600000,
      "trust": false
    }
  }
}
```

A partir do código, troque `command` por `"node"` e o primeiro item de `args` pelo caminho de
`apps/cli/dist/index.js`, sem o `-y`.

Mantenha `"trust": false`: com `true`, o Gemini CLI deixa de pedir confirmação para todas as
ferramentas, inclusive as que gravam.

### Como verificar

- `gemini mcp list` no terminal.
- Dentro da sessão, `/mcp` mostra o servidor, as ferramentas e os prompts.
- Os prompts viram comandos: `/preparar_declaracao` e `/revisar_malha_fina` (argumento opcional
  `--arquivo="nome.DBK"`).

### Modo somente leitura

Acrescente `"--somente-leitura"` ao fim de `args`. O Gemini CLI também filtra ferramentas com
`includeTools` e `excludeTools`, mas o modo somente leitura é mais seguro.

## Antigravity CLI

### Onde fica a configuração

| Escopo | Arquivo |
| --- | --- |
| Global | `~/.gemini/config/mcp_config.json` |
| Projeto | `.agents/mcp_config.json` |

O mesmo arquivo vale para o aplicativo e o IDE Antigravity. O formato é o padrão `mcpServers`; para
servidores remotos o campo é `serverUrl` (não se aplica aqui).

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

Também há `disabledTools` (lista de ferramentas a esconder) e `disabled` (desligar sem apagar).

### Passo a passo e verificação

1. Salve o arquivo e inicie o Antigravity CLI.
2. Digite `/mcp` e pressione Enter: o gerenciador mostra o estado de cada servidor e o log de conexão.
3. No aplicativo ou no IDE, o caminho é **Settings > Customizations > Installed MCP Servers** (ou
   **MCP Servers > Manage MCP Servers > View raw config** no IDE).

### Modo somente leitura

Acrescente `"--somente-leitura"` ao fim de `args`.

## Limitações

- O Gemini sanitiza nomes de ferramenta e usa o prefixo `mcp_<servidor>_<ferramenta>`. Não renomeie
  o servidor com sublinhados (`mcp_imposto`), porque o separador é o primeiro `_` depois de `mcp_`.
- Tudo o que as ferramentas devolvem vai para o Google, conforme os termos da sua conta ou chave.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| `gemini` responde que a conta não é atendida | Conta pessoal após 18/06/2026. Use o Antigravity CLI ou uma chave paga. |
| Servidor "Disconnected" | Rode o comando de `command` e `args` no terminal e leia o erro em stderr. |
| Windows: `npx` não inicia | `"command": "cmd"` e `"args": ["/c", "npx", "-y", "mcp-imposto-de-renda", "--dir", "C:/Users/voce/Documentos/IR-2026"]`. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir destes informes. Liste a pasta,
> abra o DBK, mostre o que pretende incluir em cada ficha e só grave depois que eu aprovar.

> /revisar_malha_fina --arquivo="12345678909-IRPF-A-2026-2025-ORIGI.DBK"

## Fontes

- https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md (consultado em 14/10/2026)
- https://github.com/google-gemini/gemini-cli/blob/main/docs/reference/configuration.md (consultado em 14/10/2026)
- https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/ (consultado em 14/10/2026)
- https://antigravity.google/docs/mcp (consultado em 14/10/2026)
