<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import { i18n } from '$lib/i18n/index.svelte';
  import DocPage from '$lib/components/DocPage.svelte';
  import Icon from '$lib/components/Icon.svelte';

  let { data }: { data: PageData } = $props();
</script>

<svelte:head>
  <title>{i18n.t.site.runicProposal} — {i18n.t.nav.siteTitle}</title>
  <meta name="description" content="Jany-Enesai: Modern Kyrgyz in the Old Turkic Script. A draft proposal for review." />
</svelte:head>

<DocPage html={data.html} toc={data.toc}>
  {#snippet banner()}
    <div role="note" class="alert alert-warning">
      <Icon name="alert" />
      <span>{i18n.t.site.draftBanner}</span>
    </div>
  {/snippet}
</DocPage>
