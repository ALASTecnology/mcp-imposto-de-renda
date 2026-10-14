/**
 * Demonstrativo de Ganhos de Capital (GCAP) importado para a declaração (registros 60 a 78).
 *
 * O modelo guarda o que o demonstrativo leva à declaração: a identificação de cada alienação,
 * adquirentes, reformas, a apuração já feita e os totais transportados. O detalhamento interno
 * do GCAP (parcelas, faixas, moeda estrangeira por parcela) não tem lugar no modelo e é
 * preservado do arquivo base:
 *
 * | Registro | Conteúdo | Situação |
 * | --- | --- | --- |
 * | 60 | demonstrativo por beneficiário e totais transportados | mapeado |
 * | 61, 62, 63 | alienação de imóvel, móvel e participação societária | mapeado |
 * | 65 | adquirentes | mapeado |
 * | 66 | ampliação ou reforma (data e valor; percentuais preservados) | mapeado |
 * | 68, 69 | apuração de imóvel e de móvel | mapeado (valores digitados e ganho) |
 * | 74 | operações com moeda estrangeira em espécie | mapeado |
 * | 64, 67, 70 | alienação no exterior, reforma no exterior e apuração em ambas as moedas | preservado |
 * | 71, 72 | parcelas de alienação a prazo | preservado |
 * | 73 | apuração do custo médio de participações | preservado |
 * | 75, 76, 77, 78 | faixas de tributação e totais por moeda | preservado |
 *
 * Ligações: cada demonstrativo recebe `NR_IDENTIFICACAO` sequencial; os filhos repetem o CPF
 * do beneficiário, a identificação e `NR_OPERACAO` (a chave `operacao` do modelo). A soma das
 * reduções fica entre o ganho bruto (resultado 1) e o ganho final (resultado 5 do imóvel ou
 * ganho do cálculo do imposto). Sem caso de referência do programa: os códigos dos indicadores
 * (1 = sim, 0 = não) e a numeração da identificação são inferências documentadas.
 */

import type { Registro } from "../../dbk/codec.js";
import type { AlienacaoGcap, DemonstrativoGcap } from "../../model/ganhos-capital.js";
import { buscarCodigo } from "../../tabelas/index.js";
import {
  codigo,
  codigoOpcional,
  ddmmaaaaDeIso,
  isoDeDdmmaaaa,
  numero,
  type Objeto,
  semIndefinidos,
  texto,
  type Valores,
} from "../campos.js";
import type { ContextoGravacao, ContextoLeitura, Mapeador } from "../contexto.js";

const TIPO_ALIENACAO = { imovel: 1n, movel: 2n, participacaoSocietaria: 3n } as const;
const REGISTRO_ALIENACAO = { imovel: "61", movel: "62", participacaoSocietaria: "63" } as const;
const OPERACAO_MOEDA = { saldoInicial: "1", compra: "2", venda: "3" } as const;
const NOME_OPERACAO_MOEDA = { saldoInicial: "Saldo inicial", compra: "Compra", venda: "Venda" };

const sn = (b: boolean | undefined) => (b ? "1" : "0");
/** CPF ou CNPJ de campo que pode ser numérico (zeros à esquerda recompostos). */
const doc = (r: Registro | undefined, chave: string, tamanho: number) => {
  const t = texto(r, chave);
  return t === "" || /^0+$/.test(t) ? "" : codigo(t, tamanho);
};

