// SPDX-License-Identifier: MIT
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cyrToJany, janyToFallback, janyToCyr, janyToLatinU, janyToCyrillicU, janyToMacronU } from '../src/convert.js';
import { LETTER_MAP } from '../src/alphabet.js';

// Tests run from dist/test/, so fixtures resolve two levels up to the source tree.
const FIXTURES = new URL('../../test/fixtures/', import.meta.url);
const fixture = (name: string, ext: string) =>
  readFileSync(new URL(`${name}.${ext}.txt`, FIXTURES), 'utf8').trimEnd();

for (const name of ['anthem', 'lullaby', 'manas']) {
  test(`forward: ${name} excerpt converts exactly`, () => {
    assert.equal(cyrToJany(fixture(name, 'cyr')), fixture(name, 'jany'));
  });
}

test('universal í glide rule: preserves morphemic roots without barcode', () => {
  assert.equal(cyrToJany('кийим'), 'kiíim');
  assert.equal(cyrToJany('кый'), 'kyí');
  assert.equal(cyrToJany('бийик'), 'biíik');
  assert.equal(cyrToJany('кийин'), 'kiíin');
  assert.equal(cyrToJany('тийиштүү'), 'tiíiştüü');
  assert.equal(cyrToJany('Бийик'), 'Biíik');
  assert.equal(cyrToJany('БИЙИК'), 'BIÍIK');
  assert.equal(cyrToJany('кийет'), 'kiíet');
  assert.equal(cyrToJany('кийди'), 'kiídi');
  assert.equal(cyrToJany('бий'), 'bií');
  assert.equal(cyrToJany('бийи'), 'biíi');
  assert.equal(cyrToJany('Бийи'), 'Biíi');
  assert.equal(cyrToJany('БИЙ'), 'BIÍ');
});

test('universal í: glides in diphthongs, back vowels, and high-front stems', () => {
  assert.equal(cyrToJany('ай'), 'aí');
  assert.equal(cyrToJany('чай'), 'çaí');
  assert.equal(cyrToJany('той'), 'toí');
  assert.equal(cyrToJany('тыйын'), 'tyíyn');
  assert.equal(cyrToJany('кыйык'), 'kyíyk');
  assert.equal(cyrToJany('сыйлык'), 'syílyk');
  assert.equal(cyrToJany('айыл'), 'aíyl');
  assert.equal(cyrToJany('бий'), 'bií');
  assert.equal(cyrToJany('бийи'), 'biíi');
  assert.equal(cyrToJany('бийик'), 'biíik');
  assert.equal(cyrToJany('кийин'), 'kiíin');
  assert.equal(cyrToJany('кийим'), 'kiíim');
  assert.equal(cyrToJany('тийиштүү'), 'tiíiştüü');
});

test('systematic iotation: ía, ío, íu and hiatus separation', () => {
  assert.equal(cyrToJany('саякат'), 'saíakat');
  assert.equal(cyrToJany('окуя'), 'okuía');
  assert.equal(cyrToJany('аяк'), 'aíak');
  assert.equal(cyrToJany('авиация'), 'aviatsiía');
  assert.equal(cyrToJany('Россия'), 'Rossiía');
  assert.equal(cyrToJany('коён'), 'koíon');
  assert.equal(cyrToJany('боёк'), 'boíok');
  assert.equal(cyrToJany('ёлка'), 'íolka');
  assert.equal(cyrToJany('аюу'), 'aíuu');
  assert.equal(cyrToJany('тыюу'), 'tyíuu');
  assert.equal(cyrToJany('юрист'), 'íurist');
  assert.equal(cyrToJany('союз'), 'soíuz');
});

