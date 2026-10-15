/**
 * Totais recalculados a partir do modelo, conferidos com os arquivos do programa oficial.
 *
 * Cada campo de total que o MCP Imposto de Renda recalcula é comparado com o valor gravado pelo programa em
 * todos os casos de referência. Divergências conhecidas do motor de cálculo (em correção contra
 * os casos golden) ficam listadas em `DIVERGENCIAS_CONHECIDAS`, com o número de casos.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { modeloParaRegistros, registrosParaModelo } from "../../src/conversao/index.js";
import { indicadorImpostoPago } from "../../src/conversao/recalculo.js";
import { lerArquivo, verificarControles } from "../../src/dbk/index.js";
import { zDeclaracao } from "../../src/model/index.js";

const PASTA = fileURLToPath(new URL("../fixtures/dbk/2026/", import.meta.url));
const arquivos = existsSync(PASTA)
  ? readdirSync(PASTA)
      .filter((n) => /\.dbk$/i.test(n))
      .sort()
  : [];

const TIPOS_TOTAIS = new Set(["IR", "16", "17", "18", "19", "20"]);
const IGNORAR = new Set(["NR_CONTROLE", "NR_HASH"]);

/**
 * Campos que, sem o arquivo base, não são reproduzidos: dados do ambiente em que o programa
 * rodou (sistema operacional, Java, endereço de rede e um controle interno em FILLER3) e as
 * doações diretas que o
 * programa mantém no header de uma declaração simplificada sem os registros 91 e 92.
 */
const CAMPOS_FORA_DO_MODELO: readonly string[] = [
  // Mensagem do recibo sobre débito automático, texto fixo do programa com saldo a pagar.
  "16.TX_MENSAGEM_RECIBO",
  // Transporte da renda variável para o Resumo (ganho líquido e imposto), não recalculado.
  "18.VR_GANHOLIQUIDORVTRANSPORTE",
  "18.VR_IMPOSTO_GANHOLIQ_RVAR",
  "18.VR_SUBTOTALEXCLUSIVOTRANSPORTE",
  // Transporte do GCAP para o Resumo (imposto devido e isentos), não recalculado, e indicador
  // interno de isenção do titular no header.
  "18.VR_IMPOSTO_DEVIDO_GCAP",
  // Imposto do ganho de bens adquiridos em moeda estrangeira e da moeda em espécie.
  "18.VR_IMPOSTO_DEVIDO_GCME",
  "18.VR_IMPPAGARESPECIE",
  "18.VR_RENDISENTOGCTRANSPORTE",
  "18.VR_SUBTOTALISENTOTRANSPORTE",
  "IR.IN_ISENCAO_GCAP_TITULAR",
  // GCAP: endereço do imóvel, que o modelo não guarda, e o detalhe das reduções da apuração
  // do imóvel (o modelo guarda só a soma das reduções).
  "61.END_CEP",
  "61.END_LOGRADOURO",
  "61.END_NUMERO",
  "61.END_TIPO_LOGRADOURO",
  "68.FT_APLICA_UNICO_APURACAO",
  "68.FT_REDUCAO_LEI11196FR1",
  "68.FT_REDUCAO_LEI11196FR2",
  "68.FT_REDUCAO_LEI7713_APURACAO",
  "68.VR_APLICA_UNICO_APURACAO",
  "68.VR_REDUCAO_LEI11196FR1",
  "68.VR_REDUCAO_LEI11196FR2",
  "68.VR_REDUCAO_LEI7713_APURACAO",
  "68.VR_RESULTADO_2_APURACAO",
  "68.VR_RESULTADO_3_APURACAO",
  "68.VR_RESULTADO_4_APURACAO",
  // Critérios de obrigatoriedade além dos rendimentos tributáveis (bolsa, atividade rural).
  "IR.IN_CRIT_OBRIGAT",
  "IR.ENDERECO_MAC",
  "IR.FILLER3",
  "IR.NOME_SO",
  "IR.VERSAO_JVM",
  "IR.VERSAO_SO",
  "IR.VR_DOACAO_ECA",
  "IR.VR_DOACAO_IDOSO",
];

