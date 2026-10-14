/**
 * Prompts MCP: roteiros em pt-BR que o usuário pode acionar no cliente.
 */
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { URI_AVISO_LEGAL } from "./recursos.js";

function mensagem(texto: string): GetPromptResult {
  return { messages: [{ role: "user", content: { type: "text", text: texto } }] };
}

export function textoPrepararDeclaracao(arquivo?: string): string {
  const inicio = arquivo
    ? `Vamos preparar a minha declaração do IRPF 2026 a partir do arquivo "${arquivo}" da pasta autorizada. Comece com abrir_declaracao.`
    : "Vamos preparar a minha declaração do IRPF 2026 (ano-calendário 2025) do zero.";
  return `${inicio}

Antes de tudo, leia o recurso ${URI_AVISO_LEGAL} e me lembre de que os dados que eu informar vão para o provedor de LLM deste chat.

Conduza a coleta em etapas, uma ficha por vez, sempre me pedindo os documentos de origem:
1. Identificação: nome, CPF, data de nascimento, endereço, ocupação e se a declaração é original ou retificadora.
2. Dependentes: para cada um, CPF, data de nascimento e relação de dependência (use buscar_codigo na tabela dependentes).
3. Rendimentos de pessoa jurídica: um informe de rendimentos por fonte pagadora (CNPJ, rendimentos, INSS, IRRF, 13º).
4. Rendimentos de pessoa física e do exterior (carnê-leão), mês a mês.
5. Rendimentos isentos e de tributação exclusiva (poupança, dividendos, 13º, aplicações).
6. Pagamentos efetuados: saúde, instrução, previdência complementar, pensão (com CPF/CNPJ de quem recebeu).
7. Bens e direitos e dívidas: situação em 31/12/2024 e 31/12/2025 de cada item.

Depois de cada etapa, use simular_imposto ou comparar_modelos para mostrar o efeito no imposto, e explicar_calculo quando eu pedir detalhes.
No fim, use validar_declaracao, resolva as pendências comigo e, se eu pedir, grave com converter_modelo_para_dbk.
Lembre-me de abrir o arquivo no programa oficial da Receita Federal, conferir e transmitir por ele.
Nunca invente valores: se faltar um dado, pergunte.`;
}

export function textoRevisarMalhaFina(arquivo?: string): string {
  const alvo = arquivo
    ? `o arquivo "${arquivo}" da pasta autorizada`
    : "a declaração que eu vou informar";
  return `Revise ${alvo} procurando riscos de malha fina no IRPF 2026.

Passos:
1. ${arquivo ? "Use abrir_declaracao e verificar_integridade_arquivo." : "Peça os dados das fichas."}
2. Rode validar_declaracao e explique cada pendência (erros impedem a entrega; avisos indicam risco).
3. Confira os pontos que mais caem em malha: rendimentos de dependentes omitidos, despesas médicas sem CPF/CNPJ do prestador ou reembolsadas, IRRF diferente do informe, pensão alimentícia sem decisão judicial ou escritura, carnê-leão não recolhido, variação patrimonial incompatível com a renda declarada, bens sem situação em 31/12 coerente.
4. Use comparar_modelos para confirmar o modelo de tributação mais vantajoso.
5. Liste as correções sugeridas em ordem de risco, citando a ficha e o documento que comprova cada valor.

Lembre que o AutoIR não é serviço oficial: a conferência final e a transmissão são feitas no programa da Receita Federal.`;
}

export function registrarPrompts(server: McpServer): void {
  server.registerPrompt(
    "preparar_declaracao",
    {
      title: "Preparar a declaração passo a passo",
      description:
        "Roteiro guiado de coleta dos informes e preenchimento das fichas do IRPF 2026, com simulação do imposto a cada etapa.",
      argsSchema: {
        arquivo: z
          .string()
          .max(255)
          .optional()
          .describe("DBK existente na pasta autorizada, para partir dele (opcional)."),
      },
    },
    ({ arquivo }) => mensagem(textoPrepararDeclaracao(arquivo)),
  );

  server.registerPrompt(
    "revisar_malha_fina",
    {
      title: "Revisar riscos de malha fina",
      description:
        "Revisão da declaração em busca de pendências e inconsistências que costumam levar à malha fina.",
      argsSchema: {
        arquivo: z
          .string()
          .max(255)
          .optional()
          .describe("DBK ou DEC na pasta autorizada a revisar (opcional)."),
      },
    },
    ({ arquivo }) => mensagem(textoRevisarMalhaFina(arquivo)),
  );
}
