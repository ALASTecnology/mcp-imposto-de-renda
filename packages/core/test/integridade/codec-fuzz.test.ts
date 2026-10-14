/**
 * Fuzzing determinístico do codec do arquivo da declaração.
 *
 * Contrato verificado em milhares de entradas geradas com semente fixa:
 * - `lerArquivo` só termina de dois jeitos: devolve registros ou lança `ArquivoDeclaracaoError`
 *   (ou subclasse). Nunca `TypeError`, `RangeError`, erro de `BigInt` nem estouro de pilha.
 * - Quando a leitura aceita a entrada, regravar os registros reproduz os mesmos bytes: o codec
 *   não normaliza nada em silêncio (é isso que permite aos controles detectarem alterações).
 * - Nenhuma entrada demora de forma desproporcional ao tamanho: não há regex catastrófica.
 * - Arquivo acima do tamanho máximo é recusado antes de qualquer decodificação.
 */
import { describe, expect, it } from "vitest";
import {
  ArquivoDeclaracaoError,
  ArquivoGrandeDemaisError,
  CampoInvalidoError,
  CaractereInvalidoError,
  codificarLatin1,
  codificarRegistro,
  criarRegistro,
  decodificarRegistro,
  gravarArquivo,
  LEIAUTE_2026,
  lerArquivo,
  type Registro,
  recalcularControles,
  TAMANHO_MAXIMO_ARQUIVO,
  TamanhoLinhaInvalidoError,
  TerminadorLinhaInvalidoError,
  TipoRegistroDesconhecidoError,
  ValorExcedeTamanhoError,
  ValorNegativoError,
  verificarControles,
} from "../../src/dbk/index.js";
import { declaracaoSintetica } from "../dbk/apoio.js";
import { type Gerador, gerador, iniciosDeLinha, medir, mesmosBytes } from "./apoio.js";

type Resultado = { ok: true; bytes: Uint8Array } | { ok: false; erro: ArquivoDeclaracaoError };

/**
 * Lê a entrada e confere o contrato: sucesso com ida e volta exata, ou erro tipado. Qualquer
 * outro erro é relançado e derruba o teste com a semente na mensagem.
 */
function lerComContrato(entrada: Uint8Array, rotulo: string): Resultado {
  try {
    const lido = lerArquivo(entrada);
    const regravado = gravarArquivo(lido.registros, { terminadorFinal: lido.terminadorFinal });
    if (!mesmosBytes(regravado, entrada)) {
      throw new Error(`${rotulo}: leitura aceita, mas regravar não reproduz os bytes`);
    }
    return { ok: true, bytes: regravado };
  } catch (e) {
    if (e instanceof ArquivoDeclaracaoError) return { ok: false, erro: e };
    throw new Error(`${rotulo}: erro não tipado ${(e as Error)?.name}: ${(e as Error)?.message}`);
  }
}

const BASE = gravarArquivo(declaracaoSintetica());
const INICIOS = iniciosDeLinha(BASE);

function linhasDe(bytes: Uint8Array): Uint8Array[] {
  const inicios = iniciosDeLinha(bytes);
  return inicios.map((inicio, i) => bytes.subarray(inicio, (inicios[i + 1] ?? bytes.length) - 2));
}

function juntar(linhas: readonly Uint8Array[], terminador = [13, 10]): Uint8Array {
  const total = linhas.reduce((s, l) => s + l.length + terminador.length, 0);
  const saida = new Uint8Array(total);
  let p = 0;
  for (const l of linhas) {
    saida.set(l, p);
    p += l.length;
    saida.set(terminador, p);
    p += terminador.length;
  }
  return saida;
}

