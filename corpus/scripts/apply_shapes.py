# SPDX-License-Identifier: MIT
"""Write the encoder's rune lines (with corpus/shapes.json applied) into
YENISEI-KYRGYZ-CORPUS.md, and regenerate the notes that depend on shapes: the per-stone
two-shape notes, the summary table's Shapes column, and the mirrored rows of Appendix A.
Usage: python3 -I apply_shapes.py <raw dir> <corpus.md>"""
import os, re, sys, json, importlib.util
from collections import Counter

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('encode', os.path.join(here, 'encode.py'))
e = importlib.util.module_from_spec(spec); spec.loader.exec_module(e)

raw, md = sys.argv[1], sys.argv[2]
shapes = e.load_shapes(os.path.join(raw, '..', 'shapes.json'))
GL = 'https://www.runiform.lingfil.uu.se/wiki/Glyph:'
key = lambda h: h.strip().replace(' ', '_').replace('-', '_')

def stone_data(name):
    w = open(os.path.join(raw, name, 'page.wiki')).read()
    sym = e.gallery(w); issues = set(); runes, signs = [], []
    for li, l in enumerate(e.lines(w), 1):
        ls = []; runes.append(e.encode(l, sym, issues, li, shapes.get(name, {}), ls)); signs.append(ls)
    return sym, runes, signs

def two_shape_notes(sym, signs):
    """One note per symbol whose glyph list has two characters (or a mirrored pair)."""
    notes, summary = [], []
    for t, gl in sym.items():
        chars = list(dict.fromkeys(e.GLYPH[g] for g in gl if g in e.GLYPH))
        occ = [s for line in signs for s in line if s['symbol'] == t and s.get('status') != 'corrected']
        if len(set(gl)) < 2 or not occ: continue
        if len(chars) == 1:  # a letter and its mirror image: one character
            mir = [g for g in gl if g in e.MIRRORED]
            if not mir: continue  # a turned or simplified variant; the shapes note covers it
            notes.append(f"- ⟨{t}⟩ is drawn both as {chr(chars[0])} and as its mirror image "
                         f"({', '.join(f'[{g}]({GL}{g})' for g in mir)}); every ⟨{t}⟩ is written {chr(chars[0])}, "
                         "since a mirrored sign is the same letter (see *Mirrored signs* above).")
            continue
        forms = ' and '.join(f"{chr(e.GLYPH[g])} U+{e.GLYPH[g]:X} ([{g}]({GL}{g}))" for g in dict.fromkeys(gl))
        placed = Counter(s['char'] for s in occ if s['status'] in ('clear', 'probable', 'disputed'))
        unpl = [s for s in occ if s['status'] not in ('clear', 'probable', 'disputed')]
        part = ', '.join(f"{n} {c}" for c, n in placed.most_common())
        txt = f"- The stone has two shapes for ⟨{t}⟩: {forms}. "
        flipped = sum(1 for s in occ if s.get('direction') == 'ltr')
        if placed:
            np = sum(placed.values())
            txt += (f"{np} of {len(occ)} {'is' if np == 1 else 'are'} placed from the drawings ({part}); "
                    "see `corpus/shapes.json` for the drawing and confidence of each. ")
            if flipped:
                txt += (f"{flipped} of them stand in a stretch the carver wrote left to right, where every letter is "
                        "mirrored, so they are written as the letter their mirror image stands for. ")
        if unpl:
            txt += (f"The other {len(unpl)} can't be told apart on the drawings and "
                    f"{'is' if len(unpl) == 1 else 'are'} written {unpl[0]['char']}.") if placed \
                else f"The drawings don't show which occurrence is which, so every ⟨{t}⟩ here is {unpl[0]['char']}."
        notes.append(txt.rstrip())
        if unpl: summary.append(f"⟨{t}⟩ ({len(unpl)} of {len(occ)} unplaced)")
    return notes, summary

text = open(md).read()
out, pos = [], 0
sections = list(re.finditer(r'^## (\d+)\. (.+)$', text, re.M))
summaries = {}
for i, m in enumerate(sections):
    end = sections[i + 1].start() if i + 1 < len(sections) else len(text)
    body = text[m.start():end]
    name = key(m.group(2))
    if os.path.exists(os.path.join(raw, name, 'page.wiki')):
        sym, runes, signs = stone_data(name)
        it = iter(runes)
        body = re.sub(r'(<p dir="rtl" lang="otk-Orkh">)(.*?)(</p>)', lambda x: x.group(1) + next(it) + x.group(3), body)
        body = re.sub(r"^- The stone has two shapes for .*\n", '', body, flags=re.M)
        notes, summary = two_shape_notes(sym, signs)
        summaries[m.group(1)] = summary
        if notes:
            body = body.replace('Notes on the signs:\n\n', 'Notes on the signs:\n\n' + '\n'.join(notes) + '\n', 1) \
                if 'Notes on the signs:\n\n' in body else body
    out.append(text[pos:m.start()]); out.append(body); pos = end
out.append(text[pos:])
text = ''.join(out)

# Summary table: Shapes column for stones with two-shape letters.
def fix_row(r):
    cells = r.group(0).split(' | ')
    n = cells[0].strip('| ').strip()
    if n in summaries and cells[3].strip() != '—':
        keep = [c for c in re.findall(r'⟨[^⟩]+⟩ \(shape unknown\)', cells[5])]
        s = summaries[n] + keep
        cells[5] = ('exact except ' + ', '.join(s) + ' |') if s else 'exact |'
    return ' | '.join(cells)
head, sep, rest = text.partition('## How to read this file')
text = re.sub(r'^\| \d+ \| \[.*\|$', fix_row, head, flags=re.M) + sep + rest

# Appendix A: D04 is the mirror image of D01 and is written 𐰑.
text = text.replace('| [D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04) | D | d | 𐰒 | U+10C12 | YENISEI AD | variant |',
                    '| [D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04) | D | d | 𐰑 | U+10C11 | ORKHON AD | mirrored |')
for g in sorted(e.MIRRORED - {'D04'}):
    text = re.sub(rf'(\| \[{g}\]\([^)]*\) \|[^\n]*?\| )variant( \|)', r'\1mirrored\2', text)
text = text.replace('mirror image of 𐰑 (zigzags pointing left) (nearest character 𐰒)',
                    'mirror image of 𐰑 (zigzags pointing left) (written 𐰑)')
open(md, 'w').write(text)
print('stones with two-shape notes:', {k: v for k, v in summaries.items() if v})
