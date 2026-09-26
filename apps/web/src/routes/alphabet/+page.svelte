<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { LETTER_MAP } from 'jany-latyn/alphabet';
  import { cyrToJany } from 'jany-latyn/convert';
  import { compare } from 'jany-latyn/collate';
  import { upperStr } from 'jany-latyn/casing';
  import { fontCovers } from '$lib/fontcheck';
  import { FONTS } from '$lib/fonts';
  import { i18n } from '$lib/i18n/index.svelte';
  import type { BaseLocale } from '$lib/i18n/types.js';
  import posthog from 'posthog-js';

  const LOAN = new Set(['в', 'ф', 'ц', 'щ', 'ъ', 'ь', 'я', 'ё', 'ю']);
  const core = LETTER_MAP.filter(([c]) => !LOAN.has(c));
  const loan = LETTER_MAP.filter(([c]) => LOAN.has(c));

  // The Jany-Latyn alphabet (whitepaper §17.2): every letter the mapping writes,
  // in Jany-Latyn order. Derived rather than listed, so it cannot drift from LETTER_MAP.
  const ALPHABET = [...new Set(LETTER_MAP.flatMap(([, jany]) => [...jany]))].sort((a, b) => compare(a, b));

  // Broad phonemic values, one per letter, after Kara (2003) as summarized in
  // the standard descriptions: х is /x/, found only in loanwords.
  const IPA: Readonly<Record<string, string>> = {
    a: 'ɑ', b: 'b', 'ç': 'tʃ', d: 'd', e: 'e', f: 'f', g: 'ɡ', h: 'x', i: 'i', 'í': 'j',
    j: 'dʒ', k: 'k', l: 'l', m: 'm', n: 'n', 'ŋ': 'ŋ', o: 'o', 'ö': 'ø', p: 'p', r: 'r',
    s: 's', 'ş': 'ʃ', t: 't', u: 'u', 'ü': 'y', v: 'v', y: 'ɯ', z: 'z',
  };

  // The one allophone worth a line of its own where a letter serves two sounds:
  // uvular [q] and [ʁ] next to back vowels (whitepaper §8), and the [h] many
  // speakers use for х (whitepaper §20).
  const ALLOPHONE: Readonly<Record<string, string>> = { k: 'q', g: 'ʁ', h: 'h' };

  // Glosses per interface language. Kyrgyz needs none, and a gloss that would
  // repeat the word itself (Russian loans in Russian) is left out.
  type Gloss = Partial<Record<Exclude<BaseLocale, 'ky'>, string>>;
  interface Example {
    word: string;
    gloss: Gloss;
    loan?: boolean;
  }

  const LONG: ReadonlyArray<readonly [string, Example]> = [
    ['аа', { word: 'талаалар', gloss: { en: 'fields', ru: 'поля', tr: 'tarlalar', zh: '田野' } }],
    ['ээ', { word: 'ээги, керээз', gloss: { en: 'chin, testament', ru: 'подбородок, завещание', tr: 'çene, vasiyet', zh: '下巴，遗嘱' } }],
    ['оо', { word: 'зоолор', gloss: { en: 'cliffs', ru: 'скалы', tr: 'kayalıklar', zh: '悬崖' } }],
    ['уу', { word: 'кууш', gloss: { en: 'narrow', ru: 'узкий', tr: 'dar', zh: '狭窄' } }],
    ['өө', { word: 'жөлөөр', gloss: { en: 'will lean on', ru: 'обопрётся', tr: 'yaslanacak', zh: '将倚靠' } }],
    ['үү', { word: 'жүгүрүү', gloss: { en: 'running', ru: 'бег', tr: 'koşu', zh: '跑步' } }],
  ];

  let font = $state(FONTS[0].stack);

  const EXAMPLES: Readonly<Record<string, Example>> = {
    'ч': { word: 'чай', gloss: { en: 'tea', ru: 'чай', tr: 'çay', zh: '茶' } },
    'ш': { word: 'шаар', gloss: { en: 'city', ru: 'город', tr: 'şehir', zh: '城市' } },
    'щ': { word: 'ящик', gloss: { en: 'box, crate', ru: 'ящик', tr: 'kutu, sandık', zh: '箱子' }, loan: true },
    'ө': { word: 'көл', gloss: { en: 'lake', ru: 'озеро', tr: 'göl', zh: '湖' } },
    'ү': { word: 'күз', gloss: { en: 'autumn', ru: 'осень', tr: 'sonbahar', zh: '秋天' } },
    'ң': { word: 'жаңы', gloss: { en: 'new', ru: 'новый', tr: 'yeni', zh: '新' } },
    'ы': { word: 'кыргыз', gloss: { en: 'Kyrgyz', ru: 'кыргыз', tr: 'Kırgız', zh: '吉尔吉斯' } },
    'й': { word: 'ай', gloss: { en: 'moon', ru: 'луна', tr: 'ay', zh: '月亮' } },
    'ё': { word: 'ёлка', gloss: { en: 'fir tree', ru: 'ёлка', tr: 'çam ağacı', zh: '枞树' }, loan: true },
    'ю': { word: 'июль', gloss: { en: 'July', ru: 'июль', tr: 'temmuz', zh: '七月' }, loan: true },
    'я': { word: 'яма', gloss: { en: 'pit', ru: 'яма', tr: 'çukur', zh: '坑' }, loan: true },
    'х': { word: 'рахмат', gloss: { en: 'thanks', ru: 'спасибо', tr: 'teşekkürler', zh: '谢谢' } },
    'ь': { word: 'семья', gloss: { en: 'family', ru: 'семья', tr: 'aile', zh: '家庭' }, loan: true },
    'ъ': { word: 'объект', gloss: { en: 'object', ru: 'объект', tr: 'nesne', zh: '对象' }, loan: true },
  };

  // e.g. "íaşik (ящик — box, crate, loan)"; in Kyrgyz, "íaşik (ящик — кирме сөз)".
  function describe(ex: Example): string {
    const l = i18n.locale;
    const gloss = l === 'ky' || l === 'ky-jany' ? undefined : ex.gloss[l];
    const notes = [gloss !== ex.word ? gloss : undefined, ex.loan ? i18n.t.alphabet.loanTag : undefined].filter(Boolean);
    return `${cyrToJany(ex.word)} (${ex.word}${notes.length ? ' — ' + notes.join(', ') : ''})`;
  }

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

