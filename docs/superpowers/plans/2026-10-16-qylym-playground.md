# qylym Site Structure and Any-to-Any Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the testbed into the qylym lab: a Playground · Latin ▾ · Runic ▾ · About site whose playground converts between Cyrillic, any Latin variant, ASCII, and runes (and reads inscriptions), with presets and customization for both script families.

**Architecture:** A new MIT engine module, `jany-latyn/scripts`, holds script detection, the Latin presets, and one routing function, `convertText`. Cyrillic is the hub; routes go through canonical Jany-Latyn instead where both ends allow it. The web app's 1,000-line playground is split into focused Svelte 5 components driven by one state class. The whitepaper renderer becomes shared code for the whitepaper and the Jany-Enesai proposal. Old URLs forward to the new ones.

**Tech Stack:** TypeScript (engine, Node test runner, zero dependencies), Svelte 5 runes + SvelteKit (static adapter, prerendered), Tailwind 4 + daisyUI 5, marked, posthog-js.

**Spec:** `docs/superpowers/specs/2026-10-16-qylym-playground-design.md`

## Global Constraints

- Engine (`packages/engine/`) stays MIT, has zero runtime dependencies, and imports nothing outside the package (`test/boundary.test.ts`).
- Every new source file starts with an SPDX header: `// SPDX-License-Identifier: MIT` in the engine; `PolyForm-Noncommercial-1.0.0` in `apps/web/` (`<!-- … -->` in `.svelte`).
- Relative TypeScript imports in the engine use the `.js` extension.
- Conversion code never calls `toUpperCase`/`toLowerCase` or the locale variants; use `casing.ts` (`lowerStr`, `upperStr`).
- No existing Jany-Latyn output changes; `npm test` keeps the whitepaper check at `208/208`.
- Runes outside the BMP: iterate by code point, use the `u` flag, never slice rune text by code unit.
- Svelte 5 runes only (`$state`, `$derived`, `$props`, `$effect`); runes outside components live in `.svelte.ts` files.
- Analytics stay off unless `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` are set; every `posthog.capture` is guarded by `posthog.__loaded`.
- New interface strings exist in English only; other locales fall back to English for them.
- Rune output: `dir="rtl"`, `lang="ky-Orkh"`, `unicode-bidi: isolate`, rune font stack `"Noto Sans Old Turkic", "Segoe UI Historic", system-ui, sans-serif`.
- Verification commands (AGENTS.md): `npm test`, `npm run chart`, `npm run check:web`, `npm run build:web`, plus `npm run test:corpus`.

## Review Focus

1. **Very long input** (a 50,000-character paste) — the playground runs the main conversion, up to five comparison conversions, the Jany-Latyn line, and the inspector per keystroke; typing must stay responsive. Pinned by the `convertText` timing test in Task 2 and the long-paste browser check in Task 12.
2. **Text mixing scripts** (Cyrillic with Latin brand names, runes beside punctuation) — foreign words pass through unchanged in every route. Pinned by the mixed-text test in Task 2.
3. **Empty or whitespace-only input**, and switching pickers with it — no error, empty output, comparison strip and inspector hidden. Pinned by the empty-input test in Task 2 and the browser check in Task 12.
4. **Pasting the stones' spelling, then changing the target or pressing swap** — target is forced to Reading, other targets and swap are disabled with reasons. Pinned by the old-spelling tests in Task 2 and the browser check in Task 12.
5. **Blocked or corrupted `localStorage`** (private window, hand-edited JSON) — the page loads with defaults and ignores invalid stored values. Pinned by `restore()`'s validation in Task 7 and the browser check in Task 12.

---

### Task 1: Engine — read CTA's `y` glide back as й

**Files:**
- Modify: `packages/engine/src/convert.ts:27-32` (`JanyCyrOptions`) and `:446-452` (`janyToCyr`)
- Test: `packages/engine/test/glideReverse.test.ts` (create)

**Interfaces:**
- Consumes: nothing new.
- Produces: `JanyCyrOptions.glideGrapheme?: JanyOptions['glideGrapheme']`. With `yGrapheme: 'dotless-i'` and `glideGrapheme: 'y'`, every `y` in a word is read as the glide `í`.

- [ ] **Step 1: Write the failing test**

```ts
// packages/engine/test/glideReverse.test.ts
// SPDX-License-Identifier: MIT
/**
 * CTA writes ы as ı and the glide й as y. Reading such text back needs the glide
 * setting too, or y is taken for ы (obyekt → обыект).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cyrToJany, janyToCyr, type JanyOptions } from '../src/convert.js';

const CTA: JanyOptions = { yGrapheme: 'dotless-i', glideGrapheme: 'y', uvularK: 'q', uvularG: 'ğ', affricate: 'c', velarNasal: 'tilde-n' };
const READ_CTA = { yGrapheme: 'dotless-i', glideGrapheme: 'y' } as const;

test('janyToCyr: with the y glide, y reads as й', () => {
  assert.equal(janyToCyr('obyekt', READ_CTA), 'обект');
  assert.equal(janyToCyr('obyekt', { ...READ_CTA, restoreLoans: true }), 'объект');
  assert.equal(janyToCyr('semya', { ...READ_CTA, restoreLoans: true }), 'семья');
  assert.equal(janyToCyr('Yevropa', READ_CTA), 'Европа');
  assert.equal(janyToCyr('çay', READ_CTA), 'чай');
});

test('janyToCyr: CTA text comes back as canonical Jany-Latyn does', () => {
  for (const w of ['кыргыз', 'жаңы', 'чай', 'шаар', 'кийим', 'бийик', 'Европа', 'аюу', 'ысык-көл', 'тийиштүү']) {
    assert.equal(janyToCyr(cyrToJany(w, CTA), READ_CTA), janyToCyr(cyrToJany(w)), w);
  }
});

test('janyToCyr: without the y glide, y still reads as ы', () => {
  assert.equal(janyToCyr('kyrgyz'), 'кыргыз');
  assert.equal(janyToCyr('obyekt', { yGrapheme: 'dotless-i' }), 'обыект');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/engine && rm -rf dist && npx tsc && node --test dist/test/glideReverse.test.js`
Expected: FAIL — TypeScript error "Object literal may only specify known properties, and 'glideGrapheme' does not exist in type 'JanyCyrOptions'".

- [ ] **Step 3: Implement**

In `packages/engine/src/convert.ts`, replace the `JanyCyrOptions` interface:

```ts
export interface JanyCyrOptions {
  restoreLoans?: boolean;
  // The configuration the Latin text was written in. 'dotless-i' selects the
  // Turkish case pairs (I ↔ ı, İ ↔ i), so KIRGIZ reads as КЫРГЫЗ (SPEC §2.1).
  yGrapheme?: JanyOptions['yGrapheme'];
  // With yGrapheme 'dotless-i', a 'y' glide (CTA) makes every y the glide й, so
  // obyekt reads as обект, not обыект. Other values change nothing.
  glideGrapheme?: JanyOptions['glideGrapheme'];
}
```

and replace `janyToCyr`:

```ts
export function janyToCyr(text: string, options?: JanyCyrOptions): string {
  const restoreLoans = options?.restoreLoans ?? false;
  const mode = caseModeFor(options);
  // CTA's y glide reads exactly like the Jany-Latyn í glide (same length, so the
  // case pattern of the source word still lines up with the segments).
  const glideY = mode === 'turkic' && options?.glideGrapheme === 'y';
  const normalized = text.normalize('NFC').replace(MARKED_GLIDE, (g) => MARKED_GLIDE_TO_ACUTE[g]);
  return mapLines(normalized, (line, upperLine) => line.replace(JANY_WORD, (word) => {
    const lower = lowerStr(word, mode);
    return applyCase(word, revertWord(glideY ? lower.replace(/y/g, 'í') : lower, restoreLoans), upperLine, mode);
  }), mode);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd "$(git rev-parse --show-toplevel)" && npm test 2>&1 | grep -E "^ℹ (tests|pass|fail)|Whitepaper check|^✖"`
Expected: all pass; `Whitepaper check (docs/WHITEPAPER.md): 208/208 passed`.

- [ ] **Step 5: Commit**

```bash
git add packages/engine/src/convert.ts packages/engine/test/glideReverse.test.ts
git commit -m "fix(engine): read CTA's y glide back as й when converting to Cyrillic"
```

---

### Task 2: Engine — `jany-latyn/scripts`, the conversion hub

**Files:**
- Create: `packages/engine/src/scripts.ts`
- Modify: `packages/engine/src/runes/explain.ts` (add a `source` parameter)
- Modify: `packages/engine/package.json` (export `./scripts`)
- Test: `packages/engine/test/scripts.test.ts` (create)

**Interfaces:**
- Consumes: `janyToCyr(text, { restoreLoans, yGrapheme, glideGrapheme })` from Task 1; `cyrToJany`, `janyToFallback`, `lowerStr`; from `./runes/index.js`: `cyrillicToRunes`, `janyLatynToRunes`, `runesToJanyLatyn`, `runesToCyrillic`, `readInscription`, `detectSpelling`, `explainRunes`, `RuneOptions`, `ReaderTarget`, `RuneStatus`, `WordExplanation`.
- Produces (all exported from `jany-latyn/scripts`):
  - `type SourceScript = 'cyrillic' | 'latin' | 'runes'`
  - `type TargetScript = SourceScript | 'ascii' | 'reading'`
  - `type SchemeStatus = RuneStatus`
  - `interface LatinSource { yGrapheme: 'y' | 'dotless-i'; glideGrapheme: 'acute-i' | 'y' }`
  - `interface DetectedScript { script: SourceScript | 'mixed' | 'empty'; latin?: LatinSource; spelling?: 'modern' | 'old' }`
  - `detectScript(text: string): DetectedScript`
  - `type LatinOptions = Required<JanyOptions>`
  - `DEFAULT_LATIN_OPTIONS: Readonly<LatinOptions>`
  - `LATIN_OPTION_VALUES: { readonly [K in keyof LatinOptions]: readonly LatinOptions[K][] }`
  - `interface LatinPreset { id: string; name: string; status: SchemeStatus; options: Readonly<LatinOptions> }`
  - `LATIN_PRESETS: readonly LatinPreset[]` (ids `standard`, `cta`, `digraph`, `hybrid`)
  - `interface ConvertRequest { text: string; from: SourceScript; to: TargetScript; latin?: JanyOptions; latinSource?: Partial<LatinSource>; runes?: Partial<RuneOptions>; ascii?: 'strip' | 'digraph'; reading?: ReaderTarget; restoreLoans?: boolean }`
  - `type ConvertResult = { ok: true; text: string } | { ok: false; reason: 'old-spelling' | 'not-readable' }`
  - `convertText(r: ConvertRequest): ConvertResult`
  - `explainConversion(r: Omit<ConvertRequest, 'to'>): WordExplanation[]`
  - `explainRunes(text, options?, source: 'cyrillic' | 'jany-latyn' = 'cyrillic')` (changed signature in `jany-latyn/runes`)

- [ ] **Step 1: Write the failing test**

```ts
// packages/engine/test/scripts.test.ts
// SPDX-License-Identifier: MIT
/**
 * The any-to-any hub (docs/superpowers/specs/2026-10-16-qylym-playground-design.md §4):
 * script detection, the Latin presets, and the routing of every source × target pair.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cyrToJany, janyToCyr, janyToFallback } from '../src/convert.js';
import { lowerStr } from '../src/casing.js';
import { cyrillicToRunes, presetOptions, readInscription, RUNE_PRESETS } from '../src/runes/index.js';
import {
  detectScript, convertText, explainConversion, LATIN_PRESETS, DEFAULT_LATIN_OPTIONS, LATIN_OPTION_VALUES,
  type ConvertResult,
} from '../src/scripts.js';

const golden = JSON.parse(readFileSync(new URL('../../test/fixtures/runes.golden.json', import.meta.url), 'utf8')) as {
  cases: { cyrillic: string; janyLatyn: string; runes: Record<string, string> }[];
};
const CTA = LATIN_PRESETS.find((p) => p.id === 'cta')!.options;
const CTA_SOURCE = { yGrapheme: 'dotless-i', glideGrapheme: 'y' } as const;
const text = (r: ConvertResult) => { assert.ok(r.ok, JSON.stringify(r)); return r.ok ? r.text : ''; };
const runeWords = (s: string) => s.match(/[\p{Script=Old_Turkic}̇\u{10CEA}]+/gu) ?? [];

test('detectScript: the main script, the Latin setting, and the rune spelling', () => {
  assert.deepEqual(detectScript('Кыргыз'), { script: 'cyrillic' });
  assert.deepEqual(detectScript('Kyrgyz'), { script: 'latin', latin: { yGrapheme: 'y', glideGrapheme: 'acute-i' } });
  assert.deepEqual(detectScript('Qırğız'), { script: 'latin', latin: { yGrapheme: 'dotless-i', glideGrapheme: 'y' } });
  assert.deepEqual(detectScript('𐰴𐰃𐰺𐰍𐰃𐰕'), { script: 'runes', spelling: 'modern' });
  assert.deepEqual(detectScript('𐰴𐰃𐰻𐰃𐰍'), { script: 'runes', spelling: 'old' });
  assert.deepEqual(detectScript(''), { script: 'empty' });
  assert.deepEqual(detectScript('2026, !?'), { script: 'empty' });
  assert.deepEqual(detectScript('Kyrgyz Кыргыз'), { script: 'mixed' });
  // 37 Cyrillic letters of 44: 84%, over the 80% threshold.
  assert.equal(detectScript('Мен күн сайын Windows менен иштейм, ал абдан ыңгайлуу').script, 'cyrillic');
});

test('LATIN_PRESETS: ids, status, and the options the playground has always used', () => {
  assert.deepEqual(LATIN_PRESETS.map((p) => [p.id, p.status]), [
    ['standard', 'proposed'], ['cta', 'comparison'], ['digraph', 'comparison'], ['hybrid', 'comparison'],
  ]);
  assert.deepEqual({ ...CTA }, { ...DEFAULT_LATIN_OPTIONS, yGrapheme: 'dotless-i', glideGrapheme: 'y', uvularK: 'q', uvularG: 'ğ', affricate: 'c', velarNasal: 'tilde-n' });
  for (const p of LATIN_PRESETS) {
    for (const [k, v] of Object.entries(p.options)) assert.ok((LATIN_OPTION_VALUES as Record<string, readonly string[]>)[k].includes(v), `${p.id}.${k}`);
  }
});

test('convertText: from Cyrillic, every target equals the engine function it routes to', () => {
  for (const c of golden.cases) {
    const from = 'cyrillic' as const;
    assert.equal(text(convertText({ text: c.cyrillic, from, to: 'cyrillic' })), c.cyrillic);
    for (const p of LATIN_PRESETS) assert.equal(text(convertText({ text: c.cyrillic, from, to: 'latin', latin: p.options })), cyrToJany(c.cyrillic, p.options));
    assert.equal(text(convertText({ text: c.cyrillic, from, to: 'ascii', ascii: 'digraph' })), janyToFallback(cyrToJany(c.cyrillic), 'digraph'));
    for (const p of RUNE_PRESETS) assert.equal(text(convertText({ text: c.cyrillic, from, to: 'runes', runes: p.options })), cyrillicToRunes(c.cyrillic, p.options));
  }
});

test('convertText: from runes, through canonical Jany-Latyn where it is exact', () => {
  for (const c of golden.cases) {
    const r = { text: c.runes['jany-enesai'], from: 'runes' as const };
    assert.equal(text(convertText({ ...r, to: 'latin' })), lowerStr(c.janyLatyn));
    assert.equal(text(convertText({ ...r, to: 'runes', runes: presetOptions('full') })), c.runes.full);
    assert.equal(text(convertText({ ...r, to: 'cyrillic' })), lowerStr(janyToCyr(c.janyLatyn)));
    assert.equal(text(convertText({ ...r, to: 'ascii' })), janyToFallback(lowerStr(c.janyLatyn), 'strip'));
    assert.equal(text(convertText({ ...r, to: 'reading', reading: 'cyrillic' })), readInscription(c.runes['jany-enesai'], 'cyrillic'));
  }
});

test('convertText: canonical Latin to runes goes straight, keeping the loan layer', () => {
  for (const c of golden.cases) {
    assert.equal(text(convertText({ text: c.janyLatyn, from: 'latin', to: 'runes' })), c.runes['jany-enesai'], c.cyrillic);
    assert.equal(text(convertText({ text: c.janyLatyn, from: 'latin', to: 'latin' })), c.janyLatyn);
  }
});

test('convertText: CTA Latin to runes goes through Cyrillic; the loan list restores what it can', () => {
  for (const c of golden.cases) {
    const cta = cyrToJany(c.cyrillic, CTA);
    assert.equal(text(convertText({ text: cta, from: 'latin', latinSource: CTA_SOURCE, to: 'runes', restoreLoans: true })), c.runes['jany-enesai'], `${c.cyrillic} (${cta})`);
  }
  assert.equal(text(convertText({ text: 'obyekt', from: 'latin', latinSource: CTA_SOURCE, to: 'cyrillic' })), 'обект');
});

test('convertText: old spelling can only be read; reading is only for runes', () => {
  assert.deepEqual(convertText({ text: '𐰴𐰃𐰻𐰃𐰍', from: 'runes', to: 'cyrillic' }), { ok: false, reason: 'old-spelling' });
  assert.deepEqual(convertText({ text: '𐰴𐰃𐰻𐰃𐰍', from: 'runes', to: 'runes' }), { ok: false, reason: 'old-spelling' });
  assert.equal(text(convertText({ text: '𐰴𐰃𐰻𐰃𐰍', from: 'runes', to: 'reading' })), 'qir¹ig¹');
  assert.deepEqual(convertText({ text: 'кыргыз', from: 'cyrillic', to: 'reading' }), { ok: false, reason: 'not-readable' });
});

test('convertText: empty input and text in other scripts pass through', () => {
  for (const to of ['cyrillic', 'latin', 'ascii', 'runes'] as const) {
    for (const from of ['cyrillic', 'latin', 'runes'] as const) assert.equal(text(convertText({ text: '', from, to })), '');
  }
  assert.equal(text(convertText({ text: 'Windows менен Linux', from: 'cyrillic', to: 'runes' })), 'Windows 𐰢𐰅𐰣𐰅𐰣 Linux');
  assert.equal(text(convertText({ text: '2026: ок!', from: 'cyrillic', to: 'latin' })), '2026: ok!');
});

test('explainConversion: one explanation per rune word of the output, from every source', () => {
  for (const c of golden.cases) {
    for (const [from, src] of [['cyrillic', c.cyrillic], ['latin', c.janyLatyn], ['runes', c.runes['jany-enesai']]] as const) {
      const expl = explainConversion({ text: src, from });
      assert.deepEqual(expl.map((w) => w.runes), runeWords(text(convertText({ text: src, from, to: 'runes' }))), `${c.cyrillic} from ${from}`);
    }
  }
});

test('convertText: a 50,000-character text converts quickly', () => {
  let t = golden.cases.map((c) => c.cyrillic).join(' ');
  while (t.length < 50_000) t += ' ' + t;
  t = t.slice(0, 50_000);
  for (const to of ['latin', 'runes'] as const) {
    const start = performance.now();
    convertText({ text: t, from: 'cyrillic', to });
    assert.ok(performance.now() - start < 250, `${to} took ${(performance.now() - start).toFixed(0)} ms`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd packages/engine && rm -rf dist && npx tsc && node --test dist/test/scripts.test.js`
