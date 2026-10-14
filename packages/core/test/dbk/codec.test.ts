import { describe, expect, it } from "vitest";
import {
  ArquivoDeclaracaoError,
  CampoDesconhecidoError,
  CampoInvalidoError,
  CaractereInvalidoError,
  centavosDoCampo,
  codificarRegistro,
  criarRegistro,
  decodificarRegistro,
  ExercicioNaoSuportadoError,
  gravarArquivo,
  LEIAUTE_2026,
  lerArquivo,
  type Registro,
  TamanhoLinhaInvalidoError,
  TerminadorLinhaInvalidoError,
  TipoRegistroDesconhecidoError,
  ValorExcedeTamanhoError,
  ValorNegativoError,
} from "../../src/dbk/index.js";
import { declaracaoSintetica, MINI } from "./apoio.js";

const latin1 = (texto: string): Uint8Array => Uint8Array.from(texto, (c) => c.charCodeAt(0));
const texto = (bytes: Uint8Array): string => String.fromCharCode(...bytes);

function arquivoMini(...linhas: string[]): Uint8Array {
  return latin1(linhas.map((l) => `${l}\r\n`).join(""));
}

const HEADER_MINI = `IRPF    2026${"0".repeat(20)}`;
const DETALHE_MINI = `10JOSÉ      00123150619801FILLER ${"0".repeat(10)}`;
const T9_MINI = `T9000002000010000000000000000`.slice(0, 28);

describe("leiaute 2026 gerado", () => {
  it("tem 96 tipos e 1855 campos com posições contíguas", () => {
    // 94 tipos do LayoutDados mais SR e IP, que só existem no mapeamentoTxt.
    expect(LEIAUTE_2026.tipos).toHaveLength(96);
    const campos = LEIAUTE_2026.tipos.flatMap((t) => t.campos);
    expect(campos).toHaveLength(1855);
    for (const tipo of LEIAUTE_2026.tipos) {
      let esperado = 1;
      for (const campo of tipo.campos) {
        expect(campo.inicio).toBe(esperado);
        esperado += campo.tamanho;
      }
      expect(tipo.tamanho).toBe(esperado - 1);
      expect(new Set(tipo.campos.map((c) => c.chave)).size).toBe(tipo.campos.length);
    }
  });

  it("tem o header IR, o fechamento T9 e o recibo", () => {
    const ids = LEIAUTE_2026.tipos.map((t) => t.id);
    expect(ids).toEqual(expect.arrayContaining(["IR", "16", "21", "27", "T9", "HR", "DR", "R9"]));
    const ir = LEIAUTE_2026.tipos.find((t) => t.id === "IR");
    expect(ir?.campos.find((c) => c.chave === "NR_HASH")).toMatchObject({
      inicio: 102,
      tamanho: 10,
    });
  });

  it("segue os tamanhos de registro observados nos arquivos do programa oficial", () => {
    const tamanhos = Object.fromEntries(LEIAUTE_2026.tipos.map((t) => [t.id, t.tamanho]));
    expect(tamanhos).toMatchObject({
      IR: 1244,
      "16": 930,
      "17": 361,
      "18": 744,
      "21": 170,
      "24": 40,
      T9: 449,
      HR: 26,
      DR: 516,
      R9: 36,
    });
  });
});

describe("decodificarRegistro e codificarRegistro", () => {
  it("lê texto sem os espaços finais, número como bigint e data como texto", () => {
    const r = decodificarRegistro(DETALHE_MINI, MINI);
    expect(r).toEqual({
      tipo: "10",
      campos: {
        NR_REG: 10n,
        NM_NOME: "JOSÉ",
        VR_VALOR: 123n,
        DT_EVENTO: "15061980",
        IN_X: "1",
        FILLER: "FILLER",
        NR_CONTROLE: 0n,
      },
    });
    expect(codificarRegistro(r, MINI)).toBe(DETALHE_MINI);
  });

  it("trata campo numérico em branco como null e o regrava em branco", () => {
    const linha = `10${" ".repeat(10)}${" ".repeat(5)}${" ".repeat(8)} ${" ".repeat(7)}${"0".repeat(10)}`;
    const r = decodificarRegistro(linha, MINI);
    expect(r.campos.VR_VALOR).toBeNull();
    expect(r.campos.DT_EVENTO).toBeNull();
    expect(codificarRegistro(r, MINI)).toBe(linha);
  });

  it("preserva espaços à esquerda do texto", () => {
    const r = criarRegistro(MINI, "10", { NM_NOME: "  X" });
    expect(decodificarRegistro(codificarRegistro(r, MINI), MINI).campos.NM_NOME).toBe("  X");
  });

  it("lê e regrava valor monetário negativo com o sinal na primeira posição", () => {
    // O programa oficial grava, por exemplo, a base mensal negativa do carnê-leão
    // (receita menor que o livro-caixa) como "-000000300000" (fixture livro-caixa-excesso-01).
    const linha = `${DETALHE_MINI.slice(0, 12)}-0123${DETALHE_MINI.slice(17)}`;
    const r = decodificarRegistro(linha, MINI);
    expect(r.campos.VR_VALOR).toBe(-123n);
    expect(codificarRegistro(r, MINI)).toBe(linha);
    expect(centavosDoCampo(r, "VR_VALOR", MINI)).toBe(-123n);
  });

  it("rejeita sinal fora da primeira posição ou em campo sem casas decimais", () => {
    const meio = `${DETALHE_MINI.slice(0, 12)}0-123${DETALHE_MINI.slice(17)}`;
    expect(() => decodificarRegistro(meio, MINI)).toThrow(CampoInvalidoError);
    const so = `${DETALHE_MINI.slice(0, 12)}-    ${DETALHE_MINI.slice(17)}`;
    expect(() => decodificarRegistro(so, MINI)).toThrow(CampoInvalidoError);
    const controle = `${DETALHE_MINI.slice(0, -10)}-000000001`;
    expect(() => decodificarRegistro(controle, MINI)).toThrow(CampoInvalidoError);
  });

  it("expõe valores de 2 casas como Centavos", () => {
    const r = decodificarRegistro(DETALHE_MINI, MINI);
    expect(centavosDoCampo(r, "VR_VALOR", MINI)).toBe(123n);
    expect(() => centavosDoCampo(r, "NR_REG", MINI)).toThrow(CampoInvalidoError);
  });
});

