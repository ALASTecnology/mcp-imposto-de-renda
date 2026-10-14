/**
 * Perfis de ferramentas: recortes predefinidos do catálogo para clientes que limitam a quantidade
 * de ferramentas (o VS Code aceita até 128 por pedido e o Cascade do Windsurf, 100).
 *
 * O recorte usa duas marcas das definições: `escreve` (grava na pasta autorizada) e `atalho`
 * (ferramenta própria de uma ficha que repete uma genérica: `editar_*`, `remover_*` e `listar_*`
 * por ficha, cobertos por `editar_lancamento`, `remover_lancamento` e `listar_lancamentos`).
 * Assim, uma ficha nova entra nos perfis certos sem mexer aqui.
 */
import { EntradaInvalidaError } from "../erros.js";
import type { NomeGrupo } from "./tipos.js";

export const NOMES_PERFIS = ["completo", "essencial", "consulta"] as const;
export type NomePerfil = (typeof NOMES_PERFIS)[number];

/** O que um perfil sabe de cada ferramenta para decidir se ela entra. */
export interface InfoFerramenta {
  readonly nome: string;
  readonly grupo: NomeGrupo;
  readonly escreve: boolean;
  readonly atalho: boolean;
}

export interface Perfil {
  readonly nome: NomePerfil;
  readonly descricao: string;
  inclui(info: InfoFerramenta): boolean;
}

export const PERFIS: Readonly<Record<NomePerfil, Perfil>> = Object.freeze({
  completo: {
    nome: "completo",
    descricao: "Todas as ferramentas. É o padrão.",
    inclui: () => true,
  },
  essencial: {
    nome: "essencial",
    descricao:
      "Ciclo inteiro da declaração (criar, preencher qualquer ficha, validar, calcular e gravar) " +
      "sem os atalhos por ficha de editar, remover e listar (use editar_lancamento, " +
      "remover_lancamento e listar_lancamentos) e sem as calculadoras avulsas.",
    inclui: (f) => !f.atalho && f.grupo !== "calculadoras",
  },
  consulta: {
    nome: "consulta",
    descricao:
      "Só leitura e cálculo: abre, lista, valida, simula e orienta, sem nenhuma ferramenta que grave.",
    inclui: (f) => !f.escreve && !f.atalho,
  },
});

export function ehNomePerfil(nome: string): nome is NomePerfil {
  return (NOMES_PERFIS as readonly string[]).includes(nome);
}

/** Perfil pelo nome; padrão `completo`. Nome desconhecido lança erro com os nomes válidos. */
export function perfilPorNome(nome: string | undefined): Perfil {
  const n = nome ?? "completo";
  if (ehNomePerfil(n)) return PERFIS[n];
  throw new EntradaInvalidaError(
    `perfil desconhecido "${n}"; use ${NOMES_PERFIS.slice(0, -1).join(", ")} ou ${NOMES_PERFIS[NOMES_PERFIS.length - 1]}`,
  );
}

/**
 * Regra única de registro, usada pelo servidor e pelo catálogo: o modo somente leitura tira o que
 * grava e o perfil decide o resto.
 */
export function deveRegistrar(
  perfil: Perfil,
  somenteLeitura: boolean,
  info: InfoFerramenta,
): boolean {
  if (info.escreve && somenteLeitura) return false;
  return perfil.inclui(info);
}

/** Monta a `InfoFerramenta` a partir das marcas da definição. */
export function infoFerramenta(
  nome: string,
  grupo: NomeGrupo,
  def: { readonly escreve?: boolean; readonly atalho?: boolean },
): InfoFerramenta {
  return { nome, grupo, escreve: def.escreve ?? false, atalho: def.atalho ?? false };
}
