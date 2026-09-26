<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { env } from '$env/dynamic/public';
  import '../app.css';
  import { i18n, LOCALES } from '$lib/i18n/index.svelte';
  import type { Locale } from '$lib/i18n/types.js';
  import Icon from '$lib/components/Icon.svelte';
  import HeaderPicker from '$lib/components/HeaderPicker.svelte';
  import ConsentBanner from '$lib/components/ConsentBanner.svelte';
  import { readingFont } from '$lib/readingFont.svelte';
  import { FONTS } from '$lib/fonts';
  import { fontCovers, getProbeForVowelMode } from '$lib/fontcheck';
  import posthog from 'posthog-js';

  const SITE_NAME = env.PUBLIC_SITE_NAME ?? 'jany-latyn';
  let { children } = $props();

  const links = $derived([
    { href: '/', label: i18n.t.nav.playground },
    { href: '/alphabet/', label: i18n.t.nav.alphabet },
    { href: '/whitepaper/', label: i18n.t.nav.whitepaper },
    { href: '/about/', label: i18n.t.nav.about },
  ]);

  function isActive(href: string): boolean {
    const path = page.url.pathname;
    return href === '/' ? path === '/' : path.startsWith(href.replace(/\/$/, ''));
  }

  // The whitepaper's reading font, offered in the header so it stays reachable
  // anywhere in a long document. Fonts missing the Jany-Latyn glyphs grey out.
  const onWhitepaper = $derived(isActive('/whitepaper/'));
  const fontItems = $derived(
    FONTS.map((f) => ({
      value: f.stack,
      label: f.label,
      font: f.stack,
      disabled: f.probe !== '-apple-system' && !fontCovers(f.probe, getProbeForVowelMode())
    }))
  );
  const localeItems = $derived(LOCALES.map((l) => ({ value: l.id, label: l.label })));

  function selectFont(stack: string) {
    readingFont.stack = stack;
    const selected = FONTS.find((f) => f.stack === stack);
    if (selected && posthog.__loaded) {
      posthog.capture('font_selected', { location: 'whitepaper', font_label: selected.label });
    }
  }

  let theme = $state<'light' | 'dark'>('light');

  onMount(() => {
    const explicit = document.documentElement.dataset.theme;
    theme =
      explicit === 'dark' || explicit === 'light'
        ? explicit
        : matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('jany_theme', theme);
    } catch {}
  }
</script>

<svelte:head>
  <title>{SITE_NAME}</title>
</svelte:head>

<header class="navbar sticky top-0 z-30 min-h-14 border-b border-base-300 bg-base-100/90 px-2 backdrop-blur sm:px-4">
  <div class="navbar-start gap-1">
    <div class="dropdown lg:hidden">
      <button type="button" class="btn btn-ghost btn-square btn-sm" aria-label={i18n.t.nav.menu}>
        <Icon name="menu" size={18} />
      </button>
      <ul class="menu dropdown-content z-40 mt-2 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
        {#each links as l}
          <li><a href={l.href} class:menu-active={isActive(l.href)}>{l.label}</a></li>
        {/each}
      </ul>
    </div>
    <a class="px-2 text-lg font-semibold tracking-tight" href="/">{SITE_NAME}</a>
    <span class="hidden truncate text-sm text-base-content/60 xl:inline">{i18n.t.nav.scriptSubtitle}</span>
  </div>

  <nav class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal menu-sm gap-1">
      {#each links as l}
        <li><a href={l.href} class:menu-active={isActive(l.href)}>{l.label}</a></li>
      {/each}
    </ul>
  </nav>

  <div class="navbar-end gap-0.5 sm:gap-1">
    {#if onWhitepaper}
      <HeaderPicker
        items={fontItems}
        value={readingFont.stack}
        onSelect={selectFont}
        ariaLabel={i18n.t.playground.fontLabel.replace(/:$/, '')}
      >
        {#snippet trigger()}
          <!-- The type convention (Kindle, Apple Books, Safari Reader), shown in the chosen font -->
          <span class="text-base leading-none" style:font-family={readingFont.stack}>Aa</span>
        {/snippet}
      </HeaderPicker>
    {/if}
    <HeaderPicker
      items={localeItems}
      value={i18n.locale}
      onSelect={(v) => i18n.setLocale(v as Locale)}
      ariaLabel="Language"
    >
      {#snippet trigger()}
        <Icon name="globe" size={18} />
      {/snippet}
    </HeaderPicker>
    <button
      type="button"
      class="btn btn-ghost btn-square btn-sm"
      onclick={toggleTheme}
      aria-label={i18n.t.nav.themeToggle}
      title={i18n.t.nav.themeToggle}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  </div>
</header>

<main class="container mx-auto max-w-6xl px-4 py-6 sm:px-6">
  {@render children()}
</main>

<ConsentBanner />
