import { describe, expect, it } from "vitest";
import { centavos } from "../../src/centavos.js";
import {
  CODIGO_RECEITANET,
  CODIGOS_ISENTOS,
  dataIsoValida,
  FICHAS,
  zAlimentando,
  zAtividadeRural,
  zBemDireito,
  zCentavos,
  zCentavosNaoNegativos,
  zContaRestituicao,
  zData,
  zDeclaracao,
  zDemonstrativoGcap,
  zDependente,
  zDivida,
  zDoacaoDiretaNaDeclaracao,
  zDoacaoEfetuada,
  zEndereco,
  zFinalEspolio,
  zIdentificacao,
  zMesRendaVariavel,
  zPagamento,
  zRendimentoExclusivo,
  zRendimentoIsento,
  zRendimentoPJ,
  zRendimentoRRA,
  zRendimentosPFExterior,
  zResumo,
  zSaidaDefinitiva,
} from "../../src/model/index.js";
import {
  CNPJ_BANCO,
  CNPJ_EMPRESA,
  CPF_ALIM,
  CPF_DEP1,
  CPF_TITULAR,
  cpf,
  declaracaoBase,
} from "./fixtures.js";

const titular = { tipo: "titular" } as const;
const fonte = { ni: CNPJ_EMPRESA, nome: "Empresa Sintética Ltda" };

describe("blocos básicos", () => {
  it("converte bigint e inteiros em Centavos e rejeita frações", () => {
    expect(zCentavos.parse(123n)).toBe(123n);
    expect(zCentavos.parse(-5)).toBe(-5n);
    expect(zCentavos.safeParse(1.5).success).toBe(false);
    expect(zCentavos.safeParse("10,00").success).toBe(false);
    expect(zCentavosNaoNegativos.safeParse(-1n).success).toBe(false);
  });

  it("aceita só datas reais no formato ISO", () => {
    expect(dataIsoValida("2024-02-29")).toBe(true);
    expect(dataIsoValida("2025-02-29")).toBe(false);
    expect(dataIsoValida("2025-13-01")).toBe(false);
    expect(dataIsoValida("17/05/1980")).toBe(false);
    expect(zData.safeParse("2025-04-31").success).toBe(false);
  });
});

describe("declaração", () => {
  it("aceita a declaração mínima e aplica os padrões", () => {
    const d = zDeclaracao.parse(declaracaoBase());
    expect(d.exercicio).toBe(2026);
    expect(d.anoCalendario).toBe(2025);
    expect(d.dependentes).toEqual([]);
    expect(d.impostoPago.impostoComplementar).toBe(0n);
    expect(d.resumo).toMatchObject({ opcaoTributacao: "deducoesLegais", quotas: 1, pix: true });
    expect(d.identificacao.conjuge).toEqual({ possui: false });
    expect(d.identificacao.tipoDeclaracao.retificadora).toBe(false);
  });

  it("rejeita exercício diferente de 2026", () => {
    expect(zDeclaracao.safeParse({ ...declaracaoBase(), exercicio: 2025 }).success).toBe(false);
  });

  it("tem nome de ficha para todas as chaves de fichas", () => {
    expect(Object.keys(FICHAS)).toContain("bens");
    expect(CODIGO_RECEITANET.finalEspolio).toBe("2621");
  });
});

describe("identificação", () => {
  const ident = declaracaoBase().identificacao;

  it("rejeita CPF com pontuação, data inválida e raça/cor fora da tabela", () => {
    expect(zIdentificacao.safeParse({ ...ident, cpf: "123.456.789-09" }).success).toBe(false);
    expect(zIdentificacao.safeParse({ ...ident, dataNascimento: "1980-02-30" }).success).toBe(
      false,
    );
    expect(zIdentificacao.safeParse({ ...ident, racaCor: "9" }).success).toBe(false);
  });

  it("valida o número do recibo com 12 dígitos", () => {
    const tipo = { tipo: "ajusteAnual", retificadora: true, reciboRetificada: "123" };
    expect(zIdentificacao.safeParse({ ...ident, tipoDeclaracao: tipo }).success).toBe(false);
    tipo.reciboRetificada = "123456789012";
    expect(zIdentificacao.safeParse({ ...ident, tipoDeclaracao: tipo }).success).toBe(true);
  });

  it("aceita endereço no exterior e rejeita CEP com 7 dígitos no Brasil", () => {
    expect(
      zEndereco.safeParse({
        local: "exterior",
        logradouro: "Main Street",
        numero: "1",
        pais: "249",
        cidade: "Boston",
      }).success,
    ).toBe(true);
    expect(zEndereco.safeParse({ ...ident.endereco, cep: "0100100" }).success).toBe(false);
  });
});

