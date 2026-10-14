/**
 * Grupo "saidas": etapa final, só leitura. Dados do Darf (o documento oficial com código de
 * barras é emitido pelo programa ou pelo Sicalc), passo a passo para transmitir pelo programa
 * oficial, relatório da declaração e comunicação de saída definitiva às fontes pagadoras.
 */
import {
  type Centavos,
  centavos,
  type Declaracao,
  entradaCalculoDoModelo,
  FICHAS,
  formatCentavos,
  motor2026,
  PARAMETROS_2026,
} from "@autoir/core";
import { z } from "zod";
import {
  AVISO_FERIADOS,
  dataBr,
  diasEntre,
  formatarData,
  lerData,
  vencimentoMesSeguinte,
} from "../calculadoras/datas.js";
import { EntradaInvalidaError } from "../erros.js";
import { DESCRICAO_VALOR, zValorMonetario } from "../esquemas.js";
import { objetoJson } from "../serializacao.js";
import { carregarDeclaracao, zDeclaracaoJson, zNomeArquivo } from "./comum.js";
import { pendenciasDe } from "./fluxo.js";
import type { GrupoFerramentas, RegistroFerramentas } from "./tipos.js";

const brl = (v: bigint) => `R$ ${formatCentavos(v as Centavos)}`;

/** Códigos de receita do Darf usados pela pessoa física. */
export const CODIGOS_DARF = {
  imposto: {
    codigo: "0211",
    descricao: "IRPF, quota ou quota única do imposto apurado na declaração",
  },
  eca: {
    codigo: "3351",
    descricao: "Doação ao Fundo dos Direitos da Criança e do Adolescente na declaração",
  },
  idoso: { codigo: "9090", descricao: "Doação ao Fundo da Pessoa Idosa na declaração" },
  carne_leao: { codigo: "0190", descricao: "Carnê-leão (recolhimento mensal obrigatório)" },
  renda_variavel: { codigo: "6015", descricao: "Ganhos líquidos em operações de renda variável" },
  ganho_capital: { codigo: "4600", descricao: "Ganho de capital na alienação de bens e direitos" },
} as const;

const INSTRUCOES_DARF = [
  "O AutoIR não emite Darf: os dados abaixo servem para conferência.",
  "Para o Darf oficial com código de barras: no programa da declaração, menu Imprimir > Darf, depois de abrir ou restaurar o DBK; ou no Sicalc (Sicalc Web da Receita Federal), informando código de receita, período de apuração e valor.",
  "Pague até o vencimento de cada quota; a partir da 2ª quota incidem juros Selic acumulada a partir de junho de 2026 mais 1% no mês do pagamento.",
];

/** Percentual "1,10" (ou número 1.1) em centésimos de ponto: 110. */
function percentual(v: string | number): bigint {
  // Número (1.1) e texto ("1,10") seguem o mesmo caminho (revisão B4).
  const t = (typeof v === "number" ? v.toFixed(2) : v).replace(".", ",");
  const m = /^(\d{1,3})(?:,(\d{1,2}))?$/.exec(t.trim());
  if (!m) throw new EntradaInvalidaError('Percentual inválido: use "1,10" para 1,10%.');
  return BigInt(m[1] ?? "0") * 100n + BigInt((m[2] ?? "").padEnd(2, "0"));
}

const zPercentual = z
  .union([z.string().max(8), z.number()])
  .describe('Percentual com vírgula ("12,34" = 12,34%).');

function saldoDaDeclaracao(dec: Declaracao) {
  const c = motor2026.compararModelos(entradaCalculoDoModelo(dec));
  const e = dec.resumo.opcaoTributacao === "deducoesLegais" ? c.completo : c.simplificado;
  return {
    saldo: e.saldoPagar,
    restituir: e.restituir,
    impostoDevido: e.impostoDevido,
    comparacao: c,
  };
}

export interface ParcelaDarf {
  numero: number;
  vencimento: string;
  principal: string;
  juros: string | null;
  multaMora: string;
  jurosMora: string | null;
  total: string | null;
}

/** Multa de mora (0,33% ao dia, limite 20%) e juros (Selic acumulada + 1%) de um débito vencido. */
export function acrescimosMoratorios(
  principal: bigint,
  vencimento: string,
  pagamento: string,
  selicAcumuladaCentesimos?: bigint,
) {
  const dias = diasEntre(lerData(vencimento), lerData(pagamento));
  if (dias <= 0) return { dias: 0, multa: 0n, juros: 0n, percentualMulta: 0n };
  const percentualMulta = BigInt(Math.min(dias * 33, 2000));
  const multa = (principal * percentualMulta) / 10_000n;
  const juros =
    selicAcumuladaCentesimos === undefined
      ? undefined
      : (principal * (selicAcumuladaCentesimos + 100n)) / 10_000n;
  return { dias, multa, juros, percentualMulta };
}

