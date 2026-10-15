/**
 * Demonstrativo da Atividade Rural, abas Brasil e Exterior (registros 50 a 57).
 *
 * | Registro | Conteúdo | Origem |
 * | --- | --- | --- |
 * | 50 | imóveis explorados, com NR_CHAVE_AR | modelo |
 * | 51 | receitas e despesas mensais (Brasil) | modelo |
 * | 52 | apuração do resultado, uma por aba | digitados do modelo e totais calculados |
 * | 53 | rebanho por espécie (quantidades com 2 casas) | modelo; estoque final calculado |
 * | 54 | bens da atividade rural | modelo |
 * | 55 | dívidas vinculadas à atividade rural | modelo |
 * | 56 | receitas e despesas anuais por país (exterior) | modelo; resultado calculado |
 * | 57 | participantes dos imóveis, ligados por NR_CHAVE_AR | modelo |
 *
 * Apuração (notas D-AR-APUR-*): receita e despesa totais somam os meses; resultado I = receita
 * menos despesa; limite de 20% = 20% da receita bruta (truncado); com a opção pelo resultado,
 * resultado tributável = resultado I menos a compensação de prejuízo (nunca negativo) e o saldo
 * de prejuízo = saldo anterior menos a compensação (ou mais o resultado negativo); com a opção
 * pelo limite de 20%, resultado tributável = limite e não há saldo a aproveitar. Resultado não
 * tributável = parte positiva do resultado I que não foi tributada nem compensada. No
 * exterior, receitas e despesas do registro 52 ficam zeradas, o resultado em US$ é a soma dos
 * países e o resultado em reais usa a cotação do dólar de 31/12/2025 (5,5018), salvo valor
 * informado. Sem caso de referência do programa: as fórmulas e o código da opção (1 = limite de
 * 20%) são inferências documentadas.
 */
import type { Declaracao } from "../../model/declaracao.js";
import { codigo, numero, type Objeto, opcional, texto } from "../campos.js";
import type { ContextoGravacao, ContextoLeitura, Mapeador } from "../contexto.js";

/** Cotação do dólar para o resultado do exterior (31/12/2025, notas D-AR-APUR-L05). */
export const COTACAO_DOLAR_RURAL_10000 = 55018n;

/** Forma de apuração no arquivo (observada no harness): 1 = limite de 20%, 2 = resultado. */
const OPCAO_NO_ARQUIVO = { limite20: 1n, resultado: 2n, naoInformada: 0n } as const;
const OPCAO_DO_ARQUIVO: Record<string, "limite20" | "resultado"> = {
  "1": "limite20",
  "2": "resultado",
};

const pos = (v: bigint) => (v > 0n ? v : 0n);
type Aba = NonNullable<Declaracao["atividadeRural"]>["brasil" | "exterior"];

