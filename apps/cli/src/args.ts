import { accessSync, constants, statSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import {
  catalogoFerramentas,
  ehNomePerfil,
  GRUPOS,
  NOMES_PERFIS,
  type NomeGrupo,
  type NomePerfil,
} from "@mcp-imposto-de-renda/mcp";

/** Variável de ambiente equivalente a --perfil (a opção na linha de comando vale mais). */
export const VARIAVEL_PERFIL = "MCP_IMPOSTO_DE_RENDA_PERFIL";

const NOMES_GRUPOS: readonly NomeGrupo[] = GRUPOS.map((g) => g.nome);

const RESUMO_PERFIS: Readonly<Record<NomePerfil, string>> = {
  completo: "tudo (padrão)",
  essencial: "a declaração inteira, sem atalhos repetidos",
  consulta: "só leitura e cálculo, nada grava",
};

function montarAjuda(): string {
  const perfis = NOMES_PERFIS.map((p) => {
    const n = String(catalogoFerramentas({ perfil: p }).length).padStart(3);
    return `                        ${p.padEnd(10)} ${n} ferramentas: ${RESUMO_PERFIS[p]}`;
  }).join("\n");
  const contagem = new Map<NomeGrupo, number>();
  for (const f of catalogoFerramentas()) contagem.set(f.grupo, (contagem.get(f.grupo) ?? 0) + 1);
  const grupos = NOMES_GRUPOS.map((g) => `${g} (${contagem.get(g) ?? 0})`);
  const linhas: string[] = [];
  let linha = "";
  for (const g of grupos) {
    const proxima = linha ? `${linha}, ${g}` : g;
    if (proxima.length > 54 && linha) {
      linhas.push(`${linha},`);
      linha = g;
    } else linha = proxima;
  }
  linhas.push(linha);
  return `Uso: mcp-imposto-de-renda --dir <pasta> [--perfil <nome>] [--grupos <lista>]
                            [--sem-grupos <lista>] [--somente-leitura]

Sobe o servidor MCP Imposto de Renda via stdio (JSON-RPC em stdin/stdout). Roda só na sua
máquina e não faz chamadas de rede. Não é serviço oficial da Receita Federal.

Opções:
  --dir <pasta>       Pasta autorizada (obrigatória): o único lugar que o
                      servidor pode ler e gravar. Precisa existir e, fora do
                      modo somente leitura, permitir gravação.
  --perfil <nome>     Quais ferramentas expor (padrão: completo). Também pode
                      vir da variável ${VARIAVEL_PERFIL}.
${perfis}
                      Em clientes com limite de ferramentas (VS Code: 128;
                      Windsurf: 100), use essencial.
  --grupos <lista>    Expõe só estes grupos (nomes separados por vírgula).
  --sem-grupos <lista>
                      Tira estes grupos. Combina com --perfil e --grupos.
                      Grupos (ferramentas no perfil completo):
${linhas.map((l) => `                        ${l}`).join("\n")}
  --somente-leitura   Desliga as ferramentas que gravam arquivos.
  --versao            Mostra a versão e sai.
  --ajuda             Mostra esta ajuda e sai.

Logs e mensagens vão para stderr; stdout é exclusivo do protocolo MCP.
`;
}

let ajudaMontada: string | undefined;

/** Texto do --ajuda. Montado só na primeira chamada: contar as ferramentas exige o catálogo. */
export function ajuda(): string {
  ajudaMontada ??= montarAjuda();
  return ajudaMontada;
}

export type ResultadoArgs =
  | {
      readonly acao: "iniciar";
      readonly diretorio: string;
      readonly somenteLeitura: boolean;
      readonly perfil: NomePerfil;
      /** Grupos escolhidos com --grupos ou --sem-grupos; ausente = todos. */
      readonly grupos?: readonly NomeGrupo[];
    }
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
  env: Readonly<Record<string, string | undefined>> = process.env,
): ResultadoArgs {
  let valores: {
    dir?: string | undefined;
    perfil?: string | undefined;
    grupos?: string | undefined;
    "sem-grupos"?: string | undefined;
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
        perfil: { type: "string" },
        grupos: { type: "string" },
        "sem-grupos": { type: "string" },
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
  const perfil = escolherPerfil(valores.perfil, env[VARIAVEL_PERFIL]);
  if (typeof perfil !== "string") return perfil;
  const grupos = escolherGrupos(valores.grupos, valores["sem-grupos"]);
  if (grupos !== undefined && "acao" in grupos) return grupos;
  // O perfil consulta não grava nada: basta poder ler a pasta.
  const soLe = somenteLeitura || perfil === "consulta";
  const absoluto = resolve(cwd, valores.dir);
  let ehDiretorio = false;
  try {
    ehDiretorio = statSync(absoluto).isDirectory();
  } catch {
    return { acao: "erro", mensagem: `--dir: pasta não encontrada: ${absoluto}` };
  }
  if (!ehDiretorio) return { acao: "erro", mensagem: `--dir: não é uma pasta: ${absoluto}` };
  try {
    accessSync(absoluto, soLe ? constants.R_OK : constants.R_OK | constants.W_OK);
  } catch {
    return {
      acao: "erro",
      mensagem: soLe
        ? `--dir: sem permissão de leitura: ${absoluto}`
        : `--dir: sem permissão de gravação: ${absoluto} (use --somente-leitura para só ler)`,
    };
  }
  return {
    acao: "iniciar",
    diretorio: absoluto,
    somenteLeitura,
    perfil,
    ...(grupos === undefined ? {} : { grupos }),
  };
}

type Erro = { readonly acao: "erro"; readonly mensagem: string };

function lista(nomes: readonly string[]): string {
  return nomes.length < 2
    ? nomes.join("")
    : `${nomes.slice(0, -1).join(", ")} ou ${nomes[nomes.length - 1]}`;
}

function escolherPerfil(
  opcao: string | undefined,
  variavel: string | undefined,
): NomePerfil | Erro {
  const [origem, bruto] =
    opcao !== undefined ? ["--perfil", opcao] : [VARIAVEL_PERFIL, variavel ?? ""];
  const nome = bruto.trim().toLowerCase();
  if (nome === "" && origem === VARIAVEL_PERFIL) return "completo";
  if (ehNomePerfil(nome)) return nome;
  return {
    acao: "erro",
    mensagem: `${origem}: perfil desconhecido "${bruto.trim()}"; use ${lista(NOMES_PERFIS)}`,
  };
}

function nomesDeGrupo(opcao: string, valor: string): NomeGrupo[] | Erro {
  const nomes = valor
    .split(",")
    .map((n) => n.trim().toLowerCase())
    .filter((n) => n !== "");
  if (nomes.length === 0) return { acao: "erro", mensagem: `${opcao}: informe ao menos um grupo` };
  for (const n of nomes) {
    if (!(NOMES_GRUPOS as readonly string[]).includes(n)) {
      return {
        acao: "erro",
        mensagem: `${opcao}: grupo desconhecido "${n}"; grupos válidos: ${NOMES_GRUPOS.join(", ")}`,
      };
    }
  }
  return nomes as NomeGrupo[];
}

/** Grupos finais, na ordem de `GRUPOS`; `undefined` quando nenhuma das opções veio. */
function escolherGrupos(
  incluir: string | undefined,
  excluir: string | undefined,
): readonly NomeGrupo[] | Erro | undefined {
  if (incluir === undefined && excluir === undefined) return undefined;
  const sim = incluir === undefined ? NOMES_GRUPOS : nomesDeGrupo("--grupos", incluir);
  if (!Array.isArray(sim)) return sim;
  const nao = excluir === undefined ? [] : nomesDeGrupo("--sem-grupos", excluir);
  if (!Array.isArray(nao)) return nao;
  const final = NOMES_GRUPOS.filter((g) => sim.includes(g) && !nao.includes(g));
  if (final.length === 0) {
    return {
      acao: "erro",
      mensagem: "nenhum grupo de ferramentas restou depois de --grupos e --sem-grupos",
    };
  }
  return final;
}
