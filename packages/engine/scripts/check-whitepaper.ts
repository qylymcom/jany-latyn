// SPDX-License-Identifier: MIT
/**
 * Whitepaper conformance checker.
 *
 * Two layers, and the gate is their UNION so coverage never regresses:
 *
 *  1. CHECKS — an authoritative, human-maintained list of transliteration pairs
 *     from docs/WHITEPAPER.md, each with explicit direction and configuration.
 *     This is the floor; it is only ever added to.
 *
 *  2. Extractor — reads docs/WHITEPAPER.md, pulls every `source → target` /
 *     `source ↔ target` pair from prose and tables plus the Jany-Latyn column
 *     of the romanization tables (§6, §21.1), and classifies each into exactly
 *     one of:
 *       - already covered by CHECKS (skip),
 *       - a NEW checkable Cyrillic↔Latin pair (added to the gate and run),
 *       - a config override (run in the stated comparison setting),
 *       - an explicit EXCLUSION (recorded with a reason),
 *       - a structural non-example (single-letter letter rule, mixed script),
 *       - UNCLASSIFIED → the run FAILS.
 *
 * The last bucket is the point: a Latin→Latin word pair (a plain-form
 * example) that is neither in CHECKS nor in EXCLUSIONS fails loudly instead of
 * being silently dropped. Exclusions are a deliberate list a human edits, not
 * an emergent property of what the engine happened to agree with.
 *
 * Run:   npm run check-whitepaper       (or: node dist/scripts/check-whitepaper.js)
 * Debug: node dist/scripts/check-whitepaper.js --list
 */
import { readFileSync } from 'node:fs';
import {
  cyrToJany,
  janyToCyr,
  janyToFallback,
  foldKey,
  type JanyOptions,
  type FoldKeyOptions,
} from '../src/convert.js';

// 'plain' is Cyrillic to the plain form: the strip fallback of the Jany-Latyn form.
type Dir = 'forward' | 'reverse' | 'casual' | 'plain';
interface Check {
  section: string;
  dir: Dir;
  src: string;
  tgt: string;
  restoreLoans?: boolean;
  opts?: JanyOptions;
}

// ---- Layer 1: authoritative checklist (the coverage floor) -----------------
// Round-1 verified pairs plus round-2 additions. Grouped by section. Many of
// these live in the whitepaper as prose ("loan [je] word-initially (Европа)")
// or in columnar table cells the arrow extractor structurally cannot reach, so
// they must be pinned here rather than left to extraction.
const F = (section: string, src: string, tgt: string, opts?: JanyOptions): Check =>
  ({ section, dir: 'forward', src, tgt, opts });
const R = (section: string, src: string, tgt: string, restoreLoans = false): Check =>
  ({ section, dir: 'reverse', src, tgt, restoreLoans });
const C = (section: string, src: string, tgt: string): Check =>
  ({ section, dir: 'casual', src, tgt });

// CTA-aligned examples always state their ж mode (affricate). A human CTA writer
// uses c for native ж and j for loanword ж; no converter mode reproduces that
// mix, so such renderings belong in EXCLUSIONS with that reason, not in CHECKS.
const CTA: JanyOptions = { yGrapheme: 'dotless-i', glideGrapheme: 'y', uvularK: 'q', uvularG: 'ğ' };
const CTA_C: JanyOptions = { ...CTA, affricate: 'c' };
const CTA_J: JanyOptions = { ...CTA, affricate: 'j' };

