/**
 * Motor de cálculo do IRPF, exercício 2026 (ano-calendário 2025).
 *
 * Puro e determinístico: recebe a entrada no formato dos casos de referência e
 * devolve os valores do Resumo da declaração nos dois modelos, com a memória de
 * cálculo linha a linha. Regras e fontes em docs/regras/irpf-2026.md.
 */
import { type Centavos, centavos, formatCentavos, somaCentavos } from "../../centavos.js";
import {
  formatarCentesimosPercentual,
  lerCentavos,
  minimo,
  naoNegativo,
  percentualTruncado,
  ZERO,
} from "../aritmetica.js";
import { idadeEm, lerData } from "../datas.js";
import {
  CODIGOS_DOACAO_2026,
  CODIGOS_PAGAMENTO_2026,
  FONTES_2026,
  PARAMETROS_2026 as P,
  TABELA_ANUAL_2026,
} from "./parametros.js";
import type {
  ComparacaoModelos,
  DeducoesCompleto,
  EntradaCalculo2026,
  ImpostoPagoCalculo,
  LinhaMemoria,
  PagamentoEntrada,
  ResultadoCalculo2026,
  ResultadoCompleto,
  ResultadoSimplificado,
} from "./tipos.js";

const brl = (v: Centavos): string => `R$ ${formatCentavos(v)}`;

function linha(codigo: string, descricao: string, valor: bigint, regra: string): LinhaMemoria {
  return { codigo, descricao, valor: valor.toString(), regra };
}

/** Imposto pela tabela progressiva anual do exercício 2026. */
export function impostoTabelaAnual(base: Centavos): Centavos {
  if (base <= 0n) return ZERO;
  for (const faixa of TABELA_ANUAL_2026) {
    if (faixa.ate === null || base <= faixa.ate) {
      if (faixa.aliquotaMilesimos === 0n) return ZERO;
      return naoNegativo(
        centavos(percentualTruncado(base, faixa.aliquotaMilesimos, 1000n) - faixa.parcelaDeduzir),
      );
    }
  }
  /* c8 ignore next */
  return ZERO;
}

function descreverFaixa(base: Centavos): string {
  for (const faixa of TABELA_ANUAL_2026) {
    if (faixa.ate === null || base <= faixa.ate) {
      if (faixa.aliquotaMilesimos === 0n) return "faixa isenta (até R$ 28.467,20)";
      const aliq = formatarCentesimosPercentual(faixa.aliquotaMilesimos * 10n);
      return `alíquota de ${aliq} menos parcela a deduzir de ${brl(faixa.parcelaDeduzir)}`;
    }
  }
  /* c8 ignore next */
  return "";
}

/** Valores somados das fichas, lidos e validados uma única vez. */
interface Totais {
  rendimentosPJ: Centavos;
  rendimentosPF: Centavos;
  exterior: Centavos;
  previdenciaOficialPJ: Centavos;
  previdenciaOficialPF: Centavos;
  livroCaixa: Centavos;
  irrf: Centavos;
  carneLeao: Centavos;
  complementar: Centavos;
  exteriorPago: Centavos;
  irrfLei11033: Centavos;
  quantidadeDependentes: number;
}

