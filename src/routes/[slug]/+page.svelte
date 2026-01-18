<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  let targetId = $derived(page.params.slug);

  import { itemStore } from '$lib/data/list.svelte';

  const targetItem = $derived(itemStore.items.find((i) => i.id === targetId));

  if (!targetItem) {
    goto('/');
  }
</script>

<div>
  {#if targetItem}
    <h2>{targetItem.displayName}</h2>
    <small>現在のID：{targetId}</small>
  {/if}
</div>
