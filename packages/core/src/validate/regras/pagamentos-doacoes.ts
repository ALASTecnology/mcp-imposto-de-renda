/**
 * Regras das fichas Pagamentos Efetuados, Doações Efetuadas, Doações
 * Diretamente na Declaração e Doações a Partidos (tabela pagamentos.json;
 * notas 01 G-RRA, 02 F-ALIM, 05 F-PARTIDOS e F-RESUMO-DED).
 */
import { CODIGOS_DOACAO } from "../../model/pagamentos-doacoes.js";
import { buscarCodigo } from "../../tabelas/index.js";
import { type Pendencia, pendencia, regra } from "../pendencia.js";
import { type Contexto, niValido, normalizarTexto } from "../util.js";

export const PAG_CODIGO = regra({
  codigo: "PAG-CODIGO",
  gravidade: "erro",
  ficha: "pagamentos",
  descricao: "Código existente na tabela de pagamentos e que não seja código de doação.",
  fonte: "Tabela pagamentos.json (Lei 9.250/1995, art. 8º)",
});
export const PAG_PRESTADOR = regra({
  codigo: "PAG-PRESTADOR",
  gravidade: "erro",
  ficha: "pagamentos",
  descricao:
    "Pagamentos no Brasil (instrução, despesas médicas, pensão, previdência, advogados, aluguéis etc.) exigem CPF/CNPJ do beneficiário com DV correto.",
  fonte:
    "Ajuda, ficha Pagamentos Efetuados; nota 01 G-RRA (códigos 60 e 61 com CPF/CNPJ); Lei 9.250/1995, art. 8º, § 2º, III",
});
export const PAG_CNPJ = regra({
  codigo: "PAG-CNPJ",
  gravidade: "erro",
  ficha: "pagamentos",
  descricao:
    "Plano de saúde (26) e previdência complementar (36 e 37) são pagos a pessoa jurídica: exigem CNPJ.",
  fonte: "Tabela pagamentos.json; Lei 9.250/1995, art. 8º, II, a e e (inferido)",
});
export const PAG_PENSAO = regra({
  codigo: "PAG-PENSAO",
  gravidade: "erro",
  ficha: "pagamentos",
  descricao: "Pensão alimentícia (30, 31, 33 e 34) é paga a alimentando cadastrado.",
  fonte: "Nota 02 F-ALIM; nota 05 F-RESUMO-DED, linhas 7 e 8",
});
export const PAG_VINCULO = regra({
  codigo: "PAG-VINCULO",
  gravidade: "erro",
  ficha: "pagamentos",
  descricao:
    "Despesa de dependente ou alimentando exige a pessoa cadastrada na ficha correspondente.",
  fonte: 'Ficha Pagamentos Efetuados, campo "Despesa realizada com"; nota 02 F-DEP e F-ALIM',
});
export const PAG_ALIMENTANDO_CODIGO = regra({
  codigo: "PAG-ALIMENTANDO-CODIGO",
  gravidade: "erro",
  ficha: "pagamentos",
  descricao: "Com alimentando só cabem despesas de instrução, médicas e pensão alimentícia.",
  fonte: "Nota 02 F-ALIM (base para pensão, instrução e despesas médicas do alimentando)",
});
export const PAG_REEMBOLSO = regra({
  codigo: "PAG-REEMBOLSO",
  gravidade: "erro",
  ficha: "pagamentos",
  descricao: "Parcela não dedutível ou reembolsada não pode superar o valor pago.",
  fonte: "Nota 05 F-RESUMO-DED, linhas 5 e 6 (pago menos reembolsado)",
});
export const PAG_PROPRIO = regra({
  codigo: "PAG-PROPRIO",
  gravidade: "aviso",
  ficha: "pagamentos",
  descricao: "Prestador de serviço com o CPF do próprio titular ou de dependente.",
  fonte: "Malha fina de despesas médicas e de instrução (inferido)",
});
export const PAG_PATROCINADOR = regra({
  codigo: "PAG-PATROCINADOR",
  gravidade: "aviso",
  ficha: "pagamentos",
  descricao: "Contribuição do ente patrocinador só se aplica ao código 37 (Funpresp).",
  fonte: "Nota 05 F-RESUMO-DED, linhas 1 e 3; registro 19 VR_ATE_LIMITE_FUNPRESP",
});
export const DOA_BENEFICIARIO = regra({
  codigo: "DOA-BENEFICIARIO",
  gravidade: "erro",
  ficha: "doacoesEfetuadas",
  descricao: "CPF/CNPJ do beneficiário da doação com DV correto.",
  fonte: "Ficha Doações Efetuadas (registro 90)",
});
export const DOA_REEMBOLSO = regra({
  codigo: "DOA-REEMBOLSO",
  gravidade: "erro",
  ficha: "doacoesEfetuadas",
  descricao: "Parcela não dedutível não pode superar o valor doado.",
  fonte: "Ficha Doações Efetuadas (registro 90 VR_PARC_NAO_DEDUT)",
});
export const DDD_FUNDO = regra({
  codigo: "DDD-FUNDO",
  gravidade: "erro",
  ficha: "doacoesDiretamenteNaDeclaracao",
  descricao:
    "Fundo estadual ou municipal identificado pelo CNPJ da tabela, com UF e município coerentes.",
  fonte: "Tabelas fundos-eca.json e fundos-idoso.json (Lei 8.069/1990, art. 260; Lei 12.213/2010)",
});
export const DDD_SIMPLIFICADO = regra({
  codigo: "DDD-SIMPLIFICADO",
  gravidade: "aviso",
  ficha: "doacoesDiretamenteNaDeclaracao",
  descricao: "Doações diretamente na declaração só são dedutíveis no modelo com deduções legais.",
  fonte: "Nota 05 F-RESUMO-SIMPL (sem dedução de incentivo, inferido)",
});
export const PAR_CNPJ = regra({
  codigo: "PAR-CNPJ",
  gravidade: "erro",
  ficha: "doacoesPartidos",
  descricao: "CNPJ do partido ou candidato com DV correto.",
  fonte: "Nota 05 F-PARTIDOS; Ajuda pág. 239",
});

