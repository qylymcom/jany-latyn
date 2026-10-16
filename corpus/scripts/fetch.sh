#!/bin/sh
# SPDX-License-Identifier: MIT
# Fetch the Enisei Kyrgyz inscription pages of A Database of Turkic Runiform
# Inscriptions (Uppsala University, CC BY-NC-SA 4.0) into corpus/raw/.
# For each page: the wikitext (source of truth), the rendered HTML, and the
# file info (full-size URL) of every image it uses. Polite: one request a second.
set -eu
BASE="https://www.runiform.lingfil.uu.se/w"
OUT="$(cd "$(dirname "$0")/.." && pwd)/raw"
mkdir -p "$OUT"
fetch() { sleep 1; curl -sSf -A "qylym-corpus/0.1 (salam@qylym.com)" "$@"; }

for page in "Uyuk Tarlak" "Uyuk Arzhan" "Uyuk Turan" "Ottuk Dash I" "Baryk I" "Baryk II" \
  "Baryk III" "Baryk IV" "Kara Sug" "Elegest I" "Begre" "Aldy Bel I" "Uibat I" "Uibat II" \
  "Uibat III" "Uibat IV" "Uibat V" "Elegest II" "Aldy Bel II" "Uibat VII" "Uibat VI" "Uibat VIII" \
  "Glyphs" "Allographs" "Glyphs by phonemic value" "List of all inscriptions"; do
  t=$(printf %s "$page" | sed 's/ /_/g')
  d="$OUT/$t"; mkdir -p "$d"
  fetch -o "$d/page.wiki" "$BASE/index.php?title=$t&action=raw"
  fetch -o "$d/page.json" "$BASE/api.php?action=parse&page=$t&prop=text|images&format=json"
  echo "fetched $page"
done
