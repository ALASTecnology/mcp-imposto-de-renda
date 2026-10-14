// Gera a referência completa das ferramentas (docs/ferramentas/) a partir do código real:
// saida/ferramentas.json (tools/list, com os esquemas e as anotações), saida/exemplos.json
// (uma chamada real de cada ferramenta) e a matriz de cobertura do programa oficial.
// Uso, a partir da raiz: node tools/docs/referencia.mjs
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const aqui = (p) => fileURLToPath(new URL(p, import.meta.url));
const lerJson = (p) => JSON.parse(readFileSync(aqui(p), "utf8"));
const catalogo = lerJson("./saida/ferramentas.json");
const exemplos = lerJson("./saida/exemplos.json");
const matriz = readFileSync(aqui("../../docs/mapeamento/matriz-cobertura.md"), "utf8");
const DESTINO = aqui("../../docs/ferramentas/");
const LINK_MATRIZ = "../mapeamento/matriz-cobertura.md";

const AVISO_GERADO =
  "<!-- Arquivo gerado por `pnpm docs:catalogo` (tools/docs/referencia.mjs). Não edite à mão. -->";

const DESCRICAO_VALOR =
  'Valor em reais. Texto = REAIS no formato brasileiro ("1.234,56" ou "1234,56"); ' +
  "número inteiro = CENTAVOS (123456 = R$ 1.234,56). Nunca use ponto como separador decimal.";

const SOBRE_GRUPOS = {
  calculo:
    "Calcula o imposto do exercício a partir de dados informados na conversa, sem ler arquivo.",
  declaracao: "Lê e grava o arquivo da declaração e converte entre o `.DBK` e o modelo JSON.",
  fichas: "Devolve uma ficha isolada, no formato do modelo.",
  edicao:
    "Inclui, altera, remove e lista os lançamentos de cada ficha. Toda gravação valida a declaração, guarda cópia de segurança do arquivo anterior e devolve as pendências.",
  ciclo:
    "Cria, retifica, copia, restaura e exclui declarações, define as opções do Resumo e importa informes colados como texto.",
  validacao: "Confere documentos e aplica as regras de consistência da declaração.",
  tabelas: "Consulta as tabelas de códigos embarcadas do exercício.",
  arquivos: "Lista os arquivos da pasta autorizada e confere os controles de integridade.",
  saidas: "Etapa final: Darf, relatório, comunicação de saída e passo a passo da transmissão.",
  calculadoras: "Calculadoras auxiliares que funcionam sem declaração aberta.",
  orientacao: "Ajuda do programa e orientação sobre serviços que só existem fora do servidor.",
};

// ---------------------------------------------------------------------------------------------
// Utilidades de texto

const celula = (t) =>
  String(t ?? "")
    .replace(/\s+/g, " ")
    .replace(/\|/g, "\\|")
    .trim();

function limparDescricao(t) {
  if (!t) return { texto: "", valor: false };
  // Dentro das listas de campos ("valor = <texto padrão>)"), o texto padrão vira só um rótulo.
  let texto = t.split(`valor = ${DESCRICAO_VALOR})`).join("valor = valor monetário)");
  const valor = texto.includes(DESCRICAO_VALOR);
  texto = texto.split(` ${DESCRICAO_VALOR}`).join("").split(DESCRICAO_VALOR).join("");
  return { texto: texto.trim(), valor };
}

function cerca(texto) {
  let c = "```";
  while (texto.includes(c)) c += "`";
  return c;
}

const bloco = (linguagem, texto) => {
  const c = cerca(texto);
  return `${c}${linguagem}\n${texto.trimEnd()}\n${c}`;
};

const LIMITE_SEGURO = 9007199254740991;

// ---------------------------------------------------------------------------------------------
// JSON Schema para tabela de parâmetros

