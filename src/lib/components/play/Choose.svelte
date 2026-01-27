<script lang="ts">
  import { page } from '$app/state';
  import { wordStore } from '$lib/data/words.svelte';
  import { onMount } from 'svelte';
  import localforage from 'localforage';
  import { getRandomElements } from '$lib/func/rand';

  let { onUpdate } = $props();

  let qFrom = $state<string | null>(null);
  let totalQuizCount = $state<number>(0);

  let targetId = $derived(page.params.slug);
  let quizNum = $derived(Number(page.params.num) || 1); // １から

  onMount(async () => {
    qFrom = await localforage.getItem<string>('どっちからか');
    const storedCount = await localforage.getItem<number>('テストの出題数');
    totalQuizCount = storedCount || 0; // １から
  });

  // wordStore初期化
  $effect(() => {
    if (targetId) {
      wordStore.load(targetId);
    }
  });

  const 選択肢用配列 = $derived.by(() => {
    if (totalQuizCount === 0) return [];

    // 1. ベースの配列を取得
    let elements = getRandomElements(totalQuizCount, Math.min(5, totalQuizCount));

    // 2. quizNumが含まれていなければ、最後を差し替える
    if (!elements.includes(quizNum)) {
      elements = [...elements];
      elements[elements.length - 1] = quizNum;
    }

    // 3. 配列をシャッフル（Fisher-Yates アルゴリズム）
    // elementsをコピーしてから操作
    const shuffled = [...elements];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  });
</script>

{#each 選択肢用配列 as index}
  <button>{wordStore.words[index].front}</button>
{/each}