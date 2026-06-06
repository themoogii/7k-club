#!/usr/bin/env bash
set -euo pipefail

if ! command -v codex >/dev/null 2>&1; then
  echo "Codex CLI is required."
  echo "Open this script from the same Terminal where Codex is installed."
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required for these MCP servers."
  echo "Install Node.js first, for example: brew install node"
  exit 1
fi

maybe_remove() {
  local name="$1"
  codex mcp remove "$name" >/dev/null 2>&1 || true
}

prompt_secret() {
  local var_name="$1"
  local label="$2"
  local current_value="${!var_name:-}"
  if [ -n "$current_value" ]; then
    printf "%s" "$current_value"
    return 0
  fi

  if [ -t 0 ]; then
    read -r -s -p "${label} (leave blank to skip): " value
    printf "\n" >&2
    printf "%s" "$value"
    return 0
  fi

  printf ""
}

echo "Installing MCP servers for Codex..."

maybe_remove "playwright"
codex mcp add playwright -- npx -y @playwright/mcp@latest

maybe_remove "ruflo"
codex mcp add ruflo -- npx -y ruflo@latest mcp start

FIRECRAWL_VALUE="$(prompt_secret FIRECRAWL_API_KEY "Firecrawl API key")"
if [ -n "$FIRECRAWL_VALUE" ]; then
  maybe_remove "firecrawl"
  codex mcp add firecrawl \
    --env "FIRECRAWL_API_KEY=${FIRECRAWL_VALUE}" \
    -- npx -y firecrawl-mcp
else
  echo "Skipped Firecrawl MCP because FIRECRAWL_API_KEY was not provided."
fi

GLIF_VALUE="$(prompt_secret GLIF_API_TOKEN "Glif API token")"
if [ -n "$GLIF_VALUE" ]; then
  maybe_remove "glif"
  codex mcp add glif \
    --env "GLIF_API_TOKEN=${GLIF_VALUE}" \
    -- npx -y @glifxyz/glif-mcp-server@latest
else
  echo "Skipped Glif MCP because GLIF_API_TOKEN was not provided."
fi

echo
echo "Installed MCPs currently registered in Codex:"
codex mcp list
echo
echo "Restart Codex to load newly registered MCP tools."
