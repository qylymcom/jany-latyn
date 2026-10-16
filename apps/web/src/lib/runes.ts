// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Display helpers for rune text (JANY-ENESAI.md §26, RUNES-SPEC.md §2).
import { TIANSHAN_TRANSCRIBED } from 'jany-latyn/runes';

/** The rune font stack, for inline styles. */
export const RUNE_FONT = 'var(--font-runes)';

const RLI = '\u2067'; // RIGHT-TO-LEFT ISOLATE
const PDI = '\u2069'; // POP DIRECTIONAL ISOLATE

/** Each line wrapped in RLI … PDI, so runes keep their order when pasted into left-to-right documents. */
export function forLtrDocuments(text: string): string {
  return text.split('\n').map((line) => (line ? RLI + line + PDI : line)).join('\n');
}

/** A rune word, as a capturing group, for splitting output into words and the text between them. */
export const RUNE_WORD = /([\p{Script=Old_Turkic}̇\u{10CEA}]+)/u;

/**
 * A rune preset's name as the testbed shows it. Eski-Teŋir-Too carries the number of
 * inscriptions its forms are counted from (RUNES-SPEC §6.4); basis is the
 * runic.tianshanBasis string, with {n}.
 */
export function runePresetName(p: { id: string; name: string }, basis: string): string {
  return p.id === 'eski-tenir-too' ? `${p.name} (${basis.replace('{n}', String(TIANSHAN_TRANSCRIBED))})` : p.name;
}
