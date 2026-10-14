/**
 * Exemplo 4: psicóloga autônoma que atende pacientes pessoas físicas, paga carnê-leão todo mês e
 * deduz as despesas do consultório pelo livro-caixa. Também atende por uma clínica (pessoa jurídica),
 * que retém imposto na fonte, e por isso termina o ano com saldo a pagar.
 * Todos os dados são fictícios; CPF e CNPJ saem do gerador determinístico.
 */
import { cnpj, cpf, nit } from "../documentos.js";
import type { Roteiro } from "../executar.js";

const TITULAR = cpf(131);
const NIT = nit(131);
const OPERADORA = cnpj(231);
const PREVIDENCIA = cnpj(232);
const BANCO = cnpj(233);
const CLINICA = cnpj(234);
const ARQUIVO = `${TITULAR}-IRPF-A-2026-2025-ORIGI.DBK`;

const RECEITA = "9.800,00";
const INSS = "166,98";
const LIVRO_CAIXA = "2.350,00";
/** Carnê-leão de cada mês, como calculado por `calcular_carne_leao` (tabelas de jan-abr e mai-dez). */
const CARNE_LEAO_JAN_ABR = "1.106,83";
const CARNE_LEAO_MAI_DEZ = "1.094,10";

/** Saldo a pagar no modelo completo, como devolvido por `definir_opcao_tributacao`. */
const SALDO_A_PAGAR = "4.653,06";

const doze = (v: string) => Array.from({ length: 12 }, () => v);
const carneLeao = Array.from({ length: 12 }, (_, i) =>
  i < 4 ? CARNE_LEAO_JAN_ABR : CARNE_LEAO_MAI_DEZ,
);

/** Mesmos dados da declaração, no formato de entrada das ferramentas de cálculo. */
const ENTRADA_CALCULO = {
  titular: { cpf: TITULAR, nome: "PATRICIA FICTICIA EXEMPLO", nascimento: "1987-09-30" },
  rendimentosPJ: [
    {
      cnpj: CLINICA,
      nome: "CLINICA FICTICIA DE PSICOLOGIA LTDA",
      rendimento: "36.000,00",
      irrf: "1.980,00",
    },
  ],
  rendimentosPF: {
    meses: carneLeao.map((pago, i) => ({
      mes: i + 1,
      pessoaFisica: RECEITA,
      previdenciaOficial: INSS,
      livroCaixa: LIVRO_CAIXA,
      carneLeao: pago,
    })),
  },
  pagamentos: [
    { codigo: "26", cpfCnpj: OPERADORA, valor: "5.880,00" },
    { codigo: "36", cpfCnpj: PREVIDENCIA, valor: "6.000,00" },
  ],
};

