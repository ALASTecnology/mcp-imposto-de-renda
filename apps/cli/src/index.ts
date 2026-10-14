import { createServer, VERSAO_SERVIDOR } from "@autoir/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { AJUDA, interpretarArgs } from "./args.js";

// stdout é exclusivo do protocolo MCP: qualquer mensagem humana vai para stderr. Os logs nunca
// levam conteúdo da declaração: só eventos do processo, nome de ferramenta e classe do erro.
function log(mensagem: string): void {
  process.stderr.write(`autoir-mcp: ${mensagem}\n`);
}

function classeDoErro(e: unknown): string {
  return e instanceof Error ? e.name : typeof e;
}

async function main(): Promise<void> {
  const args = interpretarArgs(process.argv.slice(2));
  switch (args.acao) {
    case "ajuda":
      process.stderr.write(AJUDA);
      return;
    case "versao":
      process.stderr.write(`${VERSAO_SERVIDOR}\n`);
      return;
    case "erro":
      process.stderr.write(`autoir-mcp: ${args.mensagem}\n\n${AJUDA}`);
      process.exitCode = 2;
      return;
    case "iniciar":
      break;
  }

  const server = createServer({
    diretorioAutorizado: args.diretorio,
    somenteLeitura: args.somenteLeitura,
    registrarErro: (ferramenta, erro) => log(`falha em ${ferramenta} (${classeDoErro(erro)})`),
  });
  const transport = new StdioServerTransport();

  let encerrando = false;
  const encerrar = async (motivo: string): Promise<void> => {
    if (encerrando) return;
    encerrando = true;
    log(`encerrando (${motivo})`);
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
  transport.onclose = () => void encerrar("transporte fechado");

  await server.connect(transport);
  log(`pronto (versão ${VERSAO_SERVIDOR}${args.somenteLeitura ? ", somente leitura" : ""})`);
}

main().catch((e: unknown) => {
  log(`erro fatal (${classeDoErro(e)})`);
  process.exit(1);
});
