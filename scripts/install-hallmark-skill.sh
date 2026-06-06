#!/usr/bin/env bash
set -euo pipefail

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required to install Hallmark."
  echo "Install Node.js first, for example: brew install node"
  exit 1
fi

echo "Installing Hallmark design skill for Codex..."
npx skills add nutlope/hallmark

echo "Done. Restart Codex to pick up the Hallmark skill."
echo "Usage examples after restart:"
echo "  hallmark audit the 7K Lab page"
echo "  hallmark redesign the 7K Lab page as an anti-slop coach console"
echo "  hallmark study https://www.usehallmark.com"
