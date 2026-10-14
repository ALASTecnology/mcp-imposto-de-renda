/**
 * Regressões dos achados da revisão independente (pasta autorizada, cópias de segurança,
 * gravação do modelo, anotações e cálculos). Cada teste reproduz o cenário do achado e exige o
 * comportamento corrigido. Dados fictícios.
 */
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lerArquivo, registrosParaModelo, verificarControles, zDeclaracao } from "@autoir/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let pasta: string;
let c: Conexao;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "autoir-revisao-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
  writeFileSync(join(pasta, "pj.DBK"), fixture("pj-simples-01.DBK"));
  writeFileSync(join(pasta, "trib.DEC"), fixture("tributacao-exclusiva-01.DEC"));
  writeFileSync(join(pasta, "doa.DBK"), fixture("doacoes-eca-idoso-01.DBK"));
  c = await conectar({ diretorioAutorizado: pasta, maxBackups: 2 });
});

afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

const modelo = (nome: string) =>
  zDeclaracao.parse(
    registrosParaModelo(lerArquivo(new Uint8Array(readFileSync(join(pasta, nome)))).registros)
      .declaracao,
  );

async function ok(nome: string, args: Record<string, unknown>) {
  const r = await c.chamar(nome, args);
  expect(r.isError, `${nome}: ${textoDe(r)}`).toBeFalsy();
  return r.structuredContent as Record<string, unknown>;
}

describe("cópias de segurança", () => {
  it("B1: 'a__b.DBK' e 'a/b.DBK' têm cópias distintas", async () => {
    mkdirSync(join(pasta, "a"));
    writeFileSync(join(pasta, "a__b.DBK"), fixture("pj-simples-01.DBK"));
    writeFileSync(join(pasta, "a", "b.DBK"), fixture("pj-simples-01.DBK"));
    await ok("gravar_copia_seguranca", {
      arquivo: "trib.DEC",
      arquivo_destino: "a__b.DBK",
      sobrescrever: true,
    });
    const copias = (await ok("listar_copias_seguranca", {})).copias as { arquivo: string }[];
    expect(copias.map((x) => x.arquivo)).toEqual(["a__b.DBK"]);
  });

  it("M1: restaurar não grava sobre o .DEC de entrega", async () => {
    await ok("gravar_copia_seguranca", {
      arquivo: "trib.DEC",
      arquivo_destino: "pj.DBK",
      sobrescrever: true,
    });
    const copia = ((await ok("listar_copias_seguranca", {})).copias as { copia: string }[])[0]
      ?.copia;
    const r = await c.chamar("restaurar_copia_seguranca", { copia, arquivo_destino: "trib.DEC" });
    expect(r.isError).toBe(true);
    expect(readFileSync(join(pasta, "trib.DEC"))).toEqual(
      Buffer.from(fixture("tributacao-exclusiva-01.DEC")),
    );
  });

  it("M2: muitas gravações não apagam a cópia do conteúdo original", async () => {
    const original = readFileSync(join(pasta, "pj.DBK"));
    for (let i = 0; i < 5; i++) {
      await ok("gravar_copia_seguranca", {
        arquivo: "trib.DEC",
        arquivo_destino: "pj.DBK",
        sobrescrever: true,
      });
    }
    const pastaB = join(pasta, ".autoir-backups");
    const nomes = readdirSync(pastaB);
    expect(nomes.length).toBeLessThanOrEqual(2);
    expect(nomes.some((n) => readFileSync(join(pastaB, n)).equals(original))).toBe(true);
  });

  it("M2: excluir exige repetir o nome do arquivo", async () => {
    const r = await c.chamar("excluir_declaracao", { arquivo: "pj.DBK", confirmar: "sim" });
    expect(r.isError).toBe(true);
    expect(existsSync(join(pasta, "pj.DBK"))).toBe(true);
  });

  it("B6: nome longo é recusado antes de criar a cópia de segurança", async () => {
    const nome = `${"x".repeat(236)}.DBK`;
    writeFileSync(join(pasta, nome), fixture("pj-simples-01.DBK"));
    const r = await c.chamar("gravar_copia_seguranca", {
      arquivo: "trib.DEC",
      arquivo_destino: nome,
      sobrescrever: true,
    });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/Nome longo/);
    expect(existsSync(join(pasta, ".autoir-backups"))).toBe(false);
  });

  it("M4: temporários de escrita interrompida são apagados ao abrir a pasta", async () => {
    const temporario = ".autoir-0f0e0d0c-0b0a-4908-8706-050403020100.tmp";
    writeFileSync(join(pasta, temporario), "dados pessoais");
    writeFileSync(join(pasta, ".outro.tmp"), "não é do AutoIR");
    const outra = await conectar({ diretorioAutorizado: pasta });
    try {
      await outra.chamar("listar_arquivos");
      expect(existsSync(join(pasta, temporario))).toBe(false);
      expect(existsSync(join(pasta, ".outro.tmp"))).toBe(true);
    } finally {
      await outra.fechar();
    }
  });
});

