/** Regras das fichas Dependentes e Alimentandos (notas 01 e 02 F-DEP, F-ALIM, G-DIVORCIADO). */
import { buscarCodigo } from "../../tabelas/index.js";
import { type Pendencia, pendencia, regra } from "../pendencia.js";
import { type Contexto, emailValido, FIM_ANO_CALENDARIO, idadeEm, niValido } from "../util.js";

export const DEP_CODIGO = regra({
  codigo: "DEP-CODIGO",
  gravidade: "erro",
  ficha: "dependentes",
  descricao: "Código de relação de dependência existente na tabela.",
  fonte: "Tabela dependentes.json (Lei 9.250/1995, art. 35)",
});
export const DEP_CPF = regra({
  codigo: "DEP-CPF",
  gravidade: "erro",
  ficha: "dependentes",
  descricao: "CPF obrigatório e válido para todo dependente, diferente do CPF do titular.",
  fonte: "Nota 02 F-DEP; Ajuda pág. 47",
});
export const DEP_DUPLICADO = regra({
  codigo: "DEP-DUPLICADO",
  gravidade: "erro",
  ficha: "dependentes",
  descricao: "O mesmo CPF não pode aparecer em mais de um dependente.",
  fonte: "Nota 02 F-DEP (duplicidade, inferido)",
});
export const DEP_ALIMENTANDO = regra({
  codigo: "DEP-ALIMENTANDO",
  gravidade: "erro",
  ficha: "dependentes",
  descricao: "A mesma pessoa não pode ser dependente e alimentando na mesma declaração.",
  fonte: "Nota 01 G-DIVORCIADO (inferido); Lei 9.250/1995, art. 8º, II, f, e art. 35",
});
export const DEP_NASCIMENTO = regra({
  codigo: "DEP-NASCIMENTO",
  gravidade: "erro",
  ficha: "dependentes",
  descricao: "Data de nascimento do dependente não pode ser posterior a 31/12 do ano-calendário.",
  fonte: "Nota 02 F-DEP (data dd/mm/aaaa)",
});
export const DEP_IDADE = regra({
  codigo: "DEP-IDADE",
  gravidade: "aviso",
  ficha: "dependentes",
  descricao:
    "Idade compatível com o código de dependência (21 ou 24 anos nos códigos 21, 22, 24, 25 e 41).",
  fonte: "Tabela dependentes.json; Lei 9.250/1995, art. 35",
});
export const DEP_CONJUGE = regra({
  codigo: "DEP-CONJUGE",
  gravidade: "aviso",
  ficha: "dependentes",
  descricao:
    "Dependente código 11 (cônjuge ou companheiro) deve ser o cônjuge informado na Identificação.",
  fonte: "Nota 02 F-IDENT-CONJ e F-DEP (inferido)",
});
export const DEP_CONTATO = regra({
  codigo: "DEP-CONTATO",
  gravidade: "erro",
  ficha: "dependentes",
  descricao: "E-mail do dependente em formato válido.",
  fonte: "Nota 02 F-DEP",
});
export const DEP_SAIDA = regra({
  codigo: "DEP-SAIDA",
  gravidade: "aviso",
  ficha: "dependentes",
  descricao: '"Saiu do país na mesma data que o declarante" só se aplica à Saída Definitiva.',
  fonte: "Nota 02 F-DEP",
});
export const ALIM_CPF = regra({
  codigo: "ALIM-CPF",
  gravidade: "erro",
  ficha: "alimentandos",
  descricao: "CPF obrigatório e válido para o alimentando, diferente do titular.",
  fonte: "Nota 02 F-ALIM; Ajuda pág. 50",
});
export const ALIM_DUPLICADO = regra({
  codigo: "ALIM-DUPLICADO",
  gravidade: "erro",
  ficha: "alimentandos",
  descricao: "O mesmo CPF não pode aparecer em mais de um alimentando.",
  fonte: "Nota 02 F-ALIM (inferido)",
});
export const ALIM_PROCESSO = regra({
  codigo: "ALIM-PROCESSO",
  gravidade: "erro",
  ficha: "alimentandos",
  descricao:
    "Os dados da decisão judicial e/ou da escritura pública acompanham o tipo de processo.",
  fonte: "Nota 02 F-ALIM; registro 35 IN_TIPO_PROCESSO",
});
export const ALIM_VINCULO = regra({
  codigo: "ALIM-VINCULO",
  gravidade: "erro",
  ficha: "alimentandos",
  descricao: "Alimentando vinculado a dependente exige que o dependente esteja cadastrado.",
  fonte: "Nota 02 F-ALIM (Vinculado a: Titular ou Dependente)",
});

export const REGRAS_PESSOAS = [
  DEP_CODIGO,
  DEP_CPF,
  DEP_DUPLICADO,
  DEP_ALIMENTANDO,
  DEP_NASCIMENTO,
  DEP_IDADE,
  DEP_CONJUGE,
  DEP_CONTATO,
  DEP_SAIDA,
  ALIM_CPF,
  ALIM_DUPLICADO,
  ALIM_PROCESSO,
  ALIM_VINCULO,
];

