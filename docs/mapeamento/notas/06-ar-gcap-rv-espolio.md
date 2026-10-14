# Notas 06: Atividade Rural, GCAP, Renda Variável, FII/Fiagro, Declaração Final de Espólio

Fonte: AjudaIRPF.pdf (IRPF2026-1.5), linhas 11532 a 14481 do texto extraído (páginas 265 a 340 de 425).

---

## D-AR-GERAL Demonstrativo da Atividade Rural (visão geral e regras de período)
- Onde: menu lateral "Fichas da Declaração" > Demonstrativo da Atividade Rural; Ajuda pág. 265 a 268
- Aplica-se a: Ajuste Anual, Final de Espólio, Saída Definitiva
- Campos: não se aplica (contêiner das fichas D-AR-*)
- Validações conhecidas:
  - Final de Espólio: período de 1º de janeiro até a data da decisão judicial da partilha, sobrepartilha ou adjudicação, ou da lavratura da escritura pública; se ainda houver bens a inventariar que gerem rendimentos, informar o ano-calendário inteiro.
  - Saída Definitiva: período de 1º de janeiro até o dia anterior ao da caracterização da condição de não residente.
- Códigos: ver D-AR-IMOVEL (atividade 10 a 17, 99; condição de exploração 1 a 6)
- Regras de cálculo afetadas: resultado tributável vai para o Resumo (linha "Resultado tributável da Atividade Rural"); resultado não tributável vai para Isentos código 15.
- Importações/exportações: IRPF2025 (declaração anterior) e Livro Caixa da Atividade Rural 2025 (ver D-AR-IMPORT); todos os itens importados são alteráveis.
- Exige do MCP: módulo completo de atividade rural (CRUD das fichas, cálculo do resultado, importação), controle de período conforme tipo de declaração.
- Observações: documentos guardados até a prescrição dos créditos tributários.

## D-AR-OBRIG Obrigatoriedade de Preenchimento do Demonstrativo
- Onde: Ajuda pág. 266
- Aplica-se a: todos
- Validações conhecidas (deve preencher se qualquer condição):
  - apurou resultado positivo da atividade rural em 2025, em qualquer montante, e está obrigado à DAA 2026;
  - participação nas receitas brutas das unidades rurais (individual, parceria ou condomínio) em 2025 superior a R$ 177.920,00, caso tenha exclusivamente receitas de atividade rural;
  - pretende compensar prejuízo de anos anteriores ou do próprio ano-calendário 2025.
- Regras de cálculo afetadas: Brasil com várias propriedades: ficha Brasil consolidada; exterior: uma ficha por país, na moeda do país, convertida para US$ e consolidada (soma algébrica) e depois para R$. Resultado positivo no exterior não compensa negativo do Brasil e vice-versa.
- Exige do MCP: regra de obrigatoriedade (limite R$ 177.920,00) no verificador de obrigatoriedade; validação de não compensação Brasil/exterior.

## D-AR-OQUE O Que deve ser Declarado (atividade rural)
- Onde: Ajuda pág. 267
- Aplica-se a: todos
- Regras: são atividade rural: criação/recriação/engorda de animais de médio e grande porte; cultura do solo; apicultura, avicultura, cunicultura, piscicultura, sericicultura, suinocultura e pequenos animais, inclusive captura e venda in natura de pescado; extração e exploração animal e vegetal; transformação de produtos sem alterar composição e características in natura, feita pelo próprio produtor/familiares/empregados, dentro do imóvel, com equipamentos usuais e matéria-prima própria.
- Não é receita rural: aluguel ou arrendamento de imóvel rural, pastos, máquinas; prestação de serviços de preparo da terra e transporte de produtos de terceiros (vão para rendimentos tributáveis comuns). Transformação fora das condições: ganho de capital (sem habitualidade) ou equiparação a PJ (com habitualidade).
- Não é atividade rural: compra e venda de rebanho bovino com permanência inferior a 52 dias (confinamento) ou 138 dias (demais casos).
- Exige do MCP: orientação/classificação de receita (rural x outra) em ferramenta de ajuda; alerta quando usuário classificar aluguel de pasto como receita rural (inferido).

## D-AR-IMOVEL Dados do Imóvel Explorado (abas Brasil e Exterior)
- Onde: Demonstrativo da Atividade Rural > Dados do Imóvel Explorado; abas "Brasil" e "Exterior"; botões Novo, OK, Editar, Excluir; Ajuda pág. 269 e 270
- Aplica-se a: todos
- Campos:
  - Código da atividade (seleção, obrigatório, tabela tipoAtividadesRural): 10 Agricultura; 11 Pecuária; 12 Extração e exploração vegetal e animal; 13 Apicultura, avicultura, cunicultura, piscicultura, sericicultura, suinocultura etc.; 14 Cultura de pequenos animais; 15 Captura e venda do pescado in natura; 16 Transformação de produtos agrícolas ou pecuários; 17 Cultivo de florestas; 99 Outras.
  - Nome do imóvel (texto)
  - Localização (texto; no exterior inclui cidade e país)
  - CIB, Cadastro Imobiliário Brasileiro (mesmo número do ITR; só Brasil)
  - Área (ha, uma casa decimal)
  - Condição de exploração (seleção, tabela condicoesExploracao): 1 Propriedade Única ou Posse; 2 Condomínio; 3 Parceria; 4 Arrendamento; 5 Propriedade comum ao casal; 6 Outras.
  - Participação (%) (numérico; 100 se único proprietário, posseiro ou arrendatário; 50 se comum ao casal com tributação por cada cônjuge)
  - Participantes (lista): CPF/CNPJ (exceto se marcado estrangeiro), Nome, indicador "estrangeiro"
- Validações conhecidas:
  - Se participação menor que 100%, exigir participante(s) com CPF/CNPJ e Nome.
  - Nome do participante obrigatório se estrangeiro e sem CPF/CNPJ.
  - CIB substitui o antigo NIRF; número não muda para imóveis já cadastrados.
  - Excluir apaga todos os campos da linha.
- Importações: todos os dados importados do IRPF2025; imóvel adquirido em 2025 deve ser preenchido manualmente.
- Exige do MCP: ferramenta de inclusão/edição/exclusão de imóvel rural; validação de CPF/CNPJ dos participantes; validação de soma de percentuais (inferido); tabela de atividades e condições.
- Observações: novidade de nomenclatura: CIB no lugar de NIRF.

## D-AR-RD-BRASIL Receitas e Despesas - Brasil
- Onde: Demonstrativo da Atividade Rural > Receitas e Despesas > aba Brasil; botão "IMPORTAR"; Ajuda pág. 270 a 272
- Aplica-se a: todos
- Campos (grade mensal janeiro a dezembro de 2025):
  - Receita bruta (R$ por mês)
  - Despesa de custeio e investimento (R$ por mês)
