"""Consolida as notas de mapeamento em docs/mapeamento/funcoes-pgd-2026.md e matriz-cobertura.md.

Uso: python3 -I gera_inventario.py <dir_notas> <dir_saida>
"""
import re
import sys
import unicodedata
from collections import OrderedDict, Counter
from pathlib import Path

NOTAS = Path(sys.argv[1])
SAIDA = Path(sys.argv[2])

# ---------------------------------------------------------------- parse
RX_ITEM = re.compile(r"^## ([A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+) (.+)$")

itens = []  # (id_original, nome, linhas, arquivo)
for arq in sorted(NOTAS.glob("0*.md")):
    atual = None
    for linha in arq.read_text(encoding="utf-8").splitlines():
        m = RX_ITEM.match(linha)
        if m:
            if atual:
                itens.append(atual)
            atual = [m.group(1), m.group(2).strip(), [], arq.name]
            continue
        if linha.startswith("## ") or linha.strip() == "---" or linha.startswith("# "):
            if atual:
                itens.append(atual)
                atual = None
            continue
        if atual is not None:
            atual[2].append(linha)
    if atual:
        itens.append(atual)

# ---------------------------------------------------------------- remapeamento de IDs
def novo_id(i):
    fixos = {
        "T-AJUSTE": "S-TIPO-AJUSTE",
        "T-ESPOLIO-FINAL": "S-TIPO-DFE",
        "T-SAIDA": "S-TIPO-DSDP",
        "T-PROGRAMAS": "S-PROGRAMAS-RFB",
    }
    if i in fixos:
        return fixos[i]
    if i.startswith("G-"):
        return "S-REGRA-" + i[2:]
    if i.startswith("P-"):
        return "S-PAG-" + i[2:]
    if i.startswith("E-ESP-"):
        return "F-DFE-" + i[6:]
    return i

DESCARTAR = {"F-ISENTO-INTRO"}  # ponteiro vazio da nota 02 (o conteúdo está na nota 03)
mapa = {i[0]: novo_id(i[0]) for i in itens}
antigos = sorted(mapa, key=len, reverse=True)
RX_ANTIGO = re.compile(r"(?<![A-Z0-9-])(" + "|".join(re.escape(a) for a in antigos) + r")(?![A-Z0-9-])")

def troca_ids(txt):
    return RX_ANTIGO.sub(lambda m: mapa[m.group(1)], txt)

registros = OrderedDict()
for ida, nome, linhas, arq in itens:
    if ida in DESCARTAR:
        continue
    nid = mapa[ida]
    if nid in registros:
        raise SystemExit(f"ID duplicado: {nid}")
    corpo = [troca_ids(l) for l in linhas if l.strip()]
    registros[nid] = dict(id=nid, antigo=ida, nome=nome, corpo=corpo, arq=arq)

# ---------------------------------------------------------------- seções
SECOES = [
    ("1", "Menus, telas e ações do programa", [
        ("1.1", "Menus principais, barra de ferramentas e rodapé", r"M-(MENU-.*|TOOLBAR|RODAPE-.*)"),
        ("1.2", "Tela inicial", r"M-INICIAL(-.*)?"),
        ("1.3", "Menu Declaração", r"M-DECL-.*"),
        ("1.4", "Impressão", r"M-IMPR-.*"),
        ("1.5", "Importações", r"M-IMP-.*"),
        ("1.6", "Ferramentas", r"M-FERR-.*"),
        ("1.7", "Ajuda", r"M-AJUDA-.*"),
        ("1.8", "Ações de demonstrativo", r"M-DEMO-.*"),
    ]),
    ("2", "Tipos de declaração e regras gerais", [
        ("2.1", "Tipos de declaração e programas relacionados", r"S-(TIPO-.*|PROGRAMAS-RFB)"),
        ("2.2", "Situações individuais, residência e regras de rendimentos", r"S-REGRA-(CASADO|COMPANHEIRO|SEPARADO-FATO|DIVORCIADO|VIUVO|MENOR|EMANCIPADO|INCAPAZ|ESPOLIO|ESPOLIO-FINAL|AUSENTE-.*|RESIDENTE|NAO-RESIDENTE|DIPLOMATICO|CONVERSAO|REND-TRAB|ALUGUEIS|AR-RESULTADO|RRA|OUTROS-REND)"),
        ("2.3", "Obrigatoriedade, regime, prazo, multa e retificação", r"S-REGRA-(OBRIG|REGIME|PREENCHIMENTO|PRAZO|MULTA-ATRASO|RETIF|APOS-PRAZO|EXERC-ANT)"),
    ]),
    ("3", "Fichas da declaração", [
        ("3.1", "Início e Identificação do Contribuinte", r"F-(INICIO|IDENT(-.*)?)"),
        ("3.2", "Dependentes e Alimentandos", r"F-(DEP|ALIM)"),
        ("3.3", "Rendimentos Tributáveis Recebidos de PJ", r"F-RTPJ-.*"),
        ("3.4", "Rendimentos Tributáveis Recebidos de PF e do Exterior", r"F-RTPF(-.*)?"),
        ("3.5", "Rendimentos Isentos e Não Tributáveis", r"F-ISENTO(-.*)?"),
        ("3.6", "Rendimentos Sujeitos à Tributação Exclusiva/Definitiva", r"F-EXCL(-.*)?"),
        ("3.7", "Rendimentos Tributáveis de PJ com Exigibilidade Suspensa", r"F-SUSP(-.*)?"),
        ("3.8", "Rendimentos Recebidos Acumuladamente", r"F-RRA(-.*)?"),
        ("3.9", "Imposto Pago/Retido", r"F-IMPPAGO(-.*)?"),
        ("3.10", "Pagamentos Efetuados", r"F-PAG(-.*)?"),
        ("3.11", "Doações Efetuadas", r"F-DOA(-.*)?"),
        ("3.12", "Doações Diretamente na Declaração", r"F-DDD(-.*)?"),
        ("3.13", "Bens e Direitos", r"F-BENS(-.*)?"),
        ("3.14", "Dívidas e Ônus Reais", r"F-DIV"),
        ("3.15", "Espólio (ajuste com natureza 81)", r"F-ESPOLIO"),
        ("3.16", "Doações a Partidos Políticos e Candidatos", r"F-PARTIDOS"),
        ("3.17", "Informações do Cônjuge", r"F-CONJUGE"),
        ("3.18", "Declaração de Saída Definitiva do País", r"F-SAIDA(-.*)?"),
        ("3.19", "Declaração Final de Espólio", r"F-DFE-.*"),
        ("3.20", "Resumo da Declaração", r"F-RESUMO-.*"),
    ]),
    ("4", "Demonstrativos", [
        ("4.1", "Atividade Rural", r"D-AR-.*"),
        ("4.2", "Ganhos de Capital", r"D-GCAP-.*"),
        ("4.3", "Renda Variável, operações comuns e day-trade", r"D-RV-.*"),
        ("4.4", "Operações em FII ou Fiagro", r"D-FII-.*"),
        ("4.5", "Carnê-Leão", r"D-CL-.*"),
    ]),
    ("5", "Pagamento do imposto, quotas, débito automático e Darf", [
        ("5.1", "Pagamento", r"S-PAG-.*"),
    ]),
    ("6", "Operações do sistema: gravação, pendências, transmissão e recibo", [
        ("6.1", "Operações", r"S-(SALVAMENTO|UMA-ABERTA|GRAVAR-ENTREGA|TRANSMISSAO|RECIBO|NOTIFICACAO-MAED|VALIDADOR|CALAMIDADE|ERROS-FREQ|REQUISITOS|PROBLEMAS-IMPRESSAO)"),
    ]),
    ("7", "Serviços em nuvem", [
        ("7.1", "Serviços do barramento da RFB", r"S-NUVEM-.*"),
    ]),
    ("8", "Arquivo da declaração e formatos de troca", [
        ("8.1", "Layout do arquivo e informes", r"S-ARQ-.*"),
    ]),
    ("9", "Tabelas", [
        ("9.1", "Tabelas da Ajuda", r"S-TAB-.*"),
    ]),
]

alocado = {}
for num, titulo, subs in SECOES:
    for snum, stitulo, rx in subs:
        crx = re.compile(rx + r"$")
        for rid in registros:
            if rid not in alocado and crx.match(rid):
                alocado[rid] = snum
faltando = [r for r in registros if r not in alocado]
if faltando:
    raise SystemExit("Sem seção: " + ", ".join(faltando))

def ancora(texto):
    t = texto.lower()
    t = "".join(ch for ch in t if ch.isalnum() or ch in " -_")
    return t.replace(" ", "-")

# ---------------------------------------------------------------- ferramentas MCP (catálogo deduplicado)
F = OrderedDict()
def ferr(nome, desc, params, escreve, modulo):
    F[nome] = dict(desc=desc, params=params, escreve=escreve, modulo=modulo)

