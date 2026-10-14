/**
 * Datas civis simples (sem fuso), usadas em prazos, quotas e multa.
 */
import { CalculoInvalidoError } from "./aritmetica.js";

export interface DataCivil {
  readonly ano: number;
  readonly mes: number;
  readonly dia: number;
}

/** Dias do mês, sem `Date.UTC`, que trata os anos 0 a 99 como 1900 a 1999. */
function diasNoMes(ano: number, mes: number): number {
  const bissexto = (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
  return [31, bissexto ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mes - 1] ?? 0;
}

/** Aceita "AAAA-MM-DD" ou "DDMMAAAA" e valida o dia do calendário. */
export function lerData(texto: string): DataCivil {
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  let ano: number;
  let mes: number;
  let dia: number;
  if (m) {
    ano = Number(m[1]);
    mes = Number(m[2]);
    dia = Number(m[3]);
  } else {
    m = /^(\d{2})(\d{2})(\d{4})$/.exec(texto);
    if (!m)
      throw new CalculoInvalidoError(`Data inválida: "${texto}" (use AAAA-MM-DD ou DDMMAAAA)`);
    dia = Number(m[1]);
    mes = Number(m[2]);
    ano = Number(m[3]);
  }
  // O ano 0000 não existe no calendário.
  if (ano < 1 || mes < 1 || mes > 12 || dia < 1 || dia > diasNoMes(ano, mes)) {
    throw new CalculoInvalidoError(`Data inválida: "${texto}"`);
  }
  return { ano, mes, dia };
}

export function formatarData(d: DataCivil): string {
  return `${d.ano}-${String(d.mes).padStart(2, "0")}-${String(d.dia).padStart(2, "0")}`;
}

export function compararDatas(a: DataCivil, b: DataCivil): number {
  return a.ano - b.ano || a.mes - b.mes || a.dia - b.dia;
}

/** Índice absoluto do mês (para diferenças em meses). */
export function indiceMes(d: { ano: number; mes: number }): number {
  return d.ano * 12 + (d.mes - 1);
}

export function mesDoIndice(i: number): { ano: number; mes: number } {
  return { ano: Math.floor(i / 12), mes: (i % 12) + 1 };
}

/**
 * Último dia útil do mês considerando só fins de semana (sábado e domingo).
 * Feriados não são considerados.
 */
export function ultimoDiaUtilSemFeriados(ano: number, mes: number): DataCivil {
  let dia = diasNoMes(ano, mes);
  for (;;) {
    const data = new Date(0);
    data.setUTCFullYear(ano, mes - 1, dia); // aceita anos 0 a 99 sem somar 1900
    const semana = data.getUTCDay();
    if (semana !== 0 && semana !== 6) return { ano, mes, dia };
    dia -= 1;
  }
}

/** Idade completa em uma data de referência. */
export function idadeEm(nascimento: DataCivil, referencia: DataCivil): number {
  let idade = referencia.ano - nascimento.ano;
  if (
    referencia.mes < nascimento.mes ||
    (referencia.mes === nascimento.mes && referencia.dia < nascimento.dia)
  ) {
    idade -= 1;
  }
  return idade;
}
