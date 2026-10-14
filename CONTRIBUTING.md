# Como contribuir com o MCP Imposto de Renda

Obrigado pelo interesse. O MCP Imposto de Renda lida com dados fiscais e pretende reproduzir ao centavo o
programa oficial da declaração, por isso o processo tem algumas regras firmes. Leia este guia
inteiro antes de abrir um PR.

Ao participar, você concorda com o [Código de Conduta](CODE_OF_CONDUCT.md).

## Duas regras sem exceção

1. **Nenhum código da Receita Federal.** Nada do programa oficial entra no repositório: classes,
   bytecode, JAR, recursos executáveis, trechos copiados ou traduzidos. Nenhum bytecode é
   descompilado. Entram apenas dados funcionais (posições de campos, tabelas de códigos) e
   comportamento observado com casos sintéticos, como descrito no
   [ADR 0002](docs/adr/0002-motor-de-calculo-proprio-sem-jar.md). A pasta `vendor/rfb/` é ignorada
   pelo git e assim deve continuar.
2. **Nenhum dado real.** Declarações, `.DBK`, `.DEC`, informes, CPFs, CNPJs de pessoas reais,
   nomes, endereços e valores de alguém nunca entram em issue, PR, teste, fixture, captura de tela
   ou mensagem de commit. Use apenas dados sintéticos: o harness gera CPFs e CNPJs determinísticos
   com `tools/referencia/gerar.sh cpf <semente>` e `cnpj <semente>`.

PRs que violem qualquer uma das duas são fechados, e o histórico afetado é reescrito.

## Fluxo

1. **Abra ou escolha uma issue.** Use os modelos: bug, funcionalidade ou divergência de cálculo.
   Para mudanças grandes (novo exercício, nova família de ferramentas, mudança de arquitetura),
   discuta na issue antes de codar.
2. **Crie uma branch** a partir de `main`: `feat/...`, `fix/...`, `docs/...`, `test/...`,
   `chore/...`.
3. **Escreva o teste primeiro** quando for corrigir um bug ou mudar uma regra de cálculo.
4. **Implemente** seguindo as convenções de [docs/guias/desenvolvimento.md](docs/guias/desenvolvimento.md).
5. **Rode as verificações** (abaixo) até tudo passar.
6. **Abra o PR** preenchendo o modelo e referenciando a issue (`closes #N`).

## Verificações obrigatórias

Antes de pedir revisão, todos estes comandos precisam passar na raiz do repositório. O CI roda os
mesmos em Node.js 22 e 24.

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Além disso:

- **Casos de referência (golden).** `packages/core/test/calc/golden.test.ts` precisa continuar com
  todos os casos ao centavo. Nunca altere um arquivo de `packages/core/test/golden/` à mão: ele é
  gerado pelo harness a partir do programa oficial.
- **Fixtures do arquivo.** Os `.DBK`/`.DEC` de `packages/core/test/fixtures/dbk/` precisam ser
  relidos e regravados byte a byte. Eles também só são gerados pelo harness.
- **Regras novas ou alteradas** precisam de fonte (legislação, Perguntas e Respostas da Receita
  Federal, Ajuda do programa ou caso de referência) registrada em `docs/regras/irpf-<exercício>.md`.
  O que não tiver fonte fica marcado como **NÃO CONFIRMADO**.
- **Ferramentas MCP novas** precisam de teste em `packages/mcp/test`, descrição clara para o
  modelo de linguagem e atualização da [matriz de cobertura](docs/mapeamento/matriz-cobertura.md)
  e do catálogo no README.
- **Segurança.** Nada de rede, `child_process` ou `fetch` no servidor e no CLI; acesso a disco só
  pela `PastaAutorizada`; mensagens de erro sem conteúdo do arquivo nem dados pessoais. Veja
  [docs/seguranca.md](docs/seguranca.md).

## Casos de referência (golden)

Para cobrir uma regra nova ou investigar uma divergência:

1. Escreva um caso sintético em `tools/referencia/casos/<nome>-01.json`, isolando uma única regra
   (por exemplo, um valor exatamente no teto de uma faixa).
2. Com o programa oficial baixado por você em `vendor/rfb/`, rode
   `tools/referencia/gerar.sh gerar tools/referencia/casos/<nome>-01.json`.
3. Commite o caso, o golden e os fixtures gerados. Os arquivos gerados contêm apenas dados
   sintéticos produzidos pelo programa, sem código dele.
4. Se o motor divergir, investigue a regra, corrija o motor e registre a divergência na tabela de
   `docs/regras/irpf-<exercício>.md`. Não ajuste o motor para "passar no caso" sem entender o
   porquê.

Detalhes do harness em [tools/referencia/README.md](tools/referencia/README.md).

Se você não tem o ambiente do harness, abra uma issue de **divergência de cálculo** com o caso
sintético em JSON; alguém da manutenção gera o golden.

## Commits

Mensagens em inglês, no padrão [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat(mcp): add listar_fichas tool
fix(calc): truncate 12% PGBL limit to the cent
docs: explain how to restore the DBK in the official program
test(golden): add case isolating the dependent deduction cap
```

Tipos usados: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `build`, `ci`, `chore`. Escopos
comuns: `core`, `calc`, `dbk`, `validate`, `mcp`, `cli`, `golden`. Commits pequenos, um assunto por
commit, referenciando a issue no corpo quando houver (`refs #N`).

## Documentação

- Documentação, mensagens e nomes de ferramentas em pt-BR com acentuação correta.
- Termos do domínio seguem o [CONTEXT.md](CONTEXT.md); termo novo entra lá primeiro.
- Decisões de arquitetura viram ADR em `docs/adr/`.
- Mudanças visíveis para quem usa entram no [CHANGELOG.md](CHANGELOG.md), na seção
  "Não publicado".

## Dependências

Antes de adicionar um pacote, justifique no PR: por que é necessário, licença (precisa ser
compatível com AGPL-3.0-only), manutenção e tamanho. Fixe a versão exata. Pacotes que fazem
chamadas de rede não entram no servidor nem no CLI.

## Segurança

Falhas de segurança **não** se reportam em issue pública. Siga o [SECURITY.md](SECURITY.md).

## Licença

Ao contribuir, você concorda que a sua contribuição é licenciada sob a
[AGPL-3.0-only](LICENSE), a mesma licença do projeto.