# ciclo de vida
ferr("criar_declaracao", "Cria uma declaração do exercício 2026 (ajuste anual, final de espólio ou saída definitiva) em branco, a partir da declaração de 2025 ou de arquivo da pré-preenchida.", "tipo (ajuste|final_espolio|saida_definitiva), modo (em_branco|importar_anterior|pre_preenchida), cpf, nome, arquivo_origem?", "sim", "model")
ferr("listar_declaracoes", "Lista as declarações locais com situação (em preenchimento, transmitida), tipo e modelo; aceita filtro por nome ou CPF.", "filtro?, situacao?", "não", "model")
ferr("abrir_declaracao", "Carrega uma declaração e devolve visão geral: tipo, fichas preenchidas, totais e pendências resumidas.", "id_declaracao | cpf + exercicio", "não", "model")
ferr("excluir_declaracao", "Exclui uma ou mais declarações locais após confirmação explícita.", "ids, confirmar", "sim", "model")
ferr("criar_retificadora", "Cria a retificadora a partir de uma declaração do exercício, exigindo o número do recibo da anterior e aplicando as travas de prazo (troca de regime, bens de espólio, débito automático).", "id_origem, numero_recibo", "sim", "model")
ferr("registrar_recibo", "Registra o recibo de entrega informado pelo usuário (número de 12 dígitos ou arquivo do recibo gerado pelo PGD) e marca a declaração como transmitida.", "id_declaracao, numero_recibo? | arquivo_recibo?", "sim", "importacao")
ferr("gravar_copia_seguranca", "Grava cópia de segurança (dados atuais, cópia para entrega ou transmitida com recibo) no formato do AutoIR.", "ids, tipo (dados_atuais|entrega|transmitida_com_recibo), destino", "sim", "model")
ferr("restaurar_copia_seguranca", "Restaura cópia de segurança do AutoIR, avisando se substitui declaração existente do mesmo CPF.", "arquivo, sobrescrever?", "sim", "model")
ferr("listar_fichas", "Lista as fichas e demonstrativos aplicáveis ao tipo da declaração, com estado de preenchimento e sugestões (equivale à aba Início e ao menu Fichas).", "id_declaracao", "não", "model")
ferr("listar_lancamentos", "Lista os lançamentos de uma ficha ou demonstrativo, com chave de cada item.", "id_declaracao, ficha, filtro?", "não", "model")
ferr("editar_lancamento", "Altera campos de um lançamento existente em qualquer ficha, revalidando o item.", "id_declaracao, ficha, id_lancamento, campos", "sim", "model")
ferr("remover_lancamento", "Remove um ou mais lançamentos; para dependentes aplica a exclusão em cascata do PGD e lista as fichas que exigem ação manual.", "id_declaracao, ficha, ids_lancamento, cascata?", "sim", "model")
# fichas
ferr("definir_identificacao", "Grava a ficha Identificação: tipo de declaração e recibos, nome, nascimento, doença grave, raça/cor, alteração cadastral, cônjuge, retorno ao país, endereço (Brasil ou exterior) e ocupação.", "tipo_declaracao, recibo_anterior?, nome, data_nascimento, doenca_grave, raca_cor, alteracao_cadastral, conjuge_cpf?, data_retorno?, endereco, natureza_ocupacao, ocupacao_principal, registro_profissional?", "sim", "model")
ferr("adicionar_dependente", "Inclui dependente com código de relação, CPF, nascimento e contatos, validando idade, duplicidade e CPF do titular.", "codigo_dependencia, nome, cpf, data_nascimento, raca_cor, celular?, email?, mora_com_titular, saiu_mesma_data?", "sim", "model")
ferr("adicionar_alimentando", "Inclui alimentando com residência, vínculo (titular ou dependente) e dados da decisão judicial ou escritura pública.", "residente, cpf, nome, data_nascimento, vinculado_a, tipo_processo, escritura?, decisao_judicial?", "sim", "model")
ferr("adicionar_rendimento_pj", "Inclui rendimento tributável recebido de PJ (ou PF empregadora) pelo titular ou dependente; transporta o 13º para Tributação Exclusiva.", "beneficiario (titular|cpf_dependente), cpf_cnpj_fonte, nome_fonte, rendimentos, previdencia_oficial, irrf, decimo_terceiro, irrf_13", "sim", "model")
ferr("definir_rendimentos_pf_exterior", "Grava a grade mensal de rendimentos de PF e do exterior (titular ou dependente): trabalho não assalariado com pagadores, aluguéis, outros, exterior, previdência, dependentes, pensão, livro Caixa, Carnê-Leão pago e NIT.", "beneficiario, mes, valores_por_coluna, pagadores?, nit?", "sim", "model")
ferr("adicionar_rendimento_isento", "Inclui lançamento na ficha Rendimentos Isentos por código (01 a 28 e 99) com o schema próprio de cada código.", "codigo, beneficiario, cpf_cnpj_fonte?, nome_fonte?, valor, campos_do_codigo?, chave_bem?", "sim", "model")
ferr("adicionar_rendimento_exclusivo", "Inclui lançamento na ficha Tributação Exclusiva/Definitiva por código (01 a 13 e 99).", "codigo, beneficiario, cpf_cnpj_fonte?, nome_fonte?, valor, descricao?, chave_bem?", "sim", "model")
ferr("adicionar_rendimento_exigibilidade_suspensa", "Inclui rendimento de PJ com exigibilidade suspensa (titular ou dependente) e depósitos judiciais.", "beneficiario, cpf_cnpj_fonte, nome_fonte, rendimentos, depositos_judiciais", "sim", "model")
ferr("adicionar_rra", "Inclui rendimento recebido acumuladamente com a opção de tributação (ajuste ou exclusiva), parcelas, meses, deduções e pensão por alimentando.", "beneficiario, opcao_tributacao, cpf_cnpj_fonte, nome_fonte, rendimentos, parcela_isenta_65, juros, previdencia, pensao_por_alimentando, irrf, mes_recebimento, numero_meses", "sim", "model")
ferr("definir_imposto_pago", "Grava as linhas editáveis da ficha Imposto Pago/Retido (imposto complementar, imposto pago no exterior, IRRF da Lei 11.033/2004).", "imposto_complementar?, imposto_exterior?, irrf_lei_11033?", "sim", "model")
ferr("adicionar_pagamento", "Inclui pagamento efetuado por código, com beneficiário, CPF/CNPJ conforme o código, despesa do titular, dependente ou alimentando e parcela não dedutível.", "codigo, realizado_com, chave_dependente_ou_alimentando?, nome_beneficiario, cpf_cnpj_beneficiario?, descricao, valor_pago, parcela_nao_dedutivel?, contribuicao_patrocinador?", "sim", "model")
ferr("adicionar_doacao", "Inclui doação efetuada por código (40 a 47, 80, 81, 99).", "codigo, nome_beneficiario, cpf_cnpj?, valor, parcela_nao_dedutivel?", "sim", "model")
ferr("adicionar_doacao_direta_declaracao", "Inclui doação diretamente na declaração ao fundo ECA ou Pessoa Idosa (nacional, estadual ou municipal), informando o valor máximo dedutível.", "fundo (eca|idoso), esfera, uf?, municipio?, valor", "sim", "model")
ferr("adicionar_bem", "Inclui bem ou direito com grupo, código, país, discriminação, situações por data e campos condicionais (endereço, registros, banco, CNPJ, criptoativo, aplicação no exterior, lucros, campos de espólio ou saída).", "grupo, codigo, pais, discriminacao, situacao_2024?, situacao_2025?, pertence_a?, campos_do_codigo, aplicacao_financeira?, lucros_dividendos?", "sim", "model")
ferr("aplicar_caso_especial_bem", "Assistente que monta os lançamentos de casos especiais de bens (benfeitoria, consórcio contemplado, leasing, permuta, doação, herança, dissolução, exterior, moeda em espécie, novo residente, desincorporação) e os reflexos em Isentos, Dívidas e GCAP.", "cenario, dados_do_cenario", "sim", "model")
ferr("repetir_valores_bens", "Copia a situação em 31/12/2024 para 31/12/2025 (ou para a data da não residência) nos bens selecionados.", "ids_bens", "sim", "model")
ferr("adicionar_divida", "Inclui dívida ou ônus real com código, discriminação, situações e valor pago, avisando dispensas (até R$ 5.000,00, alienação fiduciária, consórcio, rural).", "codigo, discriminacao, situacao_2024?, situacao_2025?, valor_pago?, situacao_especial?", "sim", "model")
ferr("definir_espolio", "Grava a ficha Espólio (ajuste com natureza 81 ou Final de Espólio): sobrepartilha, inventariante, partilha, bens a inventariar, ano do óbito, tipo de inventário e dados do cônjuge.", "modalidade, inventariante, ano_obito?, final_espolio?, ha_bens_a_inventariar?, tipo_inventario?, decisao_judicial?, escritura?, conjuge?", "sim", "model")
ferr("adicionar_herdeiro", "Inclui herdeiro ou meeiro na Declaração Final de Espólio.", "cpf_cnpj, nome", "sim", "model")
ferr("definir_partilha_bem", "Define, para um bem da Final de Espólio, bem a inventariar, usufruto, situação na partilha, percentuais por herdeiro e valor de transferência.", "id_bem, bem_a_inventariar?, usufruto?, situacao_partilha?, percentuais [cpf_cnpj, percentual], valor_transferencia?", "sim", "model")
ferr("adicionar_doacao_eleitoral", "Inclui doação a partido político ou candidato (informativa).", "cnpj, nome, valor", "sim", "model")
ferr("definir_saida_definitiva", "Grava a ficha Saída: procurador, data da condição de não residente, data de aquisição de residência e país de nova residência.", "procurador?, data_nao_residente, data_residente?, pais_nova_residencia?", "sim", "model")
ferr("definir_informacoes_bancarias", "Grava conta para restituição (inclusive Pix pela chave CPF), número de quotas e débito automático, validando banco, agência, conta e DV.", "banco?, agencia?, conta?, tipo_conta?, pix?, numero_quotas?, debito_automatico?, data_prevista_entrega?", "sim", "model")
ferr("definir_opcao_tributacao", "Escolhe o modelo de tributação (deduções legais ou desconto simplificado), preservando as deduções informadas.", "opcao (completa|simplificada)", "sim", "model")
# demonstrativos
ferr("adicionar_imovel_rural", "Inclui imóvel explorado na atividade rural (Brasil ou exterior) com atividade, CIB, área, condição de exploração, participação e participantes.", "ambito, codigo_atividade, nome, localizacao, cib?, area_ha, condicao_exploracao, participacao, participantes?", "sim", "model")
ferr("definir_receitas_despesas_rurais", "Grava receitas e despesas da atividade rural: grade mensal no Brasil ou totais anuais por país no exterior.", "ambito, mes? | pais?, receita, despesa, resultado_usd?", "sim", "model")
ferr("definir_apuracao_rural", "Grava os campos informados da apuração do resultado rural (prejuízo anterior, opção 20% ou resultado, compensação, adiantamentos, limite de 20% no exterior, cotação na DFE ou DSDP).", "ambito, prejuizo_anterior?, opcao, compensacao?, adiantamentos_2025?, adiantamentos_ate_2024_entregues?, limite_20_exterior?, cotacao?", "sim", "model")
ferr("definir_rebanho", "Grava a movimentação do rebanho por espécie (Brasil ou exterior) e calcula o estoque final.", "ambito, especie, estoque_inicial, aquisicoes, nascimentos, consumo_perdas, vendas", "sim", "model")
ferr("adicionar_bem_rural", "Inclui bem da atividade rural com código, país, discriminação e situações.", "codigo, pais, discriminacao, situacao_2024?, situacao_2025?", "sim", "model")
ferr("adicionar_divida_rural", "Inclui dívida vinculada à atividade rural (Brasil ou exterior).", "ambito, discriminacao, situacao_2024?, situacao_2025?, valor_pago?", "sim", "model")
ferr("definir_renda_variavel", "Grava o mês do demonstrativo de Renda Variável (comuns e day-trade) do titular ou dependente: ganhos por mercado, prejuízo inicial, IRRF day-trade, IRRF Lei 11.033 e imposto pago.", "beneficiario, mes, comum{mercado: valor}, day_trade{mercado: valor}, prejuizo_inicial?, irrf_day_trade?, irrf_lei_11033?, imposto_pago?", "sim", "model")
ferr("definir_fii_fiagro", "Grava o mês do demonstrativo de operações em FII ou Fiagro (titular ou dependente).", "beneficiario, mes, resultado, prejuizo_inicial?, imposto_pago?", "sim", "model")
ferr("listar_ganhos_capital", "Lista os demonstrativos de ganhos de capital importados por tipo (imóveis, móveis, participações, moeda em espécie) e os valores transportados.", "id_declaracao, tipo?", "não", "model")
# importações
ferr("importar_declaracao_anterior", "Importa dados da declaração de 2025 a partir do arquivo .DEC gravado ou transmitido, sem apagar silenciosamente o que já foi digitado.", "arquivo, cpfs?, id_destino?, mesclar?", "sim", "importacao")
ferr("importar_pre_preenchida", "Importa o arquivo da declaração pré-preenchida obtido pelo usuário fora do AutoIR.", "arquivo, id_destino?", "sim", "importacao")
ferr("importar_informe_rendimentos", "Importa informe de rendimentos em XML (layout público da RFB) para as fichas correspondentes, com detecção de duplicidade.", "id_declaracao, arquivo, beneficiario?", "sim", "importacao")
ferr("importar_informe_plano_saude", "Importa informe de plano de saúde em XML para Pagamentos Efetuados (código 26 e reembolsos), com detecção de duplicidade.", "id_declaracao, arquivo", "sim", "importacao")
ferr("importar_carne_leao", "Importa o demonstrativo do Carnê-Leão 2025 obtido pelo usuário para a ficha PF/Exterior do titular ou dependente, respeitando as regras de não sobrescrita.", "id_declaracao, arquivo, cpf_beneficiario?", "sim", "importacao")
ferr("importar_gcap", "Importa o arquivo exportado pelo GCAP 2025, substituindo os dados do mesmo CPF e transportando valores para Isentos, Exclusivos e Resumo.", "id_declaracao, arquivo", "sim", "importacao")
ferr("importar_livro_caixa_rural", "Importa o arquivo exportado pelo Livro Caixa da Atividade Rural 2025 para Receitas e Despesas e Apuração.", "id_declaracao, arquivo", "sim", "importacao")
ferr("ler_informe", "Apresenta de forma legível um informe XML (rendimentos ou plano de saúde) sem importá-lo.", "arquivo", "não", "importacao")
# cálculo e validação
ferr("calcular_imposto", "Calcula o Resumo (rendimentos, deduções, base, imposto devido, incentivos, RRA, Lei 14.754, imposto pago, saldo) nos dois modelos, recomenda o melhor e explica a procedência de cada linha.", "id_declaracao, modelo (completo|simplificado|ambos), detalhar?", "não", "calc")
ferr("listar_pendencias", "Executa as validações e devolve erros (impedem a entrega) e avisos, com ficha, campo, item e mensagem.", "id_declaracao, severidade?", "não", "validate")
ferr("verificar_obrigatoriedade", "Avalia os 12 critérios de obrigatoriedade e as dispensas a partir da declaração ou de respostas do usuário.", "id_declaracao? | respostas?", "não", "validate")
ferr("simular_quotas", "Calcula número máximo de quotas, valor de cada quota, vencimentos e elegibilidade ao débito automático pela data prevista de entrega.", "saldo_a_pagar, numero_quotas?, data_entrega?, tipo_declaracao?", "não", "calc")
ferr("gerar_darf", "Calcula os dados de um Darf (0211 por quota, multa por atraso, 3351 ECA, 9090 Pessoa Idosa, 0190, 4600, 8523, 8960, 6015) com multa e juros e gera um demonstrativo em PDF não oficial, com instruções para emitir o documento oficial.", "id_declaracao?, tipo, quota?, data_pagamento?, selic_acumulada?, destino?", "sim (opcional)", "calc")
ferr("calcular_acrescimos_moratorios", "Calcula multa de mora (0,33% ao dia, limite 20%) e juros Selic acumulada mais 1% para qualquer débito vencido.", "principal, vencimento, data_pagamento, selic_mensal", "não", "calc")
ferr("calcular_multa_atraso", "Calcula a multa por atraso na entrega (1% ao mês, mínimo R$ 165,74, máximo 20%).", "imposto_devido, data_entrega, tipo_declaracao", "não", "calc")
ferr("calcular_rra", "Simula o imposto de RRA pela tabela acumulada (exclusiva) e compara com a opção pelo ajuste.", "rendimentos, numero_meses, mes_recebimento, previdencia, pensao, irrf, parcelas?", "não", "calc")
ferr("transferir_excedente_isencao_65", "Aplica o limite da parcela isenta de 65 anos (R$ 1.903,98 por mês) somando as fontes e transfere o excedente para Rendimentos PJ, como a pergunta do PGD.", "id_declaracao, beneficiario?", "sim", "calc")
ferr("converter_moeda", "Converte valores pela tabela oficial do dólar de 2025 (compra para rendimentos e imposto, venda para deduções) ou por cotação informada para outras regras.", "valor, moeda, data_ou_mes, finalidade (rendimento|deducao|bem|aplicacao), cotacao?", "não", "tabelas")
ferr("atualizar_custo_bem", "Atualiza custo de bem adquirido até 1995 pela Tabela de Atualização do Custo de Bens e Direitos.", "valor_original, moeda_epoca, mes, ano", "não", "tabelas")
ferr("calcular_condicao_residencia", "Determina datas de aquisição de residência ou de não residência a partir de entradas, saídas, vistos e vínculos.", "eventos[], visto?, vinculo_empregaticio?", "não", "calc")
ferr("calcular_ganho_capital", "Simulador próprio de ganho de capital (imóvel, móvel, participação, moeda em espécie) com isenções e reduções, apenas para orientação; não substitui o GCAP oficial.", "tipo, dados_alienacao, dados_aquisicao, perguntas_isencao", "não", "calc")
ferr("calcular_preco_medio", "Calcula custo médio ponderado e ganho por operação a partir de notas de corretagem (ações, ouro, opções, termo, futuro, FII) para preencher a Renda Variável.", "operacoes[]", "não", "calc")
ferr("calcular_carne_leao", "Simula o Carnê-Leão mensal pela tabela mensal vigente no mês.", "mes, rendimentos, deducoes", "não", "calc")
ferr("validar_documento", "Valida CPF, CNPJ, NIT/PIS, número de recibo, CEP, nome, data e conta bancária com DV por banco.", "tipo, valor, banco?", "não", "validate")
ferr("consultar_tabela", "Consulta as tabelas de códigos e parâmetros do exercício (bens, rendimentos, pagamentos, doações, dependência, países, municípios, bancos, fundos, alíquotas, prazos).", "tabela, filtro?", "não", "tabelas")
ferr("obter_ajuda", "Responde com as regras oficiais de uma ficha, campo ou tópico (orientação equivalente à Ajuda do PGD), citando a página da Ajuda.", "topico | ficha + campo, busca?", "não", "tabelas")
ferr("buscar_nome_por_documento", "Sugere o nome já informado para um CPF ou CNPJ nas declarações locais (equivalente à Recuperação de Nomes).", "cpf_cnpj", "não", "model")
ferr("verificar_versao_tabelas", "Informa a versão das tabelas e parâmetros embarcados e alerta se o PGD conhecido for mais novo.", "nenhum", "não", "tabelas")
# saídas
ferr("gerar_dbk", "Gera o arquivo da declaração no layout oficial de 2026 (registros IR, 16 a 99 e T9) com o nome padrão, bloqueando se houver erros impeditivos.", "id_declaracao, destino", "sim", "dbk")
ferr("gerar_relatorio_declaracao", "Gera relatório da declaração (toda ou partes, inclusive rendimentos de PF e demonstrativos) em PDF ou HTML com layout próprio.", "id_declaracao, partes?, formato (pdf|html), destino", "sim", "model")
ferr("gerar_comunicacao_saida", "Gera a comunicação à fonte pagadora de saída definitiva do país, uma por fonte.", "id_declaracao, fontes?, destino", "sim", "model")
ferr("instruir_transmissao", "Gera o passo a passo e o checklist para concluir no PGD oficial: abrir ou restaurar a declaração, verificar pendências, entregar com ou sem certificado, guardar o recibo e pagar o Darf.", "id_declaracao", "não", "dbk")
ferr("orientar_servico_externo", "Explica como usar um serviço que só existe fora do AutoIR (gov.br, pré-preenchida, Carnê-Leão Web, e-CAC, débito automático, extrato, Darf oficial, GCAP, LCAR, Sicalc, Correios) e o que trazer de volta.", "servico, contexto?", "não", "tabelas")

