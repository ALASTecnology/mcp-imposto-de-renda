/**
 * Lista as ferramentas, prompts e recursos de cada grupo pelo tools/list do servidor real e grava
 * em saida/ferramentas.json, entrada de catalogo.mjs. Rodado por pnpm docs:catalogo.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer, GRUPOS } from "@autoir/mcp";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { expect, it } from "vitest";

const SAIDA = fileURLToPath(new URL("./saida/", import.meta.url));

async function conectar(opcoes: Parameters<typeof createServer>[0]) {
  const s = createServer(opcoes);
  const [a, b] = InMemoryTransport.createLinkedPair();
  const c = new Client({ name: "catalogo", version: "1" });
  await Promise.all([s.connect(a), c.connect(b)]);
  return c;
}

it("lista as ferramentas por grupo", async () => {
  const dir = mkdtempSync(join(tmpdir(), "autoir-catalogo-"));
  try {
    const grupos = [];
    let prompts: string[] = [];
    let recursos: string[] = [];
    for (const g of GRUPOS) {
      const c = await conectar({ diretorioAutorizado: dir, grupos: [g] });
      const t = await c.listTools().catch(() => ({ tools: [] }));
      grupos.push({
        nome: g.nome,
        descricao: g.descricao,
        exigePasta: Boolean(g.exigePasta),
        ferramentas: t.tools.map((x) => ({
          nome: x.name,
          titulo: x.title,
          descricao: x.description,
          escrita: x.annotations?.readOnlyHint === false,
        })),
      });
      if (g.nome === "calculo") {
        prompts = (await c.listPrompts()).prompts.map((p) => p.name);
        recursos = (await c.listResources()).resources.map((r) => r.uri);
      }
      await c.close();
    }
    const ro = await conectar({ diretorioAutorizado: dir, somenteLeitura: true });
    const totalSomenteLeitura = (await ro.listTools()).tools.length;
    await ro.close();
    const semPasta = await conectar({});
    const totalSemPasta = (await semPasta.listTools()).tools.length;
    await semPasta.close();
    mkdirSync(SAIDA, { recursive: true });
    const saida = { grupos, prompts, recursos, totalSomenteLeitura, totalSemPasta };
    writeFileSync(join(SAIDA, "ferramentas.json"), `${JSON.stringify(saida, null, 2)}\n`);
    expect(grupos.length).toBeGreaterThan(0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
