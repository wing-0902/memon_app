<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';

  let targetId = $derived(page.params.slug);
  let quizNum = $derived(Number(page.params.num));

  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';
  import localforage from 'localforage';

  // itemStoreの存在？
  const targetItem = $derived(itemStore.items.find((i) => i.id === targetId));
  
  if (!targetItem) {
    goto('/');
  }

  // wordStore初期化
  $effect(() => {
    if (targetId) {
      wordStore.load(targetId);
    }
  });

  $effect(() => {
    if (quizNum > Number(localforage.getItem('テストの出題数'))) {
      goto(`/${targetId}/play/complete/`)
    }
  })
</script>

<div class="root">
  <h2>Q.{quizNum}</h2>
</div>
