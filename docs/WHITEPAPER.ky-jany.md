# Jany-Latyn: kyrgyz tili üçün latyn orfografiíasy jana salyştyrma synoo çöírösü

**Ar bir jazylyş kirillitsadan ereje boíunça eseptelgen dolboorduk sunuş, etalonduk işke aşyruu jana açyk synoo çöírösü**

**Versiía:** 2026.5
**Abaly:** Açyk sunuş (orfografiíanyn 1-versiíasy) jana ulam jaŋylanyp turgan synoo çöírösü
**Avtor:** Emil Madraimov · salam@qylym.com
**Data:** 2026-jyldyn sentíabry
**Kotormo:** Bul — anglisçe 2026.5 versiíasynyn jasalma intellekttin jardamy menen jasalgan kotormosu. Anglisçe tekst negizgi nuska bolup eseptelet.
**Litsenziía:** Bul dokument CC BY 4.0 litsenziíasy menen taratylat. Etalonduk mehanizm MIT litsenziíasynda; veb synoo çöírösünün baştapky kodu PolyForm Noncommercial 1.0.0 şarttarynda jetkiliktüü. Repozitoriídegi `LICENSING.md` faílyn karaŋyz.
**Şilteme berüü üçün:** Emil Madraimov (2026). *Jany-Latyn: A Latin Orthography and Comparative Testbed for the Kyrgyz Language*, version 2026.5. https://doi.org/10.5281/zenodo.22844476

---

## Annotatsiía

Jany-Latyn — kyrgyz tili üçün 28 tamgaluu latyn orfografiíasy; al determindüü konverter jana ar bir talaştuu tandoonu parametr katary tandap aluuga bolo turgan synoo çöírösü menen birge jaryíalangan. Anyn negizgi çektöösü — ar bir jazylyş kirme sözdör sözdügü jok, kirillitsadan ereje boíunça eseptelişi kerek: oşondo akyrky seksen alty jyldyn tekstteri adam katyşpaí aílandyrylat, al emi konverter çygargan tekst özü tuura Jany-Latyn bolot. Bul çektöö kalgan tamgalar köz karandy bolgon tamgalardy anyktaít. Kyrgyz kirillitsasy bir `к` jana bir `г` jazat; alardyn biröösün bolso da velíardyk jana uvulíardyk tamgaga (`k`/`q`, `g`/`ğ`) bölüü kaísy sözdör kirme ekenin bilüünü talap kylmak, oşonduktan Jany-Latyn jalgyz `k` jana `g` tamgalaryn saktaít. Oşondo joon-içkelik aíyrmasyn ündüü gana alyp jüröt, oşonduktan `ы` baş/kiçine tamgaga aílandyrylganda jana ASCII koddoosunda `i` tamgasynan aíyrmasyn jogotkon çekitsiz `ı` menen emes, `y` menen jazylat; `y` eelengendikten, `й` jarym ündüüsü `í` menen jazylat. Kalgan dal kelüülör: `ж→j`, `ч→ç`, `ш→ş`, `х→h`, `ң→ŋ`, `ө→ö` jana `ү→ü`; ündüünün sozuluşu koş tamga menen jazylat, al emi orusça ajyratuu jana içkertüü belgileri jarym ündüügö siŋirilet, natyíjada ar bir söz bir bütün alfavittik token bolot. Eki deŋgeel birge anyktalat: diakritikalyk belgileri bar toluk forma jana özgörtülbögön klaviaturalar üçün jönököí ASCII formasy. Dokument oşondoí ele maşinalarga kerek bolgon, birok orfografiíalyk sunuştar adatta kamtybagan nerselerdi anyktaít: jogotuulary kiíin tabylbastan, aldyn ala aítylgan teskeri aílandyruu, eki forma üçün bir ele izdöö birdeílöö açkyçy jana irettöönü ylaíyktaştyruusu menen alfavittik tartip.

---

## Bul dokument jönündö

Bul — orfografiíanyn 1-versiíasy boíunça dolboorduk sunuş, izildöö baíandamasy da, standart da emes. Dokument bir katar orfografiíalyk tandoolordu jaktaít, ar birinin negizdemesin körsötöt jana oşol negizdeme jaŋylyş boluşu mümkün bolgon jerlerdi ataít. Orfografiía keŋiri masştabda koldonulgan emes, eç kimge okutulgan emes jana mamlekettik standart ötö turgan ekspertizadan ötkön emes. Baaloo bölümü jok: tokenizatorlordun işteşi, okuu yldamdygy, klaviaturadan terüü yldamdygy, şriftterdin ekranda körsötülüşü jana izdöö tuuraluu yrastoolor sistemalardyn dokumentteştirilgen işteşine jana avtordun tajryíbasyna taíanat, al emi §23 alardyn içinen ölçöögö bolo turgandaryn jana ar birine karşy kandaí natyíja dalil bolorun sanap beret. Bulak keltirilbese, bul jerdegi bir da yrastoo empirikalyk jyíyntyk katary okulbaşy kerek. Sandardy körgüsü kelgen okurmandar bul dokumentti gipoteza, al emi synoo çöírösün apparat katary karaşy kerek: al bul yrastoolorgo makul emes adamdar alardy tögüngö çygara alyşy üçün tüzülgön.

---

## Mazmunu

