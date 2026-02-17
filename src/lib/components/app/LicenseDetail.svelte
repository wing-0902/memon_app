<script lang="ts">
  import type { PnpmLicensePackage } from '$lib/types/pnpm';

  let {
    pkg,
    onclose
  }: {
    pkg: PnpmLicensePackage;
    onclose: () => void;
  } = $props();
</script>

<div class='root'>

</div>

<style lang="scss">
    .root {
        position: fixed;
        top: 50dvh;
        left: 50vw;
        transform: translate(-50%, -50%);
        border-radius: 30px;
        border: 1px solid color-mix(in srgb, var(--background), white 20%);
        background: var(--background);
        width: 600px;
        max-width: 100vw;
        height: 600px;
        max-height: 100dvh;
        z-index: 1000;
    }
</style>