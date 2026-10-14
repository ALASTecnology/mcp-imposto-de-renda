# Notas 05: Bens e Direitos (casos especiais), Dívidas e Ônus Reais, Espólio, Doações a Partidos, Resumo da Declaração

Fonte: AjudaIRPF.pdf do IRPF 2026 versão 1.5 (texto em ajuda.txt, linhas 8725 a 11531; páginas 204 a 264 de 425).

Convenção de campos comuns da ficha Bens e Direitos usados abaixo: Grupo, Código, Discriminação, campos específicos do código (Endereço, Área Total, Unidade m2/ha, Registrado em Cartório Sim/Não, Matrícula, Nome do Cartório, CNPJ, etc.), Situação em 31/12/2024 (R$), Situação em 31/12/2025 (R$), quadros auxiliares "Aplicação Financeira (R$)" (Rendimento ou Perda, Imposto pago no Exterior) e "Lucros e Dividendos (R$)" (Valor Recebido, Imposto Pago Exterior/IRRF Brasil). O detalhamento dos campos por grupo está nas notas 04.

---

## F-BENS-ESP-BENFEITORIAS Benfeitorias
- Onde: ficha Bens e Direitos, casos especiais (pág. 206)
- Aplica-se a: Ajuste Anual (e demais tipos, por analogia)
- Campos: Discriminação; Endereço; Área Total do Imóvel; Unidade (m2 ou ha); Registrado no Cartório de Registro de Imóveis? (Sim/Não); Matrícula do Imóvel; Nome Cartório; Situação em 31/12/2024; Situação em 31/12/2025
- Validações conhecidas:
  - Imóvel adquirido após 1988: benfeitoria somada ao valor do próprio imóvel (mesmo item). Situação 31/12/2024 = valor da declaração 2025; Situação 31/12/2025 = valor anterior + benfeitorias pagas em 2025.
  - Imóvel adquirido até 1988: item próprio com código 17 (Benfeitorias) do grupo 01; Situação 31/12/2024 em branco; Situação 31/12/2025 = total dos pagamentos efetuados.
- Códigos: grupo 01 Bens Imóveis, código 17 Benfeitorias
- Regras de cálculo afetadas: custo de aquisição do imóvel (base para GCAP futuro); totais de evolução patrimonial do Resumo
- Importações/exportações: nenhuma específica
- Exige do MCP: assistente de lançamento "benfeitoria" que decide entre somar ao item existente ou criar item 01/17 conforme ano de aquisição do imóvel; validação de Situação 31/12/2024 vazia no caso 01/17
- Observações: corte em 1988 é a regra do texto

## F-BENS-ESP-CONSORCIO Consórcios
- Onde: Bens e Direitos, casos especiais (pág. 207)
- Aplica-se a: todos
- Campos: CNPJ (administradora); Discriminação (nome e CNPJ da administradora, tipo de bem, parcelas pagas e a pagar); Situação 31/12/2024; Situação 31/12/2025
- Validações conhecidas:
  - Não contemplado em 2025: código 05 grupo 99. Sit. 2024 = valor da declaração anterior; Sit. 2025 = valor anterior + parcelas pagas em 2025. Se adquirido em 2025: Sit. 2024 vazia, Sit. 2025 = parcelas pagas em 2025.
  - Contemplado em 2025: item 99/05 com Sit. 2024 = valor anterior e Sit. 2025 vazia (se adquirido em 2025, ambas vazias); e novo item com o código do bem recebido, Sit. 2024 vazia, Sit. 2025 = valor declarado + parcelas pagas em 2025.
- Códigos: grupo 99, código 05 Consórcio não contemplado
- Regras de cálculo afetadas: evolução patrimonial
- Importações/exportações: nenhuma
- Exige do MCP: fluxo guiado "consórcio contemplado" que baixa o item 99/05 e cria o item do bem; validação de CNPJ da administradora
- Observações: dívidas de bens adquiridos por consórcio não são informadas em Dívidas (ver F-DIV)

## F-BENS-ESP-LEASING Leasing
- Onde: Bens e Direitos, casos especiais (págs. 208 e 209)
- Aplica-se a: todos
- Campos: código do bem; Discriminação (dados do bem e contratante); CNPJ do contratante (campo específico no caso 99/08); Situação 31/12/2024; Situação 31/12/2025
- Validações conhecidas (4 cenários):
  1. Opção de compra exercida no fim do contrato em 2025: código do bem; Sit. 2024 = valores pagos até 2024 (vazia se contratado em 2025); Sit. 2025 = Sit. 2024 + pagos em 2025 inclusive valor residual.
  2. Contratado em 2025 com opção a ser exercida no fim do contrato: código 08 grupo 99 (Leasing com opção de compra a ser exercida no final do contrato); CNPJ do contratante obrigatório; Discriminação com total pago; Sit. 2024 e Sit. 2025 em branco.
  3. Antes de 2025 com opção exercida no ato: código do bem; Sit. 2024 e 2025 = valor do bem; ficha Dívidas com saldos remanescentes em cada data.
  4. Em 2025 com opção exercida no ato: código do bem; Sit. 2024 vazia; Sit. 2025 = valor do bem; ficha Dívidas com saldo em 31/12/2025.
  - Alienação fiduciária: Sit. 2025 = total pago; NÃO incluir dívida na ficha Dívidas e Ônus Reais.
- Códigos: grupo 99 código 08
- Regras de cálculo afetadas: evolução patrimonial; ligação Bens x Dívidas
- Importações/exportações: nenhuma
- Exige do MCP: assistente de cenário leasing que cria itens em Bens e, quando cabe, em Dívidas; regra de consistência "alienação fiduciária não gera dívida"
- Observações: nenhuma

