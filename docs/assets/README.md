# Imagens e diagramas

Todos os arquivos desta pasta são originais do projeto. Cada diagrama tem a fonte em SVG (editável, com fundo explícito para funcionar nos temas claro e escuro do GitHub) e uma versão PNG renderizada em 2x.

| Arquivo | Dimensões do PNG | Uso |
|---|---|---|
| `preview.svg` / `preview.png` | 1280x640 | Imagem de prévia social do repositório (Settings > Social preview) |
| `logo.svg` | vetorial | Ícone da marca |
| `logo-wordmark.svg` / `logo-wordmark-dark.svg` | vetorial | Marca com nome, para fundo claro e escuro |
| `arquitetura.svg` / `.png` | 2400x1280 | Camadas do monorepo e regra de dependência |
| `fluxo-declaracao.svg` / `.png` | 2400x1160 | Do usuário ao programa oficial, sem servidor no meio |
| `formato-dbk.svg` / `.png` | 2400x1240 | Estrutura do arquivo da declaração |
| `suite-referencia.svg` / `.png` | 2400x1120 | Como os casos de referência validam o motor de cálculo |
| `seguranca.svg` / `.png` | 2400x1240 | Proteções do servidor local |
| `clientes-conexao.svg` / `.png` | 2400x1400 | Como cada família de cliente MCP se conecta |
| `grupos-ferramentas.svg` / `.png` | 2400x1600 | Mapa dos grupos de ferramentas |
| `sessao-sequencia.svg` / `.png` | 2400x1720 | Sequência de uma sessão típica |
| `ciclo-vida-declaracao.svg` / `.png` | 2400x1440 | Ciclo de vida da declaração |
| `paleta.md` | | Cores usadas, com hex, origem e uso |

## Cores e fonte

As cores vêm do Padrão Digital de Governo (Design System gov.br) e das cores medidas nas imagens do programa IRPF 2026. Cada valor, a origem exata e o uso estão em [`paleta.md`](paleta.md). Novos desenhos devem usar só as cores dessa lista.

O texto declara a pilha `Rawline, Raleway, "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif`, a mesma família do gov.br com fallbacks comuns. Os PNGs atuais foram renderizados com Avenir Next (Rawline não estava instalada) e Menlo no texto monoespaçado.

## Como embutir

Logo com troca automática de tema:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/logo-wordmark-dark.svg">
  <img alt="MCP Imposto de Renda" src="docs/assets/logo-wordmark.svg" height="48">
</picture>
```

Diagramas:

```markdown
![Arquitetura do MCP Imposto de Renda](docs/assets/arquitetura.svg)
```

## Regenerar os PNGs

Os PNGs são renderizados a partir dos SVGs com `rsvg-convert` (librsvg). Diagramas em 2x; a prévia em tamanho exato:

```sh
rsvg-convert -z 2 docs/assets/arquitetura.svg -o docs/assets/arquitetura.png
rsvg-convert -w 1280 -h 640 docs/assets/preview.svg -o docs/assets/preview.png
```

Antes de commitar, remova os metadados e confira:

```sh
exiftool -all= -overwrite_original docs/assets/*.png
xattr -c docs/assets/*
exiftool -a -u -g1 docs/assets/preview.png
```

Nenhuma imagem usa brasão, logotipo, mascote ou imagem da Receita Federal, do gov.br ou do programa oficial. Só as cores foram aproveitadas. O MCP Imposto de Renda é um projeto independente e não oficial.
