# Orhon-Enesai Runes: Specification

**The normative rules for writing modern Kyrgyz in the Old Turkic script, and for reading the Yenisei Kyrgyz inscriptions, in the Jany-Latyn engine and testbed**

**Version:** draft 0.3. Companion to *Jany-Enesai* draft 0.3 (`JANY-ENESAI.md`, "the proposal") and to the Yenisei Kyrgyz corpus (`corpus/YENISEI-KYRGYZ-CORPUS.md`, "the corpus").
**Status:** Draft for the author's review. Nothing here is implemented in the engine yet. §7.2, §9.4 and Appendix A have reference implementations in `corpus/scripts/` (`reader.py`, `detect.py`, `attested.py`), checked against the corpus.
**License:** CC BY 4.0, as `WHITEPAPER.md`. The counts in §6 and Appendix A are derived from *A Database of Turkic Runiform Inscriptions* (CC BY-NC-SA 4.0); see the corpus for attribution.

---

## Contents

1. Scope
2. Conventions
3. Schemes and their status
4. Writing modern Kyrgyz
5. Converting back to Cyrillic
6. Eski-Enesai: the attested-majority scheme
7. Reading the inscriptions
8. Variants, mirrored signs, and folding
9. Telling old spelling from modern
10. Sorting and search
11. Conformance
12. Proposed revisions to the proposal
- Appendix A. Attested forms on the Yenisei Kyrgyz stones
- Appendix B. Sign values and reader targets

---

## 1. Scope

This specification covers two directions that share one script.

- **Writing modern Kyrgyz in runes** (§3–§6): Cyrillic in, runes out, and back. The proposal argues for the choices; this document states them as rules a converter must follow, and adds the settings the corpus made possible.
- **Reading genuine inscriptions** (§7–§9): runes as the stones have them in, sign-by-sign values out, in several notations. Nothing in this direction supplies vowels or interprets words. Interpretation belongs to the published readings, which the corpus keeps as a separate, labelled layer (§7.4).

The two directions meet in one place: a detector that tells which kind of text it has been given (§9), so that a testbed never runs a modern reverse conversion on an inscription, or the inscription reader on modern text.

## 2. Conventions

- **Code points, not code units.** Every rune is outside the Basic Multilingual Plane. Implementations iterate by code point, put the `u` flag on every regular expression that can see runes, and never index, slice, or measure rune text in UTF-16 code units (proposal §22).
- **Logical order.** Text is stored first letter first. Display is right to left (`dir="rtl"`), and rune text inside a left-to-right line is isolated (proposal §26).
- **Language tags.** Modern Kyrgyz in runes is `ky-Orkh`. Genuine inscriptions are `otk-Orkh`.
- **Letter, sign, form.** A *letter* is a unit of the writing system (back `d`). A *sign* is one occurrence of a letter on a stone. A *form* is the Unicode character a sign is written with (𐰑 or 𐰒). A letter can have several forms; §6 and §8 say which ones count as the same letter.
- **Series.** The script writes ten consonants with a back-vowel and a front-vowel letter. "Back" and "front" refer to that series, marked ¹ and ² in readings (§7.2).
- **MUST, SHOULD, MAY** have their usual meanings. Everything else is explanation.

## 3. Schemes and their status

A *scheme* is a complete mapping from Jany-Latyn letters to runes, with the rules that choose between forms. Every scheme carries one status, and the testbed MUST show it next to the scheme's name.

| Status | Meaning | Schemes |
| :--- | :--- | :--- |
| **proposed** | Put forward as the way to write modern Kyrgyz in runes | Jany-Enesai |
| **reference** | Reproduces an existing source, for comparison | Chart (full harmony), Eski-Enesai (§6), Orkhon inscription look |
| **comparison** | One deliberate step away from the proposed scheme, to test a single choice | k+g harmony, Attested letters (§4.4), Lossless |
| **experimental** | A new design under trial, with no claim to precedent | none yet; the slot exists (§3.1) |

### 3.1 The experimental slot

An experimental scheme is a table of 28 runes, one per Jany-Latyn letter, plus an optional series rule. It MUST:

