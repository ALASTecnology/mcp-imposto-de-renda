/**
 * Contextos de leitura e gravação compartilhados pelos mapeadores de ficha.
 *
 * Gravação: cada registro produzido a partir do modelo é "pareado" com um registro do mesmo tipo
 * do arquivo base (o DBK aberto), pelos campos de identidade informados pelo mapeador. Os campos
 * que o modelo descreve vêm do modelo; os demais (fillers, campos calculados e informações que o
 * modelo não guarda) vêm do par. Sem par, ficam com o padrão do leiaute. Assim abrir e regravar
 * um arquivo sem alterações devolve os mesmos bytes, e editar uma ficha não apaga o que o
 * AutoIR não conhece.
 */
import type { Registro, ValorCampo } from "../dbk/codec.js";
import { criarRegistro } from "../dbk/codec.js";
import type { Leiaute } from "../dbk/leiaute.js";
import { tipoDoLeiaute } from "../dbk/leiaute.js";
import type { Declaracao } from "../model/declaracao.js";
import { equivalentes, type Objeto, type Valores, valorDoCampo } from "./campos.js";

/** O que um mapeador recebe para ler os registros. */
export interface ContextoLeitura {
  readonly leiaute: Leiaute;
  /** CPF do titular (registro 16 ou header). */
  readonly cpfTitular: string;
  /** Registros de um tipo, na ordem do arquivo. */
  doTipo(tipo: string): readonly Registro[];
  /** CPF do dependente pela chave do registro 25. */
  cpfDependente(chave: bigint): string | undefined;
  /** CPF do alimentando pela chave do registro 35. */
  cpfAlimentando(chave: bigint): string | undefined;
  /** CPF/CNPJ do herdeiro pela chave do registro 58. */
  niHerdeiro(chave: bigint): string | undefined;
  aviso(mensagem: string): void;
}

/** O que um mapeador recebe para gravar registros. */
export interface ContextoGravacao {
  readonly leiaute: Leiaute;
  readonly cpfTitular: string;
  /** Registros do arquivo base de um tipo (vazio sem base). */
  baseDoTipo(tipo: string): readonly Registro[];
  /**
   * Acrescenta um registro com os valores do modelo. `identidade` lista os campos usados para
   * achar o par no arquivo base; sem ela, o par é o próximo registro do mesmo tipo.
   */
  adicionar(tipo: string, valores: Valores, identidade?: readonly string[]): Registro;
  chaveDependente(cpf: string): bigint | undefined;
  chaveAlimentando(cpf: string): bigint | undefined;
  chaveHerdeiro(ni: string): bigint | undefined;
  /** Saldo de imposto a pagar do Resumo (define se as quotas são gravadas). */
  readonly saldoAPagar: bigint;
  aviso(mensagem: string): void;
}

/** Converte um grupo de fichas do modelo em tipos de registro e vice-versa. */
export interface Mapeador {
  readonly nome: string;
  /** Tipos de registro que o mapeador lê e grava. */
  readonly tipos: readonly string[];
  /** Tipos de leiautes anteriores que só são lidos (gravados no tipo atual equivalente). */
  readonly tiposLegados?: readonly string[];
  ler(ctx: ContextoLeitura, saida: Objeto): void;
  gravar(ctx: ContextoGravacao, dec: Declaracao): void;
}

function agrupar(registros: readonly Registro[]): Map<string, Registro[]> {
  const m = new Map<string, Registro[]>();
  for (const r of registros) {
    const lista = m.get(r.tipo);
    if (lista) lista.push(r);
    else m.set(r.tipo, [r]);
  }
  return m;
}

export class LeituraRegistros implements ContextoLeitura {
  readonly avisos: string[] = [];
  readonly cpfTitular: string;
  private readonly porTipo: Map<string, Registro[]>;
  private readonly dependentes: Map<bigint, string>;
  private readonly alimentandos: Map<bigint, string>;
  private readonly herdeiros: Map<bigint, string>;

  constructor(
    readonly leiaute: Leiaute,
    registros: readonly Registro[],
  ) {
    this.porTipo = agrupar(registros);
    const r16 = this.doTipo("16")[0];
    const ir = this.doTipo("IR")[0];
    const cpf = r16?.campos.NR_CPF ?? ir?.campos.NR_CPF;
    this.cpfTitular = typeof cpf === "string" ? cpf.trim() : "";
    const mapa = (tipo: string, chave: string, valor: string) =>
      new Map(
        this.doTipo(tipo).map((r) => {
          const c = r.campos[chave];
          const v = r.campos[valor];
          return [typeof c === "bigint" ? c : 0n, typeof v === "string" ? v.trim() : ""] as const;
        }),
      );
    this.dependentes = mapa("25", "NR_CHAVE", "NI_DEPEND");
    this.alimentandos = mapa("35", "NR_CHAVE", "NI_ALIMENTANDO");
    this.herdeiros = mapa("58", "NR_CHAVE_HERDEIRO", "NR_CPF_CNPJ");
  }

