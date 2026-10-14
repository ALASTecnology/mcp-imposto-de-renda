import { describe, expect, it } from "vitest";
import { zDeclaracao } from "../../src/model/index.js";
import {
  type Pendencia,
  podeEntregar,
  REGRAS,
  separarPendencias,
  validarDeclaracao,
} from "../../src/validate/index.js";
import {
  CNPJ_BANCO,
  CNPJ_EMPRESA,
  CNPJ_HOSPITAL,
  CPF_ALIM,
  CPF_CONJUGE,
  CPF_DEP1,
  CPF_DEP2,
  CPF_MEDICO,
  CPF_TITULAR,
  cnpj,
  cpf,
  cpfInvalido,
  declaracaoBase,
} from "../model/fixtures.js";

// biome-ignore lint/suspicious/noExplicitAny: cenários montam a entrada livremente antes do parse.
type Livre = any;
type Entrada = Record<string, Livre>;

const titular = { tipo: "titular" } as const;
const depNaoCadastrado = { tipo: "dependente", cpf: CPF_DEP2 } as const;
const fonte = { ni: CNPJ_EMPRESA, nome: "Empresa Sintética Ltda" };
const fonteInvalida = { ni: "11222333000100", nome: "Fonte Errada" };
const CNPJ_FUNDO_ECA_DF = "15558339000185";
const CNPJ_FUNDO_ECA_SP = "13885657000125";

function dependente(cpfDep: string, extra: Record<string, unknown> = {}) {
  return { codigo: "21", nome: "Filho Teste", cpf: cpfDep, dataNascimento: "2015-01-10", ...extra };
}

function alimentando(cpfAlim: string, extra: Record<string, unknown> = {}) {
  return {
    residencia: "brasil",
    nome: "Alimentando Teste",
    cpf: cpfAlim,
    dataNascimento: "2012-03-03",
    vinculo: titular,
    tipoProcesso: "decisaoJudicial",
    decisaoJudicial: {
      numeroProcesso: "0001234-56.2020.8.26.0100",
      varaCivil: "1",
      comarca: "São Paulo",
      uf: "SP",
      dataDecisao: "2020-06-01",
    },
    ...extra,
  };
}

function pagamento(extra: Record<string, unknown>) {
  return {
    codigo: "10",
    niBeneficiario: CPF_MEDICO,
    nomeBeneficiario: "Médico Teste",
    valorPago: 50000n,
    ...extra,
  };
}

function bem(extra: Record<string, unknown>) {
  return {
    grupo: "01",
    codigo: "11",
    discriminacao: "Apartamento sintético",
    situacaoAtual: 100n,
    ...extra,
  };
}

function finalEspolio(e: Entrada): void {
  e.identificacao.tipoDeclaracao = {
    tipo: "finalEspolio",
    reciboExercicioAnterior: "123456789012",
  };
  e.identificacao.ocupacao = { natureza: "81" };
  e.finalEspolio = {
    anoObito: 2024,
    modalidade: "partilha",
    tipoInventario: "escrituraPublica",
    escrituraPublica: {
      cnpjCartorio: cnpj("777888990001"),
      nomeCartorio: "Cartório Sintético",
      livro: "10",
      folhas: "20",
      uf: "SP",
      municipio: "7107",
      dataLavratura: "2025-03-10",
    },
    inventariante: { cpf: CPF_DEP1, nome: "Inventariante Teste" },
  };
  e.herdeiros = [{ ni: CPF_DEP1, nome: "Herdeiro Um" }];
}

function saida(e: Entrada): void {
  e.identificacao.tipoDeclaracao = {
    tipo: "saidaDefinitiva",
    reciboExercicioAnterior: "123456789012",
  };
  e.saidaDefinitiva = { dataCondicaoNaoResidente: "2025-08-01", paisDestino: "249" };
}

function rodar(montar?: (e: Entrada) => void): Pendencia[] {
  const entrada = declaracaoBase() as Entrada;
  montar?.(entrada);
  return validarDeclaracao(zDeclaracao.parse(entrada));
}

function codigos(p: readonly Pendencia[]): string[] {
  return p.map((x) => x.codigo);
}

