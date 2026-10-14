/**
 * Renda Variável: operações comuns e day-trade (registros 40 e 41) e
 * operações em FII ou Fiagro (registros 42 e 43), por titular e por
 * dependente, mês a mês (nota 06 D-RV-* e D-FII-*). Os resultados mensais
 * (base, prejuízo a compensar, imposto devido) são calculados e não ficam aqui.
 */
import { z } from "zod";
import { zBeneficiario, zCentavos, zMes, zValor } from "./comum.js";

/** Ganho (positivo) ou perda (negativa) do mês, opcional. */
const zResultado = zCentavos.optional();

/** Linhas de ganhos líquidos ou perdas por tipo de mercado (iguais em comuns e day-trade). */
export const zMercadosRendaVariavel = z.object({
  mercadoVistaAcoes: zResultado,
  mercadoVistaOuro: zResultado,
  mercadoVistaOuroForaBolsa: zResultado,
  opcoesAcoes: zResultado,
  opcoesOuro: zResultado,
  opcoesOuroForaBolsa: zResultado,
  opcoesOutros: zResultado,
  futuroDolar: zResultado,
  futuroIndices: zResultado,
  futuroJuros: zResultado,
  futuroOutros: zResultado,
  termoAcoesOuro: zResultado,
  termoOutros: zResultado,
});
export type MercadosRendaVariavel = z.infer<typeof zMercadosRendaVariavel>;

/** Um mês de operações comuns e day-trade. */
export const zMesRendaVariavel = z.object({
  mes: zMes,
  comuns: zMercadosRendaVariavel.default({}),
  dayTrade: zMercadosRendaVariavel.default({}),
  /** IR na fonte de day-trade no mês. */
  irFonteDayTrade: zValor,
  /** IR na fonte da Lei 11.033/2004 no mês. */
  irFonteLei11033: zValor,
  /** Principal do Darf 6015 pago. */
  impostoPago: zValor,
});
export type MesRendaVariavel = z.infer<typeof zMesRendaVariavel>;

/** Operações comuns e day-trade de uma pessoa no ano. */
export const zRendaVariavel = z.object({
  beneficiario: zBeneficiario,
  /** Prejuízo de anos anteriores informado em janeiro (comuns e day-trade separados). */
  prejuizoAnteriorComuns: zValor,
  prejuizoAnteriorDayTrade: zValor,
  /** IR fonte de day-trade a compensar vindo de anos anteriores (só em janeiro). */
  irFonteDayTradeAnterior: zValor,
  meses: z.array(zMesRendaVariavel).max(12).default([]),
});
export type RendaVariavel = z.infer<typeof zRendaVariavel>;

/** Um mês de operações com cotas de FII ou Fiagro. */
export const zMesFii = z.object({
  mes: zMes,
  /** Resultado líquido do mês (ganho ou perda). */
  resultadoLiquido: zCentavos.optional(),
  /** Imposto retido na fonte (Lei 11.033/2004). */
  impostoRetidoFonte: zValor,
  impostoPago: zValor,
});
export type MesFii = z.infer<typeof zMesFii>;

/** Operações em FII ou Fiagro de uma pessoa no ano. */
export const zOperacoesFii = z.object({
  beneficiario: zBeneficiario,
  /** Resultado negativo até o mês anterior, informado em janeiro. */
  prejuizoAnterior: zValor,
  meses: z.array(zMesFii).max(12).default([]),
});
export type OperacoesFii = z.infer<typeof zOperacoesFii>;