function lerTotais(e: EntradaCalculo2026): Totais {
  const t: Totais = {
    rendimentosPJ: ZERO,
    rendimentosPF: ZERO,
    exterior: ZERO,
    previdenciaOficialPJ: ZERO,
    previdenciaOficialPF: ZERO,
    livroCaixa: ZERO,
    irrf: ZERO,
    carneLeao: ZERO,
    complementar: lerCentavos(e.impostoPago?.complementar, "impostoPago.complementar"),
    exteriorPago: lerCentavos(e.impostoPago?.exterior, "impostoPago.exterior"),
    irrfLei11033: lerCentavos(e.impostoPago?.irrfLei11033, "impostoPago.irrfLei11033"),
    quantidadeDependentes: e.dependentes?.length ?? 0,
  };
  (e.rendimentosPJ ?? []).forEach((r, i) => {
    const p = `rendimentosPJ[${i}]`;
    t.rendimentosPJ = somaCentavos(t.rendimentosPJ, lerCentavos(r.rendimento, `${p}.rendimento`));
    t.previdenciaOficialPJ = somaCentavos(
      t.previdenciaOficialPJ,
      lerCentavos(r.previdenciaOficial, `${p}.previdenciaOficial`),
    );
    t.irrf = somaCentavos(t.irrf, lerCentavos(r.irrf, `${p}.irrf`));
    // 13º e IRRF sobre o 13º são de tributação exclusiva: validados, mas fora do ajuste.
    lerCentavos(r.decimoTerceiro, `${p}.decimoTerceiro`);
    lerCentavos(r.irrfDecimoTerceiro, `${p}.irrfDecimoTerceiro`);
  });
  (e.rendimentosPF?.meses ?? []).forEach((m, i) => {
    const p = `rendimentosPF.meses[${i}]`;
    t.rendimentosPF = somaCentavos(
      t.rendimentosPF,
      lerCentavos(m.pessoaFisica, `${p}.pessoaFisica`),
    );
    t.exterior = somaCentavos(t.exterior, lerCentavos(m.exterior, `${p}.exterior`));
    t.previdenciaOficialPF = somaCentavos(
      t.previdenciaOficialPF,
      lerCentavos(m.previdenciaOficial, `${p}.previdenciaOficial`),
    );
    t.livroCaixa = somaCentavos(t.livroCaixa, lerCentavos(m.livroCaixa, `${p}.livroCaixa`));
    t.carneLeao = somaCentavos(t.carneLeao, lerCentavos(m.carneLeao, `${p}.carneLeao`));
  });
  return t;
}

function rendimentosTributaveis(t: Totais, comExterior: boolean): Centavos {
  return somaCentavos(t.rendimentosPJ, t.rendimentosPF, comExterior ? t.exterior : ZERO);
}

function valorDedutivel(p: PagamentoEntrada, i: number): Centavos {
  const valor = lerCentavos(p.valor, `pagamentos[${i}].valor`);
  const nd = lerCentavos(p.parcelaNaoDedutivel, `pagamentos[${i}].parcelaNaoDedutivel`);
  return naoNegativo(centavos(valor - nd));
}

function chavePessoa(p: PagamentoEntrada): string {
  if (p.beneficiario === "D") return `dependente ${p.cpfDependente ?? "sem CPF"}`;
  if (p.beneficiario === "A") return `alimentando ${p.cpfDependente ?? p.cpfCnpj ?? "sem CPF"}`;
  return "titular";
}

interface ApuracaoCompleto {
  rendimentos: Centavos;
  deducoes: DeducoesCompleto;
  total: Centavos;
  base: Centavos;
  impostoTabela: Centavos;
  memoria: LinhaMemoria[];
}