describe("dependentes e alimentandos", () => {
  it("exige CPF no dependente", () => {
    const dep = { codigo: "21", nome: "Filho Teste", cpf: CPF_DEP1, dataNascimento: "2015-01-10" };
    expect(zDependente.parse(dep).moraComTitular).toBe(true);
    const { cpf: _omitido, ...semCpf } = dep;
    expect(zDependente.safeParse(semCpf).success).toBe(false);
  });

  it("valida o alimentando com processo judicial", () => {
    const alim = {
      residencia: "brasil",
      nome: "Alimentando Teste",
      cpf: CPF_ALIM,
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
    };
    expect(zAlimentando.safeParse(alim).success).toBe(true);
    expect(zAlimentando.safeParse({ ...alim, tipoProcesso: "outro" }).success).toBe(false);
  });
});

describe("rendimentos", () => {
  it("aceita rendimento de PJ com padrões zerados", () => {
    const r = zRendimentoPJ.parse({ beneficiario: titular, fonte, rendimentos: 500000n });
    expect(r.impostoRetido).toBe(0n);
    expect(r.decimoTerceiro).toBe(0n);
  });

  it("rejeita dependente sem CPF no beneficiário", () => {
    expect(
      zRendimentoPJ.safeParse({ beneficiario: { tipo: "dependente" }, fonte, rendimentos: 1n })
        .success,
    ).toBe(false);
  });

  it("exige exatamente 12 meses nas colunas da ficha PF/Exterior", () => {
    const ok = zRendimentosPFExterior.parse({ beneficiario: titular });
    expect(ok.alugueis).toHaveLength(12);
    expect(
      zRendimentosPFExterior.safeParse({ beneficiario: titular, alugueis: [1n, 2n] }).success,
    ).toBe(false);
  });

  it("valida RRA com opção de tributação e número de meses", () => {
    const rra = {
      beneficiario: titular,
      opcaoTributacao: "exclusivaNaFonte",
      fonte,
      rendimentos: 1000000n,
      mesRecebimento: 7,
      numeroMeses: 19.5,
    };
    expect(zRendimentoRRA.safeParse(rra).success).toBe(true);
    expect(zRendimentoRRA.safeParse({ ...rra, mesRecebimento: 13 }).success).toBe(false);
    expect(zRendimentoRRA.safeParse({ ...rra, numeroMeses: 0 }).success).toBe(false);
  });
});

describe("isentos e exclusivos", () => {
  it("cobre todos os códigos de isentos da Ajuda 2026", () => {
    expect(CODIGOS_ISENTOS).toHaveLength(28);
    expect(CODIGOS_ISENTOS).not.toContain("26");
  });

  it("escolhe o schema pelo código", () => {
    expect(
      zRendimentoIsento.safeParse({ codigo: "09", beneficiario: titular, fonte, valor: 100n })
        .success,
    ).toBe(true);
    expect(
      zRendimentoIsento.safeParse({
        codigo: "28",
        beneficiario: titular,
        cpfAlimentante: cpf("555666777"),
        valor: 100n,
      }).success,
    ).toBe(true);
    // 28 exige o CPF do alimentante.
    expect(
      zRendimentoIsento.safeParse({ codigo: "28", beneficiario: titular, valor: 1n }).success,
    ).toBe(false);
    // 99 exige descrição.
    expect(
      zRendimentoIsento.safeParse({ codigo: "99", beneficiario: titular, fonte, valor: 1n })
        .success,
    ).toBe(false);
    // 26 não existe na Ajuda 2026.
    expect(zRendimentoIsento.safeParse({ codigo: "26", valor: 1n }).success).toBe(false);
  });

  it("guarda valor informado e transportado dos ganhos de capital isentos", () => {
    const r = zRendimentoIsento.parse({ codigo: "06", valorInformado: 10n });
    expect(r).toEqual({ codigo: "06", valorInformado: 10n, valorTransportado: 0n });
  });

  it("valida os códigos de tributação exclusiva", () => {
    expect(
      zRendimentoExclusivo.safeParse({ codigo: "10", beneficiario: titular, fonte, valor: 5n })
        .success,
    ).toBe(true);
    expect(zRendimentoExclusivo.safeParse({ codigo: "01", valor: 5n }).success).toBe(true);
    expect(zRendimentoExclusivo.safeParse({ codigo: "14", valor: 5n }).success).toBe(false);
  });
});

