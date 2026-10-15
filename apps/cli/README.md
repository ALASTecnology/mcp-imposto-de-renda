# MCP Imposto de Renda

Servidor MCP local para a declaração do Imposto de Renda Pessoa Física (IRPF 2026). Ele lê, preenche, valida, calcula e grava o arquivo da declaração (`.DBK` e `.DEC`) no formato do programa oficial, com o cálculo conferido ao centavo contra casos de referência gerados pelo próprio programa.

> **Projeto independente, não oficial.** Não é um serviço da Receita Federal e não transmite declarações. Você revisa e transmite pelo programa oficial. Os dados ficam no seu computador; o que você enviar na conversa vai para o provedor de IA que você escolheu no seu cliente MCP.

## Uso rápido

Requer Node.js 22 ou superior.

```sh
npx -y mcp-imposto-de-renda --dir /caminho/da/pasta/do/IR-2026
```

O servidor só lê e grava dentro da pasta indicada em `--dir`, sempre com cópia de segurança e escrita atômica.

### Exemplo de configuração (formato `mcpServers`)

```json
{
  "mcpServers": {
    "imposto-de-renda": {
      "command": "npx",
      "args": ["-y", "mcp-imposto-de-renda", "--dir", "/caminho/da/pasta/do/IR-2026"]
    }
  }
}
```

## Opções

| Opção | Efeito |
| --- | --- |
| `--dir <pasta>` | Pasta autorizada (obrigatória para ler e gravar declarações) |
| `--perfil completo\|essencial\|consulta` | Quantas ferramentas expor. Use `essencial` em clientes com limite de ferramentas e `consulta` para só simular e validar |
| `--grupos a,b` / `--sem-grupos x,y` | Liga ou desliga grupos de ferramentas |
| `--somente-leitura` | Remove todas as ferramentas que gravam |
| `--ajuda` / `--versao` | Ajuda e versão |

## Documentação

Guias de conexão com cada cliente MCP, referência completa das ferramentas, arquitetura, exemplos e política de segurança:
https://github.com/ALASTecnology/mcp-imposto-de-renda

## Licença

AGPL-3.0-only.
