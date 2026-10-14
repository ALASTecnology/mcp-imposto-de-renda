# Notas 08: menus, ações, operações, importações, impressão, serviços em nuvem e arquivo da declaração

Fontes: Ajuda "Como fazer para..." e "Perguntas mais Frequentes" (págs. 366 a 421), AtalhosIRPF.pdf (atalhos.txt), lista de classes de ação do pacote `serpro.ppgd.irpf.gui.basica.acoes` (actions.txt, só nomes de arquivos), nomes de telas (.form) e de relatórios (.jasper), nomes de classes de `irpf-servicos-nuvem.jar` (docs/mapeamento/estrutura-pacotes.md) e o recurso de dados `LayoutDadosDIRPF2026.xml` (tipos de registro e nomes de campos). Itens deduzidos apenas do nome de uma classe ou tela estão marcados "(inferido)".

---

## Menus principais

## M-MENU-DECLARACAO Menu Declaração
- Onde: barra de menu (Alt+D) e seção "Declaração" da barra lateral
- Itens: Nova, Abrir, Fechar, Excluir, Retificar, Verificar Pendências, Entregar Declaração, Imprimir (submenu), Salvar On-line, Recuperar On-line, Sair do Programa (detalhados em M-DECL-*)
- Exige do MCP: equivalência por ferramentas de ciclo de vida

## M-MENU-IMPORTACOES Menu Importações
- Onde: barra de menu (Alt+P) e seção "Importações" da barra lateral
- Itens: Carnê-Leão 2025, Atividade Rural 2025, Ganhos de Capital 2025, Informe de Rendimentos, Informe de Plano de Saúde (pág. 389)
- Exige do MCP: ferramentas `importar_*`

## M-MENU-FICHAS Menu Fichas e navegação
- Onde: barra de menu (Alt+F); barra lateral com grupos expansíveis (Declaração, Demonstrativos, Resumo, Impressão, Ferramentas, Ajuda); pág. 370 e 404
- Itens: Fichas da Declaração; Demonstrativos (Atividade Rural, Ganhos de Capital, Renda Variável); Resumo da Declaração
- Validações conhecidas: Tab ou Enter avança campo; Shift+Tab retorna; Alt+PgUp/PgDn navega meses nas grades mensais
- Exige do MCP: `listar_fichas` com estado de preenchimento (aplicáveis ao tipo de declaração)

## M-MENU-FERRAMENTAS Menu Ferramentas
- Onde: barra de menu (Alt+T) e barra lateral
- Itens: Cópia de Segurança (Gravar, Restaurar), Calculadora, Verificar Atualizações, Recuperação de Nomes (Ativar/Desativar, Limpar); demais ações do pacote `acoes` sem citação na Ajuda estão em M-FERR-* (inferido)
- Exige do MCP: ferramentas de cópia de segurança; demais sem equivalente

## M-MENU-AJUDA Menu Ajuda
- Onde: barra de menu (Alt+J); pág. 367
- Itens: Conteúdo (Alt+Shift+C); Instruções de Preenchimento (Alt+Shift+I); Como Fazer para... (Alt+Shift+F); Perguntas e Respostas (Alt+Shift+G); Perguntas mais Frequentes (Alt+Shift+R); Sobre o IRPF 2026 (Alt+Shift+S); Ajuda de Acessibilidade (F11); fechar Ajuda (Alt+F4)
- Exige do MCP: `obter_ajuda` com conteúdo de regras por ficha e campo

## M-TOOLBAR Barra de ferramentas
- Onde: topo da janela (classes JIRPFToolbar e JIRPFToolbarCustom, toolbar personalizável inferido)
- Itens: ícones de Nova, Abrir, Fechar, Excluir, Importar declaração 2025, Pré-preenchida, Verificar Pendências, Entregar, Imprimir (com itens), Calculadora, Ajuda (págs. 371 a 388)
- Exige do MCP: sem equivalente (atalhos de UI)

## M-RODAPE-COMPARATIVO Painel de imposto e comparativo no rodapé
- Onde: parte inferior da tela abaixo da barra lateral (FAQ pág. 419); telas PainelImpostoPagar, PainelComparativo; classe ComparativoAction
- Campos: imposto a pagar ou a restituir nas duas formas (deduções legais e desconto simplificado) atualizado durante o preenchimento
- Exige do MCP: `calcular_imposto` com modelo "ambos" e recomendação

---

## Tela inicial

## M-INICIAL-NOVA Aba "Nova" (tela "O que você deseja fazer?")
- Onde: tela de entrada; págs. 39 e 371; telas PainelIRPFNovaDeclaracao, PainelCriarNovaDeclaracao, SubPainelDeclaracaoAnoAnterior, SubPainelDeclaracaoPrePreenchida, SubPainelDeclaracaoEmBranco, PainelImagemNovaDeclaracaoAjuste/Espolio/Saida
- Campos: tipo (Ajuste Anual, Final de Espólio, Saída Definitiva); modo: Iniciar a partir da Pré-Preenchida ("Declaração própria" ou "Declaração por procuração", com CPF do declarante), Iniciar Importando Declaração de 2025 (pasta e unidade), Iniciar em Branco (CPF e Nome)
- Validações conhecidas: pré-preenchida exige login gov.br Ouro ou Prata; rendimentos de dependentes na pré-preenchida exigem procuração eletrônica ou autorização no Meu Imposto de Renda
- Exige do MCP: `criar_declaracao` (tipo, modo, cpf, nome, arquivo de origem)

## M-INICIAL-EMPREENCH Aba "Em Preenchimento"
- Onde: tela de entrada; telas PainelDeclaracoesPreenchimento, SubpainelDeclaracoesPreenchimento, PainelPesquisaPorNome
- Campos: pesquisa por nome; lista de declarações; ícones Abrir, Excluir, Entregar, Imprimir, Gravar Cópia de Segurança
- Exige do MCP: `listar_declaracoes` com filtro

## M-INICIAL-TRANSMITIDAS Aba "Transmitidas"
- Onde: tela de entrada; telas PainelDeclaracoesTransmitidas, SubpainelDeclaracoesTransmitidas
- Campos: pesquisa por nome; ícones Abrir, Retificar, Imprimir (Declaração, Recibo, Darf do IRPF), Gravar Cópia de Segurança e Recibo; símbolo de transmitida
- Exige do MCP: estado "transmitida" registrado a partir do recibo informado pelo usuário (`registrar_recibo`)

## M-INICIAL-BOASVINDAS Aba "Boas-vindas", links úteis e "Entrar com gov.br"
- Onde: tela de entrada; telas PainelAbaBemVindos, PainelIRPFBemVindos, PainelBemVindoToolTip
- Campos: mensagens, dicas, novidades; links úteis; botão Entrar com gov.br
- Exige do MCP: sem equivalente; orientação textual

