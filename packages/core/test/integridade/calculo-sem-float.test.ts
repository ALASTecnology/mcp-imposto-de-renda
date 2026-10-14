/**
 * Varredura estática: nenhum valor monetário do cálculo passa por ponto flutuante.
 *
 * O dinheiro do AutoIR é `bigint` de centavos (`Centavos`). Este teste lê o código de
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

const SRC = fileURLToPath(new URL("../../src/", import.meta.url));

function arquivosTs(pasta: string): string[] {
  return readdirSync(pasta).flatMap((n) => {
    const p = join(pasta, n);
    return statSync(p).isDirectory() ? arquivosTs(p) : p.endsWith(".ts") ? [p] : [];
  });
}

/**
 * Remove comentários e o conteúdo literal de strings e templates, preservando as quebras de
 * linha (para os números de linha) e as expressões `${...}` dos templates.
 */
export function somenteCodigo(fonte: string): string {
  let saida = "";
  let i = 0;
  const pilhaTemplate: number[] = [];
  let chaves = 0;
  const pular = (fim: number) => {
    saida += fonte.slice(i, fim).replace(/[^\n]/g, " ");
    i = fim;
  };
  while (i < fonte.length) {
    const c = fonte[i];
    const d = fonte[i + 1];
    if (c === "/" && d === "/") {
      const fim = fonte.indexOf("\n", i);
      pular(fim < 0 ? fonte.length : fim);
    } else if (c === "/" && d === "*") {
      const fim = fonte.indexOf("*/", i + 2);
      pular(fim < 0 ? fonte.length : fim + 2);
    } else if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < fonte.length && fonte[j] !== c) j += fonte[j] === "\\" ? 2 : 1;
      saida += c;
      i++;
      pular(j);
      saida += c;
      i = j + 1;
    } else if (c === "`" || (c === "}" && pilhaTemplate.at(-1) === chaves)) {
      // Início de template ou volta de uma expressão `${...}`: pula o texto até `${` ou "`".
      if (c === "}") pilhaTemplate.pop();
      saida += c;
      i++;
      let j = i;
      while (j < fonte.length && fonte[j] !== "`" && !(fonte[j] === "$" && fonte[j + 1] === "{")) {
        j += fonte[j] === "\\" ? 2 : 1;
      }
      pular(j);
      if (fonte[j] === "$") {
        saida += "${";
        i = j + 2;
        pilhaTemplate.push(chaves);
      } else {
        saida += "`";
        i = j + 1;
      }
    } else {
      if (c === "{") chaves++;
      if (c === "}") chaves--;
      saida += c;
      i++;
    }
  }
  return saida;
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
