<script lang="ts">
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  const licenseTypes = Object.entries(data.licenses);
</script>

<h2>OSSライセンス</h2>
<p>本Appではサードパーティソフトウェアを使用しております．</p>

{#if data.error}
  <p>{data.error}</p>
{:else}
  {#each licenseTypes as [licenseName, packages]}
    <section>
      <h2>{licenseName}</h2>
      <ul>
        {#each packages as pkg}
          <li>
            <strong>{pkg.name}</strong> ({pkg.version})
            <br />
            <small>{pkg.vendorUrl || 'URLなし'}</small>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
{/if}

<style lang="scss">
</style>
