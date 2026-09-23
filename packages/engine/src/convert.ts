// SPDX-License-Identifier: MIT
import { LETTER_MAP, FALLBACK, EXTENDED_LETTERS } from './alphabet.js';
import { LOAN_EXACT, LOAN_PREFIXES } from './loanRestore.js';
import { applyCase, caseModeFor, lowerStr, mapLines, type Segment } from './casing.js';

export interface JanyOptions {
  vowels?: 'latin-umlaut' | 'hybrid' | 'cyrillic-u' | 'draft-macron';
  yGrapheme?: 'y' | 'dotless-i';
  glideGrapheme?: 'acute-i' | 'breve-i' | 'tilde-i' | 'i' | 'y';
  sibilants?: 'cedilla' | 'digraph';
  signs?: 'absorbed' | 'apostrophe';
  uvularK?: 'k' | 'q';
  // г: 'ğ' writes back-harmonic г as ğ by the same rule as q (CTA). Like q, it
  // is wrong for loanwords (газ → ğaz), which Cyrillic does not mark.
  uvularG?: 'g' | 'ğ';
  velarNasal?: 'eng' | 'tilde-n';
  // ж: 'j' writes every ж as j (canonical, derivable). 'c' is the mechanical CTA
  // mapping: every ж becomes c, which is right for native [dʒ] and wrong for
  // loanword [ʒ] (журнал → curnal, not jurnal); Cyrillic does not mark the difference.
  affricate?: 'j' | 'c';
  // х: 'h' writes every х as h (canonical). 'x' writes every х as x, for readers
  // who take the velar [x] to be the better value; it is the same one-letter
  // mapping, not the §11.2 split, which Cyrillic cannot supply.
  velarFricative?: 'h' | 'x';
}

export interface JanyCyrOptions {
  restoreLoans?: boolean;
  // The configuration the Latin text was written in. 'dotless-i' selects the
  // Turkish case pairs (I ↔ ı, İ ↔ i), so KIRGIZ reads as КЫРГЫЗ (SPEC §2.1).
  yGrapheme?: JanyOptions['yGrapheme'];
}

const CYR_WORD = /[\p{Script=Cyrillic}]+/gu;
const BACK_VOWELS = new Set(['а', 'о', 'у', 'ы', 'я', 'ё', 'ю']);
const FRONT_VOWELS = new Set(['э', 'е', 'и', 'ө', 'ү']);
const ALL_CYR_VOWELS = new Set(['а', 'о', 'у', 'ы', 'я', 'ё', 'ю', 'э', 'е', 'и', 'ө', 'ү']);

// Whether к (→ q) or г (→ ğ) at index is uvular: the §6 back-harmony rule.
// lowerWord must already be lowercase (casing.ts); no case function is called here.
function isUvular(lowerWord: string, index: number): boolean {

  // 1. If preceded by a front vowel without intervening back vowels (e.g. 'лик' in Республика, 'тик' in косметика, 'рек' in карек),
  // the syllable coda is palatal/soft velar 'k'
  for (let i = index - 1; i >= 0; i--) {
    const c = lowerWord[i];
    if (FRONT_VOWELS.has(c)) return false;
    if (BACK_VOWELS.has(c)) break;
  }

  // 2. If followed by a front vowel without intervening back vowels (e.g. 'ке' in кел, 'ки' in кир, 'байке'),
  // the syllable onset is palatal/soft velar 'k'
  for (let i = index + 1; i < lowerWord.length; i++) {
    const c = lowerWord[i];
    if (FRONT_VOWELS.has(c)) return false;
    if (BACK_VOWELS.has(c)) break;
  }

  // 3. For native harmonic words and syllables, look backward then forward for vocalic harmonic class
  for (let i = index - 1; i >= 0; i--) {
    const c = lowerWord[i];
    if (BACK_VOWELS.has(c)) return true;
    if (FRONT_VOWELS.has(c)) return false;
  }
  for (let i = index + 1; i < lowerWord.length; i++) {
    const c = lowerWord[i];
    if (BACK_VOWELS.has(c)) return true;
    if (FRONT_VOWELS.has(c)) return false;
  }

  return false;
}