function apurarCompleto(e: EntradaCalculo2026, t: Totais, comExterior: boolean): ApuracaoCompleto {
  const mem: LinhaMemoria[] = [];
  const rendimentos = rendimentosTributaveis(t, comExterior);
  mem.push(
    linha(
      "rendimentos.tributaveis",
      `Rendimentos tributáveis: PJ ${brl(t.rendimentosPJ)} + PF ${brl(t.rendimentosPF)} + exterior ${brl(comExterior ? t.exterior : ZERO)} = ${brl(rendimentos)}`,
      rendimentos,
      "Resumo, Rendimentos Tributáveis: soma das fichas de PJ (titular e dependentes) e de PF/Exterior. O 13º salário fica fora (tributação exclusiva).",
    ),
  );

  const previdenciaOficial = somaCentavos(t.previdenciaOficialPJ, t.previdenciaOficialPF);
  mem.push(
    linha(
      "deducao.previdenciaOficial",
      `Previdência oficial: fichas PJ ${brl(t.previdenciaOficialPJ)} + PF ${brl(t.previdenciaOficialPF)} = ${brl(previdenciaOficial)}`,
      previdenciaOficial,
      "Lei 9.250/1995, art. 8º, II, d; sem limite.",
    ),
  );

  let complementarInformada = ZERO;
  let medicas = ZERO;
  let pensao = ZERO;
  const instrucaoPorPessoa = new Map<string, Centavos>();
  (e.pagamentos ?? []).forEach((p, i) => {
    const v = valorDedutivel(p, i);
    if (CODIGOS_PAGAMENTO_2026.instrucao.has(p.codigo)) {
      const k = chavePessoa(p);
      instrucaoPorPessoa.set(k, somaCentavos(instrucaoPorPessoa.get(k) ?? ZERO, v));
    } else if (CODIGOS_PAGAMENTO_2026.medicas.has(p.codigo)) {
      medicas = somaCentavos(medicas, v);
    } else if (
      CODIGOS_PAGAMENTO_2026.pensaoJudicial.has(p.codigo) ||
      CODIGOS_PAGAMENTO_2026.pensaoEscritura.has(p.codigo)
    ) {
      pensao = somaCentavos(pensao, v);
    } else if (CODIGOS_PAGAMENTO_2026.previdenciaComplementar.has(p.codigo)) {
      complementarInformada = somaCentavos(complementarInformada, v);
    }
  });

  const limite12 = percentualTruncado(rendimentos, P.previdenciaComplementarPercentual, 100n);
  const previdenciaComplementar = minimo(complementarInformada, limite12);
  mem.push(
    linha(
      "deducao.previdenciaComplementar",
      `Previdência complementar e Fapi (códigos 36 e 37): informado ${brl(complementarInformada)}, limite de 12% de ${brl(rendimentos)} = ${brl(limite12)}; dedução ${brl(previdenciaComplementar)}`,
      previdenciaComplementar,
      "Lei 9.250/1995, art. 8º, II, e, e Lei 9.532/1997, art. 11: limitada a 12% do total dos rendimentos tributáveis.",
    ),
  );

  const dependentes = centavos(P.deducaoDependente * BigInt(t.quantidadeDependentes));
  mem.push(
    linha(
      "deducao.dependentes",
      `Dependentes: ${t.quantidadeDependentes} x ${brl(P.deducaoDependente)} = ${brl(dependentes)}`,
      dependentes,
      "Lei 9.250/1995, art. 8º, II, c: R$ 2.275,08 por dependente no ano.",
    ),
  );

  let instrucao = ZERO;
  const partesInstrucao: string[] = [];
  for (const [pessoa, valor] of instrucaoPorPessoa) {
    const limitado = minimo(valor, P.limiteInstrucao);
    instrucao = somaCentavos(instrucao, limitado);
    partesInstrucao.push(`${pessoa}: ${brl(valor)} -> ${brl(limitado)}`);
  }
  mem.push(
    linha(
      "deducao.instrucao",
      `Instrução (códigos 01 e 02), limite de ${brl(P.limiteInstrucao)} por pessoa${partesInstrucao.length ? ` (${partesInstrucao.join("; ")})` : ""}: ${brl(instrucao)}`,
      instrucao,
      "Lei 9.250/1995, art. 8º, II, b: limite individual por titular, dependente ou alimentando; o excesso de um não aproveita a outro.",
    ),
  );

  mem.push(
    linha(
      "deducao.medicas",
      `Despesas médicas (códigos 09 a 22 e 26), valor pago menos parcela não dedutível/reembolso: ${brl(medicas)}`,
      medicas,
      "Lei 9.250/1995, art. 8º, II, a: sem limite.",
    ),
  );
  mem.push(
    linha(
      "deducao.pensao",
      `Pensão alimentícia judicial ou por escritura pública (códigos 30, 31, 33 e 34): ${brl(pensao)}`,
      pensao,
      "Lei 9.250/1995, art. 8º, II, f: sem limite. A coluna Pensão da ficha PF é só informativa.",
    ),
  );
  mem.push(
    linha(
      "deducao.livroCaixa",
      `Livro-caixa (ficha PF/Exterior): ${brl(t.livroCaixa)}`,
      t.livroCaixa,
      "Lei 8.134/1990, art. 6º: despesas escrituradas; o limite mensal à receita é validado no preenchimento e não é refeito aqui.",
    ),
  );

  const deducoes: DeducoesCompleto = {
    previdenciaOficial,
    previdenciaComplementar,
    dependentes,
    instrucao,
    medicas,
    pensaoAlimenticia: pensao,
    livroCaixa: t.livroCaixa,
  };
  const total = somaCentavos(...Object.values(deducoes));
  mem.push(
    linha(
      "deducoes.total",
      `Total de deduções: ${brl(total)}`,
      total,
      "Resumo, Deduções: soma das linhas acima.",
    ),
  );
  const base = naoNegativo(centavos(rendimentos - total));
  mem.push(
    linha(
      "baseCalculo",
      `Base de cálculo: ${brl(rendimentos)} - ${brl(total)} = ${brl(base)}`,
      base,
      "Base = rendimentos tributáveis menos deduções, nunca negativa.",
    ),
  );
  const impostoTabela = impostoTabelaAnual(base);
  mem.push(
    linha(
      "imposto.tabela",
      `Imposto pela tabela anual (${descreverFaixa(base)}): ${brl(impostoTabela)}`,
      impostoTabela,
      `Tabela progressiva anual do exercício 2026 (${FONTES_2026.tabelas2025}). Frações de centavo arredondadas ao centavo mais próximo, meio para cima.`,
    ),
  );
  return { rendimentos, deducoes, total, base, impostoTabela, memoria: mem };
}