test('deterministic e / э resolution: initial íe vs initial e', () => {
  // Word-initial Russian loan glide [je]
  assert.equal(cyrToJany('Европа'), 'Íevropa');
  assert.equal(cyrToJany('Енисей'), 'Íeniseí');
  assert.equal(cyrToJany('енот'), 'íenot');
  // Word-initial native [e]
  assert.equal(cyrToJany('эл'), 'el');
  assert.equal(cyrToJany('эне'), 'ene');
  assert.equal(cyrToJany('эшик'), 'eşik');
  // Medial native [e]
  assert.equal(cyrToJany('кел'), 'kel');
  assert.equal(cyrToJany('мектеп'), 'mektep');
  assert.equal(cyrToJany('кийет'), 'kiíet');
});

test('reverse conversion: bijective restoration with zero heuristics', () => {
  assert.equal(janyToCyr('aí'), 'ай');
  assert.equal(janyToCyr('toí'), 'той');
  assert.equal(janyToCyr('tyíyn'), 'тыйын');
  assert.equal(janyToCyr('biíik'), 'бийик');
  assert.equal(janyToCyr('kiíim'), 'кийим');
  assert.equal(janyToCyr('saíakat'), 'саякат');
  // §18.1 native-priority: ts→тс (not ц), so авиация round-trips to авиатсия
  assert.equal(janyToCyr('aviatsiía'), 'авиатсия');
  assert.equal(janyToCyr('Íevropa'), 'Европа');
  assert.equal(janyToCyr('el'), 'эл');
  assert.equal(janyToCyr('ene'), 'эне');
  assert.equal(janyToCyr('kel'), 'кел');
  // Backwards compatibility for legacy forms
  assert.equal(janyToCyr('biyik'), 'бийик');
});

test('case handling: ALL-CAPS words with í and íe', () => {
  assert.equal(cyrToJany('БИЙИК'), 'BIÍIK');
  assert.equal(cyrToJany('ЕВРОПА'), 'ÍEVROPA');
  assert.equal(janyToCyr('BIÍIK'), 'БИЙИК');
  assert.equal(janyToCyr('ÍEVROPA'), 'ЕВРОПА');
});


test('loanword hiatus with e is written íe (переезд, поезд, проект)', () => {
  assert.equal(cyrToJany('переезд'), 'pereíezd');
  assert.equal(cyrToJany('поезд'), 'poíezd');
  assert.equal(cyrToJany('проект'), 'proíekt');
  // §18.1 native-priority: post-vocalic íe→йе, so loanwords are lossy without restoreLoans
  assert.equal(janyToCyr('pereíezd'), 'перейезд');
  assert.equal(janyToCyr('poíezd'), 'пойезд');
  assert.equal(janyToCyr('proíekt'), 'пройект');
  // §18.2 restoreLoans restores correct Cyrillic spellings
  assert.equal(janyToCyr('pereíezd', { restoreLoans: true }), 'переезд');
  assert.equal(janyToCyr('poíezd', { restoreLoans: true }), 'поезд');
  assert.equal(janyToCyr('proíekt', { restoreLoans: true }), 'проект');
});

test('phonemic long e is always written ээ in Kyrgyz and becomes ee', () => {
  assert.equal(cyrToJany('ээги'), 'eegi');
  assert.equal(cyrToJany('керээз'), 'kereez');
  assert.equal(cyrToJany('кээде'), 'keede');
  assert.equal(cyrToJany('жээк'), 'jeek');
  assert.equal(janyToCyr('eegi'), 'ээги');
  assert.equal(janyToCyr('kereez'), 'керээз');
  assert.equal(janyToCyr('keede'), 'кээде');
  assert.equal(janyToCyr('jeek'), 'жээк');
  assert.equal(cyrToJany('мекендеп'), 'mekendep');
});

test('case handling: titlecase digraphs, ALL-CAPS words, mixed text', () => {
  assert.equal(cyrToJany('Чыкса'), 'Çyksa');
  assert.equal(cyrToJany('ЖАҢЫ'), 'JAŊY');
  assert.equal(cyrToJany('Ала-Тоосун'), 'Ala-Toosun');
  assert.equal(cyrToJany('Кыргызстан!'), 'Kyrgyzstan!');
});

