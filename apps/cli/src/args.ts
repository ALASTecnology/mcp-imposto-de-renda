import { statSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

export const AJUDA = `Uso: autoir-mcp [--dir <pasta>]

Sobe o servidor MCP AutoIR via stdio (JSON-RPC em stdin/stdout).

Opções:
  --dir <pasta>   Pasta autorizada para os arquivos da declaração
  -h, --help      Mostra esta ajuda
  -v, --version   Mostra a versão
`;

export type ResultadoArgs =
  | { readonly acao: "iniciar"; readonly diretorio?: string }
  | { readonly acao: "ajuda" }
  | { readonly acao: "versao" }
  | { readonly acao: "erro"; readonly mensagem: string };

/** Interpreta a linha de comando. Não tem efeitos colaterais além de consultar o disco. */
export function interpretarArgs(
  argv: readonly string[],
  cwd: string = process.cwd(),
): ResultadoArgs {
  let valores: {
    dir?: string | undefined;
    help?: boolean | undefined;
    version?: boolean | undefined;
  };
  try {
    ({ values: valores } = parseArgs({
      args: [...argv],
      options: {
        dir: { type: "string" },
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
      },
      strict: true,
      allowPositionals: false,
    }));
  } catch (e) {
    return { acao: "erro", mensagem: e instanceof Error ? e.message : String(e) };
  }

  if (valores.help) return { acao: "ajuda" };
  if (valores.version) return { acao: "versao" };
  if (valores.dir === undefined) return { acao: "iniciar" };

  if (valores.dir.trim() === "") {
    return { acao: "erro", mensagem: "--dir não pode ser vazio" };
  }
  const absoluto = resolve(cwd, valores.dir);
  let ehDiretorio = false;
  try {
    ehDiretorio = statSync(absoluto).isDirectory();
  } catch {
    return { acao: "erro", mensagem: `--dir: pasta não encontrada: ${absoluto}` };
  }
  if (!ehDiretorio) {
    return { acao: "erro", mensagem: `--dir: não é uma pasta: ${absoluto}` };
  }
  return { acao: "iniciar", diretorio: absoluto };
}
