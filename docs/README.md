# Documentação

Índice de toda a documentação do MCP Imposto de Renda, organizada pelo que você quer fazer. O
[README do projeto](../README.md) traz a visão geral e o início rápido.

## Usar

| Documento | Para quê |
| --- | --- |
| [Instalação](guias/instalacao.md) | Requisitos, instalação pelo npm ou a partir do código e opções da linha de comando. |
| [Clientes MCP](guias/clientes-mcp.md) | Índice dos clientes compatíveis, com o nível de suporte e um guia de configuração para cada um. |
| [Primeira declaração](guias/primeira-declaracao.md) | Tutorial do começo ao fim com uma declaração fictícia. |
| [Fichas](guias/fichas.md) | Mapa ficha por ficha do programa oficial para as ferramentas. |
| [Declarações de exemplo](../exemplos/README.md) | Quatro declarações fictícias completas, com a conversa, o cálculo e o `.DBK` gerados pelo servidor. |
| [Perguntas frequentes](guias/perguntas-frequentes.md) | Dúvidas comuns sobre uso, privacidade e limites. |
| [Solução de problemas](guias/solucao-de-problemas.md) | O que fazer quando o cliente não vê o servidor, a pasta é recusada ou o arquivo não abre. |

## Consultar

| Documento | Para quê |
| --- | --- |
| [Referência das ferramentas](ferramentas/README.md) | As 154 ferramentas, uma página por grupo: parâmetros, anotações, exemplo real de chamada e resposta e funções do programa oficial correspondentes. |
| [Regras do IRPF 2026](regras/irpf-2026.md) | Parâmetros e regras de cálculo do exercício, com fonte legal, e as divergências investigadas. |
| [Notas do IRPF 2027](regras/irpf-2027.md) | Mudanças já conhecidas para o próximo exercício. |
| [Tabelas de códigos](mapeamento/tabelas/README.md) | As 31 tabelas embarcadas, com origem e vigência. |
| [Matriz de cobertura](mapeamento/matriz-cobertura.md) | Cada uma das 416 funções do programa oficial e a ferramenta que a atende, ou por que não há. |
| [Inventário de funções](mapeamento/funcoes-pgd-2026.md) e [notas de mapeamento](mapeamento/README.md) | Descrição funcional do programa oficial, ficha a ficha. |

## Entender por dentro

| Documento | Para quê |
| --- | --- |
| [Arquitetura](arquitetura.md) | Pacotes, fluxo de dados, codec, modelo, motor de cálculo, validações, camada de arquivos e registro das ferramentas, com diagramas. |
| [Formato do arquivo DBK](formato-dbk.md) | Leiaute, tipos de registro, controles de integridade e recibo do `.DEC`. |
| [Segurança](seguranca.md) | Modelo de ameaças, proteções do servidor e o que ele não consegue proteger. |
| [Testes](testes.md) | Estratégia de testes, casos de referência, fixtures e propriedades. |
| [Decisões de arquitetura (ADR)](adr/0001-mcp-local-sem-servidor.md) | [0001](adr/0001-mcp-local-sem-servidor.md) servidor local sem backend, [0002](adr/0002-motor-de-calculo-proprio-sem-jar.md) motor próprio sem o programa oficial, [0003](adr/0003-licenca-agpl.md) licença AGPL. |
| [Vocabulário do domínio](../CONTEXT.md) | Exercício, ano-calendário, ficha, registro, leiaute e outros termos. |

## Contribuir

| Documento | Para quê |
| --- | --- |
| [Desenvolvimento](guias/desenvolvimento.md) | Ambiente, suítes que importam, como adicionar um exercício novo e convenções. |
| [Como contribuir](../CONTRIBUTING.md) | Processo de issues, PRs e commits. |
| [Código de Conduta](../CODE_OF_CONDUCT.md) | Regras de convivência. |
| [Política de segurança](../SECURITY.md) | Como relatar uma vulnerabilidade sem expô-la. |
| [Histórico de mudanças](../CHANGELOG.md) | O que mudou em cada versão. |
| [Imagens e diagramas](assets/README.md) | Origem dos diagramas e como regenerar os PNGs. |

## Diagramas

| Diagrama | Onde aparece |
| --- | --- |
| [Fluxo da declaração](assets/fluxo-declaracao.svg) | [README](../README.md) |
| [Arquitetura do monorepo](assets/arquitetura.svg) | [Arquitetura](arquitetura.md#visão-geral) |
| [Mapa dos 11 grupos de ferramentas](assets/grupos-ferramentas.svg) | [Arquitetura](arquitetura.md#servidor-e-registro-das-ferramentas) |
| [Sequência de uma sessão típica](assets/sessao-sequencia.svg) | [Arquitetura](arquitetura.md#uma-sessão-típica) |
| [Ciclo de vida da declaração](assets/ciclo-vida-declaracao.svg) | [Arquitetura](arquitetura.md#ciclo-de-vida-da-declaração) |
| [Formato do arquivo DBK](assets/formato-dbk.svg) | [README](../README.md), [Arquitetura](arquitetura.md#codec-do-arquivo) |
| [Suíte de referência](assets/suite-referencia.svg) | [Arquitetura](arquitetura.md#como-a-precisão-é-garantida) |
| [Proteções do servidor](assets/seguranca.svg) | [README](../README.md), [Arquitetura](arquitetura.md#camada-de-arquivos) |
| [Conexão dos clientes](assets/clientes-conexao.svg) | [Clientes MCP](guias/clientes-mcp.md) |

## Manter a documentação em dia

```sh
pnpm docs:catalogo   # catálogo do README e referência em docs/ferramentas/, a partir do tools/list
pnpm exemplos        # regrava as declarações de exemplo com o servidor atual
pnpm docs:links      # links relativos, âncoras, travessões e nomes de ferramentas
```

Os arquivos gerados trazem um aviso no topo e não devem ser editados à mão.
