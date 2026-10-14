/**
 * Grupo "ciclo": ciclo de vida da declaração (criar, retificar, excluir, cópias de segurança),
 * escolhas do Resumo (opção de tributação, conta e quotas, imposto pago), importação de informes
 * colados pelo usuário e ajustes assistidos (repetir valores de bens, excedente da parcela
 * isenta de 65 anos).
 *
 * Toda escrita valida a declaração com o core antes de gravar e devolve as pendências; nada é
 * gravado fora da pasta autorizada e todo arquivo sobrescrito ou removido ganha cópia em
 * `.autoir-backups`.
 */
import {
  converterTipoArquivo,
  type Declaracao,
  entradaCalculoDoModelo,
  FICHAS,
  gravarArquivo,
  lerArquivo,
  motor2026,
  PARAMETROS_2026,
  validarContaBancaria,
  zIdentificacao,
  zRendimentoPJ,
} from "@autoir/core";
import { z } from "zod";
import { interpretarDeclaracao } from "../conversao/dbk-modelo.js";
import { EntradaInvalidaError } from "../erros.js";
import { normalizarValor } from "../esquemas.js";
import { objetoJson } from "../serializacao.js";
import {
  type InformeRendimentos,
  interpretarInforme,
  interpretarPlanoSaude,
} from "./ciclo-informe.js";
import {
  blocoDeDados,
  EXT_DECLARACAO,
  EXT_GRAVACAO,
  EXT_INFORME,
  exigirPasta,
  zNomeArquivo,
} from "./comum.js";
import { validarLancamento, zObjetoLivre } from "./edicao-esquemas.js";
import {
  abrirDeclaracao,
  editarDeclaracao,
  gravarDeclaracao,
  SAIDA_GRAVACAO,
  textoGravacao,
  zArquivoDestino,
  zArquivoEdicao,
} from "./fluxo.js";
import type { GrupoFerramentas, RegistroFerramentas } from "./tipos.js";

const zValor = z.union([z.string().max(32), z.number().int()]);
const centavos = (v: unknown): bigint => BigInt(normalizarValor(v as string | number));
const LETRA = { ajusteAnual: "A", saidaDefinitiva: "S", finalEspolio: "E" } as const;

/** Nome padrão do arquivo do programa: CPF-IRPF-A-2026-2025-ORIGI.DBK. */
export function nomePadrao(dec: Declaracao, retificadora = false): string {
  const t = dec.identificacao.tipoDeclaracao.tipo;
  return `${dec.identificacao.cpf}-IRPF-${LETRA[t]}-${dec.exercicio}-${dec.anoCalendario}-${retificadora ? "RETIF" : "ORIGI"}.DBK`;
}

async function existe(r: RegistroFerramentas, nome: string): Promise<boolean> {
  try {
    await exigirPasta(r.ctx).ler(nome, EXT_DECLARACAO);
    return true;
  } catch {
    return false;
  }
}

const SAIDA_COM_RESUMO = { ...SAIDA_GRAVACAO, resumo: z.string() };

function semDeclaracao<T extends { declaracao?: unknown }>(x: T): Omit<T, "declaracao"> {
  const { declaracao: _, ...resto } = x;
  return resto;
}

/** Ferramenta de escrita que altera a declaração aberta. */
function alterar(
  r: RegistroFerramentas,
  nome: string,
  titulo: string,
  descricao: string,
  entrada: z.ZodRawShape,
  aplicar: (dec: Declaracao, a: Record<string, unknown>) => string,
): void {
  r.ferramenta(
    nome,
    {
      titulo,
      descricao: `${descricao} Valida a declaração e grava o DBK com cópia de segurança, devolvendo as pendências.`,
      escreve: true,
      entrada: { arquivo: zArquivoEdicao, arquivo_destino: zArquivoDestino, ...entrada },
      saida: SAIDA_COM_RESUMO,
    },
    async (args) => {
      const a = args as Record<string, unknown> & { arquivo: string; arquivo_destino?: string };
      let resumo = "";
      const res = await editarDeclaracao(r.ctx, a, (dec) => {
        resumo = aplicar(dec, a);
        return dec;
      });
      return {
        texto: textoGravacao(res, resumo),
        dados: objetoJson({ ...semDeclaracao(res), resumo }),
      };
    },
  );
}

