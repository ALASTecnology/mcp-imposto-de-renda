/**
 * Ida e volta com uma declaração sintética que preenche as fichas sem caso de referência do
 * programa oficial: alimentandos, rendimentos de PF por pagador, exigibilidade suspensa, RRA,
 * isentos e exclusivos de todos os grupos, doações, bens com usufruto e partilha, dívidas,
 * espólio, final de espólio, herdeiros e saída definitiva. Todos os dados são fictícios.
 */
import { describe, expect, it } from "vitest";
import {
  modeloParaRegistros,
  registrosParaModelo,
  tiposMapeados,
} from "../../src/conversao/index.js";
import {
  criarRegistro,
  gravarArquivo,
  LEIAUTE_2026,
  lerArquivo,
  type Registro,
  verificarControles,
} from "../../src/dbk/index.js";
import { type Declaracao, type DeclaracaoEntrada, zDeclaracao } from "../../src/model/index.js";
import { calcularDvCnpj, calcularDvCpf } from "../../src/validate/index.js";

const cpf = (base: string) => `${base}${calcularDvCpf(base)}`;
const cnpj = (base: string) => `${base}${calcularDvCnpj(base)}`;
const TITULAR = cpf("123456789");
const DEP = cpf("987654321");
const ALIM = cpf("111444777");
const HERDEIRO = cpf("222555888");
const FONTE = cnpj("112223330001");
const meses = (v: number) => Array.from({ length: 12 }, () => v);

