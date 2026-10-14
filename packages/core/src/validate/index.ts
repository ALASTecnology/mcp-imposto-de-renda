/**
 * validate/: regras de consistência da declaração.
 *
 * Verificações equivalentes às críticas do programa gerador (campos
 * obrigatórios, códigos de tabela, documentos, coerência entre fichas), cada
 * uma com código, gravidade (`erro` impede a entrega, `aviso` indica risco de
 * malha), mensagem em pt-BR, ficha e caminho do campo. O catálogo `REGRAS`
 * documenta a fonte de cada regra.
 */
export {
  type ContaParaValidar,
  dvContaBancoDoBrasil,
  dvContaBradesco,
  dvContaItau,
  type ProblemaConta,
  validarContaBancaria,
} from "./conta-bancaria.js";
export { REGRA_FORMA_MODELO, REGRAS, validarDeclaracao } from "./declaracao.js";
export * from "./documento.js";
export {
  type Gravidade,
  type Pendencia,
  podeEntregar,
  type Regra,
  separarPendencias,
} from "./pendencia.js";
export { problemaNome } from "./util.js";
