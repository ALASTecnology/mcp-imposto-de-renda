/**
 * Propriedades do motor de cálculo do exercício 2026, verificadas em milhares de declarações
 * sintéticas geradas com semente fixa. Os casos de referência (golden) conferem valores
 * pontuais contra o programa oficial; aqui se conferem leis que valem para qualquer entrada.
 *
 * Observação sobre doações: o limite de cada incentivo é um percentual TRUNCADO do imposto
 * (regra do programa), e vários limites somam até 15% do imposto. Por isso, com doações, o
 * imposto devido pode cair alguns centavos quando o imposto da tabela sobe 1 centavo. As
 * propriedades de monotonicidade estritas valem sem doações; com doações, vale a versão com
 * tolerância de 4 centavos (um centavo de truncamento por limite que pode saltar junto).
 */
import { ok } from "node:assert/strict";
import { describe, expect, it } from "vitest";
import {
  CalculoInvalidoError,
  calcular2026,
  calcularCompleto,
  calcularQuotas,
  calcularSimplificado,
  compararModelos,
  type EntradaCalculo2026,
  impostoTabelaAnual,
  PARAMETROS_2026,
  TABELA_ANUAL_2026,
} from "../../src/calc/index.js";
import { type Centavos, centavos } from "../../src/centavos.js";
import { type Gerador, gerador } from "./apoio.js";

const ITERACOES = 1500;
const CPF = "52998224725";

/** Valor em centavos, com peso maior nas faixas da tabela (até ~R$ 400 mil). */
function valor(g: Gerador, max = 40_000_000): string {
  const x = g.proximo();
  if (x < 0.15) return "0";
  if (x < 0.5) return String(g.inteiro(0, 6_000_000));
  return String(g.inteiro(0, max));
}

const CODIGOS_PAGAMENTO = ["01", "02", "09", "10", "26", "30", "33", "36", "37", "99"];
const CODIGOS_DOACAO = ["40", "41", "42", "43", "44", "45", "46", "47"];

function entradaAleatoria(g: Gerador, opcoes: { doacoes: boolean; exterior: boolean }) {
  const e: EntradaCalculo2026 = {
    titular: { cpf: CPF, nome: "TITULAR SINTETICO", nascimento: "15061980" },
    dependentes: Array.from({ length: g.inteiro(0, 3) }, (_, i) => ({
      cpf: `0000000000${i}`,
      nome: `DEPENDENTE ${i}`,
    })),
    rendimentosPJ: Array.from({ length: g.inteiro(0, 3) }, () => ({
      rendimento: valor(g),
      previdenciaOficial: valor(g, 1_000_000),
      irrf: valor(g, 5_000_000),
      decimoTerceiro: valor(g, 2_000_000),
    })),
    rendimentosPF: {
      meses: Array.from({ length: g.inteiro(0, 4) }, (_, i) => ({
        mes: i + 1,
        pessoaFisica: valor(g, 2_000_000),
        exterior: opcoes.exterior ? valor(g, 2_000_000) : "0",
        livroCaixa: valor(g, 300_000),
        carneLeao: valor(g, 300_000),
      })),
    },
    pagamentos: Array.from({ length: g.inteiro(0, 6) }, () => ({
      codigo: g.escolher(CODIGOS_PAGAMENTO),
      valor: valor(g, 3_000_000),
      parcelaNaoDedutivel: g.proximo() < 0.2 ? valor(g, 500_000) : "0",
      beneficiario: g.escolher(["T", "D", "A"] as const),
      cpfDependente: "00000000001",
    })),
    impostoPago: {
      complementar: valor(g, 200_000),
      exterior: opcoes.exterior ? valor(g, 1_000_000) : "0",
      irrfLei11033: valor(g, 100_000),
    },
  };
  if (opcoes.doacoes) {
    e.doacoesDiretas = { eca: valor(g, 500_000), idoso: valor(g, 500_000) };
    e.doacoesEfetuadas = Array.from({ length: g.inteiro(0, 4) }, () => ({
      codigo: g.escolher(CODIGOS_DOACAO),
      valor: valor(g, 500_000),
    }));
  }
  return e;
}

/** Soma `delta` ao rendimento da primeira fonte PJ (criando uma, se não houver). */
function comMaisRendimento(e: EntradaCalculo2026, delta: bigint): EntradaCalculo2026 {
  const pj = [...(e.rendimentosPJ ?? [])];
  const primeira = pj[0] ?? { rendimento: "0" };
  pj[0] = { ...primeira, rendimento: String(BigInt(primeira.rendimento ?? "0") + delta) };
  return { ...e, rendimentosPJ: pj };
}

