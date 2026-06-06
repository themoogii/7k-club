#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${SEVENK_REPO_URL:-https://github.com/themoogii/7k-club.git}"
WORKSPACE="${SEVENK_WORKSPACE:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
SYNC_DIR="$(mktemp -d /private/tmp/7k-club-sync.XXXXXX)"
CLONE_DIR="$SYNC_DIR/repo"

cleanup() {
  rm -rf "$SYNC_DIR"
}
trap cleanup EXIT

git clone "$REPO_URL" "$CLONE_DIR" >/dev/null

rsync -a \
  --exclude='.DS_Store' \
  --exclude='.codex' \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='build' \
  --exclude='.env' \
  --exclude='.env.*' \
  --exclude='moncydev-portfolio' \
  --exclude='moncydev-portfolio-fresh' \
  --exclude='munkherdene-7k-portfolio' \
  --exclude='munkherdene-7k-template-site' \
  --exclude='munkherdene-real-portfolio' \
  "$WORKSPACE/" "$CLONE_DIR/"

cd "$CLONE_DIR"
git config user.name "${GIT_AUTHOR_NAME:-Codex}"
git config user.email "${GIT_AUTHOR_EMAIL:-codex@openai.local}"
git add .

if git diff --cached --quiet; then
  echo "No changes to sync."
  exit 0
fi

git commit -m "${SEVENK_COMMIT_MESSAGE:-Daily 7K Club sync}" >/dev/null
git push -u origin main
