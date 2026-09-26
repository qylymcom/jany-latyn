// SPDX-License-Identifier: MIT
// Testbed option coupling (whitepaper §7, SPEC §7).
//
// These transitions are a TESTBED AFFORDANCE, not engine invariants. The pure
// conversion functions in convert.ts keep `yGrapheme`, `glideGrapheme`,
// `uvularK`, and `uvularG` fully independent — `cyrToJany(text, { yGrapheme:
// 'dotless-i', uvularK: 'k' })` is a valid configuration and the engine never
// couples them. The coupling only seeds the testbed's option UI with the
// settings the whitepaper compares, and it lives here so it has a single tested
// source of truth that the web UI (and any other front-end) can share.
import type { JanyOptions } from './convert.js';

export interface TestbedOptionState {
  yGrapheme: NonNullable<JanyOptions['yGrapheme']>;
  glideGrapheme: NonNullable<JanyOptions['glideGrapheme']>;
  uvularK: NonNullable<JanyOptions['uvularK']>;
  uvularG: NonNullable<JanyOptions['uvularG']>;
}

// Selecting allophonic `q` carries `ğ` with it, and reverting to unified `k`
// takes it back off (whitepaper §8): the lexicon dependency that governs the
// voiceless letter governs the voiced one identically, so a standard that
// writes `q` writes `ğ`. Like every coupling here it only seeds the option —
// the plain setter can still take `ğ` off afterwards, which keeps the
// asymmetric configuration §8 argues against reachable for inspection.
export function resolveUvularKChange(
  state: TestbedOptionState,
  next: NonNullable<JanyOptions['uvularK']>,
): TestbedOptionState {
  return { ...state, uvularK: next, uvularG: next === 'q' ? 'ğ' : 'g' };
}

// Selecting dotless `ı` seeds the q+ğ+ı setting (whitepaper §7): allophonic `q`,
// because once the kına/kina distinction is unreliable in small type a
// consonant has to carry it (§9), `ğ` behind it (§8), and the `y` glide, since
// with ы written ı the letter y is free and keeping í would put ı, i, and í
// side by side (§17.3). Selecting `y` reverts to unified `k` and `g` and returns
// a `y` glide to `í`, which would otherwise play two roles (§10).
export function resolveYGraphemeChange(
  state: TestbedOptionState,
  next: NonNullable<JanyOptions['yGrapheme']>,
): TestbedOptionState {
  if (next === 'dotless-i') {
    return { ...resolveUvularKChange(state, 'q'), yGrapheme: next, glideGrapheme: 'y' };
  }
  return {
    ...resolveUvularKChange(state, 'k'),
    yGrapheme: next,
    glideGrapheme: state.glideGrapheme === 'y' ? 'acute-i' : state.glideGrapheme,
  };
}

// The `y` glide is offered only while `ы` is written `ı`; while ы is y it would
// give `y` two roles, so the request is ignored and the state comes back
// unchanged. The web UI disables that choice rather than calling this.
export function resolveGlideGraphemeChange(
  state: TestbedOptionState,
  next: NonNullable<JanyOptions['glideGrapheme']>,
): TestbedOptionState {
  if (next === 'y' && state.yGrapheme === 'y') return state;
  return { ...state, glideGrapheme: next };
}

// Whitepaper §7 — warned about, never prevented: the ĩ glide alongside the ñ
// velar nasal puts the same tilde on two letters for two unrelated jobs. Unlike
// the y/y collision this leaves text unambiguous, so the testbed only tells the
// reader.
export function hasTildeClash(
  state: Pick<JanyOptions, 'glideGrapheme' | 'velarNasal'>,
): boolean {
  return state.glideGrapheme === 'tilde-i' && state.velarNasal === 'tilde-n';
}
