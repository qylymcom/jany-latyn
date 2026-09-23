<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { i18n } from '$lib/i18n/index.svelte';
  import type { Locale } from '$lib/i18n/types.js';
  import { readingFont } from '$lib/readingFont.svelte';
  import Icon from '$lib/components/Icon.svelte';

  let { data }: { data: PageData } = $props();

  const LABELS: Record<Locale, { toc: string; top: string }> = {
    'ky-jany': { toc: 'Mazmunu', top: 'Başyna' },
    ky: { toc: 'Мазмуну', top: 'Башына' },
    ru: { toc: 'Содержание', top: 'Наверх' },
    en: { toc: 'Table of Contents', top: 'Back to top' },
    tr: { toc: 'İçindekiler', top: 'Başa dön' },
    zh: { toc: '目录', top: '返回顶部' }
  };
  const tocTitle = $derived(LABELS[i18n.locale].toc);
  const topTitle = $derived(LABELS[i18n.locale].top);

  // The sidebar is desktop-only and the accordion sits at the top of the page, so on a
  // phone the contents are unreachable once you are reading. These float alongside.
  // One-way: `bind:scrollY` would write the old position back mid-animation and
  // cancel the smooth scroll of the top button.
  let scrollPos = $state(0);
  let showToc = $state(false);
  const showTop = $derived(scrollPos > 400);

  function toTop() {
    showToc = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }
</script>

<svelte:window
  onscroll={() => (scrollPos = window.scrollY)}
  onkeydown={(e) => e.key === 'Escape' && (showToc = false)}
/>

<svelte:head>
  <title>{i18n.t.nav.whitepaper.toUpperCase()} — {i18n.t.nav.siteTitle}</title>
  <meta name="description" content="Jany-Latyn: A Latin Orthography and Comparative Testbed for the Kyrgyz Language. A design proposal, reference implementation, and open testbed." />
</svelte:head>

<div class="space-y-6">
  <!-- Mobile Table of Contents Accordion -->
  <div class="collapse collapse-arrow bg-base-200 border border-base-content/10 lg:hidden">
    <input type="checkbox" />
    <div class="collapse-title text-sm font-semibold flex items-center gap-2">
      <span>📖</span>
      <span>{tocTitle}</span>
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
        <span>{tocTitle}</span>
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
    <article
      class="flex-1 min-w-0 bg-base-100 p-6 sm:p-8 md:p-10 rounded-2xl border border-base-200 shadow-sm leading-relaxed text-base-content/90 prose-content"
      style:font-family={readingFont.stack}
    >
      {@html data.html}
    </article>
  </div>
</div>

<!-- Floating contents panel (mobile and tablet; desktop keeps the sidebar) -->
{#if showToc}
  <button
    type="button"
    class="fixed inset-0 z-40 cursor-default bg-base-300/40 lg:hidden"
    aria-label={tocTitle}
    onclick={() => (showToc = false)}
  ></button>
  <nav
    id="floating-toc"
    class="fixed bottom-32 right-4 z-50 max-h-[60vh] w-72 max-w-[calc(100vw-2rem)] space-y-1 overflow-y-auto rounded-box border border-base-300 bg-base-100 p-3 text-xs shadow-xl lg:hidden"
    aria-label={tocTitle}
  >
    <div class="mb-1 border-b border-base-content/10 pb-2 text-sm font-semibold">{tocTitle}</div>
    {#each data.toc as item}
      <a
        href="#{item.id}"
        class="block rounded px-1.5 py-1 hover:bg-base-300 hover:text-primary {item.level === 3
          ? 'pl-4 opacity-80'
          : 'font-semibold'}"
        onclick={() => (showToc = false)}
      >
        {item.text}
      </a>
    {/each}
  </nav>
{/if}

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 print:hidden">
  {#if showTop}
    <button
      type="button"
      class="btn btn-circle border border-base-300 bg-base-100 shadow-lg"
      onclick={toTop}
      title={topTitle}
      aria-label={topTitle}
    >
      <Icon name="arrowUp" size={20} />
    </button>
  {/if}
  <button
    type="button"
    class="btn btn-circle border-base-300 shadow-lg lg:hidden {showToc ? 'btn-primary' : 'border bg-base-100'}"
    onclick={() => (showToc = !showToc)}
    title={tocTitle}
    aria-label={tocTitle}
    aria-expanded={showToc}
    aria-controls="floating-toc"
  >
    <Icon name="list" size={20} />
  </button>
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
  /* daisyUI sets thead to nowrap, which makes a long header widen its column past
     anything the cells need. Long-form tables read better with headers that wrap. */
  :global(.prose-content thead th) {
    white-space: normal;
    overflow-wrap: normal;
  }
  /* Bare reference URLs and file paths are unbreakable words; without this they
     push the whole page sideways on a phone. */
  :global(.prose-content) {
    overflow-wrap: anywhere;
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
