<script lang="ts">
  import { page } from '$app/state';
  import { wordStore } from '$lib/data/words.svelte';
  import { onMount } from 'svelte';
  import localforage from 'localforage';
  import { getRandomElements } from '$lib/func/rand';

  // propsとして受け取る
  let { onUpdate, quizListNum, totalQuizCount, disabled } = $props<{
    onUpdate: (v: string) => void;
    quizListNum: number;
    totalQuizCount: number;
    disabled: boolean;
  }>();

  let qFrom = $state<string | null>(null);

  onMount(async () => {
    qFrom = await localforage.getItem<string>('どっちからか');
    // totalQuizCountはpropsで受け取るのでここで取得しなくてOK（または予備として残す）
  });

  const 選択肢用配列: number[] = $derived.by(() => {
    // totalQuizCountが親から渡ってくるまで待機
    if (!totalQuizCount || !quizListNum) return [];

    // 1. 全範囲からランダムに取得
    let elements = getRandomElements(totalQuizCount, Math.min(5, totalQuizCount));

    // 2. 「現在の正解(quizListNum)」が含まれているかチェック
    if (!elements.includes(quizListNum)) {
      elements = [...elements];
      elements[elements.length - 1] = quizListNum;
    }

    // 3. シャッフル
    const shuffled = [...elements];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  });
</script>

{#if qFrom && wordStore.words.length > 0}
  <div class="choices">
    {#each 選択肢用配列 as index}
      {@const word = wordStore.words[index - 1]}
      {#if word}
        <button onclick={() => onUpdate(qFrom === 'omote' ? word.back : word.front)} disabled={disabled}>
          {qFrom === 'omote' ? word.back : word.front}
        </button>
      {/if}
    {/each}
  </div>
{/if}

<style lang="scss">
  .choices {
    display: flex;
    flex-direction: column;
    align-items: center;
    button {
      width: 420px;
      max-width: 100%;
      min-height: 40px;
      margin: 2px 0;
      border-radius: 10px;
      color: var(--theme);
      border: 1px solid var(--theme);
      background-color: transparent;
      &:hover {
        color: var(--background);
        background-color: var(--theme);
      }
      &:disabled {
        background-color: var(--background);
        color: gray;
        border-color: gray;
      }
    }
  }
</style>
