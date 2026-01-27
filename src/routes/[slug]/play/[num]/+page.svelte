<script lang="ts">
  import { beforeNavigate, goto } from '$app/navigation';
  import { page } from '$app/state';
  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';
  import localforage from 'localforage';
  import { onMount } from 'svelte';
  import { nowCorrectAnswers } from '$lib/data/answering.svelte';
  import { sleep } from '$lib/func/sleep';

  let targetId = $derived(page.params.slug);
  let quizNum = $derived(Number(page.params.num) || 1);
  let quizListNum = $derived(nowCorrectAnswers.todo[quizNum - 1]);

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

    if (quizNum === 1) {
      nowCorrectAnswers.list = [];
      nowCorrectAnswers.wrongList = [];
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
  // これ動いてないのなんで？
  $effect(() => {
    if (totalQuizCount > 0 && quizNum > totalQuizCount) {
      goto(`/${targetId}/play/complete/`);
    }
  });

  let omoteAnswer: string = $derived(wordStore.words[quizListNum - 1].front);
  let uraAnswer: string = $derived(wordStore.words[quizListNum - 1].back);

  // 遷移後に初期化が必要なやつ
  let answeringText: string = $state('');
  let 正誤判定: string = $state('');
  let 手動判定: boolean = $state(false);
  let 解き終わりました: boolean = $state(false);
  let 答え合わせを開始: boolean = $state(false);
  // 遷移後に初期化が必要なやつ　おわり

  // focus用
  let formInputEl = $state<HTMLInputElement | null>(null);

  // 遷移前の初期化
  beforeNavigate(() => {
    answeringText = '';
    正誤判定 = '';
    手動判定 = false;
    解き終わりました = false;
    答え合わせを開始 = false;
    formInputEl?.focus();
  });

  // onClick
  function checkAns() {
    const answeringWord = answeringText;
    if (!answeringWord.trim()) {
      return;
    }
    let correctAns = '';
    答え合わせを開始 = true;

    if (qFrom === 'omote') {
      correctAns = uraAnswer;
    } else {
      correctAns = omoteAnswer;
    }

    if (answeringWord === correctAns) {
      正誤判定 = '正解';
      return '正解';
    } else {
      手動判定 = true;
      return '正解ではありません';
    }
  }

  function handleCorrect() {
    正誤判定 = '正解';
    手動判定 = false;
    解き終わりました = true;
  }
  function handleWrong() {
    正誤判定 = '不正解';
    手動判定 = false;
    解き終わりました = true;
  }

  function handleNext() {
    if (正誤判定 === '正解') {
      nowCorrectAnswers.list.push(quizListNum - 1);
    } else {
      nowCorrectAnswers.wrongList.push(quizListNum - 1);
    }
    if (quizNum >= totalQuizCount) {
      goto(`/${targetId}/play/complete/`);
    } else {
      goto(`/${targetId}/play/${quizNum + 1}`);
    }
  }

  async function handleKeyDownToNext(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (checkAns() === '正解') {
        await sleep(700);
        handleNext();
      }
    }
  }
</script>

<div class="root">
  <h2>Q.{quizNum}</h2>

  {#if qFrom === 'omote'}
    <small>おもて から</small>
  {:else if qFrom === 'ura'}
    <small>うら から</small>
  {/if}
  <br />

  {#if wordStore.words[quizListNum - 1]}
    {#if qFrom === 'omote'}
      <small>#{quizListNum}</small>
      <p>{omoteAnswer}</p>
    {:else if qFrom === 'ura'}
      <p>{uraAnswer}</p>
    {/if}
    <input
      type="text"
      bind:value={answeringText}
      onkeydown={handleKeyDownToNext}
      bind:this={formInputEl}
      autocomplete="one-time-code"
      autocorrect="off"
      autocapitalize="none"
      spellcheck="false"
    />
  {/if}
  <br />
  {#if !答え合わせを開始}
    <button onclick={checkAns}> 答え合わせ </button><br />
  {:else}
    <p>
      正答：
      <strong>
        {#if qFrom === 'omote'}
          {uraAnswer}
        {:else}
          {omoteAnswer}
        {/if}
      </strong>
    </p>
  {/if}

  <br />
  {正誤判定}<br />

  {#if 手動判定}
    <button onclick={handleCorrect}>正解</button>
    <button onclick={handleWrong}>間違い</button><br />
  {/if}

  {#if 正誤判定 === '正解' || 解き終わりました}
    <br />
    <button onclick={handleNext}> 次の問題に進む </button>
  {/if}
</div>