- Validações conhecidas / regras de lançamento:
  - Consolidar todas as unidades rurais no Brasil do titular e dos dependentes.
  - Receita inclui: alienação de bens usados na produção (tratores, implementos, máquinas, utilitários, benfeitorias); sobras líquidas de cooperativas; auxílios e subvenções públicas; diferença de preço no fechamento de operação; bens/produtos/animais entregues para integralização de capital; produtos entregues em permuta ou dação em pagamento.
  - Adiantamento recebido em anos anteriores com entrega em 2025: lançar como receita no mês da entrega.
  - Despesas: encargos financeiros no mês do pagamento; aquisições a prazo no mês de cada parcela; bem por financiamento rural no mês do pagamento do bem; consórcio/leasing no mês de cada parcela após o recebimento do bem; consórcio não contemplado só vira despesa no mês do recebimento do bem, pelo valor acumulado; permuta com produtos rurais parcelada no mês de cada parcela.
  - Produto entregue em permuta: receita no mês de cada parcela.
  - Entrega futura com devolução: devolução após a entrega é despesa no mês da devolução; antes da entrega reduz o adiantamento.
  - Aluguel ou arrendamento pago deve ser informado obrigatoriamente na ficha Pagamentos Efetuados (DAA, Espólio, Saída).
- Regras de cálculo afetadas: somatórios vão para Apuração do Resultado (Receita bruta total, Despesa total).
- Importações: Livro Caixa da Atividade Rural 2025 (dados mensais de receita e despesa), gravados pelo LCAR 2025 via "Exportar para o IRPF2026".
- Exige do MCP: grade mensal editável; importação do arquivo do LCAR 2025; validação cruzada com Pagamentos Efetuados (arrendamento) (inferido).

## D-AR-RD-EXTERIOR Receitas e Despesas - Exterior
- Onde: Demonstrativo da Atividade Rural > Receitas e Despesas > aba Exterior; botões Novo, Ok, Editar, Excluir, Importar; Ajuda pág. 273 a 276
- Aplica-se a: todos
- Campos (uma ficha por país):
  - País (seleção, tabela de países)
  - Receita Bruta Total - Moeda original (anual)
  - Despesa de Custeio/Investimento Total - Moeda original (anual)
  - Resultado - Moeda original (calculado: receita menos despesa)
  - Resultado - US$ (informado pelo usuário: conversão pela cotação fixada pela autoridade monetária do país para o último dia do ano-calendário)
- Validações conhecidas:
  - Uma ficha por país; consolidar todas as unidades de cada país.
  - Final de Espólio: conversão para US$ na data da decisão judicial da partilha/sobrepartilha/adjudicação ou lavratura; período de 1º de janeiro até essa data.
  - Saída Definitiva: conversão para US$ no dia anterior ao da caracterização como não residente; período de 1º de janeiro até esse dia.
  - Mesmas regras de receita/despesa da ficha Brasil (com Previdência Oficial do país em vez de INSS); aluguel/arrendamento também em Pagamentos Efetuados.
- Regras de cálculo afetadas: Resultado total US$ (soma algébrica dos países) multiplicado por R$ 5,5018 (dólar de compra BCB em 31/12/2025).
- Importações: Livro Caixa da Atividade Rural 2025 (somatório anual por país).
- Exige do MCP: CRUD por país; cálculo do resultado em moeda original; campo de cotação/US$ com orientação de conversão; constante cambial 5,5018 parametrizada por exercício.

## D-AR-APUR Apuração do Resultado (considerações gerais)
- Onde: Demonstrativo da Atividade Rural > Apuração do Resultado; Ajuda pág. 277 e 278
- Aplica-se a: todos
- Regras:
  - Apuração mediante livro Caixa (manual ou eletrônico) com receitas, despesas de custeio, investimentos e demais valores.
  - Exterior: apuração separada por país em moeda local; Resultado I moeda original convertido para US$ (cotação do último dia do ano-calendário pela autoridade monetária do país) = Resultado I US$; consolidação em Resultado total US$; conversão para R$ pela cotação de compra BCB do último dia de 2025: R$ 5,5018.
  - Receita bruta total até R$ 56.000,00: facultada apuração por prova documental, dispensado o livro Caixa.
  - Livro Caixa independe de registro; sem intervalos em branco, entrelinhas, borraduras, raspaduras ou emendas.
  - Arrendatários, condôminos e parceiros apuram separadamente na proporção das receitas e despesas de cada um, comprovado por contrato escrito.
  - Imóvel comum ao casal: cada cônjuge apura e tributa sua parte; opcionalmente o total na declaração de um dos cônjuges junto com os demais rendimentos comuns.
  - Cônjuge arrendatário/condômino/parceiro em unidade que não pertence ao casal: tributa integralmente o titular da atividade, salvo declaração em conjunto.
- Exige do MCP: motor de apuração com colunas Brasil e Exterior; parâmetros do exercício (5,5018; 56.000,00; 20%).

## D-AR-APUR-L01 Saldo de prejuízo(s) a compensar de exercício(s) anterior(es)
- Onde: Apuração do Resultado; Ajuda pág. 279
- Campos: valor R$ (Brasil) e valor (Exterior), informados pelo usuário
- Validações conhecidas:
  - Valor vem do campo "Informação para o exercício seguinte" da Apuração do Resultado da DAA 2025, desde que não tenha optado pelo limite de 20% em 2024 e tenha apresentado a DAA 2025.
  - Para compensar: apresentar o demonstrativo de 2025, não optar pelo limite de 20% e possuir escrituração, mesmo se dispensado.
  - Compensação limitada ao Resultado do exercício (exterior: ao Resultado total R$).
  - Prejuízo do exterior só compensa resultado positivo do exterior.
  - Encerramento de espólio: saldo não deduzido pelo de cujus (sem opção posterior pelos 20%) pode ser usado pelo meeiro e sucessores, proporcionalmente à parcela da unidade rural.
- Importações: NÃO é importado do IRPF2025; deve ser preenchido no IRPF2026.
- Exige do MCP: campo manual com validação de limite; alerta se houve opção por 20% em 2024 (depende de dado anterior, inferido).

## D-AR-APUR-L02 Receita bruta total
- Onde: Apuração do Resultado; pág. 280
- Regras de cálculo: transportado pelo programa: soma da receita bruta mensal (Brasil) e das receitas do exterior.
- Exige do MCP: cálculo automático.

## D-AR-APUR-L03 Despesa de custeio e investimento total
- Onde: Apuração do Resultado; pág. 281
- Regras de cálculo: transportado: soma das despesas mensais (Brasil) e do exterior.
- Exige do MCP: cálculo automático.

