# ChatGPT (aplicativo de desktop e web)

| Superfície | Transporte | Suporte | Plano |
| --- | --- | --- | --- |
| App ChatGPT para desktop (Codex) | stdio local | Completo | Conta ChatGPT com acesso ao Codex. |
| ChatGPT na web (servidor MCP personalizado como plugin) | Streamable HTTP ou SSE, só por URL pública HTTPS ou Secure MCP Tunnel | Com ponte, **não recomendado** | Sujeito às permissões do workspace; consulte a central de ajuda da OpenAI para o seu plano. |

Resumo honesto: use o **aplicativo de desktop**. No navegador, o ChatGPT roda nos servidores da
OpenAI e não consegue iniciar um processo na sua máquina.

## Aplicativo ChatGPT para desktop

O aplicativo (macOS, Windows e Linux) inclui o Codex. O Codex lê os servidores MCP do mesmo
`config.toml` usado pelo Codex CLI e pela extensão de IDE.

### Onde fica a configuração

| Sistema | Arquivo |
| --- | --- |
| macOS e Linux | `~/.codex/config.toml` |
| Windows | `%USERPROFILE%\.codex\config.toml` |

### Configuração

```toml
# pacote publicado no npm
[mcp_servers.mcp-imposto-de-renda]
command = "npx"
args = ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026"]
startup_timeout_sec = 30
default_tools_approval_mode = "writes"
```

```toml
# a partir do código
[mcp_servers.mcp-imposto-de-renda]
command = "node"
args = ["/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js", "--dir", "/Users/voce/Documentos/IR-2026"]
startup_timeout_sec = 30
default_tools_approval_mode = "writes"
```

Se tiver o Codex CLI instalado, o mesmo resultado sai de:

```sh
codex mcp add mcp-imposto-de-renda -- npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026
```

Detalhes de cada opção em [codex.md](codex.md).

### Passo a passo

1. Feche o aplicativo ChatGPT.
2. Edite o `config.toml` (crie o arquivo se não existir) e salve.
3. Abra o aplicativo, escolha **Codex** e comece uma conversa nova.
4. Peça para listar os arquivos da pasta autorizada; o Codex deve chamar `listar_arquivos`.

### Modo somente leitura

Acrescente `"--somente-leitura"` ao fim de `args`.

## ChatGPT na web

O ChatGPT na web aceita servidores MCP personalizados como plugins (**chatgpt.com/plugins > + >
Add custom MCP server**), mas somente com uma destas conexões:

- uma **URL pública HTTPS** (Streamable HTTP ou SSE); ou
- um **Secure MCP Tunnel**, em que um programa da OpenAI (`tunnel-client`) roda na sua máquina, abre
  só conexões de saída para `api.openai.com` e repassa as chamadas para o servidor local.

Não há opção de servidor stdio no navegador.

### Por que não recomendamos

- Uma URL pública colocaria a pasta da declaração na internet. Este projeto não documenta esse
  caminho.
- O Secure MCP Tunnel evita a porta aberta, mas exige organização na plataforma da OpenAI, chave de
  API e permissões de túnel, além da permissão do workspace para servidores personalizados. É
  pensado para empresas e desenvolvedores.

### Se mesmo assim quiser usar o Secure MCP Tunnel

1. Crie um túnel em **platform.openai.com > Settings > Tunnels** e associe ao seu workspace do
   ChatGPT.
2. Instale o `tunnel-client` (página de releases `openai/tunnel-client`).
3. Configure um perfil stdio apontando para o servidor, **sempre em modo somente leitura**:

   ```sh
   export CONTROL_PLANE_API_KEY="sk-..."
   tunnel-client init \
     --sample sample_mcp_stdio_local \
     --profile ir-2026 \
     --tunnel-id tunnel_SEU_ID \
     --mcp-command "npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026 --somente-leitura"
   tunnel-client doctor --profile ir-2026 --explain
   tunnel-client run --profile ir-2026
   ```

4. Em **chatgpt.com/plugins**, clique em **+ > Add custom MCP server**, escolha **Tunnel** em
   **Connection**, selecione o túnel, aceite o aviso de risco e clique em **Create as a plugin**.
5. Instale o plugin e, na conversa, digite `@` e escolha o plugin.
6. Encerre o `tunnel-client` ao terminar.

O ChatGPT trata como gravação toda ferramenta sem `readOnlyHint` e pede confirmação. Mesmo assim,
mantenha `--somente-leitura` nesse caminho.

## Limitações

- Tudo o que as ferramentas devolvem vai para a OpenAI, em qualquer das duas superfícies.
- A disponibilidade de servidores personalizados na web varia por plano e por política do
  workspace, e mudou várias vezes em 2026. Confira na central de ajuda da OpenAI antes de assinar
  algo só por isso.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| O app não mostra as ferramentas | Confira se está no modo **Codex** e se o `config.toml` não tem erro de sintaxe; reinicie o app. |
| Primeira execução estoura o tempo | `startup_timeout_sec = 30` ou rode `npx -y mcp-imposto-de-renda --versao` antes. |
| Web: "cannot connect" ao criar o plugin | Rode `tunnel-client doctor --profile ir-2026 --explain` e confira a associação do túnel ao workspace. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir dos informes que anexei.
> Primeiro liste a pasta autorizada e abra o DBK; depois proponha as fichas e só grave com a minha
> confirmação.

> Usando só o MCP Imposto de Renda, sem navegar na web, simule o imposto e me diga se compensa o
> modelo simplificado.

## Fontes

- https://developers.openai.com/codex/mcp (consultado em 14/10/2026)
- https://learn.chatgpt.com/docs/plugins (consultado em 14/10/2026)
- https://developers.openai.com/api/docs/guides/custom-mcp-server (consultado em 14/10/2026)
- https://developers.openai.com/api/docs/guides/secure-mcp-tunnels (consultado em 14/10/2026)
- https://developers.openai.com/apps-sdk/deploy/connect-chatgpt (consultado em 14/10/2026)