## F-BENS-ESP-VGBL VGBL
- Onde: Bens e Direitos (pág. 210)
- Aplica-se a: todos
- Campos: CNPJ e Discriminação (seguradora); Situação 31/12/2024 (valores pagos até 31/12/2024); Situação 31/12/2025 (Sit. 2024 + pagos em 2025)
- Validações conhecidas: usar código 06 do grupo 99 para seguro de vida com cobertura por sobrevivência
- Códigos: grupo 99 código 06 VGBL
- Regras de cálculo afetadas: evolução patrimonial; não é dedução (inferido, pois PGBL é que deduz na ficha Pagamentos)
- Importações/exportações: possível origem na pré-preenchida (inferido)
- Exige do MCP: validação de CNPJ da seguradora; alerta para não lançar VGBL como pagamento dedutível (inferido)
- Observações: nenhuma

## F-BENS-ESP-PERMUTA Permuta
- Onde: Bens e Direitos (págs. 211 e 212)
- Aplica-se a: todos
- Campos: Discriminação (dados do imóvel e da contraparte); campos específicos do imóvel; Situação 31/12/2024; Situação 31/12/2025
- Validações conhecidas:
  - Sem torna: imóvel dado: Sit. 2024 = valor anterior, Sit. 2025 vazia. Imóvel recebido: Sit. 2024 vazia, Sit. 2025 = Sit. 2024 do imóvel dado.
  - Com torna paga: imóvel recebido Sit. 2025 = Sit. 2024 do bem dado + torna paga.
  - Com torna recebida: imóvel recebido Sit. 2025 = Sit. 2024 do bem dado MENOS o custo usado na apuração do ganho de capital relativo à torna (GCAP 2025).
- Códigos: códigos de imóveis do grupo 01
- Regras de cálculo afetadas: custo do novo imóvel; ganho de capital na torna recebida (GCAP)
- Importações/exportações: depende do GCAP 2025 (custo proporcional da torna)
- Exige do MCP: assistente de permuta que gera os dois itens e calcula o valor do imóvel recebido; integração com cálculo de ganho de capital para a torna
- Observações: nenhuma

## F-BENS-ESP-IMOVEL-RURAL Imóvel rural
- Onde: Bens e Direitos (pág. 213)
- Aplica-se a: todos
- Campos: Discriminação (VTN apurado no Diat da DITR exercício 2025, dados do imóvel e do alienante); campos específicos (inclui NIRF/CIB, inferido, ver notas 04); Sit. 2024; Sit. 2025
- Validações conhecidas: código 14 grupo 01. Sit. 2024 = valor da declaração anterior (vazia se adquirido em 2025). Sit. 2025 = valor declarado (terra nua) + parcelas pagas em 2025; se adquirido em 2025, valor pago pela terra nua.
  - Contribuinte sem atividade rural: benfeitorias podem integrar o custo do imóvel.
  - Contribuinte com atividade rural que deduziu benfeitorias como custeio: informar só a terra nua aqui e relacionar bens e benfeitorias no Demonstrativo da Atividade Rural.
- Códigos: grupo 01 código 14 Imóvel Rural
- Regras de cálculo afetadas: interação com Atividade Rural (evita dupla contagem)
- Importações/exportações: Atividade Rural (bens da atividade rural)
- Exige do MCP: alerta de consistência entre Bens e Demonstrativo AR
- Observações: nenhuma

## F-BENS-ESP-DOACAO Doação recebida
- Onde: Bens e Direitos (pág. 214)
- Aplica-se a: todos
- Campos: código do bem recebido; Discriminação (espécie, nome e CPF do doador); Sit. 2024 vazia; Sit. 2025 = saldo em 31/12/2025 (doação em espécie) ou valor do bem
- Validações conhecidas: Sit. 2024 não preenchida
- Códigos: código conforme o bem
- Regras de cálculo afetadas: o valor da doação recebida vai em Rendimentos Isentos (código 14 Transferências patrimoniais - doações e heranças, inferido do código); o doador informa em Doações Efetuadas (doação em espécie, com CPF do beneficiário)
- Importações/exportações: transferência entre fichas Bens x Isentos
- Exige do MCP: regra cruzada "doação recebida em Bens exige lançamento em Isentos"; validação de CPF do doador
- Observações: nenhuma

## F-BENS-ESP-HERANCA Herança, meação, legado ou doação (inclusive adiantamento da legítima)
- Onde: Bens e Direitos (pág. 215)
- Aplica-se a: todos
- Campos: Discriminação (dados do bem e forma de aquisição); Sit. 2024 vazia; Sit. 2025 = valor da última declaração do falecido ou doador, ou opcionalmente valor superior
- Validações conhecidas: transferência por valor superior ao declarado está sujeita a ganho de capital (GCAP 2025)
- Códigos: conforme o bem
- Regras de cálculo afetadas: Isentos (transferências patrimoniais); ganho de capital do transmitente
- Importações/exportações: GCAP
- Exige do MCP: alerta de ganho de capital quando valor informado maior que o do transmitente
- Observações: nenhuma

## F-BENS-ESP-DISSOLUCAO Bens recebidos por dissolução da sociedade conjugal ou união estável
- Onde: Bens e Direitos (pág. 216)
- Aplica-se a: todos
- Campos: Discriminação (dados e forma de aquisição); Sit. 2024 vazia; Sit. 2025 = valor da última declaração de quem informava o bem, ou valor de transferência se superior
- Validações conhecidas: valor superior ao declarado sujeita a ganho de capital (GCAP 2025)
- Códigos: conforme o bem; isento código 19 (meação e dissolução, inferido)
- Regras de cálculo afetadas: Isentos; GCAP
- Exige do MCP: mesmo alerta de F-BENS-ESP-HERANCA
- Observações: nenhuma

## F-BENS-ESP-EXTERIOR Bens e direitos situados no exterior
- Onde: Bens e Direitos (pág. 217)
- Aplica-se a: todos
- Campos: Discriminação (bem, valor de aquisição na moeda do país, origem dos recursos: reais, moeda estrangeira ou ambas); País (inferido de campo específico); Sit. 2024; Sit. 2025
- Validações conhecidas:
  - Sit. 2024 = valor anterior (vazia se adquirido em 2025).
  - Sit. 2025 = Sit. 2024 + parcelas pagas em 2025. Adquirido em 2025: com reais, valor pago em reais; com moeda estrangeira, valor convertido pela cotação de fechamento de venda do Bacen; origem mista, custo proporcional à origem.
