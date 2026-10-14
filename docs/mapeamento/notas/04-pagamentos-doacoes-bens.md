# Notas 04: Pagamentos Efetuados, Doações Efetuadas, Doações Diretamente na Declaração e Bens e Direitos (regras gerais)

Fonte: AjudaIRPF.pdf do IRPF 2026 versão 1.5 (texto em ajuda.txt, linhas 5716 a 8724; páginas 137 a 203 de 425). Complementos: tabelas "Códigos de Pagamentos" e "Códigos de Doações" (pág. 363 e 364), "Como fazer para" (pág. 391) e "Perguntas mais Frequentes" (pág. 405 e 406), indicados no próprio bloco.

---

## F-PAG Pagamentos Efetuados (ficha)
- Onde: Fichas da Declaração > Pagamentos Efetuados; págs. 137 a 142; botões Novo, Editar, Excluir, OK; rodapé com "Importar arquivo do plano de saúde" (atalho Alt+I)
- Aplica-se a: todos. Final de Espólio: de 1º/01 até a data da decisão judicial da partilha, sobrepartilha ou adjudicação ou da lavratura da escritura (ano todo se ainda houver bens a inventariar que gerem rendimentos). Saída Definitiva: de 1º/01 até o dia anterior ao da caracterização da condição de não residente.
- Campos (por lançamento): Código (tabela de pagamentos); Despesa realizada com (Titular, Dependente ou Alimentando, conforme o código); Dependente ou Alimentando (seleção entre os já cadastrados nas fichas Dependentes e Alimentandos); Nome do beneficiário; CPF ou CNPJ do beneficiário; NIT do empregado doméstico (campo NR_NIT_EMP_DOM no layout, inferido); Descrição; Valor pago; Parcela não dedutível/valor reembolsado; Contribuição do ente público patrocinador (só código 37)
- Validações conhecidas:
  - Relacionar todos os pagamentos a pessoas físicas (pensão, aluguéis, arrendamento rural, instrução, autônomos: médicos, dentistas, psicólogos, advogados, engenheiros, arquitetos, corretores, professores, mecânicos etc.) e a pessoas jurídicas quando dedutíveis.
  - Falta de informação sujeita à multa de 20% do valor não declarado.
  - Códigos 01, 02, 09 a 22 e 26: informar se a despesa é do titular, dependente ou alimentando.
  - Códigos 30, 31, 33 e 34: informar o nome do alimentando; 30 e 33: CPF do alimentando obrigatório.
  - Códigos 36, 37 e 99: informar se é do titular ou dependente.
  - Códigos 60, 61, 62, 66, 70, 71, 72 e 76: não exigem indicação do CPF do titular ou dependente (pode ir na descrição).
  - Beneficiário residente ou domiciliado no Brasil: CPF ou CNPJ obrigatório conforme a tabela; CPF/CNPJ ausente ou inválido impede a gravação da declaração (Erros mais Frequentes, pág. 424).
  - Dependente ou alimentando precisa existir antes na ficha correspondente; as despesas só são consideradas se o dependente ou alimentando for indicado (FAQ pág. 406).
  - Excluir apaga todos os campos da linha.
  - Autônomos, leiloeiros, titulares de serviços notariais e de registro e quem explora atividade rural estão dispensados de informar aqui as despesas escrituradas em livro Caixa.
  - Comprovantes guardados até a prescrição.
- Códigos: 01, 02, 09 a 22, 26, 30, 31, 33, 34, 36, 37, 60, 61, 62, 66, 70, 71, 72, 76, 99 (detalhe nos blocos F-PAG-xx)
- Regras de cálculo afetadas: deduções do Resumo (instrução limitada, médicas sem limite, pensão, previdência complementar limitada a 12%); códigos sem efeito de dedução (60 a 99) são informativos
- Importações/exportações: declaração 2025 traz nome e CPF/CNPJ dos beneficiários (pág. 396); pré-preenchida traz pagamentos (Dmed, Carnê-Leão de profissionais); Informe de Plano de Saúde (XML) cria lançamentos de código 26 com reembolsos; exclusão de dependente apaga automaticamente seus pagamentos
- Exige do MCP: CRUD de pagamentos com schema condicional por código; validação de CPF/CNPJ por código; vínculo com dependente/alimentando; importação de informe de plano de saúde; cálculo das deduções no Resumo; aviso de multa de 20% por omissão
- Observações: o FAQ cita os códigos 01, 02, 09 a 22, 26, 36, 37 e 99 como os que exibem o quadro de dependentes

## F-PAG-INSTR Despesas com Instrução (regras comuns aos códigos 01 e 02)
- Onde: Pagamentos Efetuados; págs. 143 e 144
- Aplica-se a: todos (deduções legais)
- Campos: Código 01 ou 02; Titular/Dependente/Alimentando; Nome da instituição de educação; CNPJ da instituição (se domiciliada no Brasil); Descrição; Valor pago; Parcela não dedutível/valor reembolsado
- Validações conhecidas:
  - Dedutíveis: educação infantil (creches e pré-escolas); ensino fundamental; ensino médio; educação superior (graduação, mestrado, doutorado, especialização); educação profissional (técnico e tecnológico).
  - Não dedutíveis: uniforme, material e transporte escolar, elaboração de dissertação; enciclopédias, livros, revistas e jornais; aulas particulares; música, dança, natação, ginástica, tênis, pilotagem, dicção, corte e costura, informática e assemelhados; cursinhos preparatórios para concursos e vestibulares; idiomas; contribuições a entidades que criem e eduquem menores desvalidos; associações de pais e mestres e associações voltadas à educação; passagens e estadas para estudo.
  - Alimentando só com decisão judicial, acordo homologado ou escritura pública (art. 733 CPC).
  - Informar o valor total pago a cada instituição, mesmo acima do limite.
  - Declaração em separado: cada cônjuge só deduz despesas dos dependentes e alimentandos indicados na própria declaração; o cônjuge que inclui o filho como dependente pode deduzir mesmo com recibo em nome do outro.
- Códigos: 01 instrução no Brasil (CNPJ obrigatório); 02 instrução no exterior (sem CPF/CNPJ)
- Regras de cálculo afetadas: transportado ao Resumo: (pago menos reembolsado/não dedutível) limitado a R$ 3.561,50 para o titular, para cada dependente e para cada alimentando; excesso de uma pessoa não compensa outra
- Exige do MCP: cálculo do limite por pessoa; alerta de despesas não dedutíveis por palavras-chave da descrição (inferido)

## F-PAG-01 Código 01, Despesas com instrução no Brasil
- Campos: titular/dependente/alimentando; nome da instituição; CNPJ (obrigatório); descrição; valor pago; parcela não dedutível
- Regras: ver F-PAG-INSTR
- Exige do MCP: validação de CNPJ

## F-PAG-02 Código 02, Despesas com instrução no exterior
- Campos: titular/dependente/alimentando; nome da instituição; descrição; valor pago; parcela não dedutível (sem CPF/CNPJ)
- Regras: ver F-PAG-INSTR; conversão em moeda estrangeira pela cotação de venda (pág. 147, por analogia, inferido)
- Exige do MCP: conversor de câmbio (venda)