/** Um cenário mínimo que dispara cada regra do catálogo. */
const CENARIOS: Record<string, (e: Entrada) => void> = {
  "IDENT-CPF": (e) => {
    e.identificacao.cpf = cpfInvalido("397104821");
  },
  "IDENT-NOME": (e) => {
    e.identificacao.nome = "Maria Teste Siiilva";
  },
  "IDENT-NASCIMENTO": (e) => {
    e.identificacao.dataNascimento = "2026-01-10";
  },
  "IDENT-RECIBO-RETIFICADORA": (e) => {
    e.identificacao.tipoDeclaracao = { tipo: "ajusteAnual", retificadora: true };
  },
  "IDENT-RECIBO-ANTERIOR": (e) => {
    saida(e);
    e.identificacao.tipoDeclaracao = { tipo: "saidaDefinitiva" };
  },
  "IDENT-CONJUGE": (e) => {
    e.identificacao.conjuge = { possui: true };
  },
  "IDENT-RETORNO": (e) => {
    e.identificacao.retornoAoPais = { retornou: true, data: "2024-12-01" };
  },
  "IDENT-NATUREZA": (e) => {
    e.identificacao.ocupacao = { natureza: "99", ocupacaoPrincipal: "212" };
  },
  "IDENT-OCUPACAO": (e) => {
    e.identificacao.ocupacao = { natureza: "01" };
  },
  "IDENT-REGISTRO-PROFISSIONAL": (e) => {
    e.identificacao.ocupacao = { natureza: "11", ocupacaoPrincipal: "225" };
    e.identificacao.nitPisPasep = "12345678901";
  },
  "IDENT-NIT": (e) => {
    e.identificacao.ocupacao = { natureza: "11", ocupacaoPrincipal: "212" };
  },
  "IDENT-RACA-COR": (e) => {
    e.identificacao.racaCor = "0";
  },
  "IDENT-ENDERECO": (e) => {
    e.identificacao.endereco.municipio = "4123";
  },
  "IDENT-CONTATO": (e) => {
    e.identificacao.endereco.email = "maria@";
  },
  "IDENT-TIPO-ESPOLIO": (e) => {
    finalEspolio(e);
    e.identificacao.ocupacao = { natureza: "01", ocupacaoPrincipal: "212" };
  },
  "DEP-CODIGO": (e) => {
    e.dependentes = [dependente(CPF_DEP1, { codigo: "99" })];
  },
  "DEP-CPF": (e) => {
    e.dependentes = [dependente(cpfInvalido("123456789"))];
  },
  "DEP-DUPLICADO": (e) => {
    e.dependentes = [dependente(CPF_DEP1), dependente(CPF_DEP1)];
  },
  "DEP-ALIMENTANDO": (e) => {
    e.dependentes = [dependente(CPF_ALIM)];
    e.alimentandos = [alimentando(CPF_ALIM)];
  },
  "DEP-NASCIMENTO": (e) => {
    e.dependentes = [dependente(CPF_DEP1, { dataNascimento: "2026-02-01" })];
  },
  "DEP-IDADE": (e) => {
    e.dependentes = [dependente(CPF_DEP1, { dataNascimento: "2000-01-01" })];
  },
  "DEP-CONJUGE": (e) => {
    e.identificacao.conjuge = { possui: true, cpf: CPF_CONJUGE };
    e.dependentes = [dependente(CPF_DEP1, { codigo: "11", dataNascimento: "1982-01-01" })];
  },
  "DEP-CONTATO": (e) => {
    e.dependentes = [dependente(CPF_DEP1, { email: "sem-arroba" })];
  },
  "DEP-SAIDA": (e) => {
    e.dependentes = [dependente(CPF_DEP1, { saiuDoPaisComDeclarante: true })];
  },
  "ALIM-CPF": (e) => {
    e.alimentandos = [alimentando(cpfInvalido("246813579"))];
  },
  "ALIM-DUPLICADO": (e) => {
    e.alimentandos = [alimentando(CPF_ALIM), alimentando(CPF_ALIM)];
  },
  "ALIM-PROCESSO": (e) => {
    e.alimentandos = [alimentando(CPF_ALIM, { tipoProcesso: "ambos" })];
  },
  "ALIM-VINCULO": (e) => {
    e.alimentandos = [alimentando(CPF_ALIM, { vinculo: depNaoCadastrado })];
  },
  "RPJ-DEPENDENTE": (e) => {
    e.rendimentosPJ = [{ beneficiario: depNaoCadastrado, fonte, rendimentos: 100n }];
  },
  "RPJ-FONTE": (e) => {
    e.rendimentosPJ = [{ beneficiario: titular, fonte: fonteInvalida, rendimentos: 100n }];
  },
  "RPJ-IRRF": (e) => {
    e.rendimentosPJ = [{ beneficiario: titular, fonte, rendimentos: 100n, impostoRetido: 200n }];
  },
  "RPF-DEPENDENTE": (e) => {
    e.rendimentosPFExterior = [{ beneficiario: depNaoCadastrado }];
  },
  "RPF-DUPLICADO": (e) => {
    e.rendimentosPFExterior = [{ beneficiario: titular }, { beneficiario: titular }];
  },
  "RPF-NIT": (e) => {
    const prev = Array.from({ length: 12 }, () => 0n);
    prev[0] = 10000n;
    e.rendimentosPFExterior = [{ beneficiario: titular, previdenciaOficial: prev }];
  },
  "RPF-LIVRO-CAIXA": (e) => {
    const lc = Array.from({ length: 12 }, () => 0n);
    lc[5] = 5000n;
    e.rendimentosPFExterior = [{ beneficiario: titular, livroCaixa: lc }];
  },
  "RPF-PAGADOR": (e) => {
    e.rendimentosPFExterior = [
      {
        beneficiario: titular,
        pagamentosRecebidos: [{ mes: 2, cpfTitularPagamento: cpfInvalido("111222333"), valor: 1n }],
      },
    ];
  },
  "RPF-PENSAO": (e) => {
    const pa = Array.from({ length: 12 }, () => 0n);
    pa[1] = 30000n;
    e.rendimentosPFExterior = [{ beneficiario: titular, pensaoAlimenticia: pa }];
  },
  "ISE-DEPENDENTE": (e) => {
    e.rendimentosIsentos = [{ codigo: "13", beneficiario: depNaoCadastrado, fonte, valor: 1n }];
  },
  "ISE-FONTE": (e) => {
    e.rendimentosIsentos = [
      { codigo: "13", beneficiario: titular, fonte: fonteInvalida, valor: 1n },
    ];
  },
  "ISE-65-IDADE": (e) => {
    e.rendimentosIsentos = [{ codigo: "10", beneficiario: titular, fonte, valor: 100n }];
  },
  "ISE-65-LIMITE": (e) => {
    e.identificacao.dataNascimento = "1950-01-01";
    e.rendimentosIsentos = [
      { codigo: "10", beneficiario: titular, fonte, valor: 2000000n },
      { codigo: "10", beneficiario: titular, fonte, valor: 500000n },
    ];
  },
  "ISE-MOLESTIA": (e) => {
    e.rendimentosIsentos = [{ codigo: "11", beneficiario: titular, fonte, valor: 100n }];
  },
  "EXC-DEPENDENTE": (e) => {
    e.rendimentosExclusivos = [{ codigo: "11", beneficiario: depNaoCadastrado, fonte, valor: 1n }];
  },
  "EXC-FONTE": (e) => {
    e.rendimentosExclusivos = [
      { codigo: "11", beneficiario: titular, fonte: fonteInvalida, valor: 1n },
    ];
  },
  "SUS-DEPENDENTE": (e) => {
    e.rendimentosExigibilidadeSuspensa = [
      { beneficiario: depNaoCadastrado, fonte, rendimentos: 1n },
    ];
  },
  "SUS-FONTE": (e) => {
    e.rendimentosExigibilidadeSuspensa = [
      { beneficiario: titular, fonte: fonteInvalida, rendimentos: 1n },
    ];
  },
  "RRA-DEPENDENTE": (e) => {
    e.rendimentosAcumulados = [rra({ beneficiario: depNaoCadastrado })];
  },
  "RRA-FONTE": (e) => {
    e.rendimentosAcumulados = [rra({ fonte: fonteInvalida })];
  },
  "RRA-OPCAO": (e) => {
    e.rendimentosAcumulados = [rra({}), rra({ opcaoTributacao: "ajusteAnual" })];
  },
  "RRA-ISENTA-65": (e) => {
    e.rendimentosAcumulados = [rra({ parcelaIsenta65Anos: 10n })];
  },
  "RRA-PENSAO": (e) => {
    e.rendimentosAcumulados = [rra({ pensoes: [{ cpfAlimentando: CPF_ALIM, valor: 1n }] })];
  },
  "IMP-EXTERIOR": (e) => {
    e.impostoPago = { impostoPagoExterior: 100n };
  },
  "PAG-CODIGO": (e) => {
    e.pagamentos = [pagamento({ codigo: "40" })];
  },
  "PAG-PRESTADOR": (e) => {
    e.pagamentos = [pagamento({ niBeneficiario: undefined })];
  },
  "PAG-CNPJ": (e) => {
    e.pagamentos = [pagamento({ codigo: "26" })];
  },
  "PAG-PENSAO": (e) => {
    e.pagamentos = [pagamento({ codigo: "30", niBeneficiario: CPF_ALIM })];
  },
  "PAG-VINCULO": (e) => {
    e.pagamentos = [pagamento({ realizadoCom: depNaoCadastrado })];
  },
  "PAG-ALIMENTANDO-CODIGO": (e) => {
    e.alimentandos = [alimentando(CPF_ALIM)];
    e.pagamentos = [
      pagamento({ codigo: "60", realizadoCom: { tipo: "alimentando", cpf: CPF_ALIM } }),
    ];
  },
  "PAG-REEMBOLSO": (e) => {
    e.pagamentos = [pagamento({ parcelaNaoDedutivel: 60000n })];
  },
  "PAG-PROPRIO": (e) => {
    e.pagamentos = [pagamento({ niBeneficiario: CPF_TITULAR })];
  },
  "PAG-PATROCINADOR": (e) => {
    e.pagamentos = [
      pagamento({ codigo: "36", niBeneficiario: CNPJ_EMPRESA, contribuicaoPatrocinador: 1n }),
    ];
  },
  "DOA-BENEFICIARIO": (e) => {
    e.doacoesEfetuadas = [
      { codigo: "41", niBeneficiario: fonteInvalida.ni, nomeBeneficiario: "X", valor: 1n },
    ];
  },
  "DOA-REEMBOLSO": (e) => {
    e.doacoesEfetuadas = [
      {
        codigo: "41",
        niBeneficiario: CNPJ_EMPRESA,
        nomeBeneficiario: "X",
        valor: 1n,
        parcelaNaoDedutivel: 2n,
      },
    ];
  },
  "DDD-FUNDO": (e) => {
    e.doacoesDiretamenteNaDeclaracao = {
      eca: [{ tipoFundo: "estadual", uf: "SP", cnpjFundo: CNPJ_FUNDO_ECA_DF, valor: 1n }],
    };
  },
  "DDD-SIMPLIFICADO": (e) => {
    e.doacoesDiretamenteNaDeclaracao = {
      idoso: [{ tipoFundo: "nacional", cnpjFundo: CNPJ_EMPRESA, valor: 1n }],
    };
    e.resumo = { pix: true, opcaoTributacao: "descontoSimplificado" };
  },
  "PAR-CNPJ": (e) => {
    e.doacoesPartidos = [{ cnpj: fonteInvalida.ni, nome: "Partido", valor: 1n }];
  },
  "BEM-CODIGO": (e) => {
    e.bens = [bem({ codigo: "98" })];
  },
  "BEM-DEPENDENTE": (e) => {
    e.bens = [bem({ pertenceA: depNaoCadastrado })];
  },
  "BEM-NI": (e) => {
    e.bens = [bem({ ni: fonteInvalida.ni })];
  },
  "BEM-CNPJ-OBRIGATORIO": (e) => {
    e.bens = [bem({ grupo: "99", codigo: "08", situacaoAtual: 0n })];
  },
  "BEM-CNPJ-RECOMENDADO": (e) => {
    e.bens = [bem({ grupo: "03", codigo: "01" })];
  },
  "BEM-CONTA": (e) => {
    e.bens = [
      bem({
        grupo: "06",
        codigo: "01",
        ni: CNPJ_BANCO,
        conta: { banco: "999", agencia: "1", conta: "1" },
      }),
    ];
  },
  "BEM-CONTA-AVISO": (e) => {
    e.bens = [bem({ grupo: "06", codigo: "01", ni: CNPJ_BANCO })];
  },
  "BEM-CRIPTO": (e) => {
    e.bens = [bem({ grupo: "08", codigo: "02", codigoAltcoin: "XYZ" })];
  },
  "BEM-BOLSA": (e) => {
    e.bens = [bem({ grupo: "03", codigo: "01", ni: CNPJ_EMPRESA, negociadoEmBolsa: true })];
  },
  "BEM-SITUACAO": (e) => {
    e.bens = [bem({ codigo: "17", situacaoAnterior: 10n })];
  },
  "BEM-PARTILHA": (e) => {
    finalEspolio(e);
    e.bens = [bem({ partilha: [{ niHerdeiro: CPF_DEP1, percentualCentesimos: 5000 }] })];
  },
  "DIV-CODIGO": (e) => {
    e.dividas = [{ codigo: "99", discriminacao: "Dívida", situacaoAtual: 1000000n }];
  },
  "DIV-CREDOR": (e) => {
    e.dividas = [
      {
        codigo: "14",
        discriminacao: "Dívida",
        niCredor: fonteInvalida.ni,
        situacaoAtual: 1000000n,
      },
    ];
  },
  "DIV-VALOR-MINIMO": (e) => {
    e.dividas = [{ codigo: "11", discriminacao: "Empréstimo", situacaoAtual: 400000n }];
  },
  "CRZ-BEM-RENDIMENTO": (e) => {
    e.rendimentosIsentos = [
      { codigo: "12", beneficiario: titular, fonte: { ni: CNPJ_BANCO, nome: "Banco" }, valor: 1n },
    ];
  },
  "CRZ-CHAVE-BEM": (e) => {
    e.rendimentosIsentos = [{ codigo: "09", beneficiario: titular, fonte, valor: 1n, chaveBem: 7 }];
  },
  "ESP-FICHA": (e) => {
    e.identificacao.ocupacao = { natureza: "81" };
  },
  "ESP-INVENTARIANTE": (e) => {
    e.identificacao.ocupacao = { natureza: "81" };
    e.espolio = { inventariante: { cpf: CPF_TITULAR, nome: "Inventariante" } };
  },
  "DFE-FICHA": (e) => {
    finalEspolio(e);
    e.finalEspolio = undefined;
  },
  "DFE-PROCESSO": (e) => {
    finalEspolio(e);
    e.finalEspolio.tipoInventario = "decisaoJudicial";
  },
  "DFE-DATAS": (e) => {
    finalEspolio(e);
    e.finalEspolio.anoObito = 2026;
  },
  "DFE-CONJUGE": (e) => {
    finalEspolio(e);
    e.finalEspolio.conjuge = { obitoAmbos: true, inventarioConjunto: true };
  },
  "HER-NI": (e) => {
    finalEspolio(e);
    e.herdeiros = [{ ni: fonteInvalida.ni, nome: "Herdeiro" }];
  },
  "SAI-FICHA": (e) => {
    saida(e);
    e.saidaDefinitiva = undefined;
  },
  "SAI-PROCURADOR": (e) => {
    saida(e);
    e.saidaDefinitiva.paisDestino = "105";
  },
  "PAGTO-QUOTA-UNICA": (e) => {
    saida(e);
    e.resumo = { pix: true, quotas: 2 };
  },
  "CONJ-CPF": (e) => {
    e.informacoesConjuge = { cpf: cpfInvalido("111444777"), entregouDeclaracao: true };
  },
  "RV-PESSOA": (e) => {
    e.rendaVariavel = [{ beneficiario: titular, meses: [{ mes: 1 }, { mes: 1 }] }];
  },
  "AR-TABELAS": (e) => {
    e.atividadeRural = { brasil: { imoveis: [imovelRural({ atividade: "50" })] } };
  },
  "AR-PARTICIPANTES": (e) => {
    e.atividadeRural = { brasil: { imoveis: [imovelRural({ participacaoCentesimos: 5000 })] } };
  },
  "AR-MESES": (e) => {
    e.atividadeRural = { brasil: { receitasDespesas: [{ mes: 3 }, { mes: 3 }] } };
  },
  "AR-REBANHO": (e) => {
    e.atividadeRural = { brasil: { rebanho: [{ especie: "1", estoqueInicial: 5, vendas: 6 }] } };
  },
  "AR-COMPENSACAO": (e) => {
    e.atividadeRural = {
      brasil: { apuracao: { prejuizoAnterior: 10n, compensacaoPrejuizo: 20n } },
    };
  },
  "AR-CREDOR": (e) => {
    e.atividadeRural = {
      exterior: { dividas: [{ discriminacao: "Financiamento", niCredor: fonteInvalida.ni }] },
    };
  },
  "GC-DOCUMENTOS": (e) => {
    e.ganhosCapital = [{ cpfBeneficiario: CPF_DEP2 }];
  },
  "RES-CONTA": (e) => {
    e.resumo = { conta: { banco: "999", agencia: "1", conta: "1", dv: "1" } };
  },
  "RES-CONTA-AVISO": (e) => {
    e.resumo = { conta: { banco: "341", agencia: "2545", conta: "02366", dv: "2" } };
  },
  "RES-DEBITO": (e) => {
    e.resumo = { pix: true, debitoAutomatico: true };
  },
  "RES-DEBITO-CONVENIO": (e) => {
    e.resumo = {
      debitoAutomatico: true,
      conta: { banco: "025", agencia: "1", conta: "1", dv: "1" },
    };
  },
  "RES-RESTITUICAO": (e) => {
    e.resumo = {};
  },
  "RES-QUOTAS": (e) => {
    e.resumo = { pix: true, quotas: 2 };
    e.resumoCalculado = { impostoAPagar: 5000n };
  },
};

