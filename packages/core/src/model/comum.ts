/**
 * Blocos básicos do modelo: valores monetários, documentos, datas e meses.
 *
 * Regra de projeto: o schema garante a FORMA (tipos, tamanhos, padrões e
 * datas reais). Coerência de negócio (dígito verificador, códigos existentes,
 * campos obrigatórios por situação, cruzamentos entre fichas) fica em
 * `validate/`, que devolve pendências em vez de rejeitar o objeto. Assim uma
 * declaração em preenchimento continua representável.
 */
import { z } from "zod";
import { type Centavos, centavos } from "../centavos.js";

/**
 * Valor monetário em centavos. Aceita `bigint` ou inteiro seguro (`number`),
 * útil para dados vindos de JSON, e devolve sempre `Centavos`.
 */
export const zCentavos = z
  .union([z.bigint(), z.number().int().refine(Number.isSafeInteger, "inteiro seguro")])
  .transform((v): Centavos => centavos(v));

/** Valor monetário em centavos que não pode ser negativo. */
export const zCentavosNaoNegativos = zCentavos.refine((v) => v >= 0n, {
  message: "Valor não pode ser negativo",
});

/** Zero em centavos, usado como padrão de campos monetários não informados. */
export const ZERO: Centavos = centavos(0);

/** Valor monetário não negativo que assume zero quando ausente. */
export const zValor = zCentavosNaoNegativos.default(ZERO);

/** CPF com 11 dígitos, sem pontuação (o DV é conferido em `validate/`). */
export const zCpf = z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos sem pontuação");

/** CNPJ com 14 dígitos, sem pontuação (o DV é conferido em `validate/`). */
export const zCnpj = z.string().regex(/^\d{14}$/, "CNPJ deve ter 14 dígitos sem pontuação");

/** CPF ou CNPJ (11 ou 14 dígitos, sem pontuação). */
export const zCpfOuCnpj = z
  .string()
  .regex(/^(\d{11}|\d{14})$/, "CPF/CNPJ deve ter 11 ou 14 dígitos sem pontuação");

/** Verifica se `AAAA-MM-DD` é uma data real do calendário gregoriano. */
export function dataIsoValida(texto: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!m) return false;
  const ano = Number(m[1]);
  const mes = Number(m[2]);
  const dia = Number(m[3]);
  if (mes < 1 || mes > 12 || dia < 1) return false;
  const ultimo = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  return dia <= ultimo;
}

/** Data no formato ISO `AAAA-MM-DD`, validada contra o calendário. */
export const zData = z.string().refine(dataIsoValida, "Data inválida (use AAAA-MM-DD)");

/** Mês do ano-calendário (1 a 12). */
export const zMes = z.number().int().min(1).max(12);

/** Doze valores mensais, de janeiro (índice 0) a dezembro (índice 11). */
export const zValoresMensais = z
  .array(zCentavosNaoNegativos)
  .length(12, "Informe os 12 meses")
  .default(() => Array.from({ length: 12 }, () => ZERO));

/** Código numérico de tabela com tamanho fixo (ex.: `"01"`, `"105"`). */
export function zCodigo(tamanho: number) {
  return z.string().regex(new RegExp(`^\\d{${tamanho}}$`), `Código deve ter ${tamanho} dígito(s)`);
}

/** Unidade da federação (sigla de 2 letras). */
export const zUf = z.string().regex(/^[A-Z]{2}$/, "UF deve ser a sigla com 2 letras maiúsculas");

/** Texto livre obrigatório (não vazio após remover espaços). */
export function zTexto(maximo: number) {
  return z
    .string()
    .trim()
    .min(1, "Campo obrigatório")
    .max(maximo, `Máximo de ${maximo} caracteres`);
}

/** Pessoa identificada por CPF/CNPJ e nome (fonte pagadora, beneficiário, credor). */
export const zPessoa = z.object({
  /** CPF ou CNPJ sem pontuação. */
  ni: zCpfOuCnpj,
  /** Nome ou razão social. */
  nome: zTexto(60),
});
export type Pessoa = z.infer<typeof zPessoa>;

/**
 * A quem pertence o lançamento: ao titular ou a um dependente já cadastrado na
 * ficha Dependentes (referenciado pelo CPF).
 */
export const zBeneficiario = z.discriminatedUnion("tipo", [
  z.object({ tipo: z.literal("titular") }),
  z.object({ tipo: z.literal("dependente"), cpf: zCpf }),
]);
export type Beneficiario = z.infer<typeof zBeneficiario>;

/** Código de país do programa (3 dígitos). O Brasil é `"105"`. */
export const zCodigoPais = zCodigo(3);

/** Código do Brasil na tabela de países do programa. */
export const PAIS_BRASIL = "105";
