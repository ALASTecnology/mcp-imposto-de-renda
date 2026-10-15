# Instalação

O MCP Imposto de Renda é um executável de linha de comando (`mcp-imposto-de-renda`) que o seu cliente MCP inicia e encerra.
Você não precisa deixá-lo rodando: basta instalar, apontar a pasta da declaração e configurar o
cliente ([clientes-mcp.md](clientes-mcp.md)).

## Requisitos

| Item | Versão | Observação |
| --- | --- | --- |
| Node.js | 22 ou superior | `node --version` precisa mostrar `v22` ou mais. |
| pnpm | o fixado em `package.json` (`packageManager`) | Só para compilar a partir do código. `corepack enable` instala a versão certa. |
| Programa oficial IRPF 2026 | o da Receita Federal | Para restaurar o `.DBK`, conferir e transmitir. O MCP Imposto de Renda não o instala nem o executa. |

Sistemas: macOS, Linux e Windows. O MCP Imposto de Renda não depende de Java; quem precisa de Java é o programa
oficial, instalado à parte.

## 1. Prepare a pasta autorizada

Crie uma pasta só para a declaração. É o único lugar que o servidor poderá ler e gravar.

```sh
mkdir -p ~/Documentos/IR-2026
```

No Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force "$env:USERPROFILE\Documentos\IR-2026"
```

Não aponte `--dir` para a pasta pessoal inteira: o assistente poderia ler qualquer `.json` ou `.txt`
dela. Detalhes em [../seguranca.md](../seguranca.md).

## 2. Instale

### Opção A: pelo npm

```sh
npx mcp-imposto-de-renda --versao
```

> A versão 0.1.0 ainda não foi publicada no npm. Até lá, use a opção B. Depois da publicação, a
> configuração dos clientes usa `npx -y mcp-imposto-de-renda` como comando.

### Opção B: a partir do código

```sh
git clone https://github.com/ALASTecnology/mcp-imposto-de-renda.git
cd mcp-imposto-de-renda
corepack enable
pnpm install
pnpm build
```

O executável fica em `apps/cli/dist/index.js`. Guarde o caminho absoluto dele para a configuração
do cliente:

```sh
node "$(pwd)/apps/cli/dist/index.js" --versao
# 0.1.0
```

Para atualizar depois: `git pull`, `pnpm install` e `pnpm build`. Reinicie o cliente MCP.

## 3. Teste a linha de comando

```sh
node apps/cli/dist/index.js --ajuda
node apps/cli/dist/index.js --dir ~/Documentos/IR-2026
```

O segundo comando fica aguardando mensagens do protocolo em stdin e escreve
`mcp-imposto-de-renda: pronto (versão 0.1.0, perfil completo, 162 ferramentas)` em stderr. Encerre com Ctrl+C. Isso confirma que o Node.js, o
build e a pasta estão certos.

## Opções

| Opção | Efeito |
| --- | --- |
| `--dir <pasta>` | Obrigatória. A pasta precisa existir e, fora do modo somente leitura, permitir gravação. Caminho relativo é resolvido a partir da pasta em que o cliente inicia o processo; prefira caminho absoluto. |
| `--perfil <nome>` | Escolhe quais ferramentas o cliente vê: `completo` (padrão, 162), `essencial` (86) ou `consulta` (40). Veja a tabela abaixo. |
| `--grupos <lista>` | Expõe só os grupos citados, separados por vírgula (por exemplo `calculo,validacao`). |
| `--sem-grupos <lista>` | Tira os grupos citados. Combina com `--perfil` e `--grupos`. |
| `--somente-leitura` | Remove as ferramentas que gravam arquivos. Útil para consultar, simular e validar sem risco. |
| `--versao` | Mostra a versão e sai. |
| `--ajuda` | Mostra a ajuda e sai. |

A variável de ambiente `MCP_IMPOSTO_DE_RENDA_PERFIL` faz o mesmo que `--perfil`; se as duas vierem, a
opção na linha de comando vale mais.

Saída com código 2 indica argumento inválido; a mensagem em stderr diz qual (por exemplo
`--dir é obrigatório`, `--dir: sem permissão de gravação` ou
`--perfil: perfil desconhecido "tudo"; use completo, essencial ou consulta`).

### Perfis de ferramentas

O servidor completo tem 162 ferramentas, e alguns clientes aceitam menos: o GitHub Copilot no VS Code
aceita até 128 por pedido e o Cascade do Windsurf, 100. Os perfis resolvem isso sem tirar a
capacidade de editar:

| Perfil | Ferramentas | O que expõe |
| --- | --- | --- |
| `completo` | 162 | Tudo. É o padrão. |
| `essencial` | 86 | Cria, preenche qualquer ficha, valida, calcula e grava. Cada ficha mantém o seu `adicionar_*`; alterar, remover e listar passam pelas genéricas `editar_lancamento`, `remover_lancamento` e `listar_lancamentos`. Ficam de fora só esses atalhos repetidos por ficha e as 10 calculadoras avulsas (carnê-leão, ganho de capital, preço médio e afins). |
| `consulta` | 40 | Só leitura e cálculo; nada grava. A pasta só precisa permitir leitura. |

`node apps/cli/dist/index.js --ajuda` mostra essas contagens e a lista de grupos para `--grupos` e
`--sem-grupos`. A escolha por cliente está em [clientes-mcp.md](clientes-mcp.md#quantidade-de-ferramentas).

## Próximos passos

- Configurar o cliente: [clientes-mcp.md](clientes-mcp.md)
- Fazer a primeira declaração: [primeira-declaracao.md](primeira-declaracao.md)
- Se algo falhar: [solucao-de-problemas.md](solucao-de-problemas.md)
