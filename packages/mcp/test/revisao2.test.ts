/**
 * Regressões da revisão 2: cada bloco reproduz um defeito comprovado e confere a correção.
 */
import { mkdirSync, mkdtempSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { abrirPastaAutorizada } from "../src/arquivos/index.js";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let pasta: string;
let c: Conexao;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "revisao2-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
  writeFileSync(join(pasta, "pj.DBK"), fixture("pj-simples-01.DBK"));
  c = await conectar({ diretorioAutorizado: pasta });
});
afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

describe("pasta sob demanda (achado 9)", () => {
  it("a falha da primeira abertura não fica em cache: a pasta criada depois passa a valer", async () => {
    const tarde = join(base, "criada-depois");
    const c2 = await conectar({ diretorioAutorizado: tarde });
    try {
      const r1 = await c2.chamar("listar_arquivos", {});
      expect(r1.isError).toBe(true);
      mkdirSync(tarde);
      writeFileSync(join(tarde, "x.DBK"), fixture("pj-simples-01.DBK"));
      const r2 = await c2.chamar("listar_arquivos", {});
      expect(r2.isError, textoDe(r2)).toBeFalsy();
      expect(textoDe(r2)).toContain("x.DBK");
    } finally {
      await c2.fechar();
    }
  });
});

describe("cópias de segurança (achado 7)", () => {
  it("listarCopias ordena da mais recente para a mais antiga, pela data e pela sequência", async () => {
    writeFileSync(join(pasta, "b.DBK"), fixture("pj-simples-01.DBK"));
    writeFileSync(join(pasta, "a.DBK"), fixture("pj-simples-01.DBK"));
    let agora = new Date("2026-01-01T00:00:00Z");
    const p = await abrirPastaAutorizada(pasta, { relogio: () => agora });
    await p.escrever("b.DBK", fixture("pj-simples-01.DBK"), [".DBK"]);
    agora = new Date("2026-06-01T00:00:00Z");
    await p.escrever("a.DBK", fixture("pj-simples-01.DBK"), [".DBK"]);
    await p.escrever("a.DBK", fixture("pj-simples-01.DBK"), [".DBK"]);
    const l = await p.listarCopias();
    expect(l.map((x) => x.copia)).toEqual([
      "a.DBK.20260601T000000Z-1.bak",
      "a.DBK.20260601T000000Z.bak",
      "b.DBK.20260101T000000Z.bak",
    ]);
    expect((await p.listarCopias("b.DBK")).map((x) => x.arquivo)).toEqual(["b.DBK"]);
  });

  it("restaurar_copia_seguranca acha a cópia original mesmo fora das 500 listadas", async () => {
    const pastaCopias = join(pasta, ".mcp-imposto-de-renda-backups");
    mkdirSync(pastaCopias, { mode: 0o700 });
    const original = "a.DBK.20250101T000000Z.bak";
    writeFileSync(join(pastaCopias, original), fixture("pj-simples-01.DBK"));
    for (let i = 0; i < 510; i++) {
      const s = String(i).padStart(3, "0");
      writeFileSync(join(pastaCopias, `z${s}.DBK.20260101T000000Z.bak`), "x");
    }
    const lista = await c.chamar("listar_copias_seguranca", {});
    const copias = (lista.structuredContent as { copias: { copia: string }[] }).copias;
    expect(copias).toHaveLength(500);
    expect(copias.some((x) => x.copia === original)).toBe(false);
    const filtrada = await c.chamar("listar_copias_seguranca", { arquivo: "a.DBK" });
    expect((filtrada.structuredContent as { copias: unknown[] }).copias).toHaveLength(1);
    const r = await c.chamar("restaurar_copia_seguranca", { copia: original });
    expect(r.isError, textoDe(r)).toBeFalsy();
    expect(readdirSync(pasta)).toContain("a.DBK");
    const nada = await c.chamar("restaurar_copia_seguranca", {
      copia: "a.DBK.20240101T000000Z.bak",
    });
    expect(nada.isError).toBe(true);
    expect(textoDe(nada)).toContain("Cópia não encontrada");
  });
});