  doTipo(tipo: string): readonly Registro[] {
    return this.porTipo.get(tipo) ?? [];
  }
  cpfDependente(chave: bigint): string | undefined {
    return this.dependentes.get(chave);
  }
  cpfAlimentando(chave: bigint): string | undefined {
    return this.alimentandos.get(chave);
  }
  niHerdeiro(chave: bigint): string | undefined {
    return this.herdeiros.get(chave);
  }
  aviso(mensagem: string): void {
    if (!this.avisos.includes(mensagem)) this.avisos.push(mensagem);
  }
}

export class GravacaoRegistros implements ContextoGravacao {
  readonly avisos: string[] = [];
  readonly produzidos: Registro[] = [];
  saldoAPagar = 0n;
  private readonly base: Map<string, Registro[]>;
  private readonly usados = new Set<Registro>();
  private readonly dependentes: Map<string, bigint>;
  private readonly alimentandos: Map<string, bigint>;
  private readonly herdeiros: Map<string, bigint>;

  constructor(
    readonly leiaute: Leiaute,
    readonly cpfTitular: string,
    dec: Declaracao,
    base: readonly Registro[] | undefined,
  ) {
    this.base = agrupar(base ?? []);
    const seq = (itens: readonly string[]) =>
      new Map(itens.map((ni, i) => [ni, BigInt(i + 1)] as const));
    this.dependentes = seq(dec.dependentes.map((d) => d.cpf));
    this.alimentandos = seq(dec.alimentandos.map((a) => a.cpf));
    this.herdeiros = seq(dec.herdeiros.map((h) => h.ni));
  }

  baseDoTipo(tipo: string): readonly Registro[] {
    return this.base.get(tipo) ?? [];
  }

  private parear(
    tipo: string,
    valores: Record<string, ValorCampo>,
    identidade: readonly string[] | undefined,
  ): Registro | undefined {
    const livres = this.baseDoTipo(tipo).filter((r) => !this.usados.has(r));
    const par =
      identidade === undefined
        ? livres[0]
        : livres.find((r) => identidade.every((k) => equivalentes(valores[k], r.campos[k])));
    if (par) this.usados.add(par);
    return par;
  }

  adicionar(tipo: string, valores: Valores, identidade?: readonly string[]): Registro {
    const t = tipoDoLeiaute(this.leiaute, tipo);
    if (!t)
      throw new Error(`Tipo de registro ${tipo} não existe no leiaute ${this.leiaute.exercicio}.`);
    const indice = new Map(t.campos.map((c) => [c.chave, c]));
    const proprios: Record<string, ValorCampo> = {};
    if (indice.has("NR_CPF") && !("NR_CPF" in valores)) {
      proprios.NR_CPF = this.cpfTitular;
    }
    for (const [chave, v] of Object.entries(valores)) {
      const campo = indice.get(chave);
      if (!campo) throw new Error(`Campo ${chave} não existe no registro ${tipo}.`);
      proprios[chave] = valorDoCampo(campo, v);
    }
    const par = this.parear(tipo, proprios, identidade);
    const campos: Record<string, ValorCampo> = {
      ...criarRegistro(this.leiaute, tipo).campos,
      ...(par?.campos ?? {}),
    };
    for (const [chave, v] of Object.entries(proprios)) {
      const anterior = par?.campos[chave];
      campos[chave] = par && equivalentes(v, anterior) ? (anterior ?? null) : v;
    }
    const registro: Registro = { tipo, campos };
    this.produzidos.push(registro);
    return registro;
  }

  chaveDependente(cpf: string): bigint | undefined {
    return this.dependentes.get(cpf);
  }
  chaveAlimentando(cpf: string): bigint | undefined {
    return this.alimentandos.get(cpf);
  }
  chaveHerdeiro(ni: string): bigint | undefined {
    return this.herdeiros.get(ni);
  }
  aviso(mensagem: string): void {
    if (!this.avisos.includes(mensagem)) this.avisos.push(mensagem);
  }
}
