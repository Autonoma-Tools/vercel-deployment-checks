#!/usr/bin/env bash
# Simulates a Vercel `deployment.succeeded` webhook against a locally-running
# checks handler. Useful for sanity-checking the registration + PATCH flow
# without wiring up ngrok.
#
# Usage:
#   VERCEL_ACCESS_TOKEN=xxx npx ts-node src/checks-handler.ts &
#   bash examples/simulate-webhook.sh
set -euo pipefail

HANDLER_URL="${HANDLER_URL:-http://localhost:3000/webhook}"
DEPLOYMENT_ID="${DEPLOYMENT_ID:-dpl_example123}"
PREVIEW_URL="${PREVIEW_URL:-my-app-git-feature-branch.vercel.app}"

curl -sS -X POST "$HANDLER_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"type\": \"deployment.succeeded\",
    \"payload\": {
      \"deployment\": {
        \"id\": \"$DEPLOYMENT_ID\",
        \"url\": \"$PREVIEW_URL\"
      }
    }
  }"
echo
