# Orhon-Enesaí: Implementation Brief

**Work order for a coding agent: add the Orhon-Enesaí runic mode to the Jany-Latyn engine, the testbed playground, and the keyboard layouts.**

**Companion to:** `docs/ORHON-ENESAI.md`, the design proposal ("the proposal" below). The proposal decides *what*; this brief decides *how* and *in what order*. Where they disagree, the proposal wins: stop and report the disagreement rather than resolving it yourself.
**Status:** Superseded. It was written for draft 0.1 (one sign for о and у, with a positional guess table), which `JANY-ENESAI.md` draft 0.3 and `RUNES-SPEC.md` replace. Its engineering rules (code points, bidi, fonts, the one-table keyboard generator, the property tests) still apply where the new documents do not override them; the о/у table, `OGuess`, and the о/у flipping do not.
**Reference kit (`orhon-enesai-reference.zip`):** a working TypeScript prototype of the rune stage, golden fixtures, the sign inventory, and the keyboard table. Everything in this brief has been run against that prototype.

---

## Kickoff prompt

Paste this to the agent, with the two documents and the reference kit in the repository:

> Read `docs/ORHON-ENESAI.md` (the design) and `docs/ORHON-ENESAI-AGENT-BRIEF.md` (this work order), then the files listed in §2 of the brief. Before changing anything, post a short plan naming the real paths you found for each component in §4–§6, and any place where the repository differs from what the brief assumes. Then implement milestone M1 (§9) and stop for review. Do not change any existing Jany-Latyn output. Do not make any of the decisions listed in §10; ask instead.

---

## 1. Goal and definition of done

A reader opens the testbed, pastes Kyrgyz Cyrillic, and sees it in Old Turkic runes beside the Latin, can switch between the three presets and the eight options, can hover any rune to see why it was chosen, can paste runes and get Cyrillic back with every uncertain `о`/`у` marked and flippable, and can type runes directly on an on-screen keyboard or with an installed macOS or Linux layout.

Done means:

- The engine exposes forward and reverse rune conversion, explanation, comparison, and folding, with no runtime dependencies (`WHITEPAPER.md` Appendix D).
- Every case in `orhon-enesai.golden.json` passes in all three presets.
- The property tests in §7 pass over the corpus.
- The playground has the output pane, options, inspector, reverse input, and on-screen keyboard (§5, §6).
- `orhon-enesai.keylayout` and `orhon.xkb` exist, generated from one table, and pass the checks in §7.
- Every existing test passes unchanged, and no existing Jany-Latyn output changes by a single character.
- The docs in §8 are updated, and the PR description reports the metrics of §7.4.

## 2. Read first, in this order

Paths are taken from `WHITEPAPER.md` Appendix D. Confirm each one; if one has moved, use the real path and note it in your plan.

1. `docs/SPEC.md`, especially section 2 rule 4 and section 4.3 (the `e` system), section 5 (folding), and section 7 (testbed couplings).
2. `packages/engine/src/convert.ts`. Find the public entry point, the type of the options object, and how the *canonical* Jany-Latyn configuration (every option at its default) is expressed. The rune stage must call exactly that configuration.
3. `packages/engine/src/testbedPresets.ts`, for how presets and couplings are declared.
4. `packages/engine/src/collate.ts`, for the rank-table `compare` you will mirror.
5. `packages/engine/keymaps/jany-latyn.keylayout` and `packages/engine/keymaps/jany.xkb`, for how the existing layouts are written and how they encode non-ASCII output.
6. The playground app. Appendix D does not name its path: locate the client that renders the testbed, its option panel, the side-by-side inspector, the consent-gated telemetry, and how fonts are loaded.
7. `docs/ORHON-ENESAI.md` §4, §14–§19, and Appendix B.
8. The reference kit: `orhonEnesai.ts` first, then `oTable.ts`, `keyboardLayout.ts`, and `chartReading.ts`.

## 3. Invariants

These hold in every commit. A change that needs to break one is a question for the maintainer, not a judgment call.

