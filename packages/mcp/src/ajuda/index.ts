/**
 * Busca nos tópicos de ajuda gerados das notas de mapeamento (`dados.ts`). Busca por
 * identificador exato (F-IDENT) ou por palavras, sem diferenciar acentos e maiúsculas: cada
 * palavra no nome do tópico vale 3 pontos e no texto dos itens, 1.
 */
import { TOPICOS_AJUDA } from "./dados.js";
import type { TopicoAjuda } from "./tipos.js";

export type { TopicoAjuda } from "./tipos.js";
export { TOPICOS_AJUDA };

const normalizar = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

const PALAVRAS_VAZIAS = new Set(["a", "o", "e", "de", "da", "do", "das", "dos", "em", "na", "no"]);

export function buscarAjuda(consulta: string, limite = 3): TopicoAjuda[] {
  const exato = TOPICOS_AJUDA.find((t) => t.id.toLowerCase() === consulta.trim().toLowerCase());
  if (exato) return [exato];
  const palavras = normalizar(consulta)
    .split(/[^a-z0-9º]+/)
    .filter((p) => p.length > 1 && !PALAVRAS_VAZIAS.has(p));
  if (palavras.length === 0) return [];
  return TOPICOS_AJUDA.map((t) => {
    const nome = normalizar(`${t.id} ${t.nome}`);
    const texto = normalizar(t.itens.map((i) => i.texto).join(" "));
    const pontos = palavras.reduce(
      (s, p) => s + (nome.includes(p) ? 3 : 0) + (texto.includes(p) ? 1 : 0),
      0,
    );
    return { t, pontos };
  })
    .filter((x) => x.pontos > 0)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, limite)
    .map((x) => x.t);
}