function divergencias(nome: string): Map<string, string> {
  const lido = lerArquivo(new Uint8Array(readFileSync(join(PASTA, nome))));
  const dec = zDeclaracao.parse(registrosParaModelo(lido.registros).declaracao);
  const novo = modeloParaRegistros(dec, { base: lido.registros, totais: "recalcular" });
  expect(verificarControles(novo.registros).valido).toBe(true);
  const dif = new Map<string, string>();
  lido.registros.forEach((r, i) => {
    if (!TIPOS_TOTAIS.has(r.tipo)) return;
    const o = novo.registros[i];
    expect(o?.tipo).toBe(r.tipo);
    for (const [k, v] of Object.entries(r.campos)) {
      if (IGNORAR.has(k)) continue;
      const w = o?.campos[k];
      const vazio = (x: unknown) => x === null || x === 0n || x === "" || x === "00000000";
      if (v !== w && !(vazio(v) && vazio(w)))
        dif.set(`${r.tipo}.${k}`, `${String(v)} != ${String(w)}`);
    }
  });
  return dif;
}

describe("recálculo dos totais do Resumo e do header", () => {
  if (arquivos.length === 0) {
    it.skip(`sem arquivos em ${PASTA}`, () => {});
    return;
  }

  it("todos os totais recalculados conferem com o programa oficial", () => {
    const porCampo = new Map<string, string[]>();
    for (const nome of arquivos) {
      for (const [campo, detalhe] of divergencias(nome)) {
        porCampo.set(campo, [...(porCampo.get(campo) ?? []), `${nome}: ${detalhe}`]);
      }
    }
    const resumo = [...porCampo]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([c, l]) => `${c} (${l.length}): ${l.slice(0, 2).join(" | ")}`);
    expect(resumo).toEqual([]);
  });

  it("sem arquivo base, só os campos que o modelo não descreve ficam diferentes", () => {
    const porCampo = new Map<string, number>();
    for (const nome of arquivos) {
      const lido = lerArquivo(new Uint8Array(readFileSync(join(PASTA, nome))));
      const dec = zDeclaracao.parse(registrosParaModelo(lido.registros).declaracao);
      const novo = modeloParaRegistros(dec).registros;
      expect(novo.map((r) => r.tipo)).toEqual(lido.registros.map((r) => r.tipo));
      lido.registros.forEach((r, i) => {
        for (const [k, v] of Object.entries(r.campos)) {
          if (IGNORAR.has(k)) continue;
          const w = novo[i]?.campos[k];
          const vazio = (x: unknown) => x === null || x === 0n || x === "" || x === "00000000";
          if (v !== w && !(vazio(v) && vazio(w))) {
            porCampo.set(`${r.tipo}.${k}`, (porCampo.get(`${r.tipo}.${k}`) ?? 0) + 1);
          }
        }
      });
    }
    expect([...porCampo.keys()].sort()).toEqual([...CAMPOS_FORA_DO_MODELO].sort());
  });
});

describe("IN_IMPOSTO_PAGO", () => {
  // Valores observados no harness: combinações de IRRF, carnê-leão e complementar.
  it.each([
    [0n, 0n, 0n, false, 0n],
    [1n, 0n, 0n, false, 1n],
    [0n, 1n, 0n, false, 6n],
    [0n, 0n, 1n, false, 6n],
    [1n, 1n, 1n, false, 7n],
    [1n, 0n, 0n, true, 1n],
    [0n, 1n, 0n, true, 2n],
    [1n, 1n, 0n, true, 3n],
    [0n, 0n, 1n, true, 4n],
  ])(
    "IRRF %s, carnê %s, complementar %s, completa %s: %s",
    (irrf, carneLeao, complementar, completa, esperado) => {
      expect(indicadorImpostoPago({ irrf, carneLeao, complementar }, completa)).toBe(esperado);
    },
  );
});
