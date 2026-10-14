/**
 * Entradas hostis no modelo (schemas zod) e na validação.
 *
 * O modelo recebe JSON vindo do cliente MCP, ou seja, de um LLM que pode ter sido induzido por
 * prompt injection. Contrato verificado:
 * - o schema recusa, rápido e sem lançar, strings gigantes, números fora da faixa, datas
 *   impossíveis e formatos errados;
 * - `__proto__`, `constructor` e `prototype` no JSON nunca poluem `Object.prototype` nem chegam
 *   ao objeto validado;
 * - caracteres invisíveis e de controle de direção (bidi) em nomes viram pendência;
 * - `validarDeclaracao` nunca lança: com entrada malformada devolve pendência de forma.
 */
import { describe, expect, it } from "vitest";
import { lerData, ultimoDiaUtilSemFeriados } from "../../src/calc/datas.js";
import { CalculoInvalidoError } from "../../src/calc/index.js";
import { type DeclaracaoEntrada, dataIsoValida, zDeclaracao } from "../../src/model/index.js";
import {
  REGRA_FORMA_MODELO,
  validarCnpj,
  validarCpf,
  validarDeclaracao,
} from "../../src/validate/index.js";
import { gerador, medir } from "../integridade/apoio.js";
import { declaracaoBase, declaracaoValida } from "../model/fixtures.js";

const comIdentificacao = (extra: Record<string, unknown>): unknown => {
  const base = declaracaoBase();
  return { ...base, identificacao: { ...base.identificacao, ...extra } };
};

describe("strings gigantes", () => {
  it("nome, CPF e e-mail de 5 MB são recusados em poucos milissegundos", () => {
    const gigante = "A".repeat(5 * 1024 * 1024);
    const digitos = "1".repeat(5 * 1024 * 1024);
    const casos = [
      comIdentificacao({ nome: gigante }),
      comIdentificacao({ cpf: digitos }),
      comIdentificacao({ nome: ` ${gigante} ` }),
      { ...declaracaoBase(), dependentes: [{ cpf: digitos, nome: gigante }] },
    ];
    for (const caso of casos) {
      let sucesso = true;
      const ms = medir(() => {
        sucesso = zDeclaracao.safeParse(caso).success;
      });
      expect(sucesso).toBe(false);
      expect(ms).toBeLessThan(500);
    }
  });

  it("validarDeclaracao com strings gigantes devolve pendências sem estourar tempo", () => {
    let pendencias: ReturnType<typeof validarDeclaracao> = [];
    const ms = medir(() => {
      pendencias = validarDeclaracao(comIdentificacao({ nome: "B".repeat(2_000_000) }));
    });
    expect(pendencias.some((p) => p.codigo === REGRA_FORMA_MODELO.codigo)).toBe(true);
    expect(ms).toBeLessThan(1000);
  });
});

describe("unicode bidi, invisível e de controle", () => {
  // Montados por código para não depender de caracteres invisíveis no fonte.
  const perigosos = [
    0x202e, // RIGHT-TO-LEFT OVERRIDE
    0x202d, // LEFT-TO-RIGHT OVERRIDE
    0x2066, // LEFT-TO-RIGHT ISOLATE
    0x2069, // POP DIRECTIONAL ISOLATE
    0x200b, // ZERO WIDTH SPACE
    0x200d, // ZERO WIDTH JOINER
    0xfeff, // BOM
    0x00ad, // SOFT HYPHEN
    0x0000, // NUL
    0x001b, // ESC
    0x0085, // NEXT LINE
    0x2028, // LINE SEPARATOR
    0xe0041, // TAG LATIN CAPITAL LETTER A
  ].map((c) => String.fromCodePoint(c));

  it("nome do titular com qualquer desses caracteres gera pendência", () => {
    for (const c of perigosos) {
      const nome = `Maria${c} Teste da Silva`;
      const pendencias = validarDeclaracao(zDeclaracao.parse(comIdentificacao({ nome })));
      const cod = c.codePointAt(0)?.toString(16);
      expect(
        pendencias.some((p) => p.caminho === "identificacao.nome"),
        `U+${cod}: ${pendencias.map((p) => p.codigo).join(", ")}`,
      ).toBe(true);
    }
  });

  it("a mensagem da pendência não repete o caractere perigoso", () => {
    const nome = `Maria${String.fromCodePoint(0x202e)} Teste`;
    for (const p of validarDeclaracao(zDeclaracao.parse(comIdentificacao({ nome })))) {
      const bidi = [...p.mensagem].some((c) => /^[\u202a-\u202e\u2066-\u2069]$/u.test(c));
      expect(bidi).toBe(false);
    }
  });

  it("acentos e cedilha do português continuam aceitos", () => {
    const nome = "João Antônio Gonçalves Araújo Câmara";
    const pendencias = validarDeclaracao(zDeclaracao.parse(comIdentificacao({ nome })));
    expect(pendencias.filter((p) => p.caminho === "identificacao.nome")).toEqual([]);
  });
});

