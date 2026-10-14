# Notas 01: regras gerais, tipos de declaração, situações, obrigatoriedade, pagamento

Fonte: Ajuda do IRPF 2026 (help/AjudaIRPF.pdf, 425 páginas), linhas 1 a 1637 do texto extraído (pág. 1 a 40).

## T-AJUSTE Declaração de Ajuste Anual
- Onde: aba "Nova" da tela "O que você deseja fazer?"; Ajuda pág. 5
- Aplica-se a: Ajuste Anual
- Campos: não se aplica (tipo de declaração)
- Validações conhecidas: deve ser apresentada pela pessoa física residente no Brasil obrigada (ver G-OBRIG). Desobrigado pode apresentar (G-OBRIG, atenção 2).
- Códigos: código Receitanet 2600 (do layout, não da Ajuda)
- Regras de cálculo afetadas: todas as fichas de ajuste; opção completa ou simplificada (G-REGIME)
- Importações/exportações: iniciar importando declaração de 2025, a partir da pré-preenchida, ou em branco
- Exige do MCP: criar declaração do tipo ajuste anual; escolher modo de início (importação 2025, pré-preenchida, em branco)
- Observações: nenhuma

## T-ESPOLIO-FINAL Declaração Final de Espólio
- Onde: aba "Nova"; Ajuda pág. 6
- Aplica-se a: Final de Espólio
- Campos: não se aplica
- Validações conhecidas: apresentada pelo inventariante, cônjuge ou companheiro, sucessor a qualquer título ou representante do de cujus, quando a decisão judicial transitada em julgado da partilha, sobrepartilha ou adjudicação, ou a lavratura da escritura pública de inventário e partilha, ocorreu no ano-calendário 2025. Havendo bens a inventariar, a DFE é obrigatória. Se partilha e falecimento no mesmo ano, apresentar só uma DFE.
- Códigos: Receitanet 2621 (layout)
- Regras de cálculo afetadas: período de 1º/01 até a data da decisão judicial ou escritura; se ainda houver bens a inventariar que gerem rendimentos, informar rendimentos de todo o ano-calendário (pág. 22)
- Importações/exportações: nenhuma citada aqui
- Exige do MCP: criar DFE; ficha Espólio com campo "Final de Espólio" (Partilha / Sobrepartilha / Partilha e Sobrepartilha); campo "Ainda há bens a inventariar?" habilita CPF e nome do inventariante; marcação "Bem a inventariar" em Bens e Direitos
- Observações: ver G-ESPOLIO-FINAL para detalhes de sobrepartilha

## T-SAIDA Declaração de Saída Definitiva do País
- Onde: aba "Nova"; Ajuda pág. 7
- Aplica-se a: Saída Definitiva
- Campos: não se aplica
- Validações conhecidas: pessoa física que em 2025 se retirou do Brasil em caráter permanente, ou passou à condição de não residente após saída temporária (mais de 12 meses consecutivos de ausência)
- Códigos: Receitanet 2620 (layout)
- Regras de cálculo afetadas: período de 1º/01 até o dia anterior ao da caracterização da condição de não residente (pág. 22); imposto recolhido em quota única (pág. 18)
- Importações/exportações: nenhuma citada aqui
- Exige do MCP: criar DSDP; impedir parcelamento (quota única) (inferido da pág. 18)
- Observações: nenhuma

## T-PROGRAMAS Programas relacionados disponibilizados pela RFB
- Onde: Ajuda pág. 8
- Aplica-se a: todos
- Campos: tabela nome, sigla, finalidade
- Validações conhecidas: nenhuma
- Códigos: GCAP2025 (ganhos de capital de 2025, exporta para IRPF2026); Carnê-Leão (ano-calendário 2025, acesso via e-CAC, "Meu Imposto de Renda" > "Declarações" > "Acessar Carnê-Leão", exporta para IRPF2026); AR2025 (livro Caixa da atividade rural 2025, exporta para IRPF2026); IRPF2026 (ajuste, final de espólio, saída definitiva); GCAP2026 e AR2026 (exportam para IRPF2027)
- Regras de cálculo afetadas: nenhuma direta
- Importações/exportações: GCAP2025, Carnê-Leão 2025 e AR2025 exportam dados importáveis no IRPF2026
- Exige do MCP: importar arquivos de exportação do GCAP2025, AR2025 e Carnê-Leão; orientar o usuário sobre onde obtê-los
- Observações: no PGD 2026 o GCAP está embutido como demonstrativo (ver notas de GCAP)

