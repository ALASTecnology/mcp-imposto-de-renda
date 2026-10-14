/**
 * Codec genérico do arquivo da declaração (DEC e cópia de segurança DBK).
 *
 * O arquivo é texto ISO-8859-1 (latin-1), uma linha por registro, linhas terminadas por
 * CRLF, campos em posições fixas descritas pelo leiaute do exercício. O tipo do registro
 * é identificado pelos primeiros `leiaute.tamanhoTipo` caracteres da linha (`IR` no
 * header, `16`...`99`, `T9` no fechamento, `HR`/`DR`/`R9` no recibo).
 *
 * Valores dos campos (`ValorCampo`):
 * - formatos `C`, `A` e `I`: `string`, sem os espaços finais de preenchimento;
 * - formato `N`: `bigint` com as casas decimais implícitas (centavos quando `decimais` é 2);
 * - formato `N` de data: `string` de 8 dígitos na ordem do leiaute (`DDMMAAAA`);
 * - `null`: campo inteiramente em branco (espaços), comum em campos numéricos opcionais.
 */

import { type Centavos, centavos } from "../centavos.js";
import {
  ArquivoDeclaracaoError,
  ArquivoGrandeDemaisError,
  CampoDesconhecidoError,
  CampoInvalidoError,
  CaractereInvalidoError,
  type ContextoErroArquivo,
  TamanhoLinhaInvalidoError,
  TerminadorLinhaInvalidoError,
  TipoRegistroDesconhecidoError,
  ValorExcedeTamanhoError,
  ValorNegativoError,
} from "./erros.js";
import type { CampoLeiaute, Leiaute, TipoRegistroLeiaute } from "./leiaute.js";
import { tipoDoLeiaute } from "./leiaute.js";
import { obterLeiaute } from "./leiautes/index.js";

/** Valor de um campo depois de decodificado. */
export type ValorCampo = string | bigint | null;

/** Uma linha do arquivo, com os campos indexados pela chave do leiaute. */
export interface Registro {
  readonly tipo: string;
  readonly campos: Readonly<Record<string, ValorCampo>>;
}

/** Resultado da leitura de um arquivo. */
export interface ArquivoDeclaracao {
  readonly exercicio: number;
  readonly registros: readonly Registro[];
  /** Se a última linha terminava com CRLF (o padrão do programa oficial). */
  readonly terminadorFinal: boolean;
}

export interface OpcoesLeitura {
  /** Leiaute a usar; se omitido, vem do exercício gravado no header `IR`. */
  readonly leiaute?: Leiaute;
  /** Tamanho máximo aceito, em bytes. Padrão: `TAMANHO_MAXIMO_ARQUIVO`. */
  readonly tamanhoMaximo?: number;
}

/**
 * Tamanho máximo de um arquivo da declaração aceito por `lerArquivo`: 20 MB, o mesmo limite
 * da camada de arquivos do servidor. Os maiores arquivos reais têm poucas dezenas de KB; o
 * limite existe para que uma entrada hostil seja recusada antes de qualquer decodificação.
 */
export const TAMANHO_MAXIMO_ARQUIVO = 20 * 1024 * 1024;

export interface OpcoesGravacao {
  /** Leiaute a usar; se omitido, vem do campo `EXERCICIO` do registro `IR`. */
  readonly leiaute?: Leiaute;
  /** Grava CRLF depois da última linha. Padrão: `true`. */
  readonly terminadorFinal?: boolean;
}

const CR = 13;
const LF = 10;
const ESPACO = " ";

/**
 * Converte bytes ISO-8859-1 em texto (cada byte vira o caractere de mesmo código).
 *
 * Cada byte é alargado para uma unidade UTF-16 e decodificado em blocos por `TextDecoder`. O
 * rótulo `latin1` do `TextDecoder` não serve: pelo padrão WHATWG ele é windows-1252, que troca
 * os bytes 0x80 a 0x9F. A versão anterior, com `String.fromCharCode(...bloco)` e concatenação,
 * levava cerca de 2 s para 20 MB; esta leva menos de 100 ms.
 */
