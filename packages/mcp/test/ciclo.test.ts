import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  calcularDvCpf,
  lerArquivo,
  registrosParaModelo,
  verificarControles,
  zDeclaracao,
} from "@mcp-imposto-de-renda/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

let base: string;
let pasta: string;
let c: Conexao;
const CPF = `123456789${calcularDvCpf("123456789")}`;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-ciclo-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
  writeFileSync(join(pasta, "pj.DBK"), fixture("pj-simples-01.DBK"));
  writeFileSync(join(pasta, "idoso.DBK"), fixture("idoso-65-parcela-isenta-01.DBK"));
  writeFileSync(join(pasta, "trib.DEC"), fixture("tributacao-exclusiva-01.DEC"));
  c = await conectar({ diretorioAutorizado: pasta });
});
afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

function modelo(nome: string) {
  const lido = lerArquivo(new Uint8Array(readFileSync(join(pasta, nome))));
  expect(verificarControles(lido.registros, { tipoArquivo: "DBK" }).valido).toBe(true);
  return zDeclaracao.parse(registrosParaModelo(lido.registros).declaracao);
}

async function ok(nome: string, args: Record<string, unknown>) {
  const r = await c.chamar(nome, args);
  expect(r.isError, `${nome}: ${textoDe(r)}`).toBeFalsy();
  return r.structuredContent as Record<string, unknown>;
}

const identificacao = {
  cpf: CPF,
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
};

describe("ciclo de vida", () => {
  it("cria a declaração com o nome padrão e recusa sobrescrever", async () => {
    const s = await ok("criar_declaracao", { identificacao, opcao_tributacao: "simplificada" });
    const nome = `${CPF}-IRPF-A-2026-2025-ORIGI.DBK`;
    expect(s.arquivo).toBe(nome);
    expect(modelo(nome).identificacao.nome).toBe("FULANA FICTICIA");
    const r = await c.chamar("criar_declaracao", { identificacao });
    expect(r.isError).toBe(true);
    await ok("criar_declaracao", { identificacao, sobrescrever: true });
  });

  it("registra o recibo e o usa na retificadora sem informá-lo de novo", async () => {
    const reg = await ok("registrar_recibo", { arquivo: "trib.DEC", recibo: "1234.5678.90-12" });
    expect(reg).toMatchObject({ arquivoRecibo: "trib.recibo.json", recibo: "123456789012" });
    const salvo = JSON.parse(readFileSync(join(pasta, "trib.recibo.json"), "utf8"));
    expect(salvo).toMatchObject({ tipo: "recibo-mcp-imposto-de-renda", recibo: "123456789012" });
    const s = await ok("criar_retificadora", { arquivo: "trib.DEC", arquivo_destino: "r.DBK" });
    expect(s).toMatchObject({ recibo: "123456789012", origemRecibo: "registrado" });
    expect(modelo("r.DBK").identificacao.tipoDeclaracao.reciboRetificada).toBe("123456789012");
    // Recibo gravado com o tipo do nome antigo do projeto continua aceito.
    writeFileSync(
      join(pasta, "trib.recibo.json"),
      JSON.stringify({ ...salvo, tipo: "recibo-autoir", recibo: "999999999999" }),
    );
    const antigo = await ok("criar_retificadora", {
      arquivo: "trib.DEC",
      arquivo_destino: "r2.DBK",
    });
    expect(antigo).toMatchObject({ recibo: "999999999999", origemRecibo: "registrado" });
    const semRecibo = await c.chamar("criar_retificadora", { arquivo: "pj.DBK" });
    expect(semRecibo.isError).toBe(true);
    expect(textoDe(semRecibo)).toMatch(/registrar_recibo/);
    expect((await c.chamar("registrar_recibo", { arquivo: "pj.DBK", recibo: "123" })).isError).toBe(
      true,
    );
  });

  it("cria a retificadora a partir de um DEC, sem o recibo", async () => {
    const s = await ok("criar_retificadora", {
      arquivo: "trib.DEC",
      arquivo_destino: "retif.DBK",
      recibo: "123456789012",
    });
    expect(s.arquivo).toBe("retif.DBK");
    const d = modelo("retif.DBK");
    expect(d.identificacao.tipoDeclaracao).toMatchObject({
      retificadora: true,
      reciboRetificada: "123456789012",
    });
    const tipos = lerArquivo(new Uint8Array(readFileSync(join(pasta, "retif.DBK")))).registros.map(
      (r) => r.tipo,
    );
    expect(tipos).not.toContain("R9");
  });

  it("exclui com confirmação e restaura a cópia de segurança", async () => {
    expect(
      (await c.chamar("excluir_declaracao", { arquivo: "pj.DBK", confirmar: "outro" })).isError,
    ).toBe(true);
    expect(
      (await c.chamar("excluir_declaracao", { arquivo: "trib.DEC", confirmar: "trib.DEC" }))
        .isError,
    ).toBe(true);
    const s = await ok("excluir_declaracao", { arquivo: "pj.DBK", confirmar: "pj.DBK" });
    expect(existsSync(join(pasta, "pj.DBK"))).toBe(false);
    const l = await ok("listar_copias_seguranca", { arquivo: "pj.DBK" });
    const copias = l.copias as { copia: string }[];
    expect(copias.length).toBe(1);
    expect(String(s.backup)).toContain(copias[0]?.copia ?? "x");
    await ok("restaurar_copia_seguranca", { copia: copias[0]?.copia });
    expect(readFileSync(join(pasta, "pj.DBK"))).toEqual(Buffer.from(fixture("pj-simples-01.DBK")));
    const r = await c.chamar("restaurar_copia_seguranca", { copia: "../pj.DBK" });
    expect(r.isError).toBe(true);
  });

  it("grava cópia de um DEC como DBK", async () => {
    await ok("gravar_copia_seguranca", { arquivo: "trib.DEC", arquivo_destino: "copia.DBK" });
    expect(modelo("copia.DBK").rendimentosExclusivos.length).toBeGreaterThan(0);
  });
});

