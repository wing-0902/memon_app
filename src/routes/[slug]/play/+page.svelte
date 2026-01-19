<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  let targetId = $derived(page.params.slug);

  import { itemStore } from '$lib/data/list.svelte';
  const targetItem = $derived(itemStore.items.find((i) => i.id === targetId));

  if (!targetItem) {
    goto("/");
  }
</script>

<svelte:head>
  <title>{targetItem?.displayName}のテストを開始 | Memon</title>
</svelte:head>

<div class='root'>
  <h2>{targetItem?.displayName}</h2>
  <h3>再生を開始</h3>
</div>