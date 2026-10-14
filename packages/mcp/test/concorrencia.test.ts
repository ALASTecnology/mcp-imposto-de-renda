/**
 * Gravações simultâneas (revisão 2, achado 1): o SDK atende `tools/call` em paralelo, e cada
 * ferramenta de escrita lê, altera e grava. Sem fila por arquivo, a última gravação apagava as
 * outras e a primeira gravação da pasta podia falhar com EEXIST na pasta de cópias.
 */
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { abrirPastaAutorizada, ErroArquivo } from "../src/arquivos/index.js";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let pasta: string;
let c: Conexao;
let erros: string[];

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "concorrencia-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
  writeFileSync(join(pasta, "pj.DBK"), fixture("pj-simples-01.DBK"));
  writeFileSync(join(pasta, "outro.DBK"), fixture("pj-simples-01.DBK"));
  erros = [];
  c = await conectar({
    diretorioAutorizado: pasta,
    registrarErro: (f, e) => erros.push(`${f}: ${String((e as { code?: string }).code ?? e)}`),
  });
});
afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

const itens = async (arquivo: string) =>
  (
    (await c.chamar("listar_rendimentos_pj", { arquivo })).structuredContent as {
      itens: { item: Record<string, unknown> }[];
    }
  ).itens;

describe("gravações simultâneas no mesmo DBK", () => {
  it("10 inclusões simultâneas persistem todas, sem erro interno", async () => {
    const antes = await itens("pj.DBK");
    const modelo = antes[0]?.item ?? {};
    const rs = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        c.chamar("adicionar_rendimento_pj", {
          arquivo: "pj.DBK",
          item: { ...modelo, rendimentos: 1_000 + i },
        }),
      ),
    );
    for (const r of rs) expect(r.isError, textoDe(r)).toBeFalsy();
    expect(erros).toEqual([]);
    const depois = await itens("pj.DBK");
    expect(depois).toHaveLength(antes.length + 10);
    const valores = depois.map((x) => String(x.item.rendimentos));
    for (let i = 0; i < 10; i++) expect(valores).toContain(String(1_000 + i));
  });

  it("inclusões simultâneas em arquivos diferentes também persistem", async () => {
    const modelo = (await itens("pj.DBK"))[0]?.item ?? {};
    const rs = await Promise.all(
      ["pj.DBK", "outro.DBK", "pj.DBK", "outro.DBK"].map((arquivo, i) =>
        c.chamar("adicionar_rendimento_pj", { arquivo, item: { ...modelo, rendimentos: 7 + i } }),
      ),
    );
    for (const r of rs) expect(r.isError, textoDe(r)).toBeFalsy();
    expect(await itens("pj.DBK")).toHaveLength(3);
    expect(await itens("outro.DBK")).toHaveLength(3);
  });

  it("a primeira gravação simultânea de arquivos diferentes cria a pasta de cópias sem EEXIST", async () => {
    const p = await abrirPastaAutorizada(pasta);
    const dados = fixture("pj-simples-01.DBK");
    const nomes = Array.from({ length: 8 }, (_, i) => `f${i}.DBK`);
    for (const n of nomes) writeFileSync(join(pasta, n), dados);
    const rs = await Promise.allSettled(nomes.map((n) => p.escrever(n, dados, [".DBK"])));
    expect(rs.filter((r) => r.status === "rejected")).toEqual([]);
  });
});

describe("conferência antes do rename", () => {
  it("recusa gravar se outro programa alterou o arquivo depois da leitura", async () => {
    const p = await abrirPastaAutorizada(pasta);
    const externo = new TextEncoder().encode("alterado por fora");
    const tentativa = p.transacao(["pj.DBK"], async () => {
      const lido = await p.ler("pj.DBK", [".DBK"]);
      return p.escrever("pj.DBK", lido, [".DBK"], {
        antesDeRenomear: () => writeFileSync(join(pasta, "pj.DBK"), externo),
      });
    });
    await expect(tentativa).rejects.toBeInstanceOf(ErroArquivo);
    await expect(tentativa).rejects.toMatchObject({ codigo: "ARQUIVO_ALTERADO" });
    expect(readFileSync(join(pasta, "pj.DBK"), "utf8")).toBe("alterado por fora");
  });

  it("a mesma transação pode gravar duas vezes o arquivo que ela própria alterou", async () => {
    const p = await abrirPastaAutorizada(pasta);
    const dados = fixture("pj-simples-01.DBK");
    await p.transacao(["pj.DBK"], async () => {
      await p.ler("pj.DBK", [".DBK"]);
      await p.escrever("pj.DBK", dados, [".DBK"]);
      await p.escrever("pj.DBK", dados, [".DBK"]);
    });
  });
});
