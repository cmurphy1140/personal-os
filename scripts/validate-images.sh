#!/usr/bin/env bash
# validate-images.sh — verify every image referenced in source resolves to a
# real file, with the exact case the filesystem uses.
#
# The case check is the point. macOS is case-insensitive by default, so a
# reference to /Hero.png that actually lives at public/hero.png works on this
# machine and 404s on Linux — i.e. on Vercel, in production, after the client
# has already seen it.
#
# Exit 0 = clean (warnings allowed).  Exit 1 = broken references found.
set -uo pipefail

ROOT="${1:-.}"
cd "$ROOT" 2>/dev/null || { echo "[ERROR] no such directory: $ROOT"; exit 1; }

RASTER_RE='\.(png|jpg|jpeg)$'
missing=0; casebad=0; raster=0; checked=0

say() { printf '%s\n' "$*"; }

# Exact-case existence test: -e alone is case-insensitive on macOS.
exact_exists() {
  local p="$1" d b
  d=$(dirname "$p"); b=$(basename "$p")
  [ -d "$d" ] || return 1
  ls -1 "$d" 2>/dev/null | grep -qxF -- "$b"
}

# What the file is really called, for the fix hint.
actual_name() {
  local p="$1" d b
  d=$(dirname "$p"); b=$(basename "$p")
  ls -1 "$d" 2>/dev/null | grep -ixF -- "$b" | head -1
}

# Resolve a reference as written in $2 to a repo-relative path.
resolve() {
  local ref="$1" src="$2"
  case "$ref" in
    /*)   printf 'public%s' "$ref" ;;          # Next.js public/ root
    @/*)  printf '%s' "${ref#@/}" ;;           # tsconfig alias -> project root
    ./*|../*) ( cd "$(dirname "$src")" 2>/dev/null && \
                printf '%s' "$(cd "$(dirname "$ref")" 2>/dev/null && pwd)/$(basename "$ref")" ) \
              | sed "s|^$PWD/||" ;;
    *)    printf '%s' "$ref" ;;
  esac
}

grep_tool() { command -v rg >/dev/null && rg "$@" || grep -rEn "$@"; }

say "[INFO] validating image references under $(pwd)"
say ""

# ---- Collect (file, reference) pairs -------------------------------------
# src="..." / src='...' / url(...) / from "...png"
refs=$(
  {
    rg --no-heading --line-number --color never \
       -o -e '(src|href|poster)=["'"'"']([^"'"'"']+\.(png|jpe?g|webp|avif|svg|gif))["'"'"']' \
       -g '!node_modules' -g '!.next' -g '*.{tsx,jsx,ts,js,html,css,scss}' . 2>/dev/null
    rg --no-heading --line-number --color never \
       -o -e 'url\(["'"'"']?([^)"'"'"']+\.(png|jpe?g|webp|avif|svg|gif))["'"'"']?\)' \
       -g '!node_modules' -g '!.next' -g '*.{css,scss,tsx,jsx}' . 2>/dev/null
    rg --no-heading --line-number --color never \
       -o -e 'from ["'"'"']([^"'"'"']+\.(png|jpe?g|webp|avif|svg|gif))["'"'"']' \
       -g '!node_modules' -g '!.next' -g '*.{tsx,jsx,ts,js}' . 2>/dev/null
  } | sort -u
)

if [ -z "$refs" ]; then
  say "[OK] no image references found in source"
  exit 0
fi

while IFS= read -r line; do
  [ -z "$line" ] && continue
  srcfile=${line%%:*}
  rest=${line#*:}
  lineno=${rest%%:*}
  frag=${rest#*:}

  # Pull the quoted/parenthesised path out of the matched fragment.
  ref=$(printf '%s' "$frag" | sed -E 's/.*[("'"'"'=]([^)"'"'"']+\.(png|jpe?g|webp|avif|svg|gif)).*/\1/')
  [ -z "$ref" ] && continue

  # Skip what cannot or should not be resolved statically.
  case "$ref" in
    http://*|https://*|//*|data:*) continue ;;
    *'${'*|*'{'*) continue ;;
  esac

  target=$(resolve "$ref" "$srcfile")
  checked=$((checked + 1))

  if exact_exists "$target"; then
    if printf '%s' "$target" | grep -qE "$RASTER_RE"; then
      raster=$((raster + 1))
      say "[WARN] raster format         $ref"
      say "         ${srcfile#./}:$lineno — convert to .avif or .webp (perf standard)"
    fi
  elif [ -e "$target" ]; then
    real=$(actual_name "$target")
    casebad=$((casebad + 1))
    say "[ERROR] case mismatch         $ref"
    say "         ${srcfile#./}:$lineno — on disk it is '$real'"
    say "         works on macOS, 404s on Linux/Vercel"
  else
    missing=$((missing + 1))
    say "[ERROR] missing file          $ref"
    say "         ${srcfile#./}:$lineno — resolved to '$target', which does not exist"
  fi
done <<< "$refs"

say ""
say "[INFO] $checked reference(s) checked"

if [ $((missing + casebad)) -gt 0 ]; then
  say "[ERROR] $missing missing, $casebad case mismatch(es), $raster unoptimized"
  exit 1
fi

if [ "$raster" -gt 0 ]; then
  say "[WARN] all references resolve; $raster raster image(s) should be AVIF/WebP"
  exit 0
fi

say "[OK] all $checked image reference(s) resolve with exact case"
exit 0
