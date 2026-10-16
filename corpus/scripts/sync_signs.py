# SPDX-License-Identifier: MIT
"""Rewrite the 'Database signs' lines of YENISEI-KYRGYZ-CORPUS.md from the fetched wikitext
(exact: one-sign braces, ⸢ ⸣ legibility marks), and record the source as the wikitext.
Usage: python3 -I sync_signs.py <raw dir> <corpus.md>"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from compare_translit import wiki_lines  # noqa: E402

raw, md = sys.argv[1], sys.argv[2]
out, cur, idx, changed = [], None, 0, 0
for l in open(md):
    h = re.match(r'## \d+\. (.+)', l)
    if h:
        cur = h.group(1).strip().replace(' ', '_').replace('-', '_'); idx = 0
        p = os.path.join(raw, cur, 'page.wiki')
        wl = [x for x in wiki_lines(p) if x] if os.path.exists(p) else []
    m = re.match(r'- Database signs: `(.*)`', l)
    if m and cur:
        new = wl[idx]; idx += 1
        if new != m.group(1): changed += 1; l = f'- Database signs: `{new}`\n'
    if l.startswith('- Text copied through a web tool'): continue
    l = re.sub(r'\| (web copy|saved page) \|$', '| checked |', l.rstrip('\n')) + '\n'
    out.append(l)
open(md, 'w').write(''.join(out))
print('lines changed:', changed)
