/**
 * Importação dos dados da declaração do exercício anterior para a do exercício atual
 * ("Importar dados da Declaração de 2025", Ajuda págs. 373, 396 e 397; nota 08
 * M-IMP-ANO-ANTERIOR e nota 06 D-AR-IMPORT).
 *
 * Recupera o que o programa oficial recupera e nada mais: Identificação inteira; dependentes e
 * alimentandos; fontes pagadoras de PJ (CPF/CNPJ e nome, sem valores); beneficiários de
 * Pagamentos Efetuados (código, CPF/CNPJ e nome, sem valores); bens e dívidas com situação em
 * 31/12 do ano anterior diferente de zero, levada para a coluna do ano anterior; imóveis rurais
 * explorados; bens da atividade rural (código e discriminação); estoque final do rebanho como
 * estoque inicial; dívidas rurais; e o número do recibo de 2025, quando conhecido. O saldo de
 * prejuízo rural não é importado (a nota 06 registra a divergência do texto da Ajuda): é
 * informado à parte.
 */
import type { Declaracao, DeclaracaoEntrada } from "../model/declaracao.js";
import { FICHAS, zDeclaracao } from "../model/declaracao.js";
import type { Objeto } from "./campos.js";

export interface OpcoesMigracao {
  /** Recibo (12 dígitos) da declaração de 2025 entregue. */
  readonly recibo?: string | undefined;
}

export interface ResultadoMigracao {
  readonly declaracao: DeclaracaoEntrada;
  readonly importados: readonly string[];
  readonly naoImportados: readonly string[];
  /** Fichas cujos valores precisam ser preenchidos com os dados de 2025. */
  readonly aPreencher: readonly string[];
}

/** Erro quando o arquivo do ano anterior não forma uma declaração válida. */
export class DeclaracaoAnteriorInvalidaError extends Error {
  override readonly name = "DeclaracaoAnteriorInvalidaError";
}

function plural(n: number, um: string, varios: string): string {
  return `${n} ${n === 1 ? um : varios}`;
}

/**
 * Migra a declaração do exercício anterior (objeto lido com o leiaute dela por
 * `registrosParaModelo`) para a entrada do modelo do exercício atual.
 */
