// SPDX-License-Identifier: MIT
/**
 * The engine against the Yenisei Kyrgyz corpus (RUNES-SPEC.md §11, checks 3–5). It
 * lives outside the MIT engine package because the corpus is CC BY-NC-SA; it reads
 * the corpus at run time and copies nothing from it.
 * Run from the repository root: npm run test:corpus
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import {
  readInscription, detectSpelling, cyrillicToRunes, presetOptions,
} from '../../packages/engine/dist/src/runes/index.js';

const corpus = readFileSync(new URL('../YENISEI-KYRGYZ-CORPUS.md', import.meta.url), 'utf8');
const LINE = /<p dir="rtl" lang="otk-Orkh">(.*?)<\/p>\n\n- Database signs: `.*?`\n- Reader output: `(.*?)`/g;

test('check 3: the reader reproduces the reader line of every corpus line', () => {
  const lines = [...corpus.matchAll(LINE)];
  assert.equal(lines.length, 99);
  for (const [, runes, expected] of lines) assert.equal(readInscription(runes), expected, runes);
});

test('check 4: the detector classes every stone as old spelling, with or without dividers', () => {
  const stones = corpus.split(/^## \d+\. /m).slice(1)
    .map((s) => [s.split('\n')[0], [...s.matchAll(/<p dir="rtl" lang="otk-Orkh">(.*?)<\/p>/g)].map((m) => m[1]).join(' ')])
    .filter(([, text]) => text);
  assert.equal(stones.length, 21);
  for (const [name, text] of stones) {
    assert.equal(detectSpelling(text), 'old', name);
    assert.equal(detectSpelling(text.replace(/[⁚⸱]/g, ' ')), 'old', `${name} without dividers`);
  }
});

test('check 5: Eski-Enesai writes only the attested-majority forms of Appendix B, and all of them a word can need', () => {
  const table = corpus.slice(corpus.indexOf('## Appendix B.'));
  const majority = new Set([...table.matchAll(/^\| [^|]+ \| [^|]+ \| (\S+) \|$/gm)].map((m) => m[1]).filter((r) => /\p{Script=Old_Turkic}/u.test(r)));
  assert.ok(majority.size > 30, `${majority.size} forms`);
  const samples = new URL('../../apps/web/src/lib/sample-texts/', import.meta.url);
  const text = readdirSync(samples).filter((f) => f.endsWith('.txt')).map((f) => readFileSync(new URL(f, samples), 'utf8')).join('\n');
  const emitted = new Set([...cyrillicToRunes(text, presetOptions('eski-enesai'))].filter((c) => /\p{Script=Old_Turkic}/u.test(c)));
  assert.deepEqual([...emitted].filter((r) => !majority.has(r)), [], 'forms Eski-Enesai writes that the stones do not use most');
  // 𐱈 baš is a syllable modern Kyrgyz spelling never calls for.
  assert.deepEqual([...majority].filter((r) => !emitted.has(r) && r !== '𐱈'), [], 'attested forms Eski-Enesai never writes');
});
