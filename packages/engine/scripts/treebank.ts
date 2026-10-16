// SPDX-License-Identifier: MIT
/**
 * Reads UD Kyrgyz-KTMU (CC BY-SA 4.0) for the figures of the Jany-Enesai proposal.
 * The treebank is read at run time from a git-ignored directory that
 * scripts/fetch-ud-kyrgyz.sh fills; nothing from it is committed.
 *
 * The proposal counts words the way its draft prototype did: runs of Cyrillic
 * letters in each sentence's `# text = ` line, with hyphenated parts joined
 * (Ысык-Көл is one word), and word types lowercased.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { lowerStr } from '../src/casing.js';

export const TREEBANK_FILES = ['ky_ktmu-ud-train.conllu', 'ky_ktmu-ud-test.conllu'] as const;

export const TREEBANK_WORD = /\p{Script=Cyrillic}+(?:-\p{Script=Cyrillic}+)*/gu;

export interface Treebank {
  /** Sentences in the files (`# sent_id` lines). Ten of r2.18's have no text line. */
  sentenceIds: number;
  /** The `# text = ` line of every sentence that has one. */
  texts: string[];
  /** Lowercased form → lemma and part of speech of its first occurrence as a syntactic word. */
  forms: Map<string, { lemma: string; upos: string }>;
}

export function parseConllu(sources: readonly string[]): Treebank {
  const tb: Treebank = { sentenceIds: 0, texts: [], forms: new Map() };
  for (const source of sources) {
    for (const line of source.split('\n')) {
      if (line.startsWith('# sent_id')) tb.sentenceIds++;
      else if (line.startsWith('# text = ')) tb.texts.push(line.slice('# text = '.length));
      else if (/^\d+\t/.test(line)) {
        const [, form, lemma, upos] = line.split('\t');
        const key = lowerStr(form);
        if (!tb.forms.has(key)) tb.forms.set(key, { lemma: lowerStr(lemma), upos });
      }
    }
  }
  return tb;
}

export function readTreebank(dir: string): Treebank {
  return parseConllu(TREEBANK_FILES.map((f) => readFileSync(join(dir, f), 'utf8')));
}

/** Every word token of the texts, lowercased, in order. */
export function treebankWords(texts: readonly string[]): string[] {
  return texts.flatMap((t) => t.match(TREEBANK_WORD) ?? []).map((w) => lowerStr(w));
}
