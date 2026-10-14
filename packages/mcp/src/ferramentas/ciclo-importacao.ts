/**
 * Importações que começam uma declaração a partir de outro arquivo:
 *
 * - `importar_declaracao_anterior`: "Importar dados da Declaração de 2025" (Ajuda págs. 373,
 *   396 e 397). Lê o DEC/DBK de 2025 com o leiaute de 2025 e migra só o que o programa recupera
 *   (ver `migrarDeclaracaoAnterior` no core).
 * - `importar_pre_preenchida`: "Iniciar a partir da Pré-Preenchida". Baixar a pré-preenchida
 *   exige login gov.br (Ouro ou Prata) num serviço da Receita, que um servidor local não faz;
 *   esta ferramenta recebe o arquivo que o usuário trouxe (a declaração gravada pelo programa
 *   oficial depois de importar a pré-preenchida) e cria a declaração com o nome padrão, sem
 *   apagar em silêncio uma que já exista.
 */
import {
  type Declaracao,
  FICHAS,
  type Ficha,
  lerArquivo,
  migrarDeclaracaoAnterior,
} from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import { interpretarDeclaracao, registrosParaModelo } from "../conversao/dbk-modelo.js";
import { EntradaInvalidaError } from "../erros.js";
import { objetoJson } from "../serializacao.js";
import { lerReciboRegistrado } from "./ciclo-recibo.js";
import { EXT_DECLARACAO, exigirPasta, zNomeArquivo } from "./comum.js";
import { gravarDeclaracao, SAIDA_GRAVACAO, textoGravacao, zArquivoDestino } from "./fluxo.js";
import type { RegistroFerramentas } from "./tipos.js";

const LETRA = { ajusteAnual: "A", saidaDefinitiva: "S", finalEspolio: "E" } as const;

function nomePadrao(dec: Declaracao): string {
  return `${dec.identificacao.cpf}-IRPF-${LETRA[dec.identificacao.tipoDeclaracao.tipo]}-2026-2025-ORIGI.DBK`;
}

async function existe(r: RegistroFerramentas, nome: string): Promise<boolean> {
  try {
    await exigirPasta(r.ctx).ler(nome, EXT_DECLARACAO);
    return true;
  } catch {
    return false;
  }
}

async function destinoLivre(
  r: RegistroFerramentas,
  destino: string,
  sobrescrever: boolean | undefined,
): Promise<void> {
  if (!/\.dbk$/i.test(destino)) {
    throw new EntradaInvalidaError("A declaração nova deve ter extensão .DBK.");
  }
  if (!sobrescrever && (await existe(r, destino))) {
    throw new EntradaInvalidaError(
      `Já existe "${destino}" na pasta e a importação apagaria o que foi digitado nele. Use outro arquivo_destino ou sobrescrever: true (o conteúdo atual vai para a cópia de segurança).`,
    );
  }
}

/** Contagem de lançamentos por ficha preenchida, para o relatório da importação. */
function fichasPreenchidas(dec: Declaracao): string[] {
  const registro = dec as unknown as Record<string, unknown>;
  const out: string[] = [];
  for (const [ficha, nome] of Object.entries(FICHAS) as [Ficha, string][]) {
    if (ficha === "identificacao" || ficha === "resumo") continue;
    const v = registro[ficha];
    if (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null) {
      out.push(Array.isArray(v) ? `${nome}: ${v.length}` : nome);
    }
  }
  return out;
}

const zRecibo = z
  .string()
  .regex(/^\d{12}$/, "O recibo tem 12 dígitos.")
  .optional()
  .describe(
    "Recibo da declaração de 2025 entregue (padrão: o registrado com registrar_recibo para o arquivo de 2025).",
  );

