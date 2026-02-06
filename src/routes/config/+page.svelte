<script lang="ts">
  import { onMount } from 'svelte';
  import { getMoreDetailed } from '$lib/data/getDetail';
  import { IpService } from '$lib/func/getIp';
  import { isModelLoaded, initModel } from '$lib/components/app/webllm-model';

  let isPWA = $state(false);
  let v4Ip = $state('0.0.0.0');
  let v6Ip = $state('::1');
  let persistentMessage: string = $state('無効');

  onMount(() => {
    isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches;
  });

  let usageMB: number | null = $state(null);
  let quotaMB: number | null = $state(null);

  onMount(async () => {
    // IP
    const ipService = new IpService();
    const ips = await ipService.fetchAllIps();

    v4Ip = ips.ipv4;
    v6Ip = ips.ipv6;

    // 永続化
    const isPersisted = await navigator.storage.persisted();
    persistentMessage = isPersisted ? '有効' : '無効';

    // ストレージ
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

  // LLM
  let modelStatus = $state(isModelLoaded() ? 'loaded' : 'idle');
  let downloadProgress = $state(0);

  async function handleDownload() {
    if (modelStatus === 'loaded') return;
    
    modelStatus = 'downloading';
    try {
      await initModel((p) => {
        if (p.status === 'progress') {
          downloadProgress = p.progress;
        }
      });
      modelStatus = 'loaded';
      // ストレージ容量の表示を更新するために再計算
      updateStorageEstimate(); 
    } catch (e) {
      console.error(e);
      modelStatus = 'error';
    }
  }

  // ストレージ情報の更新を関数化
  async function updateStorageEstimate() {
    if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
      const estimate = await navigator.storage.estimate();
      usageMB = estimate.usage !== undefined ? estimate.usage / 1024 ** 2 : null;
    }
  }
</script>

<svelte:head>
  <title>設定 | Memon</title>
</svelte:head>

<h2>設定</h2>

<div class="wrapper">
  <div class="root">
    <section>
      <h3>一般</h3>
      <button class="row" onclick={handleDownload} disabled={modelStatus === 'downloading'}>
        <h4>言語モデル</h4>
        <p>
          {#if modelStatus === 'loaded'}
            Xenova/stsb-xlm-r-multilingual
          {:else if modelStatus === 'downloading'}
            ダウンロード中... {downloadProgress.toFixed(1)}%
          {:else if modelStatus === 'error'}
            エラー（再試行）
          {:else}
            ダウンロード（約50MB）
          {/if}
        </p>
      </button>
    </section>
    <section>
      <h3>システム</h3>
      {#if usageMB !== null && quotaMB !== null}
        <button class="row">
          <h4>ストレージ</h4>
          <p>
            {getMoreDetailed(usageMB)}MB / {getMoreDetailed(quotaMB)}MB （{percentage.toFixed(1)}%）
          </p>
        </button>
      {/if}
      <button class="row" onclick={async () => navigator.storage.persist()}>
        <h4>ストレージ永続化</h4>
        <p>{persistentMessage}</p>
      </button>
      <button class="row">
        <h4>動作モード</h4>
        <p>
          {#if isPWA}
            ウェブアプリ
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
    <section>
      <h3>環境</h3>
      <button class="row">
        <h4>エージェント</h4>
        <p>{navigator.userAgent}</p>
      </button>
      <button class="row">
        <h4>CPU</h4>
        <p>
          {#if navigator.platform}
            {navigator.platform},
          {/if}
          {navigator.hardwareConcurrency} Cores
        </p>
      </button>
      {#if (navigator as any).deviceMemory}
        <button class="row">
          <h4>メモリ</h4>
          <p>
            {(navigator as any).deviceMemory}GB RAM
          </p>
        </button>
      {/if}
      {#if v4Ip !== '0.0.0.0'}
        <button class="row">
          <h4>IPv4</h4>
          <p>{v4Ip}</p>
        </button>
        {#if v6Ip !== '::1' && v6Ip !== v4Ip}
          <button class="row">
            <h4>IPv6</h4>
            <p>{v6Ip}</p>
          </button>
        {/if}
      {/if}
      <button class="row">
        <h4>解像度</h4>
        <p>{window.screen.width} x {window.screen.height}</p>
      </button>
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
          align-items: center;
          backdrop-filter: brightness(1.04);
          background-color: transparent;
          border: none;
          color: var(--foreground);
          margin: 0;
          padding: 0 14px;
          h4 {
            margin: 0;
            white-space: nowrap;
          }
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
