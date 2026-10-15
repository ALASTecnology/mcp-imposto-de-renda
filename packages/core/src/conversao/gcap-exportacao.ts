/**
 * Importação do arquivo que o GCAP 2025 grava em "Exportar para o IRPF2026"
 * (`<CPF>-DDMM-DDMM-GCAP-2025.DEC`): um zip com o XML do demonstrativo e um `config.properties`.
 * Este módulo recebe o XML (o zip é aberto por quem lê o arquivo, fora do core).
 *
 * O XML descreve as entidades do demonstrativo com os nomes de campo do programa (elementos e
 * atributos, valores formatados como na tela: "1.234,56", "DD/MM/AAAA"). A correspondência com o
 * modelo e com os valores que a importação transporta para a declaração (registros 60 a 76,
 * isentos 05, 06 e 07, exclusivos 02, 03 e 04) foi conferida com os pares de arquivo exportado
 * e DBK gravado pelo IRPF 2026 depois da importação, gerados com dados sintéticos pelo harness
 * de referência (`packages/core/test/fixtures/gcap/2026` e `fixtures/dbk/2026/gcap-*`),
 * inclusive bens adquiridos no exterior (com rendimentos em reais, em moeda estrangeira ou
 * ambos) e moeda estrangeira em espécie.
 *
 * Como no programa, a importação substitui o demonstrativo do mesmo CPF e período e refaz os
 * valores transportados a partir de todos os demonstrativos da declaração.
 */
import { type Declaracao, zDeclaracao } from "../model/declaracao.js";
import { type DemonstrativoGcap, zDemonstrativoGcap } from "../model/ganhos-capital.js";

/** Erro de leitura do arquivo exportado pelo GCAP. */
export class ExportacaoGcapInvalidaError extends Error {
  override readonly name = "ExportacaoGcapInvalidaError";
}

/** Elemento do XML: nome, atributos e filhos (o XML do GCAP não tem texto). */
interface Elemento {
  nome: string;
  atributos: Record<string, string>;
  filhos: Elemento[];
}

const ENTIDADES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };

function decodificar(v: string): string {
  return v.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === "#") {
      const n = e[1] === "x" || e[1] === "X" ? Number.parseInt(e.slice(2), 16) : Number(e.slice(1));
      return Number.isInteger(n) && n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m;
    }
    return ENTIDADES[e] ?? m;
  });
}

const NOME_INICIO = /[A-Za-z_]/;
const NOME_RESTO = /[\w.:-]/;
const ESPACO = /\s/;

function ehNomeInicio(c: string | undefined): boolean {
  return c !== undefined && NOME_INICIO.test(c);
}

function ehNomeResto(c: string | undefined): boolean {
  return c !== undefined && NOME_RESTO.test(c);
}

function ehEspaco(c: string | undefined): boolean {
  return c !== undefined && ESPACO.test(c);
}

/**
 * Leitor mínimo de XML só com elementos e atributos (o formato que o GCAP grava). Varre o texto
 * uma vez, sem expressões regulares sobre a entrada inteira, para que nenhum arquivo hostil
 * (aberturas repetidas de `<?`, `<!--` ou atributos sem fim) custe mais que tempo linear.
 */