// Letter written for й (and the glide half of я/ю/ё/iotated е) per option.
// ĭ and ĩ are §11.1 marked alternatives to the canonical í; plain i and y are
// comparison modes (§4.4, §7).
const GLIDE_LETTER: Readonly<Record<NonNullable<JanyOptions['glideGrapheme']>, string>> = {
  'acute-i': 'í',
  'breve-i': 'ĭ',
  'tilde-i': 'ĩ',
  i: 'i',
  y: 'y',
};

function getWordConverter(options?: JanyOptions): {
  map: Map<string, string>;
  glide: string;
  sibilants: 'cedilla' | 'digraph';
  signs: 'absorbed' | 'apostrophe';
  uvularK: 'k' | 'q';
  uvularG: 'g' | 'ğ';
} {
  const map = new Map(LETTER_MAP);
  const vowels = options?.vowels ?? 'latin-umlaut';
  const yGrapheme = options?.yGrapheme ?? 'y';
  const glideGrapheme = options?.glideGrapheme ?? 'acute-i';
  const sibilants = options?.sibilants ?? 'cedilla';
  const signs = options?.signs ?? 'absorbed';
  const uvularK = options?.uvularK ?? 'k';
  const uvularG = options?.uvularG ?? 'g';
  const velarNasal = options?.velarNasal ?? 'eng';
  const affricate = options?.affricate ?? 'j';
  const velarFricative = options?.velarFricative ?? 'h';

  if (vowels === 'latin-umlaut') {
    map.set('ө', 'ö');
    map.set('ү', 'ü');
  } else if (vowels === 'cyrillic-u') {
    map.set('ө', 'ө');
    map.set('ү', 'ұ');
  } else if (vowels === 'draft-macron') {
    map.set('ө', 'ө');
    map.set('ү', 'ū');
  } else {
    // hybrid mode: Cyrillic ө + Latin ü
    map.set('ө', 'ө');
    map.set('ү', 'ü');
  }

  if (yGrapheme === 'dotless-i') {
    map.set('ы', 'ı');
  }

  const glide = GLIDE_LETTER[glideGrapheme];
  map.set('й', glide);
  map.set('я', glide + 'a');
  map.set('ю', glide + 'u');
  map.set('ё', glide + 'o');

  if (sibilants === 'digraph') {
    map.set('ч', 'ch');
    map.set('ш', 'sh');
    map.set('щ', 'sch');
  } else {
    map.set('ч', 'ç');
    map.set('ш', 'ş');
    map.set('щ', 'ş');
  }

  if (signs === 'apostrophe') {
    map.set('ъ', "'");
    map.set('ь', "'");
  } else {
    map.set('ъ', '');
    map.set('ь', '');
  }

  if (velarNasal === 'tilde-n') {
    map.set('ң', 'ñ');
  }

  if (affricate === 'c') {
    map.set('ж', 'c');
  }

  if (velarFricative === 'x') {
    map.set('х', 'x');
  }

  return { map, glide, sibilants, signs, uvularK, uvularG };
}

export function cyrToJany(text: string, options?: JanyOptions): string {
  const { map, glide, signs, uvularK, uvularG } = getWordConverter(options);
  const mode = caseModeFor(options);

  return mapLines(text.normalize('NFC'), (line, upperLine) => line.replace(CYR_WORD, (word) => {
    // Convert in lowercase, then restore casing from the source word (SPEC §2.1).
    const lower = lowerStr(word);
    const segments: Segment[] = [];
    let iotateNextE = false;
    for (let i = 0; i < lower.length; i++) {
      const ch = lower[i];
      if (signs === 'absorbed' && (ch === 'ъ' || ch === 'ь')) {
        if (lower[i + 1] === 'е') {
          iotateNextE = true;
        }
        continue;
      }
      const isPostVocalic = i > 0 && ALL_CYR_VOWELS.has(lower[i - 1]);
      let mapped: string;
      if (ch === 'к' && uvularK === 'q') {
        mapped = isUvular(lower, i) ? 'q' : 'k';
      } else if (ch === 'г' && uvularG === 'ğ') {
        mapped = isUvular(lower, i) ? 'ğ' : 'g';
      } else if (ch === 'е' && (i === 0 || iotateNextE || isPostVocalic)) {
        mapped = glide + 'e';
        iotateNextE = false;
      } else if (ch === 'й') {
        mapped = glide;
      } else {
        mapped = map.get(ch) ?? ch;
      }
      if (mapped !== '') segments.push([i, mapped]);
    }
    return applyCase(word, segments, upperLine, mode);
  }), mode);
}

