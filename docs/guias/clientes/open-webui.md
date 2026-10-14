# Open WebUI

| Transporte | Suporte | Plano |
| --- | --- | --- |
| MCP nativo só por Streamable HTTP (desde a v0.6.31); servidores OpenAPI via mcpo | Com ponte local | Gratuito e de código aberto. Só administradores adicionam servidores MCP. |

O Open WebUI não inicia processos stdio. Para usar o MCP Imposto de Renda é preciso uma
[ponte local](ponte-stdio-http.md) escutando em `127.0.0.1`. Leia o aviso de segurança daquela página
antes de continuar.

## Requisitos

- Open WebUI v0.6.31 ou superior, de preferência instalado **sem Docker** (por `pip` ou `uv`) na mesma
  máquina. Assim `127.0.0.1` do Open WebUI é o mesmo da ponte.
- Conta de administrador no Open WebUI.
- Node.js 22 (para a ponte supergateway) ou `uv` (para mcpo).

## Caminho 1: MCP nativo com supergateway (recomendado)

1. Inicie a ponte (detalhes em [ponte-stdio-http.md](ponte-stdio-http.md#opção-a-supergateway-nodejs)):

   ```sh
   export IR_MCP_TOKEN="$(openssl rand -hex 32)"
   npx -y supergateway \
     --stdio "npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026 --somente-leitura" \
     --outputTransport streamableHttp \
     --host 127.0.0.1 --port 8765 \
     --apiKey "$IR_MCP_TOKEN"
   ```

   A partir do código, troque o `--stdio` por
   `"node /Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js --dir /Users/voce/Documentos/IR-2026 --somente-leitura"`.

2. No Open WebUI, abra **Settings > Admin > Integrations**.
3. Em **External Tool Servers**, clique em **+ Add Connection**.
4. Em **Type**, escolha **MCP (Streamable HTTP)** (não **OpenAPI**).
5. URL: `http://127.0.0.1:8765/mcp`. Autenticação: Bearer, com o valor de `IR_MCP_TOKEN`.
6. Salve e, em **Access Control**, restrinja a conexão ao seu usuário.

## Caminho 2: mcpo (OpenAPI)

```sh
uvx mcpo --host 127.0.0.1 --port 8765 --api-key "$IR_MCP_TOKEN" -- \
  npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026 --somente-leitura
```

O mcpo escuta em `0.0.0.0` se você não passar `--host`; mantenha `127.0.0.1`. Depois, em
**Settings > Admin > Integrations > External Tool Servers**, adicione uma conexão do tipo **OpenAPI**
com a URL `http://127.0.0.1:8765` e a chave. A documentação das ferramentas fica em
`http://127.0.0.1:8765/docs`.

O mcpo expõe só as ferramentas; prompts e o recurso `aviso-legal` não passam pela ponte OpenAPI.

## Se o Open WebUI roda em Docker

Dentro do contêiner, `127.0.0.1` é o próprio contêiner. Não troque a ponte para `0.0.0.0`. No Linux,
rode o contêiner com `--network=host`, para que ele enxergue o `127.0.0.1` da máquina. Em outros
sistemas, prefira instalar o Open WebUI sem Docker para este uso.

## Como verificar

- Num chat novo, abra o menu de integrações e ative o servidor.
- Peça a lista de arquivos da pasta autorizada.
- `lsof -nP -iTCP:8765 -sTCP:LISTEN` deve mostrar `127.0.0.1:8765`.

## Modo somente leitura

Já está nos exemplos. Para permitir gravações, retire `--somente-leitura` do comando da ponte e
reinicie a ponte; confira as chamadas antes de aprovar.

## Limitações

- O Open WebUI pode estar ligado a modelos locais (Ollama) ou de nuvem. Com nuvem, as respostas das
  ferramentas vão ao provedor.
- A ponte precisa estar rodando sempre que você usar o servidor. Encerre-a ao terminar.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| A interface fica travada depois de adicionar a conexão | Tipo errado (OpenAPI no lugar de MCP). Desative a conexão em **Settings > Admin > Integrations** e adicione de novo com **MCP (Streamable HTTP)**. |
| **External Tool Servers** acinzentado | A variável `ENABLE_TOOL_SERVERS` está `False` na instalação. |
| Conexão recusada | A ponte não está rodando ou o Open WebUI está em Docker sem acesso ao `127.0.0.1` da máquina. |
| 401 | Chave diferente entre a ponte e a conexão. |

## Prompts para começar

> Use as ferramentas do MCP Imposto de Renda para abrir o DBK da pasta autorizada e me mostrar um
> resumo da declaração 2026.

> Com o MCP Imposto de Renda, simule o imposto e compare os modelos completo e simplificado.

## Fontes

- https://docs.openwebui.com/features/extensibility/mcp (consultado em 14/10/2026)
- https://docs.openwebui.com/features/extensibility/plugin/tools/openapi-servers/mcp (consultado em 14/10/2026)
- https://github.com/open-webui/mcpo (README e código consultados em 14/10/2026)
- https://github.com/supercorp-ai/supergateway (README consultado em 14/10/2026)
