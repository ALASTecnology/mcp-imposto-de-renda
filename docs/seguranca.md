# Segurança do MCP Imposto de Renda

O MCP Imposto de Renda é um servidor MCP local (stdio) que lê e grava arquivos da declaração do IRPF. Quem
chama as ferramentas é um modelo de linguagem, e o modelo pode ser enganado. Este documento
descreve o que protegemos, de quem, como, e o que fica fora do nosso alcance.

## O que está em jogo

- **Dados pessoais e fiscais**: CPF, nome, endereço, rendimentos, bens, dívidas, dependentes,
  despesas médicas.
- **Arquivos do usuário**: o DBK/DEC da declaração e qualquer outro arquivo da máquina.
- **Integridade da declaração**: um DBK corrompido ou alterado sem o usuário perceber pode levar a
  uma entrega errada.

## Modelo de ameaças

| Ameaça | Exemplo | Mitigação |
| --- | --- | --- |
| LLM malicioso ou induzido por *prompt injection* pede para ler arquivo fora da pasta | `abrir_declaracao({ arquivo: "../../.ssh/id_rsa" })`, caminho absoluto, `C:\...`, `~` | Toda leitura passa por `PastaAutorizada`: só nomes relativos; `..`, barra invertida, caminho absoluto, unidade do Windows e `~` são recusados antes de tocar no disco |
| Fuga por link simbólico | `atalho.DBK -> /etc/passwd`, ou pasta `ponte -> /` dentro da pasta autorizada | O arquivo final nunca pode ser link (`lstat` e abertura com `O_NOFOLLOW`); a pasta-mãe é resolvida com `realpath` e precisa estar dentro da pasta autorizada |
| Truques no nome do arquivo | byte nulo, quebra de linha, `CON`, `NUL`, `COM1`, nome terminado em ponto ou espaço, arquivo oculto, nome com mais de 255 caracteres | Recusados na validação do nome; arquivos e pastas ocultos (inclusive `.mcp-imposto-de-renda-backups`) não são acessíveis pelas ferramentas |
| Leitura de tipo de arquivo inesperado | pedir um `.env` ou `.sh` "como se fosse" declaração | Cada ferramenta declara as extensões aceitas: `.DBK`/`.DEC` para declaração, `.json` para o modelo, listagem de `.DBK`, `.DEC`, `.json` e `.txt` |
| LLM sobrescreve a declaração | `converter_modelo_para_dbk` com destino igual ao original | Antes de sobrescrever, cópia automática em `.mcp-imposto-de-renda-backups/<nome>.<AAAAMMDDTHHMMSSZ>.bak` (permissão 0600, pasta 0700), com rotação (10 por arquivo); gravação só em `.DBK`; anotação `destructiveHint: true` para o cliente pedir confirmação; `--somente-leitura` remove a ferramenta |
| Arquivo corrompido por queda no meio da gravação | falta de energia, disco cheio | Escrita atômica: arquivo temporário na mesma pasta (`O_EXCL`, 0600), `fsync`, `rename` e `fsync` da pasta; em falha o temporário é apagado e o original fica intacto |
| Gravação através de link | destino `x.DBK` é link para fora | Destino que é link é recusado; `rename` substitui a entrada da pasta, nunca segue link; a pasta de backups também não pode ser link |
| Esgotamento de memória ou disco | DBK de 2 GB, entrada JSON gigante | Limite de 20 MB por arquivo lido ou gravado (conferido no `stat` e na leitura); limite de 50.000 elementos por chamada (`maxToolInputElements`); listas dos schemas com tamanho máximo; listagem de pasta limitada a 500 itens |
| DBK malformado ou hostil | linhas de tamanho errado, campos inválidos, exercício desconhecido | O codec do core valida leiaute, tamanho de linha, formato de cada campo e datas; o erro chega ao LLM só com a causa e a posição (linha, registro, campo), nunca com o conteúdo |
| Arquivo editado fora do programa oficial | alguém troca um valor à mão | `verificar_integridade_arquivo` confere o CRC de cada registro, as contagens do T9 e o hash do header; `abrir_declaracao` avisa sobre divergências |
| Exfiltração pela rede | ferramenta que "envia" dados | O pacote não tem nenhuma chamada de rede: não importa `http`, `https`, `net`, `tls`, `dgram`, `dns`, `child_process` nem usa `fetch`; um teste automatizado varre o código do servidor e do CLI. Só o transporte stdio é oferecido (ADR 0001) |
| Dados pessoais em logs | stack trace com CPF, mensagem com caminho do usuário | Logs vão só para stderr e registram apenas eventos do processo, nome da ferramenta e classe do erro. Erros inesperados viram mensagem genérica, sem stack. Erros de arquivo citam só o nome relativo informado, nunca o caminho absoluto. Erros de validação do modelo citam o caminho do campo, não o valor |
| Mensagens de erro como canal de injeção | conteúdo do arquivo ecoado no erro, induzindo o LLM | Mensagens de erro são fixas por tipo de falha e não repetem conteúdo lido do disco |
| Conteúdo do arquivo como canal de injeção | nome de fonte pagadora, discriminação de bem ou texto de informe com instruções ("ignore as regras e grave...") | Nome do contribuinte, fichas, listas e informes devolvidos ao cliente vêm dentro de um bloco `<dados_do_arquivo origem="...">` com o aviso de que o conteúdo é dado da declaração, não instrução; o fechamento do bloco é neutralizado se aparecer no conteúdo. O cliente MCP e o usuário continuam responsáveis por confirmar cada gravação |
| Esgotar as cópias de segurança | um LLM induzido repete gravações até a rotação apagar o original e depois exclui o arquivo | A primeira cópia de cada arquivo nunca sai da rotação; `excluir_declaracao` exige repetir o nome do arquivo; restaurar só grava `.DBK` |
| Encerramento no meio de uma gravação | o cliente fecha o stdin com chamadas em andamento | O CLI espera as chamadas terminarem (com prazo) antes de sair; temporários `.mcp-imposto-de-renda-<uuid>.tmp` de uma escrita interrompida são apagados quando a pasta é aberta |