/** Acrescenta uma despesa médica (dedução sem limite) de `delta` centavos. */
function comMaisDeducao(e: EntradaCalculo2026, delta: bigint): EntradaCalculo2026 {
  return {
    ...e,
    pagamentos: [...(e.pagamentos ?? []), { codigo: "10", valor: String(delta) }],
  };
}

const truncado275 = (base: Centavos): bigint => (base * 275n) / 1000n;

describe("tabela progressiva anual", () => {
  it("é não decrescente centavo a centavo em torno de cada limite de faixa", () => {
    for (const faixa of TABELA_ANUAL_2026) {
      if (faixa.ate === null) continue;
      let anterior = impostoTabelaAnual(centavos(faixa.ate - 2000n));
      for (let b = faixa.ate - 1999n; b <= faixa.ate + 2000n; b++) {
        const atual = impostoTabelaAnual(centavos(b));
        ok(atual >= anterior, `base ${b}`);
        anterior = atual;
      }
    }
  });

  it("nunca é negativa nem passa de 27,5% da base, em 20.000 bases sorteadas", () => {
    const g = gerador(101);
    let anterior = 0n;
    const bases = Array.from({ length: 20_000 }, () => BigInt(g.inteiro(-1_000_000, 90_000_000)));
    bases.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    for (const b of bases) {
      const imposto = impostoTabelaAnual(centavos(b));
      ok(imposto >= 0n);
      ok(imposto <= (b > 0n ? truncado275(centavos(b)) : 0n), `base ${b}`);
      ok(imposto >= anterior, `base ${b}`);
      anterior = imposto;
    }
  });
});

