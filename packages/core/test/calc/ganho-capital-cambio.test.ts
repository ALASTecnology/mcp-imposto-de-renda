/**
 * Apuração em dólar do ganho de capital (bem adquirido no exterior e moeda estrangeira em
 * espécie) contra valores observados no GCAP 2025 com dados sintéticos: os casos gcap-exterior-*
 * e gcap-especie-* de tools/referencia e duas execuções com valores que não dividem exato, para
 * fixar os arredondamentos.
 */
import { describe, expect, it } from "vitest";
import { apurarBemExterior, apurarMoedaEspecie } from "../../src/calc/index.js";

describe("apurarBemExterior", () => {
  it("origem em moeda estrangeira: ganho em dólar convertido pela cotação da alienação", () => {
    const a = apurarBemExterior({
      origem: "estrangeira",
      cotacaoAquisicao: 0n,
      cotacaoAlienacao: 55_000n,
      valorAlienacaoDolar: 3_000_000n,
      corretagemDolar: 60_000n,
      custoNacionalDolar: 0n,
      custoEstrangeiraDolar: 1_000_000n,
    });
    expect(a.estrangeira.ganhoDolar).toBe(1_940_000n);
    expect(a.estrangeira.ganhoReais).toBe(10_670_000n);
    expect(a.ganhoTotal).toBe(10_670_000n);
    expect(a.valorAlienacaoReais).toBe(16_500_000n);
    expect(a.corretagemReais).toBe(330_000n);
    expect(a.nacional.custoReais).toBe(0n);
  });

  it("origem nacional: custo pela cotação da aquisição", () => {
    const a = apurarBemExterior({
      origem: "nacional",
      cotacaoAquisicao: 38_000n,
      cotacaoAlienacao: 54_000n,
      valorAlienacaoDolar: 2_000_000n,
      corretagemDolar: 0n,
      custoNacionalDolar: 1_200_000n,
      custoEstrangeiraDolar: 0n,
    });
    expect(a.nacional.liquidoReais).toBe(10_800_000n);
    expect(a.nacional.custoReais).toBe(4_560_000n);
    expect(a.ganhoTotal).toBe(6_240_000n);
  });

  it("ambas as origens: rateio pelo custo em dólar", () => {
    const a = apurarBemExterior({
      origem: "ambas",
      cotacaoAquisicao: 29_000n,
      cotacaoAlienacao: 55_000n,
      valorAlienacaoDolar: 3_000_000n,
      corretagemDolar: 60_000n,
      custoNacionalDolar: 1_000_000n,
      custoEstrangeiraDolar: 1_000_000n,
    });
    expect(a.nacional.ganhoReais).toBe(5_185_000n);
    expect(a.estrangeira.ganhoReais).toBe(2_585_000n);
    expect(a.ganhoTotal).toBe(7_770_000n);
    expect(a.percentualEstrangeira).toBe(50_000_000_000n);
  });

  it("rateio que não divide exato: trunca a parte estrangeira e a nacional fica com o resto", () => {
    // GCAP 2025: custo US$ 1.000,00 nacional e US$ 2.000,00 estrangeiro, venda US$ 3.333,33,
    // corretagem US$ 10,01, cotações 3,1234 e 5,4321.
    const a = apurarBemExterior({
      origem: "ambas",
      cotacaoAquisicao: 31_234n,
      cotacaoAlienacao: 54_321n,
      valorAlienacaoDolar: 333_333n,
      corretagemDolar: 1_001n,
      custoNacionalDolar: 100_000n,
      custoEstrangeiraDolar: 200_000n,
    });
    expect(a.percentualEstrangeira).toBe(66_666_666_667n);
    expect(a.estrangeira.valorDolar).toBe(222_222n);
    expect(a.nacional.valorDolar).toBe(111_111n);
    expect(a.estrangeira.liquidoDolar).toBe(221_554n);
    expect(a.nacional.liquidoDolar).toBe(110_778n);
    expect(a.estrangeira.corretagemDolar).toBe(668n);
    expect(a.nacional.corretagemDolar).toBe(333n);
    expect(a.nacional.liquidoReais).toBe(601_757n);
    expect(a.nacional.custoReais).toBe(312_340n);
    expect(a.nacional.ganhoReais).toBe(289_417n);
    expect(a.estrangeira.ganhoDolar).toBe(21_554n);
    expect(a.estrangeira.ganhoReais).toBe(117_083n);
    expect(a.ganhoTotal).toBe(406_500n);
    expect(a.valorAlienacaoReais).toBe(1_810_698n);
    expect(a.corretagemReais).toBe(5_437n);
  });
});