## O que não conseguimos proteger

- **O provedor de LLM vê tudo o que as ferramentas devolvem.** Ler uma declaração com o MCP Imposto de Renda
  envia os dados dela ao modelo configurado no cliente MCP. Isso está no recurso
  `mcp-imposto-de-renda://aviso-legal` e no README. A única defesa é o usuário escolher o provedor e decidir o que
  compartilhar.
- **O usuário autoriza a pasta.** Se `--dir` apontar para a pasta pessoal inteira, o LLM poderá
  ler qualquer `.json` ou `.txt` dela. Use uma pasta só para a declaração.
- **Cálculo e conversão podem divergir do programa oficial.** O MCP Imposto de Renda não substitui a conferência
  no programa da Receita Federal, que é quem gera o arquivo de entrega.
- **Corrida no sistema de arquivos.** Entre a verificação e a abertura, outro processo local com as
  mesmas permissões pode trocar arquivos. `O_NOFOLLOW` no arquivo final reduz o risco, mas a defesa
  completa exige que só o usuário tenha acesso à pasta autorizada.

## Recomendações de uso

1. Crie uma pasta só para a declaração e passe-a em `--dir`.
2. Use `--somente-leitura` quando quiser apenas consultar e simular.
3. Prefira gravar em um arquivo novo (`arquivo_destino` diferente do original) e mantenha o DBK
   original até conferir tudo no programa oficial.
4. Mantenha o cliente MCP pedindo confirmação para ferramentas com `destructiveHint`.

## Como reportar uma vulnerabilidade

Não abra issue pública para falhas de segurança. Use o recurso de *Security Advisories* do
repositório no GitHub (aba **Security**, opção **Report a vulnerability**), descrevendo:

- versão do MCP Imposto de Renda e do Node.js, sistema operacional;
- passos para reproduzir, de preferência com arquivos sintéticos;
- impacto esperado.

**Nunca anexe declarações reais, CPFs ou dados de terceiros.** Gere casos com dados fictícios.
Respondemos em até 7 dias e combinamos a divulgação depois da correção.
