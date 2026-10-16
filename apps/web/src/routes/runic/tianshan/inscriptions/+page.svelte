<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import { i18n } from '$lib/i18n/index.svelte';
  import { count, fill, foundYears, inscriptionHref, localName } from '$lib/tianshan/format';

  let { data }: { data: PageData } = $props();
  const ts = $derived(data.ts);
  const t = $derived(i18n.t.tianshan);

  let region = $state('');
  let object = $state('');
  let query = $state('');
  // Prerendered pages cannot read the query string on the server; the region link from the overview is applied here.
  onMount(() => {
    const r = new URLSearchParams(location.search).get('region');
    if (r && ts.regions.some((x) => x.id === r)) region = r;
  });

  const objects = $derived([...new Set(ts.inscriptions.map((i) => i.object))]);
  const rows = $derived(
    ts.inscriptions.filter((i) => {
      if (region && i.region !== region) return false;
      if (object && i.object !== object) return false;
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return [i.label, ...Object.values(i.names), ...i.claims.map((c) => c.value)].some((s) => s.toLowerCase().includes(q));
    }),
  );
  const siteName = (id: string | null) => {
    const s = id ? ts.sites.find((x) => x.id === id) : null;
    return s ? localName(s.name, i18n.locale) : t.siteUnknown;
  };
  const regionName = (id: string) => localName(ts.regions.find((r) => r.id === id)!.name, i18n.locale);
</script>

<svelte:head><title>{t.tabs.inscriptions} — {t.title}</title></svelte:head>

<div class="flex flex-wrap items-end gap-3">
  <label class="form-control">
    <span class="label-text text-xs">{t.filterRegion}</span>
    <select class="select select-sm" bind:value={region}>
      <option value="">{t.filterAll}</option>
      {#each ts.regions as r}<option value={r.id}>{localName(r.name, i18n.locale)}</option>{/each}
    </select>
  </label>
  <label class="form-control">
    <span class="label-text text-xs">{t.filterObject}</span>
    <select class="select select-sm" bind:value={object}>
      <option value="">{t.filterAll}</option>
      {#each objects as o}<option value={o}>{t.objects[o]}</option>{/each}
    </select>
  </label>
  <label class="form-control grow sm:grow-0">
    <span class="label-text text-xs">{t.search}</span>
    <input type="search" class="input input-sm w-full sm:w-64" bind:value={query} />
  </label>
  <span class="ml-auto text-sm text-base-content/60">{fill(t.shown, { n: rows.length, total: ts.inscriptions.length })}</span>
</div>

<div class="overflow-x-auto rounded-box border border-base-300">
  <table class="table table-sm table-zebra bg-base-100">
    <thead>
      <tr>
        <th>{t.colInscription}</th><th>{t.colRegion}</th><th>{t.colSite}</th><th>{t.colObject}</th>
        <th>{t.colFound}</th><th class="text-right">{t.colClaims}</th><th>{t.colTranscription}</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as i (i.id)}
        {@const tr = ts.transcribed[i.id]}
        <tr>
          <td>
            <a class="link font-medium" href={inscriptionHref(i.id)}>{i.label}</a>
            {#if i.names.ru}<div class="text-xs text-base-content/60">{i.names.ru}</div>{/if}
            {#if i.possiblySame?.length}<span class="badge badge-xs badge-warning badge-soft">{t.maybeDuplicate}</span>{/if}
          </td>
          <td>{regionName(i.region)}</td>
          <td>{siteName(i.site)}</td>
          <td>{t.objects[i.object]}</td>
          <td class="whitespace-nowrap">{foundYears(i).join(' / ') || '—'}</td>
          <td class="text-right tabular-nums">{i.claims.length}</td>
          <td>{tr ? count(t.linesCount, tr.lines.length) : t.notYet}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
