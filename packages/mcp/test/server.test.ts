import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calcularDvCnpj, calcularDvCpf } from "@mcp-imposto-de-renda/core";
import { afterAll, afterEach, describe, expect, it } from "vitest";
import { z } from "zod";
import { AVISO_LEGAL, type GrupoFerramentas, URI_AVISO_LEGAL } from "../src/index.js";
import { type Conexao, conectar, textoDe } from "./apoio.js";

const pasta = mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-srv-"));
afterAll(() => rmSync(pasta, { recursive: true, force: true }));

let conexao: Conexao | undefined;
afterEach(async () => {
  await conexao?.fechar();
  conexao = undefined;
});

async function abrir(...args: Parameters<typeof conectar>): Promise<Conexao> {
  conexao = await conectar(...args);
  return conexao;
}

const CALCULO = [
  "simular_imposto",
  "comparar_modelos",
  "explicar_calculo",
  "calcular_quotas",
  "calcular_multa_atraso",
  "consultar_parametros",
];
const ARQUIVOS = [
  "abrir_declaracao",
  "converter_dbk_para_modelo",
  "converter_modelo_para_dbk",
  "ler_ficha",
  "listar_arquivos",
  "verificar_integridade_arquivo",
];
const SEMPRE = ["validar_documento", "validar_declaracao", "listar_tabela", "buscar_codigo"];

describe("registro de ferramentas", () => {
  it("com pasta autorizada, registra todos os grupos", async () => {
    const { client } = await abrir({ diretorioAutorizado: pasta });
    const nomes = (await client.listTools()).tools.map((t) => t.name).sort();
    for (const n of [...CALCULO, ...ARQUIVOS, ...SEMPRE]) expect(nomes).toContain(n);
    expect(new Set(nomes).size).toBe(nomes.length);
  });

  it("sem pasta autorizada, omite as ferramentas de arquivo", async () => {
    const { client } = await abrir();
    const nomes = (await client.listTools()).tools.map((t) => t.name).sort();
    for (const n of [...CALCULO, ...SEMPRE]) expect(nomes).toContain(n);
    for (const n of ARQUIVOS) expect(nomes).not.toContain(n);
  });

  it("no modo somente leitura, omite a ferramenta que grava", async () => {
    const { client } = await abrir({ diretorioAutorizado: pasta, somenteLeitura: true });
    const nomes = (await client.listTools()).tools.map((t) => t.name);
    expect(nomes).not.toContain("converter_modelo_para_dbk");
    expect(nomes).toContain("abrir_declaracao");
    const completo = await conectar({ diretorioAutorizado: pasta });
    const todas = (await completo.client.listTools()).tools;
    await completo.fechar();
    const escrita = todas.filter((t) => t.annotations?.readOnlyHint === false).map((t) => t.name);
    expect(escrita.length).toBeGreaterThan(10);
    expect(nomes.sort()).toEqual(
      todas
        .map((t) => t.name)
        .filter((n) => !escrita.includes(n))
        .sort(),
    );
  });

  it("toda ferramenta tem título, descrição, outputSchema e anotações coerentes", async () => {
    const { client } = await abrir({ diretorioAutorizado: pasta });
    for (const t of (await client.listTools()).tools) {
      expect(t.title, t.name).toBeTruthy();
      expect(t.description?.length ?? 0, t.name).toBeGreaterThan(30);
      expect(t.outputSchema, t.name).toBeDefined();
      expect(t.annotations?.openWorldHint, t.name).toBe(false);
      if (t.annotations?.readOnlyHint === false) {
        expect(t.annotations, t.name).toMatchObject({ readOnlyHint: false, destructiveHint: true });
      } else {
        expect(t.annotations, t.name).toMatchObject({
          readOnlyHint: true,
          destructiveHint: false,
          idempotentHint: true,
        });
      }
    }
  });

  it("aceita grupos extras pelo ponto de extensão", async () => {
    const extra: GrupoFerramentas = {
      nome: "fichas",
      descricao: "teste",
      registrar(r) {
        r.ferramenta(
          "eco",
          {
            titulo: "Eco",
            descricao: "Devolve o texto recebido.",
            entrada: { t: z.string() },
            saida: { t: z.string() },
          },
          ({ t }) => ({ texto: t, dados: { t } }),
        );
      },
    };
    const { chamar } = await abrir({ grupos: [extra] });
    const r = await chamar("eco", { t: "oi" });
    expect(r.structuredContent).toEqual({ t: "oi" });
  });
});

