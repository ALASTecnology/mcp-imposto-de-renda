/**
 * Renda Variável, operações comuns e day-trade (registros 40 mensal e 41 anual), e operações
 * em FII ou Fiagro (42 mensal e 43 anual), do titular e de cada dependente.
 *
 * Do modelo vêm os campos digitados: ganho ou perda por mercado, IR na fonte de day-trade e da
 * Lei 11.033/2004, imposto pago e, em janeiro, o prejuízo e o IR na fonte de day-trade de anos
 * anteriores. Os demais campos são calculados como no demonstrativo do programa:
 *
 * - resultado líquido do mês = soma dos mercados (comuns e day-trade separados);
 * - base = resultado menos o prejuízo a compensar que vem do mês anterior (nunca negativa); o
 *   que sobrar de prejuízo segue para o mês seguinte, separado entre comuns e day-trade;
 * - imposto = base x 15% (comuns) ou 20% (day-trade e FII), truncado no centavo;
 * - o IR na fonte de day-trade (do mês e o saldo dos meses anteriores) compensa primeiro o
 *   imposto do mês; depois o IR na fonte da Lei 11.033/2004; os saldos seguem para os meses
 *   seguintes; imposto a pagar = imposto devido menos as compensações;
 * - os registros 41 e 43 somam os 12 meses de todas as pessoas.
 *
 * Sem caso de referência do programa com renda variável, são inferências documentadas: gravar
 * os 12 meses de cada pessoa com ficha, compensar o IR de day-trade contra o imposto total do
 * mês, e a isenção de vendas de ações até R$ 20.000,00 (que exige o total de vendas, ausente no
 * modelo) não é aplicada: informe em mercadoVistaAcoes só o ganho tributável.
 */
import type { Beneficiario } from "../../model/comum.js";
import type { MercadosRendaVariavel } from "../../model/renda-variavel.js";
import { numero, type Objeto, texto, type Valores } from "../campos.js";
import type { ContextoGravacao, ContextoLeitura, Mapeador } from "../contexto.js";

/** Campo do modelo e sufixo do campo no registro 40. */
const MERCADOS: readonly (readonly [keyof MercadosRendaVariavel, string])[] = [
  ["mercadoVistaAcoes", "MVISTA_ACOES"],
  ["mercadoVistaOuro", "MVISTA_OURO"],
  ["mercadoVistaOuroForaBolsa", "MVISTA_OUROFORA"],
  ["opcoesAcoes", "MOPC_ACOES"],
  ["opcoesOuro", "MOPC_OURO"],
  ["opcoesOuroForaBolsa", "MOPC_OUROFORA"],
  ["opcoesOutros", "MOPC_OUTROS"],
  ["futuroDolar", "MFUT_DOLAR"],
  ["futuroIndices", "MFUT_INDICES"],
  ["futuroJuros", "MFUT_JUROS"],
  ["futuroOutros", "MFUT_OUTROS"],
  ["termoAcoesOuro", "MTERMO_ACOESOURO"],
  ["termoOutros", "MTERMO_OUTROS"],
];

const ALIQUOTA_COMUM = 15n;
const ALIQUOTA_DAY_TRADE = 20n;
const ALIQUOTA_FII = 20n;

const imposto = (base: bigint, aliquota: bigint) => (base * aliquota) / 100n;
const min = (a: bigint, b: bigint) => (a < b ? a : b);
const pos = (v: bigint) => (v > 0n ? v : 0n);

function beneficiarioDe(ctx: ContextoLeitura, dep: string, cpf: string): Objeto {
  return dep === "S" && cpf !== "" && cpf !== ctx.cpfTitular
    ? { tipo: "dependente", cpf }
    : { tipo: "titular" };
}

function identificacaoPessoa(b: Beneficiario): Valores {
  return b.tipo === "dependente"
    ? { E_DEPENDENTE: "S", NR_CPF_DEPEN: b.cpf }
    : { E_DEPENDENTE: "N", NR_CPF_DEPEN: "" };
}

