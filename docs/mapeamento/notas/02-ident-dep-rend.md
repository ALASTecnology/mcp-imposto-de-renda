# Notas N2: Aba Início, Identificação, Dependentes, Alimentandos, Rendimentos PJ e PF/Exterior

Fonte: AjudaIRPF.pdf (IRPF2026-1.5), páginas 40 a 74 (linhas 1638 a 3193 de ajuda.txt).

## F-INICIO Aba Início
- Onde: primeira aba do programa; pág. 41
- Aplica-se a: todos
- Campos: nenhum; painel com ícones de atalho para as fichas mais relevantes, escolhidas a partir do histórico de utilização. Demais fichas pelo menu lateral à esquerda.
- Validações conhecidas: nenhuma
- Códigos: nenhum
- Regras de cálculo afetadas: nenhuma
- Importações/exportações: nenhuma
- Exige do MCP: ferramenta de navegação/listagem de fichas aplicáveis à declaração (ex.: listar fichas preenchidas e sugeridas). Sem equivalente obrigatório.
- Observações: "a partir do histórico de utilização" sugere priorização dinâmica; o MCP pode sugerir fichas com base nos dados já informados (inferido).

## F-IDENT Identificação do Contribuinte (visão geral)
- Onde: ficha Identificação do Contribuinte; págs. 41 a 46
- Aplica-se a: todos (com particularidades para Espólio e Saída Definitiva)
- Campos (grupos): Tipo de declaração e nº do recibo; Nome; Data de nascimento; Doença grave ou deficiência; Raça/Cor; Houve alteração de dados cadastrais; Possui cônjuge ou companheiro(a) e CPF do cônjuge; Era residente no exterior e passou a ser residente em 2025 e Data de retorno; Endereço (Brasil ou Exterior); Ocupação principal (natureza e ocupação).
- Validações conhecidas: período de informações: Final de Espólio, de 1º de janeiro até a data da decisão judicial da partilha, sobrepartilha ou adjudicação, ou da lavratura da escritura pública de inventário/partilha (se ainda houver bens a inventariar que gerem rendimentos, informar o ano todo); Saída Definitiva, de 1º de janeiro até o dia anterior ao da caracterização da condição de não residente.
- Exige do MCP: ferramenta de leitura/gravação da identificação (`definir_identificacao`), validação de cada campo, seleção do tipo de declaração.

## F-IDENT-TIPO Que Tipo de Declaração Você Deseja Fazer?
- Onde: Identificação do Contribuinte; pág. 42
- Aplica-se a: todos
- Campos:
  - Tipo (opção): Declaração de Ajuste Anual Original; Declaração Retificadora; Declaração de Saída Definitiva Original; Declaração Final de Espólio Original (as retificadoras de Saída e Espólio seguem a mesma lógica de "Retificadora", inferido).
  - Nº do recibo da última declaração entregue do exercício de 2025 (numérico, 12 dígitos), se original.
  - Nº do recibo da declaração imediatamente anterior do exercício de 2026 (12 dígitos), se retificadora.
- Validações conhecidas:
  - Recibo tem 12 dígitos.
  - Original de Ajuste Anual: recibo de 2025 é OPCIONAL.
  - Saída Definitiva Original e Final de Espólio Original: informar o recibo da última declaração do exercício de 2025 (texto indica obrigação, sem dizer "opcional").
  - Retificadora: recibo da declaração anterior de 2026 é OBRIGATÓRIO.
  - Final de Espólio: vedada, após o prazo tempestivo, a retificação dos valores da ficha Bens e Direitos.
  - Retificadora entregue após o prazo legal (29/05/2026) com débito automático: o débito automático é cancelado.
