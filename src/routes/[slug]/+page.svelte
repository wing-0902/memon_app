<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  let targetId = $derived(page.params.slug);

  import { itemStore } from '$lib/data/list.svelte';

  const targetItem = $derived(itemStore.items.find((i) => i.id === targetId));

  if (!targetItem) {
    goto('/');
  }

  import { wordStore } from '$lib/data/words.svelte';
</script>

<div class="root">
  {#if targetItem}
    <h2>{targetItem.displayName}</h2>
    <ul>
      <li>作成日時：{new Date(targetItem.createdAt).toLocaleString()}</li>
      {#if targetItem.lastUsed}
        <li>最終利用：{new Date(targetItem.lastUsed).toLocaleString()}</li>
      {:else}
        <li>最終利用：未使用</li>
      {/if}
      <li>
        <label
          ><input
            type="checkbox"
            bind:checked={targetItem.is双方向}
          />双方向に出題</label
        >
      </li>
    </ul>
    <h3>単語帳</h3>
    <ul>
      <li class='addNew'>
        <input type='text' placeholder='おもて（問）' />
        <input type='text' placeholder='うら（答）' />
        <button>add</button>
      </li>
      {#each wordStore.words as word}
        <li>
          <strong>{word.front}</strong>
          <span>{word.back}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss">
  .root {
    width: 100%;
    ul {
      list-style: none;
      padding: 0;
      width: 100%;
    }
    li {
      &.addNew {
        display: flex;
        justify-content: center;
        input {
          max-width: calc(50% - 60px);
        }
        button {
          font-family: 'Material Icons Round', sans-serif;
          font-size: 24px;
          height: 40px;
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>
