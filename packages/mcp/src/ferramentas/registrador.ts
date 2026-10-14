/**
 * Implementação de `RegistroFerramentas` sobre o `McpServer` do SDK.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult, ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import { mensagemDeErro } from "../erros.js";
import { deveRegistrar, infoFerramenta, PERFIS, type Perfil } from "./perfis.js";
import type {
  ContextoFerramentas,
  DefinicaoFerramenta,
  Executor,
  NomeGrupo,
  RegistroFerramentas,
} from "./tipos.js";

/** Ferramenta que só lê ou calcula: não altera nada e não fala com o mundo externo. */
export const ANOTACOES_LEITURA: ToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

/**
 * Ferramenta que grava na pasta autorizada (sobrescreve, com backup automático). Não é
 * idempotente por padrão: repetir uma inclusão ou importação duplica lançamentos e consome
 * cópias de segurança (revisão B5).
 */
export const ANOTACOES_ESCRITA: ToolAnnotations = {
  readOnlyHint: false,
  destructiveHint: true,
  idempotentHint: false,
  openWorldHint: false,
};

/** Extensões dos arquivos que as ferramentas leem e gravam na pasta (ver `EXT_LISTAGEM`). */
const ARQUIVO_DA_PASTA = /\.(?:dbk|dec|json|txt)$/i;

/**
 * Textos de primeiro nível dos argumentos com cara de arquivo da pasta (`arquivo`,
 * `arquivo_destino`, `arquivo_base`...): os que entram na fila antes de a ferramenta rodar. O nome
 * de uma cópia de segurança (`.bak`) fica fora, para que o destino derivado dela trave primeiro.
 */
function nomesCitados(args: unknown): string[] {
  if (typeof args !== "object" || args === null) return [];
  return Object.values(args).filter(
    (v): v is string => typeof v === "string" && ARQUIVO_DA_PASTA.test(v),
  );
}

export function criarRegistroFerramentas(
  server: McpServer,
  ctx: ContextoFerramentas,
  nomesRegistrados: string[],
  grupo: NomeGrupo,
  /** Recorte do catálogo (ver `perfis.ts`). Padrão: `completo`. */
  perfil: Perfil = PERFIS.completo,
): RegistroFerramentas {
  return {
    ctx,
    ferramenta<I extends z.ZodRawShape, O extends z.ZodRawShape>(
      nome: string,
      def: DefinicaoFerramenta<I, O>,
      executar: Executor<I>,
    ): void {
      if (!deveRegistrar(perfil, ctx.somenteLeitura, infoFerramenta(nome, grupo, def))) return;
      const anotacoes: ToolAnnotations = {
        ...(def.escreve ? ANOTACOES_ESCRITA : ANOTACOES_LEITURA),
        ...def.anotacoes,
        title: def.titulo,
      };
      const rodar = async (args: unknown) => executar(args as z.output<z.ZodObject<I>>);
      const executarSeguro = async (
        args: unknown,
        extra?: { signal?: AbortSignal },
      ): Promise<CallToolResult> => {
        try {
          // Ferramenta que grava roda inteira (ler, alterar e gravar) na fila dos arquivos que
          // cita: duas chamadas simultâneas no mesmo DBK não perdem alteração (revisão 2, achado 1).
          const pasta = ctx.pasta;
          const r =
            def.escreve && pasta
              ? await pasta.transacao(
                  nomesCitados(args),
                  () => rodar(args),
                  // Cancelada pelo cliente, a gravação desiste antes do rename (achado 6).
                  extra?.signal ? { signal: extra.signal } : {},
                )
              : await rodar(args);
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
