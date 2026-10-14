/**
 * Validação de dígitos verificadores de CPF e CNPJ (módulo 11).
 *
 * Só confere a estrutura numérica. Não consulta nenhuma base externa e não diz
 * nada sobre a existência ou a situação cadastral do documento.
 */

/** Remove pontuação comum (".", "-", "/" e espaços). */
export function somenteDigitos(texto: string): string {
  return texto.replace(/[.\-/\s]/g, "");
}

function digitoMod11(digitos: readonly number[], pesos: readonly number[]): number {
  let soma = 0;
  for (let i = 0; i < pesos.length; i++) {
    soma += (digitos[i] ?? 0) * (pesos[i] ?? 0);
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

function paraDigitos(texto: string, tamanho: number): number[] | undefined {
  const limpo = somenteDigitos(texto);
  if (limpo.length !== tamanho || !/^\d+$/.test(limpo)) return undefined;
  // Sequências repetidas (00000000000, 11111111111...) passam no módulo 11 mas são inválidas.
  if (/^(\d)\1+$/.test(limpo)) return undefined;
  return [...limpo].map(Number);
}

const PESOS_CPF_1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CPF_2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/** Calcula os dois dígitos verificadores de um CPF a partir dos 9 primeiros dígitos. */
export function calcularDvCpf(base: string): string {
  const d = [...base].map(Number);
  if (d.length !== 9 || d.some(Number.isNaN)) throw new Error("Base de CPF exige 9 dígitos");
  const dv1 = digitoMod11(d, PESOS_CPF_1);
  const dv2 = digitoMod11([...d, dv1], PESOS_CPF_2);
  return `${dv1}${dv2}`;
}

/** Calcula os dois dígitos verificadores de um CNPJ a partir dos 12 primeiros dígitos. */
export function calcularDvCnpj(base: string): string {
  const d = [...base].map(Number);
  if (d.length !== 12 || d.some(Number.isNaN)) throw new Error("Base de CNPJ exige 12 dígitos");
  const dv1 = digitoMod11(d, PESOS_CNPJ_1);
  const dv2 = digitoMod11([...d, dv1], PESOS_CNPJ_2);
  return `${dv1}${dv2}`;
}

/** Indica se o CPF (com ou sem pontuação) tem dígitos verificadores corretos. */
export function validarCpf(cpf: string): boolean {
  const d = paraDigitos(cpf, 11);
  if (!d) return false;
  return calcularDvCpf(d.slice(0, 9).join("")) === d.slice(9).join("");
}

/** Indica se o CNPJ numérico (com ou sem pontuação) tem dígitos verificadores corretos. */
export function validarCnpj(cnpj: string): boolean {
  const d = paraDigitos(cnpj, 14);
  if (!d) return false;
  return calcularDvCnpj(d.slice(0, 12).join("")) === d.slice(12).join("");
}

export type TipoDocumento = "cpf" | "cnpj";

export interface ResultadoValidacao {
  readonly tipo: TipoDocumento | "desconhecido";
  readonly valido: boolean;
  readonly normalizado: string;
}

/** Detecta pelo tamanho se é CPF ou CNPJ e valida. */
export function validarDocumento(documento: string): ResultadoValidacao {
  const normalizado = somenteDigitos(documento);
  if (normalizado.length === 11) {
    return { tipo: "cpf", valido: validarCpf(normalizado), normalizado };
  }
  if (normalizado.length === 14) {
    return { tipo: "cnpj", valido: validarCnpj(normalizado), normalizado };
  }
  return { tipo: "desconhecido", valido: false, normalizado };
}
