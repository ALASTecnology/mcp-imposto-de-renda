# Inventário de funções do PGD IRPF 2026

Inventário exaustivo das funções do programa oficial da Declaração de Ajuste Anual do IRPF 2026 (exercício 2026, ano-calendário 2025, versão 1.5): menus, telas, fichas, abas, quadros, botões, demonstrativos, importações, impressões, pagamento, transmissão, serviços em nuvem, arquivo da declaração e tabelas. Cada item tem um ID estável, usado pela [matriz de cobertura](matriz-cobertura.md) e pelo código do MCP Imposto de Renda.

Fontes: texto da Ajuda oficial (AjudaIRPF.pdf, 425 páginas), guia de atalhos (AtalhosIRPF.pdf), recursos de dados que acompanham o programa (tabelas XML, `LayoutDadosDIRPF2026.xml`, `Mensagens.properties`, esquemas XSD dos informes) e nomes de classes, telas e relatórios listados em [estrutura-pacotes.md](estrutura-pacotes.md). Nenhum código foi descompilado ou copiado. Ver [README](README.md).

## Convenções

- `M-` menus, telas e ações; `F-` fichas, abas, quadros e campos; `D-` demonstrativos; `S-` sistema: tipos de declaração, regras gerais, pagamento, operações, nuvem, arquivo e tabelas.
- Cada item traz: Onde (menu, ficha, página da Ajuda ou recurso), Aplica-se a, Campos, Validações, Códigos, Regras de cálculo, Importações/exportações, Exige do MCP e Observações, quando a fonte informa.
- "(inferido)" marca o que foi deduzido e não está escrito na fonte. "Ajuda pág. N" é a página do PDF da Ajuda.
- "Origem" indica a nota de trabalho de onde o item veio e o ID usado na nota, quando diferente (as notas usavam `T-`, `G-`, `P-` e `E-ESP-`, renomeados para `S-TIPO-`, `S-REGRA-`, `S-PAG-` e `F-DFE-`).

## Totais

| Categoria | Itens |
|---|---:|
| Menus, telas e ações (M-) | 62 |
| Fichas, abas e quadros (F-) | 218 |
| Demonstrativos (D-) | 56 |
| Sistema, regras, pagamento, nuvem, arquivo e tabelas (S-) | 80 |
| **Total** | **416** |

## Índice

- [1. Menus, telas e ações do programa](#1-menus-telas-e-ações-do-programa) (62 itens)
  - 1.1 Menus principais, barra de ferramentas e rodapé: [M-MENU-DECLARACAO](#m-menu-declaracao-menu-declaração), [M-MENU-IMPORTACOES](#m-menu-importacoes-menu-importações), [M-MENU-FICHAS](#m-menu-fichas-menu-fichas-e-navegação), [M-MENU-FERRAMENTAS](#m-menu-ferramentas-menu-ferramentas), [M-MENU-AJUDA](#m-menu-ajuda-menu-ajuda), [M-TOOLBAR](#m-toolbar-barra-de-ferramentas), [M-RODAPE-COMPARATIVO](#m-rodape-comparativo-painel-de-imposto-e-comparativo-no-rodapé)
  - 1.2 Tela inicial: [M-INICIAL](#m-inicial-tela-o-que-você-deseja-fazer), [M-INICIAL-NOVA](#m-inicial-nova-aba-nova-tela-o-que-você-deseja-fazer), [M-INICIAL-EMPREENCH](#m-inicial-empreench-aba-em-preenchimento), [M-INICIAL-TRANSMITIDAS](#m-inicial-transmitidas-aba-transmitidas), [M-INICIAL-BOASVINDAS](#m-inicial-boasvindas-aba-boas-vindas-links-úteis-e-entrar-com-govbr)
  - 1.3 Menu Declaração: [M-DECL-NOVA](#m-decl-nova-declaração--nova), [M-DECL-ABRIR](#m-decl-abrir-declaração--abrir), [M-DECL-FECHAR](#m-decl-fechar-declaração--fechar), [M-DECL-EXCLUIR](#m-decl-excluir-declaração--excluir), [M-DECL-RETIFICAR](#m-decl-retificar-declaração--retificar), [M-DECL-PENDENCIAS](#m-decl-pendencias-declaração--verificar-pendências), [M-DECL-ENTREGAR](#m-decl-entregar-declaração--entregar-declaração), [M-DECL-SALVAR-ONLINE](#m-decl-salvar-online-declaração--salvar-on-line-f6), [M-DECL-RECUPERAR-ONLINE](#m-decl-recuperar-online-declaração--recuperar-on-line-f7), [M-DECL-SAIR](#m-decl-sair-declaração--sair-do-programa), [M-DECL-CONVERTER](#m-decl-converter-converter-declaração-inferido)
  - 1.4 Impressão: [M-IMPR-DECLARACAO](#m-impr-declaracao-imprimir-declaração), [M-IMPR-REND-PF](#m-impr-rend-pf-imprimir-rendimentos-recebidos-de-pf), [M-IMPR-RECIBO](#m-impr-recibo-imprimir-recibo-de-entrega), [M-IMPR-DARF](#m-impr-darf-imprimir-darf-do-irpf), [M-IMPR-DARF-MAED](#m-impr-darf-maed-imprimir-darf-de-multa-por-atraso-na-entrega), [M-IMPR-DARF-ECA](#m-impr-darf-eca-imprimir-darf-doações-diretamente-na-declaração-eca), [M-IMPR-DARF-IDOSO](#m-impr-darf-idoso-imprimir-darf-doações-diretamente-na-declaração-pessoa-idosa), [M-IMPR-RELACAO](#m-impr-relacao-imprimir-relação-de-declarações), [M-IMPR-COMUNICACAO-SAIDA](#m-impr-comunicacao-saida-imprimir-comunicação-à-fonte-pagadora-de-saída-do-país), [M-IMPR-INFORME-REND](#m-impr-informe-rend-imprimir-informe-de-rendimentos-arquivo-xml-da-fonte), [M-IMPR-INFORME-PS](#m-impr-informe-ps-imprimir-informe-de-plano-de-saúde), [M-IMPR-DARF-AUXILIO](#m-impr-darf-auxilio-darf-de-devolução-do-auxílio-emergencial-inferido), [M-IMPR-CRITERIOS-OBRIG](#m-impr-criterios-obrig-impressão-de-critérios-de-obrigatoriedade-inferido), [M-IMPR-SALVAR-PDF](#m-impr-salvar-pdf-visualizar-e-salvar-em-pdf)
  - 1.5 Importações: [M-IMP-ANO-ANTERIOR](#m-imp-ano-anterior-importar-dados-da-declaração-de-2025), [M-IMP-PREPREENCHIDA](#m-imp-prepreenchida-importar-declaração-pré-preenchida), [M-IMP-INFORME-REND](#m-imp-informe-rend-importar-informe-de-rendimentos), [M-IMP-INFORME-PS](#m-imp-informe-ps-importar-informe-de-plano-de-saúde), [M-IMP-CARNE-LEAO](#m-imp-carne-leao-importar-carnê-leão-2025), [M-IMP-AR](#m-imp-ar-importar-atividade-rural-2025), [M-IMP-GCAP](#m-imp-gcap-importar-ganhos-de-capital-2025), [M-IMP-SUGESTAO](#m-imp-sugestao-sugestão-de-importação-inferido)
  - 1.6 Ferramentas: [M-FERR-COPIA-GRAVAR](#m-ferr-copia-gravar-gravar-cópia-de-segurança), [M-FERR-COPIA-RESTAURAR](#m-ferr-copia-restaurar-restaurar-cópia-de-segurança), [M-FERR-CALCULADORA](#m-ferr-calculadora-calculadora), [M-FERR-ATUALIZACOES](#m-ferr-atualizacoes-verificar-atualizações), [M-FERR-RECNOMES](#m-ferr-recnomes-recuperação-de-nomes-ativardesativar-limpar), [M-FERR-LOGIN-GOVBR](#m-ferr-login-govbr-entrar-e-sair-com-govbr), [M-FERR-PAGINAS](#m-ferr-paginas-links-para-páginas-da-rfb-irpf-dte-e-navegador), [M-FERR-MEMORIA](#m-ferr-memoria-memória-do-irpf-inferido), [M-FERR-LEAOZINHO](#m-ferr-leaozinho-assistente-leãozinho-inferido), [M-FERR-AVALIACAO](#m-ferr-avaliacao-avaliação-do-programa-inferido), [M-FERR-INFO-CALCULO](#m-ferr-info-calculo-constantes-de-cálculo-inferido-tela-de-testes)
  - 1.7 Ajuda: [M-AJUDA-CONTEXTUAL](#m-ajuda-contextual-ajuda-de-campo-f1-e-textos-em-azul), [M-AJUDA-DOCUMENTOS](#m-ajuda-documentos-conteúdo-instruções-como-fazer-perguntas-e-respostas-faq), [M-AJUDA-ATALHOS](#m-ajuda-atalhos-exibir-atalhos), [M-AJUDA-ACESSIBILIDADE](#m-ajuda-acessibilidade-acessibilidade-f11-e-leitura-de-tela), [M-AJUDA-SOBRE](#m-ajuda-sobre-sobre-novidades-tutorial)
  - 1.8 Ações de demonstrativo: [M-DEMO-ACOES](#m-demo-acoes-novo-abrir-fechar-excluir-e-retificar-demonstrativo-inferido)
- [2. Tipos de declaração e regras gerais](#2-tipos-de-declaração-e-regras-gerais) (33 itens)
  - 2.1 Tipos de declaração e programas relacionados: [S-TIPO-AJUSTE](#s-tipo-ajuste-declaração-de-ajuste-anual), [S-TIPO-DFE](#s-tipo-dfe-declaração-final-de-espólio), [S-TIPO-DSDP](#s-tipo-dsdp-declaração-de-saída-definitiva-do-país), [S-PROGRAMAS-RFB](#s-programas-rfb-programas-relacionados-disponibilizados-pela-rfb)
  - 2.2 Situações individuais, residência e regras de rendimentos: [S-REGRA-CASADO](#s-regra-casado-contribuinte-casado), [S-REGRA-COMPANHEIRO](#s-regra-companheiro-contribuinte-que-tenha-companheiro), [S-REGRA-SEPARADO-FATO](#s-regra-separado-fato-contribuinte-separado-de-fato), [S-REGRA-DIVORCIADO](#s-regra-divorciado-contribuinte-separado-judicialmente-divorciado-que-dissolveu-união-estável-ou-separadodivorciado-por-escritura-pública), [S-REGRA-VIUVO](#s-regra-viuvo-contribuinte-viúvo), [S-REGRA-MENOR](#s-regra-menor-contribuinte-menor), [S-REGRA-EMANCIPADO](#s-regra-emancipado-contribuinte-menor-emancipado), [S-REGRA-INCAPAZ](#s-regra-incapaz-contribuinte-incapaz), [S-REGRA-ESPOLIO](#s-regra-espolio-declaração-do-espólio-inicial-e-intermediárias), [S-REGRA-ESPOLIO-FINAL](#s-regra-espolio-final-regras-da-declaração-final-de-espólio-e-sobrepartilha), [S-REGRA-AUSENTE-SERVICO](#s-regra-ausente-servico-contribuinte-ausente-no-exterior-a-serviço-do-brasil), [S-REGRA-AUSENTE-OUTROS](#s-regra-ausente-outros-contribuinte-ausente-no-exterior-exceto-a-serviço-do-brasil), [S-REGRA-RESIDENTE](#s-regra-residente-contribuinte-que-adquiriu-ou-readquiriu-a-condição-de-residente), [S-REGRA-DIPLOMATICO](#s-regra-diplomatico-rendimentos-de-representações-diplomáticas-e-organismos-internacionais-no-brasil), [S-REGRA-CONVERSAO](#s-regra-conversao-conversão-em-reais-de-rendimentos-ou-pagamentos-em-moeda-estrangeira), [S-REGRA-REND-TRAB](#s-regra-rend-trab-rendimentos-do-trabalho-tributáveis), [S-REGRA-ALUGUEIS](#s-regra-alugueis-rendimentos-de-aluguéis), [S-REGRA-AR-RESULTADO](#s-regra-ar-resultado-resultado-tributável-da-atividade-rural), [S-REGRA-RRA](#s-regra-rra-rendimentos-recebidos-acumuladamente-regra-geral), [S-REGRA-OUTROS-REND](#s-regra-outros-rend-outros-rendimentos-tributáveis), [S-REGRA-NAO-RESIDENTE](#s-regra-nao-residente-caracterização-da-condição-de-residente-e-de-não-residente)
  - 2.3 Obrigatoriedade, regime, prazo, multa e retificação: [S-REGRA-OBRIG](#s-regra-obrig-obrigatoriedade-de-apresentação-da-declaração-de-ajuste-anual-2026), [S-REGRA-REGIME](#s-regra-regime-regime-de-tributação-deduções-legais-ou-desconto-simplificado), [S-REGRA-PREENCHIMENTO](#s-regra-preenchimento-forma-de-preenchimento-e-pré-preenchida), [S-REGRA-PRAZO](#s-regra-prazo-prazo-e-local-de-apresentação), [S-REGRA-MULTA-ATRASO](#s-regra-multa-atraso-multa-por-atraso-na-entrega-maed), [S-REGRA-RETIF](#s-regra-retif-retificação-da-declaração), [S-REGRA-APOS-PRAZO](#s-regra-apos-prazo-locais-de-apresentação-após-o-prazo), [S-REGRA-EXERC-ANT](#s-regra-exerc-ant-declaração-de-exercícios-anteriores)
- [3. Fichas da declaração](#3-fichas-da-declaração) (218 itens)
  - 3.1 Início e Identificação do Contribuinte: [F-INICIO](#f-inicio-aba-início), [F-IDENT](#f-ident-identificação-do-contribuinte-visão-geral), [F-IDENT-TIPO](#f-ident-tipo-que-tipo-de-declaração-você-deseja-fazer), [F-IDENT-NOME](#f-ident-nome-nome), [F-IDENT-NASC](#f-ident-nasc-data-de-nascimento), [F-IDENT-DOENCA](#f-ident-doenca-há-declarante-ou-dependente-com-doença-grave-ou-deficiência-física-ou-mental), [F-IDENT-RACA](#f-ident-raca-raçacor), [F-IDENT-ALTCAD](#f-ident-altcad-houve-alteração-de-dados-cadastrais), [F-IDENT-CONJ](#f-ident-conj-possui-cônjuge-ou-companheiroa), [F-IDENT-RETORNO](#f-ident-retorno-era-residente-no-exterior-e-passou-a-ser-residente-no-país-em-2025), [F-IDENT-END-BR](#f-ident-end-br-endereço---brasil), [F-IDENT-END-EXT](#f-ident-end-ext-endereço---exterior), [F-IDENT-OCUP](#f-ident-ocup-ocupação-principal)
  - 3.2 Dependentes e Alimentandos: [F-DEP](#f-dep-dependentes), [F-ALIM](#f-alim-alimentandos)
  - 3.3 Rendimentos Tributáveis Recebidos de PJ: [F-RTPJ-TIT](#f-rtpj-tit-rendimentos-tributáveis-recebidos-de-pj-pelo-titular), [F-RTPJ-DEP](#f-rtpj-dep-rendimentos-tributáveis-recebidos-de-pj-pelos-dependentes)
  - 3.4 Rendimentos Tributáveis Recebidos de PF e do Exterior: [F-RTPF](#f-rtpf-rendimentos-tributáveis-recebidos-de-pessoa-física-e-do-exterior-visão-geral), [F-RTPF-IMPCL](#f-rtpf-impcl-importação-do-carnê-leão), [F-RTPF-TNA](#f-rtpf-tna-aba-rendimentos-do-trabalho-não-assalariado-titular-e-dependentes), [F-RTPF-NIT](#f-rtpf-nit-nitpispasep), [F-RTPF-ALUG](#f-rtpf-alug-coluna-aluguéis-inclusive-por-temporada), [F-RTPF-OUTROS](#f-rtpf-outros-coluna-outros), [F-RTPF-EXT](#f-rtpf-ext-coluna-exterior), [F-RTPF-PREV](#f-rtpf-prev-deduções---previdência-oficial), [F-RTPF-QTDDEP](#f-rtpf-qtddep-deduções---quantidade-de-dependentes), [F-RTPF-PENSAO](#f-rtpf-pensao-deduções---pensão-alimentícia), [F-RTPF-LIVROCAIXA](#f-rtpf-livrocaixa-deduções---livro-caixa), [F-RTPF-DARF0190](#f-rtpf-darf0190-carnê-leão---darf-pago-cód-0190), [F-RTPF-DEP-CPF](#f-rtpf-dep-cpf-cpf-dos-dependentes-ficha-pfexterior-aba-dependentes)
  - 3.5 Rendimentos Isentos e Não Tributáveis: [F-ISENTO](#f-isento-rendimentos-isentos-e-não-tributáveis-ficha), [F-ISENTO-01](#f-isento-01-bolsas-de-estudo-e-de-pesquisa-caracterizadas-como-doação-exceto-médico-residente-ou-pronatec), [F-ISENTO-02](#f-isento-02-bolsas-de-estudo-e-de-pesquisa-de-médico-residente-e-servidor-da-rede-pública-de-educação-profissional-pronatec), [F-ISENTO-03](#f-isento-03-capital-de-apólices-de-seguro-ou-pecúlio-pago-por-morte-do-segurado-prêmio-de-seguro-restituído-e-pecúlio-de-previdência-privada-por-morte-ou-invalidez-permanente), [F-ISENTO-04](#f-isento-04-indenizações-por-rescisão-de-contrato-de-trabalho-inclusive-pdv-e-por-acidente-de-trabalho-e-fgts), [F-ISENTO-05](#f-isento-05-ganho-de-capital-em-alienação-de-bens-de-pequeno-valor-até-r-2000000-ações-em-mercado-de-balcão-r-3500000-demais-casos-por-mês), [F-ISENTO-06](#f-isento-06-ganho-de-capital-na-alienação-do-único-imóvel-por-até-r-44000000-sem-outra-alienação-de-imóvel-nos-últimos-5-anos), [F-ISENTO-07](#f-isento-07-ganho-de-capital-na-venda-de-imóveis-residenciais-para-aquisição-em-180-dias-de-imóveis-residenciais-no-brasil-e-redução-sobre-o-ganho-de-capital), [F-ISENTO-08](#f-isento-08-ganho-de-capital-na-alienação-de-moeda-estrangeira-em-espécie-com-total-anual-até-us-500000), [F-ISENTO-09](#f-isento-09-lucros-e-dividendos-recebidos), [F-ISENTO-10](#f-isento-10-parcela-isenta-de-proventos-de-aposentadoria-reserva-remunerada-reforma-e-pensão-de-declarante-com-65-anos-ou-mais), [F-ISENTO-11](#f-isento-11-pensão-proventos-de-aposentadoria-reserva-ou-reforma-por-moléstia-grave-ou-aposentadoriareforma-por-acidente-em-serviço), [F-ISENTO-12](#f-isento-12-rendimentos-de-caderneta-de-poupança-letras-hipotecárias-lca-lci-cra-e-cri), [F-ISENTO-13](#f-isento-13-rendimento-de-sócio-ou-titular-de-meepp-optante-pelo-simples-nacional-exceto-pró-labore-aluguéis-e-serviços-prestados), [F-ISENTO-14](#f-isento-14-transferências-patrimoniais-doações-e-heranças), [F-ISENTO-15](#f-isento-15-parcela-não-tributável-correspondente-à-atividade-rural), [F-ISENTO-16](#f-isento-16-imposto-de-anos-calendário-anteriores-compensado-judicialmente-neste-ano-calendário), [F-ISENTO-17](#f-isento-17-75-dos-rendimentos-do-trabalho-assalariado-recebidos-em-moeda-estrangeira-por-servidores-de-autarquias-ou-repartições-do-governo-brasileiro-no-exterior), [F-ISENTO-18](#f-isento-18-incorporação-de-reservas-ao-capital--bonificações-em-ações), [F-ISENTO-19](#f-isento-19-transferências-patrimoniais-meação-e-dissolução-da-sociedade-conjugal-e-da-unidade-familiar), [F-ISENTO-20](#f-isento-20-ganhos-líquidos-em-ações-no-mercado-à-vista-em-bolsa-alienações-até-r-2000000-por-mês-para-o-conjunto-de-ações), [F-ISENTO-21](#f-isento-21-ganhos-líquidos-em-operações-com-ouro-ativo-financeiro-alienações-até-r-2000000-por-mês), [F-ISENTO-22](#f-isento-22-recuperação-de-prejuízos-em-renda-variável-bolsa-mercadorias-futuros-fii-e-fiagro), [F-ISENTO-23](#f-isento-23-rendimento-bruto-até-90-de-transporte-de-carga-e-serviços-com-trator-máquina-de-terraplenagem-colheitadeira-e-assemelhados), [F-ISENTO-24](#f-isento-24-rendimento-bruto-até-40-de-transporte-de-passageiros), [F-ISENTO-25](#f-isento-25-restituição-do-imposto-sobre-a-renda-de-anos-calendário-anteriores), [F-ISENTO-27](#f-isento-27-juros-referentes-aos-rendimentos-recebidos-acumuladamente), [F-ISENTO-28](#f-isento-28-pensão-alimentícia), [F-ISENTO-99](#f-isento-99-outros)
  - 3.6 Rendimentos Sujeitos à Tributação Exclusiva/Definitiva: [F-EXCL](#f-excl-rendimentos-sujeitos-à-tributação-exclusivadefinitiva-ficha), [F-EXCL-01](#f-excl-01-13º-salário), [F-EXCL-02](#f-excl-02-ganhos-de-capital-na-alienação-de-bens-eou-direitos), [F-EXCL-03](#f-excl-03-ganhos-de-capital-na-alienação-de-bens-direitos-e-aplicações-financeiras-adquiridos-em-moeda-estrangeira), [F-EXCL-04](#f-excl-04-ganhos-de-capital-na-alienação-de-moeda-estrangeira-em-espécie), [F-EXCL-05](#f-excl-05-ganhos-líquidos-em-renda-variável-bolsa-mercadorias-futuros-fii-e-fiagro), [F-EXCL-06](#f-excl-06-rendimentos-de-aplicações-financeiras), [F-EXCL-07](#f-excl-07-rendimentos-recebidos-acumuladamente-titular), [F-EXCL-08](#f-excl-08-13º-salário-recebido-pelos-dependentes), [F-EXCL-09](#f-excl-09-rendimentos-recebidos-acumuladamente-pelos-dependentes), [F-EXCL-10](#f-excl-10-juros-sobre-capital-próprio), [F-EXCL-11](#f-excl-11-participação-nos-lucros-ou-resultados-da-empresa-plr), [F-EXCL-12](#f-excl-12-aplicações-financeiras-e-lucros-e-dividendos-no-exterior-lei-147542023), [F-EXCL-13](#f-excl-13-prêmios-líquidos-obtidos-em-loterias-de-apostas-de-quota-fixa-lei-147902023), [F-EXCL-99](#f-excl-99-outros)
  - 3.7 Rendimentos Tributáveis de PJ com Exigibilidade Suspensa: [F-SUSP](#f-susp-rendimentos-tributáveis-de-pj-imposto-com-exigibilidade-suspensa), [F-SUSP-TIT](#f-susp-tit-rendimentos-tributáveis-de-pj-exigibilidade-suspensa---titular), [F-SUSP-DEP](#f-susp-dep-rendimentos-tributáveis-de-pj-exigibilidade-suspensa---dependentes)
  - 3.8 Rendimentos Recebidos Acumuladamente: [F-RRA](#f-rra-rendimentos-recebidos-acumuladamente-ficha), [F-RRA-TIT](#f-rra-tit-rendimentos-tributáveis-de-pj-recebidos-acumuladamente-pelo-titular), [F-RRA-DEP](#f-rra-dep-rendimentos-tributáveis-de-pj-recebidos-acumuladamente-pelos-dependentes)
  - 3.9 Imposto Pago/Retido: [F-IMPPAGO](#f-imppago-imposto-pagoretido-ficha), [F-IMPPAGO-01](#f-imppago-01-linha-01-imposto-complementar), [F-IMPPAGO-02](#f-imppago-02-linha-02-imposto-pago-no-exterior-pelo-titular-e-pelos-dependentes), [F-IMPPAGO-03](#f-imppago-03-linha-03-imposto-sobre-a-renda-na-fonte-lei-nº-110332004), [F-IMPPAGO-04](#f-imppago-04-linha-04-imposto-retido-na-fonte-do-titular), [F-IMPPAGO-05](#f-imppago-05-linha-05-imposto-retido-na-fonte-dos-dependentes), [F-IMPPAGO-06](#f-imppago-06-linha-06-carnê-leão-do-titular), [F-IMPPAGO-07](#f-imppago-07-linha-07-carnê-leão-dos-dependentes)
  - 3.10 Pagamentos Efetuados: [F-PAG](#f-pag-pagamentos-efetuados-ficha), [F-PAG-INSTR](#f-pag-instr-despesas-com-instrução-regras-comuns-aos-códigos-01-e-02), [F-PAG-01](#f-pag-01-código-01-despesas-com-instrução-no-brasil), [F-PAG-02](#f-pag-02-código-02-despesas-com-instrução-no-exterior), [F-PAG-MED](#f-pag-med-despesas-médicas-regras-comuns-aos-códigos-09-a-22-e-26), [F-PAG-09](#f-pag-09-código-09-fonoaudiólogos-no-brasil), [F-PAG-10](#f-pag-10-código-10-médicos-no-brasil), [F-PAG-11](#f-pag-11-código-11-dentistas-no-brasil), [F-PAG-12](#f-pag-12-código-12-psicólogos-no-brasil), [F-PAG-13](#f-pag-13-código-13-fisioterapeutas-no-brasil), [F-PAG-14](#f-pag-14-código-14-terapeutas-ocupacionais-no-brasil), [F-PAG-15](#f-pag-15-código-15-médicos-no-exterior), [F-PAG-16](#f-pag-16-código-16-dentistas-no-exterior), [F-PAG-17](#f-pag-17-código-17-psicólogos-no-exterior), [F-PAG-18](#f-pag-18-código-18-fisioterapeutas-no-exterior), [F-PAG-19](#f-pag-19-código-19-terapeutas-ocupacionais-no-exterior), [F-PAG-20](#f-pag-20-código-20-fonoaudiólogos-no-exterior), [F-PAG-21](#f-pag-21-código-21-hospitais-clínicas-e-laboratórios-com-saúde-humana-no-brasil), [F-PAG-22](#f-pag-22-código-22-hospitais-clínicas-e-laboratórios-com-saúde-humana-no-exterior), [F-PAG-26](#f-pag-26-código-26-planos-de-saúde-no-brasil), [F-PAG-PENSAO](#f-pag-pensao-pensão-alimentícia-judicial-ou-por-escritura-pública-regras-comuns-aos-códigos-30-31-33-e-34), [F-PAG-30](#f-pag-30-código-30-pensão-alimentícia-judicial-paga-a-residente-no-brasil), [F-PAG-31](#f-pag-31-código-31-pensão-alimentícia-judicial-paga-a-não-residente-no-brasil), [F-PAG-33](#f-pag-33-código-33-pensão-alimentícia-por-escritura-pública-separaçãodivórcio-paga-a-residente-no-brasil), [F-PAG-34](#f-pag-34-código-34-pensão-alimentícia-por-escritura-pública-paga-a-não-residente-no-brasil), [F-PAG-PREV](#f-pag-prev-previdência-complementar-e-fapi-regras-comuns-aos-códigos-36-e-37), [F-PAG-36](#f-pag-36-código-36-previdência-complementar-inclusive-fapi), [F-PAG-FAPI](#f-pag-fapi-fapi-fundos-de-aposentadoria-programada-individual-lançado-no-código-36), [F-PAG-37](#f-pag-37-código-37-contribuições-a-entidades-de-previdência-complementar-do--15-do-art-40-da-cf-funpresp-e-similares), [F-PAG-60](#f-pag-60-código-60-advogados-honorários-de-ações-judiciais-exceto-trabalhistas), [F-PAG-61](#f-pag-61-código-61-advogados-honorários-de-ações-judiciais-trabalhistas), [F-PAG-62](#f-pag-62-código-62-advogados-demais-honorários), [F-PAG-66](#f-pag-66-código-66-engenheiros-arquitetos-e-demais-profissionais-liberais-exceto-advogados-administrador-ou-corretor-de-imóveis), [F-PAG-70](#f-pag-70-código-70-aluguéis-de-imóveis), [F-PAG-71](#f-pag-71-código-71-administrador-de-imóvel), [F-PAG-72](#f-pag-72-código-72-corretor-de-imóveis), [F-PAG-76](#f-pag-76-código-76-arrendamento-rural), [F-PAG-99](#f-pag-99-código-99-outros), [F-PAG-IMPPS](#f-pag-impps-botão-importar-arquivo-do-plano-de-saúde)
  - 3.11 Doações Efetuadas: [F-DOA](#f-doa-doações-efetuadas-ficha), [F-DOA-LIMITES](#f-doa-limites-limites-das-deduções-de-incentivo), [F-DOA-40](#f-doa-40-código-40-doações-ao-estatuto-da-criança-e-do-adolescente), [F-DOA-41](#f-doa-41-código-41-incentivo-à-cultura), [F-DOA-42](#f-doa-42-código-42-incentivo-à-atividade-audiovisual), [F-DOA-43](#f-doa-43-código-43-incentivo-ao-desporto), [F-DOA-44](#f-doa-44-código-44-fundos-controlados-pelos-conselhos-da-pessoa-idosa), [F-DOA-45](#f-doa-45-código-45-pronaspcd), [F-DOA-46](#f-doa-46-código-46-pronon), [F-DOA-47](#f-doa-47-código-47-apoio-direto-a-projetos-da-cadeia-produtiva-da-reciclagem), [F-DOA-80](#f-doa-80-código-80-doações-em-espécie), [F-DOA-81](#f-doa-81-código-81-doações-em-bens-e-direitos), [F-DOA-99](#f-doa-99-código-99-outras)
  - 3.12 Doações Diretamente na Declaração: [F-DDD](#f-ddd-doações-diretamente-na-declaração-ficha), [F-DDD-ECA](#f-ddd-eca-aba-criança-e-adolescente), [F-DDD-IDOSO](#f-ddd-idoso-aba-pessoa-idosa)
  - 3.13 Bens e Direitos: [F-BENS](#f-bens-bens-e-direitos-ficha-declaração-de-ajuste-anual), [F-BENS-OBRIG](#f-bens-obrig-bens-e-direitos-que-devem-ser-declarados-e-dispensa), [F-BENS-DADOS](#f-bens-dados-dados-do-bem-campos-condicionais), [F-BENS-RENDASSOC](#f-bens-rendassoc-rendimentos-associados-ao-bem), [F-BENS-G01](#f-bens-g01-grupo-01-bens-imóveis), [F-BENS-G02](#f-bens-g02-grupo-02-bens-móveis), [F-BENS-G03](#f-bens-g03-grupo-03-participações-societárias), [F-BENS-G04](#f-bens-g04-grupo-04-aplicações-e-investimentos), [F-BENS-G05](#f-bens-g05-grupo-05-créditos), [F-BENS-G06](#f-bens-g06-grupo-06-depósitos-à-vista-e-numerário), [F-BENS-G07](#f-bens-g07-grupo-07-fundos), [F-BENS-G08](#f-bens-g08-grupo-08-criptoativos), [F-BENS-G99](#f-bens-g99-grupo-99-outros-bens-e-direitos), [F-BENS-COMUNS](#f-bens-comuns-situações-individuais-bens-comuns-condomínio-e-tipos-de-declaração), [F-BENS-DATAAQ](#f-bens-dataaq-informações-dos-bens-conforme-a-data-de-aquisição), [F-BENS-DFE](#f-bens-dfe-bens-e-direitos-na-declaração-final-de-espólio), [F-BENS-DSDP](#f-bens-dsdp-bens-e-direitos-na-declaração-de-saída-definitiva), [F-BENS-ALIEN-DFE](#f-bens-alien-dfe-bens-e-direitos-alienados-no-ano-final-de-espólio), [F-BENS-ESP-BENFEITORIAS](#f-bens-esp-benfeitorias-benfeitorias), [F-BENS-ESP-CONSORCIO](#f-bens-esp-consorcio-consórcios), [F-BENS-ESP-LEASING](#f-bens-esp-leasing-leasing), [F-BENS-ESP-VGBL](#f-bens-esp-vgbl-vgbl), [F-BENS-ESP-PERMUTA](#f-bens-esp-permuta-permuta), [F-BENS-ESP-IMOVEL-RURAL](#f-bens-esp-imovel-rural-imóvel-rural), [F-BENS-ESP-DOACAO](#f-bens-esp-doacao-doação-recebida), [F-BENS-ESP-HERANCA](#f-bens-esp-heranca-herança-meação-legado-ou-doação-inclusive-adiantamento-da-legítima), [F-BENS-ESP-DISSOLUCAO](#f-bens-esp-dissolucao-bens-recebidos-por-dissolução-da-sociedade-conjugal-ou-união-estável), [F-BENS-ESP-EXTERIOR](#f-bens-esp-exterior-bens-e-direitos-situados-no-exterior), [F-BENS-ESP-TRANSPARENCIA](#f-bens-esp-transparencia-regime-de-transparência-fiscal-de-entidade-controlada-art-8º-da-lei-147542023), [F-BENS-ESP-DEP-NAO-REMUNERADO](#f-bens-esp-dep-nao-remunerado-depósitos-não-remunerados-em-moeda-estrangeira-conta-cartão-de-débito-ou-crédito-no-exterior), [F-BENS-ESP-MOEDA-ESPECIE](#f-bens-esp-moeda-especie-moeda-estrangeira-mantida-em-espécie), [F-BENS-ESP-EMPRESTIMO](#f-bens-esp-emprestimo-empréstimo-concedido), [F-BENS-ESP-APLIC-EXTERIOR](#f-bens-esp-aplic-exterior-aplicações-financeiras-no-exterior-lei-147542023), [F-BENS-ESP-CONTROLADAS](#f-bens-esp-controladas-participação-em-entidades-controladas-no-exterior), [F-BENS-ESP-DESINCORPORADOS](#f-bens-esp-desincorporados-bens-e-direitos-desincorporados-do-patrimônio-em-2025), [F-BENS-ESP-ADQ-ALIENADOS](#f-bens-esp-adq-alienados-bens-e-direitos-adquiridos-e-alienados-em-2025), [F-BENS-ESP-NOVO-RESIDENTE](#f-bens-esp-novo-residente-bens-de-quem-adquiriu-ou-readquiriu-residência-no-brasil-em-2025)
  - 3.14 Dívidas e Ônus Reais: [F-DIV](#f-div-dívidas-e-ônus-reais)
  - 3.15 Espólio (ajuste com natureza 81): [F-ESPOLIO](#f-espolio-espólio-ajuste-anual-com-natureza-de-ocupação-81)
  - 3.16 Doações a Partidos Políticos e Candidatos: [F-PARTIDOS](#f-partidos-doações-a-partidos-políticos-e-candidatos-a-cargos-eletivos)
  - 3.17 Informações do Cônjuge: [F-CONJUGE](#f-conjuge-informações-do-cônjuge-ou-companheiro-inferido)
  - 3.18 Declaração de Saída Definitiva do País: [F-SAIDA-GERAL](#f-saida-geral-declaração-de-saída-definitiva-do-país-obrigações), [F-SAIDA-IDENT](#f-saida-ident-ficha-identificação-do-contribuinte-na-saída-definitiva), [F-SAIDA](#f-saida-ficha-saída), [F-SAIDA-DEDUCOES](#f-saida-deducoes-deduções-na-saída-definitiva), [F-SAIDA-DIVIDAS](#f-saida-dividas-dívidas-e-ônus-reais-na-saída-definitiva), [F-SAIDA-CALC](#f-saida-calc-cálculo-do-imposto-na-saída-definitiva), [F-SAIDA-IMPEXT](#f-saida-impext-compensação-do-imposto-pago-no-exterior-na-saída-definitiva), [F-SAIDA-PAGTO](#f-saida-pagto-pagamento-restituição-e-disposições-finais-da-saída-definitiva), [F-SAIDA-DARF](#f-saida-darf-darf-da-saída-definitiva), [F-SAIDA-MULTA](#f-saida-multa-multa-por-atraso-na-entrega-da-saída-definitiva)
  - 3.19 Declaração Final de Espólio: [F-DFE-GERAL](#f-dfe-geral-declaração-final-de-espólio-disposições-gerais), [F-DFE-SOBREPARTILHA](#f-dfe-sobrepartilha-sobrepartilha-bens-acrescidos-antes-e-após-a-partilha), [F-DFE-OBITO-CONJUGES](#f-dfe-obito-conjuges-ocorrência-de-morte-de-ambos-os-cônjuges), [F-DFE-MOEDA](#f-dfe-moeda-conversão-de-moeda-estrangeira-para-reais-espólio), [F-DFE-BENS](#f-dfe-bens-ficha-bens-e-direitos-final-de-espólio), [F-DFE-GCAP](#f-dfe-gcap-pagamento-do-imposto-sobre-ganhos-de-capital-espólio), [F-DFE-BENS-AR](#f-dfe-bens-ar-bens-da-atividade-rural-no-espólio), [F-DFE-IDENT](#f-dfe-ident-ficha-identificação-do-contribuinte-final-de-espólio), [F-DFE-FICHA](#f-dfe-ficha-ficha-espólio), [F-DFE-HERDEIROS](#f-dfe-herdeiros-ficha-herdeirosmeeiro), [F-DFE-DIVIDAS](#f-dfe-dividas-ficha-dívidas-e-ônus-reais-final-de-espólio), [F-DFE-CALCULO](#f-dfe-calculo-resumo-da-declaração---cálculo-do-imposto-devido-final-de-espólio), [F-DFE-PRAZO](#f-dfe-prazo-observações-finais-prazo-multa-pagamento-restituição), [F-DFE-DARF](#f-dfe-darf-preenchimento-do-darf-final-de-espólio), [F-DFE-PAGTO](#f-dfe-pagto-pagamento-do-imposto-final-de-espólio)
  - 3.20 Resumo da Declaração: [F-RESUMO-TRIB](#f-resumo-trib-resumo-rendimentos-tributáveis-modelo-completo), [F-RESUMO-DED](#f-resumo-ded-resumo-deduções-modelo-completo), [F-RESUMO-CALC](#f-resumo-calc-resumo-cálculo-do-imposto-deduções-legais), [F-RESUMO-QUOTAS](#f-resumo-quotas-resumo-imposto-a-pagar-formas-de-pagamento-quotas-e-débito-automático), [F-RESUMO-BANCO](#f-resumo-banco-resumo-informações-bancárias-restituição-e-débito), [F-RESUMO-SIMPL](#f-resumo-simpl-resumo-cálculo-do-imposto-desconto-simplificado), [F-RESUMO-EVOL](#f-resumo-evol-resumo-outras-informações-evolução-patrimonial), [F-RESUMO-OUTRAS](#f-resumo-outras-resumo-outras-informações-demais-linhas), [F-RESUMO-OPCAO](#f-resumo-opcao-opção-pela-tributação-ajuste-anual)
- [4. Demonstrativos](#4-demonstrativos) (56 itens)
  - 4.1 Atividade Rural: [D-AR-GERAL](#d-ar-geral-demonstrativo-da-atividade-rural-visão-geral-e-regras-de-período), [D-AR-OBRIG](#d-ar-obrig-obrigatoriedade-de-preenchimento-do-demonstrativo), [D-AR-OQUE](#d-ar-oque-o-que-deve-ser-declarado-atividade-rural), [D-AR-IMOVEL](#d-ar-imovel-dados-do-imóvel-explorado-abas-brasil-e-exterior), [D-AR-RD-BRASIL](#d-ar-rd-brasil-receitas-e-despesas---brasil), [D-AR-RD-EXTERIOR](#d-ar-rd-exterior-receitas-e-despesas---exterior), [D-AR-APUR](#d-ar-apur-apuração-do-resultado-considerações-gerais), [D-AR-APUR-L01](#d-ar-apur-l01-saldo-de-prejuízos-a-compensar-de-exercícios-anteriores), [D-AR-APUR-L02](#d-ar-apur-l02-receita-bruta-total), [D-AR-APUR-L03](#d-ar-apur-l03-despesa-de-custeio-e-investimento-total), [D-AR-APUR-L04](#d-ar-apur-l04-resultado-brasil--resultado-total-us-e-resultado-total-r-exterior), [D-AR-APUR-L05](#d-ar-apur-l05-limite-de-20-sobre-a-receita-bruta-total), [D-AR-APUR-L06](#d-ar-apur-l06-opção-pela-forma-de-apuração-do-resultado-tributável), [D-AR-APUR-L07](#d-ar-apur-l07-compensação-de-prejuízos-de-exercícios-anteriores), [D-AR-APUR-L08](#d-ar-apur-l08-resultado-tributável), [D-AR-APUR-L09](#d-ar-apur-l09-saldo-de-prejuízos-a-compensar), [D-AR-APUR-L10](#d-ar-apur-l10-apuração-do-resultado-não-tributável), [D-AR-APUR-L11](#d-ar-apur-l11-adiantamentos-recebidos-em-2025-por-conta-de-venda-para-entrega-futura), [D-AR-APUR-L12](#d-ar-apur-l12-adiantamentos-recebidos-até-2024-a-serem-informados-como-receitas-de-produtos-entregues-em-2025), [D-AR-REBANHO](#d-ar-rebanho-movimentação-do-rebanho-abas-brasil-e-exterior), [D-AR-BENS](#d-ar-bens-bens-da-atividade-rural), [D-AR-DIVIDAS](#d-ar-dividas-dívidas-vinculadas-à-atividade-rural-abas-brasil-e-exterior), [D-AR-IMPORT](#d-ar-import-importação-ar2025-livro-caixa-da-atividade-rural-2025-e-irpf2025)
  - 4.2 Ganhos de Capital: [D-GCAP-GERAL](#d-gcap-geral-demonstrativo-de-ganhos-de-capital-gcap-2025), [D-GCAP-IMOVEIS](#d-gcap-imoveis-ganhos-de-capital---bens-imóveis), [D-GCAP-MOVEIS](#d-gcap-moveis-ganhos-de-capital---direitosbens-móveis), [D-GCAP-PARTICIP](#d-gcap-particip-ganhos-de-capital---participações-societárias), [D-GCAP-MOEDA](#d-gcap-moeda-ganhos-de-capital---moedas-em-espécie)
  - 4.3 Renda Variável, operações comuns e day-trade: [D-RV-GERAL](#d-rv-geral-renda-variável---operações-comuns-e-day-trade-considerações-gerais), [D-RV-PROC](#d-rv-proc-procedimentos-para-apuração-dos-ganhos-líquidos-ou-perdas), [D-RV-TIPOS](#d-rv-tipos-tipos-de-mercado-ou-ativo--ganhos-líquidos-ou-perdas-linhas-de-entrada), [D-RV-L01](#d-rv-l01-resultado-líquido-do-mês), [D-RV-L02](#d-rv-l02-resultado-negativo-até-o-mês-anterior), [D-RV-L03](#d-rv-l03-base-de-cálculo-do-imposto), [D-RV-L04](#d-rv-l04-prejuízo-a-compensar), [D-RV-L05](#d-rv-l05-alíquota-do-imposto--imposto-devido), [D-RV-L06](#d-rv-l06-total-do-imposto-devido), [D-RV-L07](#d-rv-l07-ir-fonte-de-day-trade-no-mês), [D-RV-L08](#d-rv-l08-ir-fonte-de-day-trade-nos-meses-anteriores), [D-RV-L09](#d-rv-l09-ir-fonte-de-day-trade-a-compensar), [D-RV-L10](#d-rv-l10-ir-fonte-lei-nº-110332004-no-mês--nos-meses-anteriores--a-compensar), [D-RV-L11](#d-rv-l11-imposto-a-pagar), [D-RV-L12](#d-rv-l12-imposto-pago)
  - 4.4 Operações em FII ou Fiagro: [D-FII-GERAL](#d-fii-geral-operações-em-fii-ou-fiagro-conceito-e-considerações-gerais), [D-FII-DISTRIB](#d-fii-distrib-distribuição-dos-lucros--rendimentos-e-ganhos-auferidos-e-distribuídos), [D-FII-ALIEN](#d-fii-alien-alienação-ou-resgate-de-quotas), [D-FII-ISENCAO](#d-fii-isencao-isenção-dos-rendimentos-distribuídos), [D-FII-PROC](#d-fii-proc-procedimentos-para-apuração-fiifiagro), [D-FII-L01](#d-fii-l01-ganhos-líquidos-ou-perdas--resultado-líquido-do-mês), [D-FII-L02](#d-fii-l02-resultado-negativo-até-o-mês-anterior), [D-FII-L03](#d-fii-l03-base-de-cálculo-do-imposto), [D-FII-L04](#d-fii-l04-prejuízo-a-compensar), [D-FII-L05](#d-fii-l05-alíquota-do-imposto--imposto-devido), [D-FII-L06](#d-fii-l06-imposto-pago)
  - 4.5 Carnê-Leão: [D-CL-GERAL](#d-cl-geral-escrituração-do-carnê-leão-importada-titular-e-dependentes), [D-CL-PROGRAMA](#d-cl-programa-programa-carnê-leão-e-cac)
- [5. Pagamento do imposto, quotas, débito automático e Darf](#5-pagamento-do-imposto-quotas-débito-automático-e-darf) (7 itens)
  - 5.1 Pagamento: [S-PAG-DARF](#s-pag-darf-preenchimento-do-darf-do-irpf), [S-PAG-FORMAS](#s-pag-formas-formas-de-pagamento-do-imposto), [S-PAG-DEBITO](#s-pag-debito-débito-automático-das-quotas), [S-PAG-PARCEL](#s-pag-parcel-parcelamento-do-imposto), [S-PAG-QUOTAS-PRAZO](#s-pag-quotas-prazo-valor-das-quotas-pagas-dentro-do-prazo), [S-PAG-VENC](#s-pag-venc-vencimento-das-quotas), [S-PAG-APOS-PRAZO](#s-pag-apos-prazo-pagamento-após-o-prazo)
- [6. Operações do sistema: gravação, pendências, transmissão e recibo](#6-operações-do-sistema-gravação-pendências-transmissão-e-recibo) (11 itens)
  - 6.1 Operações: [S-ERROS-FREQ](#s-erros-freq-erros-mais-frequentes-orientação), [S-REQUISITOS](#s-requisitos-requisitos-e-instalação-do-programa-oficial), [S-PROBLEMAS-IMPRESSAO](#s-problemas-impressao-problemas-na-impressão-orientação), [S-SALVAMENTO](#s-salvamento-salvamento-automático), [S-UMA-ABERTA](#s-uma-aberta-uma-declaração-aberta-por-vez-e-base-local), [S-GRAVAR-ENTREGA](#s-gravar-entrega-gravação-da-declaração-para-entrega-arquivo-dec), [S-TRANSMISSAO](#s-transmissao-transmissão-receitanet-incorporado), [S-RECIBO](#s-recibo-recibo-de-entrega-e-número-do-recibo), [S-NOTIFICACAO-MAED](#s-notificacao-maed-notificação-de-lançamento-da-multa-por-atraso-emitida-pelo-pgd), [S-VALIDADOR](#s-validador-dados-do-validador-e-mensagens-pós-recepção), [S-CALAMIDADE](#s-calamidade-contribuintes-de-municípios-em-calamidade-rs-2024)
- [7. Serviços em nuvem](#7-serviços-em-nuvem) (7 itens)
  - 7.1 Serviços do barramento da RFB: [S-NUVEM-PREPREENCHIDA](#s-nuvem-prepreenchida-obter-pré-preenchida), [S-NUVEM-CARNELEAO](#s-nuvem-carneleao-importar-carnê-leão-web-govbr-ou-código-de-acesso), [S-NUVEM-DECONLINE](#s-nuvem-deconline-salvar-e-recuperar-declaração-on-line), [S-NUVEM-DARF](#s-nuvem-darf-emissão-de-darf-em-pdf-pelo-serviço-quota-eca-idoso-maed-maed-espólio), [S-NUVEM-MUNICIPIOS](#s-nuvem-municipios-atualização-da-tabela-de-municípios), [S-NUVEM-VENC-DFE](#s-nuvem-venc-dfe-data-de-vencimento-da-declaração-final-de-espólio), [S-NUVEM-CAPTCHA-TOKEN](#s-nuvem-captcha-token-captcha-token-de-acesso-e-certificado-digital)
- [8. Arquivo da declaração e formatos de troca](#8-arquivo-da-declaração-e-formatos-de-troca) (15 itens)
  - 8.1 Layout do arquivo e informes: [S-ARQ-GERAL](#s-arq-geral-estrutura-do-arquivo-de-declaração), [S-ARQ-REG-IDENT](#s-arq-reg-ident-registro-16-identificação-do-contribuinte), [S-ARQ-REG-TOTAIS](#s-arq-reg-totais-registros-17-18-19-e-20-totais-modelo-imposto-pago-e-resumo), [S-ARQ-REG-RENDIMENTOS](#s-arq-reg-rendimentos-registros-21-32-22-49-80-81-rendimentos-pj-pfexterior-e-exigibilidade-suspensa), [S-ARQ-REG-ISENTOS-EXCL](#s-arq-reg-isentos-excl-registros-23-24-31-33-82-e-83-a-99-isentos-exclusivos-e-detalhes), [S-ARQ-REG-PESSOAS](#s-arq-reg-pessoas-registros-25-35-29-dependentes-alimentandos-cônjuge), [S-ARQ-REG-PAGAMENTOS-DOACOES](#s-arq-reg-pagamentos-doacoes-registros-26-34-46-48-90-91-92), [S-ARQ-REG-BENS-DIVIDAS](#s-arq-reg-bens-dividas-registros-27-36-37-28), [S-ARQ-REG-ESPOLIO-SAIDA](#s-arq-reg-espolio-saida-registros-30-38-58-59-39), [S-ARQ-REG-RRA](#s-arq-reg-rra-registros-45-e-47), [S-ARQ-REG-RV](#s-arq-reg-rv-registros-40-41-42-43), [S-ARQ-REG-AR](#s-arq-reg-ar-registros-50-a-57), [S-ARQ-REG-GCAP](#s-arq-reg-gcap-registros-60-a-78), [S-ARQ-REG-RECIBO](#s-arq-reg-recibo-registros-fr-hr-dr-r9-hc-rc-nc-vc-mc-tc), [S-ARQ-INFORMES](#s-arq-informes-arquivos-de-informe-xml-e-mapeamentos-de-importação)
- [9. Tabelas](#9-tabelas) (7 itens)
  - 9.1 Tabelas da Ajuda: [S-TAB-PROGRESSIVA](#s-tab-progressiva-tabela-progressiva-anual-e-mensal-ano-calendário-2025), [S-TAB-DOLAR](#s-tab-dolar-tabela-de-conversão-para-reais-do-dólar-dos-eua-em-2025), [S-TAB-ATUALIZACAO](#s-tab-atualizacao-tabela-de-atualização-do-custo-de-bens-e-direitos), [S-TAB-DEPENDENCIA](#s-tab-dependencia-tabela-de-relação-de-dependência), [S-TAB-BENS](#s-tab-bens-tabela-de-códigos-de-bens-e-direitos), [S-TAB-PAGAMENTOS](#s-tab-pagamentos-tabela-de-códigos-de-pagamentos), [S-TAB-DOACOES](#s-tab-doacoes-tabela-de-códigos-de-doações)

## 1 Menus, telas e ações do programa

### 1.1 Menus principais, barra de ferramentas e rodapé

#### M-MENU-DECLARACAO Menu Declaração

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: barra de menu (Alt+D) e seção "Declaração" da barra lateral
- Itens: Nova, Abrir, Fechar, Excluir, Retificar, Verificar Pendências, Entregar Declaração, Imprimir (submenu), Salvar On-line, Recuperar On-line, Sair do Programa (detalhados em M-DECL-*)
- Exige do MCP: equivalência por ferramentas de ciclo de vida
- Cobertura no MCP Imposto de Renda: `criar_declaracao`, `abrir_declaracao`, `excluir_declaracao`, `criar_retificadora`; módulo model; prioridade P0; status implementada (`abrir_declaracao`, `criar_declaracao`, `criar_retificadora`, `excluir_declaracao`) (ver matriz)

#### M-MENU-IMPORTACOES Menu Importações

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: barra de menu (Alt+P) e seção "Importações" da barra lateral
- Itens: Carnê-Leão 2025, Atividade Rural 2025, Ganhos de Capital 2025, Informe de Rendimentos, Informe de Plano de Saúde (pág. 389)
- Exige do MCP: ferramentas `importar_*`
- Cobertura no MCP Imposto de Renda: `importar_carne_leao`, `importar_livro_caixa_rural`, `importar_gcap`, `importar_informe_rendimentos`, `importar_informe_plano_saude`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `calcular_carne_leao`, `definir_receitas_despesas_rurais`, `definir_rendimentos_pf_exterior`, `importar_informe_plano_saude`, `importar_informe_rendimentos`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### M-MENU-FICHAS Menu Fichas e navegação

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: barra de menu (Alt+F); barra lateral com grupos expansíveis (Declaração, Demonstrativos, Resumo, Impressão, Ferramentas, Ajuda); pág. 370 e 404
- Itens: Fichas da Declaração; Demonstrativos (Atividade Rural, Ganhos de Capital, Renda Variável); Resumo da Declaração
- Validações conhecidas: Tab ou Enter avança campo; Shift+Tab retorna; Alt+PgUp/PgDn navega meses nas grades mensais
- Exige do MCP: `listar_fichas` com estado de preenchimento (aplicáveis ao tipo de declaração)
- Cobertura no MCP Imposto de Renda: `listar_fichas`; módulo model; prioridade P1; status implementada (`listar_fichas`) (ver matriz)

#### M-MENU-FERRAMENTAS Menu Ferramentas

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: barra de menu (Alt+T) e barra lateral
- Itens: Cópia de Segurança (Gravar, Restaurar), Calculadora, Verificar Atualizações, Recuperação de Nomes (Ativar/Desativar, Limpar); demais ações do pacote `acoes` sem citação na Ajuda estão em M-FERR-* (inferido)
- Exige do MCP: ferramentas de cópia de segurança; demais sem equivalente
- Cobertura no MCP Imposto de Renda: `gravar_copia_seguranca`, `restaurar_copia_seguranca`; módulo model; prioridade P1; status implementada (`gravar_copia_seguranca`, `listar_copias_seguranca`, `restaurar_copia_seguranca`) (ver matriz)

#### M-MENU-AJUDA Menu Ajuda

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: barra de menu (Alt+J); pág. 367
- Itens: Conteúdo (Alt+Shift+C); Instruções de Preenchimento (Alt+Shift+I); Como Fazer para... (Alt+Shift+F); Perguntas e Respostas (Alt+Shift+G); Perguntas mais Frequentes (Alt+Shift+R); Sobre o IRPF 2026 (Alt+Shift+S); Ajuda de Acessibilidade (F11); fechar Ajuda (Alt+F4)
- Exige do MCP: `obter_ajuda` com conteúdo de regras por ficha e campo
- Cobertura no MCP Imposto de Renda: `obter_ajuda`; módulo tabelas; prioridade P2; status implementada (`obter_ajuda`) (ver matriz)

#### M-TOOLBAR Barra de ferramentas

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: topo da janela (classes JIRPFToolbar e JIRPFToolbarCustom, toolbar personalizável inferido)
- Itens: ícones de Nova, Abrir, Fechar, Excluir, Importar declaração 2025, Pré-preenchida, Verificar Pendências, Entregar, Imprimir (com itens), Calculadora, Ajuda (págs. 371 a 388)
- Exige do MCP: sem equivalente (atalhos de UI)
- Cobertura no MCP Imposto de Renda: `consultar_atalhos`; módulo nenhum; prioridade P2; status implementada (`consultar_atalhos`, `obter_ajuda`) (ver matriz)

#### M-RODAPE-COMPARATIVO Painel de imposto e comparativo no rodapé

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: parte inferior da tela abaixo da barra lateral (FAQ pág. 419); telas PainelImpostoPagar, PainelComparativo; classe ComparativoAction
- Campos: imposto a pagar ou a restituir nas duas formas (deduções legais e desconto simplificado) atualizado durante o preenchimento
- Exige do MCP: `calcular_imposto` com modelo "ambos" e recomendação
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

### 1.2 Tela inicial

#### M-INICIAL Tela "O que você deseja fazer?"

- Origem: notas/01-gerais.md
- Onde: tela de entrada; Ajuda pág. 39
- Aplica-se a: todos
- Campos: aba "Boas-vindas" (mensagens, dicas, novidades); links úteis; botão "Entrar com gov.br"; aba "Nova": Declaração de Ajuste Anual, Final de Espólio ou Saída Definitiva, e modo "Iniciar Importando Declaração de 2025", "Iniciar Declaração a partir da Pré-Preenchida" ou "Iniciar Declaração em Branco"; aba "Em Preenchimento": pesquisa por nome; ícones Abrir, Excluir, Entregar, Imprimir, Gravar Cópia de Segurança; aba "Transmitidas": pesquisa por nome; ícones Abrir, Retificar, Imprimir (Declaração, Recibo de Entrega, Darf do IRPF), Gravar Cópia de Segurança e Recibo
- Validações conhecidas: login gov.br obrigatório para obter a pré-preenchida (Identidade Digital Ouro ou Prata) e importar demonstrativo do Carnê-Leão; para obter rendimentos de dependentes na pré-preenchida, os dependentes devem dar procuração eletrônica ao CPF do titular
- Exige do MCP: listar declarações em preenchimento e transmitidas; criar nova (3 tipos x 3 modos); abrir, excluir, entregar (gerar arquivo), imprimir, cópia de segurança, retificar; não faz login gov.br (orientar o usuário a baixar o arquivo)
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `criar_declaracao`, `listar_declaracoes`; módulo model; prioridade P0; status implementada (`criar_declaracao`, `listar_declaracoes`) (ver matriz)

#### M-INICIAL-NOVA Aba "Nova" (tela "O que você deseja fazer?")

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: tela de entrada; págs. 39 e 371; telas PainelIRPFNovaDeclaracao, PainelCriarNovaDeclaracao, SubPainelDeclaracaoAnoAnterior, SubPainelDeclaracaoPrePreenchida, SubPainelDeclaracaoEmBranco, PainelImagemNovaDeclaracaoAjuste/Espolio/Saida
- Campos: tipo (Ajuste Anual, Final de Espólio, Saída Definitiva); modo: Iniciar a partir da Pré-Preenchida ("Declaração própria" ou "Declaração por procuração", com CPF do declarante), Iniciar Importando Declaração de 2025 (pasta e unidade), Iniciar em Branco (CPF e Nome)
- Validações conhecidas: pré-preenchida exige login gov.br Ouro ou Prata; rendimentos de dependentes na pré-preenchida exigem procuração eletrônica ou autorização no Meu Imposto de Renda
- Exige do MCP: `criar_declaracao` (tipo, modo, cpf, nome, arquivo de origem)
- Cobertura no MCP Imposto de Renda: `criar_declaracao`, `importar_declaracao_anterior`, `importar_pre_preenchida`; módulo model; prioridade P0; status parcial (`criar_declaracao`, `importar_declaracao_anterior`, `importar_pre_preenchida`, `listar_declaracoes`, `orientar_servico_externo`) (ver matriz)

#### M-INICIAL-EMPREENCH Aba "Em Preenchimento"

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: tela de entrada; telas PainelDeclaracoesPreenchimento, SubpainelDeclaracoesPreenchimento, PainelPesquisaPorNome
- Campos: pesquisa por nome; lista de declarações; ícones Abrir, Excluir, Entregar, Imprimir, Gravar Cópia de Segurança
- Exige do MCP: `listar_declaracoes` com filtro
- Cobertura no MCP Imposto de Renda: `listar_declaracoes`, `abrir_declaracao`; módulo model; prioridade P1; status implementada (`abrir_declaracao`, `listar_declaracoes`) (ver matriz)

#### M-INICIAL-TRANSMITIDAS Aba "Transmitidas"

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: tela de entrada; telas PainelDeclaracoesTransmitidas, SubpainelDeclaracoesTransmitidas
- Campos: pesquisa por nome; ícones Abrir, Retificar, Imprimir (Declaração, Recibo, Darf do IRPF), Gravar Cópia de Segurança e Recibo; símbolo de transmitida
- Exige do MCP: estado "transmitida" registrado a partir do recibo informado pelo usuário (`registrar_recibo`)
- Cobertura no MCP Imposto de Renda: `listar_declaracoes`, `registrar_recibo`, `criar_retificadora`; módulo model; prioridade P1; status implementada (`criar_retificadora`, `listar_declaracoes`, `registrar_recibo`) (ver matriz)

#### M-INICIAL-BOASVINDAS Aba "Boas-vindas", links úteis e "Entrar com gov.br"

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: tela de entrada; telas PainelAbaBemVindos, PainelIRPFBemVindos, PainelBemVindoToolTip
- Campos: mensagens, dicas, novidades; links úteis; botão Entrar com gov.br
- Exige do MCP: sem equivalente; orientação textual
- Cobertura no MCP Imposto de Renda: `obter_ajuda`; módulo tabelas; prioridade P2; status implementada (`obter_ajuda`) (ver matriz)

### 1.3 Menu Declaração

#### M-DECL-NOVA Declaração > Nova

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: menu, barra lateral, ícone, aba Nova, Ctrl+N; pág. 371
- Exige do MCP: `criar_declaracao`
- Cobertura no MCP Imposto de Renda: `criar_declaracao`; módulo model; prioridade P0; status implementada (`criar_declaracao`) (ver matriz)

#### M-DECL-ABRIR Declaração > Abrir

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: menu, barra lateral, ícone, aba Em Preenchimento, Ctrl+B; pág. 377; tela PainelAbrirDeclaracao
- Validações conhecidas: lista em ordem alfabética de nomes; botão imprimir relação; só uma declaração aberta por vez (abrir outra fecha a atual); mostra símbolo e nº do recibo se transmitida
- Exige do MCP: `abrir_declaracao` (o MCP pode operar várias por ID, sem a restrição)
- Cobertura no MCP Imposto de Renda: `abrir_declaracao`; módulo model; prioridade P0; status implementada (`abrir_declaracao`) (ver matriz)

#### M-DECL-FECHAR Declaração > Fechar

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: menu, barra lateral, ícone, Ctrl+F; pág. 377
- Validações conhecidas: não precisa salvar, dados gravados ao digitar; diferente de Sair do Programa
- Exige do MCP: sem equivalente necessário (persistência imediata)
- Cobertura no MCP Imposto de Renda: não se aplica; módulo model; prioridade P2; status não se aplica (ver matriz)

#### M-DECL-EXCLUIR Declaração > Excluir

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: menu, barra lateral, ícone, aba Em Preenchimento, Ctrl+E; pág. 378; tela PainelExcluirDeclaracao
- Campos: seleção de uma ou várias (Ctrl, Shift), em preenchimento e transmitidas
- Exige do MCP: `excluir_declaracao` com confirmação
- Cobertura no MCP Imposto de Renda: `excluir_declaracao`; módulo model; prioridade P1; status implementada (`excluir_declaracao`) (ver matriz)

#### M-DECL-RETIFICAR Declaração > Retificar

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: barra lateral, aba Transmitidas (ícone), ficha Identificação "Declaração retificadora", Ctrl+G; pág. 378; tela PainelRetificarDeclaracao
- Validações conhecidas: lista de transmitidas; retificadora exige nº do recibo da anterior (12 dígitos)
- Exige do MCP: `criar_retificadora`
- Cobertura no MCP Imposto de Renda: `criar_retificadora`; módulo model; prioridade P1; status implementada (`criar_retificadora`) (ver matriz)

#### M-DECL-PENDENCIAS Declaração > Verificar Pendências

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: menu, barra lateral, ícone, F5; págs. 379 e 414; telas PainelVerificarPendencias, PainelVerificarPendenciasAcessivel, PainelPendencias
- Validações conhecidas: só com declaração aberta; ERROS impedem a entrega (ex.: data de nascimento em branco ou inválida); AVISOS não impedem (ex.: título eleitoral em branco, "Valor do bem não foi informado, item nº xxx"); clicar na pendência leva ao campo; catálogo de mensagens do programa em `Mensagens.properties` (727 chaves, ex.: "Número de inscrição no CPF não pode ser o mesmo do titular", "A declaração não possui Avisos e Erros impeditivos")
- Exige do MCP: `listar_pendencias` com severidade, ficha, campo e mensagem
- Cobertura no MCP Imposto de Renda: `listar_pendencias`; módulo validate; prioridade P0; status implementada (`validar_declaracao`) (ver matriz)

#### M-DECL-ENTREGAR Declaração > Entregar Declaração

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: menu, barra lateral (também no rodapé do menu lateral com declaração aberta), ícone, aba Em Preenchimento, Ctrl+I; com certificação digital Ctrl+Shift+B; sem certificação digital Ctrl+Shift+E; págs. 382 e 420; telas PainelGravarEntrega, PainelGravarTransmitir, PainelGravarTransmitirPendenciasNaoImpeditivas, PainelGravacaoEntregaPendenciasNaoImpeditivas, PainelGravacaoEntregaModeloMelhor, PainelInformaRegimeTributacao, PainelDadosRestituicao, PainelDadosDebitoAutomatico; ações GravarEntregaAction e TransmitirDeclaracaoAction
- Validações conhecidas: verifica pendências antes; erros bloqueiam; avisos permitem; aviso de modelo de tributação mais vantajoso (inferido pelo nome PainelGravacaoEntregaModeloMelhor); confirma regime, dados de restituição e débito automático (inferido pelos nomes de tela); recibo gravado automaticamente e disponível na aba Transmitidas; única forma de apresentação é a Internet, sem programa adicional (Receitanet incorporado)
- Exige do MCP: impossível transmitir fora do PGD; alternativa: `gerar_dbk` + `instruir_transmissao`
- Cobertura no MCP Imposto de Renda: `gerar_dbk`, `listar_pendencias`, `instruir_transmissao`; módulo dbk; prioridade P0; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `instruir_transmissao`, `validar_declaracao`, `verificar_integridade_arquivo`) (ver matriz)

#### M-DECL-SALVAR-ONLINE Declaração > Salvar On-line (F6)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: atalho F6 (atalhos.txt); ação SalvarOnlineAction; serviço `salvarDecOnline` do barramento
- Regras: guarda a declaração em preenchimento na nuvem da RFB vinculada à conta gov.br (inferido pelo nome do serviço)
- Exige do MCP: impossível (serviço autenticado); alternativa: cópia local e orientação
- Cobertura no MCP Imposto de Renda: `gravar_copia_seguranca`, `orientar_servico_externo`; módulo model; prioridade P2; status implementada (`gravar_copia_seguranca`, `orientar_servico_externo`) (ver matriz)

#### M-DECL-RECUPERAR-ONLINE Declaração > Recuperar On-line (F7)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: atalho F7; ação RecuperarDecOnlineAction; tela PainelRecuperarDeclaracaoOnline; serviço `recuperarDecOnline`
- Exige do MCP: impossível; alternativa: usuário recupera no PGD e grava cópia de segurança para o MCP importar
- Cobertura no MCP Imposto de Renda: `restaurar_copia_seguranca`, `orientar_servico_externo`; módulo model; prioridade P2; status implementada (`listar_copias_seguranca`, `orientar_servico_externo`, `restaurar_copia_seguranca`) (ver matriz)

#### M-DECL-SAIR Declaração > Sair do Programa

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: menu, Alt+F4; pág. 387
- Exige do MCP: não se aplica
- Cobertura no MCP Imposto de Renda: não se aplica; módulo nenhum; prioridade P2; status não se aplica (ver matriz)

#### M-DECL-CONVERTER Converter declaração (inferido)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ação ConverterDeclaracaoAction (sem citação na Ajuda)
- Regras: provável conversão entre tipos de declaração (por exemplo, ajuste para saída ou espólio) ou entre modelos (inferido)
- Exige do MCP: `definir_identificacao` com troca de tipo e revalidação das fichas
- Observações: confirmar no programa
- Cobertura no MCP Imposto de Renda: `definir_identificacao`; módulo model; prioridade P2; status implementada (`definir_identificacao`) (ver matriz)

### 1.4 Impressão

#### M-IMPR-DECLARACAO Imprimir Declaração

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+P; págs. 378 e 415; telas PainelImprimirDeclaracao, PainelSelecaoTipoImpressao, PainelSelecaoTipoImpressaoNova; relatórios DIRPF2026, FolhaDeRosto e 60 sub-relatórios por ficha (relDeclaracao*)
- Campos: Toda a declaração ou Partes da declaração (seleção de fichas, inclusive Ganhos de Capital); Visualizar; salvar em PDF (SalvarImagemDeclaracaoAction)
- Exige do MCP: `gerar_relatorio_declaracao` (PDF ou HTML, todo ou por fichas), sem reproduzir layout oficial protegido (layout próprio)
- Cobertura no MCP Imposto de Renda: `gerar_relatorio_declaracao`; módulo model; prioridade P1; status implementada (`gerar_relatorio_declaracao`, `gravar_relatorio`) (ver matriz)

#### M-IMPR-REND-PF Imprimir Rendimentos Recebidos de PF

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+Shift+F; pág. 379; tela PainelImprimirRendimentosRecebidosPF; relatórios relDeclaracaoRendimentosTributaveisPF*
- Campos: escolha da declaração; visualizar; PDF
- Exige do MCP: `gerar_relatorio_declaracao` com parte "rendimentos_pf"
- Cobertura no MCP Imposto de Renda: `gerar_relatorio_declaracao`; módulo model; prioridade P2; status implementada (`gerar_relatorio_declaracao`, `gravar_relatorio`) (ver matriz)

#### M-IMPR-RECIBO Imprimir Recibo de Entrega

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+R; págs. 383 e 421; tela PainelImprimirRecibo; relatório relRecibo; ação SalvarImagemReciboAction
- Validações conhecidas: só após a apresentação; recibo de uma via com duas páginas; nº do recibo de 12 dígitos na folha 2; impressão em outro computador via cópia "última declaração entregue e recibo"
- Exige do MCP: impossível gerar recibo oficial; alternativa: orientar a impressão no PGD e `registrar_recibo` para guardar o número
- Cobertura no MCP Imposto de Renda: `registrar_recibo`, `instruir_transmissao`; módulo importacao; prioridade P1; status implementada (`criar_retificadora`, `instruir_transmissao`, `registrar_recibo`) (ver matriz)

#### M-IMPR-DARF Imprimir Darf do IRPF

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+D; aba Transmitidas; págs. 385 e 415; telas PainelImprimirDARFCodigoBarras, PainelImprimirDARFEscolherCota; relatório relDarfCodBarra; serviço `obterPdfDarfQuota`
- Campos: escolha da quota (todas, inclusive em atraso, com Selic desde 01/06/2026 e multa de 0,33% ao dia até 20%); visualizar e PDF
- Validações conhecidas: valor mínimo impresso R$ 10,00; quotas de retificadora com mudança de imposto: emitir no e-CAC (Meu Imposto de Renda, Consultar Débitos, Emitir DARF e Alterar Quotas); todos os Darf têm código de barras
- Exige do MCP: `gerar_darf` com dados calculados (código 0211, período, vencimento, principal, multa, juros); código de barras e número do documento oficiais não reproduzíveis: orientar Sicalc, PGD ou e-CAC
- Cobertura no MCP Imposto de Renda: `gerar_darf`, `simular_quotas`; módulo calc; prioridade P0; status implementada (`calcular_quotas`, `gerar_darf`) (ver matriz)

#### M-IMPR-DARF-MAED Imprimir Darf de Multa por Atraso na Entrega

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+U; pág. 385; tela PainelImprimirDARFMaed; relatórios relDarfMulta, relNotificacao, relNotificacaoEspolio, relNotificacaoSaida; serviços `obterPdfDarfMaed` e `obterPdfDarfMaedEspolio`
- Exige do MCP: `calcular_multa_atraso` e orientação; Darf oficial da notificação só pelo PGD
- Cobertura no MCP Imposto de Renda: `calcular_multa_atraso`, `gerar_darf`; módulo calc; prioridade P1; status implementada (`calcular_multa_atraso`, `gerar_darf`) (ver matriz)

#### M-IMPR-DARF-ECA Imprimir Darf, Doações Diretamente na Declaração, ECA

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+W; pág. 386; tela PainelImprimirDarfECA; relatório relDarfDoacaoECA; serviço `obterPdfDarfECA`
- Validações conhecidas: código 3351; valor mínimo R$ 10,00
- Exige do MCP: `gerar_darf` tipo "doacao_eca"
- Cobertura no MCP Imposto de Renda: `gerar_darf`; módulo calc; prioridade P1; status implementada (`gerar_darf`) (ver matriz)

#### M-IMPR-DARF-IDOSO Imprimir Darf, Doações Diretamente na Declaração, Pessoa Idosa

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+Y; pág. 386; tela PainelImprimirDarfEstatutoIdoso; relatório relDarfDoacaoEstatutoIdoso; serviço `obterPdfDarfIdoso`
- Validações conhecidas: código 9090; valor mínimo R$ 10,00
- Exige do MCP: `gerar_darf` tipo "doacao_idoso"
- Cobertura no MCP Imposto de Renda: `gerar_darf`; módulo calc; prioridade P1; status implementada (`gerar_darf`) (ver matriz)

#### M-IMPR-RELACAO Imprimir Relação de Declarações

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+L; pág. 387; tela PainelImprimirRelacaoDeclaracoes; relatório relDeclaracoes
- Campos: relação das declarações em preenchimento e transmitidas, ordenável por tipo, modelo, nome ou CPF
- Exige do MCP: `listar_declaracoes` (formato de relatório opcional)
- Cobertura no MCP Imposto de Renda: `listar_declaracoes`; módulo model; prioridade P2; status implementada (`listar_declaracoes`) (ver matriz)

#### M-IMPR-COMUNICACAO-SAIDA Imprimir Comunicação à Fonte Pagadora de Saída do País

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+Shift+S; pág. 387; tela PainelImprimirComunicacaoSaida; relatórios relComunicacaoSaida, relComunicacaoSaidaDetalhe; campo DT_COMUNICACAO_SAIDA no registro 21 (inferido: data da comunicação por fonte pagadora)
- Exige do MCP: `gerar_comunicacao_saida` (documento por fonte pagadora)
- Cobertura no MCP Imposto de Renda: `gerar_comunicacao_saida`; módulo model; prioridade P1; status implementada (`gerar_comunicacao_saida`) (ver matriz)

#### M-IMPR-INFORME-REND Imprimir Informe de Rendimentos (arquivo XML da fonte)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+Alt+R; págs. 391 e 402; relatórios relInformeRendimentosPJ*
- Campos: seleção do XML; Visualizar ou Imprimir
- Exige do MCP: `ler_informe` (visualização legível do XML)
- Cobertura no MCP Imposto de Renda: `ler_informe`; módulo importacao; prioridade P2; status implementada (`ler_informe`) (ver matriz)

#### M-IMPR-INFORME-PS Imprimir Informe de Plano de Saúde

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ctrl+Alt+I; págs. 392 e 402; relatórios relInformePlanoSaude*
- Exige do MCP: `ler_informe`
- Cobertura no MCP Imposto de Renda: `ler_informe`; módulo importacao; prioridade P2; status implementada (`ler_informe`) (ver matriz)

#### M-IMPR-DARF-AUXILIO Darf de devolução do Auxílio Emergencial (inferido)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ações ImprimirDarfAuxilioEmergencialAction; telas PainelImprimirDarfAuxilioEmergencial, PainelMensagemAuxilioEmergencial; relatórios relDarfAuxilio, relDarfAuxilioEmergencial; serviço `calcularMultaJurosDarfAuxilio`
- Regras: funcionalidade herdada de exercícios anteriores; a Ajuda 2026 não a descreve
- Exige do MCP: fora de escopo (P2); orientar o serviço da RFB
- Cobertura no MCP Imposto de Renda: `orientar_servico_externo`; módulo nenhum; prioridade P2; status implementada (`orientar_servico_externo`) (ver matriz)

#### M-IMPR-CRITERIOS-OBRIG Impressão de critérios de obrigatoriedade (inferido)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: tela PainelImprimirCriteriosObrigatoriedade; relatório relNotificacaoCondicoesObrigatoriedade
- Exige do MCP: `verificar_obrigatoriedade` com relatório
- Cobertura no MCP Imposto de Renda: `verificar_obrigatoriedade`; módulo validate; prioridade P2; status implementada (`verificar_obrigatoriedade`) (ver matriz)

#### M-IMPR-SALVAR-PDF Visualizar e salvar em PDF

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ações SalvarImagemDeclaracaoAction, SalvarImagemReciboAction, SalvarImagemDarfCodBarrasAction, SalvarImagemDarfECAAction, SalvarImagemDarfMultaAction, SalvarImagemRelacaoDeclaracoesAction, SalvarImagemComunicacaoSaidaAction
- Exige do MCP: saída em PDF das ferramentas de relatório
- Cobertura no MCP Imposto de Renda: `gerar_relatorio_declaracao`, `gerar_darf`; módulo model; prioridade P2; status implementada (`gerar_darf`, `gerar_relatorio_declaracao`, `gravar_relatorio`) (ver matriz)

### 1.5 Importações

#### M-IMP-ANO-ANTERIOR Importar dados da Declaração de 2025

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ícone da barra de ferramentas; aba Nova "Iniciar Importando Declaração de 2025"; ação ImportarAnoAnteriorAction; págs. 373, 396 e 397; tela PainelImportarProgramasIRPF, PainelResultadoImportacao(oes)
- Campos: unidade e pasta de origem; seleção de um, alguns ou todos os CPF; lista automática das transmitidas na pasta padrão do IRPF2025
- Dados recuperados: Identificação (todos); dependentes e alimentandos (nome, CPF, nascimento); fontes pagadoras PJ (CNPJ/CPF e nome); Pagamentos (nome e CPF/CNPJ do beneficiário); bens e dívidas com Situação 31/12/2024 diferente de zero (código, discriminação, localização, país, valor); imóveis rurais explorados (todos os dados); bens da AR (código e discriminação); estoque final do rebanho; dívidas rurais; saldo de prejuízo rural (Como fazer pág. 373, embora a nota 06 diga que o prejuízo não é importado: divergência); nº do recibo de 2025 se importado do arquivo transmitido ou da cópia "última declaração transmitida e recibo"
- Validações conhecidas: aceita arquivo gravado para entrega, transmitido ou cópia da última transmitida com recibo; nome do arquivo `CPF-IRPF-A-2025-2024-ORIGI.DEC` (A ajuste, E espólio, S saída; ORIGI ou RETIF); apaga dados já digitados do CPF (com aviso); campos importados editáveis; relatório de importadas e não importadas
- Exige do MCP: `importar_declaracao_anterior` (leitor do formato .DEC do ano anterior) sem apagar silenciosamente; relatório do que falta preencher
- Cobertura no MCP Imposto de Renda: `importar_declaracao_anterior`; módulo importacao; prioridade P0; status implementada (`importar_declaracao_anterior`, `listar_declaracoes`) (ver matriz)

#### M-IMP-PREPREENCHIDA Importar Declaração Pré-Preenchida

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ícone; aba Nova "Iniciar a partir da Pré-Preenchida"; ação ImportarPrepreenchidaAction; págs. 374, 398 e 399; serviço `obterPrePreenchida`
- Dados recuperados: cadastro CPF; dados da declaração de 2025 (identificação, dependentes, fontes, pagamentos, bens, recibo); informações de 2025 de eSocial, EFD-Reinf, Dmed, Dimob, Carnê-Leão (rendimentos do profissional e pagamentos dos clientes), e-Financeira, DOI, DBF, criptoativos (IN RFB 1.888/2019) e convênios
- Validações conhecidas: gov.br Ouro ou Prata; uso opcional; apaga dados já digitados (com aviso); conferência e completude são responsabilidade do contribuinte; dependentes exigem procuração
- Exige do MCP: impossível baixar (autenticado); alternativa: usuário obtém o arquivo da pré-preenchida (Meu Imposto de Renda ou PGD) e o MCP `importar_pre_preenchida` lê o arquivo, ou o usuário importa no PGD e grava cópia para o MCP
- Cobertura no MCP Imposto de Renda: `importar_pre_preenchida`, `orientar_servico_externo`; módulo importacao; prioridade P1; status parcial (`importar_pre_preenchida`, `orientar_servico_externo`) (ver matriz)

#### M-IMP-INFORME-REND Importar Informe de Rendimentos

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Importações > Informe de Rendimentos; "Importar arquivo da fonte pagadora" no rodapé de Rendimentos PJ (Alt+I); Ctrl+Shift+R; ação ImportarInformeRendimentosAction; págs. 390 e 400; telas do pacote `declaracao.assistida.informerendimentos` (pré-visualização por item: Rend. PJ, Exigibilidade Suspensa, RRA, Pensão, Previdência Complementar, Pagamentos, Isentos ou Exclusivos)
- Dados recuperados: total de rendimentos (inclusive férias); contribuição previdenciária oficial; IRRF; 13º; previdência complementar; pensão alimentícia; isentos (65 anos, moléstia grave, lucros e dividendos, sócio de ME/EPP, indenizações e PDV, benefícios indiretos e reembolsos Voluntários da Copa, bolsas de médico e não médico, IRRF compensado de anos anteriores, diárias, ajuda de custo, abono pecuniário); exclusivos; RRA; exigibilidade suspensa
- Validações conhecidas: layout público da RFB (xsd `informe_fontes_pagadoras.xsd`, `informe_tipos.xsd`); só adiciona; cada informe uma única vez (repetir duplica); conferência do contribuinte
- Exige do MCP: `importar_informe_rendimentos` com detecção de duplicidade
- Cobertura no MCP Imposto de Renda: `importar_informe_rendimentos`; módulo importacao; prioridade P1; status implementada (`importar_informe_rendimentos`) (ver matriz)

#### M-IMP-INFORME-PS Importar Informe de Plano de Saúde

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Importações; rodapé de Pagamentos; Ctrl+Shift+I; ação ImportarInformePlanoSaudeAction; págs. 391 e 401
- Exige do MCP: `importar_informe_plano_saude` (ver F-PAG-IMPPS)
- Cobertura no MCP Imposto de Renda: `importar_informe_plano_saude`; módulo importacao; prioridade P1; status implementada (`importar_informe_plano_saude`) (ver matriz)

#### M-IMP-CARNE-LEAO Importar Carnê-Leão 2025

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Importações > Carnê-Leão 2025 (Ctrl+Shift+C); botão na ficha PF/Exterior (Alt+I); ação ImportarCarneLeaoAction; telas PainelImportacaoCarneLeao, PainelLoginGovBrOuCodigoAcesso, PainelSolicitarCodigoAcesso, PainelInformarVersaoCarneLeao; serviços `importarCarneLeaoComLoginGovBr` e `importarCarneLeaoComCodigoAcesso`
- Regras: dados do Carnê-Leão Web do titular e de dependentes (CPF na ficha Dependentes); autenticação por gov.br ou código de acesso (inferido pelos nomes); não sobrescreve CNPJ já presente em Rendimentos PJ nem imposto pago no exterior já informado (nota 02)
- Exige do MCP: impossível baixar; alternativa: usuário exporta/baixa o demonstrativo no e-CAC e o MCP `importar_carne_leao` lê o arquivo (formato a mapear; classes RepositorioTxtDadosCarneLeao e RepositorioTxtDadosCarneLeaoWeb indicam formatos TXT antigo e Web)
- Cobertura no MCP Imposto de Renda: `importar_carne_leao`, `orientar_servico_externo`; módulo importacao; prioridade P1; status parcial (`calcular_carne_leao`, `definir_rendimentos_pf_exterior`, `orientar_servico_externo`) (ver matriz)

#### M-IMP-AR Importar Atividade Rural 2025

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Importações (Ctrl+Shift+A); botão Importar em Receitas e Despesas; ação ImportarAtividadeRuralAction
- Exige do MCP: `importar_livro_caixa_rural` (ver D-AR-IMPORT)
- Cobertura no MCP Imposto de Renda: `importar_livro_caixa_rural`; módulo importacao; prioridade P1; status parcial (`definir_receitas_despesas_rurais`, `orientar_servico_externo`) (ver matriz)

#### M-IMP-GCAP Importar Ganhos de Capital 2025

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Importações (Ctrl+Shift+G); botão Importar em cada tela do demonstrativo; ação ImportarGCAPAction; FAQ págs. 409 a 411
- Validações conhecidas: só arquivo "Exportar para o IRPF2026" do GCAP2025 (não cópia de segurança, que pode ter erros); arquivo do CPF da declaração ou de dependente cadastrado; nova importação do mesmo CPF substitui todos os dados de GCAP daquele CPF (outros CPF intactos); excluir o dependente exclui seu GCAP; GCAP2026 não importa no IRPF2026; para alterar, corrigir no GCAP2025, exportar e reimportar; o demonstrativo só é preenchido por importação; impressão pelo GCAP ou por Imprimir > Partes > Ganhos de Capital
- Exige do MCP: `importar_gcap` (XML; mapeamento `mapeamentoXmlGCAP.xml`); substituição por CPF
- Cobertura no MCP Imposto de Renda: `importar_gcap`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### M-IMP-SUGESTAO Sugestão de importação (inferido)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ação SugereImportacaoAction; tela PainelConfirmacaoImportacao
- Regras: provável oferta automática de importar a declaração anterior encontrada na pasta padrão (inferido, coerente com pág. 373)
- Exige do MCP: `listar_declaracoes` pode apontar arquivos .DEC do ano anterior encontrados na pasta indicada
- Cobertura no MCP Imposto de Renda: `listar_declaracoes`, `importar_declaracao_anterior`; módulo importacao; prioridade P2; status implementada (`importar_declaracao_anterior`, `listar_declaracoes`) (ver matriz)

### 1.6 Ferramentas

#### M-FERR-COPIA-GRAVAR Gravar Cópia de Segurança

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ferramentas > Cópia de segurança > Gravar; barra lateral Gravar Cópia; abas Em Preenchimento e Transmitidas; Ctrl+K; págs. 380 e 418; telas PainelGravarCopiaSeguranca, PainelGravarCopiaSegurancaPasso2, PainelGravarCopiaDeclaracaoTransmitida
- Campos: tipo: "Cópia da declaração com os dados atuais" (estado atual, sem recibo, não serve para entrega); "Cópia da declaração para entrega à RFB" (arquivo transmissível depois pelo Receitanet); "Cópia da última declaração entregue e do recibo de entrega" (declaração transmitida e recibo; importável no IRPF2027; permite imprimir o recibo em outro computador); seleção de uma, algumas ou todas; unidade e pasta de destino
- Exige do MCP: `gravar_copia_seguranca` (formato próprio do MCP Imposto de Renda e, quando possível, `gerar_dbk` para o formato de entrega)
- Cobertura no MCP Imposto de Renda: `gravar_copia_seguranca`, `gerar_dbk`; módulo model; prioridade P1; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `gravar_copia_seguranca`, `verificar_integridade_arquivo`) (ver matriz)

#### M-FERR-COPIA-RESTAURAR Restaurar Cópia de Segurança

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ferramentas > Cópia de Segurança > Restaurar; barra lateral Restaurar; Ctrl+T; págs. 381 e 418
- Validações conhecidas: lista por CPF em ordem crescente; restaurar sobre declaração existente substitui todos os dados (com alerta); transmitidas também podem ser restauradas
- Exige do MCP: `restaurar_copia_seguranca` (formato próprio) e leitura de cópias do PGD via `importar_declaracao_anterior` ou leitor de .DEC (lacuna: formato de cópia do PGD 2026 a validar)
- Cobertura no MCP Imposto de Renda: `restaurar_copia_seguranca`, `importar_declaracao_anterior`; módulo model; prioridade P1; status implementada (`importar_declaracao_anterior`, `listar_copias_seguranca`, `listar_declaracoes`, `restaurar_copia_seguranca`) (ver matriz)

#### M-FERR-CALCULADORA Calculadora

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ferramentas > Calculadora; ícone; Ctrl+Alt+A; pág. 388; telas CalculadoraForm, DisplayForm, HistoricoForm, TecladoForm, CancelarTransporteForm
- Regras: botão transportar leva o valor ao campo numérico
- Exige do MCP: não se aplica (o assistente calcula)
- Cobertura no MCP Imposto de Renda: `calcular_expressao`; módulo nenhum; prioridade P2; status implementada (`calcular_expressao`) (ver matriz)

#### M-FERR-ATUALIZACOES Verificar Atualizações

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ferramentas > Verificar Atualizações; Alt, T, V; automática ao abrir; pág. 367; telas PainelVerificarAtualizacao, PainelAvisoVerificarAtualizacoes, PainelDownloadAtualizacoes; ação VerificarNovaVersaoAction
- Regras: atualização opcional ou obrigatória (obrigatória impede a entrega); reinicia o programa; se falhar, download manual
- Exige do MCP: `verificar_versao_tabelas` (versão das tabelas e parâmetros embarcados no MCP Imposto de Renda x versão do PGD conhecida); alerta de PGD desatualizado ao instruir a transmissão
- Cobertura no MCP Imposto de Renda: `verificar_versao_tabelas`; módulo tabelas; prioridade P2; status implementada (`verificar_versao_tabelas`) (ver matriz)

#### M-FERR-RECNOMES Recuperação de Nomes (Ativar/Desativar, Limpar)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: Ferramentas > Recuperação de Nomes; Alt, T, R, T (ativar) e Alt, T, R, L (limpar); pág. 368; ações AtivarRecuperarNomesAction, LimparCacheNomesAction
- Regras: preenche Nome a partir de CPF/CNPJ já digitados ou importados (cache local, não vem da RFB); ativado por padrão
- Exige do MCP: `buscar_nome_por_documento` no histórico local da declaração (P2)
- Cobertura no MCP Imposto de Renda: `buscar_nome_por_documento`; módulo model; prioridade P2; status implementada (`buscar_nome_por_documento`) (ver matriz)

#### M-FERR-LOGIN-GOVBR Entrar e sair com gov.br

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: botão na tela inicial; ações LoginGovAction, LogoutGovAction; telas PainelProcessaLogin, PainelCaptchaAb; serviços de captcha, token e UsuarioLogado
- Exige do MCP: impossível (autenticação); fora do escopo por desenho (servidor 100% local)
- Cobertura no MCP Imposto de Renda: `orientar_servico_externo`; módulo nenhum; prioridade P2; status implementada (`orientar_servico_externo`) (ver matriz)

#### M-FERR-PAGINAS Links para páginas da RFB (IRPF, DTE) e navegador

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ações PaginaIRPFAction, PaginaDTEAction, AbrirNavegadorAction (inferido: abrem páginas do IRPF e do Domicílio Tributário Eletrônico)
- Exige do MCP: orientação com links públicos
- Cobertura no MCP Imposto de Renda: `obter_ajuda`; módulo tabelas; prioridade P2; status implementada (`obter_ajuda`) (ver matriz)

#### M-FERR-MEMORIA Memória do IRPF (inferido)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ação MemoriaIRPFAction (sem citação na Ajuda)
- Exige do MCP: a confirmar (P2)
- Cobertura no MCP Imposto de Renda: não se aplica; módulo nenhum; prioridade P2; status não se aplica (ver matriz)

#### M-FERR-LEAOZINHO Assistente "Leãozinho" (inferido)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ação LeaozinhoAction (sem citação na Ajuda)
- Exige do MCP: a confirmar (P2); o próprio MCP cumpre papel de assistente
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `consultar_atalhos`; módulo nenhum; prioridade P2; status implementada (`consultar_atalhos`, `obter_ajuda`) (ver matriz)

#### M-FERR-AVALIACAO Avaliação do programa (inferido)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ação HabilitarAvaliacaoAction; tela PainelAvisoAvaliacao
- Exige do MCP: não se aplica
- Cobertura no MCP Imposto de Renda: não se aplica; módulo nenhum; prioridade P2; status não se aplica (ver matriz)

#### M-FERR-INFO-CALCULO Constantes de cálculo (inferido, tela de testes)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: tela PainelInfoConstantesCalculo do pacote `testes`
- Exige do MCP: `consultar_tabela` com parâmetros de cálculo (aliquotas-parametros.json)
- Cobertura no MCP Imposto de Renda: `consultar_tabela`; módulo tabelas; prioridade P2; status implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

### 1.7 Ajuda

#### M-AJUDA-CONTEXTUAL Ajuda de campo (F1) e textos em azul

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: F1 em qualquer campo; links internos; págs. 366 e 417; na ficha Resumo, F1 indica a procedência dos valores (pág. 413)
- Exige do MCP: `obter_ajuda` por ficha e campo, inclusive rastreabilidade do Resumo (`explicar_calculo`)
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `calcular_imposto`; módulo tabelas; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `obter_ajuda`, `simular_imposto`) (ver matriz)

#### M-AJUDA-DOCUMENTOS Conteúdo, Instruções, Como Fazer, Perguntas e Respostas, FAQ

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: menu Ajuda; botões da janela de ajuda (Guardar como, Imprimir, Procurar, painel de utilitários, navegação de páginas, zoom)
- Exige do MCP: `obter_ajuda` com busca textual
- Cobertura no MCP Imposto de Renda: `obter_ajuda`; módulo tabelas; prioridade P2; status implementada (`obter_ajuda`) (ver matriz)

#### M-AJUDA-ATALHOS Exibir atalhos

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ação ExibirAtalhosPGDIRPFAction; AtalhosIRPF.pdf
- Exige do MCP: não se aplica
- Cobertura no MCP Imposto de Renda: `consultar_atalhos`; módulo nenhum; prioridade P2; status implementada (`consultar_atalhos`, `obter_ajuda`) (ver matriz)

#### M-AJUDA-ACESSIBILIDADE Acessibilidade (F11) e leitura de tela

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ação AjudaAcessibilidadeAction; telas PainelAjudaAcessibilidade, PainelAjudaLeituraTela, versões acessíveis de pendências e imposto a pagar; pág. 387
- Regras: menus acessíveis pela tecla Alt; conteúdo específico por ficha com F11
- Exige do MCP: respostas textuais já são acessíveis
- Cobertura no MCP Imposto de Renda: `consultar_atalhos`, `obter_ajuda`; módulo nenhum; prioridade P2; status implementada (`consultar_atalhos`, `obter_ajuda`) (ver matriz)

#### M-AJUDA-SOBRE Sobre, Novidades, Tutorial

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ações SobreAction, NovidadesAction, TutorialAction; telas PainelSobre, PainelCreditos, PainelNovidades, PainelSplash
- Exige do MCP: `obter_ajuda` tópico "novidades 2026"
- Cobertura no MCP Imposto de Renda: `obter_ajuda`; módulo tabelas; prioridade P2; status implementada (`obter_ajuda`) (ver matriz)

### 1.8 Ações de demonstrativo

#### M-DEMO-ACOES Novo, Abrir, Fechar, Excluir e Retificar Demonstrativo (inferido)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: ações NovoDemonstrativoAction, AbrirDemonstrativoAction, FecharDemonstrativoAction, ExcluirDemonstrativoAction, RetificarDemonstrativoAction; listener DemonstrativoListener; tela PainelImprimirDARFCodigoBarrasDemonstrativoAberto; tela gcap PainelAlienacaoAnosAnteriores
- Regras: provável ciclo de vida de demonstrativos de apuração de ganhos de capital (GCAP 2026, do ano corrente, com Darf de código de barras) dentro do PGD, além da importação do GCAP 2025 (inferido; a Ajuda 2026 só descreve a importação)
- Exige do MCP: `calcular_ganho_capital` (simulador próprio) e orientação de Darf 4600, 8523, 8960; P2
- Observações: confirmar no programa
- Cobertura no MCP Imposto de Renda: `calcular_ganho_capital`, `orientar_servico_externo`; módulo calc; prioridade P2; status parcial (`calcular_ganho_capital`, `orientar_servico_externo`) (ver matriz)

## 2 Tipos de declaração e regras gerais

### 2.1 Tipos de declaração e programas relacionados

#### S-TIPO-AJUSTE Declaração de Ajuste Anual

- Origem: notas/01-gerais.md, ID na nota: T-AJUSTE
- Onde: aba "Nova" da tela "O que você deseja fazer?"; Ajuda pág. 5
- Aplica-se a: Ajuste Anual
- Campos: não se aplica (tipo de declaração)
- Validações conhecidas: deve ser apresentada pela pessoa física residente no Brasil obrigada (ver S-REGRA-OBRIG). Desobrigado pode apresentar (S-REGRA-OBRIG, atenção 2).
- Códigos: código Receitanet 2600 (do layout, não da Ajuda)
- Regras de cálculo afetadas: todas as fichas de ajuste; opção completa ou simplificada (S-REGRA-REGIME)
- Importações/exportações: iniciar importando declaração de 2025, a partir da pré-preenchida, ou em branco
- Exige do MCP: criar declaração do tipo ajuste anual; escolher modo de início (importação 2025, pré-preenchida, em branco)
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `criar_declaracao`; módulo model; prioridade P0; status implementada (`criar_declaracao`) (ver matriz)

#### S-TIPO-DFE Declaração Final de Espólio

- Origem: notas/01-gerais.md, ID na nota: T-ESPOLIO-FINAL
- Onde: aba "Nova"; Ajuda pág. 6
- Aplica-se a: Final de Espólio
- Campos: não se aplica
- Validações conhecidas: apresentada pelo inventariante, cônjuge ou companheiro, sucessor a qualquer título ou representante do de cujus, quando a decisão judicial transitada em julgado da partilha, sobrepartilha ou adjudicação, ou a lavratura da escritura pública de inventário e partilha, ocorreu no ano-calendário 2025. Havendo bens a inventariar, a DFE é obrigatória. Se partilha e falecimento no mesmo ano, apresentar só uma DFE.
- Códigos: Receitanet 2621 (layout)
- Regras de cálculo afetadas: período de 1º/01 até a data da decisão judicial ou escritura; se ainda houver bens a inventariar que gerem rendimentos, informar rendimentos de todo o ano-calendário (pág. 22)
- Importações/exportações: nenhuma citada aqui
- Exige do MCP: criar DFE; ficha Espólio com campo "Final de Espólio" (Partilha / Sobrepartilha / Partilha e Sobrepartilha); campo "Ainda há bens a inventariar?" habilita CPF e nome do inventariante; marcação "Bem a inventariar" em Bens e Direitos
- Observações: ver S-REGRA-ESPOLIO-FINAL para detalhes de sobrepartilha
- Cobertura no MCP Imposto de Renda: `criar_declaracao`, `definir_espolio`; módulo model; prioridade P1; status implementada (`criar_declaracao`, `definir_espolio`) (ver matriz)

#### S-TIPO-DSDP Declaração de Saída Definitiva do País

- Origem: notas/01-gerais.md, ID na nota: T-SAIDA
- Onde: aba "Nova"; Ajuda pág. 7
- Aplica-se a: Saída Definitiva
- Campos: não se aplica
- Validações conhecidas: pessoa física que em 2025 se retirou do Brasil em caráter permanente, ou passou à condição de não residente após saída temporária (mais de 12 meses consecutivos de ausência)
- Códigos: Receitanet 2620 (layout)
- Regras de cálculo afetadas: período de 1º/01 até o dia anterior ao da caracterização da condição de não residente (pág. 22); imposto recolhido em quota única (pág. 18)
- Importações/exportações: nenhuma citada aqui
- Exige do MCP: criar DSDP; impedir parcelamento (quota única) (inferido da pág. 18)
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `criar_declaracao`, `definir_saida_definitiva`; módulo model; prioridade P1; status implementada (`criar_declaracao`, `definir_saida_definitiva`) (ver matriz)

#### S-PROGRAMAS-RFB Programas relacionados disponibilizados pela RFB

- Origem: notas/01-gerais.md, ID na nota: T-PROGRAMAS
- Onde: Ajuda pág. 8
- Aplica-se a: todos
- Campos: tabela nome, sigla, finalidade
- Validações conhecidas: nenhuma
- Códigos: GCAP2025 (ganhos de capital de 2025, exporta para IRPF2026); Carnê-Leão (ano-calendário 2025, acesso via e-CAC, "Meu Imposto de Renda" > "Declarações" > "Acessar Carnê-Leão", exporta para IRPF2026); AR2025 (livro Caixa da atividade rural 2025, exporta para IRPF2026); IRPF2026 (ajuste, final de espólio, saída definitiva); GCAP2026 e AR2026 (exportam para IRPF2027)
- Regras de cálculo afetadas: nenhuma direta
- Importações/exportações: GCAP2025, Carnê-Leão 2025 e AR2025 exportam dados importáveis no IRPF2026
- Exige do MCP: importar arquivos de exportação do GCAP2025, AR2025 e Carnê-Leão; orientar o usuário sobre onde obtê-los
- Observações: no PGD 2026 o GCAP está embutido como demonstrativo (ver notas de GCAP)
- Cobertura no MCP Imposto de Renda: `orientar_servico_externo`; módulo nenhum; prioridade P2; status implementada (`orientar_servico_externo`) (ver matriz)

### 2.2 Situações individuais, residência e regras de rendimentos

#### S-REGRA-CASADO Contribuinte casado

- Origem: notas/01-gerais.md, ID na nota: G-CASADO
- Onde: Ajuda pág. 10, Situações Individuais
- Aplica-se a: Ajuste Anual
- Campos: não se aplica
- Validações conhecidas: declaração em separado ou, opcionalmente, em conjunto
- Códigos: nenhum
- Regras de cálculo afetadas: separado, opção a: cada cônjuge inclui rendimentos próprios + 50% dos rendimentos de bens comuns, compensando 50% do imposto pago/retido sobre esses rendimentos, independentemente de quem sofreu a retenção; opção b: um cônjuge inclui 100% dos rendimentos de bens comuns e compensa 100% do imposto; o outro só os próprios. Conjunta: em nome de um dos cônjuges, com todos os rendimentos de ambos, inclusive de bens com cláusula de incomunicabilidade ou inalienabilidade e pensões de gozo privativo.
- Importações/exportações: nenhuma
- Exige do MCP: suportar rateio 50% ou 100% de rendimentos de bens comuns; suportar declaração em conjunto (cônjuge como dependente); orientar a escolha
- Observações: separado de fato segue as regras do casado (pág. 10)
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_dependente`, `listar_pendencias`; módulo validate; prioridade P1; status implementada (`adicionar_dependente`, `obter_ajuda`, `validar_declaracao`) (ver matriz)

#### S-REGRA-COMPANHEIRO Contribuinte que tenha companheiro

- Origem: notas/01-gerais.md, ID na nota: G-COMPANHEIRO
- Onde: Ajuda pág. 10
- Aplica-se a: Ajuste Anual
- Campos: não se aplica
- Validações conhecidas: separado ou em conjunto com o companheiro
- Códigos: nenhum
- Regras de cálculo afetadas: separado: rendimentos próprios + 50% dos rendimentos de bens em condomínio, salvo contrato escrito com outro percentual; imposto compensável na mesma proporção. Conjunta: em nome de um dos companheiros, com o total dos rendimentos.
- Importações/exportações: nenhuma
- Exige do MCP: permitir percentual contratual diferente de 50% para condomínio
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_dependente`, `listar_pendencias`; módulo validate; prioridade P1; status implementada (`adicionar_dependente`, `obter_ajuda`, `validar_declaracao`) (ver matriz)

#### S-REGRA-SEPARADO-FATO Contribuinte separado de fato

- Origem: notas/01-gerais.md, ID na nota: G-SEPARADO-FATO
- Onde: Ajuda pág. 10
- Aplica-se a: Ajuste Anual
- Regras: segue as instruções do contribuinte casado
- Exige do MCP: mesma lógica de S-REGRA-CASADO
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_dependente`, `listar_pendencias`; módulo validate; prioridade P1; status implementada (`adicionar_dependente`, `obter_ajuda`, `validar_declaracao`) (ver matriz)

#### S-REGRA-DIVORCIADO Contribuinte separado judicialmente, divorciado, que dissolveu união estável ou separado/divorciado por escritura pública

- Origem: notas/01-gerais.md, ID na nota: G-DIVORCIADO
- Onde: Ajuda pág. 11
- Aplica-se a: Ajuste Anual
- Validações conhecidas: declara como solteiro se não casado nem em união estável em 31/12/2025. Pode incluir dependente de quem detenha guarda judicial (com os rendimentos dele) ou deduzir pensão alimentícia paga por decisão judicial, alimentos provisionais, acordo homologado judicialmente ou escritura pública. Responsável pela guarda de filhos obrigados a declarar: declaração em separado para cada filho, ainda que menor, ou opcionalmente em conjunto, incluindo rendimentos, bens e direitos dos filhos.
- Regras de cálculo afetadas: rendimentos de dependentes vão nas abas Dependentes das fichas Rendimentos Tributáveis de PJ, de PF/Exterior e Imposto Pago/Retido; bens e dívidas dos dependentes em Bens e Direitos e Dívidas e Ônus Reais
- Exige do MCP: validar que o mesmo filho não seja dependente e alimentando ao mesmo tempo (inferido); orientar escolha
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_dependente`, `listar_pendencias`; módulo validate; prioridade P1; status implementada (`adicionar_dependente`, `obter_ajuda`, `validar_declaracao`) (ver matriz)

#### S-REGRA-VIUVO Contribuinte viúvo

- Origem: notas/01-gerais.md, ID na nota: G-VIUVO
- Onde: Ajuda pág. 11
- Aplica-se a: Ajuste Anual
- Regras de cálculo afetadas: declara com o próprio CPF os rendimentos próprios; no curso do inventário pode optar por tributar 50% dos rendimentos de bens comuns na própria declaração ou integralmente na declaração do espólio
- Exige do MCP: opção de rateio dos bens comuns com o espólio
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_dependente`, `listar_pendencias`; módulo validate; prioridade P1; status implementada (`adicionar_dependente`, `obter_ajuda`, `validar_declaracao`) (ver matriz)

#### S-REGRA-MENOR Contribuinte menor

- Origem: notas/01-gerais.md, ID na nota: G-MENOR
- Onde: Ajuda pág. 11
- Aplica-se a: Ajuste Anual
- Validações conhecidas: declaração em nome do menor, com o CPF dele. Opcionalmente dependente de um dos pais ou de quem o crie, eduque e detenha a guarda judicial. Menor sob guarda por sentença ou acordo homologado: tributação em conjunto só com quem detém a guarda judicial.
- Regras de cálculo afetadas: rendimentos do menor nas abas Dependentes das fichas de rendimentos e Imposto Pago/Retido
- Exige do MCP: alerta de guarda judicial ao incluir menor como dependente
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_dependente`, `listar_pendencias`; módulo validate; prioridade P1; status implementada (`adicionar_dependente`, `obter_ajuda`, `validar_declaracao`) (ver matriz)

#### S-REGRA-EMANCIPADO Contribuinte menor emancipado

- Origem: notas/01-gerais.md, ID na nota: G-EMANCIPADO
- Onde: Ajuda pág. 12
- Regras: declaração própria; opcionalmente dependente de um dos pais se preencher os requisitos
- Exige do MCP: mesma lógica de dependente
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_dependente`, `listar_pendencias`; módulo validate; prioridade P1; status implementada (`adicionar_dependente`, `obter_ajuda`, `validar_declaracao`) (ver matriz)

#### S-REGRA-INCAPAZ Contribuinte incapaz

- Origem: notas/01-gerais.md, ID na nota: G-INCAPAZ
- Onde: Ajuda pág. 12
- Regras: declaração em nome do incapaz, feita por tutor, curador ou responsável pela guarda judicial; opcionalmente dependente desses, incluindo rendimentos, bens e direitos do incapaz
- Exige do MCP: mesma lógica de dependente
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_dependente`, `listar_pendencias`; módulo validate; prioridade P1; status implementada (`adicionar_dependente`, `obter_ajuda`, `validar_declaracao`) (ver matriz)

#### S-REGRA-ESPOLIO Declaração do espólio (inicial e intermediárias)

- Origem: notas/01-gerais.md, ID na nota: G-ESPOLIO
- Onde: Ajuda pág. 12 a 14
- Aplica-se a: Espólio inicial e intermediária (Ajuste Anual com natureza de ocupação 81)
- Campos: Identificação com CPF e nome da pessoa falecida, endereço residencial na data do falecimento; natureza da ocupação 81 (Espólio); ocupação principal e código em branco; ficha Espólio com nome, CPF e endereço do inventariante (ou interessado com poderes de inventariante)
- Validações conhecidas: natureza 81 exige ocupação principal em branco; espólio é contribuinte distinto de meeiro, herdeiros e legatários; mesmos prazos e obrigatoriedade das pessoas físicas. Apresentada por: (a) cônjuge meeiro, sucessor ou representante, enquanto não iniciado o inventário; (b) inventariante após abertura do inventário; (c) interessado com poderes de inventariante, em inventário e partilha por escritura pública (arts. 610 e 611 da Lei 13.105/2015, CPC). Dependentes são os da ficha Dependentes desde que mantenham a condição até o falecimento.
- Códigos: natureza da ocupação 81
- Regras de cálculo afetadas: rendimentos próprios + 50% dos rendimentos de bens comuns recebidos no ano (opcionalmente 100% em nome do espólio, compensando 100% do imposto); união estável: 50% ou percentual contratual dos bens em condomínio; bens e direitos do inventário e obrigações do espólio
- Importações/exportações: nenhuma
- Exige do MCP: ao escolher natureza 81, habilitar ficha Espólio e limpar ocupação principal; validar campos do inventariante
- Observações: Declaração inicial = ano-calendário do falecimento. Falecimento a partir de 1º/01/2026 e antes da entrega da declaração de 2025: não é declaração de espólio; apresentar normalmente pelos mesmos responsáveis (a, b, c), igual para exercícios anteriores não entregues. Intermediárias = anos seguintes ao falecimento até o ano anterior ao da decisão judicial da partilha ou escritura.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `definir_espolio`; módulo model; prioridade P1; status implementada (`definir_espolio`, `definir_identificacao`) (ver matriz)

#### S-REGRA-ESPOLIO-FINAL Regras da Declaração Final de Espólio e sobrepartilha

- Origem: notas/01-gerais.md, ID na nota: G-ESPOLIO-FINAL
- Onde: Ajuda pág. 14 e 15
- Aplica-se a: Final de Espólio; Ajuste Anual com natureza 81
- Campos: ficha Espólio: "Final de Espólio" com opções "Partilha" (habilita aba Partilha), "Sobrepartilha" (habilita aba Sobrepartilha), "Partilha e Sobrepartilha" (habilita as duas); "Ainda há bens a inventariar?" (habilita CPF e Nome do inventariante); Bens e Direitos: "Bem a inventariar", "Situação em 31/12/2024 (R$)", "Situação em 31/12/2025 (R$)", "Situação na data da partilha (R$)", "Valor de transferência (R$)", "%", dados dos herdeiros
- Validações conhecidas: bem a inventariar é informado como bem de ajuste anual, sem as obrigatoriedades da DFE; bens partilhados ou sobrepartilhados com trânsito em julgado em 2025 informam herdeiros e valores de transferência, sem marcar "Bem a inventariar" e selecionando "%"
- Códigos: natureza 81
- Regras de cálculo afetadas: a responsabilidade pelos tributos até o falecimento é do espólio; até a partilha, do sucessor e do cônjuge meeiro, limitada ao quinhão, legado, herança ou meação
- Importações/exportações: nenhuma
- Exige do MCP: modelar partilha, sobrepartilha e bens a inventariar; permitir várias DFE em anos distintos (desde o exercício 2021); exemplo: partilha transitada em abril de 2025 exige DFE 2026 até 29/05/2026; sobrepartilha iniciada em 2026 sem decisão em 2026 gera Ajuste Anual 2027 com natureza 81 e sobrepartilha marcada na ficha Espólio; sobrepartilha decidida em 2026 gera nova DFE 2027 com "Sobrepartilha"
- Observações: caso de partilha transitada a partir de 1º/03/2025 com sobrepartilha iniciada sem decisão em 2025: marcar "Ainda há bens a inventariar" e "Bem a inventariar" em cada bem não inventariado
- Cobertura no MCP Imposto de Renda: `definir_espolio`, `definir_partilha_bem`; módulo model; prioridade P1; status implementada (`definir_espolio`, `definir_partilha_bem`) (ver matriz)

#### S-REGRA-AUSENTE-SERVICO Contribuinte ausente no exterior a serviço do Brasil

- Origem: notas/01-gerais.md, ID na nota: G-AUSENTE-SERVICO
- Onde: Ajuda pág. 17 e 18
- Aplica-se a: Ajuste Anual
- Campos: Endereço no Exterior; "Cód EX" (código do posto do Ministério das Relações Exteriores mais próximo da residência)
- Validações conhecidas: obrigado como residente. Aplica-se a servidor civil ou militar em missão no exterior, funcionário da administração federal direta (CLT), indireta e fundações, do Legislativo, Judiciário e TCU, e no que couber DF, estados e municípios, e pessoa designada pelo Presidente da República. Empresa pública e sociedade de economia mista a serviço próprio no exterior: não são ausentes a serviço do Brasil.
- Regras de cálculo afetadas: 25% dos rendimentos do trabalho assalariado em moeda estrangeira do Governo Brasileiro são tributáveis; 75% não tributáveis; todas as deduções legais cabíveis
- Importações/exportações: nenhuma
- Exige do MCP: cálculo automático do split 25%/75%; campo de código do posto MRE; tabela de postos (não está nesta parte)
- Observações: formas de pagamento iguais a S-PAG-FORMAS, inclusive remessa de ordem de pagamento via Banco do Brasil, Gecex Brasília-DF, prefixo 1608-X, em reais ou moeda estrangeira
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`, `adicionar_rendimento_isento`, `converter_moeda`; módulo calc; prioridade P2; status implementada (`adicionar_rendimento_isento`, `converter_moeda`, `definir_rendimentos_pf_exterior`, `listar_tabela`) (ver matriz)

#### S-REGRA-AUSENTE-OUTROS Contribuinte ausente no exterior exceto a serviço do Brasil

- Origem: notas/01-gerais.md, ID na nota: G-AUSENTE-OUTROS
- Onde: Ajuda pág. 18 e 19
- Aplica-se a: Saída Definitiva; Ajuste Anual
- Validações conhecidas: saída permanente ou ausência temporária por mais de 12 meses consecutivos obriga a Declaração de Saída Definitiva, relativa ao período de residente no ano da caracterização, com recolhimento em quota única. Sem DSDP, é residente durante os primeiros 12 meses consecutivos; vira não residente no dia seguinte ao fim desses 12 meses.
- Regras de cálculo afetadas: enquanto residente, ajuste anual normal observando tratados e reciprocidade; após não residência, rendimentos no Brasil tributados exclusivamente na fonte, e ganho de capital e renda variável de forma definitiva, dispensada declaração
- Exige do MCP: calcular data de caracterização de não residência (data de saída + 12 meses); orientar entre DSDP e Ajuste
- Observações: débito automático conforme S-PAG-DEBITO
- Cobertura no MCP Imposto de Renda: `calcular_condicao_residencia`; módulo calc; prioridade P1; status implementada (`calcular_condicao_residencia`) (ver matriz)

#### S-REGRA-RESIDENTE Contribuinte que adquiriu ou readquiriu a condição de residente

- Origem: notas/01-gerais.md, ID na nota: G-RESIDENTE
- Onde: Ajuda pág. 19 e 20
- Aplica-se a: Ajuste Anual
- Campos: Identificação, pergunta "Era residente no exterior e passou a ser residente no país em 2025?" (citada no índice da pág. 44)
- Validações conhecidas: residente: (a) visto permanente, desde a chegada; (b) visto temporário: para trabalho com vínculo ou médico bolsista do Programa Mais Médicos (Lei 12.871/2013), desde a chegada; obtendo visto permanente ou vínculo antes de 184 dias de permanência em até 12 meses, a partir da data do visto ou do trabalho; por outro motivo, permanência superior a 183 dias em até 12 meses, a partir do 184º dia; se ficar até 183 dias, novo período de 12 meses conta do ingresso seguinte; (c) brasileiro não residente que retorna com ânimo definitivo, na data da chegada
- Regras de cálculo afetadas: rendimentos do período de não residente: fonte no exterior em Isentos e Não Tributáveis; fonte no Brasil em Tributação Exclusiva/Definitiva; após residência, tributação normal
- Exige do MCP: calculadora da data de aquisição de residência (regra dos 183/184 dias); roteamento automático de rendimentos do período não residente
- Observações: obrigatoriedade VII
- Cobertura no MCP Imposto de Renda: `calcular_condicao_residencia`; módulo calc; prioridade P1; status implementada (`calcular_condicao_residencia`) (ver matriz)

#### S-REGRA-DIPLOMATICO Rendimentos de representações diplomáticas e organismos internacionais no Brasil

- Origem: notas/01-gerais.md, ID na nota: G-DIPLOMATICO
- Onde: Ajuda pág. 20
- Aplica-se a: Ajuste Anual
- Regras de cálculo afetadas: isentos os rendimentos do trabalho assalariado de servidor diplomático estrangeiro, servidor estrangeiro de organismo internacional com isenção por tratado, servidor não brasileiro de embaixada/consulado com reciprocidade; demais rendimentos no Brasil exclusivos na fonte ou definitivos (ganho de capital e renda variável)
- Validações conhecidas: isenção não alcança servidor brasileiro com residência permanente no Brasil ou estrangeiro que virou residente; esses recolhem carnê-leão e declaram
- Exige do MCP: orientar classificação como isento ou carnê-leão
- Cobertura no MCP Imposto de Renda: `obter_ajuda`; módulo tabelas; prioridade P2; status implementada (`obter_ajuda`) (ver matriz)

#### S-REGRA-CONVERSAO Conversão em reais de rendimentos ou pagamentos em moeda estrangeira

- Origem: notas/01-gerais.md, ID na nota: G-CONVERSAO
- Onde: Ajuda pág. 21
- Aplica-se a: todos
- Regras de cálculo afetadas: converter para dólar dos EUA pela autoridade monetária do país de origem na data do recebimento/pagamento e depois para reais pelo dólar do Banco Central do último dia útil da primeira quinzena do mês anterior. Rendimentos e imposto pago em favor do empregado: cotação de compra do mês anterior ao recebimento; deduções: cotação de venda do mês anterior ao pagamento.
- Importações/exportações: tabela "Conversão para Reais do Dólar dos Estados Unidos da América em 2025" (seção Tabelas)
- Exige do MCP: ferramenta de conversão com a tabela mensal de compra e venda de 2025
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `converter_moeda`; módulo tabelas; prioridade P1; status implementada (`converter_moeda`, `listar_tabela`) (ver matriz)

#### S-REGRA-REND-TRAB Rendimentos do trabalho (tributáveis)

- Origem: notas/01-gerais.md, ID na nota: G-REND-TRAB
- Onde: Ajuda pág. 23 e 24
- Aplica-se a: todos
- Regras de cálculo afetadas: tributáveis: salários, férias, aposentadoria, reserva, reforma, pensões, retiradas, gratificações, participações no lucro, verbas de representação, estagiários e residentes; benefícios de previdência complementar, PGBL e Fapi; resgates (exceto contribuições pagas entre 1º/01/1989 e 31/12/1995); VGBL: diferença positiva entre recebido e prêmios pagos; parcela de aposentadoria/pensão de 65 anos ou mais que exceder R$ 1.903,98 mensais (janeiro a dezembro) a partir do mês em que completou 65 anos (a parcela isenta vai no código 10 dos isentos); pro labore e aluguéis de sócios; despesas pagas pelo empregador em favor do empregado (aluguel, previdência, IR, seguro de vida, locomoção); 25% do assalariado em moeda estrangeira de servidor no exterior; profissões, autônomos, representante comercial; emolumentos de serventuários; empreitada individual; direitos autorais explorados pelo autor; VPI (Lei 10.698/2003) e abono de permanência (§ 19 do art. 40 da CF, EC 41/2003, art. 7º da Lei 10.887/2004); no mínimo 10% dos rendimentos de garimpeiros; no mínimo 10% do transporte de carga e serviços com trator e máquinas; no mínimo 60% do transporte de passageiros (veículo próprio ou locado conduzido pelo contribuinte)
- Validações conhecidas: optante pela tributação exclusiva da Lei 11.053/2004 (arts. 1º e 2º) declara benefícios e resgates de previdência complementar em Tributação Exclusiva, e o imposto não é compensável; autônomo que prestou serviço só a PJ e escriturou livro caixa preenche apenas a coluna Livro Caixa (aba "Outras Informações" da ficha PF/Exterior); pessoa física com mais de um veículo/máquina explorados com outros ou com operador contratado equipara-se a PJ
- Exige do MCP: cálculo da parcela isenta de 65 anos (limite mensal R$ 1.903,98 a partir do mês do aniversário); percentuais mínimos de transporte e garimpo; alerta de equiparação a PJ
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_pj`, `definir_rendimentos_pf_exterior`, `transferir_excedente_isencao_65`; módulo calc; prioridade P0; status implementada (`adicionar_rendimento_pj`, `definir_rendimentos_pf_exterior`, `transferir_excedente_isencao_65`) (ver matriz)

#### S-REGRA-ALUGUEIS Rendimentos de aluguéis

- Origem: notas/01-gerais.md, ID na nota: G-ALUGUEIS
- Onde: Ajuda pág. 25
- Aplica-se a: todos
- Regras de cálculo afetadas: ocupação, sublocação, uso ou exploração de bens móveis e imóveis, royalties, direitos (inclusive autorais não recebidos pelo autor). De PJ: ficha Rendimentos de PJ; de PF: aba "Outras Informações" da ficha PF/Exterior. Cessão gratuita de imóvel (exceto a cônjuge, pais ou filhos): rendimento anual de aluguel de 10% do valor venal (pode usar o IPTU do ano). Exclusões, se ônus exclusivo do locador: impostos, taxas e emolumentos do bem; aluguel pago por imóvel sublocado; despesas de cobrança ou recebimento; condomínio.
- Exige do MCP: calcular aluguel presumido de cessão gratuita; deduzir exclusões permitidas antes de lançar
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`, `adicionar_rendimento_pj`; módulo calc; prioridade P1; status implementada (`adicionar_rendimento_pj`, `definir_rendimentos_pf_exterior`) (ver matriz)

#### S-REGRA-AR-RESULTADO Resultado tributável da atividade rural

- Origem: notas/01-gerais.md, ID na nota: G-AR-RESULTADO
- Onde: Ajuda pág. 25
- Regras: resultado positivo do Demonstrativo da Atividade Rural é rendimento tributável na declaração
- Exige do MCP: transferir resultado do demonstrativo para o resumo
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### S-REGRA-RRA Rendimentos recebidos acumuladamente (regra geral)

- Origem: notas/01-gerais.md, ID na nota: G-RRA
- Onde: Ajuda pág. 25 e 26
- Regras de cálculo afetadas: rendimento tributável inclui acréscimos, juros e 13º, excluídas despesas com a ação judicial (inclusive advogados) pagas e não indenizadas; essas despesas são proporcionalizadas entre tributáveis, exclusivos e isentos
- Códigos: Pagamentos Efetuados 60 (honorários de ações judiciais, exceto trabalhistas) e 61 (honorários de ações trabalhistas), com CPF do advogado ou CNPJ do escritório, nome e valor
- Exige do MCP: rateio proporcional das despesas judiciais; lançamento automático em Pagamentos 60/61
- Cobertura no MCP Imposto de Renda: `adicionar_rra`, `adicionar_pagamento`, `calcular_rra`; módulo calc; prioridade P1; status implementada (`adicionar_pagamento`, `adicionar_rra`, `calcular_rra`) (ver matriz)

#### S-REGRA-OUTROS-REND Outros rendimentos tributáveis

- Origem: notas/01-gerais.md, ID na nota: G-OUTROS-REND
- Onde: Ajuda pág. 26
- Regras de cálculo afetadas: lucros apurados desde 1º/01/1996 distribuídos em 2025 que excedam o valor apurado na escrituração (lucro real, presumido ou arbitrado); rendimentos de capital no exterior (aplicações financeiras e lucros/dividendos de controladas); reajuste e juros na alienação a prazo de bens adquiridos em reais; acréscimo patrimonial a descoberto; resgate e rendimentos de partes beneficiárias ou de fundador; lucro do comércio ou indústria de não habitual
- Exige do MCP: alerta de variação patrimonial a descoberto (inferido); classificação
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P2; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### S-REGRA-NAO-RESIDENTE Caracterização da condição de residente e de não residente

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda págs. 342 e 343
- Regras:
  - Residente: reside em caráter permanente; ausente a serviço do Governo brasileiro como assalariado de autarquia ou repartição no exterior; ingresso com visto permanente (na chegada); visto temporário para trabalho com vínculo ou médico do Mais Médicos (na chegada), ao completar 184 dias em até 12 meses, ou na data do visto permanente ou vínculo se antes dos 184 dias; brasileiro que retorna com ânimo definitivo (na chegada); quem se ausenta sem apresentar a Comunicação de Saída Definitiva, durante os primeiros 12 meses consecutivos de ausência.
  - Não residente: não se enquadra como residente; retira-se em caráter permanente com Comunicação de Saída (na data da saída); ingressa para servir governo estrangeiro no País; visto temporário com até 183 dias em 12 meses, ou até a véspera do visto permanente ou vínculo; ausente temporariamente a partir do dia seguinte ao que completar 12 meses consecutivos.
  - Ausência inferior a 12 meses reinicia a contagem na próxima saída; a mudança de condição só ocorre quando houver hipótese que fundamente a nova condição.
- Exige do MCP: calculadora de condição de residência por datas de entrada e saída (calcular_condicao_residencia)
- Cobertura no MCP Imposto de Renda: `calcular_condicao_residencia`; módulo calc; prioridade P1; status implementada (`calcular_condicao_residencia`) (ver matriz)

### 2.3 Obrigatoriedade, regime, prazo, multa e retificação

#### S-REGRA-OBRIG Obrigatoriedade de apresentação da Declaração de Ajuste Anual 2026

- Origem: notas/01-gerais.md, ID na nota: G-OBRIG
- Onde: Ajuda pág. 28 e 29
- Aplica-se a: Ajuste Anual
- Validações conhecidas: obrigado o residente que, em 2025: I) recebeu rendimentos tributáveis acima de R$ 35.584,00; II) rendimentos isentos, não tributáveis ou exclusivos acima de R$ 200.000,00; III) ganho de capital sujeito a imposto em qualquer mês; IV) operações em bolsa com soma de alienações acima de R$ 40.000,00 ou com ganhos líquidos tributáveis; V) atividade rural com receita bruta acima de R$ 177.920,00 ou que pretenda compensar prejuízos de anos anteriores ou de 2025; VI) bens e direitos (inclusive terra nua) acima de R$ 800.000,00 em 31/12; VII) passou a ser residente e estava nessa condição em 31/12; VIII) optou pela isenção do ganho de capital na venda de imóvel residencial com reaplicação em imóvel residencial no País em 180 dias (art. 39 da Lei 11.196/2005); IX) optou pelo regime de transparência fiscal de entidade controlada no exterior (art. 8º da Lei 14.754/2023); X) titular de trust em 31/12 (arts. 10 a 13 da Lei 14.754/2023); XI) aplicações financeiras no exterior (arts. 2º a 4º e 9º da Lei 14.754/2023): auferiu rendimentos ou pretende compensar perdas; XII) lucros ou dividendos de entidades no exterior (arts. 2º e 5º a 6º-A da Lei 14.754/2023)
- Dispensas: cônjuge cujos bens comuns são declarados pelo outro, se não se enquadrar em outra hipótese e bens privativos até R$ 800.000,00; quem consta como dependente em declaração de outra pessoa com seus rendimentos, bens e direitos
- Regras de cálculo afetadas: rendimentos dos dependentes somam-se aos do titular para os limites de I e II; quem se enquadra em I a IV e VI a XI com resultado positivo da atividade rural também preenche o Demonstrativo da Atividade Rural
- Exige do MCP: ferramenta de verificação de obrigatoriedade com os 12 critérios e as dispensas, usando dados da declaração ou perguntas
- Observações: desobrigado pode apresentar
- Cobertura no MCP Imposto de Renda: `verificar_obrigatoriedade`; módulo validate; prioridade P1; status implementada (`verificar_obrigatoriedade`) (ver matriz)

#### S-REGRA-REGIME Regime de tributação (deduções legais ou desconto simplificado)

- Origem: notas/01-gerais.md, ID na nota: G-REGIME
- Onde: Ajuda pág. 29
- Aplica-se a: Ajuste Anual (inferido; espólio inicial e intermediário também)
- Regras de cálculo afetadas: deduções legais: todas as deduções comprovadas; desconto simplificado: 20% dos rendimentos tributáveis, limitado a R$ 16.754,34, substituindo todas as deduções, sem comprovação
- Exige do MCP: calcular as duas opções e indicar a mais vantajosa; permitir escolha
- Observações: troca de opção na retificadora só até 29/05/2026 (S-REGRA-RETIF)
- Cobertura no MCP Imposto de Renda: `calcular_imposto`, `definir_opcao_tributacao`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `definir_opcao_tributacao`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### S-REGRA-PREENCHIMENTO Forma de preenchimento e pré-preenchida

- Origem: notas/01-gerais.md, ID na nota: G-PREENCHIMENTO
- Onde: Ajuda pág. 30 e 31
- Aplica-se a: Ajuste Anual
- Regras: elaborada no computador com o IRPF2026 (PGD) ou pelo "Meu Imposto de Renda" (site e apps Android/iOS), com autenticação gov.br nível Ouro ou Prata. A pré-preenchida contém rendimentos tributáveis, isentos, exclusivos, deduções, bens e direitos, dívidas e ônus, operações com criptoativos (IN RFB 1.888/2019) e dados de convênios; acesso só com cidadão autenticado no gov.br.
- Importações/exportações: importação de comprovante eletrônico de rendimentos (informe da fonte pagadora) e de pagamentos de serviços médicos e de saúde (informe do plano de saúde)
- Exige do MCP: importar arquivo da pré-preenchida obtido pelo usuário; importar informes eletrônicos de rendimentos e plano de saúde; orientar o login gov.br (fora do MCP)
- Observações: o MCP não autentica no gov.br (inferido); depende do arquivo baixado pelo usuário
- Cobertura no MCP Imposto de Renda: `importar_pre_preenchida`, `importar_informe_rendimentos`, `importar_informe_plano_saude`, `orientar_servico_externo`; módulo importacao; prioridade P1; status parcial (`importar_informe_plano_saude`, `importar_informe_rendimentos`, `importar_pre_preenchida`, `orientar_servico_externo`) (ver matriz)

#### S-REGRA-PRAZO Prazo e local de apresentação

- Origem: notas/01-gerais.md, ID na nota: G-PRAZO
- Onde: Ajuda pág. 31
- Aplica-se a: Ajuste Anual, Espólio, Saída
- Regras: pela Internet, com o programa de transmissão Receitanet (ou "Meu Imposto de Renda"), até 23h59min59s (horário de Brasília) de 29/05/2026
- Exige do MCP: gerar arquivo para entrega e instruir transmissão no PGD/Receitanet; alerta de prazo
- Cobertura no MCP Imposto de Renda: `listar_pendencias`, `instruir_transmissao`; módulo validate; prioridade P0; status implementada (`instruir_transmissao`, `validar_declaracao`) (ver matriz)

#### S-REGRA-MULTA-ATRASO Multa por atraso na entrega (MAED)

- Origem: notas/01-gerais.md, ID na nota: G-MULTA-ATRASO
- Onde: Ajuda pág. 31 e 32
- Aplica-se a: todos os obrigados
- Regras de cálculo afetadas: entrega após 29/05/2026: com imposto devido (mesmo pago), 1% ao mês ou fração sobre o imposto devido, mínimo R$ 165,74 e máximo 20% do imposto devido; sem imposto devido, R$ 165,74. Termo inicial: dia seguinte ao prazo; termo final: mês da entrega ou do lançamento de ofício. Não paga no vencimento da notificação emitida pelo PGD, é deduzida da restituição com acréscimos. Sem multa para desobrigado.
- Exige do MCP: calcular a MAED; gerar dados do Darf da multa (notificação de lançamento emitida pelo PGD)
- Cobertura no MCP Imposto de Renda: `calcular_multa_atraso`; módulo calc; prioridade P1; status implementada (`calcular_multa_atraso`) (ver matriz)

#### S-REGRA-RETIF Retificação da declaração

- Origem: notas/01-gerais.md, ID na nota: G-RETIF
- Onde: Ajuda pág. 32
- Aplica-se a: todos
- Campos: "Que tipo de declaração você deseja fazer?" opção "Declaração retificadora"; número do recibo da declaração imediatamente anterior do exercício 2026 (obrigatório; obtido na folha 2 do recibo ou no menu Declaração > Abrir)
- Validações conhecidas: retificadora substitui integralmente a anterior, com a mesma natureza; deve conter todas as informações; troca entre deduções legais e simplificado só até 29/05/2026, depois mantém a opção anterior
- Caminhos no PGD: tela "O que você deseja fazer?" aba "Transmitidas", ícone de retificar; barra lateral Declaração > Retificar; ficha Identificação, pergunta do tipo de declaração
- Importações/exportações: entrega pela Internet (Receitanet ou "Meu Imposto de Renda", serviço "Preencher Declaração Online" no e-CAC); após 29/05/2026 também em mídia removível (pen drive, HD externo) nas unidades da RFB
- Exige do MCP: criar retificadora a partir de declaração transmitida; validar número do recibo (formato); bloquear troca de regime após o prazo
- Cobertura no MCP Imposto de Renda: `criar_retificadora`, `listar_pendencias`; módulo validate; prioridade P1; status implementada (`criar_retificadora`, `validar_declaracao`) (ver matriz)

#### S-REGRA-APOS-PRAZO Locais de apresentação após o prazo

- Origem: notas/01-gerais.md, ID na nota: G-APOS-PRAZO
- Onde: Ajuda pág. 32 e 33
- Regras: após 29/05/2026, inclusive retificadora: Internet ou mídia removível nas unidades da RFB
- Exige do MCP: orientação
- Cobertura no MCP Imposto de Renda: `instruir_transmissao`; módulo nenhum; prioridade P2; status implementada (`instruir_transmissao`) (ver matriz)

#### S-REGRA-EXERC-ANT Declaração de exercícios anteriores

- Origem: notas/01-gerais.md, ID na nota: G-EXERC-ANT
- Onde: Ajuda pág. 33
- Regras: usar o programa do exercício correspondente (ex.: IRPF 2025 para ano-calendário 2024); entrega pela Internet ou mídia removível nas unidades da RFB
- Exige do MCP: fora do escopo do PGD 2026; orientar (o MCP pode suportar outros exercícios no futuro, inferido)
- Cobertura no MCP Imposto de Renda: `obter_ajuda`; módulo nenhum; prioridade P2; status implementada (`obter_ajuda`) (ver matriz)

## 3 Fichas da declaração

### 3.1 Início e Identificação do Contribuinte

#### F-INICIO Aba Início

- Origem: notas/02-ident-dep-rend.md
- Onde: primeira aba do programa; pág. 41
- Aplica-se a: todos
- Campos: nenhum; painel com ícones de atalho para as fichas mais relevantes, escolhidas a partir do histórico de utilização. Demais fichas pelo menu lateral à esquerda.
- Validações conhecidas: nenhuma
- Códigos: nenhum
- Regras de cálculo afetadas: nenhuma
- Importações/exportações: nenhuma
- Exige do MCP: ferramenta de navegação/listagem de fichas aplicáveis à declaração (ex.: listar fichas preenchidas e sugeridas). Sem equivalente obrigatório.
- Observações: "a partir do histórico de utilização" sugere priorização dinâmica; o MCP pode sugerir fichas com base nos dados já informados (inferido).
- Cobertura no MCP Imposto de Renda: `listar_fichas`; módulo model; prioridade P2; status implementada (`listar_fichas`) (ver matriz)

#### F-IDENT Identificação do Contribuinte (visão geral)

- Origem: notas/02-ident-dep-rend.md
- Onde: ficha Identificação do Contribuinte; págs. 41 a 46
- Aplica-se a: todos (com particularidades para Espólio e Saída Definitiva)
- Campos (grupos): Tipo de declaração e nº do recibo; Nome; Data de nascimento; Doença grave ou deficiência; Raça/Cor; Houve alteração de dados cadastrais; Possui cônjuge ou companheiro(a) e CPF do cônjuge; Era residente no exterior e passou a ser residente em 2025 e Data de retorno; Endereço (Brasil ou Exterior); Ocupação principal (natureza e ocupação).
- Validações conhecidas: período de informações: Final de Espólio, de 1º de janeiro até a data da decisão judicial da partilha, sobrepartilha ou adjudicação, ou da lavratura da escritura pública de inventário/partilha (se ainda houver bens a inventariar que gerem rendimentos, informar o ano todo); Saída Definitiva, de 1º de janeiro até o dia anterior ao da caracterização da condição de não residente.
- Exige do MCP: ferramenta de leitura/gravação da identificação (`definir_identificacao`), validação de cada campo, seleção do tipo de declaração.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`; módulo model; prioridade P0; status implementada (`definir_identificacao`, `validar_documento`) (ver matriz)

#### F-IDENT-TIPO Que Tipo de Declaração Você Deseja Fazer?

- Origem: notas/02-ident-dep-rend.md
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
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`; módulo model; prioridade P0; status implementada (`definir_identificacao`, `validar_documento`) (ver matriz)

#### F-IDENT-NOME Nome

- Origem: notas/02-ident-dep-rend.md
- Onde: Identificação; pág. 43
- Campos: Nome completo (alfanumérico; layout NM_NOME tamanho 60).
- Validações conhecidas: de 1 a 15 partes; a primeira parte pode ter 1 caractere; nenhuma parte com mais de 20 caracteres; proibidos 3 caracteres iguais e consecutivos, exceto o numeral romano "III" na última parte.
- Exige do MCP: validador de nome conforme essas regras.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`; módulo validate; prioridade P0; status implementada (`definir_identificacao`, `validar_documento`) (ver matriz)

#### F-IDENT-NASC Data de Nascimento

- Origem: notas/02-ident-dep-rend.md
- Onde: Identificação; pág. 43
- Campos: data dd/mm/aaaa.
- Validações conhecidas: formato 2 dígitos dia, 2 mês, 4 ano; data válida (inferido).
- Regras de cálculo afetadas: idade influencia parcela isenta de 65 anos e obrigatoriedade/prioridade (inferido, tratado em outras fichas).
- Exige do MCP: validador de data.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`; módulo model; prioridade P0; status implementada (`definir_identificacao`, `validar_documento`) (ver matriz)

#### F-IDENT-DOENCA Há declarante ou dependente com doença grave ou deficiência física ou mental?

- Origem: notas/02-ident-dep-rend.md
- Onde: Identificação; pág. 43
- Campos: indicador sim/não (marcação).
- Validações conhecidas: base em conclusão da medicina especializada.
- Regras de cálculo afetadas: prioridade na restituição (art. 69-A da Lei 9.784/1999); não altera o imposto.
- Exige do MCP: campo booleano com explicação ao usuário.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`; módulo model; prioridade P0; status implementada (`definir_identificacao`, `validar_documento`) (ver matriz)

#### F-IDENT-RACA Raça/Cor

- Origem: notas/02-ident-dep-rend.md
- Onde: Identificação; pág. 43
- Campos: seleção autodeclarada: Amarela, Branca, Indígena, Parda, Preta (tabela racaCor.xml).
- Exige do MCP: enumeração validada.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`; módulo model; prioridade P0; status implementada (`definir_identificacao`, `validar_documento`) (ver matriz)

#### F-IDENT-ALTCAD Houve alteração de dados cadastrais?

- Origem: notas/02-ident-dep-rend.md
- Onde: Identificação; pág. 43
- Campos: SIM/NÃO.
- Validações conhecidas: SIM se endereço, telefone, celular, e-mail ou ocupação principal diferente da última declaração. Se NÃO e o cadastro CPF da RFB tiver endereço diferente, a declaração NÃO pode ser apresentada (rejeição na transmissão). Solução: conferir o endereço; se correto, marcar SIM, gravar novamente para entrega e retransmitir.
- Regras de cálculo afetadas: nenhuma; com SIM, também atualiza dados do dependente que mora com o titular no Cadastro CPF.
- Exige do MCP: alerta quando dados de contato/endereço mudarem em relação à declaração importada do ano anterior; sugestão automática de SIM (inferido).
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`; módulo model; prioridade P0; status implementada (`definir_identificacao`, `validar_documento`) (ver matriz)

#### F-IDENT-CONJ Possui cônjuge ou companheiro(a)?

- Origem: notas/02-ident-dep-rend.md
- Onde: Identificação; pág. 44
- Campos: SIM/NÃO; CPF do cônjuge ou companheiro(a) (11 dígitos) se SIM.
- Validações conhecidas: CPF obrigatório com 11 dígitos quando SIM; dígito verificador (inferido).
- Exige do MCP: validação de CPF; ligação com a ficha Informações do Cônjuge (inferido) e com dependentes comuns.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`; módulo model; prioridade P0; status implementada (`definir_identificacao`, `validar_documento`) (ver matriz)

#### F-IDENT-RETORNO Era residente no exterior e passou a ser residente no país em 2025?

- Origem: notas/02-ident-dep-rend.md
- Onde: Identificação; pág. 44
- Campos: SIM/NÃO; Data de retorno ao Brasil (se SIM).
- Validações conhecidas: data obrigatória se SIM; dentro de 2025 (inferido).
- Exige do MCP: campo condicional com validação de data.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`; módulo model; prioridade P0; status implementada (`definir_identificacao`, `validar_documento`) (ver matriz)

#### F-IDENT-END-BR Endereço - Brasil

- Origem: notas/02-ident-dep-rend.md
- Onde: Identificação; págs. 44 e 45
- Aplica-se a: todos; no Final de Espólio, endereço e UF da pessoa falecida na data do óbito.
- Campos: indicador Brasil/Exterior; Tipo de logradouro (rua, quadra, avenida etc., tabela tipoLogradouro); Logradouro; Número; Complemento; Bairro/Distrito; UF (código ou lista, tabela ufs); Município (lista dos municípios da UF, em ordem alfabética); CEP (8 dígitos); Telefone (DDD 2 dígitos + até 9 dígitos); Celular (DDD 2 + até 9 dígitos); E-mail.
- Validações conhecidas: endereço completo; município deve pertencer à UF; CEP com 8 dígitos (tabela ECT); e-mail válido; telefone e celular com DDD de 2 dígitos e até 9 dígitos.
- Códigos: UF, municípios (tabelas por UF), tipo de logradouro.
- Exige do MCP: validação de endereço, consulta às tabelas de UF/município, validação de CEP; botão "Consulta CEP" (abre site dos Correios): o MCP pode apenas orientar ou consultar serviço externo opcional (inferido).
- Observações: celular e e-mail podem ser usados pela RFB para avisar mensagem na Caixa Postal do e-CAC.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`, `consultar_tabela`; módulo tabelas; prioridade P0; status implementada (`buscar_codigo`, `consultar_parametros`, `definir_identificacao`, `listar_tabela`, `validar_documento`) (ver matriz)

#### F-IDENT-END-EXT Endereço - Exterior

- Origem: notas/02-ident-dep-rend.md
- Onde: Identificação; págs. 45 e 46
- Campos: CPF do procurador residente no Brasil (11 dígitos); Logradouro, número, complemento, bairro/distrito; País (código ou lista, tabela paises); Cód. EXT. (representação diplomática mais próxima da residência, tabela representacoes.xml); Cidade; Código Postal; DDI/Telefone; E-mail.
- Validações conhecidas: CPF do procurador com 11 dígitos; e-mail válido; Espólio: último endereço da pessoa falecida.
- Exige do MCP: validação, tabelas de países e representações diplomáticas; orientação sobre Domicílio Tributário Eletrônico ou procurador no Brasil.
- Observações: se o endereço do titular é no Exterior e o dependente mora com o titular, celular/e-mail do dependente ficam desabilitados.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `validar_documento`, `consultar_tabela`; módulo tabelas; prioridade P0; status implementada (`buscar_codigo`, `consultar_parametros`, `definir_identificacao`, `listar_tabela`, `validar_documento`) (ver matriz)

#### F-IDENT-OCUP Ocupação Principal

- Origem: notas/02-ident-dep-rend.md
- Onde: Identificação; pág. 46
- Campos: Natureza da ocupação (código, tabela naturezasOcupacao); Ocupação principal (código, lupa, tabela ocupacoesPrincipal); Número do registro profissional para ocupações 225, 226, 230, 231, 232, 241, 255, 355 (ver Carnê-Leão, inferido como campo da identificação ou da ficha PF).
- Validações conhecidas: naturezas 13, 14, 61, 62, 71, 72 e 81 (Espólio) não exigem código da ocupação principal; se tiver outra ocupação remunerada, informar a ocupação dela. Demais naturezas exigem ocupação principal (inferido).
- Códigos: natureza 11 (profissional liberal ou autônomo sem vínculo) torna obrigatório o NIT/PIS/PASEP na ficha PF; natureza 62 remete ao isento 11 (moléstia grave/acidente); natureza 81 (Espólio) habilita a ficha Espólio na Declaração de Ajuste.
- Exige do MCP: validação condicional natureza x ocupação, ativação de fichas dependentes da natureza.
- Cobertura no MCP Imposto de Renda: `definir_identificacao`, `consultar_tabela`; módulo tabelas; prioridade P0; status implementada (`buscar_codigo`, `consultar_parametros`, `definir_identificacao`, `listar_tabela`) (ver matriz)

### 3.2 Dependentes e Alimentandos

#### F-DEP Dependentes

- Origem: notas/02-ident-dep-rend.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_dependente`, `editar_lancamento`, `remover_lancamento`; módulo model; prioridade P0; status implementada (`adicionar_dependente`, `editar_lancamento`, `remover_lancamento`) (ver matriz)

#### F-ALIM Alimentandos

- Origem: notas/02-ident-dep-rend.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_alimentando`, `editar_lancamento`, `remover_lancamento`; módulo model; prioridade P1; status implementada (`adicionar_alimentando`, `editar_lancamento`, `remover_lancamento`) (ver matriz)

### 3.3 Rendimentos Tributáveis Recebidos de PJ

#### F-RTPJ-TIT Rendimentos Tributáveis Recebidos de PJ pelo Titular

- Origem: notas/02-ident-dep-rend.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_pj`, `importar_informe_rendimentos`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_pj`, `importar_informe_rendimentos`) (ver matriz)

#### F-RTPJ-DEP Rendimentos Tributáveis Recebidos de PJ pelos Dependentes

- Origem: notas/02-ident-dep-rend.md
- Onde: ficha Rendimentos Tributáveis Recebidos de PJ, aba Dependentes; págs. 53 e 54
- Aplica-se a: todos
- Campos: Dependente (seleção entre os da ficha Dependentes) e os mesmos campos da aba Titular (CPF/CNPJ e nome da fonte, rendimentos, contribuição previdenciária oficial, IRRF, 13º, IRRF sobre 13º).
- Validações conhecidas: dependente precisa existir antes na ficha Dependentes; mesmas regras de CPF/CNPJ.
- Regras de cálculo afetadas: iguais às do titular (somam no Resumo; previdência somada à da ficha PF dependentes; 13º para Exclusivos código 08, inferido).
- Importações/exportações: Importações > Informe de Rendimentos.
- Exige do MCP: mesmo CRUD com vínculo ao dependente; cascata na exclusão do dependente.
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_pj`, `importar_informe_rendimentos`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_pj`, `importar_informe_rendimentos`) (ver matriz)

### 3.4 Rendimentos Tributáveis Recebidos de PF e do Exterior

#### F-RTPF Rendimentos Tributáveis Recebidos de Pessoa Física e do Exterior (visão geral)

- Origem: notas/02-ident-dep-rend.md
- Onde: ficha com abas Titular e Dependentes; cada uma com sub-abas "Rendimentos do Trabalho Não Assalariado" e "Outras Informações"; págs. 55 a 74
- Aplica-se a: todos (Espólio e Saída com o período reduzido descrito em F-IDENT)
- Estrutura mensal (janeiro a dezembro) com colunas (inferido do texto): Trabalho não assalariado; Aluguéis (inclusive por temporada); Outros; Exterior; Previdência Oficial; Dependentes (quantidade); Pensão Alimentícia; Livro Caixa; Carnê-Leão Darf pago (cód. 0190). Sub-aba de trabalho não assalariado tem detalhamento por pagador (CPF titular do pagamento, CPF beneficiário, valor).
- Exige do MCP: modelo de dados mensal por titular e por dependente; importação do Carnê-Leão; totalizações.
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P0; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### F-RTPF-IMPCL Importação do Carnê-leão

- Origem: notas/02-ident-dep-rend.md
- Onde: ficha Rendimentos Tributáveis PF e Exterior (titular); pág. 57
- Aplica-se a: todos
- Campos: nenhum; ação de importação.
- Validações conhecidas: exige conta gov.br (o Carnê-Leão é online, multiexercício, no e-CAC, sistema Meu Imposto de Renda, "Acessar Carnê-Leão", desde 2021). Ao importar: se já houver dados na ficha Rendimentos Tributáveis de PJ, o CNPJ não é importado; se já houver Imposto pago no exterior na ficha Imposto Pago/Retido, o valor não é importado.
- Códigos: ocupações que exigem número de registro profissional para usar o Carnê-Leão: 225 Médico, 226 Odontólogo, 230 Fonoaudiólogo, 231 Fisioterapeuta, 232 Terapeuta ocupacional, 241 Advogado, 255 Psicólogo, 355 Corretor e administrador de imóveis. Esses profissionais identificam por CPF o titular do pagamento, se ele é o beneficiário do serviço; se não for, o CPF do beneficiário e o valor. Campo "CPF não foi informado" só quando o beneficiário não é o titular do pagamento e o CPF do beneficiário não foi informado.
- Importações/exportações: dados do ano-calendário 2025 do Carnê-Leão online para a ficha PF/Exterior.
- Exige do MCP: importador do arquivo/exportação do Carnê-Leão online (formato a mapear; o PGD baixa via gov.br, o MCP não deve autenticar no gov.br: alternativa é o usuário exportar o arquivo e o MCP importar, inferido); aplicar as regras de não sobrescrita (CNPJ e imposto pago no exterior).
- Observações: módulo irpf-gui-carne-leao.jar.
- Cobertura no MCP Imposto de Renda: `importar_carne_leao`; módulo importacao; prioridade P1; status parcial (`calcular_carne_leao`, `definir_rendimentos_pf_exterior`, `orientar_servico_externo`) (ver matriz)

#### F-RTPF-TNA Aba "Rendimentos do Trabalho Não Assalariado" (titular e dependentes)

- Origem: notas/02-ident-dep-rend.md
- Onde: ficha PF/Exterior, abas Titular e Dependentes; págs. 58, 59, 67, 68
- Campos: por mês, valores recebidos de PF por trabalho não assalariado; para ocupações 225, 226, 230, 231, 232, 241, 255, 355: CPF do titular do pagamento, indicador se é o beneficiário do serviço, CPF do beneficiário, valor, marca "CPF não foi informado" (inferido a partir da regra do Carnê-Leão).
- Validações conhecidas: declarar mesmo que a soma mensal seja inferior à primeira faixa da tabela mensal (até R$ 2.259,20 de janeiro a abril e R$ 2.428,80 de maio a dezembro, alíquota zero). Não incluir rendimentos de vínculo empregatício pagos por PF (vão para Rendimentos PJ, aba Titular ou Dependentes). Transporte de carga e serviços com trator, máquina de terraplenagem, colheitadeira e assemelhados: tributável no mínimo 10% do rendimento (veículo próprio ou locado, conduzido só pelo contribuinte). Transporte de passageiros: no mínimo 60%. Equipara-se a PJ quem tem mais de um veículo/máquina explorados com outras pessoas ou contrata condutor.
- Conteúdo: profissão, ocupação, prestação de serviços (inclusive representante comercial autônomo); honorários de autônomos; direitos autorais explorados diretamente pelo autor; exploração individual de empreitada de trabalho; emolumentos e custas de serventuários da Justiça (exceto quando pagos exclusivamente pelos cofres públicos).
- Regras de cálculo afetadas: soma em rendimentos tributáveis do Resumo.
- Exige do MCP: registro mensal, cálculo opcional dos percentuais mínimos de transporte (10% e 60%), validação dos campos de CPF para profissionais de saúde/advocacia/imóveis.
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P0; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### F-RTPF-NIT NIT/PIS/PASEP

- Origem: notas/02-ident-dep-rend.md
- Onde: aba "Outras Informações" (titular e dependentes); págs. 59 e 69
- Campos: NIT ou PIS ou PASEP.
- Validações conhecidas: obrigatório se a natureza da ocupação for 11 (profissional liberal ou autônomo sem vínculo de emprego) ou se houver valor de contribuição previdenciária nesta ficha. Dígito verificador do NIT/PIS (inferido).
- Exige do MCP: validação condicional.
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P0; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### F-RTPF-ALUG Coluna Aluguéis, inclusive por temporada

- Origem: notas/02-ident-dep-rend.md
- Onde: aba Outras Informações; págs. 59 e 69
- Campos: valor mensal de aluguéis.
- Conteúdo: ocupação, sublocação, uso ou exploração de bens móveis e imóveis; royalties (direitos autorais não explorados pelo autor).
- Regras de cálculo afetadas: podem ser excluídos (desde que ônus exclusivo do locador): impostos, taxas e emolumentos do bem; aluguel pago por imóvel sublocado; despesas de cobrança ou recebimento; condomínio. Informar o líquido (inferido). Quem recebe aluguel não pode usar livro Caixa para essa receita.
- Exige do MCP: cálculo do aluguel líquido a partir de valores brutos e encargos dedutíveis.
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P0; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### F-RTPF-OUTROS Coluna Outros

- Origem: notas/02-ident-dep-rend.md
- Onde: aba Outras Informações; págs. 59 e 69
- Conteúdo: juros de empréstimos a PF; lucro no comércio ou indústria por quem não exerce habitualmente a profissão; reajustamento e juros na alienação a prazo de bens ou direitos (adquiridos em reais, para dependentes).
- Exige do MCP: campo mensal.
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P0; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### F-RTPF-EXT Coluna Exterior

- Origem: notas/02-ident-dep-rend.md
- Onde: aba Outras Informações; págs. 60, 69 e 70
- Conteúdo: rendimentos de fontes no exterior, inclusive representações diplomáticas e organismos internacionais, observados acordos e reciprocidade.
- Validações conhecidas: NÃO incluir: transferência para o Brasil de saldo de depósito não remunerado no exterior (ganho de capital); ganho cambial de depósitos não remunerados em instituição não reconhecida (ganho de capital); alienação de moeda estrangeira em espécie (não incidência até US$ 5.000,00 no ano; acima, ganho de capital); rendimentos de aplicações financeiras no exterior e lucros/dividendos de controladas (Bens e Direitos, Lei 14.754/2023); liquidação/resgate de aplicações e alienação de bens adquiridos em moeda estrangeira e ativos em bolsa no exterior (ganho de capital).
- Regras de cálculo afetadas: conversão: moeda de origem para dólar dos EUA pela cotação da autoridade monetária do país na data do recebimento; dólar para real pela cotação de COMPRA do Banco Central do último dia útil da 1ª quinzena do mês anterior ao do recebimento (Tabela de Conversão do Dólar 2025). Total transportado ao Resumo. Imposto pago no exterior compensável (ver Carnê-Leão e Imposto Pago/Retido).
- Exige do MCP: conversor de moeda com a tabela oficial de 2025 (compra para rendimentos), alertas de classificação errada (aplicações no exterior, moeda em espécie).
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`, `converter_moeda`; módulo calc; prioridade P1; status implementada (`converter_moeda`, `definir_rendimentos_pf_exterior`, `listar_tabela`) (ver matriz)

#### F-RTPF-PREV Deduções - Previdência Oficial

- Origem: notas/02-ident-dep-rend.md
- Onde: aba Outras Informações; págs. 61 e 70
- Campos: valor mensal da contribuição previdenciária oficial recolhida em nome do titular (ou dos dependentes), inclusive do contribuinte individual (autônomo).
- Regras de cálculo afetadas: total somado à previdência oficial da ficha Rendimentos PJ (titular/dependentes) e lançado no Resumo como dedução.
- Validações conhecidas: exige NIT/PIS/PASEP preenchido.
- Exige do MCP: soma e transporte.
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P0; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### F-RTPF-QTDDEP Deduções - Quantidade de Dependentes

- Origem: notas/02-ident-dep-rend.md
- Onde: aba Outras Informações; págs. 62 e 71
- Campos: quantidade mensal de dependentes.
- Validações conhecidas: só os não usados na apuração do IR na fonte.
- Regras de cálculo afetadas: valor mensal R$ 189,59 por dependente (janeiro a dezembro). Valores apenas INFORMATIVOS: não vão ao Resumo; dedução anual depende da ficha Dependentes.
- Exige do MCP: campo informativo; avisar que dedução anual exige a ficha Dependentes.
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P2; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### F-RTPF-PENSAO Deduções - Pensão Alimentícia

- Origem: notas/02-ident-dep-rend.md
- Onde: aba Outras Informações (coluna Pensão Alimentícia); págs. 63 e 72
- Campos: valor mensal pago de pensão alimentícia judicial ou por escritura pública (art. 733 CPC).
- Validações conhecidas: só valores não usados como dedução no IR na fonte.
- Regras de cálculo afetadas: apenas INFORMATIVO (digitado ou importado do Carnê-Leão); não vai ao Resumo. Para deduzir, informar em Pagamentos Efetuados. Pagamento em moeda estrangeira: dólar pela autoridade do país na data do pagamento e real pela cotação de VENDA do Banco Central do último dia útil da 1ª quinzena do mês anterior.
- Exige do MCP: aviso de que a pensão deve estar em Pagamentos Efetuados; conversor de câmbio (venda).
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P2; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### F-RTPF-LIVROCAIXA Deduções - Livro Caixa

- Origem: notas/02-ident-dep-rend.md
- Onde: aba Outras Informações (coluna Livro Caixa); págs. 64 e 73
- Campos: valor mensal das despesas escrituradas em livro Caixa.
- Validações conhecidas: só para quem recebeu rendimentos do trabalho não assalariado, inclusive titulares de serviços notariais e de registro (exceto remunerados só pelos cofres públicos) e leiloeiros. Vedado a transportadores de passageiros e de cargas e para receita de aluguéis. Valor mensal limitado à receita mensal recebida de PF e/ou PJ. Excesso de um mês pode ser somado aos meses seguintes até dezembro de 2025; excesso em dezembro não pode ser informado nesse mês nem usado em anos posteriores. Autônomo que prestou serviços só a PJ preenche esta coluna para deduzir.
- Conteúdo dedutível: remuneração de terceiros com vínculo empregatício e encargos trabalhistas e previdenciários; emolumentos; despesas de custeio necessárias à receita e à manutenção da fonte produtora. Documentação idônea.
- Regras de cálculo afetadas: total transportado ao Resumo como dedução (livro Caixa). Moeda estrangeira: conversão pela cotação de venda.
- Exige do MCP: cálculo do limite mensal e do transporte de excesso, validação de elegibilidade pela ocupação/tipo de receita.
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo calc; prioridade P1; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### F-RTPF-DARF0190 Carnê-Leão - Darf pago cód. 0190

- Origem: notas/02-ident-dep-rend.md
- Onde: aba Outras Informações; págs. 65 e 74
- Campos: valor mensal do Carnê-Leão pago (principal do Darf), no mês do recebimento do rendimento, independentemente da data do pagamento.
- Validações conhecidas: vencimento no último dia útil do mês subsequente ao recebimento; código de receita 0190. Somente o principal (sem multa e juros).
- Regras de cálculo afetadas: total transportado ao Resumo (imposto pago, dedutível do imposto devido). Imposto pago no exterior compensável na apuração mensal, observado o limite legal, se não compensado/restituído no exterior e pago em país com acordo ou reciprocidade.
- Exige do MCP: registro mensal; possível cálculo de Carnê-Leão devido e geração de orientação de Darf 0190 (inferido, o recolhimento é fora do PGD).
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P0; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

#### F-RTPF-DEP-CPF CPF dos Dependentes (ficha PF/Exterior, aba Dependentes)

- Origem: notas/02-ident-dep-rend.md
- Onde: aba Dependentes da ficha PF/Exterior; pág. 67
- Campos: Dependente (seleção entre os da ficha Dependentes), via botão Novo; depois as mesmas sub-abas e colunas do titular (Trabalho Não Assalariado; Outras Informações: NIT/PIS/PASEP, Aluguéis, Outros, Exterior, Previdência Oficial, Quantidade de Dependentes, Pensão Alimentícia, Livro Caixa, Darf 0190).
- Validações conhecidas: dependente precisa existir antes na ficha Dependentes; excluir a linha apaga todas as informações dela; rendimentos de dependentes NÃO são somados aos do titular nesta aba (informados separadamente), mas entram no Resumo (inferido pelo "transporta o total para o Resumo"). Limite de isenção mensal citado: R$ 2.259,20 (jan a abr) e R$ 2.428,80 (mai a dez).
- Regras de cálculo afetadas: totais dos dependentes transportados ao Resumo; previdência somada à da ficha PJ dependentes.
- Exige do MCP: CRUD por dependente com as mesmas validações; cascata na exclusão.
- Cobertura no MCP Imposto de Renda: `definir_rendimentos_pf_exterior`; módulo model; prioridade P0; status implementada (`definir_rendimentos_pf_exterior`) (ver matriz)

### 3.5 Rendimentos Isentos e Não Tributáveis

#### F-ISENTO Rendimentos Isentos e Não Tributáveis (ficha)

- Origem: notas/03-isentos-exclusivos-rra.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`, `listar_lancamentos`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_isento`, `ler_ficha`, `listar_lancamentos`) (ver matriz)

#### F-ISENTO-01 Bolsas de estudo e de pesquisa caracterizadas como doação, exceto médico-residente ou Pronatec

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 78
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome da fonte pagadora; Valor
- Validações conhecidas: somente bolsa recebida exclusivamente para estudo/pesquisa, sem vantagem para o doador nem contraprestação de serviços (regra de enquadramento, orientação ao usuário)
- Regras de cálculo afetadas: total de isentos
- Exige do MCP: CRUD; orientação de enquadramento
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-02 Bolsas de estudo e de pesquisa de médico-residente e servidor da rede pública de educação profissional (Pronatec)

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 79
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Validações conhecidas: Pronatec isento só a partir de junho de 2013 (Lei nº 12.816/2013)
- Exige do MCP: CRUD
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-03 Capital de apólices de seguro ou pecúlio pago por morte do segurado, prêmio de seguro restituído e pecúlio de previdência privada por morte ou invalidez permanente

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 80
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ e nome da fonte pagadora (inferido, padrão da ficha); Valor
- Validações conhecidas: pecúlio de previdência complementar isento apenas se pago em parcela única por morte ou invalidez permanente do participante
- Exige do MCP: CRUD; orientação
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-04 Indenizações por rescisão de contrato de trabalho, inclusive PDV, e por acidente de trabalho; e FGTS

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 81
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Valor
- Validações conhecidas: inclui indenização e aviso prévio não trabalhado até limite legal/dissídio, verbas de PDV, indenização por acidente de trabalho, saque de FGTS. Não incluir verbas rescisórias (13º, saldo de salário, férias proporcionais, abono, gratificações, aviso prévio trabalhado, PLR) nem direitos adquiridos antes do PDV (resgate de previdência complementar)
- Exige do MCP: CRUD; orientação de segregação de verbas do TRCT
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-05 Ganho de capital em alienação de bens de pequeno valor (até R$ 20.000,00 ações em mercado de balcão; R$ 35.000,00 demais casos, por mês)

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, págs. 82 e 83
- Campos: "Valor informado pelo contribuinte" (campo da esquerda, editável); "Valor transportado pelo programa" (campo da direita, vindo do GCAP)
- Validações conhecidas: limite mensal de alienação para o conjunto de bens da mesma natureza: R$ 20.000,00 (ações no mercado de balcão) e R$ 35.000,00 (demais). Valor isento = valor de alienação menos custo de aquisição da DIRPF 2025 (AC 2024) mais parcelas pagas em 2025
- Regras de cálculo afetadas: total de isentos
- Importações: GCAP (opcional, operação dispensada) transporta o valor
- Exige do MCP: campo duplo (manual + transportado); cálculo auxiliar do ganho isento; checagem do limite mensal por natureza
- Cobertura no MCP Imposto de Renda: `importar_gcap`, `adicionar_rendimento_isento`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `adicionar_rendimento_isento`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### F-ISENTO-06 Ganho de capital na alienação do único imóvel por até R$ 440.000,00, sem outra alienação de imóvel nos últimos 5 anos

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 84
- Campos: Valor informado pelo contribuinte; Valor transportado pelo programa
- Validações conhecidas: único imóvel; valor de venda até R$ 440.000,00; sem outra alienação de imóvel em 5 anos. Valor = venda menos custo (DIRPF 2025) mais parcelas pagas em 2025, se positivo
- Importações: GCAP (inclusive redução de imóvel adquirido em moeda estrangeira até 1988)
- Exige do MCP: campo duplo; validação dos três requisitos (perguntas ao usuário); cálculo auxiliar
- Cobertura no MCP Imposto de Renda: `importar_gcap`, `adicionar_rendimento_isento`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `adicionar_rendimento_isento`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### F-ISENTO-07 Ganho de capital na venda de imóveis residenciais para aquisição em 180 dias de imóveis residenciais no Brasil e redução sobre o ganho de capital

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 85
- Campos: Valor informado pelo contribuinte; Valor transportado pelo programa
- Validações conhecidas: abrange ganho de imóveis adquiridos até 1969; terra nua (diferença quando ganho apurado pelo Diat); redução para imóveis adquiridos até 1988; fatores de redução do art. 40 da Lei nº 11.196/2005; ganho na venda de imóvel residencial com aplicação em 180 dias em outro residencial no Brasil; redução de imóvel adquirido em moeda estrangeira até 1988. Preencher manual só se dispensado do GCAP
- Importações: GCAP
- Exige do MCP: campo duplo; cálculo de fatores de redução (FR1/FR2, inferido), percentual de redução até 1988; controle do prazo de 180 dias
- Cobertura no MCP Imposto de Renda: `importar_gcap`, `adicionar_rendimento_isento`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `adicionar_rendimento_isento`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### F-ISENTO-08 Ganho de capital na alienação de moeda estrangeira em espécie com total anual até US$ 5,000.00

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 86
- Campos: Valor (informado pelo contribuinte)
- Validações conhecidas: total de alienações no ano convertido em dólar (cotação da autoridade monetária do país emissor na data de cada alienação) até US$ 5.000,00
- Importações: NÃO é transportado pelo programa (GCAP não transporta); informar manualmente
- Exige do MCP: CRUD; cálculo/checagem do limite em US$
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`, `converter_moeda`; módulo model; prioridade P2; status implementada (`adicionar_rendimento_isento`, `converter_moeda`, `listar_tabela`) (ver matriz)

#### F-ISENTO-09 Lucros e dividendos recebidos

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 87
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Validações conhecidas: lucros apurados a partir de 1996 distribuídos em 2025 por PJ do lucro real, presumido ou arbitrado. Não informar aqui lucros de PJ no exterior nem rendimentos de aplicações/controladas no exterior (Lei nº 14.754/2023), que vão na ficha Bens e Direitos
- Importações: pode ser lançado a partir de Bens e Direitos, grupo 03, código 01 (Ações)
- Exige do MCP: CRUD; vínculo opcional ao bem; alerta de exterior
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-10 Parcela isenta de proventos de aposentadoria, reserva remunerada, reforma e pensão de declarante com 65 anos ou mais

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, págs. 88 a 92
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor (anual, sem 13º); 13º salário
- Validações conhecidas: limite mensal R$ 1.903,98 (janeiro a dezembro, a partir do mês em que completou 65 anos), independentemente do número de fontes. Limite anual R$ 22.847,76 (12 x 1.903,98) para o campo Valor (somado entre fontes) e R$ 1.903,98 para o 13º. Se exceder, pergunta "Deseja transferir os valores excedentes para a ficha Rendimentos Tributáveis Recebidos de Pessoa Jurídica?": SIM separa e cria lançamento com o excedente na ficha Rendimentos Tributáveis PJ (rendimento e 13º); NÃO gera pendência de limite de isenção ultrapassado. 13º isento limitado a R$ 1.903,98 por fonte pagadora; excedente da soma dos 13º isentos de várias fontes vai na linha 99. Se 13º = 0 com valor, aviso "campo Valor não deve conter o 13º salário isento" e pergunta "Deseja alterar os valores informados conforme tabela acima?". Não há vínculo entre o lançamento isento e o tributável criado (alterar um não afeta o outro). Fapi não tem parcela isenta (tributável integral, ajuste ou exclusiva Lei 11.053/2004)
- Regras de cálculo afetadas: total isentos; possível transferência para rendimentos tributáveis PJ (base de cálculo). Estimativa do 13º isento quando não disponível: A/13 (ano inteiro) ou A/(14 menos mês de início da isenção) se começou no ano (mês diferente de janeiro); valor anual = A menos 13º
- Exige do MCP: CRUD; validação de limites por soma de fontes; ação de segregação automática do excedente; calculadora de separação 13º/anual; checagem de idade pela data de nascimento (inferido)
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`, `transferir_excedente_isencao_65`; módulo calc; prioridade P0; status implementada (`adicionar_rendimento_isento`, `transferir_excedente_isencao_65`) (ver matriz)

#### F-ISENTO-11 Pensão, proventos de aposentadoria, reserva ou reforma por moléstia grave ou aposentadoria/reforma por acidente em serviço

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, págs. 93 e 94
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Rendimento; IRRF; 13º salário (valor líquido do comprovante); IRRF sobre o 13º salário; Contribuição previdenciária oficial
- Validações conhecidas: moléstias: fibrose cística, tuberculose ativa, alienação mental, esclerose múltipla, neoplasia maligna, cegueira (inclusive monocular), hanseníase, paralisia irreversível e incapacitante, hepatopatia grave, cardiopatia grave, Parkinson, espondiloartrose anquilosante, nefropatia grave, Paget avançado, contaminação por radiação, Aids; acidente em serviço ou moléstia profissional. Início da isenção: mês da concessão (doença preexistente), mês do laudo (doença posterior) ou data em que a doença foi contraída conforme laudo. Laudo de serviço médico oficial. Ato Declaratório PGFN nº 5/2016 dispensa contemporaneidade dos sintomas
- Regras de cálculo afetadas: soma IRRF + IRRF 13º do titular vai para Imposto Pago/Retido linha 04; dos dependentes para linha 05 (imposto retido compensável no ajuste)
- Exige do MCP: CRUD; transporte de IRRF para Imposto Pago/Retido; relação com campo "doença grave" da Identificação (inferido)
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-12 Rendimentos de caderneta de poupança, letras hipotecárias, LCA, LCI, CRA e CRI

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 95
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Importações: pode ser lançado a partir de Bens e Direitos grupo 04, código 01 (Depósito em conta poupança) e código 03 (Títulos isentos: LCI, LCA, CRI, CRA, LIG, Debêntures de Infraestrutura e outros)
- Exige do MCP: CRUD; vínculo ao bem; navegação "Visualizar Bem/Direito Associado"
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-13 Rendimento de sócio ou titular de ME/EPP optante pelo Simples Nacional, exceto pró-labore, aluguéis e serviços prestados

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 96
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Validações conhecidas: isenção limitada aos percentuais de presunção do IRPJ (art. 15 da Lei nº 9.249/1995) sobre a receita bruta anual menos o IRPJ devido no Simples; sem limite se houver escrituração contábil com lucro maior; MEI: percentuais do lucro presumido sobre receita bruta
- Exige do MCP: CRUD; calculadora auxiliar de limite (opcional)
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-14 Transferências patrimoniais: doações e heranças

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 97
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ do Doador/Espólio; Nome do Doador/Espólio; Valor (bens recebidos em herança, legado, doação, inclusive adiantamento da legítima)
- Validações conhecidas: sucessão: usar o valor do bem na DIRPF 2025 (AC 2024). Transferência por valor superior ao da declaração anterior gera ganho de capital (tributação no GCAP do transmitente). Meação/dissolução usam código 19; doação/herança de não residente usam código 99
- Exige do MCP: CRUD; validação CPF/CNPJ do doador; orientação de código correto
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-15 Parcela não tributável correspondente à atividade rural

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 98
- Campos: nenhum editável (valor transportado)
- Importações: resultado não tributável da Atividade Rural Brasil e Exterior apurado no Demonstrativo da Atividade Rural
- Exige do MCP: cálculo no módulo de Atividade Rural e transporte automático
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-ISENTO-16 Imposto de anos-calendário anteriores compensado judicialmente neste ano-calendário

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 99
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Valor
- Exige do MCP: CRUD
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P2; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-17 75% dos rendimentos do trabalho assalariado recebidos em moeda estrangeira por servidores de autarquias ou repartições do Governo Brasileiro no exterior

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 100
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Regras de cálculo afetadas: conversão: moeda para dólar pela autoridade monetária do país na data do recebimento; dólar para real pela cotação de compra do Bacen do último dia útil da 1ª quinzena do mês anterior ao recebimento. Os 25% restantes são tributáveis (inferido; vão na ficha PF/Exterior)
- Exige do MCP: CRUD; conversor cambial com tabela de cotações (Tabela de Conversão do Dólar 2025)
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P2; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-18 Incorporação de reservas ao capital / Bonificações em ações

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 101
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Observações: conforme comprovante da emissora ou agente de custódia; reflexo no custo das ações em Bens e Direitos (inferido)
- Exige do MCP: CRUD
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P2; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-19 Transferências patrimoniais: meação e dissolução da sociedade conjugal e da unidade familiar

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 102
- Campos: Tipo de beneficiário; CPF/nome do dependente; Valor (não há fonte pagadora na descrição da Ajuda)
- Validações conhecidas: usar valor do bem na DIRPF 2025 (AC 2024); transferência por valor superior gera ganho de capital; doações e heranças vão no código 14
- Exige do MCP: CRUD
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-20 Ganhos líquidos em ações no mercado à vista em bolsa, alienações até R$ 20.000,00 por mês para o conjunto de ações

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 103
- Campos: Tipo de beneficiário; CPF/nome do dependente; Valor
- Validações conhecidas: limite de alienação mensal R$ 20.000,00 para o conjunto de ações. Não se aplica a day trade, cotas de ETF de ações, resgate de fundos/clubes de ações, exercício de opções, termo
- Importações: relação com Demonstrativo de Renda Variável (inferido; a Ajuda manda informar o valor)
- Exige do MCP: CRUD; calculadora mensal de vendas de ações e verificação do limite
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-21 Ganhos líquidos em operações com ouro ativo financeiro, alienações até R$ 20.000,00 por mês

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 104
- Campos: Tipo de beneficiário; CPF/nome do dependente; Valor
- Exige do MCP: CRUD; checagem do limite mensal
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-22 Recuperação de prejuízos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro)

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 105
- Campos: nenhum editável (transportado)
- Regras de cálculo afetadas: prejuízo acumulado de anos anteriores usado para reduzir ganho neste ano
- Importações: Demonstrativo de Renda Variável (prejuízo compensado)
- Exige do MCP: cálculo no módulo Renda Variável e transporte
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-ISENTO-23 Rendimento bruto, até 90%, de transporte de carga e serviços com trator, máquina de terraplenagem, colheitadeira e assemelhados

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 106
- Campos: Valor (beneficiário e fonte, inferido pelo padrão)
- Validações conhecidas: limitado a 90% do rendimento bruto; presume-se consumido, não justifica acréscimo patrimonial
- Regras de cálculo afetadas: os 10% tributáveis vão para as fichas de rendimentos tributáveis (inferido); não entra na evolução patrimonial justificável
- Exige do MCP: CRUD; cálculo da parcela isenta/tributável; flag "não justifica acréscimo patrimonial"
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P2; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-24 Rendimento bruto, até 40%, de transporte de passageiros

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 107
- Campos: Valor
- Validações conhecidas: limitado a 40% do rendimento bruto; presume-se consumido, não justifica acréscimo patrimonial
- Exige do MCP: CRUD; cálculo 40%/60%
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P2; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-25 Restituição do imposto sobre a renda de anos-calendário anteriores

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 108
- Campos: Valor (beneficiário, inferido)
- Exige do MCP: CRUD; possível importação de restituições recebidas da pré-preenchida (inferido)
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-27 Juros referentes aos Rendimentos Recebidos Acumuladamente

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 109
- Campos: nenhum editável (transportado)
- Importações: campo "Valor recebido referente a juros" da ficha RRA (titular e dependentes)
- Exige do MCP: transporte automático a partir de F-RRA
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-ISENTO-28 Pensão Alimentícia

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, pág. 110
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF do Alimentante (quem pagou); Valor
- Validações conhecidas: isenção só para pensão alimentícia (ADI nº 5422/DF), não para pensão por morte. Beneficiário é o indicado na ação judicial ou escritura, mesmo menor ou incapaz, ainda que pago ao responsável legal; inclui alimentos provisionais e pagamentos via PJ
- Observações: novidade desde ADI 5422; antes era tributável (carnê-leão)
- Exige do MCP: CRUD; validação de CPF do alimentante
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_isento`) (ver matriz)

#### F-ISENTO-99 Outros

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Isentos, págs. 111 a 113
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Descrição; Valor
- Validações conhecidas (lista de enquadramentos): sinistro/furto/roubo menos custo do bem; pensões de portador de deficiência mental; proventos de ex-combatente da FEB; PIS/Pasep; desapropriação de terra nua para reforma agrária menos custo; seguro-desemprego, auxílios natalidade, doença, funeral, acidente; contribuições de 1989 a 1995 resgatadas de previdência complementar, PGBL e Fapi; indenização de anistiados/desaparecidos políticos (Lei 10.559/2002); quotas parlamentares; variação cambial de depósitos não remunerados no exterior; bolsas do art. 19 da Lei 12.871/2013 e art. 16 da Lei 11.129/2005; pensão especial da Talidomida; créditos de ICMS/ISS de programas de nota fiscal (prêmios de sorteio são exclusivos 30%); vale-cultura; doação/herança/pensão isentas recebidas de não residente; juros de mora de remuneração (exceto RRA, que vão na ficha RRA); excesso de 13º isento 65 anos de mais de uma fonte; outros isentos previstos em lei. Diárias e ajuda de custo de remoção não justificam acréscimo patrimonial; garimpeiros até 90% presumidos consumidos
- Importações: pode ser lançado a partir de Bens e Direitos grupo 07, códigos 02 (Fiagro) e 03 (FII), rendimentos isentos de cotas
- Exige do MCP: CRUD com descrição livre; vínculo a bem; catálogo de enquadramentos para orientação
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_isento`) (ver matriz)

### 3.6 Rendimentos Sujeitos à Tributação Exclusiva/Definitiva

#### F-EXCL Rendimentos Sujeitos à Tributação Exclusiva/Definitiva (ficha)

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Fichas da Declaração > Rendimentos Sujeitos à Tributação Exclusiva/Definitiva; págs. 114 a 120
- Aplica-se a: todos; mesmos recortes de período de Final de Espólio e Saída Definitiva
- Estrutura: Aba "Rendimentos" (Novo, Editar, Excluir, seleção de Tipo de Rendimento, Ok/Cancelar); Aba "Totais" (somatório por código)
- Códigos: 01 a 13 e 99 (o código 13 consta no corpo da Ajuda, não no índice)
- Regras de cálculo afetadas: não entra na base de cálculo do ajuste; compõe total de rendimentos tributáveis exclusivamente na fonte no Resumo (Outras Informações) e justifica patrimônio
- Importações: 01 e 08 da ficha Rendimentos PJ (campo 13º); 02, 03, 04 do GCAP; 05 da Renda Variável e FII/Fiagro; 07 e 09 da ficha RRA (opção exclusiva); 12 da ficha Bens e Direitos (Lei 14.754/2023); 06 e 10 podem vir de Bens e Direitos
- Exige do MCP: CRUD por código; transportes automáticos; aba de totais
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_exclusivo`, `listar_lancamentos`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_exclusivo`, `ler_ficha`, `listar_lancamentos`) (ver matriz)

#### F-EXCL-01 13º salário

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: nenhum editável (transportado)
- Importações: campo 13º salário da ficha Rendimentos Tributáveis Recebidos de PJ pelo Titular
- Exige do MCP: transporte automático
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-EXCL-02 Ganhos de capital na alienação de bens e/ou direitos

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: transportado
- Importações: GCAP 2025, inclusive ganhos na integralização de capital de PJ por valor superior ao declarado, sucessão e doação em adiantamento da legítima por valor superior ao da DIRPF 2025, e dissolução conjugal/união estável quando o bem é incluído por valor superior à Situação em 31/12/2024 do cônjuge
- Exige do MCP: cálculo GCAP e transporte
- Cobertura no MCP Imposto de Renda: `importar_gcap`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### F-EXCL-03 Ganhos de capital na alienação de bens, direitos e aplicações financeiras adquiridos em moeda estrangeira

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: transportado
- Importações: GCAP 2025
- Exige do MCP: cálculo GCAP moeda estrangeira e transporte
- Cobertura no MCP Imposto de Renda: `importar_gcap`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### F-EXCL-04 Ganhos de capital na alienação de moeda estrangeira em espécie

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: transportado
- Importações: GCAP 2025
- Exige do MCP: cálculo GCAP espécie e transporte
- Cobertura no MCP Imposto de Renda: `importar_gcap`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### F-EXCL-05 Ganhos líquidos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro)

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: transportado
- Regras de cálculo afetadas: ganhos líquidos menos o imposto pago
- Importações: Demonstrativo de Renda Variável (comuns e day trade) e Operações em FII ou Fiagro
- Exige do MCP: cálculo mensal RV/FII e transporte
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-EXCL-06 Rendimentos de aplicações financeiras

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor (líquido: rendimento menos imposto)
- Validações conhecidas: renda fixa, FIF, fundos de cotas, fundos de ações, swap
- Importações: pode ser lançado a partir de Bens e Direitos: grupo 04 código 02 (Tesouro Direto, CDB, RDB e outros); grupo 07 códigos 01 (come-cotas Lei 14.754/2023), 02 (Fiagro), 03 (FII), 04 (FIA e Fundos Mútuos de Privatização FGTS), 06 (FIP, FIDC entidade de investimento, ETF entidade de investimento), 07 (FIP-IE e FIP-PD&I), 08 (ETF de renda fixa), 10 (Fundos de Infraestrutura, FIDC e outros alíquota 0%)
- Exige do MCP: CRUD; vínculo a bem
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_exclusivo`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_exclusivo`) (ver matriz)

#### F-EXCL-07 Rendimentos recebidos acumuladamente (titular)

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: transportado
- Regras de cálculo afetadas: total de rendimentos recebidos menos contribuição previdenciária oficial, pensão alimentícia e IRRF, da ficha RRA do titular com opção "Exclusiva na Fonte"
- Exige do MCP: transporte a partir de F-RRA-TIT
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-EXCL-08 13º salário recebido pelos dependentes

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: transportado
- Importações: campo 13º salário da ficha Rendimentos Tributáveis Recebidos de PJ pelos Dependentes
- Exige do MCP: transporte
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-EXCL-09 Rendimentos recebidos acumuladamente pelos dependentes

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: transportado
- Regras de cálculo afetadas: idem F-EXCL-07, da ficha RRA dos dependentes com opção exclusiva
- Exige do MCP: transporte a partir de F-RRA-DEP
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-EXCL-10 Juros sobre capital próprio

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Importações: pode ser lançado a partir de Bens e Direitos grupo 03 código 01 (Ações)
- Exige do MCP: CRUD; vínculo a bem
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_exclusivo`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_exclusivo`) (ver matriz)

#### F-EXCL-11 Participação nos lucros ou resultados da empresa (PLR)

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: Tipo de beneficiário; CPF/nome do dependente; CNPJ da fonte pagadora; Nome; Valor
- Exige do MCP: CRUD
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_exclusivo`; módulo model; prioridade P0; status implementada (`adicionar_rendimento_exclusivo`) (ver matriz)

#### F-EXCL-12 Aplicações Financeiras e Lucros e Dividendos no Exterior (Lei 14.754/2023)

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: transportado
- Regras de cálculo afetadas: rendimentos líquidos informados nos campos específicos da ficha Bens e Direitos (aplicações financeiras e lucros/dividendos de entidades no exterior). A apuração anual do imposto de 15% ocorre no Resumo (inferido, conferir com F-BENS-ESP)
- Exige do MCP: transporte a partir de Bens e Direitos exterior
- Cobertura no MCP Imposto de Renda: `calcular_imposto`, `adicionar_bem`; módulo calc; prioridade P1; status implementada (`adicionar_bem`, `comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-EXCL-13 Prêmios líquidos obtidos em loterias de apostas de quota fixa (Lei 14.790/2023)

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: Tipo de beneficiário; CPF/nome do dependente; Descrição; Valor (saldos das contas gráficas do apostador conforme comprovantes dos agentes operadores de apostas)
- Observações: código presente no corpo da Ajuda e ausente do índice da seção; provável novidade recente
- Exige do MCP: CRUD
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_exclusivo`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_exclusivo`) (ver matriz)

#### F-EXCL-99 Outros

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: Tipo de beneficiário; CPF/nome do dependente; CPF/CNPJ da fonte pagadora; Nome; Descrição; Valor (líquido)
- Validações conhecidas (enquadramentos): prêmios de loterias, sorteios, concursos, corridas de cavalos e programas de nota fiscal; amortização antecipada por sorteio de títulos de capitalização; participação de portadores de títulos de capitalização nos lucros; benefícios e resgates de previdência complementar e VGBL com opção pela tabela regressiva (arts. 1º e 2º da Lei 11.053/2004); outros exclusivos na fonte
- Exige do MCP: CRUD com descrição
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_exclusivo`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_exclusivo`) (ver matriz)

### 3.7 Rendimentos Tributáveis de PJ com Exigibilidade Suspensa

#### F-SUSP Rendimentos Tributáveis de PJ (Imposto com Exigibilidade Suspensa)

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Fichas da Declaração; págs. 121 a 124. Duas abas: Titular e Dependentes
- Aplica-se a: todos; recortes de período de Final de Espólio e Saída Definitiva
- Exige do MCP: CRUD nas duas abas; totalizadores para o Resumo
- Observações: dados meramente informativos, não somados aos rendimentos tributáveis na apuração
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_exigibilidade_suspensa`; módulo model; prioridade P2; status implementada (`adicionar_rendimento_exigibilidade_suspensa`) (ver matriz)

#### F-SUSP-TIT Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) - Titular

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: aba Titular, pág. 122
- Campos: Nome da fonte pagadora; CPF/CNPJ da fonte pagadora; Rendimentos tributáveis (imposto com exigibilidade suspensa); Depósitos judiciais do imposto
- Validações conhecidas: fonte obtida do comprovante; sem comprovante, usar contracheques ou recibos. Botões Novo, Editar, Excluir (exclusão múltipla), Ok
- Regras de cálculo afetadas: rendimentos e depósitos judiciais transportados ao Resumo (Outras Informações), sem entrar no cálculo do imposto
- Exige do MCP: CRUD; totais informativos
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_exigibilidade_suspensa`; módulo model; prioridade P2; status implementada (`adicionar_rendimento_exigibilidade_suspensa`) (ver matriz)

#### F-SUSP-DEP Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) - Dependentes

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: aba Dependentes, pág. 123
- Campos: Dependente (seleção entre os da ficha Dependentes); Nome e CPF/CNPJ da fonte; Rendimentos tributáveis; Depósitos judiciais do imposto
- Validações conhecidas: dependente precisa estar cadastrado antes na ficha Dependentes
- Regras de cálculo afetadas: idem titular, informativo
- Exige do MCP: CRUD; validação de dependente
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_exigibilidade_suspensa`; módulo model; prioridade P2; status implementada (`adicionar_rendimento_exigibilidade_suspensa`) (ver matriz)

### 3.8 Rendimentos Recebidos Acumuladamente

#### F-RRA Rendimentos Recebidos Acumuladamente (ficha)

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Fichas da Declaração; págs. 125 a 134. Abas Titular e Dependentes
- Aplica-se a: todos; recortes de período de Final de Espólio e Saída Definitiva
- Regras gerais: RRA de anos anteriores a 2025 sujeitos à tabela progressiva, inclusive decisões das Justiças do Trabalho, Federal, Estaduais e DF. Regra geral é tributação exclusiva na fonte; opção irretratável pelo ajuste anual, individual por titular e por dependente, deve refletir o total recebido por cada um e ser a mesma para todos os RRA de um mesmo contribuinte. A opção só pode ser alterada até 29/05/2026; exceção: se a fonte não reteve conforme IN RFB 1.500/2014 ou reteve a maior, pode mudar para exclusiva mesmo após 29/05/2026
- Não declarar aqui RRA do próprio ano-calendário (vão na ficha da natureza, sujeitos a ajuste, salvo 13º)
- Despesas judiciais e honorários: proporcionalizar entre tributável e isento; lançar em Pagamentos Efetuados código 60 (honorários de ações judiciais, exceto trabalhistas) ou 61 (ações trabalhistas), com nome e CPF/CNPJ do advogado/escritório e valor
- Parcela isenta incluída no RRA: lançar nas linhas da ficha Isentos, exceto parcela isenta 65 anos (campo próprio na ficha RRA) e juros de mora (campo próprio, transportado para Isentos código 27)
- Exige do MCP: CRUD nas duas abas; cálculo do imposto exclusivo por tabela acumulada; transportes; validação de opção uniforme
- Cobertura no MCP Imposto de Renda: `adicionar_rra`, `calcular_rra`; módulo calc; prioridade P1; status implementada (`adicionar_rra`, `calcular_rra`) (ver matriz)

#### F-RRA-TIT Rendimentos Tributáveis de PJ Recebidos Acumuladamente pelo Titular

- Origem: notas/03-isentos-exclusivos-rra.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_rra`, `calcular_rra`; módulo calc; prioridade P1; status implementada (`adicionar_rra`, `calcular_rra`) (ver matriz)

#### F-RRA-DEP Rendimentos Tributáveis de PJ Recebidos Acumuladamente pelos Dependentes

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: aba Dependentes, págs. 133 e 134
- Campos: Tipo de dependente/Dependente (seleção); Opção pela forma de tributação; Nome e CPF/CNPJ da fonte pagadora; Rendimentos tributáveis; Parcela isenta 65 anos; Valor recebido referente a juros; Contribuição previdenciária oficial; Pensão alimentícia; Imposto retido na fonte; Mês do recebimento; Número de meses
- Validações conhecidas: mesmas do titular; abrange RRA de PJ e de PF (texto da Ajuda); opção individual por dependente
- Regras de cálculo afetadas: idem titular; líquido exclusivo vai para Exclusivos código 09
- Exige do MCP: CRUD; mesma calculadora; validação de dependente cadastrado
- Cobertura no MCP Imposto de Renda: `adicionar_rra`, `calcular_rra`; módulo calc; prioridade P1; status implementada (`adicionar_rra`, `calcular_rra`) (ver matriz)

### 3.9 Imposto Pago/Retido

#### F-IMPPAGO Imposto Pago/Retido (ficha)

- Origem: notas/03-isentos-exclusivos-rra.md
- Onde: Fichas da Declaração > Imposto Pago/Retido; págs. 135 e 136
- Aplica-se a: todos (inferido)
- Exige do MCP: edição das linhas 01, 02, 03; cálculo automático das linhas 04 a 07; limite de compensação do imposto do exterior no Resumo
- Cobertura no MCP Imposto de Renda: `definir_imposto_pago`, `calcular_imposto`; módulo model; prioridade P0; status implementada (`comparar_modelos`, `definir_imposto_pago`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-IMPPAGO-01 Linha 01: Imposto Complementar

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: Valor (Darf código 0246 pago de 01/01/2025 a 31/12/2025)
- Validações conhecidas: recolhimento facultativo para antecipar o imposto do ajuste quando há duas ou mais fontes (PF e PJ ou mais de uma PJ)
- Regras de cálculo afetadas: dedução do imposto devido (imposto pago)
- Exige do MCP: campo editável
- Cobertura no MCP Imposto de Renda: `definir_imposto_pago`; módulo model; prioridade P1; status implementada (`definir_imposto_pago`) (ver matriz)

#### F-IMPPAGO-02 Linha 02: Imposto pago no exterior pelo titular e pelos dependentes

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: Valor
- Validações conhecidas: compensável só se relativo a rendimentos informados em "Outras Informações", coluna Exterior, da ficha Rendimentos Tributáveis de PF e do Exterior; país com acordo ou reciprocidade, imposto não restituível/compensável no país de origem. Países listados: África do Sul, Argentina, Áustria, Bélgica, Canadá, Chile, China, Coreia do Sul, Dinamarca, Emirados Árabes Unidos, Equador, Eslováquia, Espanha, Filipinas, Finlândia, França, Hungria, Índia, Israel, Itália, Japão, Luxemburgo, México, Noruega, Países Baixos (Holanda), Peru, Portugal, República Tcheca, Rússia, Singapura, Suécia, Suíça, Trinidad e Tobago, Turquia, Ucrânia, Uruguai, Venezuela. Reciprocidade sem prova: Alemanha, Estados Unidos e Reino Unido. Reciprocidade não alcança tributos estaduais e municipais. País sem acordo/reciprocidade: rendimento informado, imposto não compensável
- Regras de cálculo afetadas: limite de compensação = imposto apurado com rendimentos do exterior menos imposto apurado sem eles; o Resumo mostra o valor limitado, enquanto a ficha mantém o valor digitado. Conversão: moeda para dólar (autoridade monetária do país, data do recebimento) e dólar para real (compra Bacen, último dia útil da 1ª quinzena do mês anterior)
- Exige do MCP: campo editável; cálculo do limite (dois cálculos do imposto); tabela de países com acordo/reciprocidade; conversor cambial
- Cobertura no MCP Imposto de Renda: `definir_imposto_pago`, `calcular_imposto`, `converter_moeda`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `converter_moeda`, `definir_imposto_pago`, `explicar_calculo`, `listar_tabela`, `simular_imposto`) (ver matriz)

#### F-IMPPAGO-03 Linha 03: Imposto sobre a renda na fonte (Lei nº 11.033/2004)

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: Valor
- Validações conhecidas: IR fonte de §§ 1º e 2º, inciso II, art. 2º da Lei 11.033/2004 (o "dedo-duro" de 0,005% em operações de bolsa, inferido), retido no período, desde que não deduzido do imposto sobre ganhos líquidos do mês, não compensado em meses seguintes nem com ganho de capital em alienação de ações
- Regras de cálculo afetadas: imposto pago/retido no ajuste; relação com o saldo "IR fonte (Lei 11.033/2004) a compensar" do Demonstrativo de Renda Variável (inferido)
- Exige do MCP: campo editável; conferência com saldo da Renda Variável
- Cobertura no MCP Imposto de Renda: `definir_imposto_pago`; módulo model; prioridade P2; status implementada (`definir_imposto_pago`) (ver matriz)

#### F-IMPPAGO-04 Linha 04: Imposto retido na fonte do titular

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: calculado
- Regras de cálculo afetadas: soma do IRRF do titular na ficha Rendimentos Tributáveis PJ Titular mais "IRRF" e "IRRF sobre 13º" do código 11 de Isentos (titular)
- Exige do MCP: cálculo automático
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-IMPPAGO-05 Linha 05: Imposto retido na fonte dos dependentes

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: calculado
- Regras de cálculo afetadas: soma do IRRF da ficha Rendimentos Tributáveis PJ Dependentes mais IRRF e IRRF 13º do código 11 de Isentos (dependentes)
- Exige do MCP: cálculo automático
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-IMPPAGO-06 Linha 06: Carnê-Leão do titular

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: calculado
- Importações: total do imposto pago de Carnê-Leão do titular na ficha Rendimentos Tributáveis de PF e do Exterior pelo Titular (Darf 0190, inclusive importação do Carnê-Leão Web)
- Exige do MCP: cálculo automático
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-IMPPAGO-07 Linha 07: Carnê-Leão dos dependentes

- Origem: notas/03-isentos-exclusivos-rra.md
- Campos: calculado
- Importações: total do imposto pago de Carnê-Leão dos dependentes na ficha PF/Exterior pelos Dependentes
- Exige do MCP: cálculo automático
- Observações: a Ajuda não cita aqui o IRRF de RRA com opção pelo ajuste nem o imposto pago de GCAP/RV, que não entram nesta ficha (inferido: IRRF de RRA no ajuste compõe imposto retido no Resumo; conferir no bloco F-RESUMO)
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

### 3.10 Pagamentos Efetuados

#### F-PAG Pagamentos Efetuados (ficha)

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`, `editar_lancamento`, `remover_lancamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`, `editar_lancamento`, `remover_lancamento`) (ver matriz)

#### F-PAG-INSTR Despesas com Instrução (regras comuns aos códigos 01 e 02)

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-01 Código 01, Despesas com instrução no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular/dependente/alimentando; nome da instituição; CNPJ (obrigatório); descrição; valor pago; parcela não dedutível
- Regras: ver F-PAG-INSTR
- Exige do MCP: validação de CNPJ
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-02 Código 02, Despesas com instrução no exterior

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular/dependente/alimentando; nome da instituição; descrição; valor pago; parcela não dedutível (sem CPF/CNPJ)
- Regras: ver F-PAG-INSTR; conversão em moeda estrangeira pela cotação de venda (pág. 147, por analogia, inferido)
- Exige do MCP: conversor de câmbio (venda)
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`, `converter_moeda`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`, `converter_moeda`, `listar_tabela`) (ver matriz)

#### F-PAG-MED Despesas Médicas (regras comuns aos códigos 09 a 22 e 26)

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-09 Código 09, Fonoaudiólogos no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular/dependente/alimentando; nome do profissional; CPF obrigatório; descrição; valor; parcela não dedutível
- Regras: ver F-PAG-MED
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-10 Código 10, Médicos no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-09 (CPF obrigatório)
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-11 Código 11, Dentistas no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-09 (CPF obrigatório)
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-12 Código 12, Psicólogos no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-09 (CPF obrigatório)
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-13 Código 13, Fisioterapeutas no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-09 (CPF obrigatório)
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-14 Código 14, Terapeutas ocupacionais no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-09 (CPF obrigatório)
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-15 Código 15, Médicos no exterior

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular/dependente/alimentando; nome do profissional; descrição; valor; parcela não dedutível (sem CPF/CNPJ)
- Regras: ver F-PAG-MED; conversão cambial pela cotação de venda
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`, `converter_moeda`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`, `converter_moeda`, `listar_tabela`) (ver matriz)

#### F-PAG-16 Código 16, Dentistas no exterior

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-15
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`, `converter_moeda`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`, `converter_moeda`, `listar_tabela`) (ver matriz)

#### F-PAG-17 Código 17, Psicólogos no exterior

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-15
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`, `converter_moeda`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`, `converter_moeda`, `listar_tabela`) (ver matriz)

#### F-PAG-18 Código 18, Fisioterapeutas no exterior

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-15
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`, `converter_moeda`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`, `converter_moeda`, `listar_tabela`) (ver matriz)

#### F-PAG-19 Código 19, Terapeutas ocupacionais no exterior

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-15
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`, `converter_moeda`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`, `converter_moeda`, `listar_tabela`) (ver matriz)

#### F-PAG-20 Código 20, Fonoaudiólogos no exterior

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-15
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`, `converter_moeda`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`, `converter_moeda`, `listar_tabela`) (ver matriz)

#### F-PAG-21 Código 21, Hospitais, clínicas e laboratórios com saúde humana no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular/dependente/alimentando; nome da instituição; CNPJ obrigatório; descrição; valor; parcela não dedutível
- Regras: ver F-PAG-MED
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-22 Código 22, Hospitais, clínicas e laboratórios com saúde humana no exterior

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular/dependente/alimentando; nome da instituição; descrição; valor; parcela não dedutível (sem CNPJ)
- Regras: ver F-PAG-MED; conversão cambial
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`, `converter_moeda`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`, `converter_moeda`, `listar_tabela`) (ver matriz)

#### F-PAG-26 Código 26, Planos de saúde no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular/dependente/alimentando; nome da operadora; CNPJ obrigatório; descrição; valor pago; parcela não dedutível/valor reembolsado
- Validações conhecidas: plano pago no exterior não é dedutível; reembolsos e auxílio-saúde do empregador vão no valor reembolsado
- Importações: Informe de Plano de Saúde (XML: CNPJ e nome do plano, CPF do beneficiário titular/dependente/alimentando, exercício e ano-calendário, valor pago, reembolso; pág. 391); pré-preenchida (Dmed)
- Exige do MCP: importador do XML do informe (xsd informe_planos_saude.xsd); casamento do CPF do beneficiário com titular/dependentes/alimentandos; não duplicar ao reimportar (o PGD duplica, pág. 401)
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-PENSAO Pensão alimentícia judicial ou por escritura pública (regras comuns aos códigos 30, 31, 33 e 34)

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-30 Código 30, Pensão alimentícia judicial paga a residente no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: alimentando; CPF do alimentando (obrigatório); descrição; valor; parcela não dedutível
- Regras: ver F-PAG-PENSAO
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-31 Código 31, Pensão alimentícia judicial paga a não residente no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: alimentando; nome; descrição; valor; parcela não dedutível (a tabela da pág. 139 indica CPF; o texto exige CPF só para residente, dúvida)
- Regras: ver F-PAG-PENSAO
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-33 Código 33, Pensão alimentícia por escritura pública (separação/divórcio) paga a residente no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: idem F-PAG-30 (CPF obrigatório)
- Regras: ver F-PAG-PENSAO
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-34 Código 34, Pensão alimentícia por escritura pública paga a não residente no Brasil

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: idem F-PAG-31
- Regras: ver F-PAG-PENSAO
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-PREV Previdência Complementar e Fapi (regras comuns aos códigos 36 e 37)

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-36 Código 36, Previdência Complementar (inclusive Fapi)

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular ou dependente; nome e CNPJ da entidade/seguradora/administradora do Fapi (CNPJ obrigatório); descrição; valor pago; parcela não dedutível
- Regras: ver F-PAG-PREV
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P0; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-FAPI Fapi, Fundos de Aposentadoria Programada Individual (lançado no código 36)

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: págs. 152 e 153
- Campos: código 36; nome e CNPJ da administradora do Fapi; descrição; valor pago; parcela não dedutível; titular ou dependente
- Regras: limite conjunto de 12% com a previdência complementar; mesmas condições de dedutibilidade de F-PAG-PREV
- Exige do MCP: mesmo tratamento do código 36
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-37 Código 37, Contribuições a entidades de previdência complementar do § 15 do art. 40 da CF (Funpresp e similares)

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: págs. 154 e 155
- Campos: titular ou dependente (nome do dependente); CNPJ da Fundação ou do Plano (obrigatório); Nome da Fundação ou do Plano; Descrição; Valor pago; Contribuição do ente público patrocinador
- Validações conhecidas: dedutível até o limite da contribuição do patrocinador; o excedente entra no limite global de 12% com previdência complementar e Fapi; botões Novo, Editar, Excluir (múltiplas linhas), Ok
- Regras de cálculo afetadas: linha 1 (até o patrocinador) e linha 3 (excedente) das deduções do Resumo
- Exige do MCP: campo "contribuição do patrocinador" e cálculo da divisão
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-60 Código 60, Advogados (honorários de ações judiciais, exceto trabalhistas)

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular ou dependente (informativo); nome do advogado ou escritório; CPF ou CNPJ obrigatório; descrição; valor pago
- Regras de cálculo afetadas: não é dedução direta; usado para despesas de ações judiciais que geram rendimentos (RRA e rendimentos da natureza), proporcionalizadas entre tributável, exclusivo e isento (ver notas 01 e 03)
- Exige do MCP: lançamento automático sugerido ao registrar RRA com despesas judiciais
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-61 Código 61, Advogados (honorários de ações judiciais trabalhistas)

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos e regras: idem F-PAG-60, para ações trabalhistas que geram rendimentos
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-62 Código 62, Advogados (demais honorários)

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular ou dependente; nome; CPF ou CNPJ obrigatório; descrição; valor
- Regras: informativo, sem dedução
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-66 Código 66, Engenheiros, arquitetos e demais profissionais liberais (exceto advogados, administrador ou corretor de imóveis)

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular ou dependente; nome do profissional; CPF obrigatório; descrição; valor
- Regras: informativo, sem dedução
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-70 Código 70, Aluguéis de imóveis

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular ou dependente; nome do locador; CPF ou CNPJ obrigatório; descrição; valor pago
- Validações conhecidas: informar o locador mesmo se pago via procurador ou imobiliária
- Regras: informativo, sem dedução (cruzamento com Dimob, inferido)
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-71 Código 71, Administrador de imóvel

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular ou dependente; nome do administrador; CPF ou CNPJ obrigatório; descrição; valor pago pela administração
- Regras: informativo
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-72 Código 72, Corretor de imóveis

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular ou dependente; nome do corretor; CPF ou CNPJ obrigatório; descrição; valor da corretagem pela venda de imóvel
- Regras: informativo; corretagem compõe a apuração do ganho de capital (inferido)
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-76 Código 76, Arrendamento rural

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular ou dependente; nome do arrendador; CPF ou CNPJ obrigatório; descrição; valor pago
- Validações conhecidas: obrigatório informar aqui o arrendamento pago mesmo quando lançado como despesa da atividade rural (nota 06, D-AR-RD-BRASIL)
- Regras: informativo
- Exige do MCP: consistência com o Demonstrativo da Atividade Rural (inferido)
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-99 Código 99, Outros

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: titular ou dependente; nome do beneficiário; CPF/CNPJ não obrigatório; descrição; valor; parcela não dedutível
- Regras: informativo
- Cobertura no MCP Imposto de Renda: `adicionar_pagamento`; módulo model; prioridade P1; status implementada (`adicionar_pagamento`) (ver matriz)

#### F-PAG-IMPPS Botão "Importar arquivo do plano de saúde"

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: rodapé da ficha Pagamentos Efetuados (Alt+I); também menu Importações > Informe de Plano de Saúde (Ctrl+Shift+I); pág. 142 e 391
- Campos: seleção do arquivo XML do informe recebido da operadora (ano-calendário 2025); pré-visualização (telas PainelPrevisualizadorDeclaracaoAssistidaInformePlanoSaude, PainelItemPagamentosPlanoSaude, PainelItemReembolsosPlanoSaude)
- Validações conhecidas: só adiciona, não apaga dados existentes; reimportar o mesmo informe duplica os lançamentos; conferência é responsabilidade do contribuinte
- Exige do MCP: `importar_informe_plano_saude` com detecção de duplicidade (melhoria sobre o PGD)
- Cobertura no MCP Imposto de Renda: `importar_informe_plano_saude`; módulo importacao; prioridade P1; status implementada (`importar_informe_plano_saude`) (ver matriz)

### 3.11 Doações Efetuadas

#### F-DOA Doações Efetuadas (ficha)

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: Fichas da Declaração > Doações Efetuadas; págs. 156 a 158; botões Novo, Editar, Excluir, OK
- Aplica-se a: todos (recortes de período de Final de Espólio e Saída Definitiva)
- Campos: Código (tabela de doações); Nome do beneficiário; CPF ou CNPJ do beneficiário; Valor pago; Parcela não dedutível (só Incentivo à Cultura); indicador de tipo CPF/CNPJ (layout registro 90, IN_TIPO_CPF_CNPJ)
- Validações conhecidas: relacionar doações aos fundos da Criança e do Adolescente e da Pessoa Idosa (nacional, distrital, estaduais, municipais) e doações ou patrocínios a cultura, audiovisual, desporto e reciclagem; doações a pessoas físicas também (80, 81, 99); doação a pessoa física sem CPF (inclusive não residente) usa código 99; CPF/CNPJ ausente ou inválido impede a gravação; doação a entidade assistencial não é dedutível (erro frequente)
- Códigos: 40, 41, 42, 43, 44, 45, 46, 47, 80, 81, 99
- Regras de cálculo afetadas: "Dedução de incentivo" do cálculo do imposto (só modelo de deduções legais); códigos 80, 81 e 99 são informativos
- Importações/exportações: exclusão de dependente apaga doações dele (nota 05, F-RESUMO-OPCAO); pré-preenchida pode trazer doações (DBF, inferido)
- Exige do MCP: CRUD com validação por código; cálculo dos limites (F-DOA-LIMITES); aviso de que a dedução some no simplificado
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-LIMITES Limites das deduções de incentivo

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-DOA-40 Código 40, Doações ao Estatuto da Criança e do Adolescente

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: pág. 159 e 160
- Campos: nome do Fundo (nacional, estadual, distrital ou municipal); CNPJ obrigatório; valor pago
- Validações conhecidas: contribuições feitas diretamente aos fundos controlados pelos Conselhos, comprovadas por documento dos conselhos; doações diretamente na declaração vão na ficha própria; vedado deduzir em 2026 doações feitas diretamente na declaração de 2025
- Regras: grupo I dos limites
- Exige do MCP: validação do CNPJ contra a tabela de fundos ECA (`fundos-eca.json`, inferido como útil)
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-41 Código 41, Incentivo à cultura

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: pág. 161 e 162
- Campos: nome do produtor ou Fundo Nacional de Cultura; CPF/CNPJ do produtor ou CNPJ do FNC; valor pago; parcela não dedutível
- Validações conhecidas: projetos aprovados pelo MinC (ou Ancine para audiovisual); respeitar período de captação das portarias; incentivo em espécie comprovado por recibo de depósito e declaração do beneficiário; doações de propósito específico da Lei 13.800/2019 (art. 14, II e III) alcançadas se conformes
- Regras de cálculo afetadas: dedutível 80% das doações e 60% dos patrocínios para projetos do art. 25 da Lei 8.313/1991 (item 1: teatro, cinema, literatura, música, artes plásticas, folclore, patrimônio, humanidades, rádio e TV educativas); 100% para os segmentos do art. 18 (item 2: artes cênicas, livros de valor artístico, música erudita, exposições, acervos, curtas e médias, patrimônio, salas de cinema e teatro em municípios com menos de 100 mil habitantes); grupo III dos limites globais
- Exige do MCP: campo de tipo (doação ou patrocínio, art. 18 ou 25) para calcular a parcela não dedutível (inferido; o PGD pede a parcela pronta)
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-42 Código 42, Incentivo à atividade audiovisual

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: pág. 163 e 164
- Campos: nome do produtor, Fundo de Investimento Cultural ou Funcines; CPF/CNPJ; valor pago
- Validações conhecidas: investimentos em obras independentes via cotas de comercialização, patrocínio de obras, cotas de Funcines, projetos credenciados e programas especiais da Ancine; itens I e III só no mercado de capitais autorizado pela CVM; projetos aprovados pela Ancine
- Regras: grupo IV dos limites
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-43 Código 43, Incentivo ao desporto

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: pág. 165 e 166
- Campos: nome do proponente do projeto; CNPJ obrigatório; valor pago
- Validações conhecidas: projetos desportivos e paradesportivos aprovados pelo Ministério do Esporte (educacional, de participação ou de rendimento); vedado pagar remuneração de atleta profissional
- Regras: grupo VI dos limites (teto de 7%)
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-44 Código 44, Fundos controlados pelos Conselhos da Pessoa Idosa

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: pág. 167 e 168
- Campos: nome do Fundo; CNPJ obrigatório; valor pago
- Validações conhecidas: contribuições diretas aos fundos, comprovadas pelos conselhos; doações diretamente na declaração vão na aba "Pessoa Idosa" da ficha própria; vedado deduzir em 2026 doações diretas feitas na declaração de 2025
- Regras: grupo II dos limites
- Exige do MCP: validação do CNPJ contra `fundos-idoso.json` (inferido)
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-45 Código 45, Pronas/PCD

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: pág. 169 e 170
- Campos: nome da instituição; CNPJ obrigatório; valor pago
- Validações conhecidas: doações e patrocínios a ações aprovadas pelo Ministério da Saúde, por pessoas jurídicas sem fins lucrativos dedicadas a deficiências e autismo; patrocínio = incentivo com finalidade promocional
- Regras de cálculo afetadas: limitado a 1% do imposto devido, fora dos limites globais
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-46 Código 46, Pronon

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: pág. 171 e 172
- Campos: nome da instituição; CNPJ obrigatório; valor pago
- Validações conhecidas: instituições de prevenção e combate ao câncer, ações aprovadas pelo Ministério da Saúde
- Regras de cálculo afetadas: limitado a 1% do imposto devido, fora dos limites globais
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-47 Código 47, Apoio direto a projetos da cadeia produtiva da reciclagem

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: pág. 173 e 174
- Campos: nome do projeto (o texto diz "nome e CNPJ do Fundo"); CNPJ obrigatório; valor pago
- Validações conhecidas: projetos aprovados pelo Ministério do Meio Ambiente e Mudança do Clima (capacitação, incubação, pesquisas, infraestrutura, equipamentos e veículos de coleta, redes de comercialização, catadores, novas tecnologias)
- Regras: grupo V dos limites (teto de 6% com I a IV)
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-80 Código 80, Doações em espécie

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: nome do donatário; CPF obrigatório; valor
- Regras: informativo; o donatário informa em Isentos código 14 e Bens e Direitos (nota 05, F-BENS-ESP-DOACAO)
- Exige do MCP: lembrete de ganho de capital e ITCMD fora do escopo (inferido)
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-81 Código 81, Doações em bens e direitos

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: nome do donatário; CPF obrigatório; valor
- Regras: informativo; doação por valor superior ao declarado gera ganho de capital do doador (GCAP)
- Exige do MCP: alerta de GCAP e baixa do bem em Bens e Direitos
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

#### F-DOA-99 Código 99, Outras

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: nome do beneficiário; CPF ou CNPJ (opcional para PF sem CPF, inclusive não residente); valor
- Regras: informativo
- Cobertura no MCP Imposto de Renda: `adicionar_doacao`; módulo model; prioridade P1; status implementada (`adicionar_doacao`) (ver matriz)

### 3.12 Doações Diretamente na Declaração

#### F-DDD Doações Diretamente na Declaração (ficha)

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_doacao_direta_declaracao`, `gerar_darf`; módulo calc; prioridade P1; status implementada (`adicionar_doacao_direta_declaracao`, `gerar_darf`) (ver matriz)

#### F-DDD-ECA Aba "Criança e Adolescente"

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: tipo de fundo; UF; município; valor; CNPJ do fundo (tabela `fundos-eca.json`)
- Regras: ver F-DDD
- Exige do MCP: seleção do fundo por esfera/UF/município na tabela
- Cobertura no MCP Imposto de Renda: `adicionar_doacao_direta_declaracao`, `gerar_darf`; módulo calc; prioridade P1; status implementada (`adicionar_doacao_direta_declaracao`, `gerar_darf`) (ver matriz)

#### F-DDD-IDOSO Aba "Pessoa Idosa"

- Origem: notas/04-pagamentos-doacoes-bens.md
- Campos: tipo de fundo; UF; município; valor; CNPJ do fundo (tabela `fundos-idoso.json`)
- Regras: ver F-DDD
- Cobertura no MCP Imposto de Renda: `adicionar_doacao_direta_declaracao`, `gerar_darf`; módulo calc; prioridade P1; status implementada (`adicionar_doacao_direta_declaracao`, `gerar_darf`) (ver matriz)

### 3.13 Bens e Direitos

#### F-BENS Bens e Direitos (ficha, Declaração de Ajuste Anual)

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `editar_lancamento`, `remover_lancamento`, `repetir_valores_bens`; módulo model; prioridade P0; status implementada (`adicionar_bem`, `editar_lancamento`, `remover_lancamento`, `repetir_valores_bens`) (ver matriz)

#### F-BENS-OBRIG Bens e direitos que devem ser declarados e dispensa

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: págs. 180 e 189
- Validações conhecidas:
  - No Brasil ou no exterior: imóveis, veículos automotores, embarcações e aeronaves, qualquer valor; outros bens móveis e direitos com valor de aquisição unitário igual ou superior a R$ 5.000,00.
  - No Brasil: saldos de conta corrente, poupança e aplicações acima de R$ 140,00 em 31/12/2025; conjunto de ações, quotas ou quinhões de uma mesma empresa e ouro ativo financeiro com valor de aquisição igual ou superior a R$ 1.000,00; conjunto de criptoativos da mesma espécie igual ou superior a R$ 5.000,00.
  - No exterior: aplicações financeiras, ações/quotas e ouro ativo financeiro, criptoativos, independentemente do valor; bens de controladas em transparência fiscal; bens de trust não enquadrado como controlada; participações em controladas diretas sujeitas aos regimes anual ou de disponibilização; controladas indiretas sujeitas aos regimes.
  - Dispensa: saldos até R$ 140,00; bens móveis e direitos (exceto veículos, embarcações e aeronaves) abaixo de R$ 5.000,00; conjunto de ações/quotas/ouro abaixo de R$ 1.000,00.
- Exige do MCP: aviso de dispensa e de obrigatoriedade por valor e grupo
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `listar_pendencias`, `validar_documento`; módulo validate; prioridade P0; status implementada (`adicionar_bem`, `validar_declaracao`, `validar_documento`) (ver matriz)

#### F-BENS-DADOS Dados do bem: campos condicionais

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `listar_pendencias`, `validar_documento`; módulo validate; prioridade P0; status implementada (`adicionar_bem`, `validar_declaracao`, `validar_documento`) (ver matriz)

#### F-BENS-RENDASSOC Rendimentos associados ao bem

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: pág. 184 (grupo 04, códigos 01, 02, 03) e nota 03 (vínculos de isentos 09, 12, 99 e exclusivos 06, 10)
- Campos: botões que abrem lançamento na ficha Isentos (09 lucros a partir de 03.01; 12 poupança e títulos isentos a partir de 04.01 e 04.03; 99 FII/Fiagro a partir de 07.02 e 07.03) ou Exclusivos (06 aplicações a partir de 04.02 e grupo 07; 10 JCP a partir de 03.01); botão "Visualizar Bem/Direito Associado" nas fichas de rendimentos
- Regras de cálculo afetadas: totais de isentos e exclusivos
- Exige do MCP: vínculo bidirecional bem x rendimento (chave do bem, layout registro 88 NR_CHAVE_BEM e registro 36)
- Cobertura no MCP Imposto de Renda: `adicionar_rendimento_isento`, `adicionar_rendimento_exclusivo`; módulo model; prioridade P1; status implementada (`adicionar_rendimento_exclusivo`, `adicionar_rendimento_isento`) (ver matriz)

#### F-BENS-G01 Grupo 01, Bens imóveis

- Origem: notas/04-pagamentos-doacoes-bens.md
- Códigos: 01 Prédio residencial; 02 Prédio comercial; 03 Galpão; 11 Apartamento; 12 Casa; 13 Terreno; 14 Imóvel rural; 15 Sala ou conjunto; 16 Construção; 17 Benfeitorias até 1988; 18 Loja; 19 Garagem avulsa; 99 Outros bens imóveis
- Obrigatoriedade: sempre
- Discriminação: data e forma de aquisição, condôminos e usufruto
- Campos: ver F-BENS-DADOS (endereço, área, unidade, cartório, matrícula, IPTU, CIB, CEI/CNO)
- Exige do MCP: validações do grupo; casos especiais (benfeitorias, imóvel rural, permuta) da nota 05
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `consultar_tabela`; módulo model; prioridade P0; status implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

#### F-BENS-G02 Grupo 02, Bens móveis

- Origem: notas/04-pagamentos-doacoes-bens.md
- Códigos: 01 Veículo automotor terrestre; 02 Aeronave; 03 Embarcação; 04 Bem relacionado com atividade autônoma; 05 Quadro, objeto de arte, coleção, antiguidade; 06 Joia; 99 Outros bens móveis
- Obrigatoriedade: 01 a 03 sempre; demais se valor de aquisição igual ou superior a R$ 5.000,00
- Discriminação: marca, modelo, ano de fabricação, placa (veículo), data e forma de aquisição; linha telefônica: número e local
- Campos: Renavam, Registro de Aeronave, Registro de Embarcação, Registro de Veículo (exterior)
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `consultar_tabela`; módulo model; prioridade P0; status implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

#### F-BENS-G03 Grupo 03, Participações societárias

- Origem: notas/04-pagamentos-doacoes-bens.md
- Códigos: 01 Ações (inclusive listadas em bolsa); 02 Quotas ou quinhões de capital; 03 Holding patrimonial (ações ou quotas por integralização de bens já declarados); 99 Outras participações
- Obrigatoriedade: valor de aquisição igual ou superior a R$ 1.000,00 (exterior: sempre)
- Discriminação: quantidade e tipo, nome da PJ; tipos diferentes em itens separados
- Campos: CNPJ da emissora; Negociados em bolsa e código de negociação (01); titular/dependente
- Regras: base dos lançamentos de lucros (isento 09) e JCP (exclusivo 10); controladas no exterior (nota 05)
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `consultar_tabela`; módulo model; prioridade P0; status implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

#### F-BENS-G04 Grupo 04, Aplicações e investimentos

- Origem: notas/04-pagamentos-doacoes-bens.md
- Códigos: 01 Depósito em conta poupança; 02 Títulos públicos e privados tributáveis (Tesouro Direto, CDB, RDB e outros); 03 Títulos isentos (LCI, LCA, LCD, CRI, CRA, LIG, Debêntures de Infraestrutura e outros); 04 Ativos negociados em bolsa no Brasil (BDRs, opções e outros, exceto ações e fundos); 05 Ouro ativo financeiro; 99 Outras aplicações e investimentos
- Obrigatoriedade: 01 a 03 saldo maior que R$ 140,00; 04 e 05 valor de aquisição igual ou superior a R$ 1.000,00; 99 conforme natureza
- Discriminação: instituição, conta, cotitular (nome e CPF) se conjunta; 04: quantidade e série de opções e vencimento; 05: instituição ou custodiante e gramas
- Campos: banco, agência e conta (01); CNPJ da instituição/emissora; código de negociação (04); botões de rendimentos associados (01, 02, 03)
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `consultar_tabela`; módulo model; prioridade P0; status implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

#### F-BENS-G05 Grupo 05, Créditos

- Origem: notas/04-pagamentos-doacoes-bens.md
- Códigos: 01 Empréstimos concedidos; 02 Crédito decorrente de alienação; 99 Outros créditos
- Obrigatoriedade: valor igual ou superior a R$ 5.000,00
- Discriminação: valor, prazo e condições, nome do devedor
- Campos: CPF ou CNPJ do devedor
- Regras: crédito de lucros a receber de controlada no exterior no regime anual vai em 05.99 (nota 05)
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `consultar_tabela`; módulo model; prioridade P0; status implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

#### F-BENS-G06 Grupo 06, Depósitos à vista e numerário

- Origem: notas/04-pagamentos-doacoes-bens.md
- Códigos: 01 Depósito em conta corrente ou conta pagamento; 02 Conta gráfica em agente operador de apostas de quota fixa (Lei 14.790/2023, país sempre 105 Brasil); 10 Dinheiro em espécie, moeda nacional; 11 Dinheiro em espécie, moeda estrangeira; 99 Outros depósitos à vista
- Obrigatoriedade: saldo maior que R$ 140,00 (02: R$ 5.000,00 conforme tabela)
- Campos: banco, agência e conta (01); CNPJ da instituição ou do agente operador (02); tipo e quantidade de moeda (10, 11)
- Observações: código 02 é novidade relacionada às apostas de quota fixa (não aparece na tabela resumida da pág. 361, só na tabela da pág. 192)
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `consultar_tabela`; módulo model; prioridade P0; status implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

#### F-BENS-G07 Grupo 07, Fundos

- Origem: notas/04-pagamentos-doacoes-bens.md
- Códigos: 01 Fundos sujeitos a come-cotas (Lei 14.754/2023); 02 Fiagro; 03 FII; 04 FIA e FMP-FGTS; 06 FIP, FIDC e ETF entidades de investimento; 07 FIP-IE e FIP-PD&I; 08 ETF de renda fixa; 10 Fundos de infraestrutura, FIDC e outros alíquota 0%; 12 FIEE; 13 Fundo multimercado (art. 25 c/c art. 40 da Lei 14.754/2023); 99 Fundos no exterior
- Obrigatoriedade: saldo maior que R$ 140,00
- Discriminação: CNPJ do fundo, administradora, quantidade de quotas, cotitular
- Campos: CNPJ obrigatório; negociado em bolsa e código de negociação; rendimentos associados (isento 99 para FII/Fiagro; exclusivo 06)
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `consultar_tabela`; módulo model; prioridade P0; status implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

#### F-BENS-G08 Grupo 08, Criptoativos

- Origem: notas/04-pagamentos-doacoes-bens.md
- Códigos: 01 Bitcoin (BTC); 02 Altcoins (ETH, XRP, BCH, LTC etc., com Código Altcoin); 03 Stablecoins (USDT, USDC, BRZ, BUSD, DAI, TUSD, GUSD, PAX, PAXG etc., com Código Stablecoin); 10 NFTs; 99 Outros criptoativos
- Obrigatoriedade: no Brasil, valor de aquisição igual ou superior a R$ 5.000,00 por espécie; no exterior, sempre
- Discriminação: quantidade, custodiante e CNPJ ou modelo de carteira (autocustódia); tipos diferentes em itens separados
- Campos: titular/dependente; indicador de autocustódia (03); CNPJ do custodiante; valor original de aquisição
- Regras: ativo custodiado ou negociado por instituição no exterior é aplicação financeira no exterior (nota 05)
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `consultar_tabela`; módulo model; prioridade P0; status implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

#### F-BENS-G99 Grupo 99, Outros bens e direitos

- Origem: notas/04-pagamentos-doacoes-bens.md
- Códigos: 01 Licença e concessão especiais; 02 Título de clube; 03 Direito de autor, inventor e patente; 04 Direito de lavra; 05 Consórcio não contemplado; 06 VGBL; 07 JCP creditado e não pago; 08 Leasing com opção de compra no fim do contrato; 99 Outros bens e direitos
- Obrigatoriedade: 01 a 04 valor igual ou superior a R$ 5.000,00; 06, 07, 08 sempre
- Discriminação: 05 administradora, tipo de bem, parcelas pagas e a pagar; 06 instituição, conta, apólice; 07 nome da PJ; 08 fim do contrato; 99 qualquer informação sem campo próprio, inclusive aviso de que bens comuns estão na declaração do cônjuge (com nome e CPF)
- Campos: CNPJ da administradora (05), seguradora (06), PJ devedora (07); país (08)
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `consultar_tabela`; módulo model; prioridade P0; status implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

#### F-BENS-COMUNS Situações individuais: bens comuns, condomínio e tipos de declaração

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `listar_pendencias`, `obter_ajuda`; módulo validate; prioridade P1; status implementada (`obter_ajuda`, `validar_declaracao`) (ver matriz)

#### F-BENS-DATAAQ Informações dos bens conforme a data de aquisição

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: págs. 196 e 197
- Regras de cálculo afetadas:
  - Até 31/12/1995: Situação 31/12/2024 e 31/12/2025 = valor da DAA 2025. Sem declaração: até 1991 e nunca obrigado, avaliar a mercado em 31/12/1991 em cruzeiros e dividir por 720,4779; até 1991 obrigado ou 1992 a 1995, usar a Tabela de Atualização do Custo de Bens e Direitos.
  - De 1996 a 2024: à vista, custo de aquisição em 2024 repetido em 2025; a prazo ou financiado com garantia (SFH, consórcio): 2024 = parcelas pagas de 1996 a 2024; 2025 = 2024 + parcelas de 2025.
  - Em 2025: à vista, 2024 vazio e 2025 = custo; a prazo, 2024 vazio e 2025 = parcelas pagas em 2025.
  - Guardar documentação de benfeitorias.
- Exige do MCP: assistente de valor por data e forma de aquisição; tabela de atualização (S-TAB-ATUALIZACAO)
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `atualizar_custo_bem`; módulo calc; prioridade P1; status implementada (`aplicar_caso_especial_bem`, `atualizar_custo_bem`) (ver matriz)

#### F-BENS-DFE Bens e Direitos na Declaração Final de Espólio

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `definir_partilha_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `definir_partilha_bem`) (ver matriz)

#### F-BENS-DSDP Bens e Direitos na Declaração de Saída Definitiva

- Origem: notas/04-pagamentos-doacoes-bens.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `repetir_valores_bens`, `converter_moeda`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `converter_moeda`, `listar_tabela`, `repetir_valores_bens`) (ver matriz)

#### F-BENS-ALIEN-DFE Bens e direitos alienados no ano (Final de Espólio)

- Origem: notas/04-pagamentos-doacoes-bens.md
- Onde: pág. 199
- Campos: Discriminação (bem, nome e CPF/CNPJ do adquirente, data e valor)
- Validações conhecidas: não preencher Situação na data da partilha nem Valor de transferência (em conflito com a tabela por data da pág. 200, que manda preencher a partilha com o valor da DAA 2025 para alienação em 2025; dúvida)
- Exige do MCP: alerta de GCAP; registrar a divergência
- Cobertura no MCP Imposto de Renda: `adicionar_bem`; módulo model; prioridade P2; status implementada (`adicionar_bem`) (ver matriz)

#### F-BENS-ESP-BENFEITORIAS Benfeitorias

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-CONSORCIO Consórcios

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-LEASING Leasing

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-VGBL VGBL

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Bens e Direitos (pág. 210)
- Aplica-se a: todos
- Campos: CNPJ e Discriminação (seguradora); Situação 31/12/2024 (valores pagos até 31/12/2024); Situação 31/12/2025 (Sit. 2024 + pagos em 2025)
- Validações conhecidas: usar código 06 do grupo 99 para seguro de vida com cobertura por sobrevivência
- Códigos: grupo 99 código 06 VGBL
- Regras de cálculo afetadas: evolução patrimonial; não é dedução (inferido, pois PGBL é que deduz na ficha Pagamentos)
- Importações/exportações: possível origem na pré-preenchida (inferido)
- Exige do MCP: validação de CNPJ da seguradora; alerta para não lançar VGBL como pagamento dedutível (inferido)
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-PERMUTA Permuta

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-IMOVEL-RURAL Imóvel rural

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-DOACAO Doação recebida

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Bens e Direitos (pág. 214)
- Aplica-se a: todos
- Campos: código do bem recebido; Discriminação (espécie, nome e CPF do doador); Sit. 2024 vazia; Sit. 2025 = saldo em 31/12/2025 (doação em espécie) ou valor do bem
- Validações conhecidas: Sit. 2024 não preenchida
- Códigos: código conforme o bem
- Regras de cálculo afetadas: o valor da doação recebida vai em Rendimentos Isentos (código 14 Transferências patrimoniais - doações e heranças, inferido do código); o doador informa em Doações Efetuadas (doação em espécie, com CPF do beneficiário)
- Importações/exportações: transferência entre fichas Bens x Isentos
- Exige do MCP: regra cruzada "doação recebida em Bens exige lançamento em Isentos"; validação de CPF do doador
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-HERANCA Herança, meação, legado ou doação (inclusive adiantamento da legítima)

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Bens e Direitos (pág. 215)
- Aplica-se a: todos
- Campos: Discriminação (dados do bem e forma de aquisição); Sit. 2024 vazia; Sit. 2025 = valor da última declaração do falecido ou doador, ou opcionalmente valor superior
- Validações conhecidas: transferência por valor superior ao declarado está sujeita a ganho de capital (GCAP 2025)
- Códigos: conforme o bem
- Regras de cálculo afetadas: Isentos (transferências patrimoniais); ganho de capital do transmitente
- Importações/exportações: GCAP
- Exige do MCP: alerta de ganho de capital quando valor informado maior que o do transmitente
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-DISSOLUCAO Bens recebidos por dissolução da sociedade conjugal ou união estável

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Bens e Direitos (pág. 216)
- Aplica-se a: todos
- Campos: Discriminação (dados e forma de aquisição); Sit. 2024 vazia; Sit. 2025 = valor da última declaração de quem informava o bem, ou valor de transferência se superior
- Validações conhecidas: valor superior ao declarado sujeita a ganho de capital (GCAP 2025)
- Códigos: conforme o bem; isento código 19 (meação e dissolução, inferido)
- Regras de cálculo afetadas: Isentos; GCAP
- Exige do MCP: mesmo alerta de F-BENS-ESP-HERANCA
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-EXTERIOR Bens e direitos situados no exterior

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-TRANSPARENCIA Regime de Transparência Fiscal de Entidade Controlada (art. 8º da Lei 14.754/2023)

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `calcular_imposto`, `converter_moeda`; módulo calc; prioridade P1; status implementada (`adicionar_bem`, `comparar_modelos`, `converter_moeda`, `explicar_calculo`, `listar_tabela`, `simular_imposto`) (ver matriz)

#### F-BENS-ESP-DEP-NAO-REMUNERADO Depósitos não remunerados em moeda estrangeira (conta, cartão de débito ou crédito no exterior)

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Bens e Direitos, item 1 (pág. 219)
- Aplica-se a: todos
- Campos: Discriminação (valor em moeda estrangeira, banco, número da conta); Sit. 2024 (saldo em reais da declaração anterior); Sit. 2025 (saldo em 31/12/2025 convertido pela cotação de fechamento de venda do Bacen)
- Validações conhecidas: grupo 06 código 01 (conta corrente ou conta pagamento no exterior) ou código 99 (cartão de débito ou crédito)
- Códigos: grupo 06 códigos 01 e 99
- Regras de cálculo afetadas: variação cambial isenta se não remunerado e em instituição autorizada; acréscimo patrimonial por variação cambial vai em Isentos código 99 Outros. Se não cumprir requisitos, variação cambial tributada como ganho de capital (art. 21 Lei 8.981/1995)
- Importações/exportações: nenhuma
- Exige do MCP: cálculo da variação cambial e sugestão de lançamento em Isentos 99; cotação Bacen da data do fato gerador
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-MOEDA-ESPECIE Moeda estrangeira mantida em espécie

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Bens e Direitos, item 2 (pág. 220)
- Aplica-se a: todos
- Campos: um item por moeda; Discriminação (quantidade em 31/12/2025); Sit. 2024 (valor em reais da declaração anterior); Sit. 2025 (custo médio ponderado: Sit. 2024 + aquisições em reais - alienações em reais)
- Validações conhecidas: custo da moeda adquirida em reais = valor pago; adquirida em moeda estrangeira = quantidade x cotação de fechamento de venda do Bacen na data
- Códigos: grupo 06 código 11 Dinheiro em espécie - moeda estrangeira; isento código 08 (alienações até US$ 5.000,00 no ano)
- Regras de cálculo afetadas: ganho isento até alienações de US$ 5.000,00 no ano (Isentos 08); acima disso, ganho integralmente tributado no GCAP (moeda estrangeira em espécie); imposto não compensável na DAA, Darf emitido pelo GCAP
- Importações/exportações: GCAP
- Exige do MCP: calculadora de custo médio ponderado de moeda; controle do limite de US$ 5.000,00; encaminhamento ao GCAP
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-EMPRESTIMO Empréstimo concedido

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Bens e Direitos, item 3 (pág. 220)
- Aplica-se a: todos
- Campos: Discriminação (nome e CPF do mutuário, valor recebido em 2025 se houver); Sit. 2024; Sit. 2025 (saldos)
- Validações conhecidas: CPF do mutuário
- Códigos: grupo 05 Créditos (código específico, ver notas 04, inferido)
- Regras de cálculo afetadas: evolução patrimonial; empréstimo a devedor no exterior é aplicação financeira no exterior
- Exige do MCP: validação de CPF
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-APLIC-EXTERIOR Aplicações financeiras no exterior (Lei 14.754/2023)

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `calcular_imposto`, `converter_moeda`; módulo calc; prioridade P1; status implementada (`adicionar_bem`, `comparar_modelos`, `converter_moeda`, `explicar_calculo`, `listar_tabela`, `simular_imposto`) (ver matriz)

#### F-BENS-ESP-CONTROLADAS Participação em entidades controladas no exterior

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `calcular_imposto`, `converter_moeda`; módulo calc; prioridade P1; status implementada (`adicionar_bem`, `comparar_modelos`, `converter_moeda`, `explicar_calculo`, `listar_tabela`, `simular_imposto`) (ver matriz)

#### F-BENS-ESP-DESINCORPORADOS Bens e direitos desincorporados do patrimônio em 2025

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Bens e Direitos (pág. 232)
- Aplica-se a: todos
- Campos: Discriminação (dados do bem; se alienação, nome e CPF/CNPJ do adquirente, data e valor); Sit. 2024 = valor anterior; Sit. 2025 vazia
- Validações conhecidas: Sit. 2025 não preenchida
- Regras de cálculo afetadas: alienação pode gerar rendimento tributável (GCAP ou Renda Variável)
- Exige do MCP: alerta para apurar ganho no GCAP ou na Renda Variável; validação CPF/CNPJ do adquirente
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-ADQ-ALIENADOS Bens e direitos adquiridos e alienados em 2025

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Bens e Direitos (pág. 233)
- Aplica-se a: todos
- Campos: Discriminação (valor, nomes e CPF/CNPJ de alienantes e adquirentes, datas e valores de aquisição e alienação, condições de financiamento); Sit. 2024 e Sit. 2025 vazias
- Validações conhecidas: ambas as situações em branco
- Regras de cálculo afetadas: GCAP, Renda Variável, FII ou Fiagro
- Exige do MCP: mesmo alerta de F-BENS-ESP-DESINCORPORADOS
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

#### F-BENS-ESP-NOVO-RESIDENTE Bens de quem adquiriu ou readquiriu residência no Brasil em 2025

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `aplicar_caso_especial_bem`, `adicionar_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) (ver matriz)

### 3.14 Dívidas e Ônus Reais

#### F-DIV Dívidas e Ônus Reais

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_divida`, `editar_lancamento`, `remover_lancamento`; módulo model; prioridade P0; status implementada (`adicionar_divida`, `editar_lancamento`, `remover_lancamento`) (ver matriz)

### 3.15 Espólio (ajuste com natureza 81)

#### F-ESPOLIO Espólio (Ajuste Anual com natureza de ocupação 81)

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: ficha Espólio, habilitada ao selecionar Natureza da ocupação 81 - Espólio na Identificação (pág. 238)
- Aplica-se a: Ajuste Anual de espólio (inicial e intermediárias)
- Campos: "Trata-se de uma Sobrepartilha?" (Sim/Não); Identificação do Inventariante da Partilha (se Não) ou da Sobrepartilha (se Sim): CPF (11 algarismos), Nome completo
- Validações conhecidas: Sim somente se já houver Declaração Final de Espólio de Partilha apresentada; CPF do inventariante ou do interessado com poderes de inventariante (inventário por escritura pública, arts. 610 e 611 da Lei 13.105/2015 CPC)
- Códigos: natureza de ocupação 81
- Regras de cálculo afetadas: nenhuma direta
- Exige do MCP: habilitação condicional da ficha pela natureza 81; validação de CPF; distinção partilha x sobrepartilha
- Observações: Declaração Final de Espólio tratada nas notas 06
- Cobertura no MCP Imposto de Renda: `definir_espolio`; módulo model; prioridade P1; status implementada (`definir_espolio`) (ver matriz)

### 3.16 Doações a Partidos Políticos e Candidatos

#### F-PARTIDOS Doações a Partidos Políticos e Candidatos a Cargos Eletivos

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: ficha própria (págs. 239 e 240)
- Aplica-se a: Ajuste Anual, Final de Espólio, Saída Definitiva (período conforme o tipo)
- Campos: CNPJ; Nome do candidato ou partido; Valor. Botões Novo, OK, Editar, Excluir
- Validações conhecidas: relacionar todas as doações e gastos eleitorais de 2025; CNPJ válido
- Códigos: nenhum
- Regras de cálculo afetadas: NÃO dedutível; total transportado para Resumo, Outras Informações
- Importações/exportações: nenhuma
- Exige do MCP: CRUD; validação de CNPJ; informação de que não há dedução
- Observações: lista de gastos eleitorais da Lei 9.504/1997 (impressos com adesivo até 50 x 40 cm, propaganda, aluguel de locais, transporte, correspondência, comitês, remuneração de pessoal, carros de som, comícios, programas de rádio e TV, pesquisas, sites e impulsionamento com provedor sediado no País)
- Cobertura no MCP Imposto de Renda: `adicionar_doacao_eleitoral`; módulo model; prioridade P1; status implementada (`adicionar_doacao_eleitoral`) (ver matriz)

### 3.17 Informações do Cônjuge

#### F-CONJUGE Informações do Cônjuge ou Companheiro (inferido)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: relatório relDeclaracaoConjuge; layout registro 29 (NR_CONJ, VR_BASE, VR_IMPOSTO, VR_ISENTO, VR_EXCLUSIVO, VR_RENDPJ_EXIB_SUSP, VR_TOTALCONJ)
- Aplica-se a: declaração em separado com cônjuge informado na Identificação (inferido)
- Campos: CPF do cônjuge; base de cálculo do imposto, imposto pago ou retido, rendimentos isentos, rendimentos exclusivos, rendimentos com exigibilidade suspensa e total de rendimentos do cônjuge (inferido pelos nomes)
- Exige do MCP: campos opcionais ligados a F-IDENT-CONJ; confirmar no programa se a ficha existe na interface de 2026
- Observações: lacuna da Ajuda
- Cobertura no MCP Imposto de Renda: `definir_identificacao`; módulo model; prioridade P2; status implementada (`definir_identificacao`) (ver matriz)

### 3.18 Declaração de Saída Definitiva do País

#### F-SAIDA-GERAL Declaração de Saída Definitiva do País: obrigações

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda págs. 342 a 344
- Aplica-se a: Saída Definitiva
- Validações conhecidas:
  - Quem se ausentar em caráter permanente ou passar a não residente após ausência temporária deve: apresentar a DSDP do período de residência no ano da saída até o último dia útil de maio do ano seguinte; apresentar na mesma data as DAA de anos anteriores obrigatórias e não entregues; recolher em quota única, até essa data, o imposto apurado e os demais créditos tributários.
  - Prazo 2026: até 29/05/2026, para saída permanente em 2025 ou para quem completou 12 meses consecutivos de ausência em 2025.
  - Forma: computador com o IRPF2026; entrega pela Internet (Receitanet incorporado ao PGD) ou mídia removível nas unidades da RFB.
  - Rendimentos abrangidos: de 1º/01 (ou da aquisição da residência no ano) até o dia anterior à saída permanente; de 1º/01 até o dia em que completar 12 meses de ausência na saída temporária. Aplicam-se as normas do ano-calendário.
- Exige do MCP: tipo de declaração DSDP; cálculo de período; aviso de DAA anteriores pendentes
- Observações: complementa S-TIPO-DSDP e S-REGRA-AUSENTE-OUTROS
- Cobertura no MCP Imposto de Renda: `criar_declaracao`, `definir_saida_definitiva`; módulo model; prioridade P1; status implementada (`criar_declaracao`, `definir_saida_definitiva`) (ver matriz)

#### F-SAIDA-IDENT Ficha Identificação do Contribuinte na Saída Definitiva

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda págs. 344 a 346
- Campos: Tipo (Original, primeira do exercício 2026; Retificadora, com nº do recibo da DSDP anterior, obrigatório, obtido em Declaração > Imprimir > Recibo ou Declaração > Abrir); Nome; Data de nascimento; Doença grave ou deficiência (prioridade na restituição, art. 69-A Lei 9.784/1999); Raça/Cor; Possui cônjuge (CPF com 11 dígitos se SIM); Endereço Brasil ou Exterior; "Houve mudança de endereço?" (SIM/NÃO); endereço completo no exterior com código do país e do posto do MRE mais próximo; sem endereço no exterior: endereço do procurador no Brasil ou de contato no Brasil; Natureza da ocupação e Ocupação principal (naturezas 13, 14, 61, 62, 71 e 72 dispensam ocupação)
- Validações conhecidas: recibo obrigatório na retificadora; regras de nome e data iguais às do Ajuste (nota 02)
- Exige do MCP: validação específica de DSDP (posto MRE, tabela de representações)
- Cobertura no MCP Imposto de Renda: `definir_identificacao`; módulo model; prioridade P1; status implementada (`definir_identificacao`) (ver matriz)

#### F-SAIDA Ficha Saída

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda pág. 346; tela PainelSaida
- Aplica-se a: Saída Definitiva
- Campos: Procurador (CPF, nome e endereço completo), se houver; Data da caracterização da condição de não residente (data da saída se permanente; dia seguinte ao que completou 12 meses de ausência se temporária); Data da caracterização da condição de residente no País, se ocorrida a partir de 01/01/2025; país de nova residência (layout registro 39: CD_NOVO_PAIS_RESIDENCIA, NM_PAIS, inferido)
- Validações conhecidas: data de não residência dentro de 2025 (inferido); data de residência anterior à de não residência (inferido)
- Regras de cálculo afetadas: define o número de meses da tabela progressiva (soma das tabelas mensais) e o período das fichas
- Exige do MCP: `definir_saida_definitiva`; validação de datas; cálculo do período
- Cobertura no MCP Imposto de Renda: `definir_saida_definitiva`; módulo model; prioridade P1; status implementada (`definir_saida_definitiva`) (ver matriz)

#### F-SAIDA-DEDUCOES Deduções na Saída Definitiva

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda pág. 346
- Regras de cálculo afetadas: permitidas todas as deduções legais; limites anuais de dependentes e instrução podem ser usados integralmente se preenchidos os requisitos; deduções do período de residência (1º/01 ou data da residência até a véspera da saída permanente, ou até completar 12 meses de ausência)
- Exige do MCP: não proporcionalizar limites anuais de dependentes e instrução
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-SAIDA-DIVIDAS Dívidas e Ônus Reais na Saída Definitiva

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda pág. 348
- Campos: código; discriminação; Situação em 31/12/2024; Situação na data da caracterização de não residente
- Exige do MCP: campo de data de não residência nas dívidas
- Cobertura no MCP Imposto de Renda: `adicionar_divida`; módulo model; prioridade P1; status implementada (`adicionar_divida`) (ver matriz)

#### F-SAIDA-CALC Cálculo do imposto na Saída Definitiva

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda págs. 348 e 349
- Regras de cálculo afetadas: soma das tabelas progressivas mensais dos meses do período, ainda que os rendimentos sejam de um ou alguns meses. Exemplo: residente em 01/01/2025 e não residente em 16/06/2025 usa a soma das tabelas de janeiro a junho. Se adquiriu residência no mesmo ano, soma dos meses da data da residência até o retorno à não residência. Tabela mensal de janeiro a abril difere da de maio a dezembro (S-TAB-PROGRESSIVA).
- Exige do MCP: motor de cálculo com tabela proporcional por meses e por faixa mensal vigente em cada mês
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-SAIDA-IMPEXT Compensação do imposto pago no exterior na Saída Definitiva

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda pág. 349
- Regras de cálculo afetadas: mesma lista de países com acordo (África do Sul a Venezuela) e reciprocidade sem prova (Alemanha, Estados Unidos, Reino Unido); prova de reciprocidade por lei traduzida e autenticada ou declaração da representação diplomática; tributos estaduais e municipais excluídos; limite = imposto com rendimentos do exterior menos imposto sem eles; conversão pela cotação de compra do Bacen do último dia útil da 1ª quinzena do mês anterior ao recebimento
- Exige do MCP: mesmo cálculo de F-IMPPAGO-02 aplicado à tabela proporcional
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-SAIDA-PAGTO Pagamento, restituição e disposições finais da Saída Definitiva

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda págs. 350 e 351
- Regras de cálculo afetadas: quota única até a data da apresentação, inclusive do imposto do ano anterior e outros créditos; sem parcelamento; reclamações não suspendem a cobrança (depósito permitido); após o prazo: multa de mora 0,33% ao dia limitada a 20% e juros Selic acumulada desde o mês seguinte ao previsto para a apresentação até o mês anterior ao pagamento mais 1% no mês do pagamento; restituição só ao contribuinte ou procurador; formas: transferência eletrônica ou Darf em agência ou caixa eletrônico (no Brasil, contribuinte ou procurador)
- Validações conhecidas: rendimentos de fonte no Brasil de não residente: tributação definitiva (ganho de capital e aplicações) ou exclusiva na fonte, sem isenções de residente, salvo tratado; o não residente deve comunicar a fonte pagadora por escrito (Comunicação à Fonte Pagadora de Saída do País); consultar IN SRF 208/2002
- Exige do MCP: bloqueio de quotas na DSDP; geração da comunicação à fonte pagadora (M-IMPR-COMUNICACAO-SAIDA)
- Cobertura no MCP Imposto de Renda: `simular_quotas`, `calcular_acrescimos_moratorios`; módulo calc; prioridade P1; status implementada (`calcular_acrescimos_moratorios`, `calcular_quotas`) (ver matriz)

#### F-SAIDA-DARF Darf da Saída Definitiva

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda págs. 351 e 352
- Campos: CPF (programa); Nome (programa); Período de apuração (data da caracterização da não residência da ficha Saída); Data de vencimento (preenchida pelo declarante: data de apresentação obrigatória); Número do documento (gerado pelo programa); Código 0211; Principal; Multa (0,33% ao dia, limite 20%); Juros (Selic + 1%); Total (no prazo = principal; após = soma)
- Validações conhecidas: ao apresentar, o contribuinte fica notificado a recolher; vencimento 29/05/2026; impressão por Declaração > Imprimir > Darf do IRPF ou Darf de doações ECA/Pessoa Idosa, ícone impressora ou barra lateral; visualizar e salvar em PDF
- Exige do MCP: dados do Darf 0211 da DSDP com período de apuração diferente do ajuste
- Cobertura no MCP Imposto de Renda: `gerar_darf`; módulo calc; prioridade P1; status implementada (`gerar_darf`) (ver matriz)

#### F-SAIDA-MULTA Multa por atraso na entrega da Saída Definitiva

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda págs. 343 e 353
- Regras de cálculo afetadas: após 29/05/2026, com imposto devido (ainda que pago) 1% ao mês ou fração sobre o imposto devido, mínimo R$ 165,74 e máximo 20%; sem imposto devido R$ 165,74; lançamento de ofício; termo inicial no dia seguinte ao prazo e final no mês da entrega ou do lançamento; não paga no vencimento da notificação emitida pelo PGD é deduzida da restituição com acréscimos
- Exige do MCP: mesma calculadora de S-REGRA-MULTA-ATRASO
- Cobertura no MCP Imposto de Renda: `calcular_multa_atraso`; módulo calc; prioridade P1; status implementada (`calcular_multa_atraso`) (ver matriz)

### 3.19 Declaração Final de Espólio

#### F-DFE-GERAL Declaração Final de Espólio: disposições gerais

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-GERAL
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
- Cobertura no MCP Imposto de Renda: `criar_declaracao`, `definir_identificacao`; módulo model; prioridade P1; status implementada (`criar_declaracao`, `definir_identificacao`) (ver matriz)

#### F-DFE-SOBREPARTILHA Sobrepartilha, bens acrescidos antes e após a partilha

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-SOBREPARTILHA
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
- Cobertura no MCP Imposto de Renda: `definir_espolio`; módulo model; prioridade P1; status implementada (`definir_espolio`) (ver matriz)

#### F-DFE-OBITO-CONJUGES Ocorrência de morte de ambos os cônjuges

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-OBITO-CONJUGES
- Onde: pág. 330 e 331
- Regras: comunhão parcial/universal: morte conjunta: uma declaração em nome de um dos cônjuges com bens e rendimentos do casal; datas diferentes antes de encerrado o inventário do premorto: uma declaração em nome do premorto abrangendo o casal. Separação de bens: uma ou duas declarações conforme um ou dois inventários.
- Campos (ficha Espólio): "Trata-se de óbito de ambos os cônjuges ou companheiros?" (Sim/Não); se Sim: "Trata-se de um inventário conjunto?" (se Sim: CPF e nome do outro cônjuge); se Não: "O cônjuge ou companheiro(a) é meeiro(a)?".
- Exige do MCP: campos condicionais e validação de CPF do outro cônjuge.
- Cobertura no MCP Imposto de Renda: `definir_espolio`; módulo model; prioridade P1; status implementada (`definir_espolio`) (ver matriz)

#### F-DFE-MOEDA Conversão de moeda estrangeira para reais (espólio)

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-MOEDA
- Onde: pág. 331
- Regras: moeda estrangeira para US$ pela autoridade monetária do país na data do recebimento/pagamento; depois para R$ pelo dólar BCB do último dia útil da primeira quinzena do mês anterior; compra para rendimentos e imposto pago, venda para deduções (tabela de conversão do dólar 2025).
- Exige do MCP: tabela de cotações 2025 e conversor.
- Cobertura no MCP Imposto de Renda: `converter_moeda`; módulo tabelas; prioridade P2; status implementada (`converter_moeda`, `listar_tabela`) (ver matriz)

#### F-DFE-BENS Ficha Bens e Direitos (Final de Espólio)

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-BENS
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
- Cobertura no MCP Imposto de Renda: `adicionar_bem`, `definir_partilha_bem`; módulo model; prioridade P1; status implementada (`adicionar_bem`, `definir_partilha_bem`) (ver matriz)

#### F-DFE-GCAP Pagamento do Imposto sobre Ganhos de Capital (espólio)

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-GCAP
- Onde: pág. 332
- Regras: pago pelo inventariante por Darf em nome e CPF do de cujus, até a data de apresentação da DFE. Códigos: 4600 (bens ou direitos no Brasil); 8523 (bens/direitos e/ou aplicações financeiras liquidadas ou resgatadas no exterior); 8960 (moeda estrangeira em espécie).
- Exige do MCP: orientação de Darf com os códigos e prazo.
- Cobertura no MCP Imposto de Renda: `gerar_darf`, `orientar_servico_externo`; módulo calc; prioridade P2; status implementada (`gerar_darf`, `orientar_servico_externo`) (ver matriz)

#### F-DFE-BENS-AR Bens da Atividade Rural no espólio

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-BENS-AR
- Onde: pág. 332
- Regras: bens deduzidos como despesa não vão para Bens e Direitos; transmissão não segue regras de ganho de capital; preencher o Demonstrativo da AR com o valor de transmissão como receita do espólio no mês da transmissão. Beneficiário que continua a atividade: despesa rural; que não continua: custo de aquisição para futuro ganho de capital.
- Exige do MCP: alerta e lançamento assistido de receita rural na transmissão.
- Cobertura no MCP Imposto de Renda: `definir_receitas_despesas_rurais`, `listar_pendencias`; módulo model; prioridade P2; status implementada (`definir_receitas_despesas_rurais`, `validar_declaracao`) (ver matriz)

#### F-DFE-IDENT Ficha Identificação do Contribuinte (Final de Espólio)

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-IDENT
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
- Cobertura no MCP Imposto de Renda: `criar_declaracao`, `definir_identificacao`; módulo model; prioridade P1; status implementada (`criar_declaracao`, `definir_identificacao`) (ver matriz)

#### F-DFE-FICHA Ficha Espólio

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-FICHA
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
- Cobertura no MCP Imposto de Renda: `definir_espolio`; módulo model; prioridade P1; status implementada (`definir_espolio`) (ver matriz)

#### F-DFE-HERDEIROS Ficha Herdeiros/Meeiro

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-HERDEIROS
- Onde: pág. 334 e 335; botões Novo, OK, Editar, Excluir
- Campos: CPF ou CNPJ; Nome do herdeiro ou meeiro
- Validações: CPF/CNPJ válido; excluir apaga a linha.
- Regras: herdeiros são referenciados na partilha de cada bem (percentual e valor de transferência).
- Exige do MCP: CRUD de herdeiros; integridade referencial com bens (inferido).
- Cobertura no MCP Imposto de Renda: `adicionar_herdeiro`; módulo model; prioridade P1; status implementada (`adicionar_herdeiro`) (ver matriz)

#### F-DFE-DIVIDAS Ficha Dívidas e Ônus Reais (Final de Espólio)

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-DIVIDAS
- Onde: pág. 336; botões Novo, Editar, Excluir (múltiplas), Ok
- Campos: Código da dívida (tabela tipoDividas); Discriminação; Situação em 31/12/2024 (R$); Situação na data da partilha (R$)
- Regras: dívidas do espólio e dos dependentes em 31/12 do ano anterior e na data da partilha/sobrepartilha/adjudicação/lavratura.
- Exige do MCP: CRUD com campos de espólio.
- Cobertura no MCP Imposto de Renda: `adicionar_divida`; módulo model; prioridade P1; status implementada (`adicionar_divida`) (ver matriz)

#### F-DFE-CALCULO Resumo da Declaração - Cálculo do imposto devido (Final de Espólio)

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-CALCULO
- Onde: pág. 336
- Regras de cálculo: tabela progressiva mensal do ano-calendário multiplicada pelo número de meses de janeiro até o mês da decisão judicial/lavratura, ainda que os rendimentos sejam de apenas alguns meses.
- Exige do MCP: motor de cálculo com tabela proporcional ao número de meses (parâmetro mês da decisão).
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-DFE-PRAZO Observações finais: prazo, multa, pagamento, restituição

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-PRAZO
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
- Cobertura no MCP Imposto de Renda: `listar_pendencias`, `calcular_multa_atraso`; módulo validate; prioridade P1; status implementada (`calcular_multa_atraso`, `validar_declaracao`) (ver matriz)

#### F-DFE-DARF Preenchimento do Darf (Final de Espólio)

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-DARF
- Onde: pág. 338 a 340; menu Declaração > Imprimir > Darf do IRPF ou Darf - Doações Diretamente na Declaração - ECA/Pessoa Idosa; ícone impressora na barra de ferramentas; Imprimir na barra lateral; opção Visualizar e salvar em PDF
- Campos do Darf: CPF (do de cujus, pelo programa); Nome (do de cujus na data do falecimento); Período de apuração (data da decisão judicial da partilha); Data de vencimento (preenchida pelo inventariante); Número do documento (gerado pelo programa); Código da receita 0211; Principal (imposto); Multa (0,33% ao dia a partir do primeiro dia útil após o vencimento, limite 20%); Juros (Selic acumulada mensal a partir do mês seguinte ao vencimento até o mês anterior ao pagamento + 1% no mês do pagamento); Total (no prazo: principal; após: principal + multa + juros)
- Exige do MCP: geração de dados de Darf 0211 (PDF ou instrução), calculadora de acréscimos; Darf ECA/Idoso para doações na declaração.
- Observações: o número do documento é gerado pelo PGD (código de barras); fora do PGD o MCP pode instruir uso do Sicalc ou gerar Darf pelo PGD (inferido).
- Cobertura no MCP Imposto de Renda: `gerar_darf`; módulo calc; prioridade P1; status implementada (`gerar_darf`) (ver matriz)

#### F-DFE-PAGTO Pagamento do Imposto (Final de Espólio)

- Origem: notas/06-ar-gcap-rv-espolio.md, ID na nota: E-ESP-PAGTO
- Onde: pág. 340
- Regras: pagamento na data prevista para apresentação; o decurso do prazo implica vencimento das obrigações do espólio. Formas: transferência eletrônica ou agência/caixa com Darf.
- Exige do MCP: alerta de vencimento único (sem quotas, sem débito automático em quotas, inferido).
- Cobertura no MCP Imposto de Renda: `simular_quotas`; módulo calc; prioridade P1; status implementada (`calcular_quotas`) (ver matriz)

### 3.20 Resumo da Declaração

#### F-RESUMO-TRIB Resumo, Rendimentos Tributáveis (modelo completo)

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-RESUMO-DED Resumo, Deduções (modelo completo)

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-RESUMO-CALC Resumo, Cálculo do Imposto (deduções legais)

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-RESUMO-QUOTAS Resumo, Imposto a pagar: formas de pagamento, quotas e débito automático

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `definir_informacoes_bancarias`, `simular_quotas`; módulo calc; prioridade P0; status implementada (`calcular_quotas`, `definir_informacoes_bancarias`) (ver matriz)

#### F-RESUMO-BANCO Resumo, Informações Bancárias (restituição e débito)

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Resumo > Informações Bancárias (págs. 252 e 260)
- Aplica-se a: todos
- Campos: Banco (3 algarismos, lista de bancos autorizados); Agência (sem DV); Conta e DV; opção Pix (chave = CPF do titular)
- Validações conhecidas: conta corrente individual ou conjunta de titularidade do declarante; para restituição também poupança; banco precisa estar na rede autorizada; Pix só com chave CPF do titular. Saída Definitiva sem conta no Brasil: procurador com procuração pública indica conta no Banco do Brasil; restituições não resgatadas em um ano ficam nas unidades da RFB e são pagas via Siafi
- Códigos: tabela de bancos (bancos.xml), cálculo de DV (bancos_calculo_dv.xml)
- Exige do MCP: validação de banco autorizado e de DV de conta por banco; opção Pix
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `definir_informacoes_bancarias`, `validar_documento`; módulo validate; prioridade P0; status implementada (`definir_informacoes_bancarias`, `validar_documento`) (ver matriz)

#### F-RESUMO-SIMPL Resumo, Cálculo do Imposto (Desconto Simplificado)

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-RESUMO-EVOL Resumo, Outras Informações: Evolução patrimonial

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Resumo > Outras Informações (pág. 261)
- Aplica-se a: todos, com linhas condicionais
- Campos (calculados): Bens e direitos em 31/12/2024; Bens e direitos na data da partilha (Final de Espólio); Bens e direitos em 31/12/2025; Bens e direitos na data da caracterização de não residente (Saída); Bens e direitos, valor da transferência (Final de Espólio); Dívidas em 31/12/2024; Dívidas em 31/12/2025; Dívidas na data da caracterização de não residente (Saída); Dívidas na data da partilha (Final de Espólio)
- Regras de cálculo afetadas: somatórios das fichas Bens e Dívidas
- Exige do MCP: totais por tipo de declaração; consistência de evolução patrimonial (variação patrimonial x rendimentos declarados, inferido)
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-RESUMO-OUTRAS Resumo, Outras Informações: demais linhas

- Origem: notas/05-bens-especiais-dividas-resumo.md
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
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### F-RESUMO-OPCAO Opção pela Tributação (Ajuste Anual)

- Origem: notas/05-bens-especiais-dividas-resumo.md
- Onde: Resumo > Opção pela Tributação (pág. 264)
- Aplica-se a: Ajuste Anual
- Campos: comparativo dos dois modelos; opção (Deduções legais, marcada por padrão; Desconto simplificado)
- Validações conhecidas: troca de opção é automática e preserva as deduções informadas, salvo se excluídas. Excluir dependente na ficha Dependentes exclui automaticamente seus dados em Rend. PJ Dependentes, PF/Exterior Dependentes, Pagamentos, Doações Efetuadas, Ganhos de Capital e Renda Variável (Imposto a Pagar); o usuário precisa excluir à mão os Isentos, Exclusivos, Bens e Dívidas desses dependentes
- Regras de cálculo afetadas: escolhe o modelo do cálculo final
- Exige do MCP: ferramenta de comparação e recomendação do modelo mais vantajoso; ferramenta de troca de opção; exclusão em cascata de dependente com aviso das fichas que exigem ação manual
- Observações: nenhuma
- Cobertura no MCP Imposto de Renda: `definir_opcao_tributacao`, `calcular_imposto`; módulo calc; prioridade P0; status implementada (`comparar_modelos`, `definir_opcao_tributacao`, `explicar_calculo`, `simular_imposto`) (ver matriz)

## 4 Demonstrativos

### 4.1 Atividade Rural

#### D-AR-GERAL Demonstrativo da Atividade Rural (visão geral e regras de período)

- Origem: notas/06-ar-gcap-rv-espolio.md
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
- Cobertura no MCP Imposto de Renda: `listar_fichas`, `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `listar_fichas`, `simular_imposto`) (ver matriz)

#### D-AR-OBRIG Obrigatoriedade de Preenchimento do Demonstrativo

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Ajuda pág. 266
- Aplica-se a: todos
- Validações conhecidas (deve preencher se qualquer condição):
  - apurou resultado positivo da atividade rural em 2025, em qualquer montante, e está obrigado à DAA 2026;
  - participação nas receitas brutas das unidades rurais (individual, parceria ou condomínio) em 2025 superior a R$ 177.920,00, caso tenha exclusivamente receitas de atividade rural;
  - pretende compensar prejuízo de anos anteriores ou do próprio ano-calendário 2025.
- Regras de cálculo afetadas: Brasil com várias propriedades: ficha Brasil consolidada; exterior: uma ficha por país, na moeda do país, convertida para US$ e consolidada (soma algébrica) e depois para R$. Resultado positivo no exterior não compensa negativo do Brasil e vice-versa.
- Exige do MCP: regra de obrigatoriedade (limite R$ 177.920,00) no verificador de obrigatoriedade; validação de não compensação Brasil/exterior.
- Cobertura no MCP Imposto de Renda: `verificar_obrigatoriedade`; módulo validate; prioridade P1; status implementada (`verificar_obrigatoriedade`) (ver matriz)

#### D-AR-OQUE O Que deve ser Declarado (atividade rural)

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Ajuda pág. 267
- Aplica-se a: todos
- Regras: são atividade rural: criação/recriação/engorda de animais de médio e grande porte; cultura do solo; apicultura, avicultura, cunicultura, piscicultura, sericicultura, suinocultura e pequenos animais, inclusive captura e venda in natura de pescado; extração e exploração animal e vegetal; transformação de produtos sem alterar composição e características in natura, feita pelo próprio produtor/familiares/empregados, dentro do imóvel, com equipamentos usuais e matéria-prima própria.
- Não é receita rural: aluguel ou arrendamento de imóvel rural, pastos, máquinas; prestação de serviços de preparo da terra e transporte de produtos de terceiros (vão para rendimentos tributáveis comuns). Transformação fora das condições: ganho de capital (sem habitualidade) ou equiparação a PJ (com habitualidade).
- Não é atividade rural: compra e venda de rebanho bovino com permanência inferior a 52 dias (confinamento) ou 138 dias (demais casos).
- Exige do MCP: orientação/classificação de receita (rural x outra) em ferramenta de ajuda; alerta quando usuário classificar aluguel de pasto como receita rural (inferido).
- Cobertura no MCP Imposto de Renda: `obter_ajuda`; módulo tabelas; prioridade P2; status implementada (`obter_ajuda`) (ver matriz)

#### D-AR-IMOVEL Dados do Imóvel Explorado (abas Brasil e Exterior)

- Origem: notas/06-ar-gcap-rv-espolio.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_imovel_rural`; módulo model; prioridade P1; status implementada (`adicionar_imovel_rural`) (ver matriz)

#### D-AR-RD-BRASIL Receitas e Despesas - Brasil

- Origem: notas/06-ar-gcap-rv-espolio.md
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
- Cobertura no MCP Imposto de Renda: `definir_receitas_despesas_rurais`; módulo model; prioridade P1; status implementada (`definir_receitas_despesas_rurais`) (ver matriz)

#### D-AR-RD-EXTERIOR Receitas e Despesas - Exterior

- Origem: notas/06-ar-gcap-rv-espolio.md
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
- Cobertura no MCP Imposto de Renda: `definir_receitas_despesas_rurais`; módulo model; prioridade P1; status implementada (`definir_receitas_despesas_rurais`) (ver matriz)

#### D-AR-APUR Apuração do Resultado (considerações gerais)

- Origem: notas/06-ar-gcap-rv-espolio.md
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
- Cobertura no MCP Imposto de Renda: `definir_apuracao_rural`, `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L01 Saldo de prejuízo(s) a compensar de exercício(s) anterior(es)

- Origem: notas/06-ar-gcap-rv-espolio.md
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
- Cobertura no MCP Imposto de Renda: `definir_apuracao_rural`, `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L02 Receita bruta total

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 280
- Regras de cálculo: transportado pelo programa: soma da receita bruta mensal (Brasil) e das receitas do exterior.
- Exige do MCP: cálculo automático.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L03 Despesa de custeio e investimento total

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 281
- Regras de cálculo: transportado: soma das despesas mensais (Brasil) e do exterior.
- Exige do MCP: cálculo automático.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L04 Resultado (Brasil) / Resultado total US$ e Resultado total R$ (Exterior)

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 282
- Regras de cálculo:
  - Brasil: Resultado = Receita bruta total menos Despesa total.
  - Exterior: Resultado total US$ = soma do Resultado US$ de todos os países; Resultado total R$ = Resultado total US$ x 5,5018.
  - Final de Espólio: Resultado total R$ informado pelo usuário, com dólar de compra BCB da data da decisão judicial/lavratura.
  - Saída Definitiva: Resultado total R$ informado, com dólar de compra BCB do dia anterior à condição de não residente.
- Exige do MCP: cálculo; para Espólio final e Saída, campo de cotação informada.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L05 Limite de 20% sobre a receita bruta total

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 283
- Regras de cálculo: Brasil: 20% da Receita bruta total (calculado). Exterior: 20% da receita bruta em moeda original por país, convertido para US$ (cotação do último dia do ano pela autoridade monetária do país), somado entre países, multiplicado por 5,5018.
- Validações: no exterior, quando importado do IRPF2025/LCAR, o limite de 20% em R$ deve ser preenchido manualmente (pág. 296).
- Exige do MCP: cálculo Brasil; campo informado ou cálculo auxiliado no exterior.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L06 Opção pela forma de apuração do resultado tributável

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 284
- Campos: seleção entre "Limite de 20% sobre a receita bruta" e "Resultado"
- Regras de cálculo: define o Resultado tributável. Opção por 20% impede compensação de prejuízo e o aproveitamento futuro do saldo (ver L01).
- Exige do MCP: ferramenta de simulação comparando as duas opções e recomendando (inferido).
- Cobertura no MCP Imposto de Renda: `definir_apuracao_rural`, `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L07 Compensação de prejuízo(s) de exercício(s) anterior(es)

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 285
- Campos: valor que pretende compensar
- Validações: só se resultado tributável positivo e opção pelo Resultado; limitado ao saldo e ao resultado.
- Exige do MCP: validação de limite.
- Cobertura no MCP Imposto de Renda: `definir_apuracao_rural`, `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L08 Resultado tributável

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 286
- Regras de cálculo: preenchido conforme opção. Se positivo, transportado para "Resultado tributável da Atividade Rural" da ficha Rendimentos Tributáveis e Deduções do Resumo. Brasil e exterior não se compensam.
- Exige do MCP: transporte automático ao Resumo.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L09 Saldo de prejuízo(s) a compensar

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 287
- Regras de cálculo: Resultado positivo e opção pelo resultado: saldo anterior menos compensação. Resultado negativo: soma do negativo ao saldo anterior. Valor vai para "Informação para o exercício seguinte".
- Exige do MCP: cálculo; exportar saldo para o próximo exercício.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L10 Apuração do resultado não tributável

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 288
- Regras de cálculo:
  - Brasil: Resultado + adiantamentos recebidos em 2025 para entrega futura - adiantamentos recebidos até 2024 informados como receita de produtos entregues em 2025 - resultado tributável (se negativo, considerado zero).
  - Exterior: Resultado total R$ + adiantamentos 2025 - receitas de produtos entregues em 2025 referentes a adiantamentos até 2024 - resultado tributável (negativo = zero).
  - Se positivo, vai para a linha Resultado não tributável e é transportado para Isentos código 15 (Parcela não tributável correspondente à atividade rural).
- Exige do MCP: cálculo e transporte automático para ficha de isentos.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L11 Adiantamento(s) recebido(s) em 2025 por conta de venda para entrega futura

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 289
- Campos: valor R$
- Validações: só adiantamentos de contratos cujos produtos não foram entregues até 31/12/2025; se entregue em 2025, vira receita do mês da entrega. Exterior: converter moeda local para US$ (último dia do ano, autoridade do país) e para R$ (dólar de compra BCB do último dia de 2025). Devolução antes da entrega reduz o adiantamento.
- Importações: importado do LCAR 2025.
- Exige do MCP: campo e orientação de conversão.
- Cobertura no MCP Imposto de Renda: `definir_apuracao_rural`, `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-APUR-L12 Adiantamento(s) recebido(s) até 2024 a ser(em) informado(s) como receita(s) de produto(s) entregue(s) em 2025

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Apuração do Resultado; pág. 290
- Campos: valor R$
- Validações: valores declarados como adiantamento nos exercícios anteriores e entregues em 2025; também devem constar como receita no mês da entrega. Exterior: mesma conversão.
- Importações: importado do LCAR 2025.
- Exige do MCP: campo; validação cruzada com receita mensal (inferido).
- Cobertura no MCP Imposto de Renda: `definir_apuracao_rural`, `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-AR-REBANHO Movimentação do Rebanho (abas Brasil e Exterior)

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Demonstrativo da Atividade Rural > Movimentação do Rebanho; pág. 291
- Aplica-se a: todos
- Campos (por espécie, quantidade de cabeças): Espécie; Estoque inicial; Aquisições (inclui meação, doação, herança recebidas); Nascimentos; Consumo e perdas; Vendas (inclui entregas por meação, doação, herança); Estoque final (calculado)
- Validações: incluir animais próprios mesmo em poder de terceiros por contrato; excluir animais de terceiros em seu poder.
- Regras de cálculo: Estoque final = Estoque inicial + Aquisições + Nascimentos - Consumo e perdas - Vendas.
- Importações: estoque final do IRPF2025 vira estoque inicial; aquisições, nascimentos, consumo e perdas e vendas devem ser preenchidos no IRPF2026.
- Exige do MCP: CRUD por espécie com cálculo do estoque final; validação de estoque final não negativo (inferido).
- Cobertura no MCP Imposto de Renda: `definir_rebanho`; módulo model; prioridade P1; status implementada (`definir_rebanho`) (ver matriz)

#### D-AR-BENS Bens da Atividade Rural

- Origem: notas/06-ar-gcap-rv-espolio.md
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
- Cobertura no MCP Imposto de Renda: `adicionar_bem_rural`, `repetir_valores_bens`; módulo model; prioridade P1; status implementada (`adicionar_bem_rural`, `repetir_valores_bens`) (ver matriz)

#### D-AR-DIVIDAS Dívidas Vinculadas à Atividade Rural (abas Brasil e Exterior)

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Demonstrativo da Atividade Rural > Dívidas Vinculadas à Atividade Rural; botões Novo, OK, Editar, Excluir; pág. 294
- Aplica-se a: quem possuía dívidas rurais em 31/12/2024 ou 31/12/2025
- Campos: Discriminação (data de contratação, número do contrato, nome do credor, CPF/CNPJ do credor se do Brasil); Situação em 31/12/2024 (R$); Situação em 31/12/2025 (R$); Valor Pago em 2025 (R$)
- Validações: empréstimo contraído e quitado no mesmo ano: item específico com valor, datas de contratação e quitação, contrato, credor; zero nas duas situações. Exterior: conversão para US$ e x 5,5018.
- Importações: discriminação e situação em 31/12/2024 do IRPF2025; situação 31/12/2025 e dívidas de 2025 manuais.
- Exige do MCP: CRUD; validação de CPF/CNPJ do credor; conversão cambial.
- Cobertura no MCP Imposto de Renda: `adicionar_divida_rural`; módulo model; prioridade P1; status implementada (`adicionar_divida_rural`) (ver matriz)

#### D-AR-IMPORT Importação AR2025 (Livro Caixa da Atividade Rural 2025 e IRPF2025)

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: botão "Importar" da ficha Receitas e Despesas; opção "Importação AR2025"; pág. 295 e 296
- Aplica-se a: todos
- Fluxo: preencher o LCAR 2025 (não usar o LCAR 2026); gravar via "Exportar para o IRPF2026" do menu Ferramentas do LCAR 2025; importar no IRPF2026 pelo botão Importar da ficha Receitas e Despesas.
- Itens importados do IRPF2025 (ao cadastrar contribuinte com importação): Dados do Imóvel Explorado (todos); Rebanho (estoque final vira inicial); Bens AR (código e discriminação); Dívidas AR (discriminação e situação 31/12/2024).
- Itens importados do LCAR 2025: Receitas e Despesas (dados mensais Brasil; somatório anual por país no exterior); Apuração (adiantamentos 2025 e adiantamentos até 2024 entregues em 2025).
- Itens a preencher manualmente: imóveis adquiridos em 2025; saldo de prejuízo de exercícios anteriores; limite de 20% em R$ no exterior; rebanho (aquisições, nascimentos, consumo e perdas, vendas); bens adquiridos e alienações de 2025; dívidas (situação 31/12/2025 e dívidas de 2025).
- Exige do MCP: importador do arquivo exportado pelo LCAR 2025 (formato a mapear, ver layout); importador da declaração anterior; relatório do que falta preencher após importação.
- Observações: LCAR é programa separado da RFB (download no gov.br).
- Cobertura no MCP Imposto de Renda: `importar_livro_caixa_rural`, `importar_declaracao_anterior`; módulo importacao; prioridade P1; status parcial (`definir_receitas_despesas_rurais`, `importar_declaracao_anterior`, `listar_declaracoes`, `orientar_servico_externo`) (ver matriz)

### 4.2 Ganhos de Capital

#### D-GCAP-GERAL Demonstrativo de Ganhos de Capital (GCAP 2025)

- Origem: notas/06-ar-gcap-rv-espolio.md
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
- Cobertura no MCP Imposto de Renda: `importar_gcap`, `listar_ganhos_capital`, `remover_lancamento`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `listar_ganhos_capital`, `orientar_servico_externo`, `remover_lancamento`) (ver matriz)

#### D-GCAP-IMOVEIS Ganhos de Capital - Bens Imóveis

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Demonstrativo Ganhos de Capital > Bens Imóveis; botão Importar; pág. 297
- Campos/regras: não detalhados na Ajuda (preenchimento no GCAP). (inferido: alienação, custo, reduções, isenções de imóvel único até R$ 440 mil, 180 dias)
- Exige do MCP: importação e exibição; cálculo próprio opcional.
- Cobertura no MCP Imposto de Renda: `importar_gcap`, `listar_ganhos_capital`, `calcular_ganho_capital`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `calcular_ganho_capital`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### D-GCAP-MOVEIS Ganhos de Capital - Direitos/Bens Móveis

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Demonstrativo Ganhos de Capital > Direitos/Bens Móveis; botão Importar; pág. 297
- Exige do MCP: importação e exibição; inclui alienação de FII/Fiagro fora de bolsa (pág. 299).
- Cobertura no MCP Imposto de Renda: `importar_gcap`, `listar_ganhos_capital`, `calcular_ganho_capital`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `calcular_ganho_capital`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### D-GCAP-PARTICIP Ganhos de Capital - Participações Societárias

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Demonstrativo Ganhos de Capital > Participações Societárias; botão Importar; pág. 297
- Exige do MCP: importação e exibição.
- Cobertura no MCP Imposto de Renda: `importar_gcap`, `listar_ganhos_capital`, `calcular_ganho_capital`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `calcular_ganho_capital`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

#### D-GCAP-MOEDA Ganhos de Capital - Moedas em Espécie

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: Demonstrativo Ganhos de Capital > Moedas em Espécie; botão Importar; pág. 297
- Exige do MCP: importação e exibição; Darf 8960.
- Cobertura no MCP Imposto de Renda: `importar_gcap`, `listar_ganhos_capital`, `calcular_ganho_capital`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `calcular_ganho_capital`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

### 4.3 Renda Variável, operações comuns e day-trade

#### D-RV-GERAL Renda Variável - Operações Comuns e Day-Trade (considerações gerais)

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: "Fichas da Declaração" > Renda Variável > Operações Comuns/Day-Trade; abas Titular e Dependentes; seleção do mês; botões Ok, Editar, Excluir; pág. 298 a 300
- Aplica-se a: todos (Espólio: até a data da partilha, ou ano todo se ainda há bens a inventariar; Saída: até o dia anterior à não residência)
- Obrigatoriedade (residente no Brasil, em 2025): alienação de ações no mercado à vista em bolsa; alienação de ouro ativo financeiro (disponível/à vista em bolsa ou junto a instituições financeiras); operações a termo, opções e futuro em bolsa com qualquer ativo; operações a termo, opções e futuro fora de bolsa, inclusive opções flexíveis; alienação de quotas de FII/Fiagro em bolsa.
- Dispensa: box, termo conjugado (compra vinculada à revenda) e operações de financiamento com rendimento predeterminado (tributados na fonte como renda fixa); mútuo e compra vinculada à revenda com ouro; operações isentas (ações à vista em bolsa e ouro com alienações no mês até R$ 20.000,00, por conjunto de ações e ouro separadamente), exceto se quiser compensar perdas; FII/Fiagro fora de bolsa (vai para GCAP2025).
- Validações:
  - Resultado positivo em operações isentas vai para Isentos e Não Tributáveis (código 20 para ações até R$ 20 mil, inferido; FII/Fiagro isentos vão para linha 99, pág. 312).
  - Dependentes: só os já cadastrados na ficha Dependentes aparecem na aba Dependentes.
  - Perdas em day-trade só compensam ganhos em day-trade.
- Exige do MCP: CRUD mensal por titular/dependente; regras de isenção de R$ 20 mil; cálculo mensal com carry de prejuízo e IRRF.
- Cobertura no MCP Imposto de Renda: `definir_renda_variavel`; módulo model; prioridade P1; status implementada (`definir_renda_variavel`) (ver matriz)

#### D-RV-PROC Procedimentos para Apuração dos Ganhos Líquidos ou Perdas

- Origem: notas/06-ar-gcap-rv-espolio.md
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
- Cobertura no MCP Imposto de Renda: `calcular_preco_medio`; módulo calc; prioridade P2; status implementada (`apurar_renda_variavel`, `calcular_preco_medio`) (ver matriz)

#### D-RV-TIPOS Tipos de Mercado ou Ativo / Ganhos Líquidos ou Perdas (linhas de entrada)

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: grade mensal, colunas "Operações Comuns" e "Operações Day-Trade"; pág. 305
- Campos: linhas por tipo de mercado/ativo (nomes dos principais ativos precedidos do tipo de mercado; linha "outros" para ativo não discriminado; "Mercado de Opções fora de bolsa" para mercados de liquidação futura fora de bolsa). Lista exata não consta na Ajuda (inferido do PGD: Mercado à vista ações, ouro, ouro fora de bolsa; Mercado de opções ações, ouro, fora de bolsa, outros; Mercado futuro dólar, índices, juros, outros; Mercado a termo ações/ouro, outros).
- Validações: valores em R$ por mês; perdas com sinal negativo; consolidar por linha o total do mês; day-trade separado.
- Exige do MCP: modelo de dados com a lista de linhas (extrair do layout .DEC); entrada de ganho/perda por mês e linha.
- Cobertura no MCP Imposto de Renda: `definir_renda_variavel`; módulo model; prioridade P1; status implementada (`definir_renda_variavel`) (ver matriz)

#### D-RV-L01 RESULTADO LÍQUIDO DO MÊS

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 306
- Regras de cálculo: soma algébrica das linhas do mês, por coluna (comuns e day-trade); negativo com sinal.
- Exige do MCP: cálculo.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-RV-L02 Resultado negativo até o mês anterior

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 306
- Campos: em janeiro, informado pelo usuário (o programa não transporta prejuízo do ano anterior); demais meses, transportado do Prejuízo a compensar do mês anterior.
- Exige do MCP: campo de saldo inicial de prejuízo (comum e day-trade separados) e carry mensal; importação do saldo de dezembro da declaração anterior (inferido).
- Cobertura no MCP Imposto de Renda: `definir_renda_variavel`; módulo model; prioridade P1; status implementada (`definir_renda_variavel`) (ver matriz)

#### D-RV-L03 BASE DE CÁLCULO DO IMPOSTO

- Origem: notas/06-ar-gcap-rv-espolio.md
- Regras: Resultado líquido do mês menos Resultado negativo até o mês anterior, se positivo.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-RV-L04 Prejuízo a compensar

- Origem: notas/06-ar-gcap-rv-espolio.md
- Regras: se negativo anterior maior que o resultado do mês ou resultado do mês negativo, soma algébrica; compensável nos meses seguintes.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-RV-L05 Alíquota do imposto / IMPOSTO DEVIDO

- Origem: notas/06-ar-gcap-rv-espolio.md
- Regras: base x 15% (operações comuns) ou 20% (day-trade).
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-RV-L06 Total do imposto devido

- Origem: notas/06-ar-gcap-rv-espolio.md
- Regras: soma do imposto devido das colunas comuns e day-trade.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-RV-L07 IR fonte de Day-Trade no mês

- Origem: notas/06-ar-gcap-rv-espolio.md
- Campos: IRRF sobre day-trade do mês, informado.
- Cobertura no MCP Imposto de Renda: `definir_renda_variavel`; módulo model; prioridade P1; status implementada (`definir_renda_variavel`) (ver matriz)

#### D-RV-L08 IR fonte de Day-Trade nos meses anteriores

- Origem: notas/06-ar-gcap-rv-espolio.md
- Regras: transportado do "IR fonte de Day-Trade a compensar" do mês anterior.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-RV-L09 IR fonte de Day-Trade a compensar

- Origem: notas/06-ar-gcap-rv-espolio.md
- Regras: Total do imposto devido menos IR fonte DT do mês e de meses anteriores; se negativo, indica o saldo. Compensável até dezembro; saldo final pode ser pedido em restituição (IN RFB 1.300/2012).
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-RV-L10 IR fonte (Lei nº 11.033/2004) no mês / nos meses anteriores / a compensar

- Origem: notas/06-ar-gcap-rv-espolio.md
- Campos: IRRF de que tratam os §§ 1º e 2º, II, do art. 2º da Lei 11.033/2004 (o "dedo-duro").
- Validações: valor do mês deve ser igual ou inferior à diferença entre Total do imposto devido e IR fonte DT do mês ou de meses anteriores, no mesmo ano.
- Regras: saldo compensável com imposto de meses seguintes até dezembro, com imposto de ganho de capital na alienação de ações e na Declaração de Ajuste Anual (vai para Imposto Pago/Retido, inferido).
- Exige do MCP: validação de limite; transporte do saldo ao Resumo.
- Cobertura no MCP Imposto de Renda: `definir_renda_variavel`; módulo model; prioridade P1; status implementada (`definir_renda_variavel`) (ver matriz)

#### D-RV-L11 Imposto a pagar

- Origem: notas/06-ar-gcap-rv-espolio.md
- Regras: Total do imposto devido menos (IR fonte DT do mês + meses anteriores + a compensar + IR fonte Lei 11.033), se positivo. Pagamento até o último dia útil do mês seguinte; Darf código 6015.
- Exige do MCP: cálculo e geração de orientação de Darf 6015 com multa e juros.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`, `gerar_darf`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `gerar_darf`, `simular_imposto`) (ver matriz)

#### D-RV-L12 Imposto Pago

- Origem: notas/06-ar-gcap-rv-espolio.md
- Campos: valor do principal do Darf pago (informado).
- Regras: vencimento no último dia útil do mês subsequente; código 6015; multa de mora 0,33% ao dia a partir do primeiro dia útil após o vencimento, limitada a 20%; juros Selic acumulada mensal a partir do mês seguinte ao vencimento até o mês anterior ao pagamento, mais 1% no mês do pagamento.
- Exige do MCP: campo; calculadora de acréscimos moratórios; comparação imposto a pagar x pago (alerta de diferença, inferido).
- Cobertura no MCP Imposto de Renda: `definir_renda_variavel`; módulo model; prioridade P1; status implementada (`definir_renda_variavel`) (ver matriz)

### 4.4 Operações em FII ou Fiagro

#### D-FII-GERAL Operações em FII ou Fiagro (conceito e considerações gerais)

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: "Fichas da Declaração" > Renda Variável > Operações em Fundos de Investimento Imobiliário/Fiagro; abas Titular e Dependentes; mês; botões Ok, Editar, Excluir; pág. 310 a 313
- Aplica-se a: todos (mesmas regras de período para Espólio e Saída)
- Regras:
  - FII/Fiagro: sem personalidade jurídica, condomínio fechado, proibido resgate, quotas são valores mobiliários (Lei 6.385/1976).
  - Obrigatoriedade e dispensa iguais às de renda variável; FII/Fiagro fora de bolsa vai para o GCAP2025.
  - Resultado positivo em operações isentas: Isentos e Não Tributáveis, Outros, linha 99.
- Exige do MCP: grade mensal titular/dependente.
- Cobertura no MCP Imposto de Renda: `definir_fii_fiagro`; módulo model; prioridade P1; status implementada (`definir_fii_fiagro`) (ver matriz)

#### D-FII-DISTRIB Distribuição dos Lucros / Rendimentos e Ganhos Auferidos e Distribuídos

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 314 e 315
- Regras: fundos distribuem no mínimo 95% dos lucros (regime de caixa, balanço semestral 30/06 e 31/12). Rendimentos e ganhos do fundo seguem regras de aplicações de PJ; distribuição sujeita a IRRF de 20%.
- Exige do MCP: orientação; rendimentos distribuídos tributados vão para Exclusivos (inferido).
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_rendimento_isento`, `adicionar_rendimento_exclusivo`; módulo tabelas; prioridade P2; status implementada (`adicionar_rendimento_exclusivo`, `adicionar_rendimento_isento`, `obter_ajuda`) (ver matriz)

#### D-FII-ALIEN Alienação ou Resgate de Quotas

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 316
- Regras: alíquota 20%: na fonte no resgate (só no término do prazo ou liquidação; rendimento = resgate menos custo); demais casos pelas normas de renda variável/ganho de capital.
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_rendimento_isento`, `adicionar_rendimento_exclusivo`; módulo tabelas; prioridade P2; status implementada (`adicionar_rendimento_exclusivo`, `adicionar_rendimento_isento`, `obter_ajuda`) (ver matriz)

#### D-FII-ISENCAO Isenção dos rendimentos distribuídos

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 317
- Regras: rendimentos distribuídos isentos na fonte e na DAA se quotas negociadas exclusivamente em bolsa ou balcão organizado, fundo com no mínimo 50 cotistas, e o cotista PF não detenha 10% ou mais das quotas nem direito a mais de 10% dos rendimentos. Fundo que aplica em empreendimento com incorporador, construtor ou sócio cotista com mais de 25% (isolado ou com pessoa ligada: parentes até 2º grau, empresa sob seu controle ou de parentes) tributa como PJ.
- Exige do MCP: orientação/validação para classificar rendimentos de FII como isentos (código de isentos de FII, inferido código 26 ou 99 conforme tabela) ou exclusivos.
- Cobertura no MCP Imposto de Renda: `obter_ajuda`, `adicionar_rendimento_isento`, `adicionar_rendimento_exclusivo`; módulo tabelas; prioridade P2; status implementada (`adicionar_rendimento_exclusivo`, `adicionar_rendimento_isento`, `obter_ajuda`) (ver matriz)

#### D-FII-PROC Procedimentos para Apuração (FII/Fiagro)

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 318
- Regras: custos de corretagem somados ao custo ou deduzidos da venda; custo médio ponderado por espécie de fundo; venda parcial ajusta estoque; ganho = venda menos custo médio.
- Exige do MCP: calculadora de custo médio por fundo (opcional).
- Cobertura no MCP Imposto de Renda: `calcular_preco_medio`; módulo calc; prioridade P2; status implementada (`apurar_renda_variavel`, `calcular_preco_medio`) (ver matriz)

#### D-FII-L01 Ganhos Líquidos ou Perdas / Resultado líquido do mês

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 319 e 320
- Campos: ganho ou perda do mês (R$; perda com sinal negativo); Resultado líquido do mês informado.
- Cobertura no MCP Imposto de Renda: `definir_fii_fiagro`; módulo model; prioridade P1; status implementada (`definir_fii_fiagro`) (ver matriz)

#### D-FII-L02 Resultado negativo até o mês anterior

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 321
- Regras: janeiro informado pelo usuário (sem transporte do ano anterior); demais meses transportados do Prejuízo a compensar do mês anterior.
- Cobertura no MCP Imposto de Renda: `definir_fii_fiagro`; módulo model; prioridade P1; status implementada (`definir_fii_fiagro`) (ver matriz)

#### D-FII-L03 Base de cálculo do imposto

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 322
- Regras: Resultado líquido do mês menos Resultado negativo anterior, se positivo.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-FII-L04 Prejuízo a compensar

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 323
- Regras: idem renda variável; compensável nos meses seguintes (só com FII/Fiagro, inferido pela ficha separada).
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-FII-L05 Alíquota do imposto / Imposto devido

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 324
- Regras: base x 20%.
- Cobertura no MCP Imposto de Renda: `calcular_imposto`; módulo calc; prioridade P1; status implementada (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) (ver matriz)

#### D-FII-L06 Imposto pago

- Origem: notas/06-ar-gcap-rv-espolio.md
- Onde: pág. 325
- Campos: principal do Darf pago.
- Regras: vencimento último dia útil do mês subsequente; código 6015; multa 0,33% ao dia limitada a 20%; juros Selic + 1% no mês do pagamento.
- Exige do MCP: cálculo do imposto e acréscimos; orientação de Darf.
- Observações: a Ajuda não descreve linhas de IRRF na ficha FII (inferido: existe IR fonte Lei 11.033 também; verificar no layout).
- Cobertura no MCP Imposto de Renda: `definir_fii_fiagro`; módulo model; prioridade P1; status implementada (`definir_fii_fiagro`) (ver matriz)

### 4.5 Carnê-Leão

#### D-CL-GERAL Escrituração do Carnê-Leão importada (titular e dependentes)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: módulo `irpf-gui-carne-leao.jar`, telas PainelDadosEscrituracaoTitular, PainelDadosEscrituracaoMensalTitular, PainelAbaLancamentosEscrituracaoTitular, PainelAbaEscrituracaoDetalheTitular, PainelDadosEscrituracaoDependente, PainelDadosEscrituracaoMensalDependentes, PainelAbaSelecaoEscrituracaoDependentes, PainelAbaLancamentosEscrituracaoDependentes(Detalhe), PainelAbaRendPFTitular, PainelAbaRendPFDependentesLista(Detalhe), PainelAbaSelecaoDependente
- Regras: a ficha Rendimentos Tributáveis de PF e do Exterior recebe os totais mensais do Carnê-Leão Web (rendimentos, deduções, livro Caixa, imposto pago 0190); lançamentos de escrituração mensal e por pagador (CPF do titular do pagamento e do beneficiário, registro 49 do layout); seleção de dependente para importar (inferido pelos nomes)
- Exige do MCP: modelo mensal (F-RTPF) e importador (M-IMP-CARNE-LEAO); `calcular_carne_leao` opcional (P2) com tabela mensal
- Cobertura no MCP Imposto de Renda: `importar_carne_leao`, `definir_rendimentos_pf_exterior`; módulo importacao; prioridade P1; status parcial (`calcular_carne_leao`, `definir_rendimentos_pf_exterior`, `orientar_servico_externo`) (ver matriz)

#### D-CL-PROGRAMA Programa Carnê-Leão (e-CAC)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: FAQ pág. 405
- Regras: apura imposto mensal, calcula limites, imprime Darf, escritura livro Caixa, grava dados para a DAA; acesso pelo e-CAC, Meu Imposto de Renda, Declarações, Acessar Carnê-Leão
- Exige do MCP: orientação (fora do PGD)
- Cobertura no MCP Imposto de Renda: `orientar_servico_externo`, `calcular_carne_leao`; módulo calc; prioridade P2; status implementada (`calcular_carne_leao`, `orientar_servico_externo`) (ver matriz)

## 5 Pagamento do imposto, quotas, débito automático e Darf

### S-PAG-DARF Preenchimento do Darf do IRPF

- Origem: notas/01-gerais.md, ID na nota: P-DARF
- Onde: Ajuda pág. 33 e 34; menu Declaração > Imprimir > Darf do IRPF; ícone impressora > Darf do IRPF; barra lateral Imprimir > Darf do IRPF
- Aplica-se a: todos com imposto a pagar
- Campos: Número CPF (preenchido pelo programa); Nome (programa); Período de Apuração (31/12/2025); Data de Vencimento (programa, por quota); Número do Documento (gerado pelo programa); Código da Receita 0211; Principal (valor da quota); Multa (ver S-PAG-APOS-PRAZO); Juros (a partir da 2ª quota, conforme S-PAG-QUOTAS-PRAZO); Total
- Validações conhecidas: no prazo, 1ª quota ou única: Total = Principal; demais: Principal + Juros. Após o prazo: Principal + Multa + Juros. O programa emite Darf em uma via. Vencimento ocorre independentemente da entrega.
- Códigos: receita 0211 (IRPF ajuste)
- Regras de cálculo afetadas: quotas, juros, multa de mora
- Importações/exportações: impressão (PDF)
- Exige do MCP: gerar dados do Darf (e PDF ou código de barras quando possível) por quota; ao entregar, o contribuinte fica notificado a recolher
- Observações: número do documento é gerado pelo PGD (inferido: o MCP pode não reproduzir o número oficial)
- Cobertura no MCP Imposto de Renda: `gerar_darf`; módulo calc; prioridade P0; status implementada (`gerar_darf`) (ver matriz)

### S-PAG-FORMAS Formas de pagamento do imposto

- Origem: notas/01-gerais.md, ID na nota: P-FORMAS
- Onde: Ajuda pág. 18, 19, 33, 37
- Regras: transferência eletrônica em instituições autorizadas; Darf em agência da rede arrecadadora ou caixa eletrônico; débito automático (S-PAG-DEBITO); remessa de ordem de pagamento pelo Banco do Brasil Gecex Brasília-DF prefixo 1608-X (ausente no exterior a serviço do Brasil)
- Exige do MCP: orientação ao usuário
- Cobertura no MCP Imposto de Renda: `obter_ajuda`; módulo tabelas; prioridade P1; status implementada (`obter_ajuda`) (ver matriz)

### S-PAG-DEBITO Débito automático das quotas

- Origem: notas/01-gerais.md, ID na nota: P-DEBITO
- Onde: Ajuda pág. 18, 19, 33, 37
- Validações conhecidas: entrega até 10/05/2026 permite débito da quota única ou a partir da 1ª quota; entrega de 11/05/2026 a 29/05/2026 permite débito só a partir da 2ª quota, e a 1ª é paga por outra forma
- Campos: banco, agência e conta (na ficha de resumo, inferido; detalhado em outras notas)
- Exige do MCP: validar elegibilidade do débito pela data prevista de entrega; validar banco conveniado (tabela de bancos)
- Cobertura no MCP Imposto de Renda: `definir_informacoes_bancarias`, `simular_quotas`; módulo validate; prioridade P0; status implementada (`calcular_quotas`, `definir_informacoes_bancarias`) (ver matriz)

### S-PAG-PARCEL Parcelamento do imposto

- Origem: notas/01-gerais.md, ID na nota: P-PARCEL
- Onde: Ajuda pág. 34 e 35
- Regras de cálculo afetadas: saldo inferior a R$ 10,00 não é recolhido e acumula para exercícios seguintes até atingir R$ 10,00; de R$ 10,00 a menos de R$ 100,00, quota única; R$ 100,00 ou mais, até 8 quotas mensais e sucessivas, cada uma não inferior a R$ 50,00. 1ª quota ou única até 29/05/2026 sem acréscimo; 2ª até 30/06/2026 com 1% de juros; demais com Selic acumulada desde 01/06/2026 até o mês anterior ao pagamento mais 1% no mês do pagamento.
- Validações conhecidas: facultado antecipar total ou parcialmente sem retificar; facultado ampliar o número de quotas até o vencimento da última desejada (máximo 8) por retificadora ou pelo "Meu Imposto de Renda (Extrato da DIRPF)"
- Exige do MCP: calcular o número máximo de quotas (min(8, floor(saldo / 50))); valor da quota; validar regras de R$ 10 e R$ 100
- Cobertura no MCP Imposto de Renda: `simular_quotas`; módulo calc; prioridade P0; status implementada (`calcular_quotas`) (ver matriz)

### S-PAG-QUOTAS-PRAZO Valor das quotas pagas dentro do prazo

- Origem: notas/01-gerais.md, ID na nota: P-QUOTAS-PRAZO
- Onde: Ajuda pág. 35 a 38
- Regras de cálculo afetadas: 1ª ou única: valor apurado; 2ª: +1%; 3ª: + Selic de junho/2026 + 1%; 4ª: + Selic junho e julho + 1%; 5ª: + Selic junho a agosto + 1%; 6ª: + Selic junho a setembro + 1%; 7ª: + Selic junho a outubro + 1%; 8ª: + Selic junho a novembro + 1%. Selic é pós-fixada, conhecida no 1º dia útil do mês seguinte; obtida no site da RFB.
- Exige do MCP: ferramenta de cálculo de quota com tabela Selic informada ou consultada; aviso de que a Selic futura não é conhecida
- Cobertura no MCP Imposto de Renda: `simular_quotas`; módulo calc; prioridade P0; status implementada (`calcular_quotas`) (ver matriz)

### S-PAG-VENC Vencimento das quotas

- Origem: notas/01-gerais.md, ID na nota: P-VENC
- Onde: Ajuda pág. 38
- Datas: 1ª ou única 29/05/2026; 2ª 30/06/2026; 3ª 31/07/2026; 4ª 31/08/2026; 5ª 30/09/2026; 6ª 30/10/2026; 7ª 30/11/2026; 8ª 30/12/2026
- Exige do MCP: tabela de vencimentos
- Cobertura no MCP Imposto de Renda: `simular_quotas`, `consultar_tabela`; módulo tabelas; prioridade P0; status implementada (`buscar_codigo`, `calcular_quotas`, `consultar_parametros`, `listar_tabela`) (ver matriz)

### S-PAG-APOS-PRAZO Pagamento após o prazo

- Origem: notas/01-gerais.md, ID na nota: P-APOS-PRAZO
- Onde: Ajuda pág. 38
- Regras de cálculo afetadas: multa de mora de 0,33% por dia de atraso sobre o principal, a partir do 1º dia útil seguinte ao vencimento, limitada a 20%; juros de mora pela Selic acumulada de junho/2026 até o mês anterior ao pagamento + 1% no mês do pagamento; atraso da 1ª ou única paga em junho/2026: juros de 1%; total = principal + multa + juros
- Exige do MCP: calcular Darf em atraso (multa e juros) por quota
- Cobertura no MCP Imposto de Renda: `calcular_acrescimos_moratorios`, `gerar_darf`; módulo calc; prioridade P1; status implementada (`calcular_acrescimos_moratorios`, `gerar_darf`) (ver matriz)

## 6 Operações do sistema: gravação, pendências, transmissão e recibo

### S-ERROS-FREQ Erros mais Frequentes (orientação)

- Origem: notas/07-saida-tabelas-erros.md
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
- Cobertura no MCP Imposto de Renda: `listar_pendencias`, `validar_documento`; módulo validate; prioridade P0; status implementada (`validar_declaracao`, `validar_documento`) (ver matriz)

### S-REQUISITOS Requisitos e instalação do programa oficial

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda págs. 394 e 395
- Regras: roda em Linux, Windows (10 ou superior recomendado) e Mac; Java embutido; Receitanet incorporado (não precisa instalar à parte); navegador necessário; impressora recomendada para o recibo; resolução 1280x768 ou maior; instalado em "Arquivos de Programas RFB" no Windows; não roda em rede (sem controle de concorrência)
- Exige do MCP: orientação ao usuário para a etapa final no PGD (o MCP Imposto de Renda não substitui a instalação do PGD para transmitir)
- Cobertura no MCP Imposto de Renda: `instruir_transmissao`; módulo nenhum; prioridade P2; status implementada (`instruir_transmissao`) (ver matriz)

### S-PROBLEMAS-IMPRESSAO Problemas na Impressão (orientação)

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda pág. 425
- Regras: trocar modo rascunho por normal; trocar o driver do fabricante pelo do sistema ou vice-versa; atualizar o driver
- Exige do MCP: não se aplica (o MCP gera PDF ou HTML)
- Cobertura no MCP Imposto de Renda: `gravar_relatorio`, `obter_ajuda`; módulo nenhum; prioridade P2; status implementada (`gravar_relatorio`, `obter_ajuda`) (ver matriz)

### S-SALVAMENTO Salvamento automático

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: pág. 376; componente HoraSalvamentoPanel
- Regras: dados salvos à medida que são digitados; sem risco de perda ao fechar ou em falta de energia
- Exige do MCP: persistência imediata e atômica em disco a cada ferramenta de escrita
- Cobertura no MCP Imposto de Renda: todas as ferramentas que escrevem em disco; módulo model; prioridade P0; status implementada (gravação atômica com cópia de segurança em toda ferramenta de escrita) (ver matriz)

### S-UMA-ABERTA Uma declaração aberta por vez e base local

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: págs. 377 e 403
- Regras: abrir outra fecha a atual; base em pasta do programa; transmitidas em `...\IRPF2026\Transmitidas`
- Exige do MCP: sem a restrição; armazenamento local por CPF e exercício
- Cobertura no MCP Imposto de Renda: `listar_declaracoes`; módulo model; prioridade P2; status implementada (`listar_declaracoes`) (ver matriz)

### S-GRAVAR-ENTREGA Gravação da declaração para entrega (arquivo .DEC)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: págs. 382 e 419; ação GravarEntregaAction; classe GravadorTXT (gravarDeclaracao, montaNomeArquivoTXT)
- Regras: só sem erros impeditivos; nome do arquivo `CPF-IRPF-<A|E|S>-2026-2025-<ORIGI|RETIF>.DEC` (padrão do FAQ para 2025, inferido para 2026); pode ir para mídia removível via cópia "para entrega"
- Exige do MCP: `gerar_dbk` com o layout `LayoutDadosDIRPF2026.xml` e o nome padrão
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P0; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-TRANSMISSAO Transmissão (Receitanet incorporado)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: págs. 395, 420; atalhos Ctrl+Shift+B (com certificado) e Ctrl+Shift+E (sem certificado); pacotes `serpro.receitanet`, `formatosexternos.transmissao` (RecnetAdaptor), `serpro.hash`, `nuvem.util.certificadodigital`
- Regras: única forma é a Internet; com ou sem certificado digital; recibo gravado na pasta Transmitidas; prazo até 23h59min59s de 29/05/2026
- Exige do MCP: impossível e vedado reimplementar (protocolo, assinatura e hash da RFB); alternativa: `gerar_dbk` + `instruir_transmissao` (passo a passo: abrir o PGD 2026, restaurar ou importar, verificar pendências, Entregar Declaração, guardar recibo)
- Cobertura no MCP Imposto de Renda: `instruir_transmissao`; módulo dbk; prioridade P0; status implementada (`instruir_transmissao`) (ver matriz)

### S-RECIBO Recibo de entrega e número do recibo

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: págs. 383, 403, 405; layout registros HR, DR, R9, HC, RC, NC, VC, MC, TC; relatório relRecibo
- Regras: recibo de 12 dígitos usado para retificar e como segurança na declaração seguinte; ausência do recibo de 2025 não impede a entrega
- Exige do MCP: `registrar_recibo` (o usuário informa o número ou aponta o arquivo .REC para leitura); validação do formato
- Cobertura no MCP Imposto de Renda: `registrar_recibo`, `validar_documento`; módulo importacao; prioridade P1; status implementada (`criar_retificadora`, `registrar_recibo`, `validar_documento`) (ver matriz)

### S-NOTIFICACAO-MAED Notificação de lançamento da multa por atraso emitida pelo PGD

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: págs. 32, 353; layout registro NC (notificação de multa: delegado, unidade, vencimento, meses); relatórios relNotificacao*
- Exige do MCP: cálculo da multa; a notificação oficial só existe após a entrega no PGD
- Cobertura no MCP Imposto de Renda: `calcular_multa_atraso`; módulo calc; prioridade P2; status implementada (`calcular_multa_atraso`) (ver matriz)

### S-VALIDADOR Dados do validador e mensagens pós-recepção

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: layout registros VC (pendência, quantidade de retificadoras, débito, saldo de restituição, Darf) e MC (mensagem)
- Regras: informações devolvidas na recepção da declaração (inferido pelos nomes)
- Exige do MCP: não se aplica (gerado pela RFB)
- Cobertura no MCP Imposto de Renda: não se aplica; módulo nenhum; prioridade P2; status não se aplica (ver matriz)

### S-CALAMIDADE Contribuintes de municípios em calamidade (RS 2024)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: tabela `municipiosCalamidade.xml` (399 municípios do RS); acessor EmCalamidade no modelo (estrutura-pacotes)
- Regras: o programa usa a tabela para regras e prazos específicos (a Ajuda 2026 não detalha; inferido)
- Exige do MCP: marcação pelo município do endereço e alerta (P2)
- Cobertura no MCP Imposto de Renda: `listar_pendencias`, `consultar_tabela`; módulo validate; prioridade P2; status implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`, `validar_declaracao`) (ver matriz)

## 7 Serviços em nuvem

### S-NUVEM-PREPREENCHIDA Obter pré-preenchida

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: serviço `obterPrePreenchida` do barramento
- Exige do MCP: impossível (autenticado); alternativa em M-IMP-PREPREENCHIDA
- Cobertura no MCP Imposto de Renda: `orientar_servico_externo`; módulo nenhum; prioridade P2; status implementada (`orientar_servico_externo`) (ver matriz)

### S-NUVEM-CARNELEAO Importar Carnê-Leão Web (gov.br ou código de acesso)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: serviços `importarCarneLeaoComLoginGovBr`, `importarCarneLeaoComCodigoAcesso`; classes CarneLeao, Dados, Registro01 a Registro04, RegistroIR
- Exige do MCP: impossível baixar; leitor do arquivo do Carnê-Leão Web se o usuário o obtiver (formato de registros 01 a 04 e IR, inferido)
- Cobertura no MCP Imposto de Renda: `orientar_servico_externo`; módulo nenhum; prioridade P2; status implementada (`orientar_servico_externo`) (ver matriz)

### S-NUVEM-DECONLINE Salvar e recuperar declaração on-line

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: serviços `salvarDecOnline`, `recuperarDecOnline`; GravadorTXT.criarArquivoPersistenciaOnline
- Exige do MCP: impossível; alternativa local
- Cobertura no MCP Imposto de Renda: `orientar_servico_externo`; módulo nenhum; prioridade P2; status implementada (`orientar_servico_externo`) (ver matriz)

### S-NUVEM-DARF Emissão de Darf em PDF pelo serviço (quota, ECA, Idoso, MAED, MAED Espólio)

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: serviços `obterPdfDarfQuota`, `obterPdfDarfECA`, `obterPdfDarfIdoso`, `obterPdfDarfMaed`, `obterPdfDarfMaedEspolio`; classes RetornoDarf, RetornoDarfAuxilio
- Exige do MCP: impossível obter o Darf oficial; alternativa: dados calculados e orientação Sicalc/e-CAC/PGD
- Cobertura no MCP Imposto de Renda: `gerar_darf`, `orientar_servico_externo`; módulo calc; prioridade P2; status implementada (`gerar_darf`, `orientar_servico_externo`) (ver matriz)

### S-NUVEM-MUNICIPIOS Atualização da tabela de municípios

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: serviço `obterTodosMunicipios`; listener TabelasAtualizadasListener
- Exige do MCP: tabela local `municipios.json` versionada; P2 para atualização manual
- Cobertura no MCP Imposto de Renda: `consultar_tabela`, `verificar_versao_tabelas`; módulo tabelas; prioridade P2; status implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`, `verificar_versao_tabelas`) (ver matriz)

### S-NUVEM-VENC-DFE Data de vencimento da Declaração Final de Espólio

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: serviço `obterDataVencimentoDFE`
- Regras: prazo da DFE depende da data da decisão/trânsito (nota 06, F-DFE-PRAZO)
- Exige do MCP: cálculo local da data limite pelas regras da Ajuda
- Cobertura no MCP Imposto de Renda: `listar_pendencias`; módulo validate; prioridade P1; status implementada (`validar_declaracao`) (ver matriz)

### S-NUVEM-CAPTCHA-TOKEN Captcha, token de acesso e certificado digital

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: classes Captcha, UsuarioLogado, TokenUtil; tela PainelCaptchaAb
- Exige do MCP: não se aplica
- Cobertura no MCP Imposto de Renda: não se aplica; módulo nenhum; prioridade P2; status não se aplica (ver matriz)

## 8 Arquivo da declaração e formatos de troca

### S-ARQ-GERAL Estrutura do arquivo de declaração

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: `LayoutDadosDIRPF2026.xml`; registros IR (header, 160 campos: sistema, exercício, ano-base, código Receitanet, indicador de retificadora, CPF, tipo de NI, versão etc.) e T9 (trailer com quantidades por tipo de registro, QT_R16 em diante); campos com nome, observação, formato (C, N etc.) e tamanho
- Exige do MCP: `gerar_dbk` e leitor do mesmo layout (`importar_declaracao_anterior` usa o layout de 2025)
- Cobertura no MCP Imposto de Renda: `gerar_dbk`, `importar_declaracao_anterior`; módulo dbk; prioridade P0; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `importar_declaracao_anterior`, `listar_declaracoes`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-IDENT Registro 16 (identificação do contribuinte)

- Origem: notas/08-menus-operacoes-sistema.md
- Campos (início): NR_REG, NR_CPF, NM_NOME, TIP_LOGRA, NM_LOGRA, NR_NUMERO, NM_COMPLEM, NM_BAIRRO, NR_CEP (65 campos)
- Exige do MCP: mapeamento a partir de F-IDENT
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P0; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-TOTAIS Registros 17, 18, 19 e 20 (totais, modelo, imposto pago e resumo)

- Origem: notas/08-menus-operacoes-sistema.md
- Campos (início): 17 impostos e totais (VR_IMPCOMP, VR_ISENTOS, VR_EXCLUSIVOS, VR_TOTAL13, VR_IRFONTELEI11033); 18 cálculo do simplificado (VR_RENDTRIB, VR_DESCSIMP, VR_BASECALC, VR_IMPDEVIDO); 19 imposto pago e livro caixa (VR_IMPEXT, VR_CARNELEAO_TIT, VR_LIVCAIX_TIT); 20 resumo completo (VR_RENDJUR, VR_RENDPFEXT, VR_RESAR, VR_TOTTRIB, limites Funpresp) (inferido pelos nomes)
- Exige do MCP: preenchidos pelo motor de cálculo
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P0; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-RENDIMENTOS Registros 21, 32, 22, 49, 80, 81 (rendimentos PJ, PF/Exterior e exigibilidade suspensa)

- Origem: notas/08-menus-operacoes-sistema.md
- Campos (início): 21 PJ titular (NR_PAGADOR, NM_PAGADOR, VR_RENDTO, VR_CONTRIB, VR_DECTERC, VR_IMPOSTO, DT_COMUNICACAO_SAIDA); 32 PJ dependentes (CPF_BENEF); 22 PF/Exterior mensal (E_DEPENDENTE, NR_CPF_DEPEN, NR_MES, VR_RENDTO, VR_ALUGUEIS, VR_OUTROS, VR_EXTER); 49 pagadores PF por mês (CPF titular do pagamento e beneficiário); 80 e 81 exigibilidade suspensa titular e dependentes (VR_DEP_JUDICIAL)
- Exige do MCP: mapeamento das fichas F-RTPJ, F-RTPF, F-SUSP
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P0; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-ISENTOS-EXCL Registros 23, 24, 31, 33, 82 e 83 a 99 (isentos, exclusivos e detalhes)

- Origem: notas/08-menus-operacoes-sistema.md
- Campos: 23 isentos por código (NR_COD_ISENTO, VR_VALOR); 24 exclusivos por código; 31, 33, 82, 93 a 99 detalhes com pagadora e beneficiário (lucros, indenizações, IRRF anos anteriores, JCP, PLR, outros, poupança, aplicações); 83 médicos residentes; 84 Voluntários da Copa; 85 meação e dissolução; 86 ganho com ações; 87 ganho com ouro; 88 parcela isenta de aposentadoria (com NR_CHAVE_BEM); 89 sócio de microempresa
- Exige do MCP: um registro de detalhe por lançamento; registro 23/24 de totais por código
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P0; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-PESSOAS Registros 25, 35, 29 (dependentes, alimentandos, cônjuge)

- Origem: notas/08-menus-operacoes-sistema.md
- Campos (início): 25 dependentes (NR_CHAVE, CD_DEPEND, NM_DEPEND, DT_NASCIM, NI_DEPEND, IN_SAIDA, NR_NITPISPASEP); 35 alimentandos (INDICADOR_RESIDENCIA, NM_NOME, DT_NASCIM, NI_ALIMENTANDO, NR_CPF_VINCULADO, IN_TIPO_PROCESSO); 29 informações do cônjuge (NR_CONJ, VR_BASE, VR_IMPOSTO, VR_ISENTO, VR_EXCLUSIVO, VR_RENDPJ_EXIB_SUSP, VR_TOTALCONJ)
- Exige do MCP: mapeamento; o registro 29 indica um quadro "Informações do Cônjuge" com totais do cônjuge (base, imposto, isentos, exclusivos, exigibilidade suspensa) que a Ajuda 2026 não descreve (lacuna, inferido)
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P0; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-PAGAMENTOS-DOACOES Registros 26, 34, 46, 48, 90, 91, 92

- Origem: notas/08-menus-operacoes-sistema.md
- Campos: 26 pagamentos (CD_PAGTO, NR_CHAVE_DEPEND, NR_BENEF, NM_BENEF, NR_NIT_EMP_DOM, VR_PAGTO, VR_REDUC); 34 doações a partidos (NR_PARTIDO, NM_PARTIDO, VR_DOACAO); 46 e 48 pensão alimentícia do RRA por alimentando (titular e dependentes); 90 doações efetuadas (CD_DOACAO, VR_PARC_NAO_DEDUT, IN_TIPO_CPF_CNPJ); 91 e 92 doações diretamente na declaração ECA e Idoso (IN_TIPO_FUNDO, SG_UF, NOME_MUNICIPIO, VR_DOACAO, NR_CNPJ_FUNDO)
- Exige do MCP: mapeamento das fichas F-PAG, F-PARTIDOS, F-DOA, F-DDD, F-RRA
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P0; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-BENS-DIVIDAS Registros 27, 36, 37, 28

- Origem: notas/08-menus-operacoes-sistema.md
- Campos: 27 bens (CD_BEM, IN_EXTERIOR, CD_PAIS, TX_BEM, VR_ANTER, VR_ATUAL e mais 52 campos condicionais); 36 vínculo bem x CPF/CNPJ (NR_CHAVE_BEM, CD_GRUPO_BEM, CD_BEM); 37 aplicações e lucros no exterior por bem (VR_GANHO_PREJUIZO, VR_IMPOSTO_DEVIDO, VR_IMPOSTO_PAGO_EXTERIOR_BRASIL, VR_BASE_CALCULO); 28 dívidas (CD_DIV, TX_DIV, VR_ANTER, VR_ATUAL, VR_PAGAMENTOANUAL)
- Exige do MCP: mapeamento de F-BENS, F-BENS-ESP, F-DIV; cálculo da Lei 14.754 por bem
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P0; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-ESPOLIO-SAIDA Registros 30, 38, 58, 59, 39

- Origem: notas/08-menus-operacoes-sistema.md
- Campos: 30 espólio em ajuste (NR_INVENT, NM_INVENT, IN_SOBREPARTILHA); 38 final de espólio (NR_ANOOBITO, inventariante, sobrepartilha e status); 58 herdeiros (NR_CHAVE_HERDEIRO, NM_NOME, NR_CPF_CNPJ); 59 percentual por bem e herdeiro (NR_CHAVE_BEM, NR_CHAVE_HERDEIRO, VR_PERCENTUAL); 39 saída (procurador, DT_NAORESIDENTE, DT_RESIDENTE, CD_NOVO_PAIS_RESIDENCIA)
- Exige do MCP: mapeamento de F-ESPOLIO, F-DFE-*, F-SAIDA
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P1; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-RRA Registros 45 e 47

- Origem: notas/08-menus-operacoes-sistema.md
- Campos: 45 RRA titular (NR_PAGADOR, NM_PAGADOR, VR_RENDTO, VR_CONTRIB, VR_PENSAO, VR_IMPOSTO e 13 campos mais); 47 RRA dependentes (CPF_BENEF)
- Exige do MCP: mapeamento de F-RRA
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P1; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-RV Registros 40, 41, 42, 43

- Origem: notas/08-menus-operacoes-sistema.md
- Campos: 40 renda variável mensal por mercado (GC_COMUM_MVISTA_ACOES, GC_COMUM_MVISTA_OURO, GC_COMUM_MOPC_* e day-trade, 54 campos); 41 totais anuais comuns/day-trade; 42 consolidação mensal; 43 totais anuais FII/Fiagro
- Exige do MCP: lista exata de linhas de mercado da grade de Renda Variável (D-RV-TIPOS) a extrair destes nomes de campo
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P1; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-AR Registros 50 a 57

- Origem: notas/08-menus-operacoes-sistema.md
- Campos: 50 imóvel explorado (NM_IMOVEL, NM_LOCAL, QT_AREA, PC_PARTIC, CD_EXPLOR); 51 receitas e despesas mensais; 52 apuração (VR_RECTOTAL, VR_DESPTOTAL, VR_PREJEXERCANT, VR_OPCAO); 53 rebanho (CD_ESPEC, QT_INIC, QT_COMPRA, QT_NASCIM, QT_PERDA, QT_VENDA); 54 bens da AR; 55 dívidas da AR; 56 exterior por país (RECBRUTA, DESPCUSTEIO, RESORIGINAL, RESDOLAR); 57 participantes do imóvel
- Exige do MCP: mapeamento de D-AR-*
- Cobertura no MCP Imposto de Renda: `gerar_dbk`; módulo dbk; prioridade P1; status implementada (`converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-GCAP Registros 60 a 78

- Origem: notas/08-menus-operacoes-sistema.md
- Campos: 60 identificação do demonstrativo e transportes (94 campos); 62 bens móveis; 63 participações societárias; 64 operações em moeda estrangeira; 65 adquirentes; 66 e 67 reduções e parcelas; 68 a 72 apuração, cálculo e parcelas; 73 a 77 moeda estrangeira em espécie e consolidação; 78 transportes para a declaração (VR_BENSISENTO, VR_BENSIMPOSTO, VR_BENSEXCLUSIVO, VR_ESPIMPOSTO, VR_ESPEXCLUSIVO)
- Exige do MCP: preservação integral dos registros importados do GCAP (o MCP Imposto de Renda não recalcula o demonstrativo importado)
- Cobertura no MCP Imposto de Renda: `importar_gcap`, `gerar_dbk`; módulo dbk; prioridade P1; status parcial (`abrir_declaracao`, `converter_modelo_para_dbk`, `gerar_arquivo_entrega`, `listar_ganhos_capital`, `orientar_servico_externo`, `verificar_integridade_arquivo`) (ver matriz)

### S-ARQ-REG-RECIBO Registros FR, HR, DR, R9, HC, RC, NC, VC, MC, TC

- Origem: notas/08-menus-operacoes-sistema.md
- Campos: FR (nome da declaração, CPF, data e hora de entrega, meio, tipo, situação); HR/DR/R9 recibo (DR com dados do contribuinte; R9 com NR_HASH); HC/RC/TC complemento do recibo (data e hora de recepção, SIGNET); NC notificação de multa; VC dados do validador; MC mensagens
- Exige do MCP: só leitura (registrar_recibo); nunca gerar (produzidos pela RFB)
- Cobertura no MCP Imposto de Renda: `registrar_recibo`; módulo importacao; prioridade P2; status implementada (`criar_retificadora`, `registrar_recibo`) (ver matriz)

### S-ARQ-INFORMES Arquivos de informe (XML) e mapeamentos de importação

- Origem: notas/08-menus-operacoes-sistema.md
- Onde: `informe_fontes_pagadoras.xsd`, `informe_planos_saude.xsd`, `informe_tipos.xsd`, `mapeamentoXml.xml`, `mapeamentoTxt.xml`, `mapeamentoXmlGCAP.xml`
- Exige do MCP: validação de XML contra os xsd públicos e mapeamento campo a campo para as fichas
- Cobertura no MCP Imposto de Renda: `importar_informe_rendimentos`, `importar_informe_plano_saude`, `importar_gcap`; módulo importacao; prioridade P1; status parcial (`abrir_declaracao`, `importar_informe_plano_saude`, `importar_informe_rendimentos`, `listar_ganhos_capital`, `orientar_servico_externo`) (ver matriz)

## 9 Tabelas

### S-TAB-PROGRESSIVA Tabela Progressiva Anual e Mensal (ano-calendário 2025)

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda pág. 355; dados também em `docs/mapeamento/tabelas/aliquotas-parametros.json`
- Valores:
  - Anual: até 28.467,20 zero; 28.467,21 a 33.919,80 7,5% deduzir 2.135,04; 33.919,81 a 45.012,60 15% deduzir 4.679,03; 45.012,61 a 55.976,16 22,5% deduzir 8.054,97; acima de 55.976,16 27,5% deduzir 10.853,78. Dedução anual por dependente 2.275,08; limite anual de instrução 3.561,50; limite anual do desconto simplificado 16.754,34.
  - Mensal janeiro a abril: até 2.259,20 zero; 2.259,21 a 2.826,65 7,5% deduzir 169,44; 2.826,66 a 3.751,05 15% deduzir 381,44; 3.751,06 a 4.664,68 22,5% deduzir 662,77; acima de 4.664,68 27,5% deduzir 896,00. Isenção previdenciária 65 anos 1.903,98; dependente 189,59; desconto simplificado mensal 564,80.
  - Mensal maio a dezembro: até 2.428,80 zero; 2.428,81 a 2.826,65 7,5% deduzir 182,16; 2.826,66 a 3.751,05 15% deduzir 394,16; 3.751,06 a 4.664,68 22,5% deduzir 675,49; acima de 4.664,68 27,5% deduzir 908,73. Isenção 65 anos 1.903,98; dependente 189,59; desconto simplificado mensal 607,20.
- Regras de cálculo afetadas: imposto anual (ajuste e simplificado), RRA (tabela mensal do mês do recebimento x meses), Saída Definitiva e Final de Espólio (soma de tabelas mensais), Carnê-Leão
- Exige do MCP: tabela parametrizada por exercício e por mês (módulo tabelas)
- Cobertura no MCP Imposto de Renda: `consultar_tabela`; módulo tabelas; prioridade P0; status implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

### S-TAB-DOLAR Tabela de Conversão para Reais do Dólar dos EUA em 2025

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda pág. 356
- Valores (compra / venda): jan 6,0394 / 6,0400; fev 6,0371 / 6,0377; mar 5,7277 / 5,7283; abr 5,7413 / 5,7419; mai 5,8701 / 5,8707; jun 5,6322 / 5,6328; jul 5,5646 / 5,5652; ago 5,5569 / 5,5576; set 5,3922 / 5,3928; out 5,3202 / 5,3208; nov 5,4458 / 5,4464; dez 5,2946 / 5,2952
- Regras: cotação do mês do recebimento ou pagamento (já corresponde ao último dia útil da 1ª quinzena do mês anterior); compra para rendimentos e imposto pago; venda para deduções; Atividade Rural usa 5,5018 (compra de 31/12/2025)
- Exige do MCP: `converter_moeda` com esta tabela; não está entre os 32 JSON de `docs/mapeamento/tabelas` (lacuna: gerar tabela própria)
- Cobertura no MCP Imposto de Renda: `converter_moeda`, `consultar_tabela`; módulo tabelas; prioridade P1; status implementada (`buscar_codigo`, `consultar_parametros`, `converter_moeda`, `listar_tabela`) (ver matriz)

### S-TAB-ATUALIZACAO Tabela de Atualização do Custo de Bens e Direitos

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda págs. 357 e 358
- Regras: dividir o valor original, na moeda da época, pelo índice do mês/ano da aquisição ou pagamento para obter o valor em reais até 31/12/1995; índices de 1938 a 1995 por moeda (Real 1994-1995; Cruzeiro Real 1993-1994; Cruzeiro 1990-1993 e 1967-1986; Cruzado Novo 1989-1990; Cruzado 1986-1989; Cruzeiro Novo 1967-1970; Mil-Réis 1938-1942); exemplo de índice: jan/1992 720,4779; dez/1995 0,9596
- Exige do MCP: tabela digitalizada e calculadora `atualizar_custo_bem` (lacuna: não está entre os JSON existentes)
- Cobertura no MCP Imposto de Renda: `atualizar_custo_bem`; módulo tabelas; prioridade P2; status implementada (`atualizar_custo_bem`) (ver matriz)

### S-TAB-DEPENDENCIA Tabela de Relação de Dependência

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda pág. 359; `tabelas/dependentes.json`
- Códigos: 11 cônjuge ou companheiro (filho ou mais de 5 anos); 21 filho ou enteado até 21 anos; 22 filho ou enteado até 24 anos cursando superior ou técnico; 23 filho ou enteado com deficiência, qualquer idade, se remuneração não exceder as deduções legais (ADI 5583); 24 irmão, neto ou bisneto sem arrimo, com guarda judicial, até 21 anos; 25 idem até 24 anos estudando, com guarda até os 21; 26 irmão, neto ou bisneto com deficiência, sem arrimo, com guarda, qualquer idade (ADI 5583); 31 pais, avós e bisavós com rendimentos até R$ 28.467,20 no ano (Ajuste e DFE) ou até a soma dos limites mensais (2.259,20 de janeiro a abril e 2.428,80 de maio a dezembro) dos meses da declaração (DSDP); 41 menor pobre até 21 anos criado, educado e sob guarda judicial; 51 pessoa absolutamente incapaz sob tutela ou curatela
- Validações conhecidas: idade na data de referência; limite de rendimentos do código 31 varia por tipo de declaração
- Exige do MCP: validação de idade e condições por código (validar_dependente)
- Cobertura no MCP Imposto de Renda: `consultar_tabela`; módulo tabelas; prioridade P0; status implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

### S-TAB-BENS Tabela de Códigos de Bens e Direitos

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda págs. 360 a 362 e 190 a 193; `tabelas/bens-direitos.json`
- Conteúdo: grupos 01 a 08 e 99 (detalhe em F-BENS-G01 a F-BENS-G99)
- Exige do MCP: consulta à tabela
- Cobertura no MCP Imposto de Renda: `consultar_tabela`; módulo tabelas; prioridade P0; status implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

### S-TAB-PAGAMENTOS Tabela de Códigos de Pagamentos

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda pág. 363; `tabelas/pagamentos.json`
- Códigos: 01, 02, 09 a 22, 26, 30, 31, 33, 34, 36, 37, 60, 61, 62, 66, 70, 71, 72, 76, 99 (detalhe em F-PAG-xx)
- Observações: o JSON tem 42 registros (inclui códigos de doações e outros), a Ajuda lista 31 códigos de pagamento
- Cobertura no MCP Imposto de Renda: `consultar_tabela`; módulo tabelas; prioridade P0; status implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

### S-TAB-DOACOES Tabela de Códigos de Doações

- Origem: notas/07-saida-tabelas-erros.md
- Onde: Ajuda pág. 364
- Códigos: 40, 41, 42, 43, 44, 45, 46, 47, 80, 81, 99 (detalhe em F-DOA-xx)
- Cobertura no MCP Imposto de Renda: `consultar_tabela`; módulo tabelas; prioridade P1; status implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) (ver matriz)

