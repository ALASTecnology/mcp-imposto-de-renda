/**
 * `listar_ganhos_capital` mostra também os registros do GCAP que o modelo não tipa (64, 67, 70
 * a 73, 75 a 78), decodificados pelo leiaute. O registro de teste é sintético.
 */
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gravarArquivo, LEIAUTE_2026, lerArquivo, type Registro } from "@mcp-imposto-de-renda/core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let c: Conexao;

function registro75(cpf: string): Registro {
  const tipo = LEIAUTE_2026.tipos.find((t) => t.id === "75");
  if (!tipo) throw new Error("sem registro 75");
  const campos: Record<string, Registro["campos"][string]> = {};
  for (const f of tipo.campos) campos[f.chave] = f.formato === "N" ? 0n : "";
  Object.assign(campos, {
    NR_REG: 75n,
    NR_CPF: BigInt(cpf),
    NR_CPF_BENEFICIARIO: BigInt(cpf),
    NR_IDENTIFICACAO: 1n,
    NR_OPERACAO: 1n,
    IN_TIPO: 1n,
    VR_FAIXA1_TOTAL: 12_345_67n,
  });
  return { tipo: "75", campos };
}

beforeAll(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-gcap-")));
  const pasta = join(base, "ir");
  mkdirSync(pasta);
  const lido = lerArquivo(fixture("pj-simples-01.DBK"));
  const header = lido.registros.find((r) => r.tipo === "IR");
  const cpf = String(header?.campos.NR_CPF ?? "");
  const registros = [...lido.registros];
  registros.splice(registros.length - 1, 0, registro75(cpf));
  writeFileSync(join(pasta, "gcap.DBK"), gravarArquivo(registros));
  c = await conectar({ diretorioAutorizado: pasta });
});
afterAll(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

describe("listar_ganhos_capital", () => {
  it("decodifica os registros complementares com a descrição do leiaute", async () => {
    const r = await c.chamar("listar_ganhos_capital", { arquivo: "gcap.DBK" });
    expect(r.isError, textoDe(r)).toBeFalsy();
    const comp = (r.structuredContent as { complementares: Record<string, unknown>[] })
      .complementares;
    expect(comp).toHaveLength(1);
    expect(comp[0]).toMatchObject({
      tipo: "75",
      descricao: "GANHOS DE CAPITAL - FAIXAS TRIBUTACAO",
    });
    const campos = comp[0]?.campos as Record<string, string>;
    expect(campos["VR_FAIXA1_TOTAL (Ganho total tributável da primeira faixa de imposto)"]).toBe(
      "12345,67",
    );
    expect(textoDe(r)).toMatch(/Registros complementares/);
  });
});
