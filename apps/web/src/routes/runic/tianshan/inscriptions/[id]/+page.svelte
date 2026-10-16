<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import type { Claim } from '$corpus/scripts/tianshan/db.mjs';
  import { cyrToJany } from 'jany-latyn/convert';
  import { i18n } from '$lib/i18n/index.svelte';
  import TianShanMap from '$lib/tianshan/TianShanMap.svelte';
  import { BASE, citation, fill, glyphHref, inscriptionHref, localName, sourceHref } from '$lib/tianshan/format';

  let { data }: { data: PageData } = $props();
  const ts = $derived(data.ts);
  const t = $derived(i18n.t.tianshan);
  const k = $derived(ts.inscriptions.findIndex((i) => i.id === data.id));
  const ins = $derived(ts.inscriptions[k]);
  const prev = $derived(ts.inscriptions[k - 1]);
  const next = $derived(ts.inscriptions[k + 1]);
  const region = $derived(ts.regions.find((r) => r.id === ins.region)!);
  const site = $derived(ins.site ? ts.sites.find((s) => s.id === ins.site) ?? null : null);
  const tr = $derived(ts.transcribed[ins.id]);
  const about = $derived(ts.sources.filter((s) => s.about?.includes(ins.id)));
  const source = (id: string) => ts.sources.find((s) => s.id === id)!;

  // Claims by field, in the database's field order.
  const fields = $derived(
    [...new Set([...ts.fields, ...ins.claims.map((c) => c.field)])]
      .map((f) => ({ field: f, claims: ins.claims.filter((c) => c.field === f) }))
      .filter((g) => g.claims.length),
  );
  const differ = (claims: Claim[]) => new Set(claims.map((c) => c.value)).size > 1;
  const evidence = (c: Claim) => c.evidence ?? ts.defaultEvidence;
</script>

<svelte:head><title>{ins.label} — {t.title}</title></svelte:head>

<div class="breadcrumbs text-sm">
  <ul>
    <li><a href={BASE}>{t.title}</a></li>
    <li><a href="{BASE}inscriptions/">{t.tabs.inscriptions}</a></li>
    <li>{ins.label}</li>
  </ul>
</div>

