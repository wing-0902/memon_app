<script lang="ts">
  import { onMount } from 'svelte';
  import { getMoreDetailed } from '$lib/data/getDetail';

  let isPWA = $state(false);

  onMount(() => {
    isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches;
  });

  let usageMB: number | null = $state(null);
  let quotaMB: number | null = $state(null);

  onMount(async () => {
    if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
      try {
        const estimate = await navigator.storage.estimate();

        usageMB = estimate.usage !== undefined ? estimate.usage / 1024 ** 2 : null;
        quotaMB = estimate.quota !== undefined ? estimate.quota / 1024 ** 2 : null;
      } catch (e) {
        console.error('Storage estimate failed:', e);
      }
    }
  });

  // ストレージ使用率
  let percentage = $derived(
    usageMB !== null && quotaMB !== null && quotaMB > 0
      ? Math.min((usageMB / quotaMB) * 100, 100)
      : 0
  );
</script>

<svelte:head>
  <title>設定 | Memon</title>
</svelte:head>

<h2>設定</h2>

<div class="wrapper">
  <div class="root">
    <section>
      <h3>環境</h3>
      {#if usageMB !== null && quotaMB !== null}
        <button class="row">
          <h4>ストレージ</h4>
          <p>
            {getMoreDetailed(usageMB)}MB / {getMoreDetailed(quotaMB)}MB （{percentage.toFixed(1)}%）
          </p>
        </button>
      {/if}
      <button class="row">
        <h4>動作モード</h4>
        <p>
          {#if isPWA}
            スタンドアロン
          {:else}
            ブラウザ
          {/if}
        </p>
      </button>
      {#if !isPWA}
        <button class="row">
          <div></div>
          <p>Appをインストール</p>
        </button>
      {/if}
    </section>
  </div>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    justify-content: center;
    .root {
      width: 100%;
      max-width: 600px;
      display: block;
      text-align: left;
      section {
        width: 100%;
        .row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          backdrop-filter: brightness(1.04);
          background-color: transparent;
          border: none;
          color: var(--foreground);
          @media (prefers-color-scheme: dark) {
            backdrop-filter: brightness(1.5);
          }
          border-radius: 0;
          &:nth-child(2) {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
          }
          &:nth-last-child(1) {
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
          }
        }
      }
    }
  }
</style>
