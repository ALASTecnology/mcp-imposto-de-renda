/**
 * Simulador de ganho de capital contra os casos de referência do GCAP 2025
 * (packages/core/test/golden/2026/gcap-*.json, gerados por tools/referencia com o programa
 * oficial e dados sintéticos). Cada alienação precisa bater ao centavo com o programa.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { calcularGanhoCapital, type EntradaGanhoCapital } from "../src/calculadoras/index.js";

interface AlienacaoCaso {
  tipo: EntradaGanhoCapital["tipo"];
  dataAquisicao: string;
  dataAlienacao: string;
  valorAlienacao: string;
  custoCorretagem?: string;
  custoAquisicao: string;
  impostoPago?: string;
  unicoImovel?: boolean;
}

interface AlienacaoOficial {
  ganhoBruto: string;
  reducoes: Record<string, string>;
  percentuaisReducao: Record<string, string>;
  impostoDevido: string;
  rendimentoIsento: string;
  rendimentoTributavel: string;
}

interface CasoGcap {
  id: string;
  entrada: { ganhosCapital: AlienacaoCaso[] };
  esperadoGcap: { alienacoes: AlienacaoOficial[] };
}

const PASTA = fileURLToPath(new URL("../../core/test/golden/2026/", import.meta.url));
const casos: CasoGcap[] = readdirSync(PASTA)
  .filter((a) => a.startsWith("gcap-") && a.endsWith(".json"))
  .sort()
  .map((a) => JSON.parse(readFileSync(join(PASTA, a), "utf8")) as CasoGcap);

/** DDMMAAAA do caso para AAAA-MM-DD do simulador. */
const iso = (d: string) => `${d.slice(4, 8)}-${d.slice(2, 4)}-${d.slice(0, 2)}`;

describe("calcularGanhoCapital contra o GCAP 2025", () => {
  it("há casos de referência de ganho de capital", () => {
    expect(casos.length).toBeGreaterThanOrEqual(4);
  });

  it.each(casos.map((c) => [c.id, c] as const))("%s", (_id, caso) => {
    caso.entrada.ganhosCapital.forEach((a, i) => {
      const oficial = caso.esperadoGcap.alienacoes[i] as AlienacaoOficial;
      const r = calcularGanhoCapital({
        tipo: a.tipo,
        valorAlienacao: BigInt(a.valorAlienacao),
        custoCorretagem: BigInt(a.custoCorretagem ?? "0"),
        custoAquisicao: BigInt(a.custoAquisicao),
        dataAquisicao: iso(a.dataAquisicao),
        dataAlienacao: iso(a.dataAlienacao),
        ...(a.unicoImovel !== undefined ? { unicoImovel: a.unicoImovel } : {}),
        ...(a.impostoPago !== undefined ? { impostoPago: BigInt(a.impostoPago) } : {}),
      });
      const obtido = {
        ganhoBruto: String(r.ganhoBruto),
        impostoDevido: String(r.imposto),
        rendimentoIsento: String(r.isento),
        rendimentoTributavel: String(r.rendimentoExclusivo),
      };
      expect(obtido).toEqual({
        ganhoBruto: oficial.ganhoBruto,
        impostoDevido: oficial.impostoDevido,
        rendimentoIsento: oficial.rendimentoIsento,
        rendimentoTributavel: oficial.rendimentoTributavel,
      });
      if (a.tipo === "imovel") {
        // O GCAP só detalha as reduções na apuração de imóveis.
        for (const campo of ["lei7713", "fr1", "fr2", "unicoImovel"] as const) {
          expect(String(r.reducoesDetalhadas[campo]), campo).toBe(oficial.reducoes[campo]);
        }
        for (const campo of ["lei7713", "fr1", "fr2"] as const) {
          expect(r.percentuaisReducao[campo], `percentual ${campo}`).toBe(
            oficial.percentuaisReducao[campo],
          );
        }
      }
    });
  });
});