describe("apurarMoedaEspecie", () => {
  it("custo médio ponderado e ganho da venda (gcap-especie-01)", () => {
    const r = apurarMoedaEspecie({
      estoqueInicial: 100_000n,
      saldoInicial: 500_000n,
      operacoes: [
        { tipo: "compra", data: "2025-02-10", quantidade: 600_000n, valor: 3_420_000n },
        {
          tipo: "venda",
          data: "2025-08-11",
          quantidade: 600_000n,
          valor: 3_480_000n,
          cotacaoDolar: 58_000_000n,
        },
      ],
    });
    expect(r.custoMedioInicial).toBe(5_000_000n);
    expect(r.operacoes.map((o) => [o.estoque, o.saldo, o.custoMedio, o.custo, o.ganho])).toEqual([
      [700_000n, 3_920_000n, 5_600_000n, 0n, 0n],
      [100_000n, 560_000n, 5_600_000n, 3_360_000n, 120_000n],
    ]);
    expect(r.ganhoCapital).toBe(120_000n);
    expect(r.meses[7]).toEqual({
      alienacaoDolar: 600_000n,
      alienacaoConsolidadaDolar: 600_000n,
      ganhoCapital: 120_000n,
      ganhoTributavel: 120_000n,
      impostoDevido: 18_000n,
      impostoPago: 0n,
    });
    expect(r.meses[11]?.alienacaoConsolidadaDolar).toBe(600_000n);
    expect(r.meses[6]?.alienacaoConsolidadaDolar).toBe(0n);
    expect(r.impostoDevido).toBe(18_000n);
    expect(r.isento).toBe(false);
  });

  it("até US$ 5.000,00 no ano: ganho isento (gcap-especie-isento-01)", () => {
    const r = apurarMoedaEspecie({
      estoqueInicial: 100_000n,
      saldoInicial: 500_000n,
      operacoes: [
        { tipo: "compra", data: "2025-02-10", quantidade: 200_000n, valor: 1_100_000n },
        {
          tipo: "venda",
          data: "2025-08-11",
          quantidade: 250_000n,
          valor: 1_500_000n,
          cotacaoDolar: 58_000_000n,
        },
      ],
    });
    expect(r.operacoes[1]).toMatchObject({
      custo: 1_333_333n,
      ganho: 166_667n,
      saldo: 266_667n,
      custoMedio: 5_333_333n,
    });
    expect(r.meses[7]).toMatchObject({
      alienacaoDolar: 258_620n,
      ganhoCapital: 166_667n,
      ganhoTributavel: 0n,
      impostoDevido: 0n,
    });
    expect(r.isento).toBe(true);
    expect(r.impostoDevido).toBe(0n);
  });

  it("custo médio e custo da venda truncados (execução do GCAP com frações)", () => {
    const r = apurarMoedaEspecie({
      estoqueInicial: 300_000n,
      saldoInicial: 200_000n,
      operacoes: [
        { tipo: "compra", data: "2025-02-10", quantidade: 1n, valor: 5n },
        {
          tipo: "venda",
          data: "2025-03-10",
          quantidade: 299_900n,
          valor: 1_700_000n,
          cotacaoDolar: 57_777_777n,
        },
        {
          tipo: "venda",
          data: "2025-03-12",
          quantidade: 51n,
          valor: 300n,
          cotacaoDolar: 57_777_777n,
        },
      ],
    });
    expect(r.custoMedioInicial).toBe(666_666n);
    expect(r.operacoes.map((o) => [o.custoMedio, o.custo, o.ganho, o.saldo, o.estoque])).toEqual([
      [666_681n, 0n, 0n, 200_005n, 300_001n],
      [666_681n, 199_937n, 1_500_063n, 68n, 101n],
      [666_681n, 34n, 266n, 34n, 50n],
    ]);
    expect(r.ganhoCapital).toBe(1_500_329n);
    // Alienações do mês em dólar: soma de valor / cotação sem arredondar, truncada no fim.
    expect(r.meses[2]?.alienacaoDolar).toBe(294_282n);
  });
});
