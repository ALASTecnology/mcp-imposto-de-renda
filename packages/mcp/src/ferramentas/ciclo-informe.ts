/**
 * Leitura de informes colados pelo usuário (sem OCR e sem rede): comprovante de rendimentos de
 * pessoa jurídica e informe de plano de saúde, em texto livre ou JSON.
 *
 * Texto: o rótulo de cada linha (o trecho antes do primeiro valor monetário) é comparado com os
 * rótulos do modelo oficial do comprovante (IN RFB 2.060/2021) e o último valor monetário da
 * linha ("1.234,56") é o valor do campo. Linhas com valor e sem rótulo conhecido, e campos
 * repetidos, voltam em `avisos`. O primeiro
 * CNPJ do texto é o da fonte; o nome vem da linha com "Nome empresarial" ou "Razão social".
 * Mensagens de erro citam o campo, nunca o conteúdo colado.
 */
import { calcularDvCnpj, parseCentavos } from "@autoir/core";
import { EntradaInvalidaError } from "../erros.js";
import { normalizarValor } from "../esquemas.js";

type Beneficiario = { tipo: "titular" } | { tipo: "dependente"; cpf: string };

export interface InformeRendimentos {
  beneficiario: Beneficiario;
  fonte: { ni: string; nome: string };
  rendimentos: bigint;
  previdenciaOficial: bigint;
  irrf: bigint;
  decimoTerceiro: bigint;
  irrfDecimoTerceiro: bigint;
  isentos: { codigo: string; valor: bigint; decimoTerceiro?: bigint }[];
  exclusivos: { codigo: string; valor: bigint }[];
  planoSaude: {
    cnpj: string;
    nome: string;
    valor: bigint;
    reembolso: bigint;
    cpfBeneficiario?: string;
  }[];
  /** Linhas ou campos descartados na leitura do texto (sem o conteúdo colado). */
  avisos: string[];
}

const DINHEIRO = /\d{1,3}(?:\.\d{3})*,\d{2}/g;
const CNPJ = /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/;

const sem = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function cnpjValido(c: string): boolean {
  return /^\d{14}$/.test(c) && calcularDvCnpj(c.slice(0, 12)) === c.slice(12);
}

/**
 * Rótulos do comprovante, testados só no texto do rótulo (o trecho da linha antes do primeiro
 * valor monetário), sem acentos e em minúsculas. Cada regra é uma lista de alternativas; uma
 * alternativa casa quando todos os seus trechos aparecem. A ordem importa: a parcela isenta de
 * 65 anos vem antes do 13º, e o IRRF do 13º antes do IRRF anual. Só `includes`, sem expressão
 * regular sobre o texto colado, para não haver custo quadrático (ver a revisão A3).
 */
const ROTULOS: readonly (readonly [string, readonly (readonly string[])[]])[] = [
  [
    "isento10_13",
    [
      ["isenta", "65 anos", "13"],
      ["isenta", "aposentadoria", "13"],
    ],
  ],
  [
    "isento10",
    [
      ["isenta", "65 anos"],
      ["isenta", "aposentadoria"],
    ],
  ],
  ["isento11", [["molestia grave"], ["acidente em servico"], ["doenca grave"]]],
  [
    "irrf13",
    [
      ["13", "retido"],
      ["13", "irrf"],
    ],
  ],
  ["decimo", [["decimo terceiro"], ["13o salario"], ["13º salario"], ["13 salario"]]],
  ["rendimentos", [["total dos rendimentos"], ["rendimentos tributaveis"]]],
  ["previdencia", [["contribuicao previdenciaria oficial"], ["previdencia oficial"]]],
  ["irrf", [["imposto sobre a renda retido na fonte"], ["imposto retido"], ["irrf"]]],
  ["isento04", [["rescisao"], ["pdv"], ["fgts"], ["indenizac"]]],
  ["isento09", [["lucros e dividendos"]]],
  ["exclusivo11", [["participacao nos lucros"], ["plr"]]],
  ["exclusivo10", [["capital proprio"]]],
  ["exclusivo06", [["aplicac", "financeira"]]],
];

/** Linhas maiores que isto são truncadas antes da leitura (defesa contra entrada hostil). */
const TAMANHO_MAXIMO_LINHA = 300;

