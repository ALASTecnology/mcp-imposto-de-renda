/**
 * Calculadoras auxiliares, chamadas pelo servidor real. Os valores esperados foram calculados à
 * mão (conta no comentário de cada caso), em centavos, sem reaproveitar o código testado.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type Conexao, conectar, textoDe } from "./apoio.js";

let c: Conexao;

beforeAll(async () => {
  c = await conectar();
});
afterAll(async () => {
  await c.fechar();
});

async function ok(nome: string, args: Record<string, unknown>) {
  const r = await c.chamar(nome, args);
  expect(r.isError, `${nome}: ${textoDe(r)}`).toBeFalsy();
  return r.structuredContent as Record<string, unknown>;
}

async function erro(nome: string, args: Record<string, unknown>): Promise<string> {
  const r = await c.chamar(nome, args);
  expect(r.isError, `${nome} deveria falhar: ${textoDe(r)}`).toBe(true);
  return textoDe(r);
}

describe("converter_moeda", () => {
  it("formato brasileiro: 1.234,56 x 5,1234 = R$ 6.325,14", async () => {
    // 123456 centavos x 5,1234 = 6.325.144,704 / 10.000 = 632.514 (fração descartada).
    const s = await ok("converter_moeda", {
      valor: "1.234,56",
      cotacao: "5,1234",
      finalidade: "rendimento",
    });
    expect(s.reais).toBe(632_514);
  });

  it("ponto decimal sem vírgula (1234.56) é lido como 1.234,56, não 123.456,00", async () => {
    // 123456 centavos x 5,0000 = 617.280 centavos (R$ 6.172,80).
    const s = await ok("converter_moeda", {
      valor: "1234.56",
      cotacao: "5,0000",
      finalidade: "rendimento",
    });
    expect(s.reais).toBe(617_280);
  });

  it("valor inteiro e valor com milhares em vários grupos", async () => {
    expect(
      (await ok("converter_moeda", { valor: "100", cotacao: "5,5", finalidade: "bem" })).reais,
    ).toBe(55_000);
    // 1.234.567,00 x 2 = 2.469.134,00.
    expect(
      (await ok("converter_moeda", { valor: "1.234.567", cotacao: "2", finalidade: "bem" })).reais,
    ).toBe(246_913_400);
  });

  it("recusa 1.234 por ambiguidade (mil e duzentos ou um e pouco)", async () => {
    const t = await erro("converter_moeda", {
      valor: "1.234",
      cotacao: "5,0000",
      finalidade: "rendimento",
    });
    expect(t).toMatch(/ambíguo/);
    expect(t).toMatch(/1\.234,00/);
  });

  it("recusa formatos que não são reais nem ponto decimal simples", async () => {
    for (const valor of ["1,234.56", "1,234", "12.34.5", "abc", "-10,00"]) {
      const t = await erro("converter_moeda", { valor, cotacao: "5", finalidade: "deducao" });
      expect(t, valor).toMatch(/valor/);
    }
  });
});

describe("apurar_renda_variavel", () => {
  type Mes = Record<string, unknown>;
  const meses = async (args: Record<string, unknown>) => {
    const s = await ok("apurar_renda_variavel", args);
    return { meses: s.meses as Mes[], avisos: s.avisos as string[] };
  };

  it("acumula o Darf abaixo de R$ 10,00 e recolhe quando a soma chega a R$ 10,00", async () => {
    // Ganho de R$ 40,00 em operações comuns: 15% = R$ 6,00 por mês.
    const r = await meses({
      meses: [
        { mes: 1, comuns: "40,00" },
        { mes: 2, comuns: "40,00" },
        { mes: 3, comuns: "20,00" },
      ],
    });
    expect(r.meses.map((m) => [m.mes, m.impostoDevido, m.impostoPagar, m.recolher])).toEqual([
      [1, 600, 600, false],
      [2, 600, 1_200, true],
      [3, 300, 300, false],
    ]);
    expect(r.meses.map((m) => m.impostoMesesAnteriores)).toEqual([0, 600, 0]);
    expect(r.meses[1]?.vencimento).toBe("2025-03-31");
    // Março termina com R$ 3,00 pendentes: a ferramenta avisa.
    expect(r.avisos.join(" ")).toMatch(/R\$ 3,00/);
  });

  it("o acumulado atravessa meses sem operação informada", async () => {
    const r = await meses({
      meses: [
        { mes: 5, comuns: "60,00" },
        { mes: 9, comuns: "10,00" },
      ],
    });
    // 15% de 60,00 = 9,00 (fica); setembro: 1,50 + 9,00 = 10,50 (recolhe).
    expect(r.meses.map((m) => [m.impostoPagar, m.recolher])).toEqual([
      [900, false],
      [1_050, true],
    ]);
  });

  it("compensa prejuízo anterior, IR de day-trade e aplica alíquotas por tipo", async () => {
    const r = await meses({
      prejuizo_anterior_comuns: "500,00",
      meses: [
        // Comuns: 800,00 - 500,00 = 300,00 x 15% = 45,00. Day-trade: 1.000,00 x 20% = 200,00.
        // Devido 245,00; IR de day-trade 10,00; a pagar 235,00.
        { mes: 1, comuns: "800,00", day_trade: "1.000,00", irrf_day_trade: "10,00" },
        // FII: perda de 1.000,00 em fevereiro e ganho de 1.500,00 em março: 500,00 x 20%.
        { mes: 2, fii: "-1.000,00" },
        { mes: 3, fii: "1.500,00" },
      ],
    });
    const [jan, fev, mar] = r.meses;
    expect(jan).toMatchObject({
      baseComuns: 30_000,
      baseDayTrade: 100_000,
      impostoDevido: 24_500,
      irrfCompensado: 1_000,
      impostoPagar: 23_500,
      recolher: true,
      prejuizoComunsSeguinte: 0,
    });
    expect(fev).toMatchObject({ impostoDevido: 0, prejuizoFiiSeguinte: 100_000 });
    expect(mar).toMatchObject({ baseFii: 50_000, impostoDevido: 10_000, prejuizoFiiSeguinte: 0 });
  });

  it("isenta o ganho com ações à vista quando as vendas do mês não passam de R$ 20.000,00", async () => {
    const r = await meses({
      meses: [
        { mes: 4, comuns: "2.000,00", vendas_acoes: "15.000,00", ganho_acoes_vista: "2.000,00" },
        { mes: 5, comuns: "2.000,00", vendas_acoes: "25.000,00", ganho_acoes_vista: "2.000,00" },
      ],
    });
    expect(r.meses[0]).toMatchObject({ isentoAcoes: 200_000, baseComuns: 0, impostoDevido: 0 });
    // Vendas acima do limite: 2.000,00 x 15% = 300,00.
    expect(r.meses[1]).toMatchObject({ isentoAcoes: 0, impostoDevido: 30_000 });
  });
});

describe("calcular_rra", () => {
  it("tabela acumulada de 10 meses (maio a dezembro de 2025)", async () => {
    // Faixa de 15% vezes 10 meses vai até 37.510,50; 30.000,00 x 15% = 4.500,00 menos
    // 394,16 x 10 = 3.941,60: imposto 558,40. Saldo depois do IRRF de 500,00: 58,40.
    // Ajuste anual: 30.000,00 x 7,5% - 2.135,04 = 114,96, menor que 558,40.
    const s = await ok("calcular_rra", {
      rendimentos: "30.000,00",
      numero_meses: 10,
      mes_recebimento: 6,
      irrf: "500,00",
      outros_rendimentos_base: "0,00",
    });
    expect(s).toMatchObject({
      base: 3_000_000,
      impostoExclusivo: 55_840,
      saldoExclusivo: 5_840,
      impostoAjusteAnual: 11_496,
      maisVantajosa: "ajusteAnual",
    });
  });

  it("meses com uma casa decimal (2,5 meses, tabela de janeiro a abril)", async () => {
    // 10.000,00 passa da faixa de 15% (3.751,05 x 2,5 = 9.377,625) e fica na de 22,5%:
    // 10.000,00 x 22,5% = 2.250,00 menos 662,77 x 2,5 = 1.656,925 (1.656,92): 593,08.
    const s = await ok("calcular_rra", {
      rendimentos: "10.000,00",
      numero_meses: 2.5,
      mes_recebimento: 3,
    });
    expect(s.impostoExclusivo).toBe(59_308);
  });

  it("aceita 0,1 mês, a menor fração com uma casa decimal", async () => {
    // Faixa isenta de 0,1 mês: 225,92: R$ 100,00 não paga imposto.
    const s = await ok("calcular_rra", {
      rendimentos: "100,00",
      numero_meses: 0.1,
      mes_recebimento: 1,
    });
    expect(s.impostoExclusivo).toBe(0);
  });

  it("recusa menos de 0,1 mês em vez de tributar tudo a 27,5%", async () => {
    const t = await erro("calcular_rra", {
      rendimentos: "1.000,00",
      numero_meses: 0.04,
      mes_recebimento: 6,
    });
    expect(t).toMatch(/numero_meses/);
    expect(t).toMatch(/0,1/);
  });
});

describe("calcular_acrescimos_moratorios", () => {
  it("multa de 0,33% ao dia e juros da Selic mais 1% no mês do pagamento", async () => {
    // 30/04 a 15/06: 31 dias de maio e 15 de junho = 46 dias; 46 x 0,33% = 15,18%.
    // Juros: Selic de maio (2,00%) + 1% de junho = 3% de 1.000,00 = 30,00.
    const s = await ok("calcular_acrescimos_moratorios", {
      principal: "1.000,00",
      vencimento: "2026-04-30",
      data_pagamento: "2026-06-15",
      selic_acumulada: "2,00",
    });
    expect(s).toMatchObject({
      diasAtraso: 46,
      percentualMulta: "1518",
      multa: 15_180,
      juros: 3_000,
      total: 118_180,
    });
  });

  it("multa limitada a 20% e juros nulos sem a Selic", async () => {
    const s = await ok("calcular_acrescimos_moratorios", {
      principal: "1.000,00",
      vencimento: "2025-01-31",
      data_pagamento: "2026-01-31",
    });
    expect(s).toMatchObject({
      diasAtraso: 365,
      percentualMulta: "2000",
      multa: 20_000,
      juros: null,
      total: null,
    });
  });

  it("pagamento até o vencimento não tem acréscimos", async () => {
    const s = await ok("calcular_acrescimos_moratorios", {
      principal: "1.000,00",
      vencimento: "2026-04-30",
      data_pagamento: "2026-04-30",
      selic_acumulada: "1,00",
    });
    expect(s).toMatchObject({ diasAtraso: 0, multa: 0, juros: 0, total: 100_000 });
  });
});

describe("calcular_carne_leao", () => {
  it("deduções legais maiores que o desconto simplificado (junho, tabela de maio)", async () => {
    // Deduções: 500,00 + 189,59 = 689,59 (maior que 607,20). Base 4.310,41, faixa de 22,5%:
    // 4.310,41 x 22,5% = 969,84 menos 675,49 = 294,35. Darf até 31/07/2025 (quinta-feira).
    const s = await ok("calcular_carne_leao", {
      mes: 6,
      rendimentos: "5.000,00",
      previdencia: "500,00",
      dependentes: 1,
    });
    expect(s).toMatchObject({
      deducoesLegais: 68_959,
      usaSimplificado: false,
      base: 431_041,
      imposto: 29_435,
      codigoDarf: "0190",
      vencimento: "2025-07-31",
    });
  });

  it("desconto simplificado na tabela de janeiro a abril", async () => {
    // 3.000,00 - 564,80 = 2.435,20; 7,5% = 182,64 menos 169,44 = 13,20.
    const s = await ok("calcular_carne_leao", { mes: 2, rendimentos: "3.000,00" });
    expect(s).toMatchObject({ usaSimplificado: true, base: 243_520, imposto: 1_320 });
  });
});

describe("calcular_preco_medio", () => {
  it("custo médio ponderado com custos e day-trade separado", async () => {
    const s = await ok("calcular_preco_medio", {
      operacoes: [
        {
          data: "2025-01-10",
          ativo: "AAAA3",
          tipo: "compra",
          quantidade: 100,
          valor: "3.000,00",
          custos: "10,00",
        },
        {
          data: "2025-02-10",
          ativo: "AAAA3",
          tipo: "compra",
          quantidade: 100,
          valor: "4.000,00",
          custos: "10,00",
        },
        {
          data: "2025-03-10",
          ativo: "AAAA3",
          tipo: "venda",
          quantidade: 50,
          valor: "2.500,00",
          custos: "5,00",
        },
        { data: "2025-04-01", ativo: "BBBB3", tipo: "compra", quantidade: 10, valor: "600,00" },
        { data: "2025-04-01", ativo: "BBBB3", tipo: "venda", quantidade: 10, valor: "650,00" },
      ],
    });
    // Custo 3.010,00 + 4.010,00 = 7.020,00 por 200; 50 vendidas custam 1.755,00 (35,10 cada).
    // Venda líquida 2.495,00: resultado 740,00. Sobram 150 a 5.265,00.
    expect(s.vendas).toEqual([
      {
        data: "2025-03-10",
        ativo: "AAAA3",
        quantidade: 50,
        valorLiquido: 249_500,
        custoMedio: 3_510,
        resultado: 74_000,
        dayTrade: false,
      },
      {
        data: "2025-04-01",
        ativo: "BBBB3",
        quantidade: 10,
        valorLiquido: 65_000,
        custoMedio: 6_000,
        resultado: 5_000,
        dayTrade: true,
      },
    ]);
    expect(s.posicoes).toContainEqual({
      ativo: "AAAA3",
      quantidade: 150,
      custoTotal: 526_500,
      custoMedio: 3_510,
    });
  });

  it("recusa venda maior que a posição", async () => {
    const t = await erro("calcular_preco_medio", {
      operacoes: [
        { data: "2025-01-10", ativo: "CCCC3", tipo: "venda", quantidade: 1, valor: "10,00" },
      ],
    });
    expect(t).toMatch(/maior que a posição/);
  });
});

describe("calcular_ganho_capital", () => {
  it("bem móvel acima do limite de pequeno valor: 15% sobre o ganho", async () => {
    // 50.000,00 - 30.000,00 = 20.000,00 x 15% = 3.000,00; Darf até 30/04/2025 (quarta-feira).
    const s = await ok("calcular_ganho_capital", {
      tipo: "movel",
      valor_alienacao: "50.000,00",
      custo_aquisicao: "30.000,00",
      data_aquisicao: "2020-01-10",
      data_alienacao: "2025-03-10",
    });
    expect(s).toMatchObject({
      ganhoBruto: 2_000_000,
      ganhoTributavel: 2_000_000,
      imposto: 300_000,
      codigoDarf: "4600",
      vencimento: "2025-04-30",
    });
  });

  it("alíquotas progressivas: 5 milhões a 15% e o excedente a 17,5%", async () => {
    // Ganho 6.000.000,00: 5.000.000,00 x 15% = 750.000,00 + 1.000.000,00 x 17,5% = 175.000,00.
    const s = await ok("calcular_ganho_capital", {
      tipo: "participacao",
      valor_alienacao: "7.000.000,00",
      custo_aquisicao: "1.000.000,00",
      data_aquisicao: "2020-01-10",
      data_alienacao: "2025-03-10",
    });
    expect(s.imposto).toBe(92_500_000);
  });

  it("isenções de pequeno valor e de único imóvel", async () => {
    const pequeno = await ok("calcular_ganho_capital", {
      tipo: "movel",
      valor_alienacao: "30.000,00",
      custo_aquisicao: "10.000,00",
      data_aquisicao: "2020-01-10",
      data_alienacao: "2025-03-10",
    });
    expect(pequeno).toMatchObject({ ganhoTributavel: 0, isento: 2_000_000, imposto: 0 });
    const unico = await ok("calcular_ganho_capital", {
      tipo: "imovel",
      valor_alienacao: "400.000,00",
      custo_aquisicao: "300.000,00",
      data_aquisicao: "2020-01-10",
      data_alienacao: "2025-03-10",
      unico_imovel: true,
    });
    expect(unico).toMatchObject({ ganhoBruto: 10_000_000, isento: 10_000_000, imposto: 0 });
  });
});

describe("atualizar_custo_bem", () => {
  it("UFIR, fator e Lei 14.973/2024", async () => {
    // 1.000 UFIR x 0,8287 = 828,70.
    expect(
      (await ok("atualizar_custo_bem", { metodo: "ufir", quantidade_ufir: "1000,0000" }))
        .valorAtualizado,
    ).toBe(82_870);
    const f = await ok("atualizar_custo_bem", {
      metodo: "fator",
      valor_original: "1.000,00",
      fator: "1,5",
    });
    expect(f).toMatchObject({ valorAtualizado: 150_000, diferenca: 50_000 });
    // Diferença 50.000,00 x 4% = 2.000,00.
    const l = await ok("atualizar_custo_bem", {
      metodo: "lei14973",
      valor_original: "100.000,00",
      valor_mercado: "150.000,00",
    });
    expect(l).toMatchObject({ diferenca: 5_000_000, imposto: 200_000 });
  });

  it("recusa método sem o dado exigido", async () => {
    expect(await erro("atualizar_custo_bem", { metodo: "fator", fator: "1,1" })).toMatch(
      /valor_original/,
    );
  });
});

describe("calcular_condicao_residencia", () => {
  it("datas de início da condição", async () => {
    const saida = await ok("calcular_condicao_residencia", {
      evento: "saida_definitiva",
      data: "2025-03-10",
    });
    expect(saida).toMatchObject({ condicao: "naoResidente", desde: "2025-03-10" });
    // 12 meses fora completam em 10/03/2026: não residente no dia seguinte.
    const ausencia = await ok("calcular_condicao_residencia", {
      evento: "ausencia_temporaria",
      data: "2025-03-10",
    });
    expect(ausencia).toMatchObject({ condicao: "naoResidente", desde: "2026-03-11" });
    // 1º/1 mais 183 dias = 3/7 (184º dia no país).
    const visto = await ok("calcular_condicao_residencia", {
      evento: "visto_temporario",
      data: "2025-01-01",
    });
    expect(visto).toMatchObject({ condicao: "residente", desde: "2025-07-03" });
  });
});

describe("verificar_obrigatoriedade", () => {
  it("limites são exclusivos: só acima do valor obriga", async () => {
    expect(
      (await ok("verificar_obrigatoriedade", { rendimentos_tributaveis: "35.584,00" })).obrigado,
    ).toBe(false);
    expect(
      (await ok("verificar_obrigatoriedade", { rendimentos_tributaveis: "35.584,01" })).obrigado,
    ).toBe(true);
    expect((await ok("verificar_obrigatoriedade", { bens: "800.000,01" })).obrigado).toBe(true);
    expect((await ok("verificar_obrigatoriedade", { trust: true })).obrigado).toBe(true);
  });
});
