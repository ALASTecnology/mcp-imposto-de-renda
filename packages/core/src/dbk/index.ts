/**
 * dbk/: codec do arquivo da declaração (DEC e cópia de segurança DBK) dirigido por leiaute
 * declarativo.
 *
 * Cada tipo de registro (header `IR`, fichas `16` a `99`, fechamento `T9`, recibo) é
 * descrito como dados em `leiautes/<exercicio>.ts`, gerado por `tools/leiaute/gerar.ts`, e
 * um único codec genérico lê e grava qualquer leiaute descrito. Nenhum código da Receita
 * Federal entra aqui. Formato, controles e hipóteses estão em docs/formato-dbk.md.
 */

export {
  type ArquivoDeclaracao,
  centavosDoCampo,
  codificarLatin1,
  codificarRegistro,
  criarRegistro,
  decodificarLatin1,
  decodificarRegistro,
  gravarArquivo,
  leiauteDosRegistros,
  lerArquivo,
  type OpcoesGravacao,
  type OpcoesLeitura,
  type Registro,
  TAMANHO_MAXIMO_ARQUIVO,
  type ValorCampo,
} from "./codec.js";
export {
  type ConteudoHash,
  calcularControleHeader,
  calcularHashHeader,
  calcularHashRecibo,
  calcularNumeroControle,
  converterTipoArquivo,
  crc32,
  type DivergenciaControle,
  inferirTipoArquivo,
  type OpcoesControle,
  type OpcoesRecalculo,
  type RelatorioControles,
  recalcularControles,
  TIPOS_RECIBO,
  type TipoArquivo,
  tipoArquivoPorNome,
  VARIANTE_HASH_PADRAO,
  VARIANTES_HASH,
  type VarianteHash,
  verificarControles,
} from "./controle.js";
export {
  ArquivoDeclaracaoError,
  ArquivoGrandeDemaisError,
  CampoDesconhecidoError,
  CampoInvalidoError,
  CaractereInvalidoError,
  type ContextoErroArquivo,
  ExercicioNaoSuportadoError,
  TamanhoLinhaInvalidoError,
  TerminadorLinhaInvalidoError,
  TipoRegistroDesconhecidoError,
  ValorExcedeTamanhoError,
  ValorNegativoError,
} from "./erros.js";
export {
  type CampoLeiaute,
  type FormatoCampo,
  type FormatoData,
  type Leiaute,
  type TipoRegistroLeiaute,
  tipoDoLeiaute,
} from "./leiaute.js";
export { LEIAUTE_2025, LEIAUTE_2026, LEIAUTES, obterLeiaute } from "./leiautes/index.js";
export { ajustarParaEntrega, montarRecibo } from "./recibo.js";
