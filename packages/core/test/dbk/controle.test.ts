import { crc32 as crc32Zlib } from "node:zlib";
import { describe, expect, it } from "vitest";
import {
  ArquivoDeclaracaoError,
  calcularControleHeader,
  calcularHashHeader,
  calcularHashRecibo,
  calcularNumeroControle,
  codificarRegistro,
  converterTipoArquivo,
  crc32,
  criarRegistro,
  inferirTipoArquivo,
  LEIAUTE_2026,
  type Registro,
  recalcularControles,
  tipoArquivoPorNome,
  VARIANTE_HASH_PADRAO,
  VARIANTES_HASH,
  verificarControles,
} from "../../src/dbk/index.js";
import { CPF_TESTE, declaracaoSintetica, MINI } from "./apoio.js";

const latin1 = (texto: string): Uint8Array => Uint8Array.from(texto, (c) => c.charCodeAt(0));

describe("crc32", () => {
  it("é o CRC-32 padrão (zlib/IEEE 802.3)", () => {
    expect(crc32(latin1("123456789"))).toBe(0xcbf43926);
    expect(crc32(new Uint8Array())).toBe(0);
  });

  it("coincide com node:zlib, inclusive em blocos encadeados", () => {
    let semente = 7;
    for (let n = 0; n < 50; n++) {
      const dados = new Uint8Array(n * 37);
      for (let i = 0; i < dados.length; i++) {
        semente = (semente * 1103515245 + 12345) >>> 0;
        dados[i] = semente >>> 24;
      }
      expect(crc32(dados)).toBe(crc32Zlib(dados));
      const meio = Math.floor(dados.length / 2);
      expect(crc32(dados.subarray(meio), crc32(dados.subarray(0, meio)))).toBe(crc32Zlib(dados));
    }
  });
});

describe("calcularNumeroControle", () => {
  it("é o CRC-32 da linha sem os 10 caracteres do controle, em latin-1", () => {
    expect(calcularNumeroControle("123456789")).toBe(3421780262n);
    expect(calcularNumeroControle("AÇÃO")).toBe(BigInt(crc32Zlib(Buffer.from("AÇÃO", "latin1"))));
  });
});

function linha(r: Registro): string {
  return codificarRegistro(r, LEIAUTE_2026);
}