test('ж is always j, never zh', () => {
  assert.equal(cyrToJany('ажыратуу'), 'ajyratuu');
  assert.equal(cyrToJany('журнал'), 'jurnal');
});

test('non-Cyrillic characters pass through untouched', () => {
  assert.equal(cyrToJany('Manas 2026 — эпос'), 'Manas 2026 — epos');
});

test('fallback replaces only the non-ASCII glyphs', () => {
  assert.equal(janyToFallback('Ak möŋgülüü aska'), 'Ak monguluu aska'); // ŋ→n, г→g
  assert.equal(janyToFallback('Arka jölöör jan balam'), 'Arka joloor jan balam');
  assert.equal(janyToFallback('Aibaty katuu, zaar jüz'), 'Aibaty katuu, zaar juz');
});

test('fallback handles capitals', () => {
  assert.equal(janyToFallback('JAŊY'), 'JANY');
  assert.equal(janyToFallback('Өz tagdyryŋ koluŋda'), 'Oz tagdyryn kolunda');
});

test('russian signs are absorbed by default and optionally retain apostrophes', () => {
  // Default: absorbed
  assert.equal(cyrToJany('семья'), 'semía');
  assert.equal(cyrToJany('объект'), 'obíekt');
  assert.equal(cyrToJany('июль'), 'iíul');
  assert.equal(janyToFallback('semía'), 'semia');
  assert.equal(janyToFallback('obíekt'), 'obiekt');

  // Optional: apostrophe
  assert.equal(cyrToJany('семья', { signs: 'apostrophe' }), "sem'ía");
  assert.equal(cyrToJany('объект', { signs: 'apostrophe' }), "ob'ekt");
  assert.equal(cyrToJany('июль', { signs: 'apostrophe' }), "iíul'");
});

test('fallback accepts the documented collisions', () => {
  assert.equal(janyToFallback('köl'), 'kol'); // көл, lake
  assert.equal(janyToFallback('kөl'), 'kol'); // variant/legacy көл
  assert.equal(janyToFallback('kol'), 'kol'); // кол, arm
  assert.equal(janyToFallback('jaŋy'), 'jany'); // жаңы, new
  assert.equal(janyToFallback('jany'), 'jany'); // жаны, his soul
});

test('fallback: lullaby excerpt matches the SPEC.md block', () => {
  assert.equal(janyToFallback(fixture('lullaby', 'jany')), fixture('lullaby', 'fallback'));
});

for (const name of ['anthem', 'lullaby', 'manas']) {
  test(`round-trip: ${name} excerpt survives forward then reverse`, () => {
    const cyr = fixture(name, 'cyr');
    assert.equal(janyToCyr(cyrToJany(cyr)), cyr);
  });
}

test('reverse: positional e rule', () => {
  assert.equal(janyToCyr('el'), 'эл'); // word-initial defaults to э (documented lossy)
  assert.equal(janyToCyr('menen'), 'менен');
  assert.equal(janyToCyr('eegi'), 'ээги'); // ee → ээ
  assert.equal(janyToCyr('kereez'), 'керээз');
});

test('reverse: i after a vowel is й, otherwise и', () => {
  assert.equal(janyToCyr('koidun'), 'койдун');
  assert.equal(janyToCyr('Elibizdin'), 'Элибиздин');
  assert.equal(janyToCyr('kөi'), 'көй');
});

test('reverse: digraphs and loanword machinery', () => {
  assert.equal(janyToCyr("sem'ia"), 'семья');
  assert.equal(janyToCyr("ob'ekt"), 'объект');
  assert.equal(janyToCyr("Tver'"), 'Тверь');
  assert.equal(janyToCyr('schot'), 'щот');
});

