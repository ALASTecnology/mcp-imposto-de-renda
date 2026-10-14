/**
 * Exemplo 3: aposentado com mais de 65 anos que recebe do INSS e de um fundo de pensão. As duas
 * fontes informaram a parcela isenta inteira, e o limite é por pessoa: o excedente volta a ser
 * tributável. Todos os dados são fictícios; CPF e CNPJ saem do gerador determinístico.
 */
import { cnpj, cpf } from "../documentos.js";
import type { Roteiro } from "../executar.js";

const TITULAR = cpf(121);
const INSS = cnpj(221);
const FUNDO = cnpj(222);
const OPERADORA = cnpj(223);
const FISIOTERAPIA = cnpj(224);
const BANCO = cnpj(225);
const ARQUIVO = `${TITULAR}-IRPF-A-2026-2025-ORIGI.DBK`;

/** Mesmos dados da declaração depois da transferência do excedente, para o cálculo explicado. */
const ENTRADA_CALCULO = {
  titular: { cpf: TITULAR, nome: "JOSE FICTICIO EXEMPLO", nascimento: "1954-02-17" },
  rendimentosPJ: [
    {
      cnpj: INSS,
      nome: "INSTITUTO FICTICIO DE PREVIDENCIA",
      rendimento: "39.552,24",
      irrf: "1.032,48",
      decimoTerceiro: "3.296,02",
      irrfDecimoTerceiro: "86,04",
    },
    {
      cnpj: FUNDO,
      nome: "FUNDO DE PENSAO FICTICIO",
      rendimento: "48.000,00",
      irrf: "1.890,00",
      decimoTerceiro: "2.096,02",
      irrfDecimoTerceiro: "157,20",
    },
  ],
  rendimentosIsentos: [
    { codigo: "10", valor: "24.751,74" },
    { codigo: "12", valor: "1.204,55" },
  ],
  pagamentos: [
    { codigo: "26", cpfCnpj: OPERADORA, valor: "11.640,00" },
    { codigo: "13", cpfCnpj: FISIOTERAPIA, valor: "3.200,00" },
  ],
};

