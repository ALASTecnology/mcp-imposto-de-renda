/**
 * Chamadas de exemplo de todas as ferramentas, usadas na referência de docs/ferramentas/.
 *
 * Cada cenário roda numa pasta temporária nova, com as declarações de exemplo de `exemplos/`
 * copiadas para dentro, e as chamadas são executadas na ordem contra o servidor real. A referência
 * usa a primeira chamada de cada ferramenta. Todos os dados são fictícios; CPF, CNPJ e NIT saem do
 * gerador determinístico dos exemplos.
 */
import { cnpj, cpf } from "../../exemplos/documentos.js";

/** Declaração da família (exemplo 2): 3 dependentes, 1 fonte PJ, 8 pagamentos, 3 bens, 1 dívida. */
export const ARQ = "10234522275-IRPF-A-2026-2025-ORIGI.DBK";
/** Declaração da autônoma (exemplo 4), com carnê-leão e saldo a pagar. */
export const ARQ_PF = "10459818260-IRPF-A-2026-2025-ORIGI.DBK";
/** Declaração de 2025 da família, no leiaute de 2025 (sintética, de `tools/docs/dados/`). */
export const ARQ_2025 = "10234522275-IRPF-A-2025-2024-ORIGI.DEC";
/**
 * Arquivo que o GCAP 2025 exporta para o IRPF 2026, do titular da família (sintético, gerado com
 * o harness de `tools/referencia` e o GCAP 2025; de `tools/docs/dados/`).
 */
export const ARQ_GCAP = "10234522275-0101-3112-GCAP-2025.DEC";
/** Arquivos copiados para a pasta de cada cenário (caminhos relativos a `exemplos/`). */
export const BASE: Record<string, string> = {
  [ARQ]: `02-familia-dependentes/${ARQ}`,
  [ARQ_PF]: `04-autonomo-carne-leao/${ARQ_PF}`,
  [ARQ_2025]: `../tools/docs/dados/${ARQ_2025}`,
  [ARQ_GCAP]: `../tools/docs/dados/${ARQ_GCAP}`,
};

const TITULAR = "10234522275";
const FILHA = cpf(113);
const BANCO = cnpj(216);

export interface ChamadaExemplo {
  readonly ferramenta: string;
  readonly argumentos: Record<string, unknown>;
}

export type Cenario = readonly ChamadaExemplo[];

const titular = { tipo: "titular" };
const fonte = (semente: number, nome: string) => ({ ni: cnpj(semente), nome });

/** Inclui, lista, altera e remove um item de uma ficha em lista. */
function quad(
  sufixos: { um: string; lista: string },
  item: Record<string, unknown>,
  alteracoes: Record<string, unknown>,
  indice: number,
): Cenario {
  return [
    { ferramenta: `adicionar_${sufixos.um}`, argumentos: { arquivo: ARQ, item } },
    { ferramenta: `listar_${sufixos.lista}`, argumentos: { arquivo: ARQ } },
    { ferramenta: `editar_${sufixos.um}`, argumentos: { arquivo: ARQ, indice, alteracoes } },
    { ferramenta: `remover_${sufixos.um}`, argumentos: { arquivo: ARQ, indice } },
  ];
}

const ENTRADA_CALCULO = {
  titular: { cpf: cpf(901), nome: "MARIA FICTICIA EXEMPLO", nascimento: "1985-03-15" },
  dependentes: [
    { cpf: cpf(902), nome: "PEDRO FICTICIO EXEMPLO", nascimento: "2015-08-20", codigo: "21" },
  ],
  rendimentosPJ: [
    {
      cnpj: cnpj(901),
      nome: "EMPRESA FICTICIA LTDA",
      rendimento: "85.000,00",
      previdenciaOficial: "9.350,00",
      irrf: "7.420,00",
      decimoTerceiro: "7.000,00",
      irrfDecimoTerceiro: "480,00",
    },
  ],
  pagamentos: [
    { codigo: "10", cpfCnpj: cnpj(902), valor: "3.200,00" },
    {
      codigo: "01",
      cpfCnpj: cnpj(903),
      valor: "6.000,00",
      beneficiario: "D",
      cpfDependente: cpf(902),
    },
  ],
};

