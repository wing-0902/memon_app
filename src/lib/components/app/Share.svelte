<script lang="ts">
  import { fly } from 'svelte/transition';
  let { targetId } = $props();

  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';
  import type { Word } from '$lib/data/words.svelte';
  import { onMount } from 'svelte';

  let displayName = $derived(itemStore.items.find((i) => i.id === targetId)?.displayName);
  let dataRedaction = $state(false);

  onMount(() => {
    wordStore.load(targetId);
  });

  async function shareAsFile() {
    const rawData = wordStore.exportRawData(false) as Word[];
    const cleanedData = rawData.map(({ id, ...rest }) => {
      // idは常に除外済み（...restに含まれない）

      if (dataRedaction) {
        const { createdAt, lastSeen, lastResult, tryTimes, successTimes, ...withoutDates } = rest;
        return withoutDates;
      }

      return rest;
    });
    
    // 1. データを取得（文字列形式）
    const dataString = JSON.stringify(cleanedData);
    const fileName = `${displayName}.memondoc`;

    // 2. Blobオブジェクトを作成して、File
    // オブジェクトに変換
    const blob = new Blob([dataString], { type: 'application/json' });
    const file = new File([blob], fileName, { type: 'application/json' });

    // 3. Web Share API が利用可能か、かつファイルの共有に対応しているか確認
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${displayName}のエクスポート`,
          text: `${displayName}の単語帳をエクスポートします．`
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('共有に失敗しました:', error);
        }
      }
    } else {
      // 共有機能が使えないブラウザ（PCなど）の場合はダウンロードリンクを作成
      alert('このブラウザは共有シートに対応していません。ファイルをダウンロードします。');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
</script>

<div class="root" transition:fly={{ y: 200, duration: 500 }}>
  <h3>{displayName}を共有</h3>
  <label>
    <input type="checkbox" bind:checked={dataRedaction} />
    学習データを含めない
  </label><br />
  <div class="buttonSlot">
    <button onclick={shareAsFile}>データを書き出す</button><br />
    <button disabled>QRコードで転送</button>
  </div>
</div>

<style lang="scss">
  .root {
    position: fixed;
    top: 50dvh;
    left: 50vw;
    transform: translate(-50%, -50%);
    background-color: transparent;
    backdrop-filter: blur(15px) brightness(250%);
    border: 1.5px solid var(--background);
    border-radius: 10px;
    z-index: 600;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 700px;
    max-width: 100vw;
    .buttonSlot {
      margin-bottom: 10px;
      button {
        border: 1px solid var(--theme);
        color: var(--theme);
        background-color: transparent;
        height: 40px;
        width: 210px;
        max-width: 100%;
        &:nth-child(1) {
          border-radius: 10px 10px 0 0;
          border-bottom-width: 0.5px;
        }
        &:nth-last-child(1) {
          border-radius: 0 0 10px 10px;
          border-bottom-width: 0.5px;
        }
        &:hover {
          background-color: var(--theme);
          color: var(--background);
        }
      }
    }
  }
</style>
