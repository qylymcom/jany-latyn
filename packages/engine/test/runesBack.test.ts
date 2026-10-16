// SPDX-License-Identifier: MIT
/**
 * Converting back, reading inscriptions, telling old spelling from modern, sorting,
 * search keys, and the inspector's explanations (RUNES-SPEC.md §5, §7–§10).
 * Checks against the Yenisei Kyrgyz corpus itself live in corpus/scripts/, outside
 * this MIT package, because the corpus is CC BY-NC-SA.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { cyrToJany, janyToCyr, foldKey } from '../src/convert.js';
import { compareCyrillic } from '../src/collate.js';
import { lowerStr } from '../src/casing.js';
import {
  cyrillicToRunes, janyLatynToRunes, runesToJanyLatyn, runesToCyrillic, isReversible,
  readInscription, signValue, detectSpelling, spellingFeatures, compareRunes, runeFoldKey,
  explainRunes, RUNE_PRESETS, RUNE_OPTION_VALUES, RUNE_NAMES, rune, presetOptions,
  type RuneOptions,
} from '../src/runes/index.js';

const golden = JSON.parse(readFileSync(new URL('../../test/fixtures/runes.golden.json', import.meta.url), 'utf8')) as {
  cases: { cyrillic: string; janyLatyn: string; runes: Record<string, string> }[];
};
const fixture = (name: string) => readFileSync(new URL(`../../test/fixtures/${name}`, import.meta.url), 'utf8');
// The engine's own fixtures, and the web testbed's sample library when the engine
// runs inside this repository (as test/samples.test.ts reads it): about 1,600 words.
const SAMPLE_DIR = new URL('../../../../apps/web/src/lib/sample-texts/', import.meta.url);
const SAMPLES = existsSync(SAMPLE_DIR)
  ? readdirSync(SAMPLE_DIR).filter((f) => f.endsWith('.txt')).map((f) => readFileSync(new URL(f, SAMPLE_DIR), 'utf8'))
  : [];
const TEXTS = ['anthem.cyr.txt', 'lullaby.cyr.txt', 'manas.cyr.txt'].map(fixture);
const WORDS = [...new Set([...TEXTS, ...SAMPLES].flatMap((t) => (t.match(/\p{Script=Cyrillic}+/gu) ?? []).map((w) => lowerStr(w))))];
const JL_WORDS = [...new Set(WORDS.map((w) => lowerStr(cyrToJany(w))))];
// Every fourth word, for the tests that run every combination of options.
const SOME_JL_WORDS = JL_WORDS.filter((_, i) => i % 4 === 0);

// ---- Converting back (§5) --------------------------------------------------

test('back: presets say whether they are reversible, and isReversible agrees', () => {
  for (const p of RUNE_PRESETS) assert.equal(isReversible(p.options), p.reversible, p.id);
});

test('back: the worked examples come back exactly in every reversible preset', () => {
  for (const id of ['jany-enesai', 'kg', 'full']) {
    for (const c of golden.cases) assert.equal(runesToJanyLatyn(c.runes[id]), lowerStr(c.janyLatyn), `${c.cyrillic} (${id})`);
  }
});

// Every combination of options, not only the presets: isReversible() must never
// accept a combination under which two words share a rune spelling.
function* combinations(): Generator<RuneOptions> {
  const keys = (Object.keys(RUNE_OPTION_VALUES) as (keyof RuneOptions)[]).filter((k) => k !== 'separator');
  const walk = function* (i: number, acc: Partial<RuneOptions>): Generator<RuneOptions> {
    if (i === keys.length) { yield { ...acc, separator: 'space' } as RuneOptions; return; }
    for (const v of RUNE_OPTION_VALUES[keys[i]]) yield* walk(i + 1, { ...acc, [keys[i]]: v });
  };
  yield* walk(0, {});
}

test('back: every combination isReversible() accepts round-trips every fixture word exactly', () => {
  let accepted = 0;
  for (const o of combinations()) {
    if (!isReversible(o)) continue;
    accepted++;
    for (const w of SOME_JL_WORDS) assert.equal(runesToJanyLatyn(janyLatynToRunes(w, o)), w, `${w} under ${JSON.stringify(o)}`);
  }
  assert.ok(accepted > 100, `only ${accepted} reversible combinations`);
});

test('back: the one-way combinations really do merge words', () => {
  const same = (a: string, b: string, o: Partial<RuneOptions>) => assert.equal(cyrillicToRunes(a, o), cyrillicToRunes(b, o), `${a} / ${b}`);
  same('шаар', 'шар', presetOptions('orkhon'));
  same('кол', 'кул', { vowels: 'historical' });
  same('жол', 'йол', { zhe: 'etymological' });
  same('фабрика', 'пабрика', { loanConsonants: 'nativized' });
  same('шар', 'сар', { forms: 'yenisei', yeniseiSh: 'merged' });
  // Yenisei forms under full harmony: 𐰝 writes х, and к beside ө and ү.
  same('көл', 'хөл', { forms: 'yenisei', harmony: 'full' });
});

test('back: through runes, Cyrillic comes back exactly as it does through Jany-Latyn', () => {
  for (const w of WORDS) assert.equal(runesToCyrillic(cyrillicToRunes(w)), lowerStr(janyToCyr(cyrToJany(w))), w);
});

test('back: the loan-restoration list works through runes', () => {
  const r = cyrillicToRunes('объект');
  assert.equal(runesToCyrillic(r), 'обект');
  assert.equal(runesToCyrillic(r, { restoreLoans: true }), 'объект');
});

test('back: the у toggles, the divider, and anything that is not a rune', () => {
  assert.equal(runesToJanyLatyn(cyrillicToRunes('кул', { u: 'dotted-o' })), 'kul');
  assert.equal(runesToJanyLatyn(cyrillicToRunes('кул', { u: 'old-hungarian' })), 'kul');
  assert.equal(runesToJanyLatyn(cyrillicToRunes('эл жер', { separator: 'two-dot' })), 'el jer');
  assert.equal(runesToJanyLatyn('2026, Windows!'), '2026, Windows!');
});

// ---- Reading inscriptions (§7) ---------------------------------------------

test('reader: every rune has a sign value', () => {
  for (const n of RUNE_NAMES) assert.ok(signValue(rune(n)), n);
});

test('reader: sign values with series marks; dividers and gaps as §7.2 says', () => {
  assert.equal(readInscription('𐱅𐰭𐰼𐰃⁚𐰅𐰠𐰢'), 't²ñr²i el²m');
  assert.equal(readInscription('𐰉𐰆𐰑𐰣⸱𐰴𐰀'), 'b¹od¹n¹⸱qa');
  assert.equal(readInscription('  ... 𐰢⁚⁚𐰀 '), '... m a');
  assert.equal(readInscription('𐱈 𐰶 𐰸 𐰜 𐰱 𐰦 𐰨 𐰡'), 'baš ıq oq ök ič nt nč lt');
});

test('reader: the CTA, Jany-Latyn and Cyrillic targets, with 𐰃 by the nearest series sign', () => {
  const read = (r: string) => (['cta', 'jany-latyn', 'cyrillic'] as const).map((t) => readInscription(r, t));
  assert.deepEqual(read('𐰴𐰃𐰕'), ['qız', 'kyz', 'кыз']);     // q is back
  assert.deepEqual(read('𐰚𐰃𐰕'), ['kiz', 'kiz', 'киз']);     // k² is front
  assert.deepEqual(read('𐰢𐰃𐰣'), ['mın', 'myn', 'мын']);     // m marks no series; n¹ to the right does
  assert.deepEqual(read('𐰢𐰃'), ['mi', 'mi', 'ми']);         // no series sign in the word: front
  assert.deepEqual(read('𐰍𐰀𐱁'), ['ğaş', 'gaş', 'гаш']);
  assert.deepEqual(read('𐰖𐰆𐰞'), ['yol', 'íol', 'йол']);
});

// ---- Old or modern (§9) ----------------------------------------------------

test('detect: plene settings are modern; the inscription looks and the stones are old', () => {
  const words = golden.cases.map((c) => c.cyrillic).join(' ');
  for (const id of ['jany-enesai', 'kg', 'full']) assert.equal(detectSpelling(cyrillicToRunes(words, presetOptions(id))), 'modern', id);
  for (const id of ['eski-enesai', 'orkhon']) assert.equal(detectSpelling(cyrillicToRunes(words, presetOptions(id))), 'old', id);
  assert.equal(detectSpelling('𐰴𐰃𐰻𐰃𐰍'), 'old');            // 𐰻 YENISEI AR is old-only
  assert.equal(detectSpelling(cyrillicToRunes(TEXTS[2])), 'modern');
  const f = spellingFeatures(cyrillicToRunes(words, presetOptions('orkhon')));
  assert.ok(f.vowelless > 0.10 && f.oldOnly === 0, JSON.stringify(f));
});

// ---- Sorting and search (§8.3, §10) ----------------------------------------

test('collate: runes sort as their Cyrillic does, wherever the letters map one to one', () => {
  const plain = WORDS.filter((w) => /^[абвгджзийклмнңоөпрстуүфхчшы]+$/u.test(w));
  assert.ok(plain.length > (SAMPLES.length ? 500 : 40), `${plain.length} words`);
  const byCyrillic = [...plain].sort(compareCyrillic);
  const byRunes = [...plain].sort((a, b) => compareRunes(cyrillicToRunes(a), cyrillicToRunes(b)));
  assert.deepEqual(byRunes, byCyrillic);
});

test('collate: forms and variants sort with their letter; back before front', () => {
  assert.equal(Math.sign(compareRunes('𐰀𐰞', '𐰁𐰞')), -1);       // same letter, different form
  assert.equal(Math.sign(compareRunes('𐰁𐰞', '𐰀𐰢')), -1);       // the variant sorts as а
  assert.equal(Math.sign(compareRunes('𐰞𐰀', '𐰠𐰀')), -1);       // back л before front л
  assert.equal(Math.sign(compareRunes('𐰠𐰀', '𐰞𐰅')), -1);       // but the letters decide first
  assert.equal(compareRunes('𐰴𐰆𐰞', '𐰴𐰆𐰞'), 0);
});

test('collate: compareRunes is a total order', () => {
  const xs = golden.cases.flatMap((c) => Object.values(c.runes)).slice(0, 120);
  for (const a of xs) for (const b of xs) assert.equal(Math.sign(compareRunes(a, b)) + Math.sign(compareRunes(b, a)), 0);
  const sorted = [...xs].sort(compareRunes);
  for (let i = 0; i + 1 < sorted.length; i++) assert.ok(compareRunes(sorted[i], sorted[i + 1]) <= 0);
  for (let i = 0; i + 2 < sorted.length; i++) assert.ok(compareRunes(sorted[i], sorted[i + 2]) <= 0);
});

test('fold: a word in any reversible preset has the search key of its Jany-Latyn', () => {
  for (const p of RUNE_PRESETS.filter((x) => x.reversible)) {
    for (const w of WORDS) assert.equal(runeFoldKey(cyrillicToRunes(w, p.options)), foldKey(cyrToJany(w)), `${w} (${p.id})`);
  }
  assert.equal(runeFoldKey('𐰁𐰞'), runeFoldKey('𐰀𐰞'));
});

// ---- The inspector's explanations ------------------------------------------

test('explain: governing vowel, series, and rune for each letter', () => {
  const [w] = explainRunes('Көл', { harmony: 'full' });
  assert.equal(w.source, 'Көл');
  assert.equal(w.janyLatyn, 'köl');
  assert.equal(w.runes, '𐰜𐰇𐰠');
  assert.deepEqual(w.letters.map((l) => [l.letter, l.kind, l.series, l.governor, l.names]), [
    ['k', 'consonant', 'front', 1, ['ORKHON OEK']],
    ['ö', 'vowel', null, null, ['ORKHON OE']],
    ['l', 'consonant', 'front', 1, ['ORKHON AEL']],
  ]);
});

test('explain: dropped letters and ligatures in the epigraphic register', () => {
  const [w] = explainRunes('алтын', presetOptions('orkhon'));
  assert.equal(w.runes, cyrillicToRunes('алтын', presetOptions('orkhon')));
  assert.deepEqual(w.letters.map((l) => [l.letter, l.rune, l.dropped, l.ligature]), [
    ['a', '', true, false],
    ['l', '𐰡', false, true],
    ['t', '', false, true],
    ['y', '', true, false],
    ['n', '𐰣', false, false],
  ]);
});
