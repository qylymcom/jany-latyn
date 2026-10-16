// SPDX-License-Identifier: MIT
/**
 * The treebank figures of the Jany-Enesai proposal (docs/jany-enesai/JANY-ENESAI.md),
 * computed with the engine itself over UD Kyrgyz-KTMU r2.18.
 *
 * Run:   npm run rune-metrics                 (prints the figures)
 *        npm run rune-metrics -- --check      (fails if the proposal states a figure differently)
 *        npm run rune-metrics -- --json
 * Needs the treebank: packages/engine/scripts/fetch-ud-kyrgyz.sh
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cyrToJany, janyToCyr } from '../src/convert.js';
import { lowerStr } from '../src/casing.js';
import {
  cyrillicToRunes, janyLatynToRunes, runesToJanyLatyn, explainRunes, presetOptions, RUNE_PRESETS,
} from '../src/runes/index.js';
import { readTreebank, treebankWords, type Treebank } from './treebank.js';

const VOWELS = 'аэиоуыөүеёюя';

/** Why a token does not come back unchanged; a token counts under the first cause that applies (proposal §13.1). */
export const CAUSES: readonly { label: string; test: (w: string) => boolean }[] = [
  { label: '`ц`', test: (w) => w.includes('ц') },
  { label: 'Iotated `е` after a vowel', test: (w) => new RegExp(`[${VOWELS}]е`).test(w) },
  { label: '`ъ`, `ь`', test: (w) => /[ъь]/.test(w) },
  { label: '`э` after a consonant', test: (w) => new RegExp(`[^${VOWELS}-]э`).test(w) },
  { label: '`ё` against `йо`', test: (w) => /ё|йо/.test(w) },
  { label: '`э` after a vowel', test: (w) => new RegExp(`[${VOWELS}]э`).test(w) },
  { label: '`и` after a vowel', test: (w) => new RegExp(`[${VOWELS}]и`).test(w) },
  { label: '`с` before `х`', test: (w) => w.includes('сх') },
];

// The consonants with a back and a front rune (proposal §6), by their Jany-Latyn letter.
const PAIRED: Readonly<Record<string, string>> = {
  b: 'б', g: 'г', d: 'д', j: 'ж', 'í': 'й', k: 'к', l: 'л', n: 'н', r: 'р', s: 'с', t: 'т',
};
const BACK_VOWELS = new Set([...'ayou']);

export interface Reverse {
  lostTokens: number;
  forms: number;
  lemmas: number;
  causes: Record<string, number>;
}

export interface RuneMetrics {
  corpus: { sentenceIds: number; sentences: number; tokens: number; types: number };
  /** Share of each paired consonant's occurrences governed by a back vowel, by Cyrillic letter. */
  backShare: Record<string, number>;
  backShareOverall: number;
  mixedVowelTypes: number;
  /** Sentences that come back from runes as the identical Jany-Latyn, per reversible preset. */
  roundTrip: Record<string, number>;
  /** Word types sharing a rune spelling with a type of another Jany-Latyn spelling. */
  sharedTypes: Record<string, number>;
  janyLatynShared: string[];
  letterTokens: Record<string, number>;
  roundedVowels: Record<string, number>;
  harmonyChanged: { kg: number; full: number };
  reverse: Reverse;
  reverseWithList: Reverse;
  postVocalicE: { tokens: number; forms: [string, string][] };
  vowelYeTokens: number;
  loanList: { fixed: string[]; broken: string[] };
  /** The runes each preset writes on the treebank, sorted by code point. */
  emitted: Record<string, string>;
  collation: { icu: string; equal: string[] };
}

const fraction = (n: number, d: number) => (d === 0 ? 0 : n / d);