describe("gravação do modelo (M3)", () => {
  it("base DEC gera um DBK de verdade, validado, sem o recibo", async () => {
    const dec = (await ok("converter_dbk_para_modelo", { arquivo: "trib.DEC" })).declaracao;
    const r = await ok("converter_modelo_para_dbk", {
      declaracao: dec,
      arquivo_destino: "saida.DBK",
      arquivo_base: "trib.DEC",
    });
    const regs = lerArquivo(new Uint8Array(readFileSync(join(pasta, "saida.DBK")))).registros;
    expect(regs.some((x) => ["HR", "DR", "R9"].includes(x.tipo))).toBe(false);
    expect(verificarControles(regs, { tipoArquivo: "DBK" }).valido).toBe(true);
    expect(r).toMatchObject({ controlesValidos: true });
    expect(typeof r.podeEntregar).toBe("boolean");
    expect(Array.isArray(r.pendencias)).toBe(true);
  });
});

describe("listas compostas (B2)", () => {
  it("adicionar devolve a posição real do item incluído", async () => {
    const lista = await ok("listar_doacoes_diretas_declaracao", { arquivo: "doa.DBK" });
    const itens = lista.itens as { indice: number; item: Record<string, unknown> }[];
    const eca = itens.find((i) => i.item.fundo === "eca")?.item;
    const r = await ok("adicionar_doacao_direta_declaracao", {
      arquivo: "doa.DBK",
      item: { ...eca, valor: 777 },
    });
    const depois = (await ok("listar_doacoes_diretas_declaracao", { arquivo: "doa.DBK" }))
      .itens as { indice: number; item: Record<string, unknown> }[];
    expect(r.indice).toBe(depois.find((i) => i.item.valor === 777)?.indice);
  });
});

describe("cálculos e anotações", () => {
  it("B3: excedente do 13º da parcela isenta também é transferido", async () => {
    writeFileSync(join(pasta, "idoso.DBK"), fixture("idoso-65-parcela-isenta-01.DBK"));
    const lista = (
      await ok("listar_lancamentos", { arquivo: "idoso.DBK", ficha: "rendimentosIsentos" })
    ).itens as { indice: number; item: Record<string, unknown> }[];
    const i10 = lista.find((x) => x.item.codigo === "10");
    await ok("editar_lancamento", {
      arquivo: "idoso.DBK",
      ficha: "rendimentosIsentos",
      indice: i10?.indice,
      alteracoes: { valor: 0, decimoTerceiro: "100.000,00" },
    });
    const soma = () =>
      modelo("idoso.DBK").rendimentosPJ.reduce((s, p) => s + p.rendimentos + p.decimoTerceiro, 0n);
    const antes = soma();
    const r = await ok("transferir_excedente_isencao_65", { arquivo: "idoso.DBK" });
    const t = (r.transferencias as { excedente: string }[])[0];
    expect(BigInt(t?.excedente ?? "0")).toBeGreaterThan(0n);
    expect(soma() - antes).toBe(BigInt(t?.excedente ?? "0"));
  });

  it("B4: percentual numérico é aceito como no texto", async () => {
    const args = { saldo: "1.000,00", data_pagamento: "2026-12-31" };
    const numero = await c.chamar("gerar_darf", { ...args, selic_acumulada_mora: 1.1 });
    const texto = await c.chamar("gerar_darf", { ...args, selic_acumulada_mora: "1,10" });
    expect(numero.isError, textoDe(numero)).toBeFalsy();
    expect(numero.structuredContent).toEqual(texto.structuredContent);
    expect(
      (await c.chamar("gerar_darf", { ...args, selic_acumulada_mora: 5 })).isError,
    ).toBeFalsy();
  });

  it("B5: ferramentas que acrescentam não se anunciam idempotentes", async () => {
    const { tools } = await c.client.listTools();
    const ann = (n: string) => tools.find((t) => t.name === n)?.annotations;
    for (const n of [
      "adicionar_bem",
      "importar_informe_rendimentos",
      "criar_declaracao",
      "restaurar_copia_seguranca",
    ]) {
      expect(ann(n)?.idempotentHint, n).toBe(false);
    }
    expect(ann("listar_bens")?.idempotentHint).toBe(true);
  });
});

describe("conteúdo do arquivo devolvido ao cliente (M5)", () => {
  it("nomes e fichas vindos do arquivo chegam delimitados como dado", async () => {
    const abrir = await c.chamar("abrir_declaracao", { arquivo: "pj.DBK" });
    expect(textoDe(abrir)).toMatch(/<dados_do_arquivo origem="pj.DBK">/);
    const ficha = await c.chamar("ler_ficha", { arquivo: "pj.DBK", ficha: "rendimentosPJ" });
    expect(textoDe(ficha)).toMatch(/<dados_do_arquivo/);
  });
});
