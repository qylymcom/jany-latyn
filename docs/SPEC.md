# jany-latyn — Specification

A practical Latin extended script for modern Kyrgyz, designed around how
Kyrgyz speakers already transliterate when a Cyrillic keyboard is absent.
Status: draft v0.3.

> For the comprehensive linguistic, sociolinguistic, and typographic case for
> this script, see [WHITEPAPER.md](WHITEPAPER.md).

## 1. Canonical mapping

### Vowels

| Cyrillic | Canonical | Long (doubled) | ASCII strip fallback |
|---|---|---|---|
| а | a | aa | unchanged |
| э, е | e | ee | unchanged |
| ы | y | yy | unchanged |
| и | i | ii | unchanged |
| ө | ö (Latin U+00F6, cap Ö U+00D6) | öö | o / oo |
| у | u | uu | unchanged |
| ү | ü (Latin U+00FC, cap Ü U+00DC) | üü | u / uu |

Standard Jany uses Latin **ö** (Öö U+00D6 / U+00F6) and Latin **ü** (Üü
U+00DC / U+00FC). Cyrillic ө (Өө U+04E8/U+04E9, hybrid mode), Kazakh ұ
(Ұұ U+04B0/U+04B1), and macron ū (Ūū U+016A/U+016B) remain supported as
secondary display variants and in reverse transliteration.

### Consonants

| Cyrillic | Canonical | Notes |
|---|---|---|
| б г д | b g d | |
| ж | j | all contexts; zh does not exist (ажыратуу → ajyratuu) |
| з | z | |
| й | í (Latin U+00ED, cap Í U+00CD) | universal palatal glide /j/ (aí, toí, tyíyn, biíik, kiíim); ĭ and ĩ available as marked testbed alternatives (§11.1 whitepaper) |
| к | k | q not used by default; back-vowel [q] allophone is predictable |
| л м н | l m n | |
| ң | ŋ (U+014B, cap Ŋ U+014A) | canonical; ñ (U+00F1) available as first-class testbed option (§5.3 whitepaper) |
| п р с т | p r s t | |
| в ф | v f | loans only |
| х | h | рахмат → rahmat |
| ц | ts | loans only; reverse is тс (native-priority §9.1 whitepaper) — see §4 |
| ч | ç (Latin U+00E7, cap Ç U+00C7) | strip fallback c; digraph fallback ch; чай → çaí |
| ш | ş (Latin U+015F, cap Ş U+015E) | strip fallback s; digraph fallback sh; шаар → şaar |
| щ | ş | loan only; merged into ş (ящик → íaşik) |
| ъ ь | — (absorbed) | absorbed into í glides (объект → obíekt, семья → semía) and dropped at coda (июль → iíul); words are 100% alphabetic |
| я ё ю | ía ío íu | systematic iotation (saíakat, koíon, aíuu) |

## 2. Rules

1. **Vowel length.** Written doubled, exactly mirroring Kyrgyz Cyrillic
   (тоок → took, Ала-Тоо → Ala-Too, маалымат → maalymat). No diacritics:
   doubling survives web search, plain keyboards, and existing SMS habit.

2. **Universal glide í.** The palatal glide [j] (Cyrillic й) is written as
   **í** in all phonotactic positions:
   - Coda & diphthongal off-glides: **`ай → aí`**, **`той → toí`**, **`чай → çaí`**.
   - Back vowels: **`тыйын → tyíyn`**, **`кыйык → kyíyk`**, **`сыйлык → syílyk`**.
   - High-front roots: **`бий → bií`**, **`бийик → biíik`**, **`кийин → kiíin`**, **`тийиштүү → tiíiştüü`**.
   - Verbal root preservation: **`кийет → kiíet`**, **`тийет → tiíet`**.

3. **Sibilant cedillas & sign absorption.** Sibilants use **`ç`** (*ч*) and
   **`ş`** (*ш, щ*), preventing stem-suffix collisions (*башчысы →
   başçysy*, *кесчи → kesçi*). Separating signs **`ъ`** and **`ь`** are
   absorbed into **`í`** glides (*объект → obíekt*, *семья → semía*) and
   dropped at coda (*июль → iíul*, *апрель → aprel*). Words are 100%
   alphabetic (`\p{L}+`).