- Códigos: qualquer, com país diferente de Brasil
- Regras de cálculo afetadas: ganho de capital em moeda estrangeira (GCAP)
- Importações/exportações: GCAP (bens no exterior)
- Exige do MCP: serviço de cotação Bacen (PTAX fechamento venda e compra por data); campo de origem dos recursos; conversão proporcional
- Observações: nenhuma

## F-BENS-ESP-TRANSPARENCIA Regime de Transparência Fiscal de Entidade Controlada (art. 8º da Lei 14.754/2023)
- Onde: Bens e Direitos (págs. 217, 218, 230, 231)
- Aplica-se a: Ajuste Anual
- Campos: um item por bem ou direito detido pela controlada; Discriminação com dados da controlada (localização, razão social) e declaração expressa do exercício da opção
- Validações conhecidas:
  - Opção possível para controladas adquiridas em 2025, por indicação expressa na Discriminação; irrevogável e irretratável.
  - Controladas já detidas em 31/12/2024 com opção exercida: manter a indicação e continuar declarando os bens como se fossem da pessoa física.
  - Valor de cada bem: alocação do custo de aquisição da entidade na proporção do valor de cada bem sobre o ativo total em 31/12/2025 (art. 37 IN RFB 2.180/2024).
  - Trust (ou contrato similar sob lei estrangeira não enquadrado como controlada): bens declarados diretamente pelo titular (ele ou dependente), com indicação na Discriminação (art. 11 da Lei 14.754/2023), independentemente da data de aquisição.
  - Obrigações subjacentes da controlada ou do trust: ficha Dívidas, código 16, valor 0 (ver F-DIV).
- Códigos: códigos dos bens subjacentes; dívida 16
- Regras de cálculo afetadas: tributação passa a ser como bens diretos (aplicações financeiras 15%)
- Importações/exportações: nenhuma
- Exige do MCP: marcador estruturado "opção transparência fiscal" por item; calculadora de alocação proporcional de custo; validação de que a opção é mantida em anos seguintes
- Observações: base legal arts. 36 a 39 (e 36 a 49 citado em outro trecho) da IN RFB 2.180/2024

## F-BENS-ESP-DEP-NAO-REMUNERADO Depósitos não remunerados em moeda estrangeira (conta, cartão de débito ou crédito no exterior)
- Onde: Bens e Direitos, item 1 (pág. 219)
- Aplica-se a: todos
- Campos: Discriminação (valor em moeda estrangeira, banco, número da conta); Sit. 2024 (saldo em reais da declaração anterior); Sit. 2025 (saldo em 31/12/2025 convertido pela cotação de fechamento de venda do Bacen)
- Validações conhecidas: grupo 06 código 01 (conta corrente ou conta pagamento no exterior) ou código 99 (cartão de débito ou crédito)
- Códigos: grupo 06 códigos 01 e 99
- Regras de cálculo afetadas: variação cambial isenta se não remunerado e em instituição autorizada; acréscimo patrimonial por variação cambial vai em Isentos código 99 Outros. Se não cumprir requisitos, variação cambial tributada como ganho de capital (art. 21 Lei 8.981/1995)
- Importações/exportações: nenhuma
- Exige do MCP: cálculo da variação cambial e sugestão de lançamento em Isentos 99; cotação Bacen da data do fato gerador
- Observações: nenhuma

## F-BENS-ESP-MOEDA-ESPECIE Moeda estrangeira mantida em espécie
- Onde: Bens e Direitos, item 2 (pág. 220)
- Aplica-se a: todos
- Campos: um item por moeda; Discriminação (quantidade em 31/12/2025); Sit. 2024 (valor em reais da declaração anterior); Sit. 2025 (custo médio ponderado: Sit. 2024 + aquisições em reais - alienações em reais)
- Validações conhecidas: custo da moeda adquirida em reais = valor pago; adquirida em moeda estrangeira = quantidade x cotação de fechamento de venda do Bacen na data
- Códigos: grupo 06 código 11 Dinheiro em espécie - moeda estrangeira; isento código 08 (alienações até US$ 5.000,00 no ano)
- Regras de cálculo afetadas: ganho isento até alienações de US$ 5.000,00 no ano (Isentos 08); acima disso, ganho integralmente tributado no GCAP (moeda estrangeira em espécie); imposto não compensável na DAA, Darf emitido pelo GCAP
- Importações/exportações: GCAP
- Exige do MCP: calculadora de custo médio ponderado de moeda; controle do limite de US$ 5.000,00; encaminhamento ao GCAP
- Observações: nenhuma

## F-BENS-ESP-EMPRESTIMO Empréstimo concedido
- Onde: Bens e Direitos, item 3 (pág. 220)
- Aplica-se a: todos
- Campos: Discriminação (nome e CPF do mutuário, valor recebido em 2025 se houver); Sit. 2024; Sit. 2025 (saldos)
- Validações conhecidas: CPF do mutuário
- Códigos: grupo 05 Créditos (código específico, ver notas 04, inferido)
- Regras de cálculo afetadas: evolução patrimonial; empréstimo a devedor no exterior é aplicação financeira no exterior
- Exige do MCP: validação de CPF
- Observações: nenhuma

