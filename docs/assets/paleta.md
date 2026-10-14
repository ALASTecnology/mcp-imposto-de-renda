# Paleta de cores

As imagens desta pasta usam apenas duas fontes de cor, sem valores inventados:

1. **Padrão Digital de Governo (Design System gov.br)**, versão 3.6.2 do pacote `@govbr-ds/core`. Os valores foram conferidos em três lugares: a página [Fundamentos visuais > Cores](https://www.gov.br/ds/fundamentos-visuais/cores) (conteúdo servido de `https://docs-ds.estaleiro.serpro.gov.br/govbr-ds/ds/fundamentos-visuais/cores/cores.md`), o repositório oficial [govbr-ds-dev-core no GitLab](https://gitlab.com/govbr-ds/govbr-ds-dev/govbr-ds-dev-core) (`src/partial/scss/configs/colors/_*.scss`) e o arquivo de tokens publicado no npm (`dist/core-tokens.css`).
2. **Cores do programa IRPF 2026**, medidas nas imagens que acompanham o próprio programa (`lib-modulos/irpf-icones.jar` dentro de `IRPF2026-1.5.zip`). A medição usou `magick <imagem> -alpha off -colors 8 -format %c histogram:info:` e registra a cor quantizada dominante de cada faixa tonal.

Nenhuma imagem, ícone, brasão, logotipo ou mascote foi copiado. Só as cores foram aproveitadas. O MCP Imposto de Renda é um projeto independente e não oficial.

## Cores do Design System gov.br

Os nomes são os tokens CSS do pacote (`--nome`). A coluna "Papel no gov.br" repete a função documentada na página de cores.

| Cor | Hex | Token | Papel no gov.br | Uso aqui |
|---|---|---|---|---|
| Azul principal | `#1351B4` | `--blue-warm-vivid-70` (`--color-primary-default`) | Interação em fundo claro | Marca, bordas das caixas principais, números das etapas, "MCP" no título |
| Azul escuro | `#0C326F` | `--blue-warm-vivid-80` (`--color-primary-darken-01`) | Superfície escura alternativa | Texto dos selos e das etiquetas sobre azul claro, campos do .DBK no painel escuro |
| Azul noite | `#071D41` | `--blue-warm-vivid-90` (`--background-dark`) | Superfície escura principal | Títulos, painéis escuros, caixa do comando, check do ícone |
| Azul médio | `#5992ED` | `--blue-warm-vivid-40` (`--color-primary-lighten-02`) | Escala da cor principal | Contorno do ícone na versão escura, borda do tipo de registro no .DBK |
| Azul claro | `#81AEFC` | `--blue-warm-vivid-30` | Escala da cor principal | Bordas secundárias, contorno do cartão da prévia |
| Azul pastel | `#ADCDFF` | `--blue-warm-vivid-20` | Escala da cor principal | Dobra do documento no ícone |
| Azul gelo | `#D4E5FF` | `--blue-warm-vivid-10` | Escala da cor principal | Etiquetas internas, texto claro sobre azul |
| Azul névoa | `#EDF5FF` | `--blue-warm-vivid-5` | Escala da cor principal | Fundo das caixas do servidor e dos selos |
| Azul acinzentado | `#C5D4EB` | `--blue-warm-20` | Interação em fundo escuro | Rótulos sobre o painel escuro, "MCP" na marca escura |
| Azul acinzentado médio | `#98AFD2` | `--blue-warm-30` | Escala blue-warm | Texto secundário no painel escuro do .DBK |
| Azul acinzentado escuro | `#345D96` | `--blue-warm-60` | Escala blue-warm | Régua e bordas no painel escuro do .DBK |
| Branco | `#FFFFFF` | `--pure-0` | Superfície clara principal e leitura em fundo escuro | Fundo das imagens, texto sobre azul |
| Cinza superfície | `#F8F8F8` | `--gray-2` | Superfície clara alternativa | Caixas de apoio |
| Cinza 5 | `#F0F0F0` | `--gray-5` | Escala de cinzas | Caixas neutras |
| Cinza 10 | `#E6E6E6` | `--gray-10` | Escala de cinzas | Moldura das ilustrações, divisórias |
| Cinza 20 | `#CCCCCC` | `--gray-20` | Escala de cinzas | Bordas neutras, rótulos no painel escuro |
| Cinza 40 | `#888888` | `--gray-40` | Escala de cinzas | Tracejado da área "Sua máquina" (só traço, nunca texto) |
| Cinza 70 | `#555555` | `--gray-70` | Escala de cinzas | Subtítulos, setas, texto secundário |
| Cinza leitura | `#333333` | `--gray-80` | Leitura em fundo claro | Texto corrido |
| Amarelo | `#FFCD07` | `--yellow-vivid-20` | Feedback de alerta | Selo do ícone, faixa superior da prévia, "$" do comando, registro T9 |
| Amarelo claro | `#FEE685` | `--yellow-vivid-10` | Escala de alerta | Texto do T9 no painel escuro |
| Amarelo névoa | `#FFF5C2` | `--yellow-vivid-5` | Superfície de alerta | Aviso "Projeto independente, não oficial", caixa do T9 e do golden, selo "grava" |
| Amarelo escuro | `#B38C00` | `--yellow-vivid-40` | Escala de alerta | Borda do aviso de projeto não oficial |
| Ocre | `#776017` | `--yellow-vivid-60` | Escala de alerta | Círculo da etapa "Golden JSON" (texto branco), texto do selo "grava" |
| Oliva | `#5C4809` | `--yellow-vivid-70` | Escala de alerta | Fundo do T9 no painel escuro |
| Verde | `#168821` | `--green-cool-vivid-50` | Feedback de sucesso | Marcas de conferido, borda de ".DBK salvo", faixa dos grupos que funcionam sem pasta |
| Verde vivo | `#00A91C` | `--green-cool-vivid-40` | Escala de sucesso | Borda do CRC no painel escuro |
| Verde escuro | `#154C21` | `--green-cool-vivid-70` | Escala de sucesso | Saldo a restituir, selo "passa", CRC no painel escuro |
| Verde claro | `#B7F5BD` | `--green-cool-vivid-10` | Escala de sucesso | Texto do CRC e do selo "passa" |
| Verde médio claro | `#70E17B` | `--green-cool-vivid-20` | Escala de sucesso | Borda da caixa "CRC32 por linha" |
| Verde névoa | `#E3F5E1` | `--green-cool-vivid-5` | Superfície de sucesso | Fundo de caixas de sucesso |
| Vermelho | `#E52207` | `--red-vivid-50` | Feedback de erro | Setas e traços de recusa, marca de bloqueio |
| Vermelho escuro | `#B50909` | `--red-vivid-60` | Escala de erro | Texto de recusa |
| Vinho | `#8B0A03` | `--red-vivid-70` | Escala de erro | Selo "falha", texto de aviso em fundo rosado |
| Vermelho claro | `#FB5A47` | `--red-vivid-40` | Escala de erro | Traço do globo riscado no painel escuro |
| Salmão | `#FDB8AE` | `--red-vivid-20` | Escala de erro | Texto "diferença" no painel escuro |
| Rosado | `#FDE0DB` | `--red-vivid-10` | Escala de erro | Detalhes de caixas de erro |
| Rosa névoa | `#FFF3F2` | `--red-vivid-5` | Superfície de erro | Fundo das caixas de recusa |

## Cores do programa IRPF 2026

| Cor | Hex | Origem exata | Uso aqui |
|---|---|---|---|
| Azul-marinho IRPF | `#043171` | Cor dominante escura de `imagens/splash.png` (tela de abertura do programa IRPF 2026) | Títulos e números das etapas que acontecem no programa oficial |
| Azul-celeste IRPF | `#3E98C7` | Cor dominante de destaque de `imagens/tela-bem-vindos/img_fundo.png` (tela de boas-vindas do programa IRPF 2026) | Bordas das caixas e da área que representam o programa oficial |
| Céu IRPF | `#AFE0FA` | Segunda cor dominante de `imagens/splash.png` | Início do degradê do painel direito da prévia |
| Névoa IRPF | `#E0F2FD` | Cor dominante de `imagens/splash.png` | Fim do degradê da prévia, fundo das caixas e da área do programa oficial |

As cores do IRPF aparecem só onde o desenho fala do programa oficial ou na prévia, para lembrar o ambiente que o usuário conhece. O restante segue o gov.br.

## Números da prévia

O quadro "Declaração IRPF 2026" da prévia reproduz o modelo simplificado do exemplo fictício `exemplos/01-assalariado-simples` (arquivo `calculo.md`, saída real do motor): rendimentos tributáveis R$ 96.000,00, desconto simplificado R$ 16.754,34 (teto de 2026), base R$ 79.245,66, imposto devido R$ 10.938,77 (27,5% com truncamento, menos R$ 10.853,78), imposto retido R$ 11.400,00 e saldo a restituir R$ 461,23.

## Contraste

Razões calculadas pela fórmula da WCAG 2.1. Todo texto passa no nível AA (4,5:1); traços e ícones passam 3:1.

| Texto | Fundo | Razão |
|---|---|---|
| `#333333` | `#FFFFFF` | 12,63 |
| `#555555` | `#FFFFFF` / `#F0F0F0` / `#E0F2FD` / `#AFE0FA` | 7,46 / 6,54 / 6,49 / 5,28 |
| `#071D41` | `#FFFFFF` | 16,65 |
| `#1351B4` | `#FFFFFF` / `#EDF5FF` | 7,33 / 6,67 |
| `#0C326F` | `#EDF5FF` / `#D4E5FF` | 11,23 / 9,67 |
| `#043171` | `#E0F2FD` | 10,87 |
| `#333333` | `#FFF5C2` | 11,49 |
| `#154C21` | `#E3F5E1` | 8,82 |
| `#B50909` / `#8B0A03` | `#FFF3F2` | 6,43 / 9,03 |
| `#FFFFFF` | `#1351B4` / `#776017` / `#154C21` / `#8B0A03` | 7,33 / 6,05 / 10,06 / 9,80 |
| `#D4E5FF` | `#1351B4` | 5,74 |
| `#C5D4EB` / `#98AFD2` / `#FEE685` / `#FDB8AE` / `#FFCD07` | `#071D41` | 11,09 / 7,45 / 13,38 / 10,03 / 11,09 |
| Traço `#3E98C7` | `#FFFFFF` | 3,22 |

## Tipografia

O gov.br adota a família **Rawline**, com `Raleway` e `sans-serif` como fallback (token `--font-family-base: Rawline, Raleway, sans-serif`). Os SVGs declaram `Rawline, Raleway, "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif`, então quem tiver Rawline instalada vê a fonte oficial.

Rawline e Raleway não estão instaladas na máquina que gerou os PNGs. O `rsvg-convert` 2.63.2 (Pango 1.58.2) caiu em **Avenir Next**, conferido renderizando o mesmo texto com a pilha completa e com `Avenir Next` isolada e comparando os arquivos. O texto monoespaçado sai em **Menlo**, conferido da mesma forma. Os layouts foram revisados com Avenir Next, que é mais larga que Segoe UI e Helvetica, para não haver texto cortado em nenhuma delas.
