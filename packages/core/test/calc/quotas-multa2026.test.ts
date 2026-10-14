/**
 * Quotas e multa por atraso do exercício 2026, com valores calculados à mão.
 * Regras: Perguntas e Respostas IRPF 2026, perguntas 063 e 064 (quotas) e a
 * resposta sobre multa por atraso (mínimo R$ 165,74, 1% ao mês ou fração,
 * máximo 20%).
 */
import { describe, expect, it } from "vitest";
import { calcularMultaAtraso, calcularQuotas } from "../../src/calc/index.js";
import { centavos } from "../../src/centavos.js";

const c = (v: bigint) => centavos(v);

describe("calcularQuotas", () => {
  it("divide em 8 quotas o exemplo da Ajuda (R$ 1.965,76 -> R$ 245,72)", () => {
    const r = calcularQuotas(c(196576n), 8);
    expect(r.numeroQuotas).toBe(8);
    expect(r.quotas.map((q) => q.principal)).toEqual(Array(8).fill(24572n));
    expect(r.quotas.map((q) => q.vencimento)).toEqual([
      "2026-05-29",
      "2026-06-30",
      "2026-07-31",
      "2026-08-31",
      "2026-09-30",
      "2026-10-30",
      "2026-11-30",
      "2026-12-30",
    ]);
  });

  it("1ª quota sem juros, 2ª com 1%, demais com Selic acumulada + 1%", () => {
    // 2ª: 24.572 x 1% = 245,72 -> 246.
    // 3ª com Selic de junho 1,10%: 24.572 x 2,10% = 516,012 -> 516.
    const r = calcularQuotas(c(196576n), 8, undefined, { selicMensal: { "2026-06": 110n } });
    expect(r.quotas[0]?.juros).toBe(0n);
    expect(r.quotas[1]?.juros).toBe(246n);
    expect(r.quotas[1]?.percentualJuros).toBe(100n);
    expect(r.quotas[2]?.juros).toBe(516n);
    expect(r.quotas[2]?.percentualJuros).toBe(210n);
    // 4ª precisa da Selic de julho, que não foi informada.
    expect(r.quotas[3]?.juros).toBeNull();
  });

  it("resto da divisão vai para a 1ª quota", () => {
    const r = calcularQuotas(c(10001n), 2);
    expect(r.quotas.map((q) => q.principal)).toEqual([5001n, 5000n]);
  });

  it("nenhuma quota pode ser inferior a R$ 50,00", () => {
    // 15.000 / 50,00 = 3 quotas no máximo.
    expect(calcularQuotas(c(15000n), 3).numeroQuotas).toBe(3);
    expect(() => calcularQuotas(c(15000n), 4)).toThrow(/50,00/);
  });

  it("imposto inferior a R$ 100,00 só em quota única", () => {
    expect(calcularQuotas(c(9900n), 1).numeroQuotas).toBe(1);
    expect(() => calcularQuotas(c(9900n), 2)).toThrow(/100,00/);
  });

  it("no máximo 8 quotas", () => {
    expect(() => calcularQuotas(c(10000000n), 9)).toThrow(/8/);
  });

  it("saldo inferior a R$ 10,00 não é recolhido", () => {
    const r = calcularQuotas(c(999n), 1);
    expect(r.numeroQuotas).toBe(0);
    expect(r.quotas).toEqual([]);
    expect(r.avisos.join(" ")).toMatch(/10,00/);
  });

  it("aceita outra data de 1º vencimento (último dia dos meses seguintes, sem feriados)", () => {
    const r = calcularQuotas(c(20000n), 2, "2027-05-31");
    expect(r.quotas.map((q) => q.vencimento)).toEqual(["2027-05-31", "2027-06-30"]);
  });
});

describe("calcularMultaAtraso", () => {
  it("entrega no prazo não tem multa", () => {
    expect(calcularMultaAtraso(c(1000000n), "2026-05-29").multa).toBe(0n);
  });

  it("sem imposto devido, multa mínima de R$ 165,74", () => {
    expect(calcularMultaAtraso(c(0n), "2026-06-01").multa).toBe(16574n);
  });

  it("1% ao mês, mas nunca menos que R$ 165,74", () => {
    // Imposto 100.000; entrega 15/07/2026: maio (fração), junho e julho = 3 meses.
    // 3% = 3.000 < 16.574 -> 16.574.
    const r = calcularMultaAtraso(c(100000n), "2026-07-15");
    expect(r.meses).toBe(3);
    expect(r.multa).toBe(16574n);
  });

  it("1% por mês-calendário ou fração de atraso", () => {
    // Imposto 1.000.000; entrega 10/08/2026: maio, junho, julho e agosto = 4 meses.
    // 4% = 40.000.
    const r = calcularMultaAtraso(c(1000000n), "2026-08-10");
    expect(r.meses).toBe(4);
    expect(r.multa).toBe(40000n);
  });

  it("limita a 20% do imposto devido", () => {
    // 1.000.000 x 20% = 200.000.
    expect(calcularMultaAtraso(c(1000000n), "2028-01-01").multa).toBe(200000n);
  });

  it("aceita data no formato DDMMAAAA", () => {
    expect(calcularMultaAtraso(c(1000000n), "10082026").meses).toBe(4);
  });

  it("rejeita data inválida", () => {
    expect(() => calcularMultaAtraso(c(1n), "2026-02-30")).toThrow(/Data/);
  });
});
