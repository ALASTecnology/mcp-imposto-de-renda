/**
 * Grupo "calculadoras": calculadoras auxiliares offline (sem rede e sem gravar arquivos). Os
 * cálculos ficam em `../calculadoras/index.ts`; aqui ficam entrada, saída e texto.
 */
import {
  type Centavos,
  cotacaoDolar2025,
  formatCentavos,
  impostoTabelaAnual,
  centavos as paraCentavos,
  parseCentavos,
} from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import {
  AVISO_FERIADOS,
  dataBr,
  formatarData,
  lerData,
  somarDias,
  somarMeses,
  vencimentoMesSeguinte,
} from "../calculadoras/datas.js";
import {
  apurarRendaVariavel,
  calcularCarneLeao,
  calcularGanhoCapital,
  calcularPrecoMedio,
  calcularRra,
  verificarObrigatoriedade,
} from "../calculadoras/index.js";
import { EntradaInvalidaError } from "../erros.js";
import { DESCRICAO_VALOR, zValorMonetario } from "../esquemas.js";
import { objetoJson } from "../serializacao.js";
import { acrescimosMoratorios } from "./saidas.js";
import type { GrupoFerramentas } from "./tipos.js";

const brl = (v: bigint) => `R$ ${formatCentavos(v as Centavos)}`;
const zV = (d: string) => zValorMonetario(`${d} ${DESCRICAO_VALOR}`);
const zVOpc = (d: string) => zV(d).optional();
const big = (v: string | undefined) => (v === undefined ? 0n : BigInt(v));
const zTexto = z
  .union([z.number().int(), z.string()])
  .describe("Centavos (número inteiro; texto de dígitos se passar de 2^53).");
const zData = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use AAAA-MM-DD");

const AVISO =
  "Cálculo de orientação do MCP Imposto de Renda; confira no programa oficial, no GCAP ou no Carnê-Leão Web.";

function decimal(v: string, casas: number, campo: string): bigint {
  const m = /^(\d+)(?:[.,](\d+))?$/.exec(v.trim());
  if (!m)
    throw new EntradaInvalidaError(`${campo}: use número decimal com vírgula (ex.: "5,1234").`);
  const frac = (m[2] ?? "").slice(0, casas).padEnd(casas, "0");
  return BigInt(m[1] ?? "0") * 10n ** BigInt(casas) + BigInt(frac || "0");
}

/**
 * Valor em moeda estrangeira, em centavos. Segue `parseCentavos` do core (milhar com ponto em
 * grupos de 3 e até duas casas depois da vírgula) e aceita ainda o ponto decimal comum em
 * extratos estrangeiros quando não há vírgula e o ponto é seguido de 1 ou 2 dígitos ("1234.56").
 * Um único ponto seguido de 3 dígitos ("1.234") é ambíguo e é recusado.
 */
function valorEstrangeiro(texto: string): bigint {
  const v = texto.trim();
  const decimalComPonto = /^(\d+)\.(\d{1,2})$/.exec(v);
  if (decimalComPonto) return parseCentavos(`${decimalComPonto[1]},${decimalComPonto[2]}`);
  if (/^\d{1,3}\.\d{3}$/.test(v)) {
    throw new EntradaInvalidaError(
      `valor: "${v}" é ambíguo (ponto de milhar ou ponto decimal?). Escreva "${v},00" para o valor inteiro ou use vírgula para as casas decimais (ex.: "1,23").`,
    );
  }
  let centavos: bigint;
  try {
    centavos = parseCentavos(v);
  } catch {
    throw new EntradaInvalidaError(
      `valor: "${v}" não é um valor válido. Use vírgula decimal e ponto de milhar ("1.234,56"), ou ponto decimal sem separador de milhar ("1234.56").`,
    );
  }
  if (centavos < 0n) throw new EntradaInvalidaError("valor: informe um valor positivo.");
  return centavos;
}

