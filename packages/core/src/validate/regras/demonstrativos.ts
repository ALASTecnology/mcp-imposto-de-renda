/**
 * Regras dos demonstrativos: Renda Variável, FII/Fiagro, Atividade Rural e
 * Ganhos de Capital (nota 06 D-RV-*, D-FII-*, D-AR-*, D-GCAP-*).
 */
import type { Beneficiario } from "../../model/comum.js";
import { buscarCodigo } from "../../tabelas/index.js";
import { type Pendencia, pendencia, regra } from "../pendencia.js";
import { beneficiarioExiste, type Contexto, niValido } from "../util.js";

export const RV_PESSOA = regra({
  codigo: "RV-PESSOA",
  gravidade: "erro",
  ficha: "rendaVariavel",
  descricao: "Renda variável de dependente cadastrado, uma ficha por pessoa e um registro por mês.",
  fonte: "Nota 06 D-RV-GERAL e D-FII-GERAL (abas Titular e Dependentes, seleção do mês)",
});
export const AR_TABELAS = regra({
  codigo: "AR-TABELAS",
  gravidade: "erro",
  ficha: "atividadeRural",
  descricao:
    "Atividade, condição de exploração, país e código de bem rural existentes nas tabelas.",
  fonte: "Nota 06 D-AR-IMOVEL e D-AR-BENS; tabelas atividade-rural-*.json e paises.json",
});
export const AR_PARTICIPANTES = regra({
  codigo: "AR-PARTICIPANTES",
  gravidade: "erro",
  ficha: "atividadeRural",
  descricao:
    "Participação menor que 100% exige participantes com CPF/CNPJ válido (ou estrangeiro com nome).",
  fonte: "Nota 06 D-AR-IMOVEL; Ajuda pág. 269",
});
export const AR_MESES = regra({
  codigo: "AR-MESES",
  gravidade: "erro",
  ficha: "atividadeRural",
  descricao:
    "Receitas e despesas do Brasil com um registro por mês; um registro por país no exterior.",
  fonte: "Nota 06 D-AR-RD-BRASIL e D-AR-RD-EXTERIOR",
});
export const AR_REBANHO = regra({
  codigo: "AR-REBANHO",
  gravidade: "erro",
  ficha: "atividadeRural",
  descricao:
    "Estoque final do rebanho (inicial + aquisições + nascimentos - consumo e perdas - vendas) não negativo.",
  fonte: "Nota 06 D-AR-REBANHO (inferido); Ajuda pág. 291",
});
export const AR_COMPENSACAO = regra({
  codigo: "AR-COMPENSACAO",
  gravidade: "erro",
  ficha: "atividadeRural",
  descricao:
    "Compensação de prejuízo só com opção pelo resultado e limitada ao saldo de prejuízo de exercícios anteriores.",
  fonte: "Nota 06 D-AR-APUR-L01, L06 e L07; Ajuda págs. 279 a 285",
});
export const AR_CREDOR = regra({
  codigo: "AR-CREDOR",
  gravidade: "erro",
  ficha: "atividadeRural",
  descricao: "CPF/CNPJ do credor de dívida rural com DV correto.",
  fonte: "Nota 06 D-AR-DIVIDAS",
});
export const GC_DOCUMENTOS = regra({
  codigo: "GC-DOCUMENTOS",
  gravidade: "erro",
  ficha: "ganhosCapital",
  descricao:
    "Demonstrativo do titular ou de dependente cadastrado; adquirentes com CPF/CNPJ válido.",
  fonte: "Nota 06 D-GCAP-GERAL (arquivo do CPF da declaração); registro 65",
});

export const REGRAS_DEMONSTRATIVOS = [
  RV_PESSOA,
  AR_TABELAS,
  AR_PARTICIPANTES,
  AR_MESES,
  AR_REBANHO,
  AR_COMPENSACAO,
  AR_CREDOR,
  GC_DOCUMENTOS,
];

function chave(b: Beneficiario): string {
  return b.tipo === "titular" ? "titular" : b.cpf;
}

function mesesRepetidos(meses: readonly { mes: number }[]): number[] {
  const vistos = new Set<number>();
  const repetidos: number[] = [];
  for (const { mes } of meses) {
    if (vistos.has(mes)) repetidos.push(mes);
    vistos.add(mes);
  }
  return repetidos;
}