# ---------------------------------------------------------------- estado atual do servidor (packages/mcp/src/ferramentas)
EXISTENTES = [
    # calculo
    "simular_imposto", "comparar_modelos", "explicar_calculo", "calcular_quotas", "calcular_multa_atraso",
    "consultar_parametros",
    # declaracao
    "abrir_declaracao", "converter_dbk_para_modelo", "converter_modelo_para_dbk",
    # fichas e edição (CRUD por ficha: adicionar_*, editar_*, remover_*, listar_*)
    "ler_ficha", "listar_fichas", "listar_lancamentos", "editar_lancamento", "remover_lancamento",
    "adicionar_dependente", "adicionar_alimentando", "adicionar_rendimento_pj", "adicionar_rendimento_isento",
    "adicionar_rendimento_exclusivo", "adicionar_rendimento_exigibilidade_suspensa", "adicionar_rra",
    "adicionar_pagamento", "adicionar_doacao", "adicionar_doacao_direta_declaracao", "adicionar_bem",
    "adicionar_divida", "adicionar_herdeiro", "adicionar_doacao_eleitoral", "adicionar_ganho_capital",
    "listar_ganhos_capital", "adicionar_renda_variavel", "adicionar_fii_fiagro", "adicionar_imovel_rural",
    "adicionar_receita_despesa_rural", "adicionar_rebanho", "adicionar_bem_rural", "adicionar_divida_rural",
    "definir_identificacao", "definir_rendimentos_pf_exterior", "definir_renda_variavel", "definir_fii_fiagro",
    "definir_espolio", "definir_saida_definitiva", "definir_informacoes_conjuge", "definir_receitas_despesas_rurais",
    "definir_apuracao_rural", "definir_rebanho", "definir_partilha_bem", "aplicar_caso_especial_bem",
    "buscar_nome_por_documento",
    # ciclo
    "criar_declaracao", "criar_retificadora", "excluir_declaracao", "gravar_copia_seguranca",
    "listar_copias_seguranca", "restaurar_copia_seguranca", "definir_opcao_tributacao",
    "definir_informacoes_bancarias", "definir_imposto_pago", "repetir_valores_bens",
    "importar_informe_rendimentos", "importar_informe_plano_saude", "transferir_excedente_isencao_65",
    # validação, tabelas e arquivos
    "validar_documento", "validar_declaracao", "listar_tabela", "buscar_codigo", "listar_arquivos",
    "verificar_integridade_arquivo",
    # saídas
    "gerar_darf", "instruir_transmissao", "gerar_relatorio_declaracao", "gerar_comunicacao_saida",
    # calculadoras
    "calcular_carne_leao", "calcular_rra", "calcular_preco_medio", "apurar_renda_variavel",
    "calcular_ganho_capital", "calcular_acrescimos_moratorios", "calcular_condicao_residencia",
    "verificar_obrigatoriedade", "converter_moeda",
    # orientação
    "orientar_servico_externo", "verificar_versao_tabelas",
]
EDICAO = "edição pelo fluxo abrir, alterar o modelo, validar e gravar o DBK com cópia de segurança"
ONLINE = "serviço online: só orientação com `orientar_servico_externo`; o AutoIR não acessa a rede"
_IMPL = {n: ([n], EDICAO) for n in [
    "definir_identificacao", "adicionar_dependente", "adicionar_alimentando", "adicionar_rendimento_pj",
    "definir_rendimentos_pf_exterior", "adicionar_rendimento_isento", "adicionar_rendimento_exclusivo",
    "adicionar_rendimento_exigibilidade_suspensa", "adicionar_rra", "adicionar_pagamento", "adicionar_doacao",
    "adicionar_doacao_direta_declaracao", "adicionar_bem", "aplicar_caso_especial_bem", "adicionar_divida",
    "definir_espolio", "adicionar_herdeiro", "definir_partilha_bem", "adicionar_doacao_eleitoral",
    "definir_saida_definitiva", "adicionar_imovel_rural", "definir_receitas_despesas_rurais",
    "definir_apuracao_rural", "definir_rebanho", "adicionar_bem_rural", "adicionar_divida_rural",
    "definir_renda_variavel", "definir_fii_fiagro", "definir_imposto_pago", "repetir_valores_bens",
    "definir_informacoes_bancarias", "definir_opcao_tributacao",
]}
STATUS = {n: ("implementada", ex, ob) for n, (ex, ob) in _IMPL.items()}
STATUS.update({
    "criar_declaracao": ("implementada", ["criar_declaracao"], "cria o DBK em branco com o nome padrão; a partir de outro arquivo use `criar_retificadora` ou `gravar_copia_seguranca`"),
    "abrir_declaracao": ("implementada", ["abrir_declaracao"], "lê DBK/DEC da pasta autorizada e resume"),
    "excluir_declaracao": ("implementada", ["excluir_declaracao"], "exige confirmação com o nome do arquivo e guarda cópia de segurança"),
    "criar_retificadora": ("implementada", ["criar_retificadora"], "a partir de DBK ou DEC, com o número do recibo"),
    "gravar_copia_seguranca": ("implementada", ["gravar_copia_seguranca"], ""),
    "restaurar_copia_seguranca": ("implementada", ["restaurar_copia_seguranca", "listar_copias_seguranca"], ""),
    "listar_fichas": ("implementada", ["listar_fichas"], ""),
    "listar_lancamentos": ("implementada", ["listar_lancamentos", "ler_ficha"], "também `listar_*` por ficha"),
    "editar_lancamento": ("implementada", ["editar_lancamento"], "também `editar_*` por ficha"),
    "remover_lancamento": ("implementada", ["remover_lancamento"], "com cascata dos vínculos de dependente e alimentando"),
    "importar_informe_rendimentos": ("implementada", ["importar_informe_rendimentos"], "texto ou JSON colado; sem OCR"),
    "importar_informe_plano_saude": ("implementada", ["importar_informe_plano_saude"], "texto ou JSON colado; sem OCR"),
    "calcular_imposto": ("implementada", ["simular_imposto", "comparar_modelos", "explicar_calculo"], "dois modelos e memória de cálculo; 48 de 48 casos golden ao centavo, inclusive atividade rural no Brasil; RRA pela opção do ajuste e Lei 14.754 ficam com os valores do arquivo"),
    "registrar_recibo": ("implementada", ["registrar_recibo", "criar_retificadora"], "guarda o número informado pelo usuário em <declaração>.recibo.json; a retificadora o reaproveita"),
    "atualizar_custo_bem": ("implementada", ["atualizar_custo_bem"], "UFIR de 1º/1/1996, coeficiente informado e Lei 14.973/2024, com os valores do usuário"),
    "obter_ajuda": ("implementada", ["obter_ajuda"], "tópicos gerados das notas de mapeamento (tools/mapeamento/gera_ajuda.mjs)"),
    "ler_informe": ("implementada", ["ler_informe"], "texto colado ou .txt da pasta, regras fixas por rótulo; sem XML, PDF ou OCR"),
    "listar_pendencias": ("implementada", ["validar_declaracao"], "catálogo de regras a ampliar para todas as fichas"),
    "verificar_obrigatoriedade": ("implementada", ["verificar_obrigatoriedade"], "critérios de 2026 a partir das respostas do usuário"),
    "simular_quotas": ("implementada", ["calcular_quotas"], "falta elegibilidade do débito automático pela data de entrega"),
    "gerar_darf": ("implementada", ["gerar_darf"], "código, vencimentos e valores das quotas; o Darf oficial é emitido no programa ou no Sicalc"),
    "calcular_acrescimos_moratorios": ("implementada", ["calcular_acrescimos_moratorios"], "Selic acumulada informada pelo usuário"),
    "calcular_multa_atraso": ("implementada", ["calcular_multa_atraso"], ""),
    "calcular_rra": ("parcial", ["calcular_rra"], "simulador; a ficha RRA é preenchida com `adicionar_rra`"),
    "transferir_excedente_isencao_65": ("implementada", ["transferir_excedente_isencao_65"], ""),
    "converter_moeda": ("parcial", ["converter_moeda"], "só com cotação informada pelo usuário (sem download de cotações)"),
    "calcular_condicao_residencia": ("implementada", ["calcular_condicao_residencia"], ""),
    "calcular_ganho_capital": ("parcial", ["calcular_ganho_capital"], "simulador de orientação; o demonstrativo oficial é o GCAP"),
    "calcular_preco_medio": ("implementada", ["calcular_preco_medio", "apurar_renda_variavel"], ""),
    "calcular_carne_leao": ("implementada", ["calcular_carne_leao"], "tabelas mensais de 2025"),
    "validar_documento": ("parcial", ["validar_documento"], "só CPF e CNPJ; a conta bancária é validada em `definir_informacoes_bancarias`"),
    "consultar_tabela": ("implementada", ["listar_tabela", "buscar_codigo", "consultar_parametros"], ""),
    "buscar_nome_por_documento": ("parcial", ["buscar_nome_por_documento"], "busca só nas declarações da pasta; a consulta à Receita é " + ONLINE),
    "verificar_versao_tabelas": ("implementada", ["verificar_versao_tabelas"], "versão embarcada, sem consulta online"),
    "gerar_dbk": ("implementada", ["converter_modelo_para_dbk", "gerar_arquivo_entrega", "verificar_integridade_arquivo"], "conversão de todas as fichas; registros sem campo no modelo são preservados do arquivo base; totais recalculados com o motor; o .DEC de entrega sai de gerar_arquivo_entrega, igual ao do programa nos 48 casos"),
    "gerar_relatorio_declaracao": ("parcial", ["gerar_relatorio_declaracao"], "relatório em texto; sem PDF ou HTML"),
    "gerar_comunicacao_saida": ("implementada", ["gerar_comunicacao_saida"], "só o texto"),
    "instruir_transmissao": ("implementada", ["instruir_transmissao"], ""),
    "orientar_servico_externo": ("implementada", ["orientar_servico_externo"], ""),
    "importar_declaracao_anterior": ("parcial", ["converter_dbk_para_modelo"], "lê DBK/DEC do exercício 2026; falta o leiaute 2025 e a regra de quais dados migrar"),
    "listar_declaracoes": ("parcial", ["listar_arquivos"], "lista arquivos da pasta autorizada, sem situação em preenchimento ou transmitida"),
    "listar_ganhos_capital": ("parcial", ["listar_ganhos_capital"], "demonstrativos 64, 67 e 70 a 78 do GCAP preservados sem campo no modelo"),
    "importar_pre_preenchida": ("parcial", ["abrir_declaracao", "orientar_servico_externo"], ONLINE + "; o DBK gravado pelo programa é aberto normalmente"),
    "importar_carne_leao": ("parcial", ["definir_rendimentos_pf_exterior", "orientar_servico_externo"], ONLINE + "; os totais mensais são informados na ficha"),
    "importar_gcap": ("parcial", ["abrir_declaracao", "orientar_servico_externo"], "o DBK com o GCAP importado no programa é preservado; sem leitura do arquivo do GCAP"),
    "importar_livro_caixa_rural": ("parcial", ["definir_receitas_despesas_rurais", "orientar_servico_externo"], "totais mensais informados na ficha; sem leitura do arquivo do LCAR"),
})
for _n in STATUS:
    assert _n in F, _n

