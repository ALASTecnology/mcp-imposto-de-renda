import { gravarArquivo, lerArquivo, verificarControles, zDeclaracao } from "@autoir/core";
import { describe, expect, it } from "vitest";
import {
  interpretarDeclaracao,
  modeloParaRegistros,
  registrosParaModelo,
} from "../src/conversao/dbk-modelo.js";
import { EntradaInvalidaError } from "../src/erros.js";
import { declaracaoSintetica, fixture } from "./apoio.js";

describe("DBK para modelo", () => {
  it("lê identificação e rendimentos de PJ do caso de referência", () => {
    const arq = lerArquivo(fixture("pj-simples-01.DBK"));
    const r = registrosParaModelo(arq.registros, arq.exercicio);
    const dec = interpretarDeclaracao(r.declaracao);
    expect(dec.identificacao.nome).toBe("ANA FICTICIA PRIMEIRA");
    expect(dec.identificacao.dataNascimento).toBe("1985-03-15");
    expect(dec.identificacao.endereco).toMatchObject({
      local: "brasil",
      municipio: "9701",
      uf: "DF",
    });
    expect(dec.rendimentosPJ).toHaveLength(1);
    expect(dec.rendimentosPJ[0]?.rendimentos).toBe(6_000_000n);
    expect(dec.rendimentosPJ[0]?.impostoRetido).toBe(500_000n);
    expect(r.tiposNaoConvertidos).toEqual([]);
  });
});

describe("modelo para DBK", () => {
  it("ida e volta preserva todas as fichas convertidas, com controles válidos", () => {
    const dec = zDeclaracao.parse(declaracaoSintetica());
    const { registros } = modeloParaRegistros(dec);
    const bytes = gravarArquivo(registros);
    const relido = lerArquivo(bytes);
    expect(verificarControles(relido.registros).valido).toBe(true);
    const volta = interpretarDeclaracao(registrosParaModelo(relido.registros, 2026).declaracao);
    expect(volta.dependentes).toEqual(dec.dependentes);
    expect(volta.rendimentosPJ).toEqual(dec.rendimentosPJ);
    expect(volta.pagamentos).toEqual(dec.pagamentos);
    expect(volta.dividas).toEqual(dec.dividas);
    expect(volta.bens.map((b) => ({ ...b, chave: undefined }))).toEqual(
      dec.bens.map((b) => ({ ...b, chave: undefined })),
    );
    expect(volta.identificacao).toEqual(dec.identificacao);
  });

  it("sobre um arquivo base, preserva os registros não convertidos e recalcula o T9", () => {
    const arq = lerArquivo(fixture("pj-simples-01.DBK"));
    const base = interpretarDeclaracao(registrosParaModelo(arq.registros, 2026).declaracao);
    const alterada = {
      ...base,
      rendimentosPJ: [
        ...base.rendimentosPJ,
        ...zDeclaracao.parse(declaracaoSintetica()).rendimentosPJ,
      ],
    };
    const { registros } = modeloParaRegistros(alterada, arq.registros);
    const tipos = registros.map((r) => r.tipo);
    expect(tipos).toEqual(["IR", "16", "17", "18", "21", "21", "24", "32", "T9"]);
    const r17 = arq.registros.find((r) => r.tipo === "17");
    expect(registros.find((r) => r.tipo === "17")?.campos).toEqual(r17?.campos);
    expect(verificarControles(registros).valido).toBe(true);
    expect(registros.at(-1)?.campos.QT_R21).toBe(2n);
  });

  it("sem alterações, regrava o caso de referência com os mesmos registros convertidos", () => {
    const arq = lerArquivo(fixture("pj-simples-01.DBK"));
    const dec = interpretarDeclaracao(registrosParaModelo(arq.registros, 2026).declaracao);
    const { registros } = modeloParaRegistros(dec, arq.registros);
    expect(registros.find((r) => r.tipo === "21")?.campos).toEqual(
      arq.registros.find((r) => r.tipo === "21")?.campos,
    );
  });
});

describe("interpretarDeclaracao", () => {
  it("explica os campos inválidos sem repetir os valores", () => {
    const entrada = declaracaoSintetica();
    const ruim = { ...entrada, identificacao: { ...entrada.identificacao, cpf: "SEGREDO123" } };
    try {
      interpretarDeclaracao(ruim);
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(EntradaInvalidaError);
      expect((e as Error).message).toContain("identificacao.cpf");
      expect((e as Error).message).not.toContain("SEGREDO123");
    }
  });
});