export function decodificarLatin1(bytes: Uint8Array): string {
  const bloco = 0x10000;
  const largo = new Uint16Array(Math.min(bloco, bytes.length));
  const decodificador = new TextDecoder("utf-16le");
  const partes: string[] = [];
  for (let i = 0; i < bytes.length; i += bloco) {
    const pedaco = bytes.subarray(i, i + bloco);
    largo.set(pedaco);
    partes.push(decodificador.decode(largo.subarray(0, pedaco.length)));
  }
  return partes.join("");
}

/** Converte texto em bytes ISO-8859-1; lança `CaractereInvalidoError` fora da faixa. */
export function codificarLatin1(texto: string, contexto: ContextoErroArquivo = {}): Uint8Array {
  const bytes = new Uint8Array(texto.length);
  for (let i = 0; i < texto.length; i++) {
    const codigo = texto.charCodeAt(i);
    if (codigo > 0xff) {
      throw new CaractereInvalidoError(
        `caractere fora do ISO-8859-1: U+${codigo.toString(16).toUpperCase().padStart(4, "0")}`,
        contexto,
      );
    }
    bytes[i] = codigo;
  }
  return bytes;
}

function tipoOuErro(leiaute: Leiaute, id: string, linha?: number): TipoRegistroLeiaute {
  const tipo = tipoDoLeiaute(leiaute, id);
  if (!tipo) {
    throw new TipoRegistroDesconhecidoError(
      `tipo de registro desconhecido ${JSON.stringify(id)} no leiaute ${leiaute.exercicio}`,
      linha === undefined ? {} : { linha },
    );
  }
  return tipo;
}

function contextoDe(
  linha: number | undefined,
  tipo: string,
  campo?: Pick<CampoLeiaute, "chave">,
): ContextoErroArquivo {
  return {
    ...(linha === undefined ? {} : { linha }),
    tipo,
    ...(campo === undefined ? {} : { campo: campo.chave }),
  };
}

function bissexto(ano: number): boolean {
  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
}

