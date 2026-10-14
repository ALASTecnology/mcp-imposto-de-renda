/**
 * Controles de integridade do arquivo da declaração.
 *
 * Conferido em arquivos DBK e DEC do exercício 2026 gravados pelo programa oficial:
 * - `NR_CONTROLE` (últimos 10 caracteres) de cada registro, exceto o header: CRC-32 padrão
 *   (polinômio 0xEDB88320, o mesmo do zlib) dos bytes latin-1 da linha sem esses 10
 *   caracteres, em decimal com 10 dígitos. Vale também para os registros do recibo.
 * - `NR_CONTROLE` do header `IR`: CRC-32 de `<8 primeiros dígitos do CPF>.<EXTENSÃO>`
 *   (`DBK` ou `DEC`, em maiúsculas) seguido da linha do header sem os 10 dígitos finais. Por
 *   isso um DBK e um DEC com a mesma linha de header têm controles diferentes.
 * - `T9`: `QT_R<tipo>` conta os registros de cada tipo; `QT_TOTAL` conta os registros da
 *   declaração antes do `T9`, header incluído (recibo excluído).
 * - `NR_HASH` do header `IR`: CRC-32 da concatenação, sem terminadores, das linhas
 *   completas que seguem o header até o `T9` inclusive (recibo excluído).
 * - `NR_HASH` do `R9` (só no DEC): CRC-32 da concatenação das linhas completas entre o
 *   header e o `R9`, ou seja, fichas, `T9`, `HR` e `DR`.
 * Ver docs/formato-dbk.md.
 */

import { codificarRegistro, leiauteDosRegistros, type Registro, type ValorCampo } from "./codec.js";
import { ArquivoDeclaracaoError } from "./erros.js";
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

/** Tipo do arquivo: cópia de segurança (`DBK`) ou arquivo de entrega (`DEC`). */
export type TipoArquivo = "DBK" | "DEC";

/** `DEC` quando há registros do recibo (`HR`, `DR`, `R9`...), senão `DBK`. */
export function inferirTipoArquivo(registros: readonly Registro[]): TipoArquivo {
  return registros.some((r) => TIPOS_RECIBO.has(r.tipo)) ? "DEC" : "DBK";
}

/** Tipo pelo nome do arquivo (extensão `.dbk` ou `.dec`, sem distinguir caixa). */
export function tipoArquivoPorNome(nome: string): TipoArquivo | undefined {
  const m = /\.(dbk|dec)$/i.exec(nome);
  return m?.[1] === undefined ? undefined : (m[1].toUpperCase() as TipoArquivo);
}

/**
 * `NR_CONTROLE` do header `IR`, como o programa oficial o grava: CRC-32 de
 * `<8 primeiros dígitos do CPF>.<tipoArquivo>` seguido da linha do header sem os 10 dígitos
 * finais. Exemplo de prefixo: `10011265.DBK`.
 */
export function calcularControleHeader(
  linhaSemControle: string,
  cpf: string,
  tipoArquivo: TipoArquivo,
): bigint {
  return BigInt(crc32Texto(`${cpf.slice(0, 8)}.${tipoArquivo}${linhaSemControle}`));
}

export interface OpcoesControle {
  readonly leiaute?: Leiaute;
  /**
   * Tipo do arquivo, que entra no `NR_CONTROLE` do header. Sem ele, vale
   * `inferirTipoArquivo(registros)`; ao ler de disco, prefira `tipoArquivoPorNome`.
   */
  readonly tipoArquivo?: TipoArquivo | undefined;
}