## F-BENS-ESP-APLIC-EXTERIOR Aplicações financeiras no exterior (Lei 14.754/2023)
- Onde: Bens e Direitos, item 4 (págs. 221 e 222)
- Aplica-se a: Ajuste Anual
- Campos: um item por aplicação; Discriminação (valor em moeda estrangeira em 31/12/2025); Sit. 2024; Sit. 2025 (valor em reais ajustado a cada aplicação, liquidação ou resgate); quadro "Aplicação Financeira (R$)": Rendimento ou Perda; Imposto pago no Exterior
- Validações conhecidas:
  - Abrange depósitos remunerados, certificados de depósito, ativos virtuais e carteiras com rendimento, cotas de fundos (exceto os tratados como controladas), instrumentos financeiros, apólices resgatáveis, capitalização, fundos de pensão, títulos de renda fixa e variável, ouro ativo financeiro, mútuo com devedor no exterior, derivativos e participações não controladas.
  - Ativo virtual é considerado no exterior quando custodiado ou negociado por instituição no exterior, independentemente do emissor.
  - Entidades no exterior não controladas: grupo 04 código 99 (Outras aplicações e investimentos).
  - Rendimento ou Perda: só o valor tributável no ano (juros, remuneração recebida, ganhos inclusive variação cambial sobre o principal no resgate, amortização, alienação, vencimento ou liquidação), inclusive dividendos de participações não controladas. Não incluir lucro de controlada sujeita à Lei 14.754 (vai em "Lucros e Dividendos"). Não incluir prejuízos de controladas não sujeitas aos regimes.
  - Imposto pago no exterior: dedutível só com acordo para evitar dupla tributação ou reciprocidade; convertido pela cotação de fechamento de COMPRA do Bacen na data do pagamento; não dedutível se reembolsável; não pode ser usado de uma aplicação para outra nem contra lucro de controlada; não aproveitado no ano se perde (não vai para anos anteriores ou posteriores).
  - Conversão de valores das aplicações: cotação de fechamento de VENDA do Bacen na data de cada evento.
- Códigos: grupo 04 código 99 e demais códigos de aplicações
- Regras de cálculo afetadas: tributação separada na DAA à alíquota de 15% sobre a parcela anual, sem deduções; perdas compensam rendimentos de aplicações no mesmo período e o excedente compensa lucros e dividendos de controladas computados no mesmo período; dedução do imposto pago no exterior limitada à diferença entre IRPF com e sem o rendimento (teto do imposto brasileiro sobre aquele rendimento)
- Importações/exportações: nenhuma específica (possível relação com a ficha de tributação exclusiva código 12, ver notas 03)
- Exige do MCP: motor de apuração da Lei 14.754 (15%, compensação de perdas, limite de crédito do imposto estrangeiro por aplicação); cotações Bacen compra e venda por data; validação de não uso cruzado do crédito
- Observações: base IN RFB 2.180/2024

## F-BENS-ESP-CONTROLADAS Participação em entidades controladas no exterior
- Onde: Bens e Direitos, itens 5, 5.1, 5.1.1, 5.1.2, 5.2 (págs. 223 a 230)
- Aplica-se a: Ajuste Anual
- Campos: um item por controlada direta e por controlada indireta sujeita aos regimes; Discriminação com: percentual de participação e se é direta ou indireta; se indireta via controlada direta em transparência fiscal ou via trust; percentual de renda ativa (quando não localizada em país de tributação favorecida nem em regime privilegiado); data de aquisição; lucros ou prejuízos acumulados até 31/12/2023; lucros distribuídos no ano e se correspondem a lucros até 31/12/2023; lucros recebidos de outras controladas (razão social e localização); prejuízo do ano; saldos de "resultados abrangentes" (o texto cita 31/12/2024 em 5.1 e 31/12/2025 em 5.2); Sit. 2024; Sit. 2025 (ajustada por reduções de participação); quadro "Lucros e Dividendos (R$)": Valor Recebido; Imposto Pago Exterior/IRRF Brasil
- Validações conhecidas:
  - Controlada: preponderância nas deliberações ou poder de eleger maioria dos administradores; ou mais de 50% do capital, lucros ou ativos na liquidação, isoladamente ou com pessoas vinculadas (cônjuge, companheiro, parentes até 3º grau; PJ com diretor nessas condições; PJ com mais de 10% do capital votante do contribuinte; sócios dessas PJ).
  - Apólices de seguro resgatáveis em que o investidor influencia a estratégia são controladas.
  - Cada classe de cotas com patrimônio segregado é entidade separada.
  - Controladas indiretas sujeitas aos regimes: item próprio, independentemente da controladora.
  - Regime Anual (arts. 17 a 32 IN 2.180): obrigatório se em país de tributação favorecida ou regime privilegiado (arts. 24 e 24-A Lei 9.430/1996) ou renda ativa própria menor que 60% da renda total (renda passiva: royalties, juros, dividendos, participações, aluguéis, ganhos de capital salvo participações ou ativos permanentes com mais de 2 anos, aplicações e intermediação financeira).
  - Regime na Disponibilização (arts. 33 e 34): demais; lucro disponibilizado no pagamento, crédito, entrega, emprego ou remessa, o que ocorrer primeiro, ou em operação de crédito com a pessoa física ou vinculada se houver lucros ou reservas.
  - Prejuízo da controlada: só na Discriminação, compensável apenas com lucros da mesma controlada e só se referente a anos iniciados a partir de 01/01/2025.
  - Conversão: cotação de fechamento de venda do Bacen na data do fato gerador.
- Códigos: participações (grupo 03, inferido); créditos grupo 05 código 99 (lucros a receber)
- Regras de cálculo afetadas:
  - Regime Anual: 15% sobre a parcela anual do lucro apurado em balanço de 31/12/2025, na proporção da participação, independentemente de distribuição. Exclusões: lucros de investidas PJ no Brasil; rendimentos e ganhos no Brasil tributados por IRRF com alíquota igual ou superior a 15%; participação em outras controladas também no regime anual. Lucro apurado vai em "Valor Recebido" e também em item grupo 05 código 99 como crédito de lucros a receber (indicar controlada e ano de origem). Na distribuição posterior, reduz-se o crédito pelo valor original em reais; variação cambial entre o lucro tributado e o disponibilizado não é tributada nem dedutível e vai em Isentos código 99. Distribuição entre controladas do regime anual: transferir o crédito de uma para outra. Devoluções de capital entre controladas: realocar custo; variação cambial tributada na disponibilização.
  - Regime na Disponibilização: 15% sobre o dividendo efetivamente pago em 2025 (Valor Recebido); Discriminação com valor e ano de origem; Sit. 2025 = capital aplicado.
  - Imposto Pago Exterior/IRRF Brasil: imposto estrangeiro dedutível (art. 30 IN 2.180) e IRRF pago no Brasil sobre rendimentos da controlada incluídos no lucro tributado (art. 31).
  - Variação cambial do principal compõe ganho de capital na alienação, baixa, liquidação ou devolução de capital (GCAP 2025).
