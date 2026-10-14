# Estrutura de pacotes do PGD IRPF 2026 (versão 1.5)

Inventário de nomes de pacotes, classes, telas (`.form`) e relatórios (`.jasper`) dos JARs do programa oficial, para localizar fichas e funções. 
Fonte: `vendor/rfb/irpf/IRPF2026-1.5.zip`, extraído fora do repositório. Método: listagem do conteúdo dos JARs (`unzip -l`) e nomes de métodos públicos via `javap -public` (sem bytecode). 
Nenhum código da Receita Federal foi copiado; só nomes. Classes internas (`$`) foram omitidas. Papéis são inferidos dos nomes e podem conter imprecisões.

## Resumo por JAR

| JAR | Classes | Pacotes | Telas (.form) | Relatórios (.jasper) |
|---|---:|---:|---:|---:|
| `irpf.jar` | 8 | 1 | 0 | 0 |
| `lib-modulos/irpf-gui-atividade-rural.jar` | 35 | 1 | 14 | 0 |
| `lib-modulos/irpf-gui-basica.jar` | 312 | 21 | 124 | 0 |
| `lib-modulos/irpf-gui-carne-leao.jar` | 33 | 2 | 13 | 0 |
| `lib-modulos/irpf-gui-declaracao.jar` | 120 | 19 | 69 | 0 |
| `lib-modulos/irpf-gui-gcap.jar` | 142 | 28 | 94 | 0 |
| `lib-modulos/irpf-gui-renda-variavel.jar` | 15 | 1 | 4 | 0 |
| `lib-modulos/irpf-icones.jar` | 0 | 0 | 0 | 0 |
| `lib-modulos/irpf-importacao-exportacao.jar` | 32 | 7 | 0 | 0 |
| `lib-modulos/irpf-impressao.jar` | 11 | 3 | 0 | 239 |
| `lib-modulos/irpf-negocio-calculo.jar` | 32 | 1 | 0 | 0 |
| `lib-modulos/irpf-negocio-declaracao.jar` | 376 | 53 | 0 | 0 |
| `lib-modulos/irpf-servicos-nuvem.jar` | 15 | 3 | 0 | 0 |
| `lib/ppgd-formatos-externos-4.3.1.jar` | 45 | 12 | 0 | 0 |
| `lib/ppgd-gui-beans-4.3.1.jar` | 129 | 10 | 0 | 0 |
| `lib/ppgd-icones-4.0.jar` | 0 | 0 | 0 | 0 |
| `lib/ppgd-infraestrutura-4.3.1.jar` | 32 | 5 | 0 | 0 |
| `lib/ppgd-negocio-4.3.1.jar` | 96 | 8 | 0 | 0 |
| `lib/ppgd-persistencia-4.3.1.jar` | 28 | 7 | 0 | 0 |
| `lib/ppgd-pgd-utils-4.3.1.jar` | 8 | 4 | 1 | 0 |
| `lib/receitanet-pro-1.32.jar` | 131 | 2 | 0 | 0 |
| `lib/recnet-envelope-1.2.jar` | 8 | 1 | 0 | 0 |
| `lib/recnetutil-1.1.jar` | 9 | 1 | 0 | 0 |
| `lib/serpro-1.0.0.jar` | 12 | 3 | 0 | 0 |
| **Total** | **1629** | **193** | **319** | **239** |

Observações: `irpf-icones.jar` e `ppgd-icones-4.0.jar` só têm imagens. `receitanet-pro-1.32.jar` tem nomes ofuscados (A, B, aA...), por isso só os nomes legíveis aparecem abaixo. 
Recursos não executáveis relevantes (tabelas XML, `Mensagens.properties`, layouts de arquivo) estão em `irpf.jar` e em `lib/resources/`, tratados em `tabelas/README.md`.

## Visão por área funcional

