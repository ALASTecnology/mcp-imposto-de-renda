/**
 * Registro central dos grupos de ferramentas. A ordem aqui é a ordem em `tools/list`.
 *
 * Novo grupo: implemente `GrupoFerramentas` (ver `tipos.ts`) e acrescente-o a `GRUPOS`.
 */
import { grupoArquivos } from "./arquivos.js";
import { grupoCalculadoras } from "./calculadoras.js";
import { grupoCalculo } from "./calculo.js";
import { grupoCiclo } from "./ciclo.js";
import { grupoDeclaracao } from "./declaracao.js";
import { grupoEdicao } from "./edicao.js";
import { grupoFichas } from "./fichas.js";
import { grupoOrientacao } from "./orientacao.js";
import { grupoSaidas } from "./saidas.js";
import { grupoTabelas } from "./tabelas.js";
import type { GrupoFerramentas } from "./tipos.js";
import { grupoValidacao } from "./validacao.js";

export const GRUPOS: readonly GrupoFerramentas[] = Object.freeze([
  grupoCalculo,
  grupoDeclaracao,
  grupoFichas,
  grupoEdicao,
  grupoCiclo,
  grupoValidacao,
  grupoTabelas,
  grupoArquivos,
  grupoSaidas,
  grupoCalculadoras,
  grupoOrientacao,
]);
