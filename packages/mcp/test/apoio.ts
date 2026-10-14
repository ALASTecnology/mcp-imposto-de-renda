import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { calcularDvCpf, type DeclaracaoEntrada } from "@mcp-imposto-de-renda/core";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { createServer, type OpcoesServidor } from "../src/index.js";
export const FIXTURES = fileURLToPath(
  new URL("../../core/test/fixtures/dbk/2026/", import.meta.url),
);
export const fixture = (nome: string): Uint8Array =>
  new Uint8Array(readFileSync(`${FIXTURES}${nome}`));

const cpf = (base: string) => `${base}${calcularDvCpf(base)}`;
export const TITULAR = cpf("123456789");
export const DEP = cpf("987654321");

/** Declaração sintética que exercita todas as fichas convertidas. */
export function declaracaoSintetica(): DeclaracaoEntrada {
  return {
    identificacao: {
      cpf: TITULAR,
      nome: "FULANA FICTICIA",
      dataNascimento: "1980-01-15",
      tipoDeclaracao: { tipo: "ajusteAnual" },
      racaCor: "2",
      conjuge: { possui: false },
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
      },
      ocupacao: { natureza: "12", ocupacaoPrincipal: "212" },
    },
    dependentes: [
      {
        codigo: "21",
        nome: "FILHO FICTICIO",
        cpf: DEP,
        dataNascimento: "2015-06-01",
        racaCor: "2",
      },
    ],
    rendimentosPJ: [
      {
        beneficiario: { tipo: "titular" },
        fonte: { ni: "11222333000181", nome: "EMPRESA FICTICIA" },
        rendimentos: 8_000_000,
        contribuicaoPrevidenciaria: 700_000,
        impostoRetido: 900_000,
        decimoTerceiro: 600_000,
        impostoRetidoDecimoTerceiro: 50_000,
      },
      {
        beneficiario: { tipo: "dependente", cpf: DEP },
        fonte: { ni: "11222333000181", nome: "EMPRESA FICTICIA" },
        rendimentos: 100_000,
      },
    ],
    pagamentos: [
      {
        codigo: "10",
        realizadoCom: { tipo: "dependente", cpf: DEP },
        niBeneficiario: "11222333000181",
        nomeBeneficiario: "CLINICA FICTICIA",
        valorPago: 250_000,
        parcelaNaoDedutivel: 50_000,
      },
      {
        codigo: "01",
        niBeneficiario: "11222333000181",
        nomeBeneficiario: "ESCOLA FICTICIA",
        valorPago: 400_000,
      },
    ],
    bens: [
      {
        grupo: "01",
        codigo: "11",
        discriminacao: "APARTAMENTO FICTICIO",
        situacaoAnterior: 30_000_000,
        situacaoAtual: 30_000_000,
        dataAquisicao: "2010-03-20",
        imovel: {
          cep: "70040010",
          uf: "DF",
          municipio: "9701",
          areaTotalCentesimos: 8500,
          unidade: "m2",
          registradoEmCartorio: true,
          matricula: "123",
        },
      },
      {
        grupo: "06",
        codigo: "01",
        discriminacao: "CONTA CORRENTE FICTICIA",
        situacaoAnterior: 100_000,
        situacaoAtual: 250_000,
        ni: "11222333000181",
        conta: { banco: "001", agencia: "1234", conta: "56789", dv: "0" },
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

export interface Conexao {
  readonly client: Client;
  chamar(nome: string, args?: Record<string, unknown>): Promise<CallToolResult>;
  fechar(): Promise<void>;
}

/** Sobe o servidor e um cliente ligados pelo transporte em memória do SDK. */
export async function conectar(opcoes: OpcoesServidor = {}): Promise<Conexao> {
  const server = createServer(opcoes);
  const [ladoCliente, ladoServidor] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "teste", version: "0.0.0" });
  await Promise.all([server.connect(ladoServidor), client.connect(ladoCliente)]);
  return {
    client,
    chamar: async (nome, args = {}) =>
      (await client.callTool({ name: nome, arguments: args })) as CallToolResult,
    fechar: async () => {
      await client.close();
      await server.close();
    },
  };
}

/** Texto do primeiro bloco de conteúdo. */
export function textoDe(r: CallToolResult): string {
  const c = r.content[0];
  return c?.type === "text" ? c.text : "";
}