4. **Word-initial and post-vocalic e vs íe (deterministic).** Word-initial
   Russian loan glide [je] (*Европа → Íevropa*, *енот → íenot*). Post-vocalic
   `е` in iotated loans (*переезд → pereíezd*, *проект → proíekt*). Native
   word-initial [e] (*эл → el*, *эне → ene*). Medial native/loan [e] after
   consonants (*кел → kel*, *мектеп → mektep*). Phonemic long /e:/ (*ээги →
   eegi*, *керээз → kereez*). Post-vocalic non-iotated *э* stays plain
   (*поэт → poet*, *аэропорт → aeroport*).

5. **г and к** each cover their front/back allophones; no q, no ğ by default.

6. **Loanword hiatus.** Vocalic hiatus `-ия` → `-iía` (*авиация →
   aviatsiía*, *Россия → Rossiía*); plain `ia/io/iu` for true vowel sequences
   (*диаграмма → diagramma*).

7. **Case.** Casing follows the source word's pattern, not each letter on its
   own: Чыкса → Çyksa, Европа → Íevropa, ЖАҢЫ → JAŊY, БИЙИК → BIÍIK. The
   normative rule is in §2.1.

### 2.1 Casing (normative)

Several letters convert to more than one character: `я → ía`, `ё → ío`,
`ю → íu`, iotated `е → íe`, `ц → ts`, and in digraph mode `ч → ch`, `ш → sh`,
`щ → sch`. The reverse direction has the same situation (`ía → я`). Casing
each output character from its own source character can't tell sentence
case (`Ía`) from all caps (`ÍA`). So each word is converted in lowercase, then
recased from the pattern of the **source** word. The rule is the same in both
directions.

| Source word | Output | Example |
| :--- | :--- | :--- |
| all lowercase | all lowercase | `яблоко → íabloko` |
| first letter uppercase, the rest lowercase | uppercase the first output character only | `Яблоко → Íabloko`, `Цирк → Tsirk`, `Íabloko → Яблоко` |
| all uppercase, two or more cased letters | uppercase every output character | `ЯБЛОКО → ÍABLOKO`, `ЦИРК → TSIRK`, `ÍABLOKO → ЯБЛОКО` |
| mixed in any other way | a 1:1 letter keeps its own case; a multi-character output takes its source letter's case on its first character only | `МакЯн → MakÍan`, `MakÍan → МакЯн` |

Only letters in the case tables below count as cased. Other characters,
such as apostrophes, are ignored when finding a pattern.

**One-letter words.** A word with a single cased letter, uppercase, is both
"first letter uppercase" and "all uppercase". The line decides:

1. If the line has at least one other cased word and every cased letter on
   the line is uppercase, the word is all caps: `Я ИДУ ДОМОЙ → ÍA IDU DOMOÍ`.
2. Otherwise it is sentence case: `Я иду домой → Ía idu domoí`.

A one-letter word with no other cased word on its line falls to rule 2
(`Я → Ía`). This is a stated tie-break, not an inference. A line is the text
between line breaks.

**Explicit case tables, chosen by configuration.** Case changes use a fixed
table and never a locale case function (`toUpperCase`, `toLocaleUpperCase`, and
their lowercase counterparts). The Turkic `i`/`ı` pair is a documented special
case in the Unicode Character Database, and which pairing applies is decided by
the configuration, never by the environment's locale. Like `foldKey()` (§5) and
`compare()` (§6), casing is configuration-dependent:

```
all configurations:   a–z ↔ A–Z (except i/I below)   а–я ↔ А–Я   ё ↔ Ё   ө ↔ Ө
                      ү ↔ Ү   ң ↔ Ң   ұ ↔ Ұ   í ↔ Í   ö ↔ Ö   ü ↔ Ü   ç ↔ Ç
                      ş ↔ Ş   ŋ ↔ Ŋ   ñ ↔ Ñ   ä ↔ Ä   ğ ↔ Ğ   ĭ ↔ Ĭ   ĩ ↔ Ĩ
                      ū ↔ Ū   ʉ ↔ Ʉ
default:              i ↔ I   (ı → I and İ → i on input)
dotless ı:            ı ↔ I   i ↔ İ   (the Turkish pairs)
```

