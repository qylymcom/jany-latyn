<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
# Tian-Shan inscription database

A database of the runiform inscriptions of the Tian Shan in Kyrgyzstan, built in the manner of Uppsala University's *A Database of Turkic Runiform Inscriptions*, which covers the Orkhon, Yenisei and Altai corpora but not these. It holds a catalogue of the inscriptions, their find sites on a map, the sources, the sign system (graphemes, glyphs and phonemes) and, inscription by inscription, transcriptions of the signs read off published tracings and photographs. The testbed shows it at `/runic/tianshan/`; `TIANSHAN-CORPUS.md` is the same material as one generated document.

The inscriptions are those of the Talas valley (river boulders with epitaphs, most of them from Ayrtam-Ay near Talas, and rock inscriptions in the gorges of the Talas Ala-Too), the Kochkor valley (rock and boulder inscriptions found from 1998 on) and the Issyk-Kul basin (the Chiyin-Tash rock inscriptions), with single finds elsewhere. Useev counts 51 (`useev-tees`), and the International Turkic Academy's catalogue 59 (`turkic-academy-catalogue`). The sources link the inscriptions to the Türgesh period of the 8th century and describe their signs as close to the Yenisei Kyrgyz ones; none of the sources here calls them Kyrgyz, so the database names them by place.

## Status

**Catalogue stage.** 26 inscriptions are recorded from 49 sources. None is transcribed yet.

The database was started where the publications themselves could not be fetched: the hosts of the open-access PDFs and of the existing online catalogues (bitig.kz, DergiPark, CyberLeninka, the journals' sites) were out of reach of the network the work was done on. Every statement in the catalogue therefore rests on a web-search summary of the page it cites, and says so (evidence *summary*). The statements are kept as the summaries gave them, with their sources, until someone checks them against the page or the publication and raises their evidence. Where two sources disagree, both statements stay.

The research brief the database started from is kept as a source of its own (`brief-2026`), and its statements as *leads* (`db/leads.json`). Several did not hold up: the 2019 survey of the Kyrgyzstan inscriptions is Nurdin Useev's chapter, not a work by its three editors; the second Chiyin-Tash find is dated 2009 by its first publication and 2008 by a later one; no source here numbers the Talas stones beyond XIII.

## How it is built

1. **Sources.** `db/sources.json` lists every work cited, with how it can be reached (`access`) and how far it has been read (`consulted`). Those with an open-access PDF carry a `download` address.
2. **Images.** `npm run fetch:tianshan` downloads those PDFs into `raw/` (git-ignored), one directory per source, and extracts their embedded images with `pdfimages`. The images stay there: open access is not an open licence, so they are cited, never copied into the repository.
3. **Transcription.** An inscription is transcribed sign by sign from a tracing or photograph into `transcriptions/<id>.txt`, citing the image it was read from. The format is in `transcriptions/README.md`. Each sign is a glyph of `db/signs.json`; a shape Unicode lacks is added there as a variant first.
4. **Build.** `npm run build:tianshan` checks the whole database (every id resolves, every statement has a source, every coordinate is in Kyrgyzstan, every transcription parses), regenerates `TIANSHAN-CORPUS.md` with the runes and the reader's output for every line, and recomputes the attested forms.
5. **Check.** `npm run test:corpus` fails if the database does not check or if anything generated from it is out of date.

## The engine's Eski-Teŋir-Too

The engine's Eski-Teŋir-Too preset (`docs/jany-enesai/RUNES-SPEC.md` §6.4) writes modern Kyrgyz the way these inscriptions write, as Eski-Enesai does for the Yenisei stones: for each letter, the Unicode form the transcribed inscriptions use most. The build writes those forms to `packages/engine/src/runes/tianshanForms.ts`, facts only, with no transcription text. A letter that no transcribed inscription has yet is written in its Yenisei form, so until the first transcription Eski-Teŋir-Too writes exactly what Eski-Enesai writes. The playground shows beside it how many inscriptions its forms come from.

## Files

| Path | What it holds |
| :--- | :--- |
| `db/inscriptions.json` | One record per inscription: region, site, object, and every statement about it with its sources |
| `db/places.json` | Regions and find sites, with coordinates of the nearest named settlement and an uncertainty radius |
| `db/sources.json` | The bibliography |
| `db/counts.json` | How many inscriptions each source reports, and what it counts |
| `db/leads.json` | Statements not yet confirmed, and what would settle them |
| `db/signs.json` | Graphemes and their glyphs, every Unicode Old Turkic character among them |
| `db/phonemes.json` | The phonemes the graphemes write |
| `transcriptions/` | One transcription per inscription (none yet) |
| `TIANSHAN-CORPUS.md` | Generated: the whole database as one document |

The scripts are in `corpus/scripts/tianshan/`: `db.mjs` (loading, checking, parsing, counting; shared with the testbed), `build.mjs`, `markdown.mjs`, `fetch.sh` and `tianshan.test.mjs`.

## Licence

The database is de-novo work, and is licensed under the PolyForm Noncommercial License 1.0.0, like the testbed (`LICENSE`): any noncommercial use, including research and teaching, with the notice kept. It quotes no other database and copies no image; publications are cited by reference. The scripts in `corpus/scripts/tianshan/` are MIT-licensed. Place coordinates are those of settlements, as the cited gazetteer pages give them; the testbed's basemap is Natural Earth (public domain).
