<!-- SPDX-License-Identifier: CC-BY-4.0 -->
# Changelog

Versions are numbered and changes are logged (whitepaper §11.4). Each entry
records what a reader of the previous version would find different, so that a
citation of one version can be checked against another.

Release versions are calendar-based (`YYYY.N`). They are not the version of the
orthography itself, which is stated in the whitepaper header and changes only
when a canonical mapping does. The releases so far leave the canonical
orthography at version 1.

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
