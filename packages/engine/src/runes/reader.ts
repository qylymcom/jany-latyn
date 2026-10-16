// SPDX-License-Identifier: MIT
/**
 * The inscription reader (RUNES-SPEC.md §7.2–§7.3, Appendix B): runes as a stone has
 * them, in, sign values out. One value per sign, no vowel supplied, nothing
 * interpreted. The Orkhon and Yenisei forms of a letter read alike.
 */
import { rune, TWO_DOT, type RuneName } from './inventory.js';

export type ReaderTarget = 'scholarly' | 'cta' | 'jany-latyn' | 'cyrillic';

// The series a sign marks: back, front, or neither. 𐰃 takes its target letter
// from the nearest sign of a series (§7.3).
type Series = 'back' | 'front' | null;

interface Sign {
  scholarly: string; cta: string; janyLatyn: string; cyrillic: string; series: Series;
}

const S = (scholarly: string, cta: string, janyLatyn: string, cyrillic: string, series: Series = null): Sign =>
  ({ scholarly, cta, janyLatyn, cyrillic, series });

// 𐰃 and 𐰄 are written by the context rule; their entries hold the front letters.
const I_SIGN = S('i', 'i', 'i', 'и');
const I_BACK = { cta: 'ı', janyLatyn: 'y', cyrillic: 'ы' } as const;

const SIGNS: ReadonlyArray<readonly [readonly RuneName[], Sign]> = [
  [['ORKHON A', 'YENISEI A'], S('a', 'a', 'a', 'а')],
  [['YENISEI AE'], S('ä', 'ə', 'e', 'э')],
  [['ORKHON I', 'YENISEI I'], I_SIGN],
  [['YENISEI E'], S('e', 'e', 'e', 'э')],
  [['ORKHON O'], S('o', 'o', 'o', 'о')],
  [['ORKHON OE', 'YENISEI OE'], S('ö', 'ö', 'ö', 'ө')],
  [['ORKHON AB', 'YENISEI AB'], S('b¹', 'b', 'b', 'б', 'back')],
  [['ORKHON AEB', 'YENISEI AEB'], S('b²', 'b', 'b', 'б', 'front')],
  [['ORKHON AG', 'YENISEI AG'], S('g¹', 'ğ', 'g', 'г', 'back')],
  [['ORKHON AEG', 'YENISEI AEG'], S('g²', 'g', 'g', 'г', 'front')],
  [['ORKHON AD', 'YENISEI AD'], S('d¹', 'd', 'd', 'д', 'back')],
  [['ORKHON AED'], S('d²', 'd', 'd', 'д', 'front')],
  [['ORKHON EZ', 'YENISEI EZ'], S('z', 'z', 'z', 'з')],
  [['ORKHON AY', 'YENISEI AY'], S('y¹', 'y', 'í', 'й', 'back')],
  [['ORKHON AEY', 'YENISEI AEY'], S('y²', 'y', 'í', 'й', 'front')],
  [['ORKHON AEK', 'YENISEI AEK'], S('k²', 'k', 'k', 'к', 'front')],
  [['ORKHON OEK', 'YENISEI OEK'], S('ök', 'ök', 'ök', 'өк', 'front')],
  [['ORKHON AL', 'YENISEI AL'], S('l¹', 'l', 'l', 'л', 'back')],
  [['ORKHON AEL'], S('l²', 'l', 'l', 'л', 'front')],
  [['ORKHON ELT'], S('lt', 'lt', 'lt', 'лт')],
  [['ORKHON EM'], S('m', 'm', 'm', 'м')],
  [['ORKHON AN'], S('n¹', 'n', 'n', 'н', 'back')],
  [['ORKHON AEN', 'YENISEI AEN'], S('n²', 'n', 'n', 'н', 'front')],
  [['ORKHON ENT', 'YENISEI ENT'], S('nt', 'nt', 'nt', 'нт')],
  [['ORKHON ENC', 'YENISEI ENC'], S('nč', 'nç', 'nç', 'нч')],
  [['ORKHON ENY', 'YENISEI ENY'], S('ny', 'ny', 'ní', 'нй')],
  [['YENISEI ANG', 'ORKHON ENG', 'YENISEI AENG'], S('ñ', 'ñ', 'ŋ', 'ң')],
  [['ORKHON EP'], S('p', 'p', 'p', 'п')],
  [['ORKHON OP'], S('op', 'op', 'op', 'оп', 'back')],
  [['ORKHON IC'], S('ič', 'iç', 'iç', 'ич')],
  [['ORKHON EC', 'YENISEI EC'], S('č', 'ç', 'ç', 'ч')],
  [['ORKHON AQ', 'YENISEI AQ'], S('q', 'q', 'k', 'к', 'back')],
  [['ORKHON IQ', 'YENISEI IQ'], S('ıq', 'ıq', 'yk', 'ык', 'back')],
  [['ORKHON OQ', 'YENISEI OQ'], S('oq', 'oq', 'ok', 'ок', 'back')],
  [['ORKHON AR', 'YENISEI AR'], S('r¹', 'r', 'r', 'р', 'back')],
  [['ORKHON AER'], S('r²', 'r', 'r', 'р', 'front')],
  [['ORKHON AS'], S('s¹', 's', 's', 'с', 'back')],
  [['ORKHON AES'], S('s²', 's', 's', 'с', 'front')],
  [['ORKHON ASH'], S('aš', 'aş', 'aş', 'аш', 'back')],
  [['YENISEI ASH', 'ORKHON ESH', 'YENISEI ESH'], S('š', 'ş', 'ş', 'ш')],
  [['ORKHON AT', 'YENISEI AT'], S('t¹', 't', 't', 'т', 'back')],
  [['ORKHON AET', 'YENISEI AET'], S('t²', 't', 't', 'т', 'front')],
  [['ORKHON OT'], S('ot', 'ot', 'ot', 'от', 'back')],
  [['ORKHON BASH'], S('baš', 'baş', 'baş', 'баш')],
];
const BY_RUNE = new Map<string, Sign>(SIGNS.flatMap(([names, sign]) => names.map((n) => [rune(n), sign] as const)));

/** The sign value of one rune, or undefined for anything else. */
export function signValue(r: string): string | undefined {
  return BY_RUNE.get(r)?.scholarly;
}

/** The series 𐰃 takes in a word: from the nearest sign of a series, left first, then right. */
function iSeries(signs: readonly (Sign | undefined)[], k: number): Series {
  for (let i = k - 1; i >= 0 && signs[i]; i--) if (signs[i]!.series) return signs[i]!.series;
  for (let i = k + 1; i < signs.length && signs[i]; i++) if (signs[i]!.series) return signs[i]!.series;
  return 'front';
}

/**
 * Reads runes sign by sign (RUNES-SPEC §7.2). ⁚ becomes a space; ⸱, spaces and
 * `...` pass through; runs of spaces collapse and the result is trimmed.
 */
export function readInscription(text: string, target: ReaderTarget = 'scholarly'): string {
  const chars = [...text];
  const signs = chars.map((c) => BY_RUNE.get(c));
  let out = '';
  for (let k = 0; k < chars.length; k++) {
    const sign = signs[k];
    if (!sign) { out += chars[k] === TWO_DOT ? ' ' : chars[k]; continue; }
    if (target === 'scholarly') { out += sign.scholarly; continue; }
    const key = target === 'jany-latyn' ? 'janyLatyn' : target;
    out += sign === I_SIGN && iSeries(signs, k) === 'back' ? I_BACK[key] : sign[key];
  }
  return out.replace(/ {2,}/g, ' ').trim();
}
