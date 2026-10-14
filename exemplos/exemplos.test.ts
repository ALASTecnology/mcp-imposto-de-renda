/**
 * Regenera as declarações de exemplo com o servidor real e confere que nada mudou.
 *
 * `pnpm test` só compara. Para gravar de novo depois de mudar um roteiro ou o servidor, rode
 * `pnpm exemplos` (vitest em modo `gravar`) e revise o diff.
 */
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { roteiro as assalariado } from "./01-assalariado-simples/roteiro.js";
import { roteiro as familia } from "./02-familia-dependentes/roteiro.js";
import { roteiro as aposentado } from "./03-aposentado-65-anos/roteiro.js";
import { roteiro as autonomo } from "./04-autonomo-carne-leao/roteiro.js";
import { executarRoteiro, type Roteiro } from "./executar.js";

const GRAVAR = import.meta.env.MODE === "gravar";

const EXEMPLOS: readonly [string, Roteiro][] = [
  ["01-assalariado-simples", assalariado],
  ["02-familia-dependentes", familia],
  ["03-aposentado-65-anos", aposentado],
  ["04-autonomo-carne-leao", autonomo],
];

/** Arquivos que o gerador produz numa pasta de exemplo (o README e o roteiro são escritos à mão). */
const GERADO = /\.(DBK|DEC)$|^conversa\.md$|^calculo\.md$/i;

describe("declarações de exemplo", () => {
  for (const [pasta, roteiro] of EXEMPLOS) {
    it(`${pasta} continua igual ao gerado pelo servidor`, async () => {
      const raiz = fileURLToPath(new URL(`./${pasta}/`, import.meta.url));
      const gerados = await executarRoteiro(roteiro);
      if (GRAVAR) {
        for (const nome of readdirSync(raiz)) if (GERADO.test(nome)) rmSync(join(raiz, nome));
        for (const [nome, conteudo] of gerados) writeFileSync(join(raiz, nome), conteudo);
      }
      const noDisco = readdirSync(raiz)
        .filter((n) => GERADO.test(n))
        .sort();
      expect(noDisco, "rode pnpm exemplos para regravar").toEqual([...gerados.keys()].sort());
      for (const [nome, conteudo] of gerados) {
        const caminho = join(raiz, nome);
        expect(existsSync(caminho), `${pasta}/${nome} ausente`).toBe(true);
        expect(readFileSync(caminho).equals(conteudo), `${pasta}/${nome} mudou`).toBe(true);
      }
    }, 30_000);
  }
});
