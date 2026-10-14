/**
 * Apoio dos testes do codec: um leiaute mínimo escrito à mão e uma declaração sintética
 * montada com o leiaute 2026. Todos os dados são fictícios.
 */
import {
  criarRegistro,
  LEIAUTE_2026,
  type Leiaute,
  type Registro,
  recalcularControles,
} from "../../src/dbk/index.js";

/** Leiaute mínimo: header `IR`, um detalhe `10` e o fechamento `T9`. */
export const MINI: Leiaute = {
  exercicio: 2026,
  tamanhoTipo: 2,
  tipos: [
    {
      id: "IR",
      descricao: "Header",
      tamanho: 32,
      campos: [
        { nome: "SISTEMA", chave: "SISTEMA", formato: "C", tamanho: 8, inicio: 1, descricao: "" },
        {
          nome: "EXERCICIO",
          chave: "EXERCICIO",
          formato: "N",
          tamanho: 4,
          inicio: 9,
          descricao: "",
        },
        { nome: "NR_HASH", chave: "NR_HASH", formato: "N", tamanho: 10, inicio: 13, descricao: "" },
        {
          nome: "NR_CONTROLE",
          chave: "NR_CONTROLE",
          formato: "N",
          tamanho: 10,
          inicio: 23,
          descricao: "",
        },
      ],
    },
    {
      id: "10",
      descricao: "Detalhe",
      tamanho: 43,
      campos: [
        { nome: "NR_REG", chave: "NR_REG", formato: "N", tamanho: 2, inicio: 1, descricao: "" },
        { nome: "NM_NOME", chave: "NM_NOME", formato: "A", tamanho: 10, inicio: 3, descricao: "" },
        {
          nome: "VR_VALOR",
          chave: "VR_VALOR",
          formato: "N",
          tamanho: 5,
          inicio: 13,
          decimais: 2,
          descricao: "",
        },
        {
          nome: "DT_EVENTO",
          chave: "DT_EVENTO",
          formato: "N",
          tamanho: 8,
          inicio: 18,
          data: "DDMMAAAA",
          descricao: "",
        },
        { nome: "IN_X", chave: "IN_X", formato: "I", tamanho: 1, inicio: 26, descricao: "" },
        { nome: "FILLER", chave: "FILLER", formato: "C", tamanho: 7, inicio: 27, descricao: "" },
        {
          nome: "NR_CONTROLE",
          chave: "NR_CONTROLE",
          formato: "N",
          tamanho: 10,
          inicio: 34,
          descricao: "",
        },
      ],
    },
    {
      id: "T9",
      descricao: "Fechamento",
      tamanho: 28,
      campos: [
        { nome: "NR_REG", chave: "NR_REG", formato: "C", tamanho: 2, inicio: 1, descricao: "" },
        { nome: "QT_TOTAL", chave: "QT_TOTAL", formato: "N", tamanho: 6, inicio: 3, descricao: "" },
        { nome: "QT_R10", chave: "QT_R10", formato: "N", tamanho: 5, inicio: 9, descricao: "" },
        { nome: "Filler", chave: "Filler", formato: "N", tamanho: 5, inicio: 14, descricao: "" },
        {
          nome: "NR_CONTROLE",
          chave: "NR_CONTROLE",
          formato: "N",
          tamanho: 10,
          inicio: 19,
          descricao: "",
        },
      ],
    },
  ],
};

/** CPF sintético com DV válido, usado em material de teste público. */
export const CPF_TESTE = "52998224725";

/** Declaração sintética do exercício 2026 com controles recalculados. */
export function declaracaoSintetica(): Registro[] {
  const L = LEIAUTE_2026;
  const ir = criarRegistro(L, "IR", {
    SISTEMA: "IRPF",
    EXERCICIO: 2026n,
    ANO_BASE: 2025n,
    CODIGO_RECNET: 3300n,
    IN_RETIFICADORA: "0",
    NR_CPF: CPF_TESTE,
    TIPO_NI: 1n,
    NR_VERSAO: 100n,
    NM_NOME: "FULANA DE TESTE SINTÉTICA",
    SG_UF: "SP",
    DT_NASCIM: "15061980",
    IN_COMPLETA: "S",
    VR_IMPDEVIDO: 1234567n,
  });
  const identificacao = criarRegistro(L, "16", {
    NR_CPF: CPF_TESTE,
    NM_NOME: "FULANA DE TESTE SINTÉTICA",
    NM_LOGRA: "RUA DAS ACÁCIAS",
    NR_NUMERO: "100",
    NM_BAIRRO: "JARDIM AÇAÍ",
    NR_CEP: "01001000",
    CD_MUNICIP: 7107n,
    NM_MUNICIP: "SÃO PAULO",
    SG_UF: "SP",
  });
  const rendimento = (cnpj: string, nome: string, valor: bigint): Registro =>
    criarRegistro(L, "21", {
      NR_CPF: CPF_TESTE,
      NR_PAGADOR: cnpj,
      NM_PAGADOR: nome,
      VR_RENDTO: valor,
      VR_CONTRIB: 98765n,
      VR_DECTERC: 400000n,
      VR_IMPOSTO: 55555n,
    });
  const fechamento = criarRegistro(L, "T9", { NR_CPF: CPF_TESTE });
  return recalcularControles([
    ir,
    identificacao,
    rendimento("11222333000181", "EMPRESA FICTÍCIA LTDA", 6543210n),
    rendimento("11444777000161", "OUTRA FONTE SINTÉTICA SA", 100n),
    fechamento,
  ]);
}
