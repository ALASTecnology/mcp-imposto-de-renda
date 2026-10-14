/**
 * Testes do motor de cálculo do exercício 2026 (ano-calendário 2025).
 *
 * Todos os valores esperados foram calculados à mão, em centavos, e a conta
 * está escrita no próprio teste. O imposto da tabela progressiva é TRUNCADO no
 * centavo (base x alíquota, sem arredondar, menos a parcela a deduzir), como
 * mostram os casos de referência do programa oficial; ver
 * docs/regras/irpf-2026.md, seção Arredondamento.
 */
import { describe, expect, it } from "vitest";
import {
  calcular2026,
  calcularCompleto,
  calcularSimplificado,
  compararModelos,
  type EntradaCalculo2026,
  impostoTabelaAnual,
  motor2026,
  obterMotor,
} from "../../src/calc/index.js";
import { centavos } from "../../src/centavos.js";

const TITULAR = { cpf: "52998224725", nome: "TITULAR TESTE", nascimento: "01011980" };

/** Entrada mínima: só o titular e um empregador. */
function entradaPJ(
  rendimento: string,
  extra: Partial<EntradaCalculo2026> = {},
): EntradaCalculo2026 {
  return {
    titular: TITULAR,
    rendimentosPJ: [{ cnpj: "11222333000181", nome: "EMPRESA", rendimento, beneficiario: "T" }],
    ...extra,
  };
}

describe("tabela progressiva anual 2026 (Lei 15.191/2025 aplicada ao ano-calendário 2025)", () => {
  it.each([
    // base, imposto esperado, conta feita à mão
    ["0", 0n, "base zero"],
    ["2846720", 0n, "R$ 28.467,20 é o teto da faixa isenta"],
    ["2846721", 0n, "2.846.721 x 7,5% = 213.504,075 -> 213.504; menos 213.504 = 0"],
    [
      "2846727",
      0n,
      "2.846.727 x 7,5% = 213.504,525 -> 213.504 (truncado); menos 213.504 = 0",
    ],
    ["2846734", 1n, "2.846.734 x 7,5% = 213.505,05 -> 213.505; menos 213.504 = 1"],
    ["3391980", 40894n, "3.391.980 x 7,5% = 254.398,5 -> 254.398 (truncado); menos 213.504 = 40.894"],
    // Com o truncamento, o teto da faixa de 7,5% e o primeiro centavo da faixa de
    // 15% dão o mesmo imposto; o motor mantém a fórmula oficial (base x alíquota,
    // truncada, menos a parcela), sem suavizar a transição.
    ["3391981", 40894n, "3.391.981 x 15% = 508.797,15 -> 508.797; menos 467.903 = 40.894"],
    // Regressão dos casos de referência (ex.: simplificado-acima-limite-01): na
    // faixa de 27,5% a fração ,65 de centavo é descartada, não arredondada.
    ["8324566", 1203877n, "8.324.566 x 27,5% = 2.289.255,65 -> 2.289.255; menos 1.085.378 = 1.203.877"],
  ])("base %s", (base, esperado, _conta) => {
    expect(impostoTabelaAnual(centavos(BigInt(base)))).toBe(esperado);
  });

  it.each([
    ["4501260", 207286n, "4.501.260 x 15% = 675.189; menos 467.903 = 207.286"],
    ["5597616", 453966n, "5.597.616 x 22,5% = 1.259.463,6 -> 1.259.463 (truncado); menos 805.497 = 453.966"],
    ["10000000", 1664622n, "10.000.000 x 27,5% = 2.750.000; menos 1.085.378 = 1.664.622"],
  ])("faixas superiores: base %s", (base, esperado) => {
    expect(impostoTabelaAnual(centavos(BigInt(base)))).toBe(esperado);
  });
});

