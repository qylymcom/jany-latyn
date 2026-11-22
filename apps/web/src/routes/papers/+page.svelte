<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { i18n } from '$lib/i18n/index.svelte';
  import type { Locale } from '$lib/i18n/types.js';
  import { readingFont } from '$lib/readingFont.svelte';

  let { data }: { data: PageData } = $props();

  const LABELS: Record<Locale, { read: string; abstract: string }> = {
    'ky-jany': { read: 'Okuu', abstract: 'Annotatsiía' },
    ky: { read: 'Окуу', abstract: 'Аннотация' },
    ru: { read: 'Читать', abstract: 'Аннотация' },
    en: { read: 'Read', abstract: 'Abstract' },
    tr: { read: 'Oku', abstract: 'Özet' },
    zh: { read: '阅读', abstract: '摘要' }
  };
  const labels = $derived(LABELS[i18n.locale]);
  const heading = $derived(i18n.t.nav.papers.charAt(0).toUpperCase() + i18n.t.nav.papers.slice(1));
</script>

<svelte:head>
  <title>{heading} — {i18n.t.nav.siteTitle}</title>
  <meta name="description" content={data.papers.map((p) => p.title).join(' · ')} />
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
  <h1 class="text-2xl font-bold sm:text-3xl">{heading}</h1>

  {#each data.papers as paper (paper.slug)}
    <article class="rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm sm:p-8">
      <h2 class="text-xl font-bold leading-snug sm:text-2xl" style:font-family={readingFont.stack}>
        <a href="/papers/{paper.slug}/" class="hover:text-primary">{paper.title}</a>
      </h2>
      <p class="mt-2 text-base-content/75" style:font-family={readingFont.stack}>{@html paper.subtitle}</p>
      <p class="mt-3 text-sm text-base-content/60">{paper.author} · {paper.date}</p>
      {#if paper.abstract}
        <details class="mt-4">
          <summary class="cursor-pointer text-sm font-semibold text-base-content/80 hover:text-primary">
            {labels.abstract}
          </summary>
          <p class="mt-2 leading-relaxed text-base-content/90" style:font-family={readingFont.stack}>
            {@html paper.abstract}
          </p>
        </details>
      {/if}
      <div class="mt-5">
        <a href="/papers/{paper.slug}/" class="btn btn-primary btn-sm">{labels.read}</a>
      </div>
    </article>
  {/each}
</div>
