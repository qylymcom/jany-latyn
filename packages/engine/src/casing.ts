// SPDX-License-Identifier: MIT
/**
 * Casing for both conversion directions (SPEC §2.1).
 *
 * A word is converted in lowercase, then its casing is restored from the
 * *source* word's pattern. Several graphemes span more than one character
 * (я → ía, ц → ts, ч → ch in digraph mode, and in reverse ía → я), so casing
 * each output character from its own source character cannot tell sentence
 * case (Ía) from all caps (ÍA).
 *
 * Case changes go through the explicit tables below. Locale case functions are
 * never used: toUpperCase/toLowerCase and their locale variants treat the
 * Turkic i/ı pair specially, and which pairing applies here is decided by the
 * configuration, never by the environment's locale.
 *
 * The tables are configuration-dependent (SPEC §2.1), like foldKey and compare:
 * - 'default' (every configuration except dotless ı): i ↔ I. ı does not occur;
 *   if it appears in input it uppercases to I. İ in input lowercases to i.
 * - 'turkic' (yGrapheme: 'dotless-i'): the Turkish pairs ı ↔ I and i ↔ İ, so
 *   all-caps text keeps the distinction (КЫРГЫЗ → KIRGIZ, ИЛИМ → İLİM).
 */

const PAIRS: Array<readonly [lower: string, upper: string]> = [];
// ASCII a–z and Cyrillic а–я (U+0430–U+044F ↔ U+0410–U+042F).
for (let c = 0x61; c <= 0x7a; c++) PAIRS.push([String.fromCharCode(c), String.fromCharCode(c - 0x20)]);
for (let c = 0x430; c <= 0x44f; c++) PAIRS.push([String.fromCharCode(c), String.fromCharCode(c - 0x20)]);
PAIRS.push(
  // Jany-Latyn letters, testbed alternatives, and display variants.
  ['í', 'Í'], ['ö', 'Ö'], ['ü', 'Ü'], ['ç', 'Ç'], ['ş', 'Ş'], ['ŋ', 'Ŋ'],
  ['ñ', 'Ñ'], ['ä', 'Ä'], ['ĭ', 'Ĭ'], ['ĩ', 'Ĩ'], ['ū', 'Ū'], ['ʉ', 'Ʉ'],
  ['ğ', 'Ğ'],
  // Kyrgyz Cyrillic letters outside а–я, and the ұ display variant.
  ['ё', 'Ё'], ['ө', 'Ө'], ['ү', 'Ү'], ['ң', 'Ң'], ['ұ', 'Ұ'],
);

export type CaseMode = 'default' | 'turkic';

/** The case mode a configuration implies: Turkish pairs only with dotless ı. */
export function caseModeFor(options?: { yGrapheme?: 'y' | 'dotless-i' }): CaseMode {
  return options?.yGrapheme === 'dotless-i' ? 'turkic' : 'default';
}

interface CaseTable { upper: Map<string, string>; lower: Map<string, string>; }

function buildTable(mode: CaseMode): CaseTable {
  const upper = new Map<string, string>(PAIRS);
  const lower = new Map<string, string>(PAIRS.map(([l, u]) => [u, l]));
  upper.set('ı', 'I');
  lower.set('İ', 'i');
  if (mode === 'turkic') {
    upper.set('i', 'İ');
    lower.set('I', 'ı');
  }
  return { upper, lower };
}

const TABLES: Readonly<Record<CaseMode, CaseTable>> = {
  default: buildTable('default'),
  turkic: buildTable('turkic'),
};

/** Characters outside the tables are returned unchanged. */
export function upperChar(c: string, mode: CaseMode = 'default'): string {
  return TABLES[mode].upper.get(c) ?? c;
}

export function lowerChar(c: string, mode: CaseMode = 'default'): string {
  return TABLES[mode].lower.get(c) ?? c;
}

export function isUpperChar(c: string, mode: CaseMode = 'default'): boolean {
  return TABLES[mode].lower.has(c);
}

export function isLowerChar(c: string, mode: CaseMode = 'default'): boolean {
  return TABLES[mode].upper.has(c);
}

export function upperStr(s: string, mode: CaseMode = 'default'): string {
  let out = '';
  for (const c of s) out += upperChar(c, mode);
  return out;
}

export function lowerStr(s: string, mode: CaseMode = 'default'): string {
  let out = '';
  for (const c of s) out += lowerChar(c, mode);
  return out;
}

/** Uppercases the first character that has a capital; the rest is unchanged. */
function upperFirst(s: string, mode: CaseMode): string {
  for (let i = 0; i < s.length; i++) {
    if (isLowerChar(s[i], mode)) return s.slice(0, i) + upperChar(s[i], mode) + s.slice(i + 1);
  }
  return s;
}

type CasePattern = 'none' | 'lower' | 'title' | 'upper' | 'mixed' | 'single';

function casePattern(word: string, mode: CaseMode): CasePattern {
  const upper: boolean[] = [];
  for (const c of word) {
    if (isUpperChar(c, mode)) upper.push(true);
    else if (isLowerChar(c, mode)) upper.push(false);
  }
  if (upper.length === 0) return 'none';
  if (!upper.includes(true)) return 'lower';
  // One cased letter, uppercase: title case and all caps at once (SPEC §2.1).
  if (upper.length === 1) return 'single';
  if (!upper.includes(false)) return 'upper';
  if (upper[0] && !upper.slice(1).includes(true)) return 'title';
  return 'mixed';
}

/**
 * True when the line has at least two cased words and no lowercase letter.
 * This settles a one-letter word (Я → Ía or ÍA) from its context.
 */
export function isUpperLine(line: string, mode: CaseMode = 'default'): boolean {
  let casedWords = 0;
  for (const [word] of line.matchAll(/\p{L}+/gu)) {
    let cased = false;
    for (const c of word) {
      if (isLowerChar(c, mode)) return false;
      if (isUpperChar(c, mode)) cased = true;
    }
    if (cased) casedWords++;
  }
  return casedWords >= 2;
}

/**
 * One piece of a converted word: the index of the source character it came
 * from, and its lowercase output text (possibly several characters, or a
 * whole restored loanword).
 */
export type Segment = readonly [sourceIndex: number, text: string];

/** Recase lowercase segments from the source word's pattern (SPEC §2.1). */
export function applyCase(
  source: string,
  segments: readonly Segment[],
  upperLine: boolean,
  mode: CaseMode = 'default',
): string {
  let pattern = casePattern(source, mode);
  if (pattern === 'single') pattern = upperLine ? 'upper' : 'title';
  const text = segments.map(([, t]) => t).join('');
  switch (pattern) {
    case 'none':
    case 'lower':
      return text;
    case 'upper':
      return upperStr(text, mode);
    case 'title':
      return upperFirst(text, mode);
    case 'mixed':
      // 1:1 letters keep their own case; a multi-character piece takes the case
      // of its source letter on its first character only (МакЯн → MakÍan).
      return segments.map(([at, t]) => (isUpperChar(source[at], mode) ? upperFirst(t, mode) : t)).join('');
  }
}

/** Apply fn to each line, telling it whether that line is all caps. */
export function mapLines(
  text: string,
  fn: (line: string, upperLine: boolean) => string,
  mode: CaseMode = 'default',
): string {
  return text.replace(/[^\n]+/g, (line) => fn(line, isUpperLine(line, mode)));
}
