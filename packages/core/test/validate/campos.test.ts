import { describe, expect, it } from "vitest";
import { calcularDvCpf } from "../../src/index.js";
import { dvRenavam, validarCampo } from "../../src/validate/index.js";

/** Renavam de referência, escrito de outro jeito: pesos 2 a 9 da direita para a esquerda. */
function dvRenavamReferencia(base10: string): string {
  const pesos = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3];
  let soma = 0;
  const inv = [...base10].reverse();
  for (let i = 0; i < 10; i++) soma += Number(inv[i]) * (pesos[i] ?? 0);
  const dv = 11 - (soma % 11);
  return String(dv >= 10 ? 0 : dv);
}

describe("validarCampo", () => {
  it("CPF e CNPJ continuam detectados pelo tamanho", () => {
    const cpf = `135792468${calcularDvCpf("135792468")}`;
    expect(validarCampo("cpf", cpf)).toMatchObject({ valido: true, normalizado: cpf });
    expect(validarCampo("cpf", "12345678900").valido).toBe(false);
    expect(validarCampo("cnpj", "11.222.333/0001-81")).toMatchObject({
      valido: true,
      normalizado: "11222333000181",
    });
  });

  it("recibo de entrega tem 12 dígitos e não pode ser só zeros", () => {
    expect(validarCampo("recibo", "12.34.56.78.90-12")).toMatchObject({
      valido: true,
      normalizado: "123456789012",
    });
    expect(validarCampo("recibo", "12345").valido).toBe(false);
    expect(validarCampo("recibo", "000000000000").valido).toBe(false);
  });

  it("CEP com 8 dígitos", () => {
    expect(validarCampo("cep", "70040-010")).toMatchObject({
      valido: true,
      normalizado: "70040010",
    });
    expect(validarCampo("cep", "7004001").valido).toBe(false);
    expect(validarCampo("cep", "00000000").valido).toBe(false);
  });

  it("telefone com DDD de 2 dígitos e até 9 dígitos", () => {
    expect(validarCampo("telefone", "(61) 99999-0000")).toMatchObject({
      valido: true,
      normalizado: "61999990000",
    });
    expect(validarCampo("telefone", "61 3333-4444").valido).toBe(true);
    expect(validarCampo("telefone", "0133334444").valido).toBe(false);
    expect(validarCampo("telefone", "6199").valido).toBe(false);
  });

  it("e-mail, nome e data", () => {
    expect(validarCampo("email", "fulana@exemplo.com.br").valido).toBe(true);
    expect(validarCampo("email", "fulana@exemplo").valido).toBe(false);
    expect(validarCampo("nome", "MARIA DA SILVA").valido).toBe(true);
    const n = validarCampo("nome", "MARIAAA SILVA");
    expect(n.valido).toBe(false);
    expect(n.mensagem).toMatch(/3 caracteres iguais/);
    expect(validarCampo("data", "29/02/2024")).toMatchObject({
      valido: true,
      normalizado: "2024-02-29",
    });
    expect(validarCampo("data", "29/02/2025").valido).toBe(false);
    expect(validarCampo("data", "2025-13-01").valido).toBe(false);
  });

  it("Renavam: 11 dígitos com DV módulo 11 (9 dígitos antigos completados com zeros)", () => {
    for (const base of ["0063972448", "1234567890", "0000000001"]) {
      expect(dvRenavam(base)).toBe(dvRenavamReferencia(base));
      const r = `${base}${dvRenavamReferencia(base)}`;
      expect(validarCampo("renavam", r).valido).toBe(true);
      const errado = `${base}${(Number(dvRenavamReferencia(base)) + 1) % 10}`;
      expect(validarCampo("renavam", errado).valido).toBe(false);
    }
    // Renavam antigo de 9 dígitos: completa com zeros à esquerda até 11.
    const antigo = `63972448${dvRenavamReferencia("0063972448")}`;
    expect(validarCampo("renavam", antigo)).toMatchObject({
      valido: true,
      normalizado: `00${antigo}`,
    });
  });

  it("conta bancária usa a rede autorizada e o DV público do banco", () => {
    const ok = validarCampo("conta_bancaria", "210169-6", { banco: "001", agencia: "1234" });
    expect(ok).toMatchObject({ valido: true, normalizado: "001/1234/210169-6" });
    const dvErrado = validarCampo("conta_bancaria", "210169-5", { banco: "001", agencia: "1234" });
    expect(dvErrado.valido).toBe(false);
    expect(dvErrado.mensagem).toMatch(/DV/);
    expect(validarCampo("conta_bancaria", "123", { banco: "999", agencia: "1" }).valido).toBe(
      false,
    );
    expect(validarCampo("conta_bancaria", "123", {}).mensagem).toMatch(/banco e agência/);
  });
});
