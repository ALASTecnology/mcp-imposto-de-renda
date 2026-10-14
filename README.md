<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/logo-wordmark-dark.svg">
    <img alt="AutoIR" src="docs/assets/logo-wordmark.svg" height="56">
  </picture>
</p>

<p align="center">
  <strong>Servidor MCP 100% local para preparar a declaração do IRPF 2026 com o seu assistente de IA, sem tirar os arquivos da sua máquina.</strong>
</p>

<p align="center">
  <a href="LICENSE"><img alt="Licença AGPL-3.0-only" src="https://img.shields.io/badge/licen%C3%A7a-AGPL--3.0--only-blue"></a>
  <img alt="Node.js 22 ou superior" src="https://img.shields.io/badge/node-%3E%3D22-339933">
  <img alt="Transporte MCP stdio" src="https://img.shields.io/badge/MCP-stdio-5a4fcf">
  <img alt="Exercício 2026" src="https://img.shields.io/badge/exerc%C3%ADcio-2026-informational">
</p>

<p align="center">
  <img alt="Prévia do AutoIR" src="docs/assets/preview.png" width="760">
</p>

O AutoIR é um servidor [MCP](https://modelcontextprotocol.io) (Model Context Protocol) que roda
na sua máquina e conversa com o seu cliente MCP via stdio. Ele lê e grava o arquivo de cópia de
segurança da declaração (`.DBK`) do programa oficial, calcula o imposto nos modelos completo e
simplificado, explica cada conta, aponta pendências e consulta as tabelas de códigos do exercício.
No fim, você restaura o arquivo no programa oficial, confere e transmite por lá.

> [!WARNING]
> **Leia antes de usar.**
>
> - O AutoIR **não é serviço oficial da Receita Federal** e não tem vínculo com ela nem com
>   qualquer órgão público.
> - O AutoIR **não transmite** declarações e não acessa sistemas do governo. A entrega é sempre
>   feita pelo programa oficial (PGD).
> - O AutoIR não envia nada pela rede. Porém, tudo o que as ferramentas devolvem ao seu cliente MCP
>   (nomes, CPFs, rendimentos, bens) **chega ao provedor de LLM que você escolheu** nesse cliente.
>   Leia a política de privacidade desse provedor e decida o que compartilhar.
> - Não há garantia de exatidão. A responsabilidade pela declaração é sempre do contribuinte.

## Sumário

- [O que é e o que não é](#o-que-é-e-o-que-não-é)
- [Destaques](#destaques)
- [Instalação](#instalação)
- [Configuração no cliente MCP](#configuração-no-cliente-mcp)
- [Uso passo a passo](#uso-passo-a-passo)
- [Catálogo de ferramentas](#catálogo-de-ferramentas)
- [Prompts e recursos](#prompts-e-recursos)
- [Segurança e privacidade](#segurança-e-privacidade)
- [Como funciona a precisão](#como-funciona-a-precisão)
- [Limitações conhecidas](#limitações-conhecidas)
- [Roadmap](#roadmap)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Desenvolvimento](#desenvolvimento)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Aviso legal](#aviso-legal)

## O que é e o que não é

| O AutoIR é | O AutoIR não é |
| --- | --- |
| Um servidor MCP local, iniciado pelo seu cliente MCP e encerrado junto com ele | Um serviço on-line, um aplicativo da Receita Federal ou um substituto do programa oficial |
| Um leitor e gravador do `.DBK` com controles de integridade recalculados | Um transmissor: não envia a declaração, não usa certificado digital nem login gov.br |
| Um motor de cálculo próprio, em TypeScript, auditável e explicável | Uma cópia do programa oficial: nenhum código da Receita Federal está no repositório |
| Um conjunto de validações equivalentes às críticas do programa | Garantia de que a declaração está livre de malha fina |
| Software livre sob AGPL-3.0-only | Um intermediário de dados: não há backend, conta nem telemetria |

Os dados que você mostra ao assistente seguem o caminho abaixo. O AutoIR fica inteiramente do lado
da sua máquina; o único dado que sai dela é o que o seu cliente MCP manda ao provedor de LLM.

<p align="center">
  <img alt="Fluxo da declaração: usuário, cliente MCP, AutoIR local, pasta autorizada e programa oficial" src="docs/assets/fluxo-declaracao.svg" width="860">
</p>

## Destaques

| Indicador | Valor | Onde conferir |
| --- | --- | --- |
| Casos de referência (golden) reproduzidos ao centavo | **37 de 37** | [`packages/core/test/golden/2026`](packages/core/test/golden/2026), [`docs/regras/irpf-2026.md`](docs/regras/irpf-2026.md) |
| Arquivos do programa oficial relidos e regravados byte a byte | **74** (37 `.DBK` e 37 `.DEC`) | [`packages/core/test/fixtures/dbk/2026`](packages/core/test/fixtures/dbk/2026) |
| Funções do programa oficial inventariadas e mapeadas | **416** | [`docs/mapeamento/matriz-cobertura.md`](docs/mapeamento/matriz-cobertura.md) |
| Ferramentas MCP registradas | **138** em 9 grupos (93 gravam; 45 com `--somente-leitura`) | [catálogo](#catálogo-de-ferramentas) |
| Regras de validação | **107** (80 erros e 27 avisos) | [`packages/core/src/validate`](packages/core/src/validate) |
| Tabelas de códigos do exercício | **31** | [`docs/mapeamento/tabelas`](docs/mapeamento/tabelas/README.md) |
| Tipos de registro do `.DBK` convertidos para o modelo | **57** | [`docs/formato-dbk.md`](docs/formato-dbk.md) |
| Testes automatizados | mais de 900, em Vitest | [`docs/testes.md`](docs/testes.md) |
| Chamadas de rede | **nenhuma** (verificado por teste) | [`docs/seguranca.md`](docs/seguranca.md) |

## Instalação

Requisitos: **Node.js 22 ou superior**. Para compilar a partir do código, também o pnpm (o
`corepack enable` instala a versão fixada em `package.json`).

### Pelo npm

```sh
npx autoir-mcp --dir ~/Documentos/IR-2026
```

> [!NOTE]
> A versão 0.1.0 ainda não foi publicada no npm. Até a publicação, use a instalação a partir do
> código abaixo; a configuração dos clientes muda apenas no comando (`node` com o caminho do
> `dist/index.js` no lugar de `npx autoir-mcp`).

### A partir do código

```sh
git clone <url-do-repositório> AutoIR
cd AutoIR
corepack enable
pnpm install
pnpm build
node apps/cli/dist/index.js --versao
```

### Opções da linha de comando

| Opção | Efeito |
| --- | --- |
| `--dir <pasta>` | Obrigatória. Única pasta que o servidor pode ler e gravar. Precisa existir. |
| `--somente-leitura` | Remove todas as ferramentas que gravam arquivos (inclusão, alteração, remoção e gravação do `.DBK`). |
| `--versao` | Mostra a versão e sai. |
| `--ajuda` | Mostra a ajuda e sai. |

Logs vão para stderr; stdout é exclusivo do protocolo MCP. Detalhes em
[docs/guias/instalacao.md](docs/guias/instalacao.md).

## Configuração no cliente MCP

O formato muda de cliente para cliente, mas é sempre um comando com argumentos. Troque o caminho da
pasta pelo da sua. Exemplos completos, com caminhos por sistema operacional e a variante a partir do
código, estão em [docs/guias/clientes-mcp.md](docs/guias/clientes-mcp.md).

<details>
<summary><strong>Claude Desktop</strong> (<code>claude_desktop_config.json</code>)</summary>

```json
{
  "mcpServers": {
    "autoir": {
      "command": "npx",
      "args": ["-y", "autoir-mcp", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

</details>

<details>
<summary><strong>Claude Code</strong> (linha de comando ou <code>.mcp.json</code>)</summary>

```sh
claude mcp add autoir -- npx -y autoir-mcp --dir /Users/voce/Documentos/IR-2026
```

```json
{
  "mcpServers": {
    "autoir": {
      "command": "npx",
      "args": ["-y", "autoir-mcp", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

</details>

<details>
<summary><strong>Cursor</strong> (<code>~/.cursor/mcp.json</code> ou <code>.cursor/mcp.json</code>)</summary>

```json
{
  "mcpServers": {
    "autoir": {
      "command": "npx",
      "args": ["-y", "autoir-mcp", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

</details>

<details>
<summary><strong>VS Code</strong> (<code>.vscode/mcp.json</code>)</summary>

```json
{
  "servers": {
    "autoir": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "autoir-mcp", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

</details>

<details>
<summary><strong>Windsurf</strong> (<code>~/.codeium/windsurf/mcp_config.json</code>)</summary>

```json
{
  "mcpServers": {
    "autoir": {
      "command": "npx",
      "args": ["-y", "autoir-mcp", "--dir", "/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

</details>

<details>
<summary><strong>A partir do código</strong> (qualquer cliente)</summary>

```json
{
  "mcpServers": {
    "autoir": {
      "command": "node",
      "args": [
        "/caminho/para/AutoIR/apps/cli/dist/index.js",
        "--dir",
        "/Users/voce/Documentos/IR-2026"
      ]
    }
  }
}
```

</details>

Mantenha o cliente pedindo confirmação antes de ferramentas que gravam: todas elas são anunciadas
com `destructiveHint: true` para isso.

## Uso passo a passo

O tutorial completo, com uma declaração fictícia do início ao fim, está em
[docs/guias/primeira-declaracao.md](docs/guias/primeira-declaracao.md). O resumo:

1. **Prepare a pasta.** Crie uma pasta só para a declaração (por exemplo `~/Documentos/IR-2026`) e
   aponte `--dir` para ela. Não use a pasta pessoal inteira.
2. **Abra uma declaração existente ou comece do zero.**
   - Existente: no programa oficial, grave a cópia de segurança (menu **Ferramentas > Cópia de
     Segurança > Gravar**) dentro da pasta. Peça ao assistente para listar os arquivos
     (`listar_arquivos`) e abrir o `.DBK` (`abrir_declaracao`, `listar_fichas`).
   - Nova: `criar_declaracao` grava um `.DBK` novo com o nome padrão do programa a partir da
     identificação; `criar_retificadora` parte de uma declaração já entregue. O prompt
     `preparar_declaracao` conduz a coleta ficha por ficha.
3. **Preencha as fichas.** Entregue ao assistente os informes de rendimentos, recibos e extratos.
   Ele acha os códigos com `buscar_codigo` e `listar_tabela` e lança cada item com as ferramentas
   do grupo `edicao` (`definir_identificacao`, `adicionar_dependente`, `adicionar_rendimento_pj`,
   `adicionar_pagamento`, `adicionar_bem` e outras). Cada lançamento valida a declaração e grava o
   `.DBK` com cópia de segurança. O mapa ficha por ficha está em
   [docs/guias/fichas.md](docs/guias/fichas.md). Informes de rendimentos e de plano de saúde
   colados em texto entram por `importar_informe_rendimentos` e `importar_informe_plano_saude`.
4. **Valide.** `validar_declaracao` lista as pendências: `erro` impede a entrega, `aviso` indica
   risco de malha fina. `validar_documento` confere CPF e CNPJ.
5. **Calcule.** `simular_imposto` e `comparar_modelos` mostram o resultado nos dois modelos;
   `explicar_calculo` devolve a memória de cálculo linha a linha. `definir_opcao_tributacao` grava
   o modelo escolhido e `definir_informacoes_bancarias` a conta de restituição ou débito e as
   quotas.
6. **Confira o `.DBK`.** As edições gravam no próprio arquivo (ou em `arquivo_destino`), guardando
   o conteúdo anterior em `.autoir-backups` (`listar_copias_seguranca` e
   `restaurar_copia_seguranca` desfazem uma gravação). `verificar_integridade_arquivo` confere os
   controles e `gerar_relatorio_declaracao` monta um relatório para conferência.
7. **Restaure no programa oficial.** No PGD IRPF 2026, use **Ferramentas > Cópia de Segurança >
   Restaurar** (Ctrl+T) e escolha o arquivo gravado. `instruir_transmissao` gera o passo a passo
   com as pendências e o saldo.
8. **Confira e transmita.** Revise cada ficha no programa, rode **Verificar Pendências** (F5) e
   transmita pelo próprio programa. Guarde o recibo. `gerar_darf` calcula os dados do Darf (código,
   vencimentos, quotas e acréscimos); o documento com código de barras é emitido pelo programa
   oficial.

## Catálogo de ferramentas

Todas as ferramentas são locais (`openWorldHint: false`). As que gravam são anunciadas com
`destructiveHint: true`, para o cliente pedir confirmação. O que falta para cada função do programa
oficial está na [matriz de cobertura](docs/mapeamento/matriz-cobertura.md).

<!-- catalogo:inicio -->
Gerado a partir de `tools/list` do servidor: **138 ferramentas** em 9 grupos, 93 delas gravam na pasta autorizada (e somem com `--somente-leitura`, que deixa 45).

### calculo

Simulação do imposto, comparação de modelos, quotas, multa e parâmetros.

| Ferramenta | O que faz | Grava? |
| --- | --- | --- |
| `simular_imposto` | Calcula o imposto da declaração (exercício 2026, ano-calendário 2025) nos modelos completo e simplificado e indica o mais vantajoso, com saldo a pagar ou a restituir. | não |
| `comparar_modelos` | Compara as deduções legais (modelo completo) com o desconto simplificado de 20% (limitado a R$ 16.754,34) e mostra a diferença de resultado. | não |
| `explicar_calculo` | Devolve a memória de cálculo linha a linha, em pt-BR, com a conta feita e a regra legal aplicada em cada passo (rendimentos, deduções, base, tabela progressiva, incentivos, imposto pago, saldo). | não |
| `calcular_quotas` | Divide o saldo de imposto a pagar em até 8 quotas (mínimo R$ 50,00 cada; abaixo de R$ 100,00 só quota única), com vencimentos e juros Selic a partir da 2ª quota. | não |
| `calcular_multa_atraso` | Multa por atraso (MAED): 1% ao mês-calendário ou fração sobre o imposto devido, mínimo R$ 165,74 e máximo 20%. | não |
| `consultar_parametros` | Tabela progressiva anual, limites de dedução, desconto simplificado, prazos e quotas do exercício, com as fontes oficiais. | não |

### declaracao

Abrir, converter e gravar o arquivo da declaração (DBK/DEC). Exige `--dir`.

| Ferramenta | O que faz | Grava? |
| --- | --- | --- |
| `abrir_declaracao` | Lê um DBK ou DEC da pasta autorizada e devolve um resumo: contribuinte, tipo de declaração, quantidade de itens e totais por ficha, registros por tipo e integridade dos controles. | não |
| `converter_dbk_para_modelo` | Converte um DBK/DEC da pasta autorizada no modelo JSON do AutoIR (identificação, dependentes, rendimentos de PJ, pagamentos, bens e dívidas). | não |
| `converter_modelo_para_dbk` | Grava a declaração (modelo JSON) em um arquivo .DBK da pasta autorizada. | **sim** |

### fichas

Consulta de fichas da declaração. Exige `--dir`.

| Ferramenta | O que faz | Grava? |
| --- | --- | --- |
| `ler_ficha` | Devolve só uma ficha (identificação, dependentes, rendimentos de PJ, pagamentos, bens ou dívidas) de um DBK/DEC/JSON da pasta autorizada, no formato do modelo (centavos). | não |

### edicao

Inclusão, edição, remoção e listagem de lançamentos de cada ficha da declaração. Exige `--dir`.

Fichas em lista: cada uma tem quatro ferramentas. As de inclusão, alteração e remoção validam a declaração e gravam o `.DBK` com cópia de segurança, devolvendo as pendências.

| Ficha | Incluir | Alterar | Remover | Listar |
| --- | --- | --- | --- | --- |
| Dependentes | `adicionar_dependente` | `editar_dependente` | `remover_dependente` | `listar_dependentes` |
| Alimentandos | `adicionar_alimentando` | `editar_alimentando` | `remover_alimentando` | `listar_alimentandos` |
| Rendimentos Tributáveis Recebidos de Pessoa Jurídica | `adicionar_rendimento_pj` | `editar_rendimento_pj` | `remover_rendimento_pj` | `listar_rendimentos_pj` |
| Rendimentos Isentos e Não Tributáveis | `adicionar_rendimento_isento` | `editar_rendimento_isento` | `remover_rendimento_isento` | `listar_rendimentos_isentos` |
| Rendimentos Sujeitos à Tributação Exclusiva/Definitiva | `adicionar_rendimento_exclusivo` | `editar_rendimento_exclusivo` | `remover_rendimento_exclusivo` | `listar_rendimentos_exclusivos` |
| Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) | `adicionar_rendimento_exigibilidade_suspensa` | `editar_rendimento_exigibilidade_suspensa` | `remover_rendimento_exigibilidade_suspensa` | `listar_rendimentos_exigibilidade_suspensa` |
| Rendimentos Recebidos Acumuladamente | `adicionar_rra` | `editar_rra` | `remover_rra` | `listar_rra` |
| Pagamentos Efetuados | `adicionar_pagamento` | `editar_pagamento` | `remover_pagamento` | `listar_pagamentos` |
| Doações Efetuadas | `adicionar_doacao` | `editar_doacao` | `remover_doacao` | `listar_doacoes` |
| Doações Diretamente na Declaração | `adicionar_doacao_direta_declaracao` | `editar_doacao_direta_declaracao` | `remover_doacao_direta_declaracao` | `listar_doacoes_diretas_declaracao` |
| Bens e Direitos | `adicionar_bem` | `editar_bem` | `remover_bem` | `listar_bens` |
| Dívidas e Ônus Reais | `adicionar_divida` | `editar_divida` | `remover_divida` | `listar_dividas` |
| Herdeiros/Meeiro | `adicionar_herdeiro` | `editar_herdeiro` | `remover_herdeiro` | `listar_herdeiros` |
| Doações a Partidos Políticos e Candidatos | `adicionar_doacao_eleitoral` | `editar_doacao_eleitoral` | `remover_doacao_eleitoral` | `listar_doacoes_eleitorais` |
| Demonstrativo de Ganhos de Capital | `adicionar_ganho_capital` | `editar_ganho_capital` | `remover_ganho_capital` | `listar_ganhos_capital` |
| Renda Variável: Operações Comuns/Day-Trade | `adicionar_renda_variavel` | `editar_renda_variavel` | `remover_renda_variavel` | `listar_renda_variavel` |
| Renda Variável: Operações em FII ou Fiagro | `adicionar_fii_fiagro` | `editar_fii_fiagro` | `remover_fii_fiagro` | `listar_fii_fiagro` |
| Demonstrativo da Atividade Rural: Imóveis explorados | `adicionar_imovel_rural` | `editar_imovel_rural` | `remover_imovel_rural` | `listar_imoveis_rurais` |
| Demonstrativo da Atividade Rural: Receitas e despesas | `adicionar_receita_despesa_rural` | `editar_receita_despesa_rural` | `remover_receita_despesa_rural` | `listar_receitas_despesas_rurais` |
| Demonstrativo da Atividade Rural: Movimentação do rebanho | `adicionar_rebanho` | `editar_rebanho` | `remover_rebanho` | `listar_rebanhos` |
| Demonstrativo da Atividade Rural: Bens da atividade rural | `adicionar_bem_rural` | `editar_bem_rural` | `remover_bem_rural` | `listar_bens_rurais` |
| Demonstrativo da Atividade Rural: Dívidas vinculadas à atividade rural | `adicionar_divida_rural` | `editar_divida_rural` | `remover_divida_rural` | `listar_dividas_rurais` |

Demais ferramentas do grupo:

| Ferramenta | O que faz | Grava? |
| --- | --- | --- |
| `listar_fichas` | Mostra todas as fichas do modelo com a quantidade de itens preenchidos em um DBK/DEC, e quais são editáveis por listar_lancamentos, editar_lancamento e remover_lancamento. | não |
| `listar_lancamentos` | Lista os itens de qualquer ficha em lista, com a posição de cada um. | não |
| `editar_lancamento` | Altera um item de qualquer ficha em lista (campos mesclados; null remove), valida e grava com cópia de segurança. | **sim** |
| `remover_lancamento` | Remove um item de qualquer ficha em lista, valida e grava com cópia de segurança (dependente ou alimentando com vínculos exige cascata: true). | **sim** |
| `definir_identificacao` | Mescla os campos informados na ficha Identificação do Contribuinte (nome, nascimento, endereço, ocupação, cônjuge, tipo de declaração, retorno ao país, NIT). | **sim** |
| `definir_rendimentos_pf_exterior` | Lança os valores mensais (carnê-leão) de uma pessoa: informe 'mes' e 'valores' (coluna: valor) para um mês, ou 'colunas' (coluna: 12 valores) para o ano. | **sim** |
| `definir_renda_variavel` | Grava o mês (comuns e day-trade por mercado, IRRF de day-trade, IRRF da Lei 11.033 e imposto pago) do titular ou de um dependente; também aceita os valores de janeiro vindos de anos anteriores. | **sim** |
| `definir_fii_fiagro` | Grava o mês das operações com cotas de FII ou Fiagro (resultado líquido, imposto retido e imposto pago) do titular ou de um dependente; 'prejuizo_anterior' informa o prejuízo vindo de anos anteriores. | **sim** |
| `definir_espolio` | Grava a ficha Espólio: 'tipo' ajuste (declaração de ajuste com natureza 81: sobrepartilha e inventariante) ou final (Declaração Final de Espólio: ano do óbito, modalidade, bens a inventariar, decisão judicial ou escritura, inventariante e cônjuge). | **sim** |
| `definir_saida_definitiva` | Grava a ficha Saída Definitiva do País (campos mesclados aos atuais; 'remover': true apaga a ficha). | **sim** |
| `definir_informacoes_conjuge` | Grava a ficha Informações do Cônjuge (campos mesclados aos atuais; 'remover': true apaga a ficha). | **sim** |
| `definir_receitas_despesas_rurais` | Grava as receitas e despesas da atividade rural: na aba brasil, itens { mes, receitaBruta, despesa }; na aba exterior, itens { pais, receitaBrutaMoedaOriginal, despesaMoedaOriginal, resultadoDolar }. | **sim** |
| `definir_apuracao_rural` | Grava os campos digitados da apuração da atividade rural (prejuízo anterior, opção resultado ou limite20, compensação, adiantamentos, limite de 20% no exterior). | **sim** |
| `definir_rebanho` | Grava a movimentação de uma espécie do rebanho (1 a 4 conforme o programa, 5 = outros): estoque inicial, aquisições, nascimentos, consumo e perdas, vendas. | **sim** |
| `definir_partilha_bem` | Na Declaração Final de Espólio, define para um bem (posição em listar_bens) se ainda está a inventariar, a situação na data da partilha, o valor de transferência e os percentuais por herdeiro (centésimos: 100,00% = 10000; herdeiros cadastrados em adicionar_herdeiro). | **sim** |
| `aplicar_caso_especial_bem` | Aplica a um bem (posição em listar_bens) um caso especial: usufruto (com os CPF/CNPJ dos proprietários ou usufrutuários), bem a inventariar, atualização pela Lei 14.973/2024 ou criptoativo em custodiante; 'desfazer': true desmarca. | **sim** |
| `buscar_nome_por_documento` | Procura, nos DBK/DEC da pasta autorizada, o nome já informado para um CPF ou CNPJ (fontes pagadoras, dependentes, beneficiários de pagamentos e doações). | não |

### ciclo

Ciclo de vida da declaração (criar, retificar, excluir), opções do Resumo e importações. Exige `--dir`.

| Ferramenta | O que faz | Grava? |
| --- | --- | --- |
| `criar_declaracao` | Cria um DBK novo na pasta autorizada a partir da identificação do contribuinte (formato do modelo) e da opção de tributação. | **sim** |
| `criar_retificadora` | Marca a declaração como retificadora com o número do recibo (12 dígitos) da declaração a retificar e grava em um novo DBK (padrão: CPF-IRPF-A-2026-2025-RETIF.DBK), preservando o restante. | **sim** |
| `excluir_declaracao` | Remove um DBK ou DEC da pasta autorizada, guardando antes uma cópia em .autoir-backups. | **sim** |
| `gravar_copia_seguranca` | Copia um DBK ou DEC da pasta para outro .DBK (um DEC vira DBK sem o recibo, com os controles refeitos). | **sim** |
| `listar_copias_seguranca` | Lista as cópias automáticas guardadas em .autoir-backups (feitas antes de sobrescrever ou excluir), da mais recente para a mais antiga. | não |
| `restaurar_copia_seguranca` | Restaura uma cópia de .autoir-backups (nome de listar_copias_seguranca) sobre um arquivo da pasta (padrão: o arquivo de origem). | **sim** |
| `definir_opcao_tributacao` | Escolhe deduções legais (completa) ou desconto simplificado, preservando as deduções informadas, e devolve a comparação dos dois modelos com a recomendação. | **sim** |
| `definir_informacoes_bancarias` | Grava a conta para restituição ou débito (banco, agência sem DV, conta, DV, tipo e operação da Caixa), Pix pela chave CPF, número de quotas (1 a 8) e débito automático, validando banco, agência, conta e DV pela regra de cada banco. | **sim** |
| `definir_imposto_pago` | Grava as linhas digitadas da ficha Imposto Pago/Retido: imposto complementar (Darf 0246), imposto pago no exterior e imposto retido na fonte da Lei 11.033/2004. | **sim** |
| `repetir_valores_bens` | Copia a situação em 31/12/2024 para 31/12/2025 nos bens escolhidos (posições de listar_bens) ou, sem 'indices', em todos os bens com situação atual zerada; forcar: true copia mesmo quando já há valor. | **sim** |
| `importar_informe_rendimentos` | Lança na declaração o comprovante de rendimentos de PJ colado pelo usuário, em texto ou JSON (sem OCR e sem rede): fonte e CNPJ, quadro 3 (rendimentos, previdência oficial, IRRF), quadro 4 (isentos como parcela de 65 anos, indenizações, lucros), quadro 5 (13º e IRRF do 13º, PLR, aplicações) e plano de saúde do quadro 7. | **sim** |
| `importar_informe_plano_saude` | Lança em Pagamentos Efetuados (código 26) o informe de plano de saúde colado em texto ou JSON: operadora (CNPJ e nome), valor pago por beneficiário e reembolsos. | **sim** |
| `transferir_excedente_isencao_65` | Soma, por beneficiário com 65 anos ou mais em 2025 (contando a partir do mês em que completa 65), a parcela isenta de aposentadoria (isento código 10) de todas as fontes, aplica o limite de R$ 1.903,98 por mês mais o 13º e transfere o excedente para os Rendimentos Tributáveis de PJ da mesma fonte, como a pergunta do programa. | **sim** |

### validacao

Validação de CPF/CNPJ e pendências da declaração.

| Ferramenta | O que faz | Grava? |
| --- | --- | --- |
| `validar_documento` | Confere os dígitos verificadores de um CPF (11 dígitos) ou CNPJ (14 dígitos). | não |
| `validar_declaracao` | Aplica as regras de consistência equivalentes às críticas do programa oficial e lista as pendências: 'erro' impede a entrega, 'aviso' indica risco de malha fina. | não |

### tabelas

Tabelas de códigos do programa (dependentes, pagamentos, bens, municípios...).

| Ferramenta | O que faz | Grava? |
| --- | --- | --- |
| `listar_tabela` | Lista as entradas de uma tabela de códigos do exercício 2026, com filtro opcional por texto (sem diferenciar acentos) e paginação. | não |
| `buscar_codigo` | Busca um código exato numa tabela do exercício 2026. | não |

### arquivos

Arquivos da pasta autorizada. Exige `--dir`.

| Ferramenta | O que faz | Grava? |
| --- | --- | --- |
| `listar_arquivos` | Lista os arquivos .DBK, .DEC, .json e .txt da pasta autorizada (sem subpastas, ocultos ou links). | não |
| `verificar_integridade_arquivo` | Confere os controles do arquivo: número de controle (CRC-32) de cada registro, contagens do registro T9 e hash do header. | não |

### saidas

Etapa final: dados do Darf e passo a passo para transmitir pelo programa oficial.

| Ferramenta | O que faz | Grava? |
| --- | --- | --- |
| `gerar_darf` | Calcula os dados do Darf (código de receita, período de apuração, vencimentos e valores de cada quota, juros Selic das quotas e, se informada a data de pagamento após o vencimento, multa de 0,33% ao dia até 20% e juros de mora). | não |
| `instruir_transmissao` | Gera o passo a passo e o checklist para concluir no programa oficial da declaração 2026: restaurar o DBK gravado pelo AutoIR, verificar pendências, conferir o Resumo, transmitir com ou sem certificado digital, guardar o recibo e pagar o Darf. | não |
| `gerar_relatorio_declaracao` | Monta um relatório em Markdown da declaração (identificação, fichas preenchidas, totais e resultado simulado) para conferência. | não |
| `gerar_comunicacao_saida` | Gera o texto da comunicação de saída definitiva do país, uma por fonte pagadora de rendimentos de PJ, a partir da ficha Saída Definitiva. | não |

Grupos declarados no registro e ainda sem ferramentas: `calculadoras`, `orientacao`.
<!-- catalogo:fim -->

**Valores monetários na entrada:** texto é sempre em **reais** no formato brasileiro (`"1.234,56"`);
número inteiro é sempre em **centavos** (`123456` = R$ 1.234,56). No modelo JSON da declaração, os
valores são inteiros em centavos, as datas em `AAAA-MM-DD` e CPF/CNPJ só com dígitos.

## Prompts e recursos

| Tipo | Nome | Para que serve |
| --- | --- | --- |
| Prompt | `preparar_declaracao` | Roteiro guiado de coleta dos informes e preenchimento das fichas, com simulação a cada etapa. Argumento opcional `arquivo` (um `.DBK` da pasta para partir dele). |
| Prompt | `revisar_malha_fina` | Revisão em busca de pendências e inconsistências que costumam levar à malha fina. Argumento opcional `arquivo`. |
| Recurso | `autoir://aviso-legal` | Limites do AutoIR: não é serviço oficial, dados vão ao provedor de LLM, revisar e transmitir pelo programa oficial. |

## Segurança e privacidade

<p align="center">
  <img alt="Proteções do servidor local" src="docs/assets/seguranca.svg" width="860">
</p>

- **Sem rede.** O código do servidor e do CLI não importa `http`, `https`, `net`, `tls`, `dns` nem
  `child_process` e não usa `fetch`; um teste automatizado confere isso. Só o transporte stdio é
  oferecido ([ADR 0001](docs/adr/0001-mcp-local-sem-servidor.md)).
- **Pasta autorizada.** Só nomes relativos dentro de `--dir`. Caminhos absolutos, `..`, `~`, links
  simbólicos, arquivos ocultos e nomes reservados do Windows são recusados antes de tocar no disco.
- **Gravação segura.** Escrita atômica com `fsync`, backup automático em `.autoir-backups`
  (10 por arquivo, permissão 0600) e `--somente-leitura` para consultar sem risco.
- **Limites.** 20 MB por arquivo e 50.000 elementos por chamada.
- **Logs sem dados pessoais.** Só eventos do processo, nome da ferramenta e classe do erro, em
  stderr.

O que o AutoIR **não** consegue proteger: o provedor de LLM vê tudo o que as ferramentas devolvem.
Modelo de ameaças completo em [docs/seguranca.md](docs/seguranca.md); para relatar uma
vulnerabilidade, siga o [SECURITY.md](SECURITY.md) e nunca abra issue pública com o problema.

## Como funciona a precisão

<p align="center">
  <img alt="Suíte de referência: casos sintéticos, programa oficial local, golden e fixtures" src="docs/assets/suite-referencia.svg" width="860">
</p>

O motor de cálculo e o codec do arquivo são próprios, em TypeScript
([ADR 0002](docs/adr/0002-motor-de-calculo-proprio-sem-jar.md)). Para saber se estão certos, o
projeto compara o resultado com o do programa oficial:

1. Casos sintéticos em [`tools/referencia/casos`](tools/referencia/casos) descrevem declarações
   com CPFs gerados, nomes fictícios e valores escolhidos para isolar uma regra (cada faixa da
   tabela, tetos, limites, arredondamento, empate entre modelos).
2. Um harness local ([`tools/referencia`](tools/referencia/README.md)) usa o programa oficial,
   baixado pelo próprio desenvolvedor e nunca versionado, como biblioteca: preenche as fichas,
   executa o cálculo oficial e grava o resultado esperado (golden) e os arquivos `.DBK`/`.DEC`
   gravados pelo próprio programa (fixtures).
3. A suíte de testes exige que o motor reproduza todos os campos de cada golden **ao centavo** e que
   o codec releia e regrave cada fixture **byte a byte**, com os controles de integridade
   recalculados.
4. Quando um caso diverge, a regra é investigada e documentada em
   [`docs/regras/irpf-2026.md`](docs/regras/irpf-2026.md). Foi assim que se confirmou, por exemplo,
   que o programa trunca a fração de centavo das alíquotas, do desconto de 20% e do limite de 12%.

Nenhum código, classe, binário ou recurso do programa oficial entra no repositório, e nada dele é
descompilado. O software publicado nunca executa, embute ou baixa o programa oficial.

<p align="center">
  <img alt="Estrutura do arquivo DBK: header, fichas, T9 e controles" src="docs/assets/formato-dbk.svg" width="860">
</p>

O formato do arquivo, com os quatro controles de integridade (CRC-32 por registro, contagens do T9,
hash e controle do header), está descrito em [docs/formato-dbk.md](docs/formato-dbk.md).

## Limitações conhecidas

- **Só o exercício 2026** (ano-calendário 2025). Leiaute, tabelas e motor são versionados por
  exercício.
- **Conversão de `.DBK` em `.DEC` pendente.** O `.DEC` exige o registro `DR`, que repete dados de
  outras fichas e ainda tem campos de origem não determinada. O AutoIR grava `.DBK`; o programa
  oficial gera o `.DEC` de entrega.
- **Serviços on-line da Receita Federal estão fora de escopo**: transmissão, certificado digital,
  login gov.br, declaração pré-preenchida, Carnê-Leão Web, Darf com código de barras e recibo.
- **Sem leitura de PDF.** Informes de rendimentos e de plano de saúde entram como texto ou JSON
  colado pelo usuário; não há OCR.
- **Cálculo do ajuste sem demonstrativos.** RRA, atividade rural, ganho de capital e renda variável
  não entram no cálculo do motor.
- Pendências documentadas em [`docs/regras/irpf-2026.md`](docs/regras/irpf-2026.md), como a
  contribuição do ente patrocinador no código 37 e os limites de 6%, 7% e 1% das doações, ainda não
  confirmados por caso de referência.

## Roadmap

- **IRPF 2027** (ano-calendário 2026), com as mudanças da Lei 15.270/2025: nova tabela anual,
  redução do imposto do art. 11-A e tributação mínima de altas rendas. Notas em
  [`docs/regras/irpf-2027.md`](docs/regras/irpf-2027.md).
- **Exercícios anteriores**, para retificadoras e declarações em atraso.
- **Importação de PDF local** de informes de rendimentos, lida na máquina, sem serviço externo.
- Calculadoras auxiliares offline (renda variável, preço médio, carnê-leão, RRA, ganho de capital
  e acréscimos) e orientação sobre serviços que só existem fora do AutoIR: os grupos `calculadoras`
  e `orientacao` já estão declarados no servidor.
- As funções do programa oficial ainda pendentes na
  [matriz de cobertura](docs/mapeamento/matriz-cobertura.md), como a importação do arquivo do
  Carnê-Leão Web e do demonstrativo de ganhos de capital.
- Geração do `.DEC` a partir do `.DBK`, quando o registro `DR` estiver completamente mapeado.

## Estrutura do repositório

<p align="center">
  <img alt="Arquitetura do monorepo e regra de dependência" src="docs/assets/arquitetura.svg" width="860">
</p>

```
apps/cli            autoir-mcp     executável stdio (argumentos, logs em stderr)
packages/mcp        @autoir/mcp    createServer(): ferramentas, prompts, recursos, pasta autorizada
packages/core       @autoir/core   modelo, codec DBK, conversão, cálculo, validação e tabelas (sem I/O)
tools/leiaute                      gerador do leiaute a partir dos XML de dados do programa
tools/referencia                   harness local que gera golden e fixtures com o programa oficial
tools/mapeamento                   inventário das funções do programa
docs/                              ADRs, formato DBK, regras por exercício, mapeamento, guias
```

A dependência só vai de fora para dentro: `apps/cli` depende de `@autoir/mcp`, que depende de
`@autoir/core`. O core não faz I/O. Vocabulário do domínio em [CONTEXT.md](CONTEXT.md).

## Desenvolvimento

```sh
pnpm install
pnpm lint        # Biome
pnpm typecheck   # tsc em todos os pacotes
pnpm test        # Vitest (golden, fixtures, propriedades, servidor)
pnpm build       # tsup
pnpm format      # formata com Biome
```

Arquitetura, como adicionar um exercício novo e convenções estão em
[docs/guias/desenvolvimento.md](docs/guias/desenvolvimento.md).

## Contribuição

Contribuições são bem-vindas. Leia o [CONTRIBUTING.md](CONTRIBUTING.md) e o
[Código de Conduta](CODE_OF_CONDUCT.md). Duas regras não têm exceção: **nenhum código da Receita
Federal** entra no repositório e **nenhum dado real** (declaração, CPF, informe) entra em issue,
PR ou teste. Divergência de cálculo se reporta com caso sintético, pelo modelo de issue próprio.

Dúvidas comuns em [docs/guias/perguntas-frequentes.md](docs/guias/perguntas-frequentes.md) e
problemas de instalação em [docs/guias/solucao-de-problemas.md](docs/guias/solucao-de-problemas.md).

## Licença

[AGPL-3.0-only](LICENSE). O motivo da escolha está no
[ADR 0003](docs/adr/0003-licenca-agpl.md). Versões modificadas, inclusive oferecidas pela rede,
precisam disponibilizar o código-fonte sob a mesma licença.

## Aviso legal

O AutoIR é software livre fornecido "no estado em que se encontra", sem garantia de qualquer tipo,
nos termos da AGPL-3.0. Não é serviço oficial da Receita Federal do Brasil, não tem vínculo com ela
nem com qualquer órgão público e não usa marca, brasão ou identidade visual do governo. Cálculos,
conversões e validações podem divergir do programa oficial. Abra o arquivo no programa da Receita
Federal, confira cada ficha e transmita por ele. A responsabilidade pelas informações declaradas é
sempre do contribuinte. Os dados que você compartilha com o assistente são tratados pelo provedor
de LLM escolhido por você, segundo os termos desse provedor.
