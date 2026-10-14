# Fichas: do programa oficial ao MCP Imposto de Renda

Este guia liga cada ficha do programa IRPF 2026 ao que o MCP Imposto de Renda oferece: a chave no modelo JSON,
os registros do `.DBK` que a representam, as ferramentas que a preenchem, as regras de validação e
os IDs da [matriz de cobertura](../mapeamento/matriz-cobertura.md), onde está o detalhe função por
função (o que já existe, o que é parcial e o que falta).

## Como as fichas são tratadas

O MCP Imposto de Renda trabalha com um **modelo JSON tipado** da declaração (`packages/core/src/model`). Toda
edição segue o mesmo fluxo:

```text
.DBK/.DEC da pasta  ->  modelo  ->  alteração pedida  ->  validação (regras do core)  ->  .DBK gravado
                                                                                        (backup do anterior)
```

- As ferramentas `adicionar_*`, `editar_*`, `remover_*` e `definir_*` recebem `arquivo` (o `.DBK`
  ou `.DEC` a alterar) e, opcionalmente, `arquivo_destino`. Sem destino, gravam no próprio arquivo
  e guardam o conteúdo anterior em `.mcp-imposto-de-renda-backups`. Partindo de um `.DEC`, informe um destino
  `.DBK`.
- Cada gravação devolve as pendências da declaração e se ela pode ser entregue (sem `erro`).
- `editar_*` mescla os campos informados (`null` remove um campo) e localiza o item pela posição
  mostrada em `listar_*`. As genéricas `listar_lancamentos`, `editar_lancamento` e
  `remover_lancamento` funcionam com qualquer ficha em lista.
- Remover dependente ou alimentando com itens vinculados (rendimentos, pagamentos) exige
  `cascata: true`, como no programa.
- `listar_fichas` mostra todas as fichas com a quantidade de itens; `ler_ficha` devolve uma ficha
  inteira no formato do modelo.
- Os registros de totais do Resumo (17 a 20) e o header são recalculados a partir do modelo em toda
  gravação.
- Para trabalhar com o modelo inteiro de uma vez, use `converter_dbk_para_modelo` e
  `converter_modelo_para_dbk` (com `arquivo_base` para preservar o que o modelo não descreve).

No modelo, valores são **inteiros em centavos**, datas `AAAA-MM-DD` e CPF/CNPJ só com dígitos.

## Mapa

