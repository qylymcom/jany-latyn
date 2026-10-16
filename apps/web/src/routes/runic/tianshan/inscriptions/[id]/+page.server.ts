// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { error } from '@sveltejs/kit';
import { tianshanData } from '$lib/server/tianshan';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => tianshanData().inscriptions.map((i) => ({ id: i.id }));

export const load: PageServerLoad = ({ params }) => {
  if (!tianshanData().inscriptions.some((i) => i.id === params.id)) error(404, 'No such inscription');
  return { id: params.id };
};
