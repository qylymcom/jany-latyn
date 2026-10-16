// SPDX-License-Identifier: MIT
/**
 * Forward conversion: Cyrillic → canonical Jany-Latyn → runes (JANY-ENESAI.md §23–§25,
 * RUNES-SPEC.md §4). The rune stage reads only the canonical Jany-Latyn full form,
 * so a reader's Latin display options never change the runes.
 */
import { cyrToJany } from '../convert.js';
import { lowerStr } from '../casing.js';
import { DEFAULT_RUNE_OPTIONS, type RuneOptions } from './options.js';
import { rune, TWO_DOT, DOT_ABOVE, OLD_HUNGARIAN_U, type RuneName } from './inventory.js';

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y', 'ö', 'ü', 'ä']);
const BACK_VOWELS = new Set(['a', 'o', 'u', 'y']);
const ROUNDED_BACK = new Set(['o', 'u']);
const ROUNDED_FRONT = new Set(['ö', 'ü']);
const LOW_VOWELS = new Set(['a', 'e', 'ä']);
// Canonical Jany-Latyn letters, plus compose-mode ä (whitepaper §20).
const JANY_LETTERS = new Set([...'abçdefghiíjklmnŋoöprsştuüvyzä']);

export type Series = 'back' | 'front';
type Forms = RuneOptions['forms'];

// Back and front rune of each consonant, by forms (RUNES-SPEC §4.5, §6.2). A letter
// with one form gives it twice. к and т, whose vowel-bound signs depend on more than
// the series, are handled in consonantRune.
type Pairs = Readonly<Record<string, readonly [RuneName, RuneName]>>;
const CHART: Pairs = {
  b: ['ORKHON AB', 'ORKHON AEB'], g: ['ORKHON AG', 'ORKHON AEG'], d: ['ORKHON AD', 'ORKHON AED'],
  l: ['ORKHON AL', 'ORKHON AEL'], n: ['ORKHON AN', 'ORKHON AEN'], r: ['ORKHON AR', 'ORKHON AER'],
  s: ['ORKHON AS', 'ORKHON AES'], í: ['ORKHON AY', 'ORKHON AEY'], j: ['YENISEI EC', 'YENISEI AEY'],
  ŋ: ['ORKHON ENG', 'ORKHON ENG'], m: ['ORKHON EM', 'ORKHON EM'], p: ['ORKHON EP', 'ORKHON EP'],
  ş: ['ORKHON ESH', 'ORKHON ESH'], z: ['YENISEI EZ', 'YENISEI EZ'], f: ['YENISEI AL', 'YENISEI AL'],
  h: ['YENISEI OEK', 'YENISEI OEK'], v: ['YENISEI AB', 'YENISEI AB'],
};
const PAIRS: Record<Forms, Pairs> = {
  chart: CHART,
  // The Orkhon monuments' forms differ from the chart's in back т (consonantRune) and in з.
  orkhon: { ...CHART, z: ['ORKHON EZ', 'ORKHON EZ'] },
  // The attested majority of the Yenisei Kyrgyz stones (RUNES-SPEC §6.2).
  yenisei: {
    ...CHART,
    b: ['ORKHON AB', 'YENISEI AEB'], g: ['YENISEI AG', 'ORKHON AEG'], n: ['ORKHON AN', 'YENISEI AEN'],
    r: ['YENISEI AR', 'ORKHON AER'], s: ['YENISEI ESH', 'ORKHON AES'], ŋ: ['YENISEI ANG', 'ORKHON ENG'],
    ş: ['YENISEI ASH', 'YENISEI ASH'],
  },
};

function seriesOf(vowel: string | null): Series {
  return vowel === null || BACK_VOWELS.has(vowel) ? 'back' : 'front';
}

/**
 * Index of the vowel that governs the consonant at k (JANY-ENESAI.md §24.1): the
 * next vowel when the consonant directly precedes it or begins the word, otherwise
 * the previous vowel. Kyrgyz puts exactly one consonant in a medial onset (V.CV,
 * VC.CV, VCC.CV). Returns -1 for a word without vowels.
 */
export function governingVowelIndex(letters: readonly string[], k: number): number {
  let p = -1, n = -1;
  for (let i = k - 1; i >= 0; i--) if (VOWELS.has(letters[i])) { p = i; break; }
  for (let i = k + 1; i < letters.length; i++) if (VOWELS.has(letters[i])) { n = i; break; }
  if (n !== -1 && (p === -1 || n === k + 1)) return n;
  return p;
}

