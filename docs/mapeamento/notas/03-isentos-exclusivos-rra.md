# Notas 03: Isentos, Tributação Exclusiva, Exigibilidade Suspensa, RRA e Imposto Pago/Retido

Fonte: AjudaIRPF.pdf do PGD IRPF 2026 (linhas 3194 a 5721 de ajuda.txt, págs. 75 a 136).

---

## F-ISENTO Rendimentos Isentos e Não Tributáveis (ficha)
- Onde: Fichas da Declaração > Rendimentos Isentos e Não Tributáveis; págs. 75 a 113
- Aplica-se a: todos (Ajuste Anual, Final de Espólio, Saída Definitiva). Final de Espólio: período de 1º/01 até a data da decisão judicial da partilha, sobrepartilha, adjudicação ou lavratura da escritura de inventário/partilha; se ainda houver bens a inventariar que gerem rendimentos, informar o ano todo. Saída Definitiva: 1º/01 até o dia anterior à caracterização da condição de não residente.
- Estrutura: duas abas. Aba "Rendimentos": lista de lançamentos com botões Novo, Editar, Excluir; ao clicar Novo, escolhe-se o "Tipo de Rendimento" (código) e preenche-se o formulário do tipo; botões Ok e Cancelar. Aba "Totais": somatório automático por tipo de rendimento (uma linha por código).
- Campos comuns da maioria dos códigos: Tipo de beneficiário (Titular ou Dependente, obrigatório); CPF do dependente e nome (lista dos dependentes cadastrados, se beneficiário = Dependente); CNPJ (ou CPF/CNPJ, conforme o código) da fonte pagadora; Nome da fonte pagadora; Valor.
- Validações conhecidas: excluir uma linha apaga todos os campos dela; dependente precisa existir na ficha Dependentes.
- Códigos: 01 a 25, 27, 28, 99 (não existe código 26 na lista da Ajuda 2026).
- Regras de cálculo afetadas: total de rendimentos isentos no Resumo (Outras Informações); não entra na base de cálculo; justifica acréscimo patrimonial, exceto onde indicado.
- Importações: códigos 05, 06, 07 recebem valor transportado do GCAP; 15 do Demonstrativo da Atividade Rural; 22 do Demonstrativo de Renda Variável; 27 da ficha RRA; 09, 12, 99 (FII/Fiagro) podem ser lançados a partir da ficha Bens e Direitos (vínculo bem/rendimento); pré-preenchida e informe de rendimentos podem trazer lançamentos (inferido).
- Exige do MCP: CRUD de lançamentos por código com schema próprio por código; agregação por código (aba Totais); vínculo opcional a bem/direito; transporte automático de demonstrativos; validação de dependente existente; total para o Resumo.
- Observações: botão "Visualizar Bem/Direito Associado" para lançamentos criados a partir de um bem.

## F-ISENTO-01 Bolsas de estudo e de pesquisa caracterizadas como doação, exceto médico-residente ou Pronatec
- Onde: Isentos, pág. 78
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome da fonte pagadora; Valor
- Validações conhecidas: somente bolsa recebida exclusivamente para estudo/pesquisa, sem vantagem para o doador nem contraprestação de serviços (regra de enquadramento, orientação ao usuário)
- Regras de cálculo afetadas: total de isentos
- Exige do MCP: CRUD; orientação de enquadramento

## F-ISENTO-02 Bolsas de estudo e de pesquisa de médico-residente e servidor da rede pública de educação profissional (Pronatec)
- Onde: Isentos, pág. 79
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Validações conhecidas: Pronatec isento só a partir de junho de 2013 (Lei nº 12.816/2013)
- Exige do MCP: CRUD

## F-ISENTO-03 Capital de apólices de seguro ou pecúlio pago por morte do segurado, prêmio de seguro restituído e pecúlio de previdência privada por morte ou invalidez permanente
- Onde: Isentos, pág. 80
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ e nome da fonte pagadora (inferido, padrão da ficha); Valor
- Validações conhecidas: pecúlio de previdência complementar isento apenas se pago em parcela única por morte ou invalidez permanente do participante
- Exige do MCP: CRUD; orientação

## F-ISENTO-04 Indenizações por rescisão de contrato de trabalho, inclusive PDV, e por acidente de trabalho; e FGTS
- Onde: Isentos, pág. 81
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Valor
- Validações conhecidas: inclui indenização e aviso prévio não trabalhado até limite legal/dissídio, verbas de PDV, indenização por acidente de trabalho, saque de FGTS. Não incluir verbas rescisórias (13º, saldo de salário, férias proporcionais, abono, gratificações, aviso prévio trabalhado, PLR) nem direitos adquiridos antes do PDV (resgate de previdência complementar)
- Exige do MCP: CRUD; orientação de segregação de verbas do TRCT

