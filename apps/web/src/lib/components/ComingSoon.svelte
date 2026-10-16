<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { i18n } from '$lib/i18n/index.svelte';

  let { title, source }: { title: string; source: string } = $props();
  const REPO_URL = env.PUBLIC_REPO_URL ?? 'https://github.com/qylymcom/jany-latyn';
</script>

<svelte:head><title>{title} — {i18n.t.nav.siteTitle}</title></svelte:head>

<section class="mx-auto max-w-2xl space-y-3 py-10">
  <h1 class="text-2xl font-semibold">{title}</h1>
  <p>{i18n.t.site.comingSoon}</p>
  <p>{i18n.t.site.comingSoonSource} <a class="link" href="{REPO_URL}/blob/main/{source}">{source}</a></p>
</section>
