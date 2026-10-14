/**
 * Informações do Resumo da Declaração que o contribuinte escolhe: opção de
 * tributação, quotas, débito automático, conta para restituição ou débito e
 * Pix (registro 16, campos NR_QUOTAS, NR_BANCO, NR_AGENCIA, NR_CONTA,
 * NR_DV_CONTA, IN_TIPO_CONTA, IN_DEBITO_AUTOM; nota 05 F-RESUMO-*). Os totais
 * calculados ficam em `ResumoCalculado`, preenchido pelo motor de cálculo ou
 * pela importação de um arquivo.
 */
import { z } from "zod";
import { zCentavos, zCodigo, zValor } from "./comum.js";

/** Opção pela forma de tributação. */
export const zOpcaoTributacao = z.enum(["deducoesLegais", "descontoSimplificado"]);
export type OpcaoTributacao = z.infer<typeof zOpcaoTributacao>;

/** Tipo de conta para restituição ou débito (tabela tipos-conta: 1, 2, 3). */
export const zTipoConta = z.enum(["corrente", "poupanca", "pagamento"]);
export type TipoConta = z.infer<typeof zTipoConta>;

/** Conta bancária de titularidade do declarante para restituição ou débito automático. */
export const zContaRestituicao = z.object({
  /** Código COMPE de 3 dígitos (tabela bancos). */
  banco: zCodigo(3),
  /** Agência sem DV. */
  agencia: z.string().regex(/^\d{1,5}$/, "Agência deve conter apenas dígitos, sem DV"),
  conta: z.string().regex(/^\d{1,20}$/, "Conta deve conter apenas dígitos"),
  dv: z.string().regex(/^[0-9Xx]{1,2}$|^[Pp]$/, "DV inválido"),
  tipo: zTipoConta.default("corrente"),
  /** Operação (Caixa Econômica Federal). */
  operacao: z
    .string()
    .regex(/^\d{3,4}$/)
    .optional(),
});
export type ContaRestituicao = z.infer<typeof zContaRestituicao>;

/** Escolhas do Resumo. */
export const zResumo = z.object({
  opcaoTributacao: zOpcaoTributacao.default("deducoesLegais"),
  /**
   * Número de quotas do imposto a pagar (1 a 8; Saída Definitiva e Final de Espólio: 1). 0
   * significa "não se aplica" (sem saldo a pagar), como o programa grava no arquivo.
   */
  quotas: z.number().int().min(0).max(8).default(1),
  debitoAutomatico: z.boolean().default(false),
  /** Débito a partir da 1ª quota (ou quota única); falso = a partir da 2ª quota. */
  debitoPrimeiraQuota: z.boolean().default(true),
  conta: zContaRestituicao.optional(),
  /** Restituição por Pix com chave CPF do titular. */
  pix: z.boolean().default(false),
});
export type Resumo = z.infer<typeof zResumo>;

/** Totais calculados do Resumo (somente leitura; ver registros 18 e 20). */
export const zResumoCalculado = z.object({
  totalRendimentosTributaveis: zValor,
  totalDeducoes: zValor,
  descontoSimplificado: zValor,
  baseCalculo: zValor,
  impostoDevido: zValor,
  totalImpostoPago: zValor,
  impostoARestituir: zValor,
  impostoAPagar: zValor,
  bensAnterior: zValor,
  bensAtual: zValor,
  dividasAnterior: zValor,
  dividasAtual: zValor,
  totalIsentos: zValor,
  totalExclusivos: zValor,
  /** Alíquota efetiva em centésimos de ponto percentual. */
  aliquotaEfetivaCentesimos: z.number().int().nonnegative().default(0),
  /** Base de cálculo das aplicações financeiras no exterior (Lei 14.754/2023), pode ser negativa. */
  baseCalculoLei14754: zCentavos.optional(),
});
export type ResumoCalculado = z.infer<typeof zResumoCalculado>;