## F-ISENTO-05 Ganho de capital em alienação de bens de pequeno valor (até R$ 20.000,00 ações em mercado de balcão; R$ 35.000,00 demais casos, por mês)
- Onde: Isentos, págs. 82 e 83
- Campos: "Valor informado pelo contribuinte" (campo da esquerda, editável); "Valor transportado pelo programa" (campo da direita, vindo do GCAP)
- Validações conhecidas: limite mensal de alienação para o conjunto de bens da mesma natureza: R$ 20.000,00 (ações no mercado de balcão) e R$ 35.000,00 (demais). Valor isento = valor de alienação menos custo de aquisição da DIRPF 2025 (AC 2024) mais parcelas pagas em 2025
- Regras de cálculo afetadas: total de isentos
- Importações: GCAP (opcional, operação dispensada) transporta o valor
- Exige do MCP: campo duplo (manual + transportado); cálculo auxiliar do ganho isento; checagem do limite mensal por natureza

## F-ISENTO-06 Ganho de capital na alienação do único imóvel por até R$ 440.000,00, sem outra alienação de imóvel nos últimos 5 anos
- Onde: Isentos, pág. 84
- Campos: Valor informado pelo contribuinte; Valor transportado pelo programa
- Validações conhecidas: único imóvel; valor de venda até R$ 440.000,00; sem outra alienação de imóvel em 5 anos. Valor = venda menos custo (DIRPF 2025) mais parcelas pagas em 2025, se positivo
- Importações: GCAP (inclusive redução de imóvel adquirido em moeda estrangeira até 1988)
- Exige do MCP: campo duplo; validação dos três requisitos (perguntas ao usuário); cálculo auxiliar

## F-ISENTO-07 Ganho de capital na venda de imóveis residenciais para aquisição em 180 dias de imóveis residenciais no Brasil e redução sobre o ganho de capital
- Onde: Isentos, pág. 85
- Campos: Valor informado pelo contribuinte; Valor transportado pelo programa
- Validações conhecidas: abrange ganho de imóveis adquiridos até 1969; terra nua (diferença quando ganho apurado pelo Diat); redução para imóveis adquiridos até 1988; fatores de redução do art. 40 da Lei nº 11.196/2005; ganho na venda de imóvel residencial com aplicação em 180 dias em outro residencial no Brasil; redução de imóvel adquirido em moeda estrangeira até 1988. Preencher manual só se dispensado do GCAP
- Importações: GCAP
- Exige do MCP: campo duplo; cálculo de fatores de redução (FR1/FR2, inferido), percentual de redução até 1988; controle do prazo de 180 dias

## F-ISENTO-08 Ganho de capital na alienação de moeda estrangeira em espécie com total anual até US$ 5,000.00
- Onde: Isentos, pág. 86
- Campos: Valor (informado pelo contribuinte)
- Validações conhecidas: total de alienações no ano convertido em dólar (cotação da autoridade monetária do país emissor na data de cada alienação) até US$ 5.000,00
- Importações: NÃO é transportado pelo programa (GCAP não transporta); informar manualmente
- Exige do MCP: CRUD; cálculo/checagem do limite em US$

## F-ISENTO-09 Lucros e dividendos recebidos
- Onde: Isentos, pág. 87
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Validações conhecidas: lucros apurados a partir de 1996 distribuídos em 2025 por PJ do lucro real, presumido ou arbitrado. Não informar aqui lucros de PJ no exterior nem rendimentos de aplicações/controladas no exterior (Lei nº 14.754/2023), que vão na ficha Bens e Direitos
- Importações: pode ser lançado a partir de Bens e Direitos, grupo 03, código 01 (Ações)
- Exige do MCP: CRUD; vínculo opcional ao bem; alerta de exterior

## F-ISENTO-10 Parcela isenta de proventos de aposentadoria, reserva remunerada, reforma e pensão de declarante com 65 anos ou mais
- Onde: Isentos, págs. 88 a 92
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor (anual, sem 13º); 13º salário
- Validações conhecidas: limite mensal R$ 1.903,98 (janeiro a dezembro, a partir do mês em que completou 65 anos), independentemente do número de fontes. Limite anual R$ 22.847,76 (12 x 1.903,98) para o campo Valor (somado entre fontes) e R$ 1.903,98 para o 13º. Se exceder, pergunta "Deseja transferir os valores excedentes para a ficha Rendimentos Tributáveis Recebidos de Pessoa Jurídica?": SIM separa e cria lançamento com o excedente na ficha Rendimentos Tributáveis PJ (rendimento e 13º); NÃO gera pendência de limite de isenção ultrapassado. 13º isento limitado a R$ 1.903,98 por fonte pagadora; excedente da soma dos 13º isentos de várias fontes vai na linha 99. Se 13º = 0 com valor, aviso "campo Valor não deve conter o 13º salário isento" e pergunta "Deseja alterar os valores informados conforme tabela acima?". Não há vínculo entre o lançamento isento e o tributável criado (alterar um não afeta o outro). Fapi não tem parcela isenta (tributável integral, ajuste ou exclusiva Lei 11.053/2004)
- Regras de cálculo afetadas: total isentos; possível transferência para rendimentos tributáveis PJ (base de cálculo). Estimativa do 13º isento quando não disponível: A/13 (ano inteiro) ou A/(14 menos mês de início da isenção) se começou no ano (mês diferente de janeiro); valor anual = A menos 13º
- Exige do MCP: CRUD; validação de limites por soma de fontes; ação de segregação automática do excedente; calculadora de separação 13º/anual; checagem de idade pela data de nascimento (inferido)

