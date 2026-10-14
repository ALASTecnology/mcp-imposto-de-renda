import { calcular2026 } from "@mcp-imposto-de-renda/core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { normalizarValor } from "../src/index.js";
import { type Conexao, conectar, textoDe } from "./apoio.js";

const TITULAR = { cpf: "529.982.247-25", nome: "TITULAR TESTE", nascimento: "01011980" };

let c: Conexao;
beforeAll(async () => {
  c = await conectar({ relogio: () => new Date(Date.UTC(2026, 6, 15, 12)) });
});
afterAll(async () => {
  await c.fechar();
});

describe("normalizarValor", () => {
  it.each([
    ["1.234,56", "123456"],
    ["1234,5", "123450"],
    ["R$ 80.000,00", "8000000"],
    ["0", "0"],
    [123456, "123456"],
  ])("%j vira %s centavos", (entrada, esperado) => {
    expect(normalizarValor(entrada)).toBe(esperado);
  });

  it.each([["1,234.56"], ["12.34"], ["abc"], [1.5]])("recusa %j", (entrada) => {
    expect(() => normalizarValor(entrada)).toThrow();
  });
});

describe("simular_imposto", () => {
  it("dá o mesmo resultado do motor, com reais em texto ou centavos em número", async () => {
    const emReais = await c.chamar("simular_imposto", {
      titular: TITULAR,
      rendimentosPJ: [{ cnpj: "11.222.333/0001-81", rendimento: "80.000,00", irrf: "9.000,00" }],
    });
    const emCentavos = await c.chamar("simular_imposto", {
      titular: TITULAR,
      rendimentosPJ: [{ cnpj: "11222333000181", rendimento: 8_000_000, irrf: 900_000 }],
    });
    expect(emReais.isError).toBeFalsy();
    expect(emReais.structuredContent).toEqual(emCentavos.structuredContent);
    const motor = calcular2026({
      titular: { cpf: "52998224725", nome: "TITULAR TESTE", nascimento: "01011980" },
      rendimentosPJ: [{ cnpj: "11222333000181", rendimento: "8000000", irrf: "900000" }],
    });
    expect(emReais.structuredContent).toMatchObject({
      exercicio: 2026,
      impostoDevidoCompleto: motor.impostoDevidoCompleto,
      impostoDevidoSimplificado: motor.impostoDevidoSimplificado,
      modeloMaisVantajoso: motor.modeloMaisVantajoso,
    });
    expect(textoDe(emReais)).toContain("R$ 80.000,00");
    expect(textoDe(emReais)).toContain("programa oficial");
  });

  it("recusa valor monetário em formato ambíguo", async () => {
    const r = await c.chamar("simular_imposto", {
      titular: TITULAR,
      rendimentosPJ: [{ rendimento: "80000.00" }],
    });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/Valor monetário inválido/);
  });

  it("explica exercício não suportado", async () => {
    const r = await c.chamar("simular_imposto", { exercicio: 2027, titular: TITULAR });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/Exercícios suportados: 2026/);
  });
});

describe("comparar_modelos e explicar_calculo", () => {
  const entrada = {
    titular: TITULAR,
    dependentes: [{ cpf: "11144477735", nome: "DEP", codigo: "21" }],
    rendimentosPJ: [
      { rendimento: "120.000,00", irrf: "15.000,00", previdenciaOficial: "9.000,00" },
    ],
    pagamentos: [{ codigo: "10", valor: "12.000,00" }],
  };

  it("compara os modelos e indica o mais vantajoso", async () => {
    const r = await c.chamar("comparar_modelos", entrada);
    const s = r.structuredContent as {
      modeloMaisVantajoso: string;
      completo: { totalDeducoes: string; deducoes: Record<string, string> };
      memoria: unknown[];
    };
    expect(s.modeloMaisVantajoso).toBe("completo");
    expect(s.completo.deducoes.medicas).toBe("1200000");
    expect(s.completo.deducoes.dependentes).toBe("227508");
    expect(s.memoria.length).toBeGreaterThan(0);
  });

  it("explica o cálculo passo a passo com a regra de cada linha", async () => {
    const r = await c.chamar("explicar_calculo", { ...entrada, modelo: "completo" });
    const s = r.structuredContent as { linhas: { modelo: string; regra: string }[] };
    expect(s.linhas.length).toBeGreaterThan(3);
    expect(new Set(s.linhas.map((l) => l.modelo))).toEqual(new Set(["completo"]));
    expect(s.linhas.every((l) => l.regra.length > 0)).toBe(true);
    expect(textoDe(r)).toMatch(/^Modelo completo:\n1\. /);
  });
});

