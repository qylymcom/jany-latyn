<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { rune, letterForm, TIANSHAN_FORMS, type RuneName, type TianShanFormKey } from 'jany-latyn/runes';
  import { i18n } from '$lib/i18n/index.svelte';
  import { fill } from '$lib/tianshan/format';

  let { data }: { data: PageData } = $props();
  const ts = $derived(data.ts);
  const t = $derived(i18n.t.tianshan);
  const hex = (r: string) => `U+${r.codePointAt(0)!.toString(16).toUpperCase()}`;
  const charOf = (u: string | null, nearest?: string) => rune((u ?? nearest) as RuneName);
  const tally = (n?: { signs: number; inscriptions: string[] }) => (n ? `${n.inscriptions.length} (${n.signs})` : '—');
</script>

<svelte:head><title>{t.tabs.signs} — {t.title}</title></svelte:head>

<p class="max-w-3xl text-sm text-base-content/70">{t.signsHint}</p>

<div class="overflow-x-auto rounded-box border border-base-300">
  <table class="table table-sm bg-base-100">
    <thead>
      <tr>
        <th>{t.colGrapheme}</th><th>{t.colValue}</th><th>{t.colSymbol}</th><th>{t.colKind}</th><th>{t.colPhonemes}</th>
        <th>{t.colGlyphs}</th><th>{t.colAttested}</th><th>{t.colTianshan}</th><th>{t.colYenisei}</th>
      </tr>
    </thead>
    <tbody>
      {#each ts.graphemes as g (g.id)}
        {@const key = g.engineKey as TianShanFormKey | undefined}
        {@const form = key ? TIANSHAN_FORMS[key] : undefined}
        <tr id="grapheme-{g.id}" class="align-top">
          <td class="font-mono">{g.id}</td>
          <td class="font-medium">{g.value}</td>
          <td>{g.symbol}</td>
          <td class="text-xs">{t.kinds[g.kind]}{#if g.series}{`, ${g.series === 'back' ? t.back : t.front}`}{/if}</td>
          <td>{g.phonemes.join(', ')}</td>
          <td>
            <ul class="space-y-1">
              {#each g.glyphs as gl}
                <li id="glyph-{gl.id}" class="flex items-center gap-2 scroll-mt-24">
                  <span class="runes w-8 text-center text-2xl">{charOf(gl.unicode, gl.nearest)}</span>
                  <span class="font-mono text-xs">{gl.id}</span>
                  <span class="text-xs text-base-content/60">{gl.unicode ? `${gl.unicode} ${hex(charOf(gl.unicode))}` : gl.description}</span>
                  <span class="badge badge-xs badge-ghost">{tally(ts.attestation.glyphs[gl.id])}</span>
                </li>
              {/each}
            </ul>
          </td>
          <td class="tabular-nums">{tally(ts.attestation.graphemes[g.id])}</td>
          <td>
            {#if key}
              <span class="runes text-2xl">{letterForm(key, 'tianshan') ?? '—'}</span>
              {#if !form}<div class="text-xs text-base-content/50">{t.yeniseiStandIn}</div>{/if}
              <div class="font-mono text-[10px] text-base-content/50">{key}</div>
            {:else}—{/if}
          </td>
          <td>{#if key}<span class="runes text-2xl">{letterForm(key, 'yenisei') ?? '—'}</span>{:else}—{/if}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
<p class="text-xs text-base-content/50">{fill(t.formsText, { n: Object.keys(ts.transcribed).length })}</p>
