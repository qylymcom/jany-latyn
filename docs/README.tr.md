# Jany-Latyn

[Kyrgyzça (Jany-Latyn)](README.ky-jany.md) · [Кыргызча (Кириллица)](README.ky.md) · [Русский](README.ru.md) · [English](../README.md) · Türkçe

**Jany-Latyn**, Kiril alfabesinden türetilebilen, Kırgızca (Кыргызча) için bir Latin imla sistemidir.
Deterministik bir dönüştürme motoru ve tartışmalı her imla tercihinin seçilebilir bir seçenek olarak
sunulduğu bir web test ortamıyla birlikte gelir.

Temel eşlemeler **ж→j, ч→ç, ш→ş, х→h, ң→ŋ, ө→ö, ү→ü, ы→y, й→í** ve çift harfle yazılan uzun
ünlülerdir (тоок → took). Rusçadaki `ъ`/`ь` işaretleri ayrı harf olarak yazılmaz; böylece her sözcük
yalnızca harflerden oluşur.

> Ак мөңгүлүү аска, зоолор, талаалар → **Ak möŋgülüü aska, zoolor, talaalar**

Bu tercihlerin gerekçesi ve gerekçenin yanılıyor olabileceği noktalar teknik raporda ayrıntılı olarak
ele alınır: **[WHITEPAPER.md](WHITEPAPER.md)** (İngilizce). Eşleme kuralları [SPEC.md](SPEC.md)
dosyasındadır (İngilizce).

## Depo yapısı

| Yol | İçerik | Lisans |
| :--- | :--- | :--- |
| [`packages/engine/`](../packages/engine) | Dönüştürücü, komut satırı aracı (CLI), klavye düzenleri, testler, uygunluk denetleyicisi | MIT |
| [`apps/web/`](../apps/web) | Test ortamı web uygulaması (SvelteKit) | PolyForm Noncommercial 1.0.0 |
| [`docs/`](.) | Teknik rapor, belirtim, klavye kılavuzu, çevrilmiş README dosyaları | CC BY 4.0 |

## Motoru kurma ve kullanma

Motor, çalışma zamanı bağımlılığı olmayan saf TypeScript'tir. Node.js 20 veya daha yeni bir sürüm gerekir.

```sh
git clone https://github.com/qylymcom/jany-latyn.git
cd jany-latyn
npm install
npm run build

echo "Ак мөңгүлүү аска" | node packages/engine/dist/src/cli.js                 # Ak möŋgülüü aska
echo "Ак мөңгүлүү аска" | node packages/engine/dist/src/cli.js --to fallback   # ASCII: Ak monguluu aska
echo "Ak möŋgülüü aska" | node packages/engine/dist/src/cli.js --to cyrillic   # Ак мөңгүлүү аска
```

Kod içinden:

```ts
import { cyrToJany, janyToCyr, janyToFallback } from 'jany-latyn/convert';

cyrToJany('Ак мөңгүлүү аска'); // 'Ak möŋgülüü aska'
```

macOS ve Linux için klavye düzenleri `packages/engine/keymaps/` dizinindedir. Kurulum talimatları
[keyboard.md](keyboard.md) dosyasındadır (İngilizce).

## Test ortamını yerel olarak çalıştırma

```sh
npm install
npm run dev          # http://localhost:5173
npm run build:web    # apps/web/build/ içinde statik derleme
```

Herhangi bir yapılandırma gerekmez. İsteğe bağlı ayarlar `apps/web/.env.example` dosyasında
listelenmiştir. `PUBLIC_POSTHOG_KEY` ve `PUBLIC_POSTHOG_HOST` birlikte ayarlanmadıkça analitik
**kapalıdır**; bu nedenle yerel, kendi sunucusunda barındırılan ya da sınıfta kullanılan bir kopya
hiçbir yere veri göndermez.

## Testleri çalıştırma

```sh
npm test             # motor testleri, kod noktası envanteri, paket sınırı ve teknik rapor uygunluk denetleyicisi
npm run check:web    # web uygulaması için Svelte ve TypeScript denetimleri
```

Uygunluk denetleyicisi, `docs/WHITEPAPER.md` içindeki harf çevirisi örneklerini motora karşı doğrular;
böylece teknik rapor ile motor birlikte sürümlenir.

## Lisans: üç ayrı lisans

Bu deponun tek bir lisansı yoktur. Motor **MIT**, web test ortamı **PolyForm Noncommercial 1.0.0**,
belgeler ise **CC BY 4.0** ile lisanslanmıştır. Her dizinin kendi `LICENSE` dosyası vardır. Bunun
uygulamada ne anlama geldiği için **[LICENSING.md](../LICENSING.md)** dosyasına bakın. Proje adı ve
logosu [TRADEMARK.md](../TRADEMARK.md) kapsamındadır; nasıl katkıda bulunulacağı
[CONTRIBUTING.md](../CONTRIBUTING.md) dosyasında açıklanmıştır.

## Bu çalışmaya atıf

Yazılımı veya belirtimi kullanırsanız lütfen atıf yapın. Künye bilgileri
[CITATION.cff](../CITATION.cff) dosyasındadır; GitHub'daki "Cite this repository" düğmesi bu dosyayı
okur. Teknik raporun başındaki künye bölümünde de bir atıf satırı bulunur.
