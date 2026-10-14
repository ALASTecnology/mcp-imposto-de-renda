/**
 * Tipos de entrada e saída do motor do exercício 2026.
 *
 * A entrada segue exatamente o formato dos casos de referência (golden):
 * valores monetários são textos com inteiro de centavos ("123456" =
 * R$ 1.234,56) e campos opcionais ausentes valem zero ou vazio. Não renomeie
 * campos: os casos gerados com o programa oficial usam estes nomes.
 */
import type { Centavos } from "../../centavos.js";

/** "T" titular, "D" dependente, "A" alimentando (só em pagamentos). */
export type BeneficiarioCalculo = "T" | "D" | "A";

export interface PessoaEntrada {
  cpf: string;
  nome: string;
  /** DDMMAAAA */
  nascimento?: string;
}

export interface DependenteEntrada extends PessoaEntrada {
  /** Código da relação de dependência (docs/mapeamento/tabelas/dependentes.json). */
  codigo?: string;
}

export interface RendimentoPJEntrada {
  cnpj?: string;
  nome?: string;
  rendimento?: string;
  previdenciaOficial?: string;
  irrf?: string;
  decimoTerceiro?: string;
  irrfDecimoTerceiro?: string;
  beneficiario?: "T" | "D";
  cpfDependente?: string;
}

export interface MesRendimentoPFEntrada {
  mes: number;
  /** Trabalho não assalariado, aluguéis e outros recebidos de pessoa física. */
  pessoaFisica?: string;
  exterior?: string;
  previdenciaOficial?: string;
  /** Quantidade de dependentes no mês (informativo, não deduz no ajuste). */
  dependentes?: string;
  /** Pensão alimentícia no mês (informativo; a dedução vem de Pagamentos). */
  pensao?: string;
  livroCaixa?: string;
  /** Carnê-leão pago (Darf 0190). */
  carneLeao?: string;
}

export interface PagamentoEntrada {
  codigo: string;
  cpfCnpj?: string;
  valor?: string;
  parcelaNaoDedutivel?: string;
  beneficiario?: BeneficiarioCalculo;
  cpfDependente?: string;
}

export interface CodigoValorEntrada {
  codigo: string;
  valor?: string;
}

/**
 * Doação da ficha Doações Efetuadas (códigos 40 a 47). Extensão opcional do
 * formato dos casos de referência, que hoje só trazem as doações diretas.
 */
export interface DoacaoEfetuadaEntrada {
  codigo: string;
  valor?: string;
  parcelaNaoDedutivel?: string;
}

/** Mês da atividade rural no Brasil: receita bruta e despesas de custeio e investimento. */
export interface MesAtividadeRuralEntrada {
  mes: number;
  receita?: string;
  despesa?: string;
}

/**
 * Atividade rural no Brasil. `opcao`: forma de apuração do resultado tributável (resultado da
 * atividade ou 20% da receita bruta); sem ela, o programa não tributa o resultado.
 */
export interface AtividadeRuralEntrada {
  opcao?: "resultado" | "limite20";
  meses?: MesAtividadeRuralEntrada[];
}

export interface EntradaCalculo2026 {
  titular: PessoaEntrada;
  dependentes?: DependenteEntrada[];
  rendimentosPJ?: RendimentoPJEntrada[];
  rendimentosPF?: { meses?: MesRendimentoPFEntrada[] };
  pagamentos?: PagamentoEntrada[];
  rendimentosIsentos?: CodigoValorEntrada[];
  tributacaoExclusiva?: CodigoValorEntrada[];
  impostoPago?: { complementar?: string; exterior?: string; irrfLei11033?: string };
  doacoesDiretas?: { eca?: string; idoso?: string };
  doacoesEfetuadas?: DoacaoEfetuadaEntrada[];
  atividadeRural?: AtividadeRuralEntrada;
}

export type Modelo = "completo" | "simplificado";

/** Uma linha da memória de cálculo, para a ferramenta `explicar_calculo`. */
export interface LinhaMemoria {
  /** Identificador estável da linha (ex.: "deducao.instrucao"). */
  codigo: string;
  /** O que a linha representa, em pt-BR, com a conta feita. */
  descricao: string;
  /** Valor em centavos (texto), ou percentual em centésimos quando indicado. */
  valor: string;
  /** Regra legal ou do programa aplicada. */
  regra: string;
}

export interface ImpostoPagoCalculo {
  irrf: Centavos;
  carneLeao: Centavos;
  complementar: Centavos;
  /** Imposto pago no exterior já limitado ao imposto brasileiro correspondente. */
  exterior: Centavos;
  exteriorInformado: Centavos;
  irrfLei11033: Centavos;
  total: Centavos;
}

export interface DeducoesCompleto {
  previdenciaOficial: Centavos;
  previdenciaComplementar: Centavos;
  dependentes: Centavos;
  instrucao: Centavos;
  medicas: Centavos;
  pensaoAlimenticia: Centavos;
  livroCaixa: Centavos;
}

interface ResultadoModeloBase {
  rendimentosTributaveis: Centavos;
  baseCalculo: Centavos;
  /** Imposto pela tabela progressiva, antes das deduções de incentivo. */
  impostoTabela: Centavos;
  deducaoIncentivo: Centavos;
  /** Imposto devido final do modelo. */
  impostoDevido: Centavos;
  impostoPago: ImpostoPagoCalculo;
  saldoPagar: Centavos;
  restituir: Centavos;
  /** Alíquota efetiva em centésimos de ponto percentual (617 = 6,17%). */
  aliquotaEfetiva: bigint;
  memoria: LinhaMemoria[];
}

export interface ResultadoCompleto extends ResultadoModeloBase {
  modelo: "completo";
  deducoes: DeducoesCompleto;
  totalDeducoes: Centavos;
}

export interface ResultadoSimplificado extends ResultadoModeloBase {
  modelo: "simplificado";
  desconto: Centavos;
}

export interface ComparacaoModelos {
  completo: ResultadoCompleto;
  simplificado: ResultadoSimplificado;
  modeloMaisVantajoso: Modelo;
  memoria: LinhaMemoria[];
}

/**
 * Resultado consolidado. Os campos monetários são textos com inteiro de
 * centavos, iguais aos do bloco "esperado" dos casos de referência.
 */
export interface ResultadoCalculo2026 {
  rendimentosTributaveis: string;
  deducoesCompleto: string;
  baseCalculoCompleto: string;
  impostoDevidoCompleto: string;
  descontoSimplificado: string;
  baseCalculoSimplificado: string;
  impostoDevidoSimplificado: string;
  impostoRetidoTotal: string;
  saldoPagarCompleto: string;
  restituirCompleto: string;
  saldoPagarSimplificado: string;
  restituirSimplificado: string;
  modeloMaisVantajoso: Modelo;
  /** Alíquota efetiva do modelo mais vantajoso, em centésimos de ponto percentual ("617" = 6,17%). */
  aliquotaEfetiva: string;
  detalhamento: {
    completo: LinhaMemoria[];
    simplificado: LinhaMemoria[];
    comparacao: LinhaMemoria[];
  };
  avisos: string[];
}
