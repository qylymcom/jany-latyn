// SPDX-License-Identifier: MIT
/**
 * The ж toggle (testbed option inventory, SPEC §7). 'j' writes every ж as j and
 * is the default; 'c' is the mechanical CTA mapping, correct for native [dʒ] and
 * wrong for loanword [ʒ], because Cyrillic writes both as ж.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cyrToJany, janyToCyr, type JanyOptions } from '../src/convert.js';

const C: JanyOptions = { affricate: 'c' };

test('ж → j by default, in every position', () => {
  assert.equal(cyrToJany('жол'), 'jol');
  assert.equal(cyrToJany('журнал'), 'jurnal');
  assert.equal(cyrToJany('гараж'), 'garaj');
  assert.equal(cyrToJany('жол', { affricate: 'j' }), 'jol');
});

test("ж → c in 'c' mode: right for native words", () => {
  assert.equal(cyrToJany('жол', C), 'col');
  assert.equal(cyrToJany('же', C), 'ce');
  assert.equal(cyrToJany('Жаңы', C), 'Caŋy');
  assert.equal(cyrToJany('ЖАҢЫ', C), 'CAŊY');
});

test("ж → c in 'c' mode: wrong for loanwords, by construction", () => {
  // A CTA writer who knows these are loans writes jurnal, garaj, rejim.
  assert.equal(cyrToJany('журнал', C), 'curnal');
  assert.equal(cyrToJany('гараж', C), 'garac');
  assert.equal(cyrToJany('режим', C), 'recim');
});

test('reverse: c → ж; the digraphs ch and sch still win', () => {
  assert.equal(janyToCyr('col'), 'жол');
  assert.equal(janyToCyr('Caŋy'), 'Жаңы');
  assert.equal(janyToCyr(cyrToJany('жаңы жол', C)), 'жаңы жол');
  assert.equal(janyToCyr('chaí'), 'чай');
  assert.equal(janyToCyr('schetka'), 'щетка');
});

test('the ж toggle is independent of the other CTA options', () => {
  const cta: JanyOptions = { yGrapheme: 'dotless-i', glideGrapheme: 'y', uvularK: 'q' };
  assert.equal(cyrToJany('жакшы', cta), 'jaqşı');
  assert.equal(cyrToJany('жакшы', { ...cta, affricate: 'c' }), 'caqşı');
});
