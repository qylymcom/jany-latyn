# Jany-Latyn: Kırgızca için Bir Latin Yazım Sistemi ve Karşılaştırmalı Test Ortamı

**Her yazılışın Kiril alfabesinden kuralla hesaplandığı bir tasarım önerisi, referans uygulama ve açık test ortamı**

**Sürüm:** 2026.5
**Durum:** Kamuya açık öneri (yazım sisteminin v1 sürümü) ve yaşayan test ortamı
**Yazar:** Emil Madraimov · salam@qylym.com
**Tarih:** Eylül 2026
**Çeviri:** İngilizce 2026.5 sürümünden yapay zekâ yardımıyla Türkçeye çevrilmiştir; kaynak olarak İngilizce metin esastır.
**Lisans:** Bu belge CC BY 4.0 lisansı ile yayımlanmıştır. Referans motor MIT lisanslıdır; web test ortamı ise PolyForm Noncommercial 1.0.0 kapsamında kaynak kodu erişilebilir olarak sunulmaktadır. Depodaki `LICENSING.md` dosyasına bakınız.
**Atıf:** Emil Madraimov (2026). *Jany-Latyn: A Latin Orthography and Comparative Testbed for the Kyrgyz Language*, version 2026.5. https://doi.org/10.5281/zenodo.22844476

---

## Özet

Jany-Latyn, Kırgızca için deterministik bir dönüştürücü ve tartışmalı her tercihin seçilebilir bir seçenek olduğu bir test ortamıyla birlikte yayımlanan 28 harfli bir Latin yazım sistemidir. Temel kısıtı, her yazılışın bir alıntı sözcük sözlüğü olmaksızın Kiril alfabesinden kuralla hesaplanabilmesidir; böylece son seksen altı yılın metinleri insan müdahalesi olmadan dönüştürülür ve dönüştürücünün çıktısının kendisi doğru Jany-Latyn olur. Bu kısıt, diğerlerinin bağlı olduğu harfleri belirler. Kırgız Kiril alfabesi tek bir `к` ve tek bir `г` yazar; bunlardan herhangi birini art damak ve küçük dil harfine (`k`/`q`, `g`/`ğ`) bölmek hangi sözcüklerin alıntı olduğunu bilmeyi gerektireceğinden Jany-Latyn tek bir `k` ve tek bir `g` korur. Bu durumda art–ön karşıtlığını ünlü tek başına taşır; bu yüzden `ы` harfi, büyük-küçük harf dönüşümünde ve ASCII ortamında `i` ile ayrımını yitiren noktasız `ı` yerine `y` ile yazılır; `y` kullanılmış olduğundan `й` yarı ünlüsü de `í` ile yazılır. Geri kalan eşlemeler `ж→j`, `ч→ç`, `ш→ş`, `х→h`, `ң→ŋ`, `ө→ö` ve `ү→ü` biçimindedir; ünlü uzunluğu çift yazımla gösterilir, Rusçadaki sertleştirme ve yumuşatma işaretleri ise yarı ünlüye kaynaştırılır; böylece her sözcük tek bir alfabetik belirteç olur. İki kullanım düzeyi birlikte tanımlanır: ayırt edici işaretleri taşıyan bir tam biçim ve değiştirilmemiş klavyeler için yalın bir ASCII biçimi. Belge ayrıca makinelerin gereksinim duyduğu ancak yazım sistemi önerilerinin genellikle dışarıda bıraktığı unsurları da saptar: kayıpları sonradan keşfedilmek yerine baştan belirtilmiş bir tersine dönüştürme, her iki biçim için tek bir arama katlama anahtarı ve harmanlama uyarlamasıyla birlikte bir alfabetik sıra.

---

## Bu belge hakkında

Bu metin, yazım sisteminin 1. sürümü için bir tasarım önerisidir; bir araştırma raporu ya da bir standart değildir. Bir dizi yazımsal tercihi savunur, her birinin ardındaki gerekçeyi ortaya koyar ve bu gerekçelendirmenin yanlış olabileceği noktaları adlandırır. Yazım sistemi büyük ölçekte kullanılmamış, kimseye öğretilmemiş ve bir devlet standardının tabi olacağı türden bir incelemeden geçmemiştir. Metinde bir değerlendirme bölümü yoktur: belirteçleyici davranışı, okuma hızı, klavye yazma hızı, yazı tipi görüntüleme ve arama hakkındaki iddialar belgelenmiş sistem davranışlarına ve yazarın deneyimine dayanır; §23 ise bunlardan hangilerinin ölçülebilir olduğunu ve her biri aleyhine hangi sonucun kanıt sayılacağını sıralar. Kaynak gösterilmedikçe buradaki hiçbir iddia deneysel bir bulgu olarak okunmamalıdır. Sayısal veriler arayan okurlar bu belgeyi hipotez, test ortamını ise bu iddiaların kendilerine katılmayan kişilerce yanlışlanabilmesi için var olan deney düzeneği olarak görmelidir.

---

## İçindekiler

