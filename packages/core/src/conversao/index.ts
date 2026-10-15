/**
 * conversao/: conversão pura (sem E/S) entre os registros do arquivo da declaração (DBK/DEC) e
 * o modelo tipado (`zDeclaracao`).
 *
 * - `registrosParaModelo(registros)` lê todas as fichas cobertas e devolve o objeto de entrada
 *   do schema, a contagem por tipo e os tipos que não foram mapeados.
 * - `modeloParaRegistros(declaracao, { base })` gera os registros a partir do modelo. Com o
 *   arquivo base, cada registro é pareado com o original: o que o modelo descreve vem do
 *   modelo, o resto (fillers, campos que o modelo não guarda) é mantido. Registros de tipos não
 *   mapeados são preservados sem alteração. Os controles (CRC, T9 e hash) são recalculados.
 *
 * A cobertura por tipo de registro está em `COBERTURA_REGISTROS` e em docs/formato-dbk.md.
 */
import type { Registro } from "../dbk/codec.js";
import { leiauteDosRegistros } from "../dbk/codec.js";
import { type OpcoesRecalculo, recalcularControles, TIPOS_RECIBO } from "../dbk/controle.js";
import { type Leiaute, tipoDoLeiaute } from "../dbk/leiaute.js";
import { obterLeiaute } from "../dbk/leiautes/index.js";
import type { Declaracao } from "../model/declaracao.js";
import { CODIGO_RECEITANET } from "../model/identificacao.js";
import { aaaammddDeIso, ddmmaaaaDeIso, type Objeto, type Valores, valorDoCampo } from "./campos.js";
import { GravacaoRegistros, LeituraRegistros, type Mapeador } from "./contexto.js";
import { mapeadorAtividadeRural } from "./mapeadores/atividade-rural.js";
import { mapeadorBensDividas } from "./mapeadores/bens-dividas.js";
import { mapeadorGanhosCapital } from "./mapeadores/ganhos-capital.js";
import {
  camposContaResumo,
  mapeadorIdentificacao,
  nomeMunicipio,
} from "./mapeadores/identificacao.js";
import { mapeadorIsentosExclusivos } from "./mapeadores/isentos-exclusivos.js";
import { mapeadorPagamentosDoacoes } from "./mapeadores/pagamentos-doacoes.js";
import { mapeadorPessoas } from "./mapeadores/pessoas.js";
import { mapeadorRendaVariavel } from "./mapeadores/renda-variavel.js";
import { mapeadorRendimentos } from "./mapeadores/rendimentos.js";
import { calcularTotais } from "./recalculo.js";
import {
  gravarTotais,
  lerTotais,
  type ModoTotais,
  precisaRecalcular,
  saldoDoBase,
  TIPOS_TOTAIS,
} from "./totais.js";

export {
  DeclaracaoAnteriorInvalidaError,
  migrarDeclaracaoAnterior,
  type OpcoesMigracao,
  type ResultadoMigracao,
} from "./ano-anterior.js";
export type { ContextoGravacao, ContextoLeitura, Mapeador } from "./contexto.js";
export {
  ExportacaoGcapInvalidaError,
  incluirDemonstrativoGcap,
  lerDemonstrativoGcapXml,
} from "./gcap-exportacao.js";
export {
  type DemonstrativoLivroCaixaRural,
  type ExportacaoLivroCaixaRural,
  ExportacaoLivroCaixaRuralInvalidaError,
  incluirLivroCaixaRural,
  lerExportacaoLivroCaixaRural,
  type MesLivroCaixaRural,
} from "./livro-caixa-rural.js";
export { calcularTotais, entradaCalculoDoModelo, type TotaisCalculados } from "./recalculo.js";
export { type ModoTotais, TIPOS_TOTAIS } from "./totais.js";

/** Mapeadores de ficha, na ordem de leitura e gravação. */
export const MAPEADORES: readonly Mapeador[] = Object.freeze([
  mapeadorIdentificacao,
  mapeadorPessoas,
  mapeadorRendimentos,
  mapeadorIsentosExclusivos,
  mapeadorPagamentosDoacoes,
  mapeadorBensDividas,
  mapeadorRendaVariavel,
  mapeadorAtividadeRural,
  mapeadorGanhosCapital,
]);

