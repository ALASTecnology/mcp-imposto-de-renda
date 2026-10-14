/**
 * Fichas Dependentes (registro 25; Ajuda págs. 47 a 49; nota F-DEP) e
 * Alimentandos (registro 35; Ajuda pág. 50; nota F-ALIM).
 */
import { z } from "zod";
import { zCnpj, zCodigo, zCpf, zData, zTexto, zUf } from "./comum.js";
import { zTelefone } from "./identificacao.js";

/** Um dependente da ficha Dependentes. */
export const zDependente = z.object({
  /** Código da relação de dependência (tabela dependentes: 11, 21 a 26, 31, 41, 51). */
  codigo: zCodigo(2),
  nome: zTexto(60),
  /** CPF obrigatório para todo dependente (o schema exige o formato; o DV é validado à parte). */
  cpf: zCpf,
  dataNascimento: zData,
  /** Raça/cor autodeclarada (tabela raca-cor). */
  racaCor: z
    .string()
    .regex(/^[0-5]$/)
    .optional(),
  /** Dependente mora com o titular da declaração? */
  moraComTitular: z.boolean().default(true),
  celular: zTelefone.optional(),
  email: z.string().trim().max(90).optional(),
  /** NIT/PIS/PASEP do dependente (informado na ficha PF/Exterior). */
  nitPisPasep: z
    .string()
    .regex(/^\d{11}$/)
    .optional(),
  /** Só na Saída Definitiva: saiu do país na mesma data que o declarante? */
  saiuDoPaisComDeclarante: z.boolean().optional(),
});
export type Dependente = z.infer<typeof zDependente>;

/** Dados da decisão judicial que fixou os alimentos. */
export const zDecisaoJudicial = z.object({
  numeroProcesso: zTexto(25),
  varaCivil: zTexto(4),
  comarca: zTexto(30),
  uf: zUf,
  dataDecisao: zData,
});
export type DecisaoJudicial = z.infer<typeof zDecisaoJudicial>;

/** Dados da escritura pública lavrada em cartório (art. 733 do CPC). */
export const zEscrituraPublica = z.object({
  cnpjCartorio: zCnpj,
  nomeCartorio: zTexto(60),
  livro: zTexto(7),
  folhas: zTexto(7),
  uf: zUf,
  /** Código do município na tabela do programa. */
  municipio: zCodigo(4),
  dataLavratura: zData,
});
export type EscrituraPublica = z.infer<typeof zEscrituraPublica>;

/** Um alimentando (beneficiário de pensão por decisão judicial ou escritura pública). */
export const zAlimentando = z.object({
  residencia: z.enum(["brasil", "exterior"]),
  nome: zTexto(60),
  /** CPF obrigatório (residente no Brasil ou no exterior). */
  cpf: zCpf,
  dataNascimento: zData,
  /** Vínculo: ao titular ou a um dependente (CPF do dependente). */
  vinculo: z.discriminatedUnion("tipo", [
    z.object({ tipo: z.literal("titular") }),
    z.object({ tipo: z.literal("dependente"), cpf: zCpf }),
  ]),
  /** Tipo de processo: decisão judicial, escritura pública ou ambos (registro 35, J/C/A). */
  tipoProcesso: z.enum(["decisaoJudicial", "escrituraPublica", "ambos"]),
  decisaoJudicial: zDecisaoJudicial.optional(),
  escrituraPublica: zEscrituraPublica.optional(),
});
export type Alimentando = z.infer<typeof zAlimentando>;
