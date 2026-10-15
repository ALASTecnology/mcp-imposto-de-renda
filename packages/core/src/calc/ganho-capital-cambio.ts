/**
 * Apuração em dólar do ganho de capital, como o GCAP 2025 faz para bens adquiridos no exterior
 * e para moeda estrangeira em espécie. Regras e arredondamentos conferidos com o programa
 * oficial (dados sintéticos, casos gcap-exterior-* e gcap-especie-* de tools/referencia):
 *
 * - conversões de dólar para reais truncadas no centavo;
 * - bem comprado com rendimentos em reais e em moeda estrangeira: rateio pelo custo em dólar,
 *   percentual com 9 casas (meio para cima); a parte estrangeira do valor e do valor líquido é
 *   truncada e a nacional fica com o resto; a corretagem de cada parte é o valor menos o
 *   líquido;
 * - parte nacional: líquido convertido pela cotação da alienação menos o custo convertido pela
 *   cotação da aquisição; parte estrangeira: ganho apurado em dólar e convertido pela cotação
 *   da alienação;
 * - moeda em espécie: custo médio ponderado com 6 casas (truncado), custo da venda = quantidade
 *   x custo médio (truncado), saldo em reais reduzido pelo custo da venda; alienações do mês em
 *   dólar = soma de valor / cotação, truncada; ganho isento quando o total alienado no ano não
 *   passa de US$ 5.000,00.
 */

/** Origem dos rendimentos com que o bem no exterior foi adquirido. */
export type OrigemCambio = "nacional" | "estrangeira" | "ambas";

export interface EntradaBemExterior {
  origem: OrigemCambio;
  /** Cotações do dólar com 4 casas (`55000` = 5,5000). */
  cotacaoAquisicao: bigint;
  cotacaoAlienacao: bigint;
  /** Valores em centavos de dólar. */
  valorAlienacaoDolar: bigint;
  corretagemDolar: bigint;
  custoNacionalDolar: bigint;
  custoEstrangeiraDolar: bigint;
}

/** 100% com 9 casas decimais. */
const CEM_POR_CENTO = 100_000_000_000n;
const converter = (dolar: bigint, cotacao4: bigint) => (dolar * cotacao4) / 10_000n;

/** Apuração de bem adquirido no exterior (registros 64 e 69 do arquivo da declaração). */
export function apurarBemExterior(e: EntradaBemExterior) {
  const custoTotal = e.custoNacionalDolar + e.custoEstrangeiraDolar;
  const percentualEstrangeira =
    e.origem === "estrangeira"
      ? CEM_POR_CENTO
      : e.origem === "nacional" || custoTotal === 0n
        ? 0n
        : (e.custoEstrangeiraDolar * CEM_POR_CENTO * 2n + custoTotal) / (2n * custoTotal);
  const parte = (v: bigint) => (v * percentualEstrangeira) / CEM_POR_CENTO;
  const valor = e.valorAlienacaoDolar;
  const liquido = valor - e.corretagemDolar;
  const valorE = parte(valor);
  const liquidoE = parte(liquido);
  const valorN = valor - valorE;
  const liquidoN = liquido - liquidoE;
  const liquidoReaisN = converter(liquidoN, e.cotacaoAlienacao);
  const custoReaisN = converter(e.custoNacionalDolar, e.cotacaoAquisicao);
  const ganhoReaisN = liquidoReaisN - custoReaisN;
  const ganhoDolarE = liquidoE - e.custoEstrangeiraDolar;
  const ganhoReaisE = converter(ganhoDolarE, e.cotacaoAlienacao);
  const total = ganhoReaisN + ganhoReaisE;
  return {
    /** Percentual do custo pago com moeda estrangeira, 9 casas (`50000000000` = 50%). */
    percentualEstrangeira,
    nacional: {
      valorDolar: valorN,
      corretagemDolar: valorN - liquidoN,
      liquidoDolar: liquidoN,
      liquidoReais: liquidoReaisN,
      custoDolar: e.custoNacionalDolar,
      custoReais: custoReaisN,
      ganhoReais: ganhoReaisN,
    },
    estrangeira: {
      valorDolar: valorE,
      corretagemDolar: valorE - liquidoE,
      liquidoDolar: liquidoE,
      custoDolar: e.custoEstrangeiraDolar,
      ganhoDolar: ganhoDolarE,
      ganhoReais: ganhoReaisE,
    },
    valorAlienacaoReais: converter(valor, e.cotacaoAlienacao),
    corretagemReais: converter(e.corretagemDolar, e.cotacaoAlienacao),
    /** Ganho de capital em reais (zero quando há perda). */
    ganhoTotal: total > 0n ? total : 0n,
  };
}

