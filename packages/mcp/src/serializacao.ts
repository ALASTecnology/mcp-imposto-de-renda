/**
 * Conversão de valores do core para JSON.
 *
 * O core usa `bigint` (centavos) e o JSON não tem esse tipo. Na saída das ferramentas, todo
 * `bigint` vira `number` quando cabe com exatidão (até 2^53, ou seja, mais de R$ 90 trilhões em
 * centavos) e texto de dígitos caso contrário. Os schemas do modelo (`zCentavos`) aceitam
 * `number` inteiro, então o JSON devolvido pode voltar como entrada sem conversão.
 */

export type Json = null | boolean | number | string | Json[] | { [chave: string]: Json };

/** Converte recursivamente um valor do core em JSON puro (sem bigint, undefined ou funções). */
export function paraJson(valor: unknown): Json {
  if (valor === null || valor === undefined) return null;
  if (typeof valor === "bigint") {
    const n = Number(valor);
    return Number.isSafeInteger(n) ? n : valor.toString();
  }
  if (typeof valor === "number") return Number.isFinite(valor) ? valor : null;
  if (typeof valor === "string" || typeof valor === "boolean") return valor;
  if (Array.isArray(valor)) return valor.map(paraJson);
  if (valor instanceof Set) return [...valor].map(paraJson);
  if (typeof valor === "object") {
    const saida: { [chave: string]: Json } = {};
    for (const [k, v] of Object.entries(valor)) {
      if (v === undefined || typeof v === "function") continue;
      saida[k] = paraJson(v);
    }
    return saida;
  }
  return null;
}

/** Igual a `paraJson`, para quando o resultado precisa ser um objeto (structuredContent). */
export function objetoJson(valor: object): { [chave: string]: Json } {
  const j = paraJson(valor);
  return j !== null && typeof j === "object" && !Array.isArray(j) ? j : {};
}
