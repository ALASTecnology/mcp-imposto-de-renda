/**
 * Tabela das fichas em lista do modelo, que dirige a geração das ferramentas de edição
 * (adicionar_*, editar_*, remover_*, listar_*) e das genéricas (listar_lancamentos etc.).
 *
 * Cada entrada diz como ler e regravar a lista no modelo. Listas que no modelo ficam em mais
 * de um lugar (doações diretas ao ECA e à pessoa idosa; abas Brasil e Exterior da atividade
 * rural) aparecem como uma lista só, com um campo extra (`fundo` ou `aba`) que diz o destino.
 */
import {
  type Declaracao,
  FICHAS,
  zAlimentando,
  zAtividadeRural,
  zBemAtividadeRural,
  zBemDireito,
  zDemonstrativoGcap,
  zDependente,
  zDivida,
  zDividaAtividadeRural,
  zDoacaoDiretaNaDeclaracao,
  zDoacaoEfetuada,
  zDoacaoPartido,
  zHerdeiro,
  zImovelRural,
  zMesAtividadeRural,
  zOperacoesFii,
  zPagamento,
  zRebanho,
  zReceitasDespesasExterior,
  zRendaVariavel,
  zRendimentoExclusivo,
  zRendimentoExigibilidadeSuspensa,
  zRendimentoIsento,
  zRendimentoPJ,
  zRendimentoRRA,
  zRendimentosPFExterior,
} from "@mcp-imposto-de-renda/core";
import { z } from "zod";

type Item = Record<string, unknown>;

/** Lançamento afetado pela remoção em cascata de um dependente ou alimentando. */
export interface Afetado {
  ficha: string;
  indice: number;
  acao: "removido" | "desvinculado";
}

export interface FichaLista {
  /** Identificador usado no parâmetro `ficha` das ferramentas genéricas. */
  readonly id: string;
  readonly nome: string;
  /** Sufixo das ferramentas próprias no singular (adicionar_x); ausente = só genéricas. */
  readonly singular?: string;
  /** Sufixo de listar_x. */
  readonly plural?: string;
  /** Schema do core de um item (com o campo de destino, se for lista composta). */
  readonly item: z.ZodType;
  /** Campo extra que decide o destino do item numa lista composta (`fundo` ou `aba`). */
  readonly campoGrupo?: string;
  /** Orientação adicional para a descrição das ferramentas. */
  readonly dica?: string;
  ler(d: Declaracao): Item[];
  gravar(d: Declaracao, itens: Item[]): void;
  /**
   * Lançamentos de outras fichas ligados ao item (por CPF). Com `aplicar`, remove ou
   * desvincula esses lançamentos em `d`.
   */
  vinculos?(d: Declaracao, item: Item, aplicar: boolean): Afetado[];
}

type Chave = keyof Declaracao;
const lista = (d: Declaracao, k: Chave): Item[] =>
  ((d as unknown as Record<string, unknown>)[k] as Item[] | undefined) ?? [];
const definir = (d: Declaracao, k: Chave, itens: Item[]) => {
  (d as unknown as Record<string, unknown>)[k] = itens;
};

function simples(
  id: Chave,
  item: z.ZodType,
  extra: Partial<FichaLista> & { singular?: string; plural?: string },
): FichaLista {
  return {
    id,
    nome: FICHAS[id as keyof typeof FICHAS],
    item,
    ler: (d) => lista(d, id),
    gravar: (d, itens) => definir(d, id, itens),
    ...extra,
  };
}

type Aba = "brasil" | "exterior";
type ListaRural = "imoveis" | "rebanho" | "dividas" | "receitasDespesas";

function garantirRural(d: Declaracao): NonNullable<Declaracao["atividadeRural"]> {
  if (!d.atividadeRural) d.atividadeRural = zAtividadeRural.parse({});
  return d.atividadeRural;
}

function rural(
  sub: ListaRural,
  nome: string,
  singular: string,
  plural: string,
  item: z.ZodType,
  dica?: string,
): FichaLista {
  return {
    id: `atividadeRural.${sub}`,
    nome: `${FICHAS.atividadeRural}: ${nome}`,
    singular,
    plural,
    item,
    campoGrupo: "aba",
    ...(dica ? { dica } : {}),
    ler: (d) => {
      const ar = d.atividadeRural;
      if (!ar) return [];
      const de = (aba: Aba) =>
        (ar[aba][sub] as unknown as Item[]).map((x) => ({ aba, ...x }) as Item);
      return [...de("brasil"), ...de("exterior")];
    },
    gravar: (d, itens) => {
      const ar = garantirRural(d);
      for (const aba of ["brasil", "exterior"] as const) {
        const daAba = itens.filter((x) => x.aba === aba).map(({ aba: _, ...resto }) => resto);
        (ar[aba] as unknown as Record<string, unknown>)[sub] = daAba;
      }
    },
  };
}

const zAba = z.enum(["brasil", "exterior"]);

/** Beneficiário que é o dependente de CPF `cpf`. */
const doDependente = (b: unknown, cpf: string) =>
  typeof b === "object" &&
  b !== null &&
  (b as Item).tipo === "dependente" &&
  (b as Item).cpf === cpf;

