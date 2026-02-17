<script lang="ts">
  import type { PageData } from './$types';
  import { fade, fly } from 'svelte/transition';
  import LicenseDetail from '$lib/components/app/LicenseDetail.svelte';

  let { data }: { data: PageData } = $props();

  const licenseTypes = Object.entries(data.licenses);

  type PnpmPackage = PageData['licenses'][string][number];

  let selectedPkg = $state<PnpmPackage | null>(null);
</script>

<svelte:head>
  <title>OSSライセンス | Memon</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<h2>OSSライセンス</h2>
<p>本Appではサードパーティソフトウェアを使用しております．</p>

<div class="wrapper">
  {#if data.error}
    <p>{data.error}</p>
  {:else}
    {#each licenseTypes as [licenseName, packages]}
      <section class="typeList">
        <h3 class="title">{licenseName}</h3>
        <div class="any">
          {#each packages as pkg}
            <button class="slot" onclick={() => (selectedPkg = pkg)}>
              <div class="main">
                <div class="pkgName">
                  <h4>{pkg.name}</h4>
                  <span>@{pkg.versions}</span>
                </div>
                {#if pkg.author}
                  <small>{pkg.author}</small>
                {/if}
              </div>
              <span class="ico">arrow_forward_ios</span>
            </button>
          {/each}
        </div>
      </section>
    {/each}
  {/if}
</div>

{#if selectedPkg}
  <div transition:fly={{ y: 200, duration: 500 }}>
    <LicenseDetail pkg={selectedPkg} onclose={() => (selectedPkg = null)} />
  </div>
{/if}

{#if selectedPkg}
  <div class="overray" onclick={() => (selectedPkg = null)} transition:fade></div>
{/if}

<style lang="scss">
  .wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .typeList {
      width: 100%;
      max-width: 600px;
      .title {
        text-align: left;
      }
      .any {
        .slot {
          width: 100%;
          min-height: 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          backdrop-filter: brightness(1.04);
          background-color: transparent;
          border: none;
          color: var(--foreground);
          margin: 0;
          padding: 5px 14px;

          .main {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: baseline;
            height: 100%;
            .pkgName {
              display: flex;
              margin: 0;
              padding: 0;
              h4,
              span {
                margin: 0;
              }
            }
            small {
              margin: 0;
            }
          }
          .ico {
            font-family: 'Material Icons Round', sans-serif;
          }

          border-radius: 0;
          &:nth-child(1) {
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

  .overray {
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: 100vw;
    background: transparent;
    backdrop-filter: brightness(50%);
    x-index: 500;
  }
</style>