- Importações/exportações: GCAP (alienação da participação)
- Exige do MCP: classificador de regime (anual x disponibilização) a partir de país e percentual de renda ativa; motor de cálculo 15% por controlada; controle de crédito de lucros a receber (grupo 05/99) e de prejuízos por controlada desde 2025; limite de dedução do imposto estrangeiro; lista de países de tributação favorecida (tabela pública, inferido)
- Observações: o texto tem pequenas inconsistências de data (31/12/2024 x 31/12/2025 em "resultados abrangentes")

## F-BENS-ESP-DESINCORPORADOS Bens e direitos desincorporados do patrimônio em 2025
- Onde: Bens e Direitos (pág. 232)
- Aplica-se a: todos
- Campos: Discriminação (dados do bem; se alienação, nome e CPF/CNPJ do adquirente, data e valor); Sit. 2024 = valor anterior; Sit. 2025 vazia
- Validações conhecidas: Sit. 2025 não preenchida
- Regras de cálculo afetadas: alienação pode gerar rendimento tributável (GCAP ou Renda Variável)
- Exige do MCP: alerta para apurar ganho no GCAP ou na Renda Variável; validação CPF/CNPJ do adquirente
- Observações: nenhuma

## F-BENS-ESP-ADQ-ALIENADOS Bens e direitos adquiridos e alienados em 2025
- Onde: Bens e Direitos (pág. 233)
- Aplica-se a: todos
- Campos: Discriminação (valor, nomes e CPF/CNPJ de alienantes e adquirentes, datas e valores de aquisição e alienação, condições de financiamento); Sit. 2024 e Sit. 2025 vazias
- Validações conhecidas: ambas as situações em branco
- Regras de cálculo afetadas: GCAP, Renda Variável, FII ou Fiagro
- Exige do MCP: mesmo alerta de F-BENS-ESP-DESINCORPORADOS
- Observações: nenhuma

## F-BENS-ESP-NOVO-RESIDENTE Bens de quem adquiriu ou readquiriu residência no Brasil em 2025
- Onde: Bens e Direitos (págs. 234 e 235)
- Aplica-se a: Ajuste Anual
- Campos: Discriminação (dados, forma de aquisição, custo em moeda estrangeira e origem dos recursos para bens no exterior); Sit. 2024; Sit. 2025
- Validações conhecidas:
  - Declarar todo o patrimônio (Brasil e exterior, inclusive depósitos no exterior e moeda em espécie) do titular e dependentes na data da caracterização da residência.
  - Sit. 2024: bem anterior à saída do Brasil = valor da Declaração de Saída Definitiva ou da última declaração, ou custo de aquisição se não obrigado; bem no exterior adquirido como não residente = valor convertido pela cotação de venda do Bacen da data (até 31/12/1999) ou pela cotação de fechamento de venda (a partir de 01/01/2000); bem no Brasil adquirido como não residente = custo de aquisição.
  - Sit. 2025 = Sit. 2024 + valores pagos em 2025 a partir da residência.
  - Moeda sem cotação no Brasil: converter para US$ pela cotação da autoridade monetária do país e depois para reais pelo dólar de venda do Bacen.
  - Bens adquiridos até 31/12/1995 podem ser atualizados pela tabela do Anexo I da IN SRF 208/2002.
  - Sem comprovação, custo de aquisição igual a zero.
- Regras de cálculo afetadas: custo de aquisição para GCAP futuro
- Importações/exportações: nenhuma
- Exige do MCP: tabela de atualização de custo (IN SRF 208/2002, Anexo I); conversão em duas etapas via dólar; regra de custo zero sem comprovação
- Observações: dívidas do novo residente vão na Sit. 2024 da ficha Dívidas (ver F-DIV)

---

## F-DIV Dívidas e Ônus Reais
- Onde: ficha Dívidas e Ônus Reais (págs. 236 e 237)
- Aplica-se a: Ajuste Anual, Final de Espólio, Saída Definitiva
- Campos: Código (lista, tabela tipoDividas); Discriminação (natureza da dívida, nome e CPF ou CNPJ do credor); Situação em 31/12/2024 (R$); Situação em 31/12/2025 (R$); Valor Pago em 2025 (R$). Botões Novo, OK, Editar, Excluir (exclusão apaga todos os campos da linha)
- Validações conhecidas:
  - Informar dívidas do titular e dependentes; em declaração conjunta ou com bens comuns, também as do cônjuge ou companheiro.
  - Ao excluir dependente, excluir também suas dívidas.
  - Não incluir: dívidas de valor igual ou inferior a R$ 5.000,00 em 31/12/2025; financiamentos do SFH ou com bem dado em garantia (alienação fiduciária, hipoteca, penhor), conforme o texto; bens adquiridos por consórcio; dívidas da atividade rural (vão no Demonstrativo AR).
  - Transparência fiscal ou trust: obrigações subjacentes com código 16 Outras dívidas e ônus reais, valor 0, com indicação na Discriminação.
  - Novo residente em 2025: dívidas na data da residência na Sit. 31/12/2024.
  - Final de Espólio: período de 01/01 até a decisão judicial da partilha, sobrepartilha, adjudicação ou escritura (com bens ainda a inventariar que gerem rendimentos, todo o ano). Saída Definitiva: de 01/01 até a véspera da condição de não residente. Campos alternativos "Situação na data da partilha" e "Situação na data da caracterização de não residente" (ver Resumo).
