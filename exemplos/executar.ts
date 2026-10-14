/**
 * Executa o roteiro de um exemplo contra o servidor real, em memória, e devolve os arquivos que o
 * exemplo publica: o `.DBK` gravado pelas ferramentas, a conversa completa e a saída do cálculo.
 *
 * Tudo roda numa pasta temporária, com relógio fixo, para que o resultado seja sempre o mesmo.
 */
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "@mcp-imposto-de-renda/mcp";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

/** Data e hora fixas usadas pelo servidor (backups) e nos arquivos da pasta temporária. */
export const RELOGIO = new Date("2026-04-10T12:00:00Z");

export interface Chamada {
  readonly ferramenta: string;
  readonly argumentos: Record<string, unknown>;
  /** Inclui a resposta em `calculo.md`. */
  readonly calculo?: boolean;
}

export interface Passo {
  /** O que a pessoa pede ao assistente, em linguagem natural. */
  readonly pedido: string;
  /** Ferramentas que o assistente chama para atender o pedido. */
  readonly chamadas: readonly Chamada[];
}

export interface Roteiro {
  readonly titulo: string;
  readonly passos: readonly Passo[];
}

interface Resposta {
  readonly texto: string;
  readonly erro: boolean;
}

function cerca(texto: string): string {
  let c = "```";
  while (texto.includes(c)) c += "`";
  return c;
}

function bloco(linguagem: string, texto: string): string {
  const c = cerca(texto);
  return `${c}${linguagem}\n${texto.trimEnd()}\n${c}`;
}

/** Fixa a data dos arquivos da pasta, para `listar_arquivos` devolver sempre o mesmo texto. */
function fixarDatas(dir: string): void {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isFile()) utimesSync(caminho, RELOGIO, RELOGIO);
  }
}

/**
 * Roda o roteiro e devolve os arquivos do exemplo (nome relativo à pasta do exemplo e conteúdo).
 * Falha se alguma ferramenta devolver erro.
 */
export async function executarRoteiro(roteiro: Roteiro): Promise<Map<string, Buffer>> {
  const dir = mkdtempSync(join(tmpdir(), "mcp-imposto-de-renda-exemplo-"));
  const servidor = createServer({ diretorioAutorizado: dir, relogio: () => RELOGIO });
  const [a, b] = InMemoryTransport.createLinkedPair();
  const cliente = new Client({ name: "exemplos", version: "1" });
  await Promise.all([servidor.connect(a), cliente.connect(b)]);
  const conversa: string[] = [
    `# Conversa: ${roteiro.titulo}`,
    "",
    "> Arquivo gerado por `pnpm exemplos` a partir de `roteiro.ts`, com as respostas reais do",
    "> servidor. Não edite à mão. Todos os nomes, CPFs, CNPJs e valores são fictícios.",
    "",
  ];
  const calculo: string[] = [
    `# Saída do cálculo: ${roteiro.titulo}`,
    "",
    "> Arquivo gerado por `pnpm exemplos`. Respostas reais das ferramentas de cálculo e",
    "> conferência para a declaração deste exemplo. Todos os dados são fictícios.",
    "",
  ];
  try {
    let n = 0;
    for (const passo of roteiro.passos) {
      n += 1;
      conversa.push(`## ${n}. Pedido`, "", `**Você:** ${passo.pedido}`, "");
      for (const chamada of passo.chamadas) {
        const r = (await cliente.callTool({
          name: chamada.ferramenta,
          arguments: chamada.argumentos,
        })) as { content: { type: string; text: string }[]; isError?: boolean };
        fixarDatas(dir);
        const resposta: Resposta = {
          texto: r.content
            .filter((c) => c.type === "text")
            .map((c) => c.text)
            .join("\n")
            .split(dir)
            .join("<pasta>"),
          erro: r.isError === true,
        };
        if (resposta.erro) {
          throw new Error(`${chamada.ferramenta} devolveu erro: ${resposta.texto}`);
        }
        conversa.push(
          `**Assistente chama \`${chamada.ferramenta}\`:**`,
          "",
          bloco("json", JSON.stringify(chamada.argumentos, null, 2)),
          "",
          "**Resposta:**",
          "",
          bloco("text", resposta.texto),
          "",
        );
        if (chamada.calculo) {
          calculo.push(`## \`${chamada.ferramenta}\``, "", bloco("text", resposta.texto), "");
        }
      }
    }
    const arquivos = new Map<string, Buffer>();
    for (const nome of readdirSync(dir).sort()) {
      if (/\.(DBK|DEC)$/i.test(nome)) arquivos.set(nome, readFileSync(join(dir, nome)));
    }
    arquivos.set("conversa.md", Buffer.from(`${conversa.join("\n").trimEnd()}\n`));
    arquivos.set("calculo.md", Buffer.from(`${calculo.join("\n").trimEnd()}\n`));
    return arquivos;
  } finally {
    await cliente.close();
    rmSync(dir, { recursive: true, force: true });
  }
}
