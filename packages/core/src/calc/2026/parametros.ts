/**
 * Parâmetros legais do exercício 2026 (ano-calendário 2025), em centavos.
 *
 * Cada valor foi conferido em fonte oficial e cruzado com a tabela de
 * parâmetros extraída do programa oficial
 * (docs/mapeamento/tabelas/aliquotas-parametros.json). Fontes e eventuais
 * pendências estão em docs/regras/irpf-2026.md.
 */
import { type Centavos, centavos } from "../../centavos.js";

export const FONTES_2026 = {
  tabelas2025: "https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2025",
  perguntasRespostas:
    "https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/perguntas-e-respostas/dirpf/p-r-irpf-2026-v1-00-2026-04-23.pdf",
  lei9250: "https://www.planalto.gov.br/ccivil_03/leis/l9250.htm",
  lei15191: "https://www.planalto.gov.br/ccivil_03/_Ato2023-2026/2025/Lei/L15191.htm",
} as const;

/** Faixa da tabela progressiva anual: alíquota em milésimos (75 = 7,5%). */
export interface FaixaTabela {
  /** Limite superior da faixa, inclusive; `null` na última. */
  readonly ate: Centavos | null;
  readonly aliquotaMilesimos: bigint;
  readonly parcelaDeduzir: Centavos;
}

/** Tabela progressiva anual, exercício 2026 (base da Lei 15.191/2025). */
export const TABELA_ANUAL_2026: readonly FaixaTabela[] = [
  { ate: centavos(2846720n), aliquotaMilesimos: 0n, parcelaDeduzir: centavos(0n) },
  { ate: centavos(3391980n), aliquotaMilesimos: 75n, parcelaDeduzir: centavos(213504n) },
  { ate: centavos(4501260n), aliquotaMilesimos: 150n, parcelaDeduzir: centavos(467903n) },
  { ate: centavos(5597616n), aliquotaMilesimos: 225n, parcelaDeduzir: centavos(805497n) },
  { ate: null, aliquotaMilesimos: 275n, parcelaDeduzir: centavos(1085378n) },
];

export const PARAMETROS_2026 = {
  exercicio: 2026,
  anoCalendario: 2025,
  /** Dedução anual por dependente. */
  deducaoDependente: centavos(227508n),
  /** Limite anual de instrução por pessoa (titular, cada dependente, cada alimentando). */
  limiteInstrucao: centavos(356150n),
  /** Desconto simplificado: 20% dos rendimentos tributáveis, até o teto. */
  descontoSimplificadoPercentual: 20n,
  descontoSimplificadoTeto: centavos(1675434n),
  /** Previdência complementar (PGBL/Fapi): até 12% dos rendimentos tributáveis. */
  previdenciaComplementarPercentual: 12n,
  /** Parcela isenta de aposentadoria 65+ (mensal e 13º). */
  parcelaIsenta65Mensal: centavos(190398n),
  parcelaIsenta65Anual: centavos(2284776n),
  /** Incentivos: percentuais do imposto devido. */
  incentivoDiretoEcaPercentual: 3n,
  incentivoDiretoIdosoPercentual: 3n,
  incentivoGlobalPercentual: 6n,
  incentivoGlobalComDesportoPercentual: 7n,
  incentivoPronasPercentual: 1n,
  incentivoPrononPercentual: 1n,
  /** Prazo de entrega e quotas. */
  prazoEntrega: "2026-05-29",
  vencimentosQuotas: [
    "2026-05-29",
    "2026-06-30",
    "2026-07-31",
    "2026-08-31",
    "2026-09-30",
    "2026-10-30",
    "2026-11-30",
    "2026-12-30",
  ] as readonly string[],
  quotasMaximo: 8,
  quotaMinima: centavos(5000n),
  quotaUnicaAbaixoDe: centavos(10000n),
  saldoMinimoRecolhimento: centavos(1000n),
  /** Multa por atraso na entrega (MAED). */
  multaAtrasoMinima: centavos(16574n),
  multaAtrasoPercentualMes: 1n,
  multaAtrasoPercentualMaximo: 20n,
  /** Obrigatoriedade (informativo). */
  obrigatoriedadeRendimentosTributaveis: centavos(3558400n),
} as const;

/** Códigos da ficha Pagamentos Efetuados (docs/mapeamento/tabelas/pagamentos.json). */
export const CODIGOS_PAGAMENTO_2026 = {
  instrucao: new Set(["01", "02"]),
  medicas: new Set([
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "26",
  ]),
  pensaoJudicial: new Set(["30", "31"]),
  pensaoEscritura: new Set(["33", "34"]),
  previdenciaComplementar: new Set(["36", "37"]),
} as const;

/**
 * Códigos de Doações Efetuadas, na numeração das Perguntas e Respostas 2026
 * (pergunta 455): I ECA (40), II Idoso (44), III Cultura (41), IV Audiovisual
 * (42), V Desporto (43), VI Reciclagem (47). Pronas (45) e Pronon (46) têm
 * limite próprio de 1% fora dos limites globais.
 */
export const CODIGOS_DOACAO_2026 = {
  grupoBase: new Set(["40", "41", "42", "44"]),
  desporto: "43",
  reciclagem: "47",
  pronas: "45",
  pronon: "46",
} as const;
