/**
 * Rendimentos Isentos e Não Tributáveis e Rendimentos Sujeitos à Tributação Exclusiva.
 *
 * O arquivo guarda o total de cada código (registros 23 e 24) e, para os códigos com fonte
 * pagadora ou beneficiário, uma linha de detalhe por lançamento:
 *
 * | Registro | Conteúdo |
 * | --- | --- |
 * | 83 | isentos sem fonte: 19, 20 e 21 |
 * | 84 | isentos com fonte: 01 a 04, 09, 10 (com 13º), 12 a 14, 16 a 18, 23 a 25 e 28 |
 * | 85 | isento 11 (moléstia grave), com 13º, IRRF e previdência |
 * | 86 | outros isentos (código 26 no arquivo, 99 no modelo), com descrição |
 * | 87 | isentos 05, 06 e 07, valor informado e valor transportado do GCAP |
 * | 88 | exclusivos com fonte: 06, 10 e 11 |
 * | 89 | outros exclusivos (código 12 no arquivo, 99 no modelo) e 13 (apostas), com descrição |
 *
 * Os registros 84 e 88 foram confirmados com arquivos do programa oficial; os demais seguem a
 * descrição dos campos no leiaute e ainda não têm caso de referência. Códigos sem detalhe (por
 * exemplo o 13º salário, exclusivo 01) ficam só no total e viram lançamento de valor único.
 */
import type { Registro } from "../../dbk/codec.js";
import type { Beneficiario } from "../../model/comum.js";
import type { Declaracao } from "../../model/declaracao.js";
import type { RendimentoExclusivo, RendimentoIsento } from "../../model/isentos-exclusivos.js";
import { codigo, numero, type Objeto, semIndefinidos, texto } from "../campos.js";
import type { ContextoGravacao, ContextoLeitura, Mapeador } from "../contexto.js";

/** Isento "outros": 99 no modelo (numeração da Ajuda), 26 no arquivo (tabela do programa). */
const ISENTO_OUTROS_ARQUIVO = "26";
/** Exclusivo "outros": 99 no modelo, 12 no arquivo. */
const EXCLUSIVO_OUTROS_ARQUIVO = "12";

const ISENTOS_VALOR_UNICO = new Set(["08", "15", "22", "27"]);
const EXCLUSIVOS_TRANSPORTADOS = new Set(["01", "02", "03", "04", "05", "07", "08", "09", "12"]);
const ISENTOS_FONTE_OBRIGATORIA = new Set(["01", "02", "04", "09", "12", "13", "17", "18"]);
const ISENTOS_FONTE_OPCIONAL = new Set(["03", "16", "25", "23", "24"]);

function beneficiarioDe(r: Registro, ctx: ContextoLeitura): Objeto {
  const cpf = texto(r, "NR_CPF_BENEFIC");
  return texto(r, "IN_TIPO") === "D" && cpf !== "" && cpf !== ctx.cpfTitular
    ? { tipo: "dependente", cpf }
    : { tipo: "titular" };
}

function fonteDe(r: Registro): Objeto | undefined {
  const ni = texto(r, "NR_PAGADORA");
  return ni === "" ? undefined : { ni, nome: texto(r, "NM_NOME") };
}

function chaveBemDe(r: Registro): number | undefined {
  const c = numero(r, "NR_CHAVE_BEM");
  return c > 0n ? Number(c) : undefined;
}

function valorIsento(i: RendimentoIsento): bigint {
  if ("valorInformado" in i) return i.valorInformado + i.valorTransportado;
  if ("decimoTerceiro" in i) return i.valor + i.decimoTerceiro;
  return i.valor;
}

function valorDeEntrada(o: Objeto): bigint {
  const n = (k: string) => (typeof o[k] === "bigint" ? (o[k] as bigint) : 0n);
  return n("valor") + n("decimoTerceiro") + n("valorInformado") + n("valorTransportado");
}

