/**
 * Regras do Resumo: conta para restituição ou débito, Pix, débito automático
 * e quotas (nota 01 P-PARCEL e P-DEBITO; nota 05 F-RESUMO-QUOTAS e
 * F-RESUMO-BANCO).
 */
import { buscarCodigo } from "../../tabelas/index.js";
import { validarContaBancaria } from "../conta-bancaria.js";
import { type Pendencia, pendencia, regra } from "../pendencia.js";
import type { Contexto } from "../util.js";

export const RES_CONTA = regra({
  codigo: "RES-CONTA",
  gravidade: "erro",
  ficha: "resumo",
  descricao: "Banco da rede autorizada (tabela bancos), agência e conta numéricas.",
  fonte: "Nota 05 F-RESUMO-BANCO; tabela bancos.json; Ajuda pág. 252",
});
export const RES_CONTA_AVISO = regra({
  codigo: "RES-CONTA-AVISO",
  gravidade: "aviso",
  ficha: "resumo",
  descricao: "Tamanho de agência e conta e DV conferidos com os parâmetros do banco.",
  fonte:
    "Tabela bancos-calculo-dv.json (interpretação inferida); algoritmos públicos de DV dos bancos",
});
export const RES_DEBITO = regra({
  codigo: "RES-DEBITO",
  gravidade: "erro",
  ficha: "resumo",
  descricao:
    "Débito automático exige conta corrente informada (Pix e poupança só servem à restituição).",
  fonte: "Nota 05 F-RESUMO-QUOTAS e F-RESUMO-BANCO; nota 01 P-DEBITO",
});
export const RES_DEBITO_CONVENIO = regra({
  codigo: "RES-DEBITO-CONVENIO",
  gravidade: "aviso",
  ficha: "resumo",
  descricao:
    "Banco possivelmente sem convênio de débito automático (indicador COL4 = N da tabela).",
  fonte: "Tabela bancos.json, coluna 4 (interpretação não confirmada, ver README das tabelas)",
});
export const RES_RESTITUICAO = regra({
  codigo: "RES-RESTITUICAO",
  gravidade: "aviso",
  ficha: "resumo",
  descricao: "Sem conta nem Pix, a restituição fica disponível no Banco do Brasil para resgate.",
  fonte: "Nota 05 F-RESUMO-BANCO",
});
export const RES_QUOTAS = regra({
  codigo: "RES-QUOTAS",
  gravidade: "erro",
  ficha: "resumo",
  descricao: "Imposto abaixo de R$ 100,00 em quota única; cada quota com no mínimo R$ 50,00.",
  fonte: "Nota 01 P-PARCEL; nota 05 F-RESUMO-QUOTAS; Ajuda pág. 34",
});

export const REGRAS_RESUMO = [
  RES_CONTA,
  RES_CONTA_AVISO,
  RES_DEBITO,
  RES_DEBITO_CONVENIO,
  RES_RESTITUICAO,
  RES_QUOTAS,
];

/** Quota mínima (R$ 50,00) e imposto mínimo para parcelar (R$ 100,00). */
const QUOTA_MINIMA = 5000n;
const MINIMO_PARCELAMENTO = 10000n;

export function validarResumo(ctx: Contexto): Pendencia[] {
  const { resumo, resumoCalculado } = ctx.declaracao;
  const out: Pendencia[] = [];
  const conta = resumo.conta;

  if (conta) {
    for (const p of validarContaBancaria(conta, "bancos")) {
      out.push(
        pendencia(
          p.gravidade === "erro" ? RES_CONTA : RES_CONTA_AVISO,
          `resumo.conta.${p.campo}`,
          p.mensagem,
        ),
      );
    }
  }
  if (resumo.debitoAutomatico) {
    if (conta?.tipo !== "corrente") {
      out.push(
        pendencia(
          RES_DEBITO,
          "resumo.conta",
          "Débito automático exige conta corrente de titularidade do declarante.",
        ),
      );
    } else if (buscarCodigo("bancos", conta.banco)?.indicadores.COL4 === "N") {
      out.push(
        pendencia(
          RES_DEBITO_CONVENIO,
          "resumo.conta.banco",
          `Confira se o banco ${conta.banco} oferece débito automático das quotas.`,
        ),
      );
    }
  }
  // Sem resumo calculado, presume-se que pode haver restituição.
  const podeRestituir = (resumoCalculado?.impostoARestituir ?? 1n) > 0n;
  if (!conta && !resumo.pix && podeRestituir) {
    out.push(
      pendencia(
        RES_RESTITUICAO,
        "resumo.conta",
        "Informe uma conta ou a chave Pix (CPF) para receber a restituição.",
      ),
    );
  }
  if (resumoCalculado && resumo.quotas > 1) {
    const imposto = resumoCalculado.impostoAPagar;
    if (imposto < MINIMO_PARCELAMENTO) {
      out.push(
        pendencia(
          RES_QUOTAS,
          "resumo.quotas",
          "Imposto a pagar abaixo de R$ 100,00 deve ser pago em quota única.",
        ),
      );
    } else if (imposto / BigInt(resumo.quotas) < QUOTA_MINIMA) {
      out.push(
        pendencia(
          RES_QUOTAS,
          "resumo.quotas",
          "Cada quota deve ter no mínimo R$ 50,00; reduza o número de quotas.",
        ),
      );
    }
  }
  return out;
}