// Digraph-mode sibilant replacements for janyToFallback('digraph').
const FALLBACK_DIGRAPH_SIBILANTS: ReadonlyArray<readonly [string, string]> = [
  ['Ç', 'Ch'], ['ç', 'ch'],
  ['Ş', 'Sh'], ['ş', 'sh'],
];

// Convert formal-register Jany-Latyn to plain ASCII (casual register, §10).
// style='strip' (canonical): every diacritic drops to its base letter.
// style='digraph': sibilants expand to ch/sh; all other diacritics still strip.
export function janyToFallback(text: string, style: 'strip' | 'digraph' = 'strip'): string {
  let out = text;
  if (style === 'digraph') {
    for (const [from, to] of FALLBACK_DIGRAPH_SIBILANTS) {
      out = out.split(from).join(to);
    }
  }
  for (const [from, to] of FALLBACK) {
    out = out.split(from).join(to);
  }
  return out;
}

export interface FoldKeyOptions {
  // Which §11.2 compose-mode splits are active in this deployment. When 'x' is
  // listed, x folds to h; when 'w' is listed, w folds to v. Off by default,
  // because outside a Kyrgyz-only index x and w carry their international value
  // (Linux, LAX, X Factor) and must fold to themselves. (ä always folds to a —
  // it decomposes under NFD and has no competing value.)
  extendedLetters?: ReadonlyArray<'x' | 'w'>;
  // Set when the input is digraph-fallback ASCII (§10): also fold ch→c, sh→s so
  // the digraph casual form lands on the same key as the formal word. Off by
  // default — ch and sh are legitimate formal sequences (başçy) and folding
  // them unconditionally would merge genuinely distinct words.
  digraphInput?: boolean;
}

// foldKey maps any register (formal or casual) to a single search key.
// It assumes Kyrgyz text: ö→o, ü→u, í/ĭ/ĩ→i, ç→c, ş→s, ä→a all fold via NFD (their
// diacritics decompose and strip), while ŋ→n, ñ→n, and ı→i have no
// decomposition and are folded explicitly. Two folds are configuration
// -dependent (§9.4) and controlled by options: the §11.2 compose-mode letters
// x→h / w→v, and the digraph-fallback pair ch→c / sh→s. A mixed-language index
// must set these deliberately — the defaults keep x, w, ch, sh as themselves.
export function foldKey(text: string, options?: FoldKeyOptions): string {
  const extended = options?.extendedLetters ?? [];
  let out = text
    .normalize('NFC')
    .replace(/ŋ/g, 'n').replace(/Ŋ/g, 'n')
    .replace(/ñ/g, 'n').replace(/Ñ/g, 'n')
    .replace(/ı/g, 'i').replace(/İ/g, 'i');
  if (extended.includes('x')) out = out.replace(/x/g, 'h').replace(/X/g, 'h');
  if (extended.includes('w')) out = out.replace(/w/g, 'v').replace(/W/g, 'v');
  if (options?.digraphInput) out = out.replace(/ch/gi, 'c').replace(/sh/gi, 's');
  return out
    .normalize('NFD')
    .replace(/\p{M}/gu, '')  // strip all combining characters
    .toLowerCase();
}

// Display variant: Latin barred u (ʉ U+0289, cap Ʉ U+0244).
export function janyToLatinU(text: string): string {
  return text
    .replaceAll('ū', 'ʉ').replaceAll('Ū', 'Ʉ')
    .replaceAll('ü', 'ʉ').replaceAll('Ü', 'Ʉ')
    .replaceAll('ұ', 'ʉ').replaceAll('Ұ', 'Ʉ');
}