## G-CASADO Contribuinte casado
- Onde: Ajuda pág. 10, Situações Individuais
- Aplica-se a: Ajuste Anual
- Campos: não se aplica
- Validações conhecidas: declaração em separado ou, opcionalmente, em conjunto
- Códigos: nenhum
- Regras de cálculo afetadas: separado, opção a: cada cônjuge inclui rendimentos próprios + 50% dos rendimentos de bens comuns, compensando 50% do imposto pago/retido sobre esses rendimentos, independentemente de quem sofreu a retenção; opção b: um cônjuge inclui 100% dos rendimentos de bens comuns e compensa 100% do imposto; o outro só os próprios. Conjunta: em nome de um dos cônjuges, com todos os rendimentos de ambos, inclusive de bens com cláusula de incomunicabilidade ou inalienabilidade e pensões de gozo privativo.
- Importações/exportações: nenhuma
- Exige do MCP: suportar rateio 50% ou 100% de rendimentos de bens comuns; suportar declaração em conjunto (cônjuge como dependente); orientar a escolha
- Observações: separado de fato segue as regras do casado (pág. 10)

## G-COMPANHEIRO Contribuinte que tenha companheiro
- Onde: Ajuda pág. 10
- Aplica-se a: Ajuste Anual
- Campos: não se aplica
- Validações conhecidas: separado ou em conjunto com o companheiro
- Códigos: nenhum
- Regras de cálculo afetadas: separado: rendimentos próprios + 50% dos rendimentos de bens em condomínio, salvo contrato escrito com outro percentual; imposto compensável na mesma proporção. Conjunta: em nome de um dos companheiros, com o total dos rendimentos.
- Importações/exportações: nenhuma
- Exige do MCP: permitir percentual contratual diferente de 50% para condomínio
- Observações: nenhuma

## G-SEPARADO-FATO Contribuinte separado de fato
- Onde: Ajuda pág. 10
- Aplica-se a: Ajuste Anual
- Regras: segue as instruções do contribuinte casado
- Exige do MCP: mesma lógica de G-CASADO

## G-DIVORCIADO Contribuinte separado judicialmente, divorciado, que dissolveu união estável ou separado/divorciado por escritura pública
- Onde: Ajuda pág. 11
- Aplica-se a: Ajuste Anual
- Validações conhecidas: declara como solteiro se não casado nem em união estável em 31/12/2025. Pode incluir dependente de quem detenha guarda judicial (com os rendimentos dele) ou deduzir pensão alimentícia paga por decisão judicial, alimentos provisionais, acordo homologado judicialmente ou escritura pública. Responsável pela guarda de filhos obrigados a declarar: declaração em separado para cada filho, ainda que menor, ou opcionalmente em conjunto, incluindo rendimentos, bens e direitos dos filhos.
- Regras de cálculo afetadas: rendimentos de dependentes vão nas abas Dependentes das fichas Rendimentos Tributáveis de PJ, de PF/Exterior e Imposto Pago/Retido; bens e dívidas dos dependentes em Bens e Direitos e Dívidas e Ônus Reais
- Exige do MCP: validar que o mesmo filho não seja dependente e alimentando ao mesmo tempo (inferido); orientar escolha
- Observações: nenhuma

## G-VIUVO Contribuinte viúvo
- Onde: Ajuda pág. 11
- Aplica-se a: Ajuste Anual
- Regras de cálculo afetadas: declara com o próprio CPF os rendimentos próprios; no curso do inventário pode optar por tributar 50% dos rendimentos de bens comuns na própria declaração ou integralmente na declaração do espólio
- Exige do MCP: opção de rateio dos bens comuns com o espólio

## G-MENOR Contribuinte menor
- Onde: Ajuda pág. 11
- Aplica-se a: Ajuste Anual
- Validações conhecidas: declaração em nome do menor, com o CPF dele. Opcionalmente dependente de um dos pais ou de quem o crie, eduque e detenha a guarda judicial. Menor sob guarda por sentença ou acordo homologado: tributação em conjunto só com quem detém a guarda judicial.
- Regras de cálculo afetadas: rendimentos do menor nas abas Dependentes das fichas de rendimentos e Imposto Pago/Retido
- Exige do MCP: alerta de guarda judicial ao incluir menor como dependente

## G-EMANCIPADO Contribuinte menor emancipado
- Onde: Ajuda pág. 12
- Regras: declaração própria; opcionalmente dependente de um dos pais se preencher os requisitos
- Exige do MCP: mesma lógica de dependente

## G-INCAPAZ Contribuinte incapaz
- Onde: Ajuda pág. 12
- Regras: declaração em nome do incapaz, feita por tutor, curador ou responsável pela guarda judicial; opcionalmente dependente desses, incluindo rendimentos, bens e direitos do incapaz
- Exige do MCP: mesma lógica de dependente

