# Notas 07: Declaração de Saída Definitiva, Tabelas, Erros mais Frequentes e requisitos do programa

Fonte: AjudaIRPF.pdf do IRPF 2026 versão 1.5 (texto em ajuda.txt, linhas 14482 a 18181; páginas 341 a 425). As seções "Como fazer para..." e "Perguntas mais Frequentes" dessa faixa estão nas notas 08 (menus e operações).

---

## F-SAIDA-GERAL Declaração de Saída Definitiva do País: obrigações
- Onde: Ajuda págs. 342 a 344
- Aplica-se a: Saída Definitiva
- Validações conhecidas:
  - Quem se ausentar em caráter permanente ou passar a não residente após ausência temporária deve: apresentar a DSDP do período de residência no ano da saída até o último dia útil de maio do ano seguinte; apresentar na mesma data as DAA de anos anteriores obrigatórias e não entregues; recolher em quota única, até essa data, o imposto apurado e os demais créditos tributários.
  - Prazo 2026: até 29/05/2026, para saída permanente em 2025 ou para quem completou 12 meses consecutivos de ausência em 2025.
  - Forma: computador com o IRPF2026; entrega pela Internet (Receitanet incorporado ao PGD) ou mídia removível nas unidades da RFB.
  - Rendimentos abrangidos: de 1º/01 (ou da aquisição da residência no ano) até o dia anterior à saída permanente; de 1º/01 até o dia em que completar 12 meses de ausência na saída temporária. Aplicam-se as normas do ano-calendário.
- Exige do MCP: tipo de declaração DSDP; cálculo de período; aviso de DAA anteriores pendentes
- Observações: complementa S-TIPO-DSDP e S-REGRA-AUSENTE-OUTROS

## S-REGRA-NAO-RESIDENTE Caracterização da condição de residente e de não residente
- Onde: Ajuda págs. 342 e 343
- Regras:
  - Residente: reside em caráter permanente; ausente a serviço do Governo brasileiro como assalariado de autarquia ou repartição no exterior; ingresso com visto permanente (na chegada); visto temporário para trabalho com vínculo ou médico do Mais Médicos (na chegada), ao completar 184 dias em até 12 meses, ou na data do visto permanente ou vínculo se antes dos 184 dias; brasileiro que retorna com ânimo definitivo (na chegada); quem se ausenta sem apresentar a Comunicação de Saída Definitiva, durante os primeiros 12 meses consecutivos de ausência.
  - Não residente: não se enquadra como residente; retira-se em caráter permanente com Comunicação de Saída (na data da saída); ingressa para servir governo estrangeiro no País; visto temporário com até 183 dias em 12 meses, ou até a véspera do visto permanente ou vínculo; ausente temporariamente a partir do dia seguinte ao que completar 12 meses consecutivos.
  - Ausência inferior a 12 meses reinicia a contagem na próxima saída; a mudança de condição só ocorre quando houver hipótese que fundamente a nova condição.
- Exige do MCP: calculadora de condição de residência por datas de entrada e saída (calcular_condicao_residencia)

## F-SAIDA-IDENT Ficha Identificação do Contribuinte na Saída Definitiva
- Onde: Ajuda págs. 344 a 346
- Campos: Tipo (Original, primeira do exercício 2026; Retificadora, com nº do recibo da DSDP anterior, obrigatório, obtido em Declaração > Imprimir > Recibo ou Declaração > Abrir); Nome; Data de nascimento; Doença grave ou deficiência (prioridade na restituição, art. 69-A Lei 9.784/1999); Raça/Cor; Possui cônjuge (CPF com 11 dígitos se SIM); Endereço Brasil ou Exterior; "Houve mudança de endereço?" (SIM/NÃO); endereço completo no exterior com código do país e do posto do MRE mais próximo; sem endereço no exterior: endereço do procurador no Brasil ou de contato no Brasil; Natureza da ocupação e Ocupação principal (naturezas 13, 14, 61, 62, 71 e 72 dispensam ocupação)
- Validações conhecidas: recibo obrigatório na retificadora; regras de nome e data iguais às do Ajuste (nota 02)
- Exige do MCP: validação específica de DSDP (posto MRE, tabela de representações)

## F-SAIDA Ficha Saída
- Onde: Ajuda pág. 346; tela PainelSaida
- Aplica-se a: Saída Definitiva
- Campos: Procurador (CPF, nome e endereço completo), se houver; Data da caracterização da condição de não residente (data da saída se permanente; dia seguinte ao que completou 12 meses de ausência se temporária); Data da caracterização da condição de residente no País, se ocorrida a partir de 01/01/2025; país de nova residência (layout registro 39: CD_NOVO_PAIS_RESIDENCIA, NM_PAIS, inferido)
- Validações conhecidas: data de não residência dentro de 2025 (inferido); data de residência anterior à de não residência (inferido)
- Regras de cálculo afetadas: define o número de meses da tabela progressiva (soma das tabelas mensais) e o período das fichas
- Exige do MCP: `definir_saida_definitiva`; validação de datas; cálculo do período

