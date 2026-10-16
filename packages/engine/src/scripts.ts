// SPDX-License-Identifier: MIT
/**
 * Any-to-any conversion between Kyrgyz Cyrillic, Latin, ASCII, and runes, for the
 * qylym playground (docs/superpowers/specs/2026-10-16-qylym-playground-design.md §4).
 * The hub is Cyrillic. Where both ends are based on canonical Jany-Latyn (runes,
 * canonical Latin), the route goes through canonical Jany-Latyn instead, which
 * loses nothing: obíekt → 𐰆𐰉𐰖𐰅𐰴𐱄, where Cyrillic would give обект → 𐰆𐰉𐰅𐰴𐱄.
 */
import { cyrToJany, janyToCyr, janyToFallback, type JanyOptions } from './convert.js';
import { lowerStr } from './casing.js';
import {
  cyrillicToRunes, janyLatynToRunes, runesToJanyLatyn, runesToCyrillic, readInscription,
  detectSpelling, explainRunes,
  type RuneOptions, type ReaderTarget, type RuneStatus, type WordExplanation,
} from './runes/index.js';

export type SourceScript = 'cyrillic' | 'latin' | 'runes';
export type TargetScript = SourceScript | 'ascii' | 'reading';
/** What a preset claims to be (RUNES-SPEC §3); the Latin presets use the same scale. */
export type SchemeStatus = RuneStatus;

export interface LatinSource {
  yGrapheme: 'y' | 'dotless-i';
  glideGrapheme: 'acute-i' | 'y';
}

export interface DetectedScript {
  script: SourceScript | 'mixed' | 'empty';
  /** For Latin: dotless ı means the CTA-aligned setting, where ы is ı and the glide is y. */
  latin?: LatinSource;
  /** For runes: whether the spelling is modern (plene) or the stones' (RUNES-SPEC §9). */
  spelling?: 'modern' | 'old';
}

const count = (text: string, re: RegExp) => text.match(re)?.length ?? 0;

/** The script holding at least 80% of the letters; 'mixed' when none does, 'empty' with no letters. */
export function detectScript(text: string): DetectedScript {
  const counts: [SourceScript, number][] = [
    ['cyrillic', count(text, /\p{Script=Cyrillic}/gu)],
    ['latin', count(text, /\p{Script=Latin}/gu)],
    ['runes', count(text, /\p{Script=Old_Turkic}/gu)],
  ];
  const total = counts.reduce((n, [, c]) => n + c, 0);
  if (total === 0) return { script: 'empty' };
  const [script, n] = counts.reduce((a, b) => (b[1] > a[1] ? b : a));
  if (n / total < 0.8) return { script: 'mixed' };
  if (script === 'latin') {
    return {
      script,
      latin: /[ıİ]/u.test(text)
        ? { yGrapheme: 'dotless-i', glideGrapheme: 'y' }
        : { yGrapheme: 'y', glideGrapheme: 'acute-i' },
    };
  }
  if (script === 'runes') return { script, spelling: detectSpelling(text) };
  return { script };
}

export type LatinOptions = Required<JanyOptions>;

export const DEFAULT_LATIN_OPTIONS: Readonly<LatinOptions> = Object.freeze({
  vowels: 'latin-umlaut', yGrapheme: 'y', glideGrapheme: 'acute-i', sibilants: 'cedilla',
  signs: 'absorbed', uvularK: 'k', uvularG: 'g', velarNasal: 'eng', affricate: 'j', velarFricative: 'h',
});

/** Every value each Latin option takes, the default first. */
export const LATIN_OPTION_VALUES: { readonly [K in keyof LatinOptions]: readonly LatinOptions[K][] } = Object.freeze({
  vowels: ['latin-umlaut', 'hybrid', 'cyrillic-u', 'draft-macron'], yGrapheme: ['y', 'dotless-i'],
  glideGrapheme: ['acute-i', 'breve-i', 'tilde-i', 'i', 'y'], sibilants: ['cedilla', 'digraph'],
  signs: ['absorbed', 'apostrophe'], uvularK: ['k', 'q'], uvularG: ['g', 'ğ'], velarNasal: ['eng', 'tilde-n'],
  affricate: ['j', 'c'], velarFricative: ['h', 'x'],
});

export interface LatinPreset {
  id: string;
  name: string;
  status: SchemeStatus;
  options: Readonly<LatinOptions>;
}

const latinPreset = (id: string, name: string, status: SchemeStatus, o: JanyOptions): LatinPreset =>
  ({ id, name, status, options: Object.freeze({ ...DEFAULT_LATIN_OPTIONS, ...o }) });

export const LATIN_PRESETS: readonly LatinPreset[] = Object.freeze([
  latinPreset('standard', 'Jany-Latyn', 'proposed', {}),
  // The CTA writes the velar nasal ñ; without it this preset is not the CTA-aligned setting of whitepaper §6.
  latinPreset('cta', 'CTA-aligned', 'comparison', {
    yGrapheme: 'dotless-i', glideGrapheme: 'y', uvularK: 'q', uvularG: 'ğ', affricate: 'c', velarNasal: 'tilde-n',
  }),
  latinPreset('digraph', 'Legacy digraphs', 'comparison', { sibilants: 'digraph', signs: 'apostrophe' }),
  latinPreset('hybrid', 'Hybrid ө', 'comparison', { vowels: 'hybrid' }),
]);

