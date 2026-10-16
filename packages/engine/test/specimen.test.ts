// SPDX-License-Identifier: MIT
/**
 * The specimen page (scripts/make-specimen.ts): the §4 passage, every preset with
 * its status, and a refusal to render with a font file that is not there.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { cyrillicToRunes, RUNE_PRESETS } from '../src/runes/index.js';
import { SPECIMEN_TEXT, specimenHtml } from '../scripts/make-specimen.js';

const golden = JSON.parse(readFileSync(new URL('../../test/fixtures/runes.golden.json', import.meta.url), 'utf8')) as {
  passage: { cyrillic: string };
};

test('specimen: the proposal passage, in every preset, with its status', () => {
  assert.equal(SPECIMEN_TEXT, golden.passage.cyrillic);
  const html = specimenHtml('file:///font.ttf');
  for (const p of RUNE_PRESETS) {
    assert.ok(html.includes(`${p.name} <span>${p.status}</span>`), p.id);
    assert.ok(html.includes(cyrillicToRunes(SPECIMEN_TEXT, p.options)), p.id);
  }
});

test('specimen: a font file that does not exist is refused', () => {
  const script = fileURLToPath(new URL('../scripts/make-specimen.js', import.meta.url));
  const run = spawnSync(process.execPath, [script, '--font', 'file:///no/such/font.ttf'], { encoding: 'utf8' });
  assert.equal(run.status, 2);
  assert.match(run.stderr, /not found/);
});
