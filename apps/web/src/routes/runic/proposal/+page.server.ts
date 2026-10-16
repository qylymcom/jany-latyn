// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { readFile } from 'node:fs/promises';
import { findRepoFile, renderMarkdown } from '$lib/server/markdown';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () =>
  renderMarkdown(await readFile(findRepoFile('docs/jany-enesai/JANY-ENESAI.md'), 'utf-8'), {
    imageBase: '/runic/proposal/images/',
  });
