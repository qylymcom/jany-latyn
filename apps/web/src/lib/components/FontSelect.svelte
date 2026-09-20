<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { FONTS, type FontEntry } from '$lib/fonts';
  import { fontCovers, getProbeForVowelMode } from '$lib/fontcheck';
  import { i18n } from '$lib/i18n/index.svelte';
  import posthog from 'posthog-js';

  let {
    value = $bindable(),
    probe = getProbeForVowelMode(),
    location,
    id = 'preview-font',
    showLabel = true,
    class: klass = 'select select-sm w-auto max-w-48'
  }: {
    value: string;
    probe?: string;
    location: string;
    id?: string;
    showLabel?: boolean;
    class?: string;
  } = $props();

  const label = $derived(i18n.t.playground.fontLabel.replace(/:$/, ''));

  function available(f: FontEntry): boolean {
    return f.probe === '-apple-system' || fontCovers(f.probe, probe);
  }

  function handleFontSelected(event: Event) {
    const selectedFont = FONTS.find(
      ({ stack }) => stack === (event.currentTarget as HTMLSelectElement).value
    );
    if (selectedFont && posthog.__loaded) {
      posthog.capture('font_selected', { location, font_label: selectedFont.label });
    }
  }
</script>

{#snippet control()}
  <select {id} class={klass} aria-label={label} bind:value onchange={handleFontSelected}>
    {#each FONTS as f}
      <option value={f.stack} disabled={!available(f)}>
        {f.label}{available(f) ? '' : ` ${i18n.t.playground.fontUnavailable}`}
      </option>
    {/each}
  </select>
{/snippet}

{#if showLabel}
  <label class="flex items-center gap-2 text-sm text-base-content/70" for={id}>
    {label}
    {@render control()}
  </label>
{:else}
  {@render control()}
{/if}
