#!/usr/bin/env bash
# Cocuna hackathon deploy script — idempotent, reads from .env, never echoes secrets.
#
# Usage:
#   ./ops/deploy.sh check          # report what's auth'd, what's missing
#   ./ops/deploy.sh supabase       # link + db push + functions deploy + set ANTHROPIC secret
#   ./ops/deploy.sh github         # create repo (if needed) + push
#   ./ops/deploy.sh vercel         # link + env push + prod deploy
#   ./ops/deploy.sh all            # the whole sequence (will skip steps already done)
#
# Pre-reqs:
#   - .env (root) and mobile/.env both filled in
#   - gh, vercel, supabase CLIs auth'd (run ./ops/deploy.sh check to verify)
#   - SUPABASE_PROJECT_REF, GH_REPO, VERCEL_TEAM exported OR set inline below.

set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# ---- config (edit or export) ----
SUPABASE_PROJECT_REF="${SUPABASE_PROJECT_REF:-}"     # e.g. abcdefghij
GH_REPO="${GH_REPO:-}"                                # e.g. nguyen-james41/cocuna
GH_VISIBILITY="${GH_VISIBILITY:-public}"              # public | private
VERCEL_TEAM="${VERCEL_TEAM:-}"                        # empty = personal

# Load env without echoing values to stdout. (`set -a` re-exports vars sourced.)
load_env() {
  if [ -f .env ]; then
    set -a; . ./.env; set +a
  fi
}

red()    { printf "\033[31m%s\033[0m\n" "$*"; }
green()  { printf "\033[32m%s\033[0m\n" "$*"; }
yellow() { printf "\033[33m%s\033[0m\n" "$*"; }
blue()   { printf "\033[34m%s\033[0m\n" "$*"; }
hr()     { printf "\033[2m----\033[0m\n"; }

cmd_check() {
  blue "== check =="
  for c in gh vercel supabase git; do
    if command -v "$c" >/dev/null 2>&1; then green "  ✓ $c installed"; else red "  ✗ $c missing"; fi
  done
  hr
  if [ -f .env ];        then green "  ✓ .env present";        else red "  ✗ .env missing — cp .env.example .env"; fi
  if [ -f mobile/.env ]; then green "  ✓ mobile/.env present"; else red "  ✗ mobile/.env missing — cp mobile/.env.example mobile/.env"; fi
  hr
  if gh auth status >/dev/null 2>&1;          then green "  ✓ gh authed";       else red "  ✗ gh not authed — run: gh auth login";       fi
  if vercel whoami >/dev/null 2>&1;           then green "  ✓ vercel authed";   else red "  ✗ vercel not authed — run: vercel login";    fi
  if supabase projects list >/dev/null 2>&1;  then green "  ✓ supabase authed"; else red "  ✗ supabase not authed — run: supabase login"; fi
  hr
  load_env
  for k in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY ANTHROPIC_API_KEY; do
    if [ -n "${!k:-}" ]; then green "  ✓ $k set"; else red "  ✗ $k empty"; fi
  done
  hr
  [ -n "$SUPABASE_PROJECT_REF" ] && green "  ✓ SUPABASE_PROJECT_REF=$SUPABASE_PROJECT_REF" || yellow "  · SUPABASE_PROJECT_REF unset (export or pass inline)"
  [ -n "$GH_REPO" ]               && green "  ✓ GH_REPO=$GH_REPO"                          || yellow "  · GH_REPO unset"
  [ -n "$VERCEL_TEAM" ]           && green "  ✓ VERCEL_TEAM=$VERCEL_TEAM"                  || yellow "  · VERCEL_TEAM unset (default = personal)"
}

cmd_supabase() {
  load_env
  : "${SUPABASE_PROJECT_REF:?set SUPABASE_PROJECT_REF=abcdefghij}"
  : "${ANTHROPIC_API_KEY:?fill ANTHROPIC_API_KEY in .env}"

  blue "== supabase link =="
  supabase link --project-ref "$SUPABASE_PROJECT_REF" || true

  blue "== supabase db push (applies migrations + RLS) =="
  supabase db push --include-all

  blue "== deploy cocuna-rad edge function =="
  supabase functions deploy cocuna-rad --no-verify-jwt

  blue "== set ANTHROPIC_API_KEY as Edge Function secret =="
  # Pipe directly so the value never appears in argv (visible via `ps`).
  printf "ANTHROPIC_API_KEY=%s\n" "$ANTHROPIC_API_KEY" | supabase secrets set --env-file /dev/stdin
  green "  ✓ supabase wired"
}

cmd_github() {
  : "${GH_REPO:?set GH_REPO=user/cocuna}"
  blue "== github =="
  if git remote get-url origin >/dev/null 2>&1; then
    green "  · origin already set: $(git remote get-url origin)"
  else
    if gh repo view "$GH_REPO" >/dev/null 2>&1; then
      yellow "  · repo $GH_REPO exists — wiring as remote"
      gh repo set-default "$GH_REPO" >/dev/null 2>&1 || true
      git remote add origin "https://github.com/$GH_REPO.git"
    else
      yellow "  · creating $GH_REPO ($GH_VISIBILITY)"
      gh repo create "$GH_REPO" --"$GH_VISIBILITY" --source=. --remote=origin
    fi
  fi
  git branch -M main 2>/dev/null || true
  git push -u origin main
  green "  ✓ pushed to https://github.com/$GH_REPO"
}

cmd_vercel() {
  load_env
  blue "== vercel link =="
  if [ -n "$VERCEL_TEAM" ]; then
    vercel link --yes --scope "$VERCEL_TEAM"
  else
    vercel link --yes
  fi

  blue "== vercel env push =="
  # Pipe each var so values don't end up in shell history.
  for k in NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY ANTHROPIC_API_KEY; do
    v="${!k:-}"
    if [ -z "$v" ]; then yellow "  · $k empty — skipping"; continue; fi
    for env in production preview development; do
      printf "%s" "$v" | vercel env add "$k" "$env" --force --sensitive >/dev/null 2>&1 && green "  ✓ $k $env" || yellow "  · $k $env skipped (may exist)"
    done
  done

  blue "== vercel deploy --prod =="
  vercel --prod --yes
  green "  ✓ clinic deployed"
}

cmd_all() {
  cmd_check
  cmd_supabase
  cmd_github
  cmd_vercel
  hr
  green "All phases done. Open the Vercel URL printed above + the mother app via 'cd mobile && npm run web'."
}

case "${1:-check}" in
  check)    cmd_check ;;
  supabase) cmd_supabase ;;
  github)   cmd_github ;;
  vercel)   cmd_vercel ;;
  all)      cmd_all ;;
  *)        red "unknown: $1"; echo "usage: ./ops/deploy.sh [check|supabase|github|vercel|all]"; exit 2 ;;
esac
