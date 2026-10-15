/**
 * Equivalentes no MCP de funções do programa oficial que não tinham ferramenta: o validador da
 * recepção (`pre_validar_entrega`), o Fechar do menu Declaração (`fechar_declaracao`), a função
 * de memória do programa (`diagnosticar_servidor`) e a avaliação do aplicativo (`enviar_sugestao`).
 */
import { mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  calcularNumeroControle,
  codificarRegistro,
  gravarArquivo,
  leiauteDosRegistros,
  lerArquivo,
  type Registro,
  recalcularControles,
} from "@mcp-imposto-de-renda/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { catalogoFerramentas } from "../src/index.js";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let pasta: string;
let c: Conexao;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-equiv-")));
  pasta = join(base, "minha-pasta-ir");
  await import("node:fs/promises").then((f) => f.mkdir(pasta));
  writeFileSync(join(pasta, "pj.DBK"), fixture("pj-simples-01.DBK"));
  writeFileSync(join(pasta, "pj.DEC"), fixture("pj-simples-01.DEC"));
  c = await conectar({
    diretorioAutorizado: pasta,
    relogio: () => new Date(Date.UTC(2026, 9, 14, 15, 30, 0)),
    ambiente: () => ({
      memoria: {
        rss: 104_857_600,
        heapTotal: 52_428_800,
        heapUsed: 31_457_280,
        external: 1_048_576,
      },
      node: "v22.20.0",
      plataforma: "darwin",
      arquitetura: "arm64",
    }),
  });
});

afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

type Verificacao = { id: string; situacao: string; detalhe: string };
const verificacoes = (r: { structuredContent?: unknown }) =>
  Object.fromEntries(
    (r.structuredContent as { verificacoes: Verificacao[] }).verificacoes.map((v) => [
      v.id,
      v.situacao,
    ]),
  );

/** Regrava os registros com os controles refeitos, para que só a alteração pedida divirja. */
function regravar(registros: Registro[]): Uint8Array {
  return gravarArquivo(recalcularControles(registros, { tipoArquivo: "DBK" }));
}

describe("anotações e perfis", () => {
  const novas = [
    "pre_validar_entrega",
    "fechar_declaracao",
    "diagnosticar_servidor",
    "enviar_sugestao",
  ];

  it("as quatro ferramentas são só leitura, sem rede, e entram nos perfis essencial e consulta", async () => {
    const lista = (await c.client.listTools()).tools;
    for (const nome of novas) {
      const t = lista.find((x) => x.name === nome);
      expect(t, nome).toBeDefined();
      expect(t?.annotations).toMatchObject({
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      });
    }
    for (const perfil of ["essencial", "consulta"] as const) {
      const nomes = catalogoFerramentas({ perfil }).map((f) => f.nome);
      for (const nome of novas) expect(nomes, `${perfil}: ${nome}`).toContain(nome);
    }
    const somenteLeitura = catalogoFerramentas({ somenteLeitura: true }).map((f) => f.nome);
    for (const nome of novas) expect(somenteLeitura).toContain(nome);
  });
});

