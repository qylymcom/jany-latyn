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
// As a one-word text, компьютер's runes read as the stones' spelling: 𐰢𐰯𐰖 is a run of
// three consonant signs, and one word of one is over RUNES-SPEC §9.4's quarter. The
// detector is not this module's; these cases skip it, and the test below pins it.
const ONE_WORD_OLD = new Set(['компьютер']);
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
    if (ONE_WORD_OLD.has(c.cyrillic)) {
      assert.deepEqual(detectScript(c.runes['jany-enesai']), { script: 'runes', spelling: 'old' }, c.cyrillic);
      continue;
    }
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
      if (from === 'runes' && ONE_WORD_OLD.has(c.cyrillic)) continue;
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
