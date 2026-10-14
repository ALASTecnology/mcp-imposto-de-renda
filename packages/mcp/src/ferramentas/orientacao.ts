/**
 * Grupo "orientacao": ajuda por ficha (das notas de mapeamento) e orientação sobre serviços que
 * só existem fora do MCP Imposto de Renda. O servidor não
 * acessa a rede: as ferramentas só explicam o caminho e o que trazer de volta para a pasta
 * autorizada.
 */
import { listar, NOMES_TABELAS } from "@mcp-imposto-de-renda/core";
import { z } from "zod";
import { buscarAjuda, TOPICOS_AJUDA } from "../ajuda/index.js";
import type { GrupoFerramentas } from "./tipos.js";

/** Versão do programa oficial de que as tabelas embarcadas foram extraídas. */
export const VERSAO_TABELAS = {
  programa: "IRPF 2026",
  versao: "1.5",
  origem: "docs/mapeamento/tabelas/README.md",
} as const;

interface Orientacao {
  readonly titulo: string;
  readonly onde: string;
  readonly passos: readonly string[];
  readonly trazer: string;
}

export const SERVICOS: Readonly<Record<string, Orientacao>> = {
  gov_br: {
    titulo: "Conta gov.br",
    onde: "Portal gov.br (acesso com conta nível prata ou ouro).",
    passos: [
      "Crie ou eleve a conta gov.br para o nível prata ou ouro (validação facial ou banco credenciado).",
      "Use a conta para entrar no e-CAC, na declaração pré-preenchida e no Carnê-Leão Web.",
    ],
    trazer: "Nada: o MCP Imposto de Renda não usa nem guarda credenciais.",
  },
  pre_preenchida: {
    titulo: "Declaração pré-preenchida",
    onde: "Programa IRPF 2026 (Nova Declaração > Iniciar declaração a partir da pré-preenchida) ou e-CAC.",
    passos: [
      "No programa oficial, entre com a conta gov.br e crie a declaração a partir da pré-preenchida.",
      "Salve a declaração e use Ferramentas > Gravar Cópia de Segurança para gerar o .DBK.",
      "Coloque o .DBK na pasta autorizada e abra com abrir_declaracao para conferir e completar.",
    ],
    trazer: "O arquivo .DBK gravado pelo programa.",
  },
  carne_leao_web: {
    titulo: "Carnê-Leão Web",
    onde: "e-CAC, serviço Carnê-Leão Web (Meu Imposto de Renda).",
    passos: [
      "Escriture os rendimentos de PF e do exterior e as deduções mês a mês e emita os Darf 0190.",
      "No programa da declaração, use Importações > Carnê-Leão para trazer o demonstrativo anual.",
      "Grave a cópia de segurança e traga o .DBK, ou informe os valores com definir_rendimentos_pf_exterior.",
    ],
    trazer: "O .DBK com a ficha importada ou os totais mensais do demonstrativo.",
  },
  consulta_cpf: {
    titulo: "Consulta de nome e situação cadastral do CPF",
    onde: "Site da Receita Federal, serviço Consultar Situação Cadastral no CPF.",
    passos: [
      "Informe o CPF e a data de nascimento para conferir o nome e a situação cadastral.",
      "Use buscar_nome_por_documento para reaproveitar nomes já informados nas declarações da pasta.",
    ],
    trazer: "O nome conferido, para preencher a ficha correspondente.",
  },
  e_cac: {
    titulo: "e-CAC",
    onde: "Centro Virtual de Atendimento da Receita Federal (acesso gov.br).",
    passos: ["Consulte o extrato da declaração, pendências de malha, débitos e restituição."],
    trazer: "Informações para corrigir a declaração (retificadora com criar_retificadora).",
  },
  extrato_malha: {
    titulo: "Extrato da declaração e malha fina",
    onde: "e-CAC > Meu Imposto de Renda > Extrato da DIRPF.",
    passos: [
      "Veja o processamento, as pendências e o motivo de eventual retenção em malha.",
      "Se houver erro, crie a retificadora com criar_retificadora e transmita pelo programa oficial.",
    ],
    trazer: "O número do recibo da declaração entregue (12 dígitos).",
  },
  debito_automatico: {
    titulo: "Débito automático das quotas",
    onde: "Programa IRPF 2026, ficha Resumo (opção feita antes da transmissão).",
    passos: [
      "Informe a conta com definir_informacoes_bancarias e escolha débito automático.",
      "Transmita até a data limite da 1ª quota; depois do prazo do débito da 1ª quota, ele vale a partir da 2ª.",
    ],
    trazer: "Nada.",
  },
  darf_sicalc: {
    titulo: "Darf oficial e Sicalc",
    onde: "Programa IRPF 2026 (menu Imprimir > Darf) ou Sicalc Web da Receita Federal.",
    passos: [
      "Use gerar_darf para conferir código, vencimentos e valores.",
      "Emita o Darf com código de barras no programa ou no Sicalc e pague até o vencimento.",
    ],
    trazer: "Nada; guarde o comprovante de pagamento.",
  },
  gcap: {
    titulo: "Programa de Apuração dos Ganhos de Capital (GCAP)",
    onde: "Programa GCAP 2025, instalado separadamente.",
    passos: [
      "Preencha a alienação no GCAP e pague o Darf 4600 até o último dia útil do mês seguinte.",
      "No programa da declaração, use Importações > Ganhos de Capital; grave a cópia de segurança.",
    ],
    trazer:
      "O .DBK com o demonstrativo importado (a conversão do MCP Imposto de Renda preserva o detalhe do GCAP).",
  },
  livro_caixa_rural: {
    titulo: "Livro Caixa da Atividade Rural (LCDPR e programa LCAR)",
    onde: "Programa do Livro Caixa da Atividade Rural.",
    passos: [
      "Escriture receitas e despesas e exporte para a declaração pelo menu de importação do programa IRPF.",
      "Ou informe os totais mensais com definir_receitas_despesas_rurais.",
    ],
    trazer: "O .DBK com o demonstrativo ou os totais mensais.",
  },
  restituicao: {
    titulo: "Consulta da restituição",
    onde: "e-CAC ou site da Receita Federal, serviço Consultar Restituição.",
    passos: [
      "Consulte o lote e a data de crédito; resgate no banco em até um ano se o crédito falhar.",
    ],
    trazer: "Nada.",
  },
};

