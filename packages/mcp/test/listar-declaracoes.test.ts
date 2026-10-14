/**
 * `listar_declaracoes`: o equivalente às abas "Em Preenchimento" e "Transmitidas" da tela
 * inicial, à Relação de Declarações (Ctrl+L) e à sugestão de importar a declaração do ano
 * anterior.
 */
import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let pasta: string;
let c: Conexao;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-lista-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
  writeFileSync(join(pasta, "pj.DBK"), fixture("pj-simples-01.DBK"));
  writeFileSync(join(pasta, "idoso.DBK"), fixture("idoso-65-parcela-isenta-01.DBK"));
  writeFileSync(join(pasta, "trib.DEC"), fixture("tributacao-exclusiva-01.DEC"));
  // Arquivo do exercício anterior com o nome padrão do programa e conteúdo que não se lê.
  writeFileSync(join(pasta, "12345678909-IRPF-A-2025-2024-ORIGI.DEC"), "conteudo antigo");
  writeFileSync(join(pasta, "notas.txt"), "texto");
  c = await conectar({ diretorioAutorizado: pasta });
});
afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

type Item = Record<string, unknown>;

async function listar(args: Record<string, unknown> = {}) {
  const r = await c.chamar("listar_declaracoes", args);
  expect(r.isError, textoDe(r)).toBeFalsy();
  return { texto: textoDe(r), itens: (r.structuredContent as { declaracoes: Item[] }).declaracoes };
}

describe("listar_declaracoes", () => {
  it("lista DBK e DEC com nome, CPF, exercício, tipo, modelo e situação", async () => {
    const { itens } = await listar();
    expect(itens.map((i) => i.arquivo).sort()).toEqual([
      "12345678909-IRPF-A-2025-2024-ORIGI.DEC",
      "idoso.DBK",
      "pj.DBK",
      "trib.DEC",
    ]);
    const pj = itens.find((i) => i.arquivo === "pj.DBK");
    expect(pj).toMatchObject({
      nome: "ANA FICTICIA PRIMEIRA",
      exercicio: 2026,
      tipo: "ajusteAnual",
      retificadora: false,
      situacao: "emPreenchimento",
      anoAnterior: false,
    });
    expect(pj?.cpf).toMatch(/^\d{11}$/);
    expect(["completa", "simplificada"]).toContain(pj?.modelo);
    expect(itens.find((i) => i.arquivo === "trib.DEC")?.situacao).toBe("gravadaParaEntrega");
    const antiga = itens.find((i) => String(i.arquivo).includes("2025-2024"));
    expect(antiga).toMatchObject({
      cpf: "12345678909",
      exercicio: 2025,
      tipo: "ajusteAnual",
      retificadora: false,
      anoAnterior: true,
    });
  });

  it("marca como transmitida a declaração com recibo registrado e filtra por situação", async () => {
    const reg = await c.chamar("registrar_recibo", { arquivo: "trib.DEC", recibo: "123456789012" });
    expect(reg.isError, textoDe(reg)).toBeFalsy();
    const { itens } = await listar({ situacao: "transmitida" });
    expect(itens).toHaveLength(1);
    expect(itens[0]).toMatchObject({
      arquivo: "trib.DEC",
      situacao: "transmitida",
      recibo: "123456789012",
    });
  });

  it("pesquisa por nome sem diferenciar acentos e ordena pela coluna pedida", async () => {
    const { itens } = await listar({ nome: "fictícia" });
    expect(itens.map((i) => i.nome).sort()).toEqual([
      "ANA FICTICIA PRIMEIRA",
      "SILVIA FICTICIA APOSENTADA",
    ]);
    const ordenados = await listar({ ordenar_por: "nome" });
    const nomes = ordenados.itens.map((i) => String(i.nome ?? ""));
    expect(nomes).toEqual([...nomes].sort((a, b) => a.localeCompare(b, "pt-BR")));
  });

  it("o texto traz a relação e sugere importar a declaração do ano anterior", async () => {
    const { texto } = await listar();
    expect(texto).toMatch(/Relação de declarações/);
    expect(texto).toMatch(/importar_declaracao_anterior/);
  });
});
