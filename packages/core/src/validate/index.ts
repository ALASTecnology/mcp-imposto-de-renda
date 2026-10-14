/**
 * validate/: regras de consistência da declaração.
 *
 * Destino: verificações equivalentes às críticas do programa gerador (campos
 * obrigatórios, limites, coerência entre fichas), cada uma com código, mensagem
 * em pt-BR e referência à ficha e ao campo. Por enquanto contém apenas a
 * validação de dígitos verificadores de CPF e CNPJ.
 */
export * from "./documento.js";
