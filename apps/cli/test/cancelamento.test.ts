/**
 * Cancelamento (revisão 2, achado 6): o SDK não responde a uma requisição cancelada, e o CLI a
 * deixava em `pendentes`; ao fechar o stdin, o processo esperava o prazo inteiro (30 s). O
 * processo é encerrado pelo próprio PID no fim, mesmo em erro.
 */
import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { copyFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, afterEach, describe, expect, it } from "vitest";

const RAIZ = fileURLToPath(new URL("../../../", import.meta.url));
const CARREGADOR = fileURLToPath(new URL("./carregador.mjs", import.meta.url));
const ENTRADA = fileURLToPath(new URL("../src/index.ts", import.meta.url));
const FIXTURE = fileURLToPath(
  new URL("../../../packages/core/test/fixtures/dbk/2026/pj-simples-01.DBK", import.meta.url),
);
const pasta = mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-cancelamento-"));
copyFileSync(FIXTURE, join(pasta, "pj.DBK"));

const vivos = new Set<ChildProcessWithoutNullStreams>();

afterEach(() => {
  for (const p of vivos) {
    if (p.exitCode === null && p.signalCode === null && p.pid !== undefined) {
      try {
        process.kill(p.pid, "SIGKILL");
      } catch {
        /* já terminou */
      }
    }
  }
  vivos.clear();
});
afterAll(() => rmSync(pasta, { recursive: true, force: true }));

function ambienteLimpo(): NodeJS.ProcessEnv {
  const { MCP_IMPOSTO_DE_RENDA_PERFIL: _, ...resto } = process.env;
  return resto;
}

/** Sobe o CLI, inicializa e devolve quando a resposta do initialize chega. */
async function iniciar() {
  const filho = spawn(
    process.execPath,
    ["--conditions=@mcp-imposto-de-renda/source", "--import", CARREGADOR, ENTRADA, "--dir", pasta],
    { cwd: RAIZ, env: ambienteLimpo(), stdio: ["pipe", "pipe", "pipe"] },
  );
  vivos.add(filho);
  const saida = new Promise<number | null>((ok) => filho.on("exit", (codigo) => ok(codigo)));
  const enviar = (msg: object) =>
    filho.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", ...msg })}\n`);
  let buffer = "";
  const inicializado = new Promise<void>((ok, falha) => {
    const t = setTimeout(() => falha(new Error("sem resposta ao initialize")), 30_000);
    filho.stdout.setEncoding("utf8");
    filho.stdout.on("data", (d: string) => {
      buffer += d;
      if (/"id":1\b/.test(buffer)) {
        clearTimeout(t);
        ok();
      }
    });
  });
  enviar({
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "teste", version: "0" },
    },
  });
  await inicializado;
  enviar({ method: "notifications/initialized" });
  return { filho, enviar, saida };
}

describe("cancelamento via stdio", () => {
  it("requisição cancelada não segura o encerramento: sai em menos de 5 s", async () => {
    const p = await iniciar();
    p.enviar({
      id: 2,
      method: "tools/call",
      params: { name: "abrir_declaracao", arguments: { arquivo: "pj.DBK" } },
    });
    p.enviar({ method: "notifications/cancelled", params: { requestId: 2, reason: "teste" } });
    const t0 = Date.now();
    await new Promise((ok) => setTimeout(ok, 50));
    p.filho.stdin.end();
    expect(await p.saida).toBe(0);
    expect(Date.now() - t0).toBeLessThan(5_000);
  }, 60_000);
});