export const REGRAS_PAGAMENTOS_DOACOES = [
  PAG_CODIGO,
  PAG_PRESTADOR,
  PAG_CNPJ,
  PAG_PENSAO,
  PAG_VINCULO,
  PAG_ALIMENTANDO_CODIGO,
  PAG_REEMBOLSO,
  PAG_PROPRIO,
  PAG_PATROCINADOR,
  DOA_BENEFICIARIO,
  DOA_REEMBOLSO,
  DDD_FUNDO,
  DDD_SIMPLIFICADO,
  PAR_CNPJ,
];

/** Códigos de pagamento no exterior: dispensam CPF/CNPJ do beneficiário. */
const CODIGOS_EXTERIOR = new Set(["02", "15", "16", "17", "18", "19", "20", "22", "31", "34"]);
/** Códigos de pensão alimentícia. */
export const CODIGOS_PENSAO = new Set(["30", "31", "33", "34"]);
/** Códigos que exigem CNPJ do beneficiário. */
const CODIGOS_CNPJ = new Set(["26", "36", "37"]);
/** Códigos admitidos para despesas com alimentando. */
const CODIGOS_ALIMENTANDO = new Set([
  "01",
  "02",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "26",
  "30",
  "31",
  "33",
  "34",
]);
const CODIGOS_DOACAO_SET: ReadonlySet<string> = new Set(CODIGOS_DOACAO.filter((c) => c !== "99"));

