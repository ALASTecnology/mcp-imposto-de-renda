/**
 * Grupo "arquivos": listagem da pasta autorizada e conferência dos controles do DBK/DEC.
 */
import { verificarControles } from "@autoir/core";
import { z } from "zod";
import { EXT_LISTAGEM, exigirPasta, lerDeclaracaoArquivo, zNomeArquivo } from "./comum.js";
import type { GrupoFerramentas } from "./tipos.js";

const MAX_DIVERGENCIAS = 50;

export const grupoArquivos: GrupoFerramentas = {
  nome: "arquivos",
  descricao: "Arquivos da pasta autorizada.",
  exigePasta: true,
  registrar(r) {
    r.ferramenta(
      "listar_arquivos",
      {
        titulo: "Listar arquivos da pasta autorizada",
        descricao:
          "Lista os arquivos .DBK, .DEC, .json e .txt da pasta autorizada (sem subpastas, ocultos ou links).",
        entrada: {},
        saida: {
          arquivos: z.array(
            z.object({ nome: z.string(), tamanho: z.number(), modificadoEm: z.string() }),
          ),
        },
      },
      async () => {
        const arquivos = await exigirPasta(r.ctx).listar(EXT_LISTAGEM);
        return {
          texto:
            arquivos.length === 0
              ? "Nenhum arquivo de declaração na pasta autorizada."
              : arquivos
                  .map((a) => `- ${a.nome} (${a.tamanho} bytes, ${a.modificadoEm})`)
                  .join("\n"),
          dados: { arquivos: arquivos.map((a) => ({ ...a })) },
        };
      },
    );

    r.ferramenta(
      "verificar_integridade_arquivo",
      {
        titulo: "Verificar integridade do DBK/DEC",
        descricao:
          "Confere os controles do arquivo: número de controle (CRC-32) de cada registro, " +
          "contagens do registro T9 e hash do header. Divergência indica arquivo editado fora do programa ou corrompido.",
        entrada: { arquivo: zNomeArquivo("Arquivo .DBK ou .DEC.") },
        saida: {
          arquivo: z.string(),
          exercicio: z.number(),
          valido: z.boolean(),
          registros: z.number(),
          totalDivergencias: z.number(),
          divergencias: z.array(
            z.object({
              linha: z.number(),
              tipo: z.string(),
              campo: z.string(),
              esperado: z.string(),
              encontrado: z.string(),
            }),
          ),
          variantesHashQueConferem: z.array(z.string()),
          variantesTotalQueConferem: z.array(z.string()),
          controleHeaderConfereComCrc: z.boolean().nullable(),
        },
      },
      async ({ arquivo }) => {
        const { registros, exercicio } = await lerDeclaracaoArquivo(r.ctx, arquivo);
        const rel = verificarControles(registros);
        const divergencias = rel.divergencias.slice(0, MAX_DIVERGENCIAS).map((d) => ({ ...d }));
        const texto = rel.valido
          ? `${arquivo}: controles conferem (${registros.length} registros, CRC de cada linha, T9 e hash do header).`
          : [
              `${arquivo}: ${rel.divergencias.length} divergência(s) nos controles.`,
              ...divergencias.map(
                (d) =>
                  `- linha ${d.linha}, registro ${d.tipo}, campo ${d.campo}: esperado ${d.esperado}, gravado ${d.encontrado}`,
              ),
              "Se o arquivo foi alterado fora do programa oficial, regrave-o com converter_modelo_para_dbk ou abra-o no programa oficial.",
            ].join("\n");
        return {
          texto,
          dados: {
            arquivo,
            exercicio,
            valido: rel.valido,
            registros: registros.length,
            totalDivergencias: rel.divergencias.length,
            divergencias,
            variantesHashQueConferem: [...rel.variantesHashQueConferem],
            variantesTotalQueConferem: [...rel.variantesTotalQueConferem],
            controleHeaderConfereComCrc: rel.controleHeaderConfereComCrc ?? null,
          },
        };
      },
    );
  },
};