describe("modelo simplificado", () => {
  it("aplica 20% abaixo do teto", () => {
    // 6.000.000 x 20% = 1.200.000 (< 1.675.434). Base 4.800.000 na faixa de 22,5%:
    // 4.800.000 x 22,5% = 1.080.000; menos 805.497 = 274.503.
    const r = calcularSimplificado(entradaPJ("6000000"));
    expect(r.rendimentosTributaveis).toBe(6000000n);
    expect(r.desconto).toBe(1200000n);
    expect(r.baseCalculo).toBe(4800000n);
    expect(r.impostoDevido).toBe(274503n);
  });

  it("limita o desconto a R$ 16.754,34", () => {
    // 10.000.000 x 20% = 2.000.000 > 1.675.434. Base 8.324.566:
    // 8.324.566 x 27,5% = 2.289.255,65 -> 2.289.255 (truncado); menos 1.085.378 = 1.203.877.
    const r = calcularSimplificado(entradaPJ("10000000"));
    expect(r.desconto).toBe(1675434n);
    expect(r.baseCalculo).toBe(8324566n);
    expect(r.impostoDevido).toBe(1203877n);
  });

  it("no ponto exato do teto, 20% coincide com o limite", () => {
    // 8.377.170 x 20% = 1.675.434.
    expect(calcularSimplificado(entradaPJ("8377170")).desconto).toBe(1675434n);
  });

  it("ignora deduções e doações diretas", () => {
    const r = calcularSimplificado(
      entradaPJ("6000000", {
        pagamentos: [{ codigo: "10", cpfCnpj: "52998224725", valor: "999999", beneficiario: "T" }],
        doacoesDiretas: { eca: "100000" },
      }),
    );
    expect(r.impostoDevido).toBe(274503n);
  });
});

/**
 * Caso completo de referência (calculado à mão):
 * - PJ: rendimento 10.000.000, previdência oficial 900.000, IRRF 1.500.000.
 * - 2 dependentes: 2 x 227.508 = 455.016.
 * - Médico (10): 500.000 menos 100.000 reembolsado = 400.000.
 * - Instrução (01): titular 500.000 limitado a 356.150; dependente 200.000.
 * - PGBL (36): 1.500.000 limitado a 12% de 10.000.000 = 1.200.000.
 * - Pensão judicial (30): 300.000.
 * Deduções = 900.000 + 1.200.000 + 455.016 + 556.150 + 400.000 + 300.000 = 3.811.166.
 * Base = 6.188.834; x 27,5% = 1.701.929,35 -> 1.701.929; menos 1.085.378 = 616.551.
 */
const CASO_COMPLETO: EntradaCalculo2026 = {
  titular: TITULAR,
  dependentes: [
    { cpf: "11144477735", nome: "FILHO UM", nascimento: "01012015", codigo: "21" },
    { cpf: "39053344705", nome: "FILHO DOIS", nascimento: "01012018", codigo: "21" },
  ],
  rendimentosPJ: [
    {
      cnpj: "11222333000181",
      nome: "EMPRESA",
      rendimento: "10000000",
      previdenciaOficial: "900000",
      irrf: "1500000",
      decimoTerceiro: "800000",
      irrfDecimoTerceiro: "120000",
      beneficiario: "T",
    },
  ],
  pagamentos: [
    {
      codigo: "10",
      cpfCnpj: "71428793860",
      valor: "500000",
      parcelaNaoDedutivel: "100000",
      beneficiario: "T",
    },
    { codigo: "01", cpfCnpj: "11222333000181", valor: "500000", beneficiario: "T" },
    {
      codigo: "01",
      cpfCnpj: "11222333000181",
      valor: "200000",
      beneficiario: "D",
      cpfDependente: "11144477735",
    },
    { codigo: "36", cpfCnpj: "11222333000181", valor: "1500000", beneficiario: "T" },
    { codigo: "30", cpfCnpj: "11144477735", valor: "300000", beneficiario: "A" },
    // Código sem efeito no cálculo (aluguel pago): não deduz.
    { codigo: "70", cpfCnpj: "71428793860", valor: "2400000", beneficiario: "T" },
  ],
};

