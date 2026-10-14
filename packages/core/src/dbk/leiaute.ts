/**
 * Tipos da descrição declarativa (leiaute) do arquivo da declaração.
 *
 * O codec é genérico: conhece o arquivo apenas por meio de um `Leiaute`, que lista
 * os tipos de registro de um exercício e os campos de cada um, com posição, tamanho
 * e formato. Os leiautes de cada exercício ficam em `leiautes/`.
 */

/**
 * Formato de um campo, como aparece no leiaute oficial.
 *
 * - `C`: caractere livre, alinhado à esquerda e completado com espaços.
 * - `A`: alfabético, tratado como `C`.
 * - `I`: indicador de um caractere (por exemplo `S`/`N`), tratado como `C`.
 * - `N`: numérico, alinhado à direita e completado com zeros.
 */
export type FormatoCampo = "C" | "A" | "I" | "N";

/** Ordem dos componentes de um campo de data numérico de 8 posições. */
export type FormatoData = "DDMMAAAA" | "AAAAMMDD";

/** Um campo de um tipo de registro. */
export interface CampoLeiaute {
  /** Nome do campo no leiaute oficial (pode se repetir, como `FILLER`). */
  readonly nome: string;
  /** Chave única do campo dentro do registro, usada em `Registro.campos`. */
  readonly chave: string;
  readonly formato: FormatoCampo;
  /** Tamanho em caracteres. */
  readonly tamanho: number;
  /** Posição inicial na linha, contada a partir de 1. */
  readonly inicio: number;
  /** Casas decimais implícitas de um campo numérico (2 para valores em centavos). */
  readonly decimais?: number;
  /** Presente quando o campo numérico guarda uma data. */
  readonly data?: FormatoData;
  readonly descricao: string;
}

/** Um tipo de registro (uma espécie de linha do arquivo). */
export interface TipoRegistroLeiaute {
  /** Identificador gravado nos primeiros caracteres da linha (`IR`, `16`, `T9`...). */
  readonly id: string;
  readonly descricao: string;
  /** Tamanho total da linha, sem o terminador. */
  readonly tamanho: number;
  readonly campos: readonly CampoLeiaute[];
}

/** Leiaute completo de um exercício. */
export interface Leiaute {
  readonly exercicio: number;
  /** Quantidade de caracteres do identificador do tipo no início de cada linha. */
  readonly tamanhoTipo: number;
  readonly tipos: readonly TipoRegistroLeiaute[];
}

const indices = new WeakMap<Leiaute, ReadonlyMap<string, TipoRegistroLeiaute>>();

/** Devolve o tipo de registro pelo identificador, ou `undefined` se não existir. */
export function tipoDoLeiaute(leiaute: Leiaute, id: string): TipoRegistroLeiaute | undefined {
  let indice = indices.get(leiaute);
  if (!indice) {
    indice = new Map(leiaute.tipos.map((t) => [t.id, t]));
    indices.set(leiaute, indice);
  }
  return indice.get(id);
}
