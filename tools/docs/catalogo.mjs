// Gera o catálogo de ferramentas (markdown) a partir de ferramentas.json (tools/list real).
// Uso, a partir da raiz: node tools/docs/catalogo.mjs [entrada.json] [saida.md]
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const aqui = (p) => fileURLToPath(new URL(p, import.meta.url));
const [, , entrada = aqui("./saida/ferramentas.json"), saida = aqui("./saida/catalogo.md")] =
  process.argv;
const o = JSON.parse(readFileSync(entrada, "utf8"));
const frase = (d) => {
  let t = d.split(" Valor em reais.")[0].split(" Texto = REAIS")[0];
  const m = t.match(/^(.+?[.!?])(\s|$)/);
  t = m ? m[1] : t;
  return t.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
};
const L = [];
let total = 0,
  escrita = 0;
for (const g of o.grupos) {
  total += g.ferramentas.length;
  escrita += g.ferramentas.filter((f) => f.escrita).length;
}
const comFerr = o.grupos.filter((g) => g.ferramentas.length);
L.push(
  `Gerado a partir de \`tools/list\` do servidor: **${total} ferramentas** em ${comFerr.length} grupos, ${escrita} delas gravam na pasta autorizada (e somem com \`--somente-leitura\`, que deixa ${o.totalSomenteLeitura}).`,
);
L.push("");
for (const g of comFerr) {
  const desc = g.descricao.replace(/\.$/, "");
  L.push(`### ${g.nome}`);
  L.push("");
  L.push(
    `${desc.charAt(0).toUpperCase()}${desc.slice(1)}.${g.exigePasta ? " Exige `--dir`." : ""}`,
  );
  L.push("");
  let resto = g.ferramentas;
  if (g.nome === "edicao") {
    const quad = [];
    const usados = new Set();
    const fs = g.ferramentas;
    for (let i = 0; i + 3 < fs.length; i++) {
      const [a, e, r, l] = fs.slice(i, i + 4);
      if (
        /^adicionar_/.test(a.nome) &&
        /^editar_/.test(e.nome) &&
        /^remover_/.test(r.nome) &&
        /^listar_/.test(l.nome)
      ) {
        quad.push({ ficha: l.titulo.replace(/^Listar /, ""), a, e, r, l });
        for (const x of [a, e, r, l]) usados.add(x.nome);
        i += 3;
      }
    }
    L.push(
      `Fichas em lista: cada uma tem quatro ferramentas. As de inclusão, alteração e remoção validam a declaração e gravam o \`.DBK\` com cópia de segurança, devolvendo as pendências.`,
    );
    L.push("");
    L.push("| Ficha | Incluir | Alterar | Remover | Listar |");
    L.push("| --- | --- | --- | --- | --- |");
    for (const q of quad)
      L.push(
        `| ${q.ficha} | \`${q.a.nome}\` | \`${q.e.nome}\` | \`${q.r.nome}\` | \`${q.l.nome}\` |`,
      );
    L.push("");
    resto = fs.filter((f) => !usados.has(f.nome));
    L.push("Demais ferramentas do grupo:");
    L.push("");
  }
  L.push("| Ferramenta | O que faz | Grava? |");
  L.push("| --- | --- | --- |");
  for (const f of resto)
    L.push(`| \`${f.nome}\` | ${frase(f.descricao)} | ${f.escrita ? "**sim**" : "não"} |`);
  L.push("");
}
const vazios = o.grupos.filter((g) => !g.ferramentas.length).map((g) => `\`${g.nome}\``);
if (vazios.length)
  L.push(`Grupos declarados no registro e ainda sem ferramentas: ${vazios.join(", ")}.`, "");
writeFileSync(saida, L.join("\n"));
console.log(
  JSON.stringify({
    total,
    escrita,
    ro: o.totalSomenteLeitura,
    grupos: comFerr.map((g) => `${g.nome}:${g.ferramentas.length}`),
    vazios,
  }),
);
