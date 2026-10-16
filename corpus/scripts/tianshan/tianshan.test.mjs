// SPDX-License-Identifier: MIT
/**
 * The Tian-Shan inscription database (corpus/tianshan) and the engine's
 * Eski-Teŋir-Too forms table generated from it. The transcription tests use
 * made-up lines, not inscription text. Run from the repository root:
 * npm run test:corpus
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readInscription, signValue, rune, RUNE_NAMES } from 'jany-latyn/runes';
import {
  loadDatabase, checkDatabase, parseTranscription, attestation, attestedForms, formsModule,
} from './db.mjs';

const DIR = fileURLToPath(new URL('../../tianshan/', import.meta.url));
const db = loadDatabase(DIR);
const HEAD = '@image alimov-2014 p. 1\n@read-from tracing\n';

test('the database checks', () => {
  assert.deepEqual(checkDatabase(db), []);
});

test('TIANSHAN-CORPUS.md and the engine forms table are what the database generates', () => {
  const run = spawnSync(process.execPath, [fileURLToPath(new URL('build.mjs', import.meta.url)), '--check'], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
});

test('every Unicode glyph reads as its grapheme, and every character is one glyph', () => {
  const glyphs = db.graphemes.flatMap((g) => g.glyphs.filter((gl) => gl.unicode).map((gl) => [g, gl]));
  assert.equal(glyphs.length, RUNE_NAMES.length);
  for (const [g, gl] of glyphs) assert.equal(signValue(rune(gl.unicode)), g.value, gl.id);
});

test('transcription: glyphs, graphemes, dividers, legibility and mirroring', () => {
  const t = parseTranscription(`${HEAD}1: b1.1 o : t1.1 ~a.2 n1.1? ... _ q . y2.2\n`, db.graphemes);
  assert.deepEqual(t.errors, []);
  assert.equal(t.lines.length, 1);
  const [line] = t.lines;
  assert.equal(line.runes, '𐰉𐰆⁚𐱃𐰁𐰣... 𐰴⸱𐰙');
  assert.equal(readInscription(line.runes), 'b¹o t¹an¹... q⸱y²');
  assert.deepEqual(line.signs.map((s) => [s.glyph, s.formKnown, s.unclear, s.mirrored]), [
    ['b1.1', true, false, false], ['o.1', false, false, false], ['t1.1', true, false, false],
    ['a.2', true, false, true], ['n1.1', true, true, false], ['q.1', false, false, false], ['y2.2', true, false, false],
  ]);
});

test('transcription: errors name the line', () => {
  const t = parseTranscription('@image x\n@read-from memory\n1: b1.9 zz\nno colon here\n@colour red\n', db.graphemes);
  assert.deepEqual(t.errors, [
    'line 2: @read-from must be one of tracing, photograph, squeeze, publication',
    'line 3: unknown sign "b1.9"',
    'line 3: unknown sign "zz"',
    'line 4: expected "<label>: <signs>"',
    'line 5: unknown key @colour',
  ]);
});

test('a transcription of an unknown inscription, or citing an unknown source, does not check', () => {
  const bad = { ...db, transcriptions: { 'no-such-stone': '@image nowhere\n@read-from tracing\n1: m.1\n' } };
  const errors = checkDatabase(bad);
  assert.ok(errors.includes('transcription no-such-stone: no inscription with this id'), errors.join('\n'));
  assert.ok(errors.includes('transcription no-such-stone: unknown source nowhere'), errors.join('\n'));
});

test('attested forms: most inscriptions first, then most signs; shapes not shown do not count', () => {
  const fake = {
    ...db,
    transcriptions: {
      'talas-1': `${HEAD}1: a.2 a.2 a.1 m\n`,
      'talas-2': `${HEAD}1: a.1 g1.2\n`,
      'talas-3': `${HEAD}1: a.2 g1.1 : g1.1\n`,
    },
  };
  assert.deepEqual(checkDatabase(fake), []);
  const { forms, basis } = attestedForms(fake);
  assert.equal(forms.a, 'YENISEI A');  // two inscriptions each; 𐰁 has three signs to 𐰀's two
  assert.deepEqual(basis.a, { inscriptions: 2, signs: 3 });
  assert.equal(forms['g/back'], 'ORKHON AG');  // one inscription each; 𐰍 has two signs
  assert.equal(forms.m, null);  // m written without its shape
  assert.equal(forms['k/back'], null);
  assert.equal(attestation(fake).graphemes.m.signs, 1);
  const module = formsModule(fake);
  assert.match(module, /TIANSHAN_TRANSCRIBED = 3;/);
  assert.match(module, /'a': 'YENISEI A',/);
  assert.match(module, /'m': null,/);
});
