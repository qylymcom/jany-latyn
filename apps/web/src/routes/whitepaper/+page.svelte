<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { i18n } from '$lib/i18n/index.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{i18n.t.nav.whitepaper.toUpperCase()} — {i18n.t.nav.siteTitle}</title>
  <meta name="description" content="Jany-Latyn: A Latin Orthography and Comparative Testbed for the Kyrgyz Language. A design proposal, technical specification, and open testbed." />
</svelte:head>

<div class="space-y-6">
  <!-- Mobile Table of Contents Accordion -->
  <div class="collapse collapse-arrow bg-base-200 border border-base-content/10 lg:hidden">
    <input type="checkbox" />
    <div class="collapse-title text-sm font-semibold flex items-center gap-2">
      <span>📖</span>
      <span>{i18n.locale === 'en' ? 'Table of Contents' : i18n.locale === 'ru' ? 'Содержание' : i18n.locale === 'tr' ? 'İçindekiler' : 'Мазмуну'}</span>
    </div>
    <div class="collapse-content space-y-1 text-xs">
      {#each data.toc as item}
        <a
          href="#{item.id}"
          class="block py-1 hover:text-primary transition-colors {item.level === 3 ? 'pl-4 opacity-80' : 'font-semibold'}"
        >
          {item.text}
        </a>
      {/each}
    </div>
  </div>

  <div class="flex items-start gap-8">
    <!-- Desktop Sticky Sidebar Table of Contents -->
    <aside class="hidden lg:block w-72 shrink-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto p-4 rounded-xl bg-base-200/70 border border-base-content/10 space-y-3">
      <div class="font-bold text-sm uppercase tracking-wider text-base-content/70 flex items-center gap-2 border-b border-base-content/10 pb-2">
        <span>📖</span>
        <span>{i18n.locale === 'en' ? 'Table of Contents' : i18n.locale === 'ru' ? 'Содержание' : i18n.locale === 'tr' ? 'İçindekiler' : 'Мазмуну'}</span>
      </div>
      <nav class="space-y-1 text-xs leading-snug">
        {#each data.toc as item}
          <a
            href="#{item.id}"
            class="block py-1 px-1.5 rounded hover:bg-base-300 hover:text-primary transition-colors {item.level === 3 ? 'pl-4 opacity-75' : 'font-semibold'}"
          >
            {item.text}
          </a>
        {/each}
      </nav>
    </aside>

    <!-- Main Whitepaper Article -->
    <article class="flex-1 min-w-0 bg-base-100 p-6 sm:p-8 md:p-10 rounded-2xl border border-base-200 shadow-sm leading-relaxed text-base-content/90 prose-content">
      {@html data.html}
    </article>
  </div>
</div>

<style>
  :global(.prose-content p) {
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.75;
  }
  :global(.prose-content ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }
  :global(.prose-content ol) {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
  }
  :global(.prose-content li) {
    margin-top: 0.35rem;
    margin-bottom: 0.35rem;
  }
  :global(.prose-content hr) {
    border-color: var(--color-base-300, rgba(128, 128, 128, 0.2));
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
  }
  :global(.prose-content pre) {
    background-color: var(--color-base-300, rgba(0, 0, 0, 0.05));
    border: 1px solid var(--color-base-content, rgba(128, 128, 128, 0.2));
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  :global(.prose-content code) {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    background-color: var(--color-base-200, rgba(128, 128, 128, 0.1));
    padding: 0.15rem 0.35rem;
    border-radius: 0.25rem;
    font-size: 0.9em;
  }
  :global(.prose-content pre code) {
    background-color: transparent;
    padding: 0;
  }
</style>
