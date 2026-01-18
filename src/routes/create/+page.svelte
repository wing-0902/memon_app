<script lang="ts">
  let newName = $state('');
  import { itemStore } from '$lib/data/list.svelte';
  import { goto } from '$app/navigation';

  let dual = $state(false);

  function handleClick() {
    if (newName) {
      itemStore.addItem(newName, dual);
      goto('/');
    } else {
      alert('作成に失敗しました．');
      alreadyTrouble = true;
    }
  }
</script>

<svelte:head>
  <title>Create | Memon</title>
</svelte:head>

<div class="root">
  <h2>単語帳を作る</h2>
  <label for="newName">覚えやすい名前を入力してください．</label><br />
  <input
    id="newName"
    name="newName"
    type="text"
    bind:value={newName}
  /><br />
  <label>
    <input
      bind:checked={dual}
      type="checkbox"
    />
    双方向に出題
  </label><br />
  <button
    disabled={!newName}
    onclick={() => handleClick()}
    class="create">作成</button
  >
</div>

<style lang="scss">
  .root {
    input#newName {
      margin-top: 25px;
    }
    .create {
      margin-top: 30px;
      border: 1px solid var(--theme);
      height: 40px;
      width: 100px;
      border-radius: 20px;
      font-size: 20px;
      &:disabled {
        background: gray;
        color: var(--foreground);
      }
      background: transparent;
      color: var(--theme);
    }
  }
</style>
