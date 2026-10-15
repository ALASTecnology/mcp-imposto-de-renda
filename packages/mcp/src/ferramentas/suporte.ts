/**
 * Ferramentas de suporte do grupo "orientacao": o diagnóstico do próprio servidor (equivalente
 * à função de memória do menu Ferramentas do programa) e o modelo de sugestão para o projeto
 * (equivalente à avaliação do aplicativo). Nenhuma das duas acessa a rede nem devolve caminho
 * absoluto ou dado da declaração.
 */
import { basename } from "node:path";
import { z } from "zod";
import { VERSAO_TABELAS } from "./orientacao.js";
import type { RegistroFerramentas } from "./tipos.js";

/** Página de nova issue do repositório público do projeto. */
export const LINK_NOVA_ISSUE = "https://github.com/ALASTecnology/mcp-imposto-de-renda/issues/new";

const MB = 1024 * 1024;
const emMB = (bytes: number) => Math.round((bytes / MB) * 10) / 10;

const TIPOS_SUGESTAO = ["sugestao", "problema", "duvida"] as const;
type TipoSugestao = (typeof TIPOS_SUGESTAO)[number];

const ROTULO_TIPO: Record<TipoSugestao, string> = {
  sugestao: "Sugestão",
  problema: "Problema",
  duvida: "Dúvida",
};

const ETIQUETA: Record<TipoSugestao, string> = {
  sugestao: "enhancement",
  problema: "bug",
  duvida: "question",
};

/**
 * Trechos que não podem ir para uma issue pública: e-mail, valor em reais, CPF ou CNPJ com ou
 * sem pontuação e qualquer número longo (recibo, conta, NIT, telefone, nome padrão do arquivo).
 * A ordem importa: o valor em reais sai antes de a sequência de dígitos ser avaliada.
 */