function lerAlienacao(ctx: ContextoLeitura, r: Registro, ident: bigint, cpf: string): Objeto {
  const tipo = r.tipo === "61" ? "imovel" : r.tipo === "62" ? "movel" : "participacaoSocietaria";
  const operacao = numero(r, "NR_OPERACAO");
  const filho = (t: string) =>
    ctx
      .doTipo(t)
      .filter(
        (x) =>
          doc(x, "NR_CPF_BENEFICIARIO", 11) === cpf &&
          numero(x, "NR_IDENTIFICACAO") === ident &&
          numero(x, "NR_OPERACAO") === operacao,
      );
  const adquirentes = filho("65")
    .filter((x) => numero(x, "IN_TIPO") === TIPO_ALIENACAO[tipo])
    .map((x) => ({ ni: texto(x, "NR_CPFCNPJ"), nome: texto(x, "NR_NOME") }));
  let ganhoBruto: bigint;
  let apuracao: Record<string, bigint>;
  const ganho = numero(r, "VR_GCAP_CI");
  if (tipo === "participacaoSocietaria") {
    ganhoBruto = numero(r, "VR_GCAP_AP");
    apuracao = {
      valorAlienacao: numero(r, "VR_VALOR_ALIENACAO_AP"),
      custoCorretagem: numero(r, "VR_CUSTO_CORRETAGEM_AP"),
      custoAquisicao: numero(r, "VR_CUSTO_AQUISICAO_AP"),
    };
  } else {
    const ap = filho(tipo === "imovel" ? "68" : "69")[0];
    ganhoBruto = numero(ap, "VR_RESULTADO_1_APURACAO");
    apuracao = {
      valorAlienacao: numero(ap, "VR_VALOR"),
      custoCorretagem: numero(ap, "VR_CORRETAGEM"),
      custoAquisicao: numero(ap, "VR_CUSTO_APURACAO"),
    };
  }
  const paraiso = codigoOpcional(r, "CD_PAIS_PARAISO_FISCAL", 3);
  const comum = {
    tipo,
    cpfBeneficiario: cpf,
    operacao: Number(operacao),
    exterior: r.tipo !== "63" && numero(r, "IN_BRASIL_EXTERIOR") === 1n,
    descricao: texto(
      r,
      tipo === "imovel"
        ? "NM_IMOVEL_DESCRICAO"
        : tipo === "movel"
          ? "NM_MOVEL_DESCRICAO"
          : "NM_SOCIEDADE",
    ),
    naturezaOperacao: codigo(texto(r, "CD_OPERACAO") || "0", 2),
    dataAlienacao: isoDeDdmmaaaa(texto(r, "DT_ALIENACAO")),
    dataAquisicao: r.tipo === "63" ? undefined : isoDeDdmmaaaa(texto(r, "DT_AQUISICAO")),
    valorOperacao: numero(r, "VR_OPERACAO"),
    aPrazo: texto(r, "IN_ALIENPRAZO") === "1",
    paisParaisoFiscal: paraiso,
    adquirentes,
    apuracao: {
      ...apuracao,
      ganhoCapital: ganho,
      reducoes: ganhoBruto > ganho ? ganhoBruto - ganho : 0n,
      impostoDevido: numero(r, "VR_IMPOSTO_DEVIDO_CI"),
      impostoPago: numero(r, "VR_IMPOSTO_PAGO_CI"),
      impostoDiferidoPosterior: numero(r, "VR_DIFERIDO_POSTERIOR_CB"),
      rendimentoIsento: numero(r, "VR_ISENTO_CB"),
      rendimentoExclusivo: numero(r, "VR_EXCLUSIVO_CB"),
    },
  };
  if (tipo === "imovel") {
    const residencial = texto(r, "IN_RESIDENCIAL");
    return semIndefinidos({
      ...comum,
      uf: texto(r, "END_UF") || undefined,
      municipio: codigoOpcional(r, "END_CD_MUNICIPIO", 4),
      residencial: residencial === "" ? undefined : residencial === "1",
      unicoImovel: texto(r, "IN_PROPR_OUTRO_IMOVEL") === "0",
      outraAlienacaoCincoAnos: texto(r, "IN_OUTRA_ALIENACAO") === "1",
      valorAplicadoOutroImovel: numero(r, "VR_UTILIZAZAOOUTROIMOVEL"),
      reformas: filho("66").map((x) => ({
        data: isoDeDdmmaaaa(texto(x, "DT_DATA")),
        valor: numero(x, "VR_VALOR_REAIS"),
      })),
      atualizadoLei14973: texto(r, "IN_BEM_ATUALIZADO_LEI_14973") === "1",
    });
  }
  if (tipo === "movel") {
    return semIndefinidos({
      ...comum,
      possuiRegistroPublico: texto(r, "IN_REGISTRO_PUBLICO") === "1",
      pequenoValor: texto(r, "IN_PEQUENO_VALOR") === "1",
    });
  }
  const cnpj = doc(r, "NR_CNPJ", 14);
  return semIndefinidos({
    ...comum,
    cnpjSociedade: cnpj || undefined,
    especie: texto(r, "CD_ESPECIE") || undefined,
    impostoRetidoFonte: numero(r, "VR_IRRF_CI"),
  });
}

