/**
 * Controles de integridade do arquivo da declaração.
 *
 * Conferido em arquivos DBK e DEC do exercício 2026 gravados pelo programa oficial:
 * - `NR_CONTROLE` (últimos 10 caracteres) de cada registro, exceto o header: CRC-32 padrão
 *   (polinômio 0xEDB88320, o mesmo do zlib) dos bytes latin-1 da linha sem esses 10
 *   caracteres, em decimal com 10 dígitos. Vale também para os registros do recibo.
 * - `T9`: `QT_R<tipo>` conta os registros de cada tipo; `QT_TOTAL` conta os registros da
 *   declaração antes do `T9`, header incluído (recibo excluído).
 * - `NR_HASH` do header `IR`: CRC-32 da concatenação, sem terminadores, das linhas
 *   completas que seguem o header até o `T9` inclusive (recibo excluído).
 *
 * Não determinado: o `NR_CONTROLE` do próprio header. Um DBK e um DEC com a linha de header
 * idêntica trazem controles diferentes, logo o valor depende de algo fora da linha (e não é
 * o CRC-32 dela). Por isso `recalcularControles` preserva esse campo por padrão e
 * `verificarControles` não o conta como divergência. Também não determinado: `NR_HASH` do
 * `R9` (recibo, emitido pela Receita Federal e nunca recalculado aqui).
 * Ver docs/formato-dbk.md.
 */

import { codificarRegistro, leiauteDosRegistros, type Registro, type ValorCampo } from "./codec.js";
import { type Leiaute, tipoDoLeiaute } from "./leiaute.js";

/** Tipos do recibo de entrega e do complemento do recibo, emitidos pela Receita Federal. */
export const TIPOS_RECIBO: ReadonlySet<string> = new Set([
  "HR",
  "DR",
  "R9",
  "HC",
  "RC",
  "NC",
  "VC",
  "MC",
  "TC",
]);

const TABELA_CRC = (() => {
  const tabela = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    tabela[n] = c >>> 0;
  }
  return tabela;
})();