export function migrarDeclaracaoAnterior(
  anterior: Objeto,
  opcoes: OpcoesMigracao = {},
): ResultadoMigracao {
  const r = zDeclaracao.safeParse({ ...anterior, exercicio: 2026, anoCalendario: 2025 });
  if (!r.success) {
    const problemas = r.error.issues
      .slice(0, 10)
      .map((i) => `${i.path.join(".") || "(raiz)"}: ${i.message}`)
      .join("; ");
    throw new DeclaracaoAnteriorInvalidaError(
      `a declaração do exercício anterior não pôde ser interpretada (${problemas})`,
    );
  }
  const ant: Declaracao = r.data;
  const importados: string[] = [];
  const naoImportados: string[] = [];
  const aPreencher: string[] = [];

  const id = ant.identificacao;
  const identificacao = {
    ...id,
    tipoDeclaracao: {
      tipo: "ajusteAnual" as const,
      retificadora: false,
      ...(opcoes.recibo ? { reciboExercicioAnterior: opcoes.recibo } : {}),
    },
    alteracaoCadastral: false,
    retornoAoPais: { retornou: false },
    processoAtualizacaoBemLei14973: undefined,
    prejuizoAnteriorLei14754: undefined,
  };
  importados.push(
    `Identificação do Contribuinte (todos os dados${opcoes.recibo ? ", com o recibo de 2025" : ""})`,
  );
  if (id.tipoDeclaracao.tipo !== "ajusteAnual") {
    naoImportados.push(
      "O arquivo era de outro tipo de declaração; a nova é de Ajuste Anual original.",
    );
  }

  if (ant.dependentes.length > 0)
    importados.push(plural(ant.dependentes.length, "dependente", "dependentes"));
  if (ant.alimentandos.length > 0)
    importados.push(plural(ant.alimentandos.length, "alimentando", "alimentandos"));

  // Fontes pagadoras de PJ, uma por beneficiário e CPF/CNPJ, sem valores.
  const vistasPJ = new Set<string>();
  const rendimentosPJ = ant.rendimentosPJ.flatMap((p) => {
    const chave = `${p.beneficiario.tipo}:${"cpf" in p.beneficiario ? p.beneficiario.cpf : ""}:${p.fonte.ni}`;
    if (vistasPJ.has(chave)) return [];
    vistasPJ.add(chave);
    return [
      {
        beneficiario: p.beneficiario,
        fonte: p.fonte,
        rendimentos: 0n,
        contribuicaoPrevidenciaria: 0n,
        impostoRetido: 0n,
        decimoTerceiro: 0n,
        impostoRetidoDecimoTerceiro: 0n,
      },
    ];
  });
  if (rendimentosPJ.length > 0) {
    importados.push(plural(rendimentosPJ.length, "fonte pagadora de PJ", "fontes pagadoras de PJ"));
    aPreencher.push(`${FICHAS.rendimentosPJ}: valores de 2025 de cada fonte`);
  }

  // Beneficiários de Pagamentos Efetuados, sem valores.
  const vistosPag = new Set<string>();
  const pagamentos = ant.pagamentos.flatMap((p) => {
    const chave = `${p.codigo}:${p.niBeneficiario ?? p.nomeBeneficiario}:${JSON.stringify(p.realizadoCom)}`;
    if (vistosPag.has(chave)) return [];
    vistosPag.add(chave);
    return [
      {
        codigo: p.codigo,
        realizadoCom: p.realizadoCom,
        ...(p.niBeneficiario ? { niBeneficiario: p.niBeneficiario } : {}),
        nomeBeneficiario: p.nomeBeneficiario,
        ...(p.nitEmpregadoDomestico ? { nitEmpregadoDomestico: p.nitEmpregadoDomestico } : {}),
        ...(p.pais ? { pais: p.pais } : {}),
        valorPago: 0n,
        parcelaNaoDedutivel: 0n,
        contribuicaoPatrocinador: 0n,
      },
    ];
  });
  if (pagamentos.length > 0) {
    importados.push(
      plural(pagamentos.length, "beneficiário de pagamento", "beneficiários de pagamentos"),
    );
    aPreencher.push(`${FICHAS.pagamentos}: valores pagos em 2025`);
  }

  // Bens com situação em 31/12/2024 diferente de zero: viram a situação em 31/12/2024 da nova.
  const bensComSaldo = ant.bens.filter((b) => b.situacaoAtual !== 0n);
  const bens = bensComSaldo.map((b) => ({
    grupo: b.grupo,
    codigo: b.codigo,
    pertenceA: b.pertenceA,
    pais: b.pais,
    discriminacao: b.discriminacao,
    situacaoAnterior: b.situacaoAtual,
    situacaoAtual: 0n,
    ...(b.dataAquisicao ? { dataAquisicao: b.dataAquisicao } : {}),
    ...(b.ni ? { ni: b.ni } : {}),
    ...(b.imovel ? { imovel: b.imovel } : {}),
    ...(b.renavam ? { renavam: b.renavam } : {}),
    ...(b.registroAviacaoCivil ? { registroAviacaoCivil: b.registroAviacaoCivil } : {}),
    ...(b.registroCapitaniaPortos ? { registroCapitaniaPortos: b.registroCapitaniaPortos } : {}),
    ...(b.conta ? { conta: b.conta } : {}),
    negociadoEmBolsa: b.negociadoEmBolsa,
    ...(b.codigoNegociacao ? { codigoNegociacao: b.codigoNegociacao } : {}),
    ...(b.custodiante !== undefined ? { custodiante: b.custodiante } : {}),
    ...(b.codigoAltcoin ? { codigoAltcoin: b.codigoAltcoin } : {}),
    ...(b.codigoStablecoin ? { codigoStablecoin: b.codigoStablecoin } : {}),
    usufruto: b.usufruto,
    proprietariosUsufrutuarios: b.proprietariosUsufrutuarios,
  }));
  if (bens.length > 0) {
    importados.push(`${plural(bens.length, "bem", "bens")} com a situação em 31/12/2024`);
    aPreencher.push(
      `${FICHAS.bens}: situação em 31/12/2025 (use repetir_valores_bens se não mudou)`,
    );
  }
  const bensSemSaldo = ant.bens.length - bens.length;
  if (bensSemSaldo > 0) {
    naoImportados.push(
      `${plural(bensSemSaldo, "bem", "bens")} com situação em 31/12/2024 igual a zero (baixados ou alienados em 2024)`,
    );
  }

  const dividasComSaldo = ant.dividas.filter((d) => d.situacaoAtual !== 0n);
  const dividas = dividasComSaldo.map((d) => ({
    codigo: d.codigo,
    discriminacao: d.discriminacao,
    ...(d.niCredor ? { niCredor: d.niCredor } : {}),
    situacaoAnterior: d.situacaoAtual,
    situacaoAtual: 0n,
    valorPago: 0n,
  }));
  if (dividas.length > 0) {
    importados.push(`${plural(dividas.length, "dívida", "dívidas")} com a situação em 31/12/2024`);
    aPreencher.push(`${FICHAS.dividas}: situação em 31/12/2025 e valor pago em 2025`);
  }
  if (ant.dividas.length > dividas.length) {
    naoImportados.push(
      `${plural(ant.dividas.length - dividas.length, "dívida", "dívidas")} com situação em 31/12/2024 igual a zero`,
    );
  }

  let atividadeRural: DeclaracaoEntrada["atividadeRural"];
  const ar = ant.atividadeRural;
  if (ar) {
    const aba = (a: typeof ar.brasil | typeof ar.exterior) => ({
      imoveis: a.imoveis,
      rebanho: a.rebanho.map((x) => ({
        especie: x.especie,
        estoqueInicial:
          x.estoqueInicial + x.aquisicoes + x.nascimentos - x.consumoPerdas - x.vendas,
      })),
      dividas: a.dividas
        .filter((d) => d.situacaoAtual !== 0n)
        .map((d) => ({
          discriminacao: d.discriminacao,
          ...(d.niCredor ? { niCredor: d.niCredor } : {}),
          situacaoAnterior: d.situacaoAtual,
          situacaoAtual: 0n,
          valorPago: 0n,
        })),
    });
    atividadeRural = {
      brasil: aba(ar.brasil),
      exterior: aba(ar.exterior),
      bens: ar.bens.map((b) => ({
        codigo: b.codigo,
        pais: b.pais,
        discriminacao: b.discriminacao,
        situacaoAnterior: 0n,
        situacaoAtual: 0n,
      })),
    };
    importados.push(
      "Atividade Rural: imóveis explorados, bens (código e discriminação), estoque final do rebanho como inicial e dívidas vinculadas",
    );
    aPreencher.push(
      `${FICHAS.atividadeRural}: receitas e despesas de 2025, valores dos bens e movimentação do rebanho`,
    );
    naoImportados.push(
      "Saldo de prejuízo da atividade rural a compensar: confira no demonstrativo de 2025 e informe na apuração",
    );
  }

  naoImportados.push(
    "Valores de rendimentos, imposto retido, pagamentos, doações, renda variável, ganhos de capital e demais fichas do ano-calendário 2024",
  );

  const declaracao: DeclaracaoEntrada = {
    exercicio: 2026,
    anoCalendario: 2025,
    identificacao,
    dependentes: ant.dependentes,
    alimentandos: ant.alimentandos,
    rendimentosPJ,
    pagamentos,
    bens,
    dividas,
    ...(atividadeRural ? { atividadeRural } : {}),
    resumo: { opcaoTributacao: ant.resumo.opcaoTributacao },
  };
  return { declaracao, importados, naoImportados, aPreencher };
}
