import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { AJUDA, interpretarArgs } from "../src/args.js";

const pasta = mkdtempSync(join(tmpdir(), "autoir-cli-"));
const arquivo = join(pasta, "arquivo.txt");
writeFileSync(arquivo, "x");
const somenteLeitura = join(pasta, "ro");
mkdirSync(somenteLeitura);
chmodSync(somenteLeitura, 0o500);

afterAll(() => {
  chmodSync(somenteLeitura, 0o700);
  rmSync(pasta, { recursive: true, force: true });
});

describe("interpretarArgs", () => {
  it("exige --dir", () => {
    expect(interpretarArgs([])).toEqual({ acao: "erro", mensagem: "--dir é obrigatório" });
  });

  it("resolve --dir existente para caminho absoluto", () => {
    expect(interpretarArgs(["--dir", pasta])).toEqual({
      acao: "iniciar",
      diretorio: pasta,
      somenteLeitura: false,
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
    expect(AJUDA).toContain("--somente-leitura");
  });
});