## G-ESPOLIO Declaração do espólio (inicial e intermediárias)
- Onde: Ajuda pág. 12 a 14
- Aplica-se a: Espólio inicial e intermediária (Ajuste Anual com natureza de ocupação 81)
- Campos: Identificação com CPF e nome da pessoa falecida, endereço residencial na data do falecimento; natureza da ocupação 81 (Espólio); ocupação principal e código em branco; ficha Espólio com nome, CPF e endereço do inventariante (ou interessado com poderes de inventariante)
- Validações conhecidas: natureza 81 exige ocupação principal em branco; espólio é contribuinte distinto de meeiro, herdeiros e legatários; mesmos prazos e obrigatoriedade das pessoas físicas. Apresentada por: (a) cônjuge meeiro, sucessor ou representante, enquanto não iniciado o inventário; (b) inventariante após abertura do inventário; (c) interessado com poderes de inventariante, em inventário e partilha por escritura pública (arts. 610 e 611 da Lei 13.105/2015, CPC). Dependentes são os da ficha Dependentes desde que mantenham a condição até o falecimento.
- Códigos: natureza da ocupação 81
- Regras de cálculo afetadas: rendimentos próprios + 50% dos rendimentos de bens comuns recebidos no ano (opcionalmente 100% em nome do espólio, compensando 100% do imposto); união estável: 50% ou percentual contratual dos bens em condomínio; bens e direitos do inventário e obrigações do espólio
- Importações/exportações: nenhuma
- Exige do MCP: ao escolher natureza 81, habilitar ficha Espólio e limpar ocupação principal; validar campos do inventariante
- Observações: Declaração inicial = ano-calendário do falecimento. Falecimento a partir de 1º/01/2026 e antes da entrega da declaração de 2025: não é declaração de espólio; apresentar normalmente pelos mesmos responsáveis (a, b, c), igual para exercícios anteriores não entregues. Intermediárias = anos seguintes ao falecimento até o ano anterior ao da decisão judicial da partilha ou escritura.

## G-ESPOLIO-FINAL Regras da Declaração Final de Espólio e sobrepartilha
- Onde: Ajuda pág. 14 e 15
- Aplica-se a: Final de Espólio; Ajuste Anual com natureza 81
- Campos: ficha Espólio: "Final de Espólio" com opções "Partilha" (habilita aba Partilha), "Sobrepartilha" (habilita aba Sobrepartilha), "Partilha e Sobrepartilha" (habilita as duas); "Ainda há bens a inventariar?" (habilita CPF e Nome do inventariante); Bens e Direitos: "Bem a inventariar", "Situação em 31/12/2024 (R$)", "Situação em 31/12/2025 (R$)", "Situação na data da partilha (R$)", "Valor de transferência (R$)", "%", dados dos herdeiros
- Validações conhecidas: bem a inventariar é informado como bem de ajuste anual, sem as obrigatoriedades da DFE; bens partilhados ou sobrepartilhados com trânsito em julgado em 2025 informam herdeiros e valores de transferência, sem marcar "Bem a inventariar" e selecionando "%"
- Códigos: natureza 81
- Regras de cálculo afetadas: a responsabilidade pelos tributos até o falecimento é do espólio; até a partilha, do sucessor e do cônjuge meeiro, limitada ao quinhão, legado, herança ou meação
- Importações/exportações: nenhuma
- Exige do MCP: modelar partilha, sobrepartilha e bens a inventariar; permitir várias DFE em anos distintos (desde o exercício 2021); exemplo: partilha transitada em abril de 2025 exige DFE 2026 até 29/05/2026; sobrepartilha iniciada em 2026 sem decisão em 2026 gera Ajuste Anual 2027 com natureza 81 e sobrepartilha marcada na ficha Espólio; sobrepartilha decidida em 2026 gera nova DFE 2027 com "Sobrepartilha"
- Observações: caso de partilha transitada a partir de 1º/03/2025 com sobrepartilha iniciada sem decisão em 2025: marcar "Ainda há bens a inventariar" e "Bem a inventariar" em cada bem não inventariado