export const roteiro: Roteiro = {
  titulo: "autônoma com carnê-leão",
  passos: [
    {
      pedido:
        "Sou psicóloga autônoma, Patrícia Fictícia Exemplo, CPF " +
        `${TITULAR}, nascida em 30/09/1987, atendo em Recife (Rua das Mangueiras Fictícias, ` +
        "300, sala 12, Boa Viagem, CEP 51020-000). Crie a declaração.",
      chamadas: [
        {
          ferramenta: "criar_declaracao",
          argumentos: {
            identificacao: {
              cpf: TITULAR,
              nome: "PATRICIA FICTICIA EXEMPLO",
              dataNascimento: "1987-09-30",
              tipoDeclaracao: { tipo: "ajusteAnual" },
              racaCor: "5",
              conjuge: { possui: false },
              endereco: {
                local: "brasil",
                tipoLogradouro: "RUA",
                logradouro: "DAS MANGUEIRAS FICTICIAS",
                numero: "300",
                complemento: "SALA 12",
                bairro: "BOA VIAGEM",
                uf: "PE",
                municipio: "2531",
                cep: "51020000",
              },
              ocupacao: {
                natureza: "11",
                ocupacaoPrincipal: "255",
                registroProfissional: "02/99999",
              },
              nitPisPasep: NIT,
            },
          },
        },
      ],
    },
    {
      pedido:
        "Recebo R$ 9.800,00 por mês de pacientes, pago INSS de R$ 166,98 e tenho R$ 2.350,00 " +
        "de despesas do consultório no livro-caixa. Quanto deu o carnê-leão em janeiro e em " +
        "junho?",
      chamadas: [
        {
          ferramenta: "calcular_carne_leao",
          argumentos: {
            mes: 1,
            rendimentos: RECEITA,
            previdencia: INSS,
            livro_caixa: LIVRO_CAIXA,
          },
          calculo: true,
        },
        {
          ferramenta: "calcular_carne_leao",
          argumentos: {
            mes: 6,
            rendimentos: RECEITA,
            previdencia: INSS,
            livro_caixa: LIVRO_CAIXA,
          },
          calculo: true,
        },
      ],
    },
    {
      pedido:
        "Paguei exatamente esses valores todo mês. Lance o ano inteiro na ficha de rendimentos " +
        "de pessoa física.",
      chamadas: [
        {
          ferramenta: "definir_rendimentos_pf_exterior",
          argumentos: {
            arquivo: ARQUIVO,
            beneficiario: { tipo: "titular" },
            nit_pis_pasep: NIT,
            colunas: {
              trabalhoNaoAssalariado: doze(RECEITA),
              previdenciaOficial: doze(INSS),
              livroCaixa: doze(LIVRO_CAIXA),
              carneLeaoPago: carneLeao,
            },
          },
        },
      ],
    },
    {
      pedido:
        "Também atendo pela Clínica Fictícia de Psicologia, que me paga como autônoma: o " +
        "informe mostra R$ 36.000,00 de rendimentos e R$ 1.980,00 de imposto retido.",
      chamadas: [
        {
          ferramenta: "adicionar_rendimento_pj",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              beneficiario: { tipo: "titular" },
              fonte: { ni: CLINICA, nome: "CLINICA FICTICIA DE PSICOLOGIA LTDA" },
              rendimentos: "36.000,00",
              impostoRetido: "1.980,00",
            },
          },
        },
      ],
    },
    {
      pedido:
        "Pago plano de saúde (R$ 5.880,00 no ano) e contribuí R$ 6.000,00 num PGBL. Tenho " +
        "conta corrente com R$ 12.400,00 em 2024 e R$ 18.950,40 em 2025.",
      chamadas: [
        {
          ferramenta: "adicionar_pagamento",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "26",
              nomeBeneficiario: "OPERADORA FICTICIA DE SAUDE S.A.",
              niBeneficiario: OPERADORA,
              valorPago: "5.880,00",
            },
          },
        },
        {
          ferramenta: "adicionar_pagamento",
          argumentos: {
            arquivo: ARQUIVO,
            item: {
              codigo: "36",
              nomeBeneficiario: "PREVIDENCIA PRIVADA FICTICIA S.A.",
              niBeneficiario: PREVIDENCIA,
              valorPago: "6.000,00",
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
              situacaoAnterior: "12.400,00",
              situacaoAtual: "18.950,40",
              ni: BANCO,
              conta: { banco: "001", agencia: "8642", conta: "97531", dv: "1" },
            },
          },
        },
      ],
    },
    {
      pedido: "Valide a declaração e me diga qual modelo compensa, com a conta detalhada.",
      chamadas: [
        { ferramenta: "validar_declaracao", argumentos: { arquivo: ARQUIVO } },
        {
          ferramenta: "definir_opcao_tributacao",
          argumentos: { arquivo: ARQUIVO, opcao: "completa" },
          calculo: true,
        },
        { ferramenta: "explicar_calculo", argumentos: ENTRADA_CALCULO, calculo: true },
      ],
    },
    {
      pedido: "Se tiver imposto a pagar, divida em quotas e me passe os dados do Darf.",
      chamadas: [
        {
          ferramenta: "definir_informacoes_bancarias",
          argumentos: { arquivo: ARQUIVO, quotas: 4 },
        },
        {
          ferramenta: "calcular_quotas",
          argumentos: { saldo: SALDO_A_PAGAR, quotas: 4 },
          calculo: true,
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
