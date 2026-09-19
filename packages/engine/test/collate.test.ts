// SPDX-License-Identifier: MIT
/**
 * compare() against the checked-in expected orderings (whitepaper §9.5). The ICU
 * rules cannot be run here (Intl.Collator takes no tailoring), so the fixture is
 * the pinned truth for both: change the rules, change the fixture.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { compare, type CollateOptions } from '../src/collate.js';

// Tests run from dist/test/, so fixtures resolve two levels up to the source tree.
const fixture = JSON.parse(readFileSync(new URL('../../test/fixtures/collation.json', import.meta.url), 'utf8')) as {
  configurations: { name: string; options: CollateOptions; lists: string[][] }[];
};

// Deterministic permutations: reversed, rotated, and interleaved.
function shuffles(list: string[]): string[][] {
  const r = [...list].reverse();
  const rot = [...list.slice(1), list[0]];
  const inter = [...list.filter((_, i) => i % 2), ...list.filter((_, i) => !(i % 2))];
  return [r, rot, inter];
}

for (const { name, options, lists } of fixture.configurations) {
  test(`compare(): ${name} order matches the fixture`, () => {
    for (const expected of lists) {
      for (const input of shuffles(expected)) {
        assert.deepEqual([...input].sort((a, b) => compare(a, b, options)), expected);
      }
    }
  });
}

test('compare(): the dotless reversal is configuration-dependent', () => {
  assert.ok(compare('kir', 'kyz') < 0);
  assert.ok(compare('kız', 'kir', { yGrapheme: 'dotless-i' }) < 0);
  assert.ok(compare('kız', 'kir') > 0); // canonical: ı is not a letter here and sorts as an unknown one
});

test('compare(): equal strings compare 0; the result is antisymmetric', () => {
  assert.equal(compare('baş', 'baş'), 0);
  assert.equal(Math.sign(compare('baş', 'bas')), -Math.sign(compare('bas', 'baş')));
});
