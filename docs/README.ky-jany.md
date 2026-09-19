# jany-latyn

[Kyrgyzça (Jany-Latyn)](README.ky-jany.md) · [Кыргызча (Кириллица)](README.ky.md) · [Русский](README.ru.md) · [English](../README.md) · [Türkçe](README.tr.md)

---

**Jany-Latyn** — kyrgyz tili üçün zamanbap, praktikalyk keŋeítilgen latyn jazuusu.

Bul dolboor kyrgyz tilinde süílögöndördün tabigyí jazuu adattaryna jana fonetikalyk taktykka negizdelgen:
**ж→j, ч→ç, ш→ş, х→h, sozulma ündüülör koş jazylat (тоок → took, даамдуу → daamduu)**.

Bardyk tamgalar üçün tak jana yraattuu erejeler tüzülgön:
- **ө** tamgasy latynça **ö / Ö** (U+00F6 / U+00D6) menen berilet.
- **ү** tamgasy latynça **ü / Ü** (U+00FC / U+00DC) menen berilet.
- **ң** tamgasy **ŋ / Ŋ** (U+014B / U+014A, eng) menen jazylat.
- **ч** tamgasy **ç / Ç** (U+00E7 / U+00C7), **ш** tamgasy **ş / Ş** (U+015F / U+015E).
- **ы** tamgasy **y**, al emi **й** tamgasy **í / Í** (U+00ED / U+00CD) bolup belgilenet.
- Orusça belgiler **ъ / ь** `í` ündüüsünö siŋirilet je tüşürülöt (*obíekt*, *semía*, *iíul*), natyíjada sözdör 100% tamgalardan turat (`\p{L}+`).

Misal:
> Ак мөңгүлүү аска, зоолор, талаалар →
> **Ak möŋgülüü aska, zoolor, talaalar**

---

## Alippe jana misaldar

| Kirillitsa | Jany-Latyn | Misal (Kirillitsa → Jany) |
|---|---|---|
| **А а** | a | ата → ata |
| **Б б** | b | бала → bala |
| **В в** | v | велосипед → velosiped |
| **Г г** | g | гүл → gül |
| **Д д** | d | дос → dos |
| **Е е / Э э** | e *(başynda е: íe)* | эне → ene, жер → jer, Европа → Íevropa |
| **Ё ё** | ío | ёлка → íolka, коён → koíon |
| **Ж ж** | j | жакшы → jakşy |
| **З з** | z | заман → zaman |
| **И и** | i | илим → ilim |
| **Й й** | **í** | ай → aí, чай → çaí, бийик → biíik |
| **К к** | k | китеп → kitep, кол → kol |
| **Л л** | l | көл → köl |
| **М м** | m | манас → manas |
| **Н н** | n | нарк → nark |
| **Ң ң** | **ŋ** | жаңы → jaŋy |
| **О о** | o | ооз → ooz |
| **Ө ө** | **ö** | өрүк → örük |
| **П п** | p | пахта → pahta |
| **Р р** | r | рахмат → rahmat |
| **С с** | s | салкын → salkyn |
| **Т т** | t | тоо → too |
| **У у** | u | улут → ulut |
| **Ү ү** | **ü** | күз → küz, жүгүрүү → jügürüü |
| **Ф ф** | f | фабрика → fabrika |
| **Х х** | h | хан → han |
| **Ц ц** | ts | цирк → tsirk |
| **Ч ч** | **ç** | чай → çaí |
| **Ш ш** | **ş** | шаар → şaar |
| **Щ щ** | **ş** | ящик → íaşik |
| **Ъ ъ / Ь ь** | — *(siŋirilgen)* | объект → obíekt, семья → semía, июль → iíul |
| **Ы ы** | y | кыргыз → kyrgyz, тыйын → tyíyn |
| **Ю ю** | íu | юрист → íurist, аюу → aíuu |
| **Я я** | ía | яма → íama, саякат → saíakat |

### Negizgi erejeler

