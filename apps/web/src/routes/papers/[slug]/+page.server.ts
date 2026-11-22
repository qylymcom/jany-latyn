// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { error } from '@sveltejs/kit';
import { PAPER_SLUGS, loadPaper } from '$lib/server/papers';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => PAPER_SLUGS.map((slug) => ({ slug }));

export const load: PageServerLoad = async ({ params }) => {
  const paper = await loadPaper(params.slug);
  if (!paper) error(404, 'Not found');
  return paper;
};
