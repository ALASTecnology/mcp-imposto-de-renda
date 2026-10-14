<!-- Arquivo gerado por `pnpm docs:catalogo` (tools/docs/referencia.mjs). Não edite à mão. -->

# Referência das ferramentas

Referência completa das **154 ferramentas** do servidor, em **11 grupos**, gerada a partir do `tools/list` real: nome, descrição, parâmetros com tipo e obrigatoriedade tirados do JSON Schema, anotações MCP, campos da resposta estruturada, um exemplo de chamada executado contra o servidor com dados fictícios e as funções correspondentes do programa oficial.

95 ferramentas gravam na pasta autorizada e somem com `--somente-leitura` (que deixa 59). Sem `--dir`, os grupos que exigem pasta não são registrados e restam 27.

## Convenções

- **Valores monetários na entrada:** texto é sempre em reais no formato brasileiro (`"1.234,56"`); número inteiro é sempre em centavos (`123456` = R$ 1.234,56). Nunca use ponto como separador decimal. Nas tabelas, esses campos aparecem como *valor monetário*.
- **Modelo JSON da declaração:** valores em centavos (inteiro), datas `AAAA-MM-DD`, CPF e CNPJ só com dígitos. É o formato devolvido por `converter_dbk_para_modelo` e aceito por `converter_modelo_para_dbk`.
- **Arquivos:** sempre nome relativo à pasta autorizada (`--dir`). Caminhos absolutos, `..`, links e arquivos ocultos são recusados.
- **Resposta:** toda ferramenta devolve um texto legível (`content`) e os mesmos dados estruturados (`structuredContent`), validados pelo `outputSchema`. Erros voltam com `isError: true` e mensagem em pt-BR.
- **Anotações:** ferramentas que só leem são `readOnlyHint: true` e `idempotentHint: true`; as que gravam são `destructiveHint: true`, para o cliente pedir confirmação. Nenhuma acessa a rede (`openWorldHint: false`).
- **Exemplos:** cada exemplo foi executado de verdade, em pasta temporária com relógio fixo e com as [declarações de exemplo](../../exemplos/README.md). Respostas longas aparecem cortadas.

## Grupos

| Grupo | Ferramentas | Gravam | Exige `--dir` | Para que serve |
| --- | --- | --- | --- | --- |
| [`calculo`](calculo.md) | 6 | 0 | não | Simulação do imposto, comparação de modelos, quotas, multa e parâmetros. |
| [`declaracao`](declaracao.md) | 4 | 2 | sim | Abrir, converter e gravar o arquivo da declaração (DBK/DEC). |
| [`fichas`](fichas.md) | 1 | 0 | sim | Consulta de fichas da declaração. |
| [`edicao`](edicao.md) | 105 | 80 | sim | Inclusão, edição, remoção e listagem de lançamentos de cada ficha da declaração. |
| [`ciclo`](ciclo.md) | 15 | 13 | sim | Ciclo de vida da declaração (criar, retificar, excluir), opções do Resumo e importações. |
| [`validacao`](validacao.md) | 2 | 0 | não | Validação de CPF/CNPJ e pendências da declaração. |
| [`tabelas`](tabelas.md) | 2 | 0 | não | Tabelas de códigos do programa (dependentes, pagamentos, bens, municípios...). |
| [`arquivos`](arquivos.md) | 2 | 0 | sim | Arquivos da pasta autorizada. |
| [`saidas`](saidas.md) | 4 | 0 | não | Etapa final: dados do Darf e passo a passo para transmitir pelo programa oficial. |
| [`calculadoras`](calculadoras.md) | 10 | 0 | não | Calculadoras auxiliares offline: renda variável, preço médio, carnê-leão, RRA, ganho de capital e acréscimos. |
| [`orientacao`](orientacao.md) | 3 | 0 | não | Orientação sobre serviços que só existem fora do MCP Imposto de Renda (sem acesso à rede). |
| **Total** | **154** | **95** | | |

## Todas as ferramentas

