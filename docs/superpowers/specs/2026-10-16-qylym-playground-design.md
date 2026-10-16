# qylym: site structure and any-to-any playground

**Design spec.** Approved in conversation on 2026-10-16. Covers the site structure and the playground. The Runic section's pages (rune alphabet, proposal, corpus) get their routes and navbar entries here and their own follow-up spec.

## 1. Intent

The site becomes **qylym**, a lab for two Kyrgyz scripts: Jany-Latyn (Latin) and Jany-Enesai (Old Turkic runes). Its centre is one playground that converts any of them into any other, so a reader can refine the look and the transliteration they want:

- Type or paste text in Cyrillic, in any Latin variant, or in runes.
- Get the text in any other script. The Latin and runic outputs offer presets, which carry their status, and every option can be customized.
- Compare the target script's presets.
- See why each rune was chosen.
- When pasting the stones' spelling, get a sign-by-sign reading instead of a conversion.

### Decisions made in conversation

| Question | Decision |
| :--- | :--- |
| Playground model | One input, one output: source and target pickers, a swap button, and a comparison strip of the target script's presets |
| Navigation | Playground · Latin ▾ (Alphabet, Whitepaper) · Runic ▾ (Alphabet, Proposal, Corpus) · About |
| Analytics for runes | Yes, like Latin: hosted site only, behind the existing consent prompt |
| Publish the Jany-Enesai proposal | Yes, as a page marked "Draft for review" |
| Translation of new strings | English only for now; every locale falls back to English for them |
| Where the conversion logic lives | In the engine (MIT), as `jany-latyn/scripts`, with tests (approach 1) |

### Out of scope

- The Runic section's pages beyond their routes and navbar entries (follow-up spec).
- The on-screen rune keyboard and the installable rune layouts (keyboards phase).
- Translations of the new strings.
- Playwright or other automated browser tests.
- Shareable URLs that encode the settings.

## 2. Site structure

### 2.1 Navigation

- **Desktop:** Playground · Latin ▾ · Runic ▾ · About. Latin and Runic are dropdown menus.
- **Phones:** the same items, in the menu, with the subsections nested under their script.

| Route | Page |
| :--- | :--- |
| `/` | Playground (§3) |
| `/latin/alphabet/` | The current alphabet page, moved |
| `/latin/whitepaper/` | The current whitepaper page, moved |
| `/runic/alphabet/` | Rune alphabet (follow-up spec; a placeholder page here) |
| `/runic/proposal/` | `docs/jany-enesai/JANY-ENESAI.md`, rendered like the whitepaper, under a "Draft for review" banner |
| `/runic/corpus/` | Corpus index (follow-up spec; a placeholder page here) |
| `/about/` | Unchanged |

### 2.2 Redirects

`/alphabet/` and `/whitepaper/` become prerendered pages that forward to `/latin/alphabet/` and `/latin/whitepaper/`:

- a script calls `location.replace(target + location.hash)`, so a `#section` anchor in an old link still lands on its section;
- a `<meta http-equiv="refresh">` forwards readers who have scripting off;
- a canonical link points search engines at the new address.

### 2.3 Shared document renderer

The whitepaper's server loader (`whitepaper/+page.server.ts`) and its page component become shared code: a loader that renders any Markdown file with heading anchors, a table of contents, and styled tables and blockquotes; and a document component with the desktop sidebar, the phone accordion, and the back-to-top button. The whitepaper and the proposal both use them.

The proposal page differs only in its banner, which says the document is a draft for review. The header's reading-font picker appears on both document pages, and rune text inside them is set in the rune font stack (§5.3). Its relative image links (`jany-enesai-alphabet.png`, `glyph-legibility.png`) must resolve, so the loader copies or serves `docs/jany-enesai/*.png` with the page.

### 2.4 Branding

`SITE_NAME` defaults to `qylym` (today it defaults to `jany-latyn`), and `PUBLIC_SITE_NAME` still overrides it. The header subtitle (`nav.scriptSubtitle`) names both scripts. The string is new and in English only.