describe("Resumo e imposto pago", () => {
  it("opção de tributação devolve a comparação", async () => {
    const s = await ok("definir_opcao_tributacao", { arquivo: "pj.DBK", opcao: "completa" });
    expect(s.comparacao).toMatchObject({
      maisVantajoso: expect.stringMatching(/completo|simplificado/),
    });
    expect(modelo("pj.DBK").resumo.opcaoTributacao).toBe("deducoesLegais");
  });

  it("conta bancária válida é gravada e inválida é recusada", async () => {
    const r = await c.chamar("definir_informacoes_bancarias", {
      arquivo: "pj.DBK",
      banco: "999",
      agencia: "1234",
      conta: "1",
      dv: "1",
    });
    expect(r.isError).toBe(true);
    await ok("definir_informacoes_bancarias", {
      arquivo: "pj.DBK",
      banco: "001",
      agencia: "1234",
      conta: "56789",
      dv: "X",
      quotas: 2,
    });
    const d = modelo("pj.DBK");
    expect(d.resumo.conta?.banco).toBe("001");
    // Sem saldo a pagar o arquivo grava 0 quotas: "não se aplica".
    expect(d.resumo.quotas).toBe(0);
  });

  it("imposto pago e repetição dos valores dos bens", async () => {
    await ok("definir_imposto_pago", { arquivo: "pj.DBK", imposto_complementar: "100,00" });
    await ok("adicionar_bem", {
      arquivo: "pj.DBK",
      item: {
        grupo: "06",
        codigo: "01",
        discriminacao: "CONTA FICTICIA",
        situacaoAnterior: 50_000,
      },
    });
    await ok("repetir_valores_bens", { arquivo: "pj.DBK" });
    const d = modelo("pj.DBK");
    expect(d.impostoPago.impostoComplementar).toBe(10_000n);
    expect(d.bens[0]?.situacaoAtual).toBe(50_000n);
  });
});

