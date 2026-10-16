#!/bin/sh
# SPDX-License-Identifier: MIT
# Fetch the open-access publications the Tian-Shan database cites (the "download"
# field of corpus/tianshan/db/sources.json) into corpus/tianshan/raw/<source id>/,
# each into its own directory, and extract the images embedded in each PDF with
# pdfimages (poppler-utils), ready to transcribe from. The files belong to their
# authors and publishers: raw/ is git-ignored, and nothing in it is committed.
# Polite: one request every two seconds; a file already fetched is not fetched again.
# Usage: sh corpus/scripts/tianshan/fetch.sh [source id ...]
set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"
DB="$HERE/../../tianshan/db/sources.json"
OUT="$HERE/../../tianshan/raw"
mkdir -p "$OUT"

node -e '
  const { sources } = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  const only = process.argv.slice(2);
  for (const s of sources) if (s.download && (!only.length || only.includes(s.id))) console.log(s.id, s.download);
' "$DB" "$@" | while read -r id url; do
  d="$OUT/$id"
  mkdir -p "$d"
  if [ ! -s "$d/source.pdf" ]; then
    sleep 2
    if ! curl -sSfL --max-time 120 -A "qylym-corpus/0.1 (salam@qylym.com)" -o "$d/source.pdf" "$url"; then
      echo "failed: $id $url" >&2
      rm -f "$d/source.pdf"
      continue
    fi
  fi
  if ! head -c 5 "$d/source.pdf" | grep -q '%PDF'; then
    echo "not a PDF (a landing page?): $id $url" >&2
    continue
  fi
  if command -v pdfimages >/dev/null 2>&1; then
    mkdir -p "$d/images"
    pdfimages -png "$d/source.pdf" "$d/images/img"
    echo "fetched $id: $(ls "$d/images" | wc -l) images"
  else
    echo "fetched $id (install poppler-utils for pdfimages to extract the images)"
  fi
done