function gravarAlienacao(ctx: ContextoGravacao, a: AlienacaoGcap, ident: bigint): void {
  const ap = a.apuracao;
  const chaves = {
    NR_CPF_BENEFICIARIO: a.cpfBeneficiario,
    NR_IDENTIFICACAO: ident,
    NR_OPERACAO: BigInt(a.operacao),
  };
  const identidade = ["NR_CPF_BENEFICIARIO", "NR_IDENTIFICACAO", "NR_OPERACAO"];
  const bruto = ap.ganhoCapital + ap.reducoes;
  const v: Valores = {
    ...chaves,
    CD_OPERACAO: a.naturezaOperacao,
    DT_ALIENACAO: ddmmaaaaDeIso(a.dataAlienacao),
    IN_ALIENPRAZO: sn(a.aPrazo),
    VR_OPERACAO: a.valorOperacao,
    VR_CORRETAGEM: ap.custoCorretagem,
    IND_TER_PARAISO_FISCAL: sn(a.paisParaisoFiscal !== undefined),
    CD_PAIS_PARAISO_FISCAL: a.paisParaisoFiscal ? BigInt(a.paisParaisoFiscal) : 0n,
    VR_GCAP_CI: ap.ganhoCapital,
    VR_IMPOSTO_DEVIDO_CI: ap.impostoDevido,
    VR_IMPOSTO_PAGO_CI: ap.impostoPago,
    VR_DIFERIDO_POSTERIOR_CB: ap.impostoDiferidoPosterior,
    VR_ISENTO_CB: ap.rendimentoIsento,
    VR_EXCLUSIVO_CB: ap.rendimentoExclusivo,
  };
  if (a.tipo === "participacaoSocietaria") {
    if (a.exterior)
      ctx.aviso("Participação societária no exterior não tem indicador no registro 63.");
    if (a.dataAquisicao)
      ctx.aviso("A data de aquisição da participação societária não tem campo no registro 63.");
    if (a.quantidadeAlienada !== undefined) {
      ctx.aviso(
        "A quantidade alienada fica na apuração do custo médio (registro 73), preservada do arquivo base.",
      );
    }
    Object.assign(v, {
      NM_SOCIEDADE: a.descricao,
      NR_CNPJ: a.cnpjSociedade ?? 0n,
      CD_ESPECIE: a.especie ?? "",
      VR_VALOR_ALIENACAO_AP: ap.valorAlienacao,
      VR_CUSTO_CORRETAGEM_AP: ap.custoCorretagem,
      VR_LIGUIDO_ALIENACAO_AP: ap.valorAlienacao - ap.custoCorretagem,
      VR_CUSTO_AQUISICAO_AP: ap.custoAquisicao,
      VR_GCAP_AP: bruto,
      VR_IRRF_CI: a.impostoRetidoFonte,
    });
  } else {
    Object.assign(v, {
      IN_BRASIL_EXTERIOR: a.exterior ? 1n : 0n,
      DT_AQUISICAO: ddmmaaaaDeIso(a.dataAquisicao),
      VR_AQUISICAO: ap.custoAquisicao,
    });
    if (a.tipo === "imovel") {
      Object.assign(v, {
        NM_IMOVEL_DESCRICAO: a.descricao,
        END_CD_MUNICIPIO: a.municipio ?? "",
        END_MUNICIPIO: a.municipio
          ? (buscarCodigo("municipios", a.municipio)?.descricao ?? "")
          : "",
        END_UF: a.uf ?? "",
        IN_REFORMA: sn(a.reformas.length > 0),
        IN_PROPR_OUTRO_IMOVEL: a.unicoImovel ? "0" : "1",
        IN_OUTRA_ALIENACAO: sn(a.outraAlienacaoCincoAnos),
        IN_RESIDENCIAL: a.residencial === undefined ? "" : sn(a.residencial),
        VR_UTILIZAZAOOUTROIMOVEL: a.valorAplicadoOutroImovel,
        IN_BEM_ATUALIZADO_LEI_14973: sn(a.atualizadoLei14973),
      });
    } else {
      Object.assign(v, {
        NM_MOVEL_DESCRICAO: a.descricao,
        IN_REGISTRO_PUBLICO: sn(a.possuiRegistroPublico),
        IN_PEQUENO_VALOR: sn(a.pequenoValor),
      });
    }
  }
  ctx.adicionar(REGISTRO_ALIENACAO[a.tipo], v, identidade);
  for (const ad of a.adquirentes) {
    ctx.adicionar(
      "65",
      { ...chaves, IN_TIPO: TIPO_ALIENACAO[a.tipo], NR_CPFCNPJ: ad.ni, NR_NOME: ad.nome },
      [...identidade, "NR_CPFCNPJ"],
    );
  }
  if (a.tipo === "imovel") {
    for (const rf of a.reformas) {
      ctx.adicionar(
        "66",
        { ...chaves, DT_DATA: ddmmaaaaDeIso(rf.data), VR_VALOR_REAIS: rf.valor },
        [...identidade, "DT_DATA"],
      );
    }
  }
  if (a.tipo !== "participacaoSocietaria") {
    ctx.adicionar(
      a.tipo === "imovel" ? "68" : "69",
      {
        ...chaves,
        VR_VALOR: ap.valorAlienacao,
        VR_CORRETAGEM: ap.custoCorretagem,
        VR_LIQUIDO_APURACAO: ap.valorAlienacao - ap.custoCorretagem,
        VR_CUSTO_APURACAO: ap.custoAquisicao,
        VR_RESULTADO_1_APURACAO: bruto,
        ...(a.tipo === "imovel" ? { VR_RESULTADO_5_APURACAO: ap.ganhoCapital } : {}),
      },
      identidade,
    );
  }
}

