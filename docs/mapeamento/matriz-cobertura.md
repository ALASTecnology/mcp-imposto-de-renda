# Matriz de cobertura: PGD IRPF 2026 x AutoIR

Uma linha por item do [inventário de funções](funcoes-pgd-2026.md). Colunas: ID estável, função do PGD, ferramentas MCP propostas (nomes em snake_case, pt-BR), módulo do core (`dbk`, `model`, `calc`, `validate`, `tabelas`, `importacao`; "nenhum" quando só a camada MCP responde), prioridade e observação.

Prioridades: **P0** essencial para entregar uma declaração de ajuste anual típica (assalariado, autônomo, investidor comum, com dependentes, deduções e bens); **P1** necessário para casos frequentes ou tipos especiais (espólio, saída, atividade rural, renda variável, importações); **P2** conveniência, casos raros ou funções sem efeito na declaração.

## O que é impossível fora do programa oficial

| Função | Por que é impossível | Alternativa no AutoIR |
|---|---|---|
| Transmissão (com ou sem certificado digital) | O Receitanet incorporado ao PGD usa protocolo, envelope, hash e assinatura próprios da RFB; reimplementar exigiria engenharia reversa do programa, vedada pelas regras do projeto, e a RFB só aceita a entrega pelo PGD ou pelo Meu Imposto de Renda. | `gerar_dbk` grava o arquivo no layout 2026; `instruir_transmissao` dá o passo a passo: instalar ou atualizar o PGD 2026, abrir ou restaurar a declaração, rodar Verificar Pendências (F5), Entregar Declaração, guardar e imprimir o recibo; depois `registrar_recibo`. |
| Assinatura e certificado digital | Credenciais pessoais do contribuinte, usadas só pelo PGD ou e-CAC. | Orientar o uso do certificado no próprio PGD. |
| Login gov.br, pré-preenchida, Carnê-Leão Web, salvar e recuperar on-line | Serviços autenticados (Ouro ou Prata) da RFB; o AutoIR é um servidor 100% local e não guarda credenciais. | `orientar_servico_externo` explica como baixar ou exportar o arquivo; `importar_pre_preenchida` e `importar_carne_leao` leem o arquivo trazido pelo usuário. |
| Darf oficial (número do documento e código de barras), Darf da notificação de multa | Emitidos pelo PGD, pelo serviço da RFB ou pelo Sicalc a partir de dados oficiais. | `gerar_darf` calcula código, período, vencimento, principal, multa e juros e instrui a emissão no PGD, e-CAC ou Sicalc. |
| Recibo de entrega, notificação de lançamento da multa, dados do validador | Gerados pela RFB na recepção. | `registrar_recibo` guarda o número informado pelo usuário para retificação e para o ano seguinte. |
| Inclusão ou alteração de débito automático após a entrega, extrato, consulta de débitos | Serviços do e-CAC (Meu Imposto de Renda). | `orientar_servico_externo` com o caminho no e-CAC e prazos (dia 14 de cada mês). |
| Atualização automática do PGD | Distribuição do programa oficial. | `verificar_versao_tabelas` e aviso para atualizar o PGD antes de transmitir. |

## Matriz