test('reverse: iy and iyi restore deterministically', () => {
  assert.equal(janyToCyr('biyik'), 'бийик');
  assert.equal(janyToCyr('kiyin'), 'кийин');
  assert.equal(janyToCyr('kiyim'), 'кийим');
  assert.equal(janyToCyr('tiyishtüü'), 'тийиштүү');
  assert.equal(janyToCyr('tiyishtūū'), 'тийиштүү');
  assert.equal(janyToCyr('kiy'), 'кий');
  assert.equal(janyToCyr('biy'), 'бий');
  assert.equal(janyToCyr('kiydi'), 'кийди');
  assert.equal(janyToCyr('kiyet'), 'кийет');
  assert.equal(janyToCyr('biyi'), 'бийи');
});

test('reverse is exact for every unambiguous letter', () => {
  // ц is ambiguous: ts→тс (native-priority §18.1) so ц cannot be round-tripped
  const AMBIGUOUS = new Set(['е', 'э', 'и', 'й', 'ъ', 'ь', 'щ', 'ц']);
  for (const [cyr] of LETTER_MAP) {
    if (AMBIGUOUS.has(cyr)) continue;
    assert.equal(janyToCyr(cyrToJany(cyr)), cyr, cyr);
  }
});

test('forward: ү converts to Jany-Latyn ü and үү to üü', () => {
  assert.equal(cyrToJany('күз'), 'küz');
  assert.equal(cyrToJany('жүгүрүү'), 'jügürüü');
  assert.equal(cyrToJany('ҮЙ'), 'ÜÍ');
});

test('reverse: recognizes Jany-Latyn ü, legacy ū, and ұ', () => {
  assert.equal(janyToCyr('küz'), 'күз');
  assert.equal(janyToCyr('kūz'), 'күз');
  assert.equal(janyToCyr('kұz'), 'күз');
  assert.equal(janyToCyr('Üí'), 'Үй');
  assert.equal(janyToCyr('Ūí'), 'Үй');
  assert.equal(janyToCyr('Ұí'), 'Үй');
  assert.equal(janyToCyr('Üi'), 'Үй');
  assert.equal(janyToCyr('Ūi'), 'Үй');
  assert.equal(janyToCyr('Ұi'), 'Үй');
});

test('fallback: ü and ū map to u', () => {
  assert.equal(janyToFallback('küz'), 'kuz');
  assert.equal(janyToFallback('Üi'), 'Ui');
  assert.equal(janyToFallback('kūz'), 'kuz');
  assert.equal(janyToFallback('Ūi'), 'Ui');
});

test('display variant: Latin barred u', () => {
  assert.equal(janyToLatinU('Өрūк гūлū'), 'Өрʉк гʉлʉ');
  assert.equal(janyToLatinU('kөл sūz ŋ'), 'kөл sʉz ŋ'); // only ū changes
});

test('display variant: Cyrillic ұ', () => {
  assert.equal(janyToCyrillicU('Өрūк гūлū'), 'Өрұк гұлұ');
  assert.equal(janyToCyrillicU('kөл sūz ŋ'), 'kөл sұz ŋ');
  assert.equal(janyToCyrillicU('ŪŊ'), 'ҰŊ');
});

test('display variant: janyToMacronU is identity pass-through', () => {
  assert.equal(janyToMacronU('Өрūк гūлū'), 'Өрūк гūлū');
});