function lerAba(ctx: ContextoLeitura, exterior: boolean): Objeto {
  const daAba = (tipo: string) =>
    ctx.doTipo(tipo).filter((r) => (texto(r, "IN_EXTERIOR") === "1") === exterior);
  const participantes = new Map<bigint, Objeto[]>();
  for (const r of daAba("57")) {
    const c = numero(r, "NR_CHAVE_AR");
    const ni = texto(r, "NR_CPF_CNPJ_PROPRIETARIO");
    participantes.set(c, [
      ...(participantes.get(c) ?? []),
      { ...(ni ? { ni } : {}), nome: texto(r, "NM_NOME_PROPRIETARIO"), estrangeiro: ni === "" },
    ]);
  }
  const imoveis = daAba("50").map((r) => ({
    atividade: codigo(texto(r, "CD_ATIV") || "0", 2),
    nome: texto(r, "NM_IMOVEL"),
    localizacao: texto(r, "NM_LOCAL"),
    ...(opcional(texto(r, "NR_INCRA")) ? { cib: texto(r, "NR_INCRA") } : {}),
    areaDecimosHa: Number(numero(r, "QT_AREA")),
    condicaoExploracao: texto(r, "CD_EXPLOR"),
    participacaoCentesimos: Number(numero(r, "PC_PARTIC")),
    participantes: participantes.get(numero(r, "NR_CHAVE_AR")) ?? [],
  }));
  const ap = daAba("52")[0];
  const limite = numero(ap, "VR_OPCAO");
  const apuracao = {
    prejuizoAnterior: numero(ap, "VR_PREJEXERCANT"),
    opcao: OPCAO_DO_ARQUIVO[texto(ap, "IN_OPC_APURRESTRIB")] ?? "naoInformada",
    compensacaoPrejuizo: numero(ap, "VR_COMP_PREJ_EXERC_ANT"),
    adiantamentosRecebidos: numero(ap, "VR_RECVENDAFUTURA"),
    adiantamentosAnterioresEntregues: numero(ap, "VR_ADIANT"),
    ...(exterior && limite > 0n ? { limite20Reais: limite } : {}),
  };
  const rebanho = daAba("53").map((r) => {
    const q = (k: string) => {
      const v = numero(r, k);
      if (v % 100n !== 0n) ctx.aviso("Rebanho com quantidade fracionária: arredondada para baixo.");
      return Number(v / 100n);
    };
    return {
      especie: texto(r, "CD_ESPEC"),
      estoqueInicial: q("QT_INIC"),
      aquisicoes: q("QT_COMPRA"),
      nascimentos: q("QT_NASCIM"),
      consumoPerdas: q("QT_PERDA"),
      vendas: q("QT_VENDA"),
    };
  });
  const dividas = daAba("55").map((r) => ({
    discriminacao: texto(r, "TX_DIVIDA"),
    situacaoAnterior: numero(r, "VR_DIVATE"),
    situacaoAtual: numero(r, "VR_DIVATU"),
    valorPago: numero(r, "VR_PAGAMENTOANUAL"),
  }));
  const receitasDespesas = exterior
    ? ctx.doTipo("56").map((r) => ({
        pais: codigo(numero(r, "CD_PAIS"), 3),
        receitaBrutaMoedaOriginal: numero(r, "RECBRUTA"),
        despesaMoedaOriginal: numero(r, "DESPCUSTEIO"),
        resultadoDolar: numero(r, "RESDOLAR"),
      }))
    : daAba("51").map((r) => ({
        mes: Number(numero(r, "NR_MES")),
        receitaBruta: numero(r, "VR_REC"),
        despesa: numero(r, "VR_DESP"),
      }));
  return { imoveis, apuracao, rebanho, dividas, receitasDespesas };
}

/**
 * Apuração do resultado de uma aba (Brasil ou Exterior), como o registro 52: receita e despesa
 * totais, resultado I, limite de 20%, resultado tributável, saldo de prejuízo, compensação e
 * resultado não tributável (transportado para o isento 15).
 */
export function apurarAbaRural(aba: Aba, exterior: boolean) {
  let receita = 0n;
  let despesa = 0n;
  let resultadoDolar = 0n;
  if (exterior) {
    for (const r of aba.receitasDespesas as NonNullable<
      Declaracao["atividadeRural"]
    >["exterior"]["receitasDespesas"]) {
      resultadoDolar += r.resultadoDolar;
    }
  } else {
    for (const m of aba.receitasDespesas as NonNullable<
      Declaracao["atividadeRural"]
    >["brasil"]["receitasDespesas"]) {
      receita += m.receitaBruta;
      despesa += m.despesa;
    }
  }
  const ap = aba.apuracao;
  const resultado = exterior
    ? (ap.resultadoTotalReaisInformado ?? (resultadoDolar * COTACAO_DOLAR_RURAL_10000) / 10000n)
    : receita - despesa;
  const limite = exterior ? (ap.limite20Reais ?? 0n) : (receita * 20n) / 100n;
  let tributavel: bigint;
  let saldo: bigint;
  let compensado = 0n;
  if (ap.opcao === "limite20") {
    tributavel = limite;
    saldo = 0n;
  } else if (ap.opcao === "naoInformada") {
    tributavel = 0n;
    saldo = resultado >= 0n ? ap.prejuizoAnterior : ap.prejuizoAnterior - resultado;
  } else {
    compensado =
      resultado > 0n
        ? ap.compensacaoPrejuizo < resultado
          ? ap.compensacaoPrejuizo
          : resultado
        : 0n;
    tributavel = pos(resultado - compensado);
    saldo =
      resultado >= 0n ? pos(ap.prejuizoAnterior - compensado) : ap.prejuizoAnterior - resultado;
  }
  return {
    receita,
    despesa,
    resultado,
    resultadoDolar,
    limite,
    tributavel,
    saldo,
    compensado,
    naoTributavel: pos(resultado - tributavel - compensado),
  };
}