describe("recalcularControles", () => {
  const registros = declaracaoSintetica();

  it("grava o número de controle de cada registro, exceto o do header", () => {
    for (const r of registros.slice(1)) {
      const l = linha(r);
      expect(l.slice(-10)).toBe(String(crc32(latin1(l.slice(0, -10)))).padStart(10, "0"));
    }
  });

  it("conta os registros por tipo no T9", () => {
    const t9 = registros.find((r) => r.tipo === "T9");
    expect(t9?.campos).toMatchObject({ QT_TOTAL: 4n, QT_R16: 1n, QT_R21: 2n, QT_R27: 0n });
  });

  it("calcula o NR_HASH do header sobre os registros seguintes, inclusive o T9", () => {
    const ir = registros[0];
    const esperado = crc32(latin1(registros.slice(1).map(linha).join("")));
    expect(ir?.campos.NR_HASH).toBe(BigInt(esperado));
    expect(calcularHashHeader(registros, LEIAUTE_2026)).toBe(BigInt(esperado));
  });

  it("grava o NR_CONTROLE do header pela fórmula do programa (DBK sem recibo)", () => {
    const l = linha(registros[0] as Registro);
    const esperado = crc32(latin1(`${CPF_TESTE.slice(0, 8)}.DBK${l.slice(0, -10)}`));
    expect(registros[0]?.campos.NR_CONTROLE).toBe(BigInt(esperado));
  });

  it("preserva o NR_CONTROLE do header ou grava o CRC da linha, quando pedido", () => {
    const ir = registros[0] as Registro;
    const marcado = { tipo: "IR", campos: { ...ir.campos, NR_CONTROLE: 123n } };
    const preservado = recalcularControles([marcado, ...registros.slice(1)], {
      controleHeader: "preservar",
    });
    expect(preservado[0]?.campos.NR_CONTROLE).toBe(123n);
    expect(recalcularControles([marcado, ...registros.slice(1)])[0]?.campos.NR_CONTROLE).toBe(
      ir.campos.NR_CONTROLE,
    );
    const comCrc = recalcularControles([marcado, ...registros.slice(1)], { controleHeader: "crc" });
    const l = linha(comCrc[0] as Registro);
    expect(comCrc[0]?.campos.NR_CONTROLE).toBe(BigInt(crc32(latin1(l.slice(0, -10)))));
    expect(verificarControles(comCrc).controleHeaderConfereComCrc).toBe(true);
    expect(verificarControles([marcado, ...registros.slice(1)]).controleHeaderConfereComCrc).toBe(
      false,
    );
  });

  it("não altera a entrada e é idempotente", () => {
    const copia = structuredClone(registros);
    const deNovo = recalcularControles(registros);
    expect(registros).toEqual(copia);
    expect(deNovo).toEqual(registros);
  });

  it("ignora os registros do recibo (HR, DR, R9) nas contagens e no hash do header", () => {
    const recibo = ["HR", "DR", "R9"].map((t) =>
      criarRegistro(LEIAUTE_2026, t, { NR_CPF: CPF_TESTE }),
    );
    const comRecibo = recalcularControles([...registros, ...recibo]);
    // Só o NR_CONTROLE do header muda: com recibo o arquivo é tratado como DEC.
    expect(comRecibo.slice(1, registros.length)).toEqual(registros.slice(1));
    expect(comRecibo[0]?.campos.NR_HASH).toBe(registros[0]?.campos.NR_HASH);
    expect(comRecibo[0]?.campos.NR_CONTROLE).not.toBe(registros[0]?.campos.NR_CONTROLE);
    expect(comRecibo.slice(registros.length).map((r) => r.tipo)).toEqual(["HR", "DR", "R9"]);
  });

  it("funciona com qualquer leiaute (leiaute mínimo)", () => {
    const r = recalcularControles(
      [
        criarRegistro(MINI, "IR", { EXERCICIO: 2026n }),
        criarRegistro(MINI, "10", { NM_NOME: "A" }),
        criarRegistro(MINI, "10", { NM_NOME: "B" }),
        criarRegistro(MINI, "T9"),
      ],
      { leiaute: MINI },
    );
    expect(r[3]?.campos).toMatchObject({ QT_TOTAL: 3n, QT_R10: 2n, Filler: 0n });
    expect(verificarControles(r, { leiaute: MINI }).valido).toBe(true);
  });
});

describe("verificarControles", () => {
  const registros = declaracaoSintetica();

  it("aceita um arquivo íntegro e informa as variantes de hash que conferem", () => {
    const relatorio = verificarControles(registros);
    expect(relatorio.valido).toBe(true);
    expect(relatorio.divergencias).toEqual([]);
    expect(relatorio.variantesHashQueConferem).toContain(VARIANTE_HASH_PADRAO.nome);
    expect(relatorio.variantesTotalQueConferem).toContain("declaracao-sem-T9");
    expect(VARIANTES_HASH.length).toBeGreaterThan(1);
  });

  it("acusa registro alterado sem recalcular e aponta a linha", () => {
    const alterado = registros.map((r, i) =>
      i === 2 ? { tipo: r.tipo, campos: { ...r.campos, VR_RENDTO: 1n } } : r,
    );
    const relatorio = verificarControles(alterado);
    expect(relatorio.valido).toBe(false);
    expect(relatorio.divergencias).toContainEqual(
      expect.objectContaining({ linha: 3, tipo: "21", campo: "NR_CONTROLE" }),
    );
    expect(relatorio.divergencias).toContainEqual(
      expect.objectContaining({ linha: 1, tipo: "IR", campo: "NR_HASH" }),
    );
    expect(verificarControles(recalcularControles(alterado)).valido).toBe(true);
  });

  it("acusa contagem errada no T9", () => {
    const semUm = registros.filter((_, i) => i !== 3);
    const relatorio = verificarControles(semUm);
    expect(relatorio.divergencias).toContainEqual(
      expect.objectContaining({ tipo: "T9", campo: "QT_R21", esperado: "1", encontrado: "2" }),
    );
  });
});

