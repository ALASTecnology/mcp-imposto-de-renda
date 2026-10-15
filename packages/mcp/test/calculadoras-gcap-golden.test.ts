/**
 * Simulador de ganho de capital contra os casos de referência do GCAP 2025
 * (packages/core/test/golden/2026/gcap-*.json, gerados por tools/referencia com o programa
 * oficial e dados sintéticos). Cada alienação precisa bater ao centavo com o programa.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  calcularGanhoCapital,
  calcularGanhoMoedaEspecie,
  type EntradaGanhoCapital,
} from "../src/calculadoras/index.js";

interface AlienacaoCaso {
  tipo: EntradaGanhoCapital["tipo"] | "moeda";
  dataAquisicao: string;
  dataAlienacao: string;
  valorAlienacao: string;
  custoCorretagem?: string;
  custoAquisicao: string;
  impostoPago?: string;
  unicoImovel?: boolean;
  // Bem no exterior.
  exterior?: boolean;
  origem?: "nacional" | "estrangeira" | "ambas";
  cotacaoAquisicao?: string;
  cotacaoAlienacao?: string;
  valorAlienacaoDolar?: string;
  custoCorretagemDolar?: string;
  custoAquisicaoNacionalDolar?: string;
  custoAquisicaoDolar?: string;
  // Moeda em espécie.
  estoqueInicial?: string;
  saldoInicial?: string;
  operacoes?: {
    tipo: "compra" | "venda";
    data: string;
    quantidade: string;
    valor: string;
    cotacaoDolar?: string;
  }[];
}

interface AlienacaoOficial {
  ganhoBruto: string;
  reducoes: Record<string, string>;
  percentuaisReducao: Record<string, string>;
  impostoDevido: string;
  rendimentoIsento: string;
  rendimentoTributavel: string;
  exterior?: Record<string, string>;
  // Moeda em espécie.
  custoMedioInicial?: string;
  operacoes?: Record<string, string>[];
  ganhoCapital?: string;
}

interface CasoGcap {
  id: string;
  entrada: { ganhosCapital: AlienacaoCaso[] };
  esperadoGcap: {
    alienacoes: AlienacaoOficial[];
    moedaEspecie?: Record<string, string>;
  };
}

/** "5,500000" (programa) em inteiro com as casas pedidas. */
const escala = (v: string, casas: number) => {
  const [i = "0", f = ""] = v.split(",");
  return BigInt(`${i}${f.padEnd(casas, "0").slice(0, casas)}`);
};

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
      if (a.tipo === "moeda") {
        const m = calcularGanhoMoedaEspecie({
          estoqueInicial: BigInt(a.estoqueInicial ?? "0"),
          saldoInicial: BigInt(a.saldoInicial ?? "0"),
          operacoes: (a.operacoes ?? []).map((o) => ({
            tipo: o.tipo,
            data: iso(o.data),
            quantidade: BigInt(o.quantidade),
            valor: BigInt(o.valor),
            ...(o.cotacaoDolar ? { cotacaoDolar: escala(o.cotacaoDolar, 7) } : {}),
          })),
        });
        expect(m.custoMedioInicial).toBe(escala(oficial.custoMedioInicial ?? "0", 6));
        expect(
          m.operacoes.map((o) => ({
            estoque: String(o.estoque),
            saldo: String(o.saldo),
            custoMedio: String(o.custoMedio),
            custoAlienacao: String(o.custo),
            ganhoCapital: String(o.ganho),
          })),
        ).toEqual(
          (oficial.operacoes ?? []).map((o) => ({
            ...o,
            custoMedio: String(escala(o.custoMedio ?? "0", 6)),
          })),
        );
        const esp = caso.esperadoGcap.moedaEspecie ?? {};
        expect({
          ganhoCapital: String(m.ganhoCapital),
          ganhoTributavel: String(m.ganhoTributavel),
          impostoDevido: String(m.impostoDevido),
        }).toEqual({
          ganhoCapital: esp.ganhoCapital,
          ganhoTributavel: esp.ganhoTributavel,
          impostoDevido: esp.impostoDevido,
        });
        return;
      }
      if (a.exterior) {
        const r = calcularGanhoCapital({
          tipo: a.tipo,
          valorAlienacao: 0n,
          custoCorretagem: 0n,
          custoAquisicao: 0n,
          dataAquisicao: iso(a.dataAquisicao),
          dataAlienacao: iso(a.dataAlienacao),
          exterior: {
            origem: a.origem ?? "estrangeira",
            cotacaoAquisicao: escala(a.cotacaoAquisicao ?? "0", 4),
            cotacaoAlienacao: escala(a.cotacaoAlienacao ?? "0", 4),
            valorAlienacaoDolar: BigInt(a.valorAlienacaoDolar ?? "0"),
            corretagemDolar: BigInt(a.custoCorretagemDolar ?? "0"),
            custoNacionalDolar: BigInt(a.custoAquisicaoNacionalDolar ?? "0"),
            custoEstrangeiraDolar: BigInt(a.custoAquisicaoDolar ?? "0"),
          },
        });
        const ex = oficial.exterior ?? {};
        expect({
          ganhoTotal: String(r.ganhoBruto),
          ganhoNacionalReal: String(r.exterior?.nacional.ganhoReais),
          ganhoEstrangeiraDolar: String(r.exterior?.estrangeira.ganhoDolar),
          ganhoEstrangeiraReal: String(r.exterior?.estrangeira.ganhoReais),
          custoNacionalReal: String(r.exterior?.nacional.custoReais),
          impostoDevido: String(r.imposto),
          rendimentoIsento: String(r.isento),
          rendimentoTributavel: String(r.rendimentoExclusivo),
        }).toEqual({
          ganhoTotal: ex.ganhoTotal,
          ganhoNacionalReal: ex.ganhoNacionalReal,
          ganhoEstrangeiraDolar: ex.ganhoEstrangeiraDolar,
          ganhoEstrangeiraReal: ex.ganhoEstrangeiraReal,
          custoNacionalReal: ex.custoNacionalReal,
          impostoDevido: oficial.impostoDevido,
          rendimentoIsento: oficial.rendimentoIsento,
          rendimentoTributavel: oficial.rendimentoTributavel,
        });
        return;
      }
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
