/**
 * Importação do arquivo que o programa do Livro Caixa da Atividade Rural 2025 grava em
 * "Exportar para o IRPF" (`<CPF>-ARURAL-2025-2025-EXPORTA-IRPF2026.DEC`): texto de linhas de
 * tamanho fixo com o header `IR`, a identificação (`01`), o país e a moeda (`02`), o
 * demonstrativo de cada mês (`04A` a `04L`: receitas, despesas de custeio e investimento,
 * despesas não dedutíveis, receita de produtos entregues por adiantamentos de anos anteriores e
 * adiantamentos recebidos para entrega futura, em centavos, e o país) e o controle `99`, CRC32
 * decimal das linhas anteriores concatenadas sem os terminadores. O programa da Atividade Rural
 * 2026 exporta para o IRPF 2027 (header com exercício 2027), que o IRPF 2026 recusa.
 *
 * A distribuição pelas fichas foi conferida com os pares de arquivo exportado e DBK gravado
 * pelo IRPF 2026 depois da importação, gerados com dados sintéticos pelo harness de referência
 * (`packages/core/test/fixtures/atividade-rural/2026` e `fixtures/dbk/2026/ar-*`):
 *
 * - Brasil (país 105): os meses de Receitas e Despesas são substituídos pelos do arquivo
 *   (receita bruta e despesa de custeio e investimento); as despesas não dedutíveis não entram;
 *   na Apuração, a receita de produtos entregues e os adiantamentos recebidos são a soma do ano;
 * - Exterior: uma linha por país com a receita e a despesa do ano em moeda original, que
 *   substitui a do mesmo país; o resultado em dólar fica para o contribuinte informar.
 *
 * O resto da ficha (imóveis, forma de apuração, prejuízo, rebanho, bens e dívidas) é mantido.
 */
import { type Declaracao, zDeclaracao } from "../model/declaracao.js";
import { apurarAbaRural } from "./mapeadores/atividade-rural.js";

/** Erro de leitura ou de aplicação do arquivo exportado pelo Livro Caixa da Atividade Rural. */
export class ExportacaoLivroCaixaRuralInvalidaError extends Error {
  override readonly name = "ExportacaoLivroCaixaRuralInvalidaError";
}

/** Exercício da declaração que importa o arquivo e ano-calendário do Livro Caixa. */
const EXERCICIO = 2026;
const ANO_BASE = 2025;

/** Valores de um mês do demonstrativo, em centavos (moeda original no exterior). */
export interface MesLivroCaixaRural {
  receitas: bigint;
  despesas: bigint;
  despesasNaoDedutiveis: bigint;
  produtoEntregueAdiantamento: bigint;
  adiantamentoRecebido: bigint;
}

/** Demonstrativo de um país (Brasil é o 105). */
export interface DemonstrativoLivroCaixaRural {
  pais: string;
  moeda: string;
  /** Os 12 meses, de janeiro a dezembro. */
  meses: MesLivroCaixaRural[];
}

export interface ExportacaoLivroCaixaRural {
  cpf: string;
  nome: string;
  exercicio: number;
  anoBase: number;
  versao: string;
  demonstrativos: DemonstrativoLivroCaixaRural[];
}

const TABELA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array, inicial = 0): number {
  let c = ~inicial >>> 0;
  for (const b of bytes) c = (TABELA_CRC[(c ^ b) & 0xff] as number) ^ (c >>> 8);
  return ~c >>> 0;
}

const MESES = "ABCDEFGHIJKL";
const campo = (l: string, inicio: number, tamanho: number) => l.slice(inicio, inicio + tamanho);
const valor = (l: string, inicio: number) => {
  const v = campo(l, inicio, 13).trim();
  if (!/^\d{13}$/.test(v)) {
    throw new ExportacaoLivroCaixaRuralInvalidaError(
      `Valor inválido no arquivo do Livro Caixa: "${v}" no registro ${l.slice(0, 3)}.`,
    );
  }
  return BigInt(v);
};

