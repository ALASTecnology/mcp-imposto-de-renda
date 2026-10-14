/**
 * Recibo de entrega da declaração transmitida pelo programa oficial. O MCP Imposto de Renda não
 * transmite e não recebe o recibo: o usuário informa o número (12 dígitos) que o programa mostrou,
 * e o servidor o guarda num arquivo `<declaração>.recibo.json` ao lado da declaração, para
 * preencher a retificadora depois (`criar_retificadora` sem `recibo`).
 */
import type { Declaracao } from "@mcp-imposto-de-renda/core";
import { EntradaInvalidaError } from "../erros.js";
import { EXT_MODELO, exigirPasta } from "./comum.js";
import type { ContextoFerramentas } from "./tipos.js";

/** Conteúdo do arquivo de recibo. */
export interface ReciboRegistrado {
  readonly tipo: typeof TIPO_RECIBO;
  readonly cpf: string;
  readonly exercicio: number;
  readonly arquivo: string;
  readonly recibo: string;
  readonly registradoEm: string;
}

/** Tipo gravado no arquivo de recibo. */
export const TIPO_RECIBO = "recibo-mcp-imposto-de-renda";
/** Tipo gravado pelas versões com o nome antigo do projeto; continua aceito na leitura. */
const TIPO_RECIBO_ANTIGO = "recibo-autoir";

/** Nome do arquivo de recibo de uma declaração: `X.DBK` vira `X.recibo.json`. */
export function arquivoDoRecibo(arquivo: string): string {
  return `${arquivo.replace(/\.[^./]*$/, "")}.recibo.json`;
}

export function validarNumeroRecibo(recibo: string): string {
  const d = recibo.replace(/\D/g, "");
  if (!/^\d{12}$/.test(d)) throw new EntradaInvalidaError("O número do recibo tem 12 dígitos.");
  return d;
}

/** Grava o recibo da declaração `arquivo` (com cópia de segurança se já houver um). */
export async function registrarRecibo(
  ctx: ContextoFerramentas,
  arquivo: string,
  dec: Declaracao,
  recibo: string,
) {
  const conteudo: ReciboRegistrado = {
    tipo: TIPO_RECIBO,
    cpf: dec.identificacao.cpf,
    exercicio: dec.exercicio,
    arquivo,
    recibo: validarNumeroRecibo(recibo),
    registradoEm: ctx.relogio().toISOString(),
  };
  const bytes = new TextEncoder().encode(`${JSON.stringify(conteudo, null, 2)}\n`);
  const escrito = await exigirPasta(ctx).escrever(arquivoDoRecibo(arquivo), bytes, EXT_MODELO);
  return { conteudo, escrito };
}

/** Lê o recibo guardado para `arquivo`, se houver e for do mesmo CPF. */
export async function lerReciboRegistrado(
  ctx: ContextoFerramentas,
  arquivo: string,
  cpf: string,
): Promise<ReciboRegistrado | undefined> {
  let bytes: Uint8Array;
  try {
    bytes = await exigirPasta(ctx).ler(arquivoDoRecibo(arquivo), EXT_MODELO);
  } catch {
    return undefined;
  }
  try {
    const j = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(bytes),
    ) as Partial<ReciboRegistrado>;
    const tipo: string | undefined = j.tipo;
    if (
      (tipo !== TIPO_RECIBO && tipo !== TIPO_RECIBO_ANTIGO) ||
      j.cpf !== cpf ||
      typeof j.recibo !== "string"
    ) {
      return undefined;
    }
    validarNumeroRecibo(j.recibo);
    return { ...j, tipo: TIPO_RECIBO } as ReciboRegistrado;
  } catch {
    return undefined;
  }
}
