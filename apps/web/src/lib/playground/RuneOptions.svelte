<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { isReversible, janyLatynToRunes, type RuneOptions } from 'jany-latyn/runes';
  import { i18n } from '$lib/i18n/index.svelte';
  import { RUNE_FONT } from '$lib/runes';
  import Icon from '$lib/components/Icon.svelte';

  type Key = keyof RuneOptions;
  let { opts, onChange }: { opts: RuneOptions; onChange: (next: RuneOptions) => void } = $props();

  interface Choice { value: string; glyph: string; desc: string; oneWay?: boolean; hardToRead?: boolean }
  interface Row { key: Key; label: string; choices: Choice[]; plainGlyph?: boolean }

  // Each choice shows a short sample of what it writes (proposal §14, §18; RUNES-SPEC §4).
  const rows = $derived.by<Row[]>(() => {
    const t = i18n.t.runic;
    const all: Row[] = [
      { key: 'harmony', label: t.harmonyLabel, choices: [
        { value: 'none', glyph: '𐰴𐰇𐰞', desc: t.harmonyNone },
        { value: 'kg', glyph: '𐰚𐰇𐰞', desc: t.harmonyKg },
        { value: 'full', glyph: '𐰜𐰇𐰠', desc: t.harmonyFull },
      ] },
      { key: 'register', label: t.registerLabel, choices: [
        { value: 'plene', glyph: '𐱄𐰅𐰭𐰄𐰺', desc: t.registerPlene },
        { value: 'epigraphic', glyph: '𐱄𐰭𐰺', desc: t.registerEpigraphic, oneWay: true },
      ] },
      { key: 'vowels', label: t.vowelsLabel, choices: [
        { value: 'distinct', glyph: '𐰃 𐰄', desc: t.vowelsDistinct },
        { value: 'historical', glyph: '𐰃', desc: t.vowelsHistorical, oneWay: true },
      ] },
      { key: 'u', label: t.uLabel, choices: [
        { value: 'bash', glyph: '𐱈', desc: t.uBash },
        { value: 'dotted-o', glyph: '𐰆̇', desc: t.uDotted },
        { value: 'old-hungarian', glyph: '\u{10CEA}', desc: t.uOldHungarian },
      ] },
      { key: 'zhe', label: t.zheLabel, choices: [
        { value: 'chart', glyph: '𐰳', desc: t.zheChart },
        { value: 'front', glyph: '𐰙', desc: t.zheFront },
        { value: 'etymological', glyph: '𐰖', desc: t.zheEtymological, oneWay: true },
      ] },
      { key: 'loanConsonants', label: t.loanLabel, choices: [
        { value: 'chart', glyph: '𐰟 𐰝 𐰊', desc: t.loanChart },
        { value: 'nativized', glyph: '𐰯 𐰴 𐰉', desc: t.loanNativized, oneWay: true },
      ] },
      { key: 'forms', label: t.formsLabel, choices: [
        { value: 'chart', glyph: '𐱄 𐰕', desc: t.formsChart },
        { value: 'orkhon', glyph: '𐱃 𐰔', desc: t.formsOrkhon },
        { value: 'yenisei', glyph: '𐰻 𐰎', desc: t.formsYenisei },
        // The Tian-Shan forms follow the database (RUNES-SPEC §6.4), so the sample is computed.
        { value: 'tianshan', glyph: janyLatynToRunes('r g', { forms: 'tianshan' }), desc: t.formsTianshan },
      ] },
      { key: 'r', label: t.rLabel, choices: [
        { value: 'chart', glyph: '𐰺', desc: t.letterChart },
        { value: 'attested', glyph: '𐰻', desc: t.letterAttested },
      ] },
      { key: 's', label: t.sLabel, choices: [
        { value: 'chart', glyph: '𐰽', desc: t.letterChart },
        { value: 'attested', glyph: '𐰾', desc: t.letterAttested, hardToRead: true },
      ] },
      { key: 'sh', label: t.shLabel, choices: [
        { value: 'chart', glyph: '𐱁', desc: t.letterChart },
        { value: 'attested', glyph: '𐱀', desc: t.letterAttested, hardToRead: true },
      ] },
      { key: 'yeniseiSh', label: t.yeniseiShLabel, choices: [
        { value: 'apart', glyph: '𐱀 · 𐱂', desc: t.yeniseiShApart },
        { value: 'merged', glyph: '𐱂', desc: t.yeniseiShMerged, oneWay: true },
      ] },
      { key: 'separator', label: t.separatorLabel, plainGlyph: true, choices: [
        { value: 'space', glyph: '␣', desc: t.separatorSpace },
        { value: 'two-dot', glyph: '⁚', desc: t.separatorTwoDot },
      ] },
    ];
    // The Yenisei ш choice only matters with the Yenisei and Tian-Shan forms.
    return all.filter((r) => r.key !== 'yeniseiSh' || opts.forms === 'yenisei' || opts.forms === 'tianshan');
  });

  const reversible = $derived(isReversible(opts));
  const set = (key: Key, value: string) => onChange({ ...opts, [key]: value } as RuneOptions);
</script>

{#each rows as row}
  {@const selected = row.choices.find((c) => c.value === opts[row.key])}
  <div class="space-y-1.5">
    <div class="text-sm font-medium">{row.label}</div>
    <div class="join">
      {#each row.choices as c}
        <button
          type="button"
          class="btn btn-sm join-item min-w-11 font-normal {opts[row.key] === c.value ? 'btn-primary' : 'btn-outline border-base-300'}"
          aria-pressed={opts[row.key] === c.value}
          title={c.oneWay ? `${c.desc} (${i18n.t.runic.oneWay})` : c.desc}
          style:font-family={row.plainGlyph ? null : RUNE_FONT}
          onclick={() => set(row.key, c.value)}
        >
          <bdi>{c.glyph}</bdi>
          {#if c.oneWay}<sup class="text-[10px] opacity-70">↛</sup>{/if}
        </button>
      {/each}
    </div>
    <p class="text-xs text-base-content/60">
      {selected?.desc}{#if selected?.oneWay}<span class="ml-1 badge badge-xs badge-warning">{i18n.t.runic.oneWay}</span>{/if}
    </p>
    {#if selected?.hardToRead}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="alert" size={14} class="mt-px text-warning" /><span>{i18n.t.runic.hardToRead}</span></p>
    {/if}
  </div>
{/each}

<p class="flex items-center gap-1.5 text-sm sm:col-span-2 lg:col-span-3 {reversible ? 'text-success' : 'text-warning'}">
  <Icon name={reversible ? 'check' : 'alert'} size={16} />
  {reversible ? i18n.t.runic.reversible : i18n.t.runic.notReversible}
</p>
