/**
 * Varredura estática: nenhum valor monetário do cálculo passa por ponto flutuante.
 *
 * O dinheiro do MCP Imposto de Renda é `bigint` de centavos (`Centavos`). Este teste lê o código de
 * `src/calc/**` e `src/centavos.ts`, remove comentários e o texto fixo das strings (as
 * expressões dentro de `${...}` continuam sendo examinadas) e procura construções que
 * levam a float: `parseFloat`, `toFixed`, `Math.round`, literais decimais e afins.
 *
 * `Number(...)` e `Math.floor` têm usos legítimos fora do dinheiro (dia, mês e ano das
 * datas; número do exercício; quantidade de quotas). Cada uso permitido está listado com
 * o motivo; qualquer uso novo faz o teste falhar até ser revisado e incluído aqui.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { somenteCodigo } from "./apoio.js";

const SRC = fileURLToPath(new URL("../../src/", import.meta.url));

function arquivosTs(pasta: string): string[] {
  return readdirSync(pasta).flatMap((n) => {
    const p = join(pasta, n);
    return statSync(p).isDirectory() ? arquivosTs(p) : p.endsWith(".ts") ? [p] : [];
  });
}

/** Construções proibidas em qualquer lugar do cálculo. */
const PROIBIDOS: [string, RegExp][] = [
  ["parseFloat", /\bparseFloat\b/],
  ["parseInt", /\bparseInt\b/],
  ["toFixed", /\.toFixed\s*\(/],
  ["toPrecision", /\.toPrecision\s*\(/],
  ["Math.round/ceil/trunc/pow", /\bMath\.(round|ceil|trunc|pow|fround)\b/],
  ["literal decimal", /(?<![\w.])\d+\.\d+(?!\w)/],
  ["divisão por literal sem n", /\/\s*\d+(?![\dn])\b/],
  ["Number.parseFloat/EPSILON", /\bNumber\.(parseFloat|parseInt|EPSILON)\b/],
];

/** Usos permitidos de `Number(` e `Math.floor`, por arquivo, com o motivo. */
const PERMITIDOS: Record<string, { Number: number; "Math.floor": number; motivo: string }> = {
  "calc/datas.ts": { Number: 6, "Math.floor": 1, motivo: "dia, mês, ano e índice do mês" },
  "calc/index.ts": { Number: 1, "Math.floor": 0, motivo: "número do exercício" },
  "calc/ganho-capital-cambio.ts": {
    Number: 1,
    "Math.floor": 0,
    motivo: "mês da operação com moeda em espécie",
  },
  "calc/2026/quotas.ts": {
    Number: 1,
    "Math.floor": 0,
    motivo: "quantidade máxima de quotas, após divisão inteira de bigint",
  },
};

const arquivos = [...arquivosTs(join(SRC, "calc")), join(SRC, "centavos.ts")];

describe("cálculo sem ponto flutuante", () => {
  it("o removedor de comentários e strings preserva o código e as expressões de template", () => {
    // O placeholder do template é montado por partes para não ser lido como um.
    const fonte = `const a = "1.5"; // 2.5\n/* 3.5 */ const b = \`x $${"{"}Number(c)} 4.5\`;`;
    const codigo = somenteCodigo(fonte);
    expect(codigo).not.toMatch(/\d\.\d/);
    expect(codigo).toContain("Number(c)");
    expect(codigo.split("\n")).toHaveLength(2);
  });

  it("nenhum arquivo do cálculo usa construções de float", () => {
    expect(arquivos.length).toBeGreaterThan(5);
    const achados: string[] = [];
    for (const arquivo of arquivos) {
      const linhas = somenteCodigo(readFileSync(arquivo, "utf8")).split("\n");
      linhas.forEach((linha, i) => {
        for (const [nome, re] of PROIBIDOS) {
          // Divisão de number dentro de Math.floor (índice do mês) é inteira e já é contada
          // no teste dos usos permitidos.
          if (nome.startsWith("divisão") && /\bMath\.floor\(/.test(linha)) continue;
          if (re.test(linha)) achados.push(`${relative(SRC, arquivo)}:${i + 1}: ${nome}`);
        }
      });
    }
    expect(achados).toEqual([]);
  });

  it("Number( e Math.floor só aparecem nos usos revisados", () => {
    const encontrados: Record<string, { Number: number; "Math.floor": number }> = {};
    for (const arquivo of arquivos) {
      const codigo = somenteCodigo(readFileSync(arquivo, "utf8"));
      const n = (codigo.match(/\bNumber\b(?!\.isSafeInteger|\.isInteger)/g) ?? []).length;
      const f = (codigo.match(/\bMath\.floor\b/g) ?? []).length;
      if (n + f > 0) encontrados[relative(SRC, arquivo)] = { Number: n, "Math.floor": f };
    }
    const esperados = Object.fromEntries(
      Object.entries(PERMITIDOS).map(([k, v]) => [
        k,
        { Number: v.Number, "Math.floor": v["Math.floor"] },
      ]),
    );
    expect(encontrados).toEqual(esperados);
  });
});
