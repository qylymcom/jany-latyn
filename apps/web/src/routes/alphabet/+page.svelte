<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { LETTER_MAP } from 'jany-latyn/alphabet';
  import { cyrToJany } from 'jany-latyn/convert';
  import { fontCovers } from '$lib/fontcheck';
  import { FONTS } from '$lib/fonts';
  import { i18n } from '$lib/i18n/index.svelte';
  import posthog from 'posthog-js';

  const LOAN = new Set(['в', 'ф', 'ц', 'щ', 'ъ', 'ь', 'я', 'ё', 'ю']);
  const core = LETTER_MAP.filter(([c]) => !LOAN.has(c));
  const loan = LETTER_MAP.filter(([c]) => LOAN.has(c));

  const LONG: ReadonlyArray<readonly [string, string]> = [
    ['аа', 'талаалар — valleys'],
    ['ээ', 'ээги, керээз — jaw, testament'],
    ['оо', 'зоолор — cliffs'],
    ['уу', 'кууш — narrow'],
    ['өө', 'жөлөөр — will lean on'],
    ['үү', 'жүгүрүү — running'],
  ];

  let font = $state(FONTS[0].stack);

  const EXAMPLES: Readonly<Record<string, string>> = {
    'ч': 'чай — tea', 'ш': 'шаар — city', 'щ': 'ящик — loan',
    'ө': 'көл — lake', 'ү': 'күз — autumn', 'ң': 'жаңы — new',
    'ы': 'кыргыз', 'й': 'ай — moon', 'ё': 'ёлка — loan',
    'ю': 'июль — loan', 'я': 'яма — loan', 'х': 'рахмат — thanks',
    'ь': 'семья — loan', 'ъ': 'объект — loan',
  };

  function titleCase(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function handleFontSelected(event: Event) {
    const selectedFont = FONTS.find(
      ({ stack }) => stack === (event.currentTarget as HTMLSelectElement).value
    );

    if (selectedFont && posthog.__loaded) {
      posthog.capture('font_selected', {
        location: 'alphabet',
        font_label: selectedFont.label
      });
    }
  }
</script>

<h1 class="text-2xl font-bold mb-4">{i18n.t.alphabet.title}</h1>

<select class="select select-bordered select-sm mb-6" bind:value={font} onchange={handleFontSelected}>
  {#each FONTS as f}
    <option value={f.stack} disabled={!fontCovers(f.probe, 'öüíŋçşÖÜÍŊÇŞä')}>{f.label}</option>
  {/each}
</select>

{#snippet section(title: string, rows: typeof core)}
  <h2 class="text-lg font-semibold mt-6 mb-2">{title}</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {#each rows as [cyr, jany]}
      <div class="card bg-base-200">
        <div class="card-body p-3" style:font-family={font}>
          <div class="text-2xl">
            {#if !jany}
              {cyr.toUpperCase()}{cyr} → —
            {:else if jany === "'"}
              {cyr.toUpperCase()}{cyr} → "{jany}"
            {:else}
              {cyr.toUpperCase()}{cyr} → {titleCase(jany)}{jany}
            {/if}
          </div>
          {#if EXAMPLES[cyr]}
            <div class="text-sm opacity-80">{cyrToJany(EXAMPLES[cyr].split(' — ')[0])} ({EXAMPLES[cyr]})</div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
{/snippet}

{@render section(i18n.t.alphabet.coreLetters, core)}
{@render section(i18n.t.alphabet.loanLetters, loan)}

<h2 class="text-lg font-semibold mt-6 mb-2">{i18n.t.alphabet.longVowels}</h2>
<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
  {#each LONG as [pair, ex]}
    <div class="card bg-base-200">
      <div class="card-body p-3" style:font-family={font}>
        <div class="text-2xl">{pair} → {cyrToJany(pair)}</div>
        {#if ex}
          <div class="text-sm opacity-80">{cyrToJany(ex.split(' — ')[0])} ({ex})</div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<p class="mt-6 text-sm opacity-70">{i18n.t.alphabet.russianZhaNote}</p>
