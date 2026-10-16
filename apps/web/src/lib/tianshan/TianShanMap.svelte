<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { Region, Site, Inscription } from '$corpus/scripts/tianshan/db.mjs';
  import { i18n } from '$lib/i18n/index.svelte';
  import { FRAME, BORDER, LAKES, RIVERS } from './basemap';
  import { project, kmToSvg } from './geo';
  import { inscriptionHref, localName } from './format';

  let {
    regions,
    sites,
    inscriptions,
    highlight = null,
    compact = false,
  }: { regions: Region[]; sites: Site[]; inscriptions: Inscription[]; highlight?: string | null; compact?: boolean } = $props();

  const t = $derived(i18n.t.tianshan);
  // Sites that share a place are drawn once, with all their inscriptions.
  const placed = $derived.by(() => {
    const groups = new Map<string, { x: number; y: number; r: number; sites: Site[] }>();
    for (const s of sites) {
      if (!s.coords) continue;
      const key = `${s.coords.lat},${s.coords.lon}`;
      const [x, y] = project(s.coords.lat, s.coords.lon);
      const g = groups.get(key) ?? { x, y, r: 0, sites: [] };
      g.r = Math.max(g.r, kmToSvg(s.coords.radiusKm));
      g.sites.push(s);
      groups.set(key, g);
    }
    return [...groups.values()];
  });
  const areas = $derived(
    regions.filter((r) => r.area).map((r) => {
      const [x, y] = project(r.area!.lat, r.area!.lon);
      return { region: r, x, y, r: kmToSvg(r.area!.radiusKm) };
    }),
  );
  const at = (s: Site) => inscriptions.filter((i) => i.site === s.id);
  let selected = $state<number | null>(null);
</script>

<figure class="space-y-2">
  <div class="relative overflow-hidden rounded-box border border-base-300 bg-base-200/40">
    <svg viewBox="0 0 {FRAME.width} {FRAME.height}" class="block h-auto w-full" role="img" aria-label={t.tabs.map}>
      <path d={BORDER} class="fill-base-100 stroke-base-content/40" stroke-width="1.2" />
      {#each RIVERS as d}<path {d} class="fill-none stroke-info/50" stroke-width="1.2" />{/each}
      {#each LAKES as d}<path {d} class="fill-info/30 stroke-info/50" stroke-width="0.8" />{/each}
      {#each areas as a}
        <circle cx={a.x} cy={a.y} r={a.r} class="fill-primary/5 stroke-primary/50" stroke-width="1.5" stroke-dasharray="6 5" />
        {#if !compact}
          <text x={a.x} y={a.y - a.r - 6} text-anchor="middle" class="fill-base-content/70 text-[15px]">{localName(a.region.name, i18n.locale)}</text>
        {/if}
      {/each}
      {#each placed as p, k}
        {@const hit = highlight !== null && p.sites.some((s) => s.id === highlight)}
        <g
          role="button"
          tabindex="0"
          aria-label={p.sites.map((s) => localName(s.name, i18n.locale)).join('; ')}
          class="cursor-pointer outline-none"
          onclick={() => (selected = selected === k ? null : k)}
          onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (selected = selected === k ? null : k)}
        >
          <circle cx={p.x} cy={p.y} r={Math.max(p.r, 6)} class={hit ? 'fill-secondary/25 stroke-secondary' : 'fill-accent/20 stroke-accent'} stroke-width="1.5" />
          <circle cx={p.x} cy={p.y} r="4.5" class={hit ? 'fill-secondary' : 'fill-accent'} />
          {#if !compact}
            <text x={p.x + Math.max(p.r, 6) + 4} y={p.y + 5} class="fill-base-content text-[15px] font-medium">{p.sites.map((s) => localName(s.name, i18n.locale).split(/[,(]/)[0].trim()).join(' · ')}</text>
          {/if}
        </g>
      {/each}
    </svg>
    {#if selected !== null && placed[selected]}
      {@const p = placed[selected]}
      <div class="absolute bottom-2 left-2 right-2 max-h-[60%] overflow-auto rounded-box border border-base-300 bg-base-100 p-3 text-sm shadow sm:left-auto sm:w-80">
        <button type="button" class="btn btn-ghost btn-xs float-right" onclick={() => (selected = null)} aria-label={i18n.t.scripts.close}>✕</button>
        {#each p.sites as s}
          <p class="font-medium">{localName(s.name, i18n.locale)}</p>
          {#if s.basis}<p class="text-xs text-base-content/60">{s.basis}</p>{/if}
          <ul class="my-1 list-inside list-disc">
            {#each at(s) as ins}<li><a class="link" href={inscriptionHref(ins.id)}>{ins.label}</a></li>{/each}
          </ul>
        {/each}
      </div>
    {/if}
  </div>
  {#if !compact}
    <figcaption class="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-base-content/60">
      <span class="flex items-center gap-1.5"><svg width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="6" class="fill-accent/20 stroke-accent" /><circle cx="8" cy="8" r="2.5" class="fill-accent" /></svg>{t.legendSite}</span>
      <span class="flex items-center gap-1.5"><svg width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="6" class="fill-primary/5 stroke-primary/50" stroke-dasharray="3 2" /></svg>{t.legendRegion}</span>
      <span class="ml-auto">{t.mapCredit}</span>
    </figcaption>
  {/if}
</figure>
