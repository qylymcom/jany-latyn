// SPDX-License-Identifier: MIT
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const CLI = 'dist/src/cli.js';
const run = (args: string[], input: string) =>
  execFileSync(process.execPath, [CLI, ...args], { input, encoding: 'utf8' });

test('default direction converts stdin Cyrillic to Jany-Latyn', () => {
  assert.equal(run([], 'Ак мөңгүлүү\n'), 'Ak möŋgülüü\n');
});

test('--to fallback chains Jany-Latyn then ASCII fallback', () => {
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

test('--to runes converts Cyrillic to Jany-Enesai', () => {
  assert.equal(run(['--to', 'runes'], 'Кыргыз\n'), '𐰴𐰃𐰺𐰍𐰃𐰕\n');
});

test('--rune-preset seeds the rune options and --rune-opt overrides them', () => {
  assert.equal(run(['--to', 'runes', '--rune-preset', 'full'], 'кыргыз'), '𐰶𐰃𐰺𐰍𐰃𐰕\n');
  assert.equal(run(['--to', 'runes', '--rune-preset', 'full', '--rune-opt', 'harmony=none', '--rune-opt', 'r=attested'], 'кыргыз'), '𐰴𐰃𐰻𐰍𐰃𐰕\n');
});

test('unknown rune option or value exits 1', () => {
  assert.throws(() => run(['--to', 'runes', '--rune-opt', 'bogus=1'], 'x'));
  assert.throws(() => run(['--to', 'runes', '--rune-opt', 'harmony=bogus'], 'x'));
  assert.throws(() => run(['--to', 'runes', '--rune-preset', 'bogus'], 'x'));
});

test('--from runes converts back to Cyrillic or Jany-Latyn', () => {
  assert.equal(run(['--from', 'runes'], '𐰴𐰃𐰺𐰍𐰃𐰕\n'), 'кыргыз\n');
  assert.equal(run(['--from', 'runes', '--to', 'jany'], '𐰴𐰃𐰺𐰍𐰃𐰕\n'), 'kyrgyz\n');
  assert.equal(run(['--from', 'runes', '--restore-loans'], '𐰆𐰉𐰖𐰅𐰴𐱄\n'), 'объект\n');
});

test('--from runes refuses the inscriptions\' spelling', () => {
  assert.throws(() => run(['--from', 'runes'], '𐰴𐰃𐰻𐰃𐰍\n'));
});

test('--to read reads inscriptions sign by sign, in a chosen notation', () => {
  assert.equal(run(['--to', 'read'], '𐱅𐰭𐰼𐰃⁚𐰅𐰠𐰢\n'), 't²ñr²i el²m\n');
  assert.equal(run(['--to', 'read', '--target', 'cyrillic'], '𐰴𐰃𐰕\n'), 'кыз\n');
  assert.throws(() => run(['--to', 'read', '--target', 'bogus'], '𐰴'));
});

test('--to detect classes rune text as old or modern spelling', () => {
  assert.equal(run(['--to', 'detect'], '𐰴𐰃𐰺𐰍𐰃𐰕\n'), 'modern\n');
  assert.equal(run(['--to', 'detect'], '𐰴𐰃𐰻𐰃𐰍\n'), 'old\n');
});
