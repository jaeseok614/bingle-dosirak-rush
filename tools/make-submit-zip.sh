#!/usr/bin/env bash
set -euo pipefail

out="${1:-bingle-dosirak-rush-submit.zip}"
out_abs="$PWD/$out"
stage="$(mktemp -d)"
trap 'rm -rf "$stage"' EXIT

mkdir -p "$stage/tools"
cp index.html style.css game.js favicon.svg "$stage/"
cp README.md PROJECT_PROPOSAL.md THIRD_PARTY_NOTICES.md "$stage/"
cp netlify.toml .nojekyll "$stage/"
cp -R assets vendor "$stage/"
cp tools/browser-smoke.mjs tools/make-submit-zip.sh "$stage/tools/"

if command -v zip >/dev/null 2>&1; then
  (
    cd "$stage"
    zip -r -FS "$out_abs" .
  )
elif command -v powershell.exe >/dev/null 2>&1 && command -v wslpath >/dev/null 2>&1; then
  stage_win="$(wslpath -w "$stage")"
  out_win="$(wslpath -w "$PWD/$out")"
  powershell.exe -NoProfile -Command "\
    \$ErrorActionPreference = 'Stop'; \
    Set-Location -LiteralPath '$stage_win'; \
    if (Test-Path -LiteralPath '$out_win') { Remove-Item -LiteralPath '$out_win' -Force; } \
    Compress-Archive -Path * -DestinationPath '$out_win' -Force; \
    Compress-Archive -Path .nojekyll -Update -DestinationPath '$out_win'; \
  "
else
  printf 'zip command not found. Install zip or run this script from WSL with powershell.exe available.\n' >&2
  exit 1
fi

printf 'Created %s\n' "$out"
