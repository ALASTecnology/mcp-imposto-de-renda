/**
 * Grupo "edicao": inclusão, edição, remoção e listagem de lançamentos de cada ficha da
 * declaração, e as ferramentas `definir_*` das fichas de objeto único.
 *
 * Toda escrita usa o fluxo de `fluxo.ts`: abre o DBK/DEC da pasta autorizada, altera o modelo,
 * valida com as regras do core e grava o DBK com backup, devolvendo as pendências. As fichas
 * em lista são descritas em `edicao-fichas.ts` e geram quatro ferramentas cada uma
 * (adicionar_*, editar_*, remover_*, listar_*), além das genéricas listar_lancamentos,
 * editar_lancamento e remover_lancamento.
 */
import {
  type Declaracao,
  FICHAS,
  zApuracaoAtividadeRural,
  zAtividadeRural,
  zBemDireito,
  zEspolioAjuste,
  zFinalEspolio,
  zIdentificacao,
  zInformacoesConjuge,
  zMesFii,
  zMesRendaVariavel,
  zOperacoesFii,
  zRebanho,
  zRendaVariavel,
  zRendimentosPFExterior,
  zSaidaDefinitiva,
} from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import { EntradaInvalidaError } from "../erros.js";
import { objetoJson, type paraJson } from "../serializacao.js";
import { blocoDeDados, EXT_DECLARACAO, exigirPasta, zNomeArquivo } from "./comum.js";
import {
  mesclar,
  validarLancamento,
  zBeneficiarioEntrada,
  zObjetoLivre,
} from "./edicao-esquemas.js";
import {
  type Afetado,
  FICHAS_LISTA,
  type FichaLista,
  fichaLista,
  IDS_FICHAS_LISTA,
} from "./edicao-fichas.js";
import {
  abrirDeclaracao,
  editarDeclaracao,
  SAIDA_GRAVACAO,
  textoGravacao,
  zArquivoDestino,
  zArquivoEdicao,
} from "./fluxo.js";
import { registrosGcapComplementares } from "./gcap-complementares.js";
import type { GrupoFerramentas, RegistroFerramentas } from "./tipos.js";

type Item = Record<string, unknown>;

const zIndice = z
  .number()
  .int()
  .min(1)
  .max(10_000)
  .describe("Posição do item, a partir de 1, como em listar_*.");
const zItemJson = z.record(z.string(), z.unknown());
const zAfetado = z.object({ ficha: z.string(), indice: z.number(), acao: z.string() });

const SAIDA_ALTERACAO = {
  ...SAIDA_GRAVACAO,
  ficha: z.string(),
  indice: z.number().nullable().describe("Posição do item alterado (nula se removido)."),
  item: zItemJson.nullable(),
  afetados: z.array(zAfetado),
};

const SAIDA_LISTA = {
  arquivo: z.string(),
  ficha: z.string(),
  nome: z.string(),
  total: z.number(),
  itens: z.array(z.object({ indice: z.number(), item: zItemJson })),
  complementares: z
    .array(
      z.object({
        tipo: z.string(),
        descricao: z.string(),
        cpfBeneficiario: z.string().nullable(),
        campos: z.record(z.string(), z.string()),
      }),
    )
    .optional()
    .describe("Só em Ganhos de Capital: registros 64, 67, 70 a 73 e 75 a 78 decodificados."),
};

function itemJson(item: unknown): { [k: string]: ReturnType<typeof paraJson> } {
  return objetoJson((item ?? {}) as object);
}

function obterItem(f: FichaLista, dec: Declaracao, indice: number): Item {
  const itens = f.ler(dec);
  const item = itens[indice - 1];
  if (!item) {
    throw new EntradaInvalidaError(
      `${f.nome}: não há item na posição ${indice} (a ficha tem ${itens.length}). Use listar_lancamentos.`,
    );
  }
  return item;
}

