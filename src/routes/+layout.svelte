<script lang="ts">
  let { children } = $props();

  import { VERSION as SVELTEKIT_VERSION } from '@sveltejs/kit';
  import '$lib/styles/globals.scss';

  import SetDisplayName from '$lib/components/state/setDisplayName.svelte';

  // フォント
  import '@fontsource/zen-kaku-gothic-new';
  import '@fontsource/zen-maru-gothic';
  import '@fontsource/material-icons-round';

  // レイアウト
  import Header from '$lib/components/layouts/Header.svelte';
  import Footer from '$lib/components/layouts/Footer.svelte';
</script>

<svelte:head>
  <meta name="generator" content="SvelteKit {SVELTEKIT_VERSION}" />
  <title>Memon</title>
</svelte:head>

<div class="root">
  <Header />
  <div class="slot">
    {@render children()}
  </div>
  <Footer />
  <SetDisplayName />
</div>

<style lang="scss">
  .root {
    margin: 0;
    .slot {
      margin: auto 0;
      min-height: 50dvh;
    }
  }
</style>
