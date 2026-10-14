# Solução de problemas

Antes de tudo, rode o servidor direto no terminal. Se ele não sobe ali, não vai subir no cliente:

```sh
node /caminho/para/mcp-imposto-de-renda/apps/cli/dist/index.js --dir /caminho/da/pasta
# ou, depois da publicação no npm
npx -y mcp-imposto-de-renda --dir /caminho/da/pasta
```

Esperado em stderr: `mcp-imposto-de-renda: pronto (versão 0.1.0)`. Encerre com Ctrl+C.

## O servidor não sobe

| Mensagem | Causa | Solução |
| --- | --- | --- |
| `--dir é obrigatório` | Faltou o argumento na configuração. | Inclua `"--dir", "<pasta>"` em `args`. |
| `--dir: pasta não encontrada: ...` | Caminho errado ou relativo à pasta errada. | Use caminho absoluto e confira se a pasta existe. |
| `--dir: não é uma pasta: ...` | O caminho aponta para um arquivo. | Aponte para a pasta que contém o `.DBK`. |
| `--dir: sem permissão de gravação: ...` | A pasta é somente leitura para o seu usuário. | Ajuste as permissões ou use `--somente-leitura`. |
| `opção desconhecida: ...` | Argumento digitado errado (por exemplo `--diretorio`). | Veja `--ajuda`. |
| `SyntaxError` ou `ERR_REQUIRE_ESM` ao iniciar | Node.js antigo. | Instale o Node.js 22 ou superior e confira com `node --version`. |
| `Cannot find module .../dist/index.js` | O projeto não foi compilado. | Rode `pnpm install` e `pnpm build` na raiz do repositório. |

## O cliente não mostra as ferramentas

1. Confira se o JSON da configuração é válido (vírgulas, aspas, barras invertidas no Windows).
2. Reinicie o cliente por completo; alguns só leem a configuração na abertura.
3. Abra o log de servidores MCP do cliente. As mensagens do MCP Imposto de Renda começam com `mcp-imposto-de-renda:`.
4. Teste o mesmo comando no terminal, como no início desta página.
5. Clientes de interface gráfica não herdam o `PATH` do seu terminal. Se `npx` ou `node` não forem
   encontrados, use o caminho absoluto (`which node` no macOS e Linux, `where node` no Windows).

### Windows: `npx` não é encontrado

Alguns clientes no Windows não executam `npx` diretamente. Use o interpretador de comandos:

```json
{
  "mcpServers": {
    "mcp-imposto-de-renda": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "mcp-imposto-de-renda", "--dir", "C:/Users/voce/Documentos/IR-2026"]
    }
  }
}
```

### Caminho com espaços

No JSON, cada argumento é um item da lista, então espaços não precisam de aspas extras:
`"--dir", "/Users/voce/Meus Documentos/IR 2026"`. Na linha de comando, use aspas.

## Ferramentas falham

| Mensagem ou sintoma | Causa | Solução |
| --- | --- | --- |
| Erro de nome de arquivo (caminho absoluto, `..`, `~`, barra invertida) | As ferramentas só aceitam nomes relativos dentro da pasta autorizada. | Peça ao assistente o nome do arquivo como aparece em `listar_arquivos`. |
| Arquivo não aparece em `listar_arquivos` | Está em subpasta, é oculto, é link simbólico ou tem extensão diferente de `.DBK`, `.DEC`, `.json`, `.txt`. | Copie o arquivo para a raiz da pasta autorizada. |
| Ferramentas `adicionar_*`, `editar_*`, `definir_*` ou `converter_modelo_para_dbk` não aparecem | O servidor foi iniciado com `--somente-leitura`. | Remova a opção da configuração. |
| `editar_bem`, `listar_dependentes` e outros atalhos por ficha não aparecem | O servidor foi iniciado com `--perfil essencial` ou `--perfil consulta`, que trocam os atalhos pelas genéricas. | Use `listar_lancamentos`, `editar_lancamento` e `remover_lancamento` com o nome da ficha, ou inicie com `--perfil completo`. |
| O cliente avisa que há ferramentas demais (por exemplo, limite de 128 no VS Code ou de 100 no Windsurf) | O perfil `completo` expõe 160 ferramentas. | Use `--perfil essencial` (84 ferramentas, fluxo completo) ou `--perfil consulta` (40, sem gravação). |
| `remover_dependente` recusa a remoção | O dependente tem rendimentos ou pagamentos vinculados. | Informe `cascata: true` para remover também os itens vinculados, como no programa. |
| `editar_*` diz que o item não existe | A posição começa em 1 e muda depois de remoções. | Rode `listar_*` de novo e use o `indice` mostrado. |
| "A declaração não segue o modelo do MCP Imposto de Renda" | O JSON enviado tem campo errado. A mensagem lista o caminho de cada problema. | No modelo, valores são inteiros em centavos, datas `AAAA-MM-DD`, CPF/CNPJ só dígitos. |
| "Valor monetário inválido" | Valor com ponto decimal (`"1234.56"`) ou número com casas decimais. | Use `"1.234,56"` (reais) ou `123456` (centavos). |
| Arquivo maior que o limite | O limite é 20 MB por arquivo. | Um `.DBK` real tem poucos KB; confira se o arquivo é mesmo uma declaração. |
| "divergência(s) nos controles" ao abrir | O arquivo foi editado fora do programa ou está corrompido. | Rode `verificar_integridade_arquivo`. Gravar de novo pelo MCP Imposto de Renda recalcula os controles. |
| Exercício desconhecido | O arquivo é de outro exercício. | Só o exercício 2026 é suportado por enquanto. |

## O programa oficial não restaura o arquivo

1. Confirme que você está no programa **IRPF 2026** e restaurando por **Ferramentas > Cópia de
   Segurança > Restaurar** (Ctrl+T), não por importação.
2. Rode `verificar_integridade_arquivo` no arquivo gravado. Os controles precisam conferir.
3. Grave de novo usando `arquivo_base` com um `.DBK` gravado pelo próprio programa. Assim os
   registros que o modelo não descreve são preservados.
4. Mensagens como `Tamanho da linha diferente ( Registro ) 21.` indicam um registro com tamanho
   errado. Abra uma issue com o modelo **Bug**, descrevendo como reproduzir com dados sintéticos.
   Nunca anexe o arquivo real.

## Restaurou, mas o programa aponta pendências

O MCP Imposto de Renda não cobre todas as críticas do programa. Resolva as pendências no próprio programa
(**Verificar Pendências**, F5). Uma pendência conhecida: alimentandos sempre voltam pedindo a
confirmação de que atendem aos requisitos, porque essa confirmação não faz parte do arquivo.

## O imposto difere do programa oficial

1. Confira se os dados no programa são os mesmos que o assistente usou (`ler_ficha`).
2. Lembre que demonstrativos (ganho de capital, renda variável, atividade rural, RRA) não entram no
   cálculo do motor.
3. Veja as regras ainda não confirmadas em [../regras/irpf-2026.md](../regras/irpf-2026.md).
4. Se a divergência persistir, abra uma issue com o modelo **Divergência de cálculo** e um caso
   sintético que a reproduza.

## Ainda com problema?

Abra uma issue com o modelo **Bug** e inclua: versão do MCP Imposto de Renda (`--versao`), versão do Node.js,
sistema operacional, cliente MCP e a mensagem de erro. Nunca inclua CPFs, nomes, valores ou
arquivos de declarações reais. Falhas de segurança seguem o [SECURITY.md](../../SECURITY.md).
