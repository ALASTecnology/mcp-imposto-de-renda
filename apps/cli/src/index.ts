import { createServer, VERSAO_SERVIDOR } from "@autoir/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { AJUDA, interpretarArgs } from "./args.js";

// stdout é exclusivo do protocolo MCP: qualquer mensagem humana vai para stderr.
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

  const server = createServer(args.diretorio === undefined ? {} : { diretorio: args.diretorio });
  const transport = new StdioServerTransport();

  let encerrando = false;
  const encerrar = async (): Promise<void> => {
    if (encerrando) return;
    encerrando = true;
    await server.close();
    process.exit(0);
  };
  process.on("SIGINT", () => void encerrar());
  process.on("SIGTERM", () => void encerrar());
  process.stdin.on("end", () => void encerrar());

  await server.connect(transport);
}

main().catch((e: unknown) => {
  process.stderr.write(`autoir-mcp: erro fatal: ${e instanceof Error ? e.stack : String(e)}\n`);
  process.exit(1);
});
