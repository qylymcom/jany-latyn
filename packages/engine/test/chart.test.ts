// SPDX-License-Identifier: MIT
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeChart } from '../scripts/make-chart.js';
import { LETTER_MAP } from '../src/alphabet.js';

test('chart is an SVG document containing every letter', () => {
  const svg = makeChart();
  assert.ok(svg.startsWith('<svg'));
  assert.ok(svg.trimEnd().endsWith('</svg>'));
  for (const [cyr] of LETTER_MAP) {
    assert.ok(svg.includes(`/${cyr}<`), `missing row for ${cyr}`);
  }
});

test('chart has a long-vowels section with doubled forms', () => {
  const svg = makeChart();
  assert.ok(svg.includes('Long vowels'));
  assert.ok(svg.includes('>öö<'));
  assert.ok(svg.includes('>üü<'));
});

test('chart contains no combining marks and no q', () => {
  const svg = makeChart();
  assert.ok(!svg.includes('̄'));
  assert.ok(!svg.includes('>q<'));
});

test('chart examples are converter-derived and correctly transliterated', () => {
  const svg = makeChart();
  assert.ok(svg.includes('>jügürüü (жүгүрүү — running)<'));
  assert.ok(svg.includes('>iíul (июль — loan)<'));
  assert.ok(svg.includes('>Ç/ç<'));
  assert.ok(svg.includes('>Ş/ş<'));
  assert.ok(svg.includes('>çaí (чай — tea)<'));
  assert.ok(!svg.includes('ыык'));
  assert.ok(svg.includes('>yy<'));
  assert.ok(svg.includes('>küz (күз — autumn)<'));
  assert.ok(!svg.includes('jügüruu'));
  assert.ok(!svg.includes('сүз — word'));
});

test('chart splits core and loan letters, and has no modifier prime', () => {
  const svg = makeChart();
  assert.ok(svg.includes('>Core'));
  assert.ok(svg.includes('>Loan'));
  assert.ok(svg.indexOf('>Ю/ю<') > svg.indexOf('>Loan'));
  assert.ok(!svg.includes('ʹ'));
});