## D-AR-APUR-L04 Resultado (Brasil) / Resultado total US$ e Resultado total R$ (Exterior)
- Onde: Apuração do Resultado; pág. 282
- Regras de cálculo:
  - Brasil: Resultado = Receita bruta total menos Despesa total.
  - Exterior: Resultado total US$ = soma do Resultado US$ de todos os países; Resultado total R$ = Resultado total US$ x 5,5018.
  - Final de Espólio: Resultado total R$ informado pelo usuário, com dólar de compra BCB da data da decisão judicial/lavratura.
  - Saída Definitiva: Resultado total R$ informado, com dólar de compra BCB do dia anterior à condição de não residente.
- Exige do MCP: cálculo; para Espólio final e Saída, campo de cotação informada.

## D-AR-APUR-L05 Limite de 20% sobre a receita bruta total
- Onde: Apuração do Resultado; pág. 283
- Regras de cálculo: Brasil: 20% da Receita bruta total (calculado). Exterior: 20% da receita bruta em moeda original por país, convertido para US$ (cotação do último dia do ano pela autoridade monetária do país), somado entre países, multiplicado por 5,5018.
- Validações: no exterior, quando importado do IRPF2025/LCAR, o limite de 20% em R$ deve ser preenchido manualmente (pág. 296).
- Exige do MCP: cálculo Brasil; campo informado ou cálculo auxiliado no exterior.

## D-AR-APUR-L06 Opção pela forma de apuração do resultado tributável
- Onde: Apuração do Resultado; pág. 284
- Campos: seleção entre "Limite de 20% sobre a receita bruta" e "Resultado"
- Regras de cálculo: define o Resultado tributável. Opção por 20% impede compensação de prejuízo e o aproveitamento futuro do saldo (ver L01).
- Exige do MCP: ferramenta de simulação comparando as duas opções e recomendando (inferido).

## D-AR-APUR-L07 Compensação de prejuízo(s) de exercício(s) anterior(es)
- Onde: Apuração do Resultado; pág. 285
- Campos: valor que pretende compensar
- Validações: só se resultado tributável positivo e opção pelo Resultado; limitado ao saldo e ao resultado.
- Exige do MCP: validação de limite.

## D-AR-APUR-L08 Resultado tributável
- Onde: Apuração do Resultado; pág. 286
- Regras de cálculo: preenchido conforme opção. Se positivo, transportado para "Resultado tributável da Atividade Rural" da ficha Rendimentos Tributáveis e Deduções do Resumo. Brasil e exterior não se compensam.
- Exige do MCP: transporte automático ao Resumo.

## D-AR-APUR-L09 Saldo de prejuízo(s) a compensar
- Onde: Apuração do Resultado; pág. 287
- Regras de cálculo: Resultado positivo e opção pelo resultado: saldo anterior menos compensação. Resultado negativo: soma do negativo ao saldo anterior. Valor vai para "Informação para o exercício seguinte".
- Exige do MCP: cálculo; exportar saldo para o próximo exercício.

## D-AR-APUR-L10 Apuração do resultado não tributável
- Onde: Apuração do Resultado; pág. 288
- Regras de cálculo:
  - Brasil: Resultado + adiantamentos recebidos em 2025 para entrega futura - adiantamentos recebidos até 2024 informados como receita de produtos entregues em 2025 - resultado tributável (se negativo, considerado zero).
  - Exterior: Resultado total R$ + adiantamentos 2025 - receitas de produtos entregues em 2025 referentes a adiantamentos até 2024 - resultado tributável (negativo = zero).
  - Se positivo, vai para a linha Resultado não tributável e é transportado para Isentos código 15 (Parcela não tributável correspondente à atividade rural).
- Exige do MCP: cálculo e transporte automático para ficha de isentos.

## D-AR-APUR-L11 Adiantamento(s) recebido(s) em 2025 por conta de venda para entrega futura
- Onde: Apuração do Resultado; pág. 289
- Campos: valor R$
- Validações: só adiantamentos de contratos cujos produtos não foram entregues até 31/12/2025; se entregue em 2025, vira receita do mês da entrega. Exterior: converter moeda local para US$ (último dia do ano, autoridade do país) e para R$ (dólar de compra BCB do último dia de 2025). Devolução antes da entrega reduz o adiantamento.
- Importações: importado do LCAR 2025.
- Exige do MCP: campo e orientação de conversão.

## D-AR-APUR-L12 Adiantamento(s) recebido(s) até 2024 a ser(em) informado(s) como receita(s) de produto(s) entregue(s) em 2025
- Onde: Apuração do Resultado; pág. 290
- Campos: valor R$
- Validações: valores declarados como adiantamento nos exercícios anteriores e entregues em 2025; também devem constar como receita no mês da entrega. Exterior: mesma conversão.
- Importações: importado do LCAR 2025.
- Exige do MCP: campo; validação cruzada com receita mensal (inferido).

## D-AR-REBANHO Movimentação do Rebanho (abas Brasil e Exterior)
- Onde: Demonstrativo da Atividade Rural > Movimentação do Rebanho; pág. 291
- Aplica-se a: todos
- Campos (por espécie, quantidade de cabeças): Espécie; Estoque inicial; Aquisições (inclui meação, doação, herança recebidas); Nascimentos; Consumo e perdas; Vendas (inclui entregas por meação, doação, herança); Estoque final (calculado)
- Validações: incluir animais próprios mesmo em poder de terceiros por contrato; excluir animais de terceiros em seu poder.
- Regras de cálculo: Estoque final = Estoque inicial + Aquisições + Nascimentos - Consumo e perdas - Vendas.
- Importações: estoque final do IRPF2025 vira estoque inicial; aquisições, nascimentos, consumo e perdas e vendas devem ser preenchidos no IRPF2026.
- Exige do MCP: CRUD por espécie com cálculo do estoque final; validação de estoque final não negativo (inferido).

## D-AR-BENS Bens da Atividade Rural
- Onde: Demonstrativo da Atividade Rural > Bens da Atividade Rural; botões Novo, Editar, Excluir (múltiplas linhas), "Repetir valores" (copia 31/12/2024 para 31/12/2025 nos selecionados, Ctrl para múltipla seleção); pág. 292 e 293
- Aplica-se a: todos
- Campos: Código (grupo do bem, tabela tipoBensAR); País (padrão Brasil; exterior: país do bem); Discriminação (bens e benfeitorias usados na atividade, exceto terra nua, com data e valor de alienação em 2025, datas e valores de aquisição se adquiridos e alienados em 2025, valor pago a cada ano se adquiridos antes); Situação em 31/12/2024 (R$); Situação em 31/12/2025 (R$)
- Validações:
  - Consórcio não contemplado: valores pagos (2024 + 2025) nesta ficha, não como despesa; após recebimento do bem, pago + lance pode ser despesa.
  - Financiamento liberado e ainda não aplicado deve constar aqui.
  - Situação 31/12/2025 em branco para bens adquiridos e alienados em 2025 e para produção em estoque.
  - Exterior: moeda do país para US$ (cotação do último dia do ano, autoridade do país) e x 5,5018.
  - Final de Espólio: bens deduzidos como despesa não vão para Bens e Direitos; transmissão é receita rural do espólio no mês da transmissão.
