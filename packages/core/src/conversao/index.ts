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
import type { Leiaute } from "../dbk/leiaute.js";
import { obterLeiaute } from "../dbk/leiautes/index.js";
import type { Declaracao } from "../model/declaracao.js";
import { CODIGO_RECEITANET } from "../model/identificacao.js";
import { aaaammddDeIso, ddmmaaaaDeIso, type Objeto, type Valores } from "./campos.js";
import { GravacaoRegistros, LeituraRegistros, type Mapeador } from "./contexto.js";
import { mapeadorAtividadeRural } from "./mapeadores/atividade-rural.js";
import { mapeadorBensDividas } from "./mapeadores/bens-dividas.js";
import { mapeadorGanhosCapital } from "./mapeadores/ganhos-capital.js";
import { mapeadorIdentificacao, nomeMunicipio } from "./mapeadores/identificacao.js";
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

export type { ContextoGravacao, ContextoLeitura, Mapeador } from "./contexto.js";
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
    NR_BANCO: r.conta ? BigInt(r.conta.banco) : 0n,
    NR_AGENCIA: r.conta ? BigInt(r.conta.agencia) : 0n,
    NR_CONTA: r.conta?.conta ?? "",
    NR_DV_CONTA: r.conta?.dv ?? "",
    IN_TIPO_CONTA: r.conta ? { corrente: "0", poupanca: "1", pagamento: "2" }[r.conta.tipo] : "0",
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
    Object.assign(v, {
      EXERCICIO: BigInt(leiaute.exercicio),
      ANO_BASE: BigInt(leiaute.exercicio - 1),
      CODIGO_RECNET: codigoReceitanet(dec, leiaute.exercicio),
      TIPO_NI: 1n,
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
  ctx.adicionar("IR", { ...valoresHeader(dec, leiaute, semBaseIr), ...header });

  const tratados = tiposTratados();
  const preservados = (base ?? [])
    .filter((r) => !tratados.has(r.tipo))
    .map((r) => {
      if (TIPOS_RECIBO.has(r.tipo) || !Object.hasOwn(r.campos, "NR_CPF")) return r;
      return { tipo: r.tipo, campos: { ...r.campos, NR_CPF: cpf } };
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
