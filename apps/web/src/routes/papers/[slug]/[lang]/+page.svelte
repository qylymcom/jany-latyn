<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import type { PageData } from './$types';
  import PaperView from '$lib/components/PaperView.svelte';

  let { data }: { data: PageData } = $props();
</script>

<PaperView {data} />