- Códigos: códigos Receitanet internos (ver layout: 2600 Ajuste, 2621 Espólio, 2620 Saída), fora desta faixa.
- Regras de cálculo afetadas: nenhuma direta; define o conjunto de fichas e o tipo de cálculo (Espólio/Saída).
- Importações/exportações: na importação da declaração de 2025 pelo arquivo transmitido, o recibo de 2025 é recuperado automaticamente; não há recuperação se a importação for por cópia de segurança.
- Exige do MCP: escolha do tipo, validação do recibo (12 dígitos), alerta sobre cancelamento do débito automático em retificadora fora do prazo, bloqueio de alteração de bens em retificadora de Espólio fora do prazo; recuperar recibo ao importar a declaração anterior.
- Observações: recibo pode ser obtido na folha 2 do recibo impresso ou em Declaração > Abrir do programa do ano.

## F-IDENT-NOME Nome
- Onde: Identificação; pág. 43
- Campos: Nome completo (alfanumérico; layout NM_NOME tamanho 60).
- Validações conhecidas: de 1 a 15 partes; a primeira parte pode ter 1 caractere; nenhuma parte com mais de 20 caracteres; proibidos 3 caracteres iguais e consecutivos, exceto o numeral romano "III" na última parte.
- Exige do MCP: validador de nome conforme essas regras.

## F-IDENT-NASC Data de Nascimento
- Onde: Identificação; pág. 43
- Campos: data dd/mm/aaaa.
- Validações conhecidas: formato 2 dígitos dia, 2 mês, 4 ano; data válida (inferido).
- Regras de cálculo afetadas: idade influencia parcela isenta de 65 anos e obrigatoriedade/prioridade (inferido, tratado em outras fichas).
- Exige do MCP: validador de data.

## F-IDENT-DOENCA Há declarante ou dependente com doença grave ou deficiência física ou mental?
- Onde: Identificação; pág. 43
- Campos: indicador sim/não (marcação).
- Validações conhecidas: base em conclusão da medicina especializada.
- Regras de cálculo afetadas: prioridade na restituição (art. 69-A da Lei 9.784/1999); não altera o imposto.
- Exige do MCP: campo booleano com explicação ao usuário.

## F-IDENT-RACA Raça/Cor
- Onde: Identificação; pág. 43
- Campos: seleção autodeclarada: Amarela, Branca, Indígena, Parda, Preta (tabela racaCor.xml).
- Exige do MCP: enumeração validada.

## F-IDENT-ALTCAD Houve alteração de dados cadastrais?
- Onde: Identificação; pág. 43
- Campos: SIM/NÃO.
- Validações conhecidas: SIM se endereço, telefone, celular, e-mail ou ocupação principal diferente da última declaração. Se NÃO e o cadastro CPF da RFB tiver endereço diferente, a declaração NÃO pode ser apresentada (rejeição na transmissão). Solução: conferir o endereço; se correto, marcar SIM, gravar novamente para entrega e retransmitir.
- Regras de cálculo afetadas: nenhuma; com SIM, também atualiza dados do dependente que mora com o titular no Cadastro CPF.
- Exige do MCP: alerta quando dados de contato/endereço mudarem em relação à declaração importada do ano anterior; sugestão automática de SIM (inferido).

## F-IDENT-CONJ Possui cônjuge ou companheiro(a)?
- Onde: Identificação; pág. 44
- Campos: SIM/NÃO; CPF do cônjuge ou companheiro(a) (11 dígitos) se SIM.
- Validações conhecidas: CPF obrigatório com 11 dígitos quando SIM; dígito verificador (inferido).
- Exige do MCP: validação de CPF; ligação com a ficha Informações do Cônjuge (inferido) e com dependentes comuns.

## F-IDENT-RETORNO Era residente no exterior e passou a ser residente no país em 2025?
- Onde: Identificação; pág. 44
- Campos: SIM/NÃO; Data de retorno ao Brasil (se SIM).
- Validações conhecidas: data obrigatória se SIM; dentro de 2025 (inferido).
- Exige do MCP: campo condicional com validação de data.

