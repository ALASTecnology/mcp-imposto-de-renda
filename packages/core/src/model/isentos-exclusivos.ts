/**
 * Fichas Rendimentos Isentos e Não Tributáveis (registros 23, 31, 33, 37, 82 a
 * 89, 93, 94, 97 e 98) e Rendimentos Sujeitos à Tributação Exclusiva/Definitiva
 * (registros 24, 95 a 97 e 99). Códigos e campos conforme a Ajuda 2026 (nota 03
 * F-ISENTO-* e F-EXCL-*). Cada código tem um schema próprio; a união é
 * discriminada pelo campo `codigo`.
 */
import { z } from "zod";
import { zBeneficiario, zCpf, zPessoa, zTexto, zValor } from "./comum.js";

/** Chave do bem da ficha Bens e Direitos que originou o lançamento (vínculo bem/rendimento). */
const zChaveBem = z.number().int().positive().optional();

/** Isentos com fonte pagadora obrigatória. */
const zIsentoComFonte = z.object({
  codigo: z.literal(["01", "02", "04", "09", "12", "13", "17", "18"]),
  beneficiario: zBeneficiario,
  fonte: zPessoa,
  valor: zValor,
  chaveBem: zChaveBem,
});

/** Isentos em que a fonte pagadora é informada quando existir (03, 16 e 25). */
const zIsentoFonteOpcional = z.object({
  codigo: z.literal(["03", "16", "25"]),
  beneficiario: zBeneficiario,
  fonte: zPessoa.optional(),
  valor: zValor,
});

/** 10: parcela isenta de aposentadoria de declarante com 65 anos ou mais. */
const zIsento10 = z.object({
  codigo: z.literal("10"),
  beneficiario: zBeneficiario,
  fonte: zPessoa,
  /** Valor anual sem o 13º salário. */
  valor: zValor,
  decimoTerceiro: zValor,
});

/** 11: pensão, aposentadoria ou reforma por moléstia grave ou acidente em serviço. */
const zIsento11 = z.object({
  codigo: z.literal("11"),
  beneficiario: zBeneficiario,
  fonte: zPessoa,
  valor: zValor,
  impostoRetido: zValor,
  decimoTerceiro: zValor,
  impostoRetidoDecimoTerceiro: zValor,
  contribuicaoPrevidenciaria: zValor,
});

/** 14: transferências patrimoniais, doações e heranças (CPF/CNPJ do doador ou espólio). */
const zIsento14 = z.object({
  codigo: z.literal("14"),
  beneficiario: zBeneficiario,
  doador: zPessoa,
  valor: zValor,
});

/** 19, 20 e 21: meação e dissolução; ganhos com ações e com ouro até R$ 20.000,00 por mês. */
const zIsentoSemFonte = z.object({
  codigo: z.literal(["19", "20", "21"]),
  beneficiario: zBeneficiario,
  valor: zValor,
});

/** 23 e 24: parcela isenta do transporte de carga (até 90%) e de passageiros (até 40%). */
const zIsentoTransporte = z.object({
  codigo: z.literal(["23", "24"]),
  beneficiario: zBeneficiario,
  fonte: zPessoa.optional(),
  valor: zValor,
});

/** 28: pensão alimentícia recebida (ADI 5.422/DF), com o CPF de quem pagou. */
const zIsento28 = z.object({
  codigo: z.literal("28"),
  beneficiario: zBeneficiario,
  cpfAlimentante: zCpf,
  valor: zValor,
});

/** 99: outros rendimentos isentos, com descrição. */
const zIsento99 = z.object({
  codigo: z.literal("99"),
  beneficiario: zBeneficiario,
  fonte: zPessoa,
  descricao: zTexto(60),
  valor: zValor,
  chaveBem: zChaveBem,
});

/**
 * 05, 06 e 07: ganhos de capital isentos, com o valor digitado pelo
 * contribuinte e o valor transportado do demonstrativo de ganhos de capital.
 */
const zIsentoGanhoCapital = z.object({
  codigo: z.literal(["05", "06", "07"]),
  valorInformado: zValor,
  valorTransportado: zValor,
});

/** 08, 15, 22 e 27: valor único (08 digitado; 15, 22 e 27 transportados de outras fichas). */
const zIsentoValorUnico = z.object({
  codigo: z.literal(["08", "15", "22", "27"]),
  valor: zValor,
});

/** Lançamento da ficha Rendimentos Isentos e Não Tributáveis. */
export const zRendimentoIsento = z.discriminatedUnion("codigo", [
  zIsentoComFonte,
  zIsentoFonteOpcional,
  zIsento10,
  zIsento11,
  zIsento14,
  zIsentoSemFonte,
  zIsentoTransporte,
  zIsento28,
  zIsento99,
  zIsentoGanhoCapital,
  zIsentoValorUnico,
]);
export type RendimentoIsento = z.infer<typeof zRendimentoIsento>;
export type CodigoIsento = RendimentoIsento["codigo"];

/** Todos os códigos de rendimento isento da Ajuda 2026 (não existe o 26 na Ajuda). */
export const CODIGOS_ISENTOS: readonly CodigoIsento[] = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "27",
  "28",
  "99",
];

/**
 * Códigos transportados de outras fichas ou demonstrativos, não digitados pelo
 * usuário: 15 (Atividade Rural), 22 (Renda Variável) e 27 (RRA).
 */
export const CODIGOS_ISENTOS_TRANSPORTADOS: readonly CodigoIsento[] = ["15", "22", "27"];

/** Exclusivos com fonte pagadora (CNPJ): aplicações financeiras, JCP e PLR. */
const zExclusivoComFonte = z.object({
  codigo: z.literal(["06", "10", "11"]),
  beneficiario: zBeneficiario,
  fonte: zPessoa,
  /** Valor líquido (rendimento menos imposto). */
  valor: zValor,
  chaveBem: zChaveBem,
});

/** 13: prêmios líquidos em loterias de apostas de quota fixa (Lei 14.790/2023). */
const zExclusivo13 = z.object({
  codigo: z.literal("13"),
  beneficiario: zBeneficiario,
  descricao: zTexto(60),
  valor: zValor,
});

/** 99: outros rendimentos exclusivos, com descrição. */
const zExclusivo99 = z.object({
  codigo: z.literal("99"),
  beneficiario: zBeneficiario,
  fonte: zPessoa,
  descricao: zTexto(60),
  valor: zValor,
});

/** Códigos transportados de outras fichas (13º, GCAP, renda variável, RRA, Lei 14.754/2023). */
const zExclusivoTransportado = z.object({
  codigo: z.literal(["01", "02", "03", "04", "05", "07", "08", "09", "12"]),
  valor: zValor,
});

/** Lançamento da ficha Rendimentos Sujeitos à Tributação Exclusiva/Definitiva. */
export const zRendimentoExclusivo = z.discriminatedUnion("codigo", [
  zExclusivoComFonte,
  zExclusivo13,
  zExclusivo99,
  zExclusivoTransportado,
]);
export type RendimentoExclusivo = z.infer<typeof zRendimentoExclusivo>;
export type CodigoExclusivo = RendimentoExclusivo["codigo"];
