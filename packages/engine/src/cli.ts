#!/usr/bin/env node
// SPDX-License-Identifier: MIT
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { cyrToJany, janyToFallback, janyToCyr } from './convert.js';

const DIRECTIONS: Readonly<Record<string, (s: string) => string>> = {
  jany: cyrToJany,
  fallback: (s) => janyToFallback(cyrToJany(s)),
  cyrillic: janyToCyr,
};

function main(argv: string[]): string {
  const { values, positionals } = parseArgs({
    args: argv,
    options: { to: { type: 'string', default: 'jany' } },
    allowPositionals: true,
  });
  const convert = DIRECTIONS[values.to as string];
  if (!convert) {
    throw new Error(`unknown direction "${values.to}" (expected: jany|fallback|cyrillic)`);
  }
  const input = positionals.length > 0 ? positionals.join(' ') : readFileSync(0, 'utf8');
  return convert(input);
}

try {
  const out = main(process.argv.slice(2));
  process.stdout.write(out.endsWith('\n') ? out : out + '\n');
} catch (err) {
  process.stderr.write((err as Error).message + '\n');
  process.exit(1);
}