describe("pre_validar_entrega", () => {
  it("declara apto o DEC do programa oficial, com todas as conferências do validador", async () => {
    const r = await c.chamar("pre_validar_entrega", { arquivo: "pj.DEC" });
    expect(r.isError, textoDe(r)).toBeFalsy();
    expect(r.structuredContent).toMatchObject({
      arquivo: "pj.DEC",
      tipoArquivo: "DEC",
      apto: true,
    });
    expect(verificacoes(r)).toEqual({
      tipo_arquivo: "ok",
      crc_linhas: "ok",
      controle_header: "ok",
      t9: "ok",
      hash_header: "ok",
      hash_r9: "ok",
      pendencias: "ok",
      totais: "ok",
    });
    expect(textoDe(r)).toMatch(/apto/i);
    expect(textoDe(r)).toMatch(/Receita/);
  });

  it("no DBK confere tudo, mas lembra que o arquivo de entrega é o DEC", async () => {
    const r = await c.chamar("pre_validar_entrega", { arquivo: "pj.DBK" });
    expect(r.structuredContent).toMatchObject({ tipoArquivo: "DBK", apto: true });
    const v = verificacoes(r);
    expect(v).toMatchObject({ tipo_arquivo: "aviso", hash_r9: "nao_se_aplica", crc_linhas: "ok" });
    expect(textoDe(r)).toContain("gerar_arquivo_entrega");
  });

  it("reprova o arquivo editado à mão (CRC da linha não confere)", async () => {
    const texto = Buffer.from(fixture("pj-simples-01.DBK"))
      .toString("latin1")
      .replaceAll("ANA FICTICIA PRIMEIRA", "ANA FICTICIA PRIMEIRO");
    writeFileSync(join(pasta, "editado.DBK"), Buffer.from(texto, "latin1"));
    const r = await c.chamar("pre_validar_entrega", { arquivo: "editado.DBK" });
    expect(r.structuredContent).toMatchObject({ apto: false });
    expect(verificacoes(r).crc_linhas).toBe("falha");
    expect(
      (r.structuredContent as { totalDivergenciasControle: number }).totalDivergenciasControle,
    ).toBeGreaterThan(0);
    expect(textoDe(r)).toMatch(/não está apto/);
  });

  it("aponta total do Resumo que não bate com o recálculo, mesmo com os controles certos", async () => {
    const { registros } = lerArquivo(fixture("pj-simples-01.DBK"));
    const copia = registros.map((reg) => ({ tipo: reg.tipo, campos: { ...reg.campos } }));
    const totais = copia.find((reg) => reg.tipo === "20") ?? copia.find((reg) => reg.tipo === "18");
    if (!totais) throw new Error("fixture sem registro de totais");
    const campo = "VR_BASECALC";
    totais.campos[campo] = (totais.campos[campo] as bigint) + 100n;
    writeFileSync(join(pasta, "totais.DBK"), regravar(copia));
    const r = await c.chamar("pre_validar_entrega", { arquivo: "totais.DBK" });
    const v = verificacoes(r);
    expect(v.crc_linhas).toBe("ok");
    expect(v.totais).toBe("falha");
    expect(r.structuredContent).toMatchObject({ apto: false });
    const div = (r.structuredContent as { totaisDivergentes: { campo: string }[] })
      .totaisDivergentes;
    expect(div.map((d) => d.campo)).toContain(campo);
  });

  it("reprova o DEC cujo hash do R9 foi alterado", async () => {
    const { registros } = lerArquivo(fixture("pj-simples-01.DEC"));
    const leiaute = leiauteDosRegistros(registros);
    const copia = registros.map((reg) => ({ tipo: reg.tipo, campos: { ...reg.campos } }));
    const i = copia.findIndex((reg) => reg.tipo === "R9");
    const r9 = copia[i];
    if (!r9) throw new Error("DEC sem R9");
    r9.campos.NR_HASH = 1n;
    r9.campos.NR_CONTROLE = calcularNumeroControle(
      codificarRegistro(r9, leiaute, i + 1).slice(0, -10),
    );
    writeFileSync(join(pasta, "r9.DEC"), gravarArquivo(copia, { leiaute }));
    const r = await c.chamar("pre_validar_entrega", { arquivo: "r9.DEC" });
    const v = verificacoes(r);
    expect(v.hash_r9).toBe("falha");
    expect(v.crc_linhas).toBe("ok");
    expect(r.structuredContent).toMatchObject({ apto: false });
  });
});

describe("fechar_declaracao", () => {
  it("confirma que nada ficou pendente e diz onde está a última cópia de segurança", async () => {
    const sem = await c.chamar("fechar_declaracao", { arquivo: "pj.DBK" });
    expect(sem.isError, textoDe(sem)).toBeFalsy();
    expect(sem.structuredContent).toMatchObject({
      arquivo: "pj.DBK",
      gravacaoPendente: false,
      controlesValidos: true,
      ultimaCopia: null,
      totalCopias: 0,
    });
    // Uma gravação cria a cópia automática do conteúdo anterior.
    const g = await c.chamar("gravar_copia_seguranca", {
      arquivo: "pj.DEC",
      arquivo_destino: "pj.DBK",
      sobrescrever: true,
    });
    expect(g.isError, textoDe(g)).toBeFalsy();
    const com = await c.chamar("fechar_declaracao", { arquivo: "pj.DBK" });
    const s = com.structuredContent as {
      ultimaCopia: { copia: string; criadaEm: string } | null;
      totalCopias: number;
    };
    expect(s.totalCopias).toBe(1);
    expect(s.ultimaCopia?.copia).toMatch(/^pj\.DBK/);
    expect(s.ultimaCopia?.criadaEm).toBe("2026-10-14T15:30:00Z");
    expect(textoDe(com)).toContain(s.ultimaCopia?.copia ?? "?");
    expect(textoDe(com)).not.toContain(pasta);
  });

  it("espera a gravação em andamento no mesmo arquivo antes de responder", async () => {
    const gravando = c.chamar("gravar_copia_seguranca", {
      arquivo: "pj.DEC",
      arquivo_destino: "pj.DBK",
      sobrescrever: true,
    });
    const fechando = c.chamar("fechar_declaracao", { arquivo: "pj.DBK" });
    const [, f] = await Promise.all([gravando, fechando]);
    // Qualquer que seja a ordem, a leitura nunca vê a gravação pela metade.
    expect(f.structuredContent).toMatchObject({ gravacaoPendente: false, controlesValidos: true });
  });

  it("acusa controles divergentes ao fechar", async () => {
    const texto = Buffer.from(fixture("pj-simples-01.DBK"))
      .toString("latin1")
      .replaceAll("ANA FICTICIA PRIMEIRA", "ANA FICTICIA PRIMEIRO");
    writeFileSync(join(pasta, "editado.DBK"), Buffer.from(texto, "latin1"));
    const r = await c.chamar("fechar_declaracao", { arquivo: "editado.DBK" });
    expect(r.structuredContent).toMatchObject({ controlesValidos: false });
    expect(textoDe(r)).toContain("verificar_integridade_arquivo");
  });
});

