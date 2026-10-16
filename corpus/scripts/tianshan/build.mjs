#!/usr/bin/env node
// SPDX-License-Identifier: MIT
/**
 * Checks the Tian-Shan database and writes what is generated from it:
 * corpus/tianshan/TIANSHAN-CORPUS.md and the engine's attested-forms table,
 * packages/engine/src/runes/tianshanForms.ts. With --check, writes nothing and
 * fails if either file is out of date. Needs the engine built (npm run build).
 * Usage: node corpus/scripts/tianshan/build.mjs [--check]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readInscription } from 'jany-latyn/runes';
import { loadDatabase, checkDatabase, parseAll, formsModule } from './db.mjs';
import { corpusMarkdown } from './markdown.mjs';

const root = new URL('../../../', import.meta.url);
const DIR = fileURLToPath(new URL('corpus/tianshan/', root));
const OUTPUTS = {
  corpus: fileURLToPath(new URL('corpus/tianshan/TIANSHAN-CORPUS.md', root)),
  forms: fileURLToPath(new URL('packages/engine/src/runes/tianshanForms.ts', root)),
};

const db = loadDatabase(DIR);
const errors = checkDatabase(db);
if (errors.length) {
  for (const e of errors) console.error(e);
  process.exit(1);
}
const parsed = parseAll(db);
const want = { corpus: corpusMarkdown(db, readInscription), forms: formsModule(db, parsed) };

if (process.argv.includes('--check')) {
  const stale = Object.keys(want).filter((k) => !existsSync(OUTPUTS[k]) || readFileSync(OUTPUTS[k], 'utf8') !== want[k]);
  for (const k of stale) console.error(`${OUTPUTS[k]} is out of date; run npm run build:tianshan`);
  process.exit(stale.length ? 1 : 0);
}
for (const k of Object.keys(want)) writeFileSync(OUTPUTS[k], want[k]);
const n = Object.keys(parsed).length;
console.log(`checked ${db.inscriptions.inscriptions.length} inscriptions, ${db.sources.length} sources; ${n} transcribed`);
