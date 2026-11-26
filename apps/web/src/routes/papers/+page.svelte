<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { i18n } from '$lib/i18n/index.svelte';
  import type { Locale } from '$lib/i18n/types.js';
  import { readingFont } from '$lib/readingFont.svelte';
  import { onMount } from 'svelte';
  import { editionForLocale } from '$lib/paperEdition';

  let { data }: { data: PageData } = $props();

  const LABELS: Record<Locale, { read: string; abstract: string; language: string }> = {
    'ky-jany': { read: 'Okuu', abstract: 'Annotatsiía', language: 'Til' },
    ky: { read: 'Окуу', abstract: 'Аннотация', language: 'Тил' },
    ru: { read: 'Читать', abstract: 'Аннотация', language: 'Язык' },
    en: { read: 'Read', abstract: 'Abstract', language: 'Language' },
    tr: { read: 'Oku', abstract: 'Özet', language: 'Dil' },
    zh: { read: '阅读', abstract: '摘要', language: '语言' }
  };
  const labels = $derived(LABELS[i18n.locale]);
  // Each card shows, and links, the edition in the interface language. The prerendered page
  // shows the originals; the switch happens once the stored language is known.
  type IndexPaper = PageData['papers'][number];
  let mounted = $state(false);
  onMount(() => (mounted = true));
  const editionOf = (paper: IndexPaper) => (mounted ? editionForLocale(paper.editions, i18n.locale) : undefined);
  const readHref = (paper: IndexPaper) => editionOf(paper)?.href ?? `/papers/${paper.slug}/`;
  const cardOf = (paper: IndexPaper) => {
    const edition = editionOf(paper);
    return (edition && paper.cards[edition.lang]) ?? paper.cards[paper.editions[0].lang];
  };
  const heading = $derived(i18n.t.nav.papers.charAt(0).toUpperCase() + i18n.t.nav.papers.slice(1));
</script>

<svelte:head>
  <title>{heading} — {i18n.t.nav.siteTitle}</title>
  <meta name="description" content={data.papers.map((p) => cardOf(p).title).join(' · ')} />
</svelte:head>

<div class="mx-auto max-w-4xl space-y-6">
  <h1 class="text-2xl font-bold sm:text-3xl">{heading}</h1>

  {#each data.papers as paper (paper.slug)}
    {@const card = cardOf(paper)}
    <article class="rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm sm:p-8">
      <h2 lang={card.htmlLang} class="text-xl font-bold leading-snug sm:text-2xl" style:font-family={readingFont.stack}>
        <a href={readHref(paper)} class="hover:text-primary">{card.title}</a>
      </h2>
      <p lang={card.htmlLang} class="mt-2 text-base-content/75" style:font-family={readingFont.stack}>{@html card.subtitle}</p>
      <p lang={card.htmlLang} class="mt-3 text-sm text-base-content/60">{card.author} · {card.date}</p>
      {#if card.abstract}
        <details class="mt-4">
          <summary class="cursor-pointer text-sm font-semibold text-base-content/80 hover:text-primary">
            {labels.abstract}
          </summary>
          <p lang={card.htmlLang} class="mt-2 leading-relaxed text-base-content/90" style:font-family={readingFont.stack}>
            {@html card.abstract}
          </p>
        </details>
      {/if}
      <div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a href={readHref(paper)} class="btn btn-primary btn-sm">{labels.read}</a>
        {#if paper.editions.length > 1}
          <nav class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" aria-label={labels.language}>
            <span class="text-base-content/60">{labels.language}:</span>
            {#each paper.editions as edition (edition.href)}
              <a href={edition.href} lang={edition.htmlLang} hreflang={edition.htmlLang} class="hover:text-primary">{edition.name}</a>
            {/each}
          </nav>
        {/if}
      </div>
    </article>
  {/each}
</div>
