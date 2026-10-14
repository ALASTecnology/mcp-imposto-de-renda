/**
 * arquivos/: única porta de acesso ao disco do servidor MCP.
 *
 * Tudo o que as ferramentas leem ou gravam passa por uma `PastaAutorizada`, criada a partir do
 * diretório passado em `--dir`. As regras valem para qualquer ferramenta, presente ou futura:
 *
 * - o nome do arquivo é sempre relativo à pasta: caminho absoluto, `..`, barra invertida,
 *   bytes de controle (inclusive o nulo), segmentos ocultos e nomes de dispositivo são recusados;
 * - cada ferramenta informa as extensões que aceita;
 * - links simbólicos não são seguidos: nem no arquivo final (recusado) nem em pastas
 *   intermediárias que levem para fora (conferido com `realpath`);
 * - leitura e escrita têm limite de tamanho;
 * - a escrita é atômica (temporário na mesma pasta, `fsync`, `rename`) e, antes de sobrescrever,
 *   guarda uma cópia com carimbo de data em `.mcp-imposto-de-renda-backups`, com rotação.
 *
 * Mensagens de erro citam só o nome relativo informado, nunca o caminho absoluto da máquina.
 */
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { constants, type Dirent, type Stats } from "node:fs";
import {
  type FileHandle,
  lstat,
  mkdir,
  open,
  readdir,
  realpath,
  rename,
  unlink,
} from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, join, sep } from "node:path";
import { ErroFerramenta } from "../erros.js";

/** Pasta, dentro da pasta autorizada, onde ficam as cópias de segurança automáticas. */
export const PASTA_BACKUPS = ".mcp-imposto-de-renda-backups";
/**
 * Pasta de cópias das versões publicadas com o nome antigo do projeto. É só lida, por
 * `listarCopias` e `restaurarCopia`, para que as cópias antigas continuem acessíveis; nada novo
 * é gravado nela.
 */
export const PASTA_BACKUPS_ANTIGA = ".autoir-backups";
/** Pastas consultadas ao listar e restaurar cópias, da atual para a antiga. */
const PASTAS_BACKUPS_LEITURA = [PASTA_BACKUPS, PASTA_BACKUPS_ANTIGA] as const;
/** Tamanho máximo padrão de um arquivo lido ou gravado: 20 MB. */
export const LIMITE_PADRAO_BYTES = 20 * 1024 * 1024;
/** Quantas cópias de segurança manter por arquivo. */
export const MAX_BACKUPS_PADRAO = 10;
/** Maior quantidade de itens devolvida por `listar`. */
export const MAX_ITENS_LISTAGEM = 500;

export type CodigoErroArquivo =
  | "CAMINHO_INVALIDO"
  | "FORA_DA_PASTA"
  | "EXTENSAO_NAO_PERMITIDA"
  | "LINK_SIMBOLICO"
  | "NAO_ENCONTRADO"
  | "NAO_E_ARQUIVO"
  | "MUITO_GRANDE"
  | "PASTA_INVALIDA"
  | "FALHA_ESCRITA"
  | "ARQUIVO_ALTERADO";

/** Erro de acesso a arquivo, com código estável e mensagem segura para o LLM. */
export class ErroArquivo extends ErroFerramenta {
  override readonly name = "ErroArquivo";
  readonly codigo: CodigoErroArquivo;
  constructor(codigo: CodigoErroArquivo, mensagem: string) {
    super(mensagem);
    this.codigo = codigo;
  }
}

export interface OpcoesPasta {
  /** Tamanho máximo, em bytes, de arquivo lido ou gravado. Padrão: 20 MB. */
  readonly limiteBytes?: number;
  /** Cópias de segurança mantidas por arquivo. Padrão: 10. */
  readonly maxBackups?: number;
  /** Relógio usado no carimbo dos backups (injetável nos testes). */
  readonly relogio?: () => Date;
}

/** Pontos de interrupção da escrita, usados nos testes para simular falha no meio. */
export interface GanchosEscrita {
  readonly antesDeRenomear?: () => void | Promise<void>;
}

export interface ResultadoEscrita {
  /** Nome relativo do arquivo gravado. */
  readonly arquivo: string;
  readonly bytes: number;
  /** Caminho relativo da cópia de segurança do conteúdo anterior, se havia arquivo. */
  readonly backup?: string;
}

export interface ItemArquivo {
  readonly nome: string;
  readonly tamanho: number;
  /** Data da última modificação, ISO 8601. */
  readonly modificadoEm: string;
}

