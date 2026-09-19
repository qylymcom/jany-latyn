// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { HandleClientError } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import posthog from 'posthog-js';

// Analytics are off unless the deployment sets both PUBLIC_POSTHOG_KEY and
// PUBLIC_POSTHOG_HOST. Only the hosted testbed does; a clone, a self-hosted
// copy, or a classroom deployment sends nothing. Every capture() call in the
// app is guarded by posthog.__loaded, which stays false when init is skipped.
export function init() {
  const key = env.PUBLIC_POSTHOG_KEY?.trim();
  const host = env.PUBLIC_POSTHOG_HOST?.trim();
  if (!key || !host) return;

  posthog.init(key, {
    api_host: host,
    defaults: '2026-01-30',
    autocapture: false,
    disable_session_recording: true,
    person_profiles: 'identified_only',
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false
    }
  });
}

export const handleError: HandleClientError = ({ error, status, message }) => {
  if (posthog.__loaded) {
    posthog.captureException(error);
  }

  return { status, message };
};
