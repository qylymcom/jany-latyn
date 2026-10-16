// SPDX-License-Identifier: MIT
/**
 * The proposal checker (scripts/check-jany-enesai.ts) on small documents: it
 * passes what the engine writes, reports what it does not, and fails on a
 * comparison column it does not know.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkDocument } from '../scripts/check-jany-enesai.js';

const PASSAGE = [
  '> **Cyrillic.** Кол.', '>', '> **Jany-Latyn.** Kol.', '>', '> **Jany-Enesai** (read right to left):', '>', '> 𐰴𐰆𐰞.',
].join('\n');
// EXAMPLES must still find their runes in the document.
const EXAMPLE_RUNES = '𐰳𐰀𐰭𐰃 𐰅𐰣𐰅𐰽𐰀𐰖 𐰴𐰆𐰽𐰢𐰆𐰽 𐱅𐰅𐰢𐰄𐰼𐰳𐰆𐰞 𐰴𐰃𐰻𐰎𐰕 𐰶𐰃𐰺𐰍𐰔 𐱅𐰭𐰼 𐰜𐰇𐰠';

const doc = (body: string) => ['## 4. In Running Text', PASSAGE, '', '## 5. Body', body, '', EXAMPLE_RUNES].join('\n');

test('check-jany-enesai: tables, names, and examples the engine writes pass', () => {
  const report = checkDocument(doc([
    '| Cyrillic | Jany-Latyn | Jany-Enesai | Full harmony | Eski-Enesai |',
    '| :--- | :--- | :--- | :--- | :--- |',
    '| кол | kol | 𐰴𐰆𐰞 | 𐰸𐰆𐰞 | 𐰹𐰆𐰞 |',
    '',
    '| Rune | Unicode name |',
    '| :---: | :--- |',
    '| 𐰴 | ORKHON AQ |',
    '',
    'Long vowels are doubled: *тоо* (mountain) 𐱄𐰆𐰆.',
  ].join('\n')));
  assert.deepEqual(report.failures, []);
  assert.ok(report.passed >= 8, String(report.passed));
});

test('check-jany-enesai: a wrong rune, name, or example is reported where it is', () => {
  const report = checkDocument(doc([
    '| Cyrillic | Jany-Enesai |',
    '| :--- | :--- |',
    '| кол | 𐰸𐰆𐰞 |',
    '',
    '| Rune | Unicode name |',
    '| :---: | :--- |',
    '| 𐰴 | ORKHON AK |',
    '',
    'And *туу* 𐱄𐰆𐰆.',
  ].join('\n')));
  assert.equal(report.failures.length, 3);
  assert.ok(report.failures.every((f) => f.startsWith('§5:')), report.failures.join('\n'));
});

test('check-jany-enesai: an unknown setting column fails instead of going unchecked', () => {
  const report = checkDocument(doc([
    '| Cyrillic | Jany-Enesai | Jany-Enesaí |',
    '| :--- | :--- | :--- |',
    '| кол | 𐰴𐰆𐰞 | 𐰴𐰆𐰞 |',
  ].join('\n')));
  assert.deepEqual(report.failures, ['§5: comparison column "Jany-Enesaí" is not a known setting (add it to SETTING_LABELS or NOTE_COLUMNS)']);
});