Expected: FAIL — `Cannot find module '../src/scripts.js'`.

- [ ] **Step 3: Give `explainRunes` a Jany-Latyn source**

In `packages/engine/src/runes/explain.ts`, replace the `explainRunes` function header and its loop head:

```ts
/**
 * Explains each word of the text as the rune stage converts it. From Cyrillic
 * (cyrillicToRunes), only Cyrillic words; from canonical Jany-Latyn
 * (janyLatynToRunes), only words made entirely of Jany-Latyn letters.
 */
export function explainRunes(
  text: string,
  options?: Partial<RuneOptions>,
  source: 'cyrillic' | 'jany-latyn' = 'cyrillic',
): WordExplanation[] {
  const o: RuneOptions = { ...DEFAULT_RUNE_OPTIONS, ...options };
  const out: WordExplanation[] = [];
  const words = source === 'cyrillic' ? /\p{Script=Cyrillic}+/gu : /\p{L}+/gu;
  for (const word of text.normalize('NFC').match(words) ?? []) {
    const janyLatyn = lowerStr(source === 'cyrillic' ? cyrToJany(word) : word);
    if (!isJanyWord(janyLatyn)) continue;
    const cells = wordCells(janyLatyn, o);
```

and in the `out.push(...)` line below, replace `source,` with `source: word,`.

- [ ] **Step 4: Create `packages/engine/src/scripts.ts`**

```ts
// SPDX-License-Identifier: MIT
/**
 * Any-to-any conversion between Kyrgyz Cyrillic, Latin, ASCII, and runes, for the
 * qylym playground (docs/superpowers/specs/2026-10-16-qylym-playground-design.md §4).
 * The hub is Cyrillic. Where both ends are based on canonical Jany-Latyn (runes,
 * canonical Latin), the route goes through canonical Jany-Latyn instead, which
 * loses nothing: obíekt → 𐰆𐰉𐰖𐰅𐰴𐱄, where Cyrillic would give обект → 𐰆𐰉𐰅𐰴𐱄.
 */
import { cyrToJany, janyToCyr, janyToFallback, type JanyOptions } from './convert.js';
import { lowerStr } from './casing.js';
import {
  cyrillicToRunes, janyLatynToRunes, runesToJanyLatyn, runesToCyrillic, readInscription,
  detectSpelling, explainRunes,
  type RuneOptions, type ReaderTarget, type RuneStatus, type WordExplanation,
} from './runes/index.js';

export type SourceScript = 'cyrillic' | 'latin' | 'runes';
export type TargetScript = SourceScript | 'ascii' | 'reading';
/** What a preset claims to be (RUNES-SPEC §3); the Latin presets use the same scale. */
export type SchemeStatus = RuneStatus;

export interface LatinSource {
  yGrapheme: 'y' | 'dotless-i';
  glideGrapheme: 'acute-i' | 'y';
}

export interface DetectedScript {
  script: SourceScript | 'mixed' | 'empty';
  /** For Latin: dotless ı means the CTA-aligned setting, where ы is ı and the glide is y. */
  latin?: LatinSource;
  /** For runes: whether the spelling is modern (plene) or the stones' (RUNES-SPEC §9). */
  spelling?: 'modern' | 'old';
}

const count = (text: string, re: RegExp) => text.match(re)?.length ?? 0;

/** The script holding at least 80% of the letters; 'mixed' when none does, 'empty' with no letters. */
export function detectScript(text: string): DetectedScript {
  const counts: [SourceScript, number][] = [
    ['cyrillic', count(text, /\p{Script=Cyrillic}/gu)],
    ['latin', count(text, /\p{Script=Latin}/gu)],
    ['runes', count(text, /\p{Script=Old_Turkic}/gu)],
  ];
  const total = counts.reduce((n, [, c]) => n + c, 0);
  if (total === 0) return { script: 'empty' };
  const [script, n] = counts.reduce((a, b) => (b[1] > a[1] ? b : a));
  if (n / total < 0.8) return { script: 'mixed' };
  if (script === 'latin') {
    return {
      script,
      latin: /[ıİ]/u.test(text)
        ? { yGrapheme: 'dotless-i', glideGrapheme: 'y' }
        : { yGrapheme: 'y', glideGrapheme: 'acute-i' },
    };
  }
  if (script === 'runes') return { script, spelling: detectSpelling(text) };
  return { script };
}

export type LatinOptions = Required<JanyOptions>;

export const DEFAULT_LATIN_OPTIONS: Readonly<LatinOptions> = Object.freeze({
  vowels: 'latin-umlaut', yGrapheme: 'y', glideGrapheme: 'acute-i', sibilants: 'cedilla',
  signs: 'absorbed', uvularK: 'k', uvularG: 'g', velarNasal: 'eng', affricate: 'j', velarFricative: 'h',
});

/** Every value each Latin option takes, the default first. */
export const LATIN_OPTION_VALUES: { readonly [K in keyof LatinOptions]: readonly LatinOptions[K][] } = Object.freeze({
  vowels: ['latin-umlaut', 'hybrid', 'cyrillic-u', 'draft-macron'], yGrapheme: ['y', 'dotless-i'],
  glideGrapheme: ['acute-i', 'breve-i', 'tilde-i', 'i', 'y'], sibilants: ['cedilla', 'digraph'],
  signs: ['absorbed', 'apostrophe'], uvularK: ['k', 'q'], uvularG: ['g', 'ğ'], velarNasal: ['eng', 'tilde-n'],
  affricate: ['j', 'c'], velarFricative: ['h', 'x'],
});

export interface LatinPreset {
  id: string;
  name: string;
  status: SchemeStatus;
  options: Readonly<LatinOptions>;
}

const latinPreset = (id: string, name: string, status: SchemeStatus, o: JanyOptions): LatinPreset =>
  ({ id, name, status, options: Object.freeze({ ...DEFAULT_LATIN_OPTIONS, ...o }) });

export const LATIN_PRESETS: readonly LatinPreset[] = Object.freeze([
  latinPreset('standard', 'Jany-Latyn', 'proposed', {}),
  // The CTA writes the velar nasal ñ; without it this preset is not the CTA-aligned setting of whitepaper §6.
  latinPreset('cta', 'CTA-aligned', 'comparison', {
    yGrapheme: 'dotless-i', glideGrapheme: 'y', uvularK: 'q', uvularG: 'ğ', affricate: 'c', velarNasal: 'tilde-n',
  }),
  latinPreset('digraph', 'Legacy digraphs', 'comparison', { sibilants: 'digraph', signs: 'apostrophe' }),
  latinPreset('hybrid', 'Hybrid ө', 'comparison', { vowels: 'hybrid' }),
]);

export interface ConvertRequest {
  text: string;
  from: SourceScript;
  to: TargetScript;
  /** Target Latin options. */
  latin?: JanyOptions;
  /** How to read Latin input: detectScript's `latin`. */
  latinSource?: Partial<LatinSource>;
  /** Target rune options. */
  runes?: Partial<RuneOptions>;
  ascii?: 'strip' | 'digraph';
  reading?: ReaderTarget;
  /** Apply the loan-restoration list wherever the route passes back through Cyrillic. */
  restoreLoans?: boolean;
}

export type ConvertResult =
  | { ok: true; text: string }
  | { ok: false; reason: 'old-spelling' | 'not-readable' };

const JANY_LETTERS = new Set([...'abçdefghiíjklmnŋoöprsştuüvyzä']);

/**
 * Whether Latin text can be read as canonical Jany-Latyn as it stands: every letter
 * a Jany-Latyn letter, no "sh" (digraph ш), no apostrophe (apostrophe-mode signs).
 */
function isCanonicalLatin(text: string): boolean {
  const lower = lowerStr(text.normalize('NFC'));
  if (/sh|['’]/u.test(lower)) return false;
  for (const ch of lower) if (/\p{L}/u.test(ch) && !JANY_LETTERS.has(ch)) return false;
  return true;
}

function isStandardLatin(o: JanyOptions | undefined): boolean {
  return (Object.keys(DEFAULT_LATIN_OPTIONS) as (keyof LatinOptions)[])
    .every((k) => (o?.[k] ?? DEFAULT_LATIN_OPTIONS[k]) === DEFAULT_LATIN_OPTIONS[k]);
}

const ok = (text: string): ConvertResult => ({ ok: true, text });

function toCyrillic(r: Omit<ConvertRequest, 'to'>): string {
  if (r.from === 'cyrillic') return r.text;
  if (r.from === 'runes') return runesToCyrillic(r.text, { restoreLoans: r.restoreLoans });
  return janyToCyr(r.text, {
    restoreLoans: r.restoreLoans,
    yGrapheme: r.latinSource?.yGrapheme,
    glideGrapheme: r.latinSource?.glideGrapheme,
  });
}

/** Canonical Jany-Latyn for the input, when it can be had without loss; null otherwise. */
function canonical(r: Omit<ConvertRequest, 'to'>): string | null {
  if (r.from === 'runes') return runesToJanyLatyn(r.text);
  if (r.from === 'latin' && isCanonicalLatin(r.text)) return r.text;
  return null;
}

/**
 * Converts text between any two scripts. Never throws on what a user types: when
 * a conversion is impossible it says why. Old-spelling runes can only be read
 * (RUNES-SPEC §5); reading is only for runes.
 */
export function convertText(r: ConvertRequest): ConvertResult {
  const { text, from, to } = r;
  if (to === 'reading') {
    return from === 'runes' ? ok(readInscription(text, r.reading ?? 'scholarly')) : { ok: false, reason: 'not-readable' };
  }
  if (from === 'runes' && detectSpelling(text) === 'old') return { ok: false, reason: 'old-spelling' };
  if (from === 'cyrillic' && to === 'cyrillic') return ok(text);

  const jl = canonical(r);
  if (jl !== null) {
    if (to === 'runes') return ok(janyLatynToRunes(jl, r.runes));
    if (to === 'latin' && isStandardLatin(r.latin)) return ok(jl);
    if (to === 'ascii') return ok(janyToFallback(jl, r.ascii ?? 'strip'));
  }

  const cyr = toCyrillic(r);
  switch (to) {
    case 'cyrillic': return ok(cyr);
    case 'latin': return ok(cyrToJany(cyr, r.latin));
    case 'ascii': return ok(janyToFallback(cyrToJany(cyr), r.ascii ?? 'strip'));
    case 'runes': return ok(cyrillicToRunes(cyr, r.runes));
  }
  throw new Error(`unknown target script: ${String(to)}`);
}

/**
 * Explanations of the runes convertText writes for this request, one per rune
 * word of the output, by the same route (for the playground's inspector).
 */
export function explainConversion(r: Omit<ConvertRequest, 'to'>): WordExplanation[] {
  if (r.from === 'runes' && detectSpelling(r.text) === 'old') return [];
  const jl = canonical(r);
  if (jl !== null) return explainRunes(jl, r.runes, 'jany-latyn');
  return explainRunes(toCyrillic(r), r.runes);
}
```

- [ ] **Step 5: Export it**

In `packages/engine/package.json`, add to `exports` after `"./runes"`:

```json
    "./scripts": {
      "source": "./src/scripts.ts",
      "types": "./dist/src/scripts.d.ts",
      "default": "./dist/src/scripts.js"
    }
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `cd "$(git rev-parse --show-toplevel)" && npm test 2>&1 | grep -E "^ℹ (tests|pass|fail)|Whitepaper check|^✖"`
Expected: all pass, whitepaper `208/208`. If the CTA → runes golden test fails on a word, that word's loan-layer loss is outside the restoration list: report it (do not edit the fixture), and exclude only that word with a comment naming it.

- [ ] **Step 7: Commit**

```bash
git add packages/engine/src/scripts.ts packages/engine/src/runes/explain.ts packages/engine/package.json packages/engine/test/scripts.test.ts
git commit -m "feat(engine): add jany-latyn/scripts, any-to-any conversion through Cyrillic or canonical Jany-Latyn"
```

---

### Task 3: Web — English fallback for new strings, and the new string sections

**Files:**
- Modify: `apps/web/src/lib/i18n/types.ts`
- Modify: `apps/web/src/lib/i18n/translations.ts` (type annotation; new `en` sections)
- Modify: `apps/web/src/lib/i18n/index.svelte.ts` (merge over English)

**Interfaces:**
- Produces: `i18n.t.site.*`, `i18n.t.scripts.*`, `i18n.t.runic.*` (keys below); every locale returns complete `Translations`.

- [ ] **Step 1: Add the types**

Append to `apps/web/src/lib/i18n/types.ts` before `export interface Translations`:

```ts
export interface SiteTranslations {
  latin: string;
  runic: string;
  latinAlphabet: string;
  latinWhitepaper: string;
  runicAlphabet: string;
  runicProposal: string;
  runicCorpus: string;
  subtitle: string;
  draftBanner: string;
  comingSoon: string;
  comingSoonSource: string;
  moved: string;
}

export interface ScriptsTranslations {
  source: string;
  target: string;
  auto: string;
  autoDetected: string;
  guessing: string;
  swap: string;
  swapOneWay: string;
  cyrillic: string;
  latin: string;
  ascii: string;
  runes: string;
  reading: string;
  oldSpelling: string;
  notReadable: string;
  restoreLoans: string;
  restoreLoansHint: string;
  statusProposed: string;
  statusReference: string;
  statusComparison: string;
  statusExperimental: string;
  showJanyLatyn: string;
  copyForLtr: string;
  readingNotation: string;
  readingScholarly: string;
  readingCta: string;
  readingJanyLatyn: string;
  readingCyrillic: string;
  comparisonTitle: string;
  comparisonHint: string;
  inspectorTitle: string;
  inspectorHint: string;
  inspectorLetter: string;
  inspectorRune: string;
  inspectorName: string;
  inspectorWhy: string;
  governedBy: string;
  seriesBack: string;
  seriesFront: string;
  noVowel: string;
  dropped: string;
  ligature: string;
  close: string;
}

export interface RunicTranslations {
  harmonyLabel: string;
  harmonyNone: string;
  harmonyKg: string;
  harmonyFull: string;
  registerLabel: string;
  registerPlene: string;
  registerEpigraphic: string;
  vowelsLabel: string;
  vowelsDistinct: string;
  vowelsHistorical: string;
  uLabel: string;
  uBash: string;
  uDotted: string;
  uOldHungarian: string;
  zheLabel: string;
  zheChart: string;
  zheFront: string;
  zheEtymological: string;
  loanLabel: string;
  loanChart: string;
  loanNativized: string;
  formsLabel: string;
  formsChart: string;
  formsOrkhon: string;
  formsYenisei: string;
  rLabel: string;
  sLabel: string;
  shLabel: string;
  letterChart: string;
  letterAttested: string;
  yeniseiShLabel: string;
  yeniseiShApart: string;
  yeniseiShMerged: string;
  separatorLabel: string;
  separatorSpace: string;
  separatorTwoDot: string;
  oneWay: string;
  hardToRead: string;
  reversible: string;
  notReversible: string;
}
```

Change `Translations` to:

```ts
export interface Translations {
  nav: NavTranslations;
  playground: PlaygroundTranslations;
  alphabet: AlphabetTranslations;
  about: AboutTranslations;
  consent: ConsentTranslations;
  site: SiteTranslations;
  scripts: ScriptsTranslations;
  runic: RunicTranslations;
}

/** A locale may leave any string out; it then shows the English one. */
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
```

- [ ] **Step 2: Retype `TRANSLATIONS` and add the English sections**

In `apps/web/src/lib/i18n/translations.ts`, change the import and the declaration line:

```ts
import type { BaseLocale, DeepPartial, Translations } from './types.js';

