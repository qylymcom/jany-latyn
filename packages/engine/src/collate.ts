// SPDX-License-Identifier: MIT
/**
 * Alphabetical order (whitepaper §9.5–§9.6, SPEC §6). `Intl.Collator` accepts no
 * custom tailoring, so the order is an explicit rank table per configuration,
 * built from the same anchors as the published ICU rules:
 *
 *   &c < ç   &i < í   &n < ŋ   &o < ö   &s < ş   &u < ü
 *   &k < q   (uvularK: 'q')        &g < ğ   (uvularG: 'ğ')
 *   &a < ä   (extendedLetters)     &h < ı < i < í   (yGrapheme: 'dotless-i')
 *
 * Letters a configuration does not anchor keep their default Latin position.
 * Comparison is primary (letters) first, then the exact letter, then case,
 * lowercase first. Case is resolved with the configuration's case table
 * (casing.ts), so in the dotless configuration I sorts with ı and İ with i.
 * The expected orderings are pinned in test/fixtures/collation.json.
 */
import { caseModeFor, isUpperChar, lowerStr, type CaseMode } from './casing.js';
import type { JanyOptions } from './convert.js';

export interface CollateOptions extends JanyOptions {
  // The §11.2 compose-mode letter ä sorts after a when enabled.
  extendedLetters?: boolean;
}

const LATIN = 'abcdefghijklmnopqrstuvwxyz'.split('');

function insertAfter(order: string[], anchor: string, ...letters: string[]): void {
  for (const l of letters) {
    const at = order.indexOf(l);
    if (at >= 0) order.splice(at, 1);
  }
  order.splice(order.indexOf(anchor) + 1, 0, ...letters);
}

function rankTable(o: CollateOptions | undefined): Map<string, number> {
  const order = [...LATIN];
  insertAfter(order, 'c', 'ç');
  // The glide letter and its testbed alternatives; one configuration uses one of them.
  insertAfter(order, 'i', 'í', 'ĭ', 'ĩ');
  insertAfter(order, 'n', 'ŋ', 'ñ');
  // Cyrillic ө and the u display variants occupy the position of ö and ü.
  insertAfter(order, 'o', 'ö', 'ө');
  insertAfter(order, 's', 'ş');
  insertAfter(order, 'u', 'ü', 'ū', 'ұ', 'ʉ');
  if (o?.uvularK === 'q') insertAfter(order, 'k', 'q');
  if (o?.uvularG === 'ğ') insertAfter(order, 'g', 'ğ');
  if (o?.extendedLetters) insertAfter(order, 'a', 'ä');
  if (o?.yGrapheme === 'dotless-i') insertAfter(order, 'h', 'ı', 'i', 'í', 'ĭ', 'ĩ');
  return new Map(order.map((l, i) => [l, i]));
}

// Characters outside the table: non-letters sort before all letters, other
// letters after them; letters with a known base (e.g. é) take the base's rank.
const NON_LETTER = -0x200000;
const OTHER_LETTER = 0x200000;

function primary(c: string, ranks: Map<string, number>): number {
  const r = ranks.get(c);
  if (r !== undefined) return r;
  if (!/\p{L}/u.test(c)) return NON_LETTER + c.codePointAt(0)!;
  const base = c.normalize('NFD')[0];
  return ranks.get(base) ?? OTHER_LETTER + c.codePointAt(0)!;
}

function cmp(a: number, b: number): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * Compares two Jany-Latyn strings in the alphabetical order of a configuration.
 * Returns a negative number, zero, or a positive number, like Array#sort expects:
 * `words.sort((a, b) => compare(a, b, { yGrapheme: 'dotless-i', uvularK: 'q' }))`.
 */
export function compare(a: string, b: string, options?: CollateOptions): number {
  return compareWith(a, b, rankTable(options), caseModeFor(options));
}

// The native Kyrgyz Cyrillic alphabet (SPEC §6). Unlike the Latin order it takes
// no configuration: it is the order every Kyrgyz reader learned, and the list
// view sorts the source column by it so the two columns can be read against
// each other.
const CYRILLIC = [...'абвгдеёжзийклмнңоөпрстуүфхцчшщъыьэюя'];
const CYRILLIC_RANKS = new Map(CYRILLIC.map((l, i) => [l, i]));

/**
 * Compares two Kyrgyz Cyrillic strings in the native alphabet order.
 * Takes no options; the Cyrillic order is fixed.
 */
export function compareCyrillic(a: string, b: string): number {
  return compareWith(a, b, CYRILLIC_RANKS, 'default');
}

// Shared by both comparators: primary rank, then the exact letter, then case
// with lowercase first. Case is resolved with an explicit table (casing.ts),
// never a locale case function.
function compareWith(a: string, b: string, ranks: Map<string, number>, mode: CaseMode): number {
  const A = [...a.normalize('NFC')], B = [...b.normalize('NFC')];
  const la = [...lowerStr(A.join(''), mode)], lb = [...lowerStr(B.join(''), mode)];
  const n = Math.min(la.length, lb.length);
  for (let i = 0; i < n; i++) {
    const d = cmp(primary(la[i], ranks), primary(lb[i], ranks));
    if (d) return d;
  }
  if (la.length !== lb.length) return cmp(la.length, lb.length);
  for (let i = 0; i < n; i++) {
    const d = cmp(la[i].codePointAt(0)!, lb[i].codePointAt(0)!);   // same rank, different letter (é vs e)
    if (d) return d;
  }
  for (let i = 0; i < n; i++) {
    const d = cmp(Number(isUpperChar(A[i], mode)), Number(isUpperChar(B[i], mode)));   // lowercase first
    if (d) return d;
  }
  return 0;
}