def status_ferr(n):
    return STATUS.get(n, ("pendente", [], ""))

def status_linha(fs):
    nomes = re.findall(r"`([a-z0-9_]+)`", fs)
    if not nomes:
        if fs.startswith("todas"):
            return "implementada (gravação atômica com cópia de segurança em toda ferramenta de escrita)", "implementada"
        return "não se aplica", "não se aplica"
    est = [status_ferr(n) for n in nomes]
    exist = sorted({e for s in est for e in s[1]})
    cit = (" (" + ", ".join(f"`{e}`" for e in exist) + ")") if exist else ""
    if all(s[0] == "implementada" for s in est):
        return "implementada" + cit, "implementada"
    if any(s[0] in ("implementada", "parcial") for s in est):
        return "parcial" + cit, "parcial"
    return "pendente", "pendente"

def T(*nomes):
    for n in nomes:
        if n not in F:
            raise SystemExit("ferramenta não catalogada: " + n)
    return ", ".join(f"`{n}`" for n in nomes)

NA = "não se aplica"

def imp(motivo, alternativa):
    return f"IMPOSSÍVEL fora do PGD: {motivo}. Alternativa: {alternativa}."

IMP_TRANSMISSAO = imp("a transmissão usa o Receitanet incorporado, com protocolo, hash, envelope e certificado da RFB, que não podem ser reimplementados nem copiados", "`gerar_dbk` grava o arquivo e `instruir_transmissao` orienta abrir no PGD 2026, verificar pendências e entregar; depois `registrar_recibo`")
IMP_GOVBR = imp("exige autenticação gov.br (Ouro ou Prata) em serviço da RFB e o AutoIR é 100% local por desenho", "`orientar_servico_externo` explica como obter o arquivo no e-CAC ou no PGD; o AutoIR importa o arquivo trazido pelo usuário")
IMP_DARF = imp("o Darf oficial (número do documento e código de barras) é emitido pelo PGD, pelo serviço da RFB ou pelo Sicalc", "`gerar_darf` calcula principal, multa, juros, código e vencimento e instrui a emissão oficial")
IMP_RECIBO = imp("o recibo é produzido pela RFB na recepção", "imprimir no PGD e informar o número com `registrar_recibo`")

# regras de cobertura: (regex do ID, ferramentas, módulo, prioridade, observação)
R = []
def regra(rx, ferrs, modulo, prio, obs=""):
    R.append((re.compile(rx + r"$"), ferrs, modulo, prio, obs))

