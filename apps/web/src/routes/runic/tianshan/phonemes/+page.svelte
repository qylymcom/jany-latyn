<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { readInscription, rune, type RuneName } from 'jany-latyn/runes';
  import { i18n } from '$lib/i18n/index.svelte';

  let { data }: { data: PageData } = $props();
  const ts = $derived(data.ts);
  const t = $derived(i18n.t.tianshan);
  const first = (g: (typeof ts.graphemes)[number]) => rune((g.glyphs[0].unicode ?? g.glyphs[0].nearest) as RuneName);
  const writers = (p: string) => ts.graphemes.filter((g) => g.phonemes.includes(p));
  const tally = (id: string) => ts.attestation.graphemes[id]?.signs ?? 0;
</script>

<svelte:head><title>{t.tabs.phonemes} — {t.title}</title></svelte:head>

<p class="max-w-3xl text-sm text-base-content/70">{t.phonemesHint}</p>

<div class="overflow-x-auto rounded-box border border-base-300">
  <table class="table table-sm table-zebra bg-base-100">
    <thead>
      <tr><th>{t.colPhoneme}</th><th>{t.colIpa}</th><th>{t.colFeatures}</th><th>{t.colWrittenBy}</th><th>{t.colModern}</th></tr>
    </thead>
    <tbody>
      {#each ts.phonemes as p (p.id)}
        <tr id="phoneme-{p.id}" class="align-top">
          <td class="text-lg font-medium">{p.id}</td>
          <td>/{p.ipa}/</td>
          <td class="text-xs">{t.kinds[p.kind]}{#if p.series}{`, ${p.series === 'back' ? t.back : t.front}`}{/if}{`; ${p.features}`}</td>
          <td>
            <div class="flex flex-wrap gap-1.5">
              {#each writers(p.id) as g}
                <a class="badge badge-ghost gap-1" href="../signs/#grapheme-{g.id}" title="{g.value} ({g.symbol}): {tally(g.id)}">
                  <span class="runes text-base">{first(g)}</span><span class="text-xs">{g.value}</span>
                </a>
              {/each}
            </div>
          </td>
          <td class="whitespace-nowrap">
            {#each writers(p.id) as g, n}{#if n}<span class="text-base-content/40"> · </span>{/if}{readInscription(first(g), 'cyrillic')} <span class="text-base-content/60">{readInscription(first(g), 'jany-latyn')}</span>{/each}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<p class="text-xs text-base-content/60">{t.modernHint}</p>