---

## Menu Declaração (itens)

## M-DECL-NOVA Declaração > Nova
- Onde: menu, barra lateral, ícone, aba Nova, Ctrl+N; pág. 371
- Exige do MCP: `criar_declaracao`

## M-DECL-ABRIR Declaração > Abrir
- Onde: menu, barra lateral, ícone, aba Em Preenchimento, Ctrl+B; pág. 377; tela PainelAbrirDeclaracao
- Validações conhecidas: lista em ordem alfabética de nomes; botão imprimir relação; só uma declaração aberta por vez (abrir outra fecha a atual); mostra símbolo e nº do recibo se transmitida
- Exige do MCP: `abrir_declaracao` (o MCP pode operar várias por ID, sem a restrição)

## M-DECL-FECHAR Declaração > Fechar
- Onde: menu, barra lateral, ícone, Ctrl+F; pág. 377
- Validações conhecidas: não precisa salvar, dados gravados ao digitar; diferente de Sair do Programa
- Exige do MCP: sem equivalente necessário (persistência imediata)

## M-DECL-EXCLUIR Declaração > Excluir
- Onde: menu, barra lateral, ícone, aba Em Preenchimento, Ctrl+E; pág. 378; tela PainelExcluirDeclaracao
- Campos: seleção de uma ou várias (Ctrl, Shift), em preenchimento e transmitidas
- Exige do MCP: `excluir_declaracao` com confirmação

## M-DECL-RETIFICAR Declaração > Retificar
- Onde: barra lateral, aba Transmitidas (ícone), ficha Identificação "Declaração retificadora", Ctrl+G; pág. 378; tela PainelRetificarDeclaracao
- Validações conhecidas: lista de transmitidas; retificadora exige nº do recibo da anterior (12 dígitos)
- Exige do MCP: `criar_retificadora`

## M-DECL-PENDENCIAS Declaração > Verificar Pendências
- Onde: menu, barra lateral, ícone, F5; págs. 379 e 414; telas PainelVerificarPendencias, PainelVerificarPendenciasAcessivel, PainelPendencias
- Validações conhecidas: só com declaração aberta; ERROS impedem a entrega (ex.: data de nascimento em branco ou inválida); AVISOS não impedem (ex.: título eleitoral em branco, "Valor do bem não foi informado, item nº xxx"); clicar na pendência leva ao campo; catálogo de mensagens do programa em `Mensagens.properties` (727 chaves, ex.: "Número de inscrição no CPF não pode ser o mesmo do titular", "A declaração não possui Avisos e Erros impeditivos")
- Exige do MCP: `listar_pendencias` com severidade, ficha, campo e mensagem

## M-DECL-ENTREGAR Declaração > Entregar Declaração
- Onde: menu, barra lateral (também no rodapé do menu lateral com declaração aberta), ícone, aba Em Preenchimento, Ctrl+I; com certificação digital Ctrl+Shift+B; sem certificação digital Ctrl+Shift+E; págs. 382 e 420; telas PainelGravarEntrega, PainelGravarTransmitir, PainelGravarTransmitirPendenciasNaoImpeditivas, PainelGravacaoEntregaPendenciasNaoImpeditivas, PainelGravacaoEntregaModeloMelhor, PainelInformaRegimeTributacao, PainelDadosRestituicao, PainelDadosDebitoAutomatico; ações GravarEntregaAction e TransmitirDeclaracaoAction
- Validações conhecidas: verifica pendências antes; erros bloqueiam; avisos permitem; aviso de modelo de tributação mais vantajoso (inferido pelo nome PainelGravacaoEntregaModeloMelhor); confirma regime, dados de restituição e débito automático (inferido pelos nomes de tela); recibo gravado automaticamente e disponível na aba Transmitidas; única forma de apresentação é a Internet, sem programa adicional (Receitanet incorporado)
- Exige do MCP: impossível transmitir fora do PGD; alternativa: `gerar_dbk` + `instruir_transmissao`

## M-DECL-SALVAR-ONLINE Declaração > Salvar On-line (F6)
- Onde: atalho F6 (atalhos.txt); ação SalvarOnlineAction; serviço `salvarDecOnline` do barramento
- Regras: guarda a declaração em preenchimento na nuvem da RFB vinculada à conta gov.br (inferido pelo nome do serviço)
- Exige do MCP: impossível (serviço autenticado); alternativa: cópia local e orientação

## M-DECL-RECUPERAR-ONLINE Declaração > Recuperar On-line (F7)
- Onde: atalho F7; ação RecuperarDecOnlineAction; tela PainelRecuperarDeclaracaoOnline; serviço `recuperarDecOnline`
- Exige do MCP: impossível; alternativa: usuário recupera no PGD e grava cópia de segurança para o MCP importar

## M-DECL-SAIR Declaração > Sair do Programa
- Onde: menu, Alt+F4; pág. 387
- Exige do MCP: não se aplica

## M-DECL-CONVERTER Converter declaração (inferido)
- Onde: ação ConverterDeclaracaoAction (sem citação na Ajuda)
- Regras: provável conversão entre tipos de declaração (por exemplo, ajuste para saída ou espólio) ou entre modelos (inferido)
- Exige do MCP: `definir_identificacao` com troca de tipo e revalidação das fichas
- Observações: confirmar no programa

---

## Impressão (submenu Declaração > Imprimir, barra lateral Imprimir, ícone impressora)

## M-IMPR-DECLARACAO Imprimir Declaração
- Onde: Ctrl+P; págs. 378 e 415; telas PainelImprimirDeclaracao, PainelSelecaoTipoImpressao, PainelSelecaoTipoImpressaoNova; relatórios DIRPF2026, FolhaDeRosto e 60 sub-relatórios por ficha (relDeclaracao*)
- Campos: Toda a declaração ou Partes da declaração (seleção de fichas, inclusive Ganhos de Capital); Visualizar; salvar em PDF (SalvarImagemDeclaracaoAction)
- Exige do MCP: `gerar_relatorio_declaracao` (PDF ou HTML, todo ou por fichas), sem reproduzir layout oficial protegido (layout próprio)

## M-IMPR-REND-PF Imprimir Rendimentos Recebidos de PF
- Onde: Ctrl+Shift+F; pág. 379; tela PainelImprimirRendimentosRecebidosPF; relatórios relDeclaracaoRendimentosTributaveisPF*
- Campos: escolha da declaração; visualizar; PDF
- Exige do MCP: `gerar_relatorio_declaracao` com parte "rendimentos_pf"

