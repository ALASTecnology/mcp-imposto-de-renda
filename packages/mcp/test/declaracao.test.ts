import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lerArquivo, verificarControles } from "@mcp-imposto-de-renda/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PASTA_BACKUPS } from "../src/index.js";
import { type Conexao, conectar, declaracaoSintetica, fixture, textoDe } from "./apoio.js";

let base: string;
let pasta: string;
let c: Conexao;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-decl-")));
  pasta = join(base, "ir");
  rmSync(pasta, { recursive: true, force: true });
  await import("node:fs/promises").then((f) => f.mkdir(pasta));
  writeFileSync(join(pasta, "pj.DBK"), fixture("pj-simples-01.DBK"));
  writeFileSync(join(pasta, "carne.DEC"), fixture("carne-leao-01.DEC"));
  writeFileSync(join(base, "fora.DBK"), fixture("pj-simples-01.DBK"));
  c = await conectar({
    diretorioAutorizado: pasta,
    relogio: () => new Date(Date.UTC(2026, 9, 14, 15, 30, 0)),
  });
});

afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

describe("listar_arquivos", () => {
  it("lista os arquivos da pasta autorizada", async () => {
    writeFileSync(join(pasta, "notas.txt"), "x");
    const r = await c.chamar("listar_arquivos");
    const nomes = (r.structuredContent as { arquivos: { nome: string }[] }).arquivos.map(
      (a) => a.nome,
    );
    expect(nomes).toEqual(["carne.DEC", "notas.txt", "pj.DBK"]);
  });
});

describe("abrir_declaracao", () => {
  it("resume contribuinte, fichas e controles", async () => {
    const r = await c.chamar("abrir_declaracao", { arquivo: "pj.DBK" });
    expect(r.isError).toBeFalsy();
    const s = r.structuredContent as Record<string, unknown>;
    expect(s).toMatchObject({
      exercicio: 2026,
      contribuinte: { nome: "ANA FICTICIA PRIMEIRA" },
      tipoDeclaracao: "ajusteAnual",
      modeloValido: true,
      controlesValidos: true,
      tiposNaoConvertidos: [],
    });
    const fichas = s.fichas as { ficha: string; itens: number; totais: Record<string, string> }[];
    expect(fichas.find((f) => f.ficha === "rendimentosPJ")).toMatchObject({
      itens: 1,
      totais: { rendimentos: "6000000", impostoRetido: "500000" },
    });
    expect(textoDe(r)).toContain("R$ 60.000,00");
  });

  it("abre também o DEC", async () => {
    const r = await c.chamar("abrir_declaracao", { arquivo: "carne.DEC" });
    expect(r.isError).toBeFalsy();
  });

  it.each([
    ["../fora.DBK", /sai da pasta autorizada/],
    ["/etc/fora.DBK", /absoluto/],
    ["pj.exe", /Extensão não permitida/],
    ["nao-existe.DBK", /não encontrado/],
  ])("recusa %s com mensagem útil e sem caminho absoluto", async (arquivo, msg) => {
    const r = await c.chamar("abrir_declaracao", { arquivo });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(msg);
    expect(textoDe(r)).not.toContain(join(base, "ir"));
  });

  it("recusa link simbólico para fora", async () => {
    symlinkSync(join(base, "fora.DBK"), join(pasta, "atalho.DBK"));
    const r = await c.chamar("abrir_declaracao", { arquivo: "atalho.DBK" });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/link simbólico/);
  });

  it("explica arquivo malformado sem repetir o conteúdo", async () => {
    writeFileSync(join(pasta, "ruim.DBK"), "IRPF    2026SEGREDO-DO-USUARIO\r\n");
    const r = await c.chamar("abrir_declaracao", { arquivo: "ruim.DBK" });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/Arquivo da declaração inválido/);
    expect(textoDe(r)).not.toContain("SEGREDO");
  });
});