## G-AUSENTE-SERVICO Contribuinte ausente no exterior a serviço do Brasil
- Onde: Ajuda pág. 17 e 18
- Aplica-se a: Ajuste Anual
- Campos: Endereço no Exterior; "Cód EX" (código do posto do Ministério das Relações Exteriores mais próximo da residência)
- Validações conhecidas: obrigado como residente. Aplica-se a servidor civil ou militar em missão no exterior, funcionário da administração federal direta (CLT), indireta e fundações, do Legislativo, Judiciário e TCU, e no que couber DF, estados e municípios, e pessoa designada pelo Presidente da República. Empresa pública e sociedade de economia mista a serviço próprio no exterior: não são ausentes a serviço do Brasil.
- Regras de cálculo afetadas: 25% dos rendimentos do trabalho assalariado em moeda estrangeira do Governo Brasileiro são tributáveis; 75% não tributáveis; todas as deduções legais cabíveis
- Importações/exportações: nenhuma
- Exige do MCP: cálculo automático do split 25%/75%; campo de código do posto MRE; tabela de postos (não está nesta parte)
- Observações: formas de pagamento iguais a P-FORMAS, inclusive remessa de ordem de pagamento via Banco do Brasil, Gecex Brasília-DF, prefixo 1608-X, em reais ou moeda estrangeira

## G-AUSENTE-OUTROS Contribuinte ausente no exterior exceto a serviço do Brasil
- Onde: Ajuda pág. 18 e 19
- Aplica-se a: Saída Definitiva; Ajuste Anual
- Validações conhecidas: saída permanente ou ausência temporária por mais de 12 meses consecutivos obriga a Declaração de Saída Definitiva, relativa ao período de residente no ano da caracterização, com recolhimento em quota única. Sem DSDP, é residente durante os primeiros 12 meses consecutivos; vira não residente no dia seguinte ao fim desses 12 meses.
- Regras de cálculo afetadas: enquanto residente, ajuste anual normal observando tratados e reciprocidade; após não residência, rendimentos no Brasil tributados exclusivamente na fonte, e ganho de capital e renda variável de forma definitiva, dispensada declaração
- Exige do MCP: calcular data de caracterização de não residência (data de saída + 12 meses); orientar entre DSDP e Ajuste
- Observações: débito automático conforme P-DEBITO

## G-RESIDENTE Contribuinte que adquiriu ou readquiriu a condição de residente
- Onde: Ajuda pág. 19 e 20
- Aplica-se a: Ajuste Anual
- Campos: Identificação, pergunta "Era residente no exterior e passou a ser residente no país em 2025?" (citada no índice da pág. 44)
- Validações conhecidas: residente: (a) visto permanente, desde a chegada; (b) visto temporário: para trabalho com vínculo ou médico bolsista do Programa Mais Médicos (Lei 12.871/2013), desde a chegada; obtendo visto permanente ou vínculo antes de 184 dias de permanência em até 12 meses, a partir da data do visto ou do trabalho; por outro motivo, permanência superior a 183 dias em até 12 meses, a partir do 184º dia; se ficar até 183 dias, novo período de 12 meses conta do ingresso seguinte; (c) brasileiro não residente que retorna com ânimo definitivo, na data da chegada
- Regras de cálculo afetadas: rendimentos do período de não residente: fonte no exterior em Isentos e Não Tributáveis; fonte no Brasil em Tributação Exclusiva/Definitiva; após residência, tributação normal
- Exige do MCP: calculadora da data de aquisição de residência (regra dos 183/184 dias); roteamento automático de rendimentos do período não residente
- Observações: obrigatoriedade VII

## G-DIPLOMATICO Rendimentos de representações diplomáticas e organismos internacionais no Brasil
- Onde: Ajuda pág. 20
- Aplica-se a: Ajuste Anual
- Regras de cálculo afetadas: isentos os rendimentos do trabalho assalariado de servidor diplomático estrangeiro, servidor estrangeiro de organismo internacional com isenção por tratado, servidor não brasileiro de embaixada/consulado com reciprocidade; demais rendimentos no Brasil exclusivos na fonte ou definitivos (ganho de capital e renda variável)
- Validações conhecidas: isenção não alcança servidor brasileiro com residência permanente no Brasil ou estrangeiro que virou residente; esses recolhem carnê-leão e declaram
- Exige do MCP: orientar classificação como isento ou carnê-leão

## G-CONVERSAO Conversão em reais de rendimentos ou pagamentos em moeda estrangeira
- Onde: Ajuda pág. 21
- Aplica-se a: todos
- Regras de cálculo afetadas: converter para dólar dos EUA pela autoridade monetária do país de origem na data do recebimento/pagamento e depois para reais pelo dólar do Banco Central do último dia útil da primeira quinzena do mês anterior. Rendimentos e imposto pago em favor do empregado: cotação de compra do mês anterior ao recebimento; deduções: cotação de venda do mês anterior ao pagamento.
- Importações/exportações: tabela "Conversão para Reais do Dólar dos Estados Unidos da América em 2025" (seção Tabelas)
- Exige do MCP: ferramenta de conversão com a tabela mensal de compra e venda de 2025
- Observações: nenhuma

