#!/usr/bin/env bash
set -Eeuo pipefail

TAG="${1:?Podaj SHA obrazu}"

if [[ ! "$TAG" =~ ^[a-f0-9]{40}$ ]]; then
  echo "Tag musi byc pelnym SHA commita" >&2
  exit 1
fi

cd /home/azureuser/node-devops-lab

if ! grep -q '^IMAGE_TAG=' .env; then
  echo "Brak IMAGE_TAG w .env — przerwano deploy" >&2
  exit 1
fi

export IMAGE_TAG="$TAG"

export DOCKER_CONFIG
DOCKER_CONFIG="$(mktemp -d)"
trap 'rm -rf "$DOCKER_CONFIG"' EXIT
trap 'docker compose -f compose.deploy.yaml logs --tail=30 api >&2 || true' ERR

docker login ghcr.io \
  --username ArturPawelski \
  --password-stdin < .ghcr-token

docker compose -f compose.deploy.yaml pull api migrate

docker compose -f compose.deploy.yaml up \
  -d --wait --wait-timeout 60 db

docker compose -f compose.deploy.yaml run --rm migrate

docker compose -f compose.deploy.yaml up -d --no-deps api

curl --fail --show-error --silent \
  --retry 10 --retry-delay 2 --retry-all-errors \
  --max-time 5 \
  http://127.0.0.1:3003/health

sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$TAG/" .env

echo
echo "DEPLOY_OK"