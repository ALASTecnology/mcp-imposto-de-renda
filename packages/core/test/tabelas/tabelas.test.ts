import { describe, expect, it } from "vitest";
import {
  buscarBem,
  buscarCodigo,
  existeCodigo,
  listar,
  NOMES_TABELAS,
  parametroCalculo,
} from "../../src/tabelas/index.js";

describe("tabelas de códigos", () => {
  it("expõe todas as 31 tabelas de docs/mapeamento/tabelas", () => {
    expect(NOMES_TABELAS).toHaveLength(31);
    for (const nome of NOMES_TABELAS) {
      expect(listar(nome).length).toBeGreaterThan(0);
    }
  });

  it("lista as entradas na ordem original", () => {
    const ufs = listar("ufs");
    expect(ufs).toHaveLength(27);
    expect(ufs[0]).toEqual({ codigo: "AC", descricao: "Acre" });
  });

  it("busca por código e devolve undefined quando não existe", () => {
    expect(buscarCodigo("dependentes", "21")?.descricao).toMatch(/^Filho/);
    expect(buscarCodigo("dependentes", "99")).toBeUndefined();
    expect(buscarCodigo("naturezas-ocupacao", "81")?.descricao).toBe("Espólio");
  });

  it("indexa bens e direitos por grupo e código", () => {
    expect(buscarCodigo("bens-direitos", "01.11")?.descricao).toBe("Apartamento");
    expect(buscarBem("08", "01")?.grupoDescricao).toMatch(/Criptoativos/);
    expect(buscarBem("01", "98")).toBeUndefined();
  });

  it("normaliza CNPJ dos fundos do ECA e do idoso", () => {
    const primeiro = listar("fundos-eca")[0];
    expect(primeiro).toBeDefined();
    const digitos = (primeiro?.codigo ?? "").replace(/\D/g, "");
    expect(buscarCodigo("fundos-eca", digitos)?.uf).toBe(primeiro?.uf);
    expect(buscarCodigo("fundos-eca", primeiro?.codigo ?? "")).toBe(primeiro);
    expect(existeCodigo("fundos-idoso", "00.000.000/0000-00")).toBe(false);
  });

  it("mantém indicadores e parâmetros dos bancos", () => {
    expect(buscarCodigo("bancos-calculo-dv", "341")?.parametrosDV).toEqual({
      COL3: "4",
      COL4: "5",
    });
    expect(buscarCodigo("bancos", "001")?.indicadores.COL3).toBe("S");
  });

  it("obtém parâmetros de cálculo do exercício", () => {
    expect(parametroCalculo("deducaoDependente")?.valor).toBe(2275.08);
    expect(parametroCalculo("inexistente")).toBeUndefined();
  });
});
