<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { page } from '$app/state';
  import { i18n } from '$lib/i18n/index.svelte';
  import Icon from '$lib/components/Icon.svelte';

  let { children } = $props();
  const t = $derived(i18n.t.tianshan);
  const BASE = '/runic/tianshan/';
  const tabs = $derived(
    (['overview', 'inscriptions', 'map', 'signs', 'phonemes', 'sources', 'about'] as const).map((k) => ({
      href: k === 'overview' ? BASE : `${BASE}${k}/`,
      label: t.tabs[k],
    })),
  );
  const active = (href: string) =>
    href === BASE ? page.url.pathname === BASE || page.url.pathname === BASE.slice(0, -1) : page.url.pathname.startsWith(href.slice(0, -1));
</script>

<div class="space-y-5">
  <header class="space-y-2">
    <h1 class="text-2xl font-semibold sm:text-3xl">{t.title}</h1>
    <p class="max-w-3xl text-base-content/70">{t.subtitle}</p>
    <div role="note" class="alert alert-info alert-soft max-w-3xl items-start text-sm">
      <Icon name="info" />
      <span>{t.status}</span>
    </div>
  </header>

  <nav aria-label={t.title} class="overflow-x-auto">
    <div class="tabs tabs-border flex-nowrap whitespace-nowrap">
      {#each tabs as tab}
        <a class="tab" class:tab-active={active(tab.href)} aria-current={active(tab.href) ? 'page' : undefined} href={tab.href}>{tab.label}</a>
      {/each}
    </div>
  </nav>

  {@render children()}
</div>
