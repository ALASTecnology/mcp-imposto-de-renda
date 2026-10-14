/**
 * Ida e volta com os arquivos gravados pelo programa oficial (dados sintéticos): DBK/DEC para
 * o modelo, validação pelo schema e de volta para registros, com os mesmos bytes (o
 * `NR_CONTROLE` do header é preservado).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { modeloParaRegistros, registrosParaModelo } from "../../src/conversao/index.js";
import { gravarArquivo, lerArquivo, verificarControles } from "../../src/dbk/index.js";
import { zDeclaracao } from "../../src/model/index.js";

const PASTA = fileURLToPath(new URL("../fixtures/dbk/2026/", import.meta.url));
const arquivos = existsSync(PASTA)
  ? readdirSync(PASTA)
      .filter((n) => /\.(dbk|dec)$/i.test(n))
      .sort()
  : [];

function idaEVolta(nome: string) {
  const bytes = new Uint8Array(readFileSync(join(PASTA, nome)));
  const lido = lerArquivo(bytes);
  const leitura = registrosParaModelo(lido.registros);
  const dec = zDeclaracao.parse(leitura.declaracao);
  const gravado = modeloParaRegistros(dec, {
    base: lido.registros,
    totais: "preservar",
    controles: { controleHeader: "preservar" },
  });
  const saida = gravarArquivo(gravado.registros, { terminadorFinal: lido.terminadorFinal });
  return { bytes, lido, leitura, dec, gravado, saida };
}

describe("conversão DBK/DEC, modelo e DBK com os arquivos do programa oficial", () => {
  if (arquivos.length === 0) {
    it.skip(`sem arquivos em ${PASTA}`, () => {});
    return;
  }

  it.each(arquivos)("%s: ida e volta byte a byte", (nome) => {
    const { bytes, leitura, saida, gravado } = idaEVolta(nome);
    expect(leitura.tiposNaoMapeados).toEqual([]);
    expect(gravado.tiposPreservados).toEqual([]);
    if (Buffer.compare(Buffer.from(saida), Buffer.from(bytes)) !== 0) {
      const a = lerArquivo(bytes).registros;
      const b = lerArquivo(saida).registros;
      const dif: string[] = [];
      if (a.length !== b.length) dif.push(`registros: ${a.length} != ${b.length}`);
      a.forEach((r, i) => {
        const o = b[i];
        if (!o || o.tipo !== r.tipo) {
          dif.push(`linha ${i + 1}: tipo ${r.tipo} != ${o?.tipo}`);
          return;
        }
        for (const [k, v] of Object.entries(r.campos)) {
          if (k === "NR_CONTROLE" || k === "NR_HASH") continue;
          if (v !== o.campos[k]) dif.push(`${r.tipo}.${k}: ${String(v)} != ${String(o.campos[k])}`);
        }
      });
      expect(dif).toEqual([]);
    }
    expect(verificarControles(lerArquivo(saida).registros).divergencias).toEqual([]);
  });

  it.each(arquivos)("%s: modelo relido do arquivo gravado é o mesmo", (nome) => {
    const { saida, dec } = idaEVolta(nome);
    const relido = zDeclaracao.parse(registrosParaModelo(lerArquivo(saida).registros).declaracao);
    expect(relido).toEqual(dec);
  });
});

describe("DEC com recibo gravado como DBK", () => {
  const dec = arquivos.find((n) => /\.dec$/i.test(n));
  it.skipIf(!dec)("não leva os registros do recibo e confere os controles", () => {
    const { lido, dec: modelo } = idaEVolta(dec ?? "");
    const r = modeloParaRegistros(modelo, {
      base: lido.registros,
      controles: { tipoArquivo: "DBK" },
    });
    expect(r.registros.some((x) => ["HR", "DR", "R9"].includes(x.tipo))).toBe(false);
    expect(verificarControles(r.registros, { tipoArquivo: "DBK" }).valido).toBe(true);
  });
});