interface ApuracaoSimplificado {
  rendimentos: Centavos;
  desconto: Centavos;
  base: Centavos;
  impostoTabela: Centavos;
  memoria: LinhaMemoria[];
}

function apurarSimplificado(t: Totais, comExterior: boolean): ApuracaoSimplificado {
  const rendimentos = rendimentosTributaveis(t, comExterior);
  const vinte = percentualTruncado(rendimentos, P.descontoSimplificadoPercentual, 100n);
  const desconto = minimo(vinte, P.descontoSimplificadoTeto);
  const base = naoNegativo(centavos(rendimentos - desconto));
  const impostoTabela = impostoTabelaAnual(base);
  const memoria = [
    linha(
      "rendimentos.tributaveis",
      `Rendimentos tributáveis: ${brl(rendimentos)}`,
      rendimentos,
      "Mesma soma do modelo completo.",
    ),
    linha(
      "desconto.simplificado",
      `Desconto simplificado: 20% de ${brl(rendimentos)} = ${brl(vinte)}, limitado a ${brl(P.descontoSimplificadoTeto)}; desconto ${brl(desconto)}`,
      desconto,
      "Lei 9.250/1995, art. 10, com o teto do exercício 2026: substitui todas as deduções legais.",
    ),
    linha(
      "baseCalculo",
      `Base de cálculo: ${brl(rendimentos)} - ${brl(desconto)} = ${brl(base)}`,
      base,
      "Base = rendimentos tributáveis menos o desconto simplificado.",
    ),
    linha(
      "imposto.tabela",
      `Imposto pela tabela anual (${descreverFaixa(base)}): ${brl(impostoTabela)}`,
      impostoTabela,
      "Tabela progressiva anual do exercício 2026; no simplificado não há dedução de incentivo.",
    ),
  ];
  return { rendimentos, desconto, base, impostoTabela, memoria };
}

/**
 * Deduções de incentivo (só no modelo completo), na ordem das Perguntas e
 * Respostas 2026, pergunta 455.
 */