/** Aplica uma mutação estrutural sorteada a um arquivo válido. */
function mutar(g: Gerador, bytes: Uint8Array): { nome: string; saida: Uint8Array } {
  const linhas = linhasDe(bytes).map((l) => l.slice());
  const i = g.inteiro(0, linhas.length - 1);
  const linha = linhas[i] ?? new Uint8Array();
  const tipo = g.inteiro(0, 11);
  switch (tipo) {
    case 0: {
      // Linha truncada em ponto aleatório.
      linhas[i] = linha.subarray(0, g.inteiro(0, Math.max(0, linha.length - 1)));
      return { nome: "linha truncada", saida: juntar(linhas) };
    }
    case 1: {
      // Linha com bytes a mais no fim.
      const extra = new Uint8Array(g.inteiro(1, 20)).fill(0x30);
      const nova = new Uint8Array(linha.length + extra.length);
      nova.set(linha);
      nova.set(extra, linha.length);
      linhas[i] = nova;
      return { nome: "linha longa", saida: juntar(linhas) };
    }
    case 2:
      return { nome: "só LF", saida: juntar(linhas, [10]) };
    case 3:
      return { nome: "só CR", saida: juntar(linhas, [13]) };
    case 4:
      return { nome: "sem terminador", saida: juntar(linhas, []) };
    case 5: {
      // Tipo de registro inexistente (dois caracteres sorteados).
      linha[0] = g.escolher([0x41, 0x5a, 0x30, 0x39, 0x20, 0x00, 0xff]);
      linha[1] = g.escolher([0x41, 0x5a, 0x31, 0x38, 0x20, 0x00, 0xff]);
      return { nome: "tipo desconhecido", saida: juntar(linhas) };
    }
    case 6: {
      // Letra, espaço no meio, sinal fora do lugar ou ponto decimal num trecho numérico.
      const pos = g.inteiro(2, Math.max(2, linha.length - 1));
      linha[pos] = g.escolher([0x41, 0x2d, 0x2b, 0x2e, 0x2c, 0x20, 0x65, 0x78]);
      return { nome: "caractere em campo", saida: juntar(linhas) };
    }
    case 7: {
      // CR ou LF isolado no meio da linha.
      linha[g.inteiro(0, Math.max(0, linha.length - 1))] = g.escolher([10, 13]);
      return { nome: "quebra no meio", saida: juntar(linhas) };
    }
    case 8: {
      // Linhas duplicadas, removidas ou reordenadas.
      const j = g.inteiro(0, linhas.length - 1);
      const k = g.inteiro(0, 2);
      if (k === 0) linhas.splice(j, 0, linhas[i] ?? linha);
      else if (k === 1) linhas.splice(j, 1);
      else [linhas[i], linhas[j]] = [linhas[j] ?? linha, linha];
      return { nome: "ordem de linhas", saida: juntar(linhas) };
    }
    case 9: {
      // Linha vazia ou de espaços.
      linhas.splice(i, 0, new Uint8Array(g.inteiro(0, 3)).fill(0x20));
      return { nome: "linha vazia", saida: juntar(linhas) };
    }
    case 10: {
      // Bytes de controle e da faixa alta (0x80 a 0x9F não são imprimíveis em latin-1).
      for (let k = 0; k < g.inteiro(1, 5); k++) {
        linha[g.inteiro(0, Math.max(0, linha.length - 1))] = g.inteiro(0, 255);
      }
      return { nome: "bytes aleatórios na linha", saida: juntar(linhas) };
    }
    default: {
      // Arquivo cortado em qualquer byte.
      return { nome: "arquivo cortado", saida: bytes.subarray(0, g.inteiro(0, bytes.length)) };
    }
  }
}