In the default table `ı` never occurs and `I ↔ i` is unchanged, so ordinary
Kyrgyz all caps stays `ILIM`, never `İLİM`. The dotless-ı configuration takes
the Turkish pairs, so all caps keeps the distinction: `КЫРГЫЗ → KIRGIZ`,
`ИЛИМ → İLİM`. The reverse reads `I` according to the configuration it is given:
`janyToCyr('KIRGIZ', { yGrapheme: 'dotless-i' })` gives `КЫРГЫЗ`, while
`janyToCyr('KIRGIZ')` (default) gives `КИРГИЗ`. Text uppercased elsewhere by a
default, non-Turkish function has already merged the two capitals, and no
table can recover them.

Casing never changes which letters are produced. `Цирк → Tsirk → Тсирк`
keeps the sentence-case pattern, and the `ц → тс` loss is the §4.1
native-priority rule, unrelated to case.

**Not yet specified:** acronyms (whether `ЖОЖ` or `ЕАЭС` inside sentence-case
prose keep all caps; they do, by the table above, and an acronym with a case
suffix falls to the mixed-case row, `ЖОЖдо → JOJdo`, but no style rule says
whether they should), hyphenated compounds (each hyphen-separated part is
cased as its own word), and camel-case identifiers (they fall to the
mixed-case row).

## 3. ASCII fallback (casual register, §10 whitepaper)

The **canonical (default) strip style** drops every diacritic to its base letter:

`ö→o`, `ü→u`, `í→i`, `ŋ→n`, `ç→c`, `ş→s`

Capitals: `Ö→O`, `Ü→U`, `Í→I`, `Ŋ→N`, `Ç→C`, `Ş→S`.

The dotless-ı and ğ options (§7) also strip to ASCII: `ı→i`, `İ→I`, `ğ→g`,
`Ğ→G`, so the casual register stays plain ASCII in every configuration.

A **digraph style** (`janyToFallback(text, 'digraph')`) expands the sibilants
to `ç→ch` / `ş→sh` while still stripping all other diacritics. Both styles
are selectable in the testbed.

The casual register is **one-way**: ASCII text cannot be mechanically restored
to the formal register or to Cyrillic. Do not describe this as round-tripping.

Accepted mergers under strip style (resolved by context as in SMS Kyrgyz):
кол/көл → `kol`; жаңы/жаны → `jany`; баш/бас → `bas`.

## 4. Reverse conversion (§9 whitepaper)

Latin→Cyrillic is **deterministic and lossless for native Kyrgyz vocabulary**,
**lossy for the loanword classes below**. Do not describe it as bijective or
100% bidirectional.

### 4.1 The native-priority rule (§9.1 whitepaper)

Where two Cyrillic spellings map to the same Latin string, reverse conversion
restores the native Kyrgyz one. Loan-only distinctions are the accepted losses:

| Latin | Restores | Accepted loss |
|---|---|---|
| `ts` | **тс** (native т+с: өтсө, кетсе, айтса) | loan ц: `tsirk → тсирк` |
| post-vocalic `íe` | **йе** (root integrity: `kiíet → кийет`) | loan е: `proíekt → пройект` |
| word-initial `íe` | **е** (Íevropa → Европа) | — |
| `ío` | **ё** (koíon → коён) | loan йо: `raíon → раён` |
| `ía` after consonant | **я** (semía → семя without ь) | loan ья: requires restoreLoans |
| `ş` | **ш** | loan щ: `borş → борш` |
| legacy `sh` | **ш** | name Исхак in digraph mode: `ishak → ишак` |
| post-vocalic `e` | **е** | loan э: `poet → поет` |
| dropped `ь`, `ъ` | *(nothing recoverable)* | `aprel → апрел` |
| `ä` (compose-mode, §11.2) | **а** | `äkä → ака`, `källä → калла` |
| `x` (compose-mode, §11.2) | **х** | `Xaram → Харам` (merges with `Buhara → Бухара`) |
| `w` (compose-mode, §11.2) | **в** | `taw → тав` (merges with `tav`) |