const NOME_CAMPO: Record<string, string> = {
  isento10_13: "parcela isenta do 13º (65 anos)",
  isento10: "parcela isenta de aposentadoria (65 anos)",
  isento11: "moléstia grave ou acidente em serviço",
  irrf13: "IRRF sobre o 13º salário",
  decimo: "13º salário",
  rendimentos: "total dos rendimentos",
  previdencia: "contribuição previdenciária oficial",
  irrf: "imposto retido na fonte",
  isento04: "indenizações por rescisão",
  isento09: "lucros e dividendos",
  exclusivo11: "participação nos lucros (PLR)",
  exclusivo10: "juros sobre capital próprio",
  exclusivo06: "aplicações financeiras",
};

/** Destino da linha pelo rótulo, ou `undefined` se nenhum rótulo conhecido casar. */
export function campoDoRotulo(rotulo: string): string | undefined {
  const t = sem(rotulo);
  return ROTULOS.find(([, alternativas]) =>
    alternativas.some((trechos) => trechos.every((x) => t.includes(x))),
  )?.[0];
}

function interpretarTexto(texto: string, beneficiario: Beneficiario): InformeRendimentos {
  const linhas = texto.split(/\r?\n/).map((l) => l.slice(0, TAMANHO_MAXIMO_LINHA));
  const cnpj = CNPJ.exec(texto)?.[0].replace(/\D/g, "");
  if (!cnpj || !cnpjValido(cnpj)) {
    throw new EntradaInvalidaError(
      "Não encontrei um CNPJ válido da fonte pagadora no texto do informe.",
    );
  }
  let nome = "";
  for (let i = 0; i < linhas.length && !nome; i++) {
    const l = linhas[i] ?? "";
    const m = /(?:nome empresarial|raz[aã]o social)\s*:?(.*)$/i.exec(l);
    if (m) {
      const resto = (m[1] ?? "").trim();
      nome = (resto || linhas[i + 1] || "")
        .replace(CNPJ, "")
        .replace(/cnpj:?/i, "")
        .trim();
    }
  }
  if (!nome) nome = "FONTE PAGADORA";
  const v: Record<string, bigint> = {};
  const avisos: string[] = [];
  linhas.forEach((l, i) => {
    const valores = l.match(DINHEIRO);
    const ultimo = valores?.at(-1);
    if (!ultimo) return;
    const rotulo = l.slice(0, l.indexOf(valores?.[0] ?? ultimo));
    const campo = campoDoRotulo(rotulo);
    if (!campo) {
      avisos.push(`Linha ${i + 1}: valor sem rótulo reconhecido; não foi lançado.`);
      return;
    }
    if (v[campo] !== undefined) {
      avisos.push(
        `Linha ${i + 1}: "${NOME_CAMPO[campo]}" apareceu de novo; vale o primeiro valor, este foi descartado.`,
      );
      return;
    }
    v[campo] = parseCentavos(ultimo);
  });
  const isentos: InformeRendimentos["isentos"] = [];
  const exclusivos: InformeRendimentos["exclusivos"] = [];
  if (v.isento10 !== undefined || v.isento10_13 !== undefined) {
    isentos.push({
      codigo: "10",
      valor: v.isento10 ?? 0n,
      decimoTerceiro: v.isento10_13 ?? 0n,
    });
  }
  for (const [k, x] of Object.entries(v)) {
    if (/^isento\d\d$/.test(k) && k !== "isento10") isentos.push({ codigo: k.slice(6), valor: x });
    if (k.startsWith("exclusivo")) exclusivos.push({ codigo: k.slice(9), valor: x });
  }
  return {
    beneficiario,
    fonte: { ni: cnpj, nome: nome.slice(0, 60) },
    rendimentos: v.rendimentos ?? 0n,
    previdenciaOficial: v.previdencia ?? 0n,
    irrf: v.irrf ?? 0n,
    decimoTerceiro: v.decimo ?? 0n,
    irrfDecimoTerceiro: v.irrf13 ?? 0n,
    isentos,
    exclusivos,
    planoSaude: [],
    avisos,
  };
}

const valor = (x: unknown): bigint =>
  x === undefined || x === null ? 0n : BigInt(normalizarValor(x as string | number));

function lista(x: unknown): Record<string, unknown>[] {
  return Array.isArray(x) ? (x as Record<string, unknown>[]) : [];
}