// Display variant: Cyrillic ұ (U+04B1, cap Ұ U+04B0).
export function janyToCyrillicU(text: string): string {
  return text
    .replaceAll('ū', 'ұ').replaceAll('Ū', 'Ұ')
    .replaceAll('ü', 'ұ').replaceAll('Ü', 'Ұ');
}

// Display variant: u with macron (ū U+016B, cap Ū U+016A).
export function janyToMacronU(text: string): string {
  return text
    .replaceAll('ұ', 'ū').replaceAll('Ұ', 'Ū')
    .replaceAll('ü', 'ū').replaceAll('Ü', 'Ū');
}

const REVERSE_SINGLE: Readonly<Record<string, string>> = {
  a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', j: 'ж', z: 'з', k: 'к', q: 'к',
  l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т', u: 'у',
  f: 'ф', h: 'х', y: 'ы',
  // CTA-mode ж (affricate: 'c'); the digraphs ch/sch are matched before it.
  c: 'ж',
  // Both Latin ö and legacy Cyrillic ө map back to Cyrillic ө
  'ö': 'ө',
  'ө': 'ө',
  'ü': 'ү', 'ū': 'ү', 'ұ': 'ү',
  'ı': 'ы',
  'ğ': 'г', // CTA-mode г (uvularG: 'ğ')
  'ç': 'ч',
  'ş': 'ш',
  'ŋ': 'ң',
  'ñ': 'ң', // tilde-n alternative
  'í': 'й',
  // §11.1 marked glide alternatives. janyToCyr folds both to í before
  // reverting (so íe/ía/ío/íu contexts apply to them too); listed here so the
  // single-letter table stays complete.
  'ĭ': 'й',
  'ĩ': 'й',
  // §11.2 extended (compose-mode) letters fold to their Cyrillic base:
  // ä→а, x→х, w→в. Single auditable source in alphabet.ts.
  ...Object.fromEntries(EXTENDED_LETTERS),
};

// §9.1 native-priority rule: ts is NOT in this list because ts → тс (not ц).
// Loan ц is an accepted loss; native т+с clusters are frequent and productive.
const REVERSE_DIGRAPHS: ReadonlyArray<readonly [string, string]> = [
  ['sch', 'щ'], ['sh', 'ш'], ['ch', 'ч'],
  ['ía', 'я'], ['ío', 'ё'], ['íu', 'ю'],
  ['ya', 'я'], ['yo', 'ё'], ['yu', 'ю'],
];

// ĭ/ĩ (and capitals) read exactly like the canonical í glide in reverse.
const MARKED_GLIDE = /[ĭĩĬĨ]/g;
const MARKED_GLIDE_TO_ACUTE: Readonly<Record<string, string>> = { 'ĭ': 'í', 'ĩ': 'í', 'Ĭ': 'Í', 'Ĩ': 'Í' };