export const grupoOrientacao: GrupoFerramentas = {
  nome: "orientacao",
  descricao:
    "Orientação sobre serviços que só existem fora do MCP Imposto de Renda (sem acesso à rede).",
  registrar(r) {
    r.ferramenta(
      "orientar_servico_externo",
      {
        titulo: "Orientar sobre serviço externo",
        descricao:
          "Explica como usar um serviço que só existe fora do MCP Imposto de Renda (gov.br, pré-preenchida, Carnê-Leão Web, consulta de CPF, e-CAC, extrato e malha, débito automático, Darf e Sicalc, GCAP, Livro Caixa rural, restituição) e o que trazer de volta para a pasta autorizada. O MCP Imposto de Renda não acessa a rede.",
        entrada: {
          servico: z.enum(Object.keys(SERVICOS) as [string, ...string[]]),
        },
        saida: {
          titulo: z.string(),
          onde: z.string(),
          passos: z.array(z.string()),
          trazer: z.string(),
        },
      },
      ({ servico }) => {
        const o = SERVICOS[servico] as Orientacao;
        return {
          texto: [
            `${o.titulo} (${o.onde})`,
            ...o.passos.map((p, i) => `${i + 1}. ${p}`),
            `Trazer: ${o.trazer}`,
          ].join("\n"),
          dados: { titulo: o.titulo, onde: o.onde, passos: [...o.passos], trazer: o.trazer },
        };
      },
    );

    r.ferramenta(
      "obter_ajuda",
      {
        titulo: "Ajuda por ficha",
        descricao:
          "Devolve a ajuda de uma ficha, demonstrativo, menu ou regra do programa oficial, tirada das notas de mapeamento do MCP Imposto de Renda (onde fica, a quem se aplica, campos, validações, códigos e regras de cálculo, com a página da Ajuda do programa). Busca por identificador (ex.: F-IDENT, F-DEP) ou por palavras (ex.: \"despesas médicas\"); sem 'consulta', lista os identificadores, com filtro opcional por prefixo.",
        entrada: {
          consulta: z.string().max(200).optional(),
          prefixo: z
            .string()
            .max(20)
            .optional()
            .describe('Na listagem, só os tópicos cujo identificador começa assim (ex.: "F-").'),
          limite: z.number().int().min(1).max(10).optional(),
        },
        saida: {
          topicos: z.array(
            z.object({
              id: z.string(),
              nome: z.string(),
              fonte: z.string(),
              itens: z.array(z.object({ campo: z.string(), texto: z.string() })),
            }),
          ),
          lista: z.array(z.object({ id: z.string(), nome: z.string() })),
        },
      },
      ({ consulta, prefixo, limite }) => {
        if (consulta === undefined) {
          const lista = TOPICOS_AJUDA.filter(
            (t) => !prefixo || t.id.toUpperCase().startsWith(prefixo.toUpperCase()),
          ).map((t) => ({ id: t.id, nome: t.nome }));
          return {
            texto: `${lista.length} tópico(s):\n${lista.map((t) => `- ${t.id}: ${t.nome}`).join("\n")}`,
            dados: { topicos: [], lista },
          };
        }
        const topicos = buscarAjuda(consulta, limite ?? 3);
        const texto = topicos.length
          ? topicos
              .map((t) =>
                [`## ${t.id} ${t.nome}`, ...t.itens.map((i) => `- ${i.campo}: ${i.texto}`)].join(
                  "\n",
                ),
              )
              .join("\n\n")
          : "Nenhum tópico encontrado. Liste os identificadores sem 'consulta' ou use outras palavras.";
        return {
          texto,
          dados: {
            topicos: topicos.map((t) => ({
              id: t.id,
              nome: t.nome,
              fonte: t.fonte,
              itens: t.itens.map((i) => ({ campo: i.campo, texto: i.texto })),
            })),
            lista: [],
          },
        };
      },
    );

    r.ferramenta(
      "verificar_versao_tabelas",
      {
        titulo: "Versão das tabelas embarcadas",
        descricao:
          "Informa de qual versão do programa oficial vieram as tabelas de códigos e parâmetros embarcadas no MCP Imposto de Renda e quantos registros cada uma tem. Se houver versão mais nova do programa, confira as tabelas nele.",
        entrada: {},
        saida: {
          programa: z.string(),
          versao: z.string(),
          tabelas: z.array(z.object({ tabela: z.string(), registros: z.number() })),
        },
      },
      () => {
        const tabelas = NOMES_TABELAS.map((t) => ({ tabela: t, registros: listar(t).length }));
        return {
          texto: `Tabelas do ${VERSAO_TABELAS.programa} versão ${VERSAO_TABELAS.versao}:\n${tabelas
            .map((t) => `- ${t.tabela}: ${t.registros}`)
            .join("\n")}`,
          dados: { programa: VERSAO_TABELAS.programa, versao: VERSAO_TABELAS.versao, tabelas },
        };
      },
    );
  },
};
