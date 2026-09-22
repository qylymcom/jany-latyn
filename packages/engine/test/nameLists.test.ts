// SPDX-License-Identifier: MIT
/**
 * The proper-name and signage list samples (§9.6 order, §13.6 capitalization).
 *
 * These files are one entry per line and exist to be sorted, so the checks here
 * are about list shape and about the collation and round-trip behavior the
 * lists were built to expose. Like samples.test.ts this reads apps/web through
 * the filesystem, which is a file read and not an import (boundary.test.ts).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { cyrToJany, janyToCyr, janyToFallback } from '../src/convert.js';
import { compare, compareCyrillic } from '../src/collate.js';
import { caseModeFor, upperStr } from '../src/casing.js';

const SAMPLE_DIR = new URL('../../../../apps/web/src/lib/sample-texts/', import.meta.url);
const LIST_FILES = ['names-places.txt', 'names-people.txt', 'names-streets.txt', 'signs.txt'];
const skip = !existsSync(SAMPLE_DIR) && 'apps/web not present';

const entriesOf = (file: string) =>
  readFileSync(new URL(file, SAMPLE_DIR), 'utf8').trim().split('\n');

test('list samples: one entry per line, no blank or padded lines', { skip }, () => {
  for (const file of LIST_FILES) {
    const lines = entriesOf(file);
    assert.ok(lines.length >= 10, `${file} should carry at least 10 entries`);
    for (const line of lines) {
      assert.equal(line, line.trim(), `${file}: "${line}" has stray whitespace`);
      assert.notEqual(line, '', `${file} should have no blank lines`);
    }
  }
});

test('list samples: both orders are total, so sorting is deterministic', { skip }, () => {
  const configs = [{}, { yGrapheme: 'dotless-i', uvularK: 'q', uvularG: 'ğ' } as const];
  for (const file of LIST_FILES) {
    const lines = entriesOf(file);
    const cyr = [...lines].sort(compareCyrillic);
    assert.deepEqual([...lines].reverse().sort(compareCyrillic), cyr, `${file}: Cyrillic order not total`);
    for (const opts of configs) {
      const latin = lines.map((l) => cyrToJany(l, opts));
      const sorted = [...latin].sort((a, b) => compare(a, b, opts));
      assert.deepEqual([...latin].reverse().sort((a, b) => compare(a, b, opts)), sorted,
        `${file}: Latin order not total for ${JSON.stringify(opts)}`);
    }
  }
});

test('§9.6 iotation moves an entry to a different letter of the alphabet', { skip }, () => {
  // Екатеринбург leaves the E section and lands in the Í section: the whole
  // word relocates, which no single-letter anchor in the tailoring predicts.
  assert.equal(cyrToJany('Екатеринбург'), 'Íekaterinburg');
  assert.ok(compare('Íekaterinburg', 'Emgek') > 0);   // after every E word
  assert.ok(compare('Íekaterinburg', 'Ilim') > 0);    // after every I word
  assert.ok(compare('Íekaterinburg', 'Jakyp') < 0);   // and before J
});

test('§9.6 ö is its own letter, so Karaköl follows every Karako- entry', { skip }, () => {
  assert.ok(compare('Karakol', 'Karaköl') < 0);
  // q mode separates the pair in two positions rather than one (§6).
  const q = { uvularK: 'q', uvularG: 'ğ' } as const;
  assert.equal(cyrToJany('Каракол', q), 'Qaraqol');
  assert.equal(cyrToJany('Каракөл', q), 'Qaraköl');
});

test('§7 the dotless configuration opens Ысык-Көл on a capital read as dotted i', { skip }, () => {
  const dotless = { yGrapheme: 'dotless-i', uvularK: 'q', uvularG: 'ğ', glideGrapheme: 'y' } as const;
  assert.equal(cyrToJany('Ысык-Көл', dotless), 'Isıq-Köl');
});

test('§9.6 ç anchors to c, so Ч entries re-section rather than shift', { skip }, () => {
  assert.equal(cyrToJany('Чычкан'), 'Çyçkan');
  assert.ok(compare('Çyçkan', 'Dan') < 0);      // third letter of the Latin alphabet
  assert.ok(compareCyrillic('Чычкан', 'Шымкент') < 0);   // twenty-eighth of the Cyrillic one
  assert.ok(compareCyrillic('Чычкан', 'Ысык-Көл') < 0);
});

test('§9.2 the sh loss is unconditional, not a digraph-mode artifact', { skip }, () => {
  // No option is set anywhere: с+х produces s+h, which reverse reads as ш.
  assert.equal(cyrToJany('Исхак'), 'Ishak');
  assert.equal(janyToCyr('Ishak'), 'Ишак');
  assert.equal(cyrToJany('Асхат'), 'Ashat');
  assert.equal(janyToCyr('Ashat'), 'Ашат');
});

test('§9.2 the restoration list can take Исхак but not Асхат', { skip }, () => {
  // ishak is listed: its competitor, the Russian loan ишак, is not native.
  assert.equal(janyToCyr('Ishak', { restoreLoans: true }), 'Исхак');
  // Асхат cannot be added. In digraph input `ashat` is also native ашат, and
  // §9.1 ranks native first, so an entry would invert the priority rule.
  assert.equal(cyrToJany('ашат', { sibilants: 'digraph' }), 'ashat');
  assert.equal(cyrToJany('Асхат', { sibilants: 'digraph' }), 'Ashat');
  assert.equal(janyToCyr('ashat', { restoreLoans: true }), 'ашат');
});

test('§12.4 CTA signage resolves into other Kyrgyz words for an untrained reader', { skip }, () => {
  // The forms §12.4 cites, generated the way the testbed generates them: the
  // source is uppercased with the configuration's case table, then converted.
  const cta = {
    yGrapheme: 'dotless-i', glideGrapheme: 'y', uvularK: 'q',
    uvularG: 'ğ', affricate: 'c', velarNasal: 'tilde-n',
  } as const;
  const caps = (word: string, opts: Parameters<typeof cyrToJany>[1]) =>
    cyrToJany(upperStr(word, caseModeFor(opts)), opts);

  assert.equal(caps('жарыя', cta), 'CARIYA');     // sounded out with the c a reader knows
  assert.equal(caps('чыгуу', cta), 'ÇIĞUU');
  assert.equal(caps('кирүү', cta), 'KİRÜÜ');      // the dotless case table on a real word

  // The casual register strips the cedilla, and the dotless ı folds to i, so the
  // exit sign reaches CIGUU where canonical spelling reaches CYGUU (§7, §10).
  assert.equal(janyToFallback(caps('чыгуу', cta)), 'CIGUU');
  assert.equal(janyToFallback(caps('чыгуу', {})), 'CYGUU');

  // Canonical keeps all three legible to a Cyrillic-literate reader.
  assert.equal(caps('жарыя', {}), 'JARYÍA');
  assert.equal(caps('чыгуу', {}), 'ÇYGUU');
  assert.equal(caps('кирүү', {}), 'KIRÜÜ');
});
