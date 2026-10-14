/**
 * Regras das fichas Bens e Direitos e Dívidas e Ônus Reais, e cruzamentos
 * entre bens e rendimentos de aplicações (nota 05 F-BENS-ESP-*, F-DIV;
 * nota 03 F-ISENTO-09/12 e F-EXCL-06/10; registro 27 do leiaute).
 */
import type { BemDireito } from "../../model/bens-dividas.js";
import { PAIS_BRASIL } from "../../model/comum.js";
import { buscarBem, buscarCodigo } from "../../tabelas/index.js";
import { validarContaBancaria } from "../conta-bancaria.js";
import { type Pendencia, pendencia, regra } from "../pendencia.js";
import { beneficiarioExiste, type Contexto, niValido } from "../util.js";

export const BEM_CODIGO = regra({
  codigo: "BEM-CODIGO",
  gravidade: "erro",
  ficha: "bens",
  descricao: "Grupo e código existentes na tabela de bens e direitos; país existente.",
  fonte: "Tabelas bens-direitos.json e paises.json",
});
export const BEM_DEPENDENTE = regra({
  codigo: "BEM-DEPENDENTE",
  gravidade: "erro",
  ficha: "bens",
  descricao: "Bem de dependente exige o dependente cadastrado.",
  fonte: 'Ficha Bens e Direitos, "Bem ou direito pertencente ao"; nota 02 F-DEP',
});
export const BEM_NI = regra({
  codigo: "BEM-NI",
  gravidade: "erro",
  ficha: "bens",
  descricao:
    "CPF/CNPJ informado no bem (instituição, empresa, proprietário ou usufrutuário) com DV correto.",
  fonte: "Registros 27 (NM_CPFCNPJ) e 36",
});
export const BEM_CNPJ_OBRIGATORIO = regra({
  codigo: "BEM-CNPJ-OBRIGATORIO",
  gravidade: "erro",
  ficha: "bens",
  descricao: "Leasing com opção de compra a exercer (99.08) exige o CNPJ do contratante.",
  fonte: "Nota 05 F-BENS-ESP-LEASING; Ajuda pág. 208",
});
export const BEM_CNPJ_RECOMENDADO = regra({
  codigo: "BEM-CNPJ-RECOMENDADO",
  gravidade: "aviso",
  ficha: "bens",
  descricao:
    "Participações (03), aplicações (04), contas (06.01), fundos (07), consórcio (99.05), VGBL (99.06) e JCP a receber (99.07) no Brasil devem trazer o CNPJ.",
  fonte:
    "Nota 05 F-BENS-ESP-CONSORCIO e F-BENS-ESP-VGBL (CNPJ citado); demais códigos inferidos do campo CNPJ do formulário",
});
export const BEM_CONTA = regra({
  codigo: "BEM-CONTA",
  gravidade: "erro",
  ficha: "bens",
  descricao: "Conta bancária do bem com banco da tabela bancos-bens, agência e conta numéricas.",
  fonte:
    "Tabelas bancos-bens.json e bancos-calculo-dv.json; registro 27 (NR_BANCO, NR_AGENCIA, NR_CONTA, NR_DV_CONTA)",
});
export const BEM_CONTA_AVISO = regra({
  codigo: "BEM-CONTA-AVISO",
  gravidade: "aviso",
  ficha: "bens",
  descricao:
    "Conta corrente ou poupança no Brasil sem dados bancários, ou com tamanho/DV que não confere.",
  fonte:
    "Tabela bancos-calculo-dv.json (interpretação inferida); algoritmos públicos de DV dos bancos",
});
export const BEM_CRIPTO = regra({
  codigo: "BEM-CRIPTO",
  gravidade: "erro",
  ficha: "bens",
  descricao: "Altcoin (08.02) e stablecoin (08.03) com sigla existente nas tabelas.",
  fonte:
    "Tabelas altcoins.json e stablecoins.json (IN RFB 1.888/2019); registro 27 COD_ALTCOIN/COD_STABLECOIN",
});
export const BEM_BOLSA = regra({
  codigo: "BEM-BOLSA",
  gravidade: "aviso",
  ficha: "bens",
  descricao: "Bem negociado em bolsa informa o código de negociação.",
  fonte: "Registro 27 (IN_BOLSA, NR_COD_NEGOCIACAO_BOLSA)",
});
export const BEM_SITUACAO = regra({
  codigo: "BEM-SITUACAO",
  gravidade: "aviso",
  ficha: "bens",
  descricao:
    "Casos especiais: benfeitoria até 1988 (01.17) sem situação anterior; leasing a exercer (99.08) com as duas situações em branco.",
  fonte: "Nota 05 F-BENS-ESP-BENFEITORIAS e F-BENS-ESP-LEASING; Ajuda págs. 206 e 208",
});
export const BEM_PARTILHA = regra({
  codigo: "BEM-PARTILHA",
  gravidade: "erro",
  ficha: "bens",
  descricao:
    "Na partilha do Final de Espólio, cada herdeiro do bem está na ficha Herdeiros e os percentuais somam 100%.",
  fonte: "Nota 06 E-ESP-BENS e E-ESP-HERDEIROS (soma de percentuais inferida); registro 59",
});
export const DIV_CODIGO = regra({
  codigo: "DIV-CODIGO",
  gravidade: "erro",
  ficha: "dividas",
  descricao: "Código de dívida existente na tabela.",
  fonte: "Tabela dividas-onus.json",
});
export const DIV_CREDOR = regra({
  codigo: "DIV-CREDOR",
  gravidade: "erro",
  ficha: "dividas",
  descricao: "CPF/CNPJ do credor com DV correto.",
  fonte: "Nota 05 F-DIV",
});
export const DIV_VALOR_MINIMO = regra({
  codigo: "DIV-VALOR-MINIMO",
  gravidade: "aviso",
  ficha: "dividas",
  descricao: "Dívidas de até R$ 5.000,00 em 31/12 do ano-calendário estão dispensadas.",
  fonte: "Nota 05 F-DIV; Ajuda pág. 236",
});
export const CRZ_BEM_RENDIMENTO = regra({
  codigo: "CRZ-BEM-RENDIMENTO",
  gravidade: "aviso",
  ficha: "bens",
  descricao:
    "Rendimento de lucros, poupança, aplicações ou JCP de uma fonte sem bem correspondente (mesmo CNPJ) em Bens e Direitos.",
  fonte:
    "Nota 03 F-ISENTO-09, F-ISENTO-12, F-EXCL-06 e F-EXCL-10 (vínculo bem/rendimento); malha fina",
});
export const CRZ_CHAVE_BEM = regra({
  codigo: "CRZ-CHAVE-BEM",
  gravidade: "erro",
  ficha: "bens",
  descricao: "Lançamento vinculado a um bem (chave) que não existe em Bens e Direitos.",
  fonte: "Registros 84, 86 e 88 (NR_CHAVE_BEM)",
});