## G-REND-TRAB Rendimentos do trabalho (tributáveis)
- Onde: Ajuda pág. 23 e 24
- Aplica-se a: todos
- Regras de cálculo afetadas: tributáveis: salários, férias, aposentadoria, reserva, reforma, pensões, retiradas, gratificações, participações no lucro, verbas de representação, estagiários e residentes; benefícios de previdência complementar, PGBL e Fapi; resgates (exceto contribuições pagas entre 1º/01/1989 e 31/12/1995); VGBL: diferença positiva entre recebido e prêmios pagos; parcela de aposentadoria/pensão de 65 anos ou mais que exceder R$ 1.903,98 mensais (janeiro a dezembro) a partir do mês em que completou 65 anos (a parcela isenta vai no código 10 dos isentos); pro labore e aluguéis de sócios; despesas pagas pelo empregador em favor do empregado (aluguel, previdência, IR, seguro de vida, locomoção); 25% do assalariado em moeda estrangeira de servidor no exterior; profissões, autônomos, representante comercial; emolumentos de serventuários; empreitada individual; direitos autorais explorados pelo autor; VPI (Lei 10.698/2003) e abono de permanência (§ 19 do art. 40 da CF, EC 41/2003, art. 7º da Lei 10.887/2004); no mínimo 10% dos rendimentos de garimpeiros; no mínimo 10% do transporte de carga e serviços com trator e máquinas; no mínimo 60% do transporte de passageiros (veículo próprio ou locado conduzido pelo contribuinte)
- Validações conhecidas: optante pela tributação exclusiva da Lei 11.053/2004 (arts. 1º e 2º) declara benefícios e resgates de previdência complementar em Tributação Exclusiva, e o imposto não é compensável; autônomo que prestou serviço só a PJ e escriturou livro caixa preenche apenas a coluna Livro Caixa (aba "Outras Informações" da ficha PF/Exterior); pessoa física com mais de um veículo/máquina explorados com outros ou com operador contratado equipara-se a PJ
- Exige do MCP: cálculo da parcela isenta de 65 anos (limite mensal R$ 1.903,98 a partir do mês do aniversário); percentuais mínimos de transporte e garimpo; alerta de equiparação a PJ
- Observações: nenhuma

## G-ALUGUEIS Rendimentos de aluguéis
- Onde: Ajuda pág. 25
- Aplica-se a: todos
- Regras de cálculo afetadas: ocupação, sublocação, uso ou exploração de bens móveis e imóveis, royalties, direitos (inclusive autorais não recebidos pelo autor). De PJ: ficha Rendimentos de PJ; de PF: aba "Outras Informações" da ficha PF/Exterior. Cessão gratuita de imóvel (exceto a cônjuge, pais ou filhos): rendimento anual de aluguel de 10% do valor venal (pode usar o IPTU do ano). Exclusões, se ônus exclusivo do locador: impostos, taxas e emolumentos do bem; aluguel pago por imóvel sublocado; despesas de cobrança ou recebimento; condomínio.
- Exige do MCP: calcular aluguel presumido de cessão gratuita; deduzir exclusões permitidas antes de lançar

## G-AR-RESULTADO Resultado tributável da atividade rural
- Onde: Ajuda pág. 25
- Regras: resultado positivo do Demonstrativo da Atividade Rural é rendimento tributável na declaração
- Exige do MCP: transferir resultado do demonstrativo para o resumo

## G-RRA Rendimentos recebidos acumuladamente (regra geral)
- Onde: Ajuda pág. 25 e 26
- Regras de cálculo afetadas: rendimento tributável inclui acréscimos, juros e 13º, excluídas despesas com a ação judicial (inclusive advogados) pagas e não indenizadas; essas despesas são proporcionalizadas entre tributáveis, exclusivos e isentos
- Códigos: Pagamentos Efetuados 60 (honorários de ações judiciais, exceto trabalhistas) e 61 (honorários de ações trabalhistas), com CPF do advogado ou CNPJ do escritório, nome e valor
- Exige do MCP: rateio proporcional das despesas judiciais; lançamento automático em Pagamentos 60/61

## G-OUTROS-REND Outros rendimentos tributáveis
- Onde: Ajuda pág. 26
- Regras de cálculo afetadas: lucros apurados desde 1º/01/1996 distribuídos em 2025 que excedam o valor apurado na escrituração (lucro real, presumido ou arbitrado); rendimentos de capital no exterior (aplicações financeiras e lucros/dividendos de controladas); reajuste e juros na alienação a prazo de bens adquiridos em reais; acréscimo patrimonial a descoberto; resgate e rendimentos de partes beneficiárias ou de fundador; lucro do comércio ou indústria de não habitual
- Exige do MCP: alerta de variação patrimonial a descoberto (inferido); classificação

