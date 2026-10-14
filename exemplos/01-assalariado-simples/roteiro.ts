/**
 * Exemplo 1: assalariado com um único empregador, poupança e aplicação financeira.
 * Todos os dados são fictícios; CPF e CNPJ saem do gerador determinístico.
 */
import { cnpj, cpf } from "../documentos.js";
import type { Roteiro } from "../executar.js";

const TITULAR = cpf(101);
const EMPREGADOR = cnpj(201);
const BANCO = cnpj(202);
const ARQUIVO = `${TITULAR}-IRPF-A-2026-2025-ORIGI.DBK`;

/** Mesmos dados da declaração, no formato de entrada das ferramentas de cálculo. */
const ENTRADA_CALCULO = {
  titular: { cpf: TITULAR, nome: "ANA FICTICIA EXEMPLO", nascimento: "1990-07-14" },
  rendimentosPJ: [
    {
      cnpj: EMPREGADOR,
      nome: "EMPRESA FICTICIA DE SOFTWARE LTDA",
      rendimento: "96.000,00",
      previdenciaOficial: "9.840,00",
      irrf: "11.400,00",
      decimoTerceiro: "8.000,00",
      irrfDecimoTerceiro: "652,30",
    },
  ],
  rendimentosIsentos: [{ codigo: "12", valor: "318,77" }],
  tributacaoExclusiva: [{ codigo: "06", valor: "1.146,20" }],
};

export const roteiro: Roteiro = {
  titulo: "assalariado simples",
  passos: [
    {
      pedido:
        "Quero começar minha declaração de 2026 do zero. Sou Ana Fictícia Exemplo, CPF " +
        `${TITULAR}, nascida em 14/07/1990, analista de sistemas numa empresa privada, moro em ` +
        "São Paulo (Rua das Palmeiras Fictícias, 100, Centro, CEP 01001-000).",
      chamadas: [
        {
          ferramenta: "criar_declaracao",
          argumentos: {
            identificacao: {
              cpf: TITULAR,
              nome: "ANA FICTICIA EXEMPLO",
              dataNascimento: "1990-07-14",
              tipoDeclaracao: { tipo: "ajusteAnual" },
              racaCor: "4",
              conjuge: { possui: false },
              endereco: {
                local: "brasil",
                tipoLogradouro: "RUA",
                logradouro: "DAS PALMEIRAS FICTICIAS",
                numero: "100",
                bairro: "CENTRO",
                uf: "SP",
                municipio: "7107",
                cep: "01001000",
              },
              ocupacao: { natureza: "01", ocupacaoPrincipal: "212" },
            },
          },
        },
      ],
    },
    {
      pedido:
        "Este é o meu informe de rendimentos da empresa: rendimentos tributáveis R$ 96.000,00, " +
        "previdência oficial R$ 9.840,00, imposto retido R$ 11.400,00, 13º salário R$ 8.000,00 " +
        "com IRRF de R$ 652,30.",
      chamadas: [
        {
          ferramenta: "adicionar_rendimento_pj",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              beneficiario: { tipo: "titular" },
              fonte: { ni: EMPREGADOR, nome: "EMPRESA FICTICIA DE SOFTWARE LTDA" },
              rendimentos: "96.000,00",
              contribuicaoPrevidenciaria: "9.840,00",
              impostoRetido: "11.400,00",
              decimoTerceiro: "8.000,00",
              impostoRetidoDecimoTerceiro: "652,30",
            },
          },
        },
      ],
    },
    {
      pedido:
        "No informe do banco aparecem R$ 318,77 de rendimento da poupança e R$ 1.146,20 de " +
        "rendimento de um CDB. Tenho conta corrente com R$ 2.180,00 em 31/12/2024 e " +
        "R$ 3.405,50 em 31/12/2025, e a poupança passou de R$ 5.000,00 para R$ 8.318,77.",
      chamadas: [
        {
          ferramenta: "adicionar_rendimento_isento",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "12",
              beneficiario: { tipo: "titular" },
              fonte: { ni: BANCO, nome: "BANCO FICTICIO S.A." },
              valor: "318,77",
            },
          },
        },
        {
          ferramenta: "adicionar_rendimento_exclusivo",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "06",
              beneficiario: { tipo: "titular" },
              fonte: { ni: BANCO, nome: "BANCO FICTICIO S.A." },
              valor: "1.146,20",
            },
          },
        },
        {
          ferramenta: "adicionar_bem",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              grupo: "06",
              codigo: "01",
              discriminacao: "CONTA CORRENTE NO BANCO FICTICIO S.A.",
              situacaoAnterior: "2.180,00",
              situacaoAtual: "3.405,50",
              ni: BANCO,
              conta: { banco: "001", agencia: "1234", conta: "56789", dv: "2" },
            },
          },
        },
        {
          ferramenta: "adicionar_bem",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              grupo: "04",
              codigo: "01",
              discriminacao: "CADERNETA DE POUPANCA NO BANCO FICTICIO S.A.",
              situacaoAnterior: "5.000,00",
              situacaoAtual: "8.318,77",
              ni: BANCO,
              conta: { banco: "001", agencia: "1234", conta: "98765", dv: "4" },
            },
          },
        },
      ],
    },
    {
      pedido: "Tem alguma pendência na declaração?",
      chamadas: [{ ferramenta: "validar_declaracao", argumentos: { arquivo: ARQUIVO } }],
    },
    {
      pedido: "Qual modelo é melhor para mim? Me mostre a conta.",
      chamadas: [
        {
          ferramenta: "definir_opcao_tributacao",
          argumentos: { arquivo: ARQUIVO, opcao: "simplificada" },
          calculo: true,
        },
        { ferramenta: "explicar_calculo", argumentos: ENTRADA_CALCULO, calculo: true },
      ],
    },
    {
      pedido: "Quero receber a restituição por Pix na chave do meu CPF.",
      chamadas: [
        {
          ferramenta: "definir_informacoes_bancarias",
          argumentos: { arquivo: ARQUIVO, pix: true },
        },
      ],
    },
    {
      pedido: "Confira o arquivo e me diga como entregar.",
      chamadas: [
        { ferramenta: "verificar_integridade_arquivo", argumentos: { arquivo: ARQUIVO } },
        {
          ferramenta: "gerar_relatorio_declaracao",
          argumentos: { arquivo: ARQUIVO },
          calculo: true,
        },
        { ferramenta: "instruir_transmissao", argumentos: { arquivo: ARQUIVO } },
      ],
    },
  ],
};