## F-IDENT-END-BR Endereço - Brasil
- Onde: Identificação; págs. 44 e 45
- Aplica-se a: todos; no Final de Espólio, endereço e UF da pessoa falecida na data do óbito.
- Campos: indicador Brasil/Exterior; Tipo de logradouro (rua, quadra, avenida etc., tabela tipoLogradouro); Logradouro; Número; Complemento; Bairro/Distrito; UF (código ou lista, tabela ufs); Município (lista dos municípios da UF, em ordem alfabética); CEP (8 dígitos); Telefone (DDD 2 dígitos + até 9 dígitos); Celular (DDD 2 + até 9 dígitos); E-mail.
- Validações conhecidas: endereço completo; município deve pertencer à UF; CEP com 8 dígitos (tabela ECT); e-mail válido; telefone e celular com DDD de 2 dígitos e até 9 dígitos.
- Códigos: UF, municípios (tabelas por UF), tipo de logradouro.
- Exige do MCP: validação de endereço, consulta às tabelas de UF/município, validação de CEP; botão "Consulta CEP" (abre site dos Correios): o MCP pode apenas orientar ou consultar serviço externo opcional (inferido).
- Observações: celular e e-mail podem ser usados pela RFB para avisar mensagem na Caixa Postal do e-CAC.

## F-IDENT-END-EXT Endereço - Exterior
- Onde: Identificação; págs. 45 e 46
- Campos: CPF do procurador residente no Brasil (11 dígitos); Logradouro, número, complemento, bairro/distrito; País (código ou lista, tabela paises); Cód. EXT. (representação diplomática mais próxima da residência, tabela representacoes.xml); Cidade; Código Postal; DDI/Telefone; E-mail.
- Validações conhecidas: CPF do procurador com 11 dígitos; e-mail válido; Espólio: último endereço da pessoa falecida.
- Exige do MCP: validação, tabelas de países e representações diplomáticas; orientação sobre Domicílio Tributário Eletrônico ou procurador no Brasil.
- Observações: se o endereço do titular é no Exterior e o dependente mora com o titular, celular/e-mail do dependente ficam desabilitados.

## F-IDENT-OCUP Ocupação Principal
- Onde: Identificação; pág. 46
- Campos: Natureza da ocupação (código, tabela naturezasOcupacao); Ocupação principal (código, lupa, tabela ocupacoesPrincipal); Número do registro profissional para ocupações 225, 226, 230, 231, 232, 241, 255, 355 (ver Carnê-Leão, inferido como campo da identificação ou da ficha PF).
- Validações conhecidas: naturezas 13, 14, 61, 62, 71, 72 e 81 (Espólio) não exigem código da ocupação principal; se tiver outra ocupação remunerada, informar a ocupação dela. Demais naturezas exigem ocupação principal (inferido).
- Códigos: natureza 11 (profissional liberal ou autônomo sem vínculo) torna obrigatório o NIT/PIS/PASEP na ficha PF; natureza 62 remete ao isento 11 (moléstia grave/acidente); natureza 81 (Espólio) habilita a ficha Espólio na Declaração de Ajuste.
- Exige do MCP: validação condicional natureza x ocupação, ativação de fichas dependentes da natureza.

## F-DEP Dependentes
- Onde: ficha Dependentes; págs. 47 a 49
- Aplica-se a: todos (campo extra na Saída Definitiva)
- Campos (por dependente, botões Novo/Editar/Excluir, OK):
  - Tipo de dependente (código, tabela de relação de dependência, dependencias.xml)
  - Nome completo
  - CPF (obrigatório para todos os dependentes)
  - Data de nascimento (dd/mm/aaaa)
  - Raça/Cor (Amarela, Branca, Indígena, Parda, Preta)
  - Celular (DDD 2 + até 9 dígitos; desabilitado se mora com o titular e endereço do titular no Exterior)
  - E-mail (desabilitado na mesma condição)
  - Dependente mora com o titular da declaração? (marcação)
  - Saiu do país na mesma data que o declarante? (só Saída Definitiva; SIM apenas se o dependente adquiriu condição de não residente na mesma data)
  - Total de dedução com dependentes (calculado)