describe("prototype pollution", () => {
  const cargas = [
    '{"__proto__": {"poluido": true}}',
    '{"constructor": {"prototype": {"poluido": true}}}',
    '{"identificacao": {"__proto__": {"poluido": true}}}',
    '{"dependentes": [{"__proto__": {"poluido": true}}]}',
    '{"resumo": {"constructor": {"prototype": {"poluido": true}}}}',
  ];

  it("chaves __proto__, constructor e prototype no JSON não poluem nem passam adiante", () => {
    for (const carga of cargas) {
      const hostil = JSON.parse(carga) as Record<string, unknown>;
      const entrada = { ...declaracaoBase(), ...hostil } as Record<string, unknown>;
      // Mescla profunda manual só nos campos atacados, como faria um cliente descuidado.
      for (const chave of ["identificacao", "resumo"] as const) {
        if (Object.hasOwn(hostil, chave)) {
          const base = declaracaoBase()[chave] as Record<string, unknown>;
          entrada[chave] = Object.assign(JSON.parse(JSON.stringify(base)), hostil[chave]);
        }
      }
      const r = zDeclaracao.safeParse(entrada);
      validarDeclaracao(entrada);
      expect(({} as Record<string, unknown>).poluido, carga).toBeUndefined();
      expect((Object.prototype as Record<string, unknown>).poluido, carga).toBeUndefined();
      if (r.success) {
        const texto = JSON.stringify(r.data, (_k, v) => (typeof v === "bigint" ? `${v}` : v));
        expect(texto, carga).not.toMatch(/poluido|__proto__/);
        expect(Object.getPrototypeOf(r.data)).toBe(Object.prototype);
        expect(Object.getPrototypeOf(r.data.identificacao)).toBe(Object.prototype);
        expect(Object.hasOwn(r.data, "constructor")).toBe(false);
      }
    }
  });
});

describe("números fora da faixa", () => {
  const comValor = (valor: unknown): DeclaracaoEntrada =>
    ({
      ...declaracaoBase(),
      impostoPago: { impostoComplementar: valor },
    }) as unknown as DeclaracaoEntrada;

  it("float, NaN, Infinity, inteiro inseguro, texto e negativo são recusados no schema", () => {
    const ruins = [
      1.5,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
      2 ** 53,
      -(2 ** 53),
      1e300,
      "100",
      "1.234,56",
      true,
      null,
      {},
      [],
      -1,
      -1n,
    ];
    for (const ruim of ruins) {
      expect(zDeclaracao.safeParse(comValor(ruim)).success, String(ruim)).toBe(false);
    }
    expect(zDeclaracao.safeParse(comValor(Number.MAX_SAFE_INTEGER)).success).toBe(true);
    expect(zDeclaracao.safeParse(comValor(0)).success).toBe(true);
  });

  it("valor que não cabe no arquivo da declaração vira pendência, não exceção", () => {
    // 13 posições no DBK: o maior valor gravável é 99.999.999.999,99.
    for (const v of [10n ** 13n, 10n ** 40n, BigInt(Number.MAX_SAFE_INTEGER)]) {
      const pendencias = validarDeclaracao(zDeclaracao.parse(comValor(v)));
      expect(Array.isArray(pendencias)).toBe(true);
    }
  });
});

describe("datas inválidas", () => {
  it("dataIsoValida recusa dia inexistente, ano 0000 e formatos errados", () => {
    const invalidas = [
      "2025-02-31",
      "2025-02-29",
      "1900-02-29",
      "2025-04-31",
      "2025-13-01",
      "2025-00-10",
      "2025-01-00",
      "0000-01-01",
      "0000-02-29",
      "2025-1-01",
      "25-01-01",
      "2025/01/01",
      "2025-01-01T00:00:00Z",
      " 2025-01-01",
      "２０２５-01-01",
      "",
    ];
    for (const d of invalidas) expect(dataIsoValida(d), d).toBe(false);
    const validas = ["2024-02-29", "2000-02-29", "2025-12-31", "0001-01-01", "0004-02-29"];
    for (const d of validas) expect(dataIsoValida(d), d).toBe(true);
  });

  it("lerData do cálculo recusa as mesmas datas e acerta anos de 0001 a 0099", () => {
    for (const d of [
      "2025-02-31",
      "31022025",
      "0000-01-01",
      "01010000",
      "29021900",
      "2025-13-01",
    ]) {
      expect(() => lerData(d), d).toThrow(CalculoInvalidoError);
    }
    expect(lerData("29020004")).toEqual({ ano: 4, mes: 2, dia: 29 });
    expect(lerData("2024-02-29")).toEqual({ ano: 2024, mes: 2, dia: 29 });
    // 31/01/0050 foi segunda-feira no calendário gregoriano proléptico; Date.UTC(50, ...) daria 1950.
    expect(ultimoDiaUtilSemFeriados(50, 1)).toEqual({ ano: 50, mes: 1, dia: 31 });
    expect(ultimoDiaUtilSemFeriados(2026, 5)).toEqual({ ano: 2026, mes: 5, dia: 29 });
  });

  it("data de nascimento impossível no JSON é recusada pelo schema", () => {
    for (const d of ["2025-02-31", "0000-01-01", "1980-02-30"]) {
      expect(zDeclaracao.safeParse(comIdentificacao({ dataNascimento: d })).success, d).toBe(false);
    }
  });
});

