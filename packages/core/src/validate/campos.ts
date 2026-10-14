/**
 * Validação de campos isolados que o programa oficial confere na digitação: CPF, CNPJ,
 * número do recibo, CEP, telefone, e-mail, nome, data, Renavam e conta bancária.
 *
 * Fontes: Ajuda do PGD IRPF 2026, págs. 42 a 45 (Identificação), 181 a 184 (Bens e
 * Direitos), 252 (Informações Bancárias) e 383 (recibo); nota de mapeamento 02
 * (F-IDENT-*), 05 (F-BENS-DADOS, F-RESUMO-BANCO) e 07 (S-RECIBO). O DV do Renavam segue o
 * algoritmo público do Denatran (módulo 11, pesos 3298765432). Nada aqui consulta base
 * externa: o resultado diz só se o formato e o dígito verificador estão corretos.
 */
import { validarContaBancaria } from "./conta-bancaria.js";
import { somenteDigitos, validarCnpj, validarCpf } from "./documento.js";
import { emailValido, problemaNome } from "./util.js";

export const TIPOS_CAMPO = [
  "cpf",
  "cnpj",
  "recibo",
  "cep",
  "telefone",
  "email",
  "nome",
  "data",
  "renavam",
  "conta_bancaria",
] as const;
export type TipoCampo = (typeof TIPOS_CAMPO)[number];

export interface ResultadoCampo {
  readonly tipo: TipoCampo;
  readonly valido: boolean;
  readonly normalizado: string;
  readonly mensagem: string;
}

export interface ComplementoConta {
  readonly banco?: string | undefined;
  readonly agencia?: string | undefined;
  /** `bancos` (restituição e débito, padrão) ou `bancos-bens` (ficha Bens e Direitos). */
  readonly tabela?: "bancos" | "bancos-bens" | undefined;
}

const PESOS_RENAVAM = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/** DV do Renavam a partir dos 10 primeiros dígitos: (soma ponderada x 10) mod 11; 10 vira 0. */
export function dvRenavam(base10: string): string {
  if (!/^\d{10}$/.test(base10)) throw new Error("Base do Renavam exige 10 dígitos");
  let soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(base10[i]) * (PESOS_RENAVAM[i] ?? 0);
  const dv = (soma * 10) % 11;
  return String(dv === 10 ? 0 : dv);
}

function res(tipo: TipoCampo, valido: boolean, normalizado: string, mensagem: string) {
  return { tipo, valido, normalizado, mensagem };
}

function dataIso(texto: string): string | undefined {
  const t = texto.trim();
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t);
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  const [a, m, d] = br ? [br[3], br[2], br[1]] : iso ? [iso[1], iso[2], iso[3]] : [];
  if (!a || !m || !d) return undefined;
  const data = new Date(Date.UTC(Number(a), Number(m) - 1, Number(d)));
  const ok =
    data.getUTCFullYear() === Number(a) &&
    data.getUTCMonth() === Number(m) - 1 &&
    data.getUTCDate() === Number(d);
  return ok ? `${a}-${m}-${d}` : undefined;
}

/** Valida um campo isolado pelo tipo informado. */
export function validarCampo(
  tipo: TipoCampo,
  valor: string,
  complemento: ComplementoConta = {},
): ResultadoCampo {
  const dig = somenteDigitos(valor).replace(/[()]/g, "");
  switch (tipo) {
    case "cpf": {
      const ok = validarCpf(dig);
      return res(tipo, ok, dig, ok ? "CPF válido." : "CPF inválido: confira os 11 dígitos e o DV.");
    }
    case "cnpj": {
      const ok = validarCnpj(dig);
      return res(tipo, ok, dig, ok ? "CNPJ válido." : "CNPJ inválido: confira os 14 dígitos e o DV.");
    }
    case "recibo": {
      const ok = /^\d{12}$/.test(dig) && !/^0+$/.test(dig);
      return res(
        tipo,
        ok,
        dig,
        ok
          ? "Número do recibo com 12 dígitos."
          : "O número do recibo tem 12 dígitos (os 10 do número e os 2 de controle).",
      );
    }
    case "cep": {
      const ok = /^\d{8}$/.test(dig) && !/^0+$/.test(dig);
      return res(tipo, ok, dig, ok ? "CEP com 8 dígitos." : "O CEP tem 8 dígitos.");
    }
    case "telefone": {
      const ok = /^[1-9]{2}\d{8,9}$/.test(dig);
      return res(
        tipo,
        ok,
        dig,
        ok
          ? "Telefone com DDD válido."
          : "Informe o DDD com 2 dígitos (sem zero) e o número com 8 ou 9 dígitos.",
      );
    }
    case "email": {
      const e = valor.trim();
      const ok = emailValido(e);
      return res(tipo, ok, e, ok ? "E-mail em formato válido." : "E-mail em formato inválido.");
    }
    case "nome": {
      const n = valor.trim().replace(/\s+/g, " ");
      const problema = problemaNome(n);
      return res(tipo, problema === undefined, n, problema ?? "Nome conforme as regras do programa.");
    }
    case "data": {
      const iso = dataIso(valor);
      return res(
        tipo,
        iso !== undefined,
        iso ?? valor.trim(),
        iso ? "Data válida." : "Data inválida: use dd/mm/aaaa com dia, mês e ano existentes.",
      );
    }
    case "renavam": {
      const r = /^\d{9,11}$/.test(dig) ? dig.padStart(11, "0") : dig;
      const ok = /^\d{11}$/.test(r) && !/^0+$/.test(r) && dvRenavam(r.slice(0, 10)) === r[10];
      return res(tipo, ok, r, ok ? "Renavam válido." : "Renavam inválido: confira os dígitos e o DV.");
    }
    case "conta_bancaria": {
      const banco = somenteDigitos(complemento.banco ?? "").padStart(3, "0");
      const agencia = somenteDigitos(complemento.agencia ?? "");
      if (!complemento.banco || !agencia) {
        return res(tipo, false, valor.trim(), "Informe também o banco e agência da conta.");
      }
      const m = /^(\d+)(?:[-\s]?([0-9xXpP]))?$/.exec(valor.trim().replace(/\./g, ""));
      const temDv = /[-\s]/.test(valor.trim());
      const conta = m ? (temDv ? (m[1] ?? "") : (m[1] ?? "") + (m[2] ?? "")) : "";
      const dv = m && temDv ? m[2] : undefined;
      const problemas = validarContaBancaria(
        { banco, agencia, conta, ...(dv !== undefined ? { dv } : {}) },
        complemento.tabela ?? "bancos",
      );
      const normalizado = `${banco}/${agencia}/${conta}${dv ? `-${dv.toUpperCase()}` : ""}`;
      if (!m) return res(tipo, false, valor.trim(), "Número da conta inválido.");
      return res(
        tipo,
        problemas.length === 0,
        normalizado,
        problemas.length === 0
          ? "Conta bancária conforme o banco e a regra pública de DV."
          : problemas.map((p) => p.mensagem).join(" "),
      );
    }
  }
}