describe("fuzzing do codec: só erros tipados, ida e volta exata", () => {
  it("5.000 entradas de bytes totalmente aleatórios", () => {
    const g = gerador(1);
    for (let n = 0; n < 5000; n++) {
      const bytes = new Uint8Array(g.inteiro(0, 2000));
      for (let i = 0; i < bytes.length; i++) bytes[i] = g.inteiro(0, 255);
      const r = lerComContrato(bytes, `semente 1, iteração ${n}`);
      expect(r.ok).toBe(false);
    }
  }, 60_000);

  it("5.000 entradas com header válido seguido de bytes aleatórios", () => {
    const g = gerador(2);
    const header = BASE.subarray(0, INICIOS[1] ?? 0);
    for (let n = 0; n < 5000; n++) {
      const cauda = new Uint8Array(g.inteiro(0, 1500));
      for (let i = 0; i < cauda.length; i++) {
        const x = g.proximo();
        cauda[i] =
          x < 0.03 ? 13 : x < 0.06 ? 10 : x < 0.5 ? g.inteiro(0x30, 0x39) : g.inteiro(0, 255);
      }
      const entrada = new Uint8Array(header.length + cauda.length);
      entrada.set(header);
      entrada.set(cauda, header.length);
      lerComContrato(entrada, `semente 2, iteração ${n}`);
    }
  }, 60_000);

  it("6.000 mutações estruturais de um arquivo válido", () => {
    const g = gerador(3);
    const porTipo = new Map<string, number>();
    for (let n = 0; n < 6000; n++) {
      const { nome, saida } = mutar(g, BASE);
      const r = lerComContrato(saida, `semente 3, iteração ${n} (${nome})`);
      if (r.ok) {
        // Aceita pelo codec: os controles precisam acusar qualquer diferença do original.
        const rel = verificarControles(lerArquivo(saida).registros);
        if (!mesmosBytes(saida, BASE)) {
          expect(rel.valido, `semente 3, iteração ${n} (${nome})`).toBe(false);
        }
      }
      porTipo.set(nome, (porTipo.get(nome) ?? 0) + 1);
    }
    expect(porTipo.size).toBe(12);
  }, 60_000);

  it("cada classe de defeito produz a subclasse de erro esperada", () => {
    const linhas = linhasDe(BASE).map((l) => l.slice());
    const casos: [string, Uint8Array, new (...a: never[]) => ArquivoDeclaracaoError][] = [
      ["vazio", new Uint8Array(), ArquivoDeclaracaoError],
      ["só LF", juntar(linhas, [10]), TerminadorLinhaInvalidoError],
      ["só CR", juntar(linhas, [13]), TerminadorLinhaInvalidoError],
      [
        "linha truncada",
        juntar([...linhas.slice(0, 1), (linhas[1] ?? new Uint8Array()).subarray(0, 100)]),
        TamanhoLinhaInvalidoError,
      ],
      [
        "tipo desconhecido",
        juntar([...linhas.slice(0, 1), codificarLatin1("ZZ".padEnd(40, "0"))]),
        TipoRegistroDesconhecidoError,
      ],
    ];
    for (const [nome, bytes, classe] of casos) {
      expect(() => lerArquivo(bytes), nome).toThrow(classe);
    }
  });

  it("sem CRLF no fim a leitura aceita e a gravação respeita terminadorFinal", () => {
    const semFinal = BASE.subarray(0, BASE.length - 2);
    const lido = lerArquivo(semFinal);
    expect(lido.terminadorFinal).toBe(false);
    expect(mesmosBytes(gravarArquivo(lido.registros, { terminadorFinal: false }), semFinal)).toBe(
      true,
    );
  });
});