## M-IMPR-RECIBO Imprimir Recibo de Entrega
- Onde: Ctrl+R; págs. 383 e 421; tela PainelImprimirRecibo; relatório relRecibo; ação SalvarImagemReciboAction
- Validações conhecidas: só após a apresentação; recibo de uma via com duas páginas; nº do recibo de 12 dígitos na folha 2; impressão em outro computador via cópia "última declaração entregue e recibo"
- Exige do MCP: impossível gerar recibo oficial; alternativa: orientar a impressão no PGD e `registrar_recibo` para guardar o número

## M-IMPR-DARF Imprimir Darf do IRPF
- Onde: Ctrl+D; aba Transmitidas; págs. 385 e 415; telas PainelImprimirDARFCodigoBarras, PainelImprimirDARFEscolherCota; relatório relDarfCodBarra; serviço `obterPdfDarfQuota`
- Campos: escolha da quota (todas, inclusive em atraso, com Selic desde 01/06/2026 e multa de 0,33% ao dia até 20%); visualizar e PDF
- Validações conhecidas: valor mínimo impresso R$ 10,00; quotas de retificadora com mudança de imposto: emitir no e-CAC (Meu Imposto de Renda, Consultar Débitos, Emitir DARF e Alterar Quotas); todos os Darf têm código de barras
- Exige do MCP: `gerar_darf` com dados calculados (código 0211, período, vencimento, principal, multa, juros); código de barras e número do documento oficiais não reproduzíveis: orientar Sicalc, PGD ou e-CAC

## M-IMPR-DARF-MAED Imprimir Darf de Multa por Atraso na Entrega
- Onde: Ctrl+U; pág. 385; tela PainelImprimirDARFMaed; relatórios relDarfMulta, relNotificacao, relNotificacaoEspolio, relNotificacaoSaida; serviços `obterPdfDarfMaed` e `obterPdfDarfMaedEspolio`
- Exige do MCP: `calcular_multa_atraso` e orientação; Darf oficial da notificação só pelo PGD

## M-IMPR-DARF-ECA Imprimir Darf, Doações Diretamente na Declaração, ECA
- Onde: Ctrl+W; pág. 386; tela PainelImprimirDarfECA; relatório relDarfDoacaoECA; serviço `obterPdfDarfECA`
- Validações conhecidas: código 3351; valor mínimo R$ 10,00
- Exige do MCP: `gerar_darf` tipo "doacao_eca"

## M-IMPR-DARF-IDOSO Imprimir Darf, Doações Diretamente na Declaração, Pessoa Idosa
- Onde: Ctrl+Y; pág. 386; tela PainelImprimirDarfEstatutoIdoso; relatório relDarfDoacaoEstatutoIdoso; serviço `obterPdfDarfIdoso`
- Validações conhecidas: código 9090; valor mínimo R$ 10,00
- Exige do MCP: `gerar_darf` tipo "doacao_idoso"

## M-IMPR-RELACAO Imprimir Relação de Declarações
- Onde: Ctrl+L; pág. 387; tela PainelImprimirRelacaoDeclaracoes; relatório relDeclaracoes
- Campos: relação das declarações em preenchimento e transmitidas, ordenável por tipo, modelo, nome ou CPF
- Exige do MCP: `listar_declaracoes` (formato de relatório opcional)

## M-IMPR-COMUNICACAO-SAIDA Imprimir Comunicação à Fonte Pagadora de Saída do País
- Onde: Ctrl+Shift+S; pág. 387; tela PainelImprimirComunicacaoSaida; relatórios relComunicacaoSaida, relComunicacaoSaidaDetalhe; campo DT_COMUNICACAO_SAIDA no registro 21 (inferido: data da comunicação por fonte pagadora)
- Exige do MCP: `gerar_comunicacao_saida` (documento por fonte pagadora)

## M-IMPR-INFORME-REND Imprimir Informe de Rendimentos (arquivo XML da fonte)
- Onde: Ctrl+Alt+R; págs. 391 e 402; relatórios relInformeRendimentosPJ*
- Campos: seleção do XML; Visualizar ou Imprimir
- Exige do MCP: `ler_informe` (visualização legível do XML)

## M-IMPR-INFORME-PS Imprimir Informe de Plano de Saúde
- Onde: Ctrl+Alt+I; págs. 392 e 402; relatórios relInformePlanoSaude*
- Exige do MCP: `ler_informe`

## M-IMPR-DARF-AUXILIO Darf de devolução do Auxílio Emergencial (inferido)
- Onde: ações ImprimirDarfAuxilioEmergencialAction; telas PainelImprimirDarfAuxilioEmergencial, PainelMensagemAuxilioEmergencial; relatórios relDarfAuxilio, relDarfAuxilioEmergencial; serviço `calcularMultaJurosDarfAuxilio`
- Regras: funcionalidade herdada de exercícios anteriores; a Ajuda 2026 não a descreve
- Exige do MCP: fora de escopo (P2); orientar o serviço da RFB

## M-IMPR-CRITERIOS-OBRIG Impressão de critérios de obrigatoriedade (inferido)
- Onde: tela PainelImprimirCriteriosObrigatoriedade; relatório relNotificacaoCondicoesObrigatoriedade
- Exige do MCP: `verificar_obrigatoriedade` com relatório

## M-IMPR-SALVAR-PDF Visualizar e salvar em PDF
- Onde: ações SalvarImagemDeclaracaoAction, SalvarImagemReciboAction, SalvarImagemDarfCodBarrasAction, SalvarImagemDarfECAAction, SalvarImagemDarfMultaAction, SalvarImagemRelacaoDeclaracoesAction, SalvarImagemComunicacaoSaidaAction
- Exige do MCP: saída em PDF das ferramentas de relatório

---

## Importações

## M-IMP-ANO-ANTERIOR Importar dados da Declaração de 2025
- Onde: ícone da barra de ferramentas; aba Nova "Iniciar Importando Declaração de 2025"; ação ImportarAnoAnteriorAction; págs. 373, 396 e 397; tela PainelImportarProgramasIRPF, PainelResultadoImportacao(oes)
- Campos: unidade e pasta de origem; seleção de um, alguns ou todos os CPF; lista automática das transmitidas na pasta padrão do IRPF2025
- Dados recuperados: Identificação (todos); dependentes e alimentandos (nome, CPF, nascimento); fontes pagadoras PJ (CNPJ/CPF e nome); Pagamentos (nome e CPF/CNPJ do beneficiário); bens e dívidas com Situação 31/12/2024 diferente de zero (código, discriminação, localização, país, valor); imóveis rurais explorados (todos os dados); bens da AR (código e discriminação); estoque final do rebanho; dívidas rurais; saldo de prejuízo rural (Como fazer pág. 373, embora a nota 06 diga que o prejuízo não é importado: divergência); nº do recibo de 2025 se importado do arquivo transmitido ou da cópia "última declaração transmitida e recibo"
- Validações conhecidas: aceita arquivo gravado para entrega, transmitido ou cópia da última transmitida com recibo; nome do arquivo `CPF-IRPF-A-2025-2024-ORIGI.DEC` (A ajuste, E espólio, S saída; ORIGI ou RETIF); apaga dados já digitados do CPF (com aviso); campos importados editáveis; relatório de importadas e não importadas
- Exige do MCP: `importar_declaracao_anterior` (leitor do formato .DEC do ano anterior) sem apagar silenciosamente; relatório do que falta preencher

