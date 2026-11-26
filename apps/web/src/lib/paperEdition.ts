// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Which edition of a paper goes with the interface language: the translation in that
// language, Kyrgyzça falling back to the Cyrillic Kyrgyz edition, otherwise the original.
import type { EditionLink } from '$lib/server/papers';
import type { Locale } from '$lib/i18n/types.js';

const PREFERENCE: Record<Locale, readonly string[]> = {
  'ky-jany': ['ky-jany', 'ky'],
  ky: ['ky'],
  ru: ['ru'],
  en: ['en'],
  tr: ['tr'],
  zh: ['zh']
};

export function editionForLocale(editions: readonly EditionLink[], locale: Locale): EditionLink | undefined {
  for (const lang of PREFERENCE[locale]) {
    const match = editions.find((e) => e.lang === lang);
    if (match) return match;
  }
  // The original is listed first.
  return editions[0];
}
