// SPDX-License-Identifier: MIT
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { cyrToJany } from '../src/convert.js';

// The sample library belongs to the web testbed (apps/web). Tests run from
// packages/engine/dist/test/, so the repository root is four levels up. The
// test skips when the engine is used outside this repository.
const SAMPLE_DIR = new URL('../../../../apps/web/src/lib/sample-texts/', import.meta.url);

test('sample texts: all files exist, are non-empty, and transliterate cleanly', { skip: !existsSync(SAMPLE_DIR) && 'apps/web not present' }, () => {
  const files = readdirSync(SAMPLE_DIR).filter(f => f.endsWith('.txt'));
  assert.ok(files.length >= 6, `Expected at least 6 sample texts, found ${files.length}`);

  for (const file of files) {
    const content = readFileSync(new URL(file, SAMPLE_DIR), 'utf8').trim();
    assert.ok(content.length > 20, `Sample file ${file} should have substantial content`);

    // Transliterate with Author's baseline
    const baseline = cyrToJany(content);
    assert.ok(baseline.length > 0, `Baseline transliteration of ${file} failed`);

    // Transliterate with CTA options
    const cta = cyrToJany(content, {
      vowels: 'latin-umlaut',
      yGrapheme: 'dotless-i',
      glideGrapheme: 'y',
      sibilants: 'cedilla',
      uvularK: 'q'
    });
    assert.ok(cta.length > 0, `CTA transliteration of ${file} failed`);
  }
});