export function registrarImportacoesDeclaracao(r: RegistroFerramentas): void {
  r.ferramenta(
    "importar_declaracao_anterior",
    {
      titulo: "Importar dados da declaração de 2025",
      descricao:
        'Começa a declaração de 2026 com os dados do arquivo de 2025 (DEC gravado para entrega, transmitido ou DBK de cópia de segurança, lido com o leiaute de 2025), como "Importar dados da Declaração de 2025" do programa: Identificação; dependentes e alimentandos; fontes pagadoras de PJ e beneficiários de pagamentos (sem valores); bens e dívidas com situação em 31/12/2024 diferente de zero (o valor passa para a coluna de 31/12/2024); imóveis, bens, rebanho (estoque final como inicial) e dívidas da atividade rural; e o recibo de 2025. Grava um DBK novo (padrão CPF-IRPF-A-2026-2025-ORIGI.DBK) e recusa sobrescrever sem sobrescrever: true. Devolve o que foi importado, o que não foi e o que falta preencher.',
      escreve: true,
      entrada: {
        arquivo: zNomeArquivo("Declaração de 2025 (.DEC ou .DBK)."),
        recibo: zRecibo,
        arquivo_destino: zArquivoDestino,
        sobrescrever: z.boolean().optional(),
      },
      saida: {
        ...SAIDA_GRAVACAO,
        importados: z.array(z.string()),
        naoImportados: z.array(z.string()),
        aPreencher: z.array(z.string()),
        recibo: z.string().nullable(),
      },
    },
    async (a) => {
      const lido = lerArquivo(await exigirPasta(r.ctx).ler(a.arquivo, EXT_DECLARACAO));
      if (lido.exercicio !== 2025) {
        throw new EntradaInvalidaError(
          lido.exercicio === 2026
            ? `"${a.arquivo}" já é do exercício 2026: abra-o com abrir_declaracao.`
            : `"${a.arquivo}" é do exercício ${lido.exercicio}; só se importa a declaração do exercício 2025.`,
        );
      }
      const conv = registrosParaModelo(lido.registros, 2025);
      const cpf = String(
        (conv.declaracao as { identificacao?: { cpf?: unknown } }).identificacao?.cpf ?? "",
      );
      const recibo = a.recibo ?? (await lerReciboRegistrado(r.ctx, a.arquivo, cpf))?.recibo;
      const m = migrarDeclaracaoAnterior(conv.declaracao, { recibo });
      const dec = interpretarDeclaracao(m.declaracao);
      const destino = a.arquivo_destino ?? nomePadrao(dec);
      await destinoLivre(r, destino, a.sobrescrever);
      const res = await gravarDeclaracao(r.ctx, dec, destino);
      const resumo = [
        `Declaração de 2026 criada a partir de ${a.arquivo}.`,
        `Importado: ${m.importados.join("; ")}.`,
        `Não importado: ${m.naoImportados.join("; ")}.`,
        `Falta preencher: ${m.aPreencher.length > 0 ? m.aPreencher.join("; ") : "rendimentos, pagamentos e demais fichas de 2025"}.`,
        recibo
          ? `Recibo de 2025: ${recibo}. O arquivo não guarda esse número (campo de 10 posições): digite-o na Identificação do programa oficial antes de transmitir.`
          : "Sem o recibo de 2025: informe-o com o parâmetro recibo, se tiver (é opcional na original).",
      ]
        .filter(Boolean)
        .join("\n");
      return {
        texto: textoGravacao(res, resumo),
        dados: objetoJson({
          ...res,
          importados: [...m.importados],
          naoImportados: [...m.naoImportados],
          aPreencher: [...m.aPreencher],
          recibo: recibo ?? null,
        }),
      };
    },
  );

  r.ferramenta(
    "importar_pre_preenchida",
    {
      titulo: "Importar a declaração pré-preenchida",
      descricao:
        'Cria a declaração de 2026 a partir do arquivo da pré-preenchida trazido pelo usuário (o DBK ou DEC que o programa oficial grava depois de "Iniciar a partir da Pré-Preenchida" com a conta gov.br Ouro ou Prata). O download em si exige login gov.br num serviço da Receita e é feito no programa oficial ou no Meu Imposto de Renda (orientar_servico_externo explica os passos). Preserva todos os registros do arquivo, grava com o nome padrão sem apagar em silêncio a declaração que já exista e lista as fichas trazidas para conferência: a completude e a exatidão continuam sendo responsabilidade do contribuinte.',
      escreve: true,
      entrada: {
        arquivo: zNomeArquivo("Arquivo da pré-preenchida (.DBK ou .DEC do exercício 2026)."),
        arquivo_destino: zArquivoDestino,
        sobrescrever: z.boolean().optional(),
      },
      saida: { ...SAIDA_GRAVACAO, fichas: z.array(z.string()) },
    },
    async (a) => {
      const lido = lerArquivo(await exigirPasta(r.ctx).ler(a.arquivo, EXT_DECLARACAO));
      if (lido.exercicio !== 2026) {
        throw new EntradaInvalidaError(
          lido.exercicio === 2025
            ? `"${a.arquivo}" é a declaração de 2025: use importar_declaracao_anterior.`
            : `"${a.arquivo}" é do exercício ${lido.exercicio}; a pré-preenchida aceita é a de 2026.`,
        );
      }
      const conv = registrosParaModelo(lido.registros, 2026);
      const dec = interpretarDeclaracao(conv.declaracao);
      const destino = a.arquivo_destino ?? nomePadrao(dec);
      if (destino === a.arquivo) {
        throw new EntradaInvalidaError(
          "O destino é o próprio arquivo da pré-preenchida: abra-o com abrir_declaracao ou indique outro arquivo_destino.",
        );
      }
      await destinoLivre(r, destino, a.sobrescrever);
      const res = await gravarDeclaracao(r.ctx, dec, destino, lido.registros);
      const fichas = fichasPreenchidas(dec);
      const resumo = [
        `Pré-preenchida importada de ${a.arquivo} para o CPF ${dec.identificacao.cpf}.`,
        `Fichas trazidas: ${fichas.length > 0 ? fichas.join("; ") : "só a Identificação"}.`,
        "Confira cada valor com os comprovantes e complete o que faltar: a pré-preenchida não traz tudo (por exemplo, rendimentos sem DIRF/eSocial, bens sem informação de terceiros) e dependentes exigem procuração para vir preenchidos.",
      ].join("\n");
      return {
        texto: textoGravacao(res, resumo),
        dados: objetoJson({ ...res, fichas }),
      };
    },
  );
}