## G-OBRIG Obrigatoriedade de apresentação da Declaração de Ajuste Anual 2026
- Onde: Ajuda pág. 28 e 29
- Aplica-se a: Ajuste Anual
- Validações conhecidas: obrigado o residente que, em 2025: I) recebeu rendimentos tributáveis acima de R$ 35.584,00; II) rendimentos isentos, não tributáveis ou exclusivos acima de R$ 200.000,00; III) ganho de capital sujeito a imposto em qualquer mês; IV) operações em bolsa com soma de alienações acima de R$ 40.000,00 ou com ganhos líquidos tributáveis; V) atividade rural com receita bruta acima de R$ 177.920,00 ou que pretenda compensar prejuízos de anos anteriores ou de 2025; VI) bens e direitos (inclusive terra nua) acima de R$ 800.000,00 em 31/12; VII) passou a ser residente e estava nessa condição em 31/12; VIII) optou pela isenção do ganho de capital na venda de imóvel residencial com reaplicação em imóvel residencial no País em 180 dias (art. 39 da Lei 11.196/2005); IX) optou pelo regime de transparência fiscal de entidade controlada no exterior (art. 8º da Lei 14.754/2023); X) titular de trust em 31/12 (arts. 10 a 13 da Lei 14.754/2023); XI) aplicações financeiras no exterior (arts. 2º a 4º e 9º da Lei 14.754/2023): auferiu rendimentos ou pretende compensar perdas; XII) lucros ou dividendos de entidades no exterior (arts. 2º e 5º a 6º-A da Lei 14.754/2023)
- Dispensas: cônjuge cujos bens comuns são declarados pelo outro, se não se enquadrar em outra hipótese e bens privativos até R$ 800.000,00; quem consta como dependente em declaração de outra pessoa com seus rendimentos, bens e direitos
- Regras de cálculo afetadas: rendimentos dos dependentes somam-se aos do titular para os limites de I e II; quem se enquadra em I a IV e VI a XI com resultado positivo da atividade rural também preenche o Demonstrativo da Atividade Rural
- Exige do MCP: ferramenta de verificação de obrigatoriedade com os 12 critérios e as dispensas, usando dados da declaração ou perguntas
- Observações: desobrigado pode apresentar

## G-REGIME Regime de tributação (deduções legais ou desconto simplificado)
- Onde: Ajuda pág. 29
- Aplica-se a: Ajuste Anual (inferido; espólio inicial e intermediário também)
- Regras de cálculo afetadas: deduções legais: todas as deduções comprovadas; desconto simplificado: 20% dos rendimentos tributáveis, limitado a R$ 16.754,34, substituindo todas as deduções, sem comprovação
- Exige do MCP: calcular as duas opções e indicar a mais vantajosa; permitir escolha
- Observações: troca de opção na retificadora só até 29/05/2026 (G-RETIF)

## G-PREENCHIMENTO Forma de preenchimento e pré-preenchida
- Onde: Ajuda pág. 30 e 31
- Aplica-se a: Ajuste Anual
- Regras: elaborada no computador com o IRPF2026 (PGD) ou pelo "Meu Imposto de Renda" (site e apps Android/iOS), com autenticação gov.br nível Ouro ou Prata. A pré-preenchida contém rendimentos tributáveis, isentos, exclusivos, deduções, bens e direitos, dívidas e ônus, operações com criptoativos (IN RFB 1.888/2019) e dados de convênios; acesso só com cidadão autenticado no gov.br.
- Importações/exportações: importação de comprovante eletrônico de rendimentos (informe da fonte pagadora) e de pagamentos de serviços médicos e de saúde (informe do plano de saúde)
- Exige do MCP: importar arquivo da pré-preenchida obtido pelo usuário; importar informes eletrônicos de rendimentos e plano de saúde; orientar o login gov.br (fora do MCP)
- Observações: o MCP não autentica no gov.br (inferido); depende do arquivo baixado pelo usuário

## G-PRAZO Prazo e local de apresentação
- Onde: Ajuda pág. 31
- Aplica-se a: Ajuste Anual, Espólio, Saída
- Regras: pela Internet, com o programa de transmissão Receitanet (ou "Meu Imposto de Renda"), até 23h59min59s (horário de Brasília) de 29/05/2026
- Exige do MCP: gerar arquivo para entrega e instruir transmissão no PGD/Receitanet; alerta de prazo

