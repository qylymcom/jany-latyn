# SPDX-License-Identifier: MIT
"""Inscription reader (RUNES-SPEC §7.2): Old Turkic runes -> sign values, one value per
rune, with ¹/² marking the back/front series of two-series consonants. No vowel is supplied.
Usage: python3 -I reader.py <corpus.md> [--write]   (checks, or rewrites, every 'Reader output' line)"""
import re, sys

# Code point -> sign value (RUNES-SPEC Appendix B). Orkhon and Yenisei forms of one letter
# read alike; the reader reports the letter, not the form.
VALUE = {
    0x10C00: 'a', 0x10C01: 'a', 0x10C02: 'ä', 0x10C03: 'i', 0x10C04: 'i', 0x10C05: 'e',
    0x10C06: 'o', 0x10C07: 'ö', 0x10C08: 'ö',
    0x10C09: 'b¹', 0x10C0A: 'b¹', 0x10C0B: 'b²', 0x10C0C: 'b²',
    0x10C0D: 'g¹', 0x10C0E: 'g¹', 0x10C0F: 'g²', 0x10C10: 'g²',
    0x10C11: 'd¹', 0x10C12: 'd¹', 0x10C13: 'd²',
    0x10C14: 'z', 0x10C15: 'z',
    0x10C16: 'y¹', 0x10C17: 'y¹', 0x10C18: 'y²', 0x10C19: 'y²',
    0x10C1A: 'k²', 0x10C1B: 'k²', 0x10C1C: 'ök', 0x10C1D: 'ök',
    0x10C1E: 'l¹', 0x10C1F: 'l¹', 0x10C20: 'l²', 0x10C21: 'lt', 0x10C22: 'm',
    0x10C23: 'n¹', 0x10C24: 'n²', 0x10C25: 'n²', 0x10C26: 'nt', 0x10C27: 'nt',
    0x10C28: 'nč', 0x10C29: 'nč', 0x10C2A: 'ny', 0x10C2B: 'ny',
    0x10C2C: 'ñ', 0x10C2D: 'ñ', 0x10C2E: 'ñ', 0x10C2F: 'p', 0x10C30: 'op',
    0x10C31: 'ič', 0x10C32: 'č', 0x10C33: 'č',
    0x10C34: 'q', 0x10C35: 'q', 0x10C36: 'ıq', 0x10C37: 'ıq', 0x10C38: 'oq', 0x10C39: 'oq',
    0x10C3A: 'r¹', 0x10C3B: 'r¹', 0x10C3C: 'r²', 0x10C3D: 's¹', 0x10C3E: 's²',
    0x10C3F: 'aš', 0x10C40: 'š', 0x10C41: 'š', 0x10C42: 'š',
    0x10C43: 't¹', 0x10C44: 't¹', 0x10C45: 't²', 0x10C46: 't²', 0x10C47: 'ot', 0x10C48: 'baš',
}
WORD_BREAK = {0x205A: ' '}   # ⁚ TWO DOT PUNCTUATION divides words
PASS = {0x2E31, 0x20}          # ⸱ and space pass through

def read(runes):
    out = []
    for ch in runes:
        cp = ord(ch)
        if cp in VALUE: out.append(VALUE[cp])
        elif cp in WORD_BREAK: out.append(WORD_BREAK[cp])
        else: out.append(ch)
    return re.sub(r' {2,}', ' ', ''.join(out)).strip()

if __name__ == '__main__':
    text = open(sys.argv[1]).read()
    if '--write' in sys.argv:
        text = re.sub(r'(<p dir="rtl" lang="otk-Orkh">(.*?)</p>\n\n- Database signs: `.*?`\n- Reader output: `)(.*?)(`)',
                      lambda m: m.group(1) + read(m.group(2)) + m.group(4), text)
        open(sys.argv[1], 'w').write(text)
    pairs = re.findall(r'<p dir="rtl" lang="otk-Orkh">(.*?)</p>\n\n- Database signs: `.*?`\n- Reader output: `(.*?)`', text)
    bad = [(r, e, read(r)) for r, e in pairs if read(r) != e]
    print(f'{len(pairs) - len(bad)} of {len(pairs)} lines match')
    for r, e, g in bad[:10]: print('  expected:', e, '\n  got:     ', g)
