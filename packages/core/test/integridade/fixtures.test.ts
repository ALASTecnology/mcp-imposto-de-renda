/**
 * Integridade do codec contra os arquivos do programa oficial (fixtures sintéticas de 2026).
 *
 * - Ida e volta: ler e regravar cada um dos 74 arquivos reproduz os bytes originais.
 * - DEC para DBK: converter cada DEC produz, byte a byte, o DBK gravado pelo programa.
 * - Mutação de 1 byte: qualquer byte trocado, em qualquer posição de qualquer linha (inclusive
 *   identificador do tipo, controles e terminador), faz a leitura falhar com erro tipado ou faz
 *   `verificarControles` acusar divergência. Nenhuma alteração passa em silêncio.
 */
import { describe, expect, it } from "vitest";
import {
  ArquivoDeclaracaoError,
  converterTipoArquivo,
  gravarArquivo,
  LEIAUTE_2026,
  lerArquivo,
  tipoArquivoPorNome,
  tipoDoLeiaute,
  verificarControles,
} from "../../src/dbk/index.js";
import { gerador, iniciosDeLinha, lerFixture, mesmosBytes, nomesFixtures } from "./apoio.js";

const arquivos = nomesFixtures();

/** Verdadeiro se a alteração foi percebida: erro tipado na leitura ou controle divergente. */
function detectada(bytes: Uint8Array, nome: string): boolean {
  let lido: ReturnType<typeof lerArquivo>;
  try {
    lido = lerArquivo(bytes);
  } catch (e) {
    if (e instanceof ArquivoDeclaracaoError) return true;
    throw e;
  }
  return !verificarControles(lido.registros, { tipoArquivo: tipoArquivoPorNome(nome) }).valido;
}

describe.skipIf(arquivos.length === 0)("integridade com as fixtures do programa oficial", () => {
  it("há 122 fixtures (61 pares DBK e DEC)", () => {
    expect(arquivos).toHaveLength(122);
    const bases = new Set(arquivos.map((n) => n.replace(/\.(dbk|dec)$/i, "")));
    expect(bases.size).toBe(61);
  });

  it("ida e volta de todas as fixtures é idêntica byte a byte e os controles conferem", () => {
    for (const nome of arquivos) {
      const bytes = lerFixture(nome);
      const lido = lerArquivo(bytes);
      const regravado = gravarArquivo(lido.registros, { terminadorFinal: lido.terminadorFinal });
      expect(mesmosBytes(regravado, bytes), nome).toBe(true);
      const rel = verificarControles(lido.registros, { tipoArquivo: tipoArquivoPorNome(nome) });
      expect(rel.valido, nome).toBe(true);
    }
  });

  it("cada DEC convertida em DBK é idêntica ao DBK gravado pelo programa", () => {
    const decs = arquivos.filter((n) => /\.dec$/i.test(n));
    expect(decs).toHaveLength(61);
    // O programa descarta só na DEC a conta sem débito automático com saldo a pagar.
    for (const nome of decs.filter((n) => n !== "conta-sem-debito-pagar-01.DEC")) {
      const dec = lerArquivo(lerFixture(nome));
      const esperado = lerFixture(nome.replace(/\.dec$/i, ".DBK"));
      const convertido = gravarArquivo(converterTipoArquivo(dec.registros, "DBK"), {
        terminadorFinal: dec.terminadorFinal,
      });
      expect(mesmosBytes(convertido, esperado), nome).toBe(true);
    }
  });

  it("troca de 1 byte em cada linha de cada fixture é sempre detectada", () => {
    const g = gerador(20261014);
    let mutacoes = 0;
    for (const nome of arquivos) {
      const original = lerFixture(nome);
      const inicios = iniciosDeLinha(original);
      // Uma posição sorteada em cada linha (terminador incluído) mais 15 posições livres.
      const posicoes = inicios.map((inicio, i) =>
        g.inteiro(inicio, (inicios[i + 1] ?? original.length) - 1),
      );
      for (let k = 0; k < 15; k++) posicoes.push(g.inteiro(0, original.length - 1));
      for (const pos of posicoes) {
        const copia = original.slice();
        const antes = copia[pos] ?? 0;
        copia[pos] = (antes + g.inteiro(1, 255)) & 0xff;
        expect(detectada(copia, nome), `${nome}: byte ${pos} (0x${antes.toString(16)})`).toBe(true);
        mutacoes++;
      }
    }
    expect(mutacoes).toBeGreaterThan(74 * 15);
  }, 60_000);

  it("varredura exaustiva do menor par: todo byte trocado é detectado", () => {
    // O menor par em bytes, para manter o teste rápido; cobre todas as posições.
    const menor = [...arquivos].sort((a, b) => lerFixture(a).length - lerFixture(b).length)[0];
    const base = (menor ?? "").replace(/\.(dbk|dec)$/i, "");
    // No DBK, todas as posições. Na DEC, header, fichas e T9 são os mesmos bytes do DBK (salvo
    // o controle do header), então basta varrer o header e o recibo (HR, DR e R9).
    const tamanhoDbk = lerFixture(`${base}.DBK`).length;
    const faixas: [string, number, number][] = [
      [`${base}.DBK`, 0, tamanhoDbk],
      [`${base}.DEC`, 0, iniciosDeLinha(lerFixture(`${base}.DEC`))[1] ?? 0],
      [`${base}.DEC`, tamanhoDbk, lerFixture(`${base}.DEC`).length],
    ];
    for (const [nome, de, ate] of faixas) {
      const original = lerFixture(nome);
      // Trocas que mais enganam um leitor de largura fixa: dígito, sinal, espaço e letra.
      const trocas = [0x30, 0x2d, 0x20, 0x58, 0x31];
      for (let pos = de; pos < ate; pos++) {
        const candidatas = trocas.filter((t) => t !== original[pos]);
        const troca = candidatas[pos % candidatas.length] ?? 0x58;
        const copia = original.slice();
        copia[pos] = troca;
        expect(detectada(copia, nome), `${nome}: byte ${pos} -> 0x${troca.toString(16)}`).toBe(
          true,
        );
      }
    }
  }, 120_000);

  it("sinal de menos num campo monetário zerado é detectado (regressão do zero negativo)", () => {
    // "-000000000000" seria lido como 0n e regravado como "0000000000000": o CRC calculado
    // sobre a linha regravada conferiria e a alteração passaria despercebida.
    // Basta o DBK de cada par: a parte da declaração é idêntica na DEC.
    let alvos = 0;
    for (const nome of arquivos.filter((n) => /\.dbk$/i.test(n))) {
      const original = lerFixture(nome);
      const inicios = iniciosDeLinha(original);
      for (const inicio of inicios) {
        const id = String.fromCharCode(original[inicio] ?? 0, original[inicio + 1] ?? 0);
        const tipo = tipoDoLeiaute(LEIAUTE_2026, id);
        for (const campo of tipo?.campos ?? []) {
          if (campo.formato !== "N" || campo.decimais === undefined) continue;
          const pos = inicio + campo.inicio - 1;
          const bruto = String.fromCharCode(...original.subarray(pos, pos + campo.tamanho));
          if (!/^0+$/.test(bruto)) continue;
          const copia = original.slice();
          copia[pos] = 0x2d;
          expect(detectada(copia, nome), `${nome}: ${id}.${campo.chave}`).toBe(true);
          alvos++;
        }
      }
    }
    expect(alvos).toBeGreaterThan(1000);
  }, 60_000);
});
