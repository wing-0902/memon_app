<script lang="ts">
  import { goto } from '$app/navigation';
  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';
  import localforage from 'localforage';

  let isEditing: string = $state('');
  let editingName: string = $state('');

  function startEdit(item: { id: string; displayName: string }) {
    isEditing = item.id;
    editingName = item.displayName; // 現在の名前を初期値としてコピー
  }

  function saveEdit() {
    if (isEditing) {
      // ここで updateName を呼ぶことで、重複チェックが走る
      itemStore.updateName(isEditing, editingName);
    }
    isEditing = '';
  }

  async function handleRemove(itemId: string) {
    const checkResult = confirm('復元できませんが，本当に削除しますか？');
    if (checkResult) {
      try {
        itemStore.removeItem(itemId);
        if (wordStore.currentDeckId === itemId) {
          await wordStore.deleteCurrentDeck();
        } else {
          await localforage.removeItem(`words_${itemId}`);
        }
        isEditing = '';
      } catch (err) {
        console.error('error:', err);
      }
    } else {
      isEditing = '';
    }
  }
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
<button onclick={() => goto('/create/')} class="createNewLink">単語帳を作る</button><br />
<button onclick={() => goto('/import/')} class="createNewLink">インポート</button>

<ul class="allLists">
  {#each itemStore.items as item (item.id)}
    <li class="list">
      {#if isEditing === item.id}
        <input
          class="title"
          bind:value={editingName}
          onkeydown={(e) => e.key === 'Enter' && saveEdit()}
        />
        <div class="buttonSlot">
          <button onclick={saveEdit}>check</button>
          <button onclick={() => handleRemove(item.id)}>delete</button>
        </div>
      {:else}
        <span onclick={() => goto(`/${item.id}/`)} class="title">{item.displayName}</span>
        <div class="buttonSlot">
          <button onclick={() => startEdit(item)}>edit</button>
          <button onclick={() => goto(`/${item.id}/`)}>play_arrow</button>
        </div>
      {/if}
    </li>
  {/each}
</ul>

<style lang="scss">
  .createNewLink {
    height: 40px;
    width: 420px;
    max-width: 100%;
    color: var(--theme);
    background-color: transparent;
    border: 1px solid var(--theme);
    border-radius: 20px;
  }
  ul.allLists {
    margin: auto 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    li.list {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 500px;
      max-width: calc(100vw - 50px);
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
