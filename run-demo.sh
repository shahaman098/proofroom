#!/usr/bin/env bash
# One command to run everything: QuickCart backend (:3000) + ProofRoom frontend (Vite).
# Usage: ./run-demo.sh        (needs Node 20.19+ or 22.12+)
set -euo pipefail
cd "$(dirname "$0")"
echo "Installing dependencies (first run only)…"
(cd demo-app && npm install --silent)
(cd proofroom && npm install --silent)
(cd clients && npm install --silent)
if lsof -nP -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port 3000 is already in use. Stop it first (lsof -nP -iTCP:3000 -sTCP:LISTEN), then re-run." >&2
  exit 1
fi
cleanup() { kill "${API_PID:-}" 2>/dev/null || true; }
trap cleanup EXIT INT TERM
(cd demo-app && PORT=3000 node server.js) &
API_PID=$!
sleep 1
echo
echo "Backend:  http://localhost:3000"
echo "Frontend: see the Vite URL below (scroll to “Try it on the real backend”)"
echo
cd proofroom && npm run dev
