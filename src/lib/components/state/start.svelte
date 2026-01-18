<script lang="ts">
  let visible = $state(false);
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  onMount(() => {
    visible = localStorage.getItem('alreadyGuided') !== 'true';
  });
</script>

<div class="root">
  {#if visible}
    <div
      class="guideWindow"
      transition:fly={{ y: 20, duration: 500 }}
    >
      <h2>ようこそ</h2>
      <p>Memonをご案内します．</p>
    </div>
  {/if}
</div>

<style lang="scss">
  .root {
    .guideWindow {
      position: fixed;
      height: 600px;
      max-height: 100dvh;
      width: 600px;
      max-width: 100vw;
      top: 50dvh;
      left: 50vw;
      transform: translate(-50%, -50%);
      backdrop-filter: blur(10px) brightness(90%);
      border: 1px solid var(--background);
      border-radius: 40px 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  }
</style>
