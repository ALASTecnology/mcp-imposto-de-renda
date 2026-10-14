# AutoIR

Servidor [MCP](https://modelcontextprotocol.io) 100% local para apoiar o preenchimento da
declaração de Imposto de Renda da Pessoa Física (IRPF) brasileira.

O AutoIR roda na sua máquina, conversa com o seu cliente MCP via stdio e não depende de nenhum
servidor remoto. Ele não transmite declarações e não acessa sistemas do governo.

> **Aviso importante**
>
> - O AutoIR **não é serviço oficial da Receita Federal** e não tem vínculo com ela nem com
>   qualquer órgão público. Confira tudo no programa oficial antes de transmitir a declaração.
> - O AutoIR não envia dados para lugar nenhum. Porém, tudo o que ele devolve ao seu cliente MCP
>   (valores, nomes, CPFs, rendimentos) **vai para o provedor de LLM que você escolheu** no seu
>   cliente. Leia a política de privacidade desse provedor e decida o que compartilhar.
> - Não há garantia de exatidão. A responsabilidade pela declaração é sempre do contribuinte.

## Estado

Fase inicial. Hoje existe apenas a estrutura do projeto e uma tool de exemplo:

| Tool | O que faz |
| --- | --- |
| `validar_documento` | Confere os dígitos verificadores de um CPF ou CNPJ (sem consultar situação cadastral). |

Planejado: leitura e escrita do arquivo da declaração (DBK), modelo tipado das fichas, motor de
cálculo próprio (simplificado e completo) e validações. Veja `CONTEXT.md` para o vocabulário e
`docs/adr/` para as decisões de arquitetura.

## Estrutura

```
packages/core   @autoir/core   modelo, codec DBK, cálculo e validação (sem I/O de rede)
packages/mcp    @autoir/mcp    createServer(): registra as tools MCP usando o core
apps/cli        autoir-mcp     executável stdio que sobe o servidor
```

## Requisitos

- Node.js 22 ou superior
- pnpm 12 (via `corepack enable`, se preferir)

## Desenvolvimento

```sh
pnpm install
pnpm lint        # biome
pnpm typecheck   # tsc em todos os pacotes
pnpm test        # vitest
pnpm build       # tsup
```

## Uso com um cliente MCP

Depois do build, configure o seu cliente MCP para executar o servidor via stdio. O formato exato
varia por cliente; em geral é algo como:

```json
{
  "mcpServers": {
    "autoir": {
      "command": "node",
      "args": ["/caminho/para/AutoIR/apps/cli/dist/index.js", "--dir", "/caminho/da/pasta/do-ir"]
    }
  }
}
```

`--dir` indica a única pasta que o AutoIR poderá ler e gravar (por enquanto o argumento é apenas
validado).

## Licença

[AGPL-3.0-only](LICENSE). Veja `docs/adr/0003-licenca-agpl.md` para o motivo da escolha.
