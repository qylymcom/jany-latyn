// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import posthog from 'posthog-js';

// 'off' means this deployment was built without analytics (hooks.client.ts),
// so there is nothing to consent to and no banner is shown.
export type ConsentStatus = 'off' | 'pending' | 'granted' | 'denied';

// PostHog keeps the choice itself; this mirrors it so the banner and the
// About page's privacy section react to a change made in either place.
class Consent {
  status = $state<ConsentStatus>('off');

  refresh(): void {
    this.status = posthog.__loaded ? posthog.get_explicit_consent_status() : 'off';
  }

  accept(): void {
    if (!posthog.__loaded) return;
    posthog.opt_in_capturing();
    this.refresh();
  }

  decline(): void {
    if (!posthog.__loaded) return;
    posthog.opt_out_capturing();
    this.refresh();
  }
}

export const consent = new Consent();