function deducaoIncentivo(
  e: EntradaCalculo2026,
  imposto: Centavos,
): { valor: Centavos; memoria: LinhaMemoria[] } {
  const pct = (n: bigint) => percentualTruncado(imposto, n, 100n);
  const eca = lerCentavos(e.doacoesDiretas?.eca, "doacoesDiretas.eca");
  const idoso = lerCentavos(e.doacoesDiretas?.idoso, "doacoesDiretas.idoso");
  let grupoBase = ZERO;
  let desporto = ZERO;
  let reciclagem = ZERO;
  let pronas = ZERO;
  let pronon = ZERO;
  (e.doacoesEfetuadas ?? []).forEach((d, i) => {
    const v = naoNegativo(
      centavos(
        lerCentavos(d.valor, `doacoesEfetuadas[${i}].valor`) -
          lerCentavos(d.parcelaNaoDedutivel, `doacoesEfetuadas[${i}].parcelaNaoDedutivel`),
      ),
    );
    if (CODIGOS_DOACAO_2026.grupoBase.has(d.codigo)) grupoBase = somaCentavos(grupoBase, v);
    else if (d.codigo === CODIGOS_DOACAO_2026.desporto) desporto = somaCentavos(desporto, v);
    else if (d.codigo === CODIGOS_DOACAO_2026.reciclagem) reciclagem = somaCentavos(reciclagem, v);
    else if (d.codigo === CODIGOS_DOACAO_2026.pronas) pronas = somaCentavos(pronas, v);
    else if (d.codigo === CODIGOS_DOACAO_2026.pronon) pronon = somaCentavos(pronon, v);
  });

  const semDoacao =
    eca === 0n && idoso === 0n && grupoBase === 0n && desporto === 0n && reciclagem === 0n;
  if (semDoacao && pronas === 0n && pronon === 0n) {
    return {
      valor: ZERO,
      memoria: [
        linha(
          "incentivo.total",
          "Dedução de incentivo: nenhuma doação informada",
          0n,
          "Sem doações.",
        ),
      ],
    };
  }

  const limEca = pct(P.incentivoDiretoEcaPercentual);
  const limIdoso = pct(P.incentivoDiretoIdosoPercentual);
  const ecaDireta = minimo(eca, limEca);
  const idosoDireta = minimo(idoso, limIdoso);
  const lim6 = pct(P.incentivoGlobalPercentual);
  const lim7 = pct(P.incentivoGlobalComDesportoPercentual);
  // a) I a IV (ECA, Idoso, Cultura, Audiovisual, inclusive as diretas) até 6%.
  const g1 = minimo(somaCentavos(grupoBase, ecaDireta, idosoDireta), lim6);
  // b) I a IV mais Reciclagem até 6%.
  const g2 = minimo(somaCentavos(g1, reciclagem), lim6);
  // c) I a IV mais Desporto até 7%.
  const desportoAceito = minimo(desporto, naoNegativo(centavos(lim7 - g1)));
  const limPronas = pct(P.incentivoPronasPercentual);
  const limPronon = pct(P.incentivoPrononPercentual);
  const pronasAceito = minimo(pronas, limPronas);
  const prononAceito = minimo(pronon, limPronon);
  const valor = minimo(somaCentavos(g2, desportoAceito, pronasAceito, prononAceito), imposto);

  const memoria = [
    linha(
      "incentivo.diretaEca",
      `Doação direta ao Fundo da Criança e do Adolescente: informado ${brl(eca)}, limite 3% de ${brl(imposto)} = ${brl(limEca)}; aceito ${brl(ecaDireta)}`,
      ecaDireta,
      "Lei 8.069/1990, art. 260-A: até 3% do imposto devido, só no modelo completo e com entrega no prazo.",
    ),
    linha(
      "incentivo.diretaIdoso",
      `Doação direta ao Fundo da Pessoa Idosa: informado ${brl(idoso)}, limite 3% = ${brl(limIdoso)}; aceito ${brl(idosoDireta)}`,
      idosoDireta,
      "Lei 12.213/2010, art. 2º-A: até 3% do imposto devido, só no modelo completo e com entrega no prazo.",
    ),
    linha(
      "incentivo.global6",
      `ECA, Idoso, Cultura e Audiovisual (inclusive diretas) e Reciclagem, limite global 6% = ${brl(lim6)}: ${brl(g2)}`,
      g2,
      "Perguntas e Respostas IRPF 2026, pergunta 455, Limites Globais de Dedução (6%).",
    ),
    linha(
      "incentivo.desporto",
      `Incentivo ao desporto: informado ${brl(desporto)}, cabe até o limite global de 7% = ${brl(lim7)}; aceito ${brl(desportoAceito)}`,
      desportoAceito,
      "Lei 11.438/2006 e Perguntas e Respostas IRPF 2026, pergunta 455 (7% com o desporto).",
    ),
    linha(
      "incentivo.pronasPronon",
      `Pronas/PCD e Pronon, até 1% cada (${brl(limPronas)}): ${brl(somaCentavos(pronasAceito, prononAceito))}`,
      somaCentavos(pronasAceito, prononAceito),
      "Lei 12.715/2012, art. 4º: limite próprio de 1% cada, fora dos limites globais.",
    ),
    linha(
      "incentivo.total",
      `Dedução de incentivo: ${brl(valor)}`,
      valor,
      "Soma das parcelas aceitas, sem ultrapassar o imposto.",
    ),
  ];
  return { valor, memoria };
}

