/** Funções de apoio às regras de validação. */
import type { Beneficiario } from "../model/comum.js";
import type { Declaracao } from "../model/declaracao.js";
import { validarCnpj, validarCpf } from "./documento.js";

/** Data de referência das idades e limites: 31/12 do ano-calendário. */
export const FIM_ANO_CALENDARIO = "2025-12-31";
export const INICIO_ANO_CALENDARIO = "2025-01-01";

/** Confere o DV de um CPF (11 dígitos) ou CNPJ (14 dígitos). */
export function niValido(ni: string): boolean {
  return ni.length === 11 ? validarCpf(ni) : ni.length === 14 ? validarCnpj(ni) : false;
}

/** Idade completa em anos numa data de referência (datas ISO). */
export function idadeEm(nascimento: string, referencia: string): number {
  const [an, mn, dn] = nascimento.split("-").map(Number) as [number, number, number];
  const [ar, mr, dr] = referencia.split("-").map(Number) as [number, number, number];
  let idade = ar - an;
  if (mr < mn || (mr === mn && dr < dn)) idade--;
  return idade;
}

/** Remove acentos e padroniza caixa para comparar nomes. */
export function normalizarTexto(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toUpperCase();
}

/**
 * Verdadeiro se o texto só tem caracteres imprimíveis do ISO-8859-1, o conjunto que o arquivo
 * da declaração grava: ASCII de 0x20 a 0x7E e a faixa acentuada de 0xA1 a 0xFF, menos o hífen
 * suave (0xAD), que é invisível. Ficam de fora controles (inclusive TAB e quebras de linha),
 * espaço sem quebra (0xA0), caracteres de largura zero, de controle de direção (bidi), BOM e
 * qualquer caractere acima de 0xFF.
 */
export function caracteresDeNomeValidos(texto: string): boolean {
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    const imprimivel = (c >= 0x20 && c <= 0x7e) || (c >= 0xa1 && c <= 0xff && c !== 0xad);
    if (!imprimivel) return false;
  }
  return true;
}

/**
 * Regras de nome da Ajuda (pág. 43, nota 02 F-IDENT-NOME): de 1 a 15 partes;
 * nenhuma parte com mais de 20 caracteres; proibidos 3 caracteres iguais e
 * consecutivos, exceto o numeral romano "III" na última parte. Devolve a
 * mensagem do problema ou `undefined` se o nome está correto.
 */
export function problemaNome(nome: string): string | undefined {
  // Primeiro o conjunto de caracteres, e sem repetir o nome na mensagem: um caractere de
  // controle de direção (bidi) ecoado faria a mensagem exibir outro texto.
  if (!caracteresDeNomeValidos(nome)) {
    return "O nome tem caractere invisível, de controle ou fora do conjunto aceito pelo programa (ISO-8859-1 imprimível).";
  }
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0 || partes.length > 15) return "O nome deve ter de 1 a 15 partes.";
  const longa = partes.find((p) => p.length > 20);
  if (longa) return `A parte "${longa}" do nome tem mais de 20 caracteres.`;
  for (let i = 0; i < partes.length; i++) {
    const parte = partes[i] ?? "";
    const ultimaRomana = i === partes.length - 1 && parte.toUpperCase() === "III";
    if (!ultimaRomana && /(.)\1\1/i.test(parte)) {
      return `A parte "${parte}" do nome tem 3 caracteres iguais seguidos.`;
    }
  }
  return undefined;
}

/** Formato básico de e-mail (usuário@domínio.tld), sem espaços. */
export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Índices auxiliares da declaração usados por várias regras. */
export interface Contexto {
  readonly declaracao: Declaracao;
  readonly cpfsDependentes: ReadonlySet<string>;
  readonly cpfsAlimentandos: ReadonlySet<string>;
}

export function criarContexto(declaracao: Declaracao): Contexto {
  return {
    declaracao,
    cpfsDependentes: new Set(declaracao.dependentes.map((d) => d.cpf)),
    cpfsAlimentandos: new Set(declaracao.alimentandos.map((a) => a.cpf)),
  };
}

/** Verdadeiro se o beneficiário é o titular ou um dependente cadastrado. */
export function beneficiarioExiste(ctx: Contexto, b: Beneficiario): boolean {
  return b.tipo === "titular" || ctx.cpfsDependentes.has(b.cpf);
}