test('cyrToJany with options', () => {
  // Default (Jany-Latyn: ö / ü, y, ç/ş)
  assert.equal(cyrToJany('көл'), 'köl');
  assert.equal(cyrToJany('күз'), 'küz');
  assert.equal(cyrToJany('чай'), 'çaí');
  assert.equal(cyrToJany('кыргыз'), 'kyrgyz');

  // hybrid (ө / ü)
  assert.equal(cyrToJany('көл', { vowels: 'hybrid' }), 'kөl');
  assert.equal(cyrToJany('күз', { vowels: 'hybrid' }), 'küz');

  // latin-umlaut (ö / ü)
  assert.equal(cyrToJany('көл', { vowels: 'latin-umlaut' }), 'köl');
  assert.equal(cyrToJany('КӨЛ', { vowels: 'latin-umlaut' }), 'KÖL');
  assert.equal(cyrToJany('күз', { vowels: 'latin-umlaut' }), 'küz');
  assert.equal(cyrToJany('күү', { vowels: 'latin-umlaut' }), 'küü');

  // cyrillic-u display (ө / ұ)
  assert.equal(cyrToJany('күз', { vowels: 'cyrillic-u' }), 'kұz');

  // draft-macron legacy (ө / ū)
  assert.equal(cyrToJany('күз', { vowels: 'draft-macron' }), 'kūz');

  // dotless-i (ı)
  assert.equal(cyrToJany('кыргыз', { yGrapheme: 'dotless-i' }), 'kırgız');
  assert.equal(cyrToJany('Кыргыз', { yGrapheme: 'dotless-i' }), 'Kırgız');
  assert.equal(cyrToJany('КЫРГЫЗ', { yGrapheme: 'dotless-i' }), 'KIRGIZ');

  // digraph (ch / sh)
  assert.equal(cyrToJany('чай', { sibilants: 'digraph' }), 'chaí');
  assert.equal(cyrToJany('шаар', { sibilants: 'digraph' }), 'shaar');
  assert.equal(cyrToJany('Чай', { sibilants: 'digraph' }), 'Chaí');
  assert.equal(cyrToJany('ШААР', { sibilants: 'digraph' }), 'SHAAR');

  // glideGrapheme: y (CTA standard)
  assert.equal(cyrToJany('ай', { glideGrapheme: 'y' }), 'ay');
  assert.equal(cyrToJany('чай', { glideGrapheme: 'y' }), 'çay');
  assert.equal(cyrToJany('чай', { glideGrapheme: 'y', sibilants: 'digraph' }), 'chay');
  assert.equal(cyrToJany('бий', { glideGrapheme: 'y' }), 'biy');
  assert.equal(cyrToJany('кийет', { glideGrapheme: 'y' }), 'kiyet');
  assert.equal(cyrToJany('окуя', { glideGrapheme: 'y' }), 'okuya');
  assert.equal(cyrToJany('саякат', { glideGrapheme: 'y' }), 'sayakat');
  assert.equal(cyrToJany('аюу', { glideGrapheme: 'y' }), 'ayuu');
  assert.equal(cyrToJany('ёлка', { glideGrapheme: 'y' }), 'yolka');
  assert.equal(cyrToJany('тыюу', { yGrapheme: 'dotless-i', glideGrapheme: 'y' }), 'tıyuu');

  // glideGrapheme: i (plain ASCII without -iy exception: creates ambiguous -ii and barcode -iii)
  assert.equal(cyrToJany('ай', { glideGrapheme: 'i' }), 'ai');
  assert.equal(cyrToJany('чай', { glideGrapheme: 'i' }), 'çai');
  assert.equal(cyrToJany('чай', { glideGrapheme: 'i', sibilants: 'digraph' }), 'chai');
  assert.equal(cyrToJany('бий', { glideGrapheme: 'i' }), 'bii');
  assert.equal(cyrToJany('бийик', { glideGrapheme: 'i' }), 'biiik');
  assert.equal(cyrToJany('кийин', { glideGrapheme: 'i' }), 'kiiin');
  assert.equal(cyrToJany('окуя', { glideGrapheme: 'i' }), 'okuia');
  assert.equal(cyrToJany('Европа', { glideGrapheme: 'i' }), 'Ievropa');

  // glideGrapheme: breve-i / tilde-i (§7 marked alternatives) behave like í
  for (const [g, m] of [['breve-i', 'ĭ'], ['tilde-i', 'ĩ']] as const) {
    assert.equal(cyrToJany('ай', { glideGrapheme: g }), `a${m}`);
    assert.equal(cyrToJany('бийик', { glideGrapheme: g }), `bi${m}ik`);
    assert.equal(cyrToJany('окуя', { glideGrapheme: g }), `oku${m}a`);
    assert.equal(cyrToJany('аюу', { glideGrapheme: g }), `a${m}uu`);
    assert.equal(cyrToJany('кийет', { glideGrapheme: g }), `ki${m}et`);
    assert.equal(cyrToJany('Европа', { glideGrapheme: g }), `${m.toUpperCase()}evropa`);
    assert.equal(cyrToJany('КИЙИМ', { glideGrapheme: g }), `KI${m.toUpperCase()}IM`);
    assert.equal(cyrToJany('объект', { glideGrapheme: g }), `ob${m}ekt`);
  }

  // glideGrapheme: acute-i (the Jany-Latyn default)
  assert.equal(cyrToJany('окуя'), 'okuía');
  assert.equal(cyrToJany('саякат'), 'saíakat');
  assert.equal(cyrToJany('аюу'), 'aíuu');
  assert.equal(cyrToJany('ёлка'), 'íolka');
  assert.equal(cyrToJany('тыюу'), 'tyíuu');
  assert.equal(cyrToJany('бийик', { glideGrapheme: 'acute-i' }), 'biíik');
  assert.equal(cyrToJany('бий', { glideGrapheme: 'acute-i' }), 'bií');
  assert.equal(cyrToJany('чай', { glideGrapheme: 'acute-i' }), 'çaí');

  // uvularK: q (CTA allophonic)
  assert.equal(cyrToJany('кыргыз', { uvularK: 'q' }), 'qyrgyz');
  assert.equal(cyrToJany('Кыргыз', { uvularK: 'q' }), 'Qyrgyz');
  assert.equal(cyrToJany('КЫРГЫЗ', { uvularK: 'q' }), 'QYRGYZ');
  assert.equal(cyrToJany('кал', { uvularK: 'q' }), 'qal');
  assert.equal(cyrToJany('кол', { uvularK: 'q' }), 'qol');
  assert.equal(cyrToJany('куш', { uvularK: 'q' }), 'quş');
  assert.equal(cyrToJany('куш', { uvularK: 'q', sibilants: 'digraph' }), 'qush');
  assert.equal(cyrToJany('ак', { uvularK: 'q' }), 'aq');
  assert.equal(cyrToJany('тоок', { uvularK: 'q' }), 'tooq');
  assert.equal(cyrToJany('кел', { uvularK: 'q' }), 'kel');
  assert.equal(cyrToJany('кир', { uvularK: 'q' }), 'kir');
  assert.equal(cyrToJany('көл', { uvularK: 'q' }), 'köl');
  assert.equal(cyrToJany('көл', { uvularK: 'q', vowels: 'hybrid' }), 'kөl');
  assert.equal(cyrToJany('көл', { uvularK: 'q', vowels: 'latin-umlaut' }), 'köl');
  assert.equal(cyrToJany('күз', { uvularK: 'q' }), 'küz');
  assert.equal(cyrToJany('бийик', { uvularK: 'q' }), 'biíik');
  // Syllabic coda/onset vowel precedence and mixed-harmony word handling
  assert.equal(cyrToJany('карек', { uvularK: 'q' }), 'qarek');
  assert.equal(cyrToJany('байке', { uvularK: 'q' }), 'baíke');
  assert.equal(cyrToJany('республика', { uvularK: 'q' }), 'respublika');
  assert.equal(
    cyrToJany('Кыргыз Республикасы', { uvularK: 'q', yGrapheme: 'dotless-i' }),
    'Qırgız Respublikası'
  );
  assert.equal(cyrToJany('экономика', { uvularK: 'q' }), 'ekonomika');

  // Full CTA combination
  assert.equal(
    cyrToJany('Ак мөңгүлүү аска, Кыргызстан, чай!', {
      vowels: 'latin-umlaut',
      yGrapheme: 'dotless-i',
      glideGrapheme: 'y',
      sibilants: 'cedilla',
      uvularK: 'q',
    }),
    'Aq möŋgülüü asqa, Qırgızstan, çay!'
  );
});

