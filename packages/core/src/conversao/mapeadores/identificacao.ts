/**
 * Identificação do contribuinte e escolhas do Resumo (registro 16), Espólio (30), Final de
 * Espólio (38), Herdeiros (58), Saída Definitiva (39) e Informações do Cônjuge (29).
 */
import { buscarCodigo, listar } from "../../tabelas/index.js";
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
  type Valores,
} from "../campos.js";
import type { Mapeador } from "../contexto.js";

const TIPO_DECLARACAO = { A: "ajusteAnual", S: "saidaDefinitiva", E: "finalEspolio" } as const;
const LETRA_TIPO = { ajusteAnual: "A", saidaDefinitiva: "S", finalEspolio: "E" } as const;
const TIPO_CONTA = { "0": "corrente", "1": "poupanca", "2": "pagamento" } as const;
const CODIGO_CONTA = { corrente: "0", poupanca: "1", pagamento: "2" } as const;

function telefone(ddd: string, num: string): Objeto | undefined {
  const d = ddd.replace(/\D/g, "").slice(-2);
  const n = num.replace(/\D/g, "");
  return d.length === 2 && /^\d{8,9}$/.test(n) ? { ddd: d, numero: n } : undefined;
}

/** Nome do município pela tabela do programa (o arquivo guarda código e nome). */
export function nomeMunicipio(cod: string | undefined): string | undefined {
  return cod ? buscarCodigo("municipios", cod)?.descricao : undefined;
}

