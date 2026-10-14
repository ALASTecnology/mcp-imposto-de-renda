/**
 * Recursos MCP: textos fixos que o cliente pode ler e mostrar ao usuário.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const URI_AVISO_LEGAL = "autoir://aviso-legal";

export const AVISO_LEGAL = `# Aviso legal do AutoIR

1. **Não é serviço oficial.** O AutoIR é software livre (AGPL-3.0-only), sem vínculo com a Receita
   Federal nem com qualquer órgão público. Ele não transmite declarações e não acessa sistemas do
   governo.
2. **Seus dados vão para o provedor de LLM que você escolheu.** O AutoIR roda só na sua máquina e
   não envia nada pela rede. Porém tudo o que as ferramentas devolvem (nomes, CPFs, rendimentos,
   bens, valores) chega ao modelo de linguagem configurado no seu cliente MCP e, portanto, ao
   provedor desse modelo. Leia a política de privacidade dele e decida o que compartilhar.
3. **Revise e transmita pelo programa oficial.** Cálculos, conversões e validações do AutoIR podem
   divergir do programa da Receita Federal. Abra o arquivo no programa oficial (PGD), confira cada
   ficha e transmita por ele. A responsabilidade pela declaração é sempre do contribuinte.
4. **Acesso ao disco restrito.** O AutoIR só lê e grava arquivos dentro da pasta autorizada
   (\`--dir\`). Antes de sobrescrever um arquivo, guarda uma cópia em \`.autoir-backups\`.
`;

export function registrarRecursos(server: McpServer): void {
  server.registerResource(
    "aviso_legal",
    URI_AVISO_LEGAL,
    {
      title: "Aviso legal do AutoIR",
      description:
        "Limites do AutoIR: não é serviço oficial, dados vão ao provedor de LLM do usuário, revisar e transmitir pelo programa oficial.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [{ uri: uri.href, mimeType: "text/markdown", text: AVISO_LEGAL }],
    }),
  );
}
