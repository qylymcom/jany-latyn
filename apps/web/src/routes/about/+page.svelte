<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<script lang="ts">
  import { env } from '$env/dynamic/public';
  import { i18n } from '$lib/i18n/index.svelte';
  import posthog from 'posthog-js';

  const CONTACT_EMAIL = env.PUBLIC_CONTACT_EMAIL ?? 'salam@qylym.com';
  const SUPPORT_URL = env.PUBLIC_SUPPORT_URL ?? 'https://github.com/qylymcom/jany-latyn/issues';
  const REPO_URL = env.PUBLIC_REPO_URL ?? 'https://github.com/qylymcom/jany-latyn';
</script>

<h1 class="text-2xl font-bold mb-4">{i18n.t.about.title}</h1>

<div class="space-y-2">
  <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" checked />
    <div class="collapse-title font-medium">{i18n.t.about.whatIsThisTitle}</div>
    <div class="collapse-content">
      <p>{i18n.t.about.whatIsThisContent}</p>
    </div>
  </div>

  <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" />
    <div class="collapse-title font-medium">{i18n.t.about.usageTitle}</div>
    <div class="collapse-content">
      <p>{i18n.t.about.usagePlayground}</p>
      <p class="mt-2">{i18n.t.about.usageCli}</p>
    </div>
  </div>

  <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" />
    <div class="collapse-title font-medium">{i18n.t.about.specTitle}</div>
    <div class="collapse-content">
      <p>
        {i18n.t.about.specContent}
        <a class="link" href="{REPO_URL}/blob/main/docs/SPEC.md" onclick={() => posthog.__loaded && posthog.capture('repository_link_clicked')}>docs/SPEC.md</a>
      </p>
      <p class="mt-1">
        {i18n.t.about.license}
        <a class="link" href="{REPO_URL}/blob/main/LICENSING.md">LICENSING.md</a>
      </p>
    </div>
  </div>

  <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" />
    <div class="collapse-title font-medium">{i18n.t.about.contactTitle}</div>
    <div class="collapse-content">
      <p><a class="link" href="mailto:{CONTACT_EMAIL}" onclick={() => posthog.__loaded && posthog.capture('contact_link_clicked')}>{CONTACT_EMAIL}</a></p>
    </div>
  </div>

  <div class="collapse collapse-arrow bg-base-200">
    <input type="checkbox" />
    <div class="collapse-title font-medium">{i18n.t.about.supportTitle}</div>
    <div class="collapse-content">
      <p><a class="link" href={SUPPORT_URL} onclick={() => posthog.__loaded && posthog.capture('support_link_clicked')}>{SUPPORT_URL}</a></p>
    </div>
  </div>
</div>