function apurarImpostoPago(
  t: Totais,
  limiteExterior: Centavos,
): { pago: ImpostoPagoCalculo; memoria: LinhaMemoria[] } {
  const exterior = minimo(t.exteriorPago, naoNegativo(limiteExterior));
  const total = somaCentavos(t.irrf, t.carneLeao, t.complementar, exterior, t.irrfLei11033);
  const pago: ImpostoPagoCalculo = {
    irrf: t.irrf,
    carneLeao: t.carneLeao,
    complementar: t.complementar,
    exterior,
    exteriorInformado: t.exteriorPago,
    irrfLei11033: t.irrfLei11033,
    total,
  };
  const memoria = [
    linha(
      "pago.irrf",
      `Imposto retido na fonte (fichas PJ, sem o IRRF do 13º): ${brl(t.irrf)}`,
      t.irrf,
      "Antecipação compensável no ajuste; o IRRF do 13º é definitivo.",
    ),
    linha(
      "pago.carneLeao",
      `Carnê-leão pago (Darf 0190): ${brl(t.carneLeao)}`,
      t.carneLeao,
      "Antecipação compensável no ajuste.",
    ),
    linha(
      "pago.complementar",
      `Imposto complementar (Darf 0246): ${brl(t.complementar)}`,
      t.complementar,
      "Recolhimento facultativo compensável no ajuste.",
    ),
    linha(
      "pago.exterior",
      `Imposto pago no exterior: informado ${brl(t.exteriorPago)}, limite ${brl(naoNegativo(limiteExterior))} (imposto com os rendimentos do exterior menos o imposto sem eles); compensado ${brl(exterior)}`,
      exterior,
      "Lei 9.250/1995, art. 5º, e Ajuda do programa (ficha Imposto Pago/Retido, linha 02).",
    ),
    linha(
      "pago.irrfLei11033",
      `IRRF da Lei 11.033/2004: ${brl(t.irrfLei11033)}`,
      t.irrfLei11033,
      "Lei 11.033/2004, art. 2º, § 1º e § 2º.",
    ),
    linha(
      "pago.total",
      `Total de imposto pago: ${brl(total)}`,
      total,
      "Soma das linhas de imposto pago.",
    ),
  ];
  return { pago, memoria };
}

/**
 * Alíquota efetiva em centésimos de ponto percentual, TRUNCADA em 2 casas.
 * Confirmado pelo caso de referência pj-simples-01: 274.503 / 6.000.000 =
 * 4,57505% e o programa oficial mostra 4,57.
 */
function aliquotaEfetiva(imposto: Centavos, rendimentos: Centavos): bigint {
  if (rendimentos <= 0n) return 0n;
  return (imposto * 10000n) / rendimentos;
}

function fecharSaldo(
  devido: Centavos,
  pago: Centavos,
): { saldoPagar: Centavos; restituir: Centavos; memoria: LinhaMemoria[] } {
  const saldoPagar = naoNegativo(centavos(devido - pago));
  const restituir = naoNegativo(centavos(pago - devido));
  return {
    saldoPagar,
    restituir,
    memoria: [
      linha(
        "saldo.pagar",
        `Saldo de imposto a pagar: ${brl(devido)} - ${brl(pago)}, se positivo = ${brl(saldoPagar)}`,
        saldoPagar,
        "Lei 9.250/1995, art. 13.",
      ),
      linha(
        "saldo.restituir",
        `Imposto a restituir: ${brl(pago)} - ${brl(devido)}, se positivo = ${brl(restituir)}`,
        restituir,
        "Lei 9.250/1995, art. 13.",
      ),
    ],
  };
}

