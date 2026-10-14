/**
 * A declaração completa (DIRPF de um exercício), agregando todas as fichas.
 * É a representação canônica entre o codec DBK, o motor de cálculo, as
 * validações e as tools do MCP.
 */
import { z } from "zod";
import { zAtividadeRural } from "./atividade-rural.js";
import { zBemDireito, zDivida } from "./bens-dividas.js";
import {
  zEspolioAjuste,
  zFinalEspolio,
  zHerdeiro,
  zInformacoesConjuge,
  zSaidaDefinitiva,
} from "./espolio-saida.js";
import { zDemonstrativoGcap } from "./ganhos-capital.js";
import { zIdentificacao } from "./identificacao.js";
import { zRendimentoExclusivo, zRendimentoIsento } from "./isentos-exclusivos.js";
import {
  zDoacaoEfetuada,
  zDoacaoPartido,
  zDoacoesDiretamenteNaDeclaracao,
  zImpostoPago,
  zPagamento,
} from "./pagamentos-doacoes.js";
import { zAlimentando, zDependente } from "./pessoas.js";
import { zOperacoesFii, zRendaVariavel } from "./renda-variavel.js";
import {
  zRendimentoExigibilidadeSuspensa,
  zRendimentoPJ,
  zRendimentoRRA,
  zRendimentosPFExterior,
} from "./rendimentos.js";
import { zResumo, zResumoCalculado } from "./resumo.js";

/** Exercício suportado por este modelo e o respectivo ano-calendário. */
export const EXERCICIO = 2026;
export const ANO_CALENDARIO = 2025;

/** Declaração de Ajuste Anual, Saída Definitiva ou Final de Espólio do exercício 2026. */
export const zDeclaracao = z.object({
  exercicio: z.literal(EXERCICIO).default(EXERCICIO),
  anoCalendario: z.literal(ANO_CALENDARIO).default(ANO_CALENDARIO),
  identificacao: zIdentificacao,
  dependentes: z.array(zDependente).default([]),
  alimentandos: z.array(zAlimentando).default([]),
  /** Rendimentos Tributáveis Recebidos de PJ (titular e dependentes). */
  rendimentosPJ: z.array(zRendimentoPJ).default([]),
  /** Rendimentos Tributáveis Recebidos de PF e do Exterior (um registro por pessoa). */
  rendimentosPFExterior: z.array(zRendimentosPFExterior).default([]),
  rendimentosIsentos: z.array(zRendimentoIsento).default([]),
  rendimentosExclusivos: z.array(zRendimentoExclusivo).default([]),
  rendimentosExigibilidadeSuspensa: z.array(zRendimentoExigibilidadeSuspensa).default([]),
  rendimentosAcumulados: z.array(zRendimentoRRA).default([]),
  impostoPago: zImpostoPago.prefault({}),
  pagamentos: z.array(zPagamento).default([]),
  doacoesEfetuadas: z.array(zDoacaoEfetuada).default([]),
  doacoesDiretamenteNaDeclaracao: zDoacoesDiretamenteNaDeclaracao.prefault({}),
  bens: z.array(zBemDireito).default([]),
  dividas: z.array(zDivida).default([]),
  /** Ficha Espólio do ajuste anual com natureza de ocupação 81. */
  espolio: zEspolioAjuste.optional(),
  /** Ficha Espólio da Declaração Final de Espólio. */
  finalEspolio: zFinalEspolio.optional(),
  herdeiros: z.array(zHerdeiro).default([]),
  saidaDefinitiva: zSaidaDefinitiva.optional(),
  informacoesConjuge: zInformacoesConjuge.optional(),
  doacoesPartidos: z.array(zDoacaoPartido).default([]),
  rendaVariavel: z.array(zRendaVariavel).default([]),
  fundosImobiliarios: z.array(zOperacoesFii).default([]),
  atividadeRural: zAtividadeRural.optional(),
  ganhosCapital: z.array(zDemonstrativoGcap).default([]),
  resumo: zResumo.prefault({}),
  resumoCalculado: zResumoCalculado.optional(),
});
export type Declaracao = z.infer<typeof zDeclaracao>;
/** Forma de entrada aceita por `zDeclaracao.parse` (campos com padrão podem ser omitidos). */
export type DeclaracaoEntrada = z.input<typeof zDeclaracao>;

/** Nome de cada ficha, usado em pendências e mensagens. */
export const FICHAS = {
  identificacao: "Identificação do Contribuinte",
  dependentes: "Dependentes",
  alimentandos: "Alimentandos",
  rendimentosPJ: "Rendimentos Tributáveis Recebidos de Pessoa Jurídica",
  rendimentosPFExterior: "Rendimentos Tributáveis Recebidos de Pessoa Física e do Exterior",
  rendimentosIsentos: "Rendimentos Isentos e Não Tributáveis",
  rendimentosExclusivos: "Rendimentos Sujeitos à Tributação Exclusiva/Definitiva",
  rendimentosExigibilidadeSuspensa: "Rendimentos Tributáveis de PJ (Exigibilidade Suspensa)",
  rendimentosAcumulados: "Rendimentos Recebidos Acumuladamente",
  impostoPago: "Imposto Pago/Retido",
  pagamentos: "Pagamentos Efetuados",
  doacoesEfetuadas: "Doações Efetuadas",
  doacoesDiretamenteNaDeclaracao: "Doações Diretamente na Declaração",
  bens: "Bens e Direitos",
  dividas: "Dívidas e Ônus Reais",
  espolio: "Espólio",
  finalEspolio: "Espólio (Final de Espólio)",
  herdeiros: "Herdeiros/Meeiro",
  saidaDefinitiva: "Saída Definitiva do País",
  informacoesConjuge: "Informações do Cônjuge",
  doacoesPartidos: "Doações a Partidos Políticos e Candidatos",
  rendaVariavel: "Renda Variável: Operações Comuns/Day-Trade",
  fundosImobiliarios: "Renda Variável: Operações em FII ou Fiagro",
  atividadeRural: "Demonstrativo da Atividade Rural",
  ganhosCapital: "Demonstrativo de Ganhos de Capital",
  resumo: "Resumo da Declaração",
} as const;
export type Ficha = keyof typeof FICHAS;
