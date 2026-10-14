/**
 * Testes de propriedade com gerador pseudoaleatório determinístico (sem dependências):
 * a mesma semente produz sempre os mesmos casos, então uma falha é reproduzível.
 */
import { describe, expect, it } from "vitest";
import {
  ArquivoDeclaracaoError,
  type CampoLeiaute,
  codificarRegistro,
  criarRegistro,
  decodificarRegistro,
  gravarArquivo,
  LEIAUTE_2026,
  lerArquivo,
  type Registro,
  recalcularControles,
  TIPOS_RECIBO,
  type ValorCampo,
  verificarControles,
} from "../../src/dbk/index.js";
import { CPF_TESTE } from "./apoio.js";

/** mulberry32: gerador de 32 bits pequeno e determinístico. */
function gerador(semente: number) {
  let estado = semente >>> 0;
  const proximo = (): number => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const inteiro = (min: number, max: number): number =>
    min + Math.floor(proximo() * (max - min + 1));
  return { proximo, inteiro };
}

type Gerador = ReturnType<typeof gerador>;

// Caracteres imprimíveis do ISO-8859-1 (ASCII e a faixa acentuada).
const ALFABETO = [
  ...Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)),
  ...Array.from({ length: 0xff - 0xa0 + 1 }, (_, i) => String.fromCharCode(0xa0 + i)),
];

function textoAleatorio(g: Gerador, tamanho: number): string {
  const n = g.inteiro(0, tamanho);
  let s = "";
  for (let i = 0; i < n; i++) s += ALFABETO[g.inteiro(0, ALFABETO.length - 1)];
  return s.replace(/ +$/, "");
}

function dataAleatoria(g: Gerador, campo: CampoLeiaute): string {
  const dia = String(g.inteiro(1, 28)).padStart(2, "0");
  const mes = String(g.inteiro(1, 12)).padStart(2, "0");
  const ano = String(g.inteiro(1900, 2099));
  return campo.data === "AAAAMMDD" ? `${ano}${mes}${dia}` : `${dia}${mes}${ano}`;
}

function valorAleatorio(g: Gerador, campo: CampoLeiaute): ValorCampo {
  if (campo.formato !== "N") return textoAleatorio(g, campo.tamanho);
  if (g.proximo() < 0.1) return null;
  if (campo.data !== undefined) return g.proximo() < 0.1 ? "00000000" : dataAleatoria(g, campo);
  let digitos = "";
  const n = g.inteiro(1, campo.tamanho);
  for (let i = 0; i < n; i++) digitos += String(g.inteiro(0, 9));
  return BigInt(digitos);
}

function registroAleatorio(g: Gerador, tipo: string): Registro {
  const definicao = LEIAUTE_2026.tipos.find((t) => t.id === tipo);
  const campos: Record<string, ValorCampo> = {};
  definicao?.campos.forEach((campo, i) => {
    if (i > 0 && !(tipo === "IR" && campo.chave === "SISTEMA")) {
      campos[campo.chave] = valorAleatorio(g, campo);
    }
  });
  return criarRegistro(LEIAUTE_2026, tipo, campos);
}

const TIPOS_DETALHE = LEIAUTE_2026.tipos
  .map((t) => t.id)
  .filter((id) => id !== "IR" && id !== "T9" && id !== "FR" && !TIPOS_RECIBO.has(id));

function declaracaoAleatoria(g: Gerador): Registro[] {
  const header = registroAleatorio(g, "IR");
  const ir = { tipo: "IR", campos: { ...header.campos, EXERCICIO: 2026n } };
  const detalhes = Array.from({ length: g.inteiro(0, 25) }, () =>
    registroAleatorio(g, TIPOS_DETALHE[g.inteiro(0, TIPOS_DETALHE.length - 1)] ?? "16"),
  );
  const t9 = criarRegistro(LEIAUTE_2026, "T9", { NR_CPF: CPF_TESTE });
  return recalcularControles([ir, ...detalhes, t9]);
}

describe("propriedades do codec", () => {
  it("codificar e decodificar qualquer registro de qualquer tipo é identidade", () => {
    const g = gerador(20260001);
    for (const tipo of LEIAUTE_2026.tipos) {
      for (let n = 0; n < 15; n++) {
        const r = registroAleatorio(g, tipo.id);
        const linha = codificarRegistro(r, LEIAUTE_2026);
        expect(linha).toHaveLength(tipo.tamanho);
        expect(decodificarRegistro(linha, LEIAUTE_2026)).toEqual(r);
      }
    }
  });

  it("gravar, ler e regravar arquivos aleatórios é estável byte a byte", () => {
    const g = gerador(20260002);
    for (let n = 0; n < 60; n++) {
      const registros = declaracaoAleatoria(g);
      const bytes = gravarArquivo(registros);
      const lido = lerArquivo(bytes);
      expect(lido.registros).toEqual(registros);
      expect(gravarArquivo(lido.registros)).toEqual(bytes);
      expect(verificarControles(lido.registros).valido).toBe(true);
    }
  });

  // O header fica de fora: o algoritmo do NR_CONTROLE dele não foi determinado.
  it("qualquer alteração de um byte num registro após o header é detectada", () => {
    const g = gerador(20260003);
    let alteracoes = 0;
    for (let n = 0; n < 60; n++) {
      const bytes = gravarArquivo(declaracaoAleatoria(g));
      const inicioLinhas = [0];
      bytes.forEach((b, i) => {
        if (b === 10 && i + 1 < bytes.length) inicioLinhas.push(i + 1);
      });
      const linha = g.inteiro(1, inicioLinhas.length - 1);
      const inicio = inicioLinhas[linha] ?? 0;
      const fim = (inicioLinhas[linha + 1] ?? bytes.length) - 2;
      // Altera um byte depois do identificador do tipo e antes do NR_CONTROLE.
      if (fim - 10 <= inicio + 2) continue;
      const pos = g.inteiro(inicio + 2, fim - 11);
      const original = bytes[pos] ?? 0;
      const trocado = original === 0x30 ? 0x31 : 0x30;
      const copia = bytes.slice();
      copia[pos] = trocado;
      let lido: ReturnType<typeof lerArquivo>;
      try {
        lido = lerArquivo(copia);
      } catch (e) {
        expect(e).toBeInstanceOf(ArquivoDeclaracaoError);
        continue;
      }
      expect(verificarControles(lido.registros).valido).toBe(false);
      alteracoes++;
    }
    expect(alteracoes).toBeGreaterThan(20);
  });

  it("entrada arbitrária só produz erros tipados", () => {
    const g = gerador(20260004);
    const header = gravarArquivo(declaracaoAleatoria(g)).slice(0, 1246);
    for (let n = 0; n < 300; n++) {
      const lixo = new Uint8Array(g.inteiro(0, 400));
      for (let i = 0; i < lixo.length; i++) {
        lixo[i] = g.proximo() < 0.05 ? 13 : g.proximo() < 0.05 ? 10 : g.inteiro(0, 255);
      }
      const entrada = new Uint8Array(header.length + lixo.length);
      entrada.set(n % 2 === 0 ? header : new Uint8Array(header.length).fill(0x20));
      entrada.set(lixo, header.length);
      try {
        lerArquivo(entrada);
      } catch (e) {
        expect(e).toBeInstanceOf(ArquivoDeclaracaoError);
      }
    }
  });
});
