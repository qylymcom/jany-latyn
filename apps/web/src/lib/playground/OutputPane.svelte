<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { ReaderTarget } from 'jany-latyn/runes';
  import { i18n } from '$lib/i18n/index.svelte';
  import { RUNE_FONT, RUNE_WORD, forLtrDocuments } from '$lib/runes';
  import Icon from '$lib/components/Icon.svelte';
  import type { Playground } from './state.svelte';

  let {
    pg,
    font,
    copied,
    hasVoted,
    inspected,
    onCopy,
    onDownload,
    onVote,
    onInspect,
  }: {
    pg: Playground;
    font: string;
    copied: string | null;
    hasVoted: boolean;
    inspected: number | null;
    onCopy: (which: string, text: string) => void;
    onDownload: () => void;
    onVote: () => void;
    onInspect: (index: number) => void;
  } = $props();

  const runes = $derived(pg.to === 'runes');
  // Reading output is Latin or Cyrillic letters and reads left to right.
  const rtl = $derived(runes);
  const outFont = $derived(runes ? RUNE_FONT : font);

  // Output split into rune words (odd indices) and the text between them.
  const tokens = $derived(runes ? pg.output.split(RUNE_WORD) : []);

  const READERS: [ReaderTarget, string][] = $derived([
    ['scholarly', i18n.t.scripts.readingScholarly],
    ['cta', i18n.t.scripts.readingCta],
    ['jany-latyn', i18n.t.scripts.readingJanyLatyn],
    ['cyrillic', i18n.t.scripts.readingCyrillic],
  ]);
  const failure = $derived(
    pg.result.ok ? null : pg.result.reason === 'old-spelling' ? i18n.t.scripts.oldSpelling : i18n.t.scripts.notReadable,
  );
</script>