/** Confere uma data de 8 dígitos; zeros representam data não informada. */
function dataValida(texto: string, campo: CampoLeiaute): boolean {
  if (!/^\d{8}$/.test(texto)) return false;
  if (texto === "00000000") return true;
  const [dia, mes, ano] =
    campo.data === "AAAAMMDD"
      ? [Number(texto.slice(6, 8)), Number(texto.slice(4, 6)), Number(texto.slice(0, 4))]
      : [Number(texto.slice(0, 2)), Number(texto.slice(2, 4)), Number(texto.slice(4, 8))];
  if (mes < 1 || mes > 12 || dia < 1) return false;
  const dias = [31, bissexto(ano) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return dia <= (dias[mes - 1] ?? 0);
}

/**
 * Remove os espaços (0x20) do fim. Laço linear de propósito: `/ +$/` é quadrático num campo de
 * 512 posições com espaços seguidos de um caractere (o motor tenta o fim a partir de cada
 * espaço), cerca de 1 ms por linha num arquivo hostil.
 */
function semEspacosFinais(texto: string): string {
  let fim = texto.length;
  while (fim > 0 && texto.charCodeAt(fim - 1) === 0x20) fim--;
  return texto.slice(0, fim);
}

function decodificarCampo(bruto: string, campo: CampoLeiaute, ctx: ContextoErroArquivo) {
  if (campo.formato !== "N") return semEspacosFinais(bruto);
  // Em branco é só espaço (0x20). `trim()` aceitaria TAB, VT, FF e NBSP (0xA0), que seriam
  // lidos como campo vazio e regravados como espaços, alterando o arquivo sem aviso.
  if (bruto === ESPACO.repeat(bruto.length)) return null;
  if (campo.data !== undefined) {
    if (!dataValida(bruto, campo)) {
      throw new CampoInvalidoError(`data inválida ${JSON.stringify(bruto)} (${campo.data})`, ctx);
    }
    return bruto;
  }
  // Valores monetários (campos com casas decimais) podem vir negativos, com o sinal na
  // primeira posição e zeros à esquerda depois dele ("-000000300000"), como o programa
  // oficial grava a base mensal negativa do carnê-leão. Ver docs/formato-dbk.md.
  const padrao = campo.decimais !== undefined ? /^-?\d+$/ : /^\d+$/;
  if (!padrao.test(bruto)) {
    throw new CampoInvalidoError(`numérico com conteúdo inválido ${JSON.stringify(bruto)}`, ctx);
  }
  // "-000000000000" viraria 0n e seria regravado sem o sinal: a linha regravada não seria a
  // lida, e os controles, calculados sobre a linha regravada, deixariam a alteração passar.
  if (bruto.startsWith("-") && /^-0+$/.test(bruto)) {
    throw new CampoInvalidoError("zero com sinal de menos", ctx);
  }
  return BigInt(bruto);
}

/** Decodifica uma linha (sem o terminador) em `Registro`. */
export function decodificarRegistro(
  linha: string,
  leiaute: Leiaute,
  numeroLinha?: number,
): Registro {
  const id = linha.slice(0, leiaute.tamanhoTipo);
  const tipo = tipoOuErro(leiaute, id, numeroLinha);
  if (linha.length !== tipo.tamanho) {
    throw new TamanhoLinhaInvalidoError(
      `tamanho ${linha.length}, esperado ${tipo.tamanho}`,
      contextoDe(numeroLinha, id),
    );
  }
  const campos: Record<string, ValorCampo> = {};
  for (const campo of tipo.campos) {
    const bruto = linha.slice(campo.inicio - 1, campo.inicio - 1 + campo.tamanho);
    campos[campo.chave] = decodificarCampo(bruto, campo, contextoDe(numeroLinha, id, campo));
  }
  return { tipo: id, campos };
}

function codificarTexto(valor: string, campo: CampoLeiaute, ctx: ContextoErroArquivo): string {
  for (let i = 0; i < valor.length; i++) {
    const codigo = valor.charCodeAt(i);
    if (codigo > 0xff) {
      throw new CaractereInvalidoError(
        `caractere fora do ISO-8859-1: U+${codigo.toString(16).toUpperCase().padStart(4, "0")}`,
        ctx,
      );
    }
    if (codigo === CR || codigo === LF) {
      throw new CaractereInvalidoError("quebra de linha dentro do campo", ctx);
    }
  }
  if (valor.length > campo.tamanho) {
    throw new ValorExcedeTamanhoError(
      `texto com ${valor.length} caracteres, o campo tem ${campo.tamanho}`,
      ctx,
    );
  }
  return valor.padEnd(campo.tamanho, ESPACO);
}

function codificarCampo(valor: ValorCampo, campo: CampoLeiaute, ctx: ContextoErroArquivo): string {
  if (valor === null) return ESPACO.repeat(campo.tamanho);
  if (campo.formato !== "N") {
    if (typeof valor !== "string") {
      throw new CampoInvalidoError(`esperado texto, recebido ${typeof valor}`, ctx);
    }
    return codificarTexto(valor, campo, ctx);
  }
  if (campo.data !== undefined) {
    if (typeof valor !== "string" || !dataValida(valor, campo)) {
      throw new CampoInvalidoError(`data inválida ${String(valor)} (${campo.data})`, ctx);
    }
    return valor;
  }
  if (typeof valor !== "bigint") {
    throw new CampoInvalidoError(`esperado bigint, recebido ${typeof valor}`, ctx);
  }
  if (valor < 0n && campo.decimais === undefined) {
    throw new ValorNegativoError(`valor negativo ${valor} em campo numérico sem sinal`, ctx);
  }
  const negativo = valor < 0n;
  const digitos = (negativo ? -valor : valor).toString();
  const espaco = negativo ? campo.tamanho - 1 : campo.tamanho;
  if (digitos.length > espaco) {
    throw new ValorExcedeTamanhoError(
      `valor ${valor} tem ${digitos.length} dígitos, o campo comporta ${espaco}`,
      ctx,
    );
  }
  return (negativo ? "-" : "") + digitos.padStart(espaco, "0");
}

/** Codifica um `Registro` na linha de largura fixa (sem o terminador). */
export function codificarRegistro(
  registro: Registro,
  leiaute: Leiaute,
  numeroLinha?: number,
): string {
  const tipo = tipoOuErro(leiaute, registro.tipo, numeroLinha);
  const conhecidas = new Set(tipo.campos.map((c) => c.chave));
  for (const chave of Object.keys(registro.campos)) {
    if (!conhecidas.has(chave)) {
      throw new CampoDesconhecidoError(
        "campo não existe no leiaute",
        contextoDe(numeroLinha, registro.tipo, { chave }),
      );
    }
  }
  let linha = "";
  for (const campo of tipo.campos) {
    const ctx = contextoDe(numeroLinha, registro.tipo, campo);
    if (!Object.hasOwn(registro.campos, campo.chave)) {
      throw new CampoDesconhecidoError("campo do leiaute ausente no registro", ctx);
    }
    linha += codificarCampo(registro.campos[campo.chave] ?? null, campo, ctx);
  }
  if (linha.slice(0, leiaute.tamanhoTipo) !== registro.tipo) {
    const primeiro = tipo.campos[0];
    throw new CampoInvalidoError(
      `a linha começaria com ${JSON.stringify(linha.slice(0, leiaute.tamanhoTipo))}, não com o tipo`,
      contextoDe(numeroLinha, registro.tipo, primeiro),
    );
  }
  return linha;
}

function valorPadrao(campo: CampoLeiaute, indice: number, tipo: TipoRegistroLeiaute): ValorCampo {
  if (indice === 0 && tipo.id !== "IR") {
    return campo.formato === "N" ? BigInt(tipo.id) : tipo.id;
  }
  if (tipo.id === "IR" && campo.chave === "SISTEMA") return "IRPF";
  if (campo.formato !== "N") return "";
  return campo.data === undefined ? 0n : null;
}

/**
 * Cria um registro com todos os campos do tipo: identificador preenchido, texto vazio,
 * números zerados e datas em branco, sobrescritos por `campos`.
 */
export function criarRegistro(
  leiaute: Leiaute,
  tipo: string,
  campos: Readonly<Record<string, ValorCampo>> = {},
): Registro {
  const definicao = tipoOuErro(leiaute, tipo);
  const resultado: Record<string, ValorCampo> = {};
  definicao.campos.forEach((campo, i) => {
    resultado[campo.chave] = valorPadrao(campo, i, definicao);
  });
  for (const [chave, valor] of Object.entries(campos)) {
    if (!Object.hasOwn(resultado, chave)) {
      throw new CampoDesconhecidoError("campo não existe no leiaute", { tipo, campo: chave });
    }
    resultado[chave] = valor;
  }
  return { tipo, campos: resultado };
}

/** Lê um campo monetário (2 casas decimais) como `Centavos`; `null` se estiver em branco. */
export function centavosDoCampo(
  registro: Registro,
  chave: string,
  leiaute: Leiaute,
): Centavos | null {
  const campo = tipoOuErro(leiaute, registro.tipo).campos.find((c) => c.chave === chave);
  const ctx = { tipo: registro.tipo, campo: chave };
  if (!campo) throw new CampoDesconhecidoError("campo não existe no leiaute", ctx);
  if (campo.formato !== "N" || campo.decimais !== 2) {
    throw new CampoInvalidoError("campo não é monetário (N com 2 casas decimais)", ctx);
  }
  const valor = registro.campos[chave];
  if (valor === null || valor === undefined) return null;
  if (typeof valor !== "bigint") throw new CampoInvalidoError("valor não é bigint", ctx);
  return centavos(valor);
}

/**
 * Percorre as linhas separadas por CRLF, entregando cada uma a `aoLer` assim que termina.
 * Decodificar linha a linha faz um arquivo hostil falhar na primeira linha ruim, sem antes
 * montar a lista inteira (20 MB de CRLF seriam 10 milhões de linhas vazias).
 */
function percorrerLinhas(texto: string, aoLer: (linha: string, numero: number) => void): boolean {
  let inicio = 0;
  let numero = 0;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    if (c === CR) {
      if (texto.charCodeAt(i + 1) !== LF) {
        throw new TerminadorLinhaInvalidoError("CR sem LF; o arquivo usa CRLF", {
          linha: numero + 1,
        });
      }
      aoLer(texto.slice(inicio, i), ++numero);
      i++;
      inicio = i + 1;
    } else if (c === LF) {
      throw new TerminadorLinhaInvalidoError("LF sem CR; o arquivo usa CRLF", {
        linha: numero + 1,
      });
    }
  }
  if (inicio < texto.length) {
    aoLer(texto.slice(inicio), ++numero);
    return false;
  }
  return true;
}