| Área | Pacotes (JAR) | Classes |
|---|---|---:|
| Identificação | `serpro/ppgd/irpf/gui/declaracao/contribuinte` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/contribuinte` (irpf-negocio-declaracao.jar) | 12 |
| Dependentes e alimentandos | `serpro/ppgd/irpf/gui/declaracao/alimentandos` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/gui/declaracao/dependentes` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/alimentandos` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/dependentes` (irpf-negocio-declaracao.jar) | 23 |
| Rendimentos | `serpro/ppgd/irpf/gui/declaracao/impostopago` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/gui/declaracao/rendIsentos` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/gui/declaracao/rendTributacaoExclusiva` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/gui/declaracao/rendacm` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/gui/declaracao/rendpj` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/gui/declaracao/rendpjexigsuspensa` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/impostopago` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/rendIsentos` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/rendTributacaoExclusiva` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/rendacm` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/rendpj` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/rendpjexigibilidade` (irpf-negocio-declaracao.jar) | 98 |
| Carnê-leão | `serpro/ppgd/irpf/gui/rendpf` (irpf-gui-carne-leao.jar)<br>`serpro/ppgd/irpf/gui/rendpf/nuvem` (irpf-gui-carne-leao.jar)<br>`serpro/ppgd/irpf/negocio/rendpf` (irpf-negocio-declaracao.jar) | 43 |
| Pagamentos e doações | `serpro/ppgd/irpf/gui/declaracao/doacaodiretamentedeclaracao` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/gui/declaracao/doacoes` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/gui/declaracao/eleicoes` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/gui/declaracao/pagamentos` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/doacaodeclaracao` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/doacoes` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/eleicoes` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/pagamentos` (irpf-negocio-declaracao.jar) | 41 |
| Bens e direitos | `serpro/ppgd/irpf/gui/declaracao/bens` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/bens` (irpf-negocio-declaracao.jar) | 33 |
| Dívidas | `serpro/ppgd/irpf/gui/declaracao/dividas` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/dividas` (irpf-negocio-declaracao.jar) | 5 |
| Espólio | `serpro/ppgd/irpf/gui/declaracao/espolio` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/gui/declaracao/herdeiros` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/espolio` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/herdeiros` (irpf-negocio-declaracao.jar) | 18 |
| Saída definitiva | `serpro/ppgd/irpf/gui/declaracao/saida` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/saida` (irpf-negocio-declaracao.jar) | 3 |
| GCAP | `serpro/ppgd/irpf/gui/gcap` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensimoveis` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensimoveis/adquirente` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensimoveis/apuracao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensimoveis/aquisicao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensimoveis/calculo` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensimoveis/consolidacao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensimoveis/identificacao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensimoveis/operacao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensimoveis/perguntas` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensmoveis` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensmoveis/adquirente` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensmoveis/apuracao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensmoveis/aquisicao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensmoveis/calculo` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensmoveis/consolidacao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensmoveis/identificacao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/bensmoveis/operacao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/psocietarias` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/psocietarias/adquirente` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/psocietarias/apuracao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/psocietarias/aquisicao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/psocietarias/calculo` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/psocietarias/consolidacao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/psocietarias/identificacao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/psocietarias/operacao` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/gui/gcap/table` (irpf-gui-gcap.jar)<br>`serpro/ppgd/irpf/negocio/gcap` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/adquirente` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/alienacao` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/apuracao` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/aquisicao` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/bensimoveis` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/bensmoveis` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/calculo` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/consolidacao` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/entidades` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/especie` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/perguntas` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/psocietarias` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/gcap/util` (irpf-negocio-declaracao.jar) | 189 |
| GCAP (moeda estrangeira) | `serpro/ppgd/irpf/gui/gcap/especie` (irpf-gui-gcap.jar) | 15 |
| Renda variável | `serpro/ppgd/irpf/gui/rendavariavel` (irpf-gui-renda-variavel.jar)<br>`serpro/ppgd/irpf/negocio/rendavariavel` (irpf-negocio-declaracao.jar) | 25 |
| Atividade rural | `serpro/ppgd/irpf/gui/atividaderural` (irpf-gui-atividade-rural.jar)<br>`serpro/ppgd/irpf/negocio/atividaderural` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/atividaderural/brasil` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/atividaderural/exterior` (irpf-negocio-declaracao.jar) | 62 |
| Cálculo | `serpro/ppgd/irpf/gui/basica/comparativo` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/declaracao/resumo` (irpf-gui-declaracao.jar)<br>`serpro/ppgd/irpf/calculos` (irpf-negocio-calculo.jar)<br>`serpro/ppgd/irpf/negocio/comparativo` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/resumo` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/util/calculos` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/negocio/interpretador` (ppgd-negocio-4.3.1.jar) | 76 |
| Pendências | `serpro/ppgd/irpf/gui/basica/pendencias` (irpf-gui-basica.jar)<br>`serpro/ppgd/gui/pendencia` (ppgd-gui-beans-4.3.1.jar)<br>`serpro/ppgd/negocio/pendencia` (ppgd-negocio-4.3.1.jar) | 9 |
| Pré-preenchida | `serpro/ppgd/irpf/negocio/declaracao/prepreenchida` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/declaracao/prepreenchida/dimob` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/declaracao/prepreenchida/dirf` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/declaracao/prepreenchida/dmed` (irpf-negocio-declaracao.jar) | 35 |
| Importação/exportação | `serpro/ppgd/irpf/gui/basica/declaracao/assistida/informeplanosaude` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/declaracao/assistida/informerendimentos` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/txt/gravacaorestauracao` (irpf-importacao-exportacao.jar)<br>`serpro/ppgd/irpf/txt/importacao` (irpf-importacao-exportacao.jar)<br>`serpro/ppgd/irpf/txt/importacao/atividaderural` (irpf-importacao-exportacao.jar)<br>`serpro/ppgd/irpf/txt/importacao/carneleao` (irpf-importacao-exportacao.jar)<br>`serpro/ppgd/irpf/txt/importacao/gcap` (irpf-importacao-exportacao.jar)<br>`serpro/ppgd/irpf/txt/importacao/informerendimentospj` (irpf-importacao-exportacao.jar)<br>`serpro/ppgd/irpf/txt/util` (irpf-importacao-exportacao.jar)<br>`serpro/ppgd/irpf/negocio/declaracao/anoanterior` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/declaracao/assistida/informeplanosaude` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/declaracao/assistida/informerendimentos` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/formatosexternos/txt` (ppgd-formatos-externos-4.3.1.jar)<br>`serpro/ppgd/formatosexternos/txt/excecao` (ppgd-formatos-externos-4.3.1.jar) | 79 |
| Impressão | `dirpf2026scriptlets` (irpf-impressao.jar)<br>`serpro/ppgd/irpf/impressao` (irpf-impressao.jar)<br>`serpro/ppgd/irpf/impressao/util/scriptlet` (irpf-impressao.jar)<br>`serpro/ppgd/formatosexternos` (ppgd-formatos-externos-4.3.1.jar)<br>`serpro/ppgd/formatosexternos/barcode` (ppgd-formatos-externos-4.3.1.jar)<br>`serpro/ppgd/formatosexternos/barcode/util` (ppgd-formatos-externos-4.3.1.jar)<br>`serpro/ppgd/formatosexternos/barcodedesigners` (ppgd-formatos-externos-4.3.1.jar) | 33 |
| Serviços em nuvem | `serpro/ppgd/irpf/gui/basica/nuvem` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/nuvem` (irpf-servicos-nuvem.jar)<br>`serpro/ppgd/irpf/nuvem/carneleao` (irpf-servicos-nuvem.jar)<br>`serpro/ppgd/irpf/nuvem/util/certificadodigital` (irpf-servicos-nuvem.jar) | 22 |
| Transmissão | `serpro/ppgd/formatosexternos/hash` (ppgd-formatos-externos-4.3.1.jar)<br>`serpro/ppgd/formatosexternos/hash/excecao` (ppgd-formatos-externos-4.3.1.jar)<br>`serpro/ppgd/formatosexternos/transmissao` (ppgd-formatos-externos-4.3.1.jar)<br>`serpro/receitanet` (ppgd-formatos-externos-4.3.1.jar)<br>`serpro/receitanet/carregador` (ppgd-formatos-externos-4.3.1.jar)<br>`srf/irpf/util` (ppgd-formatos-externos-4.3.1.jar)<br>`serpro/receitanet` (receitanet-pro-1.32.jar)<br>`serpro/receitanet/gui` (receitanet-pro-1.32.jar)<br>`serpro/receitanet/envelope` (recnet-envelope-1.2.jar)<br>`serpro/receitanet/util` (recnetutil-1.1.jar)<br>`serpro/hash` (serpro-1.0.0.jar)<br>`serpro/transmissao` (serpro-1.0.0.jar) | 171 |
| Menus e ações | `serpro/ppgd/irpf/gui/basica/acoes` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/dialogs` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/negocio/declaracao/copiaseguranca` (irpf-negocio-declaracao.jar) | 128 |
| Navegação | `serpro/ppgd/irpf/gui/basica` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/dashboard` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/dashboard/fichas` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/favoritos` (irpf-gui-basica.jar) | 94 |
| Ferramentas | `serpro/ppgd/irpf/gui/basica/util/calc` (irpf-gui-basica.jar) | 8 |
| Ajuda | `serpro/ppgd/infraestrutura/ajuda` (ppgd-infraestrutura-4.3.1.jar) | 4 |
| Tabelas | `serpro/ppgd/irpf/negocio/tabelas` (irpf-negocio-declaracao.jar) | 8 |
| Persistência | `serpro/ppgd/persistenciagenerica` (ppgd-persistencia-4.3.1.jar)<br>`serpro/ppgd/repositorio` (ppgd-persistencia-4.3.1.jar)<br>`serpro/ppgd/repositorio/acoes` (ppgd-persistencia-4.3.1.jar)<br>`serpro/ppgd/repositorio/embeddedDB/util` (ppgd-persistencia-4.3.1.jar)<br>`serpro/ppgd/repositorio/repositorioXML` (ppgd-persistencia-4.3.1.jar)<br>`serpro/ppgd/repositorio/repositorioXML/util` (ppgd-persistencia-4.3.1.jar)<br>`serpro/ppgd/repositorio/util` (ppgd-persistencia-4.3.1.jar)<br>`serpro/ppgd/persistenciagenerica` (ppgd-pgd-utils-4.3.1.jar) | 32 |
| Núcleo da declaração | `serpro/ppgd/irpf/negocio` (irpf-negocio-declaracao.jar) | 24 |
| Infraestrutura PPGD | `serpro/ppgd/app` (irpf.jar)<br>`serpro/ppgd/irpf/gui/basica/componente` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/listener` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/ml/options` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/table` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/table/editors` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/testes` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/update` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/util` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/gui/basica/util/tabs` (irpf-gui-basica.jar)<br>`serpro/ppgd/irpf/negocio/exception` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/util` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/irpf/negocio/util/update` (irpf-negocio-declaracao.jar)<br>`serpro/ppgd/gui` (ppgd-gui-beans-4.3.1.jar)<br>`serpro/ppgd/gui/editors` (ppgd-gui-beans-4.3.1.jar)<br>`serpro/ppgd/gui/filechooser` (ppgd-gui-beans-4.3.1.jar)<br>`serpro/ppgd/gui/xbeans` (ppgd-gui-beans-4.3.1.jar)<br>`serpro/ppgd/gui/xbeans/autocomplete` (ppgd-gui-beans-4.3.1.jar)<br>`serpro/ppgd/gui/xbeans/customizers` (ppgd-gui-beans-4.3.1.jar)<br>`serpro/ppgd/gui/xbeans/editors` (ppgd-gui-beans-4.3.1.jar)<br>`serpro/ppgd/gui/xbeans/listener` (ppgd-gui-beans-4.3.1.jar)<br>`serpro/ppgd/gui/xbeans/table` (ppgd-gui-beans-4.3.1.jar)<br>`serpro/ppgd/infraestrutura` (ppgd-infraestrutura-4.3.1.jar)<br>`serpro/ppgd/infraestrutura/eventos` (ppgd-infraestrutura-4.3.1.jar)<br>`serpro/ppgd/infraestrutura/eventos/teste` (ppgd-infraestrutura-4.3.1.jar)<br>`serpro/ppgd/infraestrutura/util` (ppgd-infraestrutura-4.3.1.jar)<br>`serpro/ppgd/negocio` (ppgd-negocio-4.3.1.jar)<br>`serpro/ppgd/negocio/exception` (ppgd-negocio-4.3.1.jar)<br>`serpro/ppgd/negocio/impl` (ppgd-negocio-4.3.1.jar)<br>`serpro/ppgd/negocio/usuariodefault` (ppgd-negocio-4.3.1.jar)<br>`serpro/ppgd/negocio/util` (ppgd-negocio-4.3.1.jar)<br>`serpro/ppgd/negocio/validadoresBasicos` (ppgd-negocio-4.3.1.jar)<br>`serpro/ppgd/cacheni` (ppgd-pgd-utils-4.3.1.jar)<br>`serpro/ppgd/log/util` (ppgd-pgd-utils-4.3.1.jar)<br>`serpro/ppgd/negocio` (ppgd-pgd-utils-4.3.1.jar)<br>`serpro/util` (serpro-1.0.0.jar) | 339 |

## Classes-chave para localizar funções

Nomes de métodos públicos obtidos com `javap -public`, só como índice.

- `serpro.ppgd.irpf.negocio.DeclaracaoIRPF` (irpf-negocio-declaracao): raiz do modelo. Acessores por ficha: Contribuinte, Dependentes, Alimentandos, RendPJ (titular/dependentes), RendPJComExigibilidade, RendPFTitular, RendPFDependente, RendAcm, RendIsentos, RendTributacaoExclusiva, ImpostoPago, Pagamentos, Doacoes, DoacoesEleitorais, ColecaoEstatutoCriancaAdolescente, ColecaoEstatutoIdoso, Bens, ColecaoRendimentoAplicacoesFinanceiras, Dividas, Espolio, Herdeiros, RendaVariavel, RendaVariavelDependente, FundosInvestimentos, FundosInvestimentosDependente, AtividadeRural, GCAP, Saida, Resumo, ModeloCompleta, ModeloSimplificada, Comparativo, EmCalamidade.
- `serpro.ppgd.irpf.negocio.IRPFFacade`: ciclo de vida da declaração: criarDeclaracao, abreDeclaracao, salvarDeclaracao, excluirDeclaracao, fazerBackup, restaurarBackup, recuperarDeclaracaoIRPF, listas de declarações em preenchimento e transmitidas.
- `serpro.ppgd.irpf.negocio.tabelas.CadastroTabelasIRPF`: carga das tabelas de domínio: bancos, bens, dependências, municípios (e em calamidade), naturezas de ocupação, ocupações, países, tipos de conta, dívidas, doações, pagamentos, rendimentos (tributáveis, isentos, exclusivos), UFs ECA/Idoso, moedas, altcoins, stablecoins, raça/cor, representações, naturezas GCAP/GCME, espécies de participação societária, tipos de atividade rural.
- `serpro.ppgd.irpf.negocio.resumo.CalculoImposto`: base de cálculo, imposto devido (I, II, RRA, Lei 14.754), dedução de incentivo, desconto simplificado, alíquota efetiva, imposto a restituir/pagar, quotas, débito automático, conta de crédito, imposto pago no exterior, carnê-leão titular/dependentes.
- `serpro.ppgd.irpf.nuvem.BarramentoIRPFService`: serviços online: obterPrePreenchida, importarCarneLeaoComLoginGovBr/ComCodigoAcesso, salvarDecOnline/recuperarDecOnline, obterPdfDarfQuota/ECA/Idoso/Maed/MaedEspolio, obterTodosMunicipios, obterDataVencimentoDFE, calcularMultaJurosDarfAuxilio, captcha, token de acesso.
- `serpro.ppgd.irpf.txt.gravacaorestauracao.GravadorTXT`: gravarDeclaracao (arquivo de entrega), copiarDeclaracao, criarArquivoPersistenciaOnline, montaNomeArquivoTXT.
- `serpro.ppgd.formatosexternos.transmissao.RecnetAdaptor`: transmitirDeclaracao, chamarRecNetWeb, chamarRecNetWindows.
- `serpro.ppgd.irpf.gui.basica.acoes.*Action`: uma classe por item de menu (lista completa na seção do JAR irpf-gui-basica).

## Detalhe por JAR e pacote

### `irpf.jar`

8 classes, 0 telas, 0 relatórios.

#### `serpro.ppgd.app`

- Classes: 8
- Área: Infraestrutura PPGD
- Papel provável: Ponto de entrada do aplicativo IRPF, constantes globais, mensagens e ajuda.
- Classes: `AjudaIf`, `ConstantesIf`, `ConstantesImpressaoIf`, `ConstantesMensagens`, `IRPFPGD`, `MensagensIf`, `PGDAb`, `PlataformaIRPFPGD`

### `lib-modulos/irpf-gui-atividade-rural.jar`

35 classes, 14 telas, 0 relatórios.

#### `serpro.ppgd.irpf.gui.atividaderural`

- Classes: 35
- Área: Atividade rural
- Papel provável: Telas da ficha Atividade Rural: imóveis, receitas e despesas, apuração, rebanho, bens e dívidas da atividade, Brasil e exterior.
- Classes: `MovimentacaoRebanhoCellRenderer`, `PainelAbaApuracaoResultadoBrasil`, `PainelAbaApuracaoResultadoExterior`, `PainelAbaDadosImovelBrasilDetalhe`, `PainelAbaDadosImovelBrasilLista`, `PainelAbaDadosImovelExteriorDetalhe`, `PainelAbaDadosImovelExteriorLista`, `PainelAbaDividasBrasilDetalhe`, `PainelAbaDividasBrasilLista`, `PainelAbaDividasExteriorDetalhe`, `PainelAbaDividasExteriorLista`, `PainelAbaMovimentacaoRebanhoBrasil`, `PainelAbaMovimentacaoRebanhoExterior`, `PainelAbaReceitasDespesasBrasil`, `PainelAbaReceitasDespesasExteriorDetalhe`, `PainelAbaReceitasDespesasExteriorLista`, `PainelApuracaoResultado`, `PainelBensARDetalhe`, `PainelBensARLista`, `PainelDadosImovel`, `PainelDividasAR`, `PainelEdicaoItemQuadroParticipante`, `PainelMovimentacaoRebanho`, `PainelParticipantes`, `PainelQuadroAuxiliarParticipantesLista`, `PainelReceitasDespesas`, `TableModelBensAR`, `TableModelDadosImovel`, `TableModelDividasAR`, `TableModelMovimentacaoRebanho`, `TableModelQuadroAuxiliarParticipantes`, `TableModelReceitasDespesasBrasil`, `TableModelReceitasDespesasExterior`, `TableMovimentacaoRebanho`, `TableReceitasDespesasBrasil`

#### Telas (`.form`) de `irpf-gui-atividade-rural.jar`

- `serpro.ppgd.irpf.gui.atividaderural` (14): PainelAbaApuracaoResultadoBrasil, PainelAbaApuracaoResultadoExterior, PainelAbaDadosImovelBrasilDetalhe, PainelAbaDadosImovelExteriorDetalhe, PainelAbaDividasBrasilDetalhe, PainelAbaDividasExteriorDetalhe, PainelAbaMovimentacaoRebanhoBrasil, PainelAbaMovimentacaoRebanhoExterior, PainelAbaReceitasDespesasBrasil, PainelAbaReceitasDespesasExteriorDetalhe, PainelBensARDetalhe, PainelBensARLista, PainelEdicaoItemQuadroParticipante, PainelParticipantes

### `lib-modulos/irpf-gui-basica.jar`

312 classes, 124 telas, 0 relatórios.

#### `serpro.ppgd.irpf.gui.basica`

- Classes: 81
- Área: Navegação
- Papel provável: Janela principal, barra de ferramentas, boas-vindas, nova declaração, listas genéricas e quadros auxiliares de rendimentos isentos.
- Classes: `ControladorGui`, `DefaultIRPFCellRenderer`, `HoraSalvamentoPanel`, `IRPFBemVindos`, `IRPFLabelInfo`, `IRPFListSelectionModel`, `IRPFTableAb`, `IRPFTableModelAb`, `IRPFTableMonetariaAb`, `JEditOcupacaoPrincipal`, `JIRPFToolbar`, `JIRPFToolbarCustom`, `JTaskPaneFavoritos`, `JanelaPrincipalIRPF`, `NavegacaoIf`, `NavegadorHtml`, `PPGDComponentFactory`, `PPGDFormBuilder`, `PainelAbaAb`, `PainelAbaIf`, `PainelBemVindoToolTip`, `PainelComAbasAb`, `PainelConfirmacaoImportacao`, `PainelContainer`, `PainelDeclaracoesPreenchimento`, `PainelDeclaracoesTransmitidas`, `PainelDemonstrativoAb`, `PainelDemonstrativoIf`, `PainelEdicaoItemGanhosAcoesOuro`, `PainelEdicaoItemMeacaoDissolucao`, `PainelEdicaoItemOutrosRendimentos`, `PainelEdicaoItemPensaoMolestiaGrave`, `PainelEdicaoItemQuadroPensaoAlimenticia`, `PainelEdicaoItemRendimentosNI`, `PainelEdicaoItemTransferenciaPatrimonial`, `PainelEdicaoItemTransporteDetalhado`, `PainelFundoToolTip`, `PainelIRPFBemVindos`, `PainelIRPFIf`, `PainelIRPFNovaDeclaracao`, `PainelImportarProgramasIRPF`, `PainelListaAb`, `PainelListaSemToolbarAb`, `PainelPesquisaPorNome`, `PainelPrincipalAb`, `PainelQuadroAuxiliarGanhosAcoesOuroLista`, `PainelQuadroAuxiliarListaAb`, `PainelQuadroAuxiliarMeacaoDissolucaoLista`, `PainelQuadroAuxiliarOutrosRendimentosLista`, `PainelQuadroAuxiliarPensaoAlimenticiaLista`, `PainelQuadroAuxiliarRendimentosNI`, `PainelQuadroAuxiliarTransferenciaPatrimonialLista`, `PainelQuadroAuxiliarValorDetalhadoLista`, `PainelQuadroAuxiliarValorDetalhadoParcIsentaAposentadoriaLista`, `PainelQuadroAuxiliarValorPensaoMolestiaGraveLista`, `PainelSelecaoTipoContaCEF`, `SplashScreen`, `SummaryTableSorter`, `TableLista`, `TableListaCellRenderer`, `TableListaModel`, `TableListaSumario`, `TableListaSumarioCellRenderer`, `TableListaSumarioModel`, `TableModelImportacao`, `TableModelQuadroAuxiliarGanhosAcoesOuro`, `TableModelQuadroAuxiliarMeacaoDissolucao`, `TableModelQuadroAuxiliarOutrosRendimentos`, `TableModelQuadroAuxiliarPensaoAlimenticia`, `TableModelQuadroAuxiliarPensaoMolestiaGrave`, `TableModelQuadroAuxiliarRendimentosNI`, `TableModelQuadroAuxiliarTransferenciaPatrimonial`, `TableModelQuadroAuxiliarTransporteDetalhado`, `TableModelSelecionaDeclaracao`, `TableModelSelecionaDeclaracaoPreenchimento`, `TableModelSelecionaDeclaracaoTransmitida`, `TableSelecionaDeclaracao`, `TableSelecionaDeclaracaoPreenchimento`, `TableSelecionaDeclaracaoTransmitida`, `Toast`, `TransferFocus`

#### `serpro.ppgd.irpf.gui.basica.acoes`

- Classes: 62
- Área: Menus e ações
- Papel provável: Ações de menu e barra de ferramentas: nova, abrir, importar, gravar, transmitir, imprimir, cópia de segurança, pendências, login gov.br, atualização.
- Classes: `AbrirCalculadoraAction`, `AbrirDemonstrativoAction`, `AbrirNavegadorAction`, `ActionAb`, `AjudaAcessibilidadeAction`, `AjudaAction`, `AtivarRecuperarNomesAction`, `ComparativoAction`, `ConverterDeclaracaoAction`, `ExcluirDemonstrativoAction`, `ExibirAtalhosPGDIRPFAction`, `FecharDemonstrativoAction`, `GravarCopiaSegurancaAction`, `GravarEntregaAction`, `HabilitarAvaliacaoAction`, `ImportarAnoAnteriorAction`, `ImportarAtividadeRuralAction`, `ImportarCarneLeaoAction`, `ImportarGCAPAction`, `ImportarInformePlanoSaudeAction`, `ImportarInformeRendimentosAction`, `ImportarPrepreenchidaAction`, `ImprimirComunicacaoSaidaAction`, `ImprimirDarfAuxilioEmergencialAction`, `ImprimirDarfCodBarrasAction`, `ImprimirDarfECAAction`, `ImprimirDarfEstatutoIdosoAction`, `ImprimirDarfMultaAction`, `ImprimirDeclaracaoAction`, `ImprimirInformeDePlanoDeSaudeAction`, `ImprimirInformeDeRendimentosDePJAction`, `ImprimirReciboAction`, `ImprimirRelacaoDeclaracoesAction`, `ImprimirRendimentosRecebidosPFAction`, `LeaozinhoAction`, `LimparCacheNomesAction`, `LoginGovAction`, `LogoutGovAction`, `MemoriaIRPFAction`, `MudarPainelAction`, `NovidadesAction`, `NovoDemonstrativoAction`, `PaginaDTEAction`, `PaginaIRPFAction`, `RecuperarDecOnlineAction`, `RestaurarCopiaSegurancaAction`, `RetificarDemonstrativoAction`, `SairAction`, `SalvarImagemComunicacaoSaidaAction`, `SalvarImagemDarfCodBarrasAction`, `SalvarImagemDarfECAAction`, `SalvarImagemDarfMultaAction`, `SalvarImagemDeclaracaoAction`, `SalvarImagemReciboAction`, `SalvarImagemRelacaoDeclaracoesAction`, `SalvarOnlineAction`, `SobreAction`, `SugereImportacaoAction`, `TransmitirDeclaracaoAction`, `TutorialAction`, `VerificarNovaVersaoAction`, `VerificarPendenciasAction`

#### `serpro.ppgd.irpf.gui.basica.comparativo`

- Classes: 3
- Área: Cálculo
- Papel provável: Tela de comparativo entre modelo completo e simplificado.
- Classes: `AcaoConfirmaMudancaIf`, `PainelComparativo`, `PainelComparativoAuxiliar`

#### `serpro.ppgd.irpf.gui.basica.componente`

- Classes: 14
- Área: Infraestrutura PPGD
- Papel provável: Componentes visuais reutilizáveis (título, diálogos, edição de valor, número de processo).
- Classes: `BarraTitulo`, `DashedBorder`, `JCustomDialog`, `JCustomPanel`, `JCustomTabbedPane`, `JDegradePanel`, `JEditLabel`, `JEditNumeroProcesso`, `JEditValorTotal`, `JHTMLPane`, `JImagemPanel`, `JTaskAction`, `MensagemPanel`, `PPGDFormPanel`

#### `serpro.ppgd.irpf.gui.basica.dashboard`

- Classes: 2
- Área: Navegação
- Papel provável: Painel inicial com a grade de fichas (dashboard) e seleção de fichas.
- Classes: `DemoGrid`, `PainelDashboard`

#### `serpro.ppgd.irpf.gui.basica.dashboard.fichas`

- Classes: 10
- Área: Navegação
- Papel provável: Painel inicial com a grade de fichas (dashboard) e seleção de fichas.
- Classes: `ButtonFicha`, `ButtonFicha2`, `DadosFicha`, `FichasSelecionadasDataSource`, `FoobarDataSource`, `GridButton`, `GridFichas`, `GridFichasDataSource`, `ScrollGridFichas`, `SortGridUtil`

#### `serpro.ppgd.irpf.gui.basica.declaracao.assistida.informeplanosaude`

- Classes: 3
- Área: Importação/exportação
- Papel provável: Pré-visualização da importação do informe de plano de saúde (declaração assistida).
- Classes: `PainelItemPagamentosPlanoSaude`, `PainelItemReembolsosPlanoSaude`, `PainelPrevisualizadorDeclaracaoAssistidaInformePlanoSaude`

#### `serpro.ppgd.irpf.gui.basica.declaracao.assistida.informerendimentos`

- Classes: 9
- Área: Importação/exportação
- Papel provável: Pré-visualização da importação do informe de rendimentos de PJ (declaração assistida).
- Classes: `PainelItemPagamentos`, `PainelItemPensaoAlimenticia`, `PainelItemPensaoAlimenticiaRendAcm`, `PainelItemPrevidenciaComplementar`, `PainelItemRendAcm`, `PainelItemRendIsentosOuTributacaoExclusiva`, `PainelItemRendPJ`, `PainelItemRendPJExigibilidadeSuspensa`, `PainelPrevisualizadorDeclaracaoAssistidaInformeRendimentos`

#### `serpro.ppgd.irpf.gui.basica.dialogs`

- Classes: 64
- Área: Menus e ações
- Papel provável: Diálogos: criar/abrir/excluir declaração, gravar para entregar, transmitir, retificar, imprimir (declaração, recibo, DARF, comunicação de saída), restituição, débito automático, pendências.
- Classes: `PainelAbaBemVindos`, `PainelAbrirDeclaracao`, `PainelAjudaAcessibilidade`, `PainelAjudaLeituraTela`, `PainelAvisoAvaliacao`, `PainelCreditos`, `PainelCreditosBackground`, `PainelCriarNovaDeclaracao`, `PainelDadosDebitoAutomatico`, `PainelDadosRestituicao`, `PainelExcluirDeclaracao`, `PainelGravacaoEntregaModeloMelhor`, `PainelGravacaoEntregaPendenciasNaoImpeditivas`, `PainelGravarCopiaDeclaracaoTransmitida`, `PainelGravarCopiaSeguranca`, `PainelGravarCopiaSegurancaPasso2`, `PainelGravarEntrega`, `PainelGravarTransmitir`, `PainelGravarTransmitirPendenciasNaoImpeditivas`, `PainelHtmlText`, `PainelImagemNovaDeclaracaoAjuste`, `PainelImagemNovaDeclaracaoEspolio`, `PainelImagemNovaDeclaracaoSaida`, `PainelImpostoPagar`, `PainelImpostoPagarAcessivel`, `PainelImprimirComunicacaoSaida`, `PainelImprimirCriteriosObrigatoriedade`, `PainelImprimirDARFCodigoBarras`, `PainelImprimirDARFCodigoBarrasDemonstrativoAberto`, `PainelImprimirDARFEscolherCota`, `PainelImprimirDARFMaed`, `PainelImprimirDarfAuxilioEmergencial`, `PainelImprimirDarfECA`, `PainelImprimirDarfEstatutoIdoso`, `PainelImprimirDeclaracao`, `PainelImprimirRecibo`, `PainelImprimirRelacaoDeclaracoes`, `PainelImprimirRendimentosRecebidosPF`, `PainelInformaRegimeTributacao`, `PainelInformacaoTipoDeclaracao`, `PainelInformarVersaoCarneLeao`, `PainelMensagemAuxilioEmergencial`, `PainelMensagemDetalhada`, `PainelNovidades`, `PainelNovidadesBackground`, `PainelResultadoImportacao`, `PainelResultadoImportacoes`, `PainelRetificarDeclaracao`, `PainelSelecaoTipoImpressao`, `PainelSelecaoTipoImpressaoNova`, `PainelSobre`, `PainelSobreBackground`, `PainelSplash`, `PainelSplashBackground`, `PainelVerificarPendencias`, `PainelVerificarPendenciasAcessivel`, `RolagemVertical`, `SubPainelDeclaracaoAnoAnterior`, `SubPainelDeclaracaoEmBranco`, `SubPainelDeclaracaoPrePreenchida`, `SubpainelDeclaracoesPreenchimento`, `SubpainelDeclaracoesTransmitidas`, `TabelaPendenciasAcessivel`, `TableModelPendenciasAcessivel`

#### `serpro.ppgd.irpf.gui.basica.favoritos`

- Classes: 1
- Área: Navegação
- Papel provável: Fichas favoritas.
- Classes: `Favoritos`

#### `serpro.ppgd.irpf.gui.basica.listener`

- Classes: 12
- Área: Infraestrutura PPGD
- Papel provável: Ouvintes de eventos de ficha, barra, ajuda, login e tabelas.
- Classes: `CabecalhoFichaListener`, `CustomToolBarListener`, `DemonstrativoListener`, `FavoritoEvent`, `FavoritoListener`, `HabilitacaoAvaliacaoListener`, `HelpListener`, `LoginGovListener`, `MensagemFichaListener`, `SubtituloFichaListener`, `TabelasAtualizadasListener`, `ToolBarListener`

#### `serpro.ppgd.irpf.gui.basica.ml.options`

- Classes: 3
- Área: Infraestrutura PPGD
- Papel provável: Opções de interface.
- Classes: `OptionData`, `OptionSet`, `Options`

#### `serpro.ppgd.irpf.gui.basica.nuvem`

- Classes: 7
- Área: Serviços em nuvem
- Papel provável: Login gov.br, captcha e recuperação de declaração salva online.
- Classes: `CaptchaAudioSwingWorker`, `CaptchaDocumentFilter`, `CaptchaSwingWorker`, `CaptchaUtil`, `PainelCaptchaAb`, `PainelProcessaLogin`, `PainelRecuperarDeclaracaoOnline`

#### `serpro.ppgd.irpf.gui.basica.pendencias`

- Classes: 4
- Área: Pendências
- Papel provável: Painel e tabela de pendências da declaração.
- Classes: `EditTablePendenciasIRPF`, `PainelPendencias`, `TableModelPendenciaIRPF`, `TablePendenciaAcessivelTeste`

#### `serpro.ppgd.irpf.gui.basica.table`

- Classes: 8
- Área: Infraestrutura PPGD
- Papel provável: Tabelas com cabeçalho agrupado e editores de célula.
- Classes: `ColumnGroup`, `GroupableTableColumnModel`, `GroupableTableHeader`, `GroupableTableHeaderUI`, `JComponentCellEditor`, `JComponentCellRenderer`, `JPPGDTable`, `TabelaComponentes`

#### `serpro.ppgd.irpf.gui.basica.table.editors`

- Classes: 2
- Área: Infraestrutura PPGD
- Papel provável: Tabelas com cabeçalho agrupado e editores de célula.
- Classes: `PPGDCellEditorIf`, `PPGDDefaultEditor`

#### `serpro.ppgd.irpf.gui.basica.testes`

- Classes: 1
- Área: Infraestrutura PPGD
- Papel provável: Painel interno de constantes de cálculo (teste).
- Classes: `PainelInfoConstantesCalculo`

#### `serpro.ppgd.irpf.gui.basica.update`

- Classes: 3
- Área: Infraestrutura PPGD
- Papel provável: Verificação e download de atualizações do programa.
- Classes: `PainelAvisoVerificarAtualizacoes`, `PainelDownloadAtualizacoes`, `PainelVerificarAtualizacao`

#### `serpro.ppgd.irpf.gui.basica.util`

- Classes: 13
- Área: Infraestrutura PPGD
- Papel provável: Utilitários de interface: progresso, PDF, downloads, abas.
- Classes: `DisabledGlassPane`, `GuiContas`, `GuiUtil`, `IRPFTableDecorator`, `NegativeDefaultButtonJOptionPane`, `PainelDownloads`, `PdfUtil`, `ProcessoSwing`, `ProgressDialog`, `ProgressMonitor`, `ProgressUtil`, `Tarefa`, `TarefaComExcecao`

#### `serpro.ppgd.irpf.gui.basica.util.calc`

- Classes: 8
- Área: Ferramentas
- Papel provável: Calculadora embutida e transporte de valores.
- Classes: `BotaoCalculadora`, `CalculadoraComValorInterno`, `CalculadoraForm`, `CancelarTransporteForm`, `DisplayForm`, `HistoricoForm`, `OperadorCalculadora`, `TecladoForm`

#### `serpro.ppgd.irpf.gui.basica.util.tabs`

- Classes: 2
- Área: Infraestrutura PPGD
- Papel provável: Utilitários de interface: progresso, PDF, downloads, abas.
- Classes: `ButtonTabComponent`, `JTaskTabs`

#### Telas (`.form`) de `irpf-gui-basica.jar`

- `serpro.ppgd.irpf.gui.basica` (28): HoraSalvamentoPanel, IRPFBemVindos, JIRPFToolbar, JIRPFToolbarCustom, JanelaPrincipalIRPF, PainelBemVindoToolTip, PainelComAbasAb, PainelConfirmacaoImportacao, PainelContainer, PainelDeclaracoesPreenchimento, PainelDeclaracoesTransmitidas, PainelEdicaoItemGanhosAcoesOuro, PainelEdicaoItemMeacaoDissolucao, PainelEdicaoItemOutrosRendimentos, PainelEdicaoItemPensaoMolestiaGrave, PainelEdicaoItemQuadroPensaoAlimenticia, PainelEdicaoItemRendimentosNI, PainelEdicaoItemTransferenciaPatrimonial, PainelEdicaoItemTransporteDetalhado, PainelFundoToolTip, PainelIRPFBemVindos, PainelIRPFNovaDeclaracao, PainelImportarProgramasIRPF, PainelListaAb, PainelListaSemToolbarAb, PainelPesquisaPorNome, PainelQuadroAuxiliarListaAb, PainelSelecaoTipoContaCEF
- `serpro.ppgd.irpf.gui.basica.comparativo` (2): PainelComparativo, PainelComparativoAuxiliar
- `serpro.ppgd.irpf.gui.basica.componente` (2): BarraTitulo, MensagemPanel
- `serpro.ppgd.irpf.gui.basica.dashboard` (1): PainelDashboard
- `serpro.ppgd.irpf.gui.basica.dashboard.fichas` (5): ButtonFicha, ButtonFicha2, GridButton, GridFichas, ScrollGridFichas
- `serpro.ppgd.irpf.gui.basica.declaracao.assistida.informeplanosaude` (3): PainelItemPagamentosPlanoSaude, PainelItemReembolsosPlanoSaude, PainelPrevisualizadorDeclaracaoAssistidaInformePlanoSaude
- `serpro.ppgd.irpf.gui.basica.declaracao.assistida.informerendimentos` (9): PainelItemPagamentos, PainelItemPensaoAlimenticia, PainelItemPensaoAlimenticiaRendAcm, PainelItemPrevidenciaComplementar, PainelItemRendAcm, PainelItemRendIsentosOuTributacaoExclusiva, PainelItemRendPJ, PainelItemRendPJExigibilidadeSuspensa, PainelPrevisualizadorDeclaracaoAssistidaInformeRendimentos
- `serpro.ppgd.irpf.gui.basica.dialogs` (60): PainelAbaBemVindos, PainelAbrirDeclaracao, PainelAjudaAcessibilidade, PainelAvisoAvaliacao, PainelCreditos, PainelCreditosBackground, PainelCriarNovaDeclaracao, PainelDadosDebitoAutomatico, PainelDadosRestituicao, PainelExcluirDeclaracao, PainelGravacaoEntregaModeloMelhor, PainelGravacaoEntregaPendenciasNaoImpeditivas, PainelGravarCopiaDeclaracaoTransmitida, PainelGravarCopiaSeguranca, PainelGravarCopiaSegurancaPasso2, PainelGravarEntrega, PainelGravarTransmitir, PainelGravarTransmitirPendenciasNaoImpeditivas, PainelHtmlText, PainelImagemNovaDeclaracaoAjuste, PainelImagemNovaDeclaracaoEspolio, PainelImagemNovaDeclaracaoSaida, PainelImpostoPagar, PainelImpostoPagarAcessivel, PainelImprimirComunicacaoSaida, PainelImprimirCriteriosObrigatoriedade, PainelImprimirDARFAuxilioEmergencial, PainelImprimirDARFCodigoBarras, PainelImprimirDARFCodigoBarrasDemonstrativoAberto, PainelImprimirDARFEscolherCota, PainelImprimirDARFMaed, PainelImprimirDarfECA, PainelImprimirDarfEstatutoIdoso, PainelImprimirDeclaracao, PainelImprimirRecibo, PainelImprimirRelacaoDeclaracoes, PainelImprimirRendimentosRecebidosPF, PainelInformaRegimeTributacao, PainelInformacaoTipoDeclaracao, PainelInformarVersaoCarneLeao, PainelMensagemAuxilioEmergencial, PainelMensagemDetalhada, PainelNovidades, PainelNovidadesBackground, PainelResultadoImportacao, PainelResultadoImportacoes, PainelRetificarDeclaracao, PainelSelecaoTipoImpressao, PainelSelecaoTipoImpressaoNova, PainelSobre, PainelSobreBackground, PainelSplash, PainelSplashBackground, PainelVerificarPendencias, PainelVerificarPendenciasAcessivel, SubPainelDeclaracaoAnoAnterior, SubPainelDeclaracaoEmBranco, SubPainelDeclaracaoPrePreenchida, SubpainelDeclaracoesPreenchimento, SubpainelDeclaracoesTransmitidas
- `serpro.ppgd.irpf.gui.basica.nuvem` (2): PainelProcessaLogin, PainelRecuperarDeclaracaoOnline
- `serpro.ppgd.irpf.gui.basica.pendencias` (1): PainelPendencias
- `serpro.ppgd.irpf.gui.basica.testes` (1): PainelInfoConstantesCalculo
- `serpro.ppgd.irpf.gui.basica.update` (3): PainelAvisoVerificarAtualizacoes, PainelDownloadAtualizacoes, PainelVerificarAtualizacao
- `serpro.ppgd.irpf.gui.basica.util` (1): PainelDownloads
- `serpro.ppgd.irpf.gui.basica.util.calc` (5): CalculadoraForm, CancelarTransporteForm, DisplayForm, HistoricoForm, TecladoForm
- `serpro.ppgd.irpf.gui.basica.util.tabs` (1): JTaskTabs

### `lib-modulos/irpf-gui-carne-leao.jar`

33 classes, 13 telas, 0 relatórios.

#### `serpro.ppgd.irpf.gui.rendpf`

- Classes: 28
- Área: Carnê-leão
- Papel provável: Ficha Rendimentos Tributáveis Recebidos de PF/Exterior: meses, escrituração (livro caixa), titular e dependentes.
- Classes: `CarneLeaoTableDecorator`, `EscrituracaoTableCellRenderer`, `PainelAbaEscrituracaoDependente`, `PainelAbaEscrituracaoDetalheDependentes`, `PainelAbaEscrituracaoDetalheTitular`, `PainelAbaEscrituracaoMensalDependentesLista`, `PainelAbaLancamentosEscrituracaoDependentes`, `PainelAbaLancamentosEscrituracaoDependentesDetalhe`, `PainelAbaLancamentosEscrituracaoTitular`, `PainelAbaRendPFDependentesDetalhe`, `PainelAbaRendPFDependentesLista`, `PainelAbaRendPFTitular`, `PainelAbaSelecaoDependente`, `PainelAbaSelecaoEscrituracaoDependentes`, `PainelDadosDependentesLista`, `PainelDadosEscrituracao`, `PainelDadosEscrituracaoDependente`, `PainelDadosEscrituracaoMensalDependentes`, `PainelDadosEscrituracaoMensalTitular`, `PainelDadosEscrituracaoTitular`, `RendPFCellRenderer`, `RendPFHeaderCellRenderer`, `RendPFMesCellRenderer`, `TableModelDependentesPF`, `TableModelEscrituracao`, `TableModelRendPF`, `TableModelRendPFDependentes`, `TableRendPF`

#### `serpro.ppgd.irpf.gui.rendpf.nuvem`

- Classes: 5
- Área: Carnê-leão
- Papel provável: Importação do Carnê-Leão Web via gov.br ou código de acesso.
- Classes: `CodigoAcessoModel`, `ImportacaoModel`, `PainelImportacaoCarneLeao`, `PainelLoginGovBrOuCodigoAcesso`, `PainelSolicitarCodigoAcesso`

#### Telas (`.form`) de `irpf-gui-carne-leao.jar`

- `serpro.ppgd.irpf.gui.rendpf` (10): PainelAbaEscrituracaoDependente, PainelAbaEscrituracaoDetalheDependentes, PainelAbaEscrituracaoDetalheTitular, PainelAbaLancamentosEscrituracaoDependentes, PainelAbaLancamentosEscrituracaoDependentesDetalhe, PainelAbaLancamentosEscrituracaoTitular, PainelAbaRendPFDependentesDetalhe, PainelAbaRendPFTitular, PainelAbaSelecaoDependente, PainelAbaSelecaoEscrituracaoDependentes
- `serpro.ppgd.irpf.gui.rendpf.nuvem` (3): PainelImportacaoCarneLeao, PainelLoginGovBrOuCodigoAcesso, PainelSolicitarCodigoAcesso

### `lib-modulos/irpf-gui-declaracao.jar`

120 classes, 69 telas, 0 relatórios.

#### `serpro.ppgd.irpf.gui.declaracao.alimentandos`

- Classes: 6
- Área: Dependentes e alimentandos
- Papel provável: Ficha Alimentandos: decisão judicial e escritura pública.
- Classes: `PainelAlimentandosDecisaoJudicialAba`, `PainelAlimentandosDetalhe`, `PainelAlimentandosEscrituraPublicaAba`, `PainelAlimentandosLista`, `PainelAlimentandosTipoProcessoAbas`, `TableModelAlimentandos`

#### `serpro.ppgd.irpf.gui.declaracao.bens`

- Classes: 16
- Área: Bens e direitos
- Papel provável: Ficha Bens e Direitos: seleção de grupo/código, detalhe, espólio, proprietário/usufrutuário, participação em inventário.
- Classes: `BensToolBarListener`, `JIRPFToolbarBens`, `PainelBensDetalhe`, `PainelBensDetalheEspolio`, `PainelBensDetalheEspolioBrasil`, `PainelBensDetalheEspolioExterior`, `PainelBensLista`, `PainelEdicaoItemQuadroProprietarioUsufrutuario`, `PainelPercentualParticipacaoInventarioDetalhe`, `PainelPercentualParticipacaoInventarioLista`, `PainelQuadroAuxiliarProprietariosUsufrutuariosLista`, `PainelSelecaoCodigoBem`, `PainelSelecaoGrupoCodigoBem`, `TableModelBens`, `TableModelPercentualInventario`, `TableModelProprietariosUsufrutuarios`

#### `serpro.ppgd.irpf.gui.declaracao.contribuinte`

- Classes: 7
- Área: Identificação
- Papel provável: Ficha Identificação do Contribuinte, endereço Brasil/exterior, recibo anterior e recibo da retificada, contribuinte espólio.
- Classes: `PainelContribuinte`, `PainelContribuinteEspolio`, `PainelEnderecoBrasil`, `PainelEnderecoExterior`, `PainelEscolheContribuinte`, `PainelReciboAnterior`, `PainelReciboRetif`

#### `serpro.ppgd.irpf.gui.declaracao.dependentes`

- Classes: 3
- Área: Dependentes e alimentandos
- Papel provável: Ficha Dependentes.
- Classes: `PainelDependentesDetalhe`, `PainelDependentesLista`, `TableModelDependentes`

#### `serpro.ppgd.irpf.gui.declaracao.dividas`

- Classes: 3
- Área: Dívidas
- Papel provável: Ficha Dívidas e Ônus Reais.
- Classes: `PainelDividasDetalhe`, `PainelDividasLista`, `TableModelDividas`

#### `serpro.ppgd.irpf.gui.declaracao.doacaodiretamentedeclaracao`

- Classes: 9
- Área: Pagamentos e doações
- Papel provável: Ficha Doações Diretamente na Declaração: ECA e Estatuto da Pessoa Idosa, avisos de limite excedido.
- Classes: `PainelAbaEstatutoCriancaAdolescenteDetalhe`, `PainelAbaEstatutoCriancaAdolescenteLista`, `PainelAbaEstatutoIdosoDetalhe`, `PainelAbaEstatutoIdosoLista`, `PainelDadosDDD`, `PainelMensagemDoacaoExcedidaECA`, `PainelMensagemDoacaoExcedidaIdoso`, `TableModelEstatutoCriancaAdolescente`, `TableModelEstatutoIdoso`

#### `serpro.ppgd.irpf.gui.declaracao.doacoes`

- Classes: 3
- Área: Pagamentos e doações
- Papel provável: Ficha Doações Efetuadas.
- Classes: `PainelDoacoesDetalhe`, `PainelDoacoesLista`, `TableModelDoacoes`

#### `serpro.ppgd.irpf.gui.declaracao.eleicoes`

- Classes: 3
- Área: Pagamentos e doações
- Papel provável: Ficha Doações a Partidos Políticos e Candidatos.
- Classes: `PainelDoacoesCampanhasDetalhe`, `PainelDoacoesCampanhasLista`, `TableModelDoacoesCampanhas`

#### `serpro.ppgd.irpf.gui.declaracao.espolio`

- Classes: 7
- Área: Espólio
- Papel provável: Fichas de espólio: inventário, escritura pública, declaração final, ajuste anual de espólio.
- Classes: `PainelEscolheEspolio`, `PainelEscrituracaoPublica`, `PainelEspolio`, `PainelEspolioAjusteAnual`, `PainelEspolioDetalhe`, `PainelEspolioDetalheAba`, `PainelFinalEspolio`

#### `serpro.ppgd.irpf.gui.declaracao.herdeiros`

- Classes: 3
- Área: Espólio
- Papel provável: Ficha Herdeiros e meeiros (declaração final de espólio).
- Classes: `PainelHerdeirosDetalhe`, `PainelHerdeirosLista`, `TableModelHerdeiros`

#### `serpro.ppgd.irpf.gui.declaracao.impostopago`

- Classes: 1
- Área: Rendimentos
- Papel provável: Ficha Imposto Pago/Retido.
- Classes: `PainelImpostoPago`

#### `serpro.ppgd.irpf.gui.declaracao.pagamentos`

- Classes: 3
- Área: Pagamentos e doações
- Papel provável: Ficha Pagamentos Efetuados.
- Classes: `PainelPagamentosDetalhe`, `PainelPagamentosLista`, `TableModelPagamentos`

#### `serpro.ppgd.irpf.gui.declaracao.rendIsentos`

- Classes: 16
- Área: Rendimentos
- Papel provável: Ficha Rendimentos Isentos e Não Tributáveis: abas de detalhe por tipo (01 a 06), aviso de parcela isenta de 65 anos.
- Classes: `JAutoCompleteComboRendererTooltip`, `PainelAbaDetalhes01X`, `PainelAbaDetalhes02X`, `PainelAbaDetalhes03X`, `PainelAbaDetalhes03XPensaoAlimenticia`, `PainelAbaDetalhes04X`, `PainelAbaDetalhes05X`, `PainelAbaDetalhes06X`, `PainelAbaRendIsentos`, `PainelAbaRendIsentosDetalhes`, `PainelAbaRendIsentosLista`, `PainelDadosRendIsentos`, `PainelMensagemRendimento65`, `PainelMensagemRendimento65Caso1`, `PainelMensagemRendimento65Caso2`, `TableModelRendIsentos`

#### `serpro.ppgd.irpf.gui.declaracao.rendTributacaoExclusiva`

- Classes: 8
- Área: Rendimentos
- Papel provável: Ficha Rendimentos Sujeitos à Tributação Exclusiva/Definitiva.
- Classes: `PainelAbaDetalhesTributExclusiva01X`, `PainelAbaDetalhesTributExclusiva02X`, `PainelAbaDetalhesTributExclusiva02_2X`, `PainelAbaRendTributEclusivaDetalhes`, `PainelAbaRendTributExclusiva`, `PainelAbaRendTributExclusivaLista`, `PainelDadosRendTribExc`, `TableModelRendTributExclusiva`

#### `serpro.ppgd.irpf.gui.declaracao.rendacm`

- Classes: 7
- Área: Rendimentos
- Papel provável: Ficha Rendimentos Recebidos Acumuladamente (RRA), titular e dependentes.
- Classes: `PainelAbaRendAcmDependentesDetalhe`, `PainelAbaRendAcmDependentesLista`, `PainelAbaRendAcmTitularDetalhe`, `PainelAbaRendAcmTitularLista`, `PainelDadosRendAcm`, `TableModelRendAcmDependentes`, `TableModelRendAcmTitular`

#### `serpro.ppgd.irpf.gui.declaracao.rendpj`

- Classes: 7
- Área: Rendimentos
- Papel provável: Ficha Rendimentos Tributáveis Recebidos de PJ, titular e dependentes.
- Classes: `PainelAbaRendPJDependentesDetalhe`, `PainelAbaRendPJDependentesLista`, `PainelAbaRendPJTitularDetalhe`, `PainelAbaRendPJTitularLista`, `PainelDadosRendPJ`, `TableModelRendPJDependentes`, `TableModelRendPJTitular`

#### `serpro.ppgd.irpf.gui.declaracao.rendpjexigsuspensa`

- Classes: 7
- Área: Rendimentos
- Papel provável: Ficha Rendimentos Tributáveis de PJ com Exigibilidade Suspensa.
- Classes: `PainelAbaRendPJComExigibilidadeDependentesDetalhe`, `PainelAbaRendPJComExigibilidadeDependentesLista`, `PainelAbaRendPJComExigibilidadeTitularDetalhe`, `PainelAbaRendPJComExigibilidadeTitularLista`, `PainelDadosRendPJComExig`, `TableModelRendPJComExigibilidadeDependentes`, `TableModelRendPJComExigibilidadeTitular`

#### `serpro.ppgd.irpf.gui.declaracao.resumo`

- Classes: 10
- Área: Cálculo
- Papel provável: Resumo da declaração: rendimentos e deduções, cálculo do imposto, outras informações, parcelamento e informações bancárias.
- Classes: `PainelAbaInformacoesBancarias`, `PainelAbaParcelamento`, `PainelAbaParcelamentoEspolio`, `PainelCalculoImposto`, `PainelRendimentosTributaveisDeducoes`, `PainelResumoOutrasInformacoes`, `SubPainelCalculoImposto`, `SubPainelCalculoImpostoSimplificado`, `SubPainelDadosBancarios`, `SubPainelParcelamentoInfoBancarias`

#### `serpro.ppgd.irpf.gui.declaracao.saida`

- Classes: 1
- Área: Saída definitiva
- Papel provável: Ficha da Declaração de Saída Definitiva do País.
- Classes: `PainelSaida`

#### Telas (`.form`) de `irpf-gui-declaracao.jar`

- `serpro.ppgd.irpf.gui.declaracao.alimentandos` (4): PainelAlimentandosDecisaoJudicialAba, PainelAlimentandosDetalhe, PainelAlimentandosEscrituraPublicaAba, PainelAlimentandosLista
- `serpro.ppgd.irpf.gui.declaracao.bens` (10): JIRPFToolbarBens, PainelBensDetalhe, PainelBensDetalheEspolio, PainelBensDetalheEspolioBrasil, PainelBensDetalheEspolioExterior, PainelBensLista, PainelEdicaoItemQuadroProprietarioUsufrutuario, PainelPercentualParticipacaoInventarioDetalhe, PainelSelecaoCodigoBem, PainelSelecaoGrupoCodigoBem
- `serpro.ppgd.irpf.gui.declaracao.contribuinte` (6): PainelContribuinte, PainelContribuinteEspolio, PainelEnderecoBrasil, PainelEnderecoExterior, PainelReciboAnterior, PainelReciboRetif
- `serpro.ppgd.irpf.gui.declaracao.dependentes` (1): PainelDependentesDetalhe
- `serpro.ppgd.irpf.gui.declaracao.dividas` (1): PainelDividasDetalhe
- `serpro.ppgd.irpf.gui.declaracao.doacaodiretamentedeclaracao` (4): PainelAbaEstatutoCriancaAdolescenteDetalhe, PainelAbaEstatutoIdosoDetalhe, PainelMensagemDoacaoExcedidaECA, PainelMensagemDoacaoExcedidaIdoso
- `serpro.ppgd.irpf.gui.declaracao.doacoes` (1): PainelDoacoesDetalhe
- `serpro.ppgd.irpf.gui.declaracao.eleicoes` (1): PainelDoacoesCampanhasDetalhe
- `serpro.ppgd.irpf.gui.declaracao.espolio` (5): PainelEscrituracaoPublica, PainelEspolio, PainelEspolioAjusteAnual, PainelEspolioDetalheAba, PainelFinalEspolio
- `serpro.ppgd.irpf.gui.declaracao.herdeiros` (1): PainelHerdeirosDetalhe
- `serpro.ppgd.irpf.gui.declaracao.impostopago` (1): PainelImpostoPago
- `serpro.ppgd.irpf.gui.declaracao.pagamentos` (1): PainelPagamentosDetalhe
- `serpro.ppgd.irpf.gui.declaracao.rendIsentos` (12): PainelAbaDetalhes01X, PainelAbaDetalhes02X, PainelAbaDetalhes03X, PainelAbaDetalhes03XPensaoAlimenticia, PainelAbaDetalhes04X, PainelAbaDetalhes05X, PainelAbaDetalhes06X, PainelAbaRendIsentos, PainelAbaRendIsentosDetalhes, PainelMensagemRendimento65, PainelMensagemRendimento65Caso1, PainelMensagemRendimento65Caso2
- `serpro.ppgd.irpf.gui.declaracao.rendTributacaoExclusiva` (5): PainelAbaDetalhesTributExclusiva01X, PainelAbaDetalhesTributExclusiva02X, PainelAbaDetalhesTributExclusiva02_2X, PainelAbaRendTributEclusivaDetalhes, PainelAbaRendTributExclusiva
- `serpro.ppgd.irpf.gui.declaracao.rendacm` (2): PainelAbaRendAcmDependentesDetalhe, PainelAbaRendAcmTitularDetalhe
- `serpro.ppgd.irpf.gui.declaracao.rendpj` (2): PainelAbaRendPJDependentesDetalhe, PainelAbaRendPJTitularDetalhe
- `serpro.ppgd.irpf.gui.declaracao.rendpjexigsuspensa` (2): PainelAbaRendPJComExigibilidadeDependentesDetalhe, PainelAbaRendPJComExigibilidadeTitularDetalhe
- `serpro.ppgd.irpf.gui.declaracao.resumo` (9): PainelAbaInformacoesBancarias, PainelAbaParcelamento, PainelAbaParcelamentoEspolio, PainelCalculoImposto, PainelRendimentosTributaveisDeducoes, PainelResumoOutrasInformacoes, SubPainelCalculoImposto, SubPainelCalculoImpostoSimplificado, SubPainelDadosBancarios
- `serpro.ppgd.irpf.gui.declaracao.saida` (1): PainelSaida

### `lib-modulos/irpf-gui-gcap.jar`

142 classes, 94 telas, 0 relatórios.

#### `serpro.ppgd.irpf.gui.gcap`

- Classes: 3
- Área: GCAP
- Papel provável: Telas gerais do GCAP (alienações de anos anteriores).
- Classes: `GCAPLabelInfo`, `PainelAlienacaoAnosAnteriores`, `PainelVazio`

#### `serpro.ppgd.irpf.gui.gcap.bensimoveis`

- Classes: 3
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens imóveis: identificação, operação, adquirentes, aquisição, apuração, cálculo, consolidação.
- Classes: `PainelDadosBensImoveis`, `PainelListaBemImovel`, `TableModelBensImoveis`

#### `serpro.ppgd.irpf.gui.gcap.bensimoveis.adquirente`

- Classes: 2
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens imóveis: identificação, operação, adquirentes, aquisição, apuração, cálculo, consolidação.
- Classes: `PainelAbaListaAdquirente`, `TableModelAdquirentes`

#### `serpro.ppgd.irpf.gui.gcap.bensimoveis.apuracao`

- Classes: 10
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens imóveis: identificação, operação, adquirentes, aquisição, apuração, cálculo, consolidação.
- Classes: `PainelAbaApuracaoBemImovel`, `PainelApuracaoBemImovelBrasil`, `PainelApuracaoBemImovelExterior`, `PainelApuracaoBemImovelExteriorAM`, `PainelApuracaoBemImovelExteriorME`, `PainelApuracaoBemImovelExteriorMN`, `TableModelParcelaAquisicaoApuracaoBemImovelBrasil`, `TableModelParcelaAquisicaoApuracaoBemImovelExteriorAM`, `TableModelParcelaAquisicaoApuracaoBemImovelExteriorME`, `TableModelParcelaAquisicaoApuracaoBemImovelExteriorMN`

#### `serpro.ppgd.irpf.gui.gcap.bensimoveis.aquisicao`

- Classes: 21
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens imóveis: identificação, operação, adquirentes, aquisição, apuração, cálculo, consolidação.
- Classes: `PainelAbaAquisicaoBemImovel`, `PainelAquisicaoBemImovelBrasil`, `PainelAquisicaoBemImovelExterior`, `PainelCustoAquisicaoBemImovelBrasil`, `PainelCustoAquisicaoBemImovelExterior`, `PainelCustoAquisicaoBemImovelExteriorAM`, `PainelCustoAquisicaoBemImovelExteriorME`, `PainelCustoAquisicaoBemImovelExteriorMN`, `PainelCustoAquisicaoParceladoBemImovelExterior`, `PainelListaCustoAquisicaoParceladoBemImovelBrasil`, `PainelListaCustoAquisicaoParceladoBemImovelExteriorAM`, `PainelListaCustoAquisicaoParceladoBemImovelExteriorME`, `PainelListaCustoAquisicaoParceladoBemImovelExteriorMN`, `PainelParcelaCustoAquisicaoBrasil`, `PainelParcelaCustoAquisicaoExteriorAM`, `PainelParcelaCustoAquisicaoExteriorME`, `PainelParcelaCustoAquisicaoExteriorMN`, `TableModelParcelaAquisicaoBemImovelBrasil`, `TableModelParcelaAquisicaoBemImovelExteriorAM`, `TableModelParcelaAquisicaoBemImovelExteriorME`, `TableModelParcelaAquisicaoBemImovelExteriorMN`

#### `serpro.ppgd.irpf.gui.gcap.bensimoveis.calculo`

- Classes: 15
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens imóveis: identificação, operação, adquirentes, aquisição, apuração, cálculo, consolidação.
- Classes: `PainelAbaCalculoImpostoBemImovel`, `PainelApuracaoFinalExteriorAmbas`, `PainelApuracaoFinalExteriorBrasil`, `PainelApuracaoFinalExteriorME`, `PainelCalculoImpostoAPrazoBrasil`, `PainelCalculoImpostoAPrazoExterior`, `PainelCalculoImpostoAVistaBrasil`, `PainelCalculoImpostoAVistaExterior`, `PainelParcelaBrasilDetalhe`, `PainelParcelaExteriorAmbasDetalhe`, `PainelParcelaExteriorMEDetalhe`, `PainelParcelaExteriorNacionalDetalhe`, `TableModelParcelasBrasil`, `TableModelParcelasExterior`, `TableModelParcelasExteriorMudancaEnquadramento`

#### `serpro.ppgd.irpf.gui.gcap.bensimoveis.consolidacao`

- Classes: 3
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens imóveis: identificação, operação, adquirentes, aquisição, apuração, cálculo, consolidação.
- Classes: `PainelAbaConsolidacao`, `PainelAbaConsolidacaoBrasil`, `PainelAbaConsolidacaoExterior`

#### `serpro.ppgd.irpf.gui.gcap.bensimoveis.identificacao`

- Classes: 3
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens imóveis: identificação, operação, adquirentes, aquisição, apuração, cálculo, consolidação.
- Classes: `PainelAbaIdentificacaoBemImovel`, `PainelEnderecoBrasil`, `PainelEnderecoExterior`

#### `serpro.ppgd.irpf.gui.gcap.bensimoveis.operacao`

- Classes: 3
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens imóveis: identificação, operação, adquirentes, aquisição, apuração, cálculo, consolidação.
- Classes: `PainelAbaOperacaoBemImovel`, `PainelOperacaoBrasil`, `PainelOperacaoExterior`

#### `serpro.ppgd.irpf.gui.gcap.bensimoveis.perguntas`

- Classes: 6
- Área: GCAP
- Papel provável: Perguntas de isenção/redução na alienação de imóvel (único imóvel, residencial, 180 dias, MP 252, 35 mil).
- Classes: `PainelAbaPerguntas`, `PainelPerguntaConjuntoBensSuperior35Mil`, `PainelPerguntaImovelResidencial`, `PainelPerguntaIndicadorPropriedadeOutroImovel`, `PainelPerguntaMP252`, `PainelPerguntaOutraAlienacao5anos`

#### `serpro.ppgd.irpf.gui.gcap.bensmoveis`

- Classes: 3
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens móveis e direitos.
- Classes: `PainelDadosBensMoveis`, `PainelListaBemMovel`, `TableModelBensMoveis`

#### `serpro.ppgd.irpf.gui.gcap.bensmoveis.adquirente`

- Classes: 2
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens móveis e direitos.
- Classes: `PainelAbaListaAdquirente`, `TableModelAdquirentes`

#### `serpro.ppgd.irpf.gui.gcap.bensmoveis.apuracao`

- Classes: 6
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens móveis e direitos.
- Classes: `PainelAbaApuracaoBemMovel`, `PainelApuracaoBrasil`, `PainelApuracaoExterior`, `PainelApuracaoExteriorAmbas`, `PainelApuracaoExteriorME`, `PainelApuracaoExteriorNacional`

#### `serpro.ppgd.irpf.gui.gcap.bensmoveis.aquisicao`

- Classes: 3
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens móveis e direitos.
- Classes: `PainelAquisicaoMoedaEstrangeira`, `PainelAquisicaoMoedaNacional`, `PainelIAquisicaoAmbasMoedas`

#### `serpro.ppgd.irpf.gui.gcap.bensmoveis.calculo`

- Classes: 14
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens móveis e direitos.
- Classes: `PainelAbaCalculoImpostoBemMovel`, `PainelApuracaoFinalExteriorAmbas`, `PainelApuracaoFinalExteriorBrasil`, `PainelApuracaoFinalExteriorME`, `PainelCalculoImpostoAPrazoBrasil`, `PainelCalculoImpostoAPrazoExterior`, `PainelCalculoImpostoAVistaBrasil`, `PainelCalculoImpostoAVistaExterior`, `PainelParcelaBrasilDetalhe`, `PainelParcelaExteriorAmbasDetalhe`, `PainelParcelaExteriorMEDetalhe`, `PainelParcelaExteriorNacionalDetalhe`, `TableModelParcelasBrasil`, `TableModelParcelasExterior`

#### `serpro.ppgd.irpf.gui.gcap.bensmoveis.consolidacao`

- Classes: 3
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens móveis e direitos.
- Classes: `PainelAbaConsolidacao`, `PainelAbaConsolidacaoBrasil`, `PainelAbaConsolidacaoExterior`

#### `serpro.ppgd.irpf.gui.gcap.bensmoveis.identificacao`

- Classes: 3
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens móveis e direitos.
- Classes: `PainelAbaIdentificacaoBemMovel`, `PainelIdentificacaoBrasil`, `PainelIdentificacaoExterior`

#### `serpro.ppgd.irpf.gui.gcap.bensmoveis.operacao`

- Classes: 3
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de bens móveis e direitos.
- Classes: `PainelAbaOperacaoBemMovel`, `PainelOperacaoBrasil`, `PainelOperacaoExterior`

#### `serpro.ppgd.irpf.gui.gcap.especie`

- Classes: 15
- Área: GCAP (moeda estrangeira)
- Papel provável: Demonstrativo de moeda estrangeira em espécie: moedas alienadas, operações, totalização, consolidação.
- Classes: `PainelAbaConsolidacaoMoeda`, `PainelAbaListaConsolidacoesEspecie`, `PainelAbaListaMoedasEspecie`, `PainelAbaListaOperacoesMoedasEspecie`, `PainelAbaListaOperacoesMoedasEspecieAb`, `PainelAbaListaTotalizacaoMoedasEspecie`, `PainelAbaListaTotalizacoesEspecie`, `PainelAbaMoedaAlienada`, `PainelDadosMoedaAlienada`, `PainelDadosMoedas`, `TableModelConsolidacoesEspecie`, `TableModelMoedasEspecie`, `TableModelOperacoesMoedasEspecie`, `TableModelTotalizacaoMoedasEspecie`, `TableModelTotalizacoesEspecie`

#### `serpro.ppgd.irpf.gui.gcap.psocietarias`

- Classes: 3
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de participações societárias.
- Classes: `PainelDadosPSocietarias`, `PainelListaPSocietarias`, `TableModelPSocietarias`

#### `serpro.ppgd.irpf.gui.gcap.psocietarias.adquirente`

- Classes: 2
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de participações societárias.
- Classes: `PainelAbaListaAdquirentePSocietaria`, `TableModelAdquirentesPSocietaria`

#### `serpro.ppgd.irpf.gui.gcap.psocietarias.apuracao`

- Classes: 1
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de participações societárias.
- Classes: `PainelAbaApuracaoPsocietaria`

#### `serpro.ppgd.irpf.gui.gcap.psocietarias.aquisicao`

- Classes: 2
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de participações societárias.
- Classes: `PainelAbaListaApuracaoCustoAquisicao`, `TableModelCustoApuracaoAquisicao`

#### `serpro.ppgd.irpf.gui.gcap.psocietarias.calculo`

- Classes: 5
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de participações societárias.
- Classes: `PainelAbaCalculoImpostoPSocietaria`, `PainelCalculoImpostoAPrazoPSocietaria`, `PainelCalculoImpostoAVistaPSocietaria`, `PainelParcelaDetalhePSocietaria`, `TableModelParcelasPSocietaria`

#### `serpro.ppgd.irpf.gui.gcap.psocietarias.consolidacao`

- Classes: 1
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de participações societárias.
- Classes: `PainelAbaConsolidacaoParticipacaoSocietaria`

#### `serpro.ppgd.irpf.gui.gcap.psocietarias.identificacao`

- Classes: 1
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de participações societárias.
- Classes: `PainelAbaIdentificacaoParticipacaoSocietaria`

#### `serpro.ppgd.irpf.gui.gcap.psocietarias.operacao`

- Classes: 1
- Área: GCAP
- Papel provável: Demonstrativo de ganho de capital na alienação de participações societárias.
- Classes: `PainelAbaOperacaoParticipacaoSocietaria`

#### `serpro.ppgd.irpf.gui.gcap.table`

- Classes: 5
- Área: GCAP
- Papel provável: Tabelas e listas do módulo GCAP.
- Classes: `GCAPListSelectionModel`, `GCAPTableAb`, `GCAPTableDecorator`, `GCAPTableModelAb`, `TableLista`

#### Telas (`.form`) de `irpf-gui-gcap.jar`

- `serpro.ppgd.irpf.gui.gcap` (2): PainelAlienacaoAnosAnteriores, PainelVazio
- `serpro.ppgd.irpf.gui.gcap.bensimoveis.apuracao` (6): PainelAbaApuracaoBemImovel, PainelApuracaoBemImovelBrasil, PainelApuracaoBemImovelExterior, PainelApuracaoBemImovelExteriorAM, PainelApuracaoBemImovelExteriorME, PainelApuracaoBemImovelExteriorMN
- `serpro.ppgd.irpf.gui.gcap.bensimoveis.aquisicao` (17): PainelAbaAquisicaoBemImovel, PainelAquisicaoBemImovelBrasil, PainelAquisicaoBemImovelExterior, PainelCustoAquisicaoBemImovelBrasil, PainelCustoAquisicaoBemImovelExterior, PainelCustoAquisicaoBemImovelExteriorAM, PainelCustoAquisicaoBemImovelExteriorME, PainelCustoAquisicaoBemImovelExteriorMN, PainelCustoAquisicaoParceladoBemImovelExterior, PainelListaCustoAquisicaoParceladoBemImovelBrasil, PainelListaCustoAquisicaoParceladoBemImovelExteriorAM, PainelListaCustoAquisicaoParceladoBemImovelExteriorME, PainelListaCustoAquisicaoParceladoBemImovelExteriorMN, PainelParcelaCustoAquisicaoBrasil, PainelParcelaCustoAquisicaoExteriorAM, PainelParcelaCustoAquisicaoExteriorME, PainelParcelaCustoAquisicaoExteriorMN
- `serpro.ppgd.irpf.gui.gcap.bensimoveis.calculo` (12): PainelAbaCalculoImpostoBemImovel, PainelApuracaoFinalExteriorAmbas, PainelApuracaoFinalExteriorBrasil, PainelApuracaoFinalExteriorME, PainelCalculoImpostoAPrazoBrasil, PainelCalculoImpostoAPrazoExterior, PainelCalculoImpostoAVistaBrasil, PainelCalculoImpostoAVistaExterior, PainelParcelaBrasilDetalhe, PainelParcelaExteriorAmbasDetalhe, PainelParcelaExteriorMEDetalhe, PainelParcelaExteriorNacionalDetalhe
- `serpro.ppgd.irpf.gui.gcap.bensimoveis.consolidacao` (3): PainelAbaConsolidacao, PainelAbaConsolidacaoBrasil, PainelAbaConsolidacaoExterior
- `serpro.ppgd.irpf.gui.gcap.bensimoveis.identificacao` (3): PainelAbaIdentificacaoBemImovel, PainelEnderecoBrasil, PainelEnderecoExterior
- `serpro.ppgd.irpf.gui.gcap.bensimoveis.operacao` (3): PainelAbaOperacaoBemImovel, PainelOperacaoBrasil, PainelOperacaoExterior
- `serpro.ppgd.irpf.gui.gcap.bensimoveis.perguntas` (6): PainelAbaPerguntas, PainelPerguntaConjuntoBensSuperior35Mil, PainelPerguntaImovelResidencial, PainelPerguntaIndicadorPropriedadeOutroImovel, PainelPerguntaMP252, PainelPerguntaOutraAlienacao5anos
- `serpro.ppgd.irpf.gui.gcap.bensmoveis.apuracao` (6): PainelAbaApuracaoBemMovel, PainelApuracaoBrasil, PainelApuracaoExterior, PainelApuracaoExteriorAmbas, PainelApuracaoExteriorME, PainelApuracaoExteriorNacional
- `serpro.ppgd.irpf.gui.gcap.bensmoveis.aquisicao` (3): PainelAquisicaoMoedaEstrangeira, PainelAquisicaoMoedaNacional, PainelIAquisicaoAmbasMoedas
- `serpro.ppgd.irpf.gui.gcap.bensmoveis.calculo` (12): PainelAbaCalculoImpostoBemMovel, PainelApuracaoFinalExteriorAmbas, PainelApuracaoFinalExteriorBrasil, PainelApuracaoFinalExteriorME, PainelCalculoImpostoAPrazoBrasil, PainelCalculoImpostoAPrazoExterior, PainelCalculoImpostoAVistaBrasil, PainelCalculoImpostoAVistaExterior, PainelParcelaBrasilDetalhe, PainelParcelaExteriorAmbasDetalhe, PainelParcelaExteriorMEDetalhe, PainelParcelaExteriorNacionalDetalhe
- `serpro.ppgd.irpf.gui.gcap.bensmoveis.consolidacao` (3): PainelAbaConsolidacao, PainelAbaConsolidacaoBrasil, PainelAbaConsolidacaoExterior
- `serpro.ppgd.irpf.gui.gcap.bensmoveis.identificacao` (3): PainelAbaIdentificacaoBemMovel, PainelIdentificacaoBrasil, PainelIdentificacaoExterior
- `serpro.ppgd.irpf.gui.gcap.bensmoveis.operacao` (3): PainelAbaOperacaoBemMovel, PainelOperacaoBrasil, PainelOperacaoExterior
- `serpro.ppgd.irpf.gui.gcap.especie` (3): PainelAbaConsolidacaoMoeda, PainelAbaListaOperacoesMoedasEspecieAb, PainelAbaMoedaAlienada
- `serpro.ppgd.irpf.gui.gcap.psocietarias.apuracao` (1): PainelAbaApuracaoPsocietaria
- `serpro.ppgd.irpf.gui.gcap.psocietarias.aquisicao` (1): PainelAbaListaApuracaoCustoAquisicao
- `serpro.ppgd.irpf.gui.gcap.psocietarias.calculo` (4): PainelAbaCalculoImpostoPSocietaria, PainelCalculoImpostoAPrazoPSocietaria, PainelCalculoImpostoAVistaPSocietaria, PainelParcelaDetalhePSocietaria
- `serpro.ppgd.irpf.gui.gcap.psocietarias.consolidacao` (1): PainelAbaConsolidacaoParticipacaoSocietaria
- `serpro.ppgd.irpf.gui.gcap.psocietarias.identificacao` (1): PainelAbaIdentificacaoParticipacaoSocietaria
- `serpro.ppgd.irpf.gui.gcap.psocietarias.operacao` (1): PainelAbaOperacaoParticipacaoSocietaria

### `lib-modulos/irpf-gui-renda-variavel.jar`

15 classes, 4 telas, 0 relatórios.

#### `serpro.ppgd.irpf.gui.rendavariavel`

- Classes: 15
- Área: Renda variável
- Papel provável: Ficha Renda Variável: operações comuns/day-trade mensais e fundos de investimento imobiliário, titular e dependentes.
- Classes: `FundosInvestimentosCellRenderer`, `FundosInvestimentosMesCellRenderer`, `PainelAbaRendaVariavelDependentesLista`, `PainelAbaRendaVariavelFundosInvestDependentesLista`, `PainelAbaRendaVariavelFundosInvestTitular`, `PainelDadosRendaVariavel`, `PainelDadosRendaVariavelFundosInvest`, `PainelDadosRendaVariavelOpComunsDayTrade`, `PainelRendaVariavelDependentesDetalhe`, `PainelRendaVariavelFundosInvestDependentesDetalhe`, `PainelRendaVariavelMensal`, `TableModelFundosInvestimentosDependentes`, `TableModelRendaVariavelDependentes`, `TableModelRendaVariavelFundosInvestimentos`, `TableRendaVariavelFundosInvestimentos`

#### Telas (`.form`) de `irpf-gui-renda-variavel.jar`

- `serpro.ppgd.irpf.gui.rendavariavel` (4): PainelAbaRendaVariavelFundosInvestTitular, PainelRendaVariavelDependentesDetalhe, PainelRendaVariavelFundosInvestDependentesDetalhe, PainelRendaVariavelMensal

### `lib-modulos/irpf-importacao-exportacao.jar`

32 classes, 0 telas, 0 relatórios.

#### `serpro.ppgd.irpf.txt.gravacaorestauracao`

- Classes: 8
- Área: Importação/exportação
- Papel provável: Gravação do arquivo de entrega (TXT .DEC), restauração, importação de pré-preenchida e repositório de declarações.
- Classes: `ConstantesRepositorio`, `ConversorObjetosIRPF2Registros`, `ConversorRegistros2ObjetosIRPF`, `DocumentoAjusteTXT`, `GravadorTXT`, `ImportadorPrePreenchida`, `ImportadorTxt`, `RepositorioDeclaracaoCentralTxt`

#### `serpro.ppgd.irpf.txt.importacao`

- Classes: 2
- Área: Importação/exportação
- Papel provável: Base comum de importação e exceção de versão inválida.
- Classes: `RelatorioRepositorioTxtDadosAb`, `VersaoDecInvalidaException`

#### `serpro.ppgd.irpf.txt.importacao.atividaderural`

- Classes: 6
- Área: Importação/exportação
- Papel provável: Importação do demonstrativo da Atividade Rural.
- Classes: `DadoAtividadeRuralBrasil`, `DadoAtividadeRuralExterior`, `FiltroDemonstrativoAtividadeRural`, `ItemMensalARBrasil`, `ProcessoImportacaoAtividadeRural`, `RepositorioTxtDadosAtividadeRural`

#### `serpro.ppgd.irpf.txt.importacao.carneleao`

- Classes: 6
- Área: Importação/exportação
- Papel provável: Importação do Carnê-Leão (arquivo local e web).
- Classes: `FiltroCPFCarneLeao`, `FiltroDemonstrativoCarneLeao`, `ProcessoImportacaoCarneLeao`, `ProcessoImportacaoCarneLeaoWeb`, `RepositorioTxtDadosCarneLeao`, `RepositorioTxtDadosCarneLeaoWeb`

#### `serpro.ppgd.irpf.txt.importacao.gcap`

- Classes: 7
- Área: Importação/exportação
- Papel provável: Importação dos demonstrativos GCAP (XML).
- Classes: `DefaultTagHandler`, `FiltroDemonstrativoGCAP`, `MapeamentoXmlReader`, `ObjetoNegocioXMLReaderTagHandler`, `ProcessoImportacaoGCAP`, `RepositorioXMLDadosGCAP`, `XMLSaxHandler`

#### `serpro.ppgd.irpf.txt.importacao.informerendimentospj`

- Classes: 1
- Área: Importação/exportação
- Papel provável: Leitura de informe de rendimentos PJ em XML.
- Classes: `RepositorioXMLDadosInformes`

#### `serpro.ppgd.irpf.txt.util`

- Classes: 2
- Área: Importação/exportação
- Papel provável: Utilitários de TXT e conversão para impressão.
- Classes: `ConversorMidas`, `IRPFTxtUtil`

### `lib-modulos/irpf-impressao.jar`

11 classes, 0 telas, 239 relatórios.

#### `dirpf2026scriptlets`

- Classes: 2
- Área: Impressão
- Papel provável: Scriptlets dos relatórios Jasper da declaração.
- Classes: `RelDeclaracaoContribuinteScriptlet`, `RelDeclaracaoRendimentosTributaveisPJDependenteScriptlet`

#### `serpro.ppgd.irpf.impressao`

- Classes: 8
- Área: Impressão
- Papel provável: Geração de relatórios: declaração, DARF, rendimentos recebidos de PF, formatação.
- Classes: `ImpressaoDarfAuxilioEmergencial`, `ImpressaoDeclaracao`, `ImpressaoRendimentosRecebidosPF`, `Lancamento`, `Relatorio`, `RelatorioDeclaracao`, `RelatorioUtil`, `RendimentosRecebidosPFCollectionDS`

#### `serpro.ppgd.irpf.impressao.util.scriptlet`

- Classes: 1
- Área: Impressão
- Papel provável: Geração de relatórios: declaração, DARF, rendimentos recebidos de PF, formatação.
- Classes: `FuncoesFormatacao`

#### Relatórios de impressão (`.jasper`) de `irpf-impressao.jar`

- Declaração e folha de rosto (60): DIRPF2026, FolhaDeRosto, relDeclaracaoAlimentandos, relDeclaracaoAlimentandosDecisaoJudicial, relDeclaracaoAlimentandosEscrituraPublica, relDeclaracaoBensDireitos, relDeclaracaoBensDireitosParticipacaoInventarioDetalhe, relDeclaracaoBensDireitosUsufrutuarioDetalhe, relDeclaracaoConjuge, relDeclaracaoContribuinte, relDeclaracaoDependentes, relDeclaracaoDependentesSaida, relDeclaracaoDetalheOutrosRendimentos, relDeclaracaoDetalhePensaoAlimenticia, relDeclaracaoDetalheRendimentosLotericas, relDeclaracaoDividasOnusReais, relDeclaracaoDoacoes, relDeclaracaoDoacoesECA, relDeclaracaoDoacoesEleitorais, relDeclaracaoDoacoesIdoso, relDeclaracaoEspolioConjugePartilha, relDeclaracaoEspolioConjugeSobrepartilha, relDeclaracaoHerdeiros, relDeclaracaoImpostoPago, relDeclaracaoImpostoPagoSimplificado, relDeclaracaoInventariante, relDeclaracaoInventarianteDecisaoJudicialPartilha, relDeclaracaoInventarianteDecisaoJudicialSobrepartilha, relDeclaracaoInventarianteEscrituraPublicaPartilha, relDeclaracaoInventarianteEscrituraPublicaSobrepartilha, relDeclaracaoPagamentos, relDeclaracaoRendimentosAcumuladamenteDependente, relDeclaracaoRendimentosAcumuladamenteTitular, relDeclaracaoRendimentosAcumuladamenteTitularAlimentandos, relDeclaracaoRendimentosIsentosNaoTributaveis, relDeclaracaoRendimentosIsentosNaoTributaveisDetalhe, relDeclaracaoRendimentosIsentosNaoTributaveisDetalheIndenizacoes, relDeclaracaoRendimentosIsentosNaoTributaveisDetalheLucro, relDeclaracaoRendimentosIsentosNaoTributaveisDetalhePensao65Anos, relDeclaracaoRendimentosIsentosNaoTributaveisDetalhePensaoMolestiaGrave, relDeclaracaoRendimentosIsentosNaoTributaveisDetalheSemFontePagadora, relDeclaracaoRendimentosIsentosNaoTributaveisDetalheTransferenciaPatrimonial, relDeclaracaoRendimentosSujTribExclusiva, relDeclaracaoRendimentosTributaveisPFContasDependente, relDeclaracaoRendimentosTributaveisPFContasTitular, relDeclaracaoRendimentosTributaveisPFDependenteIndividual, relDeclaracaoRendimentosTributaveisPFMeses, relDeclaracaoRendimentosTributaveisPFMesesDependente, relDeclaracaoRendimentosTributaveisPFMesesListaDependentes, relDeclaracaoRendimentosTributaveisPFMesesTitular, relDeclaracaoRendimentosTributaveisPFTitular, relDeclaracaoRendimentosTributaveisPJComExigibilidadeDependente, relDeclaracaoRendimentosTributaveisPJComExigibilidadeTitular, relDeclaracaoRendimentosTributaveisPJDependente, relDeclaracaoRendimentosTributaveisPJTitular, relDeclaracaoResumo, relDeclaracaoResumoSimplificada, relDeclaracaoSaida, relDeclaracaoSemInfo, relDeclaracaoSemInfo2
- Recibo, notificações e comunicação de saída (8): relComunicacaoSaida, relComunicacaoSaidaDetalhe, relDeclaracoes, relNotificacao, relNotificacaoCondicoesObrigatoriedade, relNotificacaoEspolio, relNotificacaoSaida, relRecibo
- DARF (6): relDarfAuxilio, relDarfAuxilioEmergencial, relDarfCodBarra, relDarfDoacaoECA, relDarfDoacaoEstatutoIdoso, relDarfMulta
- Atividade rural (14): relAR, relARApuracaoBrasil, relARApuracaoExterior, relARBensDaAtividadeRural, relARBensDaAtividadeRuralExterior, relARBrasil, relARDividas, relARExterior, relARIdentificacao, relARParticipantes, relARRebanhoBrasil, relARRebanhoExterior, relARReceitasDespesasBrasil, relARReceitasDespesasExterior
- Renda variável (8): relRendaVariavelDependentes, relRendaVariavelFundoInvestimentoDependentes, relRendaVariavelFundoInvestimentoTitular, relRendaVariavelGanhosLiquidosPerdas, relRendaVariavelItemGanhosLiquidosPerdas, relRendaVariavelItemGanhosLiquidosPerdasDependente, relRendaVariavelQuadroImpostoPagar, relRendaVariavelTitular
- Informes importados (rendimentos PJ e plano de saúde) (15): relInformePlanoSaude, relInformePlanoSaudePagamentos, relInformePlanoSaudeReembolsos, relInformeRendimentosPJ, relInformeRendimentosPJOutrosRendIsentos, relInformeRendimentosPJOutrosRendTribExclusiva, relInformeRendimentosPJPagamentos, relInformeRendimentosPJPensaoAlimenticia, relInformeRendimentosPJPrevidencia, relInformeRendimentosPJRendACM, relInformeRendimentosPJRendACMAlimentandos, relInformeRendimentosPJRendIsentos, relInformeRendimentosPJRendPJ, relInformeRendimentosPJRendPJExigibilidadeSuspensa, relInformeRendimentosPJTribExclusiva
- GCAP e moeda estrangeira (demonstrativos, transportes e sub-relatórios) (128): relDeclaracaoTransportesGCAlienBensDireitos, relDeclaracaoTransportesGCAlienBensDireitosME, relDeclaracaoTransportesGCAlienMEEspecie, relDeclaracaoTransportesParcIsenGC, relDeclaracaoTransportesParcIsenME, relDeclaracaoTransportesSemInfo, relDemonstrativoAplicacoesFinanceirasExterior, relDemonstrativoAplicacoesFinanceirasExteriorSemLancamentos, relDemonstrativoImoveis, relDemonstrativoMoedaEspecie, relDemonstrativoMoedaEspecieDetalhe, relDemonstrativoMoveis, relDemonstrativoPSoc, subAdquirentes, subAjuste, subAliquotaEfetiva, subAliquotaEfetivaValores, subApuracaoAmbasMoedas, subApuracaoCustoAquisicaoImoveisBrasil, subApuracaoCustoAquisicaoImoveisExterior, subApuracaoCustoAquisicaoImoveisExteriorAmbasMoedas, subApuracaoEmReaisAlienacaoAPrestacao1, subApuracaoEmReaisAlienacaoAPrestacao2, subApuracaoEmReaisAlienacaoAVista1, subApuracaoEmReaisAlienacaoAVista2, subApuracaoFinalAmbasMoedas, subApuracaoFinalGanhoImovelExtAmbasMoedas, subApuracaoFinalGanhoImovelExtMoedaEst, subApuracaoFinalGanhoImovelExtMoedaNac, subApuracaoFinalMoedaEstrangeira, subApuracaoFinalMoedaNacional, subApuracaoGanhoImovelBrasil, subApuracaoGanhoImovelExtAmbasMoedas, subApuracaoGanhoImovelExtMoedaEst, subApuracaoGanhoImovelExtMoedaNac, subApuracaoMoedaEstrangeira, subApuracaoMoedaEstrangeiraAlienacao1, subApuracaoMoedaEstrangeiraAlienacao2, subApuracaoMoedaEstrangeiraAlienacaoPrestacao1, subApuracaoMoedaEstrangeiraAlienacaoPrestacao2, subApuracaoMoedaNacional, subApuracaoMovelBrasil, subAquisicaoBrasil, subAquisicaoExterior, subAquisicaoExteriorAmbasMoedas, subCalculoAPrazoBrasilDetalhe, subCalculoAPrazoBrasilMovelPSocDetalhe, subCalculoAPrazoExteriorAmbasMoedas, subCalculoAPrazoExteriorAmbasMoedasDetalhe, subCalculoAPrazoExteriorAmbasMoedasParcelaDetalhe, subCalculoAPrazoExteriorAmbasMoedasParcelas, subCalculoAPrazoExteriorMoedaEst, subCalculoAPrazoExteriorMoedaEstDetalhe, subCalculoAPrazoExteriorMoedaEstParcelaDetalhe, subCalculoAPrazoExteriorMoedaEstParcelas, subCalculoAPrazoExteriorMoedaNac, subCalculoAPrazoExteriorMoedaNacDetalhe, subCalculoAPrazoExteriorMoedaNacParcelaDetalhe, subCalculoAPrazoExteriorMoedaNacParcelas, subCalculoAPrazoImovelBrasil, subCalculoAPrazoImovelBrasilDetalhe, subCalculoAPrazoImovelBrasilParcelaDetalhe, subCalculoAPrazoImovelBrasilParcelas, subCalculoAPrazoImovelExteriorAmbasMoedas, subCalculoAPrazoImovelExteriorAmbasMoedasDetalhe, subCalculoAPrazoImovelExteriorAmbasMoedasDetalhe_copia, subCalculoAPrazoImovelExteriorAmbasMoedasParcelaDetalhe, subCalculoAPrazoImovelExteriorAmbasMoedasParcelas, subCalculoAPrazoImovelExteriorMoedaEst, subCalculoAPrazoImovelExteriorMoedaEstDetalhe, subCalculoAPrazoImovelExteriorMoedaEstDetalheEnquadramento, subCalculoAPrazoImovelExteriorMoedaEstEnquadramento, subCalculoAPrazoImovelExteriorMoedaEstParcelaDetalhe, subCalculoAPrazoImovelExteriorMoedaEstParcelas, subCalculoAPrazoImovelExteriorMoedaNac, subCalculoAPrazoImovelExteriorMoedaNacDetalhe, subCalculoAPrazoImovelExteriorMoedaNacDetalheEnquadramento, subCalculoAPrazoImovelExteriorMoedaNacEnquadramento, subCalculoAPrazoImovelExteriorMoedaNacParcelaDetalhe, subCalculoAPrazoImovelExteriorMoedaNacParcelas, subCalculoAPrazoMovelBrasil, subCalculoAPrazoMovelBrasilDetalhe, subCalculoAPrazoMovelBrasilParcelaDetalhe, subCalculoAPrazoMovelBrasilParcelas, subCalculoAPrazoPSoc, subCalculoAPrazoPSocDetalhe, subCalculoAPrazoPSocParcelaDetalhe, subCalculoAPrazoPSocParcelas, subCalculoAVistaBrasil, subCalculoAVistaExterior, subCalculoAVistaImovelExterior, subCalculoAVistaMovelExterior, subConsolidacaoBrasil, subConsolidacaoDeAlienacao, subConsolidacaoExterior, subCustoAlienacao, subCustoAquisicaoImoveisBrasil, subCustoAquisicaoImoveisBrasilExtMoedaEst, subCustoAquisicaoImoveisExtAmbasMoedas, subCustoAquisicaoImoveisExtMoedaEst, subCustoAquisicaoImoveisExtMoedaNac, subCustoAquisicaoPSocietarias, subEnderecoBrasil, subEnderecoExterior, subEspecie, subEspecificacaoBemDireitoEstrangeira, subEstrangeira, subEstrangeiraAquisicao, subGanhoCapitalImoveisAmbasMoedas, subGanhoCapitalImoveisBrasil, subGanhoCapitalImoveisExterior, subIdentificacaoAdquirenteMoeda, subImpostoPagoExterior, subMensagemMudancaEnquadramento, subMista, subOperacaoBrasil, subOperacaoExterior, subOperacaoImovelExterior, subOperacoesMoedaEstrangeira, subPerguntas, subPerguntasImovel, subPerguntasPSoc, subReaisAlienacaoDeBensDireitosOuAplicacoesFinanceiras, subReaisAquisicao, subReal, subRelGCAP, subRelGCME, subTotalizacaoEspecie

### `lib-modulos/irpf-negocio-calculo.jar`

32 classes, 0 telas, 0 relatórios.

#### `serpro.ppgd.irpf.calculos`

- Classes: 32
- Área: Cálculo
- Papel provável: Regras de cálculo por ficha: rendimentos, deduções, incentivos, doações, bens, dívidas, renda variável, atividade rural, RRA, resumo.
- Classes: `CalculosApuracaoResultadoARBrasil`, `CalculosApuracaoResultadoARExterior`, `CalculosBens`, `CalculosDeducoesIncentivos`, `CalculosDividas`, `CalculosDoacoes`, `CalculosDoacoesECA`, `CalculosDoacoesIdoso`, `CalculosFundosInvestimentos`, `CalculosFundosInvestimentosDependentes`, `CalculosGanhosRendaVar`, `CalculosItemRendPF`, `CalculosMovimentacaoRebanho`, `CalculosPagamentos`, `CalculosReceitaDespesaARExterior`, `CalculosReceitasDespesasARBrasil`, `CalculosRendAcmDependentes`, `CalculosRendAcmImpostoDevido`, `CalculosRendAcmTitular`, `CalculosRendIsentos`, `CalculosRendPFDependentes`, `CalculosRendPJComExigibilidadeDependentes`, `CalculosRendPJComExigibilidadeTitular`, `CalculosRendPJDependentes`, `CalculosRendPJTitular`, `CalculosRendTributacaoExclusiva`, `CalculosRendaVariavelDependentes`, `CalculosResumo`, `CalculosTotaisFundosInvestimentos`, `CalculosTotaisLivroCaixa`, `CalculosTotaisRendaVariavel`, `CalculosTotalRendRecebidosMaisExterior`

### `lib-modulos/irpf-negocio-declaracao.jar`

376 classes, 0 telas, 0 relatórios.

#### `serpro.ppgd.irpf.negocio`

- Classes: 24
- Área: Núcleo da declaração
- Papel provável: Declaração IRPF, fachada IRPFFacade, identificador de declaração, validadores comuns.
- Classes: `ColecaoIdDeclaracao`, `ColecaoIdDeclaracaoTransmitida`, `DeclaracaoIRPF`, `FontePagadora`, `IRPFFacade`, `IdentificadorDeclaracao`, `IdentificadorDeclaracaoTransmitida`, `ImpostoDevidoPorDeclarante`, `ItemLimiteDeducaoIncentivo`, `ObservadorAproximaAno`, `ObservadorEspacosDuplicados`, `ObservadorTipoDeclaracao`, `PreenchedorFichasImpressao`, `RepositorioXMLIRPF`, `ValidadorCPFDiferenteTitular`, `ValidadorCPFIRPF`, `ValidadorDataIrpf`, `ValidadorMaximoDigitosInteiros`, `ValidadorNaoNegativo`, `ValidadorNaoNuloIRPF`, `ValidadorNomeIRPF`, `ValidadoresDominioAb`, `ValorBigDecimal`, `ValorPositivo`

#### `serpro.ppgd.irpf.negocio.alimentandos`

- Classes: 10
- Área: Dependentes e alimentandos
- Papel provável: Modelo e validações de alimentandos.
- Classes: `Alimentando`, `Alimentandos`, `DecisaoJudicial`, `EscrituracaoPublica`, `ObservadorRemoverPensaoRRA`, `ValidadorAlimentandoIgualDependente`, `ValidadorAlimentandoRepetido`, `ValidadorCPFMaior12`, `ValidadorCondicaoResidencia`, `ValidadorNomeVazio`

#### `serpro.ppgd.irpf.negocio.atividaderural`

- Classes: 12
- Área: Atividade rural
- Papel provável: Modelo de negócio da Atividade Rural (imóveis, bens, dívidas, rebanho, apuração, Brasil e exterior).
- Classes: `AtividadeRural`, `BemAR`, `BensAR`, `CalculosBensAR`, `DividaAR`, `ImovelAR`, `ItemMovimentacaoRebanho`, `MovimentacaoRebanho`, `ParticipanteImovelAR`, `ParticipantesImovelAR`, `ValidadorCIB`, `ValidadorMovimentacaoRebanho`

#### `serpro.ppgd.irpf.negocio.atividaderural.brasil`

- Classes: 8
- Área: Atividade rural
- Papel provável: Modelo de negócio da Atividade Rural (imóveis, bens, dívidas, rebanho, apuração, Brasil e exterior).
- Classes: `ARBrasil`, `ApuracaoResultadoBrasil`, `CalculosDividasARBrasil`, `ColecaoDividasARBrasil`, `IdentificacaoImovelARBrasil`, `ImovelARBrasil`, `MesReceitaDespesa`, `ReceitasDespesas`

#### `serpro.ppgd.irpf.negocio.atividaderural.exterior`

- Classes: 7
- Área: Atividade rural
- Papel provável: Modelo de negócio da Atividade Rural (imóveis, bens, dívidas, rebanho, apuração, Brasil e exterior).
- Classes: `ARExterior`, `ApuracaoResultadoExterior`, `CalculosDividasARExterior`, `ColecaoDividasARExterior`, `ColecaoReceitasDespesas`, `IdentificacaoImovelARExterior`, `ReceitaDespesa`

#### `serpro.ppgd.irpf.negocio.bens`

- Classes: 17
- Área: Bens e direitos
- Papel provável: Modelo e validações de Bens e Direitos (RENAVAM, registro de imóvel, localização, Lei 14.793, aplicações financeiras).
- Classes: `Bem`, `Bens`, `ColecaoItemPercentualParticipacaoInventario`, `ColecaoRendimentoAplicacoesFinanceiras`, `ItemPercentualParticipacaoInventario`, `ObservadorAtualizadorRendimentos`, `ProprietarioUsufrutuarioBem`, `ProprietariosUsufrutuariosBem`, `RendimentoAplicacoesFinanceiras`, `ValidadorDataAquisicao`, `ValidadorEnderecoBemImovel`, `ValidadorLocalizacaoBemImovel`, `ValidadorLocalizacaoBemImovelExterior`, `ValidadorLocalizacaoBemRegistravel`, `ValidadorNumeroProcessoLei14793`, `ValidadorRegistroBemImovel`, `ValidadorRenavam`

#### `serpro.ppgd.irpf.negocio.comparativo`

- Classes: 1
- Área: Cálculo
- Papel provável: Comparativo completa x simplificada.
- Classes: `Comparativo`

#### `serpro.ppgd.irpf.negocio.contribuinte`

- Classes: 5
- Área: Identificação
- Papel provável: Modelo do contribuinte, endereço, data de nascimento, indicador de retificadora.
- Classes: `Contribuinte`, `ObservadorCEPMunicipio`, `ObservadorDeclaracaoRetificadora`, `ValidadorCampoEndereco`, `ValidadorDataNascimento`

#### `serpro.ppgd.irpf.negocio.declaracao.anoanterior`

- Classes: 2
- Área: Importação/exportação
- Papel provável: Importação da declaração do ano anterior.
- Classes: `FiltroDeclaracaoAnoAnterior`, `ProcessoImportacaoAnoAnterior`

#### `serpro.ppgd.irpf.negocio.declaracao.assistida.informeplanosaude`

- Classes: 7
- Área: Importação/exportação
- Papel provável: Importação de informes de rendimentos PJ e de plano de saúde (declaração assistida).
- Classes: `ColecaoItemPagamentoPlanoSaude`, `ColecaoItemReembolsoPlanoSaude`, `HeaderInformePagamentos`, `InformePagamentosPlanoSaude`, `ItemPagamentoPlanoSaude`, `ItemReembolsoPlanoSaude`, `ProcessoImportacaoInformePlanoSaude`

#### `serpro.ppgd.irpf.negocio.declaracao.assistida.informerendimentos`

- Classes: 15
- Área: Importação/exportação
- Papel provável: Importação de informes de rendimentos PJ e de plano de saúde (declaração assistida).
- Classes: `ColecaoItemPagamento`, `ColecaoItemPensaoAlimenticiaRendAcm`, `ColecaoItemRendAcm`, `ColecaoItemRendIsentoOuTributacaoExclusiva`, `ColecaoItemRendPJ`, `ColecaoItemRendPJComExigibilidade`, `HeaderInformeRendimentos`, `InformeRendimentosPJ`, `ItemPagamento`, `ItemPensaoAlimenticiaRendAcm`, `ItemRendAcm`, `ItemRendIsentoOuTributacaoExclusiva`, `ItemRendPJ`, `ItemRendPJComExigibilidade`, `ProcessoImportacaoInformeRendimentos`

#### `serpro.ppgd.irpf.negocio.declaracao.copiaseguranca`

- Classes: 2
- Área: Menus e ações
- Papel provável: Restauração de cópia de segurança.
- Classes: `FiltroCopiaSeguranca`, `ProcessoRestaurarCopiaSeguranca`

#### `serpro.ppgd.irpf.negocio.declaracao.prepreenchida`

- Classes: 1
- Área: Pré-preenchida
- Papel provável: Modelo da declaração pré-preenchida e fontes: DIRF, DMED, DIMOB.
- Classes: `DeclaracaoPrepreenchida`

#### `serpro.ppgd.irpf.negocio.declaracao.prepreenchida.dimob`

- Classes: 6
- Área: Pré-preenchida
- Papel provável: Modelo da declaração pré-preenchida e fontes: DIRF, DMED, DIMOB.
- Classes: `ColecaoDimobPagamentos`, `ColecaoDimobPessoaFisica`, `ColecaoDimobPessoaJuridica`, `ItemDimob`, `ItemDimobPessoaFisicaPagamento`, `ItemDimobPessoaJuridica`

#### `serpro.ppgd.irpf.negocio.declaracao.prepreenchida.dirf`

- Classes: 23
- Área: Pré-preenchida
- Papel provável: Modelo da declaração pré-preenchida e fontes: DIRF, DMED, DIMOB.
- Classes: `ColecaoDirfFundoClube`, `ColecaoDirfPagamentos`, `ColecaoDirfPrevidencia`, `ColecaoDirfRRA`, `ColecaoDirfRRAPensaoAlimenticia`, `ColecaoDirfRendimentos`, `Header`, `ItemDirf`, `ItemDirfFundoClube`, `ItemDirfPagamentos`, `ItemDirfPrevidencia`, `ItemDirfRRA`, `ItemDirfRRAPensaoAlimenticia`, `ItemDirfRendimentos`, `RendAluguel`, `RendAplicacaoFinanceira`, `RendComplementacaoAposentadoria`, `RendGenerico`, `RendGenericoComDescricao`, `RendPJ`, `RendPJExigibilidade`, `RendPJFundoClube`, `RendPensao`

#### `serpro.ppgd.irpf.negocio.declaracao.prepreenchida.dmed`

- Classes: 5
- Área: Pré-preenchida
- Papel provável: Modelo da declaração pré-preenchida e fontes: DIRF, DMED, DIMOB.
- Classes: `ColecaoDmed`, `ColecaoDmedDirf`, `ItemDmed`, `ItemDmedDirf`, `ItemDmedPessoaFisica`

#### `serpro.ppgd.irpf.negocio.dependentes`

- Classes: 4
- Área: Dependentes e alimentandos
- Papel provável: Modelo e validações de dependentes.
- Classes: `Dependente`, `Dependentes`, `ObservadorTotalizaDependentes`, `ValidadorCpfDepDuplicado`

#### `serpro.ppgd.irpf.negocio.dividas`

- Classes: 2
- Área: Dívidas
- Papel provável: Modelo de Dívidas e Ônus Reais.
- Classes: `Divida`, `Dividas`

#### `serpro.ppgd.irpf.negocio.doacaodeclaracao`

- Classes: 7
- Área: Pagamentos e doações
- Papel provável: Doações diretamente na declaração: ECA, Pessoa Idosa, fundos estaduais.
- Classes: `ColecaoEstatutoCriancaAdolescente`, `ColecaoEstatutoIdoso`, `EstatutoCriancaAdolescente`, `EstatutoIdoso`, `FundosEstaduaisECA`, `ValidadorDoacoesECA`, `ValidadorDoacoesIdoso`

#### `serpro.ppgd.irpf.negocio.doacoes`

- Classes: 3
- Área: Pagamentos e doações
- Papel provável: Doações efetuadas e limites de dedução.
- Classes: `Doacao`, `Doacoes`, `ValidadorDeducoesDoacoes`

#### `serpro.ppgd.irpf.negocio.eleicoes`

- Classes: 3
- Área: Pagamentos e doações
- Papel provável: Doações eleitorais.
- Classes: `CalculosDoacoesEleitorais`, `DoacaoEleitoral`, `DoacoesEleitorais`

#### `serpro.ppgd.irpf.negocio.espolio`

- Classes: 5
- Área: Espólio
- Papel provável: Espólio: decisão judicial, escritura pública, partilha, ano de trânsito.
- Classes: `Espolio`, `EspolioDecisaoJudicial`, `EspolioEscrituracaoPublica`, `EspolioPartilha`, `ValidadorAnoTransito`

#### `serpro.ppgd.irpf.negocio.exception`

- Classes: 5
- Área: Infraestrutura PPGD
- Papel provável: Exceções de negócio, aplicação e barramento.
- Classes: `AplicacaoException`, `BarramentoException`, `InternetException`, `NegocioException`, `PGDException`

#### `serpro.ppgd.irpf.negocio.gcap`

- Classes: 9
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `Bem`, `ColecaoIdDemonstrativoGCAP`, `DemonstrativoGCAP`, `GCAP`, `IdDemonstrativoGCAP`, `ObjetoGCAP`, `ProcessoImportacaoGCAP`, `ValidadorMaximoDigitosInteiros`, `ValorBigDecimalGCME`

#### `serpro.ppgd.irpf.negocio.gcap.adquirente`

- Classes: 2
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `Adquirente`, `ColecaoAdquirente`

#### `serpro.ppgd.irpf.negocio.gcap.alienacao`

- Classes: 12
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `Alienacao`, `AlienacaoBem`, `AlienacaoBemImovel`, `AlienacaoBemMovel`, `AlienacaoParticipacaoSocietaria`, `ColecaoAlienacaoBemImovel`, `ColecaoAlienacaoBemMovel`, `ColecaoAlienacaoParticipacaoSocietaria`, `ColecaoParcelaAlienacao`, `ColecaoParcelaAlienacaoBem`, `ParcelaAlienacao`, `ParcelaAlienacaoBem`

#### `serpro.ppgd.irpf.negocio.gcap.apuracao`

- Classes: 6
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `Apuracao`, `ApuracaoBem`, `ApuracaoBemImovel`, `ApuracaoBemMovel`, `ColecaoParcelaApuracaoCustoAquisicao`, `ParcelaApuracaoCustoAquisicao`

#### `serpro.ppgd.irpf.negocio.gcap.aquisicao`

- Classes: 4
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `Aquisicao`, `AquisicaoBemImovel`, `ColecaoParcelaAquisicao`, `ParcelaAquisicao`

#### `serpro.ppgd.irpf.negocio.gcap.bensimoveis`

- Classes: 2
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `BemImovel`, `Endereco`

#### `serpro.ppgd.irpf.negocio.gcap.bensmoveis`

- Classes: 1
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `BemMovel`

#### `serpro.ppgd.irpf.negocio.gcap.calculo`

- Classes: 2
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `Ajuste`, `CalculoImposto`

#### `serpro.ppgd.irpf.negocio.gcap.consolidacao`

- Classes: 4
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `ColecaoConsolidacao`, `ColecaoConsolidacaoEspecie`, `Consolidacao`, `ConsolidacaoEspecie`

#### `serpro.ppgd.irpf.negocio.gcap.entidades`

- Classes: 3
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `ValidadorMaximoDigitosInteiros`, `ValorBigDecimalGCAP`, `ValorPositivoGCAP`

#### `serpro.ppgd.irpf.negocio.gcap.especie`

- Classes: 7
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `ColecaoMoedaAlienada`, `ColecaoOperacaoEspecie`, `ColecaoTotalizacaoMoedasAlienadas`, `MoedaAlienada`, `MoedasAlienadasMensal`, `OperacaoEspecie`, `TotalizacaoMoedasAlienadas`

#### `serpro.ppgd.irpf.negocio.gcap.perguntas`

- Classes: 2
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `PerguntasImovel`, `PerguntasUtil`

#### `serpro.ppgd.irpf.negocio.gcap.psocietarias`

- Classes: 7
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `ColecaoOperacaoParticipacaoSocietaria`, `ColecaoParcelaAquisicaoParticipacaoSocietaria`, `ColecaoParticipacaoSocietaria`, `OperacaoParticipacaoSocietaria`, `ParcelaAquisicaoParticipacaoSocietaria`, `ParticipacaoSocietaria`, `ParticipacaoSocietariaAlienada`

#### `serpro.ppgd.irpf.negocio.gcap.util`

- Classes: 1
- Área: GCAP
- Papel provável: Modelo de negócio do GCAP: alienação, aquisição, apuração, cálculo, consolidação, espécie, participações societárias.
- Classes: `GcapUtil`

#### `serpro.ppgd.irpf.negocio.herdeiros`

- Classes: 3
- Área: Espólio
- Papel provável: Herdeiros e meeiros.
- Classes: `Herdeiro`, `Herdeiros`, `ValidadorNiHerdeiroDuplicado`

#### `serpro.ppgd.irpf.negocio.impostopago`

- Classes: 1
- Área: Rendimentos
- Papel provável: Imposto pago/retido.
- Classes: `ImpostoPago`

#### `serpro.ppgd.irpf.negocio.pagamentos`

- Classes: 10
- Área: Pagamentos e doações
- Papel provável: Pagamentos efetuados, beneficiários, empregada doméstica.
- Classes: `BeneficiarioMedico`, `Empregada`, `ObservadorAlimentando`, `ObservadorCPFDependente`, `ObservadorCodigoPagamento`, `ObservadorLimpaNomeDependente`, `ObservadorNomeDependente`, `Pagamento`, `Pagamentos`, `TableModelImportacaoPagamentos`

#### `serpro.ppgd.irpf.negocio.rendIsentos`

- Classes: 29
- Área: Rendimentos
- Papel provável: Rendimentos isentos e quadros auxiliares (lucros, meação, moléstia grave, pensão alimentícia, transporte de valores, prejuízo em bolsa).
- Classes: `ColecaoItemQuadroGanhosAcoesOuro`, `ColecaoItemQuadroGanhosLotericasRendimentos`, `ColecaoItemQuadroMeacaoDissolucao`, `ColecaoItemQuadroOutrosRendimentos`, `ColecaoItemQuadroPensaoAlimenticia`, `ColecaoItemQuadroPensaoAlimenticiaRendIsentos`, `ColecaoItemQuadroPensaoMolestiaGrave`, `ColecaoItemQuadroRendimentosNI`, `ColecaoItemQuadroTransferenciaPatrimonial`, `ColecaoItemQuadroTransporteDetalhado`, `ItemQuadroAuxiliar`, `ItemQuadroAuxiliarAb`, `ItemQuadroAuxiliarValor`, `ItemQuadroAuxiliarValorTransportado`, `ItemQuadroGanhosAcoesOuro`, `ItemQuadroGanhosLotericasRendimentos`, `ItemQuadroMeacaoDissolucao`, `ItemQuadroOutrosRendimentos`, `ItemQuadroPensaoAlimenticia`, `ItemQuadroPensaoAlimenticiaRendIsentos`, `ItemQuadroPensaoMolestiaGrave`, `ItemQuadroRendimentosNI`, `ItemQuadroTransferenciaPatrimonial`, `ItemQuadroTransporteDetalhado`, `ItemQuadroTransporteDetalhadoParcIsentaAposentadoria`, `ItemRendIsentoGenerico`, `ObservadorRecuperacaoPrejuizoBolsaDeValores`, `ObservadorResultadoNaoTributavel`, `RendIsentos`

#### `serpro.ppgd.irpf.negocio.rendTributacaoExclusiva`

- Classes: 2
- Área: Rendimentos
- Papel provável: Rendimentos de tributação exclusiva.
- Classes: `ItemRendTributExclusivaGenerico`, `RendTributacaoExclusiva`

#### `serpro.ppgd.irpf.negocio.rendacm`

- Classes: 7
- Área: Rendimentos
- Papel provável: Rendimentos recebidos acumuladamente (RRA), juros RRA.
- Classes: `ColecaoRendAcmDependente`, `ColecaoRendAcmTitular`, `ObservadorCalculosJurosRra`, `ObservadorRendimentosTributaveisCalculado`, `RendAcm`, `RendAcmDependente`, `RendAcmTitular`

#### `serpro.ppgd.irpf.negocio.rendavariavel`

- Classes: 10
- Área: Renda variável
- Papel provável: Renda variável: operações, ganhos ou perdas, fundos de investimento, IR retido Lei 11.033.
- Classes: `ColecaoFundosInvestimentosDependente`, `ColecaoRendaVariavelDependente`, `FundosInvestimentos`, `GanhosLiquidosOuPerdas`, `ItemFundosInvestimentosDependente`, `ItemRendaVariavelDependente`, `MesFundosInvestimentos`, `ObservadorHabDesabIrRetidoFonteLei11033`, `Operacoes`, `RendaVariavel`

#### `serpro.ppgd.irpf.negocio.rendpf`

- Classes: 10
- Área: Carnê-leão
- Papel provável: Rendimentos recebidos de PF/exterior, mensal, contas do livro caixa.
- Classes: `CPFDependente`, `ColecaoCPFDependentes`, `ColecaoRendPFDependente`, `Conta`, `ContasAno`, `ContasMes`, `ItemRendPFDependente`, `MesRendPF`, `RendPF`, `ValidadorValoresNaoPreenchidos`

#### `serpro.ppgd.irpf.negocio.rendpj`

- Classes: 8
- Área: Rendimentos
- Papel provável: Rendimentos tributáveis de PJ, titular e dependentes.
- Classes: `ColecaoRendPJDependente`, `ColecaoRendPJTitular`, `RendPJ`, `RendPJDependente`, `RendPJTitular`, `TableModelImportacaoRendPJDependentes`, `TableModelImportacaoRendPJTitular`, `ValidadorDuplicidadeRendPJMolestiaGrave`

#### `serpro.ppgd.irpf.negocio.rendpjexigibilidade`

- Classes: 5
- Área: Rendimentos
- Papel provável: Rendimentos PJ com exigibilidade suspensa.
- Classes: `ColecaoRendPJComExigibilidadeDependente`, `ColecaoRendPJComExigibilidadeTitular`, `RendPJComExigibilidade`, `RendPJComExigibilidadeDependente`, `RendPJComExigibilidadeTitular`

#### `serpro.ppgd.irpf.negocio.resumo`

- Classes: 16
- Área: Cálculo
- Papel provável: Resumo: modelo completo/simplificado, cálculo do imposto, quotas, débito automático, conta de restituição, outras informações.
- Classes: `CalculoImposto`, `ModeloCompleta`, `ModeloDeclaracao`, `ModeloSimplificada`, `ObservadorCalcImpostoHabilitaDesabilita`, `ObservadorCalcQuotas`, `ObservadorContaCreditoCaixa`, `ObservadorContaPagamentoCEF`, `ObservadorDebitoAutomatico`, `ObservadorInfoBancariasVazias`, `OutrasInformacoes`, `Parcelamento`, `RendimentosTributaveisDeducoes`, `Resumo`, `ValidadorDvContaCorrente`, `ValidadorInfoBancariasVazias`

#### `serpro.ppgd.irpf.negocio.saida`

- Classes: 2
- Área: Saída definitiva
- Papel provável: Declaração de saída definitiva.
- Classes: `Saida`, `ValidadorAno`

#### `serpro.ppgd.irpf.negocio.tabelas`

- Classes: 8
- Área: Tabelas
- Papel provável: Cadastro e carga das tabelas de domínio (códigos, alíquotas, datas, mensagens, links, municípios).
- Classes: `AtualizadorMunicipios`, `CadastroTabelasIRPF`, `CodigoTabelaLinks`, `CodigoTabelaMensagens`, `TabelaAliquotasIRPF`, `TabelaDatasIRPF`, `TabelaRendimentos`, `VerificadorTabelasDominio`

#### `serpro.ppgd.irpf.negocio.util`

- Classes: 18
- Área: Infraestrutura PPGD
- Papel provável: Utilitários: CPF, datas, imposto devido, mensagens, ajuda, zip, criptografia do tipo de declaração.
- Classes: `AplicacaoPropertiesUtil`, `CPFUtil`, `CalculoImpostoDevidoUtil`, `Chave`, `ConstantesGlobaisIRPF`, `DataUtil`, `HTMLUtil`, `IRPFUtil`, `IdDeclaracaoXMLTagHandler`, `LeitorArquivoAjuda`, `MensagemUtil`, `ObfuscatedString`, `ObjetoComChaveIRPF`, `OpcoesApp`, `QuadroAuxiliarUtil`, `TipoDeclaracaoAES`, `ValidadorIRPF`, `ZipHelper`

#### `serpro.ppgd.irpf.negocio.util.calculos`

- Classes: 9
- Área: Cálculo
- Papel provável: Mapeamento de dependências entre campos para recálculo.
- Classes: `CampoInformacao`, `DeclaracaoMultiExercicio`, `FichaInformacao`, `ListaFichaInformacao`, `MapeadorCalculos`, `MapeadorCalculos2`, `MapeadorCalculosPPGD`, `MapeamentoDependencias`, `MapeamentoReferenciaDependencias`

#### `serpro.ppgd.irpf.negocio.util.update`

- Classes: 2
- Área: Infraestrutura PPGD
- Papel provável: Atualização do programa.
- Classes: `IRPFUpdateProperties`, `IRPFUpdater`

### `lib-modulos/irpf-servicos-nuvem.jar`

15 classes, 0 telas, 0 relatórios.

#### `serpro.ppgd.irpf.nuvem`

- Classes: 7
- Área: Serviços em nuvem
- Papel provável: Barramento de serviços da RFB: pré-preenchida, DARF (quota, ECA, Idoso, MAED), salvar/recuperar online, municípios, data do servidor.
- Classes: `BarramentoIRPFService`, `BarramentoIRPFUtil`, `Captcha`, `RetornoBarramento`, `RetornoDarf`, `RetornoDarfAuxilio`, `UsuarioLogado`

#### `serpro.ppgd.irpf.nuvem.carneleao`

- Classes: 7
- Área: Serviços em nuvem
- Papel provável: Registros do Carnê-Leão Web recebidos do serviço.
- Classes: `CarneLeao`, `Dados`, `Registro01`, `Registro02`, `Registro03`, `Registro04`, `RegistroIR`

#### `serpro.ppgd.irpf.nuvem.util.certificadodigital`

- Classes: 1
- Área: Serviços em nuvem
- Papel provável: Token de certificado digital.
- Classes: `TokenUtil`

### `lib/ppgd-formatos-externos-4.3.1.jar`

45 classes, 0 telas, 0 relatórios.

#### `serpro.ppgd.formatosexternos`

- Classes: 9
- Área: Impressão
- Papel provável: Infraestrutura de relatórios JasperReports.
- Classes: `DefaultListaRelatorios`, `JRXmlDataSourcePPGD`, `ListaRelatoriosIf`, `PPGDJRViewer`, `PPGDJasperViewer`, `RelatorioDB`, `RelatorioIf`, `RelatorioMultiploXML`, `RelatorioXML`

#### `serpro.ppgd.formatosexternos.barcode`

- Classes: 3
- Área: Impressão
- Papel provável: Código de barras do DARF.
- Classes: `Barcode`, `BarcodeEncoder`, `Teste`

#### `serpro.ppgd.formatosexternos.barcode.util`

- Classes: 3
- Área: Impressão
- Papel provável: Código de barras do DARF.
- Classes: `CalculosGenericos`, `DarfAdaptor`, `JulianDate`

#### `serpro.ppgd.formatosexternos.barcodedesigners`

- Classes: 7
- Área: Impressão
- Papel provável: Infraestrutura de relatórios JasperReports.
- Classes: `AbstractBarCode2D`, `AbstractBarCode2DRenderer`, `BarCode2DIf`, `BarCode2DRendererIf`, `BarCodeCanvas2`, `DefaultBarCode2DRenderer`, `Interleaved2of5`

#### `serpro.ppgd.formatosexternos.hash`

- Classes: 1
- Área: Transmissão
- Papel provável: Hash de integridade do arquivo.
- Classes: `UtilitariosHash`

#### `serpro.ppgd.formatosexternos.hash.excecao`

- Classes: 1
- Área: Transmissão
- Papel provável: Hash de integridade do arquivo.
- Classes: `HashIncorretoException`

#### `serpro.ppgd.formatosexternos.transmissao`

- Classes: 2
- Área: Transmissão
- Papel provável: Adaptador para o Receitanet (transmissão).
- Classes: `RecnetAdaptor`, `RetornoTransmissao`

#### `serpro.ppgd.formatosexternos.txt`

- Classes: 10
- Área: Importação/exportação
- Papel provável: Motor genérico de leitura e escrita de arquivos TXT por mapeamento.
- Classes: `CampoReg`, `CampoTXT`, `ConversorObjetoParaRegistros`, `ConversorRegistroParaObjeto`, `DadosMapeamentoRegistro`, `DadosMapeamentoTipoArquivo`, `DocumentoTXT`, `DocumentoTXTDefault`, `MapeamentoTXT`, `RegistroTxt`

#### `serpro.ppgd.formatosexternos.txt.excecao`

- Classes: 1
- Área: Importação/exportação
- Papel provável: Motor genérico de leitura e escrita de arquivos TXT por mapeamento.
- Classes: `GeracaoTxtException`

#### `serpro.receitanet`

- Classes: 1
- Área: Transmissão
- Papel provável: Cliente de transmissão Receitanet (nomes ofuscados).
- Classes: `Util`

#### `serpro.receitanet.carregador`

- Classes: 6
- Área: Transmissão
- Papel provável: Carregador de classes do Receitanet.
- Classes: `Configuracao`, `ExcecaoArquivoNaoEncontrado`, `ExcecaoCarregador`, `ExcecaoErroDeLeitura`, `ExcecaoInformacaoIncorreta`, `JARClassLoader`

#### `srf.irpf.util`

- Classes: 1
- Área: Transmissão
- Papel provável: Utilitário legado da SRF.
- Classes: `Mestre21J`

### `lib/ppgd-gui-beans-4.3.1.jar`

129 classes, 0 telas, 0 relatórios.

#### `serpro.ppgd.gui`

- Classes: 14
- Área: Infraestrutura PPGD
- Papel provável: Componentes de interface da plataforma: campos de edição (CPF, CNPJ, CEP, NIRF, valor, data), seletores, dicas.
- Classes: `ActionTransfereFoco`, `ButtonPPGD`, `ConstantesGlobaisGUI`, `ConteudoPainelDicas`, `DialogoOcupado`, `ExecutaHiperlinkDicas`, `FabricaGUI`, `HtmlParser`, `IdLink`, `NavegadorHtml`, `PainelDicas`, `PainelDicasModal`, `SplashScreen`, `UtilitariosGUI`

#### `serpro.ppgd.gui.editors`

- Classes: 1
- Área: Infraestrutura PPGD
- Papel provável: Componentes de interface da plataforma: campos de edição (CPF, CNPJ, CEP, NIRF, valor, data), seletores, dicas.
- Classes: `PPGDTextField`

#### `serpro.ppgd.gui.filechooser`

- Classes: 10
- Área: Infraestrutura PPGD
- Papel provável: Componentes de interface da plataforma: campos de edição (CPF, CNPJ, CEP, NIRF, valor, data), seletores, dicas.
- Classes: `FDFileChooser`, `FDFileFilter`, `FileChooser`, `FileChooserFactory`, `FileChooserResponse`, `FileChooserSelectionMode`, `FileFilter`, `JFCFileChooser`, `JFCFileFilter`, `TestFileChooserFrame`

#### `serpro.ppgd.gui.pendencia`

- Classes: 4
- Área: Pendências
- Papel provável: Tabela genérica de pendências.
- Classes: `LinhaPendencia`, `MapeamentoInformacaoEditCampo`, `TableModelPendencia`, `TablePendencia`

#### `serpro.ppgd.gui.xbeans`

- Classes: 79
- Área: Infraestrutura PPGD
- Papel provável: Componentes de interface da plataforma: campos de edição (CPF, CNPJ, CEP, NIRF, valor, data), seletores, dicas.
- Classes: `BordaPendencia`, `BotaoItemIf`, `Chave`, `CustomComboBox`, `CustomComboBoxObjNegocio`, `FiltroTeclado`, `GroupPanelEvent`, `GroupPanelListener`, `JButtonGroupPanel`, `JButtonMensagem`, `JButtonMensagemBeanInfo`, `JDialogEditCampoLeitor`, `JDropDownButton`, `JDropDownButtonBeanInfo`, `JEditAlfa`, `JEditAlfaBeanInfo`, `JEditCEP`, `JEditCEPBeanInfo`, `JEditCNPJ`, `JEditCNPJBeanInfo`, `JEditCPF`, `JEditCPFBeanInfo`, `JEditCampo`, `JEditCampoBeanInfo`, `JEditCampoTextoAbstract`, `JEditCodigo`, `JEditCodigoBeanInfo`, `JEditColecao`, `JEditColecaoBeanInfo`, `JEditData`, `JEditDataBeanInfo`, `JEditHora`, `JEditInteiro`, `JEditInteiroBeanInfo`, `JEditLogico`, `JEditLogicoBeanInfo`, `JEditMascara`, `JEditMascaraBeanInfo`, `JEditMemo`, `JEditMemoBeanInfo`, `JEditNI`, `JEditNIBeanInfo`, `JEditNirf`, `JEditNirfBeanInfo`, `JEditNumero`, `JEditNumeroBeanInfo`, `JEditObjetoNegocio`, `JEditObjetoNegocioItemIf`, `JEditOpcao`, `JEditOpcaoBeanInfo`, `JEditPopupCombo`, `JEditPorcentagem`, `JEditPorcentagemBeanInfo`, `JEditTelefone`, `JEditTelefoneBeanInfo`, `JEditValor`, `JEditValorBeanInfo`, `JFlipComponentes`, `JFlipComponentesBeanInfo`, `JNavegadorCodigo`, `JNavegadorColecao`, `JNavegadorColecaoBeanInfo`, `JNavegadorIndice`, `JanelaPrincipalDefault`, `KeySelectionCustomizadoObjNegocio`, `LabelFlip`, `ListPopupModel`, `ListPopupRenderer`, `LogicoDefault`, `MultiLineLabel`, `MyCustomRenderer`, `MyCustomRendererObjNegocio`, `OpcaoDefault`, `PPGDButtonGroup`, `PPGDCheckBox`, `PPGDCheckBoxItem`, `PPGDRadioButton`, `PPGDRadioItem`, `PainelBotao`

#### `serpro.ppgd.gui.xbeans.autocomplete`

- Classes: 9
- Área: Infraestrutura PPGD
- Papel provável: Componentes de interface da plataforma: campos de edição (CPF, CNPJ, CEP, NIRF, valor, data), seletores, dicas.
- Classes: `JAutoCompleteComboBox`, `JAutoCompleteComboDocument`, `JAutoCompleteComboEditor`, `JAutoCompleteComboModel`, `JAutoCompleteComboRenderer`, `JAutoCompleteEditAlfa`, `JAutoCompleteEditCPF`, `JAutoCompleteEditCodigo`, `JAutoCompleteEditNI`

#### `serpro.ppgd.gui.xbeans.customizers`

- Classes: 1
- Área: Infraestrutura PPGD
- Papel provável: Componentes de interface da plataforma: campos de edição (CPF, CNPJ, CEP, NIRF, valor, data), seletores, dicas.
- Classes: `CustomizerJEditCampo`

#### `serpro.ppgd.gui.xbeans.editors`

- Classes: 7
- Área: Infraestrutura PPGD
- Papel provável: Componentes de interface da plataforma: campos de edição (CPF, CNPJ, CEP, NIRF, valor, data), seletores, dicas.
- Classes: `PPGDCheckBox`, `PPGDComboBox`, `PPGDComboboxItem`, `PPGDFormattedTextField`, `PPGDRadioButton`, `PPGDSpinner`, `PPGDTextArea`

#### `serpro.ppgd.gui.xbeans.listener`

- Classes: 2
- Área: Infraestrutura PPGD
- Papel provável: Componentes de interface da plataforma: campos de edição (CPF, CNPJ, CEP, NIRF, valor, data), seletores, dicas.
- Classes: `ValueChangeEvent`, `ValueChangeListener`

#### `serpro.ppgd.gui.xbeans.table`

- Classes: 2
- Área: Infraestrutura PPGD
- Papel provável: Componentes de interface da plataforma: campos de edição (CPF, CNPJ, CEP, NIRF, valor, data), seletores, dicas.
- Classes: `JTableEx`, `TableUIEx`

### `lib/ppgd-infraestrutura-4.3.1.jar`

32 classes, 0 telas, 0 relatórios.

#### `serpro.ppgd.infraestrutura`

- Classes: 3
- Área: Infraestrutura PPGD
- Papel provável: Plataforma, janela principal, barramento de eventos, progresso.
- Classes: `JanelaPrincipalPPGD`, `PlataformaFilha`, `PlataformaPPGD`

#### `serpro.ppgd.infraestrutura.ajuda`

- Classes: 4
- Área: Ajuda
- Papel provável: Ajuda contextual (F1) em PDF.
- Classes: `ActionAjudaF1`, `ClickActionAjudaF1`, `PDFHelp`, `PDFViewBuilderPPGD`

#### `serpro.ppgd.infraestrutura.eventos`

- Classes: 3
- Área: Infraestrutura PPGD
- Papel provável: Plataforma, janela principal, barramento de eventos, progresso.
- Classes: `BarramentoEventos`, `Evento`, `EventoOutput`

#### `serpro.ppgd.infraestrutura.eventos.teste`

- Classes: 2
- Área: Infraestrutura PPGD
- Papel provável: Plataforma, janela principal, barramento de eventos, progresso.
- Classes: `Test1`, `Test2`

#### `serpro.ppgd.infraestrutura.util`

- Classes: 20
- Área: Infraestrutura PPGD
- Papel provável: Plataforma, janela principal, barramento de eventos, progresso.
- Classes: `AcaoProgressiva`, `BorderLayoutJPanel`, `ControleProgresso`, `DialogoProgresso`, `FichaColecaoIf`, `FontesUtil`, `HelpUtil`, `InfUtil`, `MostrarProgresso`, `NavegadorColecaoEvent`, `NavegadorColecaoIf`, `NavegadorColecaoListener`, `NavegadorRemocaoEvent`, `NavegadorRemocaoListener`, `PPGDPainelIf`, `PainelCacher`, `ProcessoSwing`, `Tarefa`, `TarefaComExcecao`, `VisualizadorHelp`

### `lib/ppgd-negocio-4.3.1.jar`

96 classes, 0 telas, 0 relatórios.

#### `serpro.ppgd.negocio`

- Classes: 45 (1 com nome ofuscado, omitidas)
- Área: Infraestrutura PPGD
- Papel provável: Tipos de dados da plataforma (Alfa, CPF, CNPJ, Data, Valor, Colecao, ObjetoNegocio, Pendencia, validadores).
- Classes: `Alfa`, `Bool`, `CEP`, `CNPJ`, `CPF`, `Codigo`, `Colecao`, `ConstantesGlobais`, `ControladorNegocio`, `Data`, `DataHora`, `ElementoTabela`, `Hora`, `IdDeclaracao`, `IdUsuario`, `Informacao`, `Inteiro`, `ItemOpcao`, `IteratorColecaoPPGD`, `ListIteratorColecaoPPGD`, `ListaPPGD`, `Logico`, `NIRF`, `Nome`, `ObjetoComChave`, `ObjetoComCodigoClassificante`, `ObjetoFicha`, `ObjetoNegocio`, `Observador`, `Opcao`, `OpcaoLogico`, `PPGDFacade`, `Pendencia`, `RetornoValidacao`, `RetornosValidacoes`, `TituloEleitor`, `ValidadorDefault`, `ValidadorDigitosInteirosRepetidos`, `ValidadorIf`, `ValidadorImpeditivoDefault`, `ValidadorImpeditivoLogico`, `ValidadorImpeditivoOpcao`, `ValidadorMaximoDigitosInteiros`, `Valor`

#### `serpro.ppgd.negocio.exception`

- Classes: 1
- Área: Infraestrutura PPGD
- Papel provável: Tipos de dados da plataforma (Alfa, CPF, CNPJ, Data, Valor, Colecao, ObjetoNegocio, Pendencia, validadores).
- Classes: `MensagemNaoEncontradaException`

#### `serpro.ppgd.negocio.impl`

- Classes: 2
- Área: Infraestrutura PPGD
- Papel provável: Tipos de dados da plataforma (Alfa, CPF, CNPJ, Data, Valor, Colecao, ObjetoNegocio, Pendencia, validadores).
- Classes: `IdDeclaracaoImpl`, `IdUsuarioImpl`

#### `serpro.ppgd.negocio.interpretador`

- Classes: 5
- Área: Cálculo
- Papel provável: Interpretador de expressões de cálculo e validação.
- Classes: `AnalisadorSintatico`, `InstanciadorOperacoes`, `InterpretadorOperacoes`, `OperadorMatematico`, `ValidacoesNegocio`

#### `serpro.ppgd.negocio.pendencia`

- Classes: 1
- Área: Pendências
- Papel provável: Mecanismo genérico de verificação de pendências.
- Classes: `VerificarPendencias`

#### `serpro.ppgd.negocio.usuariodefault`

- Classes: 2
- Área: Infraestrutura PPGD
- Papel provável: Tipos de dados da plataforma (Alfa, CPF, CNPJ, Data, Valor, Colecao, ObjetoNegocio, Pendencia, validadores).
- Classes: `IdDeclaracaoDefault`, `UsuarioIdDefault`

#### `serpro.ppgd.negocio.util`

- Classes: 17
- Área: Infraestrutura PPGD
- Papel provável: Utilitários de negócio: DARF, log, preferências, mensagens.
- Classes: `Darf`, `FabricaTratamentoErro`, `FabricaUtilitarios`, `FormDarf`, `HtmlParser`, `IdSistemaOperacional`, `LogPPGD`, `PreenchedorCodigo`, `PreferenciasGlobais`, `ProcessoAssincronoIf`, `ProcessosAssincronos`, `TabelaMensagens`, `TrataErroSistemicoIf`, `TrataErroSistemicoStandalone`, `UtilitariosArquivo`, `UtilitariosString`, `Validador`

#### `serpro.ppgd.negocio.validadoresBasicos`

- Classes: 23
- Área: Infraestrutura PPGD
- Papel provável: Validadores básicos: CPF, CNPJ, CEP, NI, NIRF, NIT, e-mail, título de eleitor, nº de recibo, INCRA.
- Classes: `ConstantesValidadoresBasicos`, `ValidadorAmbosNaoNulos`, `ValidadorCEP`, `ValidadorCNPJ`, `ValidadorCPF`, `ValidadorCodigo`, `ValidadorComparacao`, `ValidadorData`, `ValidadorDePares`, `ValidadorDeParesComInformacaoEspecifica`, `ValidadorEmail`, `ValidadorInformacoesNaoNulas`, `ValidadorNI`, `ValidadorNIRF`, `ValidadorNIT`, `ValidadorNaoNegativo`, `ValidadorNaoNulo`, `ValidadorNaoNuloDadosInterdependentes`, `ValidadorNaoNuloObjetoPreenchido`, `ValidadorNome`, `ValidadorNrImovelIncra`, `ValidadorNrRecibo`, `ValidadorTituloEleitor`

### `lib/ppgd-persistencia-4.3.1.jar`

28 classes, 0 telas, 0 relatórios.

#### `serpro.ppgd.persistenciagenerica`

- Classes: 5
- Área: Persistência
- Papel provável: Repositório XML genérico e hash.
- Classes: `BackupInexistenteException`, `HashInvalidoException`, `RepositorioGenericoIf`, `RepositorioXMLDefault`, `RepositorioXMLJavaBean`

#### `serpro.ppgd.repositorio`

- Classes: 9
- Área: Persistência
- Papel provável: Repositórios de declarações e tabelas em XML.
- Classes: `CadastroId`, `FacadeDefault`, `RepositorioColecaoIf`, `RepositorioException`, `RepositorioIdDeclaracaoIf`, `RepositorioIdIf`, `RepositorioObjetoNegocioIf`, `RepositorioTabelasBasicasIf`, `SalvarDeclaracao`

#### `serpro.ppgd.repositorio.acoes`

- Classes: 1
- Área: Persistência
- Papel provável: Repositórios de declarações e tabelas em XML.
- Classes: `Salvar`

#### `serpro.ppgd.repositorio.embeddedDB.util`

- Classes: 1
- Área: Persistência
- Papel provável: Repositórios de declarações e tabelas em XML.
- Classes: `UtilDB`

#### `serpro.ppgd.repositorio.repositorioXML`

- Classes: 10
- Área: Persistência
- Papel provável: Repositórios de declarações e tabelas em XML.
- Classes: `AdaptadorXMLAtributo`, `AdaptadorXMLObjeto`, `ConverterTabelasTXTtoXML`, `HashtableIdDeclaracao`, `MapeamentoObjetoNegocioXML`, `RepositorioIdDeclaracaoXML`, `RepositorioIdXML`, `RepositorioObjetoNegocioXML`, `RepositorioTabelasBasicasXML`, `RepositorioXMLException`

#### `serpro.ppgd.repositorio.repositorioXML.util`

- Classes: 1
- Área: Persistência
- Papel provável: Repositórios de declarações e tabelas em XML.
- Classes: `UtilXML`

#### `serpro.ppgd.repositorio.util`

- Classes: 1
- Área: Persistência
- Papel provável: Repositórios de declarações e tabelas em XML.
- Classes: `FabricaRepositorio`

### `lib/ppgd-pgd-utils-4.3.1.jar`

8 classes, 1 telas, 0 relatórios.

#### `serpro.ppgd.cacheni`

- Classes: 1
- Área: Infraestrutura PPGD
- Papel provável: Cache de nomes por NI (CPF/CNPJ).
- Classes: `CacheNI`

#### `serpro.ppgd.log.util`

- Classes: 1
- Área: Infraestrutura PPGD
- Papel provável: Visualizador de log.
- Classes: `VisualizadorLog`

#### `serpro.ppgd.negocio`

- Classes: 2
- Área: Infraestrutura PPGD
- Papel provável: Tipos de dados da plataforma (Alfa, CPF, CNPJ, Data, Valor, Colecao, ObjetoNegocio, Pendencia, validadores).
- Classes: `DeclaracaoComIdentificador`, `IdentificadorDeclaracaoXML`

#### `serpro.ppgd.persistenciagenerica`

- Classes: 4
- Área: Persistência
- Papel provável: Repositório XML genérico e hash.
- Classes: `DefaultTagHandler`, `RepositorioXML`, `RepositorioXMLListener`, `XMLSaxHandler`

#### Telas (`.form`) de `ppgd-pgd-utils-4.3.1.jar`

- `serpro.ppgd.log.util` (1): VisualizadorLog

### `lib/receitanet-pro-1.32.jar`

131 classes, 0 telas, 0 relatórios.

#### `serpro.receitanet`

- Classes: 102 (93 com nome ofuscado, omitidas)
- Área: Transmissão
- Papel provável: Cliente de transmissão Receitanet (nomes ofuscados).
- Classes: `Ambiente`, `ConfiguracaoTeste`, `ControleReceitanet`, `FabricaReceitanet`, `Origem`, `Receitanet`, `ReceitanetModoServidor`, `ReceitanetSPED`, `Retorno`

#### `serpro.receitanet.gui`

- Classes: 29 (28 com nome ofuscado, omitidas)
- Área: Transmissão
- Papel provável: Interface do Receitanet (nomes ofuscados).
- Classes: `ReceitanetApp`

### `lib/recnet-envelope-1.2.jar`

8 classes, 0 telas, 0 relatórios.

#### `serpro.receitanet.envelope`

- Classes: 8
- Área: Transmissão
- Papel provável: Envelope e assinatura do arquivo transmitido.
- Classes: `AssinaturaEnvelope`, `Base64`, `ByteList`, `Conversoes`, `Envelope`, `ExcecaoEnvelope`, `GeradorEnvelope`, `Misc`

### `lib/recnetutil-1.1.jar`

9 classes, 0 telas, 0 relatórios.

#### `serpro.receitanet.util`

- Classes: 9
- Área: Transmissão
- Papel provável: Utilitários do Receitanet.
- Classes: `Base64`, `ByteList`, `Conversoes`, `Format`, `IconePerdido`, `Imagem`, `IndicadorProgresso`, `Misc`, `PrefixInputStream`

### `lib/serpro-1.0.0.jar`

12 classes, 0 telas, 0 relatórios.

#### `serpro.hash`

- Classes: 2
- Área: Transmissão
- Papel provável: CRC32.
- Classes: `Crc32`, `iCrc32`

#### `serpro.transmissao`

- Classes: 9
- Área: Transmissão
- Papel provável: Diálogo e thread de envio da declaração.
- Classes: `Codecs`, `ControleProgressoEnvio`, `JDeclaracao`, `JParametrosNet`, `JTipoDeclaracao`, `JTransnetDlg`, `JTransnetDlgEvent`, `JUtil`, `ThreadEnvio`

#### `serpro.util`

- Classes: 1
- Área: Infraestrutura PPGD
- Papel provável: Utilitário numérico.
- Classes: `PLong`

