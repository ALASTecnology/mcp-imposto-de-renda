/**
 * @mcp-imposto-de-renda/mcp: servidor do MCP Imposto de Renda.
 *
 * Pontos de extensão:
 * - `GrupoFerramentas` e `RegistroFerramentas` (`ferramentas/tipos.ts`): contrato de um grupo;
 * - `GRUPOS` (`ferramentas/registro.ts`): lista central dos grupos registrados;
 * - `PastaAutorizada` (`arquivos/`): única porta de acesso ao disco.
 */
export {
  abrirPastaAutorizada,
  type CodigoErroArquivo,
  type CopiaSeguranca,
  ErroArquivo,
  type GanchosEscrita,
  type ItemArquivo,
  LIMITE_PADRAO_BYTES,
  MAX_BACKUPS_PADRAO,
  type OpcoesPasta,
  type OpcoesTransacao,
  PASTA_BACKUPS,
  type PastaAutorizada,
  type ResultadoEscrita,
  type ResultadoRemocao,
} from "./arquivos/index.js";
export {
  FICHAS_CONVERTIDAS,
  interpretarDeclaracao,
  modeloParaRegistros,
  registrosParaModelo,
  TIPOS_CONVERTIDOS,
} from "./conversao/dbk-modelo.js";
export { EntradaInvalidaError, ErroFerramenta, mensagemDeErro } from "./erros.js";
export { DESCRICAO_VALOR, normalizarValor, zEntradaCalculo, zValorMonetario } from "./esquemas.js";
export {
  ehNomePerfil,
  type InfoFerramenta,
  NOMES_PERFIS,
  type NomePerfil,
  PERFIS,
  type Perfil,
  perfilPorNome,
} from "./ferramentas/perfis.js";
export { ANOTACOES_ESCRITA, ANOTACOES_LEITURA } from "./ferramentas/registrador.js";
export { GRUPOS } from "./ferramentas/registro.js";
export type {
  AmbienteProcesso,
  ContextoFerramentas,
  DefinicaoFerramenta,
  Executor,
  GrupoFerramentas,
  InfoServidor,
  NomeGrupo,
  RegistroFerramentas,
  ResultadoFerramenta,
} from "./ferramentas/tipos.js";
export { AVISO_LEGAL, URI_AVISO_LEGAL } from "./recursos.js";
export { type Json, objetoJson, paraJson } from "./serializacao.js";
export {
  ambienteDoProcesso,
  catalogoFerramentas,
  createServer,
  ferramentasRegistradas,
  MAX_ELEMENTOS_ENTRADA,
  NOME_SERVIDOR,
  type OpcoesCatalogo,
  type OpcoesServidor,
  VERSAO_SERVIDOR,
} from "./servidor.js";
