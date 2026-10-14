/**
 * Dados brutos das tabelas de códigos do exercício 2026.
 *
 * A fonte única é `docs/mapeamento/tabelas/*.json` (ver o README daquela pasta
 * para a origem de cada tabela). Os arquivos são importados como módulos JSON,
 * de modo que o tsup os embute no pacote e não há cópia duplicada no código.
 */
import aliquotasParametros from "../../../../docs/mapeamento/tabelas/aliquotas-parametros.json" with {
  type: "json",
};
import altcoins from "../../../../docs/mapeamento/tabelas/altcoins.json" with { type: "json" };
import atividadeRuralBens from "../../../../docs/mapeamento/tabelas/atividade-rural-bens.json" with {
  type: "json",
};
import atividadeRuralCondicoes from "../../../../docs/mapeamento/tabelas/atividade-rural-condicoes-exploracao.json" with {
  type: "json",
};
import atividadeRuralTipos from "../../../../docs/mapeamento/tabelas/atividade-rural-tipos.json" with {
  type: "json",
};
import bancos from "../../../../docs/mapeamento/tabelas/bancos.json" with { type: "json" };
import bancosBens from "../../../../docs/mapeamento/tabelas/bancos-bens.json" with { type: "json" };
import bancosCalculoDv from "../../../../docs/mapeamento/tabelas/bancos-calculo-dv.json" with {
  type: "json",
};
import bensDireitos from "../../../../docs/mapeamento/tabelas/bens-direitos.json" with {
  type: "json",
};
import datasPrazos from "../../../../docs/mapeamento/tabelas/datas-prazos.json" with {
  type: "json",
};
import dependentes from "../../../../docs/mapeamento/tabelas/dependentes.json" with {
  type: "json",
};
import dividasOnus from "../../../../docs/mapeamento/tabelas/dividas-onus.json" with {
  type: "json",
};
import fundosEca from "../../../../docs/mapeamento/tabelas/fundos-eca.json" with { type: "json" };
import fundosIdoso from "../../../../docs/mapeamento/tabelas/fundos-idoso.json" with {
  type: "json",
};
import moedas from "../../../../docs/mapeamento/tabelas/moedas.json" with { type: "json" };
import municipios from "../../../../docs/mapeamento/tabelas/municipios.json" with { type: "json" };
import municipiosCalamidade from "../../../../docs/mapeamento/tabelas/municipios-calamidade.json" with {
  type: "json",
};
import naturezasOcupacao from "../../../../docs/mapeamento/tabelas/naturezas-ocupacao.json" with {
  type: "json",
};
import ocupacoesPrincipais from "../../../../docs/mapeamento/tabelas/ocupacoes-principais.json" with {
  type: "json",
};
import pagamentos from "../../../../docs/mapeamento/tabelas/pagamentos.json" with { type: "json" };
import paises from "../../../../docs/mapeamento/tabelas/paises.json" with { type: "json" };
import paisesGcap from "../../../../docs/mapeamento/tabelas/paises-gcap.json" with { type: "json" };
import racaCor from "../../../../docs/mapeamento/tabelas/raca-cor.json" with { type: "json" };
import rendimentosIsentos from "../../../../docs/mapeamento/tabelas/rendimentos-isentos.json" with {
  type: "json",
};
import rendimentosExclusivos from "../../../../docs/mapeamento/tabelas/rendimentos-tributacao-exclusiva.json" with {
  type: "json",
};
import representacoesDiplomaticas from "../../../../docs/mapeamento/tabelas/representacoes-diplomaticas.json" with {
  type: "json",
};
import stablecoins from "../../../../docs/mapeamento/tabelas/stablecoins.json" with {
  type: "json",
};
import tiposConta from "../../../../docs/mapeamento/tabelas/tipos-conta.json" with { type: "json" };
import tiposLogradouro from "../../../../docs/mapeamento/tabelas/tipos-logradouro.json" with {
  type: "json",
};
import tiposRendimentos from "../../../../docs/mapeamento/tabelas/tipos-rendimentos.json" with {
  type: "json",
};
import ufs from "../../../../docs/mapeamento/tabelas/ufs.json" with { type: "json" };
import type {
  EntradaBanco,
  EntradaBancoDv,
  EntradaBemDireito,
  EntradaFundo,
  EntradaMunicipio,
  EntradaPais,
  EntradaPaisGcap,
  EntradaParametro,
  EntradaRepresentacao,
  EntradaTabela,
} from "./tipos.js";

