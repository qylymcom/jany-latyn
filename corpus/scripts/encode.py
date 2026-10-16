# SPDX-License-Identifier: MIT
"""Encode each stone's wikitext transliteration as Unicode Old Turkic, using the stone's
Grapheme Gallery (glyph id -> database symbol) and the glyph table (glyph id -> code point).
Usage: python3 -I encode.py <raw dir> [corpus.md]   (with corpus.md: compare rune lines)"""
import re, sys, glob, os, json

GLYPH = {  # glyph id -> code point, from YENISEI-KYRGYZ-CORPUS.md Appendix A
 'A00':0x10C00,'A03':0x10C01,'B01':0x10C09,'B02':0x10C0B,'B03':0x10C09,'B04':0x10C0C,'B05':0x10C0B,
 'B06':0x10C09,'B07':0x10C09,'BS00':0x10C48,'C00':0x10C32,'C03':0x10C31,'C04':0x10C31,'D01':0x10C11,
 'D02':0x10C13,'D03':0x10C12,'D04':0x10C11,'D05':0x10C13,'E02':0x10C05,'G01':0x10C0D,'G02':0x10C0F,
 'G03':0x10C0E,'G04':0x10C0D,'G05':0x10C0F,'I00':0x10C03,'K01':0x10C34,'K02':0x10C1A,'K03':0x10C39,
 'K04':0x10C1B,'K05':0x10C1D,'K06':0x10C38,'L01':0x10C1E,'L02':0x10C20,'L03':0x10C1E,'M00':0x10C22,
 'M03':0x10C22,'N01':0x10C23,'N02':0x10C24,'N03':0x10C25,'N04':0x10C25,'N05':0x10C23,'ND00':0x10C26,
 'NG00':0x10C2D,'NG01':0x10C2C,'NG02':0x10C2D,'NG03':0x10C2E,'NG04':0x10C2C,'NG05':0x10C2C,
 'NJ00':0x10C28,'NJ03':0x10C29,'NJ04':0x10C28,'NJ05':0x10C28,'O01':0x10C06,'OE02':0x10C07,
 'P00':0x10C2F,'R01':0x10C3B,'R02':0x10C3C,'S02':0x10C3E,'S03':0x10C42,'S04':0x10C40,'S05':0x10C42,
 'T02':0x10C45,'T03':0x10C44,'Y01':0x10C16,'Y02':0x10C18,'Y03':0x10C16,'Z00':0x10C14,'Z03':0x10C15,
 'Z04':0x10C15,
}

# Glyphs the database draws as the mirror image of another letter's shape. They are encoded
# as that letter and flagged as mirrored, not as a different character (decision 2026-10-15).
MIRRORED = {'D04', 'N04', 'N05', 'Y03', 'S05', 'Z04', 'L03', 'NJ04'}
# Mirror pairs among the database's glyphs. A line the carver wrote left to right mirrors
# every sign; shapes.json records the shape as drawn, and the encoder takes its partner.
MIRROR_PAIR = {a: b for x, y in [('A00', 'A03'), ('D01', 'D04'), ('N03', 'N04'), ('N01', 'N05'),
               ('Y01', 'Y03'), ('S03', 'S05'), ('Z03', 'Z04'), ('L01', 'L03'), ('NJ00', 'NJ04')]
               for a, b in [(x, y), (y, x)]}

def load_shapes(path):
    try: return json.load(open(path))
    except FileNotFoundError: return {}

def writing_glyph(rec):
    """The glyph in the carver's writing direction, from a shapes.json record."""
    g = rec.get('glyph')
    if g and rec.get('direction') == 'ltr': g = MIRROR_PAIR.get(g, g)
    return g

def gallery(w):
    m = re.search(r'\{\{Grapheme Gallery\s*\n?\|(.*?)\}\}', w, re.S)
    if not m: return {}
    cells = [c.strip() for c in m.group(1).split('|')]
    sym = {}
    for g, s in zip(cells[0::2], cells[1::2]):
        s = re.sub(r'</?u>', '', s)
        sym.setdefault(s, []).append(g)
    return sym