const INFORME_TEXTO = [
  "COMPROVANTE DE RENDIMENTOS PAGOS E DE IMPOSTO SOBRE A RENDA RETIDO NA FONTE",
  "1. Fonte pagadora",
  `CNPJ: ${cnpj(910).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")}   Nome empresarial: EMPRESA FICTICIA DE SERVICOS S.A.`,
  "3. Rendimentos tributáveis",
  "01. Total dos rendimentos (inclusive férias) 24.000,00",
  "02. Contribuição previdenciária oficial 2.640,00",
  "05. Imposto sobre a renda retido na fonte 1.150,00",
  "5. Rendimentos sujeitos à tributação exclusiva",
  "01. Décimo terceiro salário 2.000,00",
  "02. Imposto sobre a renda retido na fonte sobre 13º salário 45,00",
].join("\n");

export const CENARIOS: readonly Cenario[] = [
  // calculo
  [
    { ferramenta: "simular_imposto", argumentos: ENTRADA_CALCULO },
    { ferramenta: "comparar_modelos", argumentos: ENTRADA_CALCULO },
    { ferramenta: "explicar_calculo", argumentos: { ...ENTRADA_CALCULO, modelo: "simplificado" } },
    { ferramenta: "calcular_quotas", argumentos: { saldo: "3.000,00", quotas: 3 } },
    {
      ferramenta: "calcular_multa_atraso",
      argumentos: { imposto_devido: "2.500,00", data_entrega: "2026-07-15" },
    },
    { ferramenta: "consultar_parametros", argumentos: {} },
  ],
  // declaracao, fichas, arquivos, validacao, tabelas
  [
    { ferramenta: "listar_arquivos", argumentos: {} },
    { ferramenta: "listar_declaracoes", argumentos: { ordenar_por: "nome" } },
    {
      ferramenta: "importar_declaracao_anterior",
      argumentos: { arquivo: ARQ_2025, arquivo_destino: "importada-de-2025.DBK" },
    },
    {
      ferramenta: "importar_pre_preenchida",
      argumentos: { arquivo: ARQ, arquivo_destino: "pre-preenchida.DBK" },
    },
    {
      ferramenta: "gravar_relatorio",
      argumentos: { arquivo: ARQ, partes: ["bens"], formato: "pdf", arquivo_destino: "bens.pdf" },
    },
    { ferramenta: "abrir_declaracao", argumentos: { arquivo: ARQ } },
    { ferramenta: "listar_fichas", argumentos: { arquivo: ARQ } },
    { ferramenta: "ler_ficha", argumentos: { arquivo: ARQ, ficha: "dependentes" } },
    { ferramenta: "converter_dbk_para_modelo", argumentos: { arquivo: ARQ } },
    { ferramenta: "verificar_integridade_arquivo", argumentos: { arquivo: ARQ } },
    { ferramenta: "validar_declaracao", argumentos: { arquivo: ARQ } },
    { ferramenta: "validar_documento", argumentos: { documento: "102.345.222-75" } },
    { ferramenta: "buscar_nome_por_documento", argumentos: { documento: FILHA } },
    { ferramenta: "listar_tabela", argumentos: { tabela: "dependentes", limite: 4 } },
    { ferramenta: "buscar_codigo", argumentos: { tabela: "bens-direitos", codigo: "01-11" } },
    { ferramenta: "gerar_arquivo_entrega", argumentos: { arquivo: ARQ } },
    {
      ferramenta: "importar_gcap",
      argumentos: { arquivo: ARQ, arquivo_gcap: ARQ_GCAP, arquivo_destino: "com-gcap.DBK" },
    },
  ],
  [
    {
      ferramenta: "converter_modelo_para_dbk",
      argumentos: {
        arquivo_destino: "rascunho.DBK",
        declaracao: {
          identificacao: {
            cpf: cpf(903),
            nome: "LUCAS FICTICIO EXEMPLO",
            dataNascimento: "1992-11-03",
            tipoDeclaracao: { tipo: "ajusteAnual" },
            racaCor: "2",
            conjuge: { possui: false },
            endereco: {
              local: "brasil",
              tipoLogradouro: "RUA",
              logradouro: "DAS FLORES FICTICIAS",
              numero: "7",
              bairro: "CENTRO",
              uf: "SP",
              municipio: "7107",
              cep: "01001000",
            },
            ocupacao: { natureza: "01", ocupacaoPrincipal: "212" },
          },
        },
      },
    },
  ],
  // edicao: fichas em lista
  quad(
    { um: "dependente", lista: "dependentes" },
    { codigo: "21", nome: "MARIANA FICTICIA EXEMPLO", cpf: cpf(904), dataNascimento: "2018-02-11" },
    { moraComTitular: true },
    4,
  ),
  quad(
    { um: "alimentando", lista: "alimentandos" },
    {
      residencia: "brasil",
      nome: "JOAO FICTICIO ALIMENTANDO",
      cpf: cpf(905),
      dataNascimento: "2012-06-01",
      vinculo: titular,
      tipoProcesso: "decisaoJudicial",
      decisaoJudicial: {
        numeroProcesso: "00012345620248160001",
        varaCivil: "0002",
        comarca: "CURITIBA",
        uf: "PR",
        dataDecisao: "2024-03-15",
      },
    },
    { nome: "JOAO FICTICIO ALIMENTANDO SOBRINHO" },
    1,
  ),
  quad(
    { um: "rendimento_pj", lista: "rendimentos_pj" },
    {
      beneficiario: titular,
      fonte: fonte(902, "EMPRESA FICTICIA DE CONSULTORIA LTDA"),
      rendimentos: "12.000,00",
      impostoRetido: "480,00",
    },
    { impostoRetido: "520,00" },
    2,
  ),
  quad(
    { um: "rendimento_isento", lista: "rendimentos_isentos" },
    {
      codigo: "09",
      beneficiario: titular,
      fonte: fonte(903, "SOCIEDADE FICTICIA PARTICIPACOES LTDA"),
      valor: "8.500,00",
    },
    { valor: "9.000,00" },
    1,
  ),
  quad(
    { um: "rendimento_exclusivo", lista: "rendimentos_exclusivos" },
    {
      codigo: "10",
      beneficiario: titular,
      fonte: fonte(903, "SOCIEDADE FICTICIA PARTICIPACOES LTDA"),
      valor: "1.200,00",
    },
    { valor: "1.350,00" },
    1,
  ),
  quad(
    { um: "rendimento_exigibilidade_suspensa", lista: "rendimentos_exigibilidade_suspensa" },
    {
      beneficiario: titular,
      fonte: fonte(904, "EMPRESA FICTICIA EM LITIGIO LTDA"),
      rendimentos: "5.000,00",
      depositosJudiciais: "750,00",
    },
    { depositosJudiciais: "800,00" },
    1,
  ),
  quad(
    { um: "rra", lista: "rra" },
    {
      beneficiario: titular,
      opcaoTributacao: "exclusivaNaFonte",
      fonte: fonte(905, "VARA DO TRABALHO FICTICIA"),
      rendimentos: "30.000,00",
      impostoRetido: "2.100,00",
      mesRecebimento: 8,
      numeroMeses: 14,
    },
    { impostoRetido: "2.250,00" },
    1,
  ),
  quad(
    { um: "pagamento", lista: "pagamentos" },
    {
      codigo: "12",
      nomeBeneficiario: "PSICOLOGA FICTICIA DE SOUZA",
      niBeneficiario: cpf(906),
      valorPago: "2.400,00",
    },
    { valorPago: "2.600,00" },
    9,
  ),
  quad(
    { um: "doacao", lista: "doacoes" },
    {
      codigo: "41",
      niBeneficiario: cnpj(906),
      nomeBeneficiario: "PROJETO CULTURAL FICTICIO",
      valor: "500,00",
    },
    { valor: "600,00" },
    1,
  ),
  quad(
    { um: "doacao_direta_declaracao", lista: "doacoes_diretas_declaracao" },
    { tipoFundo: "estadual", uf: "PR", cnpjFundo: "10632896000185", valor: "300,00", fundo: "eca" },
    { valor: "250,00" },
    1,
  ),
  quad(
    { um: "bem", lista: "bens" },
    {
      grupo: "02",
      codigo: "01",
      discriminacao: "MOTOCICLETA FICTICIA 2021, ADQUIRIDA A VISTA",
      situacaoAnterior: "18.000,00",
      situacaoAtual: "18.000,00",
      renavam: "98765432109",
    },
    { situacaoAtual: "17.500,00" },
    4,
  ),
  quad(
    { um: "divida", lista: "dividas" },
    {
      codigo: "14",
      discriminacao: "EMPRESTIMO DE PESSOA FISICA PARA REFORMA",
      niCredor: cpf(907),
      situacaoAnterior: "10.000,00",
      situacaoAtual: "6.000,00",
      valorPago: "4.000,00",
    },
    { situacaoAtual: "5.500,00" },
    2,
  ),
  quad(
    { um: "herdeiro", lista: "herdeiros" },
    { ni: cpf(908), nome: "HERDEIRA FICTICIA EXEMPLO" },
    { nome: "HERDEIRA FICTICIA EXEMPLO DOS SANTOS" },
    1,
  ),
  quad(
    { um: "doacao_eleitoral", lista: "doacoes_eleitorais" },
    { cnpj: cnpj(907), nome: "PARTIDO FICTICIO", valor: "200,00" },
    { valor: "150,00" },
    1,
  ),
  quad(
    { um: "ganho_capital", lista: "ganhos_capital" },
    { cpfBeneficiario: TITULAR, dataInicio: "2025-03-01", dataFim: "2025-03-31" },
    { dataFim: "2025-04-30" },
    1,
  ),
  quad(
    { um: "renda_variavel", lista: "renda_variavel" },
    { beneficiario: titular, meses: [{ mes: 3, comuns: { mercadoVistaAcoes: "1.500,00" } }] },
    { prejuizoAnteriorComuns: "200,00" },
    1,
  ),
  quad(
    { um: "fii_fiagro", lista: "fii_fiagro" },
    {
      beneficiario: titular,
      meses: [{ mes: 4, resultadoLiquido: "800,00", impostoPago: "160,00" }],
    },
    { prejuizoAnterior: "100,00" },
    1,
  ),
  quad(
    { um: "imovel_rural", lista: "imoveis_rurais" },
    {
      aba: "brasil",
      atividade: "10",
      nome: "SITIO FICTICIO BOA ESPERANCA",
      localizacao: "ESTRADA FICTICIA, KM 5, ZONA RURAL",
      areaDecimosHa: 255,
      condicaoExploracao: "1",
      participacaoCentesimos: 10000,
    },
    { areaDecimosHa: 260 },
    1,
  ),
  quad(
    { um: "receita_despesa_rural", lista: "receitas_despesas_rurais" },
    { aba: "brasil", mes: 5, receitaBruta: "12.000,00", despesa: "4.000,00" },
    { despesa: "4.500,00" },
    1,
  ),
  quad(
    { um: "rebanho", lista: "rebanhos" },
    { aba: "brasil", especie: "1", estoqueInicial: 20, nascimentos: 5, vendas: 3 },
    { vendas: 4 },
    1,
  ),
  quad(
    { um: "bem_rural", lista: "bens_rurais" },
    {
      codigo: "11",
      discriminacao: "GALPAO DE ARMAZENAGEM NO SITIO FICTICIO",
      situacaoAnterior: "40.000,00",
      situacaoAtual: "40.000,00",
    },
    { situacaoAtual: "42.000,00" },
    1,
  ),
  quad(
    { um: "divida_rural", lista: "dividas_rurais" },
    {
      aba: "brasil",
      discriminacao: "FINANCIAMENTO RURAL FICTICIO PARA CUSTEIO",
      niCredor: BANCO,
      situacaoAnterior: "50.000,00",
      situacaoAtual: "40.000,00",
      valorPago: "12.000,00",
    },
    { valorPago: "12.500,00" },
    1,
  ),
  // edicao: demais ferramentas
  [
    { ferramenta: "listar_lancamentos", argumentos: { arquivo: ARQ, ficha: "bens" } },
    {
      ferramenta: "editar_lancamento",
      argumentos: {
        arquivo: ARQ,
        ficha: "bens",
        indice: 3,
        alteracoes: { situacaoAtual: "10.000,00" },
      },
    },
    {
      ferramenta: "remover_lancamento",
      argumentos: { arquivo: ARQ, ficha: "pagamentos", indice: 6 },
    },
    {
      ferramenta: "definir_identificacao",
      argumentos: { arquivo: ARQ, dados: { nome: "CARLOS FICTICIO EXEMPLO JUNIOR" } },
    },
    {
      ferramenta: "definir_rendimentos_pf_exterior",
      argumentos: {
        arquivo: ARQ,
        beneficiario: titular,
        mes: 3,
        valores: { alugueis: "2.500,00" },
      },
    },
    {
      ferramenta: "definir_renda_variavel",
      argumentos: {
        arquivo: ARQ,
        beneficiario: titular,
        mes: 2,
        dados_mes: { comuns: { mercadoVistaAcoes: "1.000,00" } },
      },
    },
    {
      ferramenta: "definir_fii_fiagro",
      argumentos: {
        arquivo: ARQ,
        beneficiario: titular,
        mes: 5,
        dados_mes: { resultadoLiquido: "300,00" },
      },
    },
    {
      ferramenta: "definir_informacoes_conjuge",
      argumentos: { arquivo: ARQ, dados: { cpf: cpf(909), entregouDeclaracao: true } },
    },
    {
      ferramenta: "definir_receitas_despesas_rurais",
      argumentos: {
        arquivo: ARQ,
        aba: "brasil",
        itens: [{ mes: 1, receitaBruta: "10.000,00", despesa: "4.000,00" }],
      },
    },
    {
      ferramenta: "definir_apuracao_rural",
      argumentos: { arquivo: ARQ, aba: "brasil", dados: { opcao: "resultado" } },
    },
    {
      ferramenta: "definir_rebanho",
      argumentos: { arquivo: ARQ, aba: "brasil", dados: { especie: "1", estoqueInicial: 10 } },
    },
    {
      ferramenta: "aplicar_caso_especial_bem",
      argumentos: { arquivo: ARQ, indice: 1, caso: "atualizacaoLei14973" },
    },
  ],
  [
    {
      ferramenta: "definir_saida_definitiva",
      argumentos: {
        arquivo: ARQ,
        dados: { dataCondicaoNaoResidente: "2025-09-30", paisDestino: "245" },
      },
    },
    { ferramenta: "gerar_comunicacao_saida", argumentos: { arquivo: ARQ } },
  ],
  [
    {
      ferramenta: "definir_identificacao",
      argumentos: { arquivo: ARQ, dados: { tipoDeclaracao: { tipo: "finalEspolio" } } },
    },
    {
      ferramenta: "definir_espolio",
      argumentos: {
        arquivo: ARQ,
        tipo: "final",
        dados: {
          anoObito: 2025,
          modalidade: "partilha",
          inventariante: { cpf: cpf(912), nome: "INVENTARIANTE FICTICIA EXEMPLO" },
        },
      },
    },
    {
      ferramenta: "adicionar_herdeiro",
      argumentos: { arquivo: ARQ, item: { ni: cpf(908), nome: "HERDEIRA FICTICIA EXEMPLO" } },
    },
    {
      ferramenta: "definir_partilha_bem",
      argumentos: {
        arquivo: ARQ,
        indice: 2,
        situacao_data_partilha: "92.000,00",
        valor_transferencia: "92.000,00",
        partilha: [{ niHerdeiro: cpf(908), percentualCentesimos: 10000 }],
      },
    },
  ],
  // ciclo
  [
    {
      ferramenta: "criar_declaracao",
      argumentos: {
        identificacao: {
          cpf: cpf(910),
          nome: "HELENA FICTICIA EXEMPLO",
          dataNascimento: "1979-01-25",
          tipoDeclaracao: { tipo: "ajusteAnual" },
          racaCor: "1",
          conjuge: { possui: false },
          endereco: {
            local: "brasil",
            tipoLogradouro: "RUA",
            logradouro: "DOS CEDROS FICTICIOS",
            numero: "88",
            bairro: "CENTRO",
            uf: "RS",
            municipio: "8801",
            cep: "90010000",
          },
          ocupacao: { natureza: "01", ocupacaoPrincipal: "252" },
        },
        opcao_tributacao: "simplificada",
      },
    },
    { ferramenta: "registrar_recibo", argumentos: { arquivo: ARQ, recibo: "1234.5678.90-12" } },
    { ferramenta: "criar_retificadora", argumentos: { arquivo: ARQ } },
    {
      ferramenta: "gravar_copia_seguranca",
      argumentos: { arquivo: ARQ, arquivo_destino: "copia.DBK" },
    },
    {
      ferramenta: "excluir_declaracao",
      argumentos: { arquivo: "copia.DBK", confirmar: "copia.DBK" },
    },
  ],
  [
    { ferramenta: "definir_opcao_tributacao", argumentos: { arquivo: ARQ, opcao: "simplificada" } },
    { ferramenta: "listar_copias_seguranca", argumentos: {} },
    {
      ferramenta: "restaurar_copia_seguranca",
      argumentos: { copia: `${ARQ}.20260410T120000Z.bak` },
    },
    {
      ferramenta: "definir_informacoes_bancarias",
      argumentos: {
        arquivo: ARQ,
        banco: "001",
        agencia: "4321",
        conta: "11223",
        dv: "2",
        tipo_conta: "corrente",
      },
    },
    {
      ferramenta: "definir_imposto_pago",
      argumentos: { arquivo: ARQ, imposto_complementar: "1.000,00" },
    },
    {
      ferramenta: "repetir_valores_bens",
      argumentos: { arquivo: ARQ, indices: [3], forcar: true },
    },
    { ferramenta: "ler_informe", argumentos: { texto: INFORME_TEXTO } },
    {
      ferramenta: "importar_informe_rendimentos",
      argumentos: { arquivo: ARQ, texto: INFORME_TEXTO },
    },
    {
      ferramenta: "importar_informe_plano_saude",
      argumentos: {
        arquivo: ARQ,
        json: {
          operadora: { cnpj: cnpj(911), nome: "OUTRA OPERADORA FICTICIA S.A." },
          beneficiarios: [{ cpf: TITULAR, valor: "3.000,00", reembolso: "100,00" }],
        },
      },
    },
    { ferramenta: "transferir_excedente_isencao_65", argumentos: { arquivo: ARQ, simular: true } },
  ],
  // saidas
  [
    { ferramenta: "gerar_darf", argumentos: { arquivo: ARQ_PF } },
    { ferramenta: "instruir_transmissao", argumentos: { arquivo: ARQ_PF } },
    { ferramenta: "gerar_relatorio_declaracao", argumentos: { arquivo: ARQ_PF } },
  ],
  // calculadoras
  [
    {
      ferramenta: "calcular_carne_leao",
      argumentos: {
        mes: 6,
        rendimentos: "9.800,00",
        previdencia: "166,98",
        livro_caixa: "2.350,00",
      },
    },
    {
      ferramenta: "calcular_rra",
      argumentos: {
        rendimentos: "30.000,00",
        numero_meses: 14,
        mes_recebimento: 8,
        irrf: "2.100,00",
      },
    },
    {
      ferramenta: "calcular_preco_medio",
      argumentos: {
        operacoes: [
          {
            data: "2025-02-03",
            ativo: "FICT3",
            tipo: "compra",
            quantidade: 100,
            valor: "2.500,00",
            custos: "5,00",
          },
          {
            data: "2025-03-10",
            ativo: "FICT3",
            tipo: "compra",
            quantidade: 100,
            valor: "2.700,00",
            custos: "5,00",
          },
          {
            data: "2025-06-02",
            ativo: "FICT3",
            tipo: "venda",
            quantidade: 150,
            valor: "4.200,00",
            custos: "5,00",
          },
        ],
      },
    },
    {
      ferramenta: "apurar_renda_variavel",
      argumentos: {
        meses: [
          { mes: 3, comuns: "-800,00", vendas_acoes: "15.000,00" },
          { mes: 6, comuns: "2.300,00", vendas_acoes: "32.000,00" },
        ],
      },
    },
    {
      ferramenta: "calcular_ganho_capital",
      argumentos: {
        tipo: "imovel",
        valor_alienacao: "650.000,00",
        custo_corretagem: "19.500,00",
        custo_aquisicao: "380.000,00",
        data_aquisicao: "2012-05-10",
        data_alienacao: "2025-09-22",
      },
    },
    {
      ferramenta: "atualizar_custo_bem",
      argumentos: { metodo: "ufir", quantidade_ufir: "12345,6789" },
    },
    {
      ferramenta: "calcular_acrescimos_moratorios",
      argumentos: {
        principal: "1.500,00",
        vencimento: "2026-05-29",
        data_pagamento: "2026-07-10",
        selic_acumulada: "1,05",
      },
    },
    {
      ferramenta: "calcular_condicao_residencia",
      argumentos: { evento: "ausencia_temporaria", data: "2024-08-01" },
    },
    {
      ferramenta: "verificar_obrigatoriedade",
      argumentos: { rendimentos_tributaveis: "42.000,00", bens: "150.000,00" },
    },
    {
      ferramenta: "converter_moeda",
      argumentos: { valor: "1.200,00", cotacao: "5,4321", finalidade: "rendimento" },
    },
  ],
  // orientacao
  [
    { ferramenta: "orientar_servico_externo", argumentos: { servico: "pre_preenchida" } },
    { ferramenta: "obter_ajuda", argumentos: { consulta: "dependentes", limite: 2 } },
    { ferramenta: "verificar_versao_tabelas", argumentos: {} },
    { ferramenta: "calcular_expressao", argumentos: { expressao: "1.903,98 * 13" } },
    { ferramenta: "consultar_atalhos", argumentos: { consulta: "Ctrl+P" } },
  ],
];