export interface OpcoesRecalculo extends OpcoesControle {
  /**
   * O que fazer com o `NR_CONTROLE` do header: `programa` (padrão) aplica a fórmula do
   * programa oficial (`calcularControleHeader`); `preservar` mantém o valor atual; `crc`
   * grava o CRC-32 só da linha (não reproduz o programa oficial).
   */
  readonly controleHeader?: "programa" | "preservar" | "crc";
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

/** CRC-32 das linhas entre o header e o `R9` (exclusive), base do `NR_HASH` do `R9`. */
function hashDoRecibo(linhas: readonly { tipo: string; texto: string }[]): bigint | undefined {
  const fim = linhas.findIndex((l) => l.tipo === "R9");
  if (fim < 0) return undefined;
  let crc = 0;
  for (const { tipo, texto } of linhas.slice(0, fim)) {
    if (tipo !== "IR") crc = crc32Texto(texto, crc);
  }
  return BigInt(crc);
}

/**
 * CPF do header, se o leiaute tiver o campo `NR_CPF`. O valor é usado como está, mesmo fora do
 * formato: exigir 8 dígitos aqui fazia `verificarControles` pular a conferência do header
 * quando um dígito do CPF era trocado por outro caractere, e a alteração passava em silêncio.
 */
function cpfDoHeader(header: Registro | undefined): string | undefined {
  const cpf = header?.campos.NR_CPF;
  return typeof cpf === "string" ? cpf : undefined;
}

/** `NR_HASH` do `R9` calculado sobre os registros como estão; `undefined` sem `R9`. */
export function calcularHashRecibo(
  registros: readonly Registro[],
  leiaute: Leiaute,
): bigint | undefined {
  return hashDoRecibo(
    registros.map((r, i) => ({ tipo: r.tipo, texto: codificarRegistro(r, leiaute, i + 1) })),
  );
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
 * Recalcula os controles: contagens do `T9`, `NR_CONTROLE` de cada registro (inclusive
 * `HR`, `DR` e `R9`), `NR_HASH` do `R9`, `NR_HASH` do header e, por último, o `NR_CONTROLE`
 * do header (conforme `opcoes.controleHeader`, com o tipo de `opcoes.tipoArquivo` ou
 * inferido). O conteúdo dos registros do recibo não muda, só os controles. Devolve novos
 * registros; a entrada não é alterada.
 */
export function recalcularControles(
  registros: readonly Registro[],
  opcoes: OpcoesRecalculo = {},
): Registro[] {
  const leiaute = opcoes.leiaute ?? leiauteDosRegistros(registros);
  const tipoArquivo = opcoes.tipoArquivo ?? inferirTipoArquivo(registros);
  const novos = registros.map((r) => ({ tipo: r.tipo, campos: { ...r.campos } }));
  const atribuir = (r: { campos: Record<string, ValorCampo> }, chave: string, v: ValorCampo) => {
    r.campos[chave] = v;
  };
  const controlar = (r: Registro, i: number): string => {
    let texto = codificarRegistro(r, leiaute, i + 1);
    if (r.tipo !== "IR" && temControle(leiaute, r.tipo)) {
      atribuir(r, "NR_CONTROLE", calcularNumeroControle(texto.slice(0, -10)));
      texto = codificarRegistro(r, leiaute, i + 1);
    }
    return texto;
  };

  const t9 = novos.find((r) => r.tipo === "T9");
  if (t9) {
    for (const [chave, valor] of contagensT9(novos, leiaute)) atribuir(t9, chave, valor);
  }

  const linhas = novos.map((r, i) => ({ tipo: r.tipo, texto: controlar(r, i) }));

  const indiceR9 = novos.findIndex((r) => r.tipo === "R9");
  const r9 = novos[indiceR9];
  const hashRecibo = hashDoRecibo(linhas);
  if (r9 && hashRecibo !== undefined && Object.hasOwn(r9.campos, "NR_HASH")) {
    atribuir(r9, "NR_HASH", hashRecibo);
    linhas[indiceR9] = { tipo: "R9", texto: controlar(r9, indiceR9) };
  }

  const header = novos.find((r) => r.tipo === "IR");
  if (header) {
    const indice = novos.indexOf(header);
    if (Object.hasOwn(header.campos, "NR_HASH")) {
      atribuir(header, "NR_HASH", hashDeLinhas(linhas, VARIANTE_HASH_PADRAO));
    }
    const modo = opcoes.controleHeader ?? "programa";
    if (modo !== "preservar" && temControle(leiaute, "IR")) {
      const semControle = codificarRegistro(header, leiaute, indice + 1).slice(0, -10);
      const cpf = cpfDoHeader(header);
      if (modo === "crc") {
        atribuir(header, "NR_CONTROLE", calcularNumeroControle(semControle));
      } else if (cpf !== undefined) {
        atribuir(header, "NR_CONTROLE", calcularControleHeader(semControle, cpf, tipoArquivo));
      }
    }
  }
  return novos;
}

/**
 * Converte entre cópia de segurança (DBK) e arquivo de entrega (DEC). Nos arquivos do
 * programa oficial, a parte da declaração (header, fichas e `T9`) é idêntica nos dois,
 * salvo o `NR_CONTROLE` do header; o DEC traz, além disso, os registros `HR`, `DR` e `R9`.
 *
 * - Para `DBK`: retira os registros do recibo e recalcula os controles como DBK.
 * - Para `DEC`: só a partir de registros que já têm o recibo (recalcula como DEC). Um DBK
 *   não traz `HR`, `DR` e `R9`, e o `DR` repete dados de cadastro e do resumo que o AutoIR
 *   ainda não monta; por isso a conversão de DBK em DEC falha com erro explícito.
 */
export function converterTipoArquivo(
  registros: readonly Registro[],
  destino: TipoArquivo,
  opcoes: OpcoesControle = {},
): Registro[] {
  const leiaute = opcoes.leiaute ?? leiauteDosRegistros(registros);
  if (destino === "DBK") {
    const declaracao = registros.filter((r) => !TIPOS_RECIBO.has(r.tipo));
    return recalcularControles(declaracao, { leiaute, tipoArquivo: "DBK" });
  }
  if (!registros.some((r) => r.tipo === "R9")) {
    throw new ArquivoDeclaracaoError(
      "conversão para DEC exige os registros do recibo (HR, DR e R9), que o DBK não traz",
    );
  }
  return recalcularControles(registros, { leiaute, tipoArquivo: "DEC" });
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
  /** Tipo de arquivo usado na conferência do `NR_CONTROLE` do header. */
  readonly tipoArquivo: TipoArquivo;
  /**
   * Se o `NR_CONTROLE` do header confere com a fórmula do programa oficial
   * (`calcularControleHeader`). `undefined` sem header ou sem CPF no header.
   */
  readonly controleHeaderConfere: boolean | undefined;
  /**
   * Se o `NR_CONTROLE` do header é o CRC-32 só da linha (informativo, mantido por
   * compatibilidade; o programa oficial usa `calcularControleHeader`). `undefined` sem header.
   */
  readonly controleHeaderConfereComCrc: boolean | undefined;
}

/**
 * Confere os controles dos registros como estão gravados: `NR_CONTROLE` de cada linha
 * (inclusive do recibo), o do header pela fórmula do programa (com `opcoes.tipoArquivo` ou
 * o tipo inferido), contagens do `T9`, `NR_HASH` do header na variante padrão e `NR_HASH`
 * do `R9`. Também lista quais variantes de `NR_HASH` e de `QT_TOTAL` conferem.
 */
export function verificarControles(
  registros: readonly Registro[],
  opcoes: OpcoesControle = {},
): RelatorioControles {
  const leiaute = opcoes.leiaute ?? leiauteDosRegistros(registros);
  const tipoArquivo = opcoes.tipoArquivo ?? inferirTipoArquivo(registros);
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

  const indiceR9 = registros.findIndex((r) => r.tipo === "R9");
  const hashRecibo = hashDoRecibo(linhas);
  if (hashRecibo !== undefined && registros[indiceR9]?.campos.NR_HASH !== undefined) {
    comparar(indiceR9, "NR_HASH", hashRecibo);
  }

  let controleHeaderConfereComCrc: boolean | undefined;
  let controleHeaderConfere: boolean | undefined;
  linhas.forEach(({ tipo, texto }, i) => {
    if (!temControle(leiaute, tipo)) return;
    const semControle = texto.slice(0, -10);
    if (tipo === "IR") {
      const gravado = registros[i]?.campos.NR_CONTROLE;
      controleHeaderConfereComCrc = gravado === calcularNumeroControle(semControle);
      const cpf = cpfDoHeader(registros[i]);
      if (cpf !== undefined) {
        const esperado = calcularControleHeader(semControle, cpf, tipoArquivo);
        controleHeaderConfere = gravado === esperado;
        comparar(i, "NR_CONTROLE", esperado);
      }
    } else {
      comparar(i, "NR_CONTROLE", calcularNumeroControle(semControle));
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
    tipoArquivo,
    controleHeaderConfere,
    controleHeaderConfereComCrc,
  };
}
