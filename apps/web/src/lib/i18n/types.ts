// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
export type Locale = 'ky-jany' | 'ky' | 'ru' | 'en' | 'tr' | 'zh';

export interface NavTranslations {
  siteTitle: string;
  scriptSubtitle: string;
  playground: string;
  alphabet: string;
  whitepaper: string;
  about: string;
  menu: string;
  themeToggle: string;
}

export interface PlaygroundTranslations {
  placeholder: string;
  fontLabel: string;
  fontUnavailable: string;
  vowelModeLabel: string;
  vowelLatinUmlaut: string;
  vowelHybrid: string;
  vowelCyrillicU: string;
  vowelMacronU: string;
  yGraphemeLabel: string;
  yGraphemeY: string;
  yGraphemeDotlessI: string;
  glideGraphemeLabel: string;
  glideGraphemeAcuteI: string;
  glideGraphemeBreveI: string;
  glideGraphemeTildeI: string;
  glideGraphemePlainI: string;
  tildeClashNote: string;
  glideGraphemeY: string;
  sibilantModeLabel: string;
  sibilantDigraph: string;
  sibilantCedilla: string;
  signsModeLabel: string;
  signsAbsorbed: string;
  signsApostrophe: string;
  uvularKLabel: string;
  uvularKUnified: string;
  uvularKAllophonic: string;
  velarNasalLabel: string;
  velarNasalEng: string;
  velarNasalTildeN: string;
  fallbackStyleLabel: string;
  fallbackStyleStrip: string;
  fallbackStyleDigraph: string;
  viewModeText: string;
  viewModeList: string;
  listSourceColumn: string;
  listResultColumn: string;
  listHint: string;
  sampleGroupText: string;
  sampleGroupList: string;
  allCaps: string;
  allCapsHint: string;
  ctaPresetLabel: string;
  comparisonTitle: string;
  yCollisionDisallowed: string;
  uvularKAutoNote: string;
  uvularKWarningLoanwords: string;
  uvularGLabel: string;
  uvularGUnified: string;
  uvularGAllophonic: string;
  uvularGWarningLoanwords: string;
  affricateLabel: string;
  affricateUnified: string;
  affricateMechanical: string;
  affricateWarningLoanwords: string;
  velarFricativeLabel: string;
  velarFricativeH: string;
  velarFricativeX: string;
  velarFricativeNote: string;
  southernHelperTitle: string;
  copyInput: string;
  fallbackTitle: string;
  copy: string;
  copied: string;
  copyFailed: string;
  uploadText: string;
  downloadText: string;
  selectSample: string;
  fileTooLarge: string;
  keyboardToggle: string;
  voteButton: string;
  votedBadge: string;
  inputTitle: string;
  outputTitle: string;
  variantLabel: string;
  variantCustom: string;
  variantDigraphs: string;
  variantHybrid: string;
  descStandard: string;
  descCta: string;
  descDigraphs: string;
  descHybrid: string;
  descCustom: string;
  customize: string;
  resetOptions: string;
  compareHint: string;
  useVariant: string;
  currentBadge: string;
  showMore: string;
  showLess: string;
  emptyOutput: string;
  clearInput: string;
  words: string;
}

export interface AlphabetTranslations {
  title: string;
  coreLetters: string;
  loanLetters: string;
  longVowels: string;
  russianZhaNote: string;
  loanTag: string;
  janyLatynAlphabet: string;
  lettersCount: string;
}

export interface AboutTranslations {
  title: string;
  whatIsThisTitle: string;
  whatIsThisContent: string;
  usageTitle: string;
  usagePlayground: string;
  usageCli: string;
  specTitle: string;
  specContent: string;
  license: string;
  contactTitle: string;
  supportTitle: string;
  privacyTitle: string;
  privacyStorage: string;
  privacyDeployments: string;
  privacyOff: string;
  privacyOn: string;
  privacyAccepted: string;
  privacyDeclined: string;
  privacyChoice: string;
  privacyGranted: string;
  privacyDenied: string;
  privacyPending: string;
}

export interface ConsentTranslations {
  message: string;
  accept: string;
  decline: string;
  learnMore: string;
}

export interface Translations {
  nav: NavTranslations;
  playground: PlaygroundTranslations;
  alphabet: AlphabetTranslations;
  about: AboutTranslations;
  consent: ConsentTranslations;
}

export type BaseLocale = 'ky' | 'ru' | 'en' | 'tr' | 'zh';