/** Agrupa os registros mensais por pessoa, na ordem do arquivo. */
function porPessoa(ctx: ContextoLeitura, tipo: string) {
  const grupos = new Map<string, { beneficiario: Objeto; registros: typeof lista }>();
  const lista = [...ctx.doTipo(tipo)];
  for (const r of lista) {
    const dep = texto(r, "E_DEPENDENTE");
    const cpf = texto(r, "NR_CPF_DEPEN");
    const chave = dep === "S" ? cpf : "";
    let g = grupos.get(chave);
    if (!g) {
      g = { beneficiario: beneficiarioDe(ctx, dep, cpf), registros: [] };
      grupos.set(chave, g);
    }
    g.registros.push(r);
  }
  return [...grupos.values()];
}

function lerRendaVariavel(ctx: ContextoLeitura): Objeto[] {
  return porPessoa(ctx, "40").map(({ beneficiario, registros }) => {
    const jan = registros.find((r) => numero(r, "NR_MES") === 1n);
    const meses: Objeto[] = [];
    for (const r of [...registros].sort((a, b) =>
      Number(numero(a, "NR_MES") - numero(b, "NR_MES")),
    )) {
      const lerMercados = (prefixo: string) => {
        const o: Objeto = {};
        for (const [campo, sufixo] of MERCADOS) {
          const v = numero(r, `VR_${prefixo}_${sufixo}`);
          if (v !== 0n) o[campo] = v;
        }
        return o;
      };
      const comuns = lerMercados("COMUM");
      const dayTrade = lerMercados("DAYTR");
      const mes = {
        mes: Number(numero(r, "NR_MES")),
        comuns,
        dayTrade,
        irFonteDayTrade: numero(r, "VR_FONTE_DAYTRADE"),
        irFonteLei11033: numero(r, "VR_IMPRENDAFONTE"),
        impostoPago: numero(r, "VR_IMPOSTO_PAGO"),
      };
      const vazio =
        Object.keys(comuns).length === 0 &&
        Object.keys(dayTrade).length === 0 &&
        mes.irFonteDayTrade === 0n &&
        mes.irFonteLei11033 === 0n &&
        mes.impostoPago === 0n;
      if (!vazio) meses.push(mes);
    }
    return {
      beneficiario,
      prejuizoAnteriorComuns: numero(jan, "VR_RESULTNEG_MESANT_COMUM"),
      prejuizoAnteriorDayTrade: numero(jan, "VR_RESULTNEG_MESANT_DAYTR"),
      irFonteDayTradeAnterior: numero(jan, "VR_FONTE_DAYTRADE_ANTJAN"),
      meses,
    };
  });
}

function lerFii(ctx: ContextoLeitura): Objeto[] {
  return porPessoa(ctx, "42").map(({ beneficiario, registros }) => {
    const jan = registros.find((r) => numero(r, "NR_MES") === 1n);
    const meses: Objeto[] = [];
    for (const r of [...registros].sort((a, b) =>
      Number(numero(a, "NR_MES") - numero(b, "NR_MES")),
    )) {
      const resultado = numero(r, "VR_RESLIQUIDO_MES");
      const retido = numero(r, "VR_IMPOSTO_RETIDO_FONTE");
      const pago = numero(r, "VR_IMPOSTOPAGO");
      if (resultado === 0n && retido === 0n && pago === 0n) continue;
      meses.push({
        mes: Number(numero(r, "NR_MES")),
        ...(resultado !== 0n ? { resultadoLiquido: resultado } : {}),
        impostoRetidoFonte: retido,
        impostoPago: pago,
      });
    }
    return { beneficiario, prejuizoAnterior: numero(jan, "VR_RESULT_NEG_MESANT"), meses };
  });
}

