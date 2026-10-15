<!-- Arquivo gerado por `pnpm docs:catalogo` (tools/docs/referencia.mjs). Não edite à mão. -->

<a id="topo"></a>

# Grupo `orientacao`

Orientação sobre serviços que só existem fora do MCP Imposto de Renda (sem acesso à rede). Ajuda do programa e orientação sobre serviços que só existem fora do servidor.

**7 ferramentas**, 0 delas gravam na pasta autorizada. O grupo funciona mesmo sem `--dir`.

| Ferramenta | Título | Grava? |
| --- | --- | --- |
| [`orientar_servico_externo`](#orientar_servico_externo) | Orientar sobre serviço externo | não |
| [`obter_ajuda`](#obter_ajuda) | Ajuda por ficha | não |
| [`verificar_versao_tabelas`](#verificar_versao_tabelas) | Versão das tabelas embarcadas | não |
| [`calcular_expressao`](#calcular_expressao) | Calculadora | não |
| [`consultar_atalhos`](#consultar_atalhos) | Atalhos e botões do programa oficial | não |
| [`diagnosticar_servidor`](#diagnosticar_servidor) | Diagnóstico do servidor | não |
| [`enviar_sugestao`](#enviar_sugestao) | Preparar sugestão ou relato para o projeto | não |

## `orientar_servico_externo`

**Orientar sobre serviço externo**. Não grava nada.

Explica como usar um serviço que só existe fora do MCP Imposto de Renda (gov.br, pré-preenchida, Carnê-Leão Web, consulta de CPF, e-CAC, extrato e malha, débito automático, Darf e Sicalc, GCAP, Livro Caixa rural, restituição) e o que trazer de volta para a pasta autorizada. O MCP Imposto de Renda não acessa a rede.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `servico` | um de 11 valores (`"gov_br"`, `"pre_preenchida"`, `"carne_leao_web"`, `"consulta_cpf"`, `"e_cac"`, `"extrato_malha"`, ...) | **sim** |   |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `titulo` | texto |   |
| `onde` | texto |   |
| `passos` | lista de texto |   |
| `trazer` | texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "servico": "pre_preenchida"
}
```

Resposta em texto:

```text
Declaração pré-preenchida (Programa IRPF 2026 (Nova Declaração > Iniciar declaração a partir da pré-preenchida) ou e-CAC.)
1. No programa oficial, entre com a conta gov.br e crie a declaração a partir da pré-preenchida.
2. Salve a declaração e use Ferramentas > Gravar Cópia de Segurança para gerar o .DBK.
3. Coloque o .DBK na pasta autorizada e use importar_pre_preenchida para criar a declaração com o nome padrão (ou abrir_declaracao para só conferir).
Trazer: O arquivo .DBK gravado pelo programa.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "titulo": "Declaração pré-preenchida",
  "onde": "Programa IRPF 2026 (Nova Declaração > Iniciar declaração a partir da pré-preenchida) ou e-CAC.",
  "passos": [
    "No programa oficial, entre com a conta gov.br e crie a declaração a partir da pré-preenchida.",
    "Salve a declaração e use Ferramentas > Gravar Cópia de Segurança para gerar o .DBK.",
    "(+1 itens omitidos)"
  ],
  "trazer": "O arquivo .DBK gravado pelo programa."
}
```

</details>

### Funções do programa oficial

Aparece em 19 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-MENU-IMPORTACOES` Menu Importações (P1, parcial)
- `M-INICIAL-NOVA` Aba "Nova" (tela "O que você deseja fazer?") (P0, parcial)
- `M-DECL-SALVAR-ONLINE` Declaração > Salvar On-line (F6) (P2, implementada)
- `M-DECL-RECUPERAR-ONLINE` Declaração > Recuperar On-line (F7) (P2, implementada)
- `M-IMPR-DARF-AUXILIO` Darf de devolução do Auxílio Emergencial (inferido) (P2, implementada)
- `M-IMP-PREPREENCHIDA` Importar Declaração Pré-Preenchida (P1, parcial)
- `M-IMP-CARNE-LEAO` Importar Carnê-Leão 2025 (P1, parcial)
- `M-FERR-LOGIN-GOVBR` Entrar e sair com gov.br (P2, implementada)
- e mais 11 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `obter_ajuda`

**Ajuda por ficha**. Não grava nada.

Devolve a ajuda de uma ficha, demonstrativo, menu ou regra do programa oficial, tirada das notas de mapeamento do MCP Imposto de Renda (onde fica, a quem se aplica, campos, validações, códigos e regras de cálculo, com a página da Ajuda do programa). Busca por identificador (ex.: F-IDENT, F-DEP) ou por palavras (ex.: "despesas médicas"); sem 'consulta', lista os identificadores, com filtro opcional por prefixo.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `consulta` | texto | não | (até 200 caracteres) |
| `prefixo` | texto | não | Na listagem, só os tópicos cujo identificador começa assim (ex.: "F-"). (até 20 caracteres) |
| `limite` | inteiro (1 a 10) | não |   |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `topicos` | lista de objeto |   |
| `lista` | lista de objeto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "consulta": "dependentes",
  "limite": 2
}
```

Resposta em texto:

```text
## F-DEP Dependentes
- Onde: ficha Dependentes; págs. 47 a 49
- Aplica-se a: todos (campo extra na Saída Definitiva)
- Campos (por dependente, botões Novo/Editar/Excluir, OK): - Tipo de dependente (código, tabela de relação de dependência, dependencias.xml)
- Nome completo
- CPF (obrigatório para todos os dependentes)
- Data de nascimento (dd/mm/aaaa)
- Raça/Cor (Amarela, Branca, Indígena, Parda, Preta)
- Celular (DDD 2 + até 9 dígitos; desabilitado se mora com o titular e endereço do titular no Exterior)
- E-mail (desabilitado na mesma condição)
- Dependente mora com o titular da declaração? (marcação)
- Saiu do país na mesma data que o declarante? (só Saída Definitiva; SIM apenas se o dependente adquiriu condição de não residente na mesma data)
- Total de dedução com dependentes (calculado)
- Validações conhecidas: - CPF obrigatório e válido para todo dependente.
- Pode ser dependente quem manteve relação de dependência mesmo por menos de 12 meses em 2025 (nascimento, falecimento).
- Declaração em separado: dependente comum só pode constar na declaração de um dos cônjuges.
- Filho de pais divorciados/separados (judicialmente ou por escritura pública, art. 733 CPC): só na declaração de quem detém a guarda judicial; se o filho declara em separado, não pode ser dependente do responsável. Exceção: separação/divórcio em 2025 com pensão judicial paga, somente no ano-calendário 2025, o não guardião pode considerar os filhos dependentes e deduzir a pensão.
- Companheiro(a), inclusive homoafetivo: vida em comum por mais de 5 anos, ou menos se houve filho (Parecer PGFN/CAT 1.503/2010).
- Mora com o titular + "Houve alteração cadastral = SIM": atualiza também o cadastro CPF do dependente.
- Códigos: tabela de relação de dependência (dependencias.xml).
- Regras de cálculo afetadas: dedução anual de R$ 2.275,08 por dependente (total = quantidade x 2.275,08) no Resumo (modelo completo). Rendimentos dos dependentes somam-se aos tributáveis da declaração pelas abas próprias.
- Importações/exportações: exclusão em cascata automática: ao excluir dependente, o programa apaga dados dele na aba Dependentes de Rendimentos PJ, Rendimentos PF/Exterior, Pagamentos Efetuados, Ganhos de Capital e Renda Variável (campo Imposto a Pagar). NÃO apaga automaticamente: Rendimentos Isentos, Tributação Exclusiva, Doações Efetuadas, Bens e Direitos, Dívidas e Ônus; o usuário deve excluí-los.
- Observações: valor de R$ 2.275,08 anual e R$ 189,59 mensal (2025).

(... mais 7 linhas)
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "topicos": [
    {
      "id": "F-DEP",
      "nome": "Dependentes",
      "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
      "itens": [
        {
          "campo": "Onde",
          "texto": "ficha Dependentes; págs. 47 a 49"
        },
        {
          "campo": "Aplica-se a",
          "texto": "todos (campo extra na Saída Definitiva)"
        },
        "(+6 itens omitidos)"
      ]
    },
    {
      "id": "F-RTPJ-DEP",
      "nome": "Rendimentos Tributáveis Recebidos de PJ pelos Dependentes",
      "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
      "itens": [
        {
          "campo": "Onde",
          "texto": "ficha Rendimentos Tributáveis Recebidos de PJ, aba Dependentes; págs. 53 e 54"
        },
        {
          "campo": "Aplica-se a",
          "texto": "todos"
        },
        "(+4 itens omitidos)"
      ]
    }
  ],
  "lista": []
}
```

</details>

### Funções do programa oficial

Aparece em 27 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-MENU-AJUDA` Menu Ajuda (P2, implementada)
- `M-TOOLBAR` Barra de ferramentas (P2, implementada)
- `M-INICIAL-BOASVINDAS` Aba "Boas-vindas", links úteis e "Entrar com gov.br" (P2, implementada)
- `M-FERR-PAGINAS` Links para páginas da RFB (IRPF, DTE) e navegador (P2, implementada)
- `M-FERR-LEAOZINHO` Assistente "Leãozinho" (inferido) (P2, implementada)
- `M-AJUDA-CONTEXTUAL` Ajuda de campo (F1) e textos em azul (P1, implementada)
- `M-AJUDA-DOCUMENTOS` Conteúdo, Instruções, Como Fazer, Perguntas e Respostas, FAQ (P2, implementada)
- `M-AJUDA-ATALHOS` Exibir atalhos (P2, implementada)
- e mais 19 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `verificar_versao_tabelas`

**Versão das tabelas embarcadas**. Não grava nada.

Informa de qual versão do programa oficial vieram as tabelas de códigos e parâmetros embarcadas no MCP Imposto de Renda e quantos registros cada uma tem. Se houver versão mais nova do programa, confira as tabelas nele.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

Sem parâmetros.

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `programa` | texto |   |
| `versao` | texto |   |
| `tabelas` | lista de objeto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{}
```

Resposta em texto:

```text
Tabelas do IRPF 2026 versão 1.5:
- aliquotas-parametros: 216
- altcoins: 16
- atividade-rural-bens: 11
- atividade-rural-condicoes-exploracao: 6
- atividade-rural-tipos: 9
- bancos: 27
- bancos-bens: 651
- bancos-calculo-dv: 16
- bens-direitos: 63
- datas-prazos: 11
- dependentes: 10
- dividas-onus: 6
- dolar-2025: 13
- fundos-eca: 4618
- fundos-idoso: 2458
- moedas: 47
- municipios: 5571
- municipios-calamidade: 399
- naturezas-ocupacao: 23
- ocupacoes-principais: 136
- pagamentos: 42
- paises: 248
- paises-gcap: 249
(... mais 9 linhas)
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "programa": "IRPF 2026",
  "versao": "1.5",
  "tabelas": [
    {
      "tabela": "aliquotas-parametros",
      "registros": 216
    },
    {
      "tabela": "altcoins",
      "registros": 16
    },
    "(+30 itens omitidos)"
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 2 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-FERR-ATUALIZACOES` Verificar Atualizações (P2, implementada)
- `S-NUVEM-MUNICIPIOS` Atualização da tabela de municípios (P2, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `calcular_expressao`

**Calculadora**. Não grava nada.

Calculadora do MCP Imposto de Renda, equivalente a Ferramentas > Calculadora do programa oficial: avalia expressões com +, -, *, /, parênteses e porcentagem ("27,5% * 10.000,00") em aritmética decimal exata, sem erro de arredondamento binário, e arredonda o resultado (metade para cima) nas casas pedidas. Aceita "1.234,56" ou "1234.56"; "1.234" sem vírgula é recusado por ser ambíguo. Use para conferir somas de comprovantes, limites e parcelas antes de lançar.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `expressao` | texto | **sim** | Expressão, por exemplo "1.903,98 * 13". (até 500 caracteres) |
| `casas` | inteiro (0 a 10) | não | Casas decimais do resultado. (padrão: `2`) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `resultado` | texto | Formato brasileiro: 1.234,56. |
| `decimal` | texto | Com ponto decimal: 1234.56. |
| `exato` | booleano |   |
| `fracao` | texto | Valor exato como fração n/d. |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "expressao": "1.903,98 * 13"
}
```

Resposta em texto:

```text
1.903,98 * 13 = 24.751,74
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "resultado": "24.751,74",
  "decimal": "24751.74",
  "exato": true,
  "fracao": "1237587/50"
}
```

</details>

### Funções do programa oficial

Aparece em 1 linha da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-FERR-CALCULADORA` Calculadora (P2, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `consultar_atalhos`

**Atalhos e botões do programa oficial**. Não grava nada.

Explica os atalhos de teclado e os botões do programa oficial (barra de ferramentas, menus por Alt, F1, F5, F11 de acessibilidade, Ctrl+P, Ctrl+Shift+G e outros) e diz qual ferramenta do MCP Imposto de Renda faz a mesma coisa, com o status de cobertura. Busca por tecla ("Ctrl+P", "F5") ou por palavras da função ("pendências", "imprimir"); sem consulta, lista todos. Útil quando o usuário segue um tutorial do programa ou vai concluir a entrega nele.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `consulta` | texto | não | (até 100 caracteres) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `total` | número |   |
| `atalhos` | lista de objeto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "consulta": "Ctrl+P"
}
```

Resposta em texto:

```text
- Ctrl+P: Imprimir Declaração (M-IMPR-DECLARACAO). No MCP: gerar_relatorio_declaracao, gravar_relatorio (implementada).
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "total": 1,
  "atalhos": [
    {
      "tecla": "Ctrl+P",
      "id": "M-IMPR-DECLARACAO",
      "funcao": "Imprimir Declaração",
      "status": "implementada",
      "ferramentas": [
        "gerar_relatorio_declaracao",
        "gravar_relatorio"
      ]
    }
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 4 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-TOOLBAR` Barra de ferramentas (P2, implementada)
- `M-FERR-LEAOZINHO` Assistente "Leãozinho" (inferido) (P2, implementada)
- `M-AJUDA-ATALHOS` Exibir atalhos (P2, implementada)
- `M-AJUDA-ACESSIBILIDADE` Acessibilidade (F11) e leitura de tela (P2, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `diagnosticar_servidor`

**Diagnóstico do servidor**. Não grava nada.

Mostra o estado do próprio servidor do MCP Imposto de Renda: versão, versão das tabelas, perfil, grupos e quantidade de ferramentas registradas, se há pasta autorizada (só o nome da pasta, nunca o caminho), modo somente leitura, uso de memória do processo e versões do Node e da plataforma. Não lê a declaração nem devolve dado pessoal. Útil para conferir a instalação, para entender por que uma ferramenta não aparece e para anexar a um relato de problema.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

Sem parâmetros.

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `versao` | texto |   |
| `tabelas` | texto |   |
| `perfil` | texto |   |
| `somenteLeitura` | booleano |   |
| `totalFerramentas` | número |   |
| `grupos` | lista de objeto |   |
| `pasta` | objeto |   |
| `memoria` | objeto |   |
| `node` | texto |   |
| `plataforma` | texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{}
```

Resposta em texto:

```text
MCP Imposto de Renda 0.1.0 (tabelas IRPF 2026 1.5), perfil completo.
166 ferramenta(s) em 11 grupo(s): calculo 6, declaracao 4, fichas 1, edicao 105, ciclo 20, validacao 2, tabelas 2, arquivos 5, saidas 4, calculadoras 10, orientacao 7.
Pasta autorizada: <pasta> (limite de 20 MB por arquivo).
Memória do processo: 120 MB residentes, heap 40 de 60 MB, externa 3 MB.
Node v22.20.0, plataforma linux x64.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "versao": "0.1.0",
  "tabelas": "IRPF 2026 1.5",
  "perfil": "completo",
  "somenteLeitura": false,
  "totalFerramentas": 166,
  "grupos": [
    {
      "nome": "calculo",
      "ferramentas": 6
    },
    {
      "nome": "declaracao",
      "ferramentas": 4
    },
    "(+9 itens omitidos)"
  ],
  "pasta": {
    "configurada": true,
    "nome": "<pasta>",
    "limiteArquivoMB": 20
  },
  "memoria": {
    "rssMB": 120,
    "heapUsadoMB": 40,
    "heapTotalMB": 60,
    "externaMB": 3
  },
  "node": "v22.20.0",
  "plataforma": "linux x64"
}
```

</details>

### Funções do programa oficial

Aparece em 1 linha da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-FERR-MEMORIA` Memória do IRPF (inferido) (P2, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `enviar_sugestao`

**Preparar sugestão ou relato para o projeto**. Não grava nada.

Monta o texto de uma issue para o repositório público do MCP Imposto de Renda (sugestão, problema ou dúvida), com modelo, versão, perfil e plataforma, e devolve o link para o usuário abrir e enviar ele mesmo. Não acessa a rede e não envia nada. Tira do título e da descrição CPF, CNPJ, valores em reais, e-mails e números longos; mesmo assim, peça ao usuário que releia antes de publicar, porque nomes não são detectados. Nunca inclua dados da declaração.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `tipo` | `"sugestao"` \| `"problema"` \| `"duvida"` | **sim** | sugestao, problema ou duvida. |
| `titulo` | texto | **sim** | Resumo em uma linha, sem dados pessoais. (até 120 caracteres) |
| `descricao` | texto | **sim** | O que aconteceu ou o que se espera, sem CPF, nomes, valores nem arquivos. (até 2000 caracteres) |
| `ferramenta` | texto | não | Nome da ferramenta envolvida, se houver. (formato `^[a-z0-9_]{1,64}$`) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `link` | texto |   |
| `linkPreenchido` | texto |   |
| `titulo` | texto |   |
| `corpo` | texto |   |
| `removidos` | número | Trechos sensíveis retirados do texto. |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "tipo": "sugestao",
  "titulo": "Ler o informe de rendimentos em PDF",
  "descricao": "Seria útil importar o informe de rendimentos direto do PDF do banco, sem copiar o texto.",
  "ferramenta": "importar_informe_rendimentos"
}
```

Resposta em texto:

```text
Texto da issue pronto. Abra https://github.com/ALASTecnology/mcp-imposto-de-renda/issues/new (ou o link preenchido abaixo), releia e envie: o MCP Imposto de Renda não envia nada.
Nenhum trecho sensível encontrado; mesmo assim, confira se não há nomes.

Título: [Sugestão] Ler o informe de rendimentos em PDF

## Sugestão

Seria útil importar o informe de rendimentos direto do PDF do banco, sem copiar o texto.

## Contexto

- Ferramenta: importar_informe_rendimentos
- Versão do servidor: 0.1.0
- Perfil: completo
- Tabelas: IRPF 2026 1.5
- Node e plataforma: v22.20.0, linux x64

## Conferência

- [ ] Reli o texto e ele não tem CPF, CNPJ, nomes, valores, número de recibo nem arquivo da declaração.

Link preenchido: https://github.com/ALASTecnology/mcp-imposto-de-renda/issues/new?title=%5BSugest%C3%A3o%5D+Ler+o+informe+de+rendimentos+em+PDF&body=%23%23+Sugest%C3%A3o%0A%0ASeria+%C3%BAtil+importar+o+informe+de+rendimentos+direto+do+PDF+do+banco%2C+sem+copiar+o+texto.%0A%0A%23%23+Contexto%0A%0A-+Ferramenta%3A+importar_informe_rendimentos%0A-+Vers%C3%A3o+do+servidor%3A+0.1.0%0A-+Perfil%3A+completo%0A-+Tabelas%3A+IRPF+2026+1.5%0A-+Node+e+plataforma%3A+v22.20.0%2C+linux+x64%0A%0A%23%23+Confer%C3%AAncia%0A%0A-+%5B+%5D+Reli+o+texto+e+ele+n%C3%A3o+tem+CPF%2C+CNPJ%2C+nomes%2C+valores%2C+n%C3%BAmero+de+recibo+nem+arquivo+da+declara%C3%A7%C3%A3o.&labels=enhancement
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "link": "https://github.com/ALASTecnology/mcp-imposto-de-renda/issues/new",
  "linkPreenchido": "https://github.com/ALASTecnology/mcp-imposto-de-renda/issues/new?title=%5BSugest%C3%A3o%5D+Ler+o+informe+de+rendimentos+em+PDF&body=%23%23+Sugest%C3%A3o%0A%0ASeria+%C3%BAtil+importar+o+informe+de+rendimentos+direto+do+PDF+do+banco%2C+sem+co (...)",
  "titulo": "[Sugestão] Ler o informe de rendimentos em PDF",
  "corpo": "## Sugestão\n\nSeria útil importar o informe de rendimentos direto do PDF do banco, sem copiar o texto.\n\n## Contexto\n\n- Ferramenta: importar_informe_rendimentos\n- Versão do servidor: 0.1.0\n- Perfil: completo\n- Tabelas: IRPF 2026 1.5\n- Node e  (...)",
  "removidos": 0
}
```

</details>

### Funções do programa oficial

Aparece em 1 linha da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-FERR-AVALIACAO` Avaliação do programa (inferido) (P2, implementada)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)
