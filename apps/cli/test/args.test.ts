import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { interpretarArgs } from "../src/args.js";

const pasta = mkdtempSync(join(tmpdir(), "autoir-cli-"));
const arquivo = join(pasta, "arquivo.txt");
writeFileSync(arquivo, "x");

afterAll(() => {
  rmSync(pasta, { recursive: true, force: true });
});

describe("interpretarArgs", () => {
  it("inicia sem --dir", () => {
    expect(interpretarArgs([])).toEqual({ acao: "iniciar" });
  });

  it("resolve --dir existente para caminho absoluto", () => {
    expect(interpretarArgs(["--dir", pasta])).toEqual({ acao: "iniciar", diretorio: pasta });
    expect(interpretarArgs(["--dir", "."], pasta)).toEqual({ acao: "iniciar", diretorio: pasta });
  });

  it("rejeita pasta inexistente, arquivo e valor vazio", () => {
    expect(interpretarArgs(["--dir", join(pasta, "nao-existe")]).acao).toBe("erro");
    expect(interpretarArgs(["--dir", arquivo]).acao).toBe("erro");
    expect(interpretarArgs(["--dir", ""]).acao).toBe("erro");
  });

  it("rejeita opção desconhecida e posicional", () => {
    expect(interpretarArgs(["--xyz"]).acao).toBe("erro");
    expect(interpretarArgs(["solto"]).acao).toBe("erro");
    expect(interpretarArgs(["--dir"]).acao).toBe("erro");
  });

  it("reconhece ajuda e versão", () => {
    expect(interpretarArgs(["--help"])).toEqual({ acao: "ajuda" });
    expect(interpretarArgs(["-v"])).toEqual({ acao: "versao" });
  });
});
