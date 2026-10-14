import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (p: string): string => fileURLToPath(new URL(p, import.meta.url));
// O SDK MCP é dependência de packages/mcp: os exemplos o resolvem a partir dele (o pnpm não o
// eleva à raiz).
const sdk = dirname(
  createRequire(src("./packages/mcp/package.json")).resolve(
    "@modelcontextprotocol/sdk/server/mcp.js",
  ),
);

export default defineConfig({
  resolve: {
    // Testes usam o código-fonte dos pacotes do workspace, sem exigir build prévio.
    alias: [
      { find: "@mcp-imposto-de-renda/core", replacement: src("./packages/core/src/index.ts") },
      { find: "@mcp-imposto-de-renda/mcp", replacement: src("./packages/mcp/src/index.ts") },
      { find: /^@modelcontextprotocol\/sdk\/(.*)$/, replacement: `${dirname(sdk)}/$1` },
    ],
  },
  test: {
    include: ["packages/*/test/**/*.test.ts", "apps/*/test/**/*.test.ts", "exemplos/**/*.test.ts"],
    environment: "node",
  },
});
