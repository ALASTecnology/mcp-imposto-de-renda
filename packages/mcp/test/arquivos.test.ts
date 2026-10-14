import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  abrirPastaAutorizada,
  ErroArquivo,
  PASTA_BACKUPS,
  type PastaAutorizada,
} from "../src/arquivos/index.js";

const DBK = [".DBK"] as const;
const LEITURA = [".DBK", ".DEC", ".json", ".txt"] as const;

let base: string;
let raiz: string;
let fora: string;
let pasta: PastaAutorizada;
let agora: Date;

function relogio(): Date {
  return agora;
}

beforeEach(async () => {
  base = realpathSync(mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-arq-")));
  raiz = join(base, "autorizada");
  fora = join(base, "fora");
  mkdirSync(raiz);
  mkdirSync(fora);
  writeFileSync(join(fora, "segredo.txt"), "dado de fora");
  writeFileSync(join(raiz, "decl.DBK"), "conteudo original");
  agora = new Date(Date.UTC(2026, 9, 14, 12, 0, 0));
  pasta = await abrirPastaAutorizada(raiz, { limiteBytes: 1024, maxBackups: 3, relogio });
});

afterEach(() => {
  rmSync(base, { recursive: true, force: true });
});

async function codigoDoErro(promessa: Promise<unknown>): Promise<string> {
  try {
    await promessa;
  } catch (e) {
    expect(e).toBeInstanceOf(ErroArquivo);
    return (e as ErroArquivo).codigo;
  }
  throw new Error("esperava erro");
}

describe("abrirPastaAutorizada", () => {
  it("rejeita pasta inexistente ou que não é diretório", async () => {
    await expect(abrirPastaAutorizada(join(base, "nao-existe"))).rejects.toBeInstanceOf(
      ErroArquivo,
    );
    await expect(abrirPastaAutorizada(join(raiz, "decl.DBK"))).rejects.toBeInstanceOf(ErroArquivo);
  });
});

describe("resolução de caminhos", () => {
  it.each([
    ["../fora/segredo.txt", "FORA_DA_PASTA"],
    ["sub/../../fora/segredo.txt", "FORA_DA_PASTA"],
    ["..", "FORA_DA_PASTA"],
  ])("bloqueia travessia de diretório: %s", async (nome, codigo) => {
    expect(await codigoDoErro(pasta.ler(nome, LEITURA))).toBe(codigo);
  });

  it("bloqueia caminho absoluto, mesmo apontando para dentro da pasta", async () => {
    expect(await codigoDoErro(pasta.ler(join(fora, "segredo.txt"), LEITURA))).toBe(
      "CAMINHO_INVALIDO",
    );
    expect(await codigoDoErro(pasta.ler(join(raiz, "decl.DBK"), LEITURA))).toBe("CAMINHO_INVALIDO");
    expect(await codigoDoErro(pasta.ler("C:\\Windows\\win.ini", LEITURA))).toBe("CAMINHO_INVALIDO");
  });

  it.each([
    ["decl.DBK\u0000.txt"],
    [""],
    ["   "],
    ["sub\\decl.DBK"],
    [".oculto.DBK"],
    [`${PASTA_BACKUPS}/decl.DBK`],
    ["linha\nquebrada.DBK"],
    [`${"x".repeat(300)}.DBK`],
  ])("rejeita nome inválido: %j", async (nome) => {
    expect(await codigoDoErro(pasta.ler(nome, LEITURA))).toBe("CAMINHO_INVALIDO");
  });

  it.each([["CON.DBK"], ["nul.txt"], ["COM1.json"], ["lpt9.DBK"], ["decl.DBK."]])(
    "rejeita nome de dispositivo ou terminado em ponto: %s",
    async (nome) => {
      expect(await codigoDoErro(pasta.ler(nome, LEITURA))).toBe("CAMINHO_INVALIDO");
    },
  );

  it("aceita só as extensões permitidas, sem diferenciar maiúsculas", async () => {
    writeFileSync(join(raiz, "script.sh"), "echo");
    writeFileSync(join(raiz, "minusculo.dbk"), "ok");
    expect(await codigoDoErro(pasta.ler("script.sh", LEITURA))).toBe("EXTENSAO_NAO_PERMITIDA");
    expect(await codigoDoErro(pasta.ler("decl.DBK", [".json"]))).toBe("EXTENSAO_NAO_PERMITIDA");
    expect(new TextDecoder().decode(await pasta.ler("minusculo.dbk", DBK))).toBe("ok");
  });

  it("lê arquivo de subpasta comum", async () => {
    mkdirSync(join(raiz, "2026"));
    writeFileSync(join(raiz, "2026", "a.txt"), "sub");
    expect(new TextDecoder().decode(await pasta.ler("2026/a.txt", LEITURA))).toBe("sub");
  });

  it("informa arquivo inexistente e diretório", async () => {
    mkdirSync(join(raiz, "pasta.DBK"));
    expect(await codigoDoErro(pasta.ler("nada.DBK", DBK))).toBe("NAO_ENCONTRADO");
    expect(await codigoDoErro(pasta.ler("pasta.DBK", DBK))).toBe("NAO_E_ARQUIVO");
  });

  it("não expõe o caminho absoluto da pasta nas mensagens", async () => {
    try {
      await pasta.ler("../fora/segredo.txt", LEITURA);
    } catch (e) {
      expect((e as Error).message).not.toContain(base);
    }
  });
});

describe("links simbólicos", () => {
  it("recusa link para fora da pasta", async () => {
    symlinkSync(join(fora, "segredo.txt"), join(raiz, "atalho.txt"));
    expect(await codigoDoErro(pasta.ler("atalho.txt", LEITURA))).toBe("LINK_SIMBOLICO");
  });

  it("recusa diretório intermediário que é link para fora", async () => {
    symlinkSync(fora, join(raiz, "ponte"));
    expect(await codigoDoErro(pasta.ler("ponte/segredo.txt", LEITURA))).toBe("FORA_DA_PASTA");
  });

  it("recusa link mesmo apontando para dentro (não segue links)", async () => {
    symlinkSync(join(raiz, "decl.DBK"), join(raiz, "copia.DBK"));
    expect(await codigoDoErro(pasta.ler("copia.DBK", DBK))).toBe("LINK_SIMBOLICO");
  });

  it("não escreve através de link simbólico", async () => {
    symlinkSync(join(fora, "segredo.txt"), join(raiz, "alvo.DBK"));
    expect(await codigoDoErro(pasta.escrever("alvo.DBK", new Uint8Array([65]), DBK))).toBe(
      "LINK_SIMBOLICO",
    );
    expect(readFileSync(join(fora, "segredo.txt"), "utf8")).toBe("dado de fora");
  });

  it("aceita pasta autorizada que é ela mesma um link", async () => {
    const link = join(base, "link-raiz");
    symlinkSync(raiz, link);
    const p = await abrirPastaAutorizada(link);
    expect(new TextDecoder().decode(await p.ler("decl.DBK", DBK))).toBe("conteudo original");
  });
});

describe("limite de tamanho", () => {
  it("recusa leitura de arquivo acima do limite", async () => {
    writeFileSync(join(raiz, "grande.DBK"), Buffer.alloc(2048, 65));
    expect(await codigoDoErro(pasta.ler("grande.DBK", DBK))).toBe("MUITO_GRANDE");
  });

  it("recusa escrita acima do limite sem tocar no destino", async () => {
    expect(await codigoDoErro(pasta.escrever("decl.DBK", new Uint8Array(2048), DBK))).toBe(
      "MUITO_GRANDE",
    );
    expect(readFileSync(join(raiz, "decl.DBK"), "utf8")).toBe("conteudo original");
  });
});

describe("escrita atômica e backup", () => {
  it("cria arquivo novo sem backup", async () => {
    const r = await pasta.escrever("novo.DBK", new TextEncoder().encode("abc"), DBK);
    expect(r.backup).toBeUndefined();
    expect(readFileSync(join(raiz, "novo.DBK"), "utf8")).toBe("abc");
  });

  it("faz backup com carimbo de data antes de sobrescrever", async () => {
    const r = await pasta.escrever("decl.DBK", new TextEncoder().encode("novo"), DBK);
    expect(readFileSync(join(raiz, "decl.DBK"), "utf8")).toBe("novo");
    expect(r.backup).toBe(`${PASTA_BACKUPS}/decl.DBK.20261014T120000Z.bak`);
    expect(readFileSync(join(raiz, r.backup ?? ""), "utf8")).toBe("conteudo original");
  });

  it("mantém a primeira cópia e as mais recentes (rotação, revisão M2)", async () => {
    for (let i = 1; i <= 5; i++) {
      agora = new Date(Date.UTC(2026, 9, 14, 12, i, 0));
      await pasta.escrever("decl.DBK", new TextEncoder().encode(`v${i}`), DBK);
    }
    const backups = readdirSync(join(raiz, PASTA_BACKUPS)).sort();
    // A primeira cópia (o conteúdo de antes do MCP Imposto de Renda) nunca sai da rotação.
    expect(backups).toEqual([
      "decl.DBK.20261014T120100Z.bak",
      "decl.DBK.20261014T120400Z.bak",
      "decl.DBK.20261014T120500Z.bak",
    ]);
    // Cada backup guarda o conteúdo anterior à escrita daquele instante.
    expect(readFileSync(join(raiz, PASTA_BACKUPS, backups[2] ?? ""), "utf8")).toBe("v4");
    expect(readFileSync(join(raiz, PASTA_BACKUPS, backups[0] ?? ""), "utf8")).toBe(
      "conteudo original",
    );
  });

  it("não perde backup quando dois são feitos no mesmo segundo", async () => {
    await pasta.escrever("decl.DBK", new TextEncoder().encode("v1"), DBK);
    await pasta.escrever("decl.DBK", new TextEncoder().encode("v2"), DBK);
    const backups = readdirSync(join(raiz, PASTA_BACKUPS));
    expect(backups).toHaveLength(2);
  });

  it("preserva o original e não deixa temporário quando a escrita falha no meio", async () => {
    const r = pasta.escrever("decl.DBK", new TextEncoder().encode("corrompido"), DBK, {
      antesDeRenomear: () => {
        throw new Error("falha simulada de disco");
      },
    });
    expect(await codigoDoErro(r)).toBe("FALHA_ESCRITA");
    expect(readFileSync(join(raiz, "decl.DBK"), "utf8")).toBe("conteudo original");
    const sobras = readdirSync(raiz).filter((n) => n.includes(".tmp"));
    expect(sobras).toEqual([]);
  });

  it("recusa backup quando a pasta de backups é um link", async () => {
    symlinkSync(fora, join(raiz, PASTA_BACKUPS));
    expect(await codigoDoErro(pasta.escrever("decl.DBK", new Uint8Array([65]), DBK))).toBe(
      "LINK_SIMBOLICO",
    );
    expect(readFileSync(join(raiz, "decl.DBK"), "utf8")).toBe("conteudo original");
  });

  it("não cria subpastas na escrita", async () => {
    expect(await codigoDoErro(pasta.escrever("nova/decl.DBK", new Uint8Array([65]), DBK))).toBe(
      "NAO_ENCONTRADO",
    );
    expect(existsSync(join(raiz, "nova"))).toBe(false);
  });
});

describe("listar", () => {
  it("lista só arquivos regulares com extensão permitida, sem ocultos nem links", async () => {
    writeFileSync(join(raiz, "b.json"), "{}");
    writeFileSync(join(raiz, "c.exe"), "x");
    writeFileSync(join(raiz, ".escondido.DBK"), "x");
    symlinkSync(join(fora, "segredo.txt"), join(raiz, "link.txt"));
    const itens = await pasta.listar(LEITURA);
    expect(itens.map((i) => i.nome)).toEqual(["b.json", "decl.DBK"]);
    expect(itens[1]?.tamanho).toBe(17);
  });
});