1. **Sozulma ündüülör:** Kirillitsadagydaí ele koş jazylat (`аа → aa`, `ээ → ee`, `оо → oo`, `уу → uu`, `өө → öö`, `үү → üü`). Eç kandaí koşumça tataal diakritikalyk belgiler talap kylynbaít.
2. **Birdiktüü `í` tybyşy:** Kirillitsadagy `й` bardyk pozitsiíalarda `í` bolup jazylat (*aí*, *toí*, *tyíyn*, *biíik*, *kiíim*). Bul söz uŋgularyn buzbaí saktap, `iii` ştrih-kod syíaktuu büdömüktüktü jok kylat.
3. **Sedelkaluu tişçilder jana belgilerdi siŋirüü:** Birdiktüü `ç` jana `ş` tamgalary uŋgu menen müçönün kagylyşyn aldyn alat (*başçy*, *kesçi* vs *ishak*). Orusça `ъ / ь` belgileri `í` ündüüsü menen siŋirilet je tüşürülöt (*obíekt*, *semía*, *iíul*), natyíjada sözdör 100% tamgalardan turat (`\p{L}+`).
4. **`q` jana `ğ` koldonulbaít:** Jumşak jana joon [к/къ] jana [г/гъ] tybyştary ündüülördün taasirinen ulam sözdün mazmununan tabigyí türdö anyktalat.
5. **ASCII rezervdik rejimi:** Ataíyn tamgalary jok standarttuu klaviaturalarda jazuu üçün:
   - `ö → o`, `ü → u`, `í → i`, `ŋ → n`, `ç → ch`, `ş → sh`.
   - Misaly: `Ak möŋgülüü aska` → `Ak monguluu aska`.

---

## Ykçam baştoo jana buíruk saby (CLI)

Negizgi transliteratsiía sistemasy eç kandaí tyşky köz karandylyktarga muktaj emes (nöl köz karandylyk).

```sh
# Repozitoriídi köçürüp aluu jana kuruu
git clone https://github.com/qylymcom/jany-latyn.git
cd jany-latyn
npm install && npm run build

# Buíruk saby arkyluu tekstti aílandyruu
echo "Алгалай бер, кыргыз эл" | node packages/engine/dist/src/cli.js
# Jyíyntyk: Algalaí ber, kyrgyz el

echo "Ак мөңгүлүү аска" | node packages/engine/dist/src/cli.js
# Jyíyntyk: Ak möŋgülüü aska

# ASCII rezervdik formatyna aílandyruu
echo "Ак мөңгүлүү аска" | node packages/engine/dist/src/cli.js --to fallback
# Jyíyntyk: Ak monguluu aska

# Kaíra kirillitsaga aílandyruu
echo "Ak möŋgülüü aska" | node packages/engine/dist/src/cli.js --to cyrillic
# Jyíyntyk: Ак мөңгүлүү аска
```

---

## Veb oíun talaasy (Playground)

Svelte 5 jana daisyUI menen jasalgan interaktivdüü veb-tirkeme:

```sh
npm run dev
```

Brauzerde `http://localhost:5173` daregine kirip, jazuunu synap körsöŋüz bolot:
- **Jany-Latyn formaty demeíki abalda:** Veb-saíttyn özü Jany-Latyn jazuusunda açylyp, okuuga jeŋil ekenin daroo körsötöt.
- **Tüz transliteratsiía:** Sol jakta kirillitsa menen teriŋiz, oŋ jakta latyn jazuusun okuŋuz; ASCII fallback özünçö ötmöktö.
- **Varianttardy kotoruu:** jany-latyn, CTA, digraftar jana aralaş ө bir basuu menen, je ar bir tamgany özüŋüz tandaŋyz (`ĭ`/`ĩ` jana `ñ` varianttary menen koşo). Salyştyruu tizmesi ar bir variant özgörtkön sözdördü belgileít.
- **Virtualdyk klaviatura:** Alt katmary jana tez kirgizüü katary tandalgan parametrlerge ylaíyktaşat, oşonduktan uçurdagy varianttyn ar bir tamgasyn terüügö bolot ([docs/keyboard.md](keyboard.md)).
- **Jaryk jana karaŋgy temalar:** Demeíki boíunça tutumdun jöndöösünö ylaíyk; kotorguç meníuda.
- **Aripterdi tekşerüü:** Tutumduk jana zamanbap veb-aripterdin koldoosun baíkaŋyz.
- **Köp tildüü interfeís:** Kyrgyzça (Jany-Latyn), Kyrgyzça (Kirillitsa), Orusça, Anglisçe jana Türkçö tandoo mümkünçülügü.

