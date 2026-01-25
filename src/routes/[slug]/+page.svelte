<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { fade, fly } from 'svelte/transition';

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
  let frontInputEl = $state<HTMLTextAreaElement | null>(null);

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
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAddWord();
    } else return;
  }

  let wordEditing = $state(0);

  async function handleRemoveItem(id: string) {
    const checkResult = confirm('本当にこの単語を削除しますか？');
    if (checkResult) {
      await wordStore.removeWord(id);
      wordEditing = 0;
    }
  }
</script>

<svelte:head>
  <title>{targetItem?.displayName} | Memon</title>
</svelte:head>

<div class="root">
  {#if targetItem}
    <button class="h2T">
      <h2>{targetItem.displayName}</h2>
    </button>
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
        <textarea placeholder="おもて（問）" bind:value={omoteWord} bind:this={frontInputEl}
        ></textarea>
        <textarea placeholder="うら（答）" bind:value={uraWord} onkeydown={handleKeyDown}
        ></textarea>
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
          <!-- <th colspan="2"></th> -->
        </tr>
        {#each wordStore.words as word, i}
          <tr
            class="list"
            class:正解={word.lastResult === true}
            class:間違い={word.lastResult === false}
            onclick={() => (wordEditing = i + 1)}
          >
            <td class="l1"><span class="number">#{i + 1}</span></td>
            <td class="l2"><strong class="front">{word.front}</strong></td>
            <td class="l2"><span class="back">{word.back}</span></td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

{#if wordEditing !== 0 && wordEditing - 1 < wordStore.words.length}
  <div class="pWind" transition:fly={{ y: 200, duration: 500 }}>
    <h3>詳細</h3>
    <label for="変更ウィンドウのおもて">おもて</label>
    <textarea id="変更ウィンドウのおもて" bind:value={wordStore.words[wordEditing - 1].front}
    ></textarea>
    <br />
    <label for="変更ウィンドウのうら">うら</label>
    <textarea id="変更ウィンドウのうら" bind:value={wordStore.words[wordEditing - 1].back}
    ></textarea>
    <br />
    <button onclick={() => handleRemoveItem(wordStore.words[wordEditing - 1].id)}>単語を削除</button
    ><br />
    <button onclick={() => (wordEditing = 0)}>保存・閉じる</button>
  </div>
{/if}

{#if wordEditing !== 0}
  <div class="pOverlay" transition:fade onclick={() => (wordEditing = 0)}></div>
{/if}

<style lang="scss">
  .root {
    width: 100%;
    .h2T {
      background: transparent;
      border: none;
      color: var(--foreground);
    }
    ul {
      list-style: none;
      padding: 0;
      width: 100%;

      li.addNew {
        display: flex;
        justify-content: center;
        align-items: center;
        textarea {
          width: calc(50% - 60px);
          resize: none;
          height: 80px;
          text-align: center;
        }

        @media (max-width: 700px) {
          flex-direction: column;
          textarea {
            width: calc(100% - 60px);
          }
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
          white-space: pre-wrap;
          border-bottom: 0.1px solid var(--foreground);
        }
        &.list {
          width: 100%;
          &.正解 {
            background: linear-gradient(180deg, transparent, rgba(135, 207, 235, 0.73) 74%, rgba(135, 207, 235, 0.2));
          }
          &.間違い {
            background: linear-gradient(180deg, transparent, rgba(255, 142, 142, 0.73) 74%, rgba(255, 142, 142, 0.2));
          }
          .l1 {
            width: 60px;
          }
          .l2 {
            width: calc(50vw - 140px);
          }
        }
      }
    }
  }

  .pWind {
    position: fixed;
    top: 50dvh;
    left: 50vw;
    transform: translate(-50%, -50%);
    backdrop-filter: blur(15px) brightness(250%);
    border: 1.5px solid var(--background);
    border-radius: 10px;
    z-index: 600;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 700px;
    max-width: 100vw;
    textarea {
      resize: none;
      overflow-y: scroll;
      width: 500px;
      max-width: 100%;
      text-align: center;
      height: 120px;
    }
  }

  .pOverlay {
    backdrop-filter: brightness(40%);
    z-index: 400px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: 100vw;
  }
</style>
