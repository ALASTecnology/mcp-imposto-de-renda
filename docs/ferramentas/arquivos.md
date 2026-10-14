<!-- Arquivo gerado por `pnpm docs:catalogo` (tools/docs/referencia.mjs). Não edite à mão. -->

<a id="topo"></a>

# Grupo `arquivos`

Arquivos da pasta autorizada. Lista os arquivos da pasta autorizada e confere os controles de integridade.

**2 ferramentas**, 0 delas gravam na pasta autorizada. O grupo só é registrado quando o servidor recebe `--dir`.

| Ferramenta | Título | Grava? |
| --- | --- | --- |
| [`listar_arquivos`](#listar_arquivos) | Listar arquivos da pasta autorizada | não |
| [`verificar_integridade_arquivo`](#verificar_integridade_arquivo) | Verificar integridade do DBK/DEC | não |

## `listar_arquivos`

**Listar arquivos da pasta autorizada**. Não grava nada. Exige `--dir`.

Lista os arquivos .DBK, .DEC, .json e .txt da pasta autorizada (sem subpastas, ocultos ou links).

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

Sem parâmetros.

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `arquivos` | lista de objeto |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{}
```

Resposta em texto:

```text
- 10234522275-IRPF-A-2026-2025-ORIGI.DBK (14476 bytes, 2026-04-10T12:00:00.000Z)
- 10459818260-IRPF-A-2026-2025-ORIGI.DBK (8704 bytes, 2026-04-10T12:00:00.000Z)
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "arquivos": [
    {
      "nome": "10234522275-IRPF-A-2026-2025-ORIGI.DBK",
      "tamanho": 14476,
      "modificadoEm": "2026-04-10T12:00:00.000Z"
    },
    {
      "nome": "10459818260-IRPF-A-2026-2025-ORIGI.DBK",
      "tamanho": 8704,
      "modificadoEm": "2026-04-10T12:00:00.000Z"
    }
  ]
}
```

</details>

### Funções do programa oficial

Aparece em 6 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-INICIAL` Tela "O que você deseja fazer?" (P0, parcial)
- `M-INICIAL-EMPREENCH` Aba "Em Preenchimento" (P1, parcial)
- `M-INICIAL-TRANSMITIDAS` Aba "Transmitidas" (P1, parcial)
- `M-IMPR-RELACAO` Imprimir Relação de Declarações (P2, parcial)
- `M-IMP-SUGESTAO` Sugestão de importação (inferido) (P2, parcial)
- `S-UMA-ABERTA` Uma declaração aberta por vez e base local (P2, parcial)

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)

## `verificar_integridade_arquivo`

**Verificar integridade do DBK/DEC**. Não grava nada. Exige `--dir`.

Confere os controles do arquivo: número de controle (CRC-32) de cada registro, contagens do registro T9 e hash do header. Divergência indica arquivo editado fora do programa ou corrompido.

| Só leitura (`readOnlyHint`) | Destrutiva (`destructiveHint`) | Idempotente (`idempotentHint`) | Rede (`openWorldHint`) |
| --- | --- | --- | --- |
| sim | não | sim | não |

### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `arquivo` | texto | **sim** | Arquivo .DBK ou .DEC. Nome relativo à pasta autorizada (ex.: "12345678909-IRPF-A-2026-2025-ORIGI.DBK"); use listar_arquivos. (até 255 caracteres) |

### Resposta estruturada

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `arquivo` | texto |   |
| `exercicio` | número |   |
| `valido` | booleano |   |
| `registros` | número |   |
| `totalDivergencias` | número |   |
| `divergencias` | lista de objeto |   |
| `variantesHashQueConferem` | lista de texto |   |
| `variantesTotalQueConferem` | lista de texto |   |
| `controleHeaderConfereComCrc` | booleano ou nulo |   |

### Exemplo

Chamada (`tools/call`, campo `arguments`):

```json
{
  "arquivo": "10234522275-IRPF-A-2026-2025-ORIGI.DBK"
}
```

Resposta em texto:

```text
10234522275-IRPF-A-2026-2025-ORIGI.DBK: controles conferem (21 registros, CRC de cada linha, T9 e hash do header).
```

<details>
<summary>Resposta estruturada (<code>structuredContent</code>)</summary>

```json
{
  "arquivo": "10234522275-IRPF-A-2026-2025-ORIGI.DBK",
  "exercicio": 2026,
  "valido": true,
  "registros": 21,
  "totalDivergencias": 0,
  "divergencias": [],
  "variantesHashQueConferem": [
    "linhas+T9"
  ],
  "variantesTotalQueConferem": [
    "declaracao-sem-T9"
  ],
  "controleHeaderConfereComCrc": false
}
```

</details>

### Funções do programa oficial

Aparece em 16 linhas da [matriz de cobertura](../mapeamento/matriz-cobertura.md#matriz):

- `M-DECL-ENTREGAR` Declaração > Entregar Declaração (P0, implementada)
- `M-FERR-COPIA-GRAVAR` Gravar Cópia de Segurança (P1, implementada)
- `S-GRAVAR-ENTREGA` Gravação da declaração para entrega (arquivo .DEC) (P0, implementada)
- `S-ARQ-GERAL` Estrutura do arquivo de declaração (P0, parcial)
- `S-ARQ-REG-IDENT` Registro 16 (identificação do contribuinte) (P0, implementada)
- `S-ARQ-REG-TOTAIS` Registros 17, 18, 19 e 20 (totais, modelo, imposto pago e resumo) (P0, implementada)
- `S-ARQ-REG-RENDIMENTOS` Registros 21, 32, 22, 49, 80, 81 (rendimentos PJ, PF/Exterior e exigibilidade suspensa) (P0, implementada)
- `S-ARQ-REG-ISENTOS-EXCL` Registros 23, 24, 31, 33, 82 e 83 a 99 (isentos, exclusivos e detalhes) (P0, implementada)
- e mais 8 linhas na matriz.

[Voltar ao início](#topo) · [Índice das ferramentas](README.md)
