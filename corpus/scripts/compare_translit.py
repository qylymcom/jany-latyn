# SPDX-License-Identifier: MIT
"""Compare each stone's wikitext transliteration with the 'Database signs' lines in
YENISEI-KYRGYZ-CORPUS.md. Usage: python3 -I compare_translit.py <raw dir> <corpus.md>"""
import re, sys, glob, os

def norm(s):
    s = re.sub(r'<ref>.*?</ref>', '', s)
    s = re.sub(r'\{\{gap\|+\.\.\.\}\}', '...', s)
    for _ in range(3):
        s = re.sub(r'\{\{unclear\|([^{}]*)\}\}', r'⸢\1⸣', s)
    s = re.sub(r'<u>(.*?)</u>', r'{\1}', s)
    return re.sub(r'\s+', ' ', s).strip()

def wiki_lines(path):
    w = open(path).read()
    m = re.search(r'\|Transliteration=\n(.*?)\n\|', w, re.S)
    if not m: return []
    return [norm(l[1:]) for l in m.group(1).splitlines() if l.startswith('#')]

def corpus_lines(md):
    out, cur = {}, None
    for l in open(md):
        h = re.match(r'## \d+\. (.+)', l)
        if h: cur = h.group(1).strip().replace(' ', '_').replace('-', '_'); out[cur] = []
        m = re.match(r'- Database signs: `(.*)`', l)
        if m and cur: out[cur].append(m.group(1))
    return out

if __name__ == '__main__':
    raw, md = sys.argv[1], sys.argv[2]
    cl = corpus_lines(md)
    for d in sorted(glob.glob(os.path.join(raw, '*/page.wiki'))):
        name = os.path.basename(os.path.dirname(d))
        if name not in cl: continue
        wl, c = wiki_lines(d), cl[name]
        diffs = [(i + 1, a, b) for i, (a, b) in enumerate(zip(wl, c)) if a != b]
        flag = 'OK ' if not diffs and len(wl) == len(c) else 'DIFF'
        print(f'{flag} {name}: wiki {len(wl)} lines, corpus {len(c)} lines')
        for i, a, b in diffs:
            print(f'   line {i}\n     wiki:   {a}\n     corpus: {b}')