function rotuloTipo(s) {
  if (!s || typeof s !== "object") return "qualquer";
  if (s.enum) {
    const v = s.enum.map((x) => `\`${JSON.stringify(x)}\``);
    return v.length > 8
      ? `um de ${v.length} valores (${v.slice(0, 6).join(", ")}, ...)`
      : v.join(" | ");
  }
  if (s.const !== undefined) return `\`${JSON.stringify(s.const)}\``;
  if (s.anyOf || s.oneOf) {
    const partes = (s.anyOf ?? s.oneOf).map(rotuloTipo);
    if (partes.length === 2 && partes.includes("texto") && partes.includes("inteiro")) {
      return "texto ou inteiro";
    }
    return [...new Set(partes)].join(" ou ");
  }
  const tipos = Array.isArray(s.type) ? s.type : [s.type];
  const nomes = tipos.map((t) => {
    switch (t) {
      case "string":
        return "texto";
      case "integer": {
        const faixa =
          s.minimum !== undefined &&
          s.maximum !== undefined &&
          Math.abs(s.minimum) < LIMITE_SEGURO &&
          s.maximum < LIMITE_SEGURO
            ? ` (${s.minimum} a ${s.maximum})`
            : s.minimum === 0 || s.minimum === 1
              ? ` (a partir de ${s.minimum})`
              : "";
        return `inteiro${faixa}`;
      }
      case "number":
        return "número";
      case "boolean":
        return "booleano";
      case "null":
        return "nulo";
      case "array":
        return `lista de ${rotuloTipo(s.items)}`;
      case "object":
        return s.properties ? "objeto" : "objeto livre";
      default:
        return "qualquer";
    }
  });
  return nomes.join(" ou ");
}

function detalhes(s) {
  const d = [];
  if (s.default !== undefined) d.push(`padrão: \`${JSON.stringify(s.default)}\``);
  if (s.maxItems !== undefined) d.push(`até ${s.maxItems} itens`);
  if (s.pattern) d.push(`formato \`${s.pattern}\``);
  if (typeof s.maxLength === "number" && s.type === "string")
    d.push(`até ${s.maxLength} caracteres`);
  return d;
}

function linhasParametros(schema, prefixo = "", obrigatoriosPai = true, profundidade = 0) {
  const linhas = [];
  const props = schema?.properties ?? {};
  const req = new Set(schema?.required ?? []);
  for (const [nome, s] of Object.entries(props)) {
    const caminho = prefixo ? `${prefixo}.${nome}` : nome;
    const { texto, valor } = limparDescricao(s.description);
    const extras = detalhes(s);
    let tipo = rotuloTipo(s);
    if (valor) tipo = "valor monetário";
    const descricao = [texto, extras.length ? `(${extras.join("; ")})` : ""]
      .filter(Boolean)
      .join(" ");
    linhas.push({
      caminho,
      tipo,
      obrigatorio: obrigatoriosPai && req.has(nome),
      descricao,
    });
    if (profundidade < 3) {
      if (s.type === "object" && s.properties) {
        linhas.push(
          ...linhasParametros(s, caminho, obrigatoriosPai && req.has(nome), profundidade + 1),
        );
      } else if (s.type === "array" && s.items?.type === "object" && s.items.properties) {
        linhas.push(
          ...linhasParametros(
            s.items,
            `${caminho}[]`,
            obrigatoriosPai && req.has(nome),
            profundidade + 1,
          ),
        );
      }
    }
  }
  return linhas;
}

function tabelaParametros(schema) {
  const linhas = linhasParametros(schema);
  if (!linhas.length) return ["Sem parâmetros."];
  const t = ["| Parâmetro | Tipo | Obrigatório | Descrição |", "| --- | --- | --- | --- |"];
  for (const l of linhas) {
    t.push(
      `| \`${l.caminho}\` | ${celula(l.tipo)} | ${l.obrigatorio ? "**sim**" : "não"} | ${celula(l.descricao) || " "} |`,
    );
  }
  return t;
}

function tabelaSaida(schema) {
  const props = schema?.properties ?? {};
  const nomes = Object.keys(props);
  if (!nomes.length) return [];
  const t = ["| Campo | Tipo | Descrição |", "| --- | --- | --- |"];
  for (const n of nomes) {
    const s = props[n];
    const { texto } = limparDescricao(s.description);
    t.push(`| \`${n}\` | ${celula(rotuloTipo(s))} | ${celula(texto) || " "} |`);
  }
  return t;
}

// ---------------------------------------------------------------------------------------------
// Exemplos: corte das respostas longas

function encurtar(v, prof = 0) {
  if (Array.isArray(v)) {
    if (prof >= 5) return [`(${v.length} itens)`];
    const r = v.slice(0, 2).map((x) => encurtar(x, prof + 1));
    if (v.length > 2) r.push(`(+${v.length - 2} itens omitidos)`);
    return r;
  }
  if (v && typeof v === "object") {
    if (prof >= 5) return "(objeto omitido)";
    const r = {};
    const chaves = Object.keys(v);
    for (const k of chaves.slice(0, 25)) r[k] = encurtar(v[k], prof + 1);
    if (chaves.length > 25) r["(omitidos)"] = `${chaves.length - 25} campos`;
    return r;
  }
  if (typeof v === "string" && v.length > 240) return `${v.slice(0, 240)} (...)`;
  return v;
}