## F-ISENTO-11 Pensão, proventos de aposentadoria, reserva ou reforma por moléstia grave ou aposentadoria/reforma por acidente em serviço
- Onde: Isentos, págs. 93 e 94
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Rendimento; IRRF; 13º salário (valor líquido do comprovante); IRRF sobre o 13º salário; Contribuição previdenciária oficial
- Validações conhecidas: moléstias: fibrose cística, tuberculose ativa, alienação mental, esclerose múltipla, neoplasia maligna, cegueira (inclusive monocular), hanseníase, paralisia irreversível e incapacitante, hepatopatia grave, cardiopatia grave, Parkinson, espondiloartrose anquilosante, nefropatia grave, Paget avançado, contaminação por radiação, Aids; acidente em serviço ou moléstia profissional. Início da isenção: mês da concessão (doença preexistente), mês do laudo (doença posterior) ou data em que a doença foi contraída conforme laudo. Laudo de serviço médico oficial. Ato Declaratório PGFN nº 5/2016 dispensa contemporaneidade dos sintomas
- Regras de cálculo afetadas: soma IRRF + IRRF 13º do titular vai para Imposto Pago/Retido linha 04; dos dependentes para linha 05 (imposto retido compensável no ajuste)
- Exige do MCP: CRUD; transporte de IRRF para Imposto Pago/Retido; relação com campo "doença grave" da Identificação (inferido)

## F-ISENTO-12 Rendimentos de caderneta de poupança, letras hipotecárias, LCA, LCI, CRA e CRI
- Onde: Isentos, pág. 95
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Importações: pode ser lançado a partir de Bens e Direitos grupo 04, código 01 (Depósito em conta poupança) e código 03 (Títulos isentos: LCI, LCA, CRI, CRA, LIG, Debêntures de Infraestrutura e outros)
- Exige do MCP: CRUD; vínculo ao bem; navegação "Visualizar Bem/Direito Associado"

## F-ISENTO-13 Rendimento de sócio ou titular de ME/EPP optante pelo Simples Nacional, exceto pró-labore, aluguéis e serviços prestados
- Onde: Isentos, pág. 96
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Validações conhecidas: isenção limitada aos percentuais de presunção do IRPJ (art. 15 da Lei nº 9.249/1995) sobre a receita bruta anual menos o IRPJ devido no Simples; sem limite se houver escrituração contábil com lucro maior; MEI: percentuais do lucro presumido sobre receita bruta
- Exige do MCP: CRUD; calculadora auxiliar de limite (opcional)

## F-ISENTO-14 Transferências patrimoniais: doações e heranças
- Onde: Isentos, pág. 97
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ do Doador/Espólio; Nome do Doador/Espólio; Valor (bens recebidos em herança, legado, doação, inclusive adiantamento da legítima)
- Validações conhecidas: sucessão: usar o valor do bem na DIRPF 2025 (AC 2024). Transferência por valor superior ao da declaração anterior gera ganho de capital (tributação no GCAP do transmitente). Meação/dissolução usam código 19; doação/herança de não residente usam código 99
- Exige do MCP: CRUD; validação CPF/CNPJ do doador; orientação de código correto

## F-ISENTO-15 Parcela não tributável correspondente à atividade rural
- Onde: Isentos, pág. 98
- Campos: nenhum editável (valor transportado)
- Importações: resultado não tributável da Atividade Rural Brasil e Exterior apurado no Demonstrativo da Atividade Rural
- Exige do MCP: cálculo no módulo de Atividade Rural e transporte automático

## F-ISENTO-16 Imposto de anos-calendário anteriores compensado judicialmente neste ano-calendário
- Onde: Isentos, pág. 99
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Valor
- Exige do MCP: CRUD

## F-ISENTO-17 75% dos rendimentos do trabalho assalariado recebidos em moeda estrangeira por servidores de autarquias ou repartições do Governo Brasileiro no exterior
- Onde: Isentos, pág. 100
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Regras de cálculo afetadas: conversão: moeda para dólar pela autoridade monetária do país na data do recebimento; dólar para real pela cotação de compra do Bacen do último dia útil da 1ª quinzena do mês anterior ao recebimento. Os 25% restantes são tributáveis (inferido; vão na ficha PF/Exterior)
- Exige do MCP: CRUD; conversor cambial com tabela de cotações (Tabela de Conversão do Dólar 2025)

