/**
 * Recalcula os totais do Resumo a partir do modelo, usando o motor de cálculo do core.
 *
 * `entradaCalculoDoModelo` traduz a declaração para a entrada do motor (formato dos casos de
 * referência). `calcularTotais` devolve os campos dos registros 17 a 20 e do header que o
 * AutoIR sabe refazer; os demais ficam como no arquivo base (ver `CAMPOS_NAO_RECALCULADOS`).
 */
import { motor2026, PARAMETROS_2026 } from "../calc/2026/index.js";
import type {
  ComparacaoModelos,
  EntradaCalculo2026,
  MesRendimentoPFEntrada,
} from "../calc/2026/tipos.js";
import type { Declaracao } from "../model/declaracao.js";
import type { Valores } from "./campos.js";

const txt = (v: bigint | number) => v.toString();

function ddmmaaaa(iso: string | undefined): string | undefined {
  const m = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
  return m ? `${m[3]}${m[2]}${m[1]}` : undefined;
}

/** Entrada do motor de cálculo a partir do modelo da declaração. */
export function entradaCalculoDoModelo(dec: Declaracao): EntradaCalculo2026 {
  const id = dec.identificacao;
  const nascimento = ddmmaaaa(id.dataNascimento);
  const meses: MesRendimentoPFEntrada[] = [];
  for (const p of dec.rendimentosPFExterior) {
    for (let m = 0; m < 12; m++) {
      const v = (l: readonly bigint[]) => l[m] ?? 0n;
      meses.push({
        mes: m + 1,
        pessoaFisica: txt(v(p.trabalhoNaoAssalariado) + v(p.alugueis) + v(p.outros)),
        exterior: txt(v(p.exterior)),
        previdenciaOficial: txt(v(p.previdenciaOficial)),
        dependentes: txt(p.quantidadeDependentes[m] ?? 0),
        pensao: txt(v(p.pensaoAlimenticia)),
        livroCaixa: txt(v(p.livroCaixa)),
        carneLeao: txt(v(p.carneLeaoPago)),
      });
    }
  }
  const isentos = new Map<string, bigint>();
  for (const i of dec.rendimentosIsentos) {
    const v =
      "valorInformado" in i
        ? i.valorInformado + i.valorTransportado
        : i.valor + ("decimoTerceiro" in i ? i.decimoTerceiro : 0n);
    isentos.set(i.codigo, (isentos.get(i.codigo) ?? 0n) + v);
  }
  const exclusivos = new Map<string, bigint>();
  for (const e of dec.rendimentosExclusivos) {
    exclusivos.set(e.codigo, (exclusivos.get(e.codigo) ?? 0n) + e.valor);
  }
  const soma = (l: readonly { valor: bigint }[]) => l.reduce((s, x) => s + x.valor, 0n);
  return {
    titular: { cpf: id.cpf, nome: id.nome, ...(nascimento ? { nascimento } : {}) },
    dependentes: dec.dependentes.map((d) => ({
      cpf: d.cpf,
      nome: d.nome,
      codigo: d.codigo,
      ...(ddmmaaaa(d.dataNascimento) ? { nascimento: ddmmaaaa(d.dataNascimento) as string } : {}),
    })),
    rendimentosPJ: dec.rendimentosPJ.map((r) => ({
      cnpj: r.fonte.ni,
      nome: r.fonte.nome,
      rendimento: txt(r.rendimentos),
      previdenciaOficial: txt(r.contribuicaoPrevidenciaria),
      irrf: txt(r.impostoRetido),
      decimoTerceiro: txt(r.decimoTerceiro),
      irrfDecimoTerceiro: txt(r.impostoRetidoDecimoTerceiro),
      beneficiario: r.beneficiario.tipo === "dependente" ? "D" : "T",
      ...(r.beneficiario.tipo === "dependente" ? { cpfDependente: r.beneficiario.cpf } : {}),
    })),
    rendimentosPF: { meses },
    pagamentos: dec.pagamentos.map((p) => ({
      codigo: p.codigo,
      ...(p.niBeneficiario ? { cpfCnpj: p.niBeneficiario } : {}),
      valor: txt(p.valorPago),
      parcelaNaoDedutivel: txt(p.parcelaNaoDedutivel),
      beneficiario:
        p.realizadoCom.tipo === "dependente"
          ? "D"
          : p.realizadoCom.tipo === "alimentando"
            ? "A"
            : "T",
      ...(p.realizadoCom.tipo !== "titular" ? { cpfDependente: p.realizadoCom.cpf } : {}),
    })),
    rendimentosIsentos: [...isentos].map(([codigo, v]) => ({ codigo, valor: txt(v) })),
    tributacaoExclusiva: [...exclusivos].map(([codigo, v]) => ({ codigo, valor: txt(v) })),
    impostoPago: {
      complementar: txt(dec.impostoPago.impostoComplementar),
      exterior: txt(dec.impostoPago.impostoPagoExterior),
      irrfLei11033: txt(dec.impostoPago.impostoRetidoLei11033),
    },
    doacoesDiretas: {
      eca: txt(soma(dec.doacoesDiretamenteNaDeclaracao.eca)),
      idoso: txt(soma(dec.doacoesDiretamenteNaDeclaracao.idoso)),
    },
    doacoesEfetuadas: dec.doacoesEfetuadas.map((d) => ({
      codigo: d.codigo,
      valor: txt(d.valor),
      parcelaNaoDedutivel: txt(d.parcelaNaoDedutivel),
    })),
  };
}