function lerXml(xml: string): Elemento {
  const raiz: Elemento = { nome: "", atributos: {}, filhos: [] };
  const pilha: Elemento[] = [raiz];
  const malformado = (onde: number): never => {
    throw new ExportacaoGcapInvalidaError(`XML do GCAP malformado perto da posição ${onde}.`);
  };
  const lerNome = (inicio: number): number => {
    if (!ehNomeInicio(xml[inicio])) malformado(inicio);
    let k = inicio + 1;
    while (ehNomeResto(xml[k])) k++;
    return k;
  };
  const pularEspacos = (k: number): number => {
    let p = k;
    while (ehEspaco(xml[p])) p++;
    return p;
  };
  let i = 0;
  while (i < xml.length) {
    const lt = xml.indexOf("<", i);
    if (lt < 0) break;
    if (xml.startsWith("<?", lt)) {
      const fim = xml.indexOf("?>", lt + 2);
      if (fim < 0) malformado(lt);
      i = fim + 2;
      continue;
    }
    if (xml.startsWith("<!--", lt)) {
      const fim = xml.indexOf("-->", lt + 4);
      if (fim < 0) malformado(lt);
      i = fim + 3;
      continue;
    }
    const atual = pilha.at(-1) as Elemento;
    if (xml[lt + 1] === "/") {
      const fimNome = lerNome(lt + 2);
      const nome = xml.slice(lt + 2, fimNome);
      const k = pularEspacos(fimNome);
      if (xml[k] !== ">") malformado(k);
      if (pilha.length <= 1 || atual.nome !== nome) {
        throw new ExportacaoGcapInvalidaError(`XML do GCAP malformado perto de </${nome}>.`);
      }
      pilha.pop();
      i = k + 1;
      continue;
    }
    const fimNome = lerNome(lt + 1);
    const e: Elemento = { nome: xml.slice(lt + 1, fimNome), atributos: {}, filhos: [] };
    let k = fimNome;
    let fechado = false;
    for (;;) {
      const antes = k;
      k = pularEspacos(k);
      if (xml.startsWith("/>", k)) {
        fechado = true;
        k += 2;
        break;
      }
      if (xml[k] === ">") {
        k += 1;
        break;
      }
      if (k === antes) malformado(k);
      const fimAtributo = lerNome(k);
      const nomeAtributo = xml.slice(k, fimAtributo);
      k = pularEspacos(fimAtributo);
      if (xml[k] !== "=") malformado(k);
      k = pularEspacos(k + 1);
      const aspa = xml[k];
      if (aspa !== '"' && aspa !== "'") malformado(k);
      const fimValor = xml.indexOf(aspa as string, k + 1);
      if (fimValor < 0) malformado(k);
      e.atributos[nomeAtributo] = decodificar(xml.slice(k + 1, fimValor));
      k = fimValor + 1;
    }
    atual.filhos.push(e);
    if (!fechado) pilha.push(e);
    i = k;
  }
  const doc = raiz.filhos[0];
  if (!doc || pilha.length !== 1) throw new ExportacaoGcapInvalidaError("XML do GCAP incompleto.");
  return doc;
}

// ------------------------------------------------------------------ valores

type Objeto = Record<string, unknown> & {
  tipo: string;
  apuracao: ReturnType<typeof apuracaoComum>["apuracao"];
};

const filho = (e: Elemento | undefined, nome: string) => e?.filhos.find((f) => f.nome === nome);
const itens = (e: Elemento | undefined) => e?.filhos.filter((f) => f.nome === "item") ?? [];
const attr = (e: Elemento | undefined, nome: string) => (e?.atributos[nome] ?? "").trim();
const digitos = (v: string) => v.replace(/\D/g, "");

/** "1.234,56" em centavos. */
function centavos(e: Elemento | undefined, nome: string): bigint {
  const v = attr(e, nome);
  if (v === "") return 0n;
  const m = /^(-?)([\d.]*),(\d{2})/.exec(v);
  if (!m) return BigInt(digitos(v) || "0") * 100n;
  const n = BigInt(`${digitos(m[2] ?? "") || "0"}${m[3] ?? "00"}`);
  return m[1] === "-" ? -n : n;
}

/** Número com vírgula decimal ("5,5000", "1.000,00") com `casas` casas, truncado. */
function escala(e: Elemento | undefined, nome: string, casas: number): bigint {
  const [inteira = "", fracao = ""] = attr(e, nome).split(",");
  const f = digitos(fracao).padEnd(casas, "0").slice(0, casas);
  return BigInt(`${digitos(inteira) || "0"}${f}` || "0");
}

/** "DD/MM/AAAA" em ISO; vazio fica indefinido. */
function data(e: Elemento | undefined, nome: string): string | undefined {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(attr(e, nome));
  return m ? `${m[3]}-${m[2]}-${m[1]}` : undefined;
}

const natureza = (v: string) => (v === "" ? "00" : v.padStart(2, "0").slice(-2));

// --------------------------------------------------------------- alienações