## F-ISENTO-18 Incorporação de reservas ao capital / Bonificações em ações
- Onde: Isentos, pág. 101
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Observações: conforme comprovante da emissora ou agente de custódia; reflexo no custo das ações em Bens e Direitos (inferido)
- Exige do MCP: CRUD

## F-ISENTO-19 Transferências patrimoniais: meação e dissolução da sociedade conjugal e da unidade familiar
- Onde: Isentos, pág. 102
- Campos: Tipo de beneficiário; CPF/nome do dependente; Valor (não há fonte pagadora na descrição da Ajuda)
- Validações conhecidas: usar valor do bem na DIRPF 2025 (AC 2024); transferência por valor superior gera ganho de capital; doações e heranças vão no código 14
- Exige do MCP: CRUD

## F-ISENTO-20 Ganhos líquidos em ações no mercado à vista em bolsa, alienações até R$ 20.000,00 por mês para o conjunto de ações
- Onde: Isentos, pág. 103
- Campos: Tipo de beneficiário; CPF/nome do dependente; Valor
- Validações conhecidas: limite de alienação mensal R$ 20.000,00 para o conjunto de ações. Não se aplica a day trade, cotas de ETF de ações, resgate de fundos/clubes de ações, exercício de opções, termo
- Importações: relação com Demonstrativo de Renda Variável (inferido; a Ajuda manda informar o valor)
- Exige do MCP: CRUD; calculadora mensal de vendas de ações e verificação do limite

## F-ISENTO-21 Ganhos líquidos em operações com ouro ativo financeiro, alienações até R$ 20.000,00 por mês
- Onde: Isentos, pág. 104
- Campos: Tipo de beneficiário; CPF/nome do dependente; Valor
- Exige do MCP: CRUD; checagem do limite mensal

## F-ISENTO-22 Recuperação de prejuízos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro)
- Onde: Isentos, pág. 105
- Campos: nenhum editável (transportado)
- Regras de cálculo afetadas: prejuízo acumulado de anos anteriores usado para reduzir ganho neste ano
- Importações: Demonstrativo de Renda Variável (prejuízo compensado)
- Exige do MCP: cálculo no módulo Renda Variável e transporte

## F-ISENTO-23 Rendimento bruto, até 90%, de transporte de carga e serviços com trator, máquina de terraplenagem, colheitadeira e assemelhados
- Onde: Isentos, pág. 106
- Campos: Valor (beneficiário e fonte, inferido pelo padrão)
- Validações conhecidas: limitado a 90% do rendimento bruto; presume-se consumido, não justifica acréscimo patrimonial
- Regras de cálculo afetadas: os 10% tributáveis vão para as fichas de rendimentos tributáveis (inferido); não entra na evolução patrimonial justificável
- Exige do MCP: CRUD; cálculo da parcela isenta/tributável; flag "não justifica acréscimo patrimonial"

## F-ISENTO-24 Rendimento bruto, até 40%, de transporte de passageiros
- Onde: Isentos, pág. 107
- Campos: Valor
- Validações conhecidas: limitado a 40% do rendimento bruto; presume-se consumido, não justifica acréscimo patrimonial
- Exige do MCP: CRUD; cálculo 40%/60%

## F-ISENTO-25 Restituição do imposto sobre a renda de anos-calendário anteriores
- Onde: Isentos, pág. 108
- Campos: Valor (beneficiário, inferido)
- Exige do MCP: CRUD; possível importação de restituições recebidas da pré-preenchida (inferido)

## F-ISENTO-27 Juros referentes aos Rendimentos Recebidos Acumuladamente
- Onde: Isentos, pág. 109
- Campos: nenhum editável (transportado)
- Importações: campo "Valor recebido referente a juros" da ficha RRA (titular e dependentes)
- Exige do MCP: transporte automático a partir de F-RRA

## F-ISENTO-28 Pensão Alimentícia
- Onde: Isentos, pág. 110
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF do Alimentante (quem pagou); Valor
- Validações conhecidas: isenção só para pensão alimentícia (ADI nº 5422/DF), não para pensão por morte. Beneficiário é o indicado na ação judicial ou escritura, mesmo menor ou incapaz, ainda que pago ao responsável legal; inclui alimentos provisionais e pagamentos via PJ
- Observações: novidade desde ADI 5422; antes era tributável (carnê-leão)
- Exige do MCP: CRUD; validação de CPF do alimentante

