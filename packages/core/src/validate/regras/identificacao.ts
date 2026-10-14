/** Regras da ficha Identificação do Contribuinte (nota 02 F-IDENT-*; Ajuda págs. 41 a 46). */
import { buscarCodigo } from "../../tabelas/index.js";
import { type Pendencia, pendencia, regra } from "../pendencia.js";
import {
  type Contexto,
  emailValido,
  FIM_ANO_CALENDARIO,
  INICIO_ANO_CALENDARIO,
  niValido,
  problemaNome,
} from "../util.js";

const F = "identificacao" as const;

export const IDENT_CPF = regra({
  codigo: "IDENT-CPF",
  gravidade: "erro",
  ficha: F,
  descricao: "CPF do titular com dígitos verificadores corretos.",
  fonte: "Nota 02 F-IDENT; registro IR NR_CPF",
});
export const IDENT_NOME = regra({
  codigo: "IDENT-NOME",
  gravidade: "erro",
  ficha: F,
  descricao:
    "Nome com 1 a 15 partes, até 20 caracteres por parte, sem 3 caracteres iguais seguidos.",
  fonte: "Nota 02 F-IDENT-NOME; Ajuda pág. 43",
});
export const IDENT_NASCIMENTO = regra({
  codigo: "IDENT-NASCIMENTO",
  gravidade: "erro",
  ficha: F,
  descricao: "Data de nascimento não pode ser posterior ao fim do ano-calendário.",
  fonte: "Nota 02 F-IDENT-NASC (data válida, inferido)",
});
export const IDENT_RECIBO_RETIFICADORA = regra({
  codigo: "IDENT-RECIBO-RETIFICADORA",
  gravidade: "erro",
  ficha: F,
  descricao: "Retificadora exige o recibo da declaração imediatamente anterior do exercício.",
  fonte: "Nota 01 G-RETIF; nota 02 F-IDENT-TIPO; Ajuda págs. 32 e 42",
});
export const IDENT_RECIBO_ANTERIOR = regra({
  codigo: "IDENT-RECIBO-ANTERIOR",
  gravidade: "aviso",
  ficha: F,
  descricao:
    "Saída Definitiva e Final de Espólio originais devem informar o recibo do exercício anterior.",
  fonte: "Nota 02 F-IDENT-TIPO (texto indica obrigação sem dizer opcional)",
});
export const IDENT_CONJUGE = regra({
  codigo: "IDENT-CONJUGE",
  gravidade: "erro",
  ficha: F,
  descricao:
    "Com cônjuge ou companheiro(a), o CPF dele é obrigatório, válido e diferente do titular.",
  fonte: "Nota 02 F-IDENT-CONJ; Ajuda pág. 44",
});
export const IDENT_RETORNO = regra({
  codigo: "IDENT-RETORNO",
  gravidade: "erro",
  ficha: F,
  descricao:
    "Quem passou a ser residente no ano informa a data de retorno, dentro do ano-calendário.",
  fonte: "Nota 02 F-IDENT-RETORNO; Ajuda pág. 44",
});
export const IDENT_NATUREZA = regra({
  codigo: "IDENT-NATUREZA",
  gravidade: "erro",
  ficha: F,
  descricao: "Natureza da ocupação existente na tabela.",
  fonte: "Tabela naturezas-ocupacao.json; nota 02 F-IDENT-OCUP",
});
export const IDENT_OCUPACAO = regra({
  codigo: "IDENT-OCUPACAO",
  gravidade: "erro",
  ficha: F,
  descricao:
    "Ocupação principal existente e obrigatória, exceto para as naturezas 13, 14, 61, 62, 71, 72 e 81; em branco para 81 (Espólio).",
  fonte: "Nota 02 F-IDENT-OCUP; nota 01 G-ESPOLIO; Ajuda pág. 46",
});
export const IDENT_REGISTRO_PROFISSIONAL = regra({
  codigo: "IDENT-REGISTRO-PROFISSIONAL",
  gravidade: "aviso",
  ficha: F,
  descricao:
    "Ocupações 225, 226, 230, 231, 232, 241, 255 e 355 informam o número do registro profissional.",
  fonte: "Nota 02 F-IDENT-OCUP e F-RTPF-IMPCL (inferido); registro 16 NR_REGISTRO_PROFISSIONAL",
});
export const IDENT_NIT = regra({
  codigo: "IDENT-NIT",
  gravidade: "erro",
  ficha: F,
  descricao: "Natureza 11 (autônomo) exige NIT/PIS/PASEP.",
  fonte: "Nota 02 F-RTPF-NIT; Ajuda pág. 59",
});
export const IDENT_RACA_COR = regra({
  codigo: "IDENT-RACA-COR",
  gravidade: "aviso",
  ficha: F,
  descricao: "Raça/cor deve ser autodeclarada (código 0 significa não informada).",
  fonte: "Nota 02 F-IDENT-RACA; tabela raca-cor.json",
});
export const IDENT_ENDERECO = regra({
  codigo: "IDENT-ENDERECO",
  gravidade: "erro",
  ficha: F,
  descricao:
    "Endereço com tipo de logradouro, UF, município da UF, país e representação diplomática existentes nas tabelas.",
  fonte:
    "Nota 02 F-IDENT-END-BR e F-IDENT-END-EXT; tabelas ufs, municipios, paises, tipos-logradouro e representacoes-diplomaticas",
});
export const IDENT_CONTATO = regra({
  codigo: "IDENT-CONTATO",
  gravidade: "erro",
  ficha: F,
  descricao: "E-mail em formato válido; CPF do procurador com DV correto.",
  fonte: "Nota 02 F-IDENT-END-BR e F-IDENT-END-EXT",
});
export const IDENT_TIPO_ESPOLIO = regra({
  codigo: "IDENT-TIPO-ESPOLIO",
  gravidade: "erro",
  ficha: F,
  descricao: "Declaração Final de Espólio tem natureza da ocupação 81.",
  fonte: "Nota 06 E-ESP-IDENT; Ajuda pág. 333",
});

