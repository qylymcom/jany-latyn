// SPDX-License-Identifier: MIT
// Jany-Latyn single-letter mapping, lowercase, Kyrgyz alphabet order.
// Jany-Latyn: ө maps to Latin ö (U+00F6); ү maps to Latin ü (U+00FC); й maps to Latin í (U+00ED).
export const LETTER_MAP: ReadonlyArray<readonly [string, string]> = [
  ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'],
  ['ё', 'ío'], ['ж', 'j'], ['з', 'z'], ['и', 'i'], ['й', 'í'], ['к', 'k'],
  ['л', 'l'], ['м', 'm'], ['н', 'n'], ['ң', 'ŋ'], ['о', 'o'], ['ө', 'ö'],
  ['п', 'p'], ['р', 'r'], ['с', 's'], ['т', 't'], ['у', 'u'], ['ү', 'ü'],
  ['ф', 'f'], ['х', 'h'], ['ц', 'ts'], ['ч', 'ç'], ['ш', 'ş'], ['щ', 'ş'],
  ['ъ', ''], ['ы', 'y'], ['ь', ''], ['э', 'e'], ['ю', 'íu'], ['я', 'ía'],
];

// Extended (compose-mode) letters — whitepaper §20. These mark sound
// distinctions that Kyrgyz Cyrillic does not write, so cyrToJany NEVER emits
// them: they are only valid when a person writes Latin directly. Reverse
// conversion folds each back to its Cyrillic base letter — the whitepaper
// §18.1 native-priority rule applied to a new case: the distinction survives in
// Latin and is lost on the way back, exactly as loan ц and щ are.
export const EXTENDED_LETTERS: ReadonlyArray<readonly [string, string]> = [
  ['ä', 'а'], // back /ɑ/ vs front /æ/ — southern speech, Persian loans
  ['x', 'х'], // glottal [h] vs velar [x] — loanwords (Xaram vs Buhara)
  ['w', 'в'], // labiodental [v] vs [w] — loanwords, intervocalic /b/
];

// ASCII fallback — strip-only (the default, whitepaper §19): every diacritic
// drops to its base letter. A digraph style (Ç→Ch, Ş→Sh) is available as
// the second argument to janyToFallback().
export const FALLBACK: ReadonlyArray<readonly [string, string]> = [
  ['Ө', 'O'], ['ө', 'o'],
  ['Ö', 'O'], ['ö', 'o'],
  ['Ü', 'U'], ['ü', 'u'],
  ['Ū', 'U'], ['ū', 'u'], // legacy
  ['Ä', 'A'], ['ä', 'a'],
  ['Ç', 'C'], ['ç', 'c'],
  ['Ş', 'S'], ['ş', 's'],
  ['Ŋ', 'N'], ['ŋ', 'n'],
  ['Ñ', 'N'], ['ñ', 'n'], // tilde-n alternative for ŋ
  ['İ', 'I'], ['ı', 'i'], // dotless-ı option (whitepaper §9): keeps the plain form ASCII
  ['Ğ', 'G'], ['ğ', 'g'], // ğ option (whitepaper §8)
  ['Í', 'I'], ['í', 'i'],
  ['Ĭ', 'I'], ['ĭ', 'i'], // breve glide alternative (whitepaper §7)
  ['Ĩ', 'I'], ['ĩ', 'i'], // tilde glide alternative (whitepaper §7)
];
