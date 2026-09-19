// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defaultClientConditions, defaultServerConditions, defineConfig } from 'vite';

// The engine (packages/engine) is consumed as TypeScript source through its
// `source` export condition, so the web app needs no separate engine build.
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  resolve: { conditions: ['source', ...defaultClientConditions] },
  ssr: { resolve: { conditions: ['source', ...defaultServerConditions], externalConditions: ['source'] } },
  server: { fs: { allow: ['../..'] } }
});
