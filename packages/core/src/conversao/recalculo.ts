/**
 * Recalcula os totais do Resumo a partir do modelo, usando o motor de cálculo do core.
 *
 * `entradaCalculoDoModelo` traduz a declaração para a entrada do motor (formato dos casos de
 * referência). `calcularTotais` devolve os campos dos registros 17 a 20 e do header que o
 * AutoIR sabe refazer; os demais ficam como no arquivo base (ver `CAMPOS_NAO_RECALCULADOS`).
 */
import { motor2026 } from "../calc/2026/index.js";
import type {
  ComparacaoModelos,
  EntradaCalculo2026,
  MesRendimentoPFEntrada,
} from "../calc/2026/tipos.js";
import type { Declaracao } from "../model/declaracao.js";
import type { Valores } from "./campos.js";

const txt = (v: bigint | number) => v.toString();

function ddmmaaaa(iso: string | undefined): string | undefined {
  const m = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
  return m ? `${m[3]}${m[2]}${m[1]}` : undefined;
}

/** Entrada do motor de cálculo a partir do modelo da declaração. */
export function entradaCalculoDoModelo(dec: Declaracao): EntradaCalculo2026 {
  const id = dec.identificacao;
  const nascimento = ddmmaaaa(id.dataNascimento);
  const meses: MesRendimentoPFEntrada[] = [];
  for (const p of dec.rendimentosPFExterior) {
    for (let m = 0; m < 12; m++) {
      const v = (l: readonly bigint[]) => l[m] ?? 0n;
      meses.push({
        mes: m + 1,
        pessoaFisica: txt(v(p.trabalhoNaoAssalariado) + v(p.alugueis) + v(p.outros)),
        exterior: txt(v(p.exterior)),
        previdenciaOficial: txt(v(p.previdenciaOficial)),
        dependentes: txt(p.quantidadeDependentes[m] ?? 0),
        pensao: txt(v(p.pensaoAlimenticia)),
        livroCaixa: txt(v(p.livroCaixa)),
        carneLeao: txt(v(p.carneLeaoPago)),
      });
    }
  }
  const isentos = new Map<string, bigint>();
  for (const i of dec.rendimentosIsentos) {
    const v =
      "valorInformado" in i
        ? i.valorInformado + i.valorTransportado
        : i.valor + ("decimoTerceiro" in i ? i.decimoTerceiro : 0n);
    isentos.set(i.codigo, (isentos.get(i.codigo) ?? 0n) + v);
  }
  const exclusivos = new Map<string, bigint>();
  for (const e of dec.rendimentosExclusivos) {
    exclusivos.set(e.codigo, (exclusivos.get(e.codigo) ?? 0n) + e.valor);
  }
  const soma = (l: readonly { valor: bigint }[]) => l.reduce((s, x) => s + x.valor, 0n);
  return {
    titular: { cpf: id.cpf, nome: id.nome, ...(nascimento ? { nascimento } : {}) },
    dependentes: dec.dependentes.map((d) => ({
      cpf: d.cpf,
      nome: d.nome,
      codigo: d.codigo,
      ...(ddmmaaaa(d.dataNascimento) ? { nascimento: ddmmaaaa(d.dataNascimento) as string } : {}),
    })),
    rendimentosPJ: dec.rendimentosPJ.map((r) => ({
      cnpj: r.fonte.ni,
      nome: r.fonte.nome,
      rendimento: txt(r.rendimentos),
      previdenciaOficial: txt(r.contribuicaoPrevidenciaria),
      irrf: txt(r.impostoRetido),
      decimoTerceiro: txt(r.decimoTerceiro),
      irrfDecimoTerceiro: txt(r.impostoRetidoDecimoTerceiro),
      beneficiario: r.beneficiario.tipo === "dependente" ? "D" : "T",
      ...(r.beneficiario.tipo === "dependente" ? { cpfDependente: r.beneficiario.cpf } : {}),
    })),
    rendimentosPF: { meses },
    pagamentos: dec.pagamentos.map((p) => ({
      codigo: p.codigo,
      ...(p.niBeneficiario ? { cpfCnpj: p.niBeneficiario } : {}),
      valor: txt(p.valorPago),
      parcelaNaoDedutivel: txt(p.parcelaNaoDedutivel),
      beneficiario:
        p.realizadoCom.tipo === "dependente"
          ? "D"
          : p.realizadoCom.tipo === "alimentando"
            ? "A"
            : "T",
      ...(p.realizadoCom.tipo !== "titular" ? { cpfDependente: p.realizadoCom.cpf } : {}),
    })),
    rendimentosIsentos: [...isentos].map(([codigo, v]) => ({ codigo, valor: txt(v) })),
    tributacaoExclusiva: [...exclusivos].map(([codigo, v]) => ({ codigo, valor: txt(v) })),
    impostoPago: {
      complementar: txt(dec.impostoPago.impostoComplementar),
      exterior: txt(dec.impostoPago.impostoPagoExterior),
      irrfLei11033: txt(dec.impostoPago.impostoRetidoLei11033),
    },
    doacoesDiretas: {
      eca: txt(soma(dec.doacoesDiretamenteNaDeclaracao.eca)),
      idoso: txt(soma(dec.doacoesDiretamenteNaDeclaracao.idoso)),
    },
    doacoesEfetuadas: dec.doacoesEfetuadas.map((d) => ({
      codigo: d.codigo,
      valor: txt(d.valor),
      parcelaNaoDedutivel: txt(d.parcelaNaoDedutivel),
    })),
  };
}

export interface TotaisCalculados {
  readonly r17: Valores;
  readonly r18: Valores;
  readonly r19: Valores;
  readonly r20: Valores;
  readonly header: Valores;
  /** Saldo a pagar do modelo escolhido no Resumo. */
  readonly saldoAPagar: bigint;
  readonly comparacao: ComparacaoModelos;
}

/** Totais dos registros 17 a 20 e do header refeitos a partir do modelo. */
export function calcularTotais(dec: Declaracao): TotaisCalculados {
  const comparacao = motor2026.compararModelos(entradaCalculoDoModelo(dec));
  const escolhido =
    dec.resumo.opcaoTributacao === "deducoesLegais" ? comparacao.completo : comparacao.simplificado;
  return {
    r17: {},
    r18: {},
    r19: {},
    r20: {},
    header: {},
    saldoAPagar: escolhido.saldoPagar,
    comparacao,
  };
}
