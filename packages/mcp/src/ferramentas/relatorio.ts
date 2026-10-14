/**
 * Relatório da declaração com layout próprio, nos formatos Markdown, HTML e PDF.
 *
 * Equivale às impressões do programa oficial (Imprimir Declaração, toda ou por partes;
 * Imprimir Rendimentos Recebidos de PF; Visualizar e salvar em PDF), sem reproduzir o layout
 * oficial. O PDF é escrito aqui mesmo, sem dependência: PDF 1.4, A4, fontes padrão Helvetica
 * com WinAnsiEncoding (cobre os acentos do português), sem dicionário de informações do
 * documento (nenhum metadado de autor ou ferramenta).
 */
import { type Declaracao, FICHAS, type Ficha, formatCentavos } from "@mcp-imposto-de-renda/core";

/** Bloco de um documento simples: títulos, parágrafos e itens de lista. */
export interface Bloco {
  readonly tipo: "h1" | "h2" | "h3" | "p" | "li";
  readonly texto: string;
}
export type Documento = readonly Bloco[];

/** Parte que se pode pedir: uma ficha, `rendimentos_pf` (atalho do programa) ou `todas`. */
export const PARTES_RELATORIO = [
  "todas",
  "rendimentos_pf",
  ...(Object.keys(FICHAS) as Ficha[]),
] as const;
export type ParteRelatorio = (typeof PARTES_RELATORIO)[number];

// ------------------------------------------------------------------ rótulos

/** Palavras dos nomes de campo do modelo com a grafia correta em português. */
const PALAVRAS: Readonly<Record<string, string>> = {
  situacao: "situação",
  codigo: "código",
  discriminacao: "discriminação",
  beneficiario: "beneficiário",
  contribuicao: "contribuição",
  previdenciaria: "previdenciária",
  decimo: "décimo",
  pensao: "pensão",
  alimenticia: "alimentícia",
  numero: "número",
  endereco: "endereço",
  municipio: "município",
  pais: "país",
  aquisicao: "aquisição",
  alienacao: "alienação",
  area: "área",
  matricula: "matrícula",
  cartorio: "cartório",
  deducao: "dedução",
  deducoes: "deduções",
  nao: "não",
  dedutivel: "dedutível",
  tributaveis: "tributáveis",
  ocupacao: "ocupação",
  conjuge: "cônjuge",
  declaracao: "declaração",
  exercicio: "exercício",
  opcao: "opção",
  tributacao: "tributação",
  informacoes: "informações",
  bancarias: "bancárias",
  agencia: "agência",
  credito: "crédito",
  debito: "débito",
  automatico: "automático",
  mes: "mês",
  residencia: "residência",
  saida: "saída",
  condicao: "condição",
  raca: "raça",
  doenca: "doença",
  deficiencia: "deficiência",
  alteracao: "alteração",
  apuracao: "apuração",
  imovel: "imóvel",
  imoveis: "imóveis",
  participacao: "participação",
  exploracao: "exploração",
  espolio: "espólio",
  periodo: "período",
  previdencia: "previdência",
  juridica: "jurídica",
  fisica: "física",
  domestico: "doméstico",
  isencao: "isenção",
  operacoes: "operações",
  variavel: "variável",
  emancipacao: "emancipação",
  procuracao: "procuração",
  representacao: "representação",
  diplomatica: "diplomática",
  ni: "CPF/CNPJ",
  cpf: "CPF",
  cnpj: "CNPJ",
  cep: "CEP",
  uf: "UF",
  dv: "DV",
  irrf: "IRRF",
  email: "e-mail",
  rra: "RRA",
  pj: "PJ",
  pf: "PF",
  iptu: "IPTU",
  cib: "CIB",
  renavam: "Renavam",
};