| Ficha do programa | Chave no modelo | Registros | Ferramentas de edição | Regras | Matriz |
| --- | --- | --- | --- | ---: | --- |
| Identificação do Contribuinte | `identificacao` | 16 e header `IR` | `definir_identificacao` | 15 | F-IDENT |
| Dependentes | `dependentes` | 25 | `adicionar_dependente`, `editar_dependente`, `remover_dependente`, `listar_dependentes` | 9 | F-DEP |
| Alimentandos | `alimentandos` | 35 | `adicionar_alimentando`, `editar_alimentando`, `remover_alimentando`, `listar_alimentandos` | 4 | F-ALIM |
| Rendimentos Tributáveis Recebidos de PJ (titular e dependentes) | `rendimentosPJ` | 21, 32 | `adicionar_rendimento_pj`, `editar_rendimento_pj`, `remover_rendimento_pj`, `listar_rendimentos_pj`, `importar_informe_rendimentos` | 3 | F-RTPJ-TIT, F-RTPJ-DEP |
| Rendimentos Tributáveis Recebidos de PF e do Exterior | `rendimentosPFExterior` | 22, 49 | `definir_rendimentos_pf_exterior` | 6 | F-RTPF |
| Rendimentos Isentos e Não Tributáveis | `rendimentosIsentos` | 23, 83 a 89 | `adicionar_rendimento_isento`, `editar_rendimento_isento`, `remover_rendimento_isento`, `listar_rendimentos_isentos`, `transferir_excedente_isencao_65` | 5 | F-ISENTO |
| Rendimentos Sujeitos à Tributação Exclusiva/Definitiva | `rendimentosExclusivos` | 24 | `adicionar_rendimento_exclusivo`, `editar_rendimento_exclusivo`, `remover_rendimento_exclusivo`, `listar_rendimentos_exclusivos` | 2 | F-EXCL |
| Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) | `rendimentosExigibilidadeSuspensa` | 80, 81 | `adicionar_rendimento_exigibilidade_suspensa`, `editar_rendimento_exigibilidade_suspensa`, `remover_rendimento_exigibilidade_suspensa`, `listar_rendimentos_exigibilidade_suspensa` | 2 | F-SUSP |
| Rendimentos Recebidos Acumuladamente | `rendimentosAcumulados` | 45 a 48 | `adicionar_rra`, `editar_rra`, `remover_rra`, `listar_rra` | 5 | F-RRA |
| Imposto Pago/Retido | `impostoPago` | totais do Resumo | `definir_imposto_pago` | 1 | F-IMPPAGO |
| Pagamentos Efetuados | `pagamentos` | 26 | `adicionar_pagamento`, `editar_pagamento`, `remover_pagamento`, `listar_pagamentos`, `importar_informe_plano_saude` | 9 | F-PAG |
| Doações Efetuadas | `doacoesEfetuadas` | 90 | `adicionar_doacao`, `editar_doacao`, `remover_doacao`, `listar_doacoes` | 2 | F-DOA |
| Doações Diretamente na Declaração | `doacoesDiretamenteNaDeclaracao` | 91, 92 | `adicionar_doacao_direta_declaracao`, `editar_doacao_direta_declaracao`, `remover_doacao_direta_declaracao`, `listar_doacoes_diretas_declaracao` | 2 | F-DDD |
| Doações a Partidos Políticos e Candidatos | `doacoesPartidos` | 34 | `adicionar_doacao_eleitoral`, `editar_doacao_eleitoral`, `remover_doacao_eleitoral`, `listar_doacoes_eleitorais` | 1 | F-PARTIDOS |
| Bens e Direitos | `bens` | 27, 36, 59 | `adicionar_bem`, `editar_bem`, `remover_bem`, `listar_bens`, `aplicar_caso_especial_bem`, `definir_partilha_bem`, `repetir_valores_bens` | 13 | F-BENS |
| Dívidas e Ônus Reais | `dividas` | 28 | `adicionar_divida`, `editar_divida`, `remover_divida`, `listar_dividas` | 3 | F-DIV |
| Espólio | `espolio` | 30 | `definir_espolio` (tipo ajuste) | 2 | F-ESPOLIO |
| Espólio (Final de Espólio) | `finalEspolio` | 38 | `definir_espolio` (tipo final) | 4 | F-DFE-GERAL |
| Herdeiros/Meeiro | `herdeiros` | 58 | `adicionar_herdeiro`, `editar_herdeiro`, `remover_herdeiro`, `listar_herdeiros` | 1 | F-DFE-HERDEIROS |
| Saída Definitiva do País | `saidaDefinitiva` | 39 | `definir_saida_definitiva` | 2 | F-SAIDA, F-SAIDA-GERAL |
| Informações do Cônjuge | `informacoesConjuge` | 29 | `definir_informacoes_conjuge` | 1 | F-CONJUGE |
| Renda Variável: Operações Comuns/Day-Trade | `rendaVariavel` | 40, 41 | `definir_renda_variavel` e o conjunto `*_renda_variavel` | 1 | D-RV-GERAL |
| Renda Variável: FII ou Fiagro | `fundosImobiliarios` | 42, 43 | `definir_fii_fiagro` e o conjunto `*_fii_fiagro` | 0 | D-FII-GERAL |
| Demonstrativo da Atividade Rural | `atividadeRural` | 50 a 57 | conjuntos `*_imovel_rural`, `*_receita_despesa_rural`, `*_rebanho`, `*_bem_rural`, `*_divida_rural`; `definir_receitas_despesas_rurais`, `definir_apuracao_rural`, `definir_rebanho` | 6 | D-AR-GERAL |
| Demonstrativo de Ganhos de Capital | `ganhosCapital` | 60 a 63, 65, 66, 68, 69, 74 | `adicionar_ganho_capital`, `editar_ganho_capital`, `remover_ganho_capital`, `listar_ganhos_capital` | 1 | D-GCAP-GERAL |
| Resumo da Declaração | `resumo` | 17 a 20 (recalculados) | `definir_opcao_tributacao`, `definir_informacoes_bancarias`; totais calculados | 7 | F-RESUMO-* |

