/**
 * Grupo "calculo": simulação do imposto com o motor próprio do core (ADR 0002).
 *
 * Valores monetários na saída estruturada são textos com inteiro de centavos ("123456" =
 * R$ 1.234,56), o mesmo formato do motor e dos casos de referência. O texto legível traz os
 * valores já formatados em reais.
 */
import {
  CalculoInvalidoError,
  type Centavos,
  centavos,
  FONTES_2026,
  formatarCentesimosPercentual,
  formatCentavos,
  type LinhaMemoria,
  obterMotor,
  TABELA_ANUAL_2026,
} from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import { DESCRICAO_VALOR, paraEntradaCore, zEntradaCalculo, zValorMonetario } from "../esquemas.js";
import { objetoJson } from "../serializacao.js";
import type { GrupoFerramentas } from "./tipos.js";

/** Formata centavos em texto ("123456") como "R$ 1.234,56". */
export function reais(valor: string | bigint): string {
  return `R$ ${formatCentavos(centavos(typeof valor === "bigint" ? valor : BigInt(valor)))}`;
}

const zExercicio = z
  .number()
  .int()
  .default(2026)
  .describe("Exercício (ano de entrega). Hoje só 2026 (ano-calendário 2025) é suportado.");

const entradaCalculo = { exercicio: zExercicio, ...zEntradaCalculo.shape };

const zLinhaMemoria = z.object({
  codigo: z.string(),
  descricao: z.string(),
  valor: z.string().describe("Centavos em texto, ou percentual em centésimos quando indicado."),
  regra: z.string(),
});

const zCentavosTexto = z.string().describe("Inteiro de centavos em texto (123456 = R$ 1.234,56).");

function motor(exercicio: number) {
  return obterMotor(exercicio);
}

function linhasTexto(linhas: readonly LinhaMemoria[]): string {
  return linhas.map((l, i) => `${i + 1}. ${l.descricao} [${l.regra}]`).join("\n");
}

const saidaSimulacao = {
  exercicio: z.number(),
  rendimentosTributaveis: zCentavosTexto,
  deducoesCompleto: zCentavosTexto,
  baseCalculoCompleto: zCentavosTexto,
  impostoDevidoCompleto: zCentavosTexto,
  descontoSimplificado: zCentavosTexto,
  baseCalculoSimplificado: zCentavosTexto,
  impostoDevidoSimplificado: zCentavosTexto,
  impostoRetidoTotal: zCentavosTexto,
  saldoPagarCompleto: zCentavosTexto,
  restituirCompleto: zCentavosTexto,
  saldoPagarSimplificado: zCentavosTexto,
  restituirSimplificado: zCentavosTexto,
  modeloMaisVantajoso: z.enum(["completo", "simplificado"]),
  aliquotaEfetiva: z.string().describe("Centésimos de ponto percentual (617 = 6,17%)."),
  avisos: z.array(z.string()),
};

const zResumoModelo = z.object({
  rendimentosTributaveis: zCentavosTexto,
  baseCalculo: zCentavosTexto,
  impostoDevido: zCentavosTexto,
  impostoPago: zCentavosTexto,
  saldoPagar: zCentavosTexto,
  restituir: zCentavosTexto,
  aliquotaEfetiva: z.string(),
});

const AVISO_SIMULACAO =
  "Simulação do MCP Imposto de Renda; confira no programa oficial da Receita Federal antes de transmitir.";

