<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const licenseTypes = Object.entries(data.licenses);
</script>

<h2>OSSライセンス</h2>
<p>本Appではサードパーティソフトウェアを使用しております．</p>

<div class="wrapper">
  {#if data.error}
    <p>{data.error}</p>
  {:else}
    {#each licenseTypes as [licenseName, packages]}
      <section class='typeList'>
        <h3 class='title'>{licenseName}</h3>
        <div class='any'>
          {#each packages as pkg}
            <button class='slot'>
              <div>
                <h4>{pkg.name}</h4>{pkg.version}
              </div>
            </button>
          {/each}
        </div>
      </section>
    {/each}
  {/if}
</div>

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
          display: flex;
          justify-content: space-between;
          align-items: center;
          backdrop-filter: brightness(1.04);
          background-color: transparent;
          border: none;
          color: var(--foreground);
          margin: 0;
          padding: 0 14px;

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
</style>