test('janyToCyr handles all post-peer-review variants', () => {
  // Latin umlauts and legacy/hybrid Cyrillic ө
  assert.equal(janyToCyr('köl'), 'көл');
  assert.equal(janyToCyr('kөl'), 'көл');
  assert.equal(janyToCyr('küz'), 'күз');
  assert.equal(janyToCyr('Köl'), 'Көл');
  assert.equal(janyToCyr('KÖL'), 'КӨЛ');

  // Southern ä
  assert.equal(janyToCyr('äkä'), 'ака');
  assert.equal(janyToCyr('källä'), 'калла');

  // Dotless ı
  assert.equal(janyToCyr('kırgız'), 'кыргыз');
  assert.equal(janyToCyr('Kırgız'), 'Кыргыз');

  // Uvular q
  assert.equal(janyToCyr('qyrgyz'), 'кыргыз');
  assert.equal(janyToCyr('Qyrgyz'), 'Кыргыз');
  assert.equal(janyToCyr('Qırgız'), 'Кыргыз');
  assert.equal(janyToCyr('qal'), 'кал');
  assert.equal(janyToCyr('aq'), 'ак');
  assert.equal(janyToCyr('tooq'), 'тоок');

  // Glide y after vowel
  assert.equal(janyToCyr('ay'), 'ай');
  assert.equal(janyToCyr('chay'), 'чай');
  assert.equal(janyToCyr('biy'), 'бий');
  assert.equal(janyToCyr('biyi'), 'бийи');
  assert.equal(janyToCyr('Biyi'), 'Бийи');
  assert.equal(janyToCyr('kiydi'), 'кийди');
  assert.equal(janyToCyr('kiyet'), 'кийет');
  assert.equal(janyToCyr('tıy'), 'тый');

  // Cedillas
  assert.equal(janyToCyr('çai'), 'чай');
  assert.equal(janyToCyr('şaar'), 'шаар');
  assert.equal(janyToCyr('Çai'), 'Чай');
  assert.equal(janyToCyr('ŞAAR'), 'ШААР');

  // ya, yu, yo and ía, íu, ío digraphs (glide y & í)
  assert.equal(janyToCyr('okuya'), 'окуя');
  assert.equal(janyToCyr('okuía'), 'окуя');
  assert.equal(janyToCyr('sayakat'), 'саякат');
  assert.equal(janyToCyr('saíakat'), 'саякат');
  assert.equal(janyToCyr('ayuu'), 'аюу');
  assert.equal(janyToCyr('aíuu'), 'аюу');
  assert.equal(janyToCyr('tıyuu'), 'тыюу');
  assert.equal(janyToCyr('tyíuu'), 'тыюу');
  assert.equal(janyToCyr('yolka'), 'ёлка');
  assert.equal(janyToCyr('íolka'), 'ёлка');
  assert.equal(janyToCyr("sem'ya"), 'семья');
  assert.equal(janyToCyr("sem'ía"), 'семья');
});