const CHECKS: Check[] = [
  // §2 letter chart: the example column, which the extractor cannot reach
  ...([
    ['бала', 'bala'], ['дос', 'dos'], ['вагон', 'vagon'], ['фабрика', 'fabrika'], ['гүл', 'gül'],
    ['ага', 'aga'], ['кел', 'kel'], ['Европа', 'Íevropa'], ['коён', 'koíon'], ['жол', 'jol'],
    ['той', 'toí'], ['бийик', 'biíik'], ['китеп', 'kitep'], ['кар', 'kar'], ['жаңы', 'jaŋy'],
    ['көл', 'köl'], ['күн', 'kün'], ['рахмат', 'rahmat'], ['цирк', 'tsirk'], ['чай', 'çaí'],
    ['шаар', 'şaar'], ['борщ', 'borş'], ['объект', 'obíekt'], ['ыр', 'yr'], ['семья', 'semía'],
    ['апрель', 'aprel'], ['эл', 'el'], ['аюу', 'aíuu'], ['саякат', 'saíakat'], ['тоок', 'took'],
    ['күү', 'küü'],
  ] as const).map(([src, tgt]) => F('2', src, tgt)),
  // §10 and §16: the palatal glide and iotation
  F('16', 'саякат', 'saíakat'), F('16', 'коён', 'koíon'), F('16', 'аюу', 'aíuu'),
  F('10', 'кийет', 'kiíet'), F('10', 'тийет', 'tiíet'), F('10', 'тийиштүү', 'tiíiştüü'),
  F('10', 'бийик', 'biíik'),
  // §10 barcode counter-example — the REJECTED plain-i mapping, verified in its config
  F('10', 'бийик', 'biiik', { glideGrapheme: 'i' }),
  F('10', 'кийим', 'kiiim', { glideGrapheme: 'i' }),
  F('10', 'кийин', 'kiiin', { glideGrapheme: 'i' }),
  // §15.1 the e system
  F('15.1', 'Европа', 'Íevropa'), F('15.1', 'эне', 'ene'), F('15.1', 'мектеп', 'mektep'),
  F('15.1', 'ээги', 'eegi'), F('15.1', 'керээз', 'kereez'),
  // §13, §14 consonants
  F('13', 'ящик', 'íaşik'), F('13', 'борщ', 'borş'), F('13', 'башчы', 'başçy'),
  F('13', 'исхак', 'ishak'), F('13', 'ишак', 'işak'), F('14', 'жаңы', 'jaŋy'),
  // §16 loan signs, §15.1 loan íe, §18.1 ц
  F('18.1', 'цирк', 'tsirk'), F('16', 'разъезд', 'razíezd'), F('16', 'объект', 'obíekt'),
  F('16', 'семья', 'semía'), F('16', 'июль', 'iíul'), F('16', 'апрель', 'aprel'),
  F('16', 'роль', 'rol'), F('15.1', 'переезд', 'pereíezd'), F('15.1', 'проект', 'proíekt'),
  // §18.1 native-priority reverse (losses)
  R('18.1', 'kiíet', 'кийет'), R('18.1', 'tiíet', 'тийет'), R('18.1', 'Íevropa', 'Европа'),
  R('18.1', 'tsirk', 'тсирк'), R('18.1', 'proíekt', 'пройект'), R('18.1', 'raíon', 'раён'),
  R('18.1', 'semía', 'семя'), R('18.1', 'borş', 'борш'), R('18.1', 'aprel', 'апрел'),
  R('18.1', 'poet', 'поет'), R('18.1', 'aeroport', 'аеропорт'),
  // §18.2 opt-in loan restoration
  R('18.2', 'statía', 'статья', true), R('18.2', 'semía', 'семья', true),
  R('18.2', 'obíekt', 'объект', true), R('18.2', 'proíekt', 'проект', true),
  R('18.2', 'iíul', 'июль', true), R('18.2', 'aprel', 'апрель', true),
  // Appendix A reverse e-system
  R('Appendix A', 'eegi', 'ээги'), R('Appendix A', 'el', 'эл'), R('Appendix A', 'ene', 'эне'),
  R('Appendix A', 'kel', 'кел'), R('Appendix A', 'mektep', 'мектеп'),
  // §19 plain form
  C('19', 'jaŋy', 'jany'), C('19', 'jaŋylyktar', 'janylyktar'), C('19', 'biíik', 'biiik'),
  C('19', 'çaí', 'cai'), C('19', 'başçy', 'bascy'), C('19', 'köl', 'kol'), C('19', 'küz', 'kuz'),
  C('19', 'kırgız', 'kirgiz'),
  // §20 extended compose-mode letters (reverse folds), incl. capitals
  R('20', 'äkä', 'ака'), R('20', 'källä', 'калла'), R('20', 'xaram', 'харам'),
  R('20', 'Xaram', 'Харам'), R('20', 'XALYK', 'ХАЛЫК'), R('20', 'Buhara', 'Бухара'),
  R('20', 'taw', 'тав'),
  // §22.2 retrieval examples: the same word in the two configurations it compares.
  F('22.2', 'кылым', 'kylym'), F('22.2', 'кылым', 'qılım', CTA),
  F('22.2', 'жаным', 'janym'), F('22.2', 'жаным', 'canım', CTA_C),
  F('22.2', 'жаңы', 'jaŋy'), F('22.2', 'жаңы', 'cañı', { ...CTA_C, velarNasal: 'tilde-n' }),
  // §11 CTA: c for [dʒ], j for loanword [ʒ]. The converter can only apply one rule.
  F('11', 'жол', 'col', CTA_C), F('11', 'же', 'ce', CTA_C),
  F('11', 'журнал', 'curnal', CTA_C),   // mechanical c: the loanword comes out wrong
  F('11', 'журнал', 'jurnal', CTA_J), F('11', 'же', 'je', CTA_J),
];

