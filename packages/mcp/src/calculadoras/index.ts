/**
 * Calculadoras auxiliares offline, para orientar o preenchimento. Valores em centavos
 * (`bigint`); percentuais com a fração de centavo descartada, como no programa.
 *
 * Tabelas mensais de 2025 (docs/regras/irpf-2026.md): janeiro a abril pela Lei 14.848/2024
 * (isenção até R$ 2.259,20) e de maio a dezembro pela Lei 15.191/2025 (isenção até
 * R$ 2.428,80). Ganho de capital: Lei 8.981/1995 art. 21 (alíquotas de 15% a 22,5%), Lei
 * 11.196/2005 art. 40 (fatores FR1 e FR2) e Lei 7.713/1988 art. 18 (redução por ano de
 * aquisição até 1988).
 */
import { EntradaInvalidaError } from "../erros.js";

export interface FaixaMensal {
  readonly ate: bigint | null;
  readonly aliquotaMilesimos: bigint;
  readonly parcelaDeduzir: bigint;
}

/** Tabela progressiva mensal de janeiro a abril de 2025. */
export const TABELA_MENSAL_JAN_ABR_2025: readonly FaixaMensal[] = [
  { ate: 225_920n, aliquotaMilesimos: 0n, parcelaDeduzir: 0n },
  { ate: 282_665n, aliquotaMilesimos: 75n, parcelaDeduzir: 16_944n },
  { ate: 375_105n, aliquotaMilesimos: 150n, parcelaDeduzir: 38_144n },
  { ate: 466_468n, aliquotaMilesimos: 225n, parcelaDeduzir: 66_277n },
  { ate: null, aliquotaMilesimos: 275n, parcelaDeduzir: 89_600n },
];

/** Tabela progressiva mensal de maio a dezembro de 2025. */
export const TABELA_MENSAL_MAI_DEZ_2025: readonly FaixaMensal[] = [
  { ate: 242_880n, aliquotaMilesimos: 0n, parcelaDeduzir: 0n },
  { ate: 282_665n, aliquotaMilesimos: 75n, parcelaDeduzir: 18_216n },
  { ate: 375_105n, aliquotaMilesimos: 150n, parcelaDeduzir: 39_416n },
  { ate: 466_468n, aliquotaMilesimos: 225n, parcelaDeduzir: 67_549n },
  { ate: null, aliquotaMilesimos: 275n, parcelaDeduzir: 90_873n },
];

/** Desconto simplificado mensal (25% da faixa isenta), opcional no carnê-leão. */
export const DESCONTO_SIMPLIFICADO_MENSAL = { janAbr: 56_480n, maiDez: 60_720n } as const;
export const DEDUCAO_DEPENDENTE_MENSAL = 18_959n;

export function tabelaDoMes(mes: number): readonly FaixaMensal[] {
  if (mes < 1 || mes > 12) throw new EntradaInvalidaError("mes: informe de 1 a 12.");
  return mes <= 4 ? TABELA_MENSAL_JAN_ABR_2025 : TABELA_MENSAL_MAI_DEZ_2025;
}

/** Imposto pela tabela mensal (multiplicada por `meses`, como no RRA), truncado no centavo. */
export function impostoTabela(base: bigint, tabela: readonly FaixaMensal[], meses = 1n): bigint {
  if (base <= 0n) return 0n;
  for (const f of tabela) {
    if (f.ate === null || base <= f.ate * meses) {
      const v = (base * f.aliquotaMilesimos) / 1000n - f.parcelaDeduzir * meses;
      return v > 0n ? v : 0n;
    }
  }
  return 0n;
}

export interface EntradaCarneLeao {
  mes: number;
  rendimentos: bigint;
  previdencia: bigint;
  dependentes: number;
  pensao: bigint;
  livroCaixa: bigint;
}

