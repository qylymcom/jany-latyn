<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { consent } from '$lib/consent.svelte';
  import { i18n } from '$lib/i18n/index.svelte';

  onMount(() => consent.refresh());
</script>

{#if consent.status === 'pending'}
  <div
    class="fixed inset-x-0 bottom-0 z-50 border-t border-base-300 bg-base-100/95 p-4 shadow-lg backdrop-blur"
    role="region"
    aria-label={i18n.t.consent.learnMore}
  >
    <div class="container mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <p class="text-sm text-base-content/80">
        {i18n.t.consent.message}
        <a class="link" href="/about/#privacy">{i18n.t.consent.learnMore}</a>
      </p>
      <div class="flex shrink-0 gap-2">
        <button type="button" class="btn btn-sm btn-outline" onclick={() => consent.decline()}>
          {i18n.t.consent.decline}
        </button>
        <button type="button" class="btn btn-sm btn-primary" onclick={() => consent.accept()}>
          {i18n.t.consent.accept}
        </button>
      </div>
    </div>
  </div>
{/if}