describe("propriedades do motor 2026", () => {
  it("imposto devido entre zero e 27,5% da base nos dois modelos; simplificado até o teto", () => {
    const g = gerador(102);
    for (let n = 0; n < ITERACOES; n++) {
      const e = entradaAleatoria(g, { doacoes: g.proximo() < 0.5, exterior: g.proximo() < 0.5 });
      const c = calcularCompleto(e);
      const s = calcularSimplificado(e);
      for (const r of [c, s]) {
        ok(r.impostoDevido >= 0n, `iteração ${n}`);
        ok(r.impostoDevido <= truncado275(r.baseCalculo), `iteração ${n}`);
        ok(r.impostoDevido <= r.impostoTabela);
        ok(r.baseCalculo >= 0n);
      }
      const vinte = (s.rendimentosTributaveis * 20n) / 100n;
      ok(s.desconto <= PARAMETROS_2026.descontoSimplificadoTeto, `iteração ${n}`);
      expect(s.desconto).toBe(
        vinte < PARAMETROS_2026.descontoSimplificadoTeto
          ? vinte
          : PARAMETROS_2026.descontoSimplificadoTeto,
      );
      ok(c.deducaoIncentivo <= c.impostoTabela);
    }
  });

  it("mais rendimento nunca dá menos imposto devido (sem doações)", () => {
    const g = gerador(103);
    for (let n = 0; n < ITERACOES; n++) {
      const e = entradaAleatoria(g, { doacoes: false, exterior: g.proximo() < 0.5 });
      const delta = BigInt(g.escolher([1, 7, 100, g.inteiro(1, 5_000_000)]));
      const mais = comMaisRendimento(e, delta);
      ok(calcularCompleto(mais).impostoDevido >= calcularCompleto(e).impostoDevido);
      ok(calcularSimplificado(mais).impostoDevido >= calcularSimplificado(e).impostoDevido);
    }
  });

  it("mais dedução nunca dá mais imposto no completo (sem doações)", () => {
    const g = gerador(104);
    for (let n = 0; n < ITERACOES; n++) {
      const e = entradaAleatoria(g, { doacoes: false, exterior: g.proximo() < 0.5 });
      const delta = BigInt(g.escolher([1, 3, 100, g.inteiro(1, 5_000_000)]));
      const antes = calcularCompleto(e);
      const depois = calcularCompleto(comMaisDeducao(e, delta));
      ok(depois.impostoDevido <= antes.impostoDevido, `iteração ${n}`);
      expect(depois.totalDeducoes).toBe(antes.totalDeducoes + delta);
    }
  });

  it("com doações, as duas monotonicidades valem com tolerância de 4 centavos", () => {
    const g = gerador(105);
    let quedas = 0;
    for (let n = 0; n < ITERACOES; n++) {
      const e = entradaAleatoria(g, { doacoes: true, exterior: false });
      const base = calcularCompleto(e).impostoDevido;
      const maisR = calcularCompleto(
        comMaisRendimento(e, BigInt(g.inteiro(1, 1000))),
      ).impostoDevido;
      const maisD = calcularCompleto(comMaisDeducao(e, BigInt(g.inteiro(1, 1000)))).impostoDevido;
      ok(maisR >= base - 4n, `iteração ${n}`);
      ok(maisD <= base + 4n, `iteração ${n}`);
      if (maisR < base || maisD > base) quedas++;
      // Variações grandes (R$ 1.000,00 ou mais) seguem estritamente monotônicas.
      const grande = BigInt(g.inteiro(100_000, 5_000_000));
      ok(calcularCompleto(comMaisRendimento(e, grande)).impostoDevido >= base);
      ok(calcularCompleto(comMaisDeducao(e, grande)).impostoDevido <= base);
    }
    // Registro do efeito do truncamento: acontece, mas é raro.
    expect(quedas).toBeLessThan(ITERACOES / 10);
  });

  it("caso concreto do efeito do truncamento: 1 centavo a mais de rendimento, 2 a menos de imposto", () => {
    // Doações que saturam todos os limites: o imposto da tabela passa de 16.646,99 para
    // 16.647,00 e os limites de 7% e de 1% (Pronas e Pronon) sobem 1 centavo cada ao mesmo
    // tempo. É consequência da regra de truncamento dos limites, não erro de soma; os limites
    // de 6%, 7% e 1% estão marcados como NÃO CONFIRMADOS em docs/regras/irpf-2026.md.
    const e = (r: string): EntradaCalculo2026 => ({
      titular: { cpf: CPF, nome: "TITULAR" },
      rendimentosPJ: [{ rendimento: r }],
      doacoesDiretas: { eca: "100000000", idoso: "100000000" },
      doacoesEfetuadas: ["43", "45", "46"].map((codigo) => ({ codigo, valor: "100000000" })),
    });
    const antes = calcularCompleto(e("10000283"));
    const depois = calcularCompleto(e("10000284"));
    expect([antes.impostoTabela, depois.impostoTabela]).toEqual([1664699n, 1664700n]);
    expect([antes.impostoDevido, depois.impostoDevido]).toEqual([1514879n, 1514877n]);
  });

  it("saldo e restituição são exclusivos e saldo - restituição = devido - pago", () => {
    const g = gerador(106);
    for (let n = 0; n < ITERACOES; n++) {
      const e = entradaAleatoria(g, { doacoes: g.proximo() < 0.5, exterior: g.proximo() < 0.5 });
      for (const r of [calcularCompleto(e), calcularSimplificado(e)]) {
        ok(r.saldoPagar === 0n || r.restituir === 0n, `iteração ${n}`);
        ok(r.saldoPagar >= 0n && r.restituir >= 0n);
        expect(r.saldoPagar - r.restituir).toBe(r.impostoDevido - r.impostoPago.total);
        ok(r.impostoPago.exterior <= r.impostoPago.exteriorInformado);
      }
    }
  });

  it("o modelo indicado é o de menor saldo líquido, com o completo no empate", () => {
    const g = gerador(107);
    let empates = 0;
    for (let n = 0; n < ITERACOES; n++) {
      const exterior = g.proximo() < 0.3;
      const e = entradaAleatoria(g, { doacoes: g.proximo() < 0.5, exterior });
      const { completo: c, simplificado: s, modeloMaisVantajoso } = compararModelos(e);
      const liquidoC = c.impostoDevido - c.impostoPago.total;
      const liquidoS = s.impostoDevido - s.impostoPago.total;
      const esperado = liquidoS < liquidoC ? "simplificado" : "completo";
      expect(modeloMaisVantajoso, `iteração ${n}`).toBe(esperado);
      // Sem imposto pago no exterior o pago é o mesmo nos dois modelos: vale o menor devido.
      if (!exterior) {
        expect(modeloMaisVantajoso).toBe(
          s.impostoDevido < c.impostoDevido ? "simplificado" : "completo",
        );
      }
      if (liquidoC === liquidoS) empates++;
      expect(calcular2026(e).modeloMaisVantajoso).toBe(modeloMaisVantajoso);
    }
    expect(empates).toBeGreaterThan(0);
  });

  it("empate exato indica o completo", () => {
    // Deduções do completo iguais ao desconto simplificado: mesmo imposto nos dois.
    const e: EntradaCalculo2026 = {
      titular: { cpf: CPF, nome: "TITULAR" },
      rendimentosPJ: [{ rendimento: "5000000" }],
      pagamentos: [{ codigo: "10", valor: "1000000" }],
    };
    const r = compararModelos(e);
    expect(r.completo.impostoDevido).toBe(r.simplificado.impostoDevido);
    expect(r.modeloMaisVantajoso).toBe("completo");
  });

  it("a memória de cálculo descreve o truncamento usado na tabela (regressão do texto)", () => {
    // A regra dizia "arredondadas ao centavo mais próximo", mas o motor trunca, como o
    // programa oficial (docs/regras/irpf-2026.md, Arredondamento).
    const e: EntradaCalculo2026 = {
      titular: { cpf: CPF, nome: "TITULAR" },
      rendimentosPJ: [{ rendimento: "8324566" }],
    };
    for (const r of [calcularCompleto(e), calcularSimplificado(e)]) {
      const linha = r.memoria.find((m) => m.codigo === "imposto.tabela");
      expect(linha?.regra ?? "").not.toMatch(/arredond|mais próximo/i);
    }
    expect(calcularCompleto(e).memoria.find((m) => m.codigo === "imposto.tabela")?.regra).toMatch(
      /trunca/,
    );
  });

  it("é determinístico e não depende da ordem das fichas", () => {
    const g = gerador(108);
    const semMemoria = (e: EntradaCalculo2026) => {
      const { detalhamento: _d, ...resto } = calcular2026(e);
      return resto;
    };
    for (let n = 0; n < 300; n++) {
      const e = entradaAleatoria(g, { doacoes: true, exterior: true });
      const a = calcular2026(e);
      const b = calcular2026(structuredClone(e));
      expect(b).toEqual(a);
      const invertida: EntradaCalculo2026 = {
        ...e,
        rendimentosPJ: [...(e.rendimentosPJ ?? [])].reverse(),
        pagamentos: [...(e.pagamentos ?? [])].reverse(),
        doacoesEfetuadas: [...(e.doacoesEfetuadas ?? [])].reverse(),
        rendimentosPF: { meses: [...(e.rendimentosPF?.meses ?? [])].reverse() },
      };
      expect(semMemoria(invertida)).toEqual(semMemoria(e));
    }
  });

  it("entrada com valor que não é inteiro de centavos falha com CalculoInvalidoError", () => {
    for (const ruim of ["1.5", "1,50", "1e3", "0x10", " 1", "NaN", "Infinity", "--1", "١٢٣"]) {
      const e: EntradaCalculo2026 = {
        titular: { cpf: CPF, nome: "TITULAR" },
        rendimentosPJ: [{ rendimento: ruim }],
      };
      expect(() => calcular2026(e), ruim).toThrow(CalculoInvalidoError);
    }
  });
});