function apuracaoComum(item: Elemento) {
  const apuracao = filho(item, "apuracao");
  const calculo = filho(item, "calculoImposto");
  const consolidacao = filho(item, "consolidacao");
  const bruto = centavos(apuracao, "ganhoCapital1");
  const isento = centavos(consolidacao, "totalRendIsentosNaoTributaveis");
  const exclusivo = centavos(consolidacao, "totalRendSujeitosTributacao");
  const impostoPago = centavos(calculo, "impostoPago");
  // Ganho do cálculo do imposto (VR_GCAP_CI): o programa o zera quando a isenção é do único
  // imóvel e o mantém nas demais isenções (pequeno valor).
  const ganhoCalculo = centavos(calculo, "ganhoCapitalTotal");
  return {
    bruto,
    apuracao: {
      valorAlienacao: centavos(apuracao, "valorAlienacao"),
      custoCorretagem: centavos(apuracao, "custoCorretagem"),
      custoAquisicao: centavos(apuracao, "custoAquisicao"),
      ganhoCapital: ganhoCalculo,
      reducoes: bruto > ganhoCalculo ? bruto - ganhoCalculo : 0n,
      impostoDevido: centavos(calculo, "impostoDevido"),
      impostoPago,
      impostoDiferidoPosterior: centavos(consolidacao, "impostoDiferidoAnosPosteriores"),
      rendimentoIsento: isento,
      rendimentoExclusivo: exclusivo,
    },
  };
}

const ORIGENS = { "1": "nacional", "2": "estrangeira", "3": "ambas" } as const;

/**
 * Bem adquirido no exterior: valores em reais da alienação e da parte nacional do custo, e o
 * detalhe em dólar (`cambio`); sem reduções.
 */
function exterior(item: Elemento, aquisicao: Elemento | undefined, apuracao: Objeto["apuracao"]) {
  const origem = ORIGENS[attr(aquisicao, "origemRendimentos") as keyof typeof ORIGENS];
  if (!origem) {
    throw new ExportacaoGcapInvalidaError(
      "Bem adquirido no exterior sem a origem dos rendimentos no demonstrativo do GCAP.",
    );
  }
  return {
    valorOperacao: centavos(item, "valorAlienacaoReal"),
    apuracao: {
      ...apuracao,
      valorAlienacao: centavos(item, "valorAlienacaoReal"),
      custoCorretagem: centavos(item, "valorCorretagemReal"),
      custoAquisicao: centavos(aquisicao, "custoAquisicaoOrigemNacionalReal"),
      reducoes: 0n,
    },
    cambio: {
      origem,
      moeda: attr(aquisicao, "moedaEstrangeira") || "USA",
      cotacaoAquisicao: escala(aquisicao, "cotacaoDolarDataAquisicao", 4),
      cotacaoAlienacao: escala(item, "cotacaoDolarDataAlienacao", 4),
      valorAlienacaoDolar: centavos(item, "valorAlienacaoDolar"),
      corretagemDolar: centavos(item, "valorCorretagemDolar"),
      custoNacionalDolar: centavos(aquisicao, "custoAquisicaoOrigemNacionalDolar"),
      custoEstrangeiraDolar: centavos(aquisicao, "custoAquisicaoOrigemMEDolar"),
    },
  };
}

function adquirentes(bem: Elemento | undefined) {
  return itens(filho(bem, "adquirentes")).map((a) => ({
    ni: digitos(attr(a, "cpfCnpj")),
    nome: attr(a, "nome"),
  }));
}

function lerImovel(item: Elemento, cpf: string, operacao: number): Objeto {
  const bem = filho(item, "bemImovel");
  const aquisicao = filho(bem, "aquisicao") ?? filho(item, "aquisicao");
  const endereco = filho(bem, "endereco");
  const perguntas = filho(item, "perguntas");
  const { apuracao } = apuracaoComum(item);
  const residencial = attr(perguntas, "imovelResidencial");
  const unico = attr(perguntas, "propriedadeOutroImovel") === "0";
  const dataAquisicao = data(aquisicao, "dataAquisicao");
  return {
    tipo: "imovel",
    cpfBeneficiario: cpf,
    operacao,
    exterior: attr(bem, "bemAdquiridoNoBrasil") === "0",
    descricao: attr(bem, "especificacao"),
    naturezaOperacao: natureza(attr(item, "natureza")),
    dataAlienacao: data(item, "dataAlienacao") ?? "",
    ...(dataAquisicao ? { dataAquisicao } : {}),
    valorOperacao: centavos(item, "valorAlienacao"),
    aPrazo: attr(item, "alienacaoAPrazo") === "1",
    adquirentes: adquirentes(bem),
    apuracao,
    ...(attr(endereco, "uf") ? { uf: attr(endereco, "uf") } : {}),
    ...(attr(endereco, "municipio") ? { municipio: attr(endereco, "municipio") } : {}),
    ...(residencial === "" ? {} : { residencial: residencial === "1" }),
    unicoImovel: unico,
    outraAlienacaoCincoAnos: attr(perguntas, "outraAlienacao") === "1",
    valorAplicadoOutroImovel: centavos(item, "valorAplicado"),
    reformas: [],
    atualizadoLei14973: attr(aquisicao, "bemAtualizado") === "1",
    ...(attr(bem, "bemAdquiridoNoBrasil") === "0" ? exterior(item, aquisicao, apuracao) : {}),
  };
}

