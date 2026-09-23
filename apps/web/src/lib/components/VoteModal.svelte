<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import posthog from 'posthog-js';
  import type { JanyOptions } from 'jany-latyn/convert';
  import { i18n } from '$lib/i18n/index.svelte';

  let {
    isOpen,
    options,
    presetName,
    targetCard,
    sampleLength = 0,
    alreadyVoted = false,
    onClose,
    onVoteSubmitted
  }: {
    isOpen: boolean;
    options: JanyOptions;
    presetName: string;
    targetCard: string;
    sampleLength?: number;
    alreadyVoted?: boolean;
    onClose: () => void;
    onVoteSubmitted: (targetCard: string) => void;
  } = $props();

  let selectedReason = $state<string>('natural_kyrgyz');
  let customNote = $state<string>('');
  let isSubmitting = $state(false);

  const REASONS = [
    {
      id: 'natural_kyrgyz',
      label: {
        ky: '«Кыргыз тилине эң жакын экен, менин оюмча»',
        ru: '«Наиболее естественно для кыргызского языка»',
        en: '“Most natural for Kyrgyz language”',
        tr: '«Bence Kırgızcaya en yakın ve doğal olanı»'
      }
    },
    {
      id: 'natural_turkic',
      label: {
        ky: '«Түрк тилдүү бир туугандарга тааныш жана жакын»',
        ru: '«Привычно для носителей других тюркских языков»',
        en: '“Natural for a Turkish / Turkic speaker”',
        tr: '«Türkçe / diğer Türk dilleri konuşurları için tanıdık»'
      }
    },
    {
      id: 'typing_ergonomics',
      label: {
        ky: '«Кадимки QWERTY клавиатурасында терүүгө эң ыңгайлуу»',
        ru: '«Удобнее всего для набора на стандартной QWERTY»',
        en: '“Most ergonomic for standard QWERTY typing”',
        tr: '«Standart QWERTY klavyede yazması en rahat olanı»'
      }
    },
    {
      id: 'typography_fonts',
      label: {
        ky: '«Ариптерде жана экранда кооз, туруктуу көрүнөт»',
        ru: '«Красивая типографика и стабильное отображение»',
        en: '“Best visual typography and font clarity”',
        tr: '«Yazı tiplerinde ve ekranda en estetik ve okunaklı olanı»'
      }
    },
    {
      id: 'other',
      label: {
        ky: 'Башка себеп…',
        ru: 'Другая причина…',
        en: 'Other reason…',
        tr: 'Diğer bir neden…'
      }
    }
  ];

  function submitVote() {
    if (alreadyVoted || isSubmitting) return;
    isSubmitting = true;

    if (posthog.__loaded) {
      posthog.capture('variant_voted', {
        preset: presetName,
        target_card: targetCard,
        vowels: options.vowels ?? 'latin-umlaut',
        y_grapheme: options.yGrapheme ?? 'y',
        glide_grapheme: options.glideGrapheme ?? 'acute-i',
        sibilants: options.sibilants ?? 'cedilla',
        signs: options.signs ?? 'absorbed',
        uvular_k: options.uvularK ?? 'k',
        velar_nasal: options.velarNasal ?? 'eng',
        uvular_g: options.uvularG ?? 'g',
        affricate: options.affricate ?? 'j',
        velar_fricative: options.velarFricative ?? 'h',
        reason_id: selectedReason,
        custom_note: customNote.trim() || undefined,
        text_length: sampleLength
      });
    }

    onVoteSubmitted(targetCard);
    isSubmitting = false;
    onClose();
  }
</script>