/** CRC-32 (IEEE 802.3, igual ao `crc32` do zlib). `anterior` permite encadear blocos. */
export function crc32(dados: Uint8Array, anterior = 0): number {
  let c = (anterior ^ 0xffffffff) >>> 0;
  for (let i = 0; i < dados.length; i++) {
    c = (TABELA_CRC[(c ^ (dados[i] ?? 0)) & 0xff] ?? 0) ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

/** CRC-32 de um texto cujos caracteres já estão na faixa latin-1 (um byte cada). */
function crc32Texto(texto: string, anterior = 0): number {
  let c = (anterior ^ 0xffffffff) >>> 0;
  for (let i = 0; i < texto.length; i++) {
    c = (TABELA_CRC[(c ^ texto.charCodeAt(i)) & 0xff] ?? 0) ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

/** Número de controle de um registro, dado o texto da linha sem os 10 últimos caracteres. */
export function calcularNumeroControle(linhaSemControle: string): bigint {
  return BigInt(crc32Texto(linhaSemControle));
}

/** O que entra no cálculo do `NR_HASH` do header. */
export type ConteudoHash = "linhas" | "linhas-crlf" | "linhas-sem-controle" | "controles";

export interface VarianteHash {
  readonly nome: string;
  readonly conteudo: ConteudoHash;
  /** Se o registro `T9` entra no cálculo. */
  readonly incluiT9: boolean;
}

function variante(conteudo: ConteudoHash, incluiT9: boolean): VarianteHash {
  return { nome: `${conteudo}${incluiT9 ? "+T9" : ""}`, conteudo, incluiT9 };
}

/** Variantes do `NR_HASH` conferidas por `verificarControles`. A primeira é a padrão. */
export const VARIANTES_HASH: readonly VarianteHash[] = (
  ["linhas", "linhas-crlf", "linhas-sem-controle", "controles"] as const
).flatMap((c) => [variante(c, true), variante(c, false)]);

export const VARIANTE_HASH_PADRAO: VarianteHash = VARIANTES_HASH[0] ?? variante("linhas", true);

export interface OpcoesControle {
  readonly leiaute?: Leiaute;
}

export interface OpcoesRecalculo extends OpcoesControle {
  /**
   * O que fazer com o `NR_CONTROLE` do header, cujo algoritmo não foi determinado:
   * `preservar` (padrão) mantém o valor atual; `crc` grava o CRC-32 da linha, como nos
   * demais registros (não reproduz o valor do programa oficial).
   */
  readonly controleHeader?: "preservar" | "crc";
}

function temControle(leiaute: Leiaute, tipo: string): boolean {
  const ultimo = tipoDoLeiaute(leiaute, tipo)?.campos.at(-1);
  return ultimo?.chave === "NR_CONTROLE" && ultimo.formato === "N" && ultimo.tamanho === 10;
}

function hashDeLinhas(linhas: readonly { tipo: string; texto: string }[], v: VarianteHash) {
  let crc = 0;
  for (const { tipo, texto } of linhas) {
    if (tipo === "IR" || TIPOS_RECIBO.has(tipo)) continue;
    if (tipo === "T9" && !v.incluiT9) continue;
    if (v.conteudo === "linhas") crc = crc32Texto(texto, crc);
    else if (v.conteudo === "linhas-crlf") crc = crc32Texto(`${texto}\r\n`, crc);
    else if (v.conteudo === "linhas-sem-controle") crc = crc32Texto(texto.slice(0, -10), crc);
    else crc = crc32Texto(texto.slice(-10), crc);
  }
  return BigInt(crc);
}

/** `NR_HASH` do header calculado sobre os registros como estão, na variante pedida. */
export function calcularHashHeader(
  registros: readonly Registro[],
  leiaute: Leiaute,
  varianteHash: VarianteHash = VARIANTE_HASH_PADRAO,
): bigint {
  const linhas = registros.map((r, i) => ({
    tipo: r.tipo,
    texto: codificarRegistro(r, leiaute, i + 1),
  }));
  return hashDeLinhas(linhas, varianteHash);
}

/** Valores esperados nos campos de contagem do `T9`. */
function contagensT9(registros: readonly Registro[], leiaute: Leiaute): Map<string, bigint> {
  const porTipo = new Map<string, number>();
  let total = 0;
  for (const r of registros) {
    if (r.tipo === "T9" || TIPOS_RECIBO.has(r.tipo)) continue;
    porTipo.set(r.tipo, (porTipo.get(r.tipo) ?? 0) + 1);
    total++;
  }
  const esperados = new Map<string, bigint>();
  for (const campo of tipoDoLeiaute(leiaute, "T9")?.campos ?? []) {
    const m = /^QT_R(\w+)$/.exec(campo.chave);
    if (m?.[1] !== undefined) esperados.set(campo.chave, BigInt(porTipo.get(m[1]) ?? 0));
    else if (campo.chave === "QT_TOTAL") esperados.set(campo.chave, BigInt(total));
  }
  return esperados;
}

/**
 * Recalcula os controles da declaração: contagens do `T9`, `NR_CONTROLE` de cada registro
 * e `NR_HASH` do header (o `NR_CONTROLE` do header segue `opcoes.controleHeader`). Os
 * registros do recibo ficam intactos. Devolve novos registros; a entrada não é alterada.
 */
export function recalcularControles(
  registros: readonly Registro[],
  opcoes: OpcoesRecalculo = {},
): Registro[] {
  const leiaute = opcoes.leiaute ?? leiauteDosRegistros(registros);
  const novos = registros.map((r) => ({ tipo: r.tipo, campos: { ...r.campos } }));
  const atribuir = (r: { campos: Record<string, ValorCampo> }, chave: string, v: ValorCampo) => {
    r.campos[chave] = v;
  };

  const t9 = novos.find((r) => r.tipo === "T9");
  if (t9) {
    for (const [chave, valor] of contagensT9(novos, leiaute)) atribuir(t9, chave, valor);
  }

  const linhas: { tipo: string; texto: string }[] = [];
  novos.forEach((r, i) => {
    let texto = codificarRegistro(r, leiaute, i + 1);
    if (r.tipo !== "IR" && !TIPOS_RECIBO.has(r.tipo) && temControle(leiaute, r.tipo)) {
      atribuir(r, "NR_CONTROLE", calcularNumeroControle(texto.slice(0, -10)));
      texto = codificarRegistro(r, leiaute, i + 1);
    }
    linhas.push({ tipo: r.tipo, texto });
  });

  const header = novos.find((r) => r.tipo === "IR");
  if (header) {
    const indice = novos.indexOf(header);
    if (Object.hasOwn(header.campos, "NR_HASH")) {
      atribuir(header, "NR_HASH", hashDeLinhas(linhas, VARIANTE_HASH_PADRAO));
    }
    if (opcoes.controleHeader === "crc" && temControle(leiaute, "IR")) {
      const texto = codificarRegistro(header, leiaute, indice + 1);
      atribuir(header, "NR_CONTROLE", calcularNumeroControle(texto.slice(0, -10)));
    }
  }
  return novos;
}

/** Um campo de controle cujo valor gravado difere do calculado. */
export interface DivergenciaControle {
  readonly linha: number;
  readonly tipo: string;
  readonly campo: string;
  readonly esperado: string;
  readonly encontrado: string;
}

export interface RelatorioControles {
  readonly valido: boolean;
  readonly divergencias: readonly DivergenciaControle[];
  /** Variantes de `NR_HASH` (ver `VARIANTES_HASH`) que reproduzem o valor do header. */
  readonly variantesHashQueConferem: readonly string[];
  /** Interpretações de `QT_TOTAL` do `T9` que reproduzem o valor gravado. */
  readonly variantesTotalQueConferem: readonly string[];
  /**
   * Se o `NR_CONTROLE` do header é o CRC-32 da linha (informativo; o algoritmo do
   * programa oficial para esse campo não foi determinado). `undefined` sem header.
   */
  readonly controleHeaderConfereComCrc: boolean | undefined;
}

/**
 * Confere os controles dos registros como estão gravados: `NR_CONTROLE` de cada linha
 * (inclusive do recibo, exceto o header), contagens do `T9` e `NR_HASH` do header na
 * variante padrão. Também lista quais variantes de `NR_HASH` e de `QT_TOTAL` conferem.
 */
export function verificarControles(
  registros: readonly Registro[],
  opcoes: OpcoesControle = {},
): RelatorioControles {
  const leiaute = opcoes.leiaute ?? leiauteDosRegistros(registros);
  const linhas = registros.map((r, i) => ({
    tipo: r.tipo,
    texto: codificarRegistro(r, leiaute, i + 1),
  }));
  const divergencias: DivergenciaControle[] = [];
  const comparar = (i: number, campo: string, esperado: bigint) => {
    const registro = registros[i];
    if (!registro) return;
    const encontrado = registro.campos[campo];
    if (encontrado !== esperado) {
      divergencias.push({
        linha: i + 1,
        tipo: registro.tipo,
        campo,
        esperado: esperado.toString(),
        encontrado: encontrado === null || encontrado === undefined ? "" : String(encontrado),
      });
    }
  };

  const indiceHeader = registros.findIndex((r) => r.tipo === "IR");
  const hashGravado = registros[indiceHeader]?.campos.NR_HASH;
  if (indiceHeader >= 0 && hashGravado !== undefined) {
    comparar(indiceHeader, "NR_HASH", hashDeLinhas(linhas, VARIANTE_HASH_PADRAO));
  }

  const indiceT9 = registros.findIndex((r) => r.tipo === "T9");
  const variantesTotal: string[] = [];
  if (indiceT9 >= 0) {
    for (const [campo, esperado] of contagensT9(registros, leiaute)) {
      comparar(indiceT9, campo, esperado);
    }
    const gravado = registros[indiceT9]?.campos.QT_TOTAL;
    const declaracao = registros.filter((r) => !TIPOS_RECIBO.has(r.tipo));
    const candidatos: [string, number][] = [
      ["declaracao-sem-T9", declaracao.length - 1],
      ["declaracao-com-T9", declaracao.length],
      ["declaracao-sem-header-e-T9", declaracao.length - 2],
      ["arquivo-inteiro", registros.length],
    ];
    for (const [nome, valor] of candidatos) {
      if (gravado === BigInt(valor)) variantesTotal.push(nome);
    }
  }

  let controleHeaderConfereComCrc: boolean | undefined;
  linhas.forEach(({ tipo, texto }, i) => {
    if (!temControle(leiaute, tipo)) return;
    const esperado = calcularNumeroControle(texto.slice(0, -10));
    if (tipo === "IR") {
      controleHeaderConfereComCrc = registros[i]?.campos.NR_CONTROLE === esperado;
    } else {
      comparar(i, "NR_CONTROLE", esperado);
    }
  });

  const variantesHash = VARIANTES_HASH.filter(
    (v) => hashGravado !== undefined && hashDeLinhas(linhas, v) === hashGravado,
  ).map((v) => v.nome);

  divergencias.sort((a, b) => a.linha - b.linha);
  return {
    valido: divergencias.length === 0,
    divergencias,
    variantesHashQueConferem: variantesHash,
    variantesTotalQueConferem: variantesTotal,
    controleHeaderConfereComCrc,
  };
}
