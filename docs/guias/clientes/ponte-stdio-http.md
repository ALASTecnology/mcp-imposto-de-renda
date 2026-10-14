# Ponte local de stdio para HTTP

O MCP Imposto de Renda só fala **stdio**: o cliente inicia o processo e conversa com ele pela
entrada e saída padrão. Não existe modo HTTP no servidor e não vai existir enquanto valer o
[ADR 0001](../../adr/0001-mcp-local-sem-servidor.md).

Alguns clientes, porém, só aceitam uma **URL** de servidor MCP (Streamable HTTP ou SSE). Para esses,
a saída é rodar uma **ponte local**: um programa que escuta numa porta da sua máquina, inicia o
`mcp-imposto-de-renda` por stdio e repassa as mensagens.

![Como cada cliente se conecta](../../assets/clientes-conexao.svg)

## Antes de começar: leia o aviso de segurança

> [!WARNING]
> A ponte abre uma porta de rede que dá acesso a **todas** as ferramentas do servidor, inclusive
> as que gravam na pasta da declaração. O servidor não tem login: quem alcançar a porta lê o seu
> CPF, rendimentos e patrimônio e pode alterar o `.DBK`. Expor essa porta na rede local ou na
> internet contraria o modelo de segurança do projeto ([docs/seguranca.md](../../seguranca.md)).

Regras que valem para qualquer ponte:

1. **Escute só em `127.0.0.1`.** Nunca use `0.0.0.0`, o IP da sua rede local ou `::`. Várias
   pontes escutam em todas as interfaces por padrão; por isso o endereço aparece explícito em todos
   os comandos abaixo.
2. **Exija uma chave.** Gere um segredo aleatório e configure o mesmo valor no cliente.
3. **Prefira `--somente-leitura`.** Se você só quer consultar e simular, a ponte nem expõe as
   ferramentas que gravam.
4. **Ligue só enquanto usa.** Encerre a ponte (Ctrl+C) ao terminar. Não a instale como serviço.
5. **Sem túnel público.** Não use ngrok, Cloudflare Tunnel, encaminhamento de porta no roteador ou
   similares para "publicar" a ponte. Este guia não documenta esse caminho de propósito.

Gerar uma chave:

```sh
# macOS e Linux
export IR_MCP_TOKEN="$(openssl rand -hex 32)"
```

```powershell
# Windows (PowerShell 7)
$env:IR_MCP_TOKEN = [Convert]::ToHexString([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

## Opção A: supergateway (Node.js)

Não exige nada além do Node.js 22, que o MCP Imposto de Renda já pede. Expõe Streamable HTTP em
`/mcp`.

Com o pacote publicado no npm:

```sh
npx -y supergateway \
  --stdio "npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026 --somente-leitura" \
  --outputTransport streamableHttp \
  --host 127.0.0.1 --port 8765 \
  --apiKey "$IR_MCP_TOKEN"
```

A partir do código (enquanto o pacote não está no npm):

```sh
npx -y supergateway \
  --stdio "node /Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js --dir /Users/voce/Documentos/IR-2026 --somente-leitura" \
  --outputTransport streamableHttp \
  --host 127.0.0.1 --port 8765 \
  --apiKey "$IR_MCP_TOKEN"
```

No Windows (PowerShell), numa linha só:

```powershell
npx -y supergateway --stdio "node C:/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js --dir C:/Users/voce/Documentos/IR-2026 --somente-leitura" --outputTransport streamableHttp --host 127.0.0.1 --port 8765 --apiKey $env:IR_MCP_TOKEN
```

- Endereço para o cliente: `http://127.0.0.1:8765/mcp`.
- Cabeçalho de autenticação: `Authorization: Bearer <sua chave>` (ou `X-API-Key: <sua chave>`).
- O valor de `--stdio` é uma linha de comando única. Se o caminho tiver espaços, use aspas simples
  dentro dele: `--stdio "node '/Users/voce/Meus Projetos/.../index.js' --dir '/Users/voce/IR 2026'"`.
