/**
 * Dependentes (registro 25) e Alimentandos (registro 35).
 */
import {
  codigo,
  codigoOpcional,
  ddmmaaaaDeIso,
  digitos,
  isoDeDdmmaaaa,
  type Objeto,
  opcional,
  semIndefinidos,
  texto,
} from "../campos.js";
import type { Mapeador } from "../contexto.js";
import { nomeMunicipio } from "./identificacao.js";

function telefone(ddd: string, num: string): Objeto | undefined {
  const d = ddd.replace(/\D/g, "");
  const n = num.replace(/\D/g, "");
  return d.length === 2 && /^\d{8,9}$/.test(n) ? { ddd: d, numero: n } : undefined;
}

export const mapeadorPessoas: Mapeador = {
  nome: "pessoas",
  tipos: ["25", "35"],
  ler(ctx, saida) {
    saida.dependentes = ctx.doTipo("25").map((r) => {
      const raca = r.campos.IN_RACA_COR;
      const saidaPais = texto(r, "IN_SAIDA");
      return semIndefinidos({
        codigo: codigo(texto(r, "CD_DEPEND"), 2),
        nome: texto(r, "NM_DEPEND"),
        cpf: texto(r, "NI_DEPEND"),
        dataNascimento: isoDeDdmmaaaa(texto(r, "DT_NASCIM")),
        racaCor: typeof raca === "bigint" ? raca.toString() : undefined,
        moraComTitular: texto(r, "IN_ENDERECO_TITULAR") !== "0",
        celular: telefone(texto(r, "NR_DDD_CELULAR"), texto(r, "NR_CELULAR")),
        email: opcional(texto(r, "NM_EMAIL")),
        nitPisPasep: digitos(texto(r, "NR_NITPISPASEP"), [11]),
        saiuDoPaisComDeclarante: saidaPais === "" ? undefined : saidaPais === "1",
      });
    });

    saida.alimentandos = ctx.doTipo("35").map((r) => {
      const vinculado = texto(r, "NR_CPF_VINCULADO");
      const processo = texto(r, "IN_TIPO_PROCESSO");
      const judicial = processo === "J" || processo === "A";
      const cartorio = processo === "C" || processo === "A";
      return semIndefinidos({
        residencia: texto(r, "INDICADOR_RESIDENC") === "1" ? "exterior" : "brasil",
        nome: texto(r, "NM_NOME"),
        cpf: texto(r, "NI_ALIMENTANDO"),
        dataNascimento: isoDeDdmmaaaa(texto(r, "DT_NASCIM")),
        vinculo:
          vinculado === "" || vinculado === ctx.cpfTitular
            ? { tipo: "titular" }
            : { tipo: "dependente", cpf: vinculado },
        tipoProcesso:
          cartorio && judicial ? "ambos" : cartorio ? "escrituraPublica" : "decisaoJudicial",
        decisaoJudicial: judicial
          ? semIndefinidos({
              numeroProcesso: texto(r, "NR_PROCESSOJUDICIAL"),
              varaCivil: texto(r, "NR_IDENTIFICACAOVARACIVIL"),
              comarca: texto(r, "NM_COMARCA"),
              uf: texto(r, "SG_UFCOMARCA"),
              dataDecisao: isoDeDdmmaaaa(texto(r, "DT_DECJUDICIAL")),
            })
          : undefined,
        escrituraPublica: cartorio
          ? semIndefinidos({
              cnpjCartorio: texto(r, "NR_CNPJ_CARTORIO"),
              nomeCartorio: texto(r, "NM_CARTORIO"),
              livro: texto(r, "NM_LIVRO"),
              folhas: texto(r, "NM_FOLHA"),
              uf: texto(r, "SG_UFCARTORIO"),
              municipio: codigoOpcional(r, "CD_MUNICIP", 4),
              dataLavratura: isoDeDdmmaaaa(texto(r, "DT_LAVRATURA")),
            })
          : undefined,
      });
    });
  },

  gravar(ctx, dec) {
    dec.dependentes.forEach((d, i) => {
      ctx.adicionar(
        "25",
        {
          NR_CHAVE: BigInt(i + 1),
          CD_DEPEND: d.codigo,
          NM_DEPEND: d.nome,
          DT_NASCIM: ddmmaaaaDeIso(d.dataNascimento),
          NI_DEPEND: d.cpf,
          IN_SAIDA:
            d.saiuDoPaisComDeclarante === undefined ? "" : d.saiuDoPaisComDeclarante ? "1" : "0",
          NR_NITPISPASEP: d.nitPisPasep ?? "",
          IN_ENDERECO_TITULAR: d.moraComTitular ? "1" : "0",
          NM_EMAIL: d.email ?? "",
          NR_DDD_CELULAR: d.celular?.ddd ?? "",
          NR_CELULAR: d.celular?.numero ?? "",
          IN_RACA_COR: d.racaCor === undefined ? null : BigInt(d.racaCor),
        },
        ["NI_DEPEND"],
      );
    });

    dec.alimentandos.forEach((a, i) => {
      const dj = a.decisaoJudicial;
      const ep = a.escrituraPublica;
      ctx.adicionar(
        "35",
        {
          INDICADOR_RESIDENC: a.residencia === "exterior" ? 1n : 0n,
          NR_CHAVE: BigInt(i + 1),
          NM_NOME: a.nome,
          DT_NASCIM: ddmmaaaaDeIso(a.dataNascimento),
          NI_ALIMENTANDO: a.cpf,
          NR_CPF_VINCULADO: a.vinculo.tipo === "titular" ? ctx.cpfTitular : a.vinculo.cpf,
          IN_TIPO_PROCESSO: { decisaoJudicial: "J", escrituraPublica: "C", ambos: "A" }[
            a.tipoProcesso
          ],
          NR_PROCESSOJUDICIAL: dj?.numeroProcesso ?? "",
          NR_IDENTIFICACAOVARACIVIL: dj?.varaCivil ?? "",
          NM_COMARCA: dj?.comarca ?? "",
          DT_DECJUDICIAL: ddmmaaaaDeIso(dj?.dataDecisao) ?? "",
          SG_UFCOMARCA: dj?.uf ?? "",
          NR_CNPJ_CARTORIO: ep?.cnpjCartorio ?? "",
          NM_CARTORIO: ep?.nomeCartorio ?? "",
          DT_LAVRATURA: ddmmaaaaDeIso(ep?.dataLavratura) ?? "",
          NM_LIVRO: ep?.livro ?? "",
          NM_FOLHA: ep?.folhas ?? "",
          CD_MUNICIP: ep?.municipio ?? null,
          NM_MUNICIPIO: nomeMunicipio(ep?.municipio) ?? "",
          SG_UFCARTORIO: ep?.uf ?? "",
        },
        ["NI_ALIMENTANDO"],
      );
    });
  },
};
