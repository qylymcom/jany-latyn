// SPDX-License-Identifier: MIT
/**
 * The specimen of the Jany-Enesai proposal (§4): the passage in every preset, as an
 * HTML page set in the given rune font. Headless Chrome turns it into the PNG the
 * proposal shows (docs/jany-enesai/jany-enesai-specimen.png).
 *
 * Run: node dist/scripts/make-specimen.js --font <font file URL> > specimen.html
 */
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cyrToJany } from '../src/convert.js';
import { cyrillicToRunes, RUNE_PRESETS } from '../src/runes/index.js';

export const SPECIMEN_TEXT =
  'Жаңы жылдын биринчи күнү тоого чыгып, бийик чокудан шаарды көрдүк. Үйгө кайтканда чай ичип, эс алдык.';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function specimenHtml(fontUrl: string): string {
  const rows = RUNE_PRESETS.map((p) => `<h2>${esc(p.name)} <span>${p.status}</span></h2>\n<p class="r" lang="ky-Orkh" dir="rtl">${cyrillicToRunes(SPECIMEN_TEXT, p.options)}</p>`);
  return `<!doctype html>
<meta charset="utf-8">
<style>
@font-face { font-family: "Noto Sans Old Turkic"; src: url("${esc(fontUrl)}"); }
body { margin: 32px 40px; width: 1120px; font: 17px/1.5 system-ui, sans-serif; color: #1f2328; background: #fff; }
h1 { font-size: 20px; margin: 0 0 8px; }
h2 { font-size: 15px; margin: 22px 0 2px; }
h2 span { font-weight: normal; color: #59636e; margin-left: 6px; }
.r { font-family: "Noto Sans Old Turkic"; font-size: 28px; line-height: 1.7; margin: 0; unicode-bidi: isolate; }
.src { margin: 0; color: #59636e; }
</style>
<h1>Jany-Enesai: the passage of §4 in each setting</h1>
<p class="src">${esc(SPECIMEN_TEXT)}</p>
<p class="src">${esc(cyrToJany(SPECIMEN_TEXT))}</p>
${rows.join('\n')}
`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const i = process.argv.indexOf('--font');
  const font = i < 0 ? undefined : process.argv[i + 1];
  // A missing font would not fail the screenshot; the runes would fall back to another font.
  if (!font || (font.startsWith('file:') && !existsSync(fileURLToPath(font)))) {
    process.stderr.write(`usage: make-specimen.js --font <font file URL>${font ? `; not found: ${font}` : ''}\n`);
    process.exit(2);
  }
  process.stdout.write(specimenHtml(font));
}
