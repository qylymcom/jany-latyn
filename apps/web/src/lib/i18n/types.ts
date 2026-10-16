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

export interface SiteTranslations {
  latin: string;
  runic: string;
  latinAlphabet: string;
  latinWhitepaper: string;
  runicAlphabet: string;
  runicProposal: string;
  runicCorpus: string;
  subtitle: string;
  draftBanner: string;
  comingSoon: string;
  comingSoonSource: string;
  moved: string;
}

export interface ScriptsTranslations {
  source: string;
  target: string;
  auto: string;
  autoDetected: string;
  guessing: string;
  swap: string;
  swapOneWay: string;
  cyrillic: string;
  latin: string;
  ascii: string;
  runes: string;
  reading: string;
  oldSpelling: string;
  notReadable: string;
  restoreLoans: string;
  restoreLoansHint: string;
  statusProposed: string;
  statusReference: string;
  statusComparison: string;
  statusExperimental: string;
  showJanyLatyn: string;
  copyForLtr: string;
  readingNotation: string;
  readingScholarly: string;
  readingCta: string;
  readingJanyLatyn: string;
  readingCyrillic: string;
  comparisonTitle: string;
  comparisonHint: string;
  inspectorTitle: string;
  inspectorHint: string;
  inspectorLetter: string;
  inspectorRune: string;
  inspectorName: string;
  inspectorWhy: string;
  governedBy: string;
  seriesBack: string;
  seriesFront: string;
  noVowel: string;
  dropped: string;
  ligature: string;
  close: string;
}

export interface RunicTranslations {
  harmonyLabel: string;
  harmonyNone: string;
  harmonyKg: string;
  harmonyFull: string;
  registerLabel: string;
  registerPlene: string;
  registerEpigraphic: string;
  vowelsLabel: string;
  vowelsDistinct: string;
  vowelsHistorical: string;
  uLabel: string;
  uBash: string;
  uDotted: string;
  uOldHungarian: string;
  zheLabel: string;
  zheChart: string;
  zheFront: string;
  zheEtymological: string;
  loanLabel: string;
  loanChart: string;
  loanNativized: string;
  formsLabel: string;
  formsChart: string;
  formsOrkhon: string;
  formsYenisei: string;
  rLabel: string;
  sLabel: string;
  shLabel: string;
  letterChart: string;
  letterAttested: string;
  yeniseiShLabel: string;
  yeniseiShApart: string;
  yeniseiShMerged: string;
  separatorLabel: string;
  separatorSpace: string;
  separatorTwoDot: string;
  oneWay: string;
  hardToRead: string;
  reversible: string;
  notReversible: string;
}

export interface Translations {
  nav: NavTranslations;
  playground: PlaygroundTranslations;
  alphabet: AlphabetTranslations;
  about: AboutTranslations;
  consent: ConsentTranslations;
  site: SiteTranslations;
  scripts: ScriptsTranslations;
  runic: RunicTranslations;
}

/** A locale may leave any string out; it then shows the English one. */
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export type BaseLocale = 'ky' | 'ru' | 'en' | 'tr' | 'zh';
