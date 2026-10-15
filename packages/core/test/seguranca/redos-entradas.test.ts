/**
 * Regressão dos alertas de ReDoS apontados pela análise estática: o leitor do XML exportado pelo
 * GCAP e a validação de e-mail precisam custar tempo linear com entradas hostis, e o leitor não
 * pode lançar erro não tipado com entidades numéricas fora do Unicode.
 */
import { describe, expect, it } from "vitest";
import { ExportacaoGcapInvalidaError, lerDemonstrativoGcapXml } from "../../src/conversao/index.js";
import { emailValido } from "../../src/validate/util.js";
import { medir, orcamento } from "../integridade/apoio.js";

const N = 100_000;

function falhaTipada(xml: string): unknown {
  try {
    lerDemonstrativoGcapXml(xml);
  } catch (e) {
    return e;
  }
  return undefined;
}

describe("leitor do XML do GCAP com entrada hostil", { retry: 2 }, () => {
  const hostis: Array<[string, string]> = [
    ["aberturas repetidas de instrução", "<?".repeat(N)],
    ["aberturas repetidas de comentário", "<!--".repeat(N)],
    ["atributo com hifens sem fim", `<a ${"-".repeat(N)}`],
    ["atributos sem valor", `<a${" b".repeat(N)}`],
    ["aspas sem fechamento", `<a b="${"x".repeat(N)}`],
    ["tags abertas sem fim", "<a>".repeat(N)],
  ];

  for (const [nome, xml] of hostis) {
    it(`${nome}: falha tipada em tempo linear`, () => {
      let erro: unknown;
      const ms = medir(() => {
        erro = falhaTipada(xml);
      });
      expect(erro).toBeInstanceOf(Error);
      expect(erro).toBeInstanceOf(ExportacaoGcapInvalidaError);
      expect(ms).toBeLessThan(orcamento(500));
    });
  }

  it("entidade numérica fora do Unicode não lança RangeError", () => {
    const erro = falhaTipada('<?xml version="1.0"?><a b="&#99999999;" c="&#x110000;"/>');
    expect(erro === undefined || erro instanceof ExportacaoGcapInvalidaError).toBe(true);
  });
});

describe("validação de e-mail", () => {
  it.each([
    ["contato@exemplo.com.br", true],
    ["a@b.c", true],
    ["sem-arroba.com", false],
    ["@exemplo.com", false],
    ["a@@exemplo.com", false],
    ["a@exemplo", false],
    ["a@.com", false],
    ["a@exemplo.", false],
    ["a b@exemplo.com", false],
  ])("%s é %s", (email, esperado) => {
    expect(emailValido(email)).toBe(esperado);
  });

  it("texto hostil é rejeitado em tempo linear", { retry: 2 }, () => {
    const hostil = `!@!.${"!.".repeat(N)}`;
    let ok = true;
    const ms = medir(() => {
      ok = emailValido(hostil);
    });
    expect(ok).toBe(false);
    expect(ms).toBeLessThan(orcamento(50));
  });
});
