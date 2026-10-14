# Política de segurança

O AutoIR lida com dados fiscais e pessoais: CPF, rendimentos, bens, dependentes, despesas
médicas. Levamos a sério qualquer falha que permita ler ou alterar esses dados sem o usuário
querer. O modelo de ameaças completo está em [`docs/seguranca.md`](docs/seguranca.md).

## Versões cobertas

O projeto está em fase inicial e ainda não tem versões publicadas. Correções de segurança entram
na branch `main`. Quando houver versões, a mais recente receberá correções.

## Como reportar

**Não abra issue pública** para uma falha de segurança, nem comente o problema em PR ou em
discussão aberta.

Use o recurso de relato privado do GitHub: aba **Security** do repositório, opção **Report a
vulnerability** (GitHub Security Advisories). Só os mantenedores veem o relato.

Descreva:

- versão (commit) do AutoIR, versão do Node.js e sistema operacional;
- o que um atacante consegue fazer e em que condição (por exemplo, "um LLM induzido por prompt
  injection consegue ler arquivo fora da pasta autorizada");
- os passos mínimos para reproduzir;
- o impacto que você espera.

### Sem dados pessoais no relato

O relato não pode expor ninguém, nem você.

- **Nunca anexe declaração real** (`.DBK`, `.DEC`, JSON do modelo), recibo, informe de
  rendimentos ou captura de tela com dados de verdade.
- Use só dados sintéticos: CPF e CNPJ gerados com dígito verificador válido (por exemplo, a
  ferramenta `validar_documento` confere os seus; geradores de teste também servem), nomes e
  valores inventados. O harness `tools/referencia` gera CPFs sintéticos determinísticos.
- Se o problema só aparece com um arquivo específico, reduza-o ao mínimo e troque todos os
  campos de identificação (nome, CPF, endereço, contas, valores) antes de enviar.
- Não inclua caminhos da sua máquina que revelem nome de usuário, nem tokens, chaves ou
  conteúdo de `.env`.
- Se você recebeu dados de terceiros por causa da falha, não os repasse a nós: descreva o tipo
  de dado e a quantidade.

## O que acontece depois

- Confirmamos o recebimento em até 7 dias.
- Investigamos, combinamos com você a gravidade e o prazo da correção e mantemos você informado.
- Publicamos a correção e, em seguida, o aviso de segurança, com crédito a quem reportou, se
  desejar. Pedimos que a falha não seja divulgada antes da correção ou de 90 dias do relato, o
  que vier primeiro, salvo acordo diferente.

Não oferecemos recompensa financeira. Testes de boa-fé, feitos com dados sintéticos na sua
própria máquina e seguindo esta política, não serão tratados como abuso.

## Escopo

Dentro do escopo:

- leitura ou gravação fora da pasta autorizada (`--dir`), inclusive por link simbólico, nome de
  arquivo malicioso ou corrida no sistema de arquivos;
- qualquer chamada de rede, execução de processo ou leitura de variável de ambiente feita pelo
  AutoIR;
- alteração silenciosa da declaração: o codec aceitar e regravar um arquivo diferente do lido, ou
  `verificarControles` deixar passar um arquivo alterado;
- erro de cálculo explorável (por exemplo, entrada que faz o motor devolver imposto negativo ou
  restituição indevida);
- vazamento de dados pessoais em logs, mensagens de erro ou respostas das ferramentas além do
  necessário;
- negação de serviço por entrada pequena (regex catastrófica, laço sem fim, consumo de memória
  desproporcional);
- prompt injection que faça o servidor executar ação destrutiva sem a anotação
  `destructiveHint` ou fora do modo pedido (por exemplo, gravar com `--somente-leitura`);
- vulnerabilidade em dependência que afete o AutoIR na prática.

Fora do escopo:

- o que o provedor de LLM faz com os dados que as ferramentas devolvem ao cliente MCP (isso está
  avisado no README e em `autoir://aviso-legal`);
- dados que o próprio usuário expõe ao apontar `--dir` para uma pasta ampla demais;
- divergências de cálculo em relação ao programa oficial sem impacto de segurança: são bugs
  comuns e podem ir para issue pública, com caso sintético;
- o programa oficial da Receita Federal e os sistemas do governo, que o AutoIR não acessa;
- ataques que exigem acesso prévio à conta do usuário na máquina com as mesmas permissões;
- vulnerabilidades em dependências de desenvolvimento sem efeito no pacote distribuído.

## Medidas já existentes

Resumo; detalhes em [`docs/seguranca.md`](docs/seguranca.md) e [`docs/testes.md`](docs/testes.md).

- Só transporte stdio, sem servidor, conta ou telemetria (ADR 0001).
- Core sem E/S, conferido por teste automatizado; servidor e CLI sem módulos de rede nem
  processos, também conferido por teste.
- Pasta autorizada com recusa de caminhos absolutos, `..`, links e nomes perigosos; escrita
  atômica e backup antes de sobrescrever.
- Limite de 20 MB por arquivo, aplicado também pelo codec antes de decodificar.
- Fuzzing determinístico do codec, detecção de alteração de um byte nas 74 fixtures do programa
  oficial e testes de propriedade do cálculo.
- CI com CodeQL, auditoria de dependências, Dependabot semanal, permissões mínimas e actions
  fixadas por SHA de commit.
