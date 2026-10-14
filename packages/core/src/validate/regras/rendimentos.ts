/**
 * Regras das fichas de rendimentos tributáveis, isentos, exclusivos, com
 * exigibilidade suspensa, RRA e Imposto Pago/Retido (notas 02 e 03).
 */
import type { Beneficiario, Pessoa } from "../../model/comum.js";
import type { Ficha } from "../../model/declaracao.js";
import { type Pendencia, pendencia, type Regra, regra } from "../pendencia.js";
import {
  beneficiarioExiste,
  type Contexto,
  FIM_ANO_CALENDARIO,
  idadeEm,
  niValido,
} from "../util.js";

function regraBeneficiario(ficha: Ficha, sufixo: string): Regra {
  return regra({
    codigo: `${sufixo}-DEPENDENTE`,
    gravidade: "erro",
    ficha,
    descricao: "Lançamento de dependente exige o dependente cadastrado na ficha Dependentes.",
    fonte: "Notas 02 F-RTPJ-DEP, F-RTPF-DEP-CPF e 03 F-ISENTO, F-SUSP-DEP, F-RRA-DEP",
  });
}

function regraFonte(ficha: Ficha, sufixo: string): Regra {
  return regra({
    codigo: `${sufixo}-FONTE`,
    gravidade: "erro",
    ficha,
    descricao: "CPF/CNPJ da fonte pagadora (ou do doador/alimentante) com DV correto.",
    fonte: "Notas 02 F-RTPJ-TIT e 03 F-ISENTO, F-SUSP-TIT, F-RRA-TIT",
  });
}

export const RPJ_DEPENDENTE = regraBeneficiario("rendimentosPJ", "RPJ");
export const RPJ_FONTE = regraFonte("rendimentosPJ", "RPJ");
export const RPJ_IRRF = regra({
  codigo: "RPJ-IRRF",
  gravidade: "aviso",
  ficha: "rendimentosPJ",
  descricao: "Imposto retido maior que o rendimento indica erro de digitação.",
  fonte: "Nota 02 F-RTPJ-TIT (inferido; malha fina)",
});
export const RPF_DEPENDENTE = regraBeneficiario("rendimentosPFExterior", "RPF");
export const RPF_DUPLICADO = regra({
  codigo: "RPF-DUPLICADO",
  gravidade: "erro",
  ficha: "rendimentosPFExterior",
  descricao: "Cada pessoa tem uma única escrituração mensal na ficha PF/Exterior.",
  fonte: "Nota 02 F-RTPF (abas Titular e Dependentes)",
});
export const RPF_NIT = regra({
  codigo: "RPF-NIT",
  gravidade: "erro",
  ficha: "rendimentosPFExterior",
  descricao: "Previdência oficial informada exige NIT/PIS/PASEP.",
  fonte: "Nota 02 F-RTPF-NIT e F-RTPF-PREV; Ajuda págs. 59 e 61",
});
export const RPF_LIVRO_CAIXA = regra({
  codigo: "RPF-LIVRO-CAIXA",
  gravidade: "aviso",
  ficha: "rendimentosPFExterior",
  descricao: "Livro Caixa só se aplica a quem recebe rendimentos do trabalho não assalariado.",
  fonte: "Nota 02 F-RTPF-LIVROCAIXA; Ajuda pág. 64",
});
export const RPF_PAGADOR = regra({
  codigo: "RPF-PAGADOR",
  gravidade: "erro",
  ficha: "rendimentosPFExterior",
  descricao: "CPF do titular do pagamento e do beneficiário do serviço com DV correto.",
  fonte: "Nota 02 F-RTPF-IMPCL e F-RTPF-TNA; registro 49",
});
export const RPF_PENSAO = regra({
  codigo: "RPF-PENSAO",
  gravidade: "aviso",
  ficha: "rendimentosPFExterior",
  descricao:
    "Pensão alimentícia na ficha PF é informativa: a dedução exige lançamento em Pagamentos (30, 31, 33 ou 34).",
  fonte: "Nota 02 F-RTPF-PENSAO; Ajuda pág. 63",
});
export const ISE_DEPENDENTE = regraBeneficiario("rendimentosIsentos", "ISE");
export const ISE_FONTE = regraFonte("rendimentosIsentos", "ISE");
export const ISE_65_IDADE = regra({
  codigo: "ISE-65-IDADE",
  gravidade: "aviso",
  ficha: "rendimentosIsentos",
  descricao: "Parcela isenta do código 10 exige 65 anos ou mais no ano-calendário.",
  fonte: "Nota 03 F-ISENTO-10; nota 01 G-REND-TRAB; Ajuda pág. 88",
});
export const ISE_65_LIMITE = regra({
  codigo: "ISE-65-LIMITE",
  gravidade: "aviso",
  ficha: "rendimentosIsentos",
  descricao:
    "Código 10: soma anual por beneficiário até R$ 22.847,76 e 13º até R$ 1.903,98 por fonte; o excedente é tributável.",
  fonte: "Nota 03 F-ISENTO-10; Ajuda págs. 88 a 92",
});
export const ISE_MOLESTIA = regra({
  codigo: "ISE-MOLESTIA",
  gravidade: "aviso",
  ficha: "rendimentosIsentos",
  descricao:
    "Código 11 (moléstia grave) do titular com a marcação de doença grave na Identificação.",
  fonte: "Nota 03 F-ISENTO-11 (inferido); nota 02 F-IDENT-DOENCA",
});
export const EXC_DEPENDENTE = regraBeneficiario("rendimentosExclusivos", "EXC");
export const EXC_FONTE = regraFonte("rendimentosExclusivos", "EXC");
export const SUS_DEPENDENTE = regraBeneficiario("rendimentosExigibilidadeSuspensa", "SUS");
export const SUS_FONTE = regraFonte("rendimentosExigibilidadeSuspensa", "SUS");
export const RRA_DEPENDENTE = regraBeneficiario("rendimentosAcumulados", "RRA");
export const RRA_FONTE = regraFonte("rendimentosAcumulados", "RRA");
export const RRA_OPCAO = regra({
  codigo: "RRA-OPCAO",
  gravidade: "erro",
  ficha: "rendimentosAcumulados",
  descricao: "A opção de tributação deve ser a mesma em todos os RRA de um mesmo beneficiário.",
  fonte: "Nota 03 F-RRA e F-RRA-TIT; Ajuda pág. 125",
});
export const RRA_ISENTA_65 = regra({
  codigo: "RRA-ISENTA-65",
  gravidade: "aviso",
  ficha: "rendimentosAcumulados",
  descricao:
    "Com opção exclusiva na fonte não há parcela isenta de 65 anos (o valor soma aos tributáveis).",
  fonte: "Nota 03 F-RRA-TIT; Ajuda pág. 127",
});
export const RRA_PENSAO = regra({
  codigo: "RRA-PENSAO",
  gravidade: "erro",
  ficha: "rendimentosAcumulados",
  descricao: "Pensão descontada do RRA deve ser paga a alimentando cadastrado.",
  fonte: "Registros 46 e 48 (NR_CHAVE_ALIMENT); nota 03 F-RRA-TIT",
});
export const IMP_EXTERIOR = regra({
  codigo: "IMP-EXTERIOR",
  gravidade: "aviso",
  ficha: "impostoPago",
  descricao:
    "Imposto pago no exterior só é compensável com rendimentos do exterior na ficha PF/Exterior.",
  fonte: "Nota 03 F-IMPPAGO-02; Ajuda pág. 135",
});

