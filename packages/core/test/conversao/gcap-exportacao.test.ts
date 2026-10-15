/**
 * Importação do arquivo "Exportar para o IRPF2026" do GCAP 2025 contra os pares do programa
 * oficial (dados sintéticos): o arquivo exportado (`fixtures/gcap/2026/<caso>.DEC` e `.xml`) e o
 * DBK que o IRPF 2026 grava depois de importá-lo (`fixtures/dbk/2026/<caso>.DBK`).
 *
 * Ida e volta: a declaração do DBK oficial sem o demonstrativo e sem os valores transportados,
 * mais a importação do arquivo exportado, precisa dar o mesmo modelo do DBK oficial; e gravar
 * esse modelo sobre o DBK oficial devolve os mesmos bytes.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ExportacaoGcapInvalidaError,
  incluirDemonstrativoGcap,
  lerDemonstrativoGcapXml,
  modeloParaRegistros,
  registrosParaModelo,
} from "../../src/conversao/index.js";
import { gravarArquivo, lerArquivo } from "../../src/dbk/index.js";
import { type Declaracao, zDeclaracao } from "../../src/model/index.js";

const GCAP = fileURLToPath(new URL("../fixtures/gcap/2026/", import.meta.url));
const DBK = fileURLToPath(new URL("../fixtures/dbk/2026/", import.meta.url));
const casos = readdirSync(GCAP)
  .filter((n) => n.endsWith(".DEC"))
  .map((n) => n.replace(/\.DEC$/, ""))
  .sort();

/** Demonstrativo lido do XML de dentro do arquivo exportado (o zip é aberto no servidor). */
const xml = (caso: string) =>
  lerDemonstrativoGcapXml(readFileSync(join(GCAP, `${caso}.xml`), "utf8"));

const TRANSPORTADOS_ISENTOS = new Set(["05", "06", "07"]);

function oficial(caso: string) {
  const lido = lerArquivo(new Uint8Array(readFileSync(join(DBK, `${caso}.DBK`))));
  return { lido, dec: zDeclaracao.parse(registrosParaModelo(lido.registros).declaracao) };
}

/** A declaração como estava antes de importar: sem demonstrativo e sem os transportes. */
function antes(dec: Declaracao): Declaracao {
  return {
    ...dec,
    ganhosCapital: [],
    rendimentosIsentos: dec.rendimentosIsentos.filter((i) => !TRANSPORTADOS_ISENTOS.has(i.codigo)),
    rendimentosExclusivos: dec.rendimentosExclusivos.filter((e) => e.codigo !== "02"),
  };
}

describe("importação do arquivo exportado pelo GCAP 2025", () => {
  it("há os 7 pares de referência", () => {
    expect(casos).toHaveLength(7);
  });

  it.each(casos)("%s: o modelo importado é o do DBK gravado pelo programa", (caso) => {
    const { dec } = oficial(caso);
    const d = xml(caso);
    const importado = zDeclaracao.parse(incluirDemonstrativoGcap(antes(dec), d));
    expect(importado.ganhosCapital).toEqual(dec.ganhosCapital);
    expect(importado.rendimentosIsentos).toEqual(dec.rendimentosIsentos);
    expect(importado.rendimentosExclusivos).toEqual(dec.rendimentosExclusivos);
    expect(importado).toEqual(dec);
  });

  it.each(casos)("%s: gravar o modelo importado sobre o DBK oficial devolve os mesmos bytes", (caso) => {
    const { lido, dec } = oficial(caso);
    const d = xml(caso);
    const importado = zDeclaracao.parse(incluirDemonstrativoGcap(antes(dec), d));
    const gravado = modeloParaRegistros(importado, {
      base: lido.registros,
      totais: "preservar",
      controles: { controleHeader: "preservar" },
    });
    const bytes = new Uint8Array(readFileSync(join(DBK, `${caso}.DBK`)));
    const saida = gravarArquivo(gravado.registros, { terminadorFinal: lido.terminadorFinal });
    expect(Buffer.compare(Buffer.from(saida), Buffer.from(bytes))).toBe(0);
  });

  it("reimportar substitui o demonstrativo do mesmo CPF e período", () => {
    const { dec } = oficial(casos[0] as string);
    const d = xml(casos[0] as string);
    const duas = incluirDemonstrativoGcap(incluirDemonstrativoGcap(antes(dec), d), d);
    expect(duas.ganhosCapital).toHaveLength(1);
    expect(zDeclaracao.parse(duas)).toEqual(dec);
  });

  it("recusa arquivo que não é demonstrativo do GCAP", () => {
    expect(() => lerDemonstrativoGcapXml('<classe classeJava="x"/>')).toThrow(
      ExportacaoGcapInvalidaError,
    );
    expect(() => lerDemonstrativoGcapXml("<classe><item></classe>")).toThrow(
      ExportacaoGcapInvalidaError,
    );
  });
});
