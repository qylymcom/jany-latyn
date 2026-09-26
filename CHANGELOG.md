<!-- SPDX-License-Identifier: CC-BY-4.0 -->
# Changelog

Versions are numbered and changes are logged (whitepaper §24). Each entry
records what a reader of the previous version would find different, so that a
citation of one version can be checked against another.

Release versions are calendar-based (`YYYY.N`). They are not the version of the
orthography itself, which is stated in the whitepaper header and changes only
when a Jany-Latyn mapping does. The releases so far leave the orthography at
version 1.

## 2026.4 — 2026-09-25

### Document

- **The whitepaper is reorganized into four parts, and every section is
  renumbered.** Part I (§1–§7) states the proposal in brief: the problem,
  the alphabet at a glance, the design principles, the letters that shape
  the rest, what the orthography gives and costs, how it compares, and the
  testbed. Part II (§8–§20) argues each letter, Part III (§21–§22) gives
  the context, and Part IV (§23–§25) the open questions and governance.
  The `e` system, folding, the collation tailoring, and the engine move to
  Appendices A–D. No mapping, rule, or collation order changes. A citation
  of 2026.3 should be re-checked against this map:

  | 2026.3 | 2026.4 |
  | :--- | :--- |
  | §1 | §1; its opening paragraph now opens Part III |
  | §2.1, §2.2, §2.3 | §1.1, About this document, §5.2 |
  | §3 | §3 |
  | §4 (vowel table), §4.1, §4.2 | §15, §12.1, §12.2 |
  | §4.3, §4.4 | §15.1, §10 |
  | §5 (consonant table) | §2 |
  | §5.1, §5.2, §5.3, §5.4 | §11, §13, §14, §16 |
  | §6, §7 | §8, §9 |
  | §8.1–§8.5 | §21.1–§21.5; the `j`/`c` argument of §8.2 is in §11 |
  | §9, §9.1, §9.2 | §18, §18.1, §18.2 |
  | §9.3, §9.4 | Appendix A, Appendix B |
  | §9.5 | §17.1–§17.3; the CTA letter count and "The same words in each" are in §21.2 |
  | §9.6 | §17.4, and Appendix C for the ICU rules |
  | §10 | §19 |
  | §11.1, §11.2, §11.3, §11.4 | §7, §20, Appendix D, §24 |
  | §12.1–§12.5 | §22.1–§22.5; the "26 of 31" accounting is in §21.2 |
  | §12.6, §12.7 | §1.2, §22.6 |
  | §13.1–§13.6 | §23.1–§23.6 |
  | §14 | §25 |

- **The terminology changes with it.** "Jany-Latyn" names the proposed
  alphabet and replaces "canonical" in the whitepaper, SPEC.md, and the
  testbed. The two registers are the full form and the plain form,
  formerly the formal and casual registers. Every other configuration is a
  comparison setting, and three recur by name: q+ğ, q+ğ+ı, which writes
  the glide `y`, and CTA-aligned (q+ğ+ı+c+ñ). "CTA" alone means only the
  34-letter Baku alphabet.
- §2 opens with the 28-letter alphabet and a chart of the twenty-two
  Cyrillic letters that need comment, each with its plain form and an
  example. §6 defines the comparison settings and writes *аңкыгый жигит*
  in each. §17.3 gives the alphabets in case pairs and drops the row for
  `q` without `ğ`.
- A pass states each argument once, in the section that owns it. §20
  argues `x` as weak a case as `w`, since [h] and [x] vary by speaker and
  region rather than telling words apart, and names `ä` the strongest of
  the three. The letter accounting against the CTA moves to §21.2 and
  states the total: 26 of its letters, plus `ŋ` and `í`, make 28. §22.5 is
  reorganized and softened, and §23.2 is rewritten around what can be
  tested now.
- §7 describes the new coupling (see Testbed) and lists the х toggle, and
  §24 describes the hosted testbed's consent-gated analytics.
- SPEC.md follows the new terms and section numbers. §1 is retitled
  "Mapping", `ñ` moves to the comparison settings in the §9 inventory, and
  the §7 footnotes describe the new coupling.

### Testbed

- **Selecting `ı` for `ы` now also switches the glide to `y`,** so one
  click gives the q+ğ+ı setting (*aŋqığıy*) rather than *aŋqığıí*, and
  switching back to `y` restores `k`, `g`, and `í`. The couplings remain
  seeds: `ı` with `k`, `q` without `ğ`, and `ı` with the `í` glide can
  still be set afterwards. The `y` glide is still offered only while `ы` is
  `ı`, and `ы` can now be switched back to `y` while the glide is `y`,
  which the testbed used to block.