function abaVazia(a: Aba): boolean {
  const ap = a.apuracao;
  return (
    a.imoveis.length === 0 &&
    a.receitasDespesas.length === 0 &&
    a.rebanho.length === 0 &&
    a.dividas.length === 0 &&
    ap.prejuizoAnterior === 0n &&
    ap.compensacaoPrejuizo === 0n &&
    ap.adiantamentosRecebidos === 0n &&
    ap.adiantamentosAnterioresEntregues === 0n &&
    ap.opcao !== "limite20"
  );
}

function gravarAba(ctx: ContextoGravacao, aba: Aba, exterior: boolean, chave: { n: number }) {
  if (abaVazia(aba)) return;
  const ind = exterior ? 1n : 0n;
  for (const im of aba.imoveis) {
    // A chave começa em 0, como o programa grava (caso atividade-rural-resultado-01).
    const c = BigInt(chave.n++);
    if (im.pais) {
      ctx.aviso(
        "O país do imóvel rural no exterior não tem campo próprio no registro 50; inclua-o na localização.",
      );
    }
    ctx.adicionar(
      "50",
      {
        IN_EXTERIOR: ind,
        NM_IMOVEL: im.nome,
        NM_LOCAL: im.localizacao,
        QT_AREA: BigInt(im.areaDecimosHa),
        PC_PARTIC: BigInt(im.participacaoCentesimos),
        CD_EXPLOR: im.condicaoExploracao,
        CD_ATIV: im.atividade,
        NR_INCRA: im.cib ?? "",
        NR_CHAVE_AR: c,
      },
      ["IN_EXTERIOR", "NR_CHAVE_AR"],
    );
    for (const p of im.participantes) {
      ctx.adicionar(
        "57",
        {
          NR_CPF_CNPJ_PROPRIETARIO: p.ni ?? "",
          NM_NOME_PROPRIETARIO: p.nome,
          IN_EXTERIOR: exterior ? "1" : "0",
          NR_CHAVE_AR: c,
        },
        ["NR_CHAVE_AR", "NR_CPF_CNPJ_PROPRIETARIO"],
      );
    }
  }

  if (exterior) {
    for (const r of aba.receitasDespesas as NonNullable<
      Declaracao["atividadeRural"]
    >["exterior"]["receitasDespesas"]) {
      ctx.adicionar(
        "56",
        {
          CD_PAIS: BigInt(r.pais),
          RECBRUTA: r.receitaBrutaMoedaOriginal,
          DESPCUSTEIO: r.despesaMoedaOriginal,
          RESORIGINAL: r.receitaBrutaMoedaOriginal - r.despesaMoedaOriginal,
          RESDOLAR: r.resultadoDolar,
        },
        ["CD_PAIS"],
      );
    }
  } else {
    const meses = [
      ...(aba.receitasDespesas as NonNullable<
        Declaracao["atividadeRural"]
      >["brasil"]["receitasDespesas"]),
    ].sort((a, b) => a.mes - b.mes);
    for (const m of meses) {
      ctx.adicionar(
        "51",
        { IN_EXTERIOR: 0n, NR_MES: BigInt(m.mes), VR_DESP: m.despesa, VR_REC: m.receitaBruta },
        ["NR_MES"],
      );
    }
  }

  const ap = aba.apuracao;
  if (ap.resultadoTotalReaisInformado !== undefined) {
    ctx.aviso(
      "O resultado total em reais informado (Final de Espólio ou Saída) é gravado como resultado; ao reler, ele volta como calculado.",
    );
  }
  const x = apurarAbaRural(aba, exterior);
  const valores52 = {
    VR_RECTOTAL: exterior ? 0n : x.receita,
    VR_DESPTOTAL: exterior ? 0n : x.despesa,
    VR_RES1REAL: x.resultado,
    VR_PREJEXERCANT: ap.prejuizoAnterior,
    VR_COMP_PREJ_EXERC_ANT: ap.compensacaoPrejuizo,
    VR_OPCAO: x.limite,
    VR_RESTRIB: x.tributavel,
    VR_PREJUIZO: x.saldo,
    VR_RECVENDAFUTURA: ap.adiantamentosRecebidos,
    VR_ADIANT: ap.adiantamentosAnterioresEntregues,
    VR_RESNAOTRIBAR: x.naoTributavel,
    VR_RES1DOLAR: exterior ? x.resultadoDolar : 0n,
  };
  // Na aba Exterior sem nenhum valor apurado (resultado em dólar ainda não informado), o
  // programa não grava a apuração (caso ar-livro-caixa-exterior-01).
  if (exterior && ap.opcao === "naoInformada" && Object.values(valores52).every((v) => v === 0n)) {
    return;
  }
  ctx.adicionar(
    "52",
    { IN_EXTERIOR: ind, ...valores52, IN_OPC_APURRESTRIB: OPCAO_NO_ARQUIVO[ap.opcao] },
    ["IN_EXTERIOR"],
  );

  for (const r of aba.rebanho) {
    const final = r.estoqueInicial + r.aquisicoes + r.nascimentos - r.consumoPerdas - r.vendas;
    if (final < 0)
      ctx.aviso(`Rebanho da espécie ${r.especie} com estoque final negativo; gravado como zero.`);
    ctx.adicionar(
      "53",
      {
        IN_EXTERIOR: ind,
        CD_ESPEC: BigInt(r.especie),
        QT_INIC: BigInt(r.estoqueInicial) * 100n,
        QT_COMPRA: BigInt(r.aquisicoes) * 100n,
        QT_NASCIM: BigInt(r.nascimentos) * 100n,
        QT_PERDA: BigInt(r.consumoPerdas) * 100n,
        QT_VENDA: BigInt(r.vendas) * 100n,
        QT_ESTFINAL: BigInt(Math.max(0, final)) * 100n,
      },
      ["IN_EXTERIOR", "CD_ESPEC"],
    );
  }
  for (const d of aba.dividas) {
    if (d.niCredor) {
      ctx.aviso(
        "O CPF/CNPJ do credor da dívida rural não tem campo no registro 55; mantenha-o na discriminação.",
      );
    }
    ctx.adicionar("55", {
      IN_EXTERIOR: ind,
      TX_DIVIDA: d.discriminacao,
      VR_DIVATE: d.situacaoAnterior,
      VR_DIVATU: d.situacaoAtual,
      VR_PAGAMENTOANUAL: d.valorPago,
    });
  }
}