/** Modelo completo (deduções legais). */
export function calcularCompleto(e: EntradaCalculo2026): ResultadoCompleto {
  const t = lerTotais(e);
  const a = apurarCompleto(e, t, true);
  const inc = deducaoIncentivo(e, a.impostoTabela);
  const impostoDevido = naoNegativo(centavos(a.impostoTabela - inc.valor));
  const devidoLinha = linha(
    "imposto.devido",
    `Imposto devido: ${brl(a.impostoTabela)} - incentivos ${brl(inc.valor)} = ${brl(impostoDevido)}`,
    impostoDevido,
    "Resumo, Cálculo do Imposto: imposto devido menos dedução de incentivo.",
  );
  const semExterior = t.exterior > 0n ? apurarCompleto(e, t, false).impostoTabela : a.impostoTabela;
  const pg = apurarImpostoPago(t, centavos(a.impostoTabela - semExterior));
  const s = fecharSaldo(impostoDevido, pg.pago.total);
  const aliq = aliquotaEfetiva(impostoDevido, a.rendimentos);
  return {
    modelo: "completo",
    rendimentosTributaveis: a.rendimentos,
    deducoes: a.deducoes,
    totalDeducoes: a.total,
    baseCalculo: a.base,
    impostoTabela: a.impostoTabela,
    deducaoIncentivo: inc.valor,
    impostoDevido,
    impostoPago: pg.pago,
    saldoPagar: s.saldoPagar,
    restituir: s.restituir,
    aliquotaEfetiva: aliq,
    memoria: [
      ...a.memoria,
      ...inc.memoria,
      devidoLinha,
      ...pg.memoria,
      ...s.memoria,
      linha(
        "aliquotaEfetiva",
        `Alíquota efetiva: ${brl(impostoDevido)} / ${brl(a.rendimentos)} = ${formatarCentesimosPercentual(aliq)} (valor em centésimos de ponto percentual)`,
        aliq,
        "Resumo: imposto devido dividido pelos rendimentos tributáveis, truncado em 2 casas.",
      ),
    ],
  };
}

/** Modelo simplificado (desconto de 20% limitado ao teto). */
export function calcularSimplificado(e: EntradaCalculo2026): ResultadoSimplificado {
  const t = lerTotais(e);
  const a = apurarSimplificado(t, true);
  const semExterior =
    t.exterior > 0n ? apurarSimplificado(t, false).impostoTabela : a.impostoTabela;
  const pg = apurarImpostoPago(t, centavos(a.impostoTabela - semExterior));
  const s = fecharSaldo(a.impostoTabela, pg.pago.total);
  const aliq = aliquotaEfetiva(a.impostoTabela, a.rendimentos);
  return {
    modelo: "simplificado",
    rendimentosTributaveis: a.rendimentos,
    desconto: a.desconto,
    baseCalculo: a.base,
    impostoTabela: a.impostoTabela,
    deducaoIncentivo: ZERO,
    impostoDevido: a.impostoTabela,
    impostoPago: pg.pago,
    saldoPagar: s.saldoPagar,
    restituir: s.restituir,
    aliquotaEfetiva: aliq,
    memoria: [
      ...a.memoria,
      linha(
        "imposto.devido",
        `Imposto devido: ${brl(a.impostoTabela)}`,
        a.impostoTabela,
        "No simplificado o imposto devido é o da tabela.",
      ),
      ...pg.memoria,
      ...s.memoria,
      linha(
        "aliquotaEfetiva",
        `Alíquota efetiva: ${formatarCentesimosPercentual(aliq)} (valor em centésimos de ponto percentual)`,
        aliq,
        "Resumo: imposto devido dividido pelos rendimentos tributáveis, truncado em 2 casas.",
      ),
    ],
  };
}

/**
 * Compara os dois modelos pelo resultado final (restituição menos saldo a
 * pagar). Em empate, indica o completo, que é a opção marcada por padrão no
 * programa (ver docs/regras/irpf-2026.md).
 */