## M-IMP-PREPREENCHIDA Importar Declaração Pré-Preenchida
- Onde: ícone; aba Nova "Iniciar a partir da Pré-Preenchida"; ação ImportarPrepreenchidaAction; págs. 374, 398 e 399; serviço `obterPrePreenchida`
- Dados recuperados: cadastro CPF; dados da declaração de 2025 (identificação, dependentes, fontes, pagamentos, bens, recibo); informações de 2025 de eSocial, EFD-Reinf, Dmed, Dimob, Carnê-Leão (rendimentos do profissional e pagamentos dos clientes), e-Financeira, DOI, DBF, criptoativos (IN RFB 1.888/2019) e convênios
- Validações conhecidas: gov.br Ouro ou Prata; uso opcional; apaga dados já digitados (com aviso); conferência e completude são responsabilidade do contribuinte; dependentes exigem procuração
- Exige do MCP: impossível baixar (autenticado); alternativa: usuário obtém o arquivo da pré-preenchida (Meu Imposto de Renda ou PGD) e o MCP `importar_pre_preenchida` lê o arquivo, ou o usuário importa no PGD e grava cópia para o MCP

## M-IMP-INFORME-REND Importar Informe de Rendimentos
- Onde: Importações > Informe de Rendimentos; "Importar arquivo da fonte pagadora" no rodapé de Rendimentos PJ (Alt+I); Ctrl+Shift+R; ação ImportarInformeRendimentosAction; págs. 390 e 400; telas do pacote `declaracao.assistida.informerendimentos` (pré-visualização por item: Rend. PJ, Exigibilidade Suspensa, RRA, Pensão, Previdência Complementar, Pagamentos, Isentos ou Exclusivos)
- Dados recuperados: total de rendimentos (inclusive férias); contribuição previdenciária oficial; IRRF; 13º; previdência complementar; pensão alimentícia; isentos (65 anos, moléstia grave, lucros e dividendos, sócio de ME/EPP, indenizações e PDV, benefícios indiretos e reembolsos Voluntários da Copa, bolsas de médico e não médico, IRRF compensado de anos anteriores, diárias, ajuda de custo, abono pecuniário); exclusivos; RRA; exigibilidade suspensa
- Validações conhecidas: layout público da RFB (xsd `informe_fontes_pagadoras.xsd`, `informe_tipos.xsd`); só adiciona; cada informe uma única vez (repetir duplica); conferência do contribuinte
- Exige do MCP: `importar_informe_rendimentos` com detecção de duplicidade

## M-IMP-INFORME-PS Importar Informe de Plano de Saúde
- Onde: Importações; rodapé de Pagamentos; Ctrl+Shift+I; ação ImportarInformePlanoSaudeAction; págs. 391 e 401
- Exige do MCP: `importar_informe_plano_saude` (ver F-PAG-IMPPS)

## M-IMP-CARNE-LEAO Importar Carnê-Leão 2025
- Onde: Importações > Carnê-Leão 2025 (Ctrl+Shift+C); botão na ficha PF/Exterior (Alt+I); ação ImportarCarneLeaoAction; telas PainelImportacaoCarneLeao, PainelLoginGovBrOuCodigoAcesso, PainelSolicitarCodigoAcesso, PainelInformarVersaoCarneLeao; serviços `importarCarneLeaoComLoginGovBr` e `importarCarneLeaoComCodigoAcesso`
- Regras: dados do Carnê-Leão Web do titular e de dependentes (CPF na ficha Dependentes); autenticação por gov.br ou código de acesso (inferido pelos nomes); não sobrescreve CNPJ já presente em Rendimentos PJ nem imposto pago no exterior já informado (nota 02)
- Exige do MCP: impossível baixar; alternativa: usuário exporta/baixa o demonstrativo no e-CAC e o MCP `importar_carne_leao` lê o arquivo (formato a mapear; classes RepositorioTxtDadosCarneLeao e RepositorioTxtDadosCarneLeaoWeb indicam formatos TXT antigo e Web)

## M-IMP-AR Importar Atividade Rural 2025
- Onde: Importações (Ctrl+Shift+A); botão Importar em Receitas e Despesas; ação ImportarAtividadeRuralAction
- Exige do MCP: `importar_livro_caixa_rural` (ver D-AR-IMPORT)

## M-IMP-GCAP Importar Ganhos de Capital 2025
- Onde: Importações (Ctrl+Shift+G); botão Importar em cada tela do demonstrativo; ação ImportarGCAPAction; FAQ págs. 409 a 411
- Validações conhecidas: só arquivo "Exportar para o IRPF2026" do GCAP2025 (não cópia de segurança, que pode ter erros); arquivo do CPF da declaração ou de dependente cadastrado; nova importação do mesmo CPF substitui todos os dados de GCAP daquele CPF (outros CPF intactos); excluir o dependente exclui seu GCAP; GCAP2026 não importa no IRPF2026; para alterar, corrigir no GCAP2025, exportar e reimportar; o demonstrativo só é preenchido por importação; impressão pelo GCAP ou por Imprimir > Partes > Ganhos de Capital
- Exige do MCP: `importar_gcap` (XML; mapeamento `mapeamentoXmlGCAP.xml`); substituição por CPF

## M-IMP-SUGESTAO Sugestão de importação (inferido)
- Onde: ação SugereImportacaoAction; tela PainelConfirmacaoImportacao
- Regras: provável oferta automática de importar a declaração anterior encontrada na pasta padrão (inferido, coerente com pág. 373)
- Exige do MCP: `listar_declaracoes` pode apontar arquivos .DEC do ano anterior encontrados na pasta indicada

---

## Ferramentas