/** Texto do item com as chaves em ordem, para comparar itens iguais vindos de caminhos diferentes. */
function canonico(item: Item): string {
  return JSON.stringify(itemJson(item), (_, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
      : v,
  );
}

async function adicionar(
  r: RegistroFerramentas,
  f: FichaLista,
  args: { arquivo: string; arquivo_destino?: string | undefined; item: Item },
) {
  let indice = 0;
  let novo: Item = {};
  const res = await editarDeclaracao(r.ctx, args, (dec) => {
    novo = validarLancamento(f.item, args.item, f.nome) as Item;
    const itens = [...f.ler(dec), novo];
    f.gravar(dec, itens);
    // Em listas compostas (por exemplo, doações ECA e pessoa idosa) o item fica no fim do seu
    // grupo, não no fim da lista: a posição é a da última ocorrência igual depois de gravar.
    const chave = canonico(novo);
    const relidos = f.ler(dec).map(canonico);
    indice = relidos.lastIndexOf(chave) + 1 || itens.length;
    return dec;
  });
  return {
    texto: textoGravacao(res, `${f.nome}: item ${indice} incluído.`),
    dados: {
      ...res,
      declaracao: undefined,
      ficha: f.id,
      indice,
      item: itemJson(novo),
      afetados: [],
    },
  };
}

async function editar(
  r: RegistroFerramentas,
  f: FichaLista,
  args: { arquivo: string; arquivo_destino?: string | undefined; indice: number; alteracoes: Item },
) {
  let novo: Item = {};
  const res = await editarDeclaracao(r.ctx, args, (dec) => {
    const atual = obterItem(f, dec, args.indice);
    novo = validarLancamento(
      f.item,
      mesclar(atual, args.alteracoes),
      f.nome,
      args.alteracoes,
    ) as Item;
    const itens = [...f.ler(dec)];
    itens[args.indice - 1] = novo;
    f.gravar(dec, itens);
    return dec;
  });
  return {
    texto: textoGravacao(res, `${f.nome}: item ${args.indice} alterado.`),
    dados: {
      ...res,
      declaracao: undefined,
      ficha: f.id,
      indice: args.indice,
      item: itemJson(novo),
      afetados: [],
    },
  };
}

async function remover(
  r: RegistroFerramentas,
  f: FichaLista,
  args: {
    arquivo: string;
    arquivo_destino?: string | undefined;
    indice: number;
    cascata?: boolean | undefined;
  },
) {
  let afetados: Afetado[] = [];
  const res = await editarDeclaracao(r.ctx, args, (dec) => {
    const item = obterItem(f, dec, args.indice);
    if (f.vinculos) {
      afetados = f.vinculos(dec, item, false);
      if (afetados.length > 0 && !args.cascata) {
        throw new EntradaInvalidaError(
          `${f.nome}: o item ${args.indice} tem ${afetados.length} lançamento(s) vinculado(s) (${afetados
            .map((a) => `${a.ficha} ${a.indice}`)
            .join(
              "; ",
            )}). Remova-os antes ou repita com cascata: true para remover ou desvincular.`,
        );
      }
      if (args.cascata) f.vinculos(dec, item, true);
    }
    f.gravar(
      dec,
      f.ler(dec).filter((_, i) => i !== args.indice - 1),
    );
    return dec;
  });
  return {
    texto: textoGravacao(
      res,
      `${f.nome}: item ${args.indice} removido${afetados.length ? `; ${afetados.length} lançamento(s) vinculado(s) também ajustado(s)` : ""}.`,
    ),
    dados: { ...res, declaracao: undefined, ficha: f.id, indice: null, item: null, afetados },
  };
}

async function listar(r: RegistroFerramentas, f: FichaLista, arquivo: string) {
  const { declaracao, registros } = await abrirDeclaracao(r.ctx, arquivo);
  const itens = f.ler(declaracao).map((item, i) => ({ indice: i + 1, item: itemJson(item) }));
  // Ganhos de Capital: os registros que o modelo não tipa (64, 67, 70 a 73, 75 a 78) vêm
  // decodificados pelo leiaute, para o demonstrativo aparecer inteiro.
  const complementares =
    f.id === "ganhosCapital" ? registrosGcapComplementares(registros) : undefined;
  const extra =
    complementares && complementares.length > 0
      ? `\nRegistros complementares do demonstrativo (${complementares.length}):\n${blocoDeDados(arquivo, JSON.stringify(complementares, null, 2))}`
      : "";
  return {
    texto: `${f.nome}: ${itens.length} item(ns).\n${blocoDeDados(arquivo, JSON.stringify(itens, null, 2))}${extra}`,
    dados: {
      arquivo,
      ficha: f.id,
      nome: f.nome,
      total: itens.length,
      itens,
      ...(complementares ? { complementares } : {}),
    },
  };
}

/** Tira `declaracao` do resultado para caber no outputSchema. */
function semDeclaracao<T extends { declaracao?: unknown }>(r: T): Omit<T, "declaracao"> {
  const { declaracao: _, ...resto } = r;
  return resto;
}

function registrarFichasLista(r: RegistroFerramentas): void {
  for (const f of FICHAS_LISTA) {
    if (!f.singular || !f.plural) continue;
    const dica = f.dica ? ` ${f.dica}` : "";
    r.ferramenta(
      `adicionar_${f.singular}`,
      {
        titulo: `Incluir em ${f.nome}`,
        descricao: `Inclui um item na ficha ${f.nome} do DBK, valida a declaração e grava com cópia de segurança, devolvendo as pendências.${dica}`,
        escreve: true,
        entrada: {
          arquivo: zArquivoEdicao,
          arquivo_destino: zArquivoDestino,
          item: zObjetoLivre(f.item, "Item no formato do modelo."),
        },
        saida: SAIDA_ALTERACAO,
      },
      async (a) => {
        const x = await adicionar(r, f, a);
        return { texto: x.texto, dados: objetoJson(semDeclaracao(x.dados)) };
      },
    );
    r.ferramenta(
      `editar_${f.singular}`,
      {
        titulo: `Alterar item de ${f.nome}`,
        descricao: `Altera um item da ficha ${f.nome}: os campos informados em 'alteracoes' são mesclados ao item (null remove o campo); valida e grava com cópia de segurança.${dica}`,
        escreve: true,
        atalho: true,
        entrada: {
          arquivo: zArquivoEdicao,
          arquivo_destino: zArquivoDestino,
          indice: zIndice,
          alteracoes: zObjetoLivre(f.item, "Campos a alterar."),
        },
        saida: SAIDA_ALTERACAO,
      },
      async (a) => {
        const x = await editar(r, f, a);
        return { texto: x.texto, dados: objetoJson(semDeclaracao(x.dados)) };
      },
    );
    r.ferramenta(
      `remover_${f.singular}`,
      {
        titulo: `Remover item de ${f.nome}`,
        descricao: `Remove um item da ficha ${f.nome}, valida e grava com cópia de segurança.${f.vinculos ? " Se houver lançamentos vinculados (rendimentos, pagamentos, bens, pensões), recusa, a menos que cascata seja true." : ""}`,
        escreve: true,
        atalho: true,
        entrada: {
          arquivo: zArquivoEdicao,
          arquivo_destino: zArquivoDestino,
          indice: zIndice,
          cascata: z
            .boolean()
            .optional()
            .describe("Remove ou desvincula os lançamentos ligados ao item removido."),
        },
        saida: SAIDA_ALTERACAO,
        anotacoes: { idempotentHint: false },
      },
      async (a) => {
        const x = await remover(r, f, a);
        return { texto: x.texto, dados: objetoJson(semDeclaracao(x.dados)) };
      },
    );
    r.ferramenta(
      `listar_${f.plural}`,
      {
        titulo: `Listar ${f.nome}`,
        descricao: `Lista os itens da ficha ${f.nome} de um DBK/DEC da pasta autorizada, com a posição usada em editar_* e remover_* (valores em centavos).`,
        entrada: { arquivo: zNomeArquivo("Arquivo .DBK ou .DEC.") },
        saida: SAIDA_LISTA,
        atalho: true,
      },
      async ({ arquivo }) => {
        const x = await listar(r, f, arquivo);
        return { texto: x.texto, dados: objetoJson(x.dados) };
      },
    );
  }
}

function registrarGenericas(r: RegistroFerramentas): void {
  const zFicha = z.enum(IDS_FICHAS_LISTA).describe("Ficha em lista (veja listar_fichas).");
  r.ferramenta(
    "listar_fichas",
    {
      titulo: "Listar as fichas da declaração",
      descricao:
        "Mostra todas as fichas do modelo com a quantidade de itens preenchidos em um DBK/DEC, e quais estão em lista, consultáveis por listar_lancamentos e editáveis pelas ferramentas genéricas de lançamento.",
      entrada: { arquivo: zNomeArquivo("Arquivo .DBK ou .DEC.") },
      saida: {
        arquivo: z.string(),
        fichas: z.array(
          z.object({
            ficha: z.string(),
            nome: z.string(),
            itens: z.number(),
            emLista: z.boolean(),
          }),
        ),
      },
    },
    async ({ arquivo }) => {
      const { declaracao } = await abrirDeclaracao(r.ctx, arquivo);
      const emLista = new Set(IDS_FICHAS_LISTA);
      const fichas = [
        ...Object.entries(FICHAS)
          .filter(([k]) => k !== "atividadeRural" && k !== "doacoesDiretamenteNaDeclaracao")
          .map(([k, nome]) => {
            const v = (declaracao as unknown as Record<string, unknown>)[k];
            return {
              ficha: k,
              nome,
              itens: Array.isArray(v) ? v.length : v === undefined ? 0 : 1,
              emLista: emLista.has(k),
            };
          }),
        ...FICHAS_LISTA.filter(
          (f) => f.id.includes(".") || f.id === "doacoesDiretamenteNaDeclaracao",
        ).map((f) => ({
          ficha: f.id,
          nome: f.nome,
          itens: f.ler(declaracao).length,
          emLista: true,
        })),
      ];
      return {
        texto: fichas.map((f) => `- ${f.nome} (${f.ficha}): ${f.itens}`).join("\n"),
        dados: { arquivo, fichas },
      };
    },
  );
  r.ferramenta(
    "listar_lancamentos",
    {
      titulo: "Listar lançamentos de uma ficha",
      descricao: "Lista os itens de qualquer ficha em lista, com a posição de cada um.",
      entrada: { arquivo: zNomeArquivo("Arquivo .DBK ou .DEC."), ficha: zFicha },
      saida: SAIDA_LISTA,
    },
    async ({ arquivo, ficha }) => {
      const x = await listar(r, fichaLista(ficha), arquivo);
      return { texto: x.texto, dados: objetoJson(x.dados) };
    },
  );
  r.ferramenta(
    "editar_lancamento",
    {
      titulo: "Alterar um lançamento",
      descricao:
        "Altera um item de qualquer ficha em lista (campos mesclados; null remove), valida e grava com cópia de segurança.",
      escreve: true,
      entrada: {
        arquivo: zArquivoEdicao,
        arquivo_destino: zArquivoDestino,
        ficha: zFicha,
        indice: zIndice,
        alteracoes: zItemJson.describe("Campos a alterar, no formato do modelo."),
      },
      saida: SAIDA_ALTERACAO,
    },
    async ({ ficha, ...a }) => {
      const x = await editar(r, fichaLista(ficha), a);
      return { texto: x.texto, dados: objetoJson(semDeclaracao(x.dados)) };
    },
  );
  r.ferramenta(
    "remover_lancamento",
    {
      titulo: "Remover um lançamento",
      descricao:
        "Remove um item de qualquer ficha em lista, valida e grava com cópia de segurança (dependente ou alimentando com vínculos exige cascata: true).",
      escreve: true,
      entrada: {
        arquivo: zArquivoEdicao,
        arquivo_destino: zArquivoDestino,
        ficha: zFicha,
        indice: zIndice,
        cascata: z.boolean().optional(),
      },
      saida: SAIDA_ALTERACAO,
      anotacoes: { idempotentHint: false },
    },
    async ({ ficha, ...a }) => {
      const x = await remover(r, fichaLista(ficha), a);
      return { texto: x.texto, dados: objetoJson(semDeclaracao(x.dados)) };
    },
  );
}

/** Ferramenta `definir_*`: altera uma parte do modelo e grava. */
function definir(
  r: RegistroFerramentas,
  nome: string,
  titulo: string,
  descricao: string,
  entrada: z.ZodRawShape,
  alterar: (dec: Declaracao, args: Record<string, unknown>) => string,
): void {
  r.ferramenta(
    nome,
    {
      titulo,
      descricao: `${descricao} Valida a declaração e grava o DBK com cópia de segurança, devolvendo as pendências.`,
      escreve: true,
      entrada: { arquivo: zArquivoEdicao, arquivo_destino: zArquivoDestino, ...entrada },
      saida: { ...SAIDA_GRAVACAO, resumo: z.string() },
    },
    async (args) => {
      const a = args as Record<string, unknown> & { arquivo: string; arquivo_destino?: string };
      let resumo = "";
      const res = await editarDeclaracao(r.ctx, a, (dec) => {
        resumo = alterar(dec, a);
        return dec;
      });
      return {
        texto: textoGravacao(res, resumo),
        dados: objetoJson({ ...semDeclaracao(res), resumo }),
      };
    },
  );
}

function beneficiarioDe(b: unknown): { tipo: "titular" } | { tipo: "dependente"; cpf: string } {
  const x = b as { tipo?: string; cpf?: string } | undefined;
  if (x?.tipo === "dependente") {
    if (!x.cpf) throw new EntradaInvalidaError("Informe o CPF do dependente em beneficiario.cpf.");
    return { tipo: "dependente", cpf: x.cpf.replace(/\D/g, "") };
  }
  return { tipo: "titular" };
}

const mesmoBeneficiario = (a: unknown, b: { tipo: string; cpf?: string }) => {
  const x = a as { tipo?: string; cpf?: string };
  return x.tipo === b.tipo && (b.tipo === "titular" || x.cpf === b.cpf);
};

const COLUNAS_PF = [
  "trabalhoNaoAssalariado",
  "alugueis",
  "outros",
  "exterior",
  "previdenciaOficial",
  "quantidadeDependentes",
  "pensaoAlimenticia",
  "livroCaixa",
  "carneLeaoPago",
] as const;

function registrarDefinir(r: RegistroFerramentas): void {
  const zDados = (schema: z.ZodType, prefixo: string) => zObjetoLivre(schema, prefixo);

  definir(
    r,
    "definir_identificacao",
    "Definir a identificação do contribuinte",
    "Mescla os campos informados na ficha Identificação do Contribuinte (nome, nascimento, endereço, ocupação, cônjuge, tipo de declaração, retorno ao país, NIT).",
    { dados: zDados(zIdentificacao, "Campos da identificação a alterar.") },
    (dec, a) => {
      dec.identificacao = validarLancamento(
        zIdentificacao,
        mesclar(dec.identificacao, a.dados),
        FICHAS.identificacao,
        a.dados,
      );
      return "Identificação atualizada.";
    },
  );

  definir(
    r,
    "definir_rendimentos_pf_exterior",
    "Definir rendimentos de PF e do exterior",
    "Lança os valores mensais (carnê-leão) de uma pessoa: informe 'mes' e 'valores' (coluna: valor) para um mês, ou 'colunas' (coluna: 12 valores) para o ano. Colunas: " +
      `${COLUNAS_PF.join(", ")}. 'pagamentosRecebidos' substitui o detalhamento por pagador. 'remover': true apaga o quadro da pessoa.`,
    {
      beneficiario: zBeneficiarioEntrada,
      mes: z.number().int().min(1).max(12).optional(),
      valores: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
      colunas: z
        .record(z.string(), z.array(z.union([z.string(), z.number()])).length(12))
        .optional(),
      nit_pis_pasep: z.string().max(14).optional(),
      pagamentos_recebidos: z.array(z.record(z.string(), z.unknown())).max(5000).optional(),
      remover: z.boolean().optional(),
    },
    (dec, a) => {
      const b = beneficiarioDe(a.beneficiario);
      const i = dec.rendimentosPFExterior.findIndex((p) => mesmoBeneficiario(p.beneficiario, b));
      if (a.remover) {
        if (i < 0)
          throw new EntradaInvalidaError(
            "Não há quadro de rendimentos de PF/exterior para essa pessoa.",
          );
        dec.rendimentosPFExterior.splice(i, 1);
        return "Quadro de rendimentos de PF e do exterior removido.";
      }
      const atual: Item =
        i >= 0
          ? { ...dec.rendimentosPFExterior[i] }
          : (zRendimentosPFExterior.parse({ beneficiario: b }) as Item);
      const colunas = (a.colunas ?? {}) as Record<string, unknown[]>;
      const valores = (a.valores ?? {}) as Record<string, unknown>;
      for (const k of [...Object.keys(colunas), ...Object.keys(valores)]) {
        if (!(COLUNAS_PF as readonly string[]).includes(k)) {
          throw new EntradaInvalidaError(
            `Coluna desconhecida: ${k}. Use: ${COLUNAS_PF.join(", ")}.`,
          );
        }
      }
      const novo: Item = { ...atual };
      for (const [k, v] of Object.entries(colunas)) novo[k] = v;
      if (Object.keys(valores).length > 0) {
        if (a.mes === undefined)
          throw new EntradaInvalidaError("Informe 'mes' junto com 'valores'.");
        const m = (a.mes as number) - 1;
        for (const [k, v] of Object.entries(valores)) {
          const lista = [...((novo[k] as unknown[]) ?? [])];
          lista[m] = v;
          novo[k] = lista;
        }
      }
      if (a.nit_pis_pasep) novo.nitPisPasep = String(a.nit_pis_pasep).replace(/\D/g, "");
      if (a.pagamentos_recebidos) novo.pagamentosRecebidos = a.pagamentos_recebidos;
      const item = validarLancamento(zRendimentosPFExterior, novo, FICHAS.rendimentosPFExterior, {
        ...colunas,
        ...valores,
      });
      if (i >= 0) dec.rendimentosPFExterior[i] = item;
      else dec.rendimentosPFExterior.push(item);
      return "Rendimentos de PF e do exterior atualizados.";
    },
  );

  definir(
    r,
    "definir_renda_variavel",
    "Definir um mês da Renda Variável",
    "Grava o mês (comuns e day-trade por mercado, IRRF de day-trade, IRRF da Lei 11.033 e imposto pago) do titular ou de um dependente; também aceita os valores de janeiro vindos de anos anteriores. O imposto do mês é apurado na gravação. Mercados: mercadoVistaAcoes, mercadoVistaOuro, mercadoVistaOuroForaBolsa, opcoesAcoes, opcoesOuro, opcoesOuroForaBolsa, opcoesOutros, futuroDolar, futuroIndices, futuroJuros, futuroOutros, termoAcoesOuro, termoOutros (perda com valor negativo).",
    {
      beneficiario: zBeneficiarioEntrada,
      mes: z.number().int().min(1).max(12).optional(),
      dados_mes: zDados(zMesRendaVariavel, "Campos do mês (sem 'mes').").optional(),
      dados_ano: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("prejuizoAnteriorComuns, prejuizoAnteriorDayTrade, irFonteDayTradeAnterior."),
      remover_mes: z.boolean().optional(),
    },
    (dec, a) => {
      const b = beneficiarioDe(a.beneficiario);
      const i = dec.rendaVariavel.findIndex((p) => mesmoBeneficiario(p.beneficiario, b));
      const atual: Item = i >= 0 ? { ...dec.rendaVariavel[i] } : { beneficiario: b, meses: [] };
      Object.assign(atual, (a.dados_ano as Item | undefined) ?? {});
      let meses = [...((atual.meses as Item[]) ?? [])];
      if (a.mes !== undefined) {
        meses = meses.filter((m) => m.mes !== a.mes);
        if (!a.remover_mes) {
          const anterior = (dec.rendaVariavel[i]?.meses ?? []).find((m) => m.mes === a.mes) ?? {};
          meses.push(mesclar({ ...anterior, mes: a.mes }, a.dados_mes ?? {}) as Item);
        }
        meses.sort((x, y) => Number(x.mes) - Number(y.mes));
      }
      atual.meses = meses;
      const item = validarLancamento(zRendaVariavel, atual, FICHAS.rendaVariavel, a.dados_mes);
      if (i >= 0) dec.rendaVariavel[i] = item;
      else dec.rendaVariavel.push(item);
      return a.mes === undefined
        ? "Renda variável atualizada."
        : `Renda variável do mês ${a.mes} atualizada.`;
    },
  );

  definir(
    r,
    "definir_fii_fiagro",
    "Definir um mês de FII ou Fiagro",
    "Grava o mês das operações com cotas de FII ou Fiagro (resultado líquido, imposto retido e imposto pago) do titular ou de um dependente; 'prejuizo_anterior' informa o prejuízo vindo de anos anteriores.",
    {
      beneficiario: zBeneficiarioEntrada,
      mes: z.number().int().min(1).max(12).optional(),
      dados_mes: zDados(zMesFii, "Campos do mês (sem 'mes').").optional(),
      prejuizo_anterior: z.union([z.string(), z.number()]).optional(),
      remover_mes: z.boolean().optional(),
    },
    (dec, a) => {
      const b = beneficiarioDe(a.beneficiario);
      const i = dec.fundosImobiliarios.findIndex((p) => mesmoBeneficiario(p.beneficiario, b));
      const atual: Item =
        i >= 0 ? { ...dec.fundosImobiliarios[i] } : { beneficiario: b, meses: [] };
      if (a.prejuizo_anterior !== undefined) atual.prejuizoAnterior = a.prejuizo_anterior;
      let meses = [...((atual.meses as Item[]) ?? [])];
      if (a.mes !== undefined) {
        meses = meses.filter((m) => m.mes !== a.mes);
        if (!a.remover_mes) {
          const anterior =
            (dec.fundosImobiliarios[i]?.meses ?? []).find((m) => m.mes === a.mes) ?? {};
          meses.push(mesclar({ ...anterior, mes: a.mes }, a.dados_mes ?? {}) as Item);
        }
        meses.sort((x, y) => Number(x.mes) - Number(y.mes));
      }
      atual.meses = meses;
      const item = validarLancamento(zOperacoesFii, atual, FICHAS.fundosImobiliarios, a.dados_mes);
      if (i >= 0) dec.fundosImobiliarios[i] = item;
      else dec.fundosImobiliarios.push(item);
      return "Operações com FII ou Fiagro atualizadas.";
    },
  );

  definir(
    r,
    "definir_espolio",
    "Definir a ficha Espólio",
    "Grava a ficha Espólio: 'tipo' ajuste (declaração de ajuste com natureza 81: sobrepartilha e inventariante) ou final (Declaração Final de Espólio: ano do óbito, modalidade, bens a inventariar, decisão judicial ou escritura, inventariante e cônjuge). 'remover': true apaga a ficha.",
    {
      tipo: z.enum(["ajuste", "final"]),
      dados: z
        .record(z.string(), z.unknown())
        .optional()
        .describe("Campos da ficha (mesclados aos atuais)."),
      remover: z.boolean().optional(),
    },
    (dec, a) => {
      if (a.tipo === "ajuste") {
        if (a.remover) {
          delete dec.espolio;
          return "Ficha Espólio removida.";
        }
        dec.espolio = validarLancamento(
          zEspolioAjuste,
          mesclar(dec.espolio ?? {}, a.dados ?? {}),
          FICHAS.espolio,
          a.dados,
        );
        return "Ficha Espólio atualizada.";
      }
      if (a.remover) {
        delete dec.finalEspolio;
        return "Ficha Espólio (Final de Espólio) removida.";
      }
      dec.finalEspolio = validarLancamento(
        zFinalEspolio,
        mesclar(dec.finalEspolio ?? {}, a.dados ?? {}),
        FICHAS.finalEspolio,
        a.dados,
      );
      return "Ficha Espólio (Final de Espólio) atualizada.";
    },
  );

  for (const [nome, chave, schema, titulo] of [
    ["definir_saida_definitiva", "saidaDefinitiva", zSaidaDefinitiva, "Saída Definitiva do País"],
    [
      "definir_informacoes_conjuge",
      "informacoesConjuge",
      zInformacoesConjuge,
      "Informações do Cônjuge",
    ],
  ] as const) {
    definir(
      r,
      nome,
      `Definir a ficha ${titulo}`,
      `Grava a ficha ${titulo} (campos mesclados aos atuais; 'remover': true apaga a ficha).`,
      { dados: zDados(schema, "Campos da ficha.").optional(), remover: z.boolean().optional() },
      (dec, a) => {
        const d = dec as unknown as Record<string, unknown>;
        if (a.remover) {
          delete d[chave];
          return `Ficha ${titulo} removida.`;
        }
        d[chave] = validarLancamento(
          schema as z.ZodType,
          mesclar(d[chave] ?? {}, a.dados ?? {}),
          titulo,
          a.dados,
        );
        return `Ficha ${titulo} atualizada.`;
      },
    );
  }

  const zAba = z.enum(["brasil", "exterior"]);
  const rural = (dec: Declaracao) => {
    const ar = dec.atividadeRural ?? {};
    return ar as unknown as Record<string, Item>;
  };
  definir(
    r,
    "definir_receitas_despesas_rurais",
    "Definir receitas e despesas rurais",
    "Grava as receitas e despesas da atividade rural: na aba brasil, itens { mes, receitaBruta, despesa }; na aba exterior, itens { pais, receitaBrutaMoedaOriginal, despesaMoedaOriginal, resultadoDolar }. Itens do mesmo mês ou país são substituídos; 'substituir_tudo' troca a lista inteira.",
    {
      aba: zAba,
      itens: z.array(z.record(z.string(), z.unknown())).max(300),
      substituir_tudo: z.boolean().optional(),
    },
    (dec, a) => {
      const ar = rural(dec);
      const aba = { ...((ar[a.aba as string] as Item | undefined) ?? {}) };
      const chave = a.aba === "brasil" ? "mes" : "pais";
      const atuais = a.substituir_tudo ? [] : ((aba.receitasDespesas as Item[] | undefined) ?? []);
      const novos = a.itens as Item[];
      aba.receitasDespesas = [
        ...atuais.filter((x) => !novos.some((n) => n[chave] === x[chave])),
        ...novos,
      ];
      dec.atividadeRural = validarLancamento(
        zAtividadeRural,
        { ...ar, [a.aba as string]: aba },
        FICHAS.atividadeRural,
        { [a.aba as string]: { receitasDespesas: novos } },
      );
      return `Receitas e despesas rurais (${a.aba}) atualizadas.`;
    },
  );

  definir(
    r,
    "definir_apuracao_rural",
    "Definir a apuração do resultado rural",
    "Grava os campos digitados da apuração da atividade rural (prejuízo anterior, opção resultado ou limite20, compensação, adiantamentos, limite de 20% no exterior). Os totais são calculados na gravação.",
    { aba: zAba, dados: zDados(zApuracaoAtividadeRural, "Campos da apuração.") },
    (dec, a) => {
      const ar = rural(dec);
      const aba = { ...((ar[a.aba as string] as Item | undefined) ?? {}) };
      aba.apuracao = validarLancamento(
        zApuracaoAtividadeRural,
        mesclar(aba.apuracao ?? {}, a.dados),
        FICHAS.atividadeRural,
        a.dados,
      );
      dec.atividadeRural = {
        ...ar,
        [a.aba as string]: aba,
      } as unknown as Declaracao["atividadeRural"];
      return `Apuração rural (${a.aba}) atualizada.`;
    },
  );

  definir(
    r,
    "definir_rebanho",
    "Definir a movimentação do rebanho",
    "Grava a movimentação de uma espécie do rebanho (1 a 4 conforme o programa, 5 = outros): estoque inicial, aquisições, nascimentos, consumo e perdas, vendas. O estoque final é calculado.",
    { aba: zAba, dados: zDados(zRebanho, "Movimentação da espécie (com 'especie').") },
    (dec, a) => {
      const ar = rural(dec);
      const aba = { ...((ar[a.aba as string] as Item | undefined) ?? {}) };
      const item = validarLancamento(zRebanho, a.dados, "Rebanho");
      aba.rebanho = [
        ...((aba.rebanho as Item[] | undefined) ?? []).filter((x) => x.especie !== item.especie),
        item,
      ];
      dec.atividadeRural = {
        ...ar,
        [a.aba as string]: aba,
      } as unknown as Declaracao["atividadeRural"];
      return `Rebanho da espécie ${item.especie} atualizado.`;
    },
  );

  definir(
    r,
    "definir_partilha_bem",
    "Definir a partilha de um bem",
    "Na Declaração Final de Espólio, define para um bem (posição em listar_lancamentos com ficha 'bens') se ainda está a inventariar, a situação na data da partilha, o valor de transferência e os percentuais por herdeiro (centésimos: 100,00% = 10000; herdeiros cadastrados em adicionar_herdeiro).",
    {
      indice: zIndice,
      bem_a_inventariar: z.boolean().optional(),
      situacao_data_partilha: z.union([z.string(), z.number()]).optional(),
      valor_transferencia: z.union([z.string(), z.number()]).optional(),
      partilha: z
        .array(
          z.object({
            niHerdeiro: z.string().max(18),
            percentualCentesimos: z.number().int().min(0).max(10000),
          }),
        )
        .max(500)
        .optional(),
    },
    (dec, a) => {
      const i = (a.indice as number) - 1;
      const bem = dec.bens[i];
      if (!bem) throw new EntradaInvalidaError(`Não há bem na posição ${a.indice}.`);
      const alteracoes: Item = {};
      if (a.bem_a_inventariar !== undefined) alteracoes.bemAInventariar = a.bem_a_inventariar;
      if (a.situacao_data_partilha !== undefined)
        alteracoes.situacaoDataPartilha = a.situacao_data_partilha;
      if (a.valor_transferencia !== undefined)
        alteracoes.valorTransferencia = a.valor_transferencia;
      if (a.partilha !== undefined) alteracoes.partilha = a.partilha;
      const soma = ((a.partilha as { percentualCentesimos: number }[] | undefined) ?? []).reduce(
        (s, p) => s + p.percentualCentesimos,
        0,
      );
      if (a.partilha !== undefined && soma > 10000) {
        throw new EntradaInvalidaError("A soma dos percentuais da partilha passa de 100,00%.");
      }
      dec.bens[i] = validarLancamento(
        zBemDireito,
        mesclar(bem, alteracoes),
        FICHAS.bens,
        alteracoes,
      );
      return `Partilha do bem ${a.indice} atualizada.`;
    },
  );

  definir(
    r,
    "aplicar_caso_especial_bem",
    "Aplicar caso especial a um bem",
    "Aplica a um bem (posição em listar_lancamentos com ficha 'bens') um caso especial: usufruto (com os CPF/CNPJ dos proprietários ou usufrutuários), bem a inventariar, atualização pela Lei 14.973/2024 ou criptoativo em custodiante; 'desfazer': true desmarca.",
    {
      indice: zIndice,
      caso: z.enum(["usufruto", "bemAInventariar", "atualizacaoLei14973", "custodiante"]),
      proprietarios: z.array(z.string().max(18)).max(50).optional(),
      desfazer: z.boolean().optional(),
    },
    (dec, a) => {
      const i = (a.indice as number) - 1;
      const bem = dec.bens[i];
      if (!bem) throw new EntradaInvalidaError(`Não há bem na posição ${a.indice}.`);
      const ligado = !a.desfazer;
      const alt: Item = {};
      if (a.caso === "usufruto") {
        alt.usufruto = ligado;
        alt.proprietariosUsufrutuarios = ligado
          ? ((a.proprietarios as string[] | undefined) ?? bem.proprietariosUsufrutuarios).map((x) =>
              x.replace(/\D/g, ""),
            )
          : [];
      } else if (a.caso === "bemAInventariar") alt.bemAInventariar = ligado;
      else if (a.caso === "atualizacaoLei14973") alt.atualizadoLei14973 = ligado;
      else alt.custodiante = ligado;
      dec.bens[i] = validarLancamento(zBemDireito, { ...bem, ...alt }, FICHAS.bens, alt);
      return `Bem ${a.indice}: ${a.caso} ${ligado ? "aplicado" : "desfeito"}.`;
    },
  );
}

/** Nomes ligados a um CPF/CNPJ dentro de uma declaração. */
function nomesDoDocumento(dec: Declaracao, ni: string): { ficha: string; nome: string }[] {
  const achados: { ficha: string; nome: string }[] = [];
  const add = (ficha: string, doc: string | undefined, nome: string | undefined) => {
    if (doc === ni && nome) achados.push({ ficha, nome });
  };
  add(FICHAS.identificacao, dec.identificacao.cpf, dec.identificacao.nome);
  for (const d of dec.dependentes) add(FICHAS.dependentes, d.cpf, d.nome);
  for (const d of dec.alimentandos) add(FICHAS.alimentandos, d.cpf, d.nome);
  for (const x of dec.rendimentosPJ) add(FICHAS.rendimentosPJ, x.fonte.ni, x.fonte.nome);
  for (const x of dec.rendimentosExigibilidadeSuspensa)
    add(FICHAS.rendimentosExigibilidadeSuspensa, x.fonte.ni, x.fonte.nome);
  for (const x of dec.rendimentosAcumulados)
    add(FICHAS.rendimentosAcumulados, x.fonte.ni, x.fonte.nome);
  for (const x of dec.rendimentosIsentos) {
    if ("fonte" in x && x.fonte) add(FICHAS.rendimentosIsentos, x.fonte.ni, x.fonte.nome);
    if ("doador" in x) add(FICHAS.rendimentosIsentos, x.doador.ni, x.doador.nome);
  }
  for (const x of dec.rendimentosExclusivos)
    if ("fonte" in x) add(FICHAS.rendimentosExclusivos, x.fonte.ni, x.fonte.nome);
  for (const p of dec.pagamentos) add(FICHAS.pagamentos, p.niBeneficiario, p.nomeBeneficiario);
  for (const p of dec.doacoesEfetuadas)
    add(FICHAS.doacoesEfetuadas, p.niBeneficiario, p.nomeBeneficiario);
  for (const p of dec.doacoesPartidos) add(FICHAS.doacoesPartidos, p.cnpj, p.nome);
  for (const h of dec.herdeiros) add(FICHAS.herdeiros, h.ni, h.nome);
  return achados.filter(
    (a, i) => achados.findIndex((b) => b.nome === a.nome && b.ficha === a.ficha) === i,
  );
}

export const grupoEdicao: GrupoFerramentas = {
  nome: "edicao",
  descricao: "Inclusão, edição, remoção e listagem de lançamentos de cada ficha da declaração.",
  exigePasta: true,
  registrar(r) {
    registrarFichasLista(r);
    registrarGenericas(r);
    registrarDefinir(r);
    r.ferramenta(
      "buscar_nome_por_documento",
      {
        titulo: "Buscar nome já informado para um CPF ou CNPJ",
        descricao:
          "Procura, nos DBK/DEC da pasta autorizada, o nome já informado para um CPF ou CNPJ (fontes pagadoras, dependentes, beneficiários de pagamentos e doações). Não consulta a Receita Federal.",
        entrada: {
          documento: z.string().min(11).max(18).describe("CPF ou CNPJ, com ou sem pontuação."),
        },
        saida: {
          documento: z.string(),
          encontrados: z.array(
            z.object({ arquivo: z.string(), ficha: z.string(), nome: z.string() }),
          ),
          arquivosLidos: z.number(),
        },
      },
      async ({ documento }) => {
        const ni = documento.replace(/\D/g, "");
        if (ni.length !== 11 && ni.length !== 14) {
          throw new EntradaInvalidaError("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos).");
        }
        const pasta = exigirPasta(r.ctx);
        const arquivos = (await pasta.listar(EXT_DECLARACAO))
          .filter((a) => !/-\d{4}-\d{4}-GCAP-\d{4}\.DEC$/i.test(a.nome))
          .slice(0, 100);
        const encontrados: { arquivo: string; ficha: string; nome: string }[] = [];
        let lidos = 0;
        for (const a of arquivos) {
          try {
            const { declaracao } = await abrirDeclaracao(r.ctx, a.nome);
            lidos++;
            for (const x of nomesDoDocumento(declaracao, ni))
              encontrados.push({ arquivo: a.nome, ...x });
          } catch {
            /* arquivo ilegível: ignorado */
          }
        }
        return {
          texto: encontrados.length
            ? blocoDeDados(
                "pasta autorizada",
                encontrados.map((e) => `- ${e.nome} (${e.ficha}, ${e.arquivo})`).join("\n"),
              )
            : `Nenhum nome encontrado para o documento em ${lidos} arquivo(s).`,
          dados: { documento: ni, encontrados, arquivosLidos: lidos },
        };
      },
    );
  },
};
