import { accessSync, constants, statSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";

export const AJUDA = `Uso: mcp-imposto-de-renda --dir <pasta> [--somente-leitura]

Sobe o servidor MCP Imposto de Renda via stdio (JSON-RPC em stdin/stdout). Roda só na sua
máquina e não faz chamadas de rede. Não é serviço oficial da Receita Federal.

Opções:
  --dir <pasta>       Pasta autorizada (obrigatória): o único lugar que o
                      servidor pode ler e gravar. Precisa existir e, fora do
                      modo somente leitura, permitir gravação.
  --somente-leitura   Desliga as ferramentas que gravam arquivos.
  --versao            Mostra a versão e sai.
  --ajuda             Mostra esta ajuda e sai.

Logs e mensagens vão para stderr; stdout é exclusivo do protocolo MCP.
`;

export type ResultadoArgs =
  | { readonly acao: "iniciar"; readonly diretorio: string; readonly somenteLeitura: boolean }
  | { readonly acao: "ajuda" }
  | { readonly acao: "versao" }
  | { readonly acao: "erro"; readonly mensagem: string };

function traduzirErroParse(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  const opcao = /'(-{1,2}[^'\s]+)/.exec(msg)?.[1];
  if (/Unknown option/i.test(msg)) return `opção desconhecida: ${opcao ?? msg}`;
  if (/argument missing/i.test(msg))
    return `a opção ${opcao ?? ""} exige um valor`.replace("  ", " ");
  if (/Unexpected argument|positional/i.test(msg)) return "argumento inesperado; use --dir <pasta>";
  return `argumentos inválidos (${msg})`;
}

/** Interpreta a linha de comando. Não tem efeitos colaterais além de consultar o disco. */
export function interpretarArgs(
  argv: readonly string[],
  cwd: string = process.cwd(),
): ResultadoArgs {
  let valores: {
    dir?: string | undefined;
    "somente-leitura"?: boolean | undefined;
    versao?: boolean | undefined;
    ajuda?: boolean | undefined;
    help?: boolean | undefined;
    version?: boolean | undefined;
  };
  try {
    ({ values: valores } = parseArgs({
      args: [...argv],
      options: {
        dir: { type: "string" },
        "somente-leitura": { type: "boolean" },
        versao: { type: "boolean" },
        ajuda: { type: "boolean" },
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
      },
      strict: true,
      allowPositionals: false,
    }));
  } catch (e) {
    return { acao: "erro", mensagem: traduzirErroParse(e) };
  }

  if (valores.ajuda || valores.help) return { acao: "ajuda" };
  if (valores.versao || valores.version) return { acao: "versao" };
  if (valores.dir === undefined) return { acao: "erro", mensagem: "--dir é obrigatório" };
  if (valores.dir.trim() === "") return { acao: "erro", mensagem: "--dir não pode ser vazio" };

  const somenteLeitura = valores["somente-leitura"] ?? false;
  const absoluto = resolve(cwd, valores.dir);
  let ehDiretorio = false;
  try {
    ehDiretorio = statSync(absoluto).isDirectory();
  } catch {
    return { acao: "erro", mensagem: `--dir: pasta não encontrada: ${absoluto}` };
  }
  if (!ehDiretorio) return { acao: "erro", mensagem: `--dir: não é uma pasta: ${absoluto}` };
  try {
    accessSync(absoluto, somenteLeitura ? constants.R_OK : constants.R_OK | constants.W_OK);
  } catch {
    return {
      acao: "erro",
      mensagem: somenteLeitura
        ? `--dir: sem permissão de leitura: ${absoluto}`
        : `--dir: sem permissão de gravação: ${absoluto} (use --somente-leitura para só ler)`,
    };
  }
  return { acao: "iniciar", diretorio: absoluto, somenteLeitura };
}