// Extracted pairs that must run in a comparison setting rather than Jany-Latyn.
const CONFIG_OVERRIDES: Record<string, { opts: JanyOptions; note: string }> = {
  'бийик→biiik': { opts: { glideGrapheme: 'i' }, note: '§10 barcode (plain-i mode)' },
  'кийим→kiiim': { opts: { glideGrapheme: 'i' }, note: '§10 barcode (plain-i mode)' },
  'кийин→kiiin': { opts: { glideGrapheme: 'i' }, note: '§10 barcode (plain-i mode)' },
};

// Named settings used as column labels in comparison tables, as row labels in
// the §6 settings table, and as row labels in comparison passages (§2, §21.2).
// A table whose first column is "Cyrillic" and whose other columns are named
// here is checked cell by cell; a blockquote row "**Label.** text" after a
// "**Cyrillic.**" row is checked word by word.
const COLUMN_CONFIGS: Record<string, JanyOptions> = {
  'Jany-Latyn': {},
  // §8: q entails ğ, so the q column writes both.
  'q+ğ': { uvularK: 'q', uvularG: 'ğ' },
  // With ы written ı, y is free for the glide, which is how §6 defines this setting.
  'q+ğ+ı': { yGrapheme: 'dotless-i', uvularK: 'q', uvularG: 'ğ', glideGrapheme: 'y' },
  'CTA-aligned': { ...CTA_C, velarNasal: 'tilde-n' },
  'CTA-aligned (q+ğ+ı+c+ñ)': { ...CTA_C, velarNasal: 'tilde-n' },
};

// The §2 chart and passage give the plain form, the strip fallback of the
// Jany-Latyn form, rather than a setting of its own.
const PLAIN_FORM = 'Plain form';
const isLabel = (label: string) => label in COLUMN_CONFIGS || label === PLAIN_FORM;
const convertAs = (label: string, src: string) =>
  label === PLAIN_FORM ? janyToFallback(cyrToJany(src)) : cyrToJany(src, COLUMN_CONFIGS[label]);

// Columns that are not engine output. Other romanizations mark a romanization
// table (§6, §21.1), whose Jany-Latyn column is checked letter by letter; the
// §2 chart's example and cross-reference columns are skipped.
const OTHER_SYSTEMS = new Set(['BGN/PCGN', 'ALA-LC', 'ISO 9', 'CTA']);
const NOTE_COLUMNS = new Set(['Example', 'See']);