export interface TotaisCalculados {
  readonly r17: Valores;
  readonly r18: Valores;
  readonly r19: Valores;
  readonly r20: Valores;
  readonly header: Valores;
  /**
   * Indicadores do header que o programa calcula por critérios que o AutoIR conhece só em
   * parte (obrigatoriedade pelo critério de rendimentos tributáveis, imposto antecipado): usados
   * apenas em arquivo novo, sem base.
   */
  readonly headerArquivoNovo: Valores;
  /** Saldo a pagar do modelo escolhido no Resumo. */
  readonly saldoAPagar: bigint;
  readonly comparacao: ComparacaoModelos;
}

type Pessoa = "T" | "D";

/** Somas das fichas separadas entre titular e dependentes. */
function somas(dec: Declaracao) {
  const z = () => ({ T: 0n, D: 0n });
  const t = {
    pj: z(),
    irrf: z(),
    prevPJ: z(),
    decimo: z(),
    pf: z(),
    ext: z(),
    prevPF: z(),
    carne: z(),
    livro: z(),
    isentos: z(),
    lucros: z(),
    exclusivos: z(),
    exclusivos13: z(),
    susp: z(),
    deposito: z(),
    rra: z(),
    rraPrev: z(),
    rraPensao: z(),
    rraIrrf: z(),
  };
  const quem = (b: { tipo: string } | undefined): Pessoa => (b?.tipo === "dependente" ? "D" : "T");
  for (const r of dec.rendimentosPJ) {
    const p = quem(r.beneficiario);
    t.pj[p] += r.rendimentos;
    t.irrf[p] += r.impostoRetido;
    t.prevPJ[p] += r.contribuicaoPrevidenciaria;
    t.decimo[p] += r.decimoTerceiro;
  }
  for (const r of dec.rendimentosPFExterior) {
    const p = quem(r.beneficiario);
    const s = (l: readonly bigint[]) => l.reduce((a, b) => a + b, 0n);
    t.pf[p] += s(r.trabalhoNaoAssalariado) + s(r.alugueis) + s(r.outros);
    t.ext[p] += s(r.exterior);
    t.prevPF[p] += s(r.previdenciaOficial);
    t.carne[p] += s(r.carneLeaoPago);
    t.livro[p] += s(r.livroCaixa);
  }
  for (const i of dec.rendimentosIsentos) {
    const p = quem("beneficiario" in i ? i.beneficiario : undefined);
    const v =
      "valorInformado" in i
        ? i.valorInformado + i.valorTransportado
        : i.valor + ("decimoTerceiro" in i ? i.decimoTerceiro : 0n);
    t.isentos[p] += v;
    if (i.codigo === "09") t.lucros[p] += v;
  }
  for (const e of dec.rendimentosExclusivos) {
    const p = e.codigo === "08" ? "D" : quem("beneficiario" in e ? e.beneficiario : undefined);
    t.exclusivos[p] += e.valor;
    if (e.codigo === "01" || e.codigo === "08") t.exclusivos13[p] += e.valor;
  }
  for (const s of dec.rendimentosExigibilidadeSuspensa) {
    const p = quem(s.beneficiario);
    t.susp[p] += s.rendimentos;
    t.deposito[p] += s.depositosJudiciais;
  }
  for (const a of dec.rendimentosAcumulados) {
    const p = quem(a.beneficiario);
    t.rra[p] += a.rendimentos;
    t.rraPrev[p] += a.contribuicaoPrevidenciaria;
    t.rraPensao[p] += a.pensaoAlimenticia;
    t.rraIrrf[p] += a.impostoRetido;
  }
  return t;
}

