// SPDX-License-Identifier: MIT
import { mkdirSync, writeFileSync } from 'node:fs';
import { LETTER_MAP, FALLBACK } from '../src/alphabet.js';
import { cyrToJany } from '../src/convert.js';

// Example words for the letters that need them; others get an empty cell.
// The jany form is always derived through the converter, never hand-written.
const EXAMPLES: Readonly<Record<string, { cyr: string; gloss: string }>> = {
  'ө': { cyr: 'көл', gloss: 'lake' },
  'ү': { cyr: 'күз', gloss: 'autumn' },
  'ң': { cyr: 'жаңы', gloss: 'new' },
  'ч': { cyr: 'чай', gloss: 'tea' },
  'ш': { cyr: 'шаар', gloss: 'city' },
  'ы': { cyr: 'кыргыз', gloss: 'Kyrgyz' },
  'й': { cyr: 'ай', gloss: 'moon' },
  'ё': { cyr: 'ёлка', gloss: 'loan' },
  'ю': { cyr: 'июль', gloss: 'loan' },
  'я': { cyr: 'яма', gloss: 'loan' },
  'х': { cyr: 'рахмат', gloss: 'thanks' },
  'щ': { cyr: 'ящик', gloss: 'loan, merged with ş' },
  'ь': { cyr: 'семья', gloss: 'absorbed by í (semía)' },
  'ъ': { cyr: 'объект', gloss: 'absorbed by í (obíekt)' },
};

// Doubled-vowel reference rows: cyr pair, example word, gloss. The jany
// pair and the example's jany form are derived through the converter.
const LONG_ROWS: ReadonlyArray<readonly [string, string, string]> = [
  ['Аа/аа', 'талаалар', 'valleys'],
  ['Ээ/ээ', 'ээги', 'his jaw/chin (Manas), керээз (testament)'],
  ['Ии/ии', '', '—'],
  ['Оо/оо', 'зоолор', 'cliffs'],
  ['Уу/уу', 'кууш', 'башы кууш (Manas portrait)'],
  ['Ыы/ыы', '', '—'],
  ['Өө/өө', 'жөлөөр', 'will lean on'],
  ['Үү/үү', 'жүгүрүү', 'running'],
];

const FALLBACK_MAP: ReadonlyMap<string, string> = new Map(FALLBACK);

const LOAN_LETTERS = new Set(['в', 'ф', 'ц', 'щ', 'ъ', 'ь', 'я', 'ё', 'ю']);

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function makeChart(): string {
  const rowH = 28;
  const colX = { cyr: 30, jany: 120, fb: 230, ex: 330 };
  const core = LETTER_MAP.filter(([cyr]) => !LOAN_LETTERS.has(cyr));
  const loan = LETTER_MAP.filter(([cyr]) => LOAN_LETTERS.has(cyr));
  const totalRows = LETTER_MAP.length + LONG_ROWS.length + 7; // + title/header/section/note/gap rows
  const height = 70 + totalRows * rowH;
  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 ${height}" font-family="Georgia, 'Times New Roman', serif" font-size="18">`);
  parts.push(`<text x="30" y="34" font-size="22" font-weight="bold">jany-latyn — alphabet reference</text>`);
  let y = 70;
  parts.push(`<text x="${colX.cyr}" y="${y}" font-weight="bold">Cyrillic</text>` +
    `<text x="${colX.jany}" y="${y}" font-weight="bold">jany-latyn</text>` +
    `<text x="${colX.fb}" y="${y}" font-weight="bold">ASCII</text>` +
    `<text x="${colX.ex}" y="${y}" font-weight="bold">example</text>`);
  y += rowH;
  const renderRow = (cyr: string, jany: string) => {
    const isAbsorbed = jany === '';
    const janyDisplay = isAbsorbed ? '—' : titleCase(jany) + '/' + jany;
    const fb = isAbsorbed ? '—' : (FALLBACK_MAP.get(jany) ?? jany);
    const ex = EXAMPLES[cyr];
    const exText = ex ? `${cyrToJany(ex.cyr)} (${ex.cyr} — ${ex.gloss})` : '';
    parts.push([
      `<text x="${colX.cyr}" y="${y}">${esc(cyr.toUpperCase() + '/' + cyr)}</text>`,
      `<text x="${colX.jany}" y="${y}">${esc(janyDisplay)}</text>`,
      `<text x="${colX.fb}" y="${y}">${esc(fb)}</text>`,
      ...(exText ? [`<text x="${colX.ex}" y="${y}" font-size="14">${esc(exText)}</text>`] : []),
    ].join(''));
    y += rowH;
  };
  parts.push(`<text x="30" y="${y}" font-weight="bold">Core alphabet</text>`);
  y += rowH;
  for (const [cyr, jany] of core) renderRow(cyr, jany);
  parts.push(`<text x="30" y="${y}" font-weight="bold">Loan letters (Russian loans only)</text>`);
  y += rowH;
  for (const [cyr, jany] of loan) renderRow(cyr, jany);
  parts.push(`<text x="30" y="${y}" font-size="14">ж in Russian loans is pronounced [ʒ] (zh-like) but always written j</text>`);
  y += rowH;
  y += rowH;
  parts.push(`<text x="30" y="${y}" font-weight="bold">Long vowels (doubled letter)</text>`);
  y += rowH;
  for (const [cyrPair, word, gloss] of LONG_ROWS) {
    const janyPair = cyrToJany(cyrPair.split('/')[1]);
    const fb = [...janyPair].map((g) => FALLBACK_MAP.get(g) ?? g).join('');
    const exText = word ? `${cyrToJany(word)} (${word} — ${gloss})` : '—';
    parts.push([
      `<text x="${colX.cyr}" y="${y}">${esc(cyrPair)}</text>`,
      `<text x="${colX.jany}" y="${y}">${esc(janyPair)}</text>`,
      `<text x="${colX.fb}" y="${y}">${esc(fb)}</text>`,
      ...(exText ? [`<text x="${colX.ex}" y="${y}" font-size="14">${esc(exText)}</text>`] : []),
    ].join(''));
    y += rowH;
  }
  parts.push('</svg>');
  return parts.join('\n') + '\n';
}

// CLI entry: node dist/scripts/make-chart.js writes charts/alphabet.svg
if (process.argv[1] && process.argv[1].endsWith('make-chart.js')) {
  mkdirSync('charts', { recursive: true });
  writeFileSync('charts/alphabet.svg', makeChart());
  console.log('wrote charts/alphabet.svg');
}
