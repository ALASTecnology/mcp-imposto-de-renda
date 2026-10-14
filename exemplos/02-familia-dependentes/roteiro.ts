/**
 * Exemplo 2: servidor público com companheira e dois filhos como dependentes, plano de saúde,
 * consultas médicas, escola, faculdade, apartamento financiado e carro.
 * Todos os dados são fictícios; CPF e CNPJ saem do gerador determinístico.
 */
import { cnpj, cpf } from "../documentos.js";
import type { Roteiro } from "../executar.js";

const TITULAR = cpf(111);
const COMPANHEIRA = cpf(112);
const FILHA = cpf(113);
const FILHO = cpf(114);
const PEDIATRA = cpf(115);
const ESTADO = cnpj(211);
const OPERADORA = cnpj(212);
const DENTISTA = cnpj(213);
const ESCOLA = cnpj(214);
const FACULDADE = cnpj(215);
const BANCO = cnpj(216);
const ARQUIVO = `${TITULAR}-IRPF-A-2026-2025-ORIGI.DBK`;

const dependente = (cpfDependente: string) => ({ tipo: "dependente", cpf: cpfDependente });

/** Despesas como lançadas na ficha Pagamentos Efetuados. */
const PAGAMENTOS = [
  {
    codigo: "26",
    nomeBeneficiario: "OPERADORA FICTICIA DE SAUDE S.A.",
    niBeneficiario: OPERADORA,
    valorPago: "7.200,00",
  },
  {
    codigo: "26",
    realizadoCom: dependente(COMPANHEIRA),
    nomeBeneficiario: "OPERADORA FICTICIA DE SAUDE S.A.",
    niBeneficiario: OPERADORA,
    valorPago: "7.200,00",
  },
  {
    codigo: "26",
    realizadoCom: dependente(FILHA),
    nomeBeneficiario: "OPERADORA FICTICIA DE SAUDE S.A.",
    niBeneficiario: OPERADORA,
    valorPago: "4.800,00",
  },
  {
    codigo: "26",
    realizadoCom: dependente(FILHO),
    nomeBeneficiario: "OPERADORA FICTICIA DE SAUDE S.A.",
    niBeneficiario: OPERADORA,
    valorPago: "4.800,00",
  },
  {
    codigo: "10",
    realizadoCom: dependente(FILHA),
    nomeBeneficiario: "PEDIATRA FICTICIA DE OLIVEIRA",
    niBeneficiario: PEDIATRA,
    valorPago: "1.350,00",
  },
  {
    codigo: "11",
    nomeBeneficiario: "CLINICA ODONTOLOGICA FICTICIA LTDA",
    niBeneficiario: DENTISTA,
    valorPago: "2.800,00",
  },
  {
    codigo: "01",
    realizadoCom: dependente(FILHA),
    nomeBeneficiario: "ESCOLA FICTICIA DO SABER LTDA",
    niBeneficiario: ESCOLA,
    valorPago: "18.000,00",
  },
  {
    codigo: "01",
    realizadoCom: dependente(FILHO),
    nomeBeneficiario: "FACULDADE FICTICIA DE CURITIBA",
    niBeneficiario: FACULDADE,
    valorPago: "24.000,00",
  },
] as const;

/** Mesmos dados da declaração, no formato de entrada das ferramentas de cálculo. */
const ENTRADA_CALCULO = {
  titular: { cpf: TITULAR, nome: "CARLOS FICTICIO EXEMPLO", nascimento: "1982-03-08" },
  dependentes: [
    { cpf: COMPANHEIRA, nome: "BEATRIZ FICTICIA EXEMPLO", nascimento: "1984-10-21", codigo: "11" },
    { cpf: FILHA, nome: "LUIZA FICTICIA EXEMPLO", nascimento: "2014-05-20", codigo: "21" },
    { cpf: FILHO, nome: "RAFAEL FICTICIO EXEMPLO", nascimento: "2003-11-02", codigo: "22" },
  ],
  rendimentosPJ: [
    {
      cnpj: ESTADO,
      nome: "SECRETARIA FICTICIA DE ADMINISTRACAO",
      rendimento: "168.000,00",
      previdenciaOficial: "23.520,00",
      irrf: "26.874,18",
      decimoTerceiro: "14.000,00",
      irrfDecimoTerceiro: "2.239,41",
    },
  ],
  pagamentos: PAGAMENTOS.map((p) => ({
    codigo: p.codigo,
    cpfCnpj: p.niBeneficiario,
    valor: p.valorPago,
    ...("realizadoCom" in p
      ? { beneficiario: "D" as const, cpfDependente: p.realizadoCom.cpf }
      : {}),
  })),
};