## M-FERR-COPIA-GRAVAR Gravar Cópia de Segurança
- Onde: Ferramentas > Cópia de segurança > Gravar; barra lateral Gravar Cópia; abas Em Preenchimento e Transmitidas; Ctrl+K; págs. 380 e 418; telas PainelGravarCopiaSeguranca, PainelGravarCopiaSegurancaPasso2, PainelGravarCopiaDeclaracaoTransmitida
- Campos: tipo: "Cópia da declaração com os dados atuais" (estado atual, sem recibo, não serve para entrega); "Cópia da declaração para entrega à RFB" (arquivo transmissível depois pelo Receitanet); "Cópia da última declaração entregue e do recibo de entrega" (declaração transmitida e recibo; importável no IRPF2027; permite imprimir o recibo em outro computador); seleção de uma, algumas ou todas; unidade e pasta de destino
- Exige do MCP: `gravar_copia_seguranca` (formato próprio do AutoIR e, quando possível, `gerar_dbk` para o formato de entrega)

## M-FERR-COPIA-RESTAURAR Restaurar Cópia de Segurança
- Onde: Ferramentas > Cópia de Segurança > Restaurar; barra lateral Restaurar; Ctrl+T; págs. 381 e 418
- Validações conhecidas: lista por CPF em ordem crescente; restaurar sobre declaração existente substitui todos os dados (com alerta); transmitidas também podem ser restauradas
- Exige do MCP: `restaurar_copia_seguranca` (formato próprio) e leitura de cópias do PGD via `importar_declaracao_anterior` ou leitor de .DEC (lacuna: formato de cópia do PGD 2026 a validar)

## M-FERR-CALCULADORA Calculadora
- Onde: Ferramentas > Calculadora; ícone; Ctrl+Alt+A; pág. 388; telas CalculadoraForm, DisplayForm, HistoricoForm, TecladoForm, CancelarTransporteForm
- Regras: botão transportar leva o valor ao campo numérico
- Exige do MCP: não se aplica (o assistente calcula)

## M-FERR-ATUALIZACOES Verificar Atualizações
- Onde: Ferramentas > Verificar Atualizações; Alt, T, V; automática ao abrir; pág. 367; telas PainelVerificarAtualizacao, PainelAvisoVerificarAtualizacoes, PainelDownloadAtualizacoes; ação VerificarNovaVersaoAction
- Regras: atualização opcional ou obrigatória (obrigatória impede a entrega); reinicia o programa; se falhar, download manual
- Exige do MCP: `verificar_versao_tabelas` (versão das tabelas e parâmetros embarcados no AutoIR x versão do PGD conhecida); alerta de PGD desatualizado ao instruir a transmissão

## M-FERR-RECNOMES Recuperação de Nomes (Ativar/Desativar, Limpar)
- Onde: Ferramentas > Recuperação de Nomes; Alt, T, R, T (ativar) e Alt, T, R, L (limpar); pág. 368; ações AtivarRecuperarNomesAction, LimparCacheNomesAction
- Regras: preenche Nome a partir de CPF/CNPJ já digitados ou importados (cache local, não vem da RFB); ativado por padrão
- Exige do MCP: `buscar_nome_por_documento` no histórico local da declaração (P2)

## M-FERR-LOGIN-GOVBR Entrar e sair com gov.br
- Onde: botão na tela inicial; ações LoginGovAction, LogoutGovAction; telas PainelProcessaLogin, PainelCaptchaAb; serviços de captcha, token e UsuarioLogado
- Exige do MCP: impossível (autenticação); fora do escopo por desenho (servidor 100% local)

## M-FERR-PAGINAS Links para páginas da RFB (IRPF, DTE) e navegador
- Onde: ações PaginaIRPFAction, PaginaDTEAction, AbrirNavegadorAction (inferido: abrem páginas do IRPF e do Domicílio Tributário Eletrônico)
- Exige do MCP: orientação com links públicos

## M-FERR-MEMORIA Memória do IRPF (inferido)
- Onde: ação MemoriaIRPFAction (sem citação na Ajuda)
- Exige do MCP: a confirmar (P2)

## M-FERR-LEAOZINHO Assistente "Leãozinho" (inferido)
- Onde: ação LeaozinhoAction (sem citação na Ajuda)
- Exige do MCP: a confirmar (P2); o próprio MCP cumpre papel de assistente

## M-FERR-AVALIACAO Avaliação do programa (inferido)
- Onde: ação HabilitarAvaliacaoAction; tela PainelAvisoAvaliacao
- Exige do MCP: não se aplica

## M-FERR-INFO-CALCULO Constantes de cálculo (inferido, tela de testes)
- Onde: tela PainelInfoConstantesCalculo do pacote `testes`
- Exige do MCP: `consultar_tabela` com parâmetros de cálculo (aliquotas-parametros.json)

---

## Ajuda

## M-AJUDA-CONTEXTUAL Ajuda de campo (F1) e textos em azul
- Onde: F1 em qualquer campo; links internos; págs. 366 e 417; na ficha Resumo, F1 indica a procedência dos valores (pág. 413)
- Exige do MCP: `obter_ajuda` por ficha e campo, inclusive rastreabilidade do Resumo (`explicar_calculo`)

## M-AJUDA-DOCUMENTOS Conteúdo, Instruções, Como Fazer, Perguntas e Respostas, FAQ
- Onde: menu Ajuda; botões da janela de ajuda (Guardar como, Imprimir, Procurar, painel de utilitários, navegação de páginas, zoom)
- Exige do MCP: `obter_ajuda` com busca textual

## M-AJUDA-ATALHOS Exibir atalhos
- Onde: ação ExibirAtalhosPGDIRPFAction; AtalhosIRPF.pdf
- Exige do MCP: não se aplica

## M-AJUDA-ACESSIBILIDADE Acessibilidade (F11) e leitura de tela
- Onde: ação AjudaAcessibilidadeAction; telas PainelAjudaAcessibilidade, PainelAjudaLeituraTela, versões acessíveis de pendências e imposto a pagar; pág. 387
- Regras: menus acessíveis pela tecla Alt; conteúdo específico por ficha com F11
- Exige do MCP: respostas textuais já são acessíveis

## M-AJUDA-SOBRE Sobre, Novidades, Tutorial
- Onde: ações SobreAction, NovidadesAction, TutorialAction; telas PainelSobre, PainelCreditos, PainelNovidades, PainelSplash
- Exige do MCP: `obter_ajuda` tópico "novidades 2026"

---

## Demonstrativo de ganhos de capital do ano corrente e ações de demonstrativo

