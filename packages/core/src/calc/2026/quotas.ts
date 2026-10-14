/**
 * Quotas do saldo de imposto a pagar e multa por atraso na entrega (MAED),
 * exercício 2026. Regras: Perguntas e Respostas IRPF 2026, pergunta 063, e
 * resposta sobre multa por atraso (ver docs/regras/irpf-2026.md).
 */
import { type Centavos, centavos, formatCentavos } from "../../centavos.js";
import { CalculoInvalidoError, maximo, minimo, percentual } from "../aritmetica.js";
import {
  compararDatas,
  formatarData,
  indiceMes,
  lerData,
  mesDoIndice,
  ultimoDiaUtilSemFeriados,
} from "../datas.js";
import { PARAMETROS_2026 as P } from "./parametros.js";

const brl = (v: Centavos): string => `R$ ${formatCentavos(v)}`;

export interface Quota {
  numero: number;
  vencimento: string;
  principal: Centavos;
  /** Percentual de juros em centésimos de ponto (210 = 2,10%); null se faltar Selic. */
  percentualJuros: bigint | null;
  juros: Centavos | null;
  total: Centavos | null;
}

export interface ResultadoQuotas {
  saldo: Centavos;
  numeroQuotas: number;
  quotas: Quota[];
  avisos: string[];
}

export interface OpcoesQuotas {
  /**
   * Selic mensal por mês ("AAAA-MM"), em centésimos de ponto percentual
   * (110n = 1,10%). Necessária a partir da 3ª quota.
   */
  selicMensal?: Readonly<Record<string, bigint>>;
}

function chaveMes(i: number): string {
  const m = mesDoIndice(i);
  return `${m.ano}-${String(m.mes).padStart(2, "0")}`;
}

/**
 * Divide o saldo em `n` quotas. A 1ª vence em `dataVencimento` (padrão
 * 29/05/2026, prazo do exercício 2026) e as demais no último dia útil de cada
 * mês seguinte (tabela oficial de 2026 quando a data é a padrão; nas demais,
 * só fins de semana são considerados). O resto da divisão fica na 1ª quota.
 */
export function calcularQuotas(
  saldo: Centavos,
  n: number,
  dataVencimento?: string,
  opcoes: OpcoesQuotas = {},
): ResultadoQuotas {
  if (saldo < P.saldoMinimoRecolhimento) {
    return {
      saldo,
      numeroQuotas: 0,
      quotas: [],
      avisos: [
        `Saldo de ${brl(saldo)} é inferior a R$ 10,00: não é recolhido e se soma ao imposto dos exercícios seguintes até atingir R$ 10,00.`,
      ],
    };
  }
  if (!Number.isInteger(n) || n < 1 || n > P.quotasMaximo) {
    throw new CalculoInvalidoError(
      `Número de quotas deve ser de 1 a ${P.quotasMaximo}, recebido ${n}`,
    );
  }
  if (n > 1 && saldo < P.quotaUnicaAbaixoDe) {
    throw new CalculoInvalidoError(
      `Imposto inferior a R$ 100,00 deve ser pago em quota única (saldo ${brl(saldo)})`,
    );
  }
  const base = saldo / BigInt(n);
  if (n > 1 && base < P.quotaMinima) {
    const max = Number(saldo / P.quotaMinima);
    throw new CalculoInvalidoError(
      `Nenhuma quota pode ser inferior a R$ 50,00: com saldo de ${brl(saldo)} o máximo é ${max} quota(s)`,
    );
  }
  const resto = saldo - base * BigInt(n);

  const primeira = lerData(dataVencimento ?? P.vencimentosQuotas[0] ?? P.prazoEntrega);
  const tabelaOficial = formatarData(primeira) === P.vencimentosQuotas[0];
  const mes0 = indiceMes(primeira);
  const avisos: string[] = [];
  const selic = opcoes.selicMensal ?? {};

  const quotas: Quota[] = [];
  for (let k = 1; k <= n; k++) {
    const principal = centavos(k === 1 ? base + resto : base);
    let vencimento: string;
    if (k === 1) vencimento = formatarData(primeira);
    else if (tabelaOficial) vencimento = P.vencimentosQuotas[k - 1] ?? "";
    else {
      const m = mesDoIndice(mes0 + k - 1);
      vencimento = formatarData(ultimoDiaUtilSemFeriados(m.ano, m.mes));
    }
    let percentualJuros: bigint | null = 0n;
    if (k >= 2) {
      // Selic acumulada do mês seguinte ao da 1ª quota até o mês anterior ao do pagamento, mais 1%.
      let soma = 100n;
      for (let i = mes0 + 1; i <= mes0 + k - 2; i++) {
        const v = selic[chaveMes(i)];
        if (v === undefined) {
          percentualJuros = null;
          avisos.push(`Quota ${k}: Selic de ${chaveMes(i)} não informada; juros não calculados.`);
          break;
        }
        soma += v;
      }
      if (percentualJuros !== null) percentualJuros = soma;
    }
    const juros = percentualJuros === null ? null : percentual(principal, percentualJuros, 10000n);
    quotas.push({
      numero: k,
      vencimento,
      principal,
      percentualJuros,
      juros,
      total: juros === null ? null : centavos(principal + juros),
    });
  }
  return { saldo, numeroQuotas: n, quotas, avisos };
}

export interface ResultadoMulta {
  multa: Centavos;
  /** Meses-calendário ou fração de atraso. */
  meses: number;
  explicacao: string;
}

/**
 * Multa por atraso na entrega: 1% ao mês-calendário ou fração sobre o imposto
 * devido (ainda que pago), mínimo de R$ 165,74 e máximo de 20%; sem imposto
 * devido, R$ 165,74. O atraso conta do dia seguinte ao prazo (30/05/2026) até
 * o mês da entrega, de modo que 30 e 31 de maio já são uma fração de mês.
 */
export function calcularMultaAtraso(impostoDevido: Centavos, dataEntrega: string): ResultadoMulta {
  const entrega = lerData(dataEntrega);
  const prazo = lerData(P.prazoEntrega);
  if (compararDatas(entrega, prazo) <= 0) {
    return {
      multa: centavos(0n),
      meses: 0,
      explicacao: "Entrega dentro do prazo (29/05/2026): sem multa.",
    };
  }
  const meses = indiceMes(entrega) - indiceMes(prazo) + 1;
  if (impostoDevido <= 0n) {
    return {
      multa: P.multaAtrasoMinima,
      meses,
      explicacao: `Sem imposto devido: multa fixa de ${brl(P.multaAtrasoMinima)}.`,
    };
  }
  const proporcional = percentual(impostoDevido, BigInt(meses) * P.multaAtrasoPercentualMes, 100n);
  const teto = percentual(impostoDevido, P.multaAtrasoPercentualMaximo, 100n);
  const multa = maximo(minimo(proporcional, teto), P.multaAtrasoMinima);
  return {
    multa,
    meses,
    explicacao: `${meses} mês(es) de atraso x 1% de ${brl(impostoDevido)} = ${brl(proporcional)}, limitado a 20% (${brl(teto)}) e no mínimo ${brl(P.multaAtrasoMinima)}: ${brl(multa)}.`,
  };
}
