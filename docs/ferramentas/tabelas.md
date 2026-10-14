<!-- Arquivo gerado por `pnpm docs:catalogo` (tools/docs/referencia.mjs). Não edite à mão. -->

<a id="topo"></a>

# Grupo `tabelas`

Tabelas de códigos do programa (dependentes, pagamentos, bens, municípios...). Consulta as tabelas de códigos embarcadas do exercício.

**2 ferramentas**, 0 delas gravam na pasta autorizada. O grupo funciona mesmo sem `--dir`.

| Ferramenta | Título | Grava? |
| --- | --- | --- |
| [`listar_tabela`](#listar_tabela) | Listar tabela de códigos | não |
| [`buscar_codigo`](#buscar_codigo) | Buscar código em tabela | não |

## `listar_tabela`

**Listar tabela de códigos**. Não grava nada.

Lista as entradas de uma tabela de códigos do exercício 2026, com filtro opcional por texto (sem diferenciar acentos) e paginação. Use para achar o código certo antes de preencher uma ficha.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `tabela` | um de 31 valores (`"aliquotas-parametros"`, `"altcoins"`, `"atividade-rural-bens"`, `"atividade-rural-condicoes-exploracao"`, `"atividade-rural-tipos"`, `"bancos"`, ...) | **sim** | Nome da tabela de códigos do exercício 2026. |
| `filtro` | texto | não | Trecho do código ou da descrição (ex.: 'plano de saude', 'apartamento'). (até 100 caracteres) |
| `limite` | inteiro (1 a 500) | não | Máximo de itens (1 a 500). (padrão: `100`) |
| `deslocamento` | inteiro (a partir de 0) | não | Itens a pular, para paginar. (padrão: `0`) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `tabela` | texto |   |
| `total` | número | Total de itens que atendem ao filtro. |
| `itens` | lista de objeto livre |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "tabela": "dependentes",
  "limite": 4
}
```

Resposta em texto:

```text
dependentes: 10 item(ns), mostrando 4.
11: Companheiro(a) com o(a) qual o(a) contribuinte tenha filho ou viva há mais de 5 (cinco) anos, ou cônjuge.
21: Filho(a) ou enteado(a) até 21 (vinte e um) anos.
22: Filho(a) ou enteado(a) cursando estabelecimento de nível superior ou escola técnica de 2º grau, até 24 (vinte e quatro) anos.
23: Filho(a) ou enteado(a) com deficiência, em qualquer idade, quando a sua remuneração não exceder as deduções autorizadas por lei.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "tabela": "dependentes",
  "total": 10,
  "itens": [
    {
      "codigo": "11",
      "descricao": "Companheiro(a) com o(a) qual o(a) contribuinte tenha filho ou viva há mais de 5 (cinco) anos, ou cônjuge.",
      "descricaoResumida": "Companheiro(a) ou cônjuge"
    },
    {
      "codigo": "21",
      "descricao": "Filho(a) ou enteado(a) até 21 (vinte e um) anos."
    },
    "(+2 itens omitidos)"
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 22 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-FERR-INFO-CALCULO` Constantes de cálculo (inferido, tela de testes) (P2, implementada)
- `F-IDENT-END-BR` Endereço - Brasil (P0, parcial)
- `F-IDENT-END-EXT` Endereço - Exterior (P0, parcial)
- `F-IDENT-OCUP` Ocupação Principal (P0, implementada)
- `F-BENS-G01` Grupo 01, Bens imóveis (P0, implementada)
- `F-BENS-G02` Grupo 02, Bens móveis (P0, implementada)
- `F-BENS-G03` Grupo 03, Participações societárias (P0, implementada)
- `F-BENS-G04` Grupo 04, Aplicações e investimentos (P0, implementada)
- e mais 14 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `buscar_codigo`

**Buscar código em tabela**. Não grava nada.

Busca um código exato numa tabela do exercício 2026. Em bens-direitos use 'GG.CC' (grupo e código, ex.: '01.11'); nos fundos, o CNPJ com ou sem pontuação.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `tabela` | um de 31 valores (`"aliquotas-parametros"`, `"altcoins"`, `"atividade-rural-bens"`, `"atividade-rural-condicoes-exploracao"`, `"atividade-rural-tipos"`, `"bancos"`, ...) | **sim** | Nome da tabela de códigos do exercício 2026. |
| `codigo` | texto | **sim** | Código a buscar. (até 30 caracteres) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `tabela` | texto |   |
| `codigo` | texto |   |
| `encontrado` | booleano |   |
| `entrada` | objeto livre ou nulo |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "tabela": "bens-direitos",
  "codigo": "01-11"
}
```

Resposta em texto:

```text
Código "01-11" não existe na tabela bens-direitos. Use listar_tabela com filtro para procurar.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "tabela": "bens-direitos",
  "codigo": "01-11",
  "encontrado": false,
  "entrada": null
}
```

</details>

### Funções do programa oficial

Aparece em 22 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-FERR-INFO-CALCULO` Constantes de cálculo (inferido, tela de testes) (P2, implementada)
- `F-IDENT-END-BR` Endereço - Brasil (P0, parcial)
- `F-IDENT-END-EXT` Endereço - Exterior (P0, parcial)
- `F-IDENT-OCUP` Ocupação Principal (P0, implementada)
- `F-BENS-G01` Grupo 01, Bens imóveis (P0, implementada)
- `F-BENS-G02` Grupo 02, Bens móveis (P0, implementada)
- `F-BENS-G03` Grupo 03, Participações societárias (P0, implementada)
- `F-BENS-G04` Grupo 04, Aplicações e investimentos (P0, implementada)
- e mais 14 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)