export interface PastaAutorizada {
  /** Caminho real da pasta. Uso interno: não devolva ao cliente MCP. */
  readonly raiz: string;
  readonly limiteBytes: number;
  ler(nome: string, extensoes: readonly string[]): Promise<Uint8Array>;
  escrever(
    nome: string,
    dados: Uint8Array,
    extensoes: readonly string[],
    ganchos?: GanchosEscrita,
  ): Promise<ResultadoEscrita>;
  listar(extensoes: readonly string[]): Promise<ItemArquivo[]>;
  /**
   * Remove um arquivo da pasta autorizada, guardando antes uma cópia em `.mcp-imposto-de-renda-backups`.
   * Recusa links simbólicos e o que não for arquivo comum.
   */
  remover(nome: string, extensoes: readonly string[]): Promise<ResultadoRemocao>;
  /**
   * Cópias de segurança em `.mcp-imposto-de-renda-backups`, da mais recente para a mais antiga
   * (data do carimbo e, no mesmo segundo, a sequência), até `MAX_ITENS_LISTAGEM`. Com `arquivo`,
   * só as cópias desse arquivo de origem (o filtro vem antes do corte).
   */
  listarCopias(arquivo?: string): Promise<CopiaSeguranca[]>;
  /**
   * Localiza uma cópia pelo nome direto no disco, sem depender do corte da listagem. Lança
   * `NAO_ENCONTRADO` se ela não existir.
   */
  localizarCopia(copia: string): Promise<CopiaSeguranca>;
  /**
   * Restaura uma cópia (pelo nome devolvido em `listarCopias`) sobre `destino`, que também
   * ganha backup antes de ser sobrescrito. O nome da cópia é conferido contra o padrão.
   */
  restaurarCopia(
    copia: string,
    destino: string,
    extensoes: readonly string[],
  ): Promise<ResultadoEscrita>;
  /**
   * Executa `operacao` (o ciclo inteiro de ler, alterar e gravar de uma ferramenta) com
   * exclusividade sobre os arquivos `nomes`: uma fila por caminho real, para que duas gravações
   * simultâneas no mesmo arquivo não percam alteração. Nomes inválidos são ignorados (a própria
   * operação os recusa). Arquivos tocados pela operação e não listados em `nomes` entram na fila
   * quando usados, se isso não puder causar espera circular; em qualquer caso, a gravação confere
   * antes do `rename` se o arquivo mudou desde que a operação o leu e, se mudou, recusa.
   */
  transacao<T>(nomes: readonly string[], operacao: () => Promise<T>): Promise<T>;
}

export interface CopiaSeguranca {
  /** Nome da cópia dentro de `.mcp-imposto-de-renda-backups`. */
  readonly copia: string;
  /** Nome relativo do arquivo de origem. */
  readonly arquivo: string;
  /** Carimbo da cópia, ISO 8601 em UTC. */
  readonly criadaEm: string;
  readonly tamanho: number;
}

export interface ResultadoRemocao {
  /** Nome relativo do arquivo removido. */
  readonly arquivo: string;
  /** Caminho relativo da cópia de segurança do conteúdo removido. */
  readonly backup: string;
}

const DISPOSITIVO = /^(con|prn|aux|nul|clock\$|conin\$|conout\$|com[0-9¹²³]|lpt[0-9¹²³])(\..*)?$/i;
// biome-ignore lint/suspicious/noControlCharactersInRegex: o objetivo é justamente detectar bytes de controle.
const CONTROLE = /[\u0000-\u001f\u007f]/;
const MAX_NOME = 255;
const O_NOFOLLOW = constants.O_NOFOLLOW ?? 0;

function codigoErro(e: unknown): string | undefined {
  return typeof e === "object" && e !== null && "code" in e ? String(e.code) : undefined;
}

function dentro(raiz: string, caminho: string): boolean {
  return caminho === raiz || caminho.startsWith(raiz + sep);
}

function invalido(mensagem: string): ErroArquivo {
  return new ErroArquivo(
    "CAMINHO_INVALIDO",
    `${mensagem} Informe apenas o nome do arquivo relativo à pasta autorizada (ex.: "declaracao.DBK" ou "2026/declaracao.DBK").`,
  );
}

