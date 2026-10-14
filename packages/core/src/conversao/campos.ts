/**
 * Leitura e escrita de campos de registro em valores lógicos do modelo.
 *
 * O codec entrega `string` (formatos C, A, I e datas), `bigint` (numéricos) ou `null` (campo em
 * branco). Estas funções fazem a ponte com o modelo: textos sem espaços, códigos com zeros à
 * esquerda, datas ISO `AAAA-MM-DD` e centavos.
 */
import type { Registro, ValorCampo } from "../dbk/codec.js";
import type { CampoLeiaute } from "../dbk/leiaute.js";

/** Objeto genérico na forma de entrada do schema `zDeclaracao`. */
export type Objeto = Record<string, unknown>;

/** Valor lógico aceito ao montar um registro. `undefined` grava o padrão do campo. */
export type ValorLogico = string | bigint | number | boolean | null | undefined;

/** Valores de um registro, pela chave do campo no leiaute. */
export type Valores = Record<string, ValorLogico>;

/** Texto do campo sem espaços nas pontas; número vira texto; branco vira "". */
export function texto(r: Registro | undefined, chave: string): string {
  const v = r?.campos[chave];
  if (v === null || v === undefined) return "";
  return typeof v === "bigint" ? v.toString() : v.trim();
}

/** Número do campo; texto só de dígitos também é aceito; branco ou inválido vira 0. */
export function numero(r: Registro | undefined, chave: string): bigint {
  const v = r?.campos[chave];
  if (typeof v === "bigint") return v;
  if (typeof v === "string" && /^\d+$/.test(v.trim())) return BigInt(v.trim());
  return 0n;
}

/** Número do campo como `number` (contagens, quantidades e chaves pequenas). */
export function inteiro(r: Registro | undefined, chave: string): number {
  return Number(numero(r, chave));
}

/** Texto vazio vira `undefined` (campo opcional do modelo). */
export function opcional(v: string): string | undefined {
  return v === "" ? undefined : v;
}

/** Valor positivo ou `undefined`. */
export function positivo(v: bigint): bigint | undefined {
  return v > 0n ? v : undefined;
}

/** Só os dígitos, se o total for um dos tamanhos aceitos. */
export function digitos(v: string, tamanhos: readonly number[]): string | undefined {
  const d = v.replace(/\D/g, "");
  return tamanhos.includes(d.length) ? d : undefined;
}

/** Código numérico com zeros à esquerda (ex.: 9 vira "09"). */
export function codigo(v: bigint | number | string, tamanho: number): string {
  return v.toString().trim().padStart(tamanho, "0");
}

/** Código do campo com `tamanho` dígitos, ou `undefined` se zerado ou em branco. */
export function codigoOpcional(r: Registro, chave: string, tamanho: number): string | undefined {
  const t = texto(r, chave);
  if (t === "" || /^0+$/.test(t)) return undefined;
  return codigo(t, tamanho).slice(-tamanho);
}

/** "15031985" vira "1985-03-15"; zeros, branco ou forma inválida viram `undefined`. */
export function isoDeDdmmaaaa(v: string): string | undefined {
  const m = /^(\d{2})(\d{2})(\d{4})$/.exec(v);
  if (!m || v === "00000000") return undefined;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/** "19850315" vira "1985-03-15". */
export function isoDeAaaammdd(v: string): string | undefined {
  const m = /^(\d{4})(\d{2})(\d{2})$/.exec(v);
  if (!m || v === "00000000") return undefined;
  return `${m[1]}-${m[2]}-${m[3]}`;
}

/** "1985-03-15" vira "15031985"; ausente vira `null` (campo em branco). */
export function ddmmaaaaDeIso(v: string | undefined): string | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? `${m[3]}${m[2]}${m[1]}` : null;
}

/** "1985-03-15" vira "19850315". */
export function aaaammddDeIso(v: string | undefined): string | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? `${m[1]}${m[2]}${m[3]}` : null;
}

/** Remove as chaves com `undefined` (o schema trata ausência e `undefined` de forma diferente). */
export function semIndefinidos(o: Objeto): Objeto {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
}

/** "S", "1" ou "T"rue viram verdadeiro. */
export function indicador(r: Registro, chave: string): boolean {
  const t = texto(r, chave);
  return t === "1" || t === "S";
}

/** Converte o valor lógico no valor do campo, respeitando formato e tamanho do leiaute. */
export function valorDoCampo(campo: CampoLeiaute, valor: ValorLogico): ValorCampo {
  const numerico = campo.formato === "N";
  if (valor === null) return numerico ? null : "";
  if (valor === undefined) return numerico ? (campo.data ? null : 0n) : "";
  if (numerico && campo.data === undefined) {
    // Só campos com casas decimais aceitam sinal (o programa grava "-000000300000").
    const comSinal = campo.decimais !== undefined;
    if (typeof valor === "bigint") return valor < 0n && !comSinal ? 0n : valor;
    if (typeof valor === "number") {
      const n = BigInt(Math.trunc(valor));
      return n < 0n && !comSinal ? 0n : n;
    }
    if (typeof valor === "boolean") return valor ? 1n : 0n;
    const d = valor.replace(/\D/g, "");
    return d === "" ? 0n : BigInt(d);
  }
  if (numerico) {
    const t = typeof valor === "boolean" ? "" : valor.toString();
    return /^\d{8}$/.test(t) ? t : null;
  }
  const t = typeof valor === "boolean" ? (valor ? "S" : "N") : valor.toString();
  return t.length > campo.tamanho ? t.slice(0, campo.tamanho) : t;
}

function vazio(v: ValorCampo | undefined): boolean {
  return v === null || v === undefined || v === 0n || v === "" || v === "00000000";
}

/**
 * Dois valores de campo representam a mesma informação? Branco, zero e data zerada são
 * equivalentes, para que regravar um arquivo preserve a forma que o programa usou.
 */
export function equivalentes(a: ValorCampo | undefined, b: ValorCampo | undefined): boolean {
  if (a === b) return true;
  return vazio(a) && vazio(b);
}
