// SPDX-License-Identifier: MIT
/**
 * Telling the stones' spelling from modern spelling (RUNES-SPEC.md §9), so that a
 * testbed never runs modern reverse conversion on an inscription, or the
 * inscription reader on modern text.
 */
import { rune, type RuneName } from './inventory.js';

// §9.1: signs no modern setting writes in plene spelling.
const OLD_ONLY_NAMES: readonly RuneName[] = [
  'YENISEI A', 'YENISEI AEB', 'YENISEI AG', 'YENISEI AEG', 'YENISEI AD', 'YENISEI AY', 'YENISEI AEK',
  'YENISEI AEN', 'ORKHON ENY', 'YENISEI ENY', 'YENISEI ANG', 'YENISEI AENG', 'ORKHON OP', 'YENISEI AQ',
  'YENISEI IQ', 'YENISEI OQ', 'YENISEI AR', 'ORKHON ASH', 'YENISEI ASH', 'YENISEI ESH', 'YENISEI AET',
];
const OLD_ONLY = new Set(OLD_ONLY_NAMES.map(rune));
const VOWEL_SIGNS = new Set((['ORKHON A', 'YENISEI A', 'YENISEI AE', 'ORKHON I', 'YENISEI I', 'YENISEI E',
  'ORKHON O', 'ORKHON OE', 'YENISEI OE', 'ORKHON BASH'] as const).map(rune));

export interface SpellingFeatures {
  /** Words of two or more runes. */
  words: number;
  /** Signs from §9.1 in the text. */
  oldOnly: number;
  /** Share of words with no vowel sign. */
  vowelless: number;
  /** Share of words with a run of three or more consonant signs. */
  clusters: number;
}

export function spellingFeatures(text: string): SpellingFeatures {
  const words = (text.match(/\p{Script=Old_Turkic}+/gu) ?? []).map((w) => [...w]).filter((w) => w.length >= 2);
  let oldOnly = 0;
  for (const ch of text) if (OLD_ONLY.has(ch)) oldOnly++;
  const longestCluster = (w: string[]) => {
    let best = 0, run = 0;
    for (const ch of w) { run = VOWEL_SIGNS.has(ch) ? 0 : run + 1; best = Math.max(best, run); }
    return best;
  };
  const n = words.length || 1;
  return {
    words: words.length,
    oldOnly,
    vowelless: words.filter((w) => !w.some((ch) => VOWEL_SIGNS.has(ch))).length / n,
    clusters: words.filter((w) => longestCluster(w) >= 3).length / n,
  };
}

/** §9.4: 'old' for the stones' spelling (and the inscription looks), 'modern' for plene spelling. */
export function detectSpelling(text: string): 'old' | 'modern' {
  const f = spellingFeatures(text);
  if (f.oldOnly > 0) return 'old';
  if (f.vowelless > 0.10 || f.clusters > 0.25) return 'old';
  return 'modern';
}
