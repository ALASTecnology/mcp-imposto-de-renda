/**
 * `importar_livro_caixa_rural` contra os pares do programa oficial (dados sintéticos): o arquivo
 * que o Livro Caixa da Atividade Rural 2025 exporta para o IRPF 2026
 * (`core/test/fixtures/atividade-rural/2026/<caso>.DEC`) e o DBK que o IRPF grava depois de
 * importá-lo (`core/test/fixtures/dbk/2026/<caso>.DBK`).
 */
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type Declaracao,
  gravarArquivo,
  lerArquivo,
  modeloParaRegistros,
  registrosParaModelo,
  zDeclaracao,
} from "@mcp-imposto-de-renda/core";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type Conexao, conectar, fixture, textoDe } from "./apoio.js";

const AR = fileURLToPath(
  new URL("../../core/test/fixtures/atividade-rural/2026/", import.meta.url),
);
const casos = readdirSync(AR)
  .filter((n) => n.endsWith(".DEC"))
  .map((n) => n.replace(/\.DEC$/, ""))
  .sort();

let base: string;
let pasta: string;
let c: Conexao;

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-ar-")));
  pasta = join(base, "ir");
  mkdirSync(pasta);
  c = await conectar({ diretorioAutorizado: pasta });
});
afterEach(async () => {
  await c.fechar();
  rmSync(base, { recursive: true, force: true });
});

const modeloDe = (bytes: Uint8Array) =>
  zDeclaracao.parse(registrosParaModelo(lerArquivo(bytes).registros).declaracao);

/** A declaração antes de importar: sem os valores que o Livro Caixa traz. */
function antes(dec: Declaracao): Declaracao {
  const ar = dec.atividadeRural;
  return zDeclaracao.parse({
    ...dec,
    rendimentosIsentos: dec.rendimentosIsentos.filter((i) => i.codigo !== "15"),
    ...(ar
      ? {
          atividadeRural: {
            ...ar,
            brasil: {
              ...ar.brasil,
              receitasDespesas: [],
              apuracao: {
                ...ar.brasil.apuracao,
                adiantamentosRecebidos: 0n,
                adiantamentosAnterioresEntregues: 0n,
              },
            },
            exterior: { ...ar.exterior, receitasDespesas: [] },
          },
        }
      : {}),
  });
}

const nomeExportado = (cpf: string) => `${cpf}-ARURAL-2025-2025-EXPORTA-IRPF2026.DEC`;

describe("importar_livro_caixa_rural", () => {
  it("há os pares de referência", () => {
    expect(casos.length).toBeGreaterThanOrEqual(3);
  });

  it.each(casos)("%s: a declaração fica como a gravada pelo programa", async (caso) => {
    const oficial = modeloDe(fixture(`${caso}.DBK`));
    writeFileSync(
      join(pasta, "decl.DBK"),
      gravarArquivo(modeloParaRegistros(antes(oficial)).registros),
    );
    const exportado = nomeExportado(oficial.identificacao.cpf);
    writeFileSync(join(pasta, exportado), readFileSync(join(AR, `${caso}.DEC`)));
    const r = await c.chamar("importar_livro_caixa_rural", {
      arquivo: "decl.DBK",
      arquivo_livro_caixa: exportado,
    });
    expect(r.isError, textoDe(r)).toBeFalsy();
    const depois = modeloDe(new Uint8Array(readFileSync(join(pasta, "decl.DBK"))));
    expect(depois.atividadeRural).toEqual(oficial.atividadeRural);
    expect(depois.rendimentosIsentos).toEqual(oficial.rendimentosIsentos);
    const s = r.structuredContent as Record<string, unknown>;
    expect(s.cpf).toBe(oficial.identificacao.cpf);
  });

  it("recusa o Livro Caixa de outro CPF", async () => {
    writeFileSync(join(pasta, "outra.DBK"), fixture("pj-simples-01.DBK"));
    writeFileSync(join(pasta, "x.DEC"), readFileSync(join(AR, `${casos[0]}.DEC`)));
    const r = await c.chamar("importar_livro_caixa_rural", {
      arquivo: "outra.DBK",
      arquivo_livro_caixa: "x.DEC",
    });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/não é o titular/);
  });

  it("recusa arquivo que não é o exportado pelo Livro Caixa", async () => {
    writeFileSync(join(pasta, "decl.DBK"), fixture("pj-simples-01.DBK"));
    writeFileSync(join(pasta, "errado.DEC"), fixture("pj-simples-01.DEC"));
    const r = await c.chamar("importar_livro_caixa_rural", {
      arquivo: "decl.DBK",
      arquivo_livro_caixa: "errado.DEC",
    });
    expect(r.isError).toBe(true);
    expect(textoDe(r)).toMatch(/Livro Caixa/);
  });
});