/** Aplica `pred` à lista `k`: remove (ou desvincula) os que casam e registra os afetados. */
function cascata(
  d: Declaracao,
  k: Chave,
  pred: (x: Item) => boolean,
  aplicar: boolean,
  afetados: Afetado[],
  desvincular?: (x: Item) => Item,
): void {
  const itens = lista(d, k);
  const nome = FICHAS[k as keyof typeof FICHAS];
  const restantes: Item[] = [];
  let mudou = false;
  itens.forEach((x, i) => {
    if (!pred(x)) {
      restantes.push(x);
      return;
    }
    mudou = true;
    afetados.push({ ficha: nome, indice: i + 1, acao: desvincular ? "desvinculado" : "removido" });
    if (desvincular) restantes.push(desvincular(x));
  });
  if (aplicar && mudou) definir(d, k, restantes);
}

const TITULAR = { tipo: "titular" } as const;

function vinculosDependente(d: Declaracao, item: Item, aplicar: boolean): Afetado[] {
  const cpf = String(item.cpf ?? "");
  const afetados: Afetado[] = [];
  const porBeneficiario = (x: Item) => doDependente(x.beneficiario, cpf);
  for (const k of [
    "rendimentosPJ",
    "rendimentosPFExterior",
    "rendimentosIsentos",
    "rendimentosExclusivos",
    "rendimentosExigibilidadeSuspensa",
    "rendimentosAcumulados",
    "rendaVariavel",
    "fundosImobiliarios",
  ] as const) {
    cascata(d, k, porBeneficiario, aplicar, afetados);
  }
  cascata(d, "pagamentos", (x) => doDependente(x.realizadoCom, cpf), aplicar, afetados);
  cascata(d, "ganhosCapital", (x) => x.cpfBeneficiario === cpf, aplicar, afetados);
  cascata(
    d,
    "bens",
    (x) => doDependente(x.pertenceA, cpf),
    aplicar,
    afetados,
    (x) => ({ ...x, pertenceA: TITULAR }),
  );
  cascata(
    d,
    "alimentandos",
    (x) => doDependente(x.vinculo, cpf),
    aplicar,
    afetados,
    (x) => ({ ...x, vinculo: TITULAR }),
  );
  return afetados;
}

function vinculosAlimentando(d: Declaracao, item: Item, aplicar: boolean): Afetado[] {
  const cpf = String(item.cpf ?? "");
  const afetados: Afetado[] = [];
  cascata(
    d,
    "pagamentos",
    (x) => {
      const r = x.realizadoCom as Item | undefined;
      return r?.tipo === "alimentando" && r.cpf === cpf;
    },
    aplicar,
    afetados,
  );
  cascata(
    d,
    "rendimentosAcumulados",
    (x) => ((x.pensoes as Item[] | undefined) ?? []).some((p) => p.cpfAlimentando === cpf),
    aplicar,
    afetados,
    (x) => ({
      ...x,
      pensoes: ((x.pensoes as Item[] | undefined) ?? []).filter((p) => p.cpfAlimentando !== cpf),
    }),
  );
  return afetados;
}

const DICA_BENEFICIARIO =
  'beneficiario: {"tipo":"titular"} ou {"tipo":"dependente","cpf":"<CPF já cadastrado em Dependentes>"}.';

