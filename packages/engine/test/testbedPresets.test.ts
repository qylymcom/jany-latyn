// SPDX-License-Identifier: MIT
/**
 * §11.1 testbed coupling — the "ı force-enables q" affordance.
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
  hasTildeClash,
  type TestbedOptionState,
} from '../src/testbedPresets.js';
import { cyrToJany } from '../src/convert.js';

const canonical: TestbedOptionState = {
  yGrapheme: 'y',
  glideGrapheme: 'acute-i',
  uvularK: 'k',
};

test('§11.1 coupling: selecting dotless ı force-enables q', () => {
  const next = resolveYGraphemeChange(canonical, 'dotless-i');
  assert.equal(next.yGrapheme, 'dotless-i');
  assert.equal(next.uvularK, 'q'); // the coupling
});

test('§11.1 coupling: selecting y reverts to unified k', () => {
  const fromCTA: TestbedOptionState = { yGrapheme: 'dotless-i', glideGrapheme: 'y', uvularK: 'q' };
  const next = resolveYGraphemeChange(fromCTA, 'y');
  assert.equal(next.yGrapheme, 'y');
  assert.equal(next.uvularK, 'k');
  assert.equal(next.glideGrapheme, 'acute-i'); // clears the double-y collision
});

test('§11.1 coupling: choosing y glide while ы is y forces ı + q', () => {
  const next = resolveGlideGraphemeChange(canonical, 'y');
  assert.equal(next.glideGrapheme, 'y');
  assert.equal(next.yGrapheme, 'dotless-i');
  assert.equal(next.uvularK, 'q');
});

test('§11.1 coupling: glide change is inert when ы is already dotless ı', () => {
  const dotless: TestbedOptionState = { yGrapheme: 'dotless-i', glideGrapheme: 'acute-i', uvularK: 'q' };
  const next = resolveGlideGraphemeChange(dotless, 'y');
  assert.equal(next.yGrapheme, 'dotless-i');
  assert.equal(next.uvularK, 'q');
});

test('§11.1 coupling: glide change from ı + k leaves k untouched (only the ы=y case forces q)', () => {
  const dotlessK: TestbedOptionState = { yGrapheme: 'dotless-i', glideGrapheme: 'acute-i', uvularK: 'k' };
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
    const back = resolveYGraphemeChange({ yGrapheme: 'dotless-i', glideGrapheme: g, uvularK: 'q' }, 'y');
    assert.equal(back.glideGrapheme, g);
  }
});
