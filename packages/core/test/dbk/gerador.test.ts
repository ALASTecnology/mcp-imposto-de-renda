import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  gerarModuloLeiaute,
  lerLeiauteXml,
  lerMapeamentoXml,
  montarLeiaute,
} from "../../../../tools/leiaute/gerar.js";

// O leiaute oficial usa meia-risca em algumas descrições; aqui ela entra por código.
const MEIA_RISCA = String.fromCharCode(0x2013);
const RISCAS = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);

const XML_LEIAUTE = `<?xml version="1.0" encoding="UTF-8" ?>
<file tamtipo="2" raiz="" xsl="" xmltipos="">
  <!-- comentário que deve ser ignorado <tipo nome="ZZ"> -->
  <tipo nome="IR">
    <campo nome="SISTEMA" obs="Identificador &amp; sistema" formato="C" tam="8" />
    <campo nome="EXERCICIO" obs="Exercício" formato="N" tam="4" />
    <campo nome="DT_NASCIM" obs="Data de nascimento (DDMMAAAA)" formato="N" tam="8" />
    <campo nome="DT_OUTRA" obs="grava se valor >= 01/03 (formato AAAAMMDD)" formato="N" tam="8" />
    <campo nome="NR_CONTROLE" obs="Número de controle" formato="N" tam="10" />
  </tipo>
  <tipo nome="_16" obs="Identificação ${MEIA_RISCA} teste">
    <campo nome="NR_REG" obs="tipo" formato="N" tam="2" />
    <campo nome="FILLER" obs="" formato="C" tam="3" />
    <campo nome="CAMPO_ANTIGO" obs="não gravado mais" formato="C" tam="320" />
    <campo nome="VR_RENDA" obs="valor -> reais" formato="N" tam="13" />
    <campo nome="VR_COTA" obs="cotação" formato="N" tam="13" />
    <campo nome="FILLER" obs="" formato="C" tam="2" />
    <campo nome="DT_EVENTO" obs="data do evento" formato="N" tam="8" />
    <campo nome="NR_CONTROLE" obs="Número de controle" formato="N" tam="10" />
  </tipo>
  <tipo nome="FR">
    <campo nome="NR_REG" obs="tipo" formato="N" tam="2" />
  </tipo>
  <tipo nome="_17">
    <campo nome="NR_REG" obs="tipo" formato="N" tam="2" />
    <campo nome="SEM_FORMATO" obs="sem formato em lugar nenhum" tam="4" />
  </tipo>
</file>`;

const XML_MAPEAMENTO = `<?xml version="1.0" encoding="UTF-8"?>
<Mapeamento>
  <DeclaracaoTXT TipoArquivo="ARQ_IRPF">
    <Registro Nome="REG_SR" Identificador="SR" Descricao="Header salvar e recuperar">
      <Campo Nome="NR_REG" Tipo="C" Tamanho="2" />
      <Campo Nome="NR_CONTROLE" Tipo="N" Tamanho="10" />
    </Registro>
    <!-- <Registro Nome="ANTIGO" Identificador="17" Descricao="comentado"> -->
    <Registro Nome="REG_16" Identificador="16" Descrição="Identificação do declarante">
      <Campo Nome="NR_REG" Tipo="C" Tamanho="2" />
      <Campo Nome="FILLER" Tipo="C" Tamanho="3" />
      <Campo Nome="VR_RENDA" Descricao="" Tipo="N" Tamanho="13" />
      <Campo Nome="VR_COTA" Descricao="x > y" Tipo="N" Tamanho="13" Decimais="6" />
      <Campo Nome="FILLER" Tipo="C" Tamanho="2" />
      <Campo Nome="DT_EVENTO" Descricao="Data (DDMMAAAA)" Tamanho="8" />
      <Campo Nome="NR_CONTROLE" Tipo="N" Tamanho="10" />
  </DeclaracaoTXT>
  <DeclaracaoTXT TipoArquivo="ARQ_OUTRO">
    <Registro Nome="X" Identificador="17" Descricao="não deve ser usado">
      <Campo Nome="NR_REG" Tipo="N" Tamanho="2" />
    </Registro>
  </DeclaracaoTXT>
</Mapeamento>`;

describe("lerLeiauteXml", () => {
  it("lê tipos e campos, ignora comentários e decodifica entidades", () => {
    const xml = lerLeiauteXml(XML_LEIAUTE);
    expect(xml.tamanhoTipo).toBe(2);
    expect(xml.tipos.map((t) => t.id)).toEqual(["IR", "16", "FR", "17"]);
    expect(xml.tipos[0]?.campos[0]).toEqual({
      nome: "SISTEMA",
      obs: "Identificador & sistema",
      formato: "C",
      tam: 8,
    });
    expect(xml.tipos[3]?.campos[1]?.formato).toBeUndefined();
    expect(xml.tipos[0]?.campos[3]?.obs).toContain(">=");
  });

  it("encerra um tipo sem </tipo> no início do próximo tipo", () => {
    const semFechamento = XML_LEIAUTE.replace("</tipo>", "");
    const xml = lerLeiauteXml(semFechamento);
    expect(xml.tipos.map((t) => t.campos.length)).toEqual([5, 8, 1, 2]);
  });
});