describe("diagnosticar_servidor", () => {
  it("mostra versão, perfil, grupos, pasta, modo e memória sem caminho absoluto", async () => {
    const r = await c.chamar("diagnosticar_servidor");
    expect(r.isError, textoDe(r)).toBeFalsy();
    const s = r.structuredContent as {
      versao: string;
      perfil: string;
      somenteLeitura: boolean;
      totalFerramentas: number;
      grupos: { nome: string; ferramentas: number }[];
      pasta: { configurada: boolean; nome: string | null };
      memoria: { rssMB: number; heapUsadoMB: number; heapTotalMB: number; externaMB: number };
      node: string;
      plataforma: string;
    };
    const total = (await c.client.listTools()).tools.length;
    expect(s).toMatchObject({
      versao: "0.1.0",
      perfil: "completo",
      somenteLeitura: false,
      totalFerramentas: total,
      pasta: { configurada: true, nome: "minha-pasta-ir" },
      memoria: { rssMB: 100, heapUsadoMB: 30, heapTotalMB: 50, externaMB: 1 },
      node: "v22.20.0",
      plataforma: "darwin arm64",
    });
    expect(s.grupos.reduce((n, g) => n + g.ferramentas, 0)).toBe(total);
    expect(s.grupos.map((g) => g.nome)).toContain("orientacao");
    const tudo = `${textoDe(r)}\n${JSON.stringify(s)}`;
    expect(tudo).not.toContain(base);
    expect(tudo).not.toContain(tmpdir());
  });

  it("reflete o perfil e o modo somente leitura de quem iniciou o servidor", async () => {
    const outro = await conectar({ perfil: "consulta", somenteLeitura: true });
    try {
      const r = await outro.chamar("diagnosticar_servidor");
      expect(r.structuredContent).toMatchObject({
        perfil: "consulta",
        somenteLeitura: true,
        pasta: { configurada: false, nome: null },
      });
      const total = (await outro.client.listTools()).tools.length;
      expect(r.structuredContent).toMatchObject({ totalFerramentas: total });
      expect(typeof (r.structuredContent as { memoria: { rssMB: number } }).memoria.rssMB).toBe(
        "number",
      );
    } finally {
      await outro.fechar();
    }
  });
});

describe("enviar_sugestao", () => {
  it("monta a issue com o modelo e devolve o link, sem acessar a rede", async () => {
    const r = await c.chamar("enviar_sugestao", {
      tipo: "sugestao",
      titulo: "Importar o informe em PDF",
      descricao: "Seria útil ler o informe de rendimentos direto do PDF do banco.",
      ferramenta: "importar_informe_rendimentos",
    });
    expect(r.isError, textoDe(r)).toBeFalsy();
    const s = r.structuredContent as {
      link: string;
      linkPreenchido: string;
      titulo: string;
      corpo: string;
      removidos: number;
    };
    expect(s.link).toBe("https://github.com/ALASTecnology/mcp-imposto-de-renda/issues/new");
    expect(s.linkPreenchido.startsWith(`${s.link}?`)).toBe(true);
    const url = new URL(s.linkPreenchido);
    expect(url.searchParams.get("title")).toBe(s.titulo);
    expect(url.searchParams.get("body")).toBe(s.corpo);
    expect(url.searchParams.get("labels")).toBe("enhancement");
    expect(s.titulo).toContain("Importar o informe em PDF");
    expect(s.corpo).toContain("importar_informe_rendimentos");
    expect(s.corpo).toContain("0.1.0");
    expect(s.removidos).toBe(0);
    expect(textoDe(r)).toContain(s.link);
  });

  it("tira CPF, CNPJ, valores, e-mail e números longos do texto", async () => {
    const r = await c.chamar("enviar_sugestao", {
      tipo: "problema",
      titulo: "Erro com o CPF 123.456.789-09",
      descricao:
        "No arquivo 12345678909-IRPF-A-2026-2025-ORIGI.DBK o imposto de R$ 1.234,56 saiu errado " +
        "para a fonte 11.222.333/0001-81; escrevam para fulana@exemplo.com.br. Valor 9.876,54.",
    });
    const s = r.structuredContent as { titulo: string; corpo: string; removidos: number };
    const tudo = `${s.titulo}\n${s.corpo}`;
    for (const proibido of [
      "123.456.789-09",
      "12345678909",
      "1.234,56",
      "11.222.333/0001-81",
      "fulana@exemplo.com.br",
      "9.876,54",
    ]) {
      expect(tudo, proibido).not.toContain(proibido);
    }
    expect(s.removidos).toBeGreaterThanOrEqual(6);
    expect(tudo).toContain("[removido]");
    expect(
      new URL((r.structuredContent as { linkPreenchido: string }).linkPreenchido).searchParams.get(
        "labels",
      ),
    ).toBe("bug");
    expect(textoDe(r)).toMatch(/removid/);
  });
});
