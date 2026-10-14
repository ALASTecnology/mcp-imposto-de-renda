# ADR 0003: licença AGPL-3.0-only

- Status: aceito
- Data: 2026-10-14

## Contexto

O AutoIR lida com dados fiscais. Quem usa precisa poder auditar exatamente o que o código faz com
esses dados, e versões modificadas devem continuar auditáveis, inclusive quando oferecidas a
terceiros como serviço de rede.

## Decisão

Todo o código do repositório é licenciado sob a GNU Affero General Public License, versão 3,
sem a cláusula "ou qualquer versão posterior" (`AGPL-3.0-only`). O texto integral oficial está em
`LICENSE` e todos os `package.json` declaram `"license": "AGPL-3.0-only"`.

## Consequências

- Derivados distribuídos ou oferecidos pela rede precisam disponibilizar o código-fonte
  correspondente sob a mesma licença.
- Dependências precisam ter licença compatível com a AGPL-3.0; isso entra na revisão ao adicionar
  qualquer pacote.
- Mudar para uma versão futura da AGPL exigirá decisão explícita, registrada em novo ADR.
