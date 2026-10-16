#!/bin/sh
# SPDX-License-Identifier: MIT
# Fetches UD Kyrgyz-KTMU (CC BY-SA 4.0), release r2.18, into data/ at the repository
# root, which git ignores. `npm run rune-metrics` computes the figures of
# docs/jany-enesai/JANY-ENESAI.md from it. Never commit it.
set -eu
ROOT=$(cd "$(dirname "$0")/../../.." && pwd)
DEST="$ROOT/data/UD_Kyrgyz-KTMU"
TAG=r2.18
COMMIT=7427f47f8d5b44156cc2a657bf6e3c8f002693f9
if [ ! -d "$DEST/.git" ]; then
  mkdir -p "$ROOT/data"
  git -c advice.detachedHead=false clone --quiet --depth 1 --branch "$TAG" https://github.com/UniversalDependencies/UD_Kyrgyz-KTMU "$DEST"
fi
# The figures are pinned to one release; another one would change them silently.
actual=$(git -C "$DEST" rev-parse HEAD)
if [ "$actual" != "$COMMIT" ]; then
  echo "data/UD_Kyrgyz-KTMU is at $actual, not $TAG ($COMMIT). Remove it and run this again." >&2
  exit 1
fi
echo "UD Kyrgyz-KTMU $TAG in $DEST"
