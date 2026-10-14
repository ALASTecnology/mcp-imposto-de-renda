# Testes do MCP Imposto de Renda

Como o projeto é testado, como rodar cada suíte e o que cada uma garante. Todos os dados de
teste são sintéticos: nenhum CPF, nome ou valor pertence a uma pessoa real.

## Pirâmide de testes

| Camada | Onde | O que garante |
| --- | --- | --- |
| Unitários | `packages/core/test/{dbk,calc,model,validate,tabelas,conversao}`, `centavos.test.ts`, `documento.test.ts` | cada função do core com valores conferidos à mão |
| Casos de referência (golden) | `packages/core/test/golden/2026/*.json` e `packages/core/test/fixtures/dbk/2026/*.DBK\|.DEC` | o motor e o codec reproduzem o programa oficial ao centavo e byte a byte |
| Propriedades e fuzzing | `packages/core/test/integridade/` | leis que valem para qualquer entrada, em milhares de entradas geradas com semente fixa |
| Segurança | `packages/core/test/seguranca/`, `packages/mcp/test/seguranca.test.ts` | entradas hostis, ausência de E/S no core e de rede no servidor |
| Integração | `packages/mcp/test/` | ferramentas MCP pelo transporte em memória do SDK, pasta autorizada, backups |
| Fumaça | `apps/cli/test/stdio.test.ts` | o executável sobe e responde via stdio |

A base é larga: a maior parte da confiança vem do core, que é puro (sem disco, rede nem relógio)
e por isso pode ser testado exaustivamente e rápido.

## Como rodar

```sh
pnpm install
pnpm test                                     # tudo (vitest)
pnpm vitest run packages/core                 # só o core
pnpm vitest run packages/core/test/integridade  # propriedades e fuzzing
pnpm vitest run packages/core/test/seguranca    # entradas hostis e varredura de E/S
pnpm vitest run packages/core/test/calc/golden.test.ts packages/core/test/dbk/fixtures.test.ts
pnpm lint && pnpm typecheck                   # biome e tsc
```

Cobertura (a mesma linha de comando do job `coverage` do CI, em `.github/workflows/ci.yml`):

```sh
pnpm vitest run --coverage.enabled --coverage.provider=v8 \
  --coverage.include='packages/*/src/**' --coverage.include='apps/*/src/**' \
  --coverage.reporter=text-summary
```

O relatório vai para `coverage/`, que é ignorado pelo git.

## Casos de referência e harness

O harness `tools/referencia` (ver o README dele) usa o programa oficial, baixado pelo próprio
desenvolvedor e nunca versionado (ADR 0002), para montar declarações sintéticas a partir de
`tools/referencia/casos/*.json`. Para cada caso ele grava:

- `packages/core/test/golden/2026/<id>.json`: entrada no formato do motor e o bloco `esperado`
  calculado pelo programa. `calc/golden.test.ts` exige todos os campos de `esperado` ao centavo.
- `packages/core/test/fixtures/dbk/2026/<id>.DBK` e `.DEC`: os arquivos gravados pelo programa.
  São 48 pares, 96 arquivos. `dbk/fixtures.test.ts` e `integridade/fixtures.test.ts` os usam.

Divergência com um caso de referência nunca se corrige ajustando o motor ao número: investiga-se
a regra e registra-se em `docs/regras/irpf-2026.md`. Nem os goldens nem as fixtures são editados
à mão; mudam só quando o harness é rodado de novo.

## Integridade do codec (`integridade/fixtures.test.ts` e `codec-fuzz.test.ts`)

Contrato: `lerArquivo` devolve registros ou lança `ArquivoDeclaracaoError` (ou subclasse), nunca
outro erro; quando aceita a entrada, regravar reproduz os mesmos bytes; e nenhuma alteração de um
byte num arquivo do programa passa despercebida por `verificarControles`.

- Fixtures: ida e volta das 96 fixtures, conversão de cada DEC em DBK idêntica ao DBK do
  programa, um byte trocado por linha de cada fixture mais 15 posições sorteadas, varredura
  exaustiva de todas as posições do menor par (header, fichas, `T9` e recibo) e o sinal de menos
  em cada campo monetário zerado.
- Fuzzing com semente fixa: 5.000 entradas de bytes aleatórios, 5.000 com header válido seguido
  de lixo, 6.000 mutações estruturais (linha truncada ou longa, só LF, só CR, sem terminador,
  tipo desconhecido, caractere estranho em campo, quebra no meio da linha, linhas duplicadas,
  removidas ou trocadas, linha vazia, bytes aleatórios, arquivo cortado), 2.000 valores numéricos
  nos limites do campo e toda a faixa latin-1.
- Campos numéricos: letras, `+`, `-` fora da primeira posição, `--`, ponto, vírgula, espaço,
  notação científica, hexadecimal, sinal em campo sem casas decimais, zero com sinal, TAB, VT, FF
  e NBSP.
