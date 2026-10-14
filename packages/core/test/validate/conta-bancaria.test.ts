import { describe, expect, it } from "vitest";
import {
  dvContaBancoDoBrasil,
  dvContaBradesco,
  dvContaItau,
  validarContaBancaria,
} from "../../src/validate/index.js";

describe("dígito verificador de conta (algoritmos públicos dos bancos)", () => {
  it("Banco do Brasil: módulo 11 com pesos 9 a 2", () => {
    expect(dvContaBancoDoBrasil("210169")).toBe("6");
    // Soma 10: 11 - (10 % 11) = 1; resto 10 vira X.
    expect(["X", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]).toContain(
      dvContaBancoDoBrasil("12345678"),
    );
  });

  it("Bradesco: módulo 11 com pesos 2 a 7 e P para resto 1", () => {
    expect(dvContaBradesco("0238069")).toBe("2");
    expect(dvContaBradesco("0000001")).toBe("9");
  });

  it("Itaú: módulo 10 sobre agência e conta", () => {
    expect(dvContaItau("2545", "02366")).toBe("1");
  });
});

describe("validarContaBancaria", () => {
  it("aceita conta coerente", () => {
    expect(
      validarContaBancaria({ banco: "341", agencia: "2545", conta: "02366", dv: "1" }, "bancos"),
    ).toEqual([]);
  });

  it("rejeita banco fora da rede de restituição", () => {
    const p = validarContaBancaria({ banco: "999", agencia: "1", conta: "1" }, "bancos");
    expect(p).toEqual([expect.objectContaining({ campo: "banco", gravidade: "erro" })]);
  });

  it("usa a tabela de bancos dos bens quando pedido", () => {
    expect(
      validarContaBancaria({ banco: "011", agencia: "1", conta: "12" }, "bancos-bens"),
    ).toEqual([]);
    expect(
      validarContaBancaria({ banco: "011", agencia: "1", conta: "12" }, "bancos"),
    ).toHaveLength(1);
  });

  it("rejeita conta zerada e avisa DV ou tamanho divergente", () => {
    expect(
      validarContaBancaria({ banco: "341", agencia: "1", conta: "000" }, "bancos")[0]?.campo,
    ).toBe("conta");
    const avisos = validarContaBancaria(
      { banco: "341", agencia: "25450", conta: "1234567", dv: "9" },
      "bancos",
    );
    expect(avisos.map((a) => [a.campo, a.gravidade])).toEqual([
      ["agencia", "aviso"],
      ["conta", "aviso"],
      ["dv", "aviso"],
    ]);
  });
});
