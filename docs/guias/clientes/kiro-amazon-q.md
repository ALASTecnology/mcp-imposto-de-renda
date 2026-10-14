# Kiro CLI (antigo Amazon Q Developer CLI)

| Transporte | Suporte | Plano |
| --- | --- | --- |
| stdio local | Completo | Conta Kiro (confira os planos em kiro.dev); usuários do Amazon Q Developer são migrados para o Kiro. |

A AWS renomeou o Amazon Q Developer CLI para **Kiro CLI**. Relatos de migração indicam que a
configuração MCP antiga é copiada para `~/.kiro/settings/mcp.json`; confira o arquivo depois de atualizar. O mesmo arquivo serve ao Kiro IDE.

## Onde fica a configuração

| Escopo | Arquivo |
| --- | --- |
| Usuário | `~/.kiro/settings/mcp.json` (`~` é a sua pasta pessoal) |
| Workspace | `.kiro/settings/mcp.json` |

Prefira o de usuário: o do workspace pode ir para o repositório e levaria o caminho da sua pasta.

## Configuração

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/Users/voce/Documentos/IR-2026"],
      "disabled": false,
      "autoApprove": []
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
      ],
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

Mantenha `autoApprove` vazio. Nunca use `"*"` neste servidor: aprovaria também as gravações.

O comando `kiro-cli mcp add --name ... --scope global --command ... --args ...` também grava a entrada,
mas editar o JSON é mais claro quando há vários argumentos.

## Como verificar

Numa sessão interativa (`kiro-cli`), digite `/mcp` para ver os servidores carregados. No Kiro IDE, o
painel de MCP mostra o estado de cada servidor.

## Modo somente leitura

Acrescente `"--somente-leitura"` ao fim de `args`. Também há `disabledTools` para esconder
ferramentas específicas.

## Limitações

- O que as ferramentas devolvem vai para o provedor de modelo usado pelo Kiro.
- O Kiro Web carrega servidores de `.kiro/settings/mcp.json` do repositório num ambiente na nuvem;
  esse ambiente não enxerga a sua pasta local, então use o CLI ou o IDE.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| Servidor não aparece em `/mcp` | Confira o JSON e se `disabled` está `false`. |
| Configuração antiga do Amazon Q ignorada | Copie a entrada para `~/.kiro/settings/mcp.json`. |
| `npx` não encontrado | Use o caminho absoluto do `node` em `command`. |

## Prompts para começar

> Use o MCP Imposto de Renda para criar minha declaração 2026 a partir destes informes. Liste a
> pasta, abra o DBK e peça minha aprovação antes de gravar.

## Fontes

- https://kiro.dev/docs/mcp/configuration (consultado em 14/10/2026)
- https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/upgrade-to-kiro.html (consultado em 14/10/2026)
