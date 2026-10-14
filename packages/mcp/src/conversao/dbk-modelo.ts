/**
 * Conversão entre os registros do arquivo da declaração (DBK/DEC) e o modelo tipado do core.
 *
 * Cobertura atual (exercício 2026):
 *
 * | Ficha do modelo  | Registros          |
 * | ---------------- | ------------------ |
 * | identificacao    | 16 (e campos do IR) |
 * | dependentes      | 25                 |
 * | rendimentosPJ    | 21 (titular), 32 (dependentes) |
 * | pagamentos       | 26                 |
 * | bens             | 27                 |
 * | dividas          | 28                 |
 *
 * Ainda NÃO convertidos (ficam como estão no arquivo base e são listados em
 * `tiposNaoConvertidos`): alimentandos (35), rendimentos de PF e exterior (22, 49), isentos e
 * exclusivos (23, 24, 83 a 99), imposto pago, doações (38 a 43, 76), usufruto e partilha de bens
 * (36, 37, 59), espólio, saída definitiva, renda variável, atividade rural, ganhos de capital e
 * resumo (17, 18). Campos do modelo sem lugar no leiaute também ficam de fora e geram aviso:
 * `reciboExercicioAnterior` (o campo do registro 16 tem 10 posições e o recibo 12), credor
 * estruturado da dívida (`niCredor`) e a perda negativa de aplicação no exterior.
 *
 * A gravação parte de um arquivo base (o DBK aberto) sempre que houver um: substitui só os
 * registros cobertos, preserva os demais na ordem do leiaute e recalcula os controles (CRC de
 * cada linha, contagens do T9 e hash do header). Sem base, monta um arquivo novo mínimo.
 */
import {
  CODIGO_RECEITANET,
  criarRegistro,
  type Declaracao,
  LEIAUTE_2026,
  type Leiaute,
  type Registro,
  recalcularControles,
  TIPOS_RECIBO,
  type TipoDeclaracao,
  tipoDoLeiaute,
  type ValorCampo,
  zDeclaracao,
} from "@autoir/core";
import { EntradaInvalidaError } from "../erros.js";

/** Tipos de registro lidos e gravados por este módulo. */
export const TIPOS_CONVERTIDOS: ReadonlySet<string> = new Set([
  "16",
  "21",
  "25",
  "26",
  "27",
  "28",
  "32",
]);
/** Tipos de controle que não representam ficha. */
const TIPOS_CONTROLE: ReadonlySet<string> = new Set(["IR", "T9"]);
/** Fichas do modelo preenchidas pela conversão. */
export const FICHAS_CONVERTIDAS = [
  "identificacao",
  "dependentes",
  "rendimentosPJ",
  "pagamentos",
  "bens",
  "dividas",
] as const;

type Campos = Record<string, ValorCampo>;
type Objeto = Record<string, unknown>;

// ---------------------------------------------------------------- leitura de campos

function texto(r: Registro | undefined, chave: string): string {
  const v = r?.campos[chave];
  if (v === null || v === undefined) return "";
  return typeof v === "bigint" ? v.toString() : v.trim();
}

function numero(r: Registro | undefined, chave: string): bigint {
  const v = r?.campos[chave];
  if (typeof v === "bigint") return v;
  if (typeof v === "string" && /^\d+$/.test(v.trim())) return BigInt(v.trim());
  return 0n;
}

function opcional(v: string): string | undefined {
  return v === "" ? undefined : v;
}

function digitos(v: string, tamanhos: readonly number[]): string | undefined {
  const d = v.replace(/\D/g, "");
  return tamanhos.includes(d.length) ? d : undefined;
}

/** "15031985" vira "1985-03-15"; zeros, branco ou data inválida viram `undefined`. */
function isoDeDdmmaaaa(v: string): string | undefined {
  const m = /^(\d{2})(\d{2})(\d{4})$/.exec(v);
  if (!m || v === "00000000") return undefined;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function ddmmaaaaDeIso(v: string | undefined): string | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? `${m[3]}${m[2]}${m[1]}` : null;
}

function semIndefinidos(o: Objeto): Objeto {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));
}

// ---------------------------------------------------------------- DBK para modelo

export interface ResultadoLeitura {
  readonly exercicio: number;
  /** Declaração no formato de entrada de `zDeclaracao` (valores em `bigint`). */
  readonly declaracao: Objeto;
  readonly contagemPorTipo: Readonly<Record<string, number>>;
  /** Tipos de registro presentes no arquivo e que a conversão ainda não lê. */
  readonly tiposNaoConvertidos: readonly string[];
  readonly avisos: readonly string[];
}

const TIPO_DECLARACAO: Readonly<Record<string, TipoDeclaracao>> = {
  A: "ajusteAnual",
  S: "saidaDefinitiva",
  E: "finalEspolio",
};