export interface ConvertRequest {
  text: string;
  from: SourceScript;
  to: TargetScript;
  /** Target Latin options. */
  latin?: JanyOptions;
  /** How to read Latin input: detectScript's `latin`. */
  latinSource?: Partial<LatinSource>;
  /** Target rune options. */
  runes?: Partial<RuneOptions>;
  ascii?: 'strip' | 'digraph';
  reading?: ReaderTarget;
  /** Apply the loan-restoration list wherever the route passes back through Cyrillic. */
  restoreLoans?: boolean;
}

export type ConvertResult =
  | { ok: true; text: string }
  | { ok: false; reason: 'old-spelling' | 'not-readable' };

const JANY_LETTERS = new Set([...'abçdefghiíjklmnŋoöprsştuüvyzä']);

/**
 * Whether Latin text can be read as canonical Jany-Latyn as it stands: every letter
 * a Jany-Latyn letter, no "sh" (digraph ш), no apostrophe (apostrophe-mode signs).
 */
function isCanonicalLatin(text: string): boolean {
  const lower = lowerStr(text.normalize('NFC'));
  if (/sh|['’]/u.test(lower)) return false;
  for (const ch of lower) if (/\p{L}/u.test(ch) && !JANY_LETTERS.has(ch)) return false;
  return true;
}

function isStandardLatin(o: JanyOptions | undefined): boolean {
  return (Object.keys(DEFAULT_LATIN_OPTIONS) as (keyof LatinOptions)[])
    .every((k) => (o?.[k] ?? DEFAULT_LATIN_OPTIONS[k]) === DEFAULT_LATIN_OPTIONS[k]);
}

const ok = (text: string): ConvertResult => ({ ok: true, text });

function toCyrillic(r: Omit<ConvertRequest, 'to'>): string {
  if (r.from === 'cyrillic') return r.text;
  if (r.from === 'runes') return runesToCyrillic(r.text, { restoreLoans: r.restoreLoans });
  return janyToCyr(r.text, {
    restoreLoans: r.restoreLoans,
    yGrapheme: r.latinSource?.yGrapheme,
    glideGrapheme: r.latinSource?.glideGrapheme,
  });
}

/**
 * Canonical Jany-Latyn for the input, when it can be had without loss; null otherwise.
 * Latin read in another setting (CTA: ы is ı, the glide is y) is not canonical even
 * when its letters are: CTA's toy is той, where canonical toy would be тоы.
 */
function canonical(r: Omit<ConvertRequest, 'to'>): string | null {
  if (r.from === 'runes') return runesToJanyLatyn(r.text);
  const canonicalSource = (r.latinSource?.yGrapheme ?? 'y') === 'y' && (r.latinSource?.glideGrapheme ?? 'acute-i') === 'acute-i';
  if (r.from === 'latin' && canonicalSource && isCanonicalLatin(r.text)) return r.text;
  return null;
}

/**
 * Converts text between any two scripts. Never throws on what a user types: when
 * a conversion is impossible it says why. Old-spelling runes can only be read
 * (RUNES-SPEC §5); reading is only for runes.
 */
export function convertText(r: ConvertRequest): ConvertResult {
  const { text, from, to } = r;
  if (to === 'reading') {
    return from === 'runes' ? ok(readInscription(text, r.reading ?? 'scholarly')) : { ok: false, reason: 'not-readable' };
  }
  if (from === 'runes' && detectSpelling(text) === 'old') return { ok: false, reason: 'old-spelling' };
  if (from === 'cyrillic' && to === 'cyrillic') return ok(text);

  const jl = canonical(r);
  if (jl !== null) {
    if (to === 'runes') return ok(janyLatynToRunes(jl, r.runes));
    if (to === 'latin' && isStandardLatin(r.latin)) return ok(jl);
    if (to === 'ascii') return ok(janyToFallback(jl, r.ascii ?? 'strip'));
  }

  const cyr = toCyrillic(r);
  switch (to) {
    case 'cyrillic': return ok(cyr);
    case 'latin': return ok(cyrToJany(cyr, r.latin));
    case 'ascii': return ok(janyToFallback(cyrToJany(cyr), r.ascii ?? 'strip'));
    case 'runes': return ok(cyrillicToRunes(cyr, r.runes));
  }
  throw new Error(`unknown target script: ${String(to)}`);
}

/**
 * Explanations of the runes convertText writes for this request, one per rune
 * word of the output, by the same route (for the playground's inspector).
 */
export function explainConversion(r: Omit<ConvertRequest, 'to'>): WordExplanation[] {
  if (r.from === 'runes' && detectSpelling(r.text) === 'old') return [];
  const jl = canonical(r);
  if (jl !== null) return explainRunes(jl, r.runes, 'jany-latyn');
  return explainRunes(toCyrillic(r), r.runes);
}