function rra(extra: Record<string, unknown>) {
  return {
    beneficiario: titular,
    opcaoTributacao: "exclusivaNaFonte",
    fonte,
    rendimentos: 100000n,
    mesRecebimento: 5,
    numeroMeses: 12,
    ...extra,
  };
}

function imovelRural(extra: Record<string, unknown>) {
  return {
    atividade: "10",
    nome: "Sítio Sintético",
    localizacao: "Zona rural",
    areaDecimosHa: 100,
    condicaoExploracao: "1",
    participacaoCentesimos: 10000,
    ...extra,
  };
}

describe("validarDeclaracao", () => {
  it("não aponta pendências na declaração base consistente", () => {
    expect(rodar()).toEqual([]);
  });

  it("tem um cenário de teste para cada regra do catálogo", () => {
    expect(Object.keys(CENARIOS).sort()).toEqual(REGRAS.map((r) => r.codigo).sort());
  });

  it("documenta fonte, descrição e gravidade de cada regra, com códigos únicos", () => {
    const codigosRegras = REGRAS.map((r) => r.codigo);
    expect(new Set(codigosRegras).size).toBe(codigosRegras.length);
    for (const r of REGRAS) {
      expect(r.fonte.length).toBeGreaterThan(5);
      expect(r.descricao.length).toBeGreaterThan(10);
      expect(["erro", "aviso"]).toContain(r.gravidade);
    }
  });

  for (const r of REGRAS) {
    it(`dispara ${r.codigo} (${r.gravidade})`, () => {
      const cenario = CENARIOS[r.codigo];
      expect(cenario).toBeDefined();
      const pendencias = rodar(cenario);
      const achada = pendencias.find((p) => p.codigo === r.codigo);
      expect(achada, `pendências: ${codigos(pendencias).join(", ")}`).toBeDefined();
      expect(achada?.gravidade).toBe(r.gravidade);
      expect(achada?.ficha).toBe(r.ficha);
      expect(achada?.mensagem.length).toBeGreaterThan(5);
      expect(achada?.caminho.length).toBeGreaterThan(3);
    });
  }
});