- use only assigned code points in the Old Turkic block, U+10C00–U+10C48, so that text in it survives any font and any copy;
- map distinct letters to distinct runes, so that conversion back to Jany-Latyn stays exact;
- state its design rule in one sentence, shown in the testbed;
- declare that it is experimental in every output it labels.

The first planned candidate is a scheme in which each rune is the Old Turkic sign that most resembles its Cyrillic or Latin letter. It is not specified here. Design inputs recorded so far:

- **Sibilants that look like vowels or liquids.** In the attested forms, ш (𐱀, and 𐱁 in the chart) is a stroke on a fork much like front л 𐰠 (U+10C20), and close to 𐰱 ič (U+10C31), another sibilant. The stones and the chart accept this, so the reference schemes keep it. A scheme for readers of Cyrillic and Latin should not: it should keep sibilants visibly apart from vowels and liquids, and from each other.

## 4. Writing modern Kyrgyz

### 4.1 The pivot

Forward conversion MUST run in two stages: Cyrillic to the canonical Jany-Latyn full form, with every engine option at its Jany-Latyn default, then Jany-Latyn to runes (proposal §3, §23). The rune stage MUST NOT read the reader's Latin display options.

### 4.2 Jany-Enesai

The 28 runes of proposal §2, one per Jany-Latyn letter, with compose-mode `ä` written 𐰂. Words are maximal runs of Jany-Latyn letters; everything else passes through unchanged (proposal §23).

### 4.3 The comparison settings

The settings of proposal §14–§18 apply as specified there:

- the governing-vowel rule and the k+g and full harmony settings (§24);
- the epigraphic register (§25);
- the toggles for `у`, the vowel letters, `ж`, `ф х в`, glyph style, and register (§18).

This specification adds two axes, the per-letter attested toggles, and a font requirement (§4.7). Proposal §18 also defines a reversible toggle that writes ж with 𐰙 in every syllable (proposal §8.1).

### 4.4 Attested letters (comparison)

Each of р, с, ш can be switched separately from the chart's form to the form the Yenisei Kyrgyz stones use (§12, R3):

| Letter | Jany-Enesai (chart) | Attested | On the stones | In running text |
| :--- | :---: | :---: | :--- | :--- |
| р | 𐰺 | 𐰻 | 𐰻 on 14 stones; 𐰺 on none | Reads well |
| с | 𐰽 | 𐰾 | 𐰾 on 9 stones, the only sign there that writes nothing but *s*; 𐰽 on none | Hard to read: a single vertical stroke, easily taken for ы 𐰃 or punctuation |
| ш | 𐱁 | 𐱀 | 𐱀 on 11 stones, always *š*; 𐱁 on none | Hard to read: a single caret, half of т 𐱄 |

Each toggle is reversible, since it still maps one letter to one rune. The testbed MUST show the "hard to read" note beside the с and ш toggles.

### 4.5 The forms axis

The epigraphic register and the harmony settings choose a letter's series; the *forms* axis chooses which Unicode form writes it. It has three values:

| Forms | Source | Default for |
| :--- | :--- | :--- |
| **chart** | The video chart (proposal §5) | Jany-Enesai, k+g, full harmony |
| **Orkhon** | The Orkhon forms of Unicode's chart (proposal §17) | the Orkhon inscription look |
| **Yenisei** | The attested majority of the Yenisei Kyrgyz stones (§6) | Eski-Enesai |

The axis changes forms only, never letters. Two texts that differ only in forms MUST fold to the same key (§8.3).

### 4.6 The variants axis (display only)

A *variant* is a form the stones use for the same letter alongside the majority form, at no position a rule can predict (§8.1). The testbed MAY offer variants as a display setting. A variant setting:

- MUST NOT change the letter a sign writes, and so never affects reverse conversion or folding;
- MUST be applied after every other rule;
- SHOULD be offered for 𐰁 (for 𐰀) and for 𐰔/𐰕, the two variants that the stones use at substantial rates (§8.1).

### 4.7 The bundled font