// Explicit, deliberate exclusions. A human edits this list; nothing else drops.
const EXCLUSIONS: Record<string, string> = {
  // §21.2 CTA-aligned column and row: renderings that need a writer's knowledge, not a rule.
  'журналдарда→jurnaldarda': '§21.2 CTA-aligned row: loanword ж written j from lexical knowledge; the converter gives curnaldarda in c mode',
  '-чы→башчы': '§13 morpheme illustration (suffix), not a literal word pair',
  'kií-→кийет': '§18.1 root/morpheme illustration (hyphen), not literal',
  'tií-→тийет': '§18.1 root/morpheme illustration (hyphen), not literal',
  // §2 chart rows that are not single mappings; their words are pinned in CHECKS.
  'е→e, or íe': '§2 chart: е has two forms by position (кел→kel, Европа→Íevropa)',
  'е→e, ie': '§2 chart: the plain forms of е\'s two positional forms',
  'ъ→absorbed into the glide': '§2 chart: descriptive (объект→obíekt)',
  'ь→absorbed into the glide, or dropped at the end of a syllable': '§2 chart: descriptive (семья→semía, апрель→aprel)',
};

// ---- Appendix B configuration-dependent search folds (behavioral, not arrows) ----
interface FoldCheck { label: string; a: string; b: string; opts?: FoldKeyOptions; equal: boolean; }
const foldChecks: FoldCheck[] = [
  { label: 'Appendix B x/h unify when enabled', a: 'xaram', b: 'haram', opts: { extendedLetters: ['x'] }, equal: true },
  { label: 'Appendix B x stays x when disabled (Linux)', a: 'xaram', b: 'haram', equal: false },
  { label: 'Appendix B w/v unify when enabled', a: 'taw', b: 'tav', opts: { extendedLetters: ['w'] }, equal: true },
  { label: 'Appendix B w stays w when disabled', a: 'taw', b: 'tav', equal: false },
  { label: 'Appendix B strip fallback folds equal (no opts)', a: 'çaí', b: 'cai', equal: true },
  { label: 'Appendix B digraph fallback equal with digraphInput', a: 'çaí', b: 'chai', opts: { digraphInput: true }, equal: true },
  { label: 'Appendix B digraph fallback differs without digraphInput', a: 'çaí', b: 'chai', equal: false },
];

