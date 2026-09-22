// SPDX-License-Identifier: MIT
/**
 * compareCyrillic() against the checked-in expected orderings (SPEC §6).
 *
 * The Cyrillic side of the testbed's list view sorts the source column in the
 * order a Kyrgyz reader learned, so the two columns can be read against each
 * other. That order is fixed by the alphabet and takes no configuration.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compareCyrillic } from '../src/collate.js';

const fixture = JSON.parse(readFileSync(new URL('../../test/fixtures/collation.json', import.meta.url), 'utf8')) as {
  cyrillic: { lists: string[][] };
};

function shuffles(list: string[]): string[][] {
  const r = [...list].reverse();
  const rot = [...list.slice(1), list[0]];
  const inter = [...list.filter((_, i) => i % 2), ...list.filter((_, i) => !(i % 2))];
  return [r, rot, inter];
}

test('compareCyrillic(): native Kyrgyz order matches the fixture', () => {
  for (const expected of fixture.cyrillic.lists) {
    for (const input of shuffles(expected)) {
      assert.deepEqual([...input].sort(compareCyrillic), expected);
    }
  }
});

test('compareCyrillic(): ң follows н and ө follows о, as in the alphabet', () => {
  assert.ok(compareCyrillic('кен', 'кең') < 0);
  assert.ok(compareCyrillic('кең', 'кеп') < 0);
  assert.ok(compareCyrillic('конок', 'көл') < 0);   // every о word precedes every ө word
  assert.ok(compareCyrillic('күл', 'кул') > 0);
});

test('compareCyrillic(): non-letters sort before letters, unknown letters after', () => {
  assert.ok(compareCyrillic('-ай', 'ай') < 0);
  assert.ok(compareCyrillic('ай', 'zoo') < 0);      // Latin falls outside the table
});

test('compareCyrillic(): ties break on case, lowercase first', () => {
  assert.ok(compareCyrillic('ата', 'Ата') < 0);
  assert.equal(compareCyrillic('ата', 'ата'), 0);
});
