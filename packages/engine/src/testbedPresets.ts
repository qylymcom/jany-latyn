// SPDX-License-Identifier: MIT
// Testbed option coupling (§11.1 whitepaper).
//
// These transitions are a TESTBED AFFORDANCE, not engine invariants. The pure
// conversion functions in convert.ts keep `yGrapheme` and `uvularK` fully
// independent — `cyrToJany(text, { yGrapheme: 'dotless-i', uvularK: 'k' })` is
// a valid configuration and the engine never couples the two. The coupling
// exists only to steer the testbed's option UI away from configurations the
// whitepaper argues against, and it lives here so it has a single tested source
// of truth that the web UI (and any other front-end) can share.
import type { JanyOptions } from './convert.js';

export interface TestbedOptionState {
  yGrapheme: NonNullable<JanyOptions['yGrapheme']>;
  glideGrapheme: NonNullable<JanyOptions['glideGrapheme']>;
  uvularK: NonNullable<JanyOptions['uvularK']>;
}

// Selecting dotless `ı` force-enables allophonic `q` (§7): once the vowel-level
// kına/kina distinction becomes unreliable in small type, the consonant-level
// distinction is needed to carry it. Selecting `y` reverts to unified `k` and
// clears the double-role `y` glide collision (§4.4).
export function resolveYGraphemeChange(
  state: TestbedOptionState,
  next: NonNullable<JanyOptions['yGrapheme']>,
): TestbedOptionState {
  if (next === 'dotless-i') {
    return { ...state, yGrapheme: next, uvularK: 'q' };
  }
  return {
    ...state,
    yGrapheme: next,
    uvularK: 'k',
    glideGrapheme: state.glideGrapheme === 'y' ? 'acute-i' : state.glideGrapheme,
  };
}

// Choosing the `y` glide while `ы` is still written `y` would give `y` two
// roles, so it forces the vowel to dotless `ı` (which in turn force-enables
// `q`, per the same argument as above).
export function resolveGlideGraphemeChange(
  state: TestbedOptionState,
  next: NonNullable<JanyOptions['glideGrapheme']>,
): TestbedOptionState {
  if (next === 'y' && state.yGrapheme === 'y') {
    return { ...state, glideGrapheme: next, yGrapheme: 'dotless-i', uvularK: 'q' };
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