export function calcularCarneLeao(e: EntradaCarneLeao) {
  const tabela = tabelaDoMes(e.mes);
  const deducoes =
    e.previdencia + BigInt(e.dependentes) * DEDUCAO_DEPENDENTE_MENSAL + e.pensao + e.livroCaixa;
  const simplificado =
    e.mes <= 4 ? DESCONTO_SIMPLIFICADO_MENSAL.janAbr : DESCONTO_SIMPLIFICADO_MENSAL.maiDez;
  const usaSimplificado = simplificado > deducoes;
  const deducaoUsada = usaSimplificado ? simplificado : deducoes;
  const base = e.rendimentos - deducaoUsada > 0n ? e.rendimentos - deducaoUsada : 0n;
  return {
    deducoesLegais: deducoes,
    descontoSimplificado: simplificado,
    usaSimplificado,
    base,
    imposto: impostoTabela(base, tabela),
  };
}

export interface EntradaRra {
  rendimentos: bigint;
  meses: number;
  mesRecebimento: number;
  previdencia: bigint;
  pensao: bigint;
  irrf: bigint;
}

/**
 * RRA pela tabela acumulada: a tabela do mês do recebimento vezes o número de meses (IN RFB
 * 1.500/2014, art. 37). A quantidade de meses tem uma casa decimal (art. 45, I, e parágrafo
 * único), então o mínimo é 0,1 mês; abaixo disso o produto pelas faixas daria zero e todo o
 * valor cairia na alíquota de 27,5% sem parcela a deduzir.
 */
export function calcularRra(e: EntradaRra) {
  if (!(e.meses >= 0.1)) {
    throw new EntradaInvalidaError(
      "numero_meses: informe ao menos 0,1 mês. A quantidade de meses do RRA usa uma casa decimal (IN RFB 1.500/2014, art. 45).",
    );
  }
  const decimos = BigInt(Math.round(e.meses * 10));
  const base = e.rendimentos - e.previdencia - e.pensao;
  const b = base > 0n ? base : 0n;
  // Faixas multiplicadas por meses com uma casa decimal: escala de 10.
  const tabela = tabelaDoMes(e.mesRecebimento);
  let imposto = 0n;
  for (const f of tabela) {
    if (f.ate === null || b * 10n <= f.ate * decimos) {
      const v = (b * f.aliquotaMilesimos) / 1000n - (f.parcelaDeduzir * decimos) / 10n;
      imposto = v > 0n ? v : 0n;
      break;
    }
  }
  return { base: b, impostoExclusivo: imposto, saldo: imposto - e.irrf };
}

export interface Operacao {
  data: string;
  ativo: string;
  tipo: "compra" | "venda";
  quantidade: number;
  /** Valor total da operação em centavos, sem custos. */
  valor: bigint;
  custos: bigint;
}

