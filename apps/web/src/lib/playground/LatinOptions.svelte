<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { LatinOptions } from 'jany-latyn/scripts';
  import {
    resolveYGraphemeChange, resolveGlideGraphemeChange, resolveUvularKChange, hasTildeClash,
  } from 'jany-latyn/testbedPresets';
  import { i18n } from '$lib/i18n/index.svelte';
  import Icon from '$lib/components/Icon.svelte';

  type OptKey = keyof LatinOptions;
  let { opts, font, onChange }: { opts: LatinOptions; font: string; onChange: (next: LatinOptions) => void } = $props();

  interface Choice { value: string; glyph: string; desc: string }
  interface OptionRow { key: OptKey; label: string; choices: Choice[] }

  const optionRows = $derived.by<OptionRow[]>(() => {
    const t = i18n.t.playground;
    return [
      { key: 'vowels', label: t.vowelModeLabel, choices: [
        { value: 'latin-umlaut', glyph: 'ö ü', desc: t.vowelLatinUmlaut },
        { value: 'hybrid', glyph: 'ө ü', desc: t.vowelHybrid },
        { value: 'cyrillic-u', glyph: 'ө ұ', desc: t.vowelCyrillicU },
        { value: 'draft-macron', glyph: 'ө ū', desc: t.vowelMacronU },
      ] },
      { key: 'yGrapheme', label: t.yGraphemeLabel, choices: [
        { value: 'y', glyph: 'y', desc: t.yGraphemeY },
        { value: 'dotless-i', glyph: 'ı', desc: t.yGraphemeDotlessI },
      ] },
      { key: 'glideGrapheme', label: t.glideGraphemeLabel, choices: [
        { value: 'acute-i', glyph: 'í', desc: t.glideGraphemeAcuteI },
        { value: 'breve-i', glyph: 'ĭ', desc: t.glideGraphemeBreveI },
        { value: 'tilde-i', glyph: 'ĩ', desc: t.glideGraphemeTildeI },
        { value: 'i', glyph: 'i', desc: t.glideGraphemePlainI },
        { value: 'y', glyph: 'y', desc: t.glideGraphemeY },
      ] },
      { key: 'sibilants', label: t.sibilantModeLabel, choices: [
        { value: 'cedilla', glyph: 'ç ş', desc: t.sibilantCedilla },
        { value: 'digraph', glyph: 'ch sh', desc: t.sibilantDigraph },
      ] },
      { key: 'signs', label: t.signsModeLabel, choices: [
        { value: 'absorbed', glyph: 'obíekt', desc: t.signsAbsorbed },
        { value: 'apostrophe', glyph: "ob'ekt", desc: t.signsApostrophe },
      ] },
      { key: 'velarNasal', label: t.velarNasalLabel, choices: [
        { value: 'eng', glyph: 'ŋ', desc: t.velarNasalEng },
        { value: 'tilde-n', glyph: 'ñ', desc: t.velarNasalTildeN },
      ] },
      { key: 'uvularK', label: t.uvularKLabel, choices: [
        { value: 'k', glyph: 'k', desc: t.uvularKUnified },
        { value: 'q', glyph: 'k q', desc: t.uvularKAllophonic },
      ] },
      { key: 'uvularG', label: t.uvularGLabel, choices: [
        { value: 'g', glyph: 'g', desc: t.uvularGUnified },
        { value: 'ğ', glyph: 'g ğ', desc: t.uvularGAllophonic },
      ] },
      { key: 'affricate', label: t.affricateLabel, choices: [
        { value: 'j', glyph: 'j', desc: t.affricateUnified },
        { value: 'c', glyph: 'c', desc: t.affricateMechanical },
      ] },
      { key: 'velarFricative', label: t.velarFricativeLabel, choices: [
        { value: 'h', glyph: 'h', desc: t.velarFricativeH },
        { value: 'x', glyph: 'x', desc: t.velarFricativeX },
      ] },
    ];
  });

  // The `y` glide is offered only while ы is written ı (whitepaper §10).
  function isDisabled(key: OptKey, value: string): boolean {
    return key === 'glideGrapheme' && value === 'y' && opts.yGrapheme === 'y';
  }

  function setOption(key: OptKey, value: string) {
    const coupled = { yGrapheme: opts.yGrapheme, glideGrapheme: opts.glideGrapheme, uvularK: opts.uvularK, uvularG: opts.uvularG };
    if (key === 'yGrapheme') onChange({ ...opts, ...resolveYGraphemeChange(coupled, value as LatinOptions['yGrapheme']) });
    else if (key === 'glideGrapheme') onChange({ ...opts, ...resolveGlideGraphemeChange(coupled, value as LatinOptions['glideGrapheme']) });
    else if (key === 'uvularK') onChange({ ...opts, ...resolveUvularKChange(coupled, value as LatinOptions['uvularK']) });
    else onChange({ ...opts, [key]: value } as LatinOptions);
  }

  const stripColon = (label: string) => label.replace(/\s*:\s*$/, '');
</script>

{#each optionRows as row}
  {@const selected = row.choices.find((c) => c.value === opts[row.key])}
  <div class="space-y-1.5">
    <div class="text-sm font-medium">{stripColon(row.label)}</div>
    <div class="join">
      {#each row.choices as c}
        <button
          type="button"
          class="btn btn-sm join-item min-w-11 font-normal {opts[row.key] === c.value ? 'btn-primary' : 'btn-outline border-base-300'}"
          aria-pressed={opts[row.key] === c.value}
          disabled={isDisabled(row.key, c.value)}
          title={isDisabled(row.key, c.value) ? i18n.t.playground.yCollisionDisallowed : c.desc}
          style:font-family={font}
          onclick={() => setOption(row.key, c.value)}
        >
          {c.glyph}
        </button>
      {/each}
    </div>
    <p class="text-xs text-base-content/60">{selected?.desc}</p>
    {#if row.key === 'glideGrapheme' && hasTildeClash(opts)}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="alert" size={14} class="mt-px text-warning" /><span>{i18n.t.playground.tildeClashNote}</span></p>
    {/if}
    {#if row.key === 'uvularK' && opts.uvularK === 'q'}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="info" size={14} class="mt-px text-info" /><span>{i18n.t.playground.uvularKAutoNote}</span></p>
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="alert" size={14} class="mt-px text-warning" /><span>{i18n.t.playground.uvularKWarningLoanwords}</span></p>
    {/if}
    {#if row.key === 'uvularG' && opts.uvularG === 'ğ'}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="alert" size={14} class="mt-px text-warning" /><span>{i18n.t.playground.uvularGWarningLoanwords}</span></p>
    {/if}
    {#if row.key === 'affricate' && opts.affricate === 'c'}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="alert" size={14} class="mt-px text-warning" /><span>{i18n.t.playground.affricateWarningLoanwords}</span></p>
    {/if}
    {#if row.key === 'velarFricative' && opts.velarFricative === 'x'}
      <p class="flex gap-1.5 text-xs text-base-content/70"><Icon name="info" size={14} class="mt-px text-info" /><span>{i18n.t.playground.velarFricativeNote}</span></p>
    {/if}
  </div>
{/each}
