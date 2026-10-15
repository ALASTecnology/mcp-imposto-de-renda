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
GCAP_ZIP="${GCAP_ZIP:-$RAIZ/vendor/rfb/gcap/GCAP2025v1.6.zip}"
AR_ZIP="${AR_ZIP:-$RAIZ/vendor/rfb/atividade-rural/AR2025v1.0.zip}"
GOLDEN_DIR="${GOLDEN_DIR:-$RAIZ/packages/core/test/golden/2026}"
FIXTURES_DIR="${FIXTURES_DIR:-$RAIZ/packages/core/test/fixtures/dbk/2026}"
GCAP_FIXTURES_DIR="${GCAP_FIXTURES_DIR:-$RAIZ/packages/core/test/fixtures/gcap/2026}"
AR_FIXTURES_DIR="${AR_FIXTURES_DIR:-$RAIZ/packages/core/test/fixtures/atividade-rural/2026}"

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

# GCAP 2025 avulso (o "Exportar para o IRPF2026" fica nele), só para casos com ganhosCapital.
preparar_gcap() {
  if [[ -n "${GCAP_DIR:-}" ]]; then
    [[ -f "$GCAP_DIR/GCAP.jar" ]] || erro "GCAP_DIR=$GCAP_DIR não contém GCAP.jar"
  else
    GCAP_DIR="$CACHE/GCAP2025"
    if [[ ! -f "$GCAP_DIR/GCAP.jar" ]]; then
      [[ -f "$GCAP_ZIP" ]] || erro "GCAP não encontrado: defina GCAP_DIR ou coloque o zip em $GCAP_ZIP"
      mkdir -p "$CACHE/extracao-gcap"
      unzip -q -o "$GCAP_ZIP" -d "$CACHE/extracao-gcap"
      local jar
      jar="$(find "$CACHE/extracao-gcap" -maxdepth 3 -name GCAP.jar | head -n 1)"
      [[ -n "$jar" ]] || erro "GCAP.jar não encontrado dentro de $GCAP_ZIP"
      rm -rf "$GCAP_DIR"
      mv "$(dirname "$jar")" "$GCAP_DIR"
      rm -rf "$CACHE/extracao-gcap"
    fi
  fi
  local cp="$GCAP_DIR/GCAP.jar" j
  for j in "$GCAP_DIR"/lib/*.jar; do
    [[ -f "$j" ]] && cp="$cp:$j"
  done
  CLASSPATH_GCAP="$cp"
  CLASSES_GCAP="$CACHE/classes-gcap"
  local fontes=("$AQUI"/gcap/*.java "$AQUI"/src/Json.java "$AQUI"/src/Documentos.java)
  local carimbo="$CLASSES_GCAP/.compilado" precisa=1 f
  if [[ -f "$carimbo" ]]; then
    precisa=0
    for f in "${fontes[@]}"; do
      [[ "$f" -nt "$carimbo" ]] && precisa=1
    done
  fi
  if [[ "$precisa" == 1 ]]; then
    rm -rf "$CLASSES_GCAP"
    mkdir -p "$CLASSES_GCAP"
    "$JAVAC" -nowarn -encoding UTF-8 -cp "$CLASSPATH_GCAP" -d "$CLASSES_GCAP" "${fontes[@]}"
    touch "$carimbo"
  fi
}

# Roda o GCAP numa JVM isolada (casa temporária, locale pt_BR, que o programa exige para
# quantidades) e grava o arquivo exportado e o resultado em $2/.
executar_gcap() {
  local caso="$1" saida="$2" casa rc=0 cpf
  cpf="$(sed -n 's/.*"cpf" *: *"\([0-9]*\)".*/\1/p' "$caso" | head -n 1)"
  casa="$(mktemp -d "$CACHE/execucao-gcap.XXXXXX")"
  # O programa lê as tabelas (países etc.) de resources/ relativo ao diretório de trabalho.
  mkdir -p "$casa/lib"
  ln -s "$GCAP_DIR/lib/resources" "$casa/lib/resources"
  ln -s "$GCAP_DIR/lib/resources" "$casa/resources"
  (
    cd "$casa"
    timeout "$TEMPO_MAXIMO" "$JAVA" \
      -Djava.awt.headless=true \
      -Dfile.encoding=UTF-8 \
      -Duser.language=pt -Duser.country=BR \
      -Duser.home="$casa" \
      -Duser.dir="$casa" \
      -Djava.io.tmpdir="$casa" \
      -cp "$CLASSES_GCAP:$CLASSPATH_GCAP" \
      Gcap gerar "$caso" "$saida/$cpf-0101-3112-GCAP-2025.DEC" "$saida/gcap.json" 2> "$casa/stderr.log"
  ) || rc=$?
  if [[ "$rc" != 0 ]]; then
    grep -vE 'charToByteConverter|^\s+at ' "$casa/stderr.log" >&2 || true
  fi
  rm -rf "$casa"
  return "$rc"
}