export const REGRAS_RENDIMENTOS = [
  RPJ_DEPENDENTE,
  RPJ_FONTE,
  RPJ_IRRF,
  RPF_DEPENDENTE,
  RPF_DUPLICADO,
  RPF_NIT,
  RPF_LIVRO_CAIXA,
  RPF_PAGADOR,
  RPF_PENSAO,
  ISE_DEPENDENTE,
  ISE_FONTE,
  ISE_65_IDADE,
  ISE_65_LIMITE,
  ISE_MOLESTIA,
  EXC_DEPENDENTE,
  EXC_FONTE,
  SUS_DEPENDENTE,
  SUS_FONTE,
  RRA_DEPENDENTE,
  RRA_FONTE,
  RRA_OPCAO,
  RRA_ISENTA_65,
  RRA_PENSAO,
  IMP_EXTERIOR,
];

/** Limite anual da parcela isenta de 65 anos (12 x R$ 1.903,98) e limite do 13º por fonte. */
const LIMITE_ANUAL_65 = 2284776n;
const LIMITE_13_65 = 190398n;

function chaveBeneficiario(b: Beneficiario): string {
  return b.tipo === "titular" ? "titular" : b.cpf;
}

function soma(valores: readonly bigint[]): bigint {
  return valores.reduce((a, v) => a + v, 0n);
}

function checarBeneficiarioEFonte(
  ctx: Contexto,
  out: Pendencia[],
  regras: { dep: Regra; fonte: Regra },
  base: string,
  beneficiario: Beneficiario | undefined,
  fonte: Pessoa | undefined,
): void {
  if (beneficiario && !beneficiarioExiste(ctx, beneficiario)) {
    out.push(
      pendencia(
        regras.dep,
        `${base}.beneficiario.cpf`,
        "Dependente não cadastrado na ficha Dependentes.",
      ),
    );
  }
  if (fonte && !niValido(fonte.ni)) {
    out.push(
      pendencia(
        regras.fonte,
        `${base}.fonte.ni`,
        `CPF/CNPJ ${fonte.ni} de ${fonte.nome} inválido.`,
      ),
    );
  }
}