- Validações conhecidas:
  - CPF obrigatório e válido para todo dependente.
  - Pode ser dependente quem manteve relação de dependência mesmo por menos de 12 meses em 2025 (nascimento, falecimento).
  - Declaração em separado: dependente comum só pode constar na declaração de um dos cônjuges.
  - Filho de pais divorciados/separados (judicialmente ou por escritura pública, art. 733 CPC): só na declaração de quem detém a guarda judicial; se o filho declara em separado, não pode ser dependente do responsável. Exceção: separação/divórcio em 2025 com pensão judicial paga, somente no ano-calendário 2025, o não guardião pode considerar os filhos dependentes e deduzir a pensão.
  - Companheiro(a), inclusive homoafetivo: vida em comum por mais de 5 anos, ou menos se houve filho (Parecer PGFN/CAT 1.503/2010).
  - Mora com o titular + "Houve alteração cadastral = SIM": atualiza também o cadastro CPF do dependente.
- Códigos: tabela de relação de dependência (dependencias.xml).
- Regras de cálculo afetadas: dedução anual de R$ 2.275,08 por dependente (total = quantidade x 2.275,08) no Resumo (modelo completo). Rendimentos dos dependentes somam-se aos tributáveis da declaração pelas abas próprias.
- Importações/exportações: exclusão em cascata automática: ao excluir dependente, o programa apaga dados dele na aba Dependentes de Rendimentos PJ, Rendimentos PF/Exterior, Pagamentos Efetuados, Ganhos de Capital e Renda Variável (campo Imposto a Pagar). NÃO apaga automaticamente: Rendimentos Isentos, Tributação Exclusiva, Doações Efetuadas, Bens e Direitos, Dívidas e Ônus; o usuário deve excluí-los.
- Exige do MCP: CRUD de dependentes (`adicionar_dependente`, `editar_dependente`, `remover_dependente`), validação de CPF e duplicidade (inclusive CPF igual ao do titular, inferido), exclusão em cascata idêntica à do PGD com aviso das fichas que ficam órfãs, cálculo da dedução, verificação de dependente comum em declarações separadas (orientação).
- Observações: valor de R$ 2.275,08 anual e R$ 189,59 mensal (2025).

## F-ALIM Alimentandos
- Onde: ficha Alimentandos; pág. 50
- Aplica-se a: todos
- Campos (Novo/Editar/Excluir, OK):
  - Residente no Brasil ou no Exterior (opção)
  - CPF (obrigatório para residente no Brasil ou no Exterior)
  - Data de nascimento (dd/mm/aaaa)
  - Nome completo
  - Vinculado a: Titular da Declaração ou Dependente (se dependente, seleção do dependente, inferido)
  - Tipo de Processo: Escritura pública; Decisão judicial; Escritura pública e Decisão judicial
  - Aba Escritura Pública: CNPJ do cartório, Nome do cartório, Livro, Folhas, UF, Município, Data da lavratura
  - Aba Decisão Judicial: Nº do processo judicial, Identificação da vara cível, Comarca, UF, Data da decisão judicial
- Validações conhecidas: CPF obrigatório sempre; abas habilitadas conforme Tipo de Processo; datas dd/mm/aaaa; CNPJ do cartório válido (inferido).
- Códigos: UF, municípios.
- Regras de cálculo afetadas: base para pagamentos de pensão alimentícia, despesas de instrução e médicas do alimentando na ficha Pagamentos Efetuados (pensão é dedução; instrução sujeita ao limite).
- Exige do MCP: CRUD de alimentandos com validação condicional por tipo de processo; vínculo com pagamentos.
- Observações: só alimentandos por decisão judicial, acordo homologado judicialmente ou escritura pública (art. 733 CPC).

## F-RTPJ-TIT Rendimentos Tributáveis Recebidos de PJ pelo Titular
- Onde: ficha Rendimentos Tributáveis Recebidos de PJ, aba Titular; págs. 51 e 52
- Aplica-se a: todos
- Campos (por fonte pagadora, Novo/Editar/Excluir, OK):
  - CPF/CNPJ da fonte pagadora
  - Nome da fonte pagadora
  - Rendimentos recebidos de pessoa jurídica
  - Contribuição previdenciária oficial
  - Imposto retido na fonte
  - 13º salário (valor líquido do comprovante)
  - IRRF sobre o 13º salário
