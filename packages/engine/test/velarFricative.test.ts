// SPDX-License-Identifier: MIT
/**
 * The х toggle (testbed option inventory, SPEC §7). 'h' writes every х as h and
 * is the default; 'x' writes every х as x. Both are one-letter mappings from
 * Cyrillic, unlike the §11.2 compose-mode split, which Cyrillic cannot supply.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cyrToJany, janyToCyr, type JanyOptions } from '../src/convert.js';
import { compare } from '../src/collate.js';

const X: JanyOptions = { velarFricative: 'x' };

test('х → h by default', () => {
  assert.equal(cyrToJany('рахмат'), 'rahmat');
  assert.equal(cyrToJany('Бухара'), 'Buhara');
  assert.equal(cyrToJany('рахмат', { velarFricative: 'h' }), 'rahmat');
});

test("х → x in 'x' mode, in every position and case", () => {
  assert.equal(cyrToJany('рахмат', X), 'raxmat');
  assert.equal(cyrToJany('Бухара', X), 'Buxara');
  assert.equal(cyrToJany('Халилур', X), 'Xalilur');
  assert.equal(cyrToJany('ХАЛЫК', X), 'XALYK');
});

test('reverse: x → х, so the mode round-trips', () => {
  assert.equal(janyToCyr('raxmat'), 'рахмат');
  assert.equal(janyToCyr(cyrToJany('Махабат, Бухара', X)), 'Махабат, Бухара');
});

test("collation: x sorts right after h in 'x' mode, as the CTA places X", () => {
  assert.ok(compare('xat', 'iş', X) < 0);
  assert.ok(compare('hat', 'xat', X) < 0);
  assert.ok(compare('xat', 'iş') > 0);
});
