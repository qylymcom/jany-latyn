<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { i18n } from '$lib/i18n/index.svelte';
  import DocPage from '$lib/components/DocPage.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>{i18n.t.tianshan.tabs.about} — {i18n.t.tianshan.title}</title></svelte:head>

<DocPage html={data.html} toc={data.toc} />
