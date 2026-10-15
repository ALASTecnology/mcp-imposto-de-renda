/**
 * calc/: motor de cálculo próprio do imposto (ver docs/adr/0002).
 *
 * Cada exercício tem o seu motor em uma pasta própria (`2026/`, e no futuro
 * `2027/` com a redução da Lei 15.270/2025), com tabelas, limites e regras
 * daquele ano. O registro `motores` liga o exercício ao motor; use
 * `obterMotor(exercicio)` para escolher em tempo de execução. Toda a
 * aritmética é em `Centavos`, com a regra de arredondamento de
 * `aritmetica.ts`. Regras e fontes: docs/regras/.
 */
import { motor2026 } from "./2026/index.js";
import { CalculoInvalidoError } from "./aritmetica.js";

export * from "./2026/index.js";
export { CalculoInvalidoError, formatarCentesimosPercentual } from "./aritmetica.js";
export * from "./ganho-capital-cambio.js";

/** Motores disponíveis, por exercício (ano de entrega da declaração). */
export const motores = {
  2026: motor2026,
} as const;

export type ExercicioSuportado = keyof typeof motores;

export function exerciciosSuportados(): ExercicioSuportado[] {
  return Object.keys(motores).map(Number) as ExercicioSuportado[];
}

/** Devolve o motor do exercício ou lança erro se não houver. */
export function obterMotor(exercicio: number): (typeof motores)[ExercicioSuportado] {
  const motor = (motores as Record<number, (typeof motores)[ExercicioSuportado] | undefined>)[
    exercicio
  ];
  if (!motor) {
    throw new CalculoInvalidoError(
      `Não há motor de cálculo para o exercício ${exercicio}. Exercícios suportados: ${exerciciosSuportados().join(", ")}.`,
    );
  }
  return motor;
}
