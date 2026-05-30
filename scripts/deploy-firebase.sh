#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Firebase CLI requires Node 20+
export PATH="/opt/homebrew/opt/node@20/bin:${PATH}"

echo "Firebase accounts:"
npx firebase-tools@15.19.0 login:list

ACTIVE="$(npx firebase-tools@15.19.0 login:list 2>/dev/null | sed -n 's/^Logged in as //p' | head -1)"
if [[ "${ACTIVE}" != *"@lorsnexus.com" ]]; then
  echo ""
  echo "ERROR: Active account is '${ACTIVE}', expected *@lorsnexus.com"
  echo "Run:  firebase login:add"
  echo "Then: firebase login:use lorsnexus@lorsnexus.com"
  exit 1
fi

echo ""
echo "Firebase projects:"
npx firebase-tools@15.19.0 projects:list

npm run deploy