## G-MULTA-ATRASO Multa por atraso na entrega (MAED)
- Onde: Ajuda pág. 31 e 32
- Aplica-se a: todos os obrigados
- Regras de cálculo afetadas: entrega após 29/05/2026: com imposto devido (mesmo pago), 1% ao mês ou fração sobre o imposto devido, mínimo R$ 165,74 e máximo 20% do imposto devido; sem imposto devido, R$ 165,74. Termo inicial: dia seguinte ao prazo; termo final: mês da entrega ou do lançamento de ofício. Não paga no vencimento da notificação emitida pelo PGD, é deduzida da restituição com acréscimos. Sem multa para desobrigado.
- Exige do MCP: calcular a MAED; gerar dados do Darf da multa (notificação de lançamento emitida pelo PGD)

## G-RETIF Retificação da declaração
- Onde: Ajuda pág. 32
- Aplica-se a: todos
- Campos: "Que tipo de declaração você deseja fazer?" opção "Declaração retificadora"; número do recibo da declaração imediatamente anterior do exercício 2026 (obrigatório; obtido na folha 2 do recibo ou no menu Declaração > Abrir)
- Validações conhecidas: retificadora substitui integralmente a anterior, com a mesma natureza; deve conter todas as informações; troca entre deduções legais e simplificado só até 29/05/2026, depois mantém a opção anterior
- Caminhos no PGD: tela "O que você deseja fazer?" aba "Transmitidas", ícone de retificar; barra lateral Declaração > Retificar; ficha Identificação, pergunta do tipo de declaração
- Importações/exportações: entrega pela Internet (Receitanet ou "Meu Imposto de Renda", serviço "Preencher Declaração Online" no e-CAC); após 29/05/2026 também em mídia removível (pen drive, HD externo) nas unidades da RFB
- Exige do MCP: criar retificadora a partir de declaração transmitida; validar número do recibo (formato); bloquear troca de regime após o prazo

## G-APOS-PRAZO Locais de apresentação após o prazo
- Onde: Ajuda pág. 32 e 33
- Regras: após 29/05/2026, inclusive retificadora: Internet ou mídia removível nas unidades da RFB
- Exige do MCP: orientação

## G-EXERC-ANT Declaração de exercícios anteriores
- Onde: Ajuda pág. 33
- Regras: usar o programa do exercício correspondente (ex.: IRPF 2025 para ano-calendário 2024); entrega pela Internet ou mídia removível nas unidades da RFB
- Exige do MCP: fora do escopo do PGD 2026; orientar (o MCP pode suportar outros exercícios no futuro, inferido)

## P-DARF Preenchimento do Darf do IRPF
- Onde: Ajuda pág. 33 e 34; menu Declaração > Imprimir > Darf do IRPF; ícone impressora > Darf do IRPF; barra lateral Imprimir > Darf do IRPF
- Aplica-se a: todos com imposto a pagar
- Campos: Número CPF (preenchido pelo programa); Nome (programa); Período de Apuração (31/12/2025); Data de Vencimento (programa, por quota); Número do Documento (gerado pelo programa); Código da Receita 0211; Principal (valor da quota); Multa (ver P-APOS-PRAZO); Juros (a partir da 2ª quota, conforme P-QUOTAS-PRAZO); Total
- Validações conhecidas: no prazo, 1ª quota ou única: Total = Principal; demais: Principal + Juros. Após o prazo: Principal + Multa + Juros. O programa emite Darf em uma via. Vencimento ocorre independentemente da entrega.
- Códigos: receita 0211 (IRPF ajuste)
- Regras de cálculo afetadas: quotas, juros, multa de mora
- Importações/exportações: impressão (PDF)
- Exige do MCP: gerar dados do Darf (e PDF ou código de barras quando possível) por quota; ao entregar, o contribuinte fica notificado a recolher
- Observações: número do documento é gerado pelo PGD (inferido: o MCP pode não reproduzir o número oficial)

## P-FORMAS Formas de pagamento do imposto
- Onde: Ajuda pág. 18, 19, 33, 37
- Regras: transferência eletrônica em instituições autorizadas; Darf em agência da rede arrecadadora ou caixa eletrônico; débito automático (P-DEBITO); remessa de ordem de pagamento pelo Banco do Brasil Gecex Brasília-DF prefixo 1608-X (ausente no exterior a serviço do Brasil)
- Exige do MCP: orientação ao usuário

