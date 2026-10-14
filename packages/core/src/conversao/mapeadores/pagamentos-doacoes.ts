/**
 * Pagamentos Efetuados (registro 26), Doações Efetuadas (90), Doações Diretamente na Declaração
 * ao ECA (91) e à pessoa idosa (92) e Doações a Partidos e Candidatos (34).
 */
import type { DoacaoDiretaNaDeclaracao } from "../../model/pagamentos-doacoes.js";
import {
  codigo,
  digitos,
  numero,
  type Objeto,
  opcional,
  semIndefinidos,
  texto,
} from "../campos.js";
import type { ContextoGravacao, ContextoLeitura, Mapeador } from "../contexto.js";

const FUNDO = { N: "nacional", E: "estadual", M: "municipal" } as const;
const LETRA_FUNDO = { nacional: "N", estadual: "E", municipal: "M" } as const;

const tipoNi = (ni: string) => (ni.length === 14 ? 2n : ni.length === 11 ? 1n : 0n);

function lerDiretas(ctx: ContextoLeitura, tipo: string): Objeto[] {
  return ctx.doTipo(tipo).map((r) =>
    semIndefinidos({
      tipoFundo: FUNDO[texto(r, "IN_TIPO_FUNDO") as keyof typeof FUNDO] ?? "nacional",
      uf: opcional(texto(r, "SG_UF")),
      municipio: opcional(texto(r, "NM_MUNICIPIO")),
      cnpjFundo: texto(r, "NR_CNPJ_FUNDO"),
      valor: numero(r, "VR_DOACAO"),
    }),
  );
}

function gravarDiretas(
  ctx: ContextoGravacao,
  tipo: string,
  itens: readonly DoacaoDiretaNaDeclaracao[],
): void {
  for (const d of itens) {
    ctx.adicionar(
      tipo,
      {
        IN_TIPO_FUNDO: LETRA_FUNDO[d.tipoFundo],
        SG_UF: d.uf ?? "",
        NM_MUNICIPIO: d.municipio ?? "",
        VR_DOACAO: d.valor,
        NR_CNPJ_FUNDO: d.cnpjFundo,
      },
      ["NR_CNPJ_FUNDO"],
    );
  }
}

export const mapeadorPagamentosDoacoes: Mapeador = {
  nome: "pagamentosDoacoes",
  tipos: ["26", "34", "90", "91", "92"],
  ler(ctx, saida) {
    saida.pagamentos = ctx.doTipo("26").map((r, i) => {
      const tipo = texto(r, "IN_TIPO_PGTO");
      const chave = numero(r, "NR_CHAVE_DEPEND");
      let realizadoCom: Objeto = { tipo: "titular" };
      if (tipo === "D" || tipo === "A") {
        const cpf = tipo === "D" ? ctx.cpfDependente(chave) : ctx.cpfAlimentando(chave);
        if (cpf) realizadoCom = { tipo: tipo === "D" ? "dependente" : "alimentando", cpf };
        else ctx.aviso(`Pagamento ${i + 1}: pessoa vinculada (chave ${chave}) não encontrada.`);
      }
      const pais = numero(r, "CD_PAIS");
      return semIndefinidos({
        codigo: codigo(numero(r, "CD_PAGTO"), 2),
        realizadoCom,
        niBeneficiario: digitos(texto(r, "NR_BENEF"), [11, 14]),
        nomeBeneficiario: texto(r, "NM_BENEF"),
        nitEmpregadoDomestico: digitos(texto(r, "NR_NIT"), [11]),
        valorPago: numero(r, "VR_PAGTO"),
        parcelaNaoDedutivel: numero(r, "VR_REDUC"),
        contribuicaoPatrocinador: numero(r, "VR_CONTRIB_PATR"),
        descricao: opcional(texto(r, "NM_DESCRICAO")),
        pais: pais > 0n ? codigo(pais, 3) : undefined,
      });
    });
    saida.doacoesEfetuadas = ctx.doTipo("90").map((r) => ({
      codigo: codigo(numero(r, "CD_DOACAO"), 2),
      niBeneficiario: texto(r, "NR_BENEF"),
      nomeBeneficiario: texto(r, "NM_BENEF"),
      valor: numero(r, "VR_DOACAO"),
      parcelaNaoDedutivel: numero(r, "VR_PARC_NAO_DEDUT"),
    }));
    saida.doacoesDiretamenteNaDeclaracao = {
      eca: lerDiretas(ctx, "91"),
      idoso: lerDiretas(ctx, "92"),
    };
    saida.doacoesPartidos = ctx.doTipo("34").map((r) => ({
      cnpj: texto(r, "NR_PARTIDO"),
      nome: texto(r, "NM_PARTIDO"),
      valor: numero(r, "VR_DOACAO"),
    }));
  },

  gravar(ctx, dec) {
    dec.pagamentos.forEach((p, i) => {
      let chave = 0n;
      if (p.realizadoCom.tipo !== "titular") {
        const c =
          p.realizadoCom.tipo === "dependente"
            ? ctx.chaveDependente(p.realizadoCom.cpf)
            : ctx.chaveAlimentando(p.realizadoCom.cpf);
        if (c === undefined) {
          ctx.aviso(
            `Pagamento ${i + 1}: ${p.realizadoCom.tipo} não cadastrado na ficha correspondente; vínculo gravado sem chave.`,
          );
        } else chave = c;
      }
      const ni = p.niBeneficiario ?? "";
      ctx.adicionar(
        "26",
        {
          CD_PAGTO: p.codigo,
          NR_CHAVE_DEPEND: chave,
          NR_BENEF: ni,
          NM_BENEF: p.nomeBeneficiario,
          NR_NIT: p.nitEmpregadoDomestico ?? "",
          VR_PAGTO: p.valorPago,
          VR_REDUC: p.parcelaNaoDedutivel,
          VR_CONTRIB_PATR: p.contribuicaoPatrocinador,
          IN_TIPO_CPF_CNPJ: tipoNi(ni),
          IN_TIPO_PGTO: { titular: "T", dependente: "D", alimentando: "A" }[p.realizadoCom.tipo],
          NM_DESCRICAO: p.descricao ?? "",
          CD_PAIS: p.pais ?? null,
        },
        ["CD_PAGTO", "NR_BENEF"],
      );
    });
    for (const d of dec.doacoesEfetuadas) {
      ctx.adicionar(
        "90",
        {
          CD_DOACAO: d.codigo,
          NR_BENEF: d.niBeneficiario,
          NM_BENEF: d.nomeBeneficiario,
          VR_DOACAO: d.valor,
          VR_PARC_NAO_DEDUT: d.parcelaNaoDedutivel,
          IN_TIPO_CPF_CNPJ: tipoNi(d.niBeneficiario),
        },
        ["CD_DOACAO", "NR_BENEF"],
      );
    }
    gravarDiretas(ctx, "91", dec.doacoesDiretamenteNaDeclaracao.eca);
    gravarDiretas(ctx, "92", dec.doacoesDiretamenteNaDeclaracao.idoso);
    for (const d of dec.doacoesPartidos) {
      ctx.adicionar("34", { NR_PARTIDO: d.cnpj, NM_PARTIDO: d.nome, VR_DOACAO: d.valor }, [
        "NR_PARTIDO",
      ]);
    }
  },
};
