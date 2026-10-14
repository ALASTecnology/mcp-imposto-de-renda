/**
 * Valores monetários em centavos inteiros.
 *
 * Nenhum cálculo do MCP Imposto de Renda usa ponto flutuante para dinheiro: todo valor é um
 * inteiro de centavos, representado como `bigint` com marca nominal para que o
 * compilador não aceite um número qualquer no lugar de um valor monetário.
 */

declare const marcaCentavos: unique symbol;

/** Quantia em centavos (inteiro, pode ser negativa). */
export type Centavos = bigint & { readonly [marcaCentavos]: true };

/** Erro lançado quando um texto não representa um valor monetário válido. */
export class ValorMonetarioInvalidoError extends Error {
  override readonly name = "ValorMonetarioInvalidoError";
}

/** Cria `Centavos` a partir de um inteiro (`bigint` ou `number` inteiro seguro). */
export function centavos(valor: bigint | number): Centavos {
  if (typeof valor === "number") {
    if (!Number.isSafeInteger(valor)) {
      throw new ValorMonetarioInvalidoError(`Centavos exigem inteiro seguro, recebido: ${valor}`);
    }
    return BigInt(valor) as Centavos;
  }
  return valor as Centavos;
}

const FORMATO_BR = /^(-)?(\d{1,3}(?:\.\d{3})*|\d+)(?:,(\d{1,2}))?$/;

/**
 * Converte texto no formato brasileiro ("1.234,56", "-0,5", "1234") em centavos.
 * Aceita separador de milhar com ponto (opcional) e até duas casas decimais
 * após a vírgula. Rejeita qualquer outro formato em vez de adivinhar.
 */
export function parseCentavos(texto: string): Centavos {
  const limpo = texto.trim();
  const m = FORMATO_BR.exec(limpo);
  if (!m) {
    throw new ValorMonetarioInvalidoError(`Valor monetário inválido: "${texto}"`);
  }
  const [, sinal, inteiros = "0", fracao = ""] = m;
  const reais = BigInt(inteiros.replaceAll(".", ""));
  const cents = BigInt(fracao.padEnd(2, "0"));
  const total = reais * 100n + cents;
  return (sinal ? -total : total) as Centavos;
}

/** Formata centavos no padrão brasileiro: 123456n vira "1.234,56". */
export function formatCentavos(valor: Centavos): string {
  const negativo = valor < 0n;
  const abs = negativo ? -valor : valor;
  const reais = (abs / 100n).toString();
  const cents = (abs % 100n).toString().padStart(2, "0");
  const comMilhar = reais.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negativo ? "-" : ""}${comMilhar},${cents}`;
}

/** Soma valores em centavos. */
export function somaCentavos(...valores: readonly Centavos[]): Centavos {
  return valores.reduce<bigint>((acc, v) => acc + v, 0n) as Centavos;
}