- **[I bölük — Jany-Latyn kyskaça](#i-bölük--jany-latyn-kyskaça)**
  - [1. Masele jana Jany-Latyn emneni sunuştaít](#1-masele-jana-jany-latyn-emneni-sunuştaít)
  - [2. Alfavitke kyskaça serep](#2-alfavitke-kyskaça-serep)
  - [3. Anyn negizindegi ereje: dolboorloo printsipteri](#3-anyn-negizindegi-ereje-dolboorloo-printsipteri)
  - [4. Kalganyn anyktagan tamgalar](#4-kalganyn-anyktagan-tamgalar)
  - [5. Emne beret jana emnege turat](#5-emne-beret-jana-emnege-turat)
  - [6. Başka sistemalar menen salyştyruu](#6-başka-sistemalar-menen-salyştyruu)
  - [7. Synoo çöírösü](#7-synoo-çöírösü)
  - [Avtor jönündö](#avtor-jönündö)
- **[II bölük — Ar bir tamganyn jüíösü](#ii-bölük--ar-bir-tamganyn-jüíösü)**
  - [8. Bir `k` jana bir `g`: singarmoniíalyk allofoniía](#8-bir-k-jana-bir-g-singarmoniíalyk-allofoniía)
  - [9. `ы` üçün `y`: joon erinsiz ündüü](#9-ы-üçün-y-joon-erinsiz-ündüü)
  - [10. `й` üçün `í`: taŋdaí jarym ündüüsü](#10-й-üçün-í-taŋdaí-jarym-ündüüsü)
  - [11. `ж` üçün `j`: jumşak affrikat](#11-ж-üçün-j-jumşak-affrikat)
  - [12. `ö` jana `ü`: içke erindik ündüülör](#12-ö-jana-ü-içke-erindik-ündüülör)
  - [13. `ç` jana `ş`: şybyş ünsüzdör](#13-ç-jana-ş-şybyş-ünsüzdör)
  - [14. `ң` üçün `ŋ`: velíardyk murun ünsüzü](#14-ң-üçün-ŋ-velíardyk-murun-ünsüzü)
  - [15. Ündüülör, sozuluş jana `е`](#15-ündüülör-sozuluş-jana-е)
  - [16. Kirme sözdördögü `ъ` jana `ь` belgileri, oşondoí ele `я`, `ё`, `ю`](#16-kirme-sözdördögü-ъ-jana-ь-belgileri-oşondoí-ele-я-ё-ю)
  - [17. Alfavittik tartip](#17-alfavittik-tartip)
  - [18. Kirillitsaga kaíra aílandyruu](#18-kirillitsaga-kaíra-aílandyruu)
  - [19. Eki deŋgeel: toluk forma jana jönököí forma](#19-eki-deŋgeel-toluk-forma-jana-jönököí-forma)
  - [20. Baaloodogu tamgalar: `ä`, `x`, `w`](#20-baaloodogu-tamgalar-ä-x-w)
- **[III bölük — Kontekst](#iii-bölük--kontekst)**
  - [21. Jany-Latyn jana muruntan bar sistemalar](#21-jany-latyn-jana-muruntan-bar-sistemalar)
  - [22. Sotsiolingvistikalyk jana saíasií kontekst](#22-sotsiolingvistikalyk-jana-saíasií-kontekst)
- **[IV bölük — Açyk suroolor jana başkaruu](#iv-bölük--açyk-suroolor-jana-başkaruu)**
  - [23. Açyk suroolor jana keleçektegi işter](#23-açyk-suroolor-jana-keleçektegi-işter)
  - [24. Başkaruu](#24-başkaruu)
  - [25. Korutundu](#25-korutundu)
- **[Koldonulgan adabiíattar](#koldonulgan-adabiíattar)**
  - [Koşumça adabiíattar](#koşumça-adabiíattar)
- **[Tirkemeler](#tirkemeler)**
  - [A tirkeme. `e` sistemasy](#a-tirkeme-e-sistemasy)
  - [B tirkeme. Normaldaştyruu, birdeílöö jana irettöö](#b-tirkeme-normaldaştyruu-birdeílöö-jana-irettöö)
  - [C tirkeme. Irettöönü ylaíyktaştyruu](#c-tirkeme-irettöönü-ylaíyktaştyruu)
  - [D tirkeme. Mehanizm, klaviatura jaíylmalary jana CLI](#d-tirkeme-mehanizm-klaviatura-jaíylmalary-jana-cli)

---

# I bölük — Jany-Latyn kyskaça

Jany-Latyn — kyrgyz tili üçün sunuştalgan latyn alfaviti: al 28 tamgadan turat jana kompíuter kirillitsadagy kaalagan kyrgyzça tekstti kirme sözdördün tizmesi jok, natyíjany eç kim tekşerbeí turup, aga avtomattyk türdö aílandyra algydaí kylyp tüzülgön. Konverter emne jazsa, oşol jön gana tuura Jany-Latyn bolot. Atalyştyn özü tömöndö süröttölgön jönököí formada jazylgan; toluk türündö al — *Jaŋy Latyn* (жаңы латын).

Kalganyn anyktagan eki tamgany uşul ereje çeçet. Kyrgyz kirillitsasynda bir `к` jana bir `г` bar, oşonduktan Jany-Latyn bir `k` jana bir `g` tamgasyn saktaít, `q` da, `ğ` da jok: alardy bölüü üçün kaísy sözdör kirme ekenin bilüü kerek (*kosmos*, *qosmos* emes). Bir gana `k` bolgondo *кы* menen *ки* muundaryn ündüü gana aíyrmalaít, oşonduktan `ы` üçün `i` menen çataşyp ketpeí turgan tamga kerek: al — `y`, baş tamgada, maída şriftte jana jönököí terüüdö `i` tamgasynan aíyrmasyn jogotkon çekitsiz `ı` emes. `y` eelengendikten, `й` özünçö tamga alat: `í` — belgisi bar `i`, `й` da belgisi bar `и` bolgondoí.

Kalgany taanyş: *Japarov* jana *Jalal-Abad* jazylyştaryndagydaí `ж` üçün `j`; türkçö, azerbaíjança, türkmönçö jazuudagydaí jana Jalpy türk alfavitindegideí `ö`, `ü`, `ç` jana `ş`; formasy `ң` tamgasyna okşoş `ŋ`; kirillitsadagydaí koş jazylgan sozulma ündüülör. Belgilerdi alyp salganda jönököí forma kelip çygat, any kaalagan klaviaturada terüügö bolot: *jaŋy* sözü *jany* bolup kalat.

Jany-Latyn mamlekettik alfavitti özgörtüügö çakyrbaít. Adamdar ansyz dele kün saíyn latynça terip jürüşöt, oşonduktan Jany-Latyn kyrgyz tilin latynda jazuunu dokumentteştirüü üçün bir jolun sunuştaít; al azyrtan ele iştep turat: töl kyrgyz sözdörün kirillitsaga tak kalybyna keltirgen eki taraptuu konverter, klaviatura jaíylmalary (je termek jaígaşuulary) jana ar bir alternativany çynygy tekstte synap körüügö bolo turgan synoo çöírösü.

## 1. Masele jana Jany-Latyn emneni sunuştaít

Mamlekettik deŋgeelde emne bolbosun (III bölük), rasmií emes latynça transliteratsiía muruntan ele kadimki körünüş. Kyrgyzça süílögöndör bildirüülördö, koddo, sotsialdyk tarmaktarda, soodada jana diaspora menen baílanyşta kün saíyn latynça jazyşat; mynda eç kandaí standart jok, ar türdüülük bir top: `ү` tamgasy *u*, *y*, *v* je *w* bolup, `ө` *o*, *oe* je al turgaí *8* tsifrasy bolup, `ж` *j*, *zh* je *dj* bolup, `ң` *n* je *ng* bolup jazylat, al emi ündüünün sozuluşu jazgan adamga jaraşa jalgyz tamga menen, koş tamga menen je aíagyna koşulgan *h* menen berilet. Uşul ar türdüülük — bul dolboor birinçi kezekte karaí turgan masele, antkeni mamlekettik saíasatka karabastan al bügün ele masele bolup turat.

**Jany-Latyn** eki nerseni sunuştaít:

1. Azyrtan ele terüügö jana okuuga ylaíyktalyp tüzülgön **orfografiía**: latyn `ö` jana `ü`; sedildüü `ç` jana `ş` şybyş ünsüzdörü; jumşak affrikat üçün `j`; velíardyk murun ünsüzü üçün `ŋ`; kuuş joon erinsiz ündüü üçün `y`; fonemalyk sozuluş üçün koş jazuu; bardyk pozitsiíada taŋdaí jarym ündüüsü üçün `í`.
2. Ar bir talaştuu tandoo kotorguç bolgon **synoo çöírösü**. Anda `y` orduna `ı` koíup, allofonduk `q` tamgasyn küígüzüp, ar bir `ж` tamgasyn `c` menen jazyp, şybyş ünsüzdördü digraftarga kotorup, `ŋ` orduna `ñ` koíup je kirillitsa `ө` jana kazakça `ұ` tamgalaryn saptyn içinde körsötüp, andan kiíin bir ele tekstti ar bir konfiguratsiíada okup, natyíjaga baa berüügö bolot.

Kalganyn eki mildettenme anyktaít. Orfografiía bir emes, **eki deŋgeelde** anyktalat: diakritikalyk belgileri bar **toluk forma** jana özgörtülbögön klaviaturalar üçün ASCII koddoosundagy **jönököí forma**; eköö birge anyktalat, oşonduktan biri da ekinçisi üçün aílanma jol emes (§19). Oşondoí ele orfografiía maşinalarga kançalyk kerek bolso, oşonçoluk toluk anyktalgan: jogotuulary körsötülgön teskeri aílandyruu, birdiktüü izdöö birdeílöö açkyçy jana irettöönü ylaíyktaştyruusu menen alfavittik tartip (§17, §18 jana B–C tirkemeler).

Baarynan murda, Jany-Latyn **kirillitsadan çygaryluuçu** bolup dolboorlongon. Kiíinki baíandalgandardyn köbün kandaídyr bir estetikalyk tabitten körö uşul çektöö tüşündüröt, anyn içinde avtor nöldön baştaganda başkaça kylçu tandoolordu da (§8).

### 1.1 Bul sistema emne üçün kerek

Jany-Latyn eki maksatta koldonuuga arnalgan, alar bir az başka-başka tarapka tartat:

- Kirillitsada muruntan bar tekstter üçün **transliteratsiía standarty**; al korpustarda, arhivderde, jer-suu attarynda jana maalymat bazalarynda adamdyn kiíligişüüsü jok iştöögö arnalgan.
- Kyrgyz tilin tüz latynça jazuu üçün **orfografiíaga talapker**: bügün rasmií emes türdö bolobu je keleçekte kaçandyr bir kezde rasmií türdö bolobu.

Eköö karama-karşy kelgen jerde transliteratsiía maksaty jeŋet. Sebebi praktikalyk: kirillitsada jazylgan muruntan bar seksen alty jyldyk tekstti avtomattyk türdö iştete albagan sunuş korpustan baş tartuudan baştalat. Oşonduktan `k` tamgasy `k`/`q` bolup bölünböí, birdiktüü boídon kalat (§8), kirme sözdördögü jarym ündüü başka bardyk jerde koldonulgan oşol ele `í` menen jazylat (§15.1), al emi teskeri aílandyruu orusça kirme sözdördön körö töl kyrgyz sözdörünö artykçylyk bere turgandaí anyktalgan (§18.1).

### 1.2 Jany-Latyn emneni suraít jana emneni surabaít

Jany-Latyn mamlekettin jaŋy alfavitke ötüşün jaktabaít. Al maseleni izildöögö jana muruntan bar rasmií emes jazuunu yraattuuraak kyluuga arnalgan kural. Mamlekettik masele elüü je jüz jyldan kiíin çeçilse da, je takyr çeçilbese da, dolboordun baary bir paídasy bar: milliondogon kyrgyzça süílögöndör bügün eç kandaí jalpy erejesiz latynça terip jatyşat, al emi dokumentteştirilgen erejenin boluşu kandaí gana jarlyk bolbosun, andan köz karandysyz baaluu.

Maselenin myndaí koíuluşu ritorikalyk etiíattanuu emes. Al dolboordun özün özgörtöt. Myízam kabyl aluunu közdögön sunuş okuu programmasyn, atkarylyşyn közömöldöönü jana kirme sözdördün tizmesin jürgüzö turgan mekemeni esepke ala alat, oşonduktan al sözdükkö köz karandylykty (§8), any menen koşo `q` tamgasyn da kötörö alat. Al emi kimdir biröö repozitoriídi açkan zamat işteşi kerek bolgon sunuş munu kötörö albaít: al çygaryluuçu, sözdüksüz jana muruntan bar jabduularda terilüüçü boluşu kerek.

---

## 2. Alfavitke kyskaça serep

Jany-Latyn alfavitinde 28 tamga bar, alar tömönkü tartipte jaígaşkan (§17):

**A B Ç D E F G H I Í J K L M N Ŋ O Ö P R S Ş T U Ü V Y Z**

**a b ç d e f g h i í j k l m n ŋ o ö p r s ş t u ü v y z**

**Belgilöölör.** Kursiv menen jazylyştar belgilenet. Tört burçtuu kaşaalar El aralyk fonetikalyk alfavit boíunça aítylyşty belgileít; anda [y] — `ü` tamgasynyn tybyşy, al emi [ɯ] — `ы` tamgasynyn tybyşy, oşonduktan *kyz* (кыз) jana *küz* (күз) sözünün aítylyşy bolgon [kyz] — eki başka söz. Kaşaanyn içindegi kirillitsa baştapky jazylyşty beret.

On tört tamga tüşündürmönü talap kylbaít: alardyn ar biri bardyk formada birdeí jazylat, misaly, *bala* (бала) jana *dos* (дос). Tablitsada kalgan jyíyrma eki kirillitsa tamgasy berilgen: ar birinin Jany-Latyn formasy, jönököí formasy jana misaly menen.

| Kirillitsa | Jany-Latyn | Jönököí forma | Misal | Karaŋyz |
| :---: | :---: | :---: | :--- | :---: |
| в, ф | v, f | v, f | *vagon* (вагон), *fabrika* (фабрика), kirme sözdördö | §20 |
| г | g | g | *gül* (гүл); joon ündüülüü sözdördögü uvulíardyk [ʁ], misaly, *aga* (ага) | §8 |
| е | e je íe | e, ie | *kel* (кел); *Íevropa* (Европа) | §15.1 |
| ё | ío | io | *koíon* (коён) | §16 |
| ж | j | j | *jol* (жол) | §11 |
| й | í | i | *toí* (той), *biíik* (бийик) | §10 |
| к | k | k | *kitep* (китеп); joon ündüülüü sözdördögü uvulíardyk [q], misaly, *kar* (кар) | §8 |
| ң | ŋ | n | *jaŋy* (жаңы) | §14 |
| ө | ö | o | *köl* (көл) | §12.2 |
| ү | ü | u | *kün* (күн) | §12.1 |
| х | h | h | *rahmat* (рахмат); orusça ülgüdögü *kh* emes | §20 |
| ц | ts | ts | *tsirk* (цирк) | §18.1 |
| ч | ç | c | *çaí* (чай) | §13 |
| ш | ş | s | *şaar* (шаар) | §13 |
| щ | ş | s | *borş* (борщ) | §13 |
| ъ | jarym ündüügö siŋirilet | — | *obíekt* (объект) | §16 |
| ы | y | y | *yr* (ыр) | §9 |
| ь | jarym ündüügö siŋirilet je muundun aíagynda tüşüp kalat | — | *semía* (семья), *aprel* (апрель) | §16 |
| э | e | e | *el* (эл) | §15 |
| ю | íu | iu | *aíuu* (аюу) | §16 |
| я | ía | ia | *saíakat* (саякат) | §16 |

Sozulma ündüülör kirillitsadagydaí koş jazylat: *took* (тоок), *küü* (күү). Jönököí forma bardyk belgilerdi alyp salat jana başka eç nerseni özgörtpöít (§19).

Baílanyştuu tekstte:

> **Kirillitsa.** Жаңы жылдын биринчи күнү тоого чыгып, бийик чокудан шаарды көрдүк. Үйгө кайтканда чай ичип, эс алдык.
>
> **Jany-Latyn.** Jaŋy jyldyn birinçi künü toogo çygyp, biíik çokudan şaardy kördük. Üígö kaítkanda çaí içip, es aldyk.
>
> **Jönököí forma.** Jany jyldyn birinci kunu toogo cygyp, biiik cokudan saardy korduk. Uigo kaitkanda cai icip, es aldyk.
>
>

---

## 3. Anyn negizindegi ereje: dolboorloo printsipteri

| Printsip | Maksaty | Paídasy |
| :--- | :--- | :--- |
| **1. Kirillitsadan çygaryluuçuluk** | Ar bir Jany-Latyn formasy söz tizmesi jok, kirillitsadan ereje boíunça eseptelet. | Muruntan bar korpus avtomattyk türdö aílandyrylat; bir da söz adamdyn çeçimin talap kylbaít. |
| **2. Kirgizüü ergonomikasy** | Standarttuu ANSI/ISO klaviaturalarynda tez terüü. | «Ölük» baskyçtar, modifikator katmarlary je uzak basuular az. |
| **3. Fonologiíalyk ünömdüülük** | Aldyn ala bilüügö bolo turgan allofondor üçün özünçö tamgalar jok. | Tamgalar azyraak, fonemalyk taktyk jogolboít. |
| **4. Tipografiíalyk jana eseptöö turuktuulugu** | Bir jazuu, standarttuu kod çekitteri, daíar kurama formalar. | Sözdün ortosunda başka şriftke ötüü jok, ar başka jazuulardyn aralaş irettelişi jok, baş/kiçine tamgaga aílandyruu aldyn ala belgilüü. |
| **5. Ataíyn dolboorlongon eki deŋgeel** | Diakritikaluu toluk forma jana jönököí ASCII formasy, eköö birge anyktalat. | Basma tekstte jana özgörtülbögön kaalagan klaviaturada okuluşu. |

1-printsip — kalgan printsipter aga karap yŋgaílaştyrylgan çektöö. 5-printsipti §19 süröttöít; bul — sistemanyn kemçilik dep jaŋylyş kabyl alynyşy eŋ oŋoí bölügü.

Bul çektöönü alternativdüü tamga Jany-Latyn tamgasynan aíyrmalana turgan eki jol arkyluu körüü eŋ oŋoí. *Almaştyruu* kirillitsa tamgasyn al kezdeşken bardyk jerde başka formadagy tamga menen jazat: `ң` üçün `ñ`, `ы` üçün `ı`, `ч` üçün `ch`. Konverter almaştyruunu öz aldynça koldono alat; synoo çöírösü alardyn köbün sunuştaít. *Bölüü* bir kirillitsa tamgasyn sözgö jaraşa eki latyn tamgasyna aílandyrat: `к` — `k` je `q`, `г` — `g` je `ğ`, `ж` — `c` je `j` bolup kalat. Kyrgyz kirillitsasy kaísy sözdör kirme ekenin belgilebeít, oşonduktan bölüünü any belgilegen söz tizmesi menen gana tuura koldonuuga bolot; jalaŋ ereje menen koldonulganda al *космос* sözün *qosmos* dep jazat. §8 munu sözdükkö köz karandylyk dep ataít.

Jany-Latyn jazylyşynda bir da bölüü jok. Oşonduktan konverter jazgan tekst tuura Jany-Latyn bolot, koldo oŋdolgon ekinçi nuskany jürgüzüünün keregi jok. Uşul ele printsip `q`, `ğ` jana `c` emne üçün jok ekenin (§8, §11), oşondoí ele baaloodogu üç tamga — `ä`, `x` jana `w` — bölüü bolgonduktan, alardy latynça tüz jazgan adam koldono algany menen, konverter alardy eç kaçan çygarbaí turganyn tüşündüröt (§20). Sistemadagy jalgyz tizme teskeri bagytta işteít: bul — kirillitsadagy jazylyşyn ereje menen kalybyna keltirüügö bolboí turgan kirme sözdördün mildettüü emes toptomu, al kirillitsaga kaíra aílandyrganda gana paídalanylat (§18.2).

---

## 4. Kalganyn anyktagan tamgalar

**Bir `k` jana bir `g`.** Kyrgyz tilinde uvulíardyk [q] jana [ʁ] — /k/ jana /g/ fonemalarynyn sözdün ündüülörünö karap aldyn ala bilüügö bolo turgan pozitsiíalyk varianttary; kyrgyz kirillitsasy alardy eç kaçan özünçö jazgan emes. `q` jana `ğ` tamgalaryn jazuu bölüü bolmok: *кар* sözün *qar* kylgan ündüü erejesi *космос* kirme sözün da *qosmos* kylat, any söz tizmesi gana toktoto alat. Avtordun özü fonologiíalyk jana taryhyí negizder boíunça `q` tamgasyn artyk köröt; Jany-Latyn bir `k` jana bir `g` tamgasyn saktaít, antkeni al çygaryluuçuluk menen anyktalat (§8).

**`ы` üçün `y`.** Bir gana `k` bolgondo *кы* menen *ки* muundaryn ündüü gana aíyrmalaít, oşonduktan `ы` üçün `i` menen çataşyp ketpeí turgan tamga kerek. Çekitsiz `ı` tamgasy `i` tamgasynan bir çekit menen aíyrmalanat: maída şriftte al çekit jogolot, türkçö jana azerbaíjança lokaldardan tyşkary baş tamgaga aílandyrganda eki tamga birdeí bolup kalat (*kırgız* baş tamga menen `KIRGIZ` bolot), al emi jönököí forma menen izdöö birdeílöösü any alyp salat. `y` bardyk jerde aíyrmalanyp turat, oşondoí ele al ölkönün anglisçe atalyşynda `ы` üçün muruntan koldonulup kelgen tamga (§9).

**`й` üçün `í`.** `y` tamgasy `ы` üçün koldonulgandyktan, jarym ündüügö özünçö tamga kerek. Any da `y` menen jazuu *тыйын* sözün `tyyyn` kylyp biriktirip salmak, al emi jönököí `i` *бийик* sözün `biiik` ştrih-koduna aílandyrmak. `í` — belgisi bar `i`, `й` da belgisi bar `и` bolgondoí; al bardyk pozitsiíada birdeí jazylat: *toí*, *tyíyn*, *biíik* (§10).

**`ж` üçün `j`.** Kyrgyz kirillitsasy töl sözdördögü [dʒ] affrikatyn da, kirme sözdördögü [ʒ] tybyşyn da bir ele `ж` menen jazat, oşonduktan eki emes, bir ele tamga kerek. Jany-Latyn rasmií romanizatsiíada jana pasporttordo `ж` üçün muruntan koldonulup kelgen `j` tamgasyn alat (*Japarov*, *Jalal-Abad*); CTA sunuştagan bölüü — töl sözdör üçün `c`, kirme sözdör üçün `j` — kaíradan söz tizmesin talap kylmak (§11).

---

## 5. Emne beret jana emnege turat

### 5.1 Emne beret

- **Oŋdoo etaby jok.** Kirillitsadagy kaalagan kyrgyzça tekst, arhivden tartyp jer-suu attarynyn reíestrine çeíin, bir ötüüdö aílandyrylat; natyíja — tuura Jany-Latyn, korrekturany kütkön karalama emes (§3).
- **Töl kyrgyz sözdörü kaíra aílandyrganda tak kalybyna kelet.** Kirillitsaga kaíra aílandyrganda ar bir töl söz kalybyna kelet; kee bir kirme sözdördün jazylyşy gana jönököílötülöt (§18.1). Oşonduktan latyn jazuusun jana kirillitsany janaşa koldonuuga bolot, al emi köp tildüü ölkögö bul kandaí bolgon kündö da kerek (§22.6).
- **Kyrgyz okurmany boljoldop bile turgan tamgalar.** *Japarov* jana *Jalal-Abad* jazylyştaryndagydaí `j`; ölkönün anglisçe atalyşyndagydaí `y`; türkçö, azerbaíjança, türkmönçö jazuudagydaí jana CTA alfavitindegideí `ö`, `ü`, `ç` jana `ş`; `й` menen `ң` tamgalaryn eske salgan `í` jana `ŋ`; kirillitsadagydaí koş jazylgan sozulma ündüülör (§22.4).
- **Eç kim okutula elekte ele jaŋylyş okuu azyraak.** Körnöktü körgön okurman negizgi tamgalardy muruntan bilgen maanileri menen okuít. `ÇYGUU` dep jazylgan *Чыгуу* sözü bir tamga menen — `ч` üçün `C` — adaştyryşy mümkün; CTA ülgüsündögü `ÇIĞUU` jazylyşy ekinçisin — `ы` üçün `I` — koşot, al emi kirillitsadagy maanileri menen okulganda koomduk jerlerdegi körnöktördö eŋ köp kezdeşken sözdördün biri uíatsyz sözgö aílanat (§22.4).
- **Programmalyk kamsyzdoodo koopsuz.** Baş tamgalar sözdü eç kaçan özgörtpöít (`KYRGYZ` eç kaçan `KIRGIZ` bolup kala albaít), izdöödö je belgilöödö bir da apostrof sözdü bölböít (§16), al emi jönököí forma izdöö açkyçy da bolot, oşonduktan *jany* suramy *jaŋy* sözün tabat (§19, B tirkeme).
- **Tabuu oŋoíuraak — boljoldoo katary.** *kylym* jana *jaŋy* syíaktuu jazylyştar başka bir da tilge taandyk emes, al emi CTA ülgüsündögü *qılım* oşondoí ele azerbaíjan tilindegi etiştin bir formasy, *canım* (жаным) bolso türkçö söz (§22.2). Bul tandoolordun sebebi katary emes, tekşerile turgan boljoldoo katary sunuştalat (§23.2).
- **Azyrtan ele koldonuuga bolot.** Mamlekettin çeçimi kerek emes; konverter, klaviatura jaíylmalary jana synoo çöírösü azyrtan ele iştep turat (§7, D tirkeme).

### 5.2 Belgilüü çektöölör

- **Latyn→kirillitsa aílandyruusu orusça kirme sözdördö jogotuuga alyp kelet.** Töl kyrgyz leksikasy kaíra aílandyrganda tak kalybyna kelet; kirme sözdörgö gana tiíeşelüü aíyrmaçylyktar (`ц`, `щ`, `ё` menen `йо` aíyrmasy, `ъ`, `ь`) kaítarym aílandyruuda saktalbaít. Bul ataíyn uşundaí dolboorlongon, any §18.1 tak anyktaít.
- **Jönököí forma bir taraptuu.** ASCII menen jazylgan tekstti toluk formaga je kirillitsaga mehanikalyk türdö kalybyna keltirüügö bolboít (§19).
- **`ŋ` telefondordo birdeí jetkiliktüü emes.** Any US lokalyndagy Android klaviaturasynyn uzak basuu meníusunan tabuuga bolot (avtor tekşergen); iOS kandaí işteşi tekşerile elek. Al jok jerde jönököí forma any `n` dep jazat (§19); `ñ` salyştyruu jöndöösü katary jetkiliktüü (§14).
- **Dialektter jarym-jartylaí kamtylgan.** Üç keŋeítilgen tamga (`ä`, `x`, `w`) baaloo üçün sunuştalat, alardyn biri da Jany-Latyn kuramyna kirbeít (§20); başka dialekttik özgöçölüktör takyr çagyldyrylgan emes.
- **Okutuu metodikasy azyrynça jok.** Bul jerdegi eç nerse okuuçular menen, klassta je kol jazmada synalgan emes.

---

## 6. Başka sistemalar menen salyştyruu

Jany-Latyn Kyrgyzstan geografiíalyk atalyştar üçün koldongon BGN/PCGN romanizatsiíasy menen taanyluuçuluk üçün eŋ maanilüü tamgalar boíunça — `ж` üçün `j`, oşondoí ele `ö` jana `ü` — dal kelet, birok al çet eldik okurmandar üçün transkriptsiíaloogo emes, kyrgyzça süílögöndör jazyşyna arnalyp tüzülgön (§21.1). Al 2024-jyly Bakuda makuldaşylgan Jalpy türk alfaviti menen `ö`, `ü`, `ç` jana `ş` tamgalary boíunça dal kelet, al emi alty tamga boíunça andan aíyrmalanat, alardyn ar biri II bölüktö jüíölöngön (§21.2). Oşol ele tört tamga jana `ы` üçün `y` Syrtbaí Musaíevdin 28 tamgaluu dolboorunda da bar; al dolboor Tynystanovdun 1928-jylky alfavitin jandandyrat: anda `k`/`q` bölüüsü kaíra kirgizilet, `ж` — `c` menen jazylat, al emi velíardyk murun ünsüzü `ņ` menen belgilenet (§21.3).

| Kirillitsa | BGN/PCGN | CTA | **Jany-Latyn** |
| :---: | :---: | :---: | :---: |
| ж | j | c | **j** |
| й | y | y | **í** |
| ы | y | ı | **y** |
| ң | ng | ñ | **ŋ** |
| ө | ö | ö | **ö** |
| ү | ü | ü | **ü** |
| ч | ch | ç | **ç** |
| ш | sh | ş | **ş** |
| х | kh | h | **h** |

(ALA-LC jana ISO 9 sistemalary koşo berilgen §21.1 tablitsasynan kyskartylyp alyndy.)

Bul makalada «Jany-Latyn» daíyma sunuştalgan alfavitti bildiret. Synoo çöírösü körsötö algan başka bardyk konfiguratsiíalar, anyn içinde `ŋ` orduna `ñ` koíuu syíaktuu jalgyz almaştyruu da, *salyştyruu jöndöösü* bolup sanalat: bul — Jany-Latyn menen bir ele tekstte salyştyrylyp baalana turgan nerse, anyn varianty emes. Makalada üç salyştyruu jöndöösü kaítalanyp kelet, alardyn ar biri Jany-Latyn jazuusunan bir kadam alysyraak. *аңкыгый жигит* söz aíkaşy alar özgörtkön bardyk tamgalardy kamtyít:

| Jöndöö | Jany-Latyn jazuusunan aíyrmasy | *аңкыгый жигит* | Söz tizmesi kerekpi? |
| :--- | :--- | :--- | :---: |
| **Jany-Latyn** | — | **aŋkygyí jigit** | Jok |
| q+ğ | joon ündüülüü sözdördö `к` üçün `q`, `г` üçün `ğ` | aŋqyğyí jigit | Ooba |
| q+ğ+ı | oşondoí ele `ы` üçün `ı`, `й` jarym ündüüsü üçün `y` | aŋqığıy jigit | Ooba |
| CTA ülgüsündö (q+ğ+ı+c+ñ) | oşondoí ele töl `ж` üçün `c`, `ң` üçün `ñ` | añqığıy cigit | Ooba |

Akyrky mamy §3 jüíösün bir sapka batyrat: Jany-Latyn jazuusunan başka ar bir jöndöödö bölüü bar, al emi bölüü söz tizmesi menen gana tuura jazylat. *Жигит* içke ündöştüktögü söz, oşonduktan anyn `г` tamgasy `ğ` jazylgan jerde da `g` boídon kalat, al emi `и` tamgasy q+ğ+ı sabyndagy `ı` tamgasynyn janynda `i` boídon kalat. Ar bir jöndöödögü çynygy sözdördü jana baílanyştuu tekstti §21.2 körsötöt, al emi alfavitterdi janaşa §17.3 beret.

---

## 7. Synoo çöírösü

Koldonuuçunun tarabynda iştegen tirkeme bir basuu menen tandaluuçu daíar jöndöölördü — negizgi Jany-Latyn variantyn jana any menen salyştyryluuçu CTA ülgüsündögü jöndöönü (`ы` üçün `ı`, jarym ündüü üçün `y`, `ж` üçün `c`, `q` jana `ğ`, oşondoí ele `ң` üçün `ñ`) — sunuştaít, alar menen katar II bölüktö jüíölöngön ar bir özgörmö üçün tandaluuçu parametrler da bar:

| Özgörmö | Varianttar | Jüíölöngön bölüm |
| :--- | :--- | :---: |
| Içke erindik ündüülör | `ö/ü` (Jany-Latyn), `ө/ü`, `ө/ұ`, `ө/ū` | §12.1, §12.2 |
| Şybyş ünsüzdör | `ç/ş` (Jany-Latyn), `ch/sh` | §13 |
| `ж` affrikaty | `j` (Jany-Latyn), `c` — CTA sunuştagan maani; kirme sözdördö mehanikalyk türdö jazylat | §11 |
| Kirme sözdördögü `ъ`/`ь` belgileri | jarym ündüügö siŋirilet (Jany-Latyn), apostrof | §16 |
| Velíardyk murun ünsüzü | `ŋ` (Jany-Latyn), `ñ` | §14 |
| Jarym ündüü | `í` (Jany-Latyn); belgisi bar alternativalar katary `ĭ` jana `ĩ`; jönököí `i` — çetke kagylgan ştrih-kod dal keltirüüsü; `y` | §10, §9 |
| Joon erinsiz ündüü | `y` (Jany-Latyn), `ı` | §9 |
| Uvulíardyk jarylma | birdiktüü `k` (Jany-Latyn), allofonduk `q` | §8 |
| Uvulíardyk jylçykçyl | birdiktüü `g` (Jany-Latyn), allofonduk `ğ` | §8 |
| `х` üçün tamga | `h` (Jany-Latyn), `x` — velíardyk maanisin jakşyraak dep eseptegen okurmandar üçün ar bir `х` tamgasy `x` menen jazylat; bul tömöndögü bölüü emes | §20 |
| ASCII rezervdik türü | belgini alyp salyp `c/s` (Jany-Latyn), `ch/sh` dep keŋeítüü | §19 |
| Keŋeítilgen tamgalar | öçük (Jany-Latyn); `ä`, `x`/`h`, `w` ar biri özünçö tandalat — jazuu rejiminin tamgalary, kirillitsadan latynga aílandyruuda eç kaçan çykpaít | §20 |

Janaşa salyştyruu kuraly kaalagan aíkalyşty çynygy tekst menen synaít.

Yŋgaíluuluk üçün kee bir parametrler öz ara baílanyştyrylgan. `ı` tandalganda `q`, `ğ` jana `y` jarym ündüüsü da küíöt: `ы` tamgasy `ı` menen jazylganda `y` boş kalat, al emi `í` saktalsa, `ı`, `i` jana `í` belgileri menen gana aíyrmalangan üç tamga katary janaşa turmak (§17.3). `q` tandalganda `ğ` da koşo kelet, al emi kaíra artka kotorgondo ar bir baílanyş jokko çygat. Baílanyştar parametrlerge baştapky maani gana beret, oşonduktan `k` menen `ı`, `ğ` tamgasy jok `q` jana `í` jarym ündüüsü menen `ı` aíkalyştarynyn baaryn kiíin parametrdi özgörtüp tandoogo bolot; jalgyz çektöö — `y` jarym ündüüsü `ы` tamgasy `ı` menen jazylyp turganda gana sunuştalat, antkeni antpese eköö kagylyşyp kalmak. Mehanizmdin özü kaalagan aíkalyşty kabyl alat. Synoo çöírösü oşondoí ele `ĩ` jarym ündüüsü `ñ` menen aíkalyşkanda, aga toskool bolboston, eskertüü beret, antkeni myndaída bir ele tilda eki başka mildet atkarmak. SPEC.md faílynyn 7-bölümü bul baílanyştardy toluk sanap beret.

Kotorguçtar birdeí tuura redaktsiíalyk stilderdin meníusu emes. Alardyn ar biri karşy misaldy süröttöö üçün emes, any jaratyp körsötüü üçün kirgizilgen: `q` *kosmos* sözün *qosmos* kylat, `ı` baş tamgaga aílandyruu natyíjaga emne kylaryn körsötöt, al emi kirillitsa `ө` tamgasyn küígüzüp, natyíjany attardyn tizmesi katary irettöögö bolot.

Dolboor kabyl aluuga emes, tögüngö çygaruuga çakyrgan sunuş katary jürgüzülöt: ar bir talaştuu tandoo işke aşyrylgan, büt baştapky kod açyk, saítta jaígaştyrylgan synoo çöírösü okurmandar kaísy konfiguratsiíalardy tandaganyn jazyp alat, oşondo tandoolordun bölüştürülüşün jüíölördün janyna jaryíaloogo bolot, al emi mehanizm töl kyrgyz sözün buzgan, kaítalap körsötüügö bolo turgan uçur makuldukka karaganda köbüröök salmakka ee (§24).

---

## Avtor jönündö

Avtor — jaşoo jönündögü ilimder tarmagyndagy adis jana öz aldynça üíröngön programmist; al universitette bioinformatika jana filologiía boíunça kurstardy okugan, otuz jyldan beri kyrgyzça ene tili katary süílöít, oşondoí ele anglis jana orus tilderin erkin bilet. Bul köz karaş dokumentke eki jagynan taasir etet. Kyrgyzça emne tabigyí okulary, emne emne menen kagylyşary jana adamdar çynynda emne tereri tuuraluu pikirler — ene tilinde süílögön adamdyn pikirleri. Alar dal uşundaí pikir katary sunuştalat. Tokenizatorlor, irettöö jana şrifttik körsötüü tuuraluu pikirler — sistemalardyn dokumentteştirilgen işteşine taíangan injenerdin oí jügürtüüsü; alar ölçöö emes, boljoldoo bolgon jerlerde boljoldoo dep belgilenet, al emi §23 alardy synoo çöírösü tekşerüü üçün tüzülgön nerseler katary sanap beret.

---

# II bölük — Ar bir tamganyn jüíösü

## 8. Bir `k` jana bir `g`: singarmoniíalyk allofoniía

Bir katar türk tilderinin orfografiíalary uvulíardyk jarylma [q] jana uvulíardyk jylçykçyl [ʁ] tybyştary üçün özünçö tamgalardy koldonot. Birok kyrgyz tilinde bular sözdün ündüülörünö karap aldyn ala bilüügö bolo turgan pozitsiíalyk allofondor:

| Ündöştük çöírösü | Ündüülör | Fonema | Aítylyşy | Grafema | Misaldar |
| :--- | :--- | :---: | :--- | :---: | :--- |
| Joon | a, o, u, y | /k/ | Uvulíardyk jarylma [q] | **k** | *kar* (кар) [qar], *kyz* (кыз) [qɯz] |
| Joon | a, o, u, y | /g/ | Uvulíardyk jylçykçyl [ʁ] | **g** | *aga* (ага) [aʁa], *kyrgyz* (кыргыз) [qɯrʁɯz] |
| Içke | e, i, ö, ü | /k/ | Velíardyk jarylma [k] | **k** | *kel* (кел) [kel], *küz* (күз) [kyz] |
| Içke | e, i, ö, ü | /g/ | Velíardyk jarylma [g] | **g** | *gül* (гүл) [gyl], *egemen* (эгемен) [egemen] |

Kyrgyzça süílögön adam *kar* sözün okuganda [q] tybyşyn özünön-özü aítat; al jerde içke [k] tybyşyn aítuu tildin fonotaktikasyn buzmak. Eköönü özünçö jazuu süílööçülör ansyz dele koldongon erejeni jazuuda talap kylmak. Türkçö jazuu da uşul negizde `k` jana `g` boíunça okşoş tandoo kylgan, birok buga baílanyştuu bir aíyrmaçylyk üçün `ğ` tamgasyn saktap kalgan.

Avtordun özü `q` tamgasyn artyk köröt. Fonologiíalyk jaktan al çyndykka jakynyraak tamga, türk tildüü jana arabça jazgan düínönün köpçülügü dal uşul tamgany tandaít, al emi tak kyrgyz tilinin özündö anyn çynygy taryhyí salmagy da bar. Oşogo karabastan Jany-Latyn birdiktüü `k` jana `g` koldonot, anyn sebebi — 1-printsip, `q` tuura emes degen işenim emes.

Eger `q` jazylsa, anyn jumşak tügöíü da koşo kelet: *egemen* sözündö içke [g], *kagyluu* sözündö joon [ʁ] aítylat; katkalaŋ juptu bölgön ar bir sistema jumşak juptu da bölöt. Tynystanovdun 1928-jylky alfavitinde `k` jana `g` menen katar `q` jana `ƣ` bolgon [[4]](#ref4), CTA alfavitinde `q` jana `ğ` bar [[8]](#ref8), al emi 2021-jylky kazak alfaviti `ғ` üçün brevelüü ğ tamgasyn koldonot [[5]](#ref5). `ğ` tamgasy jok `q` sistemasy mümkün, antkeni ündüülör `k` tamgasyn kandaí aldyn ala anyktasa, `g` tamgasyn da oşondoí anyktaít, birok any aktaí turgan jüíö jok: `qosmos` formasyn jaratkan ereje `ğaz`, `ğaloş`, `mağazin` jana `proğramma` formalaryn da jaratat, jana eköönün teŋ aldyn kirme sözdör sözdügü gana toso alat. Eki tamga kaísy katmarga jük salary menen gana aíyrmalanat. `q` — ASCII baskyçy, al jönököí formada da saktalat; `ğ` diakritika menen jazylat jana al jerde kaíra `g` tamgasyna aílanat. **Oşonduktan bul sistemanyn pozitsiíasy myndaí: `q` tamgasy sözsüz `ğ` tamgasyn da talap kylat.** Jany-Latyn eköönön teŋ baş tartat, al emi synoo çöírösü asimmetriíaluu konfiguratsiíany da karap körüü mümkün boluş üçün alardy öz-özünçö kotorguç katary saktaít.

Jany-Latyn jazuusunun birdiktüü `k` jana `g` tamgalarynda kalyşyna üç jüíö negiz bolot:

- **Kirillitsadan çygaryluuçuluk.** Kyrgyz kirillitsasynda özünçö `қ` tamgasy eç kaçan bolgon emes [[4]](#ref4), oşonduktan kaísy sözdör kirme ekenin koşo bilbegen eç bir ereje baştapky tekstten `q` tamgasyn kalybyna keltire albaít. Taryhyí bir níuansty belgileí ketüü kerek: tamgalardy biriktirüü Tynystanovdun işi bolgon emes. Anyn arab jazuusundagy reformasy da, latyn alfaviti da bul eki tybyşty aíyrmalagan [[4]](#ref4). Jalgyz `К` tamgasy kirillitsa menen koşo 1940-jyly, al repressiía uçurunda ölüm jazasyna tartylgandan eki jyl kiíin kelgen. Al çeçimdi kim jana kandaí sebep menen kabyl albasyn, oşondon berki seksen alty jyldyk sabattuuluk uşul negizde kurulup kelet.
- **Kirme sözdör.** Azyrky kyrgyz tili *kosmos*, *karta*, *bank*, *respublika* sözdörün özdöştüröt; alardyn baarynda jönököí íevropalyk [k] aítylat, [q] eç kaçan aítylbaít. Ündöştük erejesi alardy joon ündöştüktögü töl uŋgulardan aíyrmalaí albaít: al `qosmos`, `parqta` formalaryn, oşondoí ele tuura `Respublikasy` orduna `Respubliqası` syíaktuu aralaş ündöştüktögü gibridderdi jaratat. Daíyma jaŋylanyp turgan kirme sözdör sözdügünön başka taza çeçim jok. Munu **sözdükkö köz karandylyk** dep ataíly: kaísy sözdör kirme ekenin bilmeíinçe koldonuuga mümkünçülügü jok jazuu erejesi. Artynda institutu jana bíudjeti bar, mamleket koldogon standart bul köz karandylykty kötörö alat. Arhivdi adam katyşpaí iştetişi kerek bolgon konverter kötörö albaít.
- **Ünömdüülük.** Üírötüügö jana klaviaturadan taap basuuga eki tamga azyraak.

Eŋ küçtüü karşy jüíö teskeri bagytka işteít. Kirme sözdör joon ündüülüü sözdördö velíardyk [k] tybyşyn saktagandyktan, azyrky oozeki kyrgyz tilinde [k] menen [q] emi oppozitsiía tüzöt (*kosmos* menen *koş*) dep aítuuga bolot, bul bolso allofondun fonemaga aílanyşynyn klassikalyk körünüşü. Eger bul taldoo tuura bolso, adamdar özdörü jaza turgan, maşina arkyluu çygarylbagan keleçektegi standart `q` tamgasyn kabyl alyşy kerek. Jer-suu attary munu ogo beter kurçutat: *Каракол* menen *Каракөл* — eki başka şaar, alar `Karakol` jana `Karaköl` türündö bir tamga menen, al emi `Qaraqol` jana `Qaraköl` türündö eki tamga menen aíyrmalanat. Jany-Latyn jazuusunun pozitsiíasy «q tuura emes» degenden taryraak: `q` tamgasyn sözdüksüz kirillitsadan çygaruuga bolboít, al emi bul sistema çygaryluuçuluk menen anyktalat.

Ündöştük erejesinin taktygy da al okugan ündüülördün taktygynan aşpaít. Kirillitsa joon ündüünü da, anyn içkertilgen variantyn da bir ele `а` tamgasy menen jazat, oşonduktan `q` rejimi *äkä* menen *aqa* sözdörün ajyrata albaít; erejege jetişpeí turgan nerseni keŋeítilgen `ä` tamgasy toluktaít (§20).

Synoo çöírösündögü `q` kotorguçu munu jön gana yrastoo üçün emes, tekşerip körüü üçün tüzülgön. Azyrky jaŋylyktardyn je sotsialdyk tarmaktardyn tekstine koldonulganda, `q` rejimi kirme sözdördün buzuluşun bir abzatstyn içinde ele ekranga çygarat.

---

## 9. `ы` üçün `y`: joon erinsiz ündüü

CTA jana türkçö jazuu `ы` [ɯ] tybyşyn çekitsiz **`ı`** menen jazat [[8]](#ref8). Jany-Latyn **`y`** jazat, al emi synoo çöírösü eköönü almaştyryp körüügö mümkündük beret. Myndaí almaştyruu biri-birin küçötkön eki maseleni açykka çygarat.

Birinçisi — baş/kiçine tamgaga aílandyruu. Çekitsiz `ı` jana çekittüü `i` — eki başka baş tamganyn kiçine formalary, alardy tuura dal keltirüü üçün lokaldy eske algan baş/kiçine tamgaga aílandyruu kerek; türkçö jana azerbaíjança dal keltirüülör Íunikod simvoldorunun bazasynda dokumentteştirilgen özgöçö uçur [[11]](#ref11). Türkçö jazuu buga ekinçi baş tamga menen joop beret: `ı` — `I`, al emi `i` — `İ` bolot. Bul çynjyrdagy ar bir sistema oşol dal keltirüülördü koldongondo gana jana okurman al tamgany bilgende gana tuura işteít. Türkçö üírönbögön kyrgyz okurmanynyn `İ` bar ekenin bilüügö eç kandaí sebebi jok, oşonduktan baş tamgaga tuura aílandyrylgan `KIRGIZ` dagy ele *КИРГИЗ* bolup okulat: aíyrma koddoodo saktalyp, okuuda jogolot. Көл da uşul ele nerseni baş tamgalar menen gana jazylgan misalsyz körsötöt: *Ысык-Көл* `Isıq-Köl` dep jazylat, al emi any baştagan baş tamgany oşol lokaldardan tyşkarky ar bir adam çekittüü `i` katary okuít.

`tr_TR` je `az_AZ` lokalynan tyşkary, başkaça aítkanda, köpçülük maalymat bazalarynda, indeksterde jana iştetüü çöírölöründö, aíyrma koddoodo da jogolot, antkeni eki tamga teŋ jönököí `I` bolup kalat. Oşondo *КЫРГЫЗ* jana *КИРГИЗ* bir ele sap bolup kelet, al emi `kırgız` baş tamgaga aílandyrylganda `KIRGIZ` bolot — Kyrgyzstan artta kaltyrgan ekzonim. Oşonduktan çekitsiz konfiguratsiía tekst kaída barbasyn, bardyk jerde lokalga ylaíyk baş/kiçine tamgaga tuura aílandyruuga köz karandylykty koşot. Al emi latyn `y` tamgasynda myndaí köz karandylyk jok: `Y` jana `I` bardyk lokaldarda jana baş/kiçine tamgaga aílandyruuçu bardyk funktsiíalarda eki başka baş tamga, al emi mamlekettin 1991-jyldan beri kelişimderde, pasporttordo jana diplomatiíada koldonulup kelgen özünün anglisçe atalyşy — *Kyrgyz Republic*.

Ekinçisi — aíyrmanyn işenimsizdigi. `y` jana `i` kandaí gana ölçömdö bolbosun jaŋylyştyrbaít, oşonduktan *kyna* jana *kina* eç kaçan kagylyşpaít. Birok çekitsiz `ı` koldonulganda uşul ele jup bir çekit menen aíyrmalanat, al emi çekit maída şriftte, kol jazmada jana ajyratymduulugu tömön ekrandarda buzulat. Toluk formadan tömönkü deŋgeelde al taptakyr jogolot: jönököí forma da, izdöö birdeílöösü da `ı` tamgasyn `i` kylat, natyíjada *kına* jana *kina* künümdük jazuuda bir ele sap, indekste bir ele açkyç bolup kalat. Al emi `y` bolgondo aíyrma bardyk jerde saktalat. Ündüü aíyrmany alyp jürö albaí kalgan soŋ, any ünsüz alyp jürüşü kerek, oşonduktan synoo çöírösünün `ı` rejimi allofonduk `q` tamgasyn küígüzöt. Demek, `ı` tamgasyn kabyl aluunun baasy bir ele tamga emes: al `q` maselesin (§8) kaíra açat.

Musaíevdin sunuşu uşul ele tamgaga başka jaktan kelip (§21.3), uşunu menen özünün taryhyí negizinen çetteít: Tynystanov `ы` tamgasyn `ь` menen jazyp, `y` tamgasyn `ү` üçün koldongon [[4]](#ref4).

---

## 10. `й` üçün `í`: taŋdaí jarym ündüüsü

`и` [i] menen `й` [j] tybyştarynyn eköönü teŋ jönököí `i` menen jazuu ştrih-koddu jaratat: *бийик* → `biiik`, *кийим* → `kiiim`, *кийин* → `kiiin`. Katary menen turgan üç je tört tik syzykty taldap okuu kyíyn, alardy sozulma ündüüdön aíyrmaloo mümkün emes. Synoo çöírösü bul dal keltirüünü talap boíunça körsötöt (§7), oşonduktan bul yrastoogo üç sözdün negizinde emes, çynygy teksttin bir baragynyn negizinde baa berüügö bolot.

Jany-Latyn jazuusundagy jarym ündüü bardyk pozitsiíada **`í / Í`** bolot: *aí*, *toí*, *tyíyn*, *biíik*, *kiíim*. Munu tört jüíö koldoít.

1. **Jarym ündüügö özünçö tamga — argasyz zaryldyk, tandoo emes.** CTA jarym ündüünü `y` menen jazat; al munu kötörö alat, antkeni joon erinsiz ündüünü çekitsiz `ı` tamgasyna ötköröt [[8]](#ref8). Jany-Latyn `y` tamgasyn oşol ündüügö beret (§9), oşonduktan eki mildet bir tamgada birige albaít. Eger birikse, töl sözdördögü ündüü menen jarym ündüünün udaalaştygy koşulup ketmek: *тыйын* — `tyyyn`, *кыйык* — `kyyyk`, *айыл* — `ayyl`. Bul — bir ündüü solgo jylyp kaíra kezdeşken, oşol ele okuluş kemçilik. Oşol üçün ataíyn tamga zaryl.

2. **Akut başka jerdegi maanisine karap emes, `й` tamgasy menen baílanyşyna karap tandalgan.** `й` — üstündö belgisi bar `и`; `í` — üstündö belgisi bar `i`. Kyrgyz kirillitsasyn bilgen okurman bul juptu muruntan ele tekteş, birok özünçö tamgalar katary kabyl alat, al emi `i`/`í` oşol baílanyşty buzbaí ötköröt.

3. **Al sözdün uŋgularyn saktaít.** Kyrgyz tili agglíutinativdüü; uŋgular taanylyp turuşu kerek. *Кийим* sözü *кий-* (*kií-*) uŋgusunan açyk-aíkyn jasalat; *тийиштүү* — *тий-* (*tií-*) uŋgusunan. Bulardy `kiim` jana `tiiştüü` dep kyskartuu etiştin uŋgusun kesip, tekteş formalardy negizsiz bölüp salat: `biíi` (бийи) jarym ündüünü saktap kalmak, al emi `biíik` (бийик) any jogotmok.

4. **Al jarym ündüü üçün erejeden çettöö kaltyrbaít.** Kirillitsadagy ar bir `й` bardyk pozitsiíada pozitsiíalyk erejelersiz jana eç kandaí tablitsadan izdöösüz `í` bolot.

Ştrih-kod jüíösü toluk formaga gana tiíeşelüü. Jönököí formada `í` tamgasy `i` bolup kalat, *biíik* kaíradan `biiik` bolot (§19). Bul — eki deŋgeeldüü dolboordun çynygy baasy, dolboor andan kutula turgan nerse emes.

### Emne üçün akut, başka belgi emes

Kyskaça aítkanda: `i` tamgasynyn üstünö koíula turgan belgilerdin içinen akut eŋ jeŋili jana eŋ keŋiri jetkiliktüüsü, oşondoí ele bul sistemada anyn ataandaş mildeti jok, antkeni kyrgyz tilinde basym jazylbaít, al emi sozuluş koş tamga menen berilet. `i` tuura negiz, antkeni [j] — [i] tybyşynyn jarym ündüü tügöíü, oşondoí ele belgisi bar `i` belgisi alynyp salynganda `y` tamgasyna emes, `i` tamgasyna kaítat. Jalgyz çynygy kagylyş — okuu materialdaryndagy basym belgileri menen bolgon kagylyş — tar masele, anyn jarym ündüünü özgörtüügö karaganda jakşyraak çeçimi bar.

2-jüíö bir karşy pikirdi tögüngö çygarbaít. Akuttun başka jerlerde da maanileri bar: çeh, slovak, venger jana irland tilderinde al sozuluştu, ispan tilinde basymdy belgileít, al emi makrondu çetke kakkan da dal uşundaí bötön maani bolgon (§12.1). Birok bul jerde aíyrma — *kyrgyz* okurmany okuganda kandaí tüşünükkö taíanarynda. Kyrgyz tilinde basym turuktuu jana eç kaçan jazylbaít, sozuluş bolso koş tamga menen jazylat, oşonduktan bul sistemada akuttun ataandaş mildeti jok; al emi makrondun adattagy maanisi — sozuluş — kyrgyz tilinde janduu kategoriía.

Bul tandoonun içinde eki suroo jaşyrylgan, alardy bölüp karoo jakşyraak: kaísy belgi jana al kaísy tamgaga koíulat.

`i` tamgasynyn üstünö koíula turgan belgilerdin içinen dierezis (`ï`) `ö` jana `ü` tamgalaryndagy içkelik belgileri menen körünüşü boíunça kagylyşmak. Tsirkumfleks (`î`) jetkiliktüü, birok türkçö jazuuda al arab tilinen kirgen sözdördögü sozuluştu belgileít (*millî*, *tarihî*); bul — makrondu çetke kakkan oşol ele karşy pikir, bul jolu eŋ jakyn latyn grafikaluu türk tilderinin saltynan kelgen. Karon (`ǐ`) tekst ölçömündö ooruraak körünöt jana Latin-1 toptomunan tyşkary. Eki alternativa çetke kagylbaí, synoo çöírösünün parametrleri katary kirgizilgideí jakyn (§7). Alardyn içinen eŋ negizdüüsü — breve `ĭ`: al kirillitsa tamgasynyn tüz analogu, antkeni al tamga — üstünö breve koíulgan `и`, ALA-LC da any uşul sebepten tandagan [[8]](#ref8). Al salmagy jana jetkiliktüülügü boíunça utulat: okuu ölçömündö akuttan ooruraak, Latin-1 toptomunan tyşkary, köpçülük jaíylmalarda jana uzak basuu meníularynda jok; bular — daraja aíyrmaçylyktary, oşonduktan synoo çöírösü bütündöí tekstterdi uşul tamga menen körsötüp, salyştyruunu baraktyn üstündö jürgüzüügö mümkündük beret. Tilda `ĩ` andan da alsyz jana başka parametr menen öz ara taasirge kiret: velíardyk murun ünsüzü üçün `ñ` tamgasyn da tandagan okurman bir ele belgini eki başka mildet atkargan eki tamgaga koíup kalat, synoo çöírösü bul tuuraluu eskertet. `í` (U+00ED) — toptomdogu eŋ jeŋili; al Latin-1 toptomunda, ispan, portugal, irland jana island jaíylmalarynda, oşondoí ele mobildik tüzmöktördün standarttuu uzak basuu meníularynda bar.

Negiz — özünçö suroo; §21.1 salyştyrgan sistemalar aga tört türdüü joop beret: ISO 9 jana Tynystanovdun 1928-jylky alfavitinde `j`, BGN/PCGN jana CTA sistemalarynda `y`, türkmön tilinde `ý` [[20]](#ref20), ALA-LC sistemasynda belgisi bar `i`. `j` jana `y` tandooloru tybyşty kaísy bir latyn saltynda /j/ maanisin muruntan alyp jürgön tamgaga baílaít: `j` — nemis jana slavían jazylyşynan, `y` — anglisçe jana türkçö jazuudan. Eŋ körsötmölüüsü — türkmön tili, antkeni al uşul orfografiía baştagan jerden baştaít: anda çekitsiz `ı` jok, oşonduktan `y` joon erinsiz [ɯ] ündüüsün bildiret, al emi jarym ündüü `ý` menen jazylat, bir muun eköönü teŋ kamtyşy mümkün, misaly, *ýyl* (жыл).

Negiz katary `y` tamgasynan körö `i` tamgasyn eki nerse jaktaít, eköönün biri da baştapky jazuunun kirillitsa ekenine köz karandy emes. Birinçisi: [j] — [i] tybyşynyn jarym ündüü tügöíü, özünçö muun tüzbögön oşol ele artikulíatsiía; oşonduktan transkriptsiíada any muun tüzbögön `i` katary jazuuga bolot, dal uşundan ulam *ko-i-on* jana *ty-i-yn* jetişerlik tez aítylganda *koíon* jana *tyíyn* bolup kalat. Jarym ündüü kaída tüşpösün, uşul özgöçölügün saktaít, anyn içinde `o` jana `y` tamgalarynan kiíin da. [ɯ] tybyşynyn jarym ündüü tügöíü — [ɰ], [j] emes; al — kyrgyz tiline keregi jok velíardyk approksimant, oşonduktan `ý` fonetika çetke kakkan tekteştikti yrastamak. Kirillitsa da dal uşuga şaíkeş kelet: `й` — belgisi bar `и`, al bir ele uŋgulardyn içinde `и` menen almaşyp kelet (*кий-*, *кийим*).

Ekinçisi — belgi alynyp salynganda emne boloru. Jönököí forma da, izdöö birdeílöösü da diakritikany alyp salat, oşonduktan `í` — `i` bolup kalat, al emi `ý` — `y` bolup kalmak. `í` koldonulganda *тыйын* jana *айыл* ASCII koddoosuna `tyiyn` jana `aiyl` bolup jetet. Al emi `ý` koldonulganda alar `tyyyn` jana `ayyl` bolup jetmek: 1-jüíö jarym ündüügö özünçö tamga kirgizüü menen aldyn algan oşol ele koşulup ketüü kaíra aílanyp kelmek. Irettöö üçünçü jagdaídy koşot: §17.1 anyktagan tartip printsibi boíunça belgisi bar `y` alfavittin aíagyna, al almaşyp kelgen tamgadan alys jaígaştyrylyp, oşol jerde okutulmak.

Jalgyz çynygy kagylyş — basymdy belgilöö menen. Okuu materialdary, sözdüktör jana çet til okuu kitepteri basymduu muundardy akut menen belgileít (*a-tá*, *o-ro-mó*), al emi `i` tamgasynyn üstündö al belgi menen jarym ündüü bir ele simvol bolup kalmak. Bul kagylyş algaç körüngöndön taryraak: al basym /i/ ündüüsünö tüşköndö gana paída bolot, kalgan bardyk ündüülör basym akutun bir maanilüü kabyl ala beret; kyrgyz tilinde basym negizinen aldyn ala belgilüü jana sözdün aíagyna tüşöt, oşonduktan any belgilöö — adisteştirilgen materialdyn çakan kölömündögü özgöçö uçurlar jana kirme sözdör üçün ykma, kadimki teksttin özgöçölügü emes. Jyştygy boíunça salyştyrganda, jarym ündüü baílanyştuu tekstte üzgültüksüz kezdeşet, basym belgisi andaí emes. Çeçim — pedagogikaga bir da tamga menen ataandaşpagan ykma berüü: basymduu muundu joon şrift menen belgilöö je anyn aldyna El aralyk fonetikalyk alfavittin basym belgisin koíuu (*bi-ˈíik*); munun dagy bir artykçylygy bar: al büt ündüülör kuramynda birdeí işteít. §23.6 bul erejeni ali jazyla elek iş katary sanap ötöt.

Kazakstandyn 2018-jylky alfaviti — eskertüüçü misal (§21.5), al emi anyn sabagy akuttar jarabaít degende emes: alty-jeti tamgaga çaçylgan akut başalamandyktaí okulat, al emi bir sistemaluu koldonuu andaí okulbaít. `í` — bir mildeti bar bir tamga.

---

## 11. `ж` üçün `j`: jumşak affrikat

Töl sözdördün başyndagy jana ortosundagy `ж` — jumşak postalveolíardyk affrikat [dʒ], anglisçe *journey* sözündögü *j* tybyşy; al `zh` işara kylgan, orus tili arkyluu kelgen jylçykçyl [ʒ] emes. Jany-Latyn **`j`** jazat: *jakşy*, *jaŋy*, *jol*, *jigit*.

Bul kyrgyz tili üçün jaŋy tandoo emes. Kyrgyz ökmötü geografiíalyk atalyştardy latyn jazuusunda berüü üçün kabyl algan BGN/PCGN romanizatsiíasy [[8]](#ref8) da `ж` tamgasyn `j` menen jazat, anyn natyíjasyn kyrgyz pasporttorunan jana el aralyk maalymat karajattarynan körüügö bolot: *Japarov*, *Jalal-Abad*. Aga salyştyrmaluu `zh` tildegi eŋ köp kezdeşken ünsüzdördün birine koşumça bir basuunu talap kylat jana el aralyk okurmanga tuura emes nerseni aítat.

Bul tybyşka `c`, al emi [ʒ] tybyşyna `j` tamgasyn yígargan CTA alfavitinen aíyrmalanyş [[8]](#ref8) ataíylap jasalgan, al tömöndö jüíölönöt.

**CTA `c` koldongon jerde `j`.** CTA alfavitinde türkçö jazuuga ylaíyk `c` — [dʒ], al emi `j` — kirme sözdördögü [ʒ]. Jany-Latyn jaígaştyra turgan tamga biröö, eköö emes, antkeni kyrgyz kirillitsasy eki tybyş üçün teŋ bir ele `ж` jazat; Jany-Latyn any `j` tamgasyna koíot. Türkçö okuu-jazuunu bilbegen okurman üçün `c` beítarap simvol emes: frantsuz tilinin taasirinde okugan adamga al [s] tybyşyn, anglisçe okugan adamga [k] tybyşyn eske salat. Al emi `j` tamgasyn türkçö üírönbögön, latyn jazuusun bilgen deerlik ar bir okurman [dʒ] tybyşyna jakyn okuít, oşondoí ele al kyrgyz rasmií romanizatsiíasynda `ж` üçün muruntan koldonulup kelgen tamga. Türkçö emes klaviaturalarda tergen diasporaga jana el aralyk okuluşka bagyttalgan sistema üçün `c` — adaştyruuçu tamga.

Bölüü oşondoí ele §8 süröttögön sözdükkö köz karandylykty alyp kelet: CTA töl *жазуу* sözün *cazuu*, al emi *журнал* kirme sözün *jurnal* dep jazat, kyrgyz kirillitsasy bolso eköö üçün teŋ bir `ж` jazat. `q` jana `ğ` menen koşo CTA ülgüsündögü jöndöögö ünsüzdörünün üç jerinde kirme sözdördün tizmesi kerek, al emi jalgyz `j`, `k` jana `g` eç birine tizme talap kylbaít.

Bul azyrky bir komitetten gana emes, kyrgyz latyn saltynan da aíyrmalanyş. Tynystanovdun alfavitinde `й` jarym ündüüsü üçün `j`, al emi `ж` affrikaty üçün `c` koldonulgan (1938-jylky redaktsiíada `ƶ` menen almaştyrylgan) [[4]](#ref4); CTA jana Musaíev da dal oşol belgilöönü koldonot. Bul orfografiía al salttan çettöönü kabyl alat: `ƶ` özgörtülgön `z` syíaktuu okulat, al [dʒ] tybyşyn `c` tamgasynan jakşyraak bildirbeít, oşondoí ele al şriftterde naçar kamtylgan, seírek kezdeşüüçü Latin Extended-B simvolu boídon kalat.

---

## 12. `ö` jana `ü`: içke erindik ündüülör

### 12.1 `ү` üçün `ü` jana başka varianttar

Jany-Latyn jazuusunda **`ү`** [y] üçün tamga — **`ü / Ü`**; bul uşul ele ündüü üçün türkçö, azerbaíjança jana türkmönçö koldonulgan tamgaga, oşondoí ele kazak tilindegi `ү` üçün umlauttuu ü tamgasyn tandagan 2021-jylky kazak latyn alfavitine dal kelet [[5]](#ref5). Sozuluş özünçö, koş tamga menen berilet: *kün* (күн) sözündö kyska `ü`, *küü* (күү) sözündö sozulma `üü`.

Alternativalar juptalgan, biri-birinen köz karandysyz emes. Synoo çöírösü içke erindik ündüülördün tört konfiguratsiíasyn sunuştaít, alardyn üçöö — ar başka glifter menen jürgüzülgön bir ele eksperiment:

| Konfiguratsiía | `ө` | `ү` |
| :--- | :---: | :---: |
| Latyn umlauttary (Jany-Latyn) | `ö` | `ü` |
| Aralaş `ө` | `ө` | `ü` |
| Kirillitsa `ұ` | `ө` | `ұ` |
| Makron `ū` | `ө` | `ū` |

Bul juptaşuu natyíjalardy okuu üçün maanilüü. `ü` tamgasynyn ar bir alternativasy kirillitsa `ө` menen koşo berilet, oşonduktan `ұ` je `ū` tandoo bir tamgany ekinçisine almaştyruu menen ele bütpöít: al §12.2 baíandagan jazuulardy aralaştyruunun çygymdaryn da kabyl alat. Çygymdar janaşa turbastan, biri-birin küçötöt, al emi *kөrūū* menen *körüü* — uşul küçöşüünün baraktagy körünüşü.

Makron `ū` synalyp, çetke kagylgan. Latyş jana maori tilderinde makron ündüünün *sozuluşun* belgileít, okurmandyn aga dal uşul maanini berişi eŋ yktymal. Kyrgyz tilinde fonemalyk sozuluş bar, oşonduktan ündüünün *sapatyn* bildirgen `ū` kyrgyz okurmanyna daíar turgan jana tuura emes okuluştu sunuştaít. Çeçüüçüsü — içki kagylyş: bul sistemada sozuluş koş tamga menen jazylat, oşonduktan `ū` tamgasynyn sozulma formasy `ūū` bolmok, bul eki jolu belgilengen sozuluş katary okulat. Bul jüíö kyrgyz tiline gana tiíeşelüü, jalpy emes: 2021-jylky kazak alfaviti kazak tilindegi `ұ` üçün makronduu ū tamgasyn koldonot [[5]](#ref5), al jerde bul işteít, antkeni kazak tilinde andaí sozuluş oppozitsiíasy jok.

Kazakça `ұ` ötkööl mezgil üçün körsötüü parametri katary saktalgan, antkeni jazuunu plandoo boíunça talkuularda kirillitsaga jakyn glifter kirillitsany bilgen okurmandar üçün köpürö katary aítylyp kelet. Any menen koşo eki masele kelet. Any aíyrmalap turgan belgi — anyn içke tuura syzygy, al emi myndaí syzyktar maída ölçömdö jana katuu antialiasingde birinçi bolup buzulat; oşondo al bul jerde özünün fonemalyk jügün muruntan alyp jürgön latyn `y` tamgasyna okşoşup kalat. Oşondoí ele ASCII koddoosundagy `u` tamgasyna taza tüşkön `ü` tamgasynan aíyrmalanyp, `ұ` tamgasynyn ASCII rezervdik türü takyr jok, oşonduktan al jönököí forma tüzülgön dal oşol çöírölördö iştebeí kalat.

### 12.2 `ө` üçün `ö` jana jazuulardy aralaştyruunun baasy

Jany-Latyn jazuusunda **`ө`** [œ] üçün tamga — **`ö / Ö`**. Kirillitsa `ө` synoo çöírösündö Jany-Latyn üçün talapker katary emes, ötkööl jana okuu materialdary üçün körsötüü rejimi katary saktalgan.

Avtor saptyn içindegi kirillitsa `ө` tamgasyn toluk okuluuçu dep esepteít, oşonduktan aga karşy jüíö okuluşka taíana albaít. Kalgany latynça bolgon teksttin içinde bir kirillitsa tamgasyn kaltyruunun üç çygymy bar, okurman glifti kançalyk oŋoí okusa da, üçöö teŋ küçündö kalat:

- **Gliftin ölçömdörü.** Kirillitsany kamtybagan şriftter oşol bir glif üçün başka şriftti koldonot; kirillitsany kamtygan şriftter da baary bir latyn jana kirillitsa tamgalaryn özünçö dizaín menen tartat, oşonduktan `ө` köbünçö anyn janyndagy latyn kiçine tamgalaryna salyştyrmaluu x tamgasynyn biíiktigi boíunça kiçireek bolup turat. Kandaí bolgon kündö da sözdün içinde öz sabyna dal kelbegen tamga bolot, al emi bul taasir tekst ötkön ar bir şrift toptomu menen özgöröt. Bul — üç çygymdyn eŋ az bojomolgo negizdelgeni jana tekşerüügö eŋ arzany (§23.4).
- **Irettöö.** Íunikoddun irettöö algoritminde latyn jana kirillitsa tamgalary ar başka salmak toptorunda irettelet [[6]](#ref6), oşonduktan aralaş saptar taza latyn saptaryna salyştyrmaluu kütülbögöndöí irettelet. Attardyn tizmesin alfavit boíunça irettöö keregi jok jerden lokalga köz karandy bolup kalat.
- **Tokenizatsiía (boljoldongon, ölçöngön emes).** SentencePiece demeíki boíunça kirgizilgen tekstti Íunikod jazuularynyn çekterinde bölöt, oşonduktan `kөl` bir emes, üç bölükkö bölünüşü mümkün [[7]](#ref7). Aldyn ala tokenizatoru jazuuga karabastan bardyk tamgalardy bir topko biriktirgen baít deŋgeelindegi BPE tokenizatorloru sözsüz ele myndaí iştebeít, oşondoí ele `ö` menen `ө` UTF-8 koddoosunda eköö teŋ eki baít eeleít, oşonduktan taasir tokenizatorgo köz karandy. Munu kantip tekşerüü kerektigin §23.1 aítat.

Standarttuu `ö` okurmandan `ü` muruntan talap kylbagan eç nerseni talap kylbastan, üçöönön teŋ kutulat.

---

## 13. `ç` jana `ş`: şybyş ünsüzdör

Jany-Latyn jazuusundagy şybyş ünsüzdör — **`ç`** jana **`ş`**: *çaí*, *şaar*. Digraftar karalyp çygyp, toluk forma üçün çetke kagylgan, antkeni kyrgyz morfologiíasy alar menen kagylyştardy jaratat.

Künümdük uçur — `ш` menen bütkön uŋguga jalgangan, atkaruuçunu bildirgen `-чы/-чи` müçösü: *баш* + *-чы* → *башчы* digraftar menen çekti büdömüktötkön `bashchy` bolot, al emi sedilder menen taza `başçy` bolot. Ekinçi uçur — kişi attaryndagy `s`+`h` udaalaştygy: **Исхак** (Is-hak) digraf arkyluu `ishak` bolup transliteratsiíalanat, *ишак* sözü da dal uşundaí çykmak; bul — «эшек» maanisindegi, kyrgyzça süílögöndördün köbü taanygan orusça jana özbekçe söz, töl söz *эшек* bolso da. Sedilder alardy ajyratyp turat: `ishak` jana `işak`.

Orusça `щ` trigraf jaratpastan, **`ş`** tamgasyna koşulat (*ящик → íaşik*, *борщ → borş*). Oozeki kyrgyz tilinde al [ʃ] bolup aítylat, al emi `şç` teskeri aílandyruuda töl `başçy` sözü menen kagylyşmak.

Digraftar taptakyr taştalgan emes; alar başka jerge köçürülgön. Teskeri konverter eski tekstter jana künümdük jazuu tuura aílandyrylyşy üçün murunku `ch`, `sh` jana `sch` digraftaryn kabyl alat, al emi synoo çöírösü salyştyruu üçün bütündöí tekstterdi digraf rejiminde körsötö alat.

---

## 14. `ң` üçün `ŋ`: velíardyk murun ünsüzü

**`ŋ / Ŋ`** (U+014B / U+014A) jalgyz [ŋ] fonemasyn belgileít jana any çynygy `n`+`g` aíkalyşynan aíyrmalap turat: *күнгө* (*kün* uŋgusu + baryş jöndömönün *-gö* müçösü) `küngö` boídon kalat, al emi *жаңы* — `jaŋy`, eki maanilüü `jangy` emes.

Eng tamgasy formasynyn ulanmaluulugu üçün tandalgan. Kirillitsa `ң` (төмөн түшкөн куйругу бар н) jana Tynystanovdun 1928-jylky latyn `ꞑ` tamgasy (tömön tüşkön kuírugu bar n) [[4]](#ref4) eköö teŋ `n` tamgasyn negizgi syzyktan tömön tüşüröt, al emi `ŋ` (eng) oşol ele natyíja üçün oŋ butun iíip tüşüröt. Koldo bolgon varianttardyn içinen kirillitsa salty menen da, 1928-jylky latyn salty menen da ulanmaluulugu bar jalgyz variant uşul. Al emi CTA sunuştagan `ñ` (tildaluu n) belgisin teskerisinçe tamganyn üstünö koíot; ispan tilin az da bolso bilgen okurmandar üçün al belgilüü bir tuura emes okuluştu — *piñata* jana *mañana* sözdöründögü [ɲ] tybyşyn — alyp kelet.

`ŋ` tamgasynyn çynygy çygymdary da bar:

- Mobildik tüzmöktördö birdeí jetkiliktüü emes. Any US lokalyndagy Android klaviaturasynda `n` baskyçyn uzak basyp tabuuga bolot; iOS jana US emes lokaldar tekşerile elek, al emi `ñ` bardyk jerde işenimdüü türdö bar variant.
- Baş tamga `Ŋ` eki başka dizaínda koldonulat — çoŋoítulgan kiçine tamga türündö jana N tamgasynyn negizindegi türdö, oşonduktan baş tamgalar menen gana jazylgan tekst ar başka şriftterde ar türdüü körünüşü mümkün.
- Al Latin-1 jana Windows-1252 toptomdorunan tyşkary, al emi `ñ` alarda bar.

Türkmön tili bul tybyşty akyry `ň` tamgasyna — karongo, tildaga emes — toktogongo çeíin `ꞑ`, `ñ` jana `ng` menen jazyp kelgen [[20]](#ref20); Kazakstan 2021-jyldyn içinde `Ŋ` tamgasynan `Ñ` tamgasyna ötkön, al emi özbek dolbooru `ng` digrafyn saktaít [[9]](#ref9). Bul masele büt til üí-bülösündö açyk boídon turat. Jany-Latyn tamganyn kelip çygyşy jana adaştyruuçu okuluş jüíölörünö taíanyp `ŋ` tamgasyn saktaít, al emi mobildik terüügö köbüröök maani bergender üçün synoo çöírösündö `ñ` tamgasyn salyştyruu jöndöösü katary sunuştaít. Klaviatura jaíylmalary (D tirkeme) statsionardyk kompíuterde `ŋ` tamgasyn bir basuuga aílandyrat, al emi jönököí forma any `n` dep jazat (*jaŋy → jany*), adamdar ansyz dele uşundaí terip jürüşöt.

---

## 15. Ündüülör, sozuluş jana `е`

Kyrgyz tilinde segiz negizgi ündüü bar, alar joon-içkelik jana erindik-erinsizdik ündöştügü boíunça toptolot:

| Oozdun açylyşy | Içke erinsiz | Içke erindik | Joon erinsiz | Joon erindik |
| :--- | :---: | :---: | :---: | :---: |
| **Kuuş** | **i** (и) | **ü** (ү) | **y** (ы) | **u** (у) |
| **Orto** | **e** (э, е) | **ö** (ө) | — | **o** (о) |
| **Keŋ** | — | — | **a** (а) | — |

Alardyn altoosunda kyska jana sozulma türlörü oppozitsiía tüzöt: `аа`, `ээ`, `оо`, `өө`, `уу`, `үү`. Eki kuuş erinsiz ündüünün — `ы` jana `и` — sozulma tügöílörü jok [[4]](#ref4). Sozuluş bardyk jerde koş tamga menen jazylat.

Latyn tamgalary çeçim talap kylgan ündüülör §9 (`y`) jana §12 (`ö` jana `ü`) bölümdöründö, al emi jarym ündüü §10 bölümündö jüíölöngön; sozuluş jana `е` tömöndö karalat.

### 15.1 Fonemalyk sozuluş jana `е` maselesi

Sozuluş **koş tamga** menen jazylat: *ток* [tok] menen *тоок*, *Ala-Too*, *aalam*, *jeek*, *kuu*, *küü*.

Alternativa — latyş jana maori tilderindegideí jalgyz ündüünün üstünö makron koíuu bolçu; al *took* (тоок) üçün *tōk*, *Ala-Too* üçün *Ala-Tō* jazylyşyn jaratmak. Bul eki belgilöönün kompakttuuraagy, oşol orfografiíalardy okugan adam dal uşunu kütmök. Birok koş jazuu aga karaganda tört sebep menen artyk körülöt: koşuluuçu diakritikalyk belgilerdi izdöö jana maalymat bazasynyn katmarlary bir kalypta emes alyp salat je normaldaştyrat; koş jazuu «ölük» baskyçty je uzak basuunu talap kylbaít, bir ele baskyçty eki jolu basuu jetiştüü; kyrgyz kirillitsasy sozuluştu muruntan ele koş tamga menen jazat, kyrgyz arab orfografiíasy da uşundaí [[4]](#ref4), oşonduktan bul ereje muraska alyngan, oílop tabylgan emes; oşondoí ele sozuluuçu alty ündüünün eköösündö muruntan belgi bar, oşonduktan sozulma `öö` jana `üü` üçün kabat belgilüü `ȫ` jana `ǖ` kerek bolmok — alar Latin-1 toptomunan tyşkary, şriftterde naçar kamtylgan jana «ölük» baskyçsyz terilbeít.

Keede arhaizm katary süröttölgön kyrgyz sozulma ündüülörü negizinen ündüülör arasyndagy jogolgon ünsüzdördön kelip çykkan ekinçilik önügüü (*тоо* — velíardyk ünsüzü bar eski formadan), türkmön tili saktagan prototürk sozuluşu emes [[26]](#ref26). Kandaí bolgon kündö da bul oppozitsiía azyrky kyrgyz tilinde janduu, orfografiíaga myndan başka eç nerse kerek emes.

Açyk çeçilişi kerek bolgon jalgyz erejeden tyşkarky uçur — `е`. Kyrgyz kirillitsasy any eç kaçan koş jazbaít; sozulma /eː/ bardyk pozitsiíada `ээ` menen jazylat (*ээги*, *керээз*, *кээде*, *жээк*), Jany-Latyn any körünüşünçö beret: **`ee`** (*eegi*, *kereez*, *keede*, *jeek*). Birok `е` orusça kirme sözdördö ekinçi mildet atkarat: sözdün başynda (*Европа*, *Енисей*) jana ündüüdön kiíin (*переезд*, *проект*) al [je] tybyştaryn bildiret. Jany-Latyn munu muruntan bar jarym ündüü tamgasy menen çeçet: kirme sözdögü [je] — **`íe`** (*Íevropa*, *pereíezd*, *proíekt*), töl sözdün başyndagy [e] **`e`** boídon kalat (*ene*, *el*), ünsüzdön kiíinki [e] da **`e`** boídon kalat (*kel*, *mektep*). Kyrgyzça aítylyşta íottoşpogon kirme sözdögü ündüüdön kiíinki `э`, *поэт* jana *аэропорт* sözdöründögüdöí, jönököí jazylat: *poet*, *aeroport*. Üç grafema (`e`, `ee` jana `íe`) bardyk pozitsiíany kamtyít. Alardyn kirillitsaga kaíra aílandyruuda emne kylaryn §18.1 anyktaít.

---

## 16. Kirme sözdördögü `ъ` jana `ь` belgileri, oşondoí ele `я`, `ё`, `ю`

Ajyratuu jana içkertüü belgileri Jany-Latyn muruntan bar jarym ündüü menen bergen hiatustu jana palatalizatsiíany belgileít. Íottoşkon ündüünün aldyndagy ajyratuuçu belgi `í` tamgasyna siŋirilet (*объект → obíekt*, *семья → semía*, *разъезд → razíezd*). Kyrgyz fonologiíasy tabigyí kepte palatalizatsiía katary aítpagan muun aíagyndagy içkertüü belgisi tüşürülüp kalat (*июль → iíul*, *апрель → aprel*, *роль → rol*). Íottoşkon ündüülör yraattuu türdö ajyratylat: **я → ía**, **ё → ío**, **ю → íu** (*saíakat*, *koíon*, *aíuu*), al emi íottoşpogon hiatus jönököí boídon kalat (*диаграмма → diagramma*).

Natyíjada Jany-Latyn menen jazylgan ar bir söz `\p{L}+` ülgüsünö dal kelgen, içinde apostrofu jok üzgültüksüz alfavittik sap bolot. Bul kasiíettin konkrettüü natyíjalary bar: izdöö indeksteri jana jönököílötülgön tokenizatorlor sözdü tynyş belgisinen bölüp salbaít, al emi eki jolu çykyldatkanda söz tolugu menen belgilenet [[10]](#ref10). `oʻ` jana `gʻ` tamgalarynda apostrof koldongon özbek jazuusu alternativa iş jüzündö emnege turaryn janduu körsötüp turat, antkeni bul belgi adatta klaviatura kaísy tyrmakça belgisin çygarsa, oşonu menen almaştyrylat.

Birok bul kasiíet URL darekterdi ASCII jagynan taza **kylbaít**. `í`, `ŋ`, `ö`, `ü`, `ç` jana `ş` — baary ASCII emes simvoldor, alar URL jolunda paíyzdyk koddolot (`ŋ` — `%C5%8B` bolot). `\p{L}+` kasiíeti bergen nerse — bir bütün, üzülbögön token; al emi taza slagdardy jönököí forma jaratat (§19), slag tüzüü üçün tuura katmar da uşul: *jaŋylyktar → janylyktar*.

---

## 17. Alfavittik tartip

Bul bölüm Jany-Latyn alfavittik tartibin, başkaça aítkanda, okurman üírönö turgan yraattuuluktu baíandaít; §17.4 anyn irettöödö emneni özgörtörün körsötöt, al emi C tirkeme programmalyk kamsyzdoogo kerektüü erejelerdi beret.

### 17.1 Tartiptin printsibi

Tartiptin köbün bir suroo çeçet: özgörtülgön tamga kaída turat. Kyrgyz kirillitsasy jana türk tilderinin latyn orfografiíalary aga birdeí joop beret: any alfavittin aíagyna emes, özünün negizgi tamgasynyn dal artyna koíot. Kyrgyz kirillitsasy `ң` tamgasyn `н` tamgasynan, `ө` tamgasyn `о` tamgasynan, `ү` tamgasyn `у` tamgasynan kiíin koíot; türkçö jana azerbaíjança jazuu `ç` tamgasyn `c`, `ş` tamgasyn `s`, `ö` jana `ü` tamgalaryn `o` jana `u` tamgalarynan kiíin koíot. Jany-Latyn eköönü teŋ eerçiít.

### 17.2 Jany-Latyn alfaviti (28 tamga)

**A B Ç D E F G H I Í J K L M N Ŋ O Ö P R S Ş T U Ü V Y Z**

**a b ç d e f g h i í j k l m n ŋ o ö p r s ş t u ü v y z**

Anda printsiptin üç natyíjasy körünüp turat. `Í` tamgasy `I` tamgasynan kiíin turat: bul kirillitsany bilgen okurman muruntan taanygan `и`/`й` janaşalygyn çagyldyrat. `ң` tamgasy `н` tamgasynan kiíin turgandaí, `Ŋ` da `N` tamgasynan kiíin turat. `Y` kirillitsada `ы` turgan jerde emes, latyn alfavitindegi öz ordunda, aíagyna jakyn turat; bul tamganyn formasyna karata el aralyk kütüügö dal kelet.

Jalpy türk alfaviti da uşul ele printsipti eerçiít. Anyn 34 tamgaluu tartibi `Ğ` tamgasyn `G`, `X` tamgasyn `H`, `Ñ` tamgasyn `N`, `Ö` tamgasyn `O`, `Ū` jana `Ü` tamgalaryn `U`, `Ə` tamgasyn `E` tamgasynan kiíin, al emi `Q` tamgasyn `K` tamgasynyn dal artyna koíot [[17]](#ref17); ar bir tamga aíagynda je muraska kalgan latyn yraattuulugunda emes, özü jup tüzgön tamganyn janynda turat. Tömöndögü `q` saptary `Q` tamgasyn uşul ele sebepten `K` tamgasynan kiíin koíot.

`C`, `Q`, `W` jana `X` alfavittin kuramyna kirbeít. Jany-Latyn alardy eç kaçan çygarbaít: `ч` — `ç`, `ц` — `ts`, al emi kalgandary başka konfiguratsiíalarga je çet tildegi jazylyştarga taandyk.

### 17.3 Alfavitter janaşa

| Konfiguratsiía | Tamgalar | Alfavit |
| :--- | :---: | :--- |
| Jany-Latyn | 28 | Aa Bb Çç Dd Ee Ff Gg Hh Ii Íí Jj Kk Ll Mm Nn Ŋŋ Oo Öö Pp Rr Ss Şş Tt Uu Üü Vv Yy Zz |
| q+ğ (§8) | 30 | Aa Bb Çç Dd Ee Ff Gg Ğğ Hh Ii Íí Jj Kk Qq Ll Mm Nn Ŋŋ Oo Öö Pp Rr Ss Şş Tt Uu Üü Vv Yy Zz |
| q+ğ+ı | 30 | Aa Bb Çç Dd Ee Ff Gg Ğğ Hh Iı İi Jj Kk Qq Ll Mm Nn Ŋŋ Oo Öö Pp Rr Ss Şş Tt Uu Üü Vv Yy Zz |
| CTA ülgüsündö (q+ğ+ı+c+ñ) | 31 | Aa Bb Cc Çç Dd Ee Ff Gg Ğğ Hh Iı İi Jj Kk Qq Ll Mm Nn Ññ Oo Öö Pp Rr Ss Şş Tt Uu Üü Vv Yy Zz |
| Jalpy türk alfaviti, maalymat üçün | 34 | Aa Bb Cc Çç Dd Ee Əə Ff Gg Ğğ Hh Xx Iı İi Jj Kk Qq Ll Mm Nn Ññ Oo Öö Pp Rr Ss Şş Tt Uu Ūū Üü Vv Yy Zz |

Alfavitter baş jana kiçine tamga juptary menen berilgen, antkeni juptar aíyrmalanat: akyrky üç sapta `I` — çekitsiz `ı` tamgasynyn baş tamgasy, al emi çekittüü `i` tamgasynyn baş tamgasy — `İ`.

q+ğ+ı sabynda `ы` tamgasyn `ı` menen jazuu `y` tamgasyn boşotot, any jarym ündüü alat: §10 bölümündögü `í` paídasyna jüíö — `y` başka mildetke eelengeni, al emi bul jerde al eelengen emes. `Y` aíagyndagy kadimki latyn orduna kaítat. `í` tamgasyn da saktoogo bolot, synoo çöírösü munu sunuştaít; munun baasy — üstündögü belgileri menen gana aíyrmalangan `I`, `İ` jana `Í` degen üç tamgasy bar alfavit.

Akyrky sap — Bakudagy alfavittin özü [[17]](#ref17), başkalaryn any menen salyştyryp okuuga bolot. Anyn üstündögü sap — kyrgyz tiline yŋgaílaştyruu koldono turgan variant: §21.2 keltirgen sebepterden ulam `Ə`, `Ū` jana `X` tamgalary jok oşol ele alfavit. Ekööndö teŋ `W` jok.

### 17.4 Irettöö: ylaíyktaştyruu emneni özgörtöt

Alfavittik tartipti programmalyk kamsyzdoogo *ylaíyktaştyruu* türündö berüü kerek: bul — Íunikoddun demeíki irettöö tartibine kirgizilgen oŋdoolordun kyska tizmesi [[6]](#ref6); al tartip kyrgyz tili jönündö eç nerse bilbeít jana `ç` tamgasyn `c` tamgasynyn varianty katary jaígaştyrat. Al tizmeni C tirkeme beret; bul bölüm sintaksiske eç kaçan köz salbaí turgan okurman üçün al emneni özgörtörün körsötöt.

| Jany-Latyn tartibi | q+ğ+ı tartibi | Emne jyldy |
| :--- | :--- | :--- |
| bas, baş, bat | bas, baş, bat | özgörgön jok: ekööndö teŋ `ş` — `s` tamgasynan kiíin |
| kene, keŋ, kep | kene, keŋ, kep | özgörgön jok: ekööndö teŋ `ŋ` — `n` tamgasynan kiíin |
| kol, konok, köl, köp | kol, konok, köl, köp | özgörgön jok: ekööndö teŋ `ö` — `o` tamgasynan kiíin |
| kul, kum, kül, küü | kul, kum, kül, küü | özgörgön jok: ekööndö teŋ `ü` — `u` tamgasynan kiíin |
| kir, kyz | kız, kir | teskeri: `ı` türkçö jazuudagydaí `i` tamgasynan *murun* irettelet, oşonduktan kuuş joon erinsiz ündüüsü bar ar bir söz çekittüü `i` bar koşunalarynan aldyga jylat |

Oşol saptardyn ekööndögü natyíja okurmandarga köp uçurda intuitsiíaga karşy körünöt. `ö` jana `ü` tamgalary `o` menen `u` tamgalarynyn belgisi bar formalary katary emes, öz aldynça tamgalar katary eseptelgendikten, oşol pozitsiíada negizgi ündüüsü bar *ar bir* söz özgörtülgön ündüüsü bar *ar bir* sözdön murun irettelet: *köl* sözü *kol* sözünün janynda emes, *konok* sözünön kiíin turat. Kirillitsadagy tartip `о`/`ө` jana `у`/`ү` menen muruntan ele uşundaí kylat, oşonduktan kyrgyz okurmanyna bul taanyş, al emi izdöönü işke aşyruuçuga köp uçurda taanyş emes.

Akyrky sap — sözdük je indeks jürgüzgön ar bir adam üçün q+ğ+ı jöndöösünün praktikalyk baasy: bul — tildegi eŋ köp kezdeşken ündüünü kamtygan ar bir makalanyn ordu almaşyşy, bir tamganyn ordu emes.

Eki çoŋuraak jylyş tablitsadan tyşkary kalat, antkeni tablitsa latyndy kirillitsaga emes, latyn konfiguratsiíalaryn biri-birine salyştyrat. `ç` tamgasy `c` tamgasyna baílangandyktan, *Чычкан* kirillitsa alfavitinin jyíyrma segizinçi tamgasynan latyn alfavitinin üçünçü tamgasyna jylat, oşonduktan attardyn körsötküçü aílandyrganda jylyp kalbaít, kaíra bölümdörgö bölünöt. Birinçi tamgasy bir neçe simvoldon turgan grafemaga aílangan söz bölümün taptakyr almaştyrat: *Екатеринбург* `Íekaterinburg` bolup `Í` bölümünö, başka bardyk `E` attarynan alys jaígaştyrylat.

---

## 18. Kirillitsaga kaíra aílandyruu

Kirillitsa→latyn aílandyruusu determindüü jana erejege negizdelgen: ar bir Jany-Latyn formasy sözdüksüz, pozitsiíaga jana ündüü çöírösünö karap eseptelet. Latyn→kirillitsa aílandyruusu da determindüü, al töl kyrgyz leksikasyn tak kalybyna keltiret, birok kirme sözdör üçün **jogotuusuz emes**. Kirillitsa→latyn dal keltirüüsü köptön birge bolot, antkeni orusça kirme sözdördö gana bolgon bir neçe kirillitsa aíyrmaçylygy ataíylap biriktirilgen, al emi biriktirilgen aíyrmany kalybyna keltirüügö bolboít.

§18.1 jana §18.2 bölümdörü orfografiíaga baa bergen ar bir adamga arnalgan: konverter kirme sözdör menen emne kylat jana emne üçün. Işke aşyruu kaítalaşy kerek bolgon nerseler A–C tirkemelerde, al emi alfavittik tartip §17 bölümündö anyktalgan.

### 18.1 Töl sözdün artykçylygy erejesi

> **Eki kirillitsa jazylyşy bir ele latyn sabyna dal kelgen jerde teskeri aílandyruu töl kyrgyz leksikasynda kezdeşkenin kalybyna keltiret. Jogoluşuna jol berilgen aíyrmaçylyktar — orusça kirme sözdördö gana bolgon aíyrmaçylyktar.**

Bul jalgyz ereje ar bir eki maanilüü uçurdu çeçet; al 1-printsipten kelip çygat: avtomattyk aílandyruudan aman-esen ötüşü kerek bolgon korpus — kyrgyz korpusu.

Tablitsada kaísy jogotuular paída boloru jarym-jartylaí §23.6 açyk kaltyrgan suroodon köz karandy: kirme sözdör orusça bulagy boíunça jazylaby je kyrgyzça aítylyşy boíunça jazylaby. *poet → поет* jana *aeroport → аеропорт* uçurdagy jakyndatuuçu mamilede jogotuu bolot, al emi bulakka ylaíyk mamilede andaí bolmok emes.

| Latyn | Kaíra aílanat | Sebebi | Emne jogolot |
| :--- | :---: | :--- | :--- |
| `ts` | **тс** | Töl т+с köp kezdeşet jana önümdüü: *кетсе*, *айтса*, *өтсө* | kirme `ц`: *tsirk → тсирк* |
| ündüüdön kiíinki `íe` | **йе** | Uŋgunun bütündügü: *kií-* → *кийет*, *tií-* → *тийет* | kirme sözdögü ündüüdön kiíinki `е`: *proíekt → пройект*; *-аев*, *-иев* menen bütkön familiíalar: *Musaíev → Мусайев*; *tiíeşelüü → тийешелүү*: uŋgu *тий-* saktalat, al emi kabyl alyngan jazylyşy *тиешелүү* |
| söz başyndagy `íe` | **е** | Bir da töl söz йе menen baştalbaít | — |
| `ío` | **ё** | Kyrgyz tili töl йо udaalaştygyn muruntan ele `ё` menen jazat: *коён* | kirme `йо`: *raíon → раён* |
| `ía` | **я** | Töl kyrgyz tilinde jarym ündüüsüz `и`+`а` hiatusu jok, oşonduktan bul udaalaştyk bardyk pozitsiíada bir maanilüü | kirme `ья`: *semía → семя* |
| ündüüdön kiíinki `i` | **й** | Toluk forma й tamgasyn `í` menen jazat, birok jönököí forma (§19) jana synoo çöírösünün `i` jarym ündüüsü any `i` menen jazat, al emi töl ай, ой, үй ündüüdön kiíin и kelgen kirme sözdördön alda kança köp: *bai → бай*, *tooi → тоой* | kirme sözdögü ündüüdön kiíinki `и`: *ukrain → украйн*, *arhaizm → архайзм* |
| `ş` | **ш** | Töl leksika üçün 1:1 | kirme `щ`: *borş → борш* |
| murunku `sh` | **ш** | Töl ш köp kezdeşet; töl с+х aíkalyşy kezdeşpeít | digraf rejimindegi *Ishak* aty |
| ündüüdön kiíinki `e` | **е** | Jakyndatuu; kyrgyz tilinde bul pozitsiíada töl э jok | kirme `э`: *poet → поет* |
| tüşürülgön `ь`, `ъ` | *(эч нерсе)* | Kalybyna keltirilbeít | *aprel → апрел* |

Töl tekstke `ts`, ündüüdön kiíinki `íe` jana murunku `sh` gana taasir etet; kalgan saptar kirme sözdün kaísy jazylyşy jogolorun gana çeçet. Eŋ maanilüüsü — `ts`, antkeni şarttuu yŋgaí `т` menen bütkön ar bir uŋguda morfema çeginin eki jagyna `т`+`с` aíkalyşyn jaratat, oşonduktan `ts` tamgalaryn kaíra `ц` kyluu töl formalardyn açyk klassyn buzmak.

### 18.2 Kirme sözdördü kalybyna keltirüünün mildettüü emes tizmesi

Kirme sözdördün jazylyşynyn jogoluşuna korpus menen iştöödö jol berilet, al emi, misaly, íuridikalyk tekstti aílandyruuda jol berilbeít. Oşonduktan etalonduk mehanizmde çakan, açyk dokumentteştirilgen **kirme sözdördü kalybyna keltirüü tizmesi** bar: bul — kirillitsadagy formasyn ereje menen çygaruuga bolboí turgan belgilüü kirme sözdör (*semía → семья*, *statía → статья*, *Ishak → Исхак* jana uşul syíaktuular); tizme erejege negizdelgen özöktün üstünö koşulat jana any öçürüp-küígüzüügö bolot.

Tizme — izdöö tablitsasy; arhitektura tuuraluu yrastoo «eç jerde sözdük jok» degenden taryraak: özök öz aldynça toluk jana sözdüksüz, al emi tizme özök jogotuuluu dep muruntan belgilegen kirme sözdördün jazylyştaryn gana kalybyna keltiret. Al töl leksikaga eç kaçan taasir etpeít jana kirillitsa→latyn natyíjasyn eç kaçan özgörtpöít.

Tizme özünün asimmetriíasyn kirgizet: *ishak* sözün *Исхак* kylyp kalybyna keltirgen özgöçö uçur digraf rejiminde orusça *ишак* kirme sözün tuura emes kalybyna keltiret. Bul kompromiss ataíylap jasalgan, antkeni dokumentterde dal oşol ençilüü at kezdeşet.

Tizme kaída toktoorun da uşul ele ereje anyktaít. *Асхат* `Ashat` bolup aílanat da, kaíra *Ашат* bolup kaítat, any tizmenin bir da punktu oŋdoí albaít: digraf menen kirgizüüdö `ashat` oşondoí ele töl *ашат* sözü, any §18.1 erejesi birinçi kezekte kalybyna keltiret. *Исхак* tizmege kire algan, antkeni al sürüp çygargan *ишак* sözü — kirme söz. Tizmede ataandaşy kirme söz bolgon atty saktoogo bolot, al emi ataandaşy kyrgyz sözü bolgon atty saktoogo bolboít; bul özgöçö uçurlardyn tizmesi kandaídyr bir çygymga turat degen jalpy etiíattyktan bekemireek çek.

---

## 19. Eki deŋgeel: toluk forma jana jönököí forma

Jany-Latyn aílanma jolu tirkelgen bir jazuunu emes, eki deŋgeeldi birge anyktaít.

**Toluk forma** — `ö`, `ü`, `í`, `ŋ`, `ç`, `ş` — bul bütün forma: basma söz, sözdüktör, rasmií tekstter, synoo çöírösünün demeíki natyíjasy jana orfografiía özü katary körsötülgön ar bir jer.

**Jönököí forma** — özgörtülbögön klaviaturalar üçün ASCII koddoosundagy forma:

`ö → o`, `ü → u`, `í → i`, `ŋ → n`, `ç → c`, `ş → s`

Ar bir tamga diakritikasyn gana jogotot, başka eç nersesin jogotpoít. *Çaí* — `cai`, *şaar* — `saar`, *jaŋy* — `jany`, *biíik* — `biiik` bolot.

Anyn orduna `ç → ch` jana `ş → sh` dep dal keltirüünün paídasyna jüíö çynygy: digraftar okurmanga tybyşty jakşyraak bildiret; adamdar da bügün dal uşundaí teret (*chai*, *jakshy*). Birok bul jerde eki jagdaí andan basymduuluk kylat. Birinçisi — yraattuuluk: eger kalgan ar bir tamga belgisin jogotso, şybyş ünsüzdör da jogotuşu kerek; oşondo jönököí forma toluk forma menen ataandaşpaí, anyn formasyn üírötöt: `cai` dep tergen okurman `çaí` formasynan bir gana diakritika alys, al emi `chai` dep tergen okurman sözdün başka formasyn jazyp jatat. Ekinçisi — birdeílöö: diakritikany standarttuu alyp saluu muruntan ele `ç→c` jana `ş→s` kylat, oşonduktan bul dal keltirüüdö jönököí forma birdeílengen formanyn *özü* bolot, izdöö birdeílöösü deerlik beker bolot (B tirkeme). Digraftarda eki forma ar başka açkyçtarga birdeílenet; ar bir indeks ataíyn iştetüünü talap kylat.

Digraftuu rezervdik tür ötkööl münözdö, ekinçi redaktsiíalyk stil emes; dolboordun algaçky versiíalarynda `ch`/`sh` negiz katary koldonulgan. Bagyt belgini alyp saluuçu dal keltirüügö karaí ketet: anda `ç` tamgasyn özdöştürgön okurman *çöírö* sözün künümdük jazuuda *coiro* dep jazat jana any oşol ele söz katary okuít.

Munun baasy — birigüü. `ş` tamgasynyn belgisin alyp, `s` kyluu any töl `s` menen biriktiret: *баш* jana *бас* eköö teŋ `bas`, *аш* jana *ас* eköö teŋ `as` bolup kalat. Digraftuu rezervdik tür bul birigüüdön kaçat, birok `sh` ≈ с+х kagylyşyn kaíra alyp kelet jana sözdü uzartat. Bul — çynygy kompromiss, oşonduktan synoo çöírösü rezervdik türlördün **eköönü teŋ** işke aşyryp, okurmanga alardy çynygy tekstte salyştyruuga mümkündük beret. Munu çeçüünün tuura jolu — ar bir dal keltirüü korpus boíunça kança özünçö sözdü biriktirerin eseptöö (§23.3).

Jönököí formada ansyz dele birigüülör bar, daíyma bolup kelgen: `кол` jana `көл` eköö teŋ `kol` bolup çygat; `жаңы` jana `жаны` eköö teŋ `jany` bolup çygat. Bul kyrgyzça süílögöndör muruntan ele bildirüülördü kandaí jazsa, oşogo dal kelet, al emi eki maanilüülük rasmií emes jazuu any daíyma kandaí çeçse, oşondoí çeçilet: kontekstten, oşol zamat.

Jönököí formanyn eki kasiíeti anyn negizinde emne kuruu mümkün ekenin çekteít:

- **Jönököí forma bir taraptuu.** `biiik` formasyn `biíik` formasyna mehanikalyk türdö kalybyna keltirüügö bolboít, `cai` formasyn da `çaí` je `чай` formasyna kalybyna keltirüügö bolboít. ASCII tekst — akyrky çekit, aralyk forma emes. Aílandyruu kuraldary any kirgizüü katary koldon kelişinçe kabyl alyşy kerek, birok kaítarym aílandyruuga jöndömdüü dep yrastabaşy kerek.
- **Bul azyrky adattan çettöö, any süröttöö emes.** `ö→o`, `ü→u`, `í→i` jana `ŋ→n` adamdardyn azyr tergenine dal kelet. Al emi `ç→c` jana `ş→s` dal kelbeít; *chai* jana *jakshy* — janduu formalar. Bul dal keltirüü — adatty toluk formaga karaí tartuu araketi; bul normativdik tandoo, any süröttööçü tandoo katary körsötüügö bolboít.

---

## 20. Baaloodogu tamgalar: `ä`, `x`, `w`

Kyrgyz kebinde kyrgyz kirillitsasy jazbagan üç tybyştyk aíyrma ugulat. Latyn jazuusunda üçöö üçün teŋ tamgalar bar, alardy terüü oŋoí, birok alardyn jüíölörü birdeí küçtüü emes: `ä` tamgasynyn turuktuu status aluuga jüíösü bar, al emi tömöndö jüíölöngöndöí, `x` menen `w` tamgalarynyn andaí jüíösü jok. Synoo çöírösü alardy demeíki boíunça öçük turgan baaloo toptomu katary sunuştaít.

| Jup | Aíyrmasy | Kaída kezdeşet |
| :--- | :--- | :--- |
| `a` / `ä` | joon /ɑ/ menen içke /æ/ | Tüştük süílöşü (*äkä*, *källä*); adabií kyrgyz tilinde da farsy tilinen kirgen sözdör jana regressivdüü assimilíatsiía arkyluu |
| `h` / `x` | glottaldyk [h] menen velíardyk [x] | kirme sözdör; süílööçügö, aímakka jana bulakka jaraşa ar türdüü aítylat (*haram*, *halal*, *Buhara*) |
| `v` / `w` | erin-tiş [v] menen [w] | kirme sözdör, oşondoí ele ündüülör arasyndagy /b/ fonemasynyn aítylyşy |

Üçöönün biri da kirillitsadan çygarylbaít. Kyrgyz kirillitsasy bir `а`, bir `х` jana bir `в` jazat, oşonduktan konverter kaísy sözdör kirme ekenin bilbeí turup baştapky tekstten `ä`, `x` je `w` tamgasyn çygara albaít. Oşonduktan alar — **jazuu rejiminin tamgalary**: adam latynça tüz jazganda koldonulat, avtomattyk aílandyruu alardy eç kaçan çygarbaít. Teskeri konverter alardy kirgizüü katary kabyl alyp, ar birin negizgi tamgasyna birdeíleít (`ä → а`, `x → х`, `w → в`); bul — §18.1 töl sözdün artykçylygy erejesinin jaŋy uçurga koldonuluşu: aíyrma latynça saktalat da, kaíra aílandyruuda jogolot, kirme `ц` jana `щ` tamgalaryndagydaí tak oşondoí. Izdöö birdeílöösü alardy uşundaí ele biriktiret, oşonduktan jogolgon aíyrma indeksti bölüktörgö bölböít.

Fonologiíalyk iş atkargan tamga — `ä`. Al emi kalgan eköö kirme sözdördün jazylyşyn taktaít. `ä` ündöştük tibin belgileít, al emi `q` erejesi dal uşul ündöştük tibin okuít: *äkä*, *ükä* jana *källä* içke ündöştüktögü sözdör, alarda velíardyk [k] aítylat, al emi *aqa* jana *qalla* joon ündöştüktögü sözdör, alarda uvulíardyk [q] aítylat. `ä` jok bolso, ereje bulardy ajyrata albaít; al bolso, erejege kerektüü maalymat bar bolot. Eksperiment myndan tüz kelip çygat: tüştük süílöşündögü tekstti `q` rejiminen `ä` koldonboí jana any menen ötkörüp, ekinçi konfiguratsiía tagyraak bolobu, oşonu ölçöö kerek.

`x` tamgasynyn jüíösü `w` tamgasynykyndaí ele alsyz, bolgondo da andan negizgireek sebepten ulam: al jaza turgan aíyrma sözdördün ortosundagy oppozitsiía emes. Süílööçü *haram*, *halal* je *Buhara* sözdöründö kaísy jylçykçyldy koldonoru sözgö emes, kim jana kaída süílöp jatkanyna köz karandy, oşonduktan bir da kyrgyz sözünün jubu [h] jana [x] arkyluu aíyrmalanbaít. Bul tybyştardy alyp jürgön kirme sözdör arab, farsy, çagataí jana orus tilderinen ar türdüü joldor menen kelgen, kyrgyz tili alardyn ar birin özdöştürgöndö baştapky ünsüzdü özgörtüp jibergen. Keede any tüşürüp salgan: *mahalla* sözünön *маала* (oşondoí ele *маале*). Keede any velíardyk ünsüzgö aílandyrgan: *muhabbat* sözünön *махабат*. Keede any `к` jarylmasyna aílandyrgan: *Ыктыяр* menen *Ихтияр*, *Ыскак* menen *Исхак*, *Аскат* menen *Асхат*. Bul sözdördün jana attardyn köbü birden aşyk formada koldonulat, alardyn arasynan tandoo jazuu erejesinin işi emes. Anyn keregi da jok: jylçykçyl saktalgan jerde Jany-Latyn jazuusundagy `h` any süílööçü kandaí aítsa da jazat, kirillitsadagy `х` seksen alty jyldan beri uşundaí jazyp kelgendeí; al emi `к` bolup kalgan je jogolgon jerde belgileí turgan eç nerse kalbaít.

`x` tamgasynyn kalgan ekööndö jok dagy bir baasy bar. Kandaí gana latyn teksti bolbosun, `x` tamgasynyn muruntan ele bardyk jerde kezdeşken el aralyk maanisi bar (*Linux*, *LAX*, *X Factor*, *taxi*), kyrgyz okurmany myndaí saptarga daíyma jolugat. `x` tamgasyn velíardyk jylçykçyl üçün kabyl aluu bir tamgaga bir da ereje ajyrata albagan eki okuluştu bermek jana izdöö birdeílöösün da koşo tataaldaştyrmak. Oşentip, bul bölüü kyrgyzça süílögöndör sözdördü aíyrmaloo üçün koldonbogon aíyrmany belgileít jana el aralyk maanisin saktoogo arzyí turgan tamgany korotot. Synoo çöírösü `x` tamgasyn masele dagy ele açyk bolgonduktan emes, any çynygy tekstte synap körüü üçün baaloo toptomunda saktaít.

`w` da uşul syíaktuu ele synoodon ötpöít, antkeni ündüülör arasyndagy [w] negizinen /b/ fonemasynyn aldyn ala bilüügö bolo turgan aítylyşy, oppozitsiía emes, al emi 3-printsip boíunça aldyn ala bilüügö bolo turgan allofondorgo tamga berilbeít; §8 bölümündö `k` tamgasyn birdiktüü kylgan da uşul ele oí jügürtüü. Eger `w` orun tapsa, al orundu aga kirme sözdör beret.

Bul toptomgo koşulgan ar bir nerse üçün çektööçü printsip: tybyş any koldongon süílööçülör üçün sözdördü aíyrmalaşy kerek, kirillitsa any bere albaşy kerek jana al çöírösünö karap aldyn ala bilinbeşi kerek. `ä` üçöönön teŋ ötöt, al toptomdogu eŋ küçtüüsü. `x` birinçisinen ötpöít, antkeni anyn [h] jana [x] tybyştary sözgö emes, süílööçügö jana aímakka jaraşa özgöröt. `w` üçünçüsünön ötpöít.

---

# III bölük — Kontekst

Кыргыз тили üçün latyn orfografiíasy fonologiía, tipografiíalyk injeneriía jana künümdük sanariptik praktika kesilişken jerde turat; bul masele gipotetikalyk emes. 2024-jyldyn sentíabrynda Bakuda ötkön jyíynda Türk akademiíasynyn jana Türk mamleketterinin uíumunun aldynda iştegen Türk düínösünün jalpy alfaviti boíunça komissiía 34 tamgaluu Jalpy türk alfavitinin (CTA) sunuştalgan variantyn makuldaşkan [[1]](#ref1)[[2]](#ref2). Kyrgyzstan — Türk mamleketterinin uíumuna müçö mamleketterdin içinen kirillitsadan baş tartuu çeçimin kabyl albagan jalgyz mamleket [[2]](#ref2), al emi oşol süílöşüülördö ölkönün atynan katyşkan kyrgyz til ilimpozu Syrtbaí Musaíev kyrgyz тили üçün 28 tamgaluu latyn alfavitinin dolbooru daíar ekenin jana prezidenttin jana parlamenttin saíasií çeçimin kütüp turganyn aítkan [[2]](#ref2)[[3]](#ref3). Prezident Sadyr Japarovdun bildirilgen pozitsiíasy boíunça, ötüünü talkuuloo erte, al emi mamlekettik tildi önüktürüü kirillitsada ulantylyşy kerek [[3]](#ref3).

## 21. Jany-Latyn jana muruntan bar sistemalar

### 21.1 Kyrgyz tilinin koldonulup jürgön romanizatsiíalary

Kyrgyz tilinin jalpy kabyl alyngan romanizatsiíasy jok; geografiíalyk atalyştar üçün ökmöt BGN/PCGN sistemasyn kabyl algan [[8]](#ref8). Koldonuuda tört sistema bar, Jany-Latyn alardyn ar biri menen ar başkaça baílanyşta.

| Kirillitsa | BGN/PCGN | ALA-LC | ISO 9 | CTA | **Jany-Latyn** |
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
| ъ / ь | ˮ / ʼ | ʺ / ʹ | ʺ / ʹ | ʺ / ʹ | *(сиңирилет же түшүрүлөт)* |

(BGN/PCGN, ALA-LC, ISO 9 jana CTA mamylary [[8]](#ref8) boíunça berildi.)

**BGN/PCGN** — Kyrgyzstanda rasmií statuska ee bolgon sistema; Jany-Latyn any menen taanyluuçuluk üçün eŋ maanilüü tamgalar boíunça dal kelet: `ж` üçün `j` jana içke erindik ündüülör üçün `ö`/`ü`. Bul — çet eldik okurmandar üçün transkriptsiía, orfografiía emes, bul baíkalyp turat: al `й` tamgasyn da, `ы` tamgasyn da `y` menen jazat, oşonduktan *тыйын* — *tyyyn* bolup kalat, al emi anyn `ch`, `sh`, `kh`, `ng` digraftary morfema çekterinde kagylyşat. Anyn küçtüü jagy — `ö` jana `ü` tamgalarynan başka tamga talap kylbaít; alsyz jagy — al eç kaçan kyrgyzça süílögöndör jazyşy üçün tüzülgön emes.

**ALA-LC** — kitepkana katalogdoo standarty, al koşuluuçu belgiler arkyluu (`n͡g`, `u̇`, `ĭ`) teskeri aílandyryluuçulukka ylaíyktalgan. Al jarym ündüü boíunça Jany-Latyn syíaktuu ele intuitsiíaga taíangan jalgyz sistema: `й` tamgasyn `ĭ` menen, başkaça aítkanda `i` üstündögü belgi menen jazat. Birok anyn koşuluuçu diakritikalyk belgileri bir kalypta normaldaştyrylbaít jana kadimki klaviaturada terilbeít.

**ISO 9** — belgilüü bir tilge ylaíyktalbaí, jazuu sistemasynan köz karandysyz bolup tüzülgön, kirillitsany latynga mehanikalyk türdö dal keltirüü. Al `й` tamgasyn `j`, al emi `ж` tamgasyn `ž` menen jazat; `ж` [dʒ] bolgon tildin köz karaşynan bul tak teskerisinçe. Al kaítarym aílandyruuda kemçiliksiz, birok naçar okulat; bul bibliografiíalyk standart üçün jüíölüü kompromiss, al emi orfografiía üçün andaí emes.

**CTA** §21.2 bölümündö karalat.

Jany-Latyn jazuusunun törtöönön teŋ aíyrmasy başka maksattan kelip çygat. Bul sistemalar kyrgyz tilin başka tilde okugan adamdar üçün *latynga* transkriptsiíalaít. Al emi Jany-Latyn kyrgyz tilin ene tili katary süílögöndör intuitivdüü okuşu üçün tüzülgön.

### 21.2 Jalpy türk alfaviti

2024-jyldyn sentíabrynda Bakuda makuldaşylgan 34 tamgaluu CTA [[1]](#ref1)[[2]](#ref2) türk düínösü üçün jalpy negiz katary karalgan, ar bir ölkö any uluttuk deŋgeelde özünö yŋgaílaştyrat [[3]](#ref3). Jany-Latyn kyrgyz fonologiíasy koldogon bardyk jerde CTA alfavitinin funktsionaldyk özögü menen dal kelet (`ö`, `ü`, `ç` jana `ş` tolugu menen dal kelet). Alty tamga aíyrmalanat, alardyn ar biri II bölüktö jüíölöngön: `й` (§10), `ж` (§11), `ы` (§9), `к` jana `г` (§8), oşondoí ele `ң` (§14).

**CTA `y` koldongon jerde `í`.** CTA `y` tamgasyn jarym ündüügö koroto alat, antkeni al `ы` tamgasyn çekitsiz `ı` tamgasyna ötköröt; Jany-Latyn bolso `y` tamgasyn `ы` üçün muruntan ele korotkon (§10).

Jany-Latyn azyrky kyrgyz koldonuusunan baştaít jana CTA sunuştagan jakyndaşuunun köbün kabyl alat. CTA alfavitinin 34 tamgasynyn üçöönün kyrgyz tilinde atkara turgan işi jok: `Ə` — ündüülör kuramynan tyşkarky ündüü, `Ū` — kazakça `ұ`, al emi `х` tamgasy `h` menen jazylgan jerde `X` aşykça. Kalgan 31 tamganyn 26 tamgasyn Jany-Latyn kabyl alat, alardyn içinde `ç`, `ş`, `ö` jana `ü` bar (§17.3). Al törtöönön baş tartat: sözdükkö köz karandylyktan ulam `c` (§11), `q` jana `ğ` (§8), oşondoí ele baş/kiçine tamgaga aílandyruu jana maída şrift aga emne kylarynan ulam `ı` (§9); al emi CTA `ñ` koldongon jerde `ŋ` jazat (§14); `ы` tamgasyn `y` menen jazuu çekittüü baş tamga `İ` kerektigin da jokko çygarat. `ñ` orduna `ŋ` koíulup, CTA alfavitinde eç kandaí türdö jok, Jany-Latyn jazuusundagy jalgyz tamga — `í` koşulganda, alfavit 28 tamgaga jetet, al emi bul aíyrma — bir katar çeçimder, jetişsizdik emes. Kazakça tandoolor da uşundaí ele tarazalangan: `ū` je `ұ`, oşondoí ele saktalgan kirillitsa `ө` jalpy `ü` jana `ö` tamgalarynyn paídasyna çetke kagylgan (§12.1). Çetke kagylgan ar bir tamga synoo çöírösündö kalat, anyn CTA ülgüsündögü daíar jöndöösü toluk 31 tamgaga jetüü üçün alardyn baaryn alat, oşonduktan jarym-jartylaí je toluk kabyl aluu — bir jöndöö, özünçö fork emes, any Jany-Latyn menen bir ele tekstte baaloogo bolot.

Tamgalardan tyşkary, CTA alfavitin tolugu menen kabyl alboonun jüíösü tüzümdük münözdö. Kyrgyz tilinde türkçödö jok fonemalyk ündüü sozuluşu bar; kyrgyzça `ж` — affrikat, al emi türkçö `j` — jylçykçyl; kazak tilinde kyrgyz tilinde bolbogon şybyş ünsüzdördün jylyşy bolgon. Öz fonologiíasyna ylaíyktalgan orfografiía fonologiía dal kelgen jerde jalpy türk standarty menen dal kelet, dal kelbegen jerde andan ajyraít; jogoruda dal uşundaí körünüş baíkalat. CTA özü munu aldyn ala eske alat: Bakudagy bir katyşuuçu 34 tamganyn baaryna muktaj bolbogon til alfavitti özünö yŋgaílaştyra alaryn belgilegen [[3]](#ref3).

Tilge tiíeşesi jok dagy bir çygym bar: türkçö, azerbaíjança je özbekçe jazuu menen deerlik birdeí jazylyş maşinalar kiçireek tildi aíyrmaloo üçün koldongon belgini jok kylat. §22 bul maseleni jakyndaşuunun jüíölörü menen birge karaít.

#### Ar bir jöndöödögü bir ele sözdör

Bul jerde konverter kirme sözdörgö kandaí mamile kylaryna eç nerse köz karandy bolboşu üçün töl leksika gana berildi. `q` jazylaby je jokpu — sözdük maselesi, alfavit maselesi emes.

| Kirillitsa | Jany-Latyn | q+ğ | q+ğ+ı | CTA ülgüsündö (q+ğ+ı+c+ñ) |
| :--- | :--- | :--- | :--- | :--- |
| кыргыз | kyrgyz | qyrğyz | qırğız | qırğız |
| жазуу | jazuu | jazuu | jazuu | cazuu |
| айылдар | aíyldar | aíyldar | ayıldar | ayıldar |
| бийик | biíik | biíik | biyik | biyik |
| Жаңы | Jaŋy | Jaŋy | Jaŋı | Cañı |

Al emi baílanyştuu tekstte:

> **Kirillitsa.** Адамдардын бир-бири менен алмашкан каттары, эл аралык иммуногистохимия же башка техникалык журналдарда чыккан изилдөө макалалар, элге белгилүү болгон ырлар жана чыгармалар — баары бир алфавитте жазылат.
>
> **Jany-Latyn.** Adamdardyn bir-biri menen almaşkan kattary, el aralyk immunogistohimiía je başka tehnikalyk jurnaldarda çykkan izildöö makalalar, elge belgilüü bolgon yrlar jana çygarmalar — baary bir alfavitte jazylat.
>
> **q+ğ.** Adamdardyn bir-biri menen almaşqan qattary, el aralyq immunogistohimiía je başqa tehnikalyq jurnaldarda çyqqan izildöö maqalalar, elge belgilüü bolğon yrlar jana çyğarmalar — baary bir alfavitte jazylat.
>
> **q+ğ+ı.** Adamdardın bir-biri menen almaşqan qattarı, el aralıq immunogistohimiya je başqa tehnikalıq jurnaldarda çıqqan izildöö maqalalar, elge belgilüü bolğon ırlar jana çığarmalar — baarı bir alfavitte jazılat.
>
> **CTA ülgüsündö.** Adamdardın bir-biri menen almaşqan qattarı, el aralıq immunogistohimiya ce başqa tehnikalıq jurnaldarda çıqqan izildöö maqalalar, elge belgilüü bolğon ırlar cana çığarmalar — baarı bir alfavitte cazılat.

CTA ülgüsündögü sap sözdügü bar adam jaza turgandaí jazylgan: töl `ж` — `c` (*ce*, *cana*, *cazılat*), kirme sözdögü `ж` — `j` (*jurnaldarda*), joon ündöştüktögü töl `г` — `ğ` (*bolğon*, *çığarmalar*), al emi kirme söz jönököí `g` tamgasyn saktaít. Synoo çöírösü bul saptyn kalgan bardyk özgöçölüktörün kaítalaít. Al jarata albagan nerse — `c` rejimindegi teksttegi *jurnaldarda*: bul rejim ar bir `ж` tamgasyn `c` menen jazyp, *curnaldarda* formasyn jaratat; bul boştuktu kaísy sözdör orusça kirme ekenin bilüü gana tolturat.

Bul üzündü jaraşyktuu okuluş üçün emes, konfiguratsiíalardyn aíyrmasy közgö körünüp turuşu üçün tüzülgön; andagy eki sözdü saptar boíunça baíkap körüügö arzyít.

- *Техникалык* bir ele sözdün içinde `k` menen `q` tamgasyn körsötöt: `q` saptarynda al *tehnikalyq* — kirme uŋgunun velíardyk `k` tamgasy töl müçönün uvulíardyk `q` tamgasynyn janynda turat. Eŋ jakyn ündüünü okugan ereje munu kokusunan tuura jazat, töl *bolğon* sözünün janyndagy *immunogistohimiía* sözünün jönököí `g` tamgasyn tuura jazgandaí ele; birok *tehnika* kirme söz ekenin erejege eç nerse aítpaít, oşonduktan oşol ele evristika *qosmos* jana *parq* formalaryn da jaratat.
- *Immunogistohimiía* sistemalar til ulam özdöştürüp jatkan leksika menen emne kylaryn körsötöt: `х` üçün `h`, akyrky `я` üçün `ía`, koş ünsüzdör özgörüüsüz kalat, oşondoí ele söz uşunçalyk uzun, okuluşu da, irettelişi da anyn büt uzundugunda saktalyşy kerek.

### 21.3 Musaíevdin taryhyí jandandyruusu

I. Arabaíev atyndagy Kyrgyz mamlekettik universitetinin til ilimi institutunun direktoru, 2024-jylky Baku süílöşüülöründö Kyrgyzstandyn öküldörünün biri Syrtbaí Musaíev Tynystanovdun dolbooruna negizdelgen 28 tamgaluu latyn alfavitin sunuştaít; anyn jüíösü boíunça, bul alfavit kyrgyz tilinin fonemalyk tüzülüşün toluk saktaít, oşonduktan eç kandaí tildik köígöí jaratpaít [[3]](#ref3).

Eki sunuştun makul bolgon jerleri aíyrmalangan jerlerinen köp. Eköö teŋ `ö`, `ü`, `ç`, `ş` koldonot, eköö teŋ `ы` üçün `y` koldonot [[3]](#ref3). Aíyrmaçylyktar anyn sunuşu jandandyruu, al emi bul sunuş jaŋy dolboor ekeninen kelip çygat: anyn alfaviti Tynystanovdun alfavitinde bolgon `k`/`q` bölüüsün kaíra kirgizet, Tynystanov menen CTA alfavitin eerçip `ж` tamgasyn `c` menen jazat jana velíardyk murun ünsüzün eng tamgasy menen emes, `ņ` menen belgileít. Eköö teŋ bir ele negizgi tamgany bir ele sebep menen belgileít, birok birdeí ykma menen emes: `ņ` — astyna sedil tirkelgen `n`, al emi `ŋ` jana Tynystanovdun `ꞑ` tamgasy tamganyn özünün syzygyn negizgi syzyktan tömön tüşüröt. Oşondoí ele eköönün içinen `ŋ` şriftterde jana El aralyk fonetikalyk alfavitte jakşyraak koldoogo ee.

Myndan da maanilüü aíyrma tildik emes. Musaíevdin sunuşunun myízamga aílanyşynyn yktymal jolu bar, al emi bul dolboordo andaí jol jok, al andaí jol bar dep da aítpaít. Jany-Latyn jazuusunun salymy başka tarapka bagyttalgan. Al bügün iştep turgan programma katary bar jana 1920-jyldardagy alfavit eç kaçan joop berüü üçün tüzülbögön maselelerdi çeçüü üçün iştelip çykkan: kirillitsa menen determindüü kaítarym aílandyruu, tokenizatsiía, izdöö birdeílöösü jana jönököí ASCII formasy. Eki sunuş bir ele mildet üçün ataandaşpaít.

### 21.4 Ölkö içindegi başka sunuştar

Musaíevdin dolbooru — kyrgyz latyn jazuusunun jalgyz dolbooru emes. qyrgyz.com saítynda jaryíalangan, taryhçy Tynçtykbek Çorotegin jana başkalardyn katyşuusu menen iştelip çykkan 30 tamgaluu alfavit da 1930-jyldardagy latyn alfavitinen baştaít, birok anyn seírek tamgalaryn zamanbap kylat: `Ƣ` orduna `Ğ`, `Ь` orduna `Y` koíot, al emi `Ꞑ`, `Ɵ` jana `Y` tamgalaryn `Ñ`, `Ö` jana `Ü` türünö keltiret [[12]](#ref12).

Jany-Latyn any menen `ы` üçün `Y`, oşondoí ele `Ö` jana `Ü` boíunça dal kelet: bul — üç özünçö dolboor köz karandysyz türdö kelgen üç çekit. Al `Ğ` jana `Ñ` boíunça aíyrmalanat, ar bir uçurda ar başka sebep menen. `Ğ` jandandyruuda saktalat, antkeni Tynystanovdun alfavitinde `Ƣ` bolgon; birok al 1-printsipten aman ötö albaít. `Ñ` boíunça çeçim kyíynyraak, antkeni eki dolboor teŋ bir ele tamgany — Tynystanovdun `Ꞑ` tamgasyn — zamanbap kylat jana anyn orduna emne kelişi kerek ekeni boíunça pikir kelişpeít: `Ñ` belgini tamganyn üstünö tilda türündö jyldyrat, al emi `Ŋ` tömön tüşkön syzykty saktaít. Eki korutundunu fonologiía emes, baştapky çekit ajyratat; fonologiíany eki dolboor teŋ birdeí okuít.

### 21.5 Kazakstan menen Özbekstandyn tajryíbasy emneni körsötöt

Kazakstan — koldo bolgon eŋ paídaluu salyştyruu, antkeni al jarlyk menen künümdük koldonuunun ortosunda alfavitke emne bolorun körsötöt. 2017-jylky jarlyk apostrofko negizdelgen alfavitti kirgizgen, al keŋiri şyldyŋga kalgan; 2018-jyldyn fevralynda ekinçi jarlyk apostroftordu akuttar menen almaştyrgan [[13]](#ref13); akuttuu variant da öz kezeginde, jarym-jartylaí akuttar jana anda saktalgan digraftar üçün synga kabylgan [[14]](#ref14); al emi 2021-jyly kiíinki redaktsiía umlauttardy, makrondu, breveni jana sedildi koldongon 31 tamgaga toktogon — `ä`, `ö`, `ü`, `ū`, `ğ`, `ş` [[5]](#ref5). Al turgaí 2021-jyldyn içinde velíardyk murun ünsüzü íanvar jana aprel varianttarynyn ortosunda `Ŋ` tamgasynan `Ñ` tamgasyna özgörgön [[9]](#ref9). Ötüünü aíaktoo möönötü 2025-jyldan 2031-jylga jyldyrylgan [[15]](#ref15). Özbekstan ötüünü 1993-jyly baştagan, al dagy ele aíaktaí elek [[3]](#ref3), al emi 2021-jylky redaktsiíanyn dolbooru dagy ele `ng` digrafyn saktaít [[9]](#ref9).

Bul dokumentke üç sabak ötöt. Çeçilgendeí körüngön tamga deŋgeelindegi çeçimder kaíra açylat; bul — synoo çöírösün çygaruunun paídasyna jüíö, jarlyk çygaruunun emes. Diakritikalyk sistemalarga koomçuluk alar köp tekstte kandaí körünörünö karap baa beret, al emi fonologiíalyk logika talaşka seírek kiret. Oşondoí ele alfavitti kabyl aluu menen anda jazuunun ortosundagy aralyk on jyldyktar menen ölçönöt.

Üçünçü sabaktyn Kyrgyzstanda özünün varianty bar, al myndan da jakyn: 2004-jyly kabyl alyngan orfografiíalyk reforma koomçuluk any koldonuuga albagandan kiíin artka kaítarylgan [[3]](#ref3).

---

## 22. Sotsiolingvistikalyk jana saíasií kontekst

### 22.1 Kirillitsadan ketüünün saíasaty

Kyrgyz tili bir kylymdyn içinde alfavitin eki jolu almaştyrgan: 1928-jyly arabçadan latynga, 1940-jyly latyndan kirillitsaga. Kiíinki özgörüü, eger bolso, saíasattan kelip çygat, ilimden emes. Musaíev munu myndaíça jyíyntyktaít: alfavitter jana orfografiíalar Jogorku Keŋeştin toktomu menen kabyl alynat jana prezidenttin jarlygyn talap kylat, al emi ilimpozdor sunuş gana kyla alat [[3]](#ref3). 2023-jyldyn aprelinde Mamlekettik til boíunça uluttuk komissiíanyn töragasy parlamentke saíasií çeçim kabyl alynsa, ilimpozdor jana koomçuluk latynga ötüügö daíar ekenin aítkandan kiíin, prezident any el aldynda jemelep, bul talkuu erte ekenin jana mamlekettik tildi önüktürüü kirillitsada ulantylyşy kerek ekenin bildirgen [[3]](#ref3). Bir neçe kündön kiíin Orusiía Kyrgyzstandan süt azyktaryn importtoonu toktotup koígon [[18]](#ref18). Kyrgyzça süílögöndörgö bul kadam kançalyk gana sözsüz bolçudaí körünbösün, al Moskvadan bet buruu katary kabyl alynat, al emi joop sooda saíasaty türündö kelet.

### 22.2 Jalpy türk standarty kiçireek tilge emnege turat

Moskva latynga ötüünü kandaí kabyl alary koomçulukta daíyma talkuulanat; al emi alternativanyn baasy talkuulanbaít. Jalpy türk alfavitin tolugu menen kabyl aluu kyrgyz tilin til üí-bülösündögü eŋ iri jazma standart menen şaíkeş keltiret, al emi kiçireek til bul şaíkeştiktin baasyn özün koşunalarynan barakta aíyrmalap turgan nerseler menen tölöít.

Kirillitsa bul aíyrmany eki jol menen belgileít. Türkçögö jana latyn jazuusundagy başka türk tilderine karata jazuunun özü belgi bolup turat. Jazuusu birdeí kazak tiline karata munu tamgalar atkarat: kazak tili `ә`, `і`, `қ`, `ғ`, `ұ` jana `һ` tamgalaryn jazat, al emi kyrgyz tili alardyn birin da jazbaít, kazak tilinde jok eç bir tamgany da jazbaít [[4]](#ref4)[[15]](#ref15), oşonduktan kyrgyz tili jok nerse menen gana belgilenet. Jalpy ülgüdön alyngan latyn alfaviti latyn jazuusundagy ar bir koşuna üçün birinçi belgini jok kylat, al emi ekinçisin ar bir til özünö saktap kalgan tamgalarga kaltyrat.

Jogotuu kyska saptarda körünöt. Atalyştar, attar, heştegder, metamaalymattar jana izdöö suramdary deerlik eç kandaí belgi alyp jürböít, oşonduktan alardy anyktagan nerse kandaí bolbosun, apriorduk yktymaldykka taíanat, al emi apriorduk yktymaldyk korpustun kölömünö, korpustun kölömü bolso al tilde jazgan adamdardyn sanyna jaraşa bolot. Kyrgyzça süílögöndör türkçö süílögöndördön on ese çamaluu azyraak, kazakça süílögöndördön da azyraak, oşonduktan bul bölümdögü eki salyştyruunun ekööndö teŋ kyrgyz tili kiçireek tarap. Jany-Latyn *кылым* sözün `kylym` dep jazat — bul başka bir da tilge taandyk emes sap; al emi CTA ülgüsündögü jöndöö any `qılım` dep jazat, bul azerbaíjan tilinde *qılmaq* (кылуу) etişinin bir formasy. 2026-jyldyn sentíabrynda Google arkyluu izdelgende `qılım` oşol etişti çygargan, al emi kirillitsadagy *кылым* kyrgyz sözün çygarat. *жаным* sözü bar yrdyn atalyşy da uşundaí ele aírylyşka tuş bolot: `janym` — kyrgyzça, al emi `canım` — türkçö.

Uzunuraak tekst koopsuzuraak, anyn koopsuzduk çegi tilderdin ortosundagy aralykka jaraşa. Türkçögö karata eç nerse korkunuçta emes: kyrgyzça abzats alfavit kandaí bolbosun taanylyp turat, antkeni leksika jana morfologiía jazylyşka karaganda köbüröök aíyrmalanat. Kazak tiline karata bul çek taryraak, antkeni tilder uşunçalyk jakyn, leksika alardy azyraak işenimdüülük menen ajyratat, al emi jalpy ülgüdö tekst özün taanytkanga çeíin uzunuraak boluşu kerek. Bul — kuraldar jönündögü fakt, tekteştikke naarazyçylyk emes. Eki uçurda teŋ taasir kyska saptarda jana avtomattyk belgilöödö toptolot; any kantip ölçöönü jana emne üçün azyrynça türkçö menen salyştyruunu gana jürgüzüügö bolo turganyn §23.2 baíandaít.

Okutuu korpustary tüzülgön jerde jogotuu küçöít, antkeni internetten çogultulgan tekstti koldonuudan murun any tilder boíunça ajyratuu kerek, al emi ajyratkan kural tekstke gana taíana alat. Kirillitsadagy kyrgyzça tekstti türkçödön bir karaganda ele, kazakçadan tamgalary boíunça ajyratuuga bolot; al emi koşunalaryna okşoşturulgan latynça kyrgyz teksti alardyn biri katary eseptelip, ansyz dele az korpustan kemitilet da, çoŋuraak korpuska yzy-çuu katary koşulat. Tabuu kyíyn bolgon til yŋgaísyz; al emi çogultuu uçurunda jaŋylyş belgilengen til toptolboí kalat.

Kepti taanuu jana sintezdöö oşol ele toptomdordon azyktanat, al emi belgi eŋ alsyz jerde kata azyrtan ele ugulup turat. Kazak tilinen koldonbogon tamgalary menen gana aíyrmalangan kyrgyz kirillitsasy bügün ele kazakça dep kabyl alyngydaí alsyz: 2026-jyldyn sentíabrynda kyrgyzça yr saptary berilgende, Suno V6-mini alardy avtorgo kazakça aítylyştar menen yrdap bergen — `ж` kyrgyzça [dʒ] affrikatynyn orduna [ʒ] jylçykçyly katary, any menen katar `к` jana `г` tamgalarynyn velíardyk jana uvulíardyk okuluştary da. Çogultuu uçurunda jaŋylyş belgilengen korpus kyrgyz tilin koşuna tildin boljolduu varianty katary iştetken jardamçy bolup kaítyp kelet, al emi buga eŋ erte baldar tuş bolot: alar aílanasyndagy kuraldar tuura dep eseptegen nersege karap okuunu üírönöt.

Latynga kandaí gana ötüü bolbosun, al kirillitsa beker bergen belgiden baş tartat, al emi latyn orfografiíalarynyn içinen tandoo anyn kançasy saktalaryn çeçet. Azyr koldonulup jatkan türk tilderinin latyn orfografiíalarynyn biri da `ŋ` jazbaít, biri da `í` jazbaít, oşonduktan `jaŋy` jana `kylym` öz til belgisin alyp jüröt, al emi `cañı` jana `qılım` andaí belgini alyp jürböít. Bul kasiíet dolboorloonun maksaty bolgon emes. Al başka negizder menen kabyl alyngan tandoolordon — jarym ündüü, velíardyk murun ünsüzü jana `ы` boíunça tandoolordon — kelip çygat, oşonduktan al tekşerile turgan boljoldoo katary sunuştalat, oşol tandoolordun sebebi katary eç kaçan sunuştalbaít.

### 22.3 Tekteş tilder, jalpy tamgalar

Kyrgyz tili türkçödön aíyrmalanyşy üçün eç kandaí ataíyn iştep çyguunu talap kylbaít: eköö til üí-bülösünün ar başka butaktarynda turat jana biri-birine tüşünüktüü emes (Klosstun (Kloss) Abstand tüşünügü [[19]](#ref19)). Jazylyştyn özü gana bul aralykty jaba albaít. Kazak tili bardyk ölçöm boíunça jakynyraak — til üí-bülösünün bir ele butagy, muraska kalgan jalpy özök, kylymdar boíu baílanyş, — oşonduktan eköönü jazuuda ajyratyp turgan nerselerdin azyraak bölügü tilderdin özünön, köbüröök bölügü alardyn özünçö standarttarynan kelet, al emi alfavit oşol standarttardyn bir bölügü. Oşonduktan al jerde tildi anyktoonun çegi taryraak. Eki uçurda teŋ, orfografiía jazuudan baş tartkan aíyrma any ordunda karmap turgan taíanyçtardyn birin jogotot, al emi jetişerlik uzak ubakyttyn içinde bul kepke da jetişi mümkün.

Kyrgyz tili muruntan ele bir kylymdyn köbündö üstömdük kylgan til menen bir jazuunu koldonup kelgen, al emi paídaluu salyştyruu — bul baílanyş emne kyldy jana emne kylgan jok. Orus normalary kyrgyz kirillitsasyna orus sözdörü kaída kirse, oşol jerge kirip, oşol jerde toktogon; oşonduktan `ц`, `щ`, `ъ`, `ь` jana íottoşkon `е` kyrgyz tilinde kirme sözdördö gana koldonulgan tamgalar, oşonduktan konverter alardy jogotuuga jol bere alat. Bul baílanyş bir taraptuu jogotuu bolgon emes: al leksikany abdan baíytkan, al emi kirme sözdör menen koşo kelgen erejeler kirme katmarda kalgan, antkeni orus tilinin erejeleri taasir ete turgan tekteş sözdörü töl kyrgyz tilinde bolgon emes.

Türkçönün abaly andaí emes. Anyn kyrgyz tili menen türk tilderi leksikasynyn muraska kalgan jalpy özögü bar [[26]](#ref26), al emi anyn erejeleri CTA belgilegen erejeler, oşonduktan any menen jalpy jazma standart töl sözdörgö tüzdön-tüz tiíeşelüü erejelerdi alyp kelet; myndaí standart sunuştagan paída — til üí-bülösünün içinde söz almaşuunun jeŋildigi jana jalpy tehnikalyk leksikanyn keŋiri toptomu — oşol ele korkunuç menen bir kanaldan kelet. Jakyn tekteş tilderdin ortosunda myndaí kanal açyk bolgon jerlerde misaldardyn baary bir tarapty körsötöt. 1933-jylky sovet (je keŋeş) reformalary ukrain jana belorus jazylyşyn orus tiline jakyndatyp, ukrain alfavitindegi `ґ` tamgasyn 1990-jylga çeíin alyp salgan [[22]](#ref22)[[23]](#ref23). Ispan erejeleri menen jazylgan galisiía tili kastiliíalaştyruu tuuraluu turuktuu talaşty jaratyp kelet [[24]](#ref24), al emi anglis jazylyşy menen jazylgan skots tili kata jazylgan anglis tili katary okulat [[25]](#ref25).

Künümdük mehanizm — oŋdoo. Çoŋuraak tilge üírötülgön orfografiíany tekşergiçter jana suramdardy normaldaştyruu kiçireek tildi oşol tildin formalaryna aílandyryp oŋdop salmak, kyrgyzça tekst suralgan model orfografiía şart tüzgön jerde boştuktaryn türkçö menen tolturmak, al emi jazgandar kün saíyn okugan tilge salyştyrganda kata bolup körüngön söz formalaryn normaga keltirmek. Myndan boljoldongon jylyş adegende leksikada jana jazma normada bolot, kepke bolso jogoruda aítylgan jol arkyluu gana jetet.

Bular — tendentsiíalar, anyk nerseler emes. Üstömdük kylgan jazma standart kançalyk alys jaíylaryn eki tildin tekteştiginen tyşkary dagy başka nerseler anyktaít: baílanyş kança ubakyt sozulary, oşol ubakyttyn içinde mektep, maalymat karajattary jana saíasat emne kylary, ar bir tarap kança tekst jana kural alyp keleri. Bul dokument alardyn birin da ölçöböít. Orfografiía — bir neçe küçtün biri, alardyn biri da öz aldynça çeçüüçü emes [[28]](#ref28).

### 22.4 Taanyştyk jana kabyl aluu

Alfavitti any surabagan adamdar kabyl alat, alar anyn jüíölörünön murun tamgalaryna jolugat. Kazakstan koomçuluk syrtky körünüşünö karap baa bergen eki alfavitti almaştyrgan, al emi Kyrgyzstan okurmandar kabyl albagan 2004-jylky öz reformasyn artka kaítargan (§21.5). Jaŋy tamgany dolboorloo arzan, al emi üírötüü kymbat turat, bul baa bardyk okurmandarga bir ubakta tüşöt.

Kyrgyz okurmany muruntan bilgen nersege salyştyrganda, CTA alfavitinin bir neçe tamgasy jaŋy: `ж` üçün `c`, çekittüü `İ` menen koşo çekitsiz `ı`, oşondoí ele 1940-jyldan beri koldonulup kelgen bir da kyrgyz jazuusunda tügöíü jok `ğ`. Alardyn ar biri türkçö okugan adamga taanyş, CTA dal uşul taanyştykka negizdelip tüzülgön.

Buga eŋ obolu eç kandaí okutuudan ötpögön okurmandar körnöktördö jana künümdük jazuuda tuş bolot, al emi taanyş emes orfografiíaga kezikken okurman diakritikadan murun negizgi tamgalardy kabyl alyp, alardy muruntan bilgen maanileri menen okuít. CTA ülgüsündögü jöndöödö *жарыя* sözü `CARIYA` dep jazylat, `c` — [dʒ] ekenin üírönbögön okurman any *кария* je *сария* dep okuít; eköö teŋ körnöktögü söz emes, al emi saptagy eç nerse katany bildirbeít. *Чыгуу* sözü `ÇIĞUU` bolup kalat, oşol okurman any `CIGUU` dep kabyl alat — jönököí forma tüz ele uşundaí jazat. `C` jana `I` tamgalarynyn kirillitsadagy maanileri menen okulganda koomduk jerlerdegi körnöktördö eŋ köp kezdeşken sözdördün biri uíatsyz sözgö aílanat. Jany-Latyn jazuusundagy `ÇYGUU` bir tamga menen — `ч` üçün `C` — adaştyryşy mümkün; CTA jazylyşy ekinçisin — `ы` üçün `I` — koşot.

Bul çygymdar ötkööl münözdö, tamgalar üírötülgöndön kiíin alar bütöt; mamleket koldogon standart bere ala turgan joop uşul. Birok ötüü uzakka sozulat, eki koşuna mamlekette teŋ al on jyldyktar menen ölçönöt. Orfografiíaga dal uşul aralyk mezgilde baa berilet, al emi orfografiíalardy iştep çyguuda okurmandardyn kabyl aluusu özünçö dolboorloo kriteriíi katary karalat [[27]](#ref27).

Anyn orduna Jany-Latyn kyrgyz okurmanynda muruntan bar eki türdüü taanyştykka taíanat. Birinçisi — alar okugan kirillitsa: `й` belgisi bar `и` bolgondoí, `í` da belgisi bar `i`; `ŋ` `ң` tamgasynyn tömön tüşkön syzygyn saktaít; sozuluş kirillitsadagydaí koş tamga menen jazylat. Ekinçisi — alar muruntan ele terip, körüp jürgön latyn jazuusu: pasporttogu *Japarov* jazylyşyndagy jana *Jalal-Abad* jer atalyşyndagy `j`, ölkönün anglisçe atalyşyndagy `y`, oşondoí ele adamdardyn azyr bildirüü jazgan adatyna dal kelgen jönököí forma. Bul eköö muundar boíunça bölünöt: kirillitsada bilim algan okurmandar birinçisin, telefon klaviaturasynda çoŋoígon okurmandar ekinçisin bilet, al emi tamgalar eki taraptan teŋ taanylgydaí tandalgan.

Eköö ajyragan jer — `ŋ`. Anyn taanyştygy — `ң` tamgasyn okugan adam üçün formasynyn taanyştygy, klaviatura jagynan azyraak: `ŋ` kee bir uzak basuu meníularynda bar, al emi `ñ` deerlik baarynda bar. Oşonduktan `ñ` salyştyruu jöndöösü katary sunuştalat (§14). Kalgan bardyk jerde kyrgyz okurmany boljoldoí turgan tamga — orfografiía jazgan tamga.

### 22.5 Jakyndaşuunun jüíölörü jana tandalgan pozitsiía

Jakyndaşuu — CTA alfavitinin maksaty, al emi muruntan ele latynça jazylyp jürgön türk tilderi menen biri-birinin jazuusun okuí aluu çynygy paída; bul jerde latyn alfavitin takyr ele karoogo arzyí turgan üç sebeptin biri uşul. Kalgan eköö, kaísy standartka şaíkeş kelbesin, ar kandaí latyn orfografiíasy menen koşo kelet: latyn — el aralyk okurmandar muruntan okugan jazuu, oşondoí ele klaviaturalar, koddoolor jana tekst kuraldary aílanasynda kurulgan jazuu. CTA alfavitine ylaíyk kelüünün baasyna birinçisi gana alynat, oşonduktan bul — kançalyk ylaíyk kelüü kerek degen suroo, latynga ötüü kerekpi degen suroo emes.

Kazak tili menen bul paída jaŋy emes. Eköö muruntan ele biri-birinin kirillitsasyn okuít, eköö teŋ Jalpy türk alfavitin makuldaşkan Baku süílöşüülörünö öküldörün jibergen. Kazakstan andan beri özünün latynga ötüüsün jarlyk menen bekitip, möönötün belgilegen (§21.5); Kyrgyzstan ötüü çeçimin kabyl algan jok. Ötüü çeçe turgan nerse — bul baílanyş saktalaby je jokpu. Eger eköö teŋ jalpy latyn negizinde kurulsa, baílanyş saktalat; eger biri ötüp, ekinçisi ötpösö, al eki jazuunu teŋ bilgen okurmandar bar bolgongo çeíin gana saktalat; eger eköö teŋ ötüp, birok kirillitsadagydan da köbüröök alystasa, baílanyş solgundaít. Jany-Latyn eki tildi latynça da kirillitsadagydaí biri-birine okuluuçu boídon kaltyruunu maksat kylat, al emi anyn mehanizmin jana synoo çöírösün kazak tili üçün uşundaí ele baaloonu jürgüzüü üçün fork kyluuga bolot. Eköönün biri-birine kançalyk jakyndaşary — murasy eki taraptan teŋ jalpy bolgon tuugan tilderdin ortosundagy iş. Üçünçü tilden kelgen erejeler — özünçö masele. CTA sunuştagan `c` jana `ı` türkçö koldonuunu eerçiít; alardy özünön-özü emes, §22.3 süröttögön tildik jylyş korkunuçuna jana bul dokumenttin jüíölörünö turuştuk bergen jerde kabyl aluuga arzyít.

Standarttyn aírym bölüktörünön baş tartuu (§21.2) kyrgyz tilin özgöçö uçur kylmak emes, antkeni bir da türk mamleketi any tolugu menen kabyl algan emes. Türkmön tili jarym ündüünü bul orfografiía `í` jazgan oşol ele tüzümdük sebep menen `ý` dep jazat, al emi velíardyk murun ünsüzün CTA `ñ` koldongon jerde `ň` dep jazat [[20]](#ref20); Özbekstandyn dolbooru `ng` digrafyn saktaít; Kazakstan bolso 2021-jyldyn içinde öz tamgalaryn eki jolu kaíra karap çykkan. Jalpy latyn negizi eç kaçan anyn üstündögü belgilerdin da jalpy boluşun talap kylgan emes: Íevropanyn latyn jazuusundagy tilderi, anyn içinde german, roman, slavían, baltika jana ural tilderi, bir ele jyíyrma alty tamgaga negizdelet, birok alardyn üstündögü diakritikalyk belgilerdin jalpy toptomu boíunça eç kandaí makuldaşuuga kelişken emes, al emi koşunalardyn ortosundagy ar başka jazylyş — kadimki körünüş [[21]](#ref21). Eŋ jakyn pretsedent — kyrgyz tilinin öz tajryíbasynda. Kyrgyz jana kazak kirillitsalarynyn negizi jalpy, ar biri özünün tamgalaryn saktaít, eköö biri-birine okuluuçu boídon kalyp, baraktyn üstündö aíyrmalanyp turat: kazak tili koşkon tamgalary menen, kyrgyz tili alardyn joktugu menen. Latynga ötüüdö bul mamileni eske aluuga arzyít, birok al ötüünün şarty emes.

Jalpy türk alfaviti bul dokumentte jüíölöngön ar bir aíyrmany kamtyí almak. Anyn baasy — köbüröök tamga, daíyma jaŋylanyp turgan kirme sözdör sözdügü jana any jürgüzgön mekeme, oşondoí ele bir da kyrgyz okurmany körbögön tamga formalaryn üírötüünün çygymy. Mamleket koldogon standart algaçky eköönü tölöí alat. Kalganyn kim tölöbösün, üçünçüsü okurmandarga tüşöt. Jany-Latyn algaçky eköönün birin da talap kylbagydaí, al emi üçünçüsün mümkün boluşunça az talap kylgydaí tüzülgön.

Tildi al muruntan koldonup kelgen formada jazuuga arzyít, al emi aímaktyk standartka al kiçireek tildi aíyrmalanuuçu boídon saktagan çekke çeíin koşuluuga arzyít, antkeni jetişerlik alyska ketken jakyndaşuunun natyíjasy — aíyrmalangan jazma tilderdin azaíyşy, okuluşu jeŋildegen tilderdin köböíüşü emes. Bular — pozitsiíalar, empirikalyk natyíjalar emes; al çek kaída ekenin §23.2 bölümündögü synoolor ölçöşü kerek. Eköönün biri da tazalykty korgoo emes: künümdük kyrgyz leksikasynyn çoŋ bölügü orus tilinen kelgen, al emi kirillitsadan kiíin emne kelbesin, al özünün kirme sözdörün ala kelet. Kooptonuu myndan taryraak: tildi tabuunu kyíyndatyp, any başka til katary eseptep koíuunu jeŋildetişi mümkün bolgon özgörüü — eŋ obolu maşinalyk katmarlarda, eŋ az körüngön jerde baíkalgan jogotuu. Ekinçi jük açyk tüşöt: özdörü tandabagan alfavitti jana erejelerdi üírönüügö tiíiş bolgon okurmandarga; bul jük bul jerde jüíölöngön tamgalarga da başkalardaí ele tiíeşelüü. Bul jüktördün biröösün bolso da kabyl aluuga arzyíby jana ötüü kaísy tarapka ketet — munu kyrgyzdar çeçet.

### 22.6 Çygymdar jana çektöölör

- **Çygym jana mümkünçülük.** Latyndaştyruuga ölkö içinde ulam kaítalanyp aítylgan karşy pikir — al kymbat turat jana bilim berüünün myndan da şaşylyş muktajdyktary bar. Bul karşy pikir oluttuu, any tamgalardy jakşyraak dolboorloo menen çeçüügö bolboít.
- **Köp tildüü mamleket.** Kyrgyzstan bir tildüü ölkö emes. Orus tili rasmií statuska ee, al emi özbek, dungan jana başka jamaattar kirillitsa menen jazat. Kyrgyz tilinin latynga ötüşü al tilderdi özü menen koşo alyp ketmek emes, oşonduktan kyrgyz tiline emne bolbosun, kirillitsa künümdük koldonuuda kalmak. Ar kandaí realduu plan — janaşa jaşoonun plany, almaştyruunun emes; bul eki tarapka iştegen konverterdin paídasyna da jüíö.
- **Geosaíasat.** Bir jagynan Moskvanyn reaktsiíasy, ekinçi jagynan jalpy türk standartynyn tartuu küçü mamlekettik deŋgeeldegi ötüügö salmak salat. Alardyn biri da paídaluu boluş üçün eç kandaí çeçimdi talap kylbagan kuraldy çektebeít.
- **Muundardyn asimmetriíasy.** Kirillitsada bilim algan okurmandar menen telefon klaviaturasynda çoŋoígon okurmandar ar başka tamgalardan baştaít; eki deŋgeel dal uşul üçün kerek: toluk forma basma söz jana klass üçün, jönököí forma telefon üçün.

---

# IV bölük — Açyk suroolor jana başkaruu

## 23. Açyk suroolor jana keleçektegi işter

Bulardyn aírymdary — synoo çöírösü koldoo üçün tüzülgön eksperimentter; kalgany — ali atkaryla elek spetsifikatsiía işteri. Ar bir eksperiment yrastoonu, any çeçe turgan synoonu jana aga karşy dalil bolo turgan natyíjany körsötöt.

### 23.1 Tokenizatsiía

**Yrastoo:** bir bütün latyn koddoosu aralaş jazuudagy tekstke karaganda natyíjaluuraak tokenizatsiíalanat, kirillitsa menen boljolduu birdeí je andan jakşyraak.

**Synoo:** turuktuu korpustu alyp (kyrgyzça Vikipediía je taza paralleldüü toptom üçün FLORES-200 `kir_Cyrl`), any kirillitsada, Jany-Latyn jazuusunda, CTA ülgüsündögü jöndöödö jana aralaş jazuudagy konfiguratsiíada jazyp çygyp, bir neçe tokenizator boíunça bir sözgö tuura kelgen tokenderdin sanyn ölçöö.

**Any emne tögüngö çygarat:** keŋiri koldonulgan modelderde latynça kyrgyz tekstinin kirillitsaga karaganda *naçaryraak* tokenizatsiíalanyşy. Bul — yktymal natyíja, antkeni okutuu maalymattarynda kirillitsadagy kyrgyz tili kaalagan latynça kyrgyz jazuusuna karaganda alda kança jakşy çagyldyrylgan; eger tabylsa, al jönündö bildirüü kerek bolot.

### 23.2 Tildi anyktoo jana izdep tabuu

**Yrastoo:** latyn jazuusundagy türk tilderinin standarttarynan orfografiíalyk aíyrmalanuu kyrgyz tilin maşinalar üçün taanyluuçu boídon saktaít, al emi tekst kyskargan saíyn bul taasir küçöít (§22.2).

**Kamtuu çöírösü:** §22.2 bölümündögü eki salyştyruunun içinen azyr türkçö, azerbaíjança jana özbekçe menen salyştyruunu gana synoogo bolot, antkeni bul tilder bügün latyn jazuusunda jazylat. Latynça kazak tili — jakynyraak uçur (§22.3) — jarlyktarda jana ülgü tablitsalarynda bar, al 2031-jyly ötüü aíaktaganga çeíin köp kölömdö jazylbaít (§21.5). Kirillitsadagy kazak korpusun transliteratsiíaloo tildi emes, transliteratordu synamak, oşonduktan kazak tili menen salyştyruu jüíö boídon kalat, aga tömöndögü üçünçü synoo gana jetet.

**Synoolor:** törtöö, çygymy ösüü tartibinde.

1. *Kagylyştardy esepke aluu.* Jany-Latyn jazuusunda jana CTA ülgüsündögü jöndöödö türkçö, azerbaíjança je özbekçe söz formasy menen birdeí bolgon kyrgyz söz formalaryn eseptöö. Al üçün söz tizmeleri gana kerek, al mehanizmdi tüzdön-tüz ölçöít.
2. *Saptyn uzunduguna jaraşa anyktoo.* fastText kuralynyn `lid.176` modeli je GlotLID syíaktuu daíar til anyktagyçty oşol ele kyrgyzça tekstke eki konfiguratsiíada teŋ 1, 3, 5, 20 jana 100 token uzundugunda iştetüü. Boljoldoo boíunça, konfiguratsiíalar abzatstarda dal kelet, al emi saptar kyskargan saíyn ajyraşat.
3. *Kara kutu baíkoosu.* Oşol ele tekstti ar bir konfiguratsiíada iştep turgan sistemalarga — veb-izdöö sistemasyna, til anyktagyçka, kep je yr sintezdegiçke — berip, alardyn ar biri kaísy tilde joop bergenin jazyp aluu. Bul — uşul dokumenttegi eŋ alsyz dalil: sistemalar açyk emes jana eskertüüsüz özgöröt, oşonduktan ar bir baíkoo özünün datasyn jana sistema körsötkön versiíany kamtyít, al emi sistema emne üçün uşundaí joop bergeni jönündö eç nerse aítpaít. §22.2 bölümündögü Google izdöösü jana Suno atkaruusu — uşundaí baíkoolor.
4. *Generativdik aralaşuu.* Modelden ar bir konfiguratsiíada kyrgyzça proza jazyp berüünü suranyp, kyrgyz jana kazak tilderi jalpy murastagan leksikany esepke albastan (§22.3), ar bir miŋ sözgö tuura kelgen türkçö jana kazakça leksikalyk birdikterdi eseptöö.

**Any emne tögüngö çygarat:** kagylyştardyn esepke aluuga arzybagan az ülüşü je eki konfiguratsiíada teŋ üç tokende anyktoonun turuktuu boídon kalyşy; kaísynysy tabylsa da, al jönündö bildirüü kerek bolot. Latynça kazak teksti paída bolmoíunça kazak tili menen salyştyruunun tögüngö çygaruu şarty jok.

### 23.3 Jönököí formadagy birigüülör

**Yrastoo:** belgini alyp saluuçu rezervdik tür biriktirgen sözdör (`baş` menen `bas`, `aş` menen `as`) çynygy tekstte anyn yraattuuluk jana birdeílöö artykçylyktary alardan basymduuluk kylgydaí az (§19).

**Synoo:** korpus boíunça ar bir ASCII rezervdik türü (`c/s` jana `ch/sh`) biriktirgen özünçö söz formalaryn eseptep, eki sandy teŋ söz türkümdörü boíunça kaítarym aílandyruudagy jogotuu ülüşü menen birge bildirüü.

**Any emne tögüngö çygarat:** belgini alyp saluu erejesi söz formalarynyn bir kyíla çoŋuraak ülüşün biriktirse je kontekst ajyratpagan köp kezdeşüüçü juptardy biriktirse.

### 23.4 Şrifttik körsötüü

**Yrastoo:** saptyn içindegi kirillitsa `ө`, şrift kirillitsany kamtyíby je jokpu, aga karabastan, aílanasyndagy latyn teksti menen körünüşü boíunça şaíkeş kelbeít (§12.2).

**Synoo:** `kөl` jana `köl` sözdörün keŋiri koldonulgan koldonuuçu interfeísi, veb jana seriftüü şriftterdin matritsasynda körsötüp, sözdün ortosundagy glif üçün anyn janyndagy latyn kiçine tamgasyna salyştyrmaluu x tamgasynyn biíiktiginin katyşyn, syzyktyn kalyŋdygyn jana negizgi syzyktan kandaídyr bir jylyşyn jazyp aluu. Kaísy şriftter glifti başka şrift menen almaştyraryn jana kaísylary jön gana dal kelbeí turganyn bildirüü.

**Any emne tögüngö çygarat:** keŋiri koldonulgan şrift toptomdorunda ölçömdör latyn kiçine tamgalarynan bir neçe paíyz gana aíyrmalansa, al emi almaştyruu çyndap ele kirillitsasy jok şriftterde gana bolso.

### 23.5 Kirgizüü

**Yrastoo:** toluk formany kadimki yldamdykta terüügö bolot: statsionardyk kompíuterdin jaíylmasynda ataíyn klaviatura kartasy menen, özgörtülbögön telefon klaviaturasynda uzak basuular menen.

**Synoo:** standarttuu jaíylmada ataíyn klaviatura kartasy menen jana ansyz, oşondoí ele özgörtülbögön iOS jana Android klaviaturalarynda ar bir 1000 belgige ketken basuulardyn sany jana ubakyt; §14 bölümündögü `ŋ` tamgasynyn jetkiliktüülügü da uşul jerde al yrastalgan bir lokaldan tyşkary tekşerilet.

**Any emne tögüngö çygarat:** digraftuu jazylyştarga salyştyrmaluu turuktuu yldamdyk jogotuusu je keŋiri taralgan telefon klaviaturasynda taptakyr tabylbaí turgan tamgalar; bul keleçektegi versiía üçün `ñ` tamgasyn jakşyraak tandoo kylmak (§14).

### 23.6 Spetsifikatsiía boíunça ali atkaryla elek işter

- Tekst kaísy sistemany koldonorun körsötö alyşy üçün BCP 47 til teginin erejesi (`ky-Latn`, balkim, kattalgan variant subtegi menen).
- CLDR transliteratsiía erejelerinin toptomu; al dal keltirüünü CLDR negizindegi kaalagan platformada jetkiliktüü kylmak.
- Okuu materialdary jana sözdüktör üçün basym belgilöö erejesi; al akut bolboşu kerek, antkeni akut — jarym ündüü (§10).
- Tamga deŋgeelinen tyşkarky orfografiíalyk erejeler: taşymaldoo, kyskartuular, orusça attar menen familiíalardyn jazylyşy, oşondoí ele kirme sözdör orusça bulagy boíunça jazylaby je kyrgyzça aítylyşy boíunça jazylaby degen saíasat.
- Negizgi erejenin çeginen tyşkarky baş tamga jazuu. Bir neçe simvoldon turgan grafemalar (`ía`, `ío`, `íu`, `ts` jana digraftuu rezervdik türlör) baştapky sözdün baş/kiçine tamga ülgüsün alat, oşonduktan süílömdün başyndagydaí jazuuda `Ía`, al emi baş tamgalar menen gana jazylganda `ÍA` bolot; bul çeçilgen. Defis menen jazylgan attar da çeçilgen: defisterdin ortosundagy ar bir bölük özünün baş/kiçine tamgasyn alat, oşonduktan *Ысык-Көл → Ysyk-Köl*, al emi *Кызыл-кыя → Kyzyl-kyía* baştapky tekst jazgan kiçine tamgaluu ekinçi bölügün saktaít. Kalgany taryraak jana negizinen stildik masele: müçö ulangan abbreviaturalar jana initsialdyk kyskartuular (*ЖОЖдо*), oşondoí ele camelCase stilindegi identifikatorlor.
- Izdöö birdeílöösü `q` tamgasyn `k` tamgasyna birdeíleşi kerekpi (B tirkeme).
- Aílandyrylgan tekst üçün maşina okuí ala turgan versiía belgisi (§24), dokument any mehanizmdin kaísy versiíasy jaratkanyn körsötö alyşy üçün.
- Dokumentatsiíanyn şaíkeştigin tekşerüüçü kural: al ar bir misaldyn bagytyn jana konfiguratsiíasyn azyrkydaí kol menen tüzülgön tizmeden emes, kontekstten anyktaşy kerek.
- Kol jazma jana pedagogika: bul jerdegi eç nerse okuuçular menen synalgan emes, al emi sedilder jana akuttar kol jazmada basma teksttegiden başkaça bolot.

---

## 24. Başkaruu

Bul — orfografiíanyn standart emes, sunuş katary jaryíalangan 1-versiíasy, al emi dolboor makul emestik naarazyçylyktan ulam forktordu emes, özgörüülördü jarata turgandaí tüzülgön:

- Ar bir talaştuu tandoo — synoo çöírösündögü kotorguç, ar bir alternativa koddo işke aşyrylgan.
- Saítta jaígaştyrylgan synoo çöírösü okurman makulduk suroosuna joop bergenden kiíin anyn kaísy konfiguratsiíany tandaganyn jazyp alat, oşonduktan çynygy koldonuudagy tandoolordun bölüştürülüşün jüíölör menen katar jaryíaloogo bolot. Baş tartkan okurman cookie faíldarysyz jana tüzmöktö saktalgan eç kandaí identifikatorsuz eseptelet. Öz serverinde je klassta ornotulgan köçürmö eç nerse jazbaít; myndaí ölçöö saíttagy köçürmögö taandyk, programmaga emes.
- Büt baştapky kod üç uruksattyn negizinde açyk: aílandyruu mehanizmi MIT litsenziíasynda, any kaalagan maksatta koldonuuga bolot; synoo çöírösünün tirkemesinin baştapky kodu kommertsiíalyk emes litsenziía menen jetkiliktüü, oşonduktan any okuuga, özgörtüügö jana klassta ornotuuga bolot, birok satuuga bolboít; bul dokument jana spetsifikatsiía CC BY litsenziíasynda. Maseleler, çektik uçurlar jana korpustan tabylgan karşy misaldar GitHub arkyluu kabyl alynat; ar kim spetsifikatsiíadagy dal keltirüü erejelerin karap çyga alat, özgörtüülördü sunuştaí alat je fork kyla alat.
- Versiíalar nomerlenet, özgörüülör kattoogo alynat. Dokument any mehanizmdin kaísy versiíasy jaratkanyn körsötüp, kaíra koopsuz aílandyrylyşy üçün aílandyrylgan tekst menen koşo jürgön, maşina okuí ala turgan versiía belgisi — tabigyí kiíinki kadam, birok al ali işke aşyryla elek; al §23.6 bölümündö körsötülgön.

Dolboor kütkön iígiliksizdik jolu — tögüngö çygaruu, kabyl aluuga kysym körsötüü emes. Mehanizm töl kyrgyz sözün buzgan, kaítalap körsötüügö bolo turgan uçur bul dolboor üçün makuldukka karaganda baaluuraak.

---

## 25. Korutundu

Bul dokumenttegi ar bir tandoo başkalardan murda bir çektöögö joop beret: Jany-Latyn formasy muruntan bar kirillitsadan eseptelip çygyşy kerek, antpese orfografiía özü alyp jürüşü kerek bolgon korpustan baş tartuudan baştalat. Uşul çektöönün alkagynda orfografiía fonologiíalyk taktykty, tipografiíalyk açyktykty jana terüü ergonomikasyn teŋdeştirgende iígilikke jetet. Bügün al oşondoí ele izdöö sistemalary, tokenizatorlor jana özgörtülbögön klaviaturalar menen baílanyşka turuştuk berişi kerek. Bul işke uşul kriteriíler boíunça baa berilişi kerek: sedilder jana akut baílanyştuu kyrgyz tekstinin sabynyn içinde any buzbaí turaby, `ŋ` okuu ölçömündö `n` tamgasynan aíyrmalanyp turaby, ene tilinde süílögön adam kandaídyr bir eki maanilüülükkö tuş bolobu jana bir ele tekst kaítarym aílandyruudan, indeksten jana telefon klaviaturasynan aman ötöbü. Bul suroolordu kol menen tandalgan misalga karaganda çynygy prozanyn bir baragynda çeçüü jakşyraak, synoo çöírösü dal uşul üçün tüzülgön.

Tynystanovdun latyn alfavitinen bir kylym ötköndön kiíin oşol ele taryhyí jip Musaíevdin dolbooru arkyluu ötöt, al dolboor jakyn arada kelbeşi mümkün bolgon saíasií çeçimdi kütüp turat [[3]](#ref3). Bul dolboor al çeçimdin kelişine muktaj emes. Al kimdir biröö repozitoriídi açkan zamat paídaluu bolgudaí tüzülgön, kyrgyzça süílögöndör köp jyldardan beri latynça jazyp kelgen şarttarda: rasmií emes, yraattuu emes jana üzgültüksüz.

Til ilimpozdoru, injenerler jana saíasatty iştep çykkandar bul tandoolorgo işene salbastan, alardy synap körüügö çakyrylat: synoo çöírösün açyp, `docs/SPEC.md` faílyndagy dal keltirüü erejelerin okup, mehanizm tuura emes iştetken ar bir uçur boíunça masele açyŋyz.

*Zamanbap, erkin jana tabigyí jazuu egemen elibizge sanariptik doorunda kyzmat kylsyn.*
*(Zamanbap, erkin jana tabigyí jazuu egemen elibizge sanariptik doorunda kyzmat kylsyn.)*

---

# Koldonulgan adabiíattar

<a id="ref1"></a>[1] «Adoption of Latin-Based Common Turkic Alphabet». *The Times of Central Asia*, 2024-jyldyn 12-sentíabry. https://timesca.com/adoption-of-latin-based-common-turkic-alphabet/

<a id="ref2"></a>[2] «Turkic States Agree On Common Latin Alphabet, But Kyrgyzstan Happy With Its Cyrillic Script». RFE/RL, 2024-jyldyn 3-oktíabry. https://www.rferl.org/a/common-turkic-alphabet-kyrgyz-kazakh-uzbek-turkmen-latin-cyrillic/33137392.html

<a id="ref3"></a>[3] Жангазиев, Максат. «Нужен ли тюркоязычным странам общий алфавит?» Азаттык Азия (RFE/RL), 2024-jyldyn 25-sentíabry. https://www.azattyqasia.org/a/33134603.html — Musaíev sunuştagan алфавит tablitsasynyn köçürmösün kamtyít. Kyrgyzça tüp nuskasy: https://www.azattyk.org/a/33125096.html

<a id="ref4"></a>[4] «Kyrgyz alphabets». Wikipedia. https://en.wikipedia.org/wiki/Kyrgyz_alphabets — 1928–1938/1940-jyldardagy latyn alfavitinin dal kelüü tablitsasy jana sozulma ündüülördün kuramy üçün. Anda keltirilgen baştapky bulak: Сумарокова, О.Л. (2021), *Кыргызский алфавит: долгий путь к кириллице*, KRSU.

<a id="ref5"></a>[5] «New version of Latin-based Kazakh alphabet presented at government». Kazinform, 2021. https://www.inform.kz/en/new-version-of-latin-based-kazakh-alphabet-presented-at-government_a3746549

<a id="ref6"></a>[6] Unicode Technical Standard #10: Unicode Collation Algorithm. https://www.unicode.org/reports/tr10/

<a id="ref7"></a>[7] Kudo, T. & Richardson, J. (2018). «SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing». EMNLP 2018 (system demonstrations).

<a id="ref8"></a>[8] «Romanization of Kyrgyz». Wikipedia. https://en.wikipedia.org/wiki/Romanization_of_Kyrgyz — ALA-LC, BGN/PCGN, ISO 9 jana Jalpy türk sistemalarynyn salyştyrma tablitsasy, oşondoí ele ökmöttün geografiíalyk atalyştar üçün BGN/PCGN sistemasyn kabyl alyşy. Anda keltirilgen baştapky bulaktar: BGN romanization of Kyrgyz (US Board on Geographic Names, 2017); UNGEGN report, 2016; ISO 9:1995.

<a id="ref9"></a>[9] «What will be the Kyrgyz Latin alphabet». qyrgyz.com. https://qyrgyz.com/post/path-of-kyrgyz-latin-script — 2021-jyldyn íanvarynan apreline çeíin kazak alfavitinde Ŋ tamgasynyn Ñ tamgasyna almaşyşy jana 2021-jylky özbek dolbooru üçün.

<a id="ref10"></a>[10] Unicode Standard Annex #29: Unicode Text Segmentation. https://www.unicode.org/reports/tr29/

<a id="ref11"></a>[11] Unicode Character Database, `SpecialCasing.txt` (türk tilderindegi `i`/`ı` baş/kiçine tamga dal keltirüülörü). https://www.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt

<a id="ref12"></a>[12] «Кыргызская латиница / Кыргыз тилинин латын алфавити». qyrgyz.com. https://www.qyrgyz.com/kyrgyzskaya-latinitsa

<a id="ref13"></a>[13] «Kazakhstan Changes Its Alphabet. Again!» Eurasianet, 2018-jyldyn 20-fevraly. https://eurasianet.org/kazakhstan-changes-its-alphabet-again

<a id="ref14"></a>[14] Bazarbayeva, Z.M. & Chukayeva, T.K. (2021). «The new Kazakh latinized script». *Bulletin of L.N. Gumilyov Eurasian National University, Philology Series* 3(136). https://bulphil.enu.kz/index.php/main/article/download/291/143/419

<a id="ref15"></a>[15] «Kazakh alphabets». Wikipedia. https://en.wikipedia.org/wiki/Kazakh_alphabets — 2017-jylky jarlyk jana 2021-jyly aíaktoo möönötünün 2031-jylga jyldyrylyşy.

<a id="ref16"></a>[16] Unicode Standard Annex #15: Unicode Normalization Forms. https://www.unicode.org/reports/tr15/

<a id="ref17"></a>[17] «Declaration on the Common Turkic Alphabet». Turkic Academy. https://www.turkicacademy.org/en/smi/declaration-common-turkic-alphabet — Bakuda makuldaşylgan 34 tamgaluu tartip üçün. Oşondoí ele karaŋyz: «Common Turkic Alphabet», Wikipedia: https://en.wikipedia.org/wiki/Common_Turkic_alphabet

<a id="ref18"></a>[18] «Russia Suspends Dairy Products From Kyrgyzstan After Calls In Bishkek To Drop Cyrillic Script». RFE/RL's Kyrgyz Service, 2023-jyldyn 21-apreli. https://www.rferl.org/a/russia-kyrgyzstan-dairy-products-banned-cyrillic-latin/32373802.html

<a id="ref19"></a>[19] Kloss, H. (1967). «„Abstand Languages“ and „Ausbau Languages“». *Anthropological Linguistics* 9(7), 29–41.

<a id="ref20"></a>[20] «Turkmen alphabet». Wikipedia. https://en.wikipedia.org/wiki/Turkmen_alphabet — azyrky latyn tamgalary `ý` [j] jana `ň` [ŋ], oşondoí ele velíardyk murun ünsüzünün murunku `ꞑ`, `ñ` jana `ng` jazylyştary üçün.

<a id="ref21"></a>[21] Sebba, M. (2007). *Spelling and Society: The Culture and Politics of Orthography Around the World*. Cambridge University Press — orfografiíany taza tildik emes, sotsialdyk obíekt katary karagan negizgi emgek.

<a id="ref22"></a>[22] Goletiani, Liana (2017). «The Letter that was Missing. On the Return of the Letter Ґ to the Ukrainian Legal Language». *Studi Slavistici* 14(1). https://doi.org/10.13128/Studi_Slavis-21938

<a id="ref23"></a>[23] Kiyosawa, Shiori (2021). «Divergence and Conflict between the Two Norms of the Modern Belarusian Literary Language» [japon tilinde, anglisçe annotatsiíasy menen]. *Slavic Studies* 68: 1–43. Slavic-Eurasian Research Center, Hokkaido University. http://hdl.handle.net/2115/84289

<a id="ref24"></a>[24] Ramallo, Fernando (2015). «The Standardization of Galician». *Sociolinguistica* 29(1). https://doi.org/10.1515/soci-2015-0006

<a id="ref25"></a>[25] Bann, Jennifer & Corbett, John (2015). *Spelling Scots*. Edinburgh University Press. https://doi.org/10.3366/edinburgh/9780748643059.001.0001

<a id="ref26"></a>[26] Johanson, L. & Csató, É.Á. (eds.) (2021). *The Turkic Languages*, 2nd ed. Routledge. https://doi.org/10.4324/9781003243809 — türk tilderinin salyştyrma körünüşü, anyn içinde muraska kalgan jalpy leksika jana kyrgyz sozulma ündüülörünün kelip çygyşy üçün.

<a id="ref27"></a>[27] Cahill, M. & Rice, K. (eds.) (2014). *Developing Orthographies for Unwritten Languages*. SIL International — orfografiíany dolboorloodo fonemalyk ylaíyktuuluk menen katar okurmandardyn kabyl aluusunun kriterií katary karalyşy jönündö.

<a id="ref28"></a>[28] UNESCO Ad Hoc Expert Group on Endangered Languages (2003). *Language Vitality and Endangerment*. International Expert Meeting on the UNESCO Programme Safeguarding of Endangered Languages jyíynyna sunuştalgan dokument, Parij, 2003-jyldyn 10–12-marty. https://ich.unesco.org/doc/src/00120-EN.pdf — dokument reíting katary emes, birge koldonula turgan körsötmölör katary sunuştagan toguz baaloo faktoru, oşondoí ele 6-faktordun şkalasy («Materials for Language Education and Literacy»); bul şkalada orfografiía kalyptangan, praktikalyk je jok degen türdö gana çagylat.

## Koşumça adabiíattar

Bular jogoruda şilteme kylyngan emes, birok bul jerdegi jüíölörgö tüzdön-tüz tiíeşelüü; bul işti ulantuunu kaalagandardyn baaryna sunuştalat.

- Kara, D.S. *Kyrgyz*. Lincom Europa, 2003.
- Unseth, P. (2005). «Sociolinguistic parallels between choosing scripts and languages». *Written Language & Literacy* 8(1).
- Venezky, R. (2004). «In search of the perfect orthography». *Written Language & Literacy* 7(2).
- Fierman, W. (2009). «Identity, symbolism, and the politics of language in Central Asia». *Europe-Asia Studies* 61(7).
- «Prospects of Kyrgyz language transition to the Latin script based on experience of Kazakhstan and Uzbekistan». *Language Problems and Language Planning* (2025). https://www.jbe-platform.com/content/journals/10.1075/lplp.25003.tok
- Petrov, A. et al. (2023). «Language Model Tokenizers Introduce Unfairness Between Languages». NeurIPS 2023.
- Kargaran, A.H., Imani, A., Yvon, F. & Schütze, H. (2023). «GlotLID: Language Identification for Low-Resource Languages». Findings of EMNLP 2023 — §23.2 bölümündö atalgan, kyrgyz tiline okşoş abaldagy tilder üçün tüzülgön til anyktagyç.
- Washington, J.N., Salimzyanov, I. & Tyers, F.M. (2014). «Finite-state morphological transducers for three Kypchak languages». LREC 2014 — bul orfografiíanyn negizinde morfologiíalyk kuraldardy tüzüügö tiíeşelüü.

---

# Tirkemeler

## A tirkeme. `e` sistemasy

`э`/`е`/jarym ündüü sistemasy — orfografiíanyn eŋ az intuitivdüü bölügü, oşonduktan algoritm toluk berilet:

1. **Tüz bagyt.** Íottoşkon kirme sözdö sözdün başyndagy je ündüüdön kiíinki `е` → `íe`. Koş `ээ` → `ee`. Sözdün başyndagy `э` → `e`. Ünsüzdön kiíinki `е` → `e`. Íottoşpogon kirme sözdö ündüüdön kiíinki `э` → `e`.
2. **Teskeri bagyt.** `ee` → `ээ`. Sözdün başyndagy `e` → `э`. Ünsüzdön kiíinki `e` → `е`. Ündüüdön kiíinki `e` → `е`. `íe` — §18.1 bölümündögü tablitsa boíunça.
3. **Jarym ündüü.** Jogoruda çeçilgen udaalaştyktardan başka bardyk jerde `í` → `й`. Murunku `iy`/`iyi` kirgizüüsü (*biyik*) teskeri aílandyruuda kabyl alynat, birok al Jany-Latyn çygargan forma emes.
4. **Íottoşuu.** `ía → я`, `ío → ё`, `íu → ю`; jarym ündüüsüz hiatus jönököí boídon kalat (*diagramma → диаграмма*).

SPEC.md uşul ele erejelerdi özünün 2-bölümündö (4-ereje) jana 4.3-bölümündö baíandaít.

---

## B tirkeme. Normaldaştyruu, birdeílöö jana irettöö

Orfografiíalyk sunuş adatta kamtybagan, al emi bul orfografiíany işke aşyrgan ar bir adam birinçi ele künü tuş bolo turgan eseptöö talaptary:

- **Normaldaştyruu.** Konverterdin natyíjasy — **C normaldaştyruu formasy (NFC)** [[16]](#ref16): birikken kod çekiti bar bardyk jerde tamgany jana anyn belgisin bir kod çekiti menen jazgan Íunikod formasy. `í`, `ö` jana `ü` tamgalarynyn baarynda uşundaí kod çekitteri bar, al emi tamga jana belgi bolup bölünüp kelgen kirgizüü kirüüdö ele normaldaştyrylyşy kerek. `ŋ` tamgasy takyr kuramdyk bölüktörgö ajyratylbaít, bul kiíinki punkt üçün maanilüü.
- **Izdöö birdeílöösü.** Jalgyz `foldKey()` funktsiíasy eki formany teŋ bir indeks açkyçyna keltiret: `ö→o`, `ü→u`, `í→i`, `ç→c`, `ş→s`, `ŋ→n`, andan kiíin baş/kiçine tamgany birdeílöö — baş jana kiçine tamgany aíyrmalabaí salyştyruunun negizindegi Íunikod operatsiíasy. Toluk formanyn alty tamgasynyn beşöö üçün diakritikany standarttuu alyp saluu muruntan ele uşundaí kylat, antkeni `ç`, `ş`, `ö`, `ü` jana `í` D normaldaştyruu formasynda (NFD) — NFC formasynyn ajyratylgan tügöíündö — negizgi tamga jana belgi bolup bölünöt; `ä` da `a` tamgasyna uşundaí ele birdeílenet. `ŋ` toluk formanyn tamgalarynyn içinde özgöçö uçur, any açyk iştetüü kerek, antkeni Íunikoddun eç kandaí normaldaştyruusu any `n` tamgasyna birdeílebeít. Any koldongon konfiguratsiíalar üçün `ı→i` da uşundaí; al emi `ñ→n` üçün özünçö ereje kerek emes, antkeni `ñ` NFD formasynda `n` jana tilda bolup bölünöt.
- **Eki birdeílöö konfiguratsiíaga köz karandy.** §20 bölümündögü jazuu rejiminin tamgalary küígüzülgöndö, `x→h` jana `w→v` teskeri aílandyruu ataíylap jogotkon aíyrmalardy biriktiret, oşonduktan *haram* boíunça izdöö *xaram* sözün, *tav* boíunça izdöö *taw* sözün tabat. Alar küígüzülbögöndö, `x` jana `w` — çet tildegi attardagy kadimki latyn tamgalary, alar özdörünö birdeílenişi kerek: *Linux*, *LAX* jana *X Factor* — velíardyk jylçykçyly bar kyrgyz sözdörü emes, alardy *linuh* jana *lah* dep birdeílöö aralaş tildegi mazmundu kamtygan indekste tuura emes bolmok. Birdeílöö konfiguratsiíaga jaraşa bolot; al tamgalardyn kasiíeti emes.
- **Uvulíardyk tamgalar birdeí emes birdeílenet.** `ğ` üçün özünçö ereje kerek emes: al NFD formasynda `g` jana breve bolup ajyraít, `ç` jana `ş` syíaktuu tak oşondoí belgisinen ajyraít, oşonduktan *bolğon* jana *bolgon* bir açkyçka tüşöt. `q` — alyp sala turgan eç nersesi jok negizgi tamga, oşonduktan al özünö birdeílenet, al emi *qyz* jana *kyz* eki başka açkyç bolot. Jany-Latyn jazuusundagy tekstti da, `q` koldongon jöndöölördögü tekstti da kamtygan indeks alardy dal keltirüü üçün açyk `q→k` erejesin talap kylat; bul ereje konfiguratsiía ataíylap jazgan aíyrmany biriktirüünün esebinen `foldKey` funktsiíasynyn özünö kirişi kerekpi — bul açyk suroo.
- **Formalardyn ekvivalenttüülügü belgini alyp saluuçu rezervdik tür üçün saktalat.** Jany-Latyn jazuusunun ASCII dal keltirüüsündö jönököí forma birdeílengen formanyn *özü*, oşonduktan `çaí` jana `cai` bir ele açkyçka tüşöt. Ötkööl digraftuu rezervdik türdö jönököí forma — `chai`, al indeks `ch→c` jana `sh→s` erejelerin da koldonboso, başka açkyçka birdeílenet. Digraf stilindegi tekstti indekstegen ar bir ornotuuga uşul koşumça jup ereje kerek; belgini alyp saluuçu rezervdik türgö eç nerse kerek emes.
- **Irettöö.** Íunikoddun irettöö algoritminin ylaíyktaştyrylbagan tartibinde [[6]](#ref6) `ç` — `c` tamgasynyn, `ş` — `s` tamgasynyn varianty katary irettelet, bul kyrgyz alfavittik tartibi emes. Jany-Latyn üçün lokalga türkçö jazuu `ı`/`i` tamgalaryn ylaíyktaştyrgandaí ele irettöönü ylaíyktaştyruu kerek.

SPEC.md faílynyn 5-bölümü birdeílöö jol-jobosun parametrleri menen koşo kadam-kadamy menen beret.

---

## C tirkeme. Irettöönü ylaíyktaştyruu

Erejeler International Components for Unicode (ICU) erejeler sintaksisinde berilgen, any Common Locale Data Repository (CLDR), PostgreSQL sistemasynyn ICU irettöölörü, Java jana PyICU kabyl alat. `&` taíanyç tamgany ataít, `<` birinçi deŋgeeldegi aíyrmany (alfavittin özünçö tamgasyn), al emi `<<<` üçünçü deŋgeeldegi aíyrmany (baş/kiçine tamgasy menen gana aíyrmalangan oşol ele tamgany) belgileít. Tömöndögü birinçi sapty myndaí okuŋuz: *`ç` tamgasyn öz aldynça tamga katary `c` tamgasynyn dal artyna koí, al emi `Ç` tamgasyn oşol ele tamganyn baş tamgasy katary esepte.* Kalgan ar bir sap uşundaí ele işteít.

```
# Jany-Latyn
&c < ç <<< Ç
&i < í <<< Í
&n < ŋ <<< Ŋ
&o < ö <<< Ö
&s < ş <<< Ş
&u < ü <<< Ü

# Added in the settings with q and ğ
&g < ğ <<< Ğ
&k < q <<< Q

# Added with the ñ setting, which the CTA-aligned setting also uses
&ŋ < ñ <<< Ñ

# Added with the breve or tilde glide options
&í < ĭ <<< Ĭ < ĩ <<< Ĩ

# Added when the extended letters of §20 are enabled
&a < ä <<< Ä

# Replaces the &i rule in the settings with dotless ı; the trailing í applies
# only where the setting keeps the acute glide, since with the y glide
# there is no í to place and Y keeps its default Latin position
&h < ı <<< I < i <<< İ < í <<< Í
```

`ç` tamgasyn `b` tamgasynan kiíin koíuunun orduna `c` tamgasyna baíloo ataíylap jasalgan. `C` Jany-Latyn alfavitinin tamgasy emes, birok al çet tildegi attarda daíyma kezdeşet, oşonduktan `ç` tamgasyn aga baíloo eköönü janaşa irettep, taanyş emes jazylyştardyn tizme boíunça çaçyrap ketişine jol berbeít. Başka tamganyn ordun baskan tamga (`ŋ` üçün `ñ`, `í` üçün `ĭ` je `ĩ`) özü almaştyrgan tamganyn ordun eelep, anyn dal artynan irettelet. Bir da konfiguratsiía myndaí juptun eki tamgasyn teŋ koldonbogonduktan, kaísynysy tandalbasyn, tizme birdeí irettelet. Alfavitke kirbegen jana eç bir tamgaga baílanbagan tamgalar (`w`, `x`, oşondoí ele konfiguratsiía alardy kamtybagan jerde `q` je `c`) demeíki latyn orundaryn saktaít. **Alfavittin kuramy jana irettöönün kamtuusu — eki başka masele:** okutuu alfaviti irettöö baary bir jaígaştyryşy kerek bolgon tamgany kamtybaşy mümkün.

Irettöö toluk forma üçün anyktalgan; jönököí formadagy tekst ASCII koddoosunda, al oşol boíunça irettelet, oşonduktan al jerde `ş` jana `s` aralaşyp ketet. Irettöö jana B tirkemedegi izdöö birdeílöösü karama-karşy tarapka tartat: biri ekinçisi biriktirgen nerseni ajyratat, al emi sistemaga eköö teŋ kerek.

### Işke aşyruu boíunça eskertme

`Intl.Collator` özünçö ylaíyktaştyruulardy kabyl albaít, oşonduktan JavaScript işke aşyruusu jogorudagy erejelerdi tüzdön-tüz koldono albaít. Etalonduk mehanizm ar bir konfiguratsiía üçün açyk rang tablitsasynan kurulgan `compare(a, b)` funktsiíasyn kamtyít, al repozitoriíde saktalgan kütülgön irettöö menen tekşerilip bekitilgen; ICU erejeleri başka bardyk platformalar üçün jaryíalangan.

---

## D tirkeme. Mehanizm, klaviatura jaíylmalary jana CLI

Aílandyruu mehanizmi — iştöö uçurunda eç kandaí köz karandylygy jok taza TypeScript, al Node.js çöírösündö, brauzerlerde jana edge workers çöírölöründö özgörtüüsüz işteít. macOS jana Linux üçün klaviatura jaíylmalary `ö`, `ü`, `í`, `ŋ`, `ç` jana `ş` tamgalaryn modifikator menen bir basuuga jaígaştyrat, al emi buíruk sabynyn kuraly korpus menen iştöö üçün faíldardy jana agymdardy aílandyrat.

| Komponent | Kaída jaígaşkan |
| :--- | :--- |
| Aílandyruu mehanizmi | `packages/engine/src/convert.ts` |
| Synoo çöírösünün parametrlerinin baílanyştary | `packages/engine/src/testbedPresets.ts` |
| Alfavittik tartip jana salyştyruu | `packages/engine/src/collate.ts` |
| macOS klaviatura jaíylmasy | `packages/engine/keymaps/jany-latyn.keylayout` |
| Linux XKB jaíylmasy | `packages/engine/keymaps/jany.xkb` |
| Buíruk sabyndagy konverter | `node packages/engine/dist/src/cli.js` |