function vowelRune(v: string, o: RuneOptions): string {
  if (o.vowels === 'historical') {
    switch (v) {
      case 'a': case 'ä': return rune('ORKHON A');
      // The Orkhon monuments have no e sign and write it with a; the Yenisei stones write 𐰅.
      case 'e': return rune(o.forms === 'orkhon' ? 'ORKHON A' : 'YENISEI E');
      case 'y': case 'i': return rune('ORKHON I');
      case 'o': case 'u': return rune('ORKHON O');
      case 'ö': case 'ü': return rune('ORKHON OE');
    }
  }
  switch (v) {
    case 'a': return rune('ORKHON A');
    case 'e': return rune('YENISEI E');
    case 'ä': return rune('YENISEI AE');
    case 'y': return rune('ORKHON I');
    case 'i': return rune('YENISEI I');
    case 'o': return rune('ORKHON O');
    case 'u':
      if (o.u === 'dotted-o') return rune('ORKHON O') + DOT_ABOVE;
      if (o.u === 'old-hungarian') return OLD_HUNGARIAN_U;
      return rune('ORKHON BASH');
    case 'ö': return rune('ORKHON OE');
    case 'ü': return rune('YENISEI OE');
  }
  throw new Error(`not a vowel: ${v}`);
}

/**
 * The rune for consonant c whose governing vowel is g (null when the word has no
 * vowel), with the series it was written in: the governor's series where the
 * harmony setting applies to the letter, back otherwise.
 */
function consonantRune(c: string, g: string | null, o: RuneOptions): [string, Series] {
  const s0 = seriesFor(c, g, o);
  return [consonantForm(c, g, o, s0), s0];
}

function seriesFor(c: string, g: string | null, o: RuneOptions): Series {
  if (o.loanConsonants === 'nativized' && c === 'h') c = 'k';
  const harmonized = o.harmony === 'full' || (o.harmony === 'kg' && (c === 'k' || c === 'g'));
  return harmonized ? seriesOf(g) : 'back';
}

function consonantForm(c: string, g: string | null, o: RuneOptions, s: Series): string {
  if (o.loanConsonants === 'nativized') {
    if (c === 'f') c = 'p';
    else if (c === 'h') c = 'k';
    else if (c === 'v') c = 'b';
  }
  if (c === 'j' && o.zhe === 'etymological') c = 'í';
  if (c === 'j' && o.zhe === 'front') return rune('YENISEI AEY');

  const full = o.harmony === 'full';
  const yenisei = o.forms === 'yenisei';

  if (c === 'k') {
    if (s === 'back') {
      if (full && g !== null && ROUNDED_BACK.has(g)) return rune(yenisei ? 'YENISEI OQ' : 'ORKHON OQ');
      // The stones write к by ы with plain 𐰴 (RUNES-SPEC §6.2).
      if (full && g === 'y' && !yenisei) return rune('ORKHON IQ');
      return rune('ORKHON AQ');
    }
    if (full && g !== null && ROUNDED_FRONT.has(g)) return rune(yenisei ? 'YENISEI OEK' : 'ORKHON OEK');
    return rune(yenisei ? 'YENISEI AEK' : 'ORKHON AEK');
  }
  if (c === 't') {
    if (s === 'front') return rune('ORKHON AET');
    // 𐱇 is not attested on the stones; the Yenisei forms write plain 𐱄.
    if (full && g !== null && ROUNDED_BACK.has(g) && !yenisei) return rune('ORKHON OT');
    return rune(o.forms === 'orkhon' ? 'ORKHON AT' : 'YENISEI AT');
  }
  if (c === 'ç') return rune(full && g === 'i' ? 'ORKHON IC' : 'ORKHON EC');

  const pair = PAIRS[o.forms][c];
  if (!pair) throw new Error(`no rune for consonant: ${c}`);
  if (s === 'back') {
    // The attested toggles replace the reference (back) rune only (RUNES-SPEC §4.4).
    if (c === 'r' && o.r === 'attested') return rune('YENISEI AR');
    if (c === 's' && o.s === 'attested') return rune('ORKHON AES');
  }
  if (c === 'ş') {
    if (o.sh === 'attested') return rune('YENISEI ASH');
    if (yenisei && o.yeniseiSh === 'merged') return rune('YENISEI ESH');
  }
  return rune(s === 'back' ? pair[0] : pair[1]);
}

export interface Cell {
  letter: string;
  rune: string;
  /** Index of the governing vowel (consonants only; -1 when the word has none). */
  governor?: number;
  /** The series the consonant was written in. */
  series?: Series;
  /** Dropped by the epigraphic register, or merged into the previous cell's ligature. */
  drop?: boolean;
  ligature?: boolean;
}

