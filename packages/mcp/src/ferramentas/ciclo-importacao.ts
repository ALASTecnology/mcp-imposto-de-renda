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
 * - `importar_gcap`: "Importar dados de Ganhos de Capital". Lê o arquivo que o GCAP 2025 grava em
 *   "Exportar para o IRPF2026" (`<CPF>-DDMM-DDMM-GCAP-2025.DEC`, zip com o XML do demonstrativo)
 *   e o inclui na declaração com `incluirDemonstrativoGcap` do core, conferido com os pares de
 *   arquivo exportado e DBK gravado pelo programa (`packages/core/test/fixtures/gcap/2026`).
 */
import { inflateRawSync } from "node:zlib";
import {
  type Declaracao,
  ExportacaoGcapInvalidaError,
  FICHAS,
  type Ficha,
  incluirDemonstrativoGcap,
  lerArquivo,
  lerDemonstrativoGcapXml,
  migrarDeclaracaoAnterior,
} from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import { interpretarDeclaracao, registrosParaModelo } from "../conversao/dbk-modelo.js";
import { EntradaInvalidaError } from "../erros.js";
import { objetoJson } from "../serializacao.js";
import { lerReciboRegistrado } from "./ciclo-recibo.js";
import { EXT_DECLARACAO, exigirPasta, zNomeArquivo } from "./comum.js";
import {
  editarDeclaracao,
  gravarDeclaracao,
  SAIDA_GRAVACAO,
  textoGravacao,
  zArquivoDestino,
  zArquivoEdicao,
} from "./fluxo.js";
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

/** XML do demonstrativo de dentro do zip exportado pelo GCAP (entradas deflate ou armazenadas). */
export function xmlDaExportacaoGcap(bytes: Uint8Array): string {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // Diretório central: tamanhos e posições confiáveis mesmo com descritor de dados.
  let fim = -1;
  for (let q = bytes.length - 22; q >= Math.max(0, bytes.length - 65_557); q--) {
    if (dv.getUint32(q, true) === 0x06054b50) {
      fim = q;
      break;
    }
  }
  if (fim < 0) {
    throw new EntradaInvalidaError(
      "O arquivo não é o exportado pelo GCAP (zip): use o .DEC que o GCAP 2025 grava em Exportar para o IRPF2026.",
    );
  }
  const total = dv.getUint16(fim + 10, true);
  let q = dv.getUint32(fim + 16, true);
  for (let i = 0; i < total && q + 46 <= bytes.length; i++) {
    const metodo = dv.getUint16(q + 10, true);
    const comprimido = dv.getUint32(q + 20, true);
    const nomeLen = dv.getUint16(q + 28, true);
    const extraLen = dv.getUint16(q + 30, true);
    const comentarioLen = dv.getUint16(q + 32, true);
    const local = dv.getUint32(q + 42, true);
    const nome = new TextDecoder().decode(bytes.subarray(q + 46, q + 46 + nomeLen));
    if (/\.xml$/i.test(nome)) {
      const inicio = local + 30 + dv.getUint16(local + 26, true) + dv.getUint16(local + 28, true);
      const dados = bytes.subarray(inicio, inicio + comprimido);
      if (metodo !== 0 && metodo !== 8) {
        throw new EntradaInvalidaError(`Compressão ${metodo} não suportada no arquivo do GCAP.`);
      }
      return new TextDecoder("utf-8").decode(metodo === 8 ? inflateRawSync(dados) : dados);
    }
    q += 46 + nomeLen + extraLen + comentarioLen;
  }
  throw new EntradaInvalidaError("O arquivo do GCAP não contém o XML do demonstrativo.");
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

  r.ferramenta(
    "importar_gcap",
    {
      titulo: "Importar o demonstrativo do GCAP",
      descricao:
        'Importa na declaração o arquivo que o GCAP 2025 grava em "Exportar para o IRPF2026" (<CPF>-DDMM-DDMM-GCAP-2025.DEC, um zip com o XML do demonstrativo), como "Importar dados de Ganhos de Capital" do programa: substitui o demonstrativo do mesmo CPF e período e refaz os valores transportados para Rendimentos Isentos (05 pequeno valor, 06 único imóvel, 07 demais reduções, no campo transportado) e Tributação Exclusiva (02 ganho de capital), mantendo o que foi digitado nesses isentos. O CPF do demonstrativo precisa ser o do titular ou de um dependente. Grava o DBK (padrão: o próprio arquivo, com cópia de segurança). Demonstrativos com moeda estrangeira em espécie ainda não são convertidos: importe-os no programa oficial.',
      escreve: true,
      entrada: {
        arquivo: zArquivoEdicao,
        arquivo_gcap: zNomeArquivo(
          'Arquivo exportado pelo GCAP 2025 (ex.: "12345678909-0101-3112-GCAP-2025.DEC").',
        ),
        arquivo_destino: zArquivoDestino,
      },
      saida: {
        ...SAIDA_GRAVACAO,
        cpfDemonstrativo: z.string(),
        alienacoes: z.number().int(),
        impostoDevido: z.union([z.number().int(), z.string()]),
        rendimentoIsento: z.union([z.number().int(), z.string()]),
        rendimentoExclusivo: z.union([z.number().int(), z.string()]),
      },
    },
    async (a) => {
      const bytes = await exigirPasta(r.ctx).ler(a.arquivo_gcap, [".DEC"]);
      let demonstrativo: ReturnType<typeof lerDemonstrativoGcapXml>;
      try {
        demonstrativo = lerDemonstrativoGcapXml(xmlDaExportacaoGcap(bytes));
      } catch (e) {
        if (e instanceof ExportacaoGcapInvalidaError) throw new EntradaInvalidaError(e.message);
        throw e;
      }
      const res = await editarDeclaracao(r.ctx, a, (dec) => {
        const cpfs = [dec.identificacao.cpf, ...dec.dependentes.map((d) => d.cpf)];
        if (!cpfs.includes(demonstrativo.cpfBeneficiario)) {
          throw new EntradaInvalidaError(
            `O demonstrativo do GCAP é do CPF ${demonstrativo.cpfBeneficiario}, que não é o titular nem um dependente da declaração.`,
          );
        }
        return incluirDemonstrativoGcap(dec, demonstrativo);
      });
      const t = demonstrativo.totais;
      const isento = t.isentoPequenoValor + t.isentoUnicoImovel + t.isentoReducao;
      const resumo = [
        `Demonstrativo do GCAP do CPF ${demonstrativo.cpfBeneficiario} importado de ${a.arquivo_gcap}: ${demonstrativo.alienacoes.length} alienação(ões).`,
        `Imposto devido ${t.impostoDevido} centavos, rendimento isento transportado ${isento}, exclusivo ${t.rendimentoExclusivo}.`,
        "O imposto do ganho de capital é pago em Darf (código 4600) até o último dia útil do mês seguinte à alienação; a declaração só informa.",
      ].join("\n");
      const { declaracao: _gravada, ...gravacao } = res;
      return {
        texto: textoGravacao(res, resumo),
        dados: objetoJson({
          ...gravacao,
          cpfDemonstrativo: demonstrativo.cpfBeneficiario,
          alienacoes: demonstrativo.alienacoes.length,
          impostoDevido: t.impostoDevido,
          rendimentoIsento: isento,
          rendimentoExclusivo: t.rendimentoExclusivo,
        }),
      };
    },
  );
}
