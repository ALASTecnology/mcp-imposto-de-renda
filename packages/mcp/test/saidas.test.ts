import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let c: Conexao;

beforeAll(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-saidas-")));
  const pasta = join(base, "ir");
  mkdirSync(pasta);
  writeFileSync(join(pasta, "pj.DBK"), fixture("pj-simples-01.DBK"));
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

describe("saídas", () => {
  it("gerar_darf divide o saldo em quotas com vencimentos", async () => {
    const s = await ok("gerar_darf", { saldo: "3.000,00", quotas: 3 });
    expect(s.codigoReceita).toBe("0211");
    const parcelas = s.parcelas as { principal: string; vencimento: string }[];
    expect(parcelas).toHaveLength(3);
    expect(parcelas.reduce((t, p) => t + BigInt(p.principal), 0n)).toBe(300_000n);
    expect(parcelas[0]?.vencimento).toMatch(/^2026-05-/);
  });

  it("gerar_darf de carnê-leão calcula multa de mora limitada", async () => {
    const s = await ok("gerar_darf", {
      tipo: "carne_leao",
      saldo: "1.000,00",
      mes_apuracao: 1,
      data_pagamento: "2026-01-30",
    });
    expect(s.codigoReceita).toBe("0190");
    const p = (s.parcelas as { multaMora: string }[])[0];
    expect(p?.multaMora).toBe("20000");
  });

  it("gerar_darf sem valor a pagar não gera parcelas", async () => {
    const s = await ok("gerar_darf", { saldo: 0 });
    expect(s.parcelas).toEqual([]);
  });

  it("instruir_transmissao e relatório leem a declaração", async () => {
    const t = await ok("instruir_transmissao", { arquivo: "pj.DBK" });
    expect((t.passos as string[]).length).toBeGreaterThan(2);
    const rel = await ok("gerar_relatorio_declaracao", { arquivo: "pj.DBK" });
    expect(String(rel.relatorio)).toContain("Rendimentos");
  });
});

describe("calculadoras", () => {
  it("carnê-leão usa o desconto simplificado mensal de maio em diante", async () => {
    const s = await ok("calcular_carne_leao", { mes: 6, rendimentos: "5.000,00" });
    expect(s).toMatchObject({ base: 439280, imposto: 31289, usaSimplificado: true });
  });

  it("renda variável aplica 15%, 20% no day-trade e isenção de ações", async () => {
    const s = await ok("apurar_renda_variavel", {
      meses: [
        { mes: 3, comuns: "1.000,00", vendas_acoes: "30.000,00", day_trade: "100,00" },
        { mes: 4, comuns: "1.000,00", vendas_acoes: "10.000,00", ganho_acoes_vista: "1.000,00" },
      ],
    });
    const meses = s.meses as { impostoDevido: string; isentoAcoes: string }[];
    expect(meses[0]?.impostoDevido).toBe(17000);
    expect(meses[1]).toMatchObject({ impostoDevido: 0, isentoAcoes: 100000 });
  });

  it("preço médio separa day-trade", async () => {
    const s = await ok("calcular_preco_medio", {
      operacoes: [
        { data: "2025-02-01", ativo: "ABCD3", tipo: "compra", quantidade: 100, valor: "1.000,00" },
        { data: "2025-02-01", ativo: "ABCD3", tipo: "compra", quantidade: 100, valor: "2.000,00" },
        { data: "2025-03-01", ativo: "ABCD3", tipo: "venda", quantidade: 100, valor: "2.000,00" },
      ],
    });
    const v = (s.vendas as { resultado: string; dayTrade: boolean }[])[0];
    expect(v).toMatchObject({ resultado: 50000, dayTrade: false });
  });

  it("ganho de capital e acréscimos moratórios", async () => {
    const g = await ok("calcular_ganho_capital", {
      tipo: "movel",
      valor_alienacao: "100.000,00",
      custo_aquisicao: "60.000,00",
      data_aquisicao: "2020-01-10",
      data_alienacao: "2025-05-10",
    });
    expect(g).toMatchObject({ ganhoBruto: 4000000, imposto: 600000, codigoDarf: "4600" });
    const m = await ok("calcular_acrescimos_moratorios", {
      principal: "1.000,00",
      vencimento: "2025-05-30",
      data_pagamento: "2025-06-09",
      selic_acumulada: "0",
    });
    expect(m).toMatchObject({ diasAtraso: 10, multa: 3300, juros: 1000, total: 104300 });
  });

  it("obrigatoriedade, residência, moeda e RRA", async () => {
    const o = await ok("verificar_obrigatoriedade", { rendimentos_tributaveis: "40.000,00" });
    expect(o.obrigado).toBe(true);
    const n = await ok("verificar_obrigatoriedade", { rendimentos_tributaveis: "10.000,00" });
    expect(n.obrigado).toBe(false);
    const r = await ok("calcular_condicao_residencia", {
      evento: "ausencia_temporaria",
      data: "2025-01-10",
    });
    expect(r).toMatchObject({ condicao: "naoResidente", desde: "2026-01-11" });
    const cm = await ok("converter_moeda", { valor: "100,00", cotacao: "5,5", finalidade: "bem" });
    expect(cm.reais).toBe(55000);
    const rra = await ok("calcular_rra", {
      rendimentos: "10.000,00",
      numero_meses: 10,
      mes_recebimento: 6,
      outros_rendimentos_base: "0",
    });
    expect(rra.impostoExclusivo).toBe(0);
  });
});

describe("orientação", () => {
  it("explica serviços externos e versões das tabelas sem rede", async () => {
    const o = await ok("orientar_servico_externo", { servico: "pre_preenchida" });
    expect((o.passos as string[]).length).toBeGreaterThan(1);
    const v = await ok("verificar_versao_tabelas", {});
    expect((v.tabelas as { registros: number }[]).every((t) => t.registros > 0)).toBe(true);
  });
});
