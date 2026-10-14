/**
 * Rendimentos tributáveis: de PJ (registros 21 e 32), de PF e do exterior mês a mês (22) com os
 * lançamentos por pagador (49), com exigibilidade suspensa (80 e 81) e recebidos
 * acumuladamente (45 a 48).
 */
import { PARAMETROS_2026 } from "../../calc/2026/parametros.js";
import type { Beneficiario } from "../../model/comum.js";
import type { Declaracao } from "../../model/declaracao.js";
import {
  ddmmaaaaDeIso,
  digitos,
  isoDeDdmmaaaa,
  numero,
  type Objeto,
  semIndefinidos,
  texto,
} from "../campos.js";
import type { ContextoGravacao, ContextoLeitura, Mapeador } from "../contexto.js";

/** Dedução mensal por dependente no carnê-leão (dedução anual dividida por 12). */
export const DEDUCAO_DEPENDENTE_MENSAL = PARAMETROS_2026.deducaoDependente / 12n;

const zeros = () => Array.from({ length: 12 }, () => 0n);

function beneficiarioDe(cpf: string, ctx: ContextoLeitura): Objeto {
  return cpf === "" || cpf === ctx.cpfTitular ? { tipo: "titular" } : { tipo: "dependente", cpf };
}

function cpfDoBeneficiario(b: Beneficiario, ctx: ContextoGravacao): string {
  return b.tipo === "dependente" ? b.cpf : ctx.cpfTitular;
}

function lerPF(ctx: ContextoLeitura): Objeto[] {
  const porPessoa = new Map<string, Record<string, unknown>>();
  const pessoa = (cpf: string) => {
    let p = porPessoa.get(cpf);
    if (!p) {
      p = {
        beneficiario: beneficiarioDe(cpf, ctx),
        trabalhoNaoAssalariado: zeros(),
        alugueis: zeros(),
        outros: zeros(),
        exterior: zeros(),
        previdenciaOficial: zeros(),
        quantidadeDependentes: Array.from({ length: 12 }, () => 0),
        pensaoAlimenticia: zeros(),
        livroCaixa: zeros(),
        carneLeaoPago: zeros(),
        pagamentosRecebidos: [] as Objeto[],
      };
      porPessoa.set(cpf, p);
    }
    return p;
  };
  for (const r of ctx.doTipo("22")) {
    const dep = texto(r, "E_DEPENDENTE") === "S";
    const p = pessoa(dep ? texto(r, "NR_CPF_DEPEN") : "");
    const m = Number(numero(r, "NR_MES")) - 1;
    if (m < 0 || m > 11) {
      ctx.aviso("Registro 22 com mês fora de 1 a 12 foi ignorado.");
      continue;
    }
    const pos = (campo: string, chave: string) => {
      (p[campo] as bigint[])[m] = numero(r, chave);
    };
    pos("trabalhoNaoAssalariado", "VR_RENDTO");
    pos("alugueis", "VR_ALUGUEIS");
    pos("outros", "VR_OUTROS");
    pos("exterior", "VR_EXTER");
    pos("previdenciaOficial", "VR_PREVID");
    pos("pensaoAlimenticia", "VR_ALIMENT");
    pos("livroCaixa", "VR_LIVCAIX");
    pos("carneLeaoPago", "VR_IMPOSTO");
    const deducao = numero(r, "VR_DEDUC");
    if (deducao % DEDUCAO_DEPENDENTE_MENSAL !== 0n) {
      ctx.aviso(
        "Dedução de dependentes do carnê-leão não é múltipla da dedução mensal: a quantidade foi arredondada para baixo.",
      );
    }
    (p.quantidadeDependentes as number[])[m] = Number(deducao / DEDUCAO_DEPENDENTE_MENSAL);
  }
  for (const r of ctx.doTipo("49")) {
    const dep = texto(r, "NR_CPF_DEPENDENTE");
    const p = pessoa(dep === ctx.cpfTitular ? "" : dep);
    const benef = digitos(texto(r, "NR_CPF_BENEFIC"), [11]);
    (p.pagamentosRecebidos as Objeto[]).push(
      semIndefinidos({
        mes: Number(numero(r, "NR_MES")),
        cpfTitularPagamento: texto(r, "NR_CPF_TITULAR_PAGAMENTO"),
        cpfBeneficiarioServico: benef,
        valor: numero(r, "NR_VALOR"),
      }),
    );
  }
  return [...porPessoa.values()];
}