describe("NR_CONTROLE do header e tipo de arquivo", () => {
  const registros = declaracaoSintetica();
  const recibo = (): Registro[] =>
    ["HR", "DR", "R9"].map((t) => criarRegistro(LEIAUTE_2026, t, { NR_CPF: CPF_TESTE }));

  it("é o CRC-32 de <8 primeiros dígitos do CPF>.<EXTENSÃO> seguido da linha sem o controle", () => {
    const l = "IRPF    linha qualquer";
    expect(calcularControleHeader(l, "10011265566", "DBK")).toBe(
      BigInt(crc32Zlib(Buffer.from(`10011265.DBK${l}`, "latin1"))),
    );
    expect(calcularControleHeader(l, "10011265566", "DEC")).toBe(
      BigInt(crc32Zlib(Buffer.from(`10011265.DEC${l}`, "latin1"))),
    );
  });

  it("infere o tipo pelo recibo e pela extensão do nome", () => {
    expect(inferirTipoArquivo(registros)).toBe("DBK");
    expect(inferirTipoArquivo([...registros, ...recibo()])).toBe("DEC");
    expect(tipoArquivoPorNome("caminho/10011265566-IRPF-2026.dec")).toBe("DEC");
    expect(tipoArquivoPorNome("x.DBK")).toBe("DBK");
    expect(tipoArquivoPorNome("x.txt")).toBeUndefined();
  });

  it("recalcula conforme o tipo pedido e verificarControles acusa o header de outro tipo", () => {
    const comoDec = recalcularControles(registros, { tipoArquivo: "DEC" });
    const l = linha(comoDec[0] as Registro);
    expect(comoDec[0]?.campos.NR_CONTROLE).toBe(
      calcularControleHeader(l.slice(0, -10), CPF_TESTE, "DEC"),
    );
    expect(verificarControles(comoDec, { tipoArquivo: "DEC" }).valido).toBe(true);
    const relatorio = verificarControles(comoDec, { tipoArquivo: "DBK" });
    expect(relatorio.valido).toBe(false);
    expect(relatorio.tipoArquivo).toBe("DBK");
    expect(relatorio.divergencias).toEqual([
      expect.objectContaining({ linha: 1, tipo: "IR", campo: "NR_CONTROLE" }),
    ]);
  });

  it("acusa NR_CONTROLE do header alterado", () => {
    const ir = registros[0] as Registro;
    const alterado = [
      { tipo: "IR", campos: { ...ir.campos, NR_CONTROLE: 1n } },
      ...registros.slice(1),
    ];
    const relatorio = verificarControles(alterado);
    expect(relatorio.valido).toBe(false);
    expect(relatorio.controleHeaderConfere).toBe(false);
    expect(relatorio.divergencias).toContainEqual(
      expect.objectContaining({ linha: 1, tipo: "IR", campo: "NR_CONTROLE", encontrado: "1" }),
    );
  });

  it("calcula o NR_HASH do R9 sobre as linhas entre o header e o R9", () => {
    const dec = recalcularControles([...registros, ...recibo()]);
    const linhas = dec.map(linha);
    const esperado = BigInt(crc32Zlib(Buffer.from(linhas.slice(1, -1).join(""), "latin1")));
    expect(dec.at(-1)?.campos.NR_HASH).toBe(esperado);
    expect(calcularHashRecibo(dec, LEIAUTE_2026)).toBe(esperado);
    expect(verificarControles(dec).valido).toBe(true);
    const r9 = dec.at(-1) as Registro;
    const adulterado = [...dec.slice(0, -1), { tipo: "R9", campos: { ...r9.campos, NR_HASH: 7n } }];
    expect(verificarControles(adulterado).divergencias).toContainEqual(
      expect.objectContaining({ tipo: "R9", campo: "NR_HASH" }),
    );
  });

  it("converte DEC em DBK retirando o recibo e recalculando o header", () => {
    const dec = recalcularControles([...registros, ...recibo()]);
    expect(converterTipoArquivo(dec, "DBK")).toEqual(registros);
    expect(converterTipoArquivo(registros, "DBK")).toEqual(registros);
    expect(converterTipoArquivo(dec, "DEC")).toEqual(dec);
  });

  it("não converte DBK em DEC: o recibo (HR, DR, R9) não está no DBK", () => {
    expect(() => converterTipoArquivo(registros, "DEC")).toThrow(ArquivoDeclaracaoError);
  });
});