## M-DEMO-ACOES Novo, Abrir, Fechar, Excluir e Retificar Demonstrativo (inferido)
- Onde: ações NovoDemonstrativoAction, AbrirDemonstrativoAction, FecharDemonstrativoAction, ExcluirDemonstrativoAction, RetificarDemonstrativoAction; listener DemonstrativoListener; tela PainelImprimirDARFCodigoBarrasDemonstrativoAberto; tela gcap PainelAlienacaoAnosAnteriores
- Regras: provável ciclo de vida de demonstrativos de apuração de ganhos de capital (GCAP 2026, do ano corrente, com Darf de código de barras) dentro do PGD, além da importação do GCAP 2025 (inferido; a Ajuda 2026 só descreve a importação)
- Exige do MCP: `calcular_ganho_capital` (simulador próprio) e orientação de Darf 4600, 8523, 8960; P2
- Observações: confirmar no programa

---

## Carnê-Leão (módulo irpf-gui-carne-leao)

## D-CL-GERAL Escrituração do Carnê-Leão importada (titular e dependentes)
- Onde: módulo `irpf-gui-carne-leao.jar`, telas PainelDadosEscrituracaoTitular, PainelDadosEscrituracaoMensalTitular, PainelAbaLancamentosEscrituracaoTitular, PainelAbaEscrituracaoDetalheTitular, PainelDadosEscrituracaoDependente, PainelDadosEscrituracaoMensalDependentes, PainelAbaSelecaoEscrituracaoDependentes, PainelAbaLancamentosEscrituracaoDependentes(Detalhe), PainelAbaRendPFTitular, PainelAbaRendPFDependentesLista(Detalhe), PainelAbaSelecaoDependente
- Regras: a ficha Rendimentos Tributáveis de PF e do Exterior recebe os totais mensais do Carnê-Leão Web (rendimentos, deduções, livro Caixa, imposto pago 0190); lançamentos de escrituração mensal e por pagador (CPF do titular do pagamento e do beneficiário, registro 49 do layout); seleção de dependente para importar (inferido pelos nomes)
- Exige do MCP: modelo mensal (F-RTPF) e importador (M-IMP-CARNE-LEAO); `calcular_carne_leao` opcional (P2) com tabela mensal

## D-CL-PROGRAMA Programa Carnê-Leão (e-CAC)
- Onde: FAQ pág. 405
- Regras: apura imposto mensal, calcula limites, imprime Darf, escritura livro Caixa, grava dados para a DAA; acesso pelo e-CAC, Meu Imposto de Renda, Declarações, Acessar Carnê-Leão
- Exige do MCP: orientação (fora do PGD)

---

## Fichas sem descrição própria na Ajuda 2026

## F-CONJUGE Informações do Cônjuge ou Companheiro (inferido)
- Onde: relatório relDeclaracaoConjuge; layout registro 29 (NR_CONJ, VR_BASE, VR_IMPOSTO, VR_ISENTO, VR_EXCLUSIVO, VR_RENDPJ_EXIB_SUSP, VR_TOTALCONJ)
- Aplica-se a: declaração em separado com cônjuge informado na Identificação (inferido)
- Campos: CPF do cônjuge; base de cálculo do imposto, imposto pago ou retido, rendimentos isentos, rendimentos exclusivos, rendimentos com exigibilidade suspensa e total de rendimentos do cônjuge (inferido pelos nomes)
- Exige do MCP: campos opcionais ligados a F-IDENT-CONJ; confirmar no programa se a ficha existe na interface de 2026
- Observações: lacuna da Ajuda

---

## Operações do sistema

## S-SALVAMENTO Salvamento automático
- Onde: pág. 376; componente HoraSalvamentoPanel
- Regras: dados salvos à medida que são digitados; sem risco de perda ao fechar ou em falta de energia
- Exige do MCP: persistência imediata e atômica em disco a cada ferramenta de escrita

## S-UMA-ABERTA Uma declaração aberta por vez e base local
- Onde: págs. 377 e 403
- Regras: abrir outra fecha a atual; base em pasta do programa; transmitidas em `...\IRPF2026\Transmitidas`
- Exige do MCP: sem a restrição; armazenamento local por CPF e exercício

## S-GRAVAR-ENTREGA Gravação da declaração para entrega (arquivo .DEC)
- Onde: págs. 382 e 419; ação GravarEntregaAction; classe GravadorTXT (gravarDeclaracao, montaNomeArquivoTXT)
- Regras: só sem erros impeditivos; nome do arquivo `CPF-IRPF-<A|E|S>-2026-2025-<ORIGI|RETIF>.DEC` (padrão do FAQ para 2025, inferido para 2026); pode ir para mídia removível via cópia "para entrega"
- Exige do MCP: `gerar_dbk` com o layout `LayoutDadosDIRPF2026.xml` e o nome padrão

## S-TRANSMISSAO Transmissão (Receitanet incorporado)
- Onde: págs. 395, 420; atalhos Ctrl+Shift+B (com certificado) e Ctrl+Shift+E (sem certificado); pacotes `serpro.receitanet`, `formatosexternos.transmissao` (RecnetAdaptor), `serpro.hash`, `nuvem.util.certificadodigital`
- Regras: única forma é a Internet; com ou sem certificado digital; recibo gravado na pasta Transmitidas; prazo até 23h59min59s de 29/05/2026
- Exige do MCP: impossível e vedado reimplementar (protocolo, assinatura e hash da RFB); alternativa: `gerar_dbk` + `instruir_transmissao` (passo a passo: abrir o PGD 2026, restaurar ou importar, verificar pendências, Entregar Declaração, guardar recibo)

## S-RECIBO Recibo de entrega e número do recibo
- Onde: págs. 383, 403, 405; layout registros HR, DR, R9, HC, RC, NC, VC, MC, TC; relatório relRecibo
- Regras: recibo de 12 dígitos usado para retificar e como segurança na declaração seguinte; ausência do recibo de 2025 não impede a entrega
- Exige do MCP: `registrar_recibo` (o usuário informa o número ou aponta o arquivo .REC para leitura); validação do formato

## S-NOTIFICACAO-MAED Notificação de lançamento da multa por atraso emitida pelo PGD
- Onde: págs. 32, 353; layout registro NC (notificação de multa: delegado, unidade, vencimento, meses); relatórios relNotificacao*
- Exige do MCP: cálculo da multa; a notificação oficial só existe após a entrega no PGD

## S-VALIDADOR Dados do validador e mensagens pós-recepção
- Onde: layout registros VC (pendência, quantidade de retificadoras, débito, saldo de restituição, Darf) e MC (mensagem)
- Regras: informações devolvidas na recepção da declaração (inferido pelos nomes)
- Exige do MCP: não se aplica (gerado pela RFB)

## S-CALAMIDADE Contribuintes de municípios em calamidade (RS 2024)
- Onde: tabela `municipiosCalamidade.xml` (399 municípios do RS); acessor EmCalamidade no modelo (estrutura-pacotes)
- Regras: o programa usa a tabela para regras e prazos específicos (a Ajuda 2026 não detalha; inferido)
- Exige do MCP: marcação pelo município do endereço e alerta (P2)

