// SPDX-License-Identifier: MIT
// Known loanwords whose correct Cyrillic form cannot be recovered by the core
// rule-based engine. The core is complete on its own; this list only ever
// restores loan spellings that the core has already flagged as lossy.
// See whitepaper §18.2.
//
// Known side effect: the 'ishak' prefix entry restores the proper name Исхак
// but will mis-convert the Russian loan ишак in digraph-mode input. That trade
// is deliberate — the proper name is the one that appears in documents — and is
// the kind of thing an exception list always costs.

export const LOAN_EXACT: Readonly<Record<string, string>> = {
  semía: 'семья',
  statía: 'статья',
  kompíuter: 'компьютер',
  obíekt: 'объект',
  subíekt: 'субъект',
  síezd: 'съезд',
  obíavlenie: 'объявление',
  iíul: 'июль',
  iíun: 'июнь',
  aprel: 'апрель',
  rol: 'роль',
  kontrol: 'контроль',
  albom: 'альбом',
  film: 'фильм',
  // post-vocalic е loanwords: core gives пройект / перейезд / пойезд
  pereíezd: 'переезд',
  poíezd: 'поезд',
  proíekt: 'проект',
};

// Prefix entries for compounds: the head is restored, the tail re-enters the core.
// Each tuple is [jany-prefix, cyrillic-replacement, prefix-length-in-chars].
export const LOAN_PREFIXES: ReadonlyArray<readonly [string, string, number]> = [
  ['ishak', 'исхак', 5],
  ['semía', 'семья', 5],
  ['obíekt', 'объект', 6],
  ['iíul', 'июль', 4],
  ['aprel', 'апрель', 5],
];