The last three are **extended (compose-mode) letters**: `cyrToJany` never emits
them, but reverse conversion accepts and folds them to their Cyrillic base —
the native-priority rule applied to loan/dialect distinctions Latin can write
and Cyrillic cannot. The single source is `EXTENDED_LETTERS` in
`packages/engine/src/alphabet.ts`.

### 4.2 Opt-in loan restoration (§9.2 whitepaper)

`janyToCyr(text, { restoreLoans: true })` applies a small lookup list
(`packages/engine/src/loanRestore.ts`) that restores known loanwords:
`semía → семья`, `obíekt → объект`, `síezd → съезд`, `iíul → июль`,
`aprel → апрель`, `pereíezd → переезд`, `proíekt → проект`, etc.

Known side effect: the `ishak` prefix entry restores the proper name Исхак
but will mis-convert the Russian loan *ишак* in digraph-mode input. That trade
is deliberate — the proper name is the one that appears in documents.

### 4.3 Full reverse rules

`ee → ээ`; word-initial `e → э`; elsewhere `e → е`; `í/ĭ/ĩ → й`; `ía/ío/íu →
я/ё/ю`; `ç → ч`; `ş → ш`; `j/c → ж`; `g/ğ → г`; `ü/ū/ұ → ү`; `ŋ/ñ → ң`; `q/k → к`;
compose-mode `ä → а`, `x → х`, `w → в` (§11.2).

Legacy digraphs `ch`, `sh`, `sch`, and apostrophes (`ob'ekt`, `sem'ía`) are
fully supported for backward compatibility.

High-front glides with canonical í (`biíik → бийик`) and legacy y
(`biyik → бийик`) both restore correctly.

`janyToCyr(text, { yGrapheme: 'dotless-i' })` reads capitals with the Turkish
pairs (`I → ı → ы`, `İ → i → и`); without it, `I` reads as `i` (§2.1).

The marked glide alternatives `ĭ` (U+012D) and `ĩ` (U+0129), with capitals
`Ĭ`/`Ĩ`, are read exactly as `í`: `janyToCyr` folds them to `í` right after NFC
normalization, so every `í` context rule (`íe`, `ía/ío/íu`, post-vocalic
`íe → йе`) applies to them unchanged (`biĭik → бийик`, `okuĩa → окуя`).

## 5. Search folding — `foldKey()` (§9.4 whitepaper)

`foldKey(text, options?)` maps any register (formal or casual) to a single
search key. It assumes Kyrgyz text.

**Unconditional folds:**

1. NFC normalization.
2. Explicit folds for letters with no Unicode decomposition to their base:
   `ŋ → n`, `ñ → n`, `ı → i`, `İ → i`. These cannot be reached by NFD alone.
3. NFD decomposition + strip all combining marks (handles `ö→o`, `ü→u`,
   `í/ĭ/ĩ→i`,
   `ç→c`, `ş→s`, `ä→a`, `ğ→g` automatically via Unicode).

Folding is not configuration-dependent for `i`: `foldKey('İ') === foldKey('i')
=== foldKey('ı') === 'i'` in every configuration, including dotless ı with the
Turkish case pairs. Search still merges `ı` and `i`, which collation (§6) and
casing (§2.1) keep apart.
4. Casefold to lowercase.

Result: `foldKey('biíik') === foldKey('biiik')` — formal and casual spellings
of the same word land on the same key. `ä` folds to `a` unconditionally
(it decomposes and has no competing international value).

**Configuration-dependent folds** (`FoldKeyOptions`):

- `extendedLetters: ['x' | 'w']` — the §11.2 compose-mode splits. When `'x'`
  is active, `x → h`; when `'w'` is active, `w → v`, unifying the distinctions
  that reverse conversion loses (`foldKey('xaram', { extendedLetters: ['x'] })
  === foldKey('haram', …)`). **Off by default**: outside a Kyrgyz-only index
  `x`/`w` carry their international value, so *Linux*, *LAX*, *X Factor* must
  fold to themselves, not *linuh* / *lah*.