/** Confere o nome informado e devolve os segmentos do caminho relativo. */
function validarNome(nome: unknown, extensoes: readonly string[]): string[] {
  if (typeof nome !== "string" || nome.trim() === "") throw invalido("Nome de arquivo vazio.");
  if (nome.length > MAX_NOME) throw invalido(`Nome com mais de ${MAX_NOME} caracteres.`);
  if (CONTROLE.test(nome)) throw invalido("O nome contém caractere de controle.");
  if (nome.includes("\\")) throw invalido("Use / como separador, nunca barra invertida.");
  if (isAbsolute(nome) || /^[A-Za-z]:/.test(nome) || nome.startsWith("~")) {
    throw invalido("Caminho absoluto não é aceito.");
  }
  const segmentos = nome.split("/");
  for (const s of segmentos) {
    if (s === "..") {
      throw new ErroArquivo(
        "FORA_DA_PASTA",
        `O caminho "${nome}" sai da pasta autorizada. Só arquivos dentro dela podem ser usados.`,
      );
    }
  }
  for (const s of segmentos) {
    if (s === "") throw invalido("O caminho tem segmento vazio.");
    if (s.startsWith(".")) throw invalido("Arquivos e pastas ocultos não são acessíveis.");
    if (s.endsWith(".") || s.endsWith(" ")) throw invalido("Nome terminado em ponto ou espaço.");
    if (DISPOSITIVO.test(s)) throw invalido(`"${s}" é nome reservado de dispositivo.`);
  }
  const ext = extname(segmentos.at(-1) ?? "").toLowerCase();
  const permitidas = extensoes.map((e) => e.toLowerCase());
  if (!permitidas.includes(ext)) {
    throw new ErroArquivo(
      "EXTENSAO_NAO_PERMITIDA",
      `Extensão não permitida nesta ferramenta. Aceitas: ${extensoes.join(", ")}.`,
    );
  }
  return segmentos;
}

function naoEncontrado(nome: string): ErroArquivo {
  return new ErroArquivo(
    "NAO_ENCONTRADO",
    `Arquivo "${nome}" não encontrado na pasta autorizada. Use listar_arquivos para ver os disponíveis.`,
  );
}

function muitoGrande(limite: number): ErroArquivo {
  const mb = (limite / (1024 * 1024)).toFixed(limite % (1024 * 1024) === 0 ? 0 : 2);
  return new ErroArquivo("MUITO_GRANDE", `Arquivo acima do limite de ${mb} MB (${limite} bytes).`);
}

function link(nome: string): ErroArquivo {
  return new ErroArquivo(
    "LINK_SIMBOLICO",
    `"${nome}" é um link simbólico. Por segurança o MCP Imposto de Renda não segue links; use o arquivo real.`,
  );
}

async function lstatOuNada(caminho: string): Promise<Stats | undefined> {
  try {
    return await lstat(caminho);
  } catch (e) {
    if (codigoErro(e) === "ENOENT") return undefined;
    throw e;
  }
}

/** Carimbo compacto em UTC: 20261014T120000Z. */
function carimbo(d: Date): string {
  return d
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replaceAll("-", "")
    .replaceAll(":", "");
}

const PADRAO_BACKUP = /^(.*)\.(\d{8}T\d{6}Z)(?:-(\d+))?\.bak$/;

/** Descrição de uma cópia a partir do nome (já conferido com `PADRAO_BACKUP`). */
function descreverCopia(copia: string, m: RegExpExecArray, tamanho: number): CopiaSeguranca {
  const c = m[2] ?? "";
  return {
    copia,
    arquivo: nomeDoPrefixo(m[1] ?? ""),
    criadaEm: `${c.slice(0, 4)}-${c.slice(4, 6)}-${c.slice(6, 8)}T${c.slice(9, 11)}:${c.slice(11, 13)}:${c.slice(13, 15)}Z`,
    tamanho,
  };
}

/**
 * Prefixo da cópia de segurança a partir do nome relativo, reversível e sem colisão: `%` vira
 * `%25` e `/` vira `%2F` (antes, `/` virava `__`, e `a__b.DBK` colidia com `a/b.DBK`).
 */
export function prefixoBackup(nome: string): string {
  return nome.replaceAll("%", "%25").replaceAll("/", "%2F");
}

/** Nome relativo a partir do prefixo da cópia (inverso de `prefixoBackup`). */
export function nomeDoPrefixo(prefixo: string): string {
  return prefixo.replace(/%2F|%25/gi, (x) => (x.toUpperCase() === "%2F" ? "/" : "%"));
}

/** Espaço do carimbo e da sequência no nome da cópia: `.AAAAMMDDTHHMMSSZ-999.bak`. */
const TAMANHO_SUFIXO_BACKUP = 25;

/** Temporário da escrita atômica: nome curto e reconhecível, limpo na abertura da pasta. */
const PREFIXO_TEMPORARIO = ".mcp-imposto-de-renda-";
// Também reconhece os temporários deixados pelas versões com o nome antigo do projeto.
const PADRAO_TEMPORARIO = /^\.(?:mcp-imposto-de-renda|autoir)-[0-9a-f-]{36}\.tmp$/;