- The CTA preset is renamed CTA-aligned, translated in each interface
  language, and its description now includes `ñ` for `ң`. The vote dialog and the
  analytics record it as `CTA-aligned`, formerly `CTA Standard`.
- An h / x row for х, with a note on the [h]/[x] variation. The vote
  dialog and the analytics record the choice.
- The alphabet page opens with the 28 letters, capital over lowercase over
  the broad IPA value, with [q], [ʁ], and [h] under `k`, `g`, and `h`.
  Example words carry glosses in the interface language.
- Simplified Chinese joins the interface languages.
- The About page gains a Privacy section. On the hosted site only, a
  consent banner asks before any analytics are captured, and declining
  stores nothing on the device.
- The Kyrgyz address to the 81st UN General Assembly is added as a sample
  text.
- A tab opened before a deploy now reloads instead of stalling on missing
  script chunks.

### Engine

- `velarFricative: 'h' | 'x'` writes every х as `x` in `'x'` mode, for
  readers who take the velar value to be the better one, and `x` then
  sorts right after `h`. `'h'` is the default. It is a one-letter mapping
  from Cyrillic, not the §20 compose-mode split.
- `resolveYGraphemeChange` seeds the `y` glide along with `q` and `ğ`, and
  `resolveGlideGraphemeChange` returns the state unchanged when asked for
  the `y` glide while `ы` is `y`, where it used to force `ı`.
- The whitepaper conformance checker reads the reorganized document: the
  new setting labels, the plain-form rows, the §2 chart, the §6 settings
  table, and the Jany-Latyn column of the romanization tables. It now runs
  208 checks.
- No conversion behavior changes for existing options: with
  `velarFricative` at its default, `cyrToJany`, `janyToCyr`,
  `janyToFallback`, and `foldKey` give the same output as in 2026.3.

## 2026.3 — 2026-09-21

### Document

- **§12 is rewritten around a second comparison, and its subsections are
  renumbered.** The section previously argued the cost of a shared Turkic
  standard against Turkish alone. It now runs the argument against Kazakh
  as well, on the ground that the two languages share a script today and
  Kyrgyz Cyrillic is a proper subset of Kazakh's, so Kyrgyz is marked only
  by what it does not write. A citation of 2026.2 should be re-checked:
  **§12.2 is now §12.6** (what Jany-Latyn is and is not asking for) and
  **§12.3 is now §12.7** (costs and constraints). §12.1 keeps its place
  under a shorter title.
- Four subsections are new: what a shared Turkic standard costs a smaller
  language (§12.2), related languages and shared letters (§12.3),
  familiarity and adoption (§12.4), and the case for convergence (§12.5).
  §12.5 sets out the letter-by-letter accounting against the CTA: 26 of
  the 31 letters Kyrgyz has use for, four declined with an argument each,
  `ñ`→`ŋ` as a substitution, and `í` as the one letter the CTA lacks.
- References 20–28 are added to support the new material: Kloss on
  Abstand and Ausbau, Sebba on orthography as a social object, the
  Ukrainian, Belarusian, Galician and Scots precedents, Johanson and Csató
  on comparative Turkic, Cahill and Rice on reader acceptance, and the
  UNESCO vitality factors.
- §12.3 no longer classifies Kyrgyz and Kazakh as an Ausbau pair, which
  overstated what the kinship supports, and states the difference as one
  of degree instead.
- §12.2 drops an uncited claim about relative web-corpus size, and the
  observations it does keep are now attributed and dated rather than
  asserted: the `qılım` example names Google and September 2026, and a
  speech-synthesis observation naming Suno V6-mini is added.
- §13.2 is rebuilt around what can be tested before Kazakh's own
  transition completes. Latin Kazakh does not yet exist in quantity, so
  the collision census and the identifier tests reach only the Turkish
  half of the claim. A fourth test is added — a black-box probe of
  deployed systems, marked the weakest evidence in the document — and the
  refutation clause now states that the Kazakh prediction has no matching
  condition yet.
- §9.2 records where the loan-restoration list stops (*Асхат* → `Ashat` →
  *Ашат*), §9.5 names the two movements that fall outside the side-by-side
  table, and §13.6 settles hyphenated-name capitalization: each part
  between hyphens takes its own case. SPEC §9.1 widens the legacy `sh` row
  from one example to the с+х class.
- The whitepaper's citation line carries the concept DOI, which resolves
  to the latest release, in place of the 2026.1 record it named before.
- §6 gains the place-name argument for unified `k`: *Каракол* and
  *Каракөл* are different towns, one letter apart as `Karakol` and
  `Karaköl` and two apart as `Qaraqol` and `Qaraköl`. §7 gains *Ысык-Көл*
  as an illustration of the dotted capital that needs no all-caps example,
  written `Isıq-Köl` under the dotless configuration. Both are entries in
  the new place-name sample.