- Regras de cálculo afetadas: valor de alienação integra receita bruta (ficha Receitas e Despesas).
- Importações: código e discriminação do IRPF2025; bens adquiridos e alienados em 2025 preenchidos manualmente.
- Exige do MCP: CRUD com função "repetir valores"; conversão cambial; alerta de alienação a lançar como receita (inferido).

## D-AR-DIVIDAS Dívidas Vinculadas à Atividade Rural (abas Brasil e Exterior)
- Onde: Demonstrativo da Atividade Rural > Dívidas Vinculadas à Atividade Rural; botões Novo, OK, Editar, Excluir; pág. 294
- Aplica-se a: quem possuía dívidas rurais em 31/12/2024 ou 31/12/2025
- Campos: Discriminação (data de contratação, número do contrato, nome do credor, CPF/CNPJ do credor se do Brasil); Situação em 31/12/2024 (R$); Situação em 31/12/2025 (R$); Valor Pago em 2025 (R$)
- Validações: empréstimo contraído e quitado no mesmo ano: item específico com valor, datas de contratação e quitação, contrato, credor; zero nas duas situações. Exterior: conversão para US$ e x 5,5018.
- Importações: discriminação e situação em 31/12/2024 do IRPF2025; situação 31/12/2025 e dívidas de 2025 manuais.
- Exige do MCP: CRUD; validação de CPF/CNPJ do credor; conversão cambial.

## D-AR-IMPORT Importação AR2025 (Livro Caixa da Atividade Rural 2025 e IRPF2025)
- Onde: botão "Importar" da ficha Receitas e Despesas; opção "Importação AR2025"; pág. 295 e 296
- Aplica-se a: todos
- Fluxo: preencher o LCAR 2025 (não usar o LCAR 2026); gravar via "Exportar para o IRPF2026" do menu Ferramentas do LCAR 2025; importar no IRPF2026 pelo botão Importar da ficha Receitas e Despesas.
- Itens importados do IRPF2025 (ao cadastrar contribuinte com importação): Dados do Imóvel Explorado (todos); Rebanho (estoque final vira inicial); Bens AR (código e discriminação); Dívidas AR (discriminação e situação 31/12/2024).
- Itens importados do LCAR 2025: Receitas e Despesas (dados mensais Brasil; somatório anual por país no exterior); Apuração (adiantamentos 2025 e adiantamentos até 2024 entregues em 2025).
- Itens a preencher manualmente: imóveis adquiridos em 2025; saldo de prejuízo de exercícios anteriores; limite de 20% em R$ no exterior; rebanho (aquisições, nascimentos, consumo e perdas, vendas); bens adquiridos e alienações de 2025; dívidas (situação 31/12/2025 e dívidas de 2025).
- Exige do MCP: importador do arquivo exportado pelo LCAR 2025 (formato a mapear, ver layout); importador da declaração anterior; relatório do que falta preencher após importação.
- Observações: LCAR é programa separado da RFB (download no gov.br).

---

## D-GCAP-GERAL Demonstrativo de Ganhos de Capital (GCAP 2025)
- Onde: "Fichas da Declaração" > Demonstrativo "Ganhos de Capital" com telas "Bens Imóveis", "Direitos/Bens Móveis", "Participações Societárias", "Moedas em Espécie"; pág. 297
- Aplica-se a: todos (Espólio usa para ganho na transferência por valor superior)
- Campos: dados vêm importados; o IRPF2026 lista os demonstrativos importados por tipo.
- Validações conhecidas:
  - Arquivo deve corresponder ao CPF da declaração aberta.
  - Não é aceito arquivo de "Cópia de Segurança" do GCAP; só o gerado por "Exportar para o IRPF2026" do GCAP2025.
  - Alienação de bens adquiridos em moeda estrangeira, liquidação/resgate de aplicações em moeda estrangeira e alienação de moeda estrangeira em espécie: apuração obrigatória pelo GCAP 2025.
- Regras de cálculo afetadas: GCAP apura imposto devido, rendimentos de tributação exclusiva e parcela isenta, que são transportados à declaração (exclusivos 02/03/04, isentos, imposto pago, inferido pelos códigos da ficha exclusiva).
- Importações: menu "Importações" > "Ganhos de Capital 2025"; ou barra lateral "Importações" > "Ganhos de Capital 2025"; ou botão "Importar" em cada tela do demonstrativo; ou "Importação GCAP 2025".
- Exclusão: selecionar demonstrativo(s) e "Excluir".
- Exige do MCP: importador de arquivo GCAP exportado (ver mapeamentoXmlGCAP.xml); listagem e exclusão de demonstrativos; idealmente calculadora própria de ganho de capital (imóvel, móvel, participação, moeda), pois o GCAP é programa separado; geração de orientação de Darf (4600, 8523, 8960).
- Observações: GCAP 2025 é programa separado (download gov.br), com impressão de Darf própria.

## D-GCAP-IMOVEIS Ganhos de Capital - Bens Imóveis
- Onde: Demonstrativo Ganhos de Capital > Bens Imóveis; botão Importar; pág. 297
- Campos/regras: não detalhados na Ajuda (preenchimento no GCAP). (inferido: alienação, custo, reduções, isenções de imóvel único até R$ 440 mil, 180 dias)
- Exige do MCP: importação e exibição; cálculo próprio opcional.

## D-GCAP-MOVEIS Ganhos de Capital - Direitos/Bens Móveis
- Onde: Demonstrativo Ganhos de Capital > Direitos/Bens Móveis; botão Importar; pág. 297
- Exige do MCP: importação e exibição; inclui alienação de FII/Fiagro fora de bolsa (pág. 299).

## D-GCAP-PARTICIP Ganhos de Capital - Participações Societárias
- Onde: Demonstrativo Ganhos de Capital > Participações Societárias; botão Importar; pág. 297
- Exige do MCP: importação e exibição.

## D-GCAP-MOEDA Ganhos de Capital - Moedas em Espécie
- Onde: Demonstrativo Ganhos de Capital > Moedas em Espécie; botão Importar; pág. 297
- Exige do MCP: importação e exibição; Darf 8960.

---