export const REGRAS_BENS_DIVIDAS = [
  BEM_CODIGO,
  BEM_DEPENDENTE,
  BEM_NI,
  BEM_CNPJ_OBRIGATORIO,
  BEM_CNPJ_RECOMENDADO,
  BEM_CONTA,
  BEM_CONTA_AVISO,
  BEM_CRIPTO,
  BEM_BOLSA,
  BEM_SITUACAO,
  BEM_PARTILHA,
  DIV_CODIGO,
  DIV_CREDOR,
  DIV_VALOR_MINIMO,
  CRZ_BEM_RENDIMENTO,
  CRZ_CHAVE_BEM,
];

/** Códigos (GG.CC) cujo CNPJ é recomendado quando o bem está no Brasil. */
function cnpjRecomendado(grupo: string, codigo: string): boolean {
  if (grupo === "03" && codigo !== "99") return true;
  if (grupo === "04" || grupo === "07") return true;
  return (
    `${grupo}.${codigo}` === "06.01" || (grupo === "99" && ["05", "06", "07"].includes(codigo))
  );
}

/** Bens cujo rendimento tem o mesmo CNPJ da fonte, por código de rendimento. */
const BENS_DO_RENDIMENTO: Readonly<Record<string, (b: BemDireito) => boolean>> = {
  "isento-09": (b) => b.grupo === "03",
  "isento-12": (b) => b.grupo === "04" || b.grupo === "07",
  "exclusivo-06": (b) => b.grupo === "04" || b.grupo === "07",
  "exclusivo-10": (b) => b.grupo === "03" || (b.grupo === "99" && b.codigo === "07"),
};

