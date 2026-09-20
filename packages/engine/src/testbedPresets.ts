// SPDX-License-Identifier: MIT
// Testbed option coupling (§11.1 whitepaper).
//
// These transitions are a TESTBED AFFORDANCE, not engine invariants. The pure
// conversion functions in convert.ts keep `yGrapheme`, `uvularK`, and `uvularG`
// fully independent — `cyrToJany(text, { yGrapheme: 'dotless-i', uvularK: 'k' })`
// is a valid configuration and the engine never couples them. The coupling
// exists only to steer the testbed's option UI away from configurations the
// whitepaper argues against, and it lives here so it has a single tested source
// of truth that the web UI (and any other front-end) can share.
import type { JanyOptions } from './convert.js';

export interface TestbedOptionState {
  yGrapheme: NonNullable<JanyOptions['yGrapheme']>;
  glideGrapheme: NonNullable<JanyOptions['glideGrapheme']>;
  uvularK: NonNullable<JanyOptions['uvularK']>;
  uvularG: NonNullable<JanyOptions['uvularG']>;
}

// Selecting allophonic `q` carries `ğ` with it, and reverting to unified `k`
// takes it back off (§6): the lexicon dependency that governs the voiceless
// letter governs the voiced one identically, so a standard that writes `q`
// writes `ğ`. Like every coupling here it only seeds the option — the plain
// setter can still take `ğ` off afterwards, which keeps the asymmetric
// configuration §6 argues against reachable for inspection.
export function resolveUvularKChange(
  state: TestbedOptionState,
  next: NonNullable<JanyOptions['uvularK']>,
): TestbedOptionState {
  return { ...state, uvularK: next, uvularG: next === 'q' ? 'ğ' : 'g' };
}

// Selecting dotless `ı` force-enables allophonic `q` (§7): once the vowel-level
// kına/kina distinction becomes unreliable in small type, the consonant-level
// distinction is needed to carry it, and `q` carries `ğ` in turn (§6).
// Selecting `y` reverts to unified `k` and `g` and clears the double-role `y`
// glide collision (§4.4).
export function resolveYGraphemeChange(
  state: TestbedOptionState,
  next: NonNullable<JanyOptions['yGrapheme']>,
): TestbedOptionState {
  if (next === 'dotless-i') {
    return { ...resolveUvularKChange(state, 'q'), yGrapheme: next };
  }
  return {
    ...resolveUvularKChange(state, 'k'),
    yGrapheme: next,
    glideGrapheme: state.glideGrapheme === 'y' ? 'acute-i' : state.glideGrapheme,
  };
}

// Choosing the `y` glide while `ы` is still written `y` would give `y` two
// roles, so it forces the vowel to dotless `ı` (which in turn force-enables
// `q`, and `ğ` behind it, per the same argument as above).
export function resolveGlideGraphemeChange(
  state: TestbedOptionState,
  next: NonNullable<JanyOptions['glideGrapheme']>,
): TestbedOptionState {
  if (next === 'y' && state.yGrapheme === 'y') {
    return { ...resolveUvularKChange(state, 'q'), glideGrapheme: next, yGrapheme: 'dotless-i' };
  }
  return { ...state, glideGrapheme: next };
}

// §11.1 third pairing — warned about, never prevented: the ĩ glide alongside
// the ñ velar nasal puts the same tilde on two letters for two unrelated jobs.
// Unlike the y/y collision this leaves text unambiguous, so the testbed only
// tells the reader.
export function hasTildeClash(
  state: Pick<JanyOptions, 'glideGrapheme' | 'velarNasal'>,
): boolean {
  return state.glideGrapheme === 'tilde-i' && state.velarNasal === 'tilde-n';
}
