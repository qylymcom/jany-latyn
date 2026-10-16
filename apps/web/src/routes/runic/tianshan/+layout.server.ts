// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { tianshanData } from '$lib/server/tianshan';
import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load: LayoutServerLoad = () => ({ ts: tianshanData() });
