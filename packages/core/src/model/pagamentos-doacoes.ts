/**
 * Fichas Pagamentos Efetuados (registro 26), Doações Efetuadas (registro 90),
 * Doações Diretamente na Declaração ao ECA e à pessoa idosa (registros 91 e
 * 92), Doações a Partidos Políticos e Candidatos (registro 34) e Imposto
 * Pago/Retido (registros 17 e 19). Códigos da tabela pagamentos.json.
 */
import { z } from "zod";
import { zCnpj, zCodigo, zCodigoPais, zCpf, zCpfOuCnpj, zTexto, zUf, zValor } from "./comum.js";

/** Códigos da tabela de pagamentos que pertencem à ficha Doações Efetuadas. */
export const CODIGOS_DOACAO = [
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "80",
  "81",
  "99",
] as const;

/** Com quem a despesa foi realizada (registro 26, IN_TIPO_PGTO: T, D ou A). */
export const zRealizadoCom = z.discriminatedUnion("tipo", [
  z.object({ tipo: z.literal("titular") }),
  z.object({ tipo: z.literal("dependente"), cpf: zCpf }),
  z.object({ tipo: z.literal("alimentando"), cpf: zCpf }),
]);
export type RealizadoCom = z.infer<typeof zRealizadoCom>;

/** Um pagamento da ficha Pagamentos Efetuados. */
export const zPagamento = z.object({
  /** Código da tabela pagamentos (01, 02, 09 a 22, 26, 30 a 37, 60 a 76, 99). */
  codigo: zCodigo(2),
  realizadoCom: zRealizadoCom.default({ tipo: "titular" }),
  /** CPF/CNPJ do beneficiário do pagamento (prestador); dispensado para pagamentos no exterior. */
  niBeneficiario: zCpfOuCnpj.optional(),
  nomeBeneficiario: zTexto(60),
  /** NIT do empregado doméstico, quando aplicável. */
  nitEmpregadoDomestico: z
    .string()
    .regex(/^\d{11}$/)
    .optional(),
  valorPago: zValor,
  /** Parcela não dedutível ou valor reembolsado. */
  parcelaNaoDedutivel: zValor,
  /** Contribuição do ente público patrocinador (código 37, Funpresp). */
  contribuicaoPatrocinador: zValor,
  descricao: z.string().trim().max(512).optional(),
  /** País, para pagamentos no exterior. */
  pais: zCodigoPais.optional(),
});
export type Pagamento = z.infer<typeof zPagamento>;

/** Uma doação da ficha Doações Efetuadas. */
export const zDoacaoEfetuada = z.object({
  /** Código de doação (40 a 47, 80, 81 ou 99 da tabela pagamentos). */
  codigo: z.enum(CODIGOS_DOACAO),
  niBeneficiario: zCpfOuCnpj,
  nomeBeneficiario: zTexto(60),
  valor: zValor,
  parcelaNaoDedutivel: zValor,
});
export type DoacaoEfetuada = z.infer<typeof zDoacaoEfetuada>;

/** Doação feita diretamente na declaração a fundo do ECA ou da pessoa idosa. */
export const zDoacaoDiretaNaDeclaracao = z.object({
  tipoFundo: z.enum(["nacional", "estadual", "municipal"]),
  /** UF do fundo estadual/distrital ou municipal. */
  uf: zUf.optional(),
  /** Código do município (fundo municipal). */
  municipio: z.string().trim().max(40).optional(),
  cnpjFundo: zCnpj,
  valor: zValor,
});
export type DoacaoDiretaNaDeclaracao = z.infer<typeof zDoacaoDiretaNaDeclaracao>;

/** Doações diretamente na declaração (ECA e pessoa idosa), só no modelo completo. */
export const zDoacoesDiretamenteNaDeclaracao = z.object({
  eca: z.array(zDoacaoDiretaNaDeclaracao).default([]),
  idoso: z.array(zDoacaoDiretaNaDeclaracao).default([]),
});
export type DoacoesDiretamenteNaDeclaracao = z.infer<typeof zDoacoesDiretamenteNaDeclaracao>;

/** Doação a partido político ou candidato a cargo eletivo (não dedutível). */
export const zDoacaoPartido = z.object({
  cnpj: zCnpj,
  nome: zTexto(60),
  valor: zValor,
});
export type DoacaoPartido = z.infer<typeof zDoacaoPartido>;

/**
 * Ficha Imposto Pago/Retido: linhas digitadas (01 a 03). As linhas 04 a 07 são
 * calculadas a partir de outras fichas e não ficam no modelo.
 */
export const zImpostoPago = z.object({
  /** Linha 01: imposto complementar (Darf 0246) pago no ano-calendário. */
  impostoComplementar: zValor,
  /** Linha 02: imposto pago no exterior pelo titular e dependentes (valor digitado). */
  impostoPagoExterior: zValor,
  /** Linha 03: imposto na fonte da Lei 11.033/2004. */
  impostoRetidoLei11033: zValor,
});
export type ImpostoPago = z.infer<typeof zImpostoPago>;
