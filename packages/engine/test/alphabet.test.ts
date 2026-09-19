// SPDX-License-Identifier: MIT
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LETTER_MAP, FALLBACK } from '../src/alphabet.js';

test('LETTER_MAP covers all 36 Kyrgyz Cyrillic letters exactly once', () => {
  assert.equal(LETTER_MAP.length, 36);
  const cyr = LETTER_MAP.map(([c]) => c);
  assert.equal(new Set(cyr).size, 36);
  for (const required of ['ң', 'ө', 'ү', 'ы', 'й', 'ж']) {
    assert.ok(cyr.includes(required), `missing ${required}`);
  }
});

test('every jany form is non-empty (except absorbed signs ъ and ь) and every cyr key is a single lowercase letter', () => {
  for (const [c, j] of LETTER_MAP) {
    assert.equal(c.length, 1);
    assert.equal(c, c.toLowerCase());
    if (c === 'ъ' || c === 'ь') {
      assert.equal(j, '');
    } else {
      assert.ok(j.length > 0);
    }
  }
});

test('no jany form uses q', () => {
  for (const [, j] of LETTER_MAP) {
    assert.ok(!j.includes('q'), `q found in ${j}`);
  }
});

test('FALLBACK covers ü, ö, ä, ŋ, legacy ū, and sibilant cedillas ç, ş', () => {
  const map = new Map(FALLBACK);
  assert.equal(map.get('ü'), 'u');
  assert.equal(map.get('Ü'), 'U');
  assert.equal(map.get('ö'), 'o');
  assert.equal(map.get('Ö'), 'O');
  assert.equal(map.get('ä'), 'a');
  assert.equal(map.get('Ä'), 'A');
  assert.equal(map.get('ŋ'), 'n');
  assert.equal(map.get('Ŋ'), 'N');
  assert.equal(map.get('ū'), 'u');
  assert.equal(map.get('Ū'), 'U');
  assert.equal(map.get('ç'), 'c');
  assert.equal(map.get('Ç'), 'C');
  assert.equal(map.get('ş'), 's');
  assert.equal(map.get('Ş'), 'S');
});

test('LETTER_MAP maps ө to canonical ö and ү to canonical ü', () => {
  const map = new Map(LETTER_MAP);
  assert.equal(map.get('ө'), 'ö');
  assert.equal(map.get('ү'), 'ü');
});

test('LETTER_MAP maps й to canonical í, and iotated vowels to ía, ío, íu', () => {
  const map = new Map(LETTER_MAP);
  assert.equal(map.get('й'), 'í');
  assert.equal(map.get('я'), 'ía');
  assert.equal(map.get('ё'), 'ío');
  assert.equal(map.get('ю'), 'íu');
});

test('LETTER_MAP maps ч to ç, ш to ş, and щ to ş', () => {
  const map = new Map(LETTER_MAP);
  assert.equal(map.get('ч'), 'ç');
  assert.equal(map.get('ш'), 'ş');
  assert.equal(map.get('щ'), 'ş');
});

test('LETTER_MAP absorbs ъ and ь into empty strings', () => {
  const map = new Map(LETTER_MAP);
  assert.equal(map.get('ъ'), '');
  assert.equal(map.get('ь'), '');
});

test('FALLBACK covers í and Í mapping to i and I', () => {
  const fallback = new Map(FALLBACK);
  assert.equal(fallback.get('í'), 'i');
  assert.equal(fallback.get('Í'), 'I');
});


