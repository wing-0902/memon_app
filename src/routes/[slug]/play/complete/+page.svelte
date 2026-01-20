<script lang="ts">
  // ストアのインポート
  import { nowCorrectAnswers } from '$lib/data/answering.svelte';
  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';

  // SvelteKit
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let targetId = $derived(page.params.slug);
  const targetItem = $derived(itemStore.items.find((i) => i.id === targetId));

  onMount(() => {
    if (!targetItem) {
      goto('/');
      return;
    }
  });

  // wordStore初期化
  $effect(() => {
    if (targetId) {
      wordStore.load(targetId);
    }
  });
</script>

<div>
  {nowCorrectAnswers.list}
  {nowCorrectAnswers.wrongList}
</div>