---

## Serviços em nuvem (irpf-servicos-nuvem.jar)

## S-NUVEM-PREPREENCHIDA Obter pré-preenchida
- Onde: serviço `obterPrePreenchida` do barramento
- Exige do MCP: impossível (autenticado); alternativa em M-IMP-PREPREENCHIDA

## S-NUVEM-CARNELEAO Importar Carnê-Leão Web (gov.br ou código de acesso)
- Onde: serviços `importarCarneLeaoComLoginGovBr`, `importarCarneLeaoComCodigoAcesso`; classes CarneLeao, Dados, Registro01 a Registro04, RegistroIR
- Exige do MCP: impossível baixar; leitor do arquivo do Carnê-Leão Web se o usuário o obtiver (formato de registros 01 a 04 e IR, inferido)

## S-NUVEM-DECONLINE Salvar e recuperar declaração on-line
- Onde: serviços `salvarDecOnline`, `recuperarDecOnline`; GravadorTXT.criarArquivoPersistenciaOnline
- Exige do MCP: impossível; alternativa local

## S-NUVEM-DARF Emissão de Darf em PDF pelo serviço (quota, ECA, Idoso, MAED, MAED Espólio)
- Onde: serviços `obterPdfDarfQuota`, `obterPdfDarfECA`, `obterPdfDarfIdoso`, `obterPdfDarfMaed`, `obterPdfDarfMaedEspolio`; classes RetornoDarf, RetornoDarfAuxilio
- Exige do MCP: impossível obter o Darf oficial; alternativa: dados calculados e orientação Sicalc/e-CAC/PGD

## S-NUVEM-MUNICIPIOS Atualização da tabela de municípios
- Onde: serviço `obterTodosMunicipios`; listener TabelasAtualizadasListener
- Exige do MCP: tabela local `municipios.json` versionada; P2 para atualização manual

## S-NUVEM-VENC-DFE Data de vencimento da Declaração Final de Espólio
- Onde: serviço `obterDataVencimentoDFE`
- Regras: prazo da DFE depende da data da decisão/trânsito (nota 06, E-ESP-PRAZO)
- Exige do MCP: cálculo local da data limite pelas regras da Ajuda

## S-NUVEM-CAPTCHA-TOKEN Captcha, token de acesso e certificado digital
- Onde: classes Captcha, UsuarioLogado, TokenUtil; tela PainelCaptchaAb
- Exige do MCP: não se aplica

---

## Arquivo da declaração (LayoutDadosDIRPF2026.xml: 94 tipos de registro, 1.850 campos)

## S-ARQ-GERAL Estrutura do arquivo de declaração
- Onde: `LayoutDadosDIRPF2026.xml`; registros IR (header, 160 campos: sistema, exercício, ano-base, código Receitanet, indicador de retificadora, CPF, tipo de NI, versão etc.) e T9 (trailer com quantidades por tipo de registro, QT_R16 em diante); campos com nome, observação, formato (C, N etc.) e tamanho
- Exige do MCP: `gerar_dbk` e leitor do mesmo layout (`importar_declaracao_anterior` usa o layout de 2025)

## S-ARQ-REG-IDENT Registro 16 (identificação do contribuinte)
- Campos (início): NR_REG, NR_CPF, NM_NOME, TIP_LOGRA, NM_LOGRA, NR_NUMERO, NM_COMPLEM, NM_BAIRRO, NR_CEP (65 campos)
- Exige do MCP: mapeamento a partir de F-IDENT

## S-ARQ-REG-TOTAIS Registros 17, 18, 19 e 20 (totais, modelo, imposto pago e resumo)
- Campos (início): 17 impostos e totais (VR_IMPCOMP, VR_ISENTOS, VR_EXCLUSIVOS, VR_TOTAL13, VR_IRFONTELEI11033); 18 cálculo do simplificado (VR_RENDTRIB, VR_DESCSIMP, VR_BASECALC, VR_IMPDEVIDO); 19 imposto pago e livro caixa (VR_IMPEXT, VR_CARNELEAO_TIT, VR_LIVCAIX_TIT); 20 resumo completo (VR_RENDJUR, VR_RENDPFEXT, VR_RESAR, VR_TOTTRIB, limites Funpresp) (inferido pelos nomes)
- Exige do MCP: preenchidos pelo motor de cálculo

## S-ARQ-REG-RENDIMENTOS Registros 21, 32, 22, 49, 80, 81 (rendimentos PJ, PF/Exterior e exigibilidade suspensa)
- Campos (início): 21 PJ titular (NR_PAGADOR, NM_PAGADOR, VR_RENDTO, VR_CONTRIB, VR_DECTERC, VR_IMPOSTO, DT_COMUNICACAO_SAIDA); 32 PJ dependentes (CPF_BENEF); 22 PF/Exterior mensal (E_DEPENDENTE, NR_CPF_DEPEN, NR_MES, VR_RENDTO, VR_ALUGUEIS, VR_OUTROS, VR_EXTER); 49 pagadores PF por mês (CPF titular do pagamento e beneficiário); 80 e 81 exigibilidade suspensa titular e dependentes (VR_DEP_JUDICIAL)
- Exige do MCP: mapeamento das fichas F-RTPJ, F-RTPF, F-SUSP

## S-ARQ-REG-ISENTOS-EXCL Registros 23, 24, 31, 33, 82 e 83 a 99 (isentos, exclusivos e detalhes)
- Campos: 23 isentos por código (NR_COD_ISENTO, VR_VALOR); 24 exclusivos por código; 31, 33, 82, 93 a 99 detalhes com pagadora e beneficiário (lucros, indenizações, IRRF anos anteriores, JCP, PLR, outros, poupança, aplicações); 83 médicos residentes; 84 Voluntários da Copa; 85 meação e dissolução; 86 ganho com ações; 87 ganho com ouro; 88 parcela isenta de aposentadoria (com NR_CHAVE_BEM); 89 sócio de microempresa
- Exige do MCP: um registro de detalhe por lançamento; registro 23/24 de totais por código

