/**
 * Pré-validação do arquivo de entrega: reúne num relatório o que o validador da Receita confere
 * na recepção e que dá para conferir localmente (controles CRC de cada linha, `NR_CONTROLE` do
 * header, contagens do `T9`, `NR_HASH` do header e do `R9`, pendências de erro e totais do Resumo
 * refeitos pelo motor de cálculo). A recepção final continua no servidor da Receita, que confere
 * também o que só ela tem (recibo, situação cadastral, duplicidade de entrega).
 */
import {
  calcularTotais,
  type Declaracao,
  type DivergenciaControle,
  inferirTipoArquivo,
  type Registro,
  separarPendencias,
  type TipoArquivo,
  tipoArquivoPorNome,
  validarDeclaracao,
  verificarControles,
} from "@mcp-imposto-de-renda/core";
import { interpretarDeclaracao, registrosParaModelo } from "../conversao/dbk-modelo.js";

/** Exercício que o servidor monta para entrega. */
const EXERCICIO_ENTREGA = 2026;
const MAX_LISTA = 50;

export type SituacaoVerificacao = "ok" | "falha" | "aviso" | "nao_se_aplica";

export interface Verificacao {
  readonly id: string;
  readonly titulo: string;
  readonly situacao: SituacaoVerificacao;
  readonly detalhe: string;
}

export interface TotalDivergente {
  readonly registro: string;
  readonly campo: string;
  readonly gravado: string;
  readonly recalculado: string;
}

export interface RelatorioPreValidacao {
  readonly tipoArquivo: TipoArquivo;
  readonly apto: boolean;
  readonly verificacoes: readonly Verificacao[];
  readonly totalDivergenciasControle: number;
  readonly divergenciasControle: readonly DivergenciaControle[];
  readonly totalErros: number;
  readonly totalAvisos: number;
  readonly erros: readonly { codigo: string; mensagem: string }[];
  readonly totaisDivergentes: readonly TotalDivergente[];
}

const texto = (v: unknown): string =>
  v === null || v === undefined ? "" : typeof v === "boolean" ? (v ? "S" : "N") : String(v);

/** Campos dos totais e do header refeitos pelo motor que não batem com o que está gravado. */
function totaisDivergentes(registros: readonly Registro[], dec: Declaracao): TotalDivergente[] {
  const t = calcularTotais(dec);
  const completa = dec.resumo.opcaoTributacao === "deducoesLegais";
  const alvos: [string, Record<string, unknown>][] = completa
    ? [
        ["19", t.r19],
        ["20", t.r20],
        ["IR", t.header],
      ]
    : [
        ["17", t.r17],
        ["18", t.r18],
        ["IR", t.header],
      ];
  const saida: TotalDivergente[] = [];
  for (const [tipo, valores] of alvos) {
    const reg = registros.find((r) => r.tipo === tipo);
    if (!reg) {
      saida.push({ registro: tipo, campo: "(registro)", gravado: "ausente", recalculado: "" });
      continue;
    }
    for (const [campo, valor] of Object.entries(valores)) {
      if (valor === undefined || !Object.hasOwn(reg.campos, campo)) continue;
      const gravado = texto(reg.campos[campo]);
      const recalculado = texto(valor);
      if (gravado !== recalculado) saida.push({ registro: tipo, campo, gravado, recalculado });
    }
  }
  return saida;
}

function situacao(falhou: boolean): SituacaoVerificacao {
  return falhou ? "falha" : "ok";
}