export const TRANSLATIONS: { en: Translations } & Record<Exclude<BaseLocale, 'en'>, DeepPartial<Translations>> = {
```

Inside the `en: { … }` object, after its `consent: { … },` section, add:

```ts
    site: {
      latin: 'Latin',
      runic: 'Runic',
      latinAlphabet: 'Jany-Latyn alphabet',
      latinWhitepaper: 'Whitepaper',
      runicAlphabet: 'Jany-Enesai alphabet',
      runicProposal: 'Proposal (draft)',
      runicCorpus: 'Yenisei Kyrgyz corpus',
      subtitle: 'a lab for writing Kyrgyz in Latin and in runes',
      draftBanner: 'Draft for review. This proposal is under discussion, and its choices may change.',
      comingSoon: 'This page is being prepared.',
      comingSoonSource: 'Until then, the source document is in the repository:',
      moved: 'This page has moved to',
    },
    scripts: {
      source: 'From',
      target: 'To',
      auto: 'Auto',
      autoDetected: 'Auto: {script}',
      guessing: 'Mixed scripts: reading the input as Cyrillic.',
      swap: 'Swap input and output',
      swapOneWay: 'This output cannot be converted back.',
      cyrillic: 'Cyrillic',
      latin: 'Latin',
      ascii: 'ASCII',
      runes: 'Runes',
      reading: 'Reading',
      oldSpelling: "This text is in the stones' spelling: most vowels are left out, so it can be read sign by sign but not converted.",
      notReadable: 'Reading is for rune input.',
      restoreLoans: 'Restore loanwords',
      restoreLoansHint: 'Use the loanword list to restore spellings such as объект and семья.',
      statusProposed: 'proposed',
      statusReference: 'reference',
      statusComparison: 'comparison',
      statusExperimental: 'experimental',
      showJanyLatyn: 'Jany-Latyn line',
      copyForLtr: 'Copy for left-to-right documents',
      readingNotation: 'Notation',
      readingScholarly: 'Scholarly',
      readingCta: 'CTA',
      readingJanyLatyn: 'Jany-Latyn letters',
      readingCyrillic: 'Cyrillic letters',
      comparisonTitle: 'Other presets',
      comparisonHint: 'Words that differ from your output are marked.',
      inspectorTitle: 'Why these runes',
      inspectorHint: 'Tap a word in the output to see why each rune was chosen.',
      inspectorLetter: 'Letter',
      inspectorRune: 'Rune',
      inspectorName: 'Unicode name',
      inspectorWhy: 'Why',
      governedBy: 'by {vowel}',
      seriesBack: 'back series',
      seriesFront: 'front series',
      noVowel: 'no vowel in the word',
      dropped: 'not written',
      ligature: 'in a ligature',
      close: 'Close',
    },
    runic: {
      harmonyLabel: 'Consonant forms',
      harmonyNone: 'One rune per letter (Jany-Enesai)',
      harmonyKg: 'к and г take the form of their vowel',
      harmonyFull: 'Every paired consonant takes the form of its vowel (the chart)',
      registerLabel: 'Spelling',
      registerPlene: 'Every vowel written',
      registerEpigraphic: 'Abbreviated, as on the stones',
      vowelsLabel: 'Vowel letters',
      vowelsDistinct: 'A rune for each Kyrgyz vowel',
      vowelsHistorical: 'One rune per pair, as on the stones',
      uLabel: 'у',
      uBash: '𐱈 ORKHON BASH',
      uDotted: '𐰆 with a dot above',
      uOldHungarian: 'Old Hungarian small u',
      zheLabel: 'ж',
      zheChart: '𐰳, as on the chart',
      zheFront: "𐰙, the chart's front ж, in every syllable",
      zheEtymological: 'The й runes, as Old Turkic yol for жол',
      loanLabel: 'ф, х, в',
      loanChart: '𐰟 𐰝 𐰊, as on the chart',
      loanNativized: 'As п, к, б',
      formsLabel: 'Forms',
      formsChart: 'The chart',
      formsOrkhon: 'The Orkhon monuments',
      formsYenisei: 'The Yenisei Kyrgyz stones (most used)',
      rLabel: 'р',
      sLabel: 'с',
      shLabel: 'ш',
      letterChart: 'As on the chart',
      letterAttested: 'As on the stones',
      yeniseiShLabel: 'ш and back с (Yenisei forms)',
      yeniseiShApart: 'Kept apart: ш 𐱀, с 𐱂',
      yeniseiShMerged: 'Merged, as most stones write',
      separatorLabel: 'Between words',
      separatorSpace: 'Spaces',
      separatorTwoDot: 'The two-dot divider ⁚',
      oneWay: 'one-way',
      hardToRead: 'Hard to read in running text',
      reversible: 'This setting converts back exactly.',
      notReversible: 'This setting is one-way: its output cannot be converted back.',
    },
```

- [ ] **Step 3: Merge every locale over English**

In `apps/web/src/lib/i18n/index.svelte.ts`, replace the line `const KY_JANY_DICTIONARY: Translations = deepConvert(TRANSLATIONS.ky);` with:

```ts
// A locale may leave strings out (new strings are English-only until translated);
// each one is merged over English, so every lookup finds a string.
function mergeTranslations<T>(base: T, over: unknown): T {
  if (typeof base !== 'object' || base === null || typeof over !== 'object' || over === null) {
    return (over ?? base) as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const k of Object.keys(over as object)) {
    out[k] = mergeTranslations((base as Record<string, unknown>)[k], (over as Record<string, unknown>)[k]);
  }
  return out as T;
}

const MERGED: Record<BaseLocale, Translations> = {
  en: TRANSLATIONS.en,
  ky: mergeTranslations(TRANSLATIONS.en, TRANSLATIONS.ky),
  ru: mergeTranslations(TRANSLATIONS.en, TRANSLATIONS.ru),
  tr: mergeTranslations(TRANSLATIONS.en, TRANSLATIONS.tr),
  zh: mergeTranslations(TRANSLATIONS.en, TRANSLATIONS.zh),
};

const KY_JANY_DICTIONARY: Translations = mergeTranslations(TRANSLATIONS.en, deepConvert(TRANSLATIONS.ky));
```

and in the `i18n` object replace the body of `get t()`:

```ts
  get t(): Translations {
    if (currentLocale === 'ky-jany') {
      return KY_JANY_DICTIONARY;
    }
    return MERGED[currentLocale as BaseLocale] ?? MERGED.ky;
  },
```

- [ ] **Step 4: Verify**

Run: `cd "$(git rev-parse --show-toplevel)" && npm run check:web 2>&1 | tail -3`
Expected: `0 ERRORS 0 WARNINGS`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/i18n
git commit -m "feat(web): merge every locale over English, and add the site, scripts and runic strings"
```

---

### Task 4: Web — bundled rune font and rune display helpers

**Files:**
- Create: `apps/web/static/fonts/NotoSansOldTurkic-Regular.ttf`, `apps/web/static/fonts/OFL.txt`
- Create: `apps/web/src/lib/runes.ts`
- Modify: `apps/web/src/app.css`, `LICENSING.md`, `LICENSE`

**Interfaces:**
- Produces: CSS class `runes` and custom property `--font-runes`; from `$lib/runes`: `RUNE_FONT: string` (`'var(--font-runes)'`), `forLtrDocuments(text: string): string`, `RUNE_WORD: RegExp` (one capturing group, `u` flag).

- [ ] **Step 1: Fetch the font and its license**

```bash
mkdir -p apps/web/static/fonts && cd apps/web/static/fonts
# The Noto repository publishes no hinted WOFF2 for this font (that URL is a 404,
# checked 2026-10-16); the hinted TTF is 15 KB, small enough to serve as is.
curl -sSfL -o NotoSansOldTurkic-Regular.ttf "https://cdn.jsdelivr.net/gh/notofonts/notofonts.github.io/fonts/NotoSansOldTurkic/hinted/ttf/NotoSansOldTurkic-Regular.ttf"
curl -sSfL -o OFL.txt "https://cdn.jsdelivr.net/gh/notofonts/old-turkic@main/OFL.txt"
file NotoSansOldTurkic-Regular.*; grep -c "SIL OPEN FONT LICENSE" OFL.txt
```

Expected: `TrueType Font data`, and `1` or more.

- [ ] **Step 2: Declare the font**

Append to `apps/web/src/app.css`:

```css
/* Noto Sans Old Turkic (SIL OFL 1.1, static/fonts/OFL.txt). It covers only the
   runes, so the unicode-range keeps it out of every other character, and ⁚ ⸱
   come from the fonts after it in --font-runes. */
@font-face {
  font-family: "Noto Sans Old Turkic";
  src: url("/fonts/NotoSansOldTurkic-Regular.ttf") format("truetype");
  font-display: swap;
  unicode-range: U+10C00-10C4F;
}

:root {
  --font-runes: "Noto Sans Old Turkic", "Segoe UI Historic", system-ui, sans-serif;
}

.runes {
  font-family: var(--font-runes);
  unicode-bidi: isolate;
}
```

- [ ] **Step 3: Create `apps/web/src/lib/runes.ts`**

```ts
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Display helpers for rune text (JANY-ENESAI.md §26, RUNES-SPEC.md §2).

/** The rune font stack, for inline styles. */
export const RUNE_FONT = 'var(--font-runes)';

const RLI = '⁧';
const PDI = '⁩';

/** Each line wrapped in RLI … PDI, so runes keep their order when pasted into left-to-right documents. */
export function forLtrDocuments(text: string): string {
  return text.split('\n').map((line) => (line ? RLI + line + PDI : line)).join('\n');
}

/** A rune word, as a capturing group, for splitting output into words and the text between them. */
export const RUNE_WORD = /([\p{Script=Old_Turkic}̇\u{10CEA}]+)/u;
```

- [ ] **Step 4: Record the font's license**

In `LICENSING.md`, after the paragraph that begins "The project name and logo are not licensed", add:

```markdown
**Bundled font.** `apps/web/static/fonts/` holds Noto Sans Old Turkic, © The Noto
Project Authors, under the SIL Open Font License 1.1 (`apps/web/static/fonts/OFL.txt`).
It is used unmodified to display runes in the testbed.
```

In `LICENSE`, after the `corpus/scripts/` line, add:

```
  apps/web/static/fonts/  Noto Sans Old Turkic, SIL OFL 1.1 (apps/web/static/fonts/OFL.txt)
```

- [ ] **Step 5: Verify**

Run: `cd "$(git rev-parse --show-toplevel)" && npm run check:web 2>&1 | tail -1 && npm run build:web 2>&1 | tail -2 && ls apps/web/build/fonts/`
Expected: `0 ERRORS`, `✔ done`, and the font and `OFL.txt` listed in `build/fonts/`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/static apps/web/src/app.css apps/web/src/lib/runes.ts LICENSING.md LICENSE
git commit -m "feat(web): bundle Noto Sans Old Turkic and add rune display helpers"
```

---

### Task 5: Web — shared document renderer, new routes, proposal page, redirects

**Files:**
- Create: `apps/web/src/lib/server/markdown.ts`, `apps/web/src/lib/components/DocPage.svelte`, `apps/web/src/lib/components/Redirect.svelte`, `apps/web/src/lib/components/ComingSoon.svelte`
- Create: `apps/web/src/routes/latin/whitepaper/+page.server.ts`, `apps/web/src/routes/latin/whitepaper/+page.svelte`
- Move: `apps/web/src/routes/alphabet/+page.svelte` → `apps/web/src/routes/latin/alphabet/+page.svelte`
- Replace: `apps/web/src/routes/whitepaper/+page.svelte` (redirect), `apps/web/src/routes/alphabet/+page.svelte` (redirect); delete `apps/web/src/routes/whitepaper/+page.server.ts`
- Create: `apps/web/src/routes/runic/proposal/+page.server.ts`, `apps/web/src/routes/runic/proposal/+page.svelte`, `apps/web/src/routes/runic/proposal/images/[name]/+server.ts`, `apps/web/src/routes/runic/alphabet/+page.svelte`, `apps/web/src/routes/runic/corpus/+page.svelte`
- Modify: `apps/web/src/routes/+layout.svelte` (header font picker on both document pages)

**Interfaces:**
- Produces: `findRepoFile(relPath: string): string`, `renderMarkdown(markdown: string, opts?: { imageBase?: string }): { html: string; toc: TocItem[] }`, `TocItem { level: number; text: string; id: string }` (`$lib/server/markdown`); `<DocPage html toc banner?>`; `<Redirect to>`; `<ComingSoon title source>`.

- [ ] **Step 1: Create `apps/web/src/lib/server/markdown.ts`**

Move the whitepaper loader's renderer here, unchanged except for the file lookup and an image renderer:

```ts
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Renders a repository Markdown document for a prerendered page: heading anchors,
// a table of contents of the h2/h3 headings, styled tables, blockquotes and images.
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked, type Tokens } from 'marked';

export interface TocItem {
  level: number;
  text: string;
  id: string;
}

/** Finds a file by its path from the repository root, searching upward from the working directory and from this module. */
export function findRepoFile(relPath: string): string {
  const starts = [process.cwd(), fileURLToPath(new URL('.', import.meta.url))];
  for (const start of starts) {
    let curr = start;
    for (let i = 0; i < 8; i++) {
      const candidate = join(curr, relPath);
      if (existsSync(candidate)) return candidate;
      const parent = resolve(curr, '..');
      if (parent === curr) break;
      curr = parent;
    }
  }
  throw new Error(`${relPath} not found in workspace hierarchy`);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\p{L}\p{N}\s\-_]/gu, '')
    .replace(/\s/g, '-');
}

const attr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** imageBase: where relative image links are served from, e.g. '/runic/proposal/images/'. */
export async function renderMarkdown(markdown: string, opts: { imageBase?: string } = {}): Promise<{ html: string; toc: TocItem[] }> {
  const toc: TocItem[] = [];
  const renderer = new marked.Renderer();

  renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
    const plainText = text.replace(/<[^>]*>/g, '');
    const id = slugify(plainText);
    if (depth === 2 || depth === 3) toc.push({ level: depth, text: plainText, id });
    return `<h${depth} id="${id}" class="scroll-mt-24 font-bold ${
      depth === 1
        ? 'text-2xl sm:text-3xl md:text-4xl mt-6 mb-4 text-base-content border-b border-base-300 pb-3'
        : depth === 2
          ? 'text-xl sm:text-2xl mt-10 mb-3 text-base-content border-b border-base-content/10 pb-2'
          : 'text-lg sm:text-xl mt-6 mb-2 text-base-content/90'
    }"><a href="#${id}" class="hover:underline text-inherit">${text}</a></h${depth}>`;
  };

  renderer.table = (token: Tokens.Table) => {
    const defaultTable = marked.Renderer.prototype.table.call(renderer, token);
    return `<div class="overflow-x-auto my-5 rounded-lg border border-base-300 shadow-xs">${defaultTable.replace(
      '<table>',
      '<table class="table table-zebra table-sm sm:table-md w-full bg-base-100">'
    )}</div>`;
  };

  renderer.blockquote = (token: Tokens.Blockquote) => {
    const body = renderer.parser.parse(token.tokens);
    return `<blockquote class="border-l-4 border-primary/60 bg-primary/5 pl-4 pr-3 py-2.5 my-4 italic rounded-r-lg text-base-content/90">${body}</blockquote>`;
  };

  renderer.image = ({ href, title, text }: Tokens.Image) => {
    const src = opts.imageBase && !/^([a-z][a-z0-9+.-]*:|\/)/i.test(href) ? opts.imageBase + href : href;
    return `<img src="${attr(src)}" alt="${attr(text)}"${title ? ` title="${attr(title)}"` : ''} class="my-4 max-w-full rounded-lg border border-base-300" loading="lazy" />`;
  };

  const html = await marked.parse(markdown, { renderer });
  return { html, toc };
}
```

- [ ] **Step 2: Create `apps/web/src/lib/components/DocPage.svelte`**

Move the body of `routes/whitepaper/+page.svelte` (everything after its `<svelte:head>` block, including the `<style>` block) into this component, with these changes: the `data` prop becomes `html` and `toc` props, an optional `banner` snippet renders above the article, and the article's font stack adds the rune font so rune text in a document displays.

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { TocItem } from '$lib/server/markdown';
  import { i18n } from '$lib/i18n/index.svelte';
  import type { Locale } from '$lib/i18n/types.js';
  import { readingFont } from '$lib/readingFont.svelte';
  import Icon from '$lib/components/Icon.svelte';

  let { html, toc, banner }: { html: string; toc: TocItem[]; banner?: Snippet } = $props();

  const LABELS: Record<Locale, { toc: string; top: string }> = {
    'ky-jany': { toc: 'Mazmunu', top: 'Başyna' },
    ky: { toc: 'Мазмуну', top: 'Башына' },
    ru: { toc: 'Содержание', top: 'Наверх' },
    en: { toc: 'Table of Contents', top: 'Back to top' },
    tr: { toc: 'İçindekiler', top: 'Başa dön' },
    zh: { toc: '目录', top: '返回顶部' }
  };
  const tocTitle = $derived(LABELS[i18n.locale].toc);
  const topTitle = $derived(LABELS[i18n.locale].top);

  let scrollPos = $state(0);
  let showToc = $state(false);
  const showTop = $derived(scrollPos > 400);

  function toTop() {
    showToc = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }
</script>

<svelte:window
  onscroll={() => (scrollPos = window.scrollY)}
  onkeydown={(e) => e.key === 'Escape' && (showToc = false)}
/>
```

followed by the existing markup from `<div class="space-y-6">` to the end of the file, with three replacements:
1. Every `data.toc` becomes `toc`.
2. `{@html data.html}` becomes `{@html html}`.
3. The `<article …>` element gets `style:font-family={`${readingFont.stack}, var(--font-runes)`}` instead of `style:font-family={readingFont.stack}`, and directly before the `<article>` add:

```svelte
    <div class="flex-1 min-w-0 space-y-4">
      {#if banner}{@render banner()}{/if}
```