function telefone(ddd: string, num: string): Objeto | undefined {
  const d = ddd.replace(/\D/g, "").slice(-2);
  const n = num.replace(/\D/g, "");
  return d.length === 2 && /^\d{8,9}$/.test(n) ? { ddd: d, numero: n } : undefined;
}

function lerIdentificacao(r16: Registro | undefined, ir: Registro | undefined): Objeto {
  const pais = texto(r16, "CD_PAIS") || "105";
  const comum = {
    logradouro: texto(r16, "NM_LOGRA"),
    numero: texto(r16, "NR_NUMERO"),
    complemento: opcional(texto(r16, "NM_COMPLEM")),
    email: opcional(texto(r16, "NM_EMAIL")),
  };
  const endereco =
    pais === "105"
      ? {
          local: "brasil",
          ...comum,
          tipoLogradouro: texto(r16, "TIP_LOGRA"),
          bairro: texto(r16, "NM_BAIRRO"),
          uf: texto(r16, "SG_UF"),
          municipio: numero(r16, "CD_MUNICIP").toString().padStart(4, "0"),
          cep: texto(r16, "NR_CEP").replace(/\D/g, ""),
          telefone: telefone(texto(r16, "NR_DDD_TELEFONE"), texto(r16, "NR_TELEFONE")),
          celular: telefone(texto(r16, "NR_DDD_CELULAR"), texto(r16, "NR_CELULAR")),
        }
      : {
          local: "exterior",
          ...comum,
          cpfProcurador: digitos(texto(r16, "NR_CPF_PROCURADOR"), [11]),
          bairro: opcional(texto(r16, "NM_BAIRRO")),
          pais,
          codigoExterior: opcional(texto(r16, "CD_EX")),
          cidade: texto(r16, "NM_MUNICIP"),
          codigoPostal: opcional(texto(r16, "NR_CEP")),
          telefone: digitos(texto(r16, "NR_DDD_TELEFONE") + texto(r16, "NR_TELEFONE"), [
            ...Array.from({ length: 15 }, (_, i) => i + 1),
          ]),
        };
  const recibo = texto(r16, "NR_CONTROLE_ORIGINAL");
  const prejuizo = numero(r16, "VR_PREJUIZO_ANO_ANTERIOR_LEI_14754");
  const raca = r16?.campos.IN_RACA_COR;
  return semIndefinidos({
    cpf: texto(r16, "NR_CPF") || texto(ir, "NR_CPF"),
    nome: texto(r16, "NM_NOME") || texto(ir, "NM_NOME"),
    dataNascimento: isoDeDdmmaaaa(texto(r16, "DT_NASCIM")) ?? isoDeDdmmaaaa(texto(ir, "DT_NASCIM")),
    tipoDeclaracao: semIndefinidos({
      tipo: TIPO_DECLARACAO[texto(r16, "IN_TIPODECLARACAO")] ?? "ajusteAnual",
      retificadora: texto(r16, "IN_RETIFICADORA") === "S",
      reciboRetificada: /^\d{12}$/.test(recibo) ? recibo : undefined,
    }),
    doencaGraveOuDeficiencia: texto(r16, "IN_DOENCA_DEFICIENCIA") === "S",
    racaCor: typeof raca === "bigint" ? raca.toString() : "0",
    alteracaoCadastral: texto(r16, "IN_ENDERECO") === "S",
    conjuge: semIndefinidos({
      possui: texto(r16, "IN_CONJUGE") === "S",
      cpf: digitos(texto(r16, "NR_CPF_CONJUGE"), [11]),
    }),
    retornoAoPais: semIndefinidos({
      retornou: texto(r16, "IN_RETORNO_PAIS") === "1",
      data: isoDeDdmmaaaa(texto(r16, "DT_RETORNO_PAIS")),
    }),
    endereco: semIndefinidos(endereco),
    ocupacao: semIndefinidos({
      natureza: texto(r16, "CD_NATUR"),
      ocupacaoPrincipal: opcional(texto(r16, "CD_OCUP")),
      registroProfissional: opcional(texto(r16, "NR_REGISTRO_PROFISSIONAL")),
    }),
    nitPisPasep: digitos(texto(r16, "NR_NITPISPASEP"), [11]),
    processoAtualizacaoBemLei14973: opcional(texto(r16, "NR_PROCESSO_ATUALIZACAO_BEM")),
    prejuizoAnteriorLei14754: prejuizo > 0n ? prejuizo : undefined,
  });
}

function lerRendimentoPJ(r: Registro): Objeto {
  const dependente = r.tipo === "32";
  return semIndefinidos({
    beneficiario: dependente
      ? { tipo: "dependente", cpf: texto(r, "CPF_BENEF") }
      : { tipo: "titular" },
    fonte: { ni: texto(r, "NR_PAGADOR").replace(/\D/g, ""), nome: texto(r, "NM_PAGADOR") },
    rendimentos: numero(r, "VR_RENDTO"),
    contribuicaoPrevidenciaria: numero(r, "VR_CONTRIB"),
    impostoRetido: numero(r, "VR_IMPOSTO"),
    decimoTerceiro: numero(r, "VR_DECTERC"),
    impostoRetidoDecimoTerceiro: numero(r, "VR_IRRF13SALARIO"),
    dataComunicacaoSaida: isoDeDdmmaaaa(texto(r, "DT_COMUNICACAO_SAIDA")),
  });
}

