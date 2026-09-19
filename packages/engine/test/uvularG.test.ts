// SPDX-License-Identifier: MIT
/**
 * The г / ğ toggle (SPEC §7). 'ğ' writes back-harmonic г as ğ by the same rule
 * as q, so it shares q's weakness: Cyrillic writes [g] and [ʁ] with one letter,
 * and loanwords come out wrong.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cyrToJany, janyToCyr, janyToFallback, foldKey, type JanyOptions } from '../src/convert.js';

const G: JanyOptions = { uvularG: 'ğ' };

test('г → g by default', () => {
  assert.equal(cyrToJany('болгон'), 'bolgon');
  assert.equal(cyrToJany('газ'), 'gaz');
});

test("г → ğ next to back vowels in 'ğ' mode; front-vowel г stays g", () => {
  assert.equal(cyrToJany('болгон', G), 'bolğon');
  assert.equal(cyrToJany('чыгармалар', G), 'çygarmalar'.replace('g', 'ğ'));
  assert.equal(cyrToJany('белги', G), 'belgi');
  assert.equal(cyrToJany('иммуногистохимия', G), 'immunogistohimiía');
  assert.equal(cyrToJany('ГАЗ', G), 'ĞAZ');
  assert.equal(cyrToJany('Болгон', G), 'Bolğon');
});

test("'ğ' mode is wrong for loanwords, by construction", () => {
  assert.equal(cyrToJany('газ', G), 'ğaz');
  assert.equal(cyrToJany('гарантия', G), 'ğarantiía');
});

test('ğ is independent of q', () => {
  assert.equal(cyrToJany('кыргыз', { uvularK: 'q' }), 'qyrgyz');
  assert.equal(cyrToJany('кыргыз', G), 'kyrğyz');
  assert.equal(cyrToJany('кыргыз', { uvularK: 'q', uvularG: 'ğ', yGrapheme: 'dotless-i' }), 'qırğız');
});

test('reverse ğ → г, ASCII fallback ğ → g, fold ğ → g', () => {
  assert.equal(janyToCyr('bolğon'), 'болгон');
  assert.equal(janyToCyr('ĞAZ'), 'ГАЗ');
  assert.equal(janyToFallback('bolğon Ğaz'), 'bolgon Gaz');
  assert.equal(foldKey('bolğon'), foldKey('bolgon'));
});