/** Tipos de registro lidos e gravados a partir do modelo. */
export function tiposMapeados(): ReadonlySet<string> {
  return new Set(MAPEADORES.flatMap((m) => [...m.tipos, ...(m.tiposLegados ?? [])]));
}

const TIPOS_CONTROLE: ReadonlySet<string> = new Set(["IR", "T9"]);

/** Tipos tratados pela conversão (fichas, totais e controle); os demais são preservados. */
function tiposTratados(): ReadonlySet<string> {
  return new Set([...tiposMapeados(), ...TIPOS_TOTAIS, ...TIPOS_CONTROLE]);
}

export interface OpcoesLeituraModelo {
  /** Leiaute do arquivo; padrão: o do exercício gravado no header. */
  readonly leiaute?: Leiaute;
}

export interface LeituraModelo {
  readonly exercicio: number;
  /** Declaração no formato de entrada de `zDeclaracao` (valores em `bigint`). */
  readonly declaracao: Objeto;
  readonly contagemPorTipo: Readonly<Record<string, number>>;
  /** Tipos presentes no arquivo que a conversão não leva ao modelo (preservados ao gravar). */
  readonly tiposNaoMapeados: readonly string[];
  readonly avisos: readonly string[];
}

/** Converte os registros lidos de um DBK/DEC no modelo. */
export function registrosParaModelo(
  registros: readonly Registro[],
  opcoes: OpcoesLeituraModelo = {},
): LeituraModelo {
  const leiaute = opcoes.leiaute ?? leiauteDosRegistros(registros);
  const ctx = new LeituraRegistros(leiaute, registros);
  const declaracao: Objeto = { exercicio: leiaute.exercicio };
  for (const m of MAPEADORES) m.ler(ctx, declaracao);
  lerTotais(ctx, declaracao);

  const contagem: Record<string, number> = {};
  for (const r of registros) contagem[r.tipo] = (contagem[r.tipo] ?? 0) + 1;
  const tratados = tiposTratados();
  const tiposNaoMapeados = Object.keys(contagem)
    .filter((t) => !tratados.has(t) && !TIPOS_RECIBO.has(t))
    .sort();
  if (tiposNaoMapeados.length > 0) {
    ctx.aviso(
      `Registros sem correspondência no modelo, preservados sem alteração na gravação: ${tiposNaoMapeados.join(", ")}.`,
    );
  }
  return {
    exercicio: leiaute.exercicio,
    declaracao,
    contagemPorTipo: contagem,
    tiposNaoMapeados,
    avisos: ctx.avisos,
  };
}

export interface OpcoesGravacaoModelo {
  /** Registros do arquivo de partida (o DBK/DEC aberto). Recomendado ao editar. */
  readonly base?: readonly Registro[];
  readonly leiaute?: Leiaute;
  /**
   * `recalcular` (padrão) refaz os totais do Resumo com o motor do core; `preservar` mantém os
   * totais do arquivo base (ida e volta sem alteração).
   */
  readonly totais?: ModoTotais;
  /** Opções repassadas a `recalcularControles` (por exemplo, o controle do header). */
  readonly controles?: Omit<OpcoesRecalculo, "leiaute">;
}

export interface GravacaoModelo {
  readonly registros: Registro[];
  /** Tipos copiados do arquivo base sem alteração, por não terem correspondência no modelo. */
  readonly tiposPreservados: readonly string[];
  readonly totaisRecalculados: boolean;
  readonly avisos: readonly string[];
}

/** Código do Receitanet do exercício (2600, 2620 e 2621 em 2016; +100 por exercício). */
function codigoReceitanet(dec: Declaracao, exercicio: number): bigint {
  return (
    BigInt(CODIGO_RECEITANET[dec.identificacao.tipoDeclaracao.tipo]) +
    BigInt((exercicio - 2016) * 100)
  );
}

