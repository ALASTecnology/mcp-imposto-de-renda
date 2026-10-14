/**
 * Fluxo comum das ferramentas que alteram a declaração: abrir o DBK da pasta autorizada,
 * alterar o modelo, validar com as regras do core e gravar o DBK (com backup automático).
 *
 * A gravação não é bloqueada por pendências, para permitir preencher a declaração aos poucos;
 * as pendências voltam sempre na resposta (`podeEntregar` diz se há erro impeditivo).
 */
import {
  type Declaracao,
  type DeclaracaoEntrada,
  FICHAS,
  gravarArquivo,
  lerArquivo,
  modeloParaRegistros,
  podeEntregar,
  type Registro,
  registrosParaModelo,
  separarPendencias,
  validarDeclaracao,
  verificarControles,
} from "@autoir/core";
import { z } from "zod";
import { interpretarDeclaracao } from "../conversao/dbk-modelo.js";
import { EntradaInvalidaError } from "../erros.js";
import { EXT_DECLARACAO, EXT_GRAVACAO, exigirPasta } from "./comum.js";
import type { ContextoFerramentas } from "./tipos.js";

/** Declaração aberta para edição, com os registros originais (base da gravação). */
export interface DeclaracaoAberta {
  readonly declaracao: Declaracao;
  readonly registros: readonly Registro[];
  readonly avisos: readonly string[];
}

/** Pendência no formato devolvido pelas ferramentas. */
export const zPendenciaSaida = z.object({
  codigo: z.string(),
  gravidade: z.enum(["erro", "aviso"]),
  ficha: z.string(),
  nomeFicha: z.string(),
  caminho: z.string(),
  mensagem: z.string(),
});

/** Campos de saída comuns a toda ferramenta que grava a declaração. */
export const SAIDA_GRAVACAO = {
  arquivo: z.string().describe("DBK gravado (nome relativo à pasta autorizada)."),
  bytes: z.number(),
  backup: z.string().nullable().describe("Cópia do conteúdo anterior em .autoir-backups."),
  registros: z.number(),
  controlesValidos: z.boolean(),
  podeEntregar: z.boolean().describe("Falso se houver pendência do tipo erro."),
  totalErros: z.number(),
  totalAvisos: z.number(),
  pendencias: z.array(zPendenciaSaida),
  avisos: z.array(z.string()),
};

export interface ResultadoGravacaoDeclaracao {
  arquivo: string;
  bytes: number;
  backup: string | null;
  registros: number;
  controlesValidos: boolean;
  podeEntregar: boolean;
  totalErros: number;
  totalAvisos: number;
  pendencias: z.infer<typeof zPendenciaSaida>[];
  avisos: string[];
}

/** Lê um DBK/DEC da pasta autorizada e converte para o modelo validado. */
export async function abrirDeclaracao(
  ctx: ContextoFerramentas,
  arquivo: string,
): Promise<DeclaracaoAberta> {
  const bytes = await exigirPasta(ctx).ler(arquivo, EXT_DECLARACAO);
  const lido = lerArquivo(bytes);
  const conv = registrosParaModelo(lido.registros);
  return {
    declaracao: interpretarDeclaracao(conv.declaracao),
    registros: lido.registros,
    avisos: conv.avisos,
  };
}

/** Pendências do core no formato das ferramentas. */
export function pendenciasDe(dec: Declaracao) {
  const pendencias = validarDeclaracao(dec);
  const { erros, avisos } = separarPendencias(pendencias);
  return {
    podeEntregar: podeEntregar(pendencias),
    totalErros: erros.length,
    totalAvisos: avisos.length,
    pendencias: pendencias.map((p) => ({
      codigo: p.codigo,
      gravidade: p.gravidade,
      ficha: p.ficha,
      nomeFicha: FICHAS[p.ficha],
      caminho: p.caminho,
      mensagem: p.mensagem,
    })),
  };
}

/**
 * Valida e grava a declaração em um DBK da pasta autorizada. Com `base` (os registros do
 * arquivo aberto), preserva o que o modelo não descreve. Os totais do Resumo são recalculados.
 */
