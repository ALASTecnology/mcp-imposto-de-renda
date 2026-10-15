/**
 * Contrato dos grupos de ferramentas.
 *
 * Para adicionar ferramentas: crie um módulo que exporte um `GrupoFerramentas`, registre cada
 * ferramenta com `registro.ferramenta(...)` e inclua o grupo em `ferramentas/registro.ts`. O
 * `RegistroFerramentas` cuida do que é comum a todas: tratamento de erro padronizado, resposta em
 * texto mais `structuredContent`, e o modo somente leitura (ferramentas com `escreve: true` não
 * são registradas quando ele está ligado).
 */
import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import type { z } from "zod";
import type { PastaAutorizada } from "../arquivos/index.js";
import type { Json } from "../serializacao.js";

export type NomeGrupo =
  | "calculo"
  | "declaracao"
  | "fichas"
  | "edicao"
  | "ciclo"
  | "validacao"
  | "tabelas"
  | "arquivos"
  | "saidas"
  | "calculadoras"
  | "orientacao";

/** Uso de memória e versões do processo, lidos a cada chamada de `diagnosticar_servidor`. */
export interface AmbienteProcesso {
  readonly memoria: {
    readonly rss: number;
    readonly heapTotal: number;
    readonly heapUsed: number;
    readonly external: number;
  };
  readonly node: string;
  readonly plataforma: string;
  readonly arquitetura: string;
}

/** O que o servidor sabe de si: versão, perfil, grupos registrados e ambiente do processo. */
export interface InfoServidor {
  readonly versao: string;
  readonly perfil: string;
  /** Preenchida durante o registro: cada grupo com a quantidade de ferramentas registradas. */
  readonly grupos: readonly { readonly nome: NomeGrupo; readonly ferramentas: number }[];
  readonly ambiente: () => AmbienteProcesso;
}

/** O que as ferramentas recebem do servidor. */
export interface ContextoFerramentas {
  /** Pasta autorizada; `undefined` quando o servidor foi criado sem `diretorioAutorizado`. */
  readonly pasta: PastaAutorizada | undefined;
  readonly somenteLeitura: boolean;
  readonly relogio: () => Date;
  /** Recebe só o nome da ferramenta e a classe do erro (nunca conteúdo). */
  readonly registrarErro?: (ferramenta: string, erro: unknown) => void;
  /** Informações do próprio servidor; ausente fora de `createServer` (catálogo, testes). */
  readonly servidor?: InfoServidor;
}

/** Resultado de uma ferramenta: texto legível e dados estruturados (validados pelo outputSchema). */
export interface ResultadoFerramenta {
  readonly texto: string;
  readonly dados: { [chave: string]: Json };
}

export interface DefinicaoFerramenta<I extends z.ZodRawShape, O extends z.ZodRawShape> {
  readonly titulo: string;
  readonly descricao: string;
  readonly entrada: I;
  readonly saida: O;
  /** Grava no disco: recebe as anotações de escrita e some no modo somente leitura. */
  readonly escreve?: boolean;
  /**
   * Atalho de uma ficha que repete uma ferramenta genérica (por exemplo `editar_bem`, coberto por
   * `editar_lancamento`). Some nos perfis enxutos (ver `perfis.ts`).
   */
  readonly atalho?: boolean;
  /** Ajustes finos sobre as anotações padrão (leitura ou escrita). */
  readonly anotacoes?: Partial<ToolAnnotations>;
}

export type Executor<I extends z.ZodRawShape> = (
  args: z.output<z.ZodObject<I>>,
) => ResultadoFerramenta | Promise<ResultadoFerramenta>;

export interface RegistroFerramentas {
  readonly ctx: ContextoFerramentas;
  ferramenta<I extends z.ZodRawShape, O extends z.ZodRawShape>(
    nome: string,
    definicao: DefinicaoFerramenta<I, O>,
    executar: Executor<I>,
  ): void;
}

export interface GrupoFerramentas {
  readonly nome: NomeGrupo;
  readonly descricao: string;
  /** Grupo que só faz sentido com pasta autorizada (não é registrado sem ela). */
  readonly exigePasta?: boolean;
  registrar(registro: RegistroFerramentas): void;
}