- Validações conhecidas: CPF ou CNPJ válido; CPF aceito quando o pagador é pessoa física empregadora (vínculo empregatício, ex.: empregado doméstico).
- Conteúdo: incluir pecúlio de previdência privada (prestação única por morte ou invalidez permanente); rendimentos de trabalho com vínculo pagos por PF. Não incluir: atividade rural, ganhos de capital (GCAP), renda variável em bolsa, aplicações financeiras e lucros de controladas no exterior (Lei 14.754/2023, vão para Bens e Direitos). Autônomo que prestou serviços só a PJ e escriturou livro Caixa usa a coluna Livro Caixa da ficha PF e deixa os demais campos em branco (conforme o caso); contribuição previdenciária do contribuinte individual vai na aba Outras Informações da ficha PF.
- Regras de cálculo afetadas: rendimentos e IRRF transportados ao Resumo (rendimentos tributáveis e imposto pago). Contribuição previdenciária somada à da ficha PF e transportada ao Resumo (dedução). 13º salário transportado para a ficha Tributação Exclusiva (código 01) e IRRF do 13º não entra no ajuste (inferido).
- Importações/exportações: menu Importações > Informe de Rendimentos (arquivo do comprovante de rendimentos da fonte pagadora, ano-calendário 2025); também a pré-preenchida e a declaração anterior (fontes pagadoras, inferido).
- Exige do MCP: CRUD de fontes pagadoras, validação CPF/CNPJ, importação de informe de rendimentos (xsd informe_fontes_pagadoras), transporte automático do 13º para Exclusivos, totalização para o Resumo; documento alternativo (contracheques) quando não houver comprovante.

## F-RTPJ-DEP Rendimentos Tributáveis Recebidos de PJ pelos Dependentes
- Onde: ficha Rendimentos Tributáveis Recebidos de PJ, aba Dependentes; págs. 53 e 54
- Aplica-se a: todos
- Campos: Dependente (seleção entre os da ficha Dependentes) e os mesmos campos da aba Titular (CPF/CNPJ e nome da fonte, rendimentos, contribuição previdenciária oficial, IRRF, 13º, IRRF sobre 13º).
- Validações conhecidas: dependente precisa existir antes na ficha Dependentes; mesmas regras de CPF/CNPJ.
- Regras de cálculo afetadas: iguais às do titular (somam no Resumo; previdência somada à da ficha PF dependentes; 13º para Exclusivos código 08, inferido).
- Importações/exportações: Importações > Informe de Rendimentos.
- Exige do MCP: mesmo CRUD com vínculo ao dependente; cascata na exclusão do dependente.

## F-RTPF Rendimentos Tributáveis Recebidos de Pessoa Física e do Exterior (visão geral)
- Onde: ficha com abas Titular e Dependentes; cada uma com sub-abas "Rendimentos do Trabalho Não Assalariado" e "Outras Informações"; págs. 55 a 74
- Aplica-se a: todos (Espólio e Saída com o período reduzido descrito em F-IDENT)
- Estrutura mensal (janeiro a dezembro) com colunas (inferido do texto): Trabalho não assalariado; Aluguéis (inclusive por temporada); Outros; Exterior; Previdência Oficial; Dependentes (quantidade); Pensão Alimentícia; Livro Caixa; Carnê-Leão Darf pago (cód. 0190). Sub-aba de trabalho não assalariado tem detalhamento por pagador (CPF titular do pagamento, CPF beneficiário, valor).
- Exige do MCP: modelo de dados mensal por titular e por dependente; importação do Carnê-Leão; totalizações.