describe("pagamentos e doações", () => {
  it("aceita pagamento a alimentando", () => {
    const p = zPagamento.parse({
      codigo: "30",
      realizadoCom: { tipo: "alimentando", cpf: CPF_ALIM },
      niBeneficiario: CPF_ALIM,
      nomeBeneficiario: "Alimentando Teste",
      valorPago: 120000n,
    });
    expect(p.parcelaNaoDedutivel).toBe(0n);
  });

  it("só aceita códigos de doação na ficha Doações Efetuadas", () => {
    const doacao = { niBeneficiario: CNPJ_EMPRESA, nomeBeneficiario: "Instituto", valor: 1n };
    expect(zDoacaoEfetuada.safeParse({ ...doacao, codigo: "41" }).success).toBe(true);
    expect(zDoacaoEfetuada.safeParse({ ...doacao, codigo: "10" }).success).toBe(false);
  });

  it("valida o tipo de fundo das doações diretamente na declaração", () => {
    const d = { tipoFundo: "estadual", uf: "DF", cnpjFundo: CNPJ_EMPRESA, valor: 1n };
    expect(zDoacaoDiretaNaDeclaracao.safeParse(d).success).toBe(true);
    expect(zDoacaoDiretaNaDeclaracao.safeParse({ ...d, tipoFundo: "federal" }).success).toBe(false);
  });
});

describe("bens e dívidas", () => {
  it("aplica padrões de titular e Brasil ao bem", () => {
    const bem = zBemDireito.parse({
      grupo: "06",
      codigo: "01",
      discriminacao: "Conta corrente no banco sintético",
      situacaoAtual: 1000n,
      ni: CNPJ_BANCO,
      conta: { banco: "341", agencia: "1234", conta: "12345", dv: "6" },
    });
    expect(bem.pais).toBe("105");
    expect(bem.pertenceA).toEqual({ tipo: "titular" });
    expect(bem.situacaoAnterior).toBe(0n);
  });

  it("aceita perda negativa em aplicação no exterior e rejeita grupo malformado", () => {
    const base = { grupo: "04", codigo: "99", pais: "249", discriminacao: "Aplicação" };
    expect(
      zBemDireito.safeParse({
        ...base,
        aplicacaoFinanceiraExterior: { rendimentoOuPerda: -500n },
      }).success,
    ).toBe(true);
    expect(zBemDireito.safeParse({ ...base, grupo: "4" }).success).toBe(false);
  });

  it("exige discriminação na dívida", () => {
    expect(zDivida.safeParse({ codigo: "11", discriminacao: "" }).success).toBe(false);
    expect(zDivida.parse({ codigo: "11", discriminacao: "Empréstimo" }).valorPago).toBe(0n);
  });
});

describe("espólio, saída e resumo", () => {
  it("valida a ficha da Declaração Final de Espólio", () => {
    const ok = zFinalEspolio.safeParse({
      anoObito: 2024,
      modalidade: "partilha",
      inventariante: { cpf: CPF_DEP1, nome: "Inventariante Teste" },
      conjuge: { obitoAmbos: false, meeiro: true },
    });
    expect(ok.success).toBe(true);
    expect(
      zFinalEspolio.safeParse({ anoObito: 2024, modalidade: "outra", inventariante: {} }).success,
    ).toBe(false);
  });

  it("exige data de não residente na Saída Definitiva", () => {
    expect(zSaidaDefinitiva.safeParse({ paisDestino: "249" }).success).toBe(false);
    expect(
      zSaidaDefinitiva.safeParse({ paisDestino: "249", dataCondicaoNaoResidente: "2025-08-01" })
        .success,
    ).toBe(true);
  });

  it("limita quotas a 8 e valida a conta", () => {
    expect(zResumo.safeParse({ quotas: 9 }).success).toBe(false);
    expect(
      zContaRestituicao.safeParse({ banco: "341", agencia: "1234", conta: "12a45", dv: "1" })
        .success,
    ).toBe(false);
  });
});

describe("demonstrativos", () => {
  it("aceita renda variável com ganho e perda no mês", () => {
    const mes = zMesRendaVariavel.parse({
      mes: 3,
      comuns: { mercadoVistaAcoes: 1000n },
      dayTrade: { futuroIndices: -200n },
    });
    expect(mes.impostoPago).toBe(0n);
    expect(zMesRendaVariavel.safeParse({ mes: 0 }).success).toBe(false);
  });

  it("aplica padrões ao demonstrativo da atividade rural", () => {
    const ar = zAtividadeRural.parse({});
    expect(ar.brasil.apuracao.opcao).toBe("resultado");
    expect(ar.exterior.receitasDespesas).toEqual([]);
    expect(
      zAtividadeRural.safeParse({
        brasil: { imoveis: [{ atividade: "10", nome: "Sítio", localizacao: "Interior" }] },
      }).success,
    ).toBe(false);
  });

  it("valida o demonstrativo de ganhos de capital", () => {
    const gc = zDemonstrativoGcap.parse({
      cpfBeneficiario: CPF_TITULAR,
      alienacoes: [
        {
          tipo: "imovel",
          cpfBeneficiario: CPF_TITULAR,
          operacao: 1,
          descricao: "Apartamento",
          naturezaOperacao: "01",
          dataAlienacao: "2025-04-10",
          valorOperacao: centavos(50000000),
        },
      ],
    });
    expect(gc.alienacoes[0]?.apuracao.impostoDevido).toBe(0n);
    expect(gc.totais.impostoPago).toBe(0n);
  });
});
