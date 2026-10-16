// SPDX-License-Identifier: MIT
/**
 * Sorting and search for rune text (JANY-ENESAI.md §12, RUNES-SPEC.md §8.3, §10).
 * Runes sort in Kyrgyz Cyrillic order of the letters they write, through an explicit
 * rank table: default collation files the chart's variant pairs (ы/и, ч/ж, …)
 * together, and Intl.Collator takes no tailoring.
 */
import { foldKey } from '../convert.js';
import { rune, DOT_ABOVE, TWO_DOT, type RuneName } from './inventory.js';
import { runeLetters } from './reverse.js';

// Kyrgyz Cyrillic order (а б в г д е ж з и й к л м н ң о ө п р с т у ү ф х ч ш ы) in
// Jany-Latyn letters, with the absorbed letters left out and compose-mode ä after а.
const ORDER = [...'aäbvgdejziíklmnŋoöprstuüfhçşy'];
const RANK = new Map(ORDER.map((l, i) => [l, i]));

// Front-series forms sort after the back form of the same letter (secondary level).
const FRONT = new Set((['ORKHON AEB', 'YENISEI AEB', 'ORKHON AEG', 'YENISEI AEG', 'ORKHON AED',
  'ORKHON AEY', 'YENISEI AEY', 'ORKHON AEK', 'YENISEI AEK', 'ORKHON OEK', 'ORKHON AEL',
  'ORKHON AEN', 'YENISEI AEN', 'ORKHON AER', 'ORKHON AES', 'ORKHON AET', 'YENISEI AET',
  'ORKHON IC', 'YENISEI AENG'] as RuneName[]).map(rune));

const NON_LETTER = -0x200000;
const OTHER_LETTER = 0x200000;

interface Unit { primary: number; series: number; form: number }

function units(text: string): Unit[] {
  const out: Unit[] = [];
  const chars = [...text.normalize('NFC')];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i], cp = ch.codePointAt(0)!;
    let letters = runeLetters(ch);
    if (ch === rune('ORKHON O') && chars[i + 1] === DOT_ABOVE) { letters = 'u'; i++; }
    if (letters !== undefined) {
      const series = FRONT.has(ch) ? 1 : 0;
      for (const l of letters) out.push({ primary: RANK.get(l)!, series, form: cp });
    } else if (ch === TWO_DOT || !/\p{L}/u.test(ch)) {
      out.push({ primary: NON_LETTER + (ch === TWO_DOT ? 0x20 : cp), series: 0, form: cp });
    } else {
      out.push({ primary: OTHER_LETTER + cp, series: 0, form: cp });
    }
  }
  return out;
}

const cmp = (a: number, b: number) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * Compares two rune strings: by the letters they write in Kyrgyz Cyrillic order,
 * then by series (back first), then by code point, so the order is total. Every
 * form of a letter, and the stones' variants, sort with the letter.
 */
export function compareRunes(a: string, b: string): number {
  const A = units(a), B = units(b);
  const n = Math.min(A.length, B.length);
  for (let i = 0; i < n; i++) { const d = cmp(A[i].primary, B[i].primary); if (d) return d; }
  if (A.length !== B.length) return cmp(A.length, B.length);
  for (let i = 0; i < n; i++) { const d = cmp(A[i].series, B[i].series); if (d) return d; }
  for (let i = 0; i < n; i++) { const d = cmp(A[i].form, B[i].form); if (d) return d; }
  return 0;
}

/**
 * A search key for rune text: each rune becomes the letter it writes, ⁚ a space,
 * and the result is folded like Jany-Latyn (foldKey). A Latin or Cyrillic query
 * matches when its own Jany-Latyn form folds to the same key.
 */
export function runeFoldKey(text: string): string {
  let out = '';
  const chars = [...text.normalize('NFC')];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === rune('ORKHON O') && chars[i + 1] === DOT_ABOVE) { out += 'u'; i++; continue; }
    out += ch === TWO_DOT ? ' ' : (runeLetters(ch) ?? ch);
  }
  return foldKey(out);
}