1. **The rune stage reads only canonical Jany-Latyn.** Forward conversion is `toRunes(cyrillicToJanyLatyn(text, CANONICAL), runeOptions)`. It never reads the reader's Latin display options. A reader in `q` mode, dotless-`ı` mode, or digraph mode sees exactly the runes a reader in Jany-Latyn mode sees.
2. **No word list in the forward direction, and none in the reverse in this version.** The `о`/`у` table (Appendix B of the proposal) is positional data, not a lexicon. Do not add a lexicon to improve the reverse figures, even an optional one (§10).
3. **No existing output changes.** Jany-Latyn, its plain form, its reverse conversion, folding, and collation are untouched. If you need a hook in `convert.ts`, add it without altering behavior, and prove it with the existing snapshot tests.
4. **Code points, never code units.** Every rune is a surrogate pair in UTF-16. Iterate with `for…of` or `Array.from`; put the `u` flag on every regex that can see runes; never `slice`, `substring`, index, or measure `.length` on rune text to mean "letters". §7.2 tests this.
5. **Only documented signs are emitted.** For each option set, the emitted signs are exactly those derivable from the tables in `orhonEnesai.ts`. The engine never emits 𐰁 (U+10C01), 𐰪 (U+10C2A), or 𐱈 (U+10C48). They exist only on the keyboard.
6. **The engine stays dependency-free TypeScript.** The font and any UI code belong to the playground, not the engine package.
7. **Licensing stays clean.** The engine is MIT, the playground is under PolyForm Noncommercial, and the docs are CC BY. Noto Sans Old Turkic is SIL OFL 1.1: ship its license with the font and list it in `LICENSING.md`. Do not vendor the UD treebank (CC BY-SA 4.0) into the MIT engine package; fetch it in a script that lives outside the package (§7.3).

## 4. Engine

### 4.1 Module layout

Port the prototype into a module of its own. The names are a suggestion; follow the repository's conventions where they differ.

```
packages/engine/src/runes/
  inventory.ts   the 73 code points as named constants, their Unicode names (for the inspector), chart rows, and fit (from chartReading.ts)
  options.ts     RuneOptions, DEFAULT_RUNE_OPTIONS, RUNE_PRESETS
  governor.ts    governingVowelIndex()
  forward.ts     toRunes(), convertWord(), the epigraphic register
  reverse.ts     fromRunes(), with guess positions
  oTable.ts      the о/у table, unchanged from the kit
  explain.ts     explainRunes(): per-letter explanation for the inspector
  collate.ts     compareRunes()
  fold.ts        runeFoldKey()
  index.ts       public exports
```

### 4.2 Public API

Fit these to the engine's existing naming:

```ts
// Forward: Cyrillic in, runes out. Calls the canonical Jany-Latyn stage internally.
cyrillicToRunes(text: string, opts?: Partial<RuneOptions>): string;
// Forward from Jany-Latyn, for callers that already hold canonical full form.
janyLatynToRunes(jlFull: string, opts?: Partial<RuneOptions>): string;

// Reverse: plene register with chart vowels only. Throws or returns an error result otherwise.
runesToJanyLatyn(runes: string): { text: string; guesses: OGuess[] };
runesToCyrillic(runes: string): { text: string; guesses: OGuess[] };
interface OGuess { start: number; end: number; chosen: "о" | "у"; alternative: "о" | "у"; context: string } // offsets in the OUTPUT string, in code units, for the UI

// Inspector: one entry per Jany-Latyn letter of the input.
explainRunes(text: string, opts?: Partial<RuneOptions>): RuneExplanation[];
interface RuneExplanation {
  cyrillic: string; janyLatyn: string; rune: string | null; // null when dropped (epigraphic) or merged into a ligature
  codePoint: number | null; unicodeName: string | null;
  series: "back" | "front" | "neutral" | null; governorIndex: number | null; // index into the same array
  chartRow: number | null; fit: "follows" | "variant" | "repurposed" | null;
  reason: string; // e.g. "к before о: back series, vowel-bound sign 𐰸 (chart row 21)"
}

compareRunes(a: string, b: string): number;  // §4.5
runeFoldKey(s: string): string;              // §4.6
```

