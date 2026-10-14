import { describe, expect, it } from "vitest";
import {
  centavos,
  formatCentavos,
  parseCentavos,
  somaCentavos,
  ValorMonetarioInvalidoError,
} from "../src/index.js";

describe("parseCentavos", () => {
  it.each([
    ["1.234,56", 123456n],
    ["1234,56", 123456n],
    ["0,01", 1n],
    ["0,5", 50n],
    ["10", 1000n],
    ["-1.000,00", -100000n],
    ["  7,00 ", 700n],
    ["1.000.000,99", 100000099n],
    ["99999999999999999999,99", 9999999999999999999999n],
  ])("converte %s", (texto, esperado) => {
    expect(parseCentavos(texto)).toBe(esperado);
  });

  it.each(["", "abc", "1,234", "1.23,00", "1,2,3", "1.234.56", "R$ 10,00", "1e3", "--1", "12.34"])(
    "rejeita %j",
    (texto) => {
      expect(() => parseCentavos(texto)).toThrow(ValorMonetarioInvalidoError);
    },
  );
});

describe("formatCentavos", () => {
  it.each([
    [0n, "0,00"],
    [1n, "0,01"],
    [-5n, "-0,05"],
    [123456n, "1.234,56"],
    [100000099n, "1.000.000,99"],
    [-100000n, "-1.000,00"],
  ])("formata %s", (valor, esperado) => {
    expect(formatCentavos(centavos(valor))).toBe(esperado);
  });

  it("faz ida e volta com parse", () => {
    for (const v of [0n, 1n, 99n, 100n, 123456789n, -987654321n]) {
      expect(parseCentavos(formatCentavos(centavos(v)))).toBe(v);
    }
  });
});

describe("centavos e somaCentavos", () => {
  it("aceita apenas inteiros seguros", () => {
    expect(centavos(42)).toBe(42n);
    expect(() => centavos(0.1)).toThrow(ValorMonetarioInvalidoError);
    expect(() => centavos(Number.MAX_SAFE_INTEGER + 1)).toThrow(ValorMonetarioInvalidoError);
  });

  it("soma sem erro de ponto flutuante", () => {
    expect(somaCentavos(parseCentavos("0,10"), parseCentavos("0,20"))).toBe(30n);
    expect(somaCentavos()).toBe(0n);
  });
});
