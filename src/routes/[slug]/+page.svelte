<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  let targetId = $derived(page.params.slug);

  import { itemStore } from '$lib/data/list.svelte';

  const targetItem = $derived(itemStore.items.find((i) => i.id === targetId));

  $effect(() => {
    if (targetId) {
      wordStore.load(targetId); // 初期化
    }
  });

  if (!targetItem) {
    goto('/');
  }

  import { wordStore } from '$lib/data/words.svelte';

  let omoteWord = $state('');
  let uraWord = $state('');
  let isAdding = $state(false);
  let frontInputEl = $state<HTMLInputElement | null>(null);

  async function handleAddWord() {
    if (!omoteWord || !uraWord) {
      return;
    } else {
      isAdding = true;
      try {
        // Storeの関数を呼ぶ
        await wordStore.addWord(omoteWord, uraWord);

        // 入力をリセット
        omoteWord = '';
        uraWord = '';

        // 次の入力のために「表」の入力欄にフォーカスを戻す
        frontInputEl?.focus();
      } finally {
        isAdding = false;
      }
    }
  }

  async function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleAddWord();
    } else return;
  }

  let wordEditing = $state(0);

  async function handleRemoveItem(id: string) {
    wordEditing = 0;
    wordStore.removeWord(id);
  }
</script>

<svelte:head>
  <title>{targetItem?.displayName} | Memon</title>
</svelte:head>

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
        <label><input type="checkbox" bind:checked={targetItem.is双方向} />双方向に出題</label>
      </li>
    </ul>
    <button class="icon" onclick={() => goto(`/${targetId}/play/`)}>
      play_arrowテストを開始
    </button>
    <h3>単語帳</h3>
    <ul>
      <li class="addNew">
        <input
          type="text"
          placeholder="おもて（問）"
          bind:value={omoteWord}
          bind:this={frontInputEl}
        />
        <input
          type="text"
          placeholder="うら（答）"
          bind:value={uraWord}
          onkeydown={handleKeyDown}
        />
        <button disabled={!omoteWord || !uraWord} onclick={handleAddWord}>add</button>
      </li>
    </ul>
    <p>{wordStore.words.length}個の単語を表示中</p>
    <table class="listT">
      <tbody>
        <tr>
          <th>No.</th>
          <th>おもて</th>
          <th>うら</th>
          <th colspan="2"></th>
        </tr>
        {#each wordStore.words as word, i}
          <tr
            class="list"
            class:正解={word.lastResult === true}
            class:間違い={word.lastResult === false}
          >
            <td class="l1"><span class="number">#{i + 1}</span></td>
            {#if wordEditing !== i + 1}
              <td class="l2"><strong class="front">{word.front}</strong></td>
              <td class="l2"><span class="back">{word.back}</span></td>
              <td class="l3" colspan="2"
                ><button onclick={() => (wordEditing = i + 1)}>edit</button></td
              >
            {:else}
              <td class="l6"><input bind:value={word.front} type="text" /></td>
              <td class="l6"><input bind:value={word.back} type="text" /></td>
              <td class="l4"><button onclick={() => (wordEditing = 0)}>edit_off</button></td>
              <td class="l5"><button onclick={() => handleRemoveItem(word.id)}>delete</button></td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style lang="scss">
  .root {
    width: 100%;
    ul {
      list-style: none;
      padding: 0;
      width: 100%;

      li.addNew {
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
    .listT {
      width: 100%;
      tr {
        height: 40px;
        th {
          border-bottom: 2px solid var(--foreground);
        }
        td {
          border-bottom: 0.1px solid var(--foreground);
          button {
            font-family: 'Material Icons Round', sans-serif;
          }
        }
        &.list {
          width: 100%;
          &.正解 {
            background-color: rgba(135, 207, 235, 0.53);
          }
          &.間違い {
            background-color: rgba(255, 0, 0, 0.53);
          }
          .l1 {
            width: 60px;
          }
          .l2 {
            width: calc(50vw - 140px);
          }
          .l3 {
            width: 150px;
          }
          .l4,
          .l5 {
            width: 75px;
          }
          .l6 {
            input {
              max-width: calc(50vw - 40px);
            }
          }
        }
      }
    }
  }
</style>
