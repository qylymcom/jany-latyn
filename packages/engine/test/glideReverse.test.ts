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
