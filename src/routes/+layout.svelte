<script lang="ts">
  let { children } = $props();

  import { VERSION as SVELTEKIT_VERSION } from '@sveltejs/kit';
</script>

<svelte:head>
  <meta name='generator' content='SvelteKit {SVELTEKIT_VERSION}' />
</svelte:head>

{@render children()}