export const mapeadorIdentificacao: Mapeador = {
  nome: "identificacao",
  tipos: ["16", "29", "30", "38", "39", "58"],
  ler(ctx, saida) {
    const r16 = ctx.doTipo("16")[0];
    const ir = ctx.doTipo("IR")[0];
    const pais = texto(r16, "CD_PAIS") || "105";
    const comum = {
      logradouro: texto(r16, "NM_LOGRA"),
      numero: texto(r16, "NR_NUMERO"),
      complemento: opcional(texto(r16, "NM_COMPLEM")),
      email: opcional(texto(r16, "NM_EMAIL")),
    };
    const endereco =
      pais === "105"
        ? {
            local: "brasil",
            ...comum,
            tipoLogradouro: texto(r16, "TIP_LOGRA"),
            bairro: texto(r16, "NM_BAIRRO"),
            uf: texto(r16, "SG_UF"),
            municipio: codigo(numero(r16, "CD_MUNICIP"), 4),
            cep: texto(r16, "NR_CEP").replace(/\D/g, ""),
            telefone: telefone(texto(r16, "NR_DDD_TELEFONE"), texto(r16, "NR_TELEFONE")),
            celular: telefone(texto(r16, "NR_DDD_CELULAR"), texto(r16, "NR_CELULAR")),
          }
        : {
            local: "exterior",
            ...comum,
            cpfProcurador: digitos(texto(r16, "NR_CPF_PROCURADOR"), [11]),
            bairro: opcional(texto(r16, "NM_BAIRRO")),
            pais,
            codigoExterior: opcional(texto(r16, "CD_EX")),
            cidade: texto(r16, "NM_MUNICIP"),
            codigoPostal: opcional(texto(r16, "NR_CEP")),
            telefone: opcional(
              (texto(r16, "NR_DDD_TELEFONE") + texto(r16, "NR_TELEFONE")).replace(/\D/g, ""),
            ),
          };
    const recibo = texto(r16, "NR_CONTROLE_ORIGINAL");
    const prejuizo = numero(r16, "VR_PREJUIZO_ANO_ANTERIOR_LEI_14754");
    const raca = r16?.campos.IN_RACA_COR;
    saida.identificacao = semIndefinidos({
      cpf: ctx.cpfTitular,
      nome: texto(r16, "NM_NOME") || texto(ir, "NM_NOME"),
      dataNascimento:
        isoDeDdmmaaaa(texto(r16, "DT_NASCIM")) ?? isoDeDdmmaaaa(texto(ir, "DT_NASCIM")),
      tipoDeclaracao: semIndefinidos({
        tipo:
          TIPO_DECLARACAO[texto(r16, "IN_TIPODECLARACAO") as keyof typeof TIPO_DECLARACAO] ??
          "ajusteAnual",
        retificadora: texto(r16, "IN_RETIFICADORA") === "S",
        reciboRetificada: /^\d{12}$/.test(recibo) ? recibo : undefined,
      }),
      doencaGraveOuDeficiencia: texto(r16, "IN_DOENCA_DEFICIENCIA") === "S",
      racaCor: typeof raca === "bigint" ? raca.toString() : "0",
      alteracaoCadastral: texto(r16, "IN_ENDERECO") === "S",
      conjuge: semIndefinidos({
        possui: texto(r16, "IN_CONJUGE") === "S",
        cpf: digitos(texto(r16, "NR_CPF_CONJUGE"), [11]),
      }),
      retornoAoPais: semIndefinidos({
        retornou: texto(r16, "IN_RETORNO_PAIS") === "1",
        data: isoDeDdmmaaaa(texto(r16, "DT_RETORNO_PAIS")),
      }),
      endereco: semIndefinidos(endereco),
      ocupacao: semIndefinidos({
        natureza: codigo(texto(r16, "CD_NATUR") || "0", 2),
        ocupacaoPrincipal: opcional(texto(r16, "CD_OCUP")),
        registroProfissional: opcional(texto(r16, "NR_REGISTRO_PROFISSIONAL")),
      }),
      nitPisPasep: digitos(texto(r16, "NR_NITPISPASEP"), [11]),
      processoAtualizacaoBemLei14973: opcional(texto(r16, "NR_PROCESSO_ATUALIZACAO_BEM")),
      prejuizoAnteriorLei14754: prejuizo > 0n ? prejuizo : undefined,
    });

    // Escolhas do Resumo guardadas no registro 16.
    const banco = numero(r16, "NR_BANCO");
    const contaNum = texto(r16, "NR_CONTA").replace(/\D/g, "");
    const dv = texto(r16, "NR_DV_CONTA");
    const debito = texto(r16, "IN_DEBITO_AUTOM") === "S";
    let conta: Objeto | undefined;
    if (banco > 0n && contaNum !== "") {
      if (dv === "") ctx.aviso("Conta bancária do Resumo sem dígito verificador: não foi lida.");
      else
        conta = {
          banco: codigo(banco, 3),
          agencia: numero(r16, "NR_AGENCIA").toString(),
          conta: contaNum,
          dv,
          tipo: TIPO_CONTA[texto(r16, "IN_TIPO_CONTA") as keyof typeof TIPO_CONTA] ?? "corrente",
        };
    }
    const quotas = Number(numero(r16, "NR_QUOTAS"));
    saida.resumo = semIndefinidos({
      opcaoTributacao:
        texto(r16, "IN_COMPLETA") === "S" ? "deducoesLegais" : "descontoSimplificado",
      quotas: quotas >= 1 && quotas <= 8 ? quotas : 1,
      debitoAutomatico: debito,
      debitoPrimeiraQuota: debito ? numero(r16, "IN_DEBITO_PRIMEIRA_QUOTA") === 1n : true,
      conta,
    });

    // Espólio no ajuste anual (natureza 81).
    const r30 = ctx.doTipo("30")[0];
    if (r30) {
      saida.espolio = {
        sobrepartilha: texto(r30, "IN_SOBREPARTILHA") === "1",
        inventariante: { cpf: texto(r30, "NR_INVENT"), nome: texto(r30, "NM_INVENT") },
      };
    }

    // Final de Espólio.
    const r38 = ctx.doTipo("38")[0];
    if (r38) {
      const status = texto(r38, "IN_STATUS_SOBREPARTILHA");
      const processo = texto(r38, "IN_TIPO_PROCESSO");
      const ambos = texto(r38, "IN_MORTEAMBOSCONJUGES") === "1";
      const temConjuge = ambos || texto(r38, "IN_MEEIRO") !== "" || texto(r38, "NM_CONJUGE") !== "";
      saida.finalEspolio = semIndefinidos({
        anoObito: Number(numero(r38, "NR_ANOOBITO")),
        modalidade:
          status === "1" ? "sobrepartilha" : status === "2" ? "partilhaESobrepartilha" : "partilha",
        aindaHaBensAInventariar: texto(r38, "IN_BENS_INVENTARIAR") === "1",
        tipoInventario:
          processo === "J" ? "decisaoJudicial" : processo === "C" ? "escrituraPublica" : undefined,
        decisaoJudicial:
          processo === "J"
            ? semIndefinidos({
                numeroProcesso: texto(r38, "NR_PROCESSO_JUDICIAL"),
                varaCivil: texto(r38, "NR_VARACIVIL"),
                comarca: texto(r38, "NM_COMARCA"),
                uf: texto(r38, "SG_UFCOMARCA"),
                dataDecisao: isoDeDdmmaaaa(texto(r38, "DT_DECJUDICIALPARTILHA")),
                dataTransitoJulgado: isoDeDdmmaaaa(texto(r38, "DT_TRANSITOJULGADO")),
              })
            : undefined,
        escrituraPublica:
          processo === "C"
            ? semIndefinidos({
                cnpjCartorio: texto(r38, "NR_CNPJ_CARTORIO"),
                nomeCartorio: texto(r38, "NM_CARTORIO"),
                livro: texto(r38, "NM_LIVRO"),
                folhas: texto(r38, "NM_FOLHA"),
                uf: texto(r38, "SG_UFCARTORIO"),
                municipio: municipioPorNome(
                  texto(r38, "NM_MUNICIPIO"),
                  texto(r38, "SG_UFCARTORIO"),
                ),
                dataLavratura: isoDeDdmmaaaa(texto(r38, "DT_LAVRATURA")),
              })
            : undefined,
        inventariante: { cpf: texto(r38, "NR_INVENT"), nome: texto(r38, "NM_INVENT") },
        conjuge: !temConjuge
          ? undefined
          : ambos
            ? semIndefinidos({
                obitoAmbos: true,
                inventarioConjunto: texto(r38, "IN_INVENTARIOCONJUNTO") === "1",
                nomeOutroConjuge: opcional(texto(r38, "NM_CONJUGE")),
              })
            : { obitoAmbos: false, meeiro: texto(r38, "IN_MEEIRO") === "1" },
      });
    }
    saida.herdeiros = ctx
      .doTipo("58")
      .map((r) => ({ ni: texto(r, "NR_CPF_CNPJ"), nome: texto(r, "NM_NOME") }));

    const r39 = ctx.doTipo("39")[0];
    if (r39) {
      const procurador = texto(r39, "NR_PROCURADOR");
      saida.saidaDefinitiva = semIndefinidos({
        procurador:
          procurador === ""
            ? undefined
            : semIndefinidos({
                cpf: procurador,
                nome: texto(r39, "NM_PROCURADOR"),
                endereco: opcional(texto(r39, "NM_END_PROCURADOR")),
              }),
        dataCondicaoNaoResidente: isoDeDdmmaaaa(texto(r39, "DT_NAORESIDENTE")),
        dataCondicaoResidente: isoDeDdmmaaaa(texto(r39, "DT_RESIDENTE")),
        paisDestino: codigo(numero(r39, "CD_NOVO_PAIS_RESIDENCIA"), 3),
      });
    }

    const r29 = ctx.doTipo("29")[0];
    if (r29) {
      saida.informacoesConjuge = {
        cpf: texto(r29, "NR_CONJ"),
        baseCalculo: numero(r29, "VR_BASE"),
        impostoPago: numero(r29, "VR_IMPOSTO"),
        rendimentosIsentos: numero(r29, "VR_ISENTO"),
        rendimentosExclusivos: numero(r29, "VR_EXCLUSIVO"),
        rendimentosExigibilidadeSuspensa: numero(r29, "VR_RENDPJ_EXIB_SUSP"),
        total: numero(r29, "VR_TOTALCONJ"),
        entregouDeclaracao: indicador(r29, "IN_ENTREGOU"),
      };
    }
  },

  gravar(ctx, dec) {
    const id = dec.identificacao;
    const e = id.endereco;
    const r = dec.resumo;
    if (id.tipoDeclaracao.reciboExercicioAnterior) {
      ctx.aviso(
        "O recibo da declaração do exercício anterior não é gravado: o campo do registro 16 tem 10 posições e o recibo, 12.",
      );
    }
    if (r.pix) {
      ctx.aviso(
        "A opção de restituição por Pix não tem campo no arquivo: confirme-a no Resumo do programa oficial.",
      );
    }
    if (r.conta?.operacao) {
      ctx.aviso(
        "A operação da conta (Caixa) não tem campo no arquivo: confirme-a no programa oficial.",
      );
    }
    const v: Valores = {
      NM_NOME: id.nome,
      DT_NASCIM: ddmmaaaaDeIso(id.dataNascimento),
      IN_TIPODECLARACAO: LETRA_TIPO[id.tipoDeclaracao.tipo],
      IN_RETIFICADORA: id.tipoDeclaracao.retificadora ? "S" : "N",
      NR_CONTROLE_ORIGINAL: id.tipoDeclaracao.reciboRetificada ?? "",
      IN_DOENCA_DEFICIENCIA: id.doencaGraveOuDeficiencia ? "S" : "N",
      IN_RACA_COR: BigInt(id.racaCor),
      IN_ENDERECO: id.alteracaoCadastral ? "S" : "N",
      IN_CONJUGE: id.conjuge.possui ? "S" : "N",
      NR_CPF_CONJUGE: id.conjuge.cpf ?? "",
      IN_RETORNO_PAIS: id.retornoAoPais.retornou ? "1" : "0",
      DT_RETORNO_PAIS: ddmmaaaaDeIso(id.retornoAoPais.data) ?? "",
      CD_NATUR: id.ocupacao.natureza,
      CD_OCUP: id.ocupacao.ocupacaoPrincipal ?? "",
      NR_REGISTRO_PROFISSIONAL: id.ocupacao.registroProfissional ?? "",
      NR_NITPISPASEP: id.nitPisPasep ?? "",
      NR_PROCESSO_ATUALIZACAO_BEM: id.processoAtualizacaoBemLei14973 ?? "",
      VR_PREJUIZO_ANO_ANTERIOR_LEI_14754: id.prejuizoAnteriorLei14754 ?? 0n,
      NM_LOGRA: e.logradouro,
      NR_NUMERO: e.numero,
      NM_COMPLEM: e.complemento ?? "",
      NM_EMAIL: e.email ?? "",
      // Resumo.
      IN_COMPLETA: r.opcaoTributacao === "deducoesLegais" ? "S" : "N",
      NR_QUOTAS: ctx.saldoAPagar > 0n ? BigInt(r.quotas) : 0n,
      IN_DEBITO_AUTOM: r.debitoAutomatico ? "S" : "N",
      IN_DEBITO_PRIMEIRA_QUOTA: r.debitoAutomatico && r.debitoPrimeiraQuota ? 1n : 0n,
      NR_BANCO: r.conta ? BigInt(r.conta.banco) : 0n,
      NR_AGENCIA: r.conta ? BigInt(r.conta.agencia) : 0n,
      NR_CONTA: r.conta?.conta ?? "",
      NR_DV_CONTA: r.conta?.dv ?? "",
      IN_TIPO_CONTA: r.conta ? CODIGO_CONTA[r.conta.tipo] : "0",
    };
    if (e.local === "brasil") {
      Object.assign(v, {
        TIP_LOGRA: e.tipoLogradouro,
        NM_BAIRRO: e.bairro,
        SG_UF: e.uf,
        CD_MUNICIP: e.municipio,
        NR_CEP: e.cep,
        CD_PAIS: "105",
        CD_EX: "",
        NR_CPF_PROCURADOR: "",
        NR_DDD_TELEFONE: e.telefone?.ddd ?? "",
        NR_TELEFONE: e.telefone?.numero ?? "",
        NR_DDD_CELULAR: e.celular?.ddd ?? "",
        NR_CELULAR: e.celular?.numero ?? "",
      });
      const nome = nomeMunicipio(e.municipio);
      if (nome) v.NM_MUNICIP = nome;
    } else {
      Object.assign(v, {
        TIP_LOGRA: "",
        NM_BAIRRO: e.bairro ?? "",
        SG_UF: "EX",
        CD_MUNICIP: null,
        NM_MUNICIP: e.cidade,
        NR_CEP: e.codigoPostal ?? "",
        CD_PAIS: e.pais,
        CD_EX: e.codigoExterior ?? "",
        NR_CPF_PROCURADOR: e.cpfProcurador ?? "",
        NR_DDD_TELEFONE: "",
        NR_TELEFONE: e.telefone ?? "",
        NR_DDD_CELULAR: "",
        NR_CELULAR: "",
      });
    }
    // Maior fonte pagadora PJ do titular.
    const fontes = new Map<string, bigint>();
    for (const p of dec.rendimentosPJ) {
      if (p.beneficiario.tipo !== "titular") continue;
      fontes.set(p.fonte.ni, (fontes.get(p.fonte.ni) ?? 0n) + p.rendimentos);
    }
    let principal = "";
    let maior = -1n;
    for (const [ni, valor] of fontes) {
      if (valor > maior) {
        principal = ni;
        maior = valor;
      }
    }
    v.NR_FONTE_PRINCIPAL = principal;
    if (ctx.baseDoTipo("16").length === 0) {
      // Arquivo novo: valores iniciais do programa (1º dia útil depois do prazo de entrega).
      Object.assign(v, { IN_GERADO: "S", IN_PREPREENCHIDA: "0", DT_DIA_UTIL_RECIBO: "01062026" });
    }
    ctx.adicionar("16", v);

    if (dec.espolio) {
      ctx.adicionar("30", {
        NR_INVENT: dec.espolio.inventariante.cpf,
        NM_INVENT: dec.espolio.inventariante.nome,
        IN_SOBREPARTILHA: dec.espolio.sobrepartilha ? "1" : "0",
      });
    }

    const fe = dec.finalEspolio;
    if (fe) {
      const dj = fe.decisaoJudicial;
      const ep = fe.escrituraPublica;
      const cj = fe.conjuge;
      ctx.adicionar("38", {
        NR_ANOOBITO: BigInt(fe.anoObito),
        NR_INVENT: fe.inventariante.cpf,
        NM_INVENT: fe.inventariante.nome,
        IN_SOBREPARTILHA: fe.modalidade === "partilha" ? "0" : "1",
        IN_STATUS_SOBREPARTILHA: { partilha: "0", sobrepartilha: "1", partilhaESobrepartilha: "2" }[
          fe.modalidade
        ],
        IN_TIPO_PROCESSO:
          fe.tipoInventario === "decisaoJudicial"
            ? "J"
            : fe.tipoInventario === "escrituraPublica"
              ? "C"
              : "",
        NR_PROCESSO_JUDICIAL: dj?.numeroProcesso ?? "",
        NR_VARACIVIL: dj?.varaCivil ?? "",
        NM_COMARCA: dj?.comarca ?? "",
        DT_DECJUDICIALPARTILHA: ddmmaaaaDeIso(dj?.dataDecisao),
        DT_TRANSITOJULGADO: ddmmaaaaDeIso(dj?.dataTransitoJulgado),
        SG_UFCOMARCA: dj?.uf ?? "",
        NR_CNPJ_CARTORIO: ep?.cnpjCartorio ?? "",
        NM_CARTORIO: ep?.nomeCartorio ?? "",
        NM_LIVRO: ep?.livro ?? "",
        NM_FOLHA: ep?.folhas ?? "",
        NM_MUNICIPIO: nomeMunicipio(ep?.municipio) ?? "",
        SG_UFCARTORIO: ep?.uf ?? "",
        DT_LAVRATURA: ddmmaaaaDeIso(ep?.dataLavratura),
        IN_MORTEAMBOSCONJUGES: cj?.obitoAmbos ? "1" : "0",
        NM_CONJUGE: cj?.obitoAmbos ? (cj.nomeOutroConjuge ?? "") : "",
        IN_BENS_INVENTARIAR: fe.aindaHaBensAInventariar ? "1" : "0",
        IN_MEEIRO: cj && !cj.obitoAmbos && cj.meeiro ? "1" : "0",
        IN_INVENTARIOCONJUNTO: cj?.obitoAmbos && cj.inventarioConjunto ? "1" : "0",
      });
      if (cj?.obitoAmbos && cj.cpfOutroConjuge) {
        ctx.aviso(
          "O CPF do outro cônjuge da Final de Espólio fica no registro 16 (CPF do cônjuge) no programa oficial; confira-o.",
        );
      }
    }

    dec.herdeiros.forEach((h, i) => {
      ctx.adicionar(
        "58",
        { NR_CHAVE_HERDEIRO: BigInt(i + 1), NM_NOME: h.nome, NR_CPF_CNPJ: h.ni },
        ["NR_CPF_CNPJ"],
      );
    });

    const sd = dec.saidaDefinitiva;
    if (sd) {
      ctx.adicionar("39", {
        NR_PROCURADOR: sd.procurador?.cpf ?? "",
        NM_PROCURADOR: sd.procurador?.nome ?? "",
        NM_END_PROCURADOR: sd.procurador?.endereco ?? "",
        DT_NAORESIDENTE: ddmmaaaaDeIso(sd.dataCondicaoNaoResidente),
        DT_RESIDENTE: ddmmaaaaDeIso(sd.dataCondicaoResidente),
        CD_NOVO_PAIS_RESIDENCIA: BigInt(sd.paisDestino),
      });
    }

    const ic = dec.informacoesConjuge;
    if (ic) {
      if (ctx.baseDoTipo("29").length > 0) {
        ctx.adicionar("29", {
          NR_CONJ: ic.cpf,
          VR_BASE: ic.baseCalculo,
          VR_IMPOSTO: ic.impostoPago,
          VR_ISENTO: ic.rendimentosIsentos,
          VR_EXCLUSIVO: ic.rendimentosExclusivos,
          VR_RENDPJ_EXIB_SUSP: ic.rendimentosExigibilidadeSuspensa,
          VR_TOTALCONJ: ic.total,
          IN_ENTREGOU: ic.entregouDeclaracao ? "S" : "N",
        });
      } else {
        ctx.aviso(
          "Informações do Cônjuge não são gravadas: o arquivo de 2026 não tem mais o registro 29 (o T9 não o conta).",
        );
      }
    }
  },
};

/** Código do município pelo nome e UF (o registro 38 guarda só o nome). */
let porNome: Map<string, string> | undefined;
function municipioPorNome(nome: string, uf: string): string | undefined {
  if (nome === "") return undefined;
  porNome ??= new Map(listar("municipios").map((m) => [`${m.uf}|${m.descricao}`, m.codigo]));
  return porNome.get(`${uf}|${nome.toUpperCase()}`);
}