/** Código do modelo para o código do arquivo (só "outros" muda de número). */
const isentoArquivo = (c: string) => (c === "99" ? ISENTO_OUTROS_ARQUIVO : c);
const isentoModelo = (c: string) => (c === ISENTO_OUTROS_ARQUIVO ? "99" : c);
const exclusivoArquivo = (c: string) => (c === "99" ? EXCLUSIVO_OUTROS_ARQUIVO : c);

function lerIsentos(ctx: ContextoLeitura): Objeto[] {
  const itens: Objeto[] = [];
  for (const r of ctx.doTipo("83")) {
    itens.push({
      codigo: codigo(numero(r, "NR_COD"), 2),
      beneficiario: beneficiarioDe(r, ctx),
      valor: numero(r, "VR_VALOR"),
    });
  }
  for (const r of ctx.doTipo("84")) {
    const c = codigo(numero(r, "NR_COD"), 2);
    const beneficiario = beneficiarioDe(r, ctx);
    const fonte = fonteDe(r);
    const valor = numero(r, "VR_VALOR");
    if (c === "10") {
      itens.push({
        codigo: c,
        beneficiario,
        fonte,
        valor,
        decimoTerceiro: numero(r, "VR_VALOR_13"),
      });
    } else if (c === "14") {
      itens.push({ codigo: c, beneficiario, doador: fonte, valor });
    } else if (c === "28") {
      itens.push({ codigo: c, beneficiario, cpfAlimentante: texto(r, "NR_PAGADORA"), valor });
    } else if (ISENTOS_FONTE_OPCIONAL.has(c)) {
      itens.push(semIndefinidos({ codigo: c, beneficiario, fonte, valor }));
    } else {
      if (!ISENTOS_FONTE_OBRIGATORIA.has(c)) {
        ctx.aviso(`Rendimento isento de código ${c} no registro 84 não é previsto no modelo.`);
      }
      itens.push(
        semIndefinidos({ codigo: c, beneficiario, fonte, valor, chaveBem: chaveBemDe(r) }),
      );
    }
  }
  for (const r of ctx.doTipo("85")) {
    itens.push({
      codigo: "11",
      beneficiario: beneficiarioDe(r, ctx),
      fonte: fonteDe(r),
      valor: numero(r, "VR_RECEB"),
      impostoRetido: numero(r, "VR_IRRF"),
      decimoTerceiro: numero(r, "VR_13SALARIO"),
      impostoRetidoDecimoTerceiro: numero(r, "VR_IRRF13SALARIO"),
      contribuicaoPrevidenciaria: numero(r, "VR_PREVIDENCIA"),
    });
  }
  for (const r of ctx.doTipo("86")) {
    itens.push(
      semIndefinidos({
        codigo: "99",
        beneficiario: beneficiarioDe(r, ctx),
        fonte: fonteDe(r),
        descricao: texto(r, "NM_DESCRICAO"),
        valor: numero(r, "VR_VALOR"),
        chaveBem: chaveBemDe(r),
      }),
    );
  }
  for (const r of ctx.doTipo("87")) {
    itens.push({
      codigo: codigo(numero(r, "NR_COD"), 2),
      valorInformado: numero(r, "VR_VALOR"),
      valorTransportado: numero(r, "VR_VALORGCAP"),
    });
  }
  // Totais por código: o que sobra além dos detalhes vira lançamento de valor único.
  for (const r of ctx.doTipo("23")) {
    const c = isentoModelo(codigo(numero(r, "CD_ISENTO"), 2));
    const detalhado = itens
      .filter((i) => i.codigo === c)
      .reduce((s, i) => s + valorDeEntrada(i), 0n);
    const resto = numero(r, "VR_VALOR") - detalhado;
    if (resto === 0n) continue;
    if (ISENTOS_VALOR_UNICO.has(c) && resto > 0n) itens.push({ codigo: c, valor: resto });
    else
      ctx.aviso(
        `Total do rendimento isento ${c} (registro 23) difere da soma dos detalhes; o total será recalculado ao gravar.`,
      );
  }
  return itens;
}

