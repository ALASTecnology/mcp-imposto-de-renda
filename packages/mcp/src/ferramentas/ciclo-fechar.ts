/**
 * Equivalente ao Fechar do menu Declaração. No programa oficial, fechar tira a declaração da
 * tela; aqui cada ferramenta abre, altera e grava o arquivo na mesma chamada, então o que resta
 * conferir ao terminar é se nenhuma gravação ficou na fila daquele arquivo, se o que está no
 * disco é íntegro e onde está a última cópia de segurança.
 */
import { lerArquivo, tipoArquivoPorNome, verificarControles } from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import { EXT_DECLARACAO, exigirPasta, zNomeArquivo } from "./comum.js";
import type { RegistroFerramentas } from "./tipos.js";

export function registrarFechamento(r: RegistroFerramentas): void {
  r.ferramenta(
    "fechar_declaracao",
    {
      titulo: "Fechar a declaração",
      descricao:
        "Equivalente ao Fechar do programa oficial: espera terminar qualquer gravação em andamento no arquivo (a fila de gravação do servidor), confere os controles do que ficou no disco e informa a última cópia de segurança automática. Não altera nada: o MCP Imposto de Renda grava a cada chamada, então não há o que salvar. Use ao terminar de editar, antes de abrir o arquivo no programa oficial, copiá-lo ou movê-lo.",
      entrada: { arquivo: zNomeArquivo("Arquivo .DBK ou .DEC.") },
      saida: {
        arquivo: z.string(),
        gravacaoPendente: z.boolean(),
        controlesValidos: z.boolean(),
        totalDivergencias: z.number(),
        bytes: z.number(),
        ultimaCopia: z.object({ copia: z.string(), criadaEm: z.string() }).nullable(),
        totalCopias: z.number(),
      },
    },
    async ({ arquivo }) => {
      const pasta = exigirPasta(r.ctx);
      // Entrar na fila do arquivo garante que nenhuma gravação dele está em andamento: a leitura
      // só começa quando a anterior libera a vez, e a vez é liberada ao fim desta chamada.
      const bytes = await pasta.transacao([arquivo], () => pasta.ler(arquivo, EXT_DECLARACAO));
      const lido = lerArquivo(bytes);
      const tipoArquivo = tipoArquivoPorNome(arquivo);
      const controles = verificarControles(lido.registros, tipoArquivo ? { tipoArquivo } : {});
      const copias = await pasta.listarCopias(arquivo);
      const ultima = copias[0];
      const ultimaCopia = ultima ? { copia: ultima.copia, criadaEm: ultima.criadaEm } : null;
      const texto = [
        `${arquivo}: nenhuma gravação pendente; o arquivo está gravado (${bytes.length} bytes) e livre para abrir no programa oficial, copiar ou mover.`,
        controles.valido
          ? "Controles conferem (CRC de cada linha, T9 e hash do header)."
          : `${controles.divergencias.length} divergência(s) nos controles: confira com verificar_integridade_arquivo antes de usar o arquivo.`,
        ultimaCopia
          ? `Última cópia de segurança: ${ultimaCopia.copia} (${ultimaCopia.criadaEm}), em .mcp-imposto-de-renda-backups; ${copias.length} cópia(s) deste arquivo (restaurar_copia_seguranca volta a qualquer uma).`
          : "Ainda não há cópia de segurança automática deste arquivo (ela é feita antes de cada sobrescrita).",
      ].join("\n");
      return {
        texto,
        dados: {
          arquivo,
          gravacaoPendente: false,
          controlesValidos: controles.valido,
          totalDivergencias: controles.divergencias.length,
          bytes: bytes.length,
          ultimaCopia,
          totalCopias: copias.length,
        },
      };
    },
  );
}
