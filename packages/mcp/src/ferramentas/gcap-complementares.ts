/**
 * Registros do Demonstrativo de Ganhos de Capital que o modelo não tipa (64 alienação no
 * exterior, 67 reforma no exterior, 70 a 73 apuração em ambas as moedas, parcelas e custo de
 * participação, 75 a 78 faixas e totalizações de moeda): são preservados na gravação e aqui
 * decodificados campo a campo pelo leiaute, para que `listar_ganhos_capital` mostre o
 * demonstrativo inteiro como o programa oficial.
 */
import { obterLeiaute, type Registro } from "@mcp-imposto-de-renda/core";

/** Tipos de registro do GCAP fora do modelo tipado. */
export const TIPOS_GCAP_COMPLEMENTARES = new Set([
  "64",
  "67",
  "70",
  "71",
  "72",
  "73",
  "75",
  "76",
  "77",
  "78",
]);

export interface RegistroComplementar {
  tipo: string;
  descricao: string;
  cpfBeneficiario: string | null;
  campos: { [nome: string]: string };
}

function formatar(v: string | bigint | null, decimais: number | undefined): string {
  if (v === null) return "";
  if (typeof v === "string") return v.trim();
  if (!decimais) return v.toString();
  const negativo = v < 0n;
  const abs = (negativo ? -v : v).toString().padStart(decimais + 1, "0");
  return `${negativo ? "-" : ""}${abs.slice(0, -decimais)},${abs.slice(-decimais)}`;
}

/** Decodifica os registros complementares do GCAP com a descrição de cada campo do leiaute. */
export function registrosGcapComplementares(
  registros: readonly Registro[],
  exercicio = 2026,
): RegistroComplementar[] {
  const leiaute = obterLeiaute(exercicio);
  const out: RegistroComplementar[] = [];
  for (const r of registros) {
    if (!TIPOS_GCAP_COMPLEMENTARES.has(r.tipo)) continue;
    const tipo = leiaute.tipos.find((t) => t.id === r.tipo);
    if (!tipo) continue;
    const campos: { [nome: string]: string } = {};
    for (const c of tipo.campos) {
      if (c.chave === "NR_REG" || c.chave === "NR_CPF" || /^FILLER/.test(c.chave)) continue;
      const v = formatar(r.campos[c.chave] ?? null, c.decimais);
      if (v !== "") campos[c.descricao ? `${c.chave} (${c.descricao})` : c.chave] = v;
    }
    const benef = r.campos.NR_CPF_BENEFICIARIO;
    out.push({
      tipo: r.tipo,
      descricao: tipo.descricao,
      cpfBeneficiario:
        benef === null || benef === undefined ? null : String(benef).padStart(11, "0"),
      campos,
    });
  }
  return out;
}
