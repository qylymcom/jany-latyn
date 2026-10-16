<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { TIANSHAN_TRANSCRIBED } from 'jany-latyn/runes';
  import { i18n } from '$lib/i18n/index.svelte';
  import TianShanMap from '$lib/tianshan/TianShanMap.svelte';
  import { BASE, count, fill, localName, sourceHref } from '$lib/tianshan/format';

  let { data }: { data: PageData } = $props();
  const ts = $derived(data.ts);
  const t = $derived(i18n.t.tianshan);
  const lines = $derived(Object.values(ts.transcribed).reduce((n, x) => n + x.lines.length, 0));
  const signs = $derived(Object.values(ts.transcribed).reduce((n, x) => n + x.lines.reduce((m, l) => m + l.signs.length, 0), 0));
  const open = $derived(ts.sources.filter((s) => s.access === 'open').length);
  const regionName = (id: string) => localName(ts.regions.find((r) => r.id === id)!.name, i18n.locale);
</script>

<svelte:head><title>{t.title} — {i18n.t.nav.siteTitle}</title></svelte:head>

<section class="stats stats-vertical w-full border border-base-300 bg-base-100 sm:stats-horizontal">
  <div class="stat">
    <div class="stat-title">{t.statInscriptions}</div>
    <div class="stat-value">{ts.inscriptions.length}</div>
    <div class="stat-desc">{count(t.statSites, ts.sites.length)}</div>
  </div>
  <div class="stat">
    <div class="stat-title">{t.statRegions}</div>
    <div class="stat-value">{ts.regions.length}</div>
  </div>
  <div class="stat">
    <div class="stat-title">{t.statSources}</div>
    <div class="stat-value">{ts.sources.length}</div>
    <div class="stat-desc">{fill(t.statOpen, { n: open })}</div>
  </div>
  <div class="stat">
    <div class="stat-title">{t.statTranscribed}</div>
    <div class="stat-value">{Object.keys(ts.transcribed).length}</div>
    <div class="stat-desc">{fill(t.statLinesSigns, { lines, signs })}</div>
  </div>
</section>

<section class="grid grid-cols-1 gap-5 lg:grid-cols-5">
  <div class="space-y-3 lg:col-span-3">
    <TianShanMap regions={ts.regions} sites={ts.sites} inscriptions={ts.inscriptions} />
  </div>
  <div class="space-y-3 lg:col-span-2">
    <h2 class="text-lg font-semibold">{t.regionsTitle}</h2>
    {#each ts.regions as r}
      {@const n = ts.inscriptions.filter((i) => i.region === r.id).length}
      <a href="{BASE}inscriptions/?region={r.id}" class="card card-sm border border-base-300 bg-base-100 transition-colors hover:border-primary">
        <div class="card-body">
          <h3 class="card-title text-base">{localName(r.name, i18n.locale)} <span class="badge badge-sm badge-ghost">{count(t.regionRecords, n)}</span></h3>
          <p class="text-sm text-base-content/70">{r.summary}</p>
          <p class="text-xs text-base-content/50">{r.admin}</p>
        </div>
      </a>
    {/each}
  </div>
</section>

<section class="space-y-2">
  <h2 class="text-lg font-semibold">{t.countsTitle}</h2>
  <p class="max-w-3xl text-sm text-base-content/70">{t.countsHint}</p>
  <div class="overflow-x-auto rounded-box border border-base-300">
    <table class="table table-sm bg-base-100">
      <thead>
        <tr><th>{t.countsSource}</th><th>{t.countsUpTo}</th><th>{t.countsTotal}</th><th>{t.countsByRegion}</th><th>{t.countsScope}</th></tr>
      </thead>
      <tbody>
        {#each ts.counts as c}
          <tr>
            <td class="whitespace-nowrap"><a class="link" href={sourceHref(c.source)}>{c.source}</a>{#if c.via}<span class="text-base-content/50">{' via '}<a class="link" href={sourceHref(c.via)}>{c.via}</a></span>{/if}</td>
            <td>{c.upTo ?? '—'}</td>
            <td class="font-semibold">{c.total ?? '—'}</td>
            <td>{Object.entries(c.regions ?? {}).map(([k, v]) => `${regionName(k)}: ${v}`).join('; ') || '—'}</td>
            <td class="min-w-64 text-base-content/70">{c.scope}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>

<section class="card max-w-3xl border border-base-300 bg-base-100">
  <div class="card-body">
    <h2 class="card-title text-lg">{t.formsTitle}</h2>
    <p class="text-sm">{fill(t.formsText, { n: TIANSHAN_TRANSCRIBED })}</p>
    <div class="card-actions"><a class="btn btn-sm btn-primary" href="/">{t.tryIt}</a></div>
  </div>
</section>