## 3. The playground

### 3.1 Pickers

**[Source ▾] ⇄ [Target ▾]**

| Source | Read with |
| :--- | :--- |
| Auto (default) | Whatever `detectScript` finds, shown in the picker as "Auto: Cyrillic" and so on |
| Cyrillic | As is |
| Latin | Any Latin variant: Jany-Latyn, CTA, digraphs, ө, x, the testbed glides. Dotless ı switches on the Turkish case pairs and the reading of ы and й (§4.4) |
| Runes | Converted back when the spelling is modern. The stones' spelling can only be read (§3.2) |

| Target | Settings |
| :--- | :--- |
| Cyrillic | "Restore loanwords" toggle, shown whenever the route passes back through Cyrillic |
| Latin | Presets and customize (§3.3) |
| ASCII | Strip or digraph style |
| Runes | Presets and customize (§3.3) |
| Reading | Notation: scholarly, CTA, Jany-Latyn, Cyrillic |

### 3.2 Old spelling

When the input is runes and `detectSpelling` says `old`, the target switches to **Reading**. Cyrillic, Latin, ASCII and Runes are then disabled, and a note says why: the stones leave out most vowels, so their text cannot be converted, only read sign by sign. Reading is offered only for rune input.

### 3.3 Presets and customize

Presets and the customize panel always belong to the **target**.

- **Latin:** the four presets from `LATIN_PRESETS` (§4.2) and today's ten option rows, with their notes and couplings (`testbedPresets.ts`), unchanged.
- **Runes:** the six presets of `RUNE_PRESETS`, each with a status badge (proposed, reference, comparison), plus Custom. The customize panel has one row per option in `RUNE_OPTION_VALUES`:
  - harmony, register, vowels, у, ж, loan consonants, forms, р, с, ш, the Yenisei ш (shown only with Yenisei forms), and the divider;
  - values that make the result one-way carry a "one-way" mark;
  - the attested с and ш carry a "hard to read in running text" note (RUNES-SPEC §4.4);
  - a line under the panel says whether the current combination converts back (`isReversible`).
- **Reset** returns the target to its proposed preset.

### 3.4 Panes

- **Input:** `dir="rtl"` and the rune font when it holds runes; otherwise as today.
- **Output for runes:**
  - `dir="rtl"`, `lang="ky-Orkh"`, `unicode-bidi: isolate`, in the rune font stack (§5.3);
  - a muted Jany-Latyn line beneath it, which the reader can switch off;
  - toolbar: **Copy** (logical order) and **Copy for left-to-right documents** (each line wrapped in U+2067 … U+2069).
- **Output for other targets:** as today.
- **Kept on every target:** download and the vote.
- **Kept on Latin targets only:** All caps.
- **Every rune label inside left-to-right text is isolated with `<bdi>`.**

### 3.5 Comparison strip

Below the output, the strip shows the target script's other presets with the words that differ from the current output marked, plus "use" and the vote (§5.2). It replaces today's comparison cards. It is hidden for the Cyrillic, ASCII and Reading targets. Diff marks compare words in logical order, so they work for runes as for Latin.

### 3.6 Inspector

For the Runes target, tapping a word in the output opens a panel below the output, filled from `explainRunes`. One row per Jany-Latyn letter shows:

- the letter and its rune;
- the rune's Unicode name;
- for consonants, the governing vowel and the series;
- whether the letter was dropped or merged into a ligature.

The panel shows the word's Cyrillic and Jany-Latyn above the rows. It closes with Escape or a close button.

### 3.7 Swap ⇄

Swap moves the output into the input and swaps the pickers. It is disabled, with the reason as its title, when the target cannot be converted back: ASCII, Reading, or a rune combination that `isReversible` rejects.

### 3.8 Kept features