export const grupoCalculadoras: GrupoFerramentas = {
  nome: "calculadoras",
  descricao:
    "Calculadoras auxiliares offline: renda variável, preço médio, carnê-leão, RRA, ganho de capital e acréscimos.",
  registrar(r) {
    r.ferramenta(
      "calcular_carne_leao",
      {
        titulo: "Calcular o carnê-leão do mês",
        descricao:
          "Calcula o carnê-leão (Darf 0190) de um mês de 2025 pela tabela progressiva mensal vigente no mês (janeiro a abril pela Lei 14.848/2024; maio a dezembro pela Lei 15.191/2025), com as deduções de previdência oficial, dependentes (R$ 189,59 cada), pensão e livro-caixa, ou o desconto simplificado mensal quando mais vantajoso.",
        entrada: {
          mes: z.number().int().min(1).max(12),
          rendimentos: zV("Rendimentos do mês recebidos de PF ou do exterior."),
          previdencia: zVOpc("Previdência oficial paga no mês."),
          dependentes: z.number().int().min(0).max(99).default(0),
          pensao: zVOpc("Pensão alimentícia judicial paga no mês."),
          livro_caixa: zVOpc("Despesas escrituradas no livro-caixa."),
        },
        saida: {
          base: zTexto,
          imposto: zTexto,
          deducoesLegais: zTexto,
          descontoSimplificado: zTexto,
          usaSimplificado: z.boolean(),
          codigoDarf: z.string(),
          vencimento: z.string(),
          avisos: z.array(z.string()),
        },
      },
      (a) => {
        const c = calcularCarneLeao({
          mes: a.mes,
          rendimentos: BigInt(a.rendimentos),
          previdencia: big(a.previdencia),
          dependentes: a.dependentes,
          pensao: big(a.pensao),
          livroCaixa: big(a.livro_caixa),
        });
        const vencimento = vencimentoMesSeguinte(2025, a.mes);
        return {
          texto: `Carnê-leão de ${a.mes}/2025: base ${brl(c.base)} (${c.usaSimplificado ? "desconto simplificado" : "deduções legais"}), imposto ${brl(c.imposto)}, Darf 0190 até ${dataBr(vencimento)}. ${AVISO}`,
          dados: objetoJson({
            ...c,
            codigoDarf: "0190",
            vencimento,
            avisos: [AVISO_FERIADOS, AVISO],
          }),
        };
      },
    );

    r.ferramenta(
      "calcular_rra",
      {
        titulo: "Simular rendimentos recebidos acumuladamente",
        descricao:
          "Calcula o imposto do RRA pela tabela progressiva acumulada (tabela mensal do mês do recebimento vezes o número de meses, art. 12-A da Lei 7.713/1988) e, com os demais rendimentos tributáveis do ano, compara com a opção pelo ajuste anual (tabela anual).",
        entrada: {
          rendimentos: zV("Rendimentos tributáveis do RRA (sem juros de mora)."),
          numero_meses: z
            .number()
            .positive()
            .max(9999)
            .describe(
              "Meses a que se referem, com uma casa decimal; mínimo 0,1 (IN RFB 1.500/2014, art. 45).",
            ),
          mes_recebimento: z.number().int().min(1).max(12),
          previdencia: zVOpc("Contribuição previdenciária oficial descontada."),
          pensao: zVOpc("Pensão alimentícia descontada."),
          irrf: zVOpc("Imposto retido na fonte."),
          outros_rendimentos_base: zVOpc(
            "Base de cálculo anual dos demais rendimentos, para comparar com o ajuste.",
          ),
        },
        saida: {
          base: zTexto,
          impostoExclusivo: zTexto,
          saldoExclusivo: zTexto,
          impostoAjusteAnual: zTexto.nullable(),
          maisVantajosa: z.enum(["exclusivaNaFonte", "ajusteAnual"]).nullable(),
        },
      },
      (a) => {
        const c = calcularRra({
          rendimentos: BigInt(a.rendimentos),
          meses: a.numero_meses,
          mesRecebimento: a.mes_recebimento,
          previdencia: big(a.previdencia),
          pensao: big(a.pensao),
          irrf: big(a.irrf),
        });
        let ajuste: bigint | null = null;
        if (a.outros_rendimentos_base !== undefined) {
          const outros = BigInt(a.outros_rendimentos_base);
          ajuste =
            impostoTabelaAnual(paraCentavos(outros + c.base)) -
            impostoTabelaAnual(paraCentavos(outros));
        }
        const melhor =
          ajuste === null ? null : ajuste < c.impostoExclusivo ? "ajusteAnual" : "exclusivaNaFonte";
        return {
          texto: `RRA: base ${brl(c.base)}, imposto pela tabela acumulada ${brl(c.impostoExclusivo)}${ajuste === null ? "" : `; pelo ajuste anual o acréscimo seria ${brl(ajuste)}, mais vantajosa: ${melhor}`}. ${AVISO}`,
          dados: objetoJson({
            base: c.base,
            impostoExclusivo: c.impostoExclusivo,
            saldoExclusivo: c.saldo,
            impostoAjusteAnual: ajuste,
            maisVantajosa: melhor,
          }),
        };
      },
    );

    r.ferramenta(
      "calcular_preco_medio",
      {
        titulo: "Calcular preço médio e ganho por venda",
        descricao:
          "Calcula o custo médio ponderado por ativo e o resultado de cada venda a partir das notas de corretagem (compras e vendas com custos), separando day-trade (compra e venda do mesmo ativo no mesmo dia), para preencher a Renda Variável.",
        entrada: {
          operacoes: z
            .array(
              z.object({
                data: zData,
                ativo: z.string().min(1).max(20),
                tipo: z.enum(["compra", "venda"]),
                quantidade: z.number().int().positive(),
                valor: zV("Valor total da operação, sem custos."),
                custos: zVOpc("Corretagem, emolumentos e taxas."),
              }),
            )
            .min(1)
            .max(5000),
        },
        saida: {
          vendas: z.array(
            z.object({
              data: z.string(),
              ativo: z.string(),
              quantidade: z.number(),
              valorLiquido: zTexto,
              custoMedio: zTexto,
              resultado: zTexto,
              dayTrade: z.boolean(),
            }),
          ),
          posicoes: z.array(
            z.object({
              ativo: z.string(),
              quantidade: z.number(),
              custoTotal: zTexto,
              custoMedio: zTexto,
            }),
          ),
        },
      },
      ({ operacoes }) => {
        const c = calcularPrecoMedio(
          operacoes.map((o) => ({ ...o, valor: BigInt(o.valor), custos: big(o.custos) })),
        );
        return {
          texto: [
            ...c.vendas.map(
              (v) =>
                `- ${dataBr(v.data)} ${v.ativo}: ${v.quantidade} un., resultado ${brl(v.resultado)}${v.dayTrade ? " (day-trade)" : ""}`,
            ),
            ...c.posicoes.map(
              (p) => `Posição ${p.ativo}: ${p.quantidade} un., custo ${brl(p.custoTotal)}`,
            ),
          ].join("\n"),
          dados: objetoJson(c),
        };
      },
    );

    r.ferramenta(
      "apurar_renda_variavel",
      {
        titulo: "Apurar a renda variável mês a mês",
        descricao:
          "Apura o imposto mensal sobre ganhos líquidos: operações comuns 15%, day-trade 20%, FII e Fiagro 20%, com compensação de prejuízos separada por tipo, compensação de IR na fonte (day-trade e Lei 11.033/2004), isenção de ganhos com ações à vista quando as vendas do mês não passam de R$ 20.000,00 e Darf 6015 com vencimento no último dia útil do mês seguinte. Imposto abaixo de R$ 10,00 não é recolhido no mês: soma-se ao dos meses seguintes até chegar a R$ 10,00 (Lei 9.430/1996, art. 68, § 1º).",
        entrada: {
          meses: z
            .array(
              z.object({
                mes: z.number().int().min(1).max(12),
                comuns: zVOpc("Resultado líquido das operações comuns (negativo para perda)."),
                day_trade: zVOpc("Resultado líquido de day-trade."),
                fii: zVOpc("Resultado líquido com FII ou Fiagro."),
                vendas_acoes: zVOpc("Total de vendas de ações à vista no mês."),
                ganho_acoes_vista: zVOpc("Parte de 'comuns' que é ganho com ações à vista."),
                irrf_day_trade: zVOpc("IR na fonte de day-trade."),
                irrf_lei_11033: zVOpc("IR na fonte da Lei 11.033/2004."),
              }),
            )
            .min(1)
            .max(12),
          prejuizo_anterior_comuns: zVOpc("Prejuízo de anos anteriores, comuns."),
          prejuizo_anterior_day_trade: zVOpc("Prejuízo de anos anteriores, day-trade."),
          prejuizo_anterior_fii: zVOpc("Prejuízo de anos anteriores, FII."),
        },
        saida: {
          meses: z.array(
            z.object({
              mes: z.number(),
              isentoAcoes: zTexto,
              baseComuns: zTexto,
              baseDayTrade: zTexto,
              baseFii: zTexto,
              impostoDevido: zTexto,
              irrfCompensado: zTexto,
              impostoMesesAnteriores: zTexto.describe(
                "Imposto abaixo de R$ 10,00 trazido dos meses anteriores (já somado em impostoPagar).",
              ),
              impostoPagar: zTexto,
              recolher: z.boolean(),
              impostoPendente: zTexto.describe(
                "Imposto que fica para somar ao do mês seguinte por não chegar a R$ 10,00.",
              ),
              vencimento: z.string(),
              prejuizoComunsSeguinte: zTexto,
              prejuizoDayTradeSeguinte: zTexto,
              prejuizoFiiSeguinte: zTexto,
            }),
          ),
          avisos: z.array(z.string()),
        },
      },
      (a) => {
        const meses = apurarRendaVariavel(
          a.meses.map((m) => ({
            mes: m.mes,
            comuns: big(m.comuns),
            dayTrade: big(m.day_trade),
            fii: big(m.fii),
            ...(m.vendas_acoes !== undefined ? { vendasAcoes: BigInt(m.vendas_acoes) } : {}),
            ...(m.ganho_acoes_vista !== undefined
              ? { ganhoAcoesVista: BigInt(m.ganho_acoes_vista) }
              : {}),
            irrfDayTrade: big(m.irrf_day_trade),
            irrfLei11033: big(m.irrf_lei_11033),
          })),
          {
            prejuizoComuns: big(a.prejuizo_anterior_comuns),
            prejuizoDayTrade: big(a.prejuizo_anterior_day_trade),
            prejuizoFii: big(a.prejuizo_anterior_fii),
          },
        ).map((m) => ({ ...m, vencimento: vencimentoMesSeguinte(2025, m.mes) }));
        const ultimo = meses[meses.length - 1];
        const pendente =
          ultimo !== undefined && ultimo.impostoPendente > 0n
            ? [
                `Ficam ${brl(ultimo.impostoPendente)} de imposto abaixo de R$ 10,00 após ${ultimo.mes}/2025: some ao imposto dos meses seguintes e recolha quando o total chegar a R$ 10,00 (Lei 9.430/1996, art. 68, § 1º).`,
              ]
            : [];
        return {
          texto: [
            ...meses.map(
              (m) =>
                `- ${m.mes}/2025: imposto ${brl(m.impostoDevido)}, a pagar ${brl(m.impostoPagar)}${m.impostoMesesAnteriores > 0n ? ` (com ${brl(m.impostoMesesAnteriores)} acumulados)` : ""}${m.recolher ? ` até ${dataBr(m.vencimento)} (Darf 6015)` : m.impostoPagar > 0n ? ", abaixo de R$ 10,00: soma ao mês seguinte" : ""}`,
            ),
            ...pendente,
          ].join("\n"),
          dados: objetoJson({ meses, avisos: [...pendente, AVISO_FERIADOS, AVISO] }),
        };
      },
    );

    r.ferramenta(
      "calcular_ganho_capital",
      {
        titulo: "Simular ganho de capital",
        descricao:
          "Simulador de orientação para alienação de imóvel, móvel ou participação: ganho = valor de alienação menos corretagem e custo; reduções da Lei 7.713/1988 (aquisição até 1988) e fatores FR1/FR2 da Lei 11.196/2005 para imóveis; isenções do único imóvel até R$ 440.000,00, da reaplicação em outro imóvel residencial e de pequeno valor; alíquotas de 15%, 17,5%, 20% e 22,5% por faixa. O demonstrativo oficial é o GCAP.",
        entrada: {
          tipo: z.enum(["imovel", "movel", "participacao"]),
          valor_alienacao: zV("Valor de alienação."),
          custo_corretagem: zVOpc("Corretagem paga pelo vendedor."),
          custo_aquisicao: zV("Custo de aquisição (com reformas)."),
          data_aquisicao: zData,
          data_alienacao: zData,
          unico_imovel: z.boolean().optional(),
          valor_aplicado_outro_imovel: zVOpc(
            "Valor aplicado em outro imóvel residencial em 180 dias.",
          ),
          total_alienado_no_mes: zVOpc("Total de alienações de bens da mesma natureza no mês."),
        },
        saida: {
          ganhoBruto: zTexto,
          reducoes: zTexto,
          ganhoTributavel: zTexto,
          isento: zTexto,
          imposto: zTexto,
          codigoDarf: z.string(),
          vencimento: z.string(),
          avisos: z.array(z.string()),
        },
      },
      (a) => {
        lerData(a.data_aquisicao, "data_aquisicao");
        const alienacao = lerData(a.data_alienacao, "data_alienacao");
        const c = calcularGanhoCapital({
          tipo: a.tipo,
          valorAlienacao: BigInt(a.valor_alienacao),
          custoCorretagem: big(a.custo_corretagem),
          custoAquisicao: BigInt(a.custo_aquisicao),
          dataAquisicao: a.data_aquisicao,
          dataAlienacao: a.data_alienacao,
          ...(a.unico_imovel !== undefined ? { unicoImovel: a.unico_imovel } : {}),
          ...(a.valor_aplicado_outro_imovel !== undefined
            ? { valorAplicadoOutroImovel: BigInt(a.valor_aplicado_outro_imovel) }
            : {}),
          ...(a.total_alienado_no_mes !== undefined
            ? { totalAlienadoNoMes: BigInt(a.total_alienado_no_mes) }
            : {}),
        });
        const vencimento = vencimentoMesSeguinte(alienacao.ano, alienacao.mes);
        return {
          texto: `Ganho bruto ${brl(c.ganhoBruto)}, reduções ${brl(c.reducoes)}, tributável ${brl(c.ganhoTributavel)}, imposto ${brl(c.imposto)} (Darf 4600 até ${dataBr(vencimento)}). ${c.avisos.join(" ")} ${AVISO}`,
          dados: objetoJson({
            ...c,
            codigoDarf: "4600",
            vencimento,
            avisos: [...c.avisos, AVISO_FERIADOS, AVISO],
          }),
        };
      },
    );

    r.ferramenta(
      "atualizar_custo_bem",
      {
        titulo: "Atualizar o custo de um bem",
        descricao:
          "Orientação e cálculo da atualização do custo de bem ou direito com os valores informados pelo usuário: 'ufir' (bens adquiridos até 31/12/1995, quantidade de UFIR vezes R$ 0,8287, Lei 9.249/1995, art. 17), 'fator' (valor vezes um coeficiente informado) ou 'lei14973' (atualização de imóvel a valor de mercado com imposto de 4% sobre a diferença, Lei 14.973/2024). Não grava: para registrar, altere o bem na ficha Bens e Direitos ou marque o caso especial do bem.",
        entrada: {
          metodo: z.enum(["ufir", "fator", "lei14973"]),
          valor_original: zVOpc("Custo de aquisição (métodos fator e lei14973)."),
          quantidade_ufir: z
            .string()
            .max(24)
            .optional()
            .describe('Quantidade de UFIR do custo (método ufir), com vírgula ("12345,6789").'),
          fator: z
            .string()
            .max(24)
            .optional()
            .describe(
              'Coeficiente de atualização informado pelo usuário (método fator), "1,234567".',
            ),
          valor_mercado: zVOpc("Valor de mercado do imóvel (método lei14973)."),
        },
        saida: {
          metodo: z.string(),
          valorOriginal: zTexto.nullable(),
          valorAtualizado: zTexto,
          diferenca: zTexto,
          imposto: zTexto,
          baseLegal: z.string(),
          orientacao: z.array(z.string()),
        },
      },
      (a) => {
        const exigir = <T>(v: T | undefined, campo: string): T => {
          if (v === undefined)
            throw new EntradaInvalidaError(`Informe '${campo}' para o método ${a.metodo}.`);
          return v;
        };
        let original: bigint | null = null;
        let atualizado: bigint;
        let imposto = 0n;
        let baseLegal: string;
        const orientacao: string[] = [];
        if (a.metodo === "ufir") {
          const qtd = decimal(exigir(a.quantidade_ufir, "quantidade_ufir"), 4, "quantidade_ufir");
          // UFIR de 1º/1/1996: R$ 0,8287. qtd em 1/10000 de UFIR, resultado em centavos.
          atualizado = (qtd * 8287n) / 1_000_000n;
          baseLegal =
            "Lei 9.249/1995, art. 17: custo em UFIR convertido por R$ 0,8287 (UFIR de 1º/1/1996); após 1995 não há atualização.";
          orientacao.push(
            "Informe o valor atualizado na situação de cada ano do bem; a discriminação deve citar o custo em UFIR.",
          );
        } else if (a.metodo === "fator") {
          original = BigInt(exigir(a.valor_original, "valor_original"));
          const f = decimal(exigir(a.fator, "fator"), 6, "fator");
          atualizado = (original * f) / 1_000_000n;
          baseLegal =
            "Coeficiente informado pelo usuário; o MCP Imposto de Renda não tem tabela de índices.";
          orientacao.push(
            "A legislação veda atualizar o custo de bens depois de 1995, salvo as opções legais (Lei 14.973/2024); confira a base do coeficiente.",
          );
        } else {
          original = BigInt(exigir(a.valor_original, "valor_original"));
          atualizado = BigInt(exigir(a.valor_mercado, "valor_mercado"));
          if (atualizado < original) {
            throw new EntradaInvalidaError(
              "O valor de mercado deve ser maior que o custo para haver atualização.",
            );
          }
          imposto = ((atualizado - original) * 4n) / 100n;
          baseLegal =
            "Lei 14.973/2024, art. 6º: imóvel no Brasil atualizado a valor de mercado, diferença tributada definitivamente a 4%.";
          orientacao.push(
            "A opção teve prazo próprio, encerrado em dezembro de 2024; confirme que ela foi feita e o imposto (Darf) pago.",
            "Na ficha Bens e Direitos, marque a atualização pela Lei 14.973/2024 (aplicar_caso_especial_bem) e informe o número do processo na Identificação.",
          );
        }
        const diferenca = original === null ? 0n : atualizado - original;
        return {
          texto: [
            `Valor atualizado: ${brl(atualizado)}${original === null ? "" : ` (custo ${brl(original)}, diferença ${brl(diferenca)})`}.`,
            imposto > 0n ? `Imposto sobre a diferença: ${brl(imposto)}.` : "",
            `Base: ${baseLegal}`,
            ...orientacao,
            AVISO,
          ]
            .filter(Boolean)
            .join("\n"),
          dados: objetoJson({
            metodo: a.metodo,
            valorOriginal: original,
            valorAtualizado: atualizado,
            diferenca,
            imposto,
            baseLegal,
            orientacao,
          }),
        };
      },
    );

    r.ferramenta(
      "calcular_acrescimos_moratorios",
      {
        titulo: "Calcular multa e juros de mora",
        descricao:
          "Calcula a multa de mora (0,33% por dia de atraso, limitada a 20%) e os juros (Selic acumulada informada mais 1% no mês do pagamento) de qualquer débito federal vencido.",
        entrada: {
          principal: zV("Valor principal do débito."),
          vencimento: zData,
          data_pagamento: zData,
          selic_acumulada: z
            .string()
            .max(8)
            .optional()
            .describe(
              'Selic acumulada do mês seguinte ao vencimento até o mês anterior ao pagamento ("12,34").',
            ),
        },
        saida: {
          diasAtraso: z.number(),
          percentualMulta: z.string().describe("Centésimos de ponto percentual."),
          multa: zTexto,
          juros: zTexto.nullable(),
          total: zTexto.nullable(),
        },
      },
      (a) => {
        lerData(a.vencimento, "vencimento");
        lerData(a.data_pagamento, "data_pagamento");
        const selic =
          a.selic_acumulada === undefined
            ? undefined
            : decimal(a.selic_acumulada, 2, "selic_acumulada");
        const p = BigInt(a.principal);
        const m = acrescimosMoratorios(p, a.vencimento, a.data_pagamento, selic);
        const total = m.juros === undefined ? null : p + m.multa + m.juros;
        return {
          texto: `${m.dias} dia(s) de atraso: multa ${brl(m.multa)}${m.juros === undefined ? "; informe selic_acumulada para os juros" : `, juros ${brl(m.juros)}, total ${brl(total ?? 0n)}`}.`,
          dados: objetoJson({
            diasAtraso: m.dias,
            percentualMulta: m.percentualMulta.toString(),
            multa: m.multa,
            juros: m.juros ?? null,
            total,
          }),
        };
      },
    );

    r.ferramenta(
      "calcular_condicao_residencia",
      {
        titulo: "Determinar a condição de residente",
        descricao:
          "Determina a data em que a pessoa passa a residente ou não residente no Brasil (IN SRF 208/2002): saída definitiva (não residente na data da saída), ausência temporária (não residente no dia seguinte ao que completar 12 meses fora), retorno de brasileiro ou visto permanente (residente na chegada) e visto temporário (residente ao completar 184 dias no país em 12 meses).",
        entrada: {
          evento: z.enum([
            "saida_definitiva",
            "ausencia_temporaria",
            "retorno",
            "visto_permanente",
            "visto_temporario",
          ]),
          data: zData.describe("Data da saída ou da chegada."),
          dias_no_pais: z
            .number()
            .int()
            .min(0)
            .max(366)
            .optional()
            .describe(
              "Visto temporário: dias já passados no país nos 12 meses anteriores à chegada.",
            ),
        },
        saida: {
          condicao: z.enum(["residente", "naoResidente"]),
          desde: z.string(),
          fundamento: z.string(),
        },
      },
      (a) => {
        const d = lerData(a.data);
        let condicao: "residente" | "naoResidente";
        let desde: string;
        let fundamento: string;
        switch (a.evento) {
          case "saida_definitiva":
            condicao = "naoResidente";
            desde = formatarData(d);
            fundamento =
              "Saída definitiva: não residente a partir da data da saída; entregue a Declaração de Saída Definitiva.";
            break;
          case "ausencia_temporaria":
            condicao = "naoResidente";
            desde = formatarData(somarDias(somarMeses(d, 12), 1));
            fundamento =
              "Ausência temporária: não residente a partir do dia seguinte àquele em que completar 12 meses consecutivos fora do país.";
            break;
          case "visto_temporario":
            condicao = "residente";
            desde = formatarData(somarDias(d, Math.max(0, 183 - (a.dias_no_pais ?? 0))));
            fundamento =
              "Visto temporário: residente na data em que completar 184 dias, consecutivos ou não, no país em 12 meses (sem interrupção da contagem).";
            break;
          default:
            condicao = "residente";
            desde = formatarData(d);
            fundamento =
              "Retorno com ânimo definitivo ou visto permanente: residente na data da chegada.";
        }
        return {
          texto: `${condicao === "residente" ? "Residente" : "Não residente"} desde ${dataBr(desde)}. ${fundamento}`,
          dados: { condicao, desde, fundamento },
        };
      },
    );

    r.ferramenta(
      "verificar_obrigatoriedade",
      {
        titulo: "Verificar a obrigatoriedade de declarar",
        descricao:
          "Avalia os critérios de obrigatoriedade da declaração de 2026 (rendimentos tributáveis acima de R$ 35.584,00; isentos e exclusivos acima de R$ 200.000,00; ganho de capital; bolsa acima de R$ 40.000,00; atividade rural; bens acima de R$ 800.000,00; residência; reaplicação de imóvel; exterior e trust) a partir das respostas do usuário.",
        entrada: {
          rendimentos_tributaveis: zVOpc("Rendimentos tributáveis de 2025."),
          isentos_exclusivos: zVOpc("Rendimentos isentos, não tributáveis e exclusivos de 2025."),
          ganho_capital_tributavel: z.boolean().optional(),
          alienacoes_bolsa: zVOpc("Total de alienações em bolsa em 2025."),
          ganho_liquido_tributavel_bolsa: z.boolean().optional(),
          receita_bruta_rural: zVOpc("Receita bruta da atividade rural em 2025."),
          compensar_prejuizo_rural: z.boolean().optional(),
          bens: zVOpc("Total de bens e direitos em 31/12/2025."),
          passou_a_residente: z.boolean().optional(),
          isencao_reaplicacao_imovel: z.boolean().optional(),
          aplicacoes_exterior: z.boolean().optional(),
          trust: z.boolean().optional(),
        },
        saida: {
          obrigado: z.boolean(),
          criterios: z.array(z.object({ criterio: z.string(), atende: z.boolean() })),
        },
      },
      (a) => {
        const opc = (v: string | undefined) => (v === undefined ? undefined : BigInt(v));
        const resp = Object.fromEntries(
          Object.entries({
            rendimentosTributaveis: opc(a.rendimentos_tributaveis),
            isentosExclusivos: opc(a.isentos_exclusivos),
            ganhoCapitalTributavel: a.ganho_capital_tributavel,
            alienacoesBolsa: opc(a.alienacoes_bolsa),
            ganhoLiquidoTributavelBolsa: a.ganho_liquido_tributavel_bolsa,
            receitaBrutaRural: opc(a.receita_bruta_rural),
            compensarPrejuizoRural: a.compensar_prejuizo_rural,
            bens: opc(a.bens),
            passouAResidente: a.passou_a_residente,
            isencaoReaplicacaoImovel: a.isencao_reaplicacao_imovel,
            aplicacoesExterior: a.aplicacoes_exterior,
            trust: a.trust,
          }).filter(([, v]) => v !== undefined),
        );
        const c = verificarObrigatoriedade(resp);
        return {
          texto: `${c.obrigado ? "Obrigado a declarar" : "Não obrigado pelos critérios informados"}.\n${c.criterios
            .filter((x) => x.atende)
            .map((x) => `- ${x.criterio}`)
            .join("\n")}`,
          dados: c,
        };
      },
    );

    r.ferramenta(
      "converter_moeda",
      {
        titulo: "Converter valor em moeda estrangeira",
        descricao:
          "Converte para reais um valor em moeda estrangeira e explica qual cotação a regra exige para cada finalidade: rendimento ou imposto pago no exterior, dedução, atividade rural, bem ou aplicação financeira (Lei 14.754/2023). Sem `cotacao`, usa a tabela oficial \"Conversão para Reais do Dólar dos Estados Unidos da América em 2025\" (Ajuda do PGD, pág. 356): compra do mês para rendimento e imposto pago, venda do mês para dedução e compra de 31/12/2025 para atividade rural; nesse caso o valor deve estar em dólares. Bens e aplicações exigem a cotação da data, informada pelo usuário.",
        entrada: {
          valor: z
            .string()
            .max(32)
            .describe(
              'Valor na moeda estrangeira: "1.234,56" (vírgula decimal) ou "1234.56" (ponto decimal, sem separador de milhar). "1.234" é recusado por ser ambíguo.',
            ),
          cotacao: z
            .string()
            .max(16)
            .optional()
            .describe('Cotação em reais por unidade ("5,1234"); omita para usar a tabela do dólar de 2025.'),
          mes: z
            .number()
            .int()
            .min(1)
            .max(12)
            .optional()
            .describe("Mês de 2025 do recebimento ou do pagamento, para usar a tabela do dólar."),
          finalidade: z.enum([
            "rendimento",
            "imposto_exterior",
            "deducao",
            "atividade_rural",
            "bem",
            "aplicacao",
          ]),
        },
        saida: { reais: zTexto, cotacao: z.string(), fonte: z.string(), regra: z.string() },
      },
      (a) => {
        const valor = valorEstrangeiro(a.valor);
        const FONTE_TABELA =
          "tabela \"Conversão para Reais do Dólar dos Estados Unidos da América em 2025\" (Ajuda do PGD IRPF 2026, pág. 356)";
        let cot: bigint;
        let fonte: string;
        if (a.cotacao !== undefined) {
          cot = decimal(a.cotacao, 4, "cotacao");
          fonte = "cotação informada pelo usuário";
        } else if (a.finalidade === "atividade_rural") {
          cot = cotacaoDolar2025("AR", "compra");
          fonte = `${FONTE_TABELA}, compra de 31/12/2025`;
        } else if (a.finalidade === "bem" || a.finalidade === "aplicacao") {
          throw new EntradaInvalidaError(
            "Para bem ou aplicação no exterior informe `cotacao`: a regra usa a cotação do dólar na data, fora da tabela mensal.",
          );
        } else {
          if (a.mes === undefined) {
            throw new EntradaInvalidaError(
              "Informe `cotacao` ou o `mes` de 2025 do recebimento ou do pagamento para usar a tabela do dólar.",
            );
          }
          const tipo = a.finalidade === "deducao" ? "venda" : "compra";
          cot = cotacaoDolar2025(a.mes, tipo);
          fonte = `${FONTE_TABELA}, ${tipo} de ${String(a.mes).padStart(2, "0")}/2025`;
        }
        const cotTexto = `${cot / 10_000n},${String(cot % 10_000n).padStart(4, "0")}`;
        const reais = (valor * cot) / 10_000n;
        const REGRAS = {
          rendimento:
            "Rendimentos do exterior: converta para dólar pelo valor fixado pela autoridade do país e depois para reais pela cotação de compra do dólar do Banco Central do último dia útil da 1ª quinzena do mês anterior ao do recebimento.",
          imposto_exterior:
            "Imposto pago no exterior: mesma regra dos rendimentos, com a cotação do último dia útil da 1ª quinzena do mês anterior ao do pagamento.",
          deducao:
            "Despesas pagas no exterior (dedutíveis): cotação de venda do dólar do Banco Central do último dia útil da 1ª quinzena do mês anterior ao do pagamento.",
          atividade_rural:
            "Atividade rural no exterior: resultado convertido pela cotação de compra do dólar de 31/12/2025.",
          bem: "Bens adquiridos no exterior: custo em reais pela cotação de venda do dólar na data da aquisição (bens com rendimentos de origem em moeda estrangeira seguem regras próprias do GCAP).",
          aplicacao:
            "Aplicações financeiras e entidades controladas no exterior (Lei 14.754/2023): rendimentos convertidos pela cotação de venda do dólar do Banco Central na data do recebimento ou da apuração.",
        } as const;
        return {
          texto: `${a.valor} x ${cotTexto} = ${brl(reais)} (${fonte}). ${REGRAS[a.finalidade]}`,
          dados: objetoJson({ reais, cotacao: cotTexto, fonte, regra: REGRAS[a.finalidade] }),
        };
      },
    );
  },
};