function lerMovel(item: Elemento, cpf: string, operacao: number): Objeto {
  const bem = filho(item, "bemMovel");
  const aquisicao = filho(bem, "aquisicao") ?? filho(item, "aquisicao");
  const { apuracao } = apuracaoComum(item);
  const dataAquisicao = data(aquisicao, "dataAquisicao");
  return {
    tipo: "movel",
    cpfBeneficiario: cpf,
    operacao,
    exterior: attr(bem, "bemAdquiridoNoBrasil") === "0",
    descricao: attr(bem, "especificacao"),
    naturezaOperacao: natureza(attr(item, "natureza")),
    dataAlienacao: data(item, "dataAlienacao") ?? "",
    ...(dataAquisicao ? { dataAquisicao } : {}),
    valorOperacao: centavos(item, "valorAlienacao"),
    aPrazo: attr(item, "alienacaoAPrazo") === "1",
    adquirentes: adquirentes(bem),
    apuracao,
    possuiRegistroPublico: attr(bem, "sujeitoRegistroPublico") === "1",
    // "O conjunto de bens da mesma natureza alienados no mês passa de R$ 35.000,00?" = não.
    pequenoValor: attr(item, "bemGrandeValor") === "0",
    ...(attr(bem, "bemAdquiridoNoBrasil") === "0" ? exterior(item, aquisicao, apuracao) : {}),
  };
}

function lerParticipacao(item: Elemento, cpf: string, operacao: number): Objeto {
  const ps = filho(item, "participacaoSocietaria");
  const parcelas = itens(filho(item, "colecaoParcelaAquisicaoParticipacaoSocietaria"));
  const { apuracao } = apuracaoComum(item);
  const quantidade = parcelas.reduce(
    (s, p) => s + BigInt(digitos(attr(p, "quantidadeQuotas")) || "0"),
    0n,
  );
  const especie = attr(parcelas[0], "especieAquisicao") || attr(ps, "especie");
  const cnpj = digitos(attr(ps, "cnpj"));
  return {
    tipo: "participacaoSocietaria",
    cpfBeneficiario: cpf,
    operacao,
    exterior: false,
    descricao: attr(ps, "nome"),
    // O IRPF grava CD_OPERACAO 00 para participações (caso gcap-participacao-01, natureza 1
    // no GCAP).
    naturezaOperacao: "00",
    dataAlienacao: data(item, "dataAlienacao") ?? "",
    valorOperacao: centavos(item, "valorAlienacao"),
    aPrazo: attr(item, "alienacaoAPrazo") === "1",
    adquirentes: adquirentes(item),
    apuracao,
    ...(cnpj ? { cnpjSociedade: cnpj } : {}),
    ...(especie ? { especie } : {}),
    ...(quantidade > 0n ? { quantidadeAlienada: Number(quantidade) } : {}),
    impostoRetidoFonte: centavos(filho(item, "calculoImposto"), "IRRFLei110332004"),
    ...(attr(ps, "uf") ? { uf: attr(ps, "uf") } : {}),
    ...(attr(ps, "municipio") ? { municipio: attr(ps, "municipio") } : {}),
    pequenoValor: attr(item, "bemGrandeValor") === "0",
  };
}

const MESES = [
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
] as const;

/**
 * Moeda estrangeira em espécie: o saldo de 1º de janeiro vira a primeira operação de cada
 * moeda, como no registro 74 do IRPF; cada compra e venda traz os valores que o GCAP calculou
 * (custo médio, custo da venda, ganho, saldo e estoque).
 */