- `digraphInput: true` — the input is digraph-fallback ASCII (§10). Adds
  `ch → c`, `sh → s` so the digraph casual form folds to the formal word's key.
  **Off by default**: `ch`/`sh` are legitimate formal sequences (`başçy`) and
  folding them unconditionally would merge distinct words. The strip fallback
  needs no option — it already *is* the folded form.

## 6. Alphabet order

Native Kyrgyz order (from `LETTER_MAP` in `packages/engine/src/alphabet.ts`):

а б в г д е ё ж з и й к л м н ң о ө п р с т у ү ф х ц ч ш щ ъ ы ь э ю я

Canonical Jany-Latyn order (28 letters; a modified letter follows the letter it
modifies, as in Kyrgyz Cyrillic):

A B Ç D E F G H I Í J K L M N Ŋ O Ö P R S Ş T U Ü V Y Z

The alphabets of the other configurations and the collation tailoring, in ICU
rule syntax, are given in whitepaper §9.6.

`compare(a, b, options?)` (`jany-latyn/collate`) implements that order from an
explicit rank table per configuration, because `Intl.Collator` accepts no
tailoring: `ç` after `c`, `í` after `i`, `ŋ` after `n`, `ö` after `o`, `ş` after
`s`, `ü` after `u`; `q` after `k` with `uvularK: 'q'`, `ğ` after `g` with
`uvularG: 'ğ'`, `ä` after `a` with `extendedLetters`; and `ı < i < í` after `h`
in the dotless-ı configuration. Letters a configuration does not anchor keep
their default Latin position. Ties break on the exact letter, then on case,
lowercase first, using that configuration's case table (§2.1). The expected
orderings are pinned in `packages/engine/test/fixtures/collation.json`.

## 7. Testbed option inventory (§11.1 whitepaper)

| Option | Values | Default |
|---|---|---|
| Front rounded vowels | `ö/ü` (latin-umlaut), `ө/ü` (hybrid), `ө/ұ` (cyrillic-u), `ө/ū` (draft-macron) | `ö/ü` |
| Sibilants | `ç/ş` (cedilla), `ch/sh` (digraph) | `ç/ş` |
| Velar nasal | `ŋ` (eng), `ñ` (tilde-n) | `ŋ` |
| Back unrounded vowel | `y`, `ı` (dotless-i) | `y` |¹
| Glide (й, and the glide half of я/ю/ё/iotated е) | `í` (acute-i), `ĭ` (breve-i), `ĩ` (tilde-i), plain `i` (the rejected barcode mapping, for comparison), `y` (only while ы is `ı`) | `í` |²
| Uvular consonant | unified `k`, allophonic `q` | `k` |
| ж | `j` (unified), `c` (mechanical CTA mapping)³ | `j` |
| г | unified `g`, allophonic `ğ`⁴ | `g` |
| ASCII fallback | strip `c/s` (canonical), digraph `ch/sh` | strip |
| Extended letters (§11.2) | off, `ä`, `x`/`h`, `w` — compose-mode, never emitted forward | off |

¹ Selecting `ı` force-enables allophonic `q` (§7). This is a **testbed
affordance, not an engine invariant**: the pure `cyrToJany` keeps `yGrapheme`
and `uvularK` independent (`{ yGrapheme: 'dotless-i', uvularK: 'k' }` is valid).
The coupling lives in `packages/engine/src/testbedPresets.ts` and is shared by the web UI.

² The `y` glide is offered only while ы is written `ı`; choosing it while ы is
`y` forces `ı` (and therefore `q`), since `y` would otherwise play two roles
(§4.4). The `ĩ` glide combined with the `ñ` velar nasal is **warned about, not
prevented** (`hasTildeClash()` in `packages/engine/src/testbedPresets.ts`): the same tilde
ends up on two letters for two unrelated jobs, but the text stays unambiguous.
As with footnote ¹, the engine accepts every combination.

