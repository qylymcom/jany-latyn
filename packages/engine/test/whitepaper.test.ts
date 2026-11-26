// SPDX-License-Identifier: MIT
/**
 * Whitepaper conformance tests — each test block names the section it covers.
 * A failure here means the engine disagrees with docs/WHITEPAPER.md.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cyrToJany, janyToCyr, janyToFallback, foldKey } from '../src/convert.js';

// ---------------------------------------------------------------------------
// §18.1  Native round-trip fixtures
// "Native Kyrgyz vocabulary round-trips exactly"
// ---------------------------------------------------------------------------
test('§18.1 native round-trip: vowel harmony and basic morphology', () => {
  for (const cyr of [
    'жаңы', 'күнгө', 'башчы', 'тоок',
    'эне', 'мектеп', 'ааламдык',
  ]) {
    assert.equal(janyToCyr(cyrToJany(cyr)), cyr, `round-trip failed: ${cyr}`);
  }
});

test('§18.1 native round-trip: ts cluster (must not collapse to ц)', () => {
  for (const cyr of ['өтсө', 'кетсе', 'айтса']) {
    assert.equal(janyToCyr(cyrToJany(cyr)), cyr, `round-trip failed: ${cyr}`);
  }
  // Forward: ц → ts
  assert.equal(cyrToJany('цирк'), 'tsirk');
  // Reverse: ts → тс (native-priority §18.1) — loan ц is the accepted loss
  assert.equal(janyToCyr('tsirk'), 'тсирк');
});

test('§18.1 native round-trip: íe glide and kii- root forms', () => {
  for (const cyr of ['кийет', 'тийет', 'тийиштүү', 'бийик']) {
    assert.equal(janyToCyr(cyrToJany(cyr)), cyr, `round-trip failed: ${cyr}`);
  }
  // Forward: кийет → kiíet
  assert.equal(cyrToJany('кийет'), 'kiíet');
  // Reverse: post-vocalic íe → йе
  assert.equal(janyToCyr('kiíet'), 'кийет');
});

test('§18.1 native round-trip: long ee vowel', () => {
  for (const cyr of ['ээги', 'керээз', 'кээде', 'жээк']) {
    assert.equal(janyToCyr(cyrToJany(cyr)), cyr, `round-trip failed: ${cyr}`);
  }
});

// ---------------------------------------------------------------------------
// §18.1  Documented losses — asserted so a "fix" that silently restores them fails
// ---------------------------------------------------------------------------
test('§18.1 documented loss: loan ц → тс (tsirk round-trips to тсирк, not цирк)', () => {
  assert.equal(cyrToJany('цирк'), 'tsirk');
  assert.equal(janyToCyr('tsirk'), 'тсирк');
  assert.notEqual(janyToCyr('tsirk'), 'цирк');
});

test('§18.1 documented loss: post-vocalic loan е → йе', () => {
  assert.equal(janyToCyr('proíekt'), 'пройект');
  assert.notEqual(janyToCyr('proíekt'), 'проект');

  assert.equal(janyToCyr('pereíezd'), 'перейезд');
  assert.notEqual(janyToCyr('pereíezd'), 'переезд');
});

test('§18.1 documented loss: íon → раён (ío → ё, not йо)', () => {
  // ío → ё: раіon → раён (iotated ё, not й+о)
  assert.equal(janyToCyr('raíon'), 'раён');
});

test('§18.1 documented loss: semía → семя (ь not recovered without restoreLoans)', () => {
  assert.equal(janyToCyr('semía'), 'семя');
  assert.notEqual(janyToCyr('semía'), 'семья');
});

test('§18.1 documented loss: borş → борш (щ merges into ш)', () => {
  assert.equal(cyrToJany('борщ'), 'borş');
  assert.equal(janyToCyr('borş'), 'борш');
  assert.notEqual(janyToCyr('borş'), 'борщ');
});

test('§18.1 documented loss: aprel → апрел (ь not recovered without restoreLoans)', () => {
  assert.equal(janyToCyr('aprel'), 'апрел');
  assert.notEqual(janyToCyr('aprel'), 'апрель');
});

test('§18.1 documented loss: poet → поет (post-vocalic э not restored)', () => {
  assert.equal(janyToCyr('poet'), 'поет');
});

// ---------------------------------------------------------------------------
// §18.2  Loan restoration — opt-in only
// ---------------------------------------------------------------------------
test('§18.2 restoreLoans restores ъ/ь and post-vocalic е loanwords', () => {
  const opts = { restoreLoans: true };
  assert.equal(janyToCyr('semía', opts), 'семья');
  assert.equal(janyToCyr('obíekt', opts), 'объект');
  assert.equal(janyToCyr('síezd', opts), 'съезд');
  assert.equal(janyToCyr('iíul', opts), 'июль');
  assert.equal(janyToCyr('aprel', opts), 'апрель');
  assert.equal(janyToCyr('pereíezd', opts), 'переезд');
  assert.equal(janyToCyr('poíezd', opts), 'поезд');
  assert.equal(janyToCyr('proíekt', opts), 'проект');
  assert.equal(janyToCyr('film', opts), 'фильм');
});

test('§18.1 post-vocalic i reads as й; §18.2 restores loan и after a vowel and loan ь', () => {
  const opts = { restoreLoans: true };
  // The plain form and the i glide write й as i, so the core reads i after a vowel as й (§18.1).
  assert.equal(janyToCyr('bai'), 'бай');
  assert.equal(janyToCyr('tooi'), 'тоой');
  assert.equal(janyToCyr('ukrain'), 'украйн');
  assert.equal(janyToCyr('arhaizm'), 'архайзм');
  // Every entry restores exactly the word it was taken from, with its suffixes.
  for (const word of ['украин', 'Украина', 'архаизм', 'интуитивдүү', 'биоинформатика', 'альтернатива', 'альтернативдүү',
    'Альтернативалар', 'тильда', 'тильдага', 'тильдалуу', 'компьютер', 'компьютерде', 'постальвеолярдык',
    'модель', 'стиль', 'январь', 'седиль']) {
    assert.equal(janyToCyr(cyrToJany(word), opts), word);
  }
  // Kyrgyz spelling drops the final ь before a suffix, so suffixed forms come from the core unchanged.
  for (const word of ['модели', 'моделдерде', 'стилдик', 'стилиндеги', 'январынан', 'седилдер', 'седилдүү']) {
    assert.equal(janyToCyr(cyrToJany(word), opts), word);
  }
  // Native words that share the opening letters are untouched.
  for (const word of ['тилди', 'тилдин', 'бай', 'тоой', 'үй']) {
    assert.equal(janyToCyr(cyrToJany(word), opts), word);
  }
});

test('§18.2 the book\'s entries: place names, states and vocabulary come back with their suffixes', () => {
  const opts = { restoreLoans: true };
  for (const word of ['Тянь', 'Шань', 'Сибирь', 'Юань', 'Цин', 'Цинге', 'депортацияланган', 'миграциясын', 'конфедерациясынын',
    'федерациясын', 'диссертация', 'процесс', 'процесстин', 'реконструкцияларына', 'конструкцияларынын', 'провинциясындагы',
    'медициналык', 'концепциялар', 'компиляциядагы', 'цивилизациясын', 'энциклопедист', 'классификациялайт', 'селекция',
    'популяциялык', 'рецензияланган', 'конференциянын', 'цитаталар', 'циклдин', 'сценарийди', 'императрица', 'царь',
    'фольклордук', 'дельтасына', 'афанасьевдик', 'Тобольск', 'Харьков', 'селькуптар', 'бельтир', 'культун', 'съезддерде',
    'кереит', 'ламаисттик', 'архаикалык', 'лагерь', 'профиль']) {
    assert.equal(janyToCyr(cyrToJany(word), opts), word);
  }
  // Хань is left out on purpose: its Latin form han is also native хан.
  assert.equal(janyToCyr('han', opts), 'хан');
});

test('§18.2 restoreLoans restores loan ц stems and keeps their suffixes', () => {
  const opts = { restoreLoans: true };
  // Without the list the core reads ts as т+с (§18.1).
  assert.equal(janyToCyr('kirillitsa'), 'кириллитса');
  assert.equal(janyToCyr('kirillitsasy', opts), 'кириллицасы');
  assert.equal(janyToCyr('Kirillitsadan', opts), 'Кириллицадан');
  assert.equal(janyToCyr('konfiguratsiíalar', opts), 'конфигурациялар');
  assert.equal(janyToCyr('pozitsiíada', opts), 'позицияда');
  assert.equal(janyToCyr('transliteratsiíalanat', opts), 'транслитерацияланат');
  assert.equal(janyToCyr('printsip', opts), 'принцип');
  assert.equal(janyToCyr('printsibi', opts), 'принциби');
  assert.equal(janyToCyr('tablitsasynan', opts), 'таблицасынан');
  assert.equal(janyToCyr('sotsiolingvistikalyk', opts), 'социолингвистикалык');
  // Every entry restores exactly the word it was taken from.
  for (const word of ['абзацтарда', 'лицензиясында', 'прецедент', 'инициалдык', 'стационардык', 'цифрасы',
    'циркумфлекс', 'француз', 'функционалдык', 'аннотациясы', 'артикуляция', 'ассимиляция', 'документациянын',
    'интуицияга', 'коммерциялык', 'операциясы', 'оппозиция', 'палатализацияны', 'реакциясы', 'редакциялык',
    'романизациясы', 'спецификациядагы', 'тенденциялар', 'токенизацияланышы', 'транскрипциялоого', 'матрицасында']) {
    assert.equal(janyToCyr(cyrToJany(word), opts), word);
  }
  // Native т+с is untouched: the entries are loan stems only.
  for (const word of ['кетсе', 'айтса', 'өтсө', 'тосту', 'катсыз']) {
    assert.equal(janyToCyr(cyrToJany(word), opts), word);
  }
});

test('§18.2 restoreLoans drops a restored final ь before any suffix, as Kyrgyz spells it', () => {
  const opts = { restoreLoans: true };
  assert.equal(janyToCyr('apreli', opts), 'апрели');
  assert.equal(janyToCyr('aprelinde', opts), 'апрелинде');
  assert.equal(janyToCyr('iíulunda', opts), 'июлунда');
  // and before a consonant suffix, as Kyrgyz text writes it (июлда, апрелге)
  assert.equal(janyToCyr('iíulda', opts), 'июлда');
  assert.equal(janyToCyr('aprelge', opts), 'апрелге');
  assert.equal(janyToCyr('aprel', opts), 'апрель');
});

// ---------------------------------------------------------------------------
// Appendix A  е/э/ee/íe system — four-rule algorithm
// ---------------------------------------------------------------------------
test('Appendix A forward: word-initial iotated е → íe; word-initial non-iotated э → e', () => {
  assert.equal(cyrToJany('Европа'), 'Íevropa');
  assert.equal(cyrToJany('енот'), 'íenot');
  assert.equal(cyrToJany('эл'), 'el');
  assert.equal(cyrToJany('эне'), 'ene');
});

test('Appendix A forward: doubled ээ → ee', () => {
  assert.equal(cyrToJany('ээги'), 'eegi');
  assert.equal(cyrToJany('керээз'), 'kereez');
});

test('Appendix A forward: post-vocalic е in iotated loan → íe', () => {
  assert.equal(cyrToJany('переезд'), 'pereíezd');
  assert.equal(cyrToJany('проект'), 'proíekt');
  assert.equal(cyrToJany('поэт'), 'poet');  // non-iotated: stays e
});

test('Appendix A reverse: ee → ээ; word-initial e → э; post-consonantal e → е', () => {
  assert.equal(janyToCyr('eegi'), 'ээги');
  assert.equal(janyToCyr('el'), 'эл');
  assert.equal(janyToCyr('ene'), 'эне');
  assert.equal(janyToCyr('kel'), 'кел');
  assert.equal(janyToCyr('mektep'), 'мектеп');
});

// ---------------------------------------------------------------------------
// Appendix B / §19  foldKey — the full and plain forms map to the same key
// ---------------------------------------------------------------------------
test('Appendix B foldKey: full and plain forms land on the same key', () => {
  const pairs: [string, string][] = [
    ['köl', 'kol'],       // formal/casual
    ['küz', 'kuz'],
    ['çaí', 'cai'],
    ['başçy', 'bascy'],   // ş→s, ç→c in casual strip
    ['jaŋy', 'jany'],
    ['biíik', 'biiik'],
  ];
  for (const [formal, casual] of pairs) {
    assert.equal(foldKey(formal), foldKey(casual), `foldKey mismatch: ${formal} vs ${casual}`);
  }
});

test('Appendix B foldKey: ŋ folds to n (explicit — no Unicode decomposition)', () => {
  assert.equal(foldKey('jaŋy'), 'jany');
  assert.equal(foldKey('JAŊY'), 'jany');
  assert.equal(foldKey('jañy'), 'jany');  // tilde-n alternative
});

test('Appendix B foldKey: every native round-trip word folds equal to its plain form', () => {
  const natives = [
    'өтсө', 'кетсе', 'айтса', 'кийет', 'тийиштүү', 'бийик',
    'жаңы', 'күнгө', 'башчы', 'тоок', 'ээги', 'керээз', 'эне', 'мектеп',
  ];
  for (const cyr of natives) {
    const formal = cyrToJany(cyr);
    const casual = janyToFallback(formal);
    assert.equal(foldKey(formal), foldKey(casual), `foldKey mismatch for ${cyr}: ${formal} vs ${casual}`);
  }
});

// ---------------------------------------------------------------------------
// §19  Plain form — one-way, documented mergers
// ---------------------------------------------------------------------------
test('§19 plain form: strip-only is the default', () => {
  assert.equal(janyToFallback('çaí'), 'cai');
  assert.equal(janyToFallback('başçy'), 'bascý'.replace('ý', 'y'));  // ç→c, ş→s
  assert.equal(janyToFallback('jaŋy'), 'jany');
  assert.equal(janyToFallback('biíik'), 'biiik');
  assert.equal(janyToFallback('köl'), 'kol');
  assert.equal(janyToFallback('küz'), 'kuz');
});

test('§19 plain form: documented mergers (кол/көл, жаңы/жаны)', () => {
  assert.equal(janyToFallback(cyrToJany('кол')), 'kol');
  assert.equal(janyToFallback(cyrToJany('көл')), 'kol');
  assert.equal(janyToFallback(cyrToJany('жаңы')), 'jany');
  assert.equal(janyToFallback(cyrToJany('жаны')), 'jany');
  // §19: strip fallback merges баш and бас under 'bas'
  assert.equal(janyToFallback(cyrToJany('баш')), 'bas');
  assert.equal(janyToFallback(cyrToJany('бас')), 'bas');
});

test('§19 plain form: digraph style is opt-in, not default', () => {
  assert.equal(janyToFallback('çaí', 'digraph'), 'chai');
  assert.equal(janyToFallback('başçy', 'digraph'), 'bashchy');
  assert.equal(janyToFallback('köl', 'digraph'), 'kol');   // non-sibilants still strip
});

// ---------------------------------------------------------------------------
// §7  Option matrix smoke tests — every documented configuration produces output
// ---------------------------------------------------------------------------
test('§7 option matrix: front rounded vowels (four configurations)', () => {
  // latin-umlaut (the Jany-Latyn default)
  assert.equal(cyrToJany('күл'), 'kül');
  assert.equal(cyrToJany('көл'), 'köl');

  // hybrid: Cyrillic ө + Latin ü
  assert.match(cyrToJany('көл', { vowels: 'hybrid' }), /^kөl$/);  // Cyrillic ő U+04E9
  assert.equal(cyrToJany('күл', { vowels: 'hybrid' }), 'kül');

  // cyrillic-u: Cyrillic ө + Kazakh ұ
  assert.match(cyrToJany('көл', { vowels: 'cyrillic-u' }), /^kөl$/);
  assert.equal(cyrToJany('күл', { vowels: 'cyrillic-u' }), 'kұl');

  // draft-macron: Cyrillic ő + macron ū
  assert.match(cyrToJany('көл', { vowels: 'draft-macron' }), /^kөl$/);
  assert.equal(cyrToJany('күл', { vowels: 'draft-macron' }), 'kūl');
});

test('§7 option matrix: sibilants (cedilla vs digraph)', () => {
  assert.equal(cyrToJany('чай'), 'çaí');                                  // default cedilla
  assert.equal(cyrToJany('чай', { sibilants: 'digraph' }), 'chaí');
  assert.equal(cyrToJany('шаар', { sibilants: 'digraph' }), 'shaar');
});

test('§7 option matrix: velar nasal (ŋ vs ñ)', () => {
  assert.equal(cyrToJany('жаңы'), 'jaŋy');                          // default eng
  // жаңы = ж+а+ң+ы → j+a+ñ+y in tilde-n mode
  assert.equal(cyrToJany('жаңы', { velarNasal: 'tilde-n' }), 'jañy');
  // Reverse: ñ → ң
  assert.equal(janyToCyr('jañy'), 'жаңы');
});

test('§7 option matrix: back unrounded vowel (y vs dotless-ı)', () => {
  assert.equal(cyrToJany('кыргыз'), 'kyrgyz');                         // default y
  assert.equal(cyrToJany('кыргыз', { yGrapheme: 'dotless-i' }), 'kırgız');
  // Reverse: dotless ı → ы
  assert.equal(janyToCyr('kırgız'), 'кыргыз');
  // §19: the plain form must be ASCII even in the ı configuration
  assert.equal(janyToFallback('kırgız'), 'kirgiz');
  // Appendix B: the ı-config full form and its plain form fold to the same key
  assert.equal(foldKey('kırgız'), foldKey('kirgiz'));
});

test('§7 option matrix: uvular consonant (unified k vs allophonic q)', () => {
  assert.equal(cyrToJany('кыргыз'), 'kyrgyz');                         // default k
  assert.equal(cyrToJany('кыргыз', { uvularK: 'q' }), 'qyrgyz');
  assert.equal(cyrToJany('кел', { uvularK: 'q' }), 'kel');             // front vowel: stays k
});

test('§7 option matrix: ASCII fallback (strip vs digraph, §19)', () => {
  assert.equal(janyToFallback('başçy'), 'bascý'.replace('ý', 'y'));
  // Simpler: assert each sibilant
  assert.equal(janyToFallback('ş'), 's');
  assert.equal(janyToFallback('ç'), 'c');
  assert.equal(janyToFallback('ş', 'digraph'), 'sh');
  assert.equal(janyToFallback('ç', 'digraph'), 'ch');
});

// ---------------------------------------------------------------------------
// §20  Extended (compose-mode) letters: ä, x, w
// Never emitted by cyrToJany; reverse folds each to its Cyrillic base.
// ---------------------------------------------------------------------------
test('§20 extended letters reverse-fold to their Cyrillic base', () => {
  assert.equal(janyToCyr('äkä'), 'ака');       // ä → а
  assert.equal(janyToCyr('källä'), 'калла');
  assert.equal(janyToCyr('xaram'), 'харам');   // x → х
  assert.equal(janyToCyr('Xaram'), 'Харам');
  assert.equal(janyToCyr('Buhara'), 'Бухара'); // h and x both fold to х
  assert.equal(janyToCyr('taw'), 'тав');       // w → в
  assert.equal(janyToCyr('watan'), 'ватан');
  assert.equal(janyToCyr('XALYK'), 'ХАЛЫК');   // ALL-CAPS extended letter
});

test('§20 extended letters are never emitted by forward conversion', () => {
  // cyrToJany cannot produce ä/x/w — Cyrillic writes one а, one х, one в
  assert.equal(cyrToJany('ака'), 'aka');
  assert.equal(cyrToJany('харам'), 'haram');
  assert.equal(cyrToJany('ватан'), 'vatan');
});

test('Appendix B foldKey: x/w folds are configuration-dependent', () => {
  // ä folds unconditionally (NFD decomposition, no competing value)
  assert.equal(foldKey('äkä'), foldKey('aka'));

  // With the compose-mode letter OFF (default): x and w fold to themselves,
  // so foreign names keep their international value.
  assert.notEqual(foldKey('xaram'), foldKey('haram'));
  assert.notEqual(foldKey('taw'), foldKey('tav'));
  assert.equal(foldKey('Linux'), 'linux');   // x → x
  assert.equal(foldKey('X Factor'), 'x factor');

  // With the compose-mode letter ON: the split unifies for search.
  assert.equal(
    foldKey('xaram', { extendedLetters: ['x'] }),
    foldKey('haram', { extendedLetters: ['x'] })
  );
  assert.equal(
    foldKey('taw', { extendedLetters: ['w'] }),
    foldKey('tav', { extendedLetters: ['w'] })
  );
});

test('Appendix B foldKey: digraph-fallback register equivalence', () => {
  // Strip fallback: casual IS the folded form — keys match with no options.
  assert.equal(foldKey('çaí'), foldKey('cai'));
  assert.equal(foldKey('başçy'), foldKey('bascy'));

  // Digraph fallback: keys match only with digraphInput, differ without it.
  assert.notEqual(foldKey('çaí'), foldKey('chai'));
  assert.equal(foldKey('çaí'), foldKey('chai', { digraphInput: true }));
  assert.equal(foldKey('başçy'), foldKey('bashchy', { digraphInput: true }));

  // digraphInput is not the default: formal ch/sh sequences stay distinct.
  assert.notEqual(foldKey('başçy'), foldKey('bashchy'));
});