const SENSIVEIS: readonly RegExp[] = [
  /[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.[\p{L}]{2,}/gu,
  /R\$\s*-?\d[\d.]*(?:,\d+)?/g,
  /\b\d{1,3}(?:\.\d{3})+,\d{2}\b|\b\d+,\d{2}\b/g,
  /\d(?:[\d.\-/ ]*\d){7,}/g,
];

/** Troca os trechos sensíveis por `[removido]` e conta quantos saíram. */
export function semDadosPessoais(texto: string): { texto: string; removidos: number } {
  let removidos = 0;
  let saida = texto;
  for (const rx of SENSIVEIS) {
    saida = saida.replace(rx, (m) => {
      // Sequência com menos de 8 dígitos (datas, anos, quantidades) fica.
      if (rx === SENSIVEIS[3] && (m.match(/\d/g)?.length ?? 0) < 8) return m;
      removidos++;
      return "[removido]";
    });
  }
  return { texto: saida, removidos };
}

export function registrarSuporte(r: RegistroFerramentas): void {
  r.ferramenta(
    "diagnosticar_servidor",
    {
      titulo: "Diagnóstico do servidor",
      descricao:
        "Mostra o estado do próprio servidor do MCP Imposto de Renda: versão, versão das tabelas, perfil, grupos e quantidade de ferramentas registradas, se há pasta autorizada (só o nome da pasta, nunca o caminho), modo somente leitura, uso de memória do processo e versões do Node e da plataforma. Não lê a declaração nem devolve dado pessoal. Útil para conferir a instalação, para entender por que uma ferramenta não aparece e para anexar a um relato de problema.",
      entrada: {},
      saida: {
        versao: z.string(),
        tabelas: z.string(),
        perfil: z.string(),
        somenteLeitura: z.boolean(),
        totalFerramentas: z.number(),
        grupos: z.array(z.object({ nome: z.string(), ferramentas: z.number() })),
        pasta: z.object({
          configurada: z.boolean(),
          nome: z.string().nullable().describe("Só o nome da pasta, sem o caminho."),
          limiteArquivoMB: z.number().nullable(),
        }),
        memoria: z.object({
          rssMB: z.number(),
          heapUsadoMB: z.number(),
          heapTotalMB: z.number(),
          externaMB: z.number(),
        }),
        node: z.string(),
        plataforma: z.string(),
      },
    },
    () => {
      const info = r.ctx.servidor;
      const amb = info?.ambiente();
      const grupos = (info?.grupos ?? []).map((g) => ({
        nome: g.nome,
        ferramentas: g.ferramentas,
      }));
      const total = grupos.reduce((n, g) => n + g.ferramentas, 0);
      const pasta = r.ctx.pasta;
      const dados = {
        versao: info?.versao ?? "desconhecida",
        tabelas: `${VERSAO_TABELAS.programa} ${VERSAO_TABELAS.versao}`,
        perfil: info?.perfil ?? "desconhecido",
        somenteLeitura: r.ctx.somenteLeitura,
        totalFerramentas: total,
        grupos,
        pasta: {
          configurada: pasta !== undefined,
          nome: pasta ? basename(pasta.raiz) || null : null,
          limiteArquivoMB: pasta ? emMB(pasta.limiteBytes) : null,
        },
        memoria: {
          rssMB: emMB(amb?.memoria.rss ?? 0),
          heapUsadoMB: emMB(amb?.memoria.heapUsed ?? 0),
          heapTotalMB: emMB(amb?.memoria.heapTotal ?? 0),
          externaMB: emMB(amb?.memoria.external ?? 0),
        },
        node: amb?.node ?? "desconhecida",
        plataforma: amb ? `${amb.plataforma} ${amb.arquitetura}` : "desconhecida",
      };
      const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
      const texto = [
        `MCP Imposto de Renda ${dados.versao} (tabelas ${dados.tabelas}), perfil ${dados.perfil}${dados.somenteLeitura ? ", somente leitura" : ""}.`,
        `${total} ferramenta(s) em ${grupos.length} grupo(s): ${grupos.map((g) => `${g.nome} ${g.ferramentas}`).join(", ")}.`,
        dados.pasta.configurada
          ? `Pasta autorizada: ${dados.pasta.nome ?? "(sem nome)"} (limite de ${fmt(dados.pasta.limiteArquivoMB ?? 0)} MB por arquivo).`
          : "Sem pasta autorizada: as ferramentas de arquivo não foram registradas (inicie com --dir <pasta>).",
        `Memória do processo: ${fmt(dados.memoria.rssMB)} MB residentes, heap ${fmt(dados.memoria.heapUsadoMB)} de ${fmt(dados.memoria.heapTotalMB)} MB, externa ${fmt(dados.memoria.externaMB)} MB.`,
        `Node ${dados.node}, plataforma ${dados.plataforma}.`,
      ].join("\n");
      return { texto, dados };
    },
  );

  r.ferramenta(
    "enviar_sugestao",
    {
      titulo: "Preparar sugestão ou relato para o projeto",
      descricao:
        "Monta o texto de uma issue para o repositório público do MCP Imposto de Renda (sugestão, problema ou dúvida), com modelo, versão, perfil e plataforma, e devolve o link para o usuário abrir e enviar ele mesmo. Não acessa a rede e não envia nada. Tira do título e da descrição CPF, CNPJ, valores em reais, e-mails e números longos; mesmo assim, peça ao usuário que releia antes de publicar, porque nomes não são detectados. Nunca inclua dados da declaração.",
      entrada: {
        tipo: z.enum(TIPOS_SUGESTAO).describe("sugestao, problema ou duvida."),
        titulo: z.string().min(3).max(120).describe("Resumo em uma linha, sem dados pessoais."),
        descricao: z
          .string()
          .min(10)
          .max(2000)
          .describe("O que aconteceu ou o que se espera, sem CPF, nomes, valores nem arquivos."),
        ferramenta: z
          .string()
          .regex(/^[a-z0-9_]{1,64}$/)
          .optional()
          .describe("Nome da ferramenta envolvida, se houver."),
      },
      saida: {
        link: z.string(),
        linkPreenchido: z.string(),
        titulo: z.string(),
        corpo: z.string(),
        removidos: z.number().describe("Trechos sensíveis retirados do texto."),
      },
    },
    ({ tipo, titulo, descricao, ferramenta }) => {
      const info = r.ctx.servidor;
      const amb = info?.ambiente();
      const t = semDadosPessoais(titulo.trim());
      const d = semDadosPessoais(descricao.trim());
      const removidos = t.removidos + d.removidos;
      const tituloFinal = `[${ROTULO_TIPO[tipo]}] ${t.texto}`;
      const corpo = [
        `## ${ROTULO_TIPO[tipo]}`,
        "",
        d.texto,
        "",
        "## Contexto",
        "",
        `- Ferramenta: ${ferramenta ?? "não informada"}`,
        `- Versão do servidor: ${info?.versao ?? "desconhecida"}`,
        `- Perfil: ${info?.perfil ?? "desconhecido"}${r.ctx.somenteLeitura ? " (somente leitura)" : ""}`,
        `- Tabelas: ${VERSAO_TABELAS.programa} ${VERSAO_TABELAS.versao}`,
        `- Node e plataforma: ${amb ? `${amb.node}, ${amb.plataforma} ${amb.arquitetura}` : "desconhecidos"}`,
        "",
        "## Conferência",
        "",
        "- [ ] Reli o texto e ele não tem CPF, CNPJ, nomes, valores, número de recibo nem arquivo da declaração.",
      ].join("\n");
      const consulta = new URLSearchParams({
        title: tituloFinal,
        body: corpo,
        labels: ETIQUETA[tipo],
      });
      const linkPreenchido = `${LINK_NOVA_ISSUE}?${consulta.toString()}`;
      const texto = [
        `Texto da issue pronto. Abra ${LINK_NOVA_ISSUE} (ou o link preenchido abaixo), releia e envie: o MCP Imposto de Renda não envia nada.`,
        removidos > 0
          ? `${removidos} trecho(s) com cara de dado pessoal ou valor foram removidos e trocados por [removido].`
          : "Nenhum trecho sensível encontrado; mesmo assim, confira se não há nomes.",
        "",
        `Título: ${tituloFinal}`,
        "",
        corpo,
        "",
        `Link preenchido: ${linkPreenchido}`,
      ].join("\n");
      return {
        texto,
        dados: { link: LINK_NOVA_ISSUE, linkPreenchido, titulo: tituloFinal, corpo, removidos },
      };
    },
  );
}