## F-RTPF-IMPCL Importação do Carnê-leão
- Onde: ficha Rendimentos Tributáveis PF e Exterior (titular); pág. 57
- Aplica-se a: todos
- Campos: nenhum; ação de importação.
- Validações conhecidas: exige conta gov.br (o Carnê-Leão é online, multiexercício, no e-CAC, sistema Meu Imposto de Renda, "Acessar Carnê-Leão", desde 2021). Ao importar: se já houver dados na ficha Rendimentos Tributáveis de PJ, o CNPJ não é importado; se já houver Imposto pago no exterior na ficha Imposto Pago/Retido, o valor não é importado.
- Códigos: ocupações que exigem número de registro profissional para usar o Carnê-Leão: 225 Médico, 226 Odontólogo, 230 Fonoaudiólogo, 231 Fisioterapeuta, 232 Terapeuta ocupacional, 241 Advogado, 255 Psicólogo, 355 Corretor e administrador de imóveis. Esses profissionais identificam por CPF o titular do pagamento, se ele é o beneficiário do serviço; se não for, o CPF do beneficiário e o valor. Campo "CPF não foi informado" só quando o beneficiário não é o titular do pagamento e o CPF do beneficiário não foi informado.
- Importações/exportações: dados do ano-calendário 2025 do Carnê-Leão online para a ficha PF/Exterior.
- Exige do MCP: importador do arquivo/exportação do Carnê-Leão online (formato a mapear; o PGD baixa via gov.br, o MCP não deve autenticar no gov.br: alternativa é o usuário exportar o arquivo e o MCP importar, inferido); aplicar as regras de não sobrescrita (CNPJ e imposto pago no exterior).
- Observações: módulo irpf-gui-carne-leao.jar.

## F-RTPF-TNA Aba "Rendimentos do Trabalho Não Assalariado" (titular e dependentes)
- Onde: ficha PF/Exterior, abas Titular e Dependentes; págs. 58, 59, 67, 68
- Campos: por mês, valores recebidos de PF por trabalho não assalariado; para ocupações 225, 226, 230, 231, 232, 241, 255, 355: CPF do titular do pagamento, indicador se é o beneficiário do serviço, CPF do beneficiário, valor, marca "CPF não foi informado" (inferido a partir da regra do Carnê-Leão).
- Validações conhecidas: declarar mesmo que a soma mensal seja inferior à primeira faixa da tabela mensal (até R$ 2.259,20 de janeiro a abril e R$ 2.428,80 de maio a dezembro, alíquota zero). Não incluir rendimentos de vínculo empregatício pagos por PF (vão para Rendimentos PJ, aba Titular ou Dependentes). Transporte de carga e serviços com trator, máquina de terraplenagem, colheitadeira e assemelhados: tributável no mínimo 10% do rendimento (veículo próprio ou locado, conduzido só pelo contribuinte). Transporte de passageiros: no mínimo 60%. Equipara-se a PJ quem tem mais de um veículo/máquina explorados com outras pessoas ou contrata condutor.
- Conteúdo: profissão, ocupação, prestação de serviços (inclusive representante comercial autônomo); honorários de autônomos; direitos autorais explorados diretamente pelo autor; exploração individual de empreitada de trabalho; emolumentos e custas de serventuários da Justiça (exceto quando pagos exclusivamente pelos cofres públicos).
- Regras de cálculo afetadas: soma em rendimentos tributáveis do Resumo.
- Exige do MCP: registro mensal, cálculo opcional dos percentuais mínimos de transporte (10% e 60%), validação dos campos de CPF para profissionais de saúde/advocacia/imóveis.

## F-RTPF-NIT NIT/PIS/PASEP
- Onde: aba "Outras Informações" (titular e dependentes); págs. 59 e 69
- Campos: NIT ou PIS ou PASEP.
- Validações conhecidas: obrigatório se a natureza da ocupação for 11 (profissional liberal ou autônomo sem vínculo de emprego) ou se houver valor de contribuição previdenciária nesta ficha. Dígito verificador do NIT/PIS (inferido).
- Exige do MCP: validação condicional.

