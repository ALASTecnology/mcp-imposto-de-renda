## O que muda

<!-- Resumo em uma ou duas frases e a issue relacionada (closes #N). -->

## Tipo

- [ ] Correção de bug
- [ ] Funcionalidade (ferramenta, ficha, regra)
- [ ] Cálculo ou caso de referência
- [ ] Documentação
- [ ] Manutenção (build, CI, dependências)

## Como foi testado

<!-- Testes novos ou alterados e como reproduzir. -->

## Checklist

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm build` passam.
- [ ] Os casos de referência (golden) continuam ao centavo e os fixtures continuam byte a byte.
- [ ] Nenhum código, classe, recurso ou binário do programa oficial foi incluído.
- [ ] Nenhum dado real (declaração, CPF, CNPJ de pessoa, nome, valor) aparece no código, nos testes, nos fixtures ou nesta descrição.
- [ ] Regras novas ou alteradas têm fonte registrada em `docs/regras/`.
- [ ] Ferramentas novas têm teste, descrição clara e estão na matriz de cobertura e no README.
- [ ] Nada de rede, `child_process` ou `fetch` no servidor e no CLI.
- [ ] Mudanças visíveis para quem usa estão no `CHANGELOG.md` (seção "Não publicado").
- [ ] Commits seguem Conventional Commits, em inglês.
