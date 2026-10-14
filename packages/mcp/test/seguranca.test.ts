import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const PASTAS = [
  fileURLToPath(new URL("../src", import.meta.url)),
  fileURLToPath(new URL("../../../apps/cli/src", import.meta.url)),
];

function arquivosTs(pasta: string): string[] {
  return readdirSync(pasta).flatMap((n) => {
    const p = join(pasta, n);
    return statSync(p).isDirectory() ? arquivosTs(p) : p.endsWith(".ts") ? [p] : [];
  });
}

const PROIBIDOS = [
  /from\s+["'](node:)?(http|https|http2|net|tls|dgram|dns|child_process|worker_threads)["']/,
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\b/,
  /\bexecSync\b|\bspawn\s*\(/,
  /server\/(sse|streamableHttp|express)\.js/,
];

describe("nenhuma chamada de rede", () => {
  it("o código do servidor e do CLI não importa módulos de rede nem processos", () => {
    const achados: string[] = [];
    for (const pasta of PASTAS) {
      for (const arquivo of arquivosTs(pasta)) {
        const fonte = readFileSync(arquivo, "utf8");
        for (const re of PROIBIDOS) if (re.test(fonte)) achados.push(`${arquivo}: ${re}`);
      }
    }
    expect(achados).toEqual([]);
  });
});
