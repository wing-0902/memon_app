<script lang="ts">
  import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
  import { page } from '$app/state';
  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';
  import localforage from 'localforage';
  import { onMount } from 'svelte';
  import { nowCorrectAnswers } from '$lib/data/answering.svelte';
  import { sleep } from '$lib/func/sleep';
  import Choose from '$lib/components/play/Choose.svelte';

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
  let 遷移中: boolean = $state(false);
  let answerDisabled: boolean = $state(false);
  // 遷移後に初期化が必要なやつ　おわり

  // focus用
  let formInputEl = $state<HTMLInputElement | null>(null);

  // 遷移後の初期化
  beforeNavigate(() => {
    answerDisabled = false;
  })
  afterNavigate(async () => {
    answerDisabled = false;
    answeringText = '';
    正誤判定 = '';
    手動判定 = false;
    解き終わりました = false;
    答え合わせを開始 = false;
    formInputEl?.focus();
    遷移中 = false;
  });

  // onClick
  function checkAns() {
    if (遷移中 === true) {
      return;
    }
    const answeringWord = answeringText;
    if (!answeringWord.trim()) {
      return;
    }
    let correctAns = '';
    答え合わせを開始 = true;
    answerDisabled = true;

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
    skip();
  }

  function skip() {
    if (quizNum >= totalQuizCount) {
      遷移中 = true;
      goto(`/${targetId}/play/complete/`);
    } else {
      遷移中 = true;
      goto(`/${targetId}/play/${quizNum + 1}`);
    }
  }

  async function handleKeyDownToNext(event: KeyboardEvent) {
    if (遷移中 === true) {
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (checkAns() === '正解') {
        遷移中 = true;
        await sleep(700);
        handleNext();
      }
    }
  }

  async function handleChoose(v: string) {
    answeringText = v;
    if (checkAns() === '正解') {
      遷移中 = true;
      await sleep(700);
      handleNext()
    } else {
      handleWrong();
    };
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
    {#if localStorage.getItem('採点モード') === '選択肢'}
      <Choose {quizListNum} totalQuizCount={wordStore.words.length} disabled={answerDisabled} onUpdate={(v: string) => handleChoose(v)} />
    {:else}
      <input
        type="text"
        bind:value={answeringText}
        onkeydown={handleKeyDownToNext}
        bind:this={formInputEl}
        autocomplete="one-time-code"
        autocorrect="off"
        autocapitalize="none"
        spellcheck="false"
        class="ans"
        disabled={answerDisabled}
      />
    {/if}
  {/if}
  <br />
  {#if !答え合わせを開始}
    <button class="handleButton skip" onclick={skip}>スキップ</button><br />
    <button class="handleButton check" onclick={checkAns}> 答え合わせ </button><br />
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
    <button onclick={handleNext} class='goToNext'> 次の問題に進む </button>
  {/if}
</div>

<style lang="scss">
  .root {
    width: 100%;
    .ans,
    .handleButton {
      width: 420px;
      max-width: 100%;
    }
    .ans {
      margin-bottom: 4px;
    }
    .handleButton {
      margin: 0;
      height: 40px;
      color: var(--theme);
      border: 1px solid var(--theme);
      background-color: var(--background);
      &:hover {
        color: var(--background);
        background-color: var(--theme);
      }
      &.skip {
        border-radius: 20px 20px 0 0;
        border-bottom-width: 0.5px;
      }
      &.check {
        border-radius: 0 0 20px 20px;
        border-bottom-width: 0.5px;
      }
    }
    .goToNext {
      height: 40px;
      width: 420px;
      max-width: 100%;
      color: var(--theme);
      background-color: transparent;
      border: 1px solid var(--theme);
      border-radius: 20px;
      &:hover {
        color: var(--background);
        background-color: var(--theme);
      }
    }
  }
</style>