## F-ISENTO-99 Outros
- Onde: Isentos, págs. 111 a 113
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Descrição; Valor
- Validações conhecidas (lista de enquadramentos): sinistro/furto/roubo menos custo do bem; pensões de portador de deficiência mental; proventos de ex-combatente da FEB; PIS/Pasep; desapropriação de terra nua para reforma agrária menos custo; seguro-desemprego, auxílios natalidade, doença, funeral, acidente; contribuições de 1989 a 1995 resgatadas de previdência complementar, PGBL e Fapi; indenização de anistiados/desaparecidos políticos (Lei 10.559/2002); quotas parlamentares; variação cambial de depósitos não remunerados no exterior; bolsas do art. 19 da Lei 12.871/2013 e art. 16 da Lei 11.129/2005; pensão especial da Talidomida; créditos de ICMS/ISS de programas de nota fiscal (prêmios de sorteio são exclusivos 30%); vale-cultura; doação/herança/pensão isentas recebidas de não residente; juros de mora de remuneração (exceto RRA, que vão na ficha RRA); excesso de 13º isento 65 anos de mais de uma fonte; outros isentos previstos em lei. Diárias e ajuda de custo de remoção não justificam acréscimo patrimonial; garimpeiros até 90% presumidos consumidos
- Importações: pode ser lançado a partir de Bens e Direitos grupo 07, códigos 02 (Fiagro) e 03 (FII), rendimentos isentos de cotas
- Exige do MCP: CRUD com descrição livre; vínculo a bem; catálogo de enquadramentos para orientação

---

## F-EXCL Rendimentos Sujeitos à Tributação Exclusiva/Definitiva (ficha)
- Onde: Fichas da Declaração > Rendimentos Sujeitos à Tributação Exclusiva/Definitiva; págs. 114 a 120
- Aplica-se a: todos; mesmos recortes de período de Final de Espólio e Saída Definitiva
- Estrutura: Aba "Rendimentos" (Novo, Editar, Excluir, seleção de Tipo de Rendimento, Ok/Cancelar); Aba "Totais" (somatório por código)
- Códigos: 01 a 13 e 99 (o código 13 consta no corpo da Ajuda, não no índice)
- Regras de cálculo afetadas: não entra na base de cálculo do ajuste; compõe total de rendimentos tributáveis exclusivamente na fonte no Resumo (Outras Informações) e justifica patrimônio
- Importações: 01 e 08 da ficha Rendimentos PJ (campo 13º); 02, 03, 04 do GCAP; 05 da Renda Variável e FII/Fiagro; 07 e 09 da ficha RRA (opção exclusiva); 12 da ficha Bens e Direitos (Lei 14.754/2023); 06 e 10 podem vir de Bens e Direitos
- Exige do MCP: CRUD por código; transportes automáticos; aba de totais

## F-EXCL-01 13º salário
- Campos: nenhum editável (transportado)
- Importações: campo 13º salário da ficha Rendimentos Tributáveis Recebidos de PJ pelo Titular
- Exige do MCP: transporte automático

## F-EXCL-02 Ganhos de capital na alienação de bens e/ou direitos
- Campos: transportado
- Importações: GCAP 2025, inclusive ganhos na integralização de capital de PJ por valor superior ao declarado, sucessão e doação em adiantamento da legítima por valor superior ao da DIRPF 2025, e dissolução conjugal/união estável quando o bem é incluído por valor superior à Situação em 31/12/2024 do cônjuge
- Exige do MCP: cálculo GCAP e transporte

## F-EXCL-03 Ganhos de capital na alienação de bens, direitos e aplicações financeiras adquiridos em moeda estrangeira
- Campos: transportado
- Importações: GCAP 2025
- Exige do MCP: cálculo GCAP moeda estrangeira e transporte

## F-EXCL-04 Ganhos de capital na alienação de moeda estrangeira em espécie
- Campos: transportado
- Importações: GCAP 2025
- Exige do MCP: cálculo GCAP espécie e transporte

## F-EXCL-05 Ganhos líquidos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro)
- Campos: transportado
- Regras de cálculo afetadas: ganhos líquidos menos o imposto pago
- Importações: Demonstrativo de Renda Variável (comuns e day trade) e Operações em FII ou Fiagro
- Exige do MCP: cálculo mensal RV/FII e transporte

## F-EXCL-06 Rendimentos de aplicações financeiras
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor (líquido: rendimento menos imposto)
- Validações conhecidas: renda fixa, FIF, fundos de cotas, fundos de ações, swap
- Importações: pode ser lançado a partir de Bens e Direitos: grupo 04 código 02 (Tesouro Direto, CDB, RDB e outros); grupo 07 códigos 01 (come-cotas Lei 14.754/2023), 02 (Fiagro), 03 (FII), 04 (FIA e Fundos Mútuos de Privatização FGTS), 06 (FIP, FIDC entidade de investimento, ETF entidade de investimento), 07 (FIP-IE e FIP-PD&I), 08 (ETF de renda fixa), 10 (Fundos de Infraestrutura, FIDC e outros alíquota 0%)
- Exige do MCP: CRUD; vínculo a bem

