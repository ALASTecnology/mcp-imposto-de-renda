/**
 * Ganhos de Capital (registros 60 a 78): ida e volta, controles, regravação sobre a base e
 * preservação dos tipos que o modelo não descreve. Dados fictícios.
 */
import { describe, expect, it } from "vitest";
import { modeloParaRegistros, registrosParaModelo } from "../../src/conversao/index.js";
import {
  criarRegistro,
  gravarArquivo,
  LEIAUTE_2026,
  lerArquivo,
  verificarControles,
} from "../../src/dbk/index.js";
import { type DeclaracaoEntrada, zDeclaracao } from "../../src/model/index.js";
import { calcularDvCnpj, calcularDvCpf } from "../../src/validate/index.js";

const TITULAR = `012345678${calcularDvCpf("012345678")}`;
const COMPRADOR = `987654321${calcularDvCpf("987654321")}`;
const SOCIEDADE = `012223330001${calcularDvCnpj("012223330001")}`;

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
    ganhosCapital: [
      {
        cpfBeneficiario: TITULAR,
        alienacoes: [
          {
            tipo: "imovel",
            cpfBeneficiario: TITULAR,
            operacao: 1,
            descricao: "APARTAMENTO FICTICIO",
            naturezaOperacao: "01",
            dataAlienacao: "2025-05-10",
            dataAquisicao: "2005-03-01",
            valorOperacao: 50_000_000,
            uf: "DF",
            municipio: "9701",
            residencial: true,
            valorAplicadoOutroImovel: 10_000_000,
            adquirentes: [{ ni: COMPRADOR, nome: "COMPRADOR FICTICIO" }],
            reformas: [{ data: "2010-01-15", valor: 2_000_000 }],
            apuracao: {
              valorAlienacao: 50_000_000,
              custoCorretagem: 1_000_000,
              custoAquisicao: 20_000_000,
              ganhoCapital: 15_000_000,
              reducoes: 14_000_000,
              impostoDevido: 2_250_000,
              impostoPago: 2_250_000,
              rendimentoExclusivo: 15_000_000,
            },
          },
          {
            tipo: "movel",
            cpfBeneficiario: TITULAR,
            operacao: 2,
            descricao: "VEICULO FICTICIO",
            naturezaOperacao: "01",
            dataAlienacao: "2025-08-01",
            dataAquisicao: "2020-01-01",
            valorOperacao: 8_000_000,
            possuiRegistroPublico: true,
            apuracao: {
              valorAlienacao: 8_000_000,
              custoAquisicao: 6_000_000,
              ganhoCapital: 2_000_000,
            },
          },
          {
            tipo: "participacaoSocietaria",
            cpfBeneficiario: TITULAR,
            operacao: 3,
            descricao: "SOCIEDADE FICTICIA LTDA",
            naturezaOperacao: "01",
            dataAlienacao: "2025-09-01",
            valorOperacao: 3_000_000,
            cnpjSociedade: SOCIEDADE,
            especie: "4",
            impostoRetidoFonte: 1_000,
            apuracao: {
              valorAlienacao: 3_000_000,
              custoAquisicao: 1_000_000,
              ganhoCapital: 2_000_000,
            },
          },
        ],
        moedaEspecie: [
          {
            moeda: "VENEZUE",
            tipoOperacao: "compra",
            data: "2025-02-01",
            quantidade: 100_000,
            valorReais: 50_000,
          },
          {
            moeda: "VENEZUE",
            tipoOperacao: "venda",
            data: "2025-03-01",
            quantidade: 50_000,
            valorReais: 30_000,
            adquirente: { ni: COMPRADOR, nome: "COMPRADOR FICTICIO" },
          },
        ],
        totais: {
          rendimentoExclusivo: 19_000_000,
          isentoReducao: 14_000_000,
          impostoPago: 2_250_000,
        },
      },
    ],
  };
}

describe("Ganhos de Capital: registros 60 a 78", () => {
  const dec = zDeclaracao.parse(entrada());
  const g = modeloParaRegistros(dec);

  it("ida e volta com o mesmo demonstrativo e controles válidos", () => {
    const lidos = lerArquivo(gravarArquivo(g.registros)).registros;
    expect(verificarControles(lidos).valido).toBe(true);
    const l = registrosParaModelo(lidos);
    expect(l.tiposNaoMapeados).toEqual([]);
    expect(zDeclaracao.parse(l.declaracao).ganhosCapital).toEqual(dec.ganhosCapital);
  });

  it("grava os registros e as ligações por beneficiário e operação", () => {
    const tipos = g.registros.map((r) => r.tipo).filter((t) => /^[67]\d$/.test(t));
    expect(tipos).toEqual(["60", "61", "62", "63", "65", "66", "68", "69", "74", "74"]);
    const r68 = g.registros.find((r) => r.tipo === "68")?.campos;
    expect(r68?.VR_RESULTADO_1_APURACAO).toBe(29_000_000n);
    expect(r68?.VR_RESULTADO_5_APURACAO).toBe(15_000_000n);
    expect(r68?.NR_CPF_BENEFICIARIO).toBe(BigInt(TITULAR));
  });

  it("regravar sobre a base devolve os mesmos registros", () => {
    const de = modeloParaRegistros(dec, {
      base: g.registros,
      totais: "preservar",
      controles: { controleHeader: "preservar" },
    });
    expect(de.registros).toEqual(g.registros);
  });

  it("preserva tipos do GCAP sem correspondência no modelo", () => {
    const parcela = criarRegistro(LEIAUTE_2026, "71", { NR_OPERACAO: 1n, VR_VALOR: 1_000n });
    const base = [...g.registros.slice(0, -1), parcela, ...g.registros.slice(-1)];
    const de = modeloParaRegistros(dec, { base });
    expect(de.tiposPreservados).toEqual(["71"]);
    expect(de.registros.filter((r) => r.tipo === "71")).toHaveLength(1);
    expect(verificarControles(de.registros).valido).toBe(true);
  });
});
