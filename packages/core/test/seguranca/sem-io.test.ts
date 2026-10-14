/**
 * O core não faz E/S: nem disco, nem rede, nem processos, nem leitura de ambiente.
 *
 * Toda leitura e gravação de arquivo fica na camada de arquivos do servidor MCP
 * (`packages/mcp/src/arquivos`), que aplica a pasta autorizada e os limites. Este teste lê o
 * código de `packages/core/src` e falha se aparecer qualquer import fora do próprio pacote e
 * do `zod`, ou qualquer API de execução dinâmica, rede ou ambiente. Comentários e textos de
 * strings são ignorados (ver `somenteCodigo`).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { somenteCodigo } from "../integridade/apoio.js";

const SRC = fileURLToPath(new URL("../../src/", import.meta.url));
const PACOTE = fileURLToPath(new URL("../../package.json", import.meta.url));

function arquivosTs(pasta: string): string[] {
  return readdirSync(pasta).flatMap((n) => {
    const p = join(pasta, n);
    return statSync(p).isDirectory() ? arquivosTs(p) : p.endsWith(".ts") ? [p] : [];
  });
}

/** Imports permitidos no core: caminhos relativos e o `zod`. */
const IMPORT_PERMITIDO = /^(\.{1,2}\/|zod$)/;

const PROIBIDOS: [string, RegExp][] = [
  ["eval", /\beval\s*\(/],
  ["Function dinâmica", /\b(new\s+)?Function\s*\(/],
  ["import dinâmico", /\bimport\s*\(/],
  ["require", /\brequire\s*\(/],
  ["fetch", /\bfetch\s*\(/],
  ["XMLHttpRequest", /\bXMLHttpRequest\b/],
  ["WebSocket", /\bWebSocket\b/],
  ["EventSource", /\bEventSource\b/],
  ["process", /\bprocess\s*\./],
  ["globalThis", /\bglobalThis\b/],
  ["Deno/Bun", /\b(Deno|Bun)\s*\./],
  ["setTimeout/setInterval", /\bset(Timeout|Interval|Immediate)\s*\(/],
  ["Worker", /\b(Shared)?Worker\s*\(/],
  ["WebAssembly", /\bWebAssembly\b/],
];

const arquivos = arquivosTs(SRC);

/** Especificadores de todos os imports e re-exports estáticos do código. */
function especificadores(codigo: string, fonte: string): string[] {
  // As strings foram apagadas por `somenteCodigo`; os especificadores vêm do fonte original,
  // nas mesmas posições em que o código tem `from "` ou `import "`.
  const achados: string[] = [];
  const re = /\b(from|import)\s*(["'])/g;
  for (let m = re.exec(codigo); m; m = re.exec(codigo)) {
    const inicio = m.index + m[0].length;
    const fim = fonte.indexOf(m[2] ?? '"', inicio);
    achados.push(fonte.slice(inicio, fim));
  }
  return achados;
}

describe("o core não faz E/S nem rede", () => {
  it("encontra o código-fonte do core", () => {
    expect(arquivos.length).toBeGreaterThan(30);
  });

  it("só importa caminhos relativos e o zod (nada de node:fs, net, http, child_process...)", () => {
    const fora: string[] = [];
    let total = 0;
    for (const arquivo of arquivos) {
      const fonte = readFileSync(arquivo, "utf8");
      for (const esp of especificadores(somenteCodigo(fonte), fonte)) {
        total++;
        if (!IMPORT_PERMITIDO.test(esp)) fora.push(`${relative(SRC, arquivo)}: ${esp}`);
      }
    }
    expect(total).toBeGreaterThan(50);
    expect(fora).toEqual([]);
  });

  it("não usa execução dinâmica, rede, ambiente nem temporizadores", () => {
    const achados: string[] = [];
    for (const arquivo of arquivos) {
      const linhas = somenteCodigo(readFileSync(arquivo, "utf8")).split("\n");
      linhas.forEach((linha, i) => {
        for (const [nome, re] of PROIBIDOS) {
          if (re.test(linha)) achados.push(`${relative(SRC, arquivo)}:${i + 1}: ${nome}`);
        }
      });
    }
    expect(achados).toEqual([]);
  });

  it("a varredura detecta o que deve detectar", () => {
    const amostra = [
      'import { readFileSync } from "node:fs";',
      'export * from "http";',
      "const x = eval(codigo);",
      "const f = new Function('return 1');",
      "await fetch(url);",
      "const k = process.env.CHAVE;",
      "const m = await import(nome);",
    ].join("\n");
    const codigo = somenteCodigo(amostra);
    expect(especificadores(codigo, amostra).filter((e) => !IMPORT_PERMITIDO.test(e))).toEqual([
      "node:fs",
      "http",
    ]);
    const detectados = PROIBIDOS.filter(([, re]) => re.test(codigo)).map(([n]) => n);
    expect(detectados).toEqual(
      expect.arrayContaining(["eval", "Function dinâmica", "fetch", "process", "import dinâmico"]),
    );
    // Texto em comentário ou string não conta.
    expect(
      PROIBIDOS.some(([, re]) => re.test(somenteCodigo('// eval(x)\nconst s = "fetch(";'))),
    ).toBe(false);
  });

  it("a única dependência de execução do core é o zod, com versão fixada", () => {
    const pacote = JSON.parse(readFileSync(PACOTE, "utf8")) as {
      dependencies?: Record<string, string>;
    };
    const deps = pacote.dependencies ?? {};
    expect(Object.keys(deps)).toEqual(["zod"]);
    expect(deps.zod).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