function entrada(): DeclaracaoEntrada {
  return {
    identificacao: {
      cpf: TITULAR,
      nome: "FULANA FICTICIA",
      dataNascimento: "1955-01-15",
      tipoDeclaracao: { tipo: "ajusteAnual", retificadora: true, reciboRetificada: "123456789012" },
      racaCor: "2",
      conjuge: { possui: true, cpf: HERDEIRO },
      endereco: {
        local: "brasil",
        tipoLogradouro: "RUA",
        logradouro: "DAS ACACIAS FICTICIAS",
        numero: "10",
        bairro: "CENTRO",
        uf: "DF",
        municipio: "9701",
        cep: "70040010",
        celular: { ddd: "61", numero: "999990000" },
        email: "fulana@exemplo.invalid",
      },
      ocupacao: { natureza: "81" },
      nitPisPasep: "12345678901",
    },
    dependentes: [
      { codigo: "21", nome: "FILHO FICTICIO", cpf: DEP, dataNascimento: "2015-06-01", racaCor: "2" },
    ],
    alimentandos: [
      {
        residencia: "brasil",
        nome: "ALIMENTANDO FICTICIO",
        cpf: ALIM,
        dataNascimento: "2012-01-01",
        vinculo: { tipo: "titular" },
        tipoProcesso: "ambos",
        decisaoJudicial: {
          numeroProcesso: "00012345620208070001",
          varaCivil: "0001",
          comarca: "BRASILIA",
          uf: "DF",
          dataDecisao: "2020-03-15",
        },
        escrituraPublica: {
          cnpjCartorio: FONTE,
          nomeCartorio: "CARTORIO FICTICIO",
          livro: "12",
          folhas: "34",
          uf: "DF",
          municipio: "9701",
          dataLavratura: "2021-04-10",
        },
      },
    ],
    rendimentosPJ: [
      {
        beneficiario: { tipo: "titular" },
        fonte: { ni: FONTE, nome: "EMPRESA FICTICIA" },
        rendimentos: 8_000_000,
        contribuicaoPrevidenciaria: 700_000,
        impostoRetido: 900_000,
        decimoTerceiro: 600_000,
        impostoRetidoDecimoTerceiro: 50_000,
      },
      {
        beneficiario: { tipo: "dependente", cpf: DEP },
        fonte: { ni: FONTE, nome: "EMPRESA FICTICIA" },
        rendimentos: 100_000,
      },
    ],
    rendimentosPFExterior: [
      {
        beneficiario: { tipo: "titular" },
        trabalhoNaoAssalariado: meses(300_000),
        alugueis: meses(100_000),
        outros: meses(0),
        exterior: meses(50_000),
        previdenciaOficial: meses(30_000),
        quantidadeDependentes: meses(1),
        pensaoAlimenticia: meses(0),
        livroCaixa: meses(20_000),
        carneLeaoPago: meses(10_000),
        pagamentosRecebidos: [
          { mes: 1, cpfTitularPagamento: DEP, cpfBeneficiarioServico: ALIM, valor: 300_000 },
        ],
      },
      {
        beneficiario: { tipo: "dependente", cpf: DEP },
        alugueis: meses(10_000),
      },
    ],
    rendimentosIsentos: [
      { codigo: "09", beneficiario: { tipo: "titular" }, fonte: { ni: FONTE, nome: "EMPRESA FICTICIA" }, valor: 500_000, chaveBem: 2 },
      { codigo: "10", beneficiario: { tipo: "titular" }, fonte: { ni: FONTE, nome: "INSTITUTO FICTICIO" }, valor: 2_284_776, decimoTerceiro: 190_398 },
      {
        codigo: "11",
        beneficiario: { tipo: "titular" },
        fonte: { ni: FONTE, nome: "INSTITUTO FICTICIO" },
        valor: 1_000_000,
        impostoRetido: 0,
        decimoTerceiro: 80_000,
        impostoRetidoDecimoTerceiro: 0,
        contribuicaoPrevidenciaria: 40_000,
      },
      { codigo: "14", beneficiario: { tipo: "dependente", cpf: DEP }, doador: { ni: HERDEIRO, nome: "DOADOR FICTICIO" }, valor: 700_000 },
      { codigo: "20", beneficiario: { tipo: "titular" }, valor: 150_000 },
      { codigo: "28", beneficiario: { tipo: "dependente", cpf: DEP }, cpfAlimentante: HERDEIRO, valor: 120_000 },
      { codigo: "99", beneficiario: { tipo: "titular" }, fonte: { ni: FONTE, nome: "EMPRESA FICTICIA" }, descricao: "OUTRO ISENTO FICTICIO", valor: 30_000 },
      { codigo: "05", valorInformado: 10_000, valorTransportado: 0 },
      { codigo: "15", valor: 45_000 },
    ],
    rendimentosExclusivos: [
      { codigo: "01", valor: 600_000 },
      { codigo: "06", beneficiario: { tipo: "titular" }, fonte: { ni: FONTE, nome: "BANCO FICTICIO" }, valor: 350_000, chaveBem: 2 },
      { codigo: "10", beneficiario: { tipo: "dependente", cpf: DEP }, fonte: { ni: FONTE, nome: "EMPRESA FICTICIA" }, valor: 120_000 },
      { codigo: "13", beneficiario: { tipo: "titular" }, descricao: "PREMIO FICTICIO", valor: 10_000 },
      { codigo: "99", beneficiario: { tipo: "titular" }, fonte: { ni: FONTE, nome: "EMPRESA FICTICIA" }, descricao: "OUTRO EXCLUSIVO", valor: 20_000 },
    ],
    rendimentosExigibilidadeSuspensa: [
      { beneficiario: { tipo: "titular" }, fonte: { ni: FONTE, nome: "EMPRESA FICTICIA" }, rendimentos: 200_000, depositosJudiciais: 30_000 },
      { beneficiario: { tipo: "dependente", cpf: DEP }, fonte: { ni: FONTE, nome: "EMPRESA FICTICIA" }, rendimentos: 50_000 },
    ],
    rendimentosAcumulados: [
      {
        beneficiario: { tipo: "titular" },
        opcaoTributacao: "exclusivaNaFonte",
        fonte: { ni: FONTE, nome: "TRIBUNAL FICTICIO" },
        rendimentos: 3_000_000,
        juros: 100_000,
        contribuicaoPrevidenciaria: 50_000,
        pensaoAlimenticia: 20_000,
        pensoes: [{ cpfAlimentando: ALIM, valor: 20_000 }],
        impostoRetido: 90_000,
        mesRecebimento: 7,
        numeroMeses: 12.5,
      },
      {
        beneficiario: { tipo: "dependente", cpf: DEP },
        opcaoTributacao: "ajusteAnual",
        fonte: { ni: FONTE, nome: "TRIBUNAL FICTICIO" },
        rendimentos: 400_000,
        mesRecebimento: 3,
        numeroMeses: 4,
      },
    ],
    impostoPago: { impostoComplementar: 10_000, impostoPagoExterior: 5_000, impostoRetidoLei11033: 1_000 },
    pagamentos: [
      { codigo: "10", realizadoCom: { tipo: "dependente", cpf: DEP }, niBeneficiario: FONTE, nomeBeneficiario: "CLINICA FICTICIA", valorPago: 250_000, parcelaNaoDedutivel: 50_000 },
      { codigo: "30", realizadoCom: { tipo: "alimentando", cpf: ALIM }, niBeneficiario: ALIM, nomeBeneficiario: "ALIMENTANDO FICTICIO", valorPago: 1_200_000 },
      { codigo: "36", niBeneficiario: FONTE, nomeBeneficiario: "PREVIDENCIA FICTICIA", valorPago: 500_000 },
    ],
    doacoesEfetuadas: [
      { codigo: "41", niBeneficiario: FONTE, nomeBeneficiario: "PROJETO CULTURAL FICTICIO", valor: 30_000 },
    ],
    doacoesDiretamenteNaDeclaracao: {
      eca: [{ tipoFundo: "municipal", uf: "DF", municipio: "BRASILIA", cnpjFundo: FONTE, valor: 10_000 }],
      idoso: [{ tipoFundo: "nacional", cnpjFundo: FONTE, valor: 10_000 }],
    },
    bens: [
      {
        chave: 1,
        grupo: "01",
        codigo: "11",
        discriminacao: "APARTAMENTO FICTICIO",
        situacaoAnterior: 30_000_000,
        situacaoAtual: 30_000_000,
        dataAquisicao: "2010-03-20",
        imovel: {
          logradouro: "RUA FICTICIA",
          numero: "1",
          bairro: "CENTRO",
          cep: "70040010",
          uf: "DF",
          municipio: "9701",
          areaTotalCentesimos: 8500,
          unidade: "m2",
          registradoEmCartorio: true,
          matricula: "123",
          nomeCartorio: "CARTORIO FICTICIO",
          iptu: "456",
        },
        usufruto: true,
        proprietariosUsufrutuarios: [HERDEIRO],
        partilha: [{ niHerdeiro: HERDEIRO, percentualCentesimos: 10000 }],
      },
      {
        chave: 2,
        grupo: "04",
        codigo: "01",
        pertenceA: { tipo: "dependente", cpf: DEP },
        pais: "249",
        discriminacao: "APLICACAO FICTICIA NO EXTERIOR",
        situacaoAnterior: 100_000,
        situacaoAtual: 250_000,
        ni: FONTE,
        conta: { banco: "001", agencia: "1234", conta: "56789", dv: "0", contaPagamento: true },
        aplicacaoFinanceiraExterior: { rendimentoOuPerda: -12_345, impostoPagoExterior: 100 },
        lucrosDividendosExterior: { valorRecebido: 5_000, impostoPago: 500 },
      },
      {
        chave: 3,
        grupo: "08",
        codigo: "02",
        discriminacao: "ALTCOIN FICTICIA",
        situacaoAnterior: 0,
        situacaoAtual: 1_000,
        custodiante: true,
        codigoAltcoin: "ETH",
        negociadoEmBolsa: false,
      },
    ],
    dividas: [
      { codigo: "11", discriminacao: "EMPRESTIMO FICTICIO", situacaoAnterior: 500_000, situacaoAtual: 200_000, valorPago: 300_000 },
    ],
    espolio: { sobrepartilha: false, inventariante: { cpf: HERDEIRO, nome: "INVENTARIANTE FICTICIO" } },
    herdeiros: [{ ni: HERDEIRO, nome: "HERDEIRO FICTICIO" }],
    saidaDefinitiva: {
      procurador: { cpf: HERDEIRO, nome: "PROCURADOR FICTICIO", endereco: "RUA FICTICIA 1" },
      dataCondicaoNaoResidente: "2025-08-01",
      paisDestino: "249",
    },
    doacoesPartidos: [{ cnpj: FONTE, nome: "PARTIDO FICTICIO", valor: 15_000 }],
    resumo: {
      opcaoTributacao: "deducoesLegais",
      quotas: 3,
      debitoAutomatico: true,
      debitoPrimeiraQuota: false,
      conta: { banco: "001", agencia: "1234", conta: "56789", dv: "0", tipo: "poupanca" },
    },
  };
}

