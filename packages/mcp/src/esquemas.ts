/**
 * Schemas de entrada das ferramentas, com descrições em pt-BR para o LLM preencher certo.
 *
 * Valores monetários aceitam duas formas, e a forma decide a unidade (sem adivinhação):
 * - texto: sempre em REAIS, no formato brasileiro ("1.234,56", "1234,5", "R$ 80.000,00");
 * - número inteiro: sempre em CENTAVOS (123456 = R$ 1.234,56).
 * Tudo é normalizado para inteiro de centavos com `parseCentavos` do core.
 */
import { type EntradaCalculo2026, parseCentavos } from "@autoir/core";
import { z } from "zod";

export const DESCRICAO_VALOR =
  'Valor em reais. Texto = REAIS no formato brasileiro ("1.234,56" ou "1234,56"); ' +
  "número inteiro = CENTAVOS (123456 = R$ 1.234,56). Nunca use ponto como separador decimal.";

/** Normaliza um valor monetário de entrada para inteiro de centavos em texto ("123456"). */
export function normalizarValor(valor: string | number): string {
  if (typeof valor === "number") {
    if (!Number.isSafeInteger(valor)) throw new Error("centavos devem ser inteiros");
    return String(valor);
  }
  const limpo = valor
    .trim()
    .replace(/^R\$\s*/i, "")
    .replace(/^(-)?\s*R\$\s*/i, "$1");
  return parseCentavos(limpo).toString();
}

/** Valor monetário (reais em texto ou centavos em número), normalizado para centavos em texto. */
export function zValorMonetario(descricao: string = DESCRICAO_VALOR) {
  return z
    .union([z.string().max(32), z.number().int()])
    .describe(descricao)
    .transform((v, ctx) => {
      try {
        return normalizarValor(v);
      } catch {
        ctx.addIssue({
          code: "custom",
          message:
            'Valor monetário inválido: use texto em reais no formato "1.234,56" ou número inteiro de centavos.',
        });
        return z.NEVER;
      }
    });
}

const valorOpcional = (descricao: string) =>
  zValorMonetario(`${descricao} ${DESCRICAO_VALOR}`).optional();

const zDocumento = (descricao: string) =>
  z
    .string()
    .max(20)
    .transform((s) => s.replace(/\D/g, ""))
    .describe(`${descricao} Com ou sem pontuação.`);

const zDataNascimento = z
  .string()
  .regex(/^(\d{8}|\d{4}-\d{2}-\d{2})$/, "Use DDMMAAAA ou AAAA-MM-DD")
  .describe("Data de nascimento: DDMMAAAA (ex.: 15031985) ou AAAA-MM-DD.");

const zCodigo2 = (descricao: string) =>
  z
    .string()
    .regex(/^\d{1,2}$/, "Código numérico de até 2 dígitos")
    .transform((s) => s.padStart(2, "0"))
    .describe(descricao);