/** `situacaoAnterior` vira "Situação anterior". */
export function rotulo(chave: string): string {
  const palavras = chave
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((p) => PALAVRAS[p.toLowerCase()] ?? p.toLowerCase());
  const t = palavras.join(" ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const NAO_MONETARIO = /centesimos|quantidade|meses|ano$|^ano|numero|percentual|aliquota/i;

function valorTexto(chave: string, v: unknown): string {
  if (typeof v === "bigint") {
    return NAO_MONETARIO.test(chave) ? v.toString() : `R$ ${formatCentavos(v as never)}`;
  }
  if (typeof v === "boolean") return v ? "Sim" : "Não";
  if (typeof v === "string") {
    const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
    return d ? `${d[3]}/${d[2]}/${d[1]}` : v;
  }
  return String(v);
}

function linhasDe(obj: Record<string, unknown>, prefixo: string, saida: string[]): void {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === "") continue;
    const nome = prefixo ? `${prefixo}, ${rotulo(k).toLowerCase()}` : rotulo(k);
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      if (v.every((x) => typeof x !== "object" || x === null)) {
        saida.push(`- ${nome}: ${v.map((x) => valorTexto(k, x)).join(", ")}`);
      } else {
        v.forEach((x, i) => {
          linhasDe(x as Record<string, unknown>, `${nome} ${i + 1}`, saida);
        });
      }
    } else if (typeof v === "object") {
      linhasDe(v as Record<string, unknown>, nome, saida);
    } else {
      saida.push(`- ${nome}: ${valorTexto(k, v)}`);
    }
  }
}

function fichasDasPartes(partes: readonly ParteRelatorio[]): Ficha[] {
  const todas = Object.keys(FICHAS) as Ficha[];
  if (partes.includes("todas")) return todas;
  const pedidas = new Set<string>(
    partes.map((p) => (p === "rendimentos_pf" ? "rendimentosPFExterior" : p)),
  );
  return todas.filter((f) => pedidas.has(f));
}

/**
 * Relatório detalhado em Markdown: cabeçalho e uma seção por ficha pedida, com cada lançamento
 * e todos os campos preenchidos. Fichas vazias aparecem com a indicação "sem informações".
 */
export function relatorioDetalhado(dec: Declaracao, partes: readonly ParteRelatorio[]): string {
  const id = dec.identificacao;
  const linhas = [
    `# Declaração IRPF ${dec.exercicio} (ano-calendário ${dec.anoCalendario})`,
    "",
    `Contribuinte: ${id.nome}, CPF ${id.cpf}.`,
  ];
  const registro = dec as unknown as Record<string, unknown>;
  for (const ficha of fichasDasPartes(partes)) {
    const v = registro[ficha];
    linhas.push("", `## ${FICHAS[ficha]}`, "");
    const itens: unknown[] = Array.isArray(v) ? v : v ? [v] : [];
    if (itens.length === 0) {
      linhas.push("Sem informações nesta ficha.");
      continue;
    }
    itens.forEach((item, i) => {
      if (Array.isArray(v)) linhas.push(`### Item ${i + 1}`, "");
      const campos: string[] = [];
      linhasDe(item as Record<string, unknown>, "", campos);
      linhas.push(...(campos.length > 0 ? campos : ["Sem campos preenchidos."]));
      if (Array.isArray(v)) linhas.push("");
    });
  }
  linhas.push(
    "",
    "Relatório informativo com layout próprio do MCP Imposto de Renda; não substitui a impressão da declaração no programa oficial.",
  );
  return linhas.join("\n");
}

// ------------------------------------------------------------------ documento

/** Lê Markdown simples (títulos `#`, `##`, `###`, itens `- ` e parágrafos) em blocos. */
export function textoParaDocumento(texto: string): Documento {
  const blocos: Bloco[] = [];
  for (const bruta of texto.split(/\r?\n/)) {
    const linha = bruta.trimEnd();
    if (linha.trim() === "") continue;
    const m = /^(#{1,3})\s+(.*)$/.exec(linha);
    if (m) {
      const nivel = (m[1] ?? "#").length;
      blocos.push({ tipo: nivel === 1 ? "h1" : nivel === 2 ? "h2" : "h3", texto: m[2] ?? "" });
    } else if (/^\s*[-*]\s+/.test(linha)) {
      blocos.push({ tipo: "li", texto: linha.replace(/^\s*[-*]\s+/, "") });
    } else {
      blocos.push({ tipo: "p", texto: linha.trim() });
    }
  }
  return blocos;
}

function escaparHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}