function lerMoedas(doc: Elemento, inicio: string | undefined) {
  return itens(filho(doc, "moedasAlienadas")).flatMap((m) => {
    const moeda = attr(m, "moeda");
    const saldoInicial = {
      moeda,
      tipoOperacao: "saldoInicial",
      data: inicio,
      quantidade: 0,
      valorReais: 0n,
      custoMedio: escala(m, "custoMedioInicial", 6),
      saldoReais: centavos(m, "saldoInicial"),
      estoque: Number(centavos(m, "estoqueInicial")),
    };
    const ops = itens(filho(m, "operacoesEspecie")).map((o) => {
      const venda = attr(o, "tipo") === "2";
      const ni = digitos(attr(o, "niAdquirente"));
      return {
        moeda,
        tipoOperacao: venda ? "venda" : "compra",
        data: data(o, "data"),
        quantidade: Number(centavos(o, "quantidade")),
        valorReais: centavos(o, "valor"),
        ...(venda && ni ? { adquirente: { ni, nome: attr(o, "nomeAdquirente") } } : {}),
        cotacaoDolar: escala(o, "cotacaoDolar", 4),
        custoMedio: escala(o, "custoMedio", 6),
        custoAlienacao: centavos(o, "custoAlienacao"),
        ganhoCapital: centavos(o, "ganhoCapital"),
        saldoReais: centavos(o, "saldo"),
        estoque: Number(centavos(o, "estoque")),
      };
    });
    return [saldoInicial, ...ops];
  });
}

/** Demonstrativo do modelo a partir do XML exportado pelo GCAP. */
export function lerDemonstrativoGcapXml(xml: string): DemonstrativoGcap {
  const doc = lerXml(xml);
  if (!/DemonstrativoGCAP$/.test(attr(doc, "classeJava"))) {
    throw new ExportacaoGcapInvalidaError("O XML não é um demonstrativo de ganhos de capital.");
  }
  const id = filho(doc, "copiaIdentificador");
  const cpf = digitos(attr(id, "cpf"));
  if (cpf.length !== 11) throw new ExportacaoGcapInvalidaError("Demonstrativo do GCAP sem CPF.");
  const alienacoes: Objeto[] = [
    ...itens(filho(doc, "bensImoveis")).map((x, i) => lerImovel(x, cpf, i)),
    ...itens(filho(doc, "bensMoveis")).map((x, i) => lerMovel(x, cpf, i)),
    ...itens(filho(doc, "participacoesSocietarias")).map((x, i) => lerParticipacao(x, cpf, i)),
  ];
  const inicio = data(id, "dataInicioPermanencia");
  const fim = data(id, "dataFimPermanencia");
  const moedaEspecie = lerMoedas(doc, inicio);
  const totalizacao = filho(doc, "totalizacaoMoedasAlienadas");
  const moedaEspecieMensal =
    moedaEspecie.length > 0
      ? MESES.map((nome) => {
          const m = filho(totalizacao, nome);
          return {
            alienacaoDolar: centavos(m, "alienacoesDolar"),
            alienacaoConsolidadaDolar: centavos(m, "alienacoesConsolidadasDolar"),
            ganhoCapital: centavos(m, "ganhosCapital"),
            ganhoTributavel: centavos(m, "ganhosCapitalTributavel"),
            impostoDevido: centavos(m, "impostoDevido"),
            impostoPago: centavos(m, "impostoPago"),
          };
        })
      : [];
  const tot = { pequeno: 0n, unico: 0n, reducao: 0n };
  for (const a of alienacoes) {
    // Isentos de bens no exterior vão para a consolidação do exterior, não para 05 a 07.
    if (a.exterior === true) continue;
    const isento = a.apuracao.rendimentoIsento;
    if (a.tipo === "imovel" && a.unicoImovel === true) tot.unico += isento;
    else if (
      a.apuracao.impostoDevido === 0n &&
      a.apuracao.rendimentoExclusivo === 0n &&
      a.apuracao.ganhoCapital > 0n
    )
      tot.pequeno += isento;
    else tot.reducao += isento;
  }
  const cons = filho(doc, "consolidacaoBrasil");
  const ext = filho(doc, "consolidacaoExterior");
  const pais = attr(id, "paisDeclarante");
  return zDemonstrativoGcap.parse({
    cpfBeneficiario: cpf,
    ...(inicio ? { dataInicio: inicio } : {}),
    ...(fim ? { dataFim: fim } : {}),
    ...(pais ? { pais: pais.padStart(3, "0") } : {}),
    alienacoes,
    moedaEspecie,
    moedaEspecieMensal,
    totais: {
      rendimentoExclusivo: centavos(cons, "totalRendSujeitosTributacao"),
      isentoPequenoValor: tot.pequeno,
      isentoUnicoImovel: tot.unico,
      isentoReducao: tot.reducao,
      impostoPago: centavos(cons, "totalImpostoPago"),
      impostoDevido: centavos(cons, "impostoDevidoAnoAtual"),
      impostoDiferidoPosterior: centavos(cons, "impostoDiferidoAnosPosteriores"),
      ganhoMoedaEspecie: centavos(totalizacao, "totalGanhosCapital"),
      impostoDevidoMoedaEspecie: centavos(totalizacao, "totalImpostoDevido"),
      rendimentoExclusivoExterior: centavos(ext, "totalRendSujeitosTributacao"),
      impostoPagoExterior: centavos(ext, "totalImpostoPago"),
      isentoExterior: centavos(ext, "totalRendIsentosNaoTributaveis"),
    },
  });
}

