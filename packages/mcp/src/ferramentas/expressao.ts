/**
 * Calculadora (equivalente a Ferramentas > Calculadora do programa oficial, Ctrl+Alt+A):
 * avalia expressões com +, -, *, /, parênteses e porcentagem em aritmética racional exata
 * (BigInt), sem ponto flutuante e sem `eval`. Números no formato brasileiro ("1.234,56") ou com
 * ponto decimal ("1234.56"); "1.234" sem vírgula é recusado por ser ambíguo.
 */

/** Fração irredutível com denominador positivo. */
interface Racional {
  readonly n: bigint;
  readonly d: bigint;
}

const LIMITE_TEXTO = 500;
const LIMITE_PROFUNDIDADE = 50;

function mdc(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x === 0n ? 1n : x;
}

function frac(n: bigint, d: bigint): Racional {
  if (d === 0n) throw new ExpressaoInvalidaError("divisão por zero");
  const s = d < 0n ? -1n : 1n;
  const g = mdc(n, d);
  return { n: (s * n) / g, d: (s * d) / g };
}

export class ExpressaoInvalidaError extends Error {
  override readonly name = "ExpressaoInvalidaError";
}

type Token =
  | { tipo: "num"; valor: Racional }
  | { tipo: "op"; valor: "+" | "-" | "*" | "/" | "%" | "(" | ")" };

function numero(texto: string): Racional {
  let t = texto;
  if (t.includes(",")) {
    if (!/^\d{1,3}(\.\d{3})*(,\d+)?$|^\d+(,\d+)?$/.test(t)) {
      throw new ExpressaoInvalidaError(`número inválido: ${texto}`);
    }
    t = t.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(t)) {
    throw new ExpressaoInvalidaError(
      `número ambíguo: "${texto}" pode ser milhar ou decimal; use vírgula decimal ("1.234,00" ou "1,234")`,
    );
  } else if (!/^\d+(\.\d+)?$/.test(t)) {
    throw new ExpressaoInvalidaError(`número inválido: ${texto}`);
  }
  const [inteira = "0", fracao = ""] = t.split(".");
  return frac(BigInt(inteira + fracao), 10n ** BigInt(fracao.length));
}

function tokens(expr: string): Token[] {
  const out: Token[] = [];
  const rx = /\s*(?:(\d[\d.,]*)|([-+*/%()×÷xX]))/y;
  let i = 0;
  while (i < expr.length) {
    if (/^\s*$/.test(expr.slice(i))) break;
    rx.lastIndex = i;
    const m = rx.exec(expr);
    if (!m) throw new ExpressaoInvalidaError(`caractere não reconhecido na posição ${i + 1}`);
    i = rx.lastIndex;
    if (m[1]) out.push({ tipo: "num", valor: numero(m[1]) });
    else {
      const op = m[2] === "×" || m[2] === "x" || m[2] === "X" ? "*" : m[2] === "÷" ? "/" : m[2];
      out.push({ tipo: "op", valor: op as "+" });
    }
  }
  return out;
}

/** Analisador descendente recursivo: soma > produto > unário > pós-fixo (%) > primário. */
function avaliar(lista: Token[]): Racional {
  let pos = 0;
  let profundidade = 0;
  const olhar = () => lista[pos];
  const ehOp = (v: string) => {
    const t = olhar();
    return t?.tipo === "op" && t.valor === v;
  };
  function soma(): Racional {
    let a = produto();
    while (ehOp("+") || ehOp("-")) {
      const op = (lista[pos++] as { valor: string }).valor;
      const b = produto();
      a = frac(op === "+" ? a.n * b.d + b.n * a.d : a.n * b.d - b.n * a.d, a.d * b.d);
    }
    return a;
  }
  function produto(): Racional {
    let a = unario();
    while (ehOp("*") || ehOp("/")) {
      const op = (lista[pos++] as { valor: string }).valor;
      const b = unario();
      a = op === "*" ? frac(a.n * b.n, a.d * b.d) : frac(a.n * b.d, a.d * b.n);
    }
    return a;
  }
  function unario(): Racional {
    if (ehOp("-") || ehOp("+")) {
      const op = (lista[pos++] as { valor: string }).valor;
      const v = unario();
      return op === "-" ? frac(-v.n, v.d) : v;
    }
    return posfixo();
  }
  function posfixo(): Racional {
    let v = primario();
    while (ehOp("%")) {
      pos++;
      v = frac(v.n, v.d * 100n);
    }
    return v;
  }
  function primario(): Racional {
    const t = lista[pos++];
    if (!t) throw new ExpressaoInvalidaError("expressão incompleta");
    if (t.tipo === "num") return t.valor;
    if (t.valor === "(") {
      if (++profundidade > LIMITE_PROFUNDIDADE) {
        throw new ExpressaoInvalidaError("parênteses aninhados demais");
      }
      const v = soma();
      if (!ehOp(")")) throw new ExpressaoInvalidaError("falta fechar parêntese");
      pos++;
      profundidade--;
      return v;
    }
    throw new ExpressaoInvalidaError(`operador fora de lugar: ${t.valor}`);
  }
  const v = soma();
  if (pos !== lista.length) throw new ExpressaoInvalidaError("sobra texto depois da expressão");
  return v;
}

function agrupar(inteira: string): string {
  return inteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export interface ResultadoExpressao {
  /** Formato brasileiro, arredondado: "1.234,56". */
  readonly resultado: string;
  /** Ponto decimal, sem separador de milhar: "1234.56". */
  readonly decimal: string;
  /** Verdadeiro se o arredondamento não descartou nada. */
  readonly exato: boolean;
  /** Fração exata "n/d" quando o resultado não é exato nas casas pedidas. */
  readonly fracao: string;
}

/** Avalia a expressão e arredonda (metade para cima, em valor absoluto) em `casas` casas. */
export function avaliarExpressao(expressao: string, casas = 2): ResultadoExpressao {
  if (expressao.length > LIMITE_TEXTO) {
    throw new ExpressaoInvalidaError(`expressão com mais de ${LIMITE_TEXTO} caracteres`);
  }
  const lista = tokens(expressao);
  if (lista.length === 0) throw new ExpressaoInvalidaError("expressão vazia");
  const v = avaliar(lista);
  const escala = 10n ** BigInt(casas);
  const neg = v.n < 0n;
  const abs = neg ? -v.n : v.n;
  const multiplicado = abs * escala;
  let q = multiplicado / v.d;
  const resto = multiplicado % v.d;
  if (resto * 2n >= v.d) q += 1n;
  const txt = q.toString().padStart(casas + 1, "0");
  const inteira = casas > 0 ? txt.slice(0, -casas) : txt;
  const dec = casas > 0 ? txt.slice(-casas) : "";
  const sinal = neg && q !== 0n ? "-" : "";
  return {
    resultado: `${sinal}${agrupar(inteira)}${dec ? `,${dec}` : ""}`,
    decimal: `${sinal}${inteira}${dec ? `.${dec}` : ""}`,
    exato: resto === 0n,
    fracao: `${v.n}/${v.d}`,
  };
}
