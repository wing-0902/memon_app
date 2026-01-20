<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';
  import localforage from 'localforage';
  import { onMount } from 'svelte';
  import { nowCorrectAnswers } from '$lib/data/answering.svelte';

  let targetId = $derived(page.params.slug);
  let quizNum = $derived(Number(page.params.num));

  // qFromをリアクティブな変数として宣言
  let qFrom = $state<string | null>(null);
  let totalQuizCount = $state<number>(0);

  const targetItem = $derived(itemStore.items.find((i) => i.id === targetId));

  // データ取得などの非同期処理をonMountにまとめる
  onMount(async () => {
    if (!targetItem) {
      goto('/');
      return;
    }

    if (quizNum === 1) { // 比較は === を使用
      nowCorrectAnswers.list = [];
    }

    // localforageから値を取得（awaitが必要）
    qFrom = await localforage.getItem<string>('どっちからか');
    const storedCount = await localforage.getItem<number>('テストの出題数');
    totalQuizCount = storedCount || 0;
  });

  // wordStore初期化
  $effect(() => {
    if (targetId) {
      wordStore.load(targetId);
    }
  });

  // 全部終わった場合の判定（値が取得できた後に実行）
  $effect(() => {
    if (totalQuizCount > 0 && quizNum > totalQuizCount) {
      goto(`/${targetId}/play/complete/`);
    }
  });

  let omoteAnswer: string = $derived(wordStore.words[quizNum - 1].front);
  let uraAnswer: string = $derived(wordStore.words[quizNum - 1].back);
  let answeringText: string = $state('');

  let 正誤判定: string = $state('');
  let 手動判定: boolean = $state(false)

  function checkAns() {
    const answeringWord = answeringText;
    let correctAns = '';

    if (qFrom === 'omote') {
      correctAns = uraAnswer;
    } else {
      correctAns = omoteAnswer;
    }

    if (answeringWord === correctAns) {
      正誤判定 = '正解';
    } else {
      手動判定 = true;
    }
  }

  function handleCorrect() {
    正誤判定 = '正解';
    手動判定 = false;
  }
  function handleWrong() {
    正誤判定 = '不正解';
    手動判定 = false;
  }

  function handleNext() {

  }
</script>

<div class="root">
  <h2>Q.{quizNum}</h2>

  {#if qFrom === 'omote'}
    <small>おもて から</small>
  {:else if qFrom === 'ura'}
    <small>うら から</small>
  {/if}
  
  {#if wordStore.words[quizNum - 1]}
    {#if qFrom === 'omote'}
      <p>{omoteAnswer}</p>
    {:else if qFrom === 'ura'}
      <p>{uraAnswer}</p>
    {/if}
    <input type='text' bind:value={answeringText} />
  {/if}
  <br/>
  <button onclick={checkAns}>
    答え合わせ
  </button><br/>

  <br/>
  {正誤判定}<br/>


  {#if 手動判定}
    <button onclick={handleCorrect}>正解</button>
    <button onclick={handleWrong}>間違い</button><br/>
  {/if}

  {#if 正誤判定 === '正解'}
    <br/>
    <button onclick={handleNext}>
      次の問題に進む
    </button>
  {/if}
</div>