function gravarPF(ctx: ContextoGravacao, dec: Declaracao): void {
  const vistos = new Set<string>();
  for (const p of dec.rendimentosPFExterior) {
    const cpf = cpfDoBeneficiario(p.beneficiario, ctx);
    if (vistos.has(cpf)) {
      ctx.aviso(
        "Há mais de um quadro de rendimentos de PF/exterior para a mesma pessoa; o programa aceita um por pessoa.",
      );
    }
    vistos.add(cpf);
    const dep = p.beneficiario.tipo === "dependente";
    for (let m = 0; m < 12; m++) {
      const v = (lista: readonly bigint[]) => lista[m] ?? 0n;
      const qtd = BigInt(p.quantidadeDependentes[m] ?? 0);
      const deducao = qtd * DEDUCAO_DEPENDENTE_MENSAL;
      const bruto = v(p.trabalhoNaoAssalariado) + v(p.alugueis) + v(p.outros) + v(p.exterior);
      const deducoes = v(p.previdenciaOficial) + deducao + v(p.pensaoAlimenticia) + v(p.livroCaixa);
      const base = bruto - deducoes;
      ctx.adicionar(
        "22",
        {
          E_DEPENDENTE: dep ? "S" : "N",
          NR_CPF_DEPEN: dep ? cpf : "",
          NR_MES: BigInt(m + 1),
          VR_RENDTO: v(p.trabalhoNaoAssalariado),
          VR_ALUGUEIS: v(p.alugueis),
          VR_OUTROS: v(p.outros),
          VR_EXTER: v(p.exterior),
          VR_LIVCAIX: v(p.livroCaixa),
          VR_ALIMENT: v(p.pensaoAlimenticia),
          VR_DEDUC: deducao,
          VR_PREVID: v(p.previdenciaOficial),
          VR_BASECALCULO: base,
          VR_IMPOSTO: v(p.carneLeaoPago),
        },
        ["E_DEPENDENTE", "NR_CPF_DEPEN", "NR_MES"],
      );
    }
    for (const l of p.pagamentosRecebidos) {
      ctx.adicionar(
        "49",
        {
          NR_CPF_TITULAR: ctx.cpfTitular,
          NR_CPF_DEPENDENTE: dep ? cpf : "",
          NR_MES: BigInt(l.mes),
          NR_CPF_TITULAR_PAGAMENTO: l.cpfTitularPagamento,
          NR_CPF_BENEFIC: l.cpfBeneficiarioServico ?? "",
          NR_VALOR: l.valor,
        },
        ["NR_CPF_DEPENDENTE", "NR_MES", "NR_CPF_TITULAR_PAGAMENTO", "NR_CPF_BENEFIC"],
      );
    }
    const nitPessoa =
      p.beneficiario.tipo === "dependente"
        ? dec.dependentes.find((d) => d.cpf === cpf)?.nitPisPasep
        : dec.identificacao.nitPisPasep;
    if (p.nitPisPasep && p.nitPisPasep !== nitPessoa) {
      ctx.aviso(
        "O NIT/PIS/PASEP da ficha PF/Exterior é gravado na identificação do titular ou no dependente; informe-o lá.",
      );
    }
  }
}

