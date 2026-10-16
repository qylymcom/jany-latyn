<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import type { Source } from '$corpus/scripts/tianshan/db.mjs';
  import { i18n } from '$lib/i18n/index.svelte';
  import { citation, inscriptionHref, localName, sourceGroup, sourceHref } from '$lib/tianshan/format';

  let { data }: { data: PageData } = $props();
  const ts = $derived(data.ts);
  const t = $derived(i18n.t.tianshan);
  const GROUPS = ['publications', 'web', 'places', 'brief'] as const;
  const STATUS = { unconfirmed: 'badge-ghost', conflicts: 'badge-warning', supported: 'badge-success' } as const;

  const citedBy = (id: string) => ts.inscriptions.filter((i) => i.claims.some((c) => c.sources.includes(id)));
  const aboutLink = (a: string) => {
    const ins = ts.inscriptions.find((i) => i.id === a);
    if (ins) return { href: inscriptionHref(ins.id), label: ins.label };
    const r = ts.regions.find((x) => x.id === a);
    if (r) return { href: `../inscriptions/?region=${r.id}`, label: localName(r.name, i18n.locale) };
    return { href: a === 'signs' ? '../signs/' : a === 'places' ? '../map/' : '#leads', label: a };
  };
  const byGroup = (g: (typeof GROUPS)[number]) =>
    ts.sources.filter((s) => sourceGroup(s) === g).sort((a, b) => (a.year ?? 0) - (b.year ?? 0) || a.id.localeCompare(b.id));
  const ACCESS_BADGE: Record<NonNullable<Source['access']>, string> = {
    open: 'badge-success badge-soft', abstract: 'badge-info badge-soft', print: 'badge-ghost', web: 'badge-ghost',
  };
</script>

<svelte:head><title>{t.tabs.sources} — {t.title}</title></svelte:head>

<p class="max-w-3xl text-sm text-base-content/70">{t.sourcesHint}</p>

{#each GROUPS as g}
  {@const list = byGroup(g)}
  {#if list.length}
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">{t.sourceGroups[g]} <span class="text-sm font-normal text-base-content/50">({list.length})</span></h2>
      <ul class="space-y-2">
        {#each list as s (s.id)}
          {@const cites = citedBy(s.id)}
          <li id={s.id} class="scroll-mt-24 rounded-box border border-base-300 bg-base-100 p-3 text-sm target:border-primary">
            <div class="flex flex-wrap items-start gap-2">
              <a class="font-mono text-xs text-base-content/50" href={sourceHref(s.id)}>{s.id}</a>
              {#if s.access}<span class="badge badge-xs {ACCESS_BADGE[s.access]}">{t.access[s.access]}</span>{/if}
              <span class="badge badge-xs badge-ghost">{t.consulted}: {t.evidence[s.consulted]}</span>
              <span class="ml-auto flex gap-2">
                {#if s.url}<a class="link text-xs" href={s.url} rel="noopener noreferrer" target="_blank">↗ {new URL(s.url).hostname}</a>{/if}
                {#if s.download && s.download !== s.url}<a class="link text-xs" href={s.download} rel="noopener noreferrer" target="_blank">{t.download}</a>{/if}
              </span>
            </div>
            <p class="mt-1">{citation(s)}</p>
            {#if s.notes}<p class="mt-1 text-xs text-base-content/60">{s.notes}</p>{/if}
            {#if s.about?.length}
              <p class="mt-1 text-xs"><span class="text-base-content/60">{t.about}:</span>
                {#each s.about as a, n}{@const l = aboutLink(a)}{#if n}{', '}{/if}<a class="link" href={l.href}>{l.label}</a>{/each}
              </p>
            {/if}
            {#if cites.length}
              <p class="mt-0.5 text-xs"><span class="text-base-content/60">{t.citedBy}:</span>
                {#each cites as i, n}{#if n}{', '}{/if}<a class="link" href={inscriptionHref(i.id)}>{i.label}</a>{/each}
              </p>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/if}
{/each}

<section id="leads" class="space-y-2">
  <h2 class="text-lg font-semibold">{t.leadsTitle}</h2>
  <p class="max-w-3xl text-sm text-base-content/70">{t.leadsHint}</p>
  <div class="overflow-x-auto rounded-box border border-base-300">
    <table class="table table-sm bg-base-100">
      <tbody>
        {#each ts.leads as l}
          <tr class="align-top">
            <td><span class="badge badge-sm {STATUS[l.status]}">{t.leadStatus[l.status]}</span></td>
            <td class="min-w-64">{l.claim}</td>
            <td class="min-w-64 text-base-content/70">{l.note}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</section>