/** Maiores valores por chave, em ordem decrescente (empate: ordem de inclusão). */
function maiores<K>(itens: readonly { chave: K; valor: bigint }[], n: number): K[] {
  const soma = new Map<K, bigint>();
  for (const i of itens) soma.set(i.chave, (soma.get(i.chave) ?? 0n) + i.valor);
  return [...soma]
    .filter(([, v]) => v > 0n)
    .sort((a, b) => (b[1] > a[1] ? 1 : b[1] < a[1] ? -1 : 0))
    .slice(0, n)
    .map(([k]) => k);
}

const ORDINAIS = ["MAIOR", "DOIS", "TRES", "QUATRO", "CINCO", "SEIS"] as const;
const ORDINAIS_PGTO = ["UM", "DOIS", "TRES", "QUATRO", "CINCO", "SEIS"] as const;

function ddmmaaaaOuVazio(iso: string | undefined): string {
  return ddmmaaaa(iso) ?? "";
}

/**
 * Campos que o AutoIR não sabe refazer e que ficam como no arquivo base (ou zerados em
 * arquivo novo): imposto e totais de RRA, ganhos de capital, renda variável, moeda
 * estrangeira, Lei 14.754, atividade rural no Resumo e indicadores internos do programa.
 */
export const CAMPOS_NAO_RECALCULADOS: Readonly<Record<string, readonly string[]>> = {
  "17": [],
  "18": [
    "VR_RENDTRIBARURAL",
    "VR_RESNAOTRIB_AR",
    "VR_IMPPAGARESPECIE",
    "VR_GANHOLIQUIDORVTRANSPORTE",
    "VR_RENDISENTOGCTRANSPORTE",
    "VR_SUBTOTALISENTOTRANSPORTE",
    "VR_SUBTOTALEXCLUSIVOTRANSPORTE",
    "VR_TOT_IMPOSTO_RRA_TIT",
    "VR_TOT_IMPOSTO_RRA_DEP",
    "VR_IMPOSTO_DIFERIDO_GCAP",
    "VR_IMPOSTO_DEVIDO_GCAP",
    "VR_IMPOSTO_GANHOLIQ_RVAR",
    "VR_IMPOSTO_DEVIDO_GCME",
    "VR_BASE_CALCULO_LEI_14754",
    "VR_IMPOSTO_DEVIDO_LEI_14754",
  ],
  "19": [],
  "20": [
    "VR_RESAR",
    "VR_CONTPATRONAL",
    "VR_IMPGC",
    "VR_IMPRV",
    "VR_IMPPAGOVCBENS",
    "VR_IMPPAGOVCESPECIE",
    "VR_TOT_IMPOSTO_RRA_TIT",
    "VR_TOT_IMPOSTO_RRA_DEP",
    "VR_IMPOSTO_DIFERIDO_GCAP",
    "VR_IMPOSTO_DEVIDO_GCAP",
    "VR_IMPOSTO_GANHOLIQ_RVAR",
    "VR_IMPOSTO_DEVIDO_GCME",
    "VR_BASE_CALCULO_LEI_14754",
    "VR_IMPOSTO_DEVIDO_LEI_14754",
  ],
  IR: [
    "IN_IMPOSTO_PAGO",
    "IN_IMPOSTO_ANTECIPADO",
    "IN_OBRIGAT_ENTREGA",
    "IN_CRIT_OBRIGAT",
    "IN_CERTIFICAVEL",
    "IN_GERADA",
    "IN_SEGURANCA",
    "IN_OPCAO_TRIBUTACAO_BENEFICIARIO_UM_RRA",
    "CPF_BENEFICIARIO_UM_RRA",
    "IN_ISENCAO_GCAP_TITULAR",
  ],
};

