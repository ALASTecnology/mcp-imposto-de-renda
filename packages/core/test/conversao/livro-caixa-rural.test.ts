/**
 * Importação do arquivo "Exportar para o IRPF" do Livro Caixa da Atividade Rural 2025 contra os
 * pares do programa oficial (dados sintéticos): o arquivo exportado
 * (`fixtures/atividade-rural/2026/<caso>.DEC`) e o DBK que o IRPF 2026 grava depois de
 * importá-lo (`fixtures/dbk/2026/<caso>.DBK`).
 *
 * Ida e volta: a declaração do DBK oficial sem as receitas e despesas da atividade rural, mais a
 * importação do arquivo exportado, precisa dar o mesmo modelo do DBK oficial; e gravar esse
 * modelo sobre o DBK oficial sem os registros 51, 52 e 56, com os totais refeitos pelo motor,
 * devolve os mesmos bytes.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ExportacaoLivroCaixaRuralInvalidaError,
  incluirLivroCaixaRural,
  lerExportacaoLivroCaixaRural,
  modeloParaRegistros,
  registrosParaModelo,
} from "../../src/conversao/index.js";
import { gravarArquivo, lerArquivo } from "../../src/dbk/index.js";
import { type Declaracao, zDeclaracao } from "../../src/model/index.js";

const AR = fileURLToPath(new URL("../fixtures/atividade-rural/2026/", import.meta.url));
const DBK = fileURLToPath(new URL("../fixtures/dbk/2026/", import.meta.url));
const casos = readdirSync(AR)
  .filter((n) => n.endsWith(".DEC"))
  .map((n) => n.replace(/\.DEC$/, ""))
  .sort();

const exportado = (caso: string) => new Uint8Array(readFileSync(join(AR, `${caso}.DEC`)));

function oficial(caso: string) {
  const lido = lerArquivo(new Uint8Array(readFileSync(join(DBK, `${caso}.DBK`))));
  return { lido, dec: zDeclaracao.parse(registrosParaModelo(lido.registros).declaracao) };
}

/**
 * A declaração antes de importar: sem receitas, despesas e adiantamentos da atividade rural e
 * sem o isento 15 que a Apuração transporta.
 */
function antes(declaracao: Declaracao): Declaracao {
  const dec = {
    ...declaracao,
    rendimentosIsentos: declaracao.rendimentosIsentos.filter((i) => i.codigo !== "15"),
  };
  const ar = dec.atividadeRural;
  if (!ar) return dec;
  if (ar.brasil.receitasDespesas.length === 0) {
    return zDeclaracao.parse({
      ...dec,
      atividadeRural: { ...ar, exterior: { ...ar.exterior, receitasDespesas: [] } },
    });
  }
  return zDeclaracao.parse({
    ...dec,
    atividadeRural: {
      ...ar,
      brasil: {
        ...ar.brasil,
        // Meses digitados antes da importação, que o programa substitui.
        receitasDespesas: [{ mes: 2, receitaBruta: 123_456n, despesa: 654n }],
        apuracao: {
          ...ar.brasil.apuracao,
          adiantamentosRecebidos: 1n,
          adiantamentosAnterioresEntregues: 2n,
        },
      },
      exterior: { ...ar.exterior, receitasDespesas: [] },
    },
  });
}

describe("importação do Livro Caixa da Atividade Rural 2025", () => {
  it("há os 4 pares de referência", () => {
    expect(casos).toHaveLength(4);
  });

  it.each(casos)("%s: o modelo importado é o do DBK gravado pelo programa", (caso) => {
    const { dec } = oficial(caso);
    const importado = zDeclaracao.parse(
      incluirLivroCaixaRural(antes(dec), lerExportacaoLivroCaixaRural(exportado(caso))),
    );
    expect(importado.atividadeRural).toEqual(dec.atividadeRural);
    expect(importado).toEqual(dec);
  });

  it.each(casos)(
    "%s: gravar sobre o DBK oficial sem os registros 51, 52 e 56 devolve os mesmos bytes",
    (caso) => {
      const { lido, dec } = oficial(caso);
      const importado = zDeclaracao.parse(
        incluirLivroCaixaRural(antes(dec), lerExportacaoLivroCaixaRural(exportado(caso))),
      );
      const gravado = modeloParaRegistros(importado, {
        base: lido.registros.filter((r) => !["51", "52", "56"].includes(r.tipo)),
        totais: "recalcular",
      });
      const bytes = new Uint8Array(readFileSync(join(DBK, `${caso}.DBK`)));
      const saida = gravarArquivo(gravado.registros, { terminadorFinal: lido.terminadorFinal });
      expect(Buffer.from(saida).toString("latin1")).toBe(Buffer.from(bytes).toString("latin1"));
    },
  );

  it("lê o demonstrativo mensal, o país e o CPF do arquivo", () => {
    const d = lerExportacaoLivroCaixaRural(exportado("ar-livro-caixa-adiantamentos-01"));
    expect(d.cpf).toBe("16069301412");
    expect(d.exercicio).toBe(2026);
    expect(d.demonstrativos).toHaveLength(1);
    const [dem] = d.demonstrativos;
    expect(dem?.pais).toBe("105");
    expect(dem?.meses[3]).toEqual({
      receitas: 0n,
      despesas: 0n,
      despesasNaoDedutiveis: 0n,
      produtoEntregueAdiantamento: 800_000n,
      adiantamentoRecebido: 0n,
    });
    expect(dem?.meses[5]?.adiantamentoRecebido).toBe(650_000n);
  });

  it("recusa arquivo alterado, de outro exercício ou que não é do Livro Caixa", () => {
    const bytes = exportado("ar-livro-caixa-01");
    const alterado = Buffer.from(bytes)
      .toString("latin1")
      .replace("04A0000004500000", "04A0000004500001");
    expect(() => lerExportacaoLivroCaixaRural(Buffer.from(alterado, "latin1"))).toThrow(
      /corrompido/,
    );
    const outroAno = Buffer.from(bytes)
      .toString("latin1")
      .replace("ARURAL  20262025", "ARURAL  20272026");
    expect(() => lerExportacaoLivroCaixaRural(Buffer.from(outroAno, "latin1"))).toThrow(
      /IRPF 2027/,
    );
    expect(() => lerExportacaoLivroCaixaRural(new TextEncoder().encode("IRPF    2026"))).toThrow(
      ExportacaoLivroCaixaRuralInvalidaError,
    );
  });

  it("recusa arquivo de outro CPF", () => {
    const { dec } = oficial("ar-livro-caixa-01");
    const d = lerExportacaoLivroCaixaRural(exportado("ar-livro-caixa-adiantamentos-01"));
    expect(() => incluirLivroCaixaRural(dec, d)).toThrow(ExportacaoLivroCaixaRuralInvalidaError);
  });
});
