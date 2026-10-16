# SPDX-License-Identifier: MIT
"""List a stone's lines as signs in reading order, numbering the occurrences whose shape the
stone's glyph list leaves open. Usage: python3 -I occurrences.py <raw dir> <Stone_Name>"""
import os, sys, importlib.util
here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('encode', os.path.join(here, 'encode.py'))
e = importlib.util.module_from_spec(spec); spec.loader.exec_module(e)

def ambiguous(sym):
    return {k for k, v in sym.items() if len({e.GLYPH[g] for g in v if g in e.GLYPH}) > 1}

def occurrences(w):
    """Yield (line, nth sign in line, symbol, occurrence key 'L<line>:<symbol>#<k>')."""
    sym = e.gallery(w); amb = ambiguous(sym)
    for li, l in enumerate(e.lines(w), 1):
        n, seen = 0, {}
        for kind, t, u in e.merge_digraphs(list(e.tokens(l)), sym):
            if kind != 'sign': continue
            n += 1
            if t in amb:
                seen[t] = seen.get(t, 0) + 1
                yield li, n, t, f'L{li}:{t}#{seen[t]}'

if __name__ == '__main__':
    raw, stone = sys.argv[1], sys.argv[2]
    w = open(os.path.join(raw, stone, 'page.wiki')).read()
    sym = e.gallery(w); amb = ambiguous(sym)
    for li, l in enumerate(e.lines(w), 1):
        parts, seen = [], {}
        for kind, t, u in e.merge_digraphs(list(e.tokens(l)), sym):
            if kind == 'sign' and t in amb:
                seen[t] = seen.get(t, 0) + 1; parts.append(f'[{t}{seen[t]}]')
            elif kind == 'sign': parts.append(t)
            elif kind == 'sep': parts.append(' : ' if t == ':' else ' . ')
            elif kind == 'gap': parts.append(' … ')
            else: parts.append(' ')
        print(f'L{li}: ' + ''.join(parts))