def lines(w):
    m = re.search(r'\|Transliteration=\n(.*?)\n\|', w, re.S)
    if not m: return []
    out = []
    for l in m.group(1).splitlines():
        if not l.startswith('#'): continue
        l = re.sub(r'<ref>.*?</ref>', '', l[1:])
        if l.strip(): out.append(l.strip())
    return out

def tokens(line):
    """Yield (kind, text, unclear): kind in sign|sep|gap|space."""
    s = re.sub(r'\{\{gap\|+\.\.\.\}\}', '\x01', line)
    s = s.replace('{{unclear|', '\x02').replace('}}', '\x03')
    unclear, i = 0, 0
    while i < len(s):
        c = s[i]
        if c == '\x02': unclear += 1; i += 1; continue
        if c == '\x03': unclear -= 1; i += 1; continue
        if c == '\x01': yield ('gap', '...', 0); i += 1; continue
        if s.startswith('...', i): yield ('gap', '...', unclear); i += 3; continue
        if s.startswith('<u>', i):
            j = s.index('</u>', i); inner = s[i+3:j]
            u = unclear + (1 if '\x02' in inner else 0)
            yield ('sign', re.sub('[\x02\x03]', '', inner), u); i = j + 4; continue
        if c in ':.': yield ('sep', c, 0); i += 1; continue
        if c.isspace(): yield ('space', ' ', 0); i += 1; continue
        yield ('sign', c, unclear); i += 1

# Signs printed with a symbol that the stone's own glyph list lacks: the glyph the
# general table gives that symbol (or its unmarked case variant), noted as an issue.
FALLBACK = {'K': 'K01', 'Q': 'K01', 'Ṭ': 'T03', 'T': 'T03', 't': 'T02', 'M': 'M00', 'P': 'P00',
            'p': 'P00', 'I': 'I00', 'y': 'Y02', 'ė': 'E02', 'ṣ': 'S04', 'z': 'Z00'}
IQ = 0x10C36  # ORKHON IQ: ⟨ïK⟩ has no glyph in the database; encoded by its value

def merge_digraphs(toks, sym):
    """Join plain letters that spell a multi-letter symbol of this stone (wK, ẅk, nǰ)
    where the page does not underline them."""
    multi = sorted((k for k in sym if len(k) > 1), key=len, reverse=True)
    out, i = [], 0
    while i < len(toks):
        for m in multi:
            seg = toks[i:i + len(m)]
            text = ''.join(t for _, t, _ in seg)
            # The first letter must match exactly; later letters may differ in case only, since
            # Uibat III lists ⟨ẅK⟩ in its glyphs but writes ⟨ẅk⟩ in its text.
            if (len(seg) == len(m) and all(k == 'sign' and len(t) == 1 for k, t, _ in seg)
                    and text[0] == m[0] and text[1:].casefold() == m[1:].casefold()):
                out.append(('sign', m, max(u for *_, u in seg))); i += len(m); break
        else:
            out.append(toks[i]); i += 1
    return out

def ambiguous(sym):
    """Symbols for which this stone's glyph list offers more than one glyph."""
    return {k for k, v in sym.items() if len(set(v)) > 1}