function lerDependente(r: Registro): Objeto {
  const raca = r.campos.IN_RACA_COR;
  const saida = texto(r, "IN_SAIDA");
  return semIndefinidos({
    codigo: texto(r, "CD_DEPEND").padStart(2, "0"),
    nome: texto(r, "NM_DEPEND"),
    cpf: texto(r, "NI_DEPEND"),
    dataNascimento: isoDeDdmmaaaa(texto(r, "DT_NASCIM")),
    racaCor: typeof raca === "bigint" ? raca.toString() : undefined,
    moraComTitular: texto(r, "IN_ENDERECO_TITULAR") !== "0",
    celular: telefone(texto(r, "NR_DDD_CELULAR"), texto(r, "NR_CELULAR")),
    email: opcional(texto(r, "NM_EMAIL")),
    nitPisPasep: digitos(texto(r, "NR_NITPISPASEP"), [11]),
    saiuDoPaisComDeclarante: saida === "" ? undefined : saida === "1",
  });
}

function lerPagamento(
  r: Registro,
  cpfDependente: ReadonlyMap<bigint, string>,
  cpfAlimentando: ReadonlyMap<bigint, string>,
  avisos: string[],
  i: number,
): Objeto {
  const tipo = texto(r, "IN_TIPO_PGTO");
  const chave = numero(r, "NR_CHAVE_DEPEND");
  let realizadoCom: Objeto = { tipo: "titular" };
  if (tipo === "D" || tipo === "A") {
    const cpf = (tipo === "D" ? cpfDependente : cpfAlimentando).get(chave);
    if (cpf) realizadoCom = { tipo: tipo === "D" ? "dependente" : "alimentando", cpf };
    else avisos.push(`Pagamento ${i + 1}: pessoa vinculada (chave ${chave}) não encontrada.`);
  }
  const pais = numero(r, "CD_PAIS");
  return semIndefinidos({
    codigo: numero(r, "CD_PAGTO").toString().padStart(2, "0"),
    realizadoCom,
    niBeneficiario: digitos(texto(r, "NR_BENEF"), [11, 14]),
    nomeBeneficiario: texto(r, "NM_BENEF"),
    nitEmpregadoDomestico: digitos(texto(r, "NR_NIT"), [11]),
    valorPago: numero(r, "VR_PAGTO"),
    parcelaNaoDedutivel: numero(r, "VR_REDUC"),
    contribuicaoPatrocinador: numero(r, "VR_CONTRIB_PATR"),
    descricao: opcional(texto(r, "NM_DESCRICAO")),
    pais: pais > 0n ? pais.toString().padStart(3, "0") : undefined,
  });
}

function indicador(r: Registro, chave: string): boolean {
  return texto(r, chave) === "1" || texto(r, chave) === "S";
}

