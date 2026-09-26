// SPDX-License-Identifier: MIT
/**
 * Casing for multi-character graphemes (SPEC §2.1). A word is converted in
 * lowercase and recased from the source word's pattern, in both directions.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { cyrToJany, janyToCyr, type JanyOptions } from '../src/convert.js';

const DIGRAPH: JanyOptions = { sibilants: 'digraph' };
const DOTLESS: JanyOptions = { yGrapheme: 'dotless-i' };

// [cyrillic, jany, options] in lowercase; each row is checked in all three patterns.
const GRAPHEMES: ReadonlyArray<readonly [string, string, string, JanyOptions?]> = [
  ['ía', 'яблоко', 'íabloko'],
  ['ío', 'ёлка', 'íolka'],
  ['íu', 'юрист', 'íurist'],
  ['íe', 'европа', 'íevropa'],
  ['ts', 'цирк', 'tsirk'],
  ['ch', 'чай', 'chaí', DIGRAPH],
  ['sh', 'шаар', 'shaar', DIGRAPH],
  ['sch', 'щетка', 'schetka', DIGRAPH],
];

const title = (s: string) => s[0].toUpperCase() + s.slice(1);

test('§2.1 each multi-character grapheme in lowercase, sentence case, and all caps', () => {
  for (const [label, cyr, jany, opts] of GRAPHEMES) {
    assert.equal(cyrToJany(cyr, opts), jany, `${label} lowercase`);
    assert.equal(cyrToJany(title(cyr), opts), title(jany), `${label} sentence case`);
    assert.equal(cyrToJany(cyr.toUpperCase(), opts), jany.toUpperCase(), `${label} all caps`);
  }
  // Only the first character of the grapheme carries a sentence-case capital.
  assert.equal(cyrToJany('Яблоко'), 'Íabloko');
  assert.equal(cyrToJany('ЯБЛОКО'), 'ÍABLOKO');
  assert.equal(cyrToJany('Цирк'), 'Tsirk');
  assert.equal(cyrToJany('ЦИРК'), 'TSIRK');
  assert.equal(cyrToJany('Чай', DIGRAPH), 'Chaí');
  assert.equal(cyrToJany('ЧАЙ', DIGRAPH), 'CHAÍ');
});

test('§2.1 reverse casing follows the Latin source word', () => {
  assert.equal(janyToCyr('íabloko'), 'яблоко');
  assert.equal(janyToCyr('Íabloko'), 'Яблоко');
  assert.equal(janyToCyr('ÍABLOKO'), 'ЯБЛОКО');
  assert.equal(janyToCyr('Íolka'), 'Ёлка');
  assert.equal(janyToCyr('ÍURIST'), 'ЮРИСТ');
  assert.equal(janyToCyr('Chaí'), 'Чай');
  assert.equal(janyToCyr('CHAÍ'), 'ЧАЙ');
  assert.equal(janyToCyr('SHAAR'), 'ШААР');
  // ts → тс is the §18.1 native-priority rule; casing still follows the source.
  assert.equal(janyToCyr('Tsirk'), 'Тсирк');
  assert.equal(janyToCyr('TSIRK'), 'ТСИРК');
});

test('§2.1 round trip preserves each case pattern', () => {
  for (const word of ['ЯБЛОКО', 'Яблоко', 'яблоко', 'Европа', 'ЕВРОПА', 'Ёлка', 'ЮРИСТ']) {
    assert.equal(janyToCyr(cyrToJany(word)), word, word);
  }
  // Loan ц comes back as тс by design (§18.1); the case pattern still survives.
  assert.equal(janyToCyr(cyrToJany('ЦИРК')), 'ТСИРК');
  assert.equal(janyToCyr(cyrToJany('Цирк')), 'Тсирк');
  assert.equal(janyToCyr(cyrToJany('цирк')), 'тсирк');
});

test('§2.1 a one-letter word takes its case from the line', () => {
  // Alone: no other cased word on the line, so sentence case (the tie-break).
  assert.equal(cyrToJany('Я'), 'Ía');
  assert.equal(cyrToJany('Я!'), 'Ía!');
  assert.equal(cyrToJany('Я иду домой'), 'Ía idu domoí');
  assert.equal(cyrToJany('Я ИДУ ДОМОЙ'), 'ÍA IDU DOMOÍ');
  // Context is per line.
  assert.equal(cyrToJany('Я ИДУ ДОМОЙ\nЯ иду домой'), 'ÍA IDU DOMOÍ\nÍa idu domoí');
  // One lowercase letter anywhere on the line rules out all caps.
  assert.equal(cyrToJany('Я ИДУ домой'), 'Ía IDU domoí');
  assert.equal(cyrToJany('я иду'), 'ía idu');
  // Reverse: a one-letter Latin word maps to one letter, so either reading agrees.
  assert.equal(janyToCyr('ÍA IDU DOMOÍ'), 'Я ИДУ ДОМОЙ');
  assert.equal(janyToCyr('Ía idu domoí'), 'Я иду домой');
});

test('§2.1 dotless ı: explicit case tables only, no string case function is reachable', () => {
  const proto = String.prototype as unknown as Record<string, unknown>;
  const names = ['toUpperCase', 'toLowerCase', 'toLocaleUpperCase', 'toLocaleLowerCase'];
  const saved = names.map((n) => proto[n]);
  let results: string[];
  for (const n of names) {
    proto[n] = () => { throw new Error(`String.prototype.${n} was called`); };
  }
  try {
    results = [
      cyrToJany('кыргыз', DOTLESS),
      cyrToJany('Кыргыз', DOTLESS),
      cyrToJany('КЫРГЫЗ', DOTLESS),
      janyToCyr('kırgız'),
      janyToCyr('Kırgız'),
      janyToCyr('KIRGIZ'),
      cyrToJany('Я ИДУ\nМакЯн чай', { ...DIGRAPH, uvularK: 'q', velarNasal: 'tilde-n' }),
      janyToCyr('ÍA ÍABLOKO\nMakÍan', { restoreLoans: true }),
    ];
  } finally {
    names.forEach((n, i) => { proto[n] = saved[i]; });
  }
  assert.deepEqual(results.slice(0, 6), [
    'kırgız', 'Kırgız', 'KIRGIZ',
    'кыргыз', 'Кыргыз',
    // Without the configuration, the reverse reads I as i (Jany-Latyn); with
    // { yGrapheme: 'dotless-i' } it reads I as ı (tested below).
    'КИРГИЗ',
  ]);
  assert.equal(results[6], 'ÍA IDU\nMaqÍan chaí');
  assert.equal(results[7], 'Я ЯБЛОКО\nМакЯн');
});

test('§2.1 source contains no locale case function', () => {
  for (const file of ['convert.js', 'casing.js']) {
    const src = readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8');
    assert.doesNotMatch(src, /toLocale(Upper|Lower)Case/, file);
  }
});

test('§2.1 mixed-case words use the per-letter fallback', () => {
  assert.equal(cyrToJany('МакЯн'), 'MakÍan');
  assert.equal(cyrToJany('яБлОкО'), 'íaBlOkO');
  assert.equal(cyrToJany('цИРК'), 'tsIRK');
  assert.equal(cyrToJany('ЦиРК'), 'TsiRK');
  assert.equal(cyrToJany('МакЧай', DIGRAPH), 'MakChaí');
  assert.equal(janyToCyr('MakÍan'), 'МакЯн');
  assert.equal(janyToCyr('íaBlOkO'), 'яБлОкО');
  assert.equal(janyToCyr('CHaí'), 'Чай');
});

test('§2.1 dotless configuration uses the Turkish pairs: ı ↔ I, i ↔ İ', () => {
  const D: JanyOptions = { yGrapheme: 'dotless-i' };
  assert.equal(cyrToJany('ИЛИМ', D), 'İLİM');
  assert.equal(cyrToJany('Илим', D), 'İlim');
  assert.equal(cyrToJany('КЫРГЫЗ ИЛИМИ', D), 'KIRGIZ İLİMİ');
  // All caps round-trips once the reverse knows the configuration.
  for (const w of ['КЫРГЫЗ', 'ИЛИМ', 'Кыргыз', 'кыргыз', 'КЫРГЫЗ ИЛИМИ']) {
    assert.equal(janyToCyr(cyrToJany(w, D), D), w, w);
  }
  assert.equal(janyToCyr('ILIM', D), 'ЫЛЫМ');
});

test('§2.1 Jany-Latyn all caps is unaffected by the Turkish pairs', () => {
  assert.equal(cyrToJany('ИЛИМ'), 'ILIM');
  assert.equal(cyrToJany('КЫРГЫЗ ИЛИМИ'), 'KYRGYZ ILIMI');
  assert.equal(janyToCyr('ILIM'), 'ИЛИМ');
  assert.equal(janyToCyr('KIRGIZ'), 'КИРГИЗ'); // Jany-Latyn I is i
  assert.equal(janyToCyr('İLİM'), 'ИЛИМ');   // İ in Jany-Latyn input reads as i
});

test('§2.1 the Turkish pairs follow the configuration, not the process locale', () => {
  const convert = new URL('../src/convert.js', import.meta.url).href;
  const script = `
    const { cyrToJany, janyToCyr } = await import(${JSON.stringify(convert)});
    console.log(JSON.stringify({
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      janyLatyn: cyrToJany('ИЛИМ'),
      janyLatynRev: janyToCyr('ILIM'),
      dotless: cyrToJany('ИЛИМ', { yGrapheme: 'dotless-i' }),
    }));`;
  const env = { ...process.env, LANG: 'tr_TR.UTF-8', LC_ALL: 'tr_TR.UTF-8', LANGUAGE: 'tr' };
  const out = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', script], { env, encoding: 'utf8' }));
  assert.equal(out.janyLatyn, 'ILIM', `Jany-Latyn output changed under locale ${out.locale}`);
  assert.equal(out.janyLatynRev, 'ИЛИМ');
  assert.equal(out.dotless, 'İLİM');
});