## F-PAG-MED Despesas Médicas (regras comuns aos códigos 09 a 22 e 26)
- Onde: Pagamentos Efetuados; págs. 145 a 147
- Aplica-se a: todos (deduções legais)
- Campos: Código; Titular/Dependente/Alimentando; Nome do profissional ou instituição; CPF do profissional ou CNPJ da instituição (se residente/domiciliado no Brasil); Descrição; Valor pago; Parcela não dedutível/valor reembolsado
- Validações conhecidas:
  - Dedutíveis (próprio, dependentes e alimentandos por decisão judicial, acordo homologado ou escritura): médicos, dentistas, psicólogos, fisioterapeutas, terapeutas ocupacionais, fonoaudiólogos, hospitais, exames laboratoriais, serviços radiológicos, aparelhos e próteses ortopédicas e dentárias (pernas e braços mecânicos, cadeira de rodas, andadores, palmilhas e calçados ortopédicos, aparelhos para desvio de coluna ou defeitos de membros/articulações; parafusos, placas, marcapasso e lente intraocular se na conta hospitalar); planos de saúde de empresas domiciliadas no Brasil; estabelecimento geriátrico qualificado como hospital; estabelecimentos especializados na instrução de pessoa com deficiência; entidade do empregador com convênio direto.
  - Não dedutíveis: reembolsadas ou cobertas por seguro; enfermeiros e remédios fora da conta hospitalar; óculos, lentes de contato, aparelhos de surdez e similares; planos de saúde pagos no exterior.
  - Comprovação: documento com nome, endereço e CPF/CNPJ do beneficiário residente no Brasil, ou cheque nominativo; deficiência exige laudo; próteses exigem receituário e nota fiscal em nome do beneficiário.
  - Parcela não dedutível: despesas pagas pelo declarante que não sejam dele nem de dependentes/alimentandos. Valor reembolsado: reembolso do empregador sem retenção do recibo; despesas pagas por plano de saúde; auxílio-saúde ou assistência-saúde do empregador.
  - Reembolso: informar nome, CPF/CNPJ da entidade e valor do comprovante de rendimentos; se o contribuinte reembolsar a empresa, o valor reembolsado é despesa médica.
  - Moeda estrangeira: moeda para dólar pela autoridade do país na data do pagamento e dólar para real pela cotação de VENDA do Bacen do último dia útil da 1ª quinzena do mês anterior.
  - Cônjuge que inclui o filho como dependente pode deduzir mesmo com recibo em nome do outro.
- Códigos: 09, 10, 11, 12, 13, 14, 21, 26 (Brasil, CPF ou CNPJ obrigatório); 15, 16, 17, 18, 19, 20, 22 (exterior, sem CPF/CNPJ)
- Regras de cálculo afetadas: Resumo, linha Despesas médicas = total pago menos não dedutível, sem limite
- Exige do MCP: CRUD com validação de CPF/CNPJ por código; cálculo; alerta de despesas não dedutíveis (inferido); conversor de câmbio

## F-PAG-09 Código 09, Fonoaudiólogos no Brasil
- Campos: titular/dependente/alimentando; nome do profissional; CPF obrigatório; descrição; valor; parcela não dedutível
- Regras: ver F-PAG-MED

## F-PAG-10 Código 10, Médicos no Brasil
- Campos e regras: idem F-PAG-09 (CPF obrigatório)

## F-PAG-11 Código 11, Dentistas no Brasil
- Campos e regras: idem F-PAG-09 (CPF obrigatório)

## F-PAG-12 Código 12, Psicólogos no Brasil
- Campos e regras: idem F-PAG-09 (CPF obrigatório)

## F-PAG-13 Código 13, Fisioterapeutas no Brasil
- Campos e regras: idem F-PAG-09 (CPF obrigatório)

## F-PAG-14 Código 14, Terapeutas ocupacionais no Brasil
- Campos e regras: idem F-PAG-09 (CPF obrigatório)

## F-PAG-15 Código 15, Médicos no exterior
- Campos: titular/dependente/alimentando; nome do profissional; descrição; valor; parcela não dedutível (sem CPF/CNPJ)
- Regras: ver F-PAG-MED; conversão cambial pela cotação de venda

## F-PAG-16 Código 16, Dentistas no exterior
- Campos e regras: idem F-PAG-15

## F-PAG-17 Código 17, Psicólogos no exterior
- Campos e regras: idem F-PAG-15

## F-PAG-18 Código 18, Fisioterapeutas no exterior
- Campos e regras: idem F-PAG-15

## F-PAG-19 Código 19, Terapeutas ocupacionais no exterior
- Campos e regras: idem F-PAG-15

## F-PAG-20 Código 20, Fonoaudiólogos no exterior
- Campos e regras: idem F-PAG-15

## F-PAG-21 Código 21, Hospitais, clínicas e laboratórios com saúde humana no Brasil
- Campos: titular/dependente/alimentando; nome da instituição; CNPJ obrigatório; descrição; valor; parcela não dedutível
- Regras: ver F-PAG-MED

## F-PAG-22 Código 22, Hospitais, clínicas e laboratórios com saúde humana no exterior
- Campos: titular/dependente/alimentando; nome da instituição; descrição; valor; parcela não dedutível (sem CNPJ)
- Regras: ver F-PAG-MED; conversão cambial

## F-PAG-26 Código 26, Planos de saúde no Brasil
- Campos: titular/dependente/alimentando; nome da operadora; CNPJ obrigatório; descrição; valor pago; parcela não dedutível/valor reembolsado
- Validações conhecidas: plano pago no exterior não é dedutível; reembolsos e auxílio-saúde do empregador vão no valor reembolsado
- Importações: Informe de Plano de Saúde (XML: CNPJ e nome do plano, CPF do beneficiário titular/dependente/alimentando, exercício e ano-calendário, valor pago, reembolso; pág. 391); pré-preenchida (Dmed)
- Exige do MCP: importador do XML do informe (xsd informe_planos_saude.xsd); casamento do CPF do beneficiário com titular/dependentes/alimentandos; não duplicar ao reimportar (o PGD duplica, pág. 401)

