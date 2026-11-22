// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// The whitepaper moved to /papers/jany-latyn/. On the hosted site static/_redirects
// answers first with a 301, which keeps a #section in the old link; this page is
// the fallback wherever that file is not read (vite preview, other static hosts).
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = () => {
  redirect(308, '/papers/jany-latyn/');
};
