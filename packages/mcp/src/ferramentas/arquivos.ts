/**
 * Grupo "arquivos": listagem da pasta autorizada e conferência dos controles do DBK/DEC.
 */
import { lerArquivo, verificarControles } from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import { interpretarDeclaracao, registrosParaModelo } from "../conversao/dbk-modelo.js";
import { lerReciboRegistrado } from "./ciclo-recibo.js";
import {
  blocoDeDados,
  EXT_DECLARACAO,
  EXT_LISTAGEM,
  exigirPasta,
  lerDeclaracaoArquivo,
  zNomeArquivo,
} from "./comum.js";
import type { GrupoFerramentas } from "./tipos.js";

const MAX_DIVERGENCIAS = 50;
/** Máximo de arquivos lidos por chamada de `listar_declaracoes`. */
const MAX_DECLARACOES = 200;
/** Exercício atendido pelo servidor; o anterior é o que se importa. */
const EXERCICIO_ATUAL = 2026;

/** Nome padrão do programa: `CPF-IRPF-A-2026-2025-ORIGI.DBK` (A ajuste, E espólio, S saída). */
const RX_NOME_PADRAO = /^(\d{11})-IRPF-([AES])-(\d{4})-(\d{4})-(ORIGI|RETIF)\.(DBK|DEC)$/i;
const TIPO_POR_LETRA = { A: "ajusteAnual", E: "finalEspolio", S: "saidaDefinitiva" } as const;

type Situacao = "emPreenchimento" | "gravadaParaEntrega" | "transmitida";

type ItemDeclaracao = {
  arquivo: string;
  cpf: string | null;
  nome: string | null;
  exercicio: number | null;
  tipo: "ajusteAnual" | "finalEspolio" | "saidaDefinitiva" | null;
  retificadora: boolean | null;
  modelo: "completa" | "simplificada" | null;
  situacao: Situacao;
  recibo: string | null;
  anoAnterior: boolean;
  modificadoEm: string;
  aviso: string | null;
};

const ROTULO_SITUACAO: Record<Situacao, string> = {
  emPreenchimento: "em preenchimento",
  gravadaParaEntrega: "gravada para entrega",
  transmitida: "transmitida",
};

function semAcento(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase();
}

