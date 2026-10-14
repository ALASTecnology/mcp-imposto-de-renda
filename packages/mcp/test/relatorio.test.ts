/**
 * Relatório da declaração em Markdown, HTML e PDF (Imprimir Declaração, Imprimir Rendimentos
 * Recebidos de PF e Visualizar e salvar em PDF do programa oficial, com layout próprio).
 */
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  documentoParaHtml,
  documentoParaPdf,
  textoParaDocumento,
} from "../src/ferramentas/relatorio.js";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let pasta: string;
let c: Conexao;

beforeAll(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-relatorio-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
  writeFileSync(join(pasta, "pj.DBK"), fixture("pj-simples-01.DBK"));
  writeFileSync(join(pasta, "pf.DBK"), fixture("carne-leao-01.DBK"));
  c = await conectar({ diretorioAutorizado: pasta });
});
afterAll(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

async function ok(nome: string, args: Record<string, unknown>) {
  const r = await c.chamar(nome, args);
  expect(r.isError, `${nome}: ${textoDe(r)}`).toBeFalsy();
  return r.structuredContent as Record<string, unknown>;
}

/** Confere a tabela xref: cada deslocamento aponta para "N 0 obj". */
function conferirPdf(bytes: Uint8Array): { paginas: number; texto: string } {
  const texto = Buffer.from(bytes).toString("latin1");
  expect(texto.startsWith("%PDF-1.4")).toBe(true);
  expect(texto.trimEnd().endsWith("%%EOF")).toBe(true);
  const inicioXref = Number(/startxref\n(\d+)\n/.exec(texto)?.[1]);
  expect(texto.slice(inicioXref, inicioXref + 4)).toBe("xref");
  const linhas = texto.slice(inicioXref).split("\n");
  const total = Number(linhas[1]?.split(" ")[1]);
  for (let i = 1; i < total; i++) {
    const desloc = Number(linhas[2 + i]?.slice(0, 10));
    expect(texto.slice(desloc).startsWith(`${i} 0 obj`)).toBe(true);
  }
  const paginas = Number(/\/Type \/Pages \/Kids \[[^\]]*\] \/Count (\d+)/.exec(texto)?.[1]);
  return { paginas, texto };
}

describe("documento", () => {
  it("HTML escapa o conteúdo e não tem script nem metadado de gerador", () => {
    const html = documentoParaHtml(textoParaDocumento("# Título <x>\n\n- item & outro\ntexto"));
    expect(html).toContain("<h1>Título &lt;x&gt;</h1>");
    expect(html).toContain("<li>item &amp; outro</li>");
    expect(html).not.toMatch(/<script|generator/i);
  });

  it("PDF válido, com acentos em WinAnsi, parênteses escapados e várias páginas", () => {
    const linhas = Array.from({ length: 150 }, (_, i) => `- linha ${i} (ação)`);
    const pdf = documentoParaPdf(textoParaDocumento(`# Relação\n\n${linhas.join("\n")}`));
    const { paginas, texto } = conferirPdf(pdf);
    expect(paginas).toBeGreaterThan(1);
    expect(texto).toContain("\\(a\xe7\xe3o\\)");
    expect(texto).not.toMatch(/\/Producer|\/Creator|\/Author/);
  });
});

describe("gerar_relatorio_declaracao e gravar_relatorio", () => {
  it("sem partes devolve o resumo de sempre; com partes detalha as fichas", async () => {
    const resumo = await ok("gerar_relatorio_declaracao", { arquivo: "pj.DBK" });
    expect(String(resumo.relatorio)).toContain("## Totais");
    const det = await ok("gerar_relatorio_declaracao", {
      arquivo: "pj.DBK",
      partes: ["rendimentosPJ", "bens"],
    });
    const rel = String(det.relatorio);
    expect(rel).toContain("## Rendimentos Tributáveis Recebidos de Pessoa Jurídica");
    expect(rel).toMatch(/Rendimentos: R\$ [\d.]+,\d{2}/);
    expect(rel).not.toContain("## Dependentes");
  });

  it("parte rendimentos_pf e formato HTML", async () => {
    const det = await ok("gerar_relatorio_declaracao", {
      arquivo: "pf.DBK",
      partes: ["rendimentos_pf"],
      formato: "html",
    });
    const html = String(det.relatorio);
    expect(html).toMatch(/^<!doctype html>/);
    expect(html).toContain("Rendimentos Tributáveis Recebidos de Pessoa Física e do Exterior");
  });

  it("grava a declaração inteira em PDF e um texto de outra ferramenta em HTML", async () => {
    const s = await ok("gravar_relatorio", {
      arquivo: "pj.DBK",
      partes: ["todas"],
      formato: "pdf",
      arquivo_destino: "relatorio.pdf",
    });
    expect(s).toMatchObject({ arquivo: "relatorio.pdf", formato: "pdf" });
    const { texto } = conferirPdf(new Uint8Array(readFileSync(join(pasta, "relatorio.pdf"))));
    expect(texto).toContain("ANA FICTICIA PRIMEIRA");
    await ok("gravar_relatorio", {
      texto: "# Darf\n\n- Código 0211\n- Vencimento 29/05/2026",
      formato: "html",
      arquivo_destino: "darf.html",
    });
    expect(readFileSync(join(pasta, "darf.html"), "utf8")).toContain("<li>Código 0211</li>");
  });

  it("recusa extensão que não corresponde ao formato", async () => {
    const r = await c.chamar("gravar_relatorio", {
      arquivo: "pj.DBK",
      formato: "pdf",
      arquivo_destino: "x.html",
    });
    expect(r.isError).toBe(true);
  });
});