with a matching `</div>` after `</article>` (remove `flex-1 min-w-0` from the article's own class list, since the wrapper now carries it).

- [ ] **Step 3: Move the whitepaper and the alphabet**

```bash
cd apps/web/src/routes
mkdir -p latin/whitepaper latin/alphabet
git mv alphabet/+page.svelte latin/alphabet/+page.svelte
git rm -q whitepaper/+page.server.ts
```

Create `apps/web/src/routes/latin/whitepaper/+page.server.ts`:

```ts
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { readFile } from 'node:fs/promises';
import { findRepoFile, renderMarkdown } from '$lib/server/markdown';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () =>
  renderMarkdown(await readFile(findRepoFile('docs/WHITEPAPER.md'), 'utf-8'));
```

Create `apps/web/src/routes/latin/whitepaper/+page.svelte`:

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { i18n } from '$lib/i18n/index.svelte';
  import DocPage from '$lib/components/DocPage.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{i18n.t.nav.whitepaper.toUpperCase()} — {i18n.t.nav.siteTitle}</title>
  <meta name="description" content="Jany-Latyn: A Latin Orthography and Comparative Testbed for the Kyrgyz Language. A design proposal, reference implementation, and open testbed." />
</svelte:head>

<DocPage html={data.html} toc={data.toc} />
```

- [ ] **Step 4: Redirect the old addresses**

Create `apps/web/src/lib/components/Redirect.svelte`:

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { i18n } from '$lib/i18n/index.svelte';

  let { to }: { to: string } = $props();

  // Runs as the prerendered page is parsed, before anything else, so the #anchor
  // of an old link survives. Readers without scripting get the meta refresh.
  const forward = $derived(`<script>location.replace(${JSON.stringify(to)} + location.hash)</` + 'script>');

  // A client-side navigation to the old address renders this component without
  // reloading the page; forward it the same way.
  onMount(() => goto(to + location.hash, { replaceState: true }));
</script>

<svelte:head>
  {@html forward}
  <noscript><meta http-equiv="refresh" content="0; url={to}" /></noscript>
  <link rel="canonical" href={to} />
  <meta name="robots" content="noindex" />
</svelte:head>

<p class="py-10 text-center">{i18n.t.site.moved} <a class="link" href={to}>{to}</a></p>
```

Write `apps/web/src/routes/whitepaper/+page.svelte`:

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import Redirect from '$lib/components/Redirect.svelte';
</script>

<Redirect to="/latin/whitepaper/" />
```

Create `apps/web/src/routes/alphabet/+page.svelte` with the same content and `to="/latin/alphabet/"`.

- [ ] **Step 5: The proposal page and its images**

Create `apps/web/src/routes/runic/proposal/+page.server.ts`:

```ts
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { readFile } from 'node:fs/promises';
import { findRepoFile, renderMarkdown } from '$lib/server/markdown';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () =>
  renderMarkdown(await readFile(findRepoFile('docs/jany-enesai/JANY-ENESAI.md'), 'utf-8'), {
    imageBase: '/runic/proposal/images/',
  });
```

Create `apps/web/src/routes/runic/proposal/images/[name]/+server.ts`:

```ts
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// The proposal's figures, served from docs/jany-enesai/ next to the rendered page.
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { error } from '@sveltejs/kit';
import { findRepoFile } from '$lib/server/markdown';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;
export const trailingSlash = 'never';

function figures(): string[] {
  const md = readFileSync(findRepoFile('docs/jany-enesai/JANY-ENESAI.md'), 'utf-8');
  return [...md.matchAll(/!\[[^\]]*\]\(([\w.-]+\.png)\)/g)].map((m) => m[1]);
}

export const entries: EntryGenerator = () => figures().map((name) => ({ name }));

export const GET: RequestHandler = async ({ params }) => {
  if (!figures().includes(params.name)) error(404, 'Not found');
  const bytes = await readFile(findRepoFile(`docs/jany-enesai/${params.name}`));
  return new Response(bytes, { headers: { 'content-type': 'image/png' } });
};
```

Create `apps/web/src/routes/runic/proposal/+page.svelte`:

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { i18n } from '$lib/i18n/index.svelte';
  import DocPage from '$lib/components/DocPage.svelte';
  import Icon from '$lib/components/Icon.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{i18n.t.site.runicProposal} — {i18n.t.nav.siteTitle}</title>
  <meta name="description" content="Jany-Enesai: Modern Kyrgyz in the Old Turkic Script. A draft proposal for review." />
</svelte:head>

<DocPage html={data.html} toc={data.toc}>
  {#snippet banner()}
    <div role="note" class="alert alert-warning">
      <Icon name="alert" />
      <span>{i18n.t.site.draftBanner}</span>
    </div>
  {/snippet}
</DocPage>
```

- [ ] **Step 6: Placeholder pages**

Create `apps/web/src/lib/components/ComingSoon.svelte`:

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { i18n } from '$lib/i18n/index.svelte';

  let { title, source }: { title: string; source: string } = $props();
  const REPO_URL = env.PUBLIC_REPO_URL ?? 'https://github.com/qylymcom/jany-latyn';
</script>

<svelte:head><title>{title} — {i18n.t.nav.siteTitle}</title></svelte:head>

<section class="mx-auto max-w-2xl space-y-3 py-10">
  <h1 class="text-2xl font-semibold">{title}</h1>
  <p>{i18n.t.site.comingSoon}</p>
  <p>{i18n.t.site.comingSoonSource} <a class="link" href="{REPO_URL}/blob/main/{source}">{source}</a></p>
</section>
```

Create `apps/web/src/routes/runic/alphabet/+page.svelte`:

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { i18n } from '$lib/i18n/index.svelte';
  import ComingSoon from '$lib/components/ComingSoon.svelte';
</script>

<ComingSoon title={i18n.t.site.runicAlphabet} source="docs/jany-enesai/JANY-ENESAI.md" />
```

Create `apps/web/src/routes/runic/corpus/+page.svelte` the same way with `title={i18n.t.site.runicCorpus}` and `source="corpus/YENISEI-KYRGYZ-CORPUS.md"`.

- [ ] **Step 7: Header font picker on both documents**

In `apps/web/src/routes/+layout.svelte`, replace:

```ts
  const onWhitepaper = $derived(isActive('/whitepaper/'));
```

with:

```ts
  const onWhitepaper = $derived(isActive('/latin/whitepaper/') || isActive('/runic/proposal/'));
```

- [ ] **Step 8: Verify**

Run: `cd "$(git rev-parse --show-toplevel)" && npm run check:web 2>&1 | tail -1 && npm run build:web 2>&1 | tail -2 && ls apps/web/build/latin apps/web/build/runic apps/web/build/runic/proposal/images && grep -o 'location.replace("/latin/whitepaper/")' apps/web/build/whitepaper/index.html`
Expected: `0 ERRORS`; `✔ done`; `alphabet whitepaper`; `alphabet corpus proposal`; the two `.png` names; the `location.replace` line found.

- [ ] **Step 9: Commit**

```bash
git add -A apps/web/src
git commit -m "feat(web): move the Latin pages under /latin/, add the runic proposal page, and forward the old addresses"
```

---

### Task 6: Web — navbar sections and branding

**Files:**
- Modify: `apps/web/src/routes/+layout.svelte`

**Interfaces:**
- Consumes: `i18n.t.site.*` (Task 3), routes (Task 5).

- [ ] **Step 1: Site name and sections**

In `+layout.svelte`, change `const SITE_NAME = env.PUBLIC_SITE_NAME ?? 'jany-latyn';` to:

```ts
  const SITE_NAME = env.PUBLIC_SITE_NAME ?? 'qylym';
```

Add `import { afterNavigate } from '$app/navigation';` to the imports, and replace the `links` derivation and `isActive` with:

```ts
  type NavLink = { href: string; label: string };
  type NavSection = NavLink | { label: string; items: NavLink[] };

  const sections = $derived<NavSection[]>([
    { href: '/', label: i18n.t.nav.playground },
    {
      label: i18n.t.site.latin,
      items: [
        { href: '/latin/alphabet/', label: i18n.t.site.latinAlphabet },
        { href: '/latin/whitepaper/', label: i18n.t.site.latinWhitepaper },
      ],
    },
    {
      label: i18n.t.site.runic,
      items: [
        { href: '/runic/alphabet/', label: i18n.t.site.runicAlphabet },
        { href: '/runic/proposal/', label: i18n.t.site.runicProposal },
        { href: '/runic/corpus/', label: i18n.t.site.runicCorpus },
      ],
    },
    { href: '/about/', label: i18n.t.nav.about },
  ]);

  function isActive(href: string): boolean {
    const path = page.url.pathname;
    return href === '/' ? path === '/' : path.startsWith(href.replace(/\/$/, ''));
  }

  // The desktop dropdowns are <details>; close them when a link inside is followed.
  afterNavigate(() => {
    document.querySelectorAll('header details[open]').forEach((d) => d.removeAttribute('open'));
  });
```

- [ ] **Step 2: Phone menu**

Replace the phone menu's `{#each links as l}…{/each}` with:

```svelte
        {#each sections as s}
          {#if 'items' in s}
            <li>
              <span class="menu-title">{s.label}</span>
              <ul>
                {#each s.items as l}
                  <li><a href={l.href} class:menu-active={isActive(l.href)}>{l.label}</a></li>
                {/each}
              </ul>
            </li>
          {:else}
            <li><a href={s.href} class:menu-active={isActive(s.href)}>{s.label}</a></li>
          {/if}
        {/each}
```

- [ ] **Step 3: Desktop menu and subtitle**

Replace the desktop `<ul class="menu menu-horizontal menu-sm gap-1">…</ul>` with:

```svelte
    <ul class="menu menu-horizontal menu-sm gap-1">
      {#each sections as s}
        {#if 'items' in s}
          <li>
            <details>
              <summary class:menu-active={s.items.some((l) => isActive(l.href))}>{s.label}</summary>
              <ul class="z-40 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                {#each s.items as l}
                  <li><a href={l.href} class:menu-active={isActive(l.href)}>{l.label}</a></li>
                {/each}
              </ul>
            </details>
          </li>
        {:else}
          <li><a href={s.href} class:menu-active={isActive(s.href)}>{s.label}</a></li>
        {/if}
      {/each}
    </ul>
```

and replace `{i18n.t.nav.scriptSubtitle}` with `{i18n.t.site.subtitle}`.

- [ ] **Step 4: Verify**

Run: `cd "$(git rev-parse --show-toplevel)" && npm run check:web 2>&1 | tail -1 && npm run build:web 2>&1 | tail -1 && grep -c 'href="/runic/proposal/"' apps/web/build/index.html`
Expected: `0 ERRORS`; `✔ done`; `2` (phone and desktop menus).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/routes/+layout.svelte
git commit -m "feat(web): navbar with Latin and Runic sections, and qylym as the default site name"
```

---

### Task 7: Web — playground state

**Files:**
- Create: `apps/web/src/lib/playground/state.svelte.ts`

**Interfaces:**
- Consumes: from `jany-latyn/scripts`: `convertText`, `explainConversion`, `detectScript`, `DEFAULT_LATIN_OPTIONS`, `LATIN_OPTION_VALUES`, `LATIN_PRESETS`, `ConvertResult`, `LatinOptions`, `SchemeStatus`, `SourceScript`, `TargetScript`; from `jany-latyn/runes`: `DEFAULT_RUNE_OPTIONS`, `RUNE_OPTION_VALUES`, `RUNE_PRESETS`, `compareRunes`, `detectSpelling`, `isReversible`, `ReaderTarget`, `RuneOptions`; `compare`, `compareCyrillic` from `jany-latyn/collate`; `upperStr`, `caseModeFor` from `jany-latyn/casing`.
- Produces: `class Playground` with fields `input, source, target, latin, runes, ascii, reading, restoreLoans, allCaps, viewMode, showJanyLatyn` ($state); deriveds `detected, from, guessing, oldSpelling, to, result, output, latinPreset, runePreset, reversible, canSwap, janyLatynLine, comparisons: Comparison[], explanations, list`; methods `convert(to, overrides?)`, `swap()`, `save()`, `restore()`. Types `SourceChoice = 'auto' | SourceScript`, `Comparison = { id: string; name: string; status: SchemeStatus; text: string }`.

- [ ] **Step 1: Create the module**

```ts
// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
/**
 * Playground state (docs/superpowers/specs/2026-10-16-qylym-playground-design.md §3):
 * the input, the source and target pickers, each script's options, and the view
 * settings, with every conversion derived through jany-latyn/scripts. The target
 * and its settings are remembered between visits (§3.8); the page works the same
 * without storage, and stored values are checked before they are used.
 */
import { compare, compareCyrillic } from 'jany-latyn/collate';
import { caseModeFor, upperStr } from 'jany-latyn/casing';
import {
  convertText, detectScript, explainConversion, DEFAULT_LATIN_OPTIONS, LATIN_OPTION_VALUES, LATIN_PRESETS,
  type ConvertResult, type LatinOptions, type SchemeStatus, type SourceScript, type TargetScript,
} from 'jany-latyn/scripts';
import {
  DEFAULT_RUNE_OPTIONS, RUNE_OPTION_VALUES, RUNE_PRESETS, compareRunes, detectSpelling, isReversible,
  type ReaderTarget, type RuneOptions,
} from 'jany-latyn/runes';

export type SourceChoice = 'auto' | SourceScript;
export interface Comparison { id: string; name: string; status: SchemeStatus; text: string }

const STORAGE_KEY = 'qylym_playground';
const TARGETS: readonly TargetScript[] = ['cyrillic', 'latin', 'ascii', 'runes', 'reading'];
const READERS: readonly ReaderTarget[] = ['scholarly', 'cta', 'jany-latyn', 'cyrillic'];

const sameOptions = <T extends object>(a: T, b: T) => (Object.keys(a) as (keyof T)[]).every((k) => a[k] === b[k]);
const textOf = (r: ConvertResult) => (r.ok ? r.text : '');

export class Playground {
  input = $state('');
  source = $state<SourceChoice>('auto');
  target = $state<TargetScript>('latin');
  latin = $state<LatinOptions>({ ...DEFAULT_LATIN_OPTIONS });
  runes = $state<RuneOptions>({ ...DEFAULT_RUNE_OPTIONS });
  ascii = $state<'strip' | 'digraph'>('strip');
  reading = $state<ReaderTarget>('scholarly');
  restoreLoans = $state(false);
  allCaps = $state(false);
  viewMode = $state<'text' | 'list'>('text');
  showJanyLatyn = $state(true);

  readonly detected = $derived(detectScript(this.input));

  /** The script the input is read as: the picker's choice, or the detected one; mixed or empty input reads as Cyrillic. */
  readonly from = $derived<SourceScript>(
    this.source !== 'auto'
      ? this.source
      : this.detected.script === 'latin' || this.detected.script === 'runes'
        ? this.detected.script
        : 'cyrillic',
  );
  readonly guessing = $derived(this.source === 'auto' && this.detected.script === 'mixed');
  readonly oldSpelling = $derived(this.from === 'runes' && detectSpelling(this.input) === 'old');

  /** Old spelling can only be read (§3.2); Reading is only for runes, so other input falls back to Latin. */
  readonly to = $derived<TargetScript>(
    this.oldSpelling ? 'reading' : this.target === 'reading' && this.from !== 'runes' ? 'latin' : this.target,
  );

  readonly latinSource = $derived(this.detected.latin ?? { yGrapheme: 'y' as const, glideGrapheme: 'acute-i' as const });

  convert(to: TargetScript, overrides: { latin?: LatinOptions; runes?: RuneOptions; text?: string } = {}): ConvertResult {
    return convertText({
      text: overrides.text ?? this.input,
      from: this.from,
      to,
      latin: overrides.latin ?? this.latin,
      latinSource: this.latinSource,
      runes: overrides.runes ?? this.runes,
      ascii: this.ascii,
      reading: this.reading,
      restoreLoans: this.restoreLoans,
    });
  }

  private caps(text: string): string {
    return this.allCaps && this.to === 'latin' ? upperStr(text, caseModeFor(this.latin)) : text;
  }

  readonly result = $derived(this.convert(this.to));
  readonly output = $derived(this.caps(textOf(this.result)));

  readonly latinPreset = $derived(LATIN_PRESETS.find((p) => sameOptions(p.options, this.latin)));
  readonly runePreset = $derived(RUNE_PRESETS.find((p) => sameOptions(p.options, this.runes)));
  readonly reversible = $derived(isReversible(this.runes));

  /** Swap needs an output that can be read back as input (§3.7). */
  readonly canSwap = $derived(
    this.result.ok && this.input.trim() !== '' &&
      (this.to === 'cyrillic' || this.to === 'latin' || (this.to === 'runes' && this.reversible)),
  );

  swap(): void {
    if (!this.canSwap) return;
    const output = this.output;
    const newSource = this.to as SourceScript;
    this.target = this.from;
    this.source = this.source === 'auto' ? 'auto' : newSource;
    this.input = output;
  }

  /** The canonical Jany-Latyn beneath rune output (§3.4). */
  readonly janyLatynLine = $derived(
    this.to === 'runes' && this.showJanyLatyn ? textOf(this.convert('latin', { latin: { ...DEFAULT_LATIN_OPTIONS } })) : '',
  );

  /** The target script's other presets (§3.5). */
  readonly comparisons = $derived.by<Comparison[]>(() => {
    if (!this.input.trim()) return [];
    if (this.to === 'latin') {
      return LATIN_PRESETS.filter((p) => p !== this.latinPreset).map((p) => ({
        id: p.id, name: p.name, status: p.status, text: this.caps(textOf(this.convert('latin', { latin: { ...p.options } }))),
      }));
    }
    if (this.to === 'runes') {
      return RUNE_PRESETS.filter((p) => p !== this.runePreset).map((p) => ({
        id: p.id, name: p.name, status: p.status, text: textOf(this.convert('runes', { runes: { ...p.options } })),
      }));
    }
    return [];
  });