---

## Klaviatura ornotuu (macOS jana Linux)

`ö`, `ü`, `í`, `ŋ`, `ç`, `ş` tamgalaryn Option / AltGr arkyluu oŋoí terüü:
- **Option / AltGr + `o`** → `ö`  (Shift menen → `Ö`)
- **Option / AltGr + `u`** → `ü`  (Shift menen → `Ü`)
- **Option / AltGr + `i`** → `í`  (Shift menen → `Í`)
- **Option / AltGr + `n`** → `ŋ`  (Shift menen → `Ŋ`)
- **Option / AltGr + `c`** → `ç`  (Shift menen → `Ç`)
- **Option / AltGr + `s`** → `ş`  (Shift menen → `Ş`)

### macOS boíunça ornotuu
1. Faíldy koldonuuçunun klaviatura kataloguna köçürüŋüz:
   ```sh
   cp packages/engine/keymaps/jany-latyn.keylayout ~/Library/Keyboard\ Layouts/
   ```
2. Tutumdan çygyp kaíra kiriŋiz (je kompíuterdi öçürüp küígüzüŋüz).
3. **System Settings** → **Keyboard** → **Input Sources** → **Edit...** basyp, **+** baskyçy arkyluu **"jany-latyn"** klaviaturasyn koşuŋuz.
4. Bul jaíylmada sandyk klaviatura (numpad), bagyttoo jebeleri jana terminaldyk kyska joldor (`Ctrl+C`, `Ctrl+D`) toluk iştep, kata ketirbeít.

### Linux (XKB) boíunça ornotuu
```sh
mkdir -p ~/.config/xkb/symbols
cp packages/engine/keymaps/jany.xkb ~/.config/xkb/symbols/jany
setxkbmap -I$HOME/.config/xkb -layout jany -print | xkbcomp -I$HOME/.config/xkb - $DISPLAY
```

Toluk nuskama jana Wayland jöndöölörü: [docs/keyboard.md](keyboard.md).

---

## Dolboordun tüzülüşü

```
├── packages/engine/src/
│   ├── alphabet.ts     # Negizgi tamga kartalary jana ASCII rezerv tablitsalary
│   ├── convert.ts      # Transliteratsiía mehanizmi (tüz, kaítarym, rezervdik)
│   └── cli.ts          # Konsolduk programma
├── apps/web/                 # Svelte 5 + SvelteKit veb-tirkemesi
│   └── src/lib/i18n/   # Kardar taraptagy dinamikalyk kotormolor
├── packages/engine/keymaps/  # macOS jana Linux klaviatura jaíylmalary
├── packages/engine/charts/   # Generatsiíalangan SVG alippe diagrammasy (alphabet.svg)
├── packages/engine/test/     # Node test runner testter toptomu (100% iígiliktüü)
├── docs/SPEC.md              # Rasmií orfografiíalyk spetsifikatsiía
├── docs/WHITEPAPER.md        # Keŋiri lingvistikalyk jana tehnikalyk negizdeme (Whitepaper)
└── AGENTS.md           # Iştep çyguuçular jana AI agentteri üçün koldonmo
```

Bul jazuunun tereŋ lingvistikalyk jana sanariptik negizdemesi tuuraluu toluk maalymatty [Whitepaper (WHITEPAPER.md)](WHITEPAPER.md) dokumentinen okuŋuz.

---

## Synoo jana tekşerüü

```sh
# Testterdi iştetüü
npm test

# Alippe grafigin kaíra tüzüü
npm run chart

# Veb-tirkemenin türlörün tekşerüü jana kuruu
npm run check:web
npm run build:web
```

---

## Litsenziía jana salym koşuu

Dolboor [MIT License](LICENSE) litsenziíasy menen taratylat.

Pikirler, sunuştar jana salymdar kubanuu menen kabyl alynat! Kyrgyz tilinin zamanbap sanariptik keleçegine öz salymyŋyzdy koşuŋuz.