def encode(line, sym, issues, li=0, shapes=None, signs=None):
    """Encode one line. shapes: this stone's shapes.json records; signs: if a list, receives
    one record per sign (symbol, glyph, char, mirrored, status)."""
    shapes = shapes or {}
    amb, seen, out, n = ambiguous(sym), {}, [], 0
    for kind, t, u in merge_digraphs(list(tokens(line)), sym):
        if kind == 'sign':
            n += 1
            rec = {'symbol': t, 'unclear': bool(u)}
            fix = shapes.get(f'L{li}:S{n}')  # the stone over the page: a correction the page's comment gives
            if fix:
                rec.update(glyph=fix['glyph'], char=chr(GLYPH[fix['glyph']]), status='corrected')
                out.append(rec['char'])
                if signs is not None: signs.append(rec)
                continue
            gl = sym.get(t)
            if not gl:
                if t == 'ïK':
                    issues.add('⟨ïK⟩ not in glyph list: encoded by value 𐰶')
                    rec.update(glyph=None, char=chr(IQ), status='unknown')
                else:
                    g = FALLBACK.get(t)
                    if not g:
                        issues.add(f'no glyph for ⟨{t}⟩'); rec.update(glyph=None, char='\ufffd', status='unknown')
                    else:
                        issues.add(f'⟨{t}⟩ not in glyph list: {chr(GLYPH[g])} ({g})')
                        rec.update(glyph=g, char=chr(GLYPH[g]), status='fallback')
            else:
                g, status = gl[0], 'exact'
                if t in amb:
                    seen[t] = seen.get(t, 0) + 1
                    shp = shapes.get(f'L{li}:{t}#{seen[t]}')
                    if shp and writing_glyph(shp):
                        g, status = writing_glyph(shp), shp['confidence']
                        if shp.get('direction') == 'ltr': rec['direction'] = 'ltr'
                    elif len({GLYPH.get(x) for x in gl}) > 1:
                        status = 'unplaced'
                        issues.add(f'⟨{t}⟩ unplaced: ' + ' '.join(dict.fromkeys(chr(GLYPH[x]) for x in gl if x in GLYPH)))
                    else:
                        status = 'form-unknown'  # one character either way; mirroring not settled
                if g not in GLYPH:
                    issues.add(f'⟨{t}⟩ glyph {g} has no reading'); rec.update(glyph=g, char='\ufffd', status='unknown')
                else:
                    rec.update(glyph=g, char=chr(GLYPH[g]), status=status)
                    if g in MIRRORED: rec['mirrored'] = True
            out.append(rec['char'])
            if signs is not None: signs.append(rec)
        elif kind == 'sep': out.append('⁚' if t == ':' else '⸱')
        elif kind == 'gap': out.append('...')
        else: out.append(' ')
    # The corpus writes dividers without spaces around them.
    return re.sub(r' *([⁚⸱]) *', r'\1', ''.join(out)).strip()

if __name__ == '__main__':
    raw = sys.argv[1]
    allshapes = load_shapes(os.path.join(raw, '..', 'shapes.json'))
    res = {}
    for f in sorted(glob.glob(os.path.join(raw, '*/page.wiki'))):
        name = os.path.basename(os.path.dirname(f)); w = open(f).read()
        sym = gallery(w)
        if not sym: continue
        issues, signs, enc = set(), [], []
        for li, l in enumerate(lines(w), 1):
            ls = []; enc.append(encode(l, sym, issues, li, allshapes.get(name, {}), ls)); signs.append(ls)
        res[name] = {'lines': enc, 'signs': signs, 'issues': sorted(issues), 'gallery': sym}
    json.dump(res, open(os.path.join(raw, '_encoded.json'), 'w'), ensure_ascii=False, indent=1)
    if len(sys.argv) > 2:
        cur, corpus = None, {}
        for l in open(sys.argv[2]):
            h = re.match(r'## \d+\. (.+)', l)
            if h: cur = h.group(1).strip().replace(' ', '_').replace('-', '_'); corpus[cur] = []
            m = re.match(r'<p dir="rtl" lang="otk-Orkh">(.*)</p>', l)
            if m and cur: corpus[cur].append(m.group(1))
        for name, r in res.items():
            c = corpus.get(name, [])
            bad = [(i+1, a, b) for i, (a, b) in enumerate(zip(r['lines'], c)) if a != b]
            print(('OK  ' if not bad and len(c) == len(r['lines']) else 'DIFF'), name, len(r['lines']), len(c), '|', '; '.join(r['issues']))
            for i, a, b in bad: print(f'   line {i}\n     new:    {a}\n     corpus: {b}')