export function compararModelos(e: EntradaCalculo2026): ComparacaoModelos {
  const completo = calcularCompleto(e);
  const simplificado = calcularSimplificado(e);
  const liquidoC = completo.restituir - completo.saldoPagar;
  const liquidoS = simplificado.restituir - simplificado.saldoPagar;
  const modeloMaisVantajoso = liquidoS > liquidoC ? "simplificado" : "completo";
  const diferenca = centavos(liquidoS > liquidoC ? liquidoS - liquidoC : liquidoC - liquidoS);
  return {
    completo,
    simplificado,
    modeloMaisVantajoso,
    memoria: [
      linha(
        "comparacao.completo",
        `Modelo completo: imposto devido ${brl(completo.impostoDevido)}, ${completo.restituir > 0n ? `restituir ${brl(completo.restituir)}` : `pagar ${brl(completo.saldoPagar)}`}`,
        completo.impostoDevido,
        "Deduções legais.",
      ),
      linha(
        "comparacao.simplificado",
        `Modelo simplificado: imposto devido ${brl(simplificado.impostoDevido)}, ${simplificado.restituir > 0n ? `restituir ${brl(simplificado.restituir)}` : `pagar ${brl(simplificado.saldoPagar)}`}`,
        simplificado.impostoDevido,
        "Desconto simplificado.",
      ),
      linha(
        "comparacao.escolha",
        diferenca === 0n
          ? "Os dois modelos dão o mesmo resultado; fica indicado o completo, opção padrão do programa."
          : `Mais vantajoso: ${modeloMaisVantajoso}, com diferença de ${brl(diferenca)}`,
        diferenca,
        "Opção pela tributação: o contribuinte escolhe; o motor indica a de menor imposto.",
      ),
    ],
  };
}

function avisos(e: EntradaCalculo2026, rendimentos: Centavos): string[] {
  const lista: string[] = [];
  if (rendimentos > P.obrigatoriedadeRendimentosTributaveis) {
    lista.push(
      `Rendimentos tributáveis acima de ${brl(P.obrigatoriedadeRendimentosTributaveis)}: declaração obrigatória (IN RFB 2.312/2026).`,
    );
  }
  const nasc = e.titular.nascimento;
  if (nasc) {
    const idade = idadeEm(lerData(nasc), { ano: 2025, mes: 12, dia: 31 });
    const isento65 = (e.rendimentosIsentos ?? [])
      .filter((r) => r.codigo === "10")
      .reduce((s, r, i) => s + lerCentavos(r.valor, `rendimentosIsentos[${i}].valor`), 0n);
    const teto = P.parcelaIsenta65Anual + P.parcelaIsenta65Mensal;
    if (isento65 > 0n && idade < 65) {
      lista.push(
        "Parcela isenta de 65 anos (isento código 10) informada para titular com menos de 65 anos em 2025.",
      );
    } else if (isento65 > teto) {
      lista.push(
        `Parcela isenta de 65 anos acima de ${brl(centavos(teto))} (R$ 1.903,98 por mês mais o 13º): o excedente é tributável.`,
      );
    }
  }
  return lista;
}

/** Cálculo consolidado no formato dos casos de referência, com memória. */
export function calcular2026(e: EntradaCalculo2026): ResultadoCalculo2026 {
  const cmp = compararModelos(e);
  const { completo: c, simplificado: s } = cmp;
  const escolhido = cmp.modeloMaisVantajoso === "completo" ? c : s;
  return {
    rendimentosTributaveis: c.rendimentosTributaveis.toString(),
    deducoesCompleto: c.totalDeducoes.toString(),
    baseCalculoCompleto: c.baseCalculo.toString(),
    impostoDevidoCompleto: c.impostoDevido.toString(),
    descontoSimplificado: s.desconto.toString(),
    baseCalculoSimplificado: s.baseCalculo.toString(),
    impostoDevidoSimplificado: s.impostoDevido.toString(),
    // Total de imposto pago do modelo completo, como no programa oficial (exterior-limite-01).
    impostoRetidoTotal: c.impostoPago.total.toString(),
    saldoPagarCompleto: c.saldoPagar.toString(),
    restituirCompleto: c.restituir.toString(),
    saldoPagarSimplificado: s.saldoPagar.toString(),
    restituirSimplificado: s.restituir.toString(),
    modeloMaisVantajoso: cmp.modeloMaisVantajoso,
    aliquotaEfetiva: escolhido.aliquotaEfetiva.toString(),
    detalhamento: { completo: c.memoria, simplificado: s.memoria, comparacao: cmp.memoria },
    avisos: avisos(e, c.rendimentosTributaveis),
  };
}
