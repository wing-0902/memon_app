<script lang="ts">
  let { children } = $props();

  import { VERSION as SVELTEKIT_VERSION } from '@sveltejs/kit';
  import '$lib/styles/globals.scss';

  import SetDisplayName from '$lib/components/state/setDisplayName.svelte';

  // フォント
  import '@fontsource/zen-kaku-gothic-new';
  import '@fontsource/zen-maru-gothic';

  // レイアウト
  import Header from '$lib/components/layouts/Header.svelte';
</script>

<svelte:head>
  <meta
    name="generator"
    content="SvelteKit {SVELTEKIT_VERSION}"
  />
</svelte:head>

<div class="root">
  <Header />
  {@render children()}
  <footer>
    Memon v{__APP_VERSION__}
  </footer>
  <SetDisplayName />
</div>