export const roteiro: Roteiro = {
  titulo: "família com dependentes, saúde e educação",
  passos: [
    {
      pedido:
        "Vamos fazer a declaração da família. Sou Carlos Fictício Exemplo, CPF " +
        `${TITULAR}, nascido em 08/03/1982, servidor público estadual em Curitiba ` +
        "(Avenida dos Pinheirais Fictícios, 2500, apto 801, Batel, CEP 80420-000). Vivo em união " +
        "estável com a Beatriz e temos dois filhos.",
      chamadas: [
        {
          ferramenta: "criar_declaracao",
          argumentos: {
            identificacao: {
              cpf: TITULAR,
              nome: "CARLOS FICTICIO EXEMPLO",
              dataNascimento: "1982-03-08",
              tipoDeclaracao: { tipo: "ajusteAnual" },
              racaCor: "2",
              conjuge: { possui: false },
              endereco: {
                local: "brasil",
                tipoLogradouro: "AVENIDA",
                logradouro: "DOS PINHEIRAIS FICTICIOS",
                numero: "2500",
                complemento: "APTO 801",
                bairro: "BATEL",
                uf: "PR",
                municipio: "7535",
                cep: "80420000",
              },
              ocupacao: { natureza: "31", ocupacaoPrincipal: "116" },
            },
            opcao_tributacao: "completa",
          },
        },
      ],
    },
    {
      pedido:
        "Qual é o código de dependente do meu filho de 22 anos que faz faculdade? E o da " +
        "companheira?",
      chamadas: [
        { ferramenta: "buscar_codigo", argumentos: { tabela: "dependentes", codigo: "22" } },
        { ferramenta: "buscar_codigo", argumentos: { tabela: "dependentes", codigo: "11" } },
      ],
    },
    {
      pedido:
        `Inclua como dependentes a Beatriz Fictícia Exemplo (CPF ${COMPANHEIRA}, 21/10/1984), ` +
        `a Luiza Fictícia Exemplo (CPF ${FILHA}, 20/05/2014) e o Rafael Fictício Exemplo ` +
        `(CPF ${FILHO}, 02/11/2003, universitário).`,
      chamadas: [
        {
          ferramenta: "adicionar_dependente",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "11",
              nome: "BEATRIZ FICTICIA EXEMPLO",
              cpf: COMPANHEIRA,
              dataNascimento: "1984-10-21",
              moraComTitular: true,
            },
          },
        },
        {
          ferramenta: "adicionar_dependente",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "21",
              nome: "LUIZA FICTICIA EXEMPLO",
              cpf: FILHA,
              dataNascimento: "2014-05-20",
              moraComTitular: true,
            },
          },
        },
        {
          ferramenta: "adicionar_dependente",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "22",
              nome: "RAFAEL FICTICIO EXEMPLO",
              cpf: FILHO,
              dataNascimento: "2003-11-02",
              moraComTitular: true,
            },
          },
        },
      ],
    },
    {
      pedido:
        "Informe de rendimentos do Estado: R$ 168.000,00 tributáveis, previdência oficial " +
        "R$ 23.520,00, IRRF R$ 26.874,18, 13º de R$ 14.000,00 com IRRF de R$ 2.239,41.",
      chamadas: [
        {
          ferramenta: "adicionar_rendimento_pj",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              beneficiario: { tipo: "titular" },
              fonte: { ni: ESTADO, nome: "SECRETARIA FICTICIA DE ADMINISTRACAO" },
              rendimentos: "168.000,00",
              contribuicaoPrevidenciaria: "23.520,00",
              impostoRetido: "26.874,18",
              decimoTerceiro: "14.000,00",
              impostoRetidoDecimoTerceiro: "2.239,41",
            },
          },
        },
      ],
    },
    {
      pedido:
        "Agora as despesas: plano de saúde da família (R$ 7.200,00 meu, R$ 7.200,00 da " +
        "Beatriz e R$ 4.800,00 de cada filho), pediatra da Luiza R$ 1.350,00, meu dentista " +
        "R$ 2.800,00, escola da Luiza R$ 18.000,00 e faculdade do Rafael R$ 24.000,00.",
      chamadas: [
        {
          ferramenta: "listar_tabela",
          argumentos: { tabela: "pagamentos", filtro: "saude", limite: 5 },
        },
        ...PAGAMENTOS.map((item) => ({
          ferramenta: "adicionar_pagamento",
          argumentos: { arquivo: ARQUIVO, item },
        })),
      ],
    },
    {
      pedido:
        "Bens: apartamento em Curitiba comprado em 2019 por R$ 480.000,00 e um carro de " +
        "R$ 92.000,00 comprado em 2022. Conta corrente com R$ 6.240,00 em 2024 e R$ 9.815,30 " +
        "em 2025. O financiamento do apartamento caiu de R$ 236.400,00 para R$ 219.180,00, e " +
        "paguei R$ 31.200,00 de prestações.",
      chamadas: [
        {
          ferramenta: "adicionar_bem",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              grupo: "01",
              codigo: "11",
              discriminacao:
                "APARTAMENTO 801 NA AVENIDA DOS PINHEIRAIS FICTICIOS, 2500, CURITIBA/PR, " +
                "ADQUIRIDO EM 2019 COM FINANCIAMENTO BANCARIO",
              situacaoAnterior: "480.000,00",
              situacaoAtual: "480.000,00",
              dataAquisicao: "2019-08-15",
              imovel: {
                logradouro: "AVENIDA DOS PINHEIRAIS FICTICIOS",
                numero: "2500",
                complemento: "APTO 801",
                bairro: "BATEL",
                cep: "80420000",
                uf: "PR",
                municipio: "7535",
                areaTotalCentesimos: 8650,
                unidade: "m2",
                registradoEmCartorio: true,
                matricula: "123456",
                nomeCartorio: "CARTORIO FICTICIO DE REGISTRO DE IMOVEIS",
              },
            },
          },
        },
        {
          ferramenta: "adicionar_bem",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              grupo: "02",
              codigo: "01",
              discriminacao: "AUTOMOVEL FICTICIO MODELO SEDAN 2022, ADQUIRIDO A VISTA",
              situacaoAnterior: "92.000,00",
              situacaoAtual: "92.000,00",
              renavam: "12345678901",
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
              situacaoAnterior: "6.240,00",
              situacaoAtual: "9.815,30",
              ni: BANCO,
              conta: { banco: "001", agencia: "4321", conta: "11223", dv: "2" },
            },
          },
        },
        {
          ferramenta: "adicionar_divida",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "11",
              discriminacao: "FINANCIAMENTO IMOBILIARIO DO APARTAMENTO 801 NO BANCO FICTICIO S.A.",
              niCredor: BANCO,
              situacaoAnterior: "236.400,00",
              situacaoAtual: "219.180,00",
              valorPago: "31.200,00",
            },
          },
        },
      ],
    },
    {
      pedido: "Mostre os pagamentos lançados e veja se ficou alguma pendência.",
      chamadas: [
        { ferramenta: "listar_pagamentos", argumentos: { arquivo: ARQUIVO } },
        { ferramenta: "validar_declaracao", argumentos: { arquivo: ARQUIVO } },
      ],
    },
    {
      pedido: "Compare os dois modelos e explique de onde vem cada dedução.",
      chamadas: [
        {
          ferramenta: "definir_opcao_tributacao",
          argumentos: { arquivo: ARQUIVO, opcao: "completa" },
          calculo: true,
        },
        { ferramenta: "explicar_calculo", argumentos: ENTRADA_CALCULO, calculo: true },
      ],
    },
    {
      pedido:
        "Quero receber a restituição por Pix no meu CPF. Depois gere o relatório final para eu " +
        "conferir antes de abrir no programa.",
      chamadas: [
        {
          ferramenta: "definir_informacoes_bancarias",
          argumentos: { arquivo: ARQUIVO, pix: true },
        },
        {
          ferramenta: "gerar_relatorio_declaracao",
          argumentos: { arquivo: ARQUIVO },
          calculo: true,
        },
      ],
    },
  ],
};