export function validarPagamentosDoacoes(ctx: Contexto): Pendencia[] {
  const d = ctx.declaracao;
  const out: Pendencia[] = [];
  const cpfsProprios = new Set([d.identificacao.cpf, ...ctx.cpfsDependentes]);

  d.pagamentos.forEach((p, i) => {
    const c = (campo: string) => `pagamentos[${i}].${campo}`;
    if (!buscarCodigo("pagamentos", p.codigo) || CODIGOS_DOACAO_SET.has(p.codigo)) {
      out.push(
        pendencia(
          PAG_CODIGO,
          c("codigo"),
          `Código ${p.codigo} não pertence à ficha Pagamentos Efetuados.`,
        ),
      );
    }
    if (p.niBeneficiario) {
      if (!niValido(p.niBeneficiario)) {
        out.push(
          pendencia(PAG_PRESTADOR, c("niBeneficiario"), `CPF/CNPJ ${p.niBeneficiario} inválido.`),
        );
      }
    } else if (!CODIGOS_EXTERIOR.has(p.codigo)) {
      out.push(
        pendencia(
          PAG_PRESTADOR,
          c("niBeneficiario"),
          `Informe o CPF/CNPJ de ${p.nomeBeneficiario} (código ${p.codigo}).`,
        ),
      );
    }
    if (CODIGOS_CNPJ.has(p.codigo) && p.niBeneficiario && p.niBeneficiario.length !== 14) {
      out.push(
        pendencia(PAG_CNPJ, c("niBeneficiario"), `O código ${p.codigo} exige o CNPJ da entidade.`),
      );
    }
    const rc = p.realizadoCom;
    if (CODIGOS_PENSAO.has(p.codigo) && rc.tipo !== "alimentando") {
      out.push(
        pendencia(
          PAG_PENSAO,
          c("realizadoCom"),
          "Pensão alimentícia deve indicar o alimentando beneficiário.",
        ),
      );
    }
    if (rc.tipo === "dependente" && !ctx.cpfsDependentes.has(rc.cpf)) {
      out.push(
        pendencia(
          PAG_VINCULO,
          c("realizadoCom.cpf"),
          "Dependente não cadastrado na ficha Dependentes.",
        ),
      );
    }
    if (rc.tipo === "alimentando") {
      if (!ctx.cpfsAlimentandos.has(rc.cpf)) {
        out.push(
          pendencia(
            PAG_VINCULO,
            c("realizadoCom.cpf"),
            "Alimentando não cadastrado na ficha Alimentandos.",
          ),
        );
      }
      if (!CODIGOS_ALIMENTANDO.has(p.codigo)) {
        out.push(
          pendencia(
            PAG_ALIMENTANDO_CODIGO,
            c("codigo"),
            `O código ${p.codigo} não admite despesa com alimentando.`,
          ),
        );
      }
    }
    if (p.parcelaNaoDedutivel > p.valorPago) {
      out.push(
        pendencia(
          PAG_REEMBOLSO,
          c("parcelaNaoDedutivel"),
          "Parcela não dedutível maior que o valor pago.",
        ),
      );
    }
    if (p.niBeneficiario && !CODIGOS_PENSAO.has(p.codigo) && cpfsProprios.has(p.niBeneficiario)) {
      out.push(
        pendencia(
          PAG_PROPRIO,
          c("niBeneficiario"),
          "O beneficiário do pagamento é o próprio titular ou um dependente.",
        ),
      );
    }
    if (p.contribuicaoPatrocinador > 0n && p.codigo !== "37") {
      out.push(
        pendencia(
          PAG_PATROCINADOR,
          c("contribuicaoPatrocinador"),
          "Contribuição do patrocinador só no código 37.",
        ),
      );
    }
  });

  d.doacoesEfetuadas.forEach((doa, i) => {
    const c = (campo: string) => `doacoesEfetuadas[${i}].${campo}`;
    if (!niValido(doa.niBeneficiario)) {
      out.push(
        pendencia(
          DOA_BENEFICIARIO,
          c("niBeneficiario"),
          `CPF/CNPJ ${doa.niBeneficiario} inválido.`,
        ),
      );
    }
    if (doa.parcelaNaoDedutivel > doa.valor) {
      out.push(
        pendencia(
          DOA_REEMBOLSO,
          c("parcelaNaoDedutivel"),
          "Parcela não dedutível maior que o valor doado.",
        ),
      );
    }
  });

  const ddd = d.doacoesDiretamenteNaDeclaracao;
  for (const tipo of ["eca", "idoso"] as const) {
    const tabela = tipo === "eca" ? "fundos-eca" : "fundos-idoso";
    ddd[tipo].forEach((doa, i) => {
      const c = (campo: string) => `doacoesDiretamenteNaDeclaracao.${tipo}[${i}].${campo}`;
      if (doa.tipoFundo === "nacional") {
        if (!niValido(doa.cnpjFundo))
          out.push(pendencia(DDD_FUNDO, c("cnpjFundo"), "CNPJ do fundo nacional inválido."));
        return;
      }
      if (!doa.uf || (doa.tipoFundo === "municipal" && !doa.municipio)) {
        out.push(
          pendencia(
            DDD_FUNDO,
            c(doa.uf ? "municipio" : "uf"),
            "Informe a UF e, no fundo municipal, o município.",
          ),
        );
        return;
      }
      const fundo = buscarCodigo(tabela, doa.cnpjFundo);
      const esfera = doa.tipoFundo === "estadual" ? "estadual/distrital" : "municipal";
      if (!fundo || fundo.esfera !== esfera || fundo.uf !== doa.uf) {
        out.push(
          pendencia(
            DDD_FUNDO,
            c("cnpjFundo"),
            `CNPJ ${doa.cnpjFundo} não corresponde a fundo ${doa.tipoFundo} da UF ${doa.uf}.`,
          ),
        );
      } else if (
        doa.tipoFundo === "municipal" &&
        doa.municipio &&
        fundo.municipio &&
        normalizarTexto(fundo.municipio) !== normalizarTexto(doa.municipio)
      ) {
        out.push(
          pendencia(
            DDD_FUNDO,
            c("municipio"),
            `O CNPJ informado é do fundo de ${fundo.municipio}.`,
          ),
        );
      }
    });
  }
  if (
    (ddd.eca.length > 0 || ddd.idoso.length > 0) &&
    d.resumo.opcaoTributacao === "descontoSimplificado"
  ) {
    out.push(
      pendencia(
        DDD_SIMPLIFICADO,
        "resumo.opcaoTributacao",
        "Doações diretamente na declaração não são deduzidas no desconto simplificado.",
      ),
    );
  }

  d.doacoesPartidos.forEach((doa, i) => {
    if (!niValido(doa.cnpj)) {
      out.push(
        pendencia(
          PAR_CNPJ,
          `doacoesPartidos[${i}].cnpj`,
          `CNPJ ${doa.cnpj} de ${doa.nome} inválido.`,
        ),
      );
    }
  });
  return out;
}
