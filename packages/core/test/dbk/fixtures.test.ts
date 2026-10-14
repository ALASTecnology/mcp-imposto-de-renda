/**
 * Casos de referência reais: arquivos DBK/DEC gravados pelo programa oficial com dados
 * sintéticos, colocados em packages/core/test/fixtures/dbk/2026/. Cada arquivo é lido,
 * regravado e comparado byte a byte, e todos os controles são conferidos. Sem a pasta, o
 * teste é pulado.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  converterTipoArquivo,
  gravarArquivo,
  lerArquivo,
  recalcularControles,
  tipoArquivoPorNome,
  verificarControles,
} from "../../src/dbk/index.js";

const PASTA = fileURLToPath(new URL("../fixtures/dbk/2026/", import.meta.url));
const arquivos = existsSync(PASTA)
  ? readdirSync(PASTA)
      .filter((nome) => /\.(dbk|dec)$/i.test(nome))
      .sort()
  : [];

describe("casos de referência do programa oficial (2026)", () => {
  if (arquivos.length === 0) {
    it.skip(`sem arquivos .DBK/.DEC em ${PASTA}: gere-os com o programa oficial e dados sintéticos`, () => {});
    return;
  }

  it.each(arquivos)("%s: lê, regrava byte a byte e confere os controles", (nome) => {
    const bytes = new Uint8Array(readFileSync(join(PASTA, nome)));
    const lido = lerArquivo(bytes);
    expect(lido.exercicio).toBe(2026);

    const regravado = gravarArquivo(lido.registros, { terminadorFinal: lido.terminadorFinal });
    expect(Buffer.compare(Buffer.from(regravado), Buffer.from(bytes))).toBe(0);

    const tipoArquivo = tipoArquivoPorNome(nome);
    const relatorio = verificarControles(lido.registros, { tipoArquivo });
    expect(relatorio.tipoArquivo).toBe(tipoArquivo);
    expect(relatorio.controleHeaderConfere).toBe(true);
    const diagnostico = [
      `variantes de NR_HASH que conferem: ${relatorio.variantesHashQueConferem.join(", ") || "nenhuma"}`,
      `interpretações de QT_TOTAL que conferem: ${relatorio.variantesTotalQueConferem.join(", ") || "nenhuma"}`,
      ...relatorio.divergencias
        .slice(0, 20)
        .map(
          (d) =>
            `linha ${d.linha} ${d.tipo}.${d.campo}: esperado ${d.esperado}, gravado ${d.encontrado}`,
        ),
    ].join("\n");
    expect(relatorio.divergencias, diagnostico).toEqual([]);
    expect(relatorio.variantesHashQueConferem, diagnostico).toContain("linhas+T9");
    expect(relatorio.variantesTotalQueConferem, diagnostico).toContain("declaracao-sem-T9");
  });

  it.each(arquivos)("%s: recalcular todos os controles reproduz o arquivo do programa", (nome) => {
    const bytes = new Uint8Array(readFileSync(join(PASTA, nome)));
    const lido = lerArquivo(bytes);
    const recalculado = recalcularControles(lido.registros, {
      tipoArquivo: tipoArquivoPorNome(nome),
    });
    const gravado = gravarArquivo(recalculado, { terminadorFinal: lido.terminadorFinal });
    expect(Buffer.compare(Buffer.from(gravado), Buffer.from(bytes))).toBe(0);
  });

  const pares = arquivos.filter(
    (n) => /\.dec$/i.test(n) && arquivos.includes(n.replace(/\.dec$/i, ".DBK")),
  );
  // Com saldo a pagar e sem débito automático o programa descarta a conta só na DEC: a DEC
  // convertida em DBK não tem como recuperá-la.
  const SEM_CONTA_NA_DEC = new Set(["conta-sem-debito-pagar-01.DEC"]);
  it.each(pares.filter((n) => !SEM_CONTA_NA_DEC.has(n)))(
    "%s: convertido em DBK é igual, byte a byte, ao DBK do programa",
    (nome) => {
      const dec = lerArquivo(new Uint8Array(readFileSync(join(PASTA, nome))));
      const dbk = new Uint8Array(readFileSync(join(PASTA, nome.replace(/\.dec$/i, ".DBK"))));
      const convertido = gravarArquivo(converterTipoArquivo(dec.registros, "DBK"), {
        terminadorFinal: dec.terminadorFinal,
      });
      expect(Buffer.compare(Buffer.from(convertido), Buffer.from(dbk))).toBe(0);
    },
  );

  it.each(pares)("%s: o DBK convertido em DEC é igual, byte a byte, à DEC do programa", (nome) => {
    const dec = new Uint8Array(readFileSync(join(PASTA, nome)));
    const dbk = lerArquivo(
      new Uint8Array(readFileSync(join(PASTA, nome.replace(/\.dec$/i, ".DBK")))),
    );
    const convertido = gravarArquivo(converterTipoArquivo(dbk.registros, "DEC"), {
      terminadorFinal: dbk.terminadorFinal,
    });
    expect(Buffer.from(convertido).toString("latin1")).toBe(Buffer.from(dec).toString("latin1"));
  });
});
