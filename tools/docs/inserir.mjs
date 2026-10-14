// Insere o catálogo gerado no README, entre os marcadores catalogo:inicio e catalogo:fim.
// Uso, a partir da raiz: node tools/docs/inserir.mjs [README.md] [catalogo.md]
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const aqui = (p) => fileURLToPath(new URL(p, import.meta.url));
const [, , readme = aqui("../../README.md"), catalogo = aqui("./saida/catalogo.md")] = process.argv;
let t = readFileSync(readme, "utf8");
const cat = readFileSync(catalogo, "utf8").trim();
const ini = "<!-- catalogo:inicio -->",
  fim = "<!-- catalogo:fim -->";
if (t.includes(ini)) {
  t = t.replace(new RegExp(`${ini}[\\s\\S]*?${fim}`), `${ini}\n${cat}\n${fim}`);
} else {
  const a = t.indexOf("Tabela gerada a partir de `tools/list`");
  const b = t.indexOf("**Valores monetários na entrada:**");
  const intro =
    "Todas as ferramentas são locais (`openWorldHint: false`). As que gravam são anunciadas com\n`destructiveHint: true`, para o cliente pedir confirmação. O que falta para cada função do programa\noficial está na [matriz de cobertura](docs/mapeamento/matriz-cobertura.md).\n\n";
  t = t.slice(0, a) + intro + `${ini}\n${cat}\n${fim}\n\n` + t.slice(b);
}
writeFileSync(readme, t);
