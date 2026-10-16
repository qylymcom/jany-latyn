// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// The proposal's figures, served from docs/jany-enesai/ next to the rendered page.
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { error } from '@sveltejs/kit';
import { findRepoFile } from '$lib/server/markdown';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;
export const trailingSlash = 'never';

function figures(): string[] {
  const md = readFileSync(findRepoFile('docs/jany-enesai/JANY-ENESAI.md'), 'utf-8');
  return [...md.matchAll(/!\[[^\]]*\]\(([\w.-]+\.png)\)/g)].map((m) => m[1]);
}

export const entries: EntryGenerator = () => figures().map((name) => ({ name }));

export const GET: RequestHandler = async ({ params }) => {
  if (!figures().includes(params.name)) error(404, 'Not found');
  const bytes = await readFile(findRepoFile(`docs/jany-enesai/${params.name}`));
  return new Response(bytes, { headers: { 'content-type': 'image/png' } });
};