## F-PAG-PENSAO Pensão alimentícia judicial ou por escritura pública (regras comuns aos códigos 30, 31, 33 e 34)
- Onde: Pagamentos Efetuados; págs. 148 e 149
- Aplica-se a: todos (deduções legais; também no RRA)
- Campos: Código; Alimentando (seleção na ficha Alimentandos; nomes de todos os alimentandos); CPF do alimentando (obrigatório se residente no Brasil); Descrição; Valor total pago no ano; Parcela não dedutível/valor reembolsado
- Validações conhecidas:
  - Dedutível só a pensão por decisão judicial (inclusive alimentos provisionais e acordo homologado) ou por escritura pública de separação/divórcio (art. 733 CPC); pensão por liberalidade não é dedutível.
  - Não informar CPF de quem recebe em nome do alimentando.
  - Despesas médicas e de instrução pagas pelo alimentante não entram aqui: vão nos códigos próprios (médicas integralmente, instrução com limite) se previstas na decisão ou escritura.
  - Pensão sobre o 13º salário: dedutível só na tributação exclusiva do 13º; informar como parcela não dedutível.
  - Separação ou divórcio em 2025 com pensão paga: somente em 2025 pode considerar o alimentando como dependente e também deduzir a pensão; fora disso, dedução de dependente e de pensão não são cumulativas, salvo mudança na relação de dependência no ano.
  - Informar todos os alimentandos mesmo que o desconto seja feito em nome de um só.
- Códigos: 30 judicial a residente; 31 judicial a não residente; 33 escritura pública a residente; 34 escritura pública a não residente
- Regras de cálculo afetadas: Resumo, linhas 7 (códigos 30 e 31) e 8 (códigos 33 e 34) das deduções
- Exige do MCP: vínculo obrigatório com F-ALIM; validação de CPF condicional; alerta de cumulação dependente x alimentando (mesmo CPF nas duas fichas)

## F-PAG-30 Código 30, Pensão alimentícia judicial paga a residente no Brasil
- Campos: alimentando; CPF do alimentando (obrigatório); descrição; valor; parcela não dedutível
- Regras: ver F-PAG-PENSAO

## F-PAG-31 Código 31, Pensão alimentícia judicial paga a não residente no Brasil
- Campos: alimentando; nome; descrição; valor; parcela não dedutível (a tabela da pág. 139 indica CPF; o texto exige CPF só para residente, dúvida)
- Regras: ver F-PAG-PENSAO

## F-PAG-33 Código 33, Pensão alimentícia por escritura pública (separação/divórcio) paga a residente no Brasil
- Campos: idem F-PAG-30 (CPF obrigatório)
- Regras: ver F-PAG-PENSAO

## F-PAG-34 Código 34, Pensão alimentícia por escritura pública paga a não residente no Brasil
- Campos: idem F-PAG-31
- Regras: ver F-PAG-PENSAO

## F-PAG-PREV Previdência Complementar e Fapi (regras comuns aos códigos 36 e 37)
- Onde: Pagamentos Efetuados; págs. 150 a 155
- Aplica-se a: todos (deduções legais)
- Validações conhecidas:
  - Dedutíveis os pagamentos do contribuinte, em seu nome e dos dependentes, a entidades de previdência complementar domiciliadas no Brasil (inclusive PGBL) e ao Fapi, com ônus da própria pessoa física.
  - Condição: também contribuir para o regime geral ou regime próprio, observada a contribuição mínima; exceção para aposentado ou pensionista de regime próprio ou geral.
  - Plano cujo titular é dependente: dedutível se o declarante contribui para regime geral ou próprio; dependente com mais de 16 anos exige também contribuição em nome do dependente.
  - Contribuições extraordinárias vão em "Parcela não dedutível" do código 36.
  - VGBL não é pagamento dedutível: vai em Bens e Direitos, grupo 99, código 06.
- Regras de cálculo afetadas: Resumo, linha 3 das deduções: códigos 36 e 37 (no 37 só o excedente à contribuição do patrocinador) limitados a 12% do total dos rendimentos tributáveis da base de cálculo (excluídos isentos e exclusivos); a parte do 37 até a contribuição do patrocinador vai na linha 1 (sem o limite de 12%). O programa aplica o limite (FAQ pág. 406).
- Exige do MCP: cálculo do limite de 12%; separação 37 patrocinador x excedente; alerta de VGBL lançado como pagamento; checagem de contribuição ao regime oficial (inferido: existência de previdência oficial nas fichas de rendimentos)

## F-PAG-36 Código 36, Previdência Complementar (inclusive Fapi)
- Campos: titular ou dependente; nome e CNPJ da entidade/seguradora/administradora do Fapi (CNPJ obrigatório); descrição; valor pago; parcela não dedutível
- Regras: ver F-PAG-PREV

## F-PAG-FAPI Fapi, Fundos de Aposentadoria Programada Individual (lançado no código 36)
- Onde: págs. 152 e 153
- Campos: código 36; nome e CNPJ da administradora do Fapi; descrição; valor pago; parcela não dedutível; titular ou dependente
- Regras: limite conjunto de 12% com a previdência complementar; mesmas condições de dedutibilidade de F-PAG-PREV
- Exige do MCP: mesmo tratamento do código 36

## F-PAG-37 Código 37, Contribuições a entidades de previdência complementar do § 15 do art. 40 da CF (Funpresp e similares)
- Onde: págs. 154 e 155
- Campos: titular ou dependente (nome do dependente); CNPJ da Fundação ou do Plano (obrigatório); Nome da Fundação ou do Plano; Descrição; Valor pago; Contribuição do ente público patrocinador
- Validações conhecidas: dedutível até o limite da contribuição do patrocinador; o excedente entra no limite global de 12% com previdência complementar e Fapi; botões Novo, Editar, Excluir (múltiplas linhas), Ok
- Regras de cálculo afetadas: linha 1 (até o patrocinador) e linha 3 (excedente) das deduções do Resumo
- Exige do MCP: campo "contribuição do patrocinador" e cálculo da divisão

## F-PAG-60 Código 60, Advogados (honorários de ações judiciais, exceto trabalhistas)
- Campos: titular ou dependente (informativo); nome do advogado ou escritório; CPF ou CNPJ obrigatório; descrição; valor pago
- Regras de cálculo afetadas: não é dedução direta; usado para despesas de ações judiciais que geram rendimentos (RRA e rendimentos da natureza), proporcionalizadas entre tributável, exclusivo e isento (ver notas 01 e 03)
- Exige do MCP: lançamento automático sugerido ao registrar RRA com despesas judiciais

## F-PAG-61 Código 61, Advogados (honorários de ações judiciais trabalhistas)
- Campos e regras: idem F-PAG-60, para ações trabalhistas que geram rendimentos

## F-PAG-62 Código 62, Advogados (demais honorários)
- Campos: titular ou dependente; nome; CPF ou CNPJ obrigatório; descrição; valor
- Regras: informativo, sem dedução

## F-PAG-66 Código 66, Engenheiros, arquitetos e demais profissionais liberais (exceto advogados, administrador ou corretor de imóveis)
- Campos: titular ou dependente; nome do profissional; CPF obrigatório; descrição; valor
- Regras: informativo, sem dedução

## F-PAG-70 Código 70, Aluguéis de imóveis
- Campos: titular ou dependente; nome do locador; CPF ou CNPJ obrigatório; descrição; valor pago
- Validações conhecidas: informar o locador mesmo se pago via procurador ou imobiliária
- Regras: informativo, sem dedução (cruzamento com Dimob, inferido)

## F-PAG-71 Código 71, Administrador de imóvel
- Campos: titular ou dependente; nome do administrador; CPF ou CNPJ obrigatório; descrição; valor pago pela administração
- Regras: informativo