async function declaracaoOpcional(
  r: RegistroFerramentas,
  args: { arquivo?: string | undefined; declaracao?: Record<string, unknown> | undefined },
): Promise<Declaracao | undefined> {
  if (args.arquivo === undefined && args.declaracao === undefined) return undefined;
  return (await carregarDeclaracao(r.ctx, args)).declaracao;
}

function relatorio(dec: Declaracao): string {
  const id = dec.identificacao;
  const s = saldoDaDeclaracao(dec);
  const linhas = [
    `# Declaração IRPF ${dec.exercicio} (ano-calendário ${dec.anoCalendario})`,
    "",
    `Contribuinte: ${id.nome}, CPF ${id.cpf}. Tipo: ${id.tipoDeclaracao.tipo}${id.tipoDeclaracao.retificadora ? " retificadora" : ""}.`,
    `Opção de tributação: ${dec.resumo.opcaoTributacao === "deducoesLegais" ? "deduções legais" : "desconto simplificado"}.`,
    "",
    "## Fichas",
    "",
  ];
  for (const [k, nome] of Object.entries(FICHAS)) {
    const v = (dec as unknown as Record<string, unknown>)[k];
    const n = Array.isArray(v) ? v.length : v ? 1 : 0;
    if (n > 0 && k !== "resumo")
      linhas.push(`- ${nome}: ${Array.isArray(v) ? `${n} item(ns)` : "preenchida"}`);
  }
  const soma = (l: readonly { [k: string]: unknown }[], c: string) =>
    l.reduce((t, x) => t + ((x[c] as bigint | undefined) ?? 0n), 0n);
  linhas.push(
    "",
    "## Totais",
    "",
    `- Rendimentos tributáveis de PJ: ${brl(soma(dec.rendimentosPJ, "rendimentos"))}`,
    `- Imposto retido na fonte (PJ): ${brl(soma(dec.rendimentosPJ, "impostoRetido"))}`,
    `- Pagamentos efetuados: ${brl(soma(dec.pagamentos, "valorPago"))}`,
    `- Bens em 31/12/2025: ${brl(soma(dec.bens, "situacaoAtual"))}`,
    `- Dívidas em 31/12/2025: ${brl(soma(dec.dividas, "situacaoAtual"))}`,
    "",
    "## Resultado (simulação do AutoIR)",
    "",
    `- Imposto devido: ${brl(s.impostoDevido)}`,
    s.saldo > 0n
      ? `- Saldo a pagar: ${brl(s.saldo)}`
      : `- Imposto a restituir: ${brl(s.restituir)}`,
    `- Modelo mais vantajoso pelo cálculo: ${s.comparacao.modeloMaisVantajoso}`,
    "",
    "Relatório informativo do AutoIR, não substitui a impressão da declaração no programa oficial.",
  );
  return linhas.join("\n");
}

