#!/usr/bin/env bash
#
# run.sh — serve the portfolio site locally.
#
# The site is plain static HTML/CSS (no build step), so this just starts a
# local file server pointed at website/ and opens it in the browser.
#
# Usage:
#   ./run.sh [port]
#
# Defaults to port 8080. Picks whichever server is available on the
# machine: Python 3, then Node's `npx serve`, then PHP's built-in server.

set -euo pipefail

PORT="${1:-8080}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$SCRIPT_DIR/website"
URL="http://localhost:$PORT"

if [[ ! -d "$SITE_DIR" ]]; then
  echo "error: website/ directory not found at $SITE_DIR" >&2
  exit 1
fi

open_browser() {
  # Give the server a moment to come up before opening the browser.
  ( sleep 1
    if command -v open >/dev/null 2>&1; then
      open "$URL"            # macOS
    elif command -v xdg-open >/dev/null 2>&1; then
      xdg-open "$URL"        # Linux
    fi
  ) &
}

cd "$SITE_DIR"

if command -v python3 >/dev/null 2>&1; then
  echo "Serving $SITE_DIR at $URL (python3 http.server) — Ctrl+C to stop"
  open_browser
  exec python3 -m http.server "$PORT"
elif command -v npx >/dev/null 2>&1; then
  echo "Serving $SITE_DIR at $URL (npx serve) — Ctrl+C to stop"
  open_browser
  exec npx --yes serve -l "$PORT" .
elif command -v php >/dev/null 2>&1; then
  echo "Serving $SITE_DIR at $URL (php -S) — Ctrl+C to stop"
  open_browser
  exec php -S "localhost:$PORT" -t .
else
  echo "error: no suitable local server found (need python3, npx, or php)" >&2
  exit 1
fi
