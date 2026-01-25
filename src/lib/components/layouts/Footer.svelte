<script lang="ts">
  let isPWA = $state(false);

  $effect(() => {
    const checkPWA = () => {
      isPWA =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches;
    };

    checkPWA();

    // モード変更を監視（オプション）
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkPWA);

    return () => mediaQuery.removeEventListener('change', checkPWA);
  });
</script>

<footer class="footer">
  <p>Memon App v{__APP_VERSION__}</p>
  {#if isPWA}
    <p>Working on standalone mode</p>
  {/if}
  <p>
    Released under <a href="https://opensource.org/license/bsd-3-clause" target="_blank"
      >The 3-Clause BSD License</a
    >.
  </p>
  <p>Copyright &copy; 2025-2026 Tsubasa T.</p>
  <p>
    <a href="/THIRD_PARTY/">OSS Licenses</a>・<a
      href="https://github.com/wing-0902/memon_app"
      target="_blank">Source Code</a
    >
  </p>
  <p><a href="/info/">About This App</a></p>
</footer>

<style lang="scss">
  .footer {
    text-align: center;
  }
</style>