/**
 * Identidade de um arquivo visto numa transação (inode, tamanho e data de modificação), ou
 * `null` se ele não existia. Serve para perceber alteração feita por outro processo.
 */
type Assinatura = {
  readonly ino: number;
  readonly tamanho: number;
  readonly mtimeMs: number;
} | null;

interface Transacao {
  /** Chaves (caminho real normalizado) já travadas por esta transação. */
  readonly chaves: Set<string>;
  /** Maior chave travada: novas travas só esperam se vierem depois dela (sem espera circular). */
  maior: string;
  readonly liberar: (() => void)[];
  /** Assinatura de cada arquivo na primeira vez em que a transação o viu. */
  readonly vistos: Map<string, Assinatura>;
}

const transacaoAtual = new AsyncLocalStorage<Transacao>();
/** Fila de cada caminho real: a promessa que termina quando o último da fila libera. */
const filas = new Map<string, Promise<void>>();

/** Chave da fila: o caminho real, sem distinguir maiúsculas (macOS e Windows não distinguem). */
function chaveDe(caminho: string): string {
  return caminho.normalize("NFC").toLowerCase();
}

function assinatura(st: Stats | undefined): Assinatura {
  return st ? { ino: st.ino, tamanho: st.size, mtimeMs: st.mtimeMs } : null;
}

function mesmaAssinatura(a: Assinatura, b: Assinatura): boolean {
  if (a === null || b === null) return a === b;
  return a.ino === b.ino && a.tamanho === b.tamanho && a.mtimeMs === b.mtimeMs;
}

/** Entra na fila de `chave` e devolve a função que libera a vez. */
async function travar(chave: string): Promise<() => void> {
  const anterior = filas.get(chave) ?? Promise.resolve();
  let liberar = () => {};
  const minha = new Promise<void>((ok) => {
    liberar = ok;
  });
  const cauda = anterior.then(() => minha);
  filas.set(chave, cauda);
  await anterior;
  return () => {
    liberar();
    if (filas.get(chave) === cauda) filas.delete(chave);
  };
}

async function garantirTrava(tx: Transacao, chave: string): Promise<void> {
  if (tx.chaves.has(chave)) return;
  // Fora de ordem: esperar poderia formar ciclo com outra transação. Segue sem a trava; a
  // conferência da assinatura antes do rename continua protegendo a gravação.
  if (tx.chaves.size > 0 && chave < tx.maior) return;
  tx.liberar.push(await travar(chave));
  tx.chaves.add(chave);
  tx.maior = chave;
}

function registrarVisto(tx: Transacao | undefined, chave: string, st: Stats | undefined): void {
  if (tx && !tx.vistos.has(chave)) tx.vistos.set(chave, assinatura(st));
}

function alterado(nome: string): ErroArquivo {
  return new ErroArquivo(
    "ARQUIVO_ALTERADO",
    `"${nome}" foi alterado por outro programa durante esta operação; nada foi gravado. Repita a operação para partir da versão atual.`,
  );
}

/** Confere, antes de gravar ou remover, se o arquivo continua como a transação o viu. */
async function conferirAssinatura(
  tx: Transacao | undefined,
  chave: string,
  caminho: string,
  nome: string,
): Promise<void> {
  if (!tx) return;
  const visto = tx.vistos.get(chave);
  if (visto === undefined) return;
  if (!mesmaAssinatura(visto, assinatura(await lstatOuNada(caminho)))) throw alterado(nome);
}

async function lerHandle(h: FileHandle, nome: string, limite: number): Promise<Uint8Array> {
  return (await lerHandleComStat(h, nome, limite)).dados;
}

async function lerHandleComStat(
  h: FileHandle,
  nome: string,
  limite: number,
): Promise<{ dados: Uint8Array; st: Stats }> {
  const st = await h.stat();
  if (!st.isFile()) {
    throw new ErroArquivo("NAO_E_ARQUIVO", `"${nome}" não é um arquivo comum.`);
  }
  if (st.size > limite) throw muitoGrande(limite);
  // Lê até limite + 1 para perceber arquivo que cresceu depois do stat.
  const buffer = Buffer.alloc(Math.min(st.size, limite) + 1);
  let total = 0;
  for (;;) {
    const { bytesRead } = await h.read(buffer, total, buffer.length - total, total);
    if (bytesRead === 0) break;
    total += bytesRead;
    if (total >= buffer.length) break;
  }
  if (total > limite) throw muitoGrande(limite);
  return { dados: new Uint8Array(buffer.buffer, buffer.byteOffset, total), st };
}

class PastaAutorizadaImpl implements PastaAutorizada {
  readonly limiteBytes: number;
  private readonly maxBackups: number;
  private readonly relogio: () => Date;

  readonly raiz: string;

