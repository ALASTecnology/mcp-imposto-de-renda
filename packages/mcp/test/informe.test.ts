/**
 * Leitura de informes colados (ler_informe e importar_informe_rendimentos) e regressões da
 * revisão: rótulo casado sem o valor (A1), substituição sem duplicar 13º e plano de saúde (A2)
 * e linhas hostis sem custo quadrático (A3). Dados fictícios.
 */
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lerArquivo, registrosParaModelo, zDeclaracao } from "@mcp-imposto-de-renda/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { campoDoRotulo, interpretarInforme } from "../src/ferramentas/ciclo-informe.js";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let pasta: string;
let c: Conexao;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-informe-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
  writeFileSync(join(pasta, "pj.DBK"), fixture("pj-simples-01.DBK"));
  c = await conectar({ diretorioAutorizado: pasta });
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

const informe = (linhas: string[]) =>
  [
    "COMPROVANTE DE RENDIMENTOS PAGOS E DE IMPOSTO SOBRE A RENDA RETIDO NA FONTE",
    "CNPJ: 11.222.333/0001-81   Nome empresarial: EMPRESA FICTICIA S.A.",
    ...linhas,
  ].join("\n");

const titular = { tipo: "titular" as const };

describe("rótulos do informe (revisão A1)", () => {
  it("um valor com '13' não transforma o IRRF anual em IRRF do 13º", () => {
    const inf = interpretarInforme(
      informe([
        "01. Total dos rendimentos (inclusive férias) 60.000,00",
        "05. Imposto sobre a renda retido na fonte 4.513,00",
      ]),
      titular,
    );
    expect(inf.irrf).toBe(451_300n);
    expect(inf.irrfDecimoTerceiro).toBe(0n);
  });

  it("a parcela isenta do 13º (65 anos) não vira 13º tributável", () => {
    const inf = interpretarInforme(
      informe([
        "01. Total dos rendimentos (inclusive férias) 60.000,00",
        "01. Parcela isenta dos proventos de aposentadoria (65 anos ou mais) 22.847,76",
        "02. Parcela isenta do 13º salário de aposentadoria (65 anos ou mais) 1.903,98",
        "01. Décimo terceiro salário 5.000,00",
        "02. Imposto sobre a renda retido na fonte sobre 13º salário 300,00",
      ]),
      titular,
    );
    expect(inf.decimoTerceiro).toBe(500_000n);
    expect(inf.irrfDecimoTerceiro).toBe(30_000n);
    expect(inf.isentos).toContainEqual({
      codigo: "10",
      valor: 2_284_776n,
      decimoTerceiro: 190_398n,
    });
  });

  it("moléstia grave vira isento 11, e linhas sem rótulo ou repetidas são avisadas", () => {
    const inf = interpretarInforme(
      informe([
        "Pensão por moléstia grave 12.000,00",
        "Valor qualquer sem rótulo conhecido 99,00",
        "Total dos rendimentos 1.000,00",
        "Total dos rendimentos 2.000,00",
      ]),
      titular,
    );
    expect(inf.isentos).toContainEqual({ codigo: "11", valor: 1_200_000n });
    expect(inf.rendimentos).toBe(100_000n);
    expect(inf.avisos).toHaveLength(2);
    expect(inf.avisos.join(" ")).not.toContain("Valor qualquer");
  });

  it("rótulos conhecidos casam sem acento e sem o valor", () => {
    expect(campoDoRotulo("Imposto sobre a Renda Retido na Fonte ")).toBe("irrf");
    expect(campoDoRotulo("13º salário ")).toBe("decimo");
    expect(campoDoRotulo("Lucros e dividendos ")).toBe("isento09");
    expect(campoDoRotulo("Juros sobre capital próprio ")).toBe("exclusivo10");
  });
});

describe("entrada hostil (revisão A3)", () => {
  it("linha longa com rótulos repetidos é lida em tempo linear", () => {
    const linha = `${"imposto retido ".repeat(4000)}1,00`;
    const inicio = performance.now();
    interpretarInforme(informe([linha, `${"1".padEnd(20_000, ".111")}`]), titular);
    expect(performance.now() - inicio).toBeLessThan(500);
  });
});

describe("importar_informe_rendimentos com substituir (revisão A2)", () => {
  it("reimportar não duplica o 13º em Exclusivos nem o plano de saúde", async () => {
    const json = {
      fonte: { cnpj: "11222333000181", nome: "EMPRESA FICTICIA" },
      rendimentos: "10.000,00",
      decimoTerceiro: "1.000,00",
      planoSaude: [{ cnpj: "11222333000181", nome: "PLANO", valor: "500,00" }],
    };
    const antes = modelo("pj.DBK");
    const ex01Antes = antes.rendimentosExclusivos.find((e) => e.codigo === "01")?.valor ?? 0n;
    const p26Antes = antes.pagamentos.filter((p) => p.codigo === "26").length;
    const r1 = await c.chamar("importar_informe_rendimentos", { arquivo: "pj.DBK", json });
    expect(r1.isError, textoDe(r1)).toBeFalsy();
    const r2 = await c.chamar("importar_informe_rendimentos", {
      arquivo: "pj.DBK",
      json,
      substituir: true,
    });
    expect(r2.isError, textoDe(r2)).toBeFalsy();
    const d = modelo("pj.DBK");
    const ex01 = d.rendimentosExclusivos.find((e) => e.codigo === "01")?.valor ?? 0n;
    expect(ex01 - ex01Antes).toBe(100_000n);
    expect(d.pagamentos.filter((p) => p.codigo === "26").length - p26Antes).toBe(1);
  });
});

describe("ler_informe", () => {
  const texto = informe([
    "01. Total dos rendimentos (inclusive férias) 60.000,00",
    "02. Contribuição previdenciária oficial 6.000,00",
    "05. Imposto sobre a renda retido na fonte 4.513,00",
    "Linha estranha 1,00",
  ]);

  it("devolve os campos do texto colado, delimitados como dado, sem gravar", async () => {
    const r = await c.chamar("ler_informe", { texto });
    expect(r.isError, textoDe(r)).toBeFalsy();
    expect(r.structuredContent).toMatchObject({
      fonte: { ni: "11222333000181", nome: "EMPRESA FICTICIA S.A." },
      rendimentos: "6000000",
      previdenciaOficial: "600000",
      irrf: "451300",
    });
    expect((r.structuredContent as { avisos: string[] }).avisos).toHaveLength(1);
    expect(textoDe(r)).toMatch(/<dados_do_arquivo origem="informe">/);
    expect(textoDe(r)).toMatch(/não instrução/);
    expect(readFileSync(join(pasta, "pj.DBK"))).toEqual(Buffer.from(fixture("pj-simples-01.DBK")));
  });

  it("lê um .txt da pasta e recusa outras extensões, caminhos fora e as duas origens", async () => {
    writeFileSync(join(pasta, "informe.txt"), texto);
    const ok = await c.chamar("ler_informe", { arquivo: "informe.txt" });
    expect(ok.structuredContent).toMatchObject({ irrf: "451300" });
    for (const args of [
      { arquivo: "pj.DBK" },
      { arquivo: "../informe.txt" },
      { texto, arquivo: "informe.txt" },
      {},
    ]) {
      expect((await c.chamar("ler_informe", args)).isError, JSON.stringify(args)).toBe(true);
    }
  });
});
