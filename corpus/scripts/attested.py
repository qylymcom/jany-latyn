# SPDX-License-Identifier: MIT
"""Attested forms (RUNES-SPEC §6): for each letter of the stones, the Unicode forms they use,
counted by stones and by placed occurrences, and the form the attested-majority rule picks
(most stones; ties go to occurrences). Prints a Markdown table.
Usage: python3 -I attested.py <raw dir>"""
import os, sys, glob, importlib.util
from collections import Counter, defaultdict

here = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location('encode', os.path.join(here, 'encode.py'))
e = importlib.util.module_from_spec(spec); spec.loader.exec_module(e)

# Database symbol -> the letter it writes, with its series where the script has two.
LETTER = {
    'A': 'a, ä', 'e': 'e', 'ė': 'e', 'I': 'ı, i', 'W': 'o, u', 'Ẅ': 'ö, ü',
    'B': 'b (back)', 'Ḅ': 'b (back)', 'b': 'b (front)', 'ḅ': 'b (front)',
    'G': 'ɣ, g (back)', 'g': 'g (front)', 'D': 'd (back)', 'Ḍ': 'd (back)', 'd': 'd (front)',
    'z': 'z', 'Y': 'y (back)', 'y': 'y (front)', 'K': 'q, k (back)', 'Q': 'q, k (back)',
    'k': 'k (front)', 'wK': 'oq, uq', 'ẅk': 'ök, ük', 'ẅK': 'ök, ük', 'ïK': 'ıq',
    'L': 'l (back)', 'l': 'l (front)', 'm': 'm', 'M': 'm', 'ṃ': 'm',
    'N': 'n (back)', 'n': 'n (front)', 'nd': 'nt, nd', 'nǰ': 'nč', 'Ŋ': 'ŋ (back)', 'ŋ': 'ŋ (front)',
    'p': 'p', 'P': 'p', 'R': 'r (back)', 'r': 'r (front)', 's': 's (front)',
    'š': 'š; s (back)', 'ṣ': 'š', 'Ṭ': 't (back)', 'T': 't (back)', 't': 't (front)',
    'č': 'č', 'ič': 'ič', 'bš': 'baš',
}

def tally(raw):
    shapes = e.load_shapes(os.path.join(raw, '..', 'shapes.json'))
    occ, stones = defaultdict(Counter), defaultdict(lambda: defaultdict(set))
    for f in sorted(glob.glob(os.path.join(raw, '*/page.wiki'))):
        n = os.path.basename(os.path.dirname(f)); w = open(f).read(); sym = e.gallery(w)
        if not sym: continue
        for li, l in enumerate(e.lines(w), 1):
            signs = []; e.encode(l, sym, set(), li, shapes.get(n, {}), signs)
            for s in signs:
                if s['status'] in ('unplaced', 'unknown', 'corrected') or s['symbol'] not in LETTER: continue
                letter = LETTER[s['symbol']]
                occ[letter][s['char']] += 1; stones[letter][s['char']].add(n)
    return occ, stones

def pick(occ, stones, letter):
    return max(occ[letter], key=lambda c: (len(stones[letter][c]), occ[letter][c]))

if __name__ == '__main__':
    occ, stones = tally(sys.argv[1])
    print('| Letter | Forms on the stones: stones (occurrences) | Attested majority |')
    print('| :--- | :--- | :---: |')
    for letter in sorted(occ, key=lambda x: list(LETTER.values()).index(x)):
        forms = sorted(occ[letter], key=lambda c: (-len(stones[letter][c]), -occ[letter][c]))
        cells = ', '.join(f'{c} U+{ord(c):X}: {len(stones[letter][c])} ({occ[letter][c]})' for c in forms)
        print(f'| {letter} | {cells} | {pick(occ, stones, letter)} |')