test('janyToFallback handles all variants', () => {
  assert.equal(janyToFallback('köl'), 'kol');
  assert.equal(janyToFallback('küz'), 'kuz');
  assert.equal(janyToFallback('äkä'), 'aka');
  // §19 strip-only (default)
  assert.equal(janyToFallback('çai'), 'cai');
  assert.equal(janyToFallback('şaar'), 'saar');
  // §19 digraph style is opt-in
  assert.equal(janyToFallback('çai', 'digraph'), 'chai');
  assert.equal(janyToFallback('şaar', 'digraph'), 'shaar');
});

test('sibilant disambiguation and contrast cases', () => {
  // Disambiguation: исхак → ishak (с+х), ишак → işak (ш)
  assert.equal(cyrToJany('исхак'), 'ishak');
  assert.equal(cyrToJany('ишак'), 'işak');
  // Without restoreLoans: sh digraph causes ishak→ишак (documented merger §18.2)
  assert.equal(janyToCyr('ishak'), 'ишак');
  assert.equal(janyToCyr('işak'), 'ишак');
  // With restoreLoans: prefix list restores Исхак
  assert.equal(janyToCyr('ishak', { restoreLoans: true }), 'исхак');
  assert.equal(janyToCyr('işak', { restoreLoans: true }), 'ишак');

  // Disambiguation: kesçi (кесчи) vs keschi (digraph collision test)
  assert.equal(cyrToJany('кесчи'), 'kesçi');
  assert.equal(janyToCyr('kesçi'), 'кесчи');
  assert.equal(cyrToJany('кесчи', { sibilants: 'digraph' }), 'keschi');

  // Compound clusters: başçy (башчы) vs bashchy
  assert.equal(cyrToJany('башчы'), 'başçy');
  assert.equal(janyToCyr('başçy'), 'башчы');
  assert.equal(cyrToJany('башчы', { sibilants: 'digraph' }), 'bashchy');
  assert.equal(janyToCyr('bashchy'), 'башчы'); // backward compatibility
});