/** Idade máxima em 31/12 por código de dependência (códigos com limite de idade). */
const IDADE_MAXIMA: Readonly<Record<string, number>> = {
  "21": 21,
  "22": 24,
  "24": 21,
  "25": 24,
  "41": 21,
};

export function validarPessoas(ctx: Contexto): Pendencia[] {
  const { declaracao: d } = ctx;
  const out: Pendencia[] = [];
  const cpfTitular = d.identificacao.cpf;
  const vistos = new Set<string>();

  d.dependentes.forEach((dep, i) => {
    const c = (campo: string) => `dependentes[${i}].${campo}`;
    if (!buscarCodigo("dependentes", dep.codigo)) {
      out.push(
        pendencia(DEP_CODIGO, c("codigo"), `Código de dependência ${dep.codigo} inexistente.`),
      );
    }
    if (!niValido(dep.cpf)) {
      out.push(pendencia(DEP_CPF, c("cpf"), `CPF do dependente ${dep.nome} inválido.`));
    } else if (dep.cpf === cpfTitular) {
      out.push(pendencia(DEP_CPF, c("cpf"), "O titular não pode ser seu próprio dependente."));
    }
    if (vistos.has(dep.cpf)) {
      out.push(
        pendencia(DEP_DUPLICADO, c("cpf"), `Dependente ${dep.nome} informado mais de uma vez.`),
      );
    }
    vistos.add(dep.cpf);
    if (ctx.cpfsAlimentandos.has(dep.cpf)) {
      out.push(
        pendencia(
          DEP_ALIMENTANDO,
          c("cpf"),
          `${dep.nome} consta como dependente e como alimentando.`,
        ),
      );
    }
    if (dep.dataNascimento > FIM_ANO_CALENDARIO) {
      out.push(
        pendencia(DEP_NASCIMENTO, c("dataNascimento"), "Nascimento posterior a 31/12/2025."),
      );
    } else {
      const limite = IDADE_MAXIMA[dep.codigo];
      const idade = idadeEm(dep.dataNascimento, FIM_ANO_CALENDARIO);
      if (limite !== undefined && idade > limite) {
        out.push(
          pendencia(
            DEP_IDADE,
            c("codigo"),
            `${dep.nome} tinha ${idade} anos em 31/12/2025, acima do limite de ${limite} do código ${dep.codigo}.`,
          ),
        );
      }
    }
    if (
      dep.codigo === "11" &&
      d.identificacao.conjuge.cpf &&
      dep.cpf !== d.identificacao.conjuge.cpf
    ) {
      out.push(
        pendencia(
          DEP_CONJUGE,
          c("cpf"),
          "O CPF do dependente cônjuge difere do CPF do cônjuge na Identificação.",
        ),
      );
    }
    if (dep.email && !emailValido(dep.email)) {
      out.push(pendencia(DEP_CONTATO, c("email"), "E-mail do dependente em formato inválido."));
    }
    if (dep.saiuDoPaisComDeclarante && d.identificacao.tipoDeclaracao.tipo !== "saidaDefinitiva") {
      out.push(
        pendencia(
          DEP_SAIDA,
          c("saiuDoPaisComDeclarante"),
          "Campo próprio da Declaração de Saída Definitiva.",
        ),
      );
    }
  });

  const alimVistos = new Set<string>();
  d.alimentandos.forEach((a, i) => {
    const c = (campo: string) => `alimentandos[${i}].${campo}`;
    if (!niValido(a.cpf)) {
      out.push(pendencia(ALIM_CPF, c("cpf"), `CPF do alimentando ${a.nome} inválido.`));
    } else if (a.cpf === cpfTitular) {
      out.push(pendencia(ALIM_CPF, c("cpf"), "O titular não pode ser seu próprio alimentando."));
    }
    if (alimVistos.has(a.cpf)) {
      out.push(
        pendencia(ALIM_DUPLICADO, c("cpf"), `Alimentando ${a.nome} informado mais de uma vez.`),
      );
    }
    alimVistos.add(a.cpf);
    const precisaJudicial = a.tipoProcesso !== "escrituraPublica";
    const precisaEscritura = a.tipoProcesso !== "decisaoJudicial";
    if (precisaJudicial && !a.decisaoJudicial) {
      out.push(
        pendencia(ALIM_PROCESSO, c("decisaoJudicial"), "Informe os dados da decisão judicial."),
      );
    }
    if (precisaEscritura && !a.escrituraPublica) {
      out.push(
        pendencia(ALIM_PROCESSO, c("escrituraPublica"), "Informe os dados da escritura pública."),
      );
    }
    if (a.escrituraPublica && !niValido(a.escrituraPublica.cnpjCartorio)) {
      out.push(
        pendencia(ALIM_PROCESSO, c("escrituraPublica.cnpjCartorio"), "CNPJ do cartório inválido."),
      );
    }
    if (a.vinculo.tipo === "dependente" && !ctx.cpfsDependentes.has(a.vinculo.cpf)) {
      out.push(
        pendencia(ALIM_VINCULO, c("vinculo.cpf"), "Dependente vinculado não está cadastrado."),
      );
    }
  });
  return out;
}
