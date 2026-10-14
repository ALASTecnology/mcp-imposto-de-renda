/**
 * Ponte entre as ferramentas MCP e a conversão do core (`@autoir/core`, `conversao/`).
 *
 * A conversão em si é pura e fica no core; aqui ficam só a validação com mensagem pensada para
 * o LLM (`interpretarDeclaracao`) e assinaturas compatíveis com as ferramentas existentes.
 */
import {
  type Declaracao,
  FICHAS,
  type Ficha,
  type GravacaoModelo,
  type LeituraModelo,
  modeloParaRegistros as modeloParaRegistrosCore,
  obterLeiaute,
  type Registro,
  registrosParaModelo as registrosParaModeloCore,
  tiposMapeados,
  zDeclaracao,
} from "@autoir/core";
import { EntradaInvalidaError } from "../erros.js";

/** Tipos de registro lidos e gravados a partir do modelo. */
export const TIPOS_CONVERTIDOS: ReadonlySet<string> = tiposMapeados();

/** Fichas do modelo preenchidas pela conversão (todas). */
export const FICHAS_CONVERTIDAS = Object.keys(FICHAS) as [Ficha, ...Ficha[]];

export interface ResultadoLeitura extends LeituraModelo {
  /** Mesmo que `tiposNaoMapeados` (nome mantido para as ferramentas). */
  readonly tiposNaoConvertidos: readonly string[];
}

/** Converte os registros lidos de um DBK/DEC no modelo. */
export function registrosParaModelo(
  registros: readonly Registro[],
  exercicio: number,
): ResultadoLeitura {
  const r = registrosParaModeloCore(registros, { leiaute: obterLeiaute(exercicio) });
  return { ...r, tiposNaoConvertidos: r.tiposNaoMapeados };
}

/**
 * Valida um objeto contra `zDeclaracao`. Em caso de erro, lista os caminhos e as mensagens do
 * schema (sem repetir os valores recebidos).
 */
export function interpretarDeclaracao(entrada: unknown): Declaracao {
  const r = zDeclaracao.safeParse(entrada);
  if (r.success) return r.data;
  const problemas = r.error.issues
    .slice(0, 20)
    .map((i) => `- ${i.path.join(".") || "(raiz)"}: ${i.message}`);
  const extra = r.error.issues.length > 20 ? `\n(e mais ${r.error.issues.length - 20})` : "";
  throw new EntradaInvalidaError(
    `A declaração não segue o modelo do AutoIR:\n${problemas.join("\n")}${extra}\n` +
      "Valores monetários do modelo são inteiros em centavos (número); datas em AAAA-MM-DD; CPF/CNPJ só com dígitos.",
  );
}

/** Gera os registros a partir do modelo; com `base`, preserva o que o modelo não descreve. */
export function modeloParaRegistros(dec: Declaracao, base?: readonly Registro[]): GravacaoModelo {
  return modeloParaRegistrosCore(dec, base ? { base } : {});
}