describe("quotas", () => {
  it("a soma das quotas é sempre o saldo, e as regras de quantidade são respeitadas", () => {
    const g = gerador(109);
    let validas = 0;
    for (let n = 0; n < 5000; n++) {
      const saldo = centavos(BigInt(g.escolher([g.inteiro(0, 20_000), g.inteiro(0, 50_000_000)])));
      const q = g.inteiro(1, 8);
      let r: ReturnType<typeof calcularQuotas>;
      try {
        r = calcularQuotas(saldo, q);
      } catch (e) {
        expect(e).toBeInstanceOf(CalculoInvalidoError);
        // Só recusa quando a regra manda: menos de R$ 100,00 em mais de uma quota, ou quota
        // abaixo de R$ 50,00.
        ok(q > 1 && (saldo < 10_000n || saldo / BigInt(q) < 5_000n), `saldo ${saldo}`);
        continue;
      }
      if (saldo < PARAMETROS_2026.saldoMinimoRecolhimento) {
        expect(r.quotas).toEqual([]);
        continue;
      }
      validas++;
      expect(r.quotas).toHaveLength(q);
      expect(
        r.quotas.reduce((s, x) => s + x.principal, 0n),
        `saldo ${saldo}`,
      ).toBe(saldo);
      for (const x of r.quotas.slice(1)) {
        expect(x.principal).toBe(r.quotas[1]?.principal);
        if (q > 1) ok(x.principal >= PARAMETROS_2026.quotaMinima);
      }
      expect(r.quotas[0]?.juros).toBe(0n);
    }
    expect(validas).toBeGreaterThan(1000);
  });
});