describe("campos numéricos: letras, sinais e limites", () => {
  const L = LEIAUTE_2026;
  const tipo21 = L.tipos.find((t) => t.id === "21");
  const campoValor = tipo21?.campos.find((c) => c.chave === "VR_RENDTO");
  const linhaBase = codificarRegistro(criarRegistro(L, "21", { VR_RENDTO: 123456n }), L);
  const inicio = (campoValor?.inicio ?? 1) - 1;
  const tamanho = campoValor?.tamanho ?? 13;
  const comValor = (bruto: string) =>
    linhaBase.slice(0, inicio) + bruto + linhaBase.slice(inicio + tamanho);

  it("aceita só dígitos e um '-' na primeira posição de campo com decimais", () => {
    const validos = ["0".repeat(tamanho), "9".repeat(tamanho), `-${"0".repeat(tamanho - 2)}1`];
    for (const bruto of validos) {
      expect(() => decodificarRegistro(comValor(bruto), L), bruto).not.toThrow();
    }
    const invalidos = [
      `${"0".repeat(tamanho - 1)}A`,
      `+${"0".repeat(tamanho - 1)}`,
      `${"0".repeat(tamanho - 2)}-1`,
      `--${"0".repeat(tamanho - 2)}`,
      `${"0".repeat(tamanho - 3)}1.5`,
      `${"0".repeat(tamanho - 3)}1,5`,
      ` ${"0".repeat(tamanho - 1)}`,
      `${"0".repeat(tamanho - 1)} `,
      `${"0".repeat(tamanho - 4)}1e10`,
      `0x${"0".repeat(tamanho - 2)}`,
      `-${" ".repeat(tamanho - 1)}`,
      "-".padEnd(tamanho, "0"),
    ];
    for (const bruto of invalidos) {
      expect(() => decodificarRegistro(comValor(bruto), L), bruto).toThrow(CampoInvalidoError);
    }
  });

  it("campo numérico com TAB, VT, FF ou NBSP é recusado (regressão: virava null pelo trim)", () => {
    for (const c of [0x09, 0x0b, 0x0c, 0xa0]) {
      const bruto = `${" ".repeat(tamanho - 1)}${String.fromCharCode(c)}`;
      expect(() => decodificarRegistro(comValor(bruto), L), `0x${c.toString(16)}`).toThrow(
        CampoInvalidoError,
      );
    }
    expect(decodificarRegistro(comValor(" ".repeat(tamanho)), L).campos.VR_RENDTO).toBeNull();
  });

  it("zero com sinal é recusado (regressão: era lido como 0n e regravado sem o sinal)", () => {
    expect(() => decodificarRegistro(comValor(`-${"0".repeat(tamanho - 1)}`), L)).toThrow(
      CampoInvalidoError,
    );
  });

  it("sinal em campo numérico sem casas decimais é recusado na leitura e na gravação", () => {
    // Um campo N comum (sem decimais, sem data, fora do identificador e do controle).
    const alvo = L.tipos
      .flatMap((t) => t.campos.map((c, i) => ({ t, c, i })))
      .find(
        ({ c, i }) =>
          i > 0 &&
          c.formato === "N" &&
          c.decimais === undefined &&
          c.data === undefined &&
          c.tamanho >= 2 &&
          c.chave !== "NR_CONTROLE",
      );
    expect(alvo).toBeDefined();
    if (!alvo) return;
    const { t, c: campo } = alvo;
    const linhaTipo = codificarRegistro(criarRegistro(L, t.id), L);
    const linha =
      linhaTipo.slice(0, campo.inicio - 1) +
      `-${"0".repeat(campo.tamanho - 2)}1` +
      linhaTipo.slice(campo.inicio - 1 + campo.tamanho);
    expect(() => decodificarRegistro(linha, L)).toThrow(CampoInvalidoError);
    expect(() => codificarRegistro(criarRegistro(L, t.id, { [campo.chave]: -1n }), L)).toThrow(
      ValorNegativoError,
    );
  });

  it("limites exatos de tamanho na gravação", () => {
    const maximo = 10n ** BigInt(tamanho) - 1n;
    const minimo = -(10n ** BigInt(tamanho - 1) - 1n);
    expect(() => codificarRegistro(criarRegistro(L, "21", { VR_RENDTO: maximo }), L)).not.toThrow();
    expect(() => codificarRegistro(criarRegistro(L, "21", { VR_RENDTO: minimo }), L)).not.toThrow();
    expect(() => codificarRegistro(criarRegistro(L, "21", { VR_RENDTO: maximo + 1n }), L)).toThrow(
      ValorExcedeTamanhoError,
    );
    expect(() => codificarRegistro(criarRegistro(L, "21", { VR_RENDTO: minimo - 1n }), L)).toThrow(
      ValorExcedeTamanhoError,
    );
    const nome = tipo21?.campos.find((c) => c.chave === "NM_PAGADOR");
    const n = nome?.tamanho ?? 60;
    expect(() =>
      codificarRegistro(criarRegistro(L, "21", { NM_PAGADOR: "Á".repeat(n) }), L),
    ).not.toThrow();
    expect(() =>
      codificarRegistro(criarRegistro(L, "21", { NM_PAGADOR: "A".repeat(n + 1) }), L),
    ).toThrow(ValorExcedeTamanhoError);
  });

  it("2.000 valores numéricos sorteados: ou cabem e voltam iguais, ou dão erro tipado", () => {
    const g = gerador(4);
    for (let n = 0; n < 2000; n++) {
      const digitos = g.inteiro(1, tamanho + 3);
      const valor = (g.proximo() < 0.3 ? -1n : 1n) * g.bigintAte(digitos);
      try {
        const linha = codificarRegistro(criarRegistro(L, "21", { VR_RENDTO: valor }), L);
        expect(decodificarRegistro(linha, L).campos.VR_RENDTO).toBe(valor);
      } catch (e) {
        expect(e, `valor ${valor}`).toBeInstanceOf(ValorExcedeTamanhoError);
      }
    }
  });
});