³ `c` writes **every** ж as `c`. That is right for native ж [dʒ] (`жол → col`)
and wrong for loanword ж [ʒ], which the CTA writes `j` (`журнал → curnal`, not
`jurnal`). Cyrillic writes both sounds as ж, so the distinction cannot be
derived; a writer who knows the word makes it. The testbed warns about this
exactly as it warns about `q` (`космос → qosmos`). The CTA preset uses `c`. In
reverse, `c → ж` (§4.3).

⁴ `ğ` writes back-harmonic г as `ğ` by the same rule as `q` (`болгон → bolğon`)
and is wrong for loanwords the same way (`газ → ğaz`, `гарантия → ğarantiía`).
The engine keeps it independent of `q`, so `q` without `ğ` is a valid call,
but whitepaper §6 argues that a standard adopting `q` adopts `ğ` with it, and
the testbed couples the two options accordingly. The CTA preset uses both.
In reverse, `ğ → г`.

## 8. Reference examples

National anthem, first verse (source: president.kg):

```
Ak möŋgülüü aska, zoolor, talaalar,
Elibizdin jany menen barabar.
Sansyz kylym Ala-Toosun mekendep,
Saktap keldi bizdin ata-babalar.
```

Traditional cradle lullaby «Алдей, алдей ак балам», first verse (source:
Sputnik Кыргызстан):

```
Aldeí, aldeí ak balam,
Arka jölöör jan balam.
Kunan koídun kuírugu,
Byşty jegin jan balam.
Ataŋ barsa aíylga,
Kurjun tolo et kelet.
Eneŋ barsa aíylga,
Emçek tolo süt kelet.
Kunan koídu soí balam,
Kuíruguna toí balam.
```

The lullaby in ASCII strip fallback (canonical §10):

```
Aldei, aldei ak balam,
Arka joloor jan balam.
Kunan koidun kuirugu,
Bysty jegin jan balam.
Atan barsa aiylga,
Kurjun tolo et kelet.
Enen barsa aiylga,
Emcek tolo sut kelet.
Kunan koidu soi balam,
Kuiruguna toi balam.
```

(All blocks are byte-identical to `packages/engine/test/fixtures/*.jany.txt` / CLI output —
the test suite keeps them in sync. The conformance checker
`packages/engine/scripts/check-whitepaper.ts` gates the union of an authoritative pinned
checklist and every `source → target` pair the extractor finds in the prose
and tables of docs/WHITEPAPER.md. It infers direction/configuration, runs each
through the engine, and fails on any mismatch. A Latin→Latin word pair that is
neither pinned nor in the explicit exclusion list is reported UNCLASSIFIED and
fails — exclusions are a deliberate human-edited list, never an emergent
property of engine agreement.)

## 9. Codepoint inventory

Ö U+00D6, ö U+00F6, Ü U+00DC, ü U+00FC, Í U+00CD, í U+00ED,
Ŋ U+014A, ŋ U+014B, Ñ U+00D1, ñ U+00F1 (tilde-n alternative),
Ç U+00C7, ç U+00E7, Ş U+015E, ş U+015F.

Testbed options (never canonical): I U+0049 / ı U+0131 and İ U+0130 / i U+0069
(the Turkish case pairs of the dotless-ı configuration), Ğ U+011E, ğ U+011F.

Marked glide alternatives (testbed only, never canonical): Ĭ U+012C,
ĭ U+012D (breve), Ĩ U+0128, ĩ U+0129 (tilde). Both decompose under NFD, so
`foldKey()` and the ASCII fallback reduce them to `i` like `í`.

Hard and soft signs (ъ and ь) are absorbed; words are 100% alphabetic
(`\p{L}+`) without apostrophes. Plain apostrophe ' U+0027 remains supported
for legacy backward compatibility.

Secondary display variants: Cyrillic Ө/ө (U+04E8/U+04E9, hybrid mode),
Kazakh Ұ/ұ (U+04B0/U+04B1), macron Ū/ū (U+016A/U+016B).

No combining marks appear in canonical output; `foldKey()` uses them
internally during NFD stripping.