function lerDemonstrativo(ctx: ContextoLeitura, r: Registro): Objeto {
  const cpf = doc(r, "NR_CPF_BENEFICIARIO", 11);
  const ident = numero(r, "NR_IDENTIFICACAO");
  const doDemonstrativo = (t: string) =>
    ctx
      .doTipo(t)
      .filter(
        (x) => doc(x, "NR_CPF_BENEFICIARIO", 11) === cpf && numero(x, "NR_IDENTIFICACAO") === ident,
      );
  const alienacoes = [
    ...doDemonstrativo("61"),
    ...doDemonstrativo("62"),
    ...doDemonstrativo("63"),
  ].map((x) => lerAlienacao(ctx, x, ident, cpf));
  const moedaEspecie = doDemonstrativo("74").map((x) => {
    const op = texto(x, "TIPO_OPERACAO");
    const adq = texto(x, "NR_ADQUIR");
    return semIndefinidos({
      moeda: texto(x, "CD_MOEDA"),
      tipoOperacao: op === "1" ? "saldoInicial" : op === "2" ? "compra" : "venda",
      data: isoDeDdmmaaaa(texto(x, "DT_OPERACAO")),
      quantidade: Number(numero(x, "NR_QUANTIDADE")),
      valorReais: numero(x, "VR_OPERACAO"),
      adquirente: adq === "" ? undefined : { ni: adq, nome: texto(x, "NM_ADQUIR") },
    });
  });
  return semIndefinidos({
    cpfBeneficiario: cpf,
    dataInicio: isoDeDdmmaaaa(texto(r, "DT_INICIO")),
    dataFim: isoDeDdmmaaaa(texto(r, "DT_FIM")),
    pais: codigoOpcional(r, "CD_PAIS", 3),
    alienacoes,
    moedaEspecie,
    totais: {
      rendimentoExclusivo: numero(r, "GC_TRANSP_VR_EXCLUSIVO"),
      isentoPequenoValor: numero(r, "GC_TRANSP_VR_PEQUENO"),
      isentoUnicoImovel: numero(r, "GC_TRANSP_VR_UNICOIMOVEL"),
      isentoReducao: numero(r, "GC_TRANSP_VR_REDUCAO"),
      impostoPago: numero(r, "GC_TRANSP_VR_IMPOSTOPAGO"),
      impostoDevido: numero(r, "GC_TRANSP_VR_IMPOSTODEVIDO"),
      impostoDiferidoPosterior: numero(r, "GC_TRANSP_VR_IMPOSTODIFERIDOANOSPOSTERIORES"),
      ganhoMoedaEspecie: numero(r, "GC_GCAP_MOEDA"),
      impostoDevidoMoedaEspecie: numero(r, "GC_IMPOSTO_DEVIDO_MOEDA"),
      rendimentoExclusivoExterior: numero(r, "GC_TRANSP_VR_EXCLUSIVO_EXTERIOR"),
      impostoPagoExterior: numero(r, "GC_TRANSP_VR_IMPOSTOPAGO_EXTERIOR"),
      isentoExterior: numero(r, "GC_TRANSP_VR_ISENTO_EXTERIOR"),
    },
  });
}

