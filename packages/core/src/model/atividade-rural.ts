/**
 * Demonstrativo da Atividade Rural, Brasil e exterior (registros 50 a 57;
 * nota 06 D-AR-*). Valores do exterior em moeda original ficam em unidades
 * mínimas da moeda (centésimos), como inteiros; o resultado em US$ também.
 */
import { z } from "zod";
import { zCentavos, zCodigo, zCodigoPais, zCpfOuCnpj, zMes, zTexto, zValor } from "./comum.js";

/** Participante de imóvel explorado em condomínio, parceria ou arrendamento. */
export const zParticipanteImovelRural = z.object({
  /** CPF/CNPJ; dispensado quando o participante é estrangeiro sem documento brasileiro. */
  ni: zCpfOuCnpj.optional(),
  nome: zTexto(60),
  estrangeiro: z.boolean().default(false),
});
export type ParticipanteImovelRural = z.infer<typeof zParticipanteImovelRural>;

/** Dados do imóvel explorado (aba Brasil ou Exterior). */
export const zImovelRural = z.object({
  /** Código da atividade (tabela atividade-rural-tipos: 10 a 17 ou 99). */
  atividade: zCodigo(2),
  nome: zTexto(60),
  /** Localização; no exterior, cidade e país. */
  localizacao: zTexto(55),
  /** País do imóvel no exterior (ausente no Brasil). */
  pais: zCodigoPais.optional(),
  /** CIB (Cadastro Imobiliário Brasileiro), só no Brasil. */
  cib: z.string().trim().max(8).optional(),
  /** Área em décimos de hectare (uma casa decimal). */
  areaDecimosHa: z.number().int().nonnegative(),
  /** Condição de exploração (tabela atividade-rural-condicoes-exploracao: 1 a 6). */
  condicaoExploracao: z.string().regex(/^[1-6]$/),
  /** Participação em centésimos de ponto percentual (100,00% = 10000). */
  participacaoCentesimos: z.number().int().min(1).max(10000),
  participantes: z.array(zParticipanteImovelRural).default([]),
});
export type ImovelRural = z.infer<typeof zImovelRural>;

/** Receita bruta e despesa de custeio/investimento de um mês (Brasil). */
export const zMesAtividadeRural = z.object({
  mes: zMes,
  receitaBruta: zValor,
  despesa: zValor,
});

/** Receitas e despesas anuais de um país (aba Exterior), em moeda original. */
export const zReceitasDespesasExterior = z.object({
  pais: zCodigoPais,
  receitaBrutaMoedaOriginal: zValor,
  despesaMoedaOriginal: zValor,
  /** Resultado convertido para dólar (centavos de US$), informado pelo usuário. */
  resultadoDolar: zCentavos,
});

/** Linhas digitadas da Apuração do Resultado (Brasil ou Exterior). */
export const zApuracaoAtividadeRural = z.object({
  /** Saldo de prejuízo(s) a compensar de exercício(s) anterior(es). */
  prejuizoAnterior: zValor,
  /**
   * Forma de apuração do resultado tributável: pelo resultado (código 2 no arquivo), pelo limite
   * de 20% da receita bruta (código 1) ou não informada (0, e o programa não tributa o resultado).
   */
  opcao: z.enum(["resultado", "limite20", "naoInformada"]).default("resultado"),
  /** Compensação de prejuízo(s) de exercício(s) anterior(es). */
  compensacaoPrejuizo: zValor,
  /** Adiantamento(s) recebido(s) no ano por conta de venda para entrega futura. */
  adiantamentosRecebidos: zValor,
  /** Adiantamentos recebidos até o ano anterior, de produtos entregues no ano. */
  adiantamentosAnterioresEntregues: zValor,
  /** Exterior: limite de 20% em reais quando importado (preenchido à mão). */
  limite20Reais: zValor.optional(),
  /** Final de Espólio e Saída Definitiva: resultado total em reais informado. */
  resultadoTotalReaisInformado: zCentavos.optional(),
});
export type ApuracaoAtividadeRural = z.infer<typeof zApuracaoAtividadeRural>;

/** Movimentação do rebanho por espécie (quantidade de cabeças). */
export const zRebanho = z.object({
  /** Espécie: 1 a 4 conforme o programa; 5 = outros. */
  especie: z.string().regex(/^[1-5]$/),
  estoqueInicial: z.number().int().nonnegative(),
  aquisicoes: z.number().int().nonnegative().default(0),
  nascimentos: z.number().int().nonnegative().default(0),
  consumoPerdas: z.number().int().nonnegative().default(0),
  vendas: z.number().int().nonnegative().default(0),
});
export type Rebanho = z.infer<typeof zRebanho>;

/** Bem da atividade rural (tabela atividade-rural-bens). */
export const zBemAtividadeRural = z.object({
  codigo: zCodigo(2),
  pais: zCodigoPais.default("105"),
  discriminacao: zTexto(512),
  situacaoAnterior: zValor,
  situacaoAtual: zValor,
});

/** Dívida vinculada à atividade rural. */
export const zDividaAtividadeRural = z.object({
  discriminacao: zTexto(512),
  niCredor: zCpfOuCnpj.optional(),
  situacaoAnterior: zValor,
  situacaoAtual: zValor,
  valorPago: zValor,
});

/** Dados de uma das abas (Brasil ou Exterior) do demonstrativo. */
const zAbaAtividadeRural = z.object({
  imoveis: z.array(zImovelRural).default([]),
  apuracao: zApuracaoAtividadeRural.prefault({}),
  rebanho: z.array(zRebanho).default([]),
  dividas: z.array(zDividaAtividadeRural).default([]),
});

/** Demonstrativo da Atividade Rural. */
export const zAtividadeRural = z.object({
  brasil: zAbaAtividadeRural
    .extend({ receitasDespesas: z.array(zMesAtividadeRural).max(12).default([]) })
    .prefault({}),
  exterior: zAbaAtividadeRural
    .extend({ receitasDespesas: z.array(zReceitasDespesasExterior).default([]) })
    .prefault({}),
  bens: z.array(zBemAtividadeRural).default([]),
});
export type AtividadeRural = z.infer<typeof zAtividadeRural>;
