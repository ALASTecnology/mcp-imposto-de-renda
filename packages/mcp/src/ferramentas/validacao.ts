/**
 * Grupo "validacao": dígitos verificadores e pendências da declaração.
 */
import {
  FICHAS,
  podeEntregar,
  separarPendencias,
  validarDeclaracao,
  validarDocumento,
} from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import { carregarDeclaracao, zDeclaracaoJson, zNomeArquivo } from "./comum.js";
import type { GrupoFerramentas } from "./tipos.js";

export const grupoValidacao: GrupoFerramentas = {
  nome: "validacao",
  descricao: "Validação de CPF/CNPJ e pendências da declaração.",
  registrar(r) {
    r.ferramenta(
      "validar_documento",
      {
        titulo: "Validar CPF ou CNPJ",
        descricao:
          "Confere os dígitos verificadores de um CPF (11 dígitos) ou CNPJ (14 dígitos). " +
          "Aceita o número com ou sem pontuação. Não consulta a situação cadastral.",
        entrada: {
          documento: z.string().min(1).max(32).describe("CPF ou CNPJ, com ou sem pontuação."),
        },
        saida: {
          tipo: z.enum(["cpf", "cnpj", "desconhecido"]),
          valido: z.boolean(),
          normalizado: z.string(),
        },
      },
      ({ documento }) => {
        const resultado = validarDocumento(documento);
        const texto =
          resultado.tipo === "desconhecido"
            ? "Documento não reconhecido: informe 11 dígitos (CPF) ou 14 dígitos (CNPJ)."
            : `${resultado.tipo.toUpperCase()} ${resultado.valido ? "válido" : "inválido"}.`;
        return { texto, dados: { ...resultado } };
      },
    );

    r.ferramenta(
      "validar_declaracao",
      {
        titulo: "Validar a declaração (pendências)",
        descricao:
          "Aplica as regras de consistência equivalentes às críticas do programa oficial e lista " +
          "as pendências: 'erro' impede a entrega, 'aviso' indica risco de malha fina. Informe a " +
          "declaração em JSON do modelo ou o nome de um DBK/DEC/JSON da pasta autorizada.",
        entrada: {
          declaracao: zDeclaracaoJson.optional(),
          arquivo: zNomeArquivo("Arquivo da declaração (.DBK, .DEC ou .json).").optional(),
        },
        saida: {
          origem: z.string(),
          podeEntregar: z.boolean(),
          totalErros: z.number(),
          totalAvisos: z.number(),
          pendencias: z.array(
            z.object({
              codigo: z.string(),
              gravidade: z.enum(["erro", "aviso"]),
              ficha: z.string(),
              nomeFicha: z.string(),
              caminho: z.string(),
              mensagem: z.string(),
            }),
          ),
          avisosConversao: z.array(z.string()),
        },
      },
      async (args) => {
        const carregada = await carregarDeclaracao(r.ctx, args);
        const pendencias = validarDeclaracao(carregada.declaracao);
        const { erros, avisos } = separarPendencias(pendencias);
        const ok = podeEntregar(pendencias);
        const lista = pendencias.map((p) => ({ ...p, nomeFicha: FICHAS[p.ficha] }));
        const texto = [
          `${ok ? "Sem erros impeditivos" : `${erros.length} erro(s) impedem a entrega`}; ${avisos.length} aviso(s).`,
          ...lista.map(
            (p) => `- [${p.gravidade}] ${p.nomeFicha} (${p.caminho}): ${p.mensagem} (${p.codigo})`,
          ),
          ...carregada.avisos.map((a) => `Conversão: ${a}`),
        ].join("\n");
        return {
          texto,
          dados: {
            origem: carregada.origem,
            podeEntregar: ok,
            totalErros: erros.length,
            totalAvisos: avisos.length,
            pendencias: lista,
            avisosConversao: [...carregada.avisos],
          },
        };
      },
    );
  },
};
