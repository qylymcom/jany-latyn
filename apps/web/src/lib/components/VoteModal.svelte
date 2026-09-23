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

  type Lang = 'ky' | 'ru' | 'en' | 'tr' | 'zh';
  // The Latin Kyrgyz interface shows these in Cyrillic Kyrgyz, as before.
  const lang = $derived<Lang>(i18n.locale === 'ky-jany' ? 'ky' : i18n.locale);

  const TEXT: Record<Lang, { why: string; comment: string; cancel: string; submit: string }> = {
    ky: { why: 'Эмне үчүн бул вариантты тандадыңыз? (Кааласаңыз)', comment: 'Оюңузду жазыңыз…', cancel: 'Жокко чыгаруу', submit: 'Добуш берүү' },
    ru: { why: 'Почему вы выбрали этот вариант? (Необязательно)', comment: 'Напишите комментарий…', cancel: 'Отмена', submit: 'Проголосовать' },
    en: { why: 'Why do you prefer this option? (Optional)', comment: 'Add your comment…', cancel: 'Cancel', submit: 'Submit Vote' },
    tr: { why: 'Bu seçeneği neden tercih ettiniz? (İsteğe bağlı)', comment: 'Yorumunuzu ekleyin…', cancel: 'İptal', submit: 'Oy Ver' },
    zh: { why: '你为什么选择这个方案？（可选）', comment: '写下你的意见…', cancel: '取消', submit: '提交投票' }
  };

  const REASONS = [
    {
      id: 'natural_kyrgyz',
      label: {
        ky: '«Кыргыз тилине эң жакын экен, менин оюмча»',
        ru: '«Наиболее естественно для кыргызского языка»',
        en: '“Most natural for Kyrgyz language”',
        tr: '«Bence Kırgızcaya en yakın ve doğal olanı»',
        zh: '«我认为最贴近吉尔吉斯语»'
      }
    },
    {
      id: 'natural_turkic',
      label: {
        ky: '«Түрк тилдүү бир туугандарга тааныш жана жакын»',
        ru: '«Привычно для носителей других тюркских языков»',
        en: '“Natural for a Turkish / Turkic speaker”',
        tr: '«Türkçe / diğer Türk dilleri konuşurları için tanıdık»',
        zh: '«对土耳其语 / 突厥语使用者最熟悉»'
      }
    },
    {
      id: 'typing_ergonomics',
      label: {
        ky: '«Кадимки QWERTY клавиатурасында терүүгө эң ыңгайлуу»',
        ru: '«Удобнее всего для набора на стандартной QWERTY»',
        en: '“Most ergonomic for standard QWERTY typing”',
        tr: '«Standart QWERTY klavyede yazması en rahat olanı»',
        zh: '«在标准 QWERTY 键盘上最好输入»'
      }
    },
    {
      id: 'typography_fonts',
      label: {
        ky: '«Ариптерде жана экранда кооз, туруктуу көрүнөт»',
        ru: '«Красивая типографика и стабильное отображение»',
        en: '“Best visual typography and font clarity”',
        tr: '«Yazı tiplerinde ve ekranda en estetik ve okunaklı olanı»',
        zh: '«字体效果最美观、显示最清晰»'
      }
    },
    {
      id: 'other',
      label: {
        ky: 'Башка себеп…',
        ru: 'Другая причина…',
        en: 'Other reason…',
        tr: 'Diğer bir neden…',
        zh: '其他原因…'
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
          {TEXT[lang].why}
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
              <span class="leading-snug">{r.label[lang]}</span>
            </label>
          {/each}
        </div>

        {#if selectedReason === 'other'}
          <div class="pt-1.5">
            <input
              type="text"
              class="input input-bordered input-sm w-full text-xs sm:text-sm"
              placeholder={TEXT[lang].comment}
              bind:value={customNote}
            />
          </div>
        {/if}
      </div>

      <!-- Action Buttons -->
      <div class="modal-action pt-2 border-t border-base-content/10">
        <button type="button" class="btn btn-sm btn-ghost" onclick={onClose}>
          {TEXT[lang].cancel}
        </button>
        <button type="button" class="btn btn-sm btn-primary gap-1" disabled={isSubmitting || alreadyVoted} onclick={submitVote}>
          {#if alreadyVoted}
            💖 {i18n.t.playground.votedBadge}
          {:else}
            💖 {TEXT[lang].submit}
          {/if}
        </button>
      </div>
    </div>
    <button type="button" class="modal-backdrop bg-black/40" onclick={onClose}>close</button>
  </div>
{/if}
