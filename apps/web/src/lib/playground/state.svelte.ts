// SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0
/**
 * Playground state (docs/superpowers/specs/2026-10-16-qylym-playground-design.md §3):
 * the input, the source and target pickers, each script's options, and the view
 * settings, with every conversion derived through jany-latyn/scripts. The target
 * and its settings are remembered between visits (§3.8); the page works the same
 * without storage, and stored values are checked before they are used.
 */
import { compare, compareCyrillic } from 'jany-latyn/collate';
import { caseModeFor, upperStr } from 'jany-latyn/casing';
import {
  convertText, detectScript, explainConversion, DEFAULT_LATIN_OPTIONS, LATIN_OPTION_VALUES, LATIN_PRESETS,
  type ConvertResult, type LatinOptions, type SchemeStatus, type SourceScript, type TargetScript,
} from 'jany-latyn/scripts';
import {
  DEFAULT_RUNE_OPTIONS, RUNE_OPTION_VALUES, RUNE_PRESETS, compareRunes, detectSpelling, isReversible,
  type ReaderTarget, type RuneOptions,
} from 'jany-latyn/runes';

export type SourceChoice = 'auto' | SourceScript;
export interface Comparison { id: string; name: string; status: SchemeStatus; text: string }

const STORAGE_KEY = 'qylym_playground';
const TARGETS: readonly TargetScript[] = ['cyrillic', 'latin', 'ascii', 'runes', 'reading'];
const READERS: readonly ReaderTarget[] = ['scholarly', 'cta', 'jany-latyn', 'cyrillic'];

const sameOptions = <T extends object>(a: T, b: T) => (Object.keys(a) as (keyof T)[]).every((k) => a[k] === b[k]);
const textOf = (r: ConvertResult) => (r.ok ? r.text : '');

export class Playground {
  input = $state('');
  source = $state<SourceChoice>('auto');
  target = $state<TargetScript>('latin');
  latin = $state<LatinOptions>({ ...DEFAULT_LATIN_OPTIONS });
  runes = $state<RuneOptions>({ ...DEFAULT_RUNE_OPTIONS });
  ascii = $state<'strip' | 'digraph'>('strip');
  reading = $state<ReaderTarget>('scholarly');
  restoreLoans = $state(false);
  allCaps = $state(false);
  viewMode = $state<'text' | 'list'>('text');
  showJanyLatyn = $state(true);

  readonly detected = $derived(detectScript(this.input));

  /** The script the input is read as: the picker's choice, or the detected one; mixed or empty input reads as Cyrillic. */
  readonly from = $derived<SourceScript>(
    this.source !== 'auto'
      ? this.source
      : this.detected.script === 'latin' || this.detected.script === 'runes'
        ? this.detected.script
        : 'cyrillic',
  );
  readonly guessing = $derived(this.source === 'auto' && this.detected.script === 'mixed');
  readonly oldSpelling = $derived(this.from === 'runes' && detectSpelling(this.input) === 'old');

  /** Old spelling can only be read (§3.2); Reading is only for runes, so other input falls back to Latin. */
  readonly to = $derived<TargetScript>(
    this.oldSpelling ? 'reading' : this.target === 'reading' && this.from !== 'runes' ? 'latin' : this.target,
  );

  readonly latinSource = $derived(this.detected.latin ?? { yGrapheme: 'y' as const, glideGrapheme: 'acute-i' as const });

  convert(to: TargetScript, overrides: { latin?: LatinOptions; runes?: RuneOptions; text?: string } = {}): ConvertResult {
    return convertText({
      text: overrides.text ?? this.input,
      from: this.from,
      to,
      latin: overrides.latin ?? this.latin,
      latinSource: this.latinSource,
      runes: overrides.runes ?? this.runes,
      ascii: this.ascii,
      reading: this.reading,
      restoreLoans: this.restoreLoans,
    });
  }

  private caps(text: string): string {
    return this.allCaps && this.to === 'latin' ? upperStr(text, caseModeFor(this.latin)) : text;
  }

  readonly result = $derived(this.convert(this.to));
  readonly output = $derived(this.caps(textOf(this.result)));

  readonly latinPreset = $derived(LATIN_PRESETS.find((p) => sameOptions(p.options, this.latin)));
  readonly runePreset = $derived(RUNE_PRESETS.find((p) => sameOptions(p.options, this.runes)));
  readonly reversible = $derived(isReversible(this.runes));