## P-DEBITO Débito automático das quotas
- Onde: Ajuda pág. 18, 19, 33, 37
- Validações conhecidas: entrega até 10/05/2026 permite débito da quota única ou a partir da 1ª quota; entrega de 11/05/2026 a 29/05/2026 permite débito só a partir da 2ª quota, e a 1ª é paga por outra forma
- Campos: banco, agência e conta (na ficha de resumo, inferido; detalhado em outras notas)
- Exige do MCP: validar elegibilidade do débito pela data prevista de entrega; validar banco conveniado (tabela de bancos)

## P-PARCEL Parcelamento do imposto
- Onde: Ajuda pág. 34 e 35
- Regras de cálculo afetadas: saldo inferior a R$ 10,00 não é recolhido e acumula para exercícios seguintes até atingir R$ 10,00; de R$ 10,00 a menos de R$ 100,00, quota única; R$ 100,00 ou mais, até 8 quotas mensais e sucessivas, cada uma não inferior a R$ 50,00. 1ª quota ou única até 29/05/2026 sem acréscimo; 2ª até 30/06/2026 com 1% de juros; demais com Selic acumulada desde 01/06/2026 até o mês anterior ao pagamento mais 1% no mês do pagamento.
- Validações conhecidas: facultado antecipar total ou parcialmente sem retificar; facultado ampliar o número de quotas até o vencimento da última desejada (máximo 8) por retificadora ou pelo "Meu Imposto de Renda (Extrato da DIRPF)"
- Exige do MCP: calcular o número máximo de quotas (min(8, floor(saldo / 50))); valor da quota; validar regras de R$ 10 e R$ 100

## P-QUOTAS-PRAZO Valor das quotas pagas dentro do prazo
- Onde: Ajuda pág. 35 a 38
- Regras de cálculo afetadas: 1ª ou única: valor apurado; 2ª: +1%; 3ª: + Selic de junho/2026 + 1%; 4ª: + Selic junho e julho + 1%; 5ª: + Selic junho a agosto + 1%; 6ª: + Selic junho a setembro + 1%; 7ª: + Selic junho a outubro + 1%; 8ª: + Selic junho a novembro + 1%. Selic é pós-fixada, conhecida no 1º dia útil do mês seguinte; obtida no site da RFB.
- Exige do MCP: ferramenta de cálculo de quota com tabela Selic informada ou consultada; aviso de que a Selic futura não é conhecida

## P-VENC Vencimento das quotas
- Onde: Ajuda pág. 38
- Datas: 1ª ou única 29/05/2026; 2ª 30/06/2026; 3ª 31/07/2026; 4ª 31/08/2026; 5ª 30/09/2026; 6ª 30/10/2026; 7ª 30/11/2026; 8ª 30/12/2026
- Exige do MCP: tabela de vencimentos

## P-APOS-PRAZO Pagamento após o prazo
- Onde: Ajuda pág. 38
- Regras de cálculo afetadas: multa de mora de 0,33% por dia de atraso sobre o principal, a partir do 1º dia útil seguinte ao vencimento, limitada a 20%; juros de mora pela Selic acumulada de junho/2026 até o mês anterior ao pagamento + 1% no mês do pagamento; atraso da 1ª ou única paga em junho/2026: juros de 1%; total = principal + multa + juros
- Exige do MCP: calcular Darf em atraso (multa e juros) por quota

## M-INICIAL Tela "O que você deseja fazer?"
- Onde: tela de entrada; Ajuda pág. 39
- Aplica-se a: todos
- Campos: aba "Boas-vindas" (mensagens, dicas, novidades); links úteis; botão "Entrar com gov.br"; aba "Nova": Declaração de Ajuste Anual, Final de Espólio ou Saída Definitiva, e modo "Iniciar Importando Declaração de 2025", "Iniciar Declaração a partir da Pré-Preenchida" ou "Iniciar Declaração em Branco"; aba "Em Preenchimento": pesquisa por nome; ícones Abrir, Excluir, Entregar, Imprimir, Gravar Cópia de Segurança; aba "Transmitidas": pesquisa por nome; ícones Abrir, Retificar, Imprimir (Declaração, Recibo de Entrega, Darf do IRPF), Gravar Cópia de Segurança e Recibo
- Validações conhecidas: login gov.br obrigatório para obter a pré-preenchida (Identidade Digital Ouro ou Prata) e importar demonstrativo do Carnê-Leão; para obter rendimentos de dependentes na pré-preenchida, os dependentes devem dar procuração eletrônica ao CPF do titular
- Exige do MCP: listar declarações em preenchimento e transmitidas; criar nova (3 tipos x 3 modos); abrir, excluir, entregar (gerar arquivo), imprimir, cópia de segurança, retificar; não faz login gov.br (orientar o usuário a baixar o arquivo)
- Observações: nenhuma
