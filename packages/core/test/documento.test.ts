import { describe, expect, it } from "vitest";
import {
  calcularDvCnpj,
  calcularDvCpf,
  validarCnpj,
  validarCpf,
  validarDocumento,
} from "../src/index.js";

/**
 * Todos os documentos destes testes são sintéticos: as bases vêm de um gerador
 * pseudoaleatório determinístico e os dígitos verificadores são calculados por
 * uma implementação de referência independente, escrita aqui de outro jeito.
 */
function gerador(semente: number): () => number {
  let s = semente >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s;
  };
}

function baseAleatoria(rand: () => number, tamanho: number): string {
  let out = "";
  for (let i = 0; i < tamanho; i++) out += String(rand() % 10);
  return out;
}

/** CPF: soma ponderada decrescente a partir de 10 (e 11), resto de (soma * 10) / 11. */
function dvCpfReferencia(base: string): string {
  const dv = (digitos: string): number => {
    let peso = digitos.length + 1;
    let soma = 0;
    for (const c of digitos) soma += Number(c) * peso--;
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const d1 = dv(base);
  return `${d1}${dv(base + d1)}`;
}

/** CNPJ: pesos de 2 a 9 aplicados da direita para a esquerda, reiniciando em 2. */
function dvCnpjReferencia(base: string): string {
  const dv = (digitos: string): number => {
    let peso = 2;
    let soma = 0;
    for (const c of [...digitos].reverse()) {
      soma += Number(c) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = dv(base);
  return `${d1}${dv(base + d1)}`;
}

function alteraUltimo(doc: string): string {
  const ultimo = Number(doc.at(-1));
  return doc.slice(0, -1) + String((ultimo + 1) % 10);
}

function repetido(s: string): boolean {
  return /^(\d)\1+$/.test(s);
}

describe("CPF", () => {
  const rand = gerador(20251);
  const casos = Array.from({ length: 300 }, () => baseAleatoria(rand, 9)).filter(
    (b) => !repetido(b),
  );

  it("calcula os mesmos DVs da implementação de referência", () => {
    for (const base of casos) {
      expect(calcularDvCpf(base)).toBe(dvCpfReferencia(base));
    }
  });

  it("aceita CPF sintético válido, com e sem pontuação", () => {
    for (const base of casos.slice(0, 50)) {
      const cpf = base + calcularDvCpf(base);
      expect(validarCpf(cpf)).toBe(true);
      const pontuado = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
      expect(validarCpf(pontuado)).toBe(true);
    }
  });

  it("rejeita DV alterado", () => {
    for (const base of casos.slice(0, 50)) {
      expect(validarCpf(alteraUltimo(base + calcularDvCpf(base)))).toBe(false);
    }
  });

  it("rejeita tamanho errado, letras e sequências repetidas", () => {
    expect(validarCpf("")).toBe(false);
    expect(validarCpf("1234567890")).toBe(false);
    expect(validarCpf("abcdefghijk")).toBe(false);
    for (let d = 0; d <= 9; d++) expect(validarCpf(String(d).repeat(11))).toBe(false);
  });
});

describe("CNPJ", () => {
  const rand = gerador(77);
  const casos = Array.from({ length: 300 }, () => baseAleatoria(rand, 12)).filter(
    (b) => !repetido(b),
  );

  it("calcula os mesmos DVs da implementação de referência", () => {
    for (const base of casos) {
      expect(calcularDvCnpj(base)).toBe(dvCnpjReferencia(base));
    }
  });

  it("aceita CNPJ sintético válido, com e sem pontuação", () => {
    for (const base of casos.slice(0, 50)) {
      const cnpj = base + calcularDvCnpj(base);
      expect(validarCnpj(cnpj)).toBe(true);
      const p = `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
      expect(validarCnpj(p)).toBe(true);
    }
  });

  it("rejeita DV alterado, tamanho errado e sequências repetidas", () => {
    for (const base of casos.slice(0, 50)) {
      expect(validarCnpj(alteraUltimo(base + calcularDvCnpj(base)))).toBe(false);
    }
    expect(validarCnpj("123")).toBe(false);
    for (let d = 0; d <= 9; d++) expect(validarCnpj(String(d).repeat(14))).toBe(false);
  });
});

describe("validarDocumento", () => {
  it("detecta o tipo pelo tamanho", () => {
    const cpf = `987654321${calcularDvCpf("987654321")}`;
    const cnpj = `112233440001${calcularDvCnpj("112233440001")}`;
    expect(validarDocumento(cpf)).toEqual({ tipo: "cpf", valido: true, normalizado: cpf });
    expect(validarDocumento(cnpj)).toEqual({ tipo: "cnpj", valido: true, normalizado: cnpj });
    expect(validarDocumento("12345")).toEqual({
      tipo: "desconhecido",
      valido: false,
      normalizado: "12345",
    });
  });

  it("exige base com tamanho correto ao calcular DV", () => {
    expect(() => calcularDvCpf("123")).toThrow();
    expect(() => calcularDvCnpj("123")).toThrow();
  });
});