describe("casos que não devem gerar pendência", () => {
  it("dependente, alimentando e pagamentos coerentes", () => {
    const p = rodar((e) => {
      e.dependentes = [dependente(CPF_DEP1)];
      e.alimentandos = [alimentando(CPF_ALIM)];
      e.pagamentos = [
        pagamento({}),
        pagamento({
          codigo: "21",
          niBeneficiario: CNPJ_HOSPITAL,
          realizadoCom: { tipo: "dependente", cpf: CPF_DEP1 },
        }),
        pagamento({
          codigo: "30",
          niBeneficiario: CPF_ALIM,
          realizadoCom: { tipo: "alimentando", cpf: CPF_ALIM },
        }),
        pagamento({
          codigo: "15",
          niBeneficiario: undefined,
          nomeBeneficiario: "Doctor Abroad",
          pais: "249",
        }),
      ];
    });
    expect(p).toEqual([]);
  });

  it("rendimento de aplicação com bem do mesmo CNPJ e conta coerente", () => {
    const p = rodar((e) => {
      e.bens = [
        bem({
          grupo: "04",
          codigo: "01",
          ni: CNPJ_BANCO,
          conta: { banco: "341", agencia: "2545", conta: "02366", dv: "1" },
        }),
      ];
      e.rendimentosIsentos = [
        {
          codigo: "12",
          beneficiario: titular,
          fonte: { ni: CNPJ_BANCO, nome: "Banco" },
          valor: 1n,
        },
      ];
    });
    expect(p).toEqual([]);
  });

  it("fundos do ECA estadual e municipal da tabela", () => {
    const p = rodar((e) => {
      e.doacoesDiretamenteNaDeclaracao = {
        eca: [
          { tipoFundo: "estadual", uf: "SP", cnpjFundo: CNPJ_FUNDO_ECA_SP, valor: 1n },
          {
            tipoFundo: "municipal",
            uf: "SP",
            municipio: "Águas da Prata",
            cnpjFundo: "18740328000100",
            valor: 1n,
          },
        ],
      };
    });
    expect(p).toEqual([]);
  });

  it("declaração final de espólio e de saída definitiva completas", () => {
    expect(
      rodar((e) => {
        finalEspolio(e);
        e.bens = [bem({ partilha: [{ niHerdeiro: CPF_DEP1, percentualCentesimos: 10000 }] })];
      }),
    ).toEqual([]);
    expect(rodar(saida)).toEqual([]);
  });

  it("parcela isenta de 65 anos dentro do limite", () => {
    const p = rodar((e) => {
      e.identificacao.dataNascimento = "1955-01-01";
      e.rendimentosIsentos = [
        { codigo: "10", beneficiario: titular, fonte, valor: 2284776n, decimoTerceiro: 190398n },
      ];
    });
    expect(p).toEqual([]);
  });
});

describe("separação entre erros e avisos", () => {
  it("separa e decide se pode entregar", () => {
    const pendencias = rodar((e) => {
      e.dependentes = [dependente(cpfInvalido("123456789"))];
      e.dividas = [{ codigo: "11", discriminacao: "Empréstimo", situacaoAtual: 400000n }];
    });
    const { erros, avisos } = separarPendencias(pendencias);
    expect(codigos(erros)).toEqual(["DEP-CPF"]);
    expect(codigos(avisos)).toEqual(["DIV-VALOR-MINIMO"]);
    expect(podeEntregar(pendencias)).toBe(false);
    expect(podeEntregar(avisos)).toBe(true);
  });

  it("aponta o caminho do campo com problema", () => {
    const [p] = rodar((e) => {
      e.dependentes = [dependente(CPF_DEP1), dependente(cpfInvalido("987654321"))];
    });
    expect(p).toMatchObject({
      codigo: "DEP-CPF",
      caminho: "dependentes[1].cpf",
      ficha: "dependentes",
    });
    expect(cpf("987654321")).toBe(CPF_DEP2);
  });
});