function valoresHeader(dec: Declaracao, leiaute: Leiaute, semBase: boolean): Valores {
  const id = dec.identificacao;
  const e = id.endereco;
  const r = dec.resumo;
  const procurador =
    (e.local === "exterior" ? e.cpfProcurador : undefined) ?? dec.saidaDefinitiva?.procurador?.cpf;
  const inventariante = dec.finalEspolio?.inventariante.cpf ?? dec.espolio?.inventariante.cpf;
  const v: Valores = {
    NR_CPF: id.cpf,
    NM_NOME: id.nome,
    NM_CONTRIBUINTE: id.nome,
    DT_NASCIM: ddmmaaaaDeIso(id.dataNascimento),
    IN_RETIFICADORA: id.tipoDeclaracao.retificadora ? "1" : "0",
    IN_COMPLETA: r.opcaoTributacao === "deducoesLegais" ? "S" : "N",
    NR_CONJ: id.conjuge.cpf ?? "",
    CD_NATUR: id.ocupacao.natureza,
    SG_UF: e.local === "brasil" ? e.uf : "EX",
    CD_MUNICIP: e.local === "brasil" ? e.municipio : "",
    NM_MUNICIPIO: e.local === "brasil" ? (nomeMunicipio(e.municipio) ?? "") : e.cidade,
    NR_CEP: e.local === "brasil" ? e.cep : 0n,
    IN_DEBITO_PRIMEIRA_QUOTA: r.debitoAutomatico && r.debitoPrimeiraQuota ? 1n : 0n,
    NR_CPF_PROCURADOR: procurador ?? "",
    NR_CPF_INVENTARIANTE: inventariante ?? "",
    DT_COND_NAO_RESIDENTE: aaaammddDeIso(dec.saidaDefinitiva?.dataCondicaoNaoResidente),
    DATA_TRANSITO_JULGADO: aaaammddDeIso(dec.finalEspolio?.decisaoJudicial?.dataTransitoJulgado),
    IN_SOBREPARTILHA:
      (dec.espolio?.sobrepartilha ?? false) ||
      (dec.finalEspolio !== undefined && dec.finalEspolio.modalidade !== "partilha")
        ? "1"
        : "0",
    DT_RETORNO_PAIS: ddmmaaaaDeIso(id.retornoAoPais.data) ?? "",
    NR_PROCESSO_ATUALIZACAO_BEM: id.processoAtualizacaoBemLei14973 ?? "",
  };
  if (semBase) {
    // Arquivo novo: valores iniciais iguais aos que o programa grava em uma declaração
    // iniciada nele. Dados do ambiente (sistema operacional, Java, endereço de rede) ficam em
    // branco; o programa os preenche ao gravar.
    Object.assign(v, {
      EXERCICIO: BigInt(leiaute.exercicio),
      ANO_BASE: BigInt(leiaute.exercicio - 1),
      CODIGO_RECNET: codigoReceitanet(dec, leiaute.exercicio),
      TIPO_NI: 1n,
      NR_VERSAO: 150n,
      IN_GERADA: "S",
      IN_SEGURANCA: "1",
      IN_CONFIABILIDADE: "0",
      TP_INICIADA: "01",
      IN_TRANSMITIDA: "01",
      IN_CPF_TRANSMISSAO_PERFIL: "0",
      IN_UTILIZOU_PGD: "1",
      IN_UTILIZOU_APP: "0",
      IN_UTILIZOU_ONLINE: "0",
      IN_UTILIZOU_RASCUNHO: "0",
      IN_UTILIZOU_PREPREENCHIDA: "0",
      IN_UTILIZOU_ASSISTIDA_FONTES_PAGADORAS: "0",
      IN_UTILIZOU_ASSISTIDA_PLANO_SAUDE: "0",
      IN_UTILIZOU_SALVAR_RECUPERAR_ONLINE: "0",
      IN_SOCIAL: "0",
      IN_CLWEB: "0",
      IN_ISENCAO_GCAP_TITULAR: "0",
      IN_ISENCAO_GCAP_MAIOR: "0",
      IN_ISENCAO_GCAP_DOIS: "0",
      IN_ISENCAO_GCAP_TRES: "0",
      IN_ISENCAO_GCAP_QUATRO: "0",
      IN_ISENCAO_GCAP_CINCO: "0",
      IN_ISENCAO_GCAP_SEIS: "0",
    });
  }
  return v;
}

