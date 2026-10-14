/**
 * Apoio do grupo "edicao": validação de lançamentos recebidos do LLM contra os schemas do core.
 *
 * Os schemas do core têm transforms (centavos viram bigint), que o JSON Schema do MCP não
 * representa. Por isso as ferramentas recebem objetos livres e validam aqui dentro:
 * 1. `normalizar` percorre o schema do core junto com o valor, converte valores monetários em
 *    texto (reais, "1.234,56") ou número inteiro (centavos) e aponta campos desconhecidos;
 * 2. o schema do core valida a forma, e os problemas citam só o caminho do campo e a regra,
 *    nunca o valor recebido.
 */
import { z } from "zod";
import { EntradaInvalidaError } from "../erros.js";
import { DESCRICAO_VALOR, normalizarValor } from "../esquemas.js";

interface Def {
  readonly type: string;
  readonly [chave: string]: unknown;
}

const def = (s: unknown): Def => (s as { _zod: { def: Def } })._zod.def;

const EMBRULHOS = new Set(["optional", "default", "prefault", "nullable", "readonly", "catch"]);

/** Remove opcional, padrão e afins, devolvendo o schema de dentro. */
function desembrulhar(s: z.ZodType): z.ZodType {
  let atual = s;
  for (let i = 0; i < 10 && EMBRULHOS.has(def(atual).type); i++) {
    atual = def(atual).innerType as z.ZodType;
  }
  return atual;
}

function ehOpcional(s: z.ZodType): boolean {
  return EMBRULHOS.has(def(s).type);
}

/** Valor monetário do core: `union([bigint, number]).transform(...)`. */
function ehMonetario(s: z.ZodType): boolean {
  const d = def(s);
  if (d.type !== "pipe") return false;
  const entrada = def(d.in);
  return (
    entrada.type === "union" &&
    (entrada.options as z.ZodType[]).some((o) => def(o).type === "bigint")
  );
}

const ehObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function caminhoTexto(caminho: readonly (string | number)[]): string {
  return caminho.length === 0 ? "(raiz)" : caminho.join(".");
}

/** Opção de uma união discriminada que corresponde ao valor do discriminador. */
function opcaoDiscriminada(d: Def, valor: Record<string, unknown>): z.ZodType | undefined {
  const chave = d.discriminator as string | undefined;
  if (!chave || !(chave in valor)) return undefined;
  for (const opcao of d.options as z.ZodType[]) {
    const o = desembrulhar(opcao);
    if (def(o).type !== "object") continue;
    const campo = (def(o).shape as Record<string, z.ZodType>)[chave];
    if (!campo) continue;
    const c = def(desembrulhar(campo));
    const valores = (c.values as unknown[] | undefined) ?? [];
    if (valores.includes(valor[chave])) return o;
  }
  return undefined;
}

/**
 * Normaliza `valor` segundo `schema`: valores monetários em texto ou número viram bigint de
 * centavos. Campos desconhecidos são apontados em `problemas` só quando também aparecem em
 * `informado` (o que o usuário mandou), para não acusar sobras de uma versão anterior do item.
 */
export function normalizar(
  schema: z.ZodType,
  valor: unknown,
  problemas: string[],
  caminho: (string | number)[] = [],
  informado: unknown = valor,
): unknown {
  if (valor === undefined || valor === null) return valor;
  const s = desembrulhar(schema);
  if (ehMonetario(s)) {
    if (typeof valor === "string" || typeof valor === "number") {
      try {
        return BigInt(normalizarValor(valor));
      } catch {
        problemas.push(
          `- ${caminhoTexto(caminho)}: valor monetário inválido; use texto em reais ("1.234,56") ou número inteiro de centavos.`,
        );
        return undefined;
      }
    }
    return valor;
  }
  const d = def(s);
  if (d.type === "object" && ehObjeto(valor)) {
    const forma = d.shape as Record<string, z.ZodType>;
    const saida: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(valor)) {
      const sub = forma[k];
      if (!sub) {
        if (ehObjeto(informado) && k in informado) {
          problemas.push(
            `- ${caminhoTexto([...caminho, k])}: campo desconhecido (aceitos: ${Object.keys(forma).join(", ")}).`,
          );
        }
        continue;
      }
      const inf = ehObjeto(informado) ? informado[k] : undefined;
      saida[k] = normalizar(sub, v, problemas, [...caminho, k], inf);
    }
    return saida;
  }
  if (d.type === "array" && Array.isArray(valor)) {
    const inf = Array.isArray(informado) ? informado : [];
    return valor.map((v, i) =>
      normalizar(d.element as z.ZodType, v, problemas, [...caminho, i], inf[i]),
    );
  }
  if (d.type === "union" && ehObjeto(valor)) {
    const opcao = opcaoDiscriminada(d, valor);
    return opcao ? normalizar(opcao, valor, problemas, caminho, informado) : valor;
  }
  return valor;
}