/** Naturezas que dispensam o código da ocupação principal (Ajuda pág. 46). */
const NATUREZAS_SEM_OCUPACAO = new Set(["13", "14", "61", "62", "71", "72", "81"]);
/** Ocupações com número de registro profissional (Ajuda pág. 57). */
export const OCUPACOES_COM_REGISTRO = new Set([
  "225",
  "226",
  "230",
  "231",
  "232",
  "241",
  "255",
  "355",
]);

export const REGRAS_IDENTIFICACAO = [
  IDENT_CPF,
  IDENT_NOME,
  IDENT_NASCIMENTO,
  IDENT_RECIBO_RETIFICADORA,
  IDENT_RECIBO_ANTERIOR,
  IDENT_CONJUGE,
  IDENT_RETORNO,
  IDENT_NATUREZA,
  IDENT_OCUPACAO,
  IDENT_REGISTRO_PROFISSIONAL,
  IDENT_NIT,
  IDENT_RACA_COR,
  IDENT_ENDERECO,
  IDENT_CONTATO,
  IDENT_TIPO_ESPOLIO,
];

export function validarIdentificacao(ctx: Contexto): Pendencia[] {
  const ident = ctx.declaracao.identificacao;
  const out: Pendencia[] = [];
  const c = (campo: string) => `identificacao.${campo}`;

  if (!niValido(ident.cpf)) out.push(pendencia(IDENT_CPF, c("cpf"), "CPF do titular inválido."));
  const nome = problemaNome(ident.nome);
  if (nome) out.push(pendencia(IDENT_NOME, c("nome"), nome));
  if (ident.dataNascimento > FIM_ANO_CALENDARIO) {
    out.push(
      pendencia(
        IDENT_NASCIMENTO,
        c("dataNascimento"),
        "Data de nascimento posterior a 31/12/2025.",
      ),
    );
  }

  const tipo = ident.tipoDeclaracao;
  if (tipo.retificadora && !tipo.reciboRetificada) {
    out.push(
      pendencia(
        IDENT_RECIBO_RETIFICADORA,
        c("tipoDeclaracao.reciboRetificada"),
        "Informe o número do recibo da declaração a retificar (12 dígitos).",
      ),
    );
  }
  if (!tipo.retificadora && tipo.tipo !== "ajusteAnual" && !tipo.reciboExercicioAnterior) {
    out.push(
      pendencia(
        IDENT_RECIBO_ANTERIOR,
        c("tipoDeclaracao.reciboExercicioAnterior"),
        "Informe o recibo da última declaração entregue do exercício de 2025.",
      ),
    );
  }

  if (ident.conjuge.possui) {
    const cpf = ident.conjuge.cpf;
    if (!cpf) {
      out.push(
        pendencia(IDENT_CONJUGE, c("conjuge.cpf"), "Informe o CPF do cônjuge ou companheiro(a)."),
      );
    } else if (!niValido(cpf)) {
      out.push(pendencia(IDENT_CONJUGE, c("conjuge.cpf"), "CPF do cônjuge inválido."));
    } else if (cpf === ident.cpf) {
      out.push(pendencia(IDENT_CONJUGE, c("conjuge.cpf"), "CPF do cônjuge igual ao do titular."));
    }
  }

  if (ident.retornoAoPais.retornou) {
    const data = ident.retornoAoPais.data;
    if (!data || data < INICIO_ANO_CALENDARIO || data > FIM_ANO_CALENDARIO) {
      out.push(
        pendencia(
          IDENT_RETORNO,
          c("retornoAoPais.data"),
          "Informe a data de retorno ao Brasil em 2025.",
        ),
      );
    }
  }

  const { natureza, ocupacaoPrincipal, registroProfissional } = ident.ocupacao;
  if (!buscarCodigo("naturezas-ocupacao", natureza)) {
    out.push(
      pendencia(IDENT_NATUREZA, c("ocupacao.natureza"), `Natureza ${natureza} inexistente.`),
    );
  }
  if (natureza === "81" && ocupacaoPrincipal) {
    out.push(
      pendencia(
        IDENT_OCUPACAO,
        c("ocupacao.ocupacaoPrincipal"),
        "Com natureza 81 (Espólio) a ocupação principal fica em branco.",
      ),
    );
  } else if (ocupacaoPrincipal && !buscarCodigo("ocupacoes-principais", ocupacaoPrincipal)) {
    out.push(
      pendencia(
        IDENT_OCUPACAO,
        c("ocupacao.ocupacaoPrincipal"),
        `Ocupação ${ocupacaoPrincipal} inexistente.`,
      ),
    );
  } else if (!ocupacaoPrincipal && !NATUREZAS_SEM_OCUPACAO.has(natureza)) {
    out.push(
      pendencia(IDENT_OCUPACAO, c("ocupacao.ocupacaoPrincipal"), "Informe a ocupação principal."),
    );
  }
  if (ocupacaoPrincipal && OCUPACOES_COM_REGISTRO.has(ocupacaoPrincipal) && !registroProfissional) {
    out.push(
      pendencia(
        IDENT_REGISTRO_PROFISSIONAL,
        c("ocupacao.registroProfissional"),
        "Informe o número do registro profissional (conselho de classe).",
      ),
    );
  }
  if (natureza === "11" && !ident.nitPisPasep) {
    out.push(
      pendencia(
        IDENT_NIT,
        c("nitPisPasep"),
        "Profissional autônomo (natureza 11) deve informar o NIT/PIS/PASEP.",
      ),
    );
  }
  if (ident.racaCor === "0") {
    out.push(pendencia(IDENT_RACA_COR, c("racaCor"), "Raça/cor não informada."));
  }
  if (tipo.tipo === "finalEspolio" && natureza !== "81") {
    out.push(
      pendencia(
        IDENT_TIPO_ESPOLIO,
        c("ocupacao.natureza"),
        "Declaração Final de Espólio exige natureza 81 (Espólio).",
      ),
    );
  }

  const end = ident.endereco;
  if (end.local === "brasil") {
    if (!buscarCodigo("tipos-logradouro", end.tipoLogradouro)) {
      out.push(
        pendencia(
          IDENT_ENDERECO,
          c("endereco.tipoLogradouro"),
          `Tipo de logradouro ${end.tipoLogradouro} inexistente.`,
        ),
      );
    }
    if (!buscarCodigo("ufs", end.uf)) {
      out.push(pendencia(IDENT_ENDERECO, c("endereco.uf"), `UF ${end.uf} inexistente.`));
    } else {
      const mun = buscarCodigo("municipios", end.municipio);
      if (!mun || mun.uf !== end.uf) {
        out.push(
          pendencia(
            IDENT_ENDERECO,
            c("endereco.municipio"),
            `Município ${end.municipio} não pertence à UF ${end.uf}.`,
          ),
        );
      }
    }
    if (end.email && !emailValido(end.email)) {
      out.push(pendencia(IDENT_CONTATO, c("endereco.email"), "E-mail em formato inválido."));
    }
  } else {
    if (!buscarCodigo("paises", end.pais) || end.pais === "105") {
      out.push(
        pendencia(
          IDENT_ENDERECO,
          c("endereco.pais"),
          `País ${end.pais} inválido para endereço no exterior.`,
        ),
      );
    }
    if (end.codigoExterior && !buscarCodigo("representacoes-diplomaticas", end.codigoExterior)) {
      out.push(
        pendencia(
          IDENT_ENDERECO,
          c("endereco.codigoExterior"),
          `Representação ${end.codigoExterior} inexistente.`,
        ),
      );
    }
    if (end.cpfProcurador && !niValido(end.cpfProcurador)) {
      out.push(
        pendencia(IDENT_CONTATO, c("endereco.cpfProcurador"), "CPF do procurador inválido."),
      );
    }
    if (end.email && !emailValido(end.email)) {
      out.push(pendencia(IDENT_CONTATO, c("endereco.email"), "E-mail em formato inválido."));
    }
  }
  return out;
}