export function validarRendimentos(ctx: Contexto): Pendencia[] {
  const d = ctx.declaracao;
  const out: Pendencia[] = [];

  d.rendimentosPJ.forEach((r, i) => {
    const base = `rendimentosPJ[${i}]`;
    checarBeneficiarioEFonte(
      ctx,
      out,
      { dep: RPJ_DEPENDENTE, fonte: RPJ_FONTE },
      base,
      r.beneficiario,
      r.fonte,
    );
    if (r.impostoRetido > r.rendimentos) {
      out.push(
        pendencia(
          RPJ_IRRF,
          `${base}.impostoRetido`,
          "Imposto retido maior que o rendimento recebido.",
        ),
      );
    }
  });

  const pessoasPF = new Set<string>();
  d.rendimentosPFExterior.forEach((r, i) => {
    const base = `rendimentosPFExterior[${i}]`;
    checarBeneficiarioEFonte(
      ctx,
      out,
      { dep: RPF_DEPENDENTE, fonte: RPJ_FONTE },
      base,
      r.beneficiario,
      undefined,
    );
    const chave = chaveBeneficiario(r.beneficiario);
    if (pessoasPF.has(chave)) {
      out.push(
        pendencia(
          RPF_DUPLICADO,
          `${base}.beneficiario`,
          "Escrituração mensal repetida para a mesma pessoa.",
        ),
      );
    }
    pessoasPF.add(chave);
    const nit =
      r.nitPisPasep ??
      (r.beneficiario.tipo === "titular"
        ? d.identificacao.nitPisPasep
        : d.dependentes.find((x) => x.cpf === (r.beneficiario as { cpf: string }).cpf)
            ?.nitPisPasep);
    if (soma(r.previdenciaOficial) > 0n && !nit) {
      out.push(
        pendencia(
          RPF_NIT,
          `${base}.nitPisPasep`,
          "Informe o NIT/PIS/PASEP de quem recolheu a previdência oficial.",
        ),
      );
    }
    if (soma(r.livroCaixa) > 0n && soma(r.trabalhoNaoAssalariado) === 0n) {
      const temPJ = d.rendimentosPJ.some(
        (pj) => chaveBeneficiario(pj.beneficiario) === chave && pj.rendimentos > 0n,
      );
      if (!temPJ) {
        out.push(
          pendencia(
            RPF_LIVRO_CAIXA,
            `${base}.livroCaixa`,
            "Livro Caixa informado sem rendimentos do trabalho não assalariado.",
          ),
        );
      }
    }
    r.pagamentosRecebidos.forEach((p, j) => {
      const pb = `${base}.pagamentosRecebidos[${j}]`;
      if (!niValido(p.cpfTitularPagamento)) {
        out.push(
          pendencia(
            RPF_PAGADOR,
            `${pb}.cpfTitularPagamento`,
            "CPF do titular do pagamento inválido.",
          ),
        );
      }
      if (p.cpfBeneficiarioServico && !niValido(p.cpfBeneficiarioServico)) {
        out.push(
          pendencia(
            RPF_PAGADOR,
            `${pb}.cpfBeneficiarioServico`,
            "CPF do beneficiário do serviço inválido.",
          ),
        );
      }
    });
    if (soma(r.pensaoAlimenticia) > 0n) {
      const temPagamento = d.pagamentos.some((p) => ["30", "31", "33", "34"].includes(p.codigo));
      if (!temPagamento) {
        out.push(
          pendencia(
            RPF_PENSAO,
            `${base}.pensaoAlimenticia`,
            "Pensão alimentícia informada na ficha PF sem lançamento em Pagamentos Efetuados; ela não será deduzida.",
          ),
        );
      }
    }
  });

  // Isentos.
  const soma65 = new Map<string, bigint>();
  d.rendimentosIsentos.forEach((r, i) => {
    const base = `rendimentosIsentos[${i}]`;
    const beneficiario = "beneficiario" in r ? r.beneficiario : undefined;
    const fonte = "fonte" in r ? r.fonte : "doador" in r ? r.doador : undefined;
    checarBeneficiarioEFonte(
      ctx,
      out,
      { dep: ISE_DEPENDENTE, fonte: ISE_FONTE },
      base,
      beneficiario,
      fonte,
    );
    if (r.codigo === "28" && !niValido(r.cpfAlimentante)) {
      out.push(pendencia(ISE_FONTE, `${base}.cpfAlimentante`, "CPF do alimentante inválido."));
    }
    if (r.codigo === "10") {
      const nascimento =
        r.beneficiario.tipo === "titular"
          ? d.identificacao.dataNascimento
          : d.dependentes.find((x) => x.cpf === (r.beneficiario as { cpf: string }).cpf)
              ?.dataNascimento;
      if (nascimento && idadeEm(nascimento, FIM_ANO_CALENDARIO) < 65) {
        out.push(
          pendencia(
            ISE_65_IDADE,
            `${base}.beneficiario`,
            "Beneficiário com menos de 65 anos em 31/12/2025 no código 10.",
          ),
        );
      }
      if (r.decimoTerceiro > LIMITE_13_65) {
        out.push(
          pendencia(
            ISE_65_LIMITE,
            `${base}.decimoTerceiro`,
            "13º isento acima de R$ 1.903,98 nesta fonte; o excedente é tributável.",
          ),
        );
      }
      const chave = chaveBeneficiario(r.beneficiario);
      soma65.set(chave, (soma65.get(chave) ?? 0n) + r.valor);
    }
    if (
      r.codigo === "11" &&
      r.beneficiario.tipo === "titular" &&
      !d.identificacao.doencaGraveOuDeficiencia
    ) {
      out.push(
        pendencia(
          ISE_MOLESTIA,
          `${base}.codigo`,
          "Rendimento isento por moléstia grave sem a marcação de doença grave ou deficiência na Identificação.",
        ),
      );
    }
  });
  for (const [chave, total] of soma65) {
    if (total > LIMITE_ANUAL_65) {
      out.push(
        pendencia(
          ISE_65_LIMITE,
          "rendimentosIsentos",
          `Parcela isenta de 65 anos (${chave === "titular" ? "titular" : `CPF ${chave}`}) acima de R$ 22.847,76 somando as fontes; transfira o excedente para Rendimentos Tributáveis.`,
        ),
      );
    }
  }

  d.rendimentosExclusivos.forEach((r, i) => {
    const base = `rendimentosExclusivos[${i}]`;
    const beneficiario = "beneficiario" in r ? r.beneficiario : undefined;
    const fonte = "fonte" in r ? r.fonte : undefined;
    checarBeneficiarioEFonte(
      ctx,
      out,
      { dep: EXC_DEPENDENTE, fonte: EXC_FONTE },
      base,
      beneficiario,
      fonte,
    );
  });

  d.rendimentosExigibilidadeSuspensa.forEach((r, i) => {
    checarBeneficiarioEFonte(
      ctx,
      out,
      { dep: SUS_DEPENDENTE, fonte: SUS_FONTE },
      `rendimentosExigibilidadeSuspensa[${i}]`,
      r.beneficiario,
      r.fonte,
    );
  });

  const opcoesRRA = new Map<string, string>();
  d.rendimentosAcumulados.forEach((r, i) => {
    const base = `rendimentosAcumulados[${i}]`;
    checarBeneficiarioEFonte(
      ctx,
      out,
      { dep: RRA_DEPENDENTE, fonte: RRA_FONTE },
      base,
      r.beneficiario,
      r.fonte,
    );
    const chave = chaveBeneficiario(r.beneficiario);
    const anterior = opcoesRRA.get(chave);
    if (anterior !== undefined && anterior !== r.opcaoTributacao) {
      out.push(
        pendencia(
          RRA_OPCAO,
          `${base}.opcaoTributacao`,
          "Opção de tributação diferente de outro RRA do mesmo beneficiário.",
        ),
      );
    }
    opcoesRRA.set(chave, anterior ?? r.opcaoTributacao);
    if (r.opcaoTributacao === "exclusivaNaFonte" && r.parcelaIsenta65Anos > 0n) {
      out.push(
        pendencia(
          RRA_ISENTA_65,
          `${base}.parcelaIsenta65Anos`,
          "Na opção exclusiva na fonte não há parcela isenta de 65 anos; o valor é somado aos tributáveis.",
        ),
      );
    }
    r.pensoes.forEach((p, j) => {
      if (!ctx.cpfsAlimentandos.has(p.cpfAlimentando)) {
        out.push(
          pendencia(
            RRA_PENSAO,
            `${base}.pensoes[${j}].cpfAlimentando`,
            "Alimentando não cadastrado.",
          ),
        );
      }
    });
  });

  if (d.impostoPago.impostoPagoExterior > 0n) {
    const temExterior = d.rendimentosPFExterior.some((r) => soma(r.exterior) > 0n);
    if (!temExterior) {
      out.push(
        pendencia(
          IMP_EXTERIOR,
          "impostoPago.impostoPagoExterior",
          "Imposto pago no exterior sem rendimentos do exterior na ficha PF/Exterior; não será compensado.",
        ),
      );
    }
  }
  return out;
}
