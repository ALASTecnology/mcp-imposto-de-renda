import {
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
import {
  calcularDvCpf,
  lerArquivo,
  registrosParaModelo,
  verificarControles,
  zDeclaracao,
} from "@autoir/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PASTA_BACKUPS } from "../src/index.js";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let c: Conexao;
const DEP = `987654321${calcularDvCpf("987654321")}`;
const OUTRO = `135792468${calcularDvCpf("135792468")}`;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "autoir-edicao-")));
  mkdirSync(join(base, "ir"));
  writeFileSync(join(base, "ir", "pj.DBK"), fixture("pj-simples-01.DBK"));
  c = await conectar({ diretorioAutorizado: join(base, "ir") });
});
afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

function modelo(nome = "pj.DBK") {
  const lido = lerArquivo(new Uint8Array(readFileSync(join(base, "ir", nome))));
  expect(verificarControles(lido.registros).valido).toBe(true);
  return zDeclaracao.parse(registrosParaModelo(lido.registros).declaracao);
}

async function ok(nome: string, args: Record<string, unknown>) {
  const r = await c.chamar(nome, args);
  expect(r.isError, `${nome}: ${textoDe(r)}`).toBeFalsy();
  return r.structuredContent as Record<string, unknown>;
}

const dependente = {
  codigo: "21",
  nome: "FILHO FICTICIO",
  cpf: DEP,
  dataNascimento: "2015-06-01",
};

