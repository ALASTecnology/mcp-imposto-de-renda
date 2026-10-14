/**
 * tabelas/: tabelas de códigos do exercício 2026 como módulos tipados.
 *
 * API mínima: `listar(tabela)` devolve as entradas na ordem original e
 * `buscarCodigo(tabela, codigo)` faz a consulta por código com índice em
 * memória construído sob demanda.
 */
import { DADOS, type MapaTabelas, type NomeTabela } from "./dados.js";
import type { EntradaBemDireito, EntradaParametro } from "./tipos.js";

export type { MapaTabelas, NomeTabela } from "./dados.js";
export type * from "./tipos.js";

/** Nomes de todas as tabelas disponíveis. */
export const NOMES_TABELAS = Object.freeze(Object.keys(DADOS) as NomeTabela[]);

/** Tabelas cujo código é um CNPJ: a busca ignora pontuação. */
const TABELAS_CNPJ: ReadonlySet<NomeTabela> = new Set(["fundos-eca", "fundos-idoso"]);

function chaveDe(tabela: NomeTabela, entrada: MapaTabelas[NomeTabela]): string {
  if (tabela === "bens-direitos") {
    const bem = entrada as EntradaBemDireito;
    return `${bem.grupo}.${bem.codigo}`;
  }
  return normalizarCodigo(tabela, entrada.codigo);
}

function normalizarCodigo(tabela: NomeTabela, codigo: string): string {
  const limpo = codigo.trim();
  return TABELAS_CNPJ.has(tabela) ? limpo.replace(/\D/g, "") : limpo;
}

const indices = new Map<NomeTabela, Map<string, MapaTabelas[NomeTabela]>>();

function indice<N extends NomeTabela>(tabela: N): Map<string, MapaTabelas[N]> {
  let mapa = indices.get(tabela);
  if (!mapa) {
    mapa = new Map();
    for (const entrada of DADOS[tabela]) mapa.set(chaveDe(tabela, entrada), entrada);
    indices.set(tabela, mapa);
  }
  return mapa as Map<string, MapaTabelas[N]>;
}

/** Lista todas as entradas de uma tabela, na ordem do arquivo de origem. */
export function listar<N extends NomeTabela>(tabela: N): readonly MapaTabelas[N][] {
  return DADOS[tabela];
}

/**
 * Busca a entrada de um código. Em `bens-direitos` o código é composto
 * `"GG.CC"` (grupo e código); nos fundos (`fundos-eca`, `fundos-idoso`) o CNPJ
 * pode vir com ou sem pontuação.
 */
export function buscarCodigo<N extends NomeTabela>(
  tabela: N,
  codigo: string,
): MapaTabelas[N] | undefined {
  return indice(tabela).get(normalizarCodigo(tabela, codigo));
}

/** Indica se o código existe na tabela. */
export function existeCodigo(tabela: NomeTabela, codigo: string): boolean {
  return buscarCodigo(tabela, codigo) !== undefined;
}

/** Busca um código de bem ou direito pelo grupo e pelo código dentro do grupo. */
export function buscarBem(grupo: string, codigo: string): EntradaBemDireito | undefined {
  return buscarCodigo("bens-direitos", `${grupo}.${codigo}`);
}

/** Parâmetro de cálculo do ano-calendário pela chave original (ex.: `deducaoDependente`). */
export function parametroCalculo(codigo: string): EntradaParametro | undefined {
  return buscarCodigo("aliquotas-parametros", codigo);
}