// ---- Extraction ------------------------------------------------------------
const CYR = /\p{Script=Cyrillic}/u;
const LAT = /[A-Za-zöüíŋçşñäōūʉıİÖÜÍŊÇŞÑÄ]/u;
const stripMd = (s: string) => s.replace(/[*`_]/g, '').trim();
const script = (s: string): 'cyr' | 'lat' | 'mixed' => {
  const c = CYR.test(s), l = LAT.test(s);
  return c && !l ? 'cyr' : l && !c ? 'lat' : 'mixed';
};
const STOP = new Set(['latin', 'cyrillic', 'loan', 'source', 'target', 'ascii', 'nfc', 'nfd']);
// Numbered sections print as §N; appendices print by name.
const sec = (s: string) => (/^\d/.test(s) ? `§${s}` : s);

// Compiled to packages/engine/dist/scripts/, so the repository root is four levels up.
const WHITEPAPER = new URL('../../../../docs/WHITEPAPER.md', import.meta.url);

function loadWhitepaper(): { name: string; text: string } {
  return { name: 'docs/WHITEPAPER.md', text: readFileSync(WHITEPAPER, 'utf8') };
}

// `letter` marks a pair from a romanization table: an unconditional letter mapping.
interface Candidate { section: string; src: string; tgt: string; bidi: boolean; letter: boolean; }
const candidates: Candidate[] = [];
const seen = new Set<string>();
function addCandidate(section: string, src: string, tgt: string, bidi: boolean, letter = false): void {
  const k = `${section}|${src}|${tgt}|${bidi}`;
  if (seen.has(k)) return;
  seen.add(k);
  candidates.push({ section, src, tgt, bidi, letter });
}

// ---- Comparison tables and passages (§2, §6, §21.2) ------------------------
interface Comparison { section: string; src: string; tgt: string; label: string; }
const comparisons: Comparison[] = [];
const comparisonProblems: string[] = [];
let tableHeader: string[] | null = null;   // config labels of the current comparison table
let settingSource: { col: number; src: string } | null = null;   // the §6 settings table
let passageSource: string | null = null;   // text of the last "**Cyrillic.**" row

function extractComparison(section: string, line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.startsWith('|')) {
    const cells = trimmed.split('|').slice(1, -1).map(stripMd);
    if (cells.every((c) => /^:?-+:?$/.test(c))) return tableHeader !== null || settingSource !== null;   // separator row
    if (tableHeader === null && settingSource === null && cells[0] === 'Cyrillic') {
      const known = cells.slice(1).filter(isLabel);
      if (known.length === 0) return false;                                    // not a configuration table
      const unknown = cells.slice(1).filter((c) => !isLabel(c) && !NOTE_COLUMNS.has(c));
      for (const u of unknown) comparisonProblems.push(`${sec(section)} table column "${u}" is not a named configuration (add it to COLUMN_CONFIGS)`);
      tableHeader = cells.slice(1);
      return true;
    }
    // A settings table has one row per setting and one Cyrillic column (§6).
    if (tableHeader === null && settingSource === null && cells[0] === 'Setting') {
      const col = cells.findIndex((c, i) => i > 0 && script(c) === 'cyr');
      if (col < 0) return false;
      settingSource = { col, src: cells[col] };
      return true;
    }
    if (settingSource !== null) {
      const label = cells[0];
      if (isLabel(label)) comparisons.push({ section, src: settingSource.src, tgt: cells[settingSource.col], label });
      else comparisonProblems.push(`${sec(section)} settings row "${label}" is not a named configuration (add it to COLUMN_CONFIGS)`);
      return true;
    }
    if (tableHeader !== null) {
      tableHeader.forEach((label, i) => {
        const cell = cells[i + 1];
        if (!isLabel(label) || !cell) return;
        // "—" means no letter at all (the §2 chart's ъ and ь).
        comparisons.push({ section, src: cells[0], tgt: cell === '—' ? '' : cell, label });
      });
      return true;
    }
    return false;
  }
  tableHeader = null;
  settingSource = null;
  const q = trimmed.match(/^>\s*\*\*(.+?)\.\*\*\s*(.+)$/);
  if (q) {
    const label = stripMd(q[1]);
    if (label === 'Cyrillic') { passageSource = q[2].trim(); return true; }
    if (passageSource !== null) {
      if (isLabel(label)) comparisons.push({ section, src: passageSource, tgt: q[2].trim(), label });
      else comparisonProblems.push(`${sec(section)} passage row "${label}" is not a named configuration (add it to COLUMN_CONFIGS)`);
      return true;
    }
  }
  if (trimmed !== '' && !trimmed.startsWith('>')) passageSource = null;
  return false;
}

const { name, text } = loadWhitepaper();
const lines = text.split('\n');
let section = '0';
let letterTable: string[] | null = null;   // header of the current romanization table
const headingRe = /^#{2,4}\s+(\d+(?:\.\d+)?|Appendix [A-Z])[.\s]/;
const arrowRe = /([\p{L}ʼ'’ıİ-]+)\s*(→|↔)\s*([\p{L}ʼ'’ıİ-]+)/gu;

for (const line of lines) {
  const h = line.match(headingRe);
  if (h) { section = h[1]; continue; }

  // A romanization table (§6, §21.1) sets Jany-Latyn beside other systems. Its
  // Jany-Latyn column states unconditional letter mappings and is checked; the
  // other systems' columns are not engine output.
  if (line.trimStart().startsWith('|')) {
    const cells = line.trim().split('|').slice(1, -1).map(stripMd);
    if (letterTable === null && cells[0] === 'Cyrillic' && cells.some((c) => OTHER_SYSTEMS.has(c))) {
      letterTable = cells;
      if (!cells.includes('Jany-Latyn')) comparisonProblems.push(`${sec(section)} romanization table has no Jany-Latyn column`);
      continue;
    }
    if (letterTable !== null) {
      const first = cells[0], tgt = cells[letterTable.indexOf('Jany-Latyn')] ?? '';
      if (/^\p{Script=Cyrillic}$/u.test(first) && /^[A-Za-zöüíŋçş]+$/u.test(tgt)) {
        addCandidate(section, first, tgt, false, true);
      }
      continue;
    }
  } else {
    letterTable = null;
  }

  if (extractComparison(section, line)) continue;

  const clean = stripMd(line);
  for (const m of clean.matchAll(arrowRe)) addCandidate(section, m[1], m[3], m[2] === '↔');
}

// ---- Classify candidates ---------------------------------------------------
const checkKeys = new Set(CHECKS.map((c) => `${c.dir}:${c.src}→${c.tgt}`));
const anyDirKeys = new Set(CHECKS.map((c) => `${c.src}→${c.tgt}`));
const casualKeys = new Set(CHECKS.filter((c) => c.dir === 'casual').map((c) => `${c.src}→${c.tgt}`));

const extra: Check[] = [];
const excluded: { pair: string; reason: string }[] = [];
const unclassified: string[] = [];

function classifyDirected(section: string, src: string, tgt: string, letter = false): void {
  const key = `${src}→${tgt}`;
  if (STOP.has(src.toLowerCase()) || STOP.has(tgt.toLowerCase())) return;
  if (EXCLUSIONS[key]) { excluded.push({ pair: key, reason: EXCLUSIONS[key] }); return; }
  if (CONFIG_OVERRIDES[key]) {
    if (!checkKeys.has(`forward:${key}`)) {
      extra.push({ section, dir: 'forward', src, tgt, opts: CONFIG_OVERRIDES[key].opts });
      checkKeys.add(`forward:${key}`);
    }
    return;
  }
  if (anyDirKeys.has(key)) return; // already pinned in CHECKS

  // Single-letter arrow pairs in prose are positional rule fragments
  // (Appendix A "post-consonantal е → e"), not standalone words — they cannot
  // be checked out of context. The romanization tables, by contrast, state
  // unconditional letter mappings and are checked.
  if (!letter && ([...src].length < 2 || [...tgt].length < 2)) return;

  const ss = script(src), ts = script(tgt);
  const restoreLoans = section.startsWith('18.2');
  if (ss === 'cyr' && ts === 'lat') {
    extra.push({ section, dir: 'forward', src, tgt });
  } else if (ss === 'lat' && ts === 'cyr') {
    extra.push({ section, dir: 'reverse', src, tgt, restoreLoans });
  } else if (ss === 'lat' && ts === 'lat') {
    // A multi-char Latin→Latin pair is a plain-form example: it must be
    // pinned in CHECKS or listed in EXCLUSIONS, else it fails loudly.
    const bothWords = [...src].length >= 2 && [...tgt].length >= 2;
    if (casualKeys.has(key)) return;             // covered by CHECKS
    if (!bothWords) return;                       // single-letter letter rule (ö→o, ch→c)
    unclassified.push(`${key} [${sec(section)}] (Latin→Latin plain-form example — classify: add to CHECKS or EXCLUSIONS)`);
  }
  // mixed / cyr→cyr → structural non-example, skip silently
}

for (const cand of candidates) {
  classifyDirected(cand.section, cand.src, cand.tgt, cand.letter);
  if (cand.bidi) classifyDirected(cand.section, cand.tgt, cand.src, cand.letter);
}

// A comparison row must match the engine in its configuration. Where it does not,
// every differing word must be an explicit exclusion; otherwise the row fails.
const bare = (w: string) => w.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
for (const c of comparisons) {
  const whole = `${c.src}→${c.tgt}`;
  if (EXCLUSIONS[whole]) { excluded.push({ pair: `${whole} [${c.label}]`, reason: EXCLUSIONS[whole] }); continue; }
  const plain = c.label === PLAIN_FORM;
  const dir: Dir = plain ? 'plain' : 'forward';
  const opts = plain ? undefined : COLUMN_CONFIGS[c.label];
  if (convertAs(c.label, c.src) === c.tgt) { extra.push({ section: c.section, dir, src: c.src, tgt: c.tgt, opts }); continue; }
  const srcWords = c.src.split(/\s+/), tgtWords = c.tgt.split(/\s+/);
  if (srcWords.length !== tgtWords.length) {
    extra.push({ section: c.section, dir, src: c.src, tgt: c.tgt, opts });   // fails with the full text
    continue;
  }
  srcWords.forEach((w, i) => {
    const key = `${bare(w)}→${bare(tgtWords[i])}`;
    if (convertAs(c.label, w) === tgtWords[i]) return;
    if (EXCLUSIONS[key]) excluded.push({ pair: `${key} [${c.label}]`, reason: EXCLUSIONS[key] });
    else extra.push({ section: c.section, dir, src: w, tgt: tgtWords[i], opts });
  });
}
for (const p of comparisonProblems) unclassified.push(p);

// ---- Run -------------------------------------------------------------------
const runOne = (c: Check): string =>
  c.dir === 'forward' ? cyrToJany(c.src, c.opts)
  : c.dir === 'casual' ? janyToFallback(c.src)
  : c.dir === 'plain' ? janyToFallback(cyrToJany(c.src))
  : janyToCyr(c.src, c.restoreLoans ? { restoreLoans: true } : undefined);

const failures: string[] = [];
const gate = [...CHECKS, ...extra];
for (const c of gate) {
  const got = runOne(c);
  if (got !== c.tgt) {
    const cfg = c.restoreLoans ? ' {restoreLoans}' : c.opts ? ` ${JSON.stringify(c.opts)}` : '';
    failures.push(`FAIL ${sec(c.section)} [${c.dir}${cfg}] "${c.src}" → "${got}" (expected "${c.tgt}")`);
  }
}
for (const f of foldChecks) {
  if ((foldKey(f.a, f.opts) === foldKey(f.b, f.opts)) !== f.equal) {
    failures.push(`FAIL ${f.label}`);
  }
}
for (const u of unclassified) failures.push(`UNCLASSIFIED ${u}`);

// ---- Debug dump ------------------------------------------------------------
if (process.argv.includes('--list')) {
  console.log(`# CHECKS (${CHECKS.length}) + extractor-added (${extra.length})`);
  for (const c of [...CHECKS, ...extra]) console.log(`${c.dir}\t${c.src} -> ${c.tgt}\t[${sec(c.section)}]`);
  console.log(`\n# excluded (${excluded.length})`);
  for (const e of excluded) console.log(`${e.pair} — ${e.reason}`);
  console.log(`\n# unclassified (${unclassified.length})`);
  for (const u of unclassified) console.log(u);
  process.exit(0);
}

// ---- Report ----------------------------------------------------------------
if (failures.length > 0) {
  console.error(`Whitepaper conformance failures (source: ${name}):\n`);
  for (const f of failures) console.error(' ', f);
  console.error('');
}
console.log(
  `Whitepaper check (${name}): ${gate.length + foldChecks.length - failures.length}/${gate.length + foldChecks.length} passed ` +
  `— ${CHECKS.length} pinned + ${extra.length} extracted + ${foldChecks.length} fold checks; ` +
  `${excluded.length} explicit exclusions, ${unclassified.length} unclassified.`
);
process.exit(failures.length > 0 ? 1 : 0);
