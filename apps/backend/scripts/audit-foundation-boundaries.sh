#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
backend_dir=$(CDPATH= cd -- "$script_dir/.." && pwd)

if grep -REn 'app\.(post|put|patch|delete|get).*\/v1\/stt' "$backend_dir/src"; then
  echo "remote STT route registration detected" >&2
  exit 1
fi

if grep -REn '(fetch\(|axios|undici|console\.(log|error|warn)|child_process)' "$backend_dir/src"; then
  echo "unapproved network, process, or fallback logging surface detected" >&2
  exit 1
fi

if ! grep -Fq 'FROM node:24.18.0-bookworm-slim AS runtime' "$backend_dir/Dockerfile"; then
  echo "runtime image is not pinned to Node.js 24.18.0" >&2
  exit 1
fi

if ! grep -Fq 'USER node' "$backend_dir/Dockerfile"; then
  echo "runtime image is not configured as non-root" >&2
  exit 1
fi

node -e '
  const packageJson = require(process.argv[1]);
  const dependencies = Object.keys(packageJson.dependencies ?? {});
  if (dependencies.length !== 1 || dependencies[0] !== "fastify") process.exit(1);
' "$backend_dir/package.json"

echo "backend foundation boundary audit: PASS"