export const roteiro: Roteiro = {
  titulo: "aposentado com mais de 65 anos",
  passos: [
    {
      pedido:
        "Sou aposentado, José Fictício Exemplo, CPF " +
        `${TITULAR}, nascido em 17/02/1954, moro em Belo Horizonte (Rua dos Ipês ` +
        "Fictícios, 45, Santa Tereza, CEP 31010-000). Crie a declaração.",
      chamadas: [
        {
          ferramenta: "criar_declaracao",
          argumentos: {
            identificacao: {
              cpf: TITULAR,
              nome: "JOSE FICTICIO EXEMPLO",
              dataNascimento: "1954-02-17",
              tipoDeclaracao: { tipo: "ajusteAnual" },
              racaCor: "4",
              conjuge: { possui: false },
              endereco: {
                local: "brasil",
                tipoLogradouro: "RUA",
                logradouro: "DOS IPES FICTICIOS",
                numero: "45",
                bairro: "SANTA TEREZA",
                uf: "MG",
                municipio: "4123",
                cep: "31010000",
              },
              ocupacao: { natureza: "61" },
            },
          },
        },
      ],
    },
    {
      pedido:
        "Recebo aposentadoria do INSS: o informe traz R$ 39.552,24 tributáveis com IRRF de " +
        "R$ 1.032,48, parcela isenta de 65 anos de R$ 22.847,76 e 13º de R$ 5.200,00 " +
        "(R$ 1.903,98 isentos, IRRF R$ 86,04).",
      chamadas: [
        {
          ferramenta: "adicionar_rendimento_pj",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              beneficiario: { tipo: "titular" },
              fonte: { ni: INSS, nome: "INSTITUTO FICTICIO DE PREVIDENCIA" },
              rendimentos: "39.552,24",
              impostoRetido: "1.032,48",
              decimoTerceiro: "3.296,02",
              impostoRetidoDecimoTerceiro: "86,04",
            },
          },
        },
        {
          ferramenta: "adicionar_rendimento_isento",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "10",
              beneficiario: { tipo: "titular" },
              fonte: { ni: INSS, nome: "INSTITUTO FICTICIO DE PREVIDENCIA" },
              valor: "22.847,76",
              decimoTerceiro: "1.903,98",
            },
          },
        },
      ],
    },
    {
      pedido:
        "Também recebo do fundo de pensão: R$ 25.152,24 tributáveis, IRRF R$ 1.890,00, " +
        "parcela isenta de R$ 22.847,76 e 13º de R$ 4.000,00 (R$ 1.903,98 isentos, IRRF " +
        "R$ 157,20).",
      chamadas: [
        {
          ferramenta: "adicionar_rendimento_pj",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              beneficiario: { tipo: "titular" },
              fonte: { ni: FUNDO, nome: "FUNDO DE PENSAO FICTICIO" },
              rendimentos: "25.152,24",
              impostoRetido: "1.890,00",
              decimoTerceiro: "2.096,02",
              impostoRetidoDecimoTerceiro: "157,20",
            },
          },
        },
        {
          ferramenta: "adicionar_rendimento_isento",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "10",
              beneficiario: { tipo: "titular" },
              fonte: { ni: FUNDO, nome: "FUNDO DE PENSAO FICTICIO" },
              valor: "22.847,76",
              decimoTerceiro: "1.903,98",
            },
          },
        },
      ],
    },
    {
      pedido:
        "As duas fontes deram a parcela isenta inteira. Isso está certo? Se não estiver, corrija " +
        "como o programa faz.",
      chamadas: [
        {
          ferramenta: "transferir_excedente_isencao_65",
          argumentos: { arquivo: ARQUIVO, simular: true },
        },
        { ferramenta: "transferir_excedente_isencao_65", argumentos: { arquivo: ARQUIVO } },
        { ferramenta: "listar_rendimentos_pj", argumentos: { arquivo: ARQUIVO } },
      ],
    },
    {
      pedido:
        "Tenho poupança (R$ 1.204,55 de rendimento; saldo de R$ 38.000,00 para R$ 39.204,55), " +
        "uma casa quitada de R$ 320.000,00, plano de saúde de R$ 11.640,00 e fisioterapia de " +
        "R$ 3.200,00.",
      chamadas: [
        {
          ferramenta: "adicionar_rendimento_isento",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "12",
              beneficiario: { tipo: "titular" },
              fonte: { ni: BANCO, nome: "BANCO FICTICIO S.A." },
              valor: "1.204,55",
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
              situacaoAnterior: "38.000,00",
              situacaoAtual: "39.204,55",
              ni: BANCO,
              conta: { banco: "001", agencia: "2468", conta: "13579", dv: "8" },
            },
          },
        },
        {
          ferramenta: "adicionar_bem",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              grupo: "01",
              codigo: "12",
              discriminacao: "CASA NA RUA DOS IPES FICTICIOS, 45, BELO HORIZONTE/MG, QUITADA",
              situacaoAnterior: "320.000,00",
              situacaoAtual: "320.000,00",
              dataAquisicao: "1998-06-30",
              imovel: {
                logradouro: "RUA DOS IPES FICTICIOS",
                numero: "45",
                bairro: "SANTA TEREZA",
                cep: "31010000",
                uf: "MG",
                municipio: "4123",
                areaTotalCentesimos: 18000,
                unidade: "m2",
                registradoEmCartorio: true,
                matricula: "654321",
                nomeCartorio: "CARTORIO FICTICIO DO 2O OFICIO",
              },
            },
          },
        },
        {
          ferramenta: "adicionar_pagamento",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "26",
              nomeBeneficiario: "OPERADORA FICTICIA DE SAUDE S.A.",
              niBeneficiario: OPERADORA,
              valorPago: "11.640,00",
            },
          },
        },
        {
          ferramenta: "adicionar_pagamento",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "13",
              nomeBeneficiario: "CLINICA FICTICIA DE FISIOTERAPIA LTDA",
              niBeneficiario: FISIOTERAPIA,
              valorPago: "3.200,00",
            },
          },
        },
      ],
    },
    {
      pedido: "Valide, escolha o melhor modelo e explique o cálculo.",
      chamadas: [
        { ferramenta: "validar_declaracao", argumentos: { arquivo: ARQUIVO } },
        {
          ferramenta: "definir_opcao_tributacao",
          argumentos: { arquivo: ARQUIVO, opcao: "simplificada" },
          calculo: true,
        },
        { ferramenta: "explicar_calculo", argumentos: ENTRADA_CALCULO, calculo: true },
      ],
    },
    {
      pedido:
        "Vou ter imposto a pagar, então. Quero dividir em 3 quotas e pagar pelo Darf; me passe " +
        "os dados.",
      chamadas: [
        {
          ferramenta: "definir_informacoes_bancarias",
          argumentos: { arquivo: ARQUIVO, quotas: 3 },
        },
        { ferramenta: "gerar_darf", argumentos: { arquivo: ARQUIVO }, calculo: true },
        {
          ferramenta: "gerar_relatorio_declaracao",
          argumentos: { arquivo: ARQUIVO },
          calculo: true,
        },
      ],
    },
  ],
};
