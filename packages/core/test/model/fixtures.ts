/**
 * Dados sintéticos para testes do modelo e das validações. Nenhum documento
 * aqui pertence a uma pessoa real: as bases são sequências arbitrárias e os
 * dígitos verificadores são calculados na hora.
 */

import { type DeclaracaoEntrada, zDeclaracao } from "../../src/model/index.js";
import { calcularDvCnpj, calcularDvCpf } from "../../src/validate/documento.js";

/** CPF sintético com DV correto a partir de 9 dígitos. */
export function cpf(base: string): string {
  return `${base}${calcularDvCpf(base)}`;
}

/** CNPJ sintético com DV correto a partir de 12 dígitos. */
export function cnpj(base: string): string {
  return `${base}${calcularDvCnpj(base)}`;
}

/** CPF com DV propositalmente errado. */
export function cpfInvalido(base: string): string {
  const certo = cpf(base);
  const ultimo = Number(certo.at(-1));
  return `${certo.slice(0, 10)}${(ultimo + 1) % 10}`;
}

export const CPF_TITULAR = cpf("397104821");
export const CPF_CONJUGE = cpf("111444777");
export const CPF_DEP1 = cpf("123456789");
export const CPF_DEP2 = cpf("987654321");
export const CPF_ALIM = cpf("246813579");
export const CPF_MEDICO = cpf("135792468");
export const CNPJ_EMPRESA = cnpj("112223330001");
export const CNPJ_BANCO = cnpj("605746480001");
export const CNPJ_HOSPITAL = cnpj("444555660001");

/** Declaração mínima e consistente de ajuste anual (forma de entrada). */
export function declaracaoBase(): DeclaracaoEntrada {
  return {
    identificacao: {
      cpf: CPF_TITULAR,
      nome: "Maria Teste da Silva",
      dataNascimento: "1980-05-17",
      tipoDeclaracao: { tipo: "ajusteAnual" },
      racaCor: "4",
      endereco: {
        local: "brasil",
        tipoLogradouro: "RUA",
        logradouro: "das Flores",
        numero: "100",
        bairro: "Centro",
        uf: "SP",
        municipio: "7107",
        cep: "01001000",
        email: "maria@example.com",
        celular: { ddd: "11", numero: "912345678" },
      },
      ocupacao: { natureza: "01", ocupacaoPrincipal: "212" },
    },
    resumo: { pix: true },
  };
}

/** Declaração base já validada pelo schema (forma de saída). */
export function declaracaoValida() {
  return zDeclaracao.parse(declaracaoBase());
}
