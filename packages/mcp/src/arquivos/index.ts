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
 *   guarda uma cópia com carimbo de data em `.autoir-backups`, com rotação.
 *
 * Mensagens de erro citam só o nome relativo informado, nunca o caminho absoluto da máquina.
 */
import { randomUUID } from "node:crypto";
import { constants, type Stats } from "node:fs";
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
export const PASTA_BACKUPS = ".autoir-backups";
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
  | "FALHA_ESCRITA";

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
   * Remove um arquivo da pasta autorizada, guardando antes uma cópia em `.autoir-backups`.
   * Recusa links simbólicos e o que não for arquivo comum.
   */
  remover(nome: string, extensoes: readonly string[]): Promise<ResultadoRemocao>;
  /** Cópias de segurança em `.autoir-backups`, da mais recente para a mais antiga. */
  listarCopias(): Promise<CopiaSeguranca[]>;
  /**
   * Restaura uma cópia (pelo nome devolvido em `listarCopias`) sobre `destino`, que também
   * ganha backup antes de ser sobrescrito. O nome da cópia é conferido contra o padrão.
   */
  restaurarCopia(
    copia: string,
    destino: string,
    extensoes: readonly string[],
  ): Promise<ResultadoEscrita>;
}

export interface CopiaSeguranca {
  /** Nome da cópia dentro de `.autoir-backups`. */
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
    `"${nome}" é um link simbólico. Por segurança o AutoIR não segue links; use o arquivo real.`,
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
const PREFIXO_TEMPORARIO = ".autoir-";
const PADRAO_TEMPORARIO = /^\.autoir-[0-9a-f-]{36}\.tmp$/;

async function lerHandle(h: FileHandle, nome: string, limite: number): Promise<Uint8Array> {
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
  return new Uint8Array(buffer.buffer, buffer.byteOffset, total);
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

  async ler(nome: string, extensoes: readonly string[]): Promise<Uint8Array> {
    const caminho = await this.resolver(nome, extensoes);
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
      return await lerHandle(h, nome, this.limiteBytes);
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
    const atual = await lstatOuNada(destino);
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
      await rename(temporario, destino);
    } catch (e) {
      await unlink(temporario).catch(() => undefined);
      if (e instanceof ErroArquivo) throw e;
      throw new ErroArquivo(
        "FALHA_ESCRITA",
        `Não foi possível gravar "${nome}". O arquivo anterior foi preservado sem alteração.`,
      );
    }
    await this.sincronizarPasta(dirname(destino));
    return { arquivo: nome, bytes: dados.length, ...(backup ? { backup } : {}) };
  }

  async remover(nome: string, extensoes: readonly string[]): Promise<ResultadoRemocao> {
    const caminho = await this.resolver(nome, extensoes);
    const atual = await lstatOuNada(caminho);
    if (!atual) throw naoEncontrado(nome);
    if (atual.isSymbolicLink()) throw link(nome);
    if (!atual.isFile())
      throw new ErroArquivo("NAO_E_ARQUIVO", `"${nome}" não é um arquivo comum.`);
    const backup = await this.fazerBackup(nome);
    try {
      await unlink(caminho);
    } catch {
      throw new ErroArquivo(
        "FALHA_ESCRITA",
        `Não foi possível remover "${nome}". A cópia de segurança ficou em ${backup}.`,
      );
    }
    await this.sincronizarPasta(dirname(caminho));
    return { arquivo: nome, backup };
  }

  async listarCopias(): Promise<CopiaSeguranca[]> {
    const pasta = join(this.raiz, PASTA_BACKUPS);
    const st = await lstatOuNada(pasta);
    if (!st) return [];
    if (st.isSymbolicLink() || !st.isDirectory()) throw link(PASTA_BACKUPS);
    const copias: CopiaSeguranca[] = [];
    for (const nome of await readdir(pasta)) {
      const m = PADRAO_BACKUP.exec(nome);
      if (!m || CONTROLE.test(nome)) continue;
      const info = await lstatOuNada(join(pasta, nome));
      if (!info?.isFile()) continue;
      const c = m[2] ?? "";
      copias.push({
        copia: nome,
        arquivo: nomeDoPrefixo(m[1] ?? ""),
        criadaEm: `${c.slice(0, 4)}-${c.slice(4, 6)}-${c.slice(6, 8)}T${c.slice(9, 11)}:${c.slice(11, 13)}:${c.slice(13, 15)}Z`,
        tamanho: info.size,
      });
    }
    copias.sort((a, b) => (a.copia < b.copia ? 1 : a.copia > b.copia ? -1 : 0));
    return copias.slice(0, MAX_ITENS_LISTAGEM);
  }

  async restaurarCopia(
    copia: string,
    destino: string,
    extensoes: readonly string[],
  ): Promise<ResultadoEscrita> {
    if (
      typeof copia !== "string" ||
      !PADRAO_BACKUP.test(copia) ||
      /[/\\]/.test(copia) ||
      copia.startsWith(".") ||
      CONTROLE.test(copia)
    ) {
      throw invalido("Nome de cópia de segurança inválido; use listar_copias_seguranca.");
    }
    const caminho = join(this.raiz, PASTA_BACKUPS, copia);
    const st = await lstatOuNada(caminho);
    if (!st) throw naoEncontrado(copia);
    if (st.isSymbolicLink()) throw link(copia);
    if (!st.isFile()) throw new ErroArquivo("NAO_E_ARQUIVO", `"${copia}" não é um arquivo comum.`);
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
    const st = await lstatOuNada(caminho);
    if (!st) {
      await mkdir(caminho, { mode: 0o700 });
      return caminho;
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
    // A primeira cópia de cada arquivo (o conteúdo original, de antes do AutoIR) nunca sai da
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

/**
 * Apaga temporários de escrita deixados por um encerramento no meio de uma gravação (podem ter
 * dados pessoais). Só os que seguem o padrão do AutoIR, na raiz da pasta autorizada.
 */
async function limparTemporarios(raiz: string): Promise<void> {
  let nomes: string[];
  try {
    nomes = await readdir(raiz);
  } catch {
    return;
  }
  for (const n of nomes) {
    if (!PADRAO_TEMPORARIO.test(n)) continue;
    const st = await lstatOuNada(join(raiz, n));
    if (st?.isFile()) await unlink(join(raiz, n)).catch(() => undefined);
  }
}