# 1 menus
regra(r"M-MENU-DECLARACAO", T("criar_declaracao", "abrir_declaracao", "excluir_declaracao", "criar_retificadora"), "model", "P0", "Itens detalhados em M-DECL-*.")
regra(r"M-MENU-IMPORTACOES", T("importar_carne_leao", "importar_livro_caixa_rural", "importar_gcap", "importar_informe_rendimentos", "importar_informe_plano_saude"), "importacao", "P1", "")
regra(r"M-MENU-FICHAS", T("listar_fichas"), "model", "P1", "Navegação substituída por consulta de fichas aplicáveis.")
regra(r"M-MENU-FERRAMENTAS", T("gravar_copia_seguranca", "restaurar_copia_seguranca"), "model", "P1", "Calculadora e preferências de UI não têm equivalente.")
regra(r"M-MENU-AJUDA", T("obter_ajuda"), "tabelas", "P2", "Conteúdo de ajuda como dados versionados.")
regra(r"M-TOOLBAR", NA, "nenhum", "P2", "Atalhos visuais; as ações estão cobertas pelas ferramentas de ciclo de vida.")
regra(r"M-RODAPE-COMPARATIVO", T("calcular_imposto"), "calc", "P0", "Modelo `ambos` devolve os dois saldos e a recomendação.")
regra(r"M-INICIAL", T("criar_declaracao", "listar_declaracoes"), "model", "P0", "")
regra(r"M-INICIAL-NOVA", T("criar_declaracao", "importar_declaracao_anterior", "importar_pre_preenchida"), "model", "P0", "Modo pré-preenchida depende de arquivo obtido pelo usuário (ver M-IMP-PREPREENCHIDA).")
regra(r"M-INICIAL-EMPREENCH", T("listar_declaracoes", "abrir_declaracao"), "model", "P1", "")
regra(r"M-INICIAL-TRANSMITIDAS", T("listar_declaracoes", "registrar_recibo", "criar_retificadora"), "model", "P1", "Estado de transmitida vem do recibo informado.")
regra(r"M-INICIAL-BOASVINDAS", T("obter_ajuda"), "tabelas", "P2", "Botão gov.br: " + IMP_GOVBR)
regra(r"M-DECL-NOVA", T("criar_declaracao"), "model", "P0")
regra(r"M-DECL-ABRIR", T("abrir_declaracao"), "model", "P0", "Sem a restrição de uma declaração aberta por vez.")
regra(r"M-DECL-FECHAR", NA, "model", "P2", "Persistência imediata dispensa fechar.")
regra(r"M-DECL-EXCLUIR", T("excluir_declaracao"), "model", "P1", "Exige confirmação explícita.")
regra(r"M-DECL-RETIFICAR", T("criar_retificadora"), "model", "P1")
regra(r"M-DECL-PENDENCIAS", T("listar_pendencias"), "validate", "P0", "Catálogo de mensagens próprio, com severidade erro ou aviso.")
regra(r"M-DECL-ENTREGAR", T("gerar_dbk", "listar_pendencias", "instruir_transmissao"), "dbk", "P0", IMP_TRANSMISSAO)
regra(r"M-DECL-SALVAR-ONLINE", T("gravar_copia_seguranca", "orientar_servico_externo"), "model", "P2", IMP_GOVBR)
regra(r"M-DECL-RECUPERAR-ONLINE", T("restaurar_copia_seguranca", "orientar_servico_externo"), "model", "P2", IMP_GOVBR)
regra(r"M-DECL-SAIR", NA, "nenhum", "P2", "Encerramento de UI.")
regra(r"M-DECL-CONVERTER", T("definir_identificacao"), "model", "P2", "Função inferida; confirmar no programa.")
regra(r"M-IMPR-DECLARACAO", T("gerar_relatorio_declaracao"), "model", "P1", "Layout próprio; renderização em PDF fica na camada MCP ou em módulo de relatórios a criar.")
regra(r"M-IMPR-REND-PF", T("gerar_relatorio_declaracao"), "model", "P2", "Parte `rendimentos_pf`.")
regra(r"M-IMPR-RECIBO", T("registrar_recibo", "instruir_transmissao"), "importacao", "P1", IMP_RECIBO)
regra(r"M-IMPR-DARF", T("gerar_darf", "simular_quotas"), "calc", "P0", IMP_DARF)
regra(r"M-IMPR-DARF-MAED", T("calcular_multa_atraso", "gerar_darf"), "calc", "P1", imp("o Darf da multa decorre da notificação de lançamento emitida pelo PGD na entrega", "calcular o valor e orientar a emissão pelo PGD ou e-CAC"))
regra(r"M-IMPR-DARF-(ECA|IDOSO)", T("gerar_darf"), "calc", "P1", IMP_DARF)
regra(r"M-IMPR-RELACAO", T("listar_declaracoes"), "model", "P2")
regra(r"M-IMPR-COMUNICACAO-SAIDA", T("gerar_comunicacao_saida"), "model", "P1")
regra(r"M-IMPR-INFORME-(REND|PS)", T("ler_informe"), "importacao", "P2")
regra(r"M-IMPR-DARF-AUXILIO", T("orientar_servico_externo"), "nenhum", "P2", "Fora do escopo do exercício 2026 (função herdada, inferida).")
regra(r"M-IMPR-CRITERIOS-OBRIG", T("verificar_obrigatoriedade"), "validate", "P2", "Função inferida.")
regra(r"M-IMPR-SALVAR-PDF", T("gerar_relatorio_declaracao", "gerar_darf"), "model", "P2")
regra(r"M-IMP-ANO-ANTERIOR", T("importar_declaracao_anterior"), "importacao", "P0", "Leitor do layout 2025; nunca apagar dados sem confirmação (o PGD apaga).")
regra(r"M-IMP-PREPREENCHIDA", T("importar_pre_preenchida", "orientar_servico_externo"), "importacao", "P1", IMP_GOVBR)
regra(r"M-IMP-INFORME-REND", T("importar_informe_rendimentos"), "importacao", "P1", "Detectar duplicidade (o PGD duplica).")
regra(r"M-IMP-INFORME-PS", T("importar_informe_plano_saude"), "importacao", "P1", "Detectar duplicidade.")
regra(r"M-IMP-CARNE-LEAO", T("importar_carne_leao", "orientar_servico_externo"), "importacao", "P1", imp("o PGD baixa o Carnê-Leão Web com gov.br ou código de acesso", "o usuário obtém o demonstrativo no e-CAC e o AutoIR importa o arquivo; formato a mapear"))
regra(r"M-IMP-AR", T("importar_livro_caixa_rural"), "importacao", "P1")
regra(r"M-IMP-GCAP", T("importar_gcap"), "importacao", "P1", "Substituição por CPF, como no PGD.")
regra(r"M-IMP-SUGESTAO", T("listar_declaracoes", "importar_declaracao_anterior"), "importacao", "P2", "Função inferida.")
regra(r"M-FERR-COPIA-GRAVAR", T("gravar_copia_seguranca", "gerar_dbk"), "model", "P1", "Formato de cópia do PGD não é reproduzido; a cópia para entrega equivale a `gerar_dbk`.")
regra(r"M-FERR-COPIA-RESTAURAR", T("restaurar_copia_seguranca", "importar_declaracao_anterior"), "model", "P1", "Restaurar cópia do PGD 2026 depende de mapear o formato (lacuna).")
regra(r"M-FERR-CALCULADORA", NA, "nenhum", "P2", "O assistente faz os cálculos.")
regra(r"M-FERR-ATUALIZACOES", T("verificar_versao_tabelas"), "tabelas", "P2", "Atualização do PGD é do programa oficial; o AutoIR só versiona as próprias tabelas.")
regra(r"M-FERR-RECNOMES", T("buscar_nome_por_documento"), "model", "P2")
regra(r"M-FERR-LOGIN-GOVBR", T("orientar_servico_externo"), "nenhum", "P2", IMP_GOVBR)
regra(r"M-FERR-PAGINAS", T("obter_ajuda"), "tabelas", "P2", "Links públicos.")
regra(r"M-FERR-(MEMORIA|LEAOZINHO|AVALIACAO)", NA, "nenhum", "P2", "Função inferida do nome da ação; sem efeito na declaração.")
regra(r"M-FERR-INFO-CALCULO", T("consultar_tabela"), "tabelas", "P2")
regra(r"M-AJUDA-CONTEXTUAL", T("obter_ajuda", "calcular_imposto"), "tabelas", "P1", "`calcular_imposto` com `detalhar` cumpre o F1 do Resumo (procedência dos valores).")
regra(r"M-AJUDA-(DOCUMENTOS|SOBRE)", T("obter_ajuda"), "tabelas", "P2")
regra(r"M-AJUDA-(ATALHOS|ACESSIBILIDADE)", NA, "nenhum", "P2", "Respostas textuais do MCP já são acessíveis.")
regra(r"M-DEMO-ACOES", T("calcular_ganho_capital", "orientar_servico_externo"), "calc", "P2", "Função inferida; demonstrativo oficial do GCAP continua no PGD.")
# 2 tipos e regras
regra(r"S-TIPO-AJUSTE", T("criar_declaracao"), "model", "P0")
regra(r"S-TIPO-DFE", T("criar_declaracao", "definir_espolio"), "model", "P1")
regra(r"S-TIPO-DSDP", T("criar_declaracao", "definir_saida_definitiva"), "model", "P1")
regra(r"S-PROGRAMAS-RFB", T("orientar_servico_externo"), "nenhum", "P2", "GCAP, LCAR e Carnê-Leão são programas da RFB; o AutoIR importa as exportações.")
regra(r"S-REGRA-(CASADO|COMPANHEIRO|SEPARADO-FATO|DIVORCIADO|VIUVO|MENOR|EMANCIPADO|INCAPAZ)", T("obter_ajuda", "adicionar_dependente", "listar_pendencias"), "validate", "P1", "Regras viram avisos (dependente comum, guarda judicial, rateio de bens comuns).")
regra(r"S-REGRA-ESPOLIO", T("definir_identificacao", "definir_espolio"), "model", "P1", "Natureza 81 habilita a ficha Espólio.")
regra(r"S-REGRA-ESPOLIO-FINAL", T("definir_espolio", "definir_partilha_bem"), "model", "P1")
regra(r"S-REGRA-AUSENTE-SERVICO", T("definir_rendimentos_pf_exterior", "adicionar_rendimento_isento", "converter_moeda"), "calc", "P2", "Divisão 25% tributável e 75% isento (código 17).")
regra(r"S-REGRA-(AUSENTE-OUTROS|RESIDENTE|NAO-RESIDENTE)", T("calcular_condicao_residencia"), "calc", "P1")
regra(r"S-REGRA-DIPLOMATICO", T("obter_ajuda"), "tabelas", "P2")
regra(r"S-REGRA-CONVERSAO", T("converter_moeda"), "tabelas", "P1")
regra(r"S-REGRA-REND-TRAB", T("adicionar_rendimento_pj", "definir_rendimentos_pf_exterior", "transferir_excedente_isencao_65"), "calc", "P0")
regra(r"S-REGRA-ALUGUEIS", T("definir_rendimentos_pf_exterior", "adicionar_rendimento_pj"), "calc", "P1", "Aluguel líquido e aluguel presumido de cessão gratuita.")
regra(r"S-REGRA-AR-RESULTADO", T("calcular_imposto"), "calc", "P1")
regra(r"S-REGRA-RRA", T("adicionar_rra", "adicionar_pagamento", "calcular_rra"), "calc", "P1")
regra(r"S-REGRA-OUTROS-REND", T("definir_rendimentos_pf_exterior"), "model", "P2")
regra(r"S-REGRA-OBRIG", T("verificar_obrigatoriedade"), "validate", "P1")
regra(r"S-REGRA-REGIME", T("calcular_imposto", "definir_opcao_tributacao"), "calc", "P0")
regra(r"S-REGRA-PREENCHIMENTO", T("importar_pre_preenchida", "importar_informe_rendimentos", "importar_informe_plano_saude", "orientar_servico_externo"), "importacao", "P1", IMP_GOVBR)
regra(r"S-REGRA-PRAZO", T("listar_pendencias", "instruir_transmissao"), "validate", "P0", "Alerta de prazo de 29/05/2026.")
regra(r"S-REGRA-MULTA-ATRASO", T("calcular_multa_atraso"), "calc", "P1")
regra(r"S-REGRA-RETIF", T("criar_retificadora", "listar_pendencias"), "validate", "P1", "Trava de troca de regime após o prazo.")
regra(r"S-REGRA-APOS-PRAZO", T("instruir_transmissao"), "nenhum", "P2")
regra(r"S-REGRA-EXERC-ANT", T("obter_ajuda"), "nenhum", "P2", "Fora do escopo (outros exercícios usam o PGD do ano).")
# 3 fichas
regra(r"F-INICIO", T("listar_fichas"), "model", "P2")
regra(r"F-IDENT(-TIPO|-NASC|-DOENCA|-RACA|-ALTCAD|-CONJ|-RETORNO)?", T("definir_identificacao", "validar_documento"), "model", "P0")
regra(r"F-IDENT-NOME", T("definir_identificacao", "validar_documento"), "validate", "P0", "Regras de partes e caracteres repetidos.")
regra(r"F-IDENT-END-(BR|EXT)", T("definir_identificacao", "validar_documento", "consultar_tabela"), "tabelas", "P0", "Consulta CEP dos Correios: link público via `orientar_servico_externo`.")
regra(r"F-IDENT-OCUP", T("definir_identificacao", "consultar_tabela"), "tabelas", "P0")
regra(r"F-DEP", T("adicionar_dependente", "editar_lancamento", "remover_lancamento"), "model", "P0", "Exclusão em cascata igual à do PGD com aviso das fichas órfãs.")
regra(r"F-ALIM", T("adicionar_alimentando", "editar_lancamento", "remover_lancamento"), "model", "P1")
regra(r"F-RTPJ-(TIT|DEP)", T("adicionar_rendimento_pj", "importar_informe_rendimentos"), "model", "P0")
regra(r"F-RTPF", T("definir_rendimentos_pf_exterior"), "model", "P0")
regra(r"F-RTPF-IMPCL", T("importar_carne_leao"), "importacao", "P1", "Ver M-IMP-CARNE-LEAO.")
regra(r"F-RTPF-(TNA|NIT|ALUG|OUTROS|PREV|DARF0190|DEP-CPF)", T("definir_rendimentos_pf_exterior"), "model", "P0")
regra(r"F-RTPF-EXT", T("definir_rendimentos_pf_exterior", "converter_moeda"), "calc", "P1")
regra(r"F-RTPF-LIVROCAIXA", T("definir_rendimentos_pf_exterior"), "calc", "P1", "Limite mensal e transporte de excesso até dezembro.")
regra(r"F-RTPF-(QTDDEP|PENSAO)", T("definir_rendimentos_pf_exterior"), "model", "P2", "Coluna informativa.")
regra(r"F-ISENTO", T("adicionar_rendimento_isento", "listar_lancamentos"), "model", "P0", "Aba Totais = agregação por código.")
regra(r"F-ISENTO-(04|09|11|12|14|99)", T("adicionar_rendimento_isento"), "model", "P0")
regra(r"F-ISENTO-10", T("adicionar_rendimento_isento", "transferir_excedente_isencao_65"), "calc", "P0")
regra(r"F-ISENTO-(05|06|07)", T("importar_gcap", "adicionar_rendimento_isento"), "importacao", "P1", "Campo duplo: valor manual e valor transportado do GCAP.")
regra(r"F-ISENTO-08", T("adicionar_rendimento_isento", "converter_moeda"), "model", "P2")
regra(r"F-ISENTO-15", T("calcular_imposto"), "calc", "P1", "Transportado do Demonstrativo da Atividade Rural.")
regra(r"F-ISENTO-22", T("calcular_imposto"), "calc", "P1", "Transportado da Renda Variável.")
regra(r"F-ISENTO-27", T("calcular_imposto"), "calc", "P1", "Transportado da ficha RRA.")
regra(r"F-ISENTO-(01|02|03|13|19|20|21|25|28)", T("adicionar_rendimento_isento"), "model", "P1")
regra(r"F-ISENTO-(16|17|18|23|24)", T("adicionar_rendimento_isento"), "model", "P2")
regra(r"F-EXCL", T("adicionar_rendimento_exclusivo", "listar_lancamentos"), "model", "P0")
regra(r"F-EXCL-(01|08)", T("calcular_imposto"), "calc", "P0", "Transportado do campo 13º da ficha Rendimentos PJ.")
regra(r"F-EXCL-(06|10|11)", T("adicionar_rendimento_exclusivo"), "model", "P0")
regra(r"F-EXCL-(02|03|04)", T("importar_gcap"), "importacao", "P1", "Transportado do GCAP.")
regra(r"F-EXCL-05", T("calcular_imposto"), "calc", "P1", "Transportado da Renda Variável e FII/Fiagro.")
regra(r"F-EXCL-(07|09)", T("calcular_imposto"), "calc", "P1", "Transportado da ficha RRA (opção exclusiva).")
regra(r"F-EXCL-12", T("calcular_imposto", "adicionar_bem"), "calc", "P1", "Transportado de Bens e Direitos (Lei 14.754/2023).")
regra(r"F-EXCL-(13|99)", T("adicionar_rendimento_exclusivo"), "model", "P1")
regra(r"F-SUSP(-TIT|-DEP)?", T("adicionar_rendimento_exigibilidade_suspensa"), "model", "P2", "Informativo, fora do cálculo.")
regra(r"F-RRA(-TIT|-DEP)?", T("adicionar_rra", "calcular_rra"), "calc", "P1")
regra(r"F-IMPPAGO", T("definir_imposto_pago", "calcular_imposto"), "model", "P0")
regra(r"F-IMPPAGO-01", T("definir_imposto_pago"), "model", "P1", "Só Darf 0246.")
regra(r"F-IMPPAGO-02", T("definir_imposto_pago", "calcular_imposto", "converter_moeda"), "calc", "P1", "Limite de compensação exige dois cálculos.")
regra(r"F-IMPPAGO-03", T("definir_imposto_pago"), "model", "P2")
regra(r"F-IMPPAGO-0[4-7]", T("calcular_imposto"), "calc", "P0", "Linha calculada.")
regra(r"F-PAG", T("adicionar_pagamento", "editar_lancamento", "remover_lancamento"), "model", "P0")
regra(r"F-PAG-(INSTR|01|MED|09|10|11|12|13|14|21|26|PENSAO|30|PREV|36)", T("adicionar_pagamento"), "model", "P0")
regra(r"F-PAG-(02|15|16|17|18|19|20|22)", T("adicionar_pagamento", "converter_moeda"), "model", "P1")
regra(r"F-PAG-(31|33|34|FAPI|37|60|61|62|66|70|71|72|76|99)", T("adicionar_pagamento"), "model", "P1")
regra(r"F-PAG-IMPPS", T("importar_informe_plano_saude"), "importacao", "P1")
regra(r"F-DOA", T("adicionar_doacao"), "model", "P1")
regra(r"F-DOA-LIMITES", T("calcular_imposto"), "calc", "P1", "Limites encadeados de 6%, 7% e 1%.")
regra(r"F-DOA-(40|41|42|43|44|45|46|47|80|81|99)", T("adicionar_doacao"), "model", "P1")
regra(r"F-DDD(-ECA|-IDOSO)?", T("adicionar_doacao_direta_declaracao", "gerar_darf"), "calc", "P1", IMP_DARF)
regra(r"F-BENS", T("adicionar_bem", "editar_lancamento", "remover_lancamento", "repetir_valores_bens"), "model", "P0")
regra(r"F-BENS-(OBRIG|DADOS)", T("adicionar_bem", "listar_pendencias", "validar_documento"), "validate", "P0")
regra(r"F-BENS-RENDASSOC", T("adicionar_rendimento_isento", "adicionar_rendimento_exclusivo"), "model", "P1", "Vínculo bidirecional por chave do bem.")
regra(r"F-BENS-G(01|02|03|04|05|06|07|08|99)", T("adicionar_bem", "consultar_tabela"), "model", "P0")
regra(r"F-BENS-COMUNS", T("listar_pendencias", "obter_ajuda"), "validate", "P1")
regra(r"F-BENS-DATAAQ", T("aplicar_caso_especial_bem", "atualizar_custo_bem"), "calc", "P1")
regra(r"F-BENS-DFE", T("adicionar_bem", "definir_partilha_bem"), "model", "P1")
regra(r"F-BENS-ALIEN-DFE", T("adicionar_bem"), "model", "P2", "Divergência do texto da Ajuda registrada.")
regra(r"F-BENS-DSDP", T("adicionar_bem", "repetir_valores_bens", "converter_moeda"), "model", "P1")
regra(r"F-BENS-ESP-(BENFEITORIAS|CONSORCIO|LEASING|PERMUTA|DOACAO|HERANCA|DISSOLUCAO|DESINCORPORADOS|ADQ-ALIENADOS|NOVO-RESIDENTE|MOEDA-ESPECIE|EXTERIOR|DEP-NAO-REMUNERADO|EMPRESTIMO|IMOVEL-RURAL|VGBL)", T("aplicar_caso_especial_bem", "adicionar_bem"), "model", "P1")
regra(r"F-BENS-ESP-(APLIC-EXTERIOR|CONTROLADAS|TRANSPARENCIA)", T("adicionar_bem", "calcular_imposto", "converter_moeda"), "calc", "P1", "Motor da Lei 14.754/2023 (15%, compensação de perdas, crédito do imposto estrangeiro).")
regra(r"F-DIV", T("adicionar_divida", "editar_lancamento", "remover_lancamento"), "model", "P0")
regra(r"F-ESPOLIO", T("definir_espolio"), "model", "P1")
regra(r"F-PARTIDOS", T("adicionar_doacao_eleitoral"), "model", "P1")
regra(r"F-CONJUGE", T("definir_identificacao"), "model", "P2", "Ficha inferida do layout; confirmar no programa.")
regra(r"F-SAIDA-GERAL", T("criar_declaracao", "definir_saida_definitiva"), "model", "P1")
regra(r"F-SAIDA", T("definir_saida_definitiva"), "model", "P1")
regra(r"F-SAIDA-IDENT", T("definir_identificacao"), "model", "P1")
regra(r"F-SAIDA-(DEDUCOES|CALC|IMPEXT)", T("calcular_imposto"), "calc", "P1", "Soma das tabelas mensais do período.")
regra(r"F-SAIDA-DIVIDAS", T("adicionar_divida"), "model", "P1")
regra(r"F-SAIDA-PAGTO", T("simular_quotas", "calcular_acrescimos_moratorios"), "calc", "P1", "Quota única.")
regra(r"F-SAIDA-DARF", T("gerar_darf"), "calc", "P1", IMP_DARF)
regra(r"F-SAIDA-MULTA", T("calcular_multa_atraso"), "calc", "P1")
regra(r"F-DFE-(GERAL|IDENT)", T("criar_declaracao", "definir_identificacao"), "model", "P1")
regra(r"F-DFE-(SOBREPARTILHA|OBITO-CONJUGES|FICHA)", T("definir_espolio"), "model", "P1")
regra(r"F-DFE-MOEDA", T("converter_moeda"), "tabelas", "P2")
regra(r"F-DFE-BENS", T("adicionar_bem", "definir_partilha_bem"), "model", "P1")
regra(r"F-DFE-GCAP", T("gerar_darf", "orientar_servico_externo"), "calc", "P2", IMP_DARF)
regra(r"F-DFE-BENS-AR", T("definir_receitas_despesas_rurais", "listar_pendencias"), "model", "P2")
regra(r"F-DFE-HERDEIROS", T("adicionar_herdeiro"), "model", "P1")
regra(r"F-DFE-DIVIDAS", T("adicionar_divida"), "model", "P1")
regra(r"F-DFE-CALCULO", T("calcular_imposto"), "calc", "P1", "Tabela mensal x meses até a decisão.")
regra(r"F-DFE-PRAZO", T("listar_pendencias", "calcular_multa_atraso"), "validate", "P1", "Prazo calculado localmente (o PGD consulta serviço).")
regra(r"F-DFE-DARF", T("gerar_darf"), "calc", "P1", IMP_DARF)
regra(r"F-DFE-PAGTO", T("simular_quotas"), "calc", "P1", "Quota única.")
regra(r"F-RESUMO-(TRIB|DED|CALC|SIMPL|EVOL|OUTRAS)", T("calcular_imposto"), "calc", "P0")
regra(r"F-RESUMO-QUOTAS", T("definir_informacoes_bancarias", "simular_quotas"), "calc", "P0")
regra(r"F-RESUMO-BANCO", T("definir_informacoes_bancarias", "validar_documento"), "validate", "P0", "DV por banco (bancos_calculo_dv) e Pix pela chave CPF.")
regra(r"F-RESUMO-OPCAO", T("definir_opcao_tributacao", "calcular_imposto"), "calc", "P0")
# 4 demonstrativos
regra(r"D-AR-GERAL", T("listar_fichas", "calcular_imposto"), "calc", "P1")
regra(r"D-AR-OBRIG", T("verificar_obrigatoriedade"), "validate", "P1")
regra(r"D-AR-OQUE", T("obter_ajuda"), "tabelas", "P2")
regra(r"D-AR-IMOVEL", T("adicionar_imovel_rural"), "model", "P1")
regra(r"D-AR-RD-(BRASIL|EXTERIOR)", T("definir_receitas_despesas_rurais"), "model", "P1")
regra(r"D-AR-APUR(-L01|-L06|-L07|-L11|-L12)?", T("definir_apuracao_rural", "calcular_imposto"), "calc", "P1")
regra(r"D-AR-APUR-L(02|03|04|05|08|09|10)", T("calcular_imposto"), "calc", "P1", "Linha calculada.")
regra(r"D-AR-REBANHO", T("definir_rebanho"), "model", "P1")
regra(r"D-AR-BENS", T("adicionar_bem_rural", "repetir_valores_bens"), "model", "P1")
regra(r"D-AR-DIVIDAS", T("adicionar_divida_rural"), "model", "P1")
regra(r"D-AR-IMPORT", T("importar_livro_caixa_rural", "importar_declaracao_anterior"), "importacao", "P1")
regra(r"D-GCAP-GERAL", T("importar_gcap", "listar_ganhos_capital", "remover_lancamento"), "importacao", "P1", "Demonstrativo só por importação, como no PGD.")
regra(r"D-GCAP-(IMOVEIS|MOVEIS|PARTICIP|MOEDA)", T("importar_gcap", "listar_ganhos_capital", "calcular_ganho_capital"), "importacao", "P1", "Simulador próprio é P2 e só orienta.")
regra(r"D-RV-(GERAL|TIPOS|L02|L07|L10|L12)", T("definir_renda_variavel"), "model", "P1")
regra(r"D-RV-PROC", T("calcular_preco_medio"), "calc", "P2")
regra(r"D-RV-L(01|03|04|05|06|08|09)", T("calcular_imposto"), "calc", "P1", "Linha calculada.")
regra(r"D-RV-L11", T("calcular_imposto", "gerar_darf"), "calc", "P1", "Darf 6015 com acréscimos.")
regra(r"D-FII-(GERAL|L01|L02|L06)", T("definir_fii_fiagro"), "model", "P1")
regra(r"D-FII-(DISTRIB|ALIEN|ISENCAO)", T("obter_ajuda", "adicionar_rendimento_isento", "adicionar_rendimento_exclusivo"), "tabelas", "P2")
regra(r"D-FII-PROC", T("calcular_preco_medio"), "calc", "P2")
regra(r"D-FII-L0[345]", T("calcular_imposto"), "calc", "P1", "Linha calculada.")
regra(r"D-CL-GERAL", T("importar_carne_leao", "definir_rendimentos_pf_exterior"), "importacao", "P1")
regra(r"D-CL-PROGRAMA", T("orientar_servico_externo", "calcular_carne_leao"), "calc", "P2", "O Carnê-Leão é serviço do e-CAC.")
# 5 pagamento
regra(r"S-PAG-DARF", T("gerar_darf"), "calc", "P0", IMP_DARF)
regra(r"S-PAG-FORMAS", T("obter_ajuda"), "tabelas", "P1")
regra(r"S-PAG-DEBITO", T("definir_informacoes_bancarias", "simular_quotas"), "validate", "P0", "Alteração posterior do débito automático só no e-CAC (`orientar_servico_externo`).")
regra(r"S-PAG-(PARCEL|QUOTAS-PRAZO)", T("simular_quotas"), "calc", "P0", "Selic futura informada pelo usuário ou consultada.")
regra(r"S-PAG-VENC", T("simular_quotas", "consultar_tabela"), "tabelas", "P0", "`datas-prazos.json`.")
regra(r"S-PAG-APOS-PRAZO", T("calcular_acrescimos_moratorios", "gerar_darf"), "calc", "P1")
# 6 operações
regra(r"S-SALVAMENTO", "todas as ferramentas que escrevem em disco", "model", "P0", "Gravação atômica a cada chamada.")
regra(r"S-UMA-ABERTA", T("listar_declaracoes"), "model", "P2", "Restrição não replicada.")
regra(r"S-GRAVAR-ENTREGA", T("gerar_dbk"), "dbk", "P0", "Nome padrão CPF-IRPF-A-2026-2025-ORIGI.DEC (a confirmar).")
regra(r"S-TRANSMISSAO", T("instruir_transmissao"), "dbk", "P0", IMP_TRANSMISSAO)
regra(r"S-RECIBO", T("registrar_recibo", "validar_documento"), "importacao", "P1", IMP_RECIBO)
regra(r"S-NOTIFICACAO-MAED", T("calcular_multa_atraso"), "calc", "P2", "Notificação oficial só existe após a entrega.")
regra(r"S-VALIDADOR", NA, "nenhum", "P2", "Produzido pela RFB na recepção.")
regra(r"S-CALAMIDADE", T("listar_pendencias", "consultar_tabela"), "validate", "P2", "Regra inferida; confirmar.")
regra(r"S-ERROS-FREQ", T("listar_pendencias", "validar_documento"), "validate", "P0", "Também normalização de valores monetários na entrada.")
regra(r"S-REQUISITOS", T("instruir_transmissao"), "nenhum", "P2")
regra(r"S-PROBLEMAS-IMPRESSAO", NA, "nenhum", "P2", "O AutoIR gera PDF/HTML.")
# 7 nuvem
regra(r"S-NUVEM-(PREPREENCHIDA|CARNELEAO|DECONLINE)", T("orientar_servico_externo"), "nenhum", "P2", IMP_GOVBR)
regra(r"S-NUVEM-DARF", T("gerar_darf", "orientar_servico_externo"), "calc", "P2", IMP_DARF)
regra(r"S-NUVEM-MUNICIPIOS", T("consultar_tabela", "verificar_versao_tabelas"), "tabelas", "P2", "Tabela local versionada.")
regra(r"S-NUVEM-VENC-DFE", T("listar_pendencias"), "validate", "P1", "Cálculo local pelas regras de prazo da DFE.")
regra(r"S-NUVEM-CAPTCHA-TOKEN", NA, "nenhum", "P2", IMP_GOVBR)
# 8 arquivo
regra(r"S-ARQ-GERAL", T("gerar_dbk", "importar_declaracao_anterior"), "dbk", "P0")
regra(r"S-ARQ-REG-(IDENT|TOTAIS|RENDIMENTOS|ISENTOS-EXCL|PESSOAS|PAGAMENTOS-DOACOES|BENS-DIVIDAS)", T("gerar_dbk"), "dbk", "P0")
regra(r"S-ARQ-REG-(ESPOLIO-SAIDA|RRA|RV|AR)", T("gerar_dbk"), "dbk", "P1")
regra(r"S-ARQ-REG-GCAP", T("importar_gcap", "gerar_dbk"), "dbk", "P1", "Registros importados preservados sem recálculo.")
regra(r"S-ARQ-REG-RECIBO", T("registrar_recibo"), "importacao", "P2", "Somente leitura; nunca gerado pelo AutoIR.")
regra(r"S-ARQ-INFORMES", T("importar_informe_rendimentos", "importar_informe_plano_saude", "importar_gcap"), "importacao", "P1")
# 9 tabelas
regra(r"S-TAB-(PROGRESSIVA|DEPENDENCIA|BENS|PAGAMENTOS)", T("consultar_tabela"), "tabelas", "P0")
regra(r"S-TAB-DOLAR", T("converter_moeda", "consultar_tabela"), "tabelas", "P1", "Tabela ainda não exportada em JSON (lacuna).")
regra(r"S-TAB-ATUALIZACAO", T("atualizar_custo_bem"), "tabelas", "P2", "Tabela ainda não exportada em JSON (lacuna).")
regra(r"S-TAB-DOACOES", T("consultar_tabela"), "tabelas", "P1")

