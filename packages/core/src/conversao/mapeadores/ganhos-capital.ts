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
 * | 68, 69 | apuração de imóvel e de móvel (no exterior, uma por origem dos rendimentos) | mapeado (valores digitados e ganho) |
 * | 74 | saldo inicial e operações com moeda estrangeira em espécie | mapeado |
 * | 64 | bem adquirido no exterior: origem dos rendimentos, cotações e valores em dólar | mapeado (`cambio`) |
 * | 67, 70 | reforma no exterior e apuração final em ambas as moedas | preservado |
 * | 71, 72 | parcelas de alienação a prazo | preservado |
 * | 73 | apuração do custo médio de participações (quantidade, custo médio e total) | mapeado |
 * | 75 | faixas de tributação de cada alienação | mapeado (derivado do ganho tributável) |
 * | 76 | totalização mensal de moedas alienadas (12 registros por demonstrativo) | mapeado (`moedaEspecieMensal`) |
 * | 77, 78 | totais por moeda | preservado |
 *
 * Ligações: `NR_IDENTIFICACAO` de cada demonstrativo é o dia e mês do início seguidos do dia e
 * mês do fim do período (`01013112` para o ano inteiro, gravado como 1013112); os filhos
 * repetem o CPF do beneficiário, a identificação e `NR_OPERACAO` (a chave `operacao` do
 * modelo). A soma das reduções fica entre o ganho bruto (resultado 1) e o ganho final
 * (resultado 5 do imóvel ou ganho do cálculo do imposto). Conferido com os casos `gcap-*`
 * gerados pelo GCAP 2025 (tools/referencia): indicadores 1 = sim e 0 = não, identificação pelo
 * período, faixas do registro 75 sobre o ganho tributável (rendimento exclusivo mais imposto
 * pago) e os 12 registros 76 zerados quando não há moeda estrangeira em espécie.
 */

import { apurarBemExterior } from "../../calc/ganho-capital-cambio.js";
import type { Registro } from "../../dbk/codec.js";
import type { AlienacaoGcap, CambioGcap, DemonstrativoGcap } from "../../model/ganhos-capital.js";
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
const NOME_OPERACAO_MOEDA = { saldoInicial: "SALDO INICIAL", compra: "COMPRA", venda: "VENDA" };
/** Origem dos rendimentos do bem no exterior (registro 64, IN_ORIGEM_REND). */
const ORIGEM_CAMBIO = { nacional: "1", estrangeira: "2", ambas: "3" } as const;
const NOME_ORIGEM_CAMBIO = {
  nacional: "RENDIMENTOS AUFERIDOS EM MOEDA NACIONAL",
  estrangeira: "RENDIMENTOS AUFERIDOS EM MOEDA ESTRANGEIRA",
  ambas: "RENDIMENTOS AUFERIDOS EM MOEDA NACIONAL E MOEDA ESTRANGEIRA",
} as const;
/** Mensagem do registro 64 quando a alienação no exterior não tem imposto devido. */
const MENSAGEM_SEM_IMPOSTO =
  "O IMPOSTO DEVIDO E IGUAL A ZERO TENDO EM VISTA QUE, PELOS DADOS DIGITADOS,NAO FOI APURADO GANHO DE CAPITAL TRIBUTAVEL NESTA OPERACAO.";
/** Alíquota média da moeda em espécie gravada pelo programa (15%, 6 casas no 60, 2 no 76). */
const ALIQUOTA_MOEDA_60 = 15_000_000n;
const ALIQUOTA_MOEDA_76 = 1_500n;

/** Descrição de tabela como o programa grava: maiúsculas e sem acentos. */
const maiusculas = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();

const sn = (b: boolean | undefined) => (b ? "1" : "0");
/** Data numérica zerada, como o programa grava nas datas que não se aplicam. */
const ZERADA = "00000000";
/** Limites das faixas de tributação do ganho de capital (Lei 8.981/1995, art. 21). */
const TETOS_FAIXAS = [500_000_000n, 1_000_000_000n, 3_000_000_000n] as const;
/** Descrição da espécie no registro 73; só a de quotas foi observada no programa. */
const DESCRICAO_ESPECIE: Readonly<Record<string, string>> = { "3": "QUOTA" };

