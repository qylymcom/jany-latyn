# Licensing

This repository is one project under four different grants. Each directory
carries its own `LICENSE`, and the grant that applies to a file is the one in
the nearest enclosing directory.

| Part | Path | Grant | In short |
| :--- | :--- | :--- | :--- |
| Conversion engine and CLI | `packages/engine/` | MIT | Do what you like, including commercially. Keep the copyright notice. The specification and whitepaper are not part of this grant; they live in `docs/`. |
| Testbed web application | `apps/web/` | PolyForm Noncommercial 1.0.0 | Any noncommercial use, including running it in a classroom and modifying it. No commercial use or commercial hosting. |
| Whitepaper and specification | `docs/` | CC BY 4.0 | Share and adapt, with attribution. |
| Yenisei Kyrgyz inscription corpus | `corpus/` | CC BY-NC-SA 4.0 | Adapted from *A Database of Turkic Runiform Inscriptions* (Uppsala University), whose license it inherits: share and adapt for noncommercial purposes, with attribution, under the same license. |
| Tian-Shan inscription database | `corpus/tianshan/` | PolyForm Noncommercial 1.0.0 | De-novo work, licensed like the testbed: the catalogue, the sign tables and the transcriptions. It cites publications and copies none of their text or images. |
| Corpus scripts | `corpus/scripts/` | MIT | The scripts that fetch, encode, and check the corpora, the Tian-Shan ones in `corpus/scripts/tianshan/`. They contain no database material. |

The orthography itself — the letters, the mappings, and the rules — is not
owned by anyone and is not covered by any of these grants. Ideas are not
copyrightable. Anyone is free to implement the system, disagree with it, or
build a different one from it. That is the point of publishing it.

The project name and logo are not licensed by any of the above. See
`TRADEMARK.md`.

**Generated facts in the engine.** `packages/engine/src/runes/tianshanForms.ts`
lists, for each letter, the Unicode form the transcribed Tian-Shan inscriptions use
most. It is generated from the Tian-Shan database and is MIT like the rest of the
engine: it holds facts, not transcription text.

**Basemap.** The Tian-Shan database's map (`apps/web/src/lib/tianshan/basemap.ts`)
is drawn from Natural Earth, which is in the public domain.

**Bundled font.** `apps/web/static/fonts/` holds Noto Sans Old Turkic, © The Noto
Project Authors, under the SIL Open Font License 1.1 (`apps/web/static/fonts/OFL.txt`).
It is used unmodified to display runes in the testbed.

## What this means in practice

**A linguist, educator, or journalist** may quote the whitepaper with
attribution, reproduce the tables, and use the engine for any purpose at all.

**A classroom or lab** may deploy the web testbed internally, modify it, and
use it for teaching and research. No permission or payment is needed.

**A developer** may embed the engine in any product, commercial or not.

**A company** may embed the engine, but may not host the testbed application
commercially. Ask if you want to; the answer may well be yes.

**Anyone** may build a different Latin orthography for Kyrgyz, including one
derived from this one, and is asked only not to call it by this project's name.

## Citing

See `CITATION.cff`, which GitHub reads to produce a "Cite this repository"
button, and the citation block in the whitepaper.
