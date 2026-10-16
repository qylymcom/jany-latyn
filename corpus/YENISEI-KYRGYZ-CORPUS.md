# Yenisei Kyrgyz inscription corpus: runes

The 22 Enisei Kyrgyz inscriptions in *A Database of Turkic Runiform Inscriptions* (Uppsala University), written in Unicode Old Turkic, one character per sign. They're for testing how the playground's runic modes read, display and convert genuine inscriptions. 21 have a text: 99 lines and 2337 signs in all. The last, Uibat VIII, has none in the source.

The runes follow the stones, not any modern reading. Each sign comes from the database's sign-by-sign transliteration, and its shape is matched to a Unicode character from the database's own drawing of that sign, using each stone's list of the shapes it uses. Where a page's comment says the stone has a different sign from the one printed, the runes follow the stone. The published readings and translations are tucked away under each stone as one interpretation among several; nothing in the runes depends on them.

| # | Inscription | Catalogue | Lines | Signs | Shapes |
| ---: | :--- | :--- | ---: | ---: | :--- |
| 1 | [Uyuk-Tarlak](#1-uyuk-tarlak) | E-1 | 2 | 89 | exact |
| 2 | [Uyuk Arzhan](#2-uyuk-arzhan) | E-2 | 5 | 48 | exact except ⟨z⟩ (shape unknown), ⟨ïK⟩ (shape unknown) |
| 3 | [Uyuk Turan](#3-uyuk-turan) | E-3 | 6 | 257 | exact |
| 4 | [Ottuk Dash I](#4-ottuk-dash-i) | E-4 | 1 | 13 | exact |
| 5 | [Baryk I](#5-baryk-i) | E-5 | 3 | 63 | exact |
| 6 | [Baryk II](#6-baryk-ii) | E-6 | 4 | 83 | exact |
| 7 | [Baryk III](#7-baryk-iii) | E-7 | 4 | 97 | exact |
| 8 | [Baryk IV](#8-baryk-iv) | E-8 | 3 | 18 | exact |
| 9 | [Kara Sug](#9-kara-sug) | E-9 | 5 | 51 | exact except ⟨z⟩ (2 of 3 unplaced) |
| 10 | [Elegest I](#10-elegest-i) | E-10 | 12 | 411 | exact except ⟨A⟩ (27 of 37 unplaced), ⟨z⟩ (10 of 15 unplaced) |
| 11 | [Begre](#11-begre) | E-11 | 10 | 372 | exact except ⟨A⟩ (11 of 52 unplaced) |
| 12 | [Aldy Bel I](#12-aldy-bel-i) | E-12 | 3 | 29 | exact |
| 13 | [Uibat I](#13-uibat-i) | E-30 | 5 | 97 | exact except ⟨n⟩ (1 of 6 unplaced) |
| 14 | [Uibat II](#14-uibat-ii) | E-31 | 5 | 89 | exact except ⟨n⟩ (1 of 6 unplaced) |
| 15 | [Uibat III](#15-uibat-iii) | E-32 | 15 | 384 | exact except ⟨A⟩ (19 of 27 unplaced) |
| 16 | [Uibat IV](#16-uibat-iv) | E-33 | 3 | 15 | exact |
| 17 | [Uibat V](#17-uibat-v) | E-34 | 1 | 13 | exact |
| 18 | [Elegest II](#18-elegest-ii) | E-52 | 3 | 43 | exact |
| 19 | [Aldy Bel II](#19-aldy-bel-ii) | E-72 | 2 | 22 | exact |
| 20 | [Uibat VII](#20-uibat-vii) | E-83 | 1 | 3 | exact |
| 21 | [Uibat VI](#21-uibat-vi) | E-98 | 6 | 140 | exact |
| 22 | [Uibat VIII](#22-uibat-viii) | E-132 | — | — | — |

## How to read this file

- **Runes.** Each line of a stone is one right-to-left paragraph, in the database's order. Lines on different faces are labelled by face, such as *front 1* or *left 2*. Copy a paragraph to get the line.
- **Word dividers.** The stones' two-dot divider, `:` in the transliteration, is U+205A TWO DOT PUNCTUATION ⁚. The one-dot divider, `.` (Begre, Baryk I), is U+2E31 WORD SEPARATOR MIDDLE DOT ⸱. Neither has spaces around it. A plain space appears only where the database prints a space with no divider. The spec's reader treats ⁚ as a word break and passes ⸱ through unchanged.
- **Database signs.** This is the transliteration as the page prints it. `{ }` marks one sign written with two letters, which the page underlines (`{ič}` is one sign, `Ič` is two). `⸢ ⸣` marks a sign the page shows as only partly legible, and `...` an illegible stretch. The runes don't mark legibility.
- **Shapes.** Most signs match a Unicode character exactly. Some shapes have no character of their own, such as turned forms, the ring-with-dot ŋ and the trefoil m; these are written with the Unicode letter they stand for, and each stone's notes list them. Appendix A has the full table of the database's glyphs.
- **Mirrored signs.** A sign drawn as the mirror image of another letter's shape is that letter, written mirrored, and is encoded as that letter: the left-pointing d (D04) is 𐰑, not 𐰒. Where a carver turned a line and wrote a stretch left to right, every letter in it is mirrored, so a sign there is encoded as the letter its mirror image stands for (on Begre, line 1 from ⟨KWnǰYmA⟩ and line 3 from ⟨rrdmmẄčn⟩). Pairs that Unicode encodes as two characters, 𐰀 and 𐰁, 𐰤 and 𐰥, 𐰔 and 𐰕, 𐰸 and 𐰹, stay two characters where both occur in the same writing direction.
- **Placed and unplaced signs.** On 9 stones the database lists two shapes for the same letter but doesn't say which occurrence is which. Each occurrence was looked up on the full-size drawings the database publishes, and `corpus/shapes.json` records the shape, the drawings consulted and a confidence (*clear*: the drawings agree; *probable*: one drawing shows it, or only part of the sign survives). (*disputed*: the drawings disagree, and the shape given is the one most of them draw.) Occurrences the drawings can't settle are written with the stone's first shape, and the table counts them as unplaced; `shapes.json` says for each stone why they are left open. A few signs have no glyph in the stone's list at all; the table marks them *shape unknown*.
- **Source text.** Every stone's database signs are the page's own wikitext, fetched on 2026-10-15, with its one-sign underlines and legibility marks. The runes were re-encoded from that wikitext and agree with this file on every line, apart from the corrections the notes give.
- **Checks.** Every line was converted back by the spec's inscription reader (`docs/jany-enesai/RUNES-SPEC.md` §7.2), and the output matches the database's value for each sign on 99 of 99 lines. That output is given under each line as the expected reader output. The spec's detector (`docs/jany-enesai/RUNES-SPEC.md` §9.4) classes every inscription as old spelling, with the dividers and with them replaced by spaces.
- **Language tag.** The rune paragraphs are tagged `otk-Orkh`, the spec's tag for genuine inscriptions.

---

## 1. Uyuk-Tarlak

E-1, M-20; Tyva 1. Source page: https://www.runiform.lingfil.uu.se/wiki/Uyuk_Tarlak

- Stone, 183 × 33 cm. Found by Aspelin in 1888 on a slope about 2 km from the river Tarlak, a tributary of the Uyuk; moved to the Minusinsk Martyanov Museum in 1916 (no. 20). Date unknown.
- Affiliation: Enisei Kyrgyz. Tamga: Tamga2.

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰾𐰃𐰕⁚𐰅𐰠𐰢𐰀⁚𐰴𐰆𐰨𐰆𐰘𐰢𐰀⁚𐰆𐰎𐰞𐰣𐰢𐰀⁚𐰉𐰆𐰒𐰣𐰢𐰀⁚𐰾𐰃𐰕⁚𐰢𐰀⁚𐰞𐱄𐰢𐱀⁚𐰖𐱀𐰢⁚𐰑𐰀</p>

- Database signs: `sIz : elmA : KW{nǰ}WymA : WGLNmA : ḄWḌNmA : sIz : mA : LṬmṣ : Yṣm : DA`
- Reader output: `s²iz el²ma qončoy²ma og¹l¹n¹ma b¹od¹n¹ma s²iz ma l¹t¹mš y¹šm d¹a`

**Line 2**

<p dir="rtl" lang="otk-Orkh">𐱄𐰢⁚𐰅𐰠𐱄𐰆𐰎𐰣⁚𐱄𐰆𐱄𐰹⁚𐰌𐰥⁚𐱅𐰭𐰼𐰃⁚𐰅𐰠𐰢⁚𐰛𐰀⁚𐰅𐰠𐰲𐰃𐰾𐰃⁚𐰼𐱅𐰢⁚𐰞𐱄𐰃⁚𐰉𐰎𐰉𐰆𐰒𐰣⁚𐰴𐰀⁚𐰌𐰏𐰃⁚𐰼𐱅𐰢</p>

- Database signs: `Ṭm : elṬWGN : ṬWṬ{wK} : bn : tŋrI : elm : kA : elčIsI : rtm : LṬI : BGBWḌN : KA : bgI : rtm`
- Reader output: `t¹m el²t¹og¹n¹ t¹ot¹oq b²n² t²ñr²i el²m k²a el²čis²i r²t²m l¹t¹i b¹g¹b¹od¹n¹ qa b²g²i r²t²m`

Notes on the signs:

- Line 1: the transliteration has ⟨y⟩, but this stone's glyph list has no ⟨y⟩ (it has ⟨Y⟩ 𐰖). Written 𐰘 as transliterated.
- Line 1: the page prints ⟨Ḅ⟩, which is not one of the database's glyph symbols. Read as ⟨B⟩ 𐰉; check the page.
- Shapes on this stone that Unicode has no character for: [B03](https://www.runiform.lingfil.uu.se/wiki/Glyph:B03), the loop of 𐰉 turned on its side (nearest character 𐰉).

Comments on the source page:

1. Tekin (1964) reads the first word as *äsiz* 'alas'; Erdal (2002) reads *elči* as 'ruler' rather than 'ambassador'.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | äsiz elim a qunǰuyïm a oɣlanïm a bodunïm a äsizim a altmïš yašïmda | O sorrow! O my realm, o my consort, o my son, o my people! O my sorrow! I was in the age of sixty. |
| 2 | atïm el toɣan totoq bän täŋri älimkä älčisi ärtim altï baγ bodunqa bägi ärtim | My name was El Togan Totok. I was the ambassador for my heavenly realm. I was the ruler of the six alliances. |

</details>

---

## 2. Uyuk Arzhan

E-2, M-21; Tyva 4. Source page: https://www.runiform.lingfil.uu.se/wiki/Uyuk_Arzhan

- The inscription was found by Aspelin in 1888 on the left bank of the river Uyuk, about two kilometres away from the riverbed, in the vicinity of a kurgan (burial mound) called Arzhan. The stone was transported to the Minusinsk Martyanov Museum in 1916 and catalogued under No. 21. It measures 215 x 41 centimetres. A 3D model of the stone is available in the database of the RSSDA Laboratory under the number XZ0518.
- Current location: Minusinsk Martyanov Museum. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz. Tamga: Tamga2.
- Drawings and photos on the source page: Аманжолов (2003, 112); Appelgren-Kivalo (1931, Abb. 329); Aspelin and Donner (1889, 16); Батманов and Кунаа (1963, 11); Васильев (1983, 59); Базылхан (2005, 324); RSSDA, XZ0518.

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰅𐱀𐰢𐰻𐰃𐰢𐰔𐱀𐰑𐰢</p>

- Database signs: `eṣmRIm⸢z⸣ṣDm`
- Reader output: `ešmr¹imzšd¹m`

**Line 2**

<p dir="rtl" lang="otk-Orkh">𐰠𐰢𐰲𐰮𐰓𐰢</p>

- Database signs: `lmčŋdm`
- Reader output: `l²mčñd²m`

**Line 3**

<p dir="rtl" lang="otk-Orkh">𐰼𐰼𐰓𐰢𐰢𐰌𐰢𐰹𐰔</p>

- Database signs: `rrdṃmbm{wK}⸢z⸣`
- Reader output: `r²r²d²mmb²moqz`

**Line 4**

<p dir="rtl" lang="otk-Orkh">𐰁𐰲𐰓𐰏𐰥⁚𐰼𐰼𐰓𐰢𐰢𐰁𐰹𐰔</p>

- Database signs: `Ačdgn : rrdṃmA{wK}⸢z⸣`
- Reader output: `ačd²g²n² r²r²d²mmaoqz`

**Line 5**

<p dir="rtl" lang="otk-Orkh">𐰼𐱄𐰃𐰢⁚𐰶𐱀𐰴𐱈⁚𐰌𐰥</p>

- Database signs: `rṬ⸢I⸣m : {⸢ïK⸣}ṣK{bš} : bn`
- Reader output: `r²t¹im ıqšqbaš b²n²`

Notes on the signs:

- Lines 1, 3 and 4: the transliteration has ⟨z⟩, but this stone's glyph list has no ⟨z⟩. Written 𐰔, the first of its shapes (𐰔 𐰕); the stone's shape isn't known.
- Line 5: ⟨ïK⟩ is one sign on the page, but the database has no glyph for it. It is encoded by its value ıq as 𐰶 U+10C36 ORKHON IQ; the stone's shape isn't known.
- Shapes on this stone that Unicode has no character for: [M03](https://www.runiform.lingfil.uu.se/wiki/Glyph:M03), three-lobed (trefoil) sign (nearest character 𐰢).

Comments on the source page:

1. There is most likely a proper name behind the letter combination ⟨ïKṣKbš⟩ which cannot be interpreted unequivocally. Possible readings might be qïšïqbaš, qïšqabaš or qïšaqbaš. Батманов and Кунаа (1963, 12) read ⟨YṣKbš⟩ yaš aq baš.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | ešim-urïm ... | My comrade, my son ... |
| 2 | älim ... | My realm ... |
| 3 | är ärdämim äbim ... | My manly virtue, my household ... |
| 4 | ... är ärdämim ... | ... my manly virtue ... |
| 5 | är atïm ... bän | My troops. I am ... |

</details>

---

## 3. Uyuk Turan

E-3; Tyva 5. Source page: https://www.runiform.lingfil.uu.se/wiki/Uyuk_Turan

- The inscription was found by Funtikov sometimes between 1886-1887 in the territory of the city of Turan. The stone was transported to Kyzyl in 1943. It measures 277 x 38 x 27 centimetres.
- Current location: Aldan-Maadyr National Museum of the Republic of Tyva, Aldyn Doshka branch. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz. Tamga: Tamga3.
- Drawings and photos on the source page: Appelgren-Kivalo (1931, Abb. 331); Аманжолов (2003, 113); Радлов (1893, lxxv); Radloff (1893: lxxv); Васильев (1983: 59); Васильев (1983, 59); Базылхан (2005, 325).

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰴𐰆𐰖𐰑𐰀⁚𐰴𐰆𐰩𐰖𐰢⁚𐰇𐰕𐰓𐰀⁚𐰆𐰎𐰞𐰢⁚𐰖𐱄𐰀⁚𐰾𐰕𐰢𐰀⁚𐰖𐱄𐰀⁚𐰌𐰝𐰢𐰓𐰢⁚𐰑𐰻𐰞𐱄𐰢⁚𐰛𐰃𐰥𐰢⁚𐰴𐰑𐱀𐰢⁚𐰖𐱄𐰀⁚𐰑𐰻𐰞𐱄𐰢</p>

- Database signs: `KWYDA : KW{nǰ}Ym : ẄzdA : WGLm : YṬA : szmA : YṬA : b{ẅk}mdm : DRLṬm : kInm : KDṣm : YṬA : DRLṬm`
- Reader output: `qoy¹d¹a qončy¹m özd²a og¹l¹m y¹t¹a s²zma y¹t¹a b²ökmd²m d¹r¹l¹t¹m k²in²m qd¹šm y¹t¹a d¹r¹l¹t¹m`

**Line 2**

<p dir="rtl" lang="otk-Orkh">𐰞𐱄𐰆𐰣𐰠𐰏⁚𐰛𐰅𐱀𐰏⁚𐰌𐰅𐰠𐰢𐱅𐰀⁚𐰉𐰣𐱄𐰢⁚𐱅𐰮𐰼𐰃𐰅𐰠𐰢⁚𐰛𐰀⁚𐰌𐰝𐰢𐰓𐰢⁚𐰾𐰃𐰕𐰢𐰀⁚𐰖𐱄𐰀⁚</p>

- Database signs: `LṬWNlg : kėṣg : belmtA : BNṬm : tŋrIelm : kA : b{ẅk}mdm : sIzmA : YṬA :`
- Reader output: `l¹t¹on¹l²g² k²ešg² b²el²mt²a b¹n¹t¹m t²ñr²iel²m k²a b²ökmd²m s²izma y¹t¹a`

**Line 3**

<p dir="rtl" lang="otk-Orkh">𐰇𐰲𐰃𐰥⁚𐰛𐰇𐰠𐰏⁚𐱅𐰃𐰼𐰏⁚𐰌𐰥⁚𐱅𐰮𐰼𐰃⁚𐰅𐰠𐰢⁚𐱅𐰀⁚𐰘𐰢𐰠𐰏⁚𐰌𐰥⁚...</p>

- Database signs: `ẄčIn : kẄlg : tIrg : bn : tŋrI : elm : tA : ymlg : bn : ⸢...⸣`
- Reader output: `öčin² k²öl²g² t²ir²g² b²n² t²ñr²i el²m t²a y²ml²g² b²n² ...`

**Line 4**

<p dir="rtl" lang="otk-Orkh">𐰇𐰲𐰘𐰅𐱅𐰢𐱀⁚𐰖𐱀𐰢𐰴𐰀⁚𐰑𐰻𐰞𐱄𐰢⁚𐰏𐰝𐰴𐱄𐰆𐰣⁚𐰘𐰼𐰢𐰛𐰀⁚𐰑𐰻𐰞𐱄𐰢</p>

- Database signs: `Ẅčyetmṣ : YṣmKA : DRLṬm : g{ẅk}KṬWN : yrmkA : DRLṬm`
- Reader output: `öčy²et²mš y¹šmqa d¹r¹l¹t¹m g²ökqt¹on¹ y²r²mk²a d¹r¹l¹t¹m`

**Line 5**

<p dir="rtl" lang="otk-Orkh">𐱅𐰮𐰼𐰃⁚𐰅𐰠𐰢𐰛𐰀⁚𐰴𐰕𐰎𐰴𐰢⁚𐰆𐰎𐰞𐰢⁚𐰣𐰆𐰕⁚𐰆𐰎𐰞𐰢⁚𐰞𐱄𐰃𐰌𐰃𐰮⁚𐰖𐰆𐰣𐱄𐰢⁚</p>

- Database signs: `tŋrI : elmkA : KzGKm : WGLm : ⸢N⸣Wz : WGLm : LṬIbIŋ : YWNṬm :`
- Reader output: `t²ñr²i el²mk²a qzg¹qm og¹l¹m n¹oz og¹l¹m l¹t¹ib²iñ y¹on¹t¹m`

**Line 6**

<p dir="rtl" lang="otk-Orkh">𐰴𐰣𐰢⁚𐱅𐰇𐰠𐰌𐰼𐰃⁚𐰴𐰻𐰀⁚𐰉𐰆𐰑𐰣⁚𐰛𐰇𐰠𐰏⁚𐰴𐰑𐱀𐰢⁚𐰾𐰃𐰕𐰢𐰀⁚𐰱𐰱𐰢𐰼⁚𐰇𐰏𐰠𐰼⁚𐰆𐰎𐰞𐰣𐰼⁚𐰛𐰇𐰓⁚𐰏𐰠𐰼𐰢⁚𐰴𐰃𐰕⁚𐰛𐰠𐰥⁚𐰠𐰼𐰢⁚𐰌𐰝𐰢𐰓𐰢</p>

- Database signs: `KNm : tẄlbrI : KRA : BWDN : kẄlg : KDṣm : sIzm⸢A⸣ : {ič}{ič}mr : Ẅ⸢gl⸣r : WGLNr : kẄd : glrm : KIz : kln : lrm : b{ẅk}mdm`
- Reader output: `qn¹m t²öl²b²r²i qr¹a b¹od¹n¹ k²öl²g² qd¹šm s²izma ičičmr² ög²l²r² og¹l¹n¹r² k²öd² g²l²r²m qiz k²l²n² l²r²m b²ökmd²m`

Notes on the signs:

- Line 2: the page prints ⟨ė⟩, which is not one of the database's glyph symbols. Read as ⟨e⟩ 𐰅.
- Shapes on this stone that Unicode has no character for: [Z04](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z04), mirror image of 𐰕 (nearest character 𐰕).

Comments on the source page:

1. We interpret the words quy and öz as two different parts of a valley: a secluded, protected part and a central, open one, respectively.
2. The runiform letters ⟨YITA⟩ are read as ayït a, that is the second person imperative of the verb ayït- 'to say' with interjection.
3. Tekin (1964) was the first who has pointed out that the runiform letters ⟨sIz⟩ are to be read as äsiz 'alas'.
4. The word altunlïɣ is most probably mistakenly written as ⟨LṬWNlg⟩ altunlïg, cf. Elegest I for parallel.
5. Names of rivers, see Aydın 2011. The word ägük (> öök) refers to the river Uyuk.
6. According to Erdal (2002, 61-62), the letters ⟨tẄlbrI⟩ are to be interpreted as tölböri 'Wolfjunges'.
7. The letters ⟨Ẅglr⟩ are read by Кормушин (1997: 192) as ⟨Ẅẅkšr⟩ üküš är 'many men'.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | quyda qunǰuyïm özdä oɣlïm ayït a äsizim a ayït a bökmädim adrïltïm äkinim qadašïm ayït a adrïltïm | O my consort in the secluded place! O my son in the valley! May thou say! O my sorrow! May thou say! I did not get fully satiated. I departed. My progeny and kinsmen, may thou say! I departed. |
| 2 | altunlïɣ kešig belimtä bantïm täŋri elimkä bökmädim äsizim a ayït a | I bound my gilded quiver round my waist. I did not get fully satiated with my heavenly realm. O my sorrow! May thou say! |
| 3 | üčin külig tirig bän täŋri elimtä yämlig bän | I am Üchin, the glorious Tirig. I was ... in my heavenly realm. |
| 4 | üč yetmiš yašïmqa adrïltïm ägük qatun yärimkä adrïltïm | I departed in the age of sixty-three. I departed from my place, from the rivers of Uyuk and Katun. |
| 5 | täŋri elimkä qïzɣaqïm oɣlïm ... oɣlïm altï biŋ yuntïm | In my heavenly realm: my daughter, my son, ... my son, my six-thousand horses, |
| 6 | qanïm tölböri qara bodun külig qadašïm äsizim a ič ičim är öglär oɣlan är küdägülärim qïz kälinlärim bökmädim | my khan Tölböri, common people, my glorious relatives, o my sorrow! My elder brother, mothers, sons, my sons-in-law, daughter, my daughters-in-law. I did not get fully satiated. |

</details>

---

## 4. Ottuk Dash I

E-4; Tyva 6; also “Ottuk Dash of Ulug Khem”. Source page: https://www.runiform.lingfil.uu.se/wiki/Ottuk_Dash_I

- Found by Aspelin near the mountain Ottuk Dash; brought to the Minusinsk Martyanov Museum by Adrianov in 1915 (no. 39). Date unknown. A single line.
- Affiliation: Enisei Kyrgyz.

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰛𐰇𐰲𐰴𐰃𐰖𐰎𐰣𐰃𐰲𐰼𐰛𐰃</p>

- Database signs: `kẄčKIYGNIčrkI`
- Reader output: `k²öčqiy¹g¹n¹ičr²k²i`

Comments on the source page:

1. The proper name is often read *küč qïyaɣan*.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | küč qïyɣan ičräki | I am Küch Kyigan from the ruling class. |

</details>

---

## 5. Baryk I

E-5; Tyva 7. Source page: https://www.runiform.lingfil.uu.se/wiki/Baryk_I

- Stone, 147 × 53 × 15 cm. Found by Klementz in 1891 at the river Baryk, a tributary of the Yenisei; Aldan-Maadyr National Museum of the Republic of Tyva (moved 1961). Date unknown.
- Affiliation: Enisei Kyrgyz.

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰼𐰼𐰓𐰢𐰃⁚𐱄 ... 𐰕⸱𐱄𐰉 ... 𐰕𐰼𐰓𐰢𐰃𐰏𐰆𐰨 ...</p>

- Database signs: `rrdm⸢I⸣ : Ṭ ... z . ṬB ... zrdmIgW{nǰ} ...`
- Reader output: `r²r²d²mi t¹ ... z⸱t¹b¹ ... zr²d²mig²onč ...`

**Line 2**

<p dir="rtl" lang="otk-Orkh">𐰇𐰕𐰘𐰃𐰏𐰥⁚𐰞𐰯𐱄𐰆𐰻𐰣⁚𐰞𐱄𐰃𐰆𐰎 ... 𐰉𐰆𐰑𐰣𐰑𐰁⁚... 𐰘𐰏𐰼𐰢𐰃𐰞𐱄𐰃 ...</p>

- Database signs: `ẄzyIgn : LpṬWRN : LṬIWG ... BWDNDA : ... ygrmILṬI ...`
- Reader output: `özy²ig²n² l¹pt¹or¹n¹ l¹t¹iog¹ ... b¹od¹n¹d¹a ... y²g²r²mil¹t¹i ...`

**Line 3**

<p dir="rtl" lang="otk-Orkh">𐰌𐰏𐰼𐰛𐰢𐰁⁚𐰾𐰕𐰢𐰀⁚𐰑𐰻𐰞𐰑𐰢</p>

- Database signs: `bgrkmA : szmA : DRLDm`
- Reader output: `b²g²r²k²ma s²zma d¹r¹l¹d¹m`

Notes on the signs:

- The stone has two shapes for ⟨A⟩: 𐰀 U+10C00 ([A00](https://www.runiform.lingfil.uu.se/wiki/Glyph:A00)) and 𐰁 U+10C01 ([A03](https://www.runiform.lingfil.uu.se/wiki/Glyph:A03)). 3 of 3 are placed from the drawings (2 𐰁, 1 𐰀); see `corpus/shapes.json` for the drawing and confidence of each.
- Shapes on this stone that Unicode has no character for: [NJ05](https://www.runiform.lingfil.uu.se/wiki/Glyph:NJ05), 𐰨 with a crossbar, close to the shape of 𐰪 ORKHON ENY (nearest character 𐰨).

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | är ärdämi ... ärdämig ... | Manly virtue ... virtue ... |
| 2 | öz yigin alp turan altï oγ ... bodunda ... yägirmi altï ... | Öz Yigin Alp Turan from the six ... clan ... sixteen ... |
| 3 | bägräkim a äsizim a adrïldïm | O my superior beg! O my grief! I departed. |

</details>

---

## 6. Baryk II

E-6; Tyva 8. Source page: https://www.runiform.lingfil.uu.se/wiki/Baryk_II

- Stone, 151 × 52 × 25 cm. Found by Klementz in 1891 at the river Baryk; Aldan-Maadyr National Museum of the Republic of Tyva (moved 1961). Date unknown.
- Affiliation: Enisei Kyrgyz.

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰛𐰇𐰥𐰃𐱅𐰃𐰼𐰏⁚𐰇𐰲𐰖𐱀𐰢𐰑𐰀⁚𐰴𐰬𐱂𐰃𐰕⁚𐰉𐰆𐰞𐰑𐰢</p>

- Database signs: `kẄnItIrg : ẄčYṣmDA : KŊšIz : BWLDm`
- Reader output: `k²ön²it²ir²g² öčy¹šmd¹a qñšiz b¹ol¹d¹m`

**Line 2**

<p dir="rtl" lang="otk-Orkh">𐰛𐰇𐰠𐰇𐰏𐱄𐰆𐱄𐰸⁚𐰃𐰲𐰢⁚𐰛𐰃𐱀𐰃⁚𐰴𐰃𐰞𐰑𐰃</p>

- Database signs: `kẄlẄgṬWṬwK : Ičm : kIṣI : KILDI`
- Reader output: `k²öl²ög²t¹ot¹oq ičm k²iši qil¹d¹i`

**Line 3**

<p dir="rtl" lang="otk-Orkh">𐰉𐰆𐰬𐰆𐱂𐰆𐰕⁚𐰼𐰓𐰀⁚𐰌𐰥⁚𐰼𐰓𐰢</p>

- Database signs: `BWŊWšWz : rdA : bn : rd⸢m⸣`
- Reader output: `b¹oñošoz r²d²a b²n² r²d²m`

**Line 4**

<p dir="rtl" lang="otk-Orkh">𐰴𐰆𐰖𐰑𐰀𐰴𐰃⁚𐰴𐰆𐰨𐰖𐰢𐰎𐰀⁚𐰑𐰻𐰞𐰑𐰢⁚𐰯𐰢𐰀</p>

- Database signs: `KWYDAKI : KW{nǰ}YmGA : DRLDm : ⸢pmA⸣`
- Reader output: `qoy¹d¹aqi qončy¹mg¹a d¹r¹l¹d¹m pma`

Notes on the signs:

- Line 4: the transliteration has ⟨p⟩, but this stone's glyph list has no ⟨p⟩. Written 𐰯 as transliterated.
- Shapes on this stone that Unicode has no character for: [NG01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG01), ring with a dot: the shape Unicode's chart gives 𐰧 YENISEI ENT, here read ŋ (nearest character 𐰬).

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | köni tirig üč yašïmda qaŋsïz boldïm | [I am] Köni Tirig. I was bereft of my father at the age of three. |
| 2 | külüg totoq ečim kiši qïldï | My elder brother, Külüg Totok, brought me up. |
| 3 | buŋusuz ärdä bän ärdim | My manhood time was without grief. |
| 4 | quydaqï qunǰuyïmɣa adrïldïm | I departed from my consort in the secluded place. |

</details>

---

## 7. Baryk III

E-7; Tyva 9. Source page: https://www.runiform.lingfil.uu.se/wiki/Baryk_III

- The inscription was found by Klementz in 1891 at the river Baryk, a tributary of the Enisei. The stone was transported to the National Museum of the Republic Tyva by Batmanov in 1961. It measures 150 x 50 x 25 centimetres.
- Current location: Aldan-Maadyr National Museum of the Republic of Tyva, Aldyn Doshka branch. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz.
- Drawings and photos on the source page: Радлов (1893, lxxviii); Батманов and Кунаа (1963 b, 31); Васильев (1983, 60); Базылхан (2005, 328).

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰉𐰖𐰱𐰀𐱂𐰬𐰆𐰣⁚𐰆𐰎𐰞𐰃⁚𐰛𐰇𐰠𐰇𐰏𐰲𐰆𐰻</p>

- Database signs: `BY{ič}AšŊWN : WGLI : kẄlẄgčWR`
- Reader output: `b¹y¹ičašñon¹ og¹l¹i k²öl²ög²čor¹`

**Line 2**

<p dir="rtl" lang="otk-Orkh">𐰉𐰆𐰬𐰆𐱂𐰆𐰕⁚𐰆𐰞𐰎𐰀𐱄𐰢⁚𐰉𐰆𐰬𐰉𐰆𐰼𐰢𐱀</p>

- Database signs: `BWŊWšWz : WLG⸢A⸣Ṭm : BWŊBWrm⸢ṣ⸣`
- Reader output: `b¹oñošoz ol¹g¹at¹m b¹oñb¹or²mš`

**Line 3**

<p dir="rtl" lang="otk-Orkh">𐱅𐰭𐰼𐰃𐰓𐰛𐰃⁚𐰛𐰇𐰥𐰛𐰀𐰘𐰼𐰓𐰛𐰃⁚𐰅𐰠𐰢𐰛𐰁𐰌𐰝𐰢𐰓𐰢</p>

- Database signs: `tŋrIdkI : kẄnkAyrdkI : ėlmkAb{ẅk}md⸢m⸣`
- Reader output: `t²ñr²id²k²i k²ön²k²ay²r²d²k²i el²mk²ab²ökmd²m`

**Line 4**

<p dir="rtl" lang="otk-Orkh">𐰴𐰆𐰖𐰑𐰀⁚𐰴𐰆𐰨𐰖𐰢𐰎𐰁𐰴𐰀⁚𐰇𐰕𐰑𐰀𐰆𐰎𐰞𐰢𐰴𐰀𐰑𐰻𐰞𐰑𐰢</p>

- Database signs: `KWYDA : KW{nǰ}YmGAKA : ẄzDAWGLmKADRLDm`
- Reader output: `qoy¹d¹a qončy¹mg¹aqa özd¹aog¹l¹mqad¹r¹l¹d¹m`

Notes on the signs:

- The stone has two shapes for ⟨A⟩: 𐰀 U+10C00 ([A00](https://www.runiform.lingfil.uu.se/wiki/Glyph:A00)) and 𐰁 U+10C01 ([A03](https://www.runiform.lingfil.uu.se/wiki/Glyph:A03)). 9 of 9 are placed from the drawings (7 𐰀, 2 𐰁); see `corpus/shapes.json` for the drawing and confidence of each.
- Line 2: the transliteration has ⟨ṣ⟩, but this stone's glyph list has no ⟨ṣ⟩. Written 𐱀 as transliterated.
- Line 3: the page prints ⟨ė⟩, which is not one of the database's glyph symbols. Read as ⟨e⟩ 𐰅.
- Shapes on this stone that Unicode has no character for: [C04](https://www.runiform.lingfil.uu.se/wiki/Glyph:C04), fork opening downwards, with feet (nearest character 𐰱); [NG01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG01), ring with a dot: the shape Unicode's chart gives 𐰧 YENISEI ENT, here read ŋ (nearest character 𐰬).

Comments on the source page:

1. The initial segment ⟨kẄ⟩ is hardly visible. The reading is plausible not only in terms of context, but also on paleographic grounds.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | bay ičä saŋun oɣlï külüg čor | [I am] Külüg Chor, son of Bai Ichä Sangun. |
| 2 | buŋusuz ulɣattïm buŋ bu ärmiš | I grew up without grief. The grief was [the following]: |
| 3 | täŋridäki künkä yärdäki elimkä bükmädim | I did not get fully satiated with the sun in the sky and my people on the earth. |
| 4 | quyda qunǰuyïmqa özdä oɣlïmqa adrïldïm | I departed from my consort in the secluded place and from my son in the valley. |

</details>

---

## 8. Baryk IV

E-8; Tyva 10. Source page: https://www.runiform.lingfil.uu.se/wiki/Baryk_IV

- The inscription was found by Klementz in 1891 at the river Baryk, a tributary of the Enisei. The stone was transported to the National Museum of the Republic Tyva by Batmanov in 1961. It measures 115 x 53 x 12 centimetres.
- Current location: Aldan-Maadyr National Museum of the Republic of Tyva, Aldyn Doshka branch. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz.
- Drawings and photos on the source page: Радлов (1893, lxxix); Васильев (1983, 60).

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">... 𐰌𐰝𐰢𐰓𐰢</p>

- Database signs: `... b{ẅk}mdm`
- Reader output: `... b²ökmd²m`

**Line 2**

<p dir="rtl" lang="otk-Orkh">...𐰑𐰀⁚𐰴𐰆𐰨𐰖𐰢𐰴𐰀 ...</p>

- Database signs: `...DA : KW{nǰ}YmKA ...`
- Reader output: `...d¹a qončy¹mqa ...`

**Line 3**

<p dir="rtl" lang="otk-Orkh">... 𐰴𐰬𐱂𐰕 ...</p>

- Database signs: `... KŊšz ...`
- Reader output: `... qñšz ...`

Notes on the signs:

- Shapes on this stone that Unicode has no character for: [NG01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG01), ring with a dot: the shape Unicode's chart gives 𐰧 YENISEI ENT, here read ŋ (nearest character 𐰬); [NJ05](https://www.runiform.lingfil.uu.se/wiki/Glyph:NJ05), 𐰨 with a crossbar, close to the shape of 𐰪 ORKHON ENY (nearest character 𐰨).

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | ... bökmädim | ... I did not get satiated. |
| 2 | [quy]da qunǰuyïmqa ... | ... from my consort in the secluded place. |
| 3 | ... qaŋsïz ... | ... without father ... |

</details>

---

## 9. Kara Sug

E-9; Tyva 11; also “Ulug Kem Kara Sug”. Source page: https://www.runiform.lingfil.uu.se/wiki/Kara_Sug

- Stone, 190 × 41 × 16 cm. Found by Aspelin in 1888 where the stream Kara-sug flows into the Yenisei, about 2 km from the mouth of the Elegest; Aldan-Maadyr National Museum of the Republic of Tyva (moved 1961). Date unknown. Mostly lost; the database notes that only the third line is still partly legible.
- Affiliation: Enisei Kyrgyz.

(right to left, top to bottom)

**Line front 1**

<p dir="rtl" lang="otk-Orkh">... 𐰣𐰢𐰀𐰾𐰔𐰢𐰀𐰑𐰻𐰞𐰑𐰢</p>

- Database signs: `... NmAszmADRLDm`
- Reader output: `... n¹mas²zmad¹r¹l¹d¹m`

**Line front 2**

<p dir="rtl" lang="otk-Orkh">... 𐱅𐰆𐰎𐰑𐰢𐰌𐰤</p>

- Database signs: `... tWGDMbn`
- Reader output: `... t²og¹d¹mb²n²`

**Line back 1**

<p dir="rtl" lang="otk-Orkh">... 𐰢 ... 𐰻𐰑𐰀⁚𐰌𐰭𐰇𐰾𐰇𐰖𐰹𐰼𐰢𐱀𐰖𐰞𐰬𐰘𐰇𐰕𐰠𐰏𐰓</p>

- Database signs: `... m ... ⸢R⸣DA : bŋ⸢Ẅ⸣s⸢Ẅ⸣Y{wK}rmṣYLŊyẄzlgd`
- Reader output: `... m ... r¹d¹a b²ñös²öy¹oqr²mšy¹l¹ñy²özl²g²d²`

**Line back 2**

<p dir="rtl" lang="otk-Orkh">... 𐱅𐰢𐰃 ... 𐰇𐰔𐰀</p>

- Database signs: `... ⸢tmI⸣ ... ⸢ẄzA⸣`
- Reader output: `... t²mi ... öza`

**Line back 3**

<p dir="rtl" lang="otk-Orkh">... 𐰼𐰢 ... 𐰀</p>

- Database signs: `... ⸢rm⸣ ... ⸢A⸣`
- Reader output: `... r²m ... a`

Notes on the signs:

- The stone has two shapes for ⟨z⟩: 𐰔 U+10C14 ([Z00](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z00)) and 𐰕 U+10C15 ([Z03](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z03)). 1 of 3 is placed from the drawings (1 𐰕); see `corpus/shapes.json` for the drawing and confidence of each. The other 2 can't be told apart on the drawings and are written 𐰔.
- Line front 2: the page prints ⟨M⟩, which is not one of the database's glyph symbols. Read as ⟨m⟩ 𐰢; check the page.
- Line back 2: the transliteration has ⟨I⟩, but this stone's glyph list has no ⟨I⟩. Written 𐰃 as transliterated.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| front 1 | ... a äsizim a adrïldïm | O ...! O my sorrow! I departed. |
| front 2 | ... bän | I ... |
| back 1 | ... bäŋüsü yoq ärmiš yalïŋ yüzlüg ... | ... had no memorial stone, ... with naked face |
| back 2 | ... | ... |
| back 3 | ... | ... |

</details>

---

## 10. Elegest I

E-10; Tyva 2; also “Körtle Khan inscription”, “Elegest of Ulug Khem”. Source page: https://www.runiform.lingfil.uu.se/wiki/Elegest_I

- Stone, 320 × 66 × 20 cm. Found by Aspelin in 1888 on the left bank of the river Elegest, about 7 km from its mouth; moved to the Minusinsk Martyanov Museum in 1915 (no. 19). Date unknown.
- Affiliation: Enisei Kyrgyz.

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰴𐰆𐰖𐰑𐰀⁚𐰴𐰆𐰨𐰖𐰢𐰀⁚𐰾𐰔𐰢𐰀⁚𐰖𐰃𐱄𐰀⁚𐰇𐰔𐰓𐰀 𐰆𐰍𐰞𐰢⁚𐰾𐰔𐰢𐰀⁚𐰑𐰻𐰞𐱄𐰢𐰀⁚𐰖𐰃𐱄𐰀</p>

- Database signs: `KWYDA : KW{nǰ}YmA : szmA : YIṬA : ẄzdA WGLm : szmA : DRLṬmA : YIṬ⸢A⸣`
- Reader output: `qoy¹d¹a qončy¹ma s²zma y¹it¹a özd²a og¹l¹m s²zma d¹r¹l¹t¹ma y¹it¹a`

**Line 2**

<p dir="rtl" lang="otk-Orkh">𐰘𐰇𐰔𐰼⁚𐰴𐰑𐱂𐰢 𐰆𐰖𐰻𐰣⁚𐰇𐰲𐰥⁚𐰘𐰇𐰔𐰼𐰥⁚𐰠𐰏⁚𐰇𐰛𐰔𐰥⁚𐱅𐰛𐰓𐰃 ...</p>

- Database signs: `yẄzr : KDšm WYRN : Ẅčn : yẄzrn : lg : Ẅkzn : tkd⸢I⸣ ...`
- Reader output: `y²özr² qd¹šm oy¹r¹n¹ öčn² y²özr²n² l²g² ök²zn² t²k²d²i ...`

**Line 3**

<p dir="rtl" lang="otk-Orkh">𐰛𐰇𐰝𐱅𐰭𐰼𐰃𐰓𐰀⁚𐰛𐰇𐰥𐰖𐰾𐰔𐰼𐰢𐱂⁚𐰖𐰃𐱄𐰀⁚𐰾𐰔𐰢𐰀⁚𐰑𐰻𐰞𐱄𐰢𐰀</p>

- Database signs: `kẄ{ẅk}tŋrIdA : kẄnYszrmš : YIṬA : szmA : DRLṬmA`
- Reader output: `k²öökt²ñr²id²a k²ön²y¹s²zr²mš y¹it¹a s²zma d¹r¹l¹t¹ma`

**Line 4**

<p dir="rtl" lang="otk-Orkh">𐰴𐰣𐰢⁚𐰅𐰠𐰢𐰀⁚𐰾𐰔𐰢𐰀⁚𐰖𐰃𐱄𐰀 ... 𐰌𐰝𐰢𐰓𐰢⁚𐰴𐰣𐰢𐰅𐰠𐰢𐰀⁚𐰖𐰃𐱄𐰀⁚𐰑𐰻𐰞𐱄𐰢</p>

- Database signs: `KNm : elmA : szmA : YIṬA ... ⸢b{ẅk}mdm⸣ : KNmelm⸢A⸣ : YIṬA : DRLṬ⸢m⸣`
- Reader output: `qn¹m el²ma s²zma y¹it¹a ... b²ökmd²m qn¹mel²ma y¹it¹a d¹r¹l¹t¹m`

**Line 5**

<p dir="rtl" lang="otk-Orkh">𐰛𐰇𐰼𐱅𐰠𐰴𐰣⁚𐰞𐰆𐰻𐰬𐰆𐰞𐱄𐰆𐰣𐰞𐰍⁚𐰛𐰾⁚𐰏𐰥𐰥 ... 𐰌𐰠𐰓𐰀 ...⁚𐱄𐰆𐰴𐰕𐰾𐰛𐰕𐰆𐰥⁚𐰖𐱂𐰑𐰀</p>

- Database signs: `kẄrtlKN : LWRŊWLṬWNLG: ks : gnn ... ⸢b⸣ldA ... : ṬWKzskzWn : Yš⸢DA⸣`
- Reader output: `k²ör²t²l²qn¹ l¹or¹ñol¹t¹on¹l¹g¹ k²s² g²n²n² ... b²l²d²a ... t¹oqzs²k²zon² y¹šd¹a`

**Line 6**

<p dir="rtl" lang="otk-Orkh">𐰆𐰼𐰬𐰆𐰛𐰇𐰠𐰏⁚𐱄𐰸⁚𐰌𐰇𐰏𐰇𐱅𐰼𐰛𐰥𐰀⁚𐰴𐰬𐰢⁚𐰌𐰏⁚𐰼𐰓𐰢⁚𐰇𐰲𐰥⁚𐰌 ...</p>

- Database signs: `WrŊWkẄlg : Ṭ{wK} : bẄgẄtrknA : KŊm : bg : rdm : Ẅčn : b ...`
- Reader output: `or²ñok²öl²g² t¹oq b²ög²öt²r²k²n²a qñm b²g² r²d²m öčn² b² ...`

**Line 7**

<p dir="rtl" lang="otk-Orkh">𐰴𐰻𐰀⁚𐰉𐰆𐰑𐰣𐰢⁚𐰴𐱄𐰍𐰞𐰣𐰬 𐰅𐰠𐱅𐰇𐰼𐰾𐰥⁚𐰃𐰑𐰢𐰬⁚𐰖𐰃𐱄𐰀⁚𐰾𐰔⁚𐰠𐰢⁚𐰴𐰣𐰢</p>

- Database signs: `KRA : BWDNm : KṬGLNŊ eltẄrsn : IDmŊ : YIṬA : sz : lm : KNm`
- Reader output: `qr¹a b¹od¹n¹m qt¹g¹l¹n¹ñ el²t²ör²s²n² id¹mñ y¹it¹a s²z l²m qn¹m`

**Line 8**

<p dir="rtl" lang="otk-Orkh">𐰅𐰠𐰢𐰆𐰍𐰻𐰣𐱄𐰀⁚𐰾𐰇⁚𐰉𐰆𐰞𐰯⁚𐰼𐰠𐰼𐰢𐰓𐰝𐰢𐰖𐰹⁚𐰲𐰌𐰠𐰏𐰓𐰀⁚𐰌𐰼𐱅𐰏𐰢𐰓𐰀⁚𐰾𐰛𐰔⁚𐰼⁚𐰠𐰼𐰓𐰢</p>

- Database signs: `elmWGRNṬA : sẄ : BWL⸢p⸣ : rlrmd{ẅk}mY{wK} : čblgdA : brtgmdA : skz : r : ⸢lrdm⸣`
- Reader output: `el²mog¹r¹n¹t¹a s²ö b¹ol¹p r²l²r²md²ökmy¹oq čb²l²g²d²a b²r²t²g²md²a s²k²z r² l²r²d²m`

**Line 9**

<p dir="rtl" lang="otk-Orkh">𐰅𐰠𐰢𐰆𐱄𐱂𐰭𐰀𐰌𐰃𐰼𐰴𐰃𐰞𐰣𐰆 ...</p>

- Database signs: `elmWṬ⸢š⸣ŋA⸢b⸣I⸢r⸣KILN⸢W⸣ ...`
- Reader output: `el²mot¹šñab²ir²qil¹n¹o ...`

**Line 10**

<p dir="rtl" lang="otk-Orkh">𐰉𐰆𐰬⁚𐰉𐰬𐰀⁚𐰉𐰥𐰉𐱄𐰼𐰢𐰾⁚𐰇𐰠𐰓𐰢⁚𐰖𐰃𐱄𐰀⁚𐰾𐰔𐰢𐰀⁚𐰖𐰞𐰴𐰥𐰖𐰥𐰀</p>

- Database signs: `BWŊ : BŊA : ⸢BnB⸣Ṭrms : Ẅldm : YIṬA : szmA : YLQ⸢n⸣Yn⸢A⸣`
- Reader output: `b¹oñ b¹ña b¹n²b¹t¹r²ms² öl²d²m y¹it¹a s²zma y¹l¹qn²y¹n²a`

**Line 11**

<p dir="rtl" lang="otk-Orkh">𐱅𐰇𐰼𐱅𐰑𐰴⁚𐰖𐰃𐰞𐰴𐰢⁚𐰾𐰛𐰔𐰑𐰴⁚𐰞𐰍⁚𐰉𐰻𐰢𐰢⁚𐰉𐰆𐰬𐰢⁚𐰖𐰆𐰹⁚𐰼𐰓𐰢</p>

- Database signs: `tẄrt⸢DK⸣ : YILKm : skzDK : LG : BRmm : BWŊm : YW{wK} : rdm`
- Reader output: `t²ör²t²d¹q y¹il¹qm s²k²zd¹q l¹g¹ b¹r¹mm b¹oñm y¹ooq r²d²m`

**Line 12**

<p dir="rtl" lang="otk-Orkh">𐰴𐰑𐱂𐰢𐰀⁚𐰛𐰅𐰥𐰢𐰀⁚𐰑𐰻𐰞𐱄𐰢𐰀⁚𐰖𐰃𐱄𐰀⁚𐰴𐰻𐰀⁚𐰉𐰆𐰑𐰣𐰢𐰀⁚𐰑𐰻𐰞𐱄𐰢⁚𐰖𐰃𐱄𐰀⁚𐰢𐰥</p>

- Database signs: `KDšmA : kenmA : DRLṬmA : YIṬA : KRA : BWDNmA : DRLṬm : YIṬA : mn`
- Reader output: `qd¹šma k²en²ma d¹r¹l¹t¹ma y¹it¹a qr¹a b¹od¹n¹ma d¹r¹l¹t¹m y¹it¹a mn²`

Notes on the signs:

- The stone has two shapes for ⟨A⟩: 𐰀 U+10C00 ([A00](https://www.runiform.lingfil.uu.se/wiki/Glyph:A00)) and 𐰁 U+10C01 ([A03](https://www.runiform.lingfil.uu.se/wiki/Glyph:A03)). 10 of 37 are placed from the drawings (10 𐰀); see `corpus/shapes.json` for the drawing and confidence of each. The other 27 can't be told apart on the drawings and are written 𐰀.
- ⟨D⟩ is drawn both as 𐰑 and as its mirror image ([D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04)); every ⟨D⟩ is written 𐰑, since a mirrored sign is the same letter (see *Mirrored signs* above).
- The stone has two shapes for ⟨wK⟩: 𐰹 U+10C39 ([K03](https://www.runiform.lingfil.uu.se/wiki/Glyph:K03)) and 𐰸 U+10C38 ([K06](https://www.runiform.lingfil.uu.se/wiki/Glyph:K06)). 3 of 3 are placed from the drawings (2 𐰹, 1 𐰸); see `corpus/shapes.json` for the drawing and confidence of each.
- The stone has two shapes for ⟨z⟩: 𐰔 U+10C14 ([Z00](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z00)) and 𐰕 U+10C15 ([Z03](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z03)). 5 of 15 are placed from the drawings (3 𐰔, 2 𐰕); see `corpus/shapes.json` for the drawing and confidence of each. The other 10 can't be told apart on the drawings and are written 𐰔.
- ⟨D⟩ is drawn both as 𐰑 and as its mirror image ([D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04)); every ⟨D⟩ is written 𐰑, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨D⟩ is drawn both as 𐰑 and as its mirror image ([D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04)); every ⟨D⟩ is written 𐰑, since a mirrored sign is the same letter (see *Mirrored signs* above).
- Line 8: the transliteration has ⟨p⟩, but this stone's glyph list has no ⟨p⟩. Written 𐰯 as transliterated.
- Line 10: the page prints ⟨Q⟩, which is not one of the database's glyph symbols. Read as ⟨K⟩ 𐰴; check the page.
- Shapes on this stone that Unicode has no character for: [B07](https://www.runiform.lingfil.uu.se/wiki/Glyph:B07), the loop of 𐰉 turned on its side (nearest character 𐰉); [D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04), mirror image of 𐰑 (zigzags pointing left) (written 𐰑); [G04](https://www.runiform.lingfil.uu.se/wiki/Glyph:G04), the two arms of 𐰍 joined to the stem (nearest character 𐰍); [NG01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG01), ring with a dot: the shape Unicode's chart gives 𐰧 YENISEI ENT, here read ŋ (nearest character 𐰬).

Comments on the source page:

1. Other readings reported by English Wikipedia (Elegest inscription): line 5 ⟨kẄrtlKN⟩ *körtlä qan* (Tekin, Kormušin, Sertkaya); line 8 ⟨rlrmdẅkmYwK⟩ *er ölürmedüküm yok* (Sertkaya 1995), *är ölürmädükim* (Sertkaya 2010), *ärlärmädükim joq* (Kormušin).

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | quyda qunǰuyïm a äsizim a ayït a özdä oɣlïm äsizim a adrïltïm a ayït a | O my consort in the secluded place! O my sorrow! May thou say! O my son in the valley! O my sorrow! O, I departed. May thou say! |
| 2 | yüz är qadašïm uyurïn üčün yüz ärin älig öküzin ... | Because of the capability of my hundred kinsmen ... with hundred kinsmen and fifty oxen. |
| 3 | kök täŋridä kün ay äsiz ärmiš ayït a äsizim a adrïltïm a | Both the Sun and the Moon in the blue sky were weighed down in sorrow. May thou say! O my sorrow! O, I departed. |
| 4 | qanïm elim a äsizim a ayït a ... bökmädim qanïm elim a ayït a adrïltïm | O my khan, o my realm! O my sorrow! May thou say! ... I did not get fully satiated. My khan, my realm! May thou say sorrow! I departed. |
| 5 | körtlä qan al uruŋu altunlïɣ käšig ... bäldä ... toquz säkiz on yašda | [I am] Körtlä khan, the Al Uruŋu. ... a golden quiver ... round my waist. I was seventy nine. |
| 6 | uruŋu külig toq bögü tärkän a qaŋïm bäg ärdäm üčün ... | O Uruŋu Külig Tok Bögü Tärkän! Because of the merit of my father, the beg ... |
| 7 | qara bodunïm qatïɣlanïŋ el törösin ïdmaŋ ayït a äsiz älim qanïm | Exert yourself my common people! Do not repudiate the unwritten law of the realm! May thou say, my sorrowful people and khan! |
| 8 | elim uɣrïnta sü bolïp ... yoq ... säkiz är ... | My realm set up an army in the right time ... eight men ... |
| 9 | elim ... | My realm ... |
| 10 | buŋ baŋa ... bat ärmiš öldim ayït a äsizim a ... | The grief was ... to me. I died. May thou say, o my sorrow! ... |
| 11 | tört adaq yïlqïm säkiz adaqlïɣ barïmïm buŋïm yoq ärdim | My four legged livestock, my eight legged properties. I did not get grief. |
| 12 | qadašïm a äkenim a adrïltïm a ayïta qara bodunïm a adrïltïm ayït a män | O my kinsmen, o my progeny! I departed. May thou say! O my common people! I departed. May thou say! |

</details>

---

## 11. Begre

E-11, M-40; Tyva 3. Source page: https://www.runiform.lingfil.uu.se/wiki/Begre

- The inscription was found by Oshurkov in 1892 at the river Begre, a tributary of the Enisei. The stone was transported to the Minusinsk Martyanov Museum in 1916 and catalogued under No. 40 as part of the open air exhibition. It measures 143 x 39 x 27 centimetres. The text runs on all the four sides of the stone. A 3D model of the stone is available in the database of the RSSDA Laboratory under the number VE0701.
- Current location: Minusinsk Martyanov Museum. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz.
- Drawings and photos on the source page: Radloff (1896, lxxxv); Малов (1952, 28); Васильев (1983, 61); Аманжолов (2003, 119); Аманжолов (2003, 120); Базылхан (2005, 330); RSSDA, VE0701.

(right to left, top to bottom)

**Line front 1**

<p dir="rtl" lang="otk-Orkh">𐱅𐰇𐰼𐰯𐰁⸱𐰃𐰲𐰼𐰛𐰃𐰋𐰥⸱𐰋𐱀𐰘𐰏𐰼𐰢𐰃𐰖𐱂𐰑𐰀⸱𐰞𐰣𐰢𐱀𐰢𐰴𐰆𐰨𐰖𐰢𐰀⸱𐰉𐰆𐰬𐰀⸱𐰑𐰻𐰞𐰑𐰢𐰀⸱𐰾𐰃𐰕𐰢𐰀⸱𐰛𐰇𐰥𐰀𐰖𐰀⸱𐰕𐰑𐰢𐰀</p>

- Database signs: `tẄrpA . IčrkIḅn . ḅṣygrmIYšDA . LNmṣmKW{nǰ}YmA . BWŊA . DRLDmA . sIzmA . kẄnAYA . zDmA`
- Reader output: `t²ör²pa⸱ičr²k²ib²n²⸱b²šy²g²r²miy¹šd¹a⸱l¹n¹mšmqončy¹ma⸱b¹oña⸱d¹r¹l¹d¹ma⸱s²izma⸱k²ön²ay¹a⸱zd¹ma`

**Line front 2**

<p dir="rtl" lang="otk-Orkh">𐰇𐰲𐰆𐰎𐰞𐰢𐰁𐰑𐰻𐰞𐰑𐰢𐰀𐰖𐰃𐱄𐰀𐰋𐰝𐰢𐰓𐰢𐰀𐰴𐱄𐰎𐰞𐰣𐰎𐰞</p>

- Database signs: `ẄčWGLmADRLDmAYIṬAḅ{ẅk}mdmAKṬGLNGL`
- Reader output: `öčog¹l¹mad¹r¹l¹d¹may¹it¹ab²ökmd²maqt¹g¹l¹n¹g¹l¹`

**Line left 1**

<p dir="rtl" lang="otk-Orkh">𐰋𐱂𐰘𐰏𐰼𐰢𐰃⸱𐰖𐱂𐰢𐰑𐰀⸱𐱄𐰉𐰎𐰲𐰴𐰣𐰎𐰀⸱𐰉𐰻𐰑𐰢𐰁⸱𐰼𐰼𐰓𐰢𐰢𐰇𐰲𐰥⸱𐰞𐰯𐰆𐰣⸱𐰞𐱄𐰆𐰣⸱𐰛𐰇𐰢𐱂𐰏⸱𐰏𐰼𐰃𐱅𐰋𐰀𐰅𐰠𐰓𐰁⸱𐰛𐰃𐱂𐰃⁚𐰴𐰕𐰎𐰣𐰑𐰢𐰁</p>

- Database signs: `bšygrmI . YšmDA . TBGčKNGA . BRDMA . rrdmmẄčn . LPWN . LTWN . kẄmšg . grItbAeldA . kIšI : KzGNDmA`
- Reader output: `b²šy²g²r²mi⸱y¹šmd¹a⸱t¹b¹g¹čqn¹g¹a⸱b¹r¹d¹ma⸱r²r²d²mmöčn²⸱l¹pon¹⸱l¹t¹on¹⸱k²ömšg²⸱g²r²it²b²ael²d²a⸱k²iši qzg¹n¹d¹ma`

**Line left 2**

<p dir="rtl" lang="otk-Orkh">𐰘𐱅𐰃⁚𐰋𐰇𐰼𐰃⸱𐰇𐰠𐰼𐰓𐰢𐰀⸱𐰉𐰻𐱂𐰎⸱𐰛𐰝𐰢𐰛𐰏⸱𐰻𐰠𐰼𐰢𐰓𐰢𐰀</p>

- Database signs: `ytI : bẄrI . ẄlrdmA . BRšG . k{ẅk}mkg . ẄlrmdmA`
- Reader output: `y²t²i b²ör²i⸱öl²r²d²ma⸱b¹r¹šg¹⸱k²ökmk²g²⸱r¹l²r²md²ma`

**Line back 1**

<p dir="rtl" lang="otk-Orkh">𐰘𐰼𐰢𐰀𐰖𐰃𐱄𐰀𐱂𐰆𐰉𐰢𐰀𐰑𐰻𐰞𐰑𐰢𐰁𐰉𐰆𐰬𐰁𐰾𐰃𐰕𐰢𐰀⸱𐰖𐰃𐱄𐰀</p>

- Database signs: `yrmAYIṬAšWBmADRLDmABWŊAsIzmA . YIṬA`
- Reader output: `y²r²may¹it¹ašob¹mad¹r¹l¹d¹mab¹oñas²izma⸱y¹it¹a`

**Line back 2**

<p dir="rtl" lang="otk-Orkh">𐰉𐰆𐰑𐰣𐰢𐰀⸱𐰛𐰃𐰥𐰢𐰀𐰴𐰑𐱂𐰢𐰀⸱𐰑𐰻𐰞𐰑𐰢𐰀⸱𐰋𐰝𐰢𐰓𐰢𐰀</p>

- Database signs: `BWDNmA . kInmAKDšmA . DRLDmA . b{ẅk}mdmA`
- Reader output: `b¹od¹n¹ma⸱k²in²maqd¹šma⸱d¹r¹l¹d¹ma⸱b²ökmd²ma`

**Line back 3**

<p dir="rtl" lang="otk-Orkh">𐰅𐰠𐰢𐰀𐰴𐰣𐰢𐰀𐰋𐰝𐰢𐰓𐰢𐰀⸱𐰖𐱂𐰢𐰘𐱅𐰃𐰘𐱅𐰢𐱂𐰕𐰑𐰢𐰀⸱</p>

- Database signs: `elmAKNmAb{ẅk}mdmA . YšmytIytmšzDmA .`
- Reader output: `el²maqn¹mab²ökmd²ma⸱y¹šmy²t²iy²t²mšzd¹ma⸱`

**Line back 4**

<p dir="rtl" lang="otk-Orkh">𐰖𐱄𐰑𐰀𐱅𐰇𐰮𐰼𐰢𐰀⸱𐰑𐰻𐰞𐱄𐰢𐰀</p>

- Database signs: `YṬDAtẄŋrmA . DRLṬmA`
- Reader output: `y¹t¹d¹at²öñr²ma⸱d¹r¹l¹t¹ma`

**Line back 5**

<p dir="rtl" lang="otk-Orkh">𐰦𐰞𐰎𐰑𐱂𐰢𐰀𐰦𐱂𐰃𐰕𐰢𐰀𐰓𐰏𐰇𐱀𐰢𐰀𐰑𐰻𐰞𐰑𐰢𐰀</p>

- Database signs: `{nd}LGDšmA{nd}šIzmAdgẄṣmADRLDmA`
- Reader output: `ntl¹g¹d¹šmantšizmad²g²öšmad¹r¹l¹d¹ma`

**Line right 1**

<p dir="rtl" lang="otk-Orkh">𐰾𐰛𐰃𐰕𐰑𐰴𐰞𐰎𐰉𐰻𐰢𐰎𐰇𐰲𐱅𐰇𐰖𐰃𐰞𐰴𐰃𐱅𐰇𐰛𐱅𐰃𐰘𐰻𐰑𐰢𐰀𐰦𐰀⸱𐰋𐰝𐰢𐰓𐰢𐰀𐰖𐱄𐰀𐰇𐰼𐰮𐰢𐰏𐰀𐰴𐰻𐰀𐰢𐰎𐰀𐰕𐰑𐰢𐰀</p>

- Database signs: `skIzDKLGBRMGẄč⸢tẄ⸣YILKItẄktIyRDmA{nd}A . b{ẅk}mdmAYṬAẄrŋmgAKRAmGAzDmA`
- Reader output: `s²k²izd¹ql¹g¹b¹r¹mg¹öčt²öy¹il¹qit²ök²t²iy²r¹d¹manta⸱b²ökmd²may¹t¹aör²ñmg²aqr¹amg¹azd¹ma`

Notes on the signs:

- The stone has two shapes for ⟨A⟩: 𐰀 U+10C00 ([A00](https://www.runiform.lingfil.uu.se/wiki/Glyph:A00)) and 𐰁 U+10C01 ([A03](https://www.runiform.lingfil.uu.se/wiki/Glyph:A03)). 41 of 52 are placed from the drawings (34 𐰀, 7 𐰁); see `corpus/shapes.json` for the drawing and confidence of each. 9 of them stand in a stretch the carver wrote left to right, where every letter is mirrored, so they are written as the letter their mirror image stands for. The other 11 can't be told apart on the drawings and are written 𐰀.
- ⟨D⟩ is drawn both as 𐰑 and as its mirror image ([D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04)); every ⟨D⟩ is written 𐰑, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨L⟩ is drawn both as 𐰞 and as its mirror image ([L03](https://www.runiform.lingfil.uu.se/wiki/Glyph:L03)); every ⟨L⟩ is written 𐰞, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨n⟩ is drawn both as 𐰥 and as its mirror image ([N04](https://www.runiform.lingfil.uu.se/wiki/Glyph:N04)); every ⟨n⟩ is written 𐰥, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨Y⟩ is drawn both as 𐰖 and as its mirror image ([Y03](https://www.runiform.lingfil.uu.se/wiki/Glyph:Y03)); every ⟨Y⟩ is written 𐰖, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨z⟩ is drawn both as 𐰕 and as its mirror image ([Z04](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z04)); every ⟨z⟩ is written 𐰕, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨D⟩ is drawn both as 𐰑 and as its mirror image ([D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04)); every ⟨D⟩ is written 𐰑, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨L⟩ is drawn both as 𐰞 and as its mirror image ([L03](https://www.runiform.lingfil.uu.se/wiki/Glyph:L03)); every ⟨L⟩ is written 𐰞, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨n⟩ is drawn both as 𐰥 and as its mirror image ([N04](https://www.runiform.lingfil.uu.se/wiki/Glyph:N04)); every ⟨n⟩ is written 𐰥, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨Y⟩ is drawn both as 𐰖 and as its mirror image ([Y03](https://www.runiform.lingfil.uu.se/wiki/Glyph:Y03)); every ⟨Y⟩ is written 𐰖, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨z⟩ is drawn both as 𐰕 and as its mirror image ([Z04](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z04)); every ⟨z⟩ is written 𐰕, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨D⟩ is drawn both as 𐰑 and as its mirror image ([D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04)); every ⟨D⟩ is written 𐰑, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨L⟩ is drawn both as 𐰞 and as its mirror image ([L03](https://www.runiform.lingfil.uu.se/wiki/Glyph:L03)); every ⟨L⟩ is written 𐰞, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨n⟩ is drawn both as 𐰥 and as its mirror image ([N04](https://www.runiform.lingfil.uu.se/wiki/Glyph:N04)); every ⟨n⟩ is written 𐰥, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨Y⟩ is drawn both as 𐰖 and as its mirror image ([Y03](https://www.runiform.lingfil.uu.se/wiki/Glyph:Y03)); every ⟨Y⟩ is written 𐰖, since a mirrored sign is the same letter (see *Mirrored signs* above).
- ⟨z⟩ is drawn both as 𐰕 and as its mirror image ([Z04](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z04)); every ⟨z⟩ is written 𐰕, since a mirrored sign is the same letter (see *Mirrored signs* above).
- Line left 2: the runes follow the stone, which has ⟨RlrmdmA⟩; the page prints the corrected ⟨ẄlrmdmA⟩. The page's comment: “The final word on the left side in line 2 is written most probably mistakenly as ⟨RlrmdmA⟩. The correct form should have been ⟨ẄlrmdmA⟩, see ⟨R⟩ and ⟨Ẅ⟩.”
- Line left 1: the page prints ⟨T⟩, which is not one of the database's glyph symbols. Read as ⟨Ṭ⟩ 𐱄.
- Lines left 1 and right 1: the page prints ⟨M⟩, which is not one of the database's glyph symbols. Read as ⟨m⟩ 𐰢.
- Line left 1: the page prints ⟨P⟩, which is not one of the database's glyph symbols. Read as ⟨p⟩ 𐰯.
- Shapes on this stone that Unicode has no character for: [B05](https://www.runiform.lingfil.uu.se/wiki/Glyph:B05), the diamond of 𐰋 on a single stem (nearest character 𐰋); [D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04), mirror image of 𐰑 (zigzags pointing left) (written 𐰑); [D05](https://www.runiform.lingfil.uu.se/wiki/Glyph:D05), upright cross +, i.e. 𐰓 turned 45° (nearest character 𐰓); [L03](https://www.runiform.lingfil.uu.se/wiki/Glyph:L03), mirror image of 𐰞 with a long foot, between 𐰞 and the V of 𐰟 (nearest character 𐰞); [N04](https://www.runiform.lingfil.uu.se/wiki/Glyph:N04), mirror image of 𐰥 (nearest character 𐰥); [N05](https://www.runiform.lingfil.uu.se/wiki/Glyph:N05), mirror image of 𐰣 (nearest character 𐰣); [NG01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG01), ring with a dot: the shape Unicode's chart gives 𐰧 YENISEI ENT, here read ŋ (nearest character 𐰬); [NJ04](https://www.runiform.lingfil.uu.se/wiki/Glyph:NJ04), mirror image of 𐰨 (nearest character 𐰨); [Y03](https://www.runiform.lingfil.uu.se/wiki/Glyph:Y03), mirror image of 𐰖 (nearest character 𐰖); [Z04](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z04), mirror image of 𐰕 (nearest character 𐰕).

Comments on the source page:

1. The final word on the left side in line 2 is written most probably mistakenly as ⟨RlrmdmA⟩. The correct form should have been ⟨ẄlrmdmA⟩, see ⟨R⟩ and ⟨Ẅ⟩.
2. The word alïnmïšïm is not a finite form as sometimes suggested in the literature, see e.g. 'ya bȳl vzyat (na vospitanie k kitaĭtsam)' in Малов (1952, 29), but a non-finite participle headed by the noun qunǰuy.
3. Tekin (1964) pointed out that the runiform letters ⟨sIz⟩ are to be read as äsiz 'alas'.
4. The runiform letters ⟨YITA⟩ are read as ayït a, that is the 2nd person imperative of the verb ayït- 'to say' with interjection.
5. The phrase säkiz adaqlïɣ barïm most likely describes properties or belongings of the pastoral nomads pulled by four legged draught animals on four wheeled carts, hence the number eight.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| front 1 | tör apa ičräki bän bäš yägirmi yašda alïnmïšïm qunǰuyïm a buŋ a adrïldïm a äsizim a kün a ay a azdïm a | I am Tör Apa, from the ruling class. O my consort whom I married when I was fifteen! O, what a grief! O, I departed! O my sorrow! O Sun and Moon! I have lost my way! |
| front 2 | üč oɣlïm adrïldïm a ayïta bökmädim a qatïɣlanɣïl | O my three sons, I departed. May thou say! I did not get fully satiated! Exert yourself! |
| left 1 | bäš yigirmi yašïmda tabɣač qanɣa bardïm a är ärdämim üčün alpun altun kümüšig ägri täbä eldä kiši qazɣandïm a | O, I was fifteen when I went to the Tabgach khan! Because of my manly virtues and toughness I acquired gold, silver, humped camels and people for the realm. |
| left 2 | yäti böri ölürdim a barsïɣ kökmäkig ölürmädim a | I killed seven wolves! I did not kill large felines or deer! |
| back 1 | yärim a ayït a subïm a adrïldïm buŋ a äsizim a ayït a | O my land, may thou say, o my water! I departed! O, what a grief! O my sorrow! May thou say! |
| back 2 | bodunïm a äkinim a qadašïm a adrïldïm a bökmädim a | O my people, o my progeny, o my kinsmen! I departed! I did not get fully satiated! |
| back 3 | elim a qanïm a bökmädim a yašïm yäti yätmiš azdïm a | O my realm, o my khan! I did not get fully satiated! I was sixty seven. I lost my way! |
| back 4 | yatda tüŋürim a adrïltïm a | O my relations by marriage being in foreign countries! I departed! |
| back 5 | andlïɣ adašïm a andsïzïm a ädgü äšim a adrïldïm a | O my sworn and unsworn comrades, o my good companion! I departed! |
| right 1 | säkiz adaqlïɣ barïmïɣ ... yïlqï tükäti ... anda bökmädim a ayït a ürüŋimgä qaramɣa azdïm a | ... my eight legged properties. I went ... livestock completely. I did not get fully satiated there! May thou say! I lost my noblemen and common people! |

</details>

---

## 12. Aldy Bel I

E-12, G-4, Ulug Khem Kulikhem; Tyva 12. Source page: https://www.runiform.lingfil.uu.se/wiki/Aldy_Bel_I

- The inscription was found by Aspelin in 1888 on a sloping foothill terrace in the Aldy Bel valley. It is located on the right bank of the river Enisei, around seven kilometres west of the village Eilig Khem and approximately three kilometres east of the river Kuilug Khem, a right tributary of the Enisei. The inscription consists of three vertical lines read from the bottom to the top. The line on the front (north) side includes a tamga, while the right (west) side is believed to have originally consisted of two lines, with one of them now illegible. The order of the lines remains uncertain. For a long time, the inscription was thought to include two more lines, which turned out to be part of the inscription now referred to as Aldy Bel II. The monument is still at its original location. It measures 175 x 37 x 27 centimetres.
- Current location: Original location. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz. Tamga: Tamga4.
- Drawings and photos on the source page: Radloff (1896, lxxix); Васильев (1983, 60); Aalto (1991, 53).

(right to left, top to bottom)

**Line north 1**

<p dir="rtl" lang="otk-Orkh">𐰲𐰆𐰲𐰃𐰌𐰇𐰼𐰃𐱂𐰬𐰆𐰣</p>

- Database signs: `čWčIbẄrIšŊWN`
- Reader output: `čočib²ör²išñon¹`

**Line west 1**

<p dir="rtl" lang="otk-Orkh">...</p>

- Database signs: `...`
- Reader output: `...`

**Line west 2**

<p dir="rtl" lang="otk-Orkh">𐱂𐰆𐰉𐰘𐰼⁚𐰚𐰢𐰴𐱄𐰆𐰣⁚𐰖𐰚𐰇𐰤 ... 𐰆𐰻 ...</p>

- Database signs: `šWByr : kmKṬWN : YkẄn ... WR ...`
- Reader output: `šob¹y²r² k²mqt¹on¹ y¹k²ön² ... or¹ ...`

Notes on the signs:

- Line west 2: the transliteration has ⟨K⟩, but this stone's glyph list has no ⟨K⟩. Written 𐰴 as transliterated.
- Line west 2: the transliteration has ⟨Ṭ⟩, but this stone's glyph list has no ⟨Ṭ⟩. Written 𐱄 as transliterated.
- Shapes on this stone that Unicode has no character for: [NG01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG01), ring with a dot: the shape Unicode's chart gives 𐰧 YENISEI ENT, here read ŋ (nearest character 𐰬).

Comments on the source page:

1. A tamga of the “western” type, i.e. two arcs with a crossbar, identical to the one on E-14 and E-19. E-20 also exhibits a similar tamga but that contains an additional vertical line, extending upward from the crossbar (Kormushin 1997, 180).
2. Name of a river, see Aydın 2011.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| north 1 | čočï böri šaŋun | Chochy Böri Shangun |
| west 1 | ... | ... |
| west 2 | šub yär käm qatun ay kün ... | Water and Earth, (the rivers) Kem and Katun, the Moon and the Sun |

</details>

---

## 13. Uibat I

E-30, M-7; Khakassia 1. Source page: https://www.runiform.lingfil.uu.se/wiki/Uibat_I

- Stone, 225 cm high. On the right bank of the river Uibat, about 2 km from the village of Charkov; found by Strahlenberg and Messerschmidt in 1721–1722, rediscovered by Klementz in 1886; Minusinsk Martyanov Museum (no. 7). Date unknown.
- Affiliation: Enisei Kyrgyz.

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰼𐰓𐰢 ... 𐱄𐰆𐰎𐰀⁚𐰌𐰼𐰢𐱀𐰀</p>

- Database signs: `rdm ... ṬWGA : brmṣA`
- Reader output: `r²d²m ... t¹og¹a b²r²mša`

**Line 2**

<p dir="rtl" lang="otk-Orkh">𐰲𐰉𐱀𐱄𐰆𐰣𐱄𐰻𐰴𐰣⁚𐰌𐰭𐰇𐰾𐰃⁚𐱅𐰃𐰛𐰁⁚𐰌𐰼𐱅𐰢</p>

- Database signs: `čBṣṬWNṬRKN : bŋẄsI : tIkA : brtm`
- Reader output: `čb¹št¹on¹t¹r¹qn¹ b²ñös²i t²ik²a b²r²t²m`

**Line 3**

<p dir="rtl" lang="otk-Orkh">𐰆𐰣⁚𐰥𐰃𐰥𐰾𐰃⁚𐱄𐰆𐰴𐰔𐰆𐰎𐰞𐰃⁚𐰉𐰻𐰇𐰲𐰥</p>

- Database signs: `WN : nInsI : ṬWKzWGLI : BRẄčn`
- Reader output: `on¹ n²in²s²i t¹oqzog¹l¹i b¹r¹öčn²`

**Line 4**

<p dir="rtl" lang="otk-Orkh">𐰼𐰓𐰢𐰥⁚𐰇𐰲𐰥𐰃𐰠𐰤𐰁𐰓𐰀⁚𐰴𐰻𐰁𐰴𐰣𐰴𐰁⁚𐰉𐰻𐰯𐰣</p>

- Database signs: `rdmn : ẄčnIl⸢n⸣AdA : KRAKNKA : BRpN`
- Reader output: `r²d²mn² öčn²il²n²ad²a qr¹aqn¹qa b¹r¹pn¹`

**Line 5**

<p dir="rtl" lang="otk-Orkh">𐰖𐰞𐰉𐰲⁚𐰉𐰻𐰯𐰣⁚𐰛𐰠𐰢𐰓𐰭𐰔⁚𐰌𐰏𐰢𐰔</p>

- Database signs: `YLBč : BRpN : klmdŋz : bgmz`
- Reader output: `y¹l¹b¹č b¹r¹pn¹ k²l²md²ñz b²g²mz`

Notes on the signs:

- The stone has two shapes for ⟨A⟩: 𐰀 U+10C00 ([A00](https://www.runiform.lingfil.uu.se/wiki/Glyph:A00)) and 𐰁 U+10C01 ([A03](https://www.runiform.lingfil.uu.se/wiki/Glyph:A03)). 7 of 7 are placed from the drawings (4 𐰁, 3 𐰀); see `corpus/shapes.json` for the drawing and confidence of each.
- The stone has two shapes for ⟨n⟩: 𐰤 U+10C24 ([N02](https://www.runiform.lingfil.uu.se/wiki/Glyph:N02)) and 𐰥 U+10C25 ([N04](https://www.runiform.lingfil.uu.se/wiki/Glyph:N04)). 5 of 6 are placed from the drawings (5 𐰥); see `corpus/shapes.json` for the drawing and confidence of each. The other 1 can't be told apart on the drawings and is written 𐰤.
- Shapes on this stone that Unicode has no character for: [N04](https://www.runiform.lingfil.uu.se/wiki/Glyph:N04), mirror image of 𐰥 (nearest character 𐰥).

Comments on the source page:

1. In line 4, ⟨n⟩ can also be read as ⟨R⟩ (database footnote).

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | ärdäm ... tuɣa bärmiš a | Virtue ... He has been born. |
| 2 | čabïš tun tarqan bäŋüsi tikä bertim | I have erected a memorial stone to the Chabysh Tun Tarqan. |
| 3 | on ... toquz oɣlï bar üčün | Because he has ten ... and nine sons, |
| 4 | ärdämin üčün ... qara qanqa barïpan | because of his manly qualities ... You have gone to Qara khan, |
| 5 | yalabač barïpan kälmädiŋiz bägimiz | you have gone as an ambassador but have not returned, our Beg! |

</details>

---

## 14. Uibat II

E-31; Khakassia 2. Source page: https://www.runiform.lingfil.uu.se/wiki/Uibat_II

- The inscription was found by Kuznetsov in 1885 near the village Charkov, on the right bank of the river Uibat. The stone was transported to the Minusinsk Martyanov Museum and catalogued under No. 29. It measures 83 x 53 x 15 centimetres.
- Current location: Minusinsk Martyanov Museum. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz.
- Drawings and photos on the source page: Aspelin and Donner (1889); Radloff (1896, lxxx); Васильев (1983, 65).

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰆𐰔𐰌𐰃𐰠𐰏𐰀𐰲𐰭𐱂𐰃⁚𐰆𐰔𐱅 ...</p>

- Database signs: `WzbIlgAčŋšI : Wzt ...`
- Reader output: `ozb²il²g²ačñši ozt² ...`

**Line 2**

<p dir="rtl" lang="otk-Orkh">... 𐰃𐰣⁚𐰇𐰲𐰤⁚𐰞𐰯𐰃𐰣𐰇𐰲𐰤⁚𐰼𐰓𐰢𐰃𐰤𐰇𐰲𐰥</p>

- Database signs: `... IN : Ẅčn : LpINẄčn : rdmInẄčn`
- Reader output: `... in¹ öčn² l¹pin¹öčn² r²d²min²öčn²`

**Line 3**

<p dir="rtl" lang="otk-Orkh">... 𐱅𐰇𐰚𐰓𐰃⁚𐱅𐰇𐰼𐱅𐰉𐰆𐰞𐰭𐰴𐰀⁚𐱅𐰇𐰚 ...</p>

- Database signs: `... ⸢t⸣ẄkdI : tẄrtBWLŋKA : tẄk ...`
- Reader output: `... t²ök²d²i t²ör²t²b¹ol¹ñqa t²ök² ...`

**Line 4**

<p dir="rtl" lang="otk-Orkh">... 𐰤𐰓𐰃⁚𐰇𐰲𐰴𐱄𐰀𐱅𐰏⁚𐰔𐰤𐱅𐰃</p>

- Database signs: `... ⸢n⸣dI : ẄčKṬAtg : zntI`
- Reader output: `... n²d²i öčqt¹at²g² zn²t²i`

**Line 5**

<p dir="rtl" lang="otk-Orkh">... 𐱄𐰀𐰾𐰃𐰔𐰼⁚𐰃𐰚𐰃𐰆𐰎𐰞𐰃𐰣𐰌𐰃𐰼𐰠𐰀⁚𐰇𐰠𐱅𐰃</p>

- Database signs: `... ⸢Ṭ⸣AsIzr : IkIWGLINbIrlA : ẄltI`
- Reader output: `... t¹as²izr² ik²iog¹l¹in¹b²ir²l²a öl²t²i`

Notes on the signs:

- The stone has two shapes for ⟨n⟩: 𐰤 U+10C24 ([N02](https://www.runiform.lingfil.uu.se/wiki/Glyph:N02)) and 𐰥 U+10C25 ([N04](https://www.runiform.lingfil.uu.se/wiki/Glyph:N04)). 5 of 6 are placed from the drawings (4 𐰤, 1 𐰥); see `corpus/shapes.json` for the drawing and confidence of each. The other 1 can't be told apart on the drawings and is written 𐰤.
- Shapes on this stone that Unicode has no character for: [G05](https://www.runiform.lingfil.uu.se/wiki/Glyph:G05), angular form of 𐰏 (nearest character 𐰏); [N04](https://www.runiform.lingfil.uu.se/wiki/Glyph:N04), mirror image of 𐰥 (nearest character 𐰥); [S05](https://www.runiform.lingfil.uu.se/wiki/Glyph:S05), mirror image of 𐱂 (nearest character 𐱂).

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | Uz bilgä čaŋšï uz ... | Uz Bilgä Changshy, the skilled ... |
| 2 | ... üčün alpïn üčün ärdämin üčün | ... because of his ..., because of his bravery, because of his manly qualities. |
| 3 | ... tökdi tört buluŋqa ... | ... poured out towards the four directions ... |
| 4 | ... üč qata tägzinti | ... he travelled about three times. |
| 5 | ... äsiz är äki oɣlïn birlä ölti | ... the sorrowful man died together with his two sons. |

</details>

---

## 15. Uibat III

E-32; Khakassia 3. Source page: https://www.runiform.lingfil.uu.se/wiki/Uibat_III

- The inscription was found by Messerschmidt in 1721 and then rediscovered by Klementz in 1886 on the left bank of the river Uibat about one kilometre away from the influx of the river Beika (Bei). The stone was transported to the Minusinsk Martyanov Museum and catalogued under No. 8. It measures 2.8 metres high, with a width of 25 centimetres and a bottom depth of 60 centimetres. According to Кормушин (2008, 128) there might have been a tamga on the stone, but it is no longer visible. A 3D model of the stone is available in the database of the RSSDA Laboratory under the number VE0840.
- Current location: Minusinsk Martyanov Museum. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz.
- Drawings and photos on the source page: Aspelin and Donner (1889, 4); Appelgren-Kivalo (1931, Abb. 156); Radloff (1896, xciii); Radloff (1896, xciv); Васильев (1983, 66); Appelgren-Kivalo (1931, Abb. 155); RSSDA, VE0840.

(right to left, top to bottom)

**Line front 1**

<p dir="rtl" lang="otk-Orkh">𐰴𐰻𐰀⁚𐰉𐰆𐰑𐰆𐰣 ... 𐰢⁚𐰇𐰔⁚𐰆𐰎𐰞𐰢⁚𐰌𐰝𐰢𐰓𐰢 ...</p>

- Database signs: `KRA : BWDWN ... m : Ẅ⸢z⸣ : WGLm : bẅkmdm ...`
- Reader output: `qr¹a b¹od¹on¹ ... m öz og¹l¹m b²ökmd²m ...`

**Line front 2**

<p dir="rtl" lang="otk-Orkh">𐱄𐰻𐰴𐰣⁚𐱂𐰭𐰆𐰣⁚... 𐰏𐰌𐰝𐰢𐰓𐰃⁚𐰉𐰆𐰑𐰣𐰃𐰭𐰀</p>

- Database signs: `ṬRKN : šŋWN : ... ⸢g⸣bẅkmdI : BWDNIŋA`
- Reader output: `t¹r¹qn¹ šñon¹ ... g²b²ökmd²i b¹od¹n¹iña`

**Line left 1**

<p dir="rtl" lang="otk-Orkh">𐰃𐰠𐰲𐰆𐰻⁚𐰃𐰠𐰃𐰭𐰀⁚𐰴 ... 𐰼𐰓𐰢𐰃𐰥𐰇𐰲𐰥⁚𐰖𐰸𐰞𐰑𐰃⁚</p>

- Database signs: `IlčWR : IlIŋA : K ... rdmInẄčn : YwKLDI :`
- Reader output: `il²čor¹ il²iña q ... r²d²min²öčn² y¹oql¹d¹i`

**Line left 2**

<p dir="rtl" lang="otk-Orkh">𐰖𐰸𐰻𐰢𐰔𐰆𐰔⁚𐰠 ... 𐰌𐰃𐰠𐰏𐰀⁚𐰌𐰏⁚𐰆𐰎𐰞𐰃⁚𐰭 ...</p>

- Database signs: `⸢Y⸣wK⸢R⸣mzWz : l ... bIlgA : bg : WGLI : ⸢ŋ⸣ ...`
- Reader output: `y¹oqr¹mzoz l² ... b²il²g²a b²g² og¹l¹i ñ ...`

**Line left 3**

<p dir="rtl" lang="otk-Orkh">𐰼𐰓𐰢𐰃𐰥⁚𐰇𐰲𐰥 ...⁚𐰴 ... 𐰃⁚𐰠𐰻𐰀⁚𐱄𐰆𐰴𐰔⁚𐰼𐰏⁚𐰆𐰑𐱀𐰼⁚𐰆𐰎𐰞𐰃𐰣⁚𐰇𐰏𐰇𐰼𐰯⁚𐰇𐰓𐰼𐰞𐱄𐰃⁚𐰼𐰓𐰢𐰌𐰏𐰢𐰀</p>

- Database signs: `⸢r⸣dmIn : Ẅčn ... : K ... I : l⸢R⸣A : TWKz : rg : WDṣr : ⸢WG⸣LIN : Ẅ⸢gẄ⸣rp : ẄdrLTI : rdmbgmA`
- Reader output: `r²d²min² öčn² ... q ... i l²r¹a t¹oqz r²g² od¹šr² og¹l¹in¹ ög²ör²p öd²r²l¹t¹i r²d²mb²g²ma`

**Line left 4**

<p dir="rtl" lang="otk-Orkh">𐰼𐰼𐰓𐰢𐰥𐰇𐰲𐰥 ... 𐱄𐰀⁚𐰖𐰸𐰞𐰑𐰃⁚𐰴𐰆𐰞𐰃⁚𐰞𐰯𐱄𐰆𐱄𐱂𐰻⁚𐰚𐰇𐰲⁚𐰃𐰲𐰲𐰢𐰀</p>

- Database signs: `rrdm⸢n⸣Ẅč⸢n⸣ ... ṬA : YwKLDI : KWLI : ⸢Lp⸣ṬWṬšR : kẄč : IččmA`
- Reader output: `r²r²d²mn²öčn² ... t¹a y¹oql¹d¹i qol¹i l¹pt¹ot¹šr¹ k²öč iččma`

**Line left 5**

<p dir="rtl" lang="otk-Orkh">𐰖𐰎𐰑𐰀⁚... 𐰌𐰏𐰼𐰏𐰲𐰃 ... 𐰉 ... 𐰲𐰃⁚𐰆𐰔⁚𐰴𐰆𐰯⁚𐰉𐰆𐰑𐰆𐰣⁚𐱅𐰃𐰚𐰥⁚𐰌𐰃𐰠𐰃𐰼⁚𐰼𐱅𐰃</p>

- Database signs: `YGDA : ... ⸢bgr⸣gč⸢I⸣ ... B ... čI : Wz : KWp : BWDWN : tIkn : bIlIr : rtI`
- Reader output: `y¹g¹d¹a ... b²g²r²g²či ... b¹ ... či oz qop b¹od¹on¹ t²ik²n² b²il²ir² r²t²i`

**Line back 1**

<p dir="rtl" lang="otk-Orkh">𐰃𐰠𐰢 ... 𐰏𐰥⁚𐱄𐰆𐰴𐰔⁚𐰼𐰏 ... 𐱅𐰔𐰏𐰥 ...⁚𐱄𐰣⁚𐰼𐰏 ...</p>

- Database signs: `I⸢l⸣m ... gn : ṬWKz : ⸢rg⸣ ... tzg⸢n⸣ ... : ṬN : rg ...`
- Reader output: `il²m ... g²n² t¹oqz r²g² ... t²zg²n² ... t¹n¹ r²g² ...`

**Line back 2**

<p dir="rtl" lang="otk-Orkh">𐰆𐱄𐰔⁚𐰼𐰏⁚𐰉𐱀𐰞𐰖𐰆⁚𐱄𐰆𐱄𐰎𐰴𐰀⁚𐰉𐰻𐰑 ...</p>

- Database signs: `WṬz : rg : BṣLY⸢W⸣ : ṬWṬGKA : B⸢R⸣D ...`
- Reader output: `ot¹z r²g² b¹šl¹y¹o t¹ot¹g¹qa b¹r¹d¹ ...`

**Line right 1**

<p dir="rtl" lang="otk-Orkh">𐰃𐰲𐰲𐰢𐰀⁚𐰑𐰻𐰣𐰑𐰢𐰀⁚</p>

- Database signs: `⸢I⸣ččmA : DRNDmA :`
- Reader output: `iččma d¹r¹n¹d¹ma`

**Line right 2**

<p dir="rtl" lang="otk-Orkh">𐰌𐰃𐰼𐰖𐱀𐰢𐱄𐰀⁚𐱄𐰲𐰢𐰴𐰀⁚𐰑𐰻𐰣𐰑𐰢𐰀𐱄𐱂𐰃𐰔⁚...</p>

- Database signs: `bIr⸢Yṣ⸣mṬA : ṬčmKA : DRNDmAṬ⸢š⸣Iz : ...`
- Reader output: `b²ir²y¹šmt¹a t¹čmqa d¹r¹n¹d¹mat¹šiz ...`

**Line right 3**

<p dir="rtl" lang="otk-Orkh">... 𐰆𐰻𐰬𐰆𐱂𐰃⁚𐰼𐱅𐰢⁚𐰃𐰣𐰨𐰆⁚𐰼𐱅𐰢</p>

- Database signs: `... WRŊWšI : rtm : INnǰW : rtm`
- Reader output: `... or¹ñoši r²t²m in¹nčo r²t²m`

**Line right 4**

<p dir="rtl" lang="otk-Orkh">𐰞𐱄𐰃𐰖𐱀𐰢𐱄𐰀⁚𐰴𐰬𐱂𐰻𐰑𐰢⁚𐰌𐰃𐰠𐰥𐰢𐰓𐰢𐰲𐰃𐰲𐰢𐰀⁚𐰖𐱄𐰀⁚𐰑𐰻𐰑𐰢⁚𐰉𐰲𐰀𐰲𐰎𐰀⁚𐰃𐰲𐰲𐰢𐰀⁚𐰴𐰬𐰢𐰀⁚𐰼𐰓𐰢𐰠𐰏𐰌𐰢⁚𐰼𐱅𐰃⁚...</p>

- Database signs: `LṬIYṣmṬA : KŊšRDm : bIlnmdmčIčmA : YṬA : DRDm : Bč⸢A⸣čGA : ⸢I⸣ččmA : KŊ⸢mA⸣ : rdm⸢lgb⸣m : rtI : ...`
- Reader output: `l¹t¹iy¹šmt¹a qñšr¹d¹m b²il²n²md²mčičma y¹t¹a d¹r¹d¹m b¹čačg¹a iččma qñma r²d²ml²g²b²m r²t²i ...`

**Line right 5**

<p dir="rtl" lang="otk-Orkh">𐰃𐰠𐰢𐰚𐰀⁚𐰴𐰣𐰢𐰴𐰀⁚𐰌𐰝𐰢𐰓𐰢 ... 𐰼𐰢𐰀⁚𐰃𐰥𐰢𐰀⁚𐰃𐰲𐰢𐰀⁚𐰢𐰖𐰢𐰚𐰢⁚𐰝𐰇 ... 𐰝</p>

- Database signs: `IlmkA : KNmKA : bẅkmdm ... rmA : InmA : IčmA : mYmkm : ẅkẄ ... ⸢ẅk⸣`
- Reader output: `il²mk²a qn¹mqa b²ökmd²m ... r²ma in²ma ičma my¹mk²m ökö ... ök`

**Line right 6**

<p dir="rtl" lang="otk-Orkh">... 𐰴𐰎 ... 𐰉𐰴 ...</p>

- Database signs: `... KG ... ⸢B⸣K ...`
- Reader output: `... qg¹ ... b¹q ...`

Notes on the signs:

- The stone has two shapes for ⟨A⟩: 𐰀 U+10C00 ([A00](https://www.runiform.lingfil.uu.se/wiki/Glyph:A00)) and 𐰁 U+10C01 ([A03](https://www.runiform.lingfil.uu.se/wiki/Glyph:A03)). 8 of 27 are placed from the drawings (8 𐰀); see `corpus/shapes.json` for the drawing and confidence of each. The other 19 can't be told apart on the drawings and are written 𐰀.
- Line left 3: the page prints ⟨T⟩, which is not one of the database's glyph symbols. Read as ⟨Ṭ⟩ 𐱄.
- Shapes on this stone that Unicode has no character for: [NG01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG01), ring with a dot: the shape Unicode's chart gives 𐰧 YENISEI ENT, here read ŋ (nearest character 𐰬).

Comments on the source page:

1. According to Кормушин (1997, 109) there is a ninety centimetre long gap in this line.
2. The runiform letters ⟨YITA⟩ are read as ayït a, that is the second person imperative of the verb ayït- 'to say' with interjection.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| front 1 | qara bodun ... öz oɣlïm bökmädim ... | ... common people ... my own son! I did not get satiated! ... |
| front 2 | tarqan saŋun ... bökmädi bodunïŋa | Tarqan Saŋun ... did not get satiated. To his people, |
| left 1 | el čor eliŋä ... ärdämin üčün yoqladï | to the realm of El Chor ... because of his bravery he thrived. |
| left 2 | ... uz ... bilgä bäg oɣlï ... | ... skilled ... son of the wise Bäg. |
| left 3 | ärdämin üčün ... el ara toquz ärig uduš är oɣlïn ... ödür altï ärdäm bägim a | Because of his bravery ... nine men and sons of servants from among the people ... O my virtuous Bäg! |
| left 4 | är ärdämin üčün ... yoqladï qolï alp tutsar küč ečičim a | Because of his bravery ... he thrived. His heroic hand was holding strength. O my dear elder brother! |
| left 5 | yaɣïda ... bäg ärigči ... uz qop bodun tikin bilir ärti | ... the bäg, the advisor ... the craftsmen and the whole people knew ... |
| back 1 | elim ... toquz ärig ... täzgin ... atïn ärig ... | ... my realm ... nine men ... travel on horse. The men ... |
| back 2 | otuz ärig bašlayu Totoɣqa ... | Leading thirty men, ... went to the military governor ... |
| right 1 | ečičim a adrïndïm a | O my dear elder brother! O, I departed! |
| right 2 | bir yašïmta atačïmqa adrïndïm a atasïz ... | At the age of one I separated from my dear father. Fatherless ... |
| right 3 | ... uruŋusï ärtim ïnanǰu ärtim | I was his standard-bearer, I was the minister. |
| right 4 | altï yašïmta qaŋsïradïm bilinmädim ečičim a ayït a ... bač a ačïɣ a ečičim a qaŋïm a ärdämlig ... ärti ... | At the age of six I remained without father. I was not aware of it. O my dear elder brother! May thou say! ... O dear! O bitterness! O my dear elder brother! O my father! He was my virtuous ... |
| right 5 | elimkä qanïmqa bökmädim ... ärim a inim a ečim a ... äkäm ... | I did not get satiated with my realm and my king. ... O my men! O my younger brother! O my elder brother! ... my elder sister ... |
| right 6 | ... | ... |

</details>

---

## 16. Uibat IV

E-33, Uzun Oba I; Khakassia 4. Source page: https://www.runiform.lingfil.uu.se/wiki/Uibat_IV

- The inscription was found by Pallas in 1793, then rediscovered by Castrén in 1847 and by Aspelin in 1888. It was located 15 kilometres west from the mouth of the river Uibat, near a tomb known as Uzun Oba. It measures 110 centimetres in height, with a width of 183 centimetres and a thickness of 18 centimetres. The stele is believed to be in its original location.
- Current location: Original location. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz.
- Drawings and photos on the source page: Radloff (1896, xcv); Васильев (1983, 65); Кызласов (1985, 56).

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">... 𐰣 ...</p>

- Database signs: `... N ...`
- Reader output: `... n¹ ...`

**Line 2**

<p dir="rtl" lang="otk-Orkh">... 𐰆𐰛𐰆𐰔⁚𐰞𐰯𐰣</p>

- Database signs: `... WkWz : L⸢p⸣N`
- Reader output: `... ok²oz l¹pn¹`

**Line 3**

<p dir="rtl" lang="otk-Orkh">𐰌𐰭𐰛𐰇𐰼𐱅𐰃</p>

- Database signs: `bŋkẄrtI`
- Reader output: `b²ñk²ör²t²i`

Notes on the signs:

- Line 3: the transliteration has ⟨t⟩, but this stone's glyph list has no ⟨t⟩. Written 𐱅 as transliterated.

Comments on the source page:

1. The letter ⟨k⟩ is not compatible with the surrounding letters ⟨W⟩.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | ... n ... | ... |
| 2 | ... | ... |
| 3 | bäŋkü ärti | ... was eternal |

</details>

---

## 17. Uibat V

E-34, Kara Kurgan of Uibat; Khakassia 5. Source page: https://www.runiform.lingfil.uu.se/wiki/Uibat_V

- The inscription was found by Pallas in 1793, then rediscovered by Castrén in 1847 and by Aspelin in 1888. It was located four kilometres from the right bank of the river Uibat, about 12 kilometres from its mouth, at the foot of a burial mound called Kara Kurgan. It is two kilometres north-west of another burial mound known as Chalgys Oba. The stele measures 3.15 metres high, 1.46 metres wide, and has a thickness between 22 and 27 centimetres. The inscription itself is 2 metres long, with characters ranging in height from 8 to 16 centimetres. It still seems to be in its original location, 4.5 kilometres east of the village Il'ich.
- Current location: Original location. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz.
- Drawings and photos on the source page: Radloff (1896, xcv); Кызласов and Кызласов (1976, 59).

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">...⁚𐰤𐰭𐰘𐰼𐰓𐰁⁚𐰴𐱂𐰹𐱄𐱀⁚𐰉𐰞 ...</p>

- Database signs: `... : nŋyrdA : Kš{wK}Ṭṣ : BL ...`
- Reader output: `... n²ñy²r²d²a qšoqt¹š b¹l¹ ...`

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | ... näŋ yerdä qašoq taš ... | ... somewhere the Kashok stone ... |

</details>

---

## 18. Elegest II

E-52; Tyva 13; also “Kezelekh Tagh”. Source page: https://www.runiform.lingfil.uu.se/wiki/Elegest_II

- Stone stele, 107 cm high, three vertical lines and a tamga (Tamga5) on one of the wider sides. Found by Granö in 1907 and again by Teploukhov in 1926 on a hill on the right bank of the river Elegest; Aldan-Maadyr National Museum of the Republic of Tyva (moved 1960). Date unknown.
- Affiliation: Enisei Kyrgyz.

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰚𐰇𐰼𐱅𐰠𐰀⁚𐱂𐰬𐰆𐰥𐰌𐰥⁚𐰲𐰢⁚𐰴𐰣𐰢 ...</p>

- Database signs: `kẄrtlA : šŊWnbn : čm : KNm ...`
- Reader output: `k²ör²t²l²a šñon²b²n² čm qn¹m ...`

**Line 2**

<p dir="rtl" lang="otk-Orkh">𐰌𐰏𐰇𐱅𐰼𐰚𐰥⁚𐰼𐰼𐰓𐰢𐰢𐰓𐰀</p>

- Database signs: `bgẄtrkn : rrdmmdA`
- Reader output: `b²g²öt²r²k²n² r²r²d²mmd²a`

**Line 3**

<p dir="rtl" lang="otk-Orkh">𐰲𐰲⁚𐰉𐰻𐱂𐰍⁚𐰻𐰀𐱂𐰬𐰆𐰣⁚</p>

- Database signs: `čč : BRšG : RAšŊWN :`
- Reader output: `čč b¹r¹šg¹ r¹ašñon¹`

Notes on the signs:

- Shapes on this stone that Unicode has no character for: [G04](https://www.runiform.lingfil.uu.se/wiki/Glyph:G04), the two arms of 𐰍 joined to the stem (nearest character 𐰍); [NG01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG01), ring with a dot: the shape Unicode's chart gives 𐰧 YENISEI ENT, here read ŋ (nearest character 𐰬).

Comments on the source page:

1. Kormushin (1997, 2008) reads line 3 as *čač bar saɣra saŋun*.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | körtlä šaŋun bän äčim qanïm ... | I am Körtle Shangun. My elder brother, my khan ... |
| 2 | bögü tärkän är ärdämimdä | Bögü Tärkän, in my manly virtue. |
| 3 | čač barsïɣ ara šaŋun | ... Shangun. |

</details>

---

## 19. Aldy Bel II

E-72, G-5; Tyva 14. Source page: https://www.runiform.lingfil.uu.se/wiki/Aldy_Bel_II

- Stone, 95 × 29 × 13–18 cm, still at its original site on the right bank of the Yenisei, about 7 km west of the village Eilig Khem, in the Aldy Bel valley. Found by Aspelin in 1888. Date unknown.
- Affiliation: Enisei Kyrgyz.

(right to left, top to bottom)

**Line south 1**

<p dir="rtl" lang="otk-Orkh">𐰴𐰃𐰻𐰃𐰍⁚𐰖𐰆𐰻𐱄𐰢 ...</p>

- Database signs: `KIRIG : YWRṬm ...`
- Reader output: `qir¹ig¹ y¹or¹t¹m ...`

**Line west 1**

<p dir="rtl" lang="otk-Orkh">... 𐰲𐰆𐱂⁚𐰴𐱄𐰆𐰣⁚𐱄𐰻𐰞𐰍𐰢 ...</p>

- Database signs: `... čWš : KṬWN : ṬRLGm ...`
- Reader output: `... čoš qt¹on¹ t¹r¹l¹g¹m ...`

Notes on the signs:

- Shapes on this stone that Unicode has no character for: [G04](https://www.runiform.lingfil.uu.se/wiki/Glyph:G04), the two arms of 𐰍 joined to the stem (nearest character 𐰍).

Comments on the source page:

1. Katun and Tarlak are river names (Aydın 2011, cited by the database).

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| south 1 | qïrïɣ : yurtum ... | ... my abode |
| west 1 | ... čuš qatun tarlaɣïm ... | ... my (rivers) Katun and Tarlak |

</details>

---

## 20. Uibat VII

E-83, The silver vessel of Uibat; Khakassia 7. Source page: https://www.runiform.lingfil.uu.se/wiki/Uibat_VII

- The silver vessel was found by Teploukhov during one of the field work expeditions between 1920-1928 (Теплоухов 1929, 54, 56, 57) in kurgan No. 19 at the Chaa tas ('war stone') of Uibat, a cemetery complex with 16 stone mounds and numerous stelae. It is kept in the State Hermitage Museum in Saint Petersburg under the inventory number 4899/2.
- Current location: State Hermitage Museum in Saint Petersburg. Date: Unknown. Material: Metal.
- Affiliation: Enisei Kyrgyz.
- Drawings and photos on the source page: Бернштам (1951, 80); Васильев (1983, 73); Kızlasov and Kızlasov (1994, 101); Кызласов (1994, 50).

(right to left, top to bottom)

**Line 1**

<p dir="rtl" lang="otk-Orkh">𐰲𐰆𐰬</p>

- Database signs: `⸢čWŊ⸣`
- Reader output: `čoñ`

Notes on the signs:

- Shapes on this stone that Unicode has no character for: [NG05](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG05), diamond without the dot (nearest character 𐰬).

Comments on the source page:

1. A very ambiguous reading, cf. the proposal ⟨čunt b di ɣu d⟩ čunt äb idi aɣu äd by Бернштам (1951, 85).

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| 1 | čoŋ | ... |

</details>

---

## 21. Uibat VI

E-98; Khakassia 6. Source page: https://www.runiform.lingfil.uu.se/wiki/Uibat_VI

- The inscription was found by Боргояков in 1964 two hundred metres off the railway track near the village Charkov on the territory of the "Stepnoi" Sovkhoz. The stone was transported to the Khakas National Museum of Local History in Abakan by А.Н. Липский. It measures 2.6 metres high, with a width of 60 centimetres and a thickness of 18 centimetres.
- Current location: Khakas National Museum of Local History. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz.
- Drawings and photos on the source page: Бутанаев (1973, 150); Бутанаев (1973, 151); Васильев (1983, 76); Аманжолов (2003, 145); Аманжолов (2003, 146).

(right to left, top to bottom)

**Line front 1**

<p dir="rtl" lang="otk-Orkh">... 𐰼⁚𐰉𐰆𐰬𐰖𐰆𐰣⁚𐰴𐰔𐰎𐰣𐰑𐰬𐰔⁚𐰌𐰇𐰚𐰢𐰓𐰬𐰔⁚𐰌𐰏𐰼𐰚𐰢𐰌𐰏</p>

- Database signs: `... r : ⸢B⸣WŊYWN : KzGNDŊz : bẄkm⸢dŊ⸣z : bgrkmbg`
- Reader output: `... r² b¹oñy¹on¹ qzg¹n¹d¹ñz b²ök²md²ñz b²g²r²k²mb²g²`

**Line front 2**

<p dir="rtl" lang="otk-Orkh">... 𐰬𐰁⁚𐰑𐰻𐰞𐰑𐰬𐰔⁚𐰲𐰃𐰎𐰀⁚𐰴𐰃𐰼𐰴𐰼𐰏⁚𐰴𐰬𐱂𐰔𐰴𐰃𐰞 ...</p>

- Database signs: `... ŊA : DRLDŊz : čIGA : KIrKrg : KŊšzKIL ...`
- Reader output: `... ña d¹r¹l¹d¹ñz čig¹a qir²qr²g² qñšzqil¹ ...`

**Line front 3**

<p dir="rtl" lang="otk-Orkh">... 𐰎𐰻𐰴𐰣⁚𐰃𐰠𐰤𐰞𐰑𐰹𐰑𐰁⁚𐰔𐰎𐰞𐰎⁚𐱄𐰆𐰬𐰔𐱅𐰏⁚𐱅𐰼𐰏⁚𐰌𐰏⁚𐰾𐰃𐰔 ...</p>

- Database signs: `... ⸢G⸣RKN : ⸢Il⸣nLD{wK}DA : zGLG : TWŊztg : trg : bg : sIz ...`
- Reader output: `... g¹r¹qn¹ il²n²l¹d¹oqd¹a zg¹l¹g¹ t¹oñzt²g² t²r²g² b²g² s²iz ...`

**Line back 1**

<p dir="rtl" lang="otk-Orkh">... 𐰞𐰯𐰉𐰻𐱂𐱅𐰼𐰏⁚𐰌𐰏𐰢⁚𐰖 ... 𐰼𐰓𐰢𐰢⁚𐰾𐰃𐰔𐰀</p>

- Database signs: `... L⸢p⸣BRštrg : bgm : Y ... rdm⸢m⸣ : sIzA`
- Reader output: `... l¹pb¹r¹št²r²g² b²g²m y¹ ... r²d²mm s²iza`

**Line back 2**

<p dir="rtl" lang="otk-Orkh">... 𐰠𐰲𐰃 ... 𐰼𐱅𐰢 ... 𐱀𐰚𐰇 ... 𐱅 ... 𐰝⁚𐰌𐰏𐰀</p>

- Database signs: `... lčI ... rtm ... ⸢ṣ⸣k⸢Ẅ⸣ ... t ... {ẅk} : bgA`
- Reader output: `... l²či ... r²t²m ... šk²ö ... t² ... ök b²g²a`

**Line back 3**

<p dir="rtl" lang="otk-Orkh">... 𐰇𐰠𐰼𐱅𐰢⁚𐰚𐰇𐰝𐰌𐰇𐰼𐰃⁚𐰴𐰻𐰁 ... 𐰉𐰎𐰆⁚𐰇𐰠𐰼𐱅𐰢</p>

- Database signs: `... Ẅlrtm : kẄ{ẅk}bẄrI : KR⸢A⸣ ... BG⸢W⸣ : Ẅlrtm`
- Reader output: `... öl²r²t²m k²öökb²ör²i qr¹a ... b¹g¹o öl²r²t²m`

Notes on the signs:

- The stone has two shapes for ⟨A⟩: 𐰀 U+10C00 ([A00](https://www.runiform.lingfil.uu.se/wiki/Glyph:A00)) and 𐰁 U+10C01 ([A03](https://www.runiform.lingfil.uu.se/wiki/Glyph:A03)). 6 of 6 are placed from the drawings (3 𐰁, 3 𐰀); see `corpus/shapes.json` for the drawing and confidence of each.
- Line front 3: the page prints ⟨T⟩, which is not one of the database's glyph symbols. Read as ⟨Ṭ⟩ 𐱄.
- Line back 2: the transliteration has ⟨ṣ⟩, but this stone's glyph list has no ⟨ṣ⟩. Written 𐱀 as transliterated.
- Shapes on this stone that Unicode has no character for: [NG01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG01), ring with a dot: the shape Unicode's chart gives 𐰧 YENISEI ENT, here read ŋ (nearest character 𐰬); [S05](https://www.runiform.lingfil.uu.se/wiki/Glyph:S05), mirror image of 𐱂 (nearest character 𐱂).

Comments on the source page:

1. The letter ⟨Ŋ⟩ is not compatible with the word bük-.
2. Кормушин (1997, 121-122; 2008, 158) reconstructs an extra line: ⟨... BW y ... mz ...⟩.

<details><summary>Published reading and translation (interpretive)</summary>

| Line | Reading | Translation |
| :--- | :--- | :--- |
| front 1 | ... qazɣandïŋïz bökmädiŋiz bägräkim bäg | ... you won, you did not get satiated, my superior, bäg! |
| front 2 | ... a adrïldïŋïz ačïɣ a qïrq ärig qaŋsïz ... | ... O ... you departed. O bitterness! ... forty fatherless men. |
| front 3 | ... qan elin alduqda azïɣlïɣ toŋuz täg tirig bäg äsiz | ... when you took the realm of the ... khan, like a boar with tusks, Tirig bäg ... sorrow! |
| back 1 | ... alp bars tirig bägim ... ärdämim äsiz a | Alp Bars Tirig bäg, my brave ..., o sorrow! |
| back 2 | ... elči ... ärtim bäg a | ... messenger ... O bäg! |
| back 3 | ... ölürtim kök böri qara ... buɣu ölürtim | I killed ... I killed grey wolves and black deer. |

</details>

---

## 22. Uibat VIII

E-132, Chaa-Tas of Uibat; Khakassia 8. Source page: https://www.runiform.lingfil.uu.se/wiki/Uibat_VIII

- The inscription was found by Castrén in 1847 on the northern side of kurgan No. 1 at the Chaa tas ('war stone') of Uibat, a cemetery complex with 16 stone mounds and numerous stelae. The monument seems to be in its original location. It exhibits two signs, but the glyphs cannot be reconstructed on the basis of the available data.
- Current location: Original location. Date: Unknown. Material: Stone.
- Affiliation: Enisei Kyrgyz.
- Drawings and photos on the source page: Appelgren-Kivalo (1931, Abb. 155).

The database gives no transliteration, reading or translation for this inscription, and no glyph list. Its one picture, Appelgren-Kivalo (1931, Abb. 155), is the same drawing the Uibat III page shows.

---

## Coverage

These are all 22 Enisei Kyrgyz entries in the database (https://www.runiform.lingfil.uu.se/wiki/List_of_all_inscriptions). Its 23rd entry, the Avar bone plates, is not Yenisei. The Yenisei corpus as a whole has over 200 known stones, numbered up to about E-164 and beyond.

---

## Appendix A. The database's glyphs and their Unicode characters

Matched by eye from the database's glyph drawings set next to Noto Sans Old Turkic. 50 glyphs are the shape of a Unicode character (**exact**). 19 are shapes Unicode doesn't encode, written with the nearest character for the same letter (**variant**). 6 have no reading. NG02 is not in the Glyphs table; it appears only in the Baryk III glyph list.

| Glyph | Database symbol | Value | Rune | Code point | Unicode name | Fit | Note |
| :--- | :---: | :--- | :---: | :--- | :--- | :--- | :--- |
| [A00](https://www.runiform.lingfil.uu.se/wiki/Glyph:A00) | A | a, ä | 𐰀 | U+10C00 | ORKHON A | exact |  |
| [A03](https://www.runiform.lingfil.uu.se/wiki/Glyph:A03) | A | a, ä | 𐰁 | U+10C01 | YENISEI A | exact |  |
| [B01](https://www.runiform.lingfil.uu.se/wiki/Glyph:B01) | B | b | 𐰉 | U+10C09 | ORKHON AB | exact |  |
| [B02](https://www.runiform.lingfil.uu.se/wiki/Glyph:B02) | b | b | 𐰋 | U+10C0B | ORKHON AEB | exact |  |
| [B03](https://www.runiform.lingfil.uu.se/wiki/Glyph:B03) | B | b | 𐰉 | U+10C09 | ORKHON AB | variant | the loop of 𐰉 turned on its side |
| [B04](https://www.runiform.lingfil.uu.se/wiki/Glyph:B04) | b | b | 𐰌 | U+10C0C | YENISEI AEB | exact |  |
| [B05](https://www.runiform.lingfil.uu.se/wiki/Glyph:B05) | ḅ | b | 𐰋 | U+10C0B | ORKHON AEB | variant | the diamond of 𐰋 on a single stem |
| [B06](https://www.runiform.lingfil.uu.se/wiki/Glyph:B06) | B | b | 𐰉 | U+10C09 | ORKHON AB | exact |  |
| [B07](https://www.runiform.lingfil.uu.se/wiki/Glyph:B07) | B | b | 𐰉 | U+10C09 | ORKHON AB | variant | the loop of 𐰉 turned on its side |
| [BS00](https://www.runiform.lingfil.uu.se/wiki/Glyph:BS00) | bš | baš | 𐱈 | U+10C48 | ORKHON BASH | exact |  |
| [C00](https://www.runiform.lingfil.uu.se/wiki/Glyph:C00) | č | č | 𐰲 | U+10C32 | ORKHON EC | exact |  |
| [C03](https://www.runiform.lingfil.uu.se/wiki/Glyph:C03) | ič | ič | 𐰱 | U+10C31 | ORKHON IC | exact |  |
| [C04](https://www.runiform.lingfil.uu.se/wiki/Glyph:C04) | ič | ič | 𐰱 | U+10C31 | ORKHON IC | variant | fork opening downwards, with feet |
| [D01](https://www.runiform.lingfil.uu.se/wiki/Glyph:D01) | D | d | 𐰑 | U+10C11 | ORKHON AD | exact |  |
| [D02](https://www.runiform.lingfil.uu.se/wiki/Glyph:D02) | d | d | 𐰓 | U+10C13 | ORKHON AED | exact |  |
| [D03](https://www.runiform.lingfil.uu.se/wiki/Glyph:D03) | Ḍ | d | 𐰒 | U+10C12 | YENISEI AD | exact |  |
| [D04](https://www.runiform.lingfil.uu.se/wiki/Glyph:D04) | D | d | 𐰑 | U+10C11 | ORKHON AD | mirrored | mirror image of 𐰑 (zigzags pointing left) |
| [D05](https://www.runiform.lingfil.uu.se/wiki/Glyph:D05) | d | d | 𐰓 | U+10C13 | ORKHON AED | variant | upright cross +, i.e. 𐰓 turned 45° |
| [E02](https://www.runiform.lingfil.uu.se/wiki/Glyph:E02) | e | e | 𐰅 | U+10C05 | YENISEI E | exact |  |
| [G01](https://www.runiform.lingfil.uu.se/wiki/Glyph:G01) | G | ɣ | 𐰍 | U+10C0D | ORKHON AG | exact |  |
| [G02](https://www.runiform.lingfil.uu.se/wiki/Glyph:G02) | g | g | 𐰏 | U+10C0F | ORKHON AEG | exact |  |
| [G03](https://www.runiform.lingfil.uu.se/wiki/Glyph:G03) | G | ɣ | 𐰎 | U+10C0E | YENISEI AG | exact |  |
| [G04](https://www.runiform.lingfil.uu.se/wiki/Glyph:G04) | G | ɣ | 𐰍 | U+10C0D | ORKHON AG | variant | the two arms of 𐰍 joined to the stem |
| [G05](https://www.runiform.lingfil.uu.se/wiki/Glyph:G05) | g | g | 𐰏 | U+10C0F | ORKHON AEG | variant | angular form of 𐰏 |
| [I00](https://www.runiform.lingfil.uu.se/wiki/Glyph:I00) | I | i, ï | 𐰃 | U+10C03 | ORKHON I | exact |  |
| [K01](https://www.runiform.lingfil.uu.se/wiki/Glyph:K01) | K | q | 𐰴 | U+10C34 | ORKHON AQ | exact |  |
| [K02](https://www.runiform.lingfil.uu.se/wiki/Glyph:K02) | k | k | 𐰚 | U+10C1A | ORKHON AEK | exact |  |
| [K03](https://www.runiform.lingfil.uu.se/wiki/Glyph:K03) | wK | oq, uq, qo, qu | 𐰹 | U+10C39 | YENISEI OQ | exact |  |
| [K04](https://www.runiform.lingfil.uu.se/wiki/Glyph:K04) | k | k | 𐰛 | U+10C1B | YENISEI AEK | exact |  |
| [K05](https://www.runiform.lingfil.uu.se/wiki/Glyph:K05) | ẅk | ök, ük, kö, kü | 𐰝 | U+10C1D | YENISEI OEK | exact |  |
| [K06](https://www.runiform.lingfil.uu.se/wiki/Glyph:K06) | wK | oq, uq, qo, qu | 𐰸 | U+10C38 | ORKHON OQ | exact |  |
| [L01](https://www.runiform.lingfil.uu.se/wiki/Glyph:L01) | L | l | 𐰞 | U+10C1E | ORKHON AL | exact |  |
| [L02](https://www.runiform.lingfil.uu.se/wiki/Glyph:L02) | l | l | 𐰠 | U+10C20 | ORKHON AEL | exact |  |
| [L03](https://www.runiform.lingfil.uu.se/wiki/Glyph:L03) | L | l | 𐰞 | U+10C1E | ORKHON AL | mirrored | mirror image of 𐰞 with a long foot, between 𐰞 and the V of 𐰟 |
| [M00](https://www.runiform.lingfil.uu.se/wiki/Glyph:M00) | m | m | 𐰢 | U+10C22 | ORKHON EM | exact |  |
| [M03](https://www.runiform.lingfil.uu.se/wiki/Glyph:M03) | ṃ | m | 𐰢 | U+10C22 | ORKHON EM | variant | three-lobed (trefoil) sign |
| [N01](https://www.runiform.lingfil.uu.se/wiki/Glyph:N01) | N | n | 𐰣 | U+10C23 | ORKHON AN | exact |  |
| [N02](https://www.runiform.lingfil.uu.se/wiki/Glyph:N02) | n | n | 𐰤 | U+10C24 | ORKHON AEN | exact |  |
| [N03](https://www.runiform.lingfil.uu.se/wiki/Glyph:N03) | n | n | 𐰥 | U+10C25 | YENISEI AEN | exact |  |
| [N04](https://www.runiform.lingfil.uu.se/wiki/Glyph:N04) | n | n | 𐰥 | U+10C25 | YENISEI AEN | mirrored | mirror image of 𐰥 |
| [N05](https://www.runiform.lingfil.uu.se/wiki/Glyph:N05) | N | n | 𐰣 | U+10C23 | ORKHON AN | mirrored | mirror image of 𐰣 |
| [ND00](https://www.runiform.lingfil.uu.se/wiki/Glyph:ND00) | nd | nd | 𐰦 | U+10C26 | ORKHON ENT | exact |  |
| [NG00](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG00) | ŋ | ŋ | 𐰭 | U+10C2D | ORKHON ENG | exact |  |
| [NG01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG01) | Ŋ | ŋ | 𐰬 | U+10C2C | YENISEI ANG | variant | ring with a dot: the shape Unicode's chart gives 𐰧 YENISEI ENT, here read ŋ |
| [NG02](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG02) | ŋ | ŋ | 𐰭 | U+10C2D | ORKHON ENG | exact | listed only on the Baryk III page (not in the Glyphs table); same drawing as NG00 |
| [NG03](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG03) | ŋ | ŋ | 𐰮 | U+10C2E | YENISEI AENG | exact |  |
| [NG04](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG04) | Ŋ | ŋ | 𐰬 | U+10C2C | YENISEI ANG | exact |  |
| [NG05](https://www.runiform.lingfil.uu.se/wiki/Glyph:NG05) | Ŋ | ŋ | 𐰬 | U+10C2C | YENISEI ANG | variant | diamond without the dot |
| [NJ00](https://www.runiform.lingfil.uu.se/wiki/Glyph:NJ00) | nǰ | nǰ | 𐰨 | U+10C28 | ORKHON ENC | exact |  |
| [NJ03](https://www.runiform.lingfil.uu.se/wiki/Glyph:NJ03) | nǰ | nǰ | 𐰩 | U+10C29 | YENISEI ENC | exact |  |
| [NJ04](https://www.runiform.lingfil.uu.se/wiki/Glyph:NJ04) | nǰ | nǰ | 𐰨 | U+10C28 | ORKHON ENC | mirrored | mirror image of 𐰨 |
| [NJ05](https://www.runiform.lingfil.uu.se/wiki/Glyph:NJ05) | nǰ | nǰ | 𐰨 | U+10C28 | ORKHON ENC | variant | 𐰨 with a crossbar, close to the shape of 𐰪 ORKHON ENY |
| [NN00](https://www.runiform.lingfil.uu.se/wiki/Glyph:NN00) | ? | ? | — | — | — | none |  |
| [NN01](https://www.runiform.lingfil.uu.se/wiki/Glyph:NN01) | ? | ? | — | — | — | none |  |
| [NN02](https://www.runiform.lingfil.uu.se/wiki/Glyph:NN02) | ? | ? | — | — | — | none |  |
| [NN03](https://www.runiform.lingfil.uu.se/wiki/Glyph:NN03) | ? | ? | — | — | — | none |  |
| [NN04](https://www.runiform.lingfil.uu.se/wiki/Glyph:NN04) | ? | ? | — | — | — | none |  |
| [NN05](https://www.runiform.lingfil.uu.se/wiki/Glyph:NN05) | ? | ? | — | — | — | none |  |
| [O01](https://www.runiform.lingfil.uu.se/wiki/Glyph:O01) | W | o, u | 𐰆 | U+10C06 | ORKHON O | exact |  |
| [OE02](https://www.runiform.lingfil.uu.se/wiki/Glyph:OE02) | Ẅ | ö, ü | 𐰇 | U+10C07 | ORKHON OE | exact |  |
| [P00](https://www.runiform.lingfil.uu.se/wiki/Glyph:P00) | p | p | 𐰯 | U+10C2F | ORKHON EP | exact |  |
| [R01](https://www.runiform.lingfil.uu.se/wiki/Glyph:R01) | R | r | 𐰻 | U+10C3B | YENISEI AR | exact |  |
| [R02](https://www.runiform.lingfil.uu.se/wiki/Glyph:R02) | r | r | 𐰼 | U+10C3C | ORKHON AER | exact |  |
| [S02](https://www.runiform.lingfil.uu.se/wiki/Glyph:S02) | s | s, š | 𐰾 | U+10C3E | ORKHON AES | exact |  |
| [S03](https://www.runiform.lingfil.uu.se/wiki/Glyph:S03) | š | š, s | 𐱂 | U+10C42 | YENISEI ESH | exact |  |
| [S04](https://www.runiform.lingfil.uu.se/wiki/Glyph:S04) | ṣ | š | 𐱀 | U+10C40 | YENISEI ASH | exact |  |
| [S05](https://www.runiform.lingfil.uu.se/wiki/Glyph:S05) | š | š, s | 𐱂 | U+10C42 | YENISEI ESH | mirrored | mirror image of 𐱂 |
| [T02](https://www.runiform.lingfil.uu.se/wiki/Glyph:T02) | t | t | 𐱅 | U+10C45 | ORKHON AET | exact |  |
| [T03](https://www.runiform.lingfil.uu.se/wiki/Glyph:T03) | Ṭ | t | 𐱄 | U+10C44 | YENISEI AT | exact |  |
| [Y01](https://www.runiform.lingfil.uu.se/wiki/Glyph:Y01) | Y | y | 𐰖 | U+10C16 | ORKHON AY | exact |  |
| [Y02](https://www.runiform.lingfil.uu.se/wiki/Glyph:Y02) | y | y | 𐰘 | U+10C18 | ORKHON AEY | exact |  |
| [Y03](https://www.runiform.lingfil.uu.se/wiki/Glyph:Y03) | Y | y | 𐰖 | U+10C16 | ORKHON AY | mirrored | mirror image of 𐰖 |
| [Z00](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z00) | z | z | 𐰔 | U+10C14 | ORKHON EZ | exact |  |
| [Z03](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z03) | z | z | 𐰕 | U+10C15 | YENISEI EZ | exact |  |
| [Z04](https://www.runiform.lingfil.uu.se/wiki/Glyph:Z04) | z | z | 𐰕 | U+10C15 | YENISEI EZ | mirrored | mirror image of 𐰕 |

---

## Appendix B. The stones' letter forms

For each letter, the Unicode forms the 21 stones use, with the number of stones that use each and, in brackets, the number of placed occurrences. Occurrences whose shape the drawings could not settle are left out. The last column is the attested majority, the form `docs/jany-enesai/RUNES-SPEC.md` §6 uses for Eski-Enesai. The table is generated by `corpus/scripts/attested.py`. 21 stones from one database are still a small sample, so read it as a check, not a verdict.

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

Patterns in the text that bear on the spec:

- **𐱀 is not only aš.** ⟨ṣ⟩ 𐱀 comes right after a written vowel other than a in 4 words on 4 stones: 𐰅𐱀𐰢… (Uyuk Arzhan), 𐰛𐰅𐱀𐰏 (Uyuk Turan), 𐰛𐰃𐱀𐰃 (Baryk II), …𐰏𐰇𐱀𐰢… (Begre). After a consonant sign the unwritten vowel can't be read from the signs alone, so these are only the clear cases. The spec reads 𐱀 as plain *š* (Appendix B there).
- **q next to i is 𐰴𐰃.** The pair 𐰴𐰃 occurs in 9 words. Only one ıq sign appears in the whole corpus, on Uyuk Arzhan, and it is partly legible and has no glyph in the database. Eski-Enesai therefore writes к by ы as 𐰴.
- **Two-sound signs that do occur.** 𐱈 baš appears on Uyuk Arzhan, partly legible. 𐰱 ič appears on Uyuk Turan and Baryk III, and 𐰦 nd (the Orkhon form, not 𐰧) on Begre. 𐰩 nč, the Yenisei form, appears only on Uyuk Turan; the others use 𐰨.
- **The ring with a dot is ŋ.** Baryk II, Baryk III, Baryk IV, Elegest I, Begre, Aldy Bel I, Uibat III, Elegest II and Uibat VI use a ring with a dot (glyph NG01) for back ŋ. That is the shape Unicode's chart, and Noto, draw for U+10C27 𐰧 YENISEI ENT, which the video chart labels нт. Encoded by letter it is 𐰬. The spec therefore proposes 𐰦, not 𐰧, for нт (`docs/jany-enesai/RUNES-SPEC.md` §12, R2).
- **𐰁 follows the carver.** Among placed a's, 𐰁 is 19% of word-final ones and 27% of word-medial ones, with no pattern by the preceding sign. Uibat I and Uibat VI write about half their a's with it, Elegest I and Uibat III none (`docs/jany-enesai/RUNES-SPEC.md` §8.1).

---

## Source and licence

The transliterations, readings, translations, comments, catalogue data and glyph drawings are from *A Database of Turkic Runiform Inscriptions*, Uppsala University, Department of Linguistics and Philology (project manager László Károly), https://www.runiform.lingfil.uu.se/. The pages were saved on 2026-10-14, and every text was checked against the database's wikitext on 2026-10-15.

The database is licensed CC BY-NC-SA 4.0. This file is derived from it and carries the same licence: attribution, non-commercial use, share-alike.

The Unicode encoding and the glyph matching are new to this file. Other readings of Elegest I are from English Wikipedia (https://en.wikipedia.org/wiki/Elegest_inscription).