## D-RV-GERAL Renda Variável - Operações Comuns e Day-Trade (considerações gerais)
- Onde: "Fichas da Declaração" > Renda Variável > Operações Comuns/Day-Trade; abas Titular e Dependentes; seleção do mês; botões Ok, Editar, Excluir; pág. 298 a 300
- Aplica-se a: todos (Espólio: até a data da partilha, ou ano todo se ainda há bens a inventariar; Saída: até o dia anterior à não residência)
- Obrigatoriedade (residente no Brasil, em 2025): alienação de ações no mercado à vista em bolsa; alienação de ouro ativo financeiro (disponível/à vista em bolsa ou junto a instituições financeiras); operações a termo, opções e futuro em bolsa com qualquer ativo; operações a termo, opções e futuro fora de bolsa, inclusive opções flexíveis; alienação de quotas de FII/Fiagro em bolsa.
- Dispensa: box, termo conjugado (compra vinculada à revenda) e operações de financiamento com rendimento predeterminado (tributados na fonte como renda fixa); mútuo e compra vinculada à revenda com ouro; operações isentas (ações à vista em bolsa e ouro com alienações no mês até R$ 20.000,00, por conjunto de ações e ouro separadamente), exceto se quiser compensar perdas; FII/Fiagro fora de bolsa (vai para GCAP2025).
- Validações:
  - Resultado positivo em operações isentas vai para Isentos e Não Tributáveis (código 20 para ações até R$ 20 mil, inferido; FII/Fiagro isentos vão para linha 99, pág. 312).
  - Dependentes: só os já cadastrados na ficha Dependentes aparecem na aba Dependentes.
  - Perdas em day-trade só compensam ganhos em day-trade.
- Exige do MCP: CRUD mensal por titular/dependente; regras de isenção de R$ 20 mil; cálculo mensal com carry de prejuízo e IRRF.

## D-RV-PROC Procedimentos para Apuração dos Ganhos Líquidos ou Perdas
- Onde: pág. 301 a 304
- Regras de cálculo:
  - Corretagens, taxas e custos efetivamente pagos podem ser somados ao custo ou deduzidos do preço de venda.
  - Mercado à vista (ações, ouro, inclusive fora de bolsa): custo médio ponderado por espécie; venda parcial ajusta o estoque; ganho = venda menos custo médio do vendido.
  - Opções sem exercício: titular: custo médio dos prêmios pagos da mesma série, ganho = valor de encerramento menos custo médio; lançador: média dos prêmios recebidos da mesma série, ganho = prêmio médio x quantidade encerrada menos valor da operação de encerramento.
  - Exercício de opção de compra: titular: custo = preço de exercício + prêmio pago; ganho = venda à vista na data do exercício menos custo; venda posterior usa custo médio do à vista. Lançador coberto: custo médio do ativo; descoberto: preço de aquisição do ativo; ganho = preço de exercício + prêmio recebido menos custo.
  - Exercício de opção de venda: titular: custo = custo médio do ativo + prêmio pago; ganho = preço de exercício menos custo. Lançador: custo = preço de exercício menos prêmio recebido; ganho = venda à vista na data do exercício menos custo; venda posterior pelo custo médio.
  - Prêmio sem negociação nem exercício: ganho do lançador e perda do titular no vencimento.
  - Termo: comprador que vende à vista na liquidação: ganho = preço à vista menos preço do contrato; vendedor que compra à vista na liquidação: ganho = preço do contrato menos preço à vista; caso contrário, preço do contrato menos custo médio. Vendedor em operação de financiamento: renda fixa.
  - Futuro: ganho = soma algébrica dos ajustes diários até a liquidação ou encerramento.
- Exige do MCP: calculadora de custo médio e de ganho por tipo de mercado (opcional, a partir de notas de corretagem); a ficha em si só recebe o ganho/perda consolidado por linha e mês.

## D-RV-TIPOS Tipos de Mercado ou Ativo / Ganhos Líquidos ou Perdas (linhas de entrada)
- Onde: grade mensal, colunas "Operações Comuns" e "Operações Day-Trade"; pág. 305
- Campos: linhas por tipo de mercado/ativo (nomes dos principais ativos precedidos do tipo de mercado; linha "outros" para ativo não discriminado; "Mercado de Opções fora de bolsa" para mercados de liquidação futura fora de bolsa). Lista exata não consta na Ajuda (inferido do PGD: Mercado à vista ações, ouro, ouro fora de bolsa; Mercado de opções ações, ouro, fora de bolsa, outros; Mercado futuro dólar, índices, juros, outros; Mercado a termo ações/ouro, outros).
- Validações: valores em R$ por mês; perdas com sinal negativo; consolidar por linha o total do mês; day-trade separado.
- Exige do MCP: modelo de dados com a lista de linhas (extrair do layout .DEC); entrada de ganho/perda por mês e linha.

## D-RV-L01 RESULTADO LÍQUIDO DO MÊS
- Onde: pág. 306
- Regras de cálculo: soma algébrica das linhas do mês, por coluna (comuns e day-trade); negativo com sinal.
- Exige do MCP: cálculo.

## D-RV-L02 Resultado negativo até o mês anterior
- Onde: pág. 306
- Campos: em janeiro, informado pelo usuário (o programa não transporta prejuízo do ano anterior); demais meses, transportado do Prejuízo a compensar do mês anterior.
- Exige do MCP: campo de saldo inicial de prejuízo (comum e day-trade separados) e carry mensal; importação do saldo de dezembro da declaração anterior (inferido).

## D-RV-L03 BASE DE CÁLCULO DO IMPOSTO
- Regras: Resultado líquido do mês menos Resultado negativo até o mês anterior, se positivo.

## D-RV-L04 Prejuízo a compensar
- Regras: se negativo anterior maior que o resultado do mês ou resultado do mês negativo, soma algébrica; compensável nos meses seguintes.

## D-RV-L05 Alíquota do imposto / IMPOSTO DEVIDO
- Regras: base x 15% (operações comuns) ou 20% (day-trade).

## D-RV-L06 Total do imposto devido
- Regras: soma do imposto devido das colunas comuns e day-trade.

## D-RV-L07 IR fonte de Day-Trade no mês
- Campos: IRRF sobre day-trade do mês, informado.

## D-RV-L08 IR fonte de Day-Trade nos meses anteriores
- Regras: transportado do "IR fonte de Day-Trade a compensar" do mês anterior.

## D-RV-L09 IR fonte de Day-Trade a compensar
- Regras: Total do imposto devido menos IR fonte DT do mês e de meses anteriores; se negativo, indica o saldo. Compensável até dezembro; saldo final pode ser pedido em restituição (IN RFB 1.300/2012).

## D-RV-L10 IR fonte (Lei nº 11.033/2004) no mês / nos meses anteriores / a compensar
- Campos: IRRF de que tratam os §§ 1º e 2º, II, do art. 2º da Lei 11.033/2004 (o "dedo-duro").
- Validações: valor do mês deve ser igual ou inferior à diferença entre Total do imposto devido e IR fonte DT do mês ou de meses anteriores, no mesmo ano.
- Regras: saldo compensável com imposto de meses seguintes até dezembro, com imposto de ganho de capital na alienação de ações e na Declaração de Ajuste Anual (vai para Imposto Pago/Retido, inferido).
- Exige do MCP: validação de limite; transporte do saldo ao Resumo.

