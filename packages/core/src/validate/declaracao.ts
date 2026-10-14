/**
 * Ponto de entrada das validações de consistência da declaração.
 *
 * `validarDeclaracao` recebe uma declaração já aceita pelo schema
 * (`zDeclaracao.parse`) e devolve a lista de pendências, em ordem de ficha.
 * `REGRAS` é o catálogo completo, com gravidade, descrição e fonte de cada
 * regra.
 */
import { type Declaracao, FICHAS, type Ficha, zDeclaracao } from "../model/declaracao.js";
import { type Pendencia, pendencia, type Regra, regra } from "./pendencia.js";
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

/**
 * Pendência de forma: a entrada não passa no schema do modelo (`zDeclaracao`). Entra no
 * catálogo `REGRAS` para que toda pendência possível tenha descrição e fonte documentadas.
 */
export const REGRA_FORMA_MODELO: Regra = regra({
  codigo: "MODELO-FORMA",
  gravidade: "erro",
  ficha: "identificacao",
  descricao: "A entrada não segue o modelo da declaração (tipo, tamanho, formato ou data).",
  fonte: "Schema zDeclaracao (packages/core/src/model)",
});

/** Catálogo de todas as regras de validação. */
export const REGRAS: readonly Regra[] = Object.freeze([
  REGRA_FORMA_MODELO,
  ...REGRAS_IDENTIFICACAO,
  ...REGRAS_PESSOAS,
  ...REGRAS_RENDIMENTOS,
  ...REGRAS_PAGAMENTOS_DOACOES,
  ...REGRAS_BENS_DIVIDAS,
  ...REGRAS_ESPECIAIS,
  ...REGRAS_DEMONSTRATIVOS,
  ...REGRAS_RESUMO,
]);

/** Converte os problemas do schema em pendências, sem repetir o valor recebido. */
function pendenciasDeForma(problemas: readonly { path: PropertyKey[]; message: string }[]) {
  return problemas.slice(0, 100).map((problema) => {
    const partes = problema.path.map((p) => (typeof p === "symbol" ? "?" : String(p)));
    const caminho = partes
      .map((p, i) => (/^\d+$/.test(p) ? `[${p}]` : i === 0 ? p : `.${p}`))
      .join("");
    const primeira = partes[0] ?? "";
    const ficha: Ficha = Object.hasOwn(FICHAS, primeira) ? (primeira as Ficha) : "identificacao";
    return {
      ...pendencia(
        REGRA_FORMA_MODELO,
        caminho || "declaracao",
        `Campo fora do modelo: ${problema.message}.`,
      ),
      ficha,
    };
  });
}

/**
 * Valida a declaração inteira e devolve todas as pendências (erros e avisos). Nunca lança: a
 * entrada passa antes pelo schema e, se não for uma declaração bem formada, o resultado são
 * pendências `MODELO-FORMA` com o caminho de cada campo problemático. O schema é idempotente,
 * então uma declaração já aceita por `zDeclaracao.parse` dá o mesmo resultado de antes.
 */
export function validarDeclaracao(declaracao: Declaracao | unknown): Pendencia[] {
  const forma = zDeclaracao.safeParse(declaracao);
  if (!forma.success) return pendenciasDeForma(forma.error.issues);
  const ctx = criarContexto(forma.data);
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
