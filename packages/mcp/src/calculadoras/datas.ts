/**
 * Datas civis (sem fuso) usadas pelas calculadoras: leitura de "AAAA-MM-DD", diferença em
 * dias, meses e último dia útil. Feriados não são considerados (só sábados e domingos), o que
 * fica dito nos avisos de cada ferramenta.
 */
import { EntradaInvalidaError } from "../erros.js";

export interface Data {
  readonly ano: number;
  readonly mes: number;
  readonly dia: number;
}

const RE_DATA = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Lê "AAAA-MM-DD" e confere se a data existe. */
export function lerData(texto: string, campo = "data"): Data {
  const m = RE_DATA.exec(texto);
  if (!m) throw new EntradaInvalidaError(`${campo}: use o formato AAAA-MM-DD.`);
  const d = { ano: Number(m[1]), mes: Number(m[2]), dia: Number(m[3]) };
  const t = new Date(Date.UTC(d.ano, d.mes - 1, d.dia));
  if (t.getUTCFullYear() !== d.ano || t.getUTCMonth() !== d.mes - 1 || t.getUTCDate() !== d.dia) {
    throw new EntradaInvalidaError(`${campo}: a data informada não existe.`);
  }
  return d;
}

export function formatarData(d: Data): string {
  return `${String(d.ano).padStart(4, "0")}-${String(d.mes).padStart(2, "0")}-${String(d.dia).padStart(2, "0")}`;
}

/** "AAAA-MM-DD" para "DD/MM/AAAA". */
export function dataBr(iso: string): string {
  const m = RE_DATA.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

/** Dias desde 1970-01-01 (UTC). */
export function diaJuliano(d: Data): number {
  return Math.round(Date.UTC(d.ano, d.mes - 1, d.dia) / 86_400_000);
}

export function deDiaJuliano(n: number): Data {
  const t = new Date(n * 86_400_000);
  return { ano: t.getUTCFullYear(), mes: t.getUTCMonth() + 1, dia: t.getUTCDate() };
}

export function somarDias(d: Data, dias: number): Data {
  return deDiaJuliano(diaJuliano(d) + dias);
}

/** Diferença em dias corridos (b menos a). */
export function diasEntre(a: Data, b: Data): number {
  return diaJuliano(b) - diaJuliano(a);
}

export function compararDatas(a: Data, b: Data): number {
  return diaJuliano(a) - diaJuliano(b);
}

/** Índice absoluto do mês (ano x 12 + mês - 1). */
export function indiceMes(d: { ano: number; mes: number }): number {
  return d.ano * 12 + d.mes - 1;
}

export function mesDoIndice(i: number): { ano: number; mes: number } {
  return { ano: Math.floor(i / 12), mes: (i % 12) + 1 };
}

export function chaveMes(i: number): string {
  const m = mesDoIndice(i);
  return `${m.ano}-${String(m.mes).padStart(2, "0")}`;
}

export function ultimoDiaDoMes(ano: number, mes: number): number {
  return new Date(Date.UTC(ano, mes, 0)).getUTCDate();
}

/** Mesma data N meses depois (dia limitado ao fim do mês). */
export function somarMeses(d: Data, meses: number): Data {
  const m = mesDoIndice(indiceMes(d) + meses);
  return { ano: m.ano, mes: m.mes, dia: Math.min(d.dia, ultimoDiaDoMes(m.ano, m.mes)) };
}

/** Último dia útil do mês, considerando só fins de semana (feriados não entram). */
export function ultimoDiaUtil(ano: number, mes: number): Data {
  let dia = ultimoDiaDoMes(ano, mes);
  for (;;) {
    const semana = new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay();
    if (semana !== 0 && semana !== 6) return { ano, mes, dia };
    dia--;
  }
}

/** Vencimento "último dia útil do mês seguinte" ao mês de apuração. */
export function vencimentoMesSeguinte(ano: number, mes: number): string {
  const m = mesDoIndice(indiceMes({ ano, mes }) + 1);
  return formatarData(ultimoDiaUtil(m.ano, m.mes));
}

export const AVISO_FERIADOS =
  "Vencimentos calculados como último dia útil considerando só sábados e domingos; se cair em feriado nacional, o prazo é o dia útil anterior.";
