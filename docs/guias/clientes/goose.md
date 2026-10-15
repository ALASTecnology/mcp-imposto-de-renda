# goose

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local (extensão de linha de comando) | Completo | Gratuito e de código aberto; você escolhe o provedor de modelo, inclusive local (Ollama). |

O goose (hoje mantido pela Agentic AI Foundation) chama servidores MCP de **extensões**. Tem aplicativo
de desktop e CLI, que compartilham o mesmo arquivo de configuração.

## Onde fica a configuração

| Sistema | Arquivo |
| --- | --- |
| macOS e Linux | `~/.config/goose/config.yaml` |
| Windows | `%APPDATA%\Block\goose\config\config.yaml` |

## Configuração

```yaml
extensions:
  mcp-imposto-de-renda:
    name: mcp-imposto-de-renda
    type: stdio
    cmd: npx
    args: ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026"]
    enabled: true
    envs: {}
    timeout: 300
```

A partir do código:

```yaml
extensions:
  mcp-imposto-de-renda:
    name: mcp-imposto-de-renda
    type: stdio
    cmd: node
    args: ["/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js", "--dir", "/Users/voce/Documentos/IR-2026"]
    enabled: true
    envs: {}
    timeout: 300
```

## Passo a passo pela interface

goose Desktop:

1. Abra a barra lateral e clique em **Extensions**.
2. Clique em **Add custom extension**.
3. Em **Type**, escolha **Standard IO**; em **ID** e **Name**, `mcp-imposto-de-renda`; em
   **Command**, `npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026`.
4. Ajuste **Timeout** se quiser e clique em **Add**.

goose CLI:

```text
goose configure
  > Add Extension
  > Command-line Extension
  > nome: mcp-imposto-de-renda
  > comando: npx -y mcp-imposto-de-renda --dir /Users/voce/Documentos/IR-2026
```

## Como verificar

Na tela **Extensions** o interruptor do `mcp-imposto-de-renda` fica ligado. Numa sessão nova, peça a
lista de arquivos da pasta autorizada.

## Modo somente leitura

Acrescente `--somente-leitura` ao fim do comando (ou de `args`).

## Limitações

- Revise as permissões de ferramentas do goose: no modo autônomo ele executa ferramentas sem
  perguntar. Para este servidor, use um modo que peça aprovação.
- Com modelos locais pequenos, reduza a lista de ferramentas com `--perfil essencial` (86, ainda
  grava) ou `--perfil consulta` (40, só leitura). Veja os
  [perfis](../clientes-mcp.md#quantidade-de-ferramentas).
- Se o modelo for local (por exemplo via Ollama), a declaração não sai da sua máquina.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| Extensão não inicia | Rode o comando no terminal; o goose mostra o erro da extensão na sessão. |
| Caminho com espaço no campo **Command** | Edite o `config.yaml` e use a lista `args`, um item por argumento. |

## Prompts para começar

> Use a extensão mcp-imposto-de-renda para criar minha declaração 2026 a partir destes informes.
> Peça minha aprovação antes de qualquer ferramenta que grave no DBK.

## Fontes

- https://goose-docs.ai/docs/getting-started/using-extensions (consultado em 14/10/2026)
- https://goose-docs.ai/docs/guides/config-files (consultado em 14/10/2026)