/**
 * Lê o arquivo exportado (bytes em ISO-8859-1, como o programa grava). Confere o header, o
 * exercício e o CRC do registro 99, como a importação do IRPF.
 */
export function lerExportacaoLivroCaixaRural(bytes: Uint8Array): ExportacaoLivroCaixaRural {
  const texto = new TextDecoder("latin1").decode(bytes);
  const linhas = texto.split(/\r?\n/).filter((l) => l !== "");
  const header = linhas[0] ?? "";
  if (!header.startsWith("IR") || campo(header, 2, 8).trim() !== "ARURAL") {
    throw new ExportacaoLivroCaixaRuralInvalidaError(
      "O arquivo não é o exportado pelo Livro Caixa da Atividade Rural (header ARURAL ausente).",
    );
  }
  const exercicio = Number(campo(header, 10, 4));
  const anoBase = Number(campo(header, 14, 4));
  if (exercicio !== EXERCICIO || anoBase !== ANO_BASE) {
    throw new ExportacaoLivroCaixaRuralInvalidaError(
      `O arquivo do Livro Caixa é do ano-calendário ${anoBase} e foi exportado para o IRPF ${exercicio}; a declaração de ${EXERCICIO} importa o do programa Atividade Rural ${ANO_BASE}.`,
    );
  }
  const indiceFim = linhas.findIndex((l) => l.startsWith("99"));
  if (indiceFim < 0) {
    throw new ExportacaoLivroCaixaRuralInvalidaError(
      "Arquivo do Livro Caixa incompleto: falta o registro de controle 99.",
    );
  }
  let crc = 0;
  for (const l of linhas.slice(0, indiceFim)) crc = crc32(latin1(l), crc);
  const controle = campo(linhas[indiceFim] as string, 2, 10);
  if (controle !== String(crc).padStart(10, "0")) {
    throw new ExportacaoLivroCaixaRuralInvalidaError(
      "Arquivo do Livro Caixa corrompido: o controle do registro 99 não confere com o conteúdo.",
    );
  }
  const cpf = campo(header, 18, 11);
  const versao = campo(header, 29, 3);
  let nome = "";
  const demonstrativos: DemonstrativoLivroCaixaRural[] = [];
  let atual: DemonstrativoLivroCaixaRural | undefined;
  for (const l of linhas.slice(1, indiceFim)) {
    const tipo = l.slice(0, 2);
    if (tipo === "01") {
      if (campo(l, 2, 11) !== cpf) {
        throw new ExportacaoLivroCaixaRuralInvalidaError(
          "Arquivo do Livro Caixa com CPF da identificação diferente do header.",
        );
      }
      nome = campo(l, 13, 60).trim();
    } else if (tipo === "02") {
      atual = {
        pais: campo(l, 2, 3),
        moeda: campo(l, 5, 30).trim(),
        meses: Array.from({ length: 12 }, () => ({
          receitas: 0n,
          despesas: 0n,
          despesasNaoDedutiveis: 0n,
          produtoEntregueAdiantamento: 0n,
          adiantamentoRecebido: 0n,
        })),
      };
      demonstrativos.push(atual);
    } else if (tipo === "04") {
      const mes = MESES.indexOf(l[2] ?? "");
      if (!atual || mes < 0) {
        throw new ExportacaoLivroCaixaRuralInvalidaError(
          `Registro ${l.slice(0, 3)} fora de um demonstrativo no arquivo do Livro Caixa.`,
        );
      }
      atual.meses[mes] = {
        receitas: valor(l, 3),
        despesas: valor(l, 16),
        despesasNaoDedutiveis: valor(l, 29),
        produtoEntregueAdiantamento: valor(l, 42),
        adiantamentoRecebido: valor(l, 55),
      };
    }
  }
  if (demonstrativos.length === 0) {
    throw new ExportacaoLivroCaixaRuralInvalidaError(
      "O arquivo do Livro Caixa não tem demonstrativo (registro 02).",
    );
  }
  return { cpf, nome, exercicio, anoBase, versao, demonstrativos };
}

