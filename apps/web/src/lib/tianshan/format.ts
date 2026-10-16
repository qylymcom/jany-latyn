// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Small helpers shared by the /runic/tianshan/ pages.
import { cyrToJany } from 'jany-latyn/convert';
import type { Inscription, Names, Source } from '$corpus/scripts/tianshan/db.mjs';
import type { Locale } from '$lib/i18n/types.js';

export const BASE = '/runic/tianshan/';
export const inscriptionHref = (id: string) => `${BASE}inscriptions/${id}/`;
export const sourceHref = (id: string) => `${BASE}sources/#${id}`;
export const glyphHref = (id: string) => `${BASE}signs/#glyph-${id}`;

/** A count in words: the one or other form, filled with n. */
export const count = (forms: { one: string; other: string }, n: number) => fill(n === 1 ? forms.one : forms.other, { n });

/** Fills {name} placeholders. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** The years an inscription's 'found' claims start with ("1896", "5 May 1898", "2008 (two …)"), as in TIANSHAN-CORPUS.md. */
export function foundYears(ins: Inscription): string[] {
  const years = ins.claims
    .filter((c) => c.field === 'found')
    .map((c) => c.value.match(/^(?:\d{1,2} \p{L}+ )?(1[89]\d\d|20\d\d)\b/u)?.[1])
    .filter((y): y is string => !!y);
  return [...new Set(years)];
}

/** A one-line citation: authors (year). Title. Container, volume, pages, place, publisher. */
export function citation(s: Source): string {
  const who = s.authors?.length ? `${s.authors.join(', ')}${s.year ? ` (${s.year})` : ''}. ` : s.year ? `(${s.year}) ` : '';
  const where = [
    s.container, s.volume && `vol. ${s.volume}`, s.issue && `no. ${s.issue}`, s.pages && `pp. ${s.pages}`,
    s.place, s.publisher, s.isbn && `ISBN ${s.isbn}`, s.doi && `doi:${s.doi}`,
  ].filter(Boolean).join(', ');
  return `${who}${s.title}${where ? `. ${where}` : ''}.`;
}

/** Which group of the sources page a source belongs to. */
export function sourceGroup(s: Source): 'publications' | 'web' | 'places' | 'brief' {
  if (s.type === 'brief') return 'brief';
  if (s.about?.includes('places')) return 'places';
  return s.type === 'web' ? 'web' : 'publications';
}

/** A name in the interface language where the database has one (Kyrgyz also in Jany-Latyn), else in English. */
export function localName(names: Names, locale: Locale): string {
  if (locale === 'ky-jany') return names.ky ? cyrToJany(names.ky) : names.en;
  return (locale === 'ky' || locale === 'ru' || locale === 'tr' ? names[locale] : undefined) ?? names.en;
}
