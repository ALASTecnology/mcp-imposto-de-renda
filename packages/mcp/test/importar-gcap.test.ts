/**
 * `importar_gcap` contra os pares do programa oficial (dados sintéticos): o arquivo que o
 * GCAP 2025 exporta para o IRPF 2026 (`core/test/fixtures/gcap/2026/<caso>.DEC`) e o DBK que o
 * IRPF grava depois de importá-lo (`core/test/fixtures/dbk/2026/<caso>.DBK`).
 */
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type Declaracao,
  gravarArquivo,
  lerArquivo,
  modeloParaRegistros,
  registrosParaModelo,
  zDeclaracao,
} from "@mcp-imposto-de-renda/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { xmlDaExportacaoGcap } from "../src/ferramentas/ciclo-importacao.js";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

const GCAP = fileURLToPath(new URL("../../core/test/fixtures/gcap/2026/", import.meta.url));
const casos = readdirSync(GCAP)
  .filter((n) => n.endsWith(".DEC"))
  .map((n) => n.replace(/\.DEC$/, ""))
  .sort();

let base: string;
let pasta: string;
let c: Conexao;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-gcap-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
  c = await conectar({ diretorioAutorizado: pasta });
});
afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

const modeloDe = (bytes: Uint8Array) =>
  zDeclaracao.parse(registrosParaModelo(lerArquivo(bytes).registros).declaracao);

/** A declaração antes de importar: sem demonstrativo e sem os valores transportados. */
function antes(dec: Declaracao): Declaracao {
  return {
    ...dec,
    ganhosCapital: [],
    rendimentosIsentos: dec.rendimentosIsentos.filter(
      (i) => !["05", "06", "07"].includes(i.codigo),
    ),
    rendimentosExclusivos: dec.rendimentosExclusivos.filter((e) => e.codigo !== "02"),
  };
}

describe("importar_gcap", () => {
  it.each(casos)("%s: a declaração fica como a gravada pelo programa", async (caso) => {
    const oficial = modeloDe(fixture(`${caso}.DBK`));
    writeFileSync(
      join(pasta, "decl.DBK"),
      gravarArquivo(modeloParaRegistros(antes(oficial)).registros),
    );
    const exportado = `${oficial.identificacao.cpf}-0101-3112-GCAP-2025.DEC`;
    writeFileSync(join(pasta, exportado), readFileSync(join(GCAP, `${caso}.DEC`)));
    const r = await c.chamar("importar_gcap", { arquivo: "decl.DBK", arquivo_gcap: exportado });
    expect(r.isError, textoDe(r)).toBeFalsy();
    const s = r.structuredContent as Record<string, unknown>;
    expect(s.alienacoes).toBe(1);
    const depois = modeloDe(new Uint8Array(readFileSync(join(pasta, "decl.DBK"))));
    expect(depois.ganhosCapital).toEqual(oficial.ganhosCapital);
    expect(depois.rendimentosIsentos).toEqual(oficial.rendimentosIsentos);
    expect(depois.rendimentosExclusivos).toEqual(oficial.rendimentosExclusivos);
  });

  it("o XML de dentro do zip é o mesmo gravado pelo harness", () => {
    for (const caso of casos) {
      const doZip = xmlDaExportacaoGcap(new Uint8Array(readFileSync(join(GCAP, `${caso}.DEC`))));
      expect(doZip).toBe(readFileSync(join(GCAP, `${caso}.xml`), "utf8"));
    }
  });

  it("recusa demonstrativo de CPF que não é titular nem dependente", async () => {
    writeFileSync(join(pasta, "outra.DBK"), fixture("pj-simples-01.DBK"));
    writeFileSync(join(pasta, "x-GCAP-2025.DEC"), readFileSync(join(GCAP, `${casos[0]}.DEC`)));
    const r = await c.chamar("importar_gcap", {
      arquivo: "outra.DBK",
      arquivo_gcap: "x-GCAP-2025.DEC",
    });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/não é o titular nem um dependente/);
  });

  it("recusa arquivo que não é o exportado pelo GCAP", async () => {
    writeFileSync(join(pasta, "decl.DBK"), fixture("pj-simples-01.DBK"));
    writeFileSync(join(pasta, "errado.DEC"), fixture("pj-simples-01.DEC"));
    const r = await c.chamar("importar_gcap", { arquivo: "decl.DBK", arquivo_gcap: "errado.DEC" });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/exportado pelo GCAP/);
  });
});