Mapping `explainRunes` back from Jany-Latyn letters to the Cyrillic letters they came from needs the engine's own alignment. If `convert.ts` has no notion of source spans, add one without changing output (invariant 3), or show only the Jany-Latyn letter in the first version and say so in the PR.

### 4.3 Porting notes: where the prototype is not production code

- **`cyrToJL.ts` is a stand-in.** It exists only to test the rune stage without the engine. Do not port it; call the engine. If the engine's canonical output differs from the stand-in on any golden input, stop and report it (§7.1). The stand-in reproduces `WHITEPAPER.md` §2 and §21.2 exactly, so a difference means the engine and the whitepaper disagree.
- **`fromRunes` returns a count; production returns positions.** Record each resolved 𐰆 with its output offsets and the alternative, so the UI can flip it.
- **Pass-through.** The prototype leaves any character outside the Jany-Latyn alphabet untouched. Keep that, and make sure newlines, tabs, and runs of spaces survive the two-dot separator option: only runs of U+0020 *between two rune words* become one U+205A.
- **Case.** The input is lowercased before mapping. Canonical Jany-Latyn never contains `İ` or `ı`, so `toLowerCase()` is safe here, but say so in a comment.
- **Errors.** The prototype throws on an unmapped letter. In production that is unreachable for canonical input; keep it as an assertion that a test can hit.
- **Performance.** The playground converts on every keystroke. The prototype rescans for the previous and next vowel for every consonant, which is fine per word but should not be applied to whole texts at once. Keep the per-word structure, and check that a 50,000-character text converts in well under 100 ms.

### 4.4 Options and presets

Port `RuneOptions` and `PRESETS` from `orhonEnesai.ts` unchanged: eight options, three presets (`orhon-enesai`, `unicode-strict`, `inscription`). As with the Latin testbed, presets only seed options. Two restrictions follow from the proposal:

- Reverse conversion is available only for `register: "plene"` with `vowels: "chart"`. The UI disables the reverse input otherwise, with the reason shown.
- No other couplings. Every combination of the eight options is valid.

### 4.5 Comparison

`compareRunes` sorts by the Jany-Latyn alphabet of what each rune stands for (`collate.ts` order), with 𐰆 at `o`. Ties break at a second level on series (back before front) and at a third on variant (Orkhon before Yenisei). Build it as a rank table pinned against a checked-in expected ordering, like the existing `compare`, because `Intl.Collator` takes no tailoring. Its default order treats the chart's variant pairs as one letter (proposal §7.1). Add the expected-ordering fixture from the golden words.

### 4.6 Folding

`runeFoldKey` maps each rune to its Jany-Latyn letter, 𐰆 to `o`, the ligatures to their pairs, and then applies the existing `foldKey`. Do not change `foldKey` itself. Cross-script search, a Latin or Cyrillic query against rune text, needs `u`→`o` on the query side for that comparison only; implement it in the rune search path, not in the shared key (proposal §13, §20.3).

### 4.7 CLI

Add to `cli.js`:

```
--to orhon-enesai                 forward conversion to runes
--rune-preset <name>              orhon-enesai | unicode-strict | inscription
--rune-opt <key>=<value>          any RuneOptions field; repeatable
--from orhon-enesai               reverse conversion; prints the number of guessed о/у to stderr
```

## 5. Playground

### 5.1 Output