/** Aplica o informe ao modelo; devolve o que foi lançado. */
function aplicarInforme(dec: Declaracao, inf: InformeRendimentos, substituir: boolean): string[] {
  const lancados: string[] = [];
  const mesmo = (b: { tipo: string; cpf?: string }) =>
    b.tipo === inf.beneficiario.tipo &&
    (b.tipo === "titular" || b.cpf === (inf.beneficiario as { cpf?: string }).cpf);
  const duplicado = dec.rendimentosPJ.some(
    (p) => p.fonte.ni === inf.fonte.ni && mesmo(p.beneficiario),
  );
  if (duplicado && !substituir) {
    throw new EntradaInvalidaError(
      "Já há rendimentos dessa fonte pagadora para o mesmo beneficiário. Repita com substituir: true para trocar os lançamentos dessa fonte.",
    );
  }
  if (duplicado) {
    // O 13º da fonte foi somado ao Exclusivos 01/08 (sem fonte): retira a parte dela antes.
    const codigo13 = inf.beneficiario.tipo === "dependente" ? "08" : "01";
    const decimoAntigo = dec.rendimentosPJ
      .filter((p) => p.fonte.ni === inf.fonte.ni && mesmo(p.beneficiario))
      .reduce((s, p) => s + p.decimoTerceiro, 0n);
    const ex13 = dec.rendimentosExclusivos.find((e) => e.codigo === codigo13);
    if (ex13 && decimoAntigo > 0n) {
      const resto = ex13.valor - decimoAntigo;
      if (resto > 0n) ex13.valor = resto as typeof ex13.valor;
      else dec.rendimentosExclusivos = dec.rendimentosExclusivos.filter((e) => e !== ex13);
    }
    // Plano de saúde do mesmo informe: pagamentos 26 das mesmas operadoras saem antes.
    const operadoras = new Set(inf.planoSaude.map((p) => p.cnpj));
    dec.pagamentos = dec.pagamentos.filter(
      (p) => !(p.codigo === "26" && operadoras.has(p.niBeneficiario ?? "")),
    );
    dec.rendimentosPJ = dec.rendimentosPJ.filter(
      (p) => !(p.fonte.ni === inf.fonte.ni && mesmo(p.beneficiario)),
    );
    dec.rendimentosIsentos = dec.rendimentosIsentos.filter(
      (i) => !("fonte" in i && i.fonte?.ni === inf.fonte.ni && mesmo(i.beneficiario)),
    );
    dec.rendimentosExclusivos = dec.rendimentosExclusivos.filter(
      (i) => !("fonte" in i && i.fonte.ni === inf.fonte.ni && mesmo(i.beneficiario)),
    );
  }
  if (inf.rendimentos > 0n || inf.irrf > 0n || inf.decimoTerceiro > 0n) {
    dec.rendimentosPJ.push(
      zRendimentoPJ.parse({
        beneficiario: inf.beneficiario,
        fonte: inf.fonte,
        rendimentos: inf.rendimentos,
        contribuicaoPrevidenciaria: inf.previdenciaOficial,
        impostoRetido: inf.irrf,
        decimoTerceiro: inf.decimoTerceiro,
        impostoRetidoDecimoTerceiro: inf.irrfDecimoTerceiro,
      }),
    );
    lancados.push(`Rendimentos de PJ: ${inf.rendimentos} centavos, IRRF ${inf.irrf}.`);
  }
  if (inf.decimoTerceiro > 0n) {
    // O 13º salário vai para Exclusivos 01 (titular) ou 08 (dependentes), como no programa.
    const codigo = inf.beneficiario.tipo === "dependente" ? "08" : "01";
    const atual = dec.rendimentosExclusivos.find((e) => e.codigo === codigo);
    if (atual) atual.valor = (atual.valor + inf.decimoTerceiro) as typeof atual.valor;
    else
      dec.rendimentosExclusivos.push({
        codigo,
        valor: inf.decimoTerceiro,
      } as Declaracao["rendimentosExclusivos"][number]);
    lancados.push(`13º salário em Exclusivos ${codigo}.`);
  }
  for (const i of inf.isentos) {
    const item =
      i.codigo === "11"
        ? {
            codigo: "11",
            beneficiario: inf.beneficiario,
            fonte: inf.fonte,
            valor: i.valor,
            decimoTerceiro: 0n,
            impostoRetido: 0n,
            impostoRetidoDecimoTerceiro: 0n,
            contribuicaoPrevidenciaria: 0n,
          }
        : i.codigo === "10"
          ? {
              codigo: "10",
              beneficiario: inf.beneficiario,
              fonte: inf.fonte,
              valor: i.valor,
              decimoTerceiro: i.decimoTerceiro ?? 0n,
            }
          : { codigo: i.codigo, beneficiario: inf.beneficiario, fonte: inf.fonte, valor: i.valor };
    dec.rendimentosIsentos.push(item as Declaracao["rendimentosIsentos"][number]);
    lancados.push(`Isento ${i.codigo}: ${i.valor} centavos.`);
  }
  for (const e of inf.exclusivos) {
    dec.rendimentosExclusivos.push({
      codigo: e.codigo,
      beneficiario: inf.beneficiario,
      fonte: inf.fonte,
      valor: e.valor,
    } as Declaracao["rendimentosExclusivos"][number]);
    lancados.push(`Exclusivo ${e.codigo}: ${e.valor} centavos.`);
  }
  lancados.push(...aplicarPlano(dec, inf.planoSaude));
  lancados.push(...inf.avisos.map((a) => `Aviso: ${a}`));
  return lancados;
}

