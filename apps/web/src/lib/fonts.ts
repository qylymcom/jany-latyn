// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
// Fonts verified to cover canonical Jany-latyn (ö ü ŋ Ö Ü Ŋ) and fallback/variants; other systems degrade
// per-glyph down each stack, and fontCovers() greys out bad options.
export interface FontEntry {
  label: string;
  stack: string;
  probe: string; // first family, for the coverage probe
}

export const FONTS: readonly FontEntry[] = [
  { label: 'Helvetica (default)', stack: 'Helvetica, Menlo, Arial, sans-serif', probe: 'Helvetica' },
  { label: 'Helvetica Neue', stack: "'Helvetica Neue', Helvetica, Arial, sans-serif", probe: 'Helvetica Neue' },
  { label: 'Arial', stack: 'Arial, Helvetica, sans-serif', probe: 'Arial' },
  { label: 'Verdana', stack: 'Verdana, Arial, sans-serif', probe: 'Verdana' },
  { label: 'Tahoma', stack: 'Tahoma, Verdana, sans-serif', probe: 'Tahoma' },
  { label: 'Geneva', stack: 'Geneva, Verdana, sans-serif', probe: 'Geneva' },
  { label: 'Lucida Grande', stack: "'Lucida Grande', Geneva, sans-serif", probe: 'Lucida Grande' },
  { label: 'Microsoft Sans Serif', stack: "'Microsoft Sans Serif', Tahoma, sans-serif", probe: 'Microsoft Sans Serif' },
  { label: 'San Francisco (system)', stack: "-apple-system, 'Helvetica Neue', sans-serif", probe: '-apple-system' },
  { label: 'Georgia', stack: "Georgia, 'Times New Roman', serif", probe: 'Georgia' },
  { label: 'Times New Roman', stack: "'Times New Roman', Times, serif", probe: 'Times New Roman' },
  { label: 'Times', stack: "Times, 'Times New Roman', serif", probe: 'Times' },
  { label: 'Palatino', stack: 'Palatino, Georgia, serif', probe: 'Palatino' },
  { label: 'Baskerville', stack: 'Baskerville, Palatino, serif', probe: 'Baskerville' },
  { label: 'Cochin', stack: 'Cochin, Georgia, serif', probe: 'Cochin' },
  { label: 'Seravek', stack: 'Seravek, Georgia, serif', probe: 'Seravek' },
  { label: 'Marion', stack: 'Marion, Georgia, serif', probe: 'Marion' },
  { label: 'Superclarendon', stack: 'Superclarendon, Rockwell, serif', probe: 'Superclarendon' },
  { label: 'Menlo', stack: 'Menlo, Monaco, monospace', probe: 'Menlo' },
  { label: 'Monaco', stack: 'Monaco, Menlo, monospace', probe: 'Monaco' },
  { label: 'Courier New', stack: "'Courier New', Courier, monospace", probe: 'Courier New' },
  { label: 'American Typewriter', stack: "'American Typewriter', 'Courier New', serif", probe: 'American Typewriter' },
  { label: 'Phosphate', stack: 'Phosphate, Impact, sans-serif', probe: 'Phosphate' },
  { label: 'SignPainter', stack: "SignPainter, 'Brush Script MT', cursive", probe: 'SignPainter' },
  { label: 'Brush Script', stack: "'Brush Script MT', SignPainter, cursive", probe: 'Brush Script MT' },
  { label: 'Arial Unicode MS', stack: "'Arial Unicode MS', Arial, sans-serif", probe: 'Arial Unicode MS' },
];

export const DEFAULT_FONT = FONTS[0].stack;

// Long-form reading (the whitepaper) starts on a serif; Georgia covers the canonical glyphs.
export const SERIF_FONT = FONTS.find((f) => f.label === 'Georgia')?.stack ?? DEFAULT_FONT;
