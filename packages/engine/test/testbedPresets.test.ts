// SPDX-License-Identifier: MIT
/**
 * §11.1 testbed coupling — the "ı force-enables q" and "q force-enables ğ"
 * affordances.
 *
 * This is a TESTBED behavior, not an engine invariant. These tests assert the
 * coupling where it actually lives (the shared pure module), and separately
 * assert that the conversion engine keeps the two options independent.
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

const canonical: TestbedOptionState = {
  yGrapheme: 'y',
  glideGrapheme: 'acute-i',
  uvularK: 'k',
  uvularG: 'g',
};

test('§11.1 coupling: selecting dotless ı force-enables q', () => {
  const next = resolveYGraphemeChange(canonical, 'dotless-i');
  assert.equal(next.yGrapheme, 'dotless-i');
  assert.equal(next.uvularK, 'q'); // the coupling
  assert.equal(next.uvularG, 'ğ'); // …which carries ğ with it (§6)
});

test('§11.1 coupling: selecting y reverts to unified k', () => {
  const fromCTA: TestbedOptionState = { yGrapheme: 'dotless-i', glideGrapheme: 'y', uvularK: 'q', uvularG: 'ğ' };
  const next = resolveYGraphemeChange(fromCTA, 'y');
  assert.equal(next.yGrapheme, 'y');
  assert.equal(next.uvularK, 'k');
  assert.equal(next.uvularG, 'g');
  assert.equal(next.glideGrapheme, 'acute-i'); // clears the double-y collision
});

test('§11.1 coupling: choosing y glide while ы is y forces ı + q', () => {
  const next = resolveGlideGraphemeChange(canonical, 'y');
  assert.equal(next.glideGrapheme, 'y');
  assert.equal(next.yGrapheme, 'dotless-i');
  assert.equal(next.uvularK, 'q');
  assert.equal(next.uvularG, 'ğ');
});

test('§11.1 coupling: glide change is inert when ы is already dotless ı', () => {
  const dotless: TestbedOptionState = { yGrapheme: 'dotless-i', glideGrapheme: 'acute-i', uvularK: 'q', uvularG: 'ğ' };
  const next = resolveGlideGraphemeChange(dotless, 'y');
  assert.equal(next.yGrapheme, 'dotless-i');
  assert.equal(next.uvularK, 'q');
});

test('§11.1 coupling: glide change from ı + k leaves k untouched (only the ы=y case forces q)', () => {
  const dotlessK: TestbedOptionState = { yGrapheme: 'dotless-i', glideGrapheme: 'acute-i', uvularK: 'k', uvularG: 'g' };
  const next = resolveGlideGraphemeChange(dotlessK, 'y');
  assert.equal(next.glideGrapheme, 'y');
  assert.equal(next.yGrapheme, 'dotless-i');
  assert.equal(next.uvularK, 'k');
});

test('§11.1 engine keeps yGrapheme and uvularK independent (coupling is UI-only)', () => {
  // dotless ı WITHOUT q is a valid engine configuration — the engine never couples them
  assert.equal(cyrToJany('кыргыз', { yGrapheme: 'dotless-i', uvularK: 'k' }), 'kırgız');
  assert.equal(cyrToJany('кыргыз', { yGrapheme: 'dotless-i', uvularK: 'q' }), 'qırgız');
});

test('§11.1 warning: ĩ glide with ñ nasal is flagged, not blocked', () => {
  assert.equal(hasTildeClash({ glideGrapheme: 'tilde-i', velarNasal: 'tilde-n' }), true);
  assert.equal(hasTildeClash({ glideGrapheme: 'tilde-i', velarNasal: 'eng' }), false);
  assert.equal(hasTildeClash({ glideGrapheme: 'acute-i', velarNasal: 'tilde-n' }), false);
  assert.equal(hasTildeClash({ glideGrapheme: 'breve-i', velarNasal: 'tilde-n' }), false);
});

test('§11.1 coupling: marked glides pass through the resolvers unchanged', () => {
  for (const g of ['breve-i', 'tilde-i'] as const) {
    const next = resolveGlideGraphemeChange(canonical, g);
    assert.deepEqual(next, { ...canonical, glideGrapheme: g });
    // Leaving dotless ı keeps a marked glide (only the y glide is cleared).
    const back = resolveYGraphemeChange({ yGrapheme: 'dotless-i', glideGrapheme: g, uvularK: 'q', uvularG: 'ğ' }, 'y');
    assert.equal(back.glideGrapheme, g);
  }
});

test('§11.1 coupling: selecting q force-enables ğ (§6 symmetry)', () => {
  const next = resolveUvularKChange(canonical, 'q');
  assert.equal(next.uvularK, 'q');
  assert.equal(next.uvularG, 'ğ');
});

test('§11.1 coupling: reverting to unified k clears ğ', () => {
  const both: TestbedOptionState = { ...canonical, uvularK: 'q', uvularG: 'ğ' };
  const next = resolveUvularKChange(both, 'k');
  assert.equal(next.uvularK, 'k');
  assert.equal(next.uvularG, 'g');
});

test('§11.1 coupling: ğ stays settable on its own after the transition', () => {
  // The resolver seeds ğ; the UI's plain setter can still take it back off,
  // so q-without-ğ — the configuration §6 argues against — stays reachable.
  const seeded = resolveUvularKChange(canonical, 'q');
  const asymmetric: TestbedOptionState = { ...seeded, uvularG: 'g' };
  assert.equal(asymmetric.uvularK, 'q');
  assert.equal(asymmetric.uvularG, 'g');
});

test('§11.1 coupling: ı carries q and ğ transitively', () => {
  const next = resolveYGraphemeChange(canonical, 'dotless-i');
  assert.deepEqual(next, {
    yGrapheme: 'dotless-i',
    glideGrapheme: 'acute-i',
    uvularK: 'q',
    uvularG: 'ğ',
  });
});

test('§11.1 engine keeps uvularK and uvularG independent (coupling is UI-only)', () => {
  // Every combination remains a valid engine call, including the asymmetric ones.
  assert.equal(cyrToJany('кыргыз', { uvularK: 'q', uvularG: 'g' }), 'qyrgyz');
  assert.equal(cyrToJany('кыргыз', { uvularK: 'k', uvularG: 'ğ' }), 'kyrğyz');
  assert.equal(cyrToJany('кыргыз', { uvularK: 'q', uvularG: 'ğ' }), 'qyrğyz');
});
