// SPDX-License-Identifier: MIT
/**
 * Options and presets of the rune stage (JANY-ENESAI.md §14–§18, RUNES-SPEC.md §3–§4).
 * As in the Latin testbed, presets only seed options: every combination of the
 * options is valid, and the rune stage never couples them.
 */

export interface RuneOptions {
  /** none: one rune per letter (Jany-Enesai). kg: к and г take front forms by
   * their governing vowel. full: every paired consonant and ж, plus the
   * vowel-bound signs (the chart's whole system). */
  harmony: 'none' | 'kg' | 'full';
  /** plene: every vowel written. epigraphic: the one-way abbreviated spelling of §25. */
  register: 'plene' | 'epigraphic';
  /** distinct: a rune for each Kyrgyz vowel. historical: one per pair, as the stones write. */
  vowels: 'distinct' | 'historical';
  /** у: 𐱈 ORKHON BASH, 𐰆 with a combining dot above, or Old Hungarian small u. */
  u: 'bash' | 'dotted-o' | 'old-hungarian';
  /** ж: the chart's 𐰳, the chart's front ж 𐰙 in every syllable, or the й runes. */
  zhe: 'chart' | 'front' | 'etymological';
  /** ф х в: the chart's 𐰟 𐰝 𐰊, or nativized as п, к, б. */
  loanConsonants: 'chart' | 'nativized';
  /** Which Unicode form writes each letter (RUNES-SPEC §4.5). */
  forms: 'chart' | 'orkhon' | 'yenisei';
  /** р, с, ш: the chart's form, or the form the Yenisei Kyrgyz stones use (RUNES-SPEC §4.4). */
  r: 'chart' | 'attested';
  s: 'chart' | 'attested';
  sh: 'chart' | 'attested';
  /** Yenisei forms: ш with 𐱀, apart from back с 𐱂, or merged with it as most stones write (RUNES-SPEC §6.3). */
  yeniseiSh: 'apart' | 'merged';
  /** Between words: ordinary spaces, or U+205A ⁚ in place of each run of spaces between two rune words. */
  separator: 'space' | 'two-dot';
}

/** Every value each option takes, the default first: for option panels and argument parsing. */
export const RUNE_OPTION_VALUES: { readonly [K in keyof RuneOptions]: readonly RuneOptions[K][] } = Object.freeze({
  harmony: ['none', 'kg', 'full'], register: ['plene', 'epigraphic'], vowels: ['distinct', 'historical'],
  u: ['bash', 'dotted-o', 'old-hungarian'], zhe: ['chart', 'front', 'etymological'],
  loanConsonants: ['chart', 'nativized'], forms: ['chart', 'orkhon', 'yenisei'],
  r: ['chart', 'attested'], s: ['chart', 'attested'], sh: ['chart', 'attested'],
  yeniseiSh: ['apart', 'merged'], separator: ['space', 'two-dot'],
});

export const DEFAULT_RUNE_OPTIONS: Readonly<RuneOptions> = Object.freeze({
  harmony: 'none', register: 'plene', vowels: 'distinct', u: 'bash', zhe: 'chart',
  loanConsonants: 'chart', forms: 'chart', r: 'chart', s: 'chart', sh: 'chart',
  yeniseiSh: 'apart', separator: 'space',
});

/** RUNES-SPEC §3: what each scheme claims to be. */
export type RuneStatus = 'proposed' | 'reference' | 'comparison' | 'experimental';

export interface RunePreset {
  id: string;
  name: string;
  status: RuneStatus;
  /** Whether conversion back to Jany-Latyn is exact under this preset. */
  reversible: boolean;
  options: Readonly<RuneOptions>;
}

const preset = (id: string, name: string, status: RuneStatus, reversible: boolean, o: Partial<RuneOptions>): RunePreset =>
  ({ id, name, status, reversible, options: Object.freeze({ ...DEFAULT_RUNE_OPTIONS, ...o }) });

// The two inscription looks share everything but their forms (JANY-ENESAI.md §17).
const INSCRIPTION: Partial<RuneOptions> = {
  harmony: 'full', register: 'epigraphic', vowels: 'historical', zhe: 'etymological',
  loanConsonants: 'nativized', separator: 'two-dot',
};

export const RUNE_PRESETS: readonly RunePreset[] = Object.freeze([
  preset('jany-enesai', 'Jany-Enesai', 'proposed', true, {}),
  preset('kg', 'k+g harmony', 'comparison', true, { harmony: 'kg' }),
  preset('full', 'Full harmony (the chart)', 'reference', true, { harmony: 'full' }),
  preset('attested', 'Attested letters', 'comparison', true, { r: 'attested', s: 'attested', sh: 'attested' }),
  preset('eski-enesai', 'Eski-Enesai', 'reference', false, { ...INSCRIPTION, forms: 'yenisei' }),
  preset('orkhon', 'Inscription look (Orkhon forms)', 'reference', false, { ...INSCRIPTION, forms: 'orkhon' }),
]);

/** The options a preset seeds. Throws on an unknown id. */
export function presetOptions(id: string): RuneOptions {
  const p = RUNE_PRESETS.find((x) => x.id === id);
  if (!p) throw new Error(`unknown rune preset: ${id}`);
  return { ...p.options };
}
