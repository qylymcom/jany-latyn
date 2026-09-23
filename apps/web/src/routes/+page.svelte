<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import {
    cyrToJany,
    janyToFallback,
    type JanyOptions,
  } from "jany-latyn/convert";
  import {
    resolveYGraphemeChange,
    resolveGlideGraphemeChange,
    resolveUvularKChange,
    hasTildeClash,
  } from "jany-latyn/testbedPresets";
  import { compare, compareCyrillic } from "jany-latyn/collate";
  import { caseModeFor, upperStr } from "jany-latyn/casing";
  import { getProbeForVowelMode } from "$lib/fontcheck";
  import { DEFAULT_FONT } from "$lib/fonts";
  import { i18n } from "$lib/i18n/index.svelte";
  import { SAMPLE_TEXTS } from "$lib/sample-texts/index";
  import Icon from "$lib/components/Icon.svelte";
  import FontSelect from "$lib/components/FontSelect.svelte";
  import VirtualKeyboard from "$lib/components/VirtualKeyboard.svelte";
  import VoteModal from "$lib/components/VoteModal.svelte";
  import posthog from "posthog-js";

  type Opts = Required<JanyOptions>;
  type OptKey = keyof Opts;

  const SITE_NAME = env.PUBLIC_SITE_NAME ?? "jany-latyn";
  // The orthography's name, which is not the site's brand: the standard preset is named after it.
  const SCRIPT_NAME = env.PUBLIC_SCRIPT_TITLE ?? "Jany-Latyn";
  const SOUTHERN_SAMPLE = "__southern";

  const DEFAULTS: Opts = {
    vowels: "latin-umlaut",
    yGrapheme: "y",
    glideGrapheme: "acute-i",
    sibilants: "cedilla",
    signs: "absorbed",
    uvularK: "k",
    uvularG: "g",
    velarNasal: "eng",
    affricate: "j",
    velarFricative: "h",
  };

  // Named variants double as presets (top switcher) and as comparison rows.
  // `card` / `voteName` keep the analytics identifiers used before the redesign.
  interface Variant {
    id: string;
    card: string;
    voteName: string;
    opts: Opts;
  }

  const VARIANTS: Variant[] = [
    { id: "standard", card: "compModern", voteName: SCRIPT_NAME, opts: DEFAULTS },
    {
      id: "cta",
      card: "compCTA",
      voteName: "CTA Standard",
      // The CTA writes the velar nasal ñ; without it this preset is not the CTA row of whitepaper §9.5.
      opts: { ...DEFAULTS, yGrapheme: "dotless-i", glideGrapheme: "y", uvularK: "q", uvularG: "ğ", affricate: "c", velarNasal: "tilde-n" },
    },
    {
      id: "digraph",
      card: "compDigraph",
      voteName: "Legacy Digraphs",
      opts: { ...DEFAULTS, sibilants: "digraph", signs: "apostrophe" },
    },
    {
      id: "hybrid",
      card: "compHybrid",
      voteName: "Hybrid ө",
      opts: { ...DEFAULTS, vowels: "hybrid" },
    },
  ];

  const OPT_KEYS = Object.keys(DEFAULTS) as OptKey[];

  function sameOpts(a: Opts, b: Opts): boolean {
    return OPT_KEYS.every((k) => a[k] === b[k]);
  }

  function variantName(v: Variant): string {
    const t = i18n.t.playground;
    return { standard: SCRIPT_NAME, cta: t.ctaPresetLabel, digraph: t.variantDigraphs, hybrid: t.variantHybrid }[v.id] ?? v.id;
  }

  function variantDesc(v: Variant | undefined): string {
    const t = i18n.t.playground;
    if (!v) return t.descCustom;
    return { standard: t.descStandard, cta: t.descCta, digraph: t.descDigraphs, hybrid: t.descHybrid }[v.id] ?? "";
  }

  // Compact glyph summary, e.g. "ö/ü · y · í · ç/ş · k"
  function summary(o: Opts): string {
    const vowels = { "latin-umlaut": "ö/ü", hybrid: "ө/ü", "cyrillic-u": "ө/ұ", "draft-macron": "ө/ū" }[o.vowels];
    const glide = { "acute-i": "í", "breve-i": "ĭ", "tilde-i": "ĩ", i: "i", y: "y" }[o.glideGrapheme];
    return [
      vowels,
      o.yGrapheme === "dotless-i" ? "ı" : "y",
      glide,
      o.sibilants === "cedilla" ? "ç/ş" : "ch/sh",
      o.uvularK === "q" ? "k/q" : "k",
      o.uvularG === "ğ" ? "g/ğ" : "g",
      o.affricate === "c" ? "c" : "j",
      o.velarNasal === "tilde-n" ? "ñ" : "ŋ",
      o.velarFricative === "x" ? "x" : "h",
    ].join(" · ");
  }

  // ---- State -------------------------------------------------------------

  let input = $state("");
  let opts = $state<Opts>({ ...DEFAULTS });
  let font = $state(DEFAULT_FONT);
  let fallbackStyle = $state<"strip" | "digraph">("strip");
  let outputTab = $state<"latin" | "ascii">("latin");
  let viewMode = $state<"text" | "list">("text");
  let allCaps = $state(false);
  let showCustomize = $state(false);
  let showKeyboard = $state(false);
  // Height of the bottom keyboard overlay, so the page can scroll clear of it.
  let keyboardHeight = $state(0);
  let expanded = $state<Record<string, boolean>>({});
  let copied = $state<string | null>(null);
  let isDragging = $state(false);
  let fileError = $state<string | null>(null);
  let fileInput = $state<HTMLInputElement | null>(null);
  let textareaRef = $state<HTMLTextAreaElement | null>(null);
  let outputRef = $state<HTMLDivElement | null>(null);

  const sampleGroups = $derived.by(() => {
    const t = i18n.t.playground;
    const groups = [
      { kind: "text", label: t.sampleGroupText, items: SAMPLE_TEXTS.filter((s) => (s.kind ?? "text") === "text") },
      { kind: "list", label: t.sampleGroupList, items: SAMPLE_TEXTS.filter((s) => s.kind === "list") },
    ];
    return viewMode === "list" ? [groups[1], groups[0]] : groups;
  });

  const activeVariant = $derived(VARIANTS.find((v) => sameOpts(v.opts, opts)));
  const caseMode = $derived(caseModeFor(opts));
  const cased = (text: string) => (allCaps ? upperStr(text, caseMode) : text);
  const display = $derived(cyrToJany(cased(input), opts));
  const fallbackDisplay = $derived(janyToFallback(display, fallbackStyle));

  // List view (§9.6): each non-empty line is one entry. The two columns are
  // sorted independently — the source by the Kyrgyz Cyrillic alphabet, the
  // result by the active configuration's order — so the rows fall out of
  // alignment exactly where the two orders disagree.
  const listEntries = $derived.by(() => {
    if (viewMode !== "list") return null;
    const lines = input.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return null;
    const convert = (line: string) => {
      const latin = cyrToJany(cased(line), opts);
      return outputTab === "latin" ? latin : janyToFallback(latin, fallbackStyle);
    };
    return {
      cyr: [...lines].sort(compareCyrillic),
      lat: lines.map(convert).sort((a, b) => compare(a, b, opts)),
    };
  });

  const output = $derived(
    listEntries
      ? listEntries.lat.join("\n")
      : outputTab === "latin"
        ? display
        : fallbackDisplay,
  );
  const wordCount = $derived(input.trim() ? input.trim().split(/\s+/).length : 0);

  const comparisons = $derived(
    input.trim()
      ? VARIANTS.map((v) => ({ variant: v, text: cyrToJany(input, v.opts) }))
      : [],
  );

  // Also probe the marked glide / ñ when selected, so fonts lacking them grey out.
  const activeProbe = $derived(
    getProbeForVowelMode(opts.vowels) +
      ({ "breve-i": "ĭĬ", "tilde-i": "ĩĨ" }[opts.glideGrapheme as string] ?? "") +
      (opts.velarNasal === "tilde-n" ? "ñÑ" : ""),
  );

  // ---- Letter options ----------------------------------------------------

  interface Choice {
    value: string;
    glyph: string;
    desc: string;
  }
  interface OptionRow {
    key: OptKey;
    label: string;
    choices: Choice[];
  }

  const optionRows = $derived.by<OptionRow[]>(() => {
    const t = i18n.t.playground;
    return [
      {
        key: "vowels",
        label: t.vowelModeLabel,
        choices: [
          { value: "latin-umlaut", glyph: "ö ü", desc: t.vowelLatinUmlaut },
          { value: "hybrid", glyph: "ө ü", desc: t.vowelHybrid },
          { value: "cyrillic-u", glyph: "ө ұ", desc: t.vowelCyrillicU },
          { value: "draft-macron", glyph: "ө ū", desc: t.vowelMacronU },
        ],
      },
      {
        key: "yGrapheme",
        label: t.yGraphemeLabel,
        choices: [
          { value: "y", glyph: "y", desc: t.yGraphemeY },
          { value: "dotless-i", glyph: "ı", desc: t.yGraphemeDotlessI },
        ],
      },
      {
        key: "glideGrapheme",
        label: t.glideGraphemeLabel,
        choices: [
          { value: "acute-i", glyph: "í", desc: t.glideGraphemeAcuteI },
          { value: "breve-i", glyph: "ĭ", desc: t.glideGraphemeBreveI },
          { value: "tilde-i", glyph: "ĩ", desc: t.glideGraphemeTildeI },
          { value: "i", glyph: "i", desc: t.glideGraphemePlainI },
          { value: "y", glyph: "y", desc: t.glideGraphemeY },
        ],
      },
      {
        key: "sibilants",
        label: t.sibilantModeLabel,
        choices: [
          { value: "cedilla", glyph: "ç ş", desc: t.sibilantCedilla },
          { value: "digraph", glyph: "ch sh", desc: t.sibilantDigraph },
        ],
      },
      {
        key: "signs",
        label: t.signsModeLabel,
        choices: [
          { value: "absorbed", glyph: "obíekt", desc: t.signsAbsorbed },
          { value: "apostrophe", glyph: "ob'ekt", desc: t.signsApostrophe },
        ],
      },
      {
        key: "velarNasal",
        label: t.velarNasalLabel,
        choices: [
          { value: "eng", glyph: "ŋ", desc: t.velarNasalEng },
          { value: "tilde-n", glyph: "ñ", desc: t.velarNasalTildeN },
        ],
      },
      {
        key: "uvularK",
        label: t.uvularKLabel,
        choices: [
          { value: "k", glyph: "k", desc: t.uvularKUnified },
          { value: "q", glyph: "k q", desc: t.uvularKAllophonic },
        ],
      },
      {
        key: "uvularG",
        label: t.uvularGLabel,
        choices: [
          { value: "g", glyph: "g", desc: t.uvularGUnified },
          { value: "ğ", glyph: "g ğ", desc: t.uvularGAllophonic },
        ],
      },
      {
        key: "affricate",
        label: t.affricateLabel,
        choices: [
          { value: "j", glyph: "j", desc: t.affricateUnified },
          { value: "c", glyph: "c", desc: t.affricateMechanical },
        ],
      },
      {
        key: "velarFricative",
        label: t.velarFricativeLabel,
        choices: [
          { value: "h", glyph: "h", desc: t.velarFricativeH },
          { value: "x", glyph: "x", desc: t.velarFricativeX },
        ],
      },
    ];
  });

  // A `y` that would write both ы and й is blocked (§4.4); the testbed
  // resolvers handle the remaining couplings (§11.1).
  function isDisabled(key: OptKey, value: string): boolean {
    return (
      (key === "yGrapheme" && value === "y" && opts.glideGrapheme === "y") ||
      (key === "glideGrapheme" && value === "y" && opts.yGrapheme === "y")
    );
  }

  function setOption(key: OptKey, value: string) {
    const coupled = {
      yGrapheme: opts.yGrapheme,
      glideGrapheme: opts.glideGrapheme,
      uvularK: opts.uvularK,
      uvularG: opts.uvularG,
    };
    if (key === "yGrapheme") {
      Object.assign(opts, resolveYGraphemeChange(coupled, value as Opts["yGrapheme"]));
    } else if (key === "glideGrapheme") {
      Object.assign(opts, resolveGlideGraphemeChange(coupled, value as Opts["glideGrapheme"]));
    } else if (key === "uvularK") {
      Object.assign(opts, resolveUvularKChange(coupled, value as Opts["uvularK"]));
    } else {
      (opts as Record<OptKey, string>)[key] = value;
    }
  }

  function applyVariant(v: Variant) {
    opts = { ...v.opts };
  }

  function stripColon(label: string): string {
    return label.replace(/\s*:\s*$/, "");
  }

  // Marks words that differ from the current result, so the comparison shows
  // what a variant actually changes instead of repeating the whole text.
  function diffTokens(text: string, base: string): { t: string; diff: boolean }[] {
    const a = text.split(/(\s+)/);
    const b = base.split(/(\s+)/);
    const aligned = a.length === b.length;
    return a.map((t, i) => ({ t, diff: aligned && t !== b[i] && /\S/.test(t) }));
  }

  function isLong(text: string): boolean {
    return text.length > 280 || text.split("\n").length > 3;
  }

  // ---- Voting ------------------------------------------------------------

  let voteModalOpen = $state(false);
  let voteTarget = $state<{ card: string; options: JanyOptions; presetName: string }>({
    card: "primary_output",
    options: {},
    presetName: SCRIPT_NAME,
  });
  let votedCombinations = $state<Record<string, boolean>>({});

  // Key format predates velarNasal, uvularG, affricate, and velarFricative; they are appended only when
  // non-default so earlier stored votes still match.
  function getCombinationKey(o: JanyOptions, isAscii = false): string {
    const parts: string[] = [
      o.vowels ?? "latin-umlaut",
      o.yGrapheme ?? "y",
      o.glideGrapheme ?? "acute-i",
      o.sibilants ?? "cedilla",
      o.signs ?? "absorbed",
      o.uvularK ?? "k",
    ];
    if (o.velarNasal && o.velarNasal !== "eng") parts.push(o.velarNasal);
    if (o.uvularG && o.uvularG !== "g") parts.push(`uvularG-${o.uvularG}`);
    if (o.affricate && o.affricate !== "j") parts.push(`affricate-${o.affricate}`);
    if (o.velarFricative && o.velarFricative !== "h") parts.push(`velarFricative-${o.velarFricative}`);
    const key = parts.join("|");
    return isAscii ? `ascii:${key}` : key;
  }

  function hasVoted(card: string, o: JanyOptions): boolean {
    return Boolean(votedCombinations[getCombinationKey(o, card === "compAscii")]);
  }

  onMount(() => {
    try {
      const stored = localStorage.getItem("jany_voted_combinations");
      if (stored) votedCombinations = JSON.parse(stored);
    } catch {}
  });

  function openVoteModal(card: string, options: JanyOptions, presetName: string) {
    if (hasVoted(card, options)) return;
    voteTarget = { card, options: { ...options }, presetName };
    voteModalOpen = true;
  }

  function voteForOutput() {
    if (outputTab === "ascii") {
      openVoteModal("compAscii", opts, "ASCII Fallback");
    } else {
      openVoteModal("primary_output", opts, activeVariant?.voteName ?? "Custom");
    }
  }

  function handleVoteSubmitted(card: string) {
    votedCombinations[getCombinationKey(voteTarget.options, card === "compAscii")] = true;
    try {
      localStorage.setItem("jany_voted_combinations", JSON.stringify(votedCombinations));
    } catch {}
  }

  const outputVoteCard = $derived(outputTab === "ascii" ? "compAscii" : "primary_output");
  const hasVotedOutput = $derived(hasVoted(outputVoteCard, opts));

  // ---- Input actions -----------------------------------------------------

  async function copy(which: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      copied = which;
      if (posthog.__loaded) {
        posthog.capture("text_copied", { copy_target: which });
      }
    } catch {
      copied = "failed";
    }
    setTimeout(() => {
      copied = null;
    }, 1200);
  }

  function handleFile(file: File) {
    fileError = null;
    if (file.size > 2 * 1024 * 1024) {
      fileError = i18n.t.playground.fileTooLarge;
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        input = reader.result;
        if (posthog.__loaded) {
          posthog.capture("file_uploaded", {
            file_name: file.name,
            file_size: file.size,
          });
        }
      }
    };
    reader.readAsText(file, "utf-8");
  }

  function handleFileInputChange(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      handleFile(file);
      target.value = "";
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  }

  function sampleTitle(s: (typeof SAMPLE_TEXTS)[number]): string {
    const l = i18n.locale;
    return s.title[l === "ky-jany" ? "ky" : l];
  }

  function handleSampleSelect(e: Event) {
    const target = e.currentTarget as HTMLSelectElement;
    if (target.value === SOUTHERN_SAMPLE) {
      // Southern-dialect ä is Latin in the source and passes through unchanged.
      const words = "äkä källä gäldir, xäräm bolot, ükämdan sura, mäxalläda bar";
      input = input ? `${input} ${words}` : words;
    } else {
      const sample = SAMPLE_TEXTS.find((s) => s.id === target.value);
      if (sample) {
        input = sample.content;
        // A list sample is one entry per line and is meant to be sorted, so it
        // carries its own view; prose samples put the view back.
        viewMode = sample.kind === "list" ? "list" : "text";
        if (posthog.__loaded) {
          posthog.capture("sample_selected", { sample_id: sample.id });
        }
      }
    }
    target.value = "";
  }

  function downloadTransliteration() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const presetName = (activeVariant?.id ?? "custom") + (outputTab === "ascii" ? "-ascii" : "");
    a.download = `jany-latyn-${presetName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (posthog.__loaded) {
      posthog.capture("file_downloaded", {
        preset: presetName,
        text_length: output.length,
      });
    }
  }

  function handleKeyboardInsert(char: string) {
    if (!textareaRef) {
      input = char === "\b" ? input.slice(0, -1) : input + char;
      return;
    }

    const start = textareaRef.selectionStart ?? input.length;
    const end = textareaRef.selectionEnd ?? input.length;
    let caret = start;

    if (char === "\b") {
      if (start === end && start > 0) {
        input = input.slice(0, start - 1) + input.slice(end);
        caret = start - 1;
      } else if (start !== end) {
        input = input.slice(0, start) + input.slice(end);
      }
    } else {
      input = input.slice(0, start) + char + input.slice(end);
      caret = start + char.length;
    }

    setTimeout(() => {
      if (textareaRef) {
        textareaRef.selectionStart = textareaRef.selectionEnd = caret;
        textareaRef.focus();
      }
    }, 0);
  }

  // Keep the output aligned with the input while scrolling long texts.
  function syncScroll() {
    if (!textareaRef || !outputRef) return;
    const max = textareaRef.scrollHeight - textareaRef.clientHeight;
    const ratio = max > 0 ? textareaRef.scrollTop / max : 0;
    outputRef.scrollTop = ratio * (outputRef.scrollHeight - outputRef.clientHeight);
  }
</script>

<h1 class="sr-only">{SITE_NAME}</h1>

<div class="space-y-5" style:padding-bottom={keyboardHeight ? `${keyboardHeight}px` : null}>
  <!-- Variant switcher -->
  <section class="rounded-box border border-base-300 bg-base-200/60 p-3 sm:p-4">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-3">
      <span class="text-sm font-medium text-base-content/70">{i18n.t.playground.variantLabel}</span>
      <div class="tabs tabs-box tabs-sm flex-wrap bg-base-100" role="tablist">
        {#each VARIANTS as v}
          <button
            type="button"
            role="tab"
            class="tab"
            class:tab-active={activeVariant?.id === v.id}
            aria-selected={activeVariant?.id === v.id}
            onclick={() => applyVariant(v)}
          >
            {variantName(v)}
          </button>
        {/each}
        <button
          type="button"
          role="tab"
          class="tab"
          class:tab-active={!activeVariant}
          aria-selected={!activeVariant}
          onclick={() => (showCustomize = true)}
        >
          {i18n.t.playground.variantCustom}
        </button>
      </div>
      <div class="ml-auto flex flex-wrap items-center gap-2">
        <FontSelect bind:value={font} probe={activeProbe} location="playground" />
        <button
          type="button"
          class="btn btn-ghost btn-sm gap-2"
          aria-expanded={showCustomize}
          onclick={() => (showCustomize = !showCustomize)}
        >
          <Icon name="sliders" />
          <span>{i18n.t.playground.customize}</span>
          <Icon name="chevronDown" class="transition-transform {showCustomize ? 'rotate-180' : ''}" />
        </button>
      </div>
    </div>

    <p class="mt-2 text-sm text-base-content/70">
      {variantDesc(activeVariant)}
      <span class="ml-1 font-mono text-xs text-base-content/50">{summary(opts)}</span>
    </p>

    {#if showCustomize}
      <div class="mt-4 grid gap-x-8 gap-y-5 border-t border-base-300 pt-4 sm:grid-cols-2 lg:grid-cols-3">
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
            {#if row.key === "glideGrapheme" && hasTildeClash(opts)}
              <p class="flex gap-1.5 text-xs text-base-content/70">
                <Icon name="alert" size={14} class="mt-px text-warning" />
                <span>{i18n.t.playground.tildeClashNote}</span>
              </p>
            {/if}
            {#if row.key === "uvularK" && opts.uvularK === "q"}
              <p class="flex gap-1.5 text-xs text-base-content/70">
                <Icon name="info" size={14} class="mt-px text-info" />
                <span>{i18n.t.playground.uvularKAutoNote}</span>
              </p>
              <p class="flex gap-1.5 text-xs text-base-content/70">
                <Icon name="alert" size={14} class="mt-px text-warning" />
                <span>{i18n.t.playground.uvularKWarningLoanwords}</span>
              </p>
            {/if}
            {#if row.key === "uvularG" && opts.uvularG === "ğ"}
              <p class="flex gap-1.5 text-xs text-base-content/70">
                <Icon name="alert" size={14} class="mt-px text-warning" />
                <span>{i18n.t.playground.uvularGWarningLoanwords}</span>
              </p>
            {/if}
            {#if row.key === "affricate" && opts.affricate === "c"}
              <p class="flex gap-1.5 text-xs text-base-content/70">
                <Icon name="alert" size={14} class="mt-px text-warning" />
                <span>{i18n.t.playground.affricateWarningLoanwords}</span>
              </p>
            {/if}
            {#if row.key === "velarFricative" && opts.velarFricative === "x"}
              <p class="flex gap-1.5 text-xs text-base-content/70">
                <Icon name="info" size={14} class="mt-px text-info" />
                <span>{i18n.t.playground.velarFricativeNote}</span>
              </p>
            {/if}
          </div>
        {/each}

        <div class="flex items-end sm:col-span-2 lg:col-span-3">
          <button
            type="button"
            class="btn btn-ghost btn-sm gap-2"
            disabled={activeVariant?.id === "standard"}
            onclick={() => applyVariant(VARIANTS[0])}
          >
            <Icon name="reset" />
            {i18n.t.playground.resetOptions}
          </button>
        </div>
      </div>
    {/if}
  </section>

  <!-- Editor -->
  <div class="grid gap-4 lg:grid-cols-2">
    <!-- Input pane -->
    <section
      class="order-1 flex flex-col overflow-hidden rounded-box border bg-base-100 transition-colors {isDragging
        ? 'border-primary ring-2 ring-primary/30'
        : 'border-base-300'}"
    >
      <header class="flex min-h-12 flex-wrap items-center gap-2 border-b border-base-300 px-3 py-1.5">
        <h2 class="shrink-0 text-sm font-medium">{i18n.t.playground.inputTitle}</h2>
        <div class="join shrink-0" role="group" aria-label={i18n.t.playground.viewModeList}>
          {#each [["text", i18n.t.playground.viewModeText], ["list", i18n.t.playground.viewModeList]] as [value, label]}
            <button
              type="button"
              class="btn btn-xs join-item font-normal {viewMode === value
                ? 'btn-primary'
                : 'btn-outline border-base-300'}"
              aria-pressed={viewMode === value}
              onclick={() => (viewMode = value as "text" | "list")}
            >
              {label}
            </button>
          {/each}
        </div>
        <div class="ml-auto flex w-full items-center gap-1 sm:w-auto">
          <select
            class="select select-ghost select-sm min-w-0 flex-1 sm:w-56 sm:flex-none"
            onchange={handleSampleSelect}
            aria-label={i18n.t.playground.selectSample}
          >
            <option value="" disabled selected>{i18n.t.playground.selectSample}</option>
            {#each sampleGroups as group (group.kind)}
              <optgroup label={group.label}>
                {#each group.items as s (s.id)}
                  <option value={s.id}>{sampleTitle(s)}</option>
                {/each}
              </optgroup>
            {/each}
            <option value={SOUTHERN_SAMPLE}>{stripColon(i18n.t.playground.southernHelperTitle)}</option>
          </select>
          <input
            type="file"
            accept=".txt,.md,text/plain,text/markdown"
            class="hidden"
            bind:this={fileInput}
            onchange={handleFileInputChange}
          />
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-square"
            onclick={() => fileInput?.click()}
            title={i18n.t.playground.uploadText}
            aria-label={i18n.t.playground.uploadText}
          >
            <Icon name="upload" />
          </button>
          <button
            type="button"
            class="btn btn-sm btn-square {showKeyboard ? 'btn-primary' : 'btn-ghost'}"
            onclick={() => (showKeyboard = !showKeyboard)}
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
        bind:value={input}
        class="h-56 w-full resize-none bg-transparent p-4 text-lg leading-relaxed outline-none placeholder:text-base-content/40 sm:h-72 lg:h-96"
        style:font-family={font}
        placeholder={i18n.t.playground.placeholder}
        aria-label={i18n.t.playground.inputTitle}
        onscroll={syncScroll}
        ondragover={(e) => {
          e.preventDefault();
          isDragging = true;
        }}
        ondragleave={() => (isDragging = false)}
        ondrop={handleDrop}
      ></textarea>

      <footer class="flex min-h-10 items-center gap-2 border-t border-base-300 px-3 text-xs text-base-content/60">
        {#if fileError}
          <span class="text-error">{fileError}</span>
        {:else}
          <span>{wordCount} {i18n.t.playground.words} · {input.length}</span>
        {/if}
        <div class="ml-auto flex items-center gap-1">
          <button
            type="button"
            class="btn btn-ghost btn-xs gap-1"
            disabled={!input}
            onclick={() => copy("in", input)}
          >
            <Icon name={copied === "in" ? "check" : "copy"} size={14} />
            {copied === "in" ? i18n.t.playground.copied : i18n.t.playground.copyInput}
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-xs gap-1"
            disabled={!input}
            onclick={() => (input = "")}
          >
            <Icon name="x" size={14} />
            {i18n.t.playground.clearInput}
          </button>
        </div>
      </footer>
    </section>

    <!-- Output pane -->
    <section class="order-3 flex flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 lg:order-2">
      <header class="flex min-h-12 flex-wrap items-center gap-2 border-b border-base-300 px-3 py-1.5">
        <div class="tabs tabs-border tabs-sm shrink-0" role="tablist">
          <button
            type="button"
            role="tab"
            class="tab"
            class:tab-active={outputTab === "latin"}
            aria-selected={outputTab === "latin"}
            onclick={() => (outputTab = "latin")}
          >
            {i18n.t.playground.outputTitle}
          </button>
          <button
            type="button"
            role="tab"
            class="tab"
            class:tab-active={outputTab === "ascii"}
            aria-selected={outputTab === "ascii"}
            onclick={() => (outputTab = "ascii")}
          >
            ASCII
          </button>
        </div>
        <div class="ml-auto flex items-center gap-1">
          <button
            type="button"
            class="btn btn-sm shrink-0 font-normal {allCaps ? 'btn-primary' : 'btn-ghost'}"
            aria-pressed={allCaps}
            title={i18n.t.playground.allCapsHint}
            onclick={() => (allCaps = !allCaps)}
          >
            {i18n.t.playground.allCaps}
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-square {hasVotedOutput ? 'text-error' : ''}"
            disabled={!input.trim() || hasVotedOutput}
            onclick={voteForOutput}
            title={hasVotedOutput ? i18n.t.playground.votedBadge : i18n.t.playground.voteButton}
            aria-label={i18n.t.playground.voteButton}
          >
            <Icon name="heart" filled={hasVotedOutput} />
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-square"
            disabled={!input}
            onclick={downloadTransliteration}
            title={i18n.t.playground.downloadText}
            aria-label={i18n.t.playground.downloadText}
          >
            <Icon name="download" />
          </button>
          <button
            type="button"
            class="btn btn-primary btn-sm gap-1.5"
            disabled={!input}
            onclick={() => copy("jany", output)}
          >
            <Icon name={copied === "jany" ? "check" : "copy"} />
            {copied === "jany"
              ? i18n.t.playground.copied
              : copied === "failed"
                ? i18n.t.playground.copyFailed
                : i18n.t.playground.copy}
          </button>
        </div>
      </header>

      <div
        bind:this={outputRef}
        class="h-56 overflow-auto whitespace-pre-wrap break-words p-4 text-lg leading-relaxed sm:h-72 lg:h-96"
        style:font-family={font}
        aria-live="polite"
      >
        {#if listEntries}
          <div class="grid grid-cols-[1fr_1fr] gap-x-4 whitespace-normal">
            <div class="sticky top-0 bg-base-100 pb-1 text-xs font-medium text-base-content/60">
              {i18n.t.playground.listSourceColumn}
            </div>
            <div class="sticky top-0 bg-base-100 pb-1 text-xs font-medium text-base-content/60">
              {i18n.t.playground.listResultColumn}
            </div>
            {#each listEntries.cyr as entry, i}
              <div class="border-t border-base-200 py-0.5">{entry}</div>
              <div class="border-t border-base-200 py-0.5">{listEntries.lat[i]}</div>
            {/each}
          </div>
        {:else if output}
          {output}
        {:else}
          <span class="text-base-content/40">{i18n.t.playground.emptyOutput}</span>
        {/if}
      </div>

      <footer class="flex min-h-10 flex-wrap items-center gap-2 border-t border-base-300 px-3 text-xs text-base-content/60">
        {#if listEntries}
          <span class="basis-full sm:basis-auto">{i18n.t.playground.listHint}</span>
        {/if}
        {#if outputTab === "ascii"}
          <span class="shrink-0">{stripColon(i18n.t.playground.fallbackStyleLabel)}</span>
          <div class="join">
            {#each [["strip", i18n.t.playground.fallbackStyleStrip], ["digraph", i18n.t.playground.fallbackStyleDigraph]] as [value, label]}
              <button
                type="button"
                class="btn btn-xs join-item font-normal {fallbackStyle === value ? 'btn-primary' : 'btn-outline border-base-300'}"
                onclick={() => (fallbackStyle = value as "strip" | "digraph")}
              >
                {label}
              </button>
            {/each}
          </div>
        {:else}
          <span class="truncate font-mono">{activeVariant ? variantName(activeVariant) : i18n.t.playground.variantCustom} · {summary(opts)}</span>
        {/if}
      </footer>
    </section>
  </div>

  <!-- Comparison -->
  {#if comparisons.length}
    <section class="space-y-3">
      <div>
        <h2 class="text-base font-semibold">{i18n.t.playground.comparisonTitle}</h2>
        <p class="text-sm text-base-content/60">{i18n.t.playground.compareHint}</p>
      </div>

      <ul class="grid gap-3 md:grid-cols-2">
        {#each comparisons as { variant, text } (variant.id)}
          {@const isCurrent = activeVariant?.id === variant.id}
          {@const isOpen = expanded[variant.id]}
          {@const voted = hasVoted(variant.card, variant.opts)}
          <li
            class="flex flex-col rounded-box border p-3 sm:p-4 {isCurrent
              ? 'border-primary/50 bg-primary/5'
              : 'border-base-300 bg-base-100'}"
          >
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium">{variantName(variant)}</span>
              {#if isCurrent}
                <span class="badge badge-primary badge-sm">{i18n.t.playground.currentBadge}</span>
              {/if}
              <div class="ml-auto flex items-center gap-0.5">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-square {voted ? 'text-error' : ''}"
                  disabled={voted}
                  onclick={() => openVoteModal(variant.card, variant.opts, variant.voteName)}
                  title={voted ? i18n.t.playground.votedBadge : i18n.t.playground.voteButton}
                  aria-label={i18n.t.playground.voteButton}
                >
                  <Icon name="heart" size={14} filled={voted} />
                </button>
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-square"
                  onclick={() => copy(variant.card, text)}
                  title={i18n.t.playground.copy}
                  aria-label={i18n.t.playground.copy}
                >
                  <Icon name={copied === variant.card ? "check" : "copy"} size={14} />
                </button>
                {#if !isCurrent}
                  <button type="button" class="btn btn-outline btn-xs ml-1" onclick={() => applyVariant(variant)}>
                    {i18n.t.playground.useVariant}
                  </button>
                {/if}
              </div>
            </div>
            <div class="mt-0.5 font-mono text-xs text-base-content/50">{summary(variant.opts)}</div>

            <p
              class="mt-2 whitespace-pre-wrap break-words text-base leading-relaxed {isOpen
                ? 'max-h-96 overflow-auto'
                : 'line-clamp-3'}"
              style:font-family={font}
            >
              {#each diffTokens(text, display) as tok}{#if tok.diff}<mark class="rounded-sm bg-warning/30 text-inherit">{tok.t}</mark>{:else}{tok.t}{/if}{/each}
            </p>
            {#if isLong(text)}
              <button
                type="button"
                class="link link-hover mt-1 self-start text-xs text-base-content/60"
                onclick={() => (expanded[variant.id] = !isOpen)}
              >
                {isOpen ? i18n.t.playground.showLess : i18n.t.playground.showMore}
              </button>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/if}
</div>

<VoteModal
  isOpen={voteModalOpen}
  options={voteTarget.options}
  presetName={voteTarget.presetName}
  targetCard={voteTarget.card}
  sampleLength={input.length}
  alreadyVoted={hasVoted(voteTarget.card, voteTarget.options)}
  onClose={() => (voteModalOpen = false)}
  onVoteSubmitted={handleVoteSubmitted}
/>

{#if showKeyboard}
  <VirtualKeyboard
    activeVowels={opts.vowels}
    activeY={opts.yGrapheme}
    activeGlide={opts.glideGrapheme}
    activeSibilants={opts.sibilants}
    activeK={opts.uvularK}
    activeG={opts.uvularG}
    activeNasal={opts.velarNasal}
    onInsert={handleKeyboardInsert}
    onClose={() => (showKeyboard = false)}
    onHeightChange={(h) => (keyboardHeight = h)}
  />
{/if}