describe("erros padronizados", () => {
  it("erro inesperado vira mensagem genérica sem stack nem detalhes", async () => {
    const observados: string[] = [];
    const quebra: GrupoFerramentas = {
      nome: "calculo",
      descricao: "teste",
      registrar(r) {
        r.ferramenta(
          "quebra",
          { titulo: "Quebra", descricao: "Sempre falha.", entrada: {}, saida: {} },
          () => {
            throw new Error("CPF 52998224725 em /Users/alguem/segredo");
          },
        );
      },
    };
    const { chamar } = await abrir({ grupos: [quebra], registrarErro: (f) => observados.push(f) });
    const r = await chamar("quebra");
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toContain("Erro interno ao executar quebra");
    expect(textoDe(r)).not.toMatch(/52998224725|segredo|at |\.ts:/);
    expect(observados).toEqual(["quebra"]);
  });

  it("entrada fora do schema é recusada com isError", async () => {
    const { chamar } = await abrir();
    const r = await chamar("validar_documento", {});
    expect(r.isError).toBe(true);
  });
});

describe("validar_documento", () => {
  it("valida CPF e CNPJ sintéticos", async () => {
    const { chamar } = await abrir();
    const cpf = `246813579${calcularDvCpf("246813579")}`;
    expect((await chamar("validar_documento", { documento: cpf })).structuredContent).toEqual({
      tipo: "cpf",
      valido: true,
      normalizado: cpf,
    });
    const base = "135792460001";
    const cnpj = `${base}${calcularDvCnpj(base)}`;
    const r2 = await chamar("validar_documento", {
      documento: `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`,
    });
    expect(r2.structuredContent).toEqual({ tipo: "cnpj", valido: true, normalizado: cnpj });
  });

  it("informa documento inválido sem erro de protocolo", async () => {
    const { chamar } = await abrir();
    const r = await chamar("validar_documento", { documento: "000" });
    expect(r.isError).toBeFalsy();
    expect(r.structuredContent).toMatchObject({ tipo: "desconhecido", valido: false });
  });

  it("valida recibo, CEP, Renavam e conta bancária pelo tipo", async () => {
    const { chamar } = await abrir();
    const recibo = await chamar("validar_documento", {
      documento: "12.34.56.78.90-12",
      tipo: "recibo",
    });
    expect(recibo.structuredContent).toMatchObject({ valido: true, normalizado: "123456789012" });
    const cep = await chamar("validar_documento", { documento: "7004", tipo: "cep" });
    expect(cep.structuredContent).toMatchObject({ tipo: "cep", valido: false });
    // Renavam 0063972448 + DV: soma 0*3+0*2+6*9+3*8+9*7+7*6+2*5+4*4+4*3+8*2 = 237; 2370 mod 11 = 5.
    const renavam = await chamar("validar_documento", {
      documento: "00639724485",
      tipo: "renavam",
    });
    expect(renavam.structuredContent).toMatchObject({ valido: true });
    const conta = await chamar("validar_documento", {
      documento: "210169-6",
      tipo: "conta_bancaria",
      banco: "001",
      agencia: "1234",
    });
    expect(conta.structuredContent).toMatchObject({
      valido: true,
      normalizado: "001/1234/210169-6",
    });
  });
});

describe("prompts e recursos", () => {
  it("oferece os prompts de preparo e de revisão em pt-BR", async () => {
    const { client } = await abrir();
    const nomes = (await client.listPrompts()).prompts.map((p) => p.name).sort();
    expect(nomes).toEqual(["preparar_declaracao", "revisar_malha_fina"]);
    const p = await client.getPrompt({
      name: "preparar_declaracao",
      arguments: { arquivo: "x.DBK" },
    });
    const msg = p.messages[0]?.content;
    expect(msg?.type === "text" ? msg.text : "").toContain("abrir_declaracao");
    const m = await client.getPrompt({ name: "revisar_malha_fina", arguments: {} });
    expect(m.messages[0]?.content.type).toBe("text");
  });

  it("publica o aviso legal como recurso", async () => {
    const { client } = await abrir();
    const { resources } = await client.listResources();
    expect(resources.map((r) => r.uri)).toContain(URI_AVISO_LEGAL);
    const lido = await client.readResource({ uri: URI_AVISO_LEGAL });
    const conteudo = lido.contents[0];
    expect(conteudo && "text" in conteudo ? conteudo.text : "").toBe(AVISO_LEGAL);
    expect(AVISO_LEGAL).toMatch(/não é serviço oficial/i);
    expect(AVISO_LEGAL).toMatch(/provedor de LLM/);
    expect(AVISO_LEGAL).toMatch(/programa oficial/);
  });
});
