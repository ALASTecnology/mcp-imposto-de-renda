/**
 * Renda Variável (registros 40 a 43): ida e volta modelo, registros e modelo; controles do
 * arquivo gravado; regravação sobre a base; fórmulas mensais e totais anuais conferidos à mão.
 */
import { describe, expect, it } from "vitest";
import { modeloParaRegistros, registrosParaModelo } from "../../src/conversao/index.js";
import type { Registro } from "../../src/dbk/codec.js";
import { gravarArquivo, lerArquivo, verificarControles } from "../../src/dbk/index.js";
import { type DeclaracaoEntrada, zDeclaracao } from "../../src/model/index.js";
import { calcularDvCpf } from "../../src/validate/index.js";

const cpf = (base: string) => `${base}${calcularDvCpf(base)}`;
const TITULAR = cpf("123456789");
const DEP = cpf("987654321");

function identificacao(): DeclaracaoEntrada["identificacao"] {
  return {
    cpf: TITULAR,
    nome: "FULANA FICTICIA",
    dataNascimento: "1980-01-15",
    tipoDeclaracao: { tipo: "ajusteAnual" },
    racaCor: "2",
    conjuge: { possui: false },
    endereco: {
      local: "brasil",
      tipoLogradouro: "RUA",
      logradouro: "DAS ACACIAS FICTICIAS",
      numero: "10",
      bairro: "CENTRO",
      uf: "DF",
      municipio: "9701",
      cep: "70040010",
      celular: { ddd: "61", numero: "999990000" },
    },
    ocupacao: { natureza: "12", ocupacaoPrincipal: "212" },
  };
}

function entrada(): DeclaracaoEntrada {
  return {
    identificacao: identificacao(),
    dependentes: [
      {
        codigo: "21",
        nome: "FILHO FICTICIO",
        cpf: DEP,
        dataNascimento: "2015-06-01",
        racaCor: "2",
      },
    ],
    rendaVariavel: [
      {
        beneficiario: { tipo: "titular" },
        prejuizoAnteriorComuns: 100_000,
        irFonteDayTradeAnterior: 500,
        meses: [
          {
            mes: 1,
            comuns: { mercadoVistaAcoes: 300_000, opcoesAcoes: -50_000 },
            dayTrade: { futuroIndices: 200_000 },
            irFonteDayTrade: 2_000,
            irFonteLei11033: 15,
          },
          {
            mes: 2,
            comuns: { mercadoVistaAcoes: -80_000 },
            dayTrade: { futuroIndices: -10_000 },
            irFonteLei11033: 30,
          },
          {
            mes: 3,
            comuns: { mercadoVistaAcoes: 50_000 },
            dayTrade: { futuroIndices: 30_000 },
            irFonteDayTrade: 5_000,
          },
        ],
      },
      {
        beneficiario: { tipo: "dependente", cpf: DEP },
        meses: [{ mes: 6, comuns: { mercadoVistaOuro: 10_001 }, impostoPago: 1_500 }],
      },
    ],
    fundosImobiliarios: [
      {
        beneficiario: { tipo: "titular" },
        prejuizoAnterior: 20_000,
        meses: [
          { mes: 1, resultadoLiquido: 50_000, impostoRetidoFonte: 100 },
          { mes: 2, resultadoLiquido: -10_000 },
          { mes: 3, resultadoLiquido: 30_000, impostoPago: 4_000 },
        ],
      },
      {
        beneficiario: { tipo: "dependente", cpf: DEP },
        meses: [{ mes: 12, resultadoLiquido: 10_001 }],
      },
    ],
  };
}

const TIPOS = ["40", "41", "42", "43"];
const doTipo = (rs: readonly Registro[], tipo: string) => rs.filter((r) => r.tipo === tipo);
const mes40 = (rs: readonly Registro[], dep: "S" | "N", mes: number) => {
  const r = rs.find(
    (x) => x.tipo === "40" && x.campos.E_DEPENDENTE === dep && x.campos.NR_MES === BigInt(mes),
  );
  if (!r) throw new Error(`registro 40 ${dep} ${mes} ausente`);
  return r.campos;
};
const mes42 = (rs: readonly Registro[], dep: "S" | "N", mes: number) => {
  const r = rs.find(
    (x) => x.tipo === "42" && x.campos.E_DEPENDENTE === dep && x.campos.NR_MES === BigInt(mes),
  );
  if (!r) throw new Error(`registro 42 ${dep} ${mes} ausente`);
  return r.campos;
};

