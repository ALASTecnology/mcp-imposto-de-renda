/**
 * A ajuda conta as ferramentas de cada perfil, o que custa montar o catálogo. Isso só pode
 * acontecer quando a ajuda é pedida, e uma vez só: nunca no carregamento do módulo nem a cada start.
 */
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it, vi } from "vitest";

const contagem = vi.hoisted(() => ({ chamadas: 0 }));
vi.mock("@mcp-imposto-de-renda/mcp", async (original) => {
  const real = await original<typeof import("@mcp-imposto-de-renda/mcp")>();
  return {
    ...real,
    catalogoFerramentas: (...a: Parameters<typeof real.catalogoFerramentas>) => {
      contagem.chamadas++;
      return real.catalogoFerramentas(...a);
    },
  };
});

const { ajuda, interpretarArgs } = await import("../src/args.js");
const pasta = mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-ajuda-"));
afterAll(() => rmSync(pasta, { recursive: true, force: true }));

describe("ajuda preguiçosa", () => {
  it("não monta o catálogo ao carregar o módulo nem ao interpretar os argumentos", () => {
    expect(interpretarArgs(["--dir", pasta, "--perfil", "essencial"], pasta, {}).acao).toBe(
      "iniciar",
    );
    expect(contagem.chamadas).toBe(0);
  });

  it("monta uma vez só, na primeira vez que a ajuda é pedida", () => {
    const texto = ajuda();
    const depois = contagem.chamadas;
    expect(depois).toBeGreaterThan(0);
    expect(ajuda()).toBe(texto);
    expect(contagem.chamadas).toBe(depois);
  });
});
