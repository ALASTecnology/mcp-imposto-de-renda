/**
 * Confere o verificador de tabelas e aplica-o à referência gerada em docs/ferramentas/.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { celulas, tabelasDesalinhadas } from "./markdown.mjs";

const REFERENCIA = fileURLToPath(new URL("../../docs/ferramentas/", import.meta.url));

describe("tabelas Markdown", () => {
  it("barra escapada não separa células", () => {
    expect(celulas('| `a` | `"x"` \\| `"y"` | sim |')).toHaveLength(3);
  });

  it("acusa a linha com coluna a mais", () => {
    const texto = ["| A | B |", "| --- | --- |", "| 1 | 2 |", "| 1 | 2 \\\\| 3 |"].join("\n");
    expect(tabelasDesalinhadas(texto)).toEqual([{ linha: 4, esperado: 2, achado: 3 }]);
  });

  it("ignora tabelas dentro de blocos de código", () => {
    const texto = ["```", "| A | B |", "| --- | --- |", "| 1 | 2 | 3 |", "```"].join("\n");
    expect(tabelasDesalinhadas(texto)).toEqual([]);
  });

  it("todas as tabelas de docs/ferramentas têm as colunas do cabeçalho", () => {
    const erros = readdirSync(REFERENCIA)
      .filter((n) => n.endsWith(".md"))
      .flatMap((n) =>
        tabelasDesalinhadas(readFileSync(join(REFERENCIA, n), "utf8")).map(
          (p) => `${n}:${p.linha} esperava ${p.esperado} colunas, achou ${p.achado}`,
        ),
      );
    expect(erros).toEqual([]);
  });
});
