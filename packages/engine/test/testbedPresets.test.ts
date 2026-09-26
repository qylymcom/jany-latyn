// SPDX-License-Identifier: MIT
/**
 * Whitepaper §7 testbed coupling — "ı seeds q, ğ, and the y glide" and
 * "q seeds ğ".
 *
 * This is a TESTBED behavior, not an engine invariant. These tests assert the
 * coupling where it actually lives (the shared pure module), and separately
 * assert that the conversion engine keeps the options independent.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveYGraphemeChange,
  resolveGlideGraphemeChange,
  resolveUvularKChange,
  hasTildeClash,
  type TestbedOptionState,
} from '../src/testbedPresets.js';
import { cyrToJany } from '../src/convert.js';

const janyLatyn: TestbedOptionState = {
  yGrapheme: 'y',
  glideGrapheme: 'acute-i',
  uvularK: 'k',
  uvularG: 'g',
};

// The phrase whitepaper §6 uses because it contains every letter the settings change.
const PHRASE = 'аңкыгый жигит';

test('§7 coupling: selecting ı seeds q, ğ, and the y glide (the q+ğ+ı setting)', () => {
  assert.deepEqual(resolveYGraphemeChange(janyLatyn, 'dotless-i'), {
    yGrapheme: 'dotless-i',
    glideGrapheme: 'y',
    uvularK: 'q',
    uvularG: 'ğ',
  });
});

test('§7 coupling: from the defaults, selecting ı alone yields the q+ğ+ı output', () => {
  assert.equal(cyrToJany(PHRASE, janyLatyn), 'aŋkygyí jigit');
  assert.equal(cyrToJany(PHRASE, resolveYGraphemeChange(janyLatyn, 'dotless-i')), 'aŋqığıy jigit');
});

test('§7 coupling: switching back to y restores k, g, and the í glide', () => {
  const qgi = resolveYGraphemeChange(janyLatyn, 'dotless-i');
  const back = resolveYGraphemeChange(qgi, 'y');
  assert.deepEqual(back, janyLatyn);
  assert.equal(cyrToJany(PHRASE, back), 'aŋkygyí jigit');
});

test('§7 coupling: the y glide is offered only while ы is ı, so choosing it while ы is y changes nothing', () => {
  assert.deepEqual(resolveGlideGraphemeChange(janyLatyn, 'y'), janyLatyn);
});

test('§7 coupling: glide change while ы is ı sets only the glide', () => {
  const dotless: TestbedOptionState = { yGrapheme: 'dotless-i', glideGrapheme: 'acute-i', uvularK: 'q', uvularG: 'ğ' };
  assert.deepEqual(resolveGlideGraphemeChange(dotless, 'y'), { ...dotless, glideGrapheme: 'y' });
});

test('§7 coupling: glide change from ı + k leaves k untouched', () => {
  const dotlessK: TestbedOptionState = { yGrapheme: 'dotless-i', glideGrapheme: 'acute-i', uvularK: 'k', uvularG: 'g' };
  const next = resolveGlideGraphemeChange(dotlessK, 'y');
  assert.equal(next.glideGrapheme, 'y');
  assert.equal(next.yGrapheme, 'dotless-i');
  assert.equal(next.uvularK, 'k');
});

test('§7 coupling: seeds only — ı with k and ı with the í glide stay reachable', () => {
  const qgi = resolveYGraphemeChange(janyLatyn, 'dotless-i');
  // The plain setters change one option each and leave ı in place.
  assert.deepEqual(resolveUvularKChange(qgi, 'k'), { ...qgi, uvularK: 'k', uvularG: 'g' });
  assert.deepEqual(resolveGlideGraphemeChange(qgi, 'acute-i'), { ...qgi, glideGrapheme: 'acute-i' });
});

test('§7 engine keeps yGrapheme, uvularK, and glideGrapheme independent (coupling is UI-only)', () => {
  // dotless ı WITHOUT q is a valid engine configuration — the engine never couples them
  assert.equal(cyrToJany('кыргыз', { yGrapheme: 'dotless-i', uvularK: 'k' }), 'kırgız');
  assert.equal(cyrToJany('кыргыз', { yGrapheme: 'dotless-i', uvularK: 'q' }), 'qırgız');
  // ı with the í glide is valid too
  assert.equal(cyrToJany('айыл', { yGrapheme: 'dotless-i' }), 'aíıl');
});

test('§7 warning: ĩ glide with ñ nasal is flagged, not blocked', () => {
  assert.equal(hasTildeClash({ glideGrapheme: 'tilde-i', velarNasal: 'tilde-n' }), true);
  assert.equal(hasTildeClash({ glideGrapheme: 'tilde-i', velarNasal: 'eng' }), false);
  assert.equal(hasTildeClash({ glideGrapheme: 'acute-i', velarNasal: 'tilde-n' }), false);
  assert.equal(hasTildeClash({ glideGrapheme: 'breve-i', velarNasal: 'tilde-n' }), false);
});

test('§7 coupling: marked glides pass through the resolvers unchanged', () => {
  for (const g of ['breve-i', 'tilde-i'] as const) {
    const next = resolveGlideGraphemeChange(janyLatyn, g);
    assert.deepEqual(next, { ...janyLatyn, glideGrapheme: g });
    // Leaving dotless ı keeps a marked glide (only the y glide is cleared).
    const back = resolveYGraphemeChange({ yGrapheme: 'dotless-i', glideGrapheme: g, uvularK: 'q', uvularG: 'ğ' }, 'y');
    assert.equal(back.glideGrapheme, g);
  }
});

test('§7 coupling: selecting q force-enables ğ (§8 symmetry)', () => {
  const next = resolveUvularKChange(janyLatyn, 'q');
  assert.equal(next.uvularK, 'q');
  assert.equal(next.uvularG, 'ğ');
});

test('§7 coupling: reverting to unified k clears ğ', () => {
  const both: TestbedOptionState = { ...janyLatyn, uvularK: 'q', uvularG: 'ğ' };
  const next = resolveUvularKChange(both, 'k');
  assert.equal(next.uvularK, 'k');
  assert.equal(next.uvularG, 'g');
});

test('§7 coupling: ğ stays settable on its own after the transition', () => {
  // The resolver seeds ğ; the UI's plain setter can still take it back off,
  // so q-without-ğ — the configuration §8 argues against — stays reachable.
  const seeded = resolveUvularKChange(janyLatyn, 'q');
  const asymmetric: TestbedOptionState = { ...seeded, uvularG: 'g' };
  assert.equal(asymmetric.uvularK, 'q');
  assert.equal(asymmetric.uvularG, 'g');
});

test('§7 engine keeps uvularK and uvularG independent (coupling is UI-only)', () => {
  // Every combination remains a valid engine call, including the asymmetric ones.
  assert.equal(cyrToJany('кыргыз', { uvularK: 'q', uvularG: 'g' }), 'qyrgyz');
  assert.equal(cyrToJany('кыргыз', { uvularK: 'k', uvularG: 'ğ' }), 'kyrğyz');
  assert.equal(cyrToJany('кыргыз', { uvularK: 'q', uvularG: 'ğ' }), 'qyrğyz');
});
