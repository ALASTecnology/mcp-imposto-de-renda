/**
 * Atividade Rural (registros 50 a 57): ida e volta, controles, regravação sobre a base e as
 * fórmulas da apuração conferidas à mão. Dados fictícios.
 */
import { describe, expect, it } from "vitest";
import { modeloParaRegistros, registrosParaModelo } from "../../src/conversao/index.js";
import type { Registro } from "../../src/dbk/codec.js";
import { gravarArquivo, lerArquivo, verificarControles } from "../../src/dbk/index.js";
import { type DeclaracaoEntrada, zDeclaracao } from "../../src/model/index.js";
import { calcularDvCnpj, calcularDvCpf } from "../../src/validate/index.js";

const TITULAR = `123456789${calcularDvCpf("123456789")}`;
const PARCEIRO = `987654321${calcularDvCpf("987654321")}`;
const EMPRESA = `112223330001${calcularDvCnpj("112223330001")}`;

function entrada(): DeclaracaoEntrada {
  return {
    identificacao: {
      cpf: TITULAR,
      nome: "FULANA FICTICIA",
      dataNascimento: "1980-01-15",
      tipoDeclaracao: { tipo: "ajusteAnual" },
      racaCor: "2",
      endereco: {
        local: "brasil",
        tipoLogradouro: "RUA",
        logradouro: "DAS ACACIAS FICTICIAS",
        numero: "10",
        bairro: "CENTRO",
        uf: "DF",
        municipio: "9701",
        cep: "70040010",
      },
      ocupacao: { natureza: "12", ocupacaoPrincipal: "212" },
    },
    atividadeRural: {
      brasil: {
        imoveis: [
          {
            atividade: "10",
            nome: "FAZENDA FICTICIA",
            localizacao: "ZONA RURAL DE BRASILIA DF",
            cib: "12345678",
            areaDecimosHa: 1255,
            condicaoExploracao: "2",
            participacaoCentesimos: 5000,
            participantes: [
              { ni: PARCEIRO, nome: "PARCEIRO FICTICIO" },
              { nome: "PARCEIRO ESTRANGEIRO", estrangeiro: true },
            ],
          },
        ],
        receitasDespesas: [
          { mes: 1, receitaBruta: 10_000_000, despesa: 4_000_000 },
          { mes: 7, receitaBruta: 5_000_000, despesa: 3_000_000 },
        ],
        apuracao: {
          prejuizoAnterior: 2_000_000,
          compensacaoPrejuizo: 1_500_000,
          adiantamentosRecebidos: 10_000,
        },
        rebanho: [
          {
            especie: "1",
            estoqueInicial: 100,
            aquisicoes: 10,
            nascimentos: 20,
            consumoPerdas: 5,
            vendas: 30,
          },
        ],
        dividas: [
          {
            discriminacao: "FINANCIAMENTO RURAL",
            situacaoAnterior: 100_000,
            situacaoAtual: 50_000,
            valorPago: 50_000,
          },
        ],
      },
      exterior: {
        imoveis: [
          {
            atividade: "11",
            nome: "CHACRA FICTICIA",
            localizacao: "ASSUNCAO PARAGUAI",
            areaDecimosHa: 300,
            condicaoExploracao: "1",
            participacaoCentesimos: 10000,
          },
        ],
        receitasDespesas: [
          {
            pais: "586",
            receitaBrutaMoedaOriginal: 1_000_000,
            despesaMoedaOriginal: 1_200_000,
            resultadoDolar: -20_000,
          },
        ],
        apuracao: { prejuizoAnterior: 10_000, opcao: "resultado" },
      },
      bens: [
        {
          codigo: "01",
          pais: "105",
          discriminacao: "TRATOR FICTICIO",
          situacaoAnterior: 8_000_000,
          situacaoAtual: 7_000_000,
        },
      ],
    },
  };
}

const doTipo = (rs: readonly Registro[], t: string) => rs.filter((r) => r.tipo === t);