/** Lança pagamentos de plano de saúde (código 26) por beneficiário. */
function aplicarPlano(dec: Declaracao, itens: InformeRendimentos["planoSaude"]): string[] {
  const lancados: string[] = [];
  const inf = { planoSaude: itens };
  for (const p of inf.planoSaude) {
    dec.pagamentos.push({
      codigo: "26",
      realizadoCom:
        p.cpfBeneficiario && p.cpfBeneficiario !== dec.identificacao.cpf
          ? { tipo: "dependente", cpf: p.cpfBeneficiario }
          : { tipo: "titular" },
      niBeneficiario: p.cnpj,
      nomeBeneficiario: p.nome,
      valorPago: p.valor,
      parcelaNaoDedutivel: p.reembolso,
      contribuicaoPatrocinador: 0n,
    } as Declaracao["pagamentos"][number]);
    lancados.push(`Plano de saúde (pagamento 26): ${p.valor} centavos.`);
  }
  return lancados;
}

/** Idade completada no ano-calendário e mês em que a pessoa faz 65 anos em 2025. */
function mesQueCompleta65(nascimento: string, ano: number): number | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(nascimento);
  if (!m) return undefined;
  const ano65 = Number(m[1]) + 65;
  if (ano65 < ano) return 1;
  if (ano65 > ano) return undefined;
  return Number(m[2]);
}