## F-PAG-72 Código 72, Corretor de imóveis
- Campos: titular ou dependente; nome do corretor; CPF ou CNPJ obrigatório; descrição; valor da corretagem pela venda de imóvel
- Regras: informativo; corretagem compõe a apuração do ganho de capital (inferido)

## F-PAG-76 Código 76, Arrendamento rural
- Campos: titular ou dependente; nome do arrendador; CPF ou CNPJ obrigatório; descrição; valor pago
- Validações conhecidas: obrigatório informar aqui o arrendamento pago mesmo quando lançado como despesa da atividade rural (nota 06, D-AR-RD-BRASIL)
- Regras: informativo
- Exige do MCP: consistência com o Demonstrativo da Atividade Rural (inferido)

## F-PAG-99 Código 99, Outros
- Campos: titular ou dependente; nome do beneficiário; CPF/CNPJ não obrigatório; descrição; valor; parcela não dedutível
- Regras: informativo

## F-PAG-IMPPS Botão "Importar arquivo do plano de saúde"
- Onde: rodapé da ficha Pagamentos Efetuados (Alt+I); também menu Importações > Informe de Plano de Saúde (Ctrl+Shift+I); pág. 142 e 391
- Campos: seleção do arquivo XML do informe recebido da operadora (ano-calendário 2025); pré-visualização (telas PainelPrevisualizadorDeclaracaoAssistidaInformePlanoSaude, PainelItemPagamentosPlanoSaude, PainelItemReembolsosPlanoSaude)
- Validações conhecidas: só adiciona, não apaga dados existentes; reimportar o mesmo informe duplica os lançamentos; conferência é responsabilidade do contribuinte
- Exige do MCP: `importar_informe_plano_saude` com detecção de duplicidade (melhoria sobre o PGD)

---

## F-DOA Doações Efetuadas (ficha)
- Onde: Fichas da Declaração > Doações Efetuadas; págs. 156 a 158; botões Novo, Editar, Excluir, OK
- Aplica-se a: todos (recortes de período de Final de Espólio e Saída Definitiva)
- Campos: Código (tabela de doações); Nome do beneficiário; CPF ou CNPJ do beneficiário; Valor pago; Parcela não dedutível (só Incentivo à Cultura); indicador de tipo CPF/CNPJ (layout registro 90, IN_TIPO_CPF_CNPJ)
- Validações conhecidas: relacionar doações aos fundos da Criança e do Adolescente e da Pessoa Idosa (nacional, distrital, estaduais, municipais) e doações ou patrocínios a cultura, audiovisual, desporto e reciclagem; doações a pessoas físicas também (80, 81, 99); doação a pessoa física sem CPF (inclusive não residente) usa código 99; CPF/CNPJ ausente ou inválido impede a gravação; doação a entidade assistencial não é dedutível (erro frequente)
- Códigos: 40, 41, 42, 43, 44, 45, 46, 47, 80, 81, 99
- Regras de cálculo afetadas: "Dedução de incentivo" do cálculo do imposto (só modelo de deduções legais); códigos 80, 81 e 99 são informativos
- Importações/exportações: exclusão de dependente apaga doações dele (nota 05, F-RESUMO-OPCAO); pré-preenchida pode trazer doações (DBF, inferido)
- Exige do MCP: CRUD com validação por código; cálculo dos limites (F-DOA-LIMITES); aviso de que a dedução some no simplificado

## F-DOA-LIMITES Limites das deduções de incentivo
- Onde: repetido nas págs. 159 a 174
- Regras de cálculo afetadas:
  - Grupos: I ECA (40 e doação direta ECA); II Pessoa Idosa (44 e doação direta Idosa); III Cultura (41); IV Audiovisual (42); V Reciclagem (47); VI Desporto (43).
  - Soma de I a IV limitada a 6% do imposto apurado na DAA.
  - Soma de I a V limitada a 6%.
  - Soma de I a IV e VI limitada a 7%.
  - Não há limite individual por código (exceto Pronas e Pronon, e doações diretas na declaração com 3%).
  - Pronas/PCD (45) e Pronon (46): cada um limitado a 1% do imposto devido, fora dos limites globais.
  - Dedução só na opção pelas deduções legais; o programa calcula os limites.
- Exige do MCP: motor de limites encadeados sobre o imposto devido; explicação da glosa por limite

## F-DOA-40 Código 40, Doações ao Estatuto da Criança e do Adolescente
- Onde: pág. 159 e 160
- Campos: nome do Fundo (nacional, estadual, distrital ou municipal); CNPJ obrigatório; valor pago
- Validações conhecidas: contribuições feitas diretamente aos fundos controlados pelos Conselhos, comprovadas por documento dos conselhos; doações diretamente na declaração vão na ficha própria; vedado deduzir em 2026 doações feitas diretamente na declaração de 2025
- Regras: grupo I dos limites
- Exige do MCP: validação do CNPJ contra a tabela de fundos ECA (`fundos-eca.json`, inferido como útil)

## F-DOA-41 Código 41, Incentivo à cultura
- Onde: pág. 161 e 162
- Campos: nome do produtor ou Fundo Nacional de Cultura; CPF/CNPJ do produtor ou CNPJ do FNC; valor pago; parcela não dedutível
- Validações conhecidas: projetos aprovados pelo MinC (ou Ancine para audiovisual); respeitar período de captação das portarias; incentivo em espécie comprovado por recibo de depósito e declaração do beneficiário; doações de propósito específico da Lei 13.800/2019 (art. 14, II e III) alcançadas se conformes
- Regras de cálculo afetadas: dedutível 80% das doações e 60% dos patrocínios para projetos do art. 25 da Lei 8.313/1991 (item 1: teatro, cinema, literatura, música, artes plásticas, folclore, patrimônio, humanidades, rádio e TV educativas); 100% para os segmentos do art. 18 (item 2: artes cênicas, livros de valor artístico, música erudita, exposições, acervos, curtas e médias, patrimônio, salas de cinema e teatro em municípios com menos de 100 mil habitantes); grupo III dos limites globais
- Exige do MCP: campo de tipo (doação ou patrocínio, art. 18 ou 25) para calcular a parcela não dedutível (inferido; o PGD pede a parcela pronta)

## F-DOA-42 Código 42, Incentivo à atividade audiovisual
- Onde: pág. 163 e 164
- Campos: nome do produtor, Fundo de Investimento Cultural ou Funcines; CPF/CNPJ; valor pago
- Validações conhecidas: investimentos em obras independentes via cotas de comercialização, patrocínio de obras, cotas de Funcines, projetos credenciados e programas especiais da Ancine; itens I e III só no mercado de capitais autorizado pela CVM; projetos aprovados pela Ancine
- Regras: grupo IV dos limites

## F-DOA-43 Código 43, Incentivo ao desporto
- Onde: pág. 165 e 166
- Campos: nome do proponente do projeto; CNPJ obrigatório; valor pago
- Validações conhecidas: projetos desportivos e paradesportivos aprovados pelo Ministério do Esporte (educacional, de participação ou de rendimento); vedado pagar remuneração de atleta profissional
- Regras: grupo VI dos limites (teto de 7%)