/** Entrada do motor do exercício 2026, no formato `EntradaCalculo2026` do core. */
export const zEntradaCalculo = z
  .object({
    titular: z
      .object({
        cpf: zDocumento("CPF do titular."),
        nome: z.string().max(60).describe("Nome do titular."),
        nascimento: zDataNascimento
          .optional()
          .describe(
            "Data de nascimento do titular (DDMMAAAA ou AAAA-MM-DD); usada nos avisos de 65 anos.",
          ),
      })
      .describe("Titular da declaração."),
    dependentes: z
      .array(
        z.object({
          cpf: zDocumento("CPF do dependente."),
          nome: z.string().max(60),
          nascimento: zDataNascimento.optional(),
          codigo: zCodigo2(
            "Código da relação de dependência (tabela dependentes: 11, 21 a 26, 31, 41, 51). Use buscar_codigo.",
          ).optional(),
        }),
      )
      .max(100)
      .optional()
      .describe("Dependentes da ficha Dependentes. Cada um deduz R$ 2.275,08 no modelo completo."),
    rendimentosPJ: z
      .array(
        z.object({
          cnpj: zDocumento("CNPJ (ou CPF) da fonte pagadora.").optional(),
          nome: z.string().max(60).optional().describe("Nome da fonte pagadora."),
          rendimento: valorOpcional("Rendimentos tributáveis do informe (linha 1 do quadro 3)."),
          previdenciaOficial: valorOpcional("Contribuição previdenciária oficial (INSS)."),
          irrf: valorOpcional("Imposto de renda retido na fonte."),
          decimoTerceiro: valorOpcional("13º salário (tributação exclusiva, só informativo)."),
          irrfDecimoTerceiro: valorOpcional("IRRF sobre o 13º salário."),
          beneficiario: z
            .enum(["T", "D"])
            .optional()
            .describe("T = titular (padrão), D = dependente."),
          cpfDependente: zDocumento("CPF do dependente quando beneficiario = D.").optional(),
        }),
      )
      .max(500)
      .optional()
      .describe(
        "Rendimentos tributáveis recebidos de pessoa jurídica, um item por fonte pagadora.",
      ),
    rendimentosPF: z
      .object({
        meses: z
          .array(
            z.object({
              mes: z.number().int().min(1).max(12).describe("Mês (1 a 12)."),
              pessoaFisica: valorOpcional("Trabalho não assalariado, aluguéis e outros de PF."),
              exterior: valorOpcional("Rendimentos do exterior."),
              previdenciaOficial: valorOpcional("Previdência oficial paga no mês (carnê-leão)."),
              livroCaixa: valorOpcional("Despesas de livro-caixa do mês."),
              carneLeao: valorOpcional("Carnê-leão pago (Darf 0190)."),
            }),
          )
          .max(12)
          .optional(),
      })
      .optional()
      .describe("Rendimentos de pessoa física e do exterior (carnê-leão), por mês."),
    pagamentos: z
      .array(
        z.object({
          codigo: zCodigo2(
            "Código da ficha Pagamentos Efetuados: 01/02 instrução, 09 a 22 e 26 saúde, 30/31/33/34 pensão, 36/37 previdência complementar. Use listar_tabela pagamentos.",
          ),
          cpfCnpj: zDocumento("CPF/CNPJ de quem recebeu o pagamento.").optional(),
          valor: valorOpcional("Valor pago."),
          parcelaNaoDedutivel: valorOpcional("Parcela não dedutível ou valor reembolsado."),
          beneficiario: z
            .enum(["T", "D", "A"])
            .optional()
            .describe("Para quem foi a despesa: T titular, D dependente, A alimentando."),
          cpfDependente: zDocumento("CPF do dependente ou alimentando.").optional(),
        }),
      )
      .max(1000)
      .optional()
      .describe("Pagamentos efetuados (despesas dedutíveis no modelo completo)."),
    rendimentosIsentos: z
      .array(
        z.object({
          codigo: zCodigo2("Código do rendimento isento (10 = parcela isenta 65+)."),
          valor: valorOpcional("Valor."),
        }),
      )
      .max(500)
      .optional(),
    tributacaoExclusiva: z
      .array(
        z.object({
          codigo: zCodigo2("Código do rendimento exclusivo."),
          valor: valorOpcional("Valor."),
        }),
      )
      .max(500)
      .optional(),
    impostoPago: z
      .object({
        complementar: valorOpcional("Imposto complementar pago."),
        exterior: valorOpcional("Imposto pago no exterior."),
        irrfLei11033: valorOpcional("IRRF da Lei 11.033/2004."),
      })
      .optional(),
    doacoesDiretas: z
      .object({
        eca: valorOpcional("Doação direta na declaração ao Fundo da Criança e do Adolescente."),
        idoso: valorOpcional("Doação direta na declaração ao Fundo da Pessoa Idosa."),
      })
      .optional(),
    doacoesEfetuadas: z
      .array(
        z.object({
          codigo: zCodigo2("Código da doação (40 a 47)."),
          valor: valorOpcional("Valor doado."),
          parcelaNaoDedutivel: valorOpcional("Parcela não dedutível."),
        }),
      )
      .max(500)
      .optional(),
  })
  .describe("Dados do ano-calendário 2025 para o cálculo do exercício 2026.");

export type EntradaCalculoValidada = z.output<typeof zEntradaCalculo>;

/** Converte a entrada validada no tipo do core (os formatos já são os mesmos). */
export function paraEntradaCore(e: EntradaCalculoValidada): EntradaCalculo2026 {
  return JSON.parse(JSON.stringify(e)) as EntradaCalculo2026;
}