describe("Atividade Rural: registros 50 a 57", () => {
  const dec = zDeclaracao.parse(entrada());
  const rs = modeloParaRegistros(dec).registros;

  it("ida e volta: o mesmo modelo, controles conferem", () => {
    const lidos = lerArquivo(gravarArquivo(rs)).registros;
    expect(verificarControles(lidos).valido).toBe(true);
    const l = registrosParaModelo(lidos);
    expect(l.tiposNaoMapeados).toEqual([]);
    expect(zDeclaracao.parse(l.declaracao).atividadeRural).toEqual(dec.atividadeRural);
  });

  it("regravar sobre a base devolve os mesmos registros", () => {
    const de = modeloParaRegistros(dec, {
      base: rs,
      totais: "preservar",
      controles: { controleHeader: "preservar" },
    });
    expect(de.registros).toEqual(rs);
  });

  it("apuração Brasil: resultado, limite de 20%, compensação e saldo", () => {
    const ap = doTipo(rs, "52").find((r) => r.campos.IN_EXTERIOR === 0n)?.campos;
    expect(ap?.VR_RECTOTAL).toBe(15_000_000n);
    expect(ap?.VR_DESPTOTAL).toBe(7_000_000n);
    expect(ap?.VR_RES1REAL).toBe(8_000_000n);
    expect(ap?.VR_OPCAO).toBe(3_000_000n);
    expect(ap?.VR_RESTRIB).toBe(6_500_000n);
    expect(ap?.VR_PREJUIZO).toBe(500_000n);
    expect(ap?.VR_RESNAOTRIBAR).toBe(0n);
  });

  it("apuração exterior: resultado negativo em reais soma ao saldo de prejuízo", () => {
    const ap = doTipo(rs, "52").find((r) => r.campos.IN_EXTERIOR === 1n)?.campos;
    // -200,00 US$ x 5,5018 = -1.100,36
    expect(ap?.VR_RES1DOLAR).toBe(-20_000n);
    expect(ap?.VR_RES1REAL).toBe(-110_036n);
    expect(ap?.VR_RESTRIB).toBe(0n);
    expect(ap?.VR_PREJUIZO).toBe(120_036n);
    expect(doTipo(rs, "56")[0]?.campos.RESORIGINAL).toBe(-200_000n);
  });

  it("rebanho com estoque final e participantes ligados ao imóvel", () => {
    expect(doTipo(rs, "53")[0]?.campos.QT_ESTFINAL).toBe(9_500n);
    expect(doTipo(rs, "57").map((r) => r.campos.NR_CHAVE_AR)).toEqual([1n, 1n]);
    expect(doTipo(rs, "50").map((r) => r.campos.NR_CHAVE_AR)).toEqual([1n, 2n]);
  });

  it("opção pelo limite de 20% não deixa saldo de prejuízo", () => {
    const e = entrada();
    const ar = e.atividadeRural;
    if (ar?.brasil?.apuracao)
      ar.brasil.apuracao = { prejuizoAnterior: 2_000_000, opcao: "limite20" };
    const r = modeloParaRegistros(zDeclaracao.parse(e)).registros;
    const ap = doTipo(r, "52").find((x) => x.campos.IN_EXTERIOR === 0n)?.campos;
    expect(ap?.VR_RESTRIB).toBe(3_000_000n);
    expect(ap?.VR_PREJUIZO).toBe(0n);
    expect(ap?.VR_RESNAOTRIBAR).toBe(5_000_000n);
    expect(ap?.IN_OPC_APURRESTRIB).toBe(1n);
  });

  it("sem demonstrativo não grava registros e a leitura deixa a ficha ausente", () => {
    const d = zDeclaracao.parse({ ...entrada(), atividadeRural: undefined, bens: [] });
    const r = modeloParaRegistros(d).registros;
    expect(r.some((x) => /^5[0-7]$/.test(x.tipo))).toBe(false);
    expect(zDeclaracao.parse(registrosParaModelo(r).declaracao).atividadeRural).toBeUndefined();
    expect(EMPRESA).toHaveLength(14);
  });
});
