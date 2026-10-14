/**
 * Ficha Imposto Pago e totais do Resumo: registros 17 e 18 (declaração simplificada), 19 e 20
 * (completa) e os totais gravados no header `IR`.
 *
 * As linhas digitadas da ficha Imposto Pago (complementar, pago no exterior e Lei 11.033)
 * ficam nos registros 17 e 19 e sempre vêm do modelo. Os demais campos são totais: no modo
 * `preservar` vêm do arquivo base; no modo `recalcular` são refeitos a partir do modelo
 * (somas das fichas e o motor de cálculo do core). Ver `CAMPOS_RECALCULADOS`.
 */
import type { Declaracao } from "../model/declaracao.js";
import { numero, type Objeto, type Valores } from "./campos.js";
import type { ContextoGravacao, ContextoLeitura } from "./contexto.js";
import type { TotaisCalculados } from "./recalculo.js";

/** Tipos de registro de totais do Resumo. */
export const TIPOS_TOTAIS = ["17", "18", "19", "20"] as const;

/** Como tratar os totais ao gravar. */
export type ModoTotais = "preservar" | "recalcular";

export function lerTotais(ctx: ContextoLeitura, saida: Objeto): void {
  const r17 = ctx.doTipo("17")[0];
  const r19 = ctx.doTipo("19")[0];
  const fonte = r19 ?? r17;
  saida.impostoPago = {
    impostoComplementar: numero(fonte, "VR_IMPCOMP"),
    impostoPagoExterior: numero(fonte, "VR_IMPEXT"),
    impostoRetidoLei11033: numero(fonte, "VR_IRFONTELEI11033"),
  };
  const r18 = ctx.doTipo("18")[0];
  const r20 = ctx.doTipo("20")[0];
  if (r20) {
    saida.resumoCalculado = {
      totalRendimentosTributaveis: numero(r20, "VR_TOTTRIB"),
      totalDeducoes: numero(r20, "VR_DEDUC"),
      descontoSimplificado: 0n,
      baseCalculo: numero(r20, "VR_BASECALC"),
      impostoDevido: numero(r20, "VR_IMPDEV3"),
      totalImpostoPago: numero(r20, "VR_TOTIMPPAGO"),
      impostoARestituir: numero(r20, "VR_IMPREST"),
      impostoAPagar: numero(r20, "VR_IMPPAGAR"),
      bensAnterior: numero(r20, "VR_BENSANT"),
      bensAtual: numero(r20, "VR_BENSATUAL"),
      dividasAnterior: numero(r20, "VR_DIVIDAANT"),
      dividasAtual: numero(r20, "VR_DIVIDAATUAL"),
      totalIsentos: numero(r20, "VR_TOTISENTOS"),
      totalExclusivos: numero(r20, "VR_TOTEXCLUS"),
      aliquotaEfetivaCentesimos: Number(numero(r20, "VR_ALIQUOTA_EFETIVA")),
    };
  } else if (r18) {
    const pago =
      numero(r18, "VR_IMPOSTO") +
      numero(r18, "VR_IMPCOMP") +
      numero(r18, "VR_LEAO") +
      numero(r18, "VR_IRFONTELEI11033") +
      numero(r18, "VR_IMPEXT");
    saida.resumoCalculado = {
      totalRendimentosTributaveis: numero(r18, "VR_RENDTRIB"),
      totalDeducoes: 0n,
      descontoSimplificado: numero(r18, "VR_DESCSIMP"),
      baseCalculo: numero(r18, "VR_BASECALC"),
      impostoDevido: numero(r18, "VR_TOT_IMPOSTO_DEVIDO"),
      totalImpostoPago: pago,
      impostoARestituir: numero(r18, "VR_IMPRESTIT"),
      impostoAPagar: numero(r18, "VR_IMPPAGAR"),
      bensAnterior: numero(r18, "VR_TOTBENSANOBASEANTERIOR"),
      bensAtual: numero(r18, "VR_TOTBENSANOBASE"),
      dividasAnterior: numero(r18, "VR_TOTDIVIDAANOBASEANTERIOR"),
      dividasAtual: numero(r18, "VR_TOTDIVIDAANOBASE"),
      totalIsentos: numero(r18, "VR_TOTISENTO"),
      totalExclusivos: numero(r18, "VR_TOTEXCLUSIVO"),
      aliquotaEfetivaCentesimos: Number(numero(r18, "VR_ALIQUOTA_EFETIVA")),
    };
  }
}

/**
 * Grava os registros de totais do modelo escolhido e devolve os valores do header. Sem
 * `calculados`, preserva os totais do arquivo base.
 */
export function gravarTotais(
  ctx: ContextoGravacao,
  dec: Declaracao,
  calculados: TotaisCalculados | undefined,
): Valores {
  const completa = dec.resumo.opcaoTributacao === "deducoesLegais";
  const [tipoDemais, tipoTotais] = completa ? ["19", "20"] : ["17", "18"];
  const pago: Valores = {
    VR_IMPCOMP: dec.impostoPago.impostoComplementar,
    VR_IMPEXT: dec.impostoPago.impostoPagoExterior,
    VR_IRFONTELEI11033: dec.impostoPago.impostoRetidoLei11033,
  };
  if (!calculados) {
    ctx.adicionar(tipoDemais, pago);
    ctx.adicionar(tipoTotais, {});
    return {};
  }
  ctx.adicionar(tipoDemais, { ...(completa ? calculados.r19 : calculados.r17), ...pago });
  ctx.adicionar(tipoTotais, completa ? calculados.r20 : calculados.r18);
  return calculados.header;
}

/** Os totais devem ser recalculados? (no modo `preservar`, só se o base não tiver os do modelo) */
export function precisaRecalcular(
  ctx: ContextoGravacao,
  dec: Declaracao,
  modo: ModoTotais,
): boolean {
  const tipo = dec.resumo.opcaoTributacao === "deducoesLegais" ? "20" : "18";
  return modo === "recalcular" || ctx.baseDoTipo(tipo).length === 0;
}

/** Saldo a pagar gravado no arquivo base para o modelo escolhido. */
export function saldoDoBase(ctx: ContextoGravacao, dec: Declaracao): bigint {
  const tipo = dec.resumo.opcaoTributacao === "deducoesLegais" ? "20" : "18";
  return numero(ctx.baseDoTipo(tipo)[0], "VR_IMPPAGAR");
}