/** Ordem dos tipos no arquivo: header, fichas do leiaute, demais tipos, T9 e recibo. */
function ordemTipos(leiaute: Leiaute): Map<string, number> {
  const ordem = new Map<string, number>([["IR", 0]]);
  const fichas = leiaute.tipos.filter((t) => /^\d+$/.test(t.id));
  const outros = leiaute.tipos.filter(
    (t) => !/^\d+$/.test(t.id) && t.id !== "IR" && t.id !== "T9" && !TIPOS_RECIBO.has(t.id),
  );
  for (const t of [...fichas, ...outros]) ordem.set(t.id, ordem.size);
  ordem.set("T9", ordem.size);
  for (const t of leiaute.tipos) if (TIPOS_RECIBO.has(t.id)) ordem.set(t.id, ordem.size);
  return ordem;
}

/** Gera os registros do arquivo a partir do modelo (ver o comentário do módulo). */
export function modeloParaRegistros(
  dec: Declaracao,
  opcoes: OpcoesGravacaoModelo = {},
): GravacaoModelo {
  const base = opcoes.base;
  const leiaute =
    opcoes.leiaute ??
    (base && base.length > 0 ? leiauteDosRegistros(base) : obterLeiaute(dec.exercicio));
  const cpf = dec.identificacao.cpf;
  const ctx = new GravacaoRegistros(leiaute, cpf, dec, base);
  const modo = opcoes.totais ?? "recalcular";
  const recalcular = precisaRecalcular(ctx, dec, modo);
  const calculados = recalcular ? calcularTotais(dec) : undefined;
  ctx.saldoAPagar = calculados ? calculados.saldoAPagar : saldoDoBase(ctx, dec);
  for (const m of MAPEADORES) m.gravar(ctx, dec);
  const header = gravarTotais(ctx, dec, calculados);
  const semBaseIr = ctx.baseDoTipo("IR").length === 0;
  ctx.adicionar("IR", {
    ...valoresHeader(dec, leiaute, semBaseIr),
    ...camposContaResumo(dec.resumo, ctx.saldoAPagar),
    ...(semBaseIr && calculados ? calculados.headerArquivoNovo : {}),
    ...header,
  });

  const tratados = tiposTratados();
  // Uma cópia de segurança (DBK) não leva o recibo de entrega de um DEC.
  const semRecibo = opcoes.controles?.tipoArquivo === "DBK";
  const preservados = (base ?? [])
    .filter((r) => !tratados.has(r.tipo) && !(semRecibo && TIPOS_RECIBO.has(r.tipo)))
    .map((r) => {
      const campo = tipoDoLeiaute(leiaute, r.tipo)?.campos.find((c) => c.chave === "NR_CPF");
      if (TIPOS_RECIBO.has(r.tipo) || !campo) return r;
      return { tipo: r.tipo, campos: { ...r.campos, NR_CPF: valorDoCampo(campo, cpf) } };
    });
  ctx.adicionar("T9", {});

  const ordem = ordemTipos(leiaute);
  const todos = [...ctx.produzidos, ...preservados]
    .map((r, i) => ({ r, i }))
    .sort((a, b) => (ordem.get(a.r.tipo) ?? 9999) - (ordem.get(b.r.tipo) ?? 9999) || a.i - b.i)
    .map((x) => x.r);
  const tiposPreservados = [
    ...new Set(preservados.filter((r) => !TIPOS_RECIBO.has(r.tipo)).map((r) => r.tipo)),
  ].sort();
  const avisos = [...ctx.avisos];
  if (tiposPreservados.length > 0) {
    avisos.push(
      `Registros preservados do arquivo base sem alteração (sem correspondência no modelo): ${tiposPreservados.join(", ")}. Confira-os no programa oficial.`,
    );
  }
  return {
    registros: recalcularControles(todos, { ...opcoes.controles, leiaute }),
    tiposPreservados,
    totaisRecalculados: recalcular,
    avisos,
  };
}