function gravarDemonstrativo(ctx: ContextoGravacao, d: DemonstrativoGcap, ident: bigint): void {
  const t = d.totais;
  ctx.adicionar(
    "60",
    {
      NR_CPF_BENEFICIARIO: d.cpfBeneficiario,
      NR_IDENTIFICACAO: ident,
      DT_INICIO: ddmmaaaaDeIso(d.dataInicio),
      DT_FIM: ddmmaaaaDeIso(d.dataFim),
      CD_PAIS: d.pais ? BigInt(d.pais) : 0n,
      NM_PAIS: d.pais ? (buscarCodigo("paises", d.pais)?.descricao ?? "") : "",
      GC_TRANSP_VR_EXCLUSIVO: t.rendimentoExclusivo,
      GC_TRANSP_VR_PEQUENO: t.isentoPequenoValor,
      GC_TRANSP_VR_UNICOIMOVEL: t.isentoUnicoImovel,
      GC_TRANSP_VR_REDUCAO: t.isentoReducao,
      GC_TRANSP_VR_IMPOSTOPAGO: t.impostoPago,
      GC_TRANSP_VR_IMPOSTODEVIDO: t.impostoDevido,
      GC_TRANSP_VR_ISENTRIB: t.isentoPequenoValor + t.isentoUnicoImovel + t.isentoReducao,
      GC_TRANSP_VR_IMPOSTODIFERIDOANOSPOSTERIORES: t.impostoDiferidoPosterior,
      GC_GCAP_MOEDA: t.ganhoMoedaEspecie,
      GC_IMPOSTO_DEVIDO_MOEDA: t.impostoDevidoMoedaEspecie,
      GC_TRANSP_VR_EXCLUSIVO_EXTERIOR: t.rendimentoExclusivoExterior,
      GC_TRANSP_VR_IMPOSTOPAGO_EXTERIOR: t.impostoPagoExterior,
      GC_TRANSP_VR_ISENTO_EXTERIOR: t.isentoExterior,
    },
    ["NR_CPF_BENEFICIARIO", "NR_IDENTIFICACAO"],
  );
  for (const a of d.alienacoes) {
    if (a.cpfBeneficiario !== d.cpfBeneficiario) {
      ctx.aviso(
        "Alienação com CPF diferente do demonstrativo de ganhos de capital: gravada com o CPF do demonstrativo.",
      );
    }
    gravarAlienacao(ctx, { ...a, cpfBeneficiario: d.cpfBeneficiario }, ident);
  }
  d.moedaEspecie.forEach((m, i) => {
    ctx.adicionar(
      "74",
      {
        NR_CPF_BENEFICIARIO: d.cpfBeneficiario,
        NR_IDENTIFICACAO: ident,
        NR_ITEM: String(i + 1),
        CD_MOEDA: m.moeda,
        NM_MOEDA: buscarCodigo("moedas", m.moeda)?.descricao ?? "",
        TIPO_OPERACAO: OPERACAO_MOEDA[m.tipoOperacao],
        NM_OPERACAO: NOME_OPERACAO_MOEDA[m.tipoOperacao],
        NM_ADQUIR: m.adquirente?.nome ?? "",
        NR_ADQUIR: m.adquirente?.ni ?? "",
        DT_OPERACAO: ddmmaaaaDeIso(m.data),
        VR_OPERACAO: m.valorReais,
        NR_QUANTIDADE: BigInt(m.quantidade),
      },
      ["NR_CPF_BENEFICIARIO", "NR_IDENTIFICACAO", "NR_ITEM"],
    );
  });
}

export const mapeadorGanhosCapital: Mapeador = {
  nome: "ganhosCapital",
  tipos: ["60", "61", "62", "63", "65", "66", "68", "69", "74"],
  ler(ctx, saida) {
    saida.ganhosCapital = ctx.doTipo("60").map((r) => lerDemonstrativo(ctx, r));
  },
  gravar(ctx, dec) {
    dec.ganhosCapital.forEach((d, i) => {
      gravarDemonstrativo(ctx, d, BigInt(i + 1));
    });
  },
};