- Códigos: tabela de dívidas (tipoDividas.xml), código 16 Outras dívidas e ônus reais
- Regras de cálculo afetadas: evolução patrimonial do Resumo (Dívidas em 31/12/2024 e 31/12/2025, na partilha, na não residência)
- Importações/exportações: pré-preenchida e declaração anterior (inferido)
- Exige do MCP: CRUD de dívidas; validação de CPF/CNPJ do credor; aviso de dispensa abaixo de R$ 5.000,00; consistência com leasing e alienação fiduciária (F-BENS-ESP-LEASING) e com dependentes excluídos
- Observações: o texto da ajuda coloca SFH e alienação fiduciária na lista de "não inclua"; conferir com o Perguntas e Respostas (dúvida)

---

## F-ESPOLIO Espólio (Ajuste Anual com natureza de ocupação 81)
- Onde: ficha Espólio, habilitada ao selecionar Natureza da ocupação 81 - Espólio na Identificação (pág. 238)
- Aplica-se a: Ajuste Anual de espólio (inicial e intermediárias)
- Campos: "Trata-se de uma Sobrepartilha?" (Sim/Não); Identificação do Inventariante da Partilha (se Não) ou da Sobrepartilha (se Sim): CPF (11 algarismos), Nome completo
- Validações conhecidas: Sim somente se já houver Declaração Final de Espólio de Partilha apresentada; CPF do inventariante ou do interessado com poderes de inventariante (inventário por escritura pública, arts. 610 e 611 da Lei 13.105/2015 CPC)
- Códigos: natureza de ocupação 81
- Regras de cálculo afetadas: nenhuma direta
- Exige do MCP: habilitação condicional da ficha pela natureza 81; validação de CPF; distinção partilha x sobrepartilha
- Observações: Declaração Final de Espólio tratada nas notas 06

## F-PARTIDOS Doações a Partidos Políticos e Candidatos a Cargos Eletivos
- Onde: ficha própria (págs. 239 e 240)
- Aplica-se a: Ajuste Anual, Final de Espólio, Saída Definitiva (período conforme o tipo)
- Campos: CNPJ; Nome do candidato ou partido; Valor. Botões Novo, OK, Editar, Excluir
- Validações conhecidas: relacionar todas as doações e gastos eleitorais de 2025; CNPJ válido
- Códigos: nenhum
- Regras de cálculo afetadas: NÃO dedutível; total transportado para Resumo, Outras Informações
- Importações/exportações: nenhuma
- Exige do MCP: CRUD; validação de CNPJ; informação de que não há dedução
- Observações: lista de gastos eleitorais da Lei 9.504/1997 (impressos com adesivo até 50 x 40 cm, propaganda, aluguel de locais, transporte, correspondência, comitês, remuneração de pessoal, carros de som, comícios, programas de rádio e TV, pesquisas, sites e impulsionamento com provedor sediado no País)

---

## F-RESUMO-TRIB Resumo, Rendimentos Tributáveis (modelo completo)
- Onde: Resumo da Declaração > Rendimentos Tributáveis e Deduções (pág. 242)
- Aplica-se a: todos (períodos conforme tipo)
- Campos (somente leitura, calculados):
  1. Recebidos de PJ pelo titular = total da ficha Rend. Trib. PJ Titular
  2. Recebidos de PJ pelos dependentes = total da ficha Rend. Trib. PJ Dependentes
  3. Recebidos de PF/Exterior pelo titular = total da ficha PF/Exterior Titular
  4. Recebidos de PF/Exterior pelos dependentes = total da ficha PF/Exterior Dependentes
  5. Recebidos acumuladamente pelo titular = total tributável da ficha RRA Titular, se opção "Ajuste Anual"
  6. Recebidos acumuladamente pelos dependentes = idem dependentes
  7. Resultado tributável da Atividade Rural = resultado tributável positivo (Brasil + Exterior) do Demonstrativo AR
  8. Total = soma das linhas 1 a 7
- Regras de cálculo afetadas: base de cálculo
- Exige do MCP: função de cálculo do resumo; rastreabilidade linha a linha da origem
- Observações: nenhuma

## F-RESUMO-DED Resumo, Deduções (modelo completo)
- Onde: Resumo > Rendimentos Tributáveis e Deduções (págs. 243 e 244)
- Aplica-se a: Ajuste Anual com deduções legais (e espólio e saída, quando cabíveis)
- Campos (calculados):
  1. Contribuições à previdência oficial e complementar fechada do § 15 art. 40 CF (até o limite do patrocinador) = previdência oficial das fichas PJ titular e dependentes + previdência complementar § 15 art. 40 CF (Pagamentos, código 37, até a contribuição do patrocinador) + previdência oficial das fichas PF/Exterior titular e dependentes + previdência oficial da linha 11 de Isentos (moléstia grave e acidente em serviço). Autônomo que pagou INSS informa na ficha PF/Exterior.
  2. Contribuição à previdência oficial (RRA) = soma das fichas RRA titular e dependentes, se opção Ajuste
  3. Contribuição à previdência complementar, inclusive o excedente do § 15 art. 40 CF, e Fapi = códigos 36 e 37 de Pagamentos (no 37 só o que exceder o patrocinador), limitado a 12% do total dos rendimentos tributáveis
  4. Dependentes = quantidade de dependentes x R$ 2.275,08
  5. Despesas com instrução = (pago - reembolsado/não dedutível) limitado a R$ 3.561,50 para o titular, para cada dependente e para cada alimentando
  6. Despesas médicas = total pago - não dedutível dos códigos 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 e 26 de Pagamentos (sem limite)
  7. Pensão alimentícia judicial = códigos 30 (residente) e 31 (não residente) de Pagamentos
  8. Pensão alimentícia por escritura pública (art. 733 CPC) = códigos 33 (residente) e 34 (não residente)
  9. Pensão alimentícia judicial (RRA) = soma das fichas RRA, se opção Ajuste
  10. Livro caixa = total da coluna Livro Caixa das fichas PF/Exterior titular e dependentes
  11. Total = soma de 1 a 10
- Validações conhecidas: limites de 12%, R$ 2.275,08 por dependente, R$ 3.561,50 por pessoa em instrução
- Regras de cálculo afetadas: base de cálculo = total tributável - total de deduções
- Exige do MCP: motor de deduções com limites parametrizados por exercício; explicação de cada limite aplicado
- Observações: nenhuma

