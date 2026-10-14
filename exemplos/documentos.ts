/**
 * Gerador determinístico de CPF e CNPJ sintéticos para as declarações de exemplo.
 *
 * Usa as mesmas fórmulas do gerador dos casos de referência (`tools/referencia/src/Documentos.java`):
 * a mesma semente sempre produz o mesmo número. Os números só têm estrutura válida (módulo 11) e
 * não correspondem, de forma intencional, a pessoas ou empresas reais.
 */
import { calcularDvCnpj, calcularDvCpf } from "@mcp-imposto-de-renda/core";

/** CPF de 11 dígitos derivado da semente (1 a 999999). */
export function cpf(semente: number): string {
  const s = BigInt(semente);
  let base = (s * 7_919n + 104_729n * (s % 97n) + 100_000_007n) % 1_000_000_000n;
  let b = base.toString().padStart(9, "0");
  if (new Set(b).size === 1) {
    base = (base + 1n) % 1_000_000_000n;
    b = base.toString().padStart(9, "0");
  }
  return b + calcularDvCpf(b);
}

/** CNPJ de 14 dígitos (matriz 0001) derivado da semente. */
export function cnpj(semente: number): string {
  const raiz = (BigInt(semente) * 15_485_863n + 10_000_019n) % 100_000_000n;
  const b = `${raiz.toString().padStart(8, "0")}0001`;
  return b + calcularDvCnpj(b);
}

/** NIT/PIS/PASEP de 11 dígitos derivado da semente. */
export function nit(semente: number): string {
  let b = ((BigInt(semente) * 104_723n + 1_200_000_003n) % 10_000_000_000n)
    .toString()
    .padStart(10, "0");
  if (b[0] === "0") b = `1${b.slice(1)}`;
  const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const soma = pesos.reduce((s, p, k) => s + p * Number(b[k]), 0);
  const r = 11 - (soma % 11);
  return b + (r >= 10 ? 0 : r);
}
