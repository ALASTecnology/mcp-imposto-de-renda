/**
 * Fichas de situações especiais: Espólio no ajuste anual com natureza 81
 * (registro 30; nota 05 F-ESPOLIO), Declaração Final de Espólio (registros 38
 * e 58; nota 06 E-ESP-*), Saída Definitiva do País (registro 39; nota 01
 * T-SAIDA) e Informações do Cônjuge (registro 29).
 */
import { z } from "zod";
import { zCodigoPais, zCpf, zCpfOuCnpj, zData, zTexto, zValor } from "./comum.js";
import { zDecisaoJudicial, zEscrituraPublica } from "./pessoas.js";

/** Inventariante (ou interessado com poderes de inventariante). */
export const zInventariante = z.object({
  cpf: zCpf,
  nome: zTexto(60),
  endereco: z.string().trim().max(80).optional(),
});
export type Inventariante = z.infer<typeof zInventariante>;

/** Ficha Espólio da declaração de ajuste anual (inicial ou intermediária) com natureza 81. */
export const zEspolioAjuste = z.object({
  /** "Trata-se de uma Sobrepartilha?" (só se já houver DFE de partilha entregue). */
  sobrepartilha: z.boolean().default(false),
  inventariante: zInventariante,
});
export type EspolioAjuste = z.infer<typeof zEspolioAjuste>;

/** Informações do cônjuge ou companheiro na Declaração Final de Espólio. */
export const zConjugeEspolio = z.discriminatedUnion("obitoAmbos", [
  z.object({ obitoAmbos: z.literal(false), meeiro: z.boolean() }),
  z.object({
    obitoAmbos: z.literal(true),
    inventarioConjunto: z.boolean(),
    cpfOutroConjuge: zCpf.optional(),
    nomeOutroConjuge: z.string().trim().max(60).optional(),
  }),
]);

/** Ficha Espólio da Declaração Final de Espólio. */
export const zFinalEspolio = z.object({
  anoObito: z.number().int().min(1900).max(2100),
  /** Partilha, sobrepartilha ou ambas (habilita as abas correspondentes). */
  modalidade: z.enum(["partilha", "sobrepartilha", "partilhaESobrepartilha"]),
  /** "Ainda há bens a inventariar?" */
  aindaHaBensAInventariar: z.boolean().default(false),
  tipoInventario: z.enum(["decisaoJudicial", "escrituraPublica"]).optional(),
  decisaoJudicial: zDecisaoJudicial.extend({ dataTransitoJulgado: zData.optional() }).optional(),
  escrituraPublica: zEscrituraPublica.optional(),
  inventariante: zInventariante,
  conjuge: zConjugeEspolio.optional(),
});
export type FinalEspolio = z.infer<typeof zFinalEspolio>;

/** Herdeiro ou meeiro (ficha Herdeiros/Meeiro da Declaração Final de Espólio). */
export const zHerdeiro = z.object({
  ni: zCpfOuCnpj,
  nome: zTexto(60),
});
export type Herdeiro = z.infer<typeof zHerdeiro>;

/** Ficha Saída Definitiva do País. */
export const zSaidaDefinitiva = z.object({
  procurador: z
    .object({
      cpf: zCpf,
      nome: zTexto(60),
      endereco: z.string().trim().max(80).optional(),
    })
    .optional(),
  /** Data da caracterização da condição de não residente. */
  dataCondicaoNaoResidente: zData,
  /** Data da caracterização da condição de residente (quando adquirida no mesmo ano). */
  dataCondicaoResidente: zData.optional(),
  /** País de destino. */
  paisDestino: zCodigoPais,
});
export type SaidaDefinitiva = z.infer<typeof zSaidaDefinitiva>;

/** Informações do cônjuge ou companheiro (registro 29), quando ele declara em separado. */
export const zInformacoesConjuge = z.object({
  cpf: zCpf,
  baseCalculo: zValor,
  impostoPago: zValor,
  rendimentosIsentos: zValor,
  rendimentosExclusivos: zValor,
  rendimentosExigibilidadeSuspensa: zValor,
  total: zValor,
  entregouDeclaracao: z.boolean(),
});
export type InformacoesConjuge = z.infer<typeof zInformacoesConjuge>;
