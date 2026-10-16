<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';
  import type { JanyOptions } from 'jany-latyn/convert';
  import { getProbeForVowelMode } from '$lib/fontcheck';
  import { LATIN_PRESETS } from 'jany-latyn/scripts';
  import { RUNE_PRESETS, RUNE_OPTION_VALUES, type RuneOptions } from 'jany-latyn/runes';
  import { DEFAULT_FONT } from '$lib/fonts';
  import { i18n } from '$lib/i18n/index.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import FontSelect from '$lib/components/FontSelect.svelte';
  import VirtualKeyboard from '$lib/components/VirtualKeyboard.svelte';
  import VoteModal from '$lib/components/VoteModal.svelte';
  import { Playground } from '$lib/playground/state.svelte';
  import ScriptPickers from '$lib/playground/ScriptPickers.svelte';
  import PresetBar from '$lib/playground/PresetBar.svelte';
  import LatinOptions from '$lib/playground/LatinOptions.svelte';
  import RuneOptionsPanel from '$lib/playground/RuneOptions.svelte';
  import InputPane from '$lib/playground/InputPane.svelte';
  import OutputPane from '$lib/playground/OutputPane.svelte';
  import ComparisonStrip from '$lib/playground/ComparisonStrip.svelte';
  import RuneInspector from '$lib/playground/RuneInspector.svelte';
  import posthog from 'posthog-js';

  const SITE_NAME = env.PUBLIC_SITE_NAME ?? 'qylym';
  // The orthography's name, which is not the site's brand: the standard Latin preset is named after it.
  const SCRIPT_NAME = env.PUBLIC_SCRIPT_TITLE ?? 'Jany-Latyn';

  const pg = new Playground();

  let font = $state(DEFAULT_FONT);
  let showCustomize = $state(false);
  let showKeyboard = $state(false);
  let keyboardHeight = $state(0);
  let copied = $state<string | null>(null);
  let inspected = $state<number | null>(null);
  let textareaRef = $state<HTMLTextAreaElement | null>(null);

  onMount(() => {
    pg.restore();
    try {
      const stored = localStorage.getItem('jany_voted_combinations');
      if (stored) votedCombinations = JSON.parse(stored);
    } catch {}
  });

  // Remember the target and its settings (a no-op until restore() has run).
  $effect(() => {
    pg.save();
  });

  // A new output closes the inspector.
  $effect(() => {
    void pg.output;
    inspected = null;
  });

  // ---- Presets -----------------------------------------------------------

  // Analytics identifiers of the Latin presets, unchanged so earlier events and votes still match.
  const LATIN_META: Record<string, { card: string; voteName: string }> = {
    standard: { card: 'compModern', voteName: SCRIPT_NAME },
    cta: { card: 'compCTA', voteName: 'CTA-aligned' },
    digraph: { card: 'compDigraph', voteName: 'Legacy Digraphs' },
    hybrid: { card: 'compHybrid', voteName: 'Hybrid ө' },
  };

  function latinName(id: string): string {
    const t = i18n.t.playground;
    return ({ standard: SCRIPT_NAME, cta: t.ctaPresetLabel, digraph: t.variantDigraphs, hybrid: t.variantHybrid } as Record<string, string>)[id] ?? id;
  }

  function latinDesc(id: string | undefined): string {
    const t = i18n.t.playground;
    if (!id) return t.descCustom;
    return ({ standard: t.descStandard, cta: t.descCta, digraph: t.descDigraphs, hybrid: t.descHybrid } as Record<string, string>)[id] ?? '';
  }

  const latinItems = $derived(LATIN_PRESETS.map((p) => ({ id: p.id, name: latinName(p.id), status: p.status })));
  const runeItems = RUNE_PRESETS.map((p) => ({ id: p.id, name: p.name, status: p.status }));

  function applyLatin(id: string) {
    const p = LATIN_PRESETS.find((x) => x.id === id);
    if (p) pg.latin = { ...p.options };
  }
  function applyRunes(id: string) {
    const p = RUNE_PRESETS.find((x) => x.id === id);
    if (p) pg.runes = { ...p.options };
  }

  const presetId = $derived(
    pg.to === 'latin' ? (pg.latinPreset?.id ?? 'custom') : pg.to === 'runes' ? (pg.runePreset?.id ?? 'custom') : pg.to,
  );

  // Compact glyph summary of the Latin options, e.g. "ö/ü · y · í · ç/ş · k"
  function summary(o: Required<JanyOptions>): string {
    const vowels = { 'latin-umlaut': 'ö/ü', hybrid: 'ө/ü', 'cyrillic-u': 'ө/ұ', 'draft-macron': 'ө/ū' }[o.vowels];
    const glide = { 'acute-i': 'í', 'breve-i': 'ĭ', 'tilde-i': 'ĩ', i: 'i', y: 'y' }[o.glideGrapheme];
    return [
      vowels, o.yGrapheme === 'dotless-i' ? 'ı' : 'y', glide, o.sibilants === 'cedilla' ? 'ç/ş' : 'ch/sh',
      o.uvularK === 'q' ? 'k/q' : 'k', o.uvularG === 'ğ' ? 'g/ğ' : 'g', o.affricate === 'c' ? 'c' : 'j',
      o.velarNasal === 'tilde-n' ? 'ñ' : 'ŋ', o.velarFricative === 'x' ? 'x' : 'h',
    ].join(' · ');
  }

  const activeProbe = $derived(
    getProbeForVowelMode(pg.latin.vowels) +
      ({ 'breve-i': 'ĭĬ', 'tilde-i': 'ĩĨ' }[pg.latin.glideGrapheme as string] ?? '') +
      (pg.latin.velarNasal === 'tilde-n' ? 'ñÑ' : ''),
  );

  // ---- Voting ------------------------------------------------------------

  let voteModalOpen = $state(false);
  let voteTarget = $state<{ card: string; presetName: string; script: 'latin' | 'runes'; latin: JanyOptions; runes?: RuneOptions }>({
    card: 'primary_output', presetName: SCRIPT_NAME, script: 'latin', latin: {},
  });
  let votedCombinations = $state<Record<string, boolean>>({});

  // Key format predates velarNasal, uvularG, affricate, and velarFricative; they are appended only when
  // non-default so earlier stored votes still match. Rune keys carry a prefix of their own.
  function combinationKey(script: 'latin' | 'runes', o: JanyOptions, runes?: RuneOptions, isAscii = false): string {
    if (script === 'runes' && runes) {
      return 'runes:' + (Object.keys(RUNE_OPTION_VALUES) as (keyof RuneOptions)[]).map((k) => runes[k]).join('|');
    }
    const parts: string[] = [
      o.vowels ?? 'latin-umlaut', o.yGrapheme ?? 'y', o.glideGrapheme ?? 'acute-i',
      o.sibilants ?? 'cedilla', o.signs ?? 'absorbed', o.uvularK ?? 'k',
    ];
    if (o.velarNasal && o.velarNasal !== 'eng') parts.push(o.velarNasal);
    if (o.uvularG && o.uvularG !== 'g') parts.push(`uvularG-${o.uvularG}`);
    if (o.affricate && o.affricate !== 'j') parts.push(`affricate-${o.affricate}`);
    if (o.velarFricative && o.velarFricative !== 'h') parts.push(`velarFricative-${o.velarFricative}`);
    const key = parts.join('|');
    return isAscii ? `ascii:${key}` : key;
  }

  const outputCard = $derived(pg.to === 'ascii' ? 'compAscii' : pg.to === 'runes' ? 'primary_output_runes' : 'primary_output');
  const outputScript = $derived<'latin' | 'runes'>(pg.to === 'runes' ? 'runes' : 'latin');
  const hasVotedOutput = $derived(Boolean(votedCombinations[combinationKey(outputScript, pg.latin, pg.runes, pg.to === 'ascii')]));

  function openVote(card: string, script: 'latin' | 'runes', presetName: string, latin: JanyOptions, runes?: RuneOptions) {
    if (votedCombinations[combinationKey(script, latin, runes, card === 'compAscii')]) return;
    voteTarget = { card, presetName, script, latin: { ...latin }, runes: runes ? { ...runes } : undefined };
    voteModalOpen = true;
  }

  function voteForOutput() {
    if (pg.to === 'runes') openVote(outputCard, 'runes', pg.runePreset?.name ?? 'Custom', {}, pg.runes);
    else if (pg.to === 'ascii') openVote('compAscii', 'latin', 'ASCII Fallback', pg.latin);
    else openVote('primary_output', 'latin', pg.latinPreset ? LATIN_META[pg.latinPreset.id].voteName : 'Custom', pg.latin);
  }

  function comparisonVoted(id: string): boolean {
    if (pg.to === 'runes') {
      const p = RUNE_PRESETS.find((x) => x.id === id)!;
      return Boolean(votedCombinations[combinationKey('runes', {}, { ...p.options })]);
    }
    const p = LATIN_PRESETS.find((x) => x.id === id)!;
    return Boolean(votedCombinations[combinationKey('latin', p.options)]);
  }

  function voteForComparison(id: string) {
    if (pg.to === 'runes') {
      const p = RUNE_PRESETS.find((x) => x.id === id)!;
      openVote(`rune_${p.id}`, 'runes', p.name, {}, { ...p.options });
    } else {
      const p = LATIN_PRESETS.find((x) => x.id === id)!;
      openVote(LATIN_META[p.id].card, 'latin', LATIN_META[p.id].voteName, p.options);
    }
  }

  function handleVoteSubmitted(card: string) {
    votedCombinations[combinationKey(voteTarget.script, voteTarget.latin, voteTarget.runes, card === 'compAscii')] = true;
    try {
      localStorage.setItem('jany_voted_combinations', JSON.stringify(votedCombinations));
    } catch {}
  }

  // ---- Actions -----------------------------------------------------------

  function track(event: string, props: Record<string, unknown> = {}) {
    if (posthog.__loaded) {
      posthog.capture(event, { source_script: pg.from, target_script: pg.to, preset: presetId, ...props });
    }
  }

  async function copy(which: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      copied = which;
      track('text_copied', { copy_target: which });
    } catch {
      copied = 'failed';
    }
    setTimeout(() => (copied = null), 1200);
  }

  function download() {
    const text = pg.list ? pg.list.result.join('\n') : pg.output;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pg.to === 'runes' ? 'jany-enesai' : 'jany-latyn'}-${presetId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    track('file_downloaded', { text_length: text.length });
  }

  function handleKeyboardInsert(char: string) {
    if (!textareaRef) {
      pg.input = char === '\b' ? pg.input.slice(0, -1) : pg.input + char;
      return;
    }
    const start = textareaRef.selectionStart ?? pg.input.length;
    const end = textareaRef.selectionEnd ?? pg.input.length;
    let caret = start;
    if (char === '\b') {
      if (start === end && start > 0) {
        pg.input = pg.input.slice(0, start - 1) + pg.input.slice(end);
        caret = start - 1;
      } else if (start !== end) {
        pg.input = pg.input.slice(0, start) + pg.input.slice(end);
      }
    } else {
      pg.input = pg.input.slice(0, start) + char + pg.input.slice(end);
      caret = start + char.length;
    }
    setTimeout(() => {
      if (textareaRef) {
        textareaRef.selectionStart = textareaRef.selectionEnd = caret;
        textareaRef.focus();
      }
    }, 0);
  }
