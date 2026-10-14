/**
 * `importar_declaracao_anterior` e `importar_pre_preenchida`: começam a declaração de 2026 a
 * partir de outro arquivo, sem apagar em silêncio a que já existe.
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lerArquivo, registrosParaModelo, zDeclaracao } from "@mcp-imposto-de-renda/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type Conexao, conectar, fixture, paraLeiaute2025, textoDe } from "./apoio.js";

let base: string;
let pasta: string;
let c: Conexao;
let cpf: string;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-imp-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
  const bytes = fixture("pj-simples-01.DBK");
  cpf = zDeclaracao.parse(registrosParaModelo(lerArquivo(bytes).registros).declaracao).identificacao
    .cpf;
  writeFileSync(join(pasta, "anterior.DEC"), paraLeiaute2025(bytes));
  writeFileSync(join(pasta, "pre.DBK"), bytes);
  c = await conectar({ diretorioAutorizado: pasta });
});
afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

function modelo(nome: string) {
  const lido = lerArquivo(new Uint8Array(readFileSync(join(pasta, nome))));
  return zDeclaracao.parse(registrosParaModelo(lido.registros).declaracao);
}

async function ok(nome: string, args: Record<string, unknown>) {
  const r = await c.chamar(nome, args);
  expect(r.isError, `${nome}: ${textoDe(r)}`).toBeFalsy();
  return r.structuredContent as Record<string, unknown>;
}

describe("importar_declaracao_anterior", () => {
  it("cria a de 2026 com o nome padrão, sem valores de 2025 e com o relatório", async () => {
    const s = await ok("importar_declaracao_anterior", {
      arquivo: "anterior.DEC",
      recibo: "123456789012",
    });
    const destino = `${cpf}-IRPF-A-2026-2025-ORIGI.DBK`;
    expect(s.arquivo).toBe(destino);
    expect((s.importados as string[]).join(" ")).toMatch(/Identificação/);
    expect(s.recibo).toBe("123456789012");
    const d = modelo(destino);
    expect(d.exercicio).toBe(2026);
    // O campo do recibo do ano anterior no arquivo tem 10 posições: o número volta no resultado
    // e o aviso orienta a digitá-lo no programa oficial.
    expect((s.avisos as string[]).join(" ")).toMatch(/recibo/);
    expect(d.rendimentosPJ.every((p) => p.rendimentos === 0n && p.impostoRetido === 0n)).toBe(true);
  });

  it("usa o recibo registrado para o arquivo de 2025 e recusa sobrescrever", async () => {
    writeFileSync(
      join(pasta, "anterior.recibo.json"),
      JSON.stringify({
        tipo: "recibo-mcp-imposto-de-renda",
        cpf,
        exercicio: 2025,
        arquivo: "anterior.DEC",
        recibo: "999988887777",
        registradoEm: "2025-05-01T00:00:00.000Z",
      }),
    );
    const s = await ok("importar_declaracao_anterior", { arquivo: "anterior.DEC" });
    expect(s.recibo).toBe("999988887777");
    const r = await c.chamar("importar_declaracao_anterior", { arquivo: "anterior.DEC" });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/sobrescrever/);
  });

  it("recusa arquivo de 2026", async () => {
    const r = await c.chamar("importar_declaracao_anterior", { arquivo: "pre.DBK" });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/abrir_declaracao/);
  });
});

describe("importar_pre_preenchida", () => {
  it("cria a declaração com o nome padrão, preserva os dados e lista as fichas", async () => {
    const s = await ok("importar_pre_preenchida", { arquivo: "pre.DBK" });
    const destino = `${cpf}-IRPF-A-2026-2025-ORIGI.DBK`;
    expect(s.arquivo).toBe(destino);
    expect(existsSync(join(pasta, destino))).toBe(true);
    expect((s.fichas as string[]).join(" ")).toMatch(/Pessoa Jurídica/);
    expect(modelo(destino).rendimentosPJ).toEqual(modelo("pre.DBK").rendimentosPJ);
    const r = await c.chamar("importar_pre_preenchida", { arquivo: "pre.DBK" });
    expect(r.isError).toBe(true);
  });

  it("recusa o arquivo de 2025", async () => {
    const r = await c.chamar("importar_pre_preenchida", { arquivo: "anterior.DEC" });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/importar_declaracao_anterior/);
  });
});
