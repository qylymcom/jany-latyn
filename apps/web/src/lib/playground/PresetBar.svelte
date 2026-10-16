<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { SchemeStatus } from 'jany-latyn/scripts';
  import { i18n } from '$lib/i18n/index.svelte';
  import Icon from '$lib/components/Icon.svelte';

  interface Item { id: string; name: string; status: SchemeStatus }
  let {
    items,
    activeId,
    customizeOpen,
    onSelect,
    onCustomize,
  }: {
    items: readonly Item[];
    activeId: string | undefined;
    customizeOpen: boolean;
    onSelect: (id: string) => void;
    onCustomize: () => void;
  } = $props();

  const BADGE: Record<SchemeStatus, string> = {
    proposed: 'badge-primary',
    reference: 'badge-info',
    comparison: 'badge-ghost',
    experimental: 'badge-warning',
  };
  const status = (s: SchemeStatus) =>
    ({
      proposed: i18n.t.scripts.statusProposed,
      reference: i18n.t.scripts.statusReference,
      comparison: i18n.t.scripts.statusComparison,
      experimental: i18n.t.scripts.statusExperimental,
    })[s];
</script>

<div class="flex flex-wrap items-center gap-2">
  <div class="tabs tabs-box tabs-sm flex-wrap bg-base-100" role="tablist">
    {#each items as p (p.id)}
      <button
        type="button"
        role="tab"
        class="tab gap-1.5"
        class:tab-active={activeId === p.id}
        aria-selected={activeId === p.id}
        onclick={() => onSelect(p.id)}
      >
        {p.name}
        <span class="badge badge-xs {BADGE[p.status]}">{status(p.status)}</span>
      </button>
    {/each}
    <button type="button" role="tab" class="tab" class:tab-active={!activeId} aria-selected={!activeId} onclick={onCustomize}>
      {i18n.t.playground.variantCustom}
    </button>
  </div>
  <button type="button" class="btn btn-ghost btn-sm ml-auto gap-2" aria-expanded={customizeOpen} onclick={onCustomize}>
    <Icon name="sliders" />
    <span>{i18n.t.playground.customize}</span>
    <Icon name="chevronDown" class="transition-transform {customizeOpen ? 'rotate-180' : ''}" />
  </button>
</div>
