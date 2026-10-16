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
  runicTianshan: string;
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
  formsTianshan: string;
  /** Beside Eski-Teŋir-Too: how many inscriptions its forms come from (RUNES-SPEC §6.4). */
  tianshanBasis: string;
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

/** A count's two English forms; {n} is the number. */
export interface Plural {
  one: string;
  other: string;
}

export interface TianshanTranslations {
  title: string;
  subtitle: string;
  status: string;
  tabs: Record<'overview' | 'inscriptions' | 'map' | 'signs' | 'phonemes' | 'sources' | 'about', string>;
  statInscriptions: string;
  statSites: Plural;
  statRegions: string;
  statSources: string;
  statOpen: string;
  statTranscribed: string;
  statLinesSigns: string;
  regionsTitle: string;
  regionRecords: Plural;
  countsTitle: string;
  countsHint: string;
  countsSource: string;
  countsUpTo: string;
  countsTotal: string;
  countsByRegion: string;
  countsScope: string;
  formsTitle: string;
  formsText: string;
  tryIt: string;
  filterRegion: string;
  filterObject: string;
  filterAll: string;
  search: string;
  shown: string;
  colInscription: string;
  colRegion: string;
  colSite: string;
  colObject: string;
  colFound: string;
  colClaims: string;
  colTranscription: string;
  notYet: string;
  linesCount: Plural;
  objects: Record<'boulder' | 'rock' | 'stick' | 'vessel' | 'statue' | 'unknown', string>;
  fields: Record<string, string>;
  site: string;
  siteUnknown: string;
  placedByRegion: string;
  region: string;
  object: string;
  possiblySame: string;
  maybeDuplicate: string;
  claimsTitle: string;
  claimsHint: string;
  conflict: string;
  evidence: Record<'summary' | 'record' | 'page' | 'publication' | 'tracing', string>;
  transcriptionTitle: string;
  noTranscription: string;
  noPublications: string;
  readFrom: string;
  signsLabel: string;
  readerLabel: string;
  previous: string;
  next: string;
  allInscriptions: string;
  mapHint: string;
  unplacedTitle: string;
  legendSite: string;
  legendRegion: string;
  mapCredit: string;
  signsHint: string;
  colGrapheme: string;
  colValue: string;
  colSymbol: string;
  colKind: string;
  colPhonemes: string;
  colGlyphs: string;
  colAttested: string;
  colTianshan: string;
  colYenisei: string;
  kinds: Record<'vowel' | 'consonant' | 'syllabic' | 'ligature', string>;
  back: string;
  front: string;
  yeniseiStandIn: string;
  phonemesHint: string;
  colPhoneme: string;
  colIpa: string;
  colFeatures: string;
  colWrittenBy: string;
  colModern: string;
  modernHint: string;
  sourcesHint: string;
  access: Record<'open' | 'abstract' | 'print' | 'web', string>;
  consulted: string;
  download: string;
  about: string;
  citedBy: string;
  sourceGroups: Record<'publications' | 'web' | 'places' | 'brief', string>;
  leadsTitle: string;
  leadsHint: string;
  leadStatus: Record<'unconfirmed' | 'conflicts' | 'supported', string>;
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
  tianshan: TianshanTranslations;
}

/** A locale may leave any string out; it then shows the English one. */
export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export type BaseLocale = 'ky' | 'ru' | 'en' | 'tr' | 'zh';