describe("caracteres fora do latin-1 e quebras de linha", () => {
  const L = LEIAUTE_2026;
  // Montados por código: bidi (U+202E), espaço de largura zero (U+200B), separador de linha
  // (U+2028), U+FFFF, euro, emoji, letras do latin estendido e um surrogate isolado.
  const fora = [0x202e, 0x200b, 0x2028, 0xffff, 0x20ac, 0x100, 0x151, 0xd800]
    .map((c) => String.fromCharCode(c))
    .concat(String.fromCodePoint(0x1f600));

  it("texto com caractere fora do ISO-8859-1 é recusado com erro tipado", () => {
    for (const c of fora) {
      const r = criarRegistro(L, "21", { NM_PAGADOR: `EMPRESA ${c} LTDA` });
      expect(() => codificarRegistro(r, L), JSON.stringify(c)).toThrow(CaractereInvalidoError);
      expect(() => codificarLatin1(`x${c}`), JSON.stringify(c)).toThrow(CaractereInvalidoError);
    }
  });

  it("CR ou LF dentro de um campo de texto é recusado (não pode virar um registro novo)", () => {
    for (const c of ["\r", "\n", "\r\n"]) {
      const r = criarRegistro(L, "21", { NM_PAGADOR: `A${c}21` });
      expect(() => codificarRegistro(r, L)).toThrow(CaractereInvalidoError);
    }
  });

  it("toda a faixa latin-1 imprimível e de controle sem CR/LF faz ida e volta", () => {
    let texto = "";
    for (let c = 0; c <= 0xff; c++) if (c !== 10 && c !== 13) texto += String.fromCharCode(c);
    const nome = L.tipos.find((t) => t.id === "21")?.campos.find((c) => c.chave === "NM_PAGADOR");
    const n = nome?.tamanho ?? 60;
    for (let i = 0; i < texto.length; i += n) {
      const pedaco = texto.slice(i, i + n).replace(/ +$/, "");
      const r = criarRegistro(L, "21", { NM_PAGADOR: pedaco });
      const linha = codificarRegistro(r, L);
      expect(decodificarRegistro(linha, L).campos.NM_PAGADOR).toBe(pedaco);
    }
  });
});

