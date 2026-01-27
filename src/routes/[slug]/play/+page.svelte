<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import localforage from 'localforage';

  let targetId = $derived(page.params.slug);

  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';
  import { nowCorrectAnswers } from '$lib/data/answering.svelte';
  import { getRandomElements } from '$lib/func/rand';
  const targetItem = $derived(itemStore.items.find((i) => i.id === targetId));

  // wordStore初期化
  $effect(() => {
    if (targetId) {
      wordStore.load(targetId);
    }
  });

  if (!targetItem) {
    goto('/');
  }

  let qCount = $state(Math.min(20, wordStore.words.length));
  let qFrom: string = $state('omote'); // omote or ura
  let qMode = $state('自己採点'); // 自己採点 or 選択肢 or 自動採点

  export function handleClick() {
    if (qCount <= 0) return;
    if (qCount > wordStore.words.length) return;

    localforage.setItem('テストの出題数', qCount);
    localforage.setItem('どっちからか', qFrom);
    localforage.setItem('採点モード', qMode);

    nowCorrectAnswers.todo = getRandomElements(wordStore.words.length, qCount);

    goto(`/${targetId}/play/1/`);
  }
</script>

<svelte:head>
  <title>{targetItem?.displayName}のテストを開始 | Memon</title>
</svelte:head>

<div class="root">
  {#if targetItem}
    <h2>{targetItem.displayName}</h2>
    <small>{wordStore.words.length}個の単語</small>
    <h3>モードを設定</h3>
    <label for="qCount">問題数</label>
    <input id="qCount" bind:value={qCount} type="number" /><br />
    <br />
    {#if targetItem.is双方向}
      <div class="configRow fromTo">
        <button onclick={() => (qFrom = 'omote')} class:this={qFrom === 'omote'}
          >おもて<small>から</small>うら</button
        >
        <button onclick={() => (qFrom = 'ura')} class:this={qFrom === 'ura'}
          >うら<small>から</small>おもて</button
        >
      </div>
      <br />
    {/if}
    <div class="configRow autoMode">
      <button onclick={() => (qMode = '自己採点')} class:this={qMode === '自己採点'}
        >自己採点</button
      >
      <button onclick={() => (qMode = '選択肢')} class:this={qMode === '選択肢'}>選択肢</button>
      <button onclick={() => (qMode = '自動採点')} class:this={qMode === '自動採点'}
        >自動採点（Beta）</button
      >
    </div>
    <br />
    <button class="icon" onclick={handleClick}>play_circle開始！</button>
  {/if}
</div>

<style lang="scss">
  .root {
    width: 100%;
    .configRow {
      width: 100%;
      padding: 0;
      display: flex;
      justify-content: center;
      &.fromTo {
        button {
          width: 300px;
          max-width: 50%;
        }
      }
      &.autoMode {
        button {
          width: 200px;
          max-width: 33%;
        }
      }
      button {
        padding: 0;
        margin: 0;
        border: 1px solid var(--theme);
        border-radius: 0;
        background: transparent;
        color: var(--theme);
        &:nth-child(1) {
          border-radius: 10px 0 0 10px;
        }
        &:nth-last-child(1) {
          border-radius: 0 10px 10px 0;
        }
        &.this {
          color: var(--background);
          background: var(--theme);
        }
      }
    }
  }
</style>