function gravarRendaVariavel(ctx: ContextoGravacao, fichas: Parameters<Mapeador["gravar"]>[1]) {
  const anual = {
    resultado: 0n,
    negativoAnterior: 0n,
    base: 0n,
    prejuizo: 0n,
    devido: 0n,
    irFonteAnteriores: 0n,
    irFonteCompensar: 0n,
    lei11033: 0n,
    pagar: 0n,
  };
  for (const rv of fichas.rendaVariavel) {
    let prejComum: bigint = rv.prejuizoAnteriorComuns;
    let prejDay: bigint = rv.prejuizoAnteriorDayTrade;
    let saldoDay: bigint = rv.irFonteDayTradeAnterior;
    let saldoLei = 0n;
    for (let m = 1; m <= 12; m++) {
      const mes = rv.meses.find((x) => x.mes === m);
      const v: Valores = { ...identificacaoPessoa(rv.beneficiario), NR_MES: BigInt(m) };
      let liqComum = 0n;
      let liqDay = 0n;
      for (const [campo, sufixo] of MERCADOS) {
        const c = mes?.comuns[campo] ?? 0n;
        const d = mes?.dayTrade[campo] ?? 0n;
        v[`VR_COMUM_${sufixo}`] = c;
        v[`VR_DAYTR_${sufixo}`] = d;
        liqComum += c;
        liqDay += d;
      }
      const fonteDay = mes?.irFonteDayTrade ?? 0n;
      const fonteLei = mes?.irFonteLei11033 ?? 0n;
      // Comuns e day-trade compensam prejuízos separadamente.
      const baseComum = pos(liqComum - prejComum);
      const restoComum = pos(prejComum - liqComum);
      const baseDay = pos(liqDay - prejDay);
      const restoDay = pos(prejDay - liqDay);
      const devidoComum = imposto(baseComum, ALIQUOTA_COMUM);
      const devidoDay = imposto(baseDay, ALIQUOTA_DAY_TRADE);
      const devido = devidoComum + devidoDay;
      const dispDay = saldoDay + fonteDay;
      const usoDay = min(dispDay, devido);
      const dispLei = saldoLei + fonteLei;
      const usoLei = min(dispLei, devido - usoDay);
      const pagar = devido - usoDay - usoLei;
      Object.assign(v, {
        VR_FONTE_DAYTRADE: fonteDay,
        VR_IMPOSTO_PAGO: mes?.impostoPago ?? 0n,
        VR_IMPRENDAFONTE: fonteLei,
        VR_RESULTNEG_MESANT_COMUM: prejComum,
        VR_RESULTNEG_MESANT_DAYTR: prejDay,
        VR_FONTE_DAYTRADE_ANTJAN: m === 1 ? rv.irFonteDayTradeAnterior : 0n,
        VR_RESULTLIQ_MES_COMUM: liqComum,
        VR_RESULTLIQ_MES_DAYTR: liqDay,
        VR_BASECALCULO_MES_COMUM: baseComum,
        VR_BASECALCULO_MES_DAYTR: baseDay,
        VR_PREJACOMPENS_MES_COMUM: restoComum,
        VR_PREJACOMPENS_MES_DAYTR: restoDay,
        VR_ALIQUOTA_IMPOSTO_COMUM: ALIQUOTA_COMUM,
        VR_ALIQUOTA_IMPOSTO_DAYTRADE: ALIQUOTA_DAY_TRADE,
        VR_IMPOSTODEVIDO_MES_COMUM: devidoComum,
        VR_IMPOSTODEVIDO_MES_DAYTR: devidoDay,
        VR_TOTAL_IMPOSTODEVIDO: devido,
        VR_IRFONTE_MESESANT_DAYTR: saldoDay,
        VR_IRFONTE_ACOMPENS_DAYTR: dispDay - usoDay,
        VR_TOTAL_IMPOSTOAPAGAR: pagar,
        VR_IRF_MESESANT: saldoLei,
        VR_IRF_COMPENSAR: dispLei - usoLei,
      });
      ctx.adicionar("40", v, ["E_DEPENDENTE", "NR_CPF_DEPEN", "NR_MES"]);
      anual.resultado += liqComum + liqDay;
      anual.negativoAnterior += prejComum + prejDay;
      anual.base += baseComum + baseDay;
      anual.prejuizo += restoComum + restoDay;
      anual.devido += devido;
      anual.irFonteAnteriores += saldoDay;
      anual.irFonteCompensar += dispDay - usoDay;
      anual.lei11033 += fonteLei;
      anual.pagar += pagar;
      prejComum = restoComum;
      prejDay = restoDay;
      saldoDay = dispDay - usoDay;
      saldoLei = dispLei - usoLei;
    }
  }
  if (fichas.rendaVariavel.length > 0) {
    ctx.adicionar("41", {
      VR_RESULTLIQUIDO: anual.resultado,
      VR_RESULTNEGMESANTERIOR: anual.negativoAnterior,
      VR_BASECALCULO: anual.base,
      VR_PREJUIZOCOMPENSAR: anual.prejuizo,
      VR_IMPOSTODEVIDO: anual.devido,
      VR_CONSOL_IMPOSTOIMPOSTODEVIDO: anual.devido,
      VR_CONSOL_IRFONTEDAYTRMESANT: anual.irFonteAnteriores,
      VR_CONSOL_IRFONTEDAYTRCOMPENSAR: anual.irFonteCompensar,
      VR_TOTALANUALIRFONTELEI11033: anual.lei11033,
      VR_CONSOL_IMPOSTOAPAGAR: anual.pagar,
    });
  }
}