function lerExclusivos(ctx: ContextoLeitura): Objeto[] {
  const itens: Objeto[] = [];
  for (const r of ctx.doTipo("88")) {
    itens.push(
      semIndefinidos({
        codigo: codigo(texto(r, "NR_COD") || "0", 2).slice(-2),
        beneficiario: beneficiarioDe(r, ctx),
        fonte: fonteDe(r),
        valor: numero(r, "VR_VALOR"),
        chaveBem: chaveBemDe(r),
      }),
    );
  }
  for (const r of ctx.doTipo("89")) {
    const c = codigo(numero(r, "NR_COD"), 2);
    const comum = {
      beneficiario: beneficiarioDe(r, ctx),
      descricao: texto(r, "NM_DESCRICAO"),
      valor: numero(r, "VR_VALOR"),
    };
    if (c === "13") itens.push({ codigo: "13", ...comum });
    else itens.push(semIndefinidos({ codigo: "99", ...comum, fonte: fonteDe(r) }));
  }
  for (const r of ctx.doTipo("24")) {
    const c = codigo(numero(r, "CD_EXCLUSIVO"), 2);
    const detalhado = itens
      .filter((i) => exclusivoArquivo(String(i.codigo)) === c)
      .reduce((s, i) => s + valorDeEntrada(i), 0n);
    const resto = numero(r, "VR_VALOR") - detalhado;
    if (resto === 0n) continue;
    if (EXCLUSIVOS_TRANSPORTADOS.has(c) && resto > 0n) itens.push({ codigo: c, valor: resto });
    else
      ctx.aviso(
        `Total do rendimento exclusivo ${c} (registro 24) difere da soma dos detalhes; o total será recalculado ao gravar.`,
      );
  }
  return itens;
}

function tipoECpf(b: Beneficiario | undefined, ctx: ContextoGravacao) {
  return b?.tipo === "dependente"
    ? { IN_TIPO: "D", NR_CPF_BENEFIC: b.cpf }
    : { IN_TIPO: "T", NR_CPF_BENEFIC: ctx.cpfTitular };
}

function gravarIsentos(ctx: ContextoGravacao, itens: readonly RendimentoIsento[]): void {
  const totais = new Map<string, bigint>();
  for (const i of itens) {
    const c = isentoArquivo(i.codigo);
    totais.set(c, (totais.get(c) ?? 0n) + valorIsento(i));
  }
  for (const [c, v] of [...totais].sort((a, b) => Number(a[0]) - Number(b[0]))) {
    if (v > 0n) ctx.adicionar("23", { CD_ISENTO: BigInt(c), VR_VALOR: v }, ["CD_ISENTO"]);
  }
  for (const i of itens) {
    const cod = BigInt(i.codigo);
    switch (i.codigo) {
      case "19":
      case "20":
      case "21":
        ctx.adicionar("83", { ...tipoECpf(i.beneficiario, ctx), NR_COD: cod, VR_VALOR: i.valor }, [
          "NR_COD",
          "NR_CPF_BENEFIC",
        ]);
        break;
      case "11":
        ctx.adicionar(
          "85",
          {
            ...tipoECpf(i.beneficiario, ctx),
            NR_COD: cod,
            NR_PAGADORA: i.fonte.ni,
            NM_NOME: i.fonte.nome,
            VR_RECEB: i.valor,
            VR_13SALARIO: i.decimoTerceiro,
            VR_IRRF: i.impostoRetido,
            VR_IRRF13SALARIO: i.impostoRetidoDecimoTerceiro,
            VR_PREVIDENCIA: i.contribuicaoPrevidenciaria,
          },
          ["NR_PAGADORA", "NR_CPF_BENEFIC"],
        );
        break;
      case "99":
        ctx.adicionar(
          "86",
          {
            ...tipoECpf(i.beneficiario, ctx),
            NR_COD: BigInt(ISENTO_OUTROS_ARQUIVO),
            NR_PAGADORA: i.fonte.ni,
            NM_NOME: i.fonte.nome,
            VR_VALOR: i.valor,
            NM_DESCRICAO: i.descricao,
            NR_CHAVE_BEM: BigInt(i.chaveBem ?? 0),
          },
          ["NR_PAGADORA", "NR_CPF_BENEFIC"],
        );
        break;
      case "05":
      case "06":
      case "07":
        ctx.adicionar(
          "87",
          { NR_COD: cod, VR_VALOR: i.valorInformado, VR_VALORGCAP: i.valorTransportado },
          ["NR_COD"],
        );
        break;
      case "08":
      case "15":
      case "22":
      case "27":
        break;
      default: {
        const fonte =
          i.codigo === "14"
            ? i.doador
            : i.codigo === "28"
              ? { ni: i.cpfAlimentante, nome: "" }
              : i.fonte;
        ctx.adicionar(
          "84",
          {
            ...tipoECpf(i.beneficiario, ctx),
            NR_COD: cod,
            NR_PAGADORA: fonte?.ni ?? "",
            NM_NOME: fonte?.nome ?? "",
            VR_VALOR: i.valor,
            VR_VALOR_13: i.codigo === "10" ? i.decimoTerceiro : 0n,
            NR_CHAVE_BEM: BigInt("chaveBem" in i ? (i.chaveBem ?? 0) : 0),
          },
          ["NR_COD", "NR_PAGADORA", "NR_CPF_BENEFIC"],
        );
      }
    }
  }
}

