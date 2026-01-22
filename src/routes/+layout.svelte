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

  // onMount
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  onMount(() => {
    goto('/');
  });

  // PWA
  import { pwaInfo } from 'virtual:pwa-info';

	let webManifestLink = $state( pwaInfo ? pwaInfo.webManifest.linkTag : '');

  onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					console.log('SW Registered: ', r);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				}
			});
		}
	});
</script>

<svelte:head>
  <meta name="generator" content="SvelteKit {SVELTEKIT_VERSION}" />
  {@html webManifestLink}
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
    .slot {
      margin: auto 13px;
    }
  }
</style>
