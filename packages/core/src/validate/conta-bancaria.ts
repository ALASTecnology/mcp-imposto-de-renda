/**
 * Validação de conta bancária (restituição, débito automático e contas da
 * ficha Bens e Direitos).
 *
 * Fontes: tabelas `bancos.json` (rede arrecadadora), `bancos-bens.json` e
 * `bancos-calculo-dv.json` (lib/resources do programa). Os parâmetros COL3 e
 * COL4 desta última são lidos como tamanho da agência e tamanho máximo da
 * conta sem DV (interpretação inferida, por isso só gera aviso). O DV é
 * conferido com os algoritmos públicos divulgados pelos próprios bancos para
 * Banco do Brasil, Bradesco e Itaú; também só gera aviso, pois o algoritmo
 * usado pelo programa oficial não está documentado.
 */
import { buscarCodigo } from "../tabelas/index.js";
import type { Gravidade } from "./pendencia.js";

export interface ContaParaValidar {
  readonly banco: string;
  readonly agencia: string;
  readonly conta: string;
  readonly dv?: string | undefined;
}

export interface ProblemaConta {
  readonly campo: "banco" | "agencia" | "conta" | "dv";
  readonly gravidade: Gravidade;
  readonly mensagem: string;
}

function semZerosEsquerda(texto: string): string {
  return texto.replace(/^0+(?=\d)/, "");
}

/** DV da conta do Banco do Brasil: módulo 11, pesos 9 a 2 em 8 dígitos; 10 vira X. */
export function dvContaBancoDoBrasil(conta: string): string {
  const d = conta.padStart(8, "0").slice(-8);
  let soma = 0;
  for (let i = 0; i < 8; i++) soma += Number(d[i]) * (9 - i);
  const resto = 11 - (soma % 11);
  return resto === 10 ? "X" : resto === 11 ? "0" : String(resto);
}

/** DV da conta do Bradesco: módulo 11, pesos 2 a 7 da direita; resto 1 vira P, resto 0 vira 0. */
export function dvContaBradesco(conta: string): string {
  const d = conta.padStart(7, "0").slice(-7);
  let soma = 0;
  let peso = 2;
  for (let i = d.length - 1; i >= 0; i--) {
    soma += Number(d[i]) * peso;
    peso = peso === 7 ? 2 : peso + 1;
  }
  const resto = soma % 11;
  return resto === 0 ? "0" : resto === 1 ? "P" : String(11 - resto);
}

/** DV da conta do Itaú: módulo 10 sobre agência (4) e conta (5), pesos 2 e 1 alternados. */
export function dvContaItau(agencia: string, conta: string): string {
  const d = `${agencia.padStart(4, "0")}${conta.padStart(5, "0").slice(-5)}`;
  let soma = 0;
  for (let i = 0; i < d.length; i++) {
    const produto = Number(d[i]) * (i % 2 === 0 ? 2 : 1);
    soma += produto > 9 ? produto - 9 : produto;
  }
  return String((10 - (soma % 10)) % 10);
}

function dvEsperado(banco: string, agencia: string, conta: string): string | undefined {
  switch (banco) {
    case "001":
      return dvContaBancoDoBrasil(conta);
    case "237":
      return dvContaBradesco(conta);
    case "341":
      return dvContaItau(agencia, conta);
    default:
      return undefined;
  }
}

/**
 * Valida banco, agência, conta e DV. `tabela` indica a lista de bancos aceita:
 * `bancos` (restituição e débito automático) ou `bancos-bens` (Bens e Direitos).
 */
export function validarContaBancaria(
  c: ContaParaValidar,
  tabela: "bancos" | "bancos-bens",
): ProblemaConta[] {
  const problemas: ProblemaConta[] = [];
  if (!buscarCodigo(tabela, c.banco)) {
    const onde = tabela === "bancos" ? "na rede autorizada para restituição e débito" : "na tabela";
    problemas.push({
      campo: "banco",
      gravidade: "erro",
      mensagem: `Banco ${c.banco} não consta ${onde}.`,
    });
    return problemas;
  }
  if (!/^\d+$/.test(c.agencia)) {
    problemas.push({
      campo: "agencia",
      gravidade: "erro",
      mensagem: "Agência deve ter só dígitos.",
    });
  }
  if (!/^\d+$/.test(c.conta) || /^0+$/.test(c.conta)) {
    problemas.push({ campo: "conta", gravidade: "erro", mensagem: "Número da conta inválido." });
  }
  if (problemas.length > 0) return problemas;

  const parametros = buscarCodigo("bancos-calculo-dv", c.banco)?.parametrosDV;
  if (parametros) {
    const tamAgencia = Number(parametros.COL3);
    const tamConta = Number(parametros.COL4);
    if (semZerosEsquerda(c.agencia).length > tamAgencia) {
      problemas.push({
        campo: "agencia",
        gravidade: "aviso",
        mensagem: `A agência do banco ${c.banco} costuma ter até ${tamAgencia} dígitos; confira.`,
      });
    }
    if (semZerosEsquerda(c.conta).length > tamConta) {
      problemas.push({
        campo: "conta",
        gravidade: "aviso",
        mensagem: `A conta do banco ${c.banco} costuma ter até ${tamConta} dígitos sem o DV; confira.`,
      });
    }
  }
  const esperado = dvEsperado(c.banco, c.agencia, c.conta);
  if (esperado !== undefined && c.dv !== undefined && c.dv.toUpperCase() !== esperado) {
    problemas.push({
      campo: "dv",
      gravidade: "aviso",
      mensagem: `O DV ${c.dv} não confere com o cálculo público do banco ${c.banco}; confira a conta.`,
    });
  }
  return problemas;
}