## D-RV-L11 Imposto a pagar
- Regras: Total do imposto devido menos (IR fonte DT do mês + meses anteriores + a compensar + IR fonte Lei 11.033), se positivo. Pagamento até o último dia útil do mês seguinte; Darf código 6015.
- Exige do MCP: cálculo e geração de orientação de Darf 6015 com multa e juros.

## D-RV-L12 Imposto Pago
- Campos: valor do principal do Darf pago (informado).
- Regras: vencimento no último dia útil do mês subsequente; código 6015; multa de mora 0,33% ao dia a partir do primeiro dia útil após o vencimento, limitada a 20%; juros Selic acumulada mensal a partir do mês seguinte ao vencimento até o mês anterior ao pagamento, mais 1% no mês do pagamento.
- Exige do MCP: campo; calculadora de acréscimos moratórios; comparação imposto a pagar x pago (alerta de diferença, inferido).

---

## D-FII-GERAL Operações em FII ou Fiagro (conceito e considerações gerais)
- Onde: "Fichas da Declaração" > Renda Variável > Operações em Fundos de Investimento Imobiliário/Fiagro; abas Titular e Dependentes; mês; botões Ok, Editar, Excluir; pág. 310 a 313
- Aplica-se a: todos (mesmas regras de período para Espólio e Saída)
- Regras:
  - FII/Fiagro: sem personalidade jurídica, condomínio fechado, proibido resgate, quotas são valores mobiliários (Lei 6.385/1976).
  - Obrigatoriedade e dispensa iguais às de renda variável; FII/Fiagro fora de bolsa vai para o GCAP2025.
  - Resultado positivo em operações isentas: Isentos e Não Tributáveis, Outros, linha 99.
- Exige do MCP: grade mensal titular/dependente.

## D-FII-DISTRIB Distribuição dos Lucros / Rendimentos e Ganhos Auferidos e Distribuídos
- Onde: pág. 314 e 315
- Regras: fundos distribuem no mínimo 95% dos lucros (regime de caixa, balanço semestral 30/06 e 31/12). Rendimentos e ganhos do fundo seguem regras de aplicações de PJ; distribuição sujeita a IRRF de 20%.
- Exige do MCP: orientação; rendimentos distribuídos tributados vão para Exclusivos (inferido).

## D-FII-ALIEN Alienação ou Resgate de Quotas
- Onde: pág. 316
- Regras: alíquota 20%: na fonte no resgate (só no término do prazo ou liquidação; rendimento = resgate menos custo); demais casos pelas normas de renda variável/ganho de capital.

## D-FII-ISENCAO Isenção dos rendimentos distribuídos
- Onde: pág. 317
- Regras: rendimentos distribuídos isentos na fonte e na DAA se quotas negociadas exclusivamente em bolsa ou balcão organizado, fundo com no mínimo 50 cotistas, e o cotista PF não detenha 10% ou mais das quotas nem direito a mais de 10% dos rendimentos. Fundo que aplica em empreendimento com incorporador, construtor ou sócio cotista com mais de 25% (isolado ou com pessoa ligada: parentes até 2º grau, empresa sob seu controle ou de parentes) tributa como PJ.
- Exige do MCP: orientação/validação para classificar rendimentos de FII como isentos (código de isentos de FII, inferido código 26 ou 99 conforme tabela) ou exclusivos.

## D-FII-PROC Procedimentos para Apuração (FII/Fiagro)
- Onde: pág. 318
- Regras: custos de corretagem somados ao custo ou deduzidos da venda; custo médio ponderado por espécie de fundo; venda parcial ajusta estoque; ganho = venda menos custo médio.
- Exige do MCP: calculadora de custo médio por fundo (opcional).

## D-FII-L01 Ganhos Líquidos ou Perdas / Resultado líquido do mês
- Onde: pág. 319 e 320
- Campos: ganho ou perda do mês (R$; perda com sinal negativo); Resultado líquido do mês informado.

## D-FII-L02 Resultado negativo até o mês anterior
- Onde: pág. 321
- Regras: janeiro informado pelo usuário (sem transporte do ano anterior); demais meses transportados do Prejuízo a compensar do mês anterior.

## D-FII-L03 Base de cálculo do imposto
- Onde: pág. 322
- Regras: Resultado líquido do mês menos Resultado negativo anterior, se positivo.

## D-FII-L04 Prejuízo a compensar
- Onde: pág. 323
- Regras: idem renda variável; compensável nos meses seguintes (só com FII/Fiagro, inferido pela ficha separada).

## D-FII-L05 Alíquota do imposto / Imposto devido
- Onde: pág. 324
- Regras: base x 20%.

## D-FII-L06 Imposto pago
- Onde: pág. 325
- Campos: principal do Darf pago.
- Regras: vencimento último dia útil do mês subsequente; código 6015; multa 0,33% ao dia limitada a 20%; juros Selic + 1% no mês do pagamento.
- Exige do MCP: cálculo do imposto e acréscimos; orientação de Darf.
- Observações: a Ajuda não descreve linhas de IRRF na ficha FII (inferido: existe IR fonte Lei 11.033 também; verificar no layout).

---

## E-ESP-GERAL Declaração Final de Espólio: disposições gerais
- Onde: Ajuda pág. 326 a 331
- Aplica-se a: Final de Espólio
- Regras:
  - É a declaração do ano-calendário da decisão judicial da partilha, sobrepartilha, adjudicação ou escritura pública de inventário e partilha. Obrigatória havendo bens a inventariar.
  - Apresentação e pagamento cabem ao inventariante.
  - Período: 1º de janeiro até a data da decisão/escritura; normas do ano-calendário da decisão.
  - Incluir rendimentos próprios, 50% dos rendimentos dos bens comuns até a data da decisão (opcional: 100% em nome do espólio, compensando todo o imposto retido), bens do inventário e obrigações do espólio.
  - Ganho de capital em alienação no curso do inventário: em nome do espólio, exceto cessão de direitos hereditários (cedente apura; IN SRF 84/2001 e IN RFB 897/2008).
  - Apresentada em nome do de cujus, com CPF e endereço dele antes do falecimento. Inventariante indica nome, CPF e endereço na ficha Espólio. Sem CPF do de cujus: solicitar inscrição.
  - Local: Internet, programa de transmissão Receitanet.
- Exige do MCP: tipo de declaração "Final de Espólio" no modelo; validações específicas; geração de arquivo para transmissão (transmissão fica com o usuário via Receitanet/PGD).