def cobertura(rid):
    for rx, fs, mod, pr, ob in R:
        if rx.match(rid):
            return fs, mod, pr, ob
    raise SystemExit("Sem regra de cobertura: " + rid)

# ---------------------------------------------------------------- inventário
usadas = Counter()
linhas_matriz = []
por_secao = OrderedDict()
for rid, reg in registros.items():
    por_secao.setdefault(alocado[rid], []).append(rid)

cont_cat = Counter(rid.split("-")[0] for rid in registros)

out = []
out.append("# Inventário de funções do PGD IRPF 2026")
out.append("")
out.append("Inventário exaustivo das funções do programa oficial da Declaração de Ajuste Anual do IRPF 2026 (exercício 2026, ano-calendário 2025, versão 1.5): menus, telas, fichas, abas, quadros, botões, demonstrativos, importações, impressões, pagamento, transmissão, serviços em nuvem, arquivo da declaração e tabelas. Cada item tem um ID estável, usado pela [matriz de cobertura](matriz-cobertura.md) e pelo código do AutoIR.")
out.append("")
out.append("Fontes: texto da Ajuda oficial (AjudaIRPF.pdf, 425 páginas), guia de atalhos (AtalhosIRPF.pdf), recursos de dados que acompanham o programa (tabelas XML, `LayoutDadosDIRPF2026.xml`, `Mensagens.properties`, esquemas XSD dos informes) e nomes de classes, telas e relatórios listados em [estrutura-pacotes.md](estrutura-pacotes.md). Nenhum código foi descompilado ou copiado. Ver [README](README.md).")
out.append("")
out.append("## Convenções")
out.append("")
out.append("- `M-` menus, telas e ações; `F-` fichas, abas, quadros e campos; `D-` demonstrativos; `S-` sistema: tipos de declaração, regras gerais, pagamento, operações, nuvem, arquivo e tabelas.")
out.append("- Cada item traz: Onde (menu, ficha, página da Ajuda ou recurso), Aplica-se a, Campos, Validações, Códigos, Regras de cálculo, Importações/exportações, Exige do MCP e Observações, quando a fonte informa.")
out.append("- \"(inferido)\" marca o que foi deduzido e não está escrito na fonte. \"Ajuda pág. N\" é a página do PDF da Ajuda.")
out.append("- \"Origem\" indica a nota de trabalho de onde o item veio e o ID usado na nota, quando diferente (as notas usavam `T-`, `G-`, `P-` e `E-ESP-`, renomeados para `S-TIPO-`, `S-REGRA-`, `S-PAG-` e `F-DFE-`).")
out.append("")
out.append("## Totais")
out.append("")
out.append("| Categoria | Itens |")
out.append("|---|---:|")
nomes_cat = {"M": "Menus, telas e ações (M-)", "F": "Fichas, abas e quadros (F-)", "D": "Demonstrativos (D-)", "S": "Sistema, regras, pagamento, nuvem, arquivo e tabelas (S-)"}
for c in ["M", "F", "D", "S"]:
    out.append(f"| {nomes_cat[c]} | {cont_cat[c]} |")
