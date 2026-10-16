#!/usr/bin/env node
// SPDX-License-Identifier: MIT
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { cyrToJany, janyToFallback, janyToCyr } from './convert.js';
import {
  cyrillicToRunes, runesToJanyLatyn, runesToCyrillic, readInscription, detectSpelling,
  presetOptions, RUNE_OPTION_VALUES, type RuneOptions, type ReaderTarget,
} from './runes/index.js';

const DIRECTIONS: Readonly<Record<string, (s: string) => string>> = {
  jany: cyrToJany,
  fallback: (s) => janyToFallback(cyrToJany(s)),
  cyrillic: janyToCyr,
};

const READER_TARGETS: readonly ReaderTarget[] = ['scholarly', 'cta', 'jany-latyn', 'cyrillic'];

/** --rune-preset seeds the options; each --rune-opt key=value then overrides one. */
function runeOptions(preset: string | undefined, opts: string[] | undefined): Partial<RuneOptions> {
  const o: Partial<RuneOptions> = preset ? presetOptions(preset) : {};
  for (const kv of opts ?? []) {
    const [key, value] = kv.split('=');
    const allowed = (RUNE_OPTION_VALUES as Record<string, readonly string[]>)[key];
    if (!allowed) throw new Error(`unknown rune option "${key}" (expected: ${Object.keys(RUNE_OPTION_VALUES).join('|')})`);
    if (!allowed.includes(value)) throw new Error(`rune option ${key} takes ${allowed.join('|')}, not "${value}"`);
    (o as Record<string, string>)[key] = value;
  }
  return o;
}

function main(argv: string[]): string {
  const { values, positionals } = parseArgs({
    args: argv,
    options: {
      to: { type: 'string' },
      from: { type: 'string' },
      'rune-preset': { type: 'string' },
      'rune-opt': { type: 'string', multiple: true },
      target: { type: 'string', default: 'scholarly' },
      'restore-loans': { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });
  const input = positionals.length > 0 ? positionals.join(' ') : readFileSync(0, 'utf8');

  if (values.from !== undefined) {
    if (values.from !== 'runes') throw new Error(`unknown source "${values.from}" (expected: runes)`);
    // RUNES-SPEC §5: never run modern reverse conversion on the stones' spelling.
    if (detectSpelling(input) === 'old') {
      throw new Error('the input is in old (inscription) spelling and cannot be converted back; use --to read');
    }
    const to = values.to ?? 'cyrillic';
    if (to === 'jany') return runesToJanyLatyn(input);
    if (to === 'cyrillic') return runesToCyrillic(input, { restoreLoans: values['restore-loans'] });
    throw new Error(`unknown direction "${to}" from runes (expected: jany|cyrillic)`);
  }

  const to = values.to ?? 'jany';
  if (to === 'runes') return cyrillicToRunes(input, runeOptions(values['rune-preset'], values['rune-opt']));
  if (to === 'read') {
    const target = values.target as ReaderTarget;
    if (!READER_TARGETS.includes(target)) throw new Error(`unknown reader target "${target}" (expected: ${READER_TARGETS.join('|')})`);
    return readInscription(input, target);
  }
  if (to === 'detect') return detectSpelling(input);
  const convert = DIRECTIONS[to];
  if (!convert) {
    throw new Error(`unknown direction "${to}" (expected: jany|fallback|cyrillic|runes|read|detect)`);
  }
  return convert(input);
}

try {
  const out = main(process.argv.slice(2));
  process.stdout.write(out.endsWith('\n') ? out : out + '\n');
} catch (err) {
  process.stderr.write((err as Error).message + '\n');
  process.exit(1);
}
