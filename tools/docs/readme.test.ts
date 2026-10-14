/**
 * Confere as contagens de ferramentas citadas no README com o catálogo do servidor, para o README
 * não envelhecer quando uma ferramenta entra, sai ou muda de perfil.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { catalogoFerramentas, GRUPOS } from "@mcp-imposto-de-renda/mcp";
import { describe, expect, it } from "vitest";

const README = readFileSync(fileURLToPath(new URL("../../README.md", import.meta.url)), "utf8");

const total = catalogoFerramentas().length;
const leitura = catalogoFerramentas({ somenteLeitura: true }).length;
const gravam = total - leitura;
const essencial = catalogoFerramentas({ perfil: "essencial" }).length;
const consulta = catalogoFerramentas({ perfil: "consulta" }).length;

/** Números capturados por uma expressão, para comparar com a lista esperada. */
function numeros(re: RegExp): number[] {
  const m = re.exec(README);
  expect(m, `README não tem o trecho ${re}`).not.toBeNull();
  return (m ?? []).slice(1).map(Number);
}

describe("contagens do README", () => {
  it("quadro de indicadores", () => {
    expect(
      numeros(
        /\*\*(\d+)\*\* em (\d+) grupos; (\d+) gravam, (\d+) com `--somente-leitura`; perfis `essencial` \((\d+)\) e `consulta` \((\d+)\)/,
      ),
    ).toEqual([total, GRUPOS.length, gravam, leitura, essencial, consulta]);
  });

  it("opções de perfil", () => {
    expect(numeros(/`--perfil essencial` \| (\d+) ferramentas/)).toEqual([essencial]);
    expect(numeros(/`--perfil consulta` \| (\d+) ferramentas/)).toEqual([consulta]);
  });

  it("catálogo resumido", () => {
    expect(numeros(/Catálogo resumido das (\d+) ferramentas/)).toEqual([total]);
    expect(
      numeros(/\*\*(\d+) ferramentas\*\* em (\d+) grupos, (\d+) delas gravam .*que deixa (\d+)\)/),
    ).toEqual([total, GRUPOS.length, gravam, leitura]);
    expect(numeros(/Mapa dos (\d+) grupos de ferramentas/)).toEqual([GRUPOS.length]);
  });

  it("tabela de grupos", () => {
    const porGrupo = new Map<string, number>();
    for (const f of catalogoFerramentas()) porGrupo.set(f.grupo, (porGrupo.get(f.grupo) ?? 0) + 1);
    for (const g of GRUPOS) {
      const re = new RegExp(
        `\\| \\[\`${g.nome}\`\\]\\(docs/ferramentas/${g.nome}\\.md\\) \\| (\\d+) \\|`,
      );
      expect(numeros(re), g.nome).toEqual([porGrupo.get(g.nome) ?? 0]);
    }
  });

  it("número de testes sem valor fixo que envelheça", () => {
    // O total muda a cada teste novo; o README usa um piso ("mais de 1.100").
    expect(README).not.toMatch(/testes-\d/);
    expect(README).not.toMatch(/\*\*[\d.]+\*\*, em Vitest/);
    expect(README).toMatch(/mais de 1\.100 testes/);
  });
});
