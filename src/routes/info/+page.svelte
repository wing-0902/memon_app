<script lang="js">
  import { VERSION as SVELTEKIT_VERSION } from '@sveltejs/kit';

  import logo from '$lib/assets/LOGO.jpeg?enhanced';
</script>

<svelte:head>
  <title>技術仕様 | Memon</title>
</svelte:head>

<div class="root">
  <p>利用規約・ライセンスについては<a href="/policy/">こちら</a>をご覧ください．</p>
  <enhanced:img src={logo} alt="説明文" width="100" height="100" class="logoImg" />
  <h2>Memonについて</h2>
  <ul class="listL">
    <li>Version：{__APP_VERSION__}</li>
    <li>Package Name：{__APP_NAME__}</li>
    <li>Generator：SvelteKit {SVELTEKIT_VERSION}</li>
    <li>Production Env：Cloudflare Pages</li>
    <li>
      Homepage：<a href="https://memon.cards/" target="_blank">memon.cards</a>
    </li>
    <li>
      Repository：<a href='https://github.com/wing-0902/memon_app.git' target='_blank'>GitHub</a>
    </li>
  </ul>
  <h2>作者について</h2>
  <p>Tsubasa Terasawa</p>
  <ul class="listL">
    <li>Email：<a href="mailto:wing@me.wing.osaka">wing@me.wing.osaka</a></li>
    <li>
      GitHub：<a href="https://github.com/wing-0902" target="_blank">wing-0902</a>
    </li>
    <li>
      Homepage：<a href="https://wing.osaka/" target="_blank">wing.osaka</a>
    </li>
  </ul>
</div>

<style lang="scss">
  .root {
    .logoImg {
      max-width: calc(100vw - 20px);
      border-radius: 30px;
      object-fit: cover;
      height: auto;
    }
    ul.listL {
      list-style: none;

      padding-left: 0;
    }
  }
</style>
