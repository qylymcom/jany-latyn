// SPDX-License-Identifier: MIT
/**
 * Why each rune was chosen, for the testbed's inspector (JANY-ENESAI.md §24): one
 * entry per Jany-Latyn letter, with its rune, the rune's Unicode names, and for a
 * consonant the governing vowel and the series it was written in.
 */
import { cyrToJany } from '../convert.js';
import { lowerStr } from '../casing.js';
import { DEFAULT_RUNE_OPTIONS, type RuneOptions } from './options.js';
import { runeName, DOT_ABOVE, OLD_HUNGARIAN_U } from './inventory.js';
import { wordCells, isJanyWord, type Series } from './forward.js';

export interface LetterExplanation {
  /** The Jany-Latyn letter. */
  letter: string;
  /** The rune that writes it; empty when the letter is dropped or merged into a ligature. */
  rune: string;
  /** Unicode names of the rune's characters ("ORKHON AQ", "COMBINING DOT ABOVE"). */
  names: string[];
  kind: 'vowel' | 'consonant';
  /** The series a consonant was written in; null for a vowel. */
  series: Series | null;
  /** Index (into this word's letters) of the vowel that governs a consonant; null for a vowel or a word without vowels. */
  governor: number | null;
  /** Left unwritten by the epigraphic register. */
  dropped: boolean;
  /** Written together with the next letter as one ligature rune. */
  ligature: boolean;
}

export interface WordExplanation {
  /** The word as it stands in the input. */
  source: string;
  janyLatyn: string;
  runes: string;
  letters: LetterExplanation[];
}

const name = (ch: string) =>
  runeName(ch) ?? (ch === DOT_ABOVE ? 'COMBINING DOT ABOVE' : ch === OLD_HUNGARIAN_U ? 'OLD HUNGARIAN SMALL LETTER U' : ch);

/** Explains each Cyrillic word of the text, as cyrillicToRunes converts it. */
export function explainRunes(text: string, options?: Partial<RuneOptions>): WordExplanation[] {
  const o: RuneOptions = { ...DEFAULT_RUNE_OPTIONS, ...options };
  const out: WordExplanation[] = [];
  for (const source of text.normalize('NFC').match(/\p{Script=Cyrillic}+/gu) ?? []) {
    const janyLatyn = lowerStr(cyrToJany(source));
    if (!isJanyWord(janyLatyn)) continue;
    const cells = wordCells(janyLatyn, o);
    const letters = cells.map((c, i): LetterExplanation => {
      const merged = !!c.drop && i > 0 && !!cells[i - 1].ligature;
      return {
        letter: c.letter,
        rune: c.drop ? '' : c.rune,
        names: c.drop ? [] : [...c.rune].map(name),
        kind: c.governor === undefined ? 'vowel' : 'consonant',
        series: c.series ?? null,
        governor: c.governor === undefined || c.governor === -1 ? null : c.governor,
        dropped: !!c.drop && !merged,
        ligature: !!c.ligature || merged,
      };
    });
    out.push({ source, janyLatyn, runes: letters.map((l) => l.rune).join(''), letters });
  }
  return out;
}
