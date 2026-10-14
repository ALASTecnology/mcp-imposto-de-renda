/**
 * Configuração do Vitest só para gerar o catálogo de ferramentas (pnpm docs:catalogo): sobe o
 * servidor a partir do código-fonte e grava o resultado de tools/list em saida/ferramentas.json.
 */
import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const raiz = (p: string): string => fileURLToPath(new URL(`../../${p}`, import.meta.url));
// O SDK MCP é dependência de packages/mcp: resolve a partir dele (o pnpm não o eleva à raiz).
const sdk = dirname(
  createRequire(raiz("packages/mcp/package.json")).resolve(
    "@modelcontextprotocol/sdk/server/mcp.js",
  ),
);

export default defineConfig({
  resolve: {
    alias: [
      { find: "@mcp-imposto-de-renda/core", replacement: raiz("packages/core/src/index.ts") },
      { find: "@mcp-imposto-de-renda/mcp", replacement: raiz("packages/mcp/src/index.ts") },
      { find: /^@modelcontextprotocol\/sdk\/(.*)$/, replacement: `${dirname(sdk)}/$1` },
    ],
  },
  test: {
    root: fileURLToPath(new URL(".", import.meta.url)),
    include: ["listar.test.ts", "exemplos.test.ts", "markdown.test.ts", "readme.test.ts"],
    environment: "node",
    // listar.test.ts sobe um servidor por grupo; em máquina carregada (CI) passa dos 5 s padrão.
    testTimeout: 60_000,
  },
});
