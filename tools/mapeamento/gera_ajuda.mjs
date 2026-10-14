#!/usr/bin/env node
/**
 * Gera packages/mcp/src/ajuda/dados.ts a partir das notas de mapeamento
 * (docs/mapeamento/notas/0*.md), para a ferramenta obter_ajuda.
 *
 * Cada bloco "## <ID> <Nome>" vira um tópico com os itens de primeiro nível ("- Campo: texto",
 * com as linhas de continuação). O item "Exige do MCP" é planejamento interno e fica de fora.
 * Também extrai os atalhos de teclado do programa citados nas notas (Ctrl+P, F5, Alt, T, R...)
 * com a função de cada um e as ferramentas do MCP que cobrem o item, lidas da coluna Status de
 * docs/mapeamento/matriz-cobertura.md (gere a matriz antes), para a ferramenta consultar_atalhos.
 * Uso, a partir da raiz: node tools/mapeamento/gera_ajuda.mjs [--verificar]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("../..", import.meta.url));
const NOTAS = join(RAIZ, "docs/mapeamento/notas");
const SAIDA = join(RAIZ, "packages/mcp/src/ajuda/dados.ts");
const MATRIZ = join(RAIZ, "docs/mapeamento/matriz-cobertura.md");
const RX_ATALHO =
  /(?:Ctrl|Alt|Shift)(?:\+(?:Ctrl|Alt|Shift))*\+(?:PgUp\/PgDn|F\d{1,2}|Tab|[A-Z0-9])(?![A-Za-z0-9])|Alt(?:, [A-Z])+(?![A-Za-z])|(?<![A-Za-z0-9-])F\d{1,2}(?![A-Za-z0-9-])/g;
const IGNORAR = new Set(["Exige do MCP"]);

/** Ferramentas existentes por item, da coluna Status da matriz ("implementada (`a`, `b`)"). */
function ferramentasDaMatriz() {
  const mapa = new Map();
  for (const linha of readFileSync(MATRIZ, "utf8").split(/\r?\n/)) {
    const c = linha.split("|").map((x) => x.trim());
    if (c.length < 8 || !/^[A-Z]+-/.test(c[1] ?? "")) continue;
    const status = c[6] ?? "";
    mapa.set(c[1], {
      status: status.replace(/\s*\(.*$/, ""),
      ferramentas: [...status.matchAll(/`([a-z0-9_]+)`/g)].map((m) => m[1]),
    });
  }
  return mapa;
}

/** Atalhos de teclado citados no cabeçalho e nos itens de cada tópico. */
function atalhosDe(texto, matriz) {
  const out = [];
  let atual;
  for (const linha of texto.split(/\r?\n/)) {
    const cab = /^## (\S+) (.+)$/.exec(linha);
    if (cab) {
      atual = { id: cab[1], nome: cab[2].trim() };
    } else if (/^#/.test(linha)) {
      atual = undefined;
      continue;
    }
    if (!atual) continue;
    // "Exige do MCP" é planejamento; o resto descreve o programa.
    if (/^- Exige do MCP:/.test(linha)) continue;
    for (const m of linha.matchAll(RX_ATALHO)) {
      const tecla = m[0];
      if (out.some((a) => a.tecla === tecla && a.id === atual.id)) continue;
      const cob = matriz.get(atual.id);
      out.push({
        tecla,
        id: atual.id,
        funcao: atual.nome,
        status: cob?.status ?? "sem item na matriz",
        ferramentas: cob?.ferramentas ?? [],
      });
    }
  }
  return out;
}

function blocos(texto, arquivo) {
  const topicos = [];
  let atual;
  let item;
  for (const linha of texto.split(/\r?\n/)) {
    const cab = /^## (\S+) (.+)$/.exec(linha);
    if (cab) {
      atual = { id: cab[1], nome: cab[2].trim(), fonte: arquivo, itens: [] };
      topicos.push(atual);
      item = undefined;
      continue;
    }
    if (!atual) continue;
    if (/^#/.test(linha)) {
      atual = undefined;
      continue;
    }
    const novo = /^- ([^:]{1,60}):\s*(.*)$/.exec(linha);
    if (novo) {
      item = IGNORAR.has(novo[1]) ? undefined : { campo: novo[1], texto: novo[2].trim() };
      if (item) atual.itens.push(item);
      continue;
    }
    if (item && linha.trim() !== "") item.texto = `${item.texto}\n${linha.trim()}`.trim();
  }
  return topicos.filter((t) => t.itens.length > 0);
}

const arquivos = readdirSync(NOTAS)
  .filter((n) => /^\d\d-.*\.md$/.test(n))
  .sort();
const topicos = arquivos.flatMap((n) =>
  blocos(readFileSync(join(NOTAS, n), "utf8"), `docs/mapeamento/notas/${n}`),
);
const matriz = ferramentasDaMatriz();
const atalhos = arquivos.flatMap((n) => atalhosDe(readFileSync(join(NOTAS, n), "utf8"), matriz));
const conteudo = [
  "// Arquivo gerado por tools/mapeamento/gera_ajuda.mjs a partir de docs/mapeamento/notas.",
  "// Não edite à mão: altere as notas e rode o gerador.",
  'import type { AtalhoPrograma, TopicoAjuda } from "./tipos.js";',
  "",
  `export const TOPICOS_AJUDA: readonly TopicoAjuda[] = ${JSON.stringify(topicos, null, 1)};`,
  "",
  `export const ATALHOS_PROGRAMA: readonly AtalhoPrograma[] = ${JSON.stringify(atalhos, null, 1)};`,
  "",
].join("\n");

if (process.argv.includes("--verificar")) {
  const atual = readFileSync(SAIDA, "utf8");
  if (atual !== conteudo) {
    console.error(
      "packages/mcp/src/ajuda/dados.ts desatualizado: rode node tools/mapeamento/gera_ajuda.mjs",
    );
    process.exit(1);
  }
  console.log(`ok: ${topicos.length} tópicos e ${atalhos.length} atalhos`);
} else {
  writeFileSync(SAIDA, conteudo);
  console.log(
    `${topicos.length} tópicos e ${atalhos.length} atalhos gravados em packages/mcp/src/ajuda/dados.ts`,
  );
}