describe("criarRegistro", () => {
  it("preenche identificador e valores padrão", () => {
    const r = criarRegistro(MINI, "10");
    expect(r.campos).toMatchObject({ NR_REG: 10n, NM_NOME: "", VR_VALOR: 0n, DT_EVENTO: null });
    expect(criarRegistro(MINI, "T9").campos.NR_REG).toBe("T9");
  });

  it("rejeita tipo e campo desconhecidos", () => {
    expect(() => criarRegistro(MINI, "77")).toThrow(TipoRegistroDesconhecidoError);
    expect(() => criarRegistro(MINI, "10", { NAO_EXISTE: "x" })).toThrow(CampoDesconhecidoError);
  });
});

describe("lerArquivo e gravarArquivo", () => {
  it("lê latin-1 com CRLF e detecta o exercício pelo header", () => {
    const arquivo = lerArquivo(arquivoMini(HEADER_MINI, DETALHE_MINI, T9_MINI), { leiaute: MINI });
    expect(arquivo.exercicio).toBe(2026);
    expect(arquivo.terminadorFinal).toBe(true);
    expect(arquivo.registros.map((r) => r.tipo)).toEqual(["IR", "10", "T9"]);
    expect(arquivo.registros[1]?.campos.NM_NOME).toBe("JOSÉ");
  });

  it("faz ida e volta byte a byte, com e sem terminador final", () => {
    const comFinal = arquivoMini(HEADER_MINI, DETALHE_MINI, T9_MINI);
    const lido = lerArquivo(comFinal, { leiaute: MINI });
    expect(gravarArquivo(lido.registros, { leiaute: MINI })).toEqual(comFinal);

    const semFinal = comFinal.slice(0, -2);
    const lido2 = lerArquivo(semFinal, { leiaute: MINI });
    expect(lido2.terminadorFinal).toBe(false);
    expect(
      gravarArquivo(lido2.registros, { leiaute: MINI, terminadorFinal: lido2.terminadorFinal }),
    ).toEqual(semFinal);
  });

  it("grava a declaração sintética 2026 e a relê sem perdas", () => {
    const registros = declaracaoSintetica();
    const bytes = gravarArquivo(registros);
    const conteudo = texto(bytes);
    expect(conteudo.endsWith("\r\n")).toBe(true);
    expect(conteudo.startsWith("IRPF    20262025")).toBe(true);
    expect(bytes).toContain(0xc9); // "É" de SINTÉTICA em latin-1, um único byte
    const lido = lerArquivo(bytes);
    expect(lido.exercicio).toBe(2026);
    expect(lido.registros).toEqual(registros);
    expect(gravarArquivo(lido.registros)).toEqual(bytes);
  });

  it("usa o leiaute do exercício do header quando nenhum é informado", () => {
    const bytes = gravarArquivo(declaracaoSintetica());
    const outroAno = latin1(texto(bytes).replace(/^IRPF {4}2026/, "IRPF    2019"));
    expect(() => lerArquivo(outroAno)).toThrow(ExercicioNaoSuportadoError);
  });
});

