import { ExercicioNaoSuportadoError } from "../erros.js";
import type { Leiaute } from "../leiaute.js";
import { LEIAUTE_2025 } from "./2025.js";
import { LEIAUTE_2026 } from "./2026.js";

export { LEIAUTE_2025, LEIAUTE_2026 };

/** Leiautes disponíveis, por exercício. */
export const LEIAUTES: Readonly<Record<number, Leiaute>> = {
  2025: LEIAUTE_2025,
  2026: LEIAUTE_2026,
};

/** Leiaute do exercício; lança `ExercicioNaoSuportadoError` se não houver. */
export function obterLeiaute(exercicio: number): Leiaute {
  const leiaute = LEIAUTES[exercicio];
  if (!leiaute) {
    const suportados = Object.keys(LEIAUTES).join(", ");
    throw new ExercicioNaoSuportadoError(
      `exercício ${exercicio} sem leiaute (suportados: ${suportados})`,
    );
  }
  return leiaute;
}