function lerBem(r: Registro): Objeto {
  const pais = numero(r, "CD_PAIS");
  const area = numero(r, "AREA");
  const unidade = texto(r, "NM_UNID");
  const regImovel = texto(r, "NM_IND_REG_IMOV");
  const imovel = semIndefinidos({
    logradouro: opcional(texto(r, "NM_LOGRA")),
    numero: opcional(texto(r, "NR_NUMERO")),
    complemento: opcional(texto(r, "NM_COMPLEM")),
    bairro: opcional(texto(r, "NM_BAIRRO")),
    cep: digitos(texto(r, "NR_CEP"), [8]),
    uf: opcional(texto(r, "SG_UF")),
    municipio:
      numero(r, "CD_MUNICIP") > 0n
        ? numero(r, "CD_MUNICIP").toString().padStart(4, "0")
        : undefined,
    areaTotalCentesimos: area > 0n ? Number(area) * 10 : undefined,
    unidade: unidade === "0" ? "m2" : unidade === "1" ? "ha" : undefined,
    registradoEmCartorio: regImovel === "1" ? true : regImovel === "0" ? false : undefined,
    matricula: opcional(texto(r, "MATRIC_IMOV")),
    nomeCartorio: opcional(texto(r, "NM_CARTORIO")),
    iptu: opcional(texto(r, "NR_IPTU")),
    cib: opcional(texto(r, "NR_CIB")),
    ceiCno:
      numero(r, "NR_CEI_CNO") > 0n
        ? numero(r, "NR_CEI_CNO").toString().padStart(12, "0")
        : undefined,
  });
  const banco = numero(r, "NR_BANCO");
  const contaNum = texto(r, "NR_CONTA").replace(/\D/g, "");
  const aplicacao = numero(r, "VR_LUCRO_PREJUIZO_APLICACAO_FINANCEIRA");
  const impAplicacao = numero(r, "VR_IMPOSTO_PAGO_EXTERIOR_APLICACAO_FINANCEIRA");
  const lucros = numero(r, "VR_RECEBIDO_LUCROS_DIVIDENDOS");
  const impLucros = numero(r, "VR_IMPOSTO_PAGO_EXTERIOR_LUCROS_DIVIDENDOS");
  const chave = numero(r, "NR_CHAVE_BEM");
  const custodiante = texto(r, "IN_CUSTODIANTE");
  return semIndefinidos({
    chave: chave > 0n ? Number(chave) : undefined,
    grupo: texto(r, "CD_GRUPO_BEM").padStart(2, "0"),
    codigo: numero(r, "CD_BEM").toString().padStart(2, "0"),
    pertenceA:
      texto(r, "IN_TIPO_BENEFIC") === "D"
        ? { tipo: "dependente", cpf: texto(r, "NR_CPF_BENEFIC") }
        : { tipo: "titular" },
    pais: pais > 0n ? pais.toString().padStart(3, "0") : "105",
    discriminacao: texto(r, "TX_BEM"),
    situacaoAnterior: numero(r, "VR_ANTER"),
    situacaoAtual: numero(r, "VR_ATUAL"),
    dataAquisicao: isoDeDdmmaaaa(texto(r, "DT_AQUISICAO")),
    ni: digitos(texto(r, "NM_CPFCNPJ"), [11, 14]),
    imovel: Object.keys(imovel).length > 0 ? imovel : undefined,
    renavam: opcional(texto(r, "NR_RENAVAN")),
    registroAviacaoCivil: opcional(texto(r, "NR_DEP_AVIACAO_CIVIL")),
    registroCapitaniaPortos: opcional(texto(r, "NR_CAPITANIA_PORTOS")),
    conta:
      banco > 0n && contaNum !== ""
        ? semIndefinidos({
            banco: banco.toString().padStart(3, "0"),
            agencia: numero(r, "NR_AGENCIA").toString(),
            conta: contaNum,
            dv: opcional(texto(r, "NR_DV_CONTA")),
            contaPagamento: indicador(r, "IN_CONTA_PAGAMENTO"),
          })
        : undefined,
    negociadoEmBolsa: indicador(r, "IN_BOLSA"),
    codigoNegociacao: opcional(texto(r, "NR_COD_NEGOCIACAO_BOLSA")),
    custodiante: custodiante === "" ? undefined : custodiante === "1",
    codigoAltcoin: opcional(texto(r, "COD_ALTCOIN")),
    codigoStablecoin: opcional(texto(r, "COD_STABLECOIN")),
    aplicacaoFinanceiraExterior:
      aplicacao > 0n || impAplicacao > 0n
        ? { rendimentoOuPerda: aplicacao, impostoPagoExterior: impAplicacao }
        : undefined,
    lucrosDividendosExterior:
      lucros > 0n || impLucros > 0n ? { valorRecebido: lucros, impostoPago: impLucros } : undefined,
    usufruto: indicador(r, "IN_BEM_USUFRUTO"),
    atualizadoLei14973: indicador(r, "IN_PROCESSO_ATUALIZACAO_BEM"),
    bemAInventariar: indicador(r, "IN_BEM_INVENTARIAR"),
  });
}

function lerDivida(r: Registro): Objeto {
  return {
    codigo: numero(r, "CD_DIV").toString().padStart(2, "0"),
    discriminacao: texto(r, "TX_DIV"),
    situacaoAnterior: numero(r, "VR_ANTER"),
    situacaoAtual: numero(r, "VR_ATUAL"),
    valorPago: numero(r, "VR_PGTO_ANUAL"),
  };
}

/** Converte os registros lidos de um DBK/DEC nas fichas cobertas do modelo. */
export function registrosParaModelo(
  registros: readonly Registro[],
  exercicio: number,
): ResultadoLeitura {
  const contagem: Record<string, number> = {};
  for (const r of registros) contagem[r.tipo] = (contagem[r.tipo] ?? 0) + 1;
  const doTipo = (t: string) => registros.filter((r) => r.tipo === t);
  const avisos: string[] = [];

  const dependentesRegs = doTipo("25");
  const cpfDependente = new Map(
    dependentesRegs.map((r) => [numero(r, "NR_CHAVE"), texto(r, "NI_DEPEND")]),
  );
  const cpfAlimentando = new Map(
    doTipo("35").map((r) => [numero(r, "NR_CHAVE"), texto(r, "NI_ALIMENTANDO")]),
  );

  const declaracao: Objeto = {
    exercicio,
    identificacao: lerIdentificacao(doTipo("16")[0], doTipo("IR")[0]),
    dependentes: dependentesRegs.map(lerDependente),
    rendimentosPJ: registros.filter((r) => r.tipo === "21" || r.tipo === "32").map(lerRendimentoPJ),
    pagamentos: doTipo("26").map((r, i) =>
      lerPagamento(r, cpfDependente, cpfAlimentando, avisos, i),
    ),
    bens: doTipo("27").map(lerBem),
    dividas: doTipo("28").map(lerDivida),
  };
  const tiposNaoConvertidos = Object.keys(contagem)
    .filter((t) => !TIPOS_CONVERTIDOS.has(t) && !TIPOS_CONTROLE.has(t) && !TIPOS_RECIBO.has(t))
    .sort();
  if (tiposNaoConvertidos.length > 0) {
    avisos.push(
      `Registros ainda não convertidos para o modelo (preservados na gravação): ${tiposNaoConvertidos.join(", ")}.`,
    );
  }
  return { exercicio, declaracao, contagemPorTipo: contagem, tiposNaoConvertidos, avisos };
}