Three pairs of the chart are two forms of one Unicode letter used as two letters, and in Noto Sans Old Turkic they differ by a single stroke: ы 𐰃 and и 𐰄, ө 𐰇 and ү 𐰈, ч 𐰲 and ж 𐰳 (proposal §8.1). The font the testbed bundles SHOULD exaggerate the distinguishing stroke of each pair: the position of the side stroke of 𐰄, the extra stroke of 𐰈, and the foot of 𐰳. It MUST NOT change any code point or any other glyph's identity, so that text set in it reads correctly in any other Old Turkic font. Proposal §27.2 tests whether it helps.

## 5. Converting back to Cyrillic

As proposal §13 and §26: each rune of a reversible scheme maps to one Jany-Latyn letter, and the result goes through the engine's Jany-Latyn → Cyrillic conversion, with the loan-restoration list when the lossless setting is on. The schemes and settings marked one-way in the proposal are not reversed. The testbed MUST also refuse reverse conversion when the detector classes the input as old spelling (§9.4), and offer the inscription reader instead.

## 6. Eski-Enesai: the attested-majority scheme

### 6.1 The rule

Eski-Enesai ("Old Yenisei") writes modern Kyrgyz the way the Yenisei Kyrgyz stones write their language, as far as a rule can reproduce it. It is the epigraphic register of proposal §25, with:

- **Series:** full harmony (proposal §24.4).
- **Vowels:** historical, one letter per pair (𐰃 for ы/и, 𐰆 for о/у, 𐰇 for ө/ү), and 𐰅 for е/э.
- **Forms:** Yenisei. For each letter and series, the form used on the most stones of the corpus. Ties go to the form with more placed occurrences.
- **Letters the stones lack:** ж is written with the y-runes (the etymological toggle); ф, х and в are nativized as п, к and б.
- **Divider:** ⁚ between words.

The forms are not chosen by hand. They are computed from the corpus by `corpus/scripts/attested.py`, and Appendix A gives the result. When the corpus changes, Eski-Enesai changes with it, and the testbed MUST show the corpus version the table came from.

### 6.2 The resulting forms

| Letter | Back | Front | Notes |
| :--- | :---: | :---: | :--- |
| а | 𐰀 | — | 𐰁 is a variant (§8.1) |
| э, е | — | 𐰅 | |
| ы, и | 𐰃 | 𐰃 | historical vowel |
| о, у | 𐰆 | 𐰆 | historical vowel |
| ө, ү | 𐰇 | 𐰇 | historical vowel |
| б (and в) | 𐰉 | 𐰌 | |
| г | 𐰎 | 𐰏 | |
| д | 𐰑 | 𐰓 | |
| з | 𐰕 | 𐰕 | 𐰔 is a variant (§8.1) |
| й (and ж) | 𐰖 | 𐰘 | |
| к (and х) | 𐰴 | 𐰛 | by о/у 𐰹; by ө/ү 𐰝; by ы the stones write 𐰴, not 𐰶 |
| л | 𐰞 | 𐰠 | |
| м | 𐰢 | 𐰢 | |
| н | 𐰣 | 𐰥 | |
| ң | 𐰬 | 𐰭 | |
| п (and ф) | 𐰯 | 𐰯 | |
| р | 𐰻 | 𐰼 | |
| с | 𐱂 | 𐰾 | the stones write back *s* with their š sign |
| ш | 𐱀 | 𐱀 | see §6.3 |
| т | 𐱄 | 𐱅 | 𐱇 (by о/у) is not attested; 𐱄 is used |
| ч | 𐰲 | 𐰲 | by и 𐰱 |
| нт, нд | 𐰦 | 𐰦 | ligature, as proposal §25.4 |
| нч | 𐰨 | 𐰨 | ligature |
| лт, лд | — | — | 𐰡 is not attested; the pair is written in full |

### 6.3 The one open choice

The stones have two š signs. 𐱂 is on 12 stones and also writes *s* in back-vowel words. 𐱀 is on 11 stones and never writes *s*. A pure majority rule would write ш with 𐱂 and merge it with back с. This specification keeps them apart instead: ш is 𐱀 and back с is 𐱂, so every form is still attested and the two letters stay distinct. The merger is available as a toggle (§12, Q1).