  constructor(raiz: string, opcoes: OpcoesPasta) {
    this.raiz = raiz;
    this.limiteBytes = opcoes.limiteBytes ?? LIMITE_PADRAO_BYTES;
    this.maxBackups = Math.max(1, opcoes.maxBackups ?? MAX_BACKUPS_PADRAO);
    this.relogio = opcoes.relogio ?? (() => new Date());
  }

  /** Resolve o nome para o caminho real, garantindo que a pasta-mãe está dentro da raiz. */
  private async resolver(nome: string, extensoes: readonly string[]): Promise<string> {
    const segmentos = validarNome(nome, extensoes);
    const alvo = join(this.raiz, ...segmentos);
    let pai: string;
    try {
      pai = await realpath(dirname(alvo));
    } catch (e) {
      if (codigoErro(e) === "ENOENT" || codigoErro(e) === "ENOTDIR") {
        throw new ErroArquivo(
          "NAO_ENCONTRADO",
          `A pasta de "${nome}" não existe dentro da pasta autorizada (a escrita não cria pastas).`,
        );
      }
      throw e;
    }
    if (!dentro(this.raiz, pai)) {
      throw new ErroArquivo(
        "FORA_DA_PASTA",
        `O caminho "${nome}" leva para fora da pasta autorizada (link simbólico em pasta intermediária).`,
      );
    }
    return join(pai, basename(alvo));
  }

  async transacao<T>(nomes: readonly string[], operacao: () => Promise<T>): Promise<T> {
    const atual = transacaoAtual.getStore();
    const chaves = await this.chavesDe(nomes);
    if (atual) {
      for (const k of chaves) await garantirTrava(atual, k);
      return operacao();
    }
    const tx: Transacao = { chaves: new Set(), maior: "", liberar: [], vistos: new Map() };
    try {
      // Em ordem crescente: duas transações nunca esperam uma pela outra em ciclo.
      for (const k of chaves) await garantirTrava(tx, k);
      return await transacaoAtual.run(tx, operacao);
    } finally {
      for (const liberar of tx.liberar.reverse()) liberar();
    }
  }

  /** Chaves de fila dos nomes informados, em ordem, sem repetição; nomes inválidos ficam fora. */
  private async chavesDe(nomes: readonly string[]): Promise<string[]> {
    const chaves = new Set<string>();
    for (const nome of nomes) {
      let segmentos: string[];
      try {
        segmentos = validarNome(nome, [extname(nome)]);
      } catch {
        continue;
      }
      const alvo = join(this.raiz, ...segmentos);
      const pai = await realpath(dirname(alvo)).catch(() => dirname(alvo));
      chaves.add(chaveDe(join(pai, basename(alvo))));
    }
    return [...chaves].sort();
  }

  async ler(nome: string, extensoes: readonly string[]): Promise<Uint8Array> {
    const caminho = await this.resolver(nome, extensoes);
    const tx = transacaoAtual.getStore();
    const chave = chaveDe(caminho);
    if (tx) await garantirTrava(tx, chave);
    const st = await lstatOuNada(caminho);
    if (!st) throw naoEncontrado(nome);
    if (st.isSymbolicLink()) throw link(nome);
    if (!st.isFile()) throw new ErroArquivo("NAO_E_ARQUIVO", `"${nome}" não é um arquivo comum.`);
    if (st.size > this.limiteBytes) throw muitoGrande(this.limiteBytes);
    let h: FileHandle;
    try {
      h = await open(caminho, constants.O_RDONLY | O_NOFOLLOW);
    } catch (e) {
      if (codigoErro(e) === "ELOOP") throw link(nome);
      if (codigoErro(e) === "ENOENT") throw naoEncontrado(nome);
      throw e;
    }
    try {
      const lido = await lerHandleComStat(h, nome, this.limiteBytes);
      registrarVisto(tx, chave, lido.st);
      return lido.dados;
    } finally {
      await h.close();
    }
  }