describe("modelo completo", () => {
  it("soma as deduções com os limites legais", () => {
    const r = calcularCompleto(CASO_COMPLETO);
    expect(r.deducoes.previdenciaOficial).toBe(900000n);
    expect(r.deducoes.previdenciaComplementar).toBe(1200000n);
    expect(r.deducoes.dependentes).toBe(455016n);
    expect(r.deducoes.instrucao).toBe(556150n);
    expect(r.deducoes.medicas).toBe(400000n);
    expect(r.deducoes.pensaoAlimenticia).toBe(300000n);
    expect(r.deducoes.livroCaixa).toBe(0n);
    expect(r.totalDeducoes).toBe(3811166n);
    expect(r.baseCalculo).toBe(6188834n);
    expect(r.impostoDevido).toBe(616551n);
  });

  it("o IRRF do 13º não entra no ajuste (tributação exclusiva)", () => {
    expect(calcularCompleto(CASO_COMPLETO).impostoPago.total).toBe(1500000n);
  });

  it("instrução de várias linhas da mesma pessoa soma antes de limitar", () => {
    // Titular: 200.000 + 200.000 = 400.000, limitado a 356.150 (o excedente não
    // aproveita a outras pessoas).
    const r = calcularCompleto(
      entradaPJ("10000000", {
        pagamentos: [
          { codigo: "01", cpfCnpj: "1", valor: "200000", beneficiario: "T" },
          { codigo: "02", cpfCnpj: "", valor: "200000", beneficiario: "T" },
        ],
      }),
    );
    expect(r.deducoes.instrucao).toBe(356150n);
  });

  it("parcela não dedutível maior que o valor não gera dedução negativa", () => {
    const r = calcularCompleto(
      entradaPJ("10000000", {
        pagamentos: [
          {
            codigo: "26",
            cpfCnpj: "1",
            valor: "10000",
            parcelaNaoDedutivel: "50000",
            beneficiario: "T",
          },
        ],
      }),
    );
    expect(r.deducoes.medicas).toBe(0n);
  });

  it("base de cálculo nunca fica negativa", () => {
    const r = calcularCompleto(
      entradaPJ("1000000", {
        pagamentos: [{ codigo: "21", cpfCnpj: "1", valor: "5000000", beneficiario: "T" }],
      }),
    );
    expect(r.baseCalculo).toBe(0n);
    expect(r.impostoDevido).toBe(0n);
  });

  it("soma rendimentos, previdência e livro-caixa da ficha PF/Exterior", () => {
    const meses = Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      pessoaFisica: "500000",
      previdenciaOficial: "50000",
      livroCaixa: "100000",
      carneLeao: "20000",
      dependentes: "1",
      pensao: "30000",
    }));
    const r = calcularCompleto({ titular: TITULAR, rendimentosPF: { meses } });
    // 12 x 500.000 = 6.000.000; previdência 600.000; livro-caixa 1.200.000.
    // Quantidade de dependentes e pensão da ficha PF são apenas informativas.
    expect(r.rendimentosTributaveis).toBe(6000000n);
    expect(r.deducoes.previdenciaOficial).toBe(600000n);
    expect(r.deducoes.livroCaixa).toBe(1200000n);
    expect(r.deducoes.dependentes).toBe(0n);
    expect(r.deducoes.pensaoAlimenticia).toBe(0n);
    // Base 4.200.000 x 15% = 630.000; menos 467.903 = 162.097.
    expect(r.impostoDevido).toBe(162097n);
    expect(r.impostoPago.carneLeao).toBe(240000n);
  });
});

describe("doações diretamente na declaração (ECA e Idoso)", () => {
  it("limita cada uma a 3% e o conjunto a 6% do imposto", () => {
    // Imposto do caso completo = 616.551. 3% = 18.496,53 -> 18.497.
    // ECA 50.000 -> 18.497; Idoso 10.000 -> 10.000. Soma 28.497 (< 6% = 36.993).
    const r = calcularCompleto({
      ...CASO_COMPLETO,
      doacoesDiretas: { eca: "50000", idoso: "10000" },
    });
    expect(r.deducaoIncentivo).toBe(28497n);
    expect(r.impostoDevido).toBe(616551n - 28497n);
  });

  it("aplica o limite global de 6% quando há doações do ano-calendário", () => {
    // ECA direto 18.497 + idoso direto 18.497 + doação ECA em 2025 (40) 50.000
    // = 86.994 > 6% (36.993) -> 36.993.
    const r = calcularCompleto({
      ...CASO_COMPLETO,
      doacoesDiretas: { eca: "50000", idoso: "50000" },
      doacoesEfetuadas: [{ codigo: "40", valor: "50000" }],
    });
    expect(r.deducaoIncentivo).toBe(36993n);
  });

  it("incentivo ao desporto amplia o teto global para 7%", () => {
    // 6% = 36.993; 7% = 616.551 x 7% = 43.158,57 -> 43.159.
    const r = calcularCompleto({
      ...CASO_COMPLETO,
      doacoesEfetuadas: [
        { codigo: "41", valor: "100000" },
        { codigo: "43", valor: "100000" },
      ],
    });
    expect(r.deducaoIncentivo).toBe(43159n);
  });
});

describe("imposto pago no exterior", () => {
  it("compensa só até a diferença do imposto com e sem os rendimentos do exterior", () => {
    // PJ 6.000.000 + exterior 12 x 100.000 = 7.200.000, sem deduções.
    // Com exterior: 7.200.000 x 27,5% = 1.980.000 - 1.085.378 = 894.622.
    // Sem exterior: 6.000.000 (acima de 5.597.616) x 27,5% = 1.650.000 - 1.085.378 = 564.622.
    // Limite = 894.622 - 564.622 = 330.000; informado 500.000 -> compensa 330.000.
    const meses = Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, exterior: "100000" }));
    const r = calcularCompleto(
      entradaPJ("6000000", { rendimentosPF: { meses }, impostoPago: { exterior: "500000" } }),
    );
    expect(r.impostoDevido).toBe(894622n);
    expect(r.impostoPago.exterior).toBe(330000n);
  });
});