## F-DOA-44 Código 44, Fundos controlados pelos Conselhos da Pessoa Idosa
- Onde: pág. 167 e 168
- Campos: nome do Fundo; CNPJ obrigatório; valor pago
- Validações conhecidas: contribuições diretas aos fundos, comprovadas pelos conselhos; doações diretamente na declaração vão na aba "Pessoa Idosa" da ficha própria; vedado deduzir em 2026 doações diretas feitas na declaração de 2025
- Regras: grupo II dos limites
- Exige do MCP: validação do CNPJ contra `fundos-idoso.json` (inferido)

## F-DOA-45 Código 45, Pronas/PCD
- Onde: pág. 169 e 170
- Campos: nome da instituição; CNPJ obrigatório; valor pago
- Validações conhecidas: doações e patrocínios a ações aprovadas pelo Ministério da Saúde, por pessoas jurídicas sem fins lucrativos dedicadas a deficiências e autismo; patrocínio = incentivo com finalidade promocional
- Regras de cálculo afetadas: limitado a 1% do imposto devido, fora dos limites globais

## F-DOA-46 Código 46, Pronon
- Onde: pág. 171 e 172
- Campos: nome da instituição; CNPJ obrigatório; valor pago
- Validações conhecidas: instituições de prevenção e combate ao câncer, ações aprovadas pelo Ministério da Saúde
- Regras de cálculo afetadas: limitado a 1% do imposto devido, fora dos limites globais

## F-DOA-47 Código 47, Apoio direto a projetos da cadeia produtiva da reciclagem
- Onde: pág. 173 e 174
- Campos: nome do projeto (o texto diz "nome e CNPJ do Fundo"); CNPJ obrigatório; valor pago
- Validações conhecidas: projetos aprovados pelo Ministério do Meio Ambiente e Mudança do Clima (capacitação, incubação, pesquisas, infraestrutura, equipamentos e veículos de coleta, redes de comercialização, catadores, novas tecnologias)
- Regras: grupo V dos limites (teto de 6% com I a IV)

## F-DOA-80 Código 80, Doações em espécie
- Campos: nome do donatário; CPF obrigatório; valor
- Regras: informativo; o donatário informa em Isentos código 14 e Bens e Direitos (nota 05, F-BENS-ESP-DOACAO)
- Exige do MCP: lembrete de ganho de capital e ITCMD fora do escopo (inferido)

## F-DOA-81 Código 81, Doações em bens e direitos
- Campos: nome do donatário; CPF obrigatório; valor
- Regras: informativo; doação por valor superior ao declarado gera ganho de capital do doador (GCAP)
- Exige do MCP: alerta de GCAP e baixa do bem em Bens e Direitos

## F-DOA-99 Código 99, Outras
- Campos: nome do beneficiário; CPF ou CNPJ (opcional para PF sem CPF, inclusive não residente); valor
- Regras: informativo

---

## F-DDD Doações Diretamente na Declaração (ficha)
- Onde: ficha própria com abas "Criança e Adolescente" e "Pessoa Idosa"; págs. 175 a 177; botões Novo, Editar, Excluir, OK
- Aplica-se a: Declaração de Ajuste Anual com deduções legais entregue até 29/05/2026 (não se aplica fora do prazo nem no simplificado)
- Campos (por aba): Tipo de fundo (Nacional; Estadual com UF; Municipal com UF e município); Valor a doar; CNPJ do fundo (obtido da tabela pelo programa, layout registros 91 e 92)
- Validações conhecidas:
  - Dedução até 3% do imposto devido por modalidade (ECA e Pessoa Idosa), dentro do limite global de 6% ou 7% com as demais deduções de incentivo, inclusive as contribuições aos fundos feitas durante 2025.
  - Pagamento até 29/05/2026, no expediente bancário; não pago gera glosa definitiva e recolhimento da diferença com acréscimos.
  - Após 29/05/2026 não se admite retificação para aumentar o valor dedutível.
  - Darf próprio por doação: código 3351 (ECA) e 9090 (Pessoa Idosa), distinto do Darf do saldo de imposto; pagamento obrigatório mesmo com restituição ou débito automático; sem parcelamento; sem débito automático; valor mínimo impresso de R$ 10,00.
  - Recolhido a maior: irreversível e repassado ao fundo; pode retificar até 29/05/2026 dentro dos limites ou considerar o excesso não dedutível. Recolhido a menor: complementar até 29/05/2026 ou retificar.
  - Exemplo: imposto devido R$ 10.000,00 gera limite global R$ 600,00 ou R$ 700,00 e limite da doação direta R$ 300,00.
- Códigos: Darf 3351 e 9090
- Regras de cálculo afetadas: dedução de incentivo; Darf das doações
- Importações/exportações: impressão de Darf ECA (Ctrl+W) e Pessoa Idosa (Ctrl+Y); telas PainelMensagemDoacaoExcedidaECA e PainelMensagemDoacaoExcedidaIdoso avisam excesso (nome de tela)
- Exige do MCP: cálculo do valor máximo doável (3% e limites globais) antes da escolha; geração dos dados do Darf 3351/9090; bloqueio no simplificado e após o prazo

## F-DDD-ECA Aba "Criança e Adolescente"
- Campos: tipo de fundo; UF; município; valor; CNPJ do fundo (tabela `fundos-eca.json`)
- Regras: ver F-DDD
- Exige do MCP: seleção do fundo por esfera/UF/município na tabela

## F-DDD-IDOSO Aba "Pessoa Idosa"
- Campos: tipo de fundo; UF; município; valor; CNPJ do fundo (tabela `fundos-idoso.json`)
- Regras: ver F-DDD

---

## F-BENS Bens e Direitos (ficha, Declaração de Ajuste Anual)
- Onde: Fichas da Declaração > Bens e Direitos; págs. 178 a 181; botões Novo, Editar, Excluir (múltiplas linhas), "Repetir valores" (copia 31/12/2024 para 31/12/2025 nos selecionados, Ctrl para seleção múltipla; Alt+R), OK
- Aplica-se a: Ajuste Anual, Final de Espólio, Saída Definitiva (campos diferentes, ver F-BENS-DFE e F-BENS-DSDP)
- Campos (fluxo do Novo/Editar): Grupo; Código; Localização (País); Discriminação; Situação em 31/12/2024 (R$); Situação em 31/12/2025 (R$); campos condicionais por grupo/código (F-BENS-DADOS); pertence a Titular ou Dependente (nos códigos indicados); quadros "Aplicação Financeira" e "Lucros e Dividendos" para bens no exterior (nota 05)
- Validações conhecidas:
  - Relacionar bens do titular e dependentes, no Brasil e no exterior, em 31/12/2024 e 31/12/2025.
  - Lei 14.754/2023: aplicações financeiras, controladas e trusts no exterior (nota 05).
  - Regime de transparência fiscal: opção para controladas adquiridas em 2025, irrevogável, declarada na Discriminação de cada bem da controlada; para opções anteriores, continuar declarando os bens como diretos.
  - Atividade rural com benfeitorias deduzidas como custeio: aqui só a terra nua; benfeitorias no Demonstrativo da Atividade Rural.
  - Com importação da declaração de 2025, Situação em 31/12/2024 vem preenchida; o contribuinte revisa e preenche 31/12/2025.
  - Visualização da lista mostra só a primeira linha da discriminação (FAQ pág. 406).
