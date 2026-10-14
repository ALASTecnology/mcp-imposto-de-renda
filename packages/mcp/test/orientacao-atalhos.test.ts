/**
 * Equivalentes no MCP de funções de interface do programa: a Calculadora (Ctrl+Alt+A) vira
 * `calcular_expressao`, com aritmética decimal exata; os atalhos de teclado, a barra de
 * ferramentas e a acessibilidade viram `consultar_atalhos`.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { avaliarExpressao } from "../src/ferramentas/expressao.js";
import { type Conexao, conectar, textoDe } from "./apoio.js";

let c: Conexao;
beforeAll(async () => {
  c = await conectar();
});
afterAll(async () => {
  await c.fechar();
});

describe("avaliarExpressao", () => {
  it("soma decimais sem erro de ponto flutuante", () => {
    expect(avaliarExpressao("0,1 + 0,2").decimal).toBe("0.30");
    expect(avaliarExpressao("1.234,56 * 3").decimal).toBe("3703.68");
  });

  it("respeita precedência, parênteses, sinal e porcentagem", () => {
    expect(avaliarExpressao("2 + 3 * 4").decimal).toBe("14.00");
    expect(avaliarExpressao("(2 + 3) * 4").decimal).toBe("20.00");
    expect(avaliarExpressao("-(10 - 4) / 3").decimal).toBe("-2.00");
    expect(avaliarExpressao("27,5% * 10.000,00").decimal).toBe("2750.00");
  });

  it("arredonda a metade para cima nas casas pedidas e diz se é exato", () => {
    const r = avaliarExpressao("10 / 3", 4);
    expect(r).toMatchObject({ decimal: "3.3333", exato: false, resultado: "3,3333" });
    expect(avaliarExpressao("0,125", 2).decimal).toBe("0.13");
    expect(avaliarExpressao("-0,125", 2).decimal).toBe("-0.13");
    expect(avaliarExpressao("1/4", 2)).toMatchObject({ decimal: "0.25", exato: true });
  });

  it("recusa expressão inválida, divisão por zero e número ambíguo", () => {
    expect(() => avaliarExpressao("2 +")).toThrow();
    expect(() => avaliarExpressao("1 / (2 - 2)")).toThrow(/zero/);
    expect(() => avaliarExpressao("1.234 + 1")).toThrow(/ambíguo/);
    expect(() => avaliarExpressao("alert(1)")).toThrow();
  });
});

describe("ferramentas", () => {
  it("calcular_expressao devolve o resultado formatado", async () => {
    const r = await c.chamar("calcular_expressao", { expressao: "1.903,98 * 13" });
    expect(r.isError, textoDe(r)).toBeFalsy();
    expect(r.structuredContent).toMatchObject({ resultado: "24.751,74", decimal: "24751.74" });
  });

  it("consultar_atalhos acha a tecla e a ferramenta equivalente", async () => {
    const r = await c.chamar("consultar_atalhos", { consulta: "Ctrl+P" });
    expect(r.isError, textoDe(r)).toBeFalsy();
    const atalhos = (r.structuredContent as { atalhos: Record<string, unknown>[] }).atalhos;
    expect(atalhos[0]).toMatchObject({ tecla: "Ctrl+P", funcao: "Imprimir Declaração" });
    expect(atalhos[0]?.ferramentas).toContain("gerar_relatorio_declaracao");
    const f5 = await c.chamar("consultar_atalhos", { consulta: "pendências" });
    const lista = (f5.structuredContent as { atalhos: { tecla: string }[] }).atalhos;
    expect(lista.map((a) => a.tecla)).toContain("F5");
    const todos = await c.chamar("consultar_atalhos", {});
    expect((todos.structuredContent as { total: number }).total).toBeGreaterThan(40);
  });
});
