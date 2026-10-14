/**
 * Ponto de entrada das validações de consistência da declaração.
 *
 * `validarDeclaracao` recebe uma declaração já aceita pelo schema
 * (`zDeclaracao.parse`) e devolve a lista de pendências, em ordem de ficha.
 * `REGRAS` é o catálogo completo, com gravidade, descrição e fonte de cada
 * regra.
 */
import type { Declaracao } from "../model/declaracao.js";
import type { Pendencia, Regra } from "./pendencia.js";
import { REGRAS_BENS_DIVIDAS, validarBensDividas } from "./regras/bens-dividas.js";
import { REGRAS_DEMONSTRATIVOS, validarDemonstrativos } from "./regras/demonstrativos.js";
import { REGRAS_ESPECIAIS, validarEspeciais } from "./regras/especiais.js";
import { REGRAS_IDENTIFICACAO, validarIdentificacao } from "./regras/identificacao.js";
import {
  REGRAS_PAGAMENTOS_DOACOES,
  validarPagamentosDoacoes,
} from "./regras/pagamentos-doacoes.js";
import { REGRAS_PESSOAS, validarPessoas } from "./regras/pessoas.js";
import { REGRAS_RENDIMENTOS, validarRendimentos } from "./regras/rendimentos.js";
import { REGRAS_RESUMO, validarResumo } from "./regras/resumo.js";
import { criarContexto } from "./util.js";

/** Catálogo de todas as regras de validação. */
export const REGRAS: readonly Regra[] = Object.freeze([
  ...REGRAS_IDENTIFICACAO,
  ...REGRAS_PESSOAS,
  ...REGRAS_RENDIMENTOS,
  ...REGRAS_PAGAMENTOS_DOACOES,
  ...REGRAS_BENS_DIVIDAS,
  ...REGRAS_ESPECIAIS,
  ...REGRAS_DEMONSTRATIVOS,
  ...REGRAS_RESUMO,
]);

/** Valida a declaração inteira e devolve todas as pendências (erros e avisos). */
export function validarDeclaracao(declaracao: Declaracao): Pendencia[] {
  const ctx = criarContexto(declaracao);
  return [
    ...validarIdentificacao(ctx),
    ...validarPessoas(ctx),
    ...validarRendimentos(ctx),
    ...validarPagamentosDoacoes(ctx),
    ...validarBensDividas(ctx),
    ...validarEspeciais(ctx),
    ...validarDemonstrativos(ctx),
    ...validarResumo(ctx),
  ];
}
