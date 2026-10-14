// Confere a documentação do repositório: links relativos (arquivo e âncora), imagens, tabelas, travessões,
// Unicode invisível e nomes de ferramentas citados que não existem no servidor.
// Uso, a partir da raiz: node tools/docs/links.mjs [arquivos.md...]
// Sem argumentos, confere todos os .md versionados ou novos (git ls-files). Sai com código 1 se
// achar problema. Os nomes de ferramentas vêm de tools/docs/saida/ferramentas.json, gerado por
// pnpm docs:catalogo; sem ele, essa conferência é pulada.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { semCodigo, tabelasDesalinhadas } from "./markdown.mjs";

const RAIZ = fileURLToPath(new URL("../../", import.meta.url));
const FERRAMENTAS = fileURLToPath(new URL("./saida/ferramentas.json", import.meta.url));

/** Pastas cujo texto cita ferramentas propostas ou de outros exercícios, de propósito. */
const CITAM_PROPOSTAS = /^docs\/(mapeamento|regras|adr)\//;

const PREFIXOS =
  /^(adicionar|editar|remover|listar|definir|aplicar|buscar|simular|comparar|explicar|calcular|consultar|abrir|converter|ler|validar|verificar|criar|excluir|importar|gerar|instruir|orientar|registrar|restaurar|gravar|repetir|transferir|apurar|atualizar|obter)_[a-z0-9_]+$/;

// Travessão e meia-risca, montados por código para o próprio arquivo não contê-los.
const TRAVESSOES = new RegExp(`[${String.fromCharCode(0x2014, 0x2013)}]`);
const INVISIVEIS = new RegExp(
  `[${[0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0x202a, 0x202b, 0x202c, 0x202d, 0x202e, 0x2060, 0x2061, 0x2062, 0x2063, 0x2064, 0xfeff, 0x00ad].map((c) => String.fromCharCode(c)).join("")}]`,
);

function arquivosPadrao() {
  const saida = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "*.md"],
    { cwd: RAIZ, encoding: "utf8" },
  );
  return saida
    .split("\n")
    .filter(Boolean)
    .filter((a) => !a.startsWith("vendor/") && existsSync(resolve(RAIZ, a)));
}

/** Âncora no padrão do GitHub: minúsculas, sem pontuação (mantém _ e -), espaços viram hífens. */
const slug = (titulo) =>
  titulo
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-");

const cacheAncoras = new Map();
function ancoras(arquivo) {
  if (cacheAncoras.has(arquivo)) return cacheAncoras.get(arquivo);
  const s = new Set();
  const vistos = {};
  const texto = semCodigo(readFileSync(arquivo, "utf8"));
  for (const l of texto.split("\n")) {
    const m = l.match(/^#{1,6}\s+(.*?)\s*#*\s*$/);
    if (m) {
      const b = slug(m[1]);
      const n = vistos[b] ?? 0;
      vistos[b] = n + 1;
      s.add(n ? `${b}-${n}` : b);
    }
  }
  for (const m of texto.matchAll(/<a\s+(?:id|name)="([^"]+)"/g)) s.add(m[1].toLowerCase());
  cacheAncoras.set(arquivo, s);
  return s;
}

const catalogo = existsSync(FERRAMENTAS) ? JSON.parse(readFileSync(FERRAMENTAS, "utf8")) : null;
const nomes = catalogo
  ? new Set(catalogo.grupos.flatMap((g) => g.ferramentas.map((f) => f.nome)))
  : null;
/** Nomes de parâmetro (como `remover_mes`) parecem ferramentas, mas não são. */
const parametros = new Set();
function coletarParametros(schema) {
  for (const [k, v] of Object.entries(schema?.properties ?? {})) {
    parametros.add(k);
    coletarParametros(v);
    coletarParametros(v?.items);
  }
}
for (const g of catalogo?.grupos ?? []) for (const f of g.ferramentas) coletarParametros(f.entrada);

const arquivos = process.argv.slice(2).length ? process.argv.slice(2) : arquivosPadrao();
const problemas = [];
let links = 0;
for (const a of arquivos) {
  const abs = resolve(RAIZ, a);
  const rel = relative(RAIZ, abs);
  const bruto = readFileSync(abs, "utf8");
  // Citar o próprio caractere entre parênteses, como numa regra de estilo, é permitido.
  const semCitacao = bruto.replace(new RegExp(`\\(${TRAVESSOES.source}\\)`, "g"), "");
  if (TRAVESSOES.test(semCitacao)) problemas.push(`TRAVESSÃO   ${rel}`);
  if (INVISIVEIS.test(bruto)) problemas.push(`INVISÍVEL   ${rel}`);
  for (const t of tabelasDesalinhadas(bruto)) {
    problemas.push(
      `TABELA      ${rel}:${t.linha}: ${t.achado} colunas, cabeçalho tem ${t.esperado}`,
    );
  }
  const texto = semCodigo(bruto);
  const alvos = [];
  for (const m of texto.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) alvos.push(m[1]);
  for (const m of texto.matchAll(/(?:src|srcset|href)="([^"]+)"/g)) alvos.push(m[1]);
  for (const m of texto.matchAll(/^\[[^\]]+\]:\s*(\S+)/gm)) alvos.push(m[1]);
  for (const alvo of alvos) {
    if (/^(https?:|mailto:)/.test(alvo)) continue;
    links++;
    const [p, anc] = alvo.split("#");
    const destino = p ? resolve(dirname(abs), decodeURIComponent(p)) : abs;
    if (!existsSync(destino)) {
      problemas.push(`QUEBRADO    ${rel} -> ${alvo}`);
      continue;
    }
    if (anc && destino.endsWith(".md") && statSync(destino).isFile()) {
      if (!ancoras(destino).has(decodeURIComponent(anc).toLowerCase())) {
        problemas.push(`ÂNCORA      ${rel} -> ${alvo}`);
      }
    }
  }
  if (nomes && !CITAM_PROPOSTAS.test(rel)) {
    for (const m of bruto.matchAll(/`([a-z][a-z0-9_]+)`/g)) {
      if (PREFIXOS.test(m[1]) && !nomes.has(m[1]) && !parametros.has(m[1])) {
        problemas.push(`FERRAMENTA  ${rel}: \`${m[1]}\` não existe no servidor`);
      }
    }
  }
}
const unicos = [...new Set(problemas)];
for (const p of unicos) console.log(p);
console.log(
  `${arquivos.length} arquivos, ${links} links relativos conferidos, ${unicos.length} problema(s).`,
);
if (unicos.length) process.exit(1);