/**
 * Inclui o demonstrativo na declaração como a importação do programa: substitui o do mesmo CPF
 * e período e refaz os valores transportados (isentos 05 pequeno valor, no Brasil e no exterior, 06 único imóvel e 07
 * demais reduções, no valor transportado; exclusivos 02 ganho de capital, 03 bens adquiridos em
 * moeda estrangeira e 04 moeda estrangeira em espécie) com a soma de todos os demonstrativos. O
 * valor digitado pelo contribuinte nos isentos 05 a 07 é mantido. O 04 recebe o ganho total da
 * moeda em espécie, mesmo quando o GCAP o considera isento (caso gcap-especie-isento-01).
 */
export function incluirDemonstrativoGcap(dec: Declaracao, d: DemonstrativoGcap): Declaracao {
  const mesmo = (x: DemonstrativoGcap) =>
    x.cpfBeneficiario === d.cpfBeneficiario &&
    x.dataInicio === d.dataInicio &&
    x.dataFim === d.dataFim;
  const ganhosCapital = [...dec.ganhosCapital.filter((x) => !mesmo(x)), d];
  const soma = (f: (t: DemonstrativoGcap["totais"]) => bigint) =>
    ganhosCapital.reduce((s, x) => s + f(x.totais), 0n);
  const transportes: Record<"05" | "06" | "07", bigint> = {
    // O isento de bem no exterior (só há o de pequeno valor) também vai para o 05 (caso
    // gcap-exterior-pequeno-valor-01).
    "05": soma((t) => t.isentoPequenoValor + t.isentoExterior),
    "06": soma((t) => t.isentoUnicoImovel),
    "07": soma((t) => t.isentoReducao),
  };
  const isentos: Record<string, unknown>[] = dec.rendimentosIsentos
    .map(
      (i): Record<string, unknown> =>
        i.codigo === "05" || i.codigo === "06" || i.codigo === "07"
          ? { ...i, valorTransportado: transportes[i.codigo] }
          : i,
    )
    .filter(
      (i) =>
        !(
          (i.codigo === "05" || i.codigo === "06" || i.codigo === "07") &&
          i.valorInformado === 0n &&
          i.valorTransportado === 0n
        ),
    );
  for (const codigo of ["05", "06", "07"] as const) {
    if (transportes[codigo] > 0n && !isentos.some((i) => i.codigo === codigo)) {
      isentos.push({ codigo, valorInformado: 0n, valorTransportado: transportes[codigo] });
    }
  }
  isentos.sort((a, b) => String(a.codigo).localeCompare(String(b.codigo)));
  const transportados: Record<"02" | "03" | "04", bigint> = {
    "02": soma((t) => t.rendimentoExclusivo),
    "03": soma((t) => t.rendimentoExclusivoExterior),
    "04": soma((t) => t.ganhoMoedaEspecie),
  };
  const exclusivos: Record<string, unknown>[] = dec.rendimentosExclusivos.filter(
    (e) => !(e.codigo in transportados),
  );
  for (const codigo of ["02", "03", "04"] as const) {
    if (transportados[codigo] > 0n) exclusivos.push({ codigo, valor: transportados[codigo] });
  }
  exclusivos.sort((a, b) => String(a.codigo).localeCompare(String(b.codigo)));
  return zDeclaracao.parse({
    ...dec,
    ganhosCapital,
    rendimentosIsentos: isentos,
    rendimentosExclusivos: exclusivos,
  });
}
