# Jany-Latyn: A Latin Orthography and Comparative Testbed for the Kyrgyz Language

**A design proposal, reference implementation, and open testbed**

**Version:** 2026.1
**Status:** Public proposal (v1 of the orthography) and living testbed
**Author:** Emil Madraimov · salam@qylym.com
**Date:** September 2026
**License:** This document is licensed CC BY 4.0. The reference engine is MIT; the web testbed is source-available under PolyForm Noncommercial 1.0.0. See `LICENSING.md` in the repository.
**Cite as:** Emil Madraimov (2026). *Jany-Latyn: A Latin Orthography and Comparative Testbed for the Kyrgyz Language*, version 2026.1. https://doi.org/10.5281/zenodo.22844477

---

## Abstract

Jany-Latyn is a Latin orthography for Kyrgyz, published with a deterministic converter and a testbed in which every contested choice is a selectable option. Its governing constraint is that each canonical form be computable from Cyrillic by rule, without a loanword lexicon, so that the text of the past eighty-six years converts unattended. The canonical mappings are `ж→j`, `ч→ç`, `ш→ş`, `х→h`, `ң→ŋ`, `ө→ö`, `ү→ü`, `ы→y`, and `й→í`; vowel length is written by doubling, and the Russian hard and soft signs are absorbed into the glide, so that every word is a single alphabetic token. Two registers are specified together, a formal one carrying the diacritics and a plain-ASCII one for unmodified keyboards. The document also fixes what machines need and orthography proposals usually omit: a reverse conversion whose losses are stated rather than discovered, one search-folding key across both registers, and an alphabetical order with its collation tailoring.

---

## About this document

This is a design proposal, not a research report. It argues for a set of orthographic choices, states the reasoning behind each one, and names the places where the reasoning could be wrong. It does not report experimental results, and no claim in it should be read as an empirical finding unless a source is cited for it.

The author is a life-sciences professional and self-taught developer with university coursework in bioinformatics and philology, and thirty years of native Kyrgyz alongside fluent English and Russian. That standpoint shapes the document in two ways. Judgments about what reads naturally in Kyrgyz, what collides with what, and what people actually type are native-speaker judgments, offered as such. Judgments about tokenizers, collation, and rendering are an engineer's reasoning from documented behavior, and where they are predictions rather than measurements, they are marked as predictions and listed in §13 as things the testbed is built to check.