export const mapeadorRendimentos: Mapeador = {
  nome: "rendimentos",
  tipos: ["21", "22", "32", "45", "46", "47", "48", "49", "80", "81"],
  ler(ctx, saida) {
    saida.rendimentosPJ = [...ctx.doTipo("21"), ...ctx.doTipo("32")].map((r) =>
      semIndefinidos({
        beneficiario:
          r.tipo === "32"
            ? { tipo: "dependente", cpf: texto(r, "CPF_BENEF") }
            : { tipo: "titular" },
        fonte: { ni: texto(r, "NR_PAGADOR").replace(/\D/g, ""), nome: texto(r, "NM_PAGADOR") },
        rendimentos: numero(r, "VR_RENDTO"),
        contribuicaoPrevidenciaria: numero(r, "VR_CONTRIB"),
        impostoRetido: numero(r, "VR_IMPOSTO"),
        decimoTerceiro: numero(r, "VR_DECTERC"),
        impostoRetidoDecimoTerceiro: numero(r, "VR_IRRF13SALARIO"),
        dataComunicacaoSaida: isoDeDdmmaaaa(texto(r, "DT_COMUNICACAO_SAIDA")),
      }),
    );

    saida.rendimentosPFExterior = lerPF(ctx);

    saida.rendimentosExigibilidadeSuspensa = [...ctx.doTipo("80"), ...ctx.doTipo("81")].map(
      (r) => ({
        beneficiario:
          r.tipo === "81"
            ? { tipo: "dependente", cpf: texto(r, "CPF_BENEF") }
            : { tipo: "titular" },
        fonte: { ni: texto(r, "NR_PAGADOR"), nome: texto(r, "NM_PAGADOR") },
        rendimentos: numero(r, "VR_RENDTO"),
        depositosJudiciais: numero(r, "VR_DEP_JUDICIAL"),
      }),
    );

    const pensoes = (tipo: string, chaveRra: string) => {
      const m = new Map<bigint, Objeto[]>();
      for (const r of ctx.doTipo(tipo)) {
        const cod = numero(r, chaveRra);
        const cpf = ctx.cpfAlimentando(numero(r, "NR_CHAVE_ALIMENT"));
        if (!cpf) {
          ctx.aviso(
            `Pensão de RRA (registro ${tipo}) ligada a alimentando inexistente foi ignorada.`,
          );
          continue;
        }
        const lista = m.get(cod) ?? [];
        lista.push({ cpfAlimentando: cpf, valor: numero(r, "VR_PAGTO") });
        m.set(cod, lista);
      }
      return m;
    };
    const pensoesTit = pensoes("46", "CD_RRA_TITULAR");
    const pensoesDep = pensoes("48", "CD_RRA_DEPEND");
    saida.rendimentosAcumulados = [...ctx.doTipo("45"), ...ctx.doTipo("47")].map((r) => {
      const dep = r.tipo === "47";
      const cod = numero(r, dep ? "CD_RRA_DEPENDENTE" : "CD_RRA_TITULAR");
      return {
        beneficiario: dep
          ? { tipo: "dependente", cpf: texto(r, "CPF_BENEF") }
          : { tipo: "titular" },
        opcaoTributacao: numero(r, "OPCAO_TRIBUTACAO") === 1n ? "exclusivaNaFonte" : "ajusteAnual",
        fonte: { ni: texto(r, "NR_PAGADOR"), nome: texto(r, "NM_PAGADOR") },
        rendimentos: numero(r, "VR_RENDTO"),
        parcelaIsenta65Anos: numero(r, "VR_ISENTO_65"),
        juros: numero(r, "VR_JUROS"),
        contribuicaoPrevidenciaria: numero(r, "VR_CONTRIB"),
        pensaoAlimenticia: numero(r, "VR_PENSAO"),
        pensoes: (dep ? pensoesDep : pensoesTit).get(cod) ?? [],
        impostoRetido: numero(r, "VR_IMPOSTO"),
        mesRecebimento: Number(numero(r, "NR_MES_RECEBIMENTO")),
        numeroMeses: Number(numero(r, "NUM_MESES")) / 10,
      };
    });
  },

  gravar(ctx, dec) {
    for (const p of dec.rendimentosPJ) {
      const dep = p.beneficiario.tipo === "dependente";
      ctx.adicionar(
        dep ? "32" : "21",
        {
          ...(dep ? { CPF_BENEF: cpfDoBeneficiario(p.beneficiario, ctx) } : {}),
          NR_PAGADOR: p.fonte.ni,
          NM_PAGADOR: p.fonte.nome,
          VR_RENDTO: p.rendimentos,
          VR_CONTRIB: p.contribuicaoPrevidenciaria,
          VR_DECTERC: p.decimoTerceiro,
          VR_IMPOSTO: p.impostoRetido,
          DT_COMUNICACAO_SAIDA: ddmmaaaaDeIso(p.dataComunicacaoSaida) ?? "",
          VR_IRRF13SALARIO: p.impostoRetidoDecimoTerceiro,
        },
        dep ? ["CPF_BENEF", "NR_PAGADOR"] : ["NR_PAGADOR"],
      );
    }

    gravarPF(ctx, dec);

    for (const s of dec.rendimentosExigibilidadeSuspensa) {
      const dep = s.beneficiario.tipo === "dependente";
      ctx.adicionar(
        dep ? "81" : "80",
        {
          ...(dep ? { CPF_BENEF: cpfDoBeneficiario(s.beneficiario, ctx) } : {}),
          NR_PAGADOR: s.fonte.ni,
          NM_PAGADOR: s.fonte.nome,
          VR_RENDTO: s.rendimentos,
          VR_DEP_JUDICIAL: s.depositosJudiciais,
        },
        ["NR_PAGADOR"],
      );
    }

    let seqTit = 0;
    let seqDep = 0;
    for (const a of dec.rendimentosAcumulados) {
      const dep = a.beneficiario.tipo === "dependente";
      const cod = BigInt(dep ? ++seqDep : ++seqTit);
      const meses = Math.round(a.numeroMeses * 10);
      if (Math.abs(meses - a.numeroMeses * 10) > 1e-9) {
        ctx.aviso("O número de meses do RRA foi arredondado para uma casa decimal.");
      }
      ctx.adicionar(
        dep ? "47" : "45",
        {
          ...(dep ? { CPF_BENEF: cpfDoBeneficiario(a.beneficiario, ctx) } : {}),
          NR_PAGADOR: a.fonte.ni,
          NM_PAGADOR: a.fonte.nome,
          VR_RENDTO: a.rendimentos,
          VR_CONTRIB: a.contribuicaoPrevidenciaria,
          VR_PENSAO: a.pensaoAlimenticia,
          VR_IMPOSTO: a.impostoRetido,
          NR_MES_RECEBIMENTO: BigInt(a.mesRecebimento),
          [dep ? "CD_RRA_DEPENDENTE" : "CD_RRA_TITULAR"]: cod,
          OPCAO_TRIBUTACAO: a.opcaoTributacao === "exclusivaNaFonte" ? 1n : 0n,
          NUM_MESES: BigInt(meses),
          VR_ISENTO_65: a.parcelaIsenta65Anos,
          VR_JUROS: a.juros,
        },
        ["NR_PAGADOR", "NR_MES_RECEBIMENTO"],
      );
      for (const pensao of a.pensoes) {
        const chave = ctx.chaveAlimentando(pensao.cpfAlimentando);
        if (chave === undefined) {
          ctx.aviso(
            "Pensão de RRA para alimentando não cadastrado na ficha Alimentandos: gravada sem vínculo.",
          );
        }
        ctx.adicionar(dep ? "48" : "46", {
          NR_CHAVE_ALIMENT: chave ?? 0n,
          VR_PAGTO: pensao.valor,
          [dep ? "CD_RRA_DEPEND" : "CD_RRA_TITULAR"]: cod,
        });
      }
    }
  },
};