test('reverse conversion of absorbed Russian signs', () => {
  // Without restoreLoans: core gives lossy output — ь/ъ signs cannot be recovered (§18.2)
  assert.equal(janyToCyr('obíekt'), 'обект');
  assert.equal(janyToCyr('subíekt'), 'субект');
  assert.equal(janyToCyr('síezd'), 'сезд');
  assert.equal(janyToCyr('semía'), 'семя');
  assert.equal(janyToCyr('iíul'), 'июл');
  assert.equal(janyToCyr('aprel'), 'апрел');
  assert.equal(janyToCyr('rol'), 'рол');
  assert.equal(janyToCyr('kontrol'), 'контрол');
  assert.equal(janyToCyr('albom'), 'албом');
  assert.equal(janyToCyr('film'), 'филм');

  // With restoreLoans: loan dictionary restores correct Cyrillic spellings (§18.2)
  assert.equal(janyToCyr('obíekt', { restoreLoans: true }), 'объект');
  assert.equal(janyToCyr('subíekt', { restoreLoans: true }), 'субъект');
  assert.equal(janyToCyr('síezd', { restoreLoans: true }), 'съезд');
  assert.equal(janyToCyr('semía', { restoreLoans: true }), 'семья');
  assert.equal(janyToCyr('iíul', { restoreLoans: true }), 'июль');
  assert.equal(janyToCyr('aprel', { restoreLoans: true }), 'апрель');
  assert.equal(janyToCyr('rol', { restoreLoans: true }), 'роль');
  assert.equal(janyToCyr('kontrol', { restoreLoans: true }), 'контроль');
  assert.equal(janyToCyr('albom', { restoreLoans: true }), 'альбом');
  assert.equal(janyToCyr('film', { restoreLoans: true }), 'фильм');

  // Legacy apostrophe forms remain backward-compatible
  assert.equal(janyToCyr("ob'ekt"), 'объект');
  assert.equal(janyToCyr("sem'ía"), 'семья');
});


test('§7 marked glides reverse exactly like the Jany-Latyn í', () => {
  const words = ['бийик', 'кийим', 'кийет', 'тийиштүү', 'айтса', 'окуя', 'аюу', 'коён', 'Бий', 'АЙ'];
  for (const cyr of words) {
    const janyLatyn = janyToCyr(cyrToJany(cyr));
    for (const g of ['breve-i', 'tilde-i'] as const) {
      assert.equal(janyToCyr(cyrToJany(cyr, { glideGrapheme: g })), janyLatyn, `${g}: ${cyr}`);
    }
  }
});