export function computeMetrics(tb: Treebank): RuneMetrics {
  const words = treebankWords(tb.texts);
  const types = [...new Set(words)];
  const jl = new Map(types.map((t) => [t, lowerStr(cyrToJany(t))]));

  const back: Record<string, number> = {};
  const all: Record<string, number> = {};
  for (const w of explainRunes(words.join(' '))) {
    for (const l of w.letters) {
      if (!(l.letter in PAIRED) || l.governor === null) continue;
      const c = PAIRED[l.letter];
      all[c] = (all[c] ?? 0) + 1;
      if (BACK_VOWELS.has(w.letters[l.governor].letter)) back[c] = (back[c] ?? 0) + 1;
    }
  }
  const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

  const roundTrip: Record<string, number> = {};
  for (const p of RUNE_PRESETS.filter((p) => p.reversible)) {
    roundTrip[p.id] = tb.texts.filter((t) => {
      const j = lowerStr(cyrToJany(t));
      return runesToJanyLatyn(janyLatynToRunes(j, p.options)) === j;
    }).length;
  }

  const shared = (options: Parameters<typeof cyrillicToRunes>[1]) => {
    const byRunes = new Map<string, Set<string>>();
    const runesOf = new Map(types.map((t) => [t, cyrillicToRunes(t, options)]));
    for (const t of types) {
      const r = runesOf.get(t)!;
      if (!byRunes.has(r)) byRunes.set(r, new Set());
      byRunes.get(r)!.add(jl.get(t)!);
    }
    return types.filter((t) => byRunes.get(runesOf.get(t)!)!.size > 1).length;
  };
  const sharedTypes: Record<string, number> = {};
  for (const p of RUNE_PRESETS) sharedTypes[p.id] = shared(p.options);
  sharedTypes['zhe-etymological'] = shared({ zhe: 'etymological' });

  const byJanyLatyn = new Map<string, string[]>();
  for (const t of types) byJanyLatyn.set(jl.get(t)!, [...(byJanyLatyn.get(jl.get(t)!) ?? []), t]);

  const reference = new Map(types.map((t) => [t, cyrillicToRunes(t)]));
  const changed = (id: string) =>
    fraction(types.filter((t) => cyrillicToRunes(t, presetOptions(id)) !== reference.get(t)).length, types.length);

  const back2cyr = (w: string, restoreLoans: boolean) =>
    lowerStr(janyToCyr(runesToJanyLatyn(cyrillicToRunes(w)), { restoreLoans }));
  const reverse = (restoreLoans: boolean): Reverse => {
    const lost = words.filter((w) => back2cyr(w, restoreLoans) !== w);
    const forms = new Set(lost);
    const causes: Record<string, number> = {};
    for (const w of lost) {
      const label = CAUSES.find((c) => c.test(w))?.label ?? 'other';
      causes[label] = (causes[label] ?? 0) + 1;
    }
    return {
      lostTokens: lost.length,
      forms: forms.size,
      lemmas: new Set([...forms].map((f) => tb.forms.get(f)?.lemma ?? f)).size,
      causes,
    };
  };

  const postVocalic = new RegExp(`[${VOWELS}]е`);
  const eLost = words.filter((w) => postVocalic.test(w) && back2cyr(w, false) !== w);

  // The presets of the proposal's Appendix A; Eski-Teŋir-Too (RUNES-SPEC §6.4) is not one of them.
  const emitted: Record<string, string> = {};
  for (const p of RUNE_PRESETS.filter((x) => PROPOSAL_PRESETS.has(x.id))) {
    const runes = new Set([...cyrillicToRunes(words.join(' '), p.options)].filter((c) => /\p{Script=Old_Turkic}/u.test(c)));
    emitted[p.id] = [...runes].sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!).join('');
  }

  const letters = [...'абвгдежзийклмнңоөпрстуүфхчшы'].map((c) => [c, cyrillicToRunes(c)] as const);
  const collator = new Intl.Collator('und', { sensitivity: 'base' });
  const equal: string[] = [];
  for (let i = 0; i < letters.length; i++) {
    for (let j = i + 1; j < letters.length; j++) {
      if (letters[i][1] !== letters[j][1] && collator.compare(letters[i][1], letters[j][1]) === 0) {
        equal.push(`${letters[i][0]}=${letters[j][0]}`);
      }
    }
  }

  const rounded: Record<string, number> = { о: 0, у: 0, ө: 0, ү: 0 };
  for (const w of words) for (const ch of w) if (ch in rounded) rounded[ch]++;

  return {
    corpus: { sentenceIds: tb.sentenceIds, sentences: tb.texts.length, tokens: words.length, types: types.length },
    backShare: Object.fromEntries(Object.values(PAIRED).map((c) => [c, fraction(back[c] ?? 0, all[c] ?? 0)])),
    backShareOverall: fraction(sum(back), sum(all)),
    mixedVowelTypes: fraction(types.filter((t) => /[ayou]/.test(jl.get(t)!) && /[eiöü]/.test(jl.get(t)!)).length, types.length),
    roundTrip,
    sharedTypes,
    janyLatynShared: [...byJanyLatyn.values()].filter((v) => v.length > 1).map((v) => v.join('/')),
    letterTokens: Object.fromEntries(['ж', 'в', 'ф', 'х'].map((c) => [c, fraction(words.filter((w) => w.includes(c)).length, words.length)])),
    roundedVowels: rounded,
    harmonyChanged: { kg: changed('kg'), full: changed('full') },
    reverse: reverse(false),
    reverseWithList: reverse(true),
    postVocalicE: {
      tokens: eLost.length,
      forms: [...new Set(eLost)].map((f) => [f, tb.forms.get(f)?.upos ?? '?'] as [string, string]),
    },
    vowelYeTokens: words.filter((w) => new RegExp(`[${VOWELS}]йе`).test(w)).length,
    loanList: {
      fixed: [...new Set(words.filter((w) => back2cyr(w, false) !== w && back2cyr(w, true) === w))],
      broken: [...new Set(words.filter((w) => back2cyr(w, false) === w && back2cyr(w, true) !== w))],
    },
    emitted,
    collation: { icu: process.versions.icu ?? 'none', equal },
  };
}

