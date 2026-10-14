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
/**
 * Fator aplicado aos orçamentos de tempo. Em máquina lenta ou muito carregada, defina
 * `MCP_IMPOSTO_DE_RENDA_FATOR_TEMPO` (por exemplo 3). O padrão 1 mantém os limites originais,
 * que já têm folga para pausas de coleta de lixo.
 */
export const FATOR_TEMPO = Math.max(1, Number(process.env.MCP_IMPOSTO_DE_RENDA_FATOR_TEMPO) || 1);

/** Orçamento de tempo em milissegundos, ajustado por {@link FATOR_TEMPO}. */
export function orcamento(ms: number): number {
  return ms * FATOR_TEMPO;
}

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

/**
 * Remove comentários e o conteúdo literal de strings e templates, preservando as quebras de
 * linha (para os números de linha) e as expressões `${...}` dos templates.
 */
export function somenteCodigo(fonte: string): string {
  let saida = "";
  let i = 0;
  const pilhaTemplate: number[] = [];
  let chaves = 0;
  const pular = (fim: number) => {
    saida += fonte.slice(i, fim).replace(/[^\n]/g, " ");
    i = fim;
  };
  while (i < fonte.length) {
    const c = fonte[i];
    const d = fonte[i + 1];
    if (c === "/" && d === "/") {
      const fim = fonte.indexOf("\n", i);
      pular(fim < 0 ? fonte.length : fim);
    } else if (c === "/" && d === "*") {
      const fim = fonte.indexOf("*/", i + 2);
      pular(fim < 0 ? fonte.length : fim + 2);
    } else if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < fonte.length && fonte[j] !== c) j += fonte[j] === "\\" ? 2 : 1;
      saida += c;
      i++;
      pular(j);
      saida += c;
      i = j + 1;
    } else if (c === "`" || (c === "}" && pilhaTemplate.at(-1) === chaves)) {
      // Início de template ou volta de uma expressão `${...}`: pula o texto até `${` ou "`".
      if (c === "}") pilhaTemplate.pop();
      saida += c;
      i++;
      let j = i;
      while (j < fonte.length && fonte[j] !== "`" && !(fonte[j] === "$" && fonte[j + 1] === "{")) {
        j += fonte[j] === "\\" ? 2 : 1;
      }
      pular(j);
      if (fonte[j] === "$") {
        saida += "${";
        i = j + 2;
        pilhaTemplate.push(chaves);
      } else {
        saida += "`";
        i = j + 1;
      }
    } else {
      if (c === "{") chaves++;
      if (c === "}") chaves--;
      saida += c;
      i++;
    }
  }
  return saida;
}