## F-SAIDA-DEDUCOES Deduções na Saída Definitiva
- Onde: Ajuda pág. 346
- Regras de cálculo afetadas: permitidas todas as deduções legais; limites anuais de dependentes e instrução podem ser usados integralmente se preenchidos os requisitos; deduções do período de residência (1º/01 ou data da residência até a véspera da saída permanente, ou até completar 12 meses de ausência)
- Exige do MCP: não proporcionalizar limites anuais de dependentes e instrução

## F-SAIDA-DIVIDAS Dívidas e Ônus Reais na Saída Definitiva
- Onde: Ajuda pág. 348
- Campos: código; discriminação; Situação em 31/12/2024; Situação na data da caracterização de não residente
- Exige do MCP: campo de data de não residência nas dívidas

## F-SAIDA-CALC Cálculo do imposto na Saída Definitiva
- Onde: Ajuda págs. 348 e 349
- Regras de cálculo afetadas: soma das tabelas progressivas mensais dos meses do período, ainda que os rendimentos sejam de um ou alguns meses. Exemplo: residente em 01/01/2025 e não residente em 16/06/2025 usa a soma das tabelas de janeiro a junho. Se adquiriu residência no mesmo ano, soma dos meses da data da residência até o retorno à não residência. Tabela mensal de janeiro a abril difere da de maio a dezembro (S-TAB-PROGRESSIVA).
- Exige do MCP: motor de cálculo com tabela proporcional por meses e por faixa mensal vigente em cada mês

## F-SAIDA-IMPEXT Compensação do imposto pago no exterior na Saída Definitiva
- Onde: Ajuda pág. 349
- Regras de cálculo afetadas: mesma lista de países com acordo (África do Sul a Venezuela) e reciprocidade sem prova (Alemanha, Estados Unidos, Reino Unido); prova de reciprocidade por lei traduzida e autenticada ou declaração da representação diplomática; tributos estaduais e municipais excluídos; limite = imposto com rendimentos do exterior menos imposto sem eles; conversão pela cotação de compra do Bacen do último dia útil da 1ª quinzena do mês anterior ao recebimento
- Exige do MCP: mesmo cálculo de F-IMPPAGO-02 aplicado à tabela proporcional

## F-SAIDA-PAGTO Pagamento, restituição e disposições finais da Saída Definitiva
- Onde: Ajuda págs. 350 e 351
- Regras de cálculo afetadas: quota única até a data da apresentação, inclusive do imposto do ano anterior e outros créditos; sem parcelamento; reclamações não suspendem a cobrança (depósito permitido); após o prazo: multa de mora 0,33% ao dia limitada a 20% e juros Selic acumulada desde o mês seguinte ao previsto para a apresentação até o mês anterior ao pagamento mais 1% no mês do pagamento; restituição só ao contribuinte ou procurador; formas: transferência eletrônica ou Darf em agência ou caixa eletrônico (no Brasil, contribuinte ou procurador)
- Validações conhecidas: rendimentos de fonte no Brasil de não residente: tributação definitiva (ganho de capital e aplicações) ou exclusiva na fonte, sem isenções de residente, salvo tratado; o não residente deve comunicar a fonte pagadora por escrito (Comunicação à Fonte Pagadora de Saída do País); consultar IN SRF 208/2002
- Exige do MCP: bloqueio de quotas na DSDP; geração da comunicação à fonte pagadora (M-IMPR-COMUNICACAO-SAIDA)

## F-SAIDA-DARF Darf da Saída Definitiva
- Onde: Ajuda págs. 351 e 352
- Campos: CPF (programa); Nome (programa); Período de apuração (data da caracterização da não residência da ficha Saída); Data de vencimento (preenchida pelo declarante: data de apresentação obrigatória); Número do documento (gerado pelo programa); Código 0211; Principal; Multa (0,33% ao dia, limite 20%); Juros (Selic + 1%); Total (no prazo = principal; após = soma)
- Validações conhecidas: ao apresentar, o contribuinte fica notificado a recolher; vencimento 29/05/2026; impressão por Declaração > Imprimir > Darf do IRPF ou Darf de doações ECA/Pessoa Idosa, ícone impressora ou barra lateral; visualizar e salvar em PDF
- Exige do MCP: dados do Darf 0211 da DSDP com período de apuração diferente do ajuste