## F-EXCL-07 Rendimentos recebidos acumuladamente (titular)
- Campos: transportado
- Regras de cálculo afetadas: total de rendimentos recebidos menos contribuição previdenciária oficial, pensão alimentícia e IRRF, da ficha RRA do titular com opção "Exclusiva na Fonte"
- Exige do MCP: transporte a partir de F-RRA-TIT

## F-EXCL-08 13º salário recebido pelos dependentes
- Campos: transportado
- Importações: campo 13º salário da ficha Rendimentos Tributáveis Recebidos de PJ pelos Dependentes
- Exige do MCP: transporte

## F-EXCL-09 Rendimentos recebidos acumuladamente pelos dependentes
- Campos: transportado
- Regras de cálculo afetadas: idem F-EXCL-07, da ficha RRA dos dependentes com opção exclusiva
- Exige do MCP: transporte a partir de F-RRA-DEP

## F-EXCL-10 Juros sobre capital próprio
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Importações: pode ser lançado a partir de Bens e Direitos grupo 03 código 01 (Ações)
- Exige do MCP: CRUD; vínculo a bem

## F-EXCL-11 Participação nos lucros ou resultados da empresa (PLR)
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Exige do MCP: CRUD

## F-EXCL-12 Aplicações Financeiras e Lucros e Dividendos no Exterior (Lei 14.754/2023)
- Campos: transportado
- Regras de cálculo afetadas: rendimentos líquidos informados nos campos específicos da ficha Bens e Direitos (aplicações financeiras e lucros/dividendos de entidades no exterior). A apuração anual do imposto de 15% ocorre no Resumo (inferido, conferir com F-BENS-ESP)
- Exige do MCP: transporte a partir de Bens e Direitos exterior

## F-EXCL-13 Prêmios líquidos obtidos em loterias de apostas de quota fixa (Lei 14.790/2023)
- Campos: Tipo de beneficiário; CPF/nome do dependente; Descrição; Valor (saldos das contas gráficas do apostador conforme comprovantes dos agentes operadores de apostas)
- Observações: código presente no corpo da Ajuda e ausente do índice da seção; provável novidade recente
- Exige do MCP: CRUD

## F-EXCL-99 Outros
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Descrição; Valor (líquido)
- Validações conhecidas (enquadramentos): prêmios de loterias, sorteios, concursos, corridas de cavalos e programas de nota fiscal; amortização antecipada por sorteio de títulos de capitalização; participação de portadores de títulos de capitalização nos lucros; benefícios e resgates de previdência complementar e VGBL com opção pela tabela regressiva (arts. 1º e 2º da Lei 11.053/2004); outros exclusivos na fonte
- Exige do MCP: CRUD com descrição

---

## F-SUSP Rendimentos Tributáveis de PJ (Imposto com Exigibilidade Suspensa)
- Onde: Fichas da Declaração; págs. 121 a 124. Duas abas: Titular e Dependentes
- Aplica-se a: todos; recortes de período de Final de Espólio e Saída Definitiva
- Exige do MCP: CRUD nas duas abas; totalizadores para o Resumo
- Observações: dados meramente informativos, não somados aos rendimentos tributáveis na apuração

## F-SUSP-TIT Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) - Titular
- Onde: aba Titular, pág. 122
- Campos: Nome da fonte pagadora; CPF/CNPJ da fonte pagadora; Rendimentos tributáveis (imposto com exigibilidade suspensa); Depósitos judiciais do imposto
- Validações conhecidas: fonte obtida do comprovante; sem comprovante, usar contracheques ou recibos. Botões Novo, Editar, Excluir (exclusão múltipla), Ok
- Regras de cálculo afetadas: rendimentos e depósitos judiciais transportados ao Resumo (Outras Informações), sem entrar no cálculo do imposto
- Exige do MCP: CRUD; totais informativos

## F-SUSP-DEP Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) - Dependentes
- Onde: aba Dependentes, pág. 123
- Campos: Dependente (seleção entre os da ficha Dependentes); Nome e CPF/CNPJ da fonte; Rendimentos tributáveis; Depósitos judiciais do imposto
- Validações conhecidas: dependente precisa estar cadastrado antes na ficha Dependentes
- Regras de cálculo afetadas: idem titular, informativo
- Exige do MCP: CRUD; validação de dependente

---