describe("Renda Variável: registros 40 a 43", () => {
  const dec = zDeclaracao.parse(entrada());
  const gravado = modeloParaRegistros(dec);
  const rs = gravado.registros;

  it("ida e volta: modelo, registros e o mesmo modelo", () => {
    const leitura = registrosParaModelo(rs);
    expect(leitura.tiposNaoMapeados).toEqual([]);
    const relido = zDeclaracao.parse(leitura.declaracao);
    expect(relido.rendaVariavel).toEqual(dec.rendaVariavel);
    expect(relido.fundosImobiliarios).toEqual(dec.fundosImobiliarios);
    expect({ ...relido, resumoCalculado: undefined }).toEqual(dec);
  });

  it("bytes gravados e relidos conferem com os controles", () => {
    const bytes = gravarArquivo(rs);
    const relidos = lerArquivo(bytes).registros;
    expect(verificarControles(relidos).divergencias).toEqual([]);
    const volta = zDeclaracao.parse(registrosParaModelo(relidos).declaracao);
    expect({ ...volta, resumoCalculado: undefined }).toEqual(dec);
  });

  it("regravar sobre a base sem mudanças devolve os mesmos registros", () => {
    const de = modeloParaRegistros(dec, {
      base: rs,
      totais: "preservar",
      controles: { controleHeader: "preservar" },
    });
    for (const t of TIPOS) expect(doTipo(de.registros, t)).toEqual(doTipo(rs, t));
    expect(de.registros).toEqual(rs);
  });

  it("grava os 12 meses por pessoa e um total anual consolidado (T9)", () => {
    expect(doTipo(rs, "40")).toHaveLength(24);
    expect(doTipo(rs, "41")).toHaveLength(1);
    expect(doTipo(rs, "42")).toHaveLength(24);
    expect(doTipo(rs, "43")).toHaveLength(1);
    const t9 = rs.find((r) => r.tipo === "T9")?.campos;
    expect(t9?.QT_R40).toBe(24n);
    expect(t9?.QT_R41).toBe(1n);
    expect(t9?.QT_R42).toBe(24n);
    expect(t9?.QT_R43).toBe(1n);
    const titular = mes40(rs, "N", 1);
    expect(titular.NR_CPF_DEPEN === "" || titular.NR_CPF_DEPEN === null).toBe(true);
    expect(mes40(rs, "S", 1).NR_CPF_DEPEN).toBe(DEP);
  });

  it("janeiro: prejuízo anterior, alíquotas, IRRF day-trade e Lei 11.033", () => {
    const m = mes40(rs, "N", 1);
    expect(m.VR_COMUM_MVISTA_ACOES).toBe(300_000n);
    expect(m.VR_COMUM_MOPC_ACOES).toBe(-50_000n);
    expect(m.VR_RESULTNEG_MESANT_COMUM).toBe(100_000n);
    expect(m.VR_FONTE_DAYTRADE_ANTJAN).toBe(500n);
    expect(m.VR_RESULTLIQ_MES_COMUM).toBe(250_000n);
    expect(m.VR_RESULTLIQ_MES_DAYTR).toBe(200_000n);
    expect(m.VR_BASECALCULO_MES_COMUM).toBe(150_000n);
    expect(m.VR_BASECALCULO_MES_DAYTR).toBe(200_000n);
    expect(m.VR_PREJACOMPENS_MES_COMUM).toBe(0n);
    expect(m.VR_ALIQUOTA_IMPOSTO_COMUM).toBe(15n);
    expect(m.VR_ALIQUOTA_IMPOSTO_DAYTRADE).toBe(20n);
    expect(m.VR_IMPOSTODEVIDO_MES_COMUM).toBe(22_500n);
    expect(m.VR_IMPOSTODEVIDO_MES_DAYTR).toBe(40_000n);
    expect(m.VR_TOTAL_IMPOSTODEVIDO).toBe(62_500n);
    expect(m.VR_FONTE_DAYTRADE).toBe(2_000n);
    expect(m.VR_IRFONTE_MESESANT_DAYTR).toBe(500n);
    expect(m.VR_IRFONTE_ACOMPENS_DAYTR).toBe(0n);
    expect(m.VR_IMPRENDAFONTE).toBe(15n);
    expect(m.VR_IRF_MESESANT).toBe(0n);
    expect(m.VR_IRF_COMPENSAR).toBe(0n);
    // 62.500 - (2.000 + 500) - 15
    expect(m.VR_TOTAL_IMPOSTOAPAGAR).toBe(59_985n);
  });

  it("prejuízo separado entre comuns e day-trade e saldos compensáveis nos meses seguintes", () => {
    const fev = mes40(rs, "N", 2);
    expect(fev.VR_RESULTNEG_MESANT_COMUM).toBe(0n);
    expect(fev.VR_PREJACOMPENS_MES_COMUM).toBe(80_000n);
    expect(fev.VR_PREJACOMPENS_MES_DAYTR).toBe(10_000n);
    expect(fev.VR_TOTAL_IMPOSTODEVIDO).toBe(0n);
    expect(fev.VR_IRF_COMPENSAR).toBe(30n);
    expect(fev.VR_TOTAL_IMPOSTOAPAGAR).toBe(0n);

    const mar = mes40(rs, "N", 3);
    expect(mar.VR_RESULTNEG_MESANT_COMUM).toBe(80_000n);
    expect(mar.VR_BASECALCULO_MES_COMUM).toBe(0n);
    expect(mar.VR_PREJACOMPENS_MES_COMUM).toBe(30_000n);
    expect(mar.VR_RESULTNEG_MESANT_DAYTR).toBe(10_000n);
    expect(mar.VR_BASECALCULO_MES_DAYTR).toBe(20_000n);
    expect(mar.VR_IMPOSTODEVIDO_MES_DAYTR).toBe(4_000n);
    expect(mar.VR_IRFONTE_ACOMPENS_DAYTR).toBe(1_000n);
    expect(mar.VR_IRF_MESESANT).toBe(30n);
    expect(mar.VR_IRF_COMPENSAR).toBe(30n);
    expect(mar.VR_TOTAL_IMPOSTOAPAGAR).toBe(0n);

    const dez = mes40(rs, "N", 12);
    expect(dez.VR_RESULTNEG_MESANT_COMUM).toBe(30_000n);
    expect(dez.VR_PREJACOMPENS_MES_COMUM).toBe(30_000n);
    expect(dez.VR_IRFONTE_MESESANT_DAYTR).toBe(1_000n);
    expect(dez.VR_IRFONTE_ACOMPENS_DAYTR).toBe(1_000n);
    expect(dez.VR_RESULTNEG_MESANT_DAYTR).toBe(0n);
    expect(dez.VR_FONTE_DAYTRADE_ANTJAN).toBe(0n);
  });

  it("imposto truncado no centavo (dependente)", () => {
    const jun = mes40(rs, "S", 6);
    // 10.001 x 15% = 1.500,15 centavos, truncado
    expect(jun.VR_IMPOSTODEVIDO_MES_COMUM).toBe(1_500n);
    expect(jun.VR_TOTAL_IMPOSTOAPAGAR).toBe(1_500n);
    expect(jun.VR_IMPOSTO_PAGO).toBe(1_500n);
  });

  it("totais anuais do registro 41 somam os meses de todas as pessoas", () => {
    const t = doTipo(rs, "41")[0]?.campos;
    expect(t?.VR_RESULTLIQUIDO).toBe(450_001n);
    expect(t?.VR_RESULTNEGMESANTERIOR).toBe(460_000n);
    expect(t?.VR_BASECALCULO).toBe(380_001n);
    expect(t?.VR_PREJUIZOCOMPENSAR).toBe(390_000n);
    expect(t?.VR_IMPOSTODEVIDO).toBe(68_000n);
    expect(t?.VR_CONSOL_IMPOSTOIMPOSTODEVIDO).toBe(68_000n);
    expect(t?.VR_CONSOL_IRFONTEDAYTRMESANT).toBe(9_500n);
    expect(t?.VR_CONSOL_IRFONTEDAYTRCOMPENSAR).toBe(10_000n);
    expect(t?.VR_TOTALANUALIRFONTELEI11033).toBe(45n);
    expect(t?.VR_CONSOL_IMPOSTOAPAGAR).toBe(61_485n);
  });

  it("FII: alíquota de 20%, prejuízo e IR na fonte compensáveis", () => {
    const jan = mes42(rs, "N", 1);
    expect(jan.VR_RESLIQUIDO_MES).toBe(50_000n);
    expect(jan.VR_RESULT_NEG_MESANT).toBe(20_000n);
    expect(jan.VR_BASECALCULO_MES).toBe(30_000n);
    expect(jan.VR_ALIQUOTA_IMPOSTO_OPCOMUNS).toBe(20n);
    expect(jan.VR_IMPOSTODEVIDO_MES_OPCOMUNS).toBe(6_000n);
    expect(jan.VR_IMPOSTO_RETIDO_FONTE).toBe(100n);
    expect(jan.VR_IMPOSTO_RETIDO_COMPENSAR).toBe(0n);
    expect(jan.VR_IMPOSTO_PAGAR).toBe(5_900n);
    const fev = mes42(rs, "N", 2);
    expect(fev.VR_RESLIQUIDO_MES).toBe(-10_000n);
    expect(fev.VR_PREJACOMPENSAR_MES_OPCOMUNS).toBe(10_000n);
    expect(fev.VR_IMPOSTO_PAGAR).toBe(0n);
    const mar = mes42(rs, "N", 3);
    expect(mar.VR_RESULT_NEG_MESANT).toBe(10_000n);
    expect(mar.VR_BASECALCULO_MES).toBe(20_000n);
    expect(mar.VR_IMPOSTODEVIDO_MES_OPCOMUNS).toBe(4_000n);
    expect(mar.VR_IMPOSTOPAGO).toBe(4_000n);
    // 10.001 x 20% = 2.000,2 centavos, truncado
    expect(mes42(rs, "S", 12).VR_IMPOSTODEVIDO_MES_OPCOMUNS).toBe(2_000n);

    const t = doTipo(rs, "43")[0]?.campos;
    expect(t?.VR_TOTALANUALRESULTADOLIQUIDOSRENDAVARIAVEL_FII).toBe(80_001n);
    expect(t?.VR_TOTALANUALRESULTADONEGATIVOMESANTERIOR_FII).toBe(30_000n);
    expect(t?.VR_TOTALANUALBASECALCULOIMPOSTO_FII).toBe(60_001n);
    expect(t?.VR_TOTALANUALPREJUIZOCOMPENSAR_FII).toBe(10_000n);
    expect(t?.VR_TOTALANUALIMPOSTODEVIDO_FII).toBe(12_000n);
    expect(t?.VR_TOTALANUALIMPOSTOPAGAR_FII).toBe(11_900n);
    expect(t?.VR_TOTALANUALIMPOSTORETIDONAFONTE_FII).toBe(100n);
  });

  it("IR fonte Lei 11.033 de FII compensa o imposto de meses seguintes", () => {
    const d = zDeclaracao.parse({
      identificacao: identificacao(),
      fundosImobiliarios: [
        {
          beneficiario: { tipo: "titular" },
          meses: [
            { mes: 1, resultadoLiquido: 1_000, impostoRetidoFonte: 500 },
            { mes: 2, resultadoLiquido: 5_000 },
          ],
        },
      ],
    });
    const r = modeloParaRegistros(d).registros;
    const jan = mes42(r, "N", 1);
    expect(jan.VR_IMPOSTODEVIDO_MES_OPCOMUNS).toBe(200n);
    expect(jan.VR_IMPOSTO_RETIDO_COMPENSAR).toBe(300n);
    expect(jan.VR_IMPOSTO_PAGAR).toBe(0n);
    const fev = mes42(r, "N", 2);
    expect(fev.VR_IMPOSTO_RETIDO_MESES_ANTERIORES).toBe(300n);
    expect(fev.VR_IMPOSTODEVIDO_MES_OPCOMUNS).toBe(1_000n);
    expect(fev.VR_IMPOSTO_RETIDO_COMPENSAR).toBe(0n);
    expect(fev.VR_IMPOSTO_PAGAR).toBe(700n);
  });

  it("sem fichas de renda variável não grava os registros 40 a 43", () => {
    const d = zDeclaracao.parse({ identificacao: identificacao() });
    const r = modeloParaRegistros(d).registros;
    for (const t of TIPOS) expect(doTipo(r, t)).toHaveLength(0);
    expect(zDeclaracao.parse(registrosParaModelo(r).declaracao).rendaVariavel).toEqual([]);
  });
});