## 7. Reading the inscriptions

### 7.1 How genuine text is encoded

Text read by §7.2 is expected in the corpus's encoding:

- **One character per sign**, in reading order.
- **Dividers:** the two-dot divider as ⁚ U+205A and the one-dot divider as ⸱ U+2E31, with no spaces around either. A plain space only where the source has a space and no divider.
- **Mirrored signs** are encoded as the letter they mirror. A stretch the carver wrote left to right, where every letter is mirrored, is encoded as the letters it writes, in reading order (§8.2).
- **Shapes with no character of their own** (the ring-with-dot ŋ, the trefoil m, turned forms) are encoded as the letter they stand for.
- **Illegible stretches** are `...`.

### 7.2 The inscription reader

The reader maps each rune to its sign value from Appendix B, with no context and no vowel supplied. It MUST:

- write each two-series consonant with its series mark, ¹ for back and ² for front (`b¹`, `t²`);
- write the vowel signs by the pairs they write: 𐰃 `i` for ı/i, 𐰆 `o` for o/u, 𐰇 `ö` for ö/ü;
- write the sign values of the syllabic and ligature signs as wholes (`oq`, `ök`, `ıq`, `ič`, `nt`, `nč`, `baš`);
- read the Orkhon and Yenisei forms of a letter alike;
- turn ⁚ into a space, pass ⸱, spaces, and `...` through unchanged, collapse runs of spaces, and trim the line.

On the corpus, the reader's output reproduces the database's value for every sign on all 99 lines with text. The corpus prints that output under each line. 𐱈 reads `baš`, the value Tekin (1968) gives it, which the database also reads on Uyuk Arzhan.

### 7.3 Output targets

The reader's output can be shown in four notations. All of them write sign values, not words.

| Target | Series marks | Distinctive values |
| :--- | :--- | :--- |
| **Scholarly** (default) | ¹ ² | `q`, `ñ`, `š`, `č`, `ı` as in Appendix B |
| **CTA** (Common Turkic Alphabet) | dropped | `q`, `ñ`, `ş`, `ç`, `ı`, `ə` for `ä` |
| **Jany-Latyn letters** | dropped | `k` for `q`, `ŋ` for `ñ`, `ş`, `ç`, `í` for the glide `y`, `y` for `ı` |
| **Kyrgyz Cyrillic letters** | dropped | `к`, `ң`, `ш`, `ч`, `й`; `ы` for `ı` |

Two rules apply to the CTA, Jany-Latyn and Cyrillic targets:

- **𐰃** is written as the back vowel (ı, y, ы) when the nearest consonant sign in the same word, looking left first and then right, is of the back series or is `q`. Otherwise it is written as the front vowel (i, i, и). This uses only what the signs encode.
- **𐰆 and 𐰇** are written as the first member of their pair (o, ö; о, ө), because the script does not distinguish the pair and no sign-level rule can.

### 7.4 Published readings

The readings and translations in the corpus are interpretations by named scholars, kept apart from the signs and labelled as such. When shown in another notation, a reading MUST be converted from its transcription letter by letter with this table, and MUST keep its "interpretive" label:

| Transcription | CTA | Jany-Latyn | Cyrillic |
| :---: | :---: | :---: | :---: |
| a | a | a | а |
| ä | ə | e | э (е after a consonant) |
| e | e | e | э (е after a consonant) |
| ï, ı | ı | y | ы |
| i | i | i | и |
| o | o | o | о |
| u | u | u | у |
| ö | ö | ö | ө |
| ü | ü | ü | ү |
| ɣ, γ | ğ | g | г |
| q | q | k | к |
| ǰ | c | j | ж |
| č | ç | ç | ч |
| š | ş | ş | ш |
| ŋ | ñ | ŋ | ң |
| y | y | í | й |
| b d g k l m n p r s t z | the same | the same | б д г к л м н п р с т з |

Long vowels, hyphens and brackets pass through unchanged. The table is one-way: it renders a reading, and is not used to recover one.

## 8. Variants, mirrored signs, and folding

### 8.1 Variants