| Ferramenta | Grupo | O que faz | Grava? |
| --- | --- | --- | --- |
| [`abrir_declaracao`](declaracao.md#abrir_declaracao) | `declaracao` | Abrir declaração (DBK/DEC) | não |
| [`adicionar_alimentando`](edicao.md#adicionar_alimentando) | `edicao` | Incluir em Alimentandos | **sim** |
| [`adicionar_bem`](edicao.md#adicionar_bem) | `edicao` | Incluir em Bens e Direitos | **sim** |
| [`adicionar_bem_rural`](edicao.md#adicionar_bem_rural) | `edicao` | Incluir em Demonstrativo da Atividade Rural: Bens da atividade rural | **sim** |
| [`adicionar_dependente`](edicao.md#adicionar_dependente) | `edicao` | Incluir em Dependentes | **sim** |
| [`adicionar_divida`](edicao.md#adicionar_divida) | `edicao` | Incluir em Dívidas e Ônus Reais | **sim** |
| [`adicionar_divida_rural`](edicao.md#adicionar_divida_rural) | `edicao` | Incluir em Demonstrativo da Atividade Rural: Dívidas vinculadas à atividade rural | **sim** |
| [`adicionar_doacao`](edicao.md#adicionar_doacao) | `edicao` | Incluir em Doações Efetuadas | **sim** |
| [`adicionar_doacao_direta_declaracao`](edicao.md#adicionar_doacao_direta_declaracao) | `edicao` | Incluir em Doações Diretamente na Declaração | **sim** |
| [`adicionar_doacao_eleitoral`](edicao.md#adicionar_doacao_eleitoral) | `edicao` | Incluir em Doações a Partidos Políticos e Candidatos | **sim** |
| [`adicionar_fii_fiagro`](edicao.md#adicionar_fii_fiagro) | `edicao` | Incluir em Renda Variável: Operações em FII ou Fiagro | **sim** |
| [`adicionar_ganho_capital`](edicao.md#adicionar_ganho_capital) | `edicao` | Incluir em Demonstrativo de Ganhos de Capital | **sim** |
| [`adicionar_herdeiro`](edicao.md#adicionar_herdeiro) | `edicao` | Incluir em Herdeiros/Meeiro | **sim** |
| [`adicionar_imovel_rural`](edicao.md#adicionar_imovel_rural) | `edicao` | Incluir em Demonstrativo da Atividade Rural: Imóveis explorados | **sim** |
| [`adicionar_pagamento`](edicao.md#adicionar_pagamento) | `edicao` | Incluir em Pagamentos Efetuados | **sim** |
| [`adicionar_rebanho`](edicao.md#adicionar_rebanho) | `edicao` | Incluir em Demonstrativo da Atividade Rural: Movimentação do rebanho | **sim** |
| [`adicionar_receita_despesa_rural`](edicao.md#adicionar_receita_despesa_rural) | `edicao` | Incluir em Demonstrativo da Atividade Rural: Receitas e despesas | **sim** |
| [`adicionar_renda_variavel`](edicao.md#adicionar_renda_variavel) | `edicao` | Incluir em Renda Variável: Operações Comuns/Day-Trade | **sim** |
| [`adicionar_rendimento_exclusivo`](edicao.md#adicionar_rendimento_exclusivo) | `edicao` | Incluir em Rendimentos Sujeitos à Tributação Exclusiva/Definitiva | **sim** |
| [`adicionar_rendimento_exigibilidade_suspensa`](edicao.md#adicionar_rendimento_exigibilidade_suspensa) | `edicao` | Incluir em Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) | **sim** |
| [`adicionar_rendimento_isento`](edicao.md#adicionar_rendimento_isento) | `edicao` | Incluir em Rendimentos Isentos e Não Tributáveis | **sim** |
| [`adicionar_rendimento_pj`](edicao.md#adicionar_rendimento_pj) | `edicao` | Incluir em Rendimentos Tributáveis Recebidos de Pessoa Jurídica | **sim** |
| [`adicionar_rra`](edicao.md#adicionar_rra) | `edicao` | Incluir em Rendimentos Recebidos Acumuladamente | **sim** |
| [`aplicar_caso_especial_bem`](edicao.md#aplicar_caso_especial_bem) | `edicao` | Aplicar caso especial a um bem | **sim** |
| [`apurar_renda_variavel`](calculadoras.md#apurar_renda_variavel) | `calculadoras` | Apurar a renda variável mês a mês | não |
| [`atualizar_custo_bem`](calculadoras.md#atualizar_custo_bem) | `calculadoras` | Atualizar o custo de um bem | não |
| [`buscar_codigo`](tabelas.md#buscar_codigo) | `tabelas` | Buscar código em tabela | não |
| [`buscar_nome_por_documento`](edicao.md#buscar_nome_por_documento) | `edicao` | Buscar nome já informado para um CPF ou CNPJ | não |
| [`calcular_acrescimos_moratorios`](calculadoras.md#calcular_acrescimos_moratorios) | `calculadoras` | Calcular multa e juros de mora | não |
| [`calcular_carne_leao`](calculadoras.md#calcular_carne_leao) | `calculadoras` | Calcular o carnê-leão do mês | não |
| [`calcular_condicao_residencia`](calculadoras.md#calcular_condicao_residencia) | `calculadoras` | Determinar a condição de residente | não |
| [`calcular_ganho_capital`](calculadoras.md#calcular_ganho_capital) | `calculadoras` | Simular ganho de capital | não |
| [`calcular_multa_atraso`](calculo.md#calcular_multa_atraso) | `calculo` | Calcular multa por atraso na entrega | não |
| [`calcular_preco_medio`](calculadoras.md#calcular_preco_medio) | `calculadoras` | Calcular preço médio e ganho por venda | não |
| [`calcular_quotas`](calculo.md#calcular_quotas) | `calculo` | Calcular quotas do imposto a pagar | não |
| [`calcular_rra`](calculadoras.md#calcular_rra) | `calculadoras` | Simular rendimentos recebidos acumuladamente | não |
| [`comparar_modelos`](calculo.md#comparar_modelos) | `calculo` | Comparar modelo completo e simplificado | não |
| [`consultar_parametros`](calculo.md#consultar_parametros) | `calculo` | Consultar parâmetros do exercício | não |
| [`converter_dbk_para_modelo`](declaracao.md#converter_dbk_para_modelo) | `declaracao` | Converter DBK/DEC para o modelo | não |
| [`converter_modelo_para_dbk`](declaracao.md#converter_modelo_para_dbk) | `declaracao` | Gravar o modelo em DBK | **sim** |
| [`converter_moeda`](calculadoras.md#converter_moeda) | `calculadoras` | Converter valor em moeda estrangeira | não |
| [`criar_declaracao`](ciclo.md#criar_declaracao) | `ciclo` | Criar uma declaração nova | **sim** |
| [`criar_retificadora`](ciclo.md#criar_retificadora) | `ciclo` | Criar declaração retificadora | **sim** |
| [`definir_apuracao_rural`](edicao.md#definir_apuracao_rural) | `edicao` | Definir a apuração do resultado rural | **sim** |
| [`definir_espolio`](edicao.md#definir_espolio) | `edicao` | Definir a ficha Espólio | **sim** |
| [`definir_fii_fiagro`](edicao.md#definir_fii_fiagro) | `edicao` | Definir um mês de FII ou Fiagro | **sim** |
| [`definir_identificacao`](edicao.md#definir_identificacao) | `edicao` | Definir a identificação do contribuinte | **sim** |
| [`definir_imposto_pago`](ciclo.md#definir_imposto_pago) | `ciclo` | Definir a ficha Imposto Pago | **sim** |
| [`definir_informacoes_bancarias`](ciclo.md#definir_informacoes_bancarias) | `ciclo` | Definir conta, quotas e débito automático | **sim** |
| [`definir_informacoes_conjuge`](edicao.md#definir_informacoes_conjuge) | `edicao` | Definir a ficha Informações do Cônjuge | **sim** |
| [`definir_opcao_tributacao`](ciclo.md#definir_opcao_tributacao) | `ciclo` | Escolher a forma de tributação | **sim** |
| [`definir_partilha_bem`](edicao.md#definir_partilha_bem) | `edicao` | Definir a partilha de um bem | **sim** |
| [`definir_rebanho`](edicao.md#definir_rebanho) | `edicao` | Definir a movimentação do rebanho | **sim** |
| [`definir_receitas_despesas_rurais`](edicao.md#definir_receitas_despesas_rurais) | `edicao` | Definir receitas e despesas rurais | **sim** |
| [`definir_renda_variavel`](edicao.md#definir_renda_variavel) | `edicao` | Definir um mês da Renda Variável | **sim** |
| [`definir_rendimentos_pf_exterior`](edicao.md#definir_rendimentos_pf_exterior) | `edicao` | Definir rendimentos de PF e do exterior | **sim** |
| [`definir_saida_definitiva`](edicao.md#definir_saida_definitiva) | `edicao` | Definir a ficha Saída Definitiva do País | **sim** |
| [`editar_alimentando`](edicao.md#editar_alimentando) | `edicao` | Alterar item de Alimentandos | **sim** |
| [`editar_bem`](edicao.md#editar_bem) | `edicao` | Alterar item de Bens e Direitos | **sim** |
| [`editar_bem_rural`](edicao.md#editar_bem_rural) | `edicao` | Alterar item de Demonstrativo da Atividade Rural: Bens da atividade rural | **sim** |
| [`editar_dependente`](edicao.md#editar_dependente) | `edicao` | Alterar item de Dependentes | **sim** |
| [`editar_divida`](edicao.md#editar_divida) | `edicao` | Alterar item de Dívidas e Ônus Reais | **sim** |
| [`editar_divida_rural`](edicao.md#editar_divida_rural) | `edicao` | Alterar item de Demonstrativo da Atividade Rural: Dívidas vinculadas à atividade rural | **sim** |
| [`editar_doacao`](edicao.md#editar_doacao) | `edicao` | Alterar item de Doações Efetuadas | **sim** |
| [`editar_doacao_direta_declaracao`](edicao.md#editar_doacao_direta_declaracao) | `edicao` | Alterar item de Doações Diretamente na Declaração | **sim** |
| [`editar_doacao_eleitoral`](edicao.md#editar_doacao_eleitoral) | `edicao` | Alterar item de Doações a Partidos Políticos e Candidatos | **sim** |
| [`editar_fii_fiagro`](edicao.md#editar_fii_fiagro) | `edicao` | Alterar item de Renda Variável: Operações em FII ou Fiagro | **sim** |
| [`editar_ganho_capital`](edicao.md#editar_ganho_capital) | `edicao` | Alterar item de Demonstrativo de Ganhos de Capital | **sim** |
| [`editar_herdeiro`](edicao.md#editar_herdeiro) | `edicao` | Alterar item de Herdeiros/Meeiro | **sim** |
| [`editar_imovel_rural`](edicao.md#editar_imovel_rural) | `edicao` | Alterar item de Demonstrativo da Atividade Rural: Imóveis explorados | **sim** |
| [`editar_lancamento`](edicao.md#editar_lancamento) | `edicao` | Alterar um lançamento | **sim** |
| [`editar_pagamento`](edicao.md#editar_pagamento) | `edicao` | Alterar item de Pagamentos Efetuados | **sim** |
| [`editar_rebanho`](edicao.md#editar_rebanho) | `edicao` | Alterar item de Demonstrativo da Atividade Rural: Movimentação do rebanho | **sim** |
| [`editar_receita_despesa_rural`](edicao.md#editar_receita_despesa_rural) | `edicao` | Alterar item de Demonstrativo da Atividade Rural: Receitas e despesas | **sim** |
| [`editar_renda_variavel`](edicao.md#editar_renda_variavel) | `edicao` | Alterar item de Renda Variável: Operações Comuns/Day-Trade | **sim** |
| [`editar_rendimento_exclusivo`](edicao.md#editar_rendimento_exclusivo) | `edicao` | Alterar item de Rendimentos Sujeitos à Tributação Exclusiva/Definitiva | **sim** |
| [`editar_rendimento_exigibilidade_suspensa`](edicao.md#editar_rendimento_exigibilidade_suspensa) | `edicao` | Alterar item de Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) | **sim** |
| [`editar_rendimento_isento`](edicao.md#editar_rendimento_isento) | `edicao` | Alterar item de Rendimentos Isentos e Não Tributáveis | **sim** |
| [`editar_rendimento_pj`](edicao.md#editar_rendimento_pj) | `edicao` | Alterar item de Rendimentos Tributáveis Recebidos de Pessoa Jurídica | **sim** |
| [`editar_rra`](edicao.md#editar_rra) | `edicao` | Alterar item de Rendimentos Recebidos Acumuladamente | **sim** |
| [`excluir_declaracao`](ciclo.md#excluir_declaracao) | `ciclo` | Excluir uma declaração da pasta | **sim** |
| [`explicar_calculo`](calculo.md#explicar_calculo) | `calculo` | Explicar o cálculo passo a passo | não |
| [`gerar_arquivo_entrega`](declaracao.md#gerar_arquivo_entrega) | `declaracao` | Gerar o arquivo de entrega (DEC) | **sim** |
| [`gerar_comunicacao_saida`](saidas.md#gerar_comunicacao_saida) | `saidas` | Comunicação de saída definitiva | não |
| [`gerar_darf`](saidas.md#gerar_darf) | `saidas` | Dados do Darf | não |
| [`gerar_relatorio_declaracao`](saidas.md#gerar_relatorio_declaracao) | `saidas` | Relatório da declaração | não |
| [`gravar_copia_seguranca`](ciclo.md#gravar_copia_seguranca) | `ciclo` | Gravar cópia de segurança (DBK) | **sim** |
| [`importar_informe_plano_saude`](ciclo.md#importar_informe_plano_saude) | `ciclo` | Importar informe de plano de saúde | **sim** |
| [`importar_informe_rendimentos`](ciclo.md#importar_informe_rendimentos) | `ciclo` | Importar informe de rendimentos | **sim** |
| [`instruir_transmissao`](saidas.md#instruir_transmissao) | `saidas` | Passo a passo para transmitir | não |
| [`ler_ficha`](fichas.md#ler_ficha) | `fichas` | Ler uma ficha da declaração | não |
| [`ler_informe`](ciclo.md#ler_informe) | `ciclo` | Ler um informe de rendimentos | não |
| [`listar_alimentandos`](edicao.md#listar_alimentandos) | `edicao` | Listar Alimentandos | não |
| [`listar_arquivos`](arquivos.md#listar_arquivos) | `arquivos` | Listar arquivos da pasta autorizada | não |
| [`listar_bens`](edicao.md#listar_bens) | `edicao` | Listar Bens e Direitos | não |
| [`listar_bens_rurais`](edicao.md#listar_bens_rurais) | `edicao` | Listar Demonstrativo da Atividade Rural: Bens da atividade rural | não |
| [`listar_copias_seguranca`](ciclo.md#listar_copias_seguranca) | `ciclo` | Listar cópias de segurança | não |
| [`listar_dependentes`](edicao.md#listar_dependentes) | `edicao` | Listar Dependentes | não |
| [`listar_dividas`](edicao.md#listar_dividas) | `edicao` | Listar Dívidas e Ônus Reais | não |
| [`listar_dividas_rurais`](edicao.md#listar_dividas_rurais) | `edicao` | Listar Demonstrativo da Atividade Rural: Dívidas vinculadas à atividade rural | não |
| [`listar_doacoes`](edicao.md#listar_doacoes) | `edicao` | Listar Doações Efetuadas | não |
| [`listar_doacoes_diretas_declaracao`](edicao.md#listar_doacoes_diretas_declaracao) | `edicao` | Listar Doações Diretamente na Declaração | não |
| [`listar_doacoes_eleitorais`](edicao.md#listar_doacoes_eleitorais) | `edicao` | Listar Doações a Partidos Políticos e Candidatos | não |
| [`listar_fichas`](edicao.md#listar_fichas) | `edicao` | Listar as fichas da declaração | não |
| [`listar_fii_fiagro`](edicao.md#listar_fii_fiagro) | `edicao` | Listar Renda Variável: Operações em FII ou Fiagro | não |
| [`listar_ganhos_capital`](edicao.md#listar_ganhos_capital) | `edicao` | Listar Demonstrativo de Ganhos de Capital | não |
| [`listar_herdeiros`](edicao.md#listar_herdeiros) | `edicao` | Listar Herdeiros/Meeiro | não |
| [`listar_imoveis_rurais`](edicao.md#listar_imoveis_rurais) | `edicao` | Listar Demonstrativo da Atividade Rural: Imóveis explorados | não |
| [`listar_lancamentos`](edicao.md#listar_lancamentos) | `edicao` | Listar lançamentos de uma ficha | não |
| [`listar_pagamentos`](edicao.md#listar_pagamentos) | `edicao` | Listar Pagamentos Efetuados | não |
| [`listar_rebanhos`](edicao.md#listar_rebanhos) | `edicao` | Listar Demonstrativo da Atividade Rural: Movimentação do rebanho | não |
| [`listar_receitas_despesas_rurais`](edicao.md#listar_receitas_despesas_rurais) | `edicao` | Listar Demonstrativo da Atividade Rural: Receitas e despesas | não |
| [`listar_renda_variavel`](edicao.md#listar_renda_variavel) | `edicao` | Listar Renda Variável: Operações Comuns/Day-Trade | não |
| [`listar_rendimentos_exclusivos`](edicao.md#listar_rendimentos_exclusivos) | `edicao` | Listar Rendimentos Sujeitos à Tributação Exclusiva/Definitiva | não |
| [`listar_rendimentos_exigibilidade_suspensa`](edicao.md#listar_rendimentos_exigibilidade_suspensa) | `edicao` | Listar Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) | não |
| [`listar_rendimentos_isentos`](edicao.md#listar_rendimentos_isentos) | `edicao` | Listar Rendimentos Isentos e Não Tributáveis | não |
| [`listar_rendimentos_pj`](edicao.md#listar_rendimentos_pj) | `edicao` | Listar Rendimentos Tributáveis Recebidos de Pessoa Jurídica | não |
| [`listar_rra`](edicao.md#listar_rra) | `edicao` | Listar Rendimentos Recebidos Acumuladamente | não |
| [`listar_tabela`](tabelas.md#listar_tabela) | `tabelas` | Listar tabela de códigos | não |
| [`obter_ajuda`](orientacao.md#obter_ajuda) | `orientacao` | Ajuda por ficha | não |
| [`orientar_servico_externo`](orientacao.md#orientar_servico_externo) | `orientacao` | Orientar sobre serviço externo | não |
| [`registrar_recibo`](ciclo.md#registrar_recibo) | `ciclo` | Registrar o recibo da declaração transmitida | **sim** |
| [`remover_alimentando`](edicao.md#remover_alimentando) | `edicao` | Remover item de Alimentandos | **sim** |
| [`remover_bem`](edicao.md#remover_bem) | `edicao` | Remover item de Bens e Direitos | **sim** |
| [`remover_bem_rural`](edicao.md#remover_bem_rural) | `edicao` | Remover item de Demonstrativo da Atividade Rural: Bens da atividade rural | **sim** |
| [`remover_dependente`](edicao.md#remover_dependente) | `edicao` | Remover item de Dependentes | **sim** |
| [`remover_divida`](edicao.md#remover_divida) | `edicao` | Remover item de Dívidas e Ônus Reais | **sim** |
| [`remover_divida_rural`](edicao.md#remover_divida_rural) | `edicao` | Remover item de Demonstrativo da Atividade Rural: Dívidas vinculadas à atividade rural | **sim** |
| [`remover_doacao`](edicao.md#remover_doacao) | `edicao` | Remover item de Doações Efetuadas | **sim** |
| [`remover_doacao_direta_declaracao`](edicao.md#remover_doacao_direta_declaracao) | `edicao` | Remover item de Doações Diretamente na Declaração | **sim** |
| [`remover_doacao_eleitoral`](edicao.md#remover_doacao_eleitoral) | `edicao` | Remover item de Doações a Partidos Políticos e Candidatos | **sim** |
| [`remover_fii_fiagro`](edicao.md#remover_fii_fiagro) | `edicao` | Remover item de Renda Variável: Operações em FII ou Fiagro | **sim** |
| [`remover_ganho_capital`](edicao.md#remover_ganho_capital) | `edicao` | Remover item de Demonstrativo de Ganhos de Capital | **sim** |
| [`remover_herdeiro`](edicao.md#remover_herdeiro) | `edicao` | Remover item de Herdeiros/Meeiro | **sim** |
| [`remover_imovel_rural`](edicao.md#remover_imovel_rural) | `edicao` | Remover item de Demonstrativo da Atividade Rural: Imóveis explorados | **sim** |
| [`remover_lancamento`](edicao.md#remover_lancamento) | `edicao` | Remover um lançamento | **sim** |
| [`remover_pagamento`](edicao.md#remover_pagamento) | `edicao` | Remover item de Pagamentos Efetuados | **sim** |
| [`remover_rebanho`](edicao.md#remover_rebanho) | `edicao` | Remover item de Demonstrativo da Atividade Rural: Movimentação do rebanho | **sim** |
| [`remover_receita_despesa_rural`](edicao.md#remover_receita_despesa_rural) | `edicao` | Remover item de Demonstrativo da Atividade Rural: Receitas e despesas | **sim** |
| [`remover_renda_variavel`](edicao.md#remover_renda_variavel) | `edicao` | Remover item de Renda Variável: Operações Comuns/Day-Trade | **sim** |
| [`remover_rendimento_exclusivo`](edicao.md#remover_rendimento_exclusivo) | `edicao` | Remover item de Rendimentos Sujeitos à Tributação Exclusiva/Definitiva | **sim** |
| [`remover_rendimento_exigibilidade_suspensa`](edicao.md#remover_rendimento_exigibilidade_suspensa) | `edicao` | Remover item de Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) | **sim** |
| [`remover_rendimento_isento`](edicao.md#remover_rendimento_isento) | `edicao` | Remover item de Rendimentos Isentos e Não Tributáveis | **sim** |
| [`remover_rendimento_pj`](edicao.md#remover_rendimento_pj) | `edicao` | Remover item de Rendimentos Tributáveis Recebidos de Pessoa Jurídica | **sim** |
| [`remover_rra`](edicao.md#remover_rra) | `edicao` | Remover item de Rendimentos Recebidos Acumuladamente | **sim** |
| [`repetir_valores_bens`](ciclo.md#repetir_valores_bens) | `ciclo` | Repetir a situação dos bens | **sim** |
| [`restaurar_copia_seguranca`](ciclo.md#restaurar_copia_seguranca) | `ciclo` | Restaurar cópia de segurança | **sim** |
| [`simular_imposto`](calculo.md#simular_imposto) | `calculo` | Simular imposto do exercício | não |
| [`transferir_excedente_isencao_65`](ciclo.md#transferir_excedente_isencao_65) | `ciclo` | Transferir o excedente da parcela isenta de 65 anos | **sim** |
| [`validar_declaracao`](validacao.md#validar_declaracao) | `validacao` | Validar a declaração (pendências) | não |
| [`validar_documento`](validacao.md#validar_documento) | `validacao` | Validar CPF ou CNPJ | não |
| [`verificar_integridade_arquivo`](arquivos.md#verificar_integridade_arquivo) | `arquivos` | Verificar integridade do DBK/DEC | não |
| [`verificar_obrigatoriedade`](calculadoras.md#verificar_obrigatoriedade) | `calculadoras` | Verificar a obrigatoriedade de declarar | não |
| [`verificar_versao_tabelas`](orientacao.md#verificar_versao_tabelas) | `orientacao` | Versão das tabelas embarcadas | não |

## Prompts

| Prompt | Título | Descrição | Argumentos |
| --- | --- | --- | --- |
| `preparar_declaracao` | Preparar a declaração passo a passo | Roteiro guiado de coleta dos informes e preenchimento das fichas do IRPF 2026, com simulação do imposto a cada etapa. | `arquivo`: DBK existente na pasta autorizada, para partir dele (opcional). |
| `revisar_malha_fina` | Revisar riscos de malha fina | Revisão da declaração em busca de pendências e inconsistências que costumam levar à malha fina. | `arquivo`: DBK ou DEC na pasta autorizada a revisar (opcional). |

## Recursos

| URI | Título | Descrição |
| --- | --- | --- |
| `mcp-imposto-de-renda://aviso-legal` | Aviso legal do MCP Imposto de Renda | Limites do MCP Imposto de Renda: não é serviço oficial, dados vão ao provedor de LLM do usuário, revisar e transmitir pelo programa oficial. |

## Como regenerar

Esta pasta é gerada por `pnpm docs:catalogo`, que sobe o servidor a partir do código-fonte, lê o `tools/list`, executa as chamadas de [`tools/docs/exemplos-ferramentas.ts`](../../tools/docs/exemplos-ferramentas.ts) e escreve uma página por grupo. Ferramenta nova sem exemplo faz a geração falhar.