## F-RTPF-ALUG Coluna Aluguéis, inclusive por temporada
- Onde: aba Outras Informações; págs. 59 e 69
- Campos: valor mensal de aluguéis.
- Conteúdo: ocupação, sublocação, uso ou exploração de bens móveis e imóveis; royalties (direitos autorais não explorados pelo autor).
- Regras de cálculo afetadas: podem ser excluídos (desde que ônus exclusivo do locador): impostos, taxas e emolumentos do bem; aluguel pago por imóvel sublocado; despesas de cobrança ou recebimento; condomínio. Informar o líquido (inferido). Quem recebe aluguel não pode usar livro Caixa para essa receita.
- Exige do MCP: cálculo do aluguel líquido a partir de valores brutos e encargos dedutíveis.

## F-RTPF-OUTROS Coluna Outros
- Onde: aba Outras Informações; págs. 59 e 69
- Conteúdo: juros de empréstimos a PF; lucro no comércio ou indústria por quem não exerce habitualmente a profissão; reajustamento e juros na alienação a prazo de bens ou direitos (adquiridos em reais, para dependentes).
- Exige do MCP: campo mensal.

## F-RTPF-EXT Coluna Exterior
- Onde: aba Outras Informações; págs. 60, 69 e 70
- Conteúdo: rendimentos de fontes no exterior, inclusive representações diplomáticas e organismos internacionais, observados acordos e reciprocidade.
- Validações conhecidas: NÃO incluir: transferência para o Brasil de saldo de depósito não remunerado no exterior (ganho de capital); ganho cambial de depósitos não remunerados em instituição não reconhecida (ganho de capital); alienação de moeda estrangeira em espécie (não incidência até US$ 5.000,00 no ano; acima, ganho de capital); rendimentos de aplicações financeiras no exterior e lucros/dividendos de controladas (Bens e Direitos, Lei 14.754/2023); liquidação/resgate de aplicações e alienação de bens adquiridos em moeda estrangeira e ativos em bolsa no exterior (ganho de capital).
- Regras de cálculo afetadas: conversão: moeda de origem para dólar dos EUA pela cotação da autoridade monetária do país na data do recebimento; dólar para real pela cotação de COMPRA do Banco Central do último dia útil da 1ª quinzena do mês anterior ao do recebimento (Tabela de Conversão do Dólar 2025). Total transportado ao Resumo. Imposto pago no exterior compensável (ver Carnê-Leão e Imposto Pago/Retido).
- Exige do MCP: conversor de moeda com a tabela oficial de 2025 (compra para rendimentos), alertas de classificação errada (aplicações no exterior, moeda em espécie).

## F-RTPF-PREV Deduções - Previdência Oficial
- Onde: aba Outras Informações; págs. 61 e 70
- Campos: valor mensal da contribuição previdenciária oficial recolhida em nome do titular (ou dos dependentes), inclusive do contribuinte individual (autônomo).
- Regras de cálculo afetadas: total somado à previdência oficial da ficha Rendimentos PJ (titular/dependentes) e lançado no Resumo como dedução.
- Validações conhecidas: exige NIT/PIS/PASEP preenchido.
- Exige do MCP: soma e transporte.

## F-RTPF-QTDDEP Deduções - Quantidade de Dependentes
- Onde: aba Outras Informações; págs. 62 e 71
- Campos: quantidade mensal de dependentes.
- Validações conhecidas: só os não usados na apuração do IR na fonte.
- Regras de cálculo afetadas: valor mensal R$ 189,59 por dependente (janeiro a dezembro). Valores apenas INFORMATIVOS: não vão ao Resumo; dedução anual depende da ficha Dependentes.
- Exige do MCP: campo informativo; avisar que dedução anual exige a ficha Dependentes.

## F-RTPF-PENSAO Deduções - Pensão Alimentícia
- Onde: aba Outras Informações (coluna Pensão Alimentícia); págs. 63 e 72
- Campos: valor mensal pago de pensão alimentícia judicial ou por escritura pública (art. 733 CPC).
- Validações conhecidas: só valores não usados como dedução no IR na fonte.
- Regras de cálculo afetadas: apenas INFORMATIVO (digitado ou importado do Carnê-Leão); não vai ao Resumo. Para deduzir, informar em Pagamentos Efetuados. Pagamento em moeda estrangeira: dólar pela autoridade do país na data do pagamento e real pela cotação de VENDA do Banco Central do último dia útil da 1ª quinzena do mês anterior.
- Exige do MCP: aviso de que a pensão deve estar em Pagamentos Efetuados; conversor de câmbio (venda).