{#if isOpen}
  <div class="modal modal-open z-50">
    <div class="modal-box max-w-md space-y-4">
      <div class="flex items-center justify-between border-b border-base-content/10 pb-2">
        <h3 class="font-bold text-base sm:text-lg flex items-center gap-2">
          <span>💖</span>
          <span>{i18n.t.playground.voteButton}</span>
        </h3>
        <button type="button" class="btn btn-ghost btn-xs sm:btn-sm btn-circle" onclick={onClose}>✕</button>
      </div>

      <!-- Config Summary Badge -->
      <div class="p-2.5 rounded-lg bg-base-200 border border-base-content/10 text-xs sm:text-sm space-y-1">
        <div class="font-semibold text-base-content/70 uppercase text-[11px] tracking-wider">
          {presetName.toUpperCase()}
        </div>
        <div class="font-mono font-medium text-primary flex flex-wrap gap-1.5">
          <span class="badge badge-sm badge-neutral">{options.vowels ?? 'latin-umlaut'}</span>
          <span class="badge badge-sm badge-neutral">{options.yGrapheme === 'dotless-i' ? 'ı' : 'y'}</span>
          <span class="badge badge-sm badge-neutral">й→{({ y: 'y', i: 'i', 'breve-i': 'ĭ', 'tilde-i': 'ĩ' } as Record<string, string>)[options.glideGrapheme ?? ''] ?? 'í'}</span>
          <span class="badge badge-sm badge-neutral">{options.sibilants === 'cedilla' ? 'ç/ş' : 'ch/sh'}</span>
          <span class="badge badge-sm badge-neutral">{options.uvularK === 'q' ? 'k/q' : 'k'}</span>
          {#if options.velarNasal === 'tilde-n'}<span class="badge badge-sm badge-neutral">ñ</span>{/if}
          {#if options.uvularG === 'ğ'}<span class="badge badge-sm badge-neutral">g/ğ</span>{/if}
          {#if options.affricate === 'c'}<span class="badge badge-sm badge-neutral">ж→c</span>{/if}
          {#if options.velarFricative === 'x'}<span class="badge badge-sm badge-neutral">х→x</span>{/if}
        </div>
      </div>

      <!-- Reasons List -->
      <div class="space-y-2">
        <div class="text-xs sm:text-sm font-semibold text-base-content/80 block">
          {i18n.locale === 'en' ? 'Why do you prefer this option? (Optional)' : i18n.locale === 'ru' ? 'Почему вы выбрали этот вариант? (Необязательно)' : i18n.locale === 'tr' ? 'Bu seçeneği neden tercih ettiniz? (İsteğe bağlı)' : 'Эмне үчүн бул вариантты тандадыңыз? (Кааласаңыз)'}
        </div>

        <div class="space-y-1.5">
          {#each REASONS as r}
            <label class="flex items-start gap-2.5 p-2 rounded-lg hover:bg-base-200/60 cursor-pointer text-xs sm:text-sm transition-colors border border-transparent has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5">
              <input
                type="radio"
                name="voteReason"
                class="radio radio-xs sm:radio-sm radio-primary mt-0.5"
                value={r.id}
                bind:group={selectedReason}
              />
              <span class="leading-snug">{r.label[i18n.locale === 'en' ? 'en' : i18n.locale === 'ru' ? 'ru' : i18n.locale === 'tr' ? 'tr' : 'ky']}</span>
            </label>
          {/each}
        </div>

        {#if selectedReason === 'other'}
          <div class="pt-1.5">
            <input
              type="text"
              class="input input-bordered input-sm w-full text-xs sm:text-sm"
              placeholder={i18n.locale === 'en' ? 'Add your comment…' : i18n.locale === 'ru' ? 'Напишите комментарий…' : i18n.locale === 'tr' ? 'Yorumunuzu ekleyin…' : 'Оюңузду жазыңыз…'}
              bind:value={customNote}
            />
          </div>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div class="modal-action pt-2 border-t border-base-content/10">
        <button type="button" class="btn btn-sm btn-ghost" onclick={onClose}>
          {i18n.locale === 'en' ? 'Cancel' : i18n.locale === 'ru' ? 'Отмена' : i18n.locale === 'tr' ? 'İptal' : 'Жокко чыгаруу'}
        </button>
        <button type="button" class="btn btn-sm btn-primary gap-1" disabled={isSubmitting || alreadyVoted} onclick={submitVote}>
          {#if alreadyVoted}
            💖 {i18n.t.playground.votedBadge}
          {:else}
            💖 {i18n.locale === 'en' ? 'Submit Vote' : i18n.locale === 'ru' ? 'Проголосовать' : i18n.locale === 'tr' ? 'Oy Ver' : 'Добуш берүү'}
          {/if}
        </button>
      </div>
    </div>
    <button type="button" class="modal-backdrop bg-black/40" onclick={onClose}>close</button>
  </div>
{/if}
