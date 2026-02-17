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

<div class="root">
  <div class="head">
    <button class="icon" onclick={onclose}>close</button>
    <h4>{pkg.name}</h4>
    <a class="icon" href={pkg.homepage} target="_blank">open_in_new</a>
  </div>
  <div class="content"></div>
</div>

<style lang="scss">
  .root {
    --borderColor: color-mix(in srgb, var(--background), white 20%);

    position: fixed;
    top: 50dvh;
    left: 50vw;
    transform: translate(-50%, -50%);
    border-radius: 30px;
    border: 1px solid var(--borderColor);
    background: var(--background);
    width: 600px;
    max-width: 100vw;
    height: 600px;
    max-height: 100dvh;
    z-index: 1000;

    .head {
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 14px;
      .icon {
        font-family: 'Material Icons Round', monospace;
        font-size: 23px;
        text-decoration: none;

        background-color: transparent;
        backdrop-filter: brightness(105%);

        height: 40px;
        width: 40px;
        border-radius: 50%;

        border: 1px solid var(--borderColor);
        color: var(--foreground);

        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .content {
      height: calc(100% - 50px);
    }
  }
</style>
