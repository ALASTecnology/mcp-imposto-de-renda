/**
 * `converter_moeda` com a tabela oficial do dólar de 2025 (Ajuda do PGD, pág. 356). Contas à
 * mão no comentário de cada caso, em centavos.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type Conexao, conectar, textoDe } from "./apoio.js";

let c: Conexao;

beforeAll(async () => {
  c = await conectar();
});
afterAll(async () => {
  await c.fechar();
});

async function chamar(args: Record<string, unknown>) {
  return c.chamar("converter_moeda", args);
}

describe("converter_moeda com a tabela do dólar de 2025", () => {
  it("rendimento usa a cotação de compra do mês: US$ 1.000,00 em março = R$ 5.727,70", async () => {
    // 100000 centavos x 5,7277 = 572.770 centavos.
    const r = await chamar({ valor: "1.000,00", mes: 3, finalidade: "rendimento" });
    expect(r.isError, textoDe(r)).toBeFalsy();
    expect(r.structuredContent).toMatchObject({ reais: 572_770, cotacao: "5,7277" });
    expect(textoDe(r)).toMatch(/pág\. 356/);
  });

  it("dedução usa a cotação de venda: US$ 100,00 em dezembro = R$ 529,52", async () => {
    const r = await chamar({ valor: "100,00", mes: 12, finalidade: "deducao" });
    expect(r.structuredContent).toMatchObject({ reais: 52_952, cotacao: "5,2952" });
  });

  it("atividade rural usa a compra de 31/12/2025: US$ 10,00 = R$ 55,01", async () => {
    // 1000 x 5,5018 = 5501,8 centavos, fração descartada.
    const r = await chamar({ valor: "10,00", finalidade: "atividade_rural" });
    expect(r.structuredContent).toMatchObject({ reais: 5_501, cotacao: "5,5018" });
  });

  it("cotação informada prevalece sobre a tabela", async () => {
    const r = await chamar({ valor: "10,00", cotacao: "5,0000", mes: 1, finalidade: "rendimento" });
    expect(r.structuredContent).toMatchObject({ reais: 5_000, cotacao: "5,0000" });
  });

  it("sem cotação nem mês, ou para bem e aplicação, pede a cotação", async () => {
    const semMes = await chamar({ valor: "10,00", finalidade: "rendimento" });
    expect(semMes.isError).toBe(true);
    expect(textoDe(semMes)).toMatch(/mes/);
    const bem = await chamar({ valor: "10,00", mes: 5, finalidade: "bem" });
    expect(bem.isError).toBe(true);
    expect(textoDe(bem)).toMatch(/cotacao/);
  });
});
