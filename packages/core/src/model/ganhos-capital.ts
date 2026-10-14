/**
 * Demonstrativo de Ganhos de Capital (GCAP) importado para a declaração
 * (registros 60 a 78; nota 06 D-GCAP-*). O MCP Imposto de Renda guarda os dados que o
 * demonstrativo transporta para a declaração e a identificação de cada
 * alienação; o detalhamento interno do cálculo (faixas, parcelas, reduções)
 * fica em `apuracao`, como valores já apurados.
 */
import { z } from "zod";
import { zCodigo, zCodigoPais, zCpf, zCpfOuCnpj, zData, zTexto, zUf, zValor } from "./comum.js";

/** Adquirente do bem alienado (registro 65). */
export const zAdquirente = z.object({ ni: zCpfOuCnpj, nome: zTexto(60) });

/** Parcela de ampliação ou reforma do bem (registros 66 e 67). */
export const zReformaGcap = z.object({
  data: zData,
  valor: zValor,
});

/** Valores apurados de uma alienação (seções Apuração, Cálculo do Imposto e Consolidação). */
export const zApuracaoGcap = z.object({
  valorAlienacao: zValor,
  custoCorretagem: zValor,
  custoAquisicao: zValor,
  ganhoCapital: zValor,
  /** Soma das reduções (Lei 7.713/1988, FR1, FR2, aplicação em outro imóvel, pequeno valor, único imóvel). */
  reducoes: zValor,
  impostoDevido: zValor,
  impostoPago: zValor,
  impostoDiferidoPosterior: zValor,
  rendimentoIsento: zValor,
  rendimentoExclusivo: zValor,
});
export type ApuracaoGcap = z.infer<typeof zApuracaoGcap>;

/** Campos comuns às alienações de imóvel, móvel e participação societária. */
const camposAlienacao = {
  /** CPF do titular ou dependente que alienou. */
  cpfBeneficiario: zCpf,
  /** Chave da operação no demonstrativo. */
  operacao: z.number().int().nonnegative(),
  exterior: z.boolean().default(false),
  descricao: zTexto(152),
  /** Natureza da operação (código e descrição do demonstrativo). */
  naturezaOperacao: zCodigo(2),
  dataAlienacao: zData,
  dataAquisicao: zData.optional(),
  valorOperacao: zValor,
  aPrazo: z.boolean().default(false),
  /** País em que estava no ato da alienação, se em paraíso fiscal. */
  paisParaisoFiscal: zCodigoPais.optional(),
  adquirentes: z.array(zAdquirente).default([]),
  apuracao: zApuracaoGcap.prefault({}),
};

/** Alienação de bem imóvel (registro 61). */
export const zAlienacaoImovel = z.object({
  tipo: z.literal("imovel"),
  ...camposAlienacao,
  uf: zUf.optional(),
  municipio: zCodigo(4).optional(),
  residencial: z.boolean().optional(),
  /** Isenção do único imóvel até R$ 440.000,00 sem outra alienação em 5 anos. */
  unicoImovel: z.boolean().default(false),
  outraAlienacaoCincoAnos: z.boolean().default(false),
  /** Aplicação do produto da venda em outro imóvel residencial em 180 dias. */
  valorAplicadoOutroImovel: zValor,
  reformas: z.array(zReformaGcap).default([]),
  atualizadoLei14973: z.boolean().default(false),
});

/** Alienação de bem móvel ou direito (registro 62). */
export const zAlienacaoMovel = z.object({
  tipo: z.literal("movel"),
  ...camposAlienacao,
  possuiRegistroPublico: z.boolean().default(false),
  pequenoValor: z.boolean().default(false),
});

/** Alienação de participação societária (registros 63 e 73). */
export const zAlienacaoParticipacao = z.object({
  tipo: z.literal("participacaoSocietaria"),
  ...camposAlienacao,
  cnpjSociedade: z
    .string()
    .regex(/^\d{14}$/)
    .optional(),
  /** Espécie da participação (ações ordinárias, preferenciais, quotas). */
  especie: z.string().trim().max(1).optional(),
  quantidadeAlienada: z.number().int().nonnegative().optional(),
  impostoRetidoFonte: zValor,
});

/** Uma alienação do demonstrativo de ganhos de capital. */
export const zAlienacaoGcap = z.discriminatedUnion("tipo", [
  zAlienacaoImovel,
  zAlienacaoMovel,
  zAlienacaoParticipacao,
]);
export type AlienacaoGcap = z.infer<typeof zAlienacaoGcap>;

/** Operação com moeda estrangeira em espécie (registro 74). */
export const zOperacaoMoedaEspecie = z.object({
  /** Código da moeda (tabela moedas, identificador textual do programa). */
  moeda: z.string().trim().min(1).max(7),
  tipoOperacao: z.enum(["saldoInicial", "compra", "venda"]),
  data: zData,
  /** Quantidade de moeda em unidades mínimas (centésimos). */
  quantidade: z.number().int().nonnegative(),
  valorReais: zValor,
  adquirente: zAdquirente.optional(),
});
export type OperacaoMoedaEspecie = z.infer<typeof zOperacaoMoedaEspecie>;

/** Totais que o demonstrativo transporta para a declaração (registros 60 e 78). */
export const zTotaisGcap = z.object({
  rendimentoExclusivo: zValor,
  isentoPequenoValor: zValor,
  isentoUnicoImovel: zValor,
  isentoReducao: zValor,
  impostoPago: zValor,
  impostoDevido: zValor,
  impostoDiferidoPosterior: zValor,
  ganhoMoedaEspecie: zValor,
  impostoDevidoMoedaEspecie: zValor,
  rendimentoExclusivoExterior: zValor,
  impostoPagoExterior: zValor,
  isentoExterior: zValor,
});
export type TotaisGcap = z.infer<typeof zTotaisGcap>;

/** Demonstrativo de Ganhos de Capital de um beneficiário (titular ou dependente). */
export const zDemonstrativoGcap = z.object({
  cpfBeneficiario: zCpf,
  /** Período de permanência coberto pelo demonstrativo. */
  dataInicio: zData.optional(),
  dataFim: zData.optional(),
  pais: zCodigoPais.optional(),
  alienacoes: z.array(zAlienacaoGcap).default([]),
  moedaEspecie: z.array(zOperacaoMoedaEspecie).default([]),
  totais: zTotaisGcap.prefault({}),
});
export type DemonstrativoGcap = z.infer<typeof zDemonstrativoGcap>;