export const grupoCalculo: GrupoFerramentas = {
  nome: "calculo",
  descricao: "Simulação do imposto, comparação de modelos, quotas, multa e parâmetros.",
  registrar(r) {
    r.ferramenta(
      "simular_imposto",
      {
        titulo: "Simular imposto do exercício",
        descricao:
          "Calcula o imposto da declaração (exercício 2026, ano-calendário 2025) nos modelos " +
          "completo e simplificado e indica o mais vantajoso, com saldo a pagar ou a restituir. " +
          `Informe titular, rendimentos, pagamentos e demais dados. ${DESCRICAO_VALOR}`,
        entrada: entradaCalculo,
        saida: saidaSimulacao,
      },
      ({ exercicio, ...entrada }) => {
        const res = motor(exercicio).calcular(paraEntradaCore(entrada));
        const { detalhamento: _, ...resto } = res;
        const melhor = res.modeloMaisVantajoso;
        const pagar = melhor === "completo" ? res.saldoPagarCompleto : res.saldoPagarSimplificado;
        const restituir = melhor === "completo" ? res.restituirCompleto : res.restituirSimplificado;
        const texto = [
          `Exercício ${exercicio}: rendimentos tributáveis de ${reais(res.rendimentosTributaveis)}.`,
          `Completo: imposto devido ${reais(res.impostoDevidoCompleto)} (deduções ${reais(res.deducoesCompleto)}).`,
          `Simplificado: imposto devido ${reais(res.impostoDevidoSimplificado)} (desconto ${reais(res.descontoSimplificado)}).`,
          `Imposto já pago ou retido: ${reais(res.impostoRetidoTotal)}.`,
          `Mais vantajoso: ${melhor}, com ${BigInt(restituir) > 0n ? `restituição de ${reais(restituir)}` : `saldo a pagar de ${reais(pagar)}`}; alíquota efetiva ${formatarCentesimosPercentual(BigInt(res.aliquotaEfetiva))}.`,
          ...res.avisos.map((a) => `Aviso: ${a}`),
          AVISO_SIMULACAO,
        ].join("\n");
        return { texto, dados: objetoJson({ exercicio, ...resto }) };
      },
    );

    r.ferramenta(
      "comparar_modelos",
      {
        titulo: "Comparar modelo completo e simplificado",
        descricao:
          "Compara as deduções legais (modelo completo) com o desconto simplificado de 20% " +
          "(limitado a R$ 16.754,34) e mostra a diferença de resultado. Mesma entrada de simular_imposto.",
        entrada: entradaCalculo,
        saida: {
          modeloMaisVantajoso: z.enum(["completo", "simplificado"]),
          diferenca: zCentavosTexto.describe("Diferença de resultado final entre os modelos."),
          completo: zResumoModelo.extend({
            totalDeducoes: zCentavosTexto,
            deducoes: z.record(z.string(), zCentavosTexto),
          }),
          simplificado: zResumoModelo.extend({ desconto: zCentavosTexto }),
          memoria: z.array(zLinhaMemoria),
        },
      },
      ({ exercicio, ...entrada }) => {
        const cmp = motor(exercicio).compararModelos(paraEntradaCore(entrada));
        const resumo = (m: typeof cmp.completo | typeof cmp.simplificado) => ({
          rendimentosTributaveis: m.rendimentosTributaveis.toString(),
          baseCalculo: m.baseCalculo.toString(),
          impostoDevido: m.impostoDevido.toString(),
          impostoPago: m.impostoPago.total.toString(),
          saldoPagar: m.saldoPagar.toString(),
          restituir: m.restituir.toString(),
          aliquotaEfetiva: m.aliquotaEfetiva.toString(),
        });
        const liquido = (m: typeof cmp.completo | typeof cmp.simplificado) =>
          m.restituir - m.saldoPagar;
        const dif = liquido(cmp.completo) - liquido(cmp.simplificado);
        const diferenca = (dif < 0n ? -dif : dif).toString();
        const deducoes = Object.fromEntries(
          Object.entries(cmp.completo.deducoes).map(([k, v]) => [k, (v as Centavos).toString()]),
        );
        const texto = [
          linhasTexto(cmp.memoria),
          `Deduções do completo: ${reais(cmp.completo.totalDeducoes)}; desconto simplificado: ${reais(cmp.simplificado.desconto)}.`,
          AVISO_SIMULACAO,
        ].join("\n");
        return {
          texto,
          dados: {
            modeloMaisVantajoso: cmp.modeloMaisVantajoso,
            diferenca,
            completo: {
              ...resumo(cmp.completo),
              totalDeducoes: cmp.completo.totalDeducoes.toString(),
              deducoes,
            },
            simplificado: {
              ...resumo(cmp.simplificado),
              desconto: cmp.simplificado.desconto.toString(),
            },
            memoria: objetoJson({ m: cmp.memoria }).m ?? [],
          },
        };
      },
    );

    r.ferramenta(
      "explicar_calculo",
      {
        titulo: "Explicar o cálculo passo a passo",
        descricao:
          "Devolve a memória de cálculo linha a linha, em pt-BR, com a conta feita e a regra legal " +
          "aplicada em cada passo (rendimentos, deduções, base, tabela progressiva, incentivos, " +
          "imposto pago, saldo). Mesma entrada de simular_imposto.",
        entrada: {
          ...entradaCalculo,
          modelo: z
            .enum(["completo", "simplificado", "ambos"])
            .default("ambos")
            .describe("Qual modelo explicar; 'ambos' inclui também a comparação."),
        },
        saida: {
          modeloMaisVantajoso: z.enum(["completo", "simplificado"]),
          linhas: z.array(zLinhaMemoria.extend({ modelo: z.string() })),
        },
      },
      ({ exercicio, modelo, ...entrada }) => {
        const res = motor(exercicio).calcular(paraEntradaCore(entrada));
        const secoes: [string, readonly LinhaMemoria[]][] = [];
        if (modelo !== "simplificado") secoes.push(["completo", res.detalhamento.completo]);
        if (modelo !== "completo") secoes.push(["simplificado", res.detalhamento.simplificado]);
        if (modelo === "ambos") secoes.push(["comparacao", res.detalhamento.comparacao]);
        const linhas = secoes.flatMap(([m, ls]) => ls.map((l) => ({ modelo: m, ...l })));
        const texto = [
          ...secoes.map(([m, ls]) => `Modelo ${m}:\n${linhasTexto(ls)}`),
          AVISO_SIMULACAO,
        ].join("\n\n");
        return { texto, dados: { modeloMaisVantajoso: res.modeloMaisVantajoso, linhas } };
      },
    );

    r.ferramenta(
      "calcular_quotas",
      {
        titulo: "Calcular quotas do imposto a pagar",
        descricao:
          "Divide o saldo de imposto a pagar em até 8 quotas (mínimo R$ 50,00 cada; abaixo de " +
          "R$ 100,00 só quota única), com vencimentos e juros Selic a partir da 2ª quota.",
        entrada: {
          exercicio: zExercicio,
          saldo: zValorMonetario(`Saldo de imposto a pagar. ${DESCRICAO_VALOR}`),
          quotas: z.number().int().min(1).max(8).describe("Número de quotas (1 a 8)."),
          data_vencimento: z
            .string()
            .optional()
            .describe(
              "Vencimento da 1ª quota (AAAA-MM-DD). Padrão: prazo do exercício (2026-05-29).",
            ),
          selic_mensal: z
            .record(
              z.string().regex(/^\d{4}-\d{2}$/, "Use AAAA-MM"),
              z.string().regex(/^\d{1,2}(,\d{1,2})?$/, 'Percentual como "1,10"'),
            )
            .optional()
            .describe(
              'Selic mensal por mês "AAAA-MM", em percentual com vírgula ("1,10" = 1,10%). Necessária a partir da 3ª quota.',
            ),
        },
        saida: {
          saldo: zCentavosTexto,
          numeroQuotas: z.number(),
          quotas: z.array(
            z.object({
              numero: z.number(),
              vencimento: z.string(),
              principal: zCentavosTexto,
              percentualJuros: z.string().nullable().describe("Centésimos de ponto percentual."),
              juros: zCentavosTexto.nullable(),
              total: zCentavosTexto.nullable(),
            }),
          ),
          avisos: z.array(z.string()),
        },
      },
      ({ exercicio, saldo, quotas, data_vencimento, selic_mensal }) => {
        const selic: Record<string, bigint> = {};
        for (const [mes, pct] of Object.entries(selic_mensal ?? {})) {
          const [int = "0", frac = ""] = pct.split(",");
          selic[mes] = BigInt(int) * 100n + BigInt(frac.padEnd(2, "0"));
        }
        const res = motor(exercicio).calcularQuotas(
          centavos(BigInt(saldo)),
          quotas,
          data_vencimento,
          { selicMensal: selic },
        );
        const fmt = (v: bigint | null) => (v === null ? null : v.toString());
        const linhas = res.quotas.map(
          (q) =>
            `Quota ${q.numero}: vence ${q.vencimento}, principal ${reais(q.principal)}` +
            (q.juros === null
              ? ", juros a calcular (Selic não informada)"
              : `, juros ${reais(q.juros)}, total ${reais(q.total ?? q.principal)}`),
        );
        return {
          texto: [...linhas, ...res.avisos.map((a) => `Aviso: ${a}`)].join("\n") || "Sem quotas.",
          dados: {
            saldo: res.saldo.toString(),
            numeroQuotas: res.numeroQuotas,
            quotas: res.quotas.map((q) => ({
              numero: q.numero,
              vencimento: q.vencimento,
              principal: q.principal.toString(),
              percentualJuros: fmt(q.percentualJuros),
              juros: fmt(q.juros),
              total: fmt(q.total),
            })),
            avisos: res.avisos,
          },
        };
      },
    );

    r.ferramenta(
      "calcular_multa_atraso",
      {
        titulo: "Calcular multa por atraso na entrega",
        descricao:
          "Multa por atraso (MAED): 1% ao mês-calendário ou fração sobre o imposto devido, mínimo " +
          "R$ 165,74 e máximo 20%. Sem data de entrega, usa a data de hoje.",
        entrada: {
          exercicio: zExercicio,
          imposto_devido: zValorMonetario(`Imposto devido da declaração. ${DESCRICAO_VALOR}`),
          data_entrega: z
            .string()
            .optional()
            .describe("Data da entrega (AAAA-MM-DD). Padrão: hoje."),
        },
        saida: {
          multa: zCentavosTexto,
          meses: z.number(),
          dataEntrega: z.string(),
          explicacao: z.string(),
        },
      },
      ({ exercicio, imposto_devido, data_entrega }) => {
        const data = data_entrega ?? r.ctx.relogio().toISOString().slice(0, 10);
        const res = motor(exercicio).calcularMultaAtraso(centavos(BigInt(imposto_devido)), data);
        return {
          texto: `${res.explicacao}\nMulta: ${reais(res.multa)} (entrega em ${data}).`,
          dados: {
            multa: res.multa.toString(),
            meses: res.meses,
            dataEntrega: data,
            explicacao: res.explicacao,
          },
        };
      },
    );

    r.ferramenta(
      "consultar_parametros",
      {
        titulo: "Consultar parâmetros do exercício",
        descricao:
          "Tabela progressiva anual, limites de dedução, desconto simplificado, prazos e quotas do " +
          "exercício, com as fontes oficiais. Valores em centavos.",
        entrada: { exercicio: zExercicio },
        saida: {
          exercicio: z.number(),
          anoCalendario: z.number(),
          tabelaProgressiva: z.array(
            z.object({
              ate: zCentavosTexto.nullable(),
              aliquota: z.string(),
              parcelaDeduzir: zCentavosTexto,
            }),
          ),
          parametros: z.record(z.string(), z.unknown()),
          fontes: z.record(z.string(), z.string()),
        },
      },
      ({ exercicio }) => {
        const m = motor(exercicio);
        if (m.exercicio !== 2026) throw new CalculoInvalidoError("Exercício sem parâmetros.");
        const tabela = TABELA_ANUAL_2026.map((f) => ({
          ate: f.ate === null ? null : f.ate.toString(),
          aliquota: formatarCentesimosPercentual(f.aliquotaMilesimos * 10n),
          parcelaDeduzir: f.parcelaDeduzir.toString(),
        }));
        const p = m.parametros;
        const texto = [
          `Exercício ${m.exercicio} (ano-calendário ${m.anoCalendario}). Tabela progressiva anual:`,
          ...tabela.map(
            (f) =>
              `- ${f.ate === null ? "acima da faixa anterior" : `até ${reais(f.ate)}`}: ${f.aliquota}, parcela a deduzir ${reais(f.parcelaDeduzir)}`,
          ),
          `Dedução por dependente: ${reais(p.deducaoDependente)}; instrução: até ${reais(p.limiteInstrucao)} por pessoa.`,
          `Desconto simplificado: ${p.descontoSimplificadoPercentual}% limitado a ${reais(p.descontoSimplificadoTeto)}.`,
          `Prazo de entrega: ${p.prazoEntrega}; até ${p.quotasMaximo} quotas.`,
          `Fontes: ${Object.values(FONTES_2026).join(" ; ")}`,
        ].join("\n");
        return {
          texto,
          dados: {
            exercicio: m.exercicio,
            anoCalendario: m.anoCalendario,
            tabelaProgressiva: tabela,
            parametros: objetoJson(p),
            fontes: { ...FONTES_2026 },
          },
        };
      },
    );
  },
};
