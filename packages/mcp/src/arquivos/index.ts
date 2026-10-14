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
    const backup = atual ? await this.fazerBackup(nome) : undefined;

    const temporario = join(dirname(destino), `.${basename(destino)}.${randomUUID()}.tmp`);
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
    const prefixo = nome.replaceAll("/", "__");
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
    const excesso = meus.length - this.maxBackups;
    for (const item of meus.slice(0, Math.max(0, excesso))) {
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
  return new PastaAutorizadaImpl(real, opcoes);
}
