<!-- SPDX-License-Identifier: PolyForm-Noncommercial-1.0.0 -->
<!--
  A compact header control: an icon button that opens a list of choices.
  Native <select> boxes shrink under flex pressure at phone widths until the
  value runs under the caret, so the header uses a dropdown whose trigger is a
  fixed-size icon and whose labels live in the menu, where they have room.
  The current value's label appears beside the icon from `sm:` up.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from '$lib/components/Icon.svelte';

  interface Item {
    value: string;
    label: string;
    disabled?: boolean;
    font?: string; // renders the row in the font it selects
  }

  let {
    items,
    value,
    onSelect,
    ariaLabel,
    trigger
  }: {
    items: readonly Item[];
    value: string;
    onSelect: (value: string) => void;
    ariaLabel: string;
    trigger: Snippet;
  } = $props();

  const current = $derived(items.find((i) => i.value === value));

  // daisyUI opens the menu on :focus-within, so a chosen row must give up focus.
  function choose(event: MouseEvent, item: Item) {
    onSelect(item.value);
    (event.currentTarget as HTMLElement).blur();
  }
</script>

<div class="dropdown dropdown-end">
  <button
    type="button"
    class="btn btn-ghost btn-sm gap-1.5 px-2"
    aria-label={ariaLabel}
    aria-haspopup="listbox"
    title={current ? `${ariaLabel}: ${current.label}` : ariaLabel}
  >
    {@render trigger()}
    <span class="hidden max-w-32 truncate sm:inline">{current?.label ?? ''}</span>
    <Icon name="chevronDown" size={14} class="opacity-60" />
  </button>
  <ul
    class="menu dropdown-content z-40 mt-2 max-h-[70vh] w-56 flex-nowrap overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
    role="listbox"
    aria-label={ariaLabel}
  >
    {#each items as item (item.value)}
      <li>
        <button
          type="button"
          role="option"
          aria-selected={item.value === value}
          class:menu-active={item.value === value}
          disabled={item.disabled}
          style:font-family={item.font}
          onclick={(e) => choose(e, item)}
        >
          <span class="truncate">{item.label}</span>
        </button>
      </li>
    {/each}
  </ul>
</div>