- Códigos: grupos 01 a 08 e 99 (F-BENS-G01 a F-BENS-G99)
- Regras de cálculo afetadas: evolução patrimonial do Resumo; base de obrigatoriedade (bens acima de R$ 800.000,00); custo para GCAP futuro
- Importações/exportações: declaração 2025 (código, discriminação, localização, país e Situação 31/12/2024 se diferente de zero); pré-preenchida (bens, inclusive criptoativos e e-Financeira); lançamento de rendimentos associados a partir do bem (F-BENS-RENDASSOC)
- Exige do MCP: CRUD com schema por grupo/código; ação "repetir valores"; validações condicionais; totais por data; vínculo com rendimentos

## F-BENS-OBRIG Bens e direitos que devem ser declarados e dispensa
- Onde: págs. 180 e 189
- Validações conhecidas:
  - No Brasil ou no exterior: imóveis, veículos automotores, embarcações e aeronaves, qualquer valor; outros bens móveis e direitos com valor de aquisição unitário igual ou superior a R$ 5.000,00.
  - No Brasil: saldos de conta corrente, poupança e aplicações acima de R$ 140,00 em 31/12/2025; conjunto de ações, quotas ou quinhões de uma mesma empresa e ouro ativo financeiro com valor de aquisição igual ou superior a R$ 1.000,00; conjunto de criptoativos da mesma espécie igual ou superior a R$ 5.000,00.
  - No exterior: aplicações financeiras, ações/quotas e ouro ativo financeiro, criptoativos, independentemente do valor; bens de controladas em transparência fiscal; bens de trust não enquadrado como controlada; participações em controladas diretas sujeitas aos regimes anual ou de disponibilização; controladas indiretas sujeitas aos regimes.
  - Dispensa: saldos até R$ 140,00; bens móveis e direitos (exceto veículos, embarcações e aeronaves) abaixo de R$ 5.000,00; conjunto de ações/quotas/ouro abaixo de R$ 1.000,00.
- Exige do MCP: aviso de dispensa e de obrigatoriedade por valor e grupo

## F-BENS-DADOS Dados do bem: campos condicionais
- Onde: págs. 181 a 184
- Campos e regras:
  - Localização (País): os campos IPTU, CIB, CEI/CNO, Registrado no Cartório, Renavam, CNPJ, CPF, Agência e Conta só são habilitados com país 105 Brasil.
  - Discriminação: espécie, data e valor de aquisição e venda.
  - Situação em 31/12/2024: valor da DAA anterior. Situação em 31/12/2025: valor nessa data.
  - Grupo 01 (01, 02, 03, 11, 12, 13, 14, 15, 16, 17, 18, 19, 99): logradouro, número, complemento, bairro/distrito, UF, município, CEP, área total e unidade (m2 ou ha). Exceto 16 e 17: data de aquisição e, se registrado, matrícula e nome do cartório. Área: construída para 01, 02, 03, 12 e 16; privativa para 11, 15, 18 e 19; acréscimo de área para 17; terreno ou terra nua para 13 e 14; ordem de preferência da fonte: registro de imóveis, guia do IPTU, outro documento. IPTU para 01, 02, 03, 11, 12, 13, 15, 18, 19 e 99; CIB para 14; CEI/CNO para 16.
  - Grupo 02 (01, 02, 03): Renavam, Registro de Aeronave ou Registro de Embarcação; veículo no exterior: identificação no campo Registro de Veículo.
  - Titular ou dependente e CNPJ (Brasil): grupo 03 (01, 02, 03, 99); 04 (01, 02, 03, 04, 05, 99); 06 (01, 10, 11, 99); 07 (01, 02, 03, 04, 06, 07, 08, 10, 12, 13, 99); 99 (05, 06, 07, 08, 99).
  - Criptoativos grupo 08 (01, 02, 03, 10, 99): titular ou dependente; valor original de aquisição (nunca o valor atual); 02 exige Código Altcoin (tabela altcoins); 03 exige Código Stablecoin (tabela stablecoins).
  - CNPJ obrigatório: grupo 03 (01, 02, 03, 99); 04 (01, 02, 03, 99); 06 (01, 99); 07 (01, 02, 03, 04, 06, 07, 08, 10, 12, 13, 99); 08 (01, 02, 03 quando não autocustodiante, 10); 99 (05, 06, 07).
  - Grupo 04 código 01 e grupo 06 código 01 (Brasil): Banco (tabela `bancos-bens.json`), agência e conta.
  - Grupo 05 (01, 02, 99) no Brasil: CPF ou CNPJ do devedor.
  - Declaração Final de Espólio: não há campo titular/dependente.
  - "Negociados em Bolsa?" Sim exige Código de Negociação para: 03.01 Ações; 04.04 Ativos negociados em bolsa (BDRs, opções e outros); 07.02 Fiagro; 07.03 FII; 07.04 FIA e FMP-FGTS; 07.06 FIP, FIDC e ETF entidades de investimento; 07.07 FIP-IE e FIP-PD&I; 07.08 ETF de renda fixa; 07.10 Fundos de infraestrutura, FIDC e outros alíquota 0%; 07.12 FIEE; 07.13 Fundo multimercado; 07.99 Fundos no exterior.
- Exige do MCP: schema dinâmico por grupo/código e país; validação de CNPJ/CPF, Renavam, CEP, município x UF, banco/agência/conta; tabelas altcoin e stablecoin

## F-BENS-RENDASSOC Rendimentos associados ao bem
- Onde: pág. 184 (grupo 04, códigos 01, 02, 03) e nota 03 (vínculos de isentos 09, 12, 99 e exclusivos 06, 10)
- Campos: botões que abrem lançamento na ficha Isentos (09 lucros a partir de 03.01; 12 poupança e títulos isentos a partir de 04.01 e 04.03; 99 FII/Fiagro a partir de 07.02 e 07.03) ou Exclusivos (06 aplicações a partir de 04.02 e grupo 07; 10 JCP a partir de 03.01); botão "Visualizar Bem/Direito Associado" nas fichas de rendimentos
- Regras de cálculo afetadas: totais de isentos e exclusivos
- Exige do MCP: vínculo bidirecional bem x rendimento (chave do bem, layout registro 88 NR_CHAVE_BEM e registro 36)