/**
 * The epigraphic register (JANY-ENESAI.md §25), one-way: vowel length unwritten;
 * а and э/е written only word-finally; other vowels written in the first syllable
 * and word-finally; ligatures over the original adjacency. Consonant series were
 * computed before any vowel is dropped, so they still carry the harmony.
 */
function applyEpigraphic(cells: Cell[], o: RuneOptions): void {
  const last = cells.length - 1;
  let nucleus = -1;
  for (let k = 0; k < cells.length; k++) {
    const ch = cells[k].letter;
    if (!VOWELS.has(ch)) continue;
    if (k > 0 && cells[k - 1].letter === ch) { cells[k].drop = true; continue; }  // length unwritten
    nucleus++;
    let end = k;
    while (end + 1 <= last && cells[end + 1].letter === ch) end++;
    if (end === last) continue;  // word-final vowels are written
    if (LOW_VOWELS.has(ch) || nucleus > 0) cells[k].drop = true;
  }
  // нт and нд are 𐰦 in every inscription look (RUNES-SPEC §12, R2). No stone ligates лт.
  const ELT = o.forms === 'yenisei' ? null : rune('ORKHON ELT');
  const ENT = rune('ORKHON ENT');
  const ENC = rune(o.forms === 'chart' ? 'YENISEI ENC' : 'ORKHON ENC');
  for (let k = 0; k + 1 < cells.length; k++) {
    const a = cells[k].letter, b = cells[k + 1].letter;
    let lig: string | null = null;
    if (a === 'l' && (b === 't' || b === 'd')) lig = ELT;
    else if (a === 'n' && (b === 't' || b === 'd')) lig = ENT;
    else if (a === 'n' && b === 'ç') lig = ENC;
    if (lig) { cells[k].rune = lig; cells[k].ligature = true; cells[k + 1].drop = true; k++; }
  }
}

/** One lowercase canonical Jany-Latyn word, letter by letter, with how each was written. */
export function wordCells(word: string, o: RuneOptions): Cell[] {
  const letters = [...word];
  const cells: Cell[] = letters.map((ch, k) => {
    if (VOWELS.has(ch)) return { letter: ch, rune: vowelRune(ch, o) };
    const gi = governingVowelIndex(letters, k);
    const [r, series] = consonantRune(ch, gi === -1 ? null : letters[gi], o);
    return { letter: ch, rune: r, governor: gi, series };
  });
  if (o.register === 'epigraphic') applyEpigraphic(cells, o);
  return cells;
}

function convertWord(word: string, o: RuneOptions): string {
  return wordCells(word, o).filter((c) => !c.drop).map((c) => c.rune).join('');
}

export const isJanyWord = (w: string) => [...w].every((ch) => JANY_LETTERS.has(ch));

// A rune word ends in a rune, the dot of the dotted-o toggle, or the Old Hungarian u.
const SEPARABLE = /([\p{Script=Old_Turkic}̇\u{10CEA}]) +(?=[\p{Script=Old_Turkic}\u{10CEA}])/gu;

function finish(text: string, o: RuneOptions): string {
  return o.separator === 'two-dot' ? text.replace(SEPARABLE, `$1${TWO_DOT}`) : text;
}

/**
 * Canonical Jany-Latyn text to runes. A word is a run of letters made only of
 * Jany-Latyn letters; any other run (Windows, Ἀθῆναι, runes) and everything that
 * is not a letter passes through unchanged.
 */
export function janyLatynToRunes(text: string, options?: Partial<RuneOptions>): string {
  const o: RuneOptions = { ...DEFAULT_RUNE_OPTIONS, ...options };
  const out = text.normalize('NFC').replace(/\p{L}+/gu, (w) => {
    const lw = lowerStr(w);
    return isJanyWord(lw) ? convertWord(lw, o) : w;
  });
  return finish(out, o);
}

/**
 * Kyrgyz Cyrillic to runes, through the canonical Jany-Latyn full form (every
 * engine option at its default). Only Cyrillic words are converted; Latin and
 * every other script pass through unchanged.
 */
export function cyrillicToRunes(text: string, options?: Partial<RuneOptions>): string {
  const o: RuneOptions = { ...DEFAULT_RUNE_OPTIONS, ...options };
  const out = text.normalize('NFC').replace(/\p{Script=Cyrillic}+/gu, (w) => {
    const jl = lowerStr(cyrToJany(w));
    return isJanyWord(jl) ? convertWord(jl, o) : w;
  });
  return finish(out, o);
}
