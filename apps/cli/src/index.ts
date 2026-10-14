import {
  createServer,
  ferramentasRegistradas,
  GRUPOS,
  VERSAO_SERVIDOR,
} from "@mcp-imposto-de-renda/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import { ajuda, interpretarArgs } from "./args.js";

// stdout é exclusivo do protocolo MCP: qualquer mensagem humana vai para stderr. Os logs nunca
// levam conteúdo da declaração: só eventos do processo, nome de ferramenta e classe do erro.
function log(mensagem: string): void {
  process.stderr.write(`mcp-imposto-de-renda: ${mensagem}\n`);
}

/** Tempo máximo de espera pelas chamadas em andamento ao encerrar. */
const PRAZO_PENDENTES_MS = 30_000;

function classeDoErro(e: unknown): string {
  return e instanceof Error ? e.name : typeof e;
}

async function main(): Promise<void> {
  const args = interpretarArgs(process.argv.slice(2));
  switch (args.acao) {
    case "ajuda":
      process.stderr.write(ajuda());
      return;
    case "versao":
      process.stderr.write(`${VERSAO_SERVIDOR}\n`);
      return;
    case "erro":
      process.stderr.write(`mcp-imposto-de-renda: ${args.mensagem}\n\n${ajuda()}`);
      process.exitCode = 2;
      return;
    case "iniciar":
      break;
  }

  const escolhidos = args.grupos;
  const grupos = escolhidos ? GRUPOS.filter((g) => escolhidos.includes(g.nome)) : undefined;
  const server = createServer({
    perfil: args.perfil,
    somenteLeitura: args.somenteLeitura,
    ...(grupos ? { grupos } : {}),
    diretorioAutorizado: args.diretorio,
    registrarErro: (ferramenta, erro) => log(`falha em ${ferramenta} (${classeDoErro(erro)})`),
  });
  const transport = new StdioServerTransport();

  // Requisições recebidas e ainda sem resposta: ao fechar o stdin, o processo só sai depois de
  // respondê-las (com prazo), para não abandonar uma gravação no meio (revisão M4).
  const pendentes = new Set<string | number>();
  let aoEsvaziar: (() => void) | undefined;
  const esperarPendentes = (prazoMs: number) =>
    pendentes.size === 0
      ? Promise.resolve()
      : new Promise<void>((ok) => {
          const t = setTimeout(ok, prazoMs);
          aoEsvaziar = () => {
            clearTimeout(t);
            ok();
          };
        });

  let encerrando = false;
  const encerrar = async (motivo: string): Promise<void> => {
    if (encerrando) return;
    encerrando = true;
    log(`encerrando (${motivo})`);
    await esperarPendentes(PRAZO_PENDENTES_MS);
    try {
      await server.close();
    } catch {
      /* o processo vai terminar de qualquer jeito */
    }
    process.exit(0);
  };
  process.on("SIGINT", () => void encerrar("SIGINT"));
  process.on("SIGTERM", () => void encerrar("SIGTERM"));
  process.stdin.on("end", () => void encerrar("stdin fechado"));
  process.stdin.on("close", () => void encerrar("stdin fechado"));

  await server.connect(transport);
  // Instrumenta o transporte depois de conectado (o servidor já instalou o seu onmessage).
  const receber = transport.onmessage;
  transport.onmessage = (msg: JSONRPCMessage) => {
    if ("method" in msg && "id" in msg) pendentes.add(msg.id);
    receber?.(msg);
  };
  const enviar = transport.send.bind(transport);
  transport.send = async (msg: JSONRPCMessage) => {
    await enviar(msg);
    const id = !("method" in msg) && "id" in msg ? msg.id : undefined;
    if (id !== undefined && pendentes.delete(id) && pendentes.size === 0) aoEsvaziar?.();
  };
  transport.onclose = () => void encerrar("transporte fechado");
  const total = ferramentasRegistradas(server).length;
  log(
    `pronto (versão ${VERSAO_SERVIDOR}, perfil ${args.perfil}, ${total} ferramentas${args.somenteLeitura ? ", somente leitura" : ""})`,
  );
}

main().catch((e: unknown) => {
  log(`erro fatal (${classeDoErro(e)})`);
  process.exit(1);
});