/** Comprovante de rendimentos em texto ou no JSON documentado na ferramenta. */
export function interpretarInforme(
  entrada: unknown,
  beneficiario: Beneficiario,
): InformeRendimentos {
  if (typeof entrada === "string") return interpretarTexto(entrada, beneficiario);
  const j = (entrada ?? {}) as Record<string, unknown>;
  const fonte = (j.fonte ?? {}) as Record<string, unknown>;
  const cnpj = String(fonte.cnpj ?? fonte.ni ?? "").replace(/\D/g, "");
  if (!cnpjValido(cnpj) && !/^\d{11}$/.test(cnpj)) {
    throw new EntradaInvalidaError("json.fonte.cnpj: informe o CNPJ (ou CPF) da fonte pagadora.");
  }
  try {
    return {
      beneficiario,
      fonte: { ni: cnpj, nome: String(fonte.nome ?? "FONTE PAGADORA").slice(0, 60) },
      rendimentos: valor(j.rendimentos),
      previdenciaOficial: valor(j.previdenciaOficial),
      irrf: valor(j.irrf),
      decimoTerceiro: valor(j.decimoTerceiro),
      irrfDecimoTerceiro: valor(j.irrfDecimoTerceiro),
      isentos: lista(j.isentos).map((i) => ({
        codigo: String(i.codigo ?? "").padStart(2, "0"),
        valor: valor(i.valor),
        ...(i.decimoTerceiro !== undefined ? { decimoTerceiro: valor(i.decimoTerceiro) } : {}),
      })),
      exclusivos: lista(j.exclusivos).map((e) => ({
        codigo: String(e.codigo ?? "").padStart(2, "0"),
        valor: valor(e.valor),
      })),
      planoSaude: lista(j.planoSaude).map((p) => ({
        cnpj: String(p.cnpj ?? "").replace(/\D/g, ""),
        nome: String(p.nome ?? "OPERADORA").slice(0, 60),
        valor: valor(p.valor),
        reembolso: valor(p.reembolso),
      })),
      avisos: [],
    };
  } catch (e) {
    if (e instanceof EntradaInvalidaError) throw e;
    throw new EntradaInvalidaError(
      'json: valores monetários devem ser texto em reais ("1.234,56") ou inteiro de centavos.',
    );
  }
}

export interface PlanoSaude {
  cnpj: string;
  nome: string;
  itens: { valor: bigint; reembolso: bigint; cpfBeneficiario?: string }[];
}

/** Informe de plano de saúde em texto (valor por CPF) ou JSON. */
export function interpretarPlanoSaude(entrada: unknown, cpfTitular: string): PlanoSaude {
  if (typeof entrada === "string") {
    const cnpj = CNPJ.exec(entrada)?.[0].replace(/\D/g, "");
    if (!cnpj || !cnpjValido(cnpj)) {
      throw new EntradaInvalidaError(
        "Não encontrei um CNPJ válido da operadora no texto do informe.",
      );
    }
    const linhaNome =
      entrada.split(/\r?\n/).find((l) => /operadora|razao social|razão social/i.test(l)) ?? "";
    const nome =
      linhaNome.split(":").slice(1).join(":").replace(CNPJ, "").trim() ||
      "OPERADORA DE PLANO DE SAUDE";
    const itens: PlanoSaude["itens"] = [];
    for (const l of entrada.split(/\r?\n/).map((x) => x.slice(0, TAMANHO_MAXIMO_LINHA))) {
      const cpf = /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/.exec(l)?.[0].replace(/\D/g, "");
      const valores = l.match(DINHEIRO)?.map((x) => parseCentavos(x));
      if (!cpf || !valores?.length) continue;
      itens.push({
        valor: valores[0] ?? 0n,
        reembolso: valores[1] ?? 0n,
        ...(cpf !== cpfTitular ? { cpfBeneficiario: cpf } : {}),
      });
    }
    if (itens.length === 0) {
      throw new EntradaInvalidaError(
        "Não encontrei linhas com CPF e valor pago no informe do plano de saúde.",
      );
    }
    return { cnpj, nome: nome.slice(0, 60), itens };
  }
  const j = (entrada ?? {}) as Record<string, unknown>;
  const op = (j.operadora ?? {}) as Record<string, unknown>;
  const cnpj = String(op.cnpj ?? "").replace(/\D/g, "");
  if (!cnpjValido(cnpj))
    throw new EntradaInvalidaError("json.operadora.cnpj: informe o CNPJ da operadora.");
  const itens = lista(j.beneficiarios).map((b) => {
    const cpf = String(b.cpf ?? cpfTitular).replace(/\D/g, "");
    return {
      valor: valor(b.valor),
      reembolso: valor(b.reembolso),
      ...(cpf !== cpfTitular ? { cpfBeneficiario: cpf } : {}),
    };
  });
  return { cnpj, nome: String(op.nome ?? "OPERADORA").slice(0, 60), itens };
}