- Caracteres fora do latin-1 na gravação (bidi, largura zero, separador de linha, euro, emoji,
  surrogate isolado) e CR ou LF dentro de campo de texto.
- Tamanho e tempo: arquivo acima de `TAMANHO_MAXIMO_ARQUIVO` (20 MB) é recusado em menos de 50 ms
  e sem alocar a decodificação; um arquivo válido de 17 MB é lido; 20 MB de CRLF falham na
  primeira linha; o campo de 512 posições com espaços e um caractere no fim (o pior caso de uma
  regex de espaços finais) custa o mesmo que uma linha comum; o tempo médio por byte do fuzzing
  fica abaixo de 0,05 ms.

A semente e a iteração aparecem na mensagem de qualquer falha, o que torna o caso reproduzível
(`gerador(semente)` em `integridade/apoio.ts`, mulberry32, sem dependência externa).

## Propriedades do cálculo (`integridade/calculo-propriedades.test.ts`)

Em 1.500 declarações sintéticas por propriedade (PJ, PF e exterior, dependentes, pagamentos de
todos os grupos, imposto pago e doações):

- tabela anual não decrescente centavo a centavo em torno de cada limite de faixa e em 20.000
  bases sorteadas, nunca negativa e nunca acima de 27,5% da base;
- imposto devido entre zero e 27,5% da base nos dois modelos; desconto simplificado igual a
  `min(20% truncado, teto)`; dedução de incentivo nunca acima do imposto;
- mais rendimento nunca dá menos imposto e mais dedução nunca dá mais imposto no completo, de
  forma estrita sem doações;
- com doações, a mesma monotonicidade vale com tolerância de 4 centavos. Os limites de incentivo
  são percentuais truncados do imposto e podem subir juntos: há um caso concreto em que R$ 0,01 a
  mais de rendimento reduz o imposto devido em R$ 0,02 (imposto da tabela de R$ 16.646,99
  para R$ 16.647,00, com os limites de 7%, 1% e 1% saturados). É efeito da regra, não erro de soma; os limites de 6%,
  7% e 1% estão marcados como não confirmados em `docs/regras/irpf-2026.md`;
- saldo a pagar e restituição mutuamente exclusivos, com `saldo - restituição = devido - pago`;
- modelo indicado é o de menor saldo líquido (`devido - pago`), o completo no empate; sem imposto
  pago no exterior, é o de menor imposto devido;
- soma das quotas igual ao saldo em 5.000 combinações, com recusa só quando a regra manda;
- determinismo e independência da ordem das fichas;
- `calculo-sem-float.test.ts`: varredura estática de `src/calc/**` e `src/centavos.ts` (sem
  comentários e textos) contra `parseFloat`, `parseInt`, `toFixed`, `toPrecision`,
  `Math.round/ceil/trunc/pow`, literais decimais e divisão por literal sem `n`. Os poucos
  `Number(...)` e `Math.floor` (dia, mês e ano das datas, número do exercício, quantidade de
  quotas) estão listados com o motivo; um uso novo faz o teste falhar.

## Entradas hostis e E/S (`seguranca/`)

- `entradas-hostis.test.ts`: strings de 5 MB recusadas em poucos milissegundos; caracteres
  invisíveis, bidi, de controle, tag e acima de 0xFF no nome viram pendência, sem ecoar o
  caractere; `__proto__`, `constructor` e `prototype` no JSON não poluem `Object.prototype` nem
  chegam ao objeto validado; float, `NaN`, `Infinity`, inteiro inseguro, texto e negativo
  recusados nos valores; datas como 31/02, 29/02 fora de ano bissexto e o ano 0000 recusadas no
  modelo e no cálculo; CPF e CNPJ com todos os dígitos iguais recusados; `validarDeclaracao` nunca
  lança, nem com `null`, função, `Symbol` ou 3.000 mutações aleatórias de uma declaração válida,
  e devolve pendências `MODELO-FORMA` com o caminho do campo, sem o valor recebido.
- `sem-io.test.ts`: o core só importa caminhos relativos e o `zod`; não usa `eval`, `Function`
  dinâmica, `import()` dinâmico, `require`, `fetch`, `XMLHttpRequest`, `WebSocket`, `process`,
  `globalThis` nem temporizadores; `zod` é a única dependência de execução e está fixada.
- `packages/mcp/test/seguranca.test.ts` faz a varredura equivalente de rede e processos no
  servidor e no CLI.

## Cobertura atual

Medida em 14/10/2026 com `@vitest/coverage-v8` (897 testes):

