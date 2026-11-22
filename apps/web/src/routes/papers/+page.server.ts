// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { loadPaperIndex } from '$lib/server/papers';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => ({ papers: await loadPaperIndex() });
