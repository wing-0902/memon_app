<script lang="ts">
  import { goto } from '$app/navigation';
  import { itemStore } from '$lib/data/list.svelte';

  let isEditing: string = $state('');
</script>

<svelte:head>
  <title>Welcome to Memon</title>
</svelte:head>

<h2>ようこそ</h2>
{#if itemStore.items.length}
  <p>
    {itemStore.items.length}個の単語帳を表示中
  </p>
{:else}
  <p>まだ単語帳がありません．</p>
{/if}
<a href="/create/">単語帳を作る</a>
<ul class="allLists">
  {#each itemStore.items as item (item.id)}
    <li class="list">
      {#if isEditing === item.id}
        <input
          class="title"
          bind:value={item.displayName}
        />
        <div class="buttonSlot">
          <button onclick={() => (isEditing = '')}>edit_off</button>
          <button onclick={() => itemStore.removeItem(item.id)}>delete</button>
        </div>
      {:else}
        <span class="title">{item.displayName}</span>
        <div class="buttonSlot">
          <button onclick={() => (isEditing = item.id)}>edit</button>
          <button onclick={() => goto(`/${item.id}/`)}>play_arrow</button>
        </div>
      {/if}
    </li>
  {/each}
</ul>

<style lang="scss">
  .allLists {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .list {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 500px;
      max-width: calc(100vw - 28px);
      .title {
        font-size: 20px;
        &input {
          border-width: 0;
          border-bottom-width: 3px;
          padding: 0;
          margin: 0;
        }
      }
      .buttonSlot {
        display: flex;
        button {
          font-family: 'Material Icons Round', 'Zen Kaku Gothic New', sans-serif;
          height: 40px;
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
        }
      }
    }
  }
</style>