describe("importações e excedente de 65 anos", () => {
  const texto = [
    "COMPROVANTE DE RENDIMENTOS PAGOS E DE IMPOSTO SOBRE A RENDA RETIDO NA FONTE",
    "1. Fonte pagadora",
    "CNPJ: 11.222.333/0001-81   Nome empresarial: EMPRESA FICTICIA S.A.",
    "3. Rendimentos tributáveis",
    "01. Total dos rendimentos (inclusive férias) 60.000,00",
    "02. Contribuição previdenciária oficial 6.000,00",
    "05. Imposto sobre a renda retido na fonte 4.500,00",
    "5. Rendimentos sujeitos à tributação exclusiva",
    "01. Décimo terceiro salário 5.000,00",
    "02. Imposto sobre a renda retido na fonte sobre 13º salário 300,00",
    "03. Participação nos lucros ou resultados 2.000,00",
  ].join("\n");

  it("informe em texto: simula, importa e recusa duplicidade", async () => {
    const sim = await ok("importar_informe_rendimentos", {
      arquivo: "pj.DBK",
      texto,
      simular: true,
    });
    expect(sim.simulado).toBe(true);
    expect(modelo("pj.DBK").rendimentosPJ).toHaveLength(1);
    await ok("importar_informe_rendimentos", { arquivo: "pj.DBK", texto });
    const d = modelo("pj.DBK");
    const pj = d.rendimentosPJ.find((p) => p.fonte.ni === "11222333000181");
    expect(pj).toMatchObject({
      rendimentos: 6_000_000n,
      contribuicaoPrevidenciaria: 600_000n,
      impostoRetido: 450_000n,
    });
    expect(pj?.decimoTerceiro).toBe(500_000n);
    expect(d.rendimentosExclusivos.some((e) => e.codigo === "11" && e.valor === 200_000n)).toBe(
      true,
    );
    const dup = await c.chamar("importar_informe_rendimentos", { arquivo: "pj.DBK", texto });
    expect(dup.isError).toBe(true);
    await ok("importar_informe_rendimentos", { arquivo: "pj.DBK", texto, substituir: true });
    expect(
      modelo("pj.DBK").rendimentosPJ.filter((p) => p.fonte.ni === "11222333000181"),
    ).toHaveLength(1);
  });

  it("informe em JSON e plano de saúde", async () => {
    await ok("importar_informe_rendimentos", {
      arquivo: "pj.DBK",
      json: {
        fonte: { cnpj: "11222333000181", nome: "EMPRESA FICTICIA" },
        rendimentos: "1.000,00",
        irrf: 1_000,
        isentos: [{ codigo: "09", valor: "500,00" }],
      },
    });
    const titular = modelo("pj.DBK").identificacao.cpf;
    await ok("importar_informe_plano_saude", {
      arquivo: "pj.DBK",
      json: {
        operadora: { cnpj: "11222333000181", nome: "PLANO FICTICIO" },
        beneficiarios: [{ cpf: titular, valor: "3.000,00", reembolso: "100,00" }],
      },
    });
    const d = modelo("pj.DBK");
    expect(d.rendimentosIsentos.map((i) => i.codigo)).toContain("09");
    expect(d.pagamentos.find((p) => p.codigo === "26")).toMatchObject({
      valorPago: 300_000n,
      parcelaNaoDedutivel: 10_000n,
    });
  });

  it("excedente da parcela isenta de 65 anos vai para rendimentos tributáveis", async () => {
    const antes = modelo("idoso.DBK");
    const nasc = antes.identificacao.dataNascimento;
    expect(Number(nasc.slice(0, 4))).toBeLessThanOrEqual(1960);
    // Aumenta a parcela informada em R$ 1.000,00 acima do limite anual (13 x 1.903,98).
    await ok("editar_lancamento", {
      arquivo: "idoso.DBK",
      ficha: "rendimentosIsentos",
      indice: 1,
      alteracoes: { valor: 2_475_174 + 100_000 },
    });
    const soma = (x: ReturnType<typeof modelo>) =>
      x.rendimentosPJ.reduce((t, p) => t + p.rendimentos, 0n);
    const pjAntes = soma(modelo("idoso.DBK"));
    const s = await ok("transferir_excedente_isencao_65", { arquivo: "idoso.DBK" });
    expect((s.transferencias as { excedente: string }[])[0]?.excedente).toBe("100000");
    const d = modelo("idoso.DBK");
    expect(soma(d)).toBe(pjAntes + 100_000n);
    const i10 = d.rendimentosIsentos.find((i) => i.codigo === "10");
    expect(i10 && "valor" in i10 ? i10.valor : 0n).toBe(2_475_174n);
  });

  it("somente leitura omite as ferramentas de escrita do grupo", async () => {
    const leitura = await conectar({ diretorioAutorizado: pasta, somenteLeitura: true });
    const nomes = (await leitura.client.listTools()).tools.map((t) => t.name);
    for (const n of ["criar_declaracao", "excluir_declaracao", "importar_informe_rendimentos"]) {
      expect(nomes).not.toContain(n);
    }
    expect(nomes).toContain("listar_copias_seguranca");
    await leitura.fechar();
  });
});