  /** Swap needs an output that can be read back as input (§3.7). */
  readonly canSwap = $derived(
    this.result.ok && this.input.trim() !== '' &&
      (this.to === 'cyrillic' || this.to === 'latin' || (this.to === 'runes' && this.reversible)),
  );

  swap(): void {
    if (!this.canSwap) return;
    const output = this.output;
    const newSource = this.to as SourceScript;
    this.target = this.from;
    this.source = this.source === 'auto' ? 'auto' : newSource;
    this.input = output;
  }

  /** The canonical Jany-Latyn beneath rune output (§3.4). */
  readonly janyLatynLine = $derived(
    this.to === 'runes' && this.showJanyLatyn ? textOf(this.convert('latin', { latin: { ...DEFAULT_LATIN_OPTIONS } })) : '',
  );

  /** The target script's other presets (§3.5). */
  readonly comparisons = $derived.by<Comparison[]>(() => {
    if (!this.input.trim()) return [];
    if (this.to === 'latin') {
      return LATIN_PRESETS.filter((p) => p !== this.latinPreset).map((p) => ({
        id: p.id, name: p.name, status: p.status, text: this.caps(textOf(this.convert('latin', { latin: { ...p.options } }))),
      }));
    }
    if (this.to === 'runes') {
      return RUNE_PRESETS.filter((p) => p !== this.runePreset).map((p) => ({
        id: p.id, name: p.name, status: p.status, text: textOf(this.convert('runes', { runes: { ...p.options } })),
      }));
    }
    return [];
  });

  /** One explanation per rune word of the output, for the inspector (§3.6). */
  readonly explanations = $derived(
    this.to === 'runes'
      ? explainConversion({ text: this.input, from: this.from, latinSource: this.latinSource, runes: this.runes, restoreLoans: this.restoreLoans })
      : [],
  );

  private order(script: TargetScript): (a: string, b: string) => number {
    if (script === 'cyrillic') return compareCyrillic;
    if (script === 'runes') return compareRunes;
    if (script === 'latin' || script === 'ascii') return (a, b) => compare(a, b, this.latin);
    return () => 0;
  }

  /** List view: each column sorted by its own script's order (§3.8). */
  readonly list = $derived.by(() => {
    if (this.viewMode !== 'list') return null;
    const lines = this.input.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return null;
    const results = lines.map((line) => this.caps(textOf(this.convert(this.to, { text: line }))));
    return {
      source: [...lines].sort(this.order(this.from)),
      result: results.sort(this.order(this.to)),
    };
  });

  private persisting = false;

  /** Writes the remembered settings; a no-op until restore() has run. */
  save(): void {
    // Read every field before the guard, so the page's $effect subscribes to them
    // on its first run (before restore()) and saves on every later change.
    const snapshot = JSON.stringify({
      target: this.target, latin: this.latin, runes: this.runes, ascii: this.ascii,
      reading: this.reading, showJanyLatyn: this.showJanyLatyn,
    });
    if (!this.persisting) return;
    try {
      localStorage.setItem(STORAGE_KEY, snapshot);
    } catch {
      // Storage blocked: the settings simply aren't remembered.
    }
  }

  /** Reads the remembered settings, keeping only values the options accept. */
  restore(): void {
    let s: Record<string, unknown> | null = null;
    try {
      s = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    } catch {
      s = null;
    }
    if (s && typeof s === 'object') {
      if (TARGETS.includes(s.target as TargetScript)) this.target = s.target as TargetScript;
      if (READERS.includes(s.reading as ReaderTarget)) this.reading = s.reading as ReaderTarget;
      if (s.ascii === 'strip' || s.ascii === 'digraph') this.ascii = s.ascii;
      if (typeof s.showJanyLatyn === 'boolean') this.showJanyLatyn = s.showJanyLatyn;
      const latin = (s.latin ?? {}) as Record<string, unknown>;
      const nextLatin = { ...this.latin } as Record<string, unknown>;
      for (const [k, values] of Object.entries(LATIN_OPTION_VALUES)) {
        if ((values as readonly unknown[]).includes(latin[k])) nextLatin[k] = latin[k];
      }
      this.latin = nextLatin as LatinOptions;
      const runes = (s.runes ?? {}) as Record<string, unknown>;
      const nextRunes = { ...this.runes } as Record<string, unknown>;
      for (const [k, values] of Object.entries(RUNE_OPTION_VALUES)) {
        if ((values as readonly unknown[]).includes(runes[k])) nextRunes[k] = runes[k];
      }
      this.runes = nextRunes as unknown as RuneOptions;
    }
    this.persisting = true;
    this.save();
  }
}