out.append(f"| **Total** | **{len(registros)}** |")
out.append("")
out.append("## Índice")
out.append("")
for num, titulo, subs in SECOES:
    total_sec = sum(len(por_secao.get(s[0], [])) for s in subs)
    out.append(f"- [{num}. {titulo}](#{ancora(num + ' ' + titulo)}) ({total_sec} itens)")
    for snum, stitulo, _ in subs:
        ids = por_secao.get(snum, [])
        if not ids:
            continue
        links = ", ".join(f"[{i}](#{ancora(i + ' ' + registros[i]['nome'])})" for i in ids)
        out.append(f"  - {snum} {stitulo}: {links}")
out.append("")

for num, titulo, subs in SECOES:
    out.append(f"## {num} {titulo}")
    out.append("")
    for snum, stitulo, _ in subs:
        ids = por_secao.get(snum, [])
        if not ids:
            continue
        if len(subs) > 1:
            out.append(f"### {snum} {stitulo}")
            out.append("")
        for rid in ids:
            reg = registros[rid]
            nivel = "####" if len(subs) > 1 else "###"
            out.append(f"{nivel} {rid} {reg['nome']}")
            out.append("")
            orig = f"notas/{reg['arq']}"
            if reg["antigo"] != rid:
                orig += f", ID na nota: {reg['antigo']}"
            out.append(f"- Origem: {orig}")
            out.extend(reg["corpo"])
            fs, mod, pr, ob = cobertura(rid)
            out.append(f"- Cobertura no AutoIR: {fs}; módulo {mod}; prioridade {pr}; status {status_linha(fs)[0]} (ver matriz)")
            out.append("")