- Para permitir gravações, retire `--somente-leitura` e confirme cada chamada no cliente.

## Opção B: mcp-proxy (Python)

Escuta em `127.0.0.1` por padrão e oferece Streamable HTTP em `/mcp` e SSE em `/sse`.

```sh
uv tool install mcp-proxy   # ou: pipx install mcp-proxy

mcp-proxy --host 127.0.0.1 --port 8765 -- \
  npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026 --somente-leitura
# a partir do código:
mcp-proxy --host 127.0.0.1 --port 8765 -- \
  node /Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js --dir /Users/voce/Documentos/IR-2026 --somente-leitura
```

O mcp-proxy não oferece chave de acesso no modo servidor. Use-o só em máquina de uso pessoal e
sempre com `--host 127.0.0.1`; se precisar de chave, prefira o supergateway.

## Opção C: mcpo (OpenAPI, para o Open WebUI)

O [mcpo](https://github.com/open-webui/mcpo) não fala MCP do lado HTTP: ele converte as ferramentas
em uma API OpenAPI comum. É o caminho clássico do Open WebUI. Atenção: o padrão da linha de comando
do mcpo é `--host 0.0.0.0`; informe `127.0.0.1` sempre.

```sh
uvx mcpo --host 127.0.0.1 --port 8765 --api-key "$IR_MCP_TOKEN" -- \
  npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026 --somente-leitura
```

A documentação gerada fica em `http://127.0.0.1:8765/docs`. Detalhes em [open-webui.md](open-webui.md).

## Testar a ponte

Com a ponte rodando, use o MCP Inspector apontando para `http://127.0.0.1:8765/mcp`, ou confirme que
a porta não está exposta:

```sh
# macOS e Linux: deve mostrar 127.0.0.1:8765, nunca *:8765 ou 0.0.0.0:8765
lsof -nP -iTCP:8765 -sTCP:LISTEN
```

```powershell
# Windows: a coluna LocalAddress deve ser 127.0.0.1
Get-NetTCPConnection -LocalPort 8765 -State Listen
```

## E os clientes na nuvem?

ChatGPT na web, Microsoft Copilot Studio, Gemini Enterprise e similares rodam nos servidores do
fornecedor. Eles não enxergam o `127.0.0.1` da sua máquina; só aceitam uma URL pública HTTPS. Para
atendê-los seria preciso publicar a ponte na internet, e este projeto não recomenda isso.

A única exceção razoável é o **Secure MCP Tunnel** da OpenAI, que abre apenas uma conexão de saída
da sua máquina, sem porta de entrada. Veja [chatgpt.md](chatgpt.md#chatgpt-na-web).

## Problemas comuns

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| `EADDRINUSE` ao iniciar | A porta 8765 já está em uso. | Troque `--port` e atualize a URL no cliente. |
| O cliente recebe 401 ou 403 | Chave ausente ou diferente. | Confira o cabeçalho `Authorization: Bearer ...` no cliente. |
| O cliente em Docker não conecta | `127.0.0.1` dentro do contêiner é o próprio contêiner. | Rode o cliente fora do Docker ou, no Linux, com `--network=host`. Não troque a ponte para `0.0.0.0`. |
| A ponte sobe e fecha em seguida | O comando do `--stdio` falhou (pasta inexistente, Node antigo). | Rode o mesmo comando sozinho no terminal e leia a mensagem em stderr. |

## Fontes

- supergateway: https://github.com/supercorp-ai/supergateway (README consultado em 14/10/2026)
- mcp-proxy: https://github.com/sparfenyuk/mcp-proxy (README consultado em 14/10/2026)
- mcpo: https://github.com/open-webui/mcpo (README e código consultados em 14/10/2026)
- Secure MCP Tunnel: https://developers.openai.com/api/docs/guides/secure-mcp-tunnels (consultado em 14/10/2026)