/** Nome da natureza da operação gravado pelo programa (só a venda foi observada). */
const NOME_NATUREZA: Readonly<Record<string, string>> = { "01": "VENDA" };

/**
 * Alíquota média do cálculo do imposto, em milionésimos de ponto percentual (6 casas, meio
 * para cima): imposto das faixas do art. 21 da Lei 8.981/1995, sem truncar, dividido pelo
 * ganho, mesmo quando o ganho é isento (casos gcap-movel-pequeno-valor-01: 15,000000;
 * gcap-imovel-reducao-01: 15,000000; gcap-imovel-faixas-01: 15,217144).
 */
function aliquotaMedia(ganho: bigint): bigint {
  if (ganho <= 0n) return 0n;
  const aliquotas = [150n, 175n, 200n];
  let soma = 0n; // centavos x milésimos
  let anterior = 0n;
  TETOS_FAIXAS.forEach((teto, i) => {
    if (ganho > anterior) soma += ((ganho < teto ? ganho : teto) - anterior) * (aliquotas[i] ?? 0n);
    anterior = teto;
  });
  if (ganho > anterior) soma += (ganho - anterior) * 225n;
  return (soma * 200_000n + ganho) / (2n * ganho);
}

/** `NR_IDENTIFICACAO` do demonstrativo: DDMM do início e DDMM do fim (padrão: ano inteiro). */
function identificacao(d: DemonstrativoGcap): bigint {
  const ddmm = (iso: string | undefined, padrao: string) =>
    iso ? `${iso.slice(8, 10)}${iso.slice(5, 7)}` : padrao;
  return BigInt(ddmm(d.dataInicio, "0101") + ddmm(d.dataFim, "3112"));
}
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
  const r64 =
    tipo !== "participacaoSocietaria" && texto(r, "IN_BRASIL_EXTERIOR") === "0"
      ? filho("64").find((x) => numero(x, "IN_TIPO") === TIPO_ALIENACAO[tipo])
      : undefined;
  let cambio: Objeto | undefined;
  if (r64) {
    const origem = texto(r64, "IN_ORIGEM_REND");
    cambio = {
      origem: origem === "1" ? "nacional" : origem === "3" ? "ambas" : "estrangeira",
      moeda: texto(r64, "CD_MOEDA_ESTRANGEIRA") || "USA",
      cotacaoAquisicao: numero(r64, "VR_COTACAO_AQUISICAO"),
      cotacaoAlienacao: numero(r64, "VR_COTACAO_OP"),
      valorAlienacaoDolar: numero(r64, "VR_OPERACAO_DOLAR"),
      corretagemDolar: numero(r64, "VR_CORRETAGEM_DOLAR"),
      custoNacionalDolar: numero(r64, "VR_BEM_AQUISICAO_RMN"),
      custoEstrangeiraDolar: numero(r64, "VR_BEM_AQUISICAO_RME"),
    };
  }
  if (r64) {
    // Bem no exterior: valores em reais da alienação (registro 62) e custo da parte nacional;
    // o detalhe em dólar fica em `cambio`.
    ganhoBruto = ganho;
    apuracao = {
      valorAlienacao: numero(r, "VR_OPERACAO"),
      custoCorretagem: numero(r, "VR_CORRETAGEM"),
      custoAquisicao: numero(r, "VR_AQUISICAO"),
    };
  } else if (tipo === "participacaoSocietaria") {
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
  // CD_PAIS_PARAISO_FISCAL traz o país de residência (105 para o Brasil) mesmo fora de
  // paraíso fiscal; só vale como paraíso com o indicador ligado.
  const paraiso =
    texto(r, "IND_TER_PARAISO_FISCAL") === "1"
      ? codigoOpcional(r, "CD_PAIS_PARAISO_FISCAL", 3)
      : undefined;
  const comum = {
    tipo,
    cpfBeneficiario: cpf,
    operacao: Number(operacao),
    // 1 = bem no Brasil (casos gcap-*); 0 = exterior, por analogia com a pergunta "bem
    // adquirido no Brasil" do GCAP (sem caso de referência).
    exterior: r.tipo !== "63" && texto(r, "IN_BRASIL_EXTERIOR") === "0",
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
      cambio,
    });
  }
  if (tipo === "movel") {
    return semIndefinidos({
      ...comum,
      possuiRegistroPublico: texto(r, "IN_REGISTRO_PUBLICO") === "1",
      pequenoValor: texto(r, "IN_PEQUENO_VALOR") === "1",
      cambio,
    });
  }
  const cnpj = doc(r, "NR_CNPJ", 14);
  const custoMedio = filho("73");
  const especie73 = custoMedio[0] ? String(numero(custoMedio[0], "IN_ESPECIE")) : "";
  const quantidade = custoMedio.reduce((s, x) => s + numero(x, "VR_QUANTIDADE_ALIENADA"), 0n);
  return semIndefinidos({
    ...comum,
    cnpjSociedade: cnpj || undefined,
    especie: texto(r, "CD_ESPECIE") || (especie73 && especie73 !== "0" ? especie73 : undefined),
    uf: texto(r, "NM_UF") || undefined,
    municipio: codigoOpcional(r, "CD_MUNICIPIO", 4),
    pequenoValor: texto(r, "IN_PEQUENO_VALOR") === "1",
    quantidadeAlienada: quantidade > 0n ? Number(quantidade) : undefined,
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
  const exterior = a.tipo !== "participacaoSocietaria" && a.exterior && a.cambio !== undefined;
  const v: Valores = {
    ...chaves,
    CD_OPERACAO: a.naturezaOperacao,
    DT_ALIENACAO: ddmmaaaaDeIso(a.dataAlienacao),
    IN_ALIENPRAZO: sn(a.aPrazo),
    VR_OPERACAO: a.valorOperacao,
    VR_CORRETAGEM: ap.custoCorretagem,
    IND_TER_PARAISO_FISCAL: sn(a.paisParaisoFiscal !== undefined),
    CD_PAIS_PARAISO_FISCAL: a.paisParaisoFiscal ? BigInt(a.paisParaisoFiscal) : 105n,
    ...(NOME_NATUREZA[a.naturezaOperacao]
      ? { NM_OPERACAO: NOME_NATUREZA[a.naturezaOperacao] }
      : {}),
    IN_GCAP_ANTERIOR: "0",
    // Datas da decisão judicial, da lavratura, do trânsito em julgado, do Darf da transmissão
    // causa mortis e da última parcela: zeradas na venda à vista (casos gcap-*).
    DT_DECISAO_JUDICIAL: ZERADA,
    DT_LAVRATURA: ZERADA,
    DT_TRANSITO_JULGADO: ZERADA,
    DT_DATA_DARF_TCM: ZERADA,
    DT_DATA_ULTIMA_PARCELA: ZERADA,
    VR_GCAP_CI: ap.ganhoCapital,
    VR_ALIQUOTA_MEDIA_CI: aliquotaMedia(ap.ganhoCapital),
    VR_IMPOSTO_DEVIDO_CI: ap.impostoDevido,
    VR_IMPOSTO_PAGO_CI: ap.impostoPago,
    // Consolidação do exercício: imposto do ano, total e devido iguais ao do cálculo (à vista);
    // o bem no exterior não entra na consolidação do Brasil (casos gcap-exterior-*).
    VR_EXERCICIO_CB: exterior ? 0n : ap.impostoDevido,
    VR_TOTAL_CB: exterior ? 0n : ap.impostoDevido,
    VR_IR_DEVIDO_CB: exterior ? 0n : ap.impostoDevido,
    VR_IMPOSTO_PAGO_CB: ap.impostoPago,
    VR_DIFERIDO_POSTERIOR_CB: ap.impostoDiferidoPosterior,
    VR_ISENTO_CB: ap.rendimentoIsento,
    VR_EXCLUSIVO_CB: ap.rendimentoExclusivo,
  };
  if (a.tipo === "participacaoSocietaria") {
    if (a.exterior)
      ctx.aviso("Participação societária no exterior não tem indicador no registro 63.");
    if (a.dataAquisicao)
      ctx.aviso("A data de aquisição da participação societária não tem campo no registro 63.");
    Object.assign(v, {
      NM_SOCIEDADE: a.descricao,
      NR_CNPJ: a.cnpjSociedade ?? 0n,
      CD_MUNICIPIO: a.municipio ?? "",
      NM_MUNICIPIO: a.municipio ? (buscarCodigo("municipios", a.municipio)?.descricao ?? "") : "",
      NM_UF: a.uf ?? "",
      IN_PEQUENO_VALOR: a.pequenoValor ? "1" : "",
      // O programa deixa CD_ESPECIE vazio e grava a espécie no registro 73.
      CD_ESPECIE: "",
      VR_CUSTO_TOTAL_AQUISICAO: ap.custoAquisicao,
      VR_VALOR_ALIENACAO_AP: ap.valorAlienacao,
      VR_CUSTO_CORRETAGEM_AP: ap.custoCorretagem,
      VR_LIGUIDO_ALIENACAO_AP: ap.valorAlienacao - ap.custoCorretagem,
      VR_CUSTO_AQUISICAO_AP: ap.custoAquisicao,
      VR_GCAP_AP: bruto,
      VR_IRRF_CI: a.impostoRetidoFonte,
      VR_IMPOSTO_DEVIDO_APOS_COMPENSACAO_CI:
        ap.impostoDevido > a.impostoRetidoFonte ? ap.impostoDevido - a.impostoRetidoFonte : 0n,
    });
  } else {
    Object.assign(v, {
      IN_BRASIL_EXTERIOR: a.exterior ? 0n : 1n,
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
        // Perguntas da isenção do único imóvel: o programa só grava as respostas da isenção
        // (0 e 0); fora dela os indicadores ficam em branco.
        IN_PROPR_OUTRO_IMOVEL: a.unicoImovel ? "0" : "",
        IN_OUTRA_ALIENACAO: a.unicoImovel ? "0" : a.outraAlienacaoCincoAnos ? "1" : "",
        IN_RESIDENCIAL: a.residencial === undefined ? "" : sn(a.residencial),
        VR_UTILIZAZAOOUTROIMOVEL: a.valorAplicadoOutroImovel,
        IN_BEM_ATUALIZADO_LEI_14973: sn(a.atualizadoLei14973),
      });
    } else {
      Object.assign(v, {
        NM_MOVEL_DESCRICAO: a.descricao,
        IN_REGISTRO_PUBLICO: sn(a.possuiRegistroPublico),
        IN_PEQUENO_VALOR: a.pequenoValor ? "1" : "",
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
  const cambio = a.tipo !== "participacaoSocietaria" && a.exterior ? a.cambio : undefined;
  if (cambio && a.tipo !== "participacaoSocietaria") {
    gravarCambio(ctx, a.tipo, cambio, chaves, identidade, ap.impostoDevido);
  } else if (a.tipo !== "participacaoSocietaria") {
    ctx.adicionar(
      a.tipo === "imovel" ? "68" : "69",
      {
        ...chaves,
        NR_TIPO_APURACAO: 1n,
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
  if (
    a.tipo === "participacaoSocietaria" &&
    (a.quantidadeAlienada !== undefined || a.especie !== undefined)
  ) {
    const qtd = BigInt(a.quantidadeAlienada ?? 0);
    const especie = a.especie ?? "3";
    ctx.adicionar(
      "73",
      {
        ...chaves,
        NR_ITEM: "0001",
        IN_ESPECIE: BigInt(especie),
        ...(DESCRICAO_ESPECIE[especie] ? { NM_DESCRICAO_ESPECIE: DESCRICAO_ESPECIE[especie] } : {}),
        VR_QUANTIDADE_ALIENADA: qtd,
        // Custo médio com 6 casas: centavos x 10.000 / quantidade.
        VR_CUSTO_MEDIO: qtd > 0n ? (ap.custoAquisicao * 10_000n) / qtd : 0n,
        VR_CUSTO_TOTAL: ap.custoAquisicao,
      },
      [...identidade, "NR_ITEM"],
    );
  }
  // Faixas do cálculo do imposto: o programa as monta sobre o ganho tributável, que é o
  // rendimento exclusivo transportado mais o imposto pago (zero quando o ganho é isento).
  const tributavel = ap.rendimentoExclusivo + ap.impostoPago;
  const faixas: Valores = {};
  let anterior = 0n;
  TETOS_FAIXAS.forEach((teto, i) => {
    const v = tributavel > anterior ? (tributavel < teto ? tributavel : teto) - anterior : 0n;
    faixas[`VR_FAIXA${i + 1}_TOTAL`] = v;
    faixas[`VR_FAIXA${i + 1}_ATUAL`] = v;
    anterior = teto;
  });
  const acima = tributavel > anterior ? tributavel - anterior : 0n;
  ctx.adicionar(
    "75",
    {
      ...chaves,
      IN_TIPO: TIPO_ALIENACAO[a.tipo],
      IN_APURACAO: 1n,
      ...faixas,
      VR_FAIXA4_TOTAL: acima,
      VR_FAIXA4_ATUAL: acima,
      VR_FAIXAT_TOTAL: tributavel,
      VR_FAIXAT_ATUAL: tributavel,
    },
    [...identidade, "IN_TIPO"],
  );
}

/**
 * Bem adquirido no exterior: registro 64 (origem dos rendimentos, cotações e valores em dólar)
 * e uma apuração (68 ou 69) por origem: 2 nacional, 3 estrangeira, ou 4 e 5 quando o bem foi
 * comprado com as duas (casos gcap-exterior-*).
 */
function gravarCambio(
  ctx: ContextoGravacao,
  tipo: "imovel" | "movel",
  c: CambioGcap,
  chaves: Valores,
  identidade: string[],
  impostoDevido: bigint,
): void {
  const ap = apurarBemExterior(c);
  const ambas = c.origem === "ambas";
  const pctE = ap.percentualEstrangeira;
  // Percentual de cada origem com 2 casas (meio para cima), a partir das 9 do rateio.
  const duasCasas = (p: bigint) => (p + 5_000_000n) / 10_000_000n;
  const temNacional = c.origem !== "estrangeira";
  const temEstrangeira = c.origem !== "nacional";
  ctx.adicionar(
    "64",
    {
      ...chaves,
      IN_TIPO: TIPO_ALIENACAO[tipo],
      VR_COTACAO_OP: c.cotacaoAlienacao,
      VR_OPERACAO_DOLAR: c.valorAlienacaoDolar,
      VR_CORRETAGEM_DOLAR: c.corretagemDolar,
      ...(ambas
        ? {
            VR_VALOR_ALIENACAO_AP_AMBAS: c.valorAlienacaoDolar,
            VR_CUSTO_CORRETAGEM_AP_AMBAS: c.corretagemDolar,
            VR_LIQUIDO_ALIENACAO_AP_AMBAS: c.valorAlienacaoDolar - c.corretagemDolar,
            VR_GCAP_TOTAL_AP_AMBAS: ap.ganhoTotal,
          }
        : {}),
      IN_ORIGEM_REND: ORIGEM_CAMBIO[c.origem],
      NM_ORIGEM_REND_DESC: NOME_ORIGEM_CAMBIO[c.origem],
      VR_COTACAO_AQUISICAO: temNacional ? c.cotacaoAquisicao : 0n,
      VR_BEM_AQUISICAO_DOLAR: c.custoNacionalDolar + c.custoEstrangeiraDolar,
      VR_BEM_AQUISICAO_RMN: temNacional ? c.custoNacionalDolar : 0n,
      FT_BEM_AQUISICAO_RMN: temNacional ? duasCasas(100_000_000_000n - pctE) : 0n,
      VR_BEM_AQUISICAO_RME: temEstrangeira ? c.custoEstrangeiraDolar : 0n,
      FT_BEM_AQUISICAO_RME: temEstrangeira ? duasCasas(pctE) : 0n,
      VR_SALDO_IMPOSTO_DEVIDO: impostoDevido,
      NM_MENSAGEM: impostoDevido === 0n ? MENSAGEM_SEM_IMPOSTO : "",
      NM_MOEDA_ESTRANGEIRA: maiusculas(buscarCodigo("moedas", c.moeda)?.descricao ?? ""),
      CD_MOEDA_ESTRANGEIRA: c.moeda,
      IN_RESIDENTE_BRASIL_APLICACAO_EXTERIOR: "0",
    },
    [...identidade, "IN_TIPO"],
  );
  const apuracoes: Valores[] = [];
  const nacional = (tipoApuracao: bigint, valor: bigint, corretagem: bigint) => ({
    NR_TIPO_APURACAO: tipoApuracao,
    VR_VALOR: valor,
    VR_CORRETAGEM: corretagem,
    VR_LIQUIDO_APURACAO: ap.nacional.liquidoReais,
    VR_LIQUIDO_APURACAO_DOLAR: ap.nacional.liquidoDolar,
    VR_CUSTO_APURACAO: ap.nacional.custoReais,
    VR_RESULTADO_1_APURACAO: ap.nacional.ganhoReais > 0n ? ap.nacional.ganhoReais : 0n,
    VR_COTACAO_APURACAO: c.cotacaoAlienacao,
  });
  const estrangeira = (tipoApuracao: bigint, valor: bigint, corretagem: bigint) => ({
    NR_TIPO_APURACAO: tipoApuracao,
    VR_VALOR: valor,
    VR_CORRETAGEM: corretagem,
    VR_LIQUIDO_APURACAO_DOLAR: ap.estrangeira.liquidoDolar,
    VR_CUSTO_APURACAO: ap.estrangeira.custoDolar,
    VR_RESULTADO_1_APURACAO: ap.estrangeira.ganhoReais > 0n ? ap.estrangeira.ganhoReais : 0n,
    VR_RESULTADO_1_APURACAO_DOLAR: ap.estrangeira.ganhoDolar > 0n ? ap.estrangeira.ganhoDolar : 0n,
    VR_COTACAO_APURACAO: c.cotacaoAlienacao,
  });
  if (c.origem === "nacional") {
    apuracoes.push(nacional(2n, c.valorAlienacaoDolar, c.corretagemDolar));
  } else if (c.origem === "estrangeira") {
    apuracoes.push(estrangeira(3n, c.valorAlienacaoDolar, c.corretagemDolar));
  } else {
    apuracoes.push(nacional(4n, ap.nacional.valorDolar, ap.nacional.corretagemDolar));
    apuracoes.push(estrangeira(5n, ap.estrangeira.valorDolar, ap.estrangeira.corretagemDolar));
  }
  for (const x of apuracoes) {
    ctx.adicionar(tipo === "imovel" ? "68" : "69", { ...chaves, ...x }, [
      ...identidade,
      "NR_TIPO_APURACAO",
    ]);
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
      cotacaoDolar: numero(x, "VR_COTACAO_MOEDA_ESTRANGEIRA_DOLAR"),
      custoMedio: numero(x, "VR_CUSTO"),
      custoAlienacao: numero(x, "VR_CUSTOTOTAQUIS"),
      ganhoCapital: numero(x, "VR_GANHOCAPITAL"),
      saldoReais: numero(x, "VR_SALDO_REAIS"),
      estoque: Number(numero(x, "VR_SALDO_ME")),
    });
  });
  // A totalização mensal só tem conteúdo com moeda em espécie (registros com NR_MES 01 a 12).
  const meses76 = doDemonstrativo("76").filter((x) => numero(x, "NR_MES") > 0n);
  const moedaEspecieMensal = meses76.map((x) => ({
    alienacaoDolar: numero(x, "VR_ALIENACAO_DOLAR"),
    alienacaoConsolidadaDolar: numero(x, "VR_ALIENACAO_CONSOLIDADA_DOLAR"),
    ganhoCapital: numero(x, "VR_GANHO_CAPITAL"),
    ganhoTributavel: numero(x, "VR_GANHO_CAPITAL_TRIBUTAVEL"),
    impostoDevido: numero(x, "VR_IMPOSTO_DEVIDO"),
    impostoPago: numero(x, "VR_IMPOSTO_PAGO"),
  }));
  return semIndefinidos({
    cpfBeneficiario: cpf,
    dataInicio: isoDeDdmmaaaa(texto(r, "DT_INICIO")),
    dataFim: isoDeDdmmaaaa(texto(r, "DT_FIM")),
    pais: codigoOpcional(r, "CD_PAIS", 3),
    alienacoes,
    moedaEspecie,
    moedaEspecieMensal,
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
      NM_PAIS: d.pais ? (buscarCodigo("paises", d.pais)?.descricao ?? "").toUpperCase() : "",
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
      GC_MOEDA_ALIQUOTA_MEDIA: d.moedaEspecie.length > 0 ? ALIQUOTA_MOEDA_60 : 0n,
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
        NR_ITEM: String(i + 1).padStart(4, "0"),
        CD_MOEDA: m.moeda,
        NM_MOEDA: maiusculas(buscarCodigo("moedas", m.moeda)?.descricao ?? ""),
        TIPO_OPERACAO: OPERACAO_MOEDA[m.tipoOperacao],
        NM_OPERACAO: NOME_OPERACAO_MOEDA[m.tipoOperacao],
        NM_ADQUIR: m.adquirente?.nome ?? "",
        NR_ADQUIR: m.adquirente?.ni ?? "",
        DT_OPERACAO: ddmmaaaaDeIso(m.data),
        VR_OPERACAO: m.valorReais,
        NR_QUANTIDADE: BigInt(m.quantidade),
        VR_CUSTO: m.custoMedio,
        VR_CUSTOTOTAQUIS: m.custoAlienacao,
        VR_GANHOCAPITAL: m.ganhoCapital,
        VR_SALDO_REAIS: m.saldoReais,
        VR_SALDO_ME: BigInt(m.estoque),
        VR_COTACAO_MOEDA_ESTRANGEIRA_DOLAR: m.cotacaoDolar,
      },
      ["NR_CPF_BENEFICIARIO", "NR_IDENTIFICACAO", "NR_ITEM"],
    );
  });
  // Totalização mensal de moedas alienadas: o programa grava sempre 12 registros, zerados e
  // sem o número do mês quando não há moeda em espécie.
  for (let i = 0; i < 12; i++) {
    const m = d.moedaEspecieMensal[i];
    const chaves76 = { NR_CPF_BENEFICIARIO: d.cpfBeneficiario, NR_IDENTIFICACAO: ident };
    ctx.adicionar(
      "76",
      m
        ? {
            ...chaves76,
            NR_MES: BigInt(i + 1),
            VR_ALIENACAO_DOLAR: m.alienacaoDolar,
            VR_ALIENACAO_CONSOLIDADA_DOLAR: m.alienacaoConsolidadaDolar,
            VR_GANHO_CAPITAL: m.ganhoCapital,
            VR_GANHO_CAPITAL_TRIBUTAVEL: m.ganhoTributavel,
            VR_ALIQUOTA_MEDIA: ALIQUOTA_MOEDA_76,
            VR_IMPOSTO_DEVIDO: m.impostoDevido,
            VR_IMPOSTO_PAGO: m.impostoPago,
          }
        : chaves76,
      ["NR_CPF_BENEFICIARIO", "NR_IDENTIFICACAO"],
    );
  }
}

export const mapeadorGanhosCapital: Mapeador = {
  nome: "ganhosCapital",
  tipos: ["60", "61", "62", "63", "64", "65", "66", "68", "69", "73", "74", "75", "76"],
  ler(ctx, saida) {
    saida.ganhosCapital = ctx.doTipo("60").map((r) => lerDemonstrativo(ctx, r));
  },
  gravar(ctx, dec) {
    for (const d of dec.ganhosCapital) gravarDemonstrativo(ctx, d, identificacao(d));
  },
};