/** Custo médio ponderado e ganho por venda, separando day-trade (compra e venda no mesmo dia). */
export function calcularPrecoMedio(ops: readonly Operacao[]) {
  const ordenadas = [...ops].sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
  const posicoes = new Map<string, { quantidade: number; custo: bigint }>();
  const vendas: {
    data: string;
    ativo: string;
    quantidade: number;
    valorLiquido: bigint;
    custoMedio: bigint;
    resultado: bigint;
    dayTrade: boolean;
  }[] = [];
  // Day-trade: no mesmo dia e ativo, a quantidade casada entre compra e venda.
  const porDia = new Map<
    string,
    { compra: number; venda: number; vCompra: bigint; vVenda: bigint }
  >();
  for (const o of ordenadas) {
    const k = `${o.data}|${o.ativo}`;
    const d = porDia.get(k) ?? { compra: 0, venda: 0, vCompra: 0n, vVenda: 0n };
    if (o.tipo === "compra") {
      d.compra += o.quantidade;
      d.vCompra += o.valor + o.custos;
    } else {
      d.venda += o.quantidade;
      d.vVenda += o.valor - o.custos;
    }
    porDia.set(k, d);
  }
  for (const [k, d] of porDia) {
    const [data, ativo] = k.split("|") as [string, string];
    const casada = Math.min(d.compra, d.venda);
    let comprado = d.compra;
    let vendido = d.venda;
    let vCompra = d.vCompra;
    let vVenda = d.vVenda;
    if (casada > 0) {
      const custo = (d.vCompra * BigInt(casada)) / BigInt(d.compra);
      const receita = (d.vVenda * BigInt(casada)) / BigInt(d.venda);
      vendas.push({
        data,
        ativo,
        quantidade: casada,
        valorLiquido: receita,
        custoMedio: custo / BigInt(casada),
        resultado: receita - custo,
        dayTrade: true,
      });
      comprado -= casada;
      vendido -= casada;
      vCompra -= custo;
      vVenda -= receita;
    }
    const p = posicoes.get(ativo) ?? { quantidade: 0, custo: 0n };
    if (comprado > 0) {
      p.quantidade += comprado;
      p.custo += vCompra;
    }
    if (vendido > 0) {
      if (vendido > p.quantidade) {
        throw new EntradaInvalidaError(
          `Venda de ${ativo} maior que a posição em ${data}: informe as compras anteriores.`,
        );
      }
      const custo = (p.custo * BigInt(vendido)) / BigInt(p.quantidade);
      vendas.push({
        data,
        ativo,
        quantidade: vendido,
        valorLiquido: vVenda,
        custoMedio: custo / BigInt(vendido),
        resultado: vVenda - custo,
        dayTrade: false,
      });
      p.quantidade -= vendido;
      p.custo -= custo;
    }
    posicoes.set(ativo, p);
  }
  vendas.sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
  return {
    vendas,
    posicoes: [...posicoes].map(([ativo, p]) => ({
      ativo,
      quantidade: p.quantidade,
      custoTotal: p.custo,
      custoMedio: p.quantidade > 0 ? p.custo / BigInt(p.quantidade) : 0n,
    })),
  };
}

export interface MesRv {
  mes: number;
  comuns: bigint;
  dayTrade: bigint;
  fii: bigint;
  /** Total de vendas de ações no mercado à vista em operações comuns (isenção de R$ 20.000,00). */
  vendasAcoes?: bigint;
  /** Ganho do mês em ações à vista (parte de `comuns`) para a isenção. */
  ganhoAcoesVista?: bigint;
  irrfDayTrade: bigint;
  irrfLei11033: bigint;
}

/** Valor mínimo de um Darf: abaixo dele o imposto passa para o período seguinte. */
export const DARF_MINIMO = 1_000n;

/**
 * Apuração mensal de renda variável e FII com compensação de prejuízos e de IR na fonte.
 *
 * O imposto de cada mês vence no último dia útil do mês seguinte (IN RFB 1.585/2015, art. 56,
 * § 5º). Quando o valor a pagar fica abaixo de R$ 10,00, ele não é recolhido: soma-se ao imposto
 * de mesmo código dos meses seguintes até o total chegar a R$ 10,00, e então é pago no prazo do
 * último desses meses (Lei 9.430/1996, art. 68, caput e § 1º). `impostoMesesAnteriores` traz o
 * que veio acumulado e `impostoPendente`, o que ficou para o mês seguinte.
 */
