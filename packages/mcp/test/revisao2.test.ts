/**
 * Regressões da revisão 2: cada bloco reproduz um defeito comprovado e confere a correção.
 */
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
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

describe("temporários interrompidos (achado 8)", () => {
  const tmp = ".mcp-imposto-de-renda-00000000-0000-0000-0000-000000000000.tmp";

  it("apaga os temporários da raiz e das subpastas na abertura", async () => {
    mkdirSync(join(pasta, "2026", "fundo"), { recursive: true });
    writeFileSync(join(pasta, tmp), "dados pessoais");
    writeFileSync(join(pasta, "2026", tmp), "dados pessoais");
    writeFileSync(join(pasta, "2026", "fundo", tmp), "dados pessoais");
    writeFileSync(join(pasta, "2026", "mantido.txt"), "fica");
    await abrirPastaAutorizada(pasta);
    expect(readdirSync(pasta)).not.toContain(tmp);
    expect(readdirSync(join(pasta, "2026")).sort()).toEqual(["fundo", "mantido.txt"]);
    expect(readdirSync(join(pasta, "2026", "fundo"))).toEqual([]);
  });

  it("não segue link simbólico para pasta de fora nem passa do limite de profundidade", async () => {
    const fora = join(base, "fora");
    mkdirSync(fora);
    writeFileSync(join(fora, tmp), "de fora");
    symlinkSync(fora, join(pasta, "atalho"));
    const fundo = join(pasta, ...Array.from({ length: 10 }, (_, i) => `n${i}`));
    mkdirSync(fundo, { recursive: true });
    writeFileSync(join(fundo, tmp), "fundo demais");
    await abrirPastaAutorizada(pasta);
    expect(readdirSync(fora)).toContain(tmp);
    expect(readdirSync(fundo)).toContain(tmp);
  });
});

describe("cancelamento (achado 6)", () => {
  it("a gravação cancelada antes do rename desiste sem gravar", async () => {
    const p = await abrirPastaAutorizada(pasta);
    const original = readFileSync(join(pasta, "pj.DBK"));
    const controle = new AbortController();
    const tentativa = p.transacao(
      ["pj.DBK"],
      async () => {
        const lido = await p.ler("pj.DBK", [".DBK"]);
        return p.escrever("pj.DBK", lido.slice(0, 10), [".DBK"], {
          antesDeRenomear: () => controle.abort(),
        });
      },
      { signal: controle.signal },
    );
    await expect(tentativa).rejects.toMatchObject({ codigo: "CANCELADO" });
    expect(readFileSync(join(pasta, "pj.DBK"))).toEqual(original);
    expect(readdirSync(pasta).filter((n) => n.endsWith(".tmp"))).toEqual([]);
  });

  it("ferramenta cancelada pelo cliente enquanto esperava a vez não grava", async () => {
    const original = readFileSync(join(pasta, "pj.DBK"));
    const p = await abrirPastaAutorizada(pasta);
    let liberar = () => {};
    const segurando = new Promise<void>((ok) => {
      liberar = ok;
    });
    // Ocupa a fila de pj.DBK (as filas valem para o processo inteiro).
    const ocupada = p.transacao(["pj.DBK"], () => segurando);
    const erros: string[] = [];
    const c2 = await conectar({
      diretorioAutorizado: pasta,
      registrarErro: (f, e) => erros.push(`${f}:${(e as { codigo?: string }).codigo}`),
    });
    try {
      const modelo = (
        (await c2.chamar("listar_rendimentos_pj", { arquivo: "pj.DBK" })).structuredContent as {
          itens: { item: object }[];
        }
      ).itens[0]?.item;
      const controle = new AbortController();
      const chamada = c2.client.callTool(
        { name: "adicionar_rendimento_pj", arguments: { arquivo: "pj.DBK", item: modelo } },
        undefined,
        { signal: controle.signal },
      );
      await new Promise((ok) => setTimeout(ok, 50));
      controle.abort("teste");
      await expect(chamada).rejects.toThrow();
      liberar();
      await ocupada;
      for (let i = 0; i < 50 && erros.length === 0; i++) {
        await new Promise((ok) => setTimeout(ok, 20));
      }
      expect(erros).toEqual(["adicionar_rendimento_pj:CANCELADO"]);
      expect(readFileSync(join(pasta, "pj.DBK"))).toEqual(original);
    } finally {
      liberar();
      await c2.fechar();
    }
  });
});
