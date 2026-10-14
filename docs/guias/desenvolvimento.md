# Desenvolvimento

Guia para quem vai mexer no código: arquitetura, como rodar, como adicionar um exercício novo e as
convenções do projeto. Para o processo de contribuição (issues, PRs, commits), veja o
[CONTRIBUTING.md](../../CONTRIBUTING.md).

## Arquitetura

![Arquitetura do MCP Imposto de Renda](../assets/arquitetura.svg)

Monorepo pnpm com três pacotes. A dependência só vai de fora para dentro:

```text
apps/cli (mcp-imposto-de-renda)  ->  packages/mcp (@mcp-imposto-de-renda/mcp)  ->  packages/core (@mcp-imposto-de-renda/core)
```

| Pacote | Responsabilidade | Pode fazer I/O? |
| --- | --- | --- |
| `packages/core` | Modelo da declaração (`model`), codec do arquivo (`dbk`), conversão registros e modelo (`conversao`), motor de cálculo por exercício (`calc`), regras de validação (`validate`), tabelas de códigos (`tabelas`), tipo `Centavos`. | Não. Funções puras sobre bytes e objetos. |
| `packages/mcp` | `createServer()`: grupos de ferramentas, prompts, recursos, esquemas de entrada com zod, mensagens de erro, e a `PastaAutorizada`, única porta para o disco. | Só disco, só pela `PastaAutorizada`. Nunca rede. |
| `apps/cli` | Executável `mcp-imposto-de-renda`: interpreta argumentos, liga o transporte stdio, logs em stderr. | Processo e stdio. |

Decisões que moldam o código:

- [ADR 0001](../adr/0001-mcp-local-sem-servidor.md): MCP local via stdio, sem servidor remoto.
- [ADR 0002](../adr/0002-motor-de-calculo-proprio-sem-jar.md): motor e codec próprios, sem o JAR
  oficial em produção.
- [ADR 0003](../adr/0003-licenca-agpl.md): AGPL-3.0-only.

Vocabulário do domínio (exercício, ano-calendário, ficha, registro, T9, leiaute) em
[CONTEXT.md](../../CONTEXT.md). Formato do arquivo em [../formato-dbk.md](../formato-dbk.md).
Modelo de ameaças em [../seguranca.md](../seguranca.md).

### Fluxo de uma chamada

1. O cliente chama uma ferramenta; o SDK do MCP valida os argumentos contra o esquema zod.
2. O `RegistroFerramentas` (`packages/mcp/src/ferramentas/registrador.ts`) executa a ferramenta,
   captura erros e devolve texto mais `structuredContent`.
3. A ferramenta lê o arquivo pela `PastaAutorizada`, chama o core (`lerArquivo`,
   `registrosParaModelo`, `obterMotor(exercicio).calcular`, `validarDeclaracao`) e formata a
   resposta em pt-BR.
4. Na gravação, o core gera os registros, recalcula os controles (`recalcularControles`) e a pasta
   grava de forma atômica, com backup.

### Grupos de ferramentas

Cada grupo é um módulo em `packages/mcp/src/ferramentas/` que exporta um `GrupoFerramentas`
(contrato em `tipos.ts`) e entra na lista `GRUPOS` de `registro.ts`. A ordem da lista é a ordem de
`tools/list`. Ferramentas que gravam declaram `escreve: true`: recebem as anotações de escrita e
somem com `--somente-leitura`. Grupos que precisam de arquivo declaram `exigePasta: true`.

Ao criar uma ferramenta:

- nome em `snake_case` e pt-BR, título e descrição pensados para o modelo de linguagem preencher
  certo (unidades, formatos, exemplos);
- valores monetários com `zValorMonetario` (texto em reais, número em centavos);
- nomes de arquivo com o esquema de nome relativo, extensões explícitas;
- mensagens de erro fixas por tipo de falha, sem ecoar conteúdo do arquivo nem valores pessoais;
- teste em `packages/mcp/test` usando o transporte em memória;
- linha da [matriz de cobertura](../mapeamento/matriz-cobertura.md) atualizada.

## Ambiente

```sh
corepack enable
pnpm install
pnpm lint        # Biome (formatação e lint)
pnpm typecheck   # tsc em todos os pacotes
pnpm test        # Vitest
pnpm build       # tsup
```

Os testes importam o código-fonte dos pacotes (aliases em `vitest.config.ts`), sem exigir build.
Para rodar um arquivo só: `pnpm vitest run packages/core/test/calc/golden.test.ts`.

### Suítes que importam

A estratégia completa de testes (pirâmide, cobertura, fuzzing, entradas hostis) está em
[../testes.md](../testes.md). As suítes que nenhuma mudança pode quebrar:

| Suíte | O que garante |
| --- | --- |
| `packages/core/test/calc/golden.test.ts` | O motor reproduz ao centavo cada caso de `test/golden/<exercício>/`. |
| `packages/core/test/dbk/fixtures.test.ts` | Cada `.DBK`/`.DEC` gravado pelo programa é relido e regravado byte a byte, com todos os controles conferidos. |
| `packages/core/test/dbk/propriedades.test.ts` e `test/integridade/` | Propriedades do codec com entradas aleatórias e adversariais. |
| `packages/mcp/test/seguranca.test.ts` | O código do servidor e do CLI não importa módulos de rede nem usa `fetch`. |
| `packages/mcp/test/arquivos.test.ts` | Contenção na pasta autorizada, links, nomes proibidos, backups. |