## F-RTPF-LIVROCAIXA Deduções - Livro Caixa
- Onde: aba Outras Informações (coluna Livro Caixa); págs. 64 e 73
- Campos: valor mensal das despesas escrituradas em livro Caixa.
- Validações conhecidas: só para quem recebeu rendimentos do trabalho não assalariado, inclusive titulares de serviços notariais e de registro (exceto remunerados só pelos cofres públicos) e leiloeiros. Vedado a transportadores de passageiros e de cargas e para receita de aluguéis. Valor mensal limitado à receita mensal recebida de PF e/ou PJ. Excesso de um mês pode ser somado aos meses seguintes até dezembro de 2025; excesso em dezembro não pode ser informado nesse mês nem usado em anos posteriores. Autônomo que prestou serviços só a PJ preenche esta coluna para deduzir.
- Conteúdo dedutível: remuneração de terceiros com vínculo empregatício e encargos trabalhistas e previdenciários; emolumentos; despesas de custeio necessárias à receita e à manutenção da fonte produtora. Documentação idônea.
- Regras de cálculo afetadas: total transportado ao Resumo como dedução (livro Caixa). Moeda estrangeira: conversão pela cotação de venda.
- Exige do MCP: cálculo do limite mensal e do transporte de excesso, validação de elegibilidade pela ocupação/tipo de receita.

## F-RTPF-DARF0190 Carnê-Leão - Darf pago cód. 0190
- Onde: aba Outras Informações; págs. 65 e 74
- Campos: valor mensal do Carnê-Leão pago (principal do Darf), no mês do recebimento do rendimento, independentemente da data do pagamento.
- Validações conhecidas: vencimento no último dia útil do mês subsequente ao recebimento; código de receita 0190. Somente o principal (sem multa e juros).
- Regras de cálculo afetadas: total transportado ao Resumo (imposto pago, dedutível do imposto devido). Imposto pago no exterior compensável na apuração mensal, observado o limite legal, se não compensado/restituído no exterior e pago em país com acordo ou reciprocidade.
- Exige do MCP: registro mensal; possível cálculo de Carnê-Leão devido e geração de orientação de Darf 0190 (inferido, o recolhimento é fora do PGD).

## F-RTPF-DEP-CPF CPF dos Dependentes (ficha PF/Exterior, aba Dependentes)
- Onde: aba Dependentes da ficha PF/Exterior; pág. 67
- Campos: Dependente (seleção entre os da ficha Dependentes), via botão Novo; depois as mesmas sub-abas e colunas do titular (Trabalho Não Assalariado; Outras Informações: NIT/PIS/PASEP, Aluguéis, Outros, Exterior, Previdência Oficial, Quantidade de Dependentes, Pensão Alimentícia, Livro Caixa, Darf 0190).
- Validações conhecidas: dependente precisa existir antes na ficha Dependentes; excluir a linha apaga todas as informações dela; rendimentos de dependentes NÃO são somados aos do titular nesta aba (informados separadamente), mas entram no Resumo (inferido pelo "transporta o total para o Resumo"). Limite de isenção mensal citado: R$ 2.259,20 (jan a abr) e R$ 2.428,80 (mai a dez).
- Regras de cálculo afetadas: totais dos dependentes transportados ao Resumo; previdência somada à da ficha PJ dependentes.
- Exige do MCP: CRUD por dependente com as mesmas validações; cascata na exclusão.

## F-ISENTO-INTRO Rendimentos Isentos e Não Tributáveis (início)
- Onde: pág. 75 em diante (fora da faixa deste fork; tratado pelo fork N3)
- Observações: a faixa termina no título da ficha.
