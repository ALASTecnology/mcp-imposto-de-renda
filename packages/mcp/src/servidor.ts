/**
 * Montagem do servidor MCP do AutoIR: ferramentas por grupo, prompts e recursos.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  abrirPastaAutorizada,
  LIMITE_PADRAO_BYTES,
  type OpcoesPasta,
  type PastaAutorizada,
} from "./arquivos/index.js";
import { criarRegistroFerramentas } from "./ferramentas/registrador.js";
import { GRUPOS } from "./ferramentas/registro.js";
import type { ContextoFerramentas, GrupoFerramentas } from "./ferramentas/tipos.js";
import { registrarPrompts } from "./prompts.js";
import { registrarRecursos } from "./recursos.js";

export const NOME_SERVIDOR = "autoir";
export const VERSAO_SERVIDOR = "0.1.0";

/** Maior quantidade de elementos (itens de lista e campos) aceita em `tools/call`. */
export const MAX_ELEMENTOS_ENTRADA = 50_000;

// Mensagens de validação do zod em português, também nas respostas do protocolo.
z.config(z.locales.pt());

export interface OpcoesServidor {
  /** Única pasta que o servidor pode ler e gravar. Sem ela, as ferramentas de arquivo somem. */
  readonly diretorioAutorizado?: string;
  /** Desliga as ferramentas que gravam arquivos. */
  readonly somenteLeitura?: boolean;
  /** Relógio usado em datas padrão e no carimbo dos backups. */
  readonly relogio?: () => Date;
  /** Tamanho máximo de arquivo lido ou gravado (bytes). Padrão: 20 MB. */
  readonly limiteBytes?: number;
  /** Cópias de segurança mantidas por arquivo. Padrão: 10. */
  readonly maxBackups?: number;
  /** Grupos de ferramentas a registrar. Padrão: todos (`GRUPOS`). */
  readonly grupos?: readonly GrupoFerramentas[];
  /** Observa falhas das ferramentas (recebe o nome da ferramenta e o erro; não registre conteúdo). */
  readonly registrarErro?: (ferramenta: string, erro: unknown) => void;
}

/** Pasta aberta na primeira utilização, para manter `createServer` síncrono. */
function pastaSobDemanda(diretorio: string, opcoes: OpcoesPasta): PastaAutorizada {
  let aberta: Promise<PastaAutorizada> | undefined;
  const obter = () => {
    aberta ??= abrirPastaAutorizada(diretorio, opcoes);
    return aberta;
  };
  return {
    get raiz() {
      return diretorio;
    },
    limiteBytes: opcoes.limiteBytes ?? LIMITE_PADRAO_BYTES,
    ler: async (nome, ext) => (await obter()).ler(nome, ext),
    escrever: async (nome, dados, ext, ganchos) =>
      (await obter()).escrever(nome, dados, ext, ganchos),
    listar: async (ext) => (await obter()).listar(ext),
    remover: async (nome, ext) => (await obter()).remover(nome, ext),
    listarCopias: async () => (await obter()).listarCopias(),
    restaurarCopia: async (copia, destino, ext) =>
      (await obter()).restaurarCopia(copia, destino, ext),
  };
}

const INSTRUCOES =
  "AutoIR roda localmente e apoia o preenchimento da declaração do IRPF (exercício 2026). " +
  "Não é serviço oficial da Receita Federal: confira tudo e transmita pelo programa oficial. " +
  "Arquivos só podem ser lidos e gravados dentro da pasta autorizada, por nome relativo. " +
  'Valores monetários de entrada: texto em reais ("1.234,56") ou número inteiro em centavos. ' +
  "Leia o recurso autoir://aviso-legal antes de começar.";

/**
 * Cria o servidor MCP do AutoIR com ferramentas, prompts e recursos registrados.
 * Não abre transporte: quem chama decide (stdio no CLI, memória nos testes).
 */
export function createServer(opcoes: OpcoesServidor = {}): McpServer {
  const server = new McpServer(
    { name: NOME_SERVIDOR, version: VERSAO_SERVIDOR },
    { instructions: INSTRUCOES, maxToolInputElements: MAX_ELEMENTOS_ENTRADA },
  );
  const relogio = opcoes.relogio ?? (() => new Date());
  const pasta =
    opcoes.diretorioAutorizado === undefined
      ? undefined
      : pastaSobDemanda(opcoes.diretorioAutorizado, {
          relogio,
          ...(opcoes.limiteBytes === undefined ? {} : { limiteBytes: opcoes.limiteBytes }),
          ...(opcoes.maxBackups === undefined ? {} : { maxBackups: opcoes.maxBackups }),
        });
  const ctx: ContextoFerramentas = {
    pasta,
    somenteLeitura: opcoes.somenteLeitura ?? false,
    relogio,
    ...(opcoes.registrarErro ? { registrarErro: opcoes.registrarErro } : {}),
  };
  const nomes: string[] = [];
  const registro = criarRegistroFerramentas(server, ctx, nomes);
  for (const grupo of opcoes.grupos ?? GRUPOS) {
    if (grupo.exigePasta && !pasta) continue;
    grupo.registrar(registro);
  }
  registrarPrompts(server);
  registrarRecursos(server);
  return server;
}