## F-BENS-G01 Grupo 01, Bens imóveis
- Códigos: 01 Prédio residencial; 02 Prédio comercial; 03 Galpão; 11 Apartamento; 12 Casa; 13 Terreno; 14 Imóvel rural; 15 Sala ou conjunto; 16 Construção; 17 Benfeitorias até 1988; 18 Loja; 19 Garagem avulsa; 99 Outros bens imóveis
- Obrigatoriedade: sempre
- Discriminação: data e forma de aquisição, condôminos e usufruto
- Campos: ver F-BENS-DADOS (endereço, área, unidade, cartório, matrícula, IPTU, CIB, CEI/CNO)
- Exige do MCP: validações do grupo; casos especiais (benfeitorias, imóvel rural, permuta) da nota 05

## F-BENS-G02 Grupo 02, Bens móveis
- Códigos: 01 Veículo automotor terrestre; 02 Aeronave; 03 Embarcação; 04 Bem relacionado com atividade autônoma; 05 Quadro, objeto de arte, coleção, antiguidade; 06 Joia; 99 Outros bens móveis
- Obrigatoriedade: 01 a 03 sempre; demais se valor de aquisição igual ou superior a R$ 5.000,00
- Discriminação: marca, modelo, ano de fabricação, placa (veículo), data e forma de aquisição; linha telefônica: número e local
- Campos: Renavam, Registro de Aeronave, Registro de Embarcação, Registro de Veículo (exterior)

## F-BENS-G03 Grupo 03, Participações societárias
- Códigos: 01 Ações (inclusive listadas em bolsa); 02 Quotas ou quinhões de capital; 03 Holding patrimonial (ações ou quotas por integralização de bens já declarados); 99 Outras participações
- Obrigatoriedade: valor de aquisição igual ou superior a R$ 1.000,00 (exterior: sempre)
- Discriminação: quantidade e tipo, nome da PJ; tipos diferentes em itens separados
- Campos: CNPJ da emissora; Negociados em bolsa e código de negociação (01); titular/dependente
- Regras: base dos lançamentos de lucros (isento 09) e JCP (exclusivo 10); controladas no exterior (nota 05)

## F-BENS-G04 Grupo 04, Aplicações e investimentos
- Códigos: 01 Depósito em conta poupança; 02 Títulos públicos e privados tributáveis (Tesouro Direto, CDB, RDB e outros); 03 Títulos isentos (LCI, LCA, LCD, CRI, CRA, LIG, Debêntures de Infraestrutura e outros); 04 Ativos negociados em bolsa no Brasil (BDRs, opções e outros, exceto ações e fundos); 05 Ouro ativo financeiro; 99 Outras aplicações e investimentos
- Obrigatoriedade: 01 a 03 saldo maior que R$ 140,00; 04 e 05 valor de aquisição igual ou superior a R$ 1.000,00; 99 conforme natureza
- Discriminação: instituição, conta, cotitular (nome e CPF) se conjunta; 04: quantidade e série de opções e vencimento; 05: instituição ou custodiante e gramas
- Campos: banco, agência e conta (01); CNPJ da instituição/emissora; código de negociação (04); botões de rendimentos associados (01, 02, 03)

## F-BENS-G05 Grupo 05, Créditos
- Códigos: 01 Empréstimos concedidos; 02 Crédito decorrente de alienação; 99 Outros créditos
- Obrigatoriedade: valor igual ou superior a R$ 5.000,00
- Discriminação: valor, prazo e condições, nome do devedor
- Campos: CPF ou CNPJ do devedor
- Regras: crédito de lucros a receber de controlada no exterior no regime anual vai em 05.99 (nota 05)

## F-BENS-G06 Grupo 06, Depósitos à vista e numerário
- Códigos: 01 Depósito em conta corrente ou conta pagamento; 02 Conta gráfica em agente operador de apostas de quota fixa (Lei 14.790/2023, país sempre 105 Brasil); 10 Dinheiro em espécie, moeda nacional; 11 Dinheiro em espécie, moeda estrangeira; 99 Outros depósitos à vista
- Obrigatoriedade: saldo maior que R$ 140,00 (02: R$ 5.000,00 conforme tabela)
- Campos: banco, agência e conta (01); CNPJ da instituição ou do agente operador (02); tipo e quantidade de moeda (10, 11)
- Observações: código 02 é novidade relacionada às apostas de quota fixa (não aparece na tabela resumida da pág. 361, só na tabela da pág. 192)

## F-BENS-G07 Grupo 07, Fundos
- Códigos: 01 Fundos sujeitos a come-cotas (Lei 14.754/2023); 02 Fiagro; 03 FII; 04 FIA e FMP-FGTS; 06 FIP, FIDC e ETF entidades de investimento; 07 FIP-IE e FIP-PD&I; 08 ETF de renda fixa; 10 Fundos de infraestrutura, FIDC e outros alíquota 0%; 12 FIEE; 13 Fundo multimercado (art. 25 c/c art. 40 da Lei 14.754/2023); 99 Fundos no exterior
- Obrigatoriedade: saldo maior que R$ 140,00
- Discriminação: CNPJ do fundo, administradora, quantidade de quotas, cotitular
- Campos: CNPJ obrigatório; negociado em bolsa e código de negociação; rendimentos associados (isento 99 para FII/Fiagro; exclusivo 06)

## F-BENS-G08 Grupo 08, Criptoativos
- Códigos: 01 Bitcoin (BTC); 02 Altcoins (ETH, XRP, BCH, LTC etc., com Código Altcoin); 03 Stablecoins (USDT, USDC, BRZ, BUSD, DAI, TUSD, GUSD, PAX, PAXG etc., com Código Stablecoin); 10 NFTs; 99 Outros criptoativos
- Obrigatoriedade: no Brasil, valor de aquisição igual ou superior a R$ 5.000,00 por espécie; no exterior, sempre
- Discriminação: quantidade, custodiante e CNPJ ou modelo de carteira (autocustódia); tipos diferentes em itens separados
- Campos: titular/dependente; indicador de autocustódia (03); CNPJ do custodiante; valor original de aquisição
- Regras: ativo custodiado ou negociado por instituição no exterior é aplicação financeira no exterior (nota 05)

## F-BENS-G99 Grupo 99, Outros bens e direitos
- Códigos: 01 Licença e concessão especiais; 02 Título de clube; 03 Direito de autor, inventor e patente; 04 Direito de lavra; 05 Consórcio não contemplado; 06 VGBL; 07 JCP creditado e não pago; 08 Leasing com opção de compra no fim do contrato; 99 Outros bens e direitos
- Obrigatoriedade: 01 a 04 valor igual ou superior a R$ 5.000,00; 06, 07, 08 sempre
- Discriminação: 05 administradora, tipo de bem, parcelas pagas e a pagar; 06 instituição, conta, apólice; 07 nome da PJ; 08 fim do contrato; 99 qualquer informação sem campo próprio, inclusive aviso de que bens comuns estão na declaração do cônjuge (com nome e CPF)
- Campos: CNPJ da administradora (05), seguradora (06), PJ devedora (07); país (08)

