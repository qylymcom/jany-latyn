// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import type { HandleClientError } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import posthog from 'posthog-js';

// Analytics are off unless the deployment sets both PUBLIC_POSTHOG_KEY and
// PUBLIC_POSTHOG_HOST. Only the hosted testbed does; a clone, a self-hosted
// copy, or a classroom deployment sends nothing. Every capture() call in the
// app is guarded by posthog.__loaded, which stays false when init is skipped.
const RELOADED_AT = 'jany_chunk_reload_at';

// A chunk that fails to load belongs to a deploy that has since been replaced.
// Reload once to pick up the current build; the timestamp guard stops a loop
// when the failure is a real network error rather than a stale tab.
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    try {
      const last = Number(sessionStorage.getItem(RELOADED_AT) ?? 0);
      if (Date.now() - last < 60_000) return;
      sessionStorage.setItem(RELOADED_AT, String(Date.now()));
    } catch {
      return;
    }
    event.preventDefault();
    window.location.reload();
  });
}

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
    // Nothing is captured until the visitor answers the consent banner. Accepting
    // stores an identifier; declining counts events with PostHog's daily-rotating
    // server hash and stores nothing (needs "Cookieless server hash mode" enabled
    // in the PostHog project settings).
    cookieless_mode: 'on_reject',
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