## S-ARQ-REG-PESSOAS Registros 25, 35, 29 (dependentes, alimentandos, cônjuge)
- Campos (início): 25 dependentes (NR_CHAVE, CD_DEPEND, NM_DEPEND, DT_NASCIM, NI_DEPEND, IN_SAIDA, NR_NITPISPASEP); 35 alimentandos (INDICADOR_RESIDENCIA, NM_NOME, DT_NASCIM, NI_ALIMENTANDO, NR_CPF_VINCULADO, IN_TIPO_PROCESSO); 29 informações do cônjuge (NR_CONJ, VR_BASE, VR_IMPOSTO, VR_ISENTO, VR_EXCLUSIVO, VR_RENDPJ_EXIB_SUSP, VR_TOTALCONJ)
- Exige do MCP: mapeamento; o registro 29 indica um quadro "Informações do Cônjuge" com totais do cônjuge (base, imposto, isentos, exclusivos, exigibilidade suspensa) que a Ajuda 2026 não descreve (lacuna, inferido)

## S-ARQ-REG-PAGAMENTOS-DOACOES Registros 26, 34, 46, 48, 90, 91, 92
- Campos: 26 pagamentos (CD_PAGTO, NR_CHAVE_DEPEND, NR_BENEF, NM_BENEF, NR_NIT_EMP_DOM, VR_PAGTO, VR_REDUC); 34 doações a partidos (NR_PARTIDO, NM_PARTIDO, VR_DOACAO); 46 e 48 pensão alimentícia do RRA por alimentando (titular e dependentes); 90 doações efetuadas (CD_DOACAO, VR_PARC_NAO_DEDUT, IN_TIPO_CPF_CNPJ); 91 e 92 doações diretamente na declaração ECA e Idoso (IN_TIPO_FUNDO, SG_UF, NOME_MUNICIPIO, VR_DOACAO, NR_CNPJ_FUNDO)
- Exige do MCP: mapeamento das fichas F-PAG, F-PARTIDOS, F-DOA, F-DDD, F-RRA

## S-ARQ-REG-BENS-DIVIDAS Registros 27, 36, 37, 28
- Campos: 27 bens (CD_BEM, IN_EXTERIOR, CD_PAIS, TX_BEM, VR_ANTER, VR_ATUAL e mais 52 campos condicionais); 36 vínculo bem x CPF/CNPJ (NR_CHAVE_BEM, CD_GRUPO_BEM, CD_BEM); 37 aplicações e lucros no exterior por bem (VR_GANHO_PREJUIZO, VR_IMPOSTO_DEVIDO, VR_IMPOSTO_PAGO_EXTERIOR_BRASIL, VR_BASE_CALCULO); 28 dívidas (CD_DIV, TX_DIV, VR_ANTER, VR_ATUAL, VR_PAGAMENTOANUAL)
- Exige do MCP: mapeamento de F-BENS, F-BENS-ESP, F-DIV; cálculo da Lei 14.754 por bem

## S-ARQ-REG-ESPOLIO-SAIDA Registros 30, 38, 58, 59, 39
- Campos: 30 espólio em ajuste (NR_INVENT, NM_INVENT, IN_SOBREPARTILHA); 38 final de espólio (NR_ANOOBITO, inventariante, sobrepartilha e status); 58 herdeiros (NR_CHAVE_HERDEIRO, NM_NOME, NR_CPF_CNPJ); 59 percentual por bem e herdeiro (NR_CHAVE_BEM, NR_CHAVE_HERDEIRO, VR_PERCENTUAL); 39 saída (procurador, DT_NAORESIDENTE, DT_RESIDENTE, CD_NOVO_PAIS_RESIDENCIA)
- Exige do MCP: mapeamento de F-ESPOLIO, F-DFE-*, F-SAIDA

## S-ARQ-REG-RRA Registros 45 e 47
- Campos: 45 RRA titular (NR_PAGADOR, NM_PAGADOR, VR_RENDTO, VR_CONTRIB, VR_PENSAO, VR_IMPOSTO e 13 campos mais); 47 RRA dependentes (CPF_BENEF)
- Exige do MCP: mapeamento de F-RRA

## S-ARQ-REG-RV Registros 40, 41, 42, 43
- Campos: 40 renda variável mensal por mercado (GC_COMUM_MVISTA_ACOES, GC_COMUM_MVISTA_OURO, GC_COMUM_MOPC_* e day-trade, 54 campos); 41 totais anuais comuns/day-trade; 42 consolidação mensal; 43 totais anuais FII/Fiagro
- Exige do MCP: lista exata de linhas de mercado da grade de Renda Variável (D-RV-TIPOS) a extrair destes nomes de campo

## S-ARQ-REG-AR Registros 50 a 57
- Campos: 50 imóvel explorado (NM_IMOVEL, NM_LOCAL, QT_AREA, PC_PARTIC, CD_EXPLOR); 51 receitas e despesas mensais; 52 apuração (VR_RECTOTAL, VR_DESPTOTAL, VR_PREJEXERCANT, VR_OPCAO); 53 rebanho (CD_ESPEC, QT_INIC, QT_COMPRA, QT_NASCIM, QT_PERDA, QT_VENDA); 54 bens da AR; 55 dívidas da AR; 56 exterior por país (RECBRUTA, DESPCUSTEIO, RESORIGINAL, RESDOLAR); 57 participantes do imóvel
- Exige do MCP: mapeamento de D-AR-*

## S-ARQ-REG-GCAP Registros 60 a 78
- Campos: 60 identificação do demonstrativo e transportes (94 campos); 62 bens móveis; 63 participações societárias; 64 operações em moeda estrangeira; 65 adquirentes; 66 e 67 reduções e parcelas; 68 a 72 apuração, cálculo e parcelas; 73 a 77 moeda estrangeira em espécie e consolidação; 78 transportes para a declaração (VR_BENSISENTO, VR_BENSIMPOSTO, VR_BENSEXCLUSIVO, VR_ESPIMPOSTO, VR_ESPEXCLUSIVO)
- Exige do MCP: preservação integral dos registros importados do GCAP (o AutoIR não recalcula o demonstrativo importado)

## S-ARQ-REG-RECIBO Registros FR, HR, DR, R9, HC, RC, NC, VC, MC, TC
- Campos: FR (nome da declaração, CPF, data e hora de entrega, meio, tipo, situação); HR/DR/R9 recibo (DR com dados do contribuinte; R9 com NR_HASH); HC/RC/TC complemento do recibo (data e hora de recepção, SIGNET); NC notificação de multa; VC dados do validador; MC mensagens
- Exige do MCP: só leitura (registrar_recibo); nunca gerar (produzidos pela RFB)

## S-ARQ-INFORMES Arquivos de informe (XML) e mapeamentos de importação
- Onde: `informe_fontes_pagadoras.xsd`, `informe_planos_saude.xsd`, `informe_tipos.xsd`, `mapeamentoXml.xml`, `mapeamentoTxt.xml`, `mapeamentoXmlGCAP.xml`
- Exige do MCP: validação de XML contra os xsd públicos e mapeamento campo a campo para as fichas