const CANON_VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y', 'ө', 'ö', 'ü', 'ū', 'ұ', 'ä', 'ı']);
const JANY_WORD = /[\p{L}']+/gu;

// Reverts one lowercase word. Each segment records which source character it
// came from, so applyCase can restore the source word's casing (SPEC §2.1).
function revertWord(word: string, restoreLoans: boolean, offset = 0): Segment[] {
  if (restoreLoans) {
    if (LOAN_EXACT[word]) return [[offset, LOAN_EXACT[word]]];
    for (const [prefix, cyr, len] of LOAN_PREFIXES) {
      if (word.startsWith(prefix)) {
        return [[offset, cyr], ...revertWord(word.slice(len), restoreLoans, offset + len)];
      }
    }
  }

  let out = '';
  const segments: Segment[] = [];
  const put = (at: number, text: string): void => {
    out += text;
    segments.push([offset + at, text]);
  };
  for (let i = 0; i < word.length; i++) {
    if (word.startsWith('íe', i)) {
      if (out === '') {
        // word-initial íe → е (Íevropa → Европа, §9.1)
        put(i, 'е');
      } else {
        const prev = i > 0 ? word[i - 1] : '';
        if (CANON_VOWELS.has(prev)) {
          // post-vocalic íe → йе — §9.1 native-priority rule
          // Preserves root integrity: kiíet→кийет, tiíet→тийет
          // Accepted loss: proíekt→пройект, pereíezd→перейезд
          put(i, 'йе');
        } else {
          // post-consonantal íe → е (core drops the ъ/ь sign)
          put(i, 'е');
        }
      }
      i++;
      continue;
    }
    // Backward compatibility: after apostrophe (soft sign), legacy 'ia, 'io, 'iu reverse to я, ё, ю
    if (i > 0 && word[i - 1] === "'") {
      if (word.startsWith('ia', i)) {
        put(i, 'я');
        i++;
        continue;
      }
      if (word.startsWith('io', i)) {
        put(i, 'ё');
        i++;
        continue;
      }
      if (word.startsWith('iu', i)) {
        put(i, 'ю');
        i++;
        continue;
      }
    }
    const digraph = REVERSE_DIGRAPHS.find(([from]) => word.startsWith(from, i));
    if (digraph) {
      put(i, digraph[1]);
      i += digraph[0].length - 1;
      continue;
    }
    const ch = word[i];
    if (ch === 'e') {
      if (word[i + 1] === 'e') {
        // Kyrgyz long vowel /e:/ is always written ээ in Cyrillic (ээги, керээз, кээде, жээк)
        put(i, 'ээ');
        i++;
      } else if (out === '') {
        // word-initial single e → э (эл, эне)
        put(i, 'э');
      } else {
        // non-initial single e → е (кел, мектеп)
        put(i, 'е');
      }
      continue;
    }
    if (ch === 'i') {
      const prev = i > 0 ? word[i - 1] : '';
      const prevPrev = i > 1 ? word[i - 2] : '';
      if (prev === 'y' && i > 1 && CANON_VOWELS.has(prevPrev) && prevPrev !== 'y') {
        put(i, 'и');
        continue;
      }
      put(i, i > 0 && CANON_VOWELS.has(prev) && prev !== 'y' ? 'й' : 'и');
      continue;
    }
    if (ch === 'y') {
      const prev = i > 0 ? word[i - 1] : '';
      const prevPrev = i > 1 ? word[i - 2] : '';
      if (prev === 'i' && CANON_VOWELS.has(prevPrev)) {
        put(i, 'ы');
        continue;
      }
      put(i, (i > 0 && CANON_VOWELS.has(prev) && prev !== 'y') ? 'й' : 'ы');
      continue;
    }
    if (ch === "'") {
      // merged ъ/ь: ъ before e, ь before ia/io/iu/ya/yo/yu/ía/ío/íu digraphs, else ь
      const next = word.slice(i + 1);
      if (
        next.startsWith('ia') || next.startsWith('io') || next.startsWith('iu') ||
        next.startsWith('ya') || next.startsWith('yo') || next.startsWith('yu') ||
        next.startsWith('ía') || next.startsWith('ío') || next.startsWith('íu')
      ) {
        put(i, 'ь');
      } else if (word[i + 1] === 'e') {
        put(i, 'ъ');
      } else {
        put(i, 'ь');
      }
      continue;
    }
    put(i, REVERSE_SINGLE[ch] ?? ch);
  }
  return segments;
}

// Latin→Cyrillic conversion. Deterministic and lossless for native Kyrgyz
// vocabulary; lossy for the loanword classes listed in §9.1.
// This function is NOT bijective or lossless for Russian loanwords — do not
// describe it as such in documentation.
// With restoreLoans:true the loan-restoration list (§9.2) is applied first.
export function janyToCyr(text: string, options?: JanyCyrOptions): string {
  const restoreLoans = options?.restoreLoans ?? false;
  const mode = caseModeFor(options);
  const normalized = text.normalize('NFC').replace(MARKED_GLIDE, (g) => MARKED_GLIDE_TO_ACUTE[g]);
  return mapLines(normalized, (line, upperLine) => line.replace(JANY_WORD, (word) =>
    applyCase(word, revertWord(lowerStr(word, mode), restoreLoans), upperLine, mode)), mode);
}
