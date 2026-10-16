// SPDX-License-Identifier: MIT
/**
 * The Old Turkic block, U+10C00–U+10C48, by Unicode character name without the
 * "OLD TURKIC LETTER " prefix. Code refers to runes by these names, never by bare
 * code points, so every table reads the way the Unicode chart does.
 */

export const RUNE_NAMES = [
  'ORKHON A', 'YENISEI A', 'YENISEI AE', 'ORKHON I', 'YENISEI I', 'YENISEI E',
  'ORKHON O', 'ORKHON OE', 'YENISEI OE',
  'ORKHON AB', 'YENISEI AB', 'ORKHON AEB', 'YENISEI AEB',
  'ORKHON AG', 'YENISEI AG', 'ORKHON AEG', 'YENISEI AEG',
  'ORKHON AD', 'YENISEI AD', 'ORKHON AED',
  'ORKHON EZ', 'YENISEI EZ',
  'ORKHON AY', 'YENISEI AY', 'ORKHON AEY', 'YENISEI AEY',
  'ORKHON AEK', 'YENISEI AEK', 'ORKHON OEK', 'YENISEI OEK',
  'ORKHON AL', 'YENISEI AL', 'ORKHON AEL', 'ORKHON ELT', 'ORKHON EM',
  'ORKHON AN', 'ORKHON AEN', 'YENISEI AEN', 'ORKHON ENT', 'YENISEI ENT',
  'ORKHON ENC', 'YENISEI ENC', 'ORKHON ENY', 'YENISEI ENY',
  'YENISEI ANG', 'ORKHON ENG', 'YENISEI AENG', 'ORKHON EP', 'ORKHON OP',
  'ORKHON IC', 'ORKHON EC', 'YENISEI EC',
  'ORKHON AQ', 'YENISEI AQ', 'ORKHON IQ', 'YENISEI IQ', 'ORKHON OQ', 'YENISEI OQ',
  'ORKHON AR', 'YENISEI AR', 'ORKHON AER', 'ORKHON AS', 'ORKHON AES',
  'ORKHON ASH', 'YENISEI ASH', 'ORKHON ESH', 'YENISEI ESH',
  'ORKHON AT', 'YENISEI AT', 'ORKHON AET', 'YENISEI AET', 'ORKHON OT', 'ORKHON BASH',
] as const;

export type RuneName = (typeof RUNE_NAMES)[number];

const FIRST = 0x10c00;
const BY_NAME = new Map<string, string>(RUNE_NAMES.map((n, i) => [n, String.fromCodePoint(FIRST + i)]));
const BY_RUNE = new Map<string, RuneName>(RUNE_NAMES.map((n, i) => [String.fromCodePoint(FIRST + i), n]));

/** The rune with this Unicode name. */
export function rune(name: RuneName): string {
  return BY_NAME.get(name)!;
}

/** The Unicode name of a rune, or undefined for anything else. */
export function runeName(r: string): RuneName | undefined {
  return BY_RUNE.get(r);
}

/** U+205A TWO DOT PUNCTUATION, the inscriptions' word divider. */
export const TWO_DOT = '⁚';
/** U+0307 COMBINING DOT ABOVE, for the dotted-o toggle of `у`. */
export const DOT_ABOVE = '̇';
/** U+10CEA OLD HUNGARIAN SMALL LETTER U, for the Old Hungarian toggle of `у`. */
export const OLD_HUNGARIAN_U = '\u{10CEA}';
