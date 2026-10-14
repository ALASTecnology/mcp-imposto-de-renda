# Changelog

Todas as mudanças relevantes do MCP Imposto de Renda são registradas aqui.

O formato segue o [Keep a Changelog 1.1.0](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto
adota o [Versionamento Semântico 2.0.0](https://semver.org/lang/pt-BR/). Enquanto a versão for
0.x, mudanças incompatíveis podem acontecer entre versões menores.

## [Não publicado]

### Adicionado

- `importar_declaracao_anterior`: começa a declaração de 2026 com os dados do arquivo de 2025, lido
  com o leiaute de 2025 (agora embarcado), migrando só o que o programa oficial recupera e
  relatando o que foi importado, o que não foi e o que falta preencher.
- `importar_pre_preenchida`: cria a declaração a partir do arquivo da pré-preenchida trazido pelo
  usuário, sem apagar em silêncio a que já existe.
- `listar_declaracoes`: relação das declarações da pasta com situação (em preenchimento, gravada
  para entrega, transmitida), tipo, modelo, filtros, ordenação e aviso das de 2025.
- `gravar_relatorio` e partes do relatório: `gerar_relatorio_declaracao` detalha a declaração
  inteira, os rendimentos de PF ou qualquer ficha, em Markdown ou HTML; `gravar_relatorio` grava
  em PDF ou HTML, sem metadados de autor ou ferramenta.
- `validar_documento` confere também recibo, CEP, telefone, e-mail, nome, data, Renavam, NIT/PIS e
  conta bancária.
- `converter_moeda` usa a tabela oficial do dólar de 2025 (nova tabela `dolar-2025`, 32 no total)
  quando a cotação não é informada.
- `listar_ganhos_capital` mostra os registros 64, 67, 70 a 73 e 75 a 78 do GCAP decodificados.
- `calcular_expressao` (calculadora com aritmética decimal exata) e `consultar_atalhos` (atalhos e
  botões do programa oficial com a ferramenta equivalente).
- Totais: **160 ferramentas MCP** em 11 grupos (98 gravam; 62 no modo `--somente-leitura`; perfis
  `essencial` com 84 e `consulta` com 40). Matriz de cobertura: 386 funções atendidas, 24 parciais
  (com justificativa e alternativa) e 6 sem equivalente.

### Alterado

- **Novo nome do projeto: MCP Imposto de Renda** (antes AutoIR), com repositório em
  <https://github.com/ALASTecnology/mcp-imposto-de-renda>. O que muda para quem já usava:
  - pacote npm e executável: `mcp-imposto-de-renda` (antes `autoir-mcp`); a configuração dos
    clientes passa a usar `npx -y mcp-imposto-de-renda --dir <pasta>`;
  - nome do servidor no `initialize`: `mcp-imposto-de-renda` (antes `autoir`);
  - recurso do aviso legal: `mcp-imposto-de-renda://aviso-legal` (antes `autoir://aviso-legal`);
  - pacotes internos do workspace: `@mcp-imposto-de-renda/core` e `@mcp-imposto-de-renda/mcp`
    (antes `@autoir/core` e `@autoir/mcp`), com a condição de exportação
    `@mcp-imposto-de-renda/source` (antes `@autoir/source`);
  - variável do harness de referência: `MCP_IMPOSTO_DE_RENDA_REFERENCIA_CACHE` (antes
    `AUTOIR_REFERENCIA_CACHE`);
  - pasta de cópias de segurança: `.mcp-imposto-de-renda-backups` (antes `.autoir-backups`).
- **Compatibilidade com a pasta antiga.** `listar_copias_seguranca` e `restaurar_copia_seguranca`
  também leem `.autoir-backups`, se existir, para que as cópias feitas antes da mudança continuem
  acessíveis; nada novo é gravado nela. Recibos registrados com o tipo antigo (`recibo-autoir`)
  continuam aceitos por `criar_retificadora`, e temporários de escrita no padrão antigo
  (`.autoir-<uuid>.tmp`) também são limpos ao abrir a pasta.

## [0.1.0] - ainda não publicada

Primeira versão. Cobre o exercício 2026 (ano-calendário 2025).

### Adicionado

- **Servidor MCP local** via stdio (`mcp-imposto-de-renda`), sem nenhuma chamada de rede, com pasta autorizada
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
- **108 regras de validação** (81 erros e 27 avisos) equivalentes às críticas do programa oficial,
  com ficha, caminho do campo e fonte de cada regra.
- **31 tabelas de códigos** do exercício (dependentes, pagamentos, bens e direitos, municípios,
  bancos e outras), com busca sem diferenciar acentos.
- **Ferramentas MCP** para abrir, converter, criar, retificar, copiar, excluir e restaurar
  declarações; incluir, alterar, remover e listar lançamentos em cada ficha; definir as fichas de
  objeto único; importar informes de rendimentos e de plano de saúde colados em texto; simular e
  explicar o cálculo; validar; consultar tabelas; conferir a integridade do arquivo; gerar dados do
  Darf, relatório de conferência e roteiro de transmissão. Lista completa no README.
- **Prompts** `preparar_declaracao` e `revisar_malha_fina` e o recurso `mcp-imposto-de-renda://aviso-legal`.
- **Camada de arquivos segura**: só nomes relativos, recusa de links simbólicos, nomes reservados e
  arquivos ocultos, escrita atômica com `fsync`, backup automático com rotação em `.mcp-imposto-de-renda-backups`,
  limites de tamanho e de elementos por chamada.
- **Harness de referência** (`tools/referencia`) que usa, só na máquina do desenvolvedor, o
  programa oficial como biblioteca para gerar casos golden e fixtures a partir de dados sintéticos.
- **48 casos de referência** reproduzidos ao centavo e **96 fixtures** (48 `.DBK` e 48 `.DEC`)
  relidos e regravados byte a byte; cada `.DBK` convertido em `.DEC` é igual ao do programa.
- **154 ferramentas MCP** em 11 grupos (95 gravam; 59 no modo `--somente-leitura`).
- **Arquivo de entrega**: conversão de `.DBK` em `.DEC` com os registros do recibo (`HR`, `DR` e
  `R9`) montados a partir do header e das fichas, e a ferramenta `gerar_arquivo_entrega`, com
  validação, escrita segura e o lembrete de que a transmissão é feita pelo programa oficial.
- Ferramentas `registrar_recibo` (guarda o recibo para a retificadora), `atualizar_custo_bem`
  (UFIR, coeficiente informado e Lei 14.973/2024), `obter_ajuda` (ajuda por ficha gerada das notas
  de mapeamento) e `ler_informe` (campos de um informe colado ou em `.txt`, sem gravar).
- Conta de restituição como o programa grava: tipo de conta pela tabela (1 a 3), Pix pela chave CPF
  (tipo 4) e operação da Caixa antes do número da conta; indicador `IN_IMPOSTO_PAGO` do header;
  resultado da atividade rural no Brasil no cálculo do ajuste.
- `pnpm docs:catalogo` regenera o catálogo de ferramentas do README a partir do `tools/list`.
- **Inventário das 416 funções** do programa oficial com a matriz de cobertura do MCP Imposto de Renda.
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
- Quotas: sem saldo a pagar, o número de quotas é 0 ("não se aplica"), como no arquivo; o valor da
  quota gravado é a divisão truncada.
- Atividade rural: códigos da forma de apuração (2 resultado, 1 limite de 20%, 0 não informada) e
  chave do imóvel a partir de 0; exclusivo de apostas gravado com o código 14.
- Informe colado: os rótulos são comparados sem o valor da linha (o IRRF anual virava IRRF do 13º
  e a parcela isenta de 65 anos virava 13º tributável), linhas longas são truncadas e reimportar
  com `substituir` não duplica o 13º nem o plano de saúde.
- Cópias de segurança: a primeira cópia de cada arquivo nunca sai da rotação, nomes de cópia sem
  colisão, temporários curtos e limpos na abertura da pasta, restauração só em `.DBK`.
- `converter_modelo_para_dbk` com base `.DEC` grava um `.DBK` de verdade, validado.
- O CLI responde as chamadas em andamento antes de sair quando o stdin fecha; o executável leva o
  núcleo e o servidor no próprio bundle.
- Conteúdo de arquivo e de informe devolvido ao cliente vem delimitado como dado; ferramentas que
  acrescentam não se anunciam idempotentes; índice correto ao incluir em listas compostas;
  excedente do 13º da parcela isenta de 65 anos transferido; percentual numérico aceito no Darf.

### Conhecido

- A conversão de `.DBK` em `.DEC` depende do registro `DR` e ainda não é feita.
- RRA, atividade rural, ganho de capital e renda variável são lidos e gravados, mas não entram no
  cálculo do ajuste.

Os links de comparação entre versões serão acrescentados quando o repositório público existir.
