/**
 * Gerador do leiaute declarativo do arquivo da declaração (DEC/DBK).
 *
 * Lê o XML de leiaute de dados do exercício (por exemplo `LayoutDadosDIRPF2026.xml`) e o
 * `mapeamentoTxt.xml` do mesmo exercício (estrutura efetivamente gravada, formatos e casas
 * decimais; ver `montarLeiaute`), e emite o módulo TypeScript
 * `packages/core/src/dbk/leiautes/<exercicio>.ts` com a especificação de todos os tipos de
 * registro e campos. Só lê dados: nenhum código do programa oficial é usado.
 *
 * Uso (Node 22.6 ou superior, sem dependências):
 *
 *   node --experimental-strip-types tools/leiaute/gerar.ts \
 *     --leiaute <caminho>/LayoutDadosDIRPF2026.xml \
 *     [--mapeamento <caminho>/mapeamentoTxt.xml] [--exercicio 2026] [--saida <arquivo.ts>]
 *
 * O caminho do leiaute também pode vir da variável IRPF_LEIAUTE_XML e o do mapeamento
 * de IRPF_MAPEAMENTO_XML. Sem `--mapeamento`, procura `mapeamentoTxt.xml` na mesma pasta.
 * A saída é determinística: rodar duas vezes com as mesmas fontes gera o mesmo arquivo.
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import type {
  CampoLeiaute,
  FormatoCampo,
  FormatoData,
  Leiaute,
  TipoRegistroLeiaute,
} from "../../packages/core/src/dbk/leiaute.js";

/** Campo como aparece no XML de leiaute. */
export interface CampoXml {
  readonly nome: string;
  readonly obs: string;
  readonly formato?: string;
  readonly tam: number;
}

/** Tipo de registro como aparece no XML de leiaute (id sem o `_` inicial). */
export interface TipoXml {
  readonly id: string;
  readonly obs: string;
  readonly campos: readonly CampoXml[];
}

export interface LeiauteXml {
  readonly tamanhoTipo: number;
  readonly tipos: readonly TipoXml[];
}

/** Campo do mapeamento de arquivo texto. */
export interface CampoMapeamento {
  readonly nome: string;
  readonly descricao: string;
  readonly tipo?: string;
  readonly tamanho: number;
  readonly decimais?: number;
}

export interface RegistroMapeamento {
  readonly descricao: string;
  readonly campos: readonly CampoMapeamento[];
}

const FORMATOS: ReadonlySet<string> = new Set(["C", "A", "I", "N"]);
const RISCAS = new RegExp(`[${String.fromCharCode(0x2012, 0x2013, 0x2014, 0x2015)}]`, "g");