/** Confere localmente o que o validador da recepção confere no arquivo. */
export function preValidarEntrega(
  registros: readonly Registro[],
  exercicio: number,
  nomeArquivo: string,
): RelatorioPreValidacao {
  const tipoArquivo = tipoArquivoPorNome(nomeArquivo) ?? inferirTipoArquivo(registros);
  const controles = verificarControles(registros, { tipoArquivo });
  const de = (f: (d: DivergenciaControle) => boolean) => controles.divergencias.filter(f);
  const crc = de((d) => d.campo === "NR_CONTROLE" && d.tipo !== "IR");
  const header = de((d) => d.campo === "NR_CONTROLE" && d.tipo === "IR");
  const t9 = de((d) => d.tipo === "T9" && d.campo !== "NR_CONTROLE");
  const hashHeader = de((d) => d.campo === "NR_HASH" && d.tipo === "IR");
  const hashR9 = de((d) => d.campo === "NR_HASH" && d.tipo === "R9");
  const temR9 = registros.some((r) => r.tipo === "R9");
  const temHeader = registros.some((r) => r.tipo === "IR");
  const temT9 = registros.some((r) => r.tipo === "T9");
  const linhas = (l: readonly DivergenciaControle[]) =>
    l
      .slice(0, 5)
      .map((d) => `linha ${d.linha}`)
      .join(", ");

  const verificacoes: Verificacao[] = [];
  const v = (id: string, titulo: string, s: SituacaoVerificacao, detalhe: string) =>
    verificacoes.push({ id, titulo, situacao: s, detalhe });

  if (exercicio !== EXERCICIO_ENTREGA) {
    v(
      "tipo_arquivo",
      "Tipo do arquivo",
      "falha",
      `Arquivo do exercício ${exercicio}; o MCP Imposto de Renda prepara a entrega do exercício ${EXERCICIO_ENTREGA}.`,
    );
  } else if (tipoArquivo === "DBK") {
    v(
      "tipo_arquivo",
      "Tipo do arquivo",
      "aviso",
      "Cópia de segurança (.DBK): a Receita recebe o .DEC. Gere-o com gerar_arquivo_entrega e transmita pelo programa oficial.",
    );
  } else {
    v("tipo_arquivo", "Tipo do arquivo", "ok", "Arquivo de entrega (.DEC) do exercício 2026.");
  }
  v(
    "crc_linhas",
    "Número de controle (CRC-32) de cada linha",
    situacao(crc.length > 0),
    crc.length > 0
      ? `${crc.length} linha(s) com NR_CONTROLE divergente (${linhas(crc)}): o arquivo foi alterado fora do programa ou está corrompido.`
      : `${registros.length} registros conferidos.`,
  );
  v(
    "controle_header",
    "NR_CONTROLE do header",
    !temHeader ? "falha" : situacao(header.length > 0),
    !temHeader
      ? "Sem registro IR (header)."
      : header.length > 0
        ? `Não confere com a fórmula do programa para um .${tipoArquivo}.`
        : `Confere para um .${tipoArquivo}.`,
  );
  v(
    "t9",
    "Contagens do registro T9",
    !temT9 ? "falha" : situacao(t9.length > 0),
    !temT9
      ? "Sem registro T9 de fechamento."
      : t9.length > 0
        ? `Contagem divergente em ${t9.map((d) => d.campo).join(", ")}.`
        : "Quantidade de registros por tipo e total conferem.",
  );
  v(
    "hash_header",
    "NR_HASH do header",
    situacao(hashHeader.length > 0),
    hashHeader.length > 0
      ? "O hash do header não corresponde às linhas da declaração."
      : "Confere com as linhas da declaração.",
  );
  if (tipoArquivo === "DEC") {
    v(
      "hash_r9",
      "NR_HASH do R9 (recibo)",
      !temR9 ? "falha" : situacao(hashR9.length > 0),
      !temR9
        ? "O .DEC não tem os registros do recibo (HR, DR e R9); gere-o com gerar_arquivo_entrega."
        : hashR9.length > 0
          ? "O hash do R9 não corresponde às linhas entre o header e o R9."
          : "Confere com as fichas, o T9, o HR e o DR.",
    );
  } else {
    v("hash_r9", "NR_HASH do R9 (recibo)", "nao_se_aplica", "Só existe no .DEC.");
  }

  let erros: { codigo: string; mensagem: string }[] = [];
  let totalErros = 0;
  let totalAvisos = 0;
  let divergentes: TotalDivergente[] = [];
  let dec: Declaracao | undefined;
  let falhaLeitura = "";
  try {
    dec = interpretarDeclaracao(registrosParaModelo(registros, exercicio).declaracao);
  } catch (e) {
    falhaLeitura = e instanceof Error ? (e.message.split("\n")[0] ?? "") : "";
  }
  if (dec) {
    const separadas = separarPendencias(validarDeclaracao(dec));
    totalErros = separadas.erros.length;
    totalAvisos = separadas.avisos.length;
    erros = separadas.erros
      .slice(0, MAX_LISTA)
      .map((p) => ({ codigo: p.codigo, mensagem: p.mensagem }));
    v(
      "pendencias",
      "Pendências que impedem a entrega",
      situacao(totalErros > 0),
      totalErros > 0
        ? `${totalErros} erro(s) e ${totalAvisos} aviso(s); veja validar_declaracao.`
        : `Nenhum erro; ${totalAvisos} aviso(s) de risco de malha.`,
    );
    if (exercicio === EXERCICIO_ENTREGA) {
      divergentes = totaisDivergentes(registros, dec);
      v(
        "totais",
        "Totais do Resumo recalculados",
        situacao(divergentes.length > 0),
        divergentes.length > 0
          ? `${divergentes.length} campo(s) gravado(s) diferente(s) do recálculo (${divergentes
              .slice(0, 5)
              .map((d) => `${d.registro}.${d.campo}`)
              .join(", ")}); regrave com converter_modelo_para_dbk ou recalcule no programa.`
          : "Os totais gravados batem com o recálculo do motor.",
      );
    } else {
      v("totais", "Totais do Resumo recalculados", "nao_se_aplica", "Só para o exercício 2026.");
    }
  } else {
    const detalhe = `A declaração não pôde ser lida pelo modelo: ${falhaLeitura}`;
    v("pendencias", "Pendências que impedem a entrega", "falha", detalhe);
    v("totais", "Totais do Resumo recalculados", "falha", detalhe);
  }

  return {
    tipoArquivo,
    apto: verificacoes.every((x) => x.situacao !== "falha"),
    verificacoes,
    totalDivergenciasControle: controles.divergencias.length,
    divergenciasControle: controles.divergencias.slice(0, MAX_LISTA),
    totalErros,
    totalAvisos,
    erros,
    totaisDivergentes: divergentes.slice(0, MAX_LISTA),
  };
}
