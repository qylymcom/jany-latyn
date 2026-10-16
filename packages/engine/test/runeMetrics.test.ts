// SPDX-License-Identifier: MIT
/**
 * The treebank reader and the proposal-figure check (scripts/treebank.ts,
 * scripts/rune-metrics.ts), on a made-up CoNLL-U sample. The real treebank is
 * not in the repository, so its figures are checked by `npm run rune-metrics -- --check`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseConllu, treebankWords } from '../scripts/treebank.js';
import { CAUSES, checkDocument, computeMetrics, figures } from '../scripts/rune-metrics.js';

const row = (id: number, form: string, lemma: string, upos: string) => [id, form, lemma, upos, '_', '_', 0, 'dep', '_', '_'].join('\t');
const SAMPLE = [
  '# sent_id = 1', '# text = Кол менен кул.',
  row(1, 'Кол', 'кол', 'NOUN'), row(2, 'менен', 'менен', 'ADP'), row(3, 'кул', 'кул', 'NOUN'), row(4, '.', '.', 'PUNCT'), '',
  '# sent_id = 2', '# text = Украина, цирк, апрелге, Ташиев',
  row(1, 'Украина', 'украина', 'PROPN'), row(2, ',', ',', 'PUNCT'), row(3, 'цирк', 'цирк', 'NOUN'), row(4, ',', ',', 'PUNCT'),
  row(5, 'апрелге', 'апрель', 'NOUN'), row(6, ',', ',', 'PUNCT'), row(7, 'Ташиев', 'ташиев', 'PROPN'), '',
  '# sent_id = 3',
  row(1, 'жок', 'жок', 'ADV'), '',
].join('\n');

test('treebank: sentences, text lines, and the forms of syntactic words', () => {
  const tb = parseConllu([SAMPLE]);
  assert.equal(tb.sentenceIds, 3);
  assert.deepEqual(tb.texts, ['Кол менен кул.', 'Украина, цирк, апрелге, Ташиев']);
  assert.deepEqual(tb.forms.get('апрелге'), { lemma: 'апрель', upos: 'NOUN' });
});

test('treebank: a word is a run of Cyrillic letters, hyphenated parts joined, lowercased', () => {
  assert.deepEqual(treebankWords(['Ысык-Көл, 2026! Windows - жок']), ['ысык-көл', 'жок']);
});

test('rune-metrics: the round trip, its causes, and the loan list on a sample', () => {
  const m = computeMetrics(parseConllu([SAMPLE]));
  assert.deepEqual(m.corpus, { sentenceIds: 3, sentences: 2, tokens: 7, types: 7 });
  assert.equal(m.reverse.lostTokens, 3);
  assert.deepEqual(m.reverse.causes, { '`и` after a vowel': 1, '`ц`': 1, 'Iotated `е` after a vowel': 1 });
  assert.deepEqual(m.loanList.broken, ['апрелге']);
  assert.deepEqual(m.roundTrip, { 'jany-enesai': 2, kg: 2, full: 2, attested: 2 });
  assert.equal(m.sharedTypes['jany-enesai'], 0);
  assert.equal(CAUSES.length, 8);
});

test('rune-metrics: a document that states every figure passes; one wrong figure is reported', () => {
  const m = computeMetrics(parseConllu([SAMPLE]));
  const runes = [...new Set(Object.values(m.emitted).join(''))];
  const labels: Record<string, string> = { 'jany-enesai': 'J-E', kg: 'k+g', full: 'Full', orkhon: 'Orkh', 'eski-enesai': 'Eski', attested: 'Att' };
  const appendixA = runes.map((r) => {
    const by = Object.entries(m.emitted).filter(([, s]) => s.includes(r)).map(([id]) => labels[id]).join(', ');
    return `| U+${r.codePointAt(0)!.toString(16).toUpperCase()} | ${r} | NAME | — | — | ${by} | — |`;
  });
  const doc = [...figures(m).map((f) => f.text), '## Appendix A.', ...appendixA, '## Appendix B.'].join('\n');
  assert.deepEqual(checkDocument(doc, m), []);
  const wrong = doc.replace(figures(m)[0].text, 'On a Kyrgyz treebank, 99.9% of word tokens come back unchanged');
  assert.equal(checkDocument(wrong, m).length, 1);
});

test('rune-metrics: without the treebank it exits 2 and says how to fetch it', () => {
  const script = fileURLToPath(new URL('../scripts/rune-metrics.js', import.meta.url));
  const run = spawnSync(process.execPath, [script, '--dir', fileURLToPath(new URL('./no-treebank-here/', import.meta.url))], { encoding: 'utf8' });
  assert.equal(run.status, 2);
  assert.match(run.stderr, /fetch-ud-kyrgyz\.sh/);
});
