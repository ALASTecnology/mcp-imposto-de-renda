// Arquivo gerado por tools/mapeamento/gera_ajuda.mjs a partir de docs/mapeamento/notas.
// Não edite à mão: altere as notas e rode o gerador.
import type { AtalhoPrograma, TopicoAjuda } from "./tipos.js";

export const TOPICOS_AJUDA: readonly TopicoAjuda[] = [
 {
  "id": "T-AJUSTE",
  "nome": "Declaração de Ajuste Anual",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba \"Nova\" da tela \"O que você deseja fazer?\"; Ajuda pág. 5"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos",
    "texto": "não se aplica (tipo de declaração)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "deve ser apresentada pela pessoa física residente no Brasil obrigada (ver G-OBRIG). Desobrigado pode apresentar (G-OBRIG, atenção 2)."
   },
   {
    "campo": "Códigos",
    "texto": "código Receitanet 2600 (do layout, não da Ajuda)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "todas as fichas de ajuste; opção completa ou simplificada (G-REGIME)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "iniciar importando declaração de 2025, a partir da pré-preenchida, ou em branco"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "T-ESPOLIO-FINAL",
  "nome": "Declaração Final de Espólio",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba \"Nova\"; Ajuda pág. 6"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Final de Espólio"
   },
   {
    "campo": "Campos",
    "texto": "não se aplica"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "apresentada pelo inventariante, cônjuge ou companheiro, sucessor a qualquer título ou representante do de cujus, quando a decisão judicial transitada em julgado da partilha, sobrepartilha ou adjudicação, ou a lavratura da escritura pública de inventário e partilha, ocorreu no ano-calendário 2025. Havendo bens a inventariar, a DFE é obrigatória. Se partilha e falecimento no mesmo ano, apresentar só uma DFE."
   },
   {
    "campo": "Códigos",
    "texto": "Receitanet 2621 (layout)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "período de 1º/01 até a data da decisão judicial ou escritura; se ainda houver bens a inventariar que gerem rendimentos, informar rendimentos de todo o ano-calendário (pág. 22)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma citada aqui"
   },
   {
    "campo": "Observações",
    "texto": "ver G-ESPOLIO-FINAL para detalhes de sobrepartilha"
   }
  ]
 },
 {
  "id": "T-SAIDA",
  "nome": "Declaração de Saída Definitiva do País",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba \"Nova\"; Ajuda pág. 7"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Saída Definitiva"
   },
   {
    "campo": "Campos",
    "texto": "não se aplica"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "pessoa física que em 2025 se retirou do Brasil em caráter permanente, ou passou à condição de não residente após saída temporária (mais de 12 meses consecutivos de ausência)"
   },
   {
    "campo": "Códigos",
    "texto": "Receitanet 2620 (layout)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "período de 1º/01 até o dia anterior ao da caracterização da condição de não residente (pág. 22); imposto recolhido em quota única (pág. 18)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma citada aqui"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "T-PROGRAMAS",
  "nome": "Programas relacionados disponibilizados pela RFB",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 8"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "tabela nome, sigla, finalidade"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "nenhuma"
   },
   {
    "campo": "Códigos",
    "texto": "GCAP2025 (ganhos de capital de 2025, exporta para IRPF2026); Carnê-Leão (ano-calendário 2025, acesso via e-CAC, \"Meu Imposto de Renda\" > \"Declarações\" > \"Acessar Carnê-Leão\", exporta para IRPF2026); AR2025 (livro Caixa da atividade rural 2025, exporta para IRPF2026); IRPF2026 (ajuste, final de espólio, saída definitiva); GCAP2026 e AR2026 (exportam para IRPF2027)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "nenhuma direta"
   },
   {
    "campo": "Importações/exportações",
    "texto": "GCAP2025, Carnê-Leão 2025 e AR2025 exportam dados importáveis no IRPF2026"
   },
   {
    "campo": "Observações",
    "texto": "no PGD 2026 o GCAP está embutido como demonstrativo (ver notas de GCAP)"
   }
  ]
 },
 {
  "id": "G-CASADO",
  "nome": "Contribuinte casado",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 10, Situações Individuais"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos",
    "texto": "não se aplica"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "declaração em separado ou, opcionalmente, em conjunto"
   },
   {
    "campo": "Códigos",
    "texto": "nenhum"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "separado, opção a: cada cônjuge inclui rendimentos próprios + 50% dos rendimentos de bens comuns, compensando 50% do imposto pago/retido sobre esses rendimentos, independentemente de quem sofreu a retenção; opção b: um cônjuge inclui 100% dos rendimentos de bens comuns e compensa 100% do imposto; o outro só os próprios. Conjunta: em nome de um dos cônjuges, com todos os rendimentos de ambos, inclusive de bens com cláusula de incomunicabilidade ou inalienabilidade e pensões de gozo privativo."
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "separado de fato segue as regras do casado (pág. 10)"
   }
  ]
 },
 {
  "id": "G-COMPANHEIRO",
  "nome": "Contribuinte que tenha companheiro",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 10"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos",
    "texto": "não se aplica"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "separado ou em conjunto com o companheiro"
   },
   {
    "campo": "Códigos",
    "texto": "nenhum"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "separado: rendimentos próprios + 50% dos rendimentos de bens em condomínio, salvo contrato escrito com outro percentual; imposto compensável na mesma proporção. Conjunta: em nome de um dos companheiros, com o total dos rendimentos."
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "G-SEPARADO-FATO",
  "nome": "Contribuinte separado de fato",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 10"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Regras",
    "texto": "segue as instruções do contribuinte casado"
   }
  ]
 },
 {
  "id": "G-DIVORCIADO",
  "nome": "Contribuinte separado judicialmente, divorciado, que dissolveu união estável ou separado/divorciado por escritura pública",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 11"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "declara como solteiro se não casado nem em união estável em 31/12/2025. Pode incluir dependente de quem detenha guarda judicial (com os rendimentos dele) ou deduzir pensão alimentícia paga por decisão judicial, alimentos provisionais, acordo homologado judicialmente ou escritura pública. Responsável pela guarda de filhos obrigados a declarar: declaração em separado para cada filho, ainda que menor, ou opcionalmente em conjunto, incluindo rendimentos, bens e direitos dos filhos."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "rendimentos de dependentes vão nas abas Dependentes das fichas Rendimentos Tributáveis de PJ, de PF/Exterior e Imposto Pago/Retido; bens e dívidas dos dependentes em Bens e Direitos e Dívidas e Ônus Reais"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "G-VIUVO",
  "nome": "Contribuinte viúvo",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 11"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "declara com o próprio CPF os rendimentos próprios; no curso do inventário pode optar por tributar 50% dos rendimentos de bens comuns na própria declaração ou integralmente na declaração do espólio"
   }
  ]
 },
 {
  "id": "G-MENOR",
  "nome": "Contribuinte menor",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 11"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "declaração em nome do menor, com o CPF dele. Opcionalmente dependente de um dos pais ou de quem o crie, eduque e detenha a guarda judicial. Menor sob guarda por sentença ou acordo homologado: tributação em conjunto só com quem detém a guarda judicial."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "rendimentos do menor nas abas Dependentes das fichas de rendimentos e Imposto Pago/Retido"
   }
  ]
 },
 {
  "id": "G-EMANCIPADO",
  "nome": "Contribuinte menor emancipado",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 12"
   },
   {
    "campo": "Regras",
    "texto": "declaração própria; opcionalmente dependente de um dos pais se preencher os requisitos"
   }
  ]
 },
 {
  "id": "G-INCAPAZ",
  "nome": "Contribuinte incapaz",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 12"
   },
   {
    "campo": "Regras",
    "texto": "declaração em nome do incapaz, feita por tutor, curador ou responsável pela guarda judicial; opcionalmente dependente desses, incluindo rendimentos, bens e direitos do incapaz"
   }
  ]
 },
 {
  "id": "G-ESPOLIO",
  "nome": "Declaração do espólio (inicial e intermediárias)",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 12 a 14"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Espólio inicial e intermediária (Ajuste Anual com natureza de ocupação 81)"
   },
   {
    "campo": "Campos",
    "texto": "Identificação com CPF e nome da pessoa falecida, endereço residencial na data do falecimento; natureza da ocupação 81 (Espólio); ocupação principal e código em branco; ficha Espólio com nome, CPF e endereço do inventariante (ou interessado com poderes de inventariante)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "natureza 81 exige ocupação principal em branco; espólio é contribuinte distinto de meeiro, herdeiros e legatários; mesmos prazos e obrigatoriedade das pessoas físicas. Apresentada por: (a) cônjuge meeiro, sucessor ou representante, enquanto não iniciado o inventário; (b) inventariante após abertura do inventário; (c) interessado com poderes de inventariante, em inventário e partilha por escritura pública (arts. 610 e 611 da Lei 13.105/2015, CPC). Dependentes são os da ficha Dependentes desde que mantenham a condição até o falecimento."
   },
   {
    "campo": "Códigos",
    "texto": "natureza da ocupação 81"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "rendimentos próprios + 50% dos rendimentos de bens comuns recebidos no ano (opcionalmente 100% em nome do espólio, compensando 100% do imposto); união estável: 50% ou percentual contratual dos bens em condomínio; bens e direitos do inventário e obrigações do espólio"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "Declaração inicial = ano-calendário do falecimento. Falecimento a partir de 1º/01/2026 e antes da entrega da declaração de 2025: não é declaração de espólio; apresentar normalmente pelos mesmos responsáveis (a, b, c), igual para exercícios anteriores não entregues. Intermediárias = anos seguintes ao falecimento até o ano anterior ao da decisão judicial da partilha ou escritura."
   }
  ]
 },
 {
  "id": "G-ESPOLIO-FINAL",
  "nome": "Regras da Declaração Final de Espólio e sobrepartilha",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 14 e 15"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Final de Espólio; Ajuste Anual com natureza 81"
   },
   {
    "campo": "Campos",
    "texto": "ficha Espólio: \"Final de Espólio\" com opções \"Partilha\" (habilita aba Partilha), \"Sobrepartilha\" (habilita aba Sobrepartilha), \"Partilha e Sobrepartilha\" (habilita as duas); \"Ainda há bens a inventariar?\" (habilita CPF e Nome do inventariante); Bens e Direitos: \"Bem a inventariar\", \"Situação em 31/12/2024 (R$)\", \"Situação em 31/12/2025 (R$)\", \"Situação na data da partilha (R$)\", \"Valor de transferência (R$)\", \"%\", dados dos herdeiros"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "bem a inventariar é informado como bem de ajuste anual, sem as obrigatoriedades da DFE; bens partilhados ou sobrepartilhados com trânsito em julgado em 2025 informam herdeiros e valores de transferência, sem marcar \"Bem a inventariar\" e selecionando \"%\""
   },
   {
    "campo": "Códigos",
    "texto": "natureza 81"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "a responsabilidade pelos tributos até o falecimento é do espólio; até a partilha, do sucessor e do cônjuge meeiro, limitada ao quinhão, legado, herança ou meação"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "caso de partilha transitada a partir de 1º/03/2025 com sobrepartilha iniciada sem decisão em 2025: marcar \"Ainda há bens a inventariar\" e \"Bem a inventariar\" em cada bem não inventariado"
   }
  ]
 },
 {
  "id": "G-AUSENTE-SERVICO",
  "nome": "Contribuinte ausente no exterior a serviço do Brasil",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 17 e 18"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos",
    "texto": "Endereço no Exterior; \"Cód EX\" (código do posto do Ministério das Relações Exteriores mais próximo da residência)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "obrigado como residente. Aplica-se a servidor civil ou militar em missão no exterior, funcionário da administração federal direta (CLT), indireta e fundações, do Legislativo, Judiciário e TCU, e no que couber DF, estados e municípios, e pessoa designada pelo Presidente da República. Empresa pública e sociedade de economia mista a serviço próprio no exterior: não são ausentes a serviço do Brasil."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "25% dos rendimentos do trabalho assalariado em moeda estrangeira do Governo Brasileiro são tributáveis; 75% não tributáveis; todas as deduções legais cabíveis"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "formas de pagamento iguais a P-FORMAS, inclusive remessa de ordem de pagamento via Banco do Brasil, Gecex Brasília-DF, prefixo 1608-X, em reais ou moeda estrangeira"
   }
  ]
 },
 {
  "id": "G-AUSENTE-OUTROS",
  "nome": "Contribuinte ausente no exterior exceto a serviço do Brasil",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 18 e 19"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Saída Definitiva; Ajuste Anual"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "saída permanente ou ausência temporária por mais de 12 meses consecutivos obriga a Declaração de Saída Definitiva, relativa ao período de residente no ano da caracterização, com recolhimento em quota única. Sem DSDP, é residente durante os primeiros 12 meses consecutivos; vira não residente no dia seguinte ao fim desses 12 meses."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "enquanto residente, ajuste anual normal observando tratados e reciprocidade; após não residência, rendimentos no Brasil tributados exclusivamente na fonte, e ganho de capital e renda variável de forma definitiva, dispensada declaração"
   },
   {
    "campo": "Observações",
    "texto": "débito automático conforme P-DEBITO"
   }
  ]
 },
 {
  "id": "G-RESIDENTE",
  "nome": "Contribuinte que adquiriu ou readquiriu a condição de residente",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 19 e 20"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos",
    "texto": "Identificação, pergunta \"Era residente no exterior e passou a ser residente no país em 2025?\" (citada no índice da pág. 44)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "residente: (a) visto permanente, desde a chegada; (b) visto temporário: para trabalho com vínculo ou médico bolsista do Programa Mais Médicos (Lei 12.871/2013), desde a chegada; obtendo visto permanente ou vínculo antes de 184 dias de permanência em até 12 meses, a partir da data do visto ou do trabalho; por outro motivo, permanência superior a 183 dias em até 12 meses, a partir do 184º dia; se ficar até 183 dias, novo período de 12 meses conta do ingresso seguinte; (c) brasileiro não residente que retorna com ânimo definitivo, na data da chegada"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "rendimentos do período de não residente: fonte no exterior em Isentos e Não Tributáveis; fonte no Brasil em Tributação Exclusiva/Definitiva; após residência, tributação normal"
   },
   {
    "campo": "Observações",
    "texto": "obrigatoriedade VII"
   }
  ]
 },
 {
  "id": "G-DIPLOMATICO",
  "nome": "Rendimentos de representações diplomáticas e organismos internacionais no Brasil",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 20"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "isentos os rendimentos do trabalho assalariado de servidor diplomático estrangeiro, servidor estrangeiro de organismo internacional com isenção por tratado, servidor não brasileiro de embaixada/consulado com reciprocidade; demais rendimentos no Brasil exclusivos na fonte ou definitivos (ganho de capital e renda variável)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "isenção não alcança servidor brasileiro com residência permanente no Brasil ou estrangeiro que virou residente; esses recolhem carnê-leão e declaram"
   }
  ]
 },
 {
  "id": "G-CONVERSAO",
  "nome": "Conversão em reais de rendimentos ou pagamentos em moeda estrangeira",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 21"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "converter para dólar dos EUA pela autoridade monetária do país de origem na data do recebimento/pagamento e depois para reais pelo dólar do Banco Central do último dia útil da primeira quinzena do mês anterior. Rendimentos e imposto pago em favor do empregado: cotação de compra do mês anterior ao recebimento; deduções: cotação de venda do mês anterior ao pagamento."
   },
   {
    "campo": "Importações/exportações",
    "texto": "tabela \"Conversão para Reais do Dólar dos Estados Unidos da América em 2025\" (seção Tabelas)"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "G-REND-TRAB",
  "nome": "Rendimentos do trabalho (tributáveis)",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 23 e 24"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "tributáveis: salários, férias, aposentadoria, reserva, reforma, pensões, retiradas, gratificações, participações no lucro, verbas de representação, estagiários e residentes; benefícios de previdência complementar, PGBL e Fapi; resgates (exceto contribuições pagas entre 1º/01/1989 e 31/12/1995); VGBL: diferença positiva entre recebido e prêmios pagos; parcela de aposentadoria/pensão de 65 anos ou mais que exceder R$ 1.903,98 mensais (janeiro a dezembro) a partir do mês em que completou 65 anos (a parcela isenta vai no código 10 dos isentos); pro labore e aluguéis de sócios; despesas pagas pelo empregador em favor do empregado (aluguel, previdência, IR, seguro de vida, locomoção); 25% do assalariado em moeda estrangeira de servidor no exterior; profissões, autônomos, representante comercial; emolumentos de serventuários; empreitada individual; direitos autorais explorados pelo autor; VPI (Lei 10.698/2003) e abono de permanência (§ 19 do art. 40 da CF, EC 41/2003, art. 7º da Lei 10.887/2004); no mínimo 10% dos rendimentos de garimpeiros; no mínimo 10% do transporte de carga e serviços com trator e máquinas; no mínimo 60% do transporte de passageiros (veículo próprio ou locado conduzido pelo contribuinte)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "optante pela tributação exclusiva da Lei 11.053/2004 (arts. 1º e 2º) declara benefícios e resgates de previdência complementar em Tributação Exclusiva, e o imposto não é compensável; autônomo que prestou serviço só a PJ e escriturou livro caixa preenche apenas a coluna Livro Caixa (aba \"Outras Informações\" da ficha PF/Exterior); pessoa física com mais de um veículo/máquina explorados com outros ou com operador contratado equipara-se a PJ"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "G-ALUGUEIS",
  "nome": "Rendimentos de aluguéis",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 25"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "ocupação, sublocação, uso ou exploração de bens móveis e imóveis, royalties, direitos (inclusive autorais não recebidos pelo autor). De PJ: ficha Rendimentos de PJ; de PF: aba \"Outras Informações\" da ficha PF/Exterior. Cessão gratuita de imóvel (exceto a cônjuge, pais ou filhos): rendimento anual de aluguel de 10% do valor venal (pode usar o IPTU do ano). Exclusões, se ônus exclusivo do locador: impostos, taxas e emolumentos do bem; aluguel pago por imóvel sublocado; despesas de cobrança ou recebimento; condomínio."
   }
  ]
 },
 {
  "id": "G-AR-RESULTADO",
  "nome": "Resultado tributável da atividade rural",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 25"
   },
   {
    "campo": "Regras",
    "texto": "resultado positivo do Demonstrativo da Atividade Rural é rendimento tributável na declaração"
   }
  ]
 },
 {
  "id": "G-RRA",
  "nome": "Rendimentos recebidos acumuladamente (regra geral)",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 25 e 26"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "rendimento tributável inclui acréscimos, juros e 13º, excluídas despesas com a ação judicial (inclusive advogados) pagas e não indenizadas; essas despesas são proporcionalizadas entre tributáveis, exclusivos e isentos"
   },
   {
    "campo": "Códigos",
    "texto": "Pagamentos Efetuados 60 (honorários de ações judiciais, exceto trabalhistas) e 61 (honorários de ações trabalhistas), com CPF do advogado ou CNPJ do escritório, nome e valor"
   }
  ]
 },
 {
  "id": "G-OUTROS-REND",
  "nome": "Outros rendimentos tributáveis",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 26"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "lucros apurados desde 1º/01/1996 distribuídos em 2025 que excedam o valor apurado na escrituração (lucro real, presumido ou arbitrado); rendimentos de capital no exterior (aplicações financeiras e lucros/dividendos de controladas); reajuste e juros na alienação a prazo de bens adquiridos em reais; acréscimo patrimonial a descoberto; resgate e rendimentos de partes beneficiárias ou de fundador; lucro do comércio ou indústria de não habitual"
   }
  ]
 },
 {
  "id": "G-OBRIG",
  "nome": "Obrigatoriedade de apresentação da Declaração de Ajuste Anual 2026",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 28 e 29"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "obrigado o residente que, em 2025: I) recebeu rendimentos tributáveis acima de R$ 35.584,00; II) rendimentos isentos, não tributáveis ou exclusivos acima de R$ 200.000,00; III) ganho de capital sujeito a imposto em qualquer mês; IV) operações em bolsa com soma de alienações acima de R$ 40.000,00 ou com ganhos líquidos tributáveis; V) atividade rural com receita bruta acima de R$ 177.920,00 ou que pretenda compensar prejuízos de anos anteriores ou de 2025; VI) bens e direitos (inclusive terra nua) acima de R$ 800.000,00 em 31/12; VII) passou a ser residente e estava nessa condição em 31/12; VIII) optou pela isenção do ganho de capital na venda de imóvel residencial com reaplicação em imóvel residencial no País em 180 dias (art. 39 da Lei 11.196/2005); IX) optou pelo regime de transparência fiscal de entidade controlada no exterior (art. 8º da Lei 14.754/2023); X) titular de trust em 31/12 (arts. 10 a 13 da Lei 14.754/2023); XI) aplicações financeiras no exterior (arts. 2º a 4º e 9º da Lei 14.754/2023): auferiu rendimentos ou pretende compensar perdas; XII) lucros ou dividendos de entidades no exterior (arts. 2º e 5º a 6º-A da Lei 14.754/2023)"
   },
   {
    "campo": "Dispensas",
    "texto": "cônjuge cujos bens comuns são declarados pelo outro, se não se enquadrar em outra hipótese e bens privativos até R$ 800.000,00; quem consta como dependente em declaração de outra pessoa com seus rendimentos, bens e direitos"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "rendimentos dos dependentes somam-se aos do titular para os limites de I e II; quem se enquadra em I a IV e VI a XI com resultado positivo da atividade rural também preenche o Demonstrativo da Atividade Rural"
   },
   {
    "campo": "Observações",
    "texto": "desobrigado pode apresentar"
   }
  ]
 },
 {
  "id": "G-REGIME",
  "nome": "Regime de tributação (deduções legais ou desconto simplificado)",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 29"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual (inferido; espólio inicial e intermediário também)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "deduções legais: todas as deduções comprovadas; desconto simplificado: 20% dos rendimentos tributáveis, limitado a R$ 16.754,34, substituindo todas as deduções, sem comprovação"
   },
   {
    "campo": "Observações",
    "texto": "troca de opção na retificadora só até 29/05/2026 (G-RETIF)"
   }
  ]
 },
 {
  "id": "G-PREENCHIMENTO",
  "nome": "Forma de preenchimento e pré-preenchida",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 30 e 31"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Regras",
    "texto": "elaborada no computador com o IRPF2026 (PGD) ou pelo \"Meu Imposto de Renda\" (site e apps Android/iOS), com autenticação gov.br nível Ouro ou Prata. A pré-preenchida contém rendimentos tributáveis, isentos, exclusivos, deduções, bens e direitos, dívidas e ônus, operações com criptoativos (IN RFB 1.888/2019) e dados de convênios; acesso só com cidadão autenticado no gov.br."
   },
   {
    "campo": "Importações/exportações",
    "texto": "importação de comprovante eletrônico de rendimentos (informe da fonte pagadora) e de pagamentos de serviços médicos e de saúde (informe do plano de saúde)"
   },
   {
    "campo": "Observações",
    "texto": "o MCP não autentica no gov.br (inferido); depende do arquivo baixado pelo usuário"
   }
  ]
 },
 {
  "id": "G-PRAZO",
  "nome": "Prazo e local de apresentação",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 31"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual, Espólio, Saída"
   },
   {
    "campo": "Regras",
    "texto": "pela Internet, com o programa de transmissão Receitanet (ou \"Meu Imposto de Renda\"), até 23h59min59s (horário de Brasília) de 29/05/2026"
   }
  ]
 },
 {
  "id": "G-MULTA-ATRASO",
  "nome": "Multa por atraso na entrega (MAED)",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 31 e 32"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos os obrigados"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "entrega após 29/05/2026: com imposto devido (mesmo pago), 1% ao mês ou fração sobre o imposto devido, mínimo R$ 165,74 e máximo 20% do imposto devido; sem imposto devido, R$ 165,74. Termo inicial: dia seguinte ao prazo; termo final: mês da entrega ou do lançamento de ofício. Não paga no vencimento da notificação emitida pelo PGD, é deduzida da restituição com acréscimos. Sem multa para desobrigado."
   }
  ]
 },
 {
  "id": "G-RETIF",
  "nome": "Retificação da declaração",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 32"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "\"Que tipo de declaração você deseja fazer?\" opção \"Declaração retificadora\"; número do recibo da declaração imediatamente anterior do exercício 2026 (obrigatório; obtido na folha 2 do recibo ou no menu Declaração > Abrir)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "retificadora substitui integralmente a anterior, com a mesma natureza; deve conter todas as informações; troca entre deduções legais e simplificado só até 29/05/2026, depois mantém a opção anterior"
   },
   {
    "campo": "Caminhos no PGD",
    "texto": "tela \"O que você deseja fazer?\" aba \"Transmitidas\", ícone de retificar; barra lateral Declaração > Retificar; ficha Identificação, pergunta do tipo de declaração"
   },
   {
    "campo": "Importações/exportações",
    "texto": "entrega pela Internet (Receitanet ou \"Meu Imposto de Renda\", serviço \"Preencher Declaração Online\" no e-CAC); após 29/05/2026 também em mídia removível (pen drive, HD externo) nas unidades da RFB"
   }
  ]
 },
 {
  "id": "G-APOS-PRAZO",
  "nome": "Locais de apresentação após o prazo",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 32 e 33"
   },
   {
    "campo": "Regras",
    "texto": "após 29/05/2026, inclusive retificadora: Internet ou mídia removível nas unidades da RFB"
   }
  ]
 },
 {
  "id": "G-EXERC-ANT",
  "nome": "Declaração de exercícios anteriores",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 33"
   },
   {
    "campo": "Regras",
    "texto": "usar o programa do exercício correspondente (ex.: IRPF 2025 para ano-calendário 2024); entrega pela Internet ou mídia removível nas unidades da RFB"
   }
  ]
 },
 {
  "id": "P-DARF",
  "nome": "Preenchimento do Darf do IRPF",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 33 e 34; menu Declaração > Imprimir > Darf do IRPF; ícone impressora > Darf do IRPF; barra lateral Imprimir > Darf do IRPF"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos com imposto a pagar"
   },
   {
    "campo": "Campos",
    "texto": "Número CPF (preenchido pelo programa); Nome (programa); Período de Apuração (31/12/2025); Data de Vencimento (programa, por quota); Número do Documento (gerado pelo programa); Código da Receita 0211; Principal (valor da quota); Multa (ver P-APOS-PRAZO); Juros (a partir da 2ª quota, conforme P-QUOTAS-PRAZO); Total"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "no prazo, 1ª quota ou única: Total = Principal; demais: Principal + Juros. Após o prazo: Principal + Multa + Juros. O programa emite Darf em uma via. Vencimento ocorre independentemente da entrega."
   },
   {
    "campo": "Códigos",
    "texto": "receita 0211 (IRPF ajuste)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "quotas, juros, multa de mora"
   },
   {
    "campo": "Importações/exportações",
    "texto": "impressão (PDF)"
   },
   {
    "campo": "Observações",
    "texto": "número do documento é gerado pelo PGD (inferido: o MCP pode não reproduzir o número oficial)"
   }
  ]
 },
 {
  "id": "P-FORMAS",
  "nome": "Formas de pagamento do imposto",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 18, 19, 33, 37"
   },
   {
    "campo": "Regras",
    "texto": "transferência eletrônica em instituições autorizadas; Darf em agência da rede arrecadadora ou caixa eletrônico; débito automático (P-DEBITO); remessa de ordem de pagamento pelo Banco do Brasil Gecex Brasília-DF prefixo 1608-X (ausente no exterior a serviço do Brasil)"
   }
  ]
 },
 {
  "id": "P-DEBITO",
  "nome": "Débito automático das quotas",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 18, 19, 33, 37"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "entrega até 10/05/2026 permite débito da quota única ou a partir da 1ª quota; entrega de 11/05/2026 a 29/05/2026 permite débito só a partir da 2ª quota, e a 1ª é paga por outra forma"
   },
   {
    "campo": "Campos",
    "texto": "banco, agência e conta (na ficha de resumo, inferido; detalhado em outras notas)"
   }
  ]
 },
 {
  "id": "P-PARCEL",
  "nome": "Parcelamento do imposto",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 34 e 35"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "saldo inferior a R$ 10,00 não é recolhido e acumula para exercícios seguintes até atingir R$ 10,00; de R$ 10,00 a menos de R$ 100,00, quota única; R$ 100,00 ou mais, até 8 quotas mensais e sucessivas, cada uma não inferior a R$ 50,00. 1ª quota ou única até 29/05/2026 sem acréscimo; 2ª até 30/06/2026 com 1% de juros; demais com Selic acumulada desde 01/06/2026 até o mês anterior ao pagamento mais 1% no mês do pagamento."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "facultado antecipar total ou parcialmente sem retificar; facultado ampliar o número de quotas até o vencimento da última desejada (máximo 8) por retificadora ou pelo \"Meu Imposto de Renda (Extrato da DIRPF)\""
   }
  ]
 },
 {
  "id": "P-QUOTAS-PRAZO",
  "nome": "Valor das quotas pagas dentro do prazo",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 35 a 38"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "1ª ou única: valor apurado; 2ª: +1%; 3ª: + Selic de junho/2026 + 1%; 4ª: + Selic junho e julho + 1%; 5ª: + Selic junho a agosto + 1%; 6ª: + Selic junho a setembro + 1%; 7ª: + Selic junho a outubro + 1%; 8ª: + Selic junho a novembro + 1%. Selic é pós-fixada, conhecida no 1º dia útil do mês seguinte; obtida no site da RFB."
   }
  ]
 },
 {
  "id": "P-VENC",
  "nome": "Vencimento das quotas",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 38"
   },
   {
    "campo": "Datas",
    "texto": "1ª ou única 29/05/2026; 2ª 30/06/2026; 3ª 31/07/2026; 4ª 31/08/2026; 5ª 30/09/2026; 6ª 30/10/2026; 7ª 30/11/2026; 8ª 30/12/2026"
   }
  ]
 },
 {
  "id": "P-APOS-PRAZO",
  "nome": "Pagamento após o prazo",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 38"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "multa de mora de 0,33% por dia de atraso sobre o principal, a partir do 1º dia útil seguinte ao vencimento, limitada a 20%; juros de mora pela Selic acumulada de junho/2026 até o mês anterior ao pagamento + 1% no mês do pagamento; atraso da 1ª ou única paga em junho/2026: juros de 1%; total = principal + multa + juros"
   }
  ]
 },
 {
  "id": "M-INICIAL",
  "nome": "Tela \"O que você deseja fazer?\"",
  "fonte": "docs/mapeamento/notas/01-gerais.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "tela de entrada; Ajuda pág. 39"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "aba \"Boas-vindas\" (mensagens, dicas, novidades); links úteis; botão \"Entrar com gov.br\"; aba \"Nova\": Declaração de Ajuste Anual, Final de Espólio ou Saída Definitiva, e modo \"Iniciar Importando Declaração de 2025\", \"Iniciar Declaração a partir da Pré-Preenchida\" ou \"Iniciar Declaração em Branco\"; aba \"Em Preenchimento\": pesquisa por nome; ícones Abrir, Excluir, Entregar, Imprimir, Gravar Cópia de Segurança; aba \"Transmitidas\": pesquisa por nome; ícones Abrir, Retificar, Imprimir (Declaração, Recibo de Entrega, Darf do IRPF), Gravar Cópia de Segurança e Recibo"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "login gov.br obrigatório para obter a pré-preenchida (Identidade Digital Ouro ou Prata) e importar demonstrativo do Carnê-Leão; para obter rendimentos de dependentes na pré-preenchida, os dependentes devem dar procuração eletrônica ao CPF do titular"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-INICIO",
  "nome": "Aba Início",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "primeira aba do programa; pág. 41"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "nenhum; painel com ícones de atalho para as fichas mais relevantes, escolhidas a partir do histórico de utilização. Demais fichas pelo menu lateral à esquerda."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "nenhuma"
   },
   {
    "campo": "Códigos",
    "texto": "nenhum"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "nenhuma"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "\"a partir do histórico de utilização\" sugere priorização dinâmica; o MCP pode sugerir fichas com base nos dados já informados (inferido)."
   }
  ]
 },
 {
  "id": "F-IDENT",
  "nome": "Identificação do Contribuinte (visão geral)",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha Identificação do Contribuinte; págs. 41 a 46"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (com particularidades para Espólio e Saída Definitiva)"
   },
   {
    "campo": "Campos (grupos)",
    "texto": "Tipo de declaração e nº do recibo; Nome; Data de nascimento; Doença grave ou deficiência; Raça/Cor; Houve alteração de dados cadastrais; Possui cônjuge ou companheiro(a) e CPF do cônjuge; Era residente no exterior e passou a ser residente em 2025 e Data de retorno; Endereço (Brasil ou Exterior); Ocupação principal (natureza e ocupação)."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "período de informações: Final de Espólio, de 1º de janeiro até a data da decisão judicial da partilha, sobrepartilha ou adjudicação, ou da lavratura da escritura pública de inventário/partilha (se ainda houver bens a inventariar que gerem rendimentos, informar o ano todo); Saída Definitiva, de 1º de janeiro até o dia anterior ao da caracterização da condição de não residente."
   }
  ]
 },
 {
  "id": "F-IDENT-TIPO",
  "nome": "Que Tipo de Declaração Você Deseja Fazer?",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação do Contribuinte; pág. 42"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "- Tipo (opção): Declaração de Ajuste Anual Original; Declaração Retificadora; Declaração de Saída Definitiva Original; Declaração Final de Espólio Original (as retificadoras de Saída e Espólio seguem a mesma lógica de \"Retificadora\", inferido).\n- Nº do recibo da última declaração entregue do exercício de 2025 (numérico, 12 dígitos), se original.\n- Nº do recibo da declaração imediatamente anterior do exercício de 2026 (12 dígitos), se retificadora."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Recibo tem 12 dígitos.\n- Original de Ajuste Anual: recibo de 2025 é OPCIONAL.\n- Saída Definitiva Original e Final de Espólio Original: informar o recibo da última declaração do exercício de 2025 (texto indica obrigação, sem dizer \"opcional\").\n- Retificadora: recibo da declaração anterior de 2026 é OBRIGATÓRIO.\n- Final de Espólio: vedada, após o prazo tempestivo, a retificação dos valores da ficha Bens e Direitos.\n- Retificadora entregue após o prazo legal (29/05/2026) com débito automático: o débito automático é cancelado."
   },
   {
    "campo": "Códigos",
    "texto": "códigos Receitanet internos (ver layout: 2600 Ajuste, 2621 Espólio, 2620 Saída), fora desta faixa."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "nenhuma direta; define o conjunto de fichas e o tipo de cálculo (Espólio/Saída)."
   },
   {
    "campo": "Importações/exportações",
    "texto": "na importação da declaração de 2025 pelo arquivo transmitido, o recibo de 2025 é recuperado automaticamente; não há recuperação se a importação for por cópia de segurança."
   },
   {
    "campo": "Observações",
    "texto": "recibo pode ser obtido na folha 2 do recibo impresso ou em Declaração > Abrir do programa do ano."
   }
  ]
 },
 {
  "id": "F-IDENT-NOME",
  "nome": "Nome",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação; pág. 43"
   },
   {
    "campo": "Campos",
    "texto": "Nome completo (alfanumérico; layout NM_NOME tamanho 60)."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "de 1 a 15 partes; a primeira parte pode ter 1 caractere; nenhuma parte com mais de 20 caracteres; proibidos 3 caracteres iguais e consecutivos, exceto o numeral romano \"III\" na última parte."
   }
  ]
 },
 {
  "id": "F-IDENT-NASC",
  "nome": "Data de Nascimento",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação; pág. 43"
   },
   {
    "campo": "Campos",
    "texto": "data dd/mm/aaaa."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "formato 2 dígitos dia, 2 mês, 4 ano; data válida (inferido)."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "idade influencia parcela isenta de 65 anos e obrigatoriedade/prioridade (inferido, tratado em outras fichas)."
   }
  ]
 },
 {
  "id": "F-IDENT-DOENCA",
  "nome": "Há declarante ou dependente com doença grave ou deficiência física ou mental?",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação; pág. 43"
   },
   {
    "campo": "Campos",
    "texto": "indicador sim/não (marcação)."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "base em conclusão da medicina especializada."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "prioridade na restituição (art. 69-A da Lei 9.784/1999); não altera o imposto."
   }
  ]
 },
 {
  "id": "F-IDENT-RACA",
  "nome": "Raça/Cor",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação; pág. 43"
   },
   {
    "campo": "Campos",
    "texto": "seleção autodeclarada: Amarela, Branca, Indígena, Parda, Preta (tabela racaCor.xml)."
   }
  ]
 },
 {
  "id": "F-IDENT-ALTCAD",
  "nome": "Houve alteração de dados cadastrais?",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação; pág. 43"
   },
   {
    "campo": "Campos",
    "texto": "SIM/NÃO."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "SIM se endereço, telefone, celular, e-mail ou ocupação principal diferente da última declaração. Se NÃO e o cadastro CPF da RFB tiver endereço diferente, a declaração NÃO pode ser apresentada (rejeição na transmissão). Solução: conferir o endereço; se correto, marcar SIM, gravar novamente para entrega e retransmitir."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "nenhuma; com SIM, também atualiza dados do dependente que mora com o titular no Cadastro CPF."
   }
  ]
 },
 {
  "id": "F-IDENT-CONJ",
  "nome": "Possui cônjuge ou companheiro(a)?",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação; pág. 44"
   },
   {
    "campo": "Campos",
    "texto": "SIM/NÃO; CPF do cônjuge ou companheiro(a) (11 dígitos) se SIM."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "CPF obrigatório com 11 dígitos quando SIM; dígito verificador (inferido)."
   }
  ]
 },
 {
  "id": "F-IDENT-RETORNO",
  "nome": "Era residente no exterior e passou a ser residente no país em 2025?",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação; pág. 44"
   },
   {
    "campo": "Campos",
    "texto": "SIM/NÃO; Data de retorno ao Brasil (se SIM)."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "data obrigatória se SIM; dentro de 2025 (inferido)."
   }
  ]
 },
 {
  "id": "F-IDENT-END-BR",
  "nome": "Endereço - Brasil",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação; págs. 44 e 45"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos; no Final de Espólio, endereço e UF da pessoa falecida na data do óbito."
   },
   {
    "campo": "Campos",
    "texto": "indicador Brasil/Exterior; Tipo de logradouro (rua, quadra, avenida etc., tabela tipoLogradouro); Logradouro; Número; Complemento; Bairro/Distrito; UF (código ou lista, tabela ufs); Município (lista dos municípios da UF, em ordem alfabética); CEP (8 dígitos); Telefone (DDD 2 dígitos + até 9 dígitos); Celular (DDD 2 + até 9 dígitos); E-mail."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "endereço completo; município deve pertencer à UF; CEP com 8 dígitos (tabela ECT); e-mail válido; telefone e celular com DDD de 2 dígitos e até 9 dígitos."
   },
   {
    "campo": "Códigos",
    "texto": "UF, municípios (tabelas por UF), tipo de logradouro."
   },
   {
    "campo": "Observações",
    "texto": "celular e e-mail podem ser usados pela RFB para avisar mensagem na Caixa Postal do e-CAC."
   }
  ]
 },
 {
  "id": "F-IDENT-END-EXT",
  "nome": "Endereço - Exterior",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação; págs. 45 e 46"
   },
   {
    "campo": "Campos",
    "texto": "CPF do procurador residente no Brasil (11 dígitos); Logradouro, número, complemento, bairro/distrito; País (código ou lista, tabela paises); Cód. EXT. (representação diplomática mais próxima da residência, tabela representacoes.xml); Cidade; Código Postal; DDI/Telefone; E-mail."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "CPF do procurador com 11 dígitos; e-mail válido; Espólio: último endereço da pessoa falecida."
   },
   {
    "campo": "Observações",
    "texto": "se o endereço do titular é no Exterior e o dependente mora com o titular, celular/e-mail do dependente ficam desabilitados."
   }
  ]
 },
 {
  "id": "F-IDENT-OCUP",
  "nome": "Ocupação Principal",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Identificação; pág. 46"
   },
   {
    "campo": "Campos",
    "texto": "Natureza da ocupação (código, tabela naturezasOcupacao); Ocupação principal (código, lupa, tabela ocupacoesPrincipal); Número do registro profissional para ocupações 225, 226, 230, 231, 232, 241, 255, 355 (ver Carnê-Leão, inferido como campo da identificação ou da ficha PF)."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "naturezas 13, 14, 61, 62, 71, 72 e 81 (Espólio) não exigem código da ocupação principal; se tiver outra ocupação remunerada, informar a ocupação dela. Demais naturezas exigem ocupação principal (inferido)."
   },
   {
    "campo": "Códigos",
    "texto": "natureza 11 (profissional liberal ou autônomo sem vínculo) torna obrigatório o NIT/PIS/PASEP na ficha PF; natureza 62 remete ao isento 11 (moléstia grave/acidente); natureza 81 (Espólio) habilita a ficha Espólio na Declaração de Ajuste."
   }
  ]
 },
 {
  "id": "F-DEP",
  "nome": "Dependentes",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha Dependentes; págs. 47 a 49"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (campo extra na Saída Definitiva)"
   },
   {
    "campo": "Campos (por dependente, botões Novo/Editar/Excluir, OK)",
    "texto": "- Tipo de dependente (código, tabela de relação de dependência, dependencias.xml)\n- Nome completo\n- CPF (obrigatório para todos os dependentes)\n- Data de nascimento (dd/mm/aaaa)\n- Raça/Cor (Amarela, Branca, Indígena, Parda, Preta)\n- Celular (DDD 2 + até 9 dígitos; desabilitado se mora com o titular e endereço do titular no Exterior)\n- E-mail (desabilitado na mesma condição)\n- Dependente mora com o titular da declaração? (marcação)\n- Saiu do país na mesma data que o declarante? (só Saída Definitiva; SIM apenas se o dependente adquiriu condição de não residente na mesma data)\n- Total de dedução com dependentes (calculado)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- CPF obrigatório e válido para todo dependente.\n- Pode ser dependente quem manteve relação de dependência mesmo por menos de 12 meses em 2025 (nascimento, falecimento).\n- Declaração em separado: dependente comum só pode constar na declaração de um dos cônjuges.\n- Filho de pais divorciados/separados (judicialmente ou por escritura pública, art. 733 CPC): só na declaração de quem detém a guarda judicial; se o filho declara em separado, não pode ser dependente do responsável. Exceção: separação/divórcio em 2025 com pensão judicial paga, somente no ano-calendário 2025, o não guardião pode considerar os filhos dependentes e deduzir a pensão.\n- Companheiro(a), inclusive homoafetivo: vida em comum por mais de 5 anos, ou menos se houve filho (Parecer PGFN/CAT 1.503/2010).\n- Mora com o titular + \"Houve alteração cadastral = SIM\": atualiza também o cadastro CPF do dependente."
   },
   {
    "campo": "Códigos",
    "texto": "tabela de relação de dependência (dependencias.xml)."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "dedução anual de R$ 2.275,08 por dependente (total = quantidade x 2.275,08) no Resumo (modelo completo). Rendimentos dos dependentes somam-se aos tributáveis da declaração pelas abas próprias."
   },
   {
    "campo": "Importações/exportações",
    "texto": "exclusão em cascata automática: ao excluir dependente, o programa apaga dados dele na aba Dependentes de Rendimentos PJ, Rendimentos PF/Exterior, Pagamentos Efetuados, Ganhos de Capital e Renda Variável (campo Imposto a Pagar). NÃO apaga automaticamente: Rendimentos Isentos, Tributação Exclusiva, Doações Efetuadas, Bens e Direitos, Dívidas e Ônus; o usuário deve excluí-los."
   },
   {
    "campo": "Observações",
    "texto": "valor de R$ 2.275,08 anual e R$ 189,59 mensal (2025)."
   }
  ]
 },
 {
  "id": "F-ALIM",
  "nome": "Alimentandos",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha Alimentandos; pág. 50"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos (Novo/Editar/Excluir, OK)",
    "texto": "- Residente no Brasil ou no Exterior (opção)\n- CPF (obrigatório para residente no Brasil ou no Exterior)\n- Data de nascimento (dd/mm/aaaa)\n- Nome completo\n- Vinculado a: Titular da Declaração ou Dependente (se dependente, seleção do dependente, inferido)\n- Tipo de Processo: Escritura pública; Decisão judicial; Escritura pública e Decisão judicial\n- Aba Escritura Pública: CNPJ do cartório, Nome do cartório, Livro, Folhas, UF, Município, Data da lavratura\n- Aba Decisão Judicial: Nº do processo judicial, Identificação da vara cível, Comarca, UF, Data da decisão judicial"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "CPF obrigatório sempre; abas habilitadas conforme Tipo de Processo; datas dd/mm/aaaa; CNPJ do cartório válido (inferido)."
   },
   {
    "campo": "Códigos",
    "texto": "UF, municípios."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "base para pagamentos de pensão alimentícia, despesas de instrução e médicas do alimentando na ficha Pagamentos Efetuados (pensão é dedução; instrução sujeita ao limite)."
   },
   {
    "campo": "Observações",
    "texto": "só alimentandos por decisão judicial, acordo homologado judicialmente ou escritura pública (art. 733 CPC)."
   }
  ]
 },
 {
  "id": "F-RTPJ-TIT",
  "nome": "Rendimentos Tributáveis Recebidos de PJ pelo Titular",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha Rendimentos Tributáveis Recebidos de PJ, aba Titular; págs. 51 e 52"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos (por fonte pagadora, Novo/Editar/Excluir, OK)",
    "texto": "- CPF/CNPJ da fonte pagadora\n- Nome da fonte pagadora\n- Rendimentos recebidos de pessoa jurídica\n- Contribuição previdenciária oficial\n- Imposto retido na fonte\n- 13º salário (valor líquido do comprovante)\n- IRRF sobre o 13º salário"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "CPF ou CNPJ válido; CPF aceito quando o pagador é pessoa física empregadora (vínculo empregatício, ex.: empregado doméstico)."
   },
   {
    "campo": "Conteúdo",
    "texto": "incluir pecúlio de previdência privada (prestação única por morte ou invalidez permanente); rendimentos de trabalho com vínculo pagos por PF. Não incluir: atividade rural, ganhos de capital (GCAP), renda variável em bolsa, aplicações financeiras e lucros de controladas no exterior (Lei 14.754/2023, vão para Bens e Direitos). Autônomo que prestou serviços só a PJ e escriturou livro Caixa usa a coluna Livro Caixa da ficha PF e deixa os demais campos em branco (conforme o caso); contribuição previdenciária do contribuinte individual vai na aba Outras Informações da ficha PF."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "rendimentos e IRRF transportados ao Resumo (rendimentos tributáveis e imposto pago). Contribuição previdenciária somada à da ficha PF e transportada ao Resumo (dedução). 13º salário transportado para a ficha Tributação Exclusiva (código 01) e IRRF do 13º não entra no ajuste (inferido)."
   },
   {
    "campo": "Importações/exportações",
    "texto": "menu Importações > Informe de Rendimentos (arquivo do comprovante de rendimentos da fonte pagadora, ano-calendário 2025); também a pré-preenchida e a declaração anterior (fontes pagadoras, inferido)."
   }
  ]
 },
 {
  "id": "F-RTPJ-DEP",
  "nome": "Rendimentos Tributáveis Recebidos de PJ pelos Dependentes",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha Rendimentos Tributáveis Recebidos de PJ, aba Dependentes; págs. 53 e 54"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Dependente (seleção entre os da ficha Dependentes) e os mesmos campos da aba Titular (CPF/CNPJ e nome da fonte, rendimentos, contribuição previdenciária oficial, IRRF, 13º, IRRF sobre 13º)."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "dependente precisa existir antes na ficha Dependentes; mesmas regras de CPF/CNPJ."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "iguais às do titular (somam no Resumo; previdência somada à da ficha PF dependentes; 13º para Exclusivos código 08, inferido)."
   },
   {
    "campo": "Importações/exportações",
    "texto": "Importações > Informe de Rendimentos."
   }
  ]
 },
 {
  "id": "F-RTPF",
  "nome": "Rendimentos Tributáveis Recebidos de Pessoa Física e do Exterior (visão geral)",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha com abas Titular e Dependentes; cada uma com sub-abas \"Rendimentos do Trabalho Não Assalariado\" e \"Outras Informações\"; págs. 55 a 74"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (Espólio e Saída com o período reduzido descrito em F-IDENT)\n- Estrutura mensal (janeiro a dezembro) com colunas (inferido do texto): Trabalho não assalariado; Aluguéis (inclusive por temporada); Outros; Exterior; Previdência Oficial; Dependentes (quantidade); Pensão Alimentícia; Livro Caixa; Carnê-Leão Darf pago (cód. 0190). Sub-aba de trabalho não assalariado tem detalhamento por pagador (CPF titular do pagamento, CPF beneficiário, valor)."
   }
  ]
 },
 {
  "id": "F-RTPF-IMPCL",
  "nome": "Importação do Carnê-leão",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha Rendimentos Tributáveis PF e Exterior (titular); pág. 57"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "nenhum; ação de importação."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "exige conta gov.br (o Carnê-Leão é online, multiexercício, no e-CAC, sistema Meu Imposto de Renda, \"Acessar Carnê-Leão\", desde 2021). Ao importar: se já houver dados na ficha Rendimentos Tributáveis de PJ, o CNPJ não é importado; se já houver Imposto pago no exterior na ficha Imposto Pago/Retido, o valor não é importado."
   },
   {
    "campo": "Códigos",
    "texto": "ocupações que exigem número de registro profissional para usar o Carnê-Leão: 225 Médico, 226 Odontólogo, 230 Fonoaudiólogo, 231 Fisioterapeuta, 232 Terapeuta ocupacional, 241 Advogado, 255 Psicólogo, 355 Corretor e administrador de imóveis. Esses profissionais identificam por CPF o titular do pagamento, se ele é o beneficiário do serviço; se não for, o CPF do beneficiário e o valor. Campo \"CPF não foi informado\" só quando o beneficiário não é o titular do pagamento e o CPF do beneficiário não foi informado."
   },
   {
    "campo": "Importações/exportações",
    "texto": "dados do ano-calendário 2025 do Carnê-Leão online para a ficha PF/Exterior."
   },
   {
    "campo": "Observações",
    "texto": "módulo irpf-gui-carne-leao.jar."
   }
  ]
 },
 {
  "id": "F-RTPF-TNA",
  "nome": "Aba \"Rendimentos do Trabalho Não Assalariado\" (titular e dependentes)",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha PF/Exterior, abas Titular e Dependentes; págs. 58, 59, 67, 68"
   },
   {
    "campo": "Campos",
    "texto": "por mês, valores recebidos de PF por trabalho não assalariado; para ocupações 225, 226, 230, 231, 232, 241, 255, 355: CPF do titular do pagamento, indicador se é o beneficiário do serviço, CPF do beneficiário, valor, marca \"CPF não foi informado\" (inferido a partir da regra do Carnê-Leão)."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "declarar mesmo que a soma mensal seja inferior à primeira faixa da tabela mensal (até R$ 2.259,20 de janeiro a abril e R$ 2.428,80 de maio a dezembro, alíquota zero). Não incluir rendimentos de vínculo empregatício pagos por PF (vão para Rendimentos PJ, aba Titular ou Dependentes). Transporte de carga e serviços com trator, máquina de terraplenagem, colheitadeira e assemelhados: tributável no mínimo 10% do rendimento (veículo próprio ou locado, conduzido só pelo contribuinte). Transporte de passageiros: no mínimo 60%. Equipara-se a PJ quem tem mais de um veículo/máquina explorados com outras pessoas ou contrata condutor."
   },
   {
    "campo": "Conteúdo",
    "texto": "profissão, ocupação, prestação de serviços (inclusive representante comercial autônomo); honorários de autônomos; direitos autorais explorados diretamente pelo autor; exploração individual de empreitada de trabalho; emolumentos e custas de serventuários da Justiça (exceto quando pagos exclusivamente pelos cofres públicos)."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "soma em rendimentos tributáveis do Resumo."
   }
  ]
 },
 {
  "id": "F-RTPF-NIT",
  "nome": "NIT/PIS/PASEP",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba \"Outras Informações\" (titular e dependentes); págs. 59 e 69"
   },
   {
    "campo": "Campos",
    "texto": "NIT ou PIS ou PASEP."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "obrigatório se a natureza da ocupação for 11 (profissional liberal ou autônomo sem vínculo de emprego) ou se houver valor de contribuição previdenciária nesta ficha. Dígito verificador do NIT/PIS (inferido)."
   }
  ]
 },
 {
  "id": "F-RTPF-ALUG",
  "nome": "Coluna Aluguéis, inclusive por temporada",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Outras Informações; págs. 59 e 69"
   },
   {
    "campo": "Campos",
    "texto": "valor mensal de aluguéis."
   },
   {
    "campo": "Conteúdo",
    "texto": "ocupação, sublocação, uso ou exploração de bens móveis e imóveis; royalties (direitos autorais não explorados pelo autor)."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "podem ser excluídos (desde que ônus exclusivo do locador): impostos, taxas e emolumentos do bem; aluguel pago por imóvel sublocado; despesas de cobrança ou recebimento; condomínio. Informar o líquido (inferido). Quem recebe aluguel não pode usar livro Caixa para essa receita."
   }
  ]
 },
 {
  "id": "F-RTPF-OUTROS",
  "nome": "Coluna Outros",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Outras Informações; págs. 59 e 69"
   },
   {
    "campo": "Conteúdo",
    "texto": "juros de empréstimos a PF; lucro no comércio ou indústria por quem não exerce habitualmente a profissão; reajustamento e juros na alienação a prazo de bens ou direitos (adquiridos em reais, para dependentes)."
   }
  ]
 },
 {
  "id": "F-RTPF-EXT",
  "nome": "Coluna Exterior",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Outras Informações; págs. 60, 69 e 70"
   },
   {
    "campo": "Conteúdo",
    "texto": "rendimentos de fontes no exterior, inclusive representações diplomáticas e organismos internacionais, observados acordos e reciprocidade."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "NÃO incluir: transferência para o Brasil de saldo de depósito não remunerado no exterior (ganho de capital); ganho cambial de depósitos não remunerados em instituição não reconhecida (ganho de capital); alienação de moeda estrangeira em espécie (não incidência até US$ 5.000,00 no ano; acima, ganho de capital); rendimentos de aplicações financeiras no exterior e lucros/dividendos de controladas (Bens e Direitos, Lei 14.754/2023); liquidação/resgate de aplicações e alienação de bens adquiridos em moeda estrangeira e ativos em bolsa no exterior (ganho de capital)."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "conversão: moeda de origem para dólar dos EUA pela cotação da autoridade monetária do país na data do recebimento; dólar para real pela cotação de COMPRA do Banco Central do último dia útil da 1ª quinzena do mês anterior ao do recebimento (Tabela de Conversão do Dólar 2025). Total transportado ao Resumo. Imposto pago no exterior compensável (ver Carnê-Leão e Imposto Pago/Retido)."
   }
  ]
 },
 {
  "id": "F-RTPF-PREV",
  "nome": "Deduções - Previdência Oficial",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Outras Informações; págs. 61 e 70"
   },
   {
    "campo": "Campos",
    "texto": "valor mensal da contribuição previdenciária oficial recolhida em nome do titular (ou dos dependentes), inclusive do contribuinte individual (autônomo)."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "total somado à previdência oficial da ficha Rendimentos PJ (titular/dependentes) e lançado no Resumo como dedução."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "exige NIT/PIS/PASEP preenchido."
   }
  ]
 },
 {
  "id": "F-RTPF-QTDDEP",
  "nome": "Deduções - Quantidade de Dependentes",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Outras Informações; págs. 62 e 71"
   },
   {
    "campo": "Campos",
    "texto": "quantidade mensal de dependentes."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "só os não usados na apuração do IR na fonte."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "valor mensal R$ 189,59 por dependente (janeiro a dezembro). Valores apenas INFORMATIVOS: não vão ao Resumo; dedução anual depende da ficha Dependentes."
   }
  ]
 },
 {
  "id": "F-RTPF-PENSAO",
  "nome": "Deduções - Pensão Alimentícia",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Outras Informações (coluna Pensão Alimentícia); págs. 63 e 72"
   },
   {
    "campo": "Campos",
    "texto": "valor mensal pago de pensão alimentícia judicial ou por escritura pública (art. 733 CPC)."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "só valores não usados como dedução no IR na fonte."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "apenas INFORMATIVO (digitado ou importado do Carnê-Leão); não vai ao Resumo. Para deduzir, informar em Pagamentos Efetuados. Pagamento em moeda estrangeira: dólar pela autoridade do país na data do pagamento e real pela cotação de VENDA do Banco Central do último dia útil da 1ª quinzena do mês anterior."
   }
  ]
 },
 {
  "id": "F-RTPF-LIVROCAIXA",
  "nome": "Deduções - Livro Caixa",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Outras Informações (coluna Livro Caixa); págs. 64 e 73"
   },
   {
    "campo": "Campos",
    "texto": "valor mensal das despesas escrituradas em livro Caixa."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "só para quem recebeu rendimentos do trabalho não assalariado, inclusive titulares de serviços notariais e de registro (exceto remunerados só pelos cofres públicos) e leiloeiros. Vedado a transportadores de passageiros e de cargas e para receita de aluguéis. Valor mensal limitado à receita mensal recebida de PF e/ou PJ. Excesso de um mês pode ser somado aos meses seguintes até dezembro de 2025; excesso em dezembro não pode ser informado nesse mês nem usado em anos posteriores. Autônomo que prestou serviços só a PJ preenche esta coluna para deduzir."
   },
   {
    "campo": "Conteúdo dedutível",
    "texto": "remuneração de terceiros com vínculo empregatício e encargos trabalhistas e previdenciários; emolumentos; despesas de custeio necessárias à receita e à manutenção da fonte produtora. Documentação idônea."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "total transportado ao Resumo como dedução (livro Caixa). Moeda estrangeira: conversão pela cotação de venda."
   }
  ]
 },
 {
  "id": "F-RTPF-DARF0190",
  "nome": "Carnê-Leão - Darf pago cód. 0190",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Outras Informações; págs. 65 e 74"
   },
   {
    "campo": "Campos",
    "texto": "valor mensal do Carnê-Leão pago (principal do Darf), no mês do recebimento do rendimento, independentemente da data do pagamento."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "vencimento no último dia útil do mês subsequente ao recebimento; código de receita 0190. Somente o principal (sem multa e juros)."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "total transportado ao Resumo (imposto pago, dedutível do imposto devido). Imposto pago no exterior compensável na apuração mensal, observado o limite legal, se não compensado/restituído no exterior e pago em país com acordo ou reciprocidade."
   }
  ]
 },
 {
  "id": "F-RTPF-DEP-CPF",
  "nome": "CPF dos Dependentes (ficha PF/Exterior, aba Dependentes)",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Dependentes da ficha PF/Exterior; pág. 67"
   },
   {
    "campo": "Campos",
    "texto": "Dependente (seleção entre os da ficha Dependentes), via botão Novo; depois as mesmas sub-abas e colunas do titular (Trabalho Não Assalariado; Outras Informações: NIT/PIS/PASEP, Aluguéis, Outros, Exterior, Previdência Oficial, Quantidade de Dependentes, Pensão Alimentícia, Livro Caixa, Darf 0190)."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "dependente precisa existir antes na ficha Dependentes; excluir a linha apaga todas as informações dela; rendimentos de dependentes NÃO são somados aos do titular nesta aba (informados separadamente), mas entram no Resumo (inferido pelo \"transporta o total para o Resumo\"). Limite de isenção mensal citado: R$ 2.259,20 (jan a abr) e R$ 2.428,80 (mai a dez)."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "totais dos dependentes transportados ao Resumo; previdência somada à da ficha PJ dependentes."
   }
  ]
 },
 {
  "id": "F-ISENTO-INTRO",
  "nome": "Rendimentos Isentos e Não Tributáveis (início)",
  "fonte": "docs/mapeamento/notas/02-ident-dep-rend.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 75 em diante (fora da faixa deste fork; tratado pelo fork N3)"
   },
   {
    "campo": "Observações",
    "texto": "a faixa termina no título da ficha."
   }
  ]
 },
 {
  "id": "F-ISENTO",
  "nome": "Rendimentos Isentos e Não Tributáveis (ficha)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Fichas da Declaração > Rendimentos Isentos e Não Tributáveis; págs. 75 a 113"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (Ajuste Anual, Final de Espólio, Saída Definitiva). Final de Espólio: período de 1º/01 até a data da decisão judicial da partilha, sobrepartilha, adjudicação ou lavratura da escritura de inventário/partilha; se ainda houver bens a inventariar que gerem rendimentos, informar o ano todo. Saída Definitiva: 1º/01 até o dia anterior à caracterização da condição de não residente."
   },
   {
    "campo": "Estrutura",
    "texto": "duas abas. Aba \"Rendimentos\": lista de lançamentos com botões Novo, Editar, Excluir; ao clicar Novo, escolhe-se o \"Tipo de Rendimento\" (código) e preenche-se o formulário do tipo; botões Ok e Cancelar. Aba \"Totais\": somatório automático por tipo de rendimento (uma linha por código)."
   },
   {
    "campo": "Campos comuns da maioria dos códigos",
    "texto": "Tipo de beneficiário (Titular ou Dependente, obrigatório); CPF do dependente e nome (lista dos dependentes cadastrados, se beneficiário = Dependente); CNPJ (ou CPF/CNPJ, conforme o código) da fonte pagadora; Nome da fonte pagadora; Valor."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "excluir uma linha apaga todos os campos dela; dependente precisa existir na ficha Dependentes."
   },
   {
    "campo": "Códigos",
    "texto": "01 a 25, 27, 28, 99 (não existe código 26 na lista da Ajuda 2026)."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "total de rendimentos isentos no Resumo (Outras Informações); não entra na base de cálculo; justifica acréscimo patrimonial, exceto onde indicado."
   },
   {
    "campo": "Importações",
    "texto": "códigos 05, 06, 07 recebem valor transportado do GCAP; 15 do Demonstrativo da Atividade Rural; 22 do Demonstrativo de Renda Variável; 27 da ficha RRA; 09, 12, 99 (FII/Fiagro) podem ser lançados a partir da ficha Bens e Direitos (vínculo bem/rendimento); pré-preenchida e informe de rendimentos podem trazer lançamentos (inferido)."
   },
   {
    "campo": "Observações",
    "texto": "botão \"Visualizar Bem/Direito Associado\" para lançamentos criados a partir de um bem."
   }
  ]
 },
 {
  "id": "F-ISENTO-01",
  "nome": "Bolsas de estudo e de pesquisa caracterizadas como doação, exceto médico-residente ou Pronatec",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 78"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome da fonte pagadora; Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "somente bolsa recebida exclusivamente para estudo/pesquisa, sem vantagem para o doador nem contraprestação de serviços (regra de enquadramento, orientação ao usuário)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "total de isentos"
   }
  ]
 },
 {
  "id": "F-ISENTO-02",
  "nome": "Bolsas de estudo e de pesquisa de médico-residente e servidor da rede pública de educação profissional (Pronatec)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 79"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "Pronatec isento só a partir de junho de 2013 (Lei nº 12.816/2013)"
   }
  ]
 },
 {
  "id": "F-ISENTO-03",
  "nome": "Capital de apólices de seguro ou pecúlio pago por morte do segurado, prêmio de seguro restituído e pecúlio de previdência privada por morte ou invalidez permanente",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 80"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ e nome da fonte pagadora (inferido, padrão da ficha); Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "pecúlio de previdência complementar isento apenas se pago em parcela única por morte ou invalidez permanente do participante"
   }
  ]
 },
 {
  "id": "F-ISENTO-04",
  "nome": "Indenizações por rescisão de contrato de trabalho, inclusive PDV, e por acidente de trabalho; e FGTS",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 81"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "inclui indenização e aviso prévio não trabalhado até limite legal/dissídio, verbas de PDV, indenização por acidente de trabalho, saque de FGTS. Não incluir verbas rescisórias (13º, saldo de salário, férias proporcionais, abono, gratificações, aviso prévio trabalhado, PLR) nem direitos adquiridos antes do PDV (resgate de previdência complementar)"
   }
  ]
 },
 {
  "id": "F-ISENTO-05",
  "nome": "Ganho de capital em alienação de bens de pequeno valor (até R$ 20.000,00 ações em mercado de balcão; R$ 35.000,00 demais casos, por mês)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, págs. 82 e 83"
   },
   {
    "campo": "Campos",
    "texto": "\"Valor informado pelo contribuinte\" (campo da esquerda, editável); \"Valor transportado pelo programa\" (campo da direita, vindo do GCAP)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "limite mensal de alienação para o conjunto de bens da mesma natureza: R$ 20.000,00 (ações no mercado de balcão) e R$ 35.000,00 (demais). Valor isento = valor de alienação menos custo de aquisição da DIRPF 2025 (AC 2024) mais parcelas pagas em 2025"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "total de isentos"
   },
   {
    "campo": "Importações",
    "texto": "GCAP (opcional, operação dispensada) transporta o valor"
   }
  ]
 },
 {
  "id": "F-ISENTO-06",
  "nome": "Ganho de capital na alienação do único imóvel por até R$ 440.000,00, sem outra alienação de imóvel nos últimos 5 anos",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 84"
   },
   {
    "campo": "Campos",
    "texto": "Valor informado pelo contribuinte; Valor transportado pelo programa"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "único imóvel; valor de venda até R$ 440.000,00; sem outra alienação de imóvel em 5 anos. Valor = venda menos custo (DIRPF 2025) mais parcelas pagas em 2025, se positivo"
   },
   {
    "campo": "Importações",
    "texto": "GCAP (inclusive redução de imóvel adquirido em moeda estrangeira até 1988)"
   }
  ]
 },
 {
  "id": "F-ISENTO-07",
  "nome": "Ganho de capital na venda de imóveis residenciais para aquisição em 180 dias de imóveis residenciais no Brasil e redução sobre o ganho de capital",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 85"
   },
   {
    "campo": "Campos",
    "texto": "Valor informado pelo contribuinte; Valor transportado pelo programa"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "abrange ganho de imóveis adquiridos até 1969; terra nua (diferença quando ganho apurado pelo Diat); redução para imóveis adquiridos até 1988; fatores de redução do art. 40 da Lei nº 11.196/2005; ganho na venda de imóvel residencial com aplicação em 180 dias em outro residencial no Brasil; redução de imóvel adquirido em moeda estrangeira até 1988. Preencher manual só se dispensado do GCAP"
   },
   {
    "campo": "Importações",
    "texto": "GCAP"
   }
  ]
 },
 {
  "id": "F-ISENTO-08",
  "nome": "Ganho de capital na alienação de moeda estrangeira em espécie com total anual até US$ 5,000.00",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 86"
   },
   {
    "campo": "Campos",
    "texto": "Valor (informado pelo contribuinte)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "total de alienações no ano convertido em dólar (cotação da autoridade monetária do país emissor na data de cada alienação) até US$ 5.000,00"
   },
   {
    "campo": "Importações",
    "texto": "NÃO é transportado pelo programa (GCAP não transporta); informar manualmente"
   }
  ]
 },
 {
  "id": "F-ISENTO-09",
  "nome": "Lucros e dividendos recebidos",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 87"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "lucros apurados a partir de 1996 distribuídos em 2025 por PJ do lucro real, presumido ou arbitrado. Não informar aqui lucros de PJ no exterior nem rendimentos de aplicações/controladas no exterior (Lei nº 14.754/2023), que vão na ficha Bens e Direitos"
   },
   {
    "campo": "Importações",
    "texto": "pode ser lançado a partir de Bens e Direitos, grupo 03, código 01 (Ações)"
   }
  ]
 },
 {
  "id": "F-ISENTO-10",
  "nome": "Parcela isenta de proventos de aposentadoria, reserva remunerada, reforma e pensão de declarante com 65 anos ou mais",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, págs. 88 a 92"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor (anual, sem 13º); 13º salário"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "limite mensal R$ 1.903,98 (janeiro a dezembro, a partir do mês em que completou 65 anos), independentemente do número de fontes. Limite anual R$ 22.847,76 (12 x 1.903,98) para o campo Valor (somado entre fontes) e R$ 1.903,98 para o 13º. Se exceder, pergunta \"Deseja transferir os valores excedentes para a ficha Rendimentos Tributáveis Recebidos de Pessoa Jurídica?\": SIM separa e cria lançamento com o excedente na ficha Rendimentos Tributáveis PJ (rendimento e 13º); NÃO gera pendência de limite de isenção ultrapassado. 13º isento limitado a R$ 1.903,98 por fonte pagadora; excedente da soma dos 13º isentos de várias fontes vai na linha 99. Se 13º = 0 com valor, aviso \"campo Valor não deve conter o 13º salário isento\" e pergunta \"Deseja alterar os valores informados conforme tabela acima?\". Não há vínculo entre o lançamento isento e o tributável criado (alterar um não afeta o outro). Fapi não tem parcela isenta (tributável integral, ajuste ou exclusiva Lei 11.053/2004)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "total isentos; possível transferência para rendimentos tributáveis PJ (base de cálculo). Estimativa do 13º isento quando não disponível: A/13 (ano inteiro) ou A/(14 menos mês de início da isenção) se começou no ano (mês diferente de janeiro); valor anual = A menos 13º"
   }
  ]
 },
 {
  "id": "F-ISENTO-11",
  "nome": "Pensão, proventos de aposentadoria, reserva ou reforma por moléstia grave ou aposentadoria/reforma por acidente em serviço",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, págs. 93 e 94"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Rendimento; IRRF; 13º salário (valor líquido do comprovante); IRRF sobre o 13º salário; Contribuição previdenciária oficial"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "moléstias: fibrose cística, tuberculose ativa, alienação mental, esclerose múltipla, neoplasia maligna, cegueira (inclusive monocular), hanseníase, paralisia irreversível e incapacitante, hepatopatia grave, cardiopatia grave, Parkinson, espondiloartrose anquilosante, nefropatia grave, Paget avançado, contaminação por radiação, Aids; acidente em serviço ou moléstia profissional. Início da isenção: mês da concessão (doença preexistente), mês do laudo (doença posterior) ou data em que a doença foi contraída conforme laudo. Laudo de serviço médico oficial. Ato Declaratório PGFN nº 5/2016 dispensa contemporaneidade dos sintomas"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "soma IRRF + IRRF 13º do titular vai para Imposto Pago/Retido linha 04; dos dependentes para linha 05 (imposto retido compensável no ajuste)"
   }
  ]
 },
 {
  "id": "F-ISENTO-12",
  "nome": "Rendimentos de caderneta de poupança, letras hipotecárias, LCA, LCI, CRA e CRI",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 95"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor"
   },
   {
    "campo": "Importações",
    "texto": "pode ser lançado a partir de Bens e Direitos grupo 04, código 01 (Depósito em conta poupança) e código 03 (Títulos isentos: LCI, LCA, CRI, CRA, LIG, Debêntures de Infraestrutura e outros)"
   }
  ]
 },
 {
  "id": "F-ISENTO-13",
  "nome": "Rendimento de sócio ou titular de ME/EPP optante pelo Simples Nacional, exceto pró-labore, aluguéis e serviços prestados",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 96"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "isenção limitada aos percentuais de presunção do IRPJ (art. 15 da Lei nº 9.249/1995) sobre a receita bruta anual menos o IRPJ devido no Simples; sem limite se houver escrituração contábil com lucro maior; MEI: percentuais do lucro presumido sobre receita bruta"
   }
  ]
 },
 {
  "id": "F-ISENTO-14",
  "nome": "Transferências patrimoniais: doações e heranças",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 97"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ do Doador/Espólio; Nome do Doador/Espólio; Valor (bens recebidos em herança, legado, doação, inclusive adiantamento da legítima)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "sucessão: usar o valor do bem na DIRPF 2025 (AC 2024). Transferência por valor superior ao da declaração anterior gera ganho de capital (tributação no GCAP do transmitente). Meação/dissolução usam código 19; doação/herança de não residente usam código 99"
   }
  ]
 },
 {
  "id": "F-ISENTO-15",
  "nome": "Parcela não tributável correspondente à atividade rural",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 98"
   },
   {
    "campo": "Campos",
    "texto": "nenhum editável (valor transportado)"
   },
   {
    "campo": "Importações",
    "texto": "resultado não tributável da Atividade Rural Brasil e Exterior apurado no Demonstrativo da Atividade Rural"
   }
  ]
 },
 {
  "id": "F-ISENTO-16",
  "nome": "Imposto de anos-calendário anteriores compensado judicialmente neste ano-calendário",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 99"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Valor"
   }
  ]
 },
 {
  "id": "F-ISENTO-17",
  "nome": "75% dos rendimentos do trabalho assalariado recebidos em moeda estrangeira por servidores de autarquias ou repartições do Governo Brasileiro no exterior",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 100"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "conversão: moeda para dólar pela autoridade monetária do país na data do recebimento; dólar para real pela cotação de compra do Bacen do último dia útil da 1ª quinzena do mês anterior ao recebimento. Os 25% restantes são tributáveis (inferido; vão na ficha PF/Exterior)"
   }
  ]
 },
 {
  "id": "F-ISENTO-18",
  "nome": "Incorporação de reservas ao capital / Bonificações em ações",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 101"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor"
   },
   {
    "campo": "Observações",
    "texto": "conforme comprovante da emissora ou agente de custódia; reflexo no custo das ações em Bens e Direitos (inferido)"
   }
  ]
 },
 {
  "id": "F-ISENTO-19",
  "nome": "Transferências patrimoniais: meação e dissolução da sociedade conjugal e da unidade familiar",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 102"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; Valor (não há fonte pagadora na descrição da Ajuda)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "usar valor do bem na DIRPF 2025 (AC 2024); transferência por valor superior gera ganho de capital; doações e heranças vão no código 14"
   }
  ]
 },
 {
  "id": "F-ISENTO-20",
  "nome": "Ganhos líquidos em ações no mercado à vista em bolsa, alienações até R$ 20.000,00 por mês para o conjunto de ações",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 103"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "limite de alienação mensal R$ 20.000,00 para o conjunto de ações. Não se aplica a day trade, cotas de ETF de ações, resgate de fundos/clubes de ações, exercício de opções, termo"
   },
   {
    "campo": "Importações",
    "texto": "relação com Demonstrativo de Renda Variável (inferido; a Ajuda manda informar o valor)"
   }
  ]
 },
 {
  "id": "F-ISENTO-21",
  "nome": "Ganhos líquidos em operações com ouro ativo financeiro, alienações até R$ 20.000,00 por mês",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 104"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; Valor"
   }
  ]
 },
 {
  "id": "F-ISENTO-22",
  "nome": "Recuperação de prejuízos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 105"
   },
   {
    "campo": "Campos",
    "texto": "nenhum editável (transportado)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "prejuízo acumulado de anos anteriores usado para reduzir ganho neste ano"
   },
   {
    "campo": "Importações",
    "texto": "Demonstrativo de Renda Variável (prejuízo compensado)"
   }
  ]
 },
 {
  "id": "F-ISENTO-23",
  "nome": "Rendimento bruto, até 90%, de transporte de carga e serviços com trator, máquina de terraplenagem, colheitadeira e assemelhados",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 106"
   },
   {
    "campo": "Campos",
    "texto": "Valor (beneficiário e fonte, inferido pelo padrão)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "limitado a 90% do rendimento bruto; presume-se consumido, não justifica acréscimo patrimonial"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "os 10% tributáveis vão para as fichas de rendimentos tributáveis (inferido); não entra na evolução patrimonial justificável"
   }
  ]
 },
 {
  "id": "F-ISENTO-24",
  "nome": "Rendimento bruto, até 40%, de transporte de passageiros",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 107"
   },
   {
    "campo": "Campos",
    "texto": "Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "limitado a 40% do rendimento bruto; presume-se consumido, não justifica acréscimo patrimonial"
   }
  ]
 },
 {
  "id": "F-ISENTO-25",
  "nome": "Restituição do imposto sobre a renda de anos-calendário anteriores",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 108"
   },
   {
    "campo": "Campos",
    "texto": "Valor (beneficiário, inferido)"
   }
  ]
 },
 {
  "id": "F-ISENTO-27",
  "nome": "Juros referentes aos Rendimentos Recebidos Acumuladamente",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 109"
   },
   {
    "campo": "Campos",
    "texto": "nenhum editável (transportado)"
   },
   {
    "campo": "Importações",
    "texto": "campo \"Valor recebido referente a juros\" da ficha RRA (titular e dependentes)"
   }
  ]
 },
 {
  "id": "F-ISENTO-28",
  "nome": "Pensão Alimentícia",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, pág. 110"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CPF do Alimentante (quem pagou); Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "isenção só para pensão alimentícia (ADI nº 5422/DF), não para pensão por morte. Beneficiário é o indicado na ação judicial ou escritura, mesmo menor ou incapaz, ainda que pago ao responsável legal; inclui alimentos provisionais e pagamentos via PJ"
   },
   {
    "campo": "Observações",
    "texto": "novidade desde ADI 5422; antes era tributável (carnê-leão)"
   }
  ]
 },
 {
  "id": "F-ISENTO-99",
  "nome": "Outros",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Isentos, págs. 111 a 113"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Descrição; Valor"
   },
   {
    "campo": "Validações conhecidas (lista de enquadramentos)",
    "texto": "sinistro/furto/roubo menos custo do bem; pensões de portador de deficiência mental; proventos de ex-combatente da FEB; PIS/Pasep; desapropriação de terra nua para reforma agrária menos custo; seguro-desemprego, auxílios natalidade, doença, funeral, acidente; contribuições de 1989 a 1995 resgatadas de previdência complementar, PGBL e Fapi; indenização de anistiados/desaparecidos políticos (Lei 10.559/2002); quotas parlamentares; variação cambial de depósitos não remunerados no exterior; bolsas do art. 19 da Lei 12.871/2013 e art. 16 da Lei 11.129/2005; pensão especial da Talidomida; créditos de ICMS/ISS de programas de nota fiscal (prêmios de sorteio são exclusivos 30%); vale-cultura; doação/herança/pensão isentas recebidas de não residente; juros de mora de remuneração (exceto RRA, que vão na ficha RRA); excesso de 13º isento 65 anos de mais de uma fonte; outros isentos previstos em lei. Diárias e ajuda de custo de remoção não justificam acréscimo patrimonial; garimpeiros até 90% presumidos consumidos"
   },
   {
    "campo": "Importações",
    "texto": "pode ser lançado a partir de Bens e Direitos grupo 07, códigos 02 (Fiagro) e 03 (FII), rendimentos isentos de cotas"
   }
  ]
 },
 {
  "id": "F-EXCL",
  "nome": "Rendimentos Sujeitos à Tributação Exclusiva/Definitiva (ficha)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Fichas da Declaração > Rendimentos Sujeitos à Tributação Exclusiva/Definitiva; págs. 114 a 120"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos; mesmos recortes de período de Final de Espólio e Saída Definitiva"
   },
   {
    "campo": "Estrutura",
    "texto": "Aba \"Rendimentos\" (Novo, Editar, Excluir, seleção de Tipo de Rendimento, Ok/Cancelar); Aba \"Totais\" (somatório por código)"
   },
   {
    "campo": "Códigos",
    "texto": "01 a 13 e 99 (o código 13 consta no corpo da Ajuda, não no índice)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "não entra na base de cálculo do ajuste; compõe total de rendimentos tributáveis exclusivamente na fonte no Resumo (Outras Informações) e justifica patrimônio"
   },
   {
    "campo": "Importações",
    "texto": "01 e 08 da ficha Rendimentos PJ (campo 13º); 02, 03, 04 do GCAP; 05 da Renda Variável e FII/Fiagro; 07 e 09 da ficha RRA (opção exclusiva); 12 da ficha Bens e Direitos (Lei 14.754/2023); 06 e 10 podem vir de Bens e Direitos"
   }
  ]
 },
 {
  "id": "F-EXCL-01",
  "nome": "13º salário",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "nenhum editável (transportado)"
   },
   {
    "campo": "Importações",
    "texto": "campo 13º salário da ficha Rendimentos Tributáveis Recebidos de PJ pelo Titular"
   }
  ]
 },
 {
  "id": "F-EXCL-02",
  "nome": "Ganhos de capital na alienação de bens e/ou direitos",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "transportado"
   },
   {
    "campo": "Importações",
    "texto": "GCAP 2025, inclusive ganhos na integralização de capital de PJ por valor superior ao declarado, sucessão e doação em adiantamento da legítima por valor superior ao da DIRPF 2025, e dissolução conjugal/união estável quando o bem é incluído por valor superior à Situação em 31/12/2024 do cônjuge"
   }
  ]
 },
 {
  "id": "F-EXCL-03",
  "nome": "Ganhos de capital na alienação de bens, direitos e aplicações financeiras adquiridos em moeda estrangeira",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "transportado"
   },
   {
    "campo": "Importações",
    "texto": "GCAP 2025"
   }
  ]
 },
 {
  "id": "F-EXCL-04",
  "nome": "Ganhos de capital na alienação de moeda estrangeira em espécie",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "transportado"
   },
   {
    "campo": "Importações",
    "texto": "GCAP 2025"
   }
  ]
 },
 {
  "id": "F-EXCL-05",
  "nome": "Ganhos líquidos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "transportado"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "ganhos líquidos menos o imposto pago"
   },
   {
    "campo": "Importações",
    "texto": "Demonstrativo de Renda Variável (comuns e day trade) e Operações em FII ou Fiagro"
   }
  ]
 },
 {
  "id": "F-EXCL-06",
  "nome": "Rendimentos de aplicações financeiras",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor (líquido: rendimento menos imposto)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "renda fixa, FIF, fundos de cotas, fundos de ações, swap"
   },
   {
    "campo": "Importações",
    "texto": "pode ser lançado a partir de Bens e Direitos: grupo 04 código 02 (Tesouro Direto, CDB, RDB e outros); grupo 07 códigos 01 (come-cotas Lei 14.754/2023), 02 (Fiagro), 03 (FII), 04 (FIA e Fundos Mútuos de Privatização FGTS), 06 (FIP, FIDC entidade de investimento, ETF entidade de investimento), 07 (FIP-IE e FIP-PD&I), 08 (ETF de renda fixa), 10 (Fundos de Infraestrutura, FIDC e outros alíquota 0%)"
   }
  ]
 },
 {
  "id": "F-EXCL-07",
  "nome": "Rendimentos recebidos acumuladamente (titular)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "transportado"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "total de rendimentos recebidos menos contribuição previdenciária oficial, pensão alimentícia e IRRF, da ficha RRA do titular com opção \"Exclusiva na Fonte\""
   }
  ]
 },
 {
  "id": "F-EXCL-08",
  "nome": "13º salário recebido pelos dependentes",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "transportado"
   },
   {
    "campo": "Importações",
    "texto": "campo 13º salário da ficha Rendimentos Tributáveis Recebidos de PJ pelos Dependentes"
   }
  ]
 },
 {
  "id": "F-EXCL-09",
  "nome": "Rendimentos recebidos acumuladamente pelos dependentes",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "transportado"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "idem F-EXCL-07, da ficha RRA dos dependentes com opção exclusiva"
   }
  ]
 },
 {
  "id": "F-EXCL-10",
  "nome": "Juros sobre capital próprio",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor"
   },
   {
    "campo": "Importações",
    "texto": "pode ser lançado a partir de Bens e Direitos grupo 03 código 01 (Ações)"
   }
  ]
 },
 {
  "id": "F-EXCL-11",
  "nome": "Participação nos lucros ou resultados da empresa (PLR)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor"
   }
  ]
 },
 {
  "id": "F-EXCL-12",
  "nome": "Aplicações Financeiras e Lucros e Dividendos no Exterior (Lei 14.754/2023)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "transportado"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "rendimentos líquidos informados nos campos específicos da ficha Bens e Direitos (aplicações financeiras e lucros/dividendos de entidades no exterior). A apuração anual do imposto de 15% ocorre no Resumo (inferido, conferir com F-BENS-ESP)"
   }
  ]
 },
 {
  "id": "F-EXCL-13",
  "nome": "Prêmios líquidos obtidos em loterias de apostas de quota fixa (Lei 14.790/2023)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; Descrição; Valor (saldos das contas gráficas do apostador conforme comprovantes dos agentes operadores de apostas)"
   },
   {
    "campo": "Observações",
    "texto": "código presente no corpo da Ajuda e ausente do índice da seção; provável novidade recente"
   }
  ]
 },
 {
  "id": "F-EXCL-99",
  "nome": "Outros",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Descrição; Valor (líquido)"
   },
   {
    "campo": "Validações conhecidas (enquadramentos)",
    "texto": "prêmios de loterias, sorteios, concursos, corridas de cavalos e programas de nota fiscal; amortização antecipada por sorteio de títulos de capitalização; participação de portadores de títulos de capitalização nos lucros; benefícios e resgates de previdência complementar e VGBL com opção pela tabela regressiva (arts. 1º e 2º da Lei 11.053/2004); outros exclusivos na fonte"
   }
  ]
 },
 {
  "id": "F-SUSP",
  "nome": "Rendimentos Tributáveis de PJ (Imposto com Exigibilidade Suspensa)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Fichas da Declaração; págs. 121 a 124. Duas abas: Titular e Dependentes"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos; recortes de período de Final de Espólio e Saída Definitiva"
   },
   {
    "campo": "Observações",
    "texto": "dados meramente informativos, não somados aos rendimentos tributáveis na apuração"
   }
  ]
 },
 {
  "id": "F-SUSP-TIT",
  "nome": "Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) - Titular",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Titular, pág. 122"
   },
   {
    "campo": "Campos",
    "texto": "Nome da fonte pagadora; CPF/CNPJ da fonte pagadora; Rendimentos tributáveis (imposto com exigibilidade suspensa); Depósitos judiciais do imposto"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "fonte obtida do comprovante; sem comprovante, usar contracheques ou recibos. Botões Novo, Editar, Excluir (exclusão múltipla), Ok"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "rendimentos e depósitos judiciais transportados ao Resumo (Outras Informações), sem entrar no cálculo do imposto"
   }
  ]
 },
 {
  "id": "F-SUSP-DEP",
  "nome": "Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) - Dependentes",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Dependentes, pág. 123"
   },
   {
    "campo": "Campos",
    "texto": "Dependente (seleção entre os da ficha Dependentes); Nome e CPF/CNPJ da fonte; Rendimentos tributáveis; Depósitos judiciais do imposto"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "dependente precisa estar cadastrado antes na ficha Dependentes"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "idem titular, informativo"
   }
  ]
 },
 {
  "id": "F-RRA",
  "nome": "Rendimentos Recebidos Acumuladamente (ficha)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Fichas da Declaração; págs. 125 a 134. Abas Titular e Dependentes"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos; recortes de período de Final de Espólio e Saída Definitiva"
   },
   {
    "campo": "Regras gerais",
    "texto": "RRA de anos anteriores a 2025 sujeitos à tabela progressiva, inclusive decisões das Justiças do Trabalho, Federal, Estaduais e DF. Regra geral é tributação exclusiva na fonte; opção irretratável pelo ajuste anual, individual por titular e por dependente, deve refletir o total recebido por cada um e ser a mesma para todos os RRA de um mesmo contribuinte. A opção só pode ser alterada até 29/05/2026; exceção: se a fonte não reteve conforme IN RFB 1.500/2014 ou reteve a maior, pode mudar para exclusiva mesmo após 29/05/2026\n- Não declarar aqui RRA do próprio ano-calendário (vão na ficha da natureza, sujeitos a ajuste, salvo 13º)"
   },
   {
    "campo": "Despesas judiciais e honorários",
    "texto": "proporcionalizar entre tributável e isento; lançar em Pagamentos Efetuados código 60 (honorários de ações judiciais, exceto trabalhistas) ou 61 (ações trabalhistas), com nome e CPF/CNPJ do advogado/escritório e valor"
   },
   {
    "campo": "Parcela isenta incluída no RRA",
    "texto": "lançar nas linhas da ficha Isentos, exceto parcela isenta 65 anos (campo próprio na ficha RRA) e juros de mora (campo próprio, transportado para Isentos código 27)"
   }
  ]
 },
 {
  "id": "F-RRA-TIT",
  "nome": "Rendimentos Tributáveis de PJ Recebidos Acumuladamente pelo Titular",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Titular, págs. 126 a 132"
   },
   {
    "campo": "Campos",
    "texto": "Opção pela forma de tributação (Ajuste Anual ou Exclusiva na Fonte); Nome da fonte pagadora; CPF/CNPJ da fonte pagadora; Rendimentos tributáveis (inclui acréscimos e 13º, exceto juros de mora); Parcela isenta 65 anos; Valor recebido referente a juros; Contribuição previdenciária oficial; Pensão alimentícia; Imposto retido na fonte; Mês do recebimento; Número de meses"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "opção igual para todos os RRA do titular; prazo de alteração 29/05/2026 (exceções acima); 13º recebido acumuladamente conta como 1 mês; com opção exclusiva não há parcela isenta 65 anos (o valor é somado aos rendimentos tributáveis para formar \"Total Rendimentos Tributáveis\"); várias fontes: apuração separada por fonte e por mês, unificada quando a mesma fonte paga mais de uma vez no mesmo mês; RRA complementar: opção independente se o RRA original foi de ano anterior, igual se do mesmo ano; sucessão causa mortis: mesmo número de meses do de cujus por sucessor, opção independente para parcelas em ano posterior"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "- Ajuste Anual: rendimentos entram na base de cálculo da DAA; IRRF é antecipação (vai para imposto retido, inferido).\n- Exclusiva na Fonte: imposto = tabela progressiva mensal do mês do recebimento multiplicada pelo número de meses; base = rendimentos menos pensão alimentícia judicial/escritura (art. 733 CPC) menos previdência oficial. Imposto apurado é adicionado ao imposto da DAA, com mesmos prazos e condições (ajuste específico permite restituir ou pagar diferença). Líquido (rendimentos menos previdência, pensão e IRRF) vai para Exclusivos código 07.\n- Parcelas em meses distintos (mesma fonte, exclusiva): meses da parcela = meses totais x (parcela / total), arredondado a 1 casa decimal com regra específica (2ª casa menor que 5 mantém; maior que 5 soma 1; igual a 5 olha a 3ª casa: 0 a 4 mantém, 5 a 9 soma 1). Exemplo da Ajuda: 44 meses, R$ 300.000,00 em 5 parcelas, resultando 19,5; 0,6; 0,6; 0,5; 22,8.\n- Parcelas no mesmo mês: soma às anteriores, recalcula base e imposto e deduz o IRRF das parcelas anteriores.\n- RRA complementar: imposto = incidente sobre o total pago (inclusive superveniente) menos retidos anteriores.\n- Juros vão para Isentos código 27."
   }
  ]
 },
 {
  "id": "F-RRA-DEP",
  "nome": "Rendimentos Tributáveis de PJ Recebidos Acumuladamente pelos Dependentes",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "aba Dependentes, págs. 133 e 134"
   },
   {
    "campo": "Campos",
    "texto": "Tipo de dependente/Dependente (seleção); Opção pela forma de tributação; Nome e CPF/CNPJ da fonte pagadora; Rendimentos tributáveis; Parcela isenta 65 anos; Valor recebido referente a juros; Contribuição previdenciária oficial; Pensão alimentícia; Imposto retido na fonte; Mês do recebimento; Número de meses"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "mesmas do titular; abrange RRA de PJ e de PF (texto da Ajuda); opção individual por dependente"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "idem titular; líquido exclusivo vai para Exclusivos código 09"
   }
  ]
 },
 {
  "id": "F-IMPPAGO",
  "nome": "Imposto Pago/Retido (ficha)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Fichas da Declaração > Imposto Pago/Retido; págs. 135 e 136"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (inferido)"
   }
  ]
 },
 {
  "id": "F-IMPPAGO-01",
  "nome": "Linha 01: Imposto Complementar",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "Valor (Darf código 0246 pago de 01/01/2025 a 31/12/2025)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "recolhimento facultativo para antecipar o imposto do ajuste quando há duas ou mais fontes (PF e PJ ou mais de uma PJ)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "dedução do imposto devido (imposto pago)"
   }
  ]
 },
 {
  "id": "F-IMPPAGO-02",
  "nome": "Linha 02: Imposto pago no exterior pelo titular e pelos dependentes",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "compensável só se relativo a rendimentos informados em \"Outras Informações\", coluna Exterior, da ficha Rendimentos Tributáveis de PF e do Exterior; país com acordo ou reciprocidade, imposto não restituível/compensável no país de origem. Países listados: África do Sul, Argentina, Áustria, Bélgica, Canadá, Chile, China, Coreia do Sul, Dinamarca, Emirados Árabes Unidos, Equador, Eslováquia, Espanha, Filipinas, Finlândia, França, Hungria, Índia, Israel, Itália, Japão, Luxemburgo, México, Noruega, Países Baixos (Holanda), Peru, Portugal, República Tcheca, Rússia, Singapura, Suécia, Suíça, Trinidad e Tobago, Turquia, Ucrânia, Uruguai, Venezuela. Reciprocidade sem prova: Alemanha, Estados Unidos e Reino Unido. Reciprocidade não alcança tributos estaduais e municipais. País sem acordo/reciprocidade: rendimento informado, imposto não compensável"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "limite de compensação = imposto apurado com rendimentos do exterior menos imposto apurado sem eles; o Resumo mostra o valor limitado, enquanto a ficha mantém o valor digitado. Conversão: moeda para dólar (autoridade monetária do país, data do recebimento) e dólar para real (compra Bacen, último dia útil da 1ª quinzena do mês anterior)"
   }
  ]
 },
 {
  "id": "F-IMPPAGO-03",
  "nome": "Linha 03: Imposto sobre a renda na fonte (Lei nº 11.033/2004)",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "Valor"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "IR fonte de §§ 1º e 2º, inciso II, art. 2º da Lei 11.033/2004 (o \"dedo-duro\" de 0,005% em operações de bolsa, inferido), retido no período, desde que não deduzido do imposto sobre ganhos líquidos do mês, não compensado em meses seguintes nem com ganho de capital em alienação de ações"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "imposto pago/retido no ajuste; relação com o saldo \"IR fonte (Lei 11.033/2004) a compensar\" do Demonstrativo de Renda Variável (inferido)"
   }
  ]
 },
 {
  "id": "F-IMPPAGO-04",
  "nome": "Linha 04: Imposto retido na fonte do titular",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "calculado"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "soma do IRRF do titular na ficha Rendimentos Tributáveis PJ Titular mais \"IRRF\" e \"IRRF sobre 13º\" do código 11 de Isentos (titular)"
   }
  ]
 },
 {
  "id": "F-IMPPAGO-05",
  "nome": "Linha 05: Imposto retido na fonte dos dependentes",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "calculado"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "soma do IRRF da ficha Rendimentos Tributáveis PJ Dependentes mais IRRF e IRRF 13º do código 11 de Isentos (dependentes)"
   }
  ]
 },
 {
  "id": "F-IMPPAGO-06",
  "nome": "Linha 06: Carnê-Leão do titular",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "calculado"
   },
   {
    "campo": "Importações",
    "texto": "total do imposto pago de Carnê-Leão do titular na ficha Rendimentos Tributáveis de PF e do Exterior pelo Titular (Darf 0190, inclusive importação do Carnê-Leão Web)"
   }
  ]
 },
 {
  "id": "F-IMPPAGO-07",
  "nome": "Linha 07: Carnê-Leão dos dependentes",
  "fonte": "docs/mapeamento/notas/03-isentos-exclusivos-rra.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "calculado"
   },
   {
    "campo": "Importações",
    "texto": "total do imposto pago de Carnê-Leão dos dependentes na ficha PF/Exterior pelos Dependentes"
   },
   {
    "campo": "Observações",
    "texto": "a Ajuda não cita aqui o IRRF de RRA com opção pelo ajuste nem o imposto pago de GCAP/RV, que não entram nesta ficha (inferido: IRRF de RRA no ajuste compõe imposto retido no Resumo; conferir no bloco F-RESUMO)"
   }
  ]
 },
 {
  "id": "F-PAG",
  "nome": "Pagamentos Efetuados (ficha)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Fichas da Declaração > Pagamentos Efetuados; págs. 137 a 142; botões Novo, Editar, Excluir, OK; rodapé com \"Importar arquivo do plano de saúde\" (atalho Alt+I)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos. Final de Espólio: de 1º/01 até a data da decisão judicial da partilha, sobrepartilha ou adjudicação ou da lavratura da escritura (ano todo se ainda houver bens a inventariar que gerem rendimentos). Saída Definitiva: de 1º/01 até o dia anterior ao da caracterização da condição de não residente."
   },
   {
    "campo": "Campos (por lançamento)",
    "texto": "Código (tabela de pagamentos); Despesa realizada com (Titular, Dependente ou Alimentando, conforme o código); Dependente ou Alimentando (seleção entre os já cadastrados nas fichas Dependentes e Alimentandos); Nome do beneficiário; CPF ou CNPJ do beneficiário; NIT do empregado doméstico (campo NR_NIT_EMP_DOM no layout, inferido); Descrição; Valor pago; Parcela não dedutível/valor reembolsado; Contribuição do ente público patrocinador (só código 37)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Relacionar todos os pagamentos a pessoas físicas (pensão, aluguéis, arrendamento rural, instrução, autônomos: médicos, dentistas, psicólogos, advogados, engenheiros, arquitetos, corretores, professores, mecânicos etc.) e a pessoas jurídicas quando dedutíveis.\n- Falta de informação sujeita à multa de 20% do valor não declarado.\n- Códigos 01, 02, 09 a 22 e 26: informar se a despesa é do titular, dependente ou alimentando.\n- Códigos 30, 31, 33 e 34: informar o nome do alimentando; 30 e 33: CPF do alimentando obrigatório.\n- Códigos 36, 37 e 99: informar se é do titular ou dependente.\n- Códigos 60, 61, 62, 66, 70, 71, 72 e 76: não exigem indicação do CPF do titular ou dependente (pode ir na descrição).\n- Beneficiário residente ou domiciliado no Brasil: CPF ou CNPJ obrigatório conforme a tabela; CPF/CNPJ ausente ou inválido impede a gravação da declaração (Erros mais Frequentes, pág. 424).\n- Dependente ou alimentando precisa existir antes na ficha correspondente; as despesas só são consideradas se o dependente ou alimentando for indicado (FAQ pág. 406).\n- Excluir apaga todos os campos da linha.\n- Autônomos, leiloeiros, titulares de serviços notariais e de registro e quem explora atividade rural estão dispensados de informar aqui as despesas escrituradas em livro Caixa.\n- Comprovantes guardados até a prescrição."
   },
   {
    "campo": "Códigos",
    "texto": "01, 02, 09 a 22, 26, 30, 31, 33, 34, 36, 37, 60, 61, 62, 66, 70, 71, 72, 76, 99 (detalhe nos blocos F-PAG-xx)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "deduções do Resumo (instrução limitada, médicas sem limite, pensão, previdência complementar limitada a 12%); códigos sem efeito de dedução (60 a 99) são informativos"
   },
   {
    "campo": "Importações/exportações",
    "texto": "declaração 2025 traz nome e CPF/CNPJ dos beneficiários (pág. 396); pré-preenchida traz pagamentos (Dmed, Carnê-Leão de profissionais); Informe de Plano de Saúde (XML) cria lançamentos de código 26 com reembolsos; exclusão de dependente apaga automaticamente seus pagamentos"
   },
   {
    "campo": "Observações",
    "texto": "o FAQ cita os códigos 01, 02, 09 a 22, 26, 36, 37 e 99 como os que exibem o quadro de dependentes"
   }
  ]
 },
 {
  "id": "F-PAG-INSTR",
  "nome": "Despesas com Instrução (regras comuns aos códigos 01 e 02)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Pagamentos Efetuados; págs. 143 e 144"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (deduções legais)"
   },
   {
    "campo": "Campos",
    "texto": "Código 01 ou 02; Titular/Dependente/Alimentando; Nome da instituição de educação; CNPJ da instituição (se domiciliada no Brasil); Descrição; Valor pago; Parcela não dedutível/valor reembolsado"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Dedutíveis: educação infantil (creches e pré-escolas); ensino fundamental; ensino médio; educação superior (graduação, mestrado, doutorado, especialização); educação profissional (técnico e tecnológico).\n- Não dedutíveis: uniforme, material e transporte escolar, elaboração de dissertação; enciclopédias, livros, revistas e jornais; aulas particulares; música, dança, natação, ginástica, tênis, pilotagem, dicção, corte e costura, informática e assemelhados; cursinhos preparatórios para concursos e vestibulares; idiomas; contribuições a entidades que criem e eduquem menores desvalidos; associações de pais e mestres e associações voltadas à educação; passagens e estadas para estudo.\n- Alimentando só com decisão judicial, acordo homologado ou escritura pública (art. 733 CPC).\n- Informar o valor total pago a cada instituição, mesmo acima do limite.\n- Declaração em separado: cada cônjuge só deduz despesas dos dependentes e alimentandos indicados na própria declaração; o cônjuge que inclui o filho como dependente pode deduzir mesmo com recibo em nome do outro."
   },
   {
    "campo": "Códigos",
    "texto": "01 instrução no Brasil (CNPJ obrigatório); 02 instrução no exterior (sem CPF/CNPJ)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "transportado ao Resumo: (pago menos reembolsado/não dedutível) limitado a R$ 3.561,50 para o titular, para cada dependente e para cada alimentando; excesso de uma pessoa não compensa outra"
   }
  ]
 },
 {
  "id": "F-PAG-01",
  "nome": "Código 01, Despesas com instrução no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular/dependente/alimentando; nome da instituição; CNPJ (obrigatório); descrição; valor pago; parcela não dedutível"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-INSTR"
   }
  ]
 },
 {
  "id": "F-PAG-02",
  "nome": "Código 02, Despesas com instrução no exterior",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular/dependente/alimentando; nome da instituição; descrição; valor pago; parcela não dedutível (sem CPF/CNPJ)"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-INSTR; conversão em moeda estrangeira pela cotação de venda (pág. 147, por analogia, inferido)"
   }
  ]
 },
 {
  "id": "F-PAG-MED",
  "nome": "Despesas Médicas (regras comuns aos códigos 09 a 22 e 26)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Pagamentos Efetuados; págs. 145 a 147"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (deduções legais)"
   },
   {
    "campo": "Campos",
    "texto": "Código; Titular/Dependente/Alimentando; Nome do profissional ou instituição; CPF do profissional ou CNPJ da instituição (se residente/domiciliado no Brasil); Descrição; Valor pago; Parcela não dedutível/valor reembolsado"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Dedutíveis (próprio, dependentes e alimentandos por decisão judicial, acordo homologado ou escritura): médicos, dentistas, psicólogos, fisioterapeutas, terapeutas ocupacionais, fonoaudiólogos, hospitais, exames laboratoriais, serviços radiológicos, aparelhos e próteses ortopédicas e dentárias (pernas e braços mecânicos, cadeira de rodas, andadores, palmilhas e calçados ortopédicos, aparelhos para desvio de coluna ou defeitos de membros/articulações; parafusos, placas, marcapasso e lente intraocular se na conta hospitalar); planos de saúde de empresas domiciliadas no Brasil; estabelecimento geriátrico qualificado como hospital; estabelecimentos especializados na instrução de pessoa com deficiência; entidade do empregador com convênio direto.\n- Não dedutíveis: reembolsadas ou cobertas por seguro; enfermeiros e remédios fora da conta hospitalar; óculos, lentes de contato, aparelhos de surdez e similares; planos de saúde pagos no exterior.\n- Comprovação: documento com nome, endereço e CPF/CNPJ do beneficiário residente no Brasil, ou cheque nominativo; deficiência exige laudo; próteses exigem receituário e nota fiscal em nome do beneficiário.\n- Parcela não dedutível: despesas pagas pelo declarante que não sejam dele nem de dependentes/alimentandos. Valor reembolsado: reembolso do empregador sem retenção do recibo; despesas pagas por plano de saúde; auxílio-saúde ou assistência-saúde do empregador.\n- Reembolso: informar nome, CPF/CNPJ da entidade e valor do comprovante de rendimentos; se o contribuinte reembolsar a empresa, o valor reembolsado é despesa médica.\n- Moeda estrangeira: moeda para dólar pela autoridade do país na data do pagamento e dólar para real pela cotação de VENDA do Bacen do último dia útil da 1ª quinzena do mês anterior.\n- Cônjuge que inclui o filho como dependente pode deduzir mesmo com recibo em nome do outro."
   },
   {
    "campo": "Códigos",
    "texto": "09, 10, 11, 12, 13, 14, 21, 26 (Brasil, CPF ou CNPJ obrigatório); 15, 16, 17, 18, 19, 20, 22 (exterior, sem CPF/CNPJ)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "Resumo, linha Despesas médicas = total pago menos não dedutível, sem limite"
   }
  ]
 },
 {
  "id": "F-PAG-09",
  "nome": "Código 09, Fonoaudiólogos no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular/dependente/alimentando; nome do profissional; CPF obrigatório; descrição; valor; parcela não dedutível"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-MED"
   }
  ]
 },
 {
  "id": "F-PAG-10",
  "nome": "Código 10, Médicos no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-09 (CPF obrigatório)"
   }
  ]
 },
 {
  "id": "F-PAG-11",
  "nome": "Código 11, Dentistas no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-09 (CPF obrigatório)"
   }
  ]
 },
 {
  "id": "F-PAG-12",
  "nome": "Código 12, Psicólogos no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-09 (CPF obrigatório)"
   }
  ]
 },
 {
  "id": "F-PAG-13",
  "nome": "Código 13, Fisioterapeutas no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-09 (CPF obrigatório)"
   }
  ]
 },
 {
  "id": "F-PAG-14",
  "nome": "Código 14, Terapeutas ocupacionais no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-09 (CPF obrigatório)"
   }
  ]
 },
 {
  "id": "F-PAG-15",
  "nome": "Código 15, Médicos no exterior",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular/dependente/alimentando; nome do profissional; descrição; valor; parcela não dedutível (sem CPF/CNPJ)"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-MED; conversão cambial pela cotação de venda"
   }
  ]
 },
 {
  "id": "F-PAG-16",
  "nome": "Código 16, Dentistas no exterior",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-15"
   }
  ]
 },
 {
  "id": "F-PAG-17",
  "nome": "Código 17, Psicólogos no exterior",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-15"
   }
  ]
 },
 {
  "id": "F-PAG-18",
  "nome": "Código 18, Fisioterapeutas no exterior",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-15"
   }
  ]
 },
 {
  "id": "F-PAG-19",
  "nome": "Código 19, Terapeutas ocupacionais no exterior",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-15"
   }
  ]
 },
 {
  "id": "F-PAG-20",
  "nome": "Código 20, Fonoaudiólogos no exterior",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-15"
   }
  ]
 },
 {
  "id": "F-PAG-21",
  "nome": "Código 21, Hospitais, clínicas e laboratórios com saúde humana no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular/dependente/alimentando; nome da instituição; CNPJ obrigatório; descrição; valor; parcela não dedutível"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-MED"
   }
  ]
 },
 {
  "id": "F-PAG-22",
  "nome": "Código 22, Hospitais, clínicas e laboratórios com saúde humana no exterior",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular/dependente/alimentando; nome da instituição; descrição; valor; parcela não dedutível (sem CNPJ)"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-MED; conversão cambial"
   }
  ]
 },
 {
  "id": "F-PAG-26",
  "nome": "Código 26, Planos de saúde no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular/dependente/alimentando; nome da operadora; CNPJ obrigatório; descrição; valor pago; parcela não dedutível/valor reembolsado"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "plano pago no exterior não é dedutível; reembolsos e auxílio-saúde do empregador vão no valor reembolsado"
   },
   {
    "campo": "Importações",
    "texto": "Informe de Plano de Saúde (XML: CNPJ e nome do plano, CPF do beneficiário titular/dependente/alimentando, exercício e ano-calendário, valor pago, reembolso; pág. 391); pré-preenchida (Dmed)"
   }
  ]
 },
 {
  "id": "F-PAG-PENSAO",
  "nome": "Pensão alimentícia judicial ou por escritura pública (regras comuns aos códigos 30, 31, 33 e 34)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Pagamentos Efetuados; págs. 148 e 149"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (deduções legais; também no RRA)"
   },
   {
    "campo": "Campos",
    "texto": "Código; Alimentando (seleção na ficha Alimentandos; nomes de todos os alimentandos); CPF do alimentando (obrigatório se residente no Brasil); Descrição; Valor total pago no ano; Parcela não dedutível/valor reembolsado"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Dedutível só a pensão por decisão judicial (inclusive alimentos provisionais e acordo homologado) ou por escritura pública de separação/divórcio (art. 733 CPC); pensão por liberalidade não é dedutível.\n- Não informar CPF de quem recebe em nome do alimentando.\n- Despesas médicas e de instrução pagas pelo alimentante não entram aqui: vão nos códigos próprios (médicas integralmente, instrução com limite) se previstas na decisão ou escritura.\n- Pensão sobre o 13º salário: dedutível só na tributação exclusiva do 13º; informar como parcela não dedutível.\n- Separação ou divórcio em 2025 com pensão paga: somente em 2025 pode considerar o alimentando como dependente e também deduzir a pensão; fora disso, dedução de dependente e de pensão não são cumulativas, salvo mudança na relação de dependência no ano.\n- Informar todos os alimentandos mesmo que o desconto seja feito em nome de um só."
   },
   {
    "campo": "Códigos",
    "texto": "30 judicial a residente; 31 judicial a não residente; 33 escritura pública a residente; 34 escritura pública a não residente"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "Resumo, linhas 7 (códigos 30 e 31) e 8 (códigos 33 e 34) das deduções"
   }
  ]
 },
 {
  "id": "F-PAG-30",
  "nome": "Código 30, Pensão alimentícia judicial paga a residente no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "alimentando; CPF do alimentando (obrigatório); descrição; valor; parcela não dedutível"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-PENSAO"
   }
  ]
 },
 {
  "id": "F-PAG-31",
  "nome": "Código 31, Pensão alimentícia judicial paga a não residente no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "alimentando; nome; descrição; valor; parcela não dedutível (a tabela da pág. 139 indica CPF; o texto exige CPF só para residente, dúvida)"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-PENSAO"
   }
  ]
 },
 {
  "id": "F-PAG-33",
  "nome": "Código 33, Pensão alimentícia por escritura pública (separação/divórcio) paga a residente no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "idem F-PAG-30 (CPF obrigatório)"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-PENSAO"
   }
  ]
 },
 {
  "id": "F-PAG-34",
  "nome": "Código 34, Pensão alimentícia por escritura pública paga a não residente no Brasil",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "idem F-PAG-31"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-PENSAO"
   }
  ]
 },
 {
  "id": "F-PAG-PREV",
  "nome": "Previdência Complementar e Fapi (regras comuns aos códigos 36 e 37)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Pagamentos Efetuados; págs. 150 a 155"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (deduções legais)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Dedutíveis os pagamentos do contribuinte, em seu nome e dos dependentes, a entidades de previdência complementar domiciliadas no Brasil (inclusive PGBL) e ao Fapi, com ônus da própria pessoa física.\n- Condição: também contribuir para o regime geral ou regime próprio, observada a contribuição mínima; exceção para aposentado ou pensionista de regime próprio ou geral.\n- Plano cujo titular é dependente: dedutível se o declarante contribui para regime geral ou próprio; dependente com mais de 16 anos exige também contribuição em nome do dependente.\n- Contribuições extraordinárias vão em \"Parcela não dedutível\" do código 36.\n- VGBL não é pagamento dedutível: vai em Bens e Direitos, grupo 99, código 06."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "Resumo, linha 3 das deduções: códigos 36 e 37 (no 37 só o excedente à contribuição do patrocinador) limitados a 12% do total dos rendimentos tributáveis da base de cálculo (excluídos isentos e exclusivos); a parte do 37 até a contribuição do patrocinador vai na linha 1 (sem o limite de 12%). O programa aplica o limite (FAQ pág. 406)."
   }
  ]
 },
 {
  "id": "F-PAG-36",
  "nome": "Código 36, Previdência Complementar (inclusive Fapi)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular ou dependente; nome e CNPJ da entidade/seguradora/administradora do Fapi (CNPJ obrigatório); descrição; valor pago; parcela não dedutível"
   },
   {
    "campo": "Regras",
    "texto": "ver F-PAG-PREV"
   }
  ]
 },
 {
  "id": "F-PAG-FAPI",
  "nome": "Fapi, Fundos de Aposentadoria Programada Individual (lançado no código 36)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 152 e 153"
   },
   {
    "campo": "Campos",
    "texto": "código 36; nome e CNPJ da administradora do Fapi; descrição; valor pago; parcela não dedutível; titular ou dependente"
   },
   {
    "campo": "Regras",
    "texto": "limite conjunto de 12% com a previdência complementar; mesmas condições de dedutibilidade de F-PAG-PREV"
   }
  ]
 },
 {
  "id": "F-PAG-37",
  "nome": "Código 37, Contribuições a entidades de previdência complementar do § 15 do art. 40 da CF (Funpresp e similares)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 154 e 155"
   },
   {
    "campo": "Campos",
    "texto": "titular ou dependente (nome do dependente); CNPJ da Fundação ou do Plano (obrigatório); Nome da Fundação ou do Plano; Descrição; Valor pago; Contribuição do ente público patrocinador"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "dedutível até o limite da contribuição do patrocinador; o excedente entra no limite global de 12% com previdência complementar e Fapi; botões Novo, Editar, Excluir (múltiplas linhas), Ok"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "linha 1 (até o patrocinador) e linha 3 (excedente) das deduções do Resumo"
   }
  ]
 },
 {
  "id": "F-PAG-60",
  "nome": "Código 60, Advogados (honorários de ações judiciais, exceto trabalhistas)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular ou dependente (informativo); nome do advogado ou escritório; CPF ou CNPJ obrigatório; descrição; valor pago"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "não é dedução direta; usado para despesas de ações judiciais que geram rendimentos (RRA e rendimentos da natureza), proporcionalizadas entre tributável, exclusivo e isento (ver notas 01 e 03)"
   }
  ]
 },
 {
  "id": "F-PAG-61",
  "nome": "Código 61, Advogados (honorários de ações judiciais trabalhistas)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos e regras",
    "texto": "idem F-PAG-60, para ações trabalhistas que geram rendimentos"
   }
  ]
 },
 {
  "id": "F-PAG-62",
  "nome": "Código 62, Advogados (demais honorários)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular ou dependente; nome; CPF ou CNPJ obrigatório; descrição; valor"
   },
   {
    "campo": "Regras",
    "texto": "informativo, sem dedução"
   }
  ]
 },
 {
  "id": "F-PAG-66",
  "nome": "Código 66, Engenheiros, arquitetos e demais profissionais liberais (exceto advogados, administrador ou corretor de imóveis)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular ou dependente; nome do profissional; CPF obrigatório; descrição; valor"
   },
   {
    "campo": "Regras",
    "texto": "informativo, sem dedução"
   }
  ]
 },
 {
  "id": "F-PAG-70",
  "nome": "Código 70, Aluguéis de imóveis",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular ou dependente; nome do locador; CPF ou CNPJ obrigatório; descrição; valor pago"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "informar o locador mesmo se pago via procurador ou imobiliária"
   },
   {
    "campo": "Regras",
    "texto": "informativo, sem dedução (cruzamento com Dimob, inferido)"
   }
  ]
 },
 {
  "id": "F-PAG-71",
  "nome": "Código 71, Administrador de imóvel",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular ou dependente; nome do administrador; CPF ou CNPJ obrigatório; descrição; valor pago pela administração"
   },
   {
    "campo": "Regras",
    "texto": "informativo"
   }
  ]
 },
 {
  "id": "F-PAG-72",
  "nome": "Código 72, Corretor de imóveis",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular ou dependente; nome do corretor; CPF ou CNPJ obrigatório; descrição; valor da corretagem pela venda de imóvel"
   },
   {
    "campo": "Regras",
    "texto": "informativo; corretagem compõe a apuração do ganho de capital (inferido)"
   }
  ]
 },
 {
  "id": "F-PAG-76",
  "nome": "Código 76, Arrendamento rural",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular ou dependente; nome do arrendador; CPF ou CNPJ obrigatório; descrição; valor pago"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "obrigatório informar aqui o arrendamento pago mesmo quando lançado como despesa da atividade rural (nota 06, D-AR-RD-BRASIL)"
   },
   {
    "campo": "Regras",
    "texto": "informativo"
   }
  ]
 },
 {
  "id": "F-PAG-99",
  "nome": "Código 99, Outros",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "titular ou dependente; nome do beneficiário; CPF/CNPJ não obrigatório; descrição; valor; parcela não dedutível"
   },
   {
    "campo": "Regras",
    "texto": "informativo"
   }
  ]
 },
 {
  "id": "F-PAG-IMPPS",
  "nome": "Botão \"Importar arquivo do plano de saúde\"",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "rodapé da ficha Pagamentos Efetuados (Alt+I); também menu Importações > Informe de Plano de Saúde (Ctrl+Shift+I); pág. 142 e 391"
   },
   {
    "campo": "Campos",
    "texto": "seleção do arquivo XML do informe recebido da operadora (ano-calendário 2025); pré-visualização (telas PainelPrevisualizadorDeclaracaoAssistidaInformePlanoSaude, PainelItemPagamentosPlanoSaude, PainelItemReembolsosPlanoSaude)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "só adiciona, não apaga dados existentes; reimportar o mesmo informe duplica os lançamentos; conferência é responsabilidade do contribuinte"
   }
  ]
 },
 {
  "id": "F-DOA",
  "nome": "Doações Efetuadas (ficha)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Fichas da Declaração > Doações Efetuadas; págs. 156 a 158; botões Novo, Editar, Excluir, OK"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (recortes de período de Final de Espólio e Saída Definitiva)"
   },
   {
    "campo": "Campos",
    "texto": "Código (tabela de doações); Nome do beneficiário; CPF ou CNPJ do beneficiário; Valor pago; Parcela não dedutível (só Incentivo à Cultura); indicador de tipo CPF/CNPJ (layout registro 90, IN_TIPO_CPF_CNPJ)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "relacionar doações aos fundos da Criança e do Adolescente e da Pessoa Idosa (nacional, distrital, estaduais, municipais) e doações ou patrocínios a cultura, audiovisual, desporto e reciclagem; doações a pessoas físicas também (80, 81, 99); doação a pessoa física sem CPF (inclusive não residente) usa código 99; CPF/CNPJ ausente ou inválido impede a gravação; doação a entidade assistencial não é dedutível (erro frequente)"
   },
   {
    "campo": "Códigos",
    "texto": "40, 41, 42, 43, 44, 45, 46, 47, 80, 81, 99"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "\"Dedução de incentivo\" do cálculo do imposto (só modelo de deduções legais); códigos 80, 81 e 99 são informativos"
   },
   {
    "campo": "Importações/exportações",
    "texto": "exclusão de dependente apaga doações dele (nota 05, F-RESUMO-OPCAO); pré-preenchida pode trazer doações (DBF, inferido)"
   }
  ]
 },
 {
  "id": "F-DOA-LIMITES",
  "nome": "Limites das deduções de incentivo",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "repetido nas págs. 159 a 174"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "- Grupos: I ECA (40 e doação direta ECA); II Pessoa Idosa (44 e doação direta Idosa); III Cultura (41); IV Audiovisual (42); V Reciclagem (47); VI Desporto (43).\n- Soma de I a IV limitada a 6% do imposto apurado na DAA.\n- Soma de I a V limitada a 6%.\n- Soma de I a IV e VI limitada a 7%.\n- Não há limite individual por código (exceto Pronas e Pronon, e doações diretas na declaração com 3%).\n- Pronas/PCD (45) e Pronon (46): cada um limitado a 1% do imposto devido, fora dos limites globais.\n- Dedução só na opção pelas deduções legais; o programa calcula os limites."
   }
  ]
 },
 {
  "id": "F-DOA-40",
  "nome": "Código 40, Doações ao Estatuto da Criança e do Adolescente",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 159 e 160"
   },
   {
    "campo": "Campos",
    "texto": "nome do Fundo (nacional, estadual, distrital ou municipal); CNPJ obrigatório; valor pago"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "contribuições feitas diretamente aos fundos controlados pelos Conselhos, comprovadas por documento dos conselhos; doações diretamente na declaração vão na ficha própria; vedado deduzir em 2026 doações feitas diretamente na declaração de 2025"
   },
   {
    "campo": "Regras",
    "texto": "grupo I dos limites"
   }
  ]
 },
 {
  "id": "F-DOA-41",
  "nome": "Código 41, Incentivo à cultura",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 161 e 162"
   },
   {
    "campo": "Campos",
    "texto": "nome do produtor ou Fundo Nacional de Cultura; CPF/CNPJ do produtor ou CNPJ do FNC; valor pago; parcela não dedutível"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "projetos aprovados pelo MinC (ou Ancine para audiovisual); respeitar período de captação das portarias; incentivo em espécie comprovado por recibo de depósito e declaração do beneficiário; doações de propósito específico da Lei 13.800/2019 (art. 14, II e III) alcançadas se conformes"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "dedutível 80% das doações e 60% dos patrocínios para projetos do art. 25 da Lei 8.313/1991 (item 1: teatro, cinema, literatura, música, artes plásticas, folclore, patrimônio, humanidades, rádio e TV educativas); 100% para os segmentos do art. 18 (item 2: artes cênicas, livros de valor artístico, música erudita, exposições, acervos, curtas e médias, patrimônio, salas de cinema e teatro em municípios com menos de 100 mil habitantes); grupo III dos limites globais"
   }
  ]
 },
 {
  "id": "F-DOA-42",
  "nome": "Código 42, Incentivo à atividade audiovisual",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 163 e 164"
   },
   {
    "campo": "Campos",
    "texto": "nome do produtor, Fundo de Investimento Cultural ou Funcines; CPF/CNPJ; valor pago"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "investimentos em obras independentes via cotas de comercialização, patrocínio de obras, cotas de Funcines, projetos credenciados e programas especiais da Ancine; itens I e III só no mercado de capitais autorizado pela CVM; projetos aprovados pela Ancine"
   },
   {
    "campo": "Regras",
    "texto": "grupo IV dos limites"
   }
  ]
 },
 {
  "id": "F-DOA-43",
  "nome": "Código 43, Incentivo ao desporto",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 165 e 166"
   },
   {
    "campo": "Campos",
    "texto": "nome do proponente do projeto; CNPJ obrigatório; valor pago"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "projetos desportivos e paradesportivos aprovados pelo Ministério do Esporte (educacional, de participação ou de rendimento); vedado pagar remuneração de atleta profissional"
   },
   {
    "campo": "Regras",
    "texto": "grupo VI dos limites (teto de 7%)"
   }
  ]
 },
 {
  "id": "F-DOA-44",
  "nome": "Código 44, Fundos controlados pelos Conselhos da Pessoa Idosa",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 167 e 168"
   },
   {
    "campo": "Campos",
    "texto": "nome do Fundo; CNPJ obrigatório; valor pago"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "contribuições diretas aos fundos, comprovadas pelos conselhos; doações diretamente na declaração vão na aba \"Pessoa Idosa\" da ficha própria; vedado deduzir em 2026 doações diretas feitas na declaração de 2025"
   },
   {
    "campo": "Regras",
    "texto": "grupo II dos limites"
   }
  ]
 },
 {
  "id": "F-DOA-45",
  "nome": "Código 45, Pronas/PCD",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 169 e 170"
   },
   {
    "campo": "Campos",
    "texto": "nome da instituição; CNPJ obrigatório; valor pago"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "doações e patrocínios a ações aprovadas pelo Ministério da Saúde, por pessoas jurídicas sem fins lucrativos dedicadas a deficiências e autismo; patrocínio = incentivo com finalidade promocional"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "limitado a 1% do imposto devido, fora dos limites globais"
   }
  ]
 },
 {
  "id": "F-DOA-46",
  "nome": "Código 46, Pronon",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 171 e 172"
   },
   {
    "campo": "Campos",
    "texto": "nome da instituição; CNPJ obrigatório; valor pago"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "instituições de prevenção e combate ao câncer, ações aprovadas pelo Ministério da Saúde"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "limitado a 1% do imposto devido, fora dos limites globais"
   }
  ]
 },
 {
  "id": "F-DOA-47",
  "nome": "Código 47, Apoio direto a projetos da cadeia produtiva da reciclagem",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 173 e 174"
   },
   {
    "campo": "Campos",
    "texto": "nome do projeto (o texto diz \"nome e CNPJ do Fundo\"); CNPJ obrigatório; valor pago"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "projetos aprovados pelo Ministério do Meio Ambiente e Mudança do Clima (capacitação, incubação, pesquisas, infraestrutura, equipamentos e veículos de coleta, redes de comercialização, catadores, novas tecnologias)"
   },
   {
    "campo": "Regras",
    "texto": "grupo V dos limites (teto de 6% com I a IV)"
   }
  ]
 },
 {
  "id": "F-DOA-80",
  "nome": "Código 80, Doações em espécie",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "nome do donatário; CPF obrigatório; valor"
   },
   {
    "campo": "Regras",
    "texto": "informativo; o donatário informa em Isentos código 14 e Bens e Direitos (nota 05, F-BENS-ESP-DOACAO)"
   }
  ]
 },
 {
  "id": "F-DOA-81",
  "nome": "Código 81, Doações em bens e direitos",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "nome do donatário; CPF obrigatório; valor"
   },
   {
    "campo": "Regras",
    "texto": "informativo; doação por valor superior ao declarado gera ganho de capital do doador (GCAP)"
   }
  ]
 },
 {
  "id": "F-DOA-99",
  "nome": "Código 99, Outras",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "nome do beneficiário; CPF ou CNPJ (opcional para PF sem CPF, inclusive não residente); valor"
   },
   {
    "campo": "Regras",
    "texto": "informativo\n---"
   }
  ]
 },
 {
  "id": "F-DDD",
  "nome": "Doações Diretamente na Declaração (ficha)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha própria com abas \"Criança e Adolescente\" e \"Pessoa Idosa\"; págs. 175 a 177; botões Novo, Editar, Excluir, OK"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Declaração de Ajuste Anual com deduções legais entregue até 29/05/2026 (não se aplica fora do prazo nem no simplificado)"
   },
   {
    "campo": "Campos (por aba)",
    "texto": "Tipo de fundo (Nacional; Estadual com UF; Municipal com UF e município); Valor a doar; CNPJ do fundo (obtido da tabela pelo programa, layout registros 91 e 92)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Dedução até 3% do imposto devido por modalidade (ECA e Pessoa Idosa), dentro do limite global de 6% ou 7% com as demais deduções de incentivo, inclusive as contribuições aos fundos feitas durante 2025.\n- Pagamento até 29/05/2026, no expediente bancário; não pago gera glosa definitiva e recolhimento da diferença com acréscimos.\n- Após 29/05/2026 não se admite retificação para aumentar o valor dedutível.\n- Darf próprio por doação: código 3351 (ECA) e 9090 (Pessoa Idosa), distinto do Darf do saldo de imposto; pagamento obrigatório mesmo com restituição ou débito automático; sem parcelamento; sem débito automático; valor mínimo impresso de R$ 10,00.\n- Recolhido a maior: irreversível e repassado ao fundo; pode retificar até 29/05/2026 dentro dos limites ou considerar o excesso não dedutível. Recolhido a menor: complementar até 29/05/2026 ou retificar.\n- Exemplo: imposto devido R$ 10.000,00 gera limite global R$ 600,00 ou R$ 700,00 e limite da doação direta R$ 300,00."
   },
   {
    "campo": "Códigos",
    "texto": "Darf 3351 e 9090"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "dedução de incentivo; Darf das doações"
   },
   {
    "campo": "Importações/exportações",
    "texto": "impressão de Darf ECA (Ctrl+W) e Pessoa Idosa (Ctrl+Y); telas PainelMensagemDoacaoExcedidaECA e PainelMensagemDoacaoExcedidaIdoso avisam excesso (nome de tela)"
   }
  ]
 },
 {
  "id": "F-DDD-ECA",
  "nome": "Aba \"Criança e Adolescente\"",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "tipo de fundo; UF; município; valor; CNPJ do fundo (tabela `fundos-eca.json`)"
   },
   {
    "campo": "Regras",
    "texto": "ver F-DDD"
   }
  ]
 },
 {
  "id": "F-DDD-IDOSO",
  "nome": "Aba \"Pessoa Idosa\"",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "tipo de fundo; UF; município; valor; CNPJ do fundo (tabela `fundos-idoso.json`)"
   },
   {
    "campo": "Regras",
    "texto": "ver F-DDD\n---"
   }
  ]
 },
 {
  "id": "F-BENS",
  "nome": "Bens e Direitos (ficha, Declaração de Ajuste Anual)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Fichas da Declaração > Bens e Direitos; págs. 178 a 181; botões Novo, Editar, Excluir (múltiplas linhas), \"Repetir valores\" (copia 31/12/2024 para 31/12/2025 nos selecionados, Ctrl para seleção múltipla; Alt+R), OK"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual, Final de Espólio, Saída Definitiva (campos diferentes, ver F-BENS-DFE e F-BENS-DSDP)"
   },
   {
    "campo": "Campos (fluxo do Novo/Editar)",
    "texto": "Grupo; Código; Localização (País); Discriminação; Situação em 31/12/2024 (R$); Situação em 31/12/2025 (R$); campos condicionais por grupo/código (F-BENS-DADOS); pertence a Titular ou Dependente (nos códigos indicados); quadros \"Aplicação Financeira\" e \"Lucros e Dividendos\" para bens no exterior (nota 05)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Relacionar bens do titular e dependentes, no Brasil e no exterior, em 31/12/2024 e 31/12/2025.\n- Lei 14.754/2023: aplicações financeiras, controladas e trusts no exterior (nota 05).\n- Regime de transparência fiscal: opção para controladas adquiridas em 2025, irrevogável, declarada na Discriminação de cada bem da controlada; para opções anteriores, continuar declarando os bens como diretos.\n- Atividade rural com benfeitorias deduzidas como custeio: aqui só a terra nua; benfeitorias no Demonstrativo da Atividade Rural.\n- Com importação da declaração de 2025, Situação em 31/12/2024 vem preenchida; o contribuinte revisa e preenche 31/12/2025.\n- Visualização da lista mostra só a primeira linha da discriminação (FAQ pág. 406)."
   },
   {
    "campo": "Códigos",
    "texto": "grupos 01 a 08 e 99 (F-BENS-G01 a F-BENS-G99)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "evolução patrimonial do Resumo; base de obrigatoriedade (bens acima de R$ 800.000,00); custo para GCAP futuro"
   },
   {
    "campo": "Importações/exportações",
    "texto": "declaração 2025 (código, discriminação, localização, país e Situação 31/12/2024 se diferente de zero); pré-preenchida (bens, inclusive criptoativos e e-Financeira); lançamento de rendimentos associados a partir do bem (F-BENS-RENDASSOC)"
   }
  ]
 },
 {
  "id": "F-BENS-OBRIG",
  "nome": "Bens e direitos que devem ser declarados e dispensa",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 180 e 189"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- No Brasil ou no exterior: imóveis, veículos automotores, embarcações e aeronaves, qualquer valor; outros bens móveis e direitos com valor de aquisição unitário igual ou superior a R$ 5.000,00.\n- No Brasil: saldos de conta corrente, poupança e aplicações acima de R$ 140,00 em 31/12/2025; conjunto de ações, quotas ou quinhões de uma mesma empresa e ouro ativo financeiro com valor de aquisição igual ou superior a R$ 1.000,00; conjunto de criptoativos da mesma espécie igual ou superior a R$ 5.000,00.\n- No exterior: aplicações financeiras, ações/quotas e ouro ativo financeiro, criptoativos, independentemente do valor; bens de controladas em transparência fiscal; bens de trust não enquadrado como controlada; participações em controladas diretas sujeitas aos regimes anual ou de disponibilização; controladas indiretas sujeitas aos regimes.\n- Dispensa: saldos até R$ 140,00; bens móveis e direitos (exceto veículos, embarcações e aeronaves) abaixo de R$ 5.000,00; conjunto de ações/quotas/ouro abaixo de R$ 1.000,00."
   }
  ]
 },
 {
  "id": "F-BENS-DADOS",
  "nome": "Dados do bem: campos condicionais",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 181 a 184"
   },
   {
    "campo": "Campos e regras",
    "texto": "- Localização (País): os campos IPTU, CIB, CEI/CNO, Registrado no Cartório, Renavam, CNPJ, CPF, Agência e Conta só são habilitados com país 105 Brasil.\n- Discriminação: espécie, data e valor de aquisição e venda.\n- Situação em 31/12/2024: valor da DAA anterior. Situação em 31/12/2025: valor nessa data.\n- Grupo 01 (01, 02, 03, 11, 12, 13, 14, 15, 16, 17, 18, 19, 99): logradouro, número, complemento, bairro/distrito, UF, município, CEP, área total e unidade (m2 ou ha). Exceto 16 e 17: data de aquisição e, se registrado, matrícula e nome do cartório. Área: construída para 01, 02, 03, 12 e 16; privativa para 11, 15, 18 e 19; acréscimo de área para 17; terreno ou terra nua para 13 e 14; ordem de preferência da fonte: registro de imóveis, guia do IPTU, outro documento. IPTU para 01, 02, 03, 11, 12, 13, 15, 18, 19 e 99; CIB para 14; CEI/CNO para 16.\n- Grupo 02 (01, 02, 03): Renavam, Registro de Aeronave ou Registro de Embarcação; veículo no exterior: identificação no campo Registro de Veículo.\n- Titular ou dependente e CNPJ (Brasil): grupo 03 (01, 02, 03, 99); 04 (01, 02, 03, 04, 05, 99); 06 (01, 10, 11, 99); 07 (01, 02, 03, 04, 06, 07, 08, 10, 12, 13, 99); 99 (05, 06, 07, 08, 99).\n- Criptoativos grupo 08 (01, 02, 03, 10, 99): titular ou dependente; valor original de aquisição (nunca o valor atual); 02 exige Código Altcoin (tabela altcoins); 03 exige Código Stablecoin (tabela stablecoins).\n- CNPJ obrigatório: grupo 03 (01, 02, 03, 99); 04 (01, 02, 03, 99); 06 (01, 99); 07 (01, 02, 03, 04, 06, 07, 08, 10, 12, 13, 99); 08 (01, 02, 03 quando não autocustodiante, 10); 99 (05, 06, 07).\n- Grupo 04 código 01 e grupo 06 código 01 (Brasil): Banco (tabela `bancos-bens.json`), agência e conta.\n- Grupo 05 (01, 02, 99) no Brasil: CPF ou CNPJ do devedor.\n- Declaração Final de Espólio: não há campo titular/dependente.\n- \"Negociados em Bolsa?\" Sim exige Código de Negociação para: 03.01 Ações; 04.04 Ativos negociados em bolsa (BDRs, opções e outros); 07.02 Fiagro; 07.03 FII; 07.04 FIA e FMP-FGTS; 07.06 FIP, FIDC e ETF entidades de investimento; 07.07 FIP-IE e FIP-PD&I; 07.08 ETF de renda fixa; 07.10 Fundos de infraestrutura, FIDC e outros alíquota 0%; 07.12 FIEE; 07.13 Fundo multimercado; 07.99 Fundos no exterior."
   }
  ]
 },
 {
  "id": "F-BENS-RENDASSOC",
  "nome": "Rendimentos associados ao bem",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 184 (grupo 04, códigos 01, 02, 03) e nota 03 (vínculos de isentos 09, 12, 99 e exclusivos 06, 10)"
   },
   {
    "campo": "Campos",
    "texto": "botões que abrem lançamento na ficha Isentos (09 lucros a partir de 03.01; 12 poupança e títulos isentos a partir de 04.01 e 04.03; 99 FII/Fiagro a partir de 07.02 e 07.03) ou Exclusivos (06 aplicações a partir de 04.02 e grupo 07; 10 JCP a partir de 03.01); botão \"Visualizar Bem/Direito Associado\" nas fichas de rendimentos"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "totais de isentos e exclusivos"
   }
  ]
 },
 {
  "id": "F-BENS-G01",
  "nome": "Grupo 01, Bens imóveis",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Códigos",
    "texto": "01 Prédio residencial; 02 Prédio comercial; 03 Galpão; 11 Apartamento; 12 Casa; 13 Terreno; 14 Imóvel rural; 15 Sala ou conjunto; 16 Construção; 17 Benfeitorias até 1988; 18 Loja; 19 Garagem avulsa; 99 Outros bens imóveis"
   },
   {
    "campo": "Obrigatoriedade",
    "texto": "sempre"
   },
   {
    "campo": "Discriminação",
    "texto": "data e forma de aquisição, condôminos e usufruto"
   },
   {
    "campo": "Campos",
    "texto": "ver F-BENS-DADOS (endereço, área, unidade, cartório, matrícula, IPTU, CIB, CEI/CNO)"
   }
  ]
 },
 {
  "id": "F-BENS-G02",
  "nome": "Grupo 02, Bens móveis",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Códigos",
    "texto": "01 Veículo automotor terrestre; 02 Aeronave; 03 Embarcação; 04 Bem relacionado com atividade autônoma; 05 Quadro, objeto de arte, coleção, antiguidade; 06 Joia; 99 Outros bens móveis"
   },
   {
    "campo": "Obrigatoriedade",
    "texto": "01 a 03 sempre; demais se valor de aquisição igual ou superior a R$ 5.000,00"
   },
   {
    "campo": "Discriminação",
    "texto": "marca, modelo, ano de fabricação, placa (veículo), data e forma de aquisição; linha telefônica: número e local"
   },
   {
    "campo": "Campos",
    "texto": "Renavam, Registro de Aeronave, Registro de Embarcação, Registro de Veículo (exterior)"
   }
  ]
 },
 {
  "id": "F-BENS-G03",
  "nome": "Grupo 03, Participações societárias",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Códigos",
    "texto": "01 Ações (inclusive listadas em bolsa); 02 Quotas ou quinhões de capital; 03 Holding patrimonial (ações ou quotas por integralização de bens já declarados); 99 Outras participações"
   },
   {
    "campo": "Obrigatoriedade",
    "texto": "valor de aquisição igual ou superior a R$ 1.000,00 (exterior: sempre)"
   },
   {
    "campo": "Discriminação",
    "texto": "quantidade e tipo, nome da PJ; tipos diferentes em itens separados"
   },
   {
    "campo": "Campos",
    "texto": "CNPJ da emissora; Negociados em bolsa e código de negociação (01); titular/dependente"
   },
   {
    "campo": "Regras",
    "texto": "base dos lançamentos de lucros (isento 09) e JCP (exclusivo 10); controladas no exterior (nota 05)"
   }
  ]
 },
 {
  "id": "F-BENS-G04",
  "nome": "Grupo 04, Aplicações e investimentos",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Códigos",
    "texto": "01 Depósito em conta poupança; 02 Títulos públicos e privados tributáveis (Tesouro Direto, CDB, RDB e outros); 03 Títulos isentos (LCI, LCA, LCD, CRI, CRA, LIG, Debêntures de Infraestrutura e outros); 04 Ativos negociados em bolsa no Brasil (BDRs, opções e outros, exceto ações e fundos); 05 Ouro ativo financeiro; 99 Outras aplicações e investimentos"
   },
   {
    "campo": "Obrigatoriedade",
    "texto": "01 a 03 saldo maior que R$ 140,00; 04 e 05 valor de aquisição igual ou superior a R$ 1.000,00; 99 conforme natureza"
   },
   {
    "campo": "Discriminação",
    "texto": "instituição, conta, cotitular (nome e CPF) se conjunta; 04: quantidade e série de opções e vencimento; 05: instituição ou custodiante e gramas"
   },
   {
    "campo": "Campos",
    "texto": "banco, agência e conta (01); CNPJ da instituição/emissora; código de negociação (04); botões de rendimentos associados (01, 02, 03)"
   }
  ]
 },
 {
  "id": "F-BENS-G05",
  "nome": "Grupo 05, Créditos",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Códigos",
    "texto": "01 Empréstimos concedidos; 02 Crédito decorrente de alienação; 99 Outros créditos"
   },
   {
    "campo": "Obrigatoriedade",
    "texto": "valor igual ou superior a R$ 5.000,00"
   },
   {
    "campo": "Discriminação",
    "texto": "valor, prazo e condições, nome do devedor"
   },
   {
    "campo": "Campos",
    "texto": "CPF ou CNPJ do devedor"
   },
   {
    "campo": "Regras",
    "texto": "crédito de lucros a receber de controlada no exterior no regime anual vai em 05.99 (nota 05)"
   }
  ]
 },
 {
  "id": "F-BENS-G06",
  "nome": "Grupo 06, Depósitos à vista e numerário",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Códigos",
    "texto": "01 Depósito em conta corrente ou conta pagamento; 02 Conta gráfica em agente operador de apostas de quota fixa (Lei 14.790/2023, país sempre 105 Brasil); 10 Dinheiro em espécie, moeda nacional; 11 Dinheiro em espécie, moeda estrangeira; 99 Outros depósitos à vista"
   },
   {
    "campo": "Obrigatoriedade",
    "texto": "saldo maior que R$ 140,00 (02: R$ 5.000,00 conforme tabela)"
   },
   {
    "campo": "Campos",
    "texto": "banco, agência e conta (01); CNPJ da instituição ou do agente operador (02); tipo e quantidade de moeda (10, 11)"
   },
   {
    "campo": "Observações",
    "texto": "código 02 é novidade relacionada às apostas de quota fixa (não aparece na tabela resumida da pág. 361, só na tabela da pág. 192)"
   }
  ]
 },
 {
  "id": "F-BENS-G07",
  "nome": "Grupo 07, Fundos",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Códigos",
    "texto": "01 Fundos sujeitos a come-cotas (Lei 14.754/2023); 02 Fiagro; 03 FII; 04 FIA e FMP-FGTS; 06 FIP, FIDC e ETF entidades de investimento; 07 FIP-IE e FIP-PD&I; 08 ETF de renda fixa; 10 Fundos de infraestrutura, FIDC e outros alíquota 0%; 12 FIEE; 13 Fundo multimercado (art. 25 c/c art. 40 da Lei 14.754/2023); 99 Fundos no exterior"
   },
   {
    "campo": "Obrigatoriedade",
    "texto": "saldo maior que R$ 140,00"
   },
   {
    "campo": "Discriminação",
    "texto": "CNPJ do fundo, administradora, quantidade de quotas, cotitular"
   },
   {
    "campo": "Campos",
    "texto": "CNPJ obrigatório; negociado em bolsa e código de negociação; rendimentos associados (isento 99 para FII/Fiagro; exclusivo 06)"
   }
  ]
 },
 {
  "id": "F-BENS-G08",
  "nome": "Grupo 08, Criptoativos",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Códigos",
    "texto": "01 Bitcoin (BTC); 02 Altcoins (ETH, XRP, BCH, LTC etc., com Código Altcoin); 03 Stablecoins (USDT, USDC, BRZ, BUSD, DAI, TUSD, GUSD, PAX, PAXG etc., com Código Stablecoin); 10 NFTs; 99 Outros criptoativos"
   },
   {
    "campo": "Obrigatoriedade",
    "texto": "no Brasil, valor de aquisição igual ou superior a R$ 5.000,00 por espécie; no exterior, sempre"
   },
   {
    "campo": "Discriminação",
    "texto": "quantidade, custodiante e CNPJ ou modelo de carteira (autocustódia); tipos diferentes em itens separados"
   },
   {
    "campo": "Campos",
    "texto": "titular/dependente; indicador de autocustódia (03); CNPJ do custodiante; valor original de aquisição"
   },
   {
    "campo": "Regras",
    "texto": "ativo custodiado ou negociado por instituição no exterior é aplicação financeira no exterior (nota 05)"
   }
  ]
 },
 {
  "id": "F-BENS-G99",
  "nome": "Grupo 99, Outros bens e direitos",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Códigos",
    "texto": "01 Licença e concessão especiais; 02 Título de clube; 03 Direito de autor, inventor e patente; 04 Direito de lavra; 05 Consórcio não contemplado; 06 VGBL; 07 JCP creditado e não pago; 08 Leasing com opção de compra no fim do contrato; 99 Outros bens e direitos"
   },
   {
    "campo": "Obrigatoriedade",
    "texto": "01 a 04 valor igual ou superior a R$ 5.000,00; 06, 07, 08 sempre"
   },
   {
    "campo": "Discriminação",
    "texto": "05 administradora, tipo de bem, parcelas pagas e a pagar; 06 instituição, conta, apólice; 07 nome da PJ; 08 fim do contrato; 99 qualquer informação sem campo próprio, inclusive aviso de que bens comuns estão na declaração do cônjuge (com nome e CPF)"
   },
   {
    "campo": "Campos",
    "texto": "CNPJ da administradora (05), seguradora (06), PJ devedora (07); país (08)"
   }
  ]
 },
 {
  "id": "F-BENS-COMUNS",
  "nome": "Situações individuais: bens comuns, condomínio e tipos de declaração",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 194 e 195"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Titularidade conforme arts. 1.639 a 1.688 e 1.723 a 1.727 do Código Civil.\n- Comuns: comunhão total; adquiridos na constância da comunhão parcial; adquiridos na união estável (salvo contrato).\n- Condomínio: declarar a parte proporcional.\n- Conjunta: bens do casal e dependentes, inclusive com cláusula de incomunicabilidade ou inalienabilidade; bens do dependente na declaração de quem o deduz; mudança de dependência em 2025 por separação: na declaração de quem detém a guarda.\n- Separada: privativos na declaração do proprietário; comuns na totalidade na declaração de um cônjuge; o outro informa código 99 do grupo 99 com nome e CPF do cônjuge.\n- Espólio inicial e intermediárias: todos os bens do inventário; comuns pelo espólio se obrigado; se desobrigado, pelo cônjuge sobrevivente; bens dos dependentes também.\n- Excluir dependente exige excluir os bens dele (não é automático)."
   }
  ]
 },
 {
  "id": "F-BENS-DATAAQ",
  "nome": "Informações dos bens conforme a data de aquisição",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 196 e 197"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "- Até 31/12/1995: Situação 31/12/2024 e 31/12/2025 = valor da DAA 2025. Sem declaração: até 1991 e nunca obrigado, avaliar a mercado em 31/12/1991 em cruzeiros e dividir por 720,4779; até 1991 obrigado ou 1992 a 1995, usar a Tabela de Atualização do Custo de Bens e Direitos.\n- De 1996 a 2024: à vista, custo de aquisição em 2024 repetido em 2025; a prazo ou financiado com garantia (SFH, consórcio): 2024 = parcelas pagas de 1996 a 2024; 2025 = 2024 + parcelas de 2025.\n- Em 2025: à vista, 2024 vazio e 2025 = custo; a prazo, 2024 vazio e 2025 = parcelas pagas em 2025.\n- Guardar documentação de benfeitorias."
   }
  ]
 },
 {
  "id": "F-BENS-DFE",
  "nome": "Bens e Direitos na Declaração Final de Espólio",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 185 a 188 e 198 a 201"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Final de Espólio"
   },
   {
    "campo": "Campos",
    "texto": "Grupo; Código; \"Bem a inventariar\" (checkbox); Localização (País); Discriminação (parcela de cada beneficiário com nome e CPF); \"Bem com usufruto?\" (marcar só se sim; quadro de proprietários e usufrutuários, inferido pelo nome de tela PainelQuadroAuxiliarProprietariosUsufrutuariosLista); Situação na data da partilha (R$); Percentual % (botão que abre o quadro auxiliar \"percentual de participação do inventário\": CPF/CNPJ do beneficiário e percentual, com Novo, Editar, Excluir, OK); Valor de transferência (R$); campos condicionais como em F-BENS-DADOS (grupo 05 também com titular/dependente e CNPJ; sem campo titular/dependente na DFE); botão \"Repetir valores\""
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- \"Bem a inventariar\" só quando a ficha Espólio marca \"Ainda há bens a inventariar\"; desabilita Situação na data da partilha, % e Valor de transferência e habilita Situação em 31/12/2024 e 31/12/2025.\n- Situação na data da partilha: valor da última declaração do de cujus atualizado até 31/12/1995, ou custo se adquirido depois.\n- Transferência pelo valor da partilha ou de mercado; valor superior gera ganho de capital a 15% (inclusive espólios anteriores a 1998), apurado no GCAP 2025.\n- Herdeiros, meeiro e legatários incluem os bens pelo Valor de transferência.\n- Retificadora de DFE após o prazo não pode alterar valores de Bens e Direitos.\n- Bens da atividade rural deduzidos como despesa não entram; transmissão é receita rural do espólio no mês.\n- Tabela por data: aquisição até 1995 e de 1996 a 2024: partilha = valor da DAA 2025; transferência = valor + parcelas de 2025 (ou repetir se quitado); aquisição em 2025: partilha vazia, transferência = pago em 2025. Alienação até 2024: não informar; alienação em 2025: partilha = DAA 2025, transferência vazia, discriminação com adquirente, valor, data e condições; aquisição e alienação em 2025: ambos vazios.\n- Darf do ganho de capital pelo inventariante em nome do de cujus: 4600 (Brasil), 8523 (exterior), 8960 (moeda em espécie), até a data da DFE."
   }
  ]
 },
 {
  "id": "F-BENS-DSDP",
  "nome": "Bens e Direitos na Declaração de Saída Definitiva",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 202 e 203; repetido nas págs. 345 a 347"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Saída Definitiva"
   },
   {
    "campo": "Campos",
    "texto": "Código; Localização; Discriminação (espécie, data e valor de aquisição e venda); Situação em 31/12/2024 (R$); Situação na data da caracterização da condição de não residente (R$); botão \"Repetir valores\" (repete 31/12/2024 na data da não residência)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Situação em 31/12/2024 = DAA 2025; se adquiriu residência no ano, a situação nessa data.\n- Bens da atividade rural deduzidos como despesa não entram (Demonstrativo AR); após a não residência, prejuízo rural não é mais compensável.\n- Conjunta: bens do casal e dependentes; separada: privativos com o proprietário, comuns na totalidade em um dos cônjuges; quem opta pela tributação total dos rendimentos comuns relaciona os bens.\n- Desincorporados em 2025: discriminação com adquirente, data e valor; 31/12/2024 preenchido; data da não residência vazia.\n- Adquiridos e alienados em 2025: ambos vazios.\n- Exterior: discriminação com valor na moeda do país e origem dos recursos; valor convertido pela cotação de venda do Bacen na data da aquisição (o texto das págs. 346 e 347 diz convertido em dólar e depois em real).\n- Depósitos no exterior: saldo convertido pela cotação do dia anterior à não residência (pág. 203 diz fechamento de venda; pág. 347 diz compra: divergência do texto)."
   },
   {
    "campo": "Observações",
    "texto": "divergência compra x venda registrada para conferência"
   }
  ]
 },
 {
  "id": "F-BENS-ALIEN-DFE",
  "nome": "Bens e direitos alienados no ano (Final de Espólio)",
  "fonte": "docs/mapeamento/notas/04-pagamentos-doacoes-bens.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 199"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (bem, nome e CPF/CNPJ do adquirente, data e valor)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "não preencher Situação na data da partilha nem Valor de transferência (em conflito com a tabela por data da pág. 200, que manda preencher a partilha com o valor da DAA 2025 para alienação em 2025; dúvida)"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-BENFEITORIAS",
  "nome": "Benfeitorias",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha Bens e Direitos, casos especiais (pág. 206)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual (e demais tipos, por analogia)"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação; Endereço; Área Total do Imóvel; Unidade (m2 ou ha); Registrado no Cartório de Registro de Imóveis? (Sim/Não); Matrícula do Imóvel; Nome Cartório; Situação em 31/12/2024; Situação em 31/12/2025"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Imóvel adquirido após 1988: benfeitoria somada ao valor do próprio imóvel (mesmo item). Situação 31/12/2024 = valor da declaração 2025; Situação 31/12/2025 = valor anterior + benfeitorias pagas em 2025.\n- Imóvel adquirido até 1988: item próprio com código 17 (Benfeitorias) do grupo 01; Situação 31/12/2024 em branco; Situação 31/12/2025 = total dos pagamentos efetuados."
   },
   {
    "campo": "Códigos",
    "texto": "grupo 01 Bens Imóveis, código 17 Benfeitorias"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "custo de aquisição do imóvel (base para GCAP futuro); totais de evolução patrimonial do Resumo"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma específica"
   },
   {
    "campo": "Observações",
    "texto": "corte em 1988 é a regra do texto"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-CONSORCIO",
  "nome": "Consórcios",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos, casos especiais (pág. 207)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "CNPJ (administradora); Discriminação (nome e CNPJ da administradora, tipo de bem, parcelas pagas e a pagar); Situação 31/12/2024; Situação 31/12/2025"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Não contemplado em 2025: código 05 grupo 99. Sit. 2024 = valor da declaração anterior; Sit. 2025 = valor anterior + parcelas pagas em 2025. Se adquirido em 2025: Sit. 2024 vazia, Sit. 2025 = parcelas pagas em 2025.\n- Contemplado em 2025: item 99/05 com Sit. 2024 = valor anterior e Sit. 2025 vazia (se adquirido em 2025, ambas vazias); e novo item com o código do bem recebido, Sit. 2024 vazia, Sit. 2025 = valor declarado + parcelas pagas em 2025."
   },
   {
    "campo": "Códigos",
    "texto": "grupo 99, código 05 Consórcio não contemplado"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "evolução patrimonial"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "dívidas de bens adquiridos por consórcio não são informadas em Dívidas (ver F-DIV)"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-LEASING",
  "nome": "Leasing",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos, casos especiais (págs. 208 e 209)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "código do bem; Discriminação (dados do bem e contratante); CNPJ do contratante (campo específico no caso 99/08); Situação 31/12/2024; Situação 31/12/2025"
   },
   {
    "campo": "Validações conhecidas (4 cenários)",
    "texto": "1. Opção de compra exercida no fim do contrato em 2025: código do bem; Sit. 2024 = valores pagos até 2024 (vazia se contratado em 2025); Sit. 2025 = Sit. 2024 + pagos em 2025 inclusive valor residual.\n2. Contratado em 2025 com opção a ser exercida no fim do contrato: código 08 grupo 99 (Leasing com opção de compra a ser exercida no final do contrato); CNPJ do contratante obrigatório; Discriminação com total pago; Sit. 2024 e Sit. 2025 em branco.\n3. Antes de 2025 com opção exercida no ato: código do bem; Sit. 2024 e 2025 = valor do bem; ficha Dívidas com saldos remanescentes em cada data.\n4. Em 2025 com opção exercida no ato: código do bem; Sit. 2024 vazia; Sit. 2025 = valor do bem; ficha Dívidas com saldo em 31/12/2025.\n- Alienação fiduciária: Sit. 2025 = total pago; NÃO incluir dívida na ficha Dívidas e Ônus Reais."
   },
   {
    "campo": "Códigos",
    "texto": "grupo 99 código 08"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "evolução patrimonial; ligação Bens x Dívidas"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-VGBL",
  "nome": "VGBL",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (pág. 210)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "CNPJ e Discriminação (seguradora); Situação 31/12/2024 (valores pagos até 31/12/2024); Situação 31/12/2025 (Sit. 2024 + pagos em 2025)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "usar código 06 do grupo 99 para seguro de vida com cobertura por sobrevivência"
   },
   {
    "campo": "Códigos",
    "texto": "grupo 99 código 06 VGBL"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "evolução patrimonial; não é dedução (inferido, pois PGBL é que deduz na ficha Pagamentos)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "possível origem na pré-preenchida (inferido)"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-PERMUTA",
  "nome": "Permuta",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (págs. 211 e 212)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (dados do imóvel e da contraparte); campos específicos do imóvel; Situação 31/12/2024; Situação 31/12/2025"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Sem torna: imóvel dado: Sit. 2024 = valor anterior, Sit. 2025 vazia. Imóvel recebido: Sit. 2024 vazia, Sit. 2025 = Sit. 2024 do imóvel dado.\n- Com torna paga: imóvel recebido Sit. 2025 = Sit. 2024 do bem dado + torna paga.\n- Com torna recebida: imóvel recebido Sit. 2025 = Sit. 2024 do bem dado MENOS o custo usado na apuração do ganho de capital relativo à torna (GCAP 2025)."
   },
   {
    "campo": "Códigos",
    "texto": "códigos de imóveis do grupo 01"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "custo do novo imóvel; ganho de capital na torna recebida (GCAP)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "depende do GCAP 2025 (custo proporcional da torna)"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-IMOVEL-RURAL",
  "nome": "Imóvel rural",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (pág. 213)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (VTN apurado no Diat da DITR exercício 2025, dados do imóvel e do alienante); campos específicos (inclui NIRF/CIB, inferido, ver notas 04); Sit. 2024; Sit. 2025"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "código 14 grupo 01. Sit. 2024 = valor da declaração anterior (vazia se adquirido em 2025). Sit. 2025 = valor declarado (terra nua) + parcelas pagas em 2025; se adquirido em 2025, valor pago pela terra nua.\n- Contribuinte sem atividade rural: benfeitorias podem integrar o custo do imóvel.\n- Contribuinte com atividade rural que deduziu benfeitorias como custeio: informar só a terra nua aqui e relacionar bens e benfeitorias no Demonstrativo da Atividade Rural."
   },
   {
    "campo": "Códigos",
    "texto": "grupo 01 código 14 Imóvel Rural"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "interação com Atividade Rural (evita dupla contagem)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "Atividade Rural (bens da atividade rural)"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-DOACAO",
  "nome": "Doação recebida",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (pág. 214)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "código do bem recebido; Discriminação (espécie, nome e CPF do doador); Sit. 2024 vazia; Sit. 2025 = saldo em 31/12/2025 (doação em espécie) ou valor do bem"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "Sit. 2024 não preenchida"
   },
   {
    "campo": "Códigos",
    "texto": "código conforme o bem"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "o valor da doação recebida vai em Rendimentos Isentos (código 14 Transferências patrimoniais - doações e heranças, inferido do código); o doador informa em Doações Efetuadas (doação em espécie, com CPF do beneficiário)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "transferência entre fichas Bens x Isentos"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-HERANCA",
  "nome": "Herança, meação, legado ou doação (inclusive adiantamento da legítima)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (pág. 215)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (dados do bem e forma de aquisição); Sit. 2024 vazia; Sit. 2025 = valor da última declaração do falecido ou doador, ou opcionalmente valor superior"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "transferência por valor superior ao declarado está sujeita a ganho de capital (GCAP 2025)"
   },
   {
    "campo": "Códigos",
    "texto": "conforme o bem"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "Isentos (transferências patrimoniais); ganho de capital do transmitente"
   },
   {
    "campo": "Importações/exportações",
    "texto": "GCAP"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-DISSOLUCAO",
  "nome": "Bens recebidos por dissolução da sociedade conjugal ou união estável",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (pág. 216)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (dados e forma de aquisição); Sit. 2024 vazia; Sit. 2025 = valor da última declaração de quem informava o bem, ou valor de transferência se superior"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "valor superior ao declarado sujeita a ganho de capital (GCAP 2025)"
   },
   {
    "campo": "Códigos",
    "texto": "conforme o bem; isento código 19 (meação e dissolução, inferido)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "Isentos; GCAP"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-EXTERIOR",
  "nome": "Bens e direitos situados no exterior",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (pág. 217)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (bem, valor de aquisição na moeda do país, origem dos recursos: reais, moeda estrangeira ou ambas); País (inferido de campo específico); Sit. 2024; Sit. 2025"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Sit. 2024 = valor anterior (vazia se adquirido em 2025).\n- Sit. 2025 = Sit. 2024 + parcelas pagas em 2025. Adquirido em 2025: com reais, valor pago em reais; com moeda estrangeira, valor convertido pela cotação de fechamento de venda do Bacen; origem mista, custo proporcional à origem."
   },
   {
    "campo": "Códigos",
    "texto": "qualquer, com país diferente de Brasil"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "ganho de capital em moeda estrangeira (GCAP)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "GCAP (bens no exterior)"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-TRANSPARENCIA",
  "nome": "Regime de Transparência Fiscal de Entidade Controlada (art. 8º da Lei 14.754/2023)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (págs. 217, 218, 230, 231)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos",
    "texto": "um item por bem ou direito detido pela controlada; Discriminação com dados da controlada (localização, razão social) e declaração expressa do exercício da opção"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Opção possível para controladas adquiridas em 2025, por indicação expressa na Discriminação; irrevogável e irretratável.\n- Controladas já detidas em 31/12/2024 com opção exercida: manter a indicação e continuar declarando os bens como se fossem da pessoa física.\n- Valor de cada bem: alocação do custo de aquisição da entidade na proporção do valor de cada bem sobre o ativo total em 31/12/2025 (art. 37 IN RFB 2.180/2024).\n- Trust (ou contrato similar sob lei estrangeira não enquadrado como controlada): bens declarados diretamente pelo titular (ele ou dependente), com indicação na Discriminação (art. 11 da Lei 14.754/2023), independentemente da data de aquisição.\n- Obrigações subjacentes da controlada ou do trust: ficha Dívidas, código 16, valor 0 (ver F-DIV)."
   },
   {
    "campo": "Códigos",
    "texto": "códigos dos bens subjacentes; dívida 16"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "tributação passa a ser como bens diretos (aplicações financeiras 15%)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "base legal arts. 36 a 39 (e 36 a 49 citado em outro trecho) da IN RFB 2.180/2024"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-DEP-NAO-REMUNERADO",
  "nome": "Depósitos não remunerados em moeda estrangeira (conta, cartão de débito ou crédito no exterior)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos, item 1 (pág. 219)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (valor em moeda estrangeira, banco, número da conta); Sit. 2024 (saldo em reais da declaração anterior); Sit. 2025 (saldo em 31/12/2025 convertido pela cotação de fechamento de venda do Bacen)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "grupo 06 código 01 (conta corrente ou conta pagamento no exterior) ou código 99 (cartão de débito ou crédito)"
   },
   {
    "campo": "Códigos",
    "texto": "grupo 06 códigos 01 e 99"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "variação cambial isenta se não remunerado e em instituição autorizada; acréscimo patrimonial por variação cambial vai em Isentos código 99 Outros. Se não cumprir requisitos, variação cambial tributada como ganho de capital (art. 21 Lei 8.981/1995)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-MOEDA-ESPECIE",
  "nome": "Moeda estrangeira mantida em espécie",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos, item 2 (pág. 220)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "um item por moeda; Discriminação (quantidade em 31/12/2025); Sit. 2024 (valor em reais da declaração anterior); Sit. 2025 (custo médio ponderado: Sit. 2024 + aquisições em reais - alienações em reais)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "custo da moeda adquirida em reais = valor pago; adquirida em moeda estrangeira = quantidade x cotação de fechamento de venda do Bacen na data"
   },
   {
    "campo": "Códigos",
    "texto": "grupo 06 código 11 Dinheiro em espécie - moeda estrangeira; isento código 08 (alienações até US$ 5.000,00 no ano)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "ganho isento até alienações de US$ 5.000,00 no ano (Isentos 08); acima disso, ganho integralmente tributado no GCAP (moeda estrangeira em espécie); imposto não compensável na DAA, Darf emitido pelo GCAP"
   },
   {
    "campo": "Importações/exportações",
    "texto": "GCAP"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-EMPRESTIMO",
  "nome": "Empréstimo concedido",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos, item 3 (pág. 220)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (nome e CPF do mutuário, valor recebido em 2025 se houver); Sit. 2024; Sit. 2025 (saldos)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "CPF do mutuário"
   },
   {
    "campo": "Códigos",
    "texto": "grupo 05 Créditos (código específico, ver notas 04, inferido)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "evolução patrimonial; empréstimo a devedor no exterior é aplicação financeira no exterior"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-APLIC-EXTERIOR",
  "nome": "Aplicações financeiras no exterior (Lei 14.754/2023)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos, item 4 (págs. 221 e 222)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos",
    "texto": "um item por aplicação; Discriminação (valor em moeda estrangeira em 31/12/2025); Sit. 2024; Sit. 2025 (valor em reais ajustado a cada aplicação, liquidação ou resgate); quadro \"Aplicação Financeira (R$)\": Rendimento ou Perda; Imposto pago no Exterior"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Abrange depósitos remunerados, certificados de depósito, ativos virtuais e carteiras com rendimento, cotas de fundos (exceto os tratados como controladas), instrumentos financeiros, apólices resgatáveis, capitalização, fundos de pensão, títulos de renda fixa e variável, ouro ativo financeiro, mútuo com devedor no exterior, derivativos e participações não controladas.\n- Ativo virtual é considerado no exterior quando custodiado ou negociado por instituição no exterior, independentemente do emissor.\n- Entidades no exterior não controladas: grupo 04 código 99 (Outras aplicações e investimentos).\n- Rendimento ou Perda: só o valor tributável no ano (juros, remuneração recebida, ganhos inclusive variação cambial sobre o principal no resgate, amortização, alienação, vencimento ou liquidação), inclusive dividendos de participações não controladas. Não incluir lucro de controlada sujeita à Lei 14.754 (vai em \"Lucros e Dividendos\"). Não incluir prejuízos de controladas não sujeitas aos regimes.\n- Imposto pago no exterior: dedutível só com acordo para evitar dupla tributação ou reciprocidade; convertido pela cotação de fechamento de COMPRA do Bacen na data do pagamento; não dedutível se reembolsável; não pode ser usado de uma aplicação para outra nem contra lucro de controlada; não aproveitado no ano se perde (não vai para anos anteriores ou posteriores).\n- Conversão de valores das aplicações: cotação de fechamento de VENDA do Bacen na data de cada evento."
   },
   {
    "campo": "Códigos",
    "texto": "grupo 04 código 99 e demais códigos de aplicações"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "tributação separada na DAA à alíquota de 15% sobre a parcela anual, sem deduções; perdas compensam rendimentos de aplicações no mesmo período e o excedente compensa lucros e dividendos de controladas computados no mesmo período; dedução do imposto pago no exterior limitada à diferença entre IRPF com e sem o rendimento (teto do imposto brasileiro sobre aquele rendimento)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma específica (possível relação com a ficha de tributação exclusiva código 12, ver notas 03)"
   },
   {
    "campo": "Observações",
    "texto": "base IN RFB 2.180/2024"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-CONTROLADAS",
  "nome": "Participação em entidades controladas no exterior",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos, itens 5, 5.1, 5.1.1, 5.1.2, 5.2 (págs. 223 a 230)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos",
    "texto": "um item por controlada direta e por controlada indireta sujeita aos regimes; Discriminação com: percentual de participação e se é direta ou indireta; se indireta via controlada direta em transparência fiscal ou via trust; percentual de renda ativa (quando não localizada em país de tributação favorecida nem em regime privilegiado); data de aquisição; lucros ou prejuízos acumulados até 31/12/2023; lucros distribuídos no ano e se correspondem a lucros até 31/12/2023; lucros recebidos de outras controladas (razão social e localização); prejuízo do ano; saldos de \"resultados abrangentes\" (o texto cita 31/12/2024 em 5.1 e 31/12/2025 em 5.2); Sit. 2024; Sit. 2025 (ajustada por reduções de participação); quadro \"Lucros e Dividendos (R$)\": Valor Recebido; Imposto Pago Exterior/IRRF Brasil"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Controlada: preponderância nas deliberações ou poder de eleger maioria dos administradores; ou mais de 50% do capital, lucros ou ativos na liquidação, isoladamente ou com pessoas vinculadas (cônjuge, companheiro, parentes até 3º grau; PJ com diretor nessas condições; PJ com mais de 10% do capital votante do contribuinte; sócios dessas PJ).\n- Apólices de seguro resgatáveis em que o investidor influencia a estratégia são controladas.\n- Cada classe de cotas com patrimônio segregado é entidade separada.\n- Controladas indiretas sujeitas aos regimes: item próprio, independentemente da controladora.\n- Regime Anual (arts. 17 a 32 IN 2.180): obrigatório se em país de tributação favorecida ou regime privilegiado (arts. 24 e 24-A Lei 9.430/1996) ou renda ativa própria menor que 60% da renda total (renda passiva: royalties, juros, dividendos, participações, aluguéis, ganhos de capital salvo participações ou ativos permanentes com mais de 2 anos, aplicações e intermediação financeira).\n- Regime na Disponibilização (arts. 33 e 34): demais; lucro disponibilizado no pagamento, crédito, entrega, emprego ou remessa, o que ocorrer primeiro, ou em operação de crédito com a pessoa física ou vinculada se houver lucros ou reservas.\n- Prejuízo da controlada: só na Discriminação, compensável apenas com lucros da mesma controlada e só se referente a anos iniciados a partir de 01/01/2025.\n- Conversão: cotação de fechamento de venda do Bacen na data do fato gerador."
   },
   {
    "campo": "Códigos",
    "texto": "participações (grupo 03, inferido); créditos grupo 05 código 99 (lucros a receber)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "- Regime Anual: 15% sobre a parcela anual do lucro apurado em balanço de 31/12/2025, na proporção da participação, independentemente de distribuição. Exclusões: lucros de investidas PJ no Brasil; rendimentos e ganhos no Brasil tributados por IRRF com alíquota igual ou superior a 15%; participação em outras controladas também no regime anual. Lucro apurado vai em \"Valor Recebido\" e também em item grupo 05 código 99 como crédito de lucros a receber (indicar controlada e ano de origem). Na distribuição posterior, reduz-se o crédito pelo valor original em reais; variação cambial entre o lucro tributado e o disponibilizado não é tributada nem dedutível e vai em Isentos código 99. Distribuição entre controladas do regime anual: transferir o crédito de uma para outra. Devoluções de capital entre controladas: realocar custo; variação cambial tributada na disponibilização.\n- Regime na Disponibilização: 15% sobre o dividendo efetivamente pago em 2025 (Valor Recebido); Discriminação com valor e ano de origem; Sit. 2025 = capital aplicado.\n- Imposto Pago Exterior/IRRF Brasil: imposto estrangeiro dedutível (art. 30 IN 2.180) e IRRF pago no Brasil sobre rendimentos da controlada incluídos no lucro tributado (art. 31).\n- Variação cambial do principal compõe ganho de capital na alienação, baixa, liquidação ou devolução de capital (GCAP 2025)."
   },
   {
    "campo": "Importações/exportações",
    "texto": "GCAP (alienação da participação)"
   },
   {
    "campo": "Observações",
    "texto": "o texto tem pequenas inconsistências de data (31/12/2024 x 31/12/2025 em \"resultados abrangentes\")"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-DESINCORPORADOS",
  "nome": "Bens e direitos desincorporados do patrimônio em 2025",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (pág. 232)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (dados do bem; se alienação, nome e CPF/CNPJ do adquirente, data e valor); Sit. 2024 = valor anterior; Sit. 2025 vazia"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "Sit. 2025 não preenchida"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "alienação pode gerar rendimento tributável (GCAP ou Renda Variável)"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-ADQ-ALIENADOS",
  "nome": "Bens e direitos adquiridos e alienados em 2025",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (pág. 233)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (valor, nomes e CPF/CNPJ de alienantes e adquirentes, datas e valores de aquisição e alienação, condições de financiamento); Sit. 2024 e Sit. 2025 vazias"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "ambas as situações em branco"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "GCAP, Renda Variável, FII ou Fiagro"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-BENS-ESP-NOVO-RESIDENTE",
  "nome": "Bens de quem adquiriu ou readquiriu residência no Brasil em 2025",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Bens e Direitos (págs. 234 e 235)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (dados, forma de aquisição, custo em moeda estrangeira e origem dos recursos para bens no exterior); Sit. 2024; Sit. 2025"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Declarar todo o patrimônio (Brasil e exterior, inclusive depósitos no exterior e moeda em espécie) do titular e dependentes na data da caracterização da residência.\n- Sit. 2024: bem anterior à saída do Brasil = valor da Declaração de Saída Definitiva ou da última declaração, ou custo de aquisição se não obrigado; bem no exterior adquirido como não residente = valor convertido pela cotação de venda do Bacen da data (até 31/12/1999) ou pela cotação de fechamento de venda (a partir de 01/01/2000); bem no Brasil adquirido como não residente = custo de aquisição.\n- Sit. 2025 = Sit. 2024 + valores pagos em 2025 a partir da residência.\n- Moeda sem cotação no Brasil: converter para US$ pela cotação da autoridade monetária do país e depois para reais pelo dólar de venda do Bacen.\n- Bens adquiridos até 31/12/1995 podem ser atualizados pela tabela do Anexo I da IN SRF 208/2002.\n- Sem comprovação, custo de aquisição igual a zero."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "custo de aquisição para GCAP futuro"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "dívidas do novo residente vão na Sit. 2024 da ficha Dívidas (ver F-DIV)\n---"
   }
  ]
 },
 {
  "id": "F-DIV",
  "nome": "Dívidas e Ônus Reais",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha Dívidas e Ônus Reais (págs. 236 e 237)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual, Final de Espólio, Saída Definitiva"
   },
   {
    "campo": "Campos",
    "texto": "Código (lista, tabela tipoDividas); Discriminação (natureza da dívida, nome e CPF ou CNPJ do credor); Situação em 31/12/2024 (R$); Situação em 31/12/2025 (R$); Valor Pago em 2025 (R$). Botões Novo, OK, Editar, Excluir (exclusão apaga todos os campos da linha)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Informar dívidas do titular e dependentes; em declaração conjunta ou com bens comuns, também as do cônjuge ou companheiro.\n- Ao excluir dependente, excluir também suas dívidas.\n- Não incluir: dívidas de valor igual ou inferior a R$ 5.000,00 em 31/12/2025; financiamentos do SFH ou com bem dado em garantia (alienação fiduciária, hipoteca, penhor), conforme o texto; bens adquiridos por consórcio; dívidas da atividade rural (vão no Demonstrativo AR).\n- Transparência fiscal ou trust: obrigações subjacentes com código 16 Outras dívidas e ônus reais, valor 0, com indicação na Discriminação.\n- Novo residente em 2025: dívidas na data da residência na Sit. 31/12/2024.\n- Final de Espólio: período de 01/01 até a decisão judicial da partilha, sobrepartilha, adjudicação ou escritura (com bens ainda a inventariar que gerem rendimentos, todo o ano). Saída Definitiva: de 01/01 até a véspera da condição de não residente. Campos alternativos \"Situação na data da partilha\" e \"Situação na data da caracterização de não residente\" (ver Resumo)."
   },
   {
    "campo": "Códigos",
    "texto": "tabela de dívidas (tipoDividas.xml), código 16 Outras dívidas e ônus reais"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "evolução patrimonial do Resumo (Dívidas em 31/12/2024 e 31/12/2025, na partilha, na não residência)"
   },
   {
    "campo": "Importações/exportações",
    "texto": "pré-preenchida e declaração anterior (inferido)"
   },
   {
    "campo": "Observações",
    "texto": "o texto da ajuda coloca SFH e alienação fiduciária na lista de \"não inclua\"; conferir com o Perguntas e Respostas (dúvida)\n---"
   }
  ]
 },
 {
  "id": "F-ESPOLIO",
  "nome": "Espólio (Ajuste Anual com natureza de ocupação 81)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha Espólio, habilitada ao selecionar Natureza da ocupação 81 - Espólio na Identificação (pág. 238)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual de espólio (inicial e intermediárias)"
   },
   {
    "campo": "Campos",
    "texto": "\"Trata-se de uma Sobrepartilha?\" (Sim/Não); Identificação do Inventariante da Partilha (se Não) ou da Sobrepartilha (se Sim): CPF (11 algarismos), Nome completo"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "Sim somente se já houver Declaração Final de Espólio de Partilha apresentada; CPF do inventariante ou do interessado com poderes de inventariante (inventário por escritura pública, arts. 610 e 611 da Lei 13.105/2015 CPC)"
   },
   {
    "campo": "Códigos",
    "texto": "natureza de ocupação 81"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "nenhuma direta"
   },
   {
    "campo": "Observações",
    "texto": "Declaração Final de Espólio tratada nas notas 06"
   }
  ]
 },
 {
  "id": "F-PARTIDOS",
  "nome": "Doações a Partidos Políticos e Candidatos a Cargos Eletivos",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ficha própria (págs. 239 e 240)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual, Final de Espólio, Saída Definitiva (período conforme o tipo)"
   },
   {
    "campo": "Campos",
    "texto": "CNPJ; Nome do candidato ou partido; Valor. Botões Novo, OK, Editar, Excluir"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "relacionar todas as doações e gastos eleitorais de 2025; CNPJ válido"
   },
   {
    "campo": "Códigos",
    "texto": "nenhum"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "NÃO dedutível; total transportado para Resumo, Outras Informações"
   },
   {
    "campo": "Importações/exportações",
    "texto": "nenhuma"
   },
   {
    "campo": "Observações",
    "texto": "lista de gastos eleitorais da Lei 9.504/1997 (impressos com adesivo até 50 x 40 cm, propaganda, aluguel de locais, transporte, correspondência, comitês, remuneração de pessoal, carros de som, comícios, programas de rádio e TV, pesquisas, sites e impulsionamento com provedor sediado no País)\n---"
   }
  ]
 },
 {
  "id": "F-RESUMO-TRIB",
  "nome": "Resumo, Rendimentos Tributáveis (modelo completo)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Resumo da Declaração > Rendimentos Tributáveis e Deduções (pág. 242)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (períodos conforme tipo)"
   },
   {
    "campo": "Campos (somente leitura, calculados)",
    "texto": "1. Recebidos de PJ pelo titular = total da ficha Rend. Trib. PJ Titular\n2. Recebidos de PJ pelos dependentes = total da ficha Rend. Trib. PJ Dependentes\n3. Recebidos de PF/Exterior pelo titular = total da ficha PF/Exterior Titular\n4. Recebidos de PF/Exterior pelos dependentes = total da ficha PF/Exterior Dependentes\n5. Recebidos acumuladamente pelo titular = total tributável da ficha RRA Titular, se opção \"Ajuste Anual\"\n6. Recebidos acumuladamente pelos dependentes = idem dependentes\n7. Resultado tributável da Atividade Rural = resultado tributável positivo (Brasil + Exterior) do Demonstrativo AR\n8. Total = soma das linhas 1 a 7"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "base de cálculo"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-RESUMO-DED",
  "nome": "Resumo, Deduções (modelo completo)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Resumo > Rendimentos Tributáveis e Deduções (págs. 243 e 244)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual com deduções legais (e espólio e saída, quando cabíveis)"
   },
   {
    "campo": "Campos (calculados)",
    "texto": "1. Contribuições à previdência oficial e complementar fechada do § 15 art. 40 CF (até o limite do patrocinador) = previdência oficial das fichas PJ titular e dependentes + previdência complementar § 15 art. 40 CF (Pagamentos, código 37, até a contribuição do patrocinador) + previdência oficial das fichas PF/Exterior titular e dependentes + previdência oficial da linha 11 de Isentos (moléstia grave e acidente em serviço). Autônomo que pagou INSS informa na ficha PF/Exterior.\n2. Contribuição à previdência oficial (RRA) = soma das fichas RRA titular e dependentes, se opção Ajuste\n3. Contribuição à previdência complementar, inclusive o excedente do § 15 art. 40 CF, e Fapi = códigos 36 e 37 de Pagamentos (no 37 só o que exceder o patrocinador), limitado a 12% do total dos rendimentos tributáveis\n4. Dependentes = quantidade de dependentes x R$ 2.275,08\n5. Despesas com instrução = (pago - reembolsado/não dedutível) limitado a R$ 3.561,50 para o titular, para cada dependente e para cada alimentando\n6. Despesas médicas = total pago - não dedutível dos códigos 09, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 e 26 de Pagamentos (sem limite)\n7. Pensão alimentícia judicial = códigos 30 (residente) e 31 (não residente) de Pagamentos\n8. Pensão alimentícia por escritura pública (art. 733 CPC) = códigos 33 (residente) e 34 (não residente)\n9. Pensão alimentícia judicial (RRA) = soma das fichas RRA, se opção Ajuste\n10. Livro caixa = total da coluna Livro Caixa das fichas PF/Exterior titular e dependentes\n11. Total = soma de 1 a 10"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "limites de 12%, R$ 2.275,08 por dependente, R$ 3.561,50 por pessoa em instrução"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "base de cálculo = total tributável - total de deduções"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-RESUMO-CALC",
  "nome": "Resumo, Cálculo do Imposto (deduções legais)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Resumo > Cálculo do Imposto (págs. 245 a 252)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos; Saída Definitiva usa tabela proporcional"
   },
   {
    "campo": "Campos e fórmulas",
    "texto": "- Base de cálculo = Total de rendimentos tributáveis - Total de deduções\n- Imposto devido = se base <= R$ 28.467,20, zero (linha em branco); senão base x alíquota / 100 - parcela a deduzir (Tabela Progressiva Anual). Faixas (usadas também no simplificado): até 28.467,20 isento; 28.467,21 a 33.919,80: 7,5%, deduz 2.135,04; 33.919,81 a 45.012,60: 15%, deduz 4.679,03; 45.012,61 a 55.976,16: 22,5%, deduz 8.054,97; acima de 55.976,16: 27,5%, deduz 10.853,78\n- Saída Definitiva: soma das tabelas mensais dos meses de janeiro até o mês da condição de não residente (ou do mês de aquisição da residência até o retorno à não residência, se no mesmo ano)\n- Dedução de incentivo = soma das doações e patrocínios dos códigos 40, 41, 42, 43, 44, 45 e 46 de Doações Efetuadas, respeitados os limites legais sobre o imposto devido\n- Imposto devido I = Imposto devido - Dedução de incentivo\n- Imposto devido RRA = calculado conforme art. 12-A da Lei 7.713/1988\n- Alíquota efetiva (%) = imposto devido / total de rendimentos tributáveis x 100\n- Total do imposto devido = Imposto devido I + Imposto devido RRA\n- Imposto pago:\n- IRRF do titular = IRRF da ficha PJ titular + IRRF RRA titular (opção Ajuste) + campos IRRF e IRRF sobre 13º do quadro auxiliar da linha 11 de Isentos\n- IRRF dos dependentes = análogo para dependentes\n- Carnê-Leão do titular = total da ficha PF/Exterior titular (Darf 0190)\n- Carnê-Leão dos dependentes = análogo\n- Imposto complementar = ficha Imposto Pago/Retido\n- Imposto pago no exterior = ficha Imposto Pago/Retido (titular e dependentes)\n- IRRF Lei 11.033/2004 = campo 03 da ficha Imposto Pago/Retido\n- Imposto retido RRA = IRRF das fichas RRA se opção \"Exclusiva na Fonte\"\n- Total de imposto pago = soma das 8 linhas acima\n- Imposto a restituir = Total pago - Total devido, se positivo\n- Imposto a pagar = Total devido - Total pago, se positivo"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "ver F-RESUMO-QUOTAS e F-RESUMO-BANCO"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-RESUMO-QUOTAS",
  "nome": "Resumo, Imposto a pagar: formas de pagamento, quotas e débito automático",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Resumo > Cálculo do Imposto, Parcelamento (págs. 247 a 251, repetido 256 a 260)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual (Espólio Final e Saída: quota única)"
   },
   {
    "campo": "Campos",
    "texto": "Número de Quotas (até 8); Valor da Quota (calculado); Débito Automático (Sim/Não); dados bancários"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Formas de pagamento: transferência eletrônica em banco autorizado; Darf em agência da rede arrecadadora; débito automático. Assalariado de repartição do governo no exterior: também ordem de pagamento via Banco do Brasil, Gecex Brasília, prefixo 1608-X.\n- Até 8 quotas mensais e sucessivas, cada quota não inferior a R$ 50,00; imposto inferior a R$ 100,00 em quota única; saldo inferior a R$ 10,00 não é recolhido e acumula para exercícios seguintes.\n- 1ª quota ou quota única até 29/05/2026; 2ª quota até 30/06/2026 com juros de 1%; 3ª a 8ª: Selic acumulada de junho/2026 até o mês anterior ao pagamento + 1% no mês do pagamento.\n- Débito automático: declaração entregue até 10/05/2026 permite a partir da quota única ou 1ª quota; de 11/05/2026 a 29/05/2026, a partir da 2ª quota (1ª paga por Darf). Somente para original ou retificadora dentro do prazo (até 29/05/2026). Cancelado se retificadora após 29/05/2026, dados bancários inexatos, CPF diferente do vinculado à conta, ou conta do tipo não solidária. Pode ser estornado (dolo, fraude, simulação) e incluído, cancelado ou alterado no e-CAC (Meu Imposto de Renda), até 23h59min59s do dia 14 para efeito no mês, depois no mês seguinte.\n- Facultado antecipar quotas sem retificar e ampliar o número de quotas até 8 via retificadora ou e-CAC.\n- Saída Definitiva: quota única até a data de entrega, sem débito automático; vale também para o imposto do ano anterior e outros débitos.\n- Exemplo do texto: saldo R$ 1.965,76 em 8 quotas = R$ 245,72."
   },
   {
    "campo": "Observações",
    "texto": "datas de 2026 fixas no texto"
   }
  ]
 },
 {
  "id": "F-RESUMO-BANCO",
  "nome": "Resumo, Informações Bancárias (restituição e débito)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Resumo > Informações Bancárias (págs. 252 e 260)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Banco (3 algarismos, lista de bancos autorizados); Agência (sem DV); Conta e DV; opção Pix (chave = CPF do titular)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "conta corrente individual ou conjunta de titularidade do declarante; para restituição também poupança; banco precisa estar na rede autorizada; Pix só com chave CPF do titular. Saída Definitiva sem conta no Brasil: procurador com procuração pública indica conta no Banco do Brasil; restituições não resgatadas em um ano ficam nas unidades da RFB e são pagas via Siafi"
   },
   {
    "campo": "Códigos",
    "texto": "tabela de bancos (bancos.xml), cálculo de DV (bancos_calculo_dv.xml)"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-RESUMO-SIMPL",
  "nome": "Resumo, Cálculo do Imposto (Desconto Simplificado)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Resumo > Cálculo do Imposto (Desconto Simplificado) (págs. 253 a 260)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos e fórmulas",
    "texto": "- Rendimentos tributáveis: PJ titular; PJ dependentes; PF/Exterior titular; PF/Exterior dependentes; RRA titular e dependentes (campo rendimentos recebidos, se opção Ajuste); resultado tributável positivo da AR\n- Total dos rendimentos tributáveis = soma\n- Desconto simplificado = menor entre 20% do total e R$ 16.754,34\n- Base de cálculo = Total - Desconto simplificado\n- Imposto devido = tabela progressiva anual (faixas de F-RESUMO-CALC)\n- Imposto devido RRA = art. 12-A Lei 7.713/1988\n- Alíquota efetiva (%) = imposto devido / total tributável\n- Total de imposto devido = imposto devido + imposto devido RRA (o texto diz \"base de cálculo acrescido de imposto devido RRA\", erro de redação)\n- Imposto pago: IRRF titular (PJ + RRA Ajuste; sem citar linha 11 de Isentos neste modelo); IRRF dependentes; Carnê-Leão titular e dependentes (Darf 0190); Imposto complementar; Imposto pago no exterior (titular e dependentes); IRRF Lei 11.033/2004; Imposto retido RRA (opção Exclusiva); Total\n- Imposto a restituir ou a pagar = diferença\n- Quotas, débito automático, informações bancárias: iguais ao modelo completo"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "desconto substitui todas as deduções legais; dedução de incentivo não existe no simplificado (inferido pela ausência da linha)"
   },
   {
    "campo": "Observações",
    "texto": "diferença na composição do IRRF do titular entre os dois modelos é do texto (conferir)"
   }
  ]
 },
 {
  "id": "F-RESUMO-EVOL",
  "nome": "Resumo, Outras Informações: Evolução patrimonial",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Resumo > Outras Informações (pág. 261)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos, com linhas condicionais"
   },
   {
    "campo": "Campos (calculados)",
    "texto": "Bens e direitos em 31/12/2024; Bens e direitos na data da partilha (Final de Espólio); Bens e direitos em 31/12/2025; Bens e direitos na data da caracterização de não residente (Saída); Bens e direitos, valor da transferência (Final de Espólio); Dívidas em 31/12/2024; Dívidas em 31/12/2025; Dívidas na data da caracterização de não residente (Saída); Dívidas na data da partilha (Final de Espólio)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "somatórios das fichas Bens e Dívidas"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-RESUMO-OUTRAS",
  "nome": "Resumo, Outras Informações: demais linhas",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Resumo > Outras Informações (págs. 262 e 263)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos (calculados)",
    "texto": "- Rendimentos isentos e não tributáveis = total da ficha Isentos\n- Rendimentos sujeitos à tributação exclusiva/definitiva = total da ficha Exclusivos\n- Rendimentos tributáveis (exigibilidade suspensa) = soma das fichas Suspensa titular e dependentes\n- Depósitos judiciais do imposto = soma das fichas Suspensa\n- Imposto pago sobre Ganhos de Capital = GCAP 2025\n- Imposto pago Ganhos de Capital Moeda Estrangeira (bens, direitos e aplicações) = GCAP 2025\n- Total do IRRF Lei 11.033/2004 informado = GCAP (participação societária) + Renda Variável + Resumo\n- Imposto pago sobre Renda Variável = imposto a pagar do demonstrativo RV comuns/day-trade e FII/Fiagro\n- Doações a partidos políticos e candidatos = soma da ficha\n- Imposto a pagar sobre ganho de capital, moeda estrangeira em espécie = GCAP 2025; Darf emitido pelo programa Ganhos de Capital; não compensável na DAA; na Saída Definitiva pago na data de entrega\n- Imposto diferido dos Ganhos de Capital = GCAP 2025\n- Imposto devido sobre Ganhos de Capital = GCAP 2025\n- Imposto devido sobre ganho líquido em Renda Variável = RV e FII/Fiagro\n- Imposto devido sobre Ganhos de Capital Moeda Estrangeira (bens, direitos e aplicações) = GCAP 2025"
   },
   {
    "campo": "Importações/exportações",
    "texto": "importação do GCAP 2025 alimenta estas linhas"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "F-RESUMO-OPCAO",
  "nome": "Opção pela Tributação (Ajuste Anual)",
  "fonte": "docs/mapeamento/notas/05-bens-especiais-dividas-resumo.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Resumo > Opção pela Tributação (pág. 264)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual"
   },
   {
    "campo": "Campos",
    "texto": "comparativo dos dois modelos; opção (Deduções legais, marcada por padrão; Desconto simplificado)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "troca de opção é automática e preserva as deduções informadas, salvo se excluídas. Excluir dependente na ficha Dependentes exclui automaticamente seus dados em Rend. PJ Dependentes, PF/Exterior Dependentes, Pagamentos, Doações Efetuadas, Ganhos de Capital e Renda Variável (Imposto a Pagar); o usuário precisa excluir à mão os Isentos, Exclusivos, Bens e Dívidas desses dependentes"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "escolhe o modelo do cálculo final"
   },
   {
    "campo": "Observações",
    "texto": "nenhuma"
   }
  ]
 },
 {
  "id": "D-AR-GERAL",
  "nome": "Demonstrativo da Atividade Rural (visão geral e regras de período)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "menu lateral \"Fichas da Declaração\" > Demonstrativo da Atividade Rural; Ajuda pág. 265 a 268"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Ajuste Anual, Final de Espólio, Saída Definitiva"
   },
   {
    "campo": "Campos",
    "texto": "não se aplica (contêiner das fichas D-AR-*)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Final de Espólio: período de 1º de janeiro até a data da decisão judicial da partilha, sobrepartilha ou adjudicação, ou da lavratura da escritura pública; se ainda houver bens a inventariar que gerem rendimentos, informar o ano-calendário inteiro.\n- Saída Definitiva: período de 1º de janeiro até o dia anterior ao da caracterização da condição de não residente."
   },
   {
    "campo": "Códigos",
    "texto": "ver D-AR-IMOVEL (atividade 10 a 17, 99; condição de exploração 1 a 6)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "resultado tributável vai para o Resumo (linha \"Resultado tributável da Atividade Rural\"); resultado não tributável vai para Isentos código 15."
   },
   {
    "campo": "Importações/exportações",
    "texto": "IRPF2025 (declaração anterior) e Livro Caixa da Atividade Rural 2025 (ver D-AR-IMPORT); todos os itens importados são alteráveis."
   },
   {
    "campo": "Observações",
    "texto": "documentos guardados até a prescrição dos créditos tributários."
   }
  ]
 },
 {
  "id": "D-AR-OBRIG",
  "nome": "Obrigatoriedade de Preenchimento do Demonstrativo",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 266"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Validações conhecidas (deve preencher se qualquer condição)",
    "texto": "- apurou resultado positivo da atividade rural em 2025, em qualquer montante, e está obrigado à DAA 2026;\n- participação nas receitas brutas das unidades rurais (individual, parceria ou condomínio) em 2025 superior a R$ 177.920,00, caso tenha exclusivamente receitas de atividade rural;\n- pretende compensar prejuízo de anos anteriores ou do próprio ano-calendário 2025."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "Brasil com várias propriedades: ficha Brasil consolidada; exterior: uma ficha por país, na moeda do país, convertida para US$ e consolidada (soma algébrica) e depois para R$. Resultado positivo no exterior não compensa negativo do Brasil e vice-versa."
   }
  ]
 },
 {
  "id": "D-AR-OQUE",
  "nome": "O Que deve ser Declarado (atividade rural)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 267"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Regras",
    "texto": "são atividade rural: criação/recriação/engorda de animais de médio e grande porte; cultura do solo; apicultura, avicultura, cunicultura, piscicultura, sericicultura, suinocultura e pequenos animais, inclusive captura e venda in natura de pescado; extração e exploração animal e vegetal; transformação de produtos sem alterar composição e características in natura, feita pelo próprio produtor/familiares/empregados, dentro do imóvel, com equipamentos usuais e matéria-prima própria."
   },
   {
    "campo": "Não é receita rural",
    "texto": "aluguel ou arrendamento de imóvel rural, pastos, máquinas; prestação de serviços de preparo da terra e transporte de produtos de terceiros (vão para rendimentos tributáveis comuns). Transformação fora das condições: ganho de capital (sem habitualidade) ou equiparação a PJ (com habitualidade)."
   },
   {
    "campo": "Não é atividade rural",
    "texto": "compra e venda de rebanho bovino com permanência inferior a 52 dias (confinamento) ou 138 dias (demais casos)."
   }
  ]
 },
 {
  "id": "D-AR-IMOVEL",
  "nome": "Dados do Imóvel Explorado (abas Brasil e Exterior)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo da Atividade Rural > Dados do Imóvel Explorado; abas \"Brasil\" e \"Exterior\"; botões Novo, OK, Editar, Excluir; Ajuda pág. 269 e 270"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "- Código da atividade (seleção, obrigatório, tabela tipoAtividadesRural): 10 Agricultura; 11 Pecuária; 12 Extração e exploração vegetal e animal; 13 Apicultura, avicultura, cunicultura, piscicultura, sericicultura, suinocultura etc.; 14 Cultura de pequenos animais; 15 Captura e venda do pescado in natura; 16 Transformação de produtos agrícolas ou pecuários; 17 Cultivo de florestas; 99 Outras.\n- Nome do imóvel (texto)\n- Localização (texto; no exterior inclui cidade e país)\n- CIB, Cadastro Imobiliário Brasileiro (mesmo número do ITR; só Brasil)\n- Área (ha, uma casa decimal)\n- Condição de exploração (seleção, tabela condicoesExploracao): 1 Propriedade Única ou Posse; 2 Condomínio; 3 Parceria; 4 Arrendamento; 5 Propriedade comum ao casal; 6 Outras.\n- Participação (%) (numérico; 100 se único proprietário, posseiro ou arrendatário; 50 se comum ao casal com tributação por cada cônjuge)\n- Participantes (lista): CPF/CNPJ (exceto se marcado estrangeiro), Nome, indicador \"estrangeiro\""
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Se participação menor que 100%, exigir participante(s) com CPF/CNPJ e Nome.\n- Nome do participante obrigatório se estrangeiro e sem CPF/CNPJ.\n- CIB substitui o antigo NIRF; número não muda para imóveis já cadastrados.\n- Excluir apaga todos os campos da linha."
   },
   {
    "campo": "Importações",
    "texto": "todos os dados importados do IRPF2025; imóvel adquirido em 2025 deve ser preenchido manualmente."
   },
   {
    "campo": "Observações",
    "texto": "novidade de nomenclatura: CIB no lugar de NIRF."
   }
  ]
 },
 {
  "id": "D-AR-RD-BRASIL",
  "nome": "Receitas e Despesas - Brasil",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo da Atividade Rural > Receitas e Despesas > aba Brasil; botão \"IMPORTAR\"; Ajuda pág. 270 a 272"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos (grade mensal janeiro a dezembro de 2025)",
    "texto": "- Receita bruta (R$ por mês)\n- Despesa de custeio e investimento (R$ por mês)"
   },
   {
    "campo": "Validações conhecidas / regras de lançamento",
    "texto": "- Consolidar todas as unidades rurais no Brasil do titular e dos dependentes.\n- Receita inclui: alienação de bens usados na produção (tratores, implementos, máquinas, utilitários, benfeitorias); sobras líquidas de cooperativas; auxílios e subvenções públicas; diferença de preço no fechamento de operação; bens/produtos/animais entregues para integralização de capital; produtos entregues em permuta ou dação em pagamento.\n- Adiantamento recebido em anos anteriores com entrega em 2025: lançar como receita no mês da entrega.\n- Despesas: encargos financeiros no mês do pagamento; aquisições a prazo no mês de cada parcela; bem por financiamento rural no mês do pagamento do bem; consórcio/leasing no mês de cada parcela após o recebimento do bem; consórcio não contemplado só vira despesa no mês do recebimento do bem, pelo valor acumulado; permuta com produtos rurais parcelada no mês de cada parcela.\n- Produto entregue em permuta: receita no mês de cada parcela.\n- Entrega futura com devolução: devolução após a entrega é despesa no mês da devolução; antes da entrega reduz o adiantamento.\n- Aluguel ou arrendamento pago deve ser informado obrigatoriamente na ficha Pagamentos Efetuados (DAA, Espólio, Saída)."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "somatórios vão para Apuração do Resultado (Receita bruta total, Despesa total)."
   },
   {
    "campo": "Importações",
    "texto": "Livro Caixa da Atividade Rural 2025 (dados mensais de receita e despesa), gravados pelo LCAR 2025 via \"Exportar para o IRPF2026\"."
   }
  ]
 },
 {
  "id": "D-AR-RD-EXTERIOR",
  "nome": "Receitas e Despesas - Exterior",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo da Atividade Rural > Receitas e Despesas > aba Exterior; botões Novo, Ok, Editar, Excluir, Importar; Ajuda pág. 273 a 276"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos (uma ficha por país)",
    "texto": "- País (seleção, tabela de países)\n- Receita Bruta Total - Moeda original (anual)\n- Despesa de Custeio/Investimento Total - Moeda original (anual)\n- Resultado - Moeda original (calculado: receita menos despesa)\n- Resultado - US$ (informado pelo usuário: conversão pela cotação fixada pela autoridade monetária do país para o último dia do ano-calendário)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Uma ficha por país; consolidar todas as unidades de cada país.\n- Final de Espólio: conversão para US$ na data da decisão judicial da partilha/sobrepartilha/adjudicação ou lavratura; período de 1º de janeiro até essa data.\n- Saída Definitiva: conversão para US$ no dia anterior ao da caracterização como não residente; período de 1º de janeiro até esse dia.\n- Mesmas regras de receita/despesa da ficha Brasil (com Previdência Oficial do país em vez de INSS); aluguel/arrendamento também em Pagamentos Efetuados."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "Resultado total US$ (soma algébrica dos países) multiplicado por R$ 5,5018 (dólar de compra BCB em 31/12/2025)."
   },
   {
    "campo": "Importações",
    "texto": "Livro Caixa da Atividade Rural 2025 (somatório anual por país)."
   }
  ]
 },
 {
  "id": "D-AR-APUR",
  "nome": "Apuração do Resultado (considerações gerais)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo da Atividade Rural > Apuração do Resultado; Ajuda pág. 277 e 278"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Regras",
    "texto": "- Apuração mediante livro Caixa (manual ou eletrônico) com receitas, despesas de custeio, investimentos e demais valores.\n- Exterior: apuração separada por país em moeda local; Resultado I moeda original convertido para US$ (cotação do último dia do ano-calendário pela autoridade monetária do país) = Resultado I US$; consolidação em Resultado total US$; conversão para R$ pela cotação de compra BCB do último dia de 2025: R$ 5,5018.\n- Receita bruta total até R$ 56.000,00: facultada apuração por prova documental, dispensado o livro Caixa.\n- Livro Caixa independe de registro; sem intervalos em branco, entrelinhas, borraduras, raspaduras ou emendas.\n- Arrendatários, condôminos e parceiros apuram separadamente na proporção das receitas e despesas de cada um, comprovado por contrato escrito.\n- Imóvel comum ao casal: cada cônjuge apura e tributa sua parte; opcionalmente o total na declaração de um dos cônjuges junto com os demais rendimentos comuns.\n- Cônjuge arrendatário/condômino/parceiro em unidade que não pertence ao casal: tributa integralmente o titular da atividade, salvo declaração em conjunto."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L01",
  "nome": "Saldo de prejuízo(s) a compensar de exercício(s) anterior(es)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; Ajuda pág. 279"
   },
   {
    "campo": "Campos",
    "texto": "valor R$ (Brasil) e valor (Exterior), informados pelo usuário"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Valor vem do campo \"Informação para o exercício seguinte\" da Apuração do Resultado da DAA 2025, desde que não tenha optado pelo limite de 20% em 2024 e tenha apresentado a DAA 2025.\n- Para compensar: apresentar o demonstrativo de 2025, não optar pelo limite de 20% e possuir escrituração, mesmo se dispensado.\n- Compensação limitada ao Resultado do exercício (exterior: ao Resultado total R$).\n- Prejuízo do exterior só compensa resultado positivo do exterior.\n- Encerramento de espólio: saldo não deduzido pelo de cujus (sem opção posterior pelos 20%) pode ser usado pelo meeiro e sucessores, proporcionalmente à parcela da unidade rural."
   },
   {
    "campo": "Importações",
    "texto": "NÃO é importado do IRPF2025; deve ser preenchido no IRPF2026."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L02",
  "nome": "Receita bruta total",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 280"
   },
   {
    "campo": "Regras de cálculo",
    "texto": "transportado pelo programa: soma da receita bruta mensal (Brasil) e das receitas do exterior."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L03",
  "nome": "Despesa de custeio e investimento total",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 281"
   },
   {
    "campo": "Regras de cálculo",
    "texto": "transportado: soma das despesas mensais (Brasil) e do exterior."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L04",
  "nome": "Resultado (Brasil) / Resultado total US$ e Resultado total R$ (Exterior)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 282"
   },
   {
    "campo": "Regras de cálculo",
    "texto": "- Brasil: Resultado = Receita bruta total menos Despesa total.\n- Exterior: Resultado total US$ = soma do Resultado US$ de todos os países; Resultado total R$ = Resultado total US$ x 5,5018.\n- Final de Espólio: Resultado total R$ informado pelo usuário, com dólar de compra BCB da data da decisão judicial/lavratura.\n- Saída Definitiva: Resultado total R$ informado, com dólar de compra BCB do dia anterior à condição de não residente."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L05",
  "nome": "Limite de 20% sobre a receita bruta total",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 283"
   },
   {
    "campo": "Regras de cálculo",
    "texto": "Brasil: 20% da Receita bruta total (calculado). Exterior: 20% da receita bruta em moeda original por país, convertido para US$ (cotação do último dia do ano pela autoridade monetária do país), somado entre países, multiplicado por 5,5018."
   },
   {
    "campo": "Validações",
    "texto": "no exterior, quando importado do IRPF2025/LCAR, o limite de 20% em R$ deve ser preenchido manualmente (pág. 296)."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L06",
  "nome": "Opção pela forma de apuração do resultado tributável",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 284"
   },
   {
    "campo": "Campos",
    "texto": "seleção entre \"Limite de 20% sobre a receita bruta\" e \"Resultado\""
   },
   {
    "campo": "Regras de cálculo",
    "texto": "define o Resultado tributável. Opção por 20% impede compensação de prejuízo e o aproveitamento futuro do saldo (ver L01)."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L07",
  "nome": "Compensação de prejuízo(s) de exercício(s) anterior(es)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 285"
   },
   {
    "campo": "Campos",
    "texto": "valor que pretende compensar"
   },
   {
    "campo": "Validações",
    "texto": "só se resultado tributável positivo e opção pelo Resultado; limitado ao saldo e ao resultado."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L08",
  "nome": "Resultado tributável",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 286"
   },
   {
    "campo": "Regras de cálculo",
    "texto": "preenchido conforme opção. Se positivo, transportado para \"Resultado tributável da Atividade Rural\" da ficha Rendimentos Tributáveis e Deduções do Resumo. Brasil e exterior não se compensam."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L09",
  "nome": "Saldo de prejuízo(s) a compensar",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 287"
   },
   {
    "campo": "Regras de cálculo",
    "texto": "Resultado positivo e opção pelo resultado: saldo anterior menos compensação. Resultado negativo: soma do negativo ao saldo anterior. Valor vai para \"Informação para o exercício seguinte\"."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L10",
  "nome": "Apuração do resultado não tributável",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 288"
   },
   {
    "campo": "Regras de cálculo",
    "texto": "- Brasil: Resultado + adiantamentos recebidos em 2025 para entrega futura - adiantamentos recebidos até 2024 informados como receita de produtos entregues em 2025 - resultado tributável (se negativo, considerado zero).\n- Exterior: Resultado total R$ + adiantamentos 2025 - receitas de produtos entregues em 2025 referentes a adiantamentos até 2024 - resultado tributável (negativo = zero).\n- Se positivo, vai para a linha Resultado não tributável e é transportado para Isentos código 15 (Parcela não tributável correspondente à atividade rural)."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L11",
  "nome": "Adiantamento(s) recebido(s) em 2025 por conta de venda para entrega futura",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 289"
   },
   {
    "campo": "Campos",
    "texto": "valor R$"
   },
   {
    "campo": "Validações",
    "texto": "só adiantamentos de contratos cujos produtos não foram entregues até 31/12/2025; se entregue em 2025, vira receita do mês da entrega. Exterior: converter moeda local para US$ (último dia do ano, autoridade do país) e para R$ (dólar de compra BCB do último dia de 2025). Devolução antes da entrega reduz o adiantamento."
   },
   {
    "campo": "Importações",
    "texto": "importado do LCAR 2025."
   }
  ]
 },
 {
  "id": "D-AR-APUR-L12",
  "nome": "Adiantamento(s) recebido(s) até 2024 a ser(em) informado(s) como receita(s) de produto(s) entregue(s) em 2025",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Apuração do Resultado; pág. 290"
   },
   {
    "campo": "Campos",
    "texto": "valor R$"
   },
   {
    "campo": "Validações",
    "texto": "valores declarados como adiantamento nos exercícios anteriores e entregues em 2025; também devem constar como receita no mês da entrega. Exterior: mesma conversão."
   },
   {
    "campo": "Importações",
    "texto": "importado do LCAR 2025."
   }
  ]
 },
 {
  "id": "D-AR-REBANHO",
  "nome": "Movimentação do Rebanho (abas Brasil e Exterior)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo da Atividade Rural > Movimentação do Rebanho; pág. 291"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos (por espécie, quantidade de cabeças)",
    "texto": "Espécie; Estoque inicial; Aquisições (inclui meação, doação, herança recebidas); Nascimentos; Consumo e perdas; Vendas (inclui entregas por meação, doação, herança); Estoque final (calculado)"
   },
   {
    "campo": "Validações",
    "texto": "incluir animais próprios mesmo em poder de terceiros por contrato; excluir animais de terceiros em seu poder."
   },
   {
    "campo": "Regras de cálculo",
    "texto": "Estoque final = Estoque inicial + Aquisições + Nascimentos - Consumo e perdas - Vendas."
   },
   {
    "campo": "Importações",
    "texto": "estoque final do IRPF2025 vira estoque inicial; aquisições, nascimentos, consumo e perdas e vendas devem ser preenchidos no IRPF2026."
   }
  ]
 },
 {
  "id": "D-AR-BENS",
  "nome": "Bens da Atividade Rural",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo da Atividade Rural > Bens da Atividade Rural; botões Novo, Editar, Excluir (múltiplas linhas), \"Repetir valores\" (copia 31/12/2024 para 31/12/2025 nos selecionados, Ctrl para múltipla seleção); pág. 292 e 293"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Campos",
    "texto": "Código (grupo do bem, tabela tipoBensAR); País (padrão Brasil; exterior: país do bem); Discriminação (bens e benfeitorias usados na atividade, exceto terra nua, com data e valor de alienação em 2025, datas e valores de aquisição se adquiridos e alienados em 2025, valor pago a cada ano se adquiridos antes); Situação em 31/12/2024 (R$); Situação em 31/12/2025 (R$)"
   },
   {
    "campo": "Validações",
    "texto": "- Consórcio não contemplado: valores pagos (2024 + 2025) nesta ficha, não como despesa; após recebimento do bem, pago + lance pode ser despesa.\n- Financiamento liberado e ainda não aplicado deve constar aqui.\n- Situação 31/12/2025 em branco para bens adquiridos e alienados em 2025 e para produção em estoque.\n- Exterior: moeda do país para US$ (cotação do último dia do ano, autoridade do país) e x 5,5018.\n- Final de Espólio: bens deduzidos como despesa não vão para Bens e Direitos; transmissão é receita rural do espólio no mês da transmissão."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "valor de alienação integra receita bruta (ficha Receitas e Despesas)."
   },
   {
    "campo": "Importações",
    "texto": "código e discriminação do IRPF2025; bens adquiridos e alienados em 2025 preenchidos manualmente."
   }
  ]
 },
 {
  "id": "D-AR-DIVIDAS",
  "nome": "Dívidas Vinculadas à Atividade Rural (abas Brasil e Exterior)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo da Atividade Rural > Dívidas Vinculadas à Atividade Rural; botões Novo, OK, Editar, Excluir; pág. 294"
   },
   {
    "campo": "Aplica-se a",
    "texto": "quem possuía dívidas rurais em 31/12/2024 ou 31/12/2025"
   },
   {
    "campo": "Campos",
    "texto": "Discriminação (data de contratação, número do contrato, nome do credor, CPF/CNPJ do credor se do Brasil); Situação em 31/12/2024 (R$); Situação em 31/12/2025 (R$); Valor Pago em 2025 (R$)"
   },
   {
    "campo": "Validações",
    "texto": "empréstimo contraído e quitado no mesmo ano: item específico com valor, datas de contratação e quitação, contrato, credor; zero nas duas situações. Exterior: conversão para US$ e x 5,5018."
   },
   {
    "campo": "Importações",
    "texto": "discriminação e situação em 31/12/2024 do IRPF2025; situação 31/12/2025 e dívidas de 2025 manuais."
   }
  ]
 },
 {
  "id": "D-AR-IMPORT",
  "nome": "Importação AR2025 (Livro Caixa da Atividade Rural 2025 e IRPF2025)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "botão \"Importar\" da ficha Receitas e Despesas; opção \"Importação AR2025\"; pág. 295 e 296"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos"
   },
   {
    "campo": "Fluxo",
    "texto": "preencher o LCAR 2025 (não usar o LCAR 2026); gravar via \"Exportar para o IRPF2026\" do menu Ferramentas do LCAR 2025; importar no IRPF2026 pelo botão Importar da ficha Receitas e Despesas.\n- Itens importados do IRPF2025 (ao cadastrar contribuinte com importação): Dados do Imóvel Explorado (todos); Rebanho (estoque final vira inicial); Bens AR (código e discriminação); Dívidas AR (discriminação e situação 31/12/2024)."
   },
   {
    "campo": "Itens importados do LCAR 2025",
    "texto": "Receitas e Despesas (dados mensais Brasil; somatório anual por país no exterior); Apuração (adiantamentos 2025 e adiantamentos até 2024 entregues em 2025)."
   },
   {
    "campo": "Itens a preencher manualmente",
    "texto": "imóveis adquiridos em 2025; saldo de prejuízo de exercícios anteriores; limite de 20% em R$ no exterior; rebanho (aquisições, nascimentos, consumo e perdas, vendas); bens adquiridos e alienações de 2025; dívidas (situação 31/12/2025 e dívidas de 2025)."
   },
   {
    "campo": "Observações",
    "texto": "LCAR é programa separado da RFB (download no gov.br).\n---"
   }
  ]
 },
 {
  "id": "D-GCAP-GERAL",
  "nome": "Demonstrativo de Ganhos de Capital (GCAP 2025)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "\"Fichas da Declaração\" > Demonstrativo \"Ganhos de Capital\" com telas \"Bens Imóveis\", \"Direitos/Bens Móveis\", \"Participações Societárias\", \"Moedas em Espécie\"; pág. 297"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (Espólio usa para ganho na transferência por valor superior)"
   },
   {
    "campo": "Campos",
    "texto": "dados vêm importados; o IRPF2026 lista os demonstrativos importados por tipo."
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Arquivo deve corresponder ao CPF da declaração aberta.\n- Não é aceito arquivo de \"Cópia de Segurança\" do GCAP; só o gerado por \"Exportar para o IRPF2026\" do GCAP2025.\n- Alienação de bens adquiridos em moeda estrangeira, liquidação/resgate de aplicações em moeda estrangeira e alienação de moeda estrangeira em espécie: apuração obrigatória pelo GCAP 2025."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "GCAP apura imposto devido, rendimentos de tributação exclusiva e parcela isenta, que são transportados à declaração (exclusivos 02/03/04, isentos, imposto pago, inferido pelos códigos da ficha exclusiva)."
   },
   {
    "campo": "Importações",
    "texto": "menu \"Importações\" > \"Ganhos de Capital 2025\"; ou barra lateral \"Importações\" > \"Ganhos de Capital 2025\"; ou botão \"Importar\" em cada tela do demonstrativo; ou \"Importação GCAP 2025\"."
   },
   {
    "campo": "Exclusão",
    "texto": "selecionar demonstrativo(s) e \"Excluir\"."
   },
   {
    "campo": "Observações",
    "texto": "GCAP 2025 é programa separado (download gov.br), com impressão de Darf própria."
   }
  ]
 },
 {
  "id": "D-GCAP-IMOVEIS",
  "nome": "Ganhos de Capital - Bens Imóveis",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo Ganhos de Capital > Bens Imóveis; botão Importar; pág. 297"
   },
   {
    "campo": "Campos/regras",
    "texto": "não detalhados na Ajuda (preenchimento no GCAP). (inferido: alienação, custo, reduções, isenções de imóvel único até R$ 440 mil, 180 dias)"
   }
  ]
 },
 {
  "id": "D-GCAP-MOVEIS",
  "nome": "Ganhos de Capital - Direitos/Bens Móveis",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo Ganhos de Capital > Direitos/Bens Móveis; botão Importar; pág. 297"
   }
  ]
 },
 {
  "id": "D-GCAP-PARTICIP",
  "nome": "Ganhos de Capital - Participações Societárias",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo Ganhos de Capital > Participações Societárias; botão Importar; pág. 297"
   }
  ]
 },
 {
  "id": "D-GCAP-MOEDA",
  "nome": "Ganhos de Capital - Moedas em Espécie",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Demonstrativo Ganhos de Capital > Moedas em Espécie; botão Importar; pág. 297"
   }
  ]
 },
 {
  "id": "D-RV-GERAL",
  "nome": "Renda Variável - Operações Comuns e Day-Trade (considerações gerais)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "\"Fichas da Declaração\" > Renda Variável > Operações Comuns/Day-Trade; abas Titular e Dependentes; seleção do mês; botões Ok, Editar, Excluir; pág. 298 a 300"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (Espólio: até a data da partilha, ou ano todo se ainda há bens a inventariar; Saída: até o dia anterior à não residência)"
   },
   {
    "campo": "Obrigatoriedade (residente no Brasil, em 2025)",
    "texto": "alienação de ações no mercado à vista em bolsa; alienação de ouro ativo financeiro (disponível/à vista em bolsa ou junto a instituições financeiras); operações a termo, opções e futuro em bolsa com qualquer ativo; operações a termo, opções e futuro fora de bolsa, inclusive opções flexíveis; alienação de quotas de FII/Fiagro em bolsa."
   },
   {
    "campo": "Dispensa",
    "texto": "box, termo conjugado (compra vinculada à revenda) e operações de financiamento com rendimento predeterminado (tributados na fonte como renda fixa); mútuo e compra vinculada à revenda com ouro; operações isentas (ações à vista em bolsa e ouro com alienações no mês até R$ 20.000,00, por conjunto de ações e ouro separadamente), exceto se quiser compensar perdas; FII/Fiagro fora de bolsa (vai para GCAP2025)."
   },
   {
    "campo": "Validações",
    "texto": "- Resultado positivo em operações isentas vai para Isentos e Não Tributáveis (código 20 para ações até R$ 20 mil, inferido; FII/Fiagro isentos vão para linha 99, pág. 312).\n- Dependentes: só os já cadastrados na ficha Dependentes aparecem na aba Dependentes.\n- Perdas em day-trade só compensam ganhos em day-trade."
   }
  ]
 },
 {
  "id": "D-RV-PROC",
  "nome": "Procedimentos para Apuração dos Ganhos Líquidos ou Perdas",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 301 a 304"
   },
   {
    "campo": "Regras de cálculo",
    "texto": "- Corretagens, taxas e custos efetivamente pagos podem ser somados ao custo ou deduzidos do preço de venda.\n- Mercado à vista (ações, ouro, inclusive fora de bolsa): custo médio ponderado por espécie; venda parcial ajusta o estoque; ganho = venda menos custo médio do vendido.\n- Opções sem exercício: titular: custo médio dos prêmios pagos da mesma série, ganho = valor de encerramento menos custo médio; lançador: média dos prêmios recebidos da mesma série, ganho = prêmio médio x quantidade encerrada menos valor da operação de encerramento.\n- Exercício de opção de compra: titular: custo = preço de exercício + prêmio pago; ganho = venda à vista na data do exercício menos custo; venda posterior usa custo médio do à vista. Lançador coberto: custo médio do ativo; descoberto: preço de aquisição do ativo; ganho = preço de exercício + prêmio recebido menos custo.\n- Exercício de opção de venda: titular: custo = custo médio do ativo + prêmio pago; ganho = preço de exercício menos custo. Lançador: custo = preço de exercício menos prêmio recebido; ganho = venda à vista na data do exercício menos custo; venda posterior pelo custo médio.\n- Prêmio sem negociação nem exercício: ganho do lançador e perda do titular no vencimento.\n- Termo: comprador que vende à vista na liquidação: ganho = preço à vista menos preço do contrato; vendedor que compra à vista na liquidação: ganho = preço do contrato menos preço à vista; caso contrário, preço do contrato menos custo médio. Vendedor em operação de financiamento: renda fixa.\n- Futuro: ganho = soma algébrica dos ajustes diários até a liquidação ou encerramento."
   }
  ]
 },
 {
  "id": "D-RV-TIPOS",
  "nome": "Tipos de Mercado ou Ativo / Ganhos Líquidos ou Perdas (linhas de entrada)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "grade mensal, colunas \"Operações Comuns\" e \"Operações Day-Trade\"; pág. 305"
   },
   {
    "campo": "Campos",
    "texto": "linhas por tipo de mercado/ativo (nomes dos principais ativos precedidos do tipo de mercado; linha \"outros\" para ativo não discriminado; \"Mercado de Opções fora de bolsa\" para mercados de liquidação futura fora de bolsa). Lista exata não consta na Ajuda (inferido do PGD: Mercado à vista ações, ouro, ouro fora de bolsa; Mercado de opções ações, ouro, fora de bolsa, outros; Mercado futuro dólar, índices, juros, outros; Mercado a termo ações/ouro, outros)."
   },
   {
    "campo": "Validações",
    "texto": "valores em R$ por mês; perdas com sinal negativo; consolidar por linha o total do mês; day-trade separado."
   }
  ]
 },
 {
  "id": "D-RV-L01",
  "nome": "RESULTADO LÍQUIDO DO MÊS",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 306"
   },
   {
    "campo": "Regras de cálculo",
    "texto": "soma algébrica das linhas do mês, por coluna (comuns e day-trade); negativo com sinal."
   }
  ]
 },
 {
  "id": "D-RV-L02",
  "nome": "Resultado negativo até o mês anterior",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 306"
   },
   {
    "campo": "Campos",
    "texto": "em janeiro, informado pelo usuário (o programa não transporta prejuízo do ano anterior); demais meses, transportado do Prejuízo a compensar do mês anterior."
   }
  ]
 },
 {
  "id": "D-RV-L03",
  "nome": "BASE DE CÁLCULO DO IMPOSTO",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Regras",
    "texto": "Resultado líquido do mês menos Resultado negativo até o mês anterior, se positivo."
   }
  ]
 },
 {
  "id": "D-RV-L04",
  "nome": "Prejuízo a compensar",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Regras",
    "texto": "se negativo anterior maior que o resultado do mês ou resultado do mês negativo, soma algébrica; compensável nos meses seguintes."
   }
  ]
 },
 {
  "id": "D-RV-L05",
  "nome": "Alíquota do imposto / IMPOSTO DEVIDO",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Regras",
    "texto": "base x 15% (operações comuns) ou 20% (day-trade)."
   }
  ]
 },
 {
  "id": "D-RV-L06",
  "nome": "Total do imposto devido",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Regras",
    "texto": "soma do imposto devido das colunas comuns e day-trade."
   }
  ]
 },
 {
  "id": "D-RV-L07",
  "nome": "IR fonte de Day-Trade no mês",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "IRRF sobre day-trade do mês, informado."
   }
  ]
 },
 {
  "id": "D-RV-L08",
  "nome": "IR fonte de Day-Trade nos meses anteriores",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Regras",
    "texto": "transportado do \"IR fonte de Day-Trade a compensar\" do mês anterior."
   }
  ]
 },
 {
  "id": "D-RV-L09",
  "nome": "IR fonte de Day-Trade a compensar",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Regras",
    "texto": "Total do imposto devido menos IR fonte DT do mês e de meses anteriores; se negativo, indica o saldo. Compensável até dezembro; saldo final pode ser pedido em restituição (IN RFB 1.300/2012)."
   }
  ]
 },
 {
  "id": "D-RV-L10",
  "nome": "IR fonte (Lei nº 11.033/2004) no mês / nos meses anteriores / a compensar",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "IRRF de que tratam os §§ 1º e 2º, II, do art. 2º da Lei 11.033/2004 (o \"dedo-duro\")."
   },
   {
    "campo": "Validações",
    "texto": "valor do mês deve ser igual ou inferior à diferença entre Total do imposto devido e IR fonte DT do mês ou de meses anteriores, no mesmo ano."
   },
   {
    "campo": "Regras",
    "texto": "saldo compensável com imposto de meses seguintes até dezembro, com imposto de ganho de capital na alienação de ações e na Declaração de Ajuste Anual (vai para Imposto Pago/Retido, inferido)."
   }
  ]
 },
 {
  "id": "D-RV-L11",
  "nome": "Imposto a pagar",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Regras",
    "texto": "Total do imposto devido menos (IR fonte DT do mês + meses anteriores + a compensar + IR fonte Lei 11.033), se positivo. Pagamento até o último dia útil do mês seguinte; Darf código 6015."
   }
  ]
 },
 {
  "id": "D-RV-L12",
  "nome": "Imposto Pago",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "valor do principal do Darf pago (informado)."
   },
   {
    "campo": "Regras",
    "texto": "vencimento no último dia útil do mês subsequente; código 6015; multa de mora 0,33% ao dia a partir do primeiro dia útil após o vencimento, limitada a 20%; juros Selic acumulada mensal a partir do mês seguinte ao vencimento até o mês anterior ao pagamento, mais 1% no mês do pagamento."
   }
  ]
 },
 {
  "id": "D-FII-GERAL",
  "nome": "Operações em FII ou Fiagro (conceito e considerações gerais)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "\"Fichas da Declaração\" > Renda Variável > Operações em Fundos de Investimento Imobiliário/Fiagro; abas Titular e Dependentes; mês; botões Ok, Editar, Excluir; pág. 310 a 313"
   },
   {
    "campo": "Aplica-se a",
    "texto": "todos (mesmas regras de período para Espólio e Saída)"
   },
   {
    "campo": "Regras",
    "texto": "- FII/Fiagro: sem personalidade jurídica, condomínio fechado, proibido resgate, quotas são valores mobiliários (Lei 6.385/1976).\n- Obrigatoriedade e dispensa iguais às de renda variável; FII/Fiagro fora de bolsa vai para o GCAP2025.\n- Resultado positivo em operações isentas: Isentos e Não Tributáveis, Outros, linha 99."
   }
  ]
 },
 {
  "id": "D-FII-DISTRIB",
  "nome": "Distribuição dos Lucros / Rendimentos e Ganhos Auferidos e Distribuídos",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 314 e 315"
   },
   {
    "campo": "Regras",
    "texto": "fundos distribuem no mínimo 95% dos lucros (regime de caixa, balanço semestral 30/06 e 31/12). Rendimentos e ganhos do fundo seguem regras de aplicações de PJ; distribuição sujeita a IRRF de 20%."
   }
  ]
 },
 {
  "id": "D-FII-ALIEN",
  "nome": "Alienação ou Resgate de Quotas",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 316"
   },
   {
    "campo": "Regras",
    "texto": "alíquota 20%: na fonte no resgate (só no término do prazo ou liquidação; rendimento = resgate menos custo); demais casos pelas normas de renda variável/ganho de capital."
   }
  ]
 },
 {
  "id": "D-FII-ISENCAO",
  "nome": "Isenção dos rendimentos distribuídos",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 317"
   },
   {
    "campo": "Regras",
    "texto": "rendimentos distribuídos isentos na fonte e na DAA se quotas negociadas exclusivamente em bolsa ou balcão organizado, fundo com no mínimo 50 cotistas, e o cotista PF não detenha 10% ou mais das quotas nem direito a mais de 10% dos rendimentos. Fundo que aplica em empreendimento com incorporador, construtor ou sócio cotista com mais de 25% (isolado ou com pessoa ligada: parentes até 2º grau, empresa sob seu controle ou de parentes) tributa como PJ."
   }
  ]
 },
 {
  "id": "D-FII-PROC",
  "nome": "Procedimentos para Apuração (FII/Fiagro)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 318"
   },
   {
    "campo": "Regras",
    "texto": "custos de corretagem somados ao custo ou deduzidos da venda; custo médio ponderado por espécie de fundo; venda parcial ajusta estoque; ganho = venda menos custo médio."
   }
  ]
 },
 {
  "id": "D-FII-L01",
  "nome": "Ganhos Líquidos ou Perdas / Resultado líquido do mês",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 319 e 320"
   },
   {
    "campo": "Campos",
    "texto": "ganho ou perda do mês (R$; perda com sinal negativo); Resultado líquido do mês informado."
   }
  ]
 },
 {
  "id": "D-FII-L02",
  "nome": "Resultado negativo até o mês anterior",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 321"
   },
   {
    "campo": "Regras",
    "texto": "janeiro informado pelo usuário (sem transporte do ano anterior); demais meses transportados do Prejuízo a compensar do mês anterior."
   }
  ]
 },
 {
  "id": "D-FII-L03",
  "nome": "Base de cálculo do imposto",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 322"
   },
   {
    "campo": "Regras",
    "texto": "Resultado líquido do mês menos Resultado negativo anterior, se positivo."
   }
  ]
 },
 {
  "id": "D-FII-L04",
  "nome": "Prejuízo a compensar",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 323"
   },
   {
    "campo": "Regras",
    "texto": "idem renda variável; compensável nos meses seguintes (só com FII/Fiagro, inferido pela ficha separada)."
   }
  ]
 },
 {
  "id": "D-FII-L05",
  "nome": "Alíquota do imposto / Imposto devido",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 324"
   },
   {
    "campo": "Regras",
    "texto": "base x 20%."
   }
  ]
 },
 {
  "id": "D-FII-L06",
  "nome": "Imposto pago",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 325"
   },
   {
    "campo": "Campos",
    "texto": "principal do Darf pago."
   },
   {
    "campo": "Regras",
    "texto": "vencimento último dia útil do mês subsequente; código 6015; multa 0,33% ao dia limitada a 20%; juros Selic + 1% no mês do pagamento."
   },
   {
    "campo": "Observações",
    "texto": "a Ajuda não descreve linhas de IRRF na ficha FII (inferido: existe IR fonte Lei 11.033 também; verificar no layout).\n---"
   }
  ]
 },
 {
  "id": "E-ESP-GERAL",
  "nome": "Declaração Final de Espólio: disposições gerais",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 326 a 331"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Final de Espólio"
   },
   {
    "campo": "Regras",
    "texto": "- É a declaração do ano-calendário da decisão judicial da partilha, sobrepartilha, adjudicação ou escritura pública de inventário e partilha. Obrigatória havendo bens a inventariar.\n- Apresentação e pagamento cabem ao inventariante.\n- Período: 1º de janeiro até a data da decisão/escritura; normas do ano-calendário da decisão.\n- Incluir rendimentos próprios, 50% dos rendimentos dos bens comuns até a data da decisão (opcional: 100% em nome do espólio, compensando todo o imposto retido), bens do inventário e obrigações do espólio.\n- Ganho de capital em alienação no curso do inventário: em nome do espólio, exceto cessão de direitos hereditários (cedente apura; IN SRF 84/2001 e IN RFB 897/2008).\n- Apresentada em nome do de cujus, com CPF e endereço dele antes do falecimento. Inventariante indica nome, CPF e endereço na ficha Espólio. Sem CPF do de cujus: solicitar inscrição.\n- Local: Internet, programa de transmissão Receitanet."
   }
  ]
 },
 {
  "id": "E-ESP-SOBREPARTILHA",
  "nome": "Sobrepartilha, bens acrescidos antes e após a partilha",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 328 a 330"
   },
   {
    "campo": "Regras",
    "texto": "- Bens passíveis de sobrepartilha: sonegados; herança conhecida após partilha; litigiosos ou de liquidação difícil/morosa; situados em lugar remoto da sede do juízo.\n- Desde AC 2020: a partilha dos demais bens implica baixa na ficha Bens e Direitos da DFE; DFE também exigida no trânsito em julgado da sobrepartilha, se não homologada no mesmo ano da partilha. Valor de transmissão superior ao do ano anterior: apurar ganho de capital.\n- Desde exercício 2021: possível fazer DFE com dados da sobrepartilha sem retificar a DFE da partilha. Campo \"Final de Espólio\": \"Partilha\", \"Sobrepartilha\" ou \"Partilha e Sobrepartilha\" (habilita as abas correspondentes). Permite mais de uma DFE em anos distintos.\n- \"Ainda há bens a inventariar?\" habilita CPF e Nome do inventariante; marcar quando, apesar da decisão/escritura, ainda existir bem a inventariar; marcar \"Bem a inventariar\" no bem.\n- Exemplo: partilha transitada em abril/2025 (ocorrida em janeiro/2025): DFE 2026 até 29/05/2026. Sobrepartilha iniciada em janeiro/2026: se decisão não ocorrer em 2026, DAA 2027 com natureza 81 e marcar sobrepartilha na ficha Espólio; se decisão em junho/2026 com trânsito em agosto/2026, outra DFE em 2027 marcando \"Sobrepartilha\".\n- Partilha transitada a partir de 1º/03/2025 e sobrepartilha iniciada sem decisão em 2025: marcar \"Ainda há bens a inventariar\" e \"Bem a inventariar\" nos bens pendentes com situação 31/12/2024 e 31/12/2025. Bens da partilha/sobrepartilha transitados em 2025: dados dos herdeiros, \"Situação na data da partilha (R$)\" e \"Valor de transferência (R$)\", sem marcar \"Bem a inventariar\" e selecionando \"%\".\n- Bens acrescidos antes do trânsito: incluir bens e rendimentos; se produziram rendimentos em anos anteriores não decaídos, retificar declarações desde a abertura da sucessão.\n- Bens acrescidos após a partilha: retificar declarações anteriores não decaídas; se DFE já apresentada, retificá-la (até a data da decisão da sobrepartilha se no mesmo ano; ano todo se em ano posterior); se DFE não apresentada: incluir bens da partilha e sobrepartilha com rendimentos conforme o ano da decisão.\n- Com sobrepartilha ou recurso, declarações intermediárias continuam até o trânsito em julgado; após trânsito da sobrepartilha, nova declaração final."
   }
  ]
 },
 {
  "id": "E-ESP-OBITO-CONJUGES",
  "nome": "Ocorrência de morte de ambos os cônjuges",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 330 e 331"
   },
   {
    "campo": "Regras",
    "texto": "comunhão parcial/universal: morte conjunta: uma declaração em nome de um dos cônjuges com bens e rendimentos do casal; datas diferentes antes de encerrado o inventário do premorto: uma declaração em nome do premorto abrangendo o casal. Separação de bens: uma ou duas declarações conforme um ou dois inventários."
   },
   {
    "campo": "Campos (ficha Espólio)",
    "texto": "\"Trata-se de óbito de ambos os cônjuges ou companheiros?\" (Sim/Não); se Sim: \"Trata-se de um inventário conjunto?\" (se Sim: CPF e nome do outro cônjuge); se Não: \"O cônjuge ou companheiro(a) é meeiro(a)?\"."
   }
  ]
 },
 {
  "id": "E-ESP-MOEDA",
  "nome": "Conversão de moeda estrangeira para reais (espólio)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 331"
   },
   {
    "campo": "Regras",
    "texto": "moeda estrangeira para US$ pela autoridade monetária do país na data do recebimento/pagamento; depois para R$ pelo dólar BCB do último dia útil da primeira quinzena do mês anterior; compra para rendimentos e imposto pago, venda para deduções (tabela de conversão do dólar 2025)."
   }
  ]
 },
 {
  "id": "E-ESP-BENS",
  "nome": "Ficha Bens e Direitos (Final de Espólio)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 331 a 333"
   },
   {
    "campo": "Campos",
    "texto": "Código, Discriminação, Situação em 31/12/2024 (R$), Situação na data da partilha (R$), Percentual (%), Valor de transferência (R$), dados dos herdeiros (CPF/CNPJ beneficiário), indicador \"Bem a inventariar\" (habilita Situação 31/12/2024 e 31/12/2025 e desabilita data da partilha, % e valor de transferência)"
   },
   {
    "campo": "Validações",
    "texto": "- Relacionar todos os bens e direitos do inventário e dos dependentes, Brasil e exterior, em 31/12 do ano anterior e na data da partilha/sobrepartilha/adjudicação/lavratura.\n- Transferência pelo valor da última declaração ou por valor de mercado superior; meeiro, herdeiros e legatários incluem os bens pelo \"Valor de transferência\" em suas declarações.\n- Transferência por valor superior à \"Situação na data da partilha\": diferença é ganho de capital a 15% (inclusive espólios iniciados antes de 1º/01/1998); apurar no GCAP 2025 e exportar para a declaração.\n- Bens da atividade rural deduzidos como despesa não vão nesta ficha (ver D-AR-BENS).\n- Bens alienados no ano: discriminação com nome, CPF/CNPJ do adquirente, data e valor; não preencher Situação na data da partilha nem Valor de transferência.\n- Retificadora de DFE: vedado após o prazo tempestivo retificar valores da ficha Bens e Direitos."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "ganho de capital (GCAP), soma de percentuais por bem (inferido 100%)."
   }
  ]
 },
 {
  "id": "E-ESP-GCAP",
  "nome": "Pagamento do Imposto sobre Ganhos de Capital (espólio)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 332"
   },
   {
    "campo": "Regras",
    "texto": "pago pelo inventariante por Darf em nome e CPF do de cujus, até a data de apresentação da DFE. Códigos: 4600 (bens ou direitos no Brasil); 8523 (bens/direitos e/ou aplicações financeiras liquidadas ou resgatadas no exterior); 8960 (moeda estrangeira em espécie)."
   }
  ]
 },
 {
  "id": "E-ESP-BENS-AR",
  "nome": "Bens da Atividade Rural no espólio",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 332"
   },
   {
    "campo": "Regras",
    "texto": "bens deduzidos como despesa não vão para Bens e Direitos; transmissão não segue regras de ganho de capital; preencher o Demonstrativo da AR com o valor de transmissão como receita do espólio no mês da transmissão. Beneficiário que continua a atividade: despesa rural; que não continua: custo de aquisição para futuro ganho de capital."
   }
  ]
 },
 {
  "id": "E-ESP-IDENT",
  "nome": "Ficha Identificação do Contribuinte (Final de Espólio)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 333"
   },
   {
    "campo": "Campos",
    "texto": "- Tipo de declaração: \"Declaração Final de Espólio Original\" (primeira do exercício 2026) ou \"Declaração Retificadora\" (exige número do recibo da DFE anterior, obtido em Declaração > Imprimir > Recibo; obrigatório)\n- Nome (completo do de cujus)\n- Data de nascimento (DD MM AAAA)\n- Raça/Cor (autodeclarado: Amarela, Branca, Indígena, Parda, Preta)\n- Endereço (do de cujus na data do falecimento)\n- Natureza da ocupação: preenchida pelo programa com 81 - Espólio"
   },
   {
    "campo": "Validações",
    "texto": "recibo obrigatório na retificadora; retificadora após o prazo não pode alterar Bens e Direitos."
   }
  ]
 },
 {
  "id": "E-ESP-FICHA",
  "nome": "Ficha Espólio",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 333 e 334 (preenchimento obrigatório)"
   },
   {
    "campo": "Campos",
    "texto": "- Ano do óbito (4 dígitos)\n- Final de Espólio: Partilha / Sobrepartilha / Partilha e Sobrepartilha (habilita abas)\n- Ainda há bens a inventariar (checkbox; habilita CPF e Nome do inventariante)\n- Tipo do inventário: Decisão Judicial ou Escritura Pública (não habilitados quando a sobrepartilha não foi encerrada)\n- Decisão judicial: número do processo, vara cível, comarca, UF, data da decisão judicial da partilha, data do trânsito em julgado\n- Escritura pública: CNPJ e nome do cartório, livro, folhas, UF, município, data da lavratura\n- Identificação do inventariante: CPF, nome, endereço\n- Informações do cônjuge/companheiro: óbito de ambos (Sim/Não); se Não: cônjuge é meeiro?; se Sim: inventário conjunto? (se Sim: CPF e nome do outro cônjuge)"
   },
   {
    "campo": "Validações",
    "texto": "obrigatória; CPF do inventariante e do cônjuge válidos; CNPJ do cartório; datas coerentes com o exercício (decisão até 2025 e trânsito até fevereiro/2026, ou trânsito entre 1º/03 e 31/12/2025, ou escritura em 2025) (inferido das regras de prazo)."
   }
  ]
 },
 {
  "id": "E-ESP-HERDEIROS",
  "nome": "Ficha Herdeiros/Meeiro",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 334 e 335; botões Novo, OK, Editar, Excluir"
   },
   {
    "campo": "Campos",
    "texto": "CPF ou CNPJ; Nome do herdeiro ou meeiro"
   },
   {
    "campo": "Validações",
    "texto": "CPF/CNPJ válido; excluir apaga a linha."
   },
   {
    "campo": "Regras",
    "texto": "herdeiros são referenciados na partilha de cada bem (percentual e valor de transferência)."
   }
  ]
 },
 {
  "id": "E-ESP-DIVIDAS",
  "nome": "Ficha Dívidas e Ônus Reais (Final de Espólio)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 336; botões Novo, Editar, Excluir (múltiplas), Ok"
   },
   {
    "campo": "Campos",
    "texto": "Código da dívida (tabela tipoDividas); Discriminação; Situação em 31/12/2024 (R$); Situação na data da partilha (R$)"
   },
   {
    "campo": "Regras",
    "texto": "dívidas do espólio e dos dependentes em 31/12 do ano anterior e na data da partilha/sobrepartilha/adjudicação/lavratura."
   }
  ]
 },
 {
  "id": "E-ESP-CALCULO",
  "nome": "Resumo da Declaração - Cálculo do imposto devido (Final de Espólio)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 336"
   },
   {
    "campo": "Regras de cálculo",
    "texto": "tabela progressiva mensal do ano-calendário multiplicada pelo número de meses de janeiro até o mês da decisão judicial/lavratura, ainda que os rendimentos sejam de apenas alguns meses."
   }
  ]
 },
 {
  "id": "E-ESP-PRAZO",
  "nome": "Observações finais: prazo, multa, pagamento, restituição",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 336 a 338"
   },
   {
    "campo": "Regras",
    "texto": "- Prazo: até 29/05/2026, apresentação e pagamento, quando: decisão até AC 2025 com trânsito até o último dia de fevereiro/2026; escritura lavrada em 2025; ou trânsito em julgado entre 1º/03 e 31/12/2025.\n- Multa por atraso: com imposto devido, 1% ao mês ou fração, mínimo R$ 165,74 e máximo 20% do imposto; sem imposto, R$ 165,74 (art. 88 da Lei 8.981/1995).\n- Pagamento até a data de apresentação, incluindo imposto da declaração do ano anterior e outros créditos não quitados; NÃO é permitido pagamento em quotas. Formas: transferência eletrônica (bancos autorizados) ou agência/caixa eletrônico com Darf.\n- Restituição: mesmas normas; sem bens a inventariar, pode ser paga ao cônjuge, companheiro ou herdeiros (IN SRF 81/2001), sem alvará; com bens a inventariar, conforme alvará judicial.\n- Responsabilidade: espólio pelos tributos até a abertura da sucessão; sucessor e meeiro até a partilha, limitado ao quinhão/legado/herança/meação; inventariante por excesso de poderes ou infração de lei; sem meação/herança/legado o sobrevivente não responde; inventariante solidário quando impossível exigir do espólio, sem multa de ofício.\n- CPF do de cujus não é cancelado; com ano do óbito, situação \"titular falecido\".\n- Espólio de não residente: não apresentar declaração; recolher na fonte em nome do espólio sobre rendimentos no Brasil até a partilha."
   }
  ]
 },
 {
  "id": "E-ESP-DARF",
  "nome": "Preenchimento do Darf (Final de Espólio)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 338 a 340; menu Declaração > Imprimir > Darf do IRPF ou Darf - Doações Diretamente na Declaração - ECA/Pessoa Idosa; ícone impressora na barra de ferramentas; Imprimir na barra lateral; opção Visualizar e salvar em PDF"
   },
   {
    "campo": "Campos do Darf",
    "texto": "CPF (do de cujus, pelo programa); Nome (do de cujus na data do falecimento); Período de apuração (data da decisão judicial da partilha); Data de vencimento (preenchida pelo inventariante); Número do documento (gerado pelo programa); Código da receita 0211; Principal (imposto); Multa (0,33% ao dia a partir do primeiro dia útil após o vencimento, limite 20%); Juros (Selic acumulada mensal a partir do mês seguinte ao vencimento até o mês anterior ao pagamento + 1% no mês do pagamento); Total (no prazo: principal; após: principal + multa + juros)"
   },
   {
    "campo": "Observações",
    "texto": "o número do documento é gerado pelo PGD (código de barras); fora do PGD o MCP pode instruir uso do Sicalc ou gerar Darf pelo PGD (inferido)."
   }
  ]
 },
 {
  "id": "E-ESP-PAGTO",
  "nome": "Pagamento do Imposto (Final de Espólio)",
  "fonte": "docs/mapeamento/notas/06-ar-gcap-rv-espolio.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 340"
   },
   {
    "campo": "Regras",
    "texto": "pagamento na data prevista para apresentação; o decurso do prazo implica vencimento das obrigações do espólio. Formas: transferência eletrônica ou agência/caixa com Darf."
   }
  ]
 },
 {
  "id": "F-SAIDA-GERAL",
  "nome": "Declaração de Saída Definitiva do País: obrigações",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 342 a 344"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Saída Definitiva"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "- Quem se ausentar em caráter permanente ou passar a não residente após ausência temporária deve: apresentar a DSDP do período de residência no ano da saída até o último dia útil de maio do ano seguinte; apresentar na mesma data as DAA de anos anteriores obrigatórias e não entregues; recolher em quota única, até essa data, o imposto apurado e os demais créditos tributários.\n- Prazo 2026: até 29/05/2026, para saída permanente em 2025 ou para quem completou 12 meses consecutivos de ausência em 2025.\n- Forma: computador com o IRPF2026; entrega pela Internet (Receitanet incorporado ao PGD) ou mídia removível nas unidades da RFB.\n- Rendimentos abrangidos: de 1º/01 (ou da aquisição da residência no ano) até o dia anterior à saída permanente; de 1º/01 até o dia em que completar 12 meses de ausência na saída temporária. Aplicam-se as normas do ano-calendário."
   },
   {
    "campo": "Observações",
    "texto": "complementa S-TIPO-DSDP e S-REGRA-AUSENTE-OUTROS"
   }
  ]
 },
 {
  "id": "S-REGRA-NAO-RESIDENTE",
  "nome": "Caracterização da condição de residente e de não residente",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 342 e 343"
   },
   {
    "campo": "Regras",
    "texto": "- Residente: reside em caráter permanente; ausente a serviço do Governo brasileiro como assalariado de autarquia ou repartição no exterior; ingresso com visto permanente (na chegada); visto temporário para trabalho com vínculo ou médico do Mais Médicos (na chegada), ao completar 184 dias em até 12 meses, ou na data do visto permanente ou vínculo se antes dos 184 dias; brasileiro que retorna com ânimo definitivo (na chegada); quem se ausenta sem apresentar a Comunicação de Saída Definitiva, durante os primeiros 12 meses consecutivos de ausência.\n- Não residente: não se enquadra como residente; retira-se em caráter permanente com Comunicação de Saída (na data da saída); ingressa para servir governo estrangeiro no País; visto temporário com até 183 dias em 12 meses, ou até a véspera do visto permanente ou vínculo; ausente temporariamente a partir do dia seguinte ao que completar 12 meses consecutivos.\n- Ausência inferior a 12 meses reinicia a contagem na próxima saída; a mudança de condição só ocorre quando houver hipótese que fundamente a nova condição."
   }
  ]
 },
 {
  "id": "F-SAIDA-IDENT",
  "nome": "Ficha Identificação do Contribuinte na Saída Definitiva",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 344 a 346"
   },
   {
    "campo": "Campos",
    "texto": "Tipo (Original, primeira do exercício 2026; Retificadora, com nº do recibo da DSDP anterior, obrigatório, obtido em Declaração > Imprimir > Recibo ou Declaração > Abrir); Nome; Data de nascimento; Doença grave ou deficiência (prioridade na restituição, art. 69-A Lei 9.784/1999); Raça/Cor; Possui cônjuge (CPF com 11 dígitos se SIM); Endereço Brasil ou Exterior; \"Houve mudança de endereço?\" (SIM/NÃO); endereço completo no exterior com código do país e do posto do MRE mais próximo; sem endereço no exterior: endereço do procurador no Brasil ou de contato no Brasil; Natureza da ocupação e Ocupação principal (naturezas 13, 14, 61, 62, 71 e 72 dispensam ocupação)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "recibo obrigatório na retificadora; regras de nome e data iguais às do Ajuste (nota 02)"
   }
  ]
 },
 {
  "id": "F-SAIDA",
  "nome": "Ficha Saída",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 346; tela PainelSaida"
   },
   {
    "campo": "Aplica-se a",
    "texto": "Saída Definitiva"
   },
   {
    "campo": "Campos",
    "texto": "Procurador (CPF, nome e endereço completo), se houver; Data da caracterização da condição de não residente (data da saída se permanente; dia seguinte ao que completou 12 meses de ausência se temporária); Data da caracterização da condição de residente no País, se ocorrida a partir de 01/01/2025; país de nova residência (layout registro 39: CD_NOVO_PAIS_RESIDENCIA, NM_PAIS, inferido)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "data de não residência dentro de 2025 (inferido); data de residência anterior à de não residência (inferido)"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "define o número de meses da tabela progressiva (soma das tabelas mensais) e o período das fichas"
   }
  ]
 },
 {
  "id": "F-SAIDA-DEDUCOES",
  "nome": "Deduções na Saída Definitiva",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 346"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "permitidas todas as deduções legais; limites anuais de dependentes e instrução podem ser usados integralmente se preenchidos os requisitos; deduções do período de residência (1º/01 ou data da residência até a véspera da saída permanente, ou até completar 12 meses de ausência)"
   }
  ]
 },
 {
  "id": "F-SAIDA-DIVIDAS",
  "nome": "Dívidas e Ônus Reais na Saída Definitiva",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 348"
   },
   {
    "campo": "Campos",
    "texto": "código; discriminação; Situação em 31/12/2024; Situação na data da caracterização de não residente"
   }
  ]
 },
 {
  "id": "F-SAIDA-CALC",
  "nome": "Cálculo do imposto na Saída Definitiva",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 348 e 349"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "soma das tabelas progressivas mensais dos meses do período, ainda que os rendimentos sejam de um ou alguns meses. Exemplo: residente em 01/01/2025 e não residente em 16/06/2025 usa a soma das tabelas de janeiro a junho. Se adquiriu residência no mesmo ano, soma dos meses da data da residência até o retorno à não residência. Tabela mensal de janeiro a abril difere da de maio a dezembro (S-TAB-PROGRESSIVA)."
   }
  ]
 },
 {
  "id": "F-SAIDA-IMPEXT",
  "nome": "Compensação do imposto pago no exterior na Saída Definitiva",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 349"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "mesma lista de países com acordo (África do Sul a Venezuela) e reciprocidade sem prova (Alemanha, Estados Unidos, Reino Unido); prova de reciprocidade por lei traduzida e autenticada ou declaração da representação diplomática; tributos estaduais e municipais excluídos; limite = imposto com rendimentos do exterior menos imposto sem eles; conversão pela cotação de compra do Bacen do último dia útil da 1ª quinzena do mês anterior ao recebimento"
   }
  ]
 },
 {
  "id": "F-SAIDA-PAGTO",
  "nome": "Pagamento, restituição e disposições finais da Saída Definitiva",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 350 e 351"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "quota única até a data da apresentação, inclusive do imposto do ano anterior e outros créditos; sem parcelamento; reclamações não suspendem a cobrança (depósito permitido); após o prazo: multa de mora 0,33% ao dia limitada a 20% e juros Selic acumulada desde o mês seguinte ao previsto para a apresentação até o mês anterior ao pagamento mais 1% no mês do pagamento; restituição só ao contribuinte ou procurador; formas: transferência eletrônica ou Darf em agência ou caixa eletrônico (no Brasil, contribuinte ou procurador)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "rendimentos de fonte no Brasil de não residente: tributação definitiva (ganho de capital e aplicações) ou exclusiva na fonte, sem isenções de residente, salvo tratado; o não residente deve comunicar a fonte pagadora por escrito (Comunicação à Fonte Pagadora de Saída do País); consultar IN SRF 208/2002"
   }
  ]
 },
 {
  "id": "F-SAIDA-DARF",
  "nome": "Darf da Saída Definitiva",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 351 e 352"
   },
   {
    "campo": "Campos",
    "texto": "CPF (programa); Nome (programa); Período de apuração (data da caracterização da não residência da ficha Saída); Data de vencimento (preenchida pelo declarante: data de apresentação obrigatória); Número do documento (gerado pelo programa); Código 0211; Principal; Multa (0,33% ao dia, limite 20%); Juros (Selic + 1%); Total (no prazo = principal; após = soma)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "ao apresentar, o contribuinte fica notificado a recolher; vencimento 29/05/2026; impressão por Declaração > Imprimir > Darf do IRPF ou Darf de doações ECA/Pessoa Idosa, ícone impressora ou barra lateral; visualizar e salvar em PDF"
   }
  ]
 },
 {
  "id": "F-SAIDA-MULTA",
  "nome": "Multa por atraso na entrega da Saída Definitiva",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 343 e 353"
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "após 29/05/2026, com imposto devido (ainda que pago) 1% ao mês ou fração sobre o imposto devido, mínimo R$ 165,74 e máximo 20%; sem imposto devido R$ 165,74; lançamento de ofício; termo inicial no dia seguinte ao prazo e final no mês da entrega ou do lançamento; não paga no vencimento da notificação emitida pelo PGD é deduzida da restituição com acréscimos"
   }
  ]
 },
 {
  "id": "S-TAB-PROGRESSIVA",
  "nome": "Tabela Progressiva Anual e Mensal (ano-calendário 2025)",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 355; dados também em `docs/mapeamento/tabelas/aliquotas-parametros.json`"
   },
   {
    "campo": "Valores",
    "texto": "- Anual: até 28.467,20 zero; 28.467,21 a 33.919,80 7,5% deduzir 2.135,04; 33.919,81 a 45.012,60 15% deduzir 4.679,03; 45.012,61 a 55.976,16 22,5% deduzir 8.054,97; acima de 55.976,16 27,5% deduzir 10.853,78. Dedução anual por dependente 2.275,08; limite anual de instrução 3.561,50; limite anual do desconto simplificado 16.754,34.\n- Mensal janeiro a abril: até 2.259,20 zero; 2.259,21 a 2.826,65 7,5% deduzir 169,44; 2.826,66 a 3.751,05 15% deduzir 381,44; 3.751,06 a 4.664,68 22,5% deduzir 662,77; acima de 4.664,68 27,5% deduzir 896,00. Isenção previdenciária 65 anos 1.903,98; dependente 189,59; desconto simplificado mensal 564,80.\n- Mensal maio a dezembro: até 2.428,80 zero; 2.428,81 a 2.826,65 7,5% deduzir 182,16; 2.826,66 a 3.751,05 15% deduzir 394,16; 3.751,06 a 4.664,68 22,5% deduzir 675,49; acima de 4.664,68 27,5% deduzir 908,73. Isenção 65 anos 1.903,98; dependente 189,59; desconto simplificado mensal 607,20."
   },
   {
    "campo": "Regras de cálculo afetadas",
    "texto": "imposto anual (ajuste e simplificado), RRA (tabela mensal do mês do recebimento x meses), Saída Definitiva e Final de Espólio (soma de tabelas mensais), Carnê-Leão"
   }
  ]
 },
 {
  "id": "S-TAB-DOLAR",
  "nome": "Tabela de Conversão para Reais do Dólar dos EUA em 2025",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 356"
   },
   {
    "campo": "Valores (compra / venda)",
    "texto": "jan 6,0394 / 6,0400; fev 6,0371 / 6,0377; mar 5,7277 / 5,7283; abr 5,7413 / 5,7419; mai 5,8701 / 5,8707; jun 5,6322 / 5,6328; jul 5,5646 / 5,5652; ago 5,5569 / 5,5576; set 5,3922 / 5,3928; out 5,3202 / 5,3208; nov 5,4458 / 5,4464; dez 5,2946 / 5,2952"
   },
   {
    "campo": "Regras",
    "texto": "cotação do mês do recebimento ou pagamento (já corresponde ao último dia útil da 1ª quinzena do mês anterior); compra para rendimentos e imposto pago; venda para deduções; Atividade Rural usa 5,5018 (compra de 31/12/2025)"
   }
  ]
 },
 {
  "id": "S-TAB-ATUALIZACAO",
  "nome": "Tabela de Atualização do Custo de Bens e Direitos",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 357 e 358"
   },
   {
    "campo": "Regras",
    "texto": "dividir o valor original, na moeda da época, pelo índice do mês/ano da aquisição ou pagamento para obter o valor em reais até 31/12/1995; índices de 1938 a 1995 por moeda (Real 1994-1995; Cruzeiro Real 1993-1994; Cruzeiro 1990-1993 e 1967-1986; Cruzado Novo 1989-1990; Cruzado 1986-1989; Cruzeiro Novo 1967-1970; Mil-Réis 1938-1942); exemplo de índice: jan/1992 720,4779; dez/1995 0,9596"
   }
  ]
 },
 {
  "id": "S-TAB-DEPENDENCIA",
  "nome": "Tabela de Relação de Dependência",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 359; `tabelas/dependentes.json`"
   },
   {
    "campo": "Códigos",
    "texto": "11 cônjuge ou companheiro (filho ou mais de 5 anos); 21 filho ou enteado até 21 anos; 22 filho ou enteado até 24 anos cursando superior ou técnico; 23 filho ou enteado com deficiência, qualquer idade, se remuneração não exceder as deduções legais (ADI 5583); 24 irmão, neto ou bisneto sem arrimo, com guarda judicial, até 21 anos; 25 idem até 24 anos estudando, com guarda até os 21; 26 irmão, neto ou bisneto com deficiência, sem arrimo, com guarda, qualquer idade (ADI 5583); 31 pais, avós e bisavós com rendimentos até R$ 28.467,20 no ano (Ajuste e DFE) ou até a soma dos limites mensais (2.259,20 de janeiro a abril e 2.428,80 de maio a dezembro) dos meses da declaração (DSDP); 41 menor pobre até 21 anos criado, educado e sob guarda judicial; 51 pessoa absolutamente incapaz sob tutela ou curatela"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "idade na data de referência; limite de rendimentos do código 31 varia por tipo de declaração"
   }
  ]
 },
 {
  "id": "S-TAB-BENS",
  "nome": "Tabela de Códigos de Bens e Direitos",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 360 a 362 e 190 a 193; `tabelas/bens-direitos.json`"
   },
   {
    "campo": "Conteúdo",
    "texto": "grupos 01 a 08 e 99 (detalhe em F-BENS-G01 a F-BENS-G99)"
   }
  ]
 },
 {
  "id": "S-TAB-PAGAMENTOS",
  "nome": "Tabela de Códigos de Pagamentos",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 363; `tabelas/pagamentos.json`"
   },
   {
    "campo": "Códigos",
    "texto": "01, 02, 09 a 22, 26, 30, 31, 33, 34, 36, 37, 60, 61, 62, 66, 70, 71, 72, 76, 99 (detalhe em F-PAG-xx)"
   },
   {
    "campo": "Observações",
    "texto": "o JSON tem 42 registros (inclui códigos de doações e outros), a Ajuda lista 31 códigos de pagamento"
   }
  ]
 },
 {
  "id": "S-TAB-DOACOES",
  "nome": "Tabela de Códigos de Doações",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 364"
   },
   {
    "campo": "Códigos",
    "texto": "40, 41, 42, 43, 44, 45, 46, 47, 80, 81, 99 (detalhe em F-DOA-xx)"
   }
  ]
 },
 {
  "id": "S-ERROS-FREQ",
  "nome": "Erros mais Frequentes (orientação)",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 422 a 424"
   },
   {
    "campo": "Regras",
    "texto": "- Valores: o programa não usa ponto como separador de centavos (1234.56 vira R$ 123.456,00); sem casas decimais acrescenta \",00\".\n- CNPJ da fonte pagadora ausente ou inválido impede a gravação.\n- Omitir rendimentos (aposentadoria, ações trabalhistas, várias fontes, mesmo sem retenção) leva à malha.\n- Valores diferentes do comprovante: não subtrair isentos dos tributáveis; IRRF do 13º não se soma ao IRRF dos rendimentos.\n- Fapi recebido é tributável integral sem parcela isenta; previdência privada integral observadas as isenções.\n- Na conjunta, rendimentos do cônjuge vão na aba Dependentes.\n- Carnê-Leão pago: só Darf 0190 (quotas 0211 não entram).\n- Isenção de 65 anos: limite mensal de R$ 1.903,98 inclusive 13º, somadas todas as fontes; na conjunta, soma dos limites de cada um se ambos elegíveis; excedente transferível para Rendimentos PJ.\n- Prêmios de loteria e capitalização vão em Tributação Exclusiva (imposto não restituível).\n- CPF/CNPJ do beneficiário em Pagamentos e Doações obrigatório e válido, senão a declaração não é gravada.\n- Doação a entidade assistencial não é dedutível.\n- Imposto Complementar: só Darf 0246."
   }
  ]
 },
 {
  "id": "S-REQUISITOS",
  "nome": "Requisitos e instalação do programa oficial",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda págs. 394 e 395"
   },
   {
    "campo": "Regras",
    "texto": "roda em Linux, Windows (10 ou superior recomendado) e Mac; Java embutido; Receitanet incorporado (não precisa instalar à parte); navegador necessário; impressora recomendada para o recibo; resolução 1280x768 ou maior; instalado em \"Arquivos de Programas RFB\" no Windows; não roda em rede (sem controle de concorrência)"
   }
  ]
 },
 {
  "id": "S-PROBLEMAS-IMPRESSAO",
  "nome": "Problemas na Impressão (orientação)",
  "fonte": "docs/mapeamento/notas/07-saida-tabelas-erros.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ajuda pág. 425"
   },
   {
    "campo": "Regras",
    "texto": "trocar modo rascunho por normal; trocar o driver do fabricante pelo do sistema ou vice-versa; atualizar o driver"
   }
  ]
 },
 {
  "id": "M-MENU-DECLARACAO",
  "nome": "Menu Declaração",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "barra de menu (Alt+D) e seção \"Declaração\" da barra lateral"
   },
   {
    "campo": "Itens",
    "texto": "Nova, Abrir, Fechar, Excluir, Retificar, Verificar Pendências, Entregar Declaração, Imprimir (submenu), Salvar On-line, Recuperar On-line, Sair do Programa (detalhados em M-DECL-*)"
   }
  ]
 },
 {
  "id": "M-MENU-IMPORTACOES",
  "nome": "Menu Importações",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "barra de menu (Alt+P) e seção \"Importações\" da barra lateral"
   },
   {
    "campo": "Itens",
    "texto": "Carnê-Leão 2025, Atividade Rural 2025, Ganhos de Capital 2025, Informe de Rendimentos, Informe de Plano de Saúde (pág. 389)"
   }
  ]
 },
 {
  "id": "M-MENU-FICHAS",
  "nome": "Menu Fichas e navegação",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "barra de menu (Alt+F); barra lateral com grupos expansíveis (Declaração, Demonstrativos, Resumo, Impressão, Ferramentas, Ajuda); pág. 370 e 404"
   },
   {
    "campo": "Itens",
    "texto": "Fichas da Declaração; Demonstrativos (Atividade Rural, Ganhos de Capital, Renda Variável); Resumo da Declaração"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "Tab ou Enter avança campo; Shift+Tab retorna; Alt+PgUp/PgDn navega meses nas grades mensais"
   }
  ]
 },
 {
  "id": "M-MENU-FERRAMENTAS",
  "nome": "Menu Ferramentas",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "barra de menu (Alt+T) e barra lateral"
   },
   {
    "campo": "Itens",
    "texto": "Cópia de Segurança (Gravar, Restaurar), Calculadora, Verificar Atualizações, Recuperação de Nomes (Ativar/Desativar, Limpar); demais ações do pacote `acoes` sem citação na Ajuda estão em M-FERR-* (inferido)"
   }
  ]
 },
 {
  "id": "M-MENU-AJUDA",
  "nome": "Menu Ajuda",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "barra de menu (Alt+J); pág. 367"
   },
   {
    "campo": "Itens",
    "texto": "Conteúdo (Alt+Shift+C); Instruções de Preenchimento (Alt+Shift+I); Como Fazer para... (Alt+Shift+F); Perguntas e Respostas (Alt+Shift+G); Perguntas mais Frequentes (Alt+Shift+R); Sobre o IRPF 2026 (Alt+Shift+S); Ajuda de Acessibilidade (F11); fechar Ajuda (Alt+F4)"
   }
  ]
 },
 {
  "id": "M-TOOLBAR",
  "nome": "Barra de ferramentas",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "topo da janela (classes JIRPFToolbar e JIRPFToolbarCustom, toolbar personalizável inferido)"
   },
   {
    "campo": "Itens",
    "texto": "ícones de Nova, Abrir, Fechar, Excluir, Importar declaração 2025, Pré-preenchida, Verificar Pendências, Entregar, Imprimir (com itens), Calculadora, Ajuda (págs. 371 a 388)"
   }
  ]
 },
 {
  "id": "M-RODAPE-COMPARATIVO",
  "nome": "Painel de imposto e comparativo no rodapé",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "parte inferior da tela abaixo da barra lateral (FAQ pág. 419); telas PainelImpostoPagar, PainelComparativo; classe ComparativoAction"
   },
   {
    "campo": "Campos",
    "texto": "imposto a pagar ou a restituir nas duas formas (deduções legais e desconto simplificado) atualizado durante o preenchimento"
   }
  ]
 },
 {
  "id": "M-INICIAL-NOVA",
  "nome": "Aba \"Nova\" (tela \"O que você deseja fazer?\")",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "tela de entrada; págs. 39 e 371; telas PainelIRPFNovaDeclaracao, PainelCriarNovaDeclaracao, SubPainelDeclaracaoAnoAnterior, SubPainelDeclaracaoPrePreenchida, SubPainelDeclaracaoEmBranco, PainelImagemNovaDeclaracaoAjuste/Espolio/Saida"
   },
   {
    "campo": "Campos",
    "texto": "tipo (Ajuste Anual, Final de Espólio, Saída Definitiva); modo: Iniciar a partir da Pré-Preenchida (\"Declaração própria\" ou \"Declaração por procuração\", com CPF do declarante), Iniciar Importando Declaração de 2025 (pasta e unidade), Iniciar em Branco (CPF e Nome)"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "pré-preenchida exige login gov.br Ouro ou Prata; rendimentos de dependentes na pré-preenchida exigem procuração eletrônica ou autorização no Meu Imposto de Renda"
   }
  ]
 },
 {
  "id": "M-INICIAL-EMPREENCH",
  "nome": "Aba \"Em Preenchimento\"",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "tela de entrada; telas PainelDeclaracoesPreenchimento, SubpainelDeclaracoesPreenchimento, PainelPesquisaPorNome"
   },
   {
    "campo": "Campos",
    "texto": "pesquisa por nome; lista de declarações; ícones Abrir, Excluir, Entregar, Imprimir, Gravar Cópia de Segurança"
   }
  ]
 },
 {
  "id": "M-INICIAL-TRANSMITIDAS",
  "nome": "Aba \"Transmitidas\"",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "tela de entrada; telas PainelDeclaracoesTransmitidas, SubpainelDeclaracoesTransmitidas"
   },
   {
    "campo": "Campos",
    "texto": "pesquisa por nome; ícones Abrir, Retificar, Imprimir (Declaração, Recibo, Darf do IRPF), Gravar Cópia de Segurança e Recibo; símbolo de transmitida"
   }
  ]
 },
 {
  "id": "M-INICIAL-BOASVINDAS",
  "nome": "Aba \"Boas-vindas\", links úteis e \"Entrar com gov.br\"",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "tela de entrada; telas PainelAbaBemVindos, PainelIRPFBemVindos, PainelBemVindoToolTip"
   },
   {
    "campo": "Campos",
    "texto": "mensagens, dicas, novidades; links úteis; botão Entrar com gov.br"
   }
  ]
 },
 {
  "id": "M-DECL-NOVA",
  "nome": "Declaração > Nova",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "menu, barra lateral, ícone, aba Nova, Ctrl+N; pág. 371"
   }
  ]
 },
 {
  "id": "M-DECL-ABRIR",
  "nome": "Declaração > Abrir",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "menu, barra lateral, ícone, aba Em Preenchimento, Ctrl+B; pág. 377; tela PainelAbrirDeclaracao"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "lista em ordem alfabética de nomes; botão imprimir relação; só uma declaração aberta por vez (abrir outra fecha a atual); mostra símbolo e nº do recibo se transmitida"
   }
  ]
 },
 {
  "id": "M-DECL-FECHAR",
  "nome": "Declaração > Fechar",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "menu, barra lateral, ícone, Ctrl+F; pág. 377"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "não precisa salvar, dados gravados ao digitar; diferente de Sair do Programa"
   }
  ]
 },
 {
  "id": "M-DECL-EXCLUIR",
  "nome": "Declaração > Excluir",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "menu, barra lateral, ícone, aba Em Preenchimento, Ctrl+E; pág. 378; tela PainelExcluirDeclaracao"
   },
   {
    "campo": "Campos",
    "texto": "seleção de uma ou várias (Ctrl, Shift), em preenchimento e transmitidas"
   }
  ]
 },
 {
  "id": "M-DECL-RETIFICAR",
  "nome": "Declaração > Retificar",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "barra lateral, aba Transmitidas (ícone), ficha Identificação \"Declaração retificadora\", Ctrl+G; pág. 378; tela PainelRetificarDeclaracao"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "lista de transmitidas; retificadora exige nº do recibo da anterior (12 dígitos)"
   }
  ]
 },
 {
  "id": "M-DECL-PENDENCIAS",
  "nome": "Declaração > Verificar Pendências",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "menu, barra lateral, ícone, F5; págs. 379 e 414; telas PainelVerificarPendencias, PainelVerificarPendenciasAcessivel, PainelPendencias"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "só com declaração aberta; ERROS impedem a entrega (ex.: data de nascimento em branco ou inválida); AVISOS não impedem (ex.: título eleitoral em branco, \"Valor do bem não foi informado, item nº xxx\"); clicar na pendência leva ao campo; catálogo de mensagens do programa em `Mensagens.properties` (727 chaves, ex.: \"Número de inscrição no CPF não pode ser o mesmo do titular\", \"A declaração não possui Avisos e Erros impeditivos\")"
   }
  ]
 },
 {
  "id": "M-DECL-ENTREGAR",
  "nome": "Declaração > Entregar Declaração",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "menu, barra lateral (também no rodapé do menu lateral com declaração aberta), ícone, aba Em Preenchimento, Ctrl+I; com certificação digital Ctrl+Shift+B; sem certificação digital Ctrl+Shift+E; págs. 382 e 420; telas PainelGravarEntrega, PainelGravarTransmitir, PainelGravarTransmitirPendenciasNaoImpeditivas, PainelGravacaoEntregaPendenciasNaoImpeditivas, PainelGravacaoEntregaModeloMelhor, PainelInformaRegimeTributacao, PainelDadosRestituicao, PainelDadosDebitoAutomatico; ações GravarEntregaAction e TransmitirDeclaracaoAction"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "verifica pendências antes; erros bloqueiam; avisos permitem; aviso de modelo de tributação mais vantajoso (inferido pelo nome PainelGravacaoEntregaModeloMelhor); confirma regime, dados de restituição e débito automático (inferido pelos nomes de tela); recibo gravado automaticamente e disponível na aba Transmitidas; única forma de apresentação é a Internet, sem programa adicional (Receitanet incorporado)"
   }
  ]
 },
 {
  "id": "M-DECL-SALVAR-ONLINE",
  "nome": "Declaração > Salvar On-line (F6)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "atalho F6 (atalhos.txt); ação SalvarOnlineAction; serviço `salvarDecOnline` do barramento"
   },
   {
    "campo": "Regras",
    "texto": "guarda a declaração em preenchimento na nuvem da RFB vinculada à conta gov.br (inferido pelo nome do serviço)"
   }
  ]
 },
 {
  "id": "M-DECL-RECUPERAR-ONLINE",
  "nome": "Declaração > Recuperar On-line (F7)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "atalho F7; ação RecuperarDecOnlineAction; tela PainelRecuperarDeclaracaoOnline; serviço `recuperarDecOnline`"
   }
  ]
 },
 {
  "id": "M-DECL-SAIR",
  "nome": "Declaração > Sair do Programa",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "menu, Alt+F4; pág. 387"
   }
  ]
 },
 {
  "id": "M-DECL-CONVERTER",
  "nome": "Converter declaração (inferido)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ação ConverterDeclaracaoAction (sem citação na Ajuda)"
   },
   {
    "campo": "Regras",
    "texto": "provável conversão entre tipos de declaração (por exemplo, ajuste para saída ou espólio) ou entre modelos (inferido)"
   },
   {
    "campo": "Observações",
    "texto": "confirmar no programa\n---"
   }
  ]
 },
 {
  "id": "M-IMPR-DECLARACAO",
  "nome": "Imprimir Declaração",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+P; págs. 378 e 415; telas PainelImprimirDeclaracao, PainelSelecaoTipoImpressao, PainelSelecaoTipoImpressaoNova; relatórios DIRPF2026, FolhaDeRosto e 60 sub-relatórios por ficha (relDeclaracao*)"
   },
   {
    "campo": "Campos",
    "texto": "Toda a declaração ou Partes da declaração (seleção de fichas, inclusive Ganhos de Capital); Visualizar; salvar em PDF (SalvarImagemDeclaracaoAction)"
   }
  ]
 },
 {
  "id": "M-IMPR-REND-PF",
  "nome": "Imprimir Rendimentos Recebidos de PF",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+Shift+F; pág. 379; tela PainelImprimirRendimentosRecebidosPF; relatórios relDeclaracaoRendimentosTributaveisPF*"
   },
   {
    "campo": "Campos",
    "texto": "escolha da declaração; visualizar; PDF"
   }
  ]
 },
 {
  "id": "M-IMPR-RECIBO",
  "nome": "Imprimir Recibo de Entrega",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+R; págs. 383 e 421; tela PainelImprimirRecibo; relatório relRecibo; ação SalvarImagemReciboAction"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "só após a apresentação; recibo de uma via com duas páginas; nº do recibo de 12 dígitos na folha 2; impressão em outro computador via cópia \"última declaração entregue e recibo\""
   }
  ]
 },
 {
  "id": "M-IMPR-DARF",
  "nome": "Imprimir Darf do IRPF",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+D; aba Transmitidas; págs. 385 e 415; telas PainelImprimirDARFCodigoBarras, PainelImprimirDARFEscolherCota; relatório relDarfCodBarra; serviço `obterPdfDarfQuota`"
   },
   {
    "campo": "Campos",
    "texto": "escolha da quota (todas, inclusive em atraso, com Selic desde 01/06/2026 e multa de 0,33% ao dia até 20%); visualizar e PDF"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "valor mínimo impresso R$ 10,00; quotas de retificadora com mudança de imposto: emitir no e-CAC (Meu Imposto de Renda, Consultar Débitos, Emitir DARF e Alterar Quotas); todos os Darf têm código de barras"
   }
  ]
 },
 {
  "id": "M-IMPR-DARF-MAED",
  "nome": "Imprimir Darf de Multa por Atraso na Entrega",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+U; pág. 385; tela PainelImprimirDARFMaed; relatórios relDarfMulta, relNotificacao, relNotificacaoEspolio, relNotificacaoSaida; serviços `obterPdfDarfMaed` e `obterPdfDarfMaedEspolio`"
   }
  ]
 },
 {
  "id": "M-IMPR-DARF-ECA",
  "nome": "Imprimir Darf, Doações Diretamente na Declaração, ECA",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+W; pág. 386; tela PainelImprimirDarfECA; relatório relDarfDoacaoECA; serviço `obterPdfDarfECA`"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "código 3351; valor mínimo R$ 10,00"
   }
  ]
 },
 {
  "id": "M-IMPR-DARF-IDOSO",
  "nome": "Imprimir Darf, Doações Diretamente na Declaração, Pessoa Idosa",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+Y; pág. 386; tela PainelImprimirDarfEstatutoIdoso; relatório relDarfDoacaoEstatutoIdoso; serviço `obterPdfDarfIdoso`"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "código 9090; valor mínimo R$ 10,00"
   }
  ]
 },
 {
  "id": "M-IMPR-RELACAO",
  "nome": "Imprimir Relação de Declarações",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+L; pág. 387; tela PainelImprimirRelacaoDeclaracoes; relatório relDeclaracoes"
   },
   {
    "campo": "Campos",
    "texto": "relação das declarações em preenchimento e transmitidas, ordenável por tipo, modelo, nome ou CPF"
   }
  ]
 },
 {
  "id": "M-IMPR-COMUNICACAO-SAIDA",
  "nome": "Imprimir Comunicação à Fonte Pagadora de Saída do País",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+Shift+S; pág. 387; tela PainelImprimirComunicacaoSaida; relatórios relComunicacaoSaida, relComunicacaoSaidaDetalhe; campo DT_COMUNICACAO_SAIDA no registro 21 (inferido: data da comunicação por fonte pagadora)"
   }
  ]
 },
 {
  "id": "M-IMPR-INFORME-REND",
  "nome": "Imprimir Informe de Rendimentos (arquivo XML da fonte)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+Alt+R; págs. 391 e 402; relatórios relInformeRendimentosPJ*"
   },
   {
    "campo": "Campos",
    "texto": "seleção do XML; Visualizar ou Imprimir"
   }
  ]
 },
 {
  "id": "M-IMPR-INFORME-PS",
  "nome": "Imprimir Informe de Plano de Saúde",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ctrl+Alt+I; págs. 392 e 402; relatórios relInformePlanoSaude*"
   }
  ]
 },
 {
  "id": "M-IMPR-DARF-AUXILIO",
  "nome": "Darf de devolução do Auxílio Emergencial (inferido)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ações ImprimirDarfAuxilioEmergencialAction; telas PainelImprimirDarfAuxilioEmergencial, PainelMensagemAuxilioEmergencial; relatórios relDarfAuxilio, relDarfAuxilioEmergencial; serviço `calcularMultaJurosDarfAuxilio`"
   },
   {
    "campo": "Regras",
    "texto": "funcionalidade herdada de exercícios anteriores; a Ajuda 2026 não a descreve"
   }
  ]
 },
 {
  "id": "M-IMPR-CRITERIOS-OBRIG",
  "nome": "Impressão de critérios de obrigatoriedade (inferido)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "tela PainelImprimirCriteriosObrigatoriedade; relatório relNotificacaoCondicoesObrigatoriedade"
   }
  ]
 },
 {
  "id": "M-IMPR-SALVAR-PDF",
  "nome": "Visualizar e salvar em PDF",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ações SalvarImagemDeclaracaoAction, SalvarImagemReciboAction, SalvarImagemDarfCodBarrasAction, SalvarImagemDarfECAAction, SalvarImagemDarfMultaAction, SalvarImagemRelacaoDeclaracoesAction, SalvarImagemComunicacaoSaidaAction"
   }
  ]
 },
 {
  "id": "M-IMP-ANO-ANTERIOR",
  "nome": "Importar dados da Declaração de 2025",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ícone da barra de ferramentas; aba Nova \"Iniciar Importando Declaração de 2025\"; ação ImportarAnoAnteriorAction; págs. 373, 396 e 397; tela PainelImportarProgramasIRPF, PainelResultadoImportacao(oes)"
   },
   {
    "campo": "Campos",
    "texto": "unidade e pasta de origem; seleção de um, alguns ou todos os CPF; lista automática das transmitidas na pasta padrão do IRPF2025"
   },
   {
    "campo": "Dados recuperados",
    "texto": "Identificação (todos); dependentes e alimentandos (nome, CPF, nascimento); fontes pagadoras PJ (CNPJ/CPF e nome); Pagamentos (nome e CPF/CNPJ do beneficiário); bens e dívidas com Situação 31/12/2024 diferente de zero (código, discriminação, localização, país, valor); imóveis rurais explorados (todos os dados); bens da AR (código e discriminação); estoque final do rebanho; dívidas rurais; saldo de prejuízo rural (Como fazer pág. 373, embora a nota 06 diga que o prejuízo não é importado: divergência); nº do recibo de 2025 se importado do arquivo transmitido ou da cópia \"última declaração transmitida e recibo\""
   },
   {
    "campo": "Validações conhecidas",
    "texto": "aceita arquivo gravado para entrega, transmitido ou cópia da última transmitida com recibo; nome do arquivo `CPF-IRPF-A-2025-2024-ORIGI.DEC` (A ajuste, E espólio, S saída; ORIGI ou RETIF); apaga dados já digitados do CPF (com aviso); campos importados editáveis; relatório de importadas e não importadas"
   }
  ]
 },
 {
  "id": "M-IMP-PREPREENCHIDA",
  "nome": "Importar Declaração Pré-Preenchida",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ícone; aba Nova \"Iniciar a partir da Pré-Preenchida\"; ação ImportarPrepreenchidaAction; págs. 374, 398 e 399; serviço `obterPrePreenchida`"
   },
   {
    "campo": "Dados recuperados",
    "texto": "cadastro CPF; dados da declaração de 2025 (identificação, dependentes, fontes, pagamentos, bens, recibo); informações de 2025 de eSocial, EFD-Reinf, Dmed, Dimob, Carnê-Leão (rendimentos do profissional e pagamentos dos clientes), e-Financeira, DOI, DBF, criptoativos (IN RFB 1.888/2019) e convênios"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "gov.br Ouro ou Prata; uso opcional; apaga dados já digitados (com aviso); conferência e completude são responsabilidade do contribuinte; dependentes exigem procuração"
   }
  ]
 },
 {
  "id": "M-IMP-INFORME-REND",
  "nome": "Importar Informe de Rendimentos",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Importações > Informe de Rendimentos; \"Importar arquivo da fonte pagadora\" no rodapé de Rendimentos PJ (Alt+I); Ctrl+Shift+R; ação ImportarInformeRendimentosAction; págs. 390 e 400; telas do pacote `declaracao.assistida.informerendimentos` (pré-visualização por item: Rend. PJ, Exigibilidade Suspensa, RRA, Pensão, Previdência Complementar, Pagamentos, Isentos ou Exclusivos)"
   },
   {
    "campo": "Dados recuperados",
    "texto": "total de rendimentos (inclusive férias); contribuição previdenciária oficial; IRRF; 13º; previdência complementar; pensão alimentícia; isentos (65 anos, moléstia grave, lucros e dividendos, sócio de ME/EPP, indenizações e PDV, benefícios indiretos e reembolsos Voluntários da Copa, bolsas de médico e não médico, IRRF compensado de anos anteriores, diárias, ajuda de custo, abono pecuniário); exclusivos; RRA; exigibilidade suspensa"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "layout público da RFB (xsd `informe_fontes_pagadoras.xsd`, `informe_tipos.xsd`); só adiciona; cada informe uma única vez (repetir duplica); conferência do contribuinte"
   }
  ]
 },
 {
  "id": "M-IMP-INFORME-PS",
  "nome": "Importar Informe de Plano de Saúde",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Importações; rodapé de Pagamentos; Ctrl+Shift+I; ação ImportarInformePlanoSaudeAction; págs. 391 e 401"
   }
  ]
 },
 {
  "id": "M-IMP-CARNE-LEAO",
  "nome": "Importar Carnê-Leão 2025",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Importações > Carnê-Leão 2025 (Ctrl+Shift+C); botão na ficha PF/Exterior (Alt+I); ação ImportarCarneLeaoAction; telas PainelImportacaoCarneLeao, PainelLoginGovBrOuCodigoAcesso, PainelSolicitarCodigoAcesso, PainelInformarVersaoCarneLeao; serviços `importarCarneLeaoComLoginGovBr` e `importarCarneLeaoComCodigoAcesso`"
   },
   {
    "campo": "Regras",
    "texto": "dados do Carnê-Leão Web do titular e de dependentes (CPF na ficha Dependentes); autenticação por gov.br ou código de acesso (inferido pelos nomes); não sobrescreve CNPJ já presente em Rendimentos PJ nem imposto pago no exterior já informado (nota 02)"
   }
  ]
 },
 {
  "id": "M-IMP-AR",
  "nome": "Importar Atividade Rural 2025",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Importações (Ctrl+Shift+A); botão Importar em Receitas e Despesas; ação ImportarAtividadeRuralAction"
   }
  ]
 },
 {
  "id": "M-IMP-GCAP",
  "nome": "Importar Ganhos de Capital 2025",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Importações (Ctrl+Shift+G); botão Importar em cada tela do demonstrativo; ação ImportarGCAPAction; FAQ págs. 409 a 411"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "só arquivo \"Exportar para o IRPF2026\" do GCAP2025 (não cópia de segurança, que pode ter erros); arquivo do CPF da declaração ou de dependente cadastrado; nova importação do mesmo CPF substitui todos os dados de GCAP daquele CPF (outros CPF intactos); excluir o dependente exclui seu GCAP; GCAP2026 não importa no IRPF2026; para alterar, corrigir no GCAP2025, exportar e reimportar; o demonstrativo só é preenchido por importação; impressão pelo GCAP ou por Imprimir > Partes > Ganhos de Capital"
   }
  ]
 },
 {
  "id": "M-IMP-SUGESTAO",
  "nome": "Sugestão de importação (inferido)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ação SugereImportacaoAction; tela PainelConfirmacaoImportacao"
   },
   {
    "campo": "Regras",
    "texto": "provável oferta automática de importar a declaração anterior encontrada na pasta padrão (inferido, coerente com pág. 373)"
   }
  ]
 },
 {
  "id": "M-FERR-COPIA-GRAVAR",
  "nome": "Gravar Cópia de Segurança",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ferramentas > Cópia de segurança > Gravar; barra lateral Gravar Cópia; abas Em Preenchimento e Transmitidas; Ctrl+K; págs. 380 e 418; telas PainelGravarCopiaSeguranca, PainelGravarCopiaSegurancaPasso2, PainelGravarCopiaDeclaracaoTransmitida"
   },
   {
    "campo": "Campos",
    "texto": "tipo: \"Cópia da declaração com os dados atuais\" (estado atual, sem recibo, não serve para entrega); \"Cópia da declaração para entrega à RFB\" (arquivo transmissível depois pelo Receitanet); \"Cópia da última declaração entregue e do recibo de entrega\" (declaração transmitida e recibo; importável no IRPF2027; permite imprimir o recibo em outro computador); seleção de uma, algumas ou todas; unidade e pasta de destino"
   }
  ]
 },
 {
  "id": "M-FERR-COPIA-RESTAURAR",
  "nome": "Restaurar Cópia de Segurança",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ferramentas > Cópia de Segurança > Restaurar; barra lateral Restaurar; Ctrl+T; págs. 381 e 418"
   },
   {
    "campo": "Validações conhecidas",
    "texto": "lista por CPF em ordem crescente; restaurar sobre declaração existente substitui todos os dados (com alerta); transmitidas também podem ser restauradas"
   }
  ]
 },
 {
  "id": "M-FERR-CALCULADORA",
  "nome": "Calculadora",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ferramentas > Calculadora; ícone; Ctrl+Alt+A; pág. 388; telas CalculadoraForm, DisplayForm, HistoricoForm, TecladoForm, CancelarTransporteForm"
   },
   {
    "campo": "Regras",
    "texto": "botão transportar leva o valor ao campo numérico"
   }
  ]
 },
 {
  "id": "M-FERR-ATUALIZACOES",
  "nome": "Verificar Atualizações",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ferramentas > Verificar Atualizações; Alt, T, V; automática ao abrir; pág. 367; telas PainelVerificarAtualizacao, PainelAvisoVerificarAtualizacoes, PainelDownloadAtualizacoes; ação VerificarNovaVersaoAction"
   },
   {
    "campo": "Regras",
    "texto": "atualização opcional ou obrigatória (obrigatória impede a entrega); reinicia o programa; se falhar, download manual"
   }
  ]
 },
 {
  "id": "M-FERR-RECNOMES",
  "nome": "Recuperação de Nomes (Ativar/Desativar, Limpar)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "Ferramentas > Recuperação de Nomes; Alt, T, R, T (ativar) e Alt, T, R, L (limpar); pág. 368; ações AtivarRecuperarNomesAction, LimparCacheNomesAction"
   },
   {
    "campo": "Regras",
    "texto": "preenche Nome a partir de CPF/CNPJ já digitados ou importados (cache local, não vem da RFB); ativado por padrão"
   }
  ]
 },
 {
  "id": "M-FERR-LOGIN-GOVBR",
  "nome": "Entrar e sair com gov.br",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "botão na tela inicial; ações LoginGovAction, LogoutGovAction; telas PainelProcessaLogin, PainelCaptchaAb; serviços de captcha, token e UsuarioLogado"
   }
  ]
 },
 {
  "id": "M-FERR-PAGINAS",
  "nome": "Links para páginas da RFB (IRPF, DTE) e navegador",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ações PaginaIRPFAction, PaginaDTEAction, AbrirNavegadorAction (inferido: abrem páginas do IRPF e do Domicílio Tributário Eletrônico)"
   }
  ]
 },
 {
  "id": "M-FERR-MEMORIA",
  "nome": "Memória do IRPF (inferido)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ação MemoriaIRPFAction (sem citação na Ajuda)"
   }
  ]
 },
 {
  "id": "M-FERR-LEAOZINHO",
  "nome": "Assistente \"Leãozinho\" (inferido)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ação LeaozinhoAction (sem citação na Ajuda)"
   }
  ]
 },
 {
  "id": "M-FERR-AVALIACAO",
  "nome": "Avaliação do programa (inferido)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ação HabilitarAvaliacaoAction; tela PainelAvisoAvaliacao"
   }
  ]
 },
 {
  "id": "M-FERR-INFO-CALCULO",
  "nome": "Constantes de cálculo (inferido, tela de testes)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "tela PainelInfoConstantesCalculo do pacote `testes`"
   }
  ]
 },
 {
  "id": "M-AJUDA-CONTEXTUAL",
  "nome": "Ajuda de campo (F1) e textos em azul",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "F1 em qualquer campo; links internos; págs. 366 e 417; na ficha Resumo, F1 indica a procedência dos valores (pág. 413)"
   }
  ]
 },
 {
  "id": "M-AJUDA-DOCUMENTOS",
  "nome": "Conteúdo, Instruções, Como Fazer, Perguntas e Respostas, FAQ",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "menu Ajuda; botões da janela de ajuda (Guardar como, Imprimir, Procurar, painel de utilitários, navegação de páginas, zoom)"
   }
  ]
 },
 {
  "id": "M-AJUDA-ATALHOS",
  "nome": "Exibir atalhos",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ação ExibirAtalhosPGDIRPFAction; AtalhosIRPF.pdf"
   }
  ]
 },
 {
  "id": "M-AJUDA-ACESSIBILIDADE",
  "nome": "Acessibilidade (F11) e leitura de tela",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ação AjudaAcessibilidadeAction; telas PainelAjudaAcessibilidade, PainelAjudaLeituraTela, versões acessíveis de pendências e imposto a pagar; pág. 387"
   },
   {
    "campo": "Regras",
    "texto": "menus acessíveis pela tecla Alt; conteúdo específico por ficha com F11"
   }
  ]
 },
 {
  "id": "M-AJUDA-SOBRE",
  "nome": "Sobre, Novidades, Tutorial",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ações SobreAction, NovidadesAction, TutorialAction; telas PainelSobre, PainelCreditos, PainelNovidades, PainelSplash"
   }
  ]
 },
 {
  "id": "M-DEMO-ACOES",
  "nome": "Novo, Abrir, Fechar, Excluir e Retificar Demonstrativo (inferido)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "ações NovoDemonstrativoAction, AbrirDemonstrativoAction, FecharDemonstrativoAction, ExcluirDemonstrativoAction, RetificarDemonstrativoAction; listener DemonstrativoListener; tela PainelImprimirDARFCodigoBarrasDemonstrativoAberto; tela gcap PainelAlienacaoAnosAnteriores"
   },
   {
    "campo": "Regras",
    "texto": "provável ciclo de vida de demonstrativos de apuração de ganhos de capital (GCAP 2026, do ano corrente, com Darf de código de barras) dentro do PGD, além da importação do GCAP 2025 (inferido; a Ajuda 2026 só descreve a importação)"
   },
   {
    "campo": "Observações",
    "texto": "confirmar no programa\n---"
   }
  ]
 },
 {
  "id": "D-CL-GERAL",
  "nome": "Escrituração do Carnê-Leão importada (titular e dependentes)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "módulo `irpf-gui-carne-leao.jar`, telas PainelDadosEscrituracaoTitular, PainelDadosEscrituracaoMensalTitular, PainelAbaLancamentosEscrituracaoTitular, PainelAbaEscrituracaoDetalheTitular, PainelDadosEscrituracaoDependente, PainelDadosEscrituracaoMensalDependentes, PainelAbaSelecaoEscrituracaoDependentes, PainelAbaLancamentosEscrituracaoDependentes(Detalhe), PainelAbaRendPFTitular, PainelAbaRendPFDependentesLista(Detalhe), PainelAbaSelecaoDependente"
   },
   {
    "campo": "Regras",
    "texto": "a ficha Rendimentos Tributáveis de PF e do Exterior recebe os totais mensais do Carnê-Leão Web (rendimentos, deduções, livro Caixa, imposto pago 0190); lançamentos de escrituração mensal e por pagador (CPF do titular do pagamento e do beneficiário, registro 49 do layout); seleção de dependente para importar (inferido pelos nomes)"
   }
  ]
 },
 {
  "id": "D-CL-PROGRAMA",
  "nome": "Programa Carnê-Leão (e-CAC)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "FAQ pág. 405"
   },
   {
    "campo": "Regras",
    "texto": "apura imposto mensal, calcula limites, imprime Darf, escritura livro Caixa, grava dados para a DAA; acesso pelo e-CAC, Meu Imposto de Renda, Declarações, Acessar Carnê-Leão"
   }
  ]
 },
 {
  "id": "F-CONJUGE",
  "nome": "Informações do Cônjuge ou Companheiro (inferido)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "relatório relDeclaracaoConjuge; layout registro 29 (NR_CONJ, VR_BASE, VR_IMPOSTO, VR_ISENTO, VR_EXCLUSIVO, VR_RENDPJ_EXIB_SUSP, VR_TOTALCONJ)"
   },
   {
    "campo": "Aplica-se a",
    "texto": "declaração em separado com cônjuge informado na Identificação (inferido)"
   },
   {
    "campo": "Campos",
    "texto": "CPF do cônjuge; base de cálculo do imposto, imposto pago ou retido, rendimentos isentos, rendimentos exclusivos, rendimentos com exigibilidade suspensa e total de rendimentos do cônjuge (inferido pelos nomes)"
   },
   {
    "campo": "Observações",
    "texto": "lacuna da Ajuda\n---"
   }
  ]
 },
 {
  "id": "S-SALVAMENTO",
  "nome": "Salvamento automático",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "pág. 376; componente HoraSalvamentoPanel"
   },
   {
    "campo": "Regras",
    "texto": "dados salvos à medida que são digitados; sem risco de perda ao fechar ou em falta de energia"
   }
  ]
 },
 {
  "id": "S-UMA-ABERTA",
  "nome": "Uma declaração aberta por vez e base local",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 377 e 403"
   },
   {
    "campo": "Regras",
    "texto": "abrir outra fecha a atual; base em pasta do programa; transmitidas em `...\\IRPF2026\\Transmitidas`"
   }
  ]
 },
 {
  "id": "S-GRAVAR-ENTREGA",
  "nome": "Gravação da declaração para entrega (arquivo .DEC)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 382 e 419; ação GravarEntregaAction; classe GravadorTXT (gravarDeclaracao, montaNomeArquivoTXT)"
   },
   {
    "campo": "Regras",
    "texto": "só sem erros impeditivos; nome do arquivo `CPF-IRPF-<A|E|S>-2026-2025-<ORIGI|RETIF>.DEC` (padrão do FAQ para 2025, inferido para 2026); pode ir para mídia removível via cópia \"para entrega\""
   }
  ]
 },
 {
  "id": "S-TRANSMISSAO",
  "nome": "Transmissão (Receitanet incorporado)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 395, 420; atalhos Ctrl+Shift+B (com certificado) e Ctrl+Shift+E (sem certificado); pacotes `serpro.receitanet`, `formatosexternos.transmissao` (RecnetAdaptor), `serpro.hash`, `nuvem.util.certificadodigital`"
   },
   {
    "campo": "Regras",
    "texto": "única forma é a Internet; com ou sem certificado digital; recibo gravado na pasta Transmitidas; prazo até 23h59min59s de 29/05/2026"
   }
  ]
 },
 {
  "id": "S-RECIBO",
  "nome": "Recibo de entrega e número do recibo",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 383, 403, 405; layout registros HR, DR, R9, HC, RC, NC, VC, MC, TC; relatório relRecibo"
   },
   {
    "campo": "Regras",
    "texto": "recibo de 12 dígitos usado para retificar e como segurança na declaração seguinte; ausência do recibo de 2025 não impede a entrega"
   }
  ]
 },
 {
  "id": "S-NOTIFICACAO-MAED",
  "nome": "Notificação de lançamento da multa por atraso emitida pelo PGD",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "págs. 32, 353; layout registro NC (notificação de multa: delegado, unidade, vencimento, meses); relatórios relNotificacao*"
   }
  ]
 },
 {
  "id": "S-VALIDADOR",
  "nome": "Dados do validador e mensagens pós-recepção",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "layout registros VC (pendência, quantidade de retificadoras, débito, saldo de restituição, Darf) e MC (mensagem)"
   },
   {
    "campo": "Regras",
    "texto": "informações devolvidas na recepção da declaração (inferido pelos nomes)"
   }
  ]
 },
 {
  "id": "S-CALAMIDADE",
  "nome": "Contribuintes de municípios em calamidade (RS 2024)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "tabela `municipiosCalamidade.xml` (399 municípios do RS); acessor EmCalamidade no modelo (estrutura-pacotes)"
   },
   {
    "campo": "Regras",
    "texto": "o programa usa a tabela para regras e prazos específicos (a Ajuda 2026 não detalha; inferido)"
   }
  ]
 },
 {
  "id": "S-NUVEM-PREPREENCHIDA",
  "nome": "Obter pré-preenchida",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "serviço `obterPrePreenchida` do barramento"
   }
  ]
 },
 {
  "id": "S-NUVEM-CARNELEAO",
  "nome": "Importar Carnê-Leão Web (gov.br ou código de acesso)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "serviços `importarCarneLeaoComLoginGovBr`, `importarCarneLeaoComCodigoAcesso`; classes CarneLeao, Dados, Registro01 a Registro04, RegistroIR"
   }
  ]
 },
 {
  "id": "S-NUVEM-DECONLINE",
  "nome": "Salvar e recuperar declaração on-line",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "serviços `salvarDecOnline`, `recuperarDecOnline`; GravadorTXT.criarArquivoPersistenciaOnline"
   }
  ]
 },
 {
  "id": "S-NUVEM-DARF",
  "nome": "Emissão de Darf em PDF pelo serviço (quota, ECA, Idoso, MAED, MAED Espólio)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "serviços `obterPdfDarfQuota`, `obterPdfDarfECA`, `obterPdfDarfIdoso`, `obterPdfDarfMaed`, `obterPdfDarfMaedEspolio`; classes RetornoDarf, RetornoDarfAuxilio"
   }
  ]
 },
 {
  "id": "S-NUVEM-MUNICIPIOS",
  "nome": "Atualização da tabela de municípios",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "serviço `obterTodosMunicipios`; listener TabelasAtualizadasListener"
   }
  ]
 },
 {
  "id": "S-NUVEM-VENC-DFE",
  "nome": "Data de vencimento da Declaração Final de Espólio",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "serviço `obterDataVencimentoDFE`"
   },
   {
    "campo": "Regras",
    "texto": "prazo da DFE depende da data da decisão/trânsito (nota 06, E-ESP-PRAZO)"
   }
  ]
 },
 {
  "id": "S-NUVEM-CAPTCHA-TOKEN",
  "nome": "Captcha, token de acesso e certificado digital",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "classes Captcha, UsuarioLogado, TokenUtil; tela PainelCaptchaAb"
   }
  ]
 },
 {
  "id": "S-ARQ-GERAL",
  "nome": "Estrutura do arquivo de declaração",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "`LayoutDadosDIRPF2026.xml`; registros IR (header, 160 campos: sistema, exercício, ano-base, código Receitanet, indicador de retificadora, CPF, tipo de NI, versão etc.) e T9 (trailer com quantidades por tipo de registro, QT_R16 em diante); campos com nome, observação, formato (C, N etc.) e tamanho"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-IDENT",
  "nome": "Registro 16 (identificação do contribuinte)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos (início)",
    "texto": "NR_REG, NR_CPF, NM_NOME, TIP_LOGRA, NM_LOGRA, NR_NUMERO, NM_COMPLEM, NM_BAIRRO, NR_CEP (65 campos)"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-TOTAIS",
  "nome": "Registros 17, 18, 19 e 20 (totais, modelo, imposto pago e resumo)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos (início)",
    "texto": "17 impostos e totais (VR_IMPCOMP, VR_ISENTOS, VR_EXCLUSIVOS, VR_TOTAL13, VR_IRFONTELEI11033); 18 cálculo do simplificado (VR_RENDTRIB, VR_DESCSIMP, VR_BASECALC, VR_IMPDEVIDO); 19 imposto pago e livro caixa (VR_IMPEXT, VR_CARNELEAO_TIT, VR_LIVCAIX_TIT); 20 resumo completo (VR_RENDJUR, VR_RENDPFEXT, VR_RESAR, VR_TOTTRIB, limites Funpresp) (inferido pelos nomes)"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-RENDIMENTOS",
  "nome": "Registros 21, 32, 22, 49, 80, 81 (rendimentos PJ, PF/Exterior e exigibilidade suspensa)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos (início)",
    "texto": "21 PJ titular (NR_PAGADOR, NM_PAGADOR, VR_RENDTO, VR_CONTRIB, VR_DECTERC, VR_IMPOSTO, DT_COMUNICACAO_SAIDA); 32 PJ dependentes (CPF_BENEF); 22 PF/Exterior mensal (E_DEPENDENTE, NR_CPF_DEPEN, NR_MES, VR_RENDTO, VR_ALUGUEIS, VR_OUTROS, VR_EXTER); 49 pagadores PF por mês (CPF titular do pagamento e beneficiário); 80 e 81 exigibilidade suspensa titular e dependentes (VR_DEP_JUDICIAL)"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-ISENTOS-EXCL",
  "nome": "Registros 23, 24, 31, 33, 82 e 83 a 99 (isentos, exclusivos e detalhes)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "23 isentos por código (NR_COD_ISENTO, VR_VALOR); 24 exclusivos por código; 31, 33, 82, 93 a 99 detalhes com pagadora e beneficiário (lucros, indenizações, IRRF anos anteriores, JCP, PLR, outros, poupança, aplicações); 83 médicos residentes; 84 Voluntários da Copa; 85 meação e dissolução; 86 ganho com ações; 87 ganho com ouro; 88 parcela isenta de aposentadoria (com NR_CHAVE_BEM); 89 sócio de microempresa"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-PESSOAS",
  "nome": "Registros 25, 35, 29 (dependentes, alimentandos, cônjuge)",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos (início)",
    "texto": "25 dependentes (NR_CHAVE, CD_DEPEND, NM_DEPEND, DT_NASCIM, NI_DEPEND, IN_SAIDA, NR_NITPISPASEP); 35 alimentandos (INDICADOR_RESIDENCIA, NM_NOME, DT_NASCIM, NI_ALIMENTANDO, NR_CPF_VINCULADO, IN_TIPO_PROCESSO); 29 informações do cônjuge (NR_CONJ, VR_BASE, VR_IMPOSTO, VR_ISENTO, VR_EXCLUSIVO, VR_RENDPJ_EXIB_SUSP, VR_TOTALCONJ)"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-PAGAMENTOS-DOACOES",
  "nome": "Registros 26, 34, 46, 48, 90, 91, 92",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "26 pagamentos (CD_PAGTO, NR_CHAVE_DEPEND, NR_BENEF, NM_BENEF, NR_NIT_EMP_DOM, VR_PAGTO, VR_REDUC); 34 doações a partidos (NR_PARTIDO, NM_PARTIDO, VR_DOACAO); 46 e 48 pensão alimentícia do RRA por alimentando (titular e dependentes); 90 doações efetuadas (CD_DOACAO, VR_PARC_NAO_DEDUT, IN_TIPO_CPF_CNPJ); 91 e 92 doações diretamente na declaração ECA e Idoso (IN_TIPO_FUNDO, SG_UF, NOME_MUNICIPIO, VR_DOACAO, NR_CNPJ_FUNDO)"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-BENS-DIVIDAS",
  "nome": "Registros 27, 36, 37, 28",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "27 bens (CD_BEM, IN_EXTERIOR, CD_PAIS, TX_BEM, VR_ANTER, VR_ATUAL e mais 52 campos condicionais); 36 vínculo bem x CPF/CNPJ (NR_CHAVE_BEM, CD_GRUPO_BEM, CD_BEM); 37 aplicações e lucros no exterior por bem (VR_GANHO_PREJUIZO, VR_IMPOSTO_DEVIDO, VR_IMPOSTO_PAGO_EXTERIOR_BRASIL, VR_BASE_CALCULO); 28 dívidas (CD_DIV, TX_DIV, VR_ANTER, VR_ATUAL, VR_PAGAMENTOANUAL)"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-ESPOLIO-SAIDA",
  "nome": "Registros 30, 38, 58, 59, 39",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "30 espólio em ajuste (NR_INVENT, NM_INVENT, IN_SOBREPARTILHA); 38 final de espólio (NR_ANOOBITO, inventariante, sobrepartilha e status); 58 herdeiros (NR_CHAVE_HERDEIRO, NM_NOME, NR_CPF_CNPJ); 59 percentual por bem e herdeiro (NR_CHAVE_BEM, NR_CHAVE_HERDEIRO, VR_PERCENTUAL); 39 saída (procurador, DT_NAORESIDENTE, DT_RESIDENTE, CD_NOVO_PAIS_RESIDENCIA)"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-RRA",
  "nome": "Registros 45 e 47",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "45 RRA titular (NR_PAGADOR, NM_PAGADOR, VR_RENDTO, VR_CONTRIB, VR_PENSAO, VR_IMPOSTO e 13 campos mais); 47 RRA dependentes (CPF_BENEF)"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-RV",
  "nome": "Registros 40, 41, 42, 43",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "40 renda variável mensal por mercado (GC_COMUM_MVISTA_ACOES, GC_COMUM_MVISTA_OURO, GC_COMUM_MOPC_* e day-trade, 54 campos); 41 totais anuais comuns/day-trade; 42 consolidação mensal; 43 totais anuais FII/Fiagro"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-AR",
  "nome": "Registros 50 a 57",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "50 imóvel explorado (NM_IMOVEL, NM_LOCAL, QT_AREA, PC_PARTIC, CD_EXPLOR); 51 receitas e despesas mensais; 52 apuração (VR_RECTOTAL, VR_DESPTOTAL, VR_PREJEXERCANT, VR_OPCAO); 53 rebanho (CD_ESPEC, QT_INIC, QT_COMPRA, QT_NASCIM, QT_PERDA, QT_VENDA); 54 bens da AR; 55 dívidas da AR; 56 exterior por país (RECBRUTA, DESPCUSTEIO, RESORIGINAL, RESDOLAR); 57 participantes do imóvel"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-GCAP",
  "nome": "Registros 60 a 78",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "60 identificação do demonstrativo e transportes (94 campos); 62 bens móveis; 63 participações societárias; 64 operações em moeda estrangeira; 65 adquirentes; 66 e 67 reduções e parcelas; 68 a 72 apuração, cálculo e parcelas; 73 a 77 moeda estrangeira em espécie e consolidação; 78 transportes para a declaração (VR_BENSISENTO, VR_BENSIMPOSTO, VR_BENSEXCLUSIVO, VR_ESPIMPOSTO, VR_ESPEXCLUSIVO)"
   }
  ]
 },
 {
  "id": "S-ARQ-REG-RECIBO",
  "nome": "Registros FR, HR, DR, R9, HC, RC, NC, VC, MC, TC",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Campos",
    "texto": "FR (nome da declaração, CPF, data e hora de entrega, meio, tipo, situação); HR/DR/R9 recibo (DR com dados do contribuinte; R9 com NR_HASH); HC/RC/TC complemento do recibo (data e hora de recepção, SIGNET); NC notificação de multa; VC dados do validador; MC mensagens"
   }
  ]
 },
 {
  "id": "S-ARQ-INFORMES",
  "nome": "Arquivos de informe (XML) e mapeamentos de importação",
  "fonte": "docs/mapeamento/notas/08-menus-operacoes-sistema.md",
  "itens": [
   {
    "campo": "Onde",
    "texto": "`informe_fontes_pagadoras.xsd`, `informe_planos_saude.xsd`, `informe_tipos.xsd`, `mapeamentoXml.xml`, `mapeamentoTxt.xml`, `mapeamentoXmlGCAP.xml`"
   }
  ]
 }
];

export const ATALHOS_PROGRAMA: readonly AtalhoPrograma[] = [
 {
  "tecla": "Alt+I",
  "id": "F-PAG",
  "funcao": "Pagamentos Efetuados (ficha)",
  "status": "implementada",
  "ferramentas": [
   "adicionar_pagamento",
   "editar_lancamento",
   "remover_lancamento"
  ]
 },
 {
  "tecla": "Alt+I",
  "id": "F-PAG-IMPPS",
  "funcao": "Botão \"Importar arquivo do plano de saúde\"",
  "status": "implementada",
  "ferramentas": [
   "importar_informe_plano_saude"
  ]
 },
 {
  "tecla": "Ctrl+Shift+I",
  "id": "F-PAG-IMPPS",
  "funcao": "Botão \"Importar arquivo do plano de saúde\"",
  "status": "implementada",
  "ferramentas": [
   "importar_informe_plano_saude"
  ]
 },
 {
  "tecla": "Ctrl+W",
  "id": "F-DDD",
  "funcao": "Doações Diretamente na Declaração (ficha)",
  "status": "implementada",
  "ferramentas": [
   "adicionar_doacao_direta_declaracao",
   "gerar_darf"
  ]
 },
 {
  "tecla": "Ctrl+Y",
  "id": "F-DDD",
  "funcao": "Doações Diretamente na Declaração (ficha)",
  "status": "implementada",
  "ferramentas": [
   "adicionar_doacao_direta_declaracao",
   "gerar_darf"
  ]
 },
 {
  "tecla": "Alt+R",
  "id": "F-BENS",
  "funcao": "Bens e Direitos (ficha, Declaração de Ajuste Anual)",
  "status": "implementada",
  "ferramentas": [
   "adicionar_bem",
   "editar_lancamento",
   "remover_lancamento",
   "repetir_valores_bens"
  ]
 },
 {
  "tecla": "Alt+D",
  "id": "M-MENU-DECLARACAO",
  "funcao": "Menu Declaração",
  "status": "implementada",
  "ferramentas": [
   "abrir_declaracao",
   "criar_declaracao",
   "criar_retificadora",
   "excluir_declaracao"
  ]
 },
 {
  "tecla": "Alt+P",
  "id": "M-MENU-IMPORTACOES",
  "funcao": "Menu Importações",
  "status": "parcial",
  "ferramentas": [
   "abrir_declaracao",
   "definir_receitas_despesas_rurais",
   "definir_rendimentos_pf_exterior",
   "importar_informe_plano_saude",
   "importar_informe_rendimentos",
   "orientar_servico_externo"
  ]
 },
 {
  "tecla": "Alt+F",
  "id": "M-MENU-FICHAS",
  "funcao": "Menu Fichas e navegação",
  "status": "implementada",
  "ferramentas": [
   "listar_fichas"
  ]
 },
 {
  "tecla": "Shift+Tab",
  "id": "M-MENU-FICHAS",
  "funcao": "Menu Fichas e navegação",
  "status": "implementada",
  "ferramentas": [
   "listar_fichas"
  ]
 },
 {
  "tecla": "Alt+PgUp/PgDn",
  "id": "M-MENU-FICHAS",
  "funcao": "Menu Fichas e navegação",
  "status": "implementada",
  "ferramentas": [
   "listar_fichas"
  ]
 },
 {
  "tecla": "Alt+T",
  "id": "M-MENU-FERRAMENTAS",
  "funcao": "Menu Ferramentas",
  "status": "implementada",
  "ferramentas": [
   "gravar_copia_seguranca",
   "listar_copias_seguranca",
   "restaurar_copia_seguranca"
  ]
 },
 {
  "tecla": "Alt+J",
  "id": "M-MENU-AJUDA",
  "funcao": "Menu Ajuda",
  "status": "implementada",
  "ferramentas": [
   "obter_ajuda"
  ]
 },
 {
  "tecla": "Alt+Shift+C",
  "id": "M-MENU-AJUDA",
  "funcao": "Menu Ajuda",
  "status": "implementada",
  "ferramentas": [
   "obter_ajuda"
  ]
 },
 {
  "tecla": "Alt+Shift+I",
  "id": "M-MENU-AJUDA",
  "funcao": "Menu Ajuda",
  "status": "implementada",
  "ferramentas": [
   "obter_ajuda"
  ]
 },
 {
  "tecla": "Alt+Shift+F",
  "id": "M-MENU-AJUDA",
  "funcao": "Menu Ajuda",
  "status": "implementada",
  "ferramentas": [
   "obter_ajuda"
  ]
 },
 {
  "tecla": "Alt+Shift+G",
  "id": "M-MENU-AJUDA",
  "funcao": "Menu Ajuda",
  "status": "implementada",
  "ferramentas": [
   "obter_ajuda"
  ]
 },
 {
  "tecla": "Alt+Shift+R",
  "id": "M-MENU-AJUDA",
  "funcao": "Menu Ajuda",
  "status": "implementada",
  "ferramentas": [
   "obter_ajuda"
  ]
 },
 {
  "tecla": "Alt+Shift+S",
  "id": "M-MENU-AJUDA",
  "funcao": "Menu Ajuda",
  "status": "implementada",
  "ferramentas": [
   "obter_ajuda"
  ]
 },
 {
  "tecla": "F11",
  "id": "M-MENU-AJUDA",
  "funcao": "Menu Ajuda",
  "status": "implementada",
  "ferramentas": [
   "obter_ajuda"
  ]
 },
 {
  "tecla": "Alt+F4",
  "id": "M-MENU-AJUDA",
  "funcao": "Menu Ajuda",
  "status": "implementada",
  "ferramentas": [
   "obter_ajuda"
  ]
 },
 {
  "tecla": "Ctrl+N",
  "id": "M-DECL-NOVA",
  "funcao": "Declaração > Nova",
  "status": "implementada",
  "ferramentas": [
   "criar_declaracao"
  ]
 },
 {
  "tecla": "Ctrl+B",
  "id": "M-DECL-ABRIR",
  "funcao": "Declaração > Abrir",
  "status": "implementada",
  "ferramentas": [
   "abrir_declaracao"
  ]
 },
 {
  "tecla": "Ctrl+F",
  "id": "M-DECL-FECHAR",
  "funcao": "Declaração > Fechar",
  "status": "não se aplica",
  "ferramentas": []
 },
 {
  "tecla": "Ctrl+E",
  "id": "M-DECL-EXCLUIR",
  "funcao": "Declaração > Excluir",
  "status": "implementada",
  "ferramentas": [
   "excluir_declaracao"
  ]
 },
 {
  "tecla": "Ctrl+G",
  "id": "M-DECL-RETIFICAR",
  "funcao": "Declaração > Retificar",
  "status": "implementada",
  "ferramentas": [
   "criar_retificadora"
  ]
 },
 {
  "tecla": "F5",
  "id": "M-DECL-PENDENCIAS",
  "funcao": "Declaração > Verificar Pendências",
  "status": "implementada",
  "ferramentas": [
   "validar_declaracao"
  ]
 },
 {
  "tecla": "Ctrl+I",
  "id": "M-DECL-ENTREGAR",
  "funcao": "Declaração > Entregar Declaração",
  "status": "implementada",
  "ferramentas": [
   "converter_modelo_para_dbk",
   "gerar_arquivo_entrega",
   "instruir_transmissao",
   "validar_declaracao",
   "verificar_integridade_arquivo"
  ]
 },
 {
  "tecla": "Ctrl+Shift+B",
  "id": "M-DECL-ENTREGAR",
  "funcao": "Declaração > Entregar Declaração",
  "status": "implementada",
  "ferramentas": [
   "converter_modelo_para_dbk",
   "gerar_arquivo_entrega",
   "instruir_transmissao",
   "validar_declaracao",
   "verificar_integridade_arquivo"
  ]
 },
 {
  "tecla": "Ctrl+Shift+E",
  "id": "M-DECL-ENTREGAR",
  "funcao": "Declaração > Entregar Declaração",
  "status": "implementada",
  "ferramentas": [
   "converter_modelo_para_dbk",
   "gerar_arquivo_entrega",
   "instruir_transmissao",
   "validar_declaracao",
   "verificar_integridade_arquivo"
  ]
 },
 {
  "tecla": "F6",
  "id": "M-DECL-SALVAR-ONLINE",
  "funcao": "Declaração > Salvar On-line (F6)",
  "status": "implementada",
  "ferramentas": [
   "gravar_copia_seguranca",
   "orientar_servico_externo"
  ]
 },
 {
  "tecla": "F7",
  "id": "M-DECL-RECUPERAR-ONLINE",
  "funcao": "Declaração > Recuperar On-line (F7)",
  "status": "implementada",
  "ferramentas": [
   "listar_copias_seguranca",
   "orientar_servico_externo",
   "restaurar_copia_seguranca"
  ]
 },
 {
  "tecla": "Alt+F4",
  "id": "M-DECL-SAIR",
  "funcao": "Declaração > Sair do Programa",
  "status": "não se aplica",
  "ferramentas": []
 },
 {
  "tecla": "Ctrl+P",
  "id": "M-IMPR-DECLARACAO",
  "funcao": "Imprimir Declaração",
  "status": "parcial",
  "ferramentas": [
   "gerar_relatorio_declaracao"
  ]
 },
 {
  "tecla": "Ctrl+Shift+F",
  "id": "M-IMPR-REND-PF",
  "funcao": "Imprimir Rendimentos Recebidos de PF",
  "status": "parcial",
  "ferramentas": [
   "gerar_relatorio_declaracao"
  ]
 },
 {
  "tecla": "Ctrl+R",
  "id": "M-IMPR-RECIBO",
  "funcao": "Imprimir Recibo de Entrega",
  "status": "implementada",
  "ferramentas": [
   "criar_retificadora",
   "instruir_transmissao",
   "registrar_recibo"
  ]
 },
 {
  "tecla": "Ctrl+D",
  "id": "M-IMPR-DARF",
  "funcao": "Imprimir Darf do IRPF",
  "status": "implementada",
  "ferramentas": [
   "calcular_quotas",
   "gerar_darf"
  ]
 },
 {
  "tecla": "Ctrl+U",
  "id": "M-IMPR-DARF-MAED",
  "funcao": "Imprimir Darf de Multa por Atraso na Entrega",
  "status": "implementada",
  "ferramentas": [
   "calcular_multa_atraso",
   "gerar_darf"
  ]
 },
 {
  "tecla": "Ctrl+W",
  "id": "M-IMPR-DARF-ECA",
  "funcao": "Imprimir Darf, Doações Diretamente na Declaração, ECA",
  "status": "implementada",
  "ferramentas": [
   "gerar_darf"
  ]
 },
 {
  "tecla": "Ctrl+Y",
  "id": "M-IMPR-DARF-IDOSO",
  "funcao": "Imprimir Darf, Doações Diretamente na Declaração, Pessoa Idosa",
  "status": "implementada",
  "ferramentas": [
   "gerar_darf"
  ]
 },
 {
  "tecla": "Ctrl+L",
  "id": "M-IMPR-RELACAO",
  "funcao": "Imprimir Relação de Declarações",
  "status": "parcial",
  "ferramentas": [
   "listar_arquivos"
  ]
 },
 {
  "tecla": "Ctrl+Shift+S",
  "id": "M-IMPR-COMUNICACAO-SAIDA",
  "funcao": "Imprimir Comunicação à Fonte Pagadora de Saída do País",
  "status": "implementada",
  "ferramentas": [
   "gerar_comunicacao_saida"
  ]
 },
 {
  "tecla": "Ctrl+Alt+R",
  "id": "M-IMPR-INFORME-REND",
  "funcao": "Imprimir Informe de Rendimentos (arquivo XML da fonte)",
  "status": "implementada",
  "ferramentas": [
   "ler_informe"
  ]
 },
 {
  "tecla": "Ctrl+Alt+I",
  "id": "M-IMPR-INFORME-PS",
  "funcao": "Imprimir Informe de Plano de Saúde",
  "status": "implementada",
  "ferramentas": [
   "ler_informe"
  ]
 },
 {
  "tecla": "Alt+I",
  "id": "M-IMP-INFORME-REND",
  "funcao": "Importar Informe de Rendimentos",
  "status": "implementada",
  "ferramentas": [
   "importar_informe_rendimentos"
  ]
 },
 {
  "tecla": "Ctrl+Shift+R",
  "id": "M-IMP-INFORME-REND",
  "funcao": "Importar Informe de Rendimentos",
  "status": "implementada",
  "ferramentas": [
   "importar_informe_rendimentos"
  ]
 },
 {
  "tecla": "Ctrl+Shift+I",
  "id": "M-IMP-INFORME-PS",
  "funcao": "Importar Informe de Plano de Saúde",
  "status": "implementada",
  "ferramentas": [
   "importar_informe_plano_saude"
  ]
 },
 {
  "tecla": "Ctrl+Shift+C",
  "id": "M-IMP-CARNE-LEAO",
  "funcao": "Importar Carnê-Leão 2025",
  "status": "parcial",
  "ferramentas": [
   "definir_rendimentos_pf_exterior",
   "orientar_servico_externo"
  ]
 },
 {
  "tecla": "Alt+I",
  "id": "M-IMP-CARNE-LEAO",
  "funcao": "Importar Carnê-Leão 2025",
  "status": "parcial",
  "ferramentas": [
   "definir_rendimentos_pf_exterior",
   "orientar_servico_externo"
  ]
 },
 {
  "tecla": "Ctrl+Shift+A",
  "id": "M-IMP-AR",
  "funcao": "Importar Atividade Rural 2025",
  "status": "parcial",
  "ferramentas": [
   "definir_receitas_despesas_rurais",
   "orientar_servico_externo"
  ]
 },
 {
  "tecla": "Ctrl+Shift+G",
  "id": "M-IMP-GCAP",
  "funcao": "Importar Ganhos de Capital 2025",
  "status": "parcial",
  "ferramentas": [
   "abrir_declaracao",
   "orientar_servico_externo"
  ]
 },
 {
  "tecla": "Ctrl+K",
  "id": "M-FERR-COPIA-GRAVAR",
  "funcao": "Gravar Cópia de Segurança",
  "status": "implementada",
  "ferramentas": [
   "converter_modelo_para_dbk",
   "gerar_arquivo_entrega",
   "gravar_copia_seguranca",
   "verificar_integridade_arquivo"
  ]
 },
 {
  "tecla": "Ctrl+T",
  "id": "M-FERR-COPIA-RESTAURAR",
  "funcao": "Restaurar Cópia de Segurança",
  "status": "parcial",
  "ferramentas": [
   "converter_dbk_para_modelo",
   "listar_copias_seguranca",
   "restaurar_copia_seguranca"
  ]
 },
 {
  "tecla": "Ctrl+Alt+A",
  "id": "M-FERR-CALCULADORA",
  "funcao": "Calculadora",
  "status": "não se aplica",
  "ferramentas": []
 },
 {
  "tecla": "Alt, T, V",
  "id": "M-FERR-ATUALIZACOES",
  "funcao": "Verificar Atualizações",
  "status": "implementada",
  "ferramentas": [
   "verificar_versao_tabelas"
  ]
 },
 {
  "tecla": "Alt, T, R, T",
  "id": "M-FERR-RECNOMES",
  "funcao": "Recuperação de Nomes (Ativar/Desativar, Limpar)",
  "status": "parcial",
  "ferramentas": [
   "buscar_nome_por_documento"
  ]
 },
 {
  "tecla": "Alt, T, R, L",
  "id": "M-FERR-RECNOMES",
  "funcao": "Recuperação de Nomes (Ativar/Desativar, Limpar)",
  "status": "parcial",
  "ferramentas": [
   "buscar_nome_por_documento"
  ]
 },
 {
  "tecla": "F1",
  "id": "M-AJUDA-CONTEXTUAL",
  "funcao": "Ajuda de campo (F1) e textos em azul",
  "status": "implementada",
  "ferramentas": [
   "comparar_modelos",
   "explicar_calculo",
   "obter_ajuda",
   "simular_imposto"
  ]
 },
 {
  "tecla": "F11",
  "id": "M-AJUDA-ACESSIBILIDADE",
  "funcao": "Acessibilidade (F11) e leitura de tela",
  "status": "não se aplica",
  "ferramentas": []
 },
 {
  "tecla": "Ctrl+Shift+B",
  "id": "S-TRANSMISSAO",
  "funcao": "Transmissão (Receitanet incorporado)",
  "status": "implementada",
  "ferramentas": [
   "instruir_transmissao"
  ]
 },
 {
  "tecla": "Ctrl+Shift+E",
  "id": "S-TRANSMISSAO",
  "funcao": "Transmissão (Receitanet incorporado)",
  "status": "implementada",
  "ferramentas": [
   "instruir_transmissao"
  ]
 }
];