## F-SAIDA-MULTA Multa por atraso na entrega da Saída Definitiva
- Onde: Ajuda págs. 343 e 353
- Regras de cálculo afetadas: após 29/05/2026, com imposto devido (ainda que pago) 1% ao mês ou fração sobre o imposto devido, mínimo R$ 165,74 e máximo 20%; sem imposto devido R$ 165,74; lançamento de ofício; termo inicial no dia seguinte ao prazo e final no mês da entrega ou do lançamento; não paga no vencimento da notificação emitida pelo PGD é deduzida da restituição com acréscimos
- Exige do MCP: mesma calculadora de S-REGRA-MULTA-ATRASO

---

## S-TAB-PROGRESSIVA Tabela Progressiva Anual e Mensal (ano-calendário 2025)
- Onde: Ajuda pág. 355; dados também em `docs/mapeamento/tabelas/aliquotas-parametros.json`
- Valores:
  - Anual: até 28.467,20 zero; 28.467,21 a 33.919,80 7,5% deduzir 2.135,04; 33.919,81 a 45.012,60 15% deduzir 4.679,03; 45.012,61 a 55.976,16 22,5% deduzir 8.054,97; acima de 55.976,16 27,5% deduzir 10.853,78. Dedução anual por dependente 2.275,08; limite anual de instrução 3.561,50; limite anual do desconto simplificado 16.754,34.
  - Mensal janeiro a abril: até 2.259,20 zero; 2.259,21 a 2.826,65 7,5% deduzir 169,44; 2.826,66 a 3.751,05 15% deduzir 381,44; 3.751,06 a 4.664,68 22,5% deduzir 662,77; acima de 4.664,68 27,5% deduzir 896,00. Isenção previdenciária 65 anos 1.903,98; dependente 189,59; desconto simplificado mensal 564,80.
  - Mensal maio a dezembro: até 2.428,80 zero; 2.428,81 a 2.826,65 7,5% deduzir 182,16; 2.826,66 a 3.751,05 15% deduzir 394,16; 3.751,06 a 4.664,68 22,5% deduzir 675,49; acima de 4.664,68 27,5% deduzir 908,73. Isenção 65 anos 1.903,98; dependente 189,59; desconto simplificado mensal 607,20.
- Regras de cálculo afetadas: imposto anual (ajuste e simplificado), RRA (tabela mensal do mês do recebimento x meses), Saída Definitiva e Final de Espólio (soma de tabelas mensais), Carnê-Leão
- Exige do MCP: tabela parametrizada por exercício e por mês (módulo tabelas)

## S-TAB-DOLAR Tabela de Conversão para Reais do Dólar dos EUA em 2025
- Onde: Ajuda pág. 356
- Valores (compra / venda): jan 6,0394 / 6,0400; fev 6,0371 / 6,0377; mar 5,7277 / 5,7283; abr 5,7413 / 5,7419; mai 5,8701 / 5,8707; jun 5,6322 / 5,6328; jul 5,5646 / 5,5652; ago 5,5569 / 5,5576; set 5,3922 / 5,3928; out 5,3202 / 5,3208; nov 5,4458 / 5,4464; dez 5,2946 / 5,2952
- Regras: cotação do mês do recebimento ou pagamento (já corresponde ao último dia útil da 1ª quinzena do mês anterior); compra para rendimentos e imposto pago; venda para deduções; Atividade Rural usa 5,5018 (compra de 31/12/2025)
- Exige do MCP: `converter_moeda` com esta tabela; não está entre os 32 JSON de `docs/mapeamento/tabelas` (lacuna: gerar tabela própria)

## S-TAB-ATUALIZACAO Tabela de Atualização do Custo de Bens e Direitos
- Onde: Ajuda págs. 357 e 358
- Regras: dividir o valor original, na moeda da época, pelo índice do mês/ano da aquisição ou pagamento para obter o valor em reais até 31/12/1995; índices de 1938 a 1995 por moeda (Real 1994-1995; Cruzeiro Real 1993-1994; Cruzeiro 1990-1993 e 1967-1986; Cruzado Novo 1989-1990; Cruzado 1986-1989; Cruzeiro Novo 1967-1970; Mil-Réis 1938-1942); exemplo de índice: jan/1992 720,4779; dez/1995 0,9596
- Exige do MCP: tabela digitalizada e calculadora `atualizar_custo_bem` (lacuna: não está entre os JSON existentes)

