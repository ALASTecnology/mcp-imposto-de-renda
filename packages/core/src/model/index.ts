/**
 * model/: modelo tipado da declaração (DIRPF 2026, ano-calendário 2025).
 *
 * Cada ficha tem um schema zod (`zNome`) e o tipo inferido (`Nome`). Valores
 * monetários são sempre `Centavos`. O schema garante a forma dos dados; as
 * regras de consistência ficam em `validate/`.
 */
export * from "./atividade-rural.js";
export * from "./bens-dividas.js";
export * from "./comum.js";
export * from "./declaracao.js";
export * from "./espolio-saida.js";
export * from "./ganhos-capital.js";
export * from "./identificacao.js";
export * from "./isentos-exclusivos.js";
export * from "./pagamentos-doacoes.js";
export * from "./pessoas.js";
export * from "./renda-variavel.js";
export * from "./rendimentos.js";
export * from "./resumo.js";
