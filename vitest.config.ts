import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    // Testes usam o código-fonte dos pacotes do workspace, sem exigir build prévio.
    alias: {
      "@autoir/core": src("./packages/core/src/index.ts"),
      "@autoir/mcp": src("./packages/mcp/src/index.ts"),
    },
  },
  test: {
    include: ["packages/*/test/**/*.test.ts", "apps/*/test/**/*.test.ts"],
    environment: "node",
  },
});