| Escopo | Linhas | Instruções | Funções | Ramos |
| --- | ---: | ---: | ---: | ---: |
| `packages/core/src` | 94,9% | 94,4% | 96,1% | 81,9% |
| `core/src/dbk` | 99,4% | 98,3% | 100% | 93,6% |
| `core/src/calc` | 98,6% | 98,1% | 100% | 90,5% |
| `core/src/model` | 100% | 100% | 100% | 93,3% |
| `core/src/validate` | 90,9% | 90,6% | 87,9% | 81,4% |
| Repositório inteiro | 84,2% | 82,6% | 81,2% | 70,2% |

O CI exige, abaixo do medido: no core, 92% de linhas e instruções, 93% de funções e 78% de
ramos; no total, 80%, 78%, 77% e 66%. O total é mais baixo porque o servidor MCP e o CLI estão em
desenvolvimento (por exemplo, `packages/mcp/src/calculadoras` ainda sem testes). Suba os limites
quando a cobertura subir; não os baixe para fazer um PR passar.

## Análise estática e dependências

- Semgrep 1.180 (`p/javascript`, `p/typescript`, `p/nodejsscan`, `p/secrets`) em
  `packages/*/src` e `apps/cli/src`, em 14/10/2026: nenhum achado de eval, execução de processo,
  rede, injeção ou segredo. Os 11 avisos `regex_dos` são falsos positivos: todas as regex
  apontadas são ancoradas e sem quantificadores aninhados (`^\d+$`, `^-?\d+$`, `^-0+$`,
  `^\d{8}$`), e as do codec estão cobertas pelos testes de tempo do fuzzing. Sete regras
  estouraram o tempo em arquivos de `conversao/` e `mcp/src/ferramentas/edicao.ts`.
- CodeQL (`security-extended`) roda no CI a cada push, PR e toda segunda-feira.
- `pnpm audit --prod`: nenhuma vulnerabilidade. `pnpm audit` completo: uma de severidade baixa
  em `esbuild` 0.27.7 (GHSA-g7r4-m6w7-qqqr, leitura de arquivo pelo servidor de desenvolvimento no
  Windows), dependência de desenvolvimento via `vitest`/`vite` e `tsup`; o MCP Imposto de Renda não usa o
  servidor de desenvolvimento do esbuild. O CI falha a partir de severidade moderada.

### Dependências diretas

Todas com versão exata (sem `^` nem `~`). Licenças conferidas no `package.json` de cada pacote
instalado e com `pnpm licenses list`.

| Pacote | Versão | Uso | Licença | Compatível com AGPL-3.0 |
| --- | --- | --- | --- | --- |
| `zod` | 4.6.7 | core e mcp, execução | MIT | sim |
| `@modelcontextprotocol/sdk` | 1.32.1 | mcp e cli, execução | MIT | sim |
| `@biomejs/biome` | 2.5.15 | lint e formatação | MIT OR Apache-2.0 | sim |
| `@types/node` | 22.20.5 | tipos | MIT | sim |
| `tsup` | 8.5.1 | build | MIT | sim |
| `typescript` | 6.0.3 | typecheck e build | Apache-2.0 | sim |
| `vitest` | 5.0.4 | testes | MIT | sim |
| `@vitest/coverage-v8` | 5.0.4 | cobertura | MIT | sim |

Dependências transitivas de execução (`pnpm licenses list --prod`): MIT, ISC, BSD-2-Clause e
BSD-3-Clause, todas compatíveis. O SDK do MCP traz `express`, `hono` e `cors` como dependências
mesmo quando só o transporte stdio é usado; o MCP Imposto de Renda não importa os transportes HTTP (conferido
por `packages/mcp/test/seguranca.test.ts`). Nas de desenvolvimento aparecem também Apache-2.0 e
MPL-2.0 (`lightningcss`, via `vite`), que não são distribuídas com o MCP Imposto de Renda.

`@vitest/coverage-v8` foi a única dependência acrescentada pela suíte de integridade, porque a
cobertura não pode ser medida sem um provedor. Mesma versão e mesmos mantenedores do `vitest`
(equipe do Vitest); a versão 5.0.4 foi publicada em 12/10/2026, junto com o `vitest` 5.0.4 que o
projeto já usava, e precisa casar com ele. Passou na política de cadeia de suprimentos do pnpm.

## Escrevendo testes novos

- Use `gerador(semente)` de `integridade/apoio.ts` para dados aleatórios e ponha a semente e a
  iteração na mensagem da asserção.
- Em laços de milhares de iterações, prefira `ok` de `node:assert/strict` a `expect`: o resultado
  é o mesmo e o laço fica dezenas de vezes mais rápido.
- Medições de tempo devem ser relativas (contra uma entrada comum do mesmo tamanho) ou ter folga
  de ordens de grandeza: o CI e as máquinas de desenvolvimento podem estar carregados.
- Nunca use dado pessoal real, nem em fixture, nem em mensagem de teste.