## E-ESP-SOBREPARTILHA Sobrepartilha, bens acrescidos antes e após a partilha
- Onde: pág. 328 a 330
- Regras:
  - Bens passíveis de sobrepartilha: sonegados; herança conhecida após partilha; litigiosos ou de liquidação difícil/morosa; situados em lugar remoto da sede do juízo.
  - Desde AC 2020: a partilha dos demais bens implica baixa na ficha Bens e Direitos da DFE; DFE também exigida no trânsito em julgado da sobrepartilha, se não homologada no mesmo ano da partilha. Valor de transmissão superior ao do ano anterior: apurar ganho de capital.
  - Desde exercício 2021: possível fazer DFE com dados da sobrepartilha sem retificar a DFE da partilha. Campo "Final de Espólio": "Partilha", "Sobrepartilha" ou "Partilha e Sobrepartilha" (habilita as abas correspondentes). Permite mais de uma DFE em anos distintos.
  - "Ainda há bens a inventariar?" habilita CPF e Nome do inventariante; marcar quando, apesar da decisão/escritura, ainda existir bem a inventariar; marcar "Bem a inventariar" no bem.
  - Exemplo: partilha transitada em abril/2025 (ocorrida em janeiro/2025): DFE 2026 até 29/05/2026. Sobrepartilha iniciada em janeiro/2026: se decisão não ocorrer em 2026, DAA 2027 com natureza 81 e marcar sobrepartilha na ficha Espólio; se decisão em junho/2026 com trânsito em agosto/2026, outra DFE em 2027 marcando "Sobrepartilha".
  - Partilha transitada a partir de 1º/03/2025 e sobrepartilha iniciada sem decisão em 2025: marcar "Ainda há bens a inventariar" e "Bem a inventariar" nos bens pendentes com situação 31/12/2024 e 31/12/2025. Bens da partilha/sobrepartilha transitados em 2025: dados dos herdeiros, "Situação na data da partilha (R$)" e "Valor de transferência (R$)", sem marcar "Bem a inventariar" e selecionando "%".
  - Bens acrescidos antes do trânsito: incluir bens e rendimentos; se produziram rendimentos em anos anteriores não decaídos, retificar declarações desde a abertura da sucessão.
  - Bens acrescidos após a partilha: retificar declarações anteriores não decaídas; se DFE já apresentada, retificá-la (até a data da decisão da sobrepartilha se no mesmo ano; ano todo se em ano posterior); se DFE não apresentada: incluir bens da partilha e sobrepartilha com rendimentos conforme o ano da decisão.
  - Com sobrepartilha ou recurso, declarações intermediárias continuam até o trânsito em julgado; após trânsito da sobrepartilha, nova declaração final.
- Exige do MCP: suporte às modalidades Partilha / Sobrepartilha / Partilha e Sobrepartilha; flag "bem a inventariar" por bem com troca de campos; assistente de qual declaração entregar (intermediária x final) com base em datas.

## E-ESP-OBITO-CONJUGES Ocorrência de morte de ambos os cônjuges
- Onde: pág. 330 e 331
- Regras: comunhão parcial/universal: morte conjunta: uma declaração em nome de um dos cônjuges com bens e rendimentos do casal; datas diferentes antes de encerrado o inventário do premorto: uma declaração em nome do premorto abrangendo o casal. Separação de bens: uma ou duas declarações conforme um ou dois inventários.
- Campos (ficha Espólio): "Trata-se de óbito de ambos os cônjuges ou companheiros?" (Sim/Não); se Sim: "Trata-se de um inventário conjunto?" (se Sim: CPF e nome do outro cônjuge); se Não: "O cônjuge ou companheiro(a) é meeiro(a)?".
- Exige do MCP: campos condicionais e validação de CPF do outro cônjuge.

## E-ESP-MOEDA Conversão de moeda estrangeira para reais (espólio)
- Onde: pág. 331
- Regras: moeda estrangeira para US$ pela autoridade monetária do país na data do recebimento/pagamento; depois para R$ pelo dólar BCB do último dia útil da primeira quinzena do mês anterior; compra para rendimentos e imposto pago, venda para deduções (tabela de conversão do dólar 2025).
- Exige do MCP: tabela de cotações 2025 e conversor.

## E-ESP-BENS Ficha Bens e Direitos (Final de Espólio)
- Onde: pág. 331 a 333
- Campos: Código, Discriminação, Situação em 31/12/2024 (R$), Situação na data da partilha (R$), Percentual (%), Valor de transferência (R$), dados dos herdeiros (CPF/CNPJ beneficiário), indicador "Bem a inventariar" (habilita Situação 31/12/2024 e 31/12/2025 e desabilita data da partilha, % e valor de transferência)
- Validações:
  - Relacionar todos os bens e direitos do inventário e dos dependentes, Brasil e exterior, em 31/12 do ano anterior e na data da partilha/sobrepartilha/adjudicação/lavratura.
  - Transferência pelo valor da última declaração ou por valor de mercado superior; meeiro, herdeiros e legatários incluem os bens pelo "Valor de transferência" em suas declarações.
  - Transferência por valor superior à "Situação na data da partilha": diferença é ganho de capital a 15% (inclusive espólios iniciados antes de 1º/01/1998); apurar no GCAP 2025 e exportar para a declaração.
  - Bens da atividade rural deduzidos como despesa não vão nesta ficha (ver D-AR-BENS).
  - Bens alienados no ano: discriminação com nome, CPF/CNPJ do adquirente, data e valor; não preencher Situação na data da partilha nem Valor de transferência.
  - Retificadora de DFE: vedado após o prazo tempestivo retificar valores da ficha Bens e Direitos.
- Regras de cálculo afetadas: ganho de capital (GCAP), soma de percentuais por bem (inferido 100%).
- Exige do MCP: modelo de bem com campos de espólio; validação de percentuais e CPF de herdeiros; integração com ganho de capital na transferência.

## E-ESP-GCAP Pagamento do Imposto sobre Ganhos de Capital (espólio)
- Onde: pág. 332
- Regras: pago pelo inventariante por Darf em nome e CPF do de cujus, até a data de apresentação da DFE. Códigos: 4600 (bens ou direitos no Brasil); 8523 (bens/direitos e/ou aplicações financeiras liquidadas ou resgatadas no exterior); 8960 (moeda estrangeira em espécie).
- Exige do MCP: orientação de Darf com os códigos e prazo.

## E-ESP-BENS-AR Bens da Atividade Rural no espólio
- Onde: pág. 332
- Regras: bens deduzidos como despesa não vão para Bens e Direitos; transmissão não segue regras de ganho de capital; preencher o Demonstrativo da AR com o valor de transmissão como receita do espólio no mês da transmissão. Beneficiário que continua a atividade: despesa rural; que não continua: custo de aquisição para futuro ganho de capital.
- Exige do MCP: alerta e lançamento assistido de receita rural na transmissão.

## E-ESP-IDENT Ficha Identificação do Contribuinte (Final de Espólio)
- Onde: pág. 333
- Campos:
  - Tipo de declaração: "Declaração Final de Espólio Original" (primeira do exercício 2026) ou "Declaração Retificadora" (exige número do recibo da DFE anterior, obtido em Declaração > Imprimir > Recibo; obrigatório)
  - Nome (completo do de cujus)
  - Data de nascimento (DD MM AAAA)
  - Raça/Cor (autodeclarado: Amarela, Branca, Indígena, Parda, Preta)
  - Endereço (do de cujus na data do falecimento)
  - Natureza da ocupação: preenchida pelo programa com 81 - Espólio
