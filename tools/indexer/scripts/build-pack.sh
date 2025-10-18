#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INDEXER_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PROJECT_ROOT="$(cd "${INDEXER_DIR}/../.." && pwd)"

TIKA_URL="${FLUORITE_TIKA_URL:-http://localhost:9998}"
TIKA_VERSION="${FLUORITE_TIKA_VERSION:-3.2.3}"
TIKA_JAR_FILENAME="${FLUORITE_TIKA_JAR_FILENAME:-tika-server-standard-${TIKA_VERSION}.jar}"
TIKA_JAR_DEFAULT_PATH="${INDEXER_DIR}/${TIKA_JAR_FILENAME}"
TIKA_JAR_DOWNLOAD_URL="${FLUORITE_TIKA_JAR_URL:-https://archive.apache.org/dist/tika/${TIKA_VERSION}/${TIKA_JAR_FILENAME}}"
TIKA_JAR_DEFAULT_CANDIDATES=(
  "${FLUORITE_TIKA_JAR:-}"
  "${TIKA_JAR_DEFAULT_PATH}"
  "${INDEXER_DIR}/tika-server.jar"
)

TIKA_JAR=""
for candidate in "${TIKA_JAR_DEFAULT_CANDIDATES[@]}"; do
  if [[ -n "${candidate}" && -f "${candidate}" ]]; then
    TIKA_JAR="${candidate}"
    break
  fi
done

if [[ -z "${TIKA_JAR}" ]]; then
  if ! command -v curl >/dev/null 2>&1; then
    echo "🔍 Tika JAR が見つかりません。curl をインストールするか FLUORITE_TIKA_JAR にパスを指定してください。" >&2
    exit 1
  fi

  echo "⬇️ Apache Tika (${TIKA_VERSION}) をダウンロードします..."
  tmp_path="${TIKA_JAR_DEFAULT_PATH}.download"
  if curl -fSL "${TIKA_JAR_DOWNLOAD_URL}" -o "${tmp_path}"; then
    mv "${tmp_path}" "${TIKA_JAR_DEFAULT_PATH}"
    TIKA_JAR="${TIKA_JAR_DEFAULT_PATH}"
  else
    rm -f "${tmp_path}"
    echo "❌ Tika JAR のダウンロードに失敗しました。FLUORITE_TIKA_JAR で手動パスを指定してください。" >&2
    exit 1
  fi
fi

TIKA_PORT="$(
  TIKA_URL="${TIKA_URL}" python3 - <<'PY'
import os, sys
from urllib.parse import urlparse

parsed = urlparse(os.environ["TIKA_URL"])
if parsed.port:
    print(parsed.port)
elif parsed.scheme == "http":
    print(80)
elif parsed.scheme == "https":
    print(443)
else:
    sys.exit("Unsupported Tika URL scheme")
PY
)"

if [[ -z "${TIKA_PORT}" ]]; then
  echo "TIKA_URL からポート番号を解決できませんでした: ${TIKA_URL}" >&2
  exit 1
fi

cleanup() {
  if [[ -n "${TIKA_PID:-}" ]]; then
    kill "${TIKA_PID}" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "🧹 ポート ${TIKA_PORT} を使用しているプロセスを停止します..."
if command -v lsof >/dev/null 2>&1; then
  lsof -ti :"${TIKA_PORT}" | xargs -r kill || true
else
  echo "⚠️ lsof が見つからないため、ポート解放をスキップしました" >&2
fi

echo "🚀 Apache Tika を起動します (${TIKA_JAR})..."
java -jar "${TIKA_JAR}" -p "${TIKA_PORT}" >/tmp/fluorite-tika.log 2>&1 &
TIKA_PID=$!

echo "⏳ Tika が起動するのを待機中 (${TIKA_URL})..."
for _ in {1..30}; do
  if curl -fsS "${TIKA_URL%/}/version" >/dev/null 2>&1; then
    READY=true
    break
  fi
  sleep 1
done

if [[ "${READY:-false}" != true ]]; then
  echo "❌ Tika が起動しませんでした。ログ: /tmp/fluorite-tika.log" >&2
  exit 1
fi

echo "📦 パックを構築します..."
cd "${INDEXER_DIR}"

pnpm tsx batch.ts \
  --root "${PROJECT_ROOT}" \
  --pack-name "${FLUORITE_PACK_NAME:-fluorite-pack}" \
  --pack-dir "${FLUORITE_PACK_DIR:-packs}" \
  --tika-url "${TIKA_URL}" \
  "$@"

echo "🛑 Apache Tika を停止します (PID=${TIKA_PID})"
cleanup
TIKA_PID=""
