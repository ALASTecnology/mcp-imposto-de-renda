/**
 * Motor do exercício 2026 (ano-calendário 2025).
 */
import {
  calcular2026,
  calcularCompleto,
  calcularSimplificado,
  compararModelos,
  impostoTabelaAnual,
} from "./motor.js";
import { PARAMETROS_2026 } from "./parametros.js";
import { calcularMultaAtraso, calcularQuotas } from "./quotas.js";

export * from "./motor.js";
export * from "./parametros.js";
export * from "./quotas.js";
export type * from "./tipos.js";

export const motor2026 = {
  exercicio: 2026,
  anoCalendario: 2025,
  parametros: PARAMETROS_2026,
  calcular: calcular2026,
  calcularCompleto,
  calcularSimplificado,
  compararModelos,
  calcularQuotas,
  calcularMultaAtraso,
  impostoTabelaAnual,
} as const;