  /** One explanation per rune word of the output, for the inspector (§3.6). */
  readonly explanations = $derived(
    this.to === 'runes'
      ? explainConversion({ text: this.input, from: this.from, latinSource: this.latinSource, runes: this.runes, restoreLoans: this.restoreLoans })
      : [],
  );

  private order(script: TargetScript): (a: string, b: string) => number {
    if (script === 'cyrillic') return compareCyrillic;
    if (script === 'runes') return compareRunes;
    if (script === 'latin' || script === 'ascii') return (a, b) => compare(a, b, this.latin);
    return () => 0;
  }

  /** List view: each column sorted by its own script's order (§3.8). */
  readonly list = $derived.by(() => {
    if (this.viewMode !== 'list') return null;
    const lines = this.input.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return null;
    const results = lines.map((line) => this.caps(textOf(this.convert(this.to, { text: line }))));
    return {
      source: [...lines].sort(this.order(this.from)),
      result: results.sort(this.order(this.to)),
    };
  });

  private persisting = false;

  /** Writes the remembered settings; a no-op until restore() has run. */
  save(): void {
    // Read every field before the guard, so the page's $effect subscribes to them
    // on its first run (before restore()) and saves on every later change.
    const snapshot = JSON.stringify({
      target: this.target, latin: this.latin, runes: this.runes, ascii: this.ascii,
      reading: this.reading, showJanyLatyn: this.showJanyLatyn,
    });
    if (!this.persisting) return;
    try {
      localStorage.setItem(STORAGE_KEY, snapshot);
    } catch {
      // Storage blocked: the settings simply aren't remembered.
    }
  }

  /** Reads the remembered settings, keeping only values the options accept. */
  restore(): void {
    let s: Record<string, unknown> | null = null;
    try {
      s = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    } catch {
      s = null;
    }
    if (s && typeof s === 'object') {
      if (TARGETS.includes(s.target as TargetScript)) this.target = s.target as TargetScript;
      if (READERS.includes(s.reading as ReaderTarget)) this.reading = s.reading as ReaderTarget;
      if (s.ascii === 'strip' || s.ascii === 'digraph') this.ascii = s.ascii;
      if (typeof s.showJanyLatyn === 'boolean') this.showJanyLatyn = s.showJanyLatyn;
      const latin = (s.latin ?? {}) as Record<string, unknown>;
      const nextLatin = { ...this.latin } as Record<string, unknown>;
      for (const [k, values] of Object.entries(LATIN_OPTION_VALUES)) {
        if ((values as readonly unknown[]).includes(latin[k])) nextLatin[k] = latin[k];
      }
      this.latin = nextLatin as LatinOptions;
      const runes = (s.runes ?? {}) as Record<string, unknown>;
      const nextRunes = { ...this.runes } as Record<string, unknown>;
      for (const [k, values] of Object.entries(RUNE_OPTION_VALUES)) {
        if ((values as readonly unknown[]).includes(runes[k])) nextRunes[k] = runes[k];
      }
      this.runes = nextRunes as RuneOptions;
    }
    this.persisting = true;
    this.save();
  }
}
```

- [ ] **Step 2: Verify**

Run: `cd "$(git rev-parse --show-toplevel)" && npm run check:web 2>&1 | tail -1`
Expected: `0 ERRORS 0 WARNINGS`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/lib/playground/state.svelte.ts
git commit -m "feat(web): playground state for any-to-any conversion"
```

---

### Task 8: Web — presets and customize panels

**Files:**
- Create: `apps/web/src/lib/playground/PresetBar.svelte`, `apps/web/src/lib/playground/LatinOptions.svelte`, `apps/web/src/lib/playground/RuneOptions.svelte`
- Modify: `apps/web/src/lib/components/Icon.svelte` (add `swap`)

**Interfaces:**
- Consumes: `SchemeStatus`, `LatinOptions` (`jany-latyn/scripts`); `RuneOptions`, `isReversible` (`jany-latyn/runes`); `RUNE_FONT` (`$lib/runes`).
- Produces: `<PresetBar items activeId customizeOpen onSelect onCustomize>` where `items: readonly { id: string; name: string; status: SchemeStatus }[]`; `<LatinOptions opts font onChange>`; `<RuneOptions opts onChange>`; icon name `swap`.

- [ ] **Step 1: Add the swap icon**

In `Icon.svelte`'s `PATHS`, add after `alert`:

```ts
    swap: '<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
```

- [ ] **Step 2: Create `PresetBar.svelte`**

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { SchemeStatus } from 'jany-latyn/scripts';
  import { i18n } from '$lib/i18n/index.svelte';
  import Icon from '$lib/components/Icon.svelte';

  interface Item { id: string; name: string; status: SchemeStatus }
  let {
    items,
    activeId,
    customizeOpen,
    onSelect,
    onCustomize,
  }: {
    items: readonly Item[];
    activeId: string | undefined;
    customizeOpen: boolean;
    onSelect: (id: string) => void;
    onCustomize: () => void;
  } = $props();

  const BADGE: Record<SchemeStatus, string> = {
    proposed: 'badge-primary',
    reference: 'badge-info',
    comparison: 'badge-ghost',
    experimental: 'badge-warning',
  };
  const status = (s: SchemeStatus) =>
    ({
      proposed: i18n.t.scripts.statusProposed,
      reference: i18n.t.scripts.statusReference,
      comparison: i18n.t.scripts.statusComparison,
      experimental: i18n.t.scripts.statusExperimental,
    })[s];
</script>