## S-TAB-DEPENDENCIA Tabela de Relação de Dependência
- Onde: Ajuda pág. 359; `tabelas/dependentes.json`
- Códigos: 11 cônjuge ou companheiro (filho ou mais de 5 anos); 21 filho ou enteado até 21 anos; 22 filho ou enteado até 24 anos cursando superior ou técnico; 23 filho ou enteado com deficiência, qualquer idade, se remuneração não exceder as deduções legais (ADI 5583); 24 irmão, neto ou bisneto sem arrimo, com guarda judicial, até 21 anos; 25 idem até 24 anos estudando, com guarda até os 21; 26 irmão, neto ou bisneto com deficiência, sem arrimo, com guarda, qualquer idade (ADI 5583); 31 pais, avós e bisavós com rendimentos até R$ 28.467,20 no ano (Ajuste e DFE) ou até a soma dos limites mensais (2.259,20 de janeiro a abril e 2.428,80 de maio a dezembro) dos meses da declaração (DSDP); 41 menor pobre até 21 anos criado, educado e sob guarda judicial; 51 pessoa absolutamente incapaz sob tutela ou curatela
- Validações conhecidas: idade na data de referência; limite de rendimentos do código 31 varia por tipo de declaração
- Exige do MCP: validação de idade e condições por código (validar_dependente)

## S-TAB-BENS Tabela de Códigos de Bens e Direitos
- Onde: Ajuda págs. 360 a 362 e 190 a 193; `tabelas/bens-direitos.json`
- Conteúdo: grupos 01 a 08 e 99 (detalhe em F-BENS-G01 a F-BENS-G99)
- Exige do MCP: consulta à tabela

## S-TAB-PAGAMENTOS Tabela de Códigos de Pagamentos
- Onde: Ajuda pág. 363; `tabelas/pagamentos.json`
- Códigos: 01, 02, 09 a 22, 26, 30, 31, 33, 34, 36, 37, 60, 61, 62, 66, 70, 71, 72, 76, 99 (detalhe em F-PAG-xx)
- Observações: o JSON tem 42 registros (inclui códigos de doações e outros), a Ajuda lista 31 códigos de pagamento

## S-TAB-DOACOES Tabela de Códigos de Doações
- Onde: Ajuda pág. 364
- Códigos: 40, 41, 42, 43, 44, 45, 46, 47, 80, 81, 99 (detalhe em F-DOA-xx)

## S-ERROS-FREQ Erros mais Frequentes (orientação)
- Onde: Ajuda págs. 422 a 424
- Regras:
  - Valores: o programa não usa ponto como separador de centavos (1234.56 vira R$ 123.456,00); sem casas decimais acrescenta ",00".
  - CNPJ da fonte pagadora ausente ou inválido impede a gravação.
  - Omitir rendimentos (aposentadoria, ações trabalhistas, várias fontes, mesmo sem retenção) leva à malha.
  - Valores diferentes do comprovante: não subtrair isentos dos tributáveis; IRRF do 13º não se soma ao IRRF dos rendimentos.
  - Fapi recebido é tributável integral sem parcela isenta; previdência privada integral observadas as isenções.
  - Na conjunta, rendimentos do cônjuge vão na aba Dependentes.
  - Carnê-Leão pago: só Darf 0190 (quotas 0211 não entram).
  - Isenção de 65 anos: limite mensal de R$ 1.903,98 inclusive 13º, somadas todas as fontes; na conjunta, soma dos limites de cada um se ambos elegíveis; excedente transferível para Rendimentos PJ.
  - Prêmios de loteria e capitalização vão em Tributação Exclusiva (imposto não restituível).
  - CPF/CNPJ do beneficiário em Pagamentos e Doações obrigatório e válido, senão a declaração não é gravada.
  - Doação a entidade assistencial não é dedutível.
  - Imposto Complementar: só Darf 0246.
- Exige do MCP: regras de `listar_pendencias` derivadas destes erros; normalização de valores monetários na entrada

## S-REQUISITOS Requisitos e instalação do programa oficial
- Onde: Ajuda págs. 394 e 395
- Regras: roda em Linux, Windows (10 ou superior recomendado) e Mac; Java embutido; Receitanet incorporado (não precisa instalar à parte); navegador necessário; impressora recomendada para o recibo; resolução 1280x768 ou maior; instalado em "Arquivos de Programas RFB" no Windows; não roda em rede (sem controle de concorrência)
- Exige do MCP: orientação ao usuário para a etapa final no PGD (o AutoIR não substitui a instalação do PGD para transmitir)

## S-PROBLEMAS-IMPRESSAO Problemas na Impressão (orientação)
- Onde: Ajuda pág. 425
- Regras: trocar modo rascunho por normal; trocar o driver do fabricante pelo do sistema ou vice-versa; atualizar o driver
- Exige do MCP: não se aplica (o MCP gera PDF ou HTML)
