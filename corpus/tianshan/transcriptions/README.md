<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
# Transcriptions

One file per inscription, named by its id in `../db/inscriptions.json` (`talas-2.txt`). A transcription records the signs as they stand on the stone, read off a published tracing, photograph or squeeze, one sign at a time. It records shapes, not a reading: the published readings and translations stay in the publications.

Nothing is transcribed yet. The open-access publications that `corpus/scripts/tianshan/fetch.sh` downloads (with their images extracted into `../raw/`, which git ignores) are where to start; `../db/sources.json` says which inscriptions each publication is about.

## Format

```text
# Comments start with #.
@image <source id> <where in it>    # the tracing or photograph read; repeat for each one used
@read-from tracing                  # tracing, photograph, squeeze, or publication (a printed transliteration)
@direction rtl                      # the carver's line direction: rtl (default) or ltr
@by <name>                          # who transcribed it
@date 2026-10-20

1: <signs>
2: <signs>
left 1: <signs>                     # any label before the colon: a line number, a face and a line
```

Signs are separated by spaces and given right to left in reading order:

| Token | Meaning |
| :--- | :--- |
| `b1.2` | the glyph with this id in `../db/signs.json` (here 𐰊 YENISEI AB, back b) |
| `b1` | a grapheme whose shape the source does not show; written with its first glyph and left out of the form counts |
| `…?` | suffix: the sign is only partly legible (`n1.1?`) |
| `~…` | prefix: the sign is drawn mirrored (`~d1.1`); it is still that letter |
| `:` | the two-dot word divider ⁚ |
| `.` or `·` | the one-dot divider ⸱ |
| `...` or `…` | an illegible stretch |
| `_` | a space the source shows with no divider |

A shape that no glyph in `signs.json` matches is added there first, as a new glyph of its grapheme with `"unicode": null`, the `nearest` character it is written with, and a `description` of the shape.

After editing, run `npm run build:tianshan`: it checks the database, regenerates `../TIANSHAN-CORPUS.md` with the runes and the reader's output for every line, and recomputes the forms table of the engine's Eski-Teŋir-Too preset (`packages/engine/src/runes/tianshanForms.ts`). Then run `npm run test:corpus` and `npm test`.

## Licence

The transcriptions are de-novo work under the PolyForm Noncommercial License 1.0.0 (`../LICENSE`).
