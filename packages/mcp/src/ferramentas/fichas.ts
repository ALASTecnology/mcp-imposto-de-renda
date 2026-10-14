/**
 * Grupo "fichas": leitura de uma ficha específica da declaração, para o LLM trabalhar com
 * pouco contexto em vez do modelo inteiro.
 */
import { FICHAS } from "@autoir/core";
import { z } from "zod";
import { FICHAS_CONVERTIDAS } from "../conversao/dbk-modelo.js";
import { objetoJson } from "../serializacao.js";
import { blocoDeDados, carregarDeclaracao, zNomeArquivo } from "./comum.js";
import type { GrupoFerramentas } from "./tipos.js";

export const grupoFichas: GrupoFerramentas = {
  nome: "fichas",
  descricao: "Consulta de fichas da declaração.",
  exigePasta: true,
  registrar(r) {
    r.ferramenta(
      "ler_ficha",
      {
        titulo: "Ler uma ficha da declaração",
        descricao:
          "Devolve só uma ficha (identificação, dependentes, rendimentos de PJ, pagamentos, bens " +
          "ou dívidas) de um DBK/DEC/JSON da pasta autorizada, no formato do modelo (centavos).",
        entrada: {
          arquivo: zNomeArquivo("Arquivo .DBK, .DEC ou .json."),
          ficha: z.enum(FICHAS_CONVERTIDAS).describe("Ficha a ler."),
        },
        saida: {
          ficha: z.string(),
          nome: z.string(),
          itens: z.number().describe("Quantidade de itens (1 para identificação)."),
          conteudo: z.unknown(),
        },
      },
      async ({ arquivo, ficha }) => {
        const { declaracao } = await carregarDeclaracao(r.ctx, { arquivo });
        const conteudo = objetoJson({ v: declaracao[ficha] }).v ?? null;
        const itens = Array.isArray(conteudo) ? conteudo.length : 1;
        return {
          texto: `${FICHAS[ficha]} (${itens} item(ns)):\n${blocoDeDados(arquivo, JSON.stringify(conteudo, null, 2))}`,
          dados: { ficha, nome: FICHAS[ficha], itens, conteudo },
        };
      },
    );
  },
};
