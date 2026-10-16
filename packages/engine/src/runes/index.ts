// SPDX-License-Identifier: MIT
/**
 * Jany-Enesai and the Orhon-Enesai settings: Kyrgyz in the Old Turkic script
 * (docs/jany-enesai/JANY-ENESAI.md, RUNES-SPEC.md). Import as `jany-latyn/runes`.
 */
export { cyrillicToRunes, janyLatynToRunes, governingVowelIndex, type Series } from './forward.js';
export { runesToJanyLatyn, runesToCyrillic, isReversible, runeLetters } from './reverse.js';
export { readInscription, signValue, type ReaderTarget } from './reader.js';
export { detectSpelling, spellingFeatures, type SpellingFeatures } from './detect.js';
export { compareRunes, runeFoldKey } from './collate.js';
export { explainRunes, type WordExplanation, type LetterExplanation } from './explain.js';
export {
  DEFAULT_RUNE_OPTIONS, RUNE_OPTION_VALUES, RUNE_PRESETS, presetOptions,
  type RuneOptions, type RunePreset, type RuneStatus,
} from './options.js';
export { RUNE_NAMES, rune, runeName, TWO_DOT, type RuneName } from './inventory.js';