- **Samples, file upload, and the virtual keyboard** (Cyrillic and Latin) are unchanged.
- **The list view** sorts each column by its own script's order:
  - Cyrillic by `compareCyrillic`;
  - Latin by `compare` with the target options;
  - runes by `compareRunes`.
- **Remembered between visits:** the target script and its preset or options, in `localStorage`, wrapped in try/catch. The page works the same without storage.

### 3.9 Phones

The pickers sit on one row with swap between them, wrapping if needed. The input, output, strip, and inspector stack.

### 3.10 Components

The page is split into focused components under `apps/web/src/lib/playground/`:

| Component | Responsibility |
| :--- | :--- |
| `ScriptPickers.svelte` | Source and target pickers, swap, the detected script |
| `PresetBar.svelte` | The presets of one script family, with status badges and Custom |
| `LatinOptions.svelte` | The ten Latin option rows and their notes |
| `RuneOptions.svelte` | The rune option rows, the one-way and hard-to-read notes, the reversibility line |
| `InputPane.svelte` | Textarea, samples, upload, keyboard toggle, counts |
| `OutputPane.svelte` | Output in the target's direction and font, toolbar, Jany-Latyn line, list view |
| `ComparisonStrip.svelte` | Other presets of the target script, with diff marks |
| `RuneInspector.svelte` | The letter table for one word |
| `playground.svelte.ts` | Playground state (source, target, options per script, view settings) and its persistence |

`+page.svelte` composes them. The vote modal, the font select and the virtual keyboard are reused as they are.

## 4. The conversion hub: `jany-latyn/scripts` (engine, MIT)

### 4.1 `detectScript(text)`

Counts letters by Unicode script and returns:

```ts
interface DetectedScript {
  script: 'cyrillic' | 'latin' | 'runes' | 'mixed' | 'empty';
  /** For Latin: dotless ı present, so ы is ı and the glide may be y. */
  latin?: { yGrapheme: 'y' | 'dotless-i'; glideGrapheme: 'acute-i' | 'y' };
  /** For runes: detectSpelling's class. */
  spelling?: 'modern' | 'old';
}
```

Dotless ı in Latin text means the CTA-aligned setting: ы is ı and the glide is y (the coupling of `testbedPresets.ts`). Otherwise the Latin is read as canonical, with í as the glide. `mixed` is returned when no script holds at least 80% of the letters. The playground then reads the input as Cyrillic and says it is guessing.

### 4.2 `LATIN_PRESETS`

The four Latin variants move from `+page.svelte` into the engine, as data of the same shape as `RUNE_PRESETS`:

| Id | Name | Status |
| :--- | :--- | :--- |
| `standard` | Jany-Latyn | proposed |
| `cta` | CTA-aligned | comparison |
| `digraph` | Legacy digraphs | comparison |
| `hybrid` | Hybrid ө | comparison |

Each preset also keeps its analytics identifiers (`card`, `voteName`) in the web app, so stored votes and events keep their current names.

### 4.3 `convertText`

```ts
type Script = 'cyrillic' | 'latin' | 'ascii' | 'runes' | 'reading';
interface ConvertRequest {
  text: string;
  from: 'cyrillic' | 'latin' | 'runes';
  to: Script;
  latin?: JanyOptions;                       // target Latin options
  latinSource?: { yGrapheme?: 'y' | 'dotless-i'; glideGrapheme?: 'acute-i' | 'y' };
  runes?: Partial<RuneOptions>;              // target rune options
  ascii?: 'strip' | 'digraph';
  reading?: ReaderTarget;
  restoreLoans?: boolean;
}
type ConvertResult =
  | { ok: true; text: string }
  | { ok: false; reason: 'old-spelling' | 'not-readable' };
function convertText(r: ConvertRequest): ConvertResult;
```

Routing:

- **The hub is Cyrillic.** The source goes to Cyrillic, and the target is made from the Cyrillic.
- **Exception: canonical Jany-Latyn.** When both ends are based on canonical Jany-Latyn, the route goes through canonical Jany-Latyn, which loses nothing:
  - runes → runes;
  - runes → Latin `standard`;
  - Latin → runes, when every letter of the input is a canonical Jany-Latyn letter (so CTA, digraph, and legacy spellings go through Cyrillic);
  - an identity hop.

  Going through Cyrillic would lose the loan layer here: *obíekt* → *обект* → 𐰆𐰉𐰅𐰴𐱄 instead of 𐰆𐰉𐰖𐰅𐰴𐱄.
- **Reading** is valid only from runes: `readInscription(text, reading)`.
- **Old-spelling rune input** to any target other than Reading returns `{ ok: false, reason: 'old-spelling' }`.
- **Never throws on user text.** Unknown option values are a programming error and may throw.

### 4.4 Engine fix: the й reading of CTA

`janyToCyr` gains `glideGrapheme?: 'acute-i' | 'y'` in `JanyCyrOptions`. With `yGrapheme: 'dotless-i'` and `glideGrapheme: 'y'`, a `y` is read as й, so *obyekt* comes back as *объект* with the loan list, or *обект* without it, as canonical *obíekt* does. Today it comes back as *обыект*. Existing output does not change: the option is off by default, and the whitepaper check must stay at 208/208.

### 4.5 Tests

- **Every source × target pair** on the 37 worked examples of `runes.golden.json`, including round trips where both directions exist.
- **Script detection** for Cyrillic, canonical Latin, CTA, runes in modern and old spelling, mixed text, and empty text.
- **The CTA fix**, and the `old-spelling` result.
- **`LATIN_PRESETS`** produce the same output as the four variants the playground uses today.

## 5. Cross-cutting

### 5.1 i18n

- New strings are added to `en` only.
- The `Translations` type stays complete for `en`. The other locales are typed as deep partials and merged over English when a locale is selected, so every existing translation is unchanged.
- `ky-jany`, which is generated from `ky`, falls back to English the same way.

### 5.2 Analytics

Everything stays on the hosted site only, behind the existing consent prompt, and every `posthog.capture` stays guarded by `posthog.__loaded` (AGENTS.md).

- **Votes** add `script` (`latin` or `runes`) and, for runes, `rune_preset` and `rune_options`.
- **Copy, download, and sample events** add `source_script`, `target_script`, and `preset`.
- **Stored vote keys** for rune combinations are prefixed `runes:`, so they never collide with the Latin keys, whose format is unchanged.

### 5.3 Font

- **Bundled font:** Noto Sans Old Turkic, as WOFF2 if the upstream repository provides one, otherwise as the TTF, which is 15 KB. It lives in `apps/web/static/fonts/` with `OFL.txt`.
- **Loading:** `@font-face` with `font-display: swap`.
- **Rune stack:** `"Noto Sans Old Turkic", "Segoe UI Historic", system-ui, sans-serif`. Noto covers only the runes, so ⁚ and ⸱ come from the fonts after it.
- **`LICENSING.md`** gains a row for the font under SIL OFL 1.1.

### 5.4 Docs

- **README:** describes the playground and the site sections.
- **CHANGELOG:** records the new routes, the redirects, `jany-latyn/scripts`, and the `janyToCyr` option.
- **AGENTS.md:** gets the new directories.

## 6. Verification

1. `npm test`: engine tests including §4.5, and the whitepaper check unchanged at 208/208.
2. `npm run check:web` and `npm run build:web`: zero errors.
3. `npm run chart` and `npm run test:corpus`: unchanged.
4. **Browser pass in Chrome**, on desktop and at a 390 px width:
   - every source × target pair from the picker;
   - right-to-left rune output, with `document.fonts.check('16px "Noto Sans Old Turkic"', '\u{10C00}')` true;
   - both copy buttons;
   - swap, including its disabled states;
   - the old-spelling switch to Reading;
   - the inspector;
   - the comparison strip;
   - the list view for each script;
   - `/whitepaper/#…` and `/alphabet/` forwarding with their anchors;
   - the proposal page with its images;
   - the navbar on both widths.