function latin1(s: string): Uint8Array {
  const b = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 0xff;
  return b;
}

const somar = (d: DemonstrativoLivroCaixaRural, f: (m: MesLivroCaixaRural) => bigint) =>
  d.meses.reduce((s, m) => s + f(m), 0n);

/**
 * Aplica o arquivo exportado na declaração como a importação do IRPF 2026 (ver o comentário do
 * módulo) e refaz o isento 15 (resultado não tributável da atividade rural), que o programa
 * transporta da Apuração. O CPF do arquivo precisa ser o do titular.
 */
export function incluirLivroCaixaRural(
  dec: Declaracao,
  arquivo: ExportacaoLivroCaixaRural,
): Declaracao {
  if (arquivo.cpf !== dec.identificacao.cpf) {
    throw new ExportacaoLivroCaixaRuralInvalidaError(
      `O Livro Caixa é do CPF ${arquivo.cpf}, que não é o titular da declaração (${dec.identificacao.cpf}).`,
    );
  }
  // Declaração sem atividade rural: as duas abas começam sem forma de apuração escolhida, como
  // numa declaração nova do programa (caso ar-livro-caixa-exterior-01).
  const nova = { apuracao: { opcao: "naoInformada" } };
  const ar = zDeclaracao.parse({
    ...dec,
    atividadeRural: dec.atividadeRural ?? { brasil: nova, exterior: nova },
  }).atividadeRural as NonNullable<Declaracao["atividadeRural"]>;
  let brasil: Record<string, unknown> = ar.brasil;
  let exterior: Record<string, unknown> = ar.exterior;
  for (const d of arquivo.demonstrativos) {
    if (d.pais === "105") {
      brasil = {
        ...brasil,
        receitasDespesas: d.meses
          .map((m, i) => ({ mes: i + 1, receitaBruta: m.receitas, despesa: m.despesas }))
          .filter((m) => m.receitaBruta > 0n || m.despesa > 0n),
        apuracao: {
          ...ar.brasil.apuracao,
          adiantamentosRecebidos: somar(d, (m) => m.adiantamentoRecebido),
          adiantamentosAnterioresEntregues: somar(d, (m) => m.produtoEntregueAdiantamento),
        },
      };
    } else {
      const receita = somar(d, (m) => m.receitas);
      const despesa = somar(d, (m) => m.despesas);
      const outros = (exterior.receitasDespesas as { pais: string }[]).filter(
        (x) => x.pais !== d.pais,
      );
      const linha = {
        pais: d.pais,
        receitaBrutaMoedaOriginal: receita,
        despesaMoedaOriginal: despesa,
        resultadoDolar: 0n,
      };
      exterior = {
        ...exterior,
        receitasDespesas: receita > 0n || despesa > 0n ? [...outros, linha] : outros,
      };
    }
  }
  const novo = zDeclaracao.parse({ ...dec, atividadeRural: { ...ar, brasil, exterior } });
  const rural = novo.atividadeRural as NonNullable<Declaracao["atividadeRural"]>;
  const naoTributavel =
    apurarAbaRural(rural.brasil, false).naoTributavel +
    apurarAbaRural(rural.exterior, true).naoTributavel;
  const isentos: Record<string, unknown>[] = novo.rendimentosIsentos.filter(
    (i) => i.codigo !== "15",
  );
  if (naoTributavel > 0n) isentos.push({ codigo: "15", valor: naoTributavel });
  isentos.sort((a, b) => String(a.codigo).localeCompare(String(b.codigo)));
  return zDeclaracao.parse({ ...novo, rendimentosIsentos: isentos });
}
