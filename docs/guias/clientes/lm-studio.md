# LM Studio

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo (desde a versão 0.3.17) | Gratuito. O modelo roda na sua máquina. |

O LM Studio é a forma mais simples de usar o MCP Imposto de Renda **sem enviar a declaração a nenhum
provedor de nuvem**: o modelo e o servidor rodam localmente.

## Requisitos

- LM Studio 0.3.17 ou superior.
- Um modelo com suporte a chamada de ferramentas e janela de contexto grande (32 mil tokens ou mais).
- Node.js 22 ou superior e a pasta da declaração ([instalação](../instalacao.md)).

## Onde fica a configuração

O arquivo `mcp.json` do aplicativo, aberto pela interface: aba **Program** na barra lateral direita,
**Install > Edit mcp.json**. Ele usa a mesma notação do Cursor.

## Configuração

Recomendado para modelos locais (perfil `consulta`, só leitura e cálculo):

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026", "--perfil", "consulta"]
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
        "--perfil",
        "consulta"
      ]
    }
  }
}
```

## Passo a passo pela interface

1. Abra a aba **Program** na barra lateral direita.
2. Clique em **Install > Edit mcp.json**.
3. Cole a entrada dentro de `mcpServers` e salve.
4. Ative o servidor e, no chat, carregue um modelo com suporte a ferramentas.

## Como verificar

Na aba **Program**, o `mcp-imposto-de-renda` aparece com as ferramentas. No chat, peça a lista de
arquivos da pasta: o LM Studio mostra a chamada e pede confirmação.

## Modo somente leitura

Já está nos exemplos: o perfil `consulta` não registra nenhuma ferramenta que grave. Para gravar,
troque por `--perfil essencial` e confirme cada chamada.

## Limitações

- A própria documentação do LM Studio avisa que servidores pensados para modelos de nuvem podem
  gastar muitos tokens e estourar o contexto de modelos locais. Com 162 ferramentas, o servidor
  completo dificilmente cabe; o perfil `consulta` tem 40 e o `essencial`, 86 (veja os
  [perfis](../clientes-mcp.md#quantidade-de-ferramentas)).
- Modelos pequenos erram mais argumentos de ferramenta. Confira os valores antes de aprovar uma
  gravação e simule sempre antes de gravar.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| Estouro de contexto | Use `--perfil consulta` (ou `essencial` para gravar), um modelo com contexto maior ou aumente o contexto na configuração do modelo. |
| O modelo não chama ferramentas | Escolha um modelo marcado com suporte a ferramentas (tool use). |
| `npx` não encontrado | Use o caminho absoluto do `node` em `command`. |

## Prompts para começar

> Use o MCP Imposto de Renda. Liste os arquivos da pasta autorizada e abra o DBK da declaração 2026.

> Com o MCP Imposto de Renda, simule o imposto nos dois modelos e mostre só o resultado final.

Prompts curtos e diretos funcionam melhor com modelos locais.

## Fontes

- https://lmstudio.ai/docs/app/mcp (consultado em 14/10/2026)