export const grupoSaidas: GrupoFerramentas = {
  nome: "saidas",
  descricao: "Etapa final: dados do Darf e passo a passo para transmitir pelo programa oficial.",
  registrar(r) {
    r.ferramenta(
      "gerar_darf",
      {
        titulo: "Dados do Darf",
        descricao:
          "Calcula os dados do Darf (código de receita, período de apuração, vencimentos e valores de cada quota, juros Selic das quotas e, se informada a data de pagamento após o vencimento, multa de 0,33% ao dia até 20% e juros de mora). Tipos: imposto da declaração (0211, padrão), doações diretas ao ECA (3351) e à pessoa idosa (9090), carnê-leão (0190), renda variável (6015) e ganho de capital (4600). Não emite o Darf oficial: instrui a emissão no programa ou no Sicalc.",
        entrada: {
          tipo: z
            .enum(["imposto", "eca", "idoso", "carne_leao", "renda_variavel", "ganho_capital"])
            .default("imposto"),
          arquivo: zNomeArquivo("DBK/DEC da pasta (opcional).").optional(),
          declaracao: zDeclaracaoJson.optional(),
          saldo: zValorMonetario(
            `Valor a pagar, se não vier da declaração. ${DESCRICAO_VALOR}`,
          ).optional(),
          quotas: z.number().int().min(1).max(8).optional(),
          mes_apuracao: z
            .number()
            .int()
            .min(1)
            .max(12)
            .optional()
            .describe("Mês de 2025 (carnê-leão, renda variável, ganho de capital)."),
          selic_mensal: z
            .record(z.string().regex(/^\d{4}-\d{2}$/), zPercentual)
            .optional()
            .describe('Selic mensal por mês "AAAA-MM" para os juros das quotas a partir da 3ª.'),
          data_pagamento: z
            .string()
            .optional()
            .describe("Data prevista de pagamento (AAAA-MM-DD), para multa e juros de mora."),
          selic_acumulada_mora: zPercentual
            .optional()
            .describe(
              "Selic acumulada do mês seguinte ao vencimento até o mês anterior ao pagamento.",
            ),
        },
        saida: {
          codigoReceita: z.string(),
          descricaoReceita: z.string(),
          periodoApuracao: z.string(),
          cpf: z.string().nullable(),
          valorTotal: z.string(),
          parcelas: z.array(
            z.object({
              numero: z.number(),
              vencimento: z.string(),
              principal: z.string(),
              juros: z.string().nullable(),
              multaMora: z.string(),
              jurosMora: z.string().nullable(),
              total: z.string().nullable(),
            }),
          ),
          instrucoes: z.array(z.string()),
          avisos: z.array(z.string()),
        },
      },
      async (a) => {
        const dec = await declaracaoOpcional(r, a);
        const tipo = a.tipo;
        const avisos: string[] = [];
        let valor: bigint;
        if (a.saldo !== undefined) valor = BigInt(a.saldo);
        else if (dec && tipo === "imposto") valor = saldoDaDeclaracao(dec).saldo;
        else if (dec && (tipo === "eca" || tipo === "idoso")) {
          valor = dec.doacoesDiretamenteNaDeclaracao[tipo].reduce((t, d) => t + d.valor, 0n);
        } else
          throw new EntradaInvalidaError(
            "Informe 'saldo', ou a declaração ('arquivo' ou 'declaracao') para o imposto ou as doações.",
          );
        if (valor <= 0n) {
          return {
            texto: "Não há valor a pagar: nenhum Darf é necessário.",
            dados: {
              codigoReceita: CODIGOS_DARF[tipo].codigo,
              descricaoReceita: CODIGOS_DARF[tipo].descricao,
              periodoApuracao: "",
              cpf: dec?.identificacao.cpf ?? null,
              valorTotal: "0",
              parcelas: [],
              instrucoes: INSTRUCOES_DARF,
              avisos: [],
            },
          };
        }
        const info = CODIGOS_DARF[tipo];
        let parcelas: ParcelaDarf[];
        let periodo = "31/12/2025";
        if (tipo === "imposto") {
          const n = a.quotas ?? Math.max(1, dec?.resumo.quotas ?? 1);
          const selic = a.selic_mensal
            ? Object.fromEntries(Object.entries(a.selic_mensal).map(([k, v]) => [k, percentual(v)]))
            : undefined;
          const q = motor2026.calcularQuotas(
            centavos(valor),
            n,
            undefined,
            selic ? { selicMensal: selic } : {},
          );
          avisos.push(...q.avisos);
          parcelas = q.quotas.map((x) => ({
            numero: x.numero,
            vencimento: x.vencimento,
            principal: x.principal.toString(),
            juros: x.juros === null ? null : x.juros.toString(),
            multaMora: "0",
            jurosMora: "0",
            total: x.total === null ? null : x.total.toString(),
          }));
        } else {
          let vencimento: string = PARAMETROS_2026.prazoEntrega;
          if (tipo === "carne_leao" || tipo === "renda_variavel" || tipo === "ganho_capital") {
            if (!a.mes_apuracao) throw new EntradaInvalidaError("Informe 'mes_apuracao' (1 a 12).");
            vencimento = vencimentoMesSeguinte(2025, a.mes_apuracao);
            periodo = dataBr(
              formatarData({
                ano: 2025,
                mes: a.mes_apuracao,
                dia: new Date(Date.UTC(2025, a.mes_apuracao, 0)).getUTCDate(),
              }),
            );
            avisos.push(AVISO_FERIADOS);
          }
          parcelas = [
            {
              numero: 1,
              vencimento,
              principal: valor.toString(),
              juros: "0",
              multaMora: "0",
              jurosMora: "0",
              total: valor.toString(),
            },
          ];
        }
        if (a.data_pagamento) {
          const selicMora =
            a.selic_acumulada_mora === undefined ? undefined : percentual(a.selic_acumulada_mora);
          for (const p of parcelas) {
            const m = acrescimosMoratorios(
              BigInt(p.principal),
              p.vencimento,
              a.data_pagamento,
              selicMora,
            );
            if (m.dias <= 0) continue;
            p.multaMora = m.multa.toString();
            p.jurosMora = m.juros === undefined ? null : m.juros.toString();
            p.total =
              m.juros === undefined || p.total === null
                ? null
                : (BigInt(p.total) + m.multa + m.juros).toString();
            if (m.juros === undefined) {
              avisos.push(
                "Juros de mora não calculados: informe selic_acumulada_mora (Selic acumulada até o mês anterior ao pagamento).",
              );
            }
          }
        }
        const texto = [
          `Darf ${info.codigo} (${info.descricao}), período de apuração ${periodo}, total ${brl(valor)}.`,
          ...parcelas.map(
            (p) =>
              `- Quota ${p.numero}: vence ${dataBr(p.vencimento)}, principal ${brl(BigInt(p.principal))}${p.juros && p.juros !== "0" ? `, juros ${brl(BigInt(p.juros))}` : ""}${p.multaMora !== "0" ? `, multa de mora ${brl(BigInt(p.multaMora))}` : ""}${p.total ? `, total ${brl(BigInt(p.total))}` : ""}`,
          ),
          ...INSTRUCOES_DARF,
          ...avisos.map((x) => `Aviso: ${x}`),
        ].join("\n");
        return {
          texto,
          dados: objetoJson({
            codigoReceita: info.codigo,
            descricaoReceita: info.descricao,
            periodoApuracao: periodo,
            cpf: dec?.identificacao.cpf ?? null,
            valorTotal: valor.toString(),
            parcelas,
            instrucoes: INSTRUCOES_DARF,
            avisos: [...new Set(avisos)],
          }),
        };
      },
    );

    r.ferramenta(
      "instruir_transmissao",
      {
        titulo: "Passo a passo para transmitir",
        descricao:
          "Gera o passo a passo e o checklist para concluir no programa oficial da declaração 2026: restaurar o DBK gravado pelo AutoIR, verificar pendências, conferir o Resumo, transmitir com ou sem certificado digital, guardar o recibo e pagar o Darf. Com 'arquivo' ou 'declaracao', inclui as pendências do AutoIR e o saldo.",
        entrada: {
          arquivo: zNomeArquivo("DBK/DEC da pasta (opcional).").optional(),
          declaracao: zDeclaracaoJson.optional(),
        },
        saida: {
          passos: z.array(z.string()),
          checklist: z.array(z.string()),
          totalErros: z.number().nullable(),
          totalAvisos: z.number().nullable(),
          saldoPagar: z.string().nullable(),
          restituir: z.string().nullable(),
        },
      },
      async (a) => {
        const dec = await declaracaoOpcional(r, a);
        const p = dec ? pendenciasDe(dec) : undefined;
        const s = dec ? saldoDaDeclaracao(dec) : undefined;
        const nome = a.arquivo ?? "o arquivo .DBK gravado pelo AutoIR";
        const passos = [
          "Instale ou atualize o programa oficial IRPF 2026 pelo site da Receita Federal (gov.br/receitafederal).",
          `Copie ${nome} para o computador em que o programa está instalado.`,
          "No programa, use Ferramentas > Restaurar Cópia de Segurança e escolha o arquivo .DBK (a declaração aparece na lista de declarações em preenchimento).",
          "Abra a declaração e clique em Verificar Pendências; corrija tudo o que estiver marcado como erro.",
          "Confira as fichas preenchidas e o Resumo (opção de tributação, imposto a pagar ou a restituir, quotas e conta bancária).",
          "Clique em Entregar Declaração. Sem certificado digital, informe o número do recibo da declaração do ano anterior quando pedido; com certificado ou procuração, siga o assistente.",
          "Depois da transmissão, salve e imprima o recibo de entrega (menu Imprimir > Recibo) e guarde o arquivo .DEC gerado.",
          s && s.saldo > 0n
            ? `Há saldo a pagar de ${brl(s.saldo)} pela simulação do AutoIR: emita o Darf no programa (menu Imprimir > Darf) ou opte pelo débito automático antes de transmitir.`
            : "Se houver imposto a pagar, emita o Darf no programa (menu Imprimir > Darf) ou no Sicalc.",
          `O prazo de entrega é ${dataBr(PARAMETROS_2026.prazoEntrega)}; a entrega depois do prazo gera multa por atraso (calcular_multa_atraso).`,
        ];
        const checklist = [
          "Informes de rendimentos de todas as fontes pagadoras (titular e dependentes) conferidos.",
          "Despesas dedutíveis com CPF/CNPJ do prestador e comprovantes guardados por 5 anos.",
          "Bens e direitos com situação em 31/12/2024 igual à da declaração anterior.",
          "Conta bancária para restituição ou débito automático em nome do titular.",
          "Dependentes com CPF e sem declaração própria.",
          "Pendências do programa oficial verificadas antes de entregar.",
        ];
        const texto = [
          "Passo a passo:",
          ...passos.map((x, i) => `${i + 1}. ${x}`),
          "Checklist:",
          ...checklist.map((x) => `- ${x}`),
          ...(p
            ? [
                `Pendências do AutoIR: ${p.totalErros} erro(s) e ${p.totalAvisos} aviso(s); use validar_declaracao para ver cada uma.`,
              ]
            : []),
        ].join("\n");
        return {
          texto,
          dados: {
            passos,
            checklist,
            totalErros: p?.totalErros ?? null,
            totalAvisos: p?.totalAvisos ?? null,
            saldoPagar: s ? s.saldo.toString() : null,
            restituir: s ? s.restituir.toString() : null,
          },
        };
      },
    );

    r.ferramenta(
      "gerar_relatorio_declaracao",
      {
        titulo: "Relatório da declaração",
        descricao:
          "Monta um relatório em Markdown da declaração (identificação, fichas preenchidas, totais e resultado simulado) para conferência. Só devolve o texto; nada é gravado.",
        entrada: {
          arquivo: zNomeArquivo("DBK/DEC/JSON da pasta.").optional(),
          declaracao: zDeclaracaoJson.optional(),
        },
        saida: { relatorio: z.string() },
      },
      async (a) => {
        const dec = await declaracaoOpcional(r, a);
        if (!dec) throw new EntradaInvalidaError("Informe 'arquivo' ou 'declaracao'.");
        const texto = relatorio(dec);
        return { texto, dados: { relatorio: texto } };
      },
    );

    r.ferramenta(
      "gerar_comunicacao_saida",
      {
        titulo: "Comunicação de saída definitiva",
        descricao:
          "Gera o texto da comunicação de saída definitiva do país, uma por fonte pagadora de rendimentos de PJ, a partir da ficha Saída Definitiva. Só devolve o texto para o usuário imprimir e assinar.",
        entrada: {
          arquivo: zNomeArquivo("DBK/DEC/JSON da pasta.").optional(),
          declaracao: zDeclaracaoJson.optional(),
        },
        saida: {
          comunicacoes: z.array(
            z.object({ fonte: z.string(), cnpj: z.string(), texto: z.string() }),
          ),
        },
      },
      async (a) => {
        const dec = await declaracaoOpcional(r, a);
        if (!dec) throw new EntradaInvalidaError("Informe 'arquivo' ou 'declaracao'.");
        const sd = dec.saidaDefinitiva;
        if (!sd)
          throw new EntradaInvalidaError(
            "A declaração não tem a ficha Saída Definitiva do País preenchida.",
          );
        const fontes = new Map(dec.rendimentosPJ.map((p) => [p.fonte.ni, p.fonte.nome]));
        const comunicacoes = [...fontes].map(([cnpj, fonte]) => ({
          fonte,
          cnpj,
          texto: [
            `À ${fonte} (CPF/CNPJ ${cnpj})`,
            "",
            "Assunto: comunicação de saída definitiva do país",
            "",
            `Eu, ${dec.identificacao.nome}, CPF ${dec.identificacao.cpf}, comunico que passei à condição de não residente no Brasil em ${dataBr(sd.dataCondicaoNaoResidente)}, com destino ao país de código ${sd.paisDestino}.`,
            "A partir dessa data, os rendimentos que me forem pagos devem sofrer a tributação aplicável a não residentes, na forma da legislação.",
            sd.procurador
              ? `Procurador no Brasil: ${sd.procurador.nome}, CPF ${sd.procurador.cpf}.`
              : "",
            "",
            "Local e data: ____________________",
            "",
            "Assinatura: ____________________",
          ]
            .filter((l, i, arr) => l !== "" || arr[i - 1] !== "")
            .join("\n"),
        }));
        if (comunicacoes.length === 0) {
          throw new EntradaInvalidaError(
            "Não há fontes pagadoras de rendimentos de PJ na declaração.",
          );
        }
        return {
          texto: comunicacoes.map((c) => c.texto).join("\n\n----\n\n"),
          dados: { comunicacoes },
        };
      },
    );
  },
};
