/**
 * Fluxo completo com cliente MCP em memória: cria a declaração do zero, preenche várias fichas,
 * valida, calcula, grava o DBK e relê o arquivo com o codec, conferindo controles e conteúdo.
 */
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  calcularDvCpf,
  entradaCalculoDoModelo,
  gravarArquivo,
  lerArquivo,
  modeloParaRegistros,
  motor2026,
  registrosParaModelo,
  verificarControles,
  zDeclaracao,
} from "@mcp-imposto-de-renda/core";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type Conexao, conectar, textoDe } from "./apoio.js";

const cpf = (b: string) => `${b}${calcularDvCpf(b)}`;
const TITULAR = cpf("123456789");
const DEP = cpf("987654321");
const MEDICO = cpf("135792468");
const CNPJ = "11222333000181";

let base: string;
let pasta: string;
let c: Conexao;

beforeAll(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-e2e-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
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

describe("fluxo de ponta a ponta pelo MCP", () => {
  it("cria, preenche, valida, calcula, grava e relê o DBK", async () => {
    const criado = await ok("criar_declaracao", {
      identificacao: {
        cpf: TITULAR,
        nome: "FULANA FICTICIA",
        dataNascimento: "1980-01-15",
        tipoDeclaracao: { tipo: "ajusteAnual" },
        racaCor: "2",
        endereco: {
          local: "brasil",
          tipoLogradouro: "RUA",
          logradouro: "DAS ACACIAS FICTICIAS",
          numero: "10",
          bairro: "CENTRO",
          uf: "DF",
          municipio: "9701",
          cep: "70040010",
        },
        ocupacao: { natureza: "12", ocupacaoPrincipal: "212" },
      },
      opcao_tributacao: "completa",
    });
    const arquivo = String(criado.arquivo);
    expect(arquivo).toBe(`${TITULAR}-IRPF-A-2026-2025-ORIGI.DBK`);

    await ok("adicionar_dependente", {
      arquivo,
      item: { codigo: "21", nome: "FILHO FICTICIO", cpf: DEP, dataNascimento: "2015-06-01" },
    });
    await ok("adicionar_rendimento_pj", {
      arquivo,
      item: {
        beneficiario: { tipo: "titular" },
        fonte: { ni: CNPJ, nome: "EMPRESA FICTICIA" },
        rendimentos: "96.000,00",
        contribuicaoPrevidenciaria: "9.000,00",
        impostoRetido: "12.000,00",
        decimoTerceiro: "8.000,00",
        impostoRetidoDecimoTerceiro: "700,00",
      },
    });
    await ok("adicionar_pagamento", {
      arquivo,
      item: {
        codigo: "10",
        realizadoCom: { tipo: "dependente", cpf: DEP },
        niBeneficiario: MEDICO,
        nomeBeneficiario: "MEDICO FICTICIO",
        valorPago: "2.500,00",
      },
    });
    await ok("adicionar_bem", {
      arquivo,
      item: {
        grupo: "06",
        codigo: "01",
        discriminacao: "CONTA CORRENTE FICTICIA",
        situacaoAnterior: "1.000,00",
        situacaoAtual: "3.000,00",
      },
    });
    await ok("importar_informe_rendimentos", {
      arquivo,
      json: {
        fonte: { cnpj: "11444777000161", nome: "OUTRA EMPRESA FICTICIA" },
        isentos: [{ codigo: "09", valor: "5.000,00" }],
      },
    });
    await ok("definir_informacoes_bancarias", {
      arquivo,
      banco: "001",
      agencia: "1234",
      conta: "56789",
      dv: "X",
    });

    const v = await ok("validar_declaracao", { arquivo });
    const erros = (v.pendencias as { gravidade: string; codigo: string }[]).filter(
      (p) => p.gravidade === "erro",
    );
    expect(erros, JSON.stringify(erros)).toEqual([]);

    const darf = await ok("gerar_darf", { arquivo });
    const transmissao = await ok("instruir_transmissao", { arquivo });
    expect(transmissao.totalErros).toBe(0);

    // Releitura independente com o codec do core.
    const bytes = new Uint8Array(readFileSync(join(pasta, arquivo)));
    const lido = lerArquivo(bytes);
    expect(verificarControles(lido.registros, { tipoArquivo: "DBK" }).valido).toBe(true);
    const leitura = registrosParaModelo(lido.registros);
    const d = zDeclaracao.parse(leitura.declaracao);
    expect(leitura.tiposNaoMapeados).toEqual([]);
    expect(d.identificacao).toMatchObject({ cpf: TITULAR, nome: "FULANA FICTICIA" });
    expect(d.dependentes.map((x) => x.cpf)).toEqual([DEP]);
    expect(d.rendimentosPJ[0]).toMatchObject({
      rendimentos: 9_600_000n,
      impostoRetido: 1_200_000n,
      decimoTerceiro: 800_000n,
    });
    expect(d.pagamentos[0]).toMatchObject({ codigo: "10", valorPago: 250_000n });
    expect(d.bens[0]).toMatchObject({ situacaoAnterior: 100_000n, situacaoAtual: 300_000n });
    expect(d.rendimentosIsentos.map((i) => i.codigo)).toContain("09");
    expect(d.resumo).toMatchObject({ opcaoTributacao: "deducoesLegais" });
    expect(d.resumo.conta?.banco).toBe("001");

    // Os totais gravados conferem com o motor de cálculo.
    const calc = motor2026.compararModelos(entradaCalculoDoModelo(d)).completo;
    const resumo = (leitura.declaracao as { resumoCalculado?: Record<string, bigint> })
      .resumoCalculado;
    expect(resumo?.impostoDevido).toBe(BigInt(calc.impostoDevido));
    expect(resumo?.impostoARestituir).toBe(BigInt(calc.restituir));
    expect(resumo?.impostoAPagar).toBe(BigInt(calc.saldoPagar));
    expect(resumo?.bensAtual).toBe(300_000n);
    expect(BigInt(String(darf.valorTotal))).toBe(BigInt(calc.saldoPagar));

    // Regravar o modelo relido sobre o próprio arquivo devolve os mesmos bytes.
    const regravado = modeloParaRegistros(d, { base: lido.registros });
    expect(
      Buffer.from(gravarArquivo(regravado.registros, { terminadorFinal: lido.terminadorFinal })),
    ).toEqual(Buffer.from(bytes));
  });
});