describe("converter_dbk_para_modelo e converter_modelo_para_dbk", () => {
  it("ida e volta pela pasta autorizada, com backup ao sobrescrever", async () => {
    const lido = await c.chamar("converter_dbk_para_modelo", { arquivo: "pj.DBK" });
    const s = lido.structuredContent as {
      declaracao: Record<string, unknown>;
      modeloValido: boolean;
    };
    expect(s.modeloValido).toBe(true);
    const rend = (s.declaracao.rendimentosPJ as { rendimentos: number }[])[0];
    expect(rend?.rendimentos).toBe(6_000_000);

    const gravado = await c.chamar("converter_modelo_para_dbk", {
      declaracao: s.declaracao,
      arquivo_destino: "pj.DBK",
      arquivo_base: "pj.DBK",
    });
    expect(gravado.isError).toBeFalsy();
    expect(gravado.structuredContent).toMatchObject({
      arquivo: "pj.DBK",
      controlesValidos: true,
      backup: `${PASTA_BACKUPS}/pj.DBK.20261014T153000Z.bak`,
    });
    expect(readFileSync(join(pasta, PASTA_BACKUPS, "pj.DBK.20261014T153000Z.bak"))).toEqual(
      Buffer.from(fixture("pj-simples-01.DBK")),
    );
    const novo = lerArquivo(readFileSync(join(pasta, "pj.DBK")));
    expect(verificarControles(novo.registros).valido).toBe(true);
    expect(novo.registros.map((r) => r.tipo)).toEqual(["IR", "16", "17", "18", "21", "24", "T9"]);
  });

  it("grava declaração nova a partir do modelo, sem arquivo base", async () => {
    const r = await c.chamar("converter_modelo_para_dbk", {
      declaracao: declaracaoSintetica() as Record<string, unknown>,
      arquivo_destino: "nova.DBK",
    });
    expect(r.isError).toBeFalsy();
    expect((r.structuredContent as { backup: unknown }).backup).toBeNull();
    const aberta = await c.chamar("abrir_declaracao", { arquivo: "nova.DBK" });
    expect(aberta.structuredContent).toMatchObject({
      contribuinte: { nome: "FULANA FICTICIA" },
      controlesValidos: true,
    });
  });

  it("só grava .DBK e nunca fora da pasta", async () => {
    const declaracao = declaracaoSintetica() as Record<string, unknown>;
    for (const arquivo_destino of ["x.DEC", "x.json", "../x.DBK", "/tmp/x.DBK"]) {
      const r = await c.chamar("converter_modelo_para_dbk", { declaracao, arquivo_destino });
      expect(r.isError, arquivo_destino).toBe(true);
    }
    expect(existsSync(join(base, "x.DBK"))).toBe(false);
  });

  it("modelo inválido é explicado e nada é gravado", async () => {
    const r = await c.chamar("converter_modelo_para_dbk", {
      declaracao: { identificacao: { nome: "" } },
      arquivo_destino: "invalida.DBK",
    });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/identificacao/);
    expect(readdirSync(pasta)).not.toContain("invalida.DBK");
  });

  it("no modo somente leitura a gravação não existe", async () => {
    const leitura = await conectar({ diretorioAutorizado: pasta, somenteLeitura: true });
    try {
      const r = await leitura.chamar("converter_modelo_para_dbk", {
        declaracao: declaracaoSintetica() as Record<string, unknown>,
        arquivo_destino: "nova.DBK",
      });
      expect(r.isError).toBe(true);
      expect(existsSync(join(pasta, "nova.DBK"))).toBe(false);
    } finally {
      await leitura.fechar();
    }
  });
});

describe("ler_ficha, validar_declaracao e verificar_integridade_arquivo", () => {
  it("lê só a ficha pedida", async () => {
    const r = await c.chamar("ler_ficha", { arquivo: "pj.DBK", ficha: "rendimentosPJ" });
    expect(r.structuredContent).toMatchObject({ ficha: "rendimentosPJ", itens: 1 });
  });

  it("valida a declaração vinda de arquivo e de JSON", async () => {
    const doArquivo = await c.chamar("validar_declaracao", { arquivo: "pj.DBK" });
    expect(doArquivo.isError).toBeFalsy();
    expect(doArquivo.structuredContent).toMatchObject({ origem: "pj.DBK" });
    writeFileSync(join(pasta, "modelo.json"), JSON.stringify(declaracaoSintetica()));
    const doJson = await c.chamar("validar_declaracao", { arquivo: "modelo.json" });
    expect(doJson.isError).toBeFalsy();
    const inline = await c.chamar("validar_declaracao", {
      declaracao: declaracaoSintetica() as Record<string, unknown>,
    });
    expect(inline.structuredContent).toMatchObject({ origem: "modelo informado" });
    expect(typeof (inline.structuredContent as { podeEntregar: unknown }).podeEntregar).toBe(
      "boolean",
    );
  });

  it("exige exatamente uma origem na validação", async () => {
    const r = await c.chamar("validar_declaracao", {});
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/exatamente um/);
  });

  it("aponta divergência de controle em arquivo editado à mão", async () => {
    const bytes = Buffer.from(fixture("pj-simples-01.DBK"));
    const texto = bytes
      .toString("latin1")
      .replaceAll("ANA FICTICIA PRIMEIRA", "ANA FICTICIA PRIMEIRO");
    writeFileSync(join(pasta, "editado.DBK"), Buffer.from(texto, "latin1"));
    const ok = await c.chamar("verificar_integridade_arquivo", { arquivo: "pj.DBK" });
    expect(ok.structuredContent).toMatchObject({ valido: true, totalDivergencias: 0 });
    const ruim = await c.chamar("verificar_integridade_arquivo", { arquivo: "editado.DBK" });
    const s = ruim.structuredContent as { valido: boolean; divergencias: { campo: string }[] };
    expect(s.valido).toBe(false);
    expect(s.divergencias.map((d) => d.campo)).toContain("NR_CONTROLE");
  });
});

