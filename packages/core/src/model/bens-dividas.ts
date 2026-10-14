/**
 * Fichas Bens e Direitos (registros 27, 36, 37 e 59) e Dívidas e Ônus Reais
 * (registro 28). Grupos e códigos da tabela bens-direitos.json; casos
 * especiais conforme a nota 05 (F-BENS-ESP-*, F-DIV).
 */
import { z } from "zod";
import {
  PAIS_BRASIL,
  zBeneficiario,
  zCentavos,
  zCentavosNaoNegativos,
  zCodigo,
  zCodigoPais,
  zCpfOuCnpj,
  zData,
  zTexto,
  zUf,
  zValor,
} from "./comum.js";

/** Dados de imóvel (grupo 01). */
export const zDadosImovel = z.object({
  logradouro: z.string().trim().max(40).optional(),
  numero: z.string().trim().max(6).optional(),
  complemento: z.string().trim().max(40).optional(),
  bairro: z.string().trim().max(40).optional(),
  cep: z
    .string()
    .regex(/^\d{8}$/)
    .optional(),
  uf: zUf.optional(),
  municipio: zCodigo(4).optional(),
  /** Área total com até 2 casas decimais, em centésimos da unidade. */
  areaTotalCentesimos: z.number().int().nonnegative().optional(),
  unidade: z.enum(["m2", "ha"]).optional(),
  registradoEmCartorio: z.boolean().optional(),
  matricula: z.string().trim().max(40).optional(),
  nomeCartorio: z.string().trim().max(60).optional(),
  /** Inscrição municipal (IPTU). */
  iptu: z.string().trim().max(30).optional(),
  /** CIB, Cadastro Imobiliário Brasileiro (substitui o NIRF) para imóvel rural. */
  cib: z.string().trim().max(8).optional(),
  /** CEI/CNO da obra (construção). */
  ceiCno: z
    .string()
    .regex(/^\d{12}$/)
    .optional(),
});
export type DadosImovel = z.infer<typeof zDadosImovel>;

/** Conta bancária (grupos 04 e 06): banco, agência sem DV, conta e DV. */
export const zContaBem = z.object({
  /** Código COMPE de 3 dígitos (tabela bancos-bens). */
  banco: zCodigo(3),
  agencia: z.string().regex(/^\d{1,4}$/, "Agência deve ter até 4 dígitos, sem DV"),
  conta: z.string().regex(/^\d{1,20}$/, "Conta deve conter apenas dígitos"),
  dv: z
    .string()
    .regex(/^[0-9A-Za-z]{1,2}$/)
    .optional(),
  contaPagamento: z.boolean().default(false),
});
export type ContaBem = z.infer<typeof zContaBem>;

/** Partilha de um bem entre herdeiros (Declaração Final de Espólio, registro 59). */
export const zPartilhaBem = z.object({
  /** CPF/CNPJ do herdeiro ou meeiro (cadastrado na ficha Herdeiros). */
  niHerdeiro: zCpfOuCnpj,
  /** Percentual com 2 casas decimais, em centésimos (100,00% = 10000). */
  percentualCentesimos: z.number().int().min(0).max(10000),
});

/** Item da ficha Bens e Direitos. */
export const zBemDireito = z.object({
  /** Identificador do bem na declaração (chave usada nos vínculos com rendimentos). */
  chave: z.number().int().positive().optional(),
  /** Grupo (2 dígitos: 01 a 08 ou 99). */
  grupo: zCodigo(2),
  /** Código dentro do grupo (2 dígitos). */
  codigo: zCodigo(2),
  pertenceA: zBeneficiario.default({ tipo: "titular" }),
  /** Localização (país); 105 = Brasil. */
  pais: zCodigoPais.default(PAIS_BRASIL),
  discriminacao: zTexto(512),
  /** Situação em 31/12 do ano anterior. */
  situacaoAnterior: zValor,
  /** Situação em 31/12 do ano-calendário. */
  situacaoAtual: zValor,
  dataAquisicao: zData.optional(),
  /** CNPJ (ou CPF) vinculado ao bem: instituição, empresa, fundo, administradora, seguradora. */
  ni: zCpfOuCnpj.optional(),
  imovel: zDadosImovel.optional(),
  renavam: z.string().trim().max(30).optional(),
  /** Registro na aviação civil (aeronave). */
  registroAviacaoCivil: z.string().trim().max(30).optional(),
  /** Registro na Capitania dos Portos (embarcação). */
  registroCapitaniaPortos: z.string().trim().max(30).optional(),
  conta: zContaBem.optional(),
  /** Negociado em bolsa e código de negociação (ticker). */
  negociadoEmBolsa: z.boolean().default(false),
  codigoNegociacao: z.string().trim().max(20).optional(),
  /** Criptoativo custodiado em exchange (custodiante). */
  custodiante: z.boolean().optional(),
  /** Sigla da altcoin (código 08.02, tabela altcoins). */
  codigoAltcoin: z.string().trim().max(10).optional(),
  /** Sigla da stablecoin (código 08.03, tabela stablecoins). */
  codigoStablecoin: z.string().trim().max(10).optional(),
  /** Quadro "Aplicação Financeira" (Lei 14.754/2023): rendimento (positivo) ou perda (negativo). */
  aplicacaoFinanceiraExterior: z
    .object({
      rendimentoOuPerda: zCentavos,
      impostoPagoExterior: zValor,
    })
    .optional(),
  /** Quadro "Lucros e Dividendos" de entidade controlada no exterior. */
  lucrosDividendosExterior: z.object({ valorRecebido: zValor, impostoPago: zValor }).optional(),
  /** Bem com usufruto e lista de proprietários ou usufrutuários (registro 36). */
  usufruto: z.boolean().default(false),
  proprietariosUsufrutuarios: z.array(zCpfOuCnpj).default([]),
  /** Atualização do valor do bem pela Lei 14.973/2024. */
  atualizadoLei14973: z.boolean().default(false),
  /** Final de Espólio: bem ainda a inventariar. */
  bemAInventariar: z.boolean().default(false),
  /** Final de Espólio: situação na data da partilha e valor de transferência. */
  situacaoDataPartilha: zCentavosNaoNegativos.optional(),
  valorTransferencia: zCentavosNaoNegativos.optional(),
  partilha: z.array(zPartilhaBem).default([]),
});
export type BemDireito = z.infer<typeof zBemDireito>;

/** Item da ficha Dívidas e Ônus Reais. */
export const zDivida = z.object({
  /** Código da tabela dividas-onus (11 a 16). */
  codigo: zCodigo(2),
  /** Natureza da dívida, nome e CPF/CNPJ do credor. */
  discriminacao: zTexto(512),
  /** CPF/CNPJ do credor, quando estruturado. */
  niCredor: zCpfOuCnpj.optional(),
  situacaoAnterior: zValor,
  situacaoAtual: zValor,
  valorPago: zValor,
  /** Final de Espólio: situação na data da partilha. */
  situacaoDataPartilha: zCentavosNaoNegativos.optional(),
});
export type Divida = z.infer<typeof zDivida>;
