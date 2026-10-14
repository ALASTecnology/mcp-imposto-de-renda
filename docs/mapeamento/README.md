# Mapeamento do PGD IRPF 2026

Esta pasta descreve o programa oficial da Declaração do Imposto sobre a Renda da Pessoa Física 2026 (exercício 2026, ano-calendário 2025, versão 1.5) do ponto de vista funcional, para orientar o que o MCP Imposto de Renda precisa oferecer como servidor MCP local.

## Documentos

| Arquivo | Conteúdo |
|---|---|
| [funcoes-pgd-2026.md](funcoes-pgd-2026.md) | Inventário exaustivo das funções do programa: menus e ações, tela inicial, fichas, abas, quadros e botões, demonstrativos (Atividade Rural, Ganhos de Capital, Renda Variável, FII/Fiagro, Carnê-Leão), importações, impressões, pagamento, quotas, débito automático, Pix, pendências, cálculo, transmissão, retificação, espólio, saída definitiva, serviços em nuvem, arquivo da declaração e tabelas. Cada item tem ID estável (`M-`, `F-`, `D-`, `S-`), localização, campos, validações, códigos, regras de cálculo e o que exige do MCP. Tem índice navegável. |
| [matriz-cobertura.md](matriz-cobertura.md) | Uma linha por item do inventário: ferramenta MCP proposta, módulo do core, prioridade (P0, P1, P2), status em relação ao servidor atual (implementada, parcial, pendente, citando a ferramenta existente em `packages/mcp/src/ferramentas`) e observação; ferramentas pendentes e parciais por prioridade; quadro do que é impossível fora do programa oficial com a alternativa adotada; lista consolidada e deduplicada das ferramentas MCP com descrição, parâmetros e se escrevem em disco. |
| [estrutura-pacotes.md](estrutura-pacotes.md) | Inventário de nomes de pacotes, classes, telas (`.form`) e relatórios (`.jasper`) dos JARs do programa, usado só como índice para localizar funções. |
| [tabelas/](tabelas/README.md) | 33 tabelas de códigos e parâmetros em JSON, extraídas dos arquivos XML de dados que acompanham o programa (e a do dólar de 2025, transcrita da Ajuda), com README próprio. |

## Como os documentos foram produzidos

1. Fontes usadas:
   - texto da Ajuda oficial do programa (AjudaIRPF.pdf, 425 páginas) e do guia de atalhos (AtalhosIRPF.pdf), que acompanham o pacote distribuído pela Receita Federal;
   - recursos de dados que acompanham o programa: tabelas em XML, o leiaute do arquivo da declaração (`LayoutDadosDIRPF2026.xml`, 94 tipos de registro e 1.850 campos), o catálogo de mensagens (`Mensagens.properties`) e os esquemas XSD públicos dos informes de rendimentos e de plano de saúde;
   - nomes de classes, telas e relatórios listados a partir do conteúdo dos JARs (sem leitura de bytecode), registrados em `estrutura-pacotes.md`;
   - documentação pública da Receita Federal (leiautes dos informes e legislação citada na Ajuda).
2. O texto da Ajuda foi lido por faixas de páginas e anotado em fichas de trabalho num formato único (onde fica, a que tipo de declaração se aplica, campos, validações, códigos, regras de cálculo, importações e exportações, exigências para o MCP, observações). As fichas foram consolidadas no inventário sem descartar detalhe e com IDs renomeados para as famílias `M-`, `F-`, `D-` e `S-`.
3. Menus, atalhos, ações e telas que a Ajuda não descreve foram incluídos a partir dos nomes de recursos e marcados como "(inferido)". Divergências do próprio texto da Ajuda estão registradas no item correspondente.
4. A matriz de cobertura foi gerada a partir do inventário, com uma regra de cobertura por item; cada ferramenta MCP listada é usada por pelo menos um item. O status de cada linha é derivado do estado das ferramentas citadas, comparado com as ferramentas registradas no servidor na data da revisão; ao implementar ferramentas novas, atualize a matriz.

## Limites e regras legais

- Nenhum código da Receita Federal foi descompilado, copiado ou incluído no repositório. O pacote do programa oficial fica em `vendor/rfb/`, fora do controle de versão.
- O que depende de serviços autenticados ou de componentes da Receita Federal (transmissão com Receitanet, certificado digital, login gov.br, pré-preenchida, Carnê-Leão Web, Darf oficial com código de barras, recibo) não é reproduzido: o MCP Imposto de Renda gera o arquivo da declaração e instrui o usuário a concluir no programa oficial. O quadro completo está na matriz de cobertura.
- Valores e prazos são os do exercício 2026 e precisam ser revistos a cada nova versão do programa oficial.