/** HTML autocontido (sem script nem recurso externo), em pt-BR. */
export function documentoParaHtml(doc: Documento): string {
  const titulo = doc.find((b) => b.tipo === "h1")?.texto ?? "Relatório";
  const corpo: string[] = [];
  let emLista = false;
  for (const b of doc) {
    if (b.tipo === "li" && !emLista) {
      corpo.push("<ul>");
      emLista = true;
    } else if (b.tipo !== "li" && emLista) {
      corpo.push("</ul>");
      emLista = false;
    }
    const t = escaparHtml(b.texto);
    corpo.push(b.tipo === "li" ? `<li>${t}</li>` : `<${b.tipo}>${t}</${b.tipo}>`);
  }
  if (emLista) corpo.push("</ul>");
  return [
    "<!doctype html>",
    '<html lang="pt-BR">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escaparHtml(titulo)}</title>`,
    "<style>body{font-family:Helvetica,Arial,sans-serif;max-width:48rem;margin:2rem auto;padding:0 1rem;color:#111;background:#fff;line-height:1.45}h1{font-size:1.5rem}h2{font-size:1.2rem;margin-top:1.6rem;border-bottom:1px solid #ccc}h3{font-size:1rem}ul{padding-left:1.2rem}@media print{body{margin:0}}</style>",
    "</head>",
    "<body>",
    ...corpo,
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

// ------------------------------------------------------------------ PDF

const LARGURA = 595;
const ALTURA = 842;
const MARGEM = 56;

/** Pontuação tipográfica fora do Latin-1 levada à posição equivalente da WinAnsi. */
const TROCAS = new Map<number, number>([
  [0x2013, 0x2d],
  [0x2014, 0x2d],
  [0x2018, 0x27],
  [0x2019, 0x27],
  [0x201c, 0x22],
  [0x201d, 0x22],
  [0x2022, 0x95],
  [0x20ac, 0x80],
  [0x2026, 0x85],
]);

function paraWinAnsi(s: string): number[] {
  const out: number[] = [];
  for (const ch of s) {
    const c = ch.codePointAt(0) ?? 0x3f;
    const troca = TROCAS.get(c);
    if (troca !== undefined) out.push(troca);
    else out.push((c >= 0x20 && c <= 0x7e) || (c >= 0xa0 && c <= 0xff) ? c : 0x3f);
  }
  return out;
}

/** Literal de string do PDF, com barra invertida e parênteses escapados. */
function literalPdf(s: string): string {
  return paraWinAnsi(s)
    .map((c) => {
      const ch = String.fromCharCode(c);
      return ch === "\\" || ch === "(" || ch === ")" ? `\\${ch}` : ch;
    })
    .join("");
}

/** Quebra o texto em linhas de até `max` caracteres, preferindo espaços. */
function quebrar(texto: string, max: number): string[] {
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of texto.split(/\s+/)) {
    let p = palavra;
    while (p.length > max) {
      if (atual) {
        linhas.push(atual);
        atual = "";
      }
      linhas.push(p.slice(0, max));
      p = p.slice(max);
    }
    if (!atual) atual = p;
    else if (atual.length + 1 + p.length <= max) atual += ` ${p}`;
    else {
      linhas.push(atual);
      atual = p;
    }
  }
  if (atual) linhas.push(atual);
  return linhas.length > 0 ? linhas : [""];
}

const ESTILO = {
  h1: { fonte: "F2", tamanho: 16, entrelinha: 22, antes: 0, recuo: 0 },
  h2: { fonte: "F2", tamanho: 13, entrelinha: 18, antes: 8, recuo: 0 },
  h3: { fonte: "F2", tamanho: 11, entrelinha: 15, antes: 4, recuo: 0 },
  p: { fonte: "F1", tamanho: 10, entrelinha: 13, antes: 2, recuo: 0 },
  li: { fonte: "F1", tamanho: 10, entrelinha: 13, antes: 0, recuo: 12 },
} as const;

interface LinhaPdf {
  readonly fonte: string;
  readonly tamanho: number;
  readonly x: number;
  readonly y: number;
  readonly texto: string;
}

/** Diagrama o documento em páginas A4. */
function paginar(doc: Documento): LinhaPdf[][] {
  const paginas: LinhaPdf[][] = [[]];
  let y = ALTURA - MARGEM;
  const util = LARGURA - 2 * MARGEM;
  for (const b of doc) {
    const e = ESTILO[b.tipo];
    // Largura média da Helvetica tomada com folga (0,6 do corpo) para não estourar a margem.
    const max = Math.floor((util - e.recuo) / (e.tamanho * 0.6));
    const partes = quebrar(b.tipo === "li" ? `- ${b.texto}` : b.texto, max);
    y -= e.antes;
    partes.forEach((t, i) => {
      if (y - e.entrelinha < MARGEM + 20) {
        paginas.push([]);
        y = ALTURA - MARGEM;
      }
      y -= e.entrelinha;
      const recuo = b.tipo === "li" && i > 0 ? e.recuo + 8 : e.recuo;
      paginas[paginas.length - 1]?.push({
        fonte: e.fonte,
        tamanho: e.tamanho,
        x: MARGEM + recuo,
        y,
        texto: t,
      });
    });
  }
  return paginas;
}

/** PDF 1.4 do documento, com rodapé "Página n de N". */
export function documentoParaPdf(doc: Documento): Uint8Array {
  const paginas = paginar(doc);
  const total = paginas.length;
  // Objetos: 1 catálogo, 2 páginas, 3 Helvetica, 4 Helvetica-Bold, depois página e conteúdo.
  const objetos: string[] = [];
  const idPagina = (i: number) => 5 + i * 2;
  objetos[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objetos[2] = `<< /Type /Pages /Kids [${paginas.map((_, i) => `${idPagina(i)} 0 R`).join(" ")}] /Count ${total} >>`;
  objetos[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";
  objetos[4] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>";
  paginas.forEach((linhas, i) => {
    const comandos = linhas.map(
      (l) => `BT /${l.fonte} ${l.tamanho} Tf ${l.x} ${l.y} Td (${literalPdf(l.texto)}) Tj ET`,
    );
    comandos.push(
      `BT /F1 8 Tf ${LARGURA - MARGEM - 70} ${MARGEM - 20} Td (${literalPdf(`Página ${i + 1} de ${total}`)}) Tj ET`,
    );
    const fluxo = comandos.join("\n");
    objetos[idPagina(i)] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${LARGURA} ${ALTURA}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${idPagina(i) + 1} 0 R >>`;
    objetos[idPagina(i) + 1] = `<< /Length ${fluxo.length} >>\nstream\n${fluxo}\nendstream`;
  });
  let saida = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
  const deslocamentos: number[] = [];
  for (let i = 1; i < objetos.length; i++) {
    deslocamentos[i] = saida.length;
    saida += `${i} 0 obj\n${objetos[i]}\nendobj\n`;
  }
  const inicioXref = saida.length;
  saida += `xref\n0 ${objetos.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objetos.length; i++) {
    saida += `${String(deslocamentos[i]).padStart(10, "0")} 00000 n \n`;
  }
  saida += `trailer\n<< /Size ${objetos.length} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`;
  // Cada caractere da string é um byte (WinAnsi já aplicado nos literais).
  const bytes = new Uint8Array(saida.length);
  for (let i = 0; i < saida.length; i++) bytes[i] = saida.charCodeAt(i) & 0xff;
  return bytes;
}
