/**
 * Regras das situações especiais: Espólio (natureza 81), Declaração Final de
 * Espólio, Herdeiros, Saída Definitiva e Informações do Cônjuge (notas 01
 * T-ESPOLIO-FINAL, T-SAIDA, G-ESPOLIO; 05 F-ESPOLIO; 06 E-ESP-*).
 */
import { buscarCodigo } from "../../tabelas/index.js";
import { type Pendencia, pendencia, regra } from "../pendencia.js";
import { type Contexto, FIM_ANO_CALENDARIO, INICIO_ANO_CALENDARIO, niValido } from "../util.js";

export const ESP_FICHA = regra({
  codigo: "ESP-FICHA",
  gravidade: "erro",
  ficha: "espolio",
  descricao:
    "A ficha Espólio do ajuste anual existe se, e somente se, a natureza da ocupação é 81.",
  fonte: "Nota 05 F-ESPOLIO; nota 01 G-ESPOLIO; Ajuda pág. 238",
});
export const ESP_INVENTARIANTE = regra({
  codigo: "ESP-INVENTARIANTE",
  gravidade: "erro",
  ficha: "espolio",
  descricao: "CPF do inventariante com DV correto e diferente do CPF do falecido.",
  fonte: "Nota 05 F-ESPOLIO; nota 06 E-ESP-FICHA",
});
export const DFE_FICHA = regra({
  codigo: "DFE-FICHA",
  gravidade: "erro",
  ficha: "finalEspolio",
  descricao: "A Declaração Final de Espólio exige a ficha Espólio preenchida (e só ela a admite).",
  fonte: "Nota 06 E-ESP-FICHA (preenchimento obrigatório); Ajuda pág. 333",
});
export const DFE_PROCESSO = regra({
  codigo: "DFE-PROCESSO",
  gravidade: "erro",
  ficha: "finalEspolio",
  descricao:
    "Os dados da decisão judicial ou da escritura pública acompanham o tipo de inventário.",
  fonte: "Nota 06 E-ESP-FICHA; registro 38",
});
export const DFE_DATAS = regra({
  codigo: "DFE-DATAS",
  gravidade: "aviso",
  ficha: "finalEspolio",
  descricao:
    "Ano do óbito até o ano-calendário; decisão, trânsito em julgado ou lavratura compatíveis com a entrega no exercício.",
  fonte: "Nota 06 E-ESP-PRAZO e E-ESP-FICHA (datas, inferido das regras de prazo)",
});
export const DFE_CONJUGE = regra({
  codigo: "DFE-CONJUGE",
  gravidade: "erro",
  ficha: "finalEspolio",
  descricao:
    "No inventário conjunto por óbito de ambos os cônjuges, CPF e nome do outro cônjuge são obrigatórios.",
  fonte: "Nota 06 E-ESP-OBITO-CONJUGES; Ajuda pág. 330",
});
export const HER_NI = regra({
  codigo: "HER-NI",
  gravidade: "erro",
  ficha: "herdeiros",
  descricao: "CPF/CNPJ do herdeiro ou meeiro com DV correto, sem repetição.",
  fonte: "Nota 06 E-ESP-HERDEIROS; Ajuda pág. 334",
});
export const SAI_FICHA = regra({
  codigo: "SAI-FICHA",
  gravidade: "erro",
  ficha: "saidaDefinitiva",
  descricao:
    "A Declaração de Saída Definitiva exige a ficha própria com a data da condição de não residente no ano.",
  fonte: "Nota 01 T-SAIDA e G-AUSENTE-OUTROS; registro 39",
});
export const SAI_PROCURADOR = regra({
  codigo: "SAI-PROCURADOR",
  gravidade: "erro",
  ficha: "saidaDefinitiva",
  descricao: "CPF do procurador com DV correto; país de destino existente e diferente do Brasil.",
  fonte: "Registro 39; tabela paises.json",
});
export const PAGTO_QUOTA_UNICA = regra({
  codigo: "PAGTO-QUOTA-UNICA",
  gravidade: "erro",
  ficha: "resumo",
  descricao: "Saída Definitiva e Final de Espólio pagam em quota única, sem débito automático.",
  fonte: "Nota 01 T-SAIDA; nota 05 F-RESUMO-QUOTAS; nota 06 E-ESP-PRAZO; Ajuda págs. 18 e 337",
});
export const CONJ_CPF = regra({
  codigo: "CONJ-CPF",
  gravidade: "erro",
  ficha: "informacoesConjuge",
  descricao: "CPF nas Informações do Cônjuge com DV correto e igual ao informado na Identificação.",
  fonte: "Registro 29 (NR_CONJ); nota 02 F-IDENT-CONJ",
});

