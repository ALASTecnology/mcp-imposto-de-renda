import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ajuda, interpretarArgs } from "../src/args.js";

const pasta = mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-cli-"));
const arquivo = join(pasta, "arquivo.txt");
writeFileSync(arquivo, "x");
const somenteLeitura = join(pasta, "ro");
mkdirSync(somenteLeitura);
chmodSync(somenteLeitura, 0o500);

afterAll(() => {
  chmodSync(somenteLeitura, 0o700);
  rmSync(pasta, { recursive: true, force: true });
});

// O ambiente de quem roda os testes não pode mudar o perfil padrão.
beforeEach(() => vi.stubEnv("MCP_IMPOSTO_DE_RENDA_PERFIL", undefined));
afterEach(() => vi.unstubAllEnvs());

describe("interpretarArgs", () => {
  it("ignora o perfil herdado do ambiente quando a variável está ausente", () => {
    expect(process.env.MCP_IMPOSTO_DE_RENDA_PERFIL).toBeUndefined();
    expect(interpretarArgs(["--dir", pasta])).toMatchObject({ perfil: "completo" });
  });

  it("exige --dir", () => {
    expect(interpretarArgs([])).toEqual({ acao: "erro", mensagem: "--dir é obrigatório" });
  });

  it("resolve --dir existente para caminho absoluto", () => {
    expect(interpretarArgs(["--dir", pasta])).toEqual({
      acao: "iniciar",
      diretorio: pasta,
      somenteLeitura: false,
      perfil: "completo",
    });
    expect(interpretarArgs(["--dir", "."], pasta)).toMatchObject({ diretorio: pasta });
  });

  it("liga o modo somente leitura", () => {
    expect(interpretarArgs(["--dir", pasta, "--somente-leitura"])).toMatchObject({
      acao: "iniciar",
      somenteLeitura: true,
    });
  });

  it("rejeita pasta inexistente, arquivo e valor vazio", () => {
    expect(interpretarArgs(["--dir", join(pasta, "nao-existe")]).acao).toBe("erro");
    expect(interpretarArgs(["--dir", arquivo]).acao).toBe("erro");
    expect(interpretarArgs(["--dir", ""]).acao).toBe("erro");
  });

  it.skipIf(process.getuid?.() === 0)("exige pasta gravável, salvo no modo somente leitura", () => {
    const r = interpretarArgs(["--dir", somenteLeitura]);
    expect(r).toMatchObject({ acao: "erro" });
    expect(r.acao === "erro" ? r.mensagem : "").toMatch(/gravação/);
    expect(interpretarArgs(["--dir", somenteLeitura, "--somente-leitura"]).acao).toBe("iniciar");
  });

  it("rejeita opção desconhecida e posicional com mensagem em pt-BR", () => {
    const r = interpretarArgs(["--xyz"]);
    expect(r).toEqual({ acao: "erro", mensagem: "opção desconhecida: --xyz" });
    expect(interpretarArgs(["solto"]).acao).toBe("erro");
    expect(interpretarArgs(["--dir"]).acao).toBe("erro");
  });

  it("reconhece ajuda e versão em pt-BR e os apelidos usuais", () => {
    expect(interpretarArgs(["--ajuda"])).toEqual({ acao: "ajuda" });
    expect(interpretarArgs(["--help"])).toEqual({ acao: "ajuda" });
    expect(interpretarArgs(["--versao"])).toEqual({ acao: "versao" });
    expect(interpretarArgs(["-v"])).toEqual({ acao: "versao" });
    expect(ajuda()).toContain("--somente-leitura");
  });

  it("aceita --perfil e a variável MCP_IMPOSTO_DE_RENDA_PERFIL, com a opção valendo mais", () => {
    expect(interpretarArgs(["--dir", pasta, "--perfil", "essencial"])).toMatchObject({
      acao: "iniciar",
      perfil: "essencial",
    });
    const env = { MCP_IMPOSTO_DE_RENDA_PERFIL: "consulta" };
    expect(interpretarArgs(["--dir", pasta], pasta, env)).toMatchObject({ perfil: "consulta" });
    expect(interpretarArgs(["--dir", pasta, "--perfil", "completo"], pasta, env)).toMatchObject({
      perfil: "completo",
    });
    expect(
      interpretarArgs(["--dir", pasta], pasta, { MCP_IMPOSTO_DE_RENDA_PERFIL: " " }),
    ).toMatchObject({
      perfil: "completo",
    });
  });

  it("rejeita perfil desconhecido com a lista dos válidos", () => {
    expect(interpretarArgs(["--dir", pasta, "--perfil", "minimo"])).toEqual({
      acao: "erro",
      mensagem: '--perfil: perfil desconhecido "minimo"; use completo, essencial ou consulta',
    });
    const r = interpretarArgs(["--dir", pasta], pasta, { MCP_IMPOSTO_DE_RENDA_PERFIL: "x" });
    expect(r.acao === "erro" ? r.mensagem : "").toMatch(
      /^MCP_IMPOSTO_DE_RENDA_PERFIL: perfil desconhecido "x"/,
    );
  });

  it("seleciona e tira grupos, validando os nomes", () => {
    expect(interpretarArgs(["--dir", pasta, "--grupos", "calculo, validacao"])).toMatchObject({
      grupos: ["calculo", "validacao"],
    });
    const sem = interpretarArgs(["--dir", pasta, "--sem-grupos", "calculadoras,orientacao"]);
    expect(sem.acao === "iniciar" ? sem.grupos : []).not.toContain("calculadoras");
    expect(sem.acao === "iniciar" ? sem.grupos?.length : 0).toBe(9);
    expect(
      interpretarArgs(["--dir", pasta, "--grupos", "calculo,edicao", "--sem-grupos", "edicao"]),
    ).toMatchObject({ grupos: ["calculo"] });
    const r = interpretarArgs(["--dir", pasta, "--grupos", "calculo,impostos"]);
    expect(r.acao).toBe("erro");
    expect(r.acao === "erro" ? r.mensagem : "").toMatch(
      /^--grupos: grupo desconhecido "impostos"; grupos válidos: calculo, declaracao, /,
    );
    expect(interpretarArgs(["--dir", pasta, "--grupos", " , "])).toMatchObject({
      acao: "erro",
      mensagem: "--grupos: informe ao menos um grupo",
    });
    expect(
      interpretarArgs(["--dir", pasta, "--grupos", "calculo", "--sem-grupos", "calculo"]),
    ).toMatchObject({
      acao: "erro",
      mensagem: "nenhum grupo de ferramentas restou depois de --grupos e --sem-grupos",
    });
  });

  it.skipIf(process.getuid?.() === 0)("o perfil consulta dispensa pasta gravável", () => {
    expect(interpretarArgs(["--dir", somenteLeitura, "--perfil", "consulta"]).acao).toBe("iniciar");
  });

  it("mostra na ajuda quantas ferramentas cada perfil expõe e os grupos", () => {
    expect(ajuda()).toMatch(/completo\s+162 ferramentas/);
    expect(ajuda()).toMatch(/essencial\s+86 ferramentas/);
    expect(ajuda()).toMatch(/consulta\s+40 ferramentas/);
    expect(ajuda()).toContain("MCP_IMPOSTO_DE_RENDA_PERFIL");
    expect(ajuda()).toContain("--sem-grupos");
    expect(ajuda()).toContain("calculadoras (10)");
  });
});
