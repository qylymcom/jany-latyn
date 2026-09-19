<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { JanyOptions } from 'jany-latyn/convert';
  import Icon from '$lib/components/Icon.svelte';

  let {
    activeVowels = 'latin-umlaut',
    activeY = 'y',
    activeGlide = 'acute-i',
    activeSibilants = 'cedilla',
    activeK = 'k',
    activeG = 'g',
    activeNasal = 'eng',
    onInsert,
    onClose
  }: {
    activeVowels?: JanyOptions['vowels'];
    activeY?: JanyOptions['yGrapheme'];
    activeGlide?: JanyOptions['glideGrapheme'];
    activeSibilants?: JanyOptions['sibilants'];
    activeK?: JanyOptions['uvularK'];
    activeG?: JanyOptions['uvularG'];
    activeNasal?: JanyOptions['velarNasal'];
    onInsert: (char: string) => void;
    onClose?: () => void;
  } = $props();

  let keyboardMode = $state<'qwerty' | 'cyrillic'>('qwerty');
  let isAltActive = $state(false);
  let isShiftActive = $state(false);

  // Alt / Option layer, following the physical layouts in keymaps/ (o u i n c s)
  // plus y → ı for the dotless option, g → ğ for the ğ option, and a → ä. Keys whose letter is plain
  // ASCII under the current options (i/y glides, ch/sh digraphs) get no entry.
  const altMap = $derived.by<Record<string, string>>(() => {
    const map: Record<string, string> = {
      o: activeVowels === 'latin-umlaut' ? 'ö' : 'ө',
      u:
        activeVowels === 'latin-umlaut' || activeVowels === 'hybrid'
          ? 'ü'
          : activeVowels === 'cyrillic-u'
            ? 'ұ'
            : 'ū',
      n: activeNasal === 'tilde-n' ? 'ñ' : 'ŋ',
      a: 'ä',
    };
    const glide = ({ 'acute-i': 'í', 'breve-i': 'ĭ', 'tilde-i': 'ĩ' } as Record<string, string>)[
      activeGlide ?? 'acute-i'
    ];
    if (glide) map.i = glide;
    if (activeY === 'dotless-i') map.y = 'ı';
    if (activeG === 'ğ') map.g = 'ğ';
    if (activeSibilants === 'cedilla') {
      map.c = 'ç';
      map.s = 'ş';
    }
    return map;
  });

  // Quick-insert row: every special letter the current options can produce.
  const specials = $derived(
    ['o', 'u', 'y', 'i', 'n', 'c', 's', 'g', 'a']
      .filter((k) => altMap[k])
      .map((k) => ({ key: k, char: altMap[k] }))
  );

  onMount(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey) isAltActive = true;
      if (e.shiftKey) isShiftActive = true;
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (!e.altKey) isAltActive = false;
      if (!e.shiftKey) isShiftActive = false;
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  // Capitals follow the configuration, as in the engine (SPEC §2.1): with dotless
  // ı the Turkish pairs apply (ı → I, i → İ); otherwise i → I.
  function withCase(char: string): string {
    if (!isShiftActive) return char;
    if (activeY === 'dotless-i' && char === 'i') return 'İ';
    return char.toUpperCase();
  }

  function handleKeyClick(key: string) {
    const alt = keyboardMode === 'qwerty' && isAltActive ? altMap[key] : undefined;
    onInsert(withCase(alt ?? key));
  }

  const qwertyRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
  ];

  // Kyrgyz Cyrillic (ЙЦУКЕН)
  const cyrRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', 'ө', 'ү'],
    ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'ң'],
    ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
    ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю']
  ];
  const CYR_SPECIAL = new Set(['ө', 'ү', 'ң']);

  const keyBase =
    'btn btn-sm h-9 min-w-7 px-1 font-normal text-sm sm:h-10 sm:min-w-10 sm:px-2 sm:text-base';
  const keyPlain = 'border-base-300 bg-base-100 hover:bg-base-200';
  const keyAccent = 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20';
</script>

