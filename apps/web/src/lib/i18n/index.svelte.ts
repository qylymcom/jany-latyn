// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { cyrToJany } from 'jany-latyn/convert';
import { TRANSLATIONS } from './translations.js';
import type { Locale, Translations, BaseLocale } from './types.js';

function deepConvert(obj: any): any {
  if (typeof obj === 'string') {
    return cyrToJany(obj);
  }
  if (typeof obj === 'object' && obj !== null) {
    const res: any = Array.isArray(obj) ? [] : {};
    for (const k of Object.keys(obj)) {
      res[k] = deepConvert(obj[k]);
    }
    return res;
  }
  return obj;
}

const KY_JANY_DICTIONARY: Translations = deepConvert(TRANSLATIONS.ky);
KY_JANY_DICTIONARY.about.whatIsThisContent =
  'Jany-Latyn — kirillitsadan çygaryluuçu kyrgyz tilinin latyn jazuusu. Anyn determindüü konverteri jana ar bir talaştuu tandoo özünçö parametr bolgon synoo çöírösü bar. Negizgi dal kelüülör: ж→j, ч→ç, ш→ş, х→h, ң→ŋ, ө→ö, ү→ü, ы→y, й→í; sozulma ündüülör koş jazylat (даамдуу → daamduu), orusça ъ/ь belgileri siŋirilet, oşonduktan ar bir söz tamgalardan gana turat.';
KY_JANY_DICTIONARY.about.usagePlayground =
  'Oíun talaasy: başky bette kyrgyzça kirillitsada teriŋiz — Jany-Latyn jana ASCII rezervdik türü terip jatkanda ele çygat. Daíar varianttardyn (Jany-Latyn, CTA, digraftar, aralaş ө) ortosunda kotoruluŋuz je ar bir tamgany özüŋüz tandaŋyz; salyştyruu tizmesi ar bir variant kaísy sözdördü özgörtkönün körsötöt. Ülgü tekstter, faíldy jüktöö jana saktoo, virtualdyk klaviatura jana aripti aldyn ala körüü da bar.';
KY_JANY_DICTIONARY.alphabet.russianZhaNote =
  'Kirme sözdördögü orusça ж [ʒ] bolup aítylat, birok daíyma j dep jazylat.';
KY_JANY_DICTIONARY.playground.uVariantLabel = 'ү katary:';
KY_JANY_DICTIONARY.playground.vowelModeLabel = 'Ündüülör (ө, ү):';
KY_JANY_DICTIONARY.playground.vowelLatinUmlaut = 'ö / ü (toluk latyn)';
KY_JANY_DICTIONARY.playground.vowelHybrid = 'ө / ü (aralaş ө)';
KY_JANY_DICTIONARY.playground.vowelCyrillicU = 'ө / ұ (kirillitsa ұ)';
KY_JANY_DICTIONARY.playground.vowelMacronU = 'ө / ū (makronu menen)';
KY_JANY_DICTIONARY.playground.yGraphemeLabel = 'ы tamgasy:';
KY_JANY_DICTIONARY.playground.glideGraphemeLabel = 'й tamgasy:';
KY_JANY_DICTIONARY.playground.sibilantModeLabel = 'Uíaŋ/şybyş (ч, ш):';
KY_JANY_DICTIONARY.playground.signsModeLabel = 'ъ / ь belgileri:';
KY_JANY_DICTIONARY.playground.uvularKLabel = 'к / q tamgasy:';
KY_JANY_DICTIONARY.playground.uvularKWarningLoanwords =
  'Eskertüü: kirillitsa [k] menen [q] tybyştaryn bir ele «к» tamgasy menen jazat, oşonduktan bul aíyrmany kirillitsadan çygaruuga bolboít, jana ereje boíunça koíulgan «q» kirme sözdördö kata bolot («космос → qosmos», «карта → qarta», «парк → parq»). Sözdü bilgen adam any tuura jazat.';
KY_JANY_DICTIONARY.playground.uvularGLabel = 'г / ğ tamgasy:';
KY_JANY_DICTIONARY.playground.uvularGWarningLoanwords =
  'Eskertüü: kirillitsa [g] menen [ʁ] tybyştaryn bir ele «г» tamgasy menen jazat, oşonduktan bul aíyrmany kirillitsadan çygaruuga bolboít, jana ereje boíunça koíulgan «ğ» kirme sözdördö kata bolot («газ → ğaz», «гарантия → ğarantiía»). Sözdü bilgen adam any tuura jazat.';
KY_JANY_DICTIONARY.playground.affricateLabel = 'ж tamgasy:';
KY_JANY_DICTIONARY.playground.affricateWarningLoanwords =
  'Eskertüü: kirillitsa [dʒ] menen [ʒ] tybyştaryn bir ele «ж» tamgasy menen jazat, oşonduktan bul aíyrmany kirillitsadan çygaruuga bolboít, jana ereje boíunça koíulgan «c» kirme sözdördö kata bolot («журнал → curnal», «гараж → garac», «режим → recim»). Sözdü bilgen adam any tuura jazat.';
KY_JANY_DICTIONARY.playground.velarNasalLabel = 'ң tamgasy:';
KY_JANY_DICTIONARY.playground.velarNasalEng = 'ŋ (eŋ)';
KY_JANY_DICTIONARY.playground.velarNasalTildeN = 'ñ (tilde menen)';
KY_JANY_DICTIONARY.playground.fallbackStyleLabel = 'ASCII stili:';
KY_JANY_DICTIONARY.playground.fallbackStyleStrip = 'c / s (tizmek, §10)';
KY_JANY_DICTIONARY.playground.fallbackStyleDigraph = 'ch / sh (digraftar)';

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'ky-jany';
  }

  try {
    const saved = localStorage.getItem('jany_latyn_locale') as Locale;
    if (saved && (saved === 'ky-jany' || saved === 'ky' || saved === 'ru' || saved === 'en' || saved === 'tr')) {
      return saved;
    }
  } catch {
    // Ignore restricted storage contexts
  }

  if (typeof navigator !== 'undefined') {
    const candidates = navigator.languages && navigator.languages.length > 0
      ? navigator.languages
      : [navigator.language];

    for (const lang of candidates) {
      if (!lang) continue;
      const primary = lang.toLowerCase().split(/[-_]/)[0];
      if (primary === 'en') return 'en';
      if (primary === 'ru') return 'ru';
      if (primary === 'tr') return 'tr';
      if (primary === 'ky') return 'ky';
    }
  }

  return 'ky-jany';
}

const initialLocale = getInitialLocale();
let currentLocale = $state<Locale>(initialLocale);

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLocale === 'ky-jany' ? 'ky' : initialLocale;
}

export const i18n = {
  get locale(): Locale {
    return currentLocale;
  },
  set locale(val: Locale) {
    currentLocale = val;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('jany_latyn_locale', val);
      } catch {
        // Ignore restricted storage contexts
      }
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = val === 'ky-jany' ? 'ky' : val;
    }
  },
  get t(): Translations {
    if (currentLocale === 'ky-jany') {
      return KY_JANY_DICTIONARY;
    }
    return TRANSLATIONS[currentLocale as BaseLocale] ?? TRANSLATIONS.ky;
  },
  setLocale(val: Locale) {
    this.locale = val;
  },
};

export const LOCALES: ReadonlyArray<{ id: Locale; label: string }> = [
  { id: 'ky-jany', label: 'Kyrgyzça' },
  { id: 'ky', label: 'Кыргызча' },
  { id: 'ru', label: 'Русский' },
  { id: 'en', label: 'English' },
  { id: 'tr', label: 'Türkçe' },
];