export function validarDemonstrativos(ctx: Contexto): Pendencia[] {
  const d = ctx.declaracao;
  const out: Pendencia[] = [];

  for (const [lista, nome] of [
    [d.rendaVariavel, "rendaVariavel"],
    [d.fundosImobiliarios, "fundosImobiliarios"],
  ] as const) {
    const pessoas = new Set<string>();
    lista.forEach((rv, i) => {
      const base = `${nome}[${i}]`;
      if (!beneficiarioExiste(ctx, rv.beneficiario)) {
        out.push(
          pendencia(
            RV_PESSOA,
            `${base}.beneficiario.cpf`,
            "Dependente não cadastrado na ficha Dependentes.",
          ),
        );
      }
      if (pessoas.has(chave(rv.beneficiario))) {
        out.push(
          pendencia(RV_PESSOA, `${base}.beneficiario`, "Mais de uma ficha para a mesma pessoa."),
        );
      }
      pessoas.add(chave(rv.beneficiario));
      for (const mes of mesesRepetidos(rv.meses)) {
        out.push(pendencia(RV_PESSOA, `${base}.meses`, `Mês ${mes} informado mais de uma vez.`));
      }
    });
  }

  const ar = d.atividadeRural;
  if (ar) {
    for (const aba of ["brasil", "exterior"] as const) {
      const dados = ar[aba];
      dados.imoveis.forEach((im, i) => {
        const c = (campo: string) => `atividadeRural.${aba}.imoveis[${i}].${campo}`;
        if (!buscarCodigo("atividade-rural-tipos", im.atividade)) {
          out.push(
            pendencia(AR_TABELAS, c("atividade"), `Atividade rural ${im.atividade} inexistente.`),
          );
        }
        if (!buscarCodigo("atividade-rural-condicoes-exploracao", im.condicaoExploracao)) {
          out.push(
            pendencia(AR_TABELAS, c("condicaoExploracao"), "Condição de exploração inexistente."),
          );
        }
        if (
          aba === "exterior" &&
          (!im.pais || !buscarCodigo("paises", im.pais) || im.pais === "105")
        ) {
          out.push(
            pendencia(
              AR_TABELAS,
              c("pais"),
              "Imóvel no exterior exige país estrangeiro da tabela.",
            ),
          );
        }
        if (im.participacaoCentesimos < 10000 && im.participantes.length === 0) {
          out.push(
            pendencia(
              AR_PARTICIPANTES,
              c("participantes"),
              "Participação menor que 100% exige os demais participantes.",
            ),
          );
        }
        im.participantes.forEach((p, j) => {
          const ok = p.ni ? niValido(p.ni) : p.estrangeiro;
          if (!ok) {
            out.push(
              pendencia(
                AR_PARTICIPANTES,
                c(`participantes[${j}].ni`),
                `CPF/CNPJ do participante ${p.nome} ausente ou inválido.`,
              ),
            );
          }
        });
      });
      dados.rebanho.forEach((r, i) => {
        const final = r.estoqueInicial + r.aquisicoes + r.nascimentos - r.consumoPerdas - r.vendas;
        if (final < 0) {
          out.push(
            pendencia(
              AR_REBANHO,
              `atividadeRural.${aba}.rebanho[${i}]`,
              `Estoque final negativo (${final}) na espécie ${r.especie}.`,
            ),
          );
        }
      });
      const ap = dados.apuracao;
      if (
        ap.compensacaoPrejuizo > 0n &&
        (ap.opcao === "limite20" || ap.compensacaoPrejuizo > ap.prejuizoAnterior)
      ) {
        out.push(
          pendencia(
            AR_COMPENSACAO,
            `atividadeRural.${aba}.apuracao.compensacaoPrejuizo`,
            "Compensação de prejuízo incompatível com a opção de apuração ou acima do saldo anterior.",
          ),
        );
      }
      dados.dividas.forEach((dv, i) => {
        if (dv.niCredor && !niValido(dv.niCredor)) {
          out.push(
            pendencia(
              AR_CREDOR,
              `atividadeRural.${aba}.dividas[${i}].niCredor`,
              "CPF/CNPJ do credor inválido.",
            ),
          );
        }
      });
    }
    for (const mes of mesesRepetidos(ar.brasil.receitasDespesas)) {
      out.push(
        pendencia(AR_MESES, "atividadeRural.brasil.receitasDespesas", `Mês ${mes} repetido.`),
      );
    }
    const paises = new Set<string>();
    ar.exterior.receitasDespesas.forEach((r, i) => {
      const c = `atividadeRural.exterior.receitasDespesas[${i}].pais`;
      if (!buscarCodigo("paises", r.pais) || r.pais === "105") {
        out.push(pendencia(AR_TABELAS, c, `País ${r.pais} inválido para receitas no exterior.`));
      }
      if (paises.has(r.pais)) out.push(pendencia(AR_MESES, c, `País ${r.pais} repetido.`));
      paises.add(r.pais);
    });
    ar.bens.forEach((b, i) => {
      if (!buscarCodigo("atividade-rural-bens", b.codigo)) {
        out.push(
          pendencia(
            AR_TABELAS,
            `atividadeRural.bens[${i}].codigo`,
            `Código de bem rural ${b.codigo} inexistente.`,
          ),
        );
      }
    });
  }

  const cpfsPessoas = new Set([d.identificacao.cpf, ...ctx.cpfsDependentes]);
  d.ganhosCapital.forEach((gc, i) => {
    const base = `ganhosCapital[${i}]`;
    if (!cpfsPessoas.has(gc.cpfBeneficiario)) {
      out.push(
        pendencia(
          GC_DOCUMENTOS,
          `${base}.cpfBeneficiario`,
          "Demonstrativo de CPF que não é do titular nem de dependente.",
        ),
      );
    }
    gc.alienacoes.forEach((al, j) => {
      al.adquirentes.forEach((a, k) => {
        if (!niValido(a.ni)) {
          out.push(
            pendencia(
              GC_DOCUMENTOS,
              `${base}.alienacoes[${j}].adquirentes[${k}].ni`,
              `CPF/CNPJ do adquirente ${a.nome} inválido.`,
            ),
          );
        }
      });
    });
  });
  return out;
}