describe("tamanho máximo, arquivos enormes e tempo", () => {
  it("arquivo acima de TAMANHO_MAXIMO_ARQUIVO é recusado sem decodificar", () => {
    expect(TAMANHO_MAXIMO_ARQUIVO).toBe(20 * 1024 * 1024);
    const enorme = new Uint8Array(TAMANHO_MAXIMO_ARQUIVO + 1).fill(0x41);
    const antes = process.memoryUsage().heapUsed;
    let erro: unknown;
    const ms = medir(() => {
      try {
        lerArquivo(enorme);
      } catch (e) {
        erro = e;
      }
    });
    const depois = process.memoryUsage().heapUsed;
    expect(erro).toBeInstanceOf(ArquivoGrandeDemaisError);
    expect(erro).toBeInstanceOf(ArquivoDeclaracaoError);
    // Recusar não pode custar a decodificação (que criaria uma string de 20 MB no heap).
    expect(ms).toBeLessThan(50);
    expect(depois - antes).toBeLessThan(5 * 1024 * 1024);
  });

  it("o limite é configurável e o tamanho exato do limite ainda é lido", () => {
    expect(() => lerArquivo(BASE, { tamanhoMaximo: BASE.length - 1 })).toThrow(
      ArquivoGrandeDemaisError,
    );
    expect(lerArquivo(BASE, { tamanhoMaximo: BASE.length }).registros).toHaveLength(INICIOS.length);
  });

  it("arquivo válido perto do limite é lido em tempo linear", () => {
    // Repete a ficha 21 até perto de 20 MB e fecha com T9 recalculado.
    const registros = declaracaoSintetica();
    const ficha = registros.find((r) => r.tipo === "21") as Registro;
    const linha = 172;
    // O T9 conta cada tipo em 5 dígitos: no máximo 99.999 registros 21 (cerca de 17 MB).
    const quantidade = Math.min(99_999, Math.floor((TAMANHO_MAXIMO_ARQUIVO - 20_000) / linha));
    const muitos = recalcularControles([
      ...registros.slice(0, 2),
      ...Array.from({ length: quantidade }, () => ficha),
      ...registros.slice(-1),
    ]);
    const bytes = gravarArquivo(muitos);
    expect(bytes.length).toBeLessThanOrEqual(TAMANHO_MAXIMO_ARQUIVO);
    let lidos = 0;
    const ms = medir(() => {
      lidos = lerArquivo(bytes).registros.length;
    });
    expect(lidos).toBe(muitos.length);
    expect(ms).toBeLessThan(15_000);
  }, 60_000);

  it("20 MB de terminadores vazios falham na primeira linha, sem montar milhões de linhas", () => {
    const vazio = new Uint8Array(TAMANHO_MAXIMO_ARQUIVO);
    for (let i = 0; i < vazio.length; i += 2) {
      vazio[i] = 13;
      vazio[i + 1] = 10;
    }
    let erro: unknown;
    const ms = medir(() => {
      try {
        lerArquivo(vazio, { leiaute: LEIAUTE_2026 });
      } catch (e) {
        erro = e;
      }
    });
    expect(erro).toBeInstanceOf(TipoRegistroDesconhecidoError);
    expect((erro as ArquivoDeclaracaoError).linha).toBe(1);
    expect(ms).toBeLessThan(500);
  });

  it("entradas adversariais para regex (espaços longos, CR em série) não degeneram", () => {
    const L = LEIAUTE_2026;
    const tipo = L.tipos.find((t) => t.campos.some((c) => c.formato === "C" && c.tamanho >= 512));
    expect(tipo).toBeDefined();
    if (!tipo) return;
    const campo = tipo.campos.find((c) => c.formato === "C" && c.tamanho >= 512);
    const base = codificarRegistro(criarRegistro(L, tipo.id), L);
    const inicio = (campo?.inicio ?? 1) - 1;
    // 511 espaços seguidos de um caractere: o pior caso de um /\s+$/ ingênuo.
    const linha = `${base.slice(0, inicio)}${" ".repeat(511)}x${base.slice(inicio + 512)}`;
    const normal = `${base.slice(0, inicio)}${"x".repeat(512)}${base.slice(inicio + 512)}`;
    const vezes = (l: string) =>
      medir(() => {
        for (let i = 0; i < 2000; i++) decodificarRegistro(l, L);
      });
    vezes(normal);
    // Relativo a uma linha comum do mesmo tipo, para não depender da máquina nem da carga. Com
    // o antigo /( +)$/ a linha hostil era mais de 10 vezes mais lenta.
    expect(vezes(linha)).toBeLessThan(3 * vezes(normal) + 20);

    const crs = new Uint8Array(1_000_000).fill(13);
    const ms2 = medir(() => {
      expect(() => lerArquivo(crs, { leiaute: L })).toThrow(TerminadorLinhaInvalidoError);
    });
    expect(ms2).toBeLessThan(200);
  });

  it("o pior caso do fuzzing fica dentro de um orçamento por byte", () => {
    const g = gerador(5);
    let pior = 0;
    for (let n = 0; n < 300; n++) {
      const { saida } = mutar(g, BASE);
      const ms = medir(() => {
        lerComContrato(saida, `semente 5, iteração ${n}`);
      });
      pior = Math.max(pior, ms / Math.max(1, saida.length));
    }
    // Ler e regravar um arquivo de ~6 KB leva bem menos de 1 ms; 0,05 ms por byte é folga
    // de duas ordens de grandeza e ainda pega qualquer comportamento quadrático.
    expect(pior).toBeLessThan(0.05);
  });
});
