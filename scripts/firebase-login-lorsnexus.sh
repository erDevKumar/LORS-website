#!/usr/bin/env bash
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"
cd "/Users/erkumardevender/Desktop/RoutematesV2/LORSWeb"

echo "=== Firebase: add lorsnexus@lorsnexus.com ==="
echo "Complete sign-in in the browser when prompted."
echo ""

npx firebase-tools@15.19.0 login:add lorsnexus@lorsnexus.com
STATUS=$?

if [[ $STATUS -ne 0 ]]; then
  echo ""
  echo "Login failed (exit $STATUS). Press Enter to close."
  read -r
  exit $STATUS
fi

npx firebase-tools@15.19.0 login:use lorsnexus@lorsnexus.com
npx firebase-tools@15.19.0 login:list
echo ""
echo "=== Projects for lorsnexus account ==="
npx firebase-tools@15.19.0 projects:list

echo ""
echo "=== Done. Return to Cursor — deploy will continue automatically. ==="
touch "/Users/erkumardevender/Desktop/RoutematesV2/LORSWeb/.firebase-auth-done"
sleep 2
