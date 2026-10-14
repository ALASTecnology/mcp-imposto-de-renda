/**
 * Ficha Identificação do Contribuinte (registros IR e 16 do leiaute; Ajuda
 * págs. 41 a 46; notas 02 F-IDENT-*).
 */
import { z } from "zod";
import { zCentavosNaoNegativos, zCodigo, zCodigoPais, zCpf, zData, zTexto, zUf } from "./comum.js";

/** Tipo da declaração escolhido na criação: ajuste anual, saída definitiva ou final de espólio. */
export const zTipoDeclaracao = z.enum(["ajusteAnual", "saidaDefinitiva", "finalEspolio"]);
export type TipoDeclaracao = z.infer<typeof zTipoDeclaracao>;

/** Código do Receitanet de cada tipo (campo CODIGO_RECNET do registro IR). */
export const CODIGO_RECEITANET: Readonly<Record<TipoDeclaracao, string>> = {
  ajusteAnual: "2600",
  saidaDefinitiva: "2620",
  finalEspolio: "2621",
};

/** Número de recibo de entrega: 12 dígitos (F-IDENT-TIPO). */
export const zNumeroRecibo = z.string().regex(/^\d{12}$/, "Número do recibo deve ter 12 dígitos");

/**
 * "Que tipo de declaração você deseja fazer?": original ou retificadora, com o
 * recibo da última declaração do exercício anterior (original) ou da declaração
 * imediatamente anterior do mesmo exercício (retificadora).
 */
export const zDadosTipoDeclaracao = z.object({
  tipo: zTipoDeclaracao,
  retificadora: z.boolean().default(false),
  /** Recibo da última declaração entregue do exercício anterior (opcional no ajuste original). */
  reciboExercicioAnterior: zNumeroRecibo.optional(),
  /** Recibo da declaração a retificar (obrigatório na retificadora). */
  reciboRetificada: zNumeroRecibo.optional(),
});
export type DadosTipoDeclaracao = z.infer<typeof zDadosTipoDeclaracao>;

/** Telefone ou celular: DDD de 2 dígitos e número de até 9 dígitos (F-IDENT-END-BR). */
export const zTelefone = z.object({
  ddd: z.string().regex(/^\d{2}$/, "DDD deve ter 2 dígitos"),
  numero: z.string().regex(/^\d{8,9}$/, "Número deve ter 8 ou 9 dígitos"),
});
export type Telefone = z.infer<typeof zTelefone>;

/** Endereço no Brasil (F-IDENT-END-BR; registro 16). */
export const zEnderecoBrasil = z.object({
  local: z.literal("brasil"),
  /** Código da tabela tipos-logradouro (ex.: `RUA`, `AVENIDA`). */
  tipoLogradouro: z.string().trim().min(1).max(15),
  logradouro: zTexto(40),
  numero: zTexto(6),
  complemento: z.string().trim().max(21).optional(),
  bairro: zTexto(19),
  uf: zUf,
  /** Código do município na tabela do programa (4 dígitos). */
  municipio: zCodigo(4),
  cep: z.string().regex(/^\d{8}$/, "CEP deve ter 8 dígitos"),
  telefone: zTelefone.optional(),
  celular: zTelefone.optional(),
  email: z.string().trim().max(90).optional(),
});
export type EnderecoBrasil = z.infer<typeof zEnderecoBrasil>;

/** Endereço no exterior (F-IDENT-END-EXT; registro 16). */
export const zEnderecoExterior = z.object({
  local: z.literal("exterior"),
  /** CPF do procurador residente no Brasil, quando houver. */
  cpfProcurador: zCpf.optional(),
  logradouro: zTexto(40),
  numero: zTexto(6),
  complemento: z.string().trim().max(21).optional(),
  bairro: z.string().trim().max(19).optional(),
  pais: zCodigoPais,
  /** Cód. EXT: representação diplomática mais próxima (tabela representacoes-diplomaticas). */
  codigoExterior: zCodigo(3).optional(),
  cidade: zTexto(40),
  codigoPostal: z.string().trim().max(9).optional(),
  /** DDI e telefone, como texto livre de dígitos. */
  telefone: z
    .string()
    .regex(/^\d{1,15}$/)
    .optional(),
  email: z.string().trim().max(90).optional(),
});
export type EnderecoExterior = z.infer<typeof zEnderecoExterior>;

/** Endereço do contribuinte, no Brasil ou no exterior. */
export const zEndereco = z.discriminatedUnion("local", [zEnderecoBrasil, zEnderecoExterior]);
export type Endereco = z.infer<typeof zEndereco>;

/** Ocupação principal (F-IDENT-OCUP). */
export const zOcupacao = z.object({
  /** Natureza da ocupação (tabela naturezas-ocupacao, 2 dígitos; 81 = Espólio). */
  natureza: zCodigo(2),
  /** Ocupação principal (tabela ocupacoes-principais, 3 dígitos); em branco para 13, 14, 61, 62, 71, 72 e 81. */
  ocupacaoPrincipal: zCodigo(3).optional(),
  /** Número do registro profissional (ocupações 225, 226, 230, 231, 232, 241, 255 e 355). */
  registroProfissional: z.string().trim().max(20).optional(),
});
export type Ocupacao = z.infer<typeof zOcupacao>;

/** Ficha Identificação do Contribuinte. */
export const zIdentificacao = z.object({
  cpf: zCpf,
  nome: zTexto(60),
  dataNascimento: zData,
  tipoDeclaracao: zDadosTipoDeclaracao,
  /** Há declarante ou dependente com doença grave ou deficiência física ou mental? */
  doencaGraveOuDeficiencia: z.boolean().default(false),
  /** Raça/cor autodeclarada (tabela raca-cor; 0 = não informada). */
  racaCor: z.string().regex(/^[0-5]$/),
  /** Houve alteração de endereço, telefone, e-mail ou ocupação desde a última declaração? */
  alteracaoCadastral: z.boolean().default(false),
  /** Cônjuge ou companheiro(a) e o respectivo CPF. */
  conjuge: z.object({ possui: z.boolean(), cpf: zCpf.optional() }).default({ possui: false }),
  /** Era residente no exterior e passou a ser residente no país no ano-calendário? */
  retornoAoPais: z
    .object({ retornou: z.boolean(), data: zData.optional() })
    .default({ retornou: false }),
  endereco: zEndereco,
  ocupacao: zOcupacao,
  /** NIT/PIS/PASEP (exigido para natureza 11 ou contribuição previdenciária na ficha PF). */
  nitPisPasep: z
    .string()
    .regex(/^\d{11}$/, "NIT/PIS/PASEP deve ter 11 dígitos")
    .optional(),
  /** Número do processo de atualização de bens pela Lei 14.973/2024, se houver. */
  processoAtualizacaoBemLei14973: z.string().trim().max(17).optional(),
  /** Prejuízo acumulado de aplicações financeiras no exterior (Lei 14.754/2023) do ano anterior. */
  prejuizoAnteriorLei14754: zCentavosNaoNegativos.optional(),
});
export type Identificacao = z.infer<typeof zIdentificacao>;
