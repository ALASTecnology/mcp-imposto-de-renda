/** Erros tipados do codec do arquivo da declaração. */

/** Onde o problema aconteceu. `linha` conta a partir de 1. */
export interface ContextoErroArquivo {
  readonly linha?: number;
  readonly tipo?: string;
  readonly campo?: string;
}

function prefixo(contexto: ContextoErroArquivo): string {
  const partes: string[] = [];
  if (contexto.linha !== undefined) partes.push(`linha ${contexto.linha}`);
  if (contexto.tipo !== undefined) partes.push(`registro ${contexto.tipo}`);
  if (contexto.campo !== undefined) partes.push(`campo ${contexto.campo}`);
  return partes.length > 0 ? `${partes.join(", ")}: ` : "";
}

/** Base de todos os erros de leitura e gravação do arquivo da declaração. */
export class ArquivoDeclaracaoError extends Error {
  override readonly name: string = "ArquivoDeclaracaoError";
  readonly linha: number | undefined;
  readonly tipo: string | undefined;
  readonly campo: string | undefined;

  constructor(mensagem: string, contexto: ContextoErroArquivo = {}) {
    super(`${prefixo(contexto)}${mensagem}`);
    this.linha = contexto.linha;
    this.tipo = contexto.tipo;
    this.campo = contexto.campo;
  }
}

/** Os primeiros caracteres da linha não correspondem a nenhum tipo do leiaute. */
export class TipoRegistroDesconhecidoError extends ArquivoDeclaracaoError {
  override readonly name = "TipoRegistroDesconhecidoError";
}

/** A linha não tem o tamanho exigido pelo tipo de registro. */
export class TamanhoLinhaInvalidoError extends ArquivoDeclaracaoError {
  override readonly name = "TamanhoLinhaInvalidoError";
}

/** Fim de linha diferente de CRLF (por exemplo LF isolado ou CR isolado). */
export class TerminadorLinhaInvalidoError extends ArquivoDeclaracaoError {
  override readonly name = "TerminadorLinhaInvalidoError";
}

/** Conteúdo de campo incompatível com o formato (número com letras, data inválida...). */
export class CampoInvalidoError extends ArquivoDeclaracaoError {
  override readonly name = "CampoInvalidoError";
}

/** Texto com caractere que não existe em ISO-8859-1 ou com quebra de linha. */
export class CaractereInvalidoError extends ArquivoDeclaracaoError {
  override readonly name = "CaractereInvalidoError";
}

/** Valor negativo em campo numérico, que não tem posição para sinal. */
export class ValorNegativoError extends ArquivoDeclaracaoError {
  override readonly name = "ValorNegativoError";
}

/** Valor que não cabe no tamanho do campo. */
export class ValorExcedeTamanhoError extends ArquivoDeclaracaoError {
  override readonly name = "ValorExcedeTamanhoError";
}

/** Registro sem um campo do leiaute ou com campo que o leiaute não conhece. */
export class CampoDesconhecidoError extends ArquivoDeclaracaoError {
  override readonly name = "CampoDesconhecidoError";
}

/** Não há leiaute para o exercício informado no header. */
export class ExercicioNaoSuportadoError extends ArquivoDeclaracaoError {
  override readonly name = "ExercicioNaoSuportadoError";
}