## F-RRA Rendimentos Recebidos Acumuladamente (ficha)
- Onde: Fichas da Declaração; págs. 125 a 134. Abas Titular e Dependentes
- Aplica-se a: todos; recortes de período de Final de Espólio e Saída Definitiva
- Regras gerais: RRA de anos anteriores a 2025 sujeitos à tabela progressiva, inclusive decisões das Justiças do Trabalho, Federal, Estaduais e DF. Regra geral é tributação exclusiva na fonte; opção irretratável pelo ajuste anual, individual por titular e por dependente, deve refletir o total recebido por cada um e ser a mesma para todos os RRA de um mesmo contribuinte. A opção só pode ser alterada até 29/05/2026; exceção: se a fonte não reteve conforme IN RFB 1.500/2014 ou reteve a maior, pode mudar para exclusiva mesmo após 29/05/2026
- Não declarar aqui RRA do próprio ano-calendário (vão na ficha da natureza, sujeitos a ajuste, salvo 13º)
- Despesas judiciais e honorários: proporcionalizar entre tributável e isento; lançar em Pagamentos Efetuados código 60 (honorários de ações judiciais, exceto trabalhistas) ou 61 (ações trabalhistas), com nome e CPF/CNPJ do advogado/escritório e valor
- Parcela isenta incluída no RRA: lançar nas linhas da ficha Isentos, exceto parcela isenta 65 anos (campo próprio na ficha RRA) e juros de mora (campo próprio, transportado para Isentos código 27)
- Exige do MCP: CRUD nas duas abas; cálculo do imposto exclusivo por tabela acumulada; transportes; validação de opção uniforme

## F-RRA-TIT Rendimentos Tributáveis de PJ Recebidos Acumuladamente pelo Titular
- Onde: aba Titular, págs. 126 a 132
- Campos: Opção pela forma de tributação (Ajuste Anual ou Exclusiva na Fonte); Nome da fonte pagadora; CPF/CNPJ da fonte pagadora; Rendimentos tributáveis (inclui acréscimos e 13º, exceto juros de mora); Parcela isenta 65 anos; Valor recebido referente a juros; Contribuição previdenciária oficial; Pensão alimentícia; Imposto retido na fonte; Mês do recebimento; Número de meses
- Validações conhecidas: opção igual para todos os RRA do titular; prazo de alteração 29/05/2026 (exceções acima); 13º recebido acumuladamente conta como 1 mês; com opção exclusiva não há parcela isenta 65 anos (o valor é somado aos rendimentos tributáveis para formar "Total Rendimentos Tributáveis"); várias fontes: apuração separada por fonte e por mês, unificada quando a mesma fonte paga mais de uma vez no mesmo mês; RRA complementar: opção independente se o RRA original foi de ano anterior, igual se do mesmo ano; sucessão causa mortis: mesmo número de meses do de cujus por sucessor, opção independente para parcelas em ano posterior
- Regras de cálculo afetadas:
  - Ajuste Anual: rendimentos entram na base de cálculo da DAA; IRRF é antecipação (vai para imposto retido, inferido).
  - Exclusiva na Fonte: imposto = tabela progressiva mensal do mês do recebimento multiplicada pelo número de meses; base = rendimentos menos pensão alimentícia judicial/escritura (art. 733 CPC) menos previdência oficial. Imposto apurado é adicionado ao imposto da DAA, com mesmos prazos e condições (ajuste específico permite restituir ou pagar diferença). Líquido (rendimentos menos previdência, pensão e IRRF) vai para Exclusivos código 07.
  - Parcelas em meses distintos (mesma fonte, exclusiva): meses da parcela = meses totais x (parcela / total), arredondado a 1 casa decimal com regra específica (2ª casa menor que 5 mantém; maior que 5 soma 1; igual a 5 olha a 3ª casa: 0 a 4 mantém, 5 a 9 soma 1). Exemplo da Ajuda: 44 meses, R$ 300.000,00 em 5 parcelas, resultando 19,5; 0,6; 0,6; 0,5; 22,8.
  - Parcelas no mesmo mês: soma às anteriores, recalcula base e imposto e deduz o IRRF das parcelas anteriores.
  - RRA complementar: imposto = incidente sobre o total pago (inclusive superveniente) menos retidos anteriores.
  - Juros vão para Isentos código 27.
- Exige do MCP: CRUD; calculadora de imposto RRA (tabela acumulada mensal por número de meses, com tabela do mês do recebimento); comparador ajuste x exclusiva para sugestão; arredondamento de meses; transportes para Exclusivos 07, Isentos 27 e resumo; validação de data limite da opção

## F-RRA-DEP Rendimentos Tributáveis de PJ Recebidos Acumuladamente pelos Dependentes
- Onde: aba Dependentes, págs. 133 e 134
- Campos: Tipo de dependente/Dependente (seleção); Opção pela forma de tributação; Nome e CPF/CNPJ da fonte pagadora; Rendimentos tributáveis; Parcela isenta 65 anos; Valor recebido referente a juros; Contribuição previdenciária oficial; Pensão alimentícia; Imposto retido na fonte; Mês do recebimento; Número de meses
- Validações conhecidas: mesmas do titular; abrange RRA de PJ e de PF (texto da Ajuda); opção individual por dependente
- Regras de cálculo afetadas: idem titular; líquido exclusivo vai para Exclusivos código 09
- Exige do MCP: CRUD; mesma calculadora; validação de dependente cadastrado