export async function gravarDeclaracao(
  ctx: ContextoFerramentas,
  dec: Declaracao,
  destino: string,
  base?: readonly Registro[],
): Promise<ResultadoGravacaoDeclaracao> {
  const pasta = exigirPasta(ctx);
  const validacao = pendenciasDe(dec);
  const gravacao = modeloParaRegistros(dec, {
    ...(base ? { base } : {}),
    controles: { tipoArquivo: "DBK" },
  });
  const bytes = gravarArquivo(gravacao.registros);
  // Confere o que vai ao disco relendo os bytes gerados.
  const controles = verificarControles(lerArquivo(bytes).registros, { tipoArquivo: "DBK" });
  const escrito = await pasta.escrever(destino, bytes, EXT_GRAVACAO);
  return {
    arquivo: escrito.arquivo,
    bytes: escrito.bytes,
    backup: escrito.backup ?? null,
    registros: gravacao.registros.length,
    controlesValidos: controles.valido,
    ...validacao,
    avisos: [...gravacao.avisos],
  };
}

/**
 * Abre `arquivo`, aplica `alterar` ao modelo, valida e grava em `destino` (padrão: o próprio
 * arquivo, com backup). `alterar` recebe uma cópia profunda e pode devolver a forma de entrada
 * do schema (campos com padrão podem faltar).
 */
export async function editarDeclaracao(
  ctx: ContextoFerramentas,
  args: { arquivo: string; arquivo_destino?: string | undefined },
  alterar: (dec: Declaracao) => Declaracao | DeclaracaoEntrada,
): Promise<ResultadoGravacaoDeclaracao & { declaracao: Declaracao }> {
  const aberta = await abrirDeclaracao(ctx, args.arquivo);
  const destino = args.arquivo_destino ?? args.arquivo;
  if (!/\.dbk$/i.test(destino)) {
    throw new EntradaInvalidaError(
      "A gravação só gera cópia de segurança (.DBK). Informe 'arquivo_destino' com extensão .DBK; o .DEC de entrega é gerado pelo programa oficial.",
    );
  }
  const alterada = interpretarDeclaracao(alterar(structuredClone(aberta.declaracao)));
  const r = await gravarDeclaracao(ctx, alterada, destino, aberta.registros);
  return { ...r, avisos: [...aberta.avisos, ...r.avisos], declaracao: alterada };
}

/** Texto legível de uma gravação: arquivo, backup, controles e pendências. */
export function textoGravacao(r: ResultadoGravacaoDeclaracao, acao: string): string {
  return [
    `${acao} Gravado ${r.arquivo} (${r.registros} registros).`,
    r.backup ? `Cópia do conteúdo anterior: ${r.backup}.` : "Arquivo novo (sem backup).",
    `Controles: ${r.controlesValidos ? "conferem" : "com divergências"}.`,
    r.podeEntregar
      ? `Sem erros impeditivos; ${r.totalAvisos} aviso(s).`
      : `${r.totalErros} erro(s) impedem a entrega e ${r.totalAvisos} aviso(s); veja 'pendencias'.`,
    ...r.pendencias
      .filter((p) => p.gravidade === "erro")
      .slice(0, 10)
      .map((p) => `- [erro] ${p.nomeFicha} (${p.caminho}): ${p.mensagem}`),
    ...r.avisos.map((a) => `Aviso: ${a}`),
  ].join("\n");
}

/** Parâmetros comuns: o DBK a editar e, opcionalmente, outro destino. */
export const zArquivoEdicao = z
  .string()
  .min(1)
  .max(255)
  .describe(
    'DBK ou DEC da pasta autorizada a alterar (ex.: "12345678909-IRPF-A-2026-2025-ORIGI.DBK"). Se for DEC, informe arquivo_destino .DBK.',
  );
export const zArquivoDestino = z
  .string()
  .min(1)
  .max(255)
  .optional()
  .describe("DBK a gravar (padrão: o próprio arquivo, com cópia de segurança do anterior).");
