# ADR 0002: motor de cálculo próprio, sem o JAR oficial

- Status: aceito
- Data: 2026-10-14

## Contexto

O programa oficial da declaração (PGD) é um aplicativo Java distribuído pela Receita Federal.
Executá-lo a partir do AutoIR daria cálculo idêntico ao oficial, mas exigiria Java instalado,
amarraria o projeto aos termos de uso e à distribuição de software de terceiros, tornaria a
execução lenta e opaca e impediria explicar ao usuário de onde vem cada valor.

## Decisão

O AutoIR implementa o próprio codec do arquivo DBK e o próprio motor de cálculo em TypeScript.

- Nenhum código, binário, JAR, recurso ou leiaute extraído do programa oficial entra no
  repositório. A pasta `vendor/rfb/` é ignorada pelo git.
- O programa oficial pode ser executado **apenas localmente, no ambiente de desenvolvimento**, para
  gerar casos de referência (entrada e resultado esperado). Os casos usam dados sintéticos.
- O software publicado nunca invoca, embute ou baixa o programa oficial.
- Leiautes e tabelas são descritos como dados versionados por exercício, a partir de documentação
  pública e da observação dos casos de referência.

## Consequências

- Divergências em relação ao programa oficial são possíveis; a cobertura de casos de referência é
  a principal defesa, e o README orienta a conferir tudo no programa oficial antes de transmitir.
- Cada exercício novo exige atualizar leiautes, tabelas e casos de referência.
- O cálculo fica auditável, testável e explicável campo a campo.