| ID | Função do PGD | Ferramenta MCP | Módulo | Prioridade | Status | Observação |
|---|---|---|---|---|---|---|
| M-MENU-DECLARACAO | Menu Declaração | `criar_declaracao`, `abrir_declaracao`, `excluir_declaracao`, `criar_retificadora` | model | P0 | implementada (`abrir_declaracao`, `criar_declaracao`, `criar_retificadora`, `excluir_declaracao`) | Itens detalhados em M-DECL-*. |
| M-MENU-IMPORTACOES | Menu Importações | `importar_carne_leao`, `importar_livro_caixa_rural`, `importar_gcap`, `importar_informe_rendimentos`, `importar_informe_plano_saude` | importacao | P1 | parcial (`abrir_declaracao`, `definir_receitas_despesas_rurais`, `definir_rendimentos_pf_exterior`, `importar_informe_plano_saude`, `importar_informe_rendimentos`, `orientar_servico_externo`) |  |
| M-MENU-FICHAS | Menu Fichas e navegação | `listar_fichas` | model | P1 | implementada (`listar_fichas`) | Navegação substituída por consulta de fichas aplicáveis. |
| M-MENU-FERRAMENTAS | Menu Ferramentas | `gravar_copia_seguranca`, `restaurar_copia_seguranca` | model | P1 | implementada (`gravar_copia_seguranca`, `listar_copias_seguranca`, `restaurar_copia_seguranca`) | Calculadora e preferências de UI não têm equivalente. |
| M-MENU-AJUDA | Menu Ajuda | `obter_ajuda` | tabelas | P2 | pendente | Conteúdo de ajuda como dados versionados. |
| M-TOOLBAR | Barra de ferramentas | não se aplica | nenhum | P2 | não se aplica | Atalhos visuais; as ações estão cobertas pelas ferramentas de ciclo de vida. |
| M-RODAPE-COMPARATIVO | Painel de imposto e comparativo no rodapé | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Modelo `ambos` devolve os dois saldos e a recomendação. |
| M-INICIAL | Tela "O que você deseja fazer?" | `criar_declaracao`, `listar_declaracoes` | model | P0 | parcial (`criar_declaracao`, `listar_arquivos`) |  |
| M-INICIAL-NOVA | Aba "Nova" (tela "O que você deseja fazer?") | `criar_declaracao`, `importar_declaracao_anterior`, `importar_pre_preenchida` | model | P0 | parcial (`abrir_declaracao`, `converter_dbk_para_modelo`, `criar_declaracao`, `orientar_servico_externo`) | Modo pré-preenchida depende de arquivo obtido pelo usuário (ver M-IMP-PREPREENCHIDA). |
| M-INICIAL-EMPREENCH | Aba "Em Preenchimento" | `listar_declaracoes`, `abrir_declaracao` | model | P1 | parcial (`abrir_declaracao`, `listar_arquivos`) |  |
| M-INICIAL-TRANSMITIDAS | Aba "Transmitidas" | `listar_declaracoes`, `registrar_recibo`, `criar_retificadora` | model | P1 | parcial (`criar_retificadora`, `listar_arquivos`) | Estado de transmitida vem do recibo informado. |
| M-INICIAL-BOASVINDAS | Aba "Boas-vindas", links úteis e "Entrar com gov.br" | `obter_ajuda` | tabelas | P2 | pendente | Botão gov.br: IMPOSSÍVEL fora do PGD: exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho. Alternativa: `orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário. |
| M-DECL-NOVA | Declaração > Nova | `criar_declaracao` | model | P0 | implementada (`criar_declaracao`) |  |
| M-DECL-ABRIR | Declaração > Abrir | `abrir_declaracao` | model | P0 | implementada (`abrir_declaracao`) | Sem a restrição de uma declaração aberta por vez. |
| M-DECL-FECHAR | Declaração > Fechar | não se aplica | model | P2 | não se aplica | Persistência imediata dispensa fechar. |
| M-DECL-EXCLUIR | Declaração > Excluir | `excluir_declaracao` | model | P1 | implementada (`excluir_declaracao`) | Exige confirmação explícita. |
| M-DECL-RETIFICAR | Declaração > Retificar | `criar_retificadora` | model | P1 | implementada (`criar_retificadora`) |  |
| M-DECL-PENDENCIAS | Declaração > Verificar Pendências | `listar_pendencias` | validate | P0 | implementada (`validar_declaracao`) | Catálogo de mensagens próprio, com severidade erro ou aviso. |
| M-DECL-ENTREGAR | Declaração > Entregar Declaração | `gerar_dbk`, `listar_pendencias`, `instruir_transmissao` | dbk | P0 | implementada (`converter_modelo_para_dbk`, `instruir_transmissao`, `validar_declaracao`, `verificar_integridade_arquivo`) | IMPOSSÍVEL fora do PGD: a transmissão usa o Receitanet incorporado, com protocolo, hash, envelope e certificado da RFB, que não podem ser reimplementados nem copiados. Alternativa: `gerar_dbk` grava o arquivo e `instruir_transmissao` orienta abrir no PGD 2026, verificar pendências e entregar; depois `registrar_recibo`. |
| M-DECL-SALVAR-ONLINE | Declaração > Salvar On-line (F6) | `gravar_copia_seguranca`, `orientar_servico_externo` | model | P2 | implementada (`gravar_copia_seguranca`, `orientar_servico_externo`) | IMPOSSÍVEL fora do PGD: exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho. Alternativa: `orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário. |
| M-DECL-RECUPERAR-ONLINE | Declaração > Recuperar On-line (F7) | `restaurar_copia_seguranca`, `orientar_servico_externo` | model | P2 | implementada (`listar_copias_seguranca`, `orientar_servico_externo`, `restaurar_copia_seguranca`) | IMPOSSÍVEL fora do PGD: exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho. Alternativa: `orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário. |
| M-DECL-SAIR | Declaração > Sair do Programa | não se aplica | nenhum | P2 | não se aplica | Encerramento de UI. |
| M-DECL-CONVERTER | Converter declaração (inferido) | `definir_identificacao` | model | P2 | implementada (`definir_identificacao`) | Função inferida; confirmar no programa. |
| M-IMPR-DECLARACAO | Imprimir Declaração | `gerar_relatorio_declaracao` | model | P1 | parcial (`gerar_relatorio_declaracao`) | Layout próprio; renderização em PDF fica na camada MCP ou em módulo de relatórios a criar. |
| M-IMPR-REND-PF | Imprimir Rendimentos Recebidos de PF | `gerar_relatorio_declaracao` | model | P2 | parcial (`gerar_relatorio_declaracao`) | Parte `rendimentos_pf`. |
| M-IMPR-RECIBO | Imprimir Recibo de Entrega | `registrar_recibo`, `instruir_transmissao` | importacao | P1 | parcial (`instruir_transmissao`) | IMPOSSÍVEL fora do PGD: o recibo é produzido pela RFB na recepção. Alternativa: imprimir no PGD e informar o número com `registrar_recibo`. |
| M-IMPR-DARF | Imprimir Darf do IRPF | `gerar_darf`, `simular_quotas` | calc | P0 | implementada (`calcular_quotas`, `gerar_darf`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| M-IMPR-DARF-MAED | Imprimir Darf de Multa por Atraso na Entrega | `calcular_multa_atraso`, `gerar_darf` | calc | P1 | implementada (`calcular_multa_atraso`, `gerar_darf`) | IMPOSSÍVEL fora do PGD: o Darf da multa decorre da notificação de lançamento emitida pelo PGD na entrega. Alternativa: calcular o valor e orientar a emissão pelo PGD ou e-CAC. |
| M-IMPR-DARF-ECA | Imprimir Darf, Doações Diretamente na Declaração, ECA | `gerar_darf` | calc | P1 | implementada (`gerar_darf`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| M-IMPR-DARF-IDOSO | Imprimir Darf, Doações Diretamente na Declaração, Pessoa Idosa | `gerar_darf` | calc | P1 | implementada (`gerar_darf`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| M-IMPR-RELACAO | Imprimir Relação de Declarações | `listar_declaracoes` | model | P2 | parcial (`listar_arquivos`) |  |
| M-IMPR-COMUNICACAO-SAIDA | Imprimir Comunicação à Fonte Pagadora de Saída do País | `gerar_comunicacao_saida` | model | P1 | implementada (`gerar_comunicacao_saida`) |  |
| M-IMPR-INFORME-REND | Imprimir Informe de Rendimentos (arquivo XML da fonte) | `ler_informe` | importacao | P2 | pendente |  |
| M-IMPR-INFORME-PS | Imprimir Informe de Plano de Saúde | `ler_informe` | importacao | P2 | pendente |  |
| M-IMPR-DARF-AUXILIO | Darf de devolução do Auxílio Emergencial (inferido) | `orientar_servico_externo` | nenhum | P2 | implementada (`orientar_servico_externo`) | Fora do escopo do exercício 2026 (função herdada, inferida). |
| M-IMPR-CRITERIOS-OBRIG | Impressão de critérios de obrigatoriedade (inferido) | `verificar_obrigatoriedade` | validate | P2 | implementada (`verificar_obrigatoriedade`) | Função inferida. |
| M-IMPR-SALVAR-PDF | Visualizar e salvar em PDF | `gerar_relatorio_declaracao`, `gerar_darf` | model | P2 | parcial (`gerar_darf`, `gerar_relatorio_declaracao`) |  |
| M-IMP-ANO-ANTERIOR | Importar dados da Declaração de 2025 | `importar_declaracao_anterior` | importacao | P0 | parcial (`converter_dbk_para_modelo`) | Leitor do layout 2025; nunca apagar dados sem confirmação (o PGD apaga). |
| M-IMP-PREPREENCHIDA | Importar Declaração Pré-Preenchida | `importar_pre_preenchida`, `orientar_servico_externo` | importacao | P1 | parcial (`abrir_declaracao`, `orientar_servico_externo`) | IMPOSSÍVEL fora do PGD: exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho. Alternativa: `orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário. |
| M-IMP-INFORME-REND | Importar Informe de Rendimentos | `importar_informe_rendimentos` | importacao | P1 | implementada (`importar_informe_rendimentos`) | Detectar duplicidade (o PGD duplica). |
| M-IMP-INFORME-PS | Importar Informe de Plano de Saúde | `importar_informe_plano_saude` | importacao | P1 | implementada (`importar_informe_plano_saude`) | Detectar duplicidade. |
| M-IMP-CARNE-LEAO | Importar Carnê-Leão 2025 | `importar_carne_leao`, `orientar_servico_externo` | importacao | P1 | parcial (`definir_rendimentos_pf_exterior`, `orientar_servico_externo`) | IMPOSSÍVEL fora do PGD: o PGD baixa o Carnê-Leão Web com gov.br ou código de acesso. Alternativa: o usuário obtém o demonstrativo no e-CAC e o AutoIR importa o arquivo; formato a mapear. |
| M-IMP-AR | Importar Atividade Rural 2025 | `importar_livro_caixa_rural` | importacao | P1 | parcial (`definir_receitas_despesas_rurais`, `orientar_servico_externo`) |  |
| M-IMP-GCAP | Importar Ganhos de Capital 2025 | `importar_gcap` | importacao | P1 | parcial (`abrir_declaracao`, `orientar_servico_externo`) | Substituição por CPF, como no PGD. |
| M-IMP-SUGESTAO | Sugestão de importação (inferido) | `listar_declaracoes`, `importar_declaracao_anterior` | importacao | P2 | parcial (`converter_dbk_para_modelo`, `listar_arquivos`) | Função inferida. |
| M-FERR-COPIA-GRAVAR | Gravar Cópia de Segurança | `gravar_copia_seguranca`, `gerar_dbk` | model | P1 | implementada (`converter_modelo_para_dbk`, `gravar_copia_seguranca`, `verificar_integridade_arquivo`) | Formato de cópia do PGD não é reproduzido; a cópia para entrega equivale a `gerar_dbk`. |
| M-FERR-COPIA-RESTAURAR | Restaurar Cópia de Segurança | `restaurar_copia_seguranca`, `importar_declaracao_anterior` | model | P1 | parcial (`converter_dbk_para_modelo`, `listar_copias_seguranca`, `restaurar_copia_seguranca`) | Restaurar cópia do PGD 2026 depende de mapear o formato (lacuna). |
| M-FERR-CALCULADORA | Calculadora | não se aplica | nenhum | P2 | não se aplica | O assistente faz os cálculos. |
| M-FERR-ATUALIZACOES | Verificar Atualizações | `verificar_versao_tabelas` | tabelas | P2 | implementada (`verificar_versao_tabelas`) | Atualização do PGD é do programa oficial; o AutoIR só versiona as próprias tabelas. |
| M-FERR-RECNOMES | Recuperação de Nomes (Ativar/Desativar, Limpar) | `buscar_nome_por_documento` | model | P2 | parcial (`buscar_nome_por_documento`) |  |
| M-FERR-LOGIN-GOVBR | Entrar e sair com gov.br | `orientar_servico_externo` | nenhum | P2 | implementada (`orientar_servico_externo`) | IMPOSSÍVEL fora do PGD: exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho. Alternativa: `orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário. |
| M-FERR-PAGINAS | Links para páginas da RFB (IRPF, DTE) e navegador | `obter_ajuda` | tabelas | P2 | pendente | Links públicos. |
| M-FERR-MEMORIA | Memória do IRPF (inferido) | não se aplica | nenhum | P2 | não se aplica | Função inferida do nome da ação; sem efeito na declaração. |
| M-FERR-LEAOZINHO | Assistente "Leãozinho" (inferido) | não se aplica | nenhum | P2 | não se aplica | Função inferida do nome da ação; sem efeito na declaração. |
| M-FERR-AVALIACAO | Avaliação do programa (inferido) | não se aplica | nenhum | P2 | não se aplica | Função inferida do nome da ação; sem efeito na declaração. |
| M-FERR-INFO-CALCULO | Constantes de cálculo (inferido, tela de testes) | `consultar_tabela` | tabelas | P2 | implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| M-AJUDA-CONTEXTUAL | Ajuda de campo (F1) e textos em azul | `obter_ajuda`, `calcular_imposto` | tabelas | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | `calcular_imposto` com `detalhar` cumpre o F1 do Resumo (procedência dos valores). |
| M-AJUDA-DOCUMENTOS | Conteúdo, Instruções, Como Fazer, Perguntas e Respostas, FAQ | `obter_ajuda` | tabelas | P2 | pendente |  |
| M-AJUDA-ATALHOS | Exibir atalhos | não se aplica | nenhum | P2 | não se aplica | Respostas textuais do MCP já são acessíveis. |
| M-AJUDA-ACESSIBILIDADE | Acessibilidade (F11) e leitura de tela | não se aplica | nenhum | P2 | não se aplica | Respostas textuais do MCP já são acessíveis. |
| M-AJUDA-SOBRE | Sobre, Novidades, Tutorial | `obter_ajuda` | tabelas | P2 | pendente |  |
| M-DEMO-ACOES | Novo, Abrir, Fechar, Excluir e Retificar Demonstrativo (inferido) | `calcular_ganho_capital`, `orientar_servico_externo` | calc | P2 | parcial (`calcular_ganho_capital`, `orientar_servico_externo`) | Função inferida; demonstrativo oficial do GCAP continua no PGD. |
| S-TIPO-AJUSTE | Declaração de Ajuste Anual | `criar_declaracao` | model | P0 | implementada (`criar_declaracao`) |  |
| S-TIPO-DFE | Declaração Final de Espólio | `criar_declaracao`, `definir_espolio` | model | P1 | implementada (`criar_declaracao`, `definir_espolio`) |  |
| S-TIPO-DSDP | Declaração de Saída Definitiva do País | `criar_declaracao`, `definir_saida_definitiva` | model | P1 | implementada (`criar_declaracao`, `definir_saida_definitiva`) |  |
| S-PROGRAMAS-RFB | Programas relacionados disponibilizados pela RFB | `orientar_servico_externo` | nenhum | P2 | implementada (`orientar_servico_externo`) | GCAP, LCAR e Carnê-Leão são programas da RFB; o AutoIR importa as exportações. |
| S-REGRA-CASADO | Contribuinte casado | `obter_ajuda`, `adicionar_dependente`, `listar_pendencias` | validate | P1 | parcial (`adicionar_dependente`, `validar_declaracao`) | Regras viram avisos (dependente comum, guarda judicial, rateio de bens comuns). |
| S-REGRA-COMPANHEIRO | Contribuinte que tenha companheiro | `obter_ajuda`, `adicionar_dependente`, `listar_pendencias` | validate | P1 | parcial (`adicionar_dependente`, `validar_declaracao`) | Regras viram avisos (dependente comum, guarda judicial, rateio de bens comuns). |
| S-REGRA-SEPARADO-FATO | Contribuinte separado de fato | `obter_ajuda`, `adicionar_dependente`, `listar_pendencias` | validate | P1 | parcial (`adicionar_dependente`, `validar_declaracao`) | Regras viram avisos (dependente comum, guarda judicial, rateio de bens comuns). |
| S-REGRA-DIVORCIADO | Contribuinte separado judicialmente, divorciado, que dissolveu união estável ou separado/divorciado por escritura pública | `obter_ajuda`, `adicionar_dependente`, `listar_pendencias` | validate | P1 | parcial (`adicionar_dependente`, `validar_declaracao`) | Regras viram avisos (dependente comum, guarda judicial, rateio de bens comuns). |
| S-REGRA-VIUVO | Contribuinte viúvo | `obter_ajuda`, `adicionar_dependente`, `listar_pendencias` | validate | P1 | parcial (`adicionar_dependente`, `validar_declaracao`) | Regras viram avisos (dependente comum, guarda judicial, rateio de bens comuns). |
| S-REGRA-MENOR | Contribuinte menor | `obter_ajuda`, `adicionar_dependente`, `listar_pendencias` | validate | P1 | parcial (`adicionar_dependente`, `validar_declaracao`) | Regras viram avisos (dependente comum, guarda judicial, rateio de bens comuns). |
| S-REGRA-EMANCIPADO | Contribuinte menor emancipado | `obter_ajuda`, `adicionar_dependente`, `listar_pendencias` | validate | P1 | parcial (`adicionar_dependente`, `validar_declaracao`) | Regras viram avisos (dependente comum, guarda judicial, rateio de bens comuns). |
| S-REGRA-INCAPAZ | Contribuinte incapaz | `obter_ajuda`, `adicionar_dependente`, `listar_pendencias` | validate | P1 | parcial (`adicionar_dependente`, `validar_declaracao`) | Regras viram avisos (dependente comum, guarda judicial, rateio de bens comuns). |
| S-REGRA-ESPOLIO | Declaração do espólio (inicial e intermediárias) | `definir_identificacao`, `definir_espolio` | model | P1 | implementada (`definir_espolio`, `definir_identificacao`) | Natureza 81 habilita a ficha Espólio. |
| S-REGRA-ESPOLIO-FINAL | Regras da Declaração Final de Espólio e sobrepartilha | `definir_espolio`, `definir_partilha_bem` | model | P1 | implementada (`definir_espolio`, `definir_partilha_bem`) |  |
| S-REGRA-AUSENTE-SERVICO | Contribuinte ausente no exterior a serviço do Brasil | `definir_rendimentos_pf_exterior`, `adicionar_rendimento_isento`, `converter_moeda` | calc | P2 | parcial (`adicionar_rendimento_isento`, `converter_moeda`, `definir_rendimentos_pf_exterior`) | Divisão 25% tributável e 75% isento (código 17). |
| S-REGRA-AUSENTE-OUTROS | Contribuinte ausente no exterior exceto a serviço do Brasil | `calcular_condicao_residencia` | calc | P1 | implementada (`calcular_condicao_residencia`) |  |
| S-REGRA-RESIDENTE | Contribuinte que adquiriu ou readquiriu a condição de residente | `calcular_condicao_residencia` | calc | P1 | implementada (`calcular_condicao_residencia`) |  |
| S-REGRA-DIPLOMATICO | Rendimentos de representações diplomáticas e organismos internacionais no Brasil | `obter_ajuda` | tabelas | P2 | pendente |  |
| S-REGRA-CONVERSAO | Conversão em reais de rendimentos ou pagamentos em moeda estrangeira | `converter_moeda` | tabelas | P1 | parcial (`converter_moeda`) |  |
| S-REGRA-REND-TRAB | Rendimentos do trabalho (tributáveis) | `adicionar_rendimento_pj`, `definir_rendimentos_pf_exterior`, `transferir_excedente_isencao_65` | calc | P0 | implementada (`adicionar_rendimento_pj`, `definir_rendimentos_pf_exterior`, `transferir_excedente_isencao_65`) |  |
| S-REGRA-ALUGUEIS | Rendimentos de aluguéis | `definir_rendimentos_pf_exterior`, `adicionar_rendimento_pj` | calc | P1 | implementada (`adicionar_rendimento_pj`, `definir_rendimentos_pf_exterior`) | Aluguel líquido e aluguel presumido de cessão gratuita. |
| S-REGRA-AR-RESULTADO | Resultado tributável da atividade rural | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) |  |
| S-REGRA-RRA | Rendimentos recebidos acumuladamente (regra geral) | `adicionar_rra`, `adicionar_pagamento`, `calcular_rra` | calc | P1 | parcial (`adicionar_pagamento`, `adicionar_rra`, `calcular_rra`) |  |
| S-REGRA-OUTROS-REND | Outros rendimentos tributáveis | `definir_rendimentos_pf_exterior` | model | P2 | implementada (`definir_rendimentos_pf_exterior`) |  |
| S-REGRA-NAO-RESIDENTE | Caracterização da condição de residente e de não residente | `calcular_condicao_residencia` | calc | P1 | implementada (`calcular_condicao_residencia`) |  |
| S-REGRA-OBRIG | Obrigatoriedade de apresentação da Declaração de Ajuste Anual 2026 | `verificar_obrigatoriedade` | validate | P1 | implementada (`verificar_obrigatoriedade`) |  |
| S-REGRA-REGIME | Regime de tributação (deduções legais ou desconto simplificado) | `calcular_imposto`, `definir_opcao_tributacao` | calc | P0 | parcial (`comparar_modelos`, `definir_opcao_tributacao`, `explicar_calculo`, `simular_imposto`) |  |
| S-REGRA-PREENCHIMENTO | Forma de preenchimento e pré-preenchida | `importar_pre_preenchida`, `importar_informe_rendimentos`, `importar_informe_plano_saude`, `orientar_servico_externo` | importacao | P1 | parcial (`abrir_declaracao`, `importar_informe_plano_saude`, `importar_informe_rendimentos`, `orientar_servico_externo`) | IMPOSSÍVEL fora do PGD: exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho. Alternativa: `orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário. |
| S-REGRA-PRAZO | Prazo e local de apresentação | `listar_pendencias`, `instruir_transmissao` | validate | P0 | implementada (`instruir_transmissao`, `validar_declaracao`) | Alerta de prazo de 29/05/2026. |
| S-REGRA-MULTA-ATRASO | Multa por atraso na entrega (MAED) | `calcular_multa_atraso` | calc | P1 | implementada (`calcular_multa_atraso`) |  |
| S-REGRA-RETIF | Retificação da declaração | `criar_retificadora`, `listar_pendencias` | validate | P1 | implementada (`criar_retificadora`, `validar_declaracao`) | Trava de troca de regime após o prazo. |
| S-REGRA-APOS-PRAZO | Locais de apresentação após o prazo | `instruir_transmissao` | nenhum | P2 | implementada (`instruir_transmissao`) |  |
| S-REGRA-EXERC-ANT | Declaração de exercícios anteriores | `obter_ajuda` | nenhum | P2 | pendente | Fora do escopo (outros exercícios usam o PGD do ano). |
| F-INICIO | Aba Início | `listar_fichas` | model | P2 | implementada (`listar_fichas`) |  |
| F-IDENT | Identificação do Contribuinte (visão geral) | `definir_identificacao`, `validar_documento` | model | P0 | parcial (`definir_identificacao`, `validar_documento`) |  |
| F-IDENT-TIPO | Que Tipo de Declaração Você Deseja Fazer? | `definir_identificacao`, `validar_documento` | model | P0 | parcial (`definir_identificacao`, `validar_documento`) |  |
| F-IDENT-NOME | Nome | `definir_identificacao`, `validar_documento` | validate | P0 | parcial (`definir_identificacao`, `validar_documento`) | Regras de partes e caracteres repetidos. |
| F-IDENT-NASC | Data de Nascimento | `definir_identificacao`, `validar_documento` | model | P0 | parcial (`definir_identificacao`, `validar_documento`) |  |
| F-IDENT-DOENCA | Há declarante ou dependente com doença grave ou deficiência física ou mental? | `definir_identificacao`, `validar_documento` | model | P0 | parcial (`definir_identificacao`, `validar_documento`) |  |
| F-IDENT-RACA | Raça/Cor | `definir_identificacao`, `validar_documento` | model | P0 | parcial (`definir_identificacao`, `validar_documento`) |  |
| F-IDENT-ALTCAD | Houve alteração de dados cadastrais? | `definir_identificacao`, `validar_documento` | model | P0 | parcial (`definir_identificacao`, `validar_documento`) |  |
| F-IDENT-CONJ | Possui cônjuge ou companheiro(a)? | `definir_identificacao`, `validar_documento` | model | P0 | parcial (`definir_identificacao`, `validar_documento`) |  |
| F-IDENT-RETORNO | Era residente no exterior e passou a ser residente no país em 2025? | `definir_identificacao`, `validar_documento` | model | P0 | parcial (`definir_identificacao`, `validar_documento`) |  |
| F-IDENT-END-BR | Endereço - Brasil | `definir_identificacao`, `validar_documento`, `consultar_tabela` | tabelas | P0 | parcial (`buscar_codigo`, `consultar_parametros`, `definir_identificacao`, `listar_tabela`, `validar_documento`) | Consulta CEP dos Correios: link público via `orientar_servico_externo`. |
| F-IDENT-END-EXT | Endereço - Exterior | `definir_identificacao`, `validar_documento`, `consultar_tabela` | tabelas | P0 | parcial (`buscar_codigo`, `consultar_parametros`, `definir_identificacao`, `listar_tabela`, `validar_documento`) | Consulta CEP dos Correios: link público via `orientar_servico_externo`. |
| F-IDENT-OCUP | Ocupação Principal | `definir_identificacao`, `consultar_tabela` | tabelas | P0 | implementada (`buscar_codigo`, `consultar_parametros`, `definir_identificacao`, `listar_tabela`) |  |
| F-DEP | Dependentes | `adicionar_dependente`, `editar_lancamento`, `remover_lancamento` | model | P0 | implementada (`adicionar_dependente`, `editar_lancamento`, `remover_lancamento`) | Exclusão em cascata igual à do PGD com aviso das fichas órfãs. |
| F-ALIM | Alimentandos | `adicionar_alimentando`, `editar_lancamento`, `remover_lancamento` | model | P1 | implementada (`adicionar_alimentando`, `editar_lancamento`, `remover_lancamento`) |  |
| F-RTPJ-TIT | Rendimentos Tributáveis Recebidos de PJ pelo Titular | `adicionar_rendimento_pj`, `importar_informe_rendimentos` | model | P0 | implementada (`adicionar_rendimento_pj`, `importar_informe_rendimentos`) |  |
| F-RTPJ-DEP | Rendimentos Tributáveis Recebidos de PJ pelos Dependentes | `adicionar_rendimento_pj`, `importar_informe_rendimentos` | model | P0 | implementada (`adicionar_rendimento_pj`, `importar_informe_rendimentos`) |  |
| F-RTPF | Rendimentos Tributáveis Recebidos de Pessoa Física e do Exterior (visão geral) | `definir_rendimentos_pf_exterior` | model | P0 | implementada (`definir_rendimentos_pf_exterior`) |  |
| F-RTPF-IMPCL | Importação do Carnê-leão | `importar_carne_leao` | importacao | P1 | parcial (`definir_rendimentos_pf_exterior`, `orientar_servico_externo`) | Ver M-IMP-CARNE-LEAO. |
| F-RTPF-TNA | Aba "Rendimentos do Trabalho Não Assalariado" (titular e dependentes) | `definir_rendimentos_pf_exterior` | model | P0 | implementada (`definir_rendimentos_pf_exterior`) |  |
| F-RTPF-NIT | NIT/PIS/PASEP | `definir_rendimentos_pf_exterior` | model | P0 | implementada (`definir_rendimentos_pf_exterior`) |  |
| F-RTPF-ALUG | Coluna Aluguéis, inclusive por temporada | `definir_rendimentos_pf_exterior` | model | P0 | implementada (`definir_rendimentos_pf_exterior`) |  |
| F-RTPF-OUTROS | Coluna Outros | `definir_rendimentos_pf_exterior` | model | P0 | implementada (`definir_rendimentos_pf_exterior`) |  |
| F-RTPF-EXT | Coluna Exterior | `definir_rendimentos_pf_exterior`, `converter_moeda` | calc | P1 | parcial (`converter_moeda`, `definir_rendimentos_pf_exterior`) |  |
| F-RTPF-PREV | Deduções - Previdência Oficial | `definir_rendimentos_pf_exterior` | model | P0 | implementada (`definir_rendimentos_pf_exterior`) |  |
| F-RTPF-QTDDEP | Deduções - Quantidade de Dependentes | `definir_rendimentos_pf_exterior` | model | P2 | implementada (`definir_rendimentos_pf_exterior`) | Coluna informativa. |
| F-RTPF-PENSAO | Deduções - Pensão Alimentícia | `definir_rendimentos_pf_exterior` | model | P2 | implementada (`definir_rendimentos_pf_exterior`) | Coluna informativa. |
| F-RTPF-LIVROCAIXA | Deduções - Livro Caixa | `definir_rendimentos_pf_exterior` | calc | P1 | implementada (`definir_rendimentos_pf_exterior`) | Limite mensal e transporte de excesso até dezembro. |
| F-RTPF-DARF0190 | Carnê-Leão - Darf pago cód. 0190 | `definir_rendimentos_pf_exterior` | model | P0 | implementada (`definir_rendimentos_pf_exterior`) |  |
| F-RTPF-DEP-CPF | CPF dos Dependentes (ficha PF/Exterior, aba Dependentes) | `definir_rendimentos_pf_exterior` | model | P0 | implementada (`definir_rendimentos_pf_exterior`) |  |
| F-ISENTO | Rendimentos Isentos e Não Tributáveis (ficha) | `adicionar_rendimento_isento`, `listar_lancamentos` | model | P0 | implementada (`adicionar_rendimento_isento`, `ler_ficha`, `listar_lancamentos`) | Aba Totais = agregação por código. |
| F-ISENTO-01 | Bolsas de estudo e de pesquisa caracterizadas como doação, exceto médico-residente ou Pronatec | `adicionar_rendimento_isento` | model | P1 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-02 | Bolsas de estudo e de pesquisa de médico-residente e servidor da rede pública de educação profissional (Pronatec) | `adicionar_rendimento_isento` | model | P1 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-03 | Capital de apólices de seguro ou pecúlio pago por morte do segurado, prêmio de seguro restituído e pecúlio de previdência privada por morte ou invalidez permanente | `adicionar_rendimento_isento` | model | P1 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-04 | Indenizações por rescisão de contrato de trabalho, inclusive PDV, e por acidente de trabalho; e FGTS | `adicionar_rendimento_isento` | model | P0 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-05 | Ganho de capital em alienação de bens de pequeno valor (até R$ 20.000,00 ações em mercado de balcão; R$ 35.000,00 demais casos, por mês) | `importar_gcap`, `adicionar_rendimento_isento` | importacao | P1 | parcial (`abrir_declaracao`, `adicionar_rendimento_isento`, `orientar_servico_externo`) | Campo duplo: valor manual e valor transportado do GCAP. |
| F-ISENTO-06 | Ganho de capital na alienação do único imóvel por até R$ 440.000,00, sem outra alienação de imóvel nos últimos 5 anos | `importar_gcap`, `adicionar_rendimento_isento` | importacao | P1 | parcial (`abrir_declaracao`, `adicionar_rendimento_isento`, `orientar_servico_externo`) | Campo duplo: valor manual e valor transportado do GCAP. |
| F-ISENTO-07 | Ganho de capital na venda de imóveis residenciais para aquisição em 180 dias de imóveis residenciais no Brasil e redução sobre o ganho de capital | `importar_gcap`, `adicionar_rendimento_isento` | importacao | P1 | parcial (`abrir_declaracao`, `adicionar_rendimento_isento`, `orientar_servico_externo`) | Campo duplo: valor manual e valor transportado do GCAP. |
| F-ISENTO-08 | Ganho de capital na alienação de moeda estrangeira em espécie com total anual até US$ 5,000.00 | `adicionar_rendimento_isento`, `converter_moeda` | model | P2 | parcial (`adicionar_rendimento_isento`, `converter_moeda`) |  |
| F-ISENTO-09 | Lucros e dividendos recebidos | `adicionar_rendimento_isento` | model | P0 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-10 | Parcela isenta de proventos de aposentadoria, reserva remunerada, reforma e pensão de declarante com 65 anos ou mais | `adicionar_rendimento_isento`, `transferir_excedente_isencao_65` | calc | P0 | implementada (`adicionar_rendimento_isento`, `transferir_excedente_isencao_65`) |  |
| F-ISENTO-11 | Pensão, proventos de aposentadoria, reserva ou reforma por moléstia grave ou aposentadoria/reforma por acidente em serviço | `adicionar_rendimento_isento` | model | P0 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-12 | Rendimentos de caderneta de poupança, letras hipotecárias, LCA, LCI, CRA e CRI | `adicionar_rendimento_isento` | model | P0 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-13 | Rendimento de sócio ou titular de ME/EPP optante pelo Simples Nacional, exceto pró-labore, aluguéis e serviços prestados | `adicionar_rendimento_isento` | model | P1 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-14 | Transferências patrimoniais: doações e heranças | `adicionar_rendimento_isento` | model | P0 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-15 | Parcela não tributável correspondente à atividade rural | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Transportado do Demonstrativo da Atividade Rural. |
| F-ISENTO-16 | Imposto de anos-calendário anteriores compensado judicialmente neste ano-calendário | `adicionar_rendimento_isento` | model | P2 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-17 | 75% dos rendimentos do trabalho assalariado recebidos em moeda estrangeira por servidores de autarquias ou repartições do Governo Brasileiro no exterior | `adicionar_rendimento_isento` | model | P2 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-18 | Incorporação de reservas ao capital / Bonificações em ações | `adicionar_rendimento_isento` | model | P2 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-19 | Transferências patrimoniais: meação e dissolução da sociedade conjugal e da unidade familiar | `adicionar_rendimento_isento` | model | P1 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-20 | Ganhos líquidos em ações no mercado à vista em bolsa, alienações até R$ 20.000,00 por mês para o conjunto de ações | `adicionar_rendimento_isento` | model | P1 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-21 | Ganhos líquidos em operações com ouro ativo financeiro, alienações até R$ 20.000,00 por mês | `adicionar_rendimento_isento` | model | P1 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-22 | Recuperação de prejuízos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro) | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Transportado da Renda Variável. |
| F-ISENTO-23 | Rendimento bruto, até 90%, de transporte de carga e serviços com trator, máquina de terraplenagem, colheitadeira e assemelhados | `adicionar_rendimento_isento` | model | P2 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-24 | Rendimento bruto, até 40%, de transporte de passageiros | `adicionar_rendimento_isento` | model | P2 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-25 | Restituição do imposto sobre a renda de anos-calendário anteriores | `adicionar_rendimento_isento` | model | P1 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-27 | Juros referentes aos Rendimentos Recebidos Acumuladamente | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Transportado da ficha RRA. |
| F-ISENTO-28 | Pensão Alimentícia | `adicionar_rendimento_isento` | model | P1 | implementada (`adicionar_rendimento_isento`) |  |
| F-ISENTO-99 | Outros | `adicionar_rendimento_isento` | model | P0 | implementada (`adicionar_rendimento_isento`) |  |
| F-EXCL | Rendimentos Sujeitos à Tributação Exclusiva/Definitiva (ficha) | `adicionar_rendimento_exclusivo`, `listar_lancamentos` | model | P0 | implementada (`adicionar_rendimento_exclusivo`, `ler_ficha`, `listar_lancamentos`) |  |
| F-EXCL-01 | 13º salário | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Transportado do campo 13º da ficha Rendimentos PJ. |
| F-EXCL-02 | Ganhos de capital na alienação de bens e/ou direitos | `importar_gcap` | importacao | P1 | parcial (`abrir_declaracao`, `orientar_servico_externo`) | Transportado do GCAP. |
| F-EXCL-03 | Ganhos de capital na alienação de bens, direitos e aplicações financeiras adquiridos em moeda estrangeira | `importar_gcap` | importacao | P1 | parcial (`abrir_declaracao`, `orientar_servico_externo`) | Transportado do GCAP. |
| F-EXCL-04 | Ganhos de capital na alienação de moeda estrangeira em espécie | `importar_gcap` | importacao | P1 | parcial (`abrir_declaracao`, `orientar_servico_externo`) | Transportado do GCAP. |
| F-EXCL-05 | Ganhos líquidos em renda variável (bolsa, mercadorias, futuros, FII e Fiagro) | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Transportado da Renda Variável e FII/Fiagro. |
| F-EXCL-06 | Rendimentos de aplicações financeiras | `adicionar_rendimento_exclusivo` | model | P0 | implementada (`adicionar_rendimento_exclusivo`) |  |
| F-EXCL-07 | Rendimentos recebidos acumuladamente (titular) | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Transportado da ficha RRA (opção exclusiva). |
| F-EXCL-08 | 13º salário recebido pelos dependentes | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Transportado do campo 13º da ficha Rendimentos PJ. |
| F-EXCL-09 | Rendimentos recebidos acumuladamente pelos dependentes | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Transportado da ficha RRA (opção exclusiva). |
| F-EXCL-10 | Juros sobre capital próprio | `adicionar_rendimento_exclusivo` | model | P0 | implementada (`adicionar_rendimento_exclusivo`) |  |
| F-EXCL-11 | Participação nos lucros ou resultados da empresa (PLR) | `adicionar_rendimento_exclusivo` | model | P0 | implementada (`adicionar_rendimento_exclusivo`) |  |
| F-EXCL-12 | Aplicações Financeiras e Lucros e Dividendos no Exterior (Lei 14.754/2023) | `calcular_imposto`, `adicionar_bem` | calc | P1 | parcial (`adicionar_bem`, `comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Transportado de Bens e Direitos (Lei 14.754/2023). |
| F-EXCL-13 | Prêmios líquidos obtidos em loterias de apostas de quota fixa (Lei 14.790/2023) | `adicionar_rendimento_exclusivo` | model | P1 | implementada (`adicionar_rendimento_exclusivo`) |  |
| F-EXCL-99 | Outros | `adicionar_rendimento_exclusivo` | model | P1 | implementada (`adicionar_rendimento_exclusivo`) |  |
| F-SUSP | Rendimentos Tributáveis de PJ (Imposto com Exigibilidade Suspensa) | `adicionar_rendimento_exigibilidade_suspensa` | model | P2 | implementada (`adicionar_rendimento_exigibilidade_suspensa`) | Informativo, fora do cálculo. |
| F-SUSP-TIT | Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) - Titular | `adicionar_rendimento_exigibilidade_suspensa` | model | P2 | implementada (`adicionar_rendimento_exigibilidade_suspensa`) | Informativo, fora do cálculo. |
| F-SUSP-DEP | Rendimentos Tributáveis de PJ (Exigibilidade Suspensa) - Dependentes | `adicionar_rendimento_exigibilidade_suspensa` | model | P2 | implementada (`adicionar_rendimento_exigibilidade_suspensa`) | Informativo, fora do cálculo. |
| F-RRA | Rendimentos Recebidos Acumuladamente (ficha) | `adicionar_rra`, `calcular_rra` | calc | P1 | parcial (`adicionar_rra`, `calcular_rra`) |  |
| F-RRA-TIT | Rendimentos Tributáveis de PJ Recebidos Acumuladamente pelo Titular | `adicionar_rra`, `calcular_rra` | calc | P1 | parcial (`adicionar_rra`, `calcular_rra`) |  |
| F-RRA-DEP | Rendimentos Tributáveis de PJ Recebidos Acumuladamente pelos Dependentes | `adicionar_rra`, `calcular_rra` | calc | P1 | parcial (`adicionar_rra`, `calcular_rra`) |  |
| F-IMPPAGO | Imposto Pago/Retido (ficha) | `definir_imposto_pago`, `calcular_imposto` | model | P0 | parcial (`comparar_modelos`, `definir_imposto_pago`, `explicar_calculo`, `simular_imposto`) |  |
| F-IMPPAGO-01 | Linha 01: Imposto Complementar | `definir_imposto_pago` | model | P1 | implementada (`definir_imposto_pago`) | Só Darf 0246. |
| F-IMPPAGO-02 | Linha 02: Imposto pago no exterior pelo titular e pelos dependentes | `definir_imposto_pago`, `calcular_imposto`, `converter_moeda` | calc | P1 | parcial (`comparar_modelos`, `converter_moeda`, `definir_imposto_pago`, `explicar_calculo`, `simular_imposto`) | Limite de compensação exige dois cálculos. |
| F-IMPPAGO-03 | Linha 03: Imposto sobre a renda na fonte (Lei nº 11.033/2004) | `definir_imposto_pago` | model | P2 | implementada (`definir_imposto_pago`) |  |
| F-IMPPAGO-04 | Linha 04: Imposto retido na fonte do titular | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| F-IMPPAGO-05 | Linha 05: Imposto retido na fonte dos dependentes | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| F-IMPPAGO-06 | Linha 06: Carnê-Leão do titular | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| F-IMPPAGO-07 | Linha 07: Carnê-Leão dos dependentes | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| F-PAG | Pagamentos Efetuados (ficha) | `adicionar_pagamento`, `editar_lancamento`, `remover_lancamento` | model | P0 | implementada (`adicionar_pagamento`, `editar_lancamento`, `remover_lancamento`) |  |
| F-PAG-INSTR | Despesas com Instrução (regras comuns aos códigos 01 e 02) | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-01 | Código 01, Despesas com instrução no Brasil | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-02 | Código 02, Despesas com instrução no exterior | `adicionar_pagamento`, `converter_moeda` | model | P1 | parcial (`adicionar_pagamento`, `converter_moeda`) |  |
| F-PAG-MED | Despesas Médicas (regras comuns aos códigos 09 a 22 e 26) | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-09 | Código 09, Fonoaudiólogos no Brasil | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-10 | Código 10, Médicos no Brasil | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-11 | Código 11, Dentistas no Brasil | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-12 | Código 12, Psicólogos no Brasil | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-13 | Código 13, Fisioterapeutas no Brasil | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-14 | Código 14, Terapeutas ocupacionais no Brasil | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-15 | Código 15, Médicos no exterior | `adicionar_pagamento`, `converter_moeda` | model | P1 | parcial (`adicionar_pagamento`, `converter_moeda`) |  |
| F-PAG-16 | Código 16, Dentistas no exterior | `adicionar_pagamento`, `converter_moeda` | model | P1 | parcial (`adicionar_pagamento`, `converter_moeda`) |  |
| F-PAG-17 | Código 17, Psicólogos no exterior | `adicionar_pagamento`, `converter_moeda` | model | P1 | parcial (`adicionar_pagamento`, `converter_moeda`) |  |
| F-PAG-18 | Código 18, Fisioterapeutas no exterior | `adicionar_pagamento`, `converter_moeda` | model | P1 | parcial (`adicionar_pagamento`, `converter_moeda`) |  |
| F-PAG-19 | Código 19, Terapeutas ocupacionais no exterior | `adicionar_pagamento`, `converter_moeda` | model | P1 | parcial (`adicionar_pagamento`, `converter_moeda`) |  |
| F-PAG-20 | Código 20, Fonoaudiólogos no exterior | `adicionar_pagamento`, `converter_moeda` | model | P1 | parcial (`adicionar_pagamento`, `converter_moeda`) |  |
| F-PAG-21 | Código 21, Hospitais, clínicas e laboratórios com saúde humana no Brasil | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-22 | Código 22, Hospitais, clínicas e laboratórios com saúde humana no exterior | `adicionar_pagamento`, `converter_moeda` | model | P1 | parcial (`adicionar_pagamento`, `converter_moeda`) |  |
| F-PAG-26 | Código 26, Planos de saúde no Brasil | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-PENSAO | Pensão alimentícia judicial ou por escritura pública (regras comuns aos códigos 30, 31, 33 e 34) | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-30 | Código 30, Pensão alimentícia judicial paga a residente no Brasil | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-31 | Código 31, Pensão alimentícia judicial paga a não residente no Brasil | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-33 | Código 33, Pensão alimentícia por escritura pública (separação/divórcio) paga a residente no Brasil | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-34 | Código 34, Pensão alimentícia por escritura pública paga a não residente no Brasil | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-PREV | Previdência Complementar e Fapi (regras comuns aos códigos 36 e 37) | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-36 | Código 36, Previdência Complementar (inclusive Fapi) | `adicionar_pagamento` | model | P0 | implementada (`adicionar_pagamento`) |  |
| F-PAG-FAPI | Fapi, Fundos de Aposentadoria Programada Individual (lançado no código 36) | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-37 | Código 37, Contribuições a entidades de previdência complementar do § 15 do art. 40 da CF (Funpresp e similares) | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-60 | Código 60, Advogados (honorários de ações judiciais, exceto trabalhistas) | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-61 | Código 61, Advogados (honorários de ações judiciais trabalhistas) | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-62 | Código 62, Advogados (demais honorários) | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-66 | Código 66, Engenheiros, arquitetos e demais profissionais liberais (exceto advogados, administrador ou corretor de imóveis) | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-70 | Código 70, Aluguéis de imóveis | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-71 | Código 71, Administrador de imóvel | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-72 | Código 72, Corretor de imóveis | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-76 | Código 76, Arrendamento rural | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-99 | Código 99, Outros | `adicionar_pagamento` | model | P1 | implementada (`adicionar_pagamento`) |  |
| F-PAG-IMPPS | Botão "Importar arquivo do plano de saúde" | `importar_informe_plano_saude` | importacao | P1 | implementada (`importar_informe_plano_saude`) |  |
| F-DOA | Doações Efetuadas (ficha) | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-LIMITES | Limites das deduções de incentivo | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Limites encadeados de 6%, 7% e 1%. |
| F-DOA-40 | Código 40, Doações ao Estatuto da Criança e do Adolescente | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-41 | Código 41, Incentivo à cultura | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-42 | Código 42, Incentivo à atividade audiovisual | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-43 | Código 43, Incentivo ao desporto | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-44 | Código 44, Fundos controlados pelos Conselhos da Pessoa Idosa | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-45 | Código 45, Pronas/PCD | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-46 | Código 46, Pronon | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-47 | Código 47, Apoio direto a projetos da cadeia produtiva da reciclagem | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-80 | Código 80, Doações em espécie | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-81 | Código 81, Doações em bens e direitos | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DOA-99 | Código 99, Outras | `adicionar_doacao` | model | P1 | implementada (`adicionar_doacao`) |  |
| F-DDD | Doações Diretamente na Declaração (ficha) | `adicionar_doacao_direta_declaracao`, `gerar_darf` | calc | P1 | implementada (`adicionar_doacao_direta_declaracao`, `gerar_darf`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| F-DDD-ECA | Aba "Criança e Adolescente" | `adicionar_doacao_direta_declaracao`, `gerar_darf` | calc | P1 | implementada (`adicionar_doacao_direta_declaracao`, `gerar_darf`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| F-DDD-IDOSO | Aba "Pessoa Idosa" | `adicionar_doacao_direta_declaracao`, `gerar_darf` | calc | P1 | implementada (`adicionar_doacao_direta_declaracao`, `gerar_darf`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| F-BENS | Bens e Direitos (ficha, Declaração de Ajuste Anual) | `adicionar_bem`, `editar_lancamento`, `remover_lancamento`, `repetir_valores_bens` | model | P0 | implementada (`adicionar_bem`, `editar_lancamento`, `remover_lancamento`, `repetir_valores_bens`) |  |
| F-BENS-OBRIG | Bens e direitos que devem ser declarados e dispensa | `adicionar_bem`, `listar_pendencias`, `validar_documento` | validate | P0 | parcial (`adicionar_bem`, `validar_declaracao`, `validar_documento`) |  |
| F-BENS-DADOS | Dados do bem: campos condicionais | `adicionar_bem`, `listar_pendencias`, `validar_documento` | validate | P0 | parcial (`adicionar_bem`, `validar_declaracao`, `validar_documento`) |  |
| F-BENS-RENDASSOC | Rendimentos associados ao bem | `adicionar_rendimento_isento`, `adicionar_rendimento_exclusivo` | model | P1 | implementada (`adicionar_rendimento_exclusivo`, `adicionar_rendimento_isento`) | Vínculo bidirecional por chave do bem. |
| F-BENS-G01 | Grupo 01, Bens imóveis | `adicionar_bem`, `consultar_tabela` | model | P0 | implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| F-BENS-G02 | Grupo 02, Bens móveis | `adicionar_bem`, `consultar_tabela` | model | P0 | implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| F-BENS-G03 | Grupo 03, Participações societárias | `adicionar_bem`, `consultar_tabela` | model | P0 | implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| F-BENS-G04 | Grupo 04, Aplicações e investimentos | `adicionar_bem`, `consultar_tabela` | model | P0 | implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| F-BENS-G05 | Grupo 05, Créditos | `adicionar_bem`, `consultar_tabela` | model | P0 | implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| F-BENS-G06 | Grupo 06, Depósitos à vista e numerário | `adicionar_bem`, `consultar_tabela` | model | P0 | implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| F-BENS-G07 | Grupo 07, Fundos | `adicionar_bem`, `consultar_tabela` | model | P0 | implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| F-BENS-G08 | Grupo 08, Criptoativos | `adicionar_bem`, `consultar_tabela` | model | P0 | implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| F-BENS-G99 | Grupo 99, Outros bens e direitos | `adicionar_bem`, `consultar_tabela` | model | P0 | implementada (`adicionar_bem`, `buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| F-BENS-COMUNS | Situações individuais: bens comuns, condomínio e tipos de declaração | `listar_pendencias`, `obter_ajuda` | validate | P1 | parcial (`validar_declaracao`) |  |
| F-BENS-DATAAQ | Informações dos bens conforme a data de aquisição | `aplicar_caso_especial_bem`, `atualizar_custo_bem` | calc | P1 | parcial (`aplicar_caso_especial_bem`) |  |
| F-BENS-DFE | Bens e Direitos na Declaração Final de Espólio | `adicionar_bem`, `definir_partilha_bem` | model | P1 | implementada (`adicionar_bem`, `definir_partilha_bem`) |  |
| F-BENS-DSDP | Bens e Direitos na Declaração de Saída Definitiva | `adicionar_bem`, `repetir_valores_bens`, `converter_moeda` | model | P1 | parcial (`adicionar_bem`, `converter_moeda`, `repetir_valores_bens`) |  |
| F-BENS-ALIEN-DFE | Bens e direitos alienados no ano (Final de Espólio) | `adicionar_bem` | model | P2 | implementada (`adicionar_bem`) | Divergência do texto da Ajuda registrada. |
| F-BENS-ESP-BENFEITORIAS | Benfeitorias | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-CONSORCIO | Consórcios | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-LEASING | Leasing | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-VGBL | VGBL | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-PERMUTA | Permuta | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-IMOVEL-RURAL | Imóvel rural | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-DOACAO | Doação recebida | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-HERANCA | Herança, meação, legado ou doação (inclusive adiantamento da legítima) | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-DISSOLUCAO | Bens recebidos por dissolução da sociedade conjugal ou união estável | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-EXTERIOR | Bens e direitos situados no exterior | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-TRANSPARENCIA | Regime de Transparência Fiscal de Entidade Controlada (art. 8º da Lei 14.754/2023) | `adicionar_bem`, `calcular_imposto`, `converter_moeda` | calc | P1 | parcial (`adicionar_bem`, `comparar_modelos`, `converter_moeda`, `explicar_calculo`, `simular_imposto`) | Motor da Lei 14.754/2023 (15%, compensação de perdas, crédito do imposto estrangeiro). |
| F-BENS-ESP-DEP-NAO-REMUNERADO | Depósitos não remunerados em moeda estrangeira (conta, cartão de débito ou crédito no exterior) | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-MOEDA-ESPECIE | Moeda estrangeira mantida em espécie | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-EMPRESTIMO | Empréstimo concedido | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-APLIC-EXTERIOR | Aplicações financeiras no exterior (Lei 14.754/2023) | `adicionar_bem`, `calcular_imposto`, `converter_moeda` | calc | P1 | parcial (`adicionar_bem`, `comparar_modelos`, `converter_moeda`, `explicar_calculo`, `simular_imposto`) | Motor da Lei 14.754/2023 (15%, compensação de perdas, crédito do imposto estrangeiro). |
| F-BENS-ESP-CONTROLADAS | Participação em entidades controladas no exterior | `adicionar_bem`, `calcular_imposto`, `converter_moeda` | calc | P1 | parcial (`adicionar_bem`, `comparar_modelos`, `converter_moeda`, `explicar_calculo`, `simular_imposto`) | Motor da Lei 14.754/2023 (15%, compensação de perdas, crédito do imposto estrangeiro). |
| F-BENS-ESP-DESINCORPORADOS | Bens e direitos desincorporados do patrimônio em 2025 | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-ADQ-ALIENADOS | Bens e direitos adquiridos e alienados em 2025 | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-BENS-ESP-NOVO-RESIDENTE | Bens de quem adquiriu ou readquiriu residência no Brasil em 2025 | `aplicar_caso_especial_bem`, `adicionar_bem` | model | P1 | implementada (`adicionar_bem`, `aplicar_caso_especial_bem`) |  |
| F-DIV | Dívidas e Ônus Reais | `adicionar_divida`, `editar_lancamento`, `remover_lancamento` | model | P0 | implementada (`adicionar_divida`, `editar_lancamento`, `remover_lancamento`) |  |
| F-ESPOLIO | Espólio (Ajuste Anual com natureza de ocupação 81) | `definir_espolio` | model | P1 | implementada (`definir_espolio`) |  |
| F-PARTIDOS | Doações a Partidos Políticos e Candidatos a Cargos Eletivos | `adicionar_doacao_eleitoral` | model | P1 | implementada (`adicionar_doacao_eleitoral`) |  |
| F-CONJUGE | Informações do Cônjuge ou Companheiro (inferido) | `definir_identificacao` | model | P2 | implementada (`definir_identificacao`) | Ficha inferida do layout; confirmar no programa. |
| F-SAIDA-GERAL | Declaração de Saída Definitiva do País: obrigações | `criar_declaracao`, `definir_saida_definitiva` | model | P1 | implementada (`criar_declaracao`, `definir_saida_definitiva`) |  |
| F-SAIDA-IDENT | Ficha Identificação do Contribuinte na Saída Definitiva | `definir_identificacao` | model | P1 | implementada (`definir_identificacao`) |  |
| F-SAIDA | Ficha Saída | `definir_saida_definitiva` | model | P1 | implementada (`definir_saida_definitiva`) |  |
| F-SAIDA-DEDUCOES | Deduções na Saída Definitiva | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Soma das tabelas mensais do período. |
| F-SAIDA-DIVIDAS | Dívidas e Ônus Reais na Saída Definitiva | `adicionar_divida` | model | P1 | implementada (`adicionar_divida`) |  |
| F-SAIDA-CALC | Cálculo do imposto na Saída Definitiva | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Soma das tabelas mensais do período. |
| F-SAIDA-IMPEXT | Compensação do imposto pago no exterior na Saída Definitiva | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Soma das tabelas mensais do período. |
| F-SAIDA-PAGTO | Pagamento, restituição e disposições finais da Saída Definitiva | `simular_quotas`, `calcular_acrescimos_moratorios` | calc | P1 | implementada (`calcular_acrescimos_moratorios`, `calcular_quotas`) | Quota única. |
| F-SAIDA-DARF | Darf da Saída Definitiva | `gerar_darf` | calc | P1 | implementada (`gerar_darf`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| F-SAIDA-MULTA | Multa por atraso na entrega da Saída Definitiva | `calcular_multa_atraso` | calc | P1 | implementada (`calcular_multa_atraso`) |  |
| F-DFE-GERAL | Declaração Final de Espólio: disposições gerais | `criar_declaracao`, `definir_identificacao` | model | P1 | implementada (`criar_declaracao`, `definir_identificacao`) |  |
| F-DFE-SOBREPARTILHA | Sobrepartilha, bens acrescidos antes e após a partilha | `definir_espolio` | model | P1 | implementada (`definir_espolio`) |  |
| F-DFE-OBITO-CONJUGES | Ocorrência de morte de ambos os cônjuges | `definir_espolio` | model | P1 | implementada (`definir_espolio`) |  |
| F-DFE-MOEDA | Conversão de moeda estrangeira para reais (espólio) | `converter_moeda` | tabelas | P2 | parcial (`converter_moeda`) |  |
| F-DFE-BENS | Ficha Bens e Direitos (Final de Espólio) | `adicionar_bem`, `definir_partilha_bem` | model | P1 | implementada (`adicionar_bem`, `definir_partilha_bem`) |  |
| F-DFE-GCAP | Pagamento do Imposto sobre Ganhos de Capital (espólio) | `gerar_darf`, `orientar_servico_externo` | calc | P2 | implementada (`gerar_darf`, `orientar_servico_externo`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| F-DFE-BENS-AR | Bens da Atividade Rural no espólio | `definir_receitas_despesas_rurais`, `listar_pendencias` | model | P2 | implementada (`definir_receitas_despesas_rurais`, `validar_declaracao`) |  |
| F-DFE-IDENT | Ficha Identificação do Contribuinte (Final de Espólio) | `criar_declaracao`, `definir_identificacao` | model | P1 | implementada (`criar_declaracao`, `definir_identificacao`) |  |
| F-DFE-FICHA | Ficha Espólio | `definir_espolio` | model | P1 | implementada (`definir_espolio`) |  |
| F-DFE-HERDEIROS | Ficha Herdeiros/Meeiro | `adicionar_herdeiro` | model | P1 | implementada (`adicionar_herdeiro`) |  |
| F-DFE-DIVIDAS | Ficha Dívidas e Ônus Reais (Final de Espólio) | `adicionar_divida` | model | P1 | implementada (`adicionar_divida`) |  |
| F-DFE-CALCULO | Resumo da Declaração - Cálculo do imposto devido (Final de Espólio) | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Tabela mensal x meses até a decisão. |
| F-DFE-PRAZO | Observações finais: prazo, multa, pagamento, restituição | `listar_pendencias`, `calcular_multa_atraso` | validate | P1 | implementada (`calcular_multa_atraso`, `validar_declaracao`) | Prazo calculado localmente (o PGD consulta serviço). |
| F-DFE-DARF | Preenchimento do Darf (Final de Espólio) | `gerar_darf` | calc | P1 | implementada (`gerar_darf`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| F-DFE-PAGTO | Pagamento do Imposto (Final de Espólio) | `simular_quotas` | calc | P1 | implementada (`calcular_quotas`) | Quota única. |
| F-RESUMO-TRIB | Resumo, Rendimentos Tributáveis (modelo completo) | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) |  |
| F-RESUMO-DED | Resumo, Deduções (modelo completo) | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) |  |
| F-RESUMO-CALC | Resumo, Cálculo do Imposto (deduções legais) | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) |  |
| F-RESUMO-QUOTAS | Resumo, Imposto a pagar: formas de pagamento, quotas e débito automático | `definir_informacoes_bancarias`, `simular_quotas` | calc | P0 | implementada (`calcular_quotas`, `definir_informacoes_bancarias`) |  |
| F-RESUMO-BANCO | Resumo, Informações Bancárias (restituição e débito) | `definir_informacoes_bancarias`, `validar_documento` | validate | P0 | parcial (`definir_informacoes_bancarias`, `validar_documento`) | DV por banco (bancos_calculo_dv) e Pix pela chave CPF. |
| F-RESUMO-SIMPL | Resumo, Cálculo do Imposto (Desconto Simplificado) | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) |  |
| F-RESUMO-EVOL | Resumo, Outras Informações: Evolução patrimonial | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) |  |
| F-RESUMO-OUTRAS | Resumo, Outras Informações: demais linhas | `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) |  |
| F-RESUMO-OPCAO | Opção pela Tributação (Ajuste Anual) | `definir_opcao_tributacao`, `calcular_imposto` | calc | P0 | parcial (`comparar_modelos`, `definir_opcao_tributacao`, `explicar_calculo`, `simular_imposto`) |  |
| D-AR-GERAL | Demonstrativo da Atividade Rural (visão geral e regras de período) | `listar_fichas`, `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `listar_fichas`, `simular_imposto`) |  |
| D-AR-OBRIG | Obrigatoriedade de Preenchimento do Demonstrativo | `verificar_obrigatoriedade` | validate | P1 | implementada (`verificar_obrigatoriedade`) |  |
| D-AR-OQUE | O Que deve ser Declarado (atividade rural) | `obter_ajuda` | tabelas | P2 | pendente |  |
| D-AR-IMOVEL | Dados do Imóvel Explorado (abas Brasil e Exterior) | `adicionar_imovel_rural` | model | P1 | implementada (`adicionar_imovel_rural`) |  |
| D-AR-RD-BRASIL | Receitas e Despesas - Brasil | `definir_receitas_despesas_rurais` | model | P1 | implementada (`definir_receitas_despesas_rurais`) |  |
| D-AR-RD-EXTERIOR | Receitas e Despesas - Exterior | `definir_receitas_despesas_rurais` | model | P1 | implementada (`definir_receitas_despesas_rurais`) |  |
| D-AR-APUR | Apuração do Resultado (considerações gerais) | `definir_apuracao_rural`, `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) |  |
| D-AR-APUR-L01 | Saldo de prejuízo(s) a compensar de exercício(s) anterior(es) | `definir_apuracao_rural`, `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) |  |
| D-AR-APUR-L02 | Receita bruta total | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-AR-APUR-L03 | Despesa de custeio e investimento total | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-AR-APUR-L04 | Resultado (Brasil) / Resultado total US$ e Resultado total R$ (Exterior) | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-AR-APUR-L05 | Limite de 20% sobre a receita bruta total | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-AR-APUR-L06 | Opção pela forma de apuração do resultado tributável | `definir_apuracao_rural`, `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) |  |
| D-AR-APUR-L07 | Compensação de prejuízo(s) de exercício(s) anterior(es) | `definir_apuracao_rural`, `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) |  |
| D-AR-APUR-L08 | Resultado tributável | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-AR-APUR-L09 | Saldo de prejuízo(s) a compensar | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-AR-APUR-L10 | Apuração do resultado não tributável | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-AR-APUR-L11 | Adiantamento(s) recebido(s) em 2025 por conta de venda para entrega futura | `definir_apuracao_rural`, `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) |  |
| D-AR-APUR-L12 | Adiantamento(s) recebido(s) até 2024 a ser(em) informado(s) como receita(s) de produto(s) entregue(s) em 2025 | `definir_apuracao_rural`, `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `definir_apuracao_rural`, `explicar_calculo`, `simular_imposto`) |  |
| D-AR-REBANHO | Movimentação do Rebanho (abas Brasil e Exterior) | `definir_rebanho` | model | P1 | implementada (`definir_rebanho`) |  |
| D-AR-BENS | Bens da Atividade Rural | `adicionar_bem_rural`, `repetir_valores_bens` | model | P1 | implementada (`adicionar_bem_rural`, `repetir_valores_bens`) |  |
| D-AR-DIVIDAS | Dívidas Vinculadas à Atividade Rural (abas Brasil e Exterior) | `adicionar_divida_rural` | model | P1 | implementada (`adicionar_divida_rural`) |  |
| D-AR-IMPORT | Importação AR2025 (Livro Caixa da Atividade Rural 2025 e IRPF2025) | `importar_livro_caixa_rural`, `importar_declaracao_anterior` | importacao | P1 | parcial (`converter_dbk_para_modelo`, `definir_receitas_despesas_rurais`, `orientar_servico_externo`) |  |
| D-GCAP-GERAL | Demonstrativo de Ganhos de Capital (GCAP 2025) | `importar_gcap`, `listar_ganhos_capital`, `remover_lancamento` | importacao | P1 | parcial (`abrir_declaracao`, `listar_ganhos_capital`, `orientar_servico_externo`, `remover_lancamento`) | Demonstrativo só por importação, como no PGD. |
| D-GCAP-IMOVEIS | Ganhos de Capital - Bens Imóveis | `importar_gcap`, `listar_ganhos_capital`, `calcular_ganho_capital` | importacao | P1 | parcial (`abrir_declaracao`, `calcular_ganho_capital`, `listar_ganhos_capital`, `orientar_servico_externo`) | Simulador próprio é P2 e só orienta. |
| D-GCAP-MOVEIS | Ganhos de Capital - Direitos/Bens Móveis | `importar_gcap`, `listar_ganhos_capital`, `calcular_ganho_capital` | importacao | P1 | parcial (`abrir_declaracao`, `calcular_ganho_capital`, `listar_ganhos_capital`, `orientar_servico_externo`) | Simulador próprio é P2 e só orienta. |
| D-GCAP-PARTICIP | Ganhos de Capital - Participações Societárias | `importar_gcap`, `listar_ganhos_capital`, `calcular_ganho_capital` | importacao | P1 | parcial (`abrir_declaracao`, `calcular_ganho_capital`, `listar_ganhos_capital`, `orientar_servico_externo`) | Simulador próprio é P2 e só orienta. |
| D-GCAP-MOEDA | Ganhos de Capital - Moedas em Espécie | `importar_gcap`, `listar_ganhos_capital`, `calcular_ganho_capital` | importacao | P1 | parcial (`abrir_declaracao`, `calcular_ganho_capital`, `listar_ganhos_capital`, `orientar_servico_externo`) | Simulador próprio é P2 e só orienta. |
| D-RV-GERAL | Renda Variável - Operações Comuns e Day-Trade (considerações gerais) | `definir_renda_variavel` | model | P1 | implementada (`definir_renda_variavel`) |  |
| D-RV-PROC | Procedimentos para Apuração dos Ganhos Líquidos ou Perdas | `calcular_preco_medio` | calc | P2 | implementada (`apurar_renda_variavel`, `calcular_preco_medio`) |  |
| D-RV-TIPOS | Tipos de Mercado ou Ativo / Ganhos Líquidos ou Perdas (linhas de entrada) | `definir_renda_variavel` | model | P1 | implementada (`definir_renda_variavel`) |  |
| D-RV-L01 | RESULTADO LÍQUIDO DO MÊS | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-RV-L02 | Resultado negativo até o mês anterior | `definir_renda_variavel` | model | P1 | implementada (`definir_renda_variavel`) |  |
| D-RV-L03 | BASE DE CÁLCULO DO IMPOSTO | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-RV-L04 | Prejuízo a compensar | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-RV-L05 | Alíquota do imposto / IMPOSTO DEVIDO | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-RV-L06 | Total do imposto devido | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-RV-L07 | IR fonte de Day-Trade no mês | `definir_renda_variavel` | model | P1 | implementada (`definir_renda_variavel`) |  |
| D-RV-L08 | IR fonte de Day-Trade nos meses anteriores | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-RV-L09 | IR fonte de Day-Trade a compensar | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-RV-L10 | IR fonte (Lei nº 11.033/2004) no mês / nos meses anteriores / a compensar | `definir_renda_variavel` | model | P1 | implementada (`definir_renda_variavel`) |  |
| D-RV-L11 | Imposto a pagar | `calcular_imposto`, `gerar_darf` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `gerar_darf`, `simular_imposto`) | Darf 6015 com acréscimos. |
| D-RV-L12 | Imposto Pago | `definir_renda_variavel` | model | P1 | implementada (`definir_renda_variavel`) |  |
| D-FII-GERAL | Operações em FII ou Fiagro (conceito e considerações gerais) | `definir_fii_fiagro` | model | P1 | implementada (`definir_fii_fiagro`) |  |
| D-FII-DISTRIB | Distribuição dos Lucros / Rendimentos e Ganhos Auferidos e Distribuídos | `obter_ajuda`, `adicionar_rendimento_isento`, `adicionar_rendimento_exclusivo` | tabelas | P2 | parcial (`adicionar_rendimento_exclusivo`, `adicionar_rendimento_isento`) |  |
| D-FII-ALIEN | Alienação ou Resgate de Quotas | `obter_ajuda`, `adicionar_rendimento_isento`, `adicionar_rendimento_exclusivo` | tabelas | P2 | parcial (`adicionar_rendimento_exclusivo`, `adicionar_rendimento_isento`) |  |
| D-FII-ISENCAO | Isenção dos rendimentos distribuídos | `obter_ajuda`, `adicionar_rendimento_isento`, `adicionar_rendimento_exclusivo` | tabelas | P2 | parcial (`adicionar_rendimento_exclusivo`, `adicionar_rendimento_isento`) |  |
| D-FII-PROC | Procedimentos para Apuração (FII/Fiagro) | `calcular_preco_medio` | calc | P2 | implementada (`apurar_renda_variavel`, `calcular_preco_medio`) |  |
| D-FII-L01 | Ganhos Líquidos ou Perdas / Resultado líquido do mês | `definir_fii_fiagro` | model | P1 | implementada (`definir_fii_fiagro`) |  |
| D-FII-L02 | Resultado negativo até o mês anterior | `definir_fii_fiagro` | model | P1 | implementada (`definir_fii_fiagro`) |  |
| D-FII-L03 | Base de cálculo do imposto | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-FII-L04 | Prejuízo a compensar | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-FII-L05 | Alíquota do imposto / Imposto devido | `calcular_imposto` | calc | P1 | parcial (`comparar_modelos`, `explicar_calculo`, `simular_imposto`) | Linha calculada. |
| D-FII-L06 | Imposto pago | `definir_fii_fiagro` | model | P1 | implementada (`definir_fii_fiagro`) |  |
| D-CL-GERAL | Escrituração do Carnê-Leão importada (titular e dependentes) | `importar_carne_leao`, `definir_rendimentos_pf_exterior` | importacao | P1 | parcial (`definir_rendimentos_pf_exterior`, `orientar_servico_externo`) |  |
| D-CL-PROGRAMA | Programa Carnê-Leão (e-CAC) | `orientar_servico_externo`, `calcular_carne_leao` | calc | P2 | implementada (`calcular_carne_leao`, `orientar_servico_externo`) | O Carnê-Leão é serviço do e-CAC. |
| S-PAG-DARF | Preenchimento do Darf do IRPF | `gerar_darf` | calc | P0 | implementada (`gerar_darf`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| S-PAG-FORMAS | Formas de pagamento do imposto | `obter_ajuda` | tabelas | P1 | pendente |  |
| S-PAG-DEBITO | Débito automático das quotas | `definir_informacoes_bancarias`, `simular_quotas` | validate | P0 | implementada (`calcular_quotas`, `definir_informacoes_bancarias`) | Alteração posterior do débito automático só no e-CAC (`orientar_servico_externo`). |
| S-PAG-PARCEL | Parcelamento do imposto | `simular_quotas` | calc | P0 | implementada (`calcular_quotas`) | Selic futura informada pelo usuário ou consultada. |
| S-PAG-QUOTAS-PRAZO | Valor das quotas pagas dentro do prazo | `simular_quotas` | calc | P0 | implementada (`calcular_quotas`) | Selic futura informada pelo usuário ou consultada. |
| S-PAG-VENC | Vencimento das quotas | `simular_quotas`, `consultar_tabela` | tabelas | P0 | implementada (`buscar_codigo`, `calcular_quotas`, `consultar_parametros`, `listar_tabela`) | `datas-prazos.json`. |
| S-PAG-APOS-PRAZO | Pagamento após o prazo | `calcular_acrescimos_moratorios`, `gerar_darf` | calc | P1 | implementada (`calcular_acrescimos_moratorios`, `gerar_darf`) |  |
| S-ERROS-FREQ | Erros mais Frequentes (orientação) | `listar_pendencias`, `validar_documento` | validate | P0 | parcial (`validar_declaracao`, `validar_documento`) | Também normalização de valores monetários na entrada. |
| S-REQUISITOS | Requisitos e instalação do programa oficial | `instruir_transmissao` | nenhum | P2 | implementada (`instruir_transmissao`) |  |
| S-PROBLEMAS-IMPRESSAO | Problemas na Impressão (orientação) | não se aplica | nenhum | P2 | não se aplica | O AutoIR gera PDF/HTML. |
| S-SALVAMENTO | Salvamento automático | todas as ferramentas que escrevem em disco | model | P0 | implementada (gravação atômica com cópia de segurança em toda ferramenta de escrita) | Gravação atômica a cada chamada. |
| S-UMA-ABERTA | Uma declaração aberta por vez e base local | `listar_declaracoes` | model | P2 | parcial (`listar_arquivos`) | Restrição não replicada. |
| S-GRAVAR-ENTREGA | Gravação da declaração para entrega (arquivo .DEC) | `gerar_dbk` | dbk | P0 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) | Nome padrão CPF-IRPF-A-2026-2025-ORIGI.DEC (a confirmar). |
| S-TRANSMISSAO | Transmissão (Receitanet incorporado) | `instruir_transmissao` | dbk | P0 | implementada (`instruir_transmissao`) | IMPOSSÍVEL fora do PGD: a transmissão usa o Receitanet incorporado, com protocolo, hash, envelope e certificado da RFB, que não podem ser reimplementados nem copiados. Alternativa: `gerar_dbk` grava o arquivo e `instruir_transmissao` orienta abrir no PGD 2026, verificar pendências e entregar; depois `registrar_recibo`. |
| S-RECIBO | Recibo de entrega e número do recibo | `registrar_recibo`, `validar_documento` | importacao | P1 | parcial (`validar_documento`) | IMPOSSÍVEL fora do PGD: o recibo é produzido pela RFB na recepção. Alternativa: imprimir no PGD e informar o número com `registrar_recibo`. |
| S-NOTIFICACAO-MAED | Notificação de lançamento da multa por atraso emitida pelo PGD | `calcular_multa_atraso` | calc | P2 | implementada (`calcular_multa_atraso`) | Notificação oficial só existe após a entrega. |
| S-VALIDADOR | Dados do validador e mensagens pós-recepção | não se aplica | nenhum | P2 | não se aplica | Produzido pela RFB na recepção. |
| S-CALAMIDADE | Contribuintes de municípios em calamidade (RS 2024) | `listar_pendencias`, `consultar_tabela` | validate | P2 | implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`, `validar_declaracao`) | Regra inferida; confirmar. |
| S-NUVEM-PREPREENCHIDA | Obter pré-preenchida | `orientar_servico_externo` | nenhum | P2 | implementada (`orientar_servico_externo`) | IMPOSSÍVEL fora do PGD: exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho. Alternativa: `orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário. |
| S-NUVEM-CARNELEAO | Importar Carnê-Leão Web (gov.br ou código de acesso) | `orientar_servico_externo` | nenhum | P2 | implementada (`orientar_servico_externo`) | IMPOSSÍVEL fora do PGD: exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho. Alternativa: `orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário. |
| S-NUVEM-DECONLINE | Salvar e recuperar declaração on-line | `orientar_servico_externo` | nenhum | P2 | implementada (`orientar_servico_externo`) | IMPOSSÍVEL fora do PGD: exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho. Alternativa: `orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário. |
| S-NUVEM-DARF | Emissão de Darf em PDF pelo serviço (quota, ECA, Idoso, MAED, MAED Espólio) | `gerar_darf`, `orientar_servico_externo` | calc | P2 | implementada (`gerar_darf`, `orientar_servico_externo`) | IMPOSSÍVEL fora do PGD: o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc. Alternativa: `gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial. |
| S-NUVEM-MUNICIPIOS | Atualização da tabela de municípios | `consultar_tabela`, `verificar_versao_tabelas` | tabelas | P2 | implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`, `verificar_versao_tabelas`) | Tabela local versionada. |
| S-NUVEM-VENC-DFE | Data de vencimento da Declaração Final de Espólio | `listar_pendencias` | validate | P1 | implementada (`validar_declaracao`) | Cálculo local pelas regras de prazo da DFE. |
| S-NUVEM-CAPTCHA-TOKEN | Captcha, token de acesso e certificado digital | não se aplica | nenhum | P2 | não se aplica | IMPOSSÍVEL fora do PGD: exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho. Alternativa: `orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário. |
| S-ARQ-GERAL | Estrutura do arquivo de declaração | `gerar_dbk`, `importar_declaracao_anterior` | dbk | P0 | parcial (`converter_dbk_para_modelo`, `converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-IDENT | Registro 16 (identificação do contribuinte) | `gerar_dbk` | dbk | P0 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-TOTAIS | Registros 17, 18, 19 e 20 (totais, modelo, imposto pago e resumo) | `gerar_dbk` | dbk | P0 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-RENDIMENTOS | Registros 21, 32, 22, 49, 80, 81 (rendimentos PJ, PF/Exterior e exigibilidade suspensa) | `gerar_dbk` | dbk | P0 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-ISENTOS-EXCL | Registros 23, 24, 31, 33, 82 e 83 a 99 (isentos, exclusivos e detalhes) | `gerar_dbk` | dbk | P0 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-PESSOAS | Registros 25, 35, 29 (dependentes, alimentandos, cônjuge) | `gerar_dbk` | dbk | P0 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-PAGAMENTOS-DOACOES | Registros 26, 34, 46, 48, 90, 91, 92 | `gerar_dbk` | dbk | P0 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-BENS-DIVIDAS | Registros 27, 36, 37, 28 | `gerar_dbk` | dbk | P0 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-ESPOLIO-SAIDA | Registros 30, 38, 58, 59, 39 | `gerar_dbk` | dbk | P1 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-RRA | Registros 45 e 47 | `gerar_dbk` | dbk | P1 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-RV | Registros 40, 41, 42, 43 | `gerar_dbk` | dbk | P1 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-AR | Registros 50 a 57 | `gerar_dbk` | dbk | P1 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`) |  |
| S-ARQ-REG-GCAP | Registros 60 a 78 | `importar_gcap`, `gerar_dbk` | dbk | P1 | parcial (`abrir_declaracao`, `converter_modelo_para_dbk`, `orientar_servico_externo`, `verificar_integridade_arquivo`) | Registros importados preservados sem recálculo. |
| S-ARQ-REG-RECIBO | Registros FR, HR, DR, R9, HC, RC, NC, VC, MC, TC | `registrar_recibo` | importacao | P2 | pendente | Somente leitura; nunca gerado pelo AutoIR. |
| S-ARQ-INFORMES | Arquivos de informe (XML) e mapeamentos de importação | `importar_informe_rendimentos`, `importar_informe_plano_saude`, `importar_gcap` | importacao | P1 | parcial (`abrir_declaracao`, `importar_informe_plano_saude`, `importar_informe_rendimentos`, `orientar_servico_externo`) |  |
| S-TAB-PROGRESSIVA | Tabela Progressiva Anual e Mensal (ano-calendário 2025) | `consultar_tabela` | tabelas | P0 | implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| S-TAB-DOLAR | Tabela de Conversão para Reais do Dólar dos EUA em 2025 | `converter_moeda`, `consultar_tabela` | tabelas | P1 | parcial (`buscar_codigo`, `consultar_parametros`, `converter_moeda`, `listar_tabela`) | Tabela ainda não exportada em JSON (lacuna). |
| S-TAB-ATUALIZACAO | Tabela de Atualização do Custo de Bens e Direitos | `atualizar_custo_bem` | tabelas | P2 | pendente | Tabela ainda não exportada em JSON (lacuna). |
| S-TAB-DEPENDENCIA | Tabela de Relação de Dependência | `consultar_tabela` | tabelas | P0 | implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| S-TAB-BENS | Tabela de Códigos de Bens e Direitos | `consultar_tabela` | tabelas | P0 | implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| S-TAB-PAGAMENTOS | Tabela de Códigos de Pagamentos | `consultar_tabela` | tabelas | P0 | implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |
| S-TAB-DOACOES | Tabela de Códigos de Doações | `consultar_tabela` | tabelas | P1 | implementada (`buscar_codigo`, `consultar_parametros`, `listar_tabela`) |  |

Itens por prioridade: P0 115, P1 226, P2 75 (total 416).

Status por item (calculado a partir das ferramentas da linha): implementada quando todas já existem no servidor; parcial quando ao menos uma existe ou cobre parte do escopo; pendente quando nenhuma existe; "não se aplica" para funções de interface sem equivalente no MCP.

| Status | P0 | P1 | P2 | Total |
|---|---:|---:|---:|---:|
| implementada | 80 | 128 | 38 | 246 |
| parcial | 35 | 97 | 13 | 145 |
| pendente | 0 | 1 | 12 | 13 |
| não se aplica | 0 | 0 | 12 | 12 |

## Ferramentas MCP propostas (lista consolidada e deduplicada)

78 ferramentas. "Escreve em disco" indica se a ferramenta altera a base local de declarações ou grava arquivo. "Itens" é o número de linhas da matriz que citam a ferramenta.

### Ciclo de vida e navegação

| Ferramenta | Descrição | Parâmetros principais | Escreve em disco | Módulo | Itens | Status |
|---|---|---|---|---|---:|---|
| `criar_declaracao` | Cria uma declaração do exercício 2026 (ajuste anual, final de espólio ou saída definitiva) em branco, a partir da declaração de 2025 ou de arquivo da pré-preenchida. | tipo (ajuste\|final_espolio\|saida_definitiva), modo (em_branco\|importar_anterior\|pre_preenchida), cpf, nome, arquivo_origem? | sim | model | 10 | implementada (`criar_declaracao`): cria o DBK em branco com o nome padrão; a partir de outro arquivo use `criar_retificadora` ou `gravar_copia_seguranca` |
| `listar_declaracoes` | Lista as declarações locais com situação (em preenchimento, transmitida), tipo e modelo; aceita filtro por nome ou CPF. | filtro?, situacao? | não | model | 6 | parcial (`listar_arquivos`): lista arquivos da pasta autorizada, sem situação em preenchimento ou transmitida |
| `abrir_declaracao` | Carrega uma declaração e devolve visão geral: tipo, fichas preenchidas, totais e pendências resumidas. | id_declaracao \| cpf + exercicio | não | model | 3 | implementada (`abrir_declaracao`): lê DBK/DEC da pasta autorizada e resume |
| `excluir_declaracao` | Exclui uma ou mais declarações locais após confirmação explícita. | ids, confirmar | sim | model | 2 | implementada (`excluir_declaracao`): exige confirmação com o nome do arquivo e guarda cópia de segurança |
| `criar_retificadora` | Cria a retificadora a partir de uma declaração do exercício, exigindo o número do recibo da anterior e aplicando as travas de prazo (troca de regime, bens de espólio, débito automático). | id_origem, numero_recibo | sim | model | 4 | implementada (`criar_retificadora`): a partir de DBK ou DEC, com o número do recibo |
| `registrar_recibo` | Registra o recibo de entrega informado pelo usuário (número de 12 dígitos ou arquivo do recibo gerado pelo PGD) e marca a declaração como transmitida. | id_declaracao, numero_recibo? \| arquivo_recibo? | sim | importacao | 4 | pendente |
| `gravar_copia_seguranca` | Grava cópia de segurança (dados atuais, cópia para entrega ou transmitida com recibo) no formato do AutoIR. | ids, tipo (dados_atuais\|entrega\|transmitida_com_recibo), destino | sim | model | 3 | implementada (`gravar_copia_seguranca`) |
| `restaurar_copia_seguranca` | Restaura cópia de segurança do AutoIR, avisando se substitui declaração existente do mesmo CPF. | arquivo, sobrescrever? | sim | model | 3 | implementada (`restaurar_copia_seguranca`, `listar_copias_seguranca`) |
| `listar_fichas` | Lista as fichas e demonstrativos aplicáveis ao tipo da declaração, com estado de preenchimento e sugestões (equivale à aba Início e ao menu Fichas). | id_declaracao | não | model | 3 | implementada (`listar_fichas`) |
| `listar_lancamentos` | Lista os lançamentos de uma ficha ou demonstrativo, com chave de cada item. | id_declaracao, ficha, filtro? | não | model | 2 | implementada (`listar_lancamentos`, `ler_ficha`): também `listar_*` por ficha |
| `editar_lancamento` | Altera campos de um lançamento existente em qualquer ficha, revalidando o item. | id_declaracao, ficha, id_lancamento, campos | sim | model | 5 | implementada (`editar_lancamento`): também `editar_*` por ficha |
| `remover_lancamento` | Remove um ou mais lançamentos; para dependentes aplica a exclusão em cascata do PGD e lista as fichas que exigem ação manual. | id_declaracao, ficha, ids_lancamento, cascata? | sim | model | 6 | implementada (`remover_lancamento`): com cascata dos vínculos de dependente e alimentando |

### Fichas da declaração

| Ferramenta | Descrição | Parâmetros principais | Escreve em disco | Módulo | Itens | Status |
|---|---|---|---|---|---:|---|
| `definir_identificacao` | Grava a ficha Identificação: tipo de declaração e recibos, nome, nascimento, doença grave, raça/cor, alteração cadastral, cônjuge, retorno ao país, endereço (Brasil ou exterior) e ocupação. | tipo_declaracao, recibo_anterior?, nome, data_nascimento, doenca_grave, raca_cor, alteracao_cadastral, conjuge_cpf?, data_retorno?, endereco, natureza_ocupacao, ocupacao_principal, registro_profissional? | sim | model | 18 | implementada (`definir_identificacao`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_dependente` | Inclui dependente com código de relação, CPF, nascimento e contatos, validando idade, duplicidade e CPF do titular. | codigo_dependencia, nome, cpf, data_nascimento, raca_cor, celular?, email?, mora_com_titular, saiu_mesma_data? | sim | model | 9 | implementada (`adicionar_dependente`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_alimentando` | Inclui alimentando com residência, vínculo (titular ou dependente) e dados da decisão judicial ou escritura pública. | residente, cpf, nome, data_nascimento, vinculado_a, tipo_processo, escritura?, decisao_judicial? | sim | model | 1 | implementada (`adicionar_alimentando`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_rendimento_pj` | Inclui rendimento tributável recebido de PJ (ou PF empregadora) pelo titular ou dependente; transporta o 13º para Tributação Exclusiva. | beneficiario (titular\|cpf_dependente), cpf_cnpj_fonte, nome_fonte, rendimentos, previdencia_oficial, irrf, decimo_terceiro, irrf_13 | sim | model | 4 | implementada (`adicionar_rendimento_pj`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_rendimentos_pf_exterior` | Grava a grade mensal de rendimentos de PF e do exterior (titular ou dependente): trabalho não assalariado com pagadores, aluguéis, outros, exterior, previdência, dependentes, pensão, livro Caixa, Carnê-Leão pago e NIT. | beneficiario, mes, valores_por_coluna, pagadores?, nit? | sim | model | 17 | implementada (`definir_rendimentos_pf_exterior`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_rendimento_isento` | Inclui lançamento na ficha Rendimentos Isentos por código (01 a 28 e 99) com o schema próprio de cada código. | codigo, beneficiario, cpf_cnpj_fonte?, nome_fonte?, valor, campos_do_codigo?, chave_bem? | sim | model | 31 | implementada (`adicionar_rendimento_isento`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_rendimento_exclusivo` | Inclui lançamento na ficha Tributação Exclusiva/Definitiva por código (01 a 13 e 99). | codigo, beneficiario, cpf_cnpj_fonte?, nome_fonte?, valor, descricao?, chave_bem? | sim | model | 10 | implementada (`adicionar_rendimento_exclusivo`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_rendimento_exigibilidade_suspensa` | Inclui rendimento de PJ com exigibilidade suspensa (titular ou dependente) e depósitos judiciais. | beneficiario, cpf_cnpj_fonte, nome_fonte, rendimentos, depositos_judiciais | sim | model | 3 | implementada (`adicionar_rendimento_exigibilidade_suspensa`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_rra` | Inclui rendimento recebido acumuladamente com a opção de tributação (ajuste ou exclusiva), parcelas, meses, deduções e pensão por alimentando. | beneficiario, opcao_tributacao, cpf_cnpj_fonte, nome_fonte, rendimentos, parcela_isenta_65, juros, previdencia, pensao_por_alimentando, irrf, mes_recebimento, numero_meses | sim | model | 4 | implementada (`adicionar_rra`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_imposto_pago` | Grava as linhas editáveis da ficha Imposto Pago/Retido (imposto complementar, imposto pago no exterior, IRRF da Lei 11.033/2004). | imposto_complementar?, imposto_exterior?, irrf_lei_11033? | sim | model | 4 | implementada (`definir_imposto_pago`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_pagamento` | Inclui pagamento efetuado por código, com beneficiário, CPF/CNPJ conforme o código, despesa do titular, dependente ou alimentando e parcela não dedutível. | codigo, realizado_com, chave_dependente_ou_alimentando?, nome_beneficiario, cpf_cnpj_beneficiario?, descricao, valor_pago, parcela_nao_dedutivel?, contribuicao_patrocinador? | sim | model | 39 | implementada (`adicionar_pagamento`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_doacao` | Inclui doação efetuada por código (40 a 47, 80, 81, 99). | codigo, nome_beneficiario, cpf_cnpj?, valor, parcela_nao_dedutivel? | sim | model | 12 | implementada (`adicionar_doacao`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_doacao_direta_declaracao` | Inclui doação diretamente na declaração ao fundo ECA ou Pessoa Idosa (nacional, estadual ou municipal), informando o valor máximo dedutível. | fundo (eca\|idoso), esfera, uf?, municipio?, valor | sim | model | 3 | implementada (`adicionar_doacao_direta_declaracao`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_bem` | Inclui bem ou direito com grupo, código, país, discriminação, situações por data e campos condicionais (endereço, registros, banco, CNPJ, criptoativo, aplicação no exterior, lucros, campos de espólio ou saída). | grupo, codigo, pais, discriminacao, situacao_2024?, situacao_2025?, pertence_a?, campos_do_codigo, aplicacao_financeira?, lucros_dividendos? | sim | model | 36 | implementada (`adicionar_bem`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `aplicar_caso_especial_bem` | Assistente que monta os lançamentos de casos especiais de bens (benfeitoria, consórcio contemplado, leasing, permuta, doação, herança, dissolução, exterior, moeda em espécie, novo residente, desincorporação) e os reflexos em Isentos, Dívidas e GCAP. | cenario, dados_do_cenario | sim | model | 17 | implementada (`aplicar_caso_especial_bem`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `repetir_valores_bens` | Copia a situação em 31/12/2024 para 31/12/2025 (ou para a data da não residência) nos bens selecionados. | ids_bens | sim | model | 3 | implementada (`repetir_valores_bens`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_divida` | Inclui dívida ou ônus real com código, discriminação, situações e valor pago, avisando dispensas (até R$ 5.000,00, alienação fiduciária, consórcio, rural). | codigo, discriminacao, situacao_2024?, situacao_2025?, valor_pago?, situacao_especial? | sim | model | 3 | implementada (`adicionar_divida`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_espolio` | Grava a ficha Espólio (ajuste com natureza 81 ou Final de Espólio): sobrepartilha, inventariante, partilha, bens a inventariar, ano do óbito, tipo de inventário e dados do cônjuge. | modalidade, inventariante, ano_obito?, final_espolio?, ha_bens_a_inventariar?, tipo_inventario?, decisao_judicial?, escritura?, conjuge? | sim | model | 7 | implementada (`definir_espolio`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_herdeiro` | Inclui herdeiro ou meeiro na Declaração Final de Espólio. | cpf_cnpj, nome | sim | model | 1 | implementada (`adicionar_herdeiro`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_partilha_bem` | Define, para um bem da Final de Espólio, bem a inventariar, usufruto, situação na partilha, percentuais por herdeiro e valor de transferência. | id_bem, bem_a_inventariar?, usufruto?, situacao_partilha?, percentuais [cpf_cnpj, percentual], valor_transferencia? | sim | model | 3 | implementada (`definir_partilha_bem`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_doacao_eleitoral` | Inclui doação a partido político ou candidato (informativa). | cnpj, nome, valor | sim | model | 1 | implementada (`adicionar_doacao_eleitoral`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_saida_definitiva` | Grava a ficha Saída: procurador, data da condição de não residente, data de aquisição de residência e país de nova residência. | procurador?, data_nao_residente, data_residente?, pais_nova_residencia? | sim | model | 3 | implementada (`definir_saida_definitiva`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_informacoes_bancarias` | Grava conta para restituição (inclusive Pix pela chave CPF), número de quotas e débito automático, validando banco, agência, conta e DV. | banco?, agencia?, conta?, tipo_conta?, pix?, numero_quotas?, debito_automatico?, data_prevista_entrega? | sim | model | 3 | implementada (`definir_informacoes_bancarias`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_opcao_tributacao` | Escolhe o modelo de tributação (deduções legais ou desconto simplificado), preservando as deduções informadas. | opcao (completa\|simplificada) | sim | model | 2 | implementada (`definir_opcao_tributacao`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |

### Demonstrativos

| Ferramenta | Descrição | Parâmetros principais | Escreve em disco | Módulo | Itens | Status |
|---|---|---|---|---|---:|---|
| `adicionar_imovel_rural` | Inclui imóvel explorado na atividade rural (Brasil ou exterior) com atividade, CIB, área, condição de exploração, participação e participantes. | ambito, codigo_atividade, nome, localizacao, cib?, area_ha, condicao_exploracao, participacao, participantes? | sim | model | 1 | implementada (`adicionar_imovel_rural`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_receitas_despesas_rurais` | Grava receitas e despesas da atividade rural: grade mensal no Brasil ou totais anuais por país no exterior. | ambito, mes? \| pais?, receita, despesa, resultado_usd? | sim | model | 3 | implementada (`definir_receitas_despesas_rurais`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_apuracao_rural` | Grava os campos informados da apuração do resultado rural (prejuízo anterior, opção 20% ou resultado, compensação, adiantamentos, limite de 20% no exterior, cotação na DFE ou DSDP). | ambito, prejuizo_anterior?, opcao, compensacao?, adiantamentos_2025?, adiantamentos_ate_2024_entregues?, limite_20_exterior?, cotacao? | sim | model | 6 | implementada (`definir_apuracao_rural`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_rebanho` | Grava a movimentação do rebanho por espécie (Brasil ou exterior) e calcula o estoque final. | ambito, especie, estoque_inicial, aquisicoes, nascimentos, consumo_perdas, vendas | sim | model | 1 | implementada (`definir_rebanho`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_bem_rural` | Inclui bem da atividade rural com código, país, discriminação e situações. | codigo, pais, discriminacao, situacao_2024?, situacao_2025? | sim | model | 1 | implementada (`adicionar_bem_rural`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `adicionar_divida_rural` | Inclui dívida vinculada à atividade rural (Brasil ou exterior). | ambito, discriminacao, situacao_2024?, situacao_2025?, valor_pago? | sim | model | 1 | implementada (`adicionar_divida_rural`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_renda_variavel` | Grava o mês do demonstrativo de Renda Variável (comuns e day-trade) do titular ou dependente: ganhos por mercado, prejuízo inicial, IRRF day-trade, IRRF Lei 11.033 e imposto pago. | beneficiario, mes, comum{mercado: valor}, day_trade{mercado: valor}, prejuizo_inicial?, irrf_day_trade?, irrf_lei_11033?, imposto_pago? | sim | model | 6 | implementada (`definir_renda_variavel`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `definir_fii_fiagro` | Grava o mês do demonstrativo de operações em FII ou Fiagro (titular ou dependente). | beneficiario, mes, resultado, prejuizo_inicial?, imposto_pago? | sim | model | 4 | implementada (`definir_fii_fiagro`): edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança |
| `listar_ganhos_capital` | Lista os demonstrativos de ganhos de capital importados por tipo (imóveis, móveis, participações, moeda em espécie) e os valores transportados. | id_declaracao, tipo? | não | model | 5 | parcial (`listar_ganhos_capital`): demonstrativos 64, 67 e 70 a 78 do GCAP preservados sem campo no modelo |

### Importações

| Ferramenta | Descrição | Parâmetros principais | Escreve em disco | Módulo | Itens | Status |
|---|---|---|---|---|---:|---|
| `importar_declaracao_anterior` | Importa dados da declaração de 2025 a partir do arquivo .DEC gravado ou transmitido, sem apagar silenciosamente o que já foi digitado. | arquivo, cpfs?, id_destino?, mesclar? | sim | importacao | 6 | parcial (`converter_dbk_para_modelo`): lê DBK/DEC do exercício 2026; falta o leiaute 2025 e a regra de quais dados migrar |
| `importar_pre_preenchida` | Importa o arquivo da declaração pré-preenchida obtido pelo usuário fora do AutoIR. | arquivo, id_destino? | sim | importacao | 3 | parcial (`abrir_declaracao`, `orientar_servico_externo`): serviço online: só orientação com `orientar_servico_externo`; o AutoIR não acessa a rede; o DBK gravado pelo programa é aberto normalmente |
| `importar_informe_rendimentos` | Importa informe de rendimentos em XML (layout público da RFB) para as fichas correspondentes, com detecção de duplicidade. | id_declaracao, arquivo, beneficiario? | sim | importacao | 6 | implementada (`importar_informe_rendimentos`): texto ou JSON colado; sem OCR |
| `importar_informe_plano_saude` | Importa informe de plano de saúde em XML para Pagamentos Efetuados (código 26 e reembolsos), com detecção de duplicidade. | id_declaracao, arquivo | sim | importacao | 5 | implementada (`importar_informe_plano_saude`): texto ou JSON colado; sem OCR |
| `importar_carne_leao` | Importa o demonstrativo do Carnê-Leão 2025 obtido pelo usuário para a ficha PF/Exterior do titular ou dependente, respeitando as regras de não sobrescrita. | id_declaracao, arquivo, cpf_beneficiario? | sim | importacao | 4 | parcial (`definir_rendimentos_pf_exterior`, `orientar_servico_externo`): serviço online: só orientação com `orientar_servico_externo`; o AutoIR não acessa a rede; os totais mensais são informados na ficha |
| `importar_gcap` | Importa o arquivo exportado pelo GCAP 2025, substituindo os dados do mesmo CPF e transportando valores para Isentos, Exclusivos e Resumo. | id_declaracao, arquivo | sim | importacao | 15 | parcial (`abrir_declaracao`, `orientar_servico_externo`): o DBK com o GCAP importado no programa é preservado; sem leitura do arquivo do GCAP |
| `importar_livro_caixa_rural` | Importa o arquivo exportado pelo Livro Caixa da Atividade Rural 2025 para Receitas e Despesas e Apuração. | id_declaracao, arquivo | sim | importacao | 3 | parcial (`definir_receitas_despesas_rurais`, `orientar_servico_externo`): totais mensais informados na ficha; sem leitura do arquivo do LCAR |
| `ler_informe` | Apresenta de forma legível um informe XML (rendimentos ou plano de saúde) sem importá-lo. | arquivo | não | importacao | 2 | pendente |

### Cálculo, validação e tabelas

| Ferramenta | Descrição | Parâmetros principais | Escreve em disco | Módulo | Itens | Status |
|---|---|---|---|---|---:|---|
| `calcular_imposto` | Calcula o Resumo (rendimentos, deduções, base, imposto devido, incentivos, RRA, Lei 14.754, imposto pago, saldo) nos dois modelos, recomenda o melhor e explica a procedência de cada linha. | id_declaracao, modelo (completo\|simplificado\|ambos), detalhar? | não | calc | 59 | parcial (`simular_imposto`, `comparar_modelos`, `explicar_calculo`): cálculo dos dois modelos e memória; RRA, atividade rural, Lei 14.754 e incentivos a conferir contra o golden |
| `listar_pendencias` | Executa as validações e devolve erros (impedem a entrega) e avisos, com ficha, campo, item e mensagem. | id_declaracao, severidade? | não | validate | 20 | implementada (`validar_declaracao`): catálogo de regras a ampliar para todas as fichas |
| `verificar_obrigatoriedade` | Avalia os 12 critérios de obrigatoriedade e as dispensas a partir da declaração ou de respostas do usuário. | id_declaracao? \| respostas? | não | validate | 3 | implementada (`verificar_obrigatoriedade`): critérios de 2026 a partir das respostas do usuário |
| `simular_quotas` | Calcula número máximo de quotas, valor de cada quota, vencimentos e elegibilidade ao débito automático pela data prevista de entrega. | saldo_a_pagar, numero_quotas?, data_entrega?, tipo_declaracao? | não | calc | 8 | implementada (`calcular_quotas`): falta elegibilidade do débito automático pela data de entrega |
| `gerar_darf` | Calcula os dados de um Darf (0211 por quota, multa por atraso, 3351 ECA, 9090 Pessoa Idosa, 0190, 4600, 8523, 8960, 6015) com multa e juros e gera um demonstrativo em PDF não oficial, com instruções para emitir o documento oficial. | id_declaracao?, tipo, quota?, data_pagamento?, selic_acumulada?, destino? | sim (opcional) | calc | 15 | implementada (`gerar_darf`): código, vencimentos e valores das quotas; o Darf oficial é emitido no programa ou no Sicalc |
| `calcular_acrescimos_moratorios` | Calcula multa de mora (0,33% ao dia, limite 20%) e juros Selic acumulada mais 1% para qualquer débito vencido. | principal, vencimento, data_pagamento, selic_mensal | não | calc | 2 | implementada (`calcular_acrescimos_moratorios`): Selic acumulada informada pelo usuário |
| `calcular_multa_atraso` | Calcula a multa por atraso na entrega (1% ao mês, mínimo R$ 165,74, máximo 20%). | imposto_devido, data_entrega, tipo_declaracao | não | calc | 5 | implementada (`calcular_multa_atraso`) |
| `calcular_rra` | Simula o imposto de RRA pela tabela acumulada (exclusiva) e compara com a opção pelo ajuste. | rendimentos, numero_meses, mes_recebimento, previdencia, pensao, irrf, parcelas? | não | calc | 4 | parcial (`calcular_rra`): simulador; a ficha RRA é preenchida com `adicionar_rra` |
| `transferir_excedente_isencao_65` | Aplica o limite da parcela isenta de 65 anos (R$ 1.903,98 por mês) somando as fontes e transfere o excedente para Rendimentos PJ, como a pergunta do PGD. | id_declaracao, beneficiario? | sim | calc | 2 | implementada (`transferir_excedente_isencao_65`) |
| `converter_moeda` | Converte valores pela tabela oficial do dólar de 2025 (compra para rendimentos e imposto, venda para deduções) ou por cotação informada para outras regras. | valor, moeda, data_ou_mes, finalidade (rendimento\|deducao\|bem\|aplicacao), cotacao? | não | tabelas | 19 | parcial (`converter_moeda`): só com cotação informada pelo usuário (sem download de cotações) |
| `atualizar_custo_bem` | Atualiza custo de bem adquirido até 1995 pela Tabela de Atualização do Custo de Bens e Direitos. | valor_original, moeda_epoca, mes, ano | não | tabelas | 2 | pendente |
| `calcular_condicao_residencia` | Determina datas de aquisição de residência ou de não residência a partir de entradas, saídas, vistos e vínculos. | eventos[], visto?, vinculo_empregaticio? | não | calc | 3 | implementada (`calcular_condicao_residencia`) |
| `calcular_ganho_capital` | Simulador próprio de ganho de capital (imóvel, móvel, participação, moeda em espécie) com isenções e reduções, apenas para orientação; não substitui o GCAP oficial. | tipo, dados_alienacao, dados_aquisicao, perguntas_isencao | não | calc | 5 | parcial (`calcular_ganho_capital`): simulador de orientação; o demonstrativo oficial é o GCAP |
| `calcular_preco_medio` | Calcula custo médio ponderado e ganho por operação a partir de notas de corretagem (ações, ouro, opções, termo, futuro, FII) para preencher a Renda Variável. | operacoes[] | não | calc | 2 | implementada (`calcular_preco_medio`, `apurar_renda_variavel`) |
| `calcular_carne_leao` | Simula o Carnê-Leão mensal pela tabela mensal vigente no mês. | mes, rendimentos, deducoes | não | calc | 1 | implementada (`calcular_carne_leao`): tabelas mensais de 2025 |
| `validar_documento` | Valida CPF, CNPJ, NIT/PIS, número de recibo, CEP, nome, data e conta bancária com DV por banco. | tipo, valor, banco? | não | validate | 16 | parcial (`validar_documento`): só CPF e CNPJ; a conta bancária é validada em `definir_informacoes_bancarias` |
| `consultar_tabela` | Consulta as tabelas de códigos e parâmetros do exercício (bens, rendimentos, pagamentos, doações, dependência, países, municípios, bancos, fundos, alíquotas, prazos). | tabela, filtro? | não | tabelas | 22 | implementada (`listar_tabela`, `buscar_codigo`, `consultar_parametros`) |
| `obter_ajuda` | Responde com as regras oficiais de uma ficha, campo ou tópico (orientação equivalente à Ajuda do PGD), citando a página da Ajuda. | topico \| ficha + campo, busca? | não | tabelas | 22 | pendente |
| `buscar_nome_por_documento` | Sugere o nome já informado para um CPF ou CNPJ nas declarações locais (equivalente à Recuperação de Nomes). | cpf_cnpj | não | model | 1 | parcial (`buscar_nome_por_documento`): busca só nas declarações da pasta; a consulta à Receita é serviço online: só orientação com `orientar_servico_externo`; o AutoIR não acessa a rede |
| `verificar_versao_tabelas` | Informa a versão das tabelas e parâmetros embarcados e alerta se o PGD conhecido for mais novo. | nenhum | não | tabelas | 2 | implementada (`verificar_versao_tabelas`): versão embarcada, sem consulta online |

### Saídas e etapa final no PGD

| Ferramenta | Descrição | Parâmetros principais | Escreve em disco | Módulo | Itens | Status |
|---|---|---|---|---|---:|---|
| `gerar_dbk` | Gera o arquivo da declaração no layout oficial de 2026 (registros IR, 16 a 99 e T9) com o nome padrão, bloqueando se houver erros impeditivos. | id_declaracao, destino | sim | dbk | 16 | implementada (`converter_modelo_para_dbk`, `verificar_integridade_arquivo`): conversão de todas as fichas; registros sem campo no modelo são preservados do arquivo base; totais recalculados com o motor |
| `gerar_relatorio_declaracao` | Gera relatório da declaração (toda ou partes, inclusive rendimentos de PF e demonstrativos) em PDF ou HTML com layout próprio. | id_declaracao, partes?, formato (pdf\|html), destino | sim | model | 3 | parcial (`gerar_relatorio_declaracao`): relatório em texto; sem PDF ou HTML |
| `gerar_comunicacao_saida` | Gera a comunicação à fonte pagadora de saída definitiva do país, uma por fonte. | id_declaracao, fontes?, destino | sim | model | 1 | implementada (`gerar_comunicacao_saida`): só o texto |
| `instruir_transmissao` | Gera o passo a passo e o checklist para concluir no PGD oficial: abrir ou restaurar a declaração, verificar pendências, entregar com ou sem certificado, guardar o recibo e pagar o Darf. | id_declaracao | não | dbk | 6 | implementada (`instruir_transmissao`) |
| `orientar_servico_externo` | Explica como usar um serviço que só existe fora do AutoIR (gov.br, pré-preenchida, Carnê-Leão Web, e-CAC, débito automático, extrato, Darf oficial, GCAP, LCAR, Sicalc, Correios) e o que trazer de volta. | servico, contexto? | não | tabelas | 15 | implementada (`orientar_servico_externo`) |

## Ferramentas existentes no servidor

Ferramentas registradas hoje em `packages/mcp/src/ferramentas/*.ts` e a ferramenta proposta que cada uma cobre:

| Ferramenta existente | Cobre (proposta) |
|---|---|
| `simular_imposto` | `calcular_imposto` |
| `comparar_modelos` | `calcular_imposto` |
| `explicar_calculo` | `calcular_imposto` |
| `calcular_quotas` | `simular_quotas` |
| `calcular_multa_atraso` | `calcular_multa_atraso` |
| `consultar_parametros` | `consultar_tabela` |
| `abrir_declaracao` | `abrir_declaracao`, `importar_gcap`, `importar_pre_preenchida` |
| `converter_dbk_para_modelo` | `importar_declaracao_anterior` |
| `converter_modelo_para_dbk` | `gerar_dbk` |
| `ler_ficha` | `listar_lancamentos` |
| `listar_fichas` | `listar_fichas` |
| `listar_lancamentos` | `listar_lancamentos` |
| `editar_lancamento` | `editar_lancamento` |
| `remover_lancamento` | `remover_lancamento` |
| `adicionar_dependente` | `adicionar_dependente` |
| `adicionar_alimentando` | `adicionar_alimentando` |
| `adicionar_rendimento_pj` | `adicionar_rendimento_pj` |
| `adicionar_rendimento_isento` | `adicionar_rendimento_isento` |
| `adicionar_rendimento_exclusivo` | `adicionar_rendimento_exclusivo` |
| `adicionar_rendimento_exigibilidade_suspensa` | `adicionar_rendimento_exigibilidade_suspensa` |
| `adicionar_rra` | `adicionar_rra` |
| `adicionar_pagamento` | `adicionar_pagamento` |
| `adicionar_doacao` | `adicionar_doacao` |
| `adicionar_doacao_direta_declaracao` | `adicionar_doacao_direta_declaracao` |
| `adicionar_bem` | `adicionar_bem` |
| `adicionar_divida` | `adicionar_divida` |
| `adicionar_herdeiro` | `adicionar_herdeiro` |
| `adicionar_doacao_eleitoral` | `adicionar_doacao_eleitoral` |
| `adicionar_ganho_capital` | uso interno |
| `listar_ganhos_capital` | `listar_ganhos_capital` |
| `adicionar_renda_variavel` | uso interno |
| `adicionar_fii_fiagro` | uso interno |
| `adicionar_imovel_rural` | `adicionar_imovel_rural` |
| `adicionar_receita_despesa_rural` | uso interno |
| `adicionar_rebanho` | uso interno |
| `adicionar_bem_rural` | `adicionar_bem_rural` |
| `adicionar_divida_rural` | `adicionar_divida_rural` |
| `definir_identificacao` | `definir_identificacao` |
| `definir_rendimentos_pf_exterior` | `definir_rendimentos_pf_exterior`, `importar_carne_leao` |
| `definir_renda_variavel` | `definir_renda_variavel` |
| `definir_fii_fiagro` | `definir_fii_fiagro` |
| `definir_espolio` | `definir_espolio` |
| `definir_saida_definitiva` | `definir_saida_definitiva` |
| `definir_informacoes_conjuge` | uso interno |
| `definir_receitas_despesas_rurais` | `definir_receitas_despesas_rurais`, `importar_livro_caixa_rural` |
| `definir_apuracao_rural` | `definir_apuracao_rural` |
| `definir_rebanho` | `definir_rebanho` |
| `definir_partilha_bem` | `definir_partilha_bem` |
| `aplicar_caso_especial_bem` | `aplicar_caso_especial_bem` |
| `buscar_nome_por_documento` | `buscar_nome_por_documento` |
| `criar_declaracao` | `criar_declaracao` |
| `criar_retificadora` | `criar_retificadora` |
| `excluir_declaracao` | `excluir_declaracao` |
| `gravar_copia_seguranca` | `gravar_copia_seguranca` |
| `listar_copias_seguranca` | `restaurar_copia_seguranca` |
| `restaurar_copia_seguranca` | `restaurar_copia_seguranca` |
| `definir_opcao_tributacao` | `definir_opcao_tributacao` |
| `definir_informacoes_bancarias` | `definir_informacoes_bancarias` |
| `definir_imposto_pago` | `definir_imposto_pago` |
| `repetir_valores_bens` | `repetir_valores_bens` |
| `importar_informe_rendimentos` | `importar_informe_rendimentos` |
| `importar_informe_plano_saude` | `importar_informe_plano_saude` |
| `transferir_excedente_isencao_65` | `transferir_excedente_isencao_65` |
| `validar_documento` | `validar_documento` |
| `validar_declaracao` | `listar_pendencias` |
| `listar_tabela` | `consultar_tabela` |
| `buscar_codigo` | `consultar_tabela` |
| `listar_arquivos` | `listar_declaracoes` |
| `verificar_integridade_arquivo` | `gerar_dbk` |
| `gerar_darf` | `gerar_darf` |
| `instruir_transmissao` | `instruir_transmissao` |
| `gerar_relatorio_declaracao` | `gerar_relatorio_declaracao` |
| `gerar_comunicacao_saida` | `gerar_comunicacao_saida` |
| `calcular_carne_leao` | `calcular_carne_leao` |
| `calcular_rra` | `calcular_rra` |
| `calcular_preco_medio` | `calcular_preco_medio` |
| `apurar_renda_variavel` | `calcular_preco_medio` |
| `calcular_ganho_capital` | `calcular_ganho_capital` |
| `calcular_acrescimos_moratorios` | `calcular_acrescimos_moratorios` |
| `calcular_condicao_residencia` | `calcular_condicao_residencia` |
| `verificar_obrigatoriedade` | `verificar_obrigatoriedade` |
| `converter_moeda` | `converter_moeda` |
| `orientar_servico_externo` | `importar_carne_leao`, `importar_gcap`, `importar_livro_caixa_rural`, `importar_pre_preenchida`, `orientar_servico_externo` |
| `verificar_versao_tabelas` | `verificar_versao_tabelas` |

## Ferramentas pendentes e parciais por prioridade

A prioridade de uma ferramenta é a mais alta entre os itens da matriz que a citam.

### P0

- Pendentes (0): nenhuma
- Parciais (5): `listar_declaracoes`, `importar_declaracao_anterior`, `importar_pre_preenchida`, `calcular_imposto`, `validar_documento`

### P1

- Pendentes (3): `registrar_recibo`, `atualizar_custo_bem`, `obter_ajuda`
- Parciais (8): `listar_ganhos_capital`, `importar_carne_leao`, `importar_gcap`, `importar_livro_caixa_rural`, `calcular_rra`, `converter_moeda`, `calcular_ganho_capital`, `gerar_relatorio_declaracao`

### P2

- Pendentes (1): `ler_informe`
- Parciais (1): `buscar_nome_por_documento`

