/**
 * Teste de integração do executável: sobe o processo real via stdio, conversa em JSON-RPC e
 * confere o encerramento limpo. Cada processo é encerrado pelo próprio PID no fim, mesmo em erro.
 */
import { type ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, afterEach, describe, expect, it } from "vitest";

const RAIZ = fileURLToPath(new URL("../../../", import.meta.url));
const CARREGADOR = fileURLToPath(new URL("./carregador.mjs", import.meta.url));
const ENTRADA = fileURLToPath(new URL("../src/index.ts", import.meta.url));
const pasta = mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-stdio-"));

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

interface Processo {
  readonly filho: ChildProcessWithoutNullStreams;
  enviar(msg: object): void;
  resposta(id: number): Promise<Record<string, unknown>>;
  saida(): Promise<{ codigo: number | null; sinal: NodeJS.Signals | null }>;
  stderr(): string;
}

function iniciar(args: string[]): Processo {
  const filho = spawn(
    process.execPath,
    ["--conditions=@mcp-imposto-de-renda/source", "--import", CARREGADOR, ENTRADA, ...args],
    { cwd: RAIZ, stdio: ["pipe", "pipe", "pipe"] },
  );
  vivos.add(filho);
  let buffer = "";
  let erros = "";
  const respostas = new Map<number, Record<string, unknown>>();
  const esperando = new Map<number, (r: Record<string, unknown>) => void>();
  const naoJson: string[] = [];
  filho.stdout.setEncoding("utf8");
  filho.stderr.setEncoding("utf8");
  filho.stderr.on("data", (d: string) => {
    erros += d;
  });
  filho.stdout.on("data", (d: string) => {
    buffer += d;
    let i = buffer.indexOf("\n");
    while (i >= 0) {
      const linha = buffer.slice(0, i).trim();
      buffer = buffer.slice(i + 1);
      i = buffer.indexOf("\n");
      if (!linha) continue;
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(linha) as Record<string, unknown>;
      } catch {
        naoJson.push(linha);
        continue;
      }
      if (typeof msg.id === "number") {
        respostas.set(msg.id, msg);
        esperando.get(msg.id)?.(msg);
      }
    }
  });
  const fim = new Promise<{ codigo: number | null; sinal: NodeJS.Signals | null }>((ok) =>
    filho.on("exit", (codigo, sinal) => ok({ codigo, sinal })),
  );
  return {
    filho,
    enviar: (msg) => filho.stdin.write(`${JSON.stringify(msg)}\n`),
    resposta: (id) =>
      new Promise((ok, falha) => {
        const pronta = respostas.get(id);
        if (pronta) return ok(pronta);
        const t = setTimeout(
          () => falha(new Error(`sem resposta ${id}; stderr: ${erros}`)),
          15_000,
        );
        esperando.set(id, (r) => {
          clearTimeout(t);
          ok(r);
        });
      }),
    saida: () => fim,
    stderr: () => {
      if (naoJson.length > 0) throw new Error(`stdout com texto fora do protocolo: ${naoJson[0]}`);
      return erros;
    },
  };
}

async function inicializar(p: Processo): Promise<Record<string, unknown>> {
  p.enviar({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "teste", version: "0" },
    },
  });
  const r = await p.resposta(1);
  p.enviar({ jsonrpc: "2.0", method: "notifications/initialized" });
  return r;
}

describe("mcp-imposto-de-renda via stdio", () => {
  it("responde initialize, tools/list e tools/call e sai ao fechar o stdin", async () => {
    const p = iniciar(["--dir", pasta]);
    const init = await inicializar(p);
    expect(init.result).toMatchObject({ serverInfo: { name: "mcp-imposto-de-renda" } });

    p.enviar({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
    const lista = (await p.resposta(2)).result as { tools: { name: string }[] };
    expect(lista.tools.map((t) => t.name)).toContain("simular_imposto");
    expect(lista.tools.map((t) => t.name)).toContain("converter_modelo_para_dbk");

    p.enviar({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "simular_imposto",
        arguments: {
          titular: { cpf: "52998224725", nome: "TITULAR SECRETO" },
          rendimentosPJ: [{ rendimento: "80.000,00", irrf: "9.000,00" }],
        },
      },
    });
    const chamada = (await p.resposta(3)).result as {
      isError?: boolean;
      structuredContent: { modeloMaisVantajoso: string };
    };
    expect(chamada.isError).toBeFalsy();
    expect(["completo", "simplificado"]).toContain(chamada.structuredContent.modeloMaisVantajoso);

    p.filho.stdin.end();
    expect(await p.saida()).toEqual({ codigo: 0, sinal: null });
    const log = p.stderr();
    expect(log).toContain("pronto");
    expect(log).not.toContain("TITULAR SECRETO");
    expect(log).not.toContain("52998224725");
  }, 30_000);

  it("responde as chamadas em andamento antes de sair quando o stdin fecha (revisão M4)", async () => {
    const p = iniciar(["--dir", pasta]);
    await inicializar(p);
    for (let id = 2; id <= 6; id++) {
      p.enviar({
        jsonrpc: "2.0",
        id,
        method: "tools/call",
        params: { name: "listar_arquivos", arguments: {} },
      });
    }
    p.filho.stdin.end();
    for (let id = 2; id <= 6; id++) {
      expect((await p.resposta(id)).result).toBeDefined();
    }
    expect(await p.saida()).toEqual({ codigo: 0, sinal: null });
  }, 30_000);

  it("no modo somente leitura não anuncia a ferramenta que grava", async () => {
    const p = iniciar(["--dir", pasta, "--somente-leitura"]);
    await inicializar(p);
    p.enviar({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
    const lista = (await p.resposta(2)).result as { tools: { name: string }[] };
    expect(lista.tools.map((t) => t.name)).not.toContain("converter_modelo_para_dbk");
    p.filho.kill("SIGTERM");
    expect(await p.saida()).toEqual({ codigo: 0, sinal: null });
  }, 30_000);

  it("encerra limpo com SIGINT", async () => {
    const p = iniciar(["--dir", pasta]);
    await inicializar(p);
    p.filho.kill("SIGINT");
    expect(await p.saida()).toEqual({ codigo: 0, sinal: null });
    expect(p.stderr()).toContain("encerrando (SIGINT)");
  }, 30_000);

  it("sem --dir, explica o erro em stderr e sai com código 2", async () => {
    const p = iniciar([]);
    expect((await p.saida()).codigo).toBe(2);
    expect(p.stderr()).toContain("--dir é obrigatório");
  }, 30_000);
});