- Validações: recibo obrigatório na retificadora; retificadora após o prazo não pode alterar Bens e Direitos.
- Exige do MCP: identificação com regras de espólio; validação do número do recibo.

## E-ESP-FICHA Ficha Espólio
- Onde: pág. 333 e 334 (preenchimento obrigatório)
- Campos:
  - Ano do óbito (4 dígitos)
  - Final de Espólio: Partilha / Sobrepartilha / Partilha e Sobrepartilha (habilita abas)
  - Ainda há bens a inventariar (checkbox; habilita CPF e Nome do inventariante)
  - Tipo do inventário: Decisão Judicial ou Escritura Pública (não habilitados quando a sobrepartilha não foi encerrada)
  - Decisão judicial: número do processo, vara cível, comarca, UF, data da decisão judicial da partilha, data do trânsito em julgado
  - Escritura pública: CNPJ e nome do cartório, livro, folhas, UF, município, data da lavratura
  - Identificação do inventariante: CPF, nome, endereço
  - Informações do cônjuge/companheiro: óbito de ambos (Sim/Não); se Não: cônjuge é meeiro?; se Sim: inventário conjunto? (se Sim: CPF e nome do outro cônjuge)
- Validações: obrigatória; CPF do inventariante e do cônjuge válidos; CNPJ do cartório; datas coerentes com o exercício (decisão até 2025 e trânsito até fevereiro/2026, ou trânsito entre 1º/03 e 31/12/2025, ou escritura em 2025) (inferido das regras de prazo).
- Exige do MCP: CRUD da ficha Espólio com campos condicionais; validação de datas e de prazo.

## E-ESP-HERDEIROS Ficha Herdeiros/Meeiro
- Onde: pág. 334 e 335; botões Novo, OK, Editar, Excluir
- Campos: CPF ou CNPJ; Nome do herdeiro ou meeiro
- Validações: CPF/CNPJ válido; excluir apaga a linha.
- Regras: herdeiros são referenciados na partilha de cada bem (percentual e valor de transferência).
- Exige do MCP: CRUD de herdeiros; integridade referencial com bens (inferido).

## E-ESP-DIVIDAS Ficha Dívidas e Ônus Reais (Final de Espólio)
- Onde: pág. 336; botões Novo, Editar, Excluir (múltiplas), Ok
- Campos: Código da dívida (tabela tipoDividas); Discriminação; Situação em 31/12/2024 (R$); Situação na data da partilha (R$)
- Regras: dívidas do espólio e dos dependentes em 31/12 do ano anterior e na data da partilha/sobrepartilha/adjudicação/lavratura.
- Exige do MCP: CRUD com campos de espólio.

## E-ESP-CALCULO Resumo da Declaração - Cálculo do imposto devido (Final de Espólio)
- Onde: pág. 336
- Regras de cálculo: tabela progressiva mensal do ano-calendário multiplicada pelo número de meses de janeiro até o mês da decisão judicial/lavratura, ainda que os rendimentos sejam de apenas alguns meses.
- Exige do MCP: motor de cálculo com tabela proporcional ao número de meses (parâmetro mês da decisão).

## E-ESP-PRAZO Observações finais: prazo, multa, pagamento, restituição
- Onde: pág. 336 a 338
- Regras:
  - Prazo: até 29/05/2026, apresentação e pagamento, quando: decisão até AC 2025 com trânsito até o último dia de fevereiro/2026; escritura lavrada em 2025; ou trânsito em julgado entre 1º/03 e 31/12/2025.
  - Multa por atraso: com imposto devido, 1% ao mês ou fração, mínimo R$ 165,74 e máximo 20% do imposto; sem imposto, R$ 165,74 (art. 88 da Lei 8.981/1995).
  - Pagamento até a data de apresentação, incluindo imposto da declaração do ano anterior e outros créditos não quitados; NÃO é permitido pagamento em quotas. Formas: transferência eletrônica (bancos autorizados) ou agência/caixa eletrônico com Darf.
  - Restituição: mesmas normas; sem bens a inventariar, pode ser paga ao cônjuge, companheiro ou herdeiros (IN SRF 81/2001), sem alvará; com bens a inventariar, conforme alvará judicial.
  - Responsabilidade: espólio pelos tributos até a abertura da sucessão; sucessor e meeiro até a partilha, limitado ao quinhão/legado/herança/meação; inventariante por excesso de poderes ou infração de lei; sem meação/herança/legado o sobrevivente não responde; inventariante solidário quando impossível exigir do espólio, sem multa de ofício.
  - CPF do de cujus não é cancelado; com ano do óbito, situação "titular falecido".
  - Espólio de não residente: não apresentar declaração; recolher na fonte em nome do espólio sobre rendimentos no Brasil até a partilha.
- Exige do MCP: validação de quotas = 1 para DFE; calculadora de multa por atraso (mín. R$ 165,74, máx. 20%); orientação sobre restituição a herdeiros; bloqueio de DFE para não residente.

## E-ESP-DARF Preenchimento do Darf (Final de Espólio)
- Onde: pág. 338 a 340; menu Declaração > Imprimir > Darf do IRPF ou Darf - Doações Diretamente na Declaração - ECA/Pessoa Idosa; ícone impressora na barra de ferramentas; Imprimir na barra lateral; opção Visualizar e salvar em PDF
- Campos do Darf: CPF (do de cujus, pelo programa); Nome (do de cujus na data do falecimento); Período de apuração (data da decisão judicial da partilha); Data de vencimento (preenchida pelo inventariante); Número do documento (gerado pelo programa); Código da receita 0211; Principal (imposto); Multa (0,33% ao dia a partir do primeiro dia útil após o vencimento, limite 20%); Juros (Selic acumulada mensal a partir do mês seguinte ao vencimento até o mês anterior ao pagamento + 1% no mês do pagamento); Total (no prazo: principal; após: principal + multa + juros)
- Exige do MCP: geração de dados de Darf 0211 (PDF ou instrução), calculadora de acréscimos; Darf ECA/Idoso para doações na declaração.
- Observações: o número do documento é gerado pelo PGD (código de barras); fora do PGD o MCP pode instruir uso do Sicalc ou gerar Darf pelo PGD (inferido).

## E-ESP-PAGTO Pagamento do Imposto (Final de Espólio)
- Onde: pág. 340
- Regras: pagamento na data prevista para apresentação; o decurso do prazo implica vencimento das obrigações do espólio. Formas: transferência eletrônica ou agência/caixa com Darf.
- Exige do MCP: alerta de vencimento único (sem quotas, sem débito automático em quotas, inferido).
