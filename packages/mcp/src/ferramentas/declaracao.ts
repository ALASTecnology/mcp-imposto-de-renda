/**
 * Grupo "declaracao": abrir o DBK/DEC da pasta autorizada, converter para o modelo tipado e
 * gravar o modelo de volta em DBK. A cobertura da conversão está em `conversao/dbk-modelo.ts`.
 */
import {
  type Centavos,
  type Declaracao,
  FICHAS,
  formatCentavos,
  gravarArquivo,
  lerArquivo,
  verificarControles,
} from "@autoir/core";
import { z } from "zod";
import {
  FICHAS_CONVERTIDAS,
  interpretarDeclaracao,
  modeloParaRegistros,
  registrosParaModelo,
} from "../conversao/dbk-modelo.js";
import { ErroFerramenta } from "../erros.js";
import { objetoJson } from "../serializacao.js";
import {
  EXT_GRAVACAO,
  exigirPasta,
  lerDeclaracaoArquivo,
  zDeclaracaoJson,
  zNomeArquivo,
} from "./comum.js";
import type { GrupoFerramentas } from "./tipos.js";

const brl = (v: bigint) => `R$ ${formatCentavos(v as Centavos)}`;
const soma = <T>(itens: readonly T[], f: (t: T) => bigint) => itens.reduce((s, t) => s + f(t), 0n);

/** Resumo das fichas cobertas: quantidade de itens e totais relevantes (centavos em texto). */
export function resumirFichas(d: Declaracao) {
  return [
    { ficha: "dependentes", itens: d.dependentes.length, totais: {} },
    {
      ficha: "rendimentosPJ",
      itens: d.rendimentosPJ.length,
      totais: {
        rendimentos: soma(d.rendimentosPJ, (r) => r.rendimentos).toString(),
        impostoRetido: soma(d.rendimentosPJ, (r) => r.impostoRetido).toString(),
      },
    },
    {
      ficha: "pagamentos",
      itens: d.pagamentos.length,
      totais: { valorPago: soma(d.pagamentos, (p) => p.valorPago).toString() },
    },
    {
      ficha: "bens",
      itens: d.bens.length,
      totais: {
        situacaoAnterior: soma(d.bens, (b) => b.situacaoAnterior).toString(),
        situacaoAtual: soma(d.bens, (b) => b.situacaoAtual).toString(),
      },
    },
    {
      ficha: "dividas",
      itens: d.dividas.length,
      totais: { situacaoAtual: soma(d.dividas, (b) => b.situacaoAtual).toString() },
    },
  ].map((f) => ({ ...f, nome: FICHAS[f.ficha as keyof typeof FICHAS] }));
}

const zResumoFicha = z.object({
  ficha: z.string(),
  nome: z.string(),
  itens: z.number(),
  totais: z.record(z.string(), z.string()).describe("Centavos em texto."),
});

