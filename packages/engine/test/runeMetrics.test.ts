// SPDX-License-Identifier: MIT
/**
 * The treebank reader and the proposal-figure check (scripts/treebank.ts,
 * scripts/rune-metrics.ts), on a made-up CoNLL-U sample. The real treebank is
 * not in the repository, so its figures are checked by `npm run rune-metrics -- --check`.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseConllu, treebankWords } from '../scripts/treebank.js';

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
