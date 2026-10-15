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

/** Inteiro não negativo em escala fixa (cotações com 4 casas, custo médio com 6). */
const zEscala = z
  .union([z.bigint(), z.number().int().refine(Number.isSafeInteger, "inteiro seguro")])
  .transform((v) => BigInt(v))
  .refine((v) => v >= 0n, { message: "Valor não pode ser negativo" })
  .default(0n);

/**
 * Bem adquirido no exterior (registros 64 e 69 com apuração em dólar): com que rendimentos o
 * bem foi comprado, as cotações do dólar e os valores em dólar, em centavos de dólar. As
 * cotações têm 4 casas decimais (`55000` = 5,5000). A parte de origem nacional é convertida
 * pela cotação da aquisição; a de origem estrangeira é apurada em dólar e convertida pela
 * cotação da alienação (casos gcap-exterior-* do GCAP 2025).
 */
export const zCambioGcap = z.object({
  origem: z.enum(["nacional", "estrangeira", "ambas"]),
  /** Código da moeda estrangeira na tabela do programa ("USA"). */
  moeda: z.string().trim().min(1).max(7).default("USA"),
  cotacaoAquisicao: zEscala,
  cotacaoAlienacao: zEscala,
  valorAlienacaoDolar: zValor,
  corretagemDolar: zValor,
  /** Custo de aquisição pago com rendimentos em reais, em dólar. */
  custoNacionalDolar: zValor,
  /** Custo de aquisição pago com rendimentos em moeda estrangeira, em dólar. */
  custoEstrangeiraDolar: zValor,
});
export type CambioGcap = z.infer<typeof zCambioGcap>;

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
  cambio: zCambioGcap.optional(),
});

/** Alienação de bem móvel ou direito (registro 62). */
export const zAlienacaoMovel = z.object({
  tipo: z.literal("movel"),
  ...camposAlienacao,
  possuiRegistroPublico: z.boolean().default(false),
  pequenoValor: z.boolean().default(false),
  cambio: zCambioGcap.optional(),
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
  /** UF e município da sede da sociedade. */
  uf: zUf.optional(),
  municipio: zCodigo(4).optional(),
  /** Alienações do mês até R$ 35.000,00 (isenção de pequeno valor). */
  pequenoValor: z.boolean().default(false),
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
  /** Cotação do dólar na venda, com 4 casas (`58000` = 5,8000). */
  cotacaoDolar: zEscala,
  /** Custo médio depois da operação, com 6 casas (`5600000` = 5,600000). */
  custoMedio: zEscala,
  /** Custo da quantidade vendida e ganho da venda. */
  custoAlienacao: zValor,
  ganhoCapital: zValor,
  /** Saldo em reais e estoque (centésimos da moeda) depois da operação. */
  saldoReais: zValor,
  estoque: z.number().int().nonnegative().default(0),
});
export type OperacaoMoedaEspecie = z.infer<typeof zOperacaoMoedaEspecie>;

/** Totalização de um mês das moedas alienadas em espécie (registro 76), valores em dólar e reais. */
export const zMesMoedaEspecie = z.object({
  alienacaoDolar: zValor,
  /** Alienações em dólar acumuladas no ano até o mês. */
  alienacaoConsolidadaDolar: zValor,
  ganhoCapital: zValor,
  ganhoTributavel: zValor,
  impostoDevido: zValor,
  impostoPago: zValor,
});
export type MesMoedaEspecie = z.infer<typeof zMesMoedaEspecie>;

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
  /** Os 12 meses da totalização de moedas em espécie; vazio sem moeda em espécie. */
  moedaEspecieMensal: z.array(zMesMoedaEspecie).max(12).default([]),
  totais: zTotaisGcap.prefault({}),
});
export type DemonstrativoGcap = z.infer<typeof zDemonstrativoGcap>;
