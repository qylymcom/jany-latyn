# SPDX-License-Identifier: MIT
"""Old-or-modern detector (RUNES-SPEC §9.4).
Usage: python3 -I detect.py <corpus.md> <JANY-ENESAI.md>   (prints the §9.3 figures)"""
import re, sys

OLD_ONLY = set('𐰁𐰌𐰎𐰐𐰒𐰗𐰛𐰥𐰪𐰫𐰬𐰮𐰰𐰵𐰷𐰹𐰻𐰿𐱀𐱂𐱆')
VOWEL = set('𐰀𐰁𐰂𐰃𐰄𐰅𐰆𐰇𐰈𐱈')
RUNE = re.compile('[\U00010C00-\U00010C48]')

def features(text):
    words = [w for w in re.split(r'[^\U00010C00-\U00010C48]+', text) if len(w) >= 2]
    def longest_cluster(w):
        best = run = 0
        for ch in w:
            run = 0 if ch in VOWEL else run + 1; best = max(best, run)
        return best
    n = len(words) or 1
    return {
        'words': len(words),
        'old_only': sum(ch in OLD_ONLY for ch in text),
        'vowelless': sum(1 for w in words if not any(ch in VOWEL for ch in w)) / n,
        'clusters': sum(1 for w in words if longest_cluster(w) >= 3) / n,
    }

def detect(text):
    f = features(text)
    if f['old_only']: return 'old'
    if f['vowelless'] > 0.10 or f['clusters'] > 0.25: return 'old'
    return 'modern'

if __name__ == '__main__':
    corpus = open(sys.argv[1]).read()
    rows = []
    for sec in re.split(r'^## \d+\. ', corpus, flags=re.M)[1:]:
        lines = re.findall(r'<p dir="rtl" lang="otk-Orkh">(.*?)</p>', sec)
        if not lines: continue
        t = ' '.join(lines); f = features(t)
        rows.append((sec.split('\n')[0], f, detect(t), detect(t.replace('⁚', ' ').replace('⸱', ' '))))
    for name, f, a, b in rows:
        print(f"{name:14} words {f['words']:3} old-only {f['old_only']:3} vowelless {f['vowelless']:.0%} clusters {f['clusters']:.0%}  {a}/{b}")
    print('stones classed old:', sum(a == b == 'old' for *_, a, b in rows), 'of', len(rows))
    print('ranges: words', min(f['words'] for _, f, *_ in rows), '-', max(f['words'] for _, f, *_ in rows),
          '| old-only', min(f['old_only'] for _, f, *_ in rows), '-', max(f['old_only'] for _, f, *_ in rows),
          '| vowelless', f"{min(f['vowelless'] for _, f, *_ in rows):.0%}-{max(f['vowelless'] for _, f, *_ in rows):.0%}",
          '| clusters', f"{min(f['clusters'] for _, f, *_ in rows):.0%}-{max(f['clusters'] for _, f, *_ in rows):.0%}")
    prop = open(sys.argv[2]).read()
    rows = [[c.strip() for c in l.strip('|').split('|')] for l in prop[prop.index('## Appendix B'):].splitlines() if l.startswith('| ')]
    head, body = rows[0], [r for r in rows[1:] if not r[0].startswith(':')]
    for i, name in enumerate(head[2:], 2):
        col = [r[i] for r in body]
        t = ' '.join(col); f = features(t)
        print(f"{name:16} words {f['words']} old-only {f['old_only']} vowelless {f['vowelless']:.0%} clusters {f['clusters']:.0%} -> {detect(t)}")