export function apurarRendaVariavel(
  meses: readonly MesRv[],
  inicial: { prejuizoComuns: bigint; prejuizoDayTrade: bigint; prejuizoFii: bigint },
) {
  let pc = inicial.prejuizoComuns;
  let pd = inicial.prejuizoDayTrade;
  let pf = inicial.prejuizoFii;
  let saldoDay = 0n;
  let saldoLei = 0n;
  let pendente = 0n;
  const pos = (v: bigint) => (v > 0n ? v : 0n);
  return [...meses]
    .sort((a, b) => a.mes - b.mes)
    .map((m) => {
      let comuns = m.comuns;
      let isento = 0n;
      if (
        m.vendasAcoes !== undefined &&
        m.vendasAcoes <= 2_000_000n &&
        (m.ganhoAcoesVista ?? 0n) > 0n
      ) {
        isento = m.ganhoAcoesVista ?? 0n;
        comuns -= isento;
      }
      const baseC = pos(comuns - pc);
      pc = pos(pc - comuns);
      const baseD = pos(m.dayTrade - pd);
      pd = pos(pd - m.dayTrade);
      const baseF = pos(m.fii - pf);
      pf = pos(pf - m.fii);
      const devido = (baseC * 15n) / 100n + (baseD * 20n) / 100n + (baseF * 20n) / 100n;
      const dispDay = saldoDay + m.irrfDayTrade;
      const usoDay = dispDay < devido ? dispDay : devido;
      const dispLei = saldoLei + m.irrfLei11033;
      const usoLei = dispLei < devido - usoDay ? dispLei : devido - usoDay;
      saldoDay = dispDay - usoDay;
      saldoLei = dispLei - usoLei;
      const anteriores = pendente;
      const pagar = devido - usoDay - usoLei + anteriores;
      const recolher = pagar >= DARF_MINIMO;
      pendente = recolher ? 0n : pagar;
      return {
        mes: m.mes,
        isentoAcoes: isento,
        baseComuns: baseC,
        baseDayTrade: baseD,
        baseFii: baseF,
        impostoDevido: devido,
        irrfCompensado: usoDay + usoLei,
        impostoMesesAnteriores: anteriores,
        impostoPagar: pagar,
        recolher,
        impostoPendente: pendente,
        prejuizoComunsSeguinte: pc,
        prejuizoDayTradeSeguinte: pd,
        prejuizoFiiSeguinte: pf,
      };
    });
}

export interface EntradaGanhoCapital {
  tipo: "imovel" | "movel" | "participacao";
  valorAlienacao: bigint;
  custoCorretagem: bigint;
  custoAquisicao: bigint;
  dataAquisicao: string;
  dataAlienacao: string;
  unicoImovel?: boolean;
  valorAplicadoOutroImovel?: bigint;
  /** Total de alienações de bens da mesma natureza no mês. */
  totalAlienadoNoMes?: bigint;
  /** Imposto já pago em Darf (código 4600) sobre esta alienação. */
  impostoPago?: bigint;
}

/** Meses-calendário de `de` até `ate` (AAAA-MM), contando os dois meses. */
const mesesInclusivos = (de: string, ate: string) => {
  const [a1, m1] = de.split("-").map(Number) as [number, number];
  const [a2, m2] = ate.split("-").map(Number) as [number, number];
  return (a2 - a1) * 12 + (m2 - m1) + 1;
};

/**
 * Percentual de redução `1 - 1/(base/10000)^m`, em milionésimos de ponto percentual, com a
 * sexta casa decimal do percentual arredondada (meio para cima), como no GCAP.
 */
function percentualFator(base: bigint, m: number): bigint {
  if (m <= 0) return 0n;
  const pot = base ** BigInt(m);
  const um = 10_000n ** BigInt(m);
  const num = (pot - um) * 100_000_000n;
  return (num * 2n + pot) / (2n * pot);
}

/** Formata milionésimos de ponto percentual como o GCAP ("56,157121"). */
const formatarPercentual = (micro: bigint) =>
  `${micro / 1_000_000n},${(micro % 1_000_000n).toString().padStart(6, "0")}`;

/**
 * Simulador de ganho de capital (orientação; o demonstrativo oficial é o GCAP). Conferido ao
 * centavo com o GCAP 2025 nos casos `gcap-*` de `packages/core/test/golden/2026`
 * (docs/regras/irpf-2026.md, seção Ganho de capital): reduções aplicadas em cascata (Lei
 * 7.713/1988, FR1 e FR2 da Lei 11.196/2005, com os meses contados inclusive e o percentual
 * arredondado na sexta casa), cada redução truncada no centavo, isenção do único imóvel sobre o
 * que resta e limite de pequeno valor de R$ 35.000,00 também para quotas fora de bolsa.
 */