<article class="grid grid-cols-1 gap-6 lg:grid-cols-3">
  <div class="space-y-6 lg:col-span-2">
    <header class="space-y-1">
      <h2 class="text-2xl font-semibold">{ins.label}</h2>
      <p class="text-base-content/70">
        {ins.names.en}{#if ins.names.ru}{' · '}{ins.names.ru}{/if}{#if ins.names.ky}{' · '}{ins.names.ky}{' · '}{cyrToJany(ins.names.ky)}{/if}{#if ins.names.tr}{' · '}{ins.names.tr}{/if}
      </p>
      <p class="font-mono text-xs text-base-content/50">{ins.id}</p>
    </header>

    <section class="space-y-2">
      <h3 class="text-lg font-semibold">{t.claimsTitle}</h3>
      <p class="text-sm text-base-content/60">{t.claimsHint}</p>
      <div class="overflow-x-auto rounded-box border border-base-300">
        <table class="table table-sm bg-base-100">
          <tbody>
            {#each fields as g}
              {#each g.claims as c, j}
                <tr class="align-top">
                  {#if j === 0}
                    <th rowspan={g.claims.length} class="w-32 whitespace-nowrap">
                      {t.fields[g.field] ?? g.field}
                      {#if differ(g.claims)}<div><span class="badge badge-xs badge-warning badge-soft">{t.conflict}</span></div>{/if}
                    </th>
                  {/if}
                  <td>
                    <div>{c.value}</div>
                    {#if c.note}<div class="text-xs italic text-base-content/60">{c.note}</div>{/if}
                  </td>
                  <td class="w-48 text-xs">
                    {#each c.sources as s, n}{#if n}{', '}{/if}<a class="link" href={sourceHref(s)} title={citation(source(s))}>{s}</a>{/each}
                    <div><span class="badge badge-xs badge-ghost">{t.evidence[evidence(c)]}</span></div>
                  </td>
                </tr>
              {/each}
            {/each}
          </tbody>
        </table>
      </div>
    </section>

    <section class="space-y-3">
      <h3 class="text-lg font-semibold">{t.transcriptionTitle}</h3>
      {#if tr}
        <p class="text-sm text-base-content/70">
          {fill(t.readFrom, { what: tr.meta.readFrom ?? '' })}
          {#each tr.meta.images as im, n}{#if n}{', '}{/if}<a class="link" href={sourceHref(im.source)}>{im.source}</a>{#if im.where}{` (${im.where})`}{/if}{/each}{#if tr.meta.by}{'; '}{tr.meta.by}{/if}{#if tr.meta.date}{', '}{tr.meta.date}{/if}.
        </p>
        {#each tr.lines as line}
          <div class="space-y-1.5 rounded-box border border-base-300 bg-base-100 p-3">
            <div class="text-xs font-medium text-base-content/60">{line.label}</div>
            <p dir="rtl" lang="otk-Orkh" class="runes text-3xl leading-relaxed">{line.runes}</p>
            <div class="flex flex-wrap gap-1 text-xs" dir="ltr">
              <span class="text-base-content/60">{t.signsLabel}:</span>
              {#each line.signs as s}
                <a class="badge badge-sm {s.formKnown ? 'badge-ghost' : 'badge-outline'}" href={glyphHref(s.glyph)} title={s.glyph}>
                  <span class="runes">{s.char}</span>{s.mirrored ? '~' : ''}{s.unclear ? '?' : ''}
                </a>
              {/each}
            </div>
            <div class="text-sm"><span class="text-base-content/60">{t.readerLabel}:</span> <code>{line.reader}</code></div>
          </div>
        {/each}
      {:else}
        <p class="text-sm text-base-content/70">{about.length ? t.noTranscription : t.noPublications}</p>
        {#if about.length}
          <ul class="space-y-1.5 text-sm">
            {#each about as s}
              <li>
                <a class="link" href={sourceHref(s.id)}>{citation(s)}</a>
                {#if s.access}<span class="badge badge-xs {s.access === 'open' ? 'badge-success badge-soft' : 'badge-ghost'}">{t.access[s.access]}</span>{/if}
              </li>
            {/each}
          </ul>
        {/if}
      {/if}
    </section>
  </div>

  <aside class="space-y-4">
    <dl class="space-y-2 rounded-box border border-base-300 bg-base-100 p-4 text-sm">
      <div><dt class="text-xs text-base-content/60">{t.region}</dt><dd>{localName(region.name, i18n.locale)} · {region.admin}</dd></div>
      <div>
        <dt class="text-xs text-base-content/60">{t.site}</dt>
        <dd>
          {site ? localName(site.name, i18n.locale) : t.siteUnknown}
          {#if site?.coords}<div class="text-xs text-base-content/60">{site.coords.lat.toFixed(4)}° N, {site.coords.lon.toFixed(4)}° E (± {site.coords.radiusKm} km). {site.basis}</div>
          {:else if site}<div class="text-xs text-base-content/60">{t.placedByRegion}</div>{/if}
          {#if site?.summary}<div class="mt-1 text-xs">{site.summary}</div>{/if}
        </dd>
      </div>
      <div><dt class="text-xs text-base-content/60">{t.object}</dt><dd>{t.objects[ins.object]}</dd></div>
      {#if ins.possiblySame?.length}
        <div>
          <dt class="text-xs text-base-content/60">{t.possiblySame}</dt>
          <dd>{#each ins.possiblySame as id, n}{#if n}{', '}{/if}<a class="link" href={inscriptionHref(id)}>{ts.inscriptions.find((i) => i.id === id)?.label ?? id}</a>{/each}</dd>
        </div>
      {/if}
    </dl>
    <TianShanMap regions={ts.regions} sites={ts.sites} inscriptions={ts.inscriptions} highlight={ins.site} compact />
    <nav class="join w-full">
      {#if prev}<a class="btn btn-sm join-item flex-1" href={inscriptionHref(prev.id)}>← {prev.label}</a>{/if}
      {#if next}<a class="btn btn-sm join-item flex-1" href={inscriptionHref(next.id)}>{next.label} →</a>{/if}
    </nav>
  </aside>
</article>
