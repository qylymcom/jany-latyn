<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { i18n } from '$lib/i18n/index.svelte';
  import { SAMPLE_TEXTS } from '$lib/sample-texts/index';
  import { RUNE_FONT } from '$lib/runes';
  import Icon from '$lib/components/Icon.svelte';
  import type { Playground } from './state.svelte';

  let {
    pg,
    font,
    showKeyboard,
    onToggleKeyboard,
    textareaRef = $bindable(null),
    onSample,
    onFile,
  }: {
    pg: Playground;
    font: string;
    showKeyboard: boolean;
    onToggleKeyboard: () => void;
    textareaRef?: HTMLTextAreaElement | null;
    onSample: (id: string) => void;
    onFile: (name: string, size: number) => void;
  } = $props();

  const SOUTHERN_SAMPLE = '__southern';
  let isDragging = $state(false);
  let fileError = $state<string | null>(null);
  let fileInput = $state<HTMLInputElement | null>(null);
  let copied = $state(false);

  const runeInput = $derived(pg.from === 'runes');
  const wordCount = $derived(pg.input.trim() ? pg.input.trim().split(/\s+/).length : 0);

  const sampleGroups = $derived.by(() => {
    const t = i18n.t.playground;
    const groups = [
      { kind: 'text', label: t.sampleGroupText, items: SAMPLE_TEXTS.filter((s) => (s.kind ?? 'text') === 'text') },
      { kind: 'list', label: t.sampleGroupList, items: SAMPLE_TEXTS.filter((s) => s.kind === 'list') },
    ];
    return pg.viewMode === 'list' ? [groups[1], groups[0]] : groups;
  });

  function sampleTitle(s: (typeof SAMPLE_TEXTS)[number]): string {
    const l = i18n.locale;
    return s.title[l === 'ky-jany' ? 'ky' : l];
  }

  function handleSampleSelect(e: Event) {
    const target = e.currentTarget as HTMLSelectElement;
    if (target.value === SOUTHERN_SAMPLE) {
      // Southern-dialect ä is Latin in the source and passes through unchanged.
      const words = 'äkä källä gäldir, xäräm bolot, ükämdan sura, mäxalläda bar';
      pg.input = pg.input ? `${pg.input} ${words}` : words;
    } else {
      const sample = SAMPLE_TEXTS.find((s) => s.id === target.value);
      if (sample) {
        pg.input = sample.content;
        pg.viewMode = sample.kind === 'list' ? 'list' : 'text';
        onSample(sample.id);
      }
    }
    target.value = '';
  }

  function handleFile(file: File) {
    fileError = null;
    if (file.size > 2 * 1024 * 1024) {
      fileError = i18n.t.playground.fileTooLarge;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        pg.input = reader.result;
        onFile(file.name, file.size);
      }
    };
    reader.readAsText(file, 'utf-8');
  }

  async function copyInput() {
    try {
      await navigator.clipboard.writeText(pg.input);
      copied = true;
      setTimeout(() => (copied = false), 1200);
    } catch {
      copied = false;
    }
  }
</script>

<section
  class="order-1 flex flex-col overflow-hidden rounded-box border bg-base-100 transition-colors {isDragging ? 'border-primary ring-2 ring-primary/30' : 'border-base-300'}"
>
  <header class="flex min-h-12 flex-wrap items-center gap-2 border-b border-base-300 px-3 py-1.5">
    <h2 class="shrink-0 text-sm font-medium">{i18n.t.playground.inputTitle}</h2>
    <div class="join shrink-0" role="group" aria-label={i18n.t.playground.viewModeList}>
      {#each [['text', i18n.t.playground.viewModeText], ['list', i18n.t.playground.viewModeList]] as [value, label]}
        <button
          type="button"
          class="btn btn-xs join-item font-normal {pg.viewMode === value ? 'btn-primary' : 'btn-outline border-base-300'}"
          aria-pressed={pg.viewMode === value}
          onclick={() => (pg.viewMode = value as 'text' | 'list')}
        >
          {label}
        </button>
      {/each}
    </div>
    <div class="ml-auto flex w-full items-center gap-1 sm:w-auto">
      <select class="select select-ghost select-sm min-w-0 flex-1 sm:w-56 sm:flex-none" onchange={handleSampleSelect} aria-label={i18n.t.playground.selectSample}>
        <option value="" disabled selected>{i18n.t.playground.selectSample}</option>
        {#each sampleGroups as group (group.kind)}
          <optgroup label={group.label}>
            {#each group.items as s (s.id)}
              <option value={s.id}>{sampleTitle(s)}</option>
            {/each}
          </optgroup>
        {/each}
        <option value={SOUTHERN_SAMPLE}>{i18n.t.playground.southernHelperTitle.replace(/\s*:\s*$/, '')}</option>
      </select>
      <input
        type="file"
        accept=".txt,.md,text/plain,text/markdown"
        class="hidden"
        bind:this={fileInput}
        onchange={(e) => {
          const t = e.currentTarget as HTMLInputElement;
          const f = t.files?.[0];
          if (f) { handleFile(f); t.value = ''; }
        }}
      />
      <button type="button" class="btn btn-ghost btn-sm btn-square" onclick={() => fileInput?.click()} title={i18n.t.playground.uploadText} aria-label={i18n.t.playground.uploadText}>
        <Icon name="upload" />
      </button>
      <button
        type="button"
        class="btn btn-sm btn-square {showKeyboard ? 'btn-primary' : 'btn-ghost'}"
        onclick={onToggleKeyboard}
        title={i18n.t.playground.keyboardToggle}
        aria-label={i18n.t.playground.keyboardToggle}
        aria-pressed={showKeyboard}
      >
        <Icon name="keyboard" />
      </button>
    </div>
  </header>

  <textarea
    bind:this={textareaRef}
    bind:value={pg.input}
    dir={runeInput ? 'rtl' : 'auto'}
    lang={runeInput ? 'ky-Orkh' : undefined}
    class="h-56 w-full resize-none bg-transparent p-4 text-lg leading-relaxed outline-none placeholder:text-base-content/40 sm:h-72 lg:h-96"
    style:font-family={runeInput ? RUNE_FONT : font}
    placeholder={i18n.t.playground.placeholder}
    aria-label={i18n.t.playground.inputTitle}
    ondragover={(e) => { e.preventDefault(); isDragging = true; }}
    ondragleave={() => (isDragging = false)}
    ondrop={(e) => {
      e.preventDefault();
      isDragging = false;
      const f = e.dataTransfer?.files?.[0];
      if (f) handleFile(f);
    }}
  ></textarea>

  <footer class="flex min-h-10 items-center gap-2 border-t border-base-300 px-3 text-xs text-base-content/60">
    {#if fileError}
      <span class="text-error">{fileError}</span>
    {:else}
      <span>{wordCount} {i18n.t.playground.words} · {[...pg.input].length}</span>
    {/if}
    <div class="ml-auto flex items-center gap-1">
      <button type="button" class="btn btn-ghost btn-xs gap-1" disabled={!pg.input} onclick={copyInput}>
        <Icon name={copied ? 'check' : 'copy'} size={14} />
        {copied ? i18n.t.playground.copied : i18n.t.playground.copyInput}
      </button>
      <button type="button" class="btn btn-ghost btn-xs gap-1" disabled={!pg.input} onclick={() => (pg.input = '')}>
        <Icon name="x" size={14} />
        {i18n.t.playground.clearInput}
      </button>
    </div>
  </footer>
</section>
