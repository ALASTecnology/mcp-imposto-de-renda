/**
 * Importação da declaração do exercício anterior (Importar dados da Declaração de 2025): o
 * arquivo de 2025 é lido com o leiaute de 2025 e só os dados que o programa recupera passam
 * para a de 2026 (Ajuda, pág. 373; nota 08 M-IMP-ANO-ANTERIOR). Dados fictícios.
 */
import { describe, expect, it } from "vitest";
import {
  migrarDeclaracaoAnterior,
  modeloParaRegistros,
  registrosParaModelo,
} from "../../src/conversao/index.js";
import type { Registro } from "../../src/dbk/codec.js";
import { gravarArquivo, LEIAUTES, lerArquivo } from "../../src/dbk/index.js";
import { type DeclaracaoEntrada, zDeclaracao } from "../../src/model/index.js";
import { calcularDvCnpj, calcularDvCpf } from "../../src/validate/index.js";

const TITULAR = `123456789${calcularDvCpf("123456789")}`;
const FILHO = `987654321${calcularDvCpf("987654321")}`;
const EMPRESA = `112223330001${calcularDvCnpj("112223330001")}`;

function declaracao2025(): DeclaracaoEntrada {
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
    dependentes: [
      { codigo: "21", nome: "FILHO FICTICIO", cpf: FILHO, dataNascimento: "2015-06-01" },
    ],
    rendimentosPJ: [
      {
        beneficiario: { tipo: "titular" },
        fonte: { ni: EMPRESA, nome: "EMPRESA FICTICIA" },
        rendimentos: 8_000_000,
        impostoRetido: 900_000,
      },
    ],
    pagamentos: [
      {
        codigo: "10",
        niBeneficiario: EMPRESA,
        nomeBeneficiario: "CLINICA FICTICIA",
        valorPago: 250_000,
      },
    ],
    bens: [
      {
        grupo: "01",
        codigo: "11",
        discriminacao: "APARTAMENTO FICTICIO",
        situacaoAnterior: 30_000_000,
        situacaoAtual: 31_000_000,
      },
      {
        grupo: "06",
        codigo: "01",
        discriminacao: "CONTA ENCERRADA",
        ni: EMPRESA,
        situacaoAnterior: 10_000,
        situacaoAtual: 0,
      },
    ],
    dividas: [
      {
        codigo: "11",
        discriminacao: "EMPRESTIMO FICTICIO",
        situacaoAnterior: 500_000,
        situacaoAtual: 200_000,
        valorPago: 300_000,
      },
    ],
  };
}

/**
 * Arquivo sintético de 2025: os registros gerados no leiaute de 2026 são levados ao de 2025
 * campo a campo (campos que não existem em 2025 caem; os que só existem em 2025 ficam em branco).
 */
function arquivo2025(entrada: DeclaracaoEntrada): Uint8Array {
  const dec = zDeclaracao.parse(entrada);
  const leiaute = LEIAUTES[2025];
  if (!leiaute) throw new Error("sem leiaute 2025");
  const { registros } = modeloParaRegistros(dec);
  const convertidos: Registro[] = [];
  for (const reg of registros) {
    const tipo = leiaute.tipos.find((t) => t.id === reg.tipo);
    if (!tipo) continue;
    const campos: Record<string, Registro["campos"][string]> = {};
    for (const c of tipo.campos) {
      const v = reg.campos[c.chave] ?? null;
      const numerico = c.formato === "N";
      campos[c.chave] = typeof v === "bigint" && !numerico ? null : v;
    }
    if (reg.tipo === "IR") {
      campos.EXERCICIO = 2025n;
      campos.ANO_BASE = 2024n;
    }
    convertidos.push({ ...reg, campos });
  }
  return gravarArquivo(convertidos, { leiaute });
}

describe("leiaute de 2025", () => {
  it("lê o arquivo de 2025 pelo EXERCICIO do header", () => {
    const lido = lerArquivo(arquivo2025(declaracao2025()));
    expect(lido.exercicio).toBe(2025);
    const m = registrosParaModelo(lido.registros);
    expect(m.exercicio).toBe(2025);
  });
});