describe("tabelas", () => {
  it("lista com filtro sem acentos e busca código exato", async () => {
    const l = await c.chamar("listar_tabela", { tabela: "dependentes", filtro: "conjuge" });
    expect((l.structuredContent as { total: number }).total).toBeGreaterThan(0);
    const b = await c.chamar("buscar_codigo", { tabela: "bens-direitos", codigo: "01.11" });
    expect(b.structuredContent).toMatchObject({ encontrado: true });
    const n = await c.chamar("buscar_codigo", { tabela: "pagamentos", codigo: "999" });
    expect(n.structuredContent).toMatchObject({ encontrado: false, entrada: null });
  });
});

describe("gerar_arquivo_entrega", () => {
  it("gera do DBK a DEC igual à do programa oficial e avisa que a transmissão é no programa", async () => {
    const r = await c.chamar("gerar_arquivo_entrega", { arquivo: "pj.DBK" });
    expect(r.isError, textoDe(r)).toBeFalsy();
    expect(r.structuredContent).toMatchObject({
      arquivo: "pj.DEC",
      controlesValidos: true,
      backup: null,
    });
    const gerado = readFileSync(join(pasta, "pj.DEC"));
    expect(Buffer.compare(gerado, Buffer.from(fixture("pj-simples-01.DEC")))).toBe(0);
    expect(textoDe(r)).toMatch(/programa oficial/);
    expect(textoDe(r)).toMatch(/não transmite/);
  });

  it("não sobrescreve sem pedir e guarda cópia quando sobrescreve", async () => {
    await c.chamar("gerar_arquivo_entrega", { arquivo: "pj.DBK", arquivo_destino: "x.DEC" });
    const recusa = await c.chamar("gerar_arquivo_entrega", {
      arquivo: "pj.DBK",
      arquivo_destino: "x.DEC",
    });
    expect(recusa.isError).toBe(true);
    expect(textoDe(recusa)).toMatch(/sobrescrever/);
    const ok = await c.chamar("gerar_arquivo_entrega", {
      arquivo: "pj.DBK",
      arquivo_destino: "x.DEC",
      sobrescrever: true,
    });
    expect(ok.isError).toBeFalsy();
    expect((ok.structuredContent as { backup: string | null }).backup).toMatch(/x\.DEC/);
    expect(existsSync(join(pasta, PASTA_BACKUPS))).toBe(true);
  });

  it("só grava .DEC dentro da pasta e recusa declaração com erro sem confirmação", async () => {
    for (const arquivo_destino of ["x.DBK", "../x.DEC", "/tmp/x.DEC"]) {
      const r = await c.chamar("gerar_arquivo_entrega", { arquivo: "pj.DBK", arquivo_destino });
      expect(r.isError, arquivo_destino).toBe(true);
    }
    expect(existsSync(join(base, "x.DEC"))).toBe(false);
    const declaracao = declaracaoSintetica();
    // Dependente nascido depois do ano-calendário: erro que impede a entrega.
    declaracao.dependentes = [
      { ...(declaracao.dependentes?.[0] ?? {}), dataNascimento: "2027-01-01" },
    ] as never;
    const gravada = await c.chamar("converter_modelo_para_dbk", {
      declaracao: declaracao as Record<string, unknown>,
      arquivo_destino: "nova.DBK",
    });
    expect(gravada.isError, textoDe(gravada)).toBeFalsy();
    const r = await c.chamar("gerar_arquivo_entrega", { arquivo: "nova.DBK" });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/aceitar_pendencias/);
    expect(existsSync(join(pasta, "nova.DEC"))).toBe(false);
    const forcado = await c.chamar("gerar_arquivo_entrega", {
      arquivo: "nova.DBK",
      aceitar_pendencias: true,
    });
    expect(forcado.isError, textoDe(forcado)).toBeFalsy();
    expect(existsSync(join(pasta, "nova.DEC"))).toBe(true);
  });

  it("no modo somente leitura a ferramenta não existe", async () => {
    const leitura = await conectar({ diretorioAutorizado: pasta, somenteLeitura: true });
    try {
      const r = await leitura.chamar("gerar_arquivo_entrega", { arquivo: "pj.DBK" });
      expect(r.isError).toBe(true);
      expect(existsSync(join(pasta, "pj.DEC"))).toBe(false);
    } finally {
      await leitura.fechar();
    }
  });
});