const num = (n: number) => n.toLocaleString('en-US');
const pct = (f: number, digits = 1) => `${(100 * f).toFixed(digits)}%`;

/** Each figure exactly as the proposal must state it (proposal draft 0.4). */
export function figures(m: RuneMetrics): { section: string; text: string }[] {
  const r = m.reverse;
  const unchanged = fraction(m.corpus.tokens - r.lostTokens, m.corpus.tokens);
  const share = Object.values(m.backShare).map((f) => pct(f, 0));
  const lo = Math.min(...Object.values(m.backShare));
  const hi = Math.max(...Object.values(m.backShare));
  const at = (f: number) => Object.entries(m.backShare).filter(([, v]) => pct(v, 0) === pct(f, 0)).map(([c]) => c).join(', ');
  return [
    { section: 'Abstract', text: `On a Kyrgyz treebank, ${pct(unchanged)} of word tokens come back unchanged` },
    { section: '§5.3', text: `${num(m.corpus.sentences)} sentences of news and fiction, ${num(m.corpus.tokens)} Cyrillic word tokens, and ${num(m.corpus.types)} word types` },
    { section: '§6', text: `between ${pct(lo, 0)} (${at(lo)}) and ${pct(hi, 0)} (${at(hi)})` },
    { section: '§6', text: `| In back-vowel syllables | ${share.join(' | ')} |` },
    { section: '§7.3', text: `all ${num(m.corpus.sentences)} treebank sentences convert to runes and back to the identical Jany-Latyn` },
    { section: '§8', text: `ж occurs in ${pct(m.letterTokens['ж'])} of word tokens, в in ${pct(m.letterTokens['в'])}, ф in ${pct(m.letterTokens['ф'])}, and х in ${pct(m.letterTokens['х'])}` },
    { section: '§13.1', text: `${pct(unchanged)} of the treebank's ${num(m.corpus.tokens)} word tokens come back unchanged` },
    { section: '§13.1', text: `${num(r.forms)} distinct word forms of ${num(r.lemmas)} lemmas` },
    ...CAUSES.map((c) => ({ section: '§13.1', text: `| ${c.label} | ${num(r.causes[c.label] ?? 0)} |` })),
    { section: '§13.1', text: `every one of the ${num(m.postVocalicE.tokens)} tokens that spell plain \`е\`` },
    { section: '§13.2', text: `about ${num(Math.round(r.lemmas / 10) * 10)} lemmas` },
    { section: '§13.2', text: `the list restores ${num(m.loanList.fixed.length)} word forms and spoils ${num(m.loanList.broken.length)}` },
    { section: '§14', text: `it changes ${pct(m.harmonyChanged.kg)} of the treebank's word types. Full harmony changes ${pct(m.harmonyChanged.full)}` },
    { section: '§17', text: `${num(m.sharedTypes['orkhon'])} word types (${pct(fraction(m.sharedTypes['orkhon'], m.corpus.types))})` },
    { section: '§17', text: `${num(m.sharedTypes['eski-enesai'])} word types (${pct(fraction(m.sharedTypes['eski-enesai'], m.corpus.types))})` },
    { section: '§15', text: `the ${pct(m.mixedVowelTypes, 0)} of word types in the treebank that contain both back and front vowels` },
  ];
}

/** Claims the proposal makes in words rather than figures; each must hold. */
export function claims(m: RuneMetrics): { section: string; claim: string; holds: boolean }[] {
  const max = Math.max(...Object.values(m.roundedVowels));
  return [
    { section: '§7.3', claim: 'every reversible preset round-trips every sentence', holds: Object.values(m.roundTrip).every((n) => n === m.corpus.sentences) },
    { section: '§14', claim: 'no shared rune spelling beyond Jany-Latyn in Jany-Enesai, k+g, full harmony, attested letters', holds: ['jany-enesai', 'kg', 'full', 'attested'].every((id) => m.sharedTypes[id] === 0) },
    { section: '§18', claim: 'the etymological ж creates no shared spelling', holds: m.sharedTypes['zhe-etymological'] === 0 },
    { section: '§13.1', claim: 'no word spells й + е after a vowel', holds: m.vowelYeTokens === 0 },
    { section: '§13.1', claim: 'every lost token falls under a cause in the table', holds: !m.reverse.causes['other'] },
    { section: '§27.3', claim: 'у is the commonest rounded vowel', holds: m.roundedVowels['у'] === max },
    { section: '§8', claim: 'exactly и/ы, ү/ө, ж/ч, ф/л, в/б compare equal at base strength', holds: [...m.collation.equal].sort().join(' ') === 'б=в ж=ч и=ы л=ф ө=ү' },
  ];
}

