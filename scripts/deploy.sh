#!/usr/bin/env bash
#
# deploy.sh — baut die statische Seite (npm run build -> out/) und legt NUR
# den Inhalt von out/ flach in den Branch "deploy" ab (Wurzelverzeichnis =
# Web-Root). Auf dem Server wird ausschliesslich dieser Branch ausgecheckt:
#
#   git clone --branch deploy --single-branch --depth 1 <repo-url> .
#
# Quellcode (app/, node_modules, …) landet nie auf dem Server.
#
# Aufruf:  ./scripts/deploy.sh              (Remote: origin, Branch: deploy)
#          REMOTE=github BRANCH=live ./scripts/deploy.sh
#
# Dasselbe Script wird unveraendert im Schwesterprojekt genutzt — deshalb
# sind Remote und Branch ueber Umgebungsvariablen einstellbar.
#
set -euo pipefail

REMOTE="${REMOTE:-origin}"
BRANCH="${BRANCH:-deploy}"

# --- ins Repo-Wurzelverzeichnis wechseln ----------------------------------
cd "$(dirname "$0")/.."
ROOT="$(pwd)"

# --- Vorbedingungen pruefen ----------------------------------------------
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "FEHLER: Das ist kein Git-Repository. Zuerst: git init  (siehe scripts/DEPLOY.md)" >&2
  exit 1
fi
if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "FEHLER: Remote '$REMOTE' existiert nicht. Anlegen mit:" >&2
  echo "        git remote add $REMOTE <repo-url>" >&2
  exit 1
fi
if [ -n "$(git status --porcelain)" ]; then
  echo "FEHLER: Uncommittete Aenderungen im Arbeitsverzeichnis." >&2
  echo "        Bitte erst committen/stashen, damit der Deploy reproduzierbar ist." >&2
  exit 1
fi

SRC_COMMIT="$(git rev-parse --short HEAD)"
SRC_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# --- Build --------------------------------------------------------------
echo "==> Build (npm ci + npm run build)"
if [ -f package-lock.json ]; then npm ci; else npm install; fi
npm run build   # ruft scripts/optimize-images.mjs + next build (output: export)

if [ ! -f out/index.html ]; then
  echo "FEHLER: out/index.html fehlt — Build unvollstaendig?" >&2
  exit 1
fi

# --- Worktree fuer den Deploy-Branch -----------------------------------
WT="$(mktemp -d)"
cleanup() { git worktree remove --force "$WT" 2>/dev/null || rm -rf "$WT"; }
trap cleanup EXIT

git fetch "$REMOTE" "$BRANCH" 2>/dev/null || true

if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git worktree add "$WT" "$BRANCH"
elif git show-ref --verify --quiet "refs/remotes/$REMOTE/$BRANCH"; then
  git worktree add -b "$BRANCH" "$WT" "$REMOTE/$BRANCH"
else
  echo "==> Branch '$BRANCH' existiert noch nicht — lege Orphan-Branch an"
  git worktree add --detach "$WT" HEAD
  ( cd "$WT" && git checkout --orphan "$BRANCH" && git rm -rf . >/dev/null 2>&1 || true )
fi

# --- Inhalt austauschen: alles ausser .git loeschen, dann out/ hineinkopieren
find "$WT" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R "$ROOT"/out/. "$WT"/
touch "$WT/.nojekyll"   # verhindert Jekyll-Verarbeitung (GitHub Pages); schadet sonst nicht

# --- committen & pushen ----------------------------------------------
cd "$WT"
git add -A
if git diff --cached --quiet; then
  echo "==> Keine Aenderungen gegenueber dem letzten Deploy — nichts zu tun."
  exit 0
fi
git commit -m "deploy: ${SRC_BRANCH}@${SRC_COMMIT} ($(date -u +%Y-%m-%dT%H:%M:%SZ))"
git push "$REMOTE" "$BRANCH"

echo
echo "==> Fertig. Branch '$BRANCH' aktualisiert."
echo "    Server:  git clone --branch $BRANCH --single-branch --depth 1 <repo-url> ."
echo "    Update:  git -C <zielordner> fetch --depth 1 $REMOTE $BRANCH && git -C <zielordner> reset --hard $REMOTE/$BRANCH"