The orthography described here is at version 1. It has not been used at scale, has not been taught to anyone, and has not been through the kind of review that a state standard would require. The testbed exists so that its claims can be falsified by people who disagree with them.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Scope, Standpoint, and Limitations](#2-scope-standpoint-and-limitations)
3. [Design Principles](#3-design-principles)
4. [The Vowel System](#4-the-vowel-system)
5. [Consonant Inventory](#5-consonant-inventory)
6. [The k/q Question: Synharmonic Allophony](#6-the-kq-question-synharmonic-allophony)
7. [The Back Unrounded Vowel: `y` and Dotless `ı`](#7-the-back-unrounded-vowel-y-and-dotless-ı)
8. [How Jany-Latyn Relates to Existing Systems](#8-how-jany-latyn-relates-to-existing-systems)
9. [Transliteration Architecture](#9-transliteration-architecture)
10. [Two Registers](#10-two-registers)
11. [The Testbed and Its Governance](#11-the-testbed-and-its-governance)
12. [Sociolinguistic and Political Context](#12-sociolinguistic-and-political-context)
13. [Open Questions and Future Work](#13-open-questions-and-future-work)
14. [Conclusion](#14-conclusion)
15. [References](#15-references)

---

## 1. Introduction

A Latin orthography for Kyrgyz (Кыргыз тили) sits where phonology, typographic engineering, and everyday digital practice meet, and the question is not hypothetical. In September 2024, at a meeting in Baku, the Turkic World Common Alphabet Commission, working under the Turkic Academy and the Organization of Turkic States, agreed on a proposed 34-letter Common Turkic Alphabet (CTA) [[1]](#ref1)[[2]](#ref2). Kyrgyzstan is the one OTS member that has not decided to move away from Cyrillic [[2]](#ref2), and the Kyrgyz linguist who represented the country at those talks, Syrtbai Musaev, has said a 28-letter draft Latin alphabet for Kyrgyz is ready and awaiting a political decision by the president and parliament [[2]](#ref2)[[3]](#ref3). President Sadyr Japarov's stated position is that it is premature to discuss the transition and that development of the state language should continue in Cyrillic [[3]](#ref3).

Whatever happens at that level, informal Latin transliteration is already routine. Kyrgyz speakers write Latin every day in messaging, code, social media, commerce, and diaspora communication, with no standard and considerable variation: `ү` appears as *u*, *y*, *v*, or *w*; `ө` as *o*, *oe*, or even the numeral *8*; `ж` as *j*, *zh*, or *dj*; `ң` as *n* or *ng*; and vowel length is written with single letters, doubling, or a trailing *h*, depending on the writer. That variation is the problem this project addresses first, because it is a problem today regardless of state policy.

**Jany-Latyn** offers two things:

1. **A canonical orthography** built to be typed and read now: Latin `ö` and `ü`; cedilla sibilants `ç` and `ş`; `j` for the voiced affricate; `ŋ` for the velar nasal; `y` for the close back unrounded vowel; doubling for phonemic length; and `í` for the palatal glide in every position.
2. **A testbed** in which each contested choice is a toggle. Swap `ı` for `y`, turn on allophonic `q`, write every `ж` as `c`, switch the sibilants to digraphs, substitute `ñ` for `ŋ`, or display Cyrillic `ө` and Kazakh `ұ` inline, then read the same text under each configuration and judge the result.

Two commitments shape the rest. The orthography is specified in **two registers** rather than one, a formal register carrying the diacritics and a plain-ASCII register for unmodified keyboards, and the two are defined together so that neither is a workaround for the other (§10). And it is specified as far as machines need it: reverse conversion with its losses stated, a single search-folding key, and an alphabetical order with a collation tailoring (§9).

Above all, Jany-Latyn is designed to be **derivable from Cyrillic**. That constraint, more than any aesthetic preference, explains most of what follows, including the choices the author would make differently if starting from a blank page (§6).

---

## 2. Scope, Standpoint, and Limitations

### 2.1 What this system is for

Jany-Latyn has two intended uses, and they pull in slightly different directions:

- **A transliteration standard** for text that already exists in Cyrillic, meant to run without human intervention over corpora, archives, place names, and databases.
- **A candidate orthography** for writing Kyrgyz directly in Latin, whether informally today or officially at some future point.

Where the two conflict, the transliteration use wins. The reason is practical: a proposal that cannot process the existing eighty-six years of Cyrillic text automatically is a proposal that begins by discarding the corpus. This is why `k` is unified rather than split into `k`/`q` (§6), why the loan glide is folded into the same `í` used everywhere else (§4.3), and why the reverse conversion is defined to favor native Kyrgyz over Russian loanwords (§9.1).

### 2.2 What this document does not contain

There is no evaluation section. Claims about tokenizer behavior, reading speed, keyboard throughput, font rendering, and search behavior argue from documented system behavior and from the author's experience. §13 lists the ones that could be measured and what result would count against each. Readers who want numbers should treat this document as the hypothesis and the testbed as the apparatus.

### 2.3 Known limitations

- **Latin→Cyrillic conversion is lossy for Russian loanwords.** This is by design and is specified precisely in §9.1. Native Kyrgyz vocabulary round-trips exactly; loan-only distinctions (`ц`, `щ`, `ё` versus `йо`, `ъ`, `ь`) do not survive the round trip.
- **The casual register is one-way.** Text written in ASCII cannot be mechanically restored to the formal register or to Cyrillic (§10).
- **`ŋ` is unevenly available on phones.** It is reachable on the Android keyboard's long-press menu in the US locale (author-confirmed); iOS behavior is unverified. `ñ` remains available as a documented alternative (§5.3).
- **Dialect coverage is partial.** Three extended letters (`ä`, `x`, `w`) are offered for evaluation and none is canonical (§11.2); other dialect features are not represented at all.
- **No pedagogy exists yet.** Nothing here has been tested with learners, in classrooms, or in handwriting.

---

## 3. Design Principles

| Principle | Objective | Payoff |
| :--- | :--- | :--- |
| **1. Cyrillic-derivability** | Every canonical form is computable from Cyrillic by rule, without a lexicon. | The existing corpus converts automatically; no word needs a human decision. |
| **2. Input ergonomics** | Fast typing on standard ANSI/ISO keyboards. | Few dead keys, modifier layers, or long-presses. |
| **3. Phonological economy** | No separate letters for predictable allophones. | Fewer letters, no loss of phonemic accuracy. |
| **4. Typographic and computational stability** | One script, standard codepoints, precomposed forms. | No font fallback mid-word, no cross-script collation, predictable casing. |
| **5. Two registers by design** | A formal diacritic register and an ASCII register, specified together. | Legibility in print and on any unmodified keyboard. |

Principle 1 is the constraint the others are tuned around. Principle 5 is described in §10 and is the part of the system most easily mistaken for a limitation.

---

## 4. The Vowel System

Kyrgyz has eight basic vowels, organized by front/back and rounded/unrounded harmony. Kyrgyz names the front class *жумшак* (soft) and the back class *катуу* (hard), the terms §6 uses for the consonant alternation they condition:

| Height | Front unrounded | Front rounded | Back unrounded | Back rounded |
| :--- | :---: | :---: | :---: | :---: |
| **High** | **i** (и) | **ü** (ү) | **y** (ы) | **u** (у) |
| **Mid** | **e** (э, е) | **ö** (ө) | — | **o** (о) |
| **Low** | — | — | **a** (а) | — |

Six of these contrast short and long: `аа`, `ээ`, `оо`, `өө`, `уу`, `үү`. The two high unrounded vowels, `ы` and `и`, have no long counterparts [[4]](#ref4). Length is written by doubling throughout (§4.3).

The subsections below cover only the vowels where the Latin representation required a decision.

### 4.1 `ü` for `ү`, and the alternatives

The canonical letter for **`ү`** [y] is **`ü / Ü`**, matching Turkish, Azerbaijani, and Turkmen usage for the same vowel, and matching the 2021 Kazakh Latin alphabet, which also selected ü-umlaut for Kazakh `ү` [[5]](#ref5). Length is handled separately by doubling: short `ü` in *kün* (day), long `üü` in *küü* (melody).

The alternatives are paired, not independent. The testbed offers four configurations of the front rounded vowels, and three of them are the same experiment run with different glyphs:

| Configuration | `ө` | `ү` |
| :--- | :---: | :---: |
| Latin umlauts (canonical) | `ö` | `ü` |
| Hybrid `ө` | `ө` | `ü` |
| Cyrillic `ұ` | `ө` | `ұ` |
| Macron `ū` | `ө` | `ū` |

This pairing matters for reading the results. Every alternative to `ü` ships alongside Cyrillic `ө`, so choosing `ұ` or `ū` does not trade one letter for another: it also accepts the script-mixing costs set out in §4.2. The costs compound instead of sitting side by side, and *kөrūū* against *körüü* is what that compounding looks like on the page.

The macron `ū` was tested and set aside. In Latvian and in Māori the macron marks vowel *length*, and length is the value a reader is likeliest to bring to it. Kyrgyz has phonemic length, so `ū` for a vowel *quality* offers a Kyrgyz reader an available and wrong reading. The internal clash is the decisive one: length in this system is written by doubling (§4.3), so the long form of `ū` would be `ūū`, which reads as length marked twice. The argument is specific to Kyrgyz rather than universal: the 2021 Kazakh alphabet uses ū-macron for Kazakh `ұ` [[5]](#ref5), which works there because Kazakh does not carry the same length contrast. The same pattern runs through §8: shared letters where the phonology is shared, and divergence where it is not.

Kazakh `ұ` is retained as a transitional display option because Cyrillic-adjacent glyphs come up in script-planning discussion as a bridge for Cyrillic-literate readers. Two problems come with it. Its narrow crossbar is the feature that distinguishes it, and crossbars are what degrade first at small sizes and under aggressive anti-aliasing, at which point it approaches Latin `y`, a letter that already carries its own phonemic load here (§7). And unlike `ü`, which drops cleanly to ASCII `u`, `ұ` has no ASCII fallback at all, so it fails in exactly the environments the casual register exists for.

`ū` and `ұ` stay in the testbed as settled negative results, and, as the table above shows, what they put to the test is the hybrid script configuration. Their output should be read on those terms.

### 4.2 `ö` for `ө`, and the cost of script-mixing

The canonical letter for **`ө`** [œ] is **`ö / Ö`**. Cyrillic `ө` is retained in the testbed as a display mode for transitional and educational material, not as a candidate for the standard.

The author finds inline Cyrillic `ө` perfectly legible, which is why the case against it cannot rest on legibility. Keeping one Cyrillic letter inside otherwise-Latin text carries three costs, and all three hold however legible a reader finds the glyph:

- **Glyph metrics.** Fonts without Cyrillic coverage substitute another face for that one glyph; fonts with it still draw their Latin and Cyrillic as separate designs, so `ө` commonly sits at a smaller x-height than the Latin lowercase beside it. Either way the word carries a letter that does not match its line, and the effect changes with every font stack the text passes through. This is the least speculative of the three costs, and the cheapest to check (§13.4).
- **Collation.** Under the Unicode Collation Algorithm, Latin and Cyrillic sort in different weight groups [[6]](#ref6), so mixed strings sort unpredictably against pure-Latin ones. Alphabetizing a name list becomes locale-dependent in a way it need not be. The alphabet order is given in §9.5 and the sorting rules in §9.6.
- **Tokenization (predicted, not measured).** SentencePiece splits input at Unicode script boundaries by default, so `kөl` may be segmented into three pieces rather than one [[7]](#ref7). Byte-level BPE tokenizers whose pre-tokenizer groups all letters regardless of script will not necessarily behave this way, and `ö` and `ө` occupy the same two bytes in UTF-8, so the effect depends on the tokenizer. §13.1 states how to test it.

Standard `ö` avoids all three without asking anything of the reader that `ü` does not already ask.

### 4.3 Phonemic length, and the `е` problem

Length is written by **doubling**: *ток* [tok] (sated) against *тоок* (chicken), *Ala-Too*, *aalam*, *jeek*, *kuu*, *küü*.

The alternative was a macron over a single vowel, on the Latvian and Māori model, which would give *tōk* for *took* and *Ala-Tō* for *Ala-Too*. It is the more compact of the two notations, and it is what a reader of those orthographies would expect. Doubling is preferred to it for four reasons: combining marks are stripped or normalized inconsistently by search and database layers; doubling needs no dead key or long-press, only the same key twice; Kyrgyz Cyrillic already writes length by doubling, as does the Kyrgyz Arabic orthography [[4]](#ref4), so the convention is inherited rather than invented; and two of the six vowels that lengthen already carry a mark, so long `öö` and `üü` would need the stacked `ȫ` and `ǖ`, which sit outside Latin-1, are thin on font coverage, and cannot be typed without a dead key.

That settles the macron for both jobs it could have held here: as a length mark in this section, and as a letter for `ү` in §4.1, where the length reading was precisely the problem.

Sometimes described as an archaism, Kyrgyz long vowels are largely a secondary development from the loss of intervocalic consonants (*тоо* from an older form with a velar), and not a retention of Proto-Turkic length of the kind Turkmen preserves. The relevant fact for orthography is only that the contrast is live and phonemic in modern Kyrgyz.

The one irregularity that must be resolved explicitly is `е`. Kyrgyz Cyrillic never doubles it; long /eː/ is written `ээ` in every position (*ээги*, *керээз*, *кээде*, *жээк*), which Jany-Latyn renders as it looks: **`ee`** (*eegi*, *kereez*, *keede*, *jeek*). But `е` has a second job in Russian loans, where it represents [je] word-initially (*Европа*, *Енисей*) and after a vowel (*переезд*, *проект*). Jany-Latyn handles that with the glide letter it already has: loan [je] is **`íe`** (*Íevropa*, *pereíezd*, *proíekt*), native word-initial [e] stays **`e`** (*ene*, *el*), and post-consonantal [e] stays **`e`** (*kel*, *mektep*). Post-vocalic `е` in a loan that is not iotated in Kyrgyz speech, as in *поэт* and *аэропорт*, is written plain: *poet*, *aeroport*. Three graphemes (`e`, `ee`, and `íe`) cover every position. What they do on the way back to Cyrillic is specified in §9.1.

### 4.4 The palatal glide `í`

Writing both `и` [i] and `й` [j] with plain `i` produces a barcode: *бийик* → `biiik`, *кийим* → `kiiim`, *кийин* → `kiiin`. Three or four vertical strokes in a row are hard to parse and impossible to tell from a long vowel. The testbed renders this mapping on demand (§11.1), so the claim can be judged on a page of real text rather than on three words.

The canonical glide is **`í / Í`** in every position: *aí*, *toí*, *tyíyn*, *biíik*, *kiíim*. Four arguments support it.

1. **A separate glide letter is forced, not chosen.** The CTA writes the glide `y`, which it can afford because it moves the back unrounded vowel to dotless `ı` [[8]](#ref8). Jany-Latyn assigns `y` to that vowel (§7), so the two roles cannot share a letter. If they did, native sequences of vowel plus glide would collapse: *тыйын* as `tyyyn`, *кыйык* as `kyyyk`, *айыл* as `ayyl`. That is the same legibility failure the letter exists to fix, reappearing one vowel to the left.

2. **The acute is chosen for its relationship to `й`, not for its meaning elsewhere.** `й` is `и` with a mark above it; `í` is `i` with a mark above it. A reader literate in Kyrgyz Cyrillic already treats that pair as related but distinct, and `i`/`í` carries the relationship across intact.

3. **It preserves lexical roots.** Kyrgyz is agglutinative and stems must stay recognizable. *Кийим* (clothing) comes transparently from *кий-* (*kií-*, to wear); *тийиштүү* comes from *тий-* (*tií-*). Contracting these to `kiim` and `tiishtüü` truncates the verb stem and splits related forms arbitrarily: `biíi` (its dance) would keep the glide while `biíik` (tall) lost it.

4. **It makes the glide exceptionless.** Every Cyrillic `й` becomes `í` in every position, with no positional rules and no lookups.

The barcode argument applies to the formal register only. In the casual register `í` drops to `i` and *biíik* becomes `biiik` again (§10). This is a real cost of the two-register design, not something the design escapes.

#### Why the acute, and not another mark

Argument 2 leaves an objection standing, and §4.1 rejected the macron on the same ground. The acute is not free of associations elsewhere: in Czech, Slovak, Hungarian, and Irish it marks length, and in Spanish it marks stress. The difference is what a *Kyrgyz* reader brings to the page. Kyrgyz stress is regular and never written, and Kyrgyz length is written by doubling, so within this system the acute has no competing job. The macron is not free in the same way: its established value is length, and length is a live phonemic category in Kyrgyz rather than an absent one, which is what ruled it out in §4.1. The standard applied here is internal consistency within this system, and it gives different answers for the two marks.

Two questions hide inside the choice, and they are better taken apart: which mark, and which letter it sits on.

Of the marks that can sit on `i`, a diaeresis (`ï`) would collide visually with the fronting marks on `ö` and `ü`. A circumflex (`î`) is available, but in Turkish it marks length in Arabic loanwords (*millî*, *tarihî*), which is the objection that ruled out the macron, arriving from the nearest Latin Turkic tradition. A caron (`ǐ`) is heavier at text sizes and sits outside Latin-1. Two alternatives are close enough to ship as testbed options rather than to dismiss (§11.1). The breve `ĭ` has the best claim of them: it is the literal analogue of the Cyrillic letter, which is `и` under a breve, and it is what ALA-LC chose for that reason [[8]](#ref8). It loses on weight and reach, being heavier than an acute at reading sizes, outside Latin-1, and absent from most layouts and long-press menus, and those are differences of degree, so the testbed renders whole texts in it and lets the comparison be made on a page. The tilde `ĩ` is weaker still and carries an interaction: a reader who also selects `ñ` for the velar nasal puts the same mark on two letters doing unrelated jobs, which the testbed warns about (§11.1). `í` (U+00ED) is the lightest of the set, and it is in Latin-1, on Spanish, Portuguese, Irish, and Icelandic layouts, and on standard mobile long-press menus.

The base is a separate question, and the systems compared in §8.1 answer it four ways: `j` in ISO 9 and Tynystanov's 1928 alphabet, `y` in BGN/PCGN and the CTA, `ý` in Turkmen, and a marked `i` in ALA-LC. The `j` and `y` choices map the sound onto a letter that already carries /j/ in some Latin tradition, `j` from German and Slavic spelling and `y` from English and Turkish. Turkmen is the instructive one, because it starts where this orthography starts: it has no dotless `ı`, so `y` holds the back unrounded vowel [ɯ] and the glide is written `ý`, and one syllable can carry both, as *ýyl* (year) does.

Two things argue for `i` over `y` as the base, and neither depends on Cyrillic being the source script. The first is that [j] is the semivocalic counterpart of [i], the same articulation without a syllable of its own, which is why transcription can write it as a non-syllabic `i`, and why *ko-i-on* and *ty-i-yn*, said fast enough, arrive at *koíon* and *tyíyn*. The glide keeps that identity wherever it lands, including after `o` and `y`. The semivocalic counterpart of [ɯ] is not [j] but [ɰ], a velar approximant Kyrgyz has no use for, so `ý` would assert a kinship the phonetics denies. Cyrillic happens to agree, since `й` is `и` with a mark and alternates with `и` inside the same roots (*кий-*, *кийим*).

The second is what happens when the mark comes off. The casual register and search folding both strip diacritics (§10, §9.4), so `í` drops to `i` while `ý` would drop to `y`. Under `í`, *тыйын* and *айыл* reach ASCII as `tyiyn` and `aiyl`. Under `ý` they would arrive as `tyyyn` and `ayyl`, the collapse argument 1 introduced a separate glide letter to prevent, returning by the back door. Sorting adds a third consideration: under the ordering principle of §9.5 a marked `y` would be taught and filed at the end of the alphabet, away from the letter it alternates with.

The one genuine conflict is with stress notation. Teaching materials, dictionaries, and foreign-language textbooks mark stressed syllables with an acute (*a-tá*, *o-ro-mó*), and on `i` that mark and the glide would be the same character. The conflict is narrower than it first appears: it arises only when stress falls on /i/, leaving every other vowel free to take a stress acute unambiguously, and Kyrgyz stress is largely predictable and word-final, so marking it is a device for exceptions and loans in a small body of specialized material rather than a feature of ordinary text. Weighed by frequency, the glide occurs in running text constantly and the stress mark does not. The resolution is to give pedagogy a device that does not compete with any letter: bolding the stressed syllable, or the IPA stress mark before it (*bi-ˈíik*), which has the further advantage of working identically across the whole vowel inventory. §13.6 lists the convention as work still to be written.

Kazakhstan's successive alphabets are the cautionary case, and §8.5 follows them decree by decree. The lesson is not that acutes fail, but that a diacritic scattered across six or seven letters reads as clutter where a single systematic use does not. `í` is one letter with one job.

---

## 5. Consonant Inventory

| Cyrillic | Jany-Latyn | Note |
| :---: | :---: | :--- |
| б, г, д | b, g, d | Standard correspondence; see §6 for `g`'s uvular allophone. |
| ж | **j** | Voiced affricate [dʒ] — §5.1. |
| з | z | Standard correspondence. |
| й | **í** | Universal glide — §4.4. |
| к | **k** | Unified velar/uvular — §6. |
| л, м, н | l, m, n | Standard correspondence. |
| ң | **ŋ** | Velar nasal; `ñ` available as an alternative — §5.3. |
| п, р, с, т | p, r, s, t | Standard correspondence. |
| в, ф | v, f | Loanword integration; optional `w` under evaluation — §11.2. |
| х | h | *rahmat*, not Russian *kh*; optional `x`/`h` split under evaluation — §11.2. |
| ц | ts | Loan digraph, *tsirk*; reverse behavior in §9.1. |
| ч | **ç** | §5.2. |
| ш, щ | **ş** | `щ` merges into `ş` — §5.2. |
| ъ, ь | *(absorbed or dropped)* | Absorbed into the glide before an iotated vowel, dropped at the coda — §5.4. |
| я, ё, ю | ía, ío, íu | §5.4. |

### 5.1 `j` for `ж`

Native initial and medial `ж` is a voiced postalveolar affricate [dʒ], the sound of English *j* in *journey*, not the Russian-mediated fricative [ʒ] that `zh` implies. Jany-Latyn writes **`j`**: *jakşy*, *jaŋy*, *jol*, *jigit*.

This is not a novel choice for Kyrgyz. The BGN/PCGN romanization, which the Kyrgyz government adopted for rendering geographic names in Latin script [[8]](#ref8), also writes `ж` as `j`, and the result is visible on Kyrgyz passports and in international coverage: *Japarov*, *Jalal-Abad*. Against that, `zh` costs an extra keystroke on one of the highest-frequency consonants in the language and tells an international reader the wrong thing.

The divergence from the CTA, which assigns `c` to this sound and `j` to [ʒ] [[8]](#ref8), is deliberate and is argued in §8.2.

### 5.2 Sibilants: `ç` and `ş`

The canonical sibilants are **`ç`** and **`ş`**: *çaí*, *şaar*. Digraphs were considered and set aside for the formal register because Kyrgyz morphology produces collisions with them.

The agentive suffix `-чы/-чи` on a stem ending in `ш` is the everyday case: *баш* + *-чы* → *башчы* gives the boundary-obscuring `bashchy` under digraphs, against the clean `başçy` with cedillas. The `s`+`h` sequence in personal names is the other: **Исхак** (Is-hak) transliterates via digraph to `ishak`, which is also how *ишак* would come out, a Russian and Uzbek word for "donkey" that most Kyrgyz speakers recognize, even though the native word is *эшек*. Cedillas keep them apart: `ishak` against `işak`.

Russian `щ` merges into **`ş`** (*ящик → íaşik*, *борщ → borş*) instead of producing a trigraph. Spoken Kyrgyz realizes it as [ʃ], and `şç` would collide in reverse with native `başçy`.

The digraphs are not discarded; they are relocated. `janyToCyr` accepts legacy `ch`, `sh`, and `sch` on reverse conversion so that older text and casual writing convert correctly, and the testbed can render whole texts in digraph mode for comparison. The ASCII register is treated in §10.

### 5.3 The velar nasal: `ŋ`, with `ñ` as an alternative

**`ŋ / Ŋ`** (U+014B / U+014A) marks the single phoneme [ŋ] and keeps it distinct from a real `n`+`g` cluster: *күнгө* (stem *kün* + dative *-gö*) stays `küngö`, while *жаңы* is `jaŋy`, not the ambiguous `jangy`.

Eng was chosen for continuity of shape. Cyrillic `ң` (en with descender) and Tynystanov's 1928 Latin `ꞑ` (n with descender) [[4]](#ref4) both carry the `n` below the baseline, and `ŋ` (eng) hooks its right leg to the same effect. Among the available options it is the only one with continuity in both the Cyrillic and the 1928 Latin traditions. The CTA's `ñ` (n with tilde) puts its mark above the letter instead, and for readers with any Spanish exposure it carries a specific wrong reading, the [ɲ] of *piñata* and *mañana*.

`ŋ` also has real costs:

- Mobile availability is uneven. It is reachable by long-pressing `n` on the Android keyboard in the US locale; iOS and non-US locales have not been checked, and `ñ` is the option reliably present everywhere.
- Capital `Ŋ` has two different designs in circulation, an enlarged lowercase form and an N-based form, so all-caps text can look inconsistent across fonts.
- It sits outside Latin-1 and Windows-1252, where `ñ` is present.

Kazakhstan's recent revisions show this is a genuinely open question rather than a settled one: the version presented in January 2021 used `Ŋ` and the April 2021 version replaced it with `Ñ` [[9]](#ref9), while the current Uzbek draft keeps the digraph `ng` for the same sound [[9]](#ref9). Jany-Latyn keeps `ŋ` as canonical on the derivation and false-friend arguments, and ships `ñ` as a first-class testbed option for anyone who weighs mobile typing more heavily. The keyboard layouts in §11 make `ŋ` a single keystroke on desktop, and the casual register writes it `n` (*jaŋy → jany*), which is what people already type.

### 5.4 Loan signs `ъ` and `ь`

The hard and soft signs mark hiatus and palatalization that Jany-Latyn captures with the glide it already has. A separating sign before an iotated vowel is absorbed into `í` (*объект → obíekt*, *семья → semía*, *разъезд → razíezd*). A coda soft sign, which Kyrgyz phonology does not realize as palatalization in natural speech, is dropped (*июль → iíul*, *апрель → aprel*, *роль → rol*). Iotated vowels decompose consistently: **я → ía**, **ё → ío**, **ю → íu** (*saíakat*, *koíon*, *aíuu*), while non-iotated hiatus stays plain (*диаграмма → diagramma*).

The result is that every word written in Jany-Latyn is a continuous alphabetic string matching `\p{L}+`, with no internal apostrophes. That property has concrete consequences: search indexes and naive tokenizers do not fracture the word at a punctuation mark, and double-clicking selects all of it [[10]](#ref10). Uzbek, which uses apostrophes in `oʻ` and `gʻ`, offers a live demonstration of what the alternative costs in practice, since the mark is routinely replaced by whichever quote character the keyboard produces.

This property does **not**, however, make URLs ASCII-clean. `í`, `ŋ`, `ö`, `ü`, `ç`, and `ş` are all non-ASCII and percent-encode in a URL path (`ŋ` becomes `%C5%8B`). What the `\p{L}+` property gives is a single, unbroken token; what produces clean slugs is the ASCII register (§10), which is the correct layer for slug generation: *jaŋylyktar → janylyktar*.

---

## 6. The k/q Question: Synharmonic Allophony

Several Turkic orthographies use separate letters for the uvular stop [q] and the uvular fricative [ʁ]. In Kyrgyz these are positional allophones, predictable from the vowels of the word:

| Harmonic context | Vowels | Phoneme | Realization | Grapheme | Examples |
| :--- | :--- | :---: | :--- | :---: | :--- |
| Back (Катуу) | a, o, u, y | /k/ | Uvular stop [q] | **k** | *kar* [qar], *kyz* [qɯz] |
| Back (Катуу) | a, o, u, y | /g/ | Uvular fricative [ʁ] | **g** | *aga* [aʁa], *kyrgyz* [qɯrʁɯz] |
| Front (Жумшак) | e, i, ö, ü | /k/ | Velar stop [k] | **k** | *kel* [kel], *küz* [kyz] |
| Front (Жумшак) | e, i, ö, ü | /g/ | Velar stop [g] | **g** | *gül* [gyl], *egemen* [egemen] |

A Kyrgyz speaker reading *kar* produces [q] automatically; producing front [k] there would violate the language's phonotactics. Writing the two separately encodes a rule speakers already apply. Turkish makes the same choice for `k` and `g` on the same grounds, though it retains `ğ` for a related distinction.

The author's own preference is `q`. On phonological grounds it is the more honest letter, it is what most of the Turkic and Arabic-script world reaches for, and it has real historical weight in Kyrgyz specifically. The canonical standard nevertheless unifies `k` and `g`, and the reason is Principle 1 rather than a belief that `q` is wrong.

If `q` is written, the voiced counterpart becomes an immediate question: *egemen* has front [g], *kagyluu* has back [ʁ], and if the voiceless distinction is worth a letter, symmetry says the voiced one is too. Every system that has taken the step has taken both halves of it: Tynystanov's 1928 alphabet had `q` and `ƣ` alongside `k` and `g` [[4]](#ref4), the CTA has `q` and `ğ` [[8]](#ref8), and the 2021 Kazakh alphabet uses ğ-breve for `ғ` [[5]](#ref5). A `q`-without-`ğ` system is possible, since the vowels predict `g`'s value just as they predicted `k`'s, but the asymmetry has to be defended rather than assumed, and the defence does not hold. The lexicon dependency is the same dependency at the same strength: the rule that produces `qosmos` produces `ğaz`, `ğaloş`, `mağazin`, and `proğramma`, and nothing short of a loanword lexicon stops either of them. What separates the two letters is not derivability but which layer each one taxes. `q` is an ASCII key, so it costs no diacritic and it survives into the casual register; `ğ` costs a diacritic and folds back to `g` the moment the text drops to ASCII (§10). In a search index the relation inverts, since `ğ` folds to `g` for nothing under NFD while `q` and `k` are separate keys that split an index unless a fold is added (§9.4). Neither letter is cheap, and neither is cheap in a way that would license writing one without the other. **This system's position is therefore that `q` entails `ğ`.** The canonical standard declines both; a standard that adopts the voiceless letter adopts the voiced one with it. The testbed keeps them as independent toggles so that the asymmetric configuration can still be generated and looked at (§11.1), but one argument governs both.

Three considerations keep the canonical standard on unified `k` and `g`:

- **Derivability from Cyrillic.** Kyrgyz Cyrillic has never had a separate `қ` [[4]](#ref4), so `q` cannot be recovered from the source text by any rule that does not also know which words are loans. Note the historical nuance: the merge was not Tynystanov's doing. His Arabic reform and his Latin alphabet both distinguished the two sounds [[4]](#ref4). The single `К` arrived with the Cyrillic alphabet in 1940, two years after he was executed in the purges. Whoever made that decision and for whatever reason, eighty-six years of literacy have since been built on it.
- **Loanwords.** Modern Kyrgyz absorbs *kosmos*, *karta*, *bank*, *respublika*, all with plain European [k], never [q]. A harmony rule cannot tell them from native back-harmonic stems: it produces `qosmos`, `parqta`, and mixed-harmonic hybrids like `Respubliqası` for correct `Respublikasy`. There is no clean fix short of a maintained loanword lexicon. Call this **the lexicon dependency**: a spelling rule that cannot be applied until something knows which words are borrowed. A state-backed standard, with an institute and a budget behind it, can carry that dependency. A converter that has to run over an archive unattended cannot.
- **Keyboard and algorithmic economy.** Dropping `q` and `ğ` removes two keys and keeps the conversion rule-based.

The strongest counter-argument runs the other way. Because loans keep velar [k] in back-vowel words, [k] and [q] arguably now contrast in modern spoken Kyrgyz (*kosmos* against *koş*), which is the classic profile of an allophone becoming a phoneme. If that analysis is right, a future standard written by people rather than derived by machine should adopt `q`. Jany-Latyn's position is narrower than "q is wrong": it is that `q` cannot be derived from Cyrillic without a lexicon, and this system is defined by derivability.

One interaction runs between this question and §11.2. The harmony rule above reads the vowels to decide the consonant, so it is only as good as the vowel inventory it reads. Standard Cyrillic writes one `а` for both the back vowel and the fronted variant that appears in Persian-derived and harmonically assimilated words, so `q` mode has no way to tell *äka* from *aqa*, *ükä* from *üqa*, or *källä* from *qalla*. Writing `ä` (§11.2) supplies exactly the information the rule is missing. That makes the two options dependent on each other: a fair evaluation of `q` on southern text is an evaluation of `q` with `ä` enabled.

The testbed's `q` toggle exists so that this can be checked rather than asserted. Run over contemporary news or social-media text, `q` mode puts the loanword distortions on screen within a paragraph.

---

## 7. The Back Unrounded Vowel: `y` and Dotless `ı`

The CTA and Turkish write `ы` [ɯ] as dotless **`ı`** [[8]](#ref8). Jany-Latyn writes **`y`**, and the testbed allows the two to be swapped. Doing so surfaces two compounding problems.

The first is casing. Dotless `ı` and dotted `i` are the lowercase forms of two different capitals, and mapping them correctly needs locale-aware case conversion; the Turkish and Azerbaijani mappings are a documented special case in the Unicode Character Database [[11]](#ref11). Turkish answers with a second capital, `ı` to `I` and `i` to `İ`. That holds only if every system in the chain applies those mappings, and only if the reader knows the letter. A Kyrgyz reader who has not learned Turkish has no reason to know `İ` exists, so a correctly cased `KIRGIZ` still reads as *КИРГИЗ*: the distinction survives the encoding and is lost in the reading.

Outside a `tr_TR` or `az_AZ` locale, which is to say in most databases, indexes, and runtimes, the distinction is lost in the encoding too, since both letters collapse to plain `I`. *КЫРГЫЗ* and *КИРГИЗ* then arrive as the same string, and `kırgız` uppercases to `KIRGIZ`, an exonym Kyrgyzstan left behind. The dotless configuration therefore adds a dependency on locale-correct casing everywhere the text travels. Latin `y` carries none: `Y` and `I` are distinct capitals under every locale and every case function, and the state's own English name, used since 1991 across treaties, passports, and diplomatic usage, is *Kyrgyz Republic*.

The second is that the distinction is unreliable. `y` and `i` are unmistakable at any size, so *kyna* and *kina* never collide. Under dotless `ı` the same pair differs by a single dot, which degrades in small type, in handwriting, and on low-resolution screens. Below the formal register it disappears altogether: the casual register is plain ASCII, so `ı` folds to `i` there (§10), and search folding does the same (§9.4), which leaves *kına* and *kina* as one string in casual writing and one key in an index. With `y` the distinction survives everywhere. The testbed's `ı` mode compensates for the loss by force-enabling allophonic `q`, because a consonant-level distinction is needed once the vowel-level one is unreliable. Adopting `ı` therefore does not cost one letter: it reopens the letter-count question that §6 settled for this system, and settled on derivability rather than on principle.

Musaev's proposal reaches the same letter from a different direction (§8.3), and in doing so departs from its own historical base: Tynystanov wrote `ы` as `ь` and spent `y` on `ү` [[4]](#ref4).

---

## 8. How Jany-Latyn Relates to Existing Systems

### 8.1 Existing romanizations of Kyrgyz

There is no generally accepted romanization of Kyrgyz; for geographic names the government adopted BGN/PCGN [[8]](#ref8). Four systems are in circulation, and Jany-Latyn relates to each of them differently.

| Cyrillic | BGN/PCGN | ALA-LC | ISO 9 | CTA | **Jany-Latyn** |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ж | j | zh | ž | c | **j** |
| й | y | ĭ | j | y | **í** |
| ы | y | y | y | ı | **y** |
| ң | ng | n͡g | ņ | ñ | **ŋ** |
| ө | ö | ȯ | ô | ö | **ö** |
| ү | ü | u̇ | ù | ü | **ü** |
| ч | ch | ch | č | ç | **ç** |
| ш | sh | sh | š | ş | **ş** |
| х | kh | kh | h | h | **h** |
| ъ / ь | ˮ / ʼ | ʺ / ʹ | ʺ / ʹ | ʺ / ʹ | *(absorbed or dropped)* |

(BGN/PCGN, ALA-LC, ISO 9, and CTA columns after [[8]](#ref8).)

**BGN/PCGN** is the system with official standing in Kyrgyzstan, and Jany-Latyn agrees with it on the two letters that matter most for recognizability: `j` for `ж` and `ö`/`ü` for the front rounded vowels. It is a transcription for foreign readers rather than an orthography, and it shows: it writes both `й` and `ы` as `y`, which is exactly the merger §4.4 argues is unreadable in running Kyrgyz text (*тыйын* would be *tyyyn*), and it uses digraphs `ch`, `sh`, `kh`, `ng` that collide at morpheme boundaries (§5.2). Its strength is that it needs no letters beyond `ö` and `ü`; its weakness is that it was never meant to be written by Kyrgyz speakers.

**ALA-LC** is a library cataloging standard and optimizes for reversibility with combining marks (`n͡g`, `u̇`, `ĭ`). It is the only system that shares Jany-Latyn's instinct about the glide, writing `й` as `ĭ`, a mark on `i`, for the same reason given in §4.4. But its combining diacritics are the specific thing §4.3 avoids: they normalize inconsistently and are unusable on an ordinary keyboard.

**ISO 9** is a mechanical Cyrillic-to-Latin mapping designed to be script-agnostic, not language-specific. It writes `й` as `j` and `ж` as `ž`, which is precisely backwards from the perspective of a language where `ж` is [dʒ]. It round-trips perfectly and reads badly, which is a reasonable trade for a bibliographic standard and not for an orthography.

**The CTA** is treated in §8.2.

Jany-Latyn's differences from all four follow from a different goal. These systems transcribe Kyrgyz *into* Latin for people who read something else. Jany-Latyn is meant to be read intuitively by native Kyrgyz speakers.

### 8.2 The Common Turkic Alphabet

The 34-letter CTA agreed in Baku in September 2024 [[1]](#ref1)[[2]](#ref2) is intended as a shared baseline across the Turkic world, with each country adapting it nationally [[3]](#ref3). Jany-Latyn shares the CTA's functional core wherever Kyrgyz phonology supports it (`ö`, `ü`, `ç`, and `ş` all match). Six letters differ. Two of them are argued here; the others are `ы` (§7), `к` and `г` (§6), and `ң` (§5.3).

**`í` where the CTA uses `y`.** The CTA can use `y` for the glide because it moves `ы` to dotless `ı`. In Jany-Latyn, `y` is committed to that vowel (§7), so the roles are mutually exclusive rather than a matter of taste.

**`j` where the CTA uses `c`.** In the CTA, following Turkish, `c` is [dʒ] and `j` is the [ʒ] of loanwords. Jany-Latyn has one letter to place rather than two, since Kyrgyz Cyrillic writes a single `ж` for both sounds, and it places it on `j`. To a reader without Turkish literacy, `c` is not a neutral symbol: it suggests [s] to a French-influenced reader and [k] to an English one. `j` is read as something close to [dʒ] by nearly every Latin-literate reader who has not been trained on Turkish, and it is already the letter used for `ж` in Kyrgyz official romanization (§5.1). For a system aimed at diaspora typing on non-Turkish keyboards and at international legibility, `c` is a false friend.

The `c`/`j` split carries the lexicon dependency of §6. In the CTA, `c` is the native affricate and `j` the loanword fricative, so *жазуу* would be *cazuu* while *журнал*, pronounced with the Russian fricative, stays *jurnal*. Kyrgyz Cyrillic writes one `ж` for both and nothing in the spelling says which is which, so the split needs the same lexicon that `q` needs, and `ğ` alongside it. A CTA-aligned Kyrgyz orthography therefore depends on a maintained loanword list at three separate points in its consonant inventory. The cost falls on automatic conversion, not on a human writer who knows the vocabulary, and it is the cost Principle 1 was written to avoid: a single `j`, a single `k`, and a single `g` are what make the existing corpus convertible without one.

This is also a divergence from the Kyrgyz Latin tradition, not just from a modern committee. Tynystanov's alphabet used `j` for the glide `й` and `c` for the affricate `ж` (replaced by `ƶ` in the 1938 revision) [[4]](#ref4), the same assignment the CTA and Musaev use. This orthography accepts the break: `ƶ` reads as a modified `z`, which signals [dʒ] no better than `c` does, and it remains a rare Latin Extended-B character with thin font coverage.

Beyond letters, the argument for not adopting the CTA wholesale is structural. Kyrgyz has phonemic vowel length that Turkish lacks; Kyrgyz `ж` is an affricate where Turkish `j` is a fricative; Kazakh underwent sibilant shifts Kyrgyz did not. An orthography tuned to its own phonology will agree with a pan-Turkic standard where the phonology agrees and part from it where it does not, which is the pattern above. The CTA itself anticipates this: a participant at Baku noted that a language needing fewer than all 34 letters can adapt the alphabet to itself [[3]](#ref3).

There is also a cost that is not linguistic at all. Orthographic near-identity with Turkish, Azerbaijani, or Uzbek gives up the signal by which machines tell a smaller language apart, which matters most for short strings and for the automated labeling that builds corpora. The prediction that follows from it is directional rather than mutual: influence travels from the language with more speakers, more text, and more tooling toward the one with less, reaching spelling first and lexicon and written norm behind it. §12.1 sets out the mechanisms, the evidence for each, and the reply the CTA's advocates make, that mutual legibility across Turkic writing is worth that cost.

### 8.3 Musaev's historical revival

Syrtbai Musaev, director of the linguistics institute at I. Arabaev Kyrgyz State University and one of Kyrgyzstan's representatives at the 2024 Baku talks, proposes a 28-letter Latin alphabet built on Tynystanov's project, arguing that it preserves the phonemic structure of Kyrgyz completely and therefore raises no linguistic problems [[3]](#ref3). He is explicit that alphabet and orthography are political questions in Kyrgyzstan: a change requires a decision by the president and a resolution of the Jogorku Kenesh, and scholars can only propose [[3]](#ref3).

The two proposals agree on more than they disagree on. Both use `ö`, `ü`, `ç`, `ş`, and both use `y` for `ы` [[3]](#ref3). The divergences follow from his being a revival and this being a fresh design: his alphabet restores the `k`/`q` split that Tynystanov's had (§6), writes `ж` as `c` after Tynystanov and the CTA (§8.2), and marks the velar nasal with `ņ` instead of eng. Both mark the same base letter for the same reason, though not by the same device: `ņ` is `n` with a cedilla, a mark attached beneath, where `ŋ` and Tynystanov's `ꞑ` carry the stroke of the letter itself below the baseline (§5.3). `ŋ` also has the better font and IPA support of the two.

The more consequential difference is not linguistic. Musaev's proposal has a plausible route to becoming law that this project neither has nor claims. Jany-Latyn's contribution runs the other way. It exists as running software today, engineered against problems a 1920s alphabet was never built to answer: deterministic Cyrillic round-tripping, tokenization, search folding, and an ASCII register. The two proposals are not competing for the same job.

### 8.4 Other domestic proposals

Musaev's is not the only Kyrgyz Latin project. A 30-letter alphabet published at qyrgyz.com, developed with input from historian Tynchtykbek Chorotegin and others, likewise starts from the 1930s Latin alphabet but modernizes its rare letters, replacing `Ƣ` with `Ğ` and `Ь` with `Y`, and normalizing `Ꞑ`, `Ɵ`, and `Y` to `Ñ`, `Ö`, and `Ü` [[12]](#ref12).

Jany-Latyn agrees with it on `Y` for `ы`, `Ö`, and `Ü`: three points on which three separate projects converged independently. It diverges on `Ğ` and `Ñ`, for a different reason in each case. `Ğ` survives in a revival because Tynystanov's alphabet had `Ƣ`; it cannot survive Principle 1, since Kyrgyz Cyrillic writes a single `г` and nothing in the spelling says where the split falls (§6). `Ñ` is the closer call, because both projects are modernizing the same letter, Tynystanov's `Ꞑ`, and disagree about what should replace it: `Ñ` moves the mark above the letter as a tilde, while `Ŋ` keeps the descending stroke (§5.3). What separates the two conclusions is the starting point rather than the phonology, which both projects read the same way.

### 8.5 What Kazakhstan and Uzbekistan demonstrate

Kazakhstan is the most useful comparison available, because it shows what happens to an alphabet between decree and daily use. The 2017 decree introduced an apostrophe-based alphabet that was widely mocked; in February 2018 a second decree replaced the apostrophes with acute accents [[13]](#ref13); the acute version was itself criticized, in part over the acutes and the digraphs it retained [[14]](#ref14); and in 2021 a further revision settled on 31 letters using umlauts, a macron, a breve, and a cedilla — `ä`, `ö`, `ü`, `ū`, `ğ`, `ş` [[5]](#ref5). Even within 2021 the velar nasal changed from `Ŋ` to `Ñ` between the January and April versions [[9]](#ref9). The completion date has moved from 2025 to 2031 [[15]](#ref15). Uzbekistan began its transition in 1993 and it is still not complete [[3]](#ref3), with a 2021 draft revision still retaining the digraph `ng` [[9]](#ref9).

Three lessons carry into this document. Letter-level decisions that look settled get reopened, which is an argument for shipping a testbed rather than a decree. Diacritic systems are judged in public on how they look in bulk, and the phonological logic rarely enters the argument, which is why §4.4 restricts the acute to a single systematic use. And the gap between adopting an alphabet and writing in it is measured in decades.

Kyrgyzstan has its own version of the third lesson, and it is closer to home: an orthography reform adopted in 2004 was rolled back after the public did not take it up [[3]](#ref3).

---

## 9. Transliteration Architecture

Cyrillic→Latin conversion is deterministic and rule-based: every canonical form is computed from position and vowel context, with no lexicon. Latin→Cyrillic conversion is also deterministic, but it is **not lossless**. The Cyrillic→Latin mapping is many-to-one, since several Cyrillic distinctions that exist only in Russian loanwords are deliberately merged, and a merged distinction cannot be recovered.

§9.1 and §9.2 describe what the converter does with loanwords and why, and are written for anyone judging the orthography. §9.3 to §9.6 specify the behavior an implementation has to reproduce: the `e` rules, Unicode normalization, search folding, the alphabet, and machine sorting. A reader who is not implementing the converter can take §9.3 to §9.6 on trust and continue at §10, with the exception of the alphabet itself in §9.5.

### 9.1 The native-priority rule

> **Where two Cyrillic spellings map to the same Latin string, reverse conversion restores the one that occurs in native Kyrgyz vocabulary. Distinctions that exist only in Russian loanwords are the ones allowed to be lost.**

This single rule decides every ambiguous case, and it follows from Principle 1: the corpus that must survive automatic conversion is the Kyrgyz one.

Which losses appear in the table is partly downstream of a question §13.6 leaves open: whether loanwords are spelled from their Russian source or from Kyrgyz pronunciation. *poet → поет* and *aeroport → аеропорт* are losses under the current approximating treatment and would not be under a source-faithful one. Either way, the general point stands: a conversion that preserves every loanword spelling in both directions needs lookup dictionaries, which a state-backed standard could maintain and a rule-based converter cannot.

| Latin | Reverses to | Why | What is lost |
| :--- | :---: | :--- | :--- |
| `ts` | **тс** | Native т+с is frequent and productive: *кетсе*, *айтса*, *өтсө* | loan `ц`: *tsirk → тсирк* |
| post-vocalic `íe` | **йе** | Root integrity: *kií-* → *кийет*, *tií-* → *тийет* | loan post-vocalic `е`: *proíekt → пройект* |
| word-initial `íe` | **е** | No native word begins with йе | — |
| `ío` | **ё** | Kyrgyz already spells native йо as `ё`: *коён* | loan `йо`: *raíon → раён* |
| `ía` | **я** | Native Kyrgyz has no bare `и`+`а` hiatus, so the sequence is unambiguous in any position | loan `ья`: *semía → семя* |
| `ş` | **ш** | 1:1 for native vocabulary | loan `щ`: *borş → борш* |
| legacy `sh` | **ш** | Native ш is frequent; native с+х does not occur | the name *Ishak* in digraph mode |
| post-vocalic `e` | **е** | Approximation; Kyrgyz has no native э in this position | loan `э`: *poet → поет* |
| dropped `ь`, `ъ` | *(nothing)* | Not recoverable | *aprel → апрел* |

Three of those rows decide what happens to native text; the rest decide only which loanword spelling is lost. `ts` is the most productive of the three, because `т`+`с` falls across a morpheme boundary whenever the conditional attaches to a stem ending in `т` (*кетсе*, *айтса*, *өтсө*), so sending every `ts` back to `ц` would corrupt an open class of native forms. Post-vocalic `íe` keeps verb roots intact, so that `кийет ↔ kiíet` round-trips exactly, as the root preservation of §4.4 requires. Legacy `sh` reverses to `ш` because native `с`+`х` does not occur, which costs the proper name *Исхак* in digraph mode, the case §9.2 exists to restore. What each gives up in exchange is a loanword spelling, *tsirk* returning as *тсирк* and *проект* as *пройект*, and losing those is the trade the rule was written to make.

### 9.2 The optional loan-restoration list

Losing loanword spellings is acceptable for corpus work and unacceptable for, say, converting a legal text. The reference engine therefore ships a small, explicitly documented **loan-restoration list**: the known loanwords whose Cyrillic form cannot be derived by rule (*semía → семья*, *statía → статья*, *Ishak → Исхак* in digraph mode, and similar), layered on top of the rule-based core and switchable.

The list is a lookup table, and the claim made for the architecture is narrower than "no dictionaries anywhere": the core is complete and dictionary-free on its own, and the list only ever restores loan spellings the core has already flagged as lossy. It never affects native vocabulary and never changes Cyrillic→Latin output.

The list introduces an asymmetry of its own: a bypass that restores *ishak* to *Исхак* will get the Russian loan *ишак* wrong in digraph mode. The trade is deliberate, since the proper name is the one that appears in documents, and it is the standing cost of any exception list.

### 9.3 The `e` system

The `э`/`е`/glide system is the least intuitive part of the standard, so the algorithm is stated in full:

1. **Forward.** Word-initial or post-vocalic `е` in an iotated loan → `íe`. Doubled `ээ` → `ee`. Word-initial `э` → `e`. Post-consonantal `е` → `e`. Post-vocalic `э` in a non-iotated loan → `e`.
2. **Reverse.** `ee` → `ээ`. Word-initial `e` → `э`. Post-consonantal `e` → `е`. Post-vocalic `e` → `е`. `íe` per the table in §9.1.
3. **Glide.** `í` → `й` everywhere except in the sequences resolved above. Legacy `iy`/`iyi` input (*biyik*) is accepted on reverse conversion without being canonical output.
4. **Iotation.** `ía → я`, `ío → ё`, `íu → ю`; hiatus without a glide stays plain (*diagramma → диаграмма*).

### 9.4 Normalization, folding, and collation

The computational requirements an orthography proposal usually omits, and that anyone implementing this one meets in the first afternoon:

- **Normalization.** Canonical output is **Normalization Form C (NFC)** [[16]](#ref16), the Unicode form that writes a letter and its mark as one codepoint wherever a combined one exists. `í`, `ö`, and `ü` all have such codepoints, and input that arrives split into letter plus mark should be normalized on the way in. `ŋ` has no decomposition at all, which matters for the next point.
- **Search folding.** A single `foldKey()` maps any register to one index key: `ö→o`, `ü→u`, `í→i`, `ç→c`, `ş→s`, `ŋ→n`, then casefold, which is the Unicode operation behind case-insensitive matching. For five of the six formal letters this is what standard accent-stripping already does, because `ç`, `ş`, `ö`, `ü`, and `í` split into a base letter plus a mark under Normalization Form D (NFD), the decomposed counterpart of NFC; `ä` folds to `a` the same way. `ŋ` is the exception among the formal letters and must be handled explicitly, since no amount of Unicode normalization will fold it to `n`. So is `ñ→n` (the §5.3 alternative) and `ı→i` (the §7 dotless option, which also keeps the casual register plain ASCII).
- **Two folds are configuration-dependent.** When the compose-mode letters of §11.2 are enabled, `x→h` and `w→v` unify the distinctions that reverse conversion deliberately loses, so a search for *haram* matches *xaram* and *tav* matches *taw*. When they are not enabled, `x` and `w` are ordinary Latin letters in foreign names and must fold to themselves: *Linux*, *LAX*, and *X Factor* are not Kyrgyz words with a velar fricative, and folding them to *linuh* and *lah* would be wrong in an index that holds mixed-language content. The fold follows the configuration; it is not a property of the letters.
- **The uvular letters fold unevenly.** `ğ` needs no rule of its own: it decomposes to `g` plus a breve under NFD and strips exactly as `ç` and `ş` do, so *bolğon* and *bolgon* land on one key. `q` is a base letter with nothing to strip, so it folds to itself, and *qyz* and *kyz* are two keys. An index holding text from both the canonical and the `q` configurations needs an explicit `q→k` rule to match them; whether that rule belongs in `foldKey` itself, at the cost of merging a distinction the configuration deliberately writes, is open (§13.6).
- **Register equivalence holds for the strip fallback.** With the canonical ASCII mapping, the casual register *is* the folded form, so `çaí` and `cai` land on the same key (§10). Under the transitional digraph fallback the casual form is `chai`, which folds to a different key unless the index also applies `ch→c` and `sh→s`. Any deployment that indexes digraph-style text needs that extra pair of rules; the strip fallback needs nothing.
- **Collation.** Under the untailored order of the Unicode Collation Algorithm [[6]](#ref6), `ç` sorts as a variant of `c` and `ş` as a variant of `s`, which is not the Kyrgyz alphabetical order. A locale for Jany-Latyn needs a collation tailoring, in the way Turkish tailors `ı`/`i`. The alphabet order is given in §9.5 and the tailoring in §9.6.

### 9.5 Alphabet order

This section states the alphabetical order of Jany-Latyn, the sequence a reader learns; §9.6 turns it into the sorting rules software needs. Dictionaries, indexes, name lists, and database queries all require such an order, and an orthography that leaves it unstated leaves each implementation to invent its own.

#### The ordering principle

One question decides most of the order: where a modified letter goes. Kyrgyz Cyrillic and the Latin Turkic orthographies answer it the same way, placing it immediately after the letter it modifies rather than at the end of the alphabet. Kyrgyz Cyrillic places `ң` after `н`, `ө` after `о`, and `ү` after `у`; Turkish and Azerbaijani place `ç` after `c`, `ş` after `s`, and `ö` and `ü` after `o` and `u`. Jany-Latyn follows both.

#### The canonical alphabet (28 letters)

**A B Ç D E F G H I Í J K L M N Ŋ O Ö P R S Ş T U Ü V Y Z**

Three consequences of the principle are visible in it. `Í` follows `I`, mirroring the `и`/`й` adjacency a Cyrillic-literate reader already knows. `Ŋ` follows `N`, as `ң` follows `н`. `Y` sits in its Latin position near the end rather than where `ы` falls in Cyrillic, matching international expectation for the letter's shape.

The Common Turkic Alphabet follows the same principle. Its 34-letter order places `Ğ` after `G`, `X` after `H`, `Ñ` after `N`, `Ö` after `O`, `Ū` and `Ü` after `U`, `Ə` after `E`, and `Q` immediately after `K` [[17]](#ref17), each letter beside the one it pairs with rather than at the end or in inherited Latin sequence. The `q` rows below place `Q` after `K` for the same reason.

What the two orders do not share is their length, and the six fewer letters are a set of decisions rather than a shortfall. Three of the CTA's letters have no work to do in Kyrgyz: `Ə` is a vowel outside the inventory (§11.2), `Ū` is the Kazakh `ұ` (§4.1), and `X` is redundant where `х` is written `h` (§8.1). Three more are available and declined with an argument each, `C` in §8.2 and `Q` and `Ğ` in §6. Two of the remaining differences are substitutions rather than absences: `Ŋ` stands where the CTA has `Ñ` (§5.3), and writing `ы` as `y` removes any need for the dotted capital `İ` (§7). `Í` is the one letter Jany-Latyn has that the CTA does not.

The CTA's placement of `X` next to `H` is a small precedent for the question §11.2 leaves open: where a velar fricative written `x` would belong if Kyrgyz adopted it.

`C`, `Q`, `W`, and `X` are not members. The canonical orthography never emits them: `ч` is `ç`, `ц` is `ts`, and the rest belong to other configurations or to foreign spellings. They still need collation treatment, which is a separate matter; see below.

#### The alphabets side by side

| Configuration | Letters | Alphabet |
| :--- | :---: | :--- |
| Canonical | 28 | A B Ç D E F G H I Í J K L M N Ŋ O Ö P R S Ş T U Ü V Y Z |
| `q` alone (asymmetric; §6) | 29 | A B Ç D E F G H I Í J K Q L M N Ŋ O Ö P R S Ş T U Ü V Y Z |
| `q` and `ğ` (§6) | 30 | A B Ç D E F G Ğ H I Í J K Q L M N Ŋ O Ö P R S Ş T U Ü V Y Z |
| Dotless `ı` with `q`, `ğ` | 30 | A B Ç D E F G Ğ H I İ J K Q L M N Ŋ O Ö P R S Ş T U Ü V Y Z |
| CTA-aligned subset for Kyrgyz | 31 | A B C Ç D E F G Ğ H I İ J K Q L M N Ñ O Ö P R S Ş T U Ü V Y Z |
| Common Turkic Alphabet, for reference | 34 | A B C Ç D E Ə F G Ğ H X I İ J K Q L M N Ñ O Ö P R S Ş T U Ū Ü V Y Z |



In the fourth row, writing `ы` as `ı` frees `y`, and the glide takes it: the argument for `í` in §4.4 is that `y` is otherwise spent, and here it is not. `Y` returns to its ordinary Latin place at the end. Keeping `í` as well is possible and the testbed offers it, at the cost of an alphabet carrying `I`, `İ`, and `Í` as three letters told apart only by the marks above them.

The last row is the Baku alphabet itself [[17]](#ref17), so the others can be read against it. The row above it is what a Kyrgyz adaptation would use: the same alphabet without `Ə`, `Ū`, and `X`, for the reasons given above. Neither has `W`.

#### The same words in each

Native vocabulary only, so that nothing here depends on how a converter treats loanwords. Whether `q` is written is a lexicon question, not an alphabet question; see §6.

| Cyrillic | Canonical | `q` and `ğ` | Dotless `ı` | CTA-aligned |
| :--- | :--- | :--- | :--- | :--- |
| кыргыз | kyrgyz | qyrğyz | qırğız | qırğız |
| жазуу | jazuu | jazuu | jazuu | cazuu |
| айылдар | aíyldar | aíyldar | ayıldar | ayıldar |
| бийик | biíik | biíik | biyik | biyik |
| Жаңы | Jaŋy | Jaŋy | Jaŋı | Cañı |

And in running text:

> **Cyrillic.** Адамдардын бир-бири менен алмашкан каттары, эл аралык иммуногистохимия же башка техникалык журналдарда чыккан изилдөө макалалар, элге белгилүү болгон ырлар жана чыгармалар — баары бир алфавитте жазылат.
>
> **Canonical.** Adamdardyn bir-biri menen almaşkan kattary, el aralyk immunogistohimiía je başka tehnikalyk jurnaldarda çykkan izildöö makalalar, elge belgilüü bolgon yrlar jana çygarmalar — baary bir alfavitte jazylat.
>
> **`q` and `ğ`.** Adamdardyn bir-biri menen almaşqan qattary, el aralyq immunogistohimiía je başqa tehnikalyq jurnaldarda çyqqan izildöö maqalalar, elge belgilüü bolğon yrlar jana çyğarmalar — baary bir alfavitte jazylat.
>
> **Dotless `ı`.** Adamdardın bir-biri menen almaşqan qattarı, el aralıq immunogistohimiya je başqa tehnikalıq jurnaldarda çıqqan izildöö maqalalar, elge belgilüü bolğon ırlar jana çığarmalar — baarı bir alfavitte jazılat.
>
> **CTA-aligned.** Adamdardın bir-biri menen almaşqan qattarı, el aralıq immunogistohimiya ce başqa tehnikalıq jurnaldarda çıqqan izildöö maqalalar, elge belgilüü bolğon ırlar cana çığarmalar — baarı bir alfavitte cazılat.

The CTA row is written as a person with a lexicon would write it: native `ж` as `c` (*ce*, *cana*, *cazylat*), loanword `ж` as `j` (*jurnaldarda*), and native back-harmonic `г` as `ğ` (*bolğon*, *çığarmalar*) while the loan keeps plain `g`. One thing stands between that row and the testbed's output, and it is the lexicon. Every other feature of the row is reproducible: the testbed has `c`, `q`, `ğ`, `ñ`, `ı`, and the `y` glide, and it renders *cana*, *qırğız*, *bolğon*, and *çığarmalar* exactly as shown. *Jurnaldarda* it cannot produce in a `c`-mode text, because `c` mode writes every `ж` as `c` and gives *curnaldarda*, while `j` mode gives *je* for the native word. Only knowing which words are Russian loans closes that gap (§6, §8.2).

The passage is built to make the configurations differ visibly rather than to read elegantly. Three things in it repay following across the rows.

- Native *же* becomes *ce* in the CTA row while the Russian loan *журнал* stays *jurnaldarda*, because in the CTA `c` is the affricate [dʒ] and `j` the fricative [ʒ]. Kyrgyz Cyrillic writes one `ж` for both, so no rule separates them: the split needs a loanword lexicon. In the other three rows a single `j` covers both sounds and the mapping stays derivable (§8.2).
- *Техникалык* is the clearest case of `k` against `q` inside a single word. In the `q` rows it is *tehnikalyq*: the `k` of the loan stem stays velar while the `k` of the native suffix `-лык` becomes uvular. A local rule that reads the nearest vowel happens to get this word right, and the reference engine does. What no rule can supply is the reason (that *tehnika* is a loan), which is why the same heuristic also produces *qosmos* and *parq*. The same is true of `g` in every row that writes `ğ`, where *immunogistohimiía* keeps plain `g` beside native *bolğon* and *çyğarmalar*: the back-vowel rule happens to leave the loan alone, but nothing tells it why it should. A writer knows; a converter does not (§6).
- *Immunogistohimiía* shows what the systems do with the vocabulary the language keeps acquiring: `h` for `х`, `ía` for the final `я`, doubled consonants intact, and a word long enough that legibility and sorting both have to hold across it.

### 9.6 Collation

Alphabetical order has to be handed to software as a *tailoring*: a short list of adjustments to the default Unicode sort order [[6]](#ref6), which knows nothing about Kyrgyz and files `ç` as a variant of `c`. This section gives that list, starting with what it changes for a reader who will never look at the syntax.

#### What the tailoring changes

| Canonical order | Dotless `ı` order | What moved |
| :--- | :--- | :--- |
| bas, baş, bat | bas, baş, bat | unchanged: `ş` after `s` in both |
| kene, keŋ, kep | kene, keŋ, kep | unchanged: `ŋ` after `n` in both |
| kol, konok, köl, köp | kol, konok, köl, köp | unchanged: `ö` after `o` in both |
| kul, kum, kül, küü | kul, kum, kül, küü | unchanged: `ü` after `u` in both |
| kir, kyz | kız, kir | reversed: `ı` sorts *before* `i`, Turkish-style, so every word with the high unrounded vowel moves ahead of its dotted-`i` neighbors |

Two of those rows hold a result that readers often find counterintuitive. Because `ö` and `ü` count as letters in their own right and not as accented forms of `o` and `u`, *every* word with the base vowel in that position sorts before *every* word with the modified one: *köl* follows *konok* rather than sitting beside *kol*. That is what the Cyrillic order already does with `о`/`ө` and `у`/`ү`, so a Kyrgyz reader finds it familiar and a search implementer often does not, which is another reason collation and folding (§9.4) must be kept apart.

The last row is the practical cost of the dotless configuration for anyone maintaining a dictionary or an index: it is not one letter's position but a reshuffle of every entry containing the language's most frequent vowel.

#### The tailoring

The rules are given in the rule syntax of International Components for Unicode (ICU), which the Common Locale Data Repository (CLDR), PostgreSQL's ICU collations, Java, and PyICU all accept. `&` names the letter being anchored to, `<` marks a primary difference (a distinct letter of the alphabet), and `<<<` marks a tertiary one (the same letter differing only in case). Read the first line below as: *place `ç` immediately after `c` as a letter in its own right, and treat `Ç` as that same letter in upper case.* Every other line works the same way.

```
# Canonical
&c < ç <<< Ç
&i < í <<< Í
&n < ŋ <<< Ŋ
&o < ö <<< Ö
&s < ş <<< Ş
&u < ü <<< Ü

# Added in the q configurations
&g < ğ <<< Ğ
&k < q <<< Q

# Added with the ñ option, which the CTA configuration uses
&ŋ < ñ <<< Ñ

# Added with the breve or tilde glide options
&í < ĭ <<< Ĭ < ĩ <<< Ĩ

# Added when the extended letters of §11.2 are enabled
&a < ä <<< Ä

# Replaces the &i rule in the dotless-ı configuration; the trailing í applies
# only where that configuration keeps the acute glide, since with the y glide
# there is no í to place and Y keeps its default Latin position
&h < ı <<< I < i <<< İ < í <<< Í
```

Anchoring `ç` to `c` instead of placing it after `b` is deliberate. `C` is not a letter of the canonical alphabet, but it occurs constantly in foreign names, so anchoring `ç` to it keeps the two sorting adjacently instead of scattering unfamiliar spellings through the list. A letter that substitutes for another (`ñ` for `ŋ`, `ĭ` or `ĩ` for `í`) takes the position of the letter it replaces, sorting immediately after it. Because no configuration uses both letters of such a pair, a list sorts identically whichever one is selected. Letters outside the alphabet that are not anchored (`w`, `x`, and `q` or `c` where the configuration excludes them) keep their default Latin positions. **Alphabet membership and collation coverage are different questions:** a teaching alphabet may omit a letter that a sort must still place.

Sorting is defined on the formal register. Casual-register text is plain ASCII and sorts as such, so `ş` and `s` interleave there, one more reason the two registers are specified together rather than one being derived informally from the other (§10). Collation is also a different mechanism from the search folding of §9.4, which deliberately merges what collation deliberately separates; a system needs both, and they answer different questions.

#### Implementation note

`Intl.Collator` accepts no custom tailorings, so a JavaScript implementation cannot consume the rules above directly. The reference engine ships a `compare(a, b)` built from an explicit rank table per configuration, pinned against a checked-in expected ordering; the ICU rules are published for every other platform.

---

## 10. Two Registers

Jany-Latyn defines two registers together rather than one script with a workaround attached.

**The formal register** — `ö`, `ü`, `í`, `ŋ`, `ç`, `ş` — is the complete form: print, dictionaries, official text, canonical testbed output, and anywhere the orthography is presented as itself.

**The casual register** is plain ASCII, for unmodified keyboards:

`ö → o`, `ü → u`, `í → i`, `ŋ → n`, `ç → c`, `ş → s`

Every letter loses its diacritic and nothing else. *Çaí* becomes `cai`, *şaar* becomes `saar`, *jaŋy* becomes `jany`, *biíik* becomes `biiik`.

The case for mapping `ç → ch` and `ş → sh` instead is real: the digraphs signal the sound better to a reader, and they are what people type today (*chai*, *jakshy*). Two considerations outweigh it here. First, coherence: if every other letter loses a mark, the sibilants should too, and the casual form then teaches the shape of the formal one instead of competing with it: the reader who types `cai` is one diacritic away from `çaí`, while the reader who types `chai` is spelling a different word shape. Second, folding: standard accent-stripping already maps `ç→c` and `ş→s`, so with this mapping the casual register *is* the folded form and `foldKey()` is nearly free (§9.4). With digraphs, the two registers fold to different keys and every index needs custom handling.

The digraph fallback is a one-way station, not a second house style. It exists because *chai* and *jakshy* are what people type today, and because the project's own early drafts used `ch`/`sh` as the reference standard. The direction of travel is toward the strip mapping, where a reader who has internalized `ç` writes *çöírö* casually as *coiro* and reads it as the same word rather than a different spelling of it. That is where the coherence argument above points.

The cost is a merger. Stripping `ş` to `s` merges it with native `s`: *баш* and *бас* both become `bas`, *аш* and *ас* both become `as`. Digraph fallback avoids that merger but reintroduces the `sh` ≈ с+х collision and lengthens the word. This is a genuine trade, so the testbed implements **both** fallbacks and lets a reader compare them over real text. The right way to settle it is to count how many distinct words each mapping merges across a corpus (§13.3).

The casual register already has mergers anyway, and always did: `кол` (hand) and `көл` (lake) both surface as `kol`; `жаңы` (new) and `жаны` (his soul) both as `jany`. This matches how Kyrgyz speakers already text, and it resolves the way informal writing always resolves ambiguity: from context, in real time.

Two properties of the casual register limit what can be built on it:

- **The casual register is one-way.** `biiik` cannot be mechanically restored to `biíik`, and `cai` cannot be restored to `çaí` or to `чай`. ASCII text is a destination, not an intermediate form. Conversion tools should accept it as input on a best-effort basis and should not claim round-tripping.
- **It is a departure from current habit, not a description of it.** `ö→o`, `ü→u`, `í→i`, and `ŋ→n` match what people type now. `ç→c` and `ş→s` do not; *chai* and *jakshy* are the live forms. This mapping is an attempt to pull habit toward the formal standard, which is a normative choice and should not be presented as a descriptive one.

---

## 11. The Testbed and Its Governance

### 11.1 The web testbed

A client-side application offers one-click presets, the canonical baseline against a CTA-aligned configuration (`ı` for `ы`, `y` for the glide, `c` for `ж`, `q` and `ğ`, and `ñ` for `ң`), alongside selectable options for each variable argued above:

| Variable | Options | Argued in |
| :--- | :--- | :---: |
| Front rounded vowels | `ö/ü` (canonical), `ө/ü`, `ө/ұ`, `ө/ū` | §4.1, §4.2 |
| Sibilants | `ç/ş` (canonical), `ch/sh` | §5.2 |
| Affricate `ж` | `j` (canonical), `c` — the CTA value, which is mechanical for loanwords | §5.1, §8.2 |
| Loan signs `ъ`/`ь` | absorbed into the glide (canonical), apostrophe | §5.4 |
| Velar nasal | `ŋ` (canonical), `ñ` | §5.3 |
| Glide | `í` (canonical); `ĭ` and `ĩ` as marked alternatives; plain `i`, which renders the rejected barcode mapping for comparison; `y`, offered only while `ы` is written `ı` | §4.4, §7 |
| Back unrounded vowel | `y` (canonical), `ı` — the testbed force-enables `q`, and `ğ` behind it, when `ı` is selected; the engine keeps the options independent | §7 |
| Uvular stop | unified `k` (canonical), allophonic `q` — selecting `q` also enables `ğ` | §6 |
| Uvular fricative | unified `g` (canonical), allophonic `ğ` — settable on its own, so `q` without `ğ` stays reachable | §6 |
| ASCII fallback | strip to `c/s` (canonical), expand to `ch/sh` | §10 |
| Extended letters | off (canonical); `ä`, `x`/`h`, `w` each independently selectable — compose-mode, never emitted by forward conversion | §11.2 |

A side-by-side inspector runs any combination against real text.

Three couplings in that table belong to the testbed rather than to the mapping. Selecting `ı` switches the uvular options to `q` and `ğ`, for the reasons given in §7 and §6, and switching back to `y` restores `k` and `g`, returning the glide to `í` if it was `y` and leaving it alone otherwise. Selecting `q` on its own carries `ğ` with it by the argument of §6, and reverting to `k` takes it back off. Each coupling only seeds the option, so `ı` with `k`, and `q` without `ğ`, both remain reachable by setting the option afterwards. The `y` glide is offered only while `ы` is written `ı`, since under `y` the two would collide (§4.4). A fourth pairing is warned about rather than prevented: selecting the `ĩ` glide while the velar nasal is `ñ` puts the same tilde on two letters for two unrelated jobs, so the testbed says so and lets the reader judge the result. The engine itself imposes none of these rules: every combination of options is a valid call.

The toggles are not a menu of equally valid house styles. Each one exists so that the counterexample can be generated rather than described: `q` turns *kosmos* into *qosmos*, `ı` shows what uppercasing does to the result, and Cyrillic `ө` can be switched on and the output sorted as a name list.

### 11.2 Extended letters under evaluation

Three sound distinctions exist in Kyrgyz speech that Kyrgyz Cyrillic does not write. Latin has letters for all three, the letters are cheap to type, and the question of whether any of them deserves permanent status is open. The testbed offers them as an evaluation set, off by default.

| Pair | Distinction | Where it lives |
| :--- | :--- | :--- |
| `a` / `ä` | back /ɑ/ against front /æ/ | Southern speech (*äkä*, *källä*); also in standard Kyrgyz through Persian loans and regressive assimilation |
| `h` / `x` | glottal [h] against velar [x] | loanwords: velar in *Xaram* (southern *Xäräm*), glottal in *Buhara* |
| `v` / `w` | labiodental [v] against [w] | loanwords, and the intervocalic realization of /b/ |

None of the three is derivable from Cyrillic. Kyrgyz Cyrillic writes one `а`, one `х`, and one `в`, so `cyrToJany` cannot produce `ä`, `x`, or `w` from source text without knowing which words are loans. They are therefore **compose-mode letters**: available when a person writes Latin directly, never emitted by automatic conversion. `janyToCyr` accepts them as input and folds each back to the base letter (`ä → а`, `x → х`, `w → в`), which is the §9.1 native-priority rule applied to a new case: the distinction survives in Latin and is lost on the way back, exactly as loan `ц` and `щ` are. Search folding unifies them the same way, so the lost distinction does not fragment an index (§9.4). The reference engine keeps the set in one place (`EXTENDED_LETTERS` in `packages/engine/src/alphabet.ts`); adding or removing a compose-mode letter is a one-line change there.

`ä` is the one that does phonological work. The other two refine the spelling of loanwords. `ä` marks harmony class, and harmony class is what the `q` rule reads (§6): *äka*, *ükä*, and *källä* are front-harmonic and take velar [k], while *aqa* and *qalla* are back-harmonic and take uvular [q]. Without `ä` the rule cannot tell these apart; with it, the rule has the information it needs. The experiment follows directly: run southern text through `q` mode with and without `ä`, and measure whether the second configuration is more accurate.

`x` carries a cost the other two do not. In Latin text of any kind, `x` already has a ubiquitous international value (*Linux*, *LAX*, *X Factor*, *taxi*), and a Kyrgyz reader meets those strings constantly. Adopting `x` for the velar fricative gives one letter two readings that no rule separates, and it drags search folding with it (§9.4). The argument for the split rests on the fact that *Xaram* and *Buhara* genuinely differ in Kyrgyz speech; the argument against is that keeping `x` faithful to its international value may be worth more than marking a distinction Cyrillic has done without for eighty-six years. The evaluation set exists to settle questions of exactly this shape.

`w` is the weakest case of the three, because intervocalic [w] is largely the predictable realization of /b/ rather than a contrast, and Principle 3 says predictable allophones do not get letters, the same reasoning that unified `k` in §6. If `w` earns a place, loanwords will be what earns it.

The limiting principle for anything added to this set: the sound must distinguish words for its speakers, Cyrillic must be unable to represent it, and it must not be predictable from context. `ä` passes all three; `x` passes the first two, since *Xaram* and *Buhara* differ in a way no rule predicts; `w` is arguable on the third.

### 11.3 Engine, layouts, and CLI

The conversion engine is pure TypeScript with no runtime dependencies, and runs unmodified on Node.js, in browsers, and on edge workers. Keyboard layouts for macOS and Linux put `ö`, `ü`, `í`, `ŋ`, `ç`, and `ş` on single modified keystrokes, and a command-line tool converts files and streams for corpus work. The option couplings of §11.1 belong to the testbed and not to the mapping, so they live in one shared module that the interface and its tests both read.

| Component | Where it lives |
| :--- | :--- |
| Conversion engine | `packages/engine/src/convert.ts` |
| Testbed option couplings | `packages/engine/src/testbedPresets.ts` |
| Alphabet order and comparison | `packages/engine/src/collate.ts` |
| macOS keyboard layout | `packages/engine/keymaps/jany-latyn.keylayout` |
| Linux XKB layout | `packages/engine/keymaps/jany.xkb` |
| Command-line converter | `node packages/engine/dist/src/cli.js` |

### 11.4 Governance

This is version 1 of the orthography, published as a proposal rather than a standard, and the project is structured so that disagreement produces changes rather than forks-by-frustration:

- Every contested choice is a toggle in the testbed, with every alternative implemented in code.
- The hosted testbed records which configuration a reader selects as an analytics event, so the distribution of preferences across real use is visible to the project and can be published alongside the arguments. A self-hosted or classroom deployment records nothing and reports nothing; the instrumentation belongs to the hosted instance, not to the software.
- All of the source is public, under three grants: the conversion engine is MIT and may be used for any purpose; the testbed application is source-available under a noncommercial license, so it can be read, modified, and deployed in a classroom but not sold; this document and the specification are CC BY. Issues, edge cases, and corpus counterexamples are accepted on GitHub, and anyone may review the mapping rules in the specification, propose changes, or fork.
- Versions are numbered and changes are logged. A machine-readable version marker traveling with converted text, so that a document can declare which engine version produced it and be reconverted safely, is a natural next step but is not yet implemented; it is listed in §13.6.

The intended failure mode is falsification, not adoption pressure. A reproducible case where the engine corrupts native Kyrgyz is worth more to this project than agreement.

---

## 12. Sociolinguistic and Political Context

### 12.1 The politics of leaving Cyrillic, and of what replaces it

The century of Kyrgyz alphabet and orthography changes, from Arabic to Latin in 1928 and from Latin to Cyrillic in 1940, is discussed in this document where the letter designations are argued: the unified `К` in §6, Tynystanov's Latin alphabet in §8.2 and §8.3.

The question of the next change, if and when it happens, is political in origin, not academic. Musaev's summary is that alphabets and orthographies are adopted by resolution of the Jogorku Kenesh and require a presidential decree, and that scholars may only propose [[3]](#ref3). In April 2023, after the chairman of the National Commission on the State Language told parliament that scholars and the public were ready to move to Latin if the political decision were made, the president publicly reprimanded him and stated that the discussion was premature and that development of the state language should continue in Cyrillic [[3]](#ref3). Days later, Russia suspended dairy imports from Kyrgyzstan [[18]](#ref18). Even if it seems common-sense and inevitable for the Kyrgyz, a move away from Cyrillic is read as a move away from Moscow, and the answer arrives as trade policy.

At the same time, adopting the Common Turkic Alphabet wholesale means aligning with the largest written standard in the family. It carries with it a cost to be paid by the smaller language in places where no decision is ever recorded. The Russian dimension of the question is argued in public constantly; this one is not, and the rest of this section sets it out.

Short strings are where a small language is exposed. Titles, names, hashtags, metadata, and queries carry almost no signal, so whatever resolves them falls back on prior probability, and prior probability follows corpus size: Kyrgyz has an order of magnitude fewer speakers than Turkish and a web corpus smaller still. Jany-Latyn writes *кылым* (century) as `kylym`, a string that belongs to no other language; a CTA-aligned configuration writes it `qılım`, which is also Azerbaijani, and searching that form returned an Azerbaijani verb to the author in September 2026 where the Cyrillic spelling returns the Kyrgyz word. A song title containing *жаным* should behave the same way: `janym` is Kyrgyz, while `canım` is Turkish.

For larger bodies of work or official documents, a Kyrgyz paragraph stays identifiable whatever the alphabet, because vocabulary and morphology diverge from Turkish further than spelling does. The effect argued here concentrates in short strings and in automated labeling, which is what §13.2 measures.

The harm may compound in further layers of text processing. Training corpora are built by running language identification over a crawl and bucketing the results, and Cyrillic is separable at a glance because the script is itself the label. Latin Kyrgyz shaped like Turkish is filed as Turkish: subtracted from a corpus that is already thin, added as noise to one that is not. A language that is hard to find is inconvenient; a language mislabeled at the point of collection stops accumulating. §13.1 asks the same question one stage later in the pipeline.

That raises the question of which Latin orthography, if any, should replace Cyrillic, since any move to Latin gives up a signal that Cyrillic supplies for free. No Turkic Latin orthography in current use writes `ŋ`, and none writes `í`, so `jaŋy` and `kylym` carry their own language tag where `cañı` and `qılım` do not, a property that falls out of §4.4, §5.3, and §7 instead of being designed for.

Kyrgyz needs no elaboration to be distinct from Turkish: the two sit in different branches of the family and are not mutually intelligible (Kloss's Abstand [[19]](#ref19)). Spelling alone will not close that distance. But a contrast the orthography declines to record loses one of the things that holds it in place, and over time that can reach speech — the argument of §7 against dotless ı, and of §10 about the casual register.

Algorithmically, spellcheckers and query normalization trained on the larger language would correct the smaller one into it, with a model asked for Kyrgyz filling its gaps with Turkish where the orthography invites it, and writers themselves normalizing word forms that look like errors against a language they read daily. The drift this predicts is in lexicon and written norm, and potentially, in speech by the route above, which is the same argument Galician makes as a choice about whether to spell closer to Portuguese.


For the CTA's advocates, convergence is the point: mutual legibility across Turkic writing is the benefit, and what this section describes is its cost. Nothing above shows them to be wrong. It shows that the cost is real, that it falls mainly on the smaller language, and that it is paid where nobody is watching. Whether that is worth it is for Kyrgyz speakers to decide. The case made in this section supports `í` (§4.4), `ŋ` (§5.3), and `y` (§7), letters chosen on unrelated grounds, which is why it is offered as a prediction with tests attached rather than as a finding.

### 12.2 What Jany-Latyn is and is not asking for

Jany-Latyn does not advocate a state transition. It is a tool for exploring the question and for making the informal writing that already exists more consistent. If the state question is settled in fifty or a hundred years, or never, the project still has a use: millions of Kyrgyz speakers are typing Latin today with no convention, and a documented convention is worth having independent of any decree.

That framing is not a rhetorical hedge. It changes the design. A proposal seeking legislation can assume a curriculum, enforcement, and an institution to maintain a loanword list, so it can afford the lexicon dependency and with it `q` (§6). A proposal that has to work the moment someone opens a repository cannot, and has to be derivable, dictionary-free, and typable on hardware that already exists.

### 12.3 Costs and constraints

- **Cost and capacity.** The recurring domestic objection to Latinization is that it is expensive and that education has more urgent needs. The objection is serious and is not addressed by better letter design.
- **A multilingual state.** Kyrgyzstan is not monolingual. Russian has official status, and Uzbek, Dungan, and other communities write in Cyrillic. A Kyrgyz Latin transition would not move those languages, so Cyrillic would remain in daily use whatever happened to Kyrgyz. Any realistic plan is a plan for coexistence, not replacement, which is also an argument for a converter that runs in both directions.
- **Geopolitics.** Both pulls described in §12.1 are costs to a state-level transition, and a reason a non-state, tool-first project can do useful work that a policy campaign cannot.
- **Adoption is not decreed.** Kyrgyzstan's own 2004 orthography reform was reversed when the public did not accept it [[3]](#ref3), and Uzbekistan's transition has run since 1993 without completing [[3]](#ref3). Whatever is adopted has to be adoptable by people who did not ask for it.
- **Generational asymmetry.** Readers educated in Cyrillic and readers who grew up typing Latin on phones want different things from an orthography. The two-register design (§10) is a partial answer: the formal register serves print and the classroom, the casual register serves the phone, and both fold to the same key.

---

## 13. Open Questions and Future Work

Some of these are experiments the testbed is built to support; the rest is specification work not yet done. Each experiment states the claim, the test that would settle it, and the result that would count against it.

### 13.1 Tokenization

**Claim:** monolithic Latin encoding tokenizes more efficiently than mixed-script text, and comparably to or better than Cyrillic.

**Test:** take a fixed corpus (Kyrgyz Wikipedia, or FLORES-200 `kir_Cyrl` for a clean parallel set), render it in Cyrillic, Jany-Latyn in its canonical configuration, a CTA-aligned configuration, and a mixed-script configuration, and measure tokens per word under several tokenizers.

**What would refute it:** Latin Kyrgyz tokenizing *worse* than Cyrillic in widely used models. This is a plausible outcome, since Cyrillic Kyrgyz is far better represented in training data than any Latin Kyrgyz, and it would need to be reported if found.

### 13.2 Language identification and retrieval

**Claim:** orthographic divergence from Turkish, Azerbaijani, and Uzbek keeps Kyrgyz identifiable to machines, and the effect grows as the text gets shorter (§12.1).

**Tests:** three, in increasing order of cost.

1. *Collision census.* Count the Kyrgyz word types whose surface form is identical to a Turkish or Azerbaijani word type, under the canonical and CTA-aligned configurations. This needs two word lists and no network, and it measures the mechanism directly.
2. *Identification against string length.* Run an off-the-shelf identifier such as fastText's `lid.176` or GlotLID over the same Kyrgyz text in both configurations at 1, 3, 5, 20, and 100 tokens, and plot accuracy against length. The prediction is that the configurations agree on paragraphs and separate as strings shorten, which is a more informative result than one misclassification rate.
3. *Generative intrusion.* Prompt a model for Kyrgyz prose in each configuration and count Turkish lexical items per thousand words.

**What would refute it:** a negligible collision rate, or identification holding up at three tokens in both configurations. Either outcome would settle the question against §12.1, and would need to be reported if found.

### 13.3 Register mergers

**Claim:** the words the strip fallback merges (`baş` with `bas`, `çaí` with `cai`) are few enough in real text that its coherence and folding advantages outweigh them (§10).

**Test:** count the distinct word types merged by each ASCII fallback (`c/s` versus `ch/sh`) over a corpus, and report both numbers alongside the round-trip loss rate by word class.

**What would refute it:** the strip mapping collapsing a materially larger share of word types, or collapsing frequent pairs that context does not separate.

### 13.4 Rendering

**Claim:** inline Cyrillic `ө` is visually inconsistent with surrounding Latin text, independent of whether the font covers Cyrillic (§4.2).

**Test:** render `kөl` and `köl` across a matrix of common UI, web, and serif fonts, and record for the mid-word glyph the x-height ratio against the adjacent Latin lowercase, the stroke weight, and any baseline offset. Report which fonts substitute and which merely mismatch.

**What would refute it:** metrics within a few percent of the Latin lowercase across the widely used stacks, with substitution confined to fonts that genuinely lack Cyrillic.

### 13.5 Input

**Claim:** the formal register can be typed at ordinary speed, with the custom keymap on a desktop layout and with long-presses on an unmodified phone keyboard.

**Test:** keystrokes and time per 1,000 characters on a standard layout with and without the custom keymap, and on unmodified iOS and Android keyboards, which is also where the `ŋ` availability of §5.3 gets checked beyond the one locale it is confirmed in.

**What would refute it:** a sustained speed penalty against digraph spellings, or letters that cannot be reached at all on a common phone keyboard, which would move `ñ` from an alternative to the better default (§5.3).

### 13.6 Specification work not yet done

- A BCP 47 language tag convention (`ky-Latn`, possibly with a registered variant subtag) so text can declare which system it uses.
- A CLDR transliteration rule set, which would make the mapping available to any CLDR-based platform.
- A stress-notation convention for teaching materials and dictionaries, which must not be the acute, since the acute is the glide (§4.4).
- Orthographic rules beyond the letter level: hyphenation, abbreviations, the treatment of Russian personal names and surnames, and a policy for whether loanwords are spelled from their Russian source or from Kyrgyz pronunciation.
- Capitalization beyond the core rule. Multi-character graphemes (`ía`, `ío`, `íu`, `ts`, and the digraph fallbacks) take the case pattern of the source word, so sentence case gives `Ía` and all-caps gives `ÍA`; that much is settled. What remains is narrower and largely stylistic: acronyms and initialisms carrying suffixes (*ЖОЖдо*), hyphenated compounds, and camel-case identifiers.
- Whether `foldKey` should fold `q` to `k` (§9.4). `ğ` folds to `g` for free under NFD, so the voiced letter costs an index nothing while the voiceless one splits it. Folding would let one index serve text written in both configurations; not folding keeps a distinction the `q` configuration writes on purpose.
- A machine-readable version marker for converted text (§11.4), so a document can declare which engine version produced it.
- Promoting the documentation-conformance check from a curated example set to a full extractor. The current checker gates a hand-maintained list of pairs and also extracts every `cyrillic → latin` pair it finds in the prose, failing the build on any it cannot classify. What curation still decides is the configuration a pair runs in; an extractor that infers direction and configuration from context would close that gap.
- Handwriting and pedagogy: nothing here has been tested with learners, and cedillas and acutes behave differently in handwriting than in type.

---

## 14. Conclusion

Every choice in this document answers to one constraint ahead of the others: a canonical form has to be computable from the Cyrillic that already exists, or the orthography begins by discarding the corpus it is meant to carry. Within that constraint, an orthography succeeds when it balances phonological fidelity, typographic clarity, and typing ergonomics. Today it must also survive contact with search engines, tokenizers, and unmodified keyboards. Those are the standards on which this work should be judged: whether the cedillas and the acute sit inside a line of running Kyrgyz without disturbing it, whether `ŋ` stays distinct from `n` at reading size, whether a native speaker meets any ambiguity, and whether the same text survives a round trip, an index, and a phone keyboard. Those questions are better settled on a page of real prose than on a curated example, which is what the testbed is for.

A century after Tynystanov's Latin alphabet, the same historical thread runs through Musaev's draft, and that draft waits on a political decision that may not come soon [[3]](#ref3). This project does not need that decision to arrive. It is built to be useful the moment someone opens the repository, on the terms Kyrgyz speakers have already been writing Latin for years: informally, inconsistently, and constantly.

Linguists, engineers, and policymakers are invited to test these choices rather than take them on trust: open the testbed, read the mapping rules in `docs/SPEC.md`, and file an issue with any case the engine gets wrong.

*Zamanbap, erkin jana tabigyí jazuu egemen elibizge sanariptik doorunda kyzmat kylsyn.*
*(May a modern, open, and natural orthography serve our independent people in the digital era.)*

---

## 15. References

<a id="ref1"></a>[1] "Adoption of Latin-Based Common Turkic Alphabet." *The Times of Central Asia*, 12 September 2024. https://timesca.com/adoption-of-latin-based-common-turkic-alphabet/

<a id="ref2"></a>[2] "Turkic States Agree On Common Latin Alphabet, But Kyrgyzstan Happy With Its Cyrillic Script." RFE/RL, 3 October 2024. https://www.rferl.org/a/common-turkic-alphabet-kyrgyz-kazakh-uzbek-turkmen-latin-cyrillic/33137392.html

<a id="ref3"></a>[3] Жангазиев, Максат. "Нужен ли тюркоязычным странам общий алфавит?" Азаттык Азия (RFE/RL), 25 September 2024. https://www.azattyqasia.org/a/33134603.html — includes a reproduction of Musaev's proposed alphabet chart. Kyrgyz original: https://www.azattyk.org/a/33125096.html

<a id="ref4"></a>[4] "Kyrgyz alphabets." Wikipedia. https://en.wikipedia.org/wiki/Kyrgyz_alphabets — for the 1928–1938/1940 Latin alphabet correspondence table and the vowel length inventory. Primary source cited there: Сумарокова, О.Л. (2021), *Кыргызский алфавит: долгий путь к кириллице*, KRSU.

<a id="ref5"></a>[5] "New version of Latin-based Kazakh alphabet presented at government." Kazinform, 2021. https://www.inform.kz/en/new-version-of-latin-based-kazakh-alphabet-presented-at-government_a3746549

<a id="ref6"></a>[6] Unicode Technical Standard #10: Unicode Collation Algorithm. https://www.unicode.org/reports/tr10/

<a id="ref7"></a>[7] Kudo, T. & Richardson, J. (2018). "SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing." EMNLP 2018 (system demonstrations).

<a id="ref8"></a>[8] "Romanization of Kyrgyz." Wikipedia. https://en.wikipedia.org/wiki/Romanization_of_Kyrgyz — comparative table of ALA-LC, BGN/PCGN, ISO 9, and Common Turkic systems, and government adoption of BGN/PCGN for geographic names. Primary sources cited there: BGN romanization of Kyrgyz (US Board on Geographic Names, 2017); UNGEGN report, 2016; ISO 9:1995.

<a id="ref9"></a>[9] "What will be the Kyrgyz Latin alphabet." qyrgyz.com. https://qyrgyz.com/post/path-of-kyrgyz-latin-script — for the January-to-April 2021 Kazakh change from Ŋ to Ñ and the 2021 Uzbek draft.

<a id="ref10"></a>[10] Unicode Standard Annex #29: Unicode Text Segmentation. https://www.unicode.org/reports/tr29/

<a id="ref11"></a>[11] Unicode Character Database, `SpecialCasing.txt` (Turkic `i`/`ı` case mappings). https://www.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt

<a id="ref12"></a>[12] "Кыргызская латиница / Кыргыз тилинин латын алфавити." qyrgyz.com. https://www.qyrgyz.com/kyrgyzskaya-latinitsa

<a id="ref13"></a>[13] "Kazakhstan Changes Its Alphabet. Again!" Eurasianet, 20 February 2018. https://eurasianet.org/kazakhstan-changes-its-alphabet-again

<a id="ref14"></a>[14] Bazarbayeva, Z.M. & Chukayeva, T.K. (2021). "The new Kazakh latinized script." *Bulletin of L.N. Gumilyov Eurasian National University, Philology Series* 3(136). https://bulphil.enu.kz/index.php/main/article/download/291/143/419

<a id="ref15"></a>[15] "Kazakh alphabets." Wikipedia. https://en.wikipedia.org/wiki/Kazakh_alphabets — 2017 decree and the 2021 postponement of the completion date to 2031.

<a id="ref16"></a>[16] Unicode Standard Annex #15: Unicode Normalization Forms. https://www.unicode.org/reports/tr15/

<a id="ref17"></a>[17] "Declaration on the Common Turkic Alphabet." Turkic Academy. https://www.turkicacademy.org/en/smi/declaration-common-turkic-alphabet — for the 34-letter order agreed at Baku. See also "Common Turkic Alphabet", Wikipedia: https://en.wikipedia.org/wiki/Common_Turkic_alphabet

<a id="ref18"></a>[18] "Russia Suspends Dairy Products From Kyrgyzstan After Calls In Bishkek To Drop Cyrillic Script." RFE/RL's Kyrgyz Service, 21 April 2023. https://www.rferl.org/a/russia-kyrgyzstan-dairy-products-banned-cyrillic-latin/32373802.html

<a id="ref19"></a>[19] Kloss, H. (1967). "'Abstand Languages' and 'Ausbau Languages'." *Anthropological Linguistics* 9(7), 29–41.

### Further reading

These are not cited above but bear directly on the arguments made here, and are recommended to anyone extending this work.

- Johanson, L. & Csató, É.Á. (eds.). *The Turkic Languages*, 2nd ed. Routledge, 2022 — for Kyrgyz phonology and the comparative Turkic picture, including the origin of Kyrgyz long vowels.
- Kara, D.S. *Kyrgyz*. Lincom Europa, 2003.
- Sebba, M. *Spelling and Society: The Culture and Politics of Orthography Around the World*. Cambridge University Press, 2007 — the standard treatment of orthography as a social rather than purely linguistic object.
- Unseth, P. (2005). "Sociolinguistic parallels between choosing scripts and languages." *Written Language & Literacy* 8(1).
- Cahill, M. & Rice, K. (eds.). *Developing Orthographies for Unwritten Languages*. SIL International, 2014.
- Venezky, R. (2004). "In search of the perfect orthography." *Written Language & Literacy* 7(2).
- Fierman, W. (2009). "Identity, symbolism, and the politics of language in Central Asia." *Europe-Asia Studies* 61(7).
- "Prospects of Kyrgyz language transition to the Latin script based on experience of Kazakhstan and Uzbekistan." *Language Problems and Language Planning* (2025). https://www.jbe-platform.com/content/journals/10.1075/lplp.25003.tok
- Petrov, A. et al. (2023). "Language Model Tokenizers Introduce Unfairness Between Languages." NeurIPS 2023.
- Kargaran, A.H., Imani, A., Yvon, F. & Schütze, H. (2023). "GlotLID: Language Identification for Low-Resource Languages." Findings of EMNLP 2023 — the identifier named in §13.2, built for languages in Kyrgyz's position.
- Washington, J.N., Salimzyanov, I. & Tyers, F.M. (2014). "Finite-state morphological transducers for three Kypchak languages." LREC 2014 — relevant to building morphological tooling on top of this orthography.
