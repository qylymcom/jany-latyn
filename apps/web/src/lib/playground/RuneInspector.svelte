<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { WordExplanation } from 'jany-latyn/runes';
  import { i18n } from '$lib/i18n/index.svelte';
  import { RUNE_FONT } from '$lib/runes';
  import Icon from '$lib/components/Icon.svelte';

  let { word, onClose }: { word: WordExplanation | undefined; onClose: () => void } = $props();
  const t = $derived(i18n.t.scripts);
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && onClose()} />

<section class="rounded-box border border-primary/40 bg-base-100 p-3 sm:p-4" aria-label={t.inspectorTitle}>
  <div class="flex items-center gap-3">
    <h2 class="text-base font-semibold">{t.inspectorTitle}</h2>
    {#if word}
      <span class="text-sm text-base-content/70">{word.source} · {word.janyLatyn} ·
        <bdi class="runes text-lg" style:font-family={RUNE_FONT}>{word.runes}</bdi></span>
    {/if}
    <button type="button" class="btn btn-ghost btn-xs btn-square ml-auto" onclick={onClose} aria-label={t.close} title={t.close}>
      <Icon name="x" size={14} />
    </button>
  </div>
  {#if word}
    <div class="mt-2 overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr><th>{t.inspectorLetter}</th><th>{t.inspectorRune}</th><th>{t.inspectorName}</th><th>{t.inspectorWhy}</th></tr>
        </thead>
        <tbody>
          {#each word.letters as l}
            <tr>
              <td class="font-mono">{l.letter}</td>
              <td class="text-xl" style:font-family={RUNE_FONT}><bdi>{l.rune}</bdi></td>
              <td class="text-xs">{l.names.join(' + ')}</td>
              <td class="text-xs">
                {#if l.dropped}<span class="badge badge-xs">{t.dropped}</span>
                {:else if l.ligature}<span class="badge badge-xs badge-info">{t.ligature}</span>{/if}
                {#if l.kind === 'consonant'}
                  {l.series === 'front' ? t.seriesFront : t.seriesBack},
                  {l.governor === null ? t.noVowel : t.governedBy.replace('{vowel}', word.letters[l.governor].letter)}
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <p class="mt-1 text-sm text-base-content/60">{t.inspectorHint}</p>
  {/if}
</section>
