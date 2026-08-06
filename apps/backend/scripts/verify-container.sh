#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
backend_dir=$(CDPATH= cd -- "$script_dir/.." && pwd)
run_suffix=${GITHUB_RUN_ID:-local}-$$
build_image="cooklog-backend:t007-build-$run_suffix"
runtime_image="cooklog-backend:t007-runtime-$run_suffix"
container_name="cooklog-t007-runtime-$run_suffix"

cleanup() {
  docker rm -f "$container_name" >/dev/null 2>&1 || true
  docker image rm "$build_image" "$runtime_image" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

docker build --target build -t "$build_image" "$backend_dir"
docker run --rm --user node "$build_image" \
  node --test \
  dist/tests/health/server-lifecycle.test.js \
  dist/tests/integration/foundation-runtime.test.js

docker build -t "$runtime_image" "$backend_dir"
test "$(docker run --rm "$runtime_image" node --version)" = "v24.18.0"
test "$(docker run --rm "$runtime_image" id -u)" != "0"

docker run -d \
  --name "$container_name" \
  -e PORT=8080 \
  -e K_SERVICE=cooklog-local \
  -e K_REVISION=cooklog-local-00001 \
  -e K_CONFIGURATION=cooklog-local \
  "$runtime_image" >/dev/null

attempt=0
until docker exec "$container_name" node -e '
  const response = await fetch("http://127.0.0.1:8080/healthz");
  const body = await response.json();
  if (!response.ok || body.contract_version !== "health.v1") process.exit(1);
'; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge 20 ]; then
    echo "runtime container health deadline exceeded" >&2
    exit 1
  fi
  sleep 1
done

docker kill --signal=SIGTERM "$container_name" >/dev/null
test "$(docker wait "$container_name")" = "0"

echo "Node 24.18.0 non-root container verification: PASS"
