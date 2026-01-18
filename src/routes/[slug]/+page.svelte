<script lang="ts">
  import { page } from '$app/state';

  let targetId = $derived(page.params.slug);

  import { itemStore } from '$lib/data/list.svelte';

  const targetItem = $derived(
        itemStore.items.find(i => i.id === targetId)
    );
</script>

<div>
  <h2>{targetItem.displayName}</h2>
  <small>現在のID：{targetId}</small>
</div>
