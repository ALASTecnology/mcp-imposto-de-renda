/**
 * Aritmética monetária do motor de cálculo.
 *
 * Tudo em centavos inteiros (`bigint`). A única operação que pode gerar fração
 * de centavo é a aplicação de percentual. No ajuste anual (alíquotas da tabela,
 * desconto de 20%, limite de 12% e limites de incentivo) o programa oficial
 * descarta a fração, e o motor usa `percentualTruncado` (confirmado nos casos
 * de referência). Juros e multa das quotas passam por `percentual`, que
 * arredonda para o centavo mais próximo com meio centavo para cima. Essa regra está documentada em
 * docs/regras/irpf-2026.md e fica concentrada aqui para que uma eventual
 * correção, se os casos de referência indicarem outra, aconteça em um ponto só.
 */
import { type Centavos, centavos } from "../centavos.js";

/** Erro de entrada ou de regra violada no motor de cálculo. */
export class CalculoInvalidoError extends Error {
  override readonly name = "CalculoInvalidoError";
}

/**
 * Divide `numerador` por `denominador` (positivo) arredondando a metade para
 * longe do zero.
 */
export function dividirArredondando(numerador: bigint, denominador: bigint): bigint {
  if (denominador <= 0n) throw new CalculoInvalidoError("Denominador deve ser positivo");
  const negativo = numerador < 0n;
  const abs = negativo ? -numerador : numerador;
  const q = (abs * 2n + denominador) / (denominador * 2n);
  return negativo ? -q : q;
}

/**
 * Aplica um percentual expresso como fração `numerador / denominador` sobre um
 * valor em centavos. Exemplo: 7,5% é `percentual(v, 75n, 1000n)`.
 */
export function percentual(valor: Centavos, numerador: bigint, denominador: bigint): Centavos {
  return centavos(dividirArredondando(valor * numerador, denominador));
}

/**
 * Aplica um percentual descartando a fração de centavo (truncamento em direção
 * ao zero). É a regra do programa oficial no ajuste anual: todos os casos de
 * referência com fração de centavo (imposto da tabela, 20%, 12%, 3%) conferem
 * só com truncamento (docs/regras/irpf-2026.md).
 */
export function percentualTruncado(
  valor: Centavos,
  numerador: bigint,
  denominador: bigint,
): Centavos {
  if (denominador <= 0n) throw new CalculoInvalidoError("Denominador deve ser positivo");
  return centavos((valor * numerador) / denominador);
}

export function minimo(a: Centavos, b: Centavos): Centavos {
  return a < b ? a : b;
}

export function maximo(a: Centavos, b: Centavos): Centavos {
  return a > b ? a : b;
}

/** Valor nunca negativo. */
export function naoNegativo(v: Centavos): Centavos {
  return v < 0n ? centavos(0n) : v;
}

export const ZERO: Centavos = centavos(0n);

/**
 * Lê um valor monetário da entrada do motor: texto com inteiro de centavos
 * ("123456" = R$ 1.234,56). Campo ausente ou vazio vale zero.
 */
export function lerCentavos(texto: string | undefined, campo: string): Centavos {
  if (texto === undefined || texto === "") return ZERO;
  if (!/^-?\d+$/.test(texto)) {
    throw new CalculoInvalidoError(
      `Campo ${campo}: esperado inteiro de centavos (ex.: "123456" = R$ 1.234,56), recebido "${texto}"`,
    );
  }
  return centavos(BigInt(texto));
}

/** Formata um percentual em centésimos de ponto ("617" vira "6,17%"). */
export function formatarCentesimosPercentual(v: bigint): string {
  const negativo = v < 0n;
  const abs = negativo ? -v : v;
  return `${negativo ? "-" : ""}${abs / 100n},${(abs % 100n).toString().padStart(2, "0")}%`;
}
