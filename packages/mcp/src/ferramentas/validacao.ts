/**
 * Grupo "validacao": dígitos verificadores e pendências da declaração.
 */
import {
  FICHAS,
  podeEntregar,
  separarPendencias,
  TIPOS_CAMPO,
  validarCampo,
  validarDeclaracao,
  validarDocumento,
} from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import { carregarDeclaracao, zDeclaracaoJson, zNomeArquivo } from "./comum.js";
import type { GrupoFerramentas } from "./tipos.js";

export const grupoValidacao: GrupoFerramentas = {
  nome: "validacao",
  descricao: "Validação de CPF, CNPJ, recibo, CEP, contatos, Renavam, conta bancária e pendências da declaração.",
  registrar(r) {
    r.ferramenta(
      "validar_documento",
      {
        titulo: "Validar CPF, CNPJ e outros campos",
        descricao:
          "Confere o formato e o dígito verificador de um campo como o programa oficial faz na " +
          "digitação. Sem `tipo`, detecta CPF (11 dígitos) ou CNPJ (14 dígitos) pelo tamanho. " +
          "Com `tipo`: 'recibo' (12 dígitos), 'cep' (8 dígitos), 'telefone' (DDD e número), " +
          "'email', 'nome' (regras da ficha Identificação), 'data' (dd/mm/aaaa), 'renavam' " +
          "(DV módulo 11) e 'conta_bancaria' (banco da rede autorizada, tamanhos e DV público " +
          "do banco; informe `banco` e `agencia`). Aceita pontuação. Não consulta a situação " +
          "cadastral nem base externa.",
        entrada: {
          documento: z.string().min(1).max(120).describe("Valor a validar, com ou sem pontuação."),
          tipo: z.enum(TIPOS_CAMPO).optional().describe("Tipo do campo; omita para CPF ou CNPJ."),
          banco: z.string().max(5).optional().describe("Código do banco, para 'conta_bancaria'."),
          agencia: z.string().max(10).optional().describe("Agência sem DV, para 'conta_bancaria'."),
          tabela: z
            .enum(["bancos", "bancos-bens"])
            .optional()
            .describe(
              "Para 'conta_bancaria': 'bancos' (restituição e débito, padrão) ou 'bancos-bens' (ficha Bens e Direitos).",
            ),
        },
        saida: {
          tipo: z.enum(["desconhecido", ...TIPOS_CAMPO]),
          valido: z.boolean(),
          normalizado: z.string(),
          mensagem: z.string().optional(),
        },
      },
      ({ documento, tipo, banco, agencia, tabela }) => {
        if (tipo !== undefined) {
          const c = validarCampo(tipo, documento, { banco, agencia, tabela });
          return {
            texto: `${c.valido ? "Válido" : "Inválido"} (${c.tipo}): ${c.mensagem}`,
            dados: { ...c },
          };
        }
        const resultado = validarDocumento(documento);
        const texto =
          resultado.tipo === "desconhecido"
            ? "Documento não reconhecido: informe 11 dígitos (CPF) ou 14 dígitos (CNPJ), ou indique o `tipo` do campo."
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