export function calcularGanhoCapital(e: EntradaGanhoCapital) {
  const avisos: string[] = [];
  const liquido = e.valorAlienacao - e.custoCorretagem;
  const bruto = liquido - e.custoAquisicao;
  const detalhe = {
    lei7713: 0n,
    fr1: 0n,
    fr2: 0n,
    outroImovel: 0n,
    unicoImovel: 0n,
    pequenoValor: 0n,
  };
  const percentuais = { lei7713: 0n, fr1: 0n, fr2: 0n };
  const impostoPago = e.impostoPago ?? 0n;
  const montar = (ganhoTributavel: bigint, imposto: bigint) => {
    const reducoes = Object.values(detalhe).reduce((s, v) => s + v, 0n);
    return {
      ganhoBruto: bruto,
      reducoes,
      reducoesDetalhadas: { ...detalhe },
      percentuaisReducao: {
        lei7713: formatarPercentual(percentuais.lei7713),
        fr1: formatarPercentual(percentuais.fr1),
        fr2: formatarPercentual(percentuais.fr2),
      },
      ganhoTributavel,
      isento: bruto > 0n ? reducoes : 0n,
      imposto,
      impostoPago,
      /** Valor que o GCAP transporta para Rendimentos de Tributação Exclusiva. */
      rendimentoExclusivo: ganhoTributavel > impostoPago ? ganhoTributavel - impostoPago : 0n,
      avisos,
    };
  };
  if (bruto <= 0n) return montar(0n, 0n);
  let ganho = bruto;
  const reduzir = (campo: "lei7713" | "fr1" | "fr2", micro: bigint) => {
    percentuais[campo] = micro;
    const r = (ganho * micro) / 100_000_000n;
    detalhe[campo] = r;
    ganho -= r;
  };
  const ano = Number(e.dataAquisicao.slice(0, 4));
  const mesAquisicao = e.dataAquisicao.slice(0, 7);
  if (e.tipo === "imovel") {
    if (ano <= 1988) {
      const pct = ano <= 1969 ? 100 : 5 * (1988 - ano + 1);
      reduzir("lei7713", BigInt(pct) * 1_000_000n);
      avisos.push(`Redução da Lei 7.713/1988 de ${pct}% por aquisição em ${ano}.`);
    }
    // FR1: de janeiro de 1996 (ou do mês de aquisição) a novembro de 2005, inclusive.
    if (mesAquisicao <= "2005-11") {
      const inicio = mesAquisicao < "1996-01" ? "1996-01" : mesAquisicao;
      reduzir("fr1", percentualFator(10_060n, mesesInclusivos(inicio, "2005-11")));
    }
    // FR2: de dezembro de 2005 (ou do mês de aquisição) ao mês da alienação, inclusive.
    const inicioFr2 = mesAquisicao <= "2005-11" ? "2005-12" : mesAquisicao;
    reduzir("fr2", percentualFator(10_035n, mesesInclusivos(inicioFr2, e.dataAlienacao.slice(0, 7))));
    if (e.unicoImovel && e.valorAlienacao <= 44_000_000n) {
      avisos.push(
        "Isenção do único imóvel até R$ 440.000,00 sem outra alienação nos últimos 5 anos.",
      );
      detalhe.unicoImovel = ganho;
      return montar(0n, 0n);
    }
    const aplicado = e.valorAplicadoOutroImovel ?? 0n;
    if (aplicado > 0n) {
      const prop = aplicado >= e.valorAlienacao ? ganho : (ganho * aplicado) / e.valorAlienacao;
      detalhe.outroImovel = prop;
      ganho -= prop;
      avisos.push(
        "Isenção proporcional do valor aplicado em outro imóvel residencial em até 180 dias (Lei 11.196/2005 art. 39).",
      );
    }
  }
  // O GCAP aplica R$ 35.000,00 também às quotas de sociedade fora de bolsa
  // (caso gcap-participacao-pequeno-valor-01).
  const limitePequeno = 3_500_000n;
  if ((e.totalAlienadoNoMes ?? e.valorAlienacao) <= limitePequeno) {
    avisos.push(
      `Isenção de bens de pequeno valor (alienações do mês até ${limitePequeno / 100n} reais).`,
    );
    detalhe.pequenoValor = ganho;
    return montar(0n, 0n);
  }
  const faixas: [bigint, bigint][] = [
    [500_000_000n, 150n],
    [1_000_000_000n, 175n],
    [3_000_000_000n, 200n],
  ];
  let imposto = 0n;
  let anterior = 0n;
  for (const [teto, aliq] of faixas) {
    if (ganho > anterior) imposto += (((ganho < teto ? ganho : teto) - anterior) * aliq) / 1000n;
    anterior = teto;
  }
  if (ganho > anterior) imposto += ((ganho - anterior) * 225n) / 1000n;
  return montar(ganho, imposto);
}