## F-RESUMO-CALC Resumo, Cálculo do Imposto (deduções legais)
- Onde: Resumo > Cálculo do Imposto (págs. 245 a 252)
- Aplica-se a: todos; Saída Definitiva usa tabela proporcional
- Campos e fórmulas:
  - Base de cálculo = Total de rendimentos tributáveis - Total de deduções
  - Imposto devido = se base <= R$ 28.467,20, zero (linha em branco); senão base x alíquota / 100 - parcela a deduzir (Tabela Progressiva Anual). Faixas (usadas também no simplificado): até 28.467,20 isento; 28.467,21 a 33.919,80: 7,5%, deduz 2.135,04; 33.919,81 a 45.012,60: 15%, deduz 4.679,03; 45.012,61 a 55.976,16: 22,5%, deduz 8.054,97; acima de 55.976,16: 27,5%, deduz 10.853,78
  - Saída Definitiva: soma das tabelas mensais dos meses de janeiro até o mês da condição de não residente (ou do mês de aquisição da residência até o retorno à não residência, se no mesmo ano)
  - Dedução de incentivo = soma das doações e patrocínios dos códigos 40, 41, 42, 43, 44, 45 e 46 de Doações Efetuadas, respeitados os limites legais sobre o imposto devido
  - Imposto devido I = Imposto devido - Dedução de incentivo
  - Imposto devido RRA = calculado conforme art. 12-A da Lei 7.713/1988
  - Alíquota efetiva (%) = imposto devido / total de rendimentos tributáveis x 100
  - Total do imposto devido = Imposto devido I + Imposto devido RRA
  - Imposto pago:
    - IRRF do titular = IRRF da ficha PJ titular + IRRF RRA titular (opção Ajuste) + campos IRRF e IRRF sobre 13º do quadro auxiliar da linha 11 de Isentos
    - IRRF dos dependentes = análogo para dependentes
    - Carnê-Leão do titular = total da ficha PF/Exterior titular (Darf 0190)
    - Carnê-Leão dos dependentes = análogo
    - Imposto complementar = ficha Imposto Pago/Retido
    - Imposto pago no exterior = ficha Imposto Pago/Retido (titular e dependentes)
    - IRRF Lei 11.033/2004 = campo 03 da ficha Imposto Pago/Retido
    - Imposto retido RRA = IRRF das fichas RRA se opção "Exclusiva na Fonte"
    - Total de imposto pago = soma das 8 linhas acima
  - Imposto a restituir = Total pago - Total devido, se positivo
  - Imposto a pagar = Total devido - Total pago, se positivo
- Validações conhecidas: ver F-RESUMO-QUOTAS e F-RESUMO-BANCO
- Exige do MCP: calculadora completa e determinística; tabela progressiva anual e mensal parametrizada; cálculo RRA art. 12-A; limites de incentivo
- Observações: nenhuma

## F-RESUMO-QUOTAS Resumo, Imposto a pagar: formas de pagamento, quotas e débito automático
- Onde: Resumo > Cálculo do Imposto, Parcelamento (págs. 247 a 251, repetido 256 a 260)
- Aplica-se a: Ajuste Anual (Espólio Final e Saída: quota única)
- Campos: Número de Quotas (até 8); Valor da Quota (calculado); Débito Automático (Sim/Não); dados bancários
- Validações conhecidas:
  - Formas de pagamento: transferência eletrônica em banco autorizado; Darf em agência da rede arrecadadora; débito automático. Assalariado de repartição do governo no exterior: também ordem de pagamento via Banco do Brasil, Gecex Brasília, prefixo 1608-X.
  - Até 8 quotas mensais e sucessivas, cada quota não inferior a R$ 50,00; imposto inferior a R$ 100,00 em quota única; saldo inferior a R$ 10,00 não é recolhido e acumula para exercícios seguintes.
  - 1ª quota ou quota única até 29/05/2026; 2ª quota até 30/06/2026 com juros de 1%; 3ª a 8ª: Selic acumulada de junho/2026 até o mês anterior ao pagamento + 1% no mês do pagamento.
  - Débito automático: declaração entregue até 10/05/2026 permite a partir da quota única ou 1ª quota; de 11/05/2026 a 29/05/2026, a partir da 2ª quota (1ª paga por Darf). Somente para original ou retificadora dentro do prazo (até 29/05/2026). Cancelado se retificadora após 29/05/2026, dados bancários inexatos, CPF diferente do vinculado à conta, ou conta do tipo não solidária. Pode ser estornado (dolo, fraude, simulação) e incluído, cancelado ou alterado no e-CAC (Meu Imposto de Renda), até 23h59min59s do dia 14 para efeito no mês, depois no mês seguinte.
  - Facultado antecipar quotas sem retificar e ampliar o número de quotas até 8 via retificadora ou e-CAC.
  - Saída Definitiva: quota única até a data de entrega, sem débito automático; vale também para o imposto do ano anterior e outros débitos.
  - Exemplo do texto: saldo R$ 1.965,76 em 8 quotas = R$ 245,72.
- Exige do MCP: simulador de quotas com regras de mínimo; cálculo de juros Selic por quota (tabela Selic acumulada externa); validação de prazos de débito automático pela data de entrega; geração de Darf (código 0211, inferido; ver notas 01)
- Observações: datas de 2026 fixas no texto

## F-RESUMO-BANCO Resumo, Informações Bancárias (restituição e débito)
- Onde: Resumo > Informações Bancárias (págs. 252 e 260)
- Aplica-se a: todos
- Campos: Banco (3 algarismos, lista de bancos autorizados); Agência (sem DV); Conta e DV; opção Pix (chave = CPF do titular)
- Validações conhecidas: conta corrente individual ou conjunta de titularidade do declarante; para restituição também poupança; banco precisa estar na rede autorizada; Pix só com chave CPF do titular. Saída Definitiva sem conta no Brasil: procurador com procuração pública indica conta no Banco do Brasil; restituições não resgatadas em um ano ficam nas unidades da RFB e são pagas via Siafi
- Códigos: tabela de bancos (bancos.xml), cálculo de DV (bancos_calculo_dv.xml)
- Exige do MCP: validação de banco autorizado e de DV de conta por banco; opção Pix
- Observações: nenhuma