describe("quotas, multa e parâmetros", () => {
  it("divide o saldo em quotas com vencimentos oficiais", async () => {
    const r = await c.chamar("calcular_quotas", {
      saldo: "1.000,00",
      quotas: 3,
      selic_mensal: { "2026-06": "1,10" },
    });
    const s = r.structuredContent as {
      quotas: { vencimento: string; principal: string; juros: string | null }[];
    };
    expect(s.quotas.map((q) => q.vencimento)).toEqual(["2026-05-29", "2026-06-30", "2026-07-31"]);
    expect(s.quotas.map((q) => q.principal)).toEqual(["33334", "33333", "33333"]);
    expect(s.quotas[1]?.juros).toBe("333");
    expect(s.quotas[2]?.juros).toBe(String(Math.round(33333 * 0.021)));
  });

  it("recusa quota abaixo do mínimo com mensagem clara", async () => {
    const r = await c.chamar("calcular_quotas", { saldo: "120,00", quotas: 3 });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/R\$ 50,00/);
  });

  it("calcula a multa usando o relógio do servidor como data padrão", async () => {
    const r = await c.chamar("calcular_multa_atraso", { imposto_devido: "10.000,00" });
    expect(r.structuredContent).toMatchObject({
      dataEntrega: "2026-07-15",
      meses: 3,
      multa: "30000",
    });
  });

  it("consulta a tabela progressiva com fontes", async () => {
    const r = await c.chamar("consultar_parametros", {});
    const s = r.structuredContent as {
      tabelaProgressiva: { aliquota: string }[];
      fontes: Record<string, string>;
    };
    expect(s.tabelaProgressiva.map((f) => f.aliquota)).toEqual([
      "0,00%",
      "7,50%",
      "15,00%",
      "22,50%",
      "27,50%",
    ]);
    expect(Object.values(s.fontes).every((u) => u.startsWith("https://"))).toBe(true);
  });
});

describe("atualizar_custo_bem", () => {
  it("converte UFIR pelo valor de 1º/1/1996 (R$ 0,8287)", async () => {
    // 10.000 UFIR x 0,8287 = R$ 8.287,00.
    const r = await c.chamar("atualizar_custo_bem", { metodo: "ufir", quantidade_ufir: "10000" });
    expect(r.isError, textoDe(r)).toBeFalsy();
    expect(r.structuredContent).toMatchObject({ valorAtualizado: 828_700, imposto: 0 });
  });

  it("aplica o coeficiente informado, truncando a fração de centavo", async () => {
    // R$ 1.000,00 x 1,234567 = R$ 1.234,567 -> R$ 1.234,56.
    const r = await c.chamar("atualizar_custo_bem", {
      metodo: "fator",
      valor_original: "1.000,00",
      fator: "1,234567",
    });
    expect(r.structuredContent).toMatchObject({ valorAtualizado: 123_456, diferenca: 23_456 });
  });

  it("Lei 14.973/2024: 4% sobre a diferença e orientação sobre o prazo", async () => {
    // (R$ 500.000,00 - R$ 200.000,00) x 4% = R$ 12.000,00.
    const r = await c.chamar("atualizar_custo_bem", {
      metodo: "lei14973",
      valor_original: "200.000,00",
      valor_mercado: "500.000,00",
    });
    expect(r.structuredContent).toMatchObject({ imposto: 1_200_000, diferenca: 30_000_000 });
    expect(textoDe(r)).toMatch(/prazo/);
    expect((await c.chamar("atualizar_custo_bem", { metodo: "fator" })).isError).toBe(true);
  });
});
