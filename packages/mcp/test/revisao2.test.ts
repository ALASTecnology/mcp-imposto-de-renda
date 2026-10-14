/**
 * Regressões da revisão 2: cada bloco reproduz um defeito comprovado e confere a correção.
 */
import { mkdirSync, mkdtempSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
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

// Usado nos blocos seguintes.
void readdirSync;