As colunas "Regras" somam as 107 regras do catálogo do core (80 erros e 27 avisos). Os campos de
cada registro estão em [../formato-dbk.md](../formato-dbk.md#tipos-de-registro-do-exercício-2026).

## Ferramentas por etapa

| Etapa | Ferramentas |
| --- | --- |
| Criar, retificar, copiar ou excluir o arquivo | `criar_declaracao`, `criar_retificadora`, `gravar_copia_seguranca`, `excluir_declaracao` |
| Ver o que já está preenchido | `abrir_declaracao`, `listar_fichas`, `ler_ficha`, `listar_*` |
| Lançar informes colados em texto | `importar_informe_rendimentos`, `importar_informe_plano_saude` |
| Achar o código certo (dependência, pagamento, bem, dívida, isento, município) | `listar_tabela`, `buscar_codigo` |
| Conferir CPF/CNPJ e reaproveitar nomes já informados | `validar_documento`, `buscar_nome_por_documento` |
| Lançar, alterar e remover | `adicionar_*`, `editar_*`, `remover_*`, `definir_*` |
| Ver o efeito no imposto | `simular_imposto`, `comparar_modelos`, `explicar_calculo` |
| Conferir consistência | `validar_declaracao` (as edições já devolvem as pendências) |
| Conferir o arquivo | `verificar_integridade_arquivo`, `gerar_relatorio_declaracao` |
| Desfazer uma gravação | `listar_copias_seguranca`, `restaurar_copia_seguranca` |
| Concluir no programa oficial | `instruir_transmissao`, `gerar_darf` |

## Tabelas de códigos

`listar_tabela` e `buscar_codigo` aceitam estas 32 tabelas do exercício 2026, extraídas dos dados
públicos do programa ([../mapeamento/tabelas/README.md](../mapeamento/tabelas/README.md)):

`aliquotas-parametros`, `altcoins`, `atividade-rural-bens`, `atividade-rural-condicoes-exploracao`,
`atividade-rural-tipos`, `bancos`, `bancos-bens`, `bancos-calculo-dv`, `bens-direitos`,
`datas-prazos`, `dependentes`, `dividas-onus`, `fundos-eca`, `fundos-idoso`, `moedas`, `municipios`,
`municipios-calamidade`, `naturezas-ocupacao`, `ocupacoes-principais`, `pagamentos`, `paises`,
`paises-gcap`, `raca-cor`, `rendimentos-isentos`, `rendimentos-tributacao-exclusiva`,
`representacoes-diplomaticas`, `stablecoins`, `tipos-conta`, `tipos-logradouro`,
`tipos-rendimentos`, `ufs`.

## Dicas por ficha

- **Dependentes.** O código vem da tabela `dependentes` (11 cônjuge, 21 filho até 21 anos, 22 filho
  universitário até 24 anos e outros). Dependente com rendimento próprio exige o rendimento dele nas
  fichas de rendimentos, com o CPF do dependente.
- **Rendimentos de PJ.** Um item por fonte pagadora, com os valores do informe de rendimentos. O 13º
  e o IRRF do 13º vão no mesmo item e o programa os leva à tributação exclusiva.
- **Rendimentos de PF e do exterior.** `definir_rendimentos_pf_exterior` lança um mês (`mes` e
  `valores`) ou o ano inteiro (`colunas`, com 12 valores por coluna), incluindo o Darf do carnê-leão
  (código 0190).
- **Pagamentos Efetuados.** Informe o CPF/CNPJ de quem recebeu e para quem foi a despesa (titular,
  dependente ou alimentando). Reembolsos vão na parcela não dedutível. Instrução tem limite por
  pessoa; previdência complementar (códigos 36 e 37) fica limitada a 12% dos rendimentos
  tributáveis.
- **Bens e Direitos.** Grupo e código da tabela `bens-direitos` (`01.11` apartamento, `06.01` conta
  corrente). Situação em 31/12 do ano anterior e do ano-calendário. Conta bancária com dígito
  verificador conferido pela regra pública do banco, quando disponível (aviso `BEM-CONTA-AVISO`).
  Usufruto, bem a inventariar e outros casos especiais: `aplicar_caso_especial_bem`.
- **Demonstrativos (ganho de capital, renda variável, atividade rural, RRA).** São lidos, editados e
  gravados, mas não entram no cálculo do motor (`simular_imposto`). Confira esses valores no
  programa oficial.