describe("comparação e resultado consolidado", () => {
  it("escolhe o modelo de menor imposto e calcula saldos e alíquota efetiva", () => {
    const r = calcular2026(CASO_COMPLETO);
    // Simplificado: 10.000.000 -> 1.203.877 (ver teste do teto).
    expect(r.rendimentosTributaveis).toBe("10000000");
    expect(r.deducoesCompleto).toBe("3811166");
    expect(r.baseCalculoCompleto).toBe("6188834");
    expect(r.impostoDevidoCompleto).toBe("616551");
    expect(r.descontoSimplificado).toBe("1675434");
    expect(r.baseCalculoSimplificado).toBe("8324566");
    expect(r.impostoDevidoSimplificado).toBe("1203877");
    expect(r.impostoRetidoTotal).toBe("1500000");
    expect(r.saldoPagarCompleto).toBe("0");
    expect(r.restituirCompleto).toBe("883449");
    expect(r.saldoPagarSimplificado).toBe("0");
    expect(r.restituirSimplificado).toBe("296123");
    expect(r.modeloMaisVantajoso).toBe("completo");
    // 616.551 / 10.000.000 = 6,16551% -> truncado 6,16% -> "616" (centésimos de ponto
    // percentual). O truncamento foi confirmado no caso de referência pj-simples-01.
    expect(r.aliquotaEfetiva).toBe("616");
  });

  it("gera memória de cálculo explicada em pt-BR", () => {
    const r = calcular2026(CASO_COMPLETO);
    const linhas = r.detalhamento.completo;
    expect(linhas.length).toBeGreaterThan(5);
    for (const l of linhas) {
      expect(l.descricao.length).toBeGreaterThan(0);
      expect(l.regra.length).toBeGreaterThan(0);
      expect(l.valor).toMatch(/^-?\d+$/);
    }
    expect(linhas.some((l) => l.descricao.includes("Instrução"))).toBe(true);
    expect(r.detalhamento.comparacao.some((l) => l.descricao.includes("completo"))).toBe(true);
  });

  it("alíquota efetiva é truncada em 2 casas", () => {
    // Simplificado de 6.000.000: imposto 274.503; 274.503 / 6.000.000 = 4,57505%.
    // Truncado: 4,57% -> "457" (arredondando daria 4,58%).
    expect(calcular2026(entradaPJ("6000000")).aliquotaEfetiva).toBe("457");
  });

  it("em empate (imposto zero nos dois) indica o completo", () => {
    expect(compararModelos(entradaPJ("2000000")).modeloMaisVantajoso).toBe("completo");
  });

  it("indica o simplificado quando ele dá menos imposto", () => {
    expect(compararModelos(entradaPJ("10000000")).modeloMaisVantajoso).toBe("simplificado");
  });

  it("saldo a pagar quando o retido é menor que o devido", () => {
    const r = calcular2026(entradaPJ("10000000", { impostoPago: { complementar: "100000" } }));
    // Simplificado 1.203.877 - 100.000 = 1.103.877.
    expect(r.saldoPagarSimplificado).toBe("1103877");
    expect(r.restituirSimplificado).toBe("0");
  });

  it("campos opcionais ausentes valem zero", () => {
    const r = calcular2026({ titular: TITULAR });
    expect(r.rendimentosTributaveis).toBe("0");
    expect(r.aliquotaEfetiva).toBe("0");
    expect(r.modeloMaisVantajoso).toBe("completo");
  });

  it("rejeita valor monetário que não seja inteiro de centavos", () => {
    expect(() => calcular2026(entradaPJ("1.000,00"))).toThrow(/centavos/);
  });

  it("é determinístico", () => {
    expect(calcular2026(CASO_COMPLETO)).toEqual(calcular2026(CASO_COMPLETO));
  });
});

describe("registro de motores por exercício", () => {
  it("expõe o motor de 2026", () => {
    expect(obterMotor(2026)).toBe(motor2026);
    expect(motor2026.exercicio).toBe(2026);
    expect(motor2026.anoCalendario).toBe(2025);
  });

  it("falha com mensagem clara para exercício sem motor", () => {
    expect(() => obterMotor(2019)).toThrow(/2019/);
  });
});
