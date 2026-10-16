// SPDX-License-Identifier: MIT
/**
 * The rune stage (docs/jany-enesai/RUNES-SPEC.md §4, JANY-ENESAI.md §23–§25).
 * The golden fixture is the proposal's own Appendix B and §4 passage; a difference
 * is a finding to report, never a reason to edit the fixture.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { cyrToJany } from '../src/convert.js';
import {
  cyrillicToRunes, janyLatynToRunes, RUNE_PRESETS, presetOptions, rune, RUNE_NAMES,
  type RuneOptions,
} from '../src/runes/index.js';

const golden = JSON.parse(readFileSync(new URL('../../test/fixtures/runes.golden.json', import.meta.url), 'utf8')) as {
  cases: { cyrillic: string; janyLatyn: string; runes: Record<string, string> }[];
  passage: { cyrillic: string; janyLatyn: string; runes: Record<string, string> };
};
const fixture = (name: string) => readFileSync(new URL(`../../test/fixtures/${name}`, import.meta.url), 'utf8');
// The engine's fixtures, and the web testbed's sample library when present (see test/samples.test.ts).
const SAMPLE_DIR = new URL('../../../../apps/web/src/lib/sample-texts/', import.meta.url);
const SAMPLES = existsSync(SAMPLE_DIR)
  ? readdirSync(SAMPLE_DIR).filter((f) => f.endsWith('.txt')).map((f) => readFileSync(new URL(f, SAMPLE_DIR), 'utf8'))
  : [];
const TEXTS = [...['anthem.cyr.txt', 'lullaby.cyr.txt', 'manas.cyr.txt'].map(fixture), ...SAMPLES];

// The worked examples set multi-word cells with spaces, in every setting.
const asPrinted = (id: string): Partial<RuneOptions> => ({ ...presetOptions(id), separator: 'space' });

test('runes: the engine gives the Jany-Latyn the worked examples were made from', () => {
  for (const c of [...golden.cases, golden.passage]) assert.equal(cyrToJany(c.cyrillic), c.janyLatyn, c.cyrillic);
});

for (const id of ['jany-enesai', 'kg', 'full', 'eski-enesai', 'orkhon']) {
  test(`runes: proposal Appendix B, ${id}`, () => {
    for (const c of golden.cases) {
      assert.equal(janyLatynToRunes(c.janyLatyn, asPrinted(id)), c.runes[id], `${c.cyrillic} (${id})`);
      assert.equal(cyrillicToRunes(c.cyrillic, asPrinted(id)), c.runes[id], `${c.cyrillic} from Cyrillic (${id})`);
    }
  });
}

test('runes: proposal §4 passage in Jany-Enesai', () => {
  assert.equal(cyrillicToRunes(golden.passage.cyrillic), golden.passage.runes['jany-enesai']);
});

test('runes: the chart title in full harmony (proposal §16)', () => {
  assert.equal(cyrillicToRunes('Байыркы кыргыз алфавити', { harmony: 'full' }), '𐰉𐰀𐰖𐰃𐰺𐰶𐰃 𐰶𐰃𐰺𐰍𐰃𐰕 𐰀𐰞𐰟𐰀𐰊𐰄𐱅𐰄');
});

test('runes: inventory names follow the Unicode character names', () => {
  assert.equal(RUNE_NAMES.length, 0x49);
  assert.equal(rune('ORKHON A'), '\u{10C00}');
  assert.equal(rune('YENISEI EC'), '\u{10C33}');
  assert.equal(rune('ORKHON BASH'), '\u{10C48}');
});

test('runes: presets carry a status, and ids are unique', () => {
  const ids = RUNE_PRESETS.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const p of RUNE_PRESETS) assert.ok(['proposed', 'reference', 'comparison', 'experimental'].includes(p.status), p.id);
  assert.deepEqual(RUNE_PRESETS.filter((p) => p.status === 'proposed').map((p) => p.id), ['jany-enesai']);
});

test('runes: toggles of proposal §18', () => {
  assert.equal(cyrillicToRunes('кул', { u: 'dotted-o' }), '𐰴𐰆̇𐰞');
  assert.equal(cyrillicToRunes('кул', { u: 'old-hungarian' }), '𐰴\u{10CEA}𐰞');
  assert.equal(cyrillicToRunes('жол', { zhe: 'front' }), '𐰙𐰆𐰞');
  assert.equal(cyrillicToRunes('жол', { zhe: 'etymological' }), '𐰖𐰆𐰞');
  assert.equal(cyrillicToRunes('фабрика', { loanConsonants: 'nativized' }), '𐰯𐰀𐰉𐰺𐰄𐰴𐰀');
  assert.equal(cyrillicToRunes('кыргыз', { vowels: 'historical' }), '𐰴𐰃𐰺𐰍𐰃𐰕');
  assert.equal(cyrillicToRunes('күл', { vowels: 'historical' }), '𐰴𐰇𐰞');
  assert.equal(cyrillicToRunes('кыргыз', { forms: 'orkhon' }), '𐰴𐰃𐰺𐰍𐰃𐰔');
});

test('runes: attested letters switch separately (RUNES-SPEC §4.4)', () => {
  assert.equal(cyrillicToRunes('Манас', { r: 'attested' }), '𐰢𐰀𐰣𐰀𐰽');
  assert.equal(cyrillicToRunes('Манас', { s: 'attested' }), '𐰢𐰀𐰣𐰀𐰾');
  assert.equal(cyrillicToRunes('шаар', { sh: 'attested' }), '𐱀𐰀𐰀𐰺');
  assert.equal(cyrillicToRunes('шаар', { r: 'attested', sh: 'attested' }), '𐱀𐰀𐰀𐰻');
  const attested = presetOptions('attested');
  assert.equal(cyrillicToRunes('Бишкек шаары', attested), '𐰉𐰄𐱀𐰴𐰅𐰴 𐱀𐰀𐰀𐰻𐰃');
});

test('runes: Eski-Enesai keeps ш and back с apart unless merged (RUNES-SPEC §6.3)', () => {
  const eski = asPrinted('eski-enesai');
  assert.equal(cyrillicToRunes('Бишкек сактоо', eski), '𐰌𐰃𐱀𐰛𐰛 𐱂𐰴𐱄𐰆');
  assert.equal(cyrillicToRunes('Бишкек сактоо', { ...eski, yeniseiSh: 'merged' }), '𐰌𐰃𐱂𐰛𐰛 𐱂𐰴𐱄𐰆');
});

test('runes: the two-dot separator joins rune words only', () => {
  assert.equal(cyrillicToRunes('эл  жер', { separator: 'two-dot' }), '𐰅𐰞⁚𐰳𐰅𐰺');
  assert.equal(cyrillicToRunes('эл, жер\nсуу', { separator: 'two-dot' }), '𐰅𐰞, 𐰳𐰅𐰺\n𐰽𐱈𐱈');
  // A word that ends in the combining dot of the dotted-o toggle is still a rune word.
  assert.equal(cyrillicToRunes('су эл', { u: 'dotted-o', separator: 'two-dot' }), '𐰽𐰆̇⁚𐰅𐰞');
});

test('runes: text that is not Kyrgyz passes through unchanged', () => {
  for (const s of ['', 'Windows 11', '2026-10-16', '— «» ?!', 'Ἀθῆναι', '漢字']) {
    assert.equal(cyrillicToRunes(s), s);
  }
  assert.equal(cyrillicToRunes('Windows менен Linux'), 'Windows 𐰢𐰅𐰣𐰅𐰣 Linux');
  assert.equal(janyLatynToRunes('Windows menen Linux'), 'Windows 𐰢𐰅𐰣𐰅𐰣 Linux');
});

test('runes: a pure-Cyrillic Kyrgyz word becomes Old Turkic letters only', () => {
  for (const text of TEXTS) {
    for (const word of text.match(/\p{Script=Cyrillic}+/gu) ?? []) {
      for (const id of ['jany-enesai', 'full', 'eski-enesai', 'orkhon']) {
        assert.match(cyrillicToRunes(word, presetOptions(id)), /^\p{Script=Old_Turkic}*$/u, `${word} (${id})`);
      }
    }
  }
});

test('runes: Jany-Enesai emits only its 28 runes', () => {
  const allowed = new Set([...'𐰀𐰉𐰊𐰍𐰑𐰅𐰳𐰕𐰄𐰖𐰴𐰞𐰢𐰣𐰭𐰆𐰇𐰯𐰺𐰽𐱄𐱈𐰈𐰟𐰝𐰲𐱁𐰃']);
  for (const text of TEXTS) {
    for (const ch of cyrillicToRunes(text)) {
      if (/\p{Script=Old_Turkic}/u.test(ch)) assert.ok(allowed.has(ch), `U+${ch.codePointAt(0)!.toString(16)}`);
    }
  }
});

test('runes: full harmony writes back forms in back words and front forms in front words', () => {
  const FRONT = new Set([...'𐰋𐰏𐰓𐰙𐰘𐰚𐰜𐰠𐰤𐰼𐰾𐱅𐰱']);
  const BACK = new Set([...'𐰉𐰍𐰑𐰳𐰖𐰴𐰸𐰶𐰞𐰣𐰺𐰽𐱄𐱇']);
  for (const text of TEXTS) {
    for (const word of text.match(/\p{Script=Cyrillic}+/gu) ?? []) {
      const runes = [...cyrillicToRunes(word, { harmony: 'full' })];
      const jl = cyrToJany(word);
      if (/^[^aouyeiöüä]*[aouy][^eiöüä]*$/iu.test(jl)) assert.ok(!runes.some((r) => FRONT.has(r)), `${word}: front form in a back word`);
      if (/^[^aouyeiöüä]*[eiöü][^aouy]*$/iu.test(jl)) assert.ok(!runes.some((r) => BACK.has(r)), `${word}: back form in a front word`);
    }
  }
});

test('runes: no unpaired surrogates in any preset', () => {
  const lone = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/;
  for (const text of TEXTS) {
    for (const p of RUNE_PRESETS) assert.doesNotMatch(cyrillicToRunes(text, p.options), lone, p.id);
  }
});

test('runes: no string case function is reachable', () => {
  const proto = String.prototype as unknown as Record<string, unknown>;
  const names = ['toUpperCase', 'toLowerCase', 'toLocaleUpperCase', 'toLocaleLowerCase'];
  const saved = names.map((n) => proto[n]);
  let out: string[];
  for (const n of names) proto[n] = () => { throw new Error(`String.prototype.${n} was called`); };
  try {
    out = RUNE_PRESETS.map((p) => cyrillicToRunes('КЫРГЫЗ Кыргызстан', p.options));
    out.push(janyLatynToRunes('KYRGYZ Kyrgyzstan'));
  } finally {
    names.forEach((n, i) => { proto[n] = saved[i]; });
  }
  assert.equal(out[0], '𐰴𐰃𐰺𐰍𐰃𐰕 𐰴𐰃𐰺𐰍𐰃𐰕𐰽𐱄𐰀𐰣');
  assert.equal(out.at(-1), out[0]);
});
