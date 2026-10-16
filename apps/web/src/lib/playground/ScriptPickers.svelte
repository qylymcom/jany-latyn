<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { TargetScript } from 'jany-latyn/scripts';
  import { i18n } from '$lib/i18n/index.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import type { Playground, SourceChoice } from './state.svelte';

  let { pg }: { pg: Playground } = $props();

  const t = $derived(i18n.t.scripts);
  const name = (s: string) => ({ cyrillic: t.cyrillic, latin: t.latin, runes: t.runes, ascii: t.ascii, reading: t.reading })[s] ?? s;
  const autoLabel = $derived(
    pg.detected.script === 'cyrillic' || pg.detected.script === 'latin' || pg.detected.script === 'runes'
      ? t.autoDetected.replace('{script}', name(pg.detected.script))
      : t.auto,
  );
  const TARGETS: TargetScript[] = ['cyrillic', 'latin', 'ascii', 'runes', 'reading'];
  const disabled = (s: TargetScript) => (pg.oldSpelling ? s !== 'reading' : s === 'reading' && pg.from !== 'runes');
</script>

<div class="flex flex-wrap items-center gap-2">
  <label class="flex items-center gap-2 text-sm">
    <span class="text-base-content/70">{t.source}</span>
    <select
      class="select select-sm w-auto"
      value={pg.source}
      onchange={(e) => (pg.source = e.currentTarget.value as SourceChoice)}
    >
      <option value="auto">{autoLabel}</option>
      <option value="cyrillic">{t.cyrillic}</option>
      <option value="latin">{t.latin}</option>
      <option value="runes">{t.runes}</option>
    </select>
  </label>

  <button
    type="button"
    class="btn btn-ghost btn-sm btn-square"
    disabled={!pg.canSwap}
    title={pg.canSwap ? t.swap : t.swapOneWay}
    aria-label={t.swap}
    onclick={() => pg.swap()}
  >
    <Icon name="swap" />
  </button>

  <label class="flex items-center gap-2 text-sm">
    <span class="text-base-content/70">{t.target}</span>
    <select
      class="select select-sm w-auto"
      value={pg.to}
      onchange={(e) => (pg.target = e.currentTarget.value as TargetScript)}
    >
      {#each TARGETS as s}
        <option value={s} disabled={disabled(s)}>{name(s)}</option>
      {/each}
    </select>
  </label>

  {#if pg.guessing}
    <span class="text-xs text-warning">{t.guessing}</span>
  {/if}
</div>
{#if pg.oldSpelling}
  <p class="mt-2 flex gap-1.5 text-sm text-base-content/70"><Icon name="info" size={16} class="mt-0.5 text-info" /><span>{t.oldSpelling}</span></p>
{/if}
