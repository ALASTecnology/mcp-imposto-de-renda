import { validarDocumento } from "@autoir/core";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export const NOME_SERVIDOR = "autoir";
export const VERSAO_SERVIDOR = "0.0.0";

export interface OpcoesServidor {
  /** Pasta autorizada para leitura e escrita de arquivos da declaração. */
  readonly diretorio?: string;
}

/**
 * Cria o servidor MCP do AutoIR com todas as tools registradas.
 * Não abre transporte: quem chama decide (stdio no CLI, memória nos testes).
 */
export function createServer(_opcoes: OpcoesServidor = {}): McpServer {
  const server = new McpServer(
    { name: NOME_SERVIDOR, version: VERSAO_SERVIDOR },
    {
      instructions:
        "AutoIR roda localmente e apoia o preenchimento da declaração de IRPF. " +
        "Não é serviço oficial da Receita Federal.",
    },
  );

  server.registerTool(
    "validar_documento",
    {
      title: "Validar CPF ou CNPJ",
      description:
        "Confere os dígitos verificadores de um CPF (11 dígitos) ou CNPJ (14 dígitos). " +
        "Aceita o número com ou sem pontuação. Não consulta a situação cadastral.",
      inputSchema: {
        documento: z.string().min(1).max(32).describe("CPF ou CNPJ, com ou sem pontuação"),
      },
      outputSchema: {
        tipo: z.enum(["cpf", "cnpj", "desconhecido"]),
        valido: z.boolean(),
        normalizado: z.string(),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ documento }) => {
      const resultado = validarDocumento(documento);
      const texto =
        resultado.tipo === "desconhecido"
          ? "Documento não reconhecido: informe 11 dígitos (CPF) ou 14 dígitos (CNPJ)."
          : `${resultado.tipo.toUpperCase()} ${resultado.valido ? "válido" : "inválido"}.`;
      return {
        content: [{ type: "text", text: texto }],
        structuredContent: { ...resultado },
      };
    },
  );

  return server;
}
