<script lang="ts">
  let newName = $state('');
  import { itemStore } from '$lib/data/list.svelte.ts';
  import { goto } from '$app/navigation';

  let alreadyTrouble = $state(false);

  function handleClick() {
    if (newName) {
      itemStore.addItem(newName);
      goto('/');
    } else {
      alert('作成に失敗しました．');
      alreadyTrouble = true;
    }
  }
</script>

<div class="root">
  <input
    type="text"
    bind:value={newName}
  />
  <button onclick={() => handleClick()}>作成</button>
</div>