- **Where it goes:** a third output column in the side-by-side view, *Cyrillic · Jany-Latyn · Orhon-Enesaí*, toggled on from the options panel. If the layout has no room for a third column on narrow screens, stack it below the Latin.
- **Element:** `dir="rtl"`, `lang="ky-Orkh"` (a valid BCP 47 tag: Kyrgyz in the Old Turkic script), and `unicode-bidi: isolate`.
- **Font:** bundle Noto Sans Old Turkic as WOFF2 with `font-display: swap`. The font covers only the 73 runes, space, no-break space, and the zero-width joiner. The stack must therefore continue with a font that has U+205A and U+2E30. Check candidates with fontTools before choosing; the choice is a licensing question for the maintainer if it means bundling a second font (§10).
- **Every left-to-right label that embeds runes** goes inside `<bdi>`. Without it, "Kyrgyz: 𐰶𐰃𐰺𐰍𐰃𐰕 (2026)" shows "(2026)" on the wrong side of the word in Chromium.
- **Accessibility:** screen readers cannot voice runes. Give the output `aria-describedby` pointing at the Jany-Latyn column, and give each rune in the inspector an accessible name such as "𐰸, ORKHON OQ, k".

### 5.2 Options panel

Add an "Orhon-Enesaí" group: the three presets as one-click buttons, then the eight options, labelled as in proposal §17. A "Show departures from Unicode" toggle, off by default, outlines repurposed signs (`fit: "repurposed"`) and dots variant pairs (`fit: "variant"`) in the output.

### 5.3 Inspector

Hovering or tapping a rune shows the `RuneExplanation`: the rune large, code point and Unicode name, the Jany-Latyn and Cyrillic letters, the series, a highlight on the governing vowel, the chart row, and the fit. Hovering a vowel highlights the consonants it governs. This is the feature that makes the rule teachable, so do not leave it for later.

### 5.4 Reverse input

- **Detection:** if the input contains Old Turkic letters, offer to convert runes → Cyrillic. Detect with `/\p{Script=Old_Turkic}/u`, never with a code-unit range.
- **Display:** show the Cyrillic and Jany-Latyn with every `guesses` span underlined. Clicking a span flips `о`↔`у` in both and records the choice. The flip is local to the session and is not telemetry.
- **Restriction:** disabled for the epigraphic register and the historical vowels, with the reason shown.

### 5.5 Copy

"Copy runes" copies the logical-order string. "Copy for left-to-right documents" wraps each line in U+2067 … U+2069 (RLI … PDI).

### 5.6 Telemetry

Add the rune options and the selected preset to the configuration record, only behind the existing consent prompt, and only on the hosted instance (`WHITEPAPER.md` §24). Whether these fields may be added at all is the maintainer's call (§10).

## 6. Keyboards

### 6.1 One table, three outputs

`keyboardLayout.ts` is the single source of the layout. Write a generator script that emits all three keyboards from it, and check the generated files in:

1. the on-screen keyboard's data for the playground,
2. `packages/engine/keymaps/orhon-enesai.keylayout` (macOS),
3. `packages/engine/keymaps/orhon.xkb` (Linux).

Never hand-edit a generated file. A test regenerates them and fails on any difference (§7.5).

### 6.2 The layout

The keys sit on the physical positions of the Kyrgyz standard Cyrillic layout (`xkeyboard-config` `symbols/kg`, "basic"), so each rune is under the Cyrillic letter it stands for. Levels: base = back series, vowels, and neutral consonants; Shift = front series, or on vowel keys the vowel-bound sign; AltGr (Option) = ligatures and remaining variants; AltGr+Shift = second variant. Digits, period/comma, and space keep their Kyrgyz values; `я` and `ю` are unassigned, since Jany-Latyn decomposes them. All 73 code points are reachable, and every rune the plene presets emit is on base or Shift. In the table, a rune cell gives the sign and the last two hex digits of its code point, U+10Cxx.

