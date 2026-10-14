import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node22",
  // Os pacotes do workspace (privados) vão dentro do executável: o pacote publicado não
  // depende de @autoir/* no registro (revisão B7). Ficam externos só o SDK MCP e o zod.
  noExternal: [/^@autoir\//],
  sourcemap: false,
  clean: true,
  banner: { js: "#!/usr/bin/env node" },
});
