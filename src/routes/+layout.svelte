<script lang="ts">
  let { children } = $props();

  import { VERSION as SVELTEKIT_VERSION } from '@sveltejs/kit';
  import '$lib/styles/globals.scss';

  import Start from '$lib/components/state/start.svelte';

  // フォント
  import '@fontsource/zen-kaku-gothic-new';
  import '@fontsource/zen-maru-gothic';
</script>

<svelte:head>
  <meta
    name="generator"
    content="SvelteKit {SVELTEKIT_VERSION}"
  />
</svelte:head>

<div class="root">
  <Start />
  {@render children()}
</div>
