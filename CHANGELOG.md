# Changelog

Todas as mudanças relevantes do AutoIR são registradas aqui.

O formato segue o [Keep a Changelog 1.1.0](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto
adota o [Versionamento Semântico 2.0.0](https://semver.org/lang/pt-BR/). Enquanto a versão for
0.x, mudanças incompatíveis podem acontecer entre versões menores.

## [Não publicado]

## [0.1.0] - ainda não publicada

Primeira versão. Cobre o exercício 2026 (ano-calendário 2025).

### Adicionado

- **Servidor MCP local** via stdio (`autoir-mcp`), sem nenhuma chamada de rede, com pasta autorizada
  obrigatória (`--dir`) e modo `--somente-leitura`.
- **Codec do arquivo da declaração** (`.DBK` e `.DEC`) com leiaute do exercício 2026 gerado a partir
  dos XML de dados do programa oficial (`tools/leiaute`), e recálculo dos quatro controles de
  integridade: CRC-32 de cada registro, contagens do `T9`, hash e número de controle do header, hash
  do `R9`.
- **Conversão entre o arquivo e um modelo JSON tipado** da declaração, com 26 fichas e 57 tipos de
  registro mapeados; gravação a partir de um arquivo base preserva o que o modelo não descreve; os
  totais do Resumo e do header são recalculados a partir do modelo.
- **Motor de cálculo próprio** do exercício 2026: modelos completo e simplificado, deduções e seus
  limites, incentivos, imposto pago, saldo, quotas com juros Selic, multa por atraso e memória de
  cálculo explicada linha a linha.
- **107 regras de validação** (80 erros e 27 avisos) equivalentes às críticas do programa oficial,
  com ficha, caminho do campo e fonte de cada regra.
- **31 tabelas de códigos** do exercício (dependentes, pagamentos, bens e direitos, municípios,
  bancos e outras), com busca sem diferenciar acentos.
- **Ferramentas MCP** para abrir, converter, criar, retificar, copiar, excluir e restaurar
  declarações; incluir, alterar, remover e listar lançamentos em cada ficha; definir as fichas de
  objeto único; importar informes de rendimentos e de plano de saúde colados em texto; simular e
  explicar o cálculo; validar; consultar tabelas; conferir a integridade do arquivo; gerar dados do
  Darf, relatório de conferência e roteiro de transmissão. Lista completa no README.
- **Prompts** `preparar_declaracao` e `revisar_malha_fina` e o recurso `autoir://aviso-legal`.
- **Camada de arquivos segura**: só nomes relativos, recusa de links simbólicos, nomes reservados e
  arquivos ocultos, escrita atômica com `fsync`, backup automático com rotação em `.autoir-backups`,
  limites de tamanho e de elementos por chamada.
- **Harness de referência** (`tools/referencia`) que usa, só na máquina do desenvolvedor, o
  programa oficial como biblioteca para gerar casos golden e fixtures a partir de dados sintéticos.
- **37 casos de referência** reproduzidos ao centavo e **74 fixtures** (37 `.DBK` e 37 `.DEC`)
  relidos e regravados byte a byte.
- **Inventário das 416 funções** do programa oficial com a matriz de cobertura do AutoIR.
- Documentação: guias de instalação, clientes MCP, primeira declaração, fichas, perguntas
  frequentes, solução de problemas e desenvolvimento; formato do arquivo; regras do IRPF 2026 e
  notas do IRPF 2027; modelo de ameaças; política de segurança; ADRs; guia de contribuição e código
  de conduta.

### Corrigido

- Imposto da tabela progressiva, desconto simplificado de 20%, limite de 12% da previdência
  complementar e limite de 3% das doações diretas passam a truncar a fração de centavo, como o
  programa oficial (antes arredondavam e divergiam em 1 centavo em 16 casos).
- Alíquota efetiva truncada em duas casas.
- `impostoRetidoTotal` passa a ser o total pago do modelo completo, como no programa.
- O codec aceita os campos monetários com sinal gravados pelo programa (por exemplo, base negativa
  do carnê-leão).

### Conhecido

- A conversão de `.DBK` em `.DEC` depende do registro `DR` e ainda não é feita.
- RRA, atividade rural, ganho de capital e renda variável são lidos e gravados, mas não entram no
  cálculo do ajuste.

Os links de comparação entre versões serão acrescentados quando o repositório público existir.
