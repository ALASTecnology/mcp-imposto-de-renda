/**
 * Leitura de informes colados pelo usuário (sem OCR e sem rede): comprovante de rendimentos de
 * pessoa jurídica e informe de plano de saúde, em texto livre ou JSON.
 *
 * Texto: cada linha é procurada por rótulos do modelo oficial do comprovante (IN RFB
 * 2.060/2021) e o último valor monetário da linha ("1.234,56") é o valor do campo. O primeiro
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
}

const DINHEIRO = /\d{1,3}(?:\.\d{3})*,\d{2}/g;
const CNPJ = /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/;

function ultimoValor(linha: string): bigint | undefined {
  const v = linha.match(DINHEIRO);
  const ultimo = v?.at(-1);
  return ultimo ? parseCentavos(ultimo) : undefined;
}

const sem = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function cnpjValido(c: string): boolean {
  return /^\d{14}$/.test(c) && calcularDvCnpj(c.slice(0, 12)) === c.slice(12);
}

/** Rótulos do comprovante: [trecho do rótulo sem acento, destino]. A ordem importa. */
const ROTULOS: readonly (readonly [RegExp, string])[] = [
  [/imposto.*retido.*13|13.*imposto.*retido|irrf.*13/, "irrf13"],
  [/decimo terceiro|13o salario|13º salario|13 salario/, "decimo"],
  [
    /(total dos )?rendimentos( tributaveis)? \(inclusive ferias\)|total dos rendimentos/,
    "rendimentos",
  ],
  [/contribuicao previdenciaria oficial/, "previdencia"],
  [/imposto sobre a renda retido na fonte|imposto retido/, "irrf"],
  [/65 anos|parcela isenta/, "isento10"],
  [/molestia grave|acidente em servico/, "isento11"],
  [/indenizac.*rescisao|rescisao de contrato|pdv|fgts/, "isento04"],
  [/lucros e dividendos/, "isento09"],
  [/participacao nos lucros|plr/, "exclusivo11"],
  [/juros sobre (o )?capital proprio/, "exclusivo10"],
  [/aplicac(oes|ao) financeira/, "exclusivo06"],
];

function interpretarTexto(texto: string, beneficiario: Beneficiario): InformeRendimentos {
  const linhas = texto.split(/\r?\n/);
  const cnpj = CNPJ.exec(texto)?.[0].replace(/\D/g, "");
  if (!cnpj || !cnpjValido(cnpj)) {
    throw new EntradaInvalidaError(
      "Não encontrei um CNPJ válido da fonte pagadora no texto do informe.",
    );
  }
  let nome = "";
  for (let i = 0; i < linhas.length && !nome; i++) {
    const l = linhas[i] ?? "";
    if (/nome empresarial|razao social|razão social/i.test(sem(l))) {
      const resto = l.split(/[:]/).slice(1).join(":").trim();
      nome = (resto || linhas[i + 1] || "").replace(CNPJ, "").replace(/cnpj/i, "").trim();
    }
  }
  if (!nome) nome = "FONTE PAGADORA";
  const v: Record<string, bigint> = {};
  for (const l of linhas) {
    const valor = ultimoValor(l);
    if (valor === undefined) continue;
    const t = sem(l);
    const r = ROTULOS.find(([rx]) => rx.test(t));
    if (r && v[r[1]] === undefined) v[r[1]] = valor;
  }
  const isentos: InformeRendimentos["isentos"] = [];
  const exclusivos: InformeRendimentos["exclusivos"] = [];
  for (const [k, x] of Object.entries(v)) {
    if (k.startsWith("isento")) isentos.push({ codigo: k.slice(6), valor: x });
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
    isentos: isentos.filter((i) => i.codigo !== "11"),
    exclusivos,
    planoSaude: [],
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
    for (const l of entrada.split(/\r?\n/)) {
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