/** Totais dos registros 17 a 20 e do header refeitos a partir do modelo. */
export function calcularTotais(dec: Declaracao): TotaisCalculados {
  const entrada = entradaCalculoDoModelo(dec);
  const comparacao = motor2026.compararModelos(entrada);
  const completa = dec.resumo.opcaoTributacao === "deducoesLegais";
  const c = comparacao.completo;
  const s = comparacao.simplificado;
  const escolhido = completa ? c : s;
  const t = somas(dec);
  const soma = (x: { T: bigint; D: bigint }) => x.T + x.D;

  // Imposto devido sem os rendimentos do exterior: base do limite do imposto pago lá fora.
  const semExterior = {
    ...entrada,
    rendimentosPF: {
      meses: (entrada.rendimentosPF?.meses ?? []).map((m) => ({ ...m, exterior: "0" })),
    },
  };
  const devidoSemExterior = completa
    ? motor2026.calcularCompleto(semExterior).impostoDevido
    : motor2026.calcularSimplificado(semExterior).impostoDevido;
  const temExterior = soma(t.ext) > 0n || dec.impostoPago.impostoPagoExterior > 0n;
  const limiteExterior = temExterior
    ? minimoBig(
        dec.impostoPago.impostoPagoExterior,
        maximoBig(0n, escolhido.impostoDevido - devidoSemExterior),
      )
    : 0n;

  const pagar = escolhido.saldoPagar;
  const quotas = pagar > 0n ? Math.min(dec.resumo.quotas, 8) : 0;
  let valorQuota = 0n;
  if (pagar > 0n) {
    const q = motor2026.calcularQuotas(pagar, quotas);
    valorQuota = q.quotas[0]?.principal ?? pagar;
  }
  const bens = {
    anterior: dec.bens.reduce((a, b) => a + b.situacaoAnterior, 0n),
    atual: dec.bens.reduce((a, b) => a + b.situacaoAtual, 0n),
  };
  const dividas = {
    anterior: dec.dividas.reduce((a, b) => a + b.situacaoAnterior, 0n),
    atual: dec.dividas.reduce((a, b) => a + b.situacaoAtual, 0n),
  };
  const campanha = dec.doacoesPartidos.reduce((a, d) => a + d.valor, 0n);
  const dedutivel = (codigos: readonly string[]) =>
    dec.pagamentos
      .filter((p) => codigos.includes(p.codigo))
      .reduce((a, p) => a + maximoBig(0n, p.valorPago - p.parcelaNaoDedutivel), 0n);

  const r17: Valores = {
    VR_LUCROSTIT: t.lucros.T,
    VR_ISENTOS: t.isentos.T,
    VR_EXCLUSIVOS: t.exclusivos.T - t.exclusivos13.T,
    VR_TOTAL13: t.exclusivos13.T,
    VR_TOTAL13DEPEND: t.exclusivos13.D,
    VR_LUCROSDEPEND: t.lucros.D,
    VR_ISENTOSDEPEND: t.isentos.D,
    VR_EXCLUSIVOSDEPEND: t.exclusivos.D - t.exclusivos13.D,
    VR_RENDPFTIT: t.pf.T,
    VR_RENDPFDEPEN: t.pf.D,
    VR_RENDEXTTIT: t.ext.T,
    VR_RENDEXTDEPEN: t.ext.D,
    VR_CARNELEAOTIT: t.carne.T,
    VR_CARNELEAODEPEND: t.carne.D,
    VR_DEPEN: c.deducoes.dependentes,
    VR_TOT_PREVOFC_AC_TIT: t.rraPrev.T,
    VR_TOT_PREVOFC_AC_DEP: t.rraPrev.D,
    VR_TOT_PENSALI_AC_TIT: t.rraPensao.T,
    VR_TOT_PENSALI_AC_DEP: t.rraPensao.D,
    VR_IMPDEVIDO_SEM_REND_EXT: temExterior ? devidoSemExterior : 0n,
    VR_LIMITE_IMP_PAGO_EXT: limiteExterior,
  };
  const comuns18e20 = {
    VR_TOTIRFONTELEI11033: dec.impostoPago.impostoRetidoLei11033,
    VR_DOACOESCAMPANHA: campanha,
    VR_TOTREND_AC_TIT: t.rra.T,
    VR_TOT_IRF_AC_TIT: t.rraIrrf.T,
    VR_TOTREND_AC_DEP: t.rra.D,
    VR_TOT_IRF_AC_DEP: t.rraIrrf.D,
    VR_TOTDEPJUDIC_TITULAR: t.deposito.T,
    VR_TOTDEPJUDIC_DEPENDEN: t.deposito.D,
    VR_TOTRENDPJ_EXIB_SUSPTITULAR: t.susp.T,
    VR_IRFONTELEI11033: dec.impostoPago.impostoRetidoLei11033,
    VR_IMPEXT: escolhido.impostoPago.exterior,
    VR_ALIQUOTA_EFETIVA: escolhido.aliquotaEfetiva,
  };
  const r18: Valores = {
    ...comuns18e20,
    VR_RENDTRIB: s.rendimentosTributaveis,
    VR_DESCSIMP: s.desconto,
    VR_BASECALC: s.baseCalculo,
    VR_IMPDEVIDO: s.impostoDevido,
    VR_IMPOSTO: soma(t.irrf),
    VR_IMPCOMP: dec.impostoPago.impostoComplementar,
    VR_LEAO: soma(t.carne),
    VR_IMPRESTIT: s.restituir,
    VR_IMPPAGAR: s.saldoPagar,
    NR_QUOTAS: BigInt(quotas),
    VR_QUOTA: valorQuota,
    VR_TOTISENTO: soma(t.isentos),
    VR_TOTEXCLUSIVO: soma(t.exclusivos),
    VR_RENDTRIBDEPENDENTE: t.pj.D,
    VR_IMPOSTODEPENDENTE: t.irrf.D,
    VR_TOTRENDTRIBPJTITULAR: t.pj.T,
    VR_TOTFONTETITULAR: t.irrf.T,
    VR_TOTBENSANOBASEANTERIOR: bens.anterior,
    VR_TOTBENSANOBASE: bens.atual,
    VR_RENDISENTOTITULAR: t.isentos.T,
    VR_RENDISENTODEPENDENTES: t.isentos.D,
    VR_TOTRENDEXCLUSTITULAR: t.exclusivos.T,
    VR_RENDEXCLUSDEPENDENTES: t.exclusivos.D,
    VR_TOTDIVIDAANOBASEANTERIOR: dividas.anterior,
    VR_TOTDIVIDAANOBASE: dividas.atual,
    VR_RENDPFEXT: t.pf.T + t.ext.T,
    VR_RENDPFEXTDEPEN: t.pf.D + t.ext.D,
    VR_TOTRENDPJ_EXIB_SUSPDEPEN: t.susp.D,
    VR_TOT_IMPOSTO_DEVIDO: s.impostoDevido,
  };
  const instrucaoPor = (tipo: "dependente" | "alimentando") =>
    new Set(
      dec.pagamentos
        .filter((p) => ["01", "02"].includes(p.codigo) && p.realizadoCom.tipo === tipo)
        .map((p) => (p.realizadoCom.tipo === tipo ? p.realizadoCom.cpf : "")),
    ).size;
  const fontePrincipal = maiores(
    dec.rendimentosPJ
      .filter((r) => r.beneficiario.tipo === "titular")
      .map((r) => ({ chave: r.fonte.ni, valor: r.rendimentos })),
    1,
  )[0];
  const r19: Valores = {
    NR_FONTE: fontePrincipal ?? "",
    VR_RECEX_TIT: t.ext.T,
    VR_LIVCAIX_TIT: t.livro.T,
    VR_CARNELEAO_TIT: t.carne.T,
    VR_RECEX_DEP: t.ext.D,
    VR_LIVCAIX_DEP: t.livro.D,
    VR_CARNELEAO_DEP: t.carne.D,
    VR_PREVPRIV: dedutivel(["36"]),
    VR_FAPI: 0n,
    VR_PREVOFTITULAR: t.prevPJ.T + t.prevPF.T,
    VR_PREVOFDEPENDENTE: t.prevPJ.D + t.prevPF.D,
    VR_TOTAL13SALARIOTITULAR: t.decimo.T,
    VR_TOTAL13SALARIODEPENDENTE: t.decimo.D,
    NR_DEPENDENTE_DESP_INSTRUCAO: BigInt(instrucaoPor("dependente")),
    NR_ALIMENTANDO_DESP_INSTRUCAO: BigInt(instrucaoPor("alimentando")),
    VR_RENDPFTIT: t.pf.T,
    VR_RENDPFDEPEN: t.pf.D,
    VR_RENDEXTTIT: t.ext.T,
    VR_RENDEXTDEPEN: t.ext.D,
    VR_IMPDEVIDO_SEM_REND_EXT: temExterior ? devidoSemExterior : 0n,
    VR_LIMITE_IMP_PAGO_EXT: limiteExterior,
  };
  const d = c.deducoes;
  const r20: Valores = {
    ...comuns18e20,
    VR_RENDJUR: t.pj.T,
    VR_RENDFISICEXT_TIT: t.pf.T + t.ext.T,
    VR_RENDFISICEXT_DEP: t.pf.D + t.ext.D,
    VR_TOTTRIB: c.rendimentosTributaveis,
    VR_PREVOF: d.previdenciaOficial,
    VR_TOTPRIVADA: d.previdenciaComplementar,
    VR_DEPEN: d.dependentes,
    VR_DESPINST: d.instrucao,
    VR_DESPMEDIC: d.medicas,
    VR_PENSAO: d.pensaoAlimenticia - minimoBig(d.pensaoAlimenticia, dedutivel(["33", "34"])),
    VR_PENSAO_CARTORIO: minimoBig(d.pensaoAlimenticia, dedutivel(["33", "34"])),
    VR_LIVCAIX: d.livroCaixa,
    VR_DEDUC: c.totalDeducoes,
    VR_BASECALC: c.baseCalculo,
    VR_IMPOSTO: c.impostoTabela,
    VR_DEDIMPOSTO: c.deducaoIncentivo,
    VR_IMPDEV: c.impostoDevido,
    VR_IMPDEV2: c.impostoDevido,
    VR_IMPDEV3: c.impostoDevido,
    VR_IMPFONTE: soma(t.irrf),
    VR_CARNELEAO: soma(t.carne),
    VR_IMPCOMPL: dec.impostoPago.impostoComplementar,
    VR_TOTIMPPAGO: c.impostoPago.total,
    VR_IMPREST: c.restituir,
    VR_IMPPAGAR: c.saldoPagar,
    NR_QUOTAS: BigInt(quotas),
    VR_QUOTA: valorQuota,
    VR_BENSANT: bens.anterior,
    VR_BENSATUAL: bens.atual,
    VR_DIVIDAANT: dividas.anterior,
    VR_DIVIDAATUAL: dividas.atual,
    VR_TOTISENTOS: soma(t.isentos),
    VR_TOTEXCLUS: soma(t.exclusivos),
    VR_RENDJURDEPENDENTE: t.pj.D,
    VR_IMPFONTEDEPENDENTE: t.irrf.D,
    VR_TOTRENDISENTOSTITULAR: t.isentos.T,
    VR_TOTRENDISENTOSDEPENDENTE: t.isentos.D,
    VR_TOTRENDEXCLTITULAR: t.exclusivos.T,
    VR_TOTRENDEXCLDEPENDENTE: t.exclusivos.D,
    VR_TOTRENDPJ_EXIB_SUSPDEPENDEN: t.susp.D,
    VR_TOT_PREVOFC_AC_TIT: t.rraPrev.T,
    VR_TOT_PENSALI_AC_TIT: t.rraPensao.T,
    VR_TOT_PREVOFC_AC_DEP: t.rraPrev.D,
    VR_TOT_PENSALI_AC_DEP: t.rraPensao.D,
  };

  // Header: totais e listas das maiores fontes e beneficiários (usadas na malha da Receita).
  const header: Valores = {
    VR_IMPDEVIDO: escolhido.impostoDevido,
    VR_SOMA_IMPOSTO_PAGAR: pagar,
    IN_RESULTADO_IMPOSTO: pagar > 0n ? "1" : escolhido.restituir > 0n ? "2" : "0",
    VR_TOTAL_RENDTRIB_PFPJ_TITDEP: soma(t.pj) + soma(t.pf) + soma(t.ext),
    VR_TOTISENTOS: soma(t.isentos),
    VR_TOTEXCLUSIVO: soma(t.exclusivos),
    VR_TOTAL_PAGAMENTOS: dec.pagamentos.reduce((a, p) => a + p.valorPago, 0n),
  };
  // Doações diretas: o programa mantém o valor no header mesmo quando a declaração simplificada
  // não grava os registros 91 e 92; sem doação no modelo, o valor do arquivo base fica.
  const eca = dec.doacoesDiretamenteNaDeclaracao.eca.reduce((a, x) => a + x.valor, 0n);
  const idoso = dec.doacoesDiretamenteNaDeclaracao.idoso.reduce((a, x) => a + x.valor, 0n);
  if (eca > 0n) header.VR_DOACAO_ECA = eca;
  if (idoso > 0n) header.VR_DOACAO_IDOSO = idoso;
  const fontes = maiores(
    dec.rendimentosPJ.map((r) => ({ chave: r.fonte.ni, valor: r.rendimentos })),
    4,
  );
  ORDINAIS.slice(0, 4).forEach((o, i) => {
    header[`NR_BASE_FONTE_${o}`] = fontes[i] ?? "";
  });
  // Todos os dependentes, do maior para o menor rendimento tributável de PJ (empate: ordem
  // da ficha), como o programa grava.
  const rendDep = (cpf: string) =>
    dec.rendimentosPJ
      .filter((r) => r.beneficiario.tipo === "dependente" && r.beneficiario.cpf === cpf)
      .reduce((a, r) => a + r.rendimentos, 0n);
  const depRend = dec.dependentes
    .map((d, i) => ({ cpf: d.cpf, v: rendDep(d.cpf), i }))
    .sort((a, b) => (b.v > a.v ? 1 : b.v < a.v ? -1 : a.i - b.i))
    .map((x) => x.cpf);
  ORDINAIS.forEach((o, i) => {
    const cpf = depRend[i];
    header[`NR_CPF_DEPE_REND_${o}`] = cpf ?? "";
    header[`DT_NASC_DEPE_REND_${o}`] = ddmmaaaaOuVazio(
      dec.dependentes.find((x) => x.cpf === cpf)?.dataNascimento,
    );
  });
  const medicas = maiores(
    dec.pagamentos
      .filter(
        (p) =>
          p.niBeneficiario &&
          [
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
            "16",
            "17",
            "18",
            "19",
            "20",
            "21",
            "22",
            "26",
          ].includes(p.codigo),
      )
      .map((p) => ({ chave: p.niBeneficiario ?? "", valor: p.valorPago - p.parcelaNaoDedutivel })),
    2,
  );
  header.NR_BASE_BENEF_DESP_MED_MAIOR = medicas[0] ?? "";
  header.NR_BASE_BENEF_DESP_MED_DOIS = medicas[1] ?? "";
  header.NR_CPF_DEST_PENSAO_ALIMENT_MAIOR =
    maiores(
      dec.pagamentos
        .filter((p) => ["30", "31", "33", "34"].includes(p.codigo) && p.niBeneficiario)
        .map((p) => ({ chave: p.niBeneficiario ?? "", valor: p.valorPago })),
      1,
    )[0] ?? "";
  const dedutiveis = maiores(
    dec.pagamentos
      .filter((p) => p.niBeneficiario)
      .map((p) => ({ chave: p.niBeneficiario ?? "", valor: p.valorPago - p.parcelaNaoDedutivel })),
    6,
  );
  ORDINAIS_PGTO.forEach((o, i) => {
    header[`NR_PAGAMENTO_DEDUTIVEL_MAIOR_${o}`] = dedutiveis[i] ?? "";
  });
  // Maior CNPJ por código de previdência complementar (36 e 37) e de doação (40 a 44).
  const fichas: { ficha: string; codigo: string; cnpj: string }[] = [];
  for (const codigo of ["36", "37"]) {
    const cnpj = maiores(
      dec.pagamentos
        .filter((p) => p.codigo === codigo && p.niBeneficiario?.length === 14)
        .map((p) => ({ chave: p.niBeneficiario ?? "", valor: p.valorPago })),
      1,
    )[0];
    if (cnpj) fichas.push({ ficha: "01", codigo, cnpj });
  }
  for (const codigo of ["40", "41", "42", "43", "44"]) {
    const cnpj = maiores(
      dec.doacoesEfetuadas
        .filter((d) => d.codigo === codigo && d.niBeneficiario.length === 14)
        .map((d) => ({ chave: d.niBeneficiario, valor: d.valor })),
      1,
    )[0];
    if (cnpj) fichas.push({ ficha: "02", codigo, cnpj });
  }
  for (let i = 0; i < 10; i++) {
    const f = fichas[i];
    header[`IN_FICHA_${i + 1}`] = f?.ficha ?? "";
    header[`IN_COD_FICHA_${i + 1}`] = f?.codigo ?? "";
    header[`CNPJ_MAIOR_VALOR_${i + 1}`] = f?.cnpj ?? "";
  }

  const pagoTotal = escolhido.impostoPago.total;
  const obrigado =
    escolhido.rendimentosTributaveis > PARAMETROS_2026.obrigatoriedadeRendimentosTributaveis;
  const novo: Valores = {
    IN_IMPOSTO_ANTECIPADO: pagoTotal > 0n ? 1n : 0n,
    IN_OBRIGAT_ENTREGA: obrigado ? "1" : "0",
    IN_CRIT_OBRIGAT: obrigado ? 1n : 0n,
  };

  return {
    r17,
    r18,
    r19,
    r20,
    header,
    headerArquivoNovo: novo,
    saldoAPagar: pagar,
    comparacao,
  };
}

function minimoBig(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}
function maximoBig(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
}