  async escrever(
    nome: string,
    dados: Uint8Array,
    extensoes: readonly string[],
    ganchos: GanchosEscrita = {},
  ): Promise<ResultadoEscrita> {
    if (dados.length > this.limiteBytes) throw muitoGrande(this.limiteBytes);
    const destino = await this.resolver(nome, extensoes);
    const tx = transacaoAtual.getStore();
    const chave = chaveDe(destino);
    if (tx) await garantirTrava(tx, chave);
    const atual = await lstatOuNada(destino);
    registrarVisto(tx, chave, atual);
    if (atual?.isSymbolicLink()) throw link(nome);
    if (atual && !atual.isFile()) {
      throw new ErroArquivo("NAO_E_ARQUIVO", `"${nome}" existe e não é um arquivo comum.`);
    }
    if (atual && prefixoBackup(nome).length + TAMANHO_SUFIXO_BACKUP > MAX_NOME) {
      // Valida antes de qualquer efeito: a cópia de segurança não caberia no limite de nome.
      throw invalido(
        `Nome longo demais para guardar a cópia de segurança; use um nome com até ${MAX_NOME - TAMANHO_SUFIXO_BACKUP} caracteres.`,
      );
    }
    const backup = atual ? await this.fazerBackup(nome) : undefined;

    const temporario = join(dirname(destino), `${PREFIXO_TEMPORARIO}${randomUUID()}.tmp`);
    try {
      const h = await open(temporario, "wx", 0o600);
      try {
        await h.writeFile(dados);
        await h.sync();
      } finally {
        await h.close();
      }
      await ganchos.antesDeRenomear?.();
      // Defesa além da fila: se outro processo mudou o arquivo desde a leitura, não sobrescreve.
      await conferirAssinatura(tx, chave, destino, nome);
      await rename(temporario, destino);
    } catch (e) {
      await unlink(temporario).catch(() => undefined);
      if (e instanceof ErroArquivo) throw e;
      throw new ErroArquivo(
        "FALHA_ESCRITA",
        `Não foi possível gravar "${nome}". O arquivo anterior foi preservado sem alteração.`,
      );
    }
    if (tx) tx.vistos.set(chave, assinatura(await lstatOuNada(destino)));
    await this.sincronizarPasta(dirname(destino));
    return { arquivo: nome, bytes: dados.length, ...(backup ? { backup } : {}) };
  }

  async remover(nome: string, extensoes: readonly string[]): Promise<ResultadoRemocao> {
    const caminho = await this.resolver(nome, extensoes);
    const tx = transacaoAtual.getStore();
    const chave = chaveDe(caminho);
    if (tx) await garantirTrava(tx, chave);
    const atual = await lstatOuNada(caminho);
    registrarVisto(tx, chave, atual);
    if (!atual) throw naoEncontrado(nome);
    if (atual.isSymbolicLink()) throw link(nome);
    if (!atual.isFile())
      throw new ErroArquivo("NAO_E_ARQUIVO", `"${nome}" não é um arquivo comum.`);
    const backup = await this.fazerBackup(nome);
    await conferirAssinatura(tx, chave, caminho, nome);
    try {
      await unlink(caminho);
    } catch {
      throw new ErroArquivo(
        "FALHA_ESCRITA",
        `Não foi possível remover "${nome}". A cópia de segurança ficou em ${backup}.`,
      );
    }
    if (tx) tx.vistos.set(chave, null);
    await this.sincronizarPasta(dirname(caminho));
    return { arquivo: nome, backup };
  }

  async listarCopias(arquivo?: string): Promise<CopiaSeguranca[]> {
    const copias: (CopiaSeguranca & { seq: number })[] = [];
    const vistas = new Set<string>();
    for (const nomePasta of PASTAS_BACKUPS_LEITURA) {
      const pasta = join(this.raiz, nomePasta);
      const st = await lstatOuNada(pasta);
      if (!st) continue;
      if (st.isSymbolicLink() || !st.isDirectory()) {
        // A pasta antiga só é lida por compatibilidade: se não for uma pasta comum, é ignorada.
        if (nomePasta === PASTA_BACKUPS_ANTIGA) continue;
        throw link(nomePasta);
      }
      for (const nome of await readdir(pasta)) {
        const m = PADRAO_BACKUP.exec(nome);
        if (!m || CONTROLE.test(nome) || vistas.has(nome)) continue;
        const origem = nomeDoPrefixo(m[1] ?? "");
        if (arquivo !== undefined && origem !== arquivo) continue;
        const info = await lstatOuNada(join(pasta, nome));
        if (!info?.isFile()) continue;
        vistas.add(nome);
        copias.push({ ...descreverCopia(nome, m, info.size), seq: Number(m[3] ?? 0) });
      }
    }
    // Da mais recente para a mais antiga: carimbo, depois sequência no mesmo segundo, depois nome
    // (só para a ordem ser estável). Antes a ordem era pelo nome, que começa pelo arquivo de origem.
    copias.sort((a, b) =>
      a.criadaEm !== b.criadaEm
        ? a.criadaEm < b.criadaEm
          ? 1
          : -1
        : a.seq !== b.seq
          ? b.seq - a.seq
          : a.copia < b.copia
            ? -1
            : a.copia > b.copia
              ? 1
              : 0,
    );
    return copias.slice(0, MAX_ITENS_LISTAGEM).map(({ seq: _, ...c }) => c);
  }

