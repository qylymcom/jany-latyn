// SPDX-License-Identifier: MIT
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const CLI = 'dist/src/cli.js';
const run = (args: string[], input: string) =>
  execFileSync(process.execPath, [CLI, ...args], { input, encoding: 'utf8' });

test('default direction converts stdin Cyrillic to canonical', () => {
  assert.equal(run([], 'Ак мөңгүлүү\n'), 'Ak möŋgülüü\n');
});

test('--to fallback chains canonical then ASCII fallback', () => {
  assert.equal(run(['--to', 'fallback'], 'мөңгүлүү\n'), 'monguluu\n');
});

test('--to cyrillic reverses', () => {
  assert.equal(run(['--to', 'cyrillic'], 'Saktap\n'), 'Сактап\n');
});

test('text args join with spaces instead of reading stdin', () => {
  assert.equal(run(['көзү', 'тик'], ''), 'közü tik\n');
});

test('unknown direction exits 1', () => {
  assert.throws(() => run(['--to', 'bogus'], 'x'));
});

test('stdin without trailing newline gets exactly one', () => {
  assert.equal(run([], 'Saktap'), 'Saktap\n');
});