/** Limite de dispensa de dívidas: R$ 5.000,00. */
const LIMITE_DIVIDA = 500000n;

export function validarBensDividas(ctx: Contexto): Pendencia[] {
  const d = ctx.declaracao;
  const out: Pendencia[] = [];
  const cpfsHerdeiros = new Set(d.herdeiros.map((h) => h.ni));
  const finalEspolio = d.identificacao.tipoDeclaracao.tipo === "finalEspolio";

  d.bens.forEach((b, i) => {
    const c = (campo: string) => `bens[${i}].${campo}`;
    const gc = `${b.grupo}.${b.codigo}`;
    if (!buscarBem(b.grupo, b.codigo)) {
      out.push(
        pendencia(BEM_CODIGO, c("codigo"), `Grupo ${b.grupo}, código ${b.codigo} inexistente.`),
      );
    }
    if (!buscarCodigo("paises", b.pais)) {
      out.push(pendencia(BEM_CODIGO, c("pais"), `País ${b.pais} inexistente.`));
    }
    if (!beneficiarioExiste(ctx, b.pertenceA)) {
      out.push(
        pendencia(
          BEM_DEPENDENTE,
          c("pertenceA.cpf"),
          "Dependente não cadastrado na ficha Dependentes.",
        ),
      );
    }
    if (b.ni && !niValido(b.ni)) {
      out.push(pendencia(BEM_NI, c("ni"), `CPF/CNPJ ${b.ni} inválido.`));
    }
    b.proprietariosUsufrutuarios.forEach((ni, j) => {
      if (!niValido(ni))
        out.push(
          pendencia(BEM_NI, c(`proprietariosUsufrutuarios[${j}]`), `CPF/CNPJ ${ni} inválido.`),
        );
    });
    const noBrasil = b.pais === PAIS_BRASIL;
    if (gc === "99.08" && !b.ni) {
      out.push(
        pendencia(BEM_CNPJ_OBRIGATORIO, c("ni"), "Leasing (99.08) exige o CNPJ do contratante."),
      );
    } else if (noBrasil && !b.ni && cnpjRecomendado(b.grupo, b.codigo)) {
      out.push(pendencia(BEM_CNPJ_RECOMENDADO, c("ni"), `Informe o CNPJ vinculado ao bem ${gc}.`));
    }
    if (b.conta) {
      for (const p of validarContaBancaria(b.conta, "bancos-bens")) {
        out.push(
          pendencia(
            p.gravidade === "erro" ? BEM_CONTA : BEM_CONTA_AVISO,
            c(`conta.${p.campo}`),
            p.mensagem,
          ),
        );
      }
    } else if (noBrasil && (gc === "06.01" || gc === "04.01")) {
      out.push(pendencia(BEM_CONTA_AVISO, c("conta"), "Informe banco, agência e conta do bem."));
    }
    if (gc === "08.02") {
      if (b.codigoAltcoin && !buscarCodigo("altcoins", b.codigoAltcoin)) {
        out.push(
          pendencia(BEM_CRIPTO, c("codigoAltcoin"), `Altcoin ${b.codigoAltcoin} fora da tabela.`),
        );
      }
    }
    if (gc === "08.03" && b.codigoStablecoin && !buscarCodigo("stablecoins", b.codigoStablecoin)) {
      out.push(
        pendencia(
          BEM_CRIPTO,
          c("codigoStablecoin"),
          `Stablecoin ${b.codigoStablecoin} fora da tabela.`,
        ),
      );
    }
    if (b.negociadoEmBolsa && !b.codigoNegociacao) {
      out.push(
        pendencia(BEM_BOLSA, c("codigoNegociacao"), "Informe o código de negociação em bolsa."),
      );
    }
    if (gc === "01.17" && b.situacaoAnterior > 0n) {
      out.push(
        pendencia(
          BEM_SITUACAO,
          c("situacaoAnterior"),
          "Benfeitoria em imóvel adquirido até 1988 (01.17) fica sem situação anterior.",
        ),
      );
    }
    if (gc === "99.08" && (b.situacaoAnterior > 0n || b.situacaoAtual > 0n)) {
      out.push(
        pendencia(
          BEM_SITUACAO,
          c("situacaoAtual"),
          "Leasing a exercer no fim do contrato fica com as situações em branco.",
        ),
      );
    }
    if (finalEspolio && b.partilha.length > 0) {
      const total = b.partilha.reduce((a, p) => a + p.percentualCentesimos, 0);
      if (total !== 10000) {
        out.push(
          pendencia(
            BEM_PARTILHA,
            c("partilha"),
            `Os percentuais da partilha somam ${total / 100}%, não 100%.`,
          ),
        );
      }
      b.partilha.forEach((p, j) => {
        if (!cpfsHerdeiros.has(p.niHerdeiro)) {
          out.push(
            pendencia(
              BEM_PARTILHA,
              c(`partilha[${j}].niHerdeiro`),
              "Herdeiro não cadastrado na ficha Herdeiros.",
            ),
          );
        }
      });
    }
  });

  d.dividas.forEach((dv, i) => {
    const c = (campo: string) => `dividas[${i}].${campo}`;
    if (!buscarCodigo("dividas-onus", dv.codigo)) {
      out.push(pendencia(DIV_CODIGO, c("codigo"), `Código de dívida ${dv.codigo} inexistente.`));
    }
    if (dv.niCredor && !niValido(dv.niCredor)) {
      out.push(pendencia(DIV_CREDOR, c("niCredor"), `CPF/CNPJ do credor ${dv.niCredor} inválido.`));
    }
    if (dv.situacaoAtual > 0n && dv.situacaoAtual <= LIMITE_DIVIDA && dv.codigo !== "16") {
      out.push(
        pendencia(
          DIV_VALOR_MINIMO,
          c("situacaoAtual"),
          "Dívida de até R$ 5.000,00 em 31/12/2025 não precisa ser informada.",
        ),
      );
    }
  });

  // Cruzamentos entre rendimentos de aplicações e bens.
  const chaves = new Set(d.bens.map((b) => b.chave).filter((k) => k !== undefined));
  const lancamentos = [
    ...d.rendimentosIsentos.map((r, i) => ({
      r,
      tipo: "isento",
      caminho: `rendimentosIsentos[${i}]`,
    })),
    ...d.rendimentosExclusivos.map((r, i) => ({
      r,
      tipo: "exclusivo",
      caminho: `rendimentosExclusivos[${i}]`,
    })),
  ];
  for (const { r, tipo, caminho } of lancamentos) {
    if ("chaveBem" in r && r.chaveBem !== undefined && !chaves.has(r.chaveBem)) {
      out.push(
        pendencia(CRZ_CHAVE_BEM, `${caminho}.chaveBem`, `Bem de chave ${r.chaveBem} inexistente.`),
      );
    }
    const filtro = BENS_DO_RENDIMENTO[`${tipo}-${r.codigo}`];
    if (!filtro || !("fonte" in r) || !r.fonte || r.fonte.ni.length !== 14) continue;
    const ni = r.fonte.ni;
    const temBem = d.bens.some((b) => filtro(b) && b.ni === ni);
    if (!temBem && (!("chaveBem" in r) || r.chaveBem === undefined)) {
      out.push(
        pendencia(
          CRZ_BEM_RENDIMENTO,
          `${caminho}.fonte.ni`,
          `Rendimento ${tipo} código ${r.codigo} de ${r.fonte.nome} sem bem com o mesmo CNPJ em Bens e Direitos.`,
        ),
      );
    }
  }
  return out;
}