</script>

<h1 class="sr-only">{SITE_NAME}</h1>

<div class="space-y-5" style:padding-bottom={keyboardHeight ? `${keyboardHeight}px` : null}>
  <section class="space-y-3 rounded-box border border-base-300 bg-base-200/60 p-3 sm:p-4">
    <div class="flex flex-wrap items-center gap-3">
      <ScriptPickers {pg} />
      {#if pg.to === 'latin' || pg.from === 'latin'}
        <div class="ml-auto"><FontSelect bind:value={font} probe={activeProbe} location="playground" /></div>
      {/if}
    </div>

    {#if pg.to === 'latin'}
      <PresetBar items={latinItems} activeId={pg.latinPreset?.id} customizeOpen={showCustomize} onSelect={applyLatin} onCustomize={() => (showCustomize = !showCustomize)} />
      <p class="text-sm text-base-content/70">
        {latinDesc(pg.latinPreset?.id)}
        <span class="ml-1 font-mono text-xs text-base-content/50">{summary(pg.latin)}</span>
      </p>
      {#if showCustomize}
        <div class="grid gap-x-8 gap-y-5 border-t border-base-300 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <LatinOptions opts={pg.latin} {font} onChange={(next) => (pg.latin = next)} />
          <div class="flex items-end sm:col-span-2 lg:col-span-3">
            <button type="button" class="btn btn-ghost btn-sm gap-2" disabled={pg.latinPreset?.id === 'standard'} onclick={() => applyLatin('standard')}>
              <Icon name="reset" />{i18n.t.playground.resetOptions}
            </button>
          </div>
        </div>
      {/if}
    {:else if pg.to === 'runes'}
      <PresetBar items={runeItems} activeId={pg.runePreset?.id} customizeOpen={showCustomize} onSelect={applyRunes} onCustomize={() => (showCustomize = !showCustomize)} />
      {#if showCustomize}
        <div class="grid gap-x-8 gap-y-5 border-t border-base-300 pt-4 sm:grid-cols-2 lg:grid-cols-3">
          <RuneOptionsPanel opts={pg.runes} onChange={(next) => (pg.runes = next)} />
          <div class="flex items-end sm:col-span-2 lg:col-span-3">
            <button type="button" class="btn btn-ghost btn-sm gap-2" disabled={pg.runePreset?.id === 'jany-enesai'} onclick={() => applyRunes('jany-enesai')}>
              <Icon name="reset" />{i18n.t.playground.resetOptions}
            </button>
          </div>
        </div>
      {/if}
    {/if}
  </section>

  <div class="grid gap-4 lg:grid-cols-2">
    <InputPane
      {pg}
      {font}
      {showKeyboard}
      onToggleKeyboard={() => (showKeyboard = !showKeyboard)}
      bind:textareaRef
      onSample={(id) => track('sample_selected', { sample_id: id })}
      onFile={(name, size) => track('file_uploaded', { file_name: name, file_size: size })}
    />
    <OutputPane
      {pg}
      {font}
      {copied}
      hasVoted={hasVotedOutput}
      {inspected}
      onCopy={copy}
      onDownload={download}
      onVote={voteForOutput}
      onInspect={(i) => (inspected = i)}
    />
  </div>

  {#if pg.to === 'runes' && pg.output}
    {#if inspected !== null}
      <RuneInspector word={pg.explanations[inspected]} onClose={() => (inspected = null)} />
    {:else}
      <p class="text-sm text-base-content/60">{i18n.t.scripts.inspectorHint}</p>
    {/if}
  {/if}

  {#if pg.comparisons.length}
    <ComparisonStrip
      entries={pg.comparisons}
      base={pg.output}
      runes={pg.to === 'runes'}
      {font}
      {copied}
      voted={comparisonVoted}
      onUse={(id) => (pg.to === 'runes' ? applyRunes(id) : applyLatin(id))}
      onCopy={copy}
      onVote={voteForComparison}
    />
  {/if}
</div>

<VoteModal
  isOpen={voteModalOpen}
  options={voteTarget.latin}
  script={voteTarget.script}
  runeOptions={voteTarget.runes}
  presetName={voteTarget.presetName}
  targetCard={voteTarget.card}
  sampleLength={pg.input.length}
  alreadyVoted={Boolean(votedCombinations[combinationKey(voteTarget.script, voteTarget.latin, voteTarget.runes, voteTarget.card === 'compAscii')])}
  onClose={() => (voteModalOpen = false)}
  onVoteSubmitted={handleVoteSubmitted}
/>

{#if showKeyboard}
  <VirtualKeyboard
    activeVowels={pg.latin.vowels}
    activeY={pg.latin.yGrapheme}
    activeGlide={pg.latin.glideGrapheme}
    activeSibilants={pg.latin.sibilants}
    activeK={pg.latin.uvularK}
    activeG={pg.latin.uvularG}
    activeNasal={pg.latin.velarNasal}
    onInsert={handleKeyboardInsert}
    onClose={() => (showKeyboard = false)}
    onHeightChange={(h) => (keyboardHeight = h)}
  />
{/if}
