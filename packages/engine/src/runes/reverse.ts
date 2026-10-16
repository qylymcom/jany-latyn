// SPDX-License-Identifier: MIT
/**
 * Converting back (JANY-ENESAI.md §13, §26; RUNES-SPEC.md §5). One table serves every
 * reversible setting: no rune writes two different letters in any setting that
 * isReversible() accepts. Runes have no case, so the result is lowercase.
 */
import { janyToCyr } from '../convert.js';
import { DEFAULT_RUNE_OPTIONS, type RuneOptions } from './options.js';
import { rune, DOT_ABOVE, OLD_HUNGARIAN_U, TWO_DOT, type RuneName } from './inventory.js';

const LETTER: ReadonlyArray<readonly [string, readonly RuneName[]]> = [
  ['a', ['ORKHON A']], ['ä', ['YENISEI AE']], ['e', ['YENISEI E']],
  ['y', ['ORKHON I']], ['i', ['YENISEI I']], ['o', ['ORKHON O']], ['u', ['ORKHON BASH']],
  ['ö', ['ORKHON OE']], ['ü', ['YENISEI OE']],
  ['b', ['ORKHON AB', 'ORKHON AEB', 'YENISEI AEB']], ['v', ['YENISEI AB']],
  ['g', ['ORKHON AG', 'YENISEI AG', 'ORKHON AEG']], ['d', ['ORKHON AD', 'ORKHON AED']],
  ['z', ['ORKHON EZ', 'YENISEI EZ']], ['í', ['ORKHON AY', 'ORKHON AEY']], ['j', ['YENISEI EC', 'YENISEI AEY']],
  ['k', ['ORKHON AQ', 'ORKHON AEK', 'YENISEI AEK', 'ORKHON OQ', 'YENISEI OQ', 'ORKHON IQ', 'ORKHON OEK']],
  ['h', ['YENISEI OEK']],
  ['l', ['ORKHON AL', 'ORKHON AEL']], ['f', ['YENISEI AL']], ['m', ['ORKHON EM']],
  ['n', ['ORKHON AN', 'ORKHON AEN', 'YENISEI AEN']], ['ŋ', ['ORKHON ENG', 'YENISEI ANG']],
  ['p', ['ORKHON EP']], ['r', ['ORKHON AR', 'YENISEI AR', 'ORKHON AER']],
  ['s', ['ORKHON AS', 'ORKHON AES', 'YENISEI ESH']], ['ş', ['ORKHON ESH', 'YENISEI ASH']],
  ['t', ['ORKHON AT', 'YENISEI AT', 'ORKHON AET', 'ORKHON OT']], ['ç', ['ORKHON EC', 'ORKHON IC']],
];
const TO_LETTER = new Map<string, string>(LETTER.flatMap(([l, names]) => names.map((n) => [rune(n), l] as const)));
TO_LETTER.set(OLD_HUNGARIAN_U, 'u');

// Forms no reversible setting writes, by the letter they write, for sorting and
// search only (RUNES-SPEC §8.3, §10): the stones' variants and the ligatures.
const FOLD_ONLY: ReadonlyArray<readonly [string, readonly RuneName[]]> = [
  ['a', ['YENISEI A']], ['d', ['YENISEI AD']], ['g', ['YENISEI AEG']], ['í', ['YENISEI AY']],
  ['k', ['YENISEI AQ', 'YENISEI IQ']], ['ŋ', ['YENISEI AENG', 'ORKHON ENY', 'YENISEI ENY']],
  ['t', ['YENISEI AET']], ['p', ['ORKHON OP']], ['ş', ['ORKHON ASH']],
  ['lt', ['ORKHON ELT']], ['nt', ['ORKHON ENT', 'YENISEI ENT']], ['nç', ['ORKHON ENC', 'YENISEI ENC']],
];
const FOLD = new Map<string, string>([
  ...TO_LETTER,
  ...FOLD_ONLY.flatMap(([l, names]) => names.map((n) => [rune(n), l] as const)),
]);

/** The Jany-Latyn letter or letters any rune writes, for sorting and search; undefined for a non-rune. */
export function runeLetters(r: string): string | undefined {
  return FOLD.get(r);
}

/**
 * Whether conversion back to Jany-Latyn is exact under these options. One-way:
 * the epigraphic register, historical vowels, the etymological ж, nativized
 * loan consonants, and the merged ш of the Yenisei forms. Also one-way: the
 * Yenisei forms under full harmony, where 𐰝 writes both х and к beside ө, ү.
 */
export function isReversible(options?: Partial<RuneOptions>): boolean {
  const o: RuneOptions = { ...DEFAULT_RUNE_OPTIONS, ...options };
  if (o.register !== 'plene' || o.vowels !== 'distinct') return false;
  if (o.zhe === 'etymological' || o.loanConsonants !== 'chart') return false;
  if (o.forms === 'yenisei' && (o.yeniseiSh === 'merged' || o.harmony === 'full')) return false;
  return true;
}

/**
 * Runes written in a reversible setting back to canonical Jany-Latyn, lowercase.
 * ⁚ becomes a space. A rune that no reversible setting writes (a ligature, an
 * unused variant) and everything that is not a rune pass through unchanged.
 */
export function runesToJanyLatyn(text: string): string {
  let out = '';
  const chars = [...text];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === rune('ORKHON O') && chars[i + 1] === DOT_ABOVE) { out += 'u'; i++; continue; }
    if (ch === TWO_DOT) { out += ' '; continue; }
    out += TO_LETTER.get(ch) ?? ch;
  }
  return out;
}

/** Runes written in a reversible setting to Kyrgyz Cyrillic, through Jany-Latyn. */
export function runesToCyrillic(text: string, options?: { restoreLoans?: boolean }): string {
  return janyToCyr(runesToJanyLatyn(text), { restoreLoans: options?.restoreLoans });
}