  async localizarCopia(copia: string): Promise<CopiaSeguranca> {
    const { caminho, st } = await this.acharCopia(copia);
    const m = PADRAO_BACKUP.exec(basename(caminho));
    if (!m) throw naoEncontrado(copia);
    return descreverCopia(copia, m, st.size);
  }

  /** Confere o nome da cópia e a procura nas pastas de cópias, da atual para a antiga. */
  private async acharCopia(copia: string): Promise<{ caminho: string; st: Stats }> {
    if (
      typeof copia !== "string" ||
      !PADRAO_BACKUP.test(copia) ||
      /[/\\]/.test(copia) ||
      copia.startsWith(".") ||
      CONTROLE.test(copia)
    ) {
      throw invalido("Nome de cópia de segurança inválido; use listar_copias_seguranca.");
    }
    // Procura primeiro na pasta atual e, se não achar, na pasta do nome antigo do projeto.
    let caminho = "";
    let st: Stats | undefined;
    for (const nomePasta of PASTAS_BACKUPS_LEITURA) {
      const pasta = join(this.raiz, nomePasta);
      const stPasta = await lstatOuNada(pasta);
      if (!stPasta || stPasta.isSymbolicLink() || !stPasta.isDirectory()) continue;
      caminho = join(pasta, copia);
      st = await lstatOuNada(caminho);
      if (st) break;
    }
    if (!st) throw naoEncontrado(copia);
    if (st.isSymbolicLink()) throw link(copia);
    if (!st.isFile()) throw new ErroArquivo("NAO_E_ARQUIVO", `"${copia}" não é um arquivo comum.`);
    return { caminho, st };
  }

  async restaurarCopia(
    copia: string,
    destino: string,
    extensoes: readonly string[],
  ): Promise<ResultadoEscrita> {
    const { caminho, st } = await this.acharCopia(copia);
    if (st.size > this.limiteBytes) throw muitoGrande(this.limiteBytes);
    const h = await open(caminho, constants.O_RDONLY | O_NOFOLLOW);
    let dados: Uint8Array;
    try {
      dados = await lerHandle(h, copia, this.limiteBytes);
    } finally {
      await h.close();
    }
    return this.escrever(destino, dados, extensoes);
  }

  async listar(extensoes: readonly string[]): Promise<ItemArquivo[]> {
    const permitidas = extensoes.map((e) => e.toLowerCase());
    const entradas = await readdir(this.raiz, { withFileTypes: true });
    const itens: ItemArquivo[] = [];
    for (const d of entradas) {
      if (!d.isFile() || d.name.startsWith(".")) continue;
      if (!permitidas.includes(extname(d.name).toLowerCase())) continue;
      if (CONTROLE.test(d.name)) continue;
      const st = await lstatOuNada(join(this.raiz, d.name));
      if (!st?.isFile()) continue;
      itens.push({ nome: d.name, tamanho: st.size, modificadoEm: st.mtime.toISOString() });
    }
    itens.sort((a, b) => (a.nome < b.nome ? -1 : a.nome > b.nome ? 1 : 0));
    return itens.slice(0, MAX_ITENS_LISTAGEM);
  }

  private async pastaBackups(): Promise<string> {
    const caminho = join(this.raiz, PASTA_BACKUPS);
    let st = await lstatOuNada(caminho);
    if (!st) {
      // Duas primeiras gravações simultâneas (em arquivos diferentes) chegam aqui juntas: a que
      // perde a corrida recebe EEXIST e confere de novo o que a outra criou.
      try {
        await mkdir(caminho, { mode: 0o700 });
      } catch (e) {
        if (codigoErro(e) !== "EEXIST") throw e;
      }
      st = await lstatOuNada(caminho);
      if (!st) throw new ErroArquivo("FALHA_ESCRITA", "Não foi possível criar a pasta de cópias.");
    }
    if (st.isSymbolicLink()) throw link(PASTA_BACKUPS);
    if (!st.isDirectory()) {
      throw new ErroArquivo(
        "FALHA_ESCRITA",
        `"${PASTA_BACKUPS}" existe e não é uma pasta; remova-o para permitir as cópias de segurança.`,
      );
    }
    return caminho;
  }