## F-BENS-COMUNS Situações individuais: bens comuns, condomínio e tipos de declaração
- Onde: págs. 194 e 195
- Validações conhecidas:
  - Titularidade conforme arts. 1.639 a 1.688 e 1.723 a 1.727 do Código Civil.
  - Comuns: comunhão total; adquiridos na constância da comunhão parcial; adquiridos na união estável (salvo contrato).
  - Condomínio: declarar a parte proporcional.
  - Conjunta: bens do casal e dependentes, inclusive com cláusula de incomunicabilidade ou inalienabilidade; bens do dependente na declaração de quem o deduz; mudança de dependência em 2025 por separação: na declaração de quem detém a guarda.
  - Separada: privativos na declaração do proprietário; comuns na totalidade na declaração de um cônjuge; o outro informa código 99 do grupo 99 com nome e CPF do cônjuge.
  - Espólio inicial e intermediárias: todos os bens do inventário; comuns pelo espólio se obrigado; se desobrigado, pelo cônjuge sobrevivente; bens dos dependentes também.
  - Excluir dependente exige excluir os bens dele (não é automático).
- Exige do MCP: validação de bens de dependente excluído (órfãos); lembrete do item 99/99 em declaração separada

## F-BENS-DATAAQ Informações dos bens conforme a data de aquisição
- Onde: págs. 196 e 197
- Regras de cálculo afetadas:
  - Até 31/12/1995: Situação 31/12/2024 e 31/12/2025 = valor da DAA 2025. Sem declaração: até 1991 e nunca obrigado, avaliar a mercado em 31/12/1991 em cruzeiros e dividir por 720,4779; até 1991 obrigado ou 1992 a 1995, usar a Tabela de Atualização do Custo de Bens e Direitos.
  - De 1996 a 2024: à vista, custo de aquisição em 2024 repetido em 2025; a prazo ou financiado com garantia (SFH, consórcio): 2024 = parcelas pagas de 1996 a 2024; 2025 = 2024 + parcelas de 2025.
  - Em 2025: à vista, 2024 vazio e 2025 = custo; a prazo, 2024 vazio e 2025 = parcelas pagas em 2025.
  - Guardar documentação de benfeitorias.
- Exige do MCP: assistente de valor por data e forma de aquisição; tabela de atualização (S-TAB-ATUALIZACAO)

## F-BENS-DFE Bens e Direitos na Declaração Final de Espólio
- Onde: págs. 185 a 188 e 198 a 201
- Aplica-se a: Final de Espólio
- Campos: Grupo; Código; "Bem a inventariar" (checkbox); Localização (País); Discriminação (parcela de cada beneficiário com nome e CPF); "Bem com usufruto?" (marcar só se sim; quadro de proprietários e usufrutuários, inferido pelo nome de tela PainelQuadroAuxiliarProprietariosUsufrutuariosLista); Situação na data da partilha (R$); Percentual % (botão que abre o quadro auxiliar "percentual de participação do inventário": CPF/CNPJ do beneficiário e percentual, com Novo, Editar, Excluir, OK); Valor de transferência (R$); campos condicionais como em F-BENS-DADOS (grupo 05 também com titular/dependente e CNPJ; sem campo titular/dependente na DFE); botão "Repetir valores"
- Validações conhecidas:
  - "Bem a inventariar" só quando a ficha Espólio marca "Ainda há bens a inventariar"; desabilita Situação na data da partilha, % e Valor de transferência e habilita Situação em 31/12/2024 e 31/12/2025.
  - Situação na data da partilha: valor da última declaração do de cujus atualizado até 31/12/1995, ou custo se adquirido depois.
  - Transferência pelo valor da partilha ou de mercado; valor superior gera ganho de capital a 15% (inclusive espólios anteriores a 1998), apurado no GCAP 2025.
  - Herdeiros, meeiro e legatários incluem os bens pelo Valor de transferência.
  - Retificadora de DFE após o prazo não pode alterar valores de Bens e Direitos.
  - Bens da atividade rural deduzidos como despesa não entram; transmissão é receita rural do espólio no mês.
  - Tabela por data: aquisição até 1995 e de 1996 a 2024: partilha = valor da DAA 2025; transferência = valor + parcelas de 2025 (ou repetir se quitado); aquisição em 2025: partilha vazia, transferência = pago em 2025. Alienação até 2024: não informar; alienação em 2025: partilha = DAA 2025, transferência vazia, discriminação com adquirente, valor, data e condições; aquisição e alienação em 2025: ambos vazios.
  - Darf do ganho de capital pelo inventariante em nome do de cujus: 4600 (Brasil), 8523 (exterior), 8960 (moeda em espécie), até a data da DFE.
- Exige do MCP: modelo de bem com campos de espólio e quadro de percentuais por herdeiro (soma 100%, inferido); validação de CPF/CNPJ dos beneficiários contra a ficha Herdeiros (inferido); alerta de ganho de capital na transferência

## F-BENS-DSDP Bens e Direitos na Declaração de Saída Definitiva
- Onde: págs. 202 e 203; repetido nas págs. 345 a 347
- Aplica-se a: Saída Definitiva
- Campos: Código; Localização; Discriminação (espécie, data e valor de aquisição e venda); Situação em 31/12/2024 (R$); Situação na data da caracterização da condição de não residente (R$); botão "Repetir valores" (repete 31/12/2024 na data da não residência)
- Validações conhecidas:
  - Situação em 31/12/2024 = DAA 2025; se adquiriu residência no ano, a situação nessa data.
  - Bens da atividade rural deduzidos como despesa não entram (Demonstrativo AR); após a não residência, prejuízo rural não é mais compensável.
  - Conjunta: bens do casal e dependentes; separada: privativos com o proprietário, comuns na totalidade em um dos cônjuges; quem opta pela tributação total dos rendimentos comuns relaciona os bens.
  - Desincorporados em 2025: discriminação com adquirente, data e valor; 31/12/2024 preenchido; data da não residência vazia.
  - Adquiridos e alienados em 2025: ambos vazios.
  - Exterior: discriminação com valor na moeda do país e origem dos recursos; valor convertido pela cotação de venda do Bacen na data da aquisição (o texto das págs. 346 e 347 diz convertido em dólar e depois em real).
  - Depósitos no exterior: saldo convertido pela cotação do dia anterior à não residência (pág. 203 diz fechamento de venda; pág. 347 diz compra: divergência do texto).
- Exige do MCP: modelo de bem com campo de data de não residência; conversões cambiais por data; ação "repetir valores"
- Observações: divergência compra x venda registrada para conferência

## F-BENS-ALIEN-DFE Bens e direitos alienados no ano (Final de Espólio)
- Onde: pág. 199
- Campos: Discriminação (bem, nome e CPF/CNPJ do adquirente, data e valor)
- Validações conhecidas: não preencher Situação na data da partilha nem Valor de transferência (em conflito com a tabela por data da pág. 200, que manda preencher a partilha com o valor da DAA 2025 para alienação em 2025; dúvida)
- Exige do MCP: alerta de GCAP; registrar a divergência
