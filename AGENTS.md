# AGENTS.md — Developer & AI Agent Guide for `jany-latyn`

This document serves as the single source of truth for AI agents (and human engineers) working on `jany-latyn`.

---

## 1. Project Mission & Identity

`jany-latyn` is a modern, practical Latin-extended orthography and transliteration toolkit for the Kyrgyz language (Кыргызча).

The design prioritizes phonemic 1-to-1 fidelity, morphosyntactic transparency, and seamless digital typing — **ж→j, ч→ç, ш→ş, х→h, doubled long vowels (тоок → took)** — paired with systematic rules for native and loan sounds.

---

## 2. Immutable Linguistic Invariants

When modifying or extending the transliteration engine, **never violate these principles**:

1. **Zero External Runtime Dependencies:**
   `packages/engine/src/` must remain pure TypeScript/JavaScript using only the Node.js standard library.
2. **Jany-Latyn Glyphs:**
   - **`ч` → `ç / Ç`** (Latin U+00E7 / U+00C7, c with cedilla), with `ch` supported as a configurable option and backward-compatible reverse rule.
   - **`ш` → `ş / Ş`** (Latin U+015F / U+015E, s with cedilla), with `sh` supported as a configurable option and backward-compatible reverse rule.
   - **`щ` → `ş / Ş`** (merged into `ş` matching spoken Kyrgyz phonology; avoids disastrous reverse collisions with native `başçy`).
   - **`ү` → `ü / Ü`** (Latin U+00FC / U+00DC), with `ū`, `ұ`, and `ʉ` supported as configurable variants.
   - **`ө` → `ö / Ö`** (Latin U+00F6 / U+00D6), with Cyrillic `ө` supported as a configurable variant.
   - **`ң` → `ŋ / Ŋ`** (U+014B / U+014A, eng).
   - **`й` → `í / Í`** (Latin U+00ED / U+00CD, i with acute) in all phonotactic positions. `ĭ` (U+012D) and `ĩ` (U+0129) exist only as testbed alternatives (`glideGrapheme: 'breve-i' | 'tilde-i'`); never make either part of Jany-Latyn.
   - **`ж` → `j`** in all contexts (never `zh`).
   - **`ы` → `y`**, **`и` → `i`**.
3. **No `q` or `ğ`:**
   Phonemic allophones [q] and [ʁ] are strictly governed by vowel harmony and syllable context; Kyrgyz speakers already write `k` and `g`.
4. **Phonemic Long Vowels Are Doubled & Glides Are Universal `í`:**
   Written doubled (`аа → aa`, `ээ → ee`, `оо → oo`, `уу → uu`, `өө → öö`, `үү → üü`). Never use combining diacritics for vowel length (they break search indexing and plain typing). High-front glides preserve morphemic roots without triple vowels: `/j/` is written `í` (`бийик → biíik`, `кийин → kiíin`, `кийим → kiíim`, `тийиштүү → tiíiştüü`, `бий → bií`, `бийи → biíi`), avoiding barcode-like `iii` via the acute accent while eliminating artificial root mutations or lookahead dictionaries.
5. **Russian Signs Absorbed (Pure-Alphabetic Tokens):**
   Hard and soft signs (`ъ` and `ь`) are absorbed into vowel glides in hiatus (`объект → obíekt`, `семья → semía`) and depalatalized at coda (`июль → iíul`, `апрель → aprel`). Words in Jany-Latyn are 100% alphabetic (`\p{L}+`) without internal punctuation or apostrophes, optimizing tokenization for search indexing and LLMs.
6. **Backward Compatibility:**
   `janyToCyr` must reverse the Jany-Latyn `ü`, legacy `ū`, and alternative `ұ` back to `ү`, legacy `iy/iyi` to `ий/ийи`, the testbed glides `ĭ`/`ĩ` to `й` exactly like `í` (they are folded to `í` before reversal), legacy digraphs `ch`, `sh`, `sch` to `ч`, `ш`, `щ`, and legacy apostrophe signs (`ob'ekt`, `sem'ía`) back to `ъ` and `ь`.

---

## 3. Architecture & Directory Anatomy

