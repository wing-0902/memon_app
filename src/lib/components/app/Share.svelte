<script lang="ts">
  import { fly } from 'svelte/transition';
  let { targetId } = $props();

  import { itemStore } from '$lib/data/list.svelte';
  import { wordStore } from '$lib/data/words.svelte';
  import { onMount } from 'svelte';

  let displayName = $derived(itemStore.items.find((i) => i.id === targetId)?.displayName);

  onMount(() => {
    wordStore.load(targetId);
  });
</script>

<div class="root" transition:fly={{ y: 200, duration: 500 }}>
  <h3>{displayName}を共有</h3>
  <div class="buttonSlot">
    <button>データを書き出す</button><br />
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
  .overray {
    backdrop-filter: brightness(40%);
    z-index: 400px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
    width: 100vw;
  }
</style>
