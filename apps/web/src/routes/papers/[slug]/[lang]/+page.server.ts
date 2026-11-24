// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// A translation of a paper, at /papers/<slug>/<lang>/. The original stays at /papers/<slug>/.
import { error } from '@sveltejs/kit';
import { PAPER_TRANSLATIONS, loadPaper } from '$lib/server/papers';
import type { EntryGenerator, PageServerLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => PAPER_TRANSLATIONS.map(({ slug, lang }) => ({ slug, lang }));

export const load: PageServerLoad = async ({ params }) => {
  const paper = await loadPaper(params.slug, params.lang);
  if (!paper) error(404, 'Not found');
  return paper;
};
