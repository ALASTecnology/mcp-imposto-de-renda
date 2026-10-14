/**
 * Grupo "tabelas": consulta às tabelas de códigos do exercício (dependentes, pagamentos, bens,
 * municípios, países, ocupações e outras).
 */
import { buscarCodigo, listar, NOMES_TABELAS, type NomeTabela } from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import { paraJson } from "../serializacao.js";
import type { GrupoFerramentas } from "./tipos.js";

const zTabela = z
  .enum(NOMES_TABELAS as unknown as [NomeTabela, ...NomeTabela[]])
  .describe("Nome da tabela de códigos do exercício 2026.");

function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function linha(e: { codigo: string; descricao: string } & Record<string, unknown>): string {
  const grupo = typeof e.grupo === "string" ? `${e.grupo}.` : "";
  return `${grupo}${e.codigo}: ${e.descricao}`;
}

export const grupoTabelas: GrupoFerramentas = {
  nome: "tabelas",
  descricao: "Tabelas de códigos do programa (dependentes, pagamentos, bens, municípios...).",
  registrar(r) {
    r.ferramenta(
      "listar_tabela",
      {
        titulo: "Listar tabela de códigos",
        descricao:
          "Lista as entradas de uma tabela de códigos do exercício 2026, com filtro opcional por " +
          "texto (sem diferenciar acentos) e paginação. Use para achar o código certo antes de preencher uma ficha.",
        entrada: {
          tabela: zTabela,
          filtro: z
            .string()
            .max(100)
            .optional()
            .describe("Trecho do código ou da descrição (ex.: 'plano de saude', 'apartamento')."),
          limite: z
            .number()
            .int()
            .min(1)
            .max(500)
            .default(100)
            .describe("Máximo de itens (1 a 500)."),
          deslocamento: z.number().int().min(0).default(0).describe("Itens a pular, para paginar."),
        },
        saida: {
          tabela: z.string(),
          total: z.number().describe("Total de itens que atendem ao filtro."),
          itens: z.array(z.record(z.string(), z.unknown())),
        },
      },
      ({ tabela, filtro, limite, deslocamento }) => {
        const todos = listar(tabela) as readonly ({ codigo: string; descricao: string } & Record<
          string,
          unknown
        >)[];
        const f = filtro ? normalizar(filtro) : undefined;
        const filtrados = f
          ? todos.filter((e) =>
              normalizar(`${linha(e)} ${String(e.descricaoCompleta ?? "")}`).includes(f),
            )
          : todos;
        const pagina = filtrados.slice(deslocamento, deslocamento + limite);
        const texto =
          pagina.length === 0
            ? `Nenhum item em ${tabela}${filtro ? ` com "${filtro}"` : ""}.`
            : `${tabela}: ${filtrados.length} item(ns)${filtro ? ` com "${filtro}"` : ""}, mostrando ${pagina.length}.\n${pagina.map(linha).join("\n")}`;
        return {
          texto,
          dados: {
            tabela,
            total: filtrados.length,
            itens: pagina.map((e) => paraJson(e) as Record<string, never>),
          },
        };
      },
    );

    r.ferramenta(
      "buscar_codigo",
      {
        titulo: "Buscar código em tabela",
        descricao:
          "Busca um código exato numa tabela do exercício 2026. Em bens-direitos use 'GG.CC' " +
          "(grupo e código, ex.: '01.11'); nos fundos, o CNPJ com ou sem pontuação.",
        entrada: {
          tabela: zTabela,
          codigo: z.string().min(1).max(30).describe("Código a buscar."),
        },
        saida: {
          tabela: z.string(),
          codigo: z.string(),
          encontrado: z.boolean(),
          entrada: z.record(z.string(), z.unknown()).nullable(),
        },
      },
      ({ tabela, codigo }) => {
        const e = buscarCodigo(tabela, codigo) as
          | ({ codigo: string; descricao: string } & Record<string, unknown>)
          | undefined;
        return {
          texto: e
            ? linha(e)
            : `Código "${codigo}" não existe na tabela ${tabela}. Use listar_tabela com filtro para procurar.`,
          dados: {
            tabela,
            codigo,
            encontrado: e !== undefined,
            entrada: e ? (paraJson(e) as Record<string, never>) : null,
          },
        };
      },
    );
  },
};
