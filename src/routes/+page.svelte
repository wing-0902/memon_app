<script lang="ts">
  import { itemStore } from '$lib/data/list.svelte';
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
<ul>
  {#each itemStore.items as item (item.id)}
    <li>
      <input bind:value={item.displayName} />
      <button onclick={() => itemStore.removeItem(item.id)}>削除</button>
    </li>
  {/each}
</ul>
