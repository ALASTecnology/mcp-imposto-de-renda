/**
 * Pendências de validação e o catálogo de regras que as produz.
 *
 * Gravidade:
 * - `erro`: impede a entrega (equivale a uma pendência impeditiva do programa
 *   oficial ou a um dado sem o qual a declaração não é aceita);
 * - `aviso`: não impede a entrega, mas indica inconsistência com risco de
 *   malha fina ou de dedução indevida, ou uma regra inferida que merece
 *   conferência do contribuinte.
 */
import type { Ficha } from "../model/declaracao.js";

export type Gravidade = "erro" | "aviso";

/** Uma pendência encontrada na declaração. */
export interface Pendencia {
  /** Código estável da regra (ex.: `DEP-CPF-DV`). */
  readonly codigo: string;
  readonly gravidade: Gravidade;
  /** Ficha onde o problema está. */
  readonly ficha: Ficha;
  /** Caminho do campo no modelo (ex.: `dependentes[0].cpf`). */
  readonly caminho: string;
  /** Mensagem em pt-BR para o contribuinte. */
  readonly mensagem: string;
}

/** Descrição de uma regra de validação, com a fonte que a fundamenta. */
export interface Regra {
  readonly codigo: string;
  readonly gravidade: Gravidade;
  readonly ficha: Ficha;
  /** O que a regra verifica. */
  readonly descricao: string;
  /** Nota de mapeamento, página da Ajuda ou norma de onde a regra vem. */
  readonly fonte: string;
}

/** Declara uma regra (só para manter a forma uniforme e tipada). */
export function regra(r: Regra): Regra {
  return Object.freeze({ ...r });
}

/** Cria a pendência de uma regra num caminho, com mensagem específica do caso. */
export function pendencia(r: Regra, caminho: string, mensagem: string): Pendencia {
  return { codigo: r.codigo, gravidade: r.gravidade, ficha: r.ficha, caminho, mensagem };
}

/** Separa pendências que impedem a entrega (erros) das que só alertam (avisos). */
export function separarPendencias(pendencias: readonly Pendencia[]): {
  erros: Pendencia[];
  avisos: Pendencia[];
} {
  const erros: Pendencia[] = [];
  const avisos: Pendencia[] = [];
  for (const p of pendencias) (p.gravidade === "erro" ? erros : avisos).push(p);
  return { erros, avisos };
}

/** A declaração pode ser entregue se não houver nenhuma pendência de gravidade `erro`. */
export function podeEntregar(pendencias: readonly Pendencia[]): boolean {
  return !pendencias.some((p) => p.gravidade === "erro");
}