```
jany-latyn/
├── LICENSE, LICENSING.md  # Three-part licensing: engine MIT, web PolyForm NC, docs CC BY
├── TRADEMARK.md, CONTRIBUTING.md, CITATION.cff
├── package.json           # npm workspaces root (no code of its own)
├── packages/engine/       # MIT. Must import nothing outside this directory (test/boundary.test.ts)
│   ├── src/
│   │   ├── alphabet.ts        # Declarative letter mappings (LETTER_MAP) and ASCII fallback (FALLBACK)
│   │   ├── convert.ts         # Core transliteration logic:
│   │   │                      # - cyrToJany(): Cyrillic -> Jany-Latyn
│   │   │                      # - janyToFallback(): Jany -> ASCII Fallback (o, u, i, n)
│   │   │                      # - janyToCyr(): Jany -> Cyrillic (deterministic reverse)
│   │   │                      # - janyToCyrillicU(): Jany -> Display variant with Cyrillic ұ
│   │   │                      # - janyToLatinU(): Jany -> Display variant with barred ʉ
│   │   ├── casing.ts          # SPEC §2.1: recase from the source word's pattern; explicit case tables per configuration
│   │   ├── collate.ts         # SPEC §6: compare(a, b, options), a rank table per configuration (jany-latyn/collate)
│   │   ├── loanRestore.ts     # Opt-in loanword restoration for reverse conversion
│   │   ├── testbedPresets.ts  # Whitepaper §7 testbed-only option couplings (ı→q+ğ+y glide, q→ğ) and the ĩ+ñ warning
│   │   └── cli.ts             # CLI executable (node packages/engine/dist/src/cli.js)
│   ├── keymaps/
│   │   ├── jany-latyn.keylayout # macOS XML keyboard layout (full ANSI coverage)
│   │   └── jany.xkb              # Linux XKB symbols file (AltGr / Level 3 switch)
│   ├── charts/alphabet.svg    # Generated SVG alphabet chart
│   ├── scripts/
│   │   ├── make-chart.ts      # Generates charts/alphabet.svg from LETTER_MAP
│   │   └── check-whitepaper.ts # Conformance checker; reads ../../docs/WHITEPAPER.md
│   └── test/                  # Node test runner suites + fixtures/ (anthem, lullaby, Manas)
├── apps/web/              # PolyForm NC. Svelte 5 + SvelteKit static testbed
│   └── src/
│       ├── hooks.client.ts    # Analytics: off unless PUBLIC_POSTHOG_KEY and _HOST are set
│       ├── lib/
│       │   ├── i18n/          # Reactive internationalization (types, translations, index.svelte.ts)
│       │   ├── components/    # VirtualKeyboard (Alt layer follows active options), VoteModal, Icon
│       │   ├── sample-texts/  # Sample library (also read by the engine's samples test)
│       │   ├── fonts.ts       # Font stack test suites
│       │   └── fontcheck.ts   # Canvas glyph coverage probing
│       └── routes/            # Playground (+page), alphabet/, about/, whitepaper/
└── docs/                  # CC BY 4.0
    ├── WHITEPAPER.md      # The proposal; versioned together with the conformance checker
    ├── SPEC.md            # Formal linguistic orthography specification
    ├── keyboard.md        # Keyboard layout setup instructions
    └── README.{ky,ky-jany,ru,tr}.md  # Translated guides
```

The web app imports the engine by package name (`jany-latyn/convert`, `jany-latyn/alphabet`,
`jany-latyn/testbedPresets`). The `source` export condition, enabled in `apps/web/vite.config.ts`
and `apps/web/tsconfig.json`, resolves those imports to the TypeScript sources, so the web app needs no engine build step.

---

## 4. Verification & Testing Commands

Always run these commands before committing any code:

```sh
# 1. Run core test suite (Node test runner)
npm test

# 2. Regenerate SVG chart (asserts clean generation)
npm run chart

# 3. Check web types and Svelte diagnostics
npm run check:web

# 4. Build web static application (catches prerendering errors)
npm run build:web
```

---

## 5. Development Conventions & Gotchas

### Strict ECMAScript Modules (ESM)
- The root and both workspaces use `"type": "module"`.
- When writing relative TypeScript imports, you **must include the `.js` extension**:
  ```typescript
  // CORRECT
  import { LETTER_MAP } from './alphabet.js';

  // WRONG (will cause runtime TS module resolution errors)
  import { LETTER_MAP } from './alphabet';
  ```

### Svelte 5 Runes
- The web app runs on Svelte 5.
- Always use modern runes: `$state`, `$derived`, `$props`.
- **Rune Extension Rule:** Runes used outside of `.svelte` components (such as stores or reactive utilities) **MUST** be placed in files ending with `.svelte.ts` or `.svelte.js` (e.g. `apps/web/src/lib/i18n/index.svelte.ts`). Plain `.ts` files will throw `ReferenceError: $state is not defined`.

### macOS `.keylayout` XML Keycodes
- macOS keyboard layouts must include mappings for keycodes 0–127.
- Missing scancodes for Numpad keys (e.g. `78` for `-`, `76` for Enter) or Navigation keys (`123-126` for arrows) cause OS-level crashes in terminal and Cocoa applications.
- Always validate XML syntax with `xmllint --noout packages/engine/keymaps/jany-latyn.keylayout`.
- Avoid raw ASCII control entities `< 0x20` in XML (except `0x09`, `0x0A`, `0x0D`). Use Cocoa Unicode Private Use Area (PUA) codepoints (`0xF700`..`0xF72D`) for function and arrow keys.

### Casing
- Never call `toUpperCase`/`toLowerCase` (or the locale variants) in conversion code. Use `casing.ts` (`lowerStr`, `upperStr`, `applyCase`). `test/casing.test.ts` stubs the String case methods and fails if conversion reaches them.
- Converters work on the lowercased word and emit `Segment`s (source index + text); `applyCase` restores the source word's pattern (SPEC §2.1).
- Case tables depend on the configuration, never on the locale: `caseModeFor(options)` gives `'turkic'` (ı ↔ I, i ↔ İ) only for `yGrapheme: 'dotless-i'`. `janyToCyr` takes the same `yGrapheme` option to read capitals. `foldKey` and `compare` are configuration-dependent for the same reason.

### Licensing Boundaries
- Every new source file starts with an SPDX header: `// SPDX-License-Identifier: MIT` under `packages/engine/`, `PolyForm-Noncommercial-1.0.0` under `apps/web/` (use `<!-- … -->` in `.svelte`/`.html`).
- Engine code must not import from `apps/` or `docs/`; `test/boundary.test.ts` fails the suite if it does. Reading `docs/WHITEPAPER.md` from the conformance checker is a file read, not an import, and is intentional.
- Analytics stay off unless `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` are set at build time. Never hard-code either, and guard every `posthog.capture` with `posthog.__loaded`.