/** Exercício gravado no header (`IRPF    AAAA...`, posições 9 a 12). */
function exercicioDoHeader(primeira: string | undefined): number {
  if (primeira === undefined || !primeira.startsWith("IR")) {
    throw new ArquivoDeclaracaoError("o arquivo não começa pelo header IR", { linha: 1 });
  }
  const exercicio = primeira.slice(8, 12);
  if (!/^\d{4}$/.test(exercicio)) {
    throw new ArquivoDeclaracaoError(`exercício ilegível no header: ${JSON.stringify(exercicio)}`, {
      linha: 1,
      tipo: "IR",
    });
  }
  return Number(exercicio);
}

/** Lê o arquivo da declaração (DEC ou DBK). */
export function lerArquivo(conteudo: Uint8Array, opcoes: OpcoesLeitura = {}): ArquivoDeclaracao {
  if (conteudo.length === 0) throw new ArquivoDeclaracaoError("arquivo vazio");
  const limite = opcoes.tamanhoMaximo ?? TAMANHO_MAXIMO_ARQUIVO;
  if (conteudo.length > limite) {
    throw new ArquivoGrandeDemaisError(
      `arquivo com ${conteudo.length} bytes, acima do limite de ${limite} bytes`,
    );
  }
  let leiaute = opcoes.leiaute;
  const registros: Registro[] = [];
  const terminadorFinal = percorrerLinhas(decodificarLatin1(conteudo), (linha, numero) => {
    leiaute ??= obterLeiaute(exercicioDoHeader(linha));
    registros.push(decodificarRegistro(linha, leiaute, numero));
  });
  // Só chega aqui sem leiaute se o arquivo não tiver nenhuma linha, o que o teste de vazio
  // acima já impede; a verificação mantém o tipo sem asserção.
  if (!leiaute)
    throw new ArquivoDeclaracaoError("o arquivo não começa pelo header IR", { linha: 1 });
  return { exercicio: leiaute.exercicio, registros, terminadorFinal };
}

/** Leiaute indicado pelo campo EXERCICIO do header `IR` dos registros. */
export function leiauteDosRegistros(registros: readonly Registro[]): Leiaute {
  const header = registros.find((r) => r.tipo === "IR");
  const exercicio = header?.campos.EXERCICIO;
  if (typeof exercicio === "bigint") return obterLeiaute(Number(exercicio));
  if (typeof exercicio === "string" && /^\d{4}$/.test(exercicio)) {
    return obterLeiaute(Number(exercicio));
  }
  throw new ArquivoDeclaracaoError(
    "sem header IR com EXERCICIO para escolher o leiaute; informe opcoes.leiaute",
  );
}

/** Grava os registros no formato do arquivo da declaração (latin-1, CRLF). */
export function gravarArquivo(
  registros: readonly Registro[],
  opcoes: OpcoesGravacao = {},
): Uint8Array {
  const leiaute = opcoes.leiaute ?? leiauteDosRegistros(registros);
  const linhas = registros.map((r, i) => codificarRegistro(r, leiaute, i + 1));
  const final = opcoes.terminadorFinal === false || linhas.length === 0 ? "" : "\r\n";
  const texto = linhas.join("\r\n") + final;
  return codificarLatin1(texto);
}