| Key (XKB) | Kyrgyz key | Base | Shift | AltGr | AltGr+Shift |
| :--- | :---: | :---: | :---: | :---: | :---: |
| AE11 | ө | 𐰇 07 | 𐰜 1C | — | — |
| AE12 | ң | 𐰭 2D | 𐰮 2E | 𐰬 2C | 𐰪 2A |
| AD01 | й | 𐰖 16 | 𐰘 18 | 𐰗 17 | 𐰙 19 |
| AD02 | ц | ⁚ U+205A | ⸰ U+2E30 | — | — |
| AD03 | у | 𐰆 06 | 𐱇 47 | — | — |
| AD04 | к | 𐰴 34 | 𐰚 1A | 𐰸 38 | 𐰜 1C |
| AD05 | е | 𐰅 05 | 𐰂 02 | — | — |
| AD06 | н | 𐰣 23 | 𐰤 24 | 𐰧 27 | 𐰥 25 |
| AD07 | г | 𐰍 0D | 𐰏 0F | 𐰎 0E | 𐰐 10 |
| AD08 | ш | 𐱁 41 | 𐱂 42 | 𐰿 3F | 𐱀 40 |
| AD09 | щ | 𐰵 35 | 𐰛 1B | 𐰹 39 | 𐰷 37 |
| AD10 | з | 𐰕 15 | 𐰕 15 | 𐰔 14 | — |
| AD11 | х | 𐰝 1D | 𐰝 1D | — | — |
| AD12 | ъ | 𐰦 26 | 𐰫 2B | — | — |
| AC01 | ф | 𐰟 1F | 𐰟 1F | — | — |
| AC02 | ы | 𐰃 03 | 𐰶 36 | — | — |
| AC03 | в | 𐰊 0A | 𐰊 0A | — | — |
| AC04 | а | 𐰀 00 | 𐰀 00 | 𐰁 01 | — |
| AC05 | п | 𐰯 2F | 𐰯 2F | 𐰰 30 | — |
| AC06 | р | 𐰺 3A | 𐰼 3C | 𐰻 3B | — |
| AC07 | о | 𐰆 06 | 𐰸 38 | — | — |
| AC08 | л | 𐰞 1E | 𐰠 20 | 𐰡 21 | 𐰟 1F |
| AC09 | д | 𐰑 11 | 𐰓 13 | 𐰒 12 | — |
| AC10 | ж | 𐰳 33 | 𐰙 19 | — | — |
| AC11 | э | 𐰅 05 | 𐰅 05 | — | — |
| BKSL | ү | 𐰈 08 | 𐰈 08 | — | — |
| AB01 | я | — | — | — | — |
| AB02 | ч | 𐰲 32 | 𐰱 31 | 𐰩 29 | 𐰨 28 |
| AB03 | с | 𐰽 3D | 𐰾 3E | — | — |
| AB04 | м | 𐰢 22 | 𐰢 22 | — | — |
| AB05 | и | 𐰄 04 | 𐰱 31 | — | — |
| AB06 | т | 𐱄 44 | 𐱅 45 | 𐱇 47 | 𐱃 43 |
| AB07 | ь | 𐱆 46 | 𐱈 48 | — | — |
| AB08 | б | 𐰉 09 | 𐰋 0B | 𐰊 0A | 𐰌 0C |
| AB09 | ю | — | — | — | — |

The last column of the inventory table in proposal Appendix A gives the same data by code point.

### 6.3 macOS `.keylayout`

