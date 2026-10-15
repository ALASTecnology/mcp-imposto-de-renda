/**
 * Casos de referência (golden) do exercício 2026.
 *
 * Cada arquivo em test/golden/2026/*.json traz um caso (ou uma lista de casos)
 * com "entrada" e "esperado" gerados localmente com o programa oficial, a
 * partir de dados sintéticos (ver docs/adr/0002). O motor precisa reproduzir
 * todos os campos de "esperado" ao centavo. Divergências não se corrigem
 * ajustando o motor ao caso: investigar a regra e registrar em
 * docs/regras/irpf-2026.md.
 *
 * Nos casos com Livro Caixa da Atividade Rural importado (`esperadoLivroCaixaRural`, o
 * demonstrativo mensal calculado pelo programa da Atividade Rural), os meses da atividade rural
 * no Brasil são os do demonstrativo, como faz a importação do IRPF.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  calcular2026,
  type EntradaCalculo2026,
  type ResultadoCalculo2026,
} from "../../src/calc/index.js";

interface CasoGolden {
  id: string;
  descricao?: string;
  entrada: EntradaCalculo2026;
  esperado: Partial<Record<keyof ResultadoCalculo2026, string>>;
  esperadoLivroCaixaRural?: {
    meses: { mes: number; receitas: string; despesas: string }[];
  };
}

/** Entrada do motor com os meses do Livro Caixa importado no lugar dos digitados. */
function entradaDoCaso(caso: CasoGolden): EntradaCalculo2026 {
  const livro = caso.esperadoLivroCaixaRural;
  const rural = caso.entrada.atividadeRural;
  if (!livro || !rural) return caso.entrada;
  const meses = livro.meses
    .filter((m) => m.receitas !== "0" || m.despesas !== "0")
    .map((m) => ({ mes: m.mes, receita: m.receitas, despesa: m.despesas }));
  return { ...caso.entrada, atividadeRural: { ...rural, meses } };
}

const PASTA = fileURLToPath(new URL("../golden/2026/", import.meta.url));

function carregarCasos(): CasoGolden[] {
  if (!existsSync(PASTA)) return [];
  const casos: CasoGolden[] = [];
  for (const arquivo of readdirSync(PASTA)
    .filter((a) => a.endsWith(".json"))
    .sort()) {
    const conteudo: unknown = JSON.parse(readFileSync(join(PASTA, arquivo), "utf8"));
    const lista = Array.isArray(conteudo) ? conteudo : [conteudo];
    for (const caso of lista as CasoGolden[]) {
      casos.push({ ...caso, id: caso.id ?? arquivo });
    }
  }
  return casos;
}

const casos = carregarCasos();

describe.skipIf(casos.length === 0)(
  `golden 2026: ${casos.length > 0 ? `${casos.length} caso(s)` : "nenhum caso em test/golden/2026 (pasta vazia ou ausente), pulando"}`,
  () => {
    it.each(casos.map((c) => [c.id, c] as const))("%s", (_id, caso) => {
      const resultado = calcular2026(entradaDoCaso(caso));
      const obtido: Record<string, string> = {};
      for (const campo of Object.keys(caso.esperado)) {
        obtido[campo] = String(resultado[campo as keyof ResultadoCalculo2026]);
      }
      expect(obtido).toEqual(caso.esperado);
    });
  },
);