(SAIDA / "funcoes-pgd-2026.md").write_text("\n".join(out) + "\n", encoding="utf-8")

# ---------------------------------------------------------------- matriz
def esc(s):
    return s.replace("|", "\\|")

m = []
m.append("# Matriz de cobertura: PGD IRPF 2026 x AutoIR")
m.append("")
m.append("Uma linha por item do [inventário de funções](funcoes-pgd-2026.md). Colunas: ID estável, função do PGD, ferramentas MCP propostas (nomes em snake_case, pt-BR), módulo do core (`dbk`, `model`, `calc`, `validate`, `tabelas`, `importacao`; \"nenhum\" quando só a camada MCP responde), prioridade e observação.")
m.append("")
m.append("Prioridades: **P0** essencial para entregar uma declaração de ajuste anual típica (assalariado, autônomo, investidor comum, com dependentes, deduções e bens); **P1** necessário para casos frequentes ou tipos especiais (espólio, saída, atividade rural, renda variável, importações); **P2** conveniência, casos raros ou funções sem efeito na declaração.")
m.append("")
m.append("## O que é impossível fora do programa oficial")
m.append("")
m.append("| Função | Por que é impossível | Alternativa no AutoIR |")
m.append("|---|---|---|")
m.append("| Transmissão (com ou sem certificado digital) | O Receitanet incorporado ao PGD usa protocolo, envelope, hash e assinatura próprios da RFB; reimplementar exigiria engenharia reversa do programa, vedada pelas regras do projeto, e a RFB só aceita a entrega pelo PGD ou pelo Meu Imposto de Renda. | `gerar_dbk` grava o arquivo no layout 2026; `instruir_transmissao` dá o passo a passo: instalar ou atualizar o PGD 2026, abrir ou restaurar a declaração, rodar Verificar Pendências (F5), Entregar Declaração, guardar e imprimir o recibo; depois `registrar_recibo`. |")
m.append("| Assinatura e certificado digital | Credenciais pessoais do contribuinte, usadas só pelo PGD ou e-CAC. | Orientar o uso do certificado no próprio PGD. |")
m.append("| Login gov.br, pré-preenchida, Carnê-Leão Web, salvar e recuperar on-line | Serviços autenticados (Ouro ou Prata) da RFB; o AutoIR é um servidor 100% local e não guarda credenciais. | `orientar_servico_externo` explica como baixar ou exportar o arquivo; `importar_pre_preenchida` e `importar_carne_leao` leem o arquivo trazido pelo usuário. |")
m.append("| Darf oficial (número do documento e código de barras), Darf da notificação de multa | Emitidos pelo PGD, pelo serviço da RFB ou pelo Sicalc a partir de dados oficiais. | `gerar_darf` calcula código, período, vencimento, principal, multa e juros e instrui a emissão no PGD, e-CAC ou Sicalc. |")
m.append("| Recibo de entrega, notificação de lançamento da multa, dados do validador | Gerados pela RFB na recepção. | `registrar_recibo` guarda o número informado pelo usuário para retificação e para o ano seguinte. |")
m.append("| Inclusão ou alteração de débito automático após a entrega, extrato, consulta de débitos | Serviços do e-CAC (Meu Imposto de Renda). | `orientar_servico_externo` com o caminho no e-CAC e prazos (dia 14 de cada mês). |")
m.append("| Atualização automática do PGD | Distribuição do programa oficial. | `verificar_versao_tabelas` e aviso para atualizar o PGD antes de transmitir. |")
m.append("")
m.append("## Matriz")
m.append("")
m.append("| ID | Função do PGD | Ferramenta MCP | Módulo | Prioridade | Status | Observação |")
m.append("|---|---|---|---|---|---|---|")
cont_prio = Counter()
cont_status = Counter()
cont_status_prio = Counter()
ordem = [rid for _, _, subs in SECOES for s in subs for rid in por_secao.get(s[0], [])]
assert len(ordem) == len(registros)
for rid in ordem:
    reg = registros[rid]
    fs, mod, pr, ob = cobertura(rid)
    for n in re.findall(r"`([a-z0-9_]+)`", fs):
        usadas[n] += 1
    cont_prio[pr] += 1
    st_txt, st = status_linha(fs)
    cont_status[st] += 1
    cont_status_prio[(st, pr)] += 1
    m.append(f"| {rid} | {esc(reg['nome'])} | {fs} | {mod} | {pr} | {st_txt} | {esc(ob)} |")
m.append("")
m.append(f"Itens por prioridade: P0 {cont_prio['P0']}, P1 {cont_prio['P1']}, P2 {cont_prio['P2']} (total {len(registros)}).")
m.append("")
m.append("Status por item (calculado a partir das ferramentas da linha): implementada quando todas já existem no servidor; parcial quando ao menos uma existe ou cobre parte do escopo; pendente quando nenhuma existe; \"não se aplica\" para funções de interface sem equivalente no MCP.")
m.append("")
m.append("| Status | P0 | P1 | P2 | Total |")
m.append("|---|---:|---:|---:|---:|")
for st in ["implementada", "parcial", "pendente", "não se aplica"]:
    m.append(f"| {st} | {cont_status_prio[(st,'P0')]} | {cont_status_prio[(st,'P1')]} | {cont_status_prio[(st,'P2')]} | {cont_status[st]} |")
m.append("")
m.append("## Ferramentas MCP propostas (lista consolidada e deduplicada)")
m.append("")
m.append(f"{len(F)} ferramentas. \"Escreve em disco\" indica se a ferramenta altera a base local de declarações ou grava arquivo. \"Itens\" é o número de linhas da matriz que citam a ferramenta.")
m.append("")
grupos = [
    ("Ciclo de vida e navegação", ["criar_declaracao", "listar_declaracoes", "abrir_declaracao", "excluir_declaracao", "criar_retificadora", "registrar_recibo", "gravar_copia_seguranca", "restaurar_copia_seguranca", "listar_fichas", "listar_lancamentos", "editar_lancamento", "remover_lancamento"]),
    ("Fichas da declaração", ["definir_identificacao", "adicionar_dependente", "adicionar_alimentando", "adicionar_rendimento_pj", "definir_rendimentos_pf_exterior", "adicionar_rendimento_isento", "adicionar_rendimento_exclusivo", "adicionar_rendimento_exigibilidade_suspensa", "adicionar_rra", "definir_imposto_pago", "adicionar_pagamento", "adicionar_doacao", "adicionar_doacao_direta_declaracao", "adicionar_bem", "aplicar_caso_especial_bem", "repetir_valores_bens", "adicionar_divida", "definir_espolio", "adicionar_herdeiro", "definir_partilha_bem", "adicionar_doacao_eleitoral", "definir_saida_definitiva", "definir_informacoes_bancarias", "definir_opcao_tributacao"]),
    ("Demonstrativos", ["adicionar_imovel_rural", "definir_receitas_despesas_rurais", "definir_apuracao_rural", "definir_rebanho", "adicionar_bem_rural", "adicionar_divida_rural", "definir_renda_variavel", "definir_fii_fiagro", "listar_ganhos_capital"]),
    ("Importações", ["importar_declaracao_anterior", "importar_pre_preenchida", "importar_informe_rendimentos", "importar_informe_plano_saude", "importar_carne_leao", "importar_gcap", "importar_livro_caixa_rural", "ler_informe"]),
    ("Cálculo, validação e tabelas", ["calcular_imposto", "listar_pendencias", "verificar_obrigatoriedade", "simular_quotas", "gerar_darf", "calcular_acrescimos_moratorios", "calcular_multa_atraso", "calcular_rra", "transferir_excedente_isencao_65", "converter_moeda", "atualizar_custo_bem", "calcular_condicao_residencia", "calcular_ganho_capital", "calcular_preco_medio", "calcular_carne_leao", "validar_documento", "consultar_tabela", "obter_ajuda", "buscar_nome_por_documento", "verificar_versao_tabelas"]),
    ("Saídas e etapa final no PGD", ["gerar_dbk", "gerar_relatorio_declaracao", "gerar_comunicacao_saida", "instruir_transmissao", "orientar_servico_externo"]),
]
listadas = [n for _, ns in grupos for n in ns]
if sorted(listadas) != sorted(F):
    raise SystemExit("grupos de ferramentas divergem do catálogo: " + str(set(F) ^ set(listadas)))
for gt, ns in grupos:
    m.append(f"### {gt}")
    m.append("")
    m.append("| Ferramenta | Descrição | Parâmetros principais | Escreve em disco | Módulo | Itens | Status |")
    m.append("|---|---|---|---|---|---:|---|")
    for n in ns:
        d = F[n]
        s, ex, ob = status_ferr(n)
        stx = s + ((" (" + ", ".join(f"`{e}`" for e in ex) + ")") if ex else "") + ((": " + ob) if ob else "")
        m.append(f"| `{n}` | {esc(d['desc'])} | {esc(d['params'])} | {d['escreve']} | {d['modulo']} | {usadas[n]} | {esc(stx)} |")
    m.append("")
nao_usadas = [n for n in F if usadas[n] == 0]
if nao_usadas:
    raise SystemExit("ferramentas sem item: " + ", ".join(nao_usadas))

# prioridade de cada ferramenta = maior prioridade entre os itens que a usam
prio_ferr = {}
for rid in registros:
    fs, mod, pr, ob = cobertura(rid)
    for n in re.findall(r"`([a-z0-9_]+)`", fs):
        if n not in prio_ferr or pr < prio_ferr[n]:
            prio_ferr[n] = pr
m.append("## Ferramentas existentes no servidor")
m.append("")
m.append("Ferramentas registradas hoje em `packages/mcp/src/ferramentas/*.ts` e a ferramenta proposta que cada uma cobre:")
m.append("")
m.append("| Ferramenta existente | Cobre (proposta) |")
m.append("|---|---|")
for e in EXISTENTES:
    cob = sorted(n for n, (s, ex, ob) in STATUS.items() if e in ex)
    m.append(f"| `{e}` | " + (", ".join(f"`{c}`" for c in cob) or "uso interno") + " |")
m.append("")
m.append("## Ferramentas pendentes e parciais por prioridade")
m.append("")
m.append("A prioridade de uma ferramenta é a mais alta entre os itens da matriz que a citam.")
m.append("")
for pr in ["P0", "P1", "P2"]:
    pend = [n for n in F if status_ferr(n)[0] == "pendente" and prio_ferr.get(n) == pr]
    parc = [n for n in F if status_ferr(n)[0] == "parcial" and prio_ferr.get(n) == pr]
    m.append(f"### {pr}")
    m.append("")
    m.append("- Pendentes (" + str(len(pend)) + "): " + (", ".join(f"`{n}`" for n in pend) or "nenhuma"))
    m.append("- Parciais (" + str(len(parc)) + "): " + (", ".join(f"`{n}`" for n in parc) or "nenhuma"))
    m.append("")
print("status itens", dict(cont_status))
print("status ferramentas", Counter(status_ferr(n)[0] for n in F))
for pr in ["P0","P1","P2"]:
    print(pr, "pend", [n for n in F if status_ferr(n)[0]=="pendente" and prio_ferr.get(n)==pr])

(SAIDA / "matriz-cobertura.md").write_text("\n".join(m) + "\n", encoding="utf-8")

# resumo para o terminal
print("itens", len(registros), dict(cont_cat))
print("prioridades", dict(cont_prio))
print("ferramentas", len(F))
print("secoes", {s: len(v) for s, v in por_secao.items()})