- Physical keys use macOS virtual key codes. The ANSI codes for the positions above are: AD01–AD12 = 12, 13, 14, 15, 17, 16, 32, 34, 31, 35, 33, 30; AC01–AC11 = 0, 1, 2, 3, 5, 4, 38, 40, 37, 41, 39; BKSL = 42; AB01–AB10 = 6, 7, 8, 9, 11, 45, 46, 43, 47, 44; AE11 = 27; AE12 = 24; TLDE = 50. Confirm them against the existing `jany-latyn.keylayout` rather than trusting this list.
- Caps Lock gives the base layer, since runes are caseless.
- **Supplementary-plane output needs care.** Every rune is outside the BMP, and `.keylayout` output strings are handled as UTF-16 by the system. Check how the existing layout encodes its output, follow the same method, and if the repository has no precedent for non-BMP output, find the documented method (Ukelele's documentation covers it) rather than guessing. This file cannot be verified without a Mac. If you cannot test it, mark it experimental in the README and list it in the PR as needing a manual test by the maintainer.

### 6.4 Linux XKB

- Write it as a symbols file in the style of the existing `jany.xkb`, with `key.type = "FOUR_LEVEL"` and `include "level3(ralt_switch)"`.
- Use Unicode keysyms for the runes, `U10C34` and so on; XKB accepts Unicode keysyms beyond the BMP.
- Validate in CI with `xkbcli compile-keymap` or `xkbcomp` if either can be installed, and document a manual test with `setxkbmap`.

### 6.5 On-screen keyboard

Render the four layers from the generated data, with Shift and AltGr as latching toggles and the Cyrillic key label in a corner of each key. A click inserts at the caret of the rune input. Mark the keys of the current preset's signs and dim the rest, so a learner sees which signs the convention actually uses.

## 7. Tests

### 7.1 Golden fixtures

Port `orhon-enesai.golden.json` into the engine's tests: 44 cases (42 words and phrases and the two `WHITEPAPER.md` passages), each with the canonical Jany-Latyn, the runes in all three presets, and the default reverse result. They must pass as given. If the engine's canonical Jany-Latyn differs from the fixture's `janyLatyn` for any case, **stop and report** the case. Do not edit a fixture to match the engine.

### 7.2 Property tests

Run these over every word of the corpus (§7.3) and over generated strings:

| # | Property |
| :---: | :--- |
| P1 | A pure-Cyrillic word converts to a string matching `^[\p{Script=Old_Turkic}-]+$` (`⁚` between words when that option is on) |
| P2 | The set of emitted code points for each option set is a subset of what the tables allow, and never contains U+10C01, U+10C2A, or U+10C48 |
| P3 | Every two-series consonant's series equals the class of its governing vowel, recomputed independently of `forward.ts` |
| P4 | Plene and chart vowels: `fold(runesToJanyLatyn(janyLatynToRunes(x)))` equals `fold(x)` with `u`→`o`; for every word without `o`/`u`, the round trip is exact |
| P5 | No output contains an unpaired surrogate: test `/[\uD800-\uDBFF](?![\uDC00-\uDFFF])\|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/` on random mixed input |
| P6 | For random Latin testbed option sets, the rune output is identical (invariant 1) |
| P7 | Text with no Kyrgyz letters passes through unchanged |
| P8 | `compareRunes` sorts the golden words in the checked-in expected order, and is a total order: antisymmetric and transitive on random pairs and triples |

### 7.3 Corpus

Use whatever Kyrgyz text the repository already tests with. If there is none, add a script outside the engine package, for example `scripts/fetch-ud-kyrgyz.sh`, that clones UD Kyrgyz-KTMU (CC BY-SA 4.0) into a git-ignored directory, and make the corpus tests skip with a clear message when it is absent.

### 7.4 Metrics to report in the PR

Write `scripts/orhon-enesai-metrics.ts` to reproduce the proposal's figures, and paste its output into the PR description. On UD Kyrgyz-KTMU the prototype gives:

| Metric | Prototype |
| :--- | ---: |
| Word types sharing a rune spelling (default preset) | 24 of 6,269 (0.4%) |
| Of those, explained by `о`/`у` alone | all |
| Word types sharing a spelling (inscription preset) | 348 (5.6%) |
| Reverse, held-out test split: 𐰆 resolved correctly | 74.1% |
| Reverse, held-out: tokens containing `о`/`у` exact | 58.2% |
| Reverse, held-out: all tokens exact | 88.4% |
| Word types with both back and front vowels | 21.0% |

A difference from these figures is a finding, not a failure. Explain it, since it most likely means the engine's canonical Jany-Latyn differs from the stand-in front end somewhere.

### 7.5 Keyboards

- Regenerating the three keyboard outputs from `keyboardLayout.ts` produces no diff.
- All 73 code points are reachable; every rune emitted by the `orhon-enesai` and `unicode-strict` presets on the corpus is on base or Shift.
- The XKB file compiles, where a compiler is available in CI.

### 7.6 Playground (Playwright)

- The output pane has `dir="rtl"` and `lang="ky-Orkh"`, and `document.fonts.check('16px "Noto Sans Old Turkic"', '\u{10C00}')` is true after load.
- In a 240 px pane, the inscription preset's output for the `WHITEPAPER.md` §2 passage wraps (height > one line) and does not overflow (`scrollWidth` ≤ `clientWidth`). Chromium breaks after U+205A; if another engine in CI does not, report it rather than inserting U+200B (proposal §20.4).
- Pasting runes offers reverse conversion; clicking a guessed span flips `о`↔`у` in both outputs.
- An inspector label of the form "word: runes (n)" keeps "(n)" to the right of the runes.

## 8. Docs

- Add `docs/ORHON-ENESAI.md` and this brief. Add a one-line pointer from `WHITEPAPER.md` §7 and a row in its Appendix D components table, but leave the rest of `WHITEPAPER.md` alone.
- `docs/SPEC.md`: add a normative section for the rune stage (proposal §14–§16 and Appendix B), with its own section number, and cross-reference the proposal for the reasoning.
- `LICENSING.md`: the OFL notice for the font.
- `README.md`: the mode, the presets, and how to install the layouts. Mark the macOS layout experimental until it has been tested on a Mac.
- The changelog, under the next version.

## 9. Milestones

Each milestone is one reviewable PR. Stop after each for review unless the maintainer says otherwise.

| | Milestone | Contents | Exit criterion |
| :---: | :--- | :--- | :--- |
| M1 | Engine forward | `inventory`, `options`, `governor`, `forward`, golden tests | §7.1 passes for all presets; P1–P3, P5–P7 pass |
| M2 | Engine reverse and order | `reverse` with guess positions, `oTable`, `explain`, `collate`, `fold`, CLI | P4, P8 pass; metrics script matches §7.4 or the differences are explained |
| M3 | Playground output | Output column, font, options, presets, inspector, copy, bidi isolation | §7.6 items 1, 2, and 4 pass |
| M4 | Playground reverse | Reverse input, guess flipping, restrictions | §7.6 item 3 passes |
| M5 | Keyboards | Generator, on-screen keyboard, `.keylayout`, `.xkb` | §7.5 passes; macOS file marked for a manual test if untested |
| M6 | Docs and release | §8, telemetry fields if approved | Maintainer sign-off |

## 10. Decisions to escalate, not make

Ask the maintainer and wait, with a recommendation if you have one:

1. **Default preset:** chart or Unicode-strict (proposal §20.6). Implement the chart as default unless told otherwise.
2. **Any change to a chart assignment**, including extending 𐰱 to `ч` beside `ы`.
3. **Any word list**, optional or not, including for the reverse `о`/`у` (proposal §11.2).
4. **Any change to `foldKey` or `compare`** shared with the Latin modes.
5. **A second bundled font** for U+205A and U+2E30, and its license.
6. **New telemetry fields.**
7. **The license of the reference kit's files** once ported, if the repository's per-package licenses make the destination unclear.

## 11. Reference kit contents

| File | What it is |
| :--- | :--- |
| `orhonEnesai.ts` | The rune stage: options, presets, inventory, governor, forward, epigraphic register, reverse |
| `oTable.ts` | The `о`/`у` resolution table (36 contexts), fitted on the UD Kyrgyz-KTMU train split |
| `cyrToJL.ts` | Stand-in Cyrillic → Jany-Latyn front end, for testing only; replaced by the engine |
| `keyboardLayout.ts` | The layout table of §6.2 |
| `chartReading.ts` | The video chart, row by row, with the Unicode match and fit |
| `test.ts`, `fit.ts`, `fixtures.ts` | The scripts that produced the figures and fixtures (`bun run`); they expect the UD treebank at `../data/UD_Kyrgyz-KTMU` |
| `orhon-enesai.golden.json` | 44 golden cases in all presets, with the default reverse result |
| `orhon-enesai.signs.json` | All 73 code points: chart rows, fit, presets that emit them, keys |
| `chart-reading.png` | The chart reading as a table, for checking against the video by eye |
| `orhon-enesai-specimen.png` | The `WHITEPAPER.md` §2 passage in all three presets, rendered right to left |
