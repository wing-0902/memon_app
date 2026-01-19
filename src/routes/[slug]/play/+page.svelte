<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import localforage from 'localforage';

  let targetId = $derived(page.params.slug);

  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';
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
  let qFrom = $state('omote'); // omote or ura
  let qMode = $state('自己採点'); // 自己採点 or 選択肢 or 自動採点
  let qTurn = $state('１番から順に'); // １番から順に or シャッフル

  export function handleClick() {
    if (qCount <= 0) return;
    if (qCount > wordStore.words.length) return;

    localforage.setItem('テストの出題数', qCount);
    localforage.setItem('どっちからか', qFrom);
    localforage.setItem('採点モード', qMode);
    localforage.setItem('順番', qTurn);

    goto(`/${targetId}/play/1/`);
  }
</script>

<svelte:head>
  <title>{targetItem?.displayName}のテストを開始 | Memon</title>
</svelte:head>

<div class="root">
  <a
    class="returnLink"
    href="/{targetId}/">＜戻る</a
  >
  {#if targetItem}
    <h2>{targetItem.displayName}</h2>
    <small>{wordStore.words.length}個の単語</small>
    <h3>モードを設定</h3>
    <label for="qCount">問題数</label>
    <input
      id="qCount"
      bind:value={qCount}
      type="number"
    /><br />
    <br />
    {#if targetItem.is双方向}
      <button onclick={() => (qFrom = 'omote')}>おもて<small>から</small>うら</button>
      <button onclick={() => (qFrom = 'ura')}>うら<small>から</small>おもて</button><br />
    {/if}
    <button onclick={() => (qMode = '自己採点')}>自己採点</button>
    <button onclick={() => (qMode = '選択肢')}>選択肢</button>
    <button onclick={() => (qMode = '自動採点')}>自動採点（Beta）</button><br />
    <button onclick={() => (qTurn = '１番から順に')}>１番から順に</button>
    <button onclick={() => (qTurn = 'シャッフル')}>シャッフル</button><br />
    <br />
    <button
      class="icon"
      onclick={handleClick}>play_circle開始！</button
    >
  {/if}
</div>

<style lang="scss">
  .root {
    width: 100%;
    .returnLink {
      width: 100%;
      display: flex;
      justify-content: left;
      margin-left: 20px;
    }
  }
</style>