export const REGRAS_ESPECIAIS = [
  ESP_FICHA,
  ESP_INVENTARIANTE,
  DFE_FICHA,
  DFE_PROCESSO,
  DFE_DATAS,
  DFE_CONJUGE,
  HER_NI,
  SAI_FICHA,
  SAI_PROCURADOR,
  PAGTO_QUOTA_UNICA,
  CONJ_CPF,
];

export function validarEspeciais(ctx: Contexto): Pendencia[] {
  const d = ctx.declaracao;
  const out: Pendencia[] = [];
  const tipo = d.identificacao.tipoDeclaracao.tipo;
  const natureza81 = d.identificacao.ocupacao.natureza === "81";

  if (tipo === "ajusteAnual") {
    if (natureza81 && !d.espolio) {
      out.push(
        pendencia(
          ESP_FICHA,
          "espolio",
          "Natureza 81 (Espólio) exige a ficha Espólio com o inventariante.",
        ),
      );
    }
    if (!natureza81 && d.espolio) {
      out.push(
        pendencia(ESP_FICHA, "espolio", "Ficha Espólio preenchida sem natureza da ocupação 81."),
      );
    }
  }
  const inventariante = d.espolio?.inventariante ?? d.finalEspolio?.inventariante;
  if (inventariante) {
    const base = d.espolio ? "espolio.inventariante.cpf" : "finalEspolio.inventariante.cpf";
    if (!niValido(inventariante.cpf)) {
      out.push(pendencia(ESP_INVENTARIANTE, base, "CPF do inventariante inválido."));
    } else if (inventariante.cpf === d.identificacao.cpf) {
      out.push(
        pendencia(ESP_INVENTARIANTE, base, "O inventariante não pode ser o próprio falecido."),
      );
    }
  }

  if (tipo === "finalEspolio" && !d.finalEspolio) {
    out.push(
      pendencia(
        DFE_FICHA,
        "finalEspolio",
        "Preencha a ficha Espólio da Declaração Final de Espólio.",
      ),
    );
  }
  if (tipo !== "finalEspolio" && (d.finalEspolio || d.herdeiros.length > 0)) {
    out.push(
      pendencia(
        DFE_FICHA,
        "finalEspolio",
        "Ficha de Final de Espólio ou Herdeiros fora de uma Declaração Final de Espólio.",
      ),
    );
  }
  const fe = d.finalEspolio;
  if (fe) {
    if (fe.tipoInventario === "decisaoJudicial" && !fe.decisaoJudicial) {
      out.push(
        pendencia(
          DFE_PROCESSO,
          "finalEspolio.decisaoJudicial",
          "Informe os dados da decisão judicial.",
        ),
      );
    }
    if (fe.tipoInventario === "escrituraPublica") {
      if (!fe.escrituraPublica) {
        out.push(
          pendencia(
            DFE_PROCESSO,
            "finalEspolio.escrituraPublica",
            "Informe os dados da escritura pública.",
          ),
        );
      } else if (!niValido(fe.escrituraPublica.cnpjCartorio)) {
        out.push(
          pendencia(
            DFE_PROCESSO,
            "finalEspolio.escrituraPublica.cnpjCartorio",
            "CNPJ do cartório inválido.",
          ),
        );
      }
    }
    if (fe.anoObito > 2025) {
      out.push(
        pendencia(
          DFE_DATAS,
          "finalEspolio.anoObito",
          "Ano do óbito posterior ao ano-calendário 2025.",
        ),
      );
    }
    const decisao = fe.decisaoJudicial;
    if (decisao?.dataTransitoJulgado && decisao.dataTransitoJulgado > "2026-02-28") {
      out.push(
        pendencia(
          DFE_DATAS,
          "finalEspolio.decisaoJudicial.dataTransitoJulgado",
          "Trânsito em julgado após fevereiro de 2026: a DFE é de exercício posterior.",
        ),
      );
    }
    const lavratura = fe.escrituraPublica?.dataLavratura;
    if (lavratura && (lavratura < INICIO_ANO_CALENDARIO || lavratura > FIM_ANO_CALENDARIO)) {
      out.push(
        pendencia(
          DFE_DATAS,
          "finalEspolio.escrituraPublica.dataLavratura",
          "Escritura lavrada fora de 2025: confira o exercício da DFE.",
        ),
      );
    }
    if (fe.conjuge?.obitoAmbos && fe.conjuge.inventarioConjunto) {
      const { cpfOutroConjuge, nomeOutroConjuge } = fe.conjuge;
      if (!cpfOutroConjuge || !niValido(cpfOutroConjuge) || !nomeOutroConjuge) {
        out.push(
          pendencia(
            DFE_CONJUGE,
            "finalEspolio.conjuge",
            "Informe CPF válido e nome do outro cônjuge.",
          ),
        );
      }
    }
  }
  const herdeirosVistos = new Set<string>();
  d.herdeiros.forEach((h, i) => {
    if (!niValido(h.ni) || herdeirosVistos.has(h.ni)) {
      out.push(
        pendencia(
          HER_NI,
          `herdeiros[${i}].ni`,
          `CPF/CNPJ do herdeiro ${h.nome} inválido ou repetido.`,
        ),
      );
    }
    herdeirosVistos.add(h.ni);
  });

  const sd = d.saidaDefinitiva;
  if (tipo === "saidaDefinitiva") {
    if (!sd) {
      out.push(
        pendencia(SAI_FICHA, "saidaDefinitiva", "Preencha a ficha Saída Definitiva do País."),
      );
    } else if (
      sd.dataCondicaoNaoResidente < INICIO_ANO_CALENDARIO ||
      sd.dataCondicaoNaoResidente > FIM_ANO_CALENDARIO
    ) {
      out.push(
        pendencia(
          SAI_FICHA,
          "saidaDefinitiva.dataCondicaoNaoResidente",
          "A condição de não residente deve ter se caracterizado em 2025.",
        ),
      );
    }
  } else if (sd) {
    out.push(
      pendencia(
        SAI_FICHA,
        "saidaDefinitiva",
        "Ficha Saída Definitiva preenchida em outro tipo de declaração.",
      ),
    );
  }
  if (sd) {
    if (sd.procurador && !niValido(sd.procurador.cpf)) {
      out.push(
        pendencia(SAI_PROCURADOR, "saidaDefinitiva.procurador.cpf", "CPF do procurador inválido."),
      );
    }
    if (!buscarCodigo("paises", sd.paisDestino) || sd.paisDestino === "105") {
      out.push(
        pendencia(
          SAI_PROCURADOR,
          "saidaDefinitiva.paisDestino",
          `País de destino ${sd.paisDestino} inválido.`,
        ),
      );
    }
  }

  if (tipo !== "ajusteAnual") {
    if (d.resumo.quotas > 1) {
      out.push(
        pendencia(
          PAGTO_QUOTA_UNICA,
          "resumo.quotas",
          "Este tipo de declaração é pago em quota única.",
        ),
      );
    }
    if (d.resumo.debitoAutomatico) {
      out.push(
        pendencia(
          PAGTO_QUOTA_UNICA,
          "resumo.debitoAutomatico",
          "Este tipo de declaração não admite débito automático.",
        ),
      );
    }
  }

  const ic = d.informacoesConjuge;
  if (
    ic &&
    (!niValido(ic.cpf) || (d.identificacao.conjuge.cpf && ic.cpf !== d.identificacao.conjuge.cpf))
  ) {
    out.push(
      pendencia(
        CONJ_CPF,
        "informacoesConjuge.cpf",
        "CPF do cônjuge inválido ou diferente do informado na Identificação.",
      ),
    );
  }
  return out;
}
