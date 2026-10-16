<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { i18n } from '$lib/i18n/index.svelte';

  let { to }: { to: string } = $props();

  // Runs as the prerendered page is parsed, before anything else, so the #anchor
  // of an old link survives. Readers without scripting get the meta refresh.
  const forward = $derived(`<script>location.replace(${JSON.stringify(to)} + location.hash)</` + 'script>');

  // A client-side navigation to the old address renders this component without
  // reloading the page; forward it the same way.
  onMount(() => goto(to + location.hash, { replaceState: true }));
</script>

<svelte:head>
  {@html forward}
  <noscript><meta http-equiv="refresh" content="0; url={to}" /></noscript>
  <link rel="canonical" href={to} />
  <meta name="robots" content="noindex" />
</svelte:head>

<p class="py-10 text-center">{i18n.t.site.moved} <a class="link" href={to}>{to}</a></p>
