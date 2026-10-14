# Zed

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo (ferramentas e prompts; recursos não) | Gratuito com chave própria de provedor, ou plano do Zed para usar os modelos hospedados. |

O Zed chama servidores MCP de *context servers* e os configura no `settings.json` do editor.

## Requisitos

- Zed atualizado (as permissões de ferramenta descritas abaixo valem a partir da v0.224.0).
- Node.js 22 ou superior.
- Pasta da declaração criada ([instalação](../instalacao.md)).

## Onde fica a configuração

| Sistema | Arquivo |
| --- | --- |
| macOS e Linux | `~/.config/zed/settings.json` |
| Windows | `settings.json` na pasta do Zed dentro do seu perfil de usuário |

Abra pelo próprio Zed (comando `zed: open settings`) para não errar o caminho; a documentação
consultada não fixa o caminho do Windows.

## Configuração

```json
{
  "context_servers": {
    "mcp-imposto-de-renda": {
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026"],
      "env": {}
    }
  }
}
```

A partir do código:

```json
{
  "context_servers": {
    "mcp-imposto-de-renda": {
      "command": "node",
      "args": [
        "/Users/voce/src/mcp-imposto-de-renda/apps/cli/dist/index.js",
        "--dir",
        "/Users/voce/Documentos/IR-2026"
      ],
      "env": {}
    }
  }
}
```

Mantenha a confirmação de ferramentas (padrão):

```json
{
  "agent": {
    "tool_permissions": { "default": "confirm" }
  }
}
```

## Passo a passo pela interface

1. Abra **Settings > AI > MCP Servers** (ou a ação `agent: open settings` e depois **MCP Servers**).
2. Clique em **Add Server** e escolha a opção de servidor personalizado.
3. Cole a configuração e salve.

## Como verificar

Em **Settings > AI > MCP Servers**, o ponto ao lado do nome fica verde com a dica "Server is active".
No painel do agente, cite o servidor pelo nome para o modelo escolher as ferramentas certas.

## Modo somente leitura

Acrescente `"--somente-leitura"` ao fim de `args`. Para restringir ainda mais, crie um perfil de agente
que só habilite as ferramentas do `mcp-imposto-de-renda` e desligue as ferramentas de edição do editor.

## Limitações

- O Zed suporta ferramentas e prompts MCP, mas não recursos: o `mcp-imposto-de-renda://aviso-legal`
  não aparece. O conteúdo está no [README](../../../README.md#segurança-e-privacidade).
- Quão bem cada modelo chama ferramentas varia; mencionar o servidor pelo nome ajuda.
- O que as ferramentas devolvem vai para o provedor do modelo escolhido.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| Ponto vermelho ou amarelo | Passe o mouse para ler a mensagem e rode o comando no terminal. |
| `npx` não encontrado | Use o caminho absoluto do `node` em `command`. |
| O agente ignora o servidor | Peça explicitamente "use o MCP Imposto de Renda" ou crie um perfil só com as ferramentas dele. |

## Prompts para começar

> Use as ferramentas do mcp-imposto-de-renda para criar minha declaração 2026 a partir destes informes.
> Liste a pasta, abra o DBK e proponha as inclusões antes de gravar.

> Com o mcp-imposto-de-renda, simule o imposto e explique cada dedução considerada.

## Fontes

- https://zed.dev/docs/ai/mcp (consultado em 14/10/2026)
- https://zed.dev/docs/configuring-zed (consultado em 14/10/2026)
