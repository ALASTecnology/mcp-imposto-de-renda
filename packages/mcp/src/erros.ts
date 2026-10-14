/**
 * Erros padronizados das ferramentas MCP do AutoIR.
 *
 * Toda falha que chega ao cliente MCP vira um resultado com `isError: true` e uma mensagem em
 * pt-BR pensada para o LLM corrigir a chamada: diz o que deu errado e o que fazer. A mensagem
 * nunca leva stack trace, caminho absoluto do disco nem conteúdo da declaração.
 */
import {
  ArquivoDeclaracaoError,
  CalculoInvalidoError,
  CampoDesconhecidoError,
  CampoInvalidoError,
  CaractereInvalidoError,
  ExercicioNaoSuportadoError,
  TamanhoLinhaInvalidoError,
  TerminadorLinhaInvalidoError,
  TipoRegistroDesconhecidoError,
  ValorExcedeTamanhoError,
  ValorMonetarioInvalidoError,
  ValorNegativoError,
} from "@autoir/core";

/**
 * Erro cuja mensagem já é segura e útil para o LLM. Lance esta classe (ou uma subclasse) dentro
 * das ferramentas quando a entrada não permitir continuar.
 */
export class ErroFerramenta extends Error {
  override readonly name: string = "ErroFerramenta";
}

/** Erro de entrada inválida detectado pela ferramenta (além do schema). */
export class EntradaInvalidaError extends ErroFerramenta {
  override readonly name = "EntradaInvalidaError";
}

/** Descrição em pt-BR de cada erro do codec do arquivo, sem repetir o conteúdo do arquivo. */
function descreverErroArquivo(e: ArquivoDeclaracaoError): string {
  let causa = "o arquivo não segue o leiaute da declaração";
  if (e instanceof ExercicioNaoSuportadoError) {
    causa = "o exercício do arquivo não é suportado (apenas 2026)";
  } else if (e instanceof TipoRegistroDesconhecidoError) {
    causa = "há uma linha com tipo de registro desconhecido";
  } else if (e instanceof TamanhoLinhaInvalidoError) {
    causa = "há uma linha com tamanho diferente do previsto no leiaute";
  } else if (e instanceof TerminadorLinhaInvalidoError) {
    causa = "as linhas não terminam com CRLF como no programa oficial";
  } else if (e instanceof CaractereInvalidoError) {
    causa = "há caractere fora do ISO-8859-1 ou quebra de linha dentro de um campo";
  } else if (e instanceof ValorExcedeTamanhoError) {
    causa = "um valor é maior do que o campo do leiaute comporta";
  } else if (e instanceof ValorNegativoError) {
    causa = "um campo numérico recebeu valor negativo";
  } else if (e instanceof CampoDesconhecidoError) {
    causa = "um campo não existe no leiaute do registro";
  } else if (e instanceof CampoInvalidoError) {
    causa = "um campo tem conteúdo inválido para o formato do leiaute";
  }
  const onde: string[] = [];
  if (e.linha !== undefined) onde.push(`linha ${e.linha}`);
  if (e.tipo !== undefined) onde.push(`registro ${e.tipo}`);
  if (e.campo !== undefined) onde.push(`campo ${e.campo}`);
  const local = onde.length > 0 ? ` (${onde.join(", ")})` : "";
  return (
    `Arquivo da declaração inválido: ${causa}${local}. ` +
    "Confira se é um DBK ou DEC do exercício 2026 gravado pelo programa oficial e não editado à mão."
  );
}

/**
 * Converte qualquer erro em mensagem segura para o cliente. Erros conhecidos do domínio têm
 * mensagens próprias; o resto vira uma mensagem genérica, sem detalhes internos.
 */
export function mensagemDeErro(e: unknown, ferramenta: string): string {
  if (e instanceof ErroFerramenta) return e.message;
  if (e instanceof ArquivoDeclaracaoError) return descreverErroArquivo(e);
  if (e instanceof CalculoInvalidoError) return `Entrada de cálculo inválida: ${e.message}`;
  if (e instanceof ValorMonetarioInvalidoError) {
    return 'Valor monetário inválido. Use texto em reais no formato "1.234,56" ou inteiro de centavos.';
  }
  return (
    `Erro interno ao executar ${ferramenta}. ` +
    "Tente novamente; se persistir, relate o problema sem anexar dados pessoais."
  );
}
