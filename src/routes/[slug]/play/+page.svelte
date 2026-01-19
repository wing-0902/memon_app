<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  let targetId = $derived(page.params.slug);

  import { itemStore } from '$lib/data/list.svelte';
  const targetItem = $derived(itemStore.items.find((i) => i.id === targetId));

  if (!targetItem) {
    goto("/");
  }

  let qCount = $state(20);
  let qFrom = $state('omote');
  let qMode = $state('自己採点');
</script>

<svelte:head>
  <title>{targetItem?.displayName}のテストを開始 | Memon</title>
</svelte:head>

<div class='root'>
  {#if targetItem}
    <h2>{targetItem.displayName}</h2>
    <h3>モードを設定</h3>
    <label for='qCount'>問題数</label>
    <input id='qCount' bind:value={qCount} type="number" /><br/>
    <br/>
    {#if targetItem.is双方向}
      <button>おもて<small>から</small>うら</button>
      <button>うら<small>から</small>おもて</button><br/>
    {/if}
    <button>自己採点</button>
    <button>選択肢</button>
    <button>自動採点（Beta）</button><br/>
    <br/>
    <button class='icon' onclick={() => goto('')}>play_circle開始！</button>
  {/if}
</div>