## F-RESUMO-SIMPL Resumo, Cálculo do Imposto (Desconto Simplificado)
- Onde: Resumo > Cálculo do Imposto (Desconto Simplificado) (págs. 253 a 260)
- Aplica-se a: Ajuste Anual
- Campos e fórmulas:
  - Rendimentos tributáveis: PJ titular; PJ dependentes; PF/Exterior titular; PF/Exterior dependentes; RRA titular e dependentes (campo rendimentos recebidos, se opção Ajuste); resultado tributável positivo da AR
  - Total dos rendimentos tributáveis = soma
  - Desconto simplificado = menor entre 20% do total e R$ 16.754,34
  - Base de cálculo = Total - Desconto simplificado
  - Imposto devido = tabela progressiva anual (faixas de F-RESUMO-CALC)
  - Imposto devido RRA = art. 12-A Lei 7.713/1988
  - Alíquota efetiva (%) = imposto devido / total tributável
  - Total de imposto devido = imposto devido + imposto devido RRA (o texto diz "base de cálculo acrescido de imposto devido RRA", erro de redação)
  - Imposto pago: IRRF titular (PJ + RRA Ajuste; sem citar linha 11 de Isentos neste modelo); IRRF dependentes; Carnê-Leão titular e dependentes (Darf 0190); Imposto complementar; Imposto pago no exterior (titular e dependentes); IRRF Lei 11.033/2004; Imposto retido RRA (opção Exclusiva); Total
  - Imposto a restituir ou a pagar = diferença
  - Quotas, débito automático, informações bancárias: iguais ao modelo completo
- Validações conhecidas: desconto substitui todas as deduções legais; dedução de incentivo não existe no simplificado (inferido pela ausência da linha)
- Exige do MCP: cálculo paralelo dos dois modelos
- Observações: diferença na composição do IRRF do titular entre os dois modelos é do texto (conferir)

## F-RESUMO-EVOL Resumo, Outras Informações: Evolução patrimonial
- Onde: Resumo > Outras Informações (pág. 261)
- Aplica-se a: todos, com linhas condicionais
- Campos (calculados): Bens e direitos em 31/12/2024; Bens e direitos na data da partilha (Final de Espólio); Bens e direitos em 31/12/2025; Bens e direitos na data da caracterização de não residente (Saída); Bens e direitos, valor da transferência (Final de Espólio); Dívidas em 31/12/2024; Dívidas em 31/12/2025; Dívidas na data da caracterização de não residente (Saída); Dívidas na data da partilha (Final de Espólio)
- Regras de cálculo afetadas: somatórios das fichas Bens e Dívidas
- Exige do MCP: totais por tipo de declaração; consistência de evolução patrimonial (variação patrimonial x rendimentos declarados, inferido)
- Observações: nenhuma

## F-RESUMO-OUTRAS Resumo, Outras Informações: demais linhas
- Onde: Resumo > Outras Informações (págs. 262 e 263)
- Aplica-se a: todos
- Campos (calculados):
  - Rendimentos isentos e não tributáveis = total da ficha Isentos
  - Rendimentos sujeitos à tributação exclusiva/definitiva = total da ficha Exclusivos
  - Rendimentos tributáveis (exigibilidade suspensa) = soma das fichas Suspensa titular e dependentes
  - Depósitos judiciais do imposto = soma das fichas Suspensa
  - Imposto pago sobre Ganhos de Capital = GCAP 2025
  - Imposto pago Ganhos de Capital Moeda Estrangeira (bens, direitos e aplicações) = GCAP 2025
  - Total do IRRF Lei 11.033/2004 informado = GCAP (participação societária) + Renda Variável + Resumo
  - Imposto pago sobre Renda Variável = imposto a pagar do demonstrativo RV comuns/day-trade e FII/Fiagro
  - Doações a partidos políticos e candidatos = soma da ficha
  - Imposto a pagar sobre ganho de capital, moeda estrangeira em espécie = GCAP 2025; Darf emitido pelo programa Ganhos de Capital; não compensável na DAA; na Saída Definitiva pago na data de entrega
  - Imposto diferido dos Ganhos de Capital = GCAP 2025
  - Imposto devido sobre Ganhos de Capital = GCAP 2025
  - Imposto devido sobre ganho líquido em Renda Variável = RV e FII/Fiagro
  - Imposto devido sobre Ganhos de Capital Moeda Estrangeira (bens, direitos e aplicações) = GCAP 2025
- Importações/exportações: importação do GCAP 2025 alimenta estas linhas
- Exige do MCP: agregação a partir dos demonstrativos; importação GCAP
- Observações: nenhuma

## F-RESUMO-OPCAO Opção pela Tributação (Ajuste Anual)
- Onde: Resumo > Opção pela Tributação (pág. 264)
- Aplica-se a: Ajuste Anual
- Campos: comparativo dos dois modelos; opção (Deduções legais, marcada por padrão; Desconto simplificado)
- Validações conhecidas: troca de opção é automática e preserva as deduções informadas, salvo se excluídas. Excluir dependente na ficha Dependentes exclui automaticamente seus dados em Rend. PJ Dependentes, PF/Exterior Dependentes, Pagamentos, Doações Efetuadas, Ganhos de Capital e Renda Variável (Imposto a Pagar); o usuário precisa excluir à mão os Isentos, Exclusivos, Bens e Dívidas desses dependentes
- Regras de cálculo afetadas: escolhe o modelo do cálculo final
- Exige do MCP: ferramenta de comparação e recomendação do modelo mais vantajoso; ferramenta de troca de opção; exclusão em cascata de dependente com aviso das fichas que exigem ação manual
- Observações: nenhuma
