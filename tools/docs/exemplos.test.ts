/**
 * Executa as chamadas de exemplo de exemplos-ferramentas.ts contra o servidor real e grava a
 * primeira chamada de cada ferramenta, com a resposta, em saida/exemplos.json (entrada de
 * referencia.mjs). Rodado por pnpm docs:catalogo.
 */
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  statSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "@mcp-imposto-de-renda/mcp";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { expect, it } from "vitest";
import { BASE, CENARIOS } from "./exemplos-ferramentas.js";

const SAIDA = fileURLToPath(new URL("./saida/", import.meta.url));
const EXEMPLOS = fileURLToPath(new URL("../../exemplos/", import.meta.url));
const RELOGIO = new Date("2026-04-10T12:00:00Z");

interface Registro {
  argumentos: Record<string, unknown>;
  texto: string;
  dados: unknown;
  erro: boolean;
}

it("executa um exemplo de cada ferramenta", async () => {
  const registros: Record<string, Registro> = {};
  for (const cenario of CENARIOS) {
    const dir = mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-ref-"));
    try {
      for (const [nome, origem] of Object.entries(BASE))
        copyFileSync(join(EXEMPLOS, origem), join(dir, nome));
      const s = createServer({ diretorioAutorizado: dir, relogio: () => RELOGIO });
      const [a, b] = InMemoryTransport.createLinkedPair();
      const c = new Client({ name: "referencia", version: "1" });
      await Promise.all([s.connect(a), c.connect(b)]);
      for (const nome of readdirSync(dir)) utimesSync(join(dir, nome), RELOGIO, RELOGIO);
      for (const chamada of cenario) {
        const r = (await c.callTool({
          name: chamada.ferramenta,
          arguments: chamada.argumentos,
        })) as {
          content: { type: string; text: string }[];
          structuredContent?: unknown;
          isError?: boolean;
        };
        for (const nome of readdirSync(dir)) {
          if (statSync(join(dir, nome)).isFile()) utimesSync(join(dir, nome), RELOGIO, RELOGIO);
        }
        if (registros[chamada.ferramenta]) continue;
        const limpar = (t: string) => t.split(dir).join("<pasta>");
        registros[chamada.ferramenta] = {
          argumentos: chamada.argumentos,
          texto: limpar(
            r.content
              .filter((x) => x.type === "text")
              .map((x) => x.text)
              .join("\n"),
          ),
          dados:
            r.structuredContent === undefined
              ? null
              : JSON.parse(limpar(JSON.stringify(r.structuredContent))),
          erro: r.isError === true,
        };
      }
      await c.close();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  mkdirSync(SAIDA, { recursive: true });
  writeFileSync(join(SAIDA, "exemplos.json"), `${JSON.stringify(registros, null, 2)}\n`);
  const erros = Object.entries(registros)
    .filter(([, r]) => r.erro)
    .map(([n, r]) => `${n}: ${r.texto.slice(0, 300)}`);
  expect(erros).toEqual([]);
}, 120_000);