function gravarExclusivos(ctx: ContextoGravacao, itens: readonly RendimentoExclusivo[]): void {
  const totais = new Map<string, bigint>();
  for (const i of itens) {
    const c = exclusivoArquivo(i.codigo);
    totais.set(c, (totais.get(c) ?? 0n) + i.valor);
  }
  for (const [c, v] of [...totais].sort((a, b) => Number(a[0]) - Number(b[0]))) {
    if (v > 0n) ctx.adicionar("24", { CD_EXCLUSIVO: BigInt(c), VR_VALOR: v }, ["CD_EXCLUSIVO"]);
  }
  for (const i of itens) {
    if (i.codigo === "06" || i.codigo === "10" || i.codigo === "11") {
      ctx.adicionar(
        "88",
        {
          ...tipoECpf(i.beneficiario, ctx),
          NR_COD: i.codigo.padStart(4, "0"),
          NR_PAGADORA: i.fonte.ni,
          NM_NOME: i.fonte.nome,
          VR_VALOR: i.valor,
          NR_CHAVE_BEM: BigInt(i.chaveBem ?? 0),
        },
        ["NR_COD", "NR_PAGADORA", "NR_CPF_BENEFIC"],
      );
    } else if (i.codigo === "99" || i.codigo === "13") {
      ctx.adicionar(
        "89",
        {
          ...tipoECpf(i.beneficiario, ctx),
          NR_COD: BigInt(i.codigo === "99" ? EXCLUSIVO_OUTROS_ARQUIVO : "13"),
          NR_PAGADORA: i.codigo === "99" ? i.fonte.ni : "",
          NM_NOME: i.codigo === "99" ? i.fonte.nome : "",
          VR_VALOR: i.valor,
          NM_DESCRICAO: i.descricao,
        },
        ["NR_COD", "NR_PAGADORA", "NR_CPF_BENEFIC"],
      );
    }
  }
}

export const mapeadorIsentosExclusivos: Mapeador = {
  nome: "isentosExclusivos",
  tipos: ["23", "24", "83", "84", "85", "86", "87", "88", "89"],
  ler(ctx, saida) {
    saida.rendimentosIsentos = lerIsentos(ctx);
    saida.rendimentosExclusivos = lerExclusivos(ctx);
  },
  gravar(ctx, dec: Declaracao) {
    gravarIsentos(ctx, dec.rendimentosIsentos);
    gravarExclusivos(ctx, dec.rendimentosExclusivos);
  },
};
