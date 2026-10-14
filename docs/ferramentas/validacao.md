<!-- Arquivo gerado por `pnpm docs:catalogo` (tools/docs/referencia.mjs). Não edite à mão. -->

<a id="topo"></a>

# Grupo `validacao`

Validação de CPF/CNPJ e pendências da declaração. Confere documentos e aplica as regras de consistência da declaração.

**2 ferramentas**, 0 delas gravam na pasta autorizada. O grupo funciona mesmo sem `--dir`.

| Ferramenta | Título | Grava? |
| --- | --- | --- |
| [`validar_documento`](#validar_documento) | Validar CPF ou CNPJ | não |
| [`validar_declaracao`](#validar_declaracao) | Validar a declaração (pendências) | não |

## `validar_documento`

**Validar CPF ou CNPJ**. Não grava nada.

Confere os dígitos verificadores de um CPF (11 dígitos) ou CNPJ (14 dígitos). Aceita o número com ou sem pontuação. Não consulta a situação cadastral.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `documento` | texto | **sim** | CPF ou CNPJ, com ou sem pontuação. (até 32 caracteres) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `tipo` | `"cpf"` \\| `"cnpj"` \\| `"desconhecido"` |   |
| `valido` | booleano |   |
| `normalizado` | texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "documento": "102.345.222-75"
}
```

Resposta em texto:

```text
CPF válido.
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "tipo": "cpf",
  "valido": true,
  "normalizado": "10234522275"
}
```

</details>

### Funções do programa oficial

Aparece em 16 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `F-IDENT` Identificação do Contribuinte (visão geral) (P0, parcial)
- `F-IDENT-TIPO` Que Tipo de Declaração Você Deseja Fazer? (P0, parcial)
- `F-IDENT-NOME` Nome (P0, parcial)
- `F-IDENT-NASC` Data de Nascimento (P0, parcial)
- `F-IDENT-DOENCA` Há declarante ou dependente com doença grave ou deficiência física ou mental? (P0, parcial)
- `F-IDENT-RACA` Raça/Cor (P0, parcial)
- `F-IDENT-ALTCAD` Houve alteração de dados cadastrais? (P0, parcial)
- `F-IDENT-CONJ` Possui cônjuge ou companheiro(a)? (P0, parcial)
- e mais 8 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `validar_declaracao`

**Validar a declaração (pendências)**. Não grava nada.

Aplica as regras de consistência equivalentes às críticas do programa oficial e lista as pendências: 'erro' impede a entrega, 'aviso' indica risco de malha fina. Informe a declaração em JSON do modelo ou o nome de um DBK/DEC/JSON da pasta autorizada.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `declaracao` | objeto livre | não | Declaração no modelo do MCP Imposto de Renda (mesma forma devolvida por converter_dbk_para_modelo): valores monetários em centavos (número inteiro), datas AAAA-MM-DD, CPF/CNPJ só dígitos. |
| `arquivo` | texto | não | Arquivo da declaração (.DBK, .DEC ou .json). Nome relativo à pasta autorizada (ex.: "12345678909-IRPF-A-2026-2025-ORIGI.DBK"); use listar_arquivos. (até 255 caracteres) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `origem` | texto |   |
| `podeEntregar` | booleano |   |
| `totalErros` | número |   |
| `totalAvisos` | número |   |
| `pendencias` | lista de objeto |   |
| `avisosConversao` | lista de texto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "arquivo": "10234522275-IRPF-A-2026-2025-ORIGI.DBK"
}
```

Resposta em texto:

```text
Sem erros impeditivos; 0 aviso(s).
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "origem": "10234522275-IRPF-A-2026-2025-ORIGI.DBK",
  "podeEntregar": true,
  "totalErros": 0,
  "totalAvisos": 0,
  "pendencias": [],
  "avisosConversao": []
}
```

</details>

### Funções do programa oficial

Aparece em 20 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-DECL-PENDENCIAS` Declaração > Verificar Pendências (P0, implementada)
- `M-DECL-ENTREGAR` Declaração > Entregar Declaração (P0, implementada)
- `S-REGRA-CASADO` Contribuinte casado (P1, implementada)
- `S-REGRA-COMPANHEIRO` Contribuinte que tenha companheiro (P1, implementada)
- `S-REGRA-SEPARADO-FATO` Contribuinte separado de fato (P1, implementada)
- `S-REGRA-DIVORCIADO` Contribuinte separado judicialmente, divorciado, que dissolveu união estável ou separado/divorciado por escritura pública (P1, implementada)
- `S-REGRA-VIUVO` Contribuinte viúvo (P1, implementada)
- `S-REGRA-MENOR` Contribuinte menor (P1, implementada)
- e mais 12 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)