<div class="flex flex-wrap items-center gap-2">
  <div class="tabs tabs-box tabs-sm flex-wrap bg-base-100" role="tablist">
    {#each items as p (p.id)}
      <button
        type="button"
        role="tab"
        class="tab gap-1.5"
        class:tab-active={activeId === p.id}
        aria-selected={activeId === p.id}
        onclick={() => onSelect(p.id)}
      >
        {p.name}
        <span class="badge badge-xs {BADGE[p.status]}">{status(p.status)}</span>
      </button>
    {/each}
    <button type="button" role="tab" class="tab" class:tab-active={!activeId} aria-selected={!activeId} onclick={onCustomize}>
      {i18n.t.playground.variantCustom}
    </button>
  </div>
  <button type="button" class="btn btn-ghost btn-sm ml-auto gap-2" aria-expanded={customizeOpen} onclick={onCustomize}>
    <Icon name="sliders" />
    <span>{i18n.t.playground.customize}</span>
    <Icon name="chevronDown" class="transition-transform {customizeOpen ? 'rotate-180' : ''}" />
  </button>
</div>
```

- [ ] **Step 3: Create `LatinOptions.svelte`**

This is today's option grid moved out of `+page.svelte` (its `optionRows`, `isDisabled`, `setOption` and the `{#each optionRows as row}…{/each}` markup at `routes/+page.svelte:596-651`), with `opts` read-only and every change reported through `onChange`:

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { LatinOptions } from 'jany-latyn/scripts';
  import {
    resolveYGraphemeChange, resolveGlideGraphemeChange, resolveUvularKChange, hasTildeClash,
  } from 'jany-latyn/testbedPresets';
  import { i18n } from '$lib/i18n/index.svelte';
  import Icon from '$lib/components/Icon.svelte';

  type OptKey = keyof LatinOptions;
  let { opts, font, onChange }: { opts: LatinOptions; font: string; onChange: (next: LatinOptions) => void } = $props();

  interface Choice { value: string; glyph: string; desc: string }
  interface OptionRow { key: OptKey; label: string; choices: Choice[] }

  const optionRows = $derived.by<OptionRow[]>(() => {
    const t = i18n.t.playground;
    return [
      { key: 'vowels', label: t.vowelModeLabel, choices: [
        { value: 'latin-umlaut', glyph: 'ö ü', desc: t.vowelLatinUmlaut },
        { value: 'hybrid', glyph: 'ө ü', desc: t.vowelHybrid },
        { value: 'cyrillic-u', glyph: 'ө ұ', desc: t.vowelCyrillicU },
        { value: 'draft-macron', glyph: 'ө ū', desc: t.vowelMacronU },
      ] },
      { key: 'yGrapheme', label: t.yGraphemeLabel, choices: [
        { value: 'y', glyph: 'y', desc: t.yGraphemeY },
        { value: 'dotless-i', glyph: 'ı', desc: t.yGraphemeDotlessI },
      ] },
      { key: 'glideGrapheme', label: t.glideGraphemeLabel, choices: [
        { value: 'acute-i', glyph: 'í', desc: t.glideGraphemeAcuteI },
        { value: 'breve-i', glyph: 'ĭ', desc: t.glideGraphemeBreveI },
        { value: 'tilde-i', glyph: 'ĩ', desc: t.glideGraphemeTildeI },
        { value: 'i', glyph: 'i', desc: t.glideGraphemePlainI },
        { value: 'y', glyph: 'y', desc: t.glideGraphemeY },
      ] },
      { key: 'sibilants', label: t.sibilantModeLabel, choices: [
        { value: 'cedilla', glyph: 'ç ş', desc: t.sibilantCedilla },
        { value: 'digraph', glyph: 'ch sh', desc: t.sibilantDigraph },
      ] },
      { key: 'signs', label: t.signsModeLabel, choices: [
        { value: 'absorbed', glyph: 'obíekt', desc: t.signsAbsorbed },
        { value: 'apostrophe', glyph: "ob'ekt", desc: t.signsApostrophe },
      ] },
      { key: 'velarNasal', label: t.velarNasalLabel, choices: [
        { value: 'eng', glyph: 'ŋ', desc: t.velarNasalEng },
        { value: 'tilde-n', glyph: 'ñ', desc: t.velarNasalTildeN },
      ] },
      { key: 'uvularK', label: t.uvularKLabel, choices: [
        { value: 'k', glyph: 'k', desc: t.uvularKUnified },
        { value: 'q', glyph: 'k q', desc: t.uvularKAllophonic },
      ] },
      { key: 'uvularG', label: t.uvularGLabel, choices: [
        { value: 'g', glyph: 'g', desc: t.uvularGUnified },
        { value: 'ğ', glyph: 'g ğ', desc: t.uvularGAllophonic },
      ] },
      { key: 'affricate', label: t.affricateLabel, choices: [
        { value: 'j', glyph: 'j', desc: t.affricateUnified },
        { value: 'c', glyph: 'c', desc: t.affricateMechanical },
      ] },
      { key: 'velarFricative', label: t.velarFricativeLabel, choices: [
        { value: 'h', glyph: 'h', desc: t.velarFricativeH },
        { value: 'x', glyph: 'x', desc: t.velarFricativeX },
      ] },
    ];
  });

  // The `y` glide is offered only while ы is written ı (whitepaper §10).
  function isDisabled(key: OptKey, value: string): boolean {
    return key === 'glideGrapheme' && value === 'y' && opts.yGrapheme === 'y';
  }

  function setOption(key: OptKey, value: string) {
    const coupled = { yGrapheme: opts.yGrapheme, glideGrapheme: opts.glideGrapheme, uvularK: opts.uvularK, uvularG: opts.uvularG };
    if (key === 'yGrapheme') onChange({ ...opts, ...resolveYGraphemeChange(coupled, value as LatinOptions['yGrapheme']) });
    else if (key === 'glideGrapheme') onChange({ ...opts, ...resolveGlideGraphemeChange(coupled, value as LatinOptions['glideGrapheme']) });
    else if (key === 'uvularK') onChange({ ...opts, ...resolveUvularKChange(coupled, value as LatinOptions['uvularK']) });
    else onChange({ ...opts, [key]: value } as LatinOptions);
  }

  const stripColon = (label: string) => label.replace(/\s*:\s*$/, '');
</script>

{#each optionRows as row}
  {@const selected = row.choices.find((c) => c.value === opts[row.key])}
  <div class="space-y-1.5">
    <div class="text-sm font-medium">{stripColon(row.label)}</div>
    <div class="join">
      {#each row.choices as c}
        <button
          type="button"
          class="btn btn-sm join-item min-w-11 font-normal {opts[row.key] === c.value ? 'btn-primary' : 'btn-outline border-base-300'}"
          aria-pressed={opts[row.key] === c.value}
          disabled={isDisabled(row.key, c.value)}
          title={isDisabled(row.key, c.value) ? i18n.t.playground.yCollisionDisallowed : c.desc}
          style:font-family={font}
          onclick={() => setOption(row.key, c.value)}
        >
          {c.glyph}
        </button>
      {/each}
    </div>
    <p class="text-xs text-base-content/60">{selected?.desc}</p>
    {#if row.key === 'glideGrapheme' && hasTildeClash(opts)}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="alert" size={14} class="mt-px text-warning" /><span>{i18n.t.playground.tildeClashNote}</span></p>
    {/if}
    {#if row.key === 'uvularK' && opts.uvularK === 'q'}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="info" size={14} class="mt-px text-info" /><span>{i18n.t.playground.uvularKAutoNote}</span></p>
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="alert" size={14} class="mt-px text-warning" /><span>{i18n.t.playground.uvularKWarningLoanwords}</span></p>
    {/if}
    {#if row.key === 'uvularG' && opts.uvularG === 'ğ'}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="alert" size={14} class="mt-px text-warning" /><span>{i18n.t.playground.uvularGWarningLoanwords}</span></p>
    {/if}
    {#if row.key === 'affricate' && opts.affricate === 'c'}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="alert" size={14} class="mt-px text-warning" /><span>{i18n.t.playground.affricateWarningLoanwords}</span></p>
    {/if}
    {#if row.key === 'velarFricative' && opts.velarFricative === 'x'}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="info" size={14} class="mt-px text-info" /><span>{i18n.t.playground.velarFricativeNote}</span></p>
    {/if}
  </div>
{/each}
```

- [ ] **Step 4: Create `RuneOptions.svelte`**

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { isReversible, type RuneOptions } from 'jany-latyn/runes';
  import { i18n } from '$lib/i18n/index.svelte';
  import { RUNE_FONT } from '$lib/runes';
  import Icon from '$lib/components/Icon.svelte';

  type Key = keyof RuneOptions;
  let { opts, onChange }: { opts: RuneOptions; onChange: (next: RuneOptions) => void } = $props();

  interface Choice { value: string; glyph: string; desc: string; oneWay?: boolean; hardToRead?: boolean }
  interface Row { key: Key; label: string; choices: Choice[]; plainGlyph?: boolean }

  // Each choice shows a short sample of what it writes (proposal §14, §18; RUNES-SPEC §4).
  const rows = $derived.by<Row[]>(() => {
    const t = i18n.t.runic;
    const all: Row[] = [
      { key: 'harmony', label: t.harmonyLabel, choices: [
        { value: 'none', glyph: '𐰴𐰇𐰞', desc: t.harmonyNone },
        { value: 'kg', glyph: '𐰚𐰇𐰞', desc: t.harmonyKg },
        { value: 'full', glyph: '𐰜𐰇𐰠', desc: t.harmonyFull },
      ] },
      { key: 'register', label: t.registerLabel, choices: [
        { value: 'plene', glyph: '𐱄𐰅𐰭𐰄𐰺', desc: t.registerPlene },
        { value: 'epigraphic', glyph: '𐱅𐰭𐰼', desc: t.registerEpigraphic, oneWay: true },
      ] },
      { key: 'vowels', label: t.vowelsLabel, choices: [
        { value: 'distinct', glyph: '𐰃 𐰄', desc: t.vowelsDistinct },
        { value: 'historical', glyph: '𐰃', desc: t.vowelsHistorical, oneWay: true },
      ] },
      { key: 'u', label: t.uLabel, choices: [
        { value: 'bash', glyph: '𐱈', desc: t.uBash },
        { value: 'dotted-o', glyph: '𐰆̇', desc: t.uDotted },
        { value: 'old-hungarian', glyph: '\u{10CEA}', desc: t.uOldHungarian },
      ] },
      { key: 'zhe', label: t.zheLabel, choices: [
        { value: 'chart', glyph: '𐰳', desc: t.zheChart },
        { value: 'front', glyph: '𐰙', desc: t.zheFront },
        { value: 'etymological', glyph: '𐰖', desc: t.zheEtymological, oneWay: true },
      ] },
      { key: 'loanConsonants', label: t.loanLabel, choices: [
        { value: 'chart', glyph: '𐰟 𐰝 𐰊', desc: t.loanChart },
        { value: 'nativized', glyph: '𐰯 𐰴 𐰉', desc: t.loanNativized, oneWay: true },
      ] },
      { key: 'forms', label: t.formsLabel, choices: [
        { value: 'chart', glyph: '𐱄 𐰕', desc: t.formsChart },
        { value: 'orkhon', glyph: '𐱃 𐰔', desc: t.formsOrkhon },
        { value: 'yenisei', glyph: '𐰻 𐰎', desc: t.formsYenisei },
      ] },
      { key: 'r', label: t.rLabel, choices: [
        { value: 'chart', glyph: '𐰺', desc: t.letterChart },
        { value: 'attested', glyph: '𐰻', desc: t.letterAttested },
      ] },
      { key: 's', label: t.sLabel, choices: [
        { value: 'chart', glyph: '𐰽', desc: t.letterChart },
        { value: 'attested', glyph: '𐰾', desc: t.letterAttested, hardToRead: true },
      ] },
      { key: 'sh', label: t.shLabel, choices: [
        { value: 'chart', glyph: '𐱁', desc: t.letterChart },
        { value: 'attested', glyph: '𐱀', desc: t.letterAttested, hardToRead: true },
      ] },
      { key: 'yeniseiSh', label: t.yeniseiShLabel, choices: [
        { value: 'apart', glyph: '𐱀 · 𐱂', desc: t.yeniseiShApart },
        { value: 'merged', glyph: '𐱂', desc: t.yeniseiShMerged, oneWay: true },
      ] },
      { key: 'separator', label: t.separatorLabel, plainGlyph: true, choices: [
        { value: 'space', glyph: '␣', desc: t.separatorSpace },
        { value: 'two-dot', glyph: '⁚', desc: t.separatorTwoDot },
      ] },
    ];
    // The Yenisei ш choice only matters with the Yenisei forms.
    return all.filter((r) => r.key !== 'yeniseiSh' || opts.forms === 'yenisei');
  });

  const reversible = $derived(isReversible(opts));
  const set = (key: Key, value: string) => onChange({ ...opts, [key]: value } as RuneOptions);
</script>

{#each rows as row}
  {@const selected = row.choices.find((c) => c.value === opts[row.key])}
  <div class="space-y-1.5">
    <div class="text-sm font-medium">{row.label}</div>
    <div class="join">
      {#each row.choices as c}
        <button
          type="button"
          class="btn btn-sm join-item min-w-11 font-normal {opts[row.key] === c.value ? 'btn-primary' : 'btn-outline border-base-300'}"
          aria-pressed={opts[row.key] === c.value}
          title={c.oneWay ? `${c.desc} (${i18n.t.runic.oneWay})` : c.desc}
          style:font-family={row.plainGlyph ? null : RUNE_FONT}
          onclick={() => set(row.key, c.value)}
        >
          <bdi>{c.glyph}</bdi>
          {#if c.oneWay}<sup class="text-[10px] opacity-70">↛</sup>{/if}
        </button>
      {/each}
    </div>
    <p class="text-xs text-base-content/60">
      {selected?.desc}{#if selected?.oneWay}<span class="ml-1 badge badge-xs badge-warning">{i18n.t.runic.oneWay}</span>{/if}
    </p>
    {#if selected?.hardToRead}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="alert" size={14} class="mt-px text-warning" /><span>{i18n.t.runic.hardToRead}</span></p>
    {/if}
  </div>
{/each}

<p class="flex items-center gap-1.5 text-sm sm:col-span-2 lg:col-span-3 {reversible ? 'text-success' : 'text-warning'}">
  <Icon name={reversible ? 'check' : 'alert'} size={16} />
  {reversible ? i18n.t.runic.reversible : i18n.t.runic.notReversible}
</p>
```

- [ ] **Step 5: Verify**

Run: `cd "$(git rev-parse --show-toplevel)" && npm run check:web 2>&1 | tail -1`
Expected: `0 ERRORS 0 WARNINGS`.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/playground apps/web/src/lib/components/Icon.svelte
git commit -m "feat(web): preset bar and Latin and rune customize panels"
```

---

### Task 9: Web — pickers, input pane, output pane

**Files:**
- Create: `apps/web/src/lib/playground/ScriptPickers.svelte`, `apps/web/src/lib/playground/InputPane.svelte`, `apps/web/src/lib/playground/OutputPane.svelte`

**Interfaces:**
- Consumes: `Playground`, `SourceChoice` (Task 7); `RUNE_FONT`, `RUNE_WORD` (Task 4); `SAMPLE_TEXTS` (`$lib/sample-texts/index`); `Icon`.
- Produces:
  - `<ScriptPickers pg>`
  - `<InputPane pg font showKeyboard onToggleKeyboard bind:textareaRef onSample onFile>` — `onSample(id: string)` and `onFile(name: string, size: number)` report analytics events to the page.
  - `<OutputPane pg font copied hasVoted inspected onCopy onDownload onVote onInspect>` — `onCopy(which: string, text: string)`, `onInspect(index: number)`.

- [ ] **Step 1: Create `ScriptPickers.svelte`**

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { TargetScript } from 'jany-latyn/scripts';
  import { i18n } from '$lib/i18n/index.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import type { Playground, SourceChoice } from './state.svelte';

  let { pg }: { pg: Playground } = $props();

  const t = $derived(i18n.t.scripts);
  const name = (s: string) => ({ cyrillic: t.cyrillic, latin: t.latin, runes: t.runes, ascii: t.ascii, reading: t.reading })[s] ?? s;
  const autoLabel = $derived(
    pg.detected.script === 'cyrillic' || pg.detected.script === 'latin' || pg.detected.script === 'runes'
      ? t.autoDetected.replace('{script}', name(pg.detected.script))
      : t.auto,
  );
  const TARGETS: TargetScript[] = ['cyrillic', 'latin', 'ascii', 'runes', 'reading'];
  const disabled = (s: TargetScript) => (pg.oldSpelling ? s !== 'reading' : s === 'reading' && pg.from !== 'runes');
</script>

<div class="flex flex-wrap items-center gap-2">
  <label class="flex items-center gap-2 text-sm">
    <span class="text-base-content/70">{t.source}</span>
    <select
      class="select select-sm w-auto"
      value={pg.source}
      onchange={(e) => (pg.source = e.currentTarget.value as SourceChoice)}
    >
      <option value="auto">{autoLabel}</option>
      <option value="cyrillic">{t.cyrillic}</option>
      <option value="latin">{t.latin}</option>
      <option value="runes">{t.runes}</option>
    </select>
  </label>

  <button
    type="button"
    class="btn btn-ghost btn-sm btn-square"
    disabled={!pg.canSwap}
    title={pg.canSwap ? t.swap : t.swapOneWay}
    aria-label={t.swap}
    onclick={() => pg.swap()}
  >
    <Icon name="swap" />
  </button>

  <label class="flex items-center gap-2 text-sm">
    <span class="text-base-content/70">{t.target}</span>
    <select
      class="select select-sm w-auto"
      value={pg.to}
      onchange={(e) => (pg.target = e.currentTarget.value as TargetScript)}
    >
      {#each TARGETS as s}
        <option value={s} disabled={disabled(s)}>{name(s)}</option>
      {/each}
    </select>
  </label>

  {#if pg.guessing}
    <span class="text-xs text-warning">{t.guessing}</span>
  {/if}
</div>
{#if pg.oldSpelling}
  <p class="mt-2 flex gap-1.5 text-sm text-base-content/70"><Icon name="info" size={16} class="mt-0.5 text-info" /><span>{t.oldSpelling}</span></p>
{/if}
```

- [ ] **Step 2: Create `InputPane.svelte`**

This is the input `<section>` of today's `+page.svelte` (`:671-780`) and its helpers (`sampleGroups`, `handleFile`, `handleFileInputChange`, `handleDrop`, `sampleTitle`, `handleSampleSelect`, the southern sample), moved, reading and writing `pg` instead of page state:

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { i18n } from '$lib/i18n/index.svelte';
  import { SAMPLE_TEXTS } from '$lib/sample-texts/index';
  import { RUNE_FONT } from '$lib/runes';
  import Icon from '$lib/components/Icon.svelte';
  import type { Playground } from './state.svelte';

  let {
    pg,
    font,
    showKeyboard,
    onToggleKeyboard,
    textareaRef = $bindable(null),
    onSample,
    onFile,
  }: {
    pg: Playground;
    font: string;
    showKeyboard: boolean;
    onToggleKeyboard: () => void;
    textareaRef?: HTMLTextAreaElement | null;
    onSample: (id: string) => void;
    onFile: (name: string, size: number) => void;
  } = $props();

  const SOUTHERN_SAMPLE = '__southern';
  let isDragging = $state(false);
  let fileError = $state<string | null>(null);
  let fileInput = $state<HTMLInputElement | null>(null);
  let copied = $state(false);

  const runeInput = $derived(pg.from === 'runes');
  const wordCount = $derived(pg.input.trim() ? pg.input.trim().split(/\s+/).length : 0);

  const sampleGroups = $derived.by(() => {
    const t = i18n.t.playground;
    const groups = [
      { kind: 'text', label: t.sampleGroupText, items: SAMPLE_TEXTS.filter((s) => (s.kind ?? 'text') === 'text') },
      { kind: 'list', label: t.sampleGroupList, items: SAMPLE_TEXTS.filter((s) => s.kind === 'list') },
    ];
    return pg.viewMode === 'list' ? [groups[1], groups[0]] : groups;
  });

  function sampleTitle(s: (typeof SAMPLE_TEXTS)[number]): string {
    const l = i18n.locale;
    return s.title[l === 'ky-jany' ? 'ky' : l];
  }

  function handleSampleSelect(e: Event) {
    const target = e.currentTarget as HTMLSelectElement;
    if (target.value === SOUTHERN_SAMPLE) {
      // Southern-dialect ä is Latin in the source and passes through unchanged.
      const words = 'äkä källä gäldir, xäräm bolot, ükämdan sura, mäxalläda bar';
      pg.input = pg.input ? `${pg.input} ${words}` : words;
    } else {
      const sample = SAMPLE_TEXTS.find((s) => s.id === target.value);
      if (sample) {
        pg.input = sample.content;
        pg.viewMode = sample.kind === 'list' ? 'list' : 'text';
        onSample(sample.id);
      }
    }
    target.value = '';
  }

  function handleFile(file: File) {
    fileError = null;
    if (file.size > 2 * 1024 * 1024) {
      fileError = i18n.t.playground.fileTooLarge;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        pg.input = reader.result;
        onFile(file.name, file.size);
      }
    };
    reader.readAsText(file, 'utf-8');
  }

  async function copyInput() {
    try {
      await navigator.clipboard.writeText(pg.input);
      copied = true;
      setTimeout(() => (copied = false), 1200);
    } catch {
      copied = false;
    }
  }
</script>

<section
  class="order-1 flex flex-col overflow-hidden rounded-box border bg-base-100 transition-colors {isDragging ? 'border-primary ring-2 ring-primary/30' : 'border-base-300'}"
>
  <header class="flex min-h-12 flex-wrap items-center gap-2 border-b border-base-300 px-3 py-1.5">
    <h2 class="shrink-0 text-sm font-medium">{i18n.t.playground.inputTitle}</h2>
    <div class="join shrink-0" role="group" aria-label={i18n.t.playground.viewModeList}>
      {#each [['text', i18n.t.playground.viewModeText], ['list', i18n.t.playground.viewModeList]] as [value, label]}
        <button
          type="button"
          class="btn btn-xs join-item font-normal {pg.viewMode === value ? 'btn-primary' : 'btn-outline border-base-300'}"
          aria-pressed={pg.viewMode === value}
          onclick={() => (pg.viewMode = value as 'text' | 'list')}
        >
          {label}
        </button>
      {/each}
    </div>
    <div class="ml-auto flex w-full items-center gap-1 sm:w-auto">
      <select class="select select-ghost select-sm min-w-0 flex-1 sm:w-56 sm:flex-none" onchange={handleSampleSelect} aria-label={i18n.t.playground.selectSample}>
        <option value="" disabled selected>{i18n.t.playground.selectSample}</option>
        {#each sampleGroups as group (group.kind)}
          <optgroup label={group.label}>
            {#each group.items as s (s.id)}
              <option value={s.id}>{sampleTitle(s)}</option>
            {/each}
          </optgroup>
        {/each}
        <option value={SOUTHERN_SAMPLE}>{i18n.t.playground.southernHelperTitle.replace(/\s*:\s*$/, '')}</option>
      </select>
      <input
        type="file"
        accept=".txt,.md,text/plain,text/markdown"
        class="hidden"
        bind:this={fileInput}
        onchange={(e) => {
          const t = e.currentTarget as HTMLInputElement;
          const f = t.files?.[0];
          if (f) { handleFile(f); t.value = ''; }
        }}
      />
      <button type="button" class="btn btn-ghost btn-sm btn-square" onclick={() => fileInput?.click()} title={i18n.t.playground.uploadText} aria-label={i18n.t.playground.uploadText}>
        <Icon name="upload" />
      </button>
      <button
        type="button"
        class="btn btn-sm btn-square {showKeyboard ? 'btn-primary' : 'btn-ghost'}"
        onclick={onToggleKeyboard}
        title={i18n.t.playground.keyboardToggle}
        aria-label={i18n.t.playground.keyboardToggle}
        aria-pressed={showKeyboard}
      >
        <Icon name="keyboard" />
      </button>
    </div>
  </header>

  <textarea
    bind:this={textareaRef}
    bind:value={pg.input}
    dir={runeInput ? 'rtl' : 'auto'}
    lang={runeInput ? 'ky-Orkh' : undefined}
    class="h-56 w-full resize-none bg-transparent p-4 text-lg leading-relaxed outline-none placeholder:text-base-content/40 sm:h-72 lg:h-96"
    style:font-family={runeInput ? RUNE_FONT : font}
    placeholder={i18n.t.playground.placeholder}
    aria-label={i18n.t.playground.inputTitle}
    ondragover={(e) => { e.preventDefault(); isDragging = true; }}
    ondragleave={() => (isDragging = false)}
    ondrop={(e) => {
      e.preventDefault();
      isDragging = false;
      const f = e.dataTransfer?.files?.[0];
      if (f) handleFile(f);
    }}
  ></textarea>

  <footer class="flex min-h-10 items-center gap-2 border-t border-base-300 px-3 text-xs text-base-content/60">
    {#if fileError}
      <span class="text-error">{fileError}</span>
    {:else}
      <span>{wordCount} {i18n.t.playground.words} · {[...pg.input].length}</span>
    {/if}
    <div class="ml-auto flex items-center gap-1">
      <button type="button" class="btn btn-ghost btn-xs gap-1" disabled={!pg.input} onclick={copyInput}>
        <Icon name={copied ? 'check' : 'copy'} size={14} />
        {copied ? i18n.t.playground.copied : i18n.t.playground.copyInput}
      </button>
      <button type="button" class="btn btn-ghost btn-xs gap-1" disabled={!pg.input} onclick={() => (pg.input = '')}>
        <Icon name="x" size={14} />
        {i18n.t.playground.clearInput}
      </button>
    </div>
  </footer>
</section>
```

- [ ] **Step 3: Create `OutputPane.svelte`**

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { ReaderTarget } from 'jany-latyn/runes';
  import { i18n } from '$lib/i18n/index.svelte';
  import { RUNE_FONT, RUNE_WORD, forLtrDocuments } from '$lib/runes';
  import Icon from '$lib/components/Icon.svelte';
  import type { Playground } from './state.svelte';

  let {
    pg,
    font,
    copied,
    hasVoted,
    inspected,
    onCopy,
    onDownload,
    onVote,
    onInspect,
  }: {
    pg: Playground;
    font: string;
    copied: string | null;
    hasVoted: boolean;
    inspected: number | null;
    onCopy: (which: string, text: string) => void;
    onDownload: () => void;
    onVote: () => void;
    onInspect: (index: number) => void;
  } = $props();

  const runes = $derived(pg.to === 'runes');
  // Reading output is Latin or Cyrillic letters and reads left to right.
  const rtl = $derived(runes);
  const outFont = $derived(runes ? RUNE_FONT : font);

  // Output split into rune words (odd indices) and the text between them.
  const tokens = $derived(runes ? pg.output.split(RUNE_WORD) : []);

  const READERS: [ReaderTarget, string][] = $derived([
    ['scholarly', i18n.t.scripts.readingScholarly],
    ['cta', i18n.t.scripts.readingCta],
    ['jany-latyn', i18n.t.scripts.readingJanyLatyn],
    ['cyrillic', i18n.t.scripts.readingCyrillic],
  ]);
  const failure = $derived(
    pg.result.ok ? null : pg.result.reason === 'old-spelling' ? i18n.t.scripts.oldSpelling : i18n.t.scripts.notReadable,
  );
</script>

<section class="order-3 flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 lg:order-2">
  <header class="flex min-h-12 flex-wrap items-center gap-2 border-b border-base-300 px-3 py-1.5">
    <h2 class="shrink-0 text-sm font-medium">{i18n.t.playground.outputTitle}</h2>
    <div class="ml-auto flex items-center gap-1">
      {#if pg.to === 'latin'}
        <button
          type="button"
          class="btn btn-sm shrink-0 font-normal {pg.allCaps ? 'btn-primary' : 'btn-ghost'}"
          aria-pressed={pg.allCaps}
          title={i18n.t.playground.allCapsHint}
          onclick={() => (pg.allCaps = !pg.allCaps)}
        >
          {i18n.t.playground.allCaps}
        </button>
      {/if}
      {#if pg.to === 'latin' || pg.to === 'runes' || pg.to === 'ascii'}
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-square {hasVoted ? 'text-error' : ''}"
          disabled={!pg.input.trim() || hasVoted}
          onclick={onVote}
          title={hasVoted ? i18n.t.playground.votedBadge : i18n.t.playground.voteButton}
          aria-label={i18n.t.playground.voteButton}
        >
          <Icon name="heart" filled={hasVoted} />
        </button>
      {/if}
      <button type="button" class="btn btn-ghost btn-sm btn-square" disabled={!pg.output} onclick={onDownload} title={i18n.t.playground.downloadText} aria-label={i18n.t.playground.downloadText}>
        <Icon name="download" />
      </button>
      {#if runes}
        <button type="button" class="btn btn-ghost btn-sm gap-1.5" disabled={!pg.output} onclick={() => onCopy('runes_ltr', forLtrDocuments(pg.output))} title={i18n.t.scripts.copyForLtr}>
          <Icon name={copied === 'runes_ltr' ? 'check' : 'copy'} />
          <span class="hidden sm:inline">{i18n.t.scripts.copyForLtr}</span>
        </button>
      {/if}
      <button type="button" class="btn btn-primary btn-sm gap-1.5" disabled={!pg.output} onclick={() => onCopy('output', pg.output)}>
        <Icon name={copied === 'output' ? 'check' : 'copy'} />
        {copied === 'output' ? i18n.t.playground.copied : copied === 'failed' ? i18n.t.playground.copyFailed : i18n.t.playground.copy}
      </button>
    </div>
  </header>

  <div
    class="h-56 overflow-auto whitespace-pre-wrap break-words p-4 text-lg leading-relaxed sm:h-72 lg:h-96"
    style:font-family={outFont}
    aria-live="polite"
  >
    {#if failure}
      <span class="text-base-content/60">{failure}</span>
    {:else if pg.list}
      <div class="grid grid-cols-[1fr_1fr] gap-x-4 whitespace-normal">
        <div class="sticky top-0 bg-base-100 pb-1 text-xs font-medium text-base-content/60">{i18n.t.playground.listSourceColumn}</div>
        <div class="sticky top-0 bg-base-100 pb-1 text-xs font-medium text-base-content/60">{i18n.t.playground.listResultColumn}</div>
        {#each pg.list.source as entry, i}
          <div class="border-t border-base-200 py-0.5" dir="auto" style:font-family={pg.from === 'runes' ? RUNE_FONT : font}>{entry}</div>
          <div class="border-t border-base-200 py-0.5" dir={rtl ? 'rtl' : 'auto'}>{pg.list.result[i]}</div>
        {/each}
      </div>
    {:else if runes && pg.output}
      <div dir="rtl" lang="ky-Orkh" class="runes" aria-describedby={pg.janyLatynLine ? 'jany-latyn-line' : undefined}>
        {#each tokens as tok, i}{#if i % 2 === 1}<button
              type="button"
              class="inline rounded px-0.5 hover:bg-primary/10 {inspected === (i - 1) / 2 ? 'bg-primary/15' : ''}"
              onclick={() => onInspect((i - 1) / 2)}>{tok}</button>{:else}{tok}{/if}{/each}
      </div>
      {#if pg.janyLatynLine}
        <p id="jany-latyn-line" class="mt-3 border-t border-base-200 pt-2 text-sm text-base-content/50" dir="ltr" style:font-family={font}>{pg.janyLatynLine}</p>
      {/if}
    {:else if pg.output}
      {pg.output}
    {:else}
      <span class="text-base-content/40">{i18n.t.playground.emptyOutput}</span>
    {/if}
  </div>

  <footer class="flex min-h-10 flex-wrap items-center gap-2 border-t border-base-300 px-3 py-1 text-xs text-base-content/60">
    {#if pg.list}
      <span class="basis-full sm:basis-auto">{i18n.t.playground.listHint}</span>
    {/if}
    {#if pg.to === 'ascii'}
      <span class="shrink-0">{i18n.t.playground.fallbackStyleLabel.replace(/\s*:\s*$/, '')}</span>
      <div class="join">
        {#each [['strip', i18n.t.playground.fallbackStyleStrip], ['digraph', i18n.t.playground.fallbackStyleDigraph]] as [value, label]}
          <button type="button" class="btn btn-xs join-item font-normal {pg.ascii === value ? 'btn-primary' : 'btn-outline border-base-300'}" onclick={() => (pg.ascii = value as 'strip' | 'digraph')}>{label}</button>
        {/each}
      </div>
    {:else if pg.to === 'reading'}
      <span class="shrink-0">{i18n.t.scripts.readingNotation}</span>
      <div class="join">
        {#each READERS as [value, label]}
          <button type="button" class="btn btn-xs join-item font-normal {pg.reading === value ? 'btn-primary' : 'btn-outline border-base-300'}" onclick={() => (pg.reading = value)}>{label}</button>
        {/each}
      </div>
    {:else if runes}
      <label class="flex cursor-pointer items-center gap-1.5">
        <input type="checkbox" class="checkbox checkbox-xs" bind:checked={pg.showJanyLatyn} />
        {i18n.t.scripts.showJanyLatyn}
      </label>
    {/if}
    {#if pg.from !== 'cyrillic' && pg.to !== 'reading'}
      <label class="ml-auto flex cursor-pointer items-center gap-1.5" title={i18n.t.scripts.restoreLoansHint}>
        <input type="checkbox" class="checkbox checkbox-xs" bind:checked={pg.restoreLoans} />
        {i18n.t.scripts.restoreLoans}
      </label>
    {/if}
  </footer>
</section>
```

- [ ] **Step 4: Verify**

Run: `cd "$(git rev-parse --show-toplevel)" && npm run check:web 2>&1 | tail -1`
Expected: `0 ERRORS 0 WARNINGS`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/playground
git commit -m "feat(web): script pickers, input pane, and output pane for the playground"
```

---

### Task 10: Web — comparison strip and rune inspector

**Files:**
- Create: `apps/web/src/lib/playground/ComparisonStrip.svelte`, `apps/web/src/lib/playground/RuneInspector.svelte`

**Interfaces:**
- Consumes: `Comparison` (Task 7); `WordExplanation` (`jany-latyn/runes`); `RUNE_FONT`.
- Produces: `<ComparisonStrip entries base runes font copied voted onUse onCopy onVote>` with `voted: (id: string) => boolean`, `onUse(id)`, `onCopy(id, text)`, `onVote(id)`; `<RuneInspector word onClose>` with `word: WordExplanation | undefined`.

- [ ] **Step 1: Create `ComparisonStrip.svelte`**

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { i18n } from '$lib/i18n/index.svelte';
  import { RUNE_FONT } from '$lib/runes';
  import Icon from '$lib/components/Icon.svelte';
  import type { Comparison } from './state.svelte';

  let {
    entries,
    base,
    runes,
    font,
    copied,
    voted,
    onUse,
    onCopy,
    onVote,
  }: {
    entries: Comparison[];
    base: string;
    runes: boolean;
    font: string;
    copied: string | null;
    voted: (id: string) => boolean;
    onUse: (id: string) => void;
    onCopy: (id: string, text: string) => void;
    onVote: (id: string) => void;
  } = $props();

  let expanded = $state<Record<string, boolean>>({});

  // Marks words that differ from the current output, in logical order, so the
  // comparison shows what a preset changes (works the same for runes).
  function diffTokens(text: string): { t: string; diff: boolean }[] {
    const a = text.split(/(\s+|⁚)/);
    const b = base.split(/(\s+|⁚)/);
    const aligned = a.length === b.length;
    return a.map((t, i) => ({ t, diff: aligned && t !== b[i] && /\S/.test(t) && t !== '⁚' }));
  }
  const isLong = (text: string) => text.length > 280 || text.split('\n').length > 3;
</script>

<section class="space-y-3">
  <div>
    <h2 class="text-base font-semibold">{i18n.t.scripts.comparisonTitle}</h2>
    <p class="text-sm text-base-content/60">{i18n.t.scripts.comparisonHint}</p>
  </div>
  <ul class="grid gap-3 md:grid-cols-2">
    {#each entries as e (e.id)}
      {@const open = expanded[e.id]}
      <li class="flex flex-col rounded-box border border-base-300 bg-base-100 p-3 sm:p-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">{e.name}</span>
          <span class="badge badge-xs badge-ghost">{e.status}</span>
          <div class="ml-auto flex items-center gap-0.5">
            <button type="button" class="btn btn-ghost btn-xs btn-square {voted(e.id) ? 'text-error' : ''}" disabled={voted(e.id)} onclick={() => onVote(e.id)} title={voted(e.id) ? i18n.t.playground.votedBadge : i18n.t.playground.voteButton} aria-label={i18n.t.playground.voteButton}>
              <Icon name="heart" size={14} filled={voted(e.id)} />
            </button>
            <button type="button" class="btn btn-ghost btn-xs btn-square" onclick={() => onCopy(e.id, e.text)} title={i18n.t.playground.copy} aria-label={i18n.t.playground.copy}>
              <Icon name={copied === e.id ? 'check' : 'copy'} size={14} />
            </button>
            <button type="button" class="btn btn-outline btn-xs ml-1" onclick={() => onUse(e.id)}>{i18n.t.playground.useVariant}</button>
          </div>
        </div>
        <p
          class="mt-2 whitespace-pre-wrap break-words text-base leading-relaxed {open ? 'max-h-96 overflow-auto' : 'line-clamp-3'}"
          dir={runes ? 'rtl' : 'auto'}
          lang={runes ? 'ky-Orkh' : undefined}
          style:font-family={runes ? RUNE_FONT : font}
        >
          {#each diffTokens(e.text) as tok}{#if tok.diff}<mark class="rounded-sm bg-warning/30 text-inherit">{tok.t}</mark>{:else}{tok.t}{/if}{/each}
        </p>
        {#if isLong(e.text)}
          <button type="button" class="link link-hover mt-1 self-start text-xs text-base-content/60" onclick={() => (expanded[e.id] = !open)}>
            {open ? i18n.t.playground.showLess : i18n.t.playground.showMore}
          </button>
        {/if}
      </li>
    {/each}
  </ul>
</section>
```

- [ ] **Step 2: Create `RuneInspector.svelte`**

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { WordExplanation } from 'jany-latyn/runes';
  import { i18n } from '$lib/i18n/index.svelte';
  import { RUNE_FONT } from '$lib/runes';
  import Icon from '$lib/components/Icon.svelte';

  let { word, onClose }: { word: WordExplanation | undefined; onClose: () => void } = $props();
  const t = $derived(i18n.t.scripts);
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && onClose()} />

<section class="rounded-box border border-primary/40 bg-base-100 p-3 sm:p-4" aria-label={t.inspectorTitle}>
  <div class="flex items-center gap-3">
    <h2 class="text-base font-semibold">{t.inspectorTitle}</h2>
    {#if word}
      <span class="text-sm text-base-content/70">{word.source} · {word.janyLatyn} ·
        <bdi class="runes text-lg" style:font-family={RUNE_FONT}>{word.runes}</bdi></span>
    {/if}
    <button type="button" class="btn btn-ghost btn-xs btn-square ml-auto" onclick={onClose} aria-label={t.close} title={t.close}>
      <Icon name="x" size={14} />
    </button>
  </div>
  {#if word}
    <div class="mt-2 overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr><th>{t.inspectorLetter}</th><th>{t.inspectorRune}</th><th>{t.inspectorName}</th><th>{t.inspectorWhy}</th></tr>
        </thead>
        <tbody>
          {#each word.letters as l}
            <tr>
              <td class="font-mono">{l.letter}</td>
              <td class="text-xl" style:font-family={RUNE_FONT}><bdi>{l.rune}</bdi></td>
              <td class="text-xs">{l.names.join(' + ')}</td>
              <td class="text-xs">
                {#if l.dropped}<span class="badge badge-xs">{t.dropped}</span>
                {:else if l.ligature}<span class="badge badge-xs badge-info">{t.ligature}</span>{/if}
                {#if l.kind === 'consonant'}
                  {l.series === 'front' ? t.seriesFront : t.seriesBack},
                  {l.governor === null ? t.noVowel : t.governedBy.replace('{vowel}', word.letters[l.governor].letter)}
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <p class="mt-1 text-sm text-base-content/60">{t.inspectorHint}</p>
  {/if}
</section>
```

- [ ] **Step 3: Verify**

Run: `cd "$(git rev-parse --show-toplevel)" && npm run check:web 2>&1 | tail -1`
Expected: `0 ERRORS 0 WARNINGS`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/lib/playground
git commit -m "feat(web): comparison strip and rune inspector"
```

---

### Task 11: Web — compose the playground page; analytics for runes

**Files:**
- Replace: `apps/web/src/routes/+page.svelte`
- Modify: `apps/web/src/lib/components/VoteModal.svelte`

**Interfaces:**
- Consumes: everything from Tasks 7–10; `LATIN_PRESETS` (`jany-latyn/scripts`); `RUNE_PRESETS`, `RUNE_OPTION_VALUES`, `RuneOptions` (`jany-latyn/runes`); `FontSelect`, `VirtualKeyboard`, `VoteModal`.
- Produces: `VoteModal` props `script?: 'latin' | 'runes'` (default `'latin'`) and `runeOptions?: RuneOptions`.

- [ ] **Step 1: Teach the vote modal about runes**

In `VoteModal.svelte`, add `import type { RuneOptions } from 'jany-latyn/runes';`, add to the props destructuring and its type:

```ts
    script = 'latin',
    runeOptions,
```

```ts
    script?: 'latin' | 'runes';
    runeOptions?: RuneOptions;
```

and replace the `posthog.capture('variant_voted', { … })` call with:

```ts
      posthog.capture('variant_voted', {
        preset: presetName,
        target_card: targetCard,
        script,
        ...(script === 'runes' && runeOptions
          ? { rune_preset: presetName, rune_options: { ...runeOptions } }
          : {
              vowels: options.vowels ?? 'latin-umlaut',
              y_grapheme: options.yGrapheme ?? 'y',
              glide_grapheme: options.glideGrapheme ?? 'acute-i',
              sibilants: options.sibilants ?? 'cedilla',
              signs: options.signs ?? 'absorbed',
              uvular_k: options.uvularK ?? 'k',
              velar_nasal: options.velarNasal ?? 'eng',
              uvular_g: options.uvularG ?? 'g',
              affricate: options.affricate ?? 'j',
              velar_fricative: options.velarFricative ?? 'h',
            }),
        reason_id: selectedReason,
        custom_note: customNote.trim() || undefined,
        text_length: sampleLength
      });
```

In the summary badges block, wrap the existing Latin badges in `{#if script === 'latin'} … {:else}<span class="badge badge-sm badge-neutral">{presetName}</span>{/if}`.

- [ ] **Step 2: Replace `apps/web/src/routes/+page.svelte`**

```svelte
<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  import type { JanyOptions } from 'jany-latyn/convert';
  import { getProbeForVowelMode } from '$lib/fontcheck';
  import { LATIN_PRESETS } from 'jany-latyn/scripts';
  import { RUNE_PRESETS, RUNE_OPTION_VALUES, type RuneOptions } from 'jany-latyn/runes';
  import { DEFAULT_FONT } from '$lib/fonts';
  import { i18n } from '$lib/i18n/index.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import FontSelect from '$lib/components/FontSelect.svelte';
  import VirtualKeyboard from '$lib/components/VirtualKeyboard.svelte';
  import VoteModal from '$lib/components/VoteModal.svelte';
  import { Playground } from '$lib/playground/state.svelte';
  import ScriptPickers from '$lib/playground/ScriptPickers.svelte';
  import PresetBar from '$lib/playground/PresetBar.svelte';
  import LatinOptions from '$lib/playground/LatinOptions.svelte';
  import RuneOptionsPanel from '$lib/playground/RuneOptions.svelte';
  import InputPane from '$lib/playground/InputPane.svelte';
  import OutputPane from '$lib/playground/OutputPane.svelte';
  import ComparisonStrip from '$lib/playground/ComparisonStrip.svelte';
  import RuneInspector from '$lib/playground/RuneInspector.svelte';
  import posthog from 'posthog-js';

  const SITE_NAME = env.PUBLIC_SITE_NAME ?? 'qylym';
  // The orthography's name, which is not the site's brand: the standard Latin preset is named after it.
  const SCRIPT_NAME = env.PUBLIC_SCRIPT_TITLE ?? 'Jany-Latyn';

  const pg = new Playground();

  let font = $state(DEFAULT_FONT);
  let showCustomize = $state(false);
  let showKeyboard = $state(false);
  let keyboardHeight = $state(0);
  let copied = $state<string | null>(null);
  let inspected = $state<number | null>(null);
  let textareaRef = $state<HTMLTextAreaElement | null>(null);

  onMount(() => {
    pg.restore();
    try {
      const stored = localStorage.getItem('jany_voted_combinations');
      if (stored) votedCombinations = JSON.parse(stored);
    } catch {}
  });

  // Remember the target and its settings (a no-op until restore() has run).
  $effect(() => {
    pg.save();
  });

  // A new output closes the inspector.
  $effect(() => {
    void pg.output;
    inspected = null;
  });

  // ---- Presets -----------------------------------------------------------

  // Analytics identifiers of the Latin presets, unchanged so earlier events and votes still match.
  const LATIN_META: Record<string, { card: string; voteName: string }> = {
    standard: { card: 'compModern', voteName: SCRIPT_NAME },
    cta: { card: 'compCTA', voteName: 'CTA-aligned' },
    digraph: { card: 'compDigraph', voteName: 'Legacy Digraphs' },
    hybrid: { card: 'compHybrid', voteName: 'Hybrid ө' },
  };

  function latinName(id: string): string {
    const t = i18n.t.playground;
    return ({ standard: SCRIPT_NAME, cta: t.ctaPresetLabel, digraph: t.variantDigraphs, hybrid: t.variantHybrid } as Record<string, string>)[id] ?? id;
  }

  function latinDesc(id: string | undefined): string {
    const t = i18n.t.playground;
    if (!id) return t.descCustom;
    return ({ standard: t.descStandard, cta: t.descCta, digraph: t.descDigraphs, hybrid: t.descHybrid } as Record<string, string>)[id] ?? '';
  }

  const latinItems = $derived(LATIN_PRESETS.map((p) => ({ id: p.id, name: latinName(p.id), status: p.status })));
  const runeItems = RUNE_PRESETS.map((p) => ({ id: p.id, name: p.name, status: p.status }));

  function applyLatin(id: string) {
    const p = LATIN_PRESETS.find((x) => x.id === id);
    if (p) pg.latin = { ...p.options };
  }
  function applyRunes(id: string) {
    const p = RUNE_PRESETS.find((x) => x.id === id);
    if (p) pg.runes = { ...p.options };
  }

  const presetId = $derived(
    pg.to === 'latin' ? (pg.latinPreset?.id ?? 'custom') : pg.to === 'runes' ? (pg.runePreset?.id ?? 'custom') : pg.to,
  );

  // Compact glyph summary of the Latin options, e.g. "ö/ü · y · í · ç/ş · k"
  function summary(o: Required<JanyOptions>): string {
    const vowels = { 'latin-umlaut': 'ö/ü', hybrid: 'ө/ü', 'cyrillic-u': 'ө/ұ', 'draft-macron': 'ө/ū' }[o.vowels];
    const glide = { 'acute-i': 'í', 'breve-i': 'ĭ', 'tilde-i': 'ĩ', i: 'i', y: 'y' }[o.glideGrapheme];
    return [
      vowels, o.yGrapheme === 'dotless-i' ? 'ı' : 'y', glide, o.sibilants === 'cedilla' ? 'ç/ş' : 'ch/sh',
      o.uvularK === 'q' ? 'k/q' : 'k', o.uvularG === 'ğ' ? 'g/ğ' : 'g', o.affricate === 'c' ? 'c' : 'j',
      o.velarNasal === 'tilde-n' ? 'ñ' : 'ŋ', o.velarFricative === 'x' ? 'x' : 'h',
    ].join(' · ');
  }

  const activeProbe = $derived(
    getProbeForVowelMode(pg.latin.vowels) +
      ({ 'breve-i': 'ĭĬ', 'tilde-i': 'ĩĨ' }[pg.latin.glideGrapheme as string] ?? '') +
      (pg.latin.velarNasal === 'tilde-n' ? 'ñÑ' : ''),
  );

  // ---- Voting ------------------------------------------------------------

  let voteModalOpen = $state(false);
  let voteTarget = $state<{ card: string; presetName: string; script: 'latin' | 'runes'; latin: JanyOptions; runes?: RuneOptions }>({
    card: 'primary_output', presetName: SCRIPT_NAME, script: 'latin', latin: {},
  });
  let votedCombinations = $state<Record<string, boolean>>({});

  // Key format predates velarNasal, uvularG, affricate, and velarFricative; they are appended only when
  // non-default so earlier stored votes still match. Rune keys carry a prefix of their own.
  function combinationKey(script: 'latin' | 'runes', o: JanyOptions, runes?: RuneOptions, isAscii = false): string {
    if (script === 'runes' && runes) {
      return 'runes:' + (Object.keys(RUNE_OPTION_VALUES) as (keyof RuneOptions)[]).map((k) => runes[k]).join('|');
    }
    const parts: string[] = [
      o.vowels ?? 'latin-umlaut', o.yGrapheme ?? 'y', o.glideGrapheme ?? 'acute-i',
      o.sibilants ?? 'cedilla', o.signs ?? 'absorbed', o.uvularK ?? 'k',
    ];
    if (o.velarNasal && o.velarNasal !== 'eng') parts.push(o.velarNasal);
    if (o.uvularG && o.uvularG !== 'g') parts.push(`uvularG-${o.uvularG}`);
    if (o.affricate && o.affricate !== 'j') parts.push(`affricate-${o.affricate}`);
    if (o.velarFricative && o.velarFricative !== 'h') parts.push(`velarFricative-${o.velarFricative}`);
    const key = parts.join('|');
    return isAscii ? `ascii:${key}` : key;
  }

  const outputCard = $derived(pg.to === 'ascii' ? 'compAscii' : pg.to === 'runes' ? 'primary_output_runes' : 'primary_output');
  const outputScript = $derived<'latin' | 'runes'>(pg.to === 'runes' ? 'runes' : 'latin');
  const hasVotedOutput = $derived(Boolean(votedCombinations[combinationKey(outputScript, pg.latin, pg.runes, pg.to === 'ascii')]));

  function openVote(card: string, script: 'latin' | 'runes', presetName: string, latin: JanyOptions, runes?: RuneOptions) {
    if (votedCombinations[combinationKey(script, latin, runes, card === 'compAscii')]) return;
    voteTarget = { card, presetName, script, latin: { ...latin }, runes: runes ? { ...runes } : undefined };
    voteModalOpen = true;
  }

  function voteForOutput() {
    if (pg.to === 'runes') openVote(outputCard, 'runes', pg.runePreset?.name ?? 'Custom', {}, pg.runes);
    else if (pg.to === 'ascii') openVote('compAscii', 'latin', 'ASCII Fallback', pg.latin);
    else openVote('primary_output', 'latin', pg.latinPreset ? LATIN_META[pg.latinPreset.id].voteName : 'Custom', pg.latin);
  }

  function comparisonVoted(id: string): boolean {
    if (pg.to === 'runes') {
      const p = RUNE_PRESETS.find((x) => x.id === id)!;
      return Boolean(votedCombinations[combinationKey('runes', {}, { ...p.options })]);
    }
    const p = LATIN_PRESETS.find((x) => x.id === id)!;
    return Boolean(votedCombinations[combinationKey('latin', p.options)]);
  }

  function voteForComparison(id: string) {
    if (pg.to === 'runes') {
      const p = RUNE_PRESETS.find((x) => x.id === id)!;
      openVote(`rune_${p.id}`, 'runes', p.name, {}, { ...p.options });
    } else {
      const p = LATIN_PRESETS.find((x) => x.id === id)!;
      openVote(LATIN_META[p.id].card, 'latin', LATIN_META[p.id].voteName, p.options);
    }
  }

  function handleVoteSubmitted(card: string) {
    votedCombinations[combinationKey(voteTarget.script, voteTarget.latin, voteTarget.runes, card === 'compAscii')] = true;
    try {
      localStorage.setItem('jany_voted_combinations', JSON.stringify(votedCombinations));
    } catch {}
  }

  // ---- Actions -----------------------------------------------------------

  function track(event: string, props: Record<string, unknown> = {}) {
    if (posthog.__loaded) {
      posthog.capture(event, { source_script: pg.from, target_script: pg.to, preset: presetId, ...props });
    }
  }

  async function copy(which: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      copied = which;
      track('text_copied', { copy_target: which });
    } catch {
      copied = 'failed';
    }
    setTimeout(() => (copied = null), 1200);
  }

  function download() {
    const text = pg.list ? pg.list.result.join('\n') : pg.output;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pg.to === 'runes' ? 'jany-enesai' : 'jany-latyn'}-${presetId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    track('file_downloaded', { text_length: text.length });
  }

  function handleKeyboardInsert(char: string) {
    if (!textareaRef) {
      pg.input = char === '\b' ? pg.input.slice(0, -1) : pg.input + char;
      return;
    }
    const start = textareaRef.selectionStart ?? pg.input.length;
    const end = textareaRef.selectionEnd ?? pg.input.length;
    let caret = start;
    if (char === '\b') {
      if (start === end && start > 0) {
        pg.input = pg.input.slice(0, start - 1) + pg.input.slice(end);
        caret = start - 1;
      } else if (start !== end) {
        pg.input = pg.input.slice(0, start) + pg.input.slice(end);
      }
    } else {
      pg.input = pg.input.slice(0, start) + char + pg.input.slice(end);
      caret = start + char.length;
    }
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.selectionStart = textareaRef.selectionEnd = caret;
        textareaRef.focus();
      }
    }, 0);
  }
</script>

<h1 class="sr-only">{SITE_NAME}</h1>

<div class="space-y-5" style:padding-bottom={keyboardHeight ? `${keyboardHeight}px` : null}>
  <section class="space-y-3 rounded-box border border-base-300 bg-base-200/60 p-3 sm:p-4">
    <div class="flex flex-wrap items-center gap-3">
      <ScriptPickers {pg} />
      {#if pg.to === 'latin' || pg.from === 'latin'}
        <div class="ml-auto"><FontSelect bind:value={font} probe={activeProbe} location="playground" /></div>
      {/if}
    </div>

    {#if pg.to === 'latin'}
      <PresetBar items={latinItems} activeId={pg.latinPreset?.id} customizeOpen={showCustomize} onSelect={applyLatin} onCustomize={() => (showCustomize = !showCustomize)} />
      <p class="text-sm text-base-content/70">
        {latinDesc(pg.latinPreset?.id)}
        <span class="ml-1 font-mono text-xs text-base-content/50">{summary(pg.latin)}</span>
      </p>
      {#if showCustomize}
        <div class="grid gap-x-8 gap-y-5 border-t border-base-300 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <LatinOptions opts={pg.latin} {font} onChange={(next) => (pg.latin = next)} />
          <div class="flex items-end sm:col-span-2 lg:col-span-3">
            <button type="button" class="btn btn-ghost btn-sm gap-2" disabled={pg.latinPreset?.id === 'standard'} onclick={() => applyLatin('standard')}>
              <Icon name="reset" />{i18n.t.playground.resetOptions}
            </button>
          </div>
        </div>
      {/if}
    {:else if pg.to === 'runes'}
      <PresetBar items={runeItems} activeId={pg.runePreset?.id} customizeOpen={showCustomize} onSelect={applyRunes} onCustomize={() => (showCustomize = !showCustomize)} />
      {#if showCustomize}
        <div class="grid gap-x-8 gap-y-5 border-t border-base-300 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <RuneOptionsPanel opts={pg.runes} onChange={(next) => (pg.runes = next)} />
          <div class="flex items-end sm:col-span-2 lg:col-span-3">
            <button type="button" class="btn btn-ghost btn-sm gap-2" disabled={pg.runePreset?.id === 'jany-enesai'} onclick={() => applyRunes('jany-enesai')}>
              <Icon name="reset" />{i18n.t.playground.resetOptions}
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </section>

  <div class="grid gap-4 lg:grid-cols-2">
    <InputPane
      {pg}
      {font}
      {showKeyboard}
      onToggleKeyboard={() => (showKeyboard = !showKeyboard)}
      bind:textareaRef
      onSample={(id) => track('sample_selected', { sample_id: id })}
      onFile={(name, size) => track('file_uploaded', { file_name: name, file_size: size })}
    />
    <OutputPane
      {pg}
      {font}
      {copied}
      hasVoted={hasVotedOutput}
      {inspected}
      onCopy={copy}
      onDownload={download}
      onVote={voteForOutput}
      onInspect={(i) => (inspected = i)}
    />
  </div>

  {#if pg.to === 'runes' && pg.output}
    {#if inspected !== null}
      <RuneInspector word={pg.explanations[inspected]} onClose={() => (inspected = null)} />
    {:else}
      <p class="text-sm text-base-content/60">{i18n.t.scripts.inspectorHint}</p>
    {/if}
  {/if}

  {#if pg.comparisons.length}
    <ComparisonStrip
      entries={pg.comparisons}
      base={pg.output}
      runes={pg.to === 'runes'}
      {font}
      {copied}
      voted={comparisonVoted}
      onUse={(id) => (pg.to === 'runes' ? applyRunes(id) : applyLatin(id))}
      onCopy={copy}
      onVote={voteForComparison}
    />
  {/if}
</div>

<VoteModal
  isOpen={voteModalOpen}
  options={voteTarget.latin}
  script={voteTarget.script}
  runeOptions={voteTarget.runes}
  presetName={voteTarget.presetName}
  targetCard={voteTarget.card}
  sampleLength={pg.input.length}
  alreadyVoted={Boolean(votedCombinations[combinationKey(voteTarget.script, voteTarget.latin, voteTarget.runes, voteTarget.card === 'compAscii')])}
  onClose={() => (voteModalOpen = false)}
  onVoteSubmitted={handleVoteSubmitted}
/>

{#if showKeyboard}
  <VirtualKeyboard
    activeVowels={pg.latin.vowels}
    activeY={pg.latin.yGrapheme}
    activeGlide={pg.latin.glideGrapheme}
    activeSibilants={pg.latin.sibilants}
    activeK={pg.latin.uvularK}
    activeG={pg.latin.uvularG}
    activeNasal={pg.latin.velarNasal}
    onInsert={handleKeyboardInsert}
    onClose={() => (showKeyboard = false)}
    onHeightChange={(h) => (keyboardHeight = h)}
  />
{/if}
```

- [ ] **Step 3: Verify**

Run: `cd "$(git rev-parse --show-toplevel)" && npm run check:web 2>&1 | tail -1 && npm run build:web 2>&1 | tail -1`
Expected: `0 ERRORS 0 WARNINGS`; `✔ done`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/routes/+page.svelte apps/web/src/lib/components/VoteModal.svelte
git commit -m "feat(web): any-to-any playground, with votes and events covering the rune presets"
```

---

### Task 12: Docs, full verification, browser pass

**Files:**
- Modify: `README.md`, `CHANGELOG.md`, `AGENTS.md`, `docs/superpowers/specs/2026-10-16-qylym-playground-design.md` (§4.1 fallback wording)

- [ ] **Step 1: Align the spec with the implemented fallback**

In the spec §4.1, replace "The playground then keeps the previous detection, or falls back to Cyrillic, and says it is guessing." with "The playground then reads the input as Cyrillic and says it is guessing." (Task 7 implements this simpler, predictable rule.)

- [ ] **Step 2: README**

In `README.md`, replace the first paragraph's last sentence ("It comes with a deterministic conversion engine and a web testbed in which every contested orthographic choice is a selectable option.") with:

```markdown
It comes with a deterministic conversion engine and **qylym**, a web lab for writing Kyrgyz in
Latin and in runes: its playground converts between Cyrillic, any Latin variant, ASCII and
Old Turkic runes, and every contested choice is a selectable option.
```

In the "From code" block, add after the existing import example:

```ts
import { convertText } from 'jany-latyn/scripts';

convertText({ text: 'Кыргыз', from: 'cyrillic', to: 'runes' }); // { ok: true, text: '𐰴𐰃𐰺𐰍𐰃𐰕' }
```

- [ ] **Step 3: CHANGELOG**

Under `## Unreleased`, add a section after `### Runes (Jany-Enesai)`:

```markdown
### Testbed (qylym)

- **Any-to-any playground.** One input and one output, with source and target
  pickers (Cyrillic, Latin, ASCII, runes, and a sign-by-sign reading for the
  stones' spelling), a swap button, presets with their status, customize
  panels for Latin and runes, a comparison strip, and a rune inspector.
- **Site sections.** Playground · Latin (Alphabet, Whitepaper) · Runic
  (Alphabet, Proposal, Corpus) · About. `/alphabet/` and `/whitepaper/`
  forward to `/latin/alphabet/` and `/latin/whitepaper/`, keeping anchors.
  The Jany-Enesai proposal is published as a draft.
- **Engine.** `jany-latyn/scripts` (`detectScript`, `LATIN_PRESETS`,
  `convertText`, `explainConversion`); `janyToCyr` reads CTA's `y` glide as й
  with `{ yGrapheme: 'dotless-i', glideGrapheme: 'y' }`.
- New interface strings are in English until translated.
```

- [ ] **Step 4: AGENTS.md**

In the architecture tree, under `src/`, add after `runes/`:

```
│   │   ├── scripts.ts         # jany-latyn/scripts: detectScript, LATIN_PRESETS, convertText (any-to-any hub), explainConversion
```

and replace the `routes/` line under `apps/web/src/` with:

```
│       ├── lib/playground/    # Playground state (state.svelte.ts) and its components
│       └── routes/            # Playground (+page), latin/{alphabet,whitepaper}, runic/{alphabet,proposal,corpus}, about/; /alphabet and /whitepaper forward
```

- [ ] **Step 5: Run every check**

```bash
cd "$(git rev-parse --show-toplevel)"
npm test 2>&1 | grep -E "^ℹ (tests|pass|fail)|Whitepaper check|^✖"
npm run chart 2>&1 | tail -1 && git status --short packages/engine/charts
npm run check:web 2>&1 | tail -1
npm run build:web 2>&1 | tail -1
npm run test:corpus 2>&1 | grep -E "^ℹ (tests|pass|fail)"
```

Expected: engine tests all pass with whitepaper `208/208`; chart unchanged (no status output); `0 ERRORS`; `✔ done`; corpus `3` pass.

- [ ] **Step 6: Browser pass (claude-in-chrome on `npm run dev`, http://localhost:5173)**

If this session has no browser automation (a cloud session, for example), do not skip the commit: run Steps 5 and 7, then say in the hand-off that the browser pass is still to do, with the list below, so it is done in a local session.

At 1440 px and 390 px wide, check each item; record any failure as a fix before committing:

1. Type `Ак мөңгүлүү аска` — picker shows "Auto: Cyrillic", output Jany-Latyn; switch target to Runes: right-to-left runes, Jany-Latyn line beneath; `document.fonts.check('16px "Noto Sans Old Turkic"', '\u{10C00}')` is `true` in the console.
2. Each rune preset and each customize row changes the output; the reversibility line turns to the warning for the inscription looks; "hard to read" notes appear for the attested с and ш.
3. Tap a rune word — the inspector shows its letters; Escape closes it.
4. Comparison strip lists the other presets with differing words marked; "Use" applies one.
5. Swap with a Runes target (Jany-Enesai) — input becomes runes, target Cyrillic, output the Cyrillic text; with Eski-Enesai, swap is disabled with its reason.
6. Paste `𐰴𐰃𐰻𐰃𐰍⁚𐰖𐰆𐰻𐱄𐰢` — target switches to Reading, other targets disabled, the note shows; each notation renders.
7. Paste CTA `Qırğızstan, obyekt` with "Restore loanwords" on — Cyrillic output `Кыргызстан, объект`.
8. Paste a 50,000-character text (repeat a sample) — typing at the end of the textarea stays responsive.
9. List view with the names sample, for the Latin, Cyrillic, and Runes targets — each column sorted.
10. Copy and "Copy for left-to-right documents" put text on the clipboard (paste into the input to see).
11. Reload — the target and its options are remembered; then run `localStorage.setItem('qylym_playground', '{bad')` and reload — defaults load without errors.
12. `/whitepaper/#3-design-principles` lands on `/latin/whitepaper/#3-design-principles`; `/alphabet/` lands on `/latin/alphabet/`.
13. `/runic/proposal/` shows the draft banner, its two figures, and rune text in the rune font; `/runic/alphabet/` and `/runic/corpus/` show their placeholders.
14. The navbar's Latin and Runic dropdowns open and close on navigation; the phone menu shows both groups.

- [ ] **Step 7: Commit**

```bash
git add README.md CHANGELOG.md AGENTS.md docs/superpowers/specs/2026-10-16-qylym-playground-design.md
git commit -m "docs: describe the qylym playground, its sections, and jany-latyn/scripts"
```
