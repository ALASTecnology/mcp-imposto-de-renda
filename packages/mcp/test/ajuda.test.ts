/** obter_ajuda: tópicos gerados das notas de mapeamento e busca por identificador ou palavras. */
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buscarAjuda, TOPICOS_AJUDA } from "../src/ajuda/index.js";
import { type Conexao, conectar, textoDe } from "./apoio.js";

let c: Conexao;
beforeAll(async () => {
  c = await conectar();
});
afterAll(async () => {
  await c.fechar();
});

describe("tópicos de ajuda", () => {
  it("os dados embarcados são a saída atual do gerador", () => {
    const raiz = fileURLToPath(new URL("../../../", import.meta.url));
    const saida = execFileSync(
      process.execPath,
      ["tools/mapeamento/gera_ajuda.mjs", "--verificar"],
      {
        cwd: raiz,
        encoding: "utf8",
      },
    );
    expect(saida).toMatch(/^ok: \d+ tópicos/);
    expect(TOPICOS_AJUDA.length).toBeGreaterThan(300);
  });

  it("não levam o planejamento interno das notas", () => {
    expect(TOPICOS_AJUDA.some((t) => t.itens.some((i) => i.campo === "Exige do MCP"))).toBe(false);
  });

  it("busca por identificador exato e por palavras sem acento", () => {
    expect(buscarAjuda("f-ident").map((t) => t.id)).toEqual(["F-IDENT"]);
    const medicas = buscarAjuda("despesas medicas", 5).map((t) => t.nome.toLowerCase());
    expect(medicas.some((n) => n.includes("médic") || n.includes("pagamentos"))).toBe(true);
    expect(buscarAjuda("de a o")).toEqual([]);
  });
});

describe("obter_ajuda", () => {
  it("devolve a ficha pedida e lista por prefixo", async () => {
    const r = await c.chamar("obter_ajuda", { consulta: "F-IDENT" });
    expect(r.isError, textoDe(r)).toBeFalsy();
    expect(textoDe(r)).toMatch(/^## F-IDENT /);
    const l = await c.chamar("obter_ajuda", { prefixo: "F-DEP" });
    const lista = (l.structuredContent as { lista: { id: string }[] }).lista;
    expect(lista.length).toBeGreaterThan(0);
    expect(lista.every((t) => t.id.startsWith("F-DEP"))).toBe(true);
    const nada = await c.chamar("obter_ajuda", { consulta: "zzzz qqqq" });
    expect(textoDe(nada)).toMatch(/Nenhum tópico/);
  });
});