export const FICHAS_LISTA: readonly FichaLista[] = Object.freeze([
  simples("dependentes", zDependente, {
    singular: "dependente",
    plural: "dependentes",
    dica: "codigo da relação de dependência (tabela dependentes, use buscar_codigo).",
    vinculos: vinculosDependente,
  }),
  simples("alimentandos", zAlimentando, {
    singular: "alimentando",
    plural: "alimentandos",
    vinculos: vinculosAlimentando,
  }),
  simples("rendimentosPJ", zRendimentoPJ, {
    singular: "rendimento_pj",
    plural: "rendimentos_pj",
    dica: DICA_BENEFICIARIO,
  }),
  simples("rendimentosPFExterior", zRendimentosPFExterior, {
    dica: "Use definir_rendimentos_pf_exterior para lançar mês a mês.",
  }),
  simples("rendimentosIsentos", zRendimentoIsento, {
    singular: "rendimento_isento",
    plural: "rendimentos_isentos",
    dica: `codigo decide os campos (tabela rendimentos isentos). ${DICA_BENEFICIARIO}`,
  }),
  simples("rendimentosExclusivos", zRendimentoExclusivo, {
    singular: "rendimento_exclusivo",
    plural: "rendimentos_exclusivos",
    dica: `codigo decide os campos (tabela de tributação exclusiva). ${DICA_BENEFICIARIO}`,
  }),
  simples("rendimentosExigibilidadeSuspensa", zRendimentoExigibilidadeSuspensa, {
    singular: "rendimento_exigibilidade_suspensa",
    plural: "rendimentos_exigibilidade_suspensa",
    dica: DICA_BENEFICIARIO,
  }),
  simples("rendimentosAcumulados", zRendimentoRRA, {
    singular: "rra",
    plural: "rra",
    dica: DICA_BENEFICIARIO,
  }),
  simples("pagamentos", zPagamento, {
    singular: "pagamento",
    plural: "pagamentos",
    dica: "codigo da tabela pagamentos (use listar_tabela pagamentos).",
  }),
  simples("doacoesEfetuadas", zDoacaoEfetuada, { singular: "doacao", plural: "doacoes" }),
  {
    id: "doacoesDiretamenteNaDeclaracao",
    nome: FICHAS.doacoesDiretamenteNaDeclaracao,
    singular: "doacao_direta_declaracao",
    plural: "doacoes_diretas_declaracao",
    item: zDoacaoDiretaNaDeclaracao.extend({ fundo: z.enum(["eca", "idoso"]) }),
    campoGrupo: "fundo",
    dica: 'fundo: "eca" (criança e adolescente) ou "idoso" (pessoa idosa).',
    ler: (d) => [
      ...d.doacoesDiretamenteNaDeclaracao.eca.map((x) => ({ fundo: "eca", ...x })),
      ...d.doacoesDiretamenteNaDeclaracao.idoso.map((x) => ({ fundo: "idoso", ...x })),
    ],
    gravar: (d, itens) => {
      const de = (f: string) =>
        itens.filter((x) => x.fundo === f).map(({ fundo: _, ...resto }) => resto);
      d.doacoesDiretamenteNaDeclaracao = {
        eca: de("eca") as Declaracao["doacoesDiretamenteNaDeclaracao"]["eca"],
        idoso: de("idoso") as Declaracao["doacoesDiretamenteNaDeclaracao"]["idoso"],
      };
    },
  },
  simples("bens", zBemDireito, {
    singular: "bem",
    plural: "bens",
    dica: "grupo e codigo da tabela bens-direitos (use buscar_codigo). Para usufruto, bem a inventariar e partilha, veja aplicar_caso_especial_bem e definir_partilha_bem.",
  }),
  simples("dividas", zDivida, { singular: "divida", plural: "dividas" }),
  simples("herdeiros", zHerdeiro, {
    singular: "herdeiro",
    plural: "herdeiros",
    dica: "Só na Declaração Final de Espólio.",
  }),
  simples("doacoesPartidos", zDoacaoPartido, {
    singular: "doacao_eleitoral",
    plural: "doacoes_eleitorais",
  }),
  simples("ganhosCapital", zDemonstrativoGcap, {
    singular: "ganho_capital",
    plural: "ganhos_capital",
    dica: "Um demonstrativo de ganhos de capital por beneficiário, normalmente importado do programa GCAP.",
  }),
  simples("rendaVariavel", zRendaVariavel, {
    singular: "renda_variavel",
    plural: "renda_variavel",
    dica: `Um item por pessoa; para lançar mês a mês use definir_renda_variavel. ${DICA_BENEFICIARIO}`,
  }),
  simples("fundosImobiliarios", zOperacoesFii, {
    singular: "fii_fiagro",
    plural: "fii_fiagro",
    dica: `Um item por pessoa; para lançar mês a mês use definir_fii_fiagro. ${DICA_BENEFICIARIO}`,
  }),
  rural(
    "imoveis",
    "Imóveis explorados",
    "imovel_rural",
    "imoveis_rurais",
    zImovelRural.extend({ aba: zAba }),
    'aba: "brasil" ou "exterior".',
  ),
  rural(
    "receitasDespesas",
    "Receitas e despesas",
    "receita_despesa_rural",
    "receitas_despesas_rurais",
    z.discriminatedUnion("aba", [
      zMesAtividadeRural.extend({ aba: z.literal("brasil") }),
      zReceitasDespesasExterior.extend({ aba: z.literal("exterior") }),
    ]),
    'aba "brasil": um item por mês; aba "exterior": um item por país, em moeda original. Para lançar vários meses, use definir_receitas_despesas_rurais.',
  ),
  rural(
    "rebanho",
    "Movimentação do rebanho",
    "rebanho",
    "rebanhos",
    zRebanho.extend({ aba: zAba }),
    'aba: "brasil" ou "exterior"; um item por espécie.',
  ),
  {
    id: "atividadeRural.bens",
    nome: `${FICHAS.atividadeRural}: Bens da atividade rural`,
    singular: "bem_rural",
    plural: "bens_rurais",
    item: zBemAtividadeRural,
    ler: (d) => (d.atividadeRural?.bens ?? []) as unknown as Item[],
    gravar: (d, itens) => {
      garantirRural(d).bens = itens as unknown as NonNullable<Declaracao["atividadeRural"]>["bens"];
    },
  },
  rural(
    "dividas",
    "Dívidas vinculadas à atividade rural",
    "divida_rural",
    "dividas_rurais",
    zDividaAtividadeRural.extend({ aba: zAba }),
    'aba: "brasil" ou "exterior".',
  ),
]);

export const IDS_FICHAS_LISTA = FICHAS_LISTA.map((f) => f.id) as [string, ...string[]];

export function fichaLista(id: string): FichaLista {
  const f = FICHAS_LISTA.find((x) => x.id === id);
  if (!f) throw new Error(`ficha desconhecida: ${id}`);
  return f;
}