---

## F-IMPPAGO Imposto Pago/Retido (ficha)
- Onde: Fichas da Declaração > Imposto Pago/Retido; págs. 135 e 136
- Aplica-se a: todos (inferido)
- Exige do MCP: edição das linhas 01, 02, 03; cálculo automático das linhas 04 a 07; limite de compensação do imposto do exterior no Resumo

## F-IMPPAGO-01 Linha 01: Imposto Complementar
- Campos: Valor (Darf código 0246 pago de 01/01/2025 a 31/12/2025)
- Validações conhecidas: recolhimento facultativo para antecipar o imposto do ajuste quando há duas ou mais fontes (PF e PJ ou mais de uma PJ)
- Regras de cálculo afetadas: dedução do imposto devido (imposto pago)
- Exige do MCP: campo editável

## F-IMPPAGO-02 Linha 02: Imposto pago no exterior pelo titular e pelos dependentes
- Campos: Valor
- Validações conhecidas: compensável só se relativo a rendimentos informados em "Outras Informações", coluna Exterior, da ficha Rendimentos Tributáveis de PF e do Exterior; país com acordo ou reciprocidade, imposto não restituível/compensável no país de origem. Países listados: África do Sul, Argentina, Áustria, Bélgica, Canadá, Chile, China, Coreia do Sul, Dinamarca, Emirados Árabes Unidos, Equador, Eslováquia, Espanha, Filipinas, Finlândia, França, Hungria, Índia, Israel, Itália, Japão, Luxemburgo, México, Noruega, Países Baixos (Holanda), Peru, Portugal, República Tcheca, Rússia, Singapura, Suécia, Suíça, Trinidad e Tobago, Turquia, Ucrânia, Uruguai, Venezuela. Reciprocidade sem prova: Alemanha, Estados Unidos e Reino Unido. Reciprocidade não alcança tributos estaduais e municipais. País sem acordo/reciprocidade: rendimento informado, imposto não compensável
- Regras de cálculo afetadas: limite de compensação = imposto apurado com rendimentos do exterior menos imposto apurado sem eles; o Resumo mostra o valor limitado, enquanto a ficha mantém o valor digitado. Conversão: moeda para dólar (autoridade monetária do país, data do recebimento) e dólar para real (compra Bacen, último dia útil da 1ª quinzena do mês anterior)
- Exige do MCP: campo editável; cálculo do limite (dois cálculos do imposto); tabela de países com acordo/reciprocidade; conversor cambial

## F-IMPPAGO-03 Linha 03: Imposto sobre a renda na fonte (Lei nº 11.033/2004)
- Campos: Valor
- Validações conhecidas: IR fonte de §§ 1º e 2º, inciso II, art. 2º da Lei 11.033/2004 (o "dedo-duro" de 0,005% em operações de bolsa, inferido), retido no período, desde que não deduzido do imposto sobre ganhos líquidos do mês, não compensado em meses seguintes nem com ganho de capital em alienação de ações
- Regras de cálculo afetadas: imposto pago/retido no ajuste; relação com o saldo "IR fonte (Lei 11.033/2004) a compensar" do Demonstrativo de Renda Variável (inferido)
- Exige do MCP: campo editável; conferência com saldo da Renda Variável

## F-IMPPAGO-04 Linha 04: Imposto retido na fonte do titular
- Campos: calculado
- Regras de cálculo afetadas: soma do IRRF do titular na ficha Rendimentos Tributáveis PJ Titular mais "IRRF" e "IRRF sobre 13º" do código 11 de Isentos (titular)
- Exige do MCP: cálculo automático

## F-IMPPAGO-05 Linha 05: Imposto retido na fonte dos dependentes
- Campos: calculado
- Regras de cálculo afetadas: soma do IRRF da ficha Rendimentos Tributáveis PJ Dependentes mais IRRF e IRRF 13º do código 11 de Isentos (dependentes)
- Exige do MCP: cálculo automático

## F-IMPPAGO-06 Linha 06: Carnê-Leão do titular
- Campos: calculado
- Importações: total do imposto pago de Carnê-Leão do titular na ficha Rendimentos Tributáveis de PF e do Exterior pelo Titular (Darf 0190, inclusive importação do Carnê-Leão Web)
- Exige do MCP: cálculo automático

## F-IMPPAGO-07 Linha 07: Carnê-Leão dos dependentes
- Campos: calculado
- Importações: total do imposto pago de Carnê-Leão dos dependentes na ficha PF/Exterior pelos Dependentes
- Exige do MCP: cálculo automático
- Observações: a Ajuda não cita aqui o IRRF de RRA com opção pelo ajuste nem o imposto pago de GCAP/RV, que não entram nesta ficha (inferido: IRRF de RRA no ajuste compõe imposto retido no Resumo; conferir no bloco F-RESUMO)
