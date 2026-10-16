<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { i18n } from '$lib/i18n/index.svelte';
  import { RUNE_FONT } from '$lib/runes';
  import Icon from '$lib/components/Icon.svelte';
  import type { Comparison } from './state.svelte';

  let {
    entries,
    base,
    runes,
    font,
    copied,
    voted,
    onUse,
    onCopy,
    onVote,
  }: {
    entries: Comparison[];
    base: string;
    runes: boolean;
    font: string;
    copied: string | null;
    voted: (id: string) => boolean;
    onUse: (id: string) => void;
    onCopy: (id: string) => void;
    onVote: (id: string) => void;
  } = $props();

  let expanded = $state<Record<string, boolean>>({});

  // Marks words that differ from the current output, in logical order, so the
  // comparison shows what a preset changes (works the same for runes).
  function diffTokens(text: string): { t: string; diff: boolean }[] {
    const a = text.split(/(\s+|⁚)/);
    const b = base.split(/(\s+|⁚)/);
    const aligned = a.length === b.length;
    return a.map((t, i) => ({ t, diff: aligned && t !== b[i] && /\S/.test(t) && t !== '⁚' }));
  }
  const isLong = (text: string) => text.length > 280 || text.split('\n').length > 3;
</script>

<section class="space-y-3">
  <div>
    <h2 class="text-base font-semibold">{i18n.t.scripts.comparisonTitle}</h2>
    <p class="text-sm text-base-content/60">{i18n.t.scripts.comparisonHint}</p>
  </div>
  <ul class="grid gap-3 md:grid-cols-2">
    {#each entries as e (e.id)}
      {@const open = expanded[e.id]}
      <li class="flex flex-col rounded-box border border-base-300 bg-base-100 p-3 sm:p-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">{e.name}</span>
          <span class="badge badge-xs badge-ghost">{e.status}</span>
          <div class="ml-auto flex items-center gap-0.5">
            <button type="button" class="btn btn-ghost btn-xs btn-square {voted(e.id) ? 'text-error' : ''}" disabled={voted(e.id)} onclick={() => onVote(e.id)} title={voted(e.id) ? i18n.t.playground.votedBadge : i18n.t.playground.voteButton} aria-label={i18n.t.playground.voteButton}>
              <Icon name="heart" size={14} filled={voted(e.id)} />
            </button>
            <button type="button" class="btn btn-ghost btn-xs btn-square" onclick={() => onCopy(e.id)} title={i18n.t.playground.copy} aria-label={i18n.t.playground.copy}>
              <Icon name={copied === e.id ? 'check' : 'copy'} size={14} />
            </button>
            <button type="button" class="btn btn-outline btn-xs ml-1" onclick={() => onUse(e.id)}>{i18n.t.playground.useVariant}</button>
          </div>
        </div>
        <p
          class="mt-2 whitespace-pre-wrap break-words text-base leading-relaxed {open ? 'max-h-96 overflow-auto' : 'line-clamp-3'}"
          dir={runes ? 'rtl' : 'auto'}
          lang={runes ? 'ky-Orkh' : undefined}
          style:font-family={runes ? RUNE_FONT : font}
        >
          {#each diffTokens(e.text) as tok}{#if tok.diff}<mark class="rounded-sm bg-warning/30 text-inherit">{tok.t}</mark>{:else}{tok.t}{/if}{/each}{#if e.truncated} …{/if}
        </p>
        {#if isLong(e.text)}
          <button type="button" class="link link-hover mt-1 self-start text-xs text-base-content/60" onclick={() => (expanded[e.id] = !open)}>
            {open ? i18n.t.playground.showLess : i18n.t.playground.showMore}
          </button>
        {/if}
      </li>
    {/each}
  </ul>
</section>
