/**
 * Renda Variável, operações comuns e day-trade (registros 40 e 41) e FII ou Fiagro (42 e 43).
 *
 * Ainda não mapeado: os registros destes tipos são preservados sem alteração.
 */
import type { Mapeador } from "../contexto.js";

export const mapeadorRendaVariavel: Mapeador = {
  nome: "rendaVariavel",
  tipos: [],
  ler() {},
  gravar() {},
};
