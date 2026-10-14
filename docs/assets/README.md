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

Os PNGs são renderizados a partir dos SVGs com qualquer rasterizador local (por exemplo `rsvg-convert -z 2 arquivo.svg -o arquivo.png`). Antes de commitar, remova os metadados:

```sh
exiftool -all= -overwrite_original docs/assets/*.png
xattr -c docs/assets/*
```

Nenhuma imagem usa marca, brasão ou identidade visual da Receita Federal ou do governo federal. O MCP Imposto de Renda não é um serviço oficial.
