/**
 * Bens e Direitos (registro 27), proprietários ou usufrutuários (36), percentual de partilha por
 * herdeiro (59) e Dívidas e Ônus Reais (28).
 */
import {
  codigo,
  ddmmaaaaDeIso,
  digitos,
  indicador,
  isoDeDdmmaaaa,
  numero,
  type Objeto,
  opcional,
  semIndefinidos,
  texto,
} from "../campos.js";
import type { Mapeador } from "../contexto.js";
import { nomeMunicipio } from "./identificacao.js";

export const mapeadorBensDividas: Mapeador = {
  nome: "bensDividas",
  tipos: ["27", "28", "36", "59"],
  ler(ctx, saida) {
    const usufrutuarios = new Map<bigint, string[]>();
    for (const r of ctx.doTipo("36")) {
      const c = numero(r, "NR_CHAVE_BEM");
      usufrutuarios.set(c, [...(usufrutuarios.get(c) ?? []), texto(r, "NR_CPF_CNPJ")]);
    }
    const partilhas = new Map<bigint, Objeto[]>();
    for (const r of ctx.doTipo("59")) {
      const c = numero(r, "NR_CHAVE_BEM");
      const ni = ctx.niHerdeiro(numero(r, "NR_CHAVE_HERDEIRO"));
      if (!ni) {
        ctx.aviso(
          "Percentual de partilha (registro 59) ligado a herdeiro inexistente foi ignorado.",
        );
        continue;
      }
      partilhas.set(c, [
        ...(partilhas.get(c) ?? []),
        { niHerdeiro: ni, percentualCentesimos: Number(numero(r, "VR_PERCENTUAL")) },
      ]);
    }

    saida.bens = ctx.doTipo("27").map((r) => {
      const pais = numero(r, "CD_PAIS");
      const area = numero(r, "AREA");
      const unidade = texto(r, "NM_UNID");
      const regImovel = texto(r, "NM_IND_REG_IMOV");
      const municipio = numero(r, "CD_MUNICIP");
      const cei = numero(r, "NR_CEI_CNO");
      const imovel = semIndefinidos({
        logradouro: opcional(texto(r, "NM_LOGRA")),
        numero: opcional(texto(r, "NR_NUMERO")),
        complemento: opcional(texto(r, "NM_COMPLEM")),
        bairro: opcional(texto(r, "NM_BAIRRO")),
        cep: digitos(texto(r, "NR_CEP"), [8]),
        uf: opcional(texto(r, "SG_UF")),
        municipio: municipio > 0n ? codigo(municipio, 4) : undefined,
        areaTotalCentesimos: area > 0n ? Number(area) * 10 : undefined,
        unidade: unidade === "0" ? "m2" : unidade === "1" ? "ha" : undefined,
        registradoEmCartorio: regImovel === "1" ? true : regImovel === "0" ? false : undefined,
        matricula: opcional(texto(r, "MATRIC_IMOV")),
        nomeCartorio: opcional(texto(r, "NM_CARTORIO")),
        iptu: opcional(texto(r, "NR_IPTU")),
        cib: opcional(texto(r, "NR_CIB")),
        ceiCno: cei > 0n ? codigo(cei, 12) : undefined,
      });
      const banco = numero(r, "NR_BANCO");
      const contaNum = texto(r, "NR_CONTA").replace(/\D/g, "");
      const aplicacao = numero(r, "VR_LUCRO_PREJUIZO_APLICACAO_FINANCEIRA");
      const impAplicacao = numero(r, "VR_IMPOSTO_PAGO_EXTERIOR_APLICACAO_FINANCEIRA");
      const lucros = numero(r, "VR_RECEBIDO_LUCROS_DIVIDENDOS");
      const impLucros = numero(r, "VR_IMPOSTO_PAGO_EXTERIOR_LUCROS_DIVIDENDOS");
      const chave = numero(r, "NR_CHAVE_BEM");
      const custodiante = texto(r, "IN_CUSTODIANTE");
      return semIndefinidos({
        chave: chave > 0n ? Number(chave) : undefined,
        grupo: codigo(texto(r, "CD_GRUPO_BEM") || "0", 2),
        codigo: codigo(numero(r, "CD_BEM"), 2),
        pertenceA:
          texto(r, "IN_TIPO_BENEFIC") === "D"
            ? { tipo: "dependente", cpf: texto(r, "NR_CPF_BENEFIC") }
            : { tipo: "titular" },
        pais: pais > 0n ? codigo(pais, 3) : "105",
        discriminacao: texto(r, "TX_BEM"),
        situacaoAnterior: numero(r, "VR_ANTER"),
        situacaoAtual: numero(r, "VR_ATUAL"),
        dataAquisicao: isoDeDdmmaaaa(texto(r, "DT_AQUISICAO")),
        ni: digitos(texto(r, "NM_CPFCNPJ"), [11, 14]),
        imovel: Object.keys(imovel).length > 0 ? imovel : undefined,
        renavam: opcional(texto(r, "NR_RENAVAN")),
        registroAviacaoCivil: opcional(texto(r, "NR_DEP_AVIACAO_CIVIL")),
        registroCapitaniaPortos: opcional(texto(r, "NR_CAPITANIA_PORTOS")),
        conta:
          banco > 0n && contaNum !== ""
            ? semIndefinidos({
                banco: codigo(banco, 3),
                agencia: numero(r, "NR_AGENCIA").toString(),
                conta: contaNum,
                dv: opcional(texto(r, "NR_DV_CONTA")),
                contaPagamento: indicador(r, "IN_CONTA_PAGAMENTO"),
              })
            : undefined,
        negociadoEmBolsa: indicador(r, "IN_BOLSA"),
        codigoNegociacao: opcional(texto(r, "NR_COD_NEGOCIACAO_BOLSA")),
        custodiante: custodiante === "" ? undefined : custodiante === "1",
        codigoAltcoin: opcional(texto(r, "COD_ALTCOIN")),
        codigoStablecoin: opcional(texto(r, "COD_STABLECOIN")),
        aplicacaoFinanceiraExterior:
          aplicacao !== 0n || impAplicacao > 0n
            ? { rendimentoOuPerda: aplicacao, impostoPagoExterior: impAplicacao }
            : undefined,
        lucrosDividendosExterior:
          lucros > 0n || impLucros > 0n
            ? { valorRecebido: lucros, impostoPago: impLucros }
            : undefined,
        usufruto: indicador(r, "IN_BEM_USUFRUTO"),
        proprietariosUsufrutuarios: usufrutuarios.get(chave) ?? [],
        atualizadoLei14973: indicador(r, "IN_PROCESSO_ATUALIZACAO_BEM"),
        bemAInventariar: indicador(r, "IN_BEM_INVENTARIAR"),
        partilha: partilhas.get(chave) ?? [],
      });
    });

    saida.dividas = ctx.doTipo("28").map((r) => ({
      codigo: codigo(numero(r, "CD_DIV"), 2),
      discriminacao: texto(r, "TX_DIV"),
      situacaoAnterior: numero(r, "VR_ANTER"),
      situacaoAtual: numero(r, "VR_ATUAL"),
      valorPago: numero(r, "VR_PGTO_ANUAL"),
    }));
  },

  gravar(ctx, dec) {
    const chaves = new Set<number>();
    dec.bens.forEach((b, i) => {
      const im = b.imovel;
      let chave = b.chave ?? i + 1;
      while (chaves.has(chave)) chave++;
      chaves.add(chave);
      if (b.situacaoDataPartilha !== undefined || b.valorTransferencia !== undefined) {
        ctx.aviso(
          `Bem ${i + 1}: situação na data da partilha e valor de transferência não têm campo no registro 27; confira-os no programa oficial.`,
        );
      }
      const v: Record<string, string | bigint | null> = {
        CD_BEM: BigInt(b.codigo),
        IN_EXTERIOR: b.pais !== "105" ? 1n : 0n,
        CD_PAIS: BigInt(b.pais),
        TX_BEM: b.discriminacao,
        VR_ANTER: b.situacaoAnterior,
        VR_ATUAL: b.situacaoAtual,
        NM_LOGRA: im?.logradouro ?? "",
        NR_NUMERO: im?.numero ?? "",
        NM_COMPLEM: im?.complemento ?? "",
        NM_BAIRRO: im?.bairro ?? "",
        NR_CEP: im?.cep ?? "",
        SG_UF: im?.uf ?? "",
        CD_MUNICIP: im?.municipio ? BigInt(im.municipio) : null,
        NM_IND_REG_IMOV:
          im?.registradoEmCartorio === undefined ? 2n : im.registradoEmCartorio ? 1n : 0n,
        MATRIC_IMOV: im?.matricula ?? "",
        AREA:
          im?.areaTotalCentesimos === undefined
            ? 0n
            : BigInt(Math.round(im.areaTotalCentesimos / 10)),
        NM_UNID: im?.unidade === undefined ? 2n : im.unidade === "m2" ? 0n : 1n,
        NM_CARTORIO: im?.nomeCartorio ?? "",
        NR_CHAVE_BEM: BigInt(chave),
        DT_AQUISICAO: ddmmaaaaDeIso(b.dataAquisicao),
        NR_RENAVAN: b.renavam ?? "",
        NR_DEP_AVIACAO_CIVIL: b.registroAviacaoCivil ?? "",
        NR_CAPITANIA_PORTOS: b.registroCapitaniaPortos ?? "",
        NR_AGENCIA: b.conta ? BigInt(b.conta.agencia) : null,
        NR_DV_CONTA: b.conta?.dv ?? "",
        NM_CPFCNPJ: b.ni ?? "",
        NR_IPTU: im?.iptu ?? "",
        NR_BANCO: b.conta ? BigInt(b.conta.banco) : null,
        IN_TIPO_BENEFIC: b.pertenceA.tipo === "dependente" ? "D" : "T",
        NR_CPF_BENEFIC: b.pertenceA.tipo === "dependente" ? b.pertenceA.cpf : "",
        CD_GRUPO_BEM: b.grupo,
        IN_BEM_INVENTARIAR: b.bemAInventariar ? 1n : 0n,
        NR_CONTA: b.conta?.conta ?? "",
        NR_CIB: im?.cib ?? "",
        NR_CEI_CNO: im?.ceiCno ? BigInt(im.ceiCno) : null,
        IN_BOLSA: b.negociadoEmBolsa ? 1n : 0n,
        NR_COD_NEGOCIACAO_BOLSA: b.codigoNegociacao ?? "",
        IN_CUSTODIANTE: b.custodiante === undefined ? null : b.custodiante ? 1n : 0n,
        COD_ALTCOIN: b.codigoAltcoin ?? "",
        COD_STABLECOIN: b.codigoStablecoin ?? "",
        VR_LUCRO_PREJUIZO_APLICACAO_FINANCEIRA:
          b.aplicacaoFinanceiraExterior?.rendimentoOuPerda ?? 0n,
        VR_IMPOSTO_PAGO_EXTERIOR_APLICACAO_FINANCEIRA:
          b.aplicacaoFinanceiraExterior?.impostoPagoExterior ?? 0n,
        VR_RECEBIDO_LUCROS_DIVIDENDOS: b.lucrosDividendosExterior?.valorRecebido ?? 0n,
        VR_IMPOSTO_PAGO_EXTERIOR_LUCROS_DIVIDENDOS: b.lucrosDividendosExterior?.impostoPago ?? 0n,
        IN_CONTA_PAGAMENTO: b.conta?.contaPagamento ? 1n : 0n,
        IN_PROCESSO_ATUALIZACAO_BEM: b.atualizadoLei14973 ? "1" : "0",
        IN_BEM_USUFRUTO: b.usufruto ? 1n : 0n,
      };
      const nome = b.pais === "105" ? nomeMunicipio(im?.municipio) : undefined;
      if (nome) v.NM_MUNICIP = nome;
      ctx.adicionar("27", v, ["NR_CHAVE_BEM"]);
      for (const ni of b.proprietariosUsufrutuarios) {
        ctx.adicionar(
          "36",
          {
            NR_CHAVE_BEM: BigInt(chave),
            NR_CPF_CNPJ: ni,
            CD_GRUPO_BEM: b.grupo,
            CD_BEM: BigInt(b.codigo),
          },
          ["NR_CHAVE_BEM", "NR_CPF_CNPJ"],
        );
      }
      for (const p of b.partilha) {
        const herdeiro = ctx.chaveHerdeiro(p.niHerdeiro);
        if (herdeiro === undefined) {
          ctx.aviso(
            `Bem ${i + 1}: partilha para herdeiro não cadastrado na ficha Herdeiros; gravada sem vínculo.`,
          );
        }
        ctx.adicionar(
          "59",
          {
            NR_CHAVE_BEM: BigInt(chave),
            NR_CHAVE_HERDEIRO: herdeiro ?? 0n,
            VR_PERCENTUAL: BigInt(p.percentualCentesimos),
          },
          ["NR_CHAVE_BEM", "NR_CHAVE_HERDEIRO"],
        );
      }
    });

    dec.dividas.forEach((d, i) => {
      if (d.niCredor) {
        ctx.aviso(
          `Dívida ${i + 1}: o CPF/CNPJ do credor não tem campo próprio no arquivo; mantenha-o na discriminação.`,
        );
      }
      if (d.situacaoDataPartilha !== undefined) {
        ctx.aviso(`Dívida ${i + 1}: a situação na data da partilha não tem campo no registro 28.`);
      }
      ctx.adicionar("28", {
        CD_DIV: BigInt(d.codigo),
        TX_DIV: d.discriminacao,
        VR_ANTER: d.situacaoAnterior,
        VR_ATUAL: d.situacaoAtual,
        VR_PGTO_ANUAL: d.valorPago,
      });
    });
  },
};