function encurtarTexto(t, max = 24) {
  const linhas = t.split("\n");
  if (linhas.length <= max) return t;
  return `${linhas.slice(0, max).join("\n")}\n(... mais ${linhas.length - max} linhas)`;
}

// ---------------------------------------------------------------------------------------------
// Matriz de cobertura: ferramenta -> funções do programa oficial

function lerMatriz() {
  const mapa = new Map();
  for (const linha of matriz.split("\n")) {
    if (!/^\| [A-Z][A-Z0-9]*-[A-Z0-9-]+ \|/.test(linha)) continue;
    const cols = linha
      .slice(1, -1)
      .split(/(?<!\\)\|/)
      .map((c) => c.trim());
    if (cols.length < 6) continue;
    const [id, funcao, , , prioridade, status] = cols;
    const m = status.match(/^(implementada|parcial)\s*\((.*)\)/);
    if (!m) continue;
    for (const nome of m[2].matchAll(/`([a-z0-9_]+)`/g)) {
      if (!mapa.has(nome[1])) mapa.set(nome[1], []);
      mapa.get(nome[1]).push({ id, funcao, prioridade, status: m[1] });
    }
  }
  return mapa;
}
const COBERTURA = lerMatriz();

// ---------------------------------------------------------------------------------------------
// Anotações

const simNao = (v) => (v ? "sim" : "não");

function tabelaAnotacoes(a) {
  return [
    "| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |",
    "| --- | --- | --- | --- |",
    `| ${simNao(a.readOnlyHint)} | ${simNao(a.destructiveHint)} | ${simNao(a.idempotentHint)} | ${simNao(a.openWorldHint)} |`,
  ];
}

// ---------------------------------------------------------------------------------------------
// Páginas

const grupos = catalogo.grupos.filter((g) => g.ferramentas.length);
const todas = grupos.flatMap((g) => g.ferramentas.map((f) => ({ ...f, grupo: g.nome })));
const totalEscrita = todas.filter((f) => f.escrita).length;

// Fichas em lista: editar_, remover_ e listar_ herdam a cobertura da ferramenta de inclusão, que é
// a citada na matriz.
const IRMAO = new Map();
for (const g of grupos) {
  const fs = g.ferramentas;
  for (let i = 0; i + 3 < fs.length; i++) {
    const [a, e, r, l] = fs.slice(i, i + 4);
    if (
      /^adicionar_/.test(a.nome) &&
      /^editar_/.test(e.nome) &&
      /^remover_/.test(r.nome) &&
      /^listar_/.test(l.nome)
    ) {
      for (const x of [e, r, l]) IRMAO.set(x.nome, a.nome);
      i += 3;
    }
  }
}

function secaoFerramenta(f, g) {
  const L = [];
  const { texto } = limparDescricao(f.descricao);
  L.push(`## \`${f.nome}\``, "");
  L.push(
    `**${f.titulo}**. ${f.escrita ? "Grava na pasta autorizada." : "Não grava nada."}${g.exigePasta ? " Exige `--dir`." : ""}`,
    "",
  );
  L.push(texto, "");
  L.push(...tabelaAnotacoes(f.anotacoes), "");
  if (f.escrita) {
    L.push(
      "Some do servidor com `--somente-leitura`. Grava de forma atômica e guarda o conteúdo anterior em `.mcp-imposto-de-renda-backups`.",
      "",
    );
  }
  L.push("### Parâmetros", "", ...tabelaParametros(f.entrada), "");
  const saida = tabelaSaida(f.saida);
  if (saida.length) L.push("### Resposta estruturada", "", ...saida, "");
  const ex = exemplos[f.nome];
  if (ex) {
    L.push("### Exemplo", "", "Chamada (`tools/call`, campo `arguments`):", "");
    L.push(bloco("json", JSON.stringify(ex.argumentos, null, 2)), "");
    L.push("Resposta em texto:", "");
    L.push(bloco("text", encurtarTexto(ex.texto)), "");
    // Quando o texto já traz os dados do arquivo em JSON, a resposta estruturada só repetiria.
    if (ex.dados && !ex.texto.includes("<dados_do_arquivo")) {
      L.push(
        "<details>",
        "<summary>Resposta estruturada (<code>structuredContent</code>)</summary>",
        "",
      );
      L.push(bloco("json", JSON.stringify(encurtar(ex.dados), null, 2)), "", "</details>", "");
    }
  }
  const irmao = IRMAO.get(f.nome);
  const propria = COBERTURA.get(f.nome) ?? [];
  const cob = propria.length ? propria : irmao ? (COBERTURA.get(irmao) ?? []) : [];
  L.push("### Funções do programa oficial", "");
  if (!propria.length && irmao && cob.length) {
    L.push(
      `A matriz cita a ficha pela ferramenta de inclusão, [\`${irmao}\`](#${irmao}); as funções abaixo valem para as quatro ferramentas da ficha.`,
      "",
    );
  }
  if (!cob.length) {
    L.push(
      `Sem função correspondente na [matriz de cobertura](${LINK_MATRIZ}#matriz): é recurso próprio do servidor.`,
      "",
    );
  } else {
    const mostrar = cob.slice(0, 8);
    L.push(
      `Aparece em ${cob.length} ${cob.length === 1 ? "linha" : "linhas"} da [matriz de cobertura](${LINK_MATRIZ}#matriz):`,
      "",
    );
    for (const c of mostrar) L.push(`- \`${c.id}\` ${c.funcao} (${c.prioridade}, ${c.status})`);
    if (cob.length > mostrar.length)
      L.push(`- e mais ${cob.length - mostrar.length} linhas na matriz.`);
    L.push("");
  }
  L.push("[Voltar ao início](#topo) · [Índice das ferramentas](README.md)", "");
  return L;
}

