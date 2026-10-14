# Primeira declaração com o AutoIR

Tutorial completo, do zero até a transmissão, com uma contribuinte fictícia. Todos os nomes, CPFs,
CNPJs e valores abaixo são inventados; os CPFs e CNPJs só têm dígitos verificadores válidos. As
respostas das ferramentas foram obtidas rodando o servidor com estes dados (datas e horas dos
backups variam).

> Lembrete: tudo o que as ferramentas devolvem chega ao provedor de LLM do seu cliente MCP. O
> AutoIR não é serviço oficial; a conferência e a transmissão são feitas no programa da Receita
> Federal.

## O caso

| Item | Valor fictício |
| --- | --- |
| Titular | MARIA FICTICIA DA SILVA, CPF 123.456.789-09, nascida em 12/05/1988 |
| Dependente | PEDRO FICTICIO DA SILVA, filho, CPF 987.654.321-00, nascido em 03/09/2016 |
| Fonte pagadora | EMPRESA FICTICIA LTDA, CNPJ 11.222.333/0001-81 |
| Informe de rendimentos | rendimentos R$ 85.000,00; INSS R$ 9.350,00; IRRF R$ 7.420,00; 13º R$ 7.000,00 com IRRF de R$ 480,00 |
| Despesa médica da titular | R$ 3.200,00, CLINICA FICTICIA, CNPJ 11.444.777/0001-61 |
| Escola do dependente | R$ 6.000,00, ESCOLA FICTICIA, CNPJ 11.444.777/0001-61 |
| Bem | conta corrente no banco 001, agência 1234, conta 56789-2: R$ 4.500,00 em 31/12/2024 e R$ 12.300,00 em 31/12/2025 |

## 1. Prepare a pasta e o cliente

```sh
mkdir -p ~/Documentos/IR-2026
```

Configure o cliente MCP com `--dir` apontando para essa pasta (caminho absoluto), conforme
[clientes-mcp.md](clientes-mcp.md). Reinicie o cliente e confira se as ferramentas do AutoIR
aparecem.

## 2. Crie a declaração no programa oficial e grave a cópia

O jeito mais seguro de começar é deixar o programa oficial criar o arquivo e usar o AutoIR para
preenchê-lo:

1. No programa IRPF 2026, crie a declaração (**Declaração > Nova**) com CPF, nome e identificação
   da titular.
2. Grave a cópia de segurança em **Ferramentas > Cópia de Segurança > Gravar**, escolhendo a pasta
   `~/Documentos/IR-2026`. O programa nomeia o arquivo pelo CPF, por exemplo
   `12345678909-IRPF-A-2026-2025-ORIGI.DBK`.

Se você já tem uma declaração em andamento, ou a do ano passado gravada pelo programa, use esse
arquivo no lugar. Também é possível criar o arquivo pelo AutoIR com `criar_declaracao`, que recebe
a identificação no formato do modelo e grava o `.DBK` com o mesmo nome padrão; partir do programa
oficial continua sendo o caminho mais conservador.

## 3. Comece a conversa

No cliente, acione o prompt **`preparar_declaracao`** (com o argumento `arquivo` igual ao nome do
`.DBK`) ou escreva:

> Use o AutoIR. Liste os arquivos da pasta, abra o DBK da Maria e me mostre um resumo.

O assistente chama `listar_arquivos` e `abrir_declaracao`:

```text
12345678909-IRPF-A-2026-2025-ORIGI.DBK: exercício 2026, MARIA FICTICIA DA SILVA (CPF 12345678909).
Tipo: ajusteAnual original.
- Dependentes: 0 item(ns)
- Rendimentos Tributáveis Recebidos de Pessoa Jurídica: 0 item(ns), rendimentos R$ 0,00, impostoRetido R$ 0,00
- Pagamentos Efetuados: 0 item(ns), valorPago R$ 0,00
- Bens e Direitos: 0 item(ns), situacaoAnterior R$ 0,00, situacaoAtual R$ 0,00
- Dívidas e Ônus Reais: 0 item(ns), situacaoAtual R$ 0,00
Controles (CRC e T9): conferem.
```

## 4. Confira documentos e códigos

> Confira o CPF 123.456.789-09 e me diga o código de dependência para filho de 9 anos.

```text
validar_documento  ->  CPF válido.
buscar_codigo (tabela dependentes, código 21)
                   ->  21: Filho(a) ou enteado(a) até 21 (vinte e um) anos.
```

Para despesas, o assistente procura o código em `listar_tabela`:

```text
listar_tabela (tabela pagamentos, filtro "instrução")
  pagamentos: 2 item(ns) com "instrução", mostrando 2.
  01: Despesas com instrução no Brasil.
  02: Despesas com instrução no exterior.
```