<section class="order-3 flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 lg:order-2">
  <header class="flex min-h-12 flex-wrap items-center gap-2 border-b border-base-300 px-3 py-1.5">
    <h2 class="shrink-0 text-sm font-medium">{i18n.t.scripts[pg.to]}</h2>
    <div class="ml-auto flex items-center gap-1">
      {#if pg.to === 'latin'}
        <button
          type="button"
          class="btn btn-sm shrink-0 font-normal {pg.allCaps ? 'btn-primary' : 'btn-ghost'}"
          aria-pressed={pg.allCaps}
          title={i18n.t.playground.allCapsHint}
          onclick={() => (pg.allCaps = !pg.allCaps)}
        >
          {i18n.t.playground.allCaps}
        </button>
      {/if}
      {#if pg.to === 'latin' || pg.to === 'runes' || pg.to === 'ascii'}
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-square {hasVoted ? 'text-error' : ''}"
          disabled={!pg.input.trim() || hasVoted}
          onclick={onVote}
          title={hasVoted ? i18n.t.playground.votedBadge : i18n.t.playground.voteButton}
          aria-label={i18n.t.playground.voteButton}
        >
          <Icon name="heart" filled={hasVoted} />
        </button>
      {/if}
      <button type="button" class="btn btn-ghost btn-sm btn-square" disabled={!pg.output} onclick={onDownload} title={i18n.t.playground.downloadText} aria-label={i18n.t.playground.downloadText}>
        <Icon name="download" />
      </button>
      {#if runes}
        <button type="button" class="btn btn-ghost btn-sm gap-1.5" disabled={!pg.output} onclick={() => onCopy('runes_ltr', forLtrDocuments(pg.output))} title={i18n.t.scripts.copyForLtr}>
          <Icon name={copied === 'runes_ltr' ? 'check' : 'copy'} />
          <span class="hidden sm:inline">{i18n.t.scripts.copyForLtr}</span>
        </button>
      {/if}
      <button type="button" class="btn btn-primary btn-sm gap-1.5" disabled={!pg.output} onclick={() => onCopy('output', pg.output)}>
        <Icon name={copied === 'output' ? 'check' : 'copy'} />
        {copied === 'output' ? i18n.t.playground.copied : copied === 'failed' ? i18n.t.playground.copyFailed : i18n.t.playground.copy}
      </button>
    </div>
  </header>

  <div
    class="h-56 overflow-auto whitespace-pre-wrap break-words p-4 text-lg leading-relaxed sm:h-72 lg:h-96"
    style:font-family={outFont}
    aria-live="polite"
  >
    {#if failure}
      <span class="text-base-content/60">{failure}</span>
    {:else if pg.list}
      <div class="grid grid-cols-[1fr_1fr] gap-x-4 whitespace-normal">
        <div class="sticky top-0 bg-base-100 pb-1 text-xs font-medium text-base-content/60">{i18n.t.playground.listSourceColumn}</div>
        <div class="sticky top-0 bg-base-100 pb-1 text-xs font-medium text-base-content/60">{i18n.t.playground.listResultColumn}</div>
        {#each pg.list.source as entry, i}
          <div class="border-t border-base-200 py-0.5" dir="auto" style:font-family={pg.from === 'runes' ? RUNE_FONT : font}>{entry}</div>
          <div class="border-t border-base-200 py-0.5" dir={rtl ? 'rtl' : 'auto'}>{pg.list.result[i]}</div>
        {/each}
      </div>
    {:else if runes && pg.output}
      <div dir="rtl" lang="ky-Orkh" class="runes" aria-describedby={pg.janyLatynLine ? 'jany-latyn-line' : undefined}>
        {#each tokens as tok, i}{#if i % 2 === 1}<button
              type="button"
              class="inline rounded px-0.5 hover:bg-primary/10 {inspected === (i - 1) / 2 ? 'bg-primary/15' : ''}"
              onclick={() => onInspect((i - 1) / 2)}>{tok}</button>{:else}{tok}{/if}{/each}
      </div>
      {#if pg.janyLatynLine}
        <p id="jany-latyn-line" class="mt-3 border-t border-base-200 pt-2 text-sm text-base-content/50" dir="ltr" style:font-family={font}>{pg.janyLatynLine}</p>
      {/if}
    {:else if pg.output}
      {pg.output}
    {:else}
      <span class="text-base-content/40">{i18n.t.playground.emptyOutput}</span>
    {/if}
  </div>

  <footer class="flex min-h-10 flex-wrap items-center gap-2 border-t border-base-300 px-3 py-1 text-xs text-base-content/60">
    {#if pg.list}
      <span class="basis-full sm:basis-auto">{i18n.t.playground.listHint}</span>
    {/if}
    {#if pg.to === 'ascii'}
      <span class="shrink-0">{i18n.t.playground.fallbackStyleLabel.replace(/\s*:\s*$/, '')}</span>
      <div class="join">
        {#each [['strip', i18n.t.playground.fallbackStyleStrip], ['digraph', i18n.t.playground.fallbackStyleDigraph]] as [value, label]}
          <button type="button" class="btn btn-xs join-item font-normal {pg.ascii === value ? 'btn-primary' : 'btn-outline border-base-300'}" onclick={() => (pg.ascii = value as 'strip' | 'digraph')}>{label}</button>
        {/each}
      </div>
    {:else if pg.to === 'reading'}
      <span class="shrink-0">{i18n.t.scripts.readingNotation}</span>
      <div class="join">
        {#each READERS as [value, label]}
          <button type="button" class="btn btn-xs join-item font-normal {pg.reading === value ? 'btn-primary' : 'btn-outline border-base-300'}" onclick={() => (pg.reading = value)}>{label}</button>
        {/each}
      </div>
    {:else if runes}
      <label class="flex cursor-pointer items-center gap-1.5">
        <input type="checkbox" class="checkbox checkbox-xs" bind:checked={pg.showJanyLatyn} />
        {i18n.t.scripts.showJanyLatyn}
      </label>
    {/if}
    {#if pg.from !== 'cyrillic' && pg.to !== 'reading'}
      <label class="ml-auto flex cursor-pointer items-center gap-1.5" title={i18n.t.scripts.restoreLoansHint}>
        <input type="checkbox" class="checkbox checkbox-xs" bind:checked={pg.restoreLoans} />
        {i18n.t.scripts.restoreLoans}
      </label>
    {/if}
  </footer>
</section>
