# Contexto de domínio

Glossário da linguagem usada no código, nos testes e na documentação do AutoIR. Ao introduzir um
termo novo no código, registre-o aqui primeiro. Nomes de tipos e funções seguem estes termos em
português.

## Declaração

**DIRPF**
: Declaração de Ajuste Anual do Imposto sobre a Renda da Pessoa Física. É o documento que o
contribuinte entrega uma vez por ano consolidando rendimentos, deduções, bens, dívidas e o imposto
apurado. No código, "declaração" sempre significa uma DIRPF de um único exercício.

**Ano-calendário**
: Ano em que os fatos aconteceram: rendimentos recebidos, pagamentos feitos, bens comprados.

**Exercício**
: Ano em que a declaração é entregue, sempre o seguinte ao ano-calendário. Exemplo: a declaração do
exercício 2026 informa o ano-calendário 2025. Leiautes, tabelas e limites são versionados por
exercício; nunca use "ano" sozinho para evitar a confusão entre os dois.

**Modelo simplificado**
: Forma de tributação em que as deduções legais são substituídas por um desconto padrão de 20%
sobre os rendimentos tributáveis, limitado a um teto fixado para cada exercício.

**Modelo completo**
: Forma de tributação que usa as deduções efetivamente comprovadas (dependentes, despesas médicas,
instrução, previdência, pensão alimentícia e outras). O motor de cálculo compara os dois modelos.

## Programa e arquivos

**PGD**
: Programa Gerador da Declaração, o aplicativo oficial de desktop usado para preencher, validar e
gravar a DIRPF. O AutoIR não embute, não redistribui e não executa o PGD em produção (ver ADR 0002).

**Ficha**
: Seção temática da declaração no PGD, como Identificação do Contribuinte, Dependentes,
Rendimentos Tributáveis Recebidos de Pessoa Jurídica, Pagamentos Efetuados, Bens e Direitos e
Dívidas e Ônus Reais. No modelo (`core/model`), cada ficha é um tipo.

**DBK**
: Arquivo de cópia de segurança da declaração gravado pelo PGD (extensão `.DBK`). É texto em
registros de largura fixa e é a principal porta de entrada e saída do AutoIR (`core/dbk`).

**DEC**
: Arquivo da declaração gravado pelo PGD para entrega (extensão `.DEC`), com estrutura de
registros equivalente à do DBK. O AutoIR não transmite declarações.

**Registro**
: Uma linha do arquivo DBK ou DEC. Começa por um identificador de tipo e tem campos em posições
fixas definidas pelo leiaute do exercício. Uma ficha costuma corresponder a um ou mais tipos de
registro.

**T9**
: Registro de encerramento do arquivo (trailer), com totais de controle sobre os registros
anteriores. Precisa ser recalculado sempre que o conteúdo do arquivo muda.

**Leiaute**
: Descrição declarativa dos registros de um exercício: tipos, campos, posições, tamanhos e
formatos. O codec é genérico e só conhece o leiaute como dado.

## Rendimentos com apuração própria

**Carnê-leão**
: Recolhimento mensal obrigatório do imposto sobre rendimentos recebidos de pessoas físicas ou do
exterior. É apurado ao longo do ano-calendário e os dados são importados para a declaração.

**GCAP**
: Apuração de Ganhos de Capital, usada na alienação de bens e direitos (imóveis, participações e
outros). O resultado é apurado à parte e importado para a declaração.

## Termos técnicos do AutoIR

**Centavos**
: Tipo monetário do AutoIR: inteiro (`bigint`) de centavos, nunca ponto flutuante. Textos no
formato brasileiro ("1.234,56") são convertidos por `parseCentavos` e `formatCentavos`.

**Dígito verificador (DV)**
: Os dois últimos dígitos de CPF e CNPJ, calculados por módulo 11. Validar o DV confere apenas a
estrutura do número, não a existência nem a situação cadastral do documento.

**Pasta autorizada**
: Diretório passado em `--dir`; o único lugar do disco que o servidor poderá ler e gravar.

**Caso de referência**
: Par entrada e saída esperada (por exemplo, um DBK e o imposto apurado) gerado localmente no
ambiente de desenvolvimento e usado como teste do motor de cálculo e do codec.
