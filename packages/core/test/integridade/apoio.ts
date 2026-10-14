/**
 * Apoio das suítes de integridade e segurança: gerador pseudoaleatório determinístico,
 * leitura das fixtures do programa oficial e medição de tempo.
 *
 * Nada aqui depende de biblioteca externa. A mesma semente produz sempre a mesma sequência,
 * então qualquer falha é reproduzível: a mensagem do teste traz a semente e a iteração.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** mulberry32: gerador de 32 bits pequeno, rápido e determinístico. */
export function gerador(semente: number) {
  let estado = semente >>> 0;
  const proximo = (): number => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  /** Inteiro uniforme em [min, max], inclusive. */
  const inteiro = (min: number, max: number): number =>
    min + Math.floor(proximo() * (max - min + 1));
  /** Elemento uniforme de uma lista não vazia. */
  const escolher = <T>(lista: readonly T[]): T => lista[inteiro(0, lista.length - 1)] as T;
  /** `bigint` não negativo com até `digitos` dígitos decimais. */
  const bigintAte = (digitos: number): bigint => {
    let s = "";
    const n = inteiro(1, digitos);
    for (let i = 0; i < n; i++) s += String(inteiro(0, 9));
    return BigInt(s);
  };
  return { proximo, inteiro, escolher, bigintAte };
}

export type Gerador = ReturnType<typeof gerador>;

/** Pasta das fixtures DBK/DEC gravadas pelo programa oficial com dados sintéticos. */
export const PASTA_FIXTURES = fileURLToPath(new URL("../fixtures/dbk/2026/", import.meta.url));

/** Nomes das fixtures `.DBK` e `.DEC`, em ordem. Lista vazia se a pasta não existir. */
export function nomesFixtures(): string[] {
  if (!existsSync(PASTA_FIXTURES)) return [];
  return readdirSync(PASTA_FIXTURES)
    .filter((nome) => /\.(dbk|dec)$/i.test(nome))
    .sort();
}

export function lerFixture(nome: string): Uint8Array {
  return new Uint8Array(readFileSync(join(PASTA_FIXTURES, nome)));
}

/** Tempo, em milissegundos, de uma execução de `fn`. */
export function medir(fn: () => void): number {
  const inicio = process.hrtime.bigint();
  fn();
  return Number(process.hrtime.bigint() - inicio) / 1e6;
}

/** Bytes iguais, sem comparar elemento a elemento pelo `expect` (lento em arquivos grandes). */
export function mesmosBytes(a: Uint8Array, b: Uint8Array): boolean {
  return Buffer.compare(Buffer.from(a), Buffer.from(b)) === 0;
}

/** Posições (índice do primeiro byte) de cada linha do arquivo terminado em CRLF. */
export function iniciosDeLinha(bytes: Uint8Array): number[] {
  const inicios = [0];
  for (let i = 0; i < bytes.length - 1; i++) {
    if (bytes[i] === 13 && bytes[i + 1] === 10 && i + 2 < bytes.length) inicios.push(i + 2);
  }
  return inicios;
}