describe("erros de leitura", () => {
  const ler =
    (...linhas: string[]) =>
    () =>
      lerArquivo(arquivoMini(...linhas), { leiaute: MINI });

  it("linha curta ou longa", () => {
    expect(ler(HEADER_MINI, DETALHE_MINI.slice(0, -1))).toThrow(TamanhoLinhaInvalidoError);
    expect(ler(HEADER_MINI, `${DETALHE_MINI} `)).toThrow(TamanhoLinhaInvalidoError);
    try {
      ler(HEADER_MINI, DETALHE_MINI, DETALHE_MINI.slice(0, 20))();
    } catch (e) {
      expect(e).toBeInstanceOf(ArquivoDeclaracaoError);
      expect((e as ArquivoDeclaracaoError).linha).toBe(3);
      expect((e as Error).message).toMatch(/^linha 3, registro 10: /);
    }
  });

  it("tipo desconhecido", () => {
    expect(ler(HEADER_MINI, `XX${DETALHE_MINI.slice(2)}`)).toThrow(TipoRegistroDesconhecidoError);
  });

  it("número com caractere não numérico, sinal ou data impossível", () => {
    expect(ler(HEADER_MINI, DETALHE_MINI.replace("00123", "0012A"))).toThrow(CampoInvalidoError);
    expect(ler(HEADER_MINI, DETALHE_MINI.replace("00123", "0-123"))).toThrow(CampoInvalidoError);
    expect(ler(HEADER_MINI, DETALHE_MINI.replace("15061980", "31021980"))).toThrow(
      CampoInvalidoError,
    );
  });

  it("terminador diferente de CRLF", () => {
    const lf = latin1(`${HEADER_MINI}\n${DETALHE_MINI}\n`);
    expect(() => lerArquivo(lf, { leiaute: MINI })).toThrow(TerminadorLinhaInvalidoError);
    const cr = latin1(`${HEADER_MINI}\r${DETALHE_MINI}\r\n`);
    expect(() => lerArquivo(cr, { leiaute: MINI })).toThrow(TerminadorLinhaInvalidoError);
  });

  it("arquivo vazio ou sem header", () => {
    expect(() => lerArquivo(new Uint8Array())).toThrow(ArquivoDeclaracaoError);
    expect(() => lerArquivo(arquivoMini(DETALHE_MINI))).toThrow(ArquivoDeclaracaoError);
  });
});

describe("erros de gravação", () => {
  const base = (): Registro => criarRegistro(MINI, "10", { NM_NOME: "ANA" });
  const com = (campos: Record<string, unknown>): Registro => ({
    tipo: "10",
    campos: { ...base().campos, ...(campos as Registro["campos"]) },
  });
  const gravar = (r: Registro) => () => gravarArquivo([r], { leiaute: MINI });

  it("caractere fora do latin-1 ou quebra de linha", () => {
    expect(gravar(com({ NM_NOME: "ANA €" }))).toThrow(CaractereInvalidoError);
    expect(gravar(com({ NM_NOME: "ANA 😀" }))).toThrow(CaractereInvalidoError);
    expect(gravar(com({ NM_NOME: "A\r\nB" }))).toThrow(CaractereInvalidoError);
  });

  it("valor negativo em campo numérico sem casas decimais", () => {
    expect(gravar(com({ NR_REG: -1n }))).toThrow(ValorNegativoError);
  });

  it("valor negativo que não cabe no campo com o sinal", () => {
    // VR_VALOR tem 5 posições: o sinal ocupa uma e sobram 4 dígitos.
    expect(gravar(com({ VR_VALOR: -9999n }))).not.toThrow();
    expect(gravar(com({ VR_VALOR: -10000n }))).toThrow(ValorExcedeTamanhoError);
  });

  it("valor ou texto maior que o campo", () => {
    expect(gravar(com({ VR_VALOR: 100000n }))).toThrow(ValorExcedeTamanhoError);
    expect(gravar(com({ NM_NOME: "NOME GRANDE DEMAIS" }))).toThrow(ValorExcedeTamanhoError);
  });

  it("tipo de valor incompatível, data inválida ou campo ausente", () => {
    expect(gravar(com({ VR_VALOR: "12" }))).toThrow(CampoInvalidoError);
    expect(gravar(com({ NM_NOME: 12n }))).toThrow(CampoInvalidoError);
    expect(gravar(com({ DT_EVENTO: "32012020" }))).toThrow(CampoInvalidoError);
    expect(gravar(com({ DT_EVENTO: "1012020" }))).toThrow(CampoInvalidoError);
    const { NM_NOME: _, ...semNome } = base().campos;
    expect(gravar({ tipo: "10", campos: semNome })).toThrow(CampoDesconhecidoError);
    expect(gravar(com({ EXTRA: "x" }))).toThrow(CampoDesconhecidoError);
  });

  it("identificador do registro diferente do tipo", () => {
    expect(gravar(com({ NR_REG: 11n }))).toThrow(CampoInvalidoError);
  });

  it("aponta a linha do registro com erro", () => {
    const registros = [base(), com({ VR_VALOR: 100000n })];
    try {
      gravarArquivo(registros, { leiaute: MINI });
      expect.unreachable();
    } catch (e) {
      expect((e as ArquivoDeclaracaoError).linha).toBe(2);
      expect((e as ArquivoDeclaracaoError).campo).toBe("VR_VALOR");
    }
  });

  it("exige leiaute quando não há header com exercício", () => {
    expect(() => gravarArquivo([base()])).toThrow(ArquivoDeclaracaoError);
  });
});
