/**
 * Perfis de ferramentas: quantas e quais ferramentas cada perfil expõe, e coerência entre o
 * catálogo calculado sem servidor e o `tools/list` do servidor de verdade.
 */
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { FICHAS_LISTA } from "../src/ferramentas/edicao-fichas.js";
import {
  catalogoFerramentas,
  createServer,
  ferramentasRegistradas,
  GRUPOS,
  NOMES_PERFIS,
  PERFIS,
} from "../src/index.js";
import { conectar } from "./apoio.js";

const pasta = mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-perfis-"));
afterAll(() => rmSync(pasta, { recursive: true, force: true }));

const nomes = (perfil: (typeof NOMES_PERFIS)[number]) =>
  catalogoFerramentas({ perfil }).map((f) => f.nome);

describe("perfis de ferramentas", () => {
  it("expõe a contagem documentada de cada perfil", () => {
    const contagem = Object.fromEntries(NOMES_PERFIS.map((p) => [p, nomes(p).length]));
    expect(contagem).toEqual({ completo: 158, essencial: 82, consulta: 38 });
  });

  it("completo é o padrão e cada perfil tem descrição", () => {
    expect(nomes("completo")).toEqual(catalogoFerramentas().map((f) => f.nome));
    for (const p of NOMES_PERFIS) expect(PERFIS[p].descricao.length).toBeGreaterThan(20);
  });

  it("essencial cabe nos limites de 100 (Cascade) e 128 (VS Code) e preserva a escrita", () => {
    const essencial = nomes("essencial");
    expect(essencial.length).toBeLessThanOrEqual(100);
    const todas = new Set(nomes("completo"));
    for (const n of essencial) expect(todas.has(n)).toBe(true);
    // Todo o ciclo de uma declaração continua disponível.
    for (const n of [
      "criar_declaracao",
      "definir_identificacao",
      "importar_informe_rendimentos",
      "definir_informacoes_bancarias",
      "listar_fichas",
      "listar_lancamentos",
      "editar_lancamento",
      "remover_lancamento",
      "validar_declaracao",
      "simular_imposto",
      "comparar_modelos",
      "gerar_arquivo_entrega",
      "gerar_darf",
      "instruir_transmissao",
      "criar_retificadora",
      "restaurar_copia_seguranca",
    ]) {
      expect(essencial, n).toContain(n);
    }
    // Toda ficha em lista continua aceitando inclusão; a edição vai pelas genéricas.
    for (const f of FICHAS_LISTA.filter((x) => x.singular)) {
      expect(essencial).toContain(`adicionar_${f.singular}`);
      expect(essencial).not.toContain(`editar_${f.singular}`);
      expect(essencial).not.toContain(`remover_${f.singular}`);
      expect(essencial).not.toContain(`listar_${f.plural}`);
    }
    expect(essencial).not.toContain("calcular_carne_leao");
  });

  it("consulta só lê e calcula", () => {
    const consulta = catalogoFerramentas({ perfil: "consulta" });
    expect(consulta.filter((f) => f.escreve)).toEqual([]);
    const n = consulta.map((f) => f.nome);
    for (const x of [
      "simular_imposto",
      "validar_declaracao",
      "listar_lancamentos",
      "calcular_carne_leao",
    ])
      expect(n).toContain(x);
    expect(n).not.toContain("listar_dependentes");
  });

  it("filtra por grupos e combina com somente leitura", () => {
    const so = catalogoFerramentas({
      grupos: GRUPOS.filter((g) => g.nome === "calculo" || g.nome === "validacao"),
    });
    expect(new Set(so.map((f) => f.grupo))).toEqual(new Set(["calculo", "validacao"]));
    expect(so).toHaveLength(8);
    const leitura = catalogoFerramentas({ perfil: "essencial", somenteLeitura: true });
    expect(leitura.filter((f) => f.escreve)).toEqual([]);
    expect(GRUPOS.map((g) => g.nome)).toContain("edicao");
  });

  it.each(NOMES_PERFIS)("o servidor com perfil %s lista o mesmo catálogo", async (perfil) => {
    const c = await conectar({ diretorioAutorizado: pasta, perfil });
    try {
      const lista = (await c.client.listTools()).tools.map((t) => t.name);
      expect(lista).toEqual(nomes(perfil));
    } finally {
      await c.fechar();
    }
  });

  it.each(NOMES_PERFIS)(
    "no perfil %s, nenhuma descrição cita ferramenta ausente",
    async (perfil) => {
      const todas = nomes("completo");
      const c = await conectar({ diretorioAutorizado: pasta, perfil });
      try {
        const lista = (await c.client.listTools()).tools;
        const presentes = new Set(lista.map((t) => t.name));
        const ausentes = todas.filter((n) => !presentes.has(n));
        const citacoes: string[] = [];
        for (const t of lista) {
          const texto = `${t.description ?? ""} ${JSON.stringify(t.inputSchema)}`;
          for (const n of ausentes) {
            if (new RegExp(`\\b${n}\\b`).test(texto)) citacoes.push(`${t.name} cita ${n}`);
          }
        }
        expect(citacoes).toEqual([]);
      } finally {
        await c.fechar();
      }
    },
  );

  it("rejeita perfil desconhecido com mensagem em pt-BR", () => {
    const msg = 'perfil desconhecido "tudo"; use completo, essencial ou consulta';
    expect(() => catalogoFerramentas({ perfil: "tudo" as never })).toThrow(msg);
    expect(() => createServer({ perfil: "tudo" as never })).toThrow(msg);
  });

  it("o servidor informa quantas ferramentas registrou", () => {
    for (const perfil of NOMES_PERFIS) {
      const s = createServer({ diretorioAutorizado: pasta, perfil });
      expect(ferramentasRegistradas(s)).toEqual(nomes(perfil));
    }
  });
});