export const grupoCiclo: GrupoFerramentas = {
  nome: "ciclo",
  descricao:
    "Ciclo de vida da declaração (criar, retificar, excluir), opções do Resumo e importações.",
  exigePasta: true,
  registrar(r) {
    r.ferramenta(
      "criar_declaracao",
      {
        titulo: "Criar uma declaração nova",
        descricao:
          "Cria um DBK novo na pasta autorizada a partir da identificação do contribuinte (formato do modelo) e da opção de tributação. Nome padrão do programa: CPF-IRPF-A-2026-2025-ORIGI.DBK (S para saída definitiva, E para final de espólio). Recusa sobrescrever arquivo existente, salvo sobrescrever: true (com cópia de segurança).",
        escreve: true,
        entrada: {
          identificacao: zObjetoLivre(zIdentificacao, "Identificação do contribuinte."),
          opcao_tributacao: z.enum(["completa", "simplificada"]).optional(),
          arquivo_destino: zArquivoDestino,
          sobrescrever: z.boolean().optional(),
        },
        saida: SAIDA_COM_RESUMO,
      },
      async ({ identificacao, opcao_tributacao, arquivo_destino, sobrescrever }) => {
        const id = validarLancamento(zIdentificacao, identificacao, FICHAS.identificacao);
        const dec = interpretarDeclaracao({
          identificacao: id,
          resumo: {
            opcaoTributacao:
              opcao_tributacao === "completa" ? "deducoesLegais" : "descontoSimplificado",
          },
        });
        const destino = arquivo_destino ?? nomePadrao(dec);
        if (!/\.dbk$/i.test(destino))
          throw new EntradaInvalidaError("O arquivo novo deve ter extensão .DBK.");
        if (!sobrescrever && (await existe(r, destino))) {
          throw new EntradaInvalidaError(
            `Já existe "${destino}" na pasta. Use outro arquivo_destino ou sobrescrever: true (com cópia de segurança).`,
          );
        }
        const res = await gravarDeclaracao(r.ctx, dec, destino);
        const resumo = `Declaração criada para o CPF ${id.cpf}.`;
        return { texto: textoGravacao(res, resumo), dados: objetoJson({ ...res, resumo }) };
      },
    );

    alterar(
      r,
      "criar_retificadora",
      "Criar declaração retificadora",
      "Marca a declaração como retificadora com o número do recibo (12 dígitos) da declaração a retificar e grava em um novo DBK (padrão: CPF-IRPF-A-2026-2025-RETIF.DBK), preservando o restante.",
      {
        recibo: z
          .string()
          .regex(/^\d{12}$/, "O recibo tem 12 dígitos.")
          .describe("Recibo da declaração a retificar."),
      },
      (dec, a) => {
        dec.identificacao.tipoDeclaracao.retificadora = true;
        dec.identificacao.tipoDeclaracao.reciboRetificada = a.recibo as string;
        return "Declaração marcada como retificadora.";
      },
    );

    r.ferramenta(
      "excluir_declaracao",
      {
        titulo: "Excluir uma declaração da pasta",
        descricao:
          "Remove um DBK ou DEC da pasta autorizada, guardando antes uma cópia em .autoir-backups. Exige 'confirmar' igual ao nome do arquivo; para DEC (arquivo de entrega, que pode ter recibo) exige também confirmar_dec: true.",
        escreve: true,
        entrada: {
          arquivo: zNomeArquivo("Arquivo .DBK ou .DEC a excluir."),
          confirmar: z
            .string()
            .max(255)
            .describe("Repita exatamente o nome do arquivo para confirmar."),
          confirmar_dec: z.boolean().optional(),
        },
        saida: { arquivo: z.string(), backup: z.string() },
        anotacoes: { idempotentHint: false },
      },
      async ({ arquivo, confirmar, confirmar_dec }) => {
        if (confirmar !== arquivo) {
          throw new EntradaInvalidaError(
            "Exclusão não confirmada: 'confirmar' deve ser igual ao nome do arquivo.",
          );
        }
        if (/\.dec$/i.test(arquivo) && !confirmar_dec) {
          throw new EntradaInvalidaError(
            "O DEC é o arquivo de entrega e pode conter o recibo. Para excluí-lo, informe também confirmar_dec: true.",
          );
        }
        const res = await exigirPasta(r.ctx).remover(arquivo, EXT_DECLARACAO);
        return {
          texto: `Excluído ${res.arquivo}. Cópia guardada em ${res.backup} (use restaurar_copia_seguranca para voltar).`,
          dados: { arquivo: res.arquivo, backup: res.backup },
        };
      },
    );

    r.ferramenta(
      "gravar_copia_seguranca",
      {
        titulo: "Gravar cópia de segurança (DBK)",
        descricao:
          "Copia um DBK ou DEC da pasta para outro .DBK (um DEC vira DBK sem o recibo, com os controles refeitos). Recusa sobrescrever, salvo sobrescrever: true.",
        escreve: true,
        entrada: {
          arquivo: zNomeArquivo("Arquivo .DBK ou .DEC de origem."),
          arquivo_destino: zNomeArquivo("Arquivo .DBK de destino."),
          sobrescrever: z.boolean().optional(),
        },
        saida: { arquivo: z.string(), bytes: z.number(), backup: z.string().nullable() },
      },
      async ({ arquivo, arquivo_destino, sobrescrever }) => {
        const pasta = exigirPasta(r.ctx);
        if (!sobrescrever && (await existe(r, arquivo_destino))) {
          throw new EntradaInvalidaError(`Já existe "${arquivo_destino}". Use sobrescrever: true.`);
        }
        const lido = lerArquivo(await pasta.ler(arquivo, EXT_DECLARACAO));
        const bytes = gravarArquivo(converterTipoArquivo(lido.registros, "DBK"));
        const e = await pasta.escrever(arquivo_destino, bytes, EXT_GRAVACAO);
        return {
          texto: `Cópia gravada em ${e.arquivo} (${e.bytes} bytes).`,
          dados: { arquivo: e.arquivo, bytes: e.bytes, backup: e.backup ?? null },
        };
      },
    );

    r.ferramenta(
      "listar_copias_seguranca",
      {
        titulo: "Listar cópias de segurança",
        descricao:
          "Lista as cópias automáticas guardadas em .autoir-backups (feitas antes de sobrescrever ou excluir), da mais recente para a mais antiga.",
        entrada: {
          arquivo: z.string().max(255).optional().describe("Filtra pelo arquivo de origem."),
        },
        saida: {
          copias: z.array(
            z.object({
              copia: z.string(),
              arquivo: z.string(),
              criadaEm: z.string(),
              tamanho: z.number(),
            }),
          ),
        },
      },
      async ({ arquivo }) => {
        const copias = (await exigirPasta(r.ctx).listarCopias()).filter(
          (c) => !arquivo || c.arquivo === arquivo,
        );
        return {
          texto: copias.length
            ? copias.map((c) => `- ${c.copia} (${c.arquivo}, ${c.criadaEm})`).join("\n")
            : "Nenhuma cópia de segurança.",
          dados: objetoJson({ copias }),
        };
      },
    );

    r.ferramenta(
      "restaurar_copia_seguranca",
      {
        titulo: "Restaurar cópia de segurança",
        descricao:
          "Restaura uma cópia de .autoir-backups (nome de listar_copias_seguranca) sobre um arquivo da pasta (padrão: o arquivo de origem). O conteúdo atual também ganha cópia antes de ser sobrescrito.",
        escreve: true,
        entrada: {
          copia: z.string().min(1).max(300),
          arquivo_destino: z.string().max(255).optional(),
        },
        saida: { arquivo: z.string(), bytes: z.number(), backup: z.string().nullable() },
      },
      async ({ copia, arquivo_destino }) => {
        const pasta = exigirPasta(r.ctx);
        const origem = (await pasta.listarCopias()).find((c) => c.copia === copia);
        if (!origem)
          throw new EntradaInvalidaError("Cópia não encontrada; use listar_copias_seguranca.");
        const destino = arquivo_destino ?? origem.arquivo;
        const e = await pasta.restaurarCopia(copia, destino, EXT_DECLARACAO);
        return {
          texto: `Restaurado ${e.arquivo} a partir de ${copia}.${e.backup ? ` Conteúdo anterior em ${e.backup}.` : ""}`,
          dados: { arquivo: e.arquivo, bytes: e.bytes, backup: e.backup ?? null },
        };
      },
    );

    r.ferramenta(
      "definir_opcao_tributacao",
      {
        titulo: "Escolher a forma de tributação",
        descricao:
          "Escolhe deduções legais (completa) ou desconto simplificado, preservando as deduções informadas, e devolve a comparação dos dois modelos com a recomendação. Valida e grava com cópia de segurança.",
        escreve: true,
        entrada: {
          arquivo: zArquivoEdicao,
          arquivo_destino: zArquivoDestino,
          opcao: z.enum(["completa", "simplificada", "mais_vantajosa"]),
        },
        saida: {
          ...SAIDA_COM_RESUMO,
          comparacao: z.object({
            completo: z.object({
              impostoDevido: z.string(),
              saldoPagar: z.string(),
              restituir: z.string(),
            }),
            simplificado: z.object({
              impostoDevido: z.string(),
              saldoPagar: z.string(),
              restituir: z.string(),
            }),
            maisVantajoso: z.enum(["completo", "simplificado"]),
          }),
        },
      },
      async (a) => {
        let comparacao = { completo: {}, simplificado: {}, maisVantajoso: "completo" } as Record<
          string,
          unknown
        >;
        let resumo = "";
        const res = await editarDeclaracao(r.ctx, a, (dec) => {
          const c = motor2026.compararModelos(entradaCalculoDoModelo(dec));
          const m = (x: { impostoDevido: bigint; saldoPagar: bigint; restituir: bigint }) => ({
            impostoDevido: x.impostoDevido.toString(),
            saldoPagar: x.saldoPagar.toString(),
            restituir: x.restituir.toString(),
          });
          comparacao = {
            completo: m(c.completo),
            simplificado: m(c.simplificado),
            maisVantajoso: c.modeloMaisVantajoso,
          };
          const completa =
            a.opcao === "completa" ||
            (a.opcao === "mais_vantajosa" && c.modeloMaisVantajoso === "completo");
          dec.resumo.opcaoTributacao = completa ? "deducoesLegais" : "descontoSimplificado";
          resumo = `Opção: ${completa ? "deduções legais (completa)" : "desconto simplificado"}; mais vantajoso pelo cálculo do AutoIR: ${c.modeloMaisVantajoso}.`;
          return dec;
        });
        return {
          texto: textoGravacao(res, resumo),
          dados: objetoJson({ ...semDeclaracao(res), resumo, comparacao }),
        };
      },
    );

    alterar(
      r,
      "definir_informacoes_bancarias",
      "Definir conta, quotas e débito automático",
      "Grava a conta para restituição ou débito (banco, agência sem DV, conta, DV, tipo e operação da Caixa), Pix pela chave CPF, número de quotas (1 a 8) e débito automático, validando banco, agência, conta e DV pela regra de cada banco. 'remover_conta': true apaga a conta.",
      {
        banco: z.string().max(3).optional(),
        agencia: z.string().max(5).optional(),
        conta: z.string().max(20).optional(),
        dv: z.string().max(2).optional(),
        tipo_conta: z.enum(["corrente", "poupanca", "pagamento"]).optional(),
        operacao: z.string().max(4).optional(),
        remover_conta: z.boolean().optional(),
        pix: z.boolean().optional(),
        quotas: z.number().int().min(1).max(8).optional(),
        debito_automatico: z.boolean().optional(),
        debito_primeira_quota: z.boolean().optional(),
      },
      (dec, a) => {
        const r0 = dec.resumo;
        if (a.remover_conta) delete r0.conta;
        if (a.banco || a.agencia || a.conta || a.dv) {
          const conta = {
            banco: String(a.banco ?? r0.conta?.banco ?? "").padStart(3, "0"),
            agencia: String(a.agencia ?? r0.conta?.agencia ?? "").replace(/\D/g, ""),
            conta: String(a.conta ?? r0.conta?.conta ?? "").replace(/\D/g, ""),
            dv: String(a.dv ?? r0.conta?.dv ?? ""),
          };
          const erros = validarContaBancaria(conta, "bancos").filter((p) => p.gravidade === "erro");
          if (erros.length > 0) {
            throw new EntradaInvalidaError(
              `Conta inválida: ${erros.map((e) => `${e.campo}: ${e.mensagem}`).join("; ")}`,
            );
          }
          r0.conta = {
            ...conta,
            tipo:
              (a.tipo_conta as "corrente" | "poupanca" | "pagamento" | undefined) ??
              r0.conta?.tipo ??
              "corrente",
            ...(a.operacao ? { operacao: String(a.operacao) } : {}),
          };
        } else if (a.tipo_conta && r0.conta) r0.conta.tipo = a.tipo_conta as "corrente";
        if (a.pix !== undefined) r0.pix = a.pix as boolean;
        if (a.quotas !== undefined) r0.quotas = a.quotas as number;
        if (a.debito_automatico !== undefined) r0.debitoAutomatico = a.debito_automatico as boolean;
        if (a.debito_primeira_quota !== undefined)
          r0.debitoPrimeiraQuota = a.debito_primeira_quota as boolean;
        if (r0.debitoAutomatico && !r0.conta) {
          throw new EntradaInvalidaError("O débito automático exige uma conta corrente informada.");
        }
        return "Informações bancárias e de pagamento atualizadas.";
      },
    );

    alterar(
      r,
      "definir_imposto_pago",
      "Definir a ficha Imposto Pago",
      "Grava as linhas digitadas da ficha Imposto Pago/Retido: imposto complementar (Darf 0246), imposto pago no exterior e imposto retido na fonte da Lei 11.033/2004. Valores em reais (texto) ou centavos.",
      {
        imposto_complementar: zValor.optional(),
        imposto_pago_exterior: zValor.optional(),
        imposto_retido_lei_11033: zValor.optional(),
      },
      (dec, a) => {
        const ip = dec.impostoPago;
        if (a.imposto_complementar !== undefined)
          ip.impostoComplementar = centavos(
            a.imposto_complementar,
          ) as typeof ip.impostoComplementar;
        if (a.imposto_pago_exterior !== undefined)
          ip.impostoPagoExterior = centavos(
            a.imposto_pago_exterior,
          ) as typeof ip.impostoPagoExterior;
        if (a.imposto_retido_lei_11033 !== undefined) {
          ip.impostoRetidoLei11033 = centavos(
            a.imposto_retido_lei_11033,
          ) as typeof ip.impostoRetidoLei11033;
        }
        return "Ficha Imposto Pago atualizada.";
      },
    );

    alterar(
      r,
      "repetir_valores_bens",
      "Repetir a situação dos bens",
      "Copia a situação em 31/12/2024 para 31/12/2025 nos bens escolhidos (posições de listar_bens) ou, sem 'indices', em todos os bens com situação atual zerada; forcar: true copia mesmo quando já há valor.",
      {
        indices: z.array(z.number().int().min(1)).max(1000).optional(),
        forcar: z.boolean().optional(),
      },
      (dec, a) => {
        const alvo = (a.indices as number[] | undefined) ?? dec.bens.map((_, i) => i + 1);
        let n = 0;
        for (const i of alvo) {
          const b = dec.bens[i - 1];
          if (!b) throw new EntradaInvalidaError(`Não há bem na posição ${i}.`);
          if (b.situacaoAtual === 0n || a.forcar) {
            b.situacaoAtual = b.situacaoAnterior;
            n++;
          }
        }
        return `Situação repetida em ${n} bem(ns).`;
      },
    );

    for (const tipo of ["rendimentos", "plano_saude"] as const) {
      r.ferramenta(
        tipo === "rendimentos" ? "importar_informe_rendimentos" : "importar_informe_plano_saude",
        {
          titulo:
            tipo === "rendimentos"
              ? "Importar informe de rendimentos"
              : "Importar informe de plano de saúde",
          descricao:
            tipo === "rendimentos"
              ? "Lança na declaração o comprovante de rendimentos de PJ colado pelo usuário, em texto ou JSON (sem OCR e sem rede): fonte e CNPJ, quadro 3 (rendimentos, previdência oficial, IRRF), quadro 4 (isentos como parcela de 65 anos, indenizações, lucros), quadro 5 (13º e IRRF do 13º, PLR, aplicações) e plano de saúde do quadro 7. Recusa duplicidade da mesma fonte e beneficiário, salvo substituir: true; simular: true só mostra o que seria lançado."
              : "Lança em Pagamentos Efetuados (código 26) o informe de plano de saúde colado em texto ou JSON: operadora (CNPJ e nome), valor pago por beneficiário e reembolsos. Recusa duplicidade, salvo substituir: true; simular: true só mostra.",
          escreve: true,
          entrada: {
            arquivo: zArquivoEdicao,
            arquivo_destino: zArquivoDestino,
            texto: z.string().max(50_000).optional().describe("Informe colado como texto."),
            json: z
              .record(z.string(), z.unknown())
              .optional()
              .describe("Informe estruturado em JSON."),
            beneficiario_cpf: z
              .string()
              .max(14)
              .optional()
              .describe("CPF do dependente, se o informe for dele (padrão: titular)."),
            substituir: z.boolean().optional(),
            simular: z.boolean().optional(),
          },
          saida: { ...SAIDA_COM_RESUMO, lancamentos: z.array(z.string()), simulado: z.boolean() },
        },
        async (a) => {
          if ((a.texto === undefined) === (a.json === undefined)) {
            throw new EntradaInvalidaError("Informe exatamente um entre 'texto' e 'json'.");
          }
          let lancamentos: string[] = [];
          const aplicar = (dec: Declaracao) => {
            const cpfDep = a.beneficiario_cpf?.replace(/\D/g, "");
            if (cpfDep && !dec.dependentes.some((d) => d.cpf === cpfDep)) {
              throw new EntradaInvalidaError(
                "O CPF informado não está na ficha Dependentes; inclua o dependente antes.",
              );
            }
            const beneficiario = cpfDep
              ? { tipo: "dependente" as const, cpf: cpfDep }
              : { tipo: "titular" as const };
            if (tipo === "rendimentos") {
              const inf = interpretarInforme(a.texto ?? a.json, beneficiario);
              lancamentos = aplicarInforme(dec, inf, a.substituir ?? false);
            } else {
              const ps = interpretarPlanoSaude(a.texto ?? a.json, dec.identificacao.cpf);
              const dup = dec.pagamentos.some(
                (p) => p.codigo === "26" && p.niBeneficiario === ps.cnpj,
              );
              if (dup && !a.substituir) {
                throw new EntradaInvalidaError(
                  "Já há pagamentos a essa operadora. Use substituir: true para trocá-los.",
                );
              }
              if (dup)
                dec.pagamentos = dec.pagamentos.filter(
                  (p) => !(p.codigo === "26" && p.niBeneficiario === ps.cnpj),
                );
              lancamentos = aplicarPlano(
                dec,
                ps.itens.map((x) => ({ ...x, cnpj: ps.cnpj, nome: ps.nome })),
              );
            }
            return dec;
          };
          if (a.simular) {
            const aberta = await abrirDeclaracao(r.ctx, a.arquivo);
            aplicar(structuredClone(aberta.declaracao));
            return {
              texto: `Simulação (nada foi gravado):\n${lancamentos.map((l) => `- ${l}`).join("\n")}`,
              dados: objetoJson({
                arquivo: a.arquivo,
                bytes: 0,
                backup: null,
                registros: 0,
                controlesValidos: true,
                podeEntregar: false,
                totalErros: 0,
                totalAvisos: 0,
                pendencias: [],
                avisos: [],
                resumo: "Simulação.",
                lancamentos,
                simulado: true,
              }),
            };
          }
          const res = await editarDeclaracao(r.ctx, a, aplicar);
          const resumo = `Informe importado: ${lancamentos.length} lançamento(s).`;
          return {
            texto: textoGravacao(res, `${resumo}\n${lancamentos.map((l) => `- ${l}`).join("\n")}`),
            dados: objetoJson({ ...semDeclaracao(res), resumo, lancamentos, simulado: false }),
          };
        },
      );
    }

    r.ferramenta(
      "ler_informe",
      {
        titulo: "Ler um informe de rendimentos",
        descricao:
          "Lê o comprovante de rendimentos de PJ colado em 'texto' ou num arquivo .txt da pasta autorizada e devolve os campos extraídos por regras fixas (fonte e CNPJ, rendimentos, previdência oficial, IRRF, 13º e IRRF do 13º, isentos e exclusivos), sem gravar nada, sem OCR e sem rede. Linhas não reconhecidas e campos repetidos voltam em 'avisos'. Para lançar, use importar_informe_rendimentos.",
        entrada: {
          texto: z.string().max(50_000).optional().describe("Informe colado como texto."),
          arquivo: zNomeArquivo("Arquivo .txt com o informe.").optional(),
        },
        saida: {
          fonte: z.object({ ni: z.string(), nome: z.string() }),
          rendimentos: z.string(),
          previdenciaOficial: z.string(),
          irrf: z.string(),
          decimoTerceiro: z.string(),
          irrfDecimoTerceiro: z.string(),
          isentos: z.array(
            z.object({ codigo: z.string(), valor: z.string(), decimoTerceiro: z.string() }),
          ),
          exclusivos: z.array(z.object({ codigo: z.string(), valor: z.string() })),
          avisos: z.array(z.string()),
        },
      },
      async ({ texto, arquivo }) => {
        if ((texto === undefined) === (arquivo === undefined)) {
          throw new EntradaInvalidaError("Informe exatamente um entre 'texto' e 'arquivo' (.txt).");
        }
        let conteudo = texto ?? "";
        if (arquivo !== undefined) {
          const bytes = await exigirPasta(r.ctx).ler(arquivo, EXT_INFORME);
          if (bytes.length > 50_000) {
            throw new EntradaInvalidaError("O arquivo do informe passa de 50.000 bytes.");
          }
          try {
            conteudo = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
          } catch {
            conteudo = new TextDecoder("latin1").decode(bytes);
          }
        }
        const inf = interpretarInforme(conteudo, { tipo: "titular" });
        const c = (v: bigint) => v.toString();
        const dados = {
          fonte: inf.fonte,
          rendimentos: c(inf.rendimentos),
          previdenciaOficial: c(inf.previdenciaOficial),
          irrf: c(inf.irrf),
          decimoTerceiro: c(inf.decimoTerceiro),
          irrfDecimoTerceiro: c(inf.irrfDecimoTerceiro),
          isentos: inf.isentos.map((i) => ({
            codigo: i.codigo,
            valor: c(i.valor),
            decimoTerceiro: c(i.decimoTerceiro ?? 0n),
          })),
          exclusivos: inf.exclusivos.map((e) => ({ codigo: e.codigo, valor: c(e.valor) })),
          avisos: inf.avisos,
        };
        return {
          texto: [
            "Campos extraídos do informe (valores em centavos). Nada foi gravado.",
            blocoDeDados("informe", JSON.stringify(dados, null, 2)),
            ...inf.avisos.map((x) => `Aviso: ${x}`),
          ].join("\n"),
          dados: objetoJson(dados),
        };
      },
    );

    r.ferramenta(
      "transferir_excedente_isencao_65",
      {
        titulo: "Transferir o excedente da parcela isenta de 65 anos",
        descricao:
          "Soma, por beneficiário com 65 anos ou mais em 2025 (contando a partir do mês em que completa 65), a parcela isenta de aposentadoria (isento código 10) de todas as fontes, aplica o limite de R$ 1.903,98 por mês mais o 13º e transfere o excedente para os Rendimentos Tributáveis de PJ da mesma fonte, como a pergunta do programa. simular: true só mostra.",
        escreve: true,
        entrada: {
          arquivo: zArquivoEdicao,
          arquivo_destino: zArquivoDestino,
          simular: z.boolean().optional(),
        },
        saida: {
          ...SAIDA_COM_RESUMO,
          transferencias: z.array(
            z.object({
              beneficiario: z.string(),
              limite: z.string(),
              informado: z.string(),
              excedente: z.string(),
            }),
          ),
          simulado: z.boolean(),
        },
      },
      async (a) => {
        const transferencias: {
          beneficiario: string;
          limite: string;
          informado: string;
          excedente: string;
        }[] = [];
        const aplicar = (dec: Declaracao) => {
          const pessoas = [
            {
              b: { tipo: "titular" as const },
              nome: "titular",
              nasc: dec.identificacao.dataNascimento,
            },
            ...dec.dependentes.map((d) => ({
              b: { tipo: "dependente" as const, cpf: d.cpf },
              nome: `dependente ${d.cpf}`,
              nasc: d.dataNascimento,
            })),
          ];
          for (const p of pessoas) {
            const mes = mesQueCompleta65(p.nasc, dec.anoCalendario);
            const doBenef = dec.rendimentosIsentos.filter(
              (i): i is Extract<typeof i, { codigo: "10" }> =>
                i.codigo === "10" &&
                i.beneficiario.tipo === p.b.tipo &&
                (p.b.tipo === "titular" || (i.beneficiario as { cpf: string }).cpf === p.b.cpf),
            );
            if (doBenef.length === 0) continue;
            const limite =
              mes === undefined ? 0n : PARAMETROS_2026.parcelaIsenta65Mensal * BigInt(14 - mes);
            const informado = doBenef.reduce((s, i) => s + i.valor + i.decimoTerceiro, 0n);
            let excedente = informado > limite ? informado - limite : 0n;
            transferencias.push({
              beneficiario: p.nome,
              limite: limite.toString(),
              informado: informado.toString(),
              excedente: excedente.toString(),
            });
            for (let k = doBenef.length - 1; k >= 0 && excedente > 0n; k--) {
              const i = doBenef[k];
              if (!i) continue;
              const tirar = i.valor < excedente ? i.valor : excedente;
              i.valor = (i.valor - tirar) as typeof i.valor;
              excedente -= tirar;
              const pj = dec.rendimentosPJ.find(
                (x) =>
                  x.fonte.ni === i.fonte.ni &&
                  x.beneficiario.tipo === p.b.tipo &&
                  (p.b.tipo === "titular" || (x.beneficiario as { cpf: string }).cpf === p.b.cpf),
              );
              if (pj) pj.rendimentos = (pj.rendimentos + tirar) as typeof pj.rendimentos;
              else
                dec.rendimentosPJ.push(
                  zRendimentoPJ.parse({ beneficiario: p.b, fonte: i.fonte, rendimentos: tirar }),
                );
            }
          }
          return dec;
        };
        const resumo = (t: typeof transferencias) =>
          t.length === 0
            ? "Nenhuma parcela isenta de 65 anos na declaração."
            : t
                .map(
                  (x) =>
                    `${x.beneficiario}: limite ${x.limite}, informado ${x.informado}, excedente transferido ${x.excedente} (centavos)`,
                )
                .join("; ");
        if (a.simular) {
          aplicar(structuredClone((await abrirDeclaracao(r.ctx, a.arquivo)).declaracao));
          return {
            texto: `Simulação: ${resumo(transferencias)}`,
            dados: objetoJson({
              arquivo: a.arquivo,
              bytes: 0,
              backup: null,
              registros: 0,
              controlesValidos: true,
              podeEntregar: false,
              totalErros: 0,
              totalAvisos: 0,
              pendencias: [],
              avisos: [],
              resumo: resumo(transferencias),
              transferencias,
              simulado: true,
            }),
          };
        }
        const res = await editarDeclaracao(r.ctx, a, aplicar);
        return {
          texto: textoGravacao(res, resumo(transferencias)),
          dados: objetoJson({
            ...semDeclaracao(res),
            resumo: resumo(transferencias),
            transferencias,
            simulado: false,
          }),
        };
      },
    );
  },
};