const APPENDIX_A_LABELS: Readonly<Record<string, string>> = {
  'J-E': 'jany-enesai', 'k+g': 'kg', Full: 'full', Orkh: 'orkhon', Eski: 'eski-enesai', Att: 'attested',
};
const PROPOSAL_PRESETS = new Set(Object.values(APPENDIX_A_LABELS));

/** The runes Appendix A's "Emitted by" column gives each preset, sorted by code point. */
export function appendixAEmitted(doc: string): Record<string, string> {
  const out: Record<string, string[]> = Object.fromEntries(Object.values(APPENDIX_A_LABELS).map((id) => [id, []]));
  const appendix = doc.slice(doc.indexOf('## Appendix A.'), doc.indexOf('## Appendix B.'));
  for (const line of appendix.split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    if (!/^U\+10C[0-4][0-9A-F]$/.test(cells[1] ?? '')) continue;
    for (const label of cells[6].split(',').map((s) => s.trim())) {
      if (label in APPENDIX_A_LABELS) out[APPENDIX_A_LABELS[label]].push(cells[2]);
    }
  }
  return Object.fromEntries(Object.entries(out).map(([id, rs]) => [id, rs.sort((a, b) => a.codePointAt(0)! - b.codePointAt(0)!).join('')]));
}

/** Everything in the proposal that disagrees with the metrics; empty when it agrees. */
export function checkDocument(doc: string, m: RuneMetrics): string[] {
  const problems = figures(m).filter((f) => !doc.includes(f.text)).map((f) => `${f.section}: the document should say "${f.text}"`);
  problems.push(...claims(m).filter((c) => !c.holds).map((c) => `${c.section}: the claim "${c.claim}" does not hold`));
  const stated = appendixAEmitted(doc);
  for (const [id, runes] of Object.entries(m.emitted)) {
    if (stated[id] !== runes) problems.push(`Appendix A: "Emitted by" for ${id} lists ${stated[id]}, the engine writes ${runes}`);
  }
  return problems;
}

export function formatMetrics(m: RuneMetrics): string {
  const rows = [
    ...figures(m).map((f) => `| ${f.section} | ${f.text.replace(/\|/g, '\\|')} |`),
    ...claims(m).map((c) => `| ${c.section} | ${c.holds ? 'holds' : 'DOES NOT HOLD'}: ${c.claim} |`),
    `| §7.3 | words sharing a Jany-Latyn spelling: ${m.janyLatynShared.join(', ')} |`,
    `| §13.1 | other lost tokens: ${m.reverse.causes['other'] ?? 0}; with the loan list: ${m.reverseWithList.lostTokens} lost |`,
    `| §13.1 | post-vocalic е forms (UPOS): ${m.postVocalicE.forms.map(([f, u]) => `${f} (${u})`).join(', ')} |`,
    `| §13.2 | the loan list restores: ${m.loanList.fixed.join(', ')}; spoils: ${m.loanList.broken.join(', ')} |`,
    `| §8 | collation: ICU ${m.collation.icu}, equal at base strength: ${m.collation.equal.join(' ')} |`,
  ];
  return ['| Section | Figure |', '| :--- | :--- |', ...rows].join('\n');
}

function main(argv: string[]): number {
  const dirArg = argv.indexOf('--dir');
  const dir = dirArg >= 0 ? argv[dirArg + 1] : fileURLToPath(new URL('../../../../data/UD_Kyrgyz-KTMU/', import.meta.url));
  let tb: Treebank;
  try {
    tb = readTreebank(dir);
  } catch {
    process.stderr.write(`UD Kyrgyz-KTMU not found in ${dir}; run packages/engine/scripts/fetch-ud-kyrgyz.sh\n`);
    return 2;
  }
  const m = computeMetrics(tb);
  if (argv.includes('--json')) {
    process.stdout.write(JSON.stringify(m, null, 1) + '\n');
    return 0;
  }
  process.stdout.write(formatMetrics(m) + '\n');
  if (!argv.includes('--check')) return 0;
  const docArg = argv.indexOf('--doc');
  const doc = readFileSync(docArg >= 0 ? argv[docArg + 1] : new URL('../../../../docs/jany-enesai/JANY-ENESAI.md', import.meta.url), 'utf8');
  const problems = checkDocument(doc, m);
  for (const p of problems) process.stderr.write(`✗ ${p}\n`);
  process.stdout.write(`Proposal figures: ${problems.length === 0 ? 'all agree' : `${problems.length} disagree`}\n`);
  return problems.length === 0 ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(main(process.argv.slice(2)));