/** Situação de um tipo de registro na conversão. */
export type SituacaoRegistro = "mapeado" | "totais" | "controle" | "recibo" | "preservado";

export interface CoberturaRegistro {
  readonly tipo: string;
  readonly descricao: string;
  readonly situacao: SituacaoRegistro;
  /** Mapeador responsável (fichas) ou motivo da preservação. */
  readonly detalhe: string;
}

/** Por que cada tipo sem correspondência no modelo é preservado do arquivo base. */
const MOTIVOS_PRESERVACAO: Readonly<Record<string, string>> = {
  "31": "detalhe de isento de leiaute anterior; o programa 2026 não o grava (o T9 não o conta)",
  "33": "detalhe de isento de leiaute anterior; o programa 2026 não o grava (o T9 não o conta)",
  "37": "demonstrativo calculado da Lei 14.754/2023 por bem; refeito pelo programa",
  "67": "reforma no exterior do GCAP: detalhe sem lugar no modelo",
  "70": "apuração em ambas as moedas do GCAP: detalhe sem lugar no modelo",
  "71": "parcelas de imóvel alienado a prazo (GCAP)",
  "72": "parcelas de móvel alienado a prazo (GCAP)",
  "73": "apuração do custo médio de participações (GCAP)",
  "75": "faixas de tributação do GCAP",
  "76": "totalização mensal de moedas alienadas (GCAP)",
  "77": "totais por moeda do GCAP (leiaute de dados)",
  "78": "totais de bens e espécie do GCAP (leiaute de dados)",
  "82": "detalhe de isento de leiaute anterior; o programa 2026 não o grava",
  "93": "detalhe de isento de leiaute anterior; o programa 2026 não o grava",
  "94": "detalhe de isento de leiaute anterior; o programa 2026 não o grava",
  "95": "detalhe de exclusivo de leiaute anterior; o programa 2026 não o grava",
  "96": "detalhe de exclusivo de leiaute anterior; o programa 2026 não o grava",
  "97": "detalhe de isento ou exclusivo de leiaute anterior; o programa 2026 não o grava",
  "98": "detalhe de isento de leiaute anterior; o programa 2026 não o grava",
  "99": "detalhe de exclusivo de leiaute anterior; o programa 2026 não o grava",
  FR: "dados de entrega, não aparece nos arquivos DEC e DBK",
  SR: "header de salvar e recuperar online",
  IP: "imposto pago avulso; a ficha Imposto Pago fica nos registros 17 e 19",
};

/** Cobertura da conversão por tipo de registro do leiaute. */
export function coberturaRegistros(leiaute: Leiaute = obterLeiaute(2026)): CoberturaRegistro[] {
  const porTipo = new Map<string, string>();
  for (const m of MAPEADORES) for (const t of m.tipos) porTipo.set(t, m.nome);
  return leiaute.tipos.map((t) => {
    const base = { tipo: t.id, descricao: t.descricao.trim() };
    const mapeador = porTipo.get(t.id);
    if (mapeador) return { ...base, situacao: "mapeado", detalhe: mapeador };
    if ((TIPOS_TOTAIS as readonly string[]).includes(t.id)) {
      return {
        ...base,
        situacao: "totais",
        detalhe: "Imposto Pago e totais do Resumo, recalculados",
      };
    }
    if (TIPOS_CONTROLE.has(t.id)) {
      return {
        ...base,
        situacao: "controle",
        detalhe: "header e fechamento, com controles recalculados",
      };
    }
    if (TIPOS_RECIBO.has(t.id)) {
      return { ...base, situacao: "recibo", detalhe: "recibo da Receita Federal, nunca alterado" };
    }
    return {
      ...base,
      situacao: "preservado",
      detalhe: MOTIVOS_PRESERVACAO[t.id] ?? "sem ficha no modelo",
    };
  });
}