/** Mensagem de um problema do zod sem o valor recebido. */
function mensagemProblema(i: z.core.$ZodIssue): string {
  if (i.code === "invalid_type") {
    return /received undefined/.test(i.message)
      ? "campo obrigatório não informado"
      : `tipo inválido (esperado ${i.expected})`;
  }
  if (i.code === "invalid_value") {
    return `use um destes valores: ${i.values.map((v) => JSON.stringify(v)).join(", ")}`;
  }
  if (i.code === "invalid_union") {
    const disc = (i as { discriminator?: string }).discriminator;
    return disc
      ? `informe '${disc}' com um dos valores aceitos`
      : "não corresponde a nenhuma das formas aceitas";
  }
  if (i.code === "too_small" && i.origin === "array")
    return `informe ao menos ${i.minimum} item(ns)`;
  if (i.code === "too_big" && i.origin === "array") return `no máximo ${i.maximum} item(ns)`;
  if (i.code === "too_small" && (i.origin === "number" || i.origin === "int")) {
    return `deve ser no mínimo ${i.minimum}`;
  }
  if (i.code === "too_big" && (i.origin === "number" || i.origin === "int")) {
    return `deve ser no máximo ${i.maximum}`;
  }
  if (i.code === "too_big" && i.origin === "string") return `máximo de ${i.maximum} caracteres`;
  if (i.code === "invalid_format") return "formato inválido";
  return i.message;
}

/**
 * Valida um lançamento contra o schema do core e devolve a forma de saída (centavos em bigint).
 * Lança `EntradaInvalidaError` com a lista de campos a corrigir.
 */
export function validarLancamento<T extends z.ZodType>(
  schema: T,
  bruto: unknown,
  rotulo: string,
  informado: unknown = bruto,
): z.output<T> {
  const problemas: string[] = [];
  const normalizado = normalizar(schema, bruto, problemas, [], informado);
  const r = schema.safeParse(normalizado);
  if (!r.success) {
    for (const i of r.error.issues.slice(0, 20)) {
      problemas.push(`- ${caminhoTexto(i.path as (string | number)[])}: ${mensagemProblema(i)}`);
    }
  }
  if (problemas.length > 0) {
    throw new EntradaInvalidaError(
      `${rotulo}: dados inválidos.\n${problemas.slice(0, 25).join("\n")}\n` +
        'Valores monetários: texto em reais ("1.234,56") ou número inteiro de centavos; datas AAAA-MM-DD; CPF/CNPJ só com dígitos.',
    );
  }
  return (r as { data: z.output<T> }).data;
}

/**
 * Mescla `parcial` sobre `base`: objetos são mesclados campo a campo, listas e valores simples
 * são substituídos e `null` remove o campo.
 */
export function mesclar(base: unknown, parcial: unknown): unknown {
  if (!ehObjeto(base) || !ehObjeto(parcial)) return parcial === null ? undefined : parcial;
  const saida: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(parcial)) {
    if (v === null) delete saida[k];
    else if (ehObjeto(v) && ehObjeto(saida[k])) saida[k] = mesclar(saida[k], v);
    else saida[k] = v;
  }
  return saida;
}

/** Descrição compacta dos campos de um schema, para o `describe` das entradas livres. */
export function descreverCampos(schema: z.ZodType, profundidade = 0): string {
  const s = desembrulhar(schema);
  if (ehMonetario(s)) return "valor";
  const d = def(s);
  switch (d.type) {
    case "string":
      return "texto";
    case "number":
    case "int":
      return "número";
    case "boolean":
      return "booleano";
    case "enum":
      return Object.keys(d.entries as Record<string, unknown>)
        .map((v) => JSON.stringify(v))
        .join("|");
    case "literal":
      return (d.values as unknown[]).map((v) => JSON.stringify(v)).join("|");
    case "array":
      return `[${descreverCampos(d.element as z.ZodType, profundidade + 1)}]`;
    case "object": {
      if (profundidade > 3) return "{...}";
      const forma = d.shape as Record<string, z.ZodType>;
      const campos = Object.entries(forma).map(
        ([k, v]) => `${k}${ehOpcional(v) ? "?" : ""}: ${descreverCampos(v, profundidade + 1)}`,
      );
      return `{ ${campos.join(", ")} }`;
    }
    case "union":
      return (d.options as z.ZodType[])
        .map((o) => descreverCampos(o, profundidade + 1))
        .join(" OU ");
    default:
      return "valor";
  }
}

/** Valor monetário bruto aceito nas entradas (normalizado dentro da ferramenta). */
export const zValorBruto = z
  .union([z.string().max(32), z.number().int()])
  .describe(DESCRICAO_VALOR);

/** Objeto livre de um lançamento, com a lista de campos aceitos na descrição. */
export function zObjetoLivre(schema: z.ZodType, prefixo: string) {
  return z
    .record(z.string(), z.unknown())
    .describe(
      `${prefixo} Campos (? = opcional; valor = ${DESCRICAO_VALOR}): ${descreverCampos(schema)}`,
    );
}

/** Beneficiário na entrada das ferramentas (validado depois pelo schema do core). */
export const zBeneficiarioEntrada = z
  .object({
    tipo: z.enum(["titular", "dependente"]),
    cpf: z.string().max(14).optional().describe("CPF do dependente (só dígitos)."),
  })
  .describe('A quem pertence: {"tipo":"titular"} ou {"tipo":"dependente","cpf":"..."}.');
