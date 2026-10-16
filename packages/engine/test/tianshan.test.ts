// SPDX-License-Identifier: MIT
/**
 * The Tian-Shan forms (RUNES-SPEC §6.4): Eski-Teŋir-Too writes each letter in the
 * form the transcribed Tian-Shan inscriptions use most (tianshanForms.ts, generated
 * from corpus/tianshan), and in its Yenisei form until one of them has the letter.
 * These tests hold for any table the generator can write.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  janyLatynToRunes, cyrillicToRunes, isReversible, runesToJanyLatyn, presetOptions, rune, letterForm,
  RUNE_PRESETS, TIANSHAN_FORMS, TIANSHAN_TRANSCRIBED, type RuneOptions, type TianShanFormKey,
} from '../src/runes/index.js';

// A word that writes the form, the options that make the engine use it, and where in the runes it stands.
const FULL: Partial<RuneOptions> = { harmony: 'full' };
const HISTORICAL: Partial<RuneOptions> = { vowels: 'historical' };
const EPIGRAPHIC: Partial<RuneOptions> = { register: 'epigraphic', harmony: 'full' };
const PROBES: Record<TianShanFormKey, [string, Partial<RuneOptions>, number]> = {
  a: ['a', HISTORICAL, 0], e: ['e', HISTORICAL, 0], i: ['i', HISTORICAL, 0], o: ['o', HISTORICAL, 0], ö: ['ö', HISTORICAL, 0],
  'b/back': ['ba', FULL, 0], 'b/front': ['be', FULL, 0], 'g/back': ['ga', FULL, 0], 'g/front': ['ge', FULL, 0],
  'd/back': ['da', FULL, 0], 'd/front': ['de', FULL, 0], z: ['za', FULL, 0],
  'í/back': ['ía', FULL, 0], 'í/front': ['íe', FULL, 0], 'k/front': ['ke', FULL, 0], ök: ['kö', FULL, 0],
  'l/back': ['la', FULL, 0], 'l/front': ['le', FULL, 0], lt: ['alta', EPIGRAPHIC, 0], m: ['ma', FULL, 0],
  'n/back': ['na', FULL, 0], 'n/front': ['ne', FULL, 0], nt: ['anta', EPIGRAPHIC, 0], nç: ['ança', EPIGRAPHIC, 0],
  'ŋ/back': ['aŋ', FULL, 1], 'ŋ/front': ['eŋ', FULL, 1], p: ['pa', FULL, 0], iç: ['çi', FULL, 0], ç: ['ça', FULL, 0],
  'k/back': ['ka', FULL, 0], oq: ['ko', FULL, 0], 'r/back': ['ra', FULL, 0], 'r/front': ['re', FULL, 0],
  's/back': ['sa', FULL, 0], 's/front': ['se', FULL, 0], ş: ['şa', FULL, 0], 't/back': ['ta', FULL, 0], 't/front': ['te', FULL, 0],
};

test('tianshan: every form in the table has a probe', () => {
  assert.deepEqual(Object.keys(PROBES).sort(), Object.keys(TIANSHAN_FORMS).sort());
  assert.ok(Number.isInteger(TIANSHAN_TRANSCRIBED) && TIANSHAN_TRANSCRIBED >= 0);
});

test('tianshan: an attested letter takes the stones\' form, an unattested one its Yenisei form', () => {
  for (const [key, [word, o, at]] of Object.entries(PROBES) as [TianShanFormKey, (typeof PROBES)[TianShanFormKey]][]) {
    const out = janyLatynToRunes(word, { ...o, forms: 'tianshan' });
    const form = TIANSHAN_FORMS[key];
    if (form === null) assert.equal(out, janyLatynToRunes(word, { ...o, forms: 'yenisei' }), key);
    else assert.equal([...out][at], rune(form), key);
  }
});

test('tianshan: letterForm gives the form each setting writes, as the probes show it', () => {
  for (const [key, [word, o, at]] of Object.entries(PROBES) as [TianShanFormKey, (typeof PROBES)[TianShanFormKey]][]) {
    for (const forms of ['chart', 'orkhon', 'yenisei', 'tianshan'] as const) {
      const runes = [...janyLatynToRunes(word, { ...o, forms })];
      const ligature = key === 'lt' || key === 'nt' || key === 'nç';
      assert.equal(letterForm(key, forms), ligature && runes.length !== 2 ? null : runes[at], `${key} (${forms})`);
    }
  }
  assert.equal(letterForm('r/back', 'yenisei'), '𐰻');
  assert.equal(letterForm('lt', 'yenisei'), null);
  assert.equal(letterForm('lt', 'orkhon'), '𐰡');
});

test('tianshan: Eski-Teŋir-Too is the Eski-Enesai setting with the Tian-Shan forms', () => {
  const p = RUNE_PRESETS.find((x) => x.id === 'eski-tenir-too');
  assert.ok(p);
  assert.equal(p.status, 'reference');
  assert.equal(p.reversible, false);
  assert.deepEqual({ ...p.options, forms: 'yenisei' }, presetOptions('eski-enesai'));
});

test('tianshan: with nothing attested, Eski-Teŋir-Too writes exactly what Eski-Enesai writes', (t) => {
  if (Object.values(TIANSHAN_FORMS).some((f) => f !== null)) return t.skip('the table has attested forms');
  const text = 'Кыргызстан, Талас, Кочкор, Ысык-Көл. Байыркы жазуу таштарда калган.';
  assert.equal(cyrillicToRunes(text, presetOptions('eski-tenir-too')), cyrillicToRunes(text, presetOptions('eski-enesai')));
});

test('tianshan: merged ш is one-way, and plene Tian-Shan forms round-trip when isReversible says so', () => {
  assert.equal(cyrillicToRunes('шар', { forms: 'tianshan', yeniseiSh: 'merged' }), cyrillicToRunes('сар', { forms: 'tianshan', yeniseiSh: 'merged' }));
  assert.equal(isReversible({ forms: 'tianshan', yeniseiSh: 'merged' }), false);
  for (const harmony of ['none', 'kg', 'full'] as const) {
    const o: Partial<RuneOptions> = { forms: 'tianshan', harmony };
    if (!isReversible(o)) continue;
    for (const w of ['kyrgyzstan', 'köl', 'şaar', 'saar', 'jer', 'bişkek', 'teŋir', 'too', 'üí', 'tüştük']) {
      assert.equal(runesToJanyLatyn(janyLatynToRunes(w, o)), w, `${w} (${harmony})`);
    }
  }
});