describe("CPF e CNPJ com todos os dígitos iguais", () => {
  it("passam no módulo 11 mas são recusados", () => {
    for (let d = 0; d <= 9; d++) {
      expect(validarCpf(String(d).repeat(11))).toBe(false);
      expect(validarCnpj(String(d).repeat(14))).toBe(false);
    }
  });

  it("CPF do titular e de dependente repetidos geram pendência de erro", () => {
    for (let d = 0; d <= 9; d++) {
      const cpf = String(d).repeat(11);
      const pendencias = validarDeclaracao(zDeclaracao.parse(comIdentificacao({ cpf })));
      expect(
        pendencias.some((p) => p.caminho === "identificacao.cpf" && p.gravidade === "erro"),
        cpf,
      ).toBe(true);
    }
  });
});

describe("validarDeclaracao nunca lança", () => {
  it("entradas que nem são declaração devolvem pendência de forma", () => {
    const lixo: unknown[] = [
      undefined,
      null,
      0,
      "",
      "declaração",
      [],
      {},
      { identificacao: null },
      { identificacao: { cpf: 123 } },
      { dependentes: "muitos" },
      { ...declaracaoBase(), bens: [{}] },
      new Date(),
      () => 1,
      Symbol("x"),
    ];
    for (const entrada of lixo) {
      let pendencias: ReturnType<typeof validarDeclaracao> = [];
      expect(
        () => {
          pendencias = validarDeclaracao(entrada);
        },
        String(typeof entrada),
      ).not.toThrow();
      expect(pendencias.length).toBeGreaterThan(0);
      for (const p of pendencias) {
        expect(p.codigo).toBe(REGRA_FORMA_MODELO.codigo);
        expect(p.gravidade).toBe("erro");
        expect(p.mensagem.length).toBeGreaterThan(5);
      }
    }
  });

  it("a pendência de forma cita o caminho, não o valor recebido", () => {
    const segredo = "SEGREDO-NAO-ECOAR";
    const pendencias = validarDeclaracao(comIdentificacao({ cpf: segredo }));
    const forma = pendencias.find((p) => p.caminho === "identificacao.cpf");
    expect(forma?.codigo).toBe(REGRA_FORMA_MODELO.codigo);
    expect(JSON.stringify(pendencias)).not.toContain(segredo);
  });

  it("declaração já validada pelo schema dá o mesmo resultado de antes", () => {
    expect(validarDeclaracao(declaracaoValida())).toEqual([]);
  });

  it("3.000 mutações aleatórias de uma declaração válida nunca fazem lançar", () => {
    const g = gerador(301);
    const valores: unknown[] = [
      null,
      undefined,
      -1,
      0,
      1.5,
      2 ** 60,
      10n ** 20n,
      "",
      "x".repeat(300),
      "00000000000",
      "2025-02-31",
      [],
      {},
      true,
      String.fromCodePoint(0x202e),
    ];
    const caminhos = (o: unknown, prefixo: string[] = []): string[][] => {
      if (o === null || typeof o !== "object") return [prefixo];
      const filhos = Object.entries(o).flatMap(([k, v]) => caminhos(v, [...prefixo, k]));
      return [prefixo, ...filhos];
    };
    const base = declaracaoBase() as unknown as Record<string, unknown>;
    const todos = caminhos(base).filter((c) => c.length > 0);
    for (let n = 0; n < 3000; n++) {
      const copia = structuredClone(base);
      const caminho = g.escolher(todos);
      let alvo = copia as Record<string, unknown>;
      for (const k of caminho.slice(0, -1)) alvo = alvo[k] as Record<string, unknown>;
      alvo[caminho.at(-1) ?? ""] = g.escolher(valores);
      expect(() => validarDeclaracao(copia), `${n}: ${caminho.join(".")}`).not.toThrow();
      const r = zDeclaracao.safeParse(copia);
      if (r.success) expect(() => validarDeclaracao(r.data)).not.toThrow();
    }
  });
});
