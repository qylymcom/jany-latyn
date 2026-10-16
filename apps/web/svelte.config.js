// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    // The Tian-Shan inscription database and its MIT module (corpus/scripts/tianshan/db.mjs),
    // read at build time by the prerendered /runic/tianshan/ pages.
    alias: { $corpus: '../../corpus' },
    paths: { relative: false },
    // A deploy replaces every hashed chunk, so a tab opened before it can no
    // longer load the old ones. Polling lets the client notice the new version
    // and make its next navigation a full page load.
    version: { pollInterval: 5 * 60 * 1000 }
  }
};
export default config;
