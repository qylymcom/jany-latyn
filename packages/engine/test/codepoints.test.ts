// SPDX-License-Identifier: MIT
/**
 * Codepoint inventory (mirrors SPEC.md §9). Asserts every special character in
 * the alphabet tables and display maps by NUMERIC codepoint, not by literal —
 * so a lookalike substitution (Latin ő U+0151 for Cyrillic ө U+04E9, Latin ü
 * U+00FC for Kyrgyz ү U+04AF) fails here even though it is invisible in review.
 * That is exactly the bug class the first round found in the hybrid map and in
 * CANON_VOWELS.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LETTER_MAP, FALLBACK, EXTENDED_LETTERS } from '../src/alphabet.js';
import {
  cyrToJany,
  janyToCyr,
  janyToFallback,
  foldKey,
  janyToLatinU,
  janyToCyrillicU,
  janyToMacronU,
} from '../src/convert.js';

const U = (n: number) => String.fromCodePoint(n);
const cps = (s: string) => [...s].map((c) => c.codePointAt(0)!);
const hex = (n: number) => 'U+' + n.toString(16).toUpperCase().padStart(4, '0');

// SPEC §9 inventory — the only non-ASCII codepoints allowed to appear in
// canonical Latin output and the letter tables.
const CANONICAL_LATIN = new Set<number>([
  0x00d6, 0x00f6, // Ö ö
  0x00dc, 0x00fc, // Ü ü
  0x00cd, 0x00ed, // Í í
  0x012c, 0x012d, // Ĭ ĭ (breve glide alternative, §11.1)
  0x0128, 0x0129, // Ĩ ĩ (tilde glide alternative, §11.1)
  0x014a, 0x014b, // Ŋ ŋ
  0x00d1, 0x00f1, // Ñ ñ (velar-nasal alternative)
  0x00c7, 0x00e7, // Ç ç
  0x015e, 0x015f, // Ş ş
  0x0130, 0x0131, // İ ı (dotless-i option)
  0x011e, 0x011f, // Ğ ğ (ğ option)
  0x00c4, 0x00e4, // Ä ä (extended)
]);

// Cyrillic keys / display-variant codepoints.
const CYR_OE = 0x04e9, CYR_OE_CAP = 0x04e8;   // ө Ө
const CYR_UE = 0x04af, CYR_UE_CAP = 0x04ae;   // ү Ү
const CYR_NG = 0x04a3;                         // ң
const KAZ_U = 0x04b1, KAZ_U_CAP = 0x04b0;      // ұ Ұ
const MACRON_U = 0x016b, MACRON_U_CAP = 0x016a; // ū Ū
const BARRED_U = 0x0289, BARRED_U_CAP = 0x0244; // ʉ Ʉ

test('§9 LETTER_MAP special letters use the exact expected codepoints', () => {
  const lm = new Map(LETTER_MAP);
  const expect: [number, number[]][] = [
    [CYR_OE, [0x00f6]], // ө → ö
    [CYR_UE, [0x00fc]], // ү → ü
    [CYR_NG, [0x014b]], // ң → ŋ
    [0x0439, [0x00ed]], // й → í
    [0x0447, [0x00e7]], // ч → ç
    [0x0448, [0x015f]], // ш → ş
  ];
  for (const [keyCp, valCps] of expect) {
    const key = U(keyCp);
    assert.ok(lm.has(key), `LETTER_MAP missing key ${hex(keyCp)}`);
    assert.deepEqual(cps(lm.get(key)!), valCps, `value codepoints wrong for key ${hex(keyCp)}`);
  }
  // Lookalikes must NOT be present as keys.
  assert.ok(!lm.has(U(0x0151)), 'Latin ő U+0151 must not be a LETTER_MAP key (should be Cyrillic ө U+04E9)');
  assert.ok(!lm.has(U(0x0171)), 'Latin ű U+0171 must not be a LETTER_MAP key');
});

test('§9 every non-ASCII char in LETTER_MAP values is in the canonical inventory', () => {
  for (const [, value] of LETTER_MAP) {
    for (const c of cps(value)) {
      assert.ok(
        c < 0x80 || CANONICAL_LATIN.has(c),
        `unexpected codepoint ${hex(c)} in LETTER_MAP value ${JSON.stringify(value)}`,
      );
    }
  }
});

test('§9 EXTENDED_LETTERS fold ä→а, x→х, w→в by exact codepoint', () => {
  assert.deepEqual(
    EXTENDED_LETTERS.map(([a, b]) => [a.codePointAt(0), b.codePointAt(0)]),
    [
      [0x00e4, 0x0430], // ä → а (Cyrillic)
      [0x0078, 0x0445], // x → х (Cyrillic)
      [0x0077, 0x0432], // w → в (Cyrillic)
    ],
  );
});

test('§9 FALLBACK includes dotless ı/İ and only inventory source chars', () => {
  const fb = new Map(FALLBACK);
  assert.ok(fb.has(U(0x0131)), 'FALLBACK missing ı U+0131');
  assert.equal(fb.get(U(0x0131)), 'i');
  assert.ok(fb.has(U(0x0130)), 'FALLBACK missing İ U+0130');
  assert.equal(fb.get(U(0x0130)), 'I');
  for (const [from] of FALLBACK) {
    const c = from.codePointAt(0)!;
    const ok = c < 0x80 || CANONICAL_LATIN.has(c) ||
      [CYR_OE, CYR_OE_CAP, KAZ_U, KAZ_U_CAP, MACRON_U, MACRON_U_CAP].includes(c);
    assert.ok(ok, `FALLBACK source char ${hex(c)} not in inventory`);
  }
});

test('§4.1/§4.2 hybrid and display vowel maps emit the exact codepoints', () => {
  // hybrid: Cyrillic ө (U+04E9) + Latin ü (U+00FC)
  assert.equal(cyrToJany('көл', { vowels: 'hybrid' }).codePointAt(1), CYR_OE);
  assert.equal(cyrToJany('күз', { vowels: 'hybrid' }).codePointAt(1), 0x00fc);
  // cyrillic-u: Cyrillic ө + Kazakh ұ (U+04B1)
  assert.equal(cyrToJany('көл', { vowels: 'cyrillic-u' }).codePointAt(1), CYR_OE);
  assert.equal(cyrToJany('күз', { vowels: 'cyrillic-u' }).codePointAt(1), KAZ_U);
  // draft-macron: Cyrillic ө + macron ū (U+016B)
  assert.equal(cyrToJany('көл', { vowels: 'draft-macron' }).codePointAt(1), CYR_OE);
  assert.equal(cyrToJany('күз', { vowels: 'draft-macron' }).codePointAt(1), MACRON_U);
  // ALL-CAPS hybrid still Cyrillic Ө (U+04E8)
  assert.equal(cyrToJany('КӨЛ', { vowels: 'hybrid' }).codePointAt(1), CYR_OE_CAP);
});

test('§9 display-variant maps emit the exact u-glyph codepoints', () => {
  assert.equal(janyToCyrillicU('ü').codePointAt(0), KAZ_U);
  assert.equal(janyToCyrillicU('Ü').codePointAt(0), KAZ_U_CAP);
  assert.equal(janyToLatinU('ü').codePointAt(0), BARRED_U);
  assert.equal(janyToLatinU('Ü').codePointAt(0), BARRED_U_CAP);
  assert.equal(janyToMacronU('ü').codePointAt(0), MACRON_U);
  assert.equal(janyToMacronU('Ü').codePointAt(0), MACRON_U_CAP);
});

test('§11.1 marked glides emit exact codepoints and reverse/fold like í', () => {
  const BREVE = 0x012d, BREVE_CAP = 0x012c, TILDE = 0x0129, TILDE_CAP = 0x0128;
  assert.deepEqual(cps(cyrToJany('ай', { glideGrapheme: 'breve-i' })), [0x61, BREVE]);
  assert.deepEqual(cps(cyrToJany('ай', { glideGrapheme: 'tilde-i' })), [0x61, TILDE]);
  assert.equal(cyrToJany('Ёлка', { glideGrapheme: 'breve-i' }).codePointAt(0), BREVE_CAP);
  assert.equal(cyrToJany('Ёлка', { glideGrapheme: 'tilde-i' }).codePointAt(0), TILDE_CAP);
  // Both decompose under NFD (i + U+0306 / U+0303), so foldKey strips them with no special case.
  assert.deepEqual(cps(U(BREVE).normalize('NFD')), [0x69, 0x0306]);
  assert.deepEqual(cps(U(TILDE).normalize('NFD')), [0x69, 0x0303]);
  for (const g of [BREVE, TILDE, BREVE_CAP, TILDE_CAP]) {
    assert.equal(foldKey(U(g)), 'i', `foldKey ${hex(g)}`);
    assert.equal(janyToCyr(U(g)).toLowerCase(), 'й', `janyToCyr ${hex(g)}`);
    assert.equal(janyToFallback(U(g)).toLowerCase(), 'i', `janyToFallback ${hex(g)}`);
  }
  // A decomposed input (i + combining breve) is composed by NFC before reversal.
  assert.equal(janyToCyr('ai\u0306'), 'ай');
});