export interface RespostasObrigatoriedade {
  rendimentosTributaveis?: bigint;
  isentosExclusivos?: bigint;
  ganhoCapitalTributavel?: boolean;
  alienacoesBolsa?: bigint;
  ganhoLiquidoTributavelBolsa?: boolean;
  receitaBrutaRural?: bigint;
  compensarPrejuizoRural?: boolean;
  bens?: bigint;
  passouAResidente?: boolean;
  isencaoReaplicacaoImovel?: boolean;
  aplicacoesExterior?: boolean;
  trust?: boolean;
}

/** Critérios de obrigatoriedade da declaração de 2026 (IN RFB 2.312/2026 art. 2º). */
export function verificarObrigatoriedade(r: RespostasObrigatoriedade) {
  const criterios: { criterio: string; atende: boolean }[] = [
    {
      criterio: "Rendimentos tributáveis acima de R$ 35.584,00",
      atende: (r.rendimentosTributaveis ?? 0n) > 3_558_400n,
    },
    {
      criterio: "Rendimentos isentos, não tributáveis ou exclusivos acima de R$ 200.000,00",
      atende: (r.isentosExclusivos ?? 0n) > 20_000_000n,
    },
    { criterio: "Ganho de capital tributável", atende: r.ganhoCapitalTributavel ?? false },
    {
      criterio: "Operações em bolsa acima de R$ 40.000,00 ou com ganho líquido tributável",
      atende: (r.alienacoesBolsa ?? 0n) > 4_000_000n || (r.ganhoLiquidoTributavelBolsa ?? false),
    },
    {
      criterio:
        "Receita bruta da atividade rural acima de R$ 177.920,00 ou prejuízo rural a compensar",
      atende: (r.receitaBrutaRural ?? 0n) > 17_792_000n || (r.compensarPrejuizoRural ?? false),
    },
    {
      criterio: "Bens e direitos acima de R$ 800.000,00 em 31/12/2025",
      atende: (r.bens ?? 0n) > 80_000_000n,
    },
    {
      criterio: "Passou à condição de residente no Brasil em 2025",
      atende: r.passouAResidente ?? false,
    },
    {
      criterio: "Isenção na venda de imóvel residencial com reaplicação em 180 dias",
      atende: r.isencaoReaplicacaoImovel ?? false,
    },
    {
      criterio:
        "Aplicações financeiras, lucros ou entidades controladas no exterior (Lei 14.754/2023)",
      atende: r.aplicacoesExterior ?? false,
    },
    { criterio: "Titular de trust ou beneficiário de trust no exterior", atende: r.trust ?? false },
  ];
  return { obrigado: criterios.some((c) => c.atende), criterios };
}