function gravarFii(ctx: ContextoGravacao, fichas: Parameters<Mapeador["gravar"]>[1]) {
  const anual = {
    resultado: 0n,
    negativo: 0n,
    base: 0n,
    prejuizo: 0n,
    devido: 0n,
    pagar: 0n,
    retido: 0n,
  };
  for (const f of fichas.fundosImobiliarios) {
    let prej: bigint = f.prejuizoAnterior;
    let saldo = 0n;
    for (let m = 1; m <= 12; m++) {
      const mes = f.meses.find((x) => x.mes === m);
      const resultado = mes?.resultadoLiquido ?? 0n;
      const retido = mes?.impostoRetidoFonte ?? 0n;
      const base = pos(resultado - prej);
      const resto = pos(prej - resultado);
      const devido = imposto(base, ALIQUOTA_FII);
      const disp = saldo + retido;
      const uso = min(disp, devido);
      const pagar = devido - uso;
      ctx.adicionar(
        "42",
        {
          ...identificacaoPessoa(f.beneficiario),
          NR_MES: BigInt(m),
          VR_RESLIQUIDO_MES: resultado,
          VR_RESULT_NEG_MESANT: prej,
          VR_BASECALCULO_MES: base,
          VR_PREJACOMPENSAR_MES_OPCOMUNS: resto,
          VR_ALIQUOTA_IMPOSTO_OPCOMUNS: ALIQUOTA_FII,
          VR_IMPOSTODEVIDO_MES_OPCOMUNS: devido,
          VR_IMPOSTO_RETIDO_MESES_ANTERIORES: saldo,
          VR_IMPOSTO_RETIDO_FONTE: retido,
          VR_IMPOSTO_RETIDO_COMPENSAR: disp - uso,
          VR_IMPOSTO_PAGAR: pagar,
          VR_IMPOSTOPAGO: mes?.impostoPago ?? 0n,
        },
        ["E_DEPENDENTE", "NR_CPF_DEPEN", "NR_MES"],
      );
      anual.resultado += resultado;
      anual.negativo += prej;
      anual.base += base;
      anual.prejuizo += resto;
      anual.devido += devido;
      anual.pagar += pagar;
      anual.retido += retido;
      prej = resto;
      saldo = disp - uso;
    }
  }
  if (fichas.fundosImobiliarios.length > 0) {
    ctx.adicionar("43", {
      VR_TOTALANUALRESULTADOLIQUIDOSRENDAVARIAVEL_FII: anual.resultado,
      VR_TOTALANUALRESULTADONEGATIVOMESANTERIOR_FII: anual.negativo,
      VR_TOTALANUALBASECALCULOIMPOSTO_FII: anual.base,
      VR_TOTALANUALPREJUIZOCOMPENSAR_FII: anual.prejuizo,
      VR_TOTALANUALIMPOSTODEVIDO_FII: anual.devido,
      VR_TOTALANUALIMPOSTOPAGAR_FII: anual.pagar,
      VR_TOTALANUALIMPOSTORETIDONAFONTE_FII: anual.retido,
    });
  }
}

export const mapeadorRendaVariavel: Mapeador = {
  nome: "rendaVariavel",
  tipos: ["40", "41", "42", "43"],
  ler(ctx, saida) {
    saida.rendaVariavel = lerRendaVariavel(ctx);
    saida.fundosImobiliarios = lerFii(ctx);
  },
  gravar(ctx, dec) {
    gravarRendaVariavel(ctx, dec);
    gravarFii(ctx, dec);
  },
};