## Adicionar um exercício novo

Exemplo: exercício 2027 (ano-calendário 2026). Notas das mudanças legais em
[../regras/irpf-2027.md](../regras/irpf-2027.md).

### 1. Leiaute do arquivo

Com o programa do exercício baixado por você (fora do repositório, em `vendor/rfb/`, que é
ignorado pelo git), extraia os XML de dados `LayoutDadosDIRPF2027.xml` e `mapeamentoTxt.xml` e
gere o leiaute:

```sh
node --experimental-strip-types tools/leiaute/gerar.ts \
  --leiaute <pasta>/LayoutDadosDIRPF2027.xml \
  --mapeamento <pasta>/mapeamentoTxt.xml
```

A saída vai para `packages/core/src/dbk/leiautes/2027.ts`, com o SHA-256 das fontes no cabeçalho.
Registre o leiaute em `packages/core/src/dbk/leiautes/index.ts` (`LEIAUTES`). Regras do gerador em
[../formato-dbk.md](../formato-dbk.md#como-regenerar-o-leiaute).

### 2. Tabelas de códigos

Atualize os JSON de `docs/mapeamento/tabelas/` a partir dos XML de tabela do novo programa e
registre a origem e a vigência no [README das tabelas](../mapeamento/tabelas/README.md). O core
importa esses arquivos em `packages/core/src/tabelas/dados.ts`. Se as tabelas passarem a variar
por exercício, versione-as como o leiaute.

### 3. Regras de cálculo

1. Documente cada parâmetro com fonte oficial em `docs/regras/irpf-2027.md` (tabela anual, limites,
   desconto simplificado, redução, prazos). O que não tiver fonte fica marcado **NÃO CONFIRMADO**.
2. Crie o motor em `packages/core/src/calc/2027/`, com a mesma interface do de 2026, e registre-o
   em `motores` de `packages/core/src/calc/index.ts`.
3. Toda aritmética em `Centavos` com as funções de `calc/aritmetica.ts`. O programa trunca a fração
   de centavo das alíquotas e percentuais do ajuste; confirme de novo com os casos do novo ano.

### 4. Regras de validação

Acrescente ou ajuste regras em `packages/core/src/validate/regras/`. Cada regra declara código,
gravidade (`erro` ou `aviso`), ficha, descrição e fonte, e entra no catálogo `REGRAS`.

### 5. Casos de referência

O harness [`tools/referencia`](../../tools/referencia/README.md) usa o programa oficial como
biblioteca, só na sua máquina:

1. Escreva casos sintéticos em `tools/referencia/casos/*.json`, um por regra a isolar (faixas,
   tetos, limites, arredondamento). CPFs e CNPJs saem de `gerar.sh cpf <semente>` e
   `gerar.sh cnpj <semente>`; nomes e endereços são fictícios.
2. Ajuste `Preenchedor.java` e `Resultado.java` se as fichas ou o resumo do novo programa mudarem.
3. Gere golden e fixtures apontando para o zip do novo programa:

   ```sh
   IRPF_ZIP=vendor/rfb/irpf/IRPF2027-1.0.zip \
   GOLDEN_DIR=packages/core/test/golden/2027 \
   FIXTURES_DIR=packages/core/test/fixtures/dbk/2027 \
   tools/referencia/gerar.sh gerar
   ```

4. Rode `pnpm test`. Cada divergência é investigada e registrada na seção "Divergências com casos
   de referência" de `docs/regras/irpf-2027.md`. Nunca ajuste o motor só para passar no caso sem
   entender a regra.

### 6. Servidor

As ferramentas recebem `exercicio` onde fizer sentido. Atualize as descrições que citam o
exercício, o prompt `preparar_declaracao`, os textos de `consultar_parametros` e a matriz de
cobertura.

## Convenções

- **Idioma.** Código de domínio, documentação, mensagens e nomes de ferramentas em pt-BR, com
  acentuação correta. Commits em inglês, no padrão Conventional Commits.
- **Dinheiro.** Sempre `Centavos` (`bigint`) no core; nunca ponto flutuante. Texto em reais só na
  borda (`parseCentavos`, `formatCentavos`).
- **Datas.** `AAAA-MM-DD` no modelo; `DDMMAAAA` no arquivo e nos casos de referência.
- **Termos.** Use "exercício" e "ano-calendário", nunca "ano" sozinho. Termo novo entra primeiro em
  `CONTEXT.md`.
- **Sem rede.** Nenhum módulo de rede, `child_process` ou `fetch` no servidor e no CLI.
- **Sem dados pessoais em logs e erros.** Logs só em stderr, com nome da ferramenta e classe do
  erro.
- **Sem código da Receita Federal.** Nada do programa oficial (classes, bytecode, recursos
  executáveis, JAR) entra no repositório; nenhum bytecode é descompilado. Entram só dados
  funcionais (leiautes, tabelas) e casos sintéticos.
- **Sem dados reais.** Testes, fixtures, issues e exemplos usam apenas dados sintéticos.
- **Dependências.** Licença compatível com AGPL-3.0, versão exata no `package.json` e justificativa
  no PR.
- **Formatação.** Biome (`pnpm format`). O CI (`.github/workflows/`) roda `lint`, `typecheck`,
  `test` e `build` em Node 22 e 24, além de cobertura, auditoria de dependências e análise estática;
  detalhes em [../testes.md](../testes.md).