export const grupoDeclaracao: GrupoFerramentas = {
  nome: "declaracao",
  descricao: "Abrir, converter e gravar o arquivo da declaração (DBK/DEC).",
  exigePasta: true,
  registrar(r) {
    r.ferramenta(
      "abrir_declaracao",
      {
        titulo: "Abrir declaração (DBK/DEC)",
        descricao:
          "Lê um DBK ou DEC da pasta autorizada e devolve um resumo: contribuinte, tipo de " +
          "declaração, quantidade de itens e totais por ficha, registros por tipo e integridade dos controles.",
        entrada: { arquivo: zNomeArquivo("Arquivo .DBK ou .DEC.") },
        saida: {
          arquivo: z.string(),
          exercicio: z.number(),
          contribuinte: z.object({ nome: z.string(), cpf: z.string() }),
          tipoDeclaracao: z.string(),
          retificadora: z.boolean(),
          modeloValido: z.boolean(),
          fichas: z.array(zResumoFicha),
          registrosPorTipo: z.record(z.string(), z.number()),
          tiposNaoConvertidos: z.array(z.string()),
          controlesValidos: z.boolean(),
          avisos: z.array(z.string()),
        },
      },
      async ({ arquivo }) => {
        const { registros, exercicio } = await lerDeclaracaoArquivo(r.ctx, arquivo);
        const conv = registrosParaModelo(registros, exercicio);
        const avisos = [...conv.avisos];
        let dec: Declaracao | undefined;
        try {
          dec = interpretarDeclaracao(conv.declaracao);
        } catch (e) {
          avisos.push(e instanceof ErroFerramenta ? e.message : "Modelo incompleto.");
        }
        const controles = verificarControles(registros);
        if (!controles.valido) {
          avisos.push(
            `${controles.divergencias.length} divergência(s) nos controles; rode verificar_integridade_arquivo.`,
          );
        }
        const id = conv.declaracao.identificacao as {
          nome?: string;
          cpf?: string;
          tipoDeclaracao?: { tipo?: string; retificadora?: boolean };
        };
        const fichas = dec ? resumirFichas(dec) : [];
        const texto = [
          `${arquivo}: exercício ${exercicio}, ${id.nome ?? "?"} (CPF ${id.cpf ?? "?"}).`,
          `Tipo: ${id.tipoDeclaracao?.tipo ?? "?"}${id.tipoDeclaracao?.retificadora ? " retificadora" : " original"}.`,
          ...fichas.map(
            (f) =>
              `- ${f.nome}: ${f.itens} item(ns)${Object.entries(f.totais)
                .map(([k, v]) => `, ${k} ${brl(BigInt(v))}`)
                .join("")}`,
          ),
          `Controles (CRC e T9): ${controles.valido ? "conferem" : "com divergências"}.`,
          ...avisos.map((a) => `Aviso: ${a}`),
        ].join("\n");
        return {
          texto,
          dados: {
            arquivo,
            exercicio,
            contribuinte: { nome: id.nome ?? "", cpf: id.cpf ?? "" },
            tipoDeclaracao: id.tipoDeclaracao?.tipo ?? "",
            retificadora: id.tipoDeclaracao?.retificadora ?? false,
            modeloValido: dec !== undefined,
            fichas,
            registrosPorTipo: { ...conv.contagemPorTipo },
            tiposNaoConvertidos: [...conv.tiposNaoConvertidos],
            controlesValidos: controles.valido,
            avisos,
          },
        };
      },
    );

    r.ferramenta(
      "converter_dbk_para_modelo",
      {
        titulo: "Converter DBK/DEC para o modelo",
        descricao:
          "Converte um DBK/DEC da pasta autorizada no modelo JSON do AutoIR (identificação, " +
          "dependentes, rendimentos de PJ, pagamentos, bens e dívidas). Valores em centavos " +
          "(número inteiro). O resultado pode ser editado e gravado com converter_modelo_para_dbk.",
        entrada: { arquivo: zNomeArquivo("Arquivo .DBK ou .DEC.") },
        saida: {
          arquivo: z.string(),
          exercicio: z.number(),
          modeloValido: z.boolean(),
          declaracao: z.record(z.string(), z.unknown()),
          fichasConvertidas: z.array(z.string()),
          tiposNaoConvertidos: z.array(z.string()),
          avisos: z.array(z.string()),
        },
      },
      async ({ arquivo }) => {
        const { registros, exercicio } = await lerDeclaracaoArquivo(r.ctx, arquivo);
        const conv = registrosParaModelo(registros, exercicio);
        const avisos = [...conv.avisos];
        let declaracao: object = conv.declaracao;
        let valido = true;
        try {
          declaracao = interpretarDeclaracao(conv.declaracao);
        } catch (e) {
          valido = false;
          avisos.push(e instanceof ErroFerramenta ? e.message : "Modelo incompleto.");
        }
        const json = objetoJson(declaracao);
        return {
          texto:
            `Modelo de ${arquivo} (${valido ? "válido" : "com campos a corrigir"}):\n` +
            `${JSON.stringify(json, null, 2)}${avisos.length ? `\n${avisos.map((a) => `Aviso: ${a}`).join("\n")}` : ""}`,
          dados: {
            arquivo,
            exercicio,
            modeloValido: valido,
            declaracao: json,
            fichasConvertidas: [...FICHAS_CONVERTIDAS],
            tiposNaoConvertidos: [...conv.tiposNaoConvertidos],
            avisos,
          },
        };
      },
    );

    r.ferramenta(
      "converter_modelo_para_dbk",
      {
        titulo: "Gravar o modelo em DBK",
        descricao:
          "Grava a declaração (modelo JSON) em um arquivo .DBK da pasta autorizada. Com " +
          "'arquivo_base', parte do DBK/DEC existente e substitui só as fichas convertidas, " +
          "preservando as demais. Recalcula os controles (CRC, T9 e hash). Se o destino existir, " +
          "uma cópia é guardada em .autoir-backups antes. Depois, abra no programa oficial para conferir.",
        escreve: true,
        entrada: {
          declaracao: zDeclaracaoJson,
          arquivo_destino: zNomeArquivo("Arquivo .DBK a gravar."),
          arquivo_base: zNomeArquivo("DBK/DEC de partida (opcional, recomendado).").optional(),
        },
        saida: {
          arquivo: z.string(),
          bytes: z.number(),
          backup: z.string().nullable(),
          registros: z.number(),
          registrosPorTipo: z.record(z.string(), z.number()),
          controlesValidos: z.boolean(),
          avisos: z.array(z.string()),
        },
      },
      async ({ declaracao, arquivo_destino, arquivo_base }) => {
        const pasta = exigirPasta(r.ctx);
        const dec = interpretarDeclaracao(declaracao);
        const base = arquivo_base
          ? (await lerDeclaracaoArquivo(r.ctx, arquivo_base)).registros
          : undefined;
        const { registros, avisos } = modeloParaRegistros(dec, base);
        const bytes = gravarArquivo(registros);
        // Confere o que vai ao disco relendo os bytes gerados.
        const relido = lerArquivo(bytes);
        const controles = verificarControles(relido.registros);
        const escrito = await pasta.escrever(arquivo_destino, bytes, EXT_GRAVACAO);
        const contagem: Record<string, number> = {};
        for (const reg of registros) contagem[reg.tipo] = (contagem[reg.tipo] ?? 0) + 1;
        const texto = [
          `Gravado ${escrito.arquivo} (${escrito.bytes} bytes, ${registros.length} registros).`,
          escrito.backup
            ? `Cópia do conteúdo anterior: ${escrito.backup}.`
            : "Arquivo novo (sem backup).",
          `Controles: ${controles.valido ? "conferem" : "com divergências"}.`,
          ...avisos.map((a) => `Aviso: ${a}`),
        ].join("\n");
        return {
          texto,
          dados: {
            arquivo: escrito.arquivo,
            bytes: escrito.bytes,
            backup: escrito.backup ?? null,
            registros: registros.length,
            registrosPorTipo: contagem,
            controlesValidos: controles.valido,
            avisos,
          },
        };
      },
    );
  },
};