- **[Kısım I — Kısa Bakışta Jany-Latyn](#kısım-i--kısa-bakışta-jany-latyn)**
  - [1. Sorun ve Jany-Latyn’in Sundukları](#1-sorun-ve-jany-latynin-sundukları)
  - [2. Bir Bakışta Alfabe](#2-bir-bakışta-alfabe)
  - [3. Arka Plandaki Kural: Tasarım İlkeleri](#3-arka-plandaki-kural-tasarım-ilkeleri)
  - [4. Geri Kalanı Şekillendiren Harfler](#4-geri-kalanı-şekillendiren-harfler)
  - [5. Sundukları ve Maliyetleri](#5-sundukları-ve-maliyetleri)
  - [6. Karşılaştırmadaki Yeri](#6-karşılaştırmadaki-yeri)
  - [7. Test Ortamı](#7-test-ortamı)
  - [Yazar Hakkında](#yazar-hakkında)
- **[Kısım II — Her Harfin Gerekçesi](#kısım-ii--her-harfin-gerekçesi)**
  - [8. Tek `k` ve Tek `g`: Sinharmonik Alofoni](#8-tek-k-ve-tek-g-sinharmonik-alofoni)
  - [9. `ы` için `y`: Art Düz Ünlü](#9-ы-için-y-art-düz-ünlü)
  - [10. `й` için `í`: Damaksıl Yarı Ünlü](#10-й-için-í-damaksıl-yarı-ünlü)
  - [11. `ж` için `j`: Ötümlü Yarı Kapantılı](#11-ж-için-j-ötümlü-yarı-kapantılı)
  - [12. `ö` ve `ü`: Ön Yuvarlak Ünlüler](#12-ö-ve-ü-ön-yuvarlak-ünlüler)
  - [13. `ç` ve `ş`: Islıklı Ünsüzler](#13-ç-ve-ş-islıklı-ünsüzler)
  - [14. `ң` için `ŋ`: Art Damak Genizsili](#14-ң-için-ŋ-art-damak-genizsili)
  - [15. Ünlüler, Uzunluk ve `е`](#15-ünlüler-uzunluk-ve-е)
  - [16. Alıntı İşaretleri `ъ` ve `ь` ile `я`, `ё`, `ю`](#16-alıntı-işaretleri-ъ-ve-ь-ile-я-ё-ю)
  - [17. Alfabetik Sıra](#17-alfabetik-sıra)
  - [18. Kiril’e Geri Dönüştürme](#18-kirile-geri-dönüştürme)
  - [19. İki Kullanım Düzeyi: Tam Biçim ve Yalın Biçim](#19-iki-kullanım-düzeyi-tam-biçim-ve-yalın-biçim)
  - [20. Değerlendirme Aşamasındaki Harfler: `ä`, `x`, `w`](#20-değerlendirme-aşamasındaki-harfler-ä-x-w)
- **[Kısım III — Bağlam](#kısım-iii--bağlam)**
  - [21. Jany-Latyn’in Mevcut Sistemlerle İlişkisi](#21-jany-latynin-mevcut-sistemlerle-ilişkisi)
  - [22. Toplumdilbilimsel ve Siyasi Bağlam](#22-toplumdilbilimsel-ve-siyasi-bağlam)
- **[Kısım IV — Açık Sorular ve Yönetişim](#kısım-iv--açık-sorular-ve-yönetişim)**
  - [23. Açık Sorular ve Gelecek Çalışmalar](#23-açık-sorular-ve-gelecek-çalışmalar)
  - [24. Yönetişim](#24-yönetişim)
  - [25. Sonuç](#25-sonuç)
- **[Kaynakça](#kaynakça)**
  - [İleri okuma](#ileri-okuma)
- **[Ekler](#ekler)**
  - [Ek A. `e` Sistemi](#ek-a-e-sistemi)
  - [Ek B. Normalleştirme, Katlama ve Harmanlama](#ek-b-normalleştirme-katlama-ve-harmanlama)
  - [Ek C. Harmanlama Uyarlaması](#ek-c-harmanlama-uyarlaması)
  - [Ek D. Motor, Klavye Düzenleri ve CLI](#ek-d-motor-klavye-düzenleri-ve-cli)

---

# Kısım I — Kısa Bakışta Jany-Latyn

Jany-Latyn, Kırgızca için önerilen 28 harfli bir Latin alfabesidir; bir bilgisayarın herhangi bir Kiril harfli Kırgızca metni, hiçbir alıntı sözcük listesi olmadan ve sonucu kimse denetlemeden otomatik olarak dönüştürebileceği biçimde tasarlanmıştır. Dönüştürücünün yazdığı metin düpedüz doğru Jany-Latyn’dir. Adın kendisi aşağıda açıklanan yalın biçimde yazılmıştır; tam biçimi *Jaŋy Latyn*, yani “Yeni Latin”dir.

Bu kural, geri kalanı şekillendiren iki harfi belirler. Kırgız Kiril alfabesinde tek bir `к` ve tek bir `г` vardır; bu nedenle Jany-Latyn `q` veya `ğ` olmaksızın tek bir `k` ve tek bir `g` korur: bunları bölmek hangi sözcüklerin ödünç alındığını bilmeyi gerektirir (*kosmos*, *qosmos* değil). Tek bir `k` varken *кы* ile *ки* dizilerini yalnızca ünlü ayırt eder; bu yüzden `ы` harfinin `i` ile bulanıklaşmayacak bir harfe gereksinimi vardır: büyük harflerde, küçük puntoda ve yalın yazmada `i` ile farkını yitiren noktasız `ı` değil, `y`. `y` kullanılmış olduğundan `й` kendi harfini alır: `й` harfinin işaretli bir `и` olması gibi, işaretli bir `i` olan `í`.

Geri kalanı tanıdıktır: *Japarov* ve *Jalal-Abad* örneklerinde olduğu gibi `ж` için `j`; Türkçe, Azerbaycanca, Türkmence ve Ortak Türk Alfabesi’nde olduğu gibi `ö`, `ü`, `ç` ve `ş`; biçimce `ң` harfine benzeyen `ŋ`; ve Kiril alfabesinde olduğu gibi çift yazılan uzun ünlüler. İşaretler kaldırıldığında sonuç, herhangi bir klavyenin yazabileceği yalın biçimdir: *jaŋy* sözcüğü *jany* olur.

Jany-Latyn devlet alfabesinin değiştirilmesi çağrısında bulunmaz. İnsanların her gün zaten yazdığı Latin harfli Kırgızcayı yazmak için belgelenmiş tek bir yol sunar ve şimdiden çalışmaktadır: yerli Kırgızcayı Kiril alfabesine bire bir geri yükleyen iki yönlü bir dönüştürücü, klavye düzenleri ve her seçeneğin gerçek metin üzerinde denenebildiği bir test ortamı.

## 1. Sorun ve Jany-Latyn’in Sundukları

Devlet düzeyinde ne olursa olsun (Kısım III), gayriresmî Latin çevriyazısı şimdiden olağan bir uygulamadır. Kırgızca konuşanlar mesajlaşmada, yazılımda, sosyal medyada, ticarette ve diaspora iletişiminde her gün hiçbir standart olmaksızın ve büyük bir çeşitlilikle Latin harfleri kullanmaktadır: `ү` harfi *u*, *y*, *v* veya *w* olarak; `ө` harfi *o*, *oe* ve hatta *8* rakamı olarak; `ж` harfi *j*, *zh* veya *dj* olarak; `ң` harfi *n* veya *ng* olarak görünmekte; ünlü uzunluğu ise yazara bağlı olarak tek harfle, çift yazımla ya da sona eklenen bir *h* ile yazılmaktadır. Bu projenin ilk ele aldığı sorun bu çeşitliliktir; çünkü bu, devlet politikasından bağımsız olarak bugün var olan bir sorundur.

**Jany-Latyn** iki şey sunar:

1. **Bugün yazılmak ve okunmak üzere kurulmuş bir yazım sistemi:** Latin `ö` ve `ü`; çengelli ıslıklı ünsüzler `ç` ve `ş`; ötümlü yarı kapantılı için `j`; art damak genizsili için `ŋ`; kapalı art düz ünlü için `y`; fonemik uzunluk için çift yazım ve her konumda damaksıl yarı ünlü için `í`.
2. **Tartışmalı her tercihin bir seçenek olduğu bir test ortamı:** `y` yerine `ı` koyun, alofonik `q` seçeneğini açın, her `ж` harfini `c` olarak yazın, ıslıklı ünsüzleri digraflara çevirin, `ŋ` yerine `ñ` yerleştirin ya da Kiril `ө` ve Kazakça `ұ` harflerini satır içinde görüntüleyin; ardından aynı metni her yapılandırmada okuyup sonucu değerlendirin.

Geri kalanı iki taahhüt belirler. Yazım sistemi tek bir düzey yerine **iki kullanım düzeyi** hâlinde tanımlanır: ayırt edici işaretleri taşıyan bir **tam biçim** ve değiştirilmemiş klavyeler için ASCII’de bir **yalın biçim**; bu ikisi birlikte tanımlanır ki biri diğeri için geçici bir çare olmasın (§19). Ayrıca makinelerin gereksinim duyduğu ölçüde belirlenmiştir: kayıpları açıkça belirtilmiş tersine dönüştürme, tek bir arama katlama anahtarı ve bir harmanlama uyarlamasıyla birlikte alfabetik sıra (§17, §18 ve Ek B–C).

Her şeyden önce Jany-Latyn, **Kiril’den türetilebilir** olacak biçimde tasarlanmıştır. Bundan sonra gelenlerin çoğunu, yazarın boş bir sayfadan başlasaydı farklı yapacağı tercihler de dâhil olmak üzere (§8), herhangi bir estetik beğeniden çok bu kısıt açıklar.

### 1.1 Bu sistem ne içindir

Jany-Latyn’in amaçlanan iki kullanımı vardır ve bunlar hafifçe farklı yönlere çeker:

- Hâlihazırda Kiril alfabesinde var olan metinler için derlemler, arşivler, yer adları ve veri tabanları üzerinde insan müdahalesi olmaksızın çalışmak üzere tasarlanmış **bir çevriyazı standardı**.
- İster bugün gayriresmî olarak ister gelecekteki bir noktada resmî olarak Kırgızcayı doğrudan Latin harfleriyle yazmak için **bir aday yazım sistemi**.

Bu ikisi çatıştığında çevriyazı kullanımı ağır basar. Nedeni pratiktir: son seksen altı yılın mevcut Kiril metinlerini otomatik olarak işleyemeyen bir öneri, işe derlemi gözden çıkararak başlayan bir öneridir. `k` harfinin `k`/`q` biçiminde bölünmek yerine birleştirilmesinin (§8), alıntı yarı ünlüsünün başka her yerde kullanılan aynı `í` harfiyle birleştirilmesinin (§15.1) ve tersine dönüştürmenin Rusça alıntı sözcükler yerine yerli Kırgızcayı yeğleyecek biçimde tanımlanmasının (§18.1) nedeni budur.

### 1.2 Jany-Latyn’in talep ettiği ve etmediği şeyler

Jany-Latyn devlet eliyle bir alfabe geçişini savunmaz. Bu soruyu incelemek ve hâlihazırda var olan gayriresmî yazımı daha tutarlı kılmak için bir araçtır. Devlet düzeyindeki mesele elli ya da yüz yıl içinde çözülse de hiç çözülmese de projenin yine bir işlevi vardır: milyonlarca Kırgızca konuşuru bugün hiçbir uzlaşım olmaksızın Latin harfleriyle yazmaktadır ve herhangi bir kararnameye bağlı olmaksızın belgelenmiş bir uzlaşımın var olması değerlidir.

Bu çerçeveleme retorik bir kaçamak değildir. Tasarımı değiştirir. Yasalaşma hedefleyen bir öneri bir müfredatı, yaptırımı ve bir alıntı sözcük listesini sürdürecek bir kurumu varsayabilir; dolayısıyla sözlük bağımlılığını (§8) ve onunla birlikte `q` harfini göze alabilir. Bir depoyu açan herkes için anında çalışması gereken bir öneri ise bunu göze alamaz; türetilebilir, sözlüksüz ve hâlihazırda var olan donanımlarda yazılabilir olmak zorundadır.

---

## 2. Bir Bakışta Alfabe

Jany-Latyn şu sırada 28 harften oluşur (§17):

**A B Ç D E F G H I Í J K L M N Ŋ O Ö P R S Ş T U Ü V Y Z**

**a b ç d e f g h i í j k l m n ŋ o ö p r s ş t u ü v y z**

**Gösterim.** Eğik yazı yazılışları gösterir. Köşeli ayraçlar Uluslararası Fonetik Alfabe’deki sesletimi gösterir; bu alfabede [y] sesi `ü` harfinin, [ɯ] sesi ise `ы` harfinin sesidir; dolayısıyla *kyz* (кыз, “kız”) ile *küz* (күз, “güz”) sözcüğünün sesletimi olan [kyz] farklı sözcüklerdir. Ayraç içindeki Kiril yazımı kaynak yazılışı verir.

On dört harf için açıklamaya gerek yoktur: her biri *bala* (бала, “çocuk”) ve *dos* (дос, “dost”) sözcüklerinde olduğu gibi her biçimde aynı şekilde yazılır. Tablo diğer yirmi iki Kiril harfini, her birinin Jany-Latyn biçimi, yalın biçimi ve bir örneğiyle birlikte vermektedir.

| Kiril | Jany-Latyn | Yalın biçim | Örnek | Bkz. |
| :---: | :---: | :---: | :--- | :---: |
| в, ф | v, f | v, f | *vagon* (вагон, “vagon”), *fabrika* (фабрика, “fabrika”), alıntı sözcüklerde | §20 |
| г | g | g | *gül* (гүл, “çiçek”); art ünlülü sözcüklerde küçük dil [ʁ], örneğin *aga* (ага, “ağabey”) | §8 |
| е | e veya íe | e, ie | *kel* (кел, “gel”); *Íevropa* (Европа, “Avrupa”) | §15.1 |
| ё | ío | io | *koíon* (коён, “tavşan”) | §16 |
| ж | j | j | *jol* (жол, “yol”) | §11 |
| й | í | i | *toí* (той, “şölen”), *biíik* (бийик, “yüksek”) | §10 |
| к | k | k | *kitep* (китеп, “kitap”); art ünlülü sözcüklerde küçük dil [q], örneğin *kar* (кар, “kar”) | §8 |
| ң | ŋ | n | *jaŋy* (жаңы, “yeni”) | §14 |
| ө | ö | o | *köl* (көл, “göl”) | §12.2 |
| ү | ü | u | *kün* (күн, “gün”) | §12.1 |
| х | h | h | *rahmat* (рахмат, “teşekkür ederim”), Rusça tarzı *kh* değil | §20 |
| ц | ts | ts | *tsirk* (цирк, “sirk”) | §18.1 |
| ч | ç | c | *çaí* (чай, “çay”) | §13 |
| ш | ş | s | *şaar* (шаар, “şehir”) | §13 |
| щ | ş | s | *borş* (борщ, “borş”) | §13 |
| ъ | yarı ünlüye kaynaştırılır | — | *obíekt* (объект, “nesne”) | §16 |
| ы | y | y | *yr* (ыр, “şarkı”) | §9 |
| ь | yarı ünlüye kaynaştırılır veya hece sonunda düşer | — | *semía* (семья, “aile”), *aprel* (апрель, “Nisan”) | §16 |
| э | e | e | *el* (эл, “halk”) | §15 |
| ю | íu | iu | *aíuu* (аюу, “ayı”) | §16 |
| я | ía | ia | *saíakat* (саякат, “yolculuk”) | §16 |

Uzun ünlüler Kiril alfabesinde olduğu gibi çift yazılır: *took* (тоок, “tavuk”), *küü* (күү, “ezgi”). Yalın biçim tüm işaretleri kaldırır ve başka hiçbir şeyi değiştirmez (§19).

Bir metin içinde:

> **Kiril.** Жаңы жылдын биринчи күнү тоого чыгып, бийик чокудан шаарды көрдүк. Үйгө кайтканда чай ичип, эс алдык.
>
> **Jany-Latyn.** Jaŋy jyldyn birinçi künü toogo çygyp, biíik çokudan şaardy kördük. Üígö kaítkanda çaí içip, es aldyk.
>
> **Yalın biçim.** Jany jyldyn birinci kunu toogo cygyp, biiik cokudan saardy korduk. Uigo kaitkanda cai icip, es aldyk.
>
> *(Yeni yılın ilk gününde dağa tırmandık ve yüksek bir zirveden şehri gördük. Eve döndüğümüzde çay içip dinlendik.)*

---

## 3. Arka Plandaki Kural: Tasarım İlkeleri

| İlke | Amaç | Kazanım |
| :--- | :--- | :--- |
| **1. Kiril’den türetilebilirlik** | Her Jany-Latyn biçimi bir sözcük listesi olmaksızın Kiril’den kuralla hesaplanabilir. | Mevcut derlem otomatik olarak dönüşür; hiçbir sözcük insan kararı gerektirmez. |
| **2. Giriş ergonomisi** | Standart ANSI/ISO klavyelerde hızlı yazma. | Az sayıda ölü tuş, değiştirici katman veya uzun basma. |
| **3. Sesbilimsel ekonomi** | Öngörülebilir alofonlar için ayrı harfler olmaması. | Daha az harf, fonemik doğrulukta kayıp olmaması. |
| **4. Tipografik ve hesaplamalı kararlılık** | Tek yazı sistemi, standart kod noktaları, önceden birleştirilmiş biçimler. | Sözcük ortasında yazı tipi yedeği yok, yazı sistemleri arası harmanlama yok, öngörülebilir büyük-küçük harf dönüşümü. |
| **5. Tasarım gereği iki kullanım düzeyi** | Ayırt edici işaretli bir tam biçim ile yalın bir ASCII biçiminin birlikte tanımlanması. | Basılı metinde ve değiştirilmemiş her klavyede okunaklılık. |

İlke 1, diğerlerinin çevresinde ayarlandığı kısıttır. İlke 5, §19’da açıklanır ve sistemin bir sınırlılıkla en kolay karıştırılan bölümüdür.

Bu kısıtı görmenin en kolay yolu, alternatif bir harfin Jany-Latyn’den farklılaşabileceği iki biçime bakmaktır. Bir *yer değiştirme*, bir Kiril harfini geçtiği her yerde farklı bir biçimle yazar: `ң` için `ñ`, `ы` için `ı`, `ч` için `ch`. Bir dönüştürücü bir yer değiştirmeyi tek başına uygulayabilir ve test ortamı bunların çoğunu sunar. Bir *bölünme* ise tek bir Kiril harfini sözcüğe bağlı olarak iki Latin harfine dönüştürür: `к` harfini `k` veya `q` harfine, `г` harfini `g` veya `ğ` harfine, `ж` harfini `c` veya `j` harfine. Kırgız Kiril alfabesi hangi sözcüklerin ödünç alındığını işaretlemez; bu yüzden bir bölünme yalnızca bunu belirten bir sözcük listesiyle doğru biçimde uygulanabilir; tek başına kuralla uygulandığında *космос* sözcüğünü *qosmos* olarak yazar. §8 bunu sözlük bağımlılığı olarak adlandırır.

Jany-Latyn’in yazımı hiçbir bölünme içermez. Bu nedenle dönüştürücünün yazdığı metin doğru Jany-Latyn’dir ve elde düzeltilmiş ikinci bir sürümün bakımını yapmak gerekmez. Aynı ilke `q`, `ğ` ve `c` harflerinin neden bulunmadığını (§8, §11) ve birer bölünme olan değerlendirme aşamasındaki üç harfin (`ä`, `x` ve `w`) doğrudan Latin harfleriyle yazan bir kişi tarafından kullanılabilmesine karşın dönüştürücü tarafından asla üretilmediğini (§20) açıklar. Sistemdeki tek liste öteki yönde çalışır: Kiril yazılışı kuralla geri yüklenemeyen isteğe bağlı bir alıntı sözcük kümesi, yalnızca Kiril’e geri dönüştürürken başvurulur (§18.2).

---

## 4. Geri Kalanı Şekillendiren Harfler

**Tek `k` ve tek `g`.** Kırgızcada küçük dil [q] ve [ʁ] sesleri, /k/ ve /g/ fonemlerinin sözcükteki ünlülerden öngörülebilen konumsal çeşitleridir ve Kırgız Kiril alfabesi bunları hiçbir zaman ayrı yazmamıştır. `q` ve `ğ` yazmak bir bölünme olurdu: *кар* sözcüğünü *qar* yapan ünlü kuralı, alıntı *космос* sözcüğünü de *qosmos* yapar ve bunu yalnızca bir sözcük listesi durdurur. Yazarın kendi tercihi, sesbilimsel ve tarihî gerekçelerle `q` yönündedir; Jany-Latyn yine de tek `k` ve tek `g` korur çünkü türetilebilirlikle tanımlanmıştır (§8).

**`ы` için `y`.** Tek `k` varken *кы* ile *ки* dizilerini yalnızca ünlü ayırt eder; bu nedenle `ы` harfinin `i` ile bulanıklaşmayacak bir harfe gereksinimi vardır. Noktasız `ı`, `i` harfinden küçük puntoda kaybolan, Türkçe ve Azerbaycanca yerel ayarları dışında büyük harfe çevrildiğinde birleşen (*kırgız* büyük harfte `KIRGIZ` olur) ve yalın biçim ile arama katlamasının kaldırdığı bir noktayla ayrılır. `y` her yerde ayırt edici kalır ve ülkenin İngilizce adında `ы` için zaten kullanılan harftir (§9).

**`й` için `í`.** `y` harfi `ы` için kullanıldığından yarı ünlünün kendine ait bir harfe gereksinimi vardır. Onu da `y` ile yazmak *тыйын* sözcüğünü `tyyyn` dizisine indirgeyecek, yalın `i` ise *бийик* sözcüğünü `biiik` barkoduna dönüştürecektir. `í`, tıpkı `й` harfinin işaretli `и` olması gibi işaretli bir `i` harfidir ve her konumda aynı biçimde yazılır: *toí*, *tyíyn*, *biíik* (§10).

**`ж` için `j`.** Kırgız Kiril alfabesi hem yerli yarı kapantılı [dʒ] hem de alıntı sözcüklerdeki [ʒ] için tek bir `ж` yazar; bu yüzden iki değil tek bir harf gerekir. Jany-Latyn, resmî Latin harflerine aktarımda ve pasaportlarda `ж` için zaten kullanılan `j` harfini alır (*Japarov*, *Jalal-Abad*); CTA’nın yerli sözcükler için `c` ve alıntılar için `j` bölünmesi yeniden bir sözcük listesi gerektirirdi (§11).

---

## 5. Sundukları ve Maliyetleri

### 5.1 Sundukları

- **Düzeltme adımı yok.** Bir arşivden yer adları kütüğüne kadar herhangi bir Kiril harfli Kırgızca metin tek geçişte dönüşür ve sonuç düzeltilmesi gereken bir taslak değil, doğru Jany-Latyn olur (§3).
- **Yerli Kırgızca gidiş-dönüşte bire bir korunur.** Kiril’e geri dönüştürme her yerli sözcüğü tam olarak geri yükler; yalnızca bazı alıntı sözcük yazılışları basitleştirilir (§18.1). Dolayısıyla Latin ve Kiril yan yana kullanılabilir ki çok dilli bir ülke buna her hâlükârda gereksinim duyar (§22.6).
- **Kırgız bir okurun tahmin edeceği harfler.** *Japarov* ve *Jalal-Abad* örneklerindeki gibi `j`; ülkenin İngilizce adındaki gibi `y`; Türkçe, Azerbaycanca, Türkmence ve CTA’daki gibi `ö`, `ü`, `ç` ve `ş`; `й` ve `ң` harflerini çağrıştıran `í` ve `ŋ`; Kiril’deki gibi çift yazılan uzun ünlüler (§22.4).
- **Kimseye öğretilmeden önce daha az yanlış okuma.** Bir tabelayla karşılaşan bir okur, temel harfleri zaten bildiği değerlerle okur. `ÇYGUU` olarak yazılan *Чыгуу* (çıkış) tek bir harfle, `ч` için `C` ile yanıltabilir; CTA uyumlu `ÇIĞUU` buna ikinci bir harf, `ы` için `I` ekler ve Kiril değerleriyle okunduğunda kamusal tabelalardaki en yaygın sözcüklerden birini müstehcen hâle getirir (§22.4).
- **Yazılımda güvenli.** Büyük harfler sözcüğü asla değiştirmez (`KYRGYZ` asla `KIRGIZ` olamaz), hiçbir kesme işareti aramada veya metin seçiminde bir sözcüğü bölmez (§16) ve yalın biçim aynı zamanda arama anahtarıdır, dolayısıyla *jany* araması *jaŋy* sözcüğünü bulur (§19, Ek B).
- **Bir öngörü olarak daha kolay bulunabilirlik.** *kylym* ve *jaŋy* gibi yazılışlar başka hiçbir dile ait değildir; buna karşılık CTA uyumlu *qılım* aynı zamanda Azerbaycanca bir fiil çekimidir ve *canım* (жаным) Türkçedir (§22.2). Bu, tercihlerin bir gerekçesi olarak değil, sınanacak bir öngörü olarak sunulmaktadır (§23.2).
- **Şimdiden kullanılabilir.** Hiçbir devlet kararı gerekmez; dönüştürücü, klavye düzenleri ve test ortamı şimdiden çalışmaktadır (§7, Ek D).

### 5.2 Bilinen sınırlılıklar

- **Latin→Kiril dönüştürme Rusça alıntı sözcükler için kayıplıdır.** Yerli Kırgızca söz varlığı gidiş-dönüşte bire bir korunur; yalnızca alıntılarda bulunan ayrımlar (`ц`, `щ`, `ё` ile `йо` ayrımı, `ъ`, `ь`) gidiş-dönüşte korunmaz. Bu tasarım gereğidir ve §18.1’de kesin olarak belirtilmiştir.
- **Yalın biçim tek yönlüdür.** ASCII ile yazılmış metin mekanik olarak tam biçime veya Kiril’e geri yüklenemez (§19).
- **`ŋ` telefonlarda eşit düzeyde erişilebilir değildir.** ABD yerel ayarında Android klavyesinin uzun basma menüsünden ulaşılabilmektedir (yazar tarafından doğrulanmıştır); iOS davranışı doğrulanmamıştır. Bulunmadığı yerlerde yalın biçim onu `n` olarak yazar (§19); `ñ` ise bir karşılaştırma ayarı olarak sunulmaktadır (§14).
- **Lehçe kapsamı kısmidir.** Değerlendirme için üç genişletilmiş harf (`ä`, `x`, `w`) sunulmaktadır ve hiçbiri Jany-Latyn’in parçası değildir (§20); diğer lehçe özellikleri hiç temsil edilmemektedir.
- **Henüz bir öğretim yöntemi yoktur.** Buradaki hiçbir unsur öğrencilerle, sınıflarda veya el yazısında sınanmamıştır.

---

## 6. Karşılaştırmadaki Yeri

Jany-Latyn, Kırgızistan’ın coğrafi adlar için kullandığı Latin harflerine aktarım sistemi olan BGN/PCGN ile tanınabilirlik açısından en önemli harflerde (`ж` için `j` ile `ö` ve `ü`) uyuşur; ancak yabancı okurlar için çevriyazı yapmak yerine Kırgızca konuşanlar tarafından yazılmak üzere kurulmuştur (§21.1). 2024’te Bakü’de üzerinde uzlaşılan Ortak Türk Alfabesi ile `ö`, `ü`, `ç` ve `ş` harflerini paylaşır ve her biri Kısım II’de tartışılan altı harfte ondan ayrılır (§21.2). Sırtbay Musayev’in 28 harfli taslağıyla — Tınıstanov’un 1928 alfabesinin `k`/`q` bölünmesini geri getiren, `ж` harfini `c` olarak yazan ve art damak genizsilini `ņ` ile işaretleyen bir canlandırmasıyla — aynı dört harfi ve `ы` için `y` harfini paylaşır (§21.3).

| Kiril | BGN/PCGN | CTA | **Jany-Latyn** |
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

(ALA-LC ve ISO 9’u da ekleyen §21.1’deki tablodan özetlenmiştir.)

Bu belgede “Jany-Latyn” her zaman önerilen alfabeyi ifade eder. Test ortamının görüntüleyebildiği diğer her yapılandırma, `ŋ` yerine `ñ` gibi tek bir yer değiştirme bile olsa, bir *karşılaştırma ayarı* sayılır: Jany-Latyn’in bir çeşidi değil, aynı metin üzerinde Jany-Latyn’e karşı değerlendirilecek bir yapılandırmadır. Belge boyunca her biri Jany-Latyn’den bir adım daha uzaklaşan üç karşılaştırma ayarı yinelenir. *аңкыгый жигит* (“sakar delikanlı”) ifadesi bu ayarların değiştirdiği her harfi içerir:

| Ayar | Jany-Latyn’den farkları | *аңкыгый жигит* | Sözcük listesi gerekir mi? |
| :--- | :--- | :--- | :---: |
| **Jany-Latyn** | — | **aŋkygyí jigit** | Hayır |
| q+ğ | art ünlülü sözcüklerde `к` için `q` ve `г` için `ğ` | aŋqyğyí jigit | Evet |
| q+ğ+ı | ayrıca `ы` için `ı` ve `й` yarı ünlüsü için `y` | aŋqığıy jigit | Evet |
| CTA uyumlu (q+ğ+ı+c+ñ) | ayrıca yerli `ж` için `c` ve `ң` için `ñ` | añqığıy cigit | Evet |

Son sütun, §3’ün savının tek satırdaki özetidir: Jany-Latyn’in ötesindeki her ayar bir bölünme içerir ve bir bölünme yalnızca bir sözcük listesiyle doğru yazılır. *Жигит* ön uyumludur; dolayısıyla `ğ` yazıldığı yerlerde bile `г` harfi `g` olarak kalır ve q+ğ+ı satırındaki `ı` harfinin yanında `и` harfi `i` olarak kalır. Her ayardaki gerçek sözcükler ve kesintisiz bir metin parçası §21.2’de, yan yana alfabeler ise §17.3’te yer almaktadır.

---

## 7. Test Ortamı

İstemci tarafında çalışan bir uygulama tek tıklamalı hazır ayarlar — CTA uyumlu ayara (`ы` için `ı`, yarı ünlü için `y`, `ж` için `c`, `q` ve `ğ`, `ң` için `ñ`) karşı Jany-Latyn temel çizgisi — ile birlikte Kısım II’de tartışılan her değişken için seçilebilir seçenekler sunar:

| Değişken | Seçenekler | Tartışıldığı yer |
| :--- | :--- | :---: |
| Ön yuvarlak ünlüler | `ö/ü` (Jany-Latyn), `ө/ü`, `ө/ұ`, `ө/ū` | §12.1, §12.2 |
| Islıklı ünsüzler | `ç/ş` (Jany-Latyn), `ch/sh` | §13 |
| Yarı kapantılı `ж` | `j` (Jany-Latyn), `c` — alıntı sözcükler için mekanik işleyen CTA değeri | §11 |
| Alıntı işaretleri `ъ`/`ь` | yarı ünlüye kaynaştırılmış (Jany-Latyn), kesme işareti | §16 |
| Art damak genizsili | `ŋ` (Jany-Latyn), `ñ` | §14 |
| Yarı ünlü | `í` (Jany-Latyn); işaretli alternatifler olarak `ĭ` ve `ĩ`; reddedilen barkod eşlemesi olan yalın `i`; `y` | §10, §9 |
| Art düz ünlü | `y` (Jany-Latyn), `ı` | §9 |
| Küçük dil kapantılısı | birleşik `k` (Jany-Latyn), alofonik `q` | §8 |
| Küçük dil sızıcısı | birleşik `g` (Jany-Latyn), alofonik `ğ` | §8 |
| `х` için harf | `h` (Jany-Latyn), `x` — art damak değerini daha iyi bulan okurlar için her `х` harfi `x` olarak yazılır; aşağıdaki bölünme değildir | §20 |
| ASCII yedek modu | `c/s` biçimine işaret kaldırma (Jany-Latyn), `ch/sh` biçimine genişletme | §19 |
| Genişletilmiş harfler | kapalı (Jany-Latyn); `ä`, `x`/`h`, `w` her biri bağımsız seçilebilir — yazım kipi harfleridir, ileri dönüştürmeyle asla üretilmez | §20 |

Yan yana bir inceleyici, herhangi bir birleşimi gerçek metin üzerinde çalıştırır.

Kolaylık sağlamak amacıyla birkaç seçenek birbirine bağlıdır. `ı` seçildiğinde `q`, `ğ` ve `y` yarı ünlüsü de açılır: `ы` harfi `ı` olarak yazıldığında `y` serbest kalır ve `í` harfini tutmak `ı`, `i` ve `í` harflerini yalnızca işaretleriyle ayrılan üç harf olarak yan yana getirir (§17.3). `q` seçimi `ğ` harfini de beraberinde getirir ve geri döndüğünde her eşleşme çözülür. Bu eşleşmeler yalnızca başlangıç seçeneklerini ayarlar; dolayısıyla `k` ile `ı`, `ğ` olmaksızın `q` ve `í` yarı ünlüsüyle `ı` sonradan ilgili seçeneği değiştirerek erişilebilir kalır; tek kısıtlama `y` yarı ünlüsünün yalnızca `ы` harfi `ı` olarak yazılırken sunulmasıdır, çünkü aksi hâlde bu ikisi çakışır. Motorun kendisi herhangi bir birleşimi kabul eder. Test ortamı ayrıca, `ĩ` yarı ünlüsü `ñ` ile birleştirildiğinde bunu engellemeden uyarı verir; çünkü bu durumda aynı tilde birbiriyle ilgisiz iki iş yapmış olur. SPEC.md belgesinin 7. bölümü bu eşleşmeleri eksiksiz biçimde listeler.

Bu seçenekler eşit derecede geçerli yazım üsluplarından oluşan bir menü değildir. Her biri karşı örneğin anlatılmak yerine üretilebilmesi için vardır: `q` seçeneği *kosmos* sözcüğünü *qosmos* yapar, `ı` seçeneği büyük harfe çevirmenin sonuca ne yaptığını gösterir ve Kiril `ө` açılıp çıktı bir ad listesi olarak sıralanabilir.

Proje, benimsenme çağrısı yapmak yerine yanlışlamaya davet eden bir öneri olarak yürütülmektedir: tartışmalı her tercih kodda uygulanmıştır, tüm kaynak kodu kamuya açıktır, barındırılan test ortamı okurların hangi yapılandırmaları seçtiğini kaydederek dağılımın savların yanında yayımlanabilmesini sağlar ve motorun yerli Kırgızcayı bozduğu yinelenebilir bir örnek, fikir birliğinden daha değerlidir (§24).

---

## Yazar Hakkında

Yazar, biyoinformatik ve filoloji alanlarında üniversite dersleri almış, ana dili olarak otuz yıllık Kırgızcanın yanı sıra akıcı İngilizce ve Rusça bilen bir yaşam bilimleri uzmanı ve kendi kendini yetiştirmiş bir yazılım geliştiricidir. Bu konum belgeyi iki biçimde şekillendirir. Kırgızcada neyin doğal okunduğu, neyin neyle çakıştığı ve insanların gerçekte ne yazdığı hakkındaki yargılar ana dili konuşuru yargılarıdır ve öyle sunulur. Belirteçleyiciler, harmanlama ve görüntüleme hakkındaki yargılar ise belgelenmiş davranıştan yola çıkan bir mühendisin akıl yürütmesidir; ölçüm değil öngörü oldukları yerlerde öngörü olarak işaretlenir ve test ortamının sınamak üzere kurulduğu konular olarak §23’te sıralanır.

---

# Kısım II — Her Harfin Gerekçesi

## 8. Tek `k` ve Tek `g`: Sinharmonik Alofoni

Birçok Türk dili yazım sistemi, küçük dil kapantılısı [q] ve küçük dil sızıcısı [ʁ] için ayrı harfler kullanır. Kırgızcada bunlar sözcüğün ünlülerinden öngörülebilen konumsal alofonlardır:

| Uyum bağlamı | Ünlüler | Fonem | Gerçekleşme | Grafem | Örnekler |
| :--- | :--- | :---: | :--- | :---: | :--- |
| Art | a, o, u, y | /k/ | Küçük dil kapantılısı [q] | **k** | *kar* (кар) [qar], *kyz* (кыз) [qɯz] |
| Art | a, o, u, y | /g/ | Küçük dil sızıcısı [ʁ] | **g** | *aga* (ага) [aʁa], *kyrgyz* (кыргыз) [qɯrʁɯz] |
| Ön | e, i, ö, ü | /k/ | Art damak kapantılısı [k] | **k** | *kel* (кел) [kel], *küz* (күз) [kyz] |
| Ön | e, i, ö, ü | /g/ | Art damak kapantılısı [g] | **g** | *gül* (гүл) [gyl], *egemen* (эгемен) [egemen] |

*kar* sözcüğünü okuyan bir Kırgızca konuşuru kendiliğinden [q] üretir; orada ön [k] üretmek dilin ses dizilimini ihlal ederdi. Bu ikisini ayrı yazmak, konuşurların zaten uyguladığı bir kuralı kodlar. Türkçe de aynı gerekçeyle `k` ve `g` için aynı tercihi yapar; ancak ilişkili bir ayrım için `ğ` harfini korur.

Yazarın kendi tercihi `q` yönündedir. Sesbilimsel açıdan daha dürüst harf budur, Türk dilli ve Arap harfli dünyanın büyük bölümünün başvurduğu harftir ve özellikle Kırgızcada gerçek bir tarihî ağırlığı vardır. Jany-Latyn yine de `k` ve `g` harflerini birleştirir ve bunun nedeni `q` harfinin yanlış olduğuna dair bir inanç değil, İlke 1’dir.

Eğer `q` yazılırsa ötümlü karşılığı da onu izler: *egemen* sözcüğünde ön [g], *kagyluu* sözcüğünde ise art [ʁ] vardır ve ötümsüz çifti bölen her sistem ötümlü çifti de bölmüştür. Tınıstanov’un 1928 alfabesinde `k` ve `g` harflerinin yanında `q` ve `ƣ` vardı [[4]](#ref4), CTA’da `q` ve `ğ` vardır [[8]](#ref8) ve 2021 Kazak alfabesi `ғ` için breveli ğ kullanır [[5]](#ref5). `ğ` olmaksızın bir `q` sistemi mümkündür, çünkü ünlüler `k` sesini öngördüğü gibi `g` sesini de öngörür; ancak bunu savunan hiçbir şey yoktur: `qosmos` üreten kural aynı zamanda `ğaz`, `ğaloş`, `mağazin` ve `proğramma` da üretir ve ikisini de yalnızca bir alıntı sözcük sözlüğü durdurur. İki harf yalnızca hangi katmana yük bindirdikleri bakımından ayrılır. `q` bir ASCII tuşudur ve yalın biçime taşınır; `ğ` ise bir ayırt edici işaret taşır ve orada `g` harfine katlanır. **Dolayısıyla bu sistemin tutumu, `q` harfinin `ğ` harfini gerektirdiği yönündedir.** Jany-Latyn ikisini de reddeder; test ortamı ise asimetrik yapılandırmaya yine de bakılabilmesi için bunları bağımsız seçenekler olarak tutar.

Üç gerekçe Jany-Latyn’i birleşik `k` ve `g` üzerinde tutar:

- **Kiril’den türetilebilirlik.** Kırgız Kiril alfabesinde hiçbir zaman ayrı bir `қ` bulunmamıştır [[4]](#ref4); dolayısıyla `q` harfi, hangi sözcüklerin alıntı olduğunu da bilmeyen hiçbir kuralla kaynak metinden çıkarılamaz. Tarihî ayrıntıya dikkat edilmelidir: birleşme Tınıstanov’un işi değildi. Hem Arap alfabesi reformu hem de Latin alfabesi bu iki sesi birbirinden ayırıyordu [[4]](#ref4). Tek `К` harfi, Tınıstanov’un tasfiyelerde idam edilmesinden iki yıl sonra, 1940’ta Kiril alfabesiyle birlikte geldi. Bu kararı kim, hangi nedenle vermiş olursa olsun, o zamandan beri seksen altı yıllık okuryazarlık bunun üzerine kurulmuştur.
- **Alıntı sözcükler.** Modern Kırgızca *kosmos*, *karta*, *bank*, *respublika* sözcüklerini hiçbir zaman [q] değil, yalın Avrupa [k] sesiyle alır. Bir uyum kuralı bunları yerli art uyumlu köklerden ayıramaz: `qosmos`, `qarta` ve doğru `respublikalyk` yerine `respublikalıq` gibi karma uyumlu melezler üretir. Bakımı yapılan bir alıntı sözcük sözlüğü dışında temiz bir çözüm yoktur. Buna **sözlük bağımlılığı** diyelim: hangi sözcüklerin ödünç alındığını bir şey bilmedikçe uygulanamayan bir yazım kuralı. Arkasında bir enstitü ve bütçe bulunan devlet destekli bir standart bu bağımlılığı taşıyabilir. Bir arşiv üzerinde insan müdahalesi olmadan çalışması gereken bir dönüştürücü ise taşıyamaz.
- **Ekonomi.** Öğretilecek ve klavyede ulaşılacak iki harf daha azdır.

En güçlü karşı sav ters yönde işler. Alıntılar art ünlülü sözcüklerde art damak [k] sesini koruduğu için, [k] ve [q] sesleri modern konuşma Kırgızcasında artık tartışmalı da olsa anlam ayırt edici biçimde karşıtlık oluşturmaktadır (*koş* karşısında *kosmos*); bu da bir alofonun foneme dönüşmesinin klasik profilidir. Bu çözümleme doğruysa, makine tarafından türetilmek yerine insanlar tarafından yazılacak gelecekteki bir standart `q` harfini benimsemelidir. Yer adları bunu keskinleştirir: *Каракол* ve *Каракөл* farklı kentlerdir; `Karakol` ve `Karaköl` biçiminde bir harf, `Qaraqol` ve `Qaraköl` biçiminde ise iki harf farkla ayrılırlar. Jany-Latyn’in tutumu “q yanlıştır” demekten daha dardır: tutumu, `q` harfinin bir sözlük olmaksızın Kiril’den türetilemeyeceği ve bu sistemin türetilebilirlikle tanımlandığıdır.

Uyum kuralı da ancak okuduğu ünlüler kadar iyidir. Kiril alfabesi hem art ünlü hem de onun öne kaymış çeşidi için tek bir `а` yazar; bu yüzden `q` kipi *äkä* ile *aqa* sözcüklerini ayırt edemez; genişletilmiş `ä` harfi kuralın eksik bıraktığını tamamlar (§20).

Test ortamının `q` seçeneği bunun ileri sürülmek yerine denetlenebilmesi için vardır. Güncel haber veya sosyal medya metinleri üzerinde çalıştırıldığında, `q` kipi alıntı sözcük bozulmalarını daha bir paragraf içinde ekrana getirir.

---

## 9. `ы` için `y`: Art Düz Ünlü

CTA ve Türkçe, `ы` [ɯ] sesini noktasız **`ı`** ile yazar [[8]](#ref8). Jany-Latyn **`y`** ile yazar ve test ortamı bu ikisinin yer değiştirmesine olanak tanır. Bunu yapmak, birbirini ağırlaştıran iki sorunu ortaya çıkarır.

İlki büyük-küçük harf dönüşümüdür. Noktasız `ı` ve noktalı `i`, iki farklı büyük harfin küçük harf biçimleridir ve bunları doğru eşlemek yerel ayara duyarlı büyük-küçük harf dönüşümü gerektirir; Türkçe ve Azerbaycanca eşlemeleri Unicode Karakter Veri Tabanı’nda belgelenmiş özel bir durumdur [[11]](#ref11). Türkçe buna ikinci bir büyük harfle karşılık verir: `ı` için `I` ve `i` için `İ`. Bu yalnızca zincirdeki her sistem bu eşlemeleri uygularsa ve yalnızca okur bu harfi biliyorsa geçerlidir. Türkçe öğrenmemiş bir Kırgız okurun `İ` harfinin varlığını bilmesi için hiçbir nedeni yoktur; dolayısıyla harf dönüşümü doğru yapılmış bir `KIRGIZ` yazısı yine de *КИРГИЗ* olarak okunur: ayrım kodlamada korunur ama okumada kaybolur. Göl adı da tamamı büyük harfli bir örneğe gerek kalmadan aynı noktayı gösterir; zira *Ысык-Көл* adı `Isıq-Köl` olarak yazılır ve onu başlatan büyük harf, bu yerel ayarların dışındaki herkes tarafından noktalı `i` olarak okunur.

Bir `tr_TR` veya `az_AZ` yerel ayarı dışında — yani çoğu veri tabanında, dizinde ve çalışma zamanında — ayrım kodlamada da kaybolur, çünkü her iki harf de yalın `I` harfine indirgenir. *КЫРГЫЗ* ve *КИРГИЗ* bu durumda aynı dize olarak gelir ve `kırgız` büyük harfe çevrildiğinde Kırgızistan’ın geride bıraktığı bir dış ad olan `KIRGIZ` olur. Bu nedenle noktasız yapılandırma, metnin dolaştığı her yerde yerel ayara uygun büyük-küçük harf dönüşümüne bağımlılık ekler. Latin `y` harfi hiçbir bağımlılık taşımaz: `Y` ve `I` her yerel ayarda ve her harf dönüşümü işlevinde ayrı büyük harflerdir ve devletin 1993’ten beri antlaşmalarda, pasaportlarda ve diplomatik kullanımda geçen kendi İngilizce adı *Kyrgyz Republic* biçimindedir.

İkincisi, bu ayrımın güvenilmez olmasıdır. `y` ve `i` her boyutta karıştırılamaz, bu yüzden *kyna* ve *kina* asla çakışmaz. Noktasız `ı` altında aynı çift tek bir noktayla ayrılır; bu nokta küçük puntoda, el yazısında ve düşük çözünürlüklü ekranlarda bozulur. Tam biçimin altında ise bütünüyle ortadan kalkar: yalın biçim ve arama katlamasının her ikisi de `ı` harfini `i` harfine indirger; bu da *kına* ile *kina* sözcüklerini gündelik yazıda tek bir dize, bir dizinde ise tek bir anahtar hâline getirir. `y` ile ayrım her yerde korunur. Ünlü bu farkı artık taşıyamadığında onu bir ünsüzün taşıması gerekir; test ortamının `ı` kipinin alofonik `q` seçeneğini açmasının nedeni budur. Dolayısıyla `ı` harfini benimsemek tek bir harfe mal olmaz: §8’deki `q` sorununu yeniden açar.

Musayev’in önerisi aynı harfe farklı bir yönden ulaşır (§21.3) ve bunu yaparken kendi tarihî temelinden ayrılır: Tınıstanov `ы` sesini `ь` ile yazmış ve `y` harfini `ү` için kullanmıştı [[4]](#ref4).

---

## 10. `й` için `í`: Damaksıl Yarı Ünlü

Hem `и` [i] hem de `й` [j] seslerini yalın `i` ile yazmak bir barkod üretir: *бийик* → `biiik`, *кийим* → `kiiim`, *кийин* → `kiiin`. Arka arkaya üç ya da dört dikey çizgiyi çözümlemek güçtür ve bunları uzun bir ünlüden ayırmak olanaksızdır. Test ortamı bu eşlemeyi istendiğinde görüntüler (§7); böylece bu sav üç sözcük yerine gerçek metinden bir sayfa üzerinde değerlendirilebilir.

Jany-Latyn yarı ünlüsü her konumda **`í / Í`** harfidir: *aí*, *toí*, *tyíyn*, *biíik*, *kiíim*. Bunu dört sav destekler.

1. **Ayrı bir yarı ünlü harfi seçilmiş değil, zorunlu kılınmıştır.** CTA yarı ünlüyü `y` ile yazar; bunu göze alabilir çünkü art düz ünlüyü noktasız `ı` harfine taşır [[8]](#ref8). Jany-Latyn `y` harfini o ünlüye atar (§9), dolayısıyla iki görev aynı harfi paylaşamaz. Paylaşsalardı, yerli ünlü artı yarı ünlü dizileri çökerdi: *тыйын* sözcüğü `tyyyn`, *кыйык* sözcüğü `kyyyk`, *айыл* sözcüğü `ayyl` olurdu. Bu, harfin gidermek için var olduğu aynı okunaklılık sorununun bir ünlü solda yeniden ortaya çıkmasıdır.

2. **Akut, başka yerlerdeki anlamı için değil, `й` ile ilişkisi için seçilmiştir.** `й`, üzerinde işaret bulunan bir `и` harfidir; `í`, üzerinde işaret bulunan bir `i` harfidir. Kırgız Kiril alfabesinde okuryazar bir okur bu çifti zaten ilişkili ama ayrı görür ve `i`/`í` bu ilişkiyi bozulmadan aktarır.

3. **Sözlüksel kökleri korur.** Kırgızca eklemeli bir dildir ve gövdeler tanınabilir kalmalıdır. *Кийим* (giysi) sözcüğü şeffaf biçimde *кий-* (*kií-*, giymek) kökünden gelir; *тийиштүү* sözcüğü *тий-* (*tií-*) kökünden gelir. Bunları `kiim` ve `tiiştüü` biçiminde kısaltmak fiil gövdesini budar ve ilişkili biçimleri keyfî olarak böler: `biíi` (onun dansı) yarı ünlüyü korurken `biíik` (yüksek) onu yitirirdi.

4. **Yarı ünlüyü istisnasız kılar.** Her Kiril `й` harfi, konumsal kurallar ve sözlük aramaları olmaksızın her konumda `í` olur.

Barkod savı yalnızca tam biçim için geçerlidir. Yalın biçimde `í` harfi `i` harfine düşer ve *biíik* yeniden `biiik` olur (§19). Bu, iki kullanım düzeyli tasarımın kaçındığı bir şey değil, onun gerçek bir maliyetidir.

### Neden başka bir işaret değil de akut

Kısacası: `i` üzerine oturabilecek işaretler arasında akut en hafif ve en yaygın erişilebilir olanıdır ve bu sistem içinde rakip bir görevi yoktur; çünkü Kırgızca vurgusu yazılmaz ve uzunluk çift yazımla gösterilir. `i` doğru temel harftir, çünkü [j] sesi [i] sesinin yarı ünlü karşılığıdır ve işaretli bir `i`, işareti kaldırıldığında `y` harfine değil `i` harfine döner. Tek gerçek çatışma, öğretim materyallerindeki vurgu işaretleriyledir; bu çatışma dardır ve yarı ünlüyü değiştirmekten daha iyi bir çözümü vardır.

2 numaralı sav bir itirazı ayakta bırakır. Akut başka yerlerde başka çağrışımlar taşır: Çekçe, Slovakça, Macarca ve İrlandacada uzunluğu, İspanyolcada vurguyu işaretler ve §12.1’de makronu eleyen de yabancı bir çağrışımdı. Fark, *Kırgız* bir okurun sayfaya ne getirdiğidir. Kırgızca vurgusu düzenlidir ve asla yazılmaz, uzunluk ise çift yazımla gösterilir; dolayısıyla bu sistem içinde akutun rakip bir görevi yoktur; makronun olağan değeri olan uzunluk ise Kırgızcada canlı bir kategoridir.

Bu tercihin içinde iki soru gizlidir ve bunları ayırmak daha iyidir: hangi işaret ve hangi harfin üzerinde duracağı.

`i` üzerine oturabilecek işaretlerden diyerez (`ï`), `ö` ve `ü` üzerindeki öne getirme işaretleriyle görsel olarak çakışırdı. Düzeltme işareti (`î`) mevcuttur, ancak Türkçede Arapça alıntı sözcüklerde uzunluğu işaretler (*millî*, *tarihî*); bu da makronu eleyen itirazın en yakın Latin harfli Türk dili geleneğinden gelmesidir. Karon (`ǐ`) metin boyutlarında daha ağırdır ve Latin-1 dışında kalır. İki alternatif, bir kenara itilmek yerine test ortamı seçenekleri olarak sunulacak kadar yakındır (§7). Bunlar arasında en güçlü gerekçeye breve `ĭ` sahiptir: bir breve altındaki `и` olan Kiril harfinin bire bir karşılığıdır ve ALA-LC bu nedenle onu seçmiştir [[8]](#ref8). Ağırlık ve erişim bakımından kaybeder: okuma boyutlarında akuttan daha ağırdır, Latin-1 dışındadır ve çoğu klavye düzeni ile uzun basma menüsünde yoktur; bunlar derece farkları olduğu için test ortamı tüm metinleri onunla da görüntüler ve karşılaştırmanın bir sayfa üzerinde yapılmasına olanak tanır. Tilde `ĩ` daha da zayıftır ve bir etkileşim taşır: art damak genizsili için `ñ` harfini de seçen bir okur aynı işareti birbiriyle ilgisiz işler gören iki harfe koymuş olur; test ortamı bunu uyarıyla bildirir. `í` (U+00ED) bu kümenin en hafifidir ve Latin-1 içinde, İspanyolca, Portekizce, İrlandaca ve İzlandaca klavye düzenlerinde ve standart mobil uzun basma menülerinde yer alır.

Temel harf ayrı bir sorudur ve §21.1’de karşılaştırılan sistemler buna dört farklı yanıt verir: ISO 9 ve Tınıstanov’un 1928 alfabesinde `j`, BGN/PCGN ve CTA’da `y`, Türkmencede `ý` [[20]](#ref20) ve ALA-LC’de işaretli bir `i`. `j` ve `y` tercihleri sesi bir Latin geleneğinde zaten /j/ taşıyan bir harfe eşler: Almanca ve Slav yazımından `j`, İngilizce ve Türkçeden `y`. Türkmence öğreticidir, çünkü bu yazım sisteminin başladığı yerden başlar: noktasız `ı` harfi yoktur, dolayısıyla `y` art düz ünlüyü [ɯ] taşır, yarı ünlü `ý` ile yazılır ve *ýyl* (yıl) sözcüğünde olduğu gibi tek bir hece ikisini birden taşıyabilir.

Temel harf olarak `y` yerine `i` lehine iki gerekçe vardır ve ikisi de kaynak yazı sisteminin Kiril olmasına dayanmaz. İlki, [j] sesinin [i] sesinin yarı ünlü karşılığı — kendi hecesi olmaksızın aynı boğumlanma — olmasıdır; çevriyazının onu hece kurmayan bir `i` olarak yazabilmesinin ve *ko-i-on* ile *ty-i-yn* dizilerinin yeterince hızlı söylendiğinde *koíon* ve *tyíyn* biçimlerine varmasının nedeni budur. Yarı ünlü, `o` ve `y` harflerinden sonra gelse bile nerede bulunursa bulunsun bu kimliği korur. [ɯ] sesinin yarı ünlü karşılığı [j] değil, Kırgızcanın hiç gereksinim duymadığı bir art damak sürtünmesizi olan [ɰ] sesidir; dolayısıyla `ý`, ses bilgisinin reddettiği bir akrabalık ileri sürerdi. Kiril de tesadüfen buna katılır; zira `й`, işaretli bir `и` harfidir ve aynı kökler içinde `и` ile nöbetleşir (*кий-*, *кийим*).

İkincisi, işaret kalktığında ne olduğudur. Hem yalın biçim hem arama katlaması ayırt edici işaretleri kaldırır; böylece `í` harfi `i` harfine düşerken `ý` harfi `y` harfine düşerdi. `í` altında *тыйын* ve *айыл* sözcükleri ASCII’ye `tyiyn` ve `aiyl` olarak ulaşır. `ý` altında ise `tyyyn` ve `ayyl` olarak gelirlerdi; yani 1. savın önlemek için ayrı bir yarı ünlü harfi getirdiği çökme arka kapıdan geri dönerdi. Sıralama üçüncü bir değerlendirme ekler: §17.1’deki sıralama ilkesi uyarınca işaretli bir `y`, nöbetleştiği harften uzakta, alfabenin sonunda öğretilir ve dizinlenirdi.

Tek gerçek çatışma vurgu gösterimiyledir. Öğretim materyalleri, sözlükler ve yabancı dil ders kitapları vurgulu heceleri akut ile işaretler (*a-tá*, *o-ro-mó*) ve `i` üzerinde bu işaret ile yarı ünlü aynı karakter olurdu. Çatışma ilk göründüğünden daha dardır: yalnızca vurgu /i/ üzerine düştüğünde ortaya çıkar, diğer her ünlüyü belirsizlik olmadan vurgu akutu almaya açık bırakır ve Kırgızca vurgusu büyük ölçüde öngörülebilir olup sözcük sonundadır; bu yüzden vurgu işaretlemek sıradan metnin bir özelliği değil, dar bir uzmanlık materyali grubunda istisnalar ve alıntılar için kullanılan bir araçtır. Sıklığa göre tartıldığında, yarı ünlü olağan metinde sürekli geçerken vurgu işareti geçmez. Çözüm, öğretime hiçbir harfle rekabet etmeyen bir araç vermektir: vurgulu heceyi kalın yazmak ya da önüne IPA vurgu işaretini koymak (*bi-ˈíik*) ki bunun tüm ünlü envanterinde aynı biçimde çalışma gibi ek bir üstünlüğü vardır. §23.6 bu uzlaşımı henüz yazılmamış bir çalışma olarak sıralar.

Kazakistan’ın 2018 alfabesi uyarıcı örnektir (§21.5) ve onun dersi akutların başarısız olduğu değildir: altı ya da yedi harfe serpilmiş bir akut görsel karmaşa olarak algılanırken tek bir sistematik kullanım böyle algılanmaz. `í`, tek bir işi olan tek bir harftir.

---

## 11. `ж` için `j`: Ötümlü Yarı Kapantılı

Yerli sözcük başı ve sözcük içi `ж`, `zh` yazımının ima ettiği Rusça aracılı sızıcı [ʒ] değil, İngilizce *journey* sözcüğündeki *j* sesi olan ötümlü art dişyuvasıl yarı kapantılı [dʒ] sesidir. Jany-Latyn **`j`** yazar: *jakşy*, *jaŋy*, *jol*, *jigit*.

Bu, Kırgızca için yeni bir tercih değildir. Kırgızistan hükûmetinin coğrafi adları Latin harfleriyle yazmak için benimsediği BGN/PCGN Latin harflerine aktarım sistemi de [[8]](#ref8) `ж` harfini `j` olarak yazar ve bunun sonucu Kırgız pasaportlarında ve uluslararası basında görünür: *Japarov*, *Jalal-Abad*. Buna karşılık `zh`, dildeki en yüksek sıklıklı ünsüzlerden birinde fazladan bir tuş vuruşuna mal olur ve uluslararası bir okura yanlış şeyi söyler.

Bu sese `c`, [ʒ] sesine ise `j` atayan CTA’dan ayrılma [[8]](#ref8) kasıtlıdır ve aşağıda gerekçelendirilmektedir.

**CTA’nın `c` kullandığı yerde `j`.** CTA’da, Türkçeyi izleyerek, `c` harfi [dʒ] ve `j` harfi alıntı sözcüklerin [ʒ] sesidir. Kırgız Kiril alfabesi her iki ses için tek bir `ж` yazdığından Jany-Latyn’in yerleştireceği iki değil tek bir harf vardır ve bunu `j` üzerine yerleştirir. Türkçe okuryazarlığı olmayan bir okur için `c` nötr bir simge değildir: Fransızca etkisi altındaki bir okura [s], İngilizce bilen bir okura [k] çağrıştırır. `j` harfi ise Türkçe üzerine eğitilmemiş neredeyse her Latin okuryazarı tarafından [dʒ] sesine yakın bir değerle okunur ve Kırgızcanın resmî Latin harflerine aktarımında `ж` için zaten kullanılan harftir. Türkçe olmayan klavyelerde diaspora yazımını ve uluslararası okunabilirliği hedefleyen bir sistem için `c` sahte bir dosttur.

Bu bölünme aynı zamanda §8’in sözlük bağımlılığını da taşır: CTA yerli *жазуу* sözcüğünü *cazuu* ve alıntı *журнал* sözcüğünü *jurnal* olarak yazar, oysa Kırgız Kiril alfabesi her ikisi için tek bir `ж` yazar. `q` ve `ğ` ile birlikte CTA uyumlu ayar, ünsüzlerinde üç noktada alıntı sözcük listesi gerektirir; buna karşılık tek `j`, `k` ve `g` hiçbir liste gerektirmez.

Bu yalnızca modern bir komisyondan değil, Kırgız Latin geleneğinden de bir kopuştur. Tınıstanov’un alfabesi `й` yarı ünlüsü için `j`, `ж` yarı kapantılısı için ise `c` (1938 gözden geçirmesinde `ƶ` ile değiştirilmiştir) kullanıyordu [[4]](#ref4); yani CTA ve Musayev’in kullandığı aynı atamayı. Bu yazım sistemi söz konusu kopuşu kabul eder: `ƶ` değiştirilmiş bir `z` gibi okunur, ki [dʒ] sesini `c` harfinden daha iyi göstermez ve zayıf yazı tipi kapsamına sahip nadir bir Latin Extended-B karakteri olmayı sürdürür.

---

## 12. `ö` ve `ü`: Ön Yuvarlak Ünlüler

### 12.1 `ү` için `ü` ve seçenekler

**`ү`** [y] için Jany-Latyn harfi **`ü / Ü`** biçimindedir; aynı ünlü için Türkçe, Azerbaycanca ve Türkmence kullanımıyla ve Kazakça `ү` için umlautlu ü harfini seçen 2021 Kazak Latin alfabesiyle örtüşür [[5]](#ref5). Uzunluk ayrıca çift yazımla ele alınır: *kün* (gün) sözcüğünde kısa `ü`, *küü* (ezgi) sözcüğünde uzun `üü`.

Seçenekler bağımsız değil, eşleştirilmiştir. Test ortamı ön yuvarlak ünlüler için dört yapılandırma sunar ve bunların üçü farklı gliflerle yürütülen aynı deneydir:

| Yapılandırma | `ө` | `ү` |
| :--- | :---: | :---: |
| Latin umlautları (Jany-Latyn) | `ö` | `ü` |
| Karma `ө` | `ө` | `ü` |
| Kiril `ұ` | `ө` | `ұ` |
| Makronlu `ū` | `ө` | `ū` |

Bu eşleştirme sonuçları okumak açısından önemlidir. `ü` harfinin her alternatifi Kiril `ө` ile birlikte gelir; dolayısıyla `ұ` veya `ū` seçmek yalnızca bir harfi diğeriyle değiş tokuş etmek değildir: aynı zamanda §12.2’de ortaya konan yazı sistemi karıştırma maliyetlerini de kabul etmektir. Maliyetler yan yana durmak yerine birbirini ağırlaştırır ve *körüü* karşısında *kөrūū* yazımı bu ağırlaşmanın sayfada nasıl göründüğüdür.

Makronlu `ū` denenmiş ve bir kenara bırakılmıştır. Letonca ve Maoricede makron ünlü *uzunluğunu* işaretler ve bir okurun ona getirmesi en olası değer uzunluktur. Kırgızcada fonemik uzunluk vardır; bu nedenle bir ünlü *niteliği* için `ū` kullanmak Kırgız bir okura hazır ve yanlış bir okuma sunar. Belirleyici olan ise içsel çakışmadır: bu sistemde uzunluk çift yazımla gösterilir, dolayısıyla `ū` harfinin uzun biçimi `ūū` olurdu ki bu da uzunluğun iki kez işaretlenmiş gibi okunmasına yol açar. Bu sav evrensel olmaktan çok Kırgızcaya özgüdür: 2021 Kazak alfabesi Kazakça `ұ` için makronlu ū kullanır [[5]](#ref5); orada işler çünkü Kazakça aynı uzunluk karşıtlığını taşımaz.

Kazakça `ұ`, yazı planlama tartışmalarında Kiril okuryazarları için bir köprü olarak Kiril’e yakın glifler gündeme geldiğinden geçiş dönemi görüntüleme seçeneği olarak korunmuştur. Beraberinde iki sorun getirir. Onu ayırt eden özellik dar yatay çizgisidir ve küçük boyutlarda ve agresif kenar yumuşatma altında ilk bozulan unsur yatay çizgilerdir; bu noktada glif, burada zaten kendi fonemik yükünü taşıyan Latin `y` harfine yaklaşır. Ayrıca ASCII `u` harfine temiz biçimde düşen `ü` harfinin aksine `ұ` harfinin hiçbir ASCII yedeği yoktur; dolayısıyla tam olarak yalın biçimin var olma nedeni olan ortamlarda başarısız olur.

### 12.2 `ө` için `ö` ve yazı sistemi karıştırmanın maliyeti

**`ө`** [œ] için Jany-Latyn harfi **`ö / Ö`** biçimindedir. Kiril `ө`, Jany-Latyn için bir aday olarak değil, geçiş dönemi ve eğitim materyalleri için bir görüntüleme kipi olarak test ortamında tutulmaktadır.

Yazar satır içi Kiril `ө` harfini tamamen okunaklı bulmaktadır; ona karşı gerekçenin okunaklılığa dayanamamasının nedeni budur. Aksi hâlde tamamen Latin olan bir metnin içinde tek bir Kiril harfini tutmak üç maliyet getirir ve bir okur glifi ne kadar okunaklı bulursa bulsun bu üçünün hepsi geçerlidir:

- **Glif ölçüleri.** Kiril kapsamı olmayan yazı tipleri yalnızca o tek glif için başka bir yazı yüzünü ikame eder; Kiril kapsamına sahip yazı tipleri ise Latin ve Kiril harflerini yine de ayrı tasarımlar olarak çizer, bu yüzden `ө` sıklıkla yanındaki küçük Latin harflerinden daha küçük bir x-yüksekliğinde oturur. Her iki durumda da sözcük, satırına uymayan bir harf taşır ve bu etki metnin geçtiği her yazı tipi yığınında değişir. Bu, üç maliyet içinde en az kurgusal olanı ve denetlenmesi en ucuz olanıdır (§23.4).
- **Harmanlama.** Unicode Harmanlama Algoritması altında Latin ve Kiril farklı ağırlık gruplarında sıralanır [[6]](#ref6); dolayısıyla karma dizeler saf Latin dizeler karşısında öngörülemez biçimde sıralanır. Bir ad listesini alfabetik sıralamak gereksiz yere yerel ayara bağımlı hâle gelir.
- **Belirteçleme (öngörülmüştür, ölçülmemiştir).** SentencePiece varsayılan olarak girdiyi Unicode yazı sistemi sınırlarından böler; dolayısıyla `kөl` tek bir parça yerine üç parçaya ayrılabilir [[7]](#ref7). Ön belirteçleyicisi yazı sisteminden bağımsız olarak tüm harfleri bir arada gruplayan bayt düzeyinde BPE belirteçleyicileri zorunlu olarak böyle davranmaz ve `ö` ile `ө` UTF-8’de ikişer bayt kaplar; dolayısıyla etki belirteçleyiciye bağlıdır. §23.1 bunun nasıl sınanacağını belirtir.

Standart `ö`, okurdan `ü` harfinin zaten istemediği hiçbir şeyi istemeden bu üç sorunun tamamından kaçınır.

---

## 13. `ç` ve `ş`: Islıklı Ünsüzler

Jany-Latyn ıslıklı ünsüzleri **`ç`** ve **`ş`** harfleridir: *çaí*, *şaar*. Kırgızca biçim bilgisi digraflarla çakışmalar ürettiği için digraflar değerlendirilmiş ve tam biçim için bir kenara bırakılmıştır.

`ш` ile biten bir gövdeye gelen `-чы/-чи` yapıcı eki gündelik örnektir: *баш* + *-чы* → *башчы* birleşimi digraflar altında sınırı bulanıklaştıran `bashchy` biçimini verirken, çengelli harflerle temiz `başçy` biçimini verir. Kişi adlarındaki `s`+`h` dizisi diğer örnektir: **Исхак** (Is-hak) digrafla `ishak` olarak çevriyazılır; oysa yerli sözcük *эшек* olsa da çoğu Kırgızca konuşurunun tanıdığı Rusça ve Özbekçe “eşek” sözcüğü olan *ишак* da aynı biçimde çıkardı. Çengelli harfler ikisini ayrı tutar: `işak` karşısında `ishak`.

Rusça `щ` harfi bir trigraf üretmek yerine **`ş`** harfinde birleşir (*ящик → íaşik*, *борщ → borş*). Konuşma Kırgızcası bunu [ʃ] olarak gerçekleştirir ve `şç` tersine dönüştürmede yerli `başçy` ile çakışırdı.

Digraflar bir kenara atılmaz; yeri değiştirilir. Tersine dönüştürücü, eski metinlerin ve gündelik yazımın doğru dönüşebilmesi için eski `ch`, `sh` ve `sch` biçimlerini kabul eder ve test ortamı karşılaştırma için tüm metinleri digraf kipinde görüntüleyebilir.

---

## 14. `ң` için `ŋ`: Art Damak Genizsili

**`ŋ / Ŋ`** (U+014B / U+014A) tekil [ŋ] fonemini işaretler ve onu gerçek bir `n`+`g` ünsüz kümesinden ayrı tutar: *күнгө* (*kün* gövdesi + yönelme eki *-gö*) `küngö` olarak kalırken, *жаңы* belirsiz `jangy` yerine `jaŋy` olur.

Eng harfi biçim sürekliliği nedeniyle seçilmiştir. Kiril `ң` (alt uzantılı en) ve Tınıstanov’un 1928 Latin `ꞑ` (alt uzantılı n) harflerinin her ikisi de [[4]](#ref4) `n` harfini taban çizgisinin altına taşır ve `ŋ` (eng) sağ bacağını aynı etkiyle aşağı kıvırır. Mevcut seçenekler arasında hem Kiril hem de 1928 Latin geleneklerinde sürekliliğe sahip olan tek harftir. CTA’nın `ñ` (tildeli n) harfi ise işaretini harfin üstüne koyar ve İspanyolcaya herhangi bir aşinalığı olan okurlar için belirli bir yanlış okuma, *piñata* ve *mañana* sözcüklerindeki [ɲ] sesini taşır.

`ŋ` harfinin gerçek maliyetleri de vardır:

- Mobil erişilebilirliği dengesizdir. ABD yerel ayarındaki Android klavyesinde `n` tuşuna uzun basarak ulaşılabilir; iOS ve ABD dışı yerel ayarlar denetlenmemiştir ve her yerde güvenilir biçimde bulunan seçenek `ñ` harfidir.
- Büyük `Ŋ` harfinin dolaşımda iki farklı tasarımı vardır: büyütülmüş bir küçük harf biçimi ve N tabanlı bir biçim; bu yüzden tamamı büyük harfli metinler yazı tipleri arasında tutarsız görünebilir.
- `ñ` harfinin bulunduğu Latin-1 ve Windows-1252 dışında kalır.

Türkmence bu sesi tilde yerine karonlu `ň` üzerinde karar kılmadan önce `ꞑ`, `ñ` ve `ng` ile yazdı [[20]](#ref20); Kazakistan 2021 içinde `Ŋ` harfinden `Ñ` harfine geçti ve Özbekçe taslağı `ng` digrafını korumaktadır [[9]](#ref9). Soru aile genelinde açıktır. Jany-Latyn türetme ve sahte dost gerekçeleriyle `ŋ` harfini korur ve mobil yazmaya daha fazla ağırlık veren herkes için test ortamında `ñ` harfini bir karşılaştırma ayarı olarak sunar. Klavye düzenleri (Ek D) masaüstünde `ŋ` harfini tek bir tuş vuruşuna indirger ve yalın biçim onu insanların zaten yazdığı gibi `n` olarak yazar (*jaŋy → jany*).

---

## 15. Ünlüler, Uzunluk ve `е`

Kırgızcada ön/art ve yuvarlak/düz uyumuna göre düzenlenmiş sekiz temel ünlü vardır:

| Yükseklik | Ön düz | Ön yuvarlak | Art düz | Art yuvarlak |
| :--- | :---: | :---: | :---: | :---: |
| **Yüksek** | **i** (и) | **ü** (ү) | **y** (ы) | **u** (у) |
| **Orta** | **e** (э, е) | **ö** (ө) | — | **o** (о) |
| **Alçak** | — | — | **a** (а) | — |

Bunların altısı kısa ve uzun karşıtlığı gösterir: `аа`, `ээ`, `оо`, `өө`, `уу`, `үү`. İki yüksek düz ünlünün, `ы` ve `и` harflerinin uzun karşılıkları yoktur [[4]](#ref4). Uzunluk her yerde çift yazımla gösterilir.

Latin harfleri bir karar gerektiren ünlüler §9 (`y`) ve §12 (`ö` ve `ü`), yarı ünlü ise §10’da tartışılmıştır; uzunluk ve `е` aşağıda ele alınmaktadır.

### 15.1 Fonemik uzunluk ve `е` sorunu

Uzunluk **çift yazımla** gösterilir: *ток* [tok] (tok) karşısında *тоок* (tavuk), *Ala-Too*, *aalam*, *jeek*, *kuu*, *küü*.

Alternatif, Letonca ve Maorice modelinde olduğu gibi tek bir ünlü üzerinde makron kullanmaktı; bu da *took* (тоок, “tavuk”) için *tōk* ve *Ala-Too* için *Ala-Tō* verirdi. İki gösterimden daha kısa olanı budur ve söz konusu yazım sistemlerinin bir okurunun bekleyeceği de budur. Çift yazım buna dört nedenle yeğlenir: birleştirici işaretler arama ve veri tabanı katmanlarınca tutarsız biçimde kaldırılır veya normalleştirilir; çift yazım ölü tuş ya da uzun basma gerektirmez, yalnızca aynı tuşa iki kez basmayı gerektirir; Kırgız Kiril alfabesi de Kırgız Arap yazım sistemi de [[4]](#ref4) uzunluğu zaten çift yazımla gösterir, dolayısıyla uzlaşım icat edilmek yerine devralınır; ve uzayan altı ünlüden ikisi zaten bir işaret taşır, bu nedenle uzun `öö` ve `üü` için üst üste binen `ȫ` ve `ǖ` gerekirdi ki bunlar Latin-1 dışındadır, yazı tipi kapsamları zayıftır ve ölü tuş olmadan yazılamazlar.

Bazen bir eskil özellik olarak tanımlanan Kırgızca uzun ünlüler, Türkmencenin koruduğu türden bir Ana Türkçe uzunluğundan çok, büyük ölçüde yitirilmiş ünlüler arası ünsüzlerden gelişen ikincil bir oluşumdur (*тоо*, art damak ünsüzlü daha eski bir biçimden gelir) [[26]](#ref26). Her iki durumda da karşıtlık modern Kırgızcada canlıdır ve yazım sisteminin gereksinim duyduğu tek şey budur.

Açıkça çözüme kavuşturulması gereken tek düzensizlik `е` harfidir. Kırgız Kiril alfabesi onu asla çift yazmaz; uzun /eː/ her konumda `ээ` olarak yazılır (*ээги*, *керээз*, *кээде*, *жээк*) ve Jany-Latyn bunu göründüğü gibi **`ee`** olarak aktarır (*eegi*, *kereez*, *keede*, *jeek*). Ancak `е` harfinin Rusça alıntı sözcüklerde ikinci bir görevi vardır; burada sözcük başında (*Европа*, *Енисей*) ve bir ünlüden sonra (*переезд*, *проект*) [je] sesini temsil eder. Jany-Latyn bunu zaten sahip olduğu yarı ünlü harfiyle ele alır: alıntı [je] sesi **`íe`** olur (*Íevropa*, *pereíezd*, *proíekt*), yerli sözcük başı [e] sesi **`e`** olarak kalır (*ene*, *el*) ve ünsüz sonrası [e] sesi **`e`** olarak kalır (*kel*, *mektep*). Kırgızca konuşmada iyotasyonlu olmayan bir alıntı sözcükteki ünlü sonrası `э` harfi, *поэт* ve *аэропорт* örneklerinde olduğu gibi yalın yazılır: *poet*, *aeroport*. Üç grafem (`e`, `ee` ve `íe`) her konumu kapsar. Bunların Kiril’e dönüşte ne yaptığı §18.1’de belirtilmiştir.

---

## 16. Alıntı İşaretleri `ъ` ve `ь` ile `я`, `ё`, `ю`

Sertleştirme ve yumuşatma işaretleri, Jany-Latyn’in zaten sahip olduğu yarı ünlüyle yakaladığı ünlü çatışmasını ve damaksıllaşmayı işaretler. İyotasyonlu bir ünlüden önce gelen ayırıcı bir işaret `í` içine kaynaştırılır (*объект → obíekt*, *семья → semía*, *разъезд → razíezd*). Kırgızca ses bilgisinin doğal konuşmada damaksıllaşma olarak gerçekleştirmediği hece sonu yumuşatma işareti düşürülür (*июль → iíul*, *апрель → aprel*, *роль → rol*). İyotasyonlu ünlüler tutarlı biçimde ayrıştırılır: **я → ía**, **ё → ío**, **ю → íu** (*saíakat*, *koíon*, *aíuu*); iyotasyonsuz ünlü çatışması ise yalın kalır (*диаграмма → diagramma*).

Sonuç, Jany-Latyn ile yazılan her sözcüğün içinde kesme işareti bulunmayan, `\p{L}+` desenine uyan kesintisiz bir alfabetik dize olmasıdır. Bu özelliğin somut sonuçları vardır: arama dizinleri ve basit belirteçleyiciler sözcüğü bir noktalama işaretinden kırmaz ve çift tıklama sözcüğün tamamını seçer [[10]](#ref10). `oʻ` ve `gʻ` harflerinde kesme işareti kullanan Özbekçe, işaret klavyenin ürettiği herhangi bir tırnak karakteriyle olağan biçimde değiştirildiği için alternatifin uygulamada neye mal olduğunun canlı bir göstergesini sunar.

Ancak bu özellik URL’leri ASCII-temiz **yapmaz**. `í`, `ŋ`, `ö`, `ü`, `ç` ve `ş` harflerinin hepsi ASCII dışıdır ve bir URL yolunda yüzde kodlamasına dönüşür (`ŋ` harfi `%C5%8B` olur). `\p{L}+` özelliğinin verdiği şey tek ve bölünmemiş bir belirteçtir; temiz URL kısa adları üreten ise yalın biçimdir (§19) ve kısa ad üretimi için doğru katman budur: *jaŋylyktar → janylyktar*.

---

## 17. Alfabetik Sıra

Bu bölüm bir okurun öğrendiği dizi olan Jany-Latyn alfabetik sırasını belirtir; §17.4 bunun sıralamada neleri değiştirdiğini gösterir ve Ek C yazılımların gereksinim duyduğu kuralları verir.

### 17.1 Sıralama ilkesi

Sıranın büyük bölümüne tek bir soru karar verir: değiştirilmiş bir harfin nereye gideceği. Kırgız Kiril alfabesi ile Latin harfli Türk dilleri yazım sistemleri buna aynı yanıtı verir: onu alfabenin sonuna değil, değiştirdiği harfin hemen ardına yerleştirir. Kırgız Kiril alfabesi `ң` harfini `н` harfinin, `ө` harfini `о` harfinin ve `ү` harfini `у` harfinin ardına koyar; Türkçe ve Azerbaycanca `ç` harfini `c` harfinin, `ş` harfini `s` harfinin, `ö` ve `ü` harflerini ise `o` ve `u` harflerinin ardına koyar. Jany-Latyn her ikisini de izler.

### 17.2 Jany-Latyn alfabesi (28 harf)

**A B Ç D E F G H I Í J K L M N Ŋ O Ö P R S Ş T U Ü V Y Z**

**a b ç d e f g h i í j k l m n ŋ o ö p r s ş t u ü v y z**

İlkenin üç sonucu bu dizide görünürdür. `Í` harfi `I` harfini izler; Kiril okuryazarı bir okurun zaten bildiği `и`/`й` komşuluğunu yansıtır. `Ŋ` harfi `N` harfini izler, tıpkı `ң` harfinin `н` harfini izlemesi gibi. `Y` harfi, Kiril’de `ы` harfinin düştüğü yer yerine harfin biçimine yönelik uluslararası beklentiyle uyumlu olarak sona yakın Latin konumunda yer alır.

Ortak Türk Alfabesi de aynı ilkeyi izler. 34 harfli sırası `Ğ` harfini `G` harfinin, `X` harfini `H` harfinin, `Ñ` harfini `N` harfinin, `Ö` harfini `O` harfinin, `Ū` ve `Ü` harflerini `U` harfinin, `Ə` harfini `E` harfinin ve `Q` harfini hemen `K` harfinin ardına yerleştirir [[17]](#ref17); yani her harfi sona ya da devralınmış Latin sırasına değil, eşleştiği harfin yanına koyar. Aşağıdaki `q` satırları da aynı nedenle `Q` harfini `K` harfinin ardına yerleştirir.

`C`, `Q`, `W` ve `X` alfabenin üyeleri değildir. Jany-Latyn bunları asla üretmez: `ч` harfi `ç`, `ц` harfi `ts` olur ve geri kalanlar diğer yapılandırmalara ya da yabancı yazılışlara aittir.

### 17.3 Alfabeler yan yana

| Yapılandırma | Harf sayısı | Alfabe |
| :--- | :---: | :--- |
| Jany-Latyn | 28 | Aa Bb Çç Dd Ee Ff Gg Hh Ii Íí Jj Kk Ll Mm Nn Ŋŋ Oo Öö Pp Rr Ss Şş Tt Uu Üü Vv Yy Zz |
| q+ğ (§8) | 30 | Aa Bb Çç Dd Ee Ff Gg Ğğ Hh Ii Íí Jj Kk Qq Ll Mm Nn Ŋŋ Oo Öö Pp Rr Ss Şş Tt Uu Üü Vv Yy Zz |
| q+ğ+ı | 30 | Aa Bb Çç Dd Ee Ff Gg Ğğ Hh Iı İi Jj Kk Qq Ll Mm Nn Ŋŋ Oo Öö Pp Rr Ss Şş Tt Uu Üü Vv Yy Zz |
| CTA uyumlu (q+ğ+ı+c+ñ) | 31 | Aa Bb Cc Çç Dd Ee Ff Gg Ğğ Hh Iı İi Jj Kk Qq Ll Mm Nn Ññ Oo Öö Pp Rr Ss Şş Tt Uu Üü Vv Yy Zz |
| Karşılaştırma için Ortak Türk Alfabesi | 34 | Aa Bb Cc Çç Dd Ee Əə Ff Gg Ğğ Hh Xx Iı İi Jj Kk Qq Ll Mm Nn Ññ Oo Öö Pp Rr Ss Şş Tt Uu Ūū Üü Vv Yy Zz |

Alfabeler büyük-küçük harf çiftleri hâlinde verilmiştir çünkü çiftler farklılık gösterir: son üç satırda `I` noktasız `ı` harfinin büyük biçimidir ve noktalı `i` ise `İ` alır.

q+ğ+ı satırında `ы` harfini `ı` olarak yazmak `y` harfini serbest bırakır ve yarı ünlü onu alır: §10’daki `í` gerekçesi `y` harfinin başka yerde kullanılmış olmasıdır ve burada kullanılmamıştır. `Y` sondaki olağan Latin yerine döner. `í` harfini de tutmak mümkündür ve test ortamı bunu sunar; ancak bunun maliyeti, yalnızca üzerlerindeki işaretlerle ayrılan üç harf olarak `I`, `İ` ve `Í` taşıyan bir alfabedir.

Son satır Bakü alfabesinin kendisidir [[17]](#ref17); böylece diğerleri onunla karşılaştırılarak okunabilir. Bir üstündeki satır ise §21.2’de verilen nedenlerle `Ə`, `Ū` ve `X` olmaksızın bir Kırgızca uyarlamasının kullanacağı alfabedir. İkisinde de `W` yoktur.

### 17.4 Sıralama: uyarlamanın değiştirdikleri

Alfabetik sıranın yazılıma bir *uyarlama* olarak verilmesi gerekir: Kırgızca hakkında hiçbir şey bilmeyen ve `ç` harfini `c` harfinin bir çeşidi olarak sıralayan varsayılan Unicode sıralama düzeninde [[6]](#ref6) yapılan kısa bir ayarlamalar listesi. Ek C bu listeyi verir; bu bölüm ise söz dizimine asla bakmayacak bir okur için bunun neleri değiştirdiğini gösterir.

| Jany-Latyn sırası | q+ğ+ı sırası | Ne değişti |
| :--- | :--- | :--- |
| bas, baş, bat | bas, baş, bat | değişmedi: her ikisinde de `ş`, `s` harfinden sonra |
| kene, keŋ, kep | kene, keŋ, kep | değişmedi: her ikisinde de `ŋ`, `n` harfinden sonra |
| kol, konok, köl, köp | kol, konok, köl, köp | değişmedi: her ikisinde de `ö`, `o` harfinden sonra |
| kul, kum, kül, küü | kul, kum, kül, küü | değişmedi: her ikisinde de `ü`, `u` harfinden sonra |
| kir, kyz | kız, kir | tersine döndü: `ı`, Türkçe tarzında `i` harfinden *önce* sıralanır; dolayısıyla yüksek art düz ünlüyü içeren her sözcük noktalı `i` içeren komşularının önüne geçer |

Bu satırlardan ikisi, okurların sıklıkla sezgiye aykırı bulduğu bir sonuç taşır. `ö` ve `ü` harfleri `o` ve `u` harflerinin aksanlı biçimleri değil de kendi başlarına ayrı harfler sayıldığı için, o konumda temel ünlüyü taşıyan *her* sözcük değiştirilmiş ünlüyü taşıyan *her* sözcükten önce sıralanır: *köl*, *kol* sözcüğünün yanında durmak yerine *konok* sözcüğünü izler. Kiril sırası da `о`/`ө` ve `у`/`ү` ile zaten bunu yapar; bu yüzden Kırgız bir okur bunu tanıdık bulurken bir arama geliştiricisi çoğu zaman bulmaz.

Son satır, bir sözlük veya dizin sürdüren herkes için q+ğ+ı ayarının pratik maliyetidir: bu tek bir harfin yeri değil, dilin en sık kullanılan ünlüsünü içeren her maddenin yer değiştirmesidir.

Latin yapılandırmalarını Kiril’e karşı değil kendi aralarında karşılaştıran tablonun dışında iki daha büyük hareket kalır. `ç` harfi `c` harfine çapa attığından, *Чычкан* Kiril alfabesinin yirmi sekizinci harfinden Latin alfabesinin üçüncü harfine taşınır; dolayısıyla bir ad dizini dönüştürmede kaymakla kalmaz, yeniden bölümlenir. İlk harfi çok karakterli bir grafeme dönüşen bir sözcük ise bütünüyle bölüm değiştirir: *Екатеринбург* adı `Íekaterinburg` olarak, diğer tüm `E` maddelerinden uzakta `Í` altında dizinlenir.

---

## 18. Kiril’e Geri Dönüştürme

Kiril→Latin dönüştürme deterministiktir ve kurala dayalıdır: her Jany-Latyn biçimi sözlük olmaksızın konumdan ve ünlü bağlamından hesaplanır. Latin→Kiril dönüştürme de deterministiktir ve yerli Kırgızca söz varlığını tam olarak geri yükler, ancak alıntı sözcükler için **kayıpsız değildir**. Kiril→Latin eşlemesi çoktan bire işleyen bir eşlemedir; çünkü yalnızca Rusça alıntı sözcüklerde var olan çeşitli Kiril ayrımları kasıtlı olarak birleştirilir ve birleştirilmiş bir ayrım geri kurtarılamaz.

§18.1 ve §18.2, yazım sistemini değerlendiren herkes içindir: dönüştürücünün alıntı sözcüklerle ne yaptığı ve neden yaptığı. Bir uygulamanın yeniden üretmek zorunda olduğu kurallar Ek A–C’de, alfabetik sıra ise §17’de belirtilmiştir.

### 18.1 Yerli öncelik kuralı

> **İki Kiril yazılışı aynı Latin dizesine eşlendiğinde, tersine dönüştürme yerli Kırgızca söz varlığında geçen biçimi geri yükler. Kaybedilmesine izin verilen ayrımlar yalnızca Rusça alıntı sözcüklerde var olanlardır.**

Bu tek kural her belirsiz duruma karar verir ve İlke 1’den doğar: otomatik dönüştürmede sağ çıkması gereken derlem Kırgızca derlemdir.

Tabloda hangi kayıpların göründüğü kısmen §23.6’nın açık bıraktığı bir soruya bağlıdır: alıntı sözcüklerin Rusça kaynaklarından mı yoksa Kırgızca sesletimden mi yazılacağı. *poet → поет* ve *aeroport → аеропорт* çiftleri mevcut yaklaşık uygulama altında kayıptır; kaynağa sadık bir uygulama altında ise olmazlardı.

| Latin | Geri dönüşümü | Neden | Ne kaybedilir |
| :--- | :---: | :--- | :--- |
| `ts` | **тс** | Yerli т+с sık ve üretkendir: *кетсе*, *айтса*, *өтсө* | alıntı `ц`: *tsirk → тсирк* |
| ünlü sonrası `íe` | **йе** | Kök bütünlüğü: *kií-* → *кийет*, *tií-* → *тийет* | alıntı ünlü sonrası `е`: *proíekt → пройект*; *-аев*, *-иев* ile biten soyadları: *Musaíev → Мусайев*; ve kabul görmüş yazım *тиешелүү* iken *тий-* kökünü koruyan *tiíeşelüü → тийешелүү* |
| sözcük başı `íe` | **е** | Hiçbir yerli sözcük йе ile başlamaz | — |
| `ío` | **ё** | Kırgızca yerli йо dizisini zaten `ё` ile yazar: *коён* | alıntı `йо`: *raíon → раён* |
| `ía` | **я** | Yerli Kırgızcada yalın `и`+`а` ünlü çatışması yoktur, dolayısıyla dizi her konumda belirsizliksizdir | alıntı `ья`: *semía → семя* |
| ünlü sonrası `i` | **й** | Tam biçim й sesini `í` yazar, ancak yalın biçim (§19) ve test ortamının `i` yarı ünlüsü onu `i` yazar; yerli ай, ой, үй dizileri ünlüden sonra и içeren alıntılardan çok daha fazladır: *bai → бай*, *tooi → тоой* | ünlüden sonra alıntı `и`: *ukrain → украйн*, *arhaizm → архайзм* |
| `ş` | **ш** | Yerli söz varlığı için 1:1 | alıntı `щ`: *borş → борш* |
| eski `sh` | **ш** | Yerli ш sıktır; yerli с+х geçmez | digraf kipinde *Ishak* adı |
| ünlü sonrası `e` | **е** | Yaklaştırma; Kırgızcada bu konumda yerli э yoktur | alıntı `э`: *poet → поет* |
| düşürülmüş `ь`, `ъ` | *(hiçbir şey)* | Geri kurtarılamaz | *aprel → апрел* |

Yalnızca `ts`, ünlü sonrası `íe` ve eski `sh` yerli metne dokunur; diğer satırlar yalnızca hangi alıntı sözcük yazılışının kaybedileceğine karar verir. En çok `ts` önemlidir; çünkü koşul kipi `т` ile biten her gövdede biçimbirim sınırına `т`+`с` yerleştirir, bu nedenle `ts` dizisini `ц` harfine geri göndermek açık bir yerli biçimler sınıfını bozardı.

### 18.2 İsteğe bağlı alıntı geri yükleme listesi

Alıntı sözcük yazılışlarını kaybetmek derlem çalışmaları için kabul edilebilir, ancak söz gelimi bir hukuk metnini dönüştürmek için kabul edilemez. Bu nedenle referans motor, kurala dayalı çekirdeğin üzerine katmanlanmış ve açılıp kapatılabilen küçük, açıkça belgelenmiş bir **alıntı geri yükleme listesi** sunar: Kiril biçimi kuralla türetilemeyen bilinen alıntı sözcükler (*semía → семья*, *statía → статья*, *Ishak → Исхак* ve benzerleri).

Bu liste bir arama tablosudur ve mimari için ileri sürülen iddia “hiçbir yerde sözlük yok” demekten daha dardır: çekirdek tek başına eksiksiz ve sözlüksüzdür ve liste yalnızca çekirdeğin zaten kayıplı olarak işaretlediği alıntı yazılışlarını geri yükler. Yerli söz varlığını asla etkilemez ve Kiril→Latin çıktısını asla değiştirmez.

Liste kendine özgü bir asimetri de getirir: *ishak* sözcüğünü *Исхак* olarak geri yükleyen bir kural dışı yol, digraf kipinde Rusça alıntı *ишак* sözcüğünü yanlış çıkarır. Bu ödünleşim kasıtlıdır, çünkü belgelerde geçen biçim özel addır.

Aynı kural listenin nerede durduğunu da belirler. *Асхат* adı `Ashat` olur ve *Ашат* olarak geri döner; hiçbir kayıt bunu onaramaz: digraf girdisinde `ashat` aynı zamanda yerli *ашат* sözcüğüdür ve §18.1 önce onu geri yükler. *Исхак* listeye alınabildi, çünkü yerinden ettiği *ишак* sözcüğü ödünçtür. Liste, rakibi alıntı olan bir adı tutabilir ama rakibi Kırgızca olan bir adı tutamaz; bu, istisna listelerinin bir maliyeti olduğu yönündeki genel uyarıdan daha sıkı bir sınırdır.

---

## 19. İki Kullanım Düzeyi: Tam Biçim ve Yalın Biçim

Jany-Latyn, yanına geçici bir çare iliştirilmiş tek bir yazı sistemi yerine iki kullanım düzeyini birlikte tanımlar.

**Tam biçim** — `ö`, `ü`, `í`, `ŋ`, `ç`, `ş` — eksiksiz biçimdir: basılı yayınlar, sözlükler, resmî metinler, test ortamının varsayılan çıktısı ve yazım sisteminin kendi adıyla sunulduğu her yer.

**Yalın biçim**, değiştirilmemiş klavyeler için ASCII’dir:

`ö → o`, `ü → u`, `í → i`, `ŋ → n`, `ç → c`, `ş → s`

Her harf ayırt edici işaretini yitirir ve başka hiçbir şey değişmez. *Çaí* sözcüğü `cai`, *şaar* sözcüğü `saar`, *jaŋy* sözcüğü `jany`, *biíik* sözcüğü `biiik` olur.

Bunun yerine `ç → ch` ve `ş → sh` eşlemesi yapmanın gerekçesi gerçektir: digraflar sesi bir okura daha iyi bildirir ve insanların bugün yazdığı da budur (*chai*, *jakshy*). Burada iki değerlendirme buna ağır basar. İlki tutarlılıktır: diğer her harf bir işaret yitiriyorsa ıslıklı ünsüzler de yitirmelidir; o zaman yalın biçim tam biçimle rekabet etmek yerine onun şeklini öğretir: `cai` yazan okur `çaí` biçiminden tek bir ayırt edici işaret uzaktayken, `chai` yazan okur farklı bir sözcük şekli yazmaktadır. İkincisi katlamadır: standart aksan kaldırma zaten `ç→c` ve `ş→s` eşlemesini yapar; dolayısıyla bu eşlemeyle yalın biçim katlanmış biçimin *kendisidir* ve arama katlaması neredeyse maliyetsizdir (Ek B). Digraflarla iki biçim farklı anahtarlara katlanır ve her dizin özel işlem gerektirir.

Digraflı yedek ikinci bir yazım üslubu değil, geçiş dönemine özgüdür; projenin kendi erken taslakları referans olarak `ch`/`sh` kullanmıştı. Gidiş yönü, `ç` harfini içselleştirmiş bir okurun *çöírö* sözcüğünü gündelik olarak *coiro* yazıp aynı sözcük olarak okuduğu işaret kaldırma eşlemesine doğrudur.

Bunun maliyeti bir birleşmedir. `ş` harfinin işaretini kaldırıp `s` yapmak onu yerli `s` ile birleştirir: *баш* ve *бас* ikisi de `bas`, *аш* ve *ас* ikisi de `as` olur. Digraflı yedek bu birleşmeden kaçınır, ancak `sh` ≈ с+х çakışmasını yeniden getirir ve sözcüğü uzatır. Bu gerçek bir ödünleşimdir; bu yüzden test ortamı **her iki** yedek biçimi de uygular ve bir okurun bunları gerçek metin üzerinde karşılaştırmasına olanak tanır. Bunu karara bağlamanın doğru yolu, her eşlemenin bir derlem boyunca kaç farklı sözcüğü birleştirdiğini saymaktır (§23.3).

Yalın biçimde birleşmeler zaten vardır ve her zaman olmuştur: `кол` (el) ve `көл` (göl) ikisi de `kol` olarak çıkar; `жаңы` (yeni) ve `жаны` (onun canı) ikisi de `jany` olur. Bu, Kırgızca konuşanların hâlihazırda mesajlaşma biçimiyle örtüşür ve gündelik yazının belirsizliği her zaman çözdüğü biçimde çözülür: bağlamdan, gerçek zamanlı olarak.

Yalın biçimin iki özelliği onun üzerine ne inşa edilebileceğini sınırlar:

- **Yalın biçim tek yönlüdür.** `biiik` mekanik olarak `biíik` biçimine, `cai` ise `çaí` veya `чай` biçimine geri yüklenemez. ASCII metin bir ara biçim değil, bir varış noktasıdır. Dönüştürme araçları onu en iyi çaba temelinde girdi olarak kabul etmeli ve gidiş-dönüş iddia etmemelidir.
- **Mevcut alışkanlığın bir betimlemesi değil, ondan bir ayrılıştır.** `ö→o`, `ü→u`, `í→i` ve `ŋ→n` insanların şimdi yazdıklarıyla örtüşür. `ç→c` ve `ş→s` örtüşmez; canlı biçimler *chai* ve *jakshy* biçimleridir. Bu eşleme alışkanlığı tam biçime doğru çekme girişimidir; bu normatif bir tercihtir ve betimleyici bir tercih olarak sunulmamalıdır.

---

## 20. Değerlendirme Aşamasındaki Harfler: `ä`, `x`, `w`

Kırgızca konuşmada işitilen ancak Kırgız Kiril alfabesinin yazmadığı üç ses farkı vardır. Latin alfabesinde üçü için de harf vardır ve yazmaları ucuzdur, ancak eşit derecede güçlü değildirler: `ä` harfinin kalıcı statü için bir gerekçesi vardır; aşağıda tartışıldığı üzere `x` ve `w` harflerinin yoktur. Test ortamı bunları varsayılan olarak kapalı bir değerlendirme kümesi olarak sunar.

| Çift | Ayrım | Nerede görülür |
| :--- | :--- | :--- |
| `a` / `ä` | art /ɑ/ karşısında ön /æ/ | Güney konuşması (*äkä*, *källä*); ayrıca Farsça alıntılar ve gerileyici benzeşme yoluyla standart Kırgızcada |
| `h` / `x` | gırtlak [h] karşısında art damak [x] | konuşura, bölgeye ve kaynağa göre farklı gerçekleşen alıntı sözcükler (*haram*, *halal*, *Buhara*) |
| `v` / `w` | diş-dudak [v] karşısında [w] | alıntı sözcükler ve /b/ foneminin ünlüler arası gerçekleşmesi |

Üçü de Kiril’den türetilebilir değildir. Kırgız Kiril alfabesi tek bir `а`, tek bir `х` ve tek bir `в` yazar; dolayısıyla dönüştürücü hangi sözcüklerin alıntı olduğunu bilmeden kaynak metinden `ä`, `x` veya `w` üretemez. Bu nedenle bunlar **yazım kipi harfleridir**: bir kişi doğrudan Latin harfleriyle yazarken kullanılabilir, otomatik dönüştürmeyle asla üretilmez. Tersine dönüştürücü bunları girdi olarak kabul eder ve her birini temel harfe geri katlar (`ä → а`, `x → х`, `w → в`); bu, §18.1’deki yerli öncelik kuralının yeni bir duruma uygulanmasıdır: ayrım Latin’de korunur ve dönüşte kaybedilir, tıpkı alıntı `ц` ve `щ` harflerinde olduğu gibi. Arama katlaması da bunları aynı biçimde birleştirir; böylece kaybolan ayrım bir dizini parçalamaz.

Sesbilimsel iş yapan `ä` harfidir. Diğer ikisi alıntı sözcüklerin yazımını inceltir. `ä` uyum sınıfını işaretler ve `q` kuralının okuduğu şey uyum sınıfıdır: *äkä*, *ükä* ve *källä* ön uyumludur ve art damak [k] alır; *aqa* ve *qalla* ise art uyumludur ve küçük dil [q] alır. `ä` olmadan kural bunları ayırt edemez; onunla birlikte kural gereksinim duyduğu bilgiye sahip olur. Deney doğrudan buradan çıkar: güney metinlerini `ä` olmaksızın ve onunla birlikte `q` kipinden geçirin ve ikinci yapılandırmanın daha doğru olup olmadığını ölçün.

`x` harfinin gerekçesi `w` kadar zayıftır, üstelik daha temel bir nedenle: yazacağı fark sözcükler arası bir karşıtlık değildir. Bir konuşurun *haram*, *halal* veya *Buhara* sözcüklerinde hangi sızıcıyı kullandığı sözcüğe değil kimin ve nerede konuştuğuna bağlıdır; dolayısıyla hiçbir Kırgızca sözcük çifti [h] karşısında [x] ile ayrılmaz. Bu sesleri taşıyan alıntı sözcükler Arapça, Farsça, Çağatayca ve Rusçadan farklı yollarla gelmiş ve Kırgızca her birini alırken kaynak ünsüzü yeniden şekillendirmiştir. Kimi zaman *mahalla* sözcüğünden gelen *маала* (ayrıca *маале*) örneğinde olduğu gibi düşürmüştür. Kimi zaman *muhabbat* sözcüğünden gelen *махабат* örneğinde olduğu gibi art damaksıl yapmıştır. Kimi zaman da *Ихтияр* karşısında *Ыктыяр*, *Исхак* karşısında *Ыскак* ve *Асхат* karşısında *Аскат* örneklerinde olduğu gibi `к` kapantılısına sertleştirmiştir. Bu sözcük ve adların çoğu birden fazla biçimde dolaşımdadır ve bir yazım kuralının bunlar arasında seçim yapma işi yoktur. Buna gerek de yoktur: bir sızıcının korunduğu yerde Jany-Latyn’in `h` harfi, tıpkı Kiril `х` harfinin seksen altı yıldır yaptığı gibi, konuşur nasıl söylerse söylesin onu yazar; `к` olduğu veya kaybolduğu yerde ise işaretlenecek hiçbir şey kalmamıştır.

`x` ayrıca diğer ikisinin taşımadığı bir maliyet taşır. Her türlü Latin metninde `x` harfinin zaten her yerde karşılaşılan uluslararası bir değeri vardır (*Linux*, *LAX*, *X Factor*, *taxi*) ve Kırgız bir okur bu dizelerle sürekli karşılaşır. Art damak sızıcısı için `x` benimsemek tek bir harfe hiçbir kuralın ayıramadığı iki okuma verir ve arama katlamasını da beraberinde sürükler. Dolayısıyla bu bölünme Kırgızca konuşanların sözcükleri ayırmak için kullanmadığı bir farkı işaretler ve uluslararası değeri korunmaya değer bir harfi harcar. Test ortamı `x` harfini soru hâlâ açık olduğu için değil, gerçek metin karşısında denenebilsin diye değerlendirme kümesinde tutar.

`w` aynı biçimde elenir; çünkü ünlüler arası [w] bir karşıtlıktan çok büyük ölçüde /b/ foneminin öngörülebilir gerçekleşmesidir ve İlke 3, tıpkı §8’de `k` harfini birleştiren akıl yürütme gibi, öngörülebilir alofonların harf almadığını söyler. `w` bir yer kazanırsa, ona bu yeri kazandıracak olan alıntı sözcükler olacaktır.

Bu kümeye eklenecek her şey için sınırlayıcı ilke şudur: ses konuşurları için sözcükleri ayırt etmeli, Kiril alfabesi onu temsil edememeli ve bağlamdan öngörülebilir olmamalıdır. `ä` üçünü de geçer ve kümenin en güçlüsüdür. `x` ilkinde kalır, çünkü [h] ve [x] sesleri sözcüğe göre değil konuşura ve bölgeye göre değişir. `w` ise üçüncüsünde kalır.

---

# Kısım III — Bağlam

Kırgızca (Кыргыз тили) için bir Latin yazım sistemi, ses bilimi, tipografik mühendislik ve gündelik dijital uygulamanın kesiştiği noktada durur ve bu soru varsayımsal değildir. Eylül 2024’te Bakü’de yapılan bir toplantıda, Türk Akademisi ve Türk Devletleri Teşkilatı (TDT) bünyesinde çalışan Türk Dünyası Ortak Alfabe Komisyonu, 34 harfli bir Ortak Türk Alfabesi (CTA) önerisi üzerinde uzlaştı [[1]](#ref1)[[2]](#ref2). Kırgızistan, Kiril’den ayrılma kararı almamış tek TDT üyesidir [[2]](#ref2) ve ülkeyi o görüşmelerde temsil eden Kırgız dil bilimci Sırtbay Musayev, Kırgızca için 28 harfli taslak bir Latin alfabesinin hazır olduğunu ve cumhurbaşkanı ile parlamentonun vereceği siyasi bir kararı beklediğini söylemiştir [[2]](#ref2)[[3]](#ref3). Cumhurbaşkanı Sadır Caparov’un beyan ettiği tutum ise geçişi tartışmak için henüz erken olduğu ve devlet dilinin gelişiminin Kiril alfabesiyle sürmesi gerektiği yönündedir [[3]](#ref3).

## 21. Jany-Latyn’in Mevcut Sistemlerle İlişkisi

### 21.1 Kırgızca için mevcut Latin aktarım sistemleri

Kırgızca için genel kabul görmüş bir Latin harflerine aktarım sistemi yoktur; coğrafi adlar için hükûmet BGN/PCGN sistemini benimsemiştir [[8]](#ref8). Dolaşımda dört sistem vardır ve Jany-Latyn bunların her biriyle farklı bir ilişki kurar.

| Kiril | BGN/PCGN | ALA-LC | ISO 9 | CTA | **Jany-Latyn** |
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
| ъ / ь | ˮ / ʼ | ʺ / ʹ | ʺ / ʹ | ʺ / ʹ | *(kaynaştırılır veya düşer)* |

(BGN/PCGN, ALA-LC, ISO 9 ve CTA sütunları [[8]](#ref8) kaynağından alınmıştır.)

**BGN/PCGN**, Kırgızistan’da resmî statüye sahip sistemdir ve Jany-Latyn onunla tanınabilirlik açısından en önemli harflerde — `ж` için `j` ve ön yuvarlak ünlüler için `ö`/`ü` — uyuşur. Bir yazım sisteminden çok yabancı okurlar için bir çevriyazıdır ve bu belli olur: hem `й` hem `ы` harfini `y` olarak yazar, dolayısıyla *тыйын* sözcüğü *tyyyn* olur ve `ch`, `sh`, `kh`, `ng` digrafları biçimbirim sınırlarında çakışır. Güçlü yanı `ö` ve `ü` dışında ek harf gerektirmemesidir; zayıf yanı ise hiçbir zaman Kırgızca konuşanlar tarafından yazılmak üzere tasarlanmamış olmasıdır.

**ALA-LC**, bir kütüphane kataloglama standardıdır ve birleştirici işaretlerle (`n͡g`, `u̇`, `ĭ`) geri dönüştürülebilirlik için eniyilenmiştir. `й` harfini `i` üzerinde bir işaret olan `ĭ` ile yazarak yarı ünlü konusunda Jany-Latyn’in sezgisini paylaşan tek sistemdir. Ancak birleştirici ayırt edici işaretleri tutarsız biçimde normalleşir ve sıradan bir klavyede yazılamaz.

**ISO 9**, dile özgü değil yazı sisteminden bağımsız olacak biçimde tasarlanmış mekanik bir Kiril-Latin eşlemesidir. `й` harfini `j`, `ж` harfini ise `ž` olarak yazar; bu, `ж` harfinin [dʒ] olduğu bir dil açısından tam anlamıyla tersinedir. Gidiş-dönüşte kusursuz çalışır ama kötü okunur; bu bir bibliyografik standart için makul bir ödünleşimdir, bir yazım sistemi için değil.

**CTA**, §21.2’de ele alınmaktadır.

Jany-Latyn’in bu dördünden farkları farklı bir amaçtan doğar. Bu sistemler Kırgızcayı başka bir dili okuyan insanlar için Latin alfabesine *aktarır*. Jany-Latyn ise ana dili Kırgızca olan okurlar tarafından sezgisel olarak okunmak üzere tasarlanmıştır.

### 21.2 Ortak Türk Alfabesi

Eylül 2024’te Bakü’de üzerinde uzlaşılan 34 harfli CTA [[1]](#ref1)[[2]](#ref2), her ülkenin onu ulusal düzeyde uyarlamasıyla birlikte Türk dilli coğrafya genelinde ortak bir temel çizgi olarak düşünülmüştür [[3]](#ref3). Jany-Latyn, Kırgızca ses bilgisinin desteklediği her yerde CTA’nın işlevsel çekirdeğini paylaşır (`ö`, `ü`, `ç` ve `ş` harflerinin tümü örtüşür). Altı harf farklıdır ve her biri Kısım II’de tartışılmıştır: `й` (§10), `ж` (§11), `ы` (§9), `к` ve `г` (§8) ile `ң` (§14).

**CTA’nın `y` kullandığı yerde `í`.** CTA, `ы` harfini noktasız `ı` harfine taşıdığı için `y` harfini yarı ünlüye ayırabilir; Jany-Latyn ise `y` harfini zaten `ы` için kullanmıştır (§10).

Jany-Latyn mevcut Kırgızca kullanımından yola çıkar ve CTA’nın sunduğu yakınsamanın büyük bölümünü alır. CTA’nın 34 harfinden üçünün Kırgızcada yapacak işi yoktur: `Ə` envanter dışındaki bir ünlüdür, `Ū` Kazakça `ұ` harfidir ve `х` harfinin `h` yazıldığı yerde `X` gereksizdir. Kalan 31 harften Jany-Latyn, aralarında `ç`, `ş`, `ö` ve `ü` harflerinin de bulunduğu 26 harfi alır (§17.3). Dördünü reddeder — sözlük bağımlılığı nedeniyle `c` (§11) ile `q` ve `ğ` (§8) harflerini, büyük-küçük harf dönüşümü ile küçük puntonun ona yaptıkları nedeniyle de `ı` harfini (§9) — ve CTA’da `ñ` bulunan yerde `ŋ` yazar (§14); `ы` harfini `y` olarak yazmak noktalı büyük `İ` harfine olan gereksinimi de ortadan kaldırır. `ñ` yerine `ŋ` ve Jany-Latyn’in sahip olup CTA’nın hiçbir biçimde içermediği tek harf olan `í` eklendiğinde alfabe 28 harfe ulaşır; bu fark bir eksiklik değil bir kararlar dizisidir. Kazakça tercihleri de aynı biçimde tartılmış ve `ū` veya `ұ` ile korunan bir Kiril `ө` yerine ortak `ü` ve `ö` seçilmiştir (§12.1). Reddedilen her harf test ortamında kalır; test ortamının CTA uyumlu hazır ayarı tüm 31 harfe ulaşmak için bunların hepsini alır, dolayısıyla kısmi ya da toptan benimseme bir çatallanma değil bir ayardır ve Jany-Latyn ile aynı metin üzerinde değerlendirilebilir.

Harflerin ötesinde, CTA’yı toptan benimsememenin gerekçesi yapısaldır. Kırgızcada Türkçede bulunmayan fonemik ünlü uzunluğu vardır; Türkçede `j` sızıcı iken Kırgızca `ж` bir yarı kapantılıdır; Kazakça, Kırgızcanın geçirmediği ıslıklı ünsüz değişimleri geçirmiştir. Kendi ses bilgisine göre ayarlanmış bir yazım sistemi, ses bilgisinin örtüştüğü yerlerde tüm Türk dillerini kapsayan bir standartla uyuşacak ve örtüşmediği yerlerde ondan ayrılacaktır; yukarıdaki örüntü budur. CTA’nın kendisi de bunu öngörür: Bakü’deki bir katılımcı, 34 harfin tamamına gereksinim duymayan bir dilin alfabeyi kendine uyarlayabileceğini belirtmiştir [[3]](#ref3).

Dilbilimsel olmayan bir maliyet de vardır: Türkçe, Azerbaycanca veya Özbekçeyle neredeyse özdeş bir yazım, makinelerin daha küçük bir dili ayırt etmek için kullandığı bir işareti ortadan kaldırır. §22 bunu yakınsama gerekçesiyle birlikte ele alır.

#### Her birinde aynı sözcükler

Buradaki hiçbir şeyin bir dönüştürücünün alıntı sözcükleri nasıl işlediğine bağlı olmaması için yalnızca yerli söz varlığı kullanılmıştır. `q` harfinin yazılıp yazılmayacağı bir alfabe sorusu değil, bir sözlük sorusudur.

| Kiril | Jany-Latyn | q+ğ | q+ğ+ı | CTA uyumlu (q+ğ+ı+c+ñ) |
| :--- | :--- | :--- | :--- | :--- |
| кыргыз | kyrgyz | qyrğyz | qırğız | qırğız |
| жазуу | jazuu | jazuu | jazuu | cazuu |
| айылдар | aíyldar | aíyldar | ayıldar | ayıldar |
| бийик | biíik | biíik | biyik | biyik |
| Жаңы | Jaŋy | Jaŋy | Jaŋı | Cañı |

Ve bir metin içinde:

> **Kiril.** Адамдардын бир-бири менен алмашкан каттары, эл аралык иммуногистохимия же башка техникалык журналдарда чыккан изилдөө макалалар, элге белгилүү болгон ырлар жана чыгармалар — баары бир алфавитте жазылат.
>
> **Jany-Latyn.** Adamdardyn bir-biri menen almaşkan kattary, el aralyk immunogistohimiía je başka tehnikalyk jurnaldarda çykkan izildöö makalalar, elge belgilüü bolgon yrlar jana çygarmalar — baary bir alfavitte jazylat.
>
> **q+ğ.** Adamdardyn bir-biri menen almaşqan qattary, el aralyq immunogistohimiía je başqa tehnikalyq jurnaldarda çyqqan izildöö maqalalar, elge belgilüü bolğon yrlar jana çyğarmalar — baary bir alfavitte jazylat.
>
> **q+ğ+ı.** Adamdardın bir-biri menen almaşqan qattarı, el aralıq immunogistohimiya je başqa tehnikalıq jurnaldarda çıqqan izildöö maqalalar, elge belgilüü bolğon ırlar jana çığarmalar — baarı bir alfavitte jazılat.
>
> **CTA uyumlu.** Adamdardın bir-biri menen almaşqan qattarı, el aralıq immunogistohimiya ce başqa tehnikalıq jurnaldarda çıqqan izildöö maqalalar, elge belgilüü bolğon ırlar cana çığarmalar — baarı bir alfavitte cazılat.

CTA uyumlu satır, bir sözlüğe sahip bir insanın yazacağı biçimde yazılmıştır: yerli `ж` için `c` (*ce*, *cana*, *cazılat*) ve alıntı `ж` için `j` (*jurnaldarda*), yerli art uyumlu `г` için `ğ` (*bolğon*, *çığarmalar*) kullanılırken alıntı sözcük yalın `g` harfini korur. Test ortamı satırın diğer her özelliğini yeniden üretir. Üretemediği şey, her `ж` harfini `c` yazıp *curnaldarda* sonucunu veren `c` kipindeki bir metinde *jurnaldarda* yazımıdır; bu açığı yalnızca hangi sözcüklerin Rusça alıntı olduğunu bilmek kapatır.

Bu parça zarif okunmaktan çok yapılandırmaları görünür biçimde farklılaştırmak üzere kurulmuştur ve içindeki iki sözcüğü satırlar boyunca izlemeye değer.

- *Техникалык* tek bir sözcüğün içinde `k` karşısında `q` harfini gösterir: `q` satırlarında *tehnikalyq* olur; yani yerli ekin küçük dil `q` harfinin yanında alıntı gövdenin art damak `k` harfi. En yakın ünlüyü okuyan bir kural burada, yerli *bolğon* karşısında *immunogistohimiía* sözcüğünün yalın `g` harfinde olduğu gibi, tesadüfen doğru sonucu verir; ancak hiçbir şey kurala *tehnika* sözcüğünün bir alıntı olduğunu söylemez ve aynı sezgisel kuralın *qosmos* ile *parq* üretmesinin nedeni de budur.
- *Immunogistohimiía*, sistemlerin dilin edinmeyi sürdürdüğü söz varlığıyla ne yaptığını gösterir: `х` için `h`, sondaki `я` için `ía`, çift ünsüzler bozulmadan ve hem okunaklılığın hem sıralamanın boyunca geçerli kalması gereken uzunlukta bir sözcük.

### 21.3 Musayev’in tarihî canlandırma önerisi

İ. Arabayev Kırgız Devlet Üniversitesi Dil Bilimi Enstitüsü müdürü ve 2024 Bakü görüşmelerinde Kırgızistan temsilcilerinden biri olan Sırtbay Musayev, Tınıstanov’un projesi üzerine kurulu 28 harfli bir Latin alfabesi önermekte ve bunun Kırgızcanın fonemik yapısını eksiksiz koruduğunu, dolayısıyla hiçbir dilbilimsel sorun doğurmadığını savunmaktadır [[3]](#ref3).

İki öneri ayrıştığından çok örtüşür. İkisi de `ö`, `ü`, `ç`, `ş` kullanır ve ikisi de `ы` için `y` kullanır [[3]](#ref3). Ayrışmalar onun bir canlandırma, bunun ise yeni bir tasarım olmasından kaynaklanır: onun alfabesi Tınıstanov’un alfabesindeki `k`/`q` bölünmesini geri getirir, Tınıstanov’u ve CTA’yı izleyerek `ж` harfini `c` yazar ve art damak genizsilini eng yerine `ņ` ile işaretler. İkisi de aynı nedenle aynı temel harfi işaretler, ancak aynı araçla değil: `ŋ` ve Tınıstanov’un `ꞑ` harfi harfin kendi çizgisini taban çizgisinin altına taşırken, `ņ` altına çengel eklenmiş bir `n` harfidir. Ayrıca ikisi arasında daha iyi yazı tipi ve IPA desteğine sahip olan `ŋ` harfidir.

Daha büyük sonuçlar doğuran fark dilbilimsel değildir. Musayev’in önerisi, bu projenin ne sahip olduğu ne de iddia ettiği, yasalaşmaya giden makul bir yola sahiptir. Jany-Latyn’in katkısı ters yönde işler. Bugün çalışan bir yazılım olarak vardır ve 1920’lerden kalma bir alfabenin yanıtlamak üzere hiç kurulmadığı sorunlara karşı geliştirilmiştir: deterministik Kiril gidiş-dönüş dönüştürmesi, belirteçleme, arama katlaması ve yalın bir ASCII biçimi. İki öneri aynı iş için rekabet etmemektedir.

### 21.4 Diğer yerel öneriler

Musayev’inki tek Kırgız Latin projesi değildir. Tarihçi Tınçtıkbek Çorotegin ve diğerlerinin katkısıyla geliştirilen ve qyrgyz.com adresinde yayımlanan 30 harfli bir alfabe de 1930’ların Latin alfabesinden başlar, ancak onun nadir harflerini modernleştirir: `Ƣ` yerine `Ğ` ve `Ь` yerine `Y` koyar, `Ꞑ`, `Ɵ` ve `Y` harflerini ise `Ñ`, `Ö` ve `Ü` biçiminde normalleştirir [[12]](#ref12).

Jany-Latyn bu öneriyle `ы` için `Y`, `Ö` ve `Ü` üzerinde uyuşur: üç ayrı projenin birbirinden bağımsız olarak yakınsadığı üç nokta. `Ğ` ve `Ñ` üzerinde ise her birinde farklı bir nedenle ayrışır. `Ğ`, Tınıstanov’un alfabesinde `Ƣ` bulunduğu için bir canlandırmada yaşar; İlke 1 altında yaşayamaz. `Ñ` konusunda karar daha zordur, çünkü iki proje de aynı harfi, Tınıstanov’un `Ꞑ` harfini modernleştirmekte ve onun yerini neyin alacağı konusunda ayrışmaktadır: `Ñ` işareti tilde olarak harfin üstüne taşırken, `Ŋ` aşağı inen çizgiyi korur. İki sonucu ayıran, her iki projenin de aynı biçimde okuduğu ses bilimi değil, başlangıç noktasıdır.

### 21.5 Kazakistan ve Özbekistan’ın gösterdikleri

Kazakistan eldeki en yararlı karşılaştırmadır, çünkü bir alfabenin kararname ile gündelik kullanım arasında başına ne geldiğini gösterir. 2017 kararnamesi yaygın biçimde alay konusu olan kesme işaretli bir alfabe getirdi; Şubat 2018’de ikinci bir kararname kesme işaretlerini akut aksanlarıyla değiştirdi [[13]](#ref13); akutlu sürüm de kısmen akutları ve koruduğu digraflar yüzünden eleştirildi [[14]](#ref14); 2021’deki bir sonraki gözden geçirme ise umlautlar, bir makron, bir breve ve bir çengel kullanan 31 harfte — `ä`, `ö`, `ü`, `ū`, `ğ`, `ş` — karar kıldı [[5]](#ref5). 2021’in kendi içinde bile art damak genizsili Ocak ile Nisan sürümleri arasında `Ŋ` harfinden `Ñ` harfine değişti [[9]](#ref9). Tamamlanma tarihi 2025’ten 2031’e ertelendi [[15]](#ref15). Özbekistan geçişine 1993’te başladı ve süreç hâlâ tamamlanmadı [[3]](#ref3); 2021 tarihli taslak gözden geçirme ise hâlâ `ng` digrafını korumaktadır [[9]](#ref9).

Bu belgeye üç ders taşınır. Yerleşmiş gibi görünen harf düzeyindeki kararlar yeniden açılır; bu da bir kararname yerine bir test ortamı yayımlamak lehine bir savdır. Ayırt edici işaret sistemleri kamuoyunda toplu hâlde nasıl göründüklerine göre yargılanır ve sesbilimsel mantık tartışmaya nadiren girer. Ve bir alfabeyi benimsemek ile o alfabeyle yazmak arasındaki mesafe on yıllarla ölçülür.

Kırgızistan’ın üçüncü dersin kendisine ait, çok daha yakın bir örneği vardır: 2004’te kabul edilen bir yazım reformu, halk onu benimsemeyince geri çekildi [[3]](#ref3).

---

## 22. Toplumdilbilimsel ve Siyasi Bağlam

### 22.1 Kiril’den ayrılmanın siyaseti

Kırgızca bir yüzyılda iki kez alfabe değiştirdi: 1928’de Arap alfabesinden Latin alfabesine ve 1940’ta Latin alfabesinden Kiril alfabesine. Bir sonraki değişiklik, eğer gelirse, akademik değil siyasi kökenlidir. Musayev’in özeti, alfabelerin ve yazım kurallarının Jogorku Kenesh kararıyla benimsendiği, cumhurbaşkanlığı kararnamesi gerektirdiği ve akademisyenlerin yalnızca önerebileceği yönündedir [[3]](#ref3). Nisan 2023’te, Devlet Dili Ulusal Komisyonu başkanı parlamentoya siyasi karar alınırsa akademisyenlerin ve halkın Latin alfabesine geçmeye hazır olduğunu söyledikten sonra, cumhurbaşkanı onu alenen azarladı ve tartışmanın zamansız olduğunu, devlet dilinin gelişiminin Kiril alfabesiyle sürmesi gerektiğini belirtti [[3]](#ref3). Günler sonra Rusya, Kırgızistan’dan süt ürünleri ithalatını askıya aldı [[18]](#ref18). Bu adım Kırgızca konuşanlara ne kadar kaçınılmaz görünürse görünsün, Moskova’dan uzaklaşma olarak okunur ve yanıt ticaret politikası biçiminde gelir.

### 22.2 Ortak bir Türk dilleri standardının daha küçük bir dile maliyeti

Moskova’nın bir Latin geçişini nasıl okuduğu kamuoyunda sürekli tartışılır; alternatifin maliyeti ise tartışılmaz. Ortak Türk Alfabesi’ni toptan benimsemek Kırgızcayı ailedeki en büyük yazılı standartla hizalar ve daha küçük dil, bu hizalanmanın bedelini sayfada onu komşularından ayıran ne varsa onunla öder.

Kiril bu farkı iki yoldan işaretler. Türkçe ve diğer Latin harfli Türk dilleri karşısında yazı sisteminin kendisi etikettir. Aynı yazı sistemini paylaşan Kazakça karşısında ise bunu harfler yapar: Kazakça `ә`, `і`, `қ`, `ғ`, `ұ` ve `һ` yazar, Kırgızca ise bunların hiçbirini ve Kazakçada olmayan hiçbir harfi yazmaz [[4]](#ref4)[[15]](#ref15); dolayısıyla Kırgızca yalnızca bulunmayanlarla işaretlenir. Ortak bir şablondan alınan bir Latin alfabesi, Latin harfli her komşu için ilk işareti kaldırır ve ikinci işareti her dilin kendine ait olarak koruduğu harflere bırakır.

Kaybın göründüğü yer kısa dizelerdir. Başlıklar, adlar, etiketler, üst veriler ve sorgular neredeyse hiç işaret taşımaz; bu yüzden bunları çözümleyen her sistem önsel olasılığa döner, önsel olasılık derlem boyutunu izler ve derlem boyutu da o dili yazan insan sayısını izler. Kırgızca, Türkçeden bir büyüklük mertebesi daha az ve Kazakçadan daha az konuşura sahiptir; dolayısıyla bu bölümün yaptığı her iki karşılaştırmada da daha küçük taraftır. Jany-Latyn *кылым* (yüzyıl) sözcüğünü başka hiçbir dile ait olmayan bir dize olan `kylym` olarak yazar; CTA uyumlu ayar ise bunu `qılım` olarak yazar ki bu Azerbaycancada *qılmaq* (yapmak) fiilinin bir çekimidir. Eylül 2026’da Google’da aratıldığında `qılım` o fiili döndürürken, Kiril *кылым* Kırgızca sözcüğü döndürmüştür. *жаным* sözcüğünü içeren bir şarkı adı da aynı yol ayrımıyla karşılaşır: `janym` Kırgızca iken `canım` Türkçedir.

Daha uzun metin, mesafeye bağlı bir payla daha güvenlidir. Türkçe karşısında hiçbir şey tehlikede değildir: alfabe ne olursa olsun bir Kırgızca paragraf tanınabilir kalır, çünkü söz varlığı ve biçim bilgisi yazımdan daha fazla ayrışır. Kazakça karşısında pay daha dardır, çünkü iki dil söz varlığının onları daha az güvenilir biçimde ayıracağı kadar yakındır ve ortak bir şablon altında bir metnin kendini belli etmeden önce daha uzun olması gerekir. Bu, akrabalığa dair bir yakınma değil, araçlara dair bir olgudur. Her iki durumda da etki kısa dizelerde ve otomatik etiketlemede yoğunlaşır; §23.2 bunun nasıl ölçüleceğini ve şimdilik neden yalnızca Türkçe karşılaştırmasının çalıştırılabileceğini ortaya koyar.

Kayıp, eğitim derlemlerinin oluşturulduğu yerde daha da ağırlaşır; çünkü bir web taramasının herhangi bir bölümü kullanılmadan önce dile göre ayrıştırılması gerekir ve bu ayrıştırmayı yapan sistemin elinde yalnızca metin vardır. Kiril harfli Kırgızca, Türkçeden bir bakışta ve Kazakçadan harfleriyle ayrılabilir; komşuları gibi biçimlenmiş Latin harfli Kırgızca ise onlardan biri olarak dosyalanır, zaten cılız olan bir derlemden eksiltilir ve daha büyük bir derleme gürültü olarak eklenir. Bulunması zor bir dil zahmetlidir; toplama noktasında yanlış etiketlenen bir dil ise birikmeyi durdurur.

Konuşma tanıma ve sentezleme de aynı havuzlardan beslenir ve işaretin en zayıf olduğu yerde hata şimdiden işitilebilirdir. Kazakça karşısında yalnızca kullanmadığı harflerle ayrılan Kiril harfli Kırgızca, bugün bile Kazakça sanılacak kadar zayıftır: Eylül 2026’da Kırgızca şarkı sözleri verildiğinde Suno V6-mini bunları yazara Kazakça değerleriyle — Kırgızca yarı kapantılı [dʒ] yerine sızıcı [ʒ] olarak `ж` ve bunun yanında `к` ile `г` harflerinin art damak ve küçük dil okumalarıyla — seslendirmiştir. Toplama aşamasında yanlış etiketlenen bir derlem, Kırgızcayı komşu bir dilin yaklaşık bir biçimi olarak işleyen bir asistan biçiminde geri döner ve bununla en erken karşılaşanlar, çevrelerindeki araçların doğru saydığı şeye bakarak okumayı öğrenen çocuklardır.

Latin alfabesine herhangi bir geçiş, Kiril’in bedava sağladığı bir işareti elden çıkarır ve Latin yazım sistemleri arasındaki tercih bunun ne kadarının ayakta kalacağına karar verir. Günümüzde kullanımda olan hiçbir Latin harfli Türk dili yazım sistemi `ŋ` yazmaz ve hiçbiri `í` yazmaz; dolayısıyla `cañı` ve `qılım` taşımazken `jaŋy` ve `kylym` kendi dil etiketini taşır. Bu özellik bir tasarım hedefi değildi. Yarı ünlü, art damak genizsili ve `ы` için başka gerekçelerle yapılan tercihlerden doğar; bu yüzden asla o tercihlerin bir nedeni olarak değil, sınanacak bir öngörü olarak sunulmaktadır.

### 22.3 Akraba diller, ortak harfler

Kırgızcanın Türkçeden ayrı olmak için bir geliştirmeye gereksinimi yoktur: ikisi ailenin farklı kollarında yer alır ve karşılıklı anlaşılır değildir (Kloss’un Abstand kavramı [[19]](#ref19)). Yazım tek başına bu mesafeyi kapatmaz. Kazakça her ölçütte daha yakındır — ailenin aynı kolu, ortak miras çekirdek, yüzyıllar süren temas — dolayısıyla yazıda ikisini ayıran şeyin daha azı dillerin kendisinden, daha çoğu ise alfabenin bir parçası olduğu ayrı standartlarından gelir. Orada tanıma payının daha dar olmasının nedeni budur. Her iki durumda da yazım sisteminin kaydetmekten vazgeçtiği bir ayrım, onu yerinde tutan dayanaklardan birini yitirir ve yeterince uzun bir sürede bu konuşmaya da ulaşabilir.

Kırgızca neredeyse bir yüzyıl boyunca baskın bir dille aynı yazı sistemini zaten paylaştı ve yararlı karşılaştırma, bu temasın ne yaptığı ile ne yapmadığıdır. Rusça normları Kırgız Kiril alfabesine yalnızca Rusça sözcüklerin girdiği yerde girdi ve orada durdu; `ц`, `щ`, `ъ`, `ь` ve iyotasyonlu `е` harflerinin Kırgızcada yalnızca alıntılara özgü harfler olmasının ve bir dönüştürücünün bunları kaybetmeyi göze alabilmesinin nedeni budur. Bu temas tek taraflı bir kayıp değildi: söz varlığını yoğun biçimde zenginleştirdi ve alıntı sözcüklerle gelen kurallar alıntı katmanında kaldı, çünkü Rusçanın yerli Kırgızcada kurallarının etki edebileceği kökteşleri yoktu.

Türkçe o konumda değildir. Kırgızca ile Türk dillerinin ortak miras söz varlığı çekirdeğini paylaşır [[26]](#ref26) ve CTA’nın öngördüğü uzlaşımlar onun uzlaşımlarıdır; dolayısıyla onunla paylaşılan bir yazılı standart doğrudan yerli sözcüklere uygulanan kurallar getirir — ve böyle bir standardın sunduğu yarar, yani aile içinde daha kolay ödünçleme ve daha geniş bir ortak teknik söz varlığı havuzu, bu riskle aynı kanaldan gelir. Bu kanalın yakın akraba diller arasında açık olduğu yerlerde örnekler tek yönde işler. 1933 Sovyet reformları Ukraynaca ve Belarusça yazımını Rusçaya yaklaştırdı ve Ukraynaca `ґ` harfini 1990’a kadar kaldırdı [[22]](#ref22)[[23]](#ref23). İspanyolca uzlaşımlarıyla yazılan Galiçyaca süregelen bir Kastilyalaşma tartışması taşır [[24]](#ref24) ve İngilizce yazımıyla yazılan İskoç Cermencesi yanlış yazılmış İngilizce gibi okunur [[25]](#ref25).

Gündelik mekanizma düzeltmedir. Daha büyük dil üzerinde eğitilmiş yazım denetleyicileri ve sorgu normalleştirmesi, daha küçük dili düzelterek o dile dönüştürür; Kırgızca üretmesi istenen bir model, yazım sisteminin davet ettiği her yerde boşluklarını Türkçe ile doldurur ve yazarlar, her gün okudukları bir dil karşısında hata gibi görünen sözcük biçimlerini o dile göre normalleştirir. Bunun öngördüğü kayma önce söz varlığında ve yazılı normda, konuşmada ise yalnızca yukarıdaki yoldan gerçekleşir.

Bunlar kesinlik değil eğilimdir. Baskın bir yazılı standardın ne kadar uzağa gideceği iki dil arasındaki akrabalıktan fazlasına bağlıdır: temasın ne kadar sürdüğüne, bu arada eğitimin, medyanın ve politikanın ne yaptığına ve her iki tarafın ne kadar metin ve araç getirdiğine. Bu belge bunların hiçbirini ölçmez. Yazım sistemi çeşitli güçlerden yalnızca biridir ve hiçbiri tek başına belirleyici değildir [[28]](#ref28).

### 22.4 Aşinalık ve benimsenme

Bir alfabe onu talep etmemiş insanlar tarafından benimsenir ve bu insanlar onun gerekçelerinden önce harfleriyle karşılaşır. Kazakistan, kamuoyunda nasıl göründüklerine göre yargılanan iki alfabeyi değiştirdi ve Kırgızistan okurlar benimsemeyince kendi 2004 reformunu geri aldı (§21.5). Yeni bir harfi tasarlamak ucuza, öğretmek ise çok pahalıya mal olur ve bu maliyet aynı anda her okurun sırtına biner.

Kırgız bir okurun zaten bildikleriyle ölçüldüğünde, çeşitli CTA harfleri yenidir: `ж` için `c`, noktalı `İ` ile birlikte noktasız `ı` ve 1940’tan beri kullanımda olan hiçbir Kırgızca yazıda karşılığı bulunmayan `ğ`. Bunların her biri bir Türkçe okuruna tanıdıktır; CTA’nın çevresinde kurulduğu aşinalık da budur.

Bununla ilk karşılaşılan yerler, hiçbir eğitim almamış okurların gördüğü tabelalar ve gündelik yazıdır; alışık olmadığı bir yazım sistemiyle karşılaşan bir okur, ayırt edici işaretlerden önce temel harfleri algılar ve onları zaten bildiği değerlerle okur. CTA uyumlu ayarda *жарыя* (duyuru) `CARIYA` olarak yazılır; `c` harfinin [dʒ] olduğunu öğrenmemiş bir okur bunu *кария* veya *сария* diye seslendirir; ikisi de tabeladaki sözcük değildir ve dizedeki hiçbir şey hatayı bildirmez. *Чыгуу* (çıkış) `ÇIĞUU` olur ve o okur bunu yalın biçimin doğrudan yazdığı yazım olan `CIGUU` olarak algılar. `C` ve `I` harflerinin Kiril değerleriyle okunduğunda, kamusal tabelalardaki en yaygın sözcüklerden biri müstehcen hâle gelir. Jany-Latyn’in `ÇYGUU` yazımı tek bir harfle, `ч` için `C` ile yanıltabilir; CTA yazımı buna ikinci bir harf, `ы` için `I` ekler.

Bu maliyetler geçicidir ve harfler öğretildiğinde sona erer; devlet destekli bir standardın verebileceği yanıt budur. Geçiş uzundur; her iki komşu devlette de on yıllarla ölçülmektedir. Bir yazım sistemi bu ara dönem boyunca yargılanır ve yazım sistemi geliştirme çalışmaları okur kabulünü kendi başına bir tasarım ölçütü olarak ele alır [[27]](#ref27).

Jany-Latyn bunun yerine Kırgız bir okurun zaten sahip olduğu iki tür aşinalıktan yararlanır. Biri okudukları Kiril alfabesidir: `й` işaretli bir `и` olduğu gibi `í` işaretli bir `i` harfidir, `ŋ` harfi `ң` harfinin aşağı inen çizgisini korur ve uzunluk Kiril’deki gibi çift yazılır. Diğeri ise zaten yazıp gördükleri Latin harfleridir: pasaport yazımı *Japarov* ve yer adı *Jalal-Abad* içindeki `j`, ülkenin İngilizce adındaki `y` ve insanların şimdi mesajlaşma biçimiyle örtüşen yalın biçim. Bu ikisi kuşaksal bir çizgi izler, çünkü Kiril’le eğitim görmüş okurlar ilkini, telefon klavyeleriyle büyümüş okurlar ise ikincisini bilir ve harfler her iki taraftan da tanınabilir olacak biçimde seçilmiştir.

İkisinin yollarının ayrıldığı yer `ŋ` harfidir. Onun aşinalığı klavyelerden çok biçimden, yani `ң` okuruna yakınlıktan gelir: `ŋ` bazı uzun basma menülerinde, `ñ` ise neredeyse hepsinde vardır. Test ortamında `ñ` harfinin bir karşılaştırma ayarı olarak sunulmasının nedeni budur (§14). Diğer her yerde, Kırgız bir okurun tahmin edeceği harf, yazım sisteminin yazdığı harftir.

### 22.5 Yakınsama gerekçesi ve benimsenen tutum

Yakınsama CTA’nın amacıdır ve hâlihazırda Latin alfabesiyle yazılan Türk dilleriyle karşılıklı okunabilirlik gerçek bir yarardır; burada bir Latin alfabesini değerlendirmeye değer kılan üç nedenden biridir. Diğer ikisi, neyle hizalanırsa hizalansın herhangi bir Latin yazım sistemiyle birlikte gelir: Latin uluslararası okurların zaten okuduğu yazı sistemidir ve klavyelerin, kodlamaların ve metin araçlarının çevresinde kurulduğu yazı sistemidir. CTA’ya uyumla satın alınan yalnızca ilkidir; bu da meseleyi Latin olup olmama değil, ne kadar uyum sağlanacağı sorusu hâline getirir.

Kazakça ile bu yarar yeni değildir. İkisi birbirinin Kiril alfabesini zaten okumaktadır ve ikisi de Ortak Türk Alfabesi üzerinde uzlaşılan Bakü görüşmelerine temsilci göndermiştir. Kazakistan o zamandan beri kendi Latin geçişini kararnameye ve takvime bağlamıştır (§21.5); Kırgızistan ise geçmeye karar vermemiştir. Bir geçişin karara bağladığı şey bu bağın ayakta kalıp kalmayacağıdır. İkisi de ortak bir Latin temeli üzerine kurarsa bağ korunur; biri geçer diğeri geçmezse yalnızca her iki yazı sistemini bilen okurlar yaşadığı sürece sürer; ikisi de geçer ama Kiril’dekinden daha fazla ayrışırsa incelir. Jany-Latyn, iki dili Kiril’de olduğu gibi Latin’de de birbirine okunabilir tutmayı amaçlar ve motoru ile test ortamı aynı değerlendirmeyi Kazakça için çalıştırmak üzere çatallanabilir. İkisinin birbirine ne kadar yaklaşacağı, miraslarını her iki yönde paylaşan kardeş diller arasındaki bir meseledir. Üçüncü bir dilden gelen uzlaşımlar ise ayrı bir sorudur. CTA’nın `c` ve `ı` harfleri Türkçe kullanımını izler ve varsayılan olarak değil, §22.3’teki dil kayması riski ve bu belgenin savları karşısında ayakta kalabildikleri yerde benimsenmeye değerdirler.

Standardın bazı bölümlerini reddetmek (§21.2) Kırgızcayı istisna yapmaz, çünkü hiçbir Türk dilli devlet onu bütün olarak benimsememiştir. Türkmence, bu yazım sisteminin `í` yazmasıyla aynı yapısal nedenle yarı ünlüyü `ý` olarak ve CTA’nın `ñ` koyduğu yerde art damak genizsilini `ň` olarak yazar [[20]](#ref20); Özbekistan’ın taslağı `ng` digrafını korur ve Kazakistan 2021 içinde kendi harflerini iki kez gözden geçirmiştir. Ortak bir Latin temeli hiçbir zaman üzerinde ortak işaretler gerektirmemiştir: aralarında Cermen, Roman, Slav, Baltık ve Ural dillerinin bulunduğu Avrupa’nın Latin harfli dilleri aynı yirmi altı harf üzerine kuruludur ve bunların üzerinde ortak hiçbir ayırt edici işaret kümesinde uzlaşmazlar; komşular arasında ayrışan yazım olağan durumdur [[21]](#ref21). En yakın emsal Kırgızcanın kendi deneyimindedir. Kırgız ve Kazak Kiril alfabeleri ortak bir temeli paylaşır, her biri kendine ait harfleri korur ve ikisi sayfada ayrı kalırken — Kazakça eklediği harflerle, Kırgızca ise bunların yokluğuyla — birbirine okunabilir kalır. Bir Latin geçişi için bir koşul olmasa da bu ilişki akılda tutulmaya değerdir.

Ortak Türk Alfabesi bu belgede savunulan her ayrımı karşılayabilir. Bedeli daha fazla harf, bakımı yapılan bir alıntı sözcük sözlüğü ile bunu yürütecek bir kurum ve hiçbir Kırgız okurun karşılaşmadığı biçimlerin öğretim maliyetidir. Devlet destekli bir standart ilk ikisini ödeyebilir. Üçüncüsü ise geri kalanını kim öderse ödesin okurların omuzlarına düşer. Jany-Latyn ilk ikisinden hiçbirine ve üçüncüsünden olabildiğince azına gereksinim duyacak biçimde kurulmuştur.

Bir dil zaten kullandığı biçimde yazılmaya değerdir ve bölgesel bir standart daha küçük dili ayırt edilebilir tuttuğu ölçüde katılmaya değerdir; çünkü yeterince ileri götürülen yakınsama daha okunabilir diller değil, daha az sayıda ayrı yazılı dil bırakır. Bunlar deneysel sonuçlar değil tutumlardır ve o sınırın nerede durduğunu ölçmek §23.2’deki testlerin işidir. Hiçbiri bir arılık savunusu değildir: gündelik Kırgızca söz varlığının büyük bir payı Rusça kökenlidir ve Kiril’den sonra ne gelirse gelsin kendi ödünçlemelerini getirecektir. Kaygı daha dardır: dili bulunması daha zor ve bir başkası olarak dosyalanması daha kolay kılabilecek bir değişiklik; ilk olarak en az görünür olduğu makine katmanlarında ortaya çıkan bir kayıp. Diğer yük ise açıkta, seçmedikleri bir alfabeyi ve uzlaşımları öğrenmeleri istenen okurların üzerine düşer ve bu yük başka harfler kadar burada savunulan harfler için de geçerlidir. Bu yüklerden herhangi birinin kabul edilmeye değer olup olmadığına ve bir geçişin hangi yöne gideceğine karar verecek olanlar Kırgızlardır.

### 22.6 Maliyetler ve kısıtlar

- **Maliyet ve kapasite.** Latinleştirmeye yönelik yinelenen yerel itiraz, bunun pahalı olduğu ve eğitimin daha acil gereksinimleri bulunduğudur. Bu itiraz ciddidir ve daha iyi harf tasarımıyla giderilemez.
- **Çok dilli bir devlet.** Kırgızistan tek dilli değildir. Rusçanın resmî statüsü vardır; Özbek, Dungan ve diğer topluluklar Kiril alfabesiyle yazmaktadır. Kırgızcanın Latin geçişi bu dilleri Latin alfabesine geçirmeyecektir; dolayısıyla Kırgızcaya ne olursa olsun Kiril gündelik kullanımda kalacaktır. Gerçekçi her plan bir ikame değil bir arada yaşama planıdır ki bu aynı zamanda iki yönde de çalışan bir dönüştürücü için bir gerekçedir.
- **Jeopolitik.** Bir yanda Moskova’nın tepkisi, diğer yanda ortak bir Türk dilleri standardının çekimi devlet düzeyindeki bir geçişe ağırlık bindirir. İkisi de yararlı olmak için hiçbir karara gereksinim duymayan bir aracı kısıtlamaz.
- **Kuşaksal asimetri.** Kiril’le eğitim görmüş okurlar ile telefon klavyeleriyle yetişmiş okurlar farklı harflerden başlar; iki kullanım düzeyi de bunun içindir: basılı yayınlar ve sınıf için tam biçim, telefon için yalın biçim.

---

# Kısım IV — Açık Sorular ve Yönetişim

## 23. Açık Sorular ve Gelecek Çalışmalar

Bunların bir kısmı test ortamının desteklemek üzere kurulduğu deneylerdir; geri kalanı ise henüz tamamlanmamış belirtim çalışmalarıdır. Her deney iddiayı, onu karara bağlayacak testi ve aleyhine kanıt sayılacak sonucu belirtir.

### 23.1 Belirteçleme

**İddia:** tek parça Latin kodlaması karma yazı sistemli metinden daha verimli ve Kiril ile karşılaştırılabilir ya da ondan daha iyi biçimde belirteçlenir.

**Test:** sabit bir derlem alın (Kırgızca Vikipedi veya temiz bir paralel küme için FLORES-200 `kir_Cyrl`), bunu Kiril, Jany-Latyn, CTA uyumlu ayar ve karma yazı sistemli bir yapılandırmada üretin ve çeşitli belirteçleyiciler altında sözcük başına belirteç sayısını ölçün.

**Bunu ne çürütür:** yaygın kullanılan modellerde Latin harfli Kırgızcanın Kiril’den *daha kötü* belirteçlenmesi. Bu makul bir olasılıktır, çünkü Kiril harfli Kırgızca eğitim verilerinde herhangi bir Latin harfli Kırgızcadan çok daha iyi temsil edilmektedir ve böyle bir bulgu çıkarsa bildirilmesi gerekir.

### 23.2 Dil tanıma ve erişim

**İddia:** Latin harfli Türk dilleri standartlarından yazımsal ayrışma Kırgızcayı makineler için tanınabilir tutar ve metin kısaldıkça bu etki büyür (§22.2).

**Kapsam:** §22.2’deki iki karşılaştırmadan yalnızca Türkçe, Azerbaycanca ve Özbekçe ile olanı şimdi sınanabilir, çünkü o diller bugün Latin alfabesiyle yazılmaktadır. Daha yakın durum olan Latin harfli Kazakça (§22.3) kararnamelerde ve örnek çizelgelerde mevcuttur ve geçişi 2031’de sona ermeden önce büyük hacimde yazılmayacaktır (§21.5). Kiril harfli bir Kazakça derlemi çevriyazmak dili değil çevriyazıcıyı sınar; bu yüzden Kazakça karşılaştırması bir sav olarak kalır ve ona yalnızca aşağıdaki üçüncü test ulaşır.

**Testler:** artan maliyet sırasıyla dört test.

1. *Çakışma sayımı.* Jany-Latyn ve CTA uyumlu ayar altında Türkçe, Azerbaycanca veya Özbekçe bir sözcük türüyle özdeş olan Kırgızca sözcük türlerini sayın. Yalnızca sözcük listeleri gerektirir ve mekanizmayı doğrudan ölçer.
2. *Dize uzunluğuna karşı tanıma.* fastText’in `lid.176` veya GlotLID gibi hazır bir dil tanıyıcıyı her iki yapılandırmadaki aynı Kırgızca metin üzerinde 1, 3, 5, 20 ve 100 belirteçlik uzunluklarda çalıştırın. Öngörü, yapılandırmaların paragraflarda uyuşacağı ve dizeler kısaldıkça ayrışacağıdır.
3. *Kara kutu gözlemi.* Her yapılandırmadaki aynı metni kullanımda olan sistemlere — bir web arama motoru, bir dil tanıyıcı, bir konuşma veya şarkı sentezleyici — verin ve her birinin hangi dilde yanıt verdiğini kaydedin. Bu, bu belgedeki en zayıf kanıttır: sistemler opaktır ve bildirim olmaksızın değişir; bu yüzden her gözlem tarihini ve sistemin açıkça sunduğu sürüm bilgisini taşır ve sistemin neden öyle yanıt verdiğine dair hiçbir şey söylemez. §22.2’deki Google araması ve Suno seslendirmesi bu türden gözlemlerdir.
4. *Üretken sızma.* Bir modele her yapılandırmada Kırgızca düzyazı ürettirin ve Kırgızca ile Kazakçanın ortak miras aldığı söz varlığını dışarıda bırakarak bin sözcük başına Türkçe ve Kazakça sözlüksel ögeleri sayın (§22.3).

**Bunu ne çürütür:** ihmal edilebilir bir çakışma oranı veya her iki yapılandırmada da tanımanın üç belirteçte ayakta kalması; bunlardan herhangi biri bulunursa bildirilmesi gerekir. Latin harfli Kazakça metin var oluncaya kadar Kazakça karşılaştırmasının bir çürütme koşulu yoktur.

### 23.3 Yalın biçim birleşmeleri

**İddia:** işaret kaldırmalı yedeğin birleştirdiği sözcükler (`baş` ile `bas`, `aş` ile `as`), tutarlılık ve katlama üstünlüklerinin onlara ağır basacağı kadar gerçek metinde azdır (§19).

**Test:** bir derlem boyunca her ASCII yedeğinin (`c/s` karşısında `ch/sh`) birleştirdiği farklı sözcük türlerini sayın ve her iki sayıyı sözcük sınıfına göre gidiş-dönüş kayıp oranıyla birlikte bildirin.

**Bunu ne çürütür:** işaret kaldırma eşlemesinin sözcük türlerinin kayda değer ölçüde daha büyük bir payını birleştirmesi ya da bağlamın ayırmadığı sık çiftleri birleştirmesi.

### 23.4 Görüntüleme

**İddia:** satır içi Kiril `ө`, yazı tipinin Kiril kapsamına sahip olup olmamasından bağımsız olarak çevresindeki Latin metinle görsel bakımdan tutarsızdır (§12.2).

**Test:** `kөl` ve `köl` sözcüklerini yaygın arayüz, web ve tırnaklı yazı tiplerinden oluşan bir matris üzerinde görüntüleyin ve sözcük ortasındaki glif için bitişik küçük Latin harfine göre x-yüksekliği oranını, çizgi kalınlığını ve herhangi bir taban çizgisi kaymasını kaydedin. Hangi yazı tiplerinin ikame yaptığını ve hangilerinin yalnızca uyumsuzluk gösterdiğini bildirin.

**Bunu ne çürütür:** yaygın kullanılan yazı tipi yığınları genelinde küçük Latin harflerinden en fazla yüzde birkaç sapan ölçüler ve ikamenin yalnızca Kiril’den gerçekten yoksun yazı tipleriyle sınırlı kalması.

### 23.5 Metin girişi

**İddia:** tam biçim, masaüstü düzeninde özel tuş eşlemiyle ve değiştirilmemiş bir telefon klavyesinde uzun basmalarla olağan hızda yazılabilir.

**Test:** standart bir düzende özel tuş eşlemiyle ve o olmadan, ayrıca değiştirilmemiş iOS ve Android klavyelerinde 1.000 karakter başına tuş vuruşu ve süre; §14’teki `ŋ` erişilebilirliğinin doğrulandığı tek yerel ayarın ötesinde denetleneceği yer de burasıdır.

**Bunu ne çürütür:** digraf yazımları karşısında süreklilik gösteren bir hız kaybı ya da yaygın bir telefon klavyesinde hiç ulaşılamayan harfler; bu durum gelecekteki bir sürüm için `ñ` harfini daha iyi bir harf hâline getirirdi (§14).

### 23.6 Henüz tamamlanmamış belirtim çalışmaları

- Metnin hangi sistemi kullandığını beyan edebilmesi için bir BCP 47 dil etiketi uzlaşımı (`ky-Latn`, olasılıkla kayıtlı bir çeşit alt etiketiyle).
- Eşlemeyi CLDR tabanlı her platformda kullanılabilir kılacak bir CLDR çevriyazı kural kümesi.
- Öğretim materyalleri ve sözlükler için akut olmaması gereken bir vurgu gösterimi uzlaşımı, çünkü akut yarı ünlüdür (§10).
- Harf düzeyinin ötesindeki yazım kuralları: hece bölme, kısaltmalar, Rusça kişi adları ve soyadlarının işlenmesi ve alıntı sözcüklerin Rusça kaynaklarından mı yoksa Kırgızca sesletimden mi yazılacağına ilişkin bir ilke.
- Temel kuralın ötesinde büyük harf kullanımı. Çok karakterli grafemler (`ía`, `ío`, `íu`, `ts` ve digraflı yedekler) kaynak sözcüğün büyük-küçük harf örüntüsünü alır; dolayısıyla ilk harf büyük düzeni `Ía`, tamamı büyük harf ise `ÍA` verir; bu kadarı karara bağlanmıştır. Kısa çizgili adlar da karara bağlanmıştır: kısa çizgiler arasındaki her parça kendi harf durumunu alır; böylece *Ысык-Көл → Ysyk-Köl* olurken *Кызыл-кыя → Kyzyl-kyía* kaynağın yazdığı küçük harfli ikinci parçayı korur. Geriye kalanlar daha dar ve büyük ölçüde biçemseldir: ek alan kısaltmalar ve baş harf kısaltmaları (*ЖОЖдо*) ile camel-case tanımlayıcılar.
- Arama katlamasının `q` harfini `k` harfine katlayıp katlamaması gerektiği (Ek B).
- Bir belgenin kendisini hangi motor sürümünün ürettiğini beyan edebilmesi için dönüştürülmüş metne yönelik makinece okunabilir bir sürüm işareti (§24).
- Her örneğin yönünü ve yapılandırmasını şu an dayandığı elle derlenmiş liste yerine bağlamından çıkaran bir belge uyumluluk denetimi.
- El yazısı ve öğretim: buradaki hiçbir unsur öğrencilerle sınanmamıştır ve çengeller ile akutlar el yazısında baskıdakinden farklı davranır.

---

## 24. Yönetişim

Bu, bir standart olarak değil bir öneri olarak yayımlanan yazım sisteminin 1. sürümüdür ve proje, anlaşmazlıkların bıkkınlıktan doğan çatallanmalar yerine değişiklikler üreteceği biçimde yapılandırılmıştır:

- Tartışmalı her tercih test ortamında bir seçenektir ve her alternatif kodda uygulanmıştır.
- Barındırılan test ortamı, okur onay istemini yanıtladıktan sonra okurun hangi yapılandırmayı seçtiğini kaydeder; böylece gerçek kullanımdaki tercih dağılımı savların yanında yayımlanabilir. Reddeden bir okur, çerezler veya cihazda saklanan herhangi bir tanımlayıcı olmadan sayılır. Kendi sunucusunda barındırılan veya sınıf içi bir kurulum hiçbir şey kaydetmez; ölçümleme yazılıma değil barındırılan örneğe aittir.
- Kaynak kodun tamamı üç lisans altında kamuya açıktır: dönüştürme motoru MIT lisanslıdır ve herhangi bir amaçla kullanılabilir; test ortamı uygulaması ticari olmayan bir lisans altında kaynak kodu erişilebilir olarak sunulur, dolayısıyla okunabilir, değiştirilebilir ve bir sınıfta kurulabilir ancak satılamaz; bu belge ve belirtim CC BY lisanslıdır. Sorunlar, uç durumlar ve derlem karşı örnekleri GitHub üzerinden kabul edilir ve herkes belirtimdeki eşleme kurallarını inceleyebilir, değişiklik önerebilir veya çatallayabilir.
- Sürümler numaralandırılır ve değişiklikler kayıt altına alınır. Bir belgenin kendisini hangi motor sürümünün ürettiğini beyan edebilmesi ve güvenle yeniden dönüştürülebilmesi için dönüştürülmüş metinle birlikte taşınan makinece okunabilir bir sürüm işareti doğal bir sonraki adımdır ancak henüz uygulanmamıştır; §23.6’da sıralanmaktadır.

Amaçlanan başarısızlık kipi benimsetme baskısı değil yanlışlanmadır. Motorun yerli Kırgızcayı bozduğu yinelenebilir bir örnek, bu proje için fikir birliğinden daha değerlidir.

---

## 25. Sonuç

Bu belgedeki her tercih diğerlerinin önünde tek bir kısıta yanıt verir: bir Jany-Latyn biçimi hâlihazırda var olan Kiril’den hesaplanabilir olmalıdır, yoksa yazım sistemi işe taşımak için var olduğu derlemi gözden çıkararak başlar. Bu kısıt içinde bir yazım sistemi, sesbilimsel sadakati, tipografik açıklığı ve yazma ergonomisini dengelediğinde başarılı olur. Bugün ayrıca arama motorları, belirteçleyiciler ve değiştirilmemiş klavyelerle temastan da sağ çıkmak zorundadır. Bu çalışmanın yargılanması gereken ölçütler bunlardır: çengellerin ve akutun Kırgızca bir metin satırı içinde satırı bozmadan durup durmadığı, `ŋ` harfinin okuma boyutunda `n` harfinden ayrı kalıp kalmadığı, ana dili konuşurunun herhangi bir belirsizlikle karşılaşıp karşılaşmadığı ve aynı metnin bir gidiş-dönüşten, bir dizinden ve bir telefon klavyesinden sağ çıkıp çıkmadığı. Bu sorular özenle seçilmiş bir örnek yerine gerçek bir düzyazı sayfası üzerinde daha iyi karara bağlanır; test ortamı da bunun içindir.

Tınıstanov’un Latin alfabesinden bir yüzyıl sonra aynı tarihî çizgi Musayev’in taslağından geçmektedir ve o taslak yakında gelmeyebilecek siyasi bir kararı beklemektedir [[3]](#ref3). Bu projenin o kararın gelmesine gereksinimi yoktur. Depoyu açan herkes için anında, Kırgızca konuşanların yıllardır Latin harfleriyle zaten yazdıkları koşullarda — gayriresmî, tutarsız ve sürekli — yararlı olacak biçimde kurulmuştur.

Dil bilimciler, mühendisler ve politika yapıcılar bu tercihleri güvenle kabullenmek yerine sınamaya davetlidir: test ortamını açın, `docs/SPEC.md` dosyasındaki eşleme kurallarını okuyun ve motorun yanlış işlediği her durum için bir sorun kaydı açın.

*Zamanbap, erkin jana tabigyí jazuu egemen elibizge sanariptik doorunda kyzmat kylsyn.*
*(Modern, açık ve doğal bir yazım sistemi dijital çağda bağımsız halkımıza hizmet etsin.)*

---

# Kaynakça

<a id="ref1"></a>[1] “Adoption of Latin-Based Common Turkic Alphabet.” *The Times of Central Asia*, 12 Eylül 2024. https://timesca.com/adoption-of-latin-based-common-turkic-alphabet/

<a id="ref2"></a>[2] “Turkic States Agree On Common Latin Alphabet, But Kyrgyzstan Happy With Its Cyrillic Script.” RFE/RL, 3 Ekim 2024. https://www.rferl.org/a/common-turkic-alphabet-kyrgyz-kazakh-uzbek-turkmen-latin-cyrillic/33137392.html

<a id="ref3"></a>[3] Жангазиев, Максат. “Нужен ли тюркоязычным странам общий алфавит?” Азаттык Азия (RFE/RL), 25 Eylül 2024. https://www.azattyqasia.org/a/33134603.html — Musayev’in önerdiği alfabe çizelgesinin bir kopyasını içerir. Kırgızca özgün metin: https://www.azattyk.org/a/33125096.html

<a id="ref4"></a>[4] “Kyrgyz alphabets.” Wikipedia. https://en.wikipedia.org/wiki/Kyrgyz_alphabets — 1928–1938/1940 Latin alfabesi karşılık tablosu ve ünlü uzunluğu envanteri için. Orada atıf yapılan birincil kaynak: Сумарокова, О.Л. (2021), *Кыргызский алфавит: долгий путь к кириллице*, KRSU.

<a id="ref5"></a>[5] “New version of Latin-based Kazakh alphabet presented at government.” Kazinform, 2021. https://www.inform.kz/en/new-version-of-latin-based-kazakh-alphabet-presented-at-government_a3746549

<a id="ref6"></a>[6] Unicode Technical Standard #10: Unicode Collation Algorithm. https://www.unicode.org/reports/tr10/

<a id="ref7"></a>[7] Kudo, T. & Richardson, J. (2018). “SentencePiece: A simple and language independent subword tokenizer and detokenizer for Neural Text Processing.” EMNLP 2018 (sistem gösterimleri).

<a id="ref8"></a>[8] “Romanization of Kyrgyz.” Wikipedia. https://en.wikipedia.org/wiki/Romanization_of_Kyrgyz — ALA-LC, BGN/PCGN, ISO 9 ve Ortak Türk Alfabesi sistemlerinin karşılaştırmalı tablosu ve coğrafi adlar için BGN/PCGN’nin hükûmetçe benimsenmesi. Orada atıf yapılan birincil kaynaklar: BGN romanization of Kyrgyz (US Board on Geographic Names, 2017); UNGEGN raporu, 2016; ISO 9:1995.

<a id="ref9"></a>[9] “What will be the Kyrgyz Latin alphabet.” qyrgyz.com. https://qyrgyz.com/post/path-of-kyrgyz-latin-script — Kazakçada Ocak–Nisan 2021 arasındaki Ŋ’den Ñ’ye geçiş ve 2021 Özbekçe taslağı için.

<a id="ref10"></a>[10] Unicode Standard Annex #29: Unicode Text Segmentation. https://www.unicode.org/reports/tr29/

<a id="ref11"></a>[11] Unicode Character Database, `SpecialCasing.txt` (Türk dilleri `i`/`ı` büyük-küçük harf eşlemeleri). https://www.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt

<a id="ref12"></a>[12] “Кыргызская латиница / Кыргыз тилинин латын алфавити.” qyrgyz.com. https://www.qyrgyz.com/kyrgyzskaya-latinitsa

<a id="ref13"></a>[13] “Kazakhstan Changes Its Alphabet. Again!” Eurasianet, 20 Şubat 2018. https://eurasianet.org/kazakhstan-changes-its-alphabet-again

<a id="ref14"></a>[14] Bazarbayeva, Z.M. & Chukayeva, T.K. (2021). “The new Kazakh latinized script.” *Bulletin of L.N. Gumilyov Eurasian National University, Philology Series* 3(136). https://bulphil.enu.kz/index.php/main/article/download/291/143/419

<a id="ref15"></a>[15] “Kazakh alphabets.” Wikipedia. https://en.wikipedia.org/wiki/Kazakh_alphabets — 2017 kararnamesi ve tamamlanma tarihinin 2021’de 2031’e ertelenmesi.

<a id="ref16"></a>[16] Unicode Standard Annex #15: Unicode Normalization Forms. https://www.unicode.org/reports/tr15/

<a id="ref17"></a>[17] “Declaration on the Common Turkic Alphabet.” Turkic Academy. https://www.turkicacademy.org/en/smi/declaration-common-turkic-alphabet — Bakü’de üzerinde uzlaşılan 34 harfli sıra için. Ayrıca bkz. “Common Turkic Alphabet”, Wikipedia: https://en.wikipedia.org/wiki/Common_Turkic_alphabet

<a id="ref18"></a>[18] “Russia Suspends Dairy Products From Kyrgyzstan After Calls In Bishkek To Drop Cyrillic Script.” RFE/RL’s Kyrgyz Service, 21 Nisan 2023. https://www.rferl.org/a/russia-kyrgyzstan-dairy-products-banned-cyrillic-latin/32373802.html

<a id="ref19"></a>[19] Kloss, H. (1967). “‘Abstand Languages’ and ‘Ausbau Languages’.” *Anthropological Linguistics* 9(7), 29–41.

<a id="ref20"></a>[20] “Turkmen alphabet.” Wikipedia. https://en.wikipedia.org/wiki/Turkmen_alphabet — güncel Latin harfleri `ý` [j] ve `ň` [ŋ] ile art damak genizsilinin daha önceki `ꞑ`, `ñ` ve `ng` yazılışları için.

<a id="ref21"></a>[21] Sebba, M. (2007). *Spelling and Society: The Culture and Politics of Orthography Around the World*. Cambridge University Press — yazım sistemini yalnızca dilbilimsel değil toplumsal bir nesne olarak ele alan standart başvuru kaynağı.

<a id="ref22"></a>[22] Goletiani, Liana (2017). “The Letter that was Missing. On the Return of the Letter Ґ to the Ukrainian Legal Language.” *Studi Slavistici* 14(1). https://doi.org/10.13128/Studi_Slavis-21938

<a id="ref23"></a>[23] Kiyosawa, Shiori (2021). “Divergence and Conflict between the Two Norms of the Modern Belarusian Literary Language” [Japonca, İngilizce özetli]. *Slavic Studies* 68: 1–43. Slavic-Eurasian Research Center, Hokkaido University. http://hdl.handle.net/2115/84289

<a id="ref24"></a>[24] Ramallo, Fernando (2015). “The Standardization of Galician.” *Sociolinguistica* 29(1). https://doi.org/10.1515/soci-2015-0006

<a id="ref25"></a>[25] Bann, Jennifer & Corbett, John (2015). *Spelling Scots*. Edinburgh University Press. https://doi.org/10.3366/edinburgh/9780748643059.001.0001

<a id="ref26"></a>[26] Johanson, L. & Csató, É.Á. (ed.) (2021). *The Turkic Languages*, 2. baskı. Routledge. https://doi.org/10.4324/9781003243809 — ortak miras söz varlığı ve Kırgızca uzun ünlülerin kökeni dâhil karşılaştırmalı Türk dilleri görünümü için.

<a id="ref27"></a>[27] Cahill, M. & Rice, K. (ed.) (2014). *Developing Orthographies for Unwritten Languages*. SIL International — fonemik uyumun yanında okurlar tarafından kabul edilebilirliğin yazım sistemi tasarımında bir ölçüt olması üzerine.

<a id="ref28"></a>[28] UNESCO Ad Hoc Expert Group on Endangered Languages (2003). *Language Vitality and Endangerment*. UNESCO Tehlike Altındaki Dillerin Korunması Programı Uluslararası Uzmanlar Toplantısı’na sunulan belge, Paris, 10–12 Mart 2003. https://ich.unesco.org/doc/src/00120-EN.pdf — belgenin bir sıralama olarak değil birlikte kullanılacak ilkeler olarak sunduğu dokuz değerlendirme etmeni ve bir yazım sisteminin yalnızca yerleşik, pratik ya da yok olarak yer aldığı 6. Etmen ölçeği (“Materials for Language Education and Literacy”).

## İleri okuma

Bunlara yukarıda atıf yapılmamıştır ancak burada ileri sürülen savlarla doğrudan ilgilidirler ve bu çalışmayı genişletmek isteyen herkese önerilirler.

- Kara, D.S. *Kyrgyz*. Lincom Europa, 2003.
- Unseth, P. (2005). “Sociolinguistic parallels between choosing scripts and languages.” *Written Language & Literacy* 8(1).
- Venezky, R. (2004). “In search of the perfect orthography.” *Written Language & Literacy* 7(2).
- Fierman, W. (2009). “Identity, symbolism, and the politics of language in Central Asia.” *Europe-Asia Studies* 61(7).
- “Prospects of Kyrgyz language transition to the Latin script based on experience of Kazakhstan and Uzbekistan.” *Language Problems and Language Planning* (2025). https://www.jbe-platform.com/content/journals/10.1075/lplp.25003.tok
- Petrov, A. et al. (2023). “Language Model Tokenizers Introduce Unfairness Between Languages.” NeurIPS 2023.
- Kargaran, A.H., Imani, A., Yvon, F. & Schütze, H. (2023). “GlotLID: Language Identification for Low-Resource Languages.” Findings of EMNLP 2023 — §23.2’de adı geçen, Kırgızcanın konumundaki diller için geliştirilmiş dil tanıyıcı.
- Washington, J.N., Salimzyanov, I. & Tyers, F.M. (2014). “Finite-state morphological transducers for three Kypchak languages.” LREC 2014 — bu yazım sistemi üzerine biçimbilgisel araçlar inşa etmekle ilgilidir.

---

# Ekler

## Ek A. `e` Sistemi

`э`/`е`/yarı ünlü sistemi, yazım sisteminin en az sezgisel bölümüdür; bu nedenle algoritma eksiksiz olarak verilmektedir:

1. **İleri.** İyotasyonlu bir alıntıda sözcük başı veya ünlü sonrası `е` → `íe`. Çift `ээ` → `ee`. Sözcük başı `э` → `e`. Ünsüz sonrası `е` → `e`. İyotasyonsuz bir alıntıda ünlü sonrası `э` → `e`.
2. **Ters.** `ee` → `ээ`. Sözcük başı `e` → `э`. Ünsüz sonrası `e` → `е`. Ünlü sonrası `e` → `е`. `íe` için §18.1’deki tabloya bakınız.
3. **Yarı ünlü.** Yukarıda çözümlenen diziler dışında her yerde `í` → `й`. Eski `iy`/`iyi` girdisi (*biyik*), Jany-Latyn çıktısı olmamakla birlikte tersine dönüştürmede kabul edilir.
4. **İyotasyon.** `ía → я`, `ío → ё`, `íu → ю`; yarı ünlüsüz ünlü çatışması yalın kalır (*diagramma → диаграмма*).

SPEC.md aynı kuralları 2. bölümünde (4. kural) ve 4.3. bölümünde belirtir.

---

## Ek B. Normalleştirme, Katlama ve Harmanlama

Bir yazım sistemi önerisinin genellikle dışarıda bıraktığı, ancak bu sistemi uygulayan herkesin ilk öğleden sonra karşılaştığı hesaplamalı gereksinimler:

- **Normalleştirme.** Dönüştürücünün çıktısı **Normalleştirme Biçimi C (NFC)** biçimindedir [[16]](#ref16); bu, birleşik bir kod noktasının var olduğu her yerde bir harfi ve işaretini tek bir kod noktası olarak yazan Unicode biçimidir. `í`, `ö` ve `ü` harflerinin hepsinin böyle kod noktaları vardır ve harf artı işaret biçiminde ayrık gelen girdiler girişte normalleştirilmelidir. `ŋ` harfinin hiç ayrışımı yoktur; bu da bir sonraki nokta açısından önemlidir.
- **Arama katlaması.** Tek bir `foldKey()`, her iki biçimi de tek bir dizin anahtarına eşler: `ö→o`, `ü→u`, `í→i`, `ç→c`, `ş→s`, `ŋ→n` ve ardından büyük-küçük harfe duyarsız eşleştirmenin ardındaki Unicode işlemi olan harf durumu katlaması. Altı tam biçim harfinden beşi için standart aksan kaldırma zaten bunu yapar; çünkü `ç`, `ş`, `ö`, `ü` ve `í` harfleri, NFC’nin ayrıştırılmış karşılığı olan Normalleştirme Biçimi D (NFD) altında bir temel harf artı bir işarete ayrılır; `ä` harfi de aynı biçimde `a` harfine katlanır. Tam biçim harfleri arasında istisna `ŋ` harfidir ve açıkça ele alınmalıdır, çünkü hiçbir Unicode normalleştirmesi onu `n` harfine katlamaz. `ı→i` de, onu kullanan yapılandırmalar için böyledir; `ñ→n` kendi kuralını gerektirmez, çünkü `ñ` harfi NFD altında `n` artı bir tildeye ayrılır.
- **İki katlama yapılandırmaya bağlıdır.** §20’deki yazım kipi harfleri etkinleştirildiğinde, `x→h` ve `w→v` tersine dönüştürmenin kasıtlı olarak kaybettiği ayrımları birleştirir; böylece *haram* araması *xaram* sözcüğüyle, *tav* araması ise *taw* sözcüğüyle eşleşir. Etkinleştirilmediklerinde `x` ve `w` yabancı adlardaki sıradan Latin harfleridir ve kendilerine katlanmalıdır: *Linux*, *LAX* ve *X Factor* art damak sızıcılı Kırgızca sözcükler değildir ve karma dilli içerik barındıran bir dizinde bunları *linuh* ve *lah* biçimlerine katlamak yanlış olur. Katlama yapılandırmayı izler; harflerin bir özelliği değildir.
- **Küçük dil harfleri dengesiz katlanır.** `ğ` kendi kuralını gerektirmez: NFD altında `g` artı bir breveye ayrışır ve tıpkı `ç` ve `ş` gibi işareti kaldırılır; dolayısıyla *bolğon* ve *bolgon* tek bir anahtara düşer. `q` ise kaldırılacak hiçbir şeyi olmayan bir temel harftir, dolayısıyla kendine katlanır ve *qyz* ile *kyz* iki ayrı anahtardır. Hem Jany-Latyn hem de `q` içeren ayarlardan metin barındıran bir dizin, bunları eşleştirmek için açık bir `q→k` kuralı gerektirir; bu kuralın, yapılandırmanın kasıtlı olarak yazdığı bir ayrımı birleştirme pahasına `foldKey` içine ait olup olmadığı açık bir sorudur.
- **Biçim denkliği işaret kaldırmalı yedek için geçerlidir.** Jany-Latyn’in ASCII eşlemesiyle yalın biçim katlanmış biçimin *kendisidir*, dolayısıyla `çaí` ve `cai` aynı anahtara düşer. Geçiş dönemi digraflı yedeğinde yalın biçim `chai` olur ve dizin ayrıca `ch→c` ile `sh→s` kurallarını uygulamadıkça farklı bir anahtara katlanır. Digraf tarzı metni dizinleyen her kurulum o fazladan kural çiftini gerektirir; işaret kaldırmalı yedek hiçbir şey gerektirmez.
- **Harmanlama.** Unicode Harmanlama Algoritması’nın [[6]](#ref6) uyarlanmamış düzeni altında `ç` harfi `c` harfinin bir çeşidi ve `ş` harfi `s` harfinin bir çeşidi olarak sıralanır ki bu Kırgızca alfabetik sıra değildir. Jany-Latyn için bir yerel ayar, tıpkı Türkçenin `ı`/`i` çiftini uyarlaması gibi bir harmanlama uyarlamasına gereksinim duyar.

SPEC.md belgesinin 5. bölümü, katlama yordamını seçenekleriyle birlikte adım adım verir.

---

## Ek C. Harmanlama Uyarlaması

Kurallar, Ortak Yerel Ayar Veri Deposu (CLDR), PostgreSQL’in ICU harmanlamaları, Java ve PyICU tarafından kabul edilen Unicode için Uluslararası Bileşenler (ICU) kural söz dizimiyle verilmektedir. `&` çapa atılan harfi adlandırır, `<` birincil bir farkı (alfabenin ayrı bir harfini) ve `<<<` üçüncül bir farkı (yalnızca büyük-küçük harf bakımından ayrılan aynı harfi) işaretler. Aşağıdaki ilk satırı şöyle okuyun: *`ç` harfini kendi başına bir harf olarak hemen `c` harfinin ardına yerleştirin ve `Ç` harfini o aynı harfin büyük biçimi olarak işleyin.* Diğer her satır da aynı biçimde çalışır.

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

`ç` harfini `b` harfinin ardına koymak yerine `c` harfine çapa atmak kasıtlıdır. `C` harfi Jany-Latyn alfabesinin bir harfi değildir, ancak yabancı adlarda sürekli geçer; dolayısıyla `ç` harfini ona bağlamak, alışılmadık yazılışları liste boyunca dağıtmak yerine ikisinin bitişik sıralanmasını sağlar. Bir diğerinin yerine geçen bir harf (`ŋ` yerine `ñ`, `í` yerine `ĭ` veya `ĩ`) yerini aldığı harfin konumunu alır ve hemen onun ardından sıralanır. Hiçbir yapılandırma böyle bir çiftin her iki harfini birden kullanmadığı için, hangisi seçilirse seçilsin bir liste özdeş biçimde sıralanır. Alfabenin dışında kalan ve çapa atılmamış harfler (`w`, `x` ve yapılandırmanın dışladığı yerde `q` veya `c`) varsayılan Latin konumlarını korur. **Alfabe üyeliği ve harmanlama kapsamı farklı sorulardır:** bir öğretim alfabesi, bir sıralamanın yine de yerleştirmek zorunda olduğu bir harfi dışarıda bırakabilir.

Sıralama tam biçim üzerinde tanımlıdır; yalın biçimli metin ASCII’dir ve öyle sıralanır, dolayısıyla orada `ş` ve `s` iç içe geçer. Harmanlama ve Ek B’deki arama katlaması zıt yönlere çeker — biri diğerinin birleştirdiğini ayırır — ve bir sistemin ikisine de gereksinimi vardır.

### Uygulama notu

`Intl.Collator` özel uyarlamaları kabul etmez; dolayısıyla bir JavaScript uygulaması yukarıdaki kuralları doğrudan işleyemez. Referans motor, depoda kayıtlı beklenen bir sıralamaya karşı sabitlenmiş, her yapılandırma için açık bir sıra tablosundan kurulan bir `compare(a, b)` işlevi sunar; ICU kuralları ise diğer tüm platformlar için yayımlanmaktadır.

---

## Ek D. Motor, Klavye Düzenleri ve CLI

Dönüştürme motoru çalışma zamanı bağımlılığı olmayan saf TypeScript’tir ve Node.js üzerinde, tarayıcılarda ve edge worker ortamlarında değiştirilmeden çalışır. macOS ve Linux için klavye düzenleri `ö`, `ü`, `í`, `ŋ`, `ç` ve `ş` harflerini tek değiştiricili tuş vuruşlarına yerleştirir ve bir komut satırı aracı derlem çalışmaları için dosya ve akışları dönüştürür.

| Bileşen | Bulunduğu yer |
| :--- | :--- |
| Dönüştürme motoru | `packages/engine/src/convert.ts` |
| Test ortamı seçenek eşleşmeleri | `packages/engine/src/testbedPresets.ts` |
| Alfabe sırası ve karşılaştırma | `packages/engine/src/collate.ts` |
| macOS klavye düzeni | `packages/engine/keymaps/jany-latyn.keylayout` |
| Linux XKB düzeni | `packages/engine/keymaps/jany.xkb` |
| Komut satırı dönüştürücüsü | `node packages/engine/dist/src/cli.js` |