export type ApuracaoBemExterior = ReturnType<typeof apurarBemExterior>;

export interface OperacaoEspecieEntrada {
  tipo: "compra" | "venda";
  /** AAAA-MM-DD. */
  data: string;
  /** Quantidade em centésimos da moeda. */
  quantidade: bigint;
  /** Valor da operação em reais (centavos). */
  valor: bigint;
  /** Cotação do dólar na venda, com 7 casas como no GCAP (`58000000` = 5,8000000). */
  cotacaoDolar?: bigint;
}

export interface EntradaMoedaEspecie {
  /** Estoque em 1º de janeiro (centésimos da moeda) e saldo em reais nessa data. */
  estoqueInicial: bigint;
  saldoInicial: bigint;
  operacoes: OperacaoEspecieEntrada[];
}

/** Limite anual de alienações de moeda em espécie para a isenção, em centavos de dólar. */
export const LIMITE_ISENCAO_ESPECIE_DOLAR = 500_000n;

/** Imposto das faixas do art. 21 da Lei 8.981/1995, truncado no centavo. */
export function impostoFaixasGanhoCapital(ganho: bigint): bigint {
  const faixas: [bigint, bigint][] = [
    [500_000_000n, 150n],
    [1_000_000_000n, 175n],
    [3_000_000_000n, 200n],
  ];
  let soma = 0n;
  let anterior = 0n;
  for (const [teto, aliquota] of faixas) {
    if (ganho > anterior) soma += ((ganho < teto ? ganho : teto) - anterior) * aliquota;
    anterior = teto;
  }
  if (ganho > anterior) soma += (ganho - anterior) * 225n;
  return soma / 1000n;
}

/** Apuração da moeda estrangeira em espécie de um demonstrativo (registros 74 e 76). */
export function apurarMoedaEspecie(e: EntradaMoedaEspecie) {
  const medio = (saldo: bigint, estoque: bigint) =>
    estoque > 0n ? (saldo * 1_000_000n) / estoque : 0n;
  let estoque = e.estoqueInicial;
  let saldo = e.saldoInicial;
  let custoMedio = medio(saldo, estoque);
  const custoMedioInicial = custoMedio;
  // Alienações do mês em dólar como fração exata (numerador sobre denominador comum).
  const dolarMes = Array.from({ length: 12 }, () => ({ num: 0n, den: 1n }));
  const ganhoMes = Array<bigint>(12).fill(0n);
  const operacoes = e.operacoes.map((o) => {
    const mes = Number(o.data.slice(5, 7)) - 1;
    if (o.tipo === "compra") {
      estoque += o.quantidade;
      saldo += o.valor;
      custoMedio = medio(saldo, estoque);
      return { estoque, saldo, custoMedio, custo: 0n, ganho: 0n };
    }
    const custo = (o.quantidade * custoMedio) / 1_000_000n;
    const ganho = o.valor - custo;
    estoque -= o.quantidade;
    saldo -= custo;
    const cot = o.cotacaoDolar ?? 0n;
    const acumulado = dolarMes[mes];
    if (cot > 0n && acumulado) {
      // valor (centavos de real) / (cot / 10^7) = valor x 10^7 / cot centavos de dólar.
      acumulado.num = acumulado.num * cot + o.valor * 10_000_000n * acumulado.den;
      acumulado.den *= cot;
    }
    ganhoMes[mes] = (ganhoMes[mes] ?? 0n) + ganho;
    return { estoque, saldo, custoMedio, custo, ganho };
  });
  const alienadoMes = dolarMes.map((f) => f.num / f.den);
  const totalDolar = alienadoMes.reduce((s, v) => s + v, 0n);
  const isento = totalDolar <= LIMITE_ISENCAO_ESPECIE_DOLAR;
  let consolidado = 0n;
  const meses = alienadoMes.map((dolar, i) => {
    consolidado += dolar;
    const ganho = ganhoMes[i] ?? 0n;
    const tributavel = isento || ganho <= 0n ? 0n : ganho;
    return {
      alienacaoDolar: dolar,
      alienacaoConsolidadaDolar: consolidado,
      ganhoCapital: ganho,
      ganhoTributavel: tributavel,
      impostoDevido: impostoFaixasGanhoCapital(tributavel),
      impostoPago: 0n,
    };
  });
  return {
    custoMedioInicial,
    operacoes,
    meses,
    totalAlienadoDolar: totalDolar,
    ganhoCapital: ganhoMes.reduce((s, v) => s + v, 0n),
    ganhoTributavel: meses.reduce((s, m) => s + m.ganhoTributavel, 0n),
    impostoDevido: meses.reduce((s, m) => s + m.impostoDevido, 0n),
    isento,
  };
}