/** Mapa do nome público de cada tabela para o tipo das suas entradas. */
export interface MapaTabelas {
  "aliquotas-parametros": EntradaParametro;
  altcoins: EntradaTabela;
  "atividade-rural-bens": EntradaTabela;
  "atividade-rural-condicoes-exploracao": EntradaTabela;
  "atividade-rural-tipos": EntradaTabela;
  bancos: EntradaBanco;
  "bancos-bens": EntradaBanco;
  "bancos-calculo-dv": EntradaBancoDv;
  "bens-direitos": EntradaBemDireito;
  "datas-prazos": EntradaTabela;
  dependentes: EntradaTabela;
  "dividas-onus": EntradaTabela;
  "fundos-eca": EntradaFundo;
  "fundos-idoso": EntradaFundo;
  moedas: EntradaTabela;
  municipios: EntradaMunicipio;
  "municipios-calamidade": EntradaMunicipio;
  "naturezas-ocupacao": EntradaTabela;
  "ocupacoes-principais": EntradaTabela;
  pagamentos: EntradaTabela;
  paises: EntradaPais;
  "paises-gcap": EntradaPaisGcap;
  "raca-cor": EntradaTabela;
  "rendimentos-isentos": EntradaTabela;
  "rendimentos-tributacao-exclusiva": EntradaTabela;
  "representacoes-diplomaticas": EntradaRepresentacao;
  stablecoins: EntradaTabela;
  "tipos-conta": EntradaTabela;
  "tipos-logradouro": EntradaTabela;
  "tipos-rendimentos": EntradaTabela;
  ufs: EntradaTabela;
}

/** Nome de uma tabela de códigos (igual ao nome do arquivo JSON, sem extensão). */
export type NomeTabela = keyof MapaTabelas;

type Dados = { readonly [N in NomeTabela]: readonly MapaTabelas[N][] };

/**
 * Conteúdo de cada tabela. As anotações de tipo garantem, na compilação, que o
 * JSON tem ao menos os campos declarados em `tipos.ts`.
 */
export const DADOS: Dados = {
  "aliquotas-parametros": aliquotasParametros,
  altcoins,
  "atividade-rural-bens": atividadeRuralBens,
  "atividade-rural-condicoes-exploracao": atividadeRuralCondicoes,
  "atividade-rural-tipos": atividadeRuralTipos,
  bancos,
  "bancos-bens": bancosBens,
  "bancos-calculo-dv": bancosCalculoDv,
  "bens-direitos": bensDireitos,
  "datas-prazos": datasPrazos,
  dependentes,
  "dividas-onus": dividasOnus,
  "fundos-eca": fundosEca,
  "fundos-idoso": fundosIdoso,
  moedas,
  municipios,
  "municipios-calamidade": municipiosCalamidade,
  "naturezas-ocupacao": naturezasOcupacao,
  "ocupacoes-principais": ocupacoesPrincipais,
  pagamentos,
  paises,
  "paises-gcap": paisesGcap,
  "raca-cor": racaCor,
  "rendimentos-isentos": rendimentosIsentos,
  "rendimentos-tributacao-exclusiva": rendimentosExclusivos,
  "representacoes-diplomaticas": representacoesDiplomaticas,
  stablecoins,
  "tipos-conta": tiposConta,
  "tipos-logradouro": tiposLogradouro,
  "tipos-rendimentos": tiposRendimentos,
  ufs,
};
