// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// The whitepaper's reading font. The selector sits in the sticky header (+layout.svelte)
// so it stays reachable anywhere in a long document, while the text it styles lives in
// the page — so the choice is module state rather than a component's, and it is
// remembered between visits the way the locale is.
import { FONTS, SERIF_FONT } from './fonts.js';

const STORAGE_KEY = 'jany_reading_font';

function getInitialFont(): string {
  if (typeof window === 'undefined') return SERIF_FONT;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && FONTS.some((f) => f.stack === saved)) return saved;
  } catch {
    // Ignore restricted storage contexts
  }
  return SERIF_FONT;
}

let current = $state(getInitialFont());

export const readingFont = {
  get stack(): string {
    return current;
  },
  set stack(val: string) {
    current = val;
    try {
      localStorage.setItem(STORAGE_KEY, val);
    } catch {
      // Ignore restricted storage contexts
    }
  }
};