export const grupoArquivos: GrupoFerramentas = {
  nome: "arquivos",
  descricao: "Arquivos da pasta autorizada.",
  exigePasta: true,
  registrar(r) {
    r.ferramenta(
      "listar_arquivos",
      {
        titulo: "Listar arquivos da pasta autorizada",
        descricao:
          "Lista os arquivos .DBK, .DEC, .json e .txt da pasta autorizada (sem subpastas, ocultos ou links).",
        entrada: {},
        saida: {
          arquivos: z.array(
            z.object({ nome: z.string(), tamanho: z.number(), modificadoEm: z.string() }),
          ),
        },
      },
      async () => {
        const arquivos = await exigirPasta(r.ctx).listar(EXT_LISTAGEM);
        return {
          texto:
            arquivos.length === 0
              ? "Nenhum arquivo de declaração na pasta autorizada."
              : arquivos
                  .map((a) => `- ${a.nome} (${a.tamanho} bytes, ${a.modificadoEm})`)
                  .join("\n"),
          dados: { arquivos: arquivos.map((a) => ({ ...a })) },
        };
      },
    );

    r.ferramenta(
      "listar_declaracoes",
      {
        titulo: "Listar declarações (em preenchimento e transmitidas)",
        descricao:
          'Relação das declarações DBK/DEC da pasta autorizada, como as abas "Em Preenchimento" e "Transmitidas" da tela inicial e a Relação de Declarações do programa: nome, CPF, exercício, tipo (ajuste, final de espólio, saída definitiva), original ou retificadora, modelo (completa ou simplificada) e situação (em preenchimento para DBK, gravada para entrega para DEC, transmitida quando há recibo registrado). Filtra por nome (sem diferenciar acentos), CPF e situação, ordena por tipo, modelo, nome ou CPF e aponta os arquivos do exercício anterior, que podem ser importados para começar a declaração nova. Não há limite de uma declaração aberta por vez.',
        entrada: {
          nome: z.string().max(60).optional().describe("Trecho do nome do contribuinte."),
          cpf: z.string().max(14).optional().describe("CPF, com ou sem pontuação."),
          situacao: z
            .enum(["emPreenchimento", "gravadaParaEntrega", "transmitida"])
            .optional()
            .describe("Filtra pela situação."),
          ordenar_por: z
            .enum(["arquivo", "tipo", "modelo", "nome", "cpf"])
            .default("arquivo")
            .describe("Coluna de ordenação da relação."),
        },
        saida: {
          declaracoes: z.array(
            z.object({
              arquivo: z.string(),
              cpf: z.string().nullable(),
              nome: z.string().nullable(),
              exercicio: z.number().nullable(),
              tipo: z.enum(["ajusteAnual", "finalEspolio", "saidaDefinitiva"]).nullable(),
              retificadora: z.boolean().nullable(),
              modelo: z.enum(["completa", "simplificada"]).nullable(),
              situacao: z.enum(["emPreenchimento", "gravadaParaEntrega", "transmitida"]),
              recibo: z.string().nullable(),
              anoAnterior: z.boolean(),
              modificadoEm: z.string(),
              aviso: z.string().nullable(),
            }),
          ),
          total: z.number(),
        },
      },
      async ({ nome, cpf, situacao, ordenar_por }) => {
        const pasta = exigirPasta(r.ctx);
        const arquivos = (await pasta.listar(EXT_DECLARACAO)).slice(0, MAX_DECLARACOES);
        const itens: ItemDeclaracao[] = [];
        for (const a of arquivos) {
          const padrao = RX_NOME_PADRAO.exec(a.nome);
          const item: ItemDeclaracao = {
            arquivo: a.nome,
            cpf: padrao?.[1] ?? null,
            nome: null,
            exercicio: padrao ? Number(padrao[3]) : null,
            tipo: padrao
              ? TIPO_POR_LETRA[(padrao[2] ?? "A").toUpperCase() as keyof typeof TIPO_POR_LETRA]
              : null,
            retificadora: padrao ? (padrao[5] ?? "").toUpperCase() === "RETIF" : null,
            modelo: null,
            situacao: a.nome.toUpperCase().endsWith(".DEC")
              ? "gravadaParaEntrega"
              : "emPreenchimento",
            recibo: null,
            anoAnterior: false,
            modificadoEm: a.modificadoEm,
            aviso: null,
          };
          try {
            const lido = lerArquivo(await pasta.ler(a.nome, EXT_DECLARACAO));
            const dec = interpretarDeclaracao(
              registrosParaModelo(lido.registros, lido.exercicio).declaracao,
            );
            item.exercicio = lido.exercicio;
            item.cpf = dec.identificacao.cpf;
            item.nome = dec.identificacao.nome;
            item.tipo = dec.identificacao.tipoDeclaracao.tipo;
            item.retificadora = dec.identificacao.tipoDeclaracao.retificadora;
            item.modelo =
              dec.resumo.opcaoTributacao === "deducoesLegais" ? "completa" : "simplificada";
          } catch (e) {
            item.aviso = `conteúdo não lido (${e instanceof Error ? e.message : String(e)}); dados tirados do nome do arquivo`;
          }
          if (item.cpf) {
            const recibo = await lerReciboRegistrado(r.ctx, a.nome, item.cpf);
            if (recibo) {
              item.recibo = recibo.recibo;
              item.situacao = "transmitida";
            }
          }
          item.anoAnterior = item.exercicio === EXERCICIO_ATUAL - 1;
          itens.push(item);
        }
        const filtroNome = nome ? semAcento(nome.trim()) : undefined;
        const filtroCpf = cpf ? cpf.replace(/\D/g, "") : undefined;
        const filtrados = itens.filter(
          (i) =>
            (!filtroNome || semAcento(i.nome ?? "").includes(filtroNome)) &&
            (!filtroCpf || i.cpf === filtroCpf) &&
            (!situacao || i.situacao === situacao),
        );
        const chave = (i: ItemDeclaracao) => String(i[ordenar_por] ?? "");
        filtrados.sort(
          (x, y) =>
            chave(x).localeCompare(chave(y), "pt-BR") ||
            x.arquivo.localeCompare(y.arquivo, "pt-BR"),
        );
        const linhas = filtrados.map(
          (i) =>
            `- ${i.arquivo}: ${i.nome ?? "(nome não lido)"}, CPF ${i.cpf ?? "?"}, exercício ${i.exercicio ?? "?"}, ${i.tipo ?? "tipo ?"}${i.retificadora ? " retificadora" : ""}${i.modelo ? `, ${i.modelo}` : ""}, ${ROTULO_SITUACAO[i.situacao]}${i.recibo ? ` (recibo ${i.recibo})` : ""}${i.aviso ? `; ${i.aviso}` : ""}`,
        );
        const anteriores = filtrados.filter((i) => i.anoAnterior);
        const texto = [
          filtrados.length === 0
            ? "Nenhuma declaração encontrada com esses critérios."
            : `Relação de declarações: ${filtrados.length} de ${itens.length}, ordenadas por ${ordenar_por}.`,
          ...(filtrados.length > 0 ? [blocoDeDados("pasta autorizada", linhas.join("\n"))] : []),
          ...(anteriores.length > 0
            ? [
                `Há ${anteriores.length} declaração(ões) do exercício ${EXERCICIO_ATUAL - 1}: use importar_declaracao_anterior para começar a de ${EXERCICIO_ATUAL} com os dados delas.`,
              ]
            : []),
        ].join("\n");
        return { texto, dados: { declaracoes: filtrados, total: filtrados.length } };
      },
    );

    r.ferramenta(
      "verificar_integridade_arquivo",
      {
        titulo: "Verificar integridade do DBK/DEC",
        descricao:
          "Confere os controles do arquivo: número de controle (CRC-32) de cada registro, " +
          "contagens do registro T9 e hash do header. Divergência indica arquivo editado fora do programa ou corrompido.",
        entrada: { arquivo: zNomeArquivo("Arquivo .DBK ou .DEC.") },
        saida: {
          arquivo: z.string(),
          exercicio: z.number(),
          valido: z.boolean(),
          registros: z.number(),
          totalDivergencias: z.number(),
          divergencias: z.array(
            z.object({
              linha: z.number(),
              tipo: z.string(),
              campo: z.string(),
              esperado: z.string(),
              encontrado: z.string(),
            }),
          ),
          variantesHashQueConferem: z.array(z.string()),
          variantesTotalQueConferem: z.array(z.string()),
          controleHeaderConfereComCrc: z.boolean().nullable(),
        },
      },
      async ({ arquivo }) => {
        const { registros, exercicio } = await lerDeclaracaoArquivo(r.ctx, arquivo);
        const rel = verificarControles(registros);
        const divergencias = rel.divergencias.slice(0, MAX_DIVERGENCIAS).map((d) => ({ ...d }));
        const texto = rel.valido
          ? `${arquivo}: controles conferem (${registros.length} registros, CRC de cada linha, T9 e hash do header).`
          : [
              `${arquivo}: ${rel.divergencias.length} divergência(s) nos controles.`,
              ...divergencias.map(
                (d) =>
                  `- linha ${d.linha}, registro ${d.tipo}, campo ${d.campo}: esperado ${d.esperado}, gravado ${d.encontrado}`,
              ),
              "Se o arquivo foi alterado fora do programa oficial, regrave-o com converter_modelo_para_dbk ou abra-o no programa oficial.",
            ].join("\n");
        return {
          texto,
          dados: {
            arquivo,
            exercicio,
            valido: rel.valido,
            registros: registros.length,
            totalDivergencias: rel.divergencias.length,
            divergencias,
            variantesHashQueConferem: [...rel.variantesHashQueConferem],
            variantesTotalQueConferem: [...rel.variantesTotalQueConferem],
            controleHeaderConfereComCrc: rel.controleHeaderConfereComCrc ?? null,
          },
        };
      },
    );
  },
};