On the stones, the shapes of five letters vary between Unicode forms with no positional rule. The counts come from Appendix A:

| Letter | Majority form | Variant | Stones using the variant | Conditioned by position? |
| :--- | :---: | :---: | ---: | :--- |
| a | 𐰀 (110) | 𐰁 (21) | 7 of 21 | No: 19% of placed word-final a's, 27% of word-medial ones. It follows the carver, not the word. Uibat I and Uibat VI write about half their a's with 𐰁; Elegest I and Uibat III write none. |
| z | 𐰕 (29) | 𐰔 (32) | 7 of 21 | Not by position. Both occur on Elegest I, in different lines. |
| front k | 𐰛 (47) | 𐰚 (15) | 5 of 21 | Not examined |
| front n | 𐰥 (51) | 𐰤 (8) | 5 of 21 | Not examined |
| back ɣ | 𐰎 (43) | 𐰍 (8) | 3 of 21 | Not examined |

The other forms the stones use are each the only form of their letter.

### 8.2 Mirrored signs

Where a carver turned a line and wrote a stretch left to right, every letter in it is mirrored. On Begre, the shapes there mirror the right-to-left ones exactly: 𐰀 is drawn as 𐰁, and back d points the other way. A mirrored sign is the same letter written in the other direction, and §7.1 encodes it as that letter. This is why the corpus encodes the left-pointing d (the database's glyph D04) as 𐰑, not as 𐰒.

### 8.3 Folding

`runeFoldKey` maps every form to its letter before comparison. For example, 𐰁 → 𐰀, 𐰒 → 𐰑, 𐰔 → 𐰕, 𐰚 → 𐰛, and the vowel-bound signs to their consonant plus vowel. The result is then compared under the engine's `foldKey` rules. A search for a word MUST find it whatever its forms, variants, or series. Folding MUST NOT merge letters that Jany-Enesai keeps distinct, such as 𐰃 and 𐰄.

## 9. Telling old spelling from modern

### 9.1 Old-only signs

These 21 signs are written by no modern setting in plene spelling:

𐰁 𐰌 𐰎 𐰐 𐰒 𐰗 𐰛 𐰥 𐰪 𐰫 𐰬 𐰮 𐰰 𐰵 𐰷 𐰹 𐰻 𐰿 𐱀 𐱂 𐱆

Eski-Enesai uses many of them, and the detector rightly classes it `old`: it is the stones' spelling, and one-way. The one reversible setting that uses them is Attested letters (§4.4), with 𐰻 and 𐱀. Text the testbed knows to come from that setting is marked as such and does not reach the detector.

### 9.2 Spelling features

The script's modern use writes every vowel; the stones and the inscription look leave most out. Over the words of two or more runes, the detector measures:

- *vowelless share*: words with no vowel sign;
- *cluster share*: words with a run of three or more consonant signs.

### 9.3 What the features measure

| Text | Words | Old-only signs | Vowelless | Clusters |
| :--- | ---: | ---: | ---: | ---: |
| The 21 stones, each taken whole | 1–86 each | 1–62 each, at least one on every stone | 0–67% | 0–100% |
| Jany-Enesai (proposal Appendix B) | 42 | 0 | 0% | 2% |
| k+g and full harmony | 42 | 0 | 0% | 2% |
| Eski-Enesai | 42 | 39 | 29% | 57% |
| Inscription look (Orkhon forms) | 42 | 0 | 29% | 50% |

The figures come from `corpus/scripts/detect.py`.

### 9.4 The detector

Given a text, the detector returns `old` or `modern`:

1. If the text contains an old-only sign (§9.1), it is `old`.
2. Otherwise, if the vowelless share is above 10% or the cluster share is above 25%, it is `old`, which in practice means the inscription look.
3. Otherwise it is `modern`.

The detector classes every stone of the corpus as `old`, both with the dividers and with them replaced by spaces, and the proposal's examples in the three plene settings as `modern`. Texts of one or two words can fall either way on step 2; the testbed SHOULD say so when it shows the class of a short text.

## 10. Sorting and search

Sorting follows proposal §12: Kyrgyz Cyrillic order through a rank table. All forms of a letter, and variants (§8.1), sort with the letter at the primary level. They differ at a secondary level: series (back first), then form (chart, Orkhon, Yenisei, in that order).

Search compares fold keys (§8.3). A Latin or Cyrillic query against rune text uses the query's Jany-Latyn letters. Since every reversible scheme maps one letter to one rune, no extra rule is needed.

## 11. Conformance

An implementation conforms when all of these hold:

1. Every worked example in proposal Appendix B and §16 (the chart's title) converts as printed in its setting.
2. Every reversible scheme round-trips Jany-Latyn → runes → Jany-Latyn exactly over the treebank.
3. The inscription reader reproduces the corpus's reader line on all 99 lines.
4. The detector classes all 21 stones `old` and the plene examples `modern`.
5. Eski-Enesai's forms equal Appendix A as regenerated by `corpus/scripts/attested.py` from the corpus version the implementation ships with.
6. No existing Jany-Latyn output changes.

Checks 3–5 run against the corpus, which is licensed CC BY-NC-SA. They therefore live outside the MIT engine package (`corpus/test/`), as `test/boundary.test.ts` requires.

## 12. Revisions to the proposal

The corpus work found nothing that requires changing the 28 runes of Jany-Enesai. It bears on five points, which the author accepted on 2026-10-15; `JANY-ENESAI.md` draft 0.3 carries them out. They are kept here as the record of why.

**R1. The inscription look imitates the Orkhon monuments, not the Yenisei Kyrgyz stones.** Its glyph style uses Orkhon forms (𐱃, 𐰔, 𐰺, 𐰽, 𐱁), and none of the five appears on any Yenisei Kyrgyz stone. **Proposed:** add the forms axis (§4.5), and make Eski-Enesai the inscription look the testbed shows first. Keep the Orkhon look as a reference.

**R2. The нт ligature.** The chart labels 𐰧 YENISEI ENT as нт, and the proposal's chart-forms inscription look would emit it. On the stones, the ring with a dot is ŋ on 9 stones, and нт is written 𐰦, on Begre. **Proposed:** use 𐰦 for нт in every inscription look, and say in proposal §19 that 𐰧 would mislead readers who know the stones.

**R3. The chart's р, с, ш are Orkhon forms.** The stones write 𐰻, 𐰾 and 𐱀/𐱂, and the chart's forms appear on none of them. The two Kyrgyz sources in circulation that we found, the video chart and a YouTube channel that writes its titles in runes, both use the chart's forms. **Proposed:** keep the chart's forms in Jany-Enesai, add the Attested letters setting (§4.4), and settle the reference by the survey of charts in proposal §27.4.

**R4. 𐱈 for у.** 𐱈 is attested once, as *baš*, on Uyuk Arzhan, in a stretch the database marks partly legible. This is not a conflict in practice: the detector keeps Jany-Enesai text away from the inscription reader. **Proposed:** say so in one sentence in proposal §7.2, and keep 𐱈.

**R5. Proposal §21 should report the corpus.**
- 20 of the 28 Jany-Enesai runes appear on the Yenisei Kyrgyz stones.
- The other eight are в, ж, и, р, с, ү, ф, ш.
- Five of the eight could not have been attested: в and ф are later loan sounds; ж has no runic sign; and the stones do not distinguish и from ы or ү from ө.
- The other three, р, с and ш, are R3.

**Q1. Eski-Enesai's ш (§6.3).** Decided: the attested forms stay as the stones have them, with ш and back с kept apart (ш 𐱀, back с 𐱂) and the merger as a toggle. Whether a sibilant should look like a vowel or a liquid is a question for the experimental scheme (§3.1), not one to settle against the stones.

---

## Appendix A. Attested forms on the Yenisei Kyrgyz stones

Generated by `corpus/scripts/attested.py` from the corpus of 2026-10-15. Each form shows the number of stones that use it, with the number of placed occurrences in brackets. The counts leave out the occurrences whose shape the drawings could not settle (`corpus/shapes.json`), and corrections made from a page's comment. The last column is the form §6.1's rule picks.

| Letter | Forms on the stones: stones (occurrences) | Attested majority |
| :--- | :--- | :---: |
| a, ä | 𐰀 U+10C00: 14 (110), 𐰁 U+10C01: 7 (21) | 𐰀 |
| e | 𐰅 U+10C05: 6 (20) | 𐰅 |
| ı, i | 𐰃 U+10C03: 17 (149) | 𐰃 |
| o, u | 𐰆 U+10C06: 18 (121) | 𐰆 |
| ö, ü | 𐰇 U+10C07: 15 (82) | 𐰇 |
| b (back) | 𐰉 U+10C09: 14 (50) | 𐰉 |
| b (front) | 𐰌 U+10C0C: 16 (54), 𐰋 U+10C0B: 1 (9) | 𐰌 |
| ɣ, g (back) | 𐰎 U+10C0E: 12 (43), 𐰍 U+10C0D: 3 (8) | 𐰎 |
| g (front) | 𐰏 U+10C0F: 14 (60) | 𐰏 |
| d (back) | 𐰑 U+10C11: 12 (87), 𐰒 U+10C12: 1 (2) | 𐰑 |
| d (front) | 𐰓 U+10C13: 15 (61) | 𐰓 |
| z | 𐰕 U+10C15: 9 (29), 𐰔 U+10C14: 7 (32) | 𐰕 |
| y (back) | 𐰖 U+10C16: 14 (63) | 𐰖 |
| y (front) | 𐰘 U+10C18: 9 (19) | 𐰘 |
| q, k (back) | 𐰴 U+10C34: 17 (89) | 𐰴 |
| k (front) | 𐰛 U+10C1B: 10 (47), 𐰚 U+10C1A: 5 (15) | 𐰛 |
| oq, uq | 𐰹 U+10C39: 6 (8), 𐰸 U+10C38: 3 (5) | 𐰹 |
| ök, ük | 𐰝 U+10C1D: 7 (21) | 𐰝 |
| l (back) | 𐰞 U+10C1E: 15 (79) | 𐰞 |
| l (front) | 𐰠 U+10C20: 13 (60) | 𐰠 |
| m | 𐰢 U+10C22: 17 (246) | 𐰢 |
| n (back) | 𐰣 U+10C23: 16 (66) | 𐰣 |
| n (front) | 𐰥 U+10C25: 12 (51), 𐰤 U+10C24: 5 (8) | 𐰥 |
| nt, nd | 𐰦 U+10C26: 1 (3) | 𐰦 |
| nč | 𐰨 U+10C28: 8 (8), 𐰩 U+10C29: 1 (1) | 𐰨 |
| ŋ (back) | 𐰬 U+10C2C: 11 (31) | 𐰬 |
| ŋ (front) | 𐰭 U+10C2D: 9 (15), 𐰮 U+10C2E: 3 (7) | 𐰭 |
| p | 𐰯 U+10C2F: 9 (13) | 𐰯 |
| r (back) | 𐰻 U+10C3B: 14 (62) | 𐰻 |
| r (front) | 𐰼 U+10C3C: 18 (112) | 𐰼 |
| s (front) | 𐰾 U+10C3E: 9 (31) | 𐰾 |
| š; s (back) | 𐱂 U+10C42: 12 (37) | 𐱂 |
| š | 𐱀 U+10C40: 11 (25) | 𐱀 |
| t (back) | 𐱄 U+10C44: 15 (87) | 𐱄 |
| t (front) | 𐱅 U+10C45: 13 (58) | 𐱅 |
| č | 𐰲 U+10C32: 16 (55) | 𐰲 |
| ič | 𐰱 U+10C31: 2 (3) | 𐰱 |
| baš | 𐱈 U+10C48: 1 (1) | 𐱈 |

Not attested on any stone: 𐰂 𐰄 𐰈 𐰊 𐰐 𐰗 𐰙 𐰜 𐰟 𐰡 𐰧 𐰪 𐰫 𐰰 𐰳 𐰵 𐰶 (shape unknown; encoded by value on Uyuk Arzhan) 𐰷 𐰺 𐰽 𐰿 𐱁 𐱃 𐱆 𐱇.

## Appendix B. Sign values and reader targets

The value of each code point for the inscription reader (§7.2). Forms that write the same letter share a value. The Jany-Latyn and Cyrillic columns give the target letters of §7.3. For 𐰃, those targets depend on the neighbouring series, as §7.3 states.

| Code points | Runes | Scholarly | CTA | Jany-Latyn | Cyrillic |
| :--- | :---: | :---: | :---: | :---: | :---: |
| U+10C00–01 | 𐰀 𐰁 | a | a | a | а |
| U+10C02 | 𐰂 | ä | ə | e | э |
| U+10C03–04 | 𐰃 𐰄 | i | ı / i | y / i | ы / и |
| U+10C05 | 𐰅 | e | e | e | э |
| U+10C06 | 𐰆 | o | o | o | о |
| U+10C07–08 | 𐰇 𐰈 | ö | ö | ö | ө |
| U+10C09–0A | 𐰉 𐰊 | b¹ | b | b | б |
| U+10C0B–0C | 𐰋 𐰌 | b² | b | b | б |
| U+10C0D–0E | 𐰍 𐰎 | g¹ | ğ | g | г |
| U+10C0F–10 | 𐰏 𐰐 | g² | g | g | г |
| U+10C11–12 | 𐰑 𐰒 | d¹ | d | d | д |
| U+10C13 | 𐰓 | d² | d | d | д |
| U+10C14–15 | 𐰔 𐰕 | z | z | z | з |
| U+10C16–17 | 𐰖 𐰗 | y¹ | y | í | й |
| U+10C18–19 | 𐰘 𐰙 | y² | y | í | й |
| U+10C1A–1B | 𐰚 𐰛 | k² | k | k | к |
| U+10C1C–1D | 𐰜 𐰝 | ök | ök | ök | өк |
| U+10C1E–1F | 𐰞 𐰟 | l¹ | l | l | л |
| U+10C20 | 𐰠 | l² | l | l | л |
| U+10C21 | 𐰡 | lt | lt | lt | лт |
| U+10C22 | 𐰢 | m | m | m | м |
| U+10C23 | 𐰣 | n¹ | n | n | н |
| U+10C24–25 | 𐰤 𐰥 | n² | n | n | н |
| U+10C26–27 | 𐰦 𐰧 | nt | nt | nt | нт |
| U+10C28–29 | 𐰨 𐰩 | nč | nç | nç | нч |
| U+10C2A–2B | 𐰪 𐰫 | ny | ny | ní | нй |
| U+10C2C–2E | 𐰬 𐰭 𐰮 | ñ | ñ | ŋ | ң |
| U+10C2F | 𐰯 | p | p | p | п |
| U+10C30 | 𐰰 | op | op | op | оп |
| U+10C31 | 𐰱 | ič | iç | iç | ич |
| U+10C32–33 | 𐰲 𐰳 | č | ç | ç | ч |
| U+10C34–35 | 𐰴 𐰵 | q | q | k | к |
| U+10C36–37 | 𐰶 𐰷 | ıq | ıq | yk | ык |
| U+10C38–39 | 𐰸 𐰹 | oq | oq | ok | ок |
| U+10C3A–3B | 𐰺 𐰻 | r¹ | r | r | р |
| U+10C3C | 𐰼 | r² | r | r | р |
| U+10C3D | 𐰽 | s¹ | s | s | с |
| U+10C3E | 𐰾 | s² | s | s | с |
| U+10C3F | 𐰿 | aš | aş | aş | аш |
| U+10C40–42 | 𐱀 𐱁 𐱂 | š | ş | ş | ш |
| U+10C43–44 | 𐱃 𐱄 | t¹ | t | t | т |
| U+10C45–46 | 𐱅 𐱆 | t² | t | t | т |
| U+10C47 | 𐱇 | ot | ot | ot | от |
| U+10C48 | 𐱈 | baš | baş | baş | баш |
| U+205A | ⁚ | space | space | space | space |
| U+2E31 | ⸱ | ⸱ | ⸱ | ⸱ | ⸱ |