// ---------------------------------------------------------------- validação do modelo

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

// ---------------------------------------------------------------- modelo para DBK

/** Atribui um valor lógico respeitando o formato do campo no leiaute. */
function atribuir(
  leiaute: Leiaute,
  campos: Campos,
  tipo: string,
  chave: string,
  valor: string | bigint | boolean | null | undefined,
): void {
  const campo = tipoDoLeiaute(leiaute, tipo)?.campos.find((c) => c.chave === chave);
  if (!campo) return;
  let v: ValorCampo;
  if (valor === null) {
    // null grava o campo em branco (espaços), como o programa faz em opcionais numéricos.
    v = campo.formato === "N" ? null : "";
  } else if (valor === undefined) {
    v = campo.formato === "N" ? (campo.data ? null : 0n) : "";
  } else if (campo.formato === "N" && campo.data === undefined) {
    if (typeof valor === "bigint") v = valor < 0n ? 0n : valor;
    else if (typeof valor === "boolean") v = valor ? 1n : 0n;
    else {
      const d = valor.replace(/\D/g, "");
      v = d === "" ? 0n : BigInt(d);
    }
  } else {
    v = typeof valor === "boolean" ? (valor ? "S" : "N") : valor.toString();
    if (campo.formato !== "N" && v.length > campo.tamanho) v = v.slice(0, campo.tamanho);
  }
  campos[chave] = v;
}

function novoRegistro(
  leiaute: Leiaute,
  tipo: string,
  cpf: string,
  valores: Record<string, string | bigint | boolean | null | undefined>,
): Registro {
  const campos: Campos = { ...criarRegistro(leiaute, tipo).campos };
  atribuir(leiaute, campos, tipo, "NR_CPF", cpf);
  for (const [k, v] of Object.entries(valores)) atribuir(leiaute, campos, tipo, k, v);
  return { tipo, campos };
}

function camposIdentificacao(
  id: Declaracao["identificacao"],
): Record<string, string | bigint | null | undefined> {
  const e = id.endereco;
  const comum = {
    NR_CPF: id.cpf,
    NM_NOME: id.nome,
    DT_NASCIM: ddmmaaaaDeIso(id.dataNascimento),
    IN_TIPODECLARACAO: { ajusteAnual: "A", saidaDefinitiva: "S", finalEspolio: "E" }[
      id.tipoDeclaracao.tipo
    ],
    IN_RETIFICADORA: id.tipoDeclaracao.retificadora ? "S" : "N",
    NR_CONTROLE_ORIGINAL: id.tipoDeclaracao.reciboRetificada ?? "",
    IN_DOENCA_DEFICIENCIA: id.doencaGraveOuDeficiencia ? "S" : "N",
    IN_RACA_COR: BigInt(id.racaCor),
    IN_ENDERECO: id.alteracaoCadastral ? "S" : "N",
    IN_CONJUGE: id.conjuge.possui ? "S" : "N",
    NR_CPF_CONJUGE: id.conjuge.cpf ?? "",
    IN_RETORNO_PAIS: id.retornoAoPais.retornou ? "1" : "0",
    DT_RETORNO_PAIS: ddmmaaaaDeIso(id.retornoAoPais.data) ?? "",
    CD_NATUR: id.ocupacao.natureza,
    CD_OCUP: id.ocupacao.ocupacaoPrincipal ?? "",
    NR_REGISTRO_PROFISSIONAL: id.ocupacao.registroProfissional ?? "",
    NR_NITPISPASEP: id.nitPisPasep ?? "",
    NR_PROCESSO_ATUALIZACAO_BEM: id.processoAtualizacaoBemLei14973 ?? "",
    VR_PREJUIZO_ANO_ANTERIOR_LEI_14754: id.prejuizoAnteriorLei14754 ?? 0n,
    NM_LOGRA: e.logradouro,
    NR_NUMERO: e.numero,
    NM_COMPLEM: e.complemento ?? "",
    NM_EMAIL: e.email ?? "",
  };
  if (e.local === "brasil") {
    return {
      ...comum,
      TIP_LOGRA: e.tipoLogradouro,
      NM_BAIRRO: e.bairro,
      SG_UF: e.uf,
      CD_MUNICIP: e.municipio,
      NR_CEP: e.cep,
      CD_PAIS: "105",
      CD_EX: "",
      NR_CPF_PROCURADOR: "",
      NR_DDD_TELEFONE: e.telefone?.ddd ?? "",
      NR_TELEFONE: e.telefone?.numero ?? "",
      NR_DDD_CELULAR: e.celular?.ddd ?? "",
      NR_CELULAR: e.celular?.numero ?? "",
    };
  }
  return {
    ...comum,
    TIP_LOGRA: "",
    NM_BAIRRO: e.bairro ?? "",
    SG_UF: "EX",
    CD_MUNICIP: null,
    NM_MUNICIP: e.cidade,
    NR_CEP: e.codigoPostal ?? "",
    CD_PAIS: e.pais,
    CD_EX: e.codigoExterior ?? "",
    NR_CPF_PROCURADOR: e.cpfProcurador ?? "",
    NR_DDD_TELEFONE: "",
    NR_TELEFONE: e.telefone ?? "",
  };
}

