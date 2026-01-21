<script lang="ts">
  // ストアのインポート
  import { nowCorrectAnswers } from '$lib/data/answering.svelte';
  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';

  // SvelteKit
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import localforage from 'localforage';

  let targetId = $derived(page.params.slug);
  const targetItem = $derived(itemStore.items.find((i) => i.id === targetId));

  // qFrom
  let qFrom = $state<string | null>(null);
  let totalQuizCount = $state<number>(0);

  onMount(async () => {
    qFrom = await localforage.getItem<string>('どっちからか');
    totalQuizCount = (await localforage.getItem<number>('テストの出題数')) || 0;
    if (!targetItem) {
      goto('/');
      return;
    }
  });

  // wordStore初期化
  $effect(() => {
    if (targetId) {
      wordStore.load(targetId);
    }
  });

  // 高さ
  let elementHeight = $state(0);
  let windowHeight = $state(0);

  // 保存アンド終了
  function saveAndFin() {
    const 正解一覧の添字 = nowCorrectAnswers.list;
    const 誤答一覧の添字 = nowCorrectAnswers.wrongList;

    const 現在時刻: number = Date.now();

    for (const index of 正解一覧の添字) {
      wordStore.words[index].tryTimes += 1;
      wordStore.words[index].successTimes += 1;
      wordStore.words[index].lastResult = true;
      wordStore.words[index].lastSeen = 現在時刻;
    }
    for (const index of 誤答一覧の添字) {
      wordStore.words[index].tryTimes += 1;
      wordStore.words[index].lastResult = false;
      wordStore.words[index].lastSeen = 現在時刻;
    }
    goto(`/${targetId}/`);
  }
</script>

<svelte:window bind:innerHeight={windowHeight} />

<div>
  <h2>結果</h2>
  <p>{targetItem?.displayName || ''}</p>
  <small>計{totalQuizCount}問</small><br />
  {#if qFrom === 'omote'}
    <small>おもて から</small>
  {:else if qFrom === 'ura'}
    <small>うら から</small>
  {/if}
  <br />

  {#if elementHeight >= windowHeight}
    <button onclick={saveAndFin}>保存して終了</button>
  {/if}

  <section bind:clientHeight={elementHeight}>
    <h3>間違えた単語</h3>
    <table>
      <thead>
        <tr>
          <td>番号</td>
          <td>おもて</td>
          <td>うら</td>
        </tr>
      </thead>
      <tbody>
        {#each nowCorrectAnswers.wrongList as listN}
          <tr>
            <td>{listN}</td>
            <td>{wordStore.words[listN].front}</td>
            <td>{wordStore.words[listN].back}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    <h3>正解した単語</h3>
    <table>
      <thead>
        <tr>
          <td>番号</td>
          <td>おもて</td>
          <td>うら</td>
        </tr>
      </thead>
      <tbody>
        {#each nowCorrectAnswers.list as listN}
          <tr>
            <td>{listN}</td>
            <td>{wordStore.words[listN].front}</td>
            <td>{wordStore.words[listN].back}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>

  <button onclick={saveAndFin}>保存して終了</button>
</div>