O código 10 é o de despesas com clínicas e médicos. A lista de tabelas está em
[fichas.md](fichas.md#tabelas-de-códigos).

## 5. Simule antes de preencher

Com os informes em mãos, peça uma simulação. Os valores podem ir em texto, em reais:

```json
{
  "titular": { "cpf": "12345678909", "nome": "MARIA FICTICIA DA SILVA", "nascimento": "1988-05-12" },
  "dependentes": [
    { "cpf": "98765432100", "nome": "PEDRO FICTICIO DA SILVA", "nascimento": "2016-09-03", "codigo": "21" }
  ],
  "rendimentosPJ": [
    {
      "cnpj": "11222333000181",
      "nome": "EMPRESA FICTICIA LTDA",
      "rendimento": "85.000,00",
      "previdenciaOficial": "9.350,00",
      "irrf": "7.420,00",
      "decimoTerceiro": "7.000,00",
      "irrfDecimoTerceiro": "480,00"
    }
  ],
  "pagamentos": [
    { "codigo": "10", "cpfCnpj": "11444777000161", "valor": "3.200,00", "beneficiario": "T" },
    { "codigo": "01", "cpfCnpj": "11444777000161", "valor": "6.000,00", "beneficiario": "D", "cpfDependente": "98765432100" }
  ]
}
```

`simular_imposto` responde:

```text
Exercício 2026: rendimentos tributáveis de R$ 85.000,00.
Completo: imposto devido R$ 7.464,91 (deduções R$ 18.386,58).
Simplificado: imposto devido R$ 7.913,77 (desconto R$ 16.754,34).
Imposto já pago ou retido: R$ 7.420,00.
Mais vantajoso: completo, com saldo a pagar de R$ 44,91; alíquota efetiva 8,78%.
Aviso: Rendimentos tributáveis acima de R$ 35.584,00: declaração obrigatória (IN RFB 2.312/2026).
```

As deduções do completo somam INSS (R$ 9.350,00), um dependente (R$ 2.275,08), a despesa médica
(R$ 3.200,00) e a instrução do filho, limitada a R$ 3.561,50 por pessoa: R$ 18.386,58. O 13º e o
IRRF dele são de tributação exclusiva e não entram no ajuste.

`comparar_modelos` mostra a diferença:

```text
1. Modelo completo: imposto devido R$ 7.464,91, pagar R$ 44,91
2. Modelo simplificado: imposto devido R$ 7.913,77, pagar R$ 493,77
3. Mais vantajoso: completo, com diferença de R$ 448,86
```

Peça `explicar_calculo` para ver a memória de cálculo linha a linha, com a regra legal de cada
passo.

## 6. Preencha as fichas

> Lance no DBK da Maria o dependente, o informe da empresa, as duas despesas e a conta corrente.

Cada lançamento é uma chamada a uma ferramenta do grupo `edicao`, com `arquivo` igual ao `.DBK` e
um `item` no formato do modelo. Valores podem ir em texto, em reais. O cliente deve pedir a sua
confirmação a cada gravação.

```json
{ "arquivo": "12345678909-IRPF-A-2026-2025-ORIGI.DBK",
  "item": { "codigo": "21", "nome": "PEDRO FICTICIO DA SILVA", "cpf": "98765432100",
            "dataNascimento": "2016-09-03", "racaCor": "2" } }
```

`adicionar_dependente` responde:

```text
Dependentes: item 1 incluído. Gravado 12345678909-IRPF-A-2026-2025-ORIGI.DBK (6 registros).
Cópia do conteúdo anterior: .autoir-backups/12345678909-IRPF-A-2026-2025-ORIGI.DBK.20260410T120000Z.bak.
Controles: conferem.
Sem erros impeditivos; 0 aviso(s).
```

Os demais lançamentos seguem o mesmo padrão:

| Ferramenta | `item` |
| --- | --- |
| `adicionar_rendimento_pj` | `{ "beneficiario": { "tipo": "titular" }, "fonte": { "ni": "11222333000181", "nome": "EMPRESA FICTICIA LTDA" }, "rendimentos": "85.000,00", "contribuicaoPrevidenciaria": "9.350,00", "impostoRetido": "7.420,00", "decimoTerceiro": "7.000,00", "impostoRetidoDecimoTerceiro": "480,00" }` |
| `adicionar_pagamento` | `{ "codigo": "10", "niBeneficiario": "11444777000161", "nomeBeneficiario": "CLINICA FICTICIA", "valorPago": "3.200,00" }` |
| `adicionar_pagamento` | `{ "codigo": "01", "realizadoCom": { "tipo": "dependente", "cpf": "98765432100" }, "niBeneficiario": "11444777000161", "nomeBeneficiario": "ESCOLA FICTICIA", "valorPago": "6.000,00" }` |
| `adicionar_bem` | `{ "grupo": "06", "codigo": "01", "discriminacao": "CONTA CORRENTE NO BANCO FICTICIO", "situacaoAnterior": "4.500,00", "situacaoAtual": "12.300,00", "ni": "11222333000181", "conta": { "banco": "001", "agencia": "1234", "conta": "56789", "dv": "2" } }` |

Cada resposta informa o item incluído, o backup do conteúdo anterior e as pendências. Se o dígito da
conta estivesse errado, a resposta já traria o aviso `BEM-CONTA-AVISO` apontando
`bens[0].conta.dv`.

Para revisar, use `listar_pagamentos` (ou `listar_lancamentos` com a ficha), que mostra a posição de
cada item. Para corrigir, `editar_pagamento` com `indice` (a partir de 1) e só os campos a mudar:

```json
{ "arquivo": "12345678909-IRPF-A-2026-2025-ORIGI.DBK", "indice": 1,
  "alteracoes": { "nomeBeneficiario": "CLINICA FICTICIA LTDA" } }
```

```text
Pagamentos Efetuados: item 1 alterado. Gravado 12345678909-IRPF-A-2026-2025-ORIGI.DBK (10 registros).
```

Fichas de objeto único usam `definir_*`: `definir_identificacao` para endereço, ocupação e
cônjuge; `definir_rendimentos_pf_exterior` para carnê-leão mês a mês. O mapa completo está em
[fichas.md](fichas.md). `buscar_nome_por_documento` reaproveita nomes já digitados para um CPF ou
CNPJ.

## 7. Valide e confira o arquivo

> Valide a declaração e explique cada pendência.

```text
listar_fichas                 -> Dependentes: 1, Rendimentos de PJ: 1, Pagamentos Efetuados: 2,
                                 Bens e Direitos: 1, demais fichas vazias
validar_declaracao            -> Sem erros impeditivos; 0 aviso(s).
verificar_integridade_arquivo -> controles conferem (10 registros, CRC de cada linha, T9 e hash do header).
```

`erro` impede a entrega e precisa ser corrigido; `aviso` indica risco ou informação que convém
completar. Para uma revisão focada em malha fina, use o prompt `revisar_malha_fina`.

Todas as versões anteriores do arquivo ficaram em `.autoir-backups` (as 10 mais recentes). Para
voltar atrás, copie o backup desejado de volta para a pasta com o nome original.

## 8. Saldo a pagar e quotas

O saldo de R$ 44,91 é menor que R$ 100,00, então só pode ser pago em quota única. Para saldos
maiores, `calcular_quotas` divide em até 8 quotas. Exemplo com R$ 1.000,00 em 3 quotas:

```text
Quota 1: vence 2026-05-29, principal R$ 333,34, juros R$ 0,00, total R$ 333,34
Quota 2: vence 2026-06-30, principal R$ 333,33, juros R$ 3,33, total R$ 336,66
Quota 3: vence 2026-07-31, principal R$ 333,33, juros a calcular (Selic não informada)
```

`gerar_darf` calcula os dados do Darf (código de receita 0211, período de apuração, vencimentos,
valor de cada quota e, se o pagamento for depois do vencimento, multa e juros de mora). O Darf
oficial, com código de barras, é emitido pelo programa oficial.

Antes de sair do AutoIR, grave a conta para restituição ou débito e o número de quotas com
`definir_informacoes_bancarias` e, se quiser, gere um relatório de conferência com
`gerar_relatorio_declaracao` e o roteiro final com `instruir_transmissao`.

## 9. Restaure, confira e transmita no programa oficial

1. Abra o programa IRPF 2026.
2. Use **Ferramentas > Cópia de Segurança > Restaurar** (Ctrl+T), escolha a pasta
   `~/Documentos/IR-2026` e o arquivo `12345678909-IRPF-A-2026-2025-ORIGI.DBK`. Restaurar sobre
   uma declaração existente do mesmo CPF substitui todos os dados dela; o programa avisa antes.
3. Confira cada ficha contra os informes: rendimentos, IRRF, dependentes, pagamentos, bens.
4. Rode **Verificar Pendências** (F5) e resolva o que o programa apontar.
5. Escolha a forma de pagamento ou a conta de restituição no Resumo.
6. Transmita pelo próprio programa e guarde o recibo.

Se o programa recusar o arquivo, veja
[solucao-de-problemas.md](solucao-de-problemas.md#o-programa-oficial-não-restaura-o-arquivo).

## E se eu não tiver um DBK de partida?

`converter_modelo_para_dbk` grava um `.DBK` a partir de um modelo JSON, com ou sem `arquivo_base`.
Sem base, o arquivo contém só as fichas do modelo. Funciona para simular, validar e editar, mas, para
entregar, prefira sempre partir de um `.DBK` gravado pelo programa oficial: assim nada que o modelo
não descreve se perde.