describe("migrarDeclaracaoAnterior", () => {
  const lido = lerArquivo(arquivo2025(declaracao2025()));
  const anterior = registrosParaModelo(lido.registros).declaracao;
  const r = migrarDeclaracaoAnterior(anterior, { recibo: "123456789012" });
  const nova = zDeclaracao.parse(r.declaracao);

  it("gera a declaração de 2026, original, com o recibo de 2025", () => {
    expect(nova.exercicio).toBe(2026);
    expect(nova.identificacao.nome).toBe("FULANA FICTICIA");
    expect(nova.identificacao.tipoDeclaracao).toMatchObject({
      tipo: "ajusteAnual",
      retificadora: false,
      reciboExercicioAnterior: "123456789012",
    });
    expect(nova.identificacao.endereco).toMatchObject({ cep: "70040010", municipio: "9701" });
  });

  it("traz dependentes, fontes pagadoras e beneficiários de pagamentos sem valores", () => {
    expect(nova.dependentes.map((d) => d.cpf)).toEqual([FILHO]);
    expect(nova.rendimentosPJ).toHaveLength(1);
    expect(nova.rendimentosPJ[0]).toMatchObject({
      fonte: { ni: EMPRESA, nome: "EMPRESA FICTICIA" },
      rendimentos: 0n,
      impostoRetido: 0n,
    });
    expect(nova.pagamentos[0]).toMatchObject({
      codigo: "10",
      niBeneficiario: EMPRESA,
      nomeBeneficiario: "CLINICA FICTICIA",
      valorPago: 0n,
    });
  });

  it("leva a situação em 31/12/2024 dos bens e dívidas para a de 31/12/2025 anterior", () => {
    expect(nova.bens).toHaveLength(1);
    expect(nova.bens[0]).toMatchObject({
      discriminacao: "APARTAMENTO FICTICIO",
      situacaoAnterior: 31_000_000n,
      situacaoAtual: 0n,
    });
    expect(nova.dividas[0]).toMatchObject({
      situacaoAnterior: 200_000n,
      situacaoAtual: 0n,
      valorPago: 0n,
    });
  });

  it("relata o que foi importado e o que falta preencher", () => {
    expect(r.importados.join(" ")).toMatch(/Identificação/);
    expect(r.importados.join(" ")).toMatch(/1 bem/);
    expect(r.naoImportados.join(" ")).toMatch(/situação em 31\/12\/2024 igual a zero/);
    expect(r.aPreencher.join(" ")).toMatch(/Rendimentos Tributáveis Recebidos de Pessoa Jurídica/);
  });

  it("atividade rural: imóveis, rebanho final como inicial, bens e dívidas", () => {
    const comAr = declaracao2025();
    comAr.identificacao.ocupacao = { natureza: "12", ocupacaoPrincipal: "212" };
    comAr.atividadeRural = {
      brasil: {
        imoveis: [
          {
            atividade: "10",
            nome: "SITIO FICTICIO",
            localizacao: "ZONA RURAL",
            areaDecimosHa: 1000,
            condicaoExploracao: "1",
            participacaoCentesimos: 10000,
          },
        ],
        rebanho: [
          {
            especie: "1",
            estoqueInicial: 10,
            aquisicoes: 5,
            nascimentos: 3,
            consumoPerdas: 1,
            vendas: 2,
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
      bens: [
        {
          codigo: "01",
          discriminacao: "TRATOR FICTICIO",
          situacaoAnterior: 9_000_000,
          situacaoAtual: 9_000_000,
        },
      ],
    };
    const l = lerArquivo(arquivo2025(comAr));
    const m = migrarDeclaracaoAnterior(registrosParaModelo(l.registros).declaracao, {});
    const ar = zDeclaracao.parse(m.declaracao).atividadeRural;
    expect(ar?.brasil.imoveis[0]?.nome).toBe("SITIO FICTICIO");
    expect(ar?.brasil.rebanho[0]).toMatchObject({ especie: "1", estoqueInicial: 15, vendas: 0 });
    expect(ar?.brasil.dividas[0]).toMatchObject({ situacaoAnterior: 50_000n, situacaoAtual: 0n });
    expect(ar?.bens[0]).toMatchObject({ codigo: "01", discriminacao: "TRATOR FICTICIO" });
  });
});
