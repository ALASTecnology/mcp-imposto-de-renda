#!/usr/bin/env node
/**
 * Gera packages/mcp/src/ajuda/dados.ts a partir das notas de mapeamento
 * (docs/mapeamento/notas/0*.md), para a ferramenta obter_ajuda.
 *
 * Cada bloco "## <ID> <Nome>" vira um tópico com os itens de primeiro nível ("- Campo: texto",
 * com as linhas de continuação). O item "Exige do MCP" é planejamento interno e fica de fora.
 * Uso, a partir da raiz: node tools/mapeamento/gera_ajuda.mjs [--verificar]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = fileURLToPath(new URL("../..", import.meta.url));
const NOTAS = join(RAIZ, "docs/mapeamento/notas");
const SAIDA = join(RAIZ, "packages/mcp/src/ajuda/dados.ts");
const IGNORAR = new Set(["Exige do MCP"]);

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
const conteudo = [
  "// Arquivo gerado por tools/mapeamento/gera_ajuda.mjs a partir de docs/mapeamento/notas.",
  "// Não edite à mão: altere as notas e rode o gerador.",
  'import type { TopicoAjuda } from "./tipos.js";',
  "",
  `export const TOPICOS_AJUDA: readonly TopicoAjuda[] = ${JSON.stringify(topicos, null, 1)};`,
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
  console.log(`ok: ${topicos.length} tópicos`);
} else {
  writeFileSync(SAIDA, conteudo);
  console.log(`${topicos.length} tópicos gravados em packages/mcp/src/ajuda/dados.ts`);
}
