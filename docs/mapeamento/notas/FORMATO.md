# Formato das notas (cada fork segue este modelo)

Para cada ficha, menu, demonstrativo ou função encontrada, um bloco:

## <ID curto estável, ex.: F-IDENT, F-DEP, M-DECL-NOVA, D-GCAP-IMOVEL> <Nome exato como aparece no PGD>
- Onde: menu/aba/ficha pai; página da Ajuda (pág. N) ou arquivo de recurso
- Aplica-se a: Ajuste Anual / Espólio (inicial, intermediária, final) / Saída Definitiva / todos
- Campos: lista "Nome do campo (tipo, tamanho se souber, obrigatório?, tabela de códigos usada)"
- Validações conhecidas: regras explícitas do texto (formato, limites, CPF/CNPJ, datas, consistências cruzadas, mensagens de pendência/erro)
- Códigos: códigos de tabela citados (ex.: rendimento isento 09, pagamento 26, bem 01-11) com descrição curta
- Regras de cálculo afetadas: o que entra em quais totais (base de cálculo, deduções legais, imposto devido, rendimentos isentos, IR retido, desconto simplificado, limite educação, ganho de capital etc.), com limites numéricos citados
- Importações/exportações: GCAP, Atividade Rural (AR2025), Carnê-Leão, pré-preenchida, declaração 2025, informe de rendimentos, informe plano de saúde, transferências entre fichas automáticas
- Exige do MCP: ferramentas/capacidades necessárias (CRUD da ficha, validação, cálculo, importação, geração de arquivo, orientação ao usuário)
- Observações: novidades 2026, ressalvas, dúvidas

Regras: pt-BR com acentuação correta; proibido travessão (—) e meia-risca (–); usar hífen ou vírgula. Exaustivo: não pular ficha, coluna, aba, quadro, botão ou sub-ficha. Não inventar: só o que está na fonte; marcar "(inferido)" quando deduzir.