<section class="mb-2">
  <h2 class="text-lg font-semibold mb-2">
    {i18n.t.alphabet.janyLatynAlphabet}
    <span class="font-normal text-base-content/60">({ALPHABET.length} {i18n.t.alphabet.lettersCount})</span>
  </h2>
  <!-- One column per letter, capital over lowercase over IPA, so the three stay
       aligned when the row wraps. Lowercase shows í against i, the cedillas, and the
       descender of ŋ; the capital Ŋ is left to the font (N-based or n-based),
       per whitepaper §14. -->
  <ol class="flex flex-wrap gap-y-3 text-2xl font-semibold" style:font-family={font}>
    {#each ALPHABET as l}
      <li class="flex w-9 flex-col items-center leading-tight">
        <span>{upperStr(l)}</span>
        <span>{l}</span>
        <!-- The UI font, not the chosen one: few text fonts carry ɯ, ʃ, ʒ. -->
        <span class="mt-1 font-sans text-sm font-normal text-base-content/60">{IPA[l] ? `/${IPA[l]}/` : ''}</span>
        {#if ALLOPHONE[l]}
          <span class="font-sans text-xs font-normal text-base-content/50">[{ALLOPHONE[l]}]</span>
        {/if}
      </li>
    {/each}
  </ol>
</section>

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
            <div class="text-sm opacity-80">{describe(EXAMPLES[cyr])}</div>
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
        <div class="text-sm opacity-80">{describe(ex)}</div>
      </div>
    </div>
  {/each}
</div>

<p class="mt-6 text-sm opacity-70">{i18n.t.alphabet.russianZhaNote}</p>
