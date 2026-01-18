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

<div class='root'>
  {#if targetItem}
    <h2>{targetItem.displayName}</h2>
    <ul>
      <li>作成日時：{new Date(targetItem.createdAt).toLocaleString()}</li>
      <li>最終利用：{new Date(targetItem.lastUsed).toLocaleString()}</li>
    </ul>
  {/if}
</div>

<style lang='scss'>
  .root {
    ul {
      list-style: none;
      padding: 0;
    }
  }
</style>