export const mapeadorAtividadeRural: Mapeador = {
  nome: "atividadeRural",
  tipos: ["50", "51", "52", "53", "54", "55", "56", "57"],
  ler(ctx, saida) {
    if (!["50", "51", "52", "53", "54", "55", "56", "57"].some((t) => ctx.doTipo(t).length > 0)) {
      return;
    }
    saida.atividadeRural = {
      brasil: lerAba(ctx, false),
      exterior: lerAba(ctx, true),
      bens: ctx.doTipo("54").map((r) => ({
        codigo: codigo(numero(r, "CD_BEMAR"), 2),
        pais: codigo(numero(r, "CD_PAIS") || 105n, 3),
        discriminacao: texto(r, "TX_BEM"),
        situacaoAnterior: numero(r, "VR_BEM_ANTERIOR"),
        situacaoAtual: numero(r, "VR_BEM"),
      })),
    };
  },
  gravar(ctx, dec) {
    const ar = dec.atividadeRural;
    if (!ar) return;
    const chave = { n: 0 };
    gravarAba(ctx, ar.brasil, false, chave);
    gravarAba(ctx, ar.exterior, true, chave);
    for (const b of ar.bens) {
      ctx.adicionar("54", {
        IN_EXTERIOR: b.pais !== "105" ? 1n : 0n,
        CD_PAIS: BigInt(b.pais),
        CD_BEMAR: BigInt(b.codigo),
        TX_BEM: b.discriminacao,
        VR_BEM: b.situacaoAtual,
        VR_BEM_ANTERIOR: b.situacaoAnterior,
      });
    }
  },
};