describe("ferramentas de edição por ficha", () => {
  it("dependente: adicionar, listar, editar e remover, com backup", async () => {
    const s = await ok("adicionar_dependente", { arquivo: "pj.DBK", item: dependente });
    expect(s.indice).toBe(1);
    expect(s.backup).toMatch(new RegExp(`^${PASTA_BACKUPS}/`));
    expect(Array.isArray(s.pendencias)).toBe(true);
    expect(modelo().dependentes.map((d) => d.nome)).toEqual(["FILHO FICTICIO"]);

    const l = await ok("listar_dependentes", { arquivo: "pj.DBK" });
    expect(l.total).toBe(1);

    await ok("editar_dependente", {
      arquivo: "pj.DBK",
      indice: 1,
      alteracoes: { nome: "FILHO RENOMEADO" },
    });
    expect(modelo().dependentes[0]?.nome).toBe("FILHO RENOMEADO");

    await ok("remover_dependente", { arquivo: "pj.DBK", indice: 1 });
    expect(modelo().dependentes).toEqual([]);
    expect(readdirSync(join(base, "ir", PASTA_BACKUPS)).length).toBeGreaterThanOrEqual(3);
  });

  it("valores em reais e em centavos são aceitos", async () => {
    await ok("adicionar_pagamento", {
      arquivo: "pj.DBK",
      item: {
        codigo: "10",
        niBeneficiario: OUTRO,
        nomeBeneficiario: "MEDICO FICTICIO",
        valorPago: "1.234,56",
      },
    });
    await ok("adicionar_pagamento", {
      arquivo: "pj.DBK",
      item: {
        codigo: "10",
        niBeneficiario: OUTRO,
        nomeBeneficiario: "MEDICO FICTICIO",
        valorPago: 50_000,
      },
    });
    expect(modelo().pagamentos.map((p) => p.valorPago)).toEqual([123_456n, 50_000n]);
  });

  it("remover dependente com vínculo exige cascata", async () => {
    await ok("adicionar_dependente", { arquivo: "pj.DBK", item: dependente });
    await ok("adicionar_rendimento_pj", {
      arquivo: "pj.DBK",
      item: {
        beneficiario: { tipo: "dependente", cpf: DEP },
        fonte: { ni: "11222333000181", nome: "EMPRESA FICTICIA" },
        rendimentos: "1.000,00",
      },
    });
    const r = await c.chamar("remover_dependente", { arquivo: "pj.DBK", indice: 1 });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toContain("cascata");
    const s = await ok("remover_dependente", { arquivo: "pj.DBK", indice: 1, cascata: true });
    expect((s.afetados as unknown[]).length).toBe(1);
    const d = modelo();
    expect(d.dependentes).toEqual([]);
    expect(d.rendimentosPJ).toHaveLength(1);
  });

  it("entrada inválida volta com o caminho do campo e sem ecoar o valor", async () => {
    const r = await c.chamar("adicionar_dependente", {
      arquivo: "pj.DBK",
      item: { ...dependente, cpf: "segredo-123", campoExtra: 1 },
    });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toContain("cpf");
    expect(textoDe(r)).toContain("campoExtra");
    expect(textoDe(r)).not.toContain("segredo-123");
  });

  it("genéricas: listar_fichas, listar_lancamentos, editar_lancamento e remover_lancamento", async () => {
    const f = await ok("listar_fichas", { arquivo: "pj.DBK" });
    expect((f.fichas as { ficha: string }[]).some((x) => x.ficha === "rendimentosPJ")).toBe(true);
    const l = await ok("listar_lancamentos", { arquivo: "pj.DBK", ficha: "rendimentosPJ" });
    expect(l.total).toBe(1);
    await ok("editar_lancamento", {
      arquivo: "pj.DBK",
      ficha: "rendimentosPJ",
      indice: 1,
      alteracoes: { impostoRetido: "1,00" },
    });
    expect(modelo().rendimentosPJ[0]?.impostoRetido).toBe(100n);
    await ok("remover_lancamento", { arquivo: "pj.DBK", ficha: "rendimentosPJ", indice: 1 });
    expect(modelo().rendimentosPJ).toEqual([]);
  });

  it("definir_*: identificação, PF/exterior, renda variável e FII", async () => {
    await ok("definir_identificacao", { arquivo: "pj.DBK", dados: { nome: "NOVO NOME FICTICIO" } });
    await ok("definir_rendimentos_pf_exterior", {
      arquivo: "pj.DBK",
      beneficiario: { tipo: "titular" },
      mes: 3,
      valores: { alugueis: "2.000,00", carneLeaoPago: 10_000 },
    });
    await ok("definir_renda_variavel", {
      arquivo: "pj.DBK",
      beneficiario: { tipo: "titular" },
      mes: 2,
      dados_mes: { comuns: { mercadoVistaAcoes: "1.000,00" } },
    });
    await ok("definir_fii_fiagro", {
      arquivo: "pj.DBK",
      beneficiario: { tipo: "titular" },
      mes: 5,
      dados_mes: { resultadoLiquido: 30_000 },
    });
    const d = modelo();
    expect(d.identificacao.nome).toBe("NOVO NOME FICTICIO");
    expect(d.rendimentosPFExterior[0]?.alugueis[2]).toBe(200_000n);
    expect(d.rendaVariavel[0]?.meses[0]?.comuns.mercadoVistaAcoes).toBe(100_000n);
    expect(d.fundosImobiliarios[0]?.meses[0]?.resultadoLiquido).toBe(30_000n);
  });

  it("atividade rural e bens com casos especiais", async () => {
    await ok("adicionar_imovel_rural", {
      arquivo: "pj.DBK",
      item: {
        aba: "brasil",
        atividade: "10",
        nome: "FAZENDA FICTICIA",
        localizacao: "ZONA RURAL",
        areaDecimosHa: 100,
        condicaoExploracao: "1",
        participacaoCentesimos: 10000,
      },
    });
    await ok("definir_receitas_despesas_rurais", {
      arquivo: "pj.DBK",
      aba: "brasil",
      itens: [{ mes: 1, receitaBruta: "10.000,00", despesa: "4.000,00" }],
    });
    await ok("definir_rebanho", {
      arquivo: "pj.DBK",
      aba: "brasil",
      dados: { especie: "1", estoqueInicial: 10 },
    });
    await ok("adicionar_bem", {
      arquivo: "pj.DBK",
      item: {
        grupo: "01",
        codigo: "11",
        discriminacao: "CASA FICTICIA",
        situacaoAtual: "100.000,00",
      },
    });
    await ok("aplicar_caso_especial_bem", {
      arquivo: "pj.DBK",
      indice: 1,
      caso: "usufruto",
      proprietarios: [OUTRO],
    });
    const d = modelo();
    expect(d.atividadeRural?.brasil.imoveis[0]?.nome).toBe("FAZENDA FICTICIA");
    expect(d.atividadeRural?.brasil.receitasDespesas).toHaveLength(1);
    expect(d.bens[0]?.usufruto).toBe(true);
    expect(d.bens[0]?.proprietariosUsufrutuarios).toEqual([OUTRO]);
  });

  it("buscar_nome_por_documento encontra a fonte pagadora", async () => {
    const ni = modelo().rendimentosPJ[0]?.fonte.ni ?? "";
    const s = await ok("buscar_nome_por_documento", { documento: ni });
    expect((s.encontrados as unknown[]).length).toBeGreaterThan(0);
  });

  it("somente leitura omite as ferramentas que gravam", async () => {
    const leitura = await conectar({ diretorioAutorizado: join(base, "ir"), somenteLeitura: true });
    const nomes = (await leitura.client.listTools()).tools.map((t) => t.name);
    expect(nomes).toContain("listar_dependentes");
    expect(nomes).not.toContain("adicionar_dependente");
    expect(nomes).not.toContain("definir_identificacao");
    await leitura.fechar();
  });
});