<section class="space-y-3 rounded-box border border-base-300 bg-base-200/60 p-3 sm:p-4">
  <div class="flex flex-wrap items-center gap-2">
    <div class="tabs tabs-box tabs-sm bg-base-100" role="tablist">
      <button
        type="button"
        role="tab"
        class="tab"
        class:tab-active={keyboardMode === 'qwerty'}
        aria-selected={keyboardMode === 'qwerty'}
        onclick={() => (keyboardMode = 'qwerty')}
      >
        Latin (QWERTY)
      </button>
      <button
        type="button"
        role="tab"
        class="tab"
        class:tab-active={keyboardMode === 'cyrillic'}
        aria-selected={keyboardMode === 'cyrillic'}
        onclick={() => (keyboardMode = 'cyrillic')}
      >
        Кириллица (ЙЦУКЕН)
      </button>
    </div>

    {#if onClose}
      <button
        type="button"
        class="btn btn-ghost btn-sm btn-square ml-auto"
        onclick={onClose}
        title="Close keyboard"
        aria-label="Close keyboard"
      >
        <Icon name="x" />
      </button>
    {/if}
  </div>

  {#if keyboardMode === 'qwerty'}
    <!-- Special letters of the current variant, with their Alt shortcut -->
    <div class="flex flex-wrap items-center gap-1.5">
      {#each specials as s (s.key)}
        <button
          type="button"
          class="btn btn-sm gap-1.5 px-2.5 font-normal {keyAccent}"
          onclick={() => onInsert(withCase(s.char))}
          title="Alt / Option + {s.key.toUpperCase()}"
        >
          <span class="text-base">{withCase(s.char)}</span>
          <kbd class="kbd kbd-xs">⌥{s.key.toUpperCase()}</kbd>
        </button>
      {/each}
    </div>
  {/if}

  <div class="flex select-none flex-col gap-1 sm:gap-1.5">
    {#if keyboardMode === 'qwerty'}
      {#each qwertyRows as row, rowIndex}
        <div class="flex justify-center gap-1 sm:gap-1.5">
          {#if rowIndex === 3}
            <button
              type="button"
              class="{keyBase} px-2 {isShiftActive ? 'btn-secondary' : keyPlain}"
              onclick={() => (isShiftActive = !isShiftActive)}
              aria-pressed={isShiftActive}
              aria-label="Shift"
            >
              ⇧
            </button>
          {/if}

          {#each row as key}
            {@const alt = altMap[key]}
            {@const isSpecial = Boolean(alt) || (key === 'q' && activeK === 'q')}
            <button
              type="button"
              class="{keyBase} relative {isSpecial ? keyAccent : keyPlain}"
              onclick={() => handleKeyClick(key)}
            >
              {withCase(isAltActive && alt ? alt : key)}
              {#if !isAltActive && alt}
                <span
                  class="absolute -right-1 -top-1.5 rounded-full bg-primary px-1 text-[10px] leading-tight text-primary-content"
                >
                  {alt}
                </span>
              {/if}
            </button>
          {/each}

          {#if rowIndex === 3}
            <button
              type="button"
              class="{keyBase} px-2 {keyPlain}"
              onclick={() => onInsert('\b')}
              aria-label="Backspace"
            >
              ⌫
            </button>
          {/if}
        </div>
      {/each}

      <div class="flex justify-center gap-1.5 pt-1">
        <button
          type="button"
          class="btn btn-sm px-3 {isAltActive ? 'btn-accent' : keyPlain}"
          onclick={() => (isAltActive = !isAltActive)}
          aria-pressed={isAltActive}
        >
          ⌥ Alt
        </button>
        <button
          type="button"
          class="btn btn-sm max-w-xs flex-1 font-normal {keyPlain}"
          onclick={() => onInsert(' ')}
        >
          Space
        </button>
        <button
          type="button"
          class="btn btn-sm px-3 {keyPlain}"
          onclick={() => onInsert('\n')}
          aria-label="Enter"
        >
          ↵
        </button>
      </div>
    {:else}
      {#each cyrRows as row, rowIndex}
        <div class="flex justify-center gap-1 sm:gap-1.5">
          {#if rowIndex === 3}
            <button
              type="button"
              class="{keyBase} px-2 {isShiftActive ? 'btn-secondary' : keyPlain}"
              onclick={() => (isShiftActive = !isShiftActive)}
              aria-pressed={isShiftActive}
              aria-label="Shift"
            >
              ⇧
            </button>
          {/if}

          {#each row as key}
            <button
              type="button"
              class="{keyBase} {CYR_SPECIAL.has(key) ? keyAccent : keyPlain}"
              onclick={() => handleKeyClick(key)}
            >
              {withCase(key)}
            </button>
          {/each}

          {#if rowIndex === 3}
            <button
              type="button"
              class="{keyBase} px-2 {keyPlain}"
              onclick={() => onInsert('\b')}
              aria-label="Backspace"
            >
              ⌫
            </button>
          {/if}
        </div>
      {/each}

      <div class="flex justify-center gap-1.5 pt-1">
        <button
          type="button"
          class="btn btn-sm max-w-md flex-1 font-normal {keyPlain}"
          onclick={() => onInsert(' ')}
        >
          Боштук
        </button>
        <button
          type="button"
          class="btn btn-sm px-3 {keyPlain}"
          onclick={() => onInsert('\n')}
          aria-label="Enter"
        >
          ↵
        </button>
      </div>
    {/if}
  </div>
</section>
