# Perguntas frequentes

## Sobre o projeto

### O AutoIR é da Receita Federal?

Não. É software livre, sem vínculo com a Receita Federal nem com qualquer órgão público. A
declaração continua sendo conferida e transmitida pelo programa oficial.

### O AutoIR transmite a minha declaração?

Não. Ele grava o arquivo de cópia de segurança (`.DBK`) na sua pasta. Você restaura esse arquivo no
programa oficial, confere e transmite por lá. Transmissão, certificado digital e login gov.br estão
fora do escopo de propósito ([matriz de cobertura](../mapeamento/matriz-cobertura.md#o-que-é-impossível-fora-do-programa-oficial)).

### Preciso pagar alguma coisa?

O AutoIR é gratuito e de código aberto (AGPL-3.0-only). O custo que pode existir é o do cliente MCP
ou do provedor de LLM que você escolher.

### Quais exercícios são suportados?

Só o exercício 2026 (ano-calendário 2025). O exercício 2027 e os anteriores estão no roadmap do
[README](../../README.md#roadmap).

## Privacidade

### Meus dados saem da minha máquina?

O AutoIR não faz nenhuma chamada de rede. Mas o cliente MCP envia ao provedor de LLM tudo o que
você digita e tudo o que as ferramentas devolvem: nomes, CPFs, rendimentos, bens. Esse é o único
caminho de saída, e ele depende do cliente e do provedor que você escolheu. Leia a política de
privacidade do provedor.

### Como reduzir o que é compartilhado?

- Use uma pasta só com os arquivos da declaração.
- Use `--somente-leitura` quando só quiser simular e validar.
- Para simulações, você pode informar valores sem nomes reais (`simular_imposto` aceita qualquer
  nome) e trocar por dados reais só no programa oficial.

### O AutoIR guarda histórico, conta ou telemetria?

Não. Não há backend, conta nem telemetria. Os únicos arquivos que ele cria são os que você pede
para gravar e as cópias em `.autoir-backups` dentro da pasta autorizada.

## Uso

### Posso começar uma declaração do zero?

Pode. `criar_declaracao` grava um `.DBK` novo na pasta a partir da identificação, com o nome
padrão do programa. Outra opção, a mais conservadora, é criar a declaração no programa oficial,
gravar a cópia de segurança na pasta e editar esse arquivo. Veja o
[tutorial](primeira-declaracao.md).

### Posso importar a declaração do ano passado?

Sim, se você tiver o `.DBK` ou o `.DEC` gravado pelo programa. `converter_dbk_para_modelo` lê o
arquivo e o assistente aproveita dependentes, fontes pagadoras e bens (a situação em 31/12/2024 é a
situação atual do ano anterior).

### O assistente pode errar valores?

Pode. Modelos de linguagem erram na leitura de documentos e na transcrição de números. O AutoIR
reduz o risco (valores em centavos inteiros, validação de documentos, regras de consistência,
controles do arquivo), mas não o elimina. Confira cada ficha no programa oficial contra os seus
documentos.

### Por que valor em texto é reais e número é centavos?

Para não haver ambiguidade. `"1.234,56"` é sempre R$ 1.234,56. `123456` é sempre R$ 1.234,56. Nunca
use ponto como separador decimal: `"1234.56"` é recusado.

### O cálculo bate com o do programa oficial?

O motor reproduz ao centavo os 48 casos de referência gerados com o programa oficial (veja
[como funciona a precisão](../../README.md#como-funciona-a-precisão)). Casos fora dessa cobertura,
como demonstrativos de ganho de capital, renda variável e atividade rural, não entram no cálculo.
Divergências conhecidas e regras ainda não confirmadas estão em
[../regras/irpf-2026.md](../regras/irpf-2026.md).

### O que fazer quando o resultado diverge do programa?

Abra uma issue com o modelo **Divergência de cálculo**, descrevendo um caso **sintético** que
reproduza a diferença. Nunca anexe a sua declaração real.

### O AutoIR gera o Darf?

Não o documento oficial. `gerar_darf` calcula os dados (código de receita, período, vencimentos,
valor de cada quota, juros e multa de mora), `calcular_quotas` divide o saldo e
`calcular_multa_atraso` calcula a multa por atraso na entrega. O Darf com número e código de barras
é emitido pelo programa oficial ou pelos serviços da Receita Federal.

### Funciona com qualquer cliente MCP?

Com qualquer cliente que suporte servidores locais via stdio. Exemplos de configuração em
[clientes-mcp.md](clientes-mcp.md).

## Arquivos

### Qual a diferença entre `.DBK` e `.DEC`?

O `.DBK` é a cópia de segurança. O `.DEC` é o arquivo de entrega e traz, além das fichas, os
registros do recibo (`HR`, `DR`, `R9`). O AutoIR lê os dois e grava `.DBK`. Detalhes em
[../formato-dbk.md](../formato-dbk.md).

### O AutoIR apaga ou sobrescreve meus arquivos?

Ele só grava quando uma ferramenta de escrita é chamada (inclusão, alteração ou remoção de
lançamentos, `definir_*` e `converter_modelo_para_dbk`), e o cliente deve pedir a sua confirmação,
porque todas são anunciadas com `destructiveHint: true`. Antes de sobrescrever, o conteúdo anterior
é copiado para `.autoir-backups/<nome>.<data e hora>.bak`; são mantidas as 10 cópias mais recentes
de cada arquivo. A única ferramenta que apaga um arquivo é `excluir_declaracao`, que exige
`confirmar` igual ao nome do arquivo (e `confirmar_dec: true` para um `.DEC`) e guarda uma cópia
antes. Cópias se recuperam com `listar_copias_seguranca` e `restaurar_copia_seguranca`. Com
`--somente-leitura`, nenhuma ferramenta de escrita é registrada.

### Editei o `.DBK` à mão. Tem problema?

Cada linha tem um número de controle e o arquivo tem totais e hash. `verificar_integridade_arquivo`
mostra o que não confere. Ao gravar pelo AutoIR, todos os controles são recalculados.