/** Atributos `nome="valor"` de uma tag; aceita nomes acentuados e `>` dentro de aspas. */
function atributos(texto: string): Record<string, string> {
  const resultado: Record<string, string> = {};
  for (const m of texto.matchAll(/([^\s=<>/"]+)\s*=\s*"([^"]*)"/g)) {
    const [, nome, valor] = m;
    if (nome !== undefined && valor !== undefined) {
      resultado[nome] = decodificarEntidades(valor);
    }
  }
  return resultado;
}

function decodificarEntidades(texto: string): string {
  return texto.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, ent: string) => {
    const e = ent.toLowerCase();
    if (e === "amp") return "&";
    if (e === "lt") return "<";
    if (e === "gt") return ">";
    if (e === "quot") return '"';
    if (e === "apos") return "'";
    const codigo = e.startsWith("#x") ? Number.parseInt(e.slice(2), 16) : Number(e.slice(1));
    return String.fromCodePoint(codigo);
  });
}

/** Tags `<nome ...>` com o conteúdo dos atributos; respeita `>` dentro de aspas. */
function tags(texto: string, nome: string): { atributos: string; fim: number; inicio: number }[] {
  const re = new RegExp(`<${nome}(?=[\\s/>])((?:[^>"]|"[^"]*")*)>`, "g");
  return [...texto.matchAll(re)].map((m) => ({
    atributos: m[1] ?? "",
    inicio: m.index,
    fim: m.index + m[0].length,
  }));
}

function semComentarios(xml: string): string {
  let anterior: string;
  let atual = xml;
  // Repete até estabilizar: uma remoção pode juntar pedaços e formar um novo "<!--".
  do {
    anterior = atual;
    atual = atual.replace(/<!--[\s\S]*?-->/g, "");
  } while (atual !== anterior);
  return atual;
}

function inteiro(valor: string | undefined, contexto: string): number {
  if (valor === undefined || !/^\d+$/.test(valor.trim())) {
    throw new Error(`${contexto}: número inválido ${JSON.stringify(valor)}`);
  }
  return Number(valor.trim());
}

/** Lê o XML de leiaute de dados (`<file tamtipo>` com `<tipo>` e `<campo>`). */
export function lerLeiauteXml(xml: string): LeiauteXml {
  const limpo = semComentarios(xml);
  const [arquivo] = tags(limpo, "file");
  const tamanhoTipo = inteiro(
    arquivo ? atributos(arquivo.atributos).tamtipo : undefined,
    "atributo tamtipo de <file>",
  );
  const aberturas = tags(limpo, "tipo");
  const tipos = aberturas.map((abertura, i) => {
    // O XML oficial tem tipo sem </tipo>: o corpo termina no fechamento ou no próximo <tipo.
    const fechamento = limpo.indexOf("</tipo>", abertura.fim);
    const proximo = aberturas[i + 1]?.inicio ?? limpo.length;
    const fim = fechamento < 0 ? proximo : Math.min(fechamento, proximo);
    const attrs = atributos(abertura.atributos);
    const nome = attrs.nome;
    if (!nome) throw new Error("tag <tipo> sem atributo nome");
    const id = nome.replace(/^_/, "");
    const corpo = limpo.slice(abertura.fim, fim);
    const campos = tags(corpo, "campo").map((tag): CampoXml => {
      const a = atributos(tag.atributos);
      if (!a.nome) throw new Error(`tipo ${id}: campo sem nome`);
      const base = { nome: a.nome, obs: a.obs ?? "", tam: inteiro(a.tam, `tipo ${id}, ${a.nome}`) };
      return a.formato === undefined ? base : { ...base, formato: a.formato };
    });
    return { id, obs: attrs.obs ?? "", campos };
  });
  return { tamanhoTipo, tipos };
}

/** Lê a seção `ARQ_IRPF` do `mapeamentoTxt.xml`, indexada pelo identificador do registro. */
export function lerMapeamentoXml(xml: string): Map<string, RegistroMapeamento> {
  const limpo = semComentarios(xml);
  const secoes = limpo.split(/<DeclaracaoTXT(?=[\s>])/).slice(1);
  const secao = secoes.find((s) => /^\s+TipoArquivo\s*=\s*"ARQ_IRPF"/.test(s));
  const mapa = new Map<string, RegistroMapeamento>();
  if (!secao) return mapa;
  const corpo = secao.split("</DeclaracaoTXT>")[0] ?? "";
  // Alguns registros do mapeamento não fecham a tag; cada um vai até o próximo <Registro.
  const aberturas = tags(corpo, "Registro");
  aberturas.forEach((abertura, i) => {
    const fim = aberturas[i + 1]?.inicio ?? corpo.length;
    const a = atributos(abertura.atributos);
    const id = a.Identificador;
    if (!id || mapa.has(id)) return;
    const campos = tags(corpo.slice(abertura.fim, fim), "Campo").map((tag): CampoMapeamento => {
      const c = atributos(tag.atributos);
      const tamanho = Number(c.Tamanho ?? "0");
      const decimais = c.Decimais ?? c.CasasDecimais;
      return {
        nome: (c.Nome ?? "").trim(),
        tamanho,
        descricao: c.Descricao ?? c.Descrição ?? "",
        ...(c.Tipo === undefined ? {} : { tipo: c.Tipo }),
        ...(decimais === undefined ? {} : { decimais: Number(decimais) }),
      };
    });
    mapa.set(id, { descricao: a.Descricao ?? a.Descrição ?? "", campos });
  });
  return mapa;
}

function normalizarTexto(texto: string): string {
  return texto.replace(RISCAS, "-").replace(/\s+/g, " ").trim();
}

const NOME_DATA = /^(DT|DATA)_/i;
const NOME_MONETARIO = /(^|_)(VR|VL)|^GC_/i;

function detectarData(nome: string, obs: string, formato: FormatoCampo, tam: number) {
  if (formato !== "N" || tam !== 8) return undefined;
  if (!NOME_DATA.test(nome) && !/DDMMAAAA|AAAAMMDD/i.test(obs)) return undefined;
  const data: FormatoData = /AAAAMMDD/i.test(obs) ? "AAAAMMDD" : "DDMMAAAA";
  return data;
}

/** De onde veio a estrutura de campos de um tipo de registro. */
export type OrigemTipo = "mapeamento" | "leiaute";

export interface LeiauteGerado extends Leiaute {
  readonly origens: Readonly<Record<string, OrigemTipo>>;
}

interface CampoFonte {
  readonly nome: string;
  readonly tam: number;
  readonly formato: string | undefined;
  readonly decimais: number | undefined;
  readonly descricao: string;
  /** Texto usado para detectar datas (descrições das duas fontes). */
  readonly pistas: string;
}

function camposDoLeiaute(tipo: TipoXml): CampoFonte[] {
  return tipo.campos.map((c) => ({
    nome: c.nome,
    tam: c.tam,
    formato: c.formato,
    decimais: undefined,
    descricao: c.obs,
    pistas: c.obs,
  }));
}

function camposDoMapeamento(registro: RegistroMapeamento, tipo: TipoXml | undefined): CampoFonte[] {
  const usados = new Set<CampoXml>();
  return registro.campos.map((c) => {
    const doLeiaute = tipo?.campos.find(
      (x) => !usados.has(x) && x.nome === c.nome && x.tam === c.tamanho,
    );
    if (doLeiaute) usados.add(doLeiaute);
    return {
      nome: c.nome,
      tam: c.tamanho,
      formato: c.tipo ?? doLeiaute?.formato,
      decimais: c.decimais,
      descricao: c.descricao || doLeiaute?.obs || "",
      pistas: `${c.descricao} ${doLeiaute?.obs ?? ""}`,
    };
  });
}

function montarCampos(id: string, fontes: readonly CampoFonte[]): CampoLeiaute[] {
  const chaves = new Set<string>();
  let inicio = 1;
  const campos: CampoLeiaute[] = [];
  for (const fonte of fontes) {
    if (!Number.isInteger(fonte.tam) || fonte.tam <= 0) {
      throw new Error(`tipo ${id}, campo ${fonte.nome}: tamanho inválido ${fonte.tam}`);
    }
    // O identificador de um tipo alfanumérico (FR, HR...) não pode ser numérico.
    const identificadorAlfa = campos.length === 0 && !/^\d+$/.test(id);
    const bruto = identificadorAlfa ? "C" : (fonte.formato ?? "C").trim().toUpperCase();
    if (!FORMATOS.has(bruto)) {
      throw new Error(`tipo ${id}, campo ${fonte.nome}: formato desconhecido "${bruto}"`);
    }
    const formato = bruto as FormatoCampo;
    let chave = fonte.nome;
    for (let n = 2; chaves.has(chave); n++) chave = `${fonte.nome}_${n}`;
    chaves.add(chave);
    const data = detectarData(fonte.nome, fonte.pistas, formato, fonte.tam);
    let decimais: number | undefined;
    if (formato === "N" && data === undefined) {
      if (fonte.decimais !== undefined) {
        decimais = fonte.decimais > 0 ? fonte.decimais : undefined;
      } else if (fonte.tam === 13 && NOME_MONETARIO.test(fonte.nome)) {
        decimais = 2;
      }
    }
    const campo: CampoLeiaute = {
      nome: fonte.nome,
      chave,
      formato,
      tamanho: fonte.tam,
      inicio,
      ...(decimais === undefined ? {} : { decimais }),
      ...(data === undefined ? {} : { data }),
      descricao: normalizarTexto(fonte.descricao),
    };
    inicio += fonte.tam;
    campos.push(campo);
  }
  return campos;
}

/**
 * Monta o leiaute a partir do XML de leiaute de dados e, se houver, do mapeamento.
 *
 * - Estrutura: quando o tipo existe no mapeamento (seção ARQ_IRPF), os campos vêm dele,
 *   porque é o mapeamento que o gravador de texto usa e é ele que confere com os arquivos
 *   reais (o leiaute de dados diverge em alguns tipos, como 16, T9 e DR). Tipos que só
 *   existem no leiaute de dados (por exemplo os do complemento do recibo) vêm dele.
 * - A ordem é a do leiaute de dados; tipos só do mapeamento vão para o fim.
 * - Posição inicial e tamanho do registro são somas dos tamanhos dos campos.
 * - Nomes repetidos recebem chave com sufixo (`FILLER`, `FILLER_2`...).
 * - Formato: o do mapeamento; se ausente, o do leiaute de dados; se ausente, `C`. O primeiro
 *   campo (identificador) de tipo com id não numérico é sempre `C`.
 * - Decimais: os do mapeamento; sem essa informação, campo `N` de 13 posições com nome
 *   de valor (`VR_`, `VL_`, `GC_`) recebe 2 casas (centavos), como nos leiautes publicados.
 * - Campo `N` de 8 posições com nome `DT_`/`DATA_` ou descrição com `DDMMAAAA`/`AAAAMMDD` é data.
 */
export function montarLeiaute(
  xml: LeiauteXml,
  mapeamento: ReadonlyMap<string, RegistroMapeamento> | undefined,
  exercicio: number,
): LeiauteGerado {
  const doLeiaute = new Map<string, TipoXml>();
  for (const tipo of xml.tipos) {
    if (doLeiaute.has(tipo.id)) throw new Error(`tipo de registro repetido: ${tipo.id}`);
    doLeiaute.set(tipo.id, tipo);
  }
  const ids = [...doLeiaute.keys()];
  for (const id of mapeamento?.keys() ?? []) if (!doLeiaute.has(id)) ids.push(id);
  const origens: Record<string, OrigemTipo> = {};
  const tipos = ids.map((id): TipoRegistroLeiaute => {
    const tipo = doLeiaute.get(id);
    const registro = mapeamento?.get(id);
    origens[id] = registro ? "mapeamento" : "leiaute";
    const fontes = registro ? camposDoMapeamento(registro, tipo) : camposDoLeiaute(tipo as TipoXml);
    const campos = montarCampos(id, fontes);
    const tamanho = campos.reduce((soma, c) => soma + c.tamanho, 0);
    const descricao =
      normalizarTexto(tipo?.obs ?? "") || normalizarTexto(registro?.descricao ?? "");
    return { id, descricao, tamanho, campos };
  });
  return { exercicio, tamanhoTipo: xml.tamanhoTipo, tipos, origens };
}

function literalCampo(c: CampoLeiaute): string {
  const partes = [
    `nome: ${JSON.stringify(c.nome)}`,
    `chave: ${JSON.stringify(c.chave)}`,
    `formato: ${JSON.stringify(c.formato)}`,
    `tamanho: ${c.tamanho}`,
    `inicio: ${c.inicio}`,
  ];
  if (c.decimais !== undefined) partes.push(`decimais: ${c.decimais}`);
  if (c.data !== undefined) partes.push(`data: ${JSON.stringify(c.data)}`);
  partes.push(`descricao: ${JSON.stringify(c.descricao)}`);
  return `        { ${partes.join(", ")} },`;
}

function sha256(texto: string): string {
  return createHash("sha256").update(texto, "utf8").digest("hex");
}

/** Gera o texto do módulo TypeScript do leiaute. */
export function gerarModuloLeiaute(
  xmlLeiaute: string,
  xmlMapeamento: string | undefined,
  exercicio: number,
): string {
  const leiaute = montarLeiaute(
    lerLeiauteXml(xmlLeiaute),
    xmlMapeamento === undefined ? undefined : lerMapeamentoXml(xmlMapeamento),
    exercicio,
  );
  const totalCampos = leiaute.tipos.reduce((s, t) => s + t.campos.length, 0);
  const linhas = [
    "// biome-ignore-all format: arquivo gerado, mantido uma linha por campo",
    "//",
    "// ARQUIVO GERADO por tools/leiaute/gerar.ts. Não edite à mão.",
    "//",
    `// Leiaute do arquivo da declaração (DEC/DBK) do exercício ${exercicio}: ${leiaute.tipos.length} tipos de`,
    `// registro e ${totalCampos} campos. Especificação funcional derivada de recursos de dados do`,
    "// programa do exercício (somente dados; nenhum código do programa oficial). Os campos de",
    "// cada tipo vêm do mapeamentoTxt.xml (seção ARQ_IRPF) quando o tipo existe nele, senão do",
    "// leiaute de dados; a origem está anotada antes de cada tipo.",
    "//",
    `// LayoutDadosDIRPF${exercicio}.xml, sha256 ${sha256(xmlLeiaute)}`,
    `// mapeamentoTxt.xml, ${
      xmlMapeamento === undefined ? "não usado" : `sha256 ${sha256(xmlMapeamento)}`
    }`,
    "//",
    "// Para regenerar:",
    "//   node --experimental-strip-types tools/leiaute/gerar.ts \\",
    `//     --leiaute <pasta>/LayoutDadosDIRPF${exercicio}.xml --mapeamento <pasta>/mapeamentoTxt.xml`,
    "",
    'import type { Leiaute } from "../leiaute.js";',
    "",
    `export const LEIAUTE_${exercicio}: Leiaute = {`,
    `  exercicio: ${exercicio},`,
    `  tamanhoTipo: ${leiaute.tamanhoTipo},`,
    "  tipos: [",
  ];
  for (const tipo of leiaute.tipos) {
    const origem =
      leiaute.origens[tipo.id] === "mapeamento"
        ? "mapeamentoTxt.xml"
        : `LayoutDadosDIRPF${exercicio}.xml`;
    linhas.push(`    // ${tipo.id}: campos de ${origem}`);
    linhas.push("    {");
    linhas.push(`      id: ${JSON.stringify(tipo.id)},`);
    linhas.push(`      descricao: ${JSON.stringify(tipo.descricao)},`);
    linhas.push(`      tamanho: ${tipo.tamanho},`);
    linhas.push("      campos: [");
    for (const campo of tipo.campos) linhas.push(literalCampo(campo));
    linhas.push("      ],");
    linhas.push("    },");
  }
  linhas.push("  ],");
  linhas.push("};");
  linhas.push("");
  return linhas.join("\n");
}

function argumento(args: readonly string[], nome: string): string | undefined {
  const i = args.indexOf(nome);
  return i >= 0 ? args[i + 1] : undefined;
}

function principal(args: readonly string[]): void {
  const caminhoLeiaute = argumento(args, "--leiaute") ?? process.env.IRPF_LEIAUTE_XML;
  if (!caminhoLeiaute) {
    throw new Error("informe --leiaute <LayoutDadosDIRPFAAAA.xml> ou IRPF_LEIAUTE_XML");
  }
  const anoNoNome = /(\d{4})\.xml$/i.exec(basename(caminhoLeiaute))?.[1];
  const exercicio = Number(argumento(args, "--exercicio") ?? anoNoNome);
  if (!Number.isInteger(exercicio)) {
    throw new Error("não foi possível inferir o exercício; use --exercicio AAAA");
  }
  const vizinho = join(dirname(caminhoLeiaute), "mapeamentoTxt.xml");
  const caminhoMapeamento =
    argumento(args, "--mapeamento") ??
    process.env.IRPF_MAPEAMENTO_XML ??
    (existsSync(vizinho) ? vizinho : undefined);
  const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
  const saida =
    argumento(args, "--saida") ?? join(raiz, `packages/core/src/dbk/leiautes/${exercicio}.ts`);
  const modulo = gerarModuloLeiaute(
    readFileSync(caminhoLeiaute, "utf8"),
    caminhoMapeamento === undefined ? undefined : readFileSync(caminhoMapeamento, "utf8"),
    exercicio,
  );
  writeFileSync(saida, modulo, "utf8");
  process.stdout.write(`leiaute ${exercicio} gravado em ${saida}\n`);
}

const executadoDireto =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (executadoDireto) principal(process.argv.slice(2));