# Atividade Rural 2025 avulso (o "Exportar para o IRPF" dele é o que o IRPF 2026 importa), só
# para casos com livroCaixaRural.
preparar_ar() {
  if [[ -n "${AR_DIR:-}" ]]; then
    [[ -f "$AR_DIR/PgdAtividadeRural.jar" ]] || erro "AR_DIR=$AR_DIR não contém PgdAtividadeRural.jar"
  else
    AR_DIR="$CACHE/AR2025"
    if [[ ! -f "$AR_DIR/PgdAtividadeRural.jar" ]]; then
      [[ -f "$AR_ZIP" ]] || erro "Atividade Rural não encontrada: defina AR_DIR ou coloque o zip em $AR_ZIP"
      mkdir -p "$CACHE/extracao-ar"
      unzip -q -o "$AR_ZIP" -d "$CACHE/extracao-ar"
      local jar
      jar="$(find "$CACHE/extracao-ar" -maxdepth 3 -name PgdAtividadeRural.jar | head -n 1)"
      [[ -n "$jar" ]] || erro "PgdAtividadeRural.jar não encontrado dentro de $AR_ZIP"
      rm -rf "$AR_DIR"
      mv "$(dirname "$jar")" "$AR_DIR"
      rm -rf "$CACHE/extracao-ar"
    fi
  fi
  local cp="$AR_DIR/PgdAtividadeRural.jar" j
  for j in "$AR_DIR"/lib/*.jar; do
    [[ -f "$j" ]] && cp="$cp:$j"
  done
  CLASSPATH_AR="$cp"
  CLASSES_AR="$CACHE/classes-ar"
  local fontes=("$AQUI"/ar/*.java "$AQUI"/src/Json.java)
  local carimbo="$CLASSES_AR/.compilado" precisa=1 f
  if [[ -f "$carimbo" ]]; then
    precisa=0
    for f in "${fontes[@]}"; do
      [[ "$f" -nt "$carimbo" ]] && precisa=1
    done
  fi
  if [[ "$precisa" == 1 ]]; then
    rm -rf "$CLASSES_AR"
    mkdir -p "$CLASSES_AR"
    "$JAVAC" -nowarn -encoding UTF-8 -cp "$CLASSPATH_AR" -d "$CLASSES_AR" "${fontes[@]}"
    touch "$carimbo"
  fi
}

# Roda o programa da Atividade Rural numa JVM isolada e grava o arquivo exportado e o resultado
# em $2/. O programa lê tabelas de lib/ relativo ao diretório de trabalho.
executar_ar() {
  local caso="$1" saida="$2" casa rc=0
  casa="$(mktemp -d "$CACHE/execucao-ar.XXXXXX")"
  ln -s "$AR_DIR/lib" "$casa/lib"
  (
    cd "$casa"
    timeout "$TEMPO_MAXIMO" "$JAVA" \
      -Djava.awt.headless=true \
      -Dfile.encoding=UTF-8 \
      -Duser.language=pt -Duser.country=BR \
      -Duser.home="$casa" \
      -Duser.dir="$casa" \
      -Djava.io.tmpdir="$casa" \
      -cp "$CLASSES_AR:$CLASSPATH_AR" \
      Ar gerar "$caso" "$saida" "$saida/ar.json" 2> "$casa/stderr.log"
  ) || rc=$?
  if [[ "$rc" != 0 ]]; then
    grep -vE 'charToByteConverter|^\s+at ' "$casa/stderr.log" >&2 || true
  fi
  rm -rf "$casa"
  return "$rc"
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
      ${PROPRIEDADES_EXTRAS:-} \
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
      PROPRIEDADES_EXTRAS=""
      saida_gcap=""
      if grep -q '"ganhosCapital"' "$caso"; then
        [[ -n "${CLASSES_GCAP:-}" ]] || preparar_gcap
        saida_gcap="$(mktemp -d "$CACHE/saida-gcap.XXXXXX")"
        if ! executar_gcap "$(absoluto "$caso")" "$saida_gcap"; then
          echo "FALHOU (GCAP): $id" >&2
          falhas=$((falhas + 1))
          rm -rf "$saida_gcap"
          continue
        fi
        PROPRIEDADES_EXTRAS="-Dgcap.dec=$(ls "$saida_gcap"/*.DEC) -Dgcap.resultado=$saida_gcap/gcap.json -Dgcap.fixtures=$GCAP_FIXTURES_DIR"
      fi
      saida_ar=""
      if grep -q '"livroCaixaRural"' "$caso"; then
        [[ -n "${CLASSES_AR:-}" ]] || preparar_ar
        saida_ar="$(mktemp -d "$CACHE/saida-ar.XXXXXX")"
        if ! executar_ar "$(absoluto "$caso")" "$saida_ar"; then
          echo "FALHOU (Atividade Rural): $id" >&2
          falhas=$((falhas + 1))
          rm -rf "$saida_ar"
          [[ -n "$saida_gcap" ]] && rm -rf "$saida_gcap"
          continue
        fi
        PROPRIEDADES_EXTRAS="$PROPRIEDADES_EXTRAS -Dar.arquivo=$(ls "$saida_ar"/*.DEC) -Dar.resultado=$saida_ar/ar.json -Dar.fixtures=$AR_FIXTURES_DIR"
      fi
      if ! executar gerar "$(absoluto "$caso")" "$GOLDEN_DIR/$id.json" "$FIXTURES_DIR"; then
        echo "FALHOU: $id" >&2
        falhas=$((falhas + 1))
      fi
      [[ -n "$saida_gcap" ]] && rm -rf "$saida_gcap"
      [[ -n "$saida_ar" ]] && rm -rf "$saida_ar"
    done
    echo "casos: ${#casos[@]}, falhas: $falhas"
    [[ "$falhas" == 0 ]]
    ;;
esac
