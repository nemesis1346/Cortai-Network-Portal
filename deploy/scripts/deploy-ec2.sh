#!/usr/bin/env bash
# Build and publish the SPA to an existing EC2 instance over SSH (nginx-served static site).
#
# Requires (as env vars, or in the project root .env — see .env.example):
#   EC2_HOST  - instance public DNS or IP
#   EC2_KEY   - path to the SSH private key (.pem)
#   EC2_USER  - SSH username (default: ubuntu)
#
# Idempotent: installs nginx and writes the site config only if missing/changed,
# then rsyncs the built dist/ over and reloads nginx.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/../../.env"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

EC2_USER="${EC2_USER:-ubuntu}"
: "${EC2_HOST:?Set EC2_HOST (instance public DNS or IP) via env var or .env}"
: "${EC2_KEY:?Set EC2_KEY (path to the .pem private key) via env var or .env}"

REMOTE_DIR="/var/www/cortai-network-portal"
SSH_CMD="ssh -i ${EC2_KEY} -o StrictHostKeyChecking=accept-new"

npm ci
npm run check
npm run build

$SSH_CMD "${EC2_USER}@${EC2_HOST}" bash -s <<REMOTE
set -euo pipefail
if ! command -v nginx >/dev/null 2>&1; then
  sudo apt-get update -y
  sudo apt-get install -y nginx
fi
sudo mkdir -p ${REMOTE_DIR}
sudo chown -R \$(whoami):\$(whoami) ${REMOTE_DIR}
REMOTE

scp -i "${EC2_KEY}" -o StrictHostKeyChecking=accept-new \
  "${SCRIPT_DIR}/nginx-cortai.conf" "${EC2_USER}@${EC2_HOST}:/tmp/cortai.conf"

$SSH_CMD "${EC2_USER}@${EC2_HOST}" bash -s <<'REMOTE'
set -euo pipefail
sudo mv /tmp/cortai.conf /etc/nginx/sites-available/cortai.conf
sudo ln -sf /etc/nginx/sites-available/cortai.conf /etc/nginx/sites-enabled/cortai.conf
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl reload nginx || sudo systemctl restart nginx
REMOTE

rsync -avz --delete -e "${SSH_CMD}" dist/ "${EC2_USER}@${EC2_HOST}:${REMOTE_DIR}/"

echo "Deployed to http://${EC2_HOST}"