export interface ResultadoGravacao {
  readonly registros: Registro[];
  readonly avisos: string[];
}

/**
 * Gera os registros do arquivo a partir do modelo. Com `base`, preserva tudo o que não é
 * coberto pela conversão e reaproveita os campos do 16 e do header que o modelo não descreve.
 */
export function modeloParaRegistros(
  dec: Declaracao,
  base?: readonly Registro[],
  leiaute: Leiaute = LEIAUTE_2026,
): ResultadoGravacao {
  const avisos: string[] = [];
  const cpf = dec.identificacao.cpf;
  const id = dec.identificacao;

  if (id.tipoDeclaracao.reciboExercicioAnterior) {
    avisos.push("reciboExercicioAnterior não é gravado (o registro 16 só comporta 10 posições).");
  }

  // Registro 16: parte do existente e sobrescreve os campos que o modelo descreve.
  const base16 = base?.find((r) => r.tipo === "16");
  const campos16: Campos = { ...(base16?.campos ?? criarRegistro(leiaute, "16").campos) };
  for (const [k, v] of Object.entries(camposIdentificacao(id)))
    atribuir(leiaute, campos16, "16", k, v);
  const r16: Registro = { tipo: "16", campos: campos16 };

  // Header IR.
  const baseIr = base?.find((r) => r.tipo === "IR");
  const camposIr: Campos = { ...(baseIr?.campos ?? criarRegistro(leiaute, "IR").campos) };
  const valoresIr: Record<string, string | bigint | null> = {
    NR_CPF: cpf,
    NM_NOME: id.nome,
    DT_NASCIM: ddmmaaaaDeIso(id.dataNascimento),
    IN_RETIFICADORA: id.tipoDeclaracao.retificadora ? "S" : "N",
    NR_CONJ: id.conjuge.cpf ?? "",
    CD_NATUR: id.ocupacao.natureza,
  };
  if (id.endereco.local === "brasil") {
    Object.assign(valoresIr, {
      SG_UF: id.endereco.uf,
      CD_MUNICIP: id.endereco.municipio,
      NR_CEP: id.endereco.cep,
    });
  }
  if (!baseIr) {
    Object.assign(valoresIr, {
      EXERCICIO: BigInt(leiaute.exercicio),
      ANO_BASE: BigInt(leiaute.exercicio - 1),
      CODIGO_RECNET: CODIGO_RECEITANET[id.tipoDeclaracao.tipo],
      TIPO_NI: 1n,
    });
  }
  for (const [k, v] of Object.entries(valoresIr)) atribuir(leiaute, camposIr, "IR", k, v);
  const ir: Registro = { tipo: "IR", campos: camposIr };

  // Dependentes (chave sequencial) e mapas de chave por CPF.
  const chaveDependente = new Map<string, bigint>();
  const r25 = dec.dependentes.map((d, i) => {
    const chave = BigInt(i + 1);
    chaveDependente.set(d.cpf, chave);
    return novoRegistro(leiaute, "25", cpf, {
      NR_CHAVE: chave,
      CD_DEPEND: d.codigo,
      NM_DEPEND: d.nome,
      DT_NASCIM: ddmmaaaaDeIso(d.dataNascimento),
      NI_DEPEND: d.cpf,
      IN_SAIDA:
        d.saiuDoPaisComDeclarante === undefined ? "" : d.saiuDoPaisComDeclarante ? "1" : "0",
      NR_NITPISPASEP: d.nitPisPasep ?? "",
      IN_ENDERECO_TITULAR: d.moraComTitular ? "1" : "0",
      NM_EMAIL: d.email ?? "",
      NR_DDD_CELULAR: d.celular?.ddd ?? "",
      NR_CELULAR: d.celular?.numero ?? "",
      IN_RACA_COR: d.racaCor === undefined ? null : BigInt(d.racaCor),
    });
  });
  const chaveAlimentando = new Map<string, bigint>(
    (base ?? [])
      .filter((r) => r.tipo === "35")
      .map((r) => [texto(r, "NI_ALIMENTANDO"), numero(r, "NR_CHAVE")]),
  );

  const rPJ = dec.rendimentosPJ.map((p) => {
    const dependente = p.beneficiario.tipo === "dependente";
    return novoRegistro(leiaute, dependente ? "32" : "21", cpf, {
      CPF_BENEF: p.beneficiario.tipo === "dependente" ? p.beneficiario.cpf : undefined,
      NR_PAGADOR: p.fonte.ni,
      NM_PAGADOR: p.fonte.nome,
      VR_RENDTO: p.rendimentos,
      VR_CONTRIB: p.contribuicaoPrevidenciaria,
      VR_DECTERC: p.decimoTerceiro,
      VR_IMPOSTO: p.impostoRetido,
      DT_COMUNICACAO_SAIDA: ddmmaaaaDeIso(p.dataComunicacaoSaida) ?? "",
      VR_IRRF13SALARIO: p.impostoRetidoDecimoTerceiro,
    });
  });

  const r26 = dec.pagamentos.map((p, i) => {
    let chave = 0n;
    if (p.realizadoCom.tipo !== "titular") {
      const mapa = p.realizadoCom.tipo === "dependente" ? chaveDependente : chaveAlimentando;
      const c = mapa.get(p.realizadoCom.cpf);
      if (c === undefined) {
        avisos.push(
          `Pagamento ${i + 1}: ${p.realizadoCom.tipo} não cadastrado na ficha correspondente; vínculo gravado sem chave.`,
        );
      } else chave = c;
    }
    const ni = p.niBeneficiario ?? "";
    return novoRegistro(leiaute, "26", cpf, {
      CD_PAGTO: p.codigo,
      NR_CHAVE_DEPEND: chave,
      NR_BENEF: ni,
      NM_BENEF: p.nomeBeneficiario,
      NR_NIT: p.nitEmpregadoDomestico ?? "",
      VR_PAGTO: p.valorPago,
      VR_REDUC: p.parcelaNaoDedutivel,
      VR_CONTRIB_PATR: p.contribuicaoPatrocinador,
      IN_TIPO_CPF_CNPJ: ni.length === 14 ? 2n : ni.length === 11 ? 1n : 0n,
      IN_TIPO_PGTO: { titular: "T", dependente: "D", alimentando: "A" }[p.realizadoCom.tipo],
      NM_DESCRICAO: p.descricao ?? "",
      CD_PAIS: p.pais ?? null,
    });
  });

  const r27 = dec.bens.map((b, i) => {
    const im = b.imovel;
    const exterior = b.pais !== "105";
    if (b.aplicacaoFinanceiraExterior && b.aplicacaoFinanceiraExterior.rendimentoOuPerda < 0n) {
      avisos.push(
        `Bem ${i + 1}: perda em aplicação no exterior não cabe no campo sem sinal; gravada como zero.`,
      );
    }
    if (b.proprietariosUsufrutuarios.length > 0 || b.partilha.length > 0) {
      avisos.push(
        `Bem ${i + 1}: usufrutuários e partilha (registros 36, 37 e 59) não são gravados pelo AutoIR.`,
      );
    }
    return novoRegistro(leiaute, "27", cpf, {
      CD_BEM: b.codigo,
      IN_EXTERIOR: exterior ? 1n : 0n,
      CD_PAIS: b.pais,
      TX_BEM: b.discriminacao,
      VR_ANTER: b.situacaoAnterior,
      VR_ATUAL: b.situacaoAtual,
      NM_LOGRA: im?.logradouro ?? "",
      NR_NUMERO: im?.numero ?? "",
      NM_COMPLEM: im?.complemento ?? "",
      NM_BAIRRO: im?.bairro ?? "",
      NR_CEP: im?.cep ?? "",
      SG_UF: im?.uf ?? "",
      CD_MUNICIP: im?.municipio ?? null,
      NM_IND_REG_IMOV:
        im?.registradoEmCartorio === undefined ? 2n : im.registradoEmCartorio ? 1n : 0n,
      MATRIC_IMOV: im?.matricula ?? "",
      AREA:
        im?.areaTotalCentesimos === undefined
          ? 0n
          : BigInt(Math.round(im.areaTotalCentesimos / 10)),
      NM_UNID: im?.unidade === undefined ? 2n : im.unidade === "m2" ? 0n : 1n,
      NM_CARTORIO: im?.nomeCartorio ?? "",
      NR_CHAVE_BEM: BigInt(b.chave ?? i + 1),
      DT_AQUISICAO: ddmmaaaaDeIso(b.dataAquisicao),
      NR_RENAVAN: b.renavam ?? "",
      NR_DEP_AVIACAO_CIVIL: b.registroAviacaoCivil ?? "",
      NR_CAPITANIA_PORTOS: b.registroCapitaniaPortos ?? "",
      NR_AGENCIA: b.conta?.agencia ?? null,
      NR_DV_CONTA: b.conta?.dv ?? "",
      NM_CPFCNPJ: b.ni ?? "",
      NR_IPTU: im?.iptu ?? "",
      NR_BANCO: b.conta?.banco ?? null,
      IN_TIPO_BENEFIC: b.pertenceA.tipo === "dependente" ? "D" : "T",
      NR_CPF_BENEFIC: b.pertenceA.tipo === "dependente" ? b.pertenceA.cpf : "",
      CD_GRUPO_BEM: b.grupo,
      IN_BEM_INVENTARIAR: b.bemAInventariar ? 1n : 0n,
      NR_CONTA: b.conta?.conta ?? "",
      NR_CIB: im?.cib ?? "",
      NR_CEI_CNO: im?.ceiCno ?? null,
      IN_BOLSA: b.negociadoEmBolsa ? 1n : 0n,
      NR_COD_NEGOCIACAO_BOLSA: b.codigoNegociacao ?? "",
      IN_CUSTODIANTE: b.custodiante === undefined ? null : b.custodiante ? 1n : 0n,
      COD_ALTCOIN: b.codigoAltcoin ?? "",
      COD_STABLECOIN: b.codigoStablecoin ?? "",
      VR_LUCRO_PREJUIZO_APLICACAO_FINANCEIRA:
        b.aplicacaoFinanceiraExterior?.rendimentoOuPerda ?? 0n,
      VR_IMPOSTO_PAGO_EXTERIOR_APLICACAO_FINANCEIRA:
        b.aplicacaoFinanceiraExterior?.impostoPagoExterior ?? 0n,
      VR_RECEBIDO_LUCROS_DIVIDENDOS: b.lucrosDividendosExterior?.valorRecebido ?? 0n,
      VR_IMPOSTO_PAGO_EXTERIOR_LUCROS_DIVIDENDOS: b.lucrosDividendosExterior?.impostoPago ?? 0n,
      IN_CONTA_PAGAMENTO: b.conta?.contaPagamento ? 1n : 0n,
      IN_PROCESSO_ATUALIZACAO_BEM: b.atualizadoLei14973 ? "1" : "0",
      IN_BEM_USUFRUTO: b.usufruto ? 1n : 0n,
    });
  });

  const r28 = dec.dividas.map((d) => {
    if (d.niCredor)
      avisos.push(
        "niCredor das dívidas não tem campo próprio no leiaute; mantenha-o na discriminação.",
      );
    return novoRegistro(leiaute, "28", cpf, {
      CD_DIV: d.codigo,
      TX_DIV: d.discriminacao,
      VR_ANTER: d.situacaoAnterior,
      VR_ATUAL: d.situacaoAtual,
      VR_PGTO_ANUAL: d.valorPago,
    });
  });

  const preservados = (base ?? []).filter((r) => !TIPOS_CONVERTIDOS.has(r.tipo) && r.tipo !== "IR");
  if (!preservados.some((r) => r.tipo === "T9")) preservados.push(criarRegistro(leiaute, "T9"));
  // Todo registro da declaração leva o CPF do titular.
  const ajustados = preservados.map((r) => {
    if (TIPOS_RECIBO.has(r.tipo) || !Object.hasOwn(r.campos, "NR_CPF")) return r;
    const campos: Campos = { ...r.campos };
    atribuir(leiaute, campos, r.tipo, "NR_CPF", cpf);
    return { tipo: r.tipo, campos };
  });
  if ((base ?? []).some((r) => ["36", "37", "59"].includes(r.tipo))) {
    avisos.push(
      "O arquivo base tem registros de usufruto/partilha (36, 37, 59) ligados aos bens; confira-os no programa oficial.",
    );
  }

  const ordem = new Map(leiaute.tipos.map((t, i) => [t.id, i]));
  const todos = [ir, r16, ...r25, ...rPJ, ...r26, ...r27, ...r28, ...ajustados];
  const ordenados = todos
    .map((r, i) => ({ r, i }))
    .sort((a, b) => (ordem.get(a.r.tipo) ?? 9999) - (ordem.get(b.r.tipo) ?? 9999) || a.i - b.i)
    .map((x) => x.r);
  avisos.push(
    "Totais do resumo (registros 17 e 18) e do header não são recalculados pelo AutoIR: abra o arquivo no programa oficial para recalcular antes de transmitir.",
  );
  return { registros: recalcularControles(ordenados, { leiaute }), avisos };
}