function idaEVolta(dec: Declaracao, base?: readonly Registro[]) {
  const g = modeloParaRegistros(dec, base ? { base } : {});
  const bytes = gravarArquivo(g.registros);
  const lido = lerArquivo(bytes);
  const leitura = registrosParaModelo(lido.registros);
  return { g, lido, leitura, volta: zDeclaracao.parse(leitura.declaracao) };
}

/**
 * Sem os campos derivados (`resumoCalculado`) e com isentos e exclusivos em ordem canônica:
 * o arquivo agrupa esses lançamentos por registro de detalhe, então a ordem relida pode mudar.
 */
function semDerivados(d: Declaracao) {
  const ordem = <T>(l: readonly T[]) =>
    [...l].sort((a, b) => {
      const x = JSON.stringify(a, (_, v) => (typeof v === "bigint" ? v.toString() : v));
      const y = JSON.stringify(b, (_, v) => (typeof v === "bigint" ? v.toString() : v));
      return x < y ? -1 : x > y ? 1 : 0;
    });
  return {
    ...d,
    resumoCalculado: undefined,
    rendimentosIsentos: ordem(d.rendimentosIsentos),
    rendimentosExclusivos: ordem(d.rendimentosExclusivos),
  };
}

describe("ida e volta de uma declaração sintética completa", () => {
  const dec = zDeclaracao.parse(entrada());

  it("relê o mesmo modelo e os controles conferem", () => {
    const { g, lido, volta, leitura } = idaEVolta(dec);
    expect(verificarControles(lido.registros).valido).toBe(true);
    expect(leitura.tiposNaoMapeados).toEqual([]);
    expect(g.tiposPreservados).toEqual([]);
    expect(semDerivados(volta)).toEqual(semDerivados(dec));
  });

  it("grava os tipos de registro esperados", () => {
    const tipos = new Set(idaEVolta(dec).g.registros.map((r) => r.tipo));
    for (const t of ["16", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "30"]) {
      expect(tipos, t).toContain(t);
    }
    for (const t of ["32", "34", "35", "36", "39", "45", "46", "47", "49", "58", "59", "80"]) {
      expect(tipos, t).toContain(t);
    }
    for (const t of ["81", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92"]) {
      expect(tipos, t).toContain(t);
    }
  });

  it("regravar sobre o próprio arquivo devolve os mesmos registros", () => {
    const primeira = idaEVolta(dec);
    const segunda = modeloParaRegistros(primeira.volta, { base: primeira.lido.registros });
    expect(gravarArquivo(segunda.registros)).toEqual(gravarArquivo(primeira.lido.registros));
  });

  it("preserva sem alteração registro de tipo não mapeado e o lista", () => {
    const base = idaEVolta(dec).lido.registros;
    const estranho = criarRegistro(LEIAUTE_2026, "37", { NR_CHAVE_BEM: 2n, TIPO: 1n });
    expect(tiposMapeados().has("37")).toBe(false);
    const g = modeloParaRegistros(dec, { base: [...base.slice(0, -1), estranho, ...base.slice(-1)] });
    expect(g.tiposPreservados).toContain("37");
    expect(g.registros.filter((r) => r.tipo === "37")).toHaveLength(1);
    expect(verificarControles(g.registros).valido).toBe(true);
  });

  it("remover um dependente renumera as chaves e mantém os vínculos", () => {
    const outro = cpf("135792468");
    const com2 = zDeclaracao.parse({
      ...entrada(),
      dependentes: [
        { codigo: "21", nome: "OUTRO FILHO", cpf: outro, dataNascimento: "2016-06-01" },
        ...(entrada().dependentes ?? []),
      ],
    });
    const base = idaEVolta(com2).lido.registros;
    const { volta } = idaEVolta(dec, base);
    expect(volta.dependentes.map((d) => d.cpf)).toEqual([DEP]);
    expect(volta.pagamentos[0]?.realizadoCom).toEqual({ tipo: "dependente", cpf: DEP });
  });
});
