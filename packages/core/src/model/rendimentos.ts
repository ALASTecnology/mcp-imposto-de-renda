/**
 * Fichas de rendimentos tributáveis: recebidos de PJ (registros 21 e 32),
 * de PF e do exterior com carnê-leão mensal (registros 22 e 49), com
 * exigibilidade suspensa (registros 80 e 81) e recebidos acumuladamente
 * (registros 45 a 48). Notas 02 F-RTPJ/F-RTPF e 03 F-SUSP/F-RRA.
 */
import { z } from "zod";
import {
  zBeneficiario,
  zCentavosNaoNegativos,
  zCpf,
  zData,
  zMes,
  zPessoa,
  zValor,
  zValoresMensais,
} from "./comum.js";

/** Rendimento tributável recebido de uma fonte pagadora PJ (ou PF empregadora). */
export const zRendimentoPJ = z.object({
  /** Titular ou dependente que recebeu. */
  beneficiario: zBeneficiario,
  /** Fonte pagadora: CNPJ, ou CPF do empregador pessoa física. */
  fonte: zPessoa,
  rendimentos: zCentavosNaoNegativos,
  contribuicaoPrevidenciaria: zValor,
  impostoRetido: zValor,
  /** 13º salário líquido do comprovante (transportado para Exclusivos 01 ou 08). */
  decimoTerceiro: zValor,
  impostoRetidoDecimoTerceiro: zValor,
  /** Data da comunicação de saída à fonte pagadora (só Saída Definitiva). */
  dataComunicacaoSaida: zData.optional(),
});
export type RendimentoPJ = z.infer<typeof zRendimentoPJ>;

/**
 * Pagamento recebido de PF por profissional das ocupações 225, 226, 230, 231,
 * 232, 241, 255 e 355 (registro 49): CPF de quem pagou e de quem foi atendido.
 */
export const zPagamentoRecebidoPF = z.object({
  mes: zMes,
  cpfTitularPagamento: zCpf,
  /** CPF do beneficiário do serviço; ausente quando é o próprio titular do pagamento. */
  cpfBeneficiarioServico: zCpf.optional(),
  /** Marca "CPF não foi informado" (beneficiário diferente do titular e sem CPF). */
  cpfBeneficiarioNaoInformado: z.boolean().default(false),
  valor: zCentavosNaoNegativos,
});
export type PagamentoRecebidoPF = z.infer<typeof zPagamentoRecebidoPF>;

/**
 * Escrituração mensal de rendimentos de PF e do exterior de uma pessoa (titular
 * ou dependente), equivalente ao Carnê-Leão. Cada coluna tem 12 valores.
 */
export const zRendimentosPFExterior = z.object({
  beneficiario: zBeneficiario,
  /** NIT/PIS/PASEP (obrigatório com natureza 11 ou com previdência oficial informada). */
  nitPisPasep: z
    .string()
    .regex(/^\d{11}$/)
    .optional(),
  trabalhoNaoAssalariado: zValoresMensais,
  alugueis: zValoresMensais,
  outros: zValoresMensais,
  exterior: zValoresMensais,
  previdenciaOficial: zValoresMensais,
  /** Quantidade de dependentes por mês (informativa; não vai ao Resumo). */
  quantidadeDependentes: z
    .array(z.number().int().min(0).max(99))
    .length(12)
    .default(() => Array.from({ length: 12 }, () => 0)),
  /** Pensão alimentícia paga no mês (informativa; a dedução é feita em Pagamentos Efetuados). */
  pensaoAlimenticia: zValoresMensais,
  livroCaixa: zValoresMensais,
  /** Carnê-leão pago (Darf 0190), principal, no mês do recebimento. */
  carneLeaoPago: zValoresMensais,
  /** Detalhamento por pagador para as ocupações da área de saúde, advocacia e imóveis. */
  pagamentosRecebidos: z.array(zPagamentoRecebidoPF).default([]),
});
export type RendimentosPFExterior = z.infer<typeof zRendimentosPFExterior>;

/** Rendimento tributável de PJ com imposto de exigibilidade suspensa (informativo). */
export const zRendimentoExigibilidadeSuspensa = z.object({
  beneficiario: zBeneficiario,
  fonte: zPessoa,
  rendimentos: zCentavosNaoNegativos,
  depositosJudiciais: zValor,
});
export type RendimentoExigibilidadeSuspensa = z.infer<typeof zRendimentoExigibilidadeSuspensa>;

/** Forma de tributação do RRA: ajuste anual ou exclusiva na fonte (registro 45, OPCAO_TRIBUTACAO). */
export const zOpcaoTributacaoRRA = z.enum(["ajusteAnual", "exclusivaNaFonte"]);
export type OpcaoTributacaoRRA = z.infer<typeof zOpcaoTributacaoRRA>;

/** Pensão alimentícia descontada do RRA, paga a um alimentando (registros 46 e 48). */
export const zPensaoRRA = z.object({
  cpfAlimentando: zCpf,
  valor: zCentavosNaoNegativos,
});

/** Rendimentos recebidos acumuladamente (art. 12-A da Lei 7.713/1988). */
export const zRendimentoRRA = z.object({
  beneficiario: zBeneficiario,
  opcaoTributacao: zOpcaoTributacaoRRA,
  fonte: zPessoa,
  /** Rendimentos tributáveis, incluídos acréscimos e 13º, exceto juros de mora. */
  rendimentos: zCentavosNaoNegativos,
  parcelaIsenta65Anos: zValor,
  /** Juros de mora (transportados para Isentos código 27). */
  juros: zValor,
  contribuicaoPrevidenciaria: zValor,
  pensaoAlimenticia: zValor,
  pensoes: z.array(zPensaoRRA).default([]),
  impostoRetido: zValor,
  mesRecebimento: zMes,
  /** Número de meses a que se referem os rendimentos (aceita uma casa decimal). */
  numeroMeses: z.number().positive().max(9999),
});
export type RendimentoRRA = z.infer<typeof zRendimentoRRA>;
