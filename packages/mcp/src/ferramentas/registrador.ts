/**
 * Implementação de `RegistroFerramentas` sobre o `McpServer` do SDK.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import { mensagemDeErro } from "../erros.js";
import type {
  ContextoFerramentas,
  DefinicaoFerramenta,
  Executor,
  RegistroFerramentas,
} from "./tipos.js";

/** Ferramenta que só lê ou calcula: não altera nada e não fala com o mundo externo. */
export const ANOTACOES_LEITURA: ToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

/** Ferramenta que grava na pasta autorizada (sobrescreve, com backup automático). */
export const ANOTACOES_ESCRITA: ToolAnnotations = {
  readOnlyHint: false,
  destructiveHint: true,
  idempotentHint: true,
  openWorldHint: false,
};

export function criarRegistroFerramentas(
  server: McpServer,
  ctx: ContextoFerramentas,
  nomesRegistrados: string[],
): RegistroFerramentas {
  return {
    ctx,
    ferramenta<I extends z.ZodRawShape, O extends z.ZodRawShape>(
      nome: string,
      def: DefinicaoFerramenta<I, O>,
      executar: Executor<I>,
    ): void {
      if (def.escreve && ctx.somenteLeitura) return;
      const anotacoes: ToolAnnotations = {
        ...(def.escreve ? ANOTACOES_ESCRITA : ANOTACOES_LEITURA),
        ...def.anotacoes,
        title: def.titulo,
      };
      const executarSeguro = async (args: unknown): Promise<CallToolResult> => {
        try {
          const r = await executar(args as z.output<z.ZodObject<I>>);
          return { content: [{ type: "text", text: r.texto }], structuredContent: r.dados };
        } catch (e) {
          ctx.registrarErro?.(nome, e);
          return { content: [{ type: "text", text: mensagemDeErro(e, nome) }], isError: true };
        }
      };
      server.registerTool(
        nome,
        {
          title: def.titulo,
          description: def.descricao,
          inputSchema: def.entrada,
          outputSchema: def.saida,
          annotations: anotacoes,
        },
        // O SDK já validou `args` contra `def.entrada` antes de chamar.
        executarSeguro as never,
      );
      nomesRegistrados.push(nome);
    },
  };
}
