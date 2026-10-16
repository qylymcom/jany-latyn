<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { i18n } from '$lib/i18n/index.svelte';
  import TianShanMap from '$lib/tianshan/TianShanMap.svelte';
  import { inscriptionHref, localName } from '$lib/tianshan/format';

  let { data }: { data: PageData } = $props();
  const ts = $derived(data.ts);
  const t = $derived(i18n.t.tianshan);
  const unplaced = $derived(
    ts.regions
      .map((r) => ({ region: r, sites: ts.sites.filter((s) => s.region === r.id && !s.coords) }))
      .filter((g) => g.sites.length),
  );
  const noSite = $derived(ts.inscriptions.filter((i) => i.site === null));
</script>

<svelte:head><title>{t.tabs.map} — {t.title}</title></svelte:head>

<p class="max-w-3xl text-sm text-base-content/70">{t.mapHint}</p>
<TianShanMap regions={ts.regions} sites={ts.sites} inscriptions={ts.inscriptions} />

<section class="space-y-3">
  <h2 class="text-lg font-semibold">{t.unplacedTitle}</h2>
  <div class="grid gap-3 md:grid-cols-2">
    {#each unplaced as g}
      <div class="rounded-box border border-base-300 bg-base-100 p-4">
        <h3 class="font-medium">{localName(g.region.name, i18n.locale)}</h3>
        <ul class="mt-2 space-y-2 text-sm">
          {#each g.sites as s}
            <li>
              <span class="font-medium">{localName(s.name, i18n.locale)}</span>
              {#if s.summary}<span class="text-base-content/70"> — {s.summary}</span>{/if}
              <div>
                {#each ts.inscriptions.filter((i) => i.site === s.id) as ins, n}{#if n}{', '}{/if}<a class="link" href={inscriptionHref(ins.id)}>{ins.label}</a>{/each}
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
    {#if noSite.length}
      <div class="rounded-box border border-base-300 bg-base-100 p-4 text-sm">
        <h3 class="font-medium">{t.siteUnknown}</h3>
        <p class="mt-2">{#each noSite as ins, n}{#if n}{', '}{/if}<a class="link" href={inscriptionHref(ins.id)}>{ins.label}</a>{/each}</p>
      </div>
    {/if}
  </div>
</section>