function paginaGrupo(g) {
  const L = [AVISO_GERADO, "", '<a id="topo"></a>', "", `# Grupo \`${g.nome}\``, ""];
  const desc = g.descricao.replace(/\.$/, "");
  L.push(
    `${desc.charAt(0).toUpperCase()}${desc.slice(1)}. ${SOBRE_GRUPOS[g.nome] ?? ""}`.trim(),
    "",
  );
  const esc = g.ferramentas.filter((f) => f.escrita).length;
  L.push(
    `**${g.ferramentas.length} ferramentas**, ${esc} delas gravam na pasta autorizada.${g.exigePasta ? " O grupo só é registrado quando o servidor recebe `--dir`." : " O grupo funciona mesmo sem `--dir`."}`,
    "",
  );
  L.push("| Ferramenta | Título | Grava? |", "| --- | --- | --- |");
  for (const f of g.ferramentas) {
    L.push(
      `| [\`${f.nome}\`](#${f.nome}) | ${celula(f.titulo)} | ${f.escrita ? "**sim**" : "não"} |`,
    );
  }
  L.push("");
  for (const f of g.ferramentas) L.push(...secaoFerramenta(f, g));
  return `${L.join("\n").trimEnd()}\n`;
}

function paginaIndice() {
  const L = [AVISO_GERADO, "", "# Referência das ferramentas", ""];
  L.push(
    `Referência completa das **${todas.length} ferramentas** do servidor, em **${grupos.length} grupos**, gerada a partir do \`tools/list\` real: nome, descrição, parâmetros com tipo e obrigatoriedade tirados do JSON Schema, anotações MCP, campos da resposta estruturada, um exemplo de chamada executado contra o servidor com dados fictícios e as funções correspondentes do programa oficial.`,
    "",
  );
  L.push(
    `${totalEscrita} ferramentas gravam na pasta autorizada e somem com \`--somente-leitura\` (que deixa ${catalogo.totalSomenteLeitura}). Sem \`--dir\`, os grupos que exigem pasta não são registrados e restam ${catalogo.totalSemPasta}.`,
    "",
  );
  L.push("## Convenções", "");
  L.push(
    '- **Valores monetários na entrada:** texto é sempre em reais no formato brasileiro (`"1.234,56"`); número inteiro é sempre em centavos (`123456` = R$ 1.234,56). Nunca use ponto como separador decimal. Nas tabelas, esses campos aparecem como *valor monetário*.',
    "- **Modelo JSON da declaração:** valores em centavos (inteiro), datas `AAAA-MM-DD`, CPF e CNPJ só com dígitos. É o formato devolvido por `converter_dbk_para_modelo` e aceito por `converter_modelo_para_dbk`.",
    "- **Arquivos:** sempre nome relativo à pasta autorizada (`--dir`). Caminhos absolutos, `..`, links e arquivos ocultos são recusados.",
    "- **Resposta:** toda ferramenta devolve um texto legível (`content`) e os mesmos dados estruturados (`structuredContent`), validados pelo `outputSchema`. Erros voltam com `isError: true` e mensagem em pt-BR.",
    "- **Perfis:** com `--perfil essencial` o servidor expõe só a declaração inteira sem os atalhos `editar_*`, `remover_*` e `listar_*` por ficha (cobertos por `editar_lancamento`, `remover_lancamento` e `listar_lancamentos`) e sem as calculadoras; com `--perfil consulta`, só leitura e cálculo. `--grupos` e `--sem-grupos` recortam por grupo. Veja `mcp-imposto-de-renda --ajuda`.",
    "- **Anotações:** ferramentas que só leem são `readOnlyHint: true` e `idempotentHint: true`; as que gravam são `destructiveHint: true`, para o cliente pedir confirmação. Nenhuma acessa a rede (`openWorldHint: false`).",
    "- **Exemplos:** cada exemplo foi executado de verdade, em pasta temporária com relógio fixo e com as [declarações de exemplo](../../exemplos/README.md). Respostas longas aparecem cortadas.",
    "",
  );
  L.push("## Grupos", "");
  L.push(
    "| Grupo | Ferramentas | Gravam | Exige `--dir` | Para que serve |",
    "| --- | --- | --- | --- | --- |",
  );
  for (const g of grupos) {
    const esc = g.ferramentas.filter((f) => f.escrita).length;
    L.push(
      `| [\`${g.nome}\`](${g.nome}.md) | ${g.ferramentas.length} | ${esc} | ${g.exigePasta ? "sim" : "não"} | ${celula(g.descricao)} |`,
    );
  }
  L.push(`| **Total** | **${todas.length}** | **${totalEscrita}** | | |`, "");
  L.push("## Todas as ferramentas", "");
  L.push("| Ferramenta | Grupo | O que faz | Grava? |", "| --- | --- | --- | --- |");
  for (const f of [...todas].sort((a, b) => a.nome.localeCompare(b.nome))) {
    L.push(
      `| [\`${f.nome}\`](${f.grupo}.md#${f.nome}) | \`${f.grupo}\` | ${celula(f.titulo)} | ${f.escrita ? "**sim**" : "não"} |`,
    );
  }
  L.push("");
  L.push("## Prompts", "");
  L.push("| Prompt | Título | Descrição | Argumentos |", "| --- | --- | --- | --- |");
  for (const p of catalogo.promptsDetalhe ?? []) {
    const args = (p.arguments ?? [])
      .map((a) => `\`${a.name}\`${a.required ? " (obrigatório)" : ""}: ${a.description ?? ""}`)
      .join("; ");
    L.push(
      `| \`${p.name}\` | ${celula(p.title)} | ${celula(p.description)} | ${celula(args) || "nenhum"} |`,
    );
  }
  L.push("", "## Recursos", "");
  L.push("| URI | Título | Descrição |", "| --- | --- | --- |");
  for (const r of catalogo.recursosDetalhe ?? []) {
    L.push(`| \`${r.uri}\` | ${celula(r.title)} | ${celula(r.description)} |`);
  }
  L.push("", "## Como regenerar", "");
  L.push(
    "Esta pasta é gerada por `pnpm docs:catalogo`, que sobe o servidor a partir do código-fonte, lê o `tools/list`, executa as chamadas de [`tools/docs/exemplos-ferramentas.ts`](../../tools/docs/exemplos-ferramentas.ts) e escreve uma página por grupo. Ferramenta nova sem exemplo faz a geração falhar.",
    "",
  );
  return `${L.join("\n").trimEnd()}\n`;
}

// ---------------------------------------------------------------------------------------------

const semExemplo = todas.filter((f) => !exemplos[f.nome]).map((f) => f.nome);
if (semExemplo.length) {
  console.error(`Ferramentas sem exemplo em exemplos-ferramentas.ts: ${semExemplo.join(", ")}`);
  process.exit(1);
}
mkdirSync(DESTINO, { recursive: true });
for (const g of grupos) writeFileSync(`${DESTINO}${g.nome}.md`, paginaGrupo(g));
writeFileSync(`${DESTINO}README.md`, paginaIndice());
console.log(
  JSON.stringify({
    paginas: grupos.length + 1,
    ferramentas: todas.length,
    comCobertura: todas.filter((f) => COBERTURA.has(f.nome) || COBERTURA.has(IRMAO.get(f.nome)))
      .length,
  }),
);
