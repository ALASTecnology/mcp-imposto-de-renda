#!/usr/bin/env bash
# Harness de referência do MCP Imposto de Renda: usa o programa oficial IRPF 2026 (baixado pelo
# desenvolvedor, nunca versionado) para gerar casos golden e fixtures DBK/DEC sintéticos.
# Uso local, apenas em desenvolvimento. Ver tools/referencia/README.md e docs/adr/0002.
#
#   tools/referencia/gerar.sh gerar [caso.json ...]   gera golden e fixtures (padrão: todos os casos)
#   tools/referencia/gerar.sh verificar <arquivo>     restaura um .DBK/.DEC e lista pendências
#   tools/referencia/gerar.sh cpf <semente>           CPF sintético determinístico
#   tools/referencia/gerar.sh cnpj <semente>          CNPJ sintético determinístico
#   tools/referencia/gerar.sh limpar                  apaga o cache (JAR extraído e classes)
set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RAIZ="$(cd "$AQUI/../.." && pwd)"
ZIP="${IRPF_ZIP:-$RAIZ/vendor/rfb/irpf/IRPF2026-1.5.zip}"
CACHE="${MCP_IMPOSTO_DE_RENDA_REFERENCIA_CACHE:-${TMPDIR:-/tmp}/mcp-imposto-de-renda-referencia}"
CACHE="${CACHE%/}"
JAVA="${JAVA:-java}"
JAVAC="${JAVAC:-javac}"
TEMPO_MAXIMO="${TEMPO_MAXIMO:-300}"
GOLDEN_DIR="${GOLDEN_DIR:-$RAIZ/packages/core/test/golden/2026}"
FIXTURES_DIR="${FIXTURES_DIR:-$RAIZ/packages/core/test/fixtures/dbk/2026}"

erro() { echo "gerar.sh: $*" >&2; exit 1; }

preparar_programa() {
  if [[ -n "${IRPF_DIR:-}" ]]; then
    [[ -f "$IRPF_DIR/irpf.jar" ]] || erro "IRPF_DIR=$IRPF_DIR não contém irpf.jar"
    return
  fi
  IRPF_DIR="$CACHE/IRPF2026"
  if [[ ! -f "$IRPF_DIR/irpf.jar" ]]; then
    [[ -f "$ZIP" ]] || erro "programa oficial não encontrado: defina IRPF_DIR ou coloque o zip em $ZIP"
    mkdir -p "$CACHE/extracao"
    unzip -q -o "$ZIP" -d "$CACHE/extracao"
    local jar
    jar="$(find "$CACHE/extracao" -maxdepth 3 -name irpf.jar | head -n 1)"
    [[ -n "$jar" ]] || erro "irpf.jar não encontrado dentro de $ZIP"
    rm -rf "$IRPF_DIR"
    mv "$(dirname "$jar")" "$IRPF_DIR"
    rm -rf "$CACHE/extracao"
  fi
}

montar_classpath() {
  local cp="$IRPF_DIR/irpf.jar"
  [[ -d "$IRPF_DIR/lib/resources" ]] && cp="$cp:$IRPF_DIR/lib/resources"
  local j
  for j in "$IRPF_DIR"/lib-modulos/*.jar "$IRPF_DIR"/lib/*.jar; do
    [[ -f "$j" ]] && cp="$cp:$j"
  done
  CLASSPATH_PGD="$cp"
}

compilar() {
  CLASSES="$CACHE/classes"
  local carimbo="$CLASSES/.compilado"
  local precisa=1
  if [[ -f "$carimbo" ]]; then
    precisa=0
    local f
    for f in "$AQUI"/src/*.java; do
      [[ "$f" -nt "$carimbo" ]] && precisa=1
    done
  fi
  if [[ "$precisa" == 1 ]]; then
    rm -rf "$CLASSES"
    mkdir -p "$CLASSES"
    "$JAVAC" -nowarn -encoding UTF-8 -cp "$CLASSPATH_PGD" -d "$CLASSES" "$AQUI"/src/*.java
    touch "$carimbo"
  fi
}

# Executa o harness numa JVM isolada: diretório de trabalho e user.home temporários,
# para que o programa oficial grave aplicacao/dados/<CPF>/ fora do repositório.
executar() {
  local casa rc=0
  mkdir -p "$CACHE"
  casa="$(mktemp -d "$CACHE/execucao.XXXXXX")"
  (
    cd "$casa"
    timeout "$TEMPO_MAXIMO" "$JAVA" \
      -Djava.awt.headless=true \
      -Dfile.encoding=UTF-8 \
      -Duser.home="$casa" \
      -Duser.dir="$casa" \
      -Djava.io.tmpdir="$casa" \
      -cp "$CLASSES:$CLASSPATH_PGD" \
      Referencia "$@" 2> "$casa/stderr.log"
  ) || rc=$?
  if [[ "$rc" != 0 ]]; then
    grep -vE 'charToByteConverter|LogPPGD|JanelaPrincipal|getJanelaPrincipal|Data de Criacao|^\s+at ' \
      "$casa/stderr.log" >&2 || true
  fi
  rm -rf "$casa"
  return "$rc"
}

absoluto() { (cd "$(dirname "$1")" && echo "$(pwd)/$(basename "$1")"); }

comando="${1:-gerar}"
[[ $# -gt 0 ]] && shift

case "$comando" in
  limpar)
    rm -rf "$CACHE"
    echo "cache removido: $CACHE"
    exit 0
    ;;
  cpf|cnpj)
    [[ $# -eq 1 ]] || erro "uso: gerar.sh $comando <semente>"
    ;;
  verificar)
    [[ $# -eq 1 ]] || erro "uso: gerar.sh verificar <arquivo.DBK|.DEC>"
    [[ -f "$1" ]] || erro "arquivo não encontrado: $1"
    ;;
  gerar) ;;
  *) erro "comando desconhecido: $comando" ;;
esac

preparar_programa
montar_classpath
compilar

case "$comando" in
  cpf|cnpj)
    executar "$comando" "$1"
    ;;
  verificar)
    executar verificar "$(absoluto "$1")"
    ;;
  gerar)
    casos=("$@")
    if [[ ${#casos[@]} -eq 0 ]]; then
      casos=("$AQUI"/casos/*.json)
    fi
    mkdir -p "$GOLDEN_DIR" "$FIXTURES_DIR"
    falhas=0
    for caso in "${casos[@]}"; do
      id="$(basename "$caso" .json)"
      if ! executar gerar "$(absoluto "$caso")" "$GOLDEN_DIR/$id.json" "$FIXTURES_DIR"; then
        echo "FALHOU: $id" >&2
        falhas=$((falhas + 1))
      fi
    done
    echo "casos: ${#casos[@]}, falhas: $falhas"
    [[ "$falhas" == 0 ]]
    ;;
esac
