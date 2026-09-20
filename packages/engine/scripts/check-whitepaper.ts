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
 *     `source ↔ target` pair from prose and tables plus the §8.1 romanization
 *     column, and classifies each into exactly one of:
 *       - already covered by CHECKS (skip),
 *       - a NEW checkable Cyrillic↔Latin pair (added to the gate and run),
 *       - a config override (run in the stated non-canonical config),
 *       - an explicit EXCLUSION (recorded with a reason),
 *       - a structural non-example (single-letter letter rule, mixed script),
 *       - UNCLASSIFIED → the run FAILS.
 *
 * The last bucket is the point: a Latin→Latin word pair (a casual-register
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

type Dir = 'forward' | 'reverse' | 'casual';
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

// CTA examples always state their ж mode (affricate). A human CTA writer uses c
// for native ж and j for loanword ж; no converter mode reproduces that mix, so
// such renderings belong in EXCLUSIONS with that reason, not in CHECKS.
const CTA: JanyOptions = { yGrapheme: 'dotless-i', glideGrapheme: 'y', uvularK: 'q', uvularG: 'ğ' };
const CTA_C: JanyOptions = { ...CTA, affricate: 'c' };
const CTA_J: JanyOptions = { ...CTA, affricate: 'j' };

const CHECKS: Check[] = [
  // §4.4 iotation and the palatal glide
  F('4.4', 'саякат', 'saíakat'), F('4.4', 'коён', 'koíon'), F('4.4', 'аюу', 'aíuu'),
  F('4.4', 'кийет', 'kiíet'), F('4.4', 'тийет', 'tiíet'), F('4.4', 'тийиштүү', 'tiíiştüü'),
  F('4.4', 'бийик', 'biíik'),
  // §4.4 barcode counter-example — the REJECTED plain-i mapping, verified in its config
  F('4.4', 'бийик', 'biiik', { glideGrapheme: 'i' }),
  F('4.4', 'кийим', 'kiiim', { glideGrapheme: 'i' }),
  F('4.4', 'кийин', 'kiiin', { glideGrapheme: 'i' }),
  // §4.3 the e system
  F('4.3', 'Европа', 'Íevropa'), F('4.3', 'эне', 'ene'), F('4.3', 'мектеп', 'mektep'),
  F('4.3', 'ээги', 'eegi'), F('4.3', 'керээз', 'kereez'),
  // §5 consonants
  F('5.1', 'ящик', 'íaşik'), F('5.1', 'борщ', 'borş'), F('5.1', 'башчы', 'başçy'),
  F('5.1', 'исхак', 'ishak'), F('5.1', 'ишак', 'işak'), F('5.3', 'жаңы', 'jaŋy'),
  // §6 loan signs / ц
  F('6', 'цирк', 'tsirk'), F('6', 'разъезд', 'razíezd'), F('6', 'объект', 'obíekt'),
  F('6', 'семья', 'semía'), F('6', 'июль', 'iíul'), F('6', 'апрель', 'aprel'),
  F('6', 'роль', 'rol'), F('6', 'переезд', 'pereíezd'), F('6', 'проект', 'proíekt'),
  // §9.1 native-priority reverse (losses)
  R('9.1', 'kiíet', 'кийет'), R('9.1', 'tiíet', 'тийет'), R('9.1', 'Íevropa', 'Европа'),
  R('9.1', 'tsirk', 'тсирк'), R('9.1', 'proíekt', 'пройект'), R('9.1', 'raíon', 'раён'),
  R('9.1', 'semía', 'семя'), R('9.1', 'borş', 'борш'), R('9.1', 'aprel', 'апрел'),
  R('9.1', 'poet', 'поет'), R('9.1', 'aeroport', 'аеропорт'),
  // §9.2 opt-in loan restoration
  R('9.2', 'statía', 'статья', true), R('9.2', 'semía', 'семья', true),
  R('9.2', 'obíekt', 'объект', true), R('9.2', 'proíekt', 'проект', true),
  R('9.2', 'iíul', 'июль', true), R('9.2', 'aprel', 'апрель', true),
  // §9.3 reverse e-system
  R('9.3', 'eegi', 'ээги'), R('9.3', 'el', 'эл'), R('9.3', 'ene', 'эне'),
  R('9.3', 'kel', 'кел'), R('9.3', 'mektep', 'мектеп'),
  // §10 casual register
  C('10', 'jaŋy', 'jany'), C('10', 'jaŋylyktar', 'janylyktar'), C('10', 'biíik', 'biiik'),
  C('10', 'çaí', 'cai'), C('10', 'başçy', 'bascy'), C('10', 'köl', 'kol'), C('10', 'küz', 'kuz'),
  C('10', 'kırgız', 'kirgiz'),
  // §11.2 extended compose-mode letters (reverse folds), incl. capitals
  R('11.2', 'äkä', 'ака'), R('11.2', 'källä', 'калла'), R('11.2', 'xaram', 'харам'),
  R('11.2', 'Xaram', 'Харам'), R('11.2', 'XALYK', 'ХАЛЫК'), R('11.2', 'Buhara', 'Бухара'),
  R('11.2', 'taw', 'тав'),
  // §12.2 retrieval examples: the same word in the two configurations it compares.
  F('12.2', 'кылым', 'kylym'), F('12.2', 'кылым', 'qılım', CTA),
  F('12.2', 'жаным', 'janym'), F('12.2', 'жаным', 'canım', CTA_C),
  F('12.2', 'жаңы', 'jaŋy'), F('12.2', 'жаңы', 'cañı', { ...CTA_C, velarNasal: 'tilde-n' }),
  // §8.2 CTA: c for [dʒ], j for loanword [ʒ]. The converter can only apply one rule.
  F('8.2', 'жол', 'col', CTA_C), F('8.2', 'же', 'ce', CTA_C),
  F('8.2', 'журнал', 'curnal', CTA_C),   // mechanical c: the loanword comes out wrong
  F('8.2', 'журнал', 'jurnal', CTA_J), F('8.2', 'же', 'je', CTA_J),
];

// Extracted pairs that must run in a non-canonical configuration.
const CONFIG_OVERRIDES: Record<string, { opts: JanyOptions; note: string }> = {
  'бийик→biiik': { opts: { glideGrapheme: 'i' }, note: '§4.4 barcode (plain-i mode)' },
  'кийим→kiiim': { opts: { glideGrapheme: 'i' }, note: '§4.4 barcode (plain-i mode)' },
  'кийин→kiiin': { opts: { glideGrapheme: 'i' }, note: '§4.4 barcode (plain-i mode)' },
};

// Named configurations used as column labels in comparison tables and as row
// labels in comparison passages (§9.5). A table whose first column is "Cyrillic"
// and whose other columns are named here is checked cell by cell; a blockquote
// row "**Label.** text" after a "**Cyrillic.**" row is checked word by word.
const COLUMN_CONFIGS: Record<string, JanyOptions> = {
  'Canonical': {},
  // §6: q entails ğ, so the q column writes both.
  'q and ğ': { uvularK: 'q', uvularG: 'ğ' },
  // With ы written ı, y is free for the glide, which is how §9.5 writes this row.
  'Dotless ı': { yGrapheme: 'dotless-i', uvularK: 'q', uvularG: 'ğ', glideGrapheme: 'y' },
  'CTA-aligned': { ...CTA_C, velarNasal: 'tilde-n' },
};

// Explicit, deliberate exclusions. A human edits this list; nothing else drops.
const EXCLUSIONS: Record<string, string> = {
  // §9.5 CTA column and row: renderings that need a writer's knowledge, not a rule.
  'журналдарда→jurnaldarda': '§9.5 CTA row: loanword ж written j from lexical knowledge; the converter gives curnaldarda in c mode',
  'ishak→Исхак': '§9.2 proper-noun capitalization — lowercase input yields исхак; capitalized input Ishak yields Исхак',
  '-чы→башчы': '§5.2 morpheme illustration (suffix), not a literal word pair',
  'kií-→кийет': '§9.1 root/morpheme illustration (hyphen), not literal',
  'tií-→тийет': '§9.1 root/morpheme illustration (hyphen), not literal',
};

// ---- §9.4 configuration-dependent search folds (behavioral, not arrows) ----
interface FoldCheck { label: string; a: string; b: string; opts?: FoldKeyOptions; equal: boolean; }
const foldChecks: FoldCheck[] = [
  { label: '§9.4 x/h unify when enabled', a: 'xaram', b: 'haram', opts: { extendedLetters: ['x'] }, equal: true },
  { label: '§9.4 x stays x when disabled (Linux)', a: 'xaram', b: 'haram', equal: false },
  { label: '§9.4 w/v unify when enabled', a: 'taw', b: 'tav', opts: { extendedLetters: ['w'] }, equal: true },
  { label: '§9.4 w stays w when disabled', a: 'taw', b: 'tav', equal: false },
  { label: '§9.4 strip fallback folds equal (no opts)', a: 'çaí', b: 'cai', equal: true },
  { label: '§9.4 digraph fallback equal with digraphInput', a: 'çaí', b: 'chai', opts: { digraphInput: true }, equal: true },
  { label: '§9.4 digraph fallback differs without digraphInput', a: 'çaí', b: 'chai', equal: false },
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

// Compiled to packages/engine/dist/scripts/, so the repository root is four levels up.
const WHITEPAPER = new URL('../../../../docs/WHITEPAPER.md', import.meta.url);

function loadWhitepaper(): { name: string; text: string } {
  return { name: 'docs/WHITEPAPER.md', text: readFileSync(WHITEPAPER, 'utf8') };
}

interface Candidate { section: string; src: string; tgt: string; bidi: boolean; }
const candidates: Candidate[] = [];
const seen = new Set<string>();
function addCandidate(section: string, src: string, tgt: string, bidi: boolean): void {
  const k = `${section}|${src}|${tgt}|${bidi}`;
  if (seen.has(k)) return;
  seen.add(k);
  candidates.push({ section, src, tgt, bidi });
}

// ---- Comparison tables and passages (§9.5) ---------------------------------
interface Comparison { section: string; src: string; tgt: string; label: string; }
const comparisons: Comparison[] = [];
const comparisonProblems: string[] = [];
let tableHeader: string[] | null = null;   // config labels of the current comparison table
let passageSource: string | null = null;   // text of the last "**Cyrillic.**" row

function extractComparison(section: string, line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.startsWith('|')) {
    const cells = trimmed.split('|').slice(1, -1).map(stripMd);
    if (cells.every((c) => /^:?-+:?$/.test(c))) return tableHeader !== null;   // separator row
    if (tableHeader === null && cells[0] === 'Cyrillic') {
      const known = cells.slice(1).filter((c) => c in COLUMN_CONFIGS);
      if (known.length === 0) return false;                                    // not a configuration table
      const unknown = cells.slice(1).filter((c) => !(c in COLUMN_CONFIGS));
      for (const u of unknown) comparisonProblems.push(`§${section} table column "${u}" is not a named configuration (add it to COLUMN_CONFIGS)`);
      tableHeader = cells.slice(1);
      return true;
    }
    if (tableHeader !== null) {
      tableHeader.forEach((label, i) => {
        if (label in COLUMN_CONFIGS && cells[i + 1]) comparisons.push({ section, src: cells[0], tgt: cells[i + 1], label });
      });
      return true;
    }
    return false;
  }
  tableHeader = null;
  const q = trimmed.match(/^>\s*\*\*(.+?)\.\*\*\s*(.+)$/);
  if (q) {
    const label = stripMd(q[1]);
    if (label === 'Cyrillic') { passageSource = q[2].trim(); return true; }
    if (passageSource !== null) {
      if (label in COLUMN_CONFIGS) comparisons.push({ section, src: passageSource, tgt: q[2].trim(), label });
      else comparisonProblems.push(`§${section} passage row "${label}" is not a named configuration (add it to COLUMN_CONFIGS)`);
      return true;
    }
  }
  if (trimmed !== '' && !trimmed.startsWith('>')) passageSource = null;
  return false;
}

const { name, text } = loadWhitepaper();
const lines = text.split('\n');
let section = '0';
let inEightOne = false;
const headingRe = /^#{2,4}\s+(\d+(?:\.\d+)?)[.\s]/;
const arrowRe = /([\p{L}ʼ'’ıİ-]+)\s*(→|↔)\s*([\p{L}ʼ'’ıİ-]+)/gu;

for (const line of lines) {
  const h = line.match(headingRe);
  if (h) { section = h[1]; inEightOne = section === '8.1'; continue; }

  if (inEightOne && line.trimStart().startsWith('|') && line.includes('|', 1)) {
    const cells = line.split('|').slice(1, -1).map(stripMd);
    if (cells.length >= 2) {
      const first = cells[0], last = cells[cells.length - 1];
      if (/^\p{Script=Cyrillic}$/u.test(first) && /^[A-Za-zöüíŋçş]+$/u.test(last)) {
        addCandidate('8.1', first, last, false);
      }
    }
    continue;
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

function classifyDirected(section: string, src: string, tgt: string): void {
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
  // (§9.3 "post-consonantal е → e"), not standalone words — they cannot be
  // checked out of context. The §8.1 table, by contrast, states unconditional
  // letter mappings and is checked.
  if (section !== '8.1' && ([...src].length < 2 || [...tgt].length < 2)) return;

  const ss = script(src), ts = script(tgt);
  const restoreLoans = section.startsWith('9.2');
  if (ss === 'cyr' && ts === 'lat') {
    extra.push({ section, dir: 'forward', src, tgt });
  } else if (ss === 'lat' && ts === 'cyr') {
    extra.push({ section, dir: 'reverse', src, tgt, restoreLoans });
  } else if (ss === 'lat' && ts === 'lat') {
    // A multi-char Latin→Latin pair is a casual-register example: it must be
    // pinned in CHECKS or listed in EXCLUSIONS, else it fails loudly.
    const bothWords = [...src].length >= 2 && [...tgt].length >= 2;
    if (casualKeys.has(key)) return;             // covered by CHECKS
    if (!bothWords) return;                       // single-letter letter rule (ö→o, ch→c)
    unclassified.push(`${key} [§${section}] (Latin→Latin casual example — classify: add to CHECKS or EXCLUSIONS)`);
  }
  // mixed / cyr→cyr → structural non-example, skip silently
}

for (const cand of candidates) {
  classifyDirected(cand.section, cand.src, cand.tgt);
  if (cand.bidi) classifyDirected(cand.section, cand.tgt, cand.src);
}

// A comparison row must match the engine in its configuration. Where it does not,
// every differing word must be an explicit exclusion; otherwise the row fails.
const bare = (w: string) => w.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
for (const c of comparisons) {
  const opts = COLUMN_CONFIGS[c.label];
  const got = cyrToJany(c.src, opts);
  if (got === c.tgt) { extra.push({ section: c.section, dir: 'forward', src: c.src, tgt: c.tgt, opts }); continue; }
  const srcWords = c.src.split(/\s+/), tgtWords = c.tgt.split(/\s+/);
  if (srcWords.length !== tgtWords.length) {
    extra.push({ section: c.section, dir: 'forward', src: c.src, tgt: c.tgt, opts });   // fails with the full text
    continue;
  }
  srcWords.forEach((w, i) => {
    const key = `${bare(w)}→${bare(tgtWords[i])}`;
    if (cyrToJany(w, opts) === tgtWords[i]) return;
    if (EXCLUSIONS[key]) excluded.push({ pair: `${key} [${c.label}]`, reason: EXCLUSIONS[key] });
    else extra.push({ section: c.section, dir: 'forward', src: w, tgt: tgtWords[i], opts });
  });
}
for (const p of comparisonProblems) unclassified.push(p);

// ---- Run -------------------------------------------------------------------
const runOne = (c: Check): string =>
  c.dir === 'forward' ? cyrToJany(c.src, c.opts)
  : c.dir === 'casual' ? janyToFallback(c.src)
  : janyToCyr(c.src, c.restoreLoans ? { restoreLoans: true } : undefined);

const failures: string[] = [];
const gate = [...CHECKS, ...extra];
for (const c of gate) {
  const got = runOne(c);
  if (got !== c.tgt) {
    const cfg = c.restoreLoans ? ' {restoreLoans}' : c.opts ? ` ${JSON.stringify(c.opts)}` : '';
    failures.push(`FAIL §${c.section} [${c.dir}${cfg}] "${c.src}" → "${got}" (expected "${c.tgt}")`);
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
  for (const c of [...CHECKS, ...extra]) console.log(`${c.dir}\t${c.src} -> ${c.tgt}\t[§${c.section}]`);
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
