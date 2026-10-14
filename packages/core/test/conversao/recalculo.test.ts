/**
 * Totais recalculados a partir do modelo, conferidos com os arquivos do programa oficial.
 *
 * Cada campo de total que o AutoIR recalcula é comparado com o valor gravado pelo programa em
 * todos os casos de referência. Divergências conhecidas do motor de cálculo (em correção contra
 * os casos golden) ficam listadas em `DIVERGENCIAS_CONHECIDAS`, com o número de casos.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { modeloParaRegistros, registrosParaModelo } from "../../src/conversao/index.js";
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
 * rodou (sistema operacional, Java, endereço de rede e um controle interno em FILLER3), o
 * indicador IN_IMPOSTO_PAGO (regra do programa não determinada) e as doações diretas que o
 * programa mantém no header de uma declaração simplificada sem os registros 91 e 92.
 */
const CAMPOS_FORA_DO_MODELO: readonly string[] = [
  "IR.ENDERECO_MAC",
  "IR.FILLER3",
  "IR.IN_IMPOSTO_PAGO",
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
