import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node22",
  // Na geração de tipos, resolve os pacotes do workspace pelo dist (não pelo código-fonte)
  // e silencia o aviso de baseUrl, que o tsup injeta e o TypeScript 6 marca como deprecado.
  dts: { compilerOptions: { customConditions: [], ignoreDeprecations: "6.0" } },
  sourcemap: true,
  clean: true,
});