describe("lerMapeamentoXml", () => {
  const mapa = lerMapeamentoXml(XML_MAPEAMENTO);

  it("usa apenas a seção ARQ_IRPF, ignora comentários e aceita atributo com acento", () => {
    expect([...mapa.keys()]).toEqual(["SR", "16"]);
    expect(mapa.get("16")?.descricao).toBe("Identificação do declarante");
    expect(mapa.get("16")?.campos[3]).toMatchObject({ nome: "VR_COTA", decimais: 6, tipo: "N" });
  });

  it("aceita registro sem </Registro> (vai até o fim da seção)", () => {
    expect(mapa.get("16")?.campos).toHaveLength(7);
  });
});

describe("montarLeiaute", () => {
  const leiaute = montarLeiaute(lerLeiauteXml(XML_LEIAUTE), lerMapeamentoXml(XML_MAPEAMENTO), 2026);
  const [ir, r16, fr, r17, sr] = leiaute.tipos;

  it("usa a estrutura do mapeamento quando o tipo existe nele", () => {
    expect(leiaute.tipos.map((t) => t.id)).toEqual(["IR", "16", "FR", "17", "SR"]);
    expect(leiaute.origens).toEqual({
      IR: "leiaute",
      "16": "mapeamento",
      FR: "leiaute",
      "17": "leiaute",
      SR: "mapeamento",
    });
    expect(r16?.campos.map((c) => c.nome)).not.toContain("CAMPO_ANTIGO");
    expect(r16?.campos[0]?.formato).toBe("C");
    expect(sr?.tamanho).toBe(12);
  });

  it("calcula posições iniciais e tamanho do registro", () => {
    expect(ir?.campos.map((c) => c.inicio)).toEqual([1, 9, 13, 21, 29]);
    expect(ir?.tamanho).toBe(38);
    expect(r16?.tamanho).toBe(2 + 3 + 13 + 13 + 2 + 8 + 10);
  });

  it("gera chaves únicas para nomes repetidos", () => {
    expect(r16?.campos.map((c) => c.chave)).toEqual([
      "NR_REG",
      "FILLER",
      "VR_RENDA",
      "VR_COTA",
      "FILLER_2",
      "DT_EVENTO",
      "NR_CONTROLE",
    ]);
  });

  it("detecta datas e a ordem dos componentes", () => {
    expect(ir?.campos[2]?.data).toBe("DDMMAAAA");
    expect(ir?.campos[3]?.data).toBe("AAAAMMDD");
    expect(ir?.campos[1]?.data).toBeUndefined();
  });

  it("força texto no identificador de tipo alfanumérico", () => {
    expect(fr?.campos[0]?.formato).toBe("C");
    expect(r17?.campos[0]?.formato).toBe("N");
  });

  it("completa formato ausente pelo leiaute de dados e, sem nenhum, usa C", () => {
    expect(r16?.campos[5]).toMatchObject({ formato: "N", data: "DDMMAAAA" });
    expect(r17?.campos[1]?.formato).toBe("C");
  });

  it("usa decimais do mapeamento e a heurística de valores monetários", () => {
    expect(r16?.campos[3]?.decimais).toBe(6);
    expect(r16?.campos[2]?.decimais).toBe(2);
    expect(ir?.campos[1]?.decimais).toBeUndefined();
  });

  it("descreve tipo e campo pelo leiaute ou pelo mapeamento, e troca a meia-risca", () => {
    expect(r16?.descricao).toBe("Identificação - teste");
    expect(sr?.descricao).toBe("Header salvar e recuperar");
    expect(r16?.campos[2]?.descricao).toBe("valor -> reais");
    expect(r16?.campos[3]?.descricao).toBe("x > y");
  });

  it("rejeita formato desconhecido", () => {
    const ruim = XML_LEIAUTE.replace('formato="C" tam="3"', 'formato="X" tam="3"');
    expect(() => montarLeiaute(lerLeiauteXml(ruim), undefined, 2026)).toThrow(/formato/i);
  });
});

describe("gerarModuloLeiaute", () => {
  it("é determinístico e idempotente", () => {
    const a = gerarModuloLeiaute(XML_LEIAUTE, XML_MAPEAMENTO, 2026);
    const b = gerarModuloLeiaute(XML_LEIAUTE, XML_MAPEAMENTO, 2026);
    expect(a).toBe(b);
    expect(a).toContain("export const LEIAUTE_2026: Leiaute");
    expect(a).toContain("node --experimental-strip-types tools/leiaute/gerar.ts");
    expect(a).not.toMatch(RISCAS);
  });
});

const XML_REAL = process.env.IRPF_LEIAUTE_XML;
const MODULO_2026 = fileURLToPath(new URL("../../src/dbk/leiautes/2026.ts", import.meta.url));

describe("leiaute 2026 versionado", () => {
  it.skipIf(!XML_REAL || !existsSync(XML_REAL))(
    "coincide com a saída do gerador (defina IRPF_LEIAUTE_XML para conferir)",
    () => {
      const caminho = XML_REAL ?? "";
      const mapeamento = caminho.replace(/LayoutDadosDIRPF\d{4}\.xml$/, "mapeamentoTxt.xml");
      const gerado = gerarModuloLeiaute(
        readFileSync(caminho, "utf8"),
        existsSync(mapeamento) ? readFileSync(mapeamento, "utf8") : undefined,
        2026,
      );
      expect(gerado).toBe(readFileSync(MODULO_2026, "utf8"));
    },
  );
});
