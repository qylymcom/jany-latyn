// SPDX-License-Identifier: MIT
/**
 * Package boundary. Nothing under packages/engine/ may import from outside it,
 * so the engine can be split into a standalone repository without rewiring.
 * Bare specifiers are limited to Node built-ins (`node:*`), which also keeps
 * the zero-runtime-dependency invariant honest.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Tests run from packages/engine/dist/test/, so the package root is two levels up.
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SCANNED = ['src', 'scripts', 'test'];

function tsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === 'fixtures' ? [] : tsFiles(path);
    return path.endsWith('.ts') ? [path] : [];
  });
}

// Static imports/re-exports start a line (possibly spanning several); dynamic import() may appear anywhere.
const SPECIFIER = /^\s*(?:import|export)\b[^'";]*?\bfrom\s*['"]([^'"]+)['"]|^\s*import\s*['"]([^'"]+)['"]|\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/gm;

test('boundary: engine sources import only siblings and node: built-ins', () => {
  const violations: string[] = [];
  for (const file of SCANNED.flatMap(d => tsFiles(join(ROOT, d)))) {
    const source = readFileSync(file, 'utf8');
    for (const m of source.matchAll(SPECIFIER)) {
      const spec = m[1] ?? m[2] ?? m[3];
      const where = relative(ROOT, file);
      if (spec.startsWith('node:')) continue;
      if (!spec.startsWith('.')) {
        violations.push(`${where}: bare import '${spec}'`);
        continue;
      }
      const target = resolve(dirname(file), spec);
      if (target !== ROOT.replace(/[\\/]$/, '') && !target.startsWith(ROOT.endsWith(sep) ? ROOT : ROOT + sep)) {
        violations.push(`${where}: '${spec}' escapes packages/engine/`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test('boundary: engine package.json declares no runtime dependencies', () => {
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
    assert.equal(Object.keys(pkg[field] ?? {}).length, 0, `${field} must be empty`);
  }
});