  /** Copia o conteúdo atual para a pasta de backups e aplica a rotação. */
  private async fazerBackup(nome: string): Promise<string> {
    const pasta = await this.pastaBackups();
    const prefixo = prefixoBackup(nome);
    const conteudo = await this.ler(nome, [extname(nome)]);
    const marca = carimbo(this.relogio());
    let destino = "";
    let h: FileHandle | undefined;
    for (let seq = 0; seq < 1000 && !h; seq++) {
      destino = `${prefixo}.${marca}${seq === 0 ? "" : `-${seq}`}.bak`;
      try {
        h = await open(join(pasta, destino), "wx", 0o600);
      } catch (e) {
        if (codigoErro(e) !== "EEXIST") throw e;
      }
    }
    if (!h) {
      throw new ErroArquivo("FALHA_ESCRITA", "Não foi possível criar a cópia de segurança.");
    }
    try {
      await h.writeFile(conteudo);
      await h.sync();
    } finally {
      await h.close();
    }
    await this.rotacionar(pasta, prefixo);
    return `${PASTA_BACKUPS}/${destino}`;
  }

  private async rotacionar(pasta: string, prefixo: string): Promise<void> {
    const nomes = await readdir(pasta);
    const meus = nomes
      .map((n) => ({ n, m: PADRAO_BACKUP.exec(n) }))
      .filter((x) => x.m?.[1] === prefixo)
      .map((x) => ({ n: x.n, marca: x.m?.[2] ?? "", seq: Number(x.m?.[3] ?? 0) }))
      .sort((a, b) => (a.marca === b.marca ? a.seq - b.seq : a.marca < b.marca ? -1 : 1));
    // A primeira cópia de cada arquivo (o conteúdo original, de antes do MCP Imposto de Renda) nunca sai da
    // rotação: a quantidade só gira entre as demais (revisão M2).
    const [, ...giram] = meus;
    const excesso = meus.length - Math.max(2, this.maxBackups);
    for (const item of giram.slice(0, Math.max(0, excesso))) {
      await unlink(join(pasta, item.n)).catch(() => undefined);
    }
  }

  private async sincronizarPasta(pasta: string): Promise<void> {
    // Garante que o rename chegou ao disco. Nem todo sistema permite fsync de pasta.
    try {
      const h = await open(pasta, constants.O_RDONLY);
      try {
        await h.sync();
      } finally {
        await h.close();
      }
    } catch {
      /* best effort */
    }
  }
}

/** Abre a pasta autorizada: precisa existir e ser uma pasta. Links na própria raiz são resolvidos. */
export async function abrirPastaAutorizada(
  diretorio: string,
  opcoes: OpcoesPasta = {},
): Promise<PastaAutorizada> {
  let real: string;
  try {
    real = await realpath(diretorio);
  } catch {
    throw new ErroArquivo("PASTA_INVALIDA", "A pasta autorizada não existe.");
  }
  const st = await lstat(real);
  if (!st.isDirectory()) {
    throw new ErroArquivo("PASTA_INVALIDA", "A pasta autorizada não é um diretório.");
  }
  await limparTemporarios(real);
  return new PastaAutorizadaImpl(real, opcoes);
}

/** Profundidade máxima de subpastas varridas atrás de temporários (a raiz é a profundidade 0). */
export const PROFUNDIDADE_LIMPEZA = 8;
/** Quantas pastas, no máximo, a limpeza visita, para não atrasar a abertura de pastas enormes. */
export const MAX_PASTAS_LIMPEZA = 2_000;

/**
 * Apaga temporários de escrita deixados por um encerramento no meio de uma gravação (podem ter
 * dados pessoais). Só os que seguem o padrão do MCP Imposto de Renda, na raiz e nas subpastas
 * (o temporário fica na pasta do destino, e o destino pode estar numa subpasta). Links simbólicos
 * não são seguidos, pastas ocultas são puladas (nenhum destino pode estar nelas) e a varredura
 * para em `PROFUNDIDADE_LIMPEZA` níveis e `MAX_PASTAS_LIMPEZA` pastas.
 */
async function limparTemporarios(raiz: string): Promise<void> {
  const fila: { pasta: string; nivel: number }[] = [{ pasta: raiz, nivel: 0 }];
  let visitadas = 0;
  for (let item = fila.shift(); item; item = fila.shift()) {
    if (++visitadas > MAX_PASTAS_LIMPEZA) return;
    let entradas: Dirent[];
    try {
      entradas = await readdir(item.pasta, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const d of entradas) {
      const caminho = join(item.pasta, d.name);
      // `Dirent` vem do lstat: um link simbólico nunca é pasta nem arquivo aqui.
      if (d.isFile() && PADRAO_TEMPORARIO.test(d.name)) {
        const st = await lstatOuNada(caminho);
        if (st?.isFile()) await unlink(caminho).catch(() => undefined);
      } else if (d.isDirectory() && !d.name.startsWith(".") && item.nivel < PROFUNDIDADE_LIMPEZA) {
        fila.push({ pasta: caminho, nivel: item.nivel + 1 });
      }
    }
  }
}
