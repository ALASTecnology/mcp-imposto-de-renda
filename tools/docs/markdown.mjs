// Utilidades de conferência de Markdown usadas por links.mjs e pelos testes de tools/docs.

/** Remove blocos de código cercados, preservando as linhas (para não conferir o que há neles). */
export function semCodigo(texto) {
  let cerca = null;
  return texto
    .split("\n")
    .map((l) => {
      const m = l.match(/^\s*(`{3,}|~{3,})/);
      if (m) {
        if (!cerca) cerca = m[1];
        else if (m[1][0] === cerca[0] && m[1].length >= cerca.length) cerca = null;
        return "";
      }
      return cerca ? "" : l;
    })
    .join("\n");
}

/**
 * Células de uma linha de tabela. Separa nas barras verticais que não estão escapadas: uma barra
 * precedida de número ímpar de contrabarras é literal; com número par (como em `\\|`), separa.
 */
export function celulas(linha) {
  const partes = [];
  let atual = "";
  let barras = 0;
  for (const c of linha.trim()) {
    if (c === "|" && barras % 2 === 0) {
      partes.push(atual);
      atual = "";
    } else {
      atual += c;
    }
    barras = c === "\\" ? barras + 1 : 0;
  }
  partes.push(atual);
  if (partes[0].trim() === "") partes.shift();
  if (partes.length && partes[partes.length - 1].trim() === "") partes.pop();
  return partes;
}

/**
 * Linhas de tabela com número de colunas diferente do cabeçalho. Devolve o número da linha (a
 * partir de 1), as colunas esperadas e as encontradas.
 */
export function tabelasDesalinhadas(texto) {
  const linhas = semCodigo(texto).split("\n");
  const problemas = [];
  for (let i = 0; i + 1 < linhas.length; i++) {
    const separador = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;
    if (!/^\s*\|/.test(linhas[i]) || !separador.test(linhas[i + 1])) continue;
    const esperado = celulas(linhas[i]).length;
    let j = i + 1;
    for (; j < linhas.length && /^\s*\|/.test(linhas[j]); j++) {
      const achado = celulas(linhas[j]).length;
      if (achado !== esperado) problemas.push({ linha: j + 1, esperado, achado });
    }
    i = j - 1;
  }
  return problemas;
}