- §5.3 records Turkmen's path to `ň` through `ꞑ`, `ñ` and `ng`, and §4.3
  and §4.4 gain citations for the origin of Kyrgyz long vowels and for the
  Turkmen glide. Johanson and Csató, Sebba, and Cahill and Rice move out
  of Further Reading into numbered references, since the argument now
  cites them directly.
- §4 and §6 no longer label the harmony classes *жумшак* and *катуу*. The
  classes are named in English only, and a reader of 2026.2 will find the
  Kyrgyz terms gone from the vowel paragraph and from the §6 table.

### Testbed

- A list view for samples that are one entry per line. It sorts each line
  by collation instead of running it as prose, showing the Cyrillic source
  in native alphabet order beside the Latin result in §9.6 order, and
  selects itself when a list sample is picked. Four such samples are added:
  place names, first names, street names, and notices.
- An all-caps toggle renders both columns uppercase, which is where the §7
  casing argument and the §13.6 multi-character grapheme rules are visible
  on real entries.
- The virtual keyboard reports its height so the page reserves room beneath
  the overlay rather than letting it cover the list.

### Engine

- `compareCyrillic(a, b)` sorts Kyrgyz Cyrillic in native alphabet order
  (SPEC §6). Unlike `compare` it takes no options, since the Cyrillic order
  is fixed by the alphabet. `compare` and `compareCyrillic` now share one
  body, resolving case through the explicit table in `casing.ts`.
- The `./casing` subpath is exported, so the web app can reach `upperStr`
  and `caseModeFor` without a locale case function.
- No conversion behavior changes: `cyrToJany`, `janyToCyr`,
  `janyToFallback`, and `foldKey` are untouched.

## 2026.2 — 2026-09-20

### Orthography

- **§6 states a position on `ğ` where it previously deferred one.** The
  section had left the voiced counterpart of `q` as an open question and
  pointed at §13.6, while §9.5 and §11.1 already described a `ğ` the testbed
  had shipped. It now argues the case: the loanword lexicon dependency that
  governs `q` governs `ğ` at the same strength, and what separates the two
  letters is which layer each one taxes rather than how derivable either is.
  Neither is cheap enough to license writing one without the other, so **a
  standard that adopts `q` adopts `ğ` with it**. The canonical orthography
  continues to decline both letters, so nothing in canonical output changes.

### Document

- §9.4 states how `q` and `ğ` behave under search folding, which no section
  previously did: `ğ` strips to `g` for free under NFD, while `q` folds to
  itself and splits an index against `k`.
- §13.6 drops the settled question of whether `q` mode should derive `ğ` and
  gains the one that the §9.4 addition exposes: whether `foldKey` should fold
  `q` to `k`, merging a distinction the `q` configuration writes on purpose.
- §9.5 renames the `q` comparison column to `q and ğ` and relabels the
  29-letter alphabet row as the asymmetric configuration §6 rejects. The
  sample cells in that column and in the dotless row are regenerated; all of
  them are gated by the conformance checker.
- §11.1's option table listed six of the nine toggles the playground offers.
  It gains the uvular fricative, the `ж` affricate (§8.2), and the loan-sign
  mode (§5.4), and the couplings paragraph goes from two to three.
- The whitepaper's §9.5 is split into alphabet order (§9.5) and collation
  (§9.6), the abstract is lifted out of §1, and the §12–13 headings are
  rewritten.

### Testbed

- Selecting allophonic `q` now enables `ğ`, and reverting to unified `k`
  takes it back off, the same affordance by which dotless `ı` already enabled
  `q`. Selecting `ı` therefore carries both letters. Each coupling only seeds
  the option, so the asymmetric configurations remain reachable by setting the
  option afterwards, and the engine imposes none of it: every combination is
  still a valid call.
- The whitepaper's reading font is selectable from the sticky header and the
  choice survives navigation. The playground's font control moves to the same
  component.
- The standard preset is named after the orthography rather than the site, and
  the CTA preset writes `ñ`, without which it did not match the CTA row of
  whitepaper §9.5.

### Engine

- `testbedPresets` exports `resolveUvularKChange` and `TestbedOptionState`
  gains `uvularG`. No conversion behavior changes: `cyrToJany`, `janyToCyr`,
  `janyToFallback`, `foldKey`, and `compare` are untouched.

## 2026.1 — 2026-09-19

First public release: the orthography proposal (`docs/WHITEPAPER.md`), the
formal specification (`docs/SPEC.md`), the dependency-free conversion engine
and CLI, the macOS and Linux keyboard layouts, and the web testbed.
