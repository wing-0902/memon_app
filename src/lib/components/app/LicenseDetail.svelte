<script lang="ts">
  import { fly } from 'svelte/transition';
  import type { PnpmPackageWithDetails } from '$lib/types/pnpm';

  let {
    pkg,
    onclose
  }: {
    pkg: PnpmPackageWithDetails;
    onclose: () => void;
  } = $props();

  const pJson = pkg.rawPackageJson;
</script>

<div class="root" transition:fly={{ y: 500, duration: 500 }}>
  <div class="head">
    <button class="icon" onclick={onclose}>close</button>
    <h4>{pkg.name}</h4>
    <a class="icon" href={pkg.homepage} target="_blank">open_in_new</a>
  </div>
  <div class="content">
    <section>
      <h3>一般</h3>
      <button>
        <h4>名称</h4>
        <p>{pkg.name}</p>
      </button>
      <button>
        <h4>バージョン</h4>
        <p>{pkg.versions}</p>
      </button>
      <button>
        <h4>ライセンス</h4>
        <p>{pkg.license}</p>
      </button>
      {#if pJson?.homepage}
        <button>
          <h4>ホームページ</h4>
          <p>{pJson.homepage}</p>
        </button>
      {/if}
    </section>

    <section>
      <h3>発行者情報</h3>
      {#if pJson?.author}
        {#if typeof pJson.author === 'object'}
          {#if pJson.author.name}
            <button>
              <h4>名前</h4>
              <p>{pJson.author.name}</p>
            </button>
          {/if}
          {#if pJson.author.email}
            <button>
              <h4>電子メイル</h4>
              <p>{pJson.author.email}</p>
            </button>
          {/if}
          {#if pJson.author.url}
            <button>
              <h4>ウェブサイト</h4>
              <p>{pJson.author.url}</p>
            </button>
          {/if}
        {:else if typeof pJson.author === 'string'}
          <button>
            <h4>発行者</h4>
            <p>{pJson.author}</p>
          </button>
        {/if}
      {:else if pkg.author}
        <button>
          <h4>発行者</h4>
          <p>{pkg.author}</p>
        </button>
      {/if}
    </section>

    <section>
      <h3>技術仕様</h3>
      {#if pJson?.repository}
        {#if pJson?.repository.url}
          <button>
            <h4>リポジトリ</h4>
            <p>{pJson.repository.url}</p>
          </button>
        {/if}
        {#if pJson?.bugs}
          <button>
            <h4>バグ報告</h4>
            <p>{pJson.bugs.url}</p>
          </button>
        {/if}
      {/if}
      <button>
        <h4>JSタイプ</h4>
        <p>{pJson?.type || "commonjs"}</p>
      </button>
    </section>
    
    <section>
      <h3>ライセンス原文</h3>
      {#if pkg.licenseText}
        <pre>{pkg.licenseText}</pre>
      {:else}
        <p>原文が見つかりませんでした．</p>
      {/if}
    </section>
  </div>
</div>

<style lang="scss">
  .root {
    --borderColor: color-mix(in srgb, var(--background), white 20%);

    position: fixed;
    top: 50dvh;
    left: 50vw;
    transform: translate(-50%, -50%);
    border-radius: 30px;
    border: 1px solid var(--borderColor);
    background: var(--background);
    width: 600px;
    max-width: 100vw;
    height: 600px;
    max-height: 100dvh;
    z-index: 1000;

    .head {
      width: 100%;
      box-sizing: border-box;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 14px;
      .icon {
        font-family: 'Material Icons Round', monospace;
        font-size: 23px;
        text-decoration: none;

        background-color: transparent;
        backdrop-filter: brightness(105%);

        height: 40px;
        width: 40px;
        border-radius: 50%;

        border: 1px solid var(--borderColor);
        color: var(--foreground);

        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .content {
      width: 100%;
      box-sizing: border-box;
      height: calc(100% - 50px);
      overflow-y: scroll;
      padding: 0 14px;

      section {
        width: 100%;
        box-sizing: border-box;
        h3 {
          text-align: left;
        }
        button {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          backdrop-filter: brightness(1.04);
          background: transparent;
          border: none;
          color: var(--foreground);
          margin: 0;
          padding: 0 14px;

          min-height: 45px;

          h4,
          h5,
          p {
            margin: 10px 0;
          }
          h4,
          h5 